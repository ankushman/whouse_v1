"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  ComposedChart, Bar, BarChart, Line, AreaChart, Area, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Truck, Waypoints, Clock, MapPin, AlertTriangle, CheckCircle2, XCircle, Timer, TrendingUp, Activity, Fuel,
  Package, Users, ClipboardList, Search, ArrowUpRight, ArrowDownRight, Eye, FileText, Wrench, ThermometerSun,
  CircleDot, ChevronRight, Gauge, Phone, RotateCcw, Loader2,
} from "lucide-react";

// ===== TYPES =====
interface YardTruck {
  id: string; plateNo: string; driverName: string; driverPhone: string; licenseNo: string;
  type: "spotter" | "shuttle" | "terminal-tractor" | "reach-truck" | "yard-mule" | "prime-mover";
  status: "active" | "idle" | "maintenance" | "refueling" | "off-shift" | "breakdown";
  fuelLevel: number; odometer: number; maxCapacity: number; currentLoad: number;
  warehouse: string; city: string; currentLocation: string; assignedDock: string;
  totalTrips: number; tripsToday: number; avgTripTime: number; avgFuelPerTrip: number;
  lastTripEnd: string; nextScheduled: string; shift: "morning" | "afternoon" | "night";
  tireCondition: string; batteryVoltage: number; engineHours: number;
}

interface DockOperation {
  id: string; dockNo: string; dockType: "inbound" | "outbound" | "cross-dock" | "staging";
  warehouse: string; city: string;
  vehicleNo: string; driverName: string; carrierName: string;
  status: "arriving" | "checking-in" | "docked" | "loading" | "unloading" | "inspecting" | "departing" | "completed" | "delayed";
  arrivalTime: string; startTime: string; endTime: string;
  loadType: string; palletCount: number; weightKg: number; trailerType: string;
  dockUtilization: number; priority: "express" | "standard" | "economy" | "emergency";
  assignedTruck: string; temperature: number; sealNo: string; remarks: string;
}

interface Trailer {
  id: string; plateNo: string; type: "flatbed" | "enclosed" | "refrigerated" | "tanker" | "curtainsider" | "container";
  size: string; maxWeight: number; currentWeight: number;
  status: "available" | "in-use" | "maintenance" | "empty-yard" | "loaded-yard" | "on-road";
  location: string; warehouse: string; city: string;
  lastInspection: string; nextInspection: string;
  condition: number; carrier: string; insuranceExpiry: string;
}

interface YardMovement {
  id: string; truckId: string; truckPlate: string; driverName: string;
  from: string; to: string; warehouse: string; city: string;
  startTime: string; endTime: string; duration: number; distance: number;
  loadWeight: number; loadType: string; priority: "high" | "medium" | "low";
  status: "in-progress" | "completed" | "delayed" | "cancelled";
  fuelUsed: number; incidents: number; waitingTime: number;
}

interface DockSchedule {
  id: string; dockNo: string; warehouse: string; city: string;
  timeSlot: string; carrierName: string; vehicleNo: string;
  loadType: string; expectedPallets: number; priority: string;
  status: "scheduled" | "checked-in" | "in-progress" | "completed" | "no-show" | "delayed";
  actualArrival: string; delayMinutes: number; assignedTruck: string;
}

// ===== CONSTANTS =====
const COLORS = { primary: "#059669", secondary: "#7c3aed", accent: "#ea580c", danger: "#dc2626", success: "#16a34a", info: "#2563eb", purple: "#9333ea", pink: "#db2777", teal: "#0d9488", amber: "#d97706" };

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
  const r = seededRandom(172);

  const driverFirstNames = ["Rajesh","Suresh","Mohan","Ravi","Amit","Vijay","Sunil","Deepak","Sanjay","Pradeep","Krishna","Anil","Ramesh","Mahesh","Ganesh","Dinesh","Naresh","Prakash","Harish","Kishore","Ashok","Manoj","Ajay","Vikram","Arun","Subhash","Dilip","Bhagwat","Prabhu","Thakur","Gopal","Lakshman","Raju","Soma","Tukaram","Balaji","Murugan","Kannan","Selvan","Kumar"];
  const driverLastNames = ["Yadav","Singh","Kumar","Sharma","Gupta","Patel","Joshi","Reddy","Nair","Pillai","Verma","Mishra","Pandey","Thakur","Chauhan","Rathore","Maurya","Kulkarni","Deshmukh","Iyer"];
  const carriers = ["BlueDart","Delhivery","DTDC","Ecom Express","XpressBees","Shadowfax","Spoton","Amazon Logistics","Flipkart Logistics","TCI Express","SafeExpress","Gati","Allcargo","VRL Logistics","Mahindra Logistics"];
  const dockNos = ["D-101","D-102","D-103","D-104","D-105","D-201","D-202","D-203","D-204","D-301","D-302","D-303"];
  const yardLocations = ["Yard A - North","Yard B - South","Yard C - East","Yard D - West","Staging Area 1","Staging Area 2","Weighbridge","Fuel Station","Wash Bay","Inspection Bay","Entry Queue","Exit Queue"];
  const loadTypes = ["FMCG","Electronics","Apparel","Pharma","Auto Parts","Food & Beverage","Consumer Goods","E-commerce","Agriculture","Industrial","Chemical","Paper Products"];
  const trailerTypes = ["flatbed","enclosed","refrigerated","tanker","curtainsider","container"] as const;
  const trailerSizes = ["20ft","40ft","45ft"];
  const truckTypes = ["spotter","shuttle","terminal-tractor","reach-truck","yard-mule","prime-mover"] as const;
  const truckStatuses = ["active","idle","maintenance","refueling","off-shift","breakdown"] as const;
  const dockStatuses = ["arriving","checking-in","docked","loading","unloading","inspecting","departing","completed","delayed"] as const;
  const dockTypes = ["inbound","outbound","cross-dock","staging"] as const;
  const priorities = ["express","standard","economy","emergency"] as const;
  const shifts = ["morning","afternoon","night"] as const;
  const trailerStatuses = ["available","in-use","maintenance","empty-yard","loaded-yard","on-road"] as const;
  const movementPriorities = ["high","medium","low"] as const;
  const movementStatuses = ["in-progress","completed","delayed","cancelled"] as const;
  const scheduleStatuses = ["scheduled","checked-in","in-progress","completed","no-show","delayed"] as const;
  const tireConds = ["Good","Fair","Needs Replace","New"];
  const timeSlots = ["06:00-08:00","08:00-10:00","10:00-12:00","12:00-14:00","14:00-16:00","16:00-18:00","18:00-20:00","20:00-22:00"];

  function pick<T>(arr: readonly T[]): T { return arr[Math.floor(r() * arr.length)]; }
  function pickN(arr: string[], n: number): string[] { const s = new Set<string>(); while (s.size < Math.min(n, arr.length)) s.add(pick(arr)); return [...s]; }
  function phone() { return `+91 ${9000000000 + Math.floor(r() * 999999999)}`; }
  function plate() { return `${String.fromCharCode(65+Math.floor(r()*26))}${String.fromCharCode(65+Math.floor(r()*26))}${String.fromCharCode(65+Math.floor(r()*26))}-${Math.floor(r()*100).toString().padStart(2,"0")}-${String.fromCharCode(65+Math.floor(r()*26))}${String.fromCharCode(65+Math.floor(r()*26))}-${Math.floor(r()*10000).toString().padStart(4,"0")}`; }
  function date2025() { return `2025-${String(Math.floor(r()*12)+1).padStart(2,"0")}-${String(Math.floor(r()*28)+1).padStart(2,"0")}`; }
  function time() { return `${String(Math.floor(r()*18)+5).padStart(2,"0")}:${String(Math.floor(r()*60)).padStart(2,"0")}`; }
  function ts() { return `2025-07-28 ${time()}:${String(Math.floor(r()*60)).padStart(2,"0")}`; }

  // Yard Trucks (50)
  const yardTrucks: YardTruck[] = Array.from({ length: 50 }, (_, i) => {
    const st = pick(truckStatuses);
    return {
      id: `YT-${String(i+1).padStart(4,"0")}`, plateNo: plate(), driverName: `${pick(driverFirstNames)} ${pick(driverLastNames)}`,
      driverPhone: phone(), licenseNo: `DL${String(Math.floor(r()*90000000)+10000000)}`,
      type: pick(truckTypes), status: st,
      fuelLevel: Math.round((10+r()*90)*10)/10, odometer: Math.floor(r()*200000)+10000, maxCapacity: pick([5000,8000,10000,15000,20000,25000]),
      currentLoad: Math.floor(r()*15000), warehouse: pick(warehouses).name, city: pick(warehouses).city,
      currentLocation: pick(yardLocations), assignedDock: r() > 0.3 ? pick(dockNos) : "Unassigned",
      totalTrips: Math.floor(r()*5000)+200, tripsToday: st === "active" ? Math.floor(r()*30)+1 : 0,
      avgTripTime: Math.round((5+r()*45)*10)/10, avgFuelPerTrip: Math.round((2+r()*15)*10)/10,
      lastTripEnd: st === "active" ? time() : "--:--", nextScheduled: st === "idle" ? time() : "--:--",
      shift: pick(shifts), tireCondition: pick(tireConds),
      batteryVoltage: Math.round((11+r()*3)*10)/10, engineHours: Math.floor(r()*8000)+500,
    };
  });

  // Dock Operations (80)
  const dockOperations: DockOperation[] = Array.from({ length: 80 }, (_, i) => {
    const st = pick(dockStatuses);
    const wh = pick(warehouses);
    const cinH = Math.floor(r()*12)+5;
    const cinM = Math.floor(r()*60);
    const dur = Math.floor(r()*180)+20;
    return {
      id: `DO-${String(i+1).padStart(4,"0")}`, dockNo: pick(dockNos), dockType: pick(dockTypes),
      warehouse: wh.name, city: wh.city, vehicleNo: plate(),
      driverName: `${pick(driverFirstNames)} ${pick(driverLastNames)}`, carrierName: pick(carriers),
      status: st, arrivalTime: `${String(cinH).padStart(2,"0")}:${String(cinM).padStart(2,"0")}`,
      startTime: st !== "arriving" && st !== "checking-in" ? `${String(cinH+Math.floor(r()*2)).padStart(2,"0")}:${String(cinM).padStart(2,"0")}` : "--:--",
      endTime: st === "completed" ? `${String(Math.min(cinH+Math.floor(dur/60),23)).padStart(2,"0")}:${String((cinM+dur)%60).padStart(2,"0")}` : "--:--",
      loadType: pick(loadTypes), palletCount: Math.floor(r()*40)+2, weightKg: Math.floor(r()*18000)+500,
      trailerType: pick(trailerTypes), dockUtilization: Math.round((40+r()*60)*10)/10,
      priority: pick(priorities), assignedTruck: r() > 0.4 ? `YT-${String(Math.floor(r()*50)+1).padStart(4,"0")}` : "N/A",
      temperature: Math.round((15+r()*20)*10)/10, sealNo: `SL-${String(Math.floor(r()*90000)+10000)}`,
      remarks: r() > 0.85 ? pick(["Seal intact","Temperature check passed","Minor damage to packaging","Waiting for QC clearance","Priority load","Hazmat confirmed","Customs cleared","Partial load"]) : "",
    };
  });

  // Trailers (45)
  const trailers: Trailer[] = Array.from({ length: 45 }, (_, i) => ({
    id: `TR-${String(i+1).padStart(4,"0")}`, plateNo: plate(), type: pick(trailerTypes), size: pick(trailerSizes),
    maxWeight: pick([10000,15000,20000,25000,30000]), currentWeight: Math.floor(r()*25000),
    status: pick(trailerStatuses), location: pick(yardLocations), warehouse: pick(warehouses).name, city: pick(warehouses).city,
    lastInspection: date2025(), nextInspection: date2025(), condition: Math.round((50+r()*50)*10)/10,
    carrier: pick(carriers), insuranceExpiry: `2026-${String(Math.floor(r()*12)+1).padStart(2,"0")}-${String(Math.floor(r()*28)+1).padStart(2,"0")}`,
  }));

  // Yard Movements (100)
  const yardMovements: YardMovement[] = Array.from({ length: 100 }, (_, i) => {
    const st = pick(movementStatuses);
    const dur = Math.floor(r()*60)+5;
    return {
      id: `YM-${String(i+1).padStart(5,"0")}`, truckId: `YT-${String(Math.floor(r()*50)+1).padStart(4,"0")}`,
      truckPlate: plate(), driverName: `${pick(driverFirstNames)} ${pick(driverLastNames)}`,
      from: pick(yardLocations), to: pick(yardLocations), warehouse: pick(warehouses).name, city: pick(warehouses).city,
      startTime: ts(), endTime: st === "completed" ? ts() : "--:--",
      duration: dur, distance: Math.round(r()*2000)/100,
      loadWeight: Math.floor(r()*10000)+500, loadType: pick(loadTypes),
      priority: pick(movementPriorities), status: st,
      fuelUsed: Math.round(r()*20)*10/10, incidents: Math.floor(r()*3),
      waitingTime: Math.floor(r()*30),
    };
  });

  // Dock Schedule (60)
  const dockSchedule: DockSchedule[] = Array.from({ length: 60 }, (_, i) => ({
    id: `DS-${String(i+1).padStart(4,"0")}`, dockNo: pick(dockNos),
    warehouse: pick(warehouses).name, city: pick(warehouses).city,
    timeSlot: pick(timeSlots), carrierName: pick(carriers), vehicleNo: plate(),
    loadType: pick(loadTypes), expectedPallets: Math.floor(r()*40)+2,
    priority: pick(priorities), status: pick(scheduleStatuses),
    actualArrival: r() > 0.2 ? time() : "--:--",
    delayMinutes: Math.floor(r()*60), assignedTruck: r() > 0.4 ? `YT-${String(Math.floor(r()*50)+1).padStart(4,"0")}` : "Unassigned",
  }));

  // Chart data
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const monthlyThroughput = months.map((m) => ({ month: m, inbound: Math.floor(400+r()*300), outbound: Math.floor(350+r()*250), yardMoves: Math.floor(500+r()*400), avgTurnaround: Math.round((20+r()*40)*10)/10 }));
  const truckTypeBreakdown = [
    { type: "Spotter", count: Math.floor(r()*20)+10, color: COLORS.primary },
    { type: "Shuttle", count: Math.floor(r()*15)+8, color: COLORS.secondary },
    { type: "Terminal Tractor", count: Math.floor(r()*12)+5, color: COLORS.accent },
    { type: "Reach Truck", count: Math.floor(r()*10)+5, color: COLORS.info },
    { type: "Yard Mule", count: Math.floor(r()*8)+3, color: COLORS.purple },
    { type: "Prime Mover", count: Math.floor(r()*6)+2, color: COLORS.pink },
  ];
  const dockUtilRadar = [
    { subject: "Inbound Docks", Mumbai: Math.floor(r()*30)+60, Delhi: Math.floor(r()*30)+60, Bengaluru: Math.floor(r()*30)+60 },
    { subject: "Outbound Docks", Mumbai: Math.floor(r()*30)+60, Delhi: Math.floor(r()*30)+60, Bengaluru: Math.floor(r()*30)+60 },
    { subject: "Cross-Dock", Mumbai: Math.floor(r()*30)+60, Delhi: Math.floor(r()*30)+60, Bengaluru: Math.floor(r()*30)+60 },
    { subject: "Yard Utilization", Mumbai: Math.floor(r()*30)+60, Delhi: Math.floor(r()*30)+60, Bengaluru: Math.floor(r()*30)+60 },
    { subject: "Truck Availability", Mumbai: Math.floor(r()*30)+60, Delhi: Math.floor(r()*30)+60, Bengaluru: Math.floor(r()*30)+60 },
    { subject: "Turnaround Time", Mumbai: Math.floor(r()*30)+60, Delhi: Math.floor(r()*30)+60, Bengaluru: Math.floor(r()*30)+60 },
  ];
  const trailerPoolDist = [
    { status: "Available", count: Math.floor(r()*10)+5, color: COLORS.success },
    { status: "In Use", count: Math.floor(r()*15)+10, color: COLORS.primary },
    { status: "Maintenance", count: Math.floor(r()*5)+2, color: COLORS.accent },
    { status: "Empty in Yard", count: Math.floor(r()*8)+3, color: COLORS.info },
    { status: "Loaded in Yard", count: Math.floor(r()*6)+2, color: COLORS.purple },
    { status: "On Road", count: Math.floor(r()*12)+5, color: COLORS.secondary },
  ];
  const hourlyDockActivity = Array.from({ length: 17 }, (_, i) => {
    const h = i + 5;
    return { hour: `${h}:00`, arrivals: h >= 7 && h <= 11 ? Math.floor(r()*8)+3 : Math.floor(r()*3)+1, departures: h >= 15 && h <= 20 ? Math.floor(r()*8)+3 : Math.floor(r()*3)+1 };
  });
  const fuelTrendData = months.map((m) => ({ month: m, totalLiters: Math.floor(2000+r()*3000), avgPerTrip: Math.round((5+r()*10)*10)/10, cost: Math.floor(r()*50000)+15000 }));

  return {
    yardTrucks, dockOperations, trailers, yardMovements, dockSchedule,
    monthlyThroughput, truckTypeBreakdown, dockUtilRadar, trailerPoolDist, hourlyDockActivity, fuelTrendData,
    months, dockNos, yardLocations, loadTypes, carriers, priorities: ["express","standard","economy","emergency"] as const,
  };
}

const data = generateData();

export default function YardTruckingView() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedTruck, setSelectedTruck] = useState<YardTruck | null>(null);
  const [selectedDock, setSelectedDock] = useState<DockOperation | null>(null);
  const [selectedTrailer, setSelectedTrailer] = useState<Trailer | null>(null);
  const [selectedMovement, setSelectedMovement] = useState<YardMovement | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<string>("id");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [trailerStatusFilter, setTrailerStatusFilter] = useState("all");
  const [movementStatusFilter, setMovementStatusFilter] = useState("all");
  const [scheduleFilter, setScheduleFilter] = useState("all");
  const [now, setNow] = useState(new Date());

  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);

  const perPage = 12;

  const filteredTrucks = useMemo(() => {
    return data.yardTrucks.filter((t) => {
      const ms = !searchTerm || t.id.toLowerCase().includes(searchTerm.toLowerCase()) || t.plateNo.toLowerCase().includes(searchTerm.toLowerCase()) || t.driverName.toLowerCase().includes(searchTerm.toLowerCase()) || t.warehouse.toLowerCase().includes(searchTerm.toLowerCase());
      return ms && (statusFilter === "all" || t.status === statusFilter) && (typeFilter === "all" || t.type === typeFilter);
    }).sort((a, b) => { const va = a[sortField as keyof YardTruck]; const vb = b[sortField as keyof YardTruck]; if (typeof va === "string" && typeof vb === "string") return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va); if (typeof va === "number" && typeof vb === "number") return sortDir === "asc" ? va - vb : vb - va; return 0; });
  }, [searchTerm, statusFilter, typeFilter, sortField, sortDir]);

  const pagedTrucks = filteredTrucks.slice((currentPage - 1) * perPage, currentPage * perPage);

  const filteredDocks = useMemo(() => data.dockOperations.filter((d) => (!searchTerm || d.id.toLowerCase().includes(searchTerm.toLowerCase()) || d.vehicleNo.toLowerCase().includes(searchTerm.toLowerCase()) || d.carrierName.toLowerCase().includes(searchTerm.toLowerCase()) || d.warehouse.toLowerCase().includes(searchTerm.toLowerCase())) && (statusFilter === "all" || d.status === statusFilter) && (priorityFilter === "all" || d.priority === priorityFilter)), [searchTerm, statusFilter, priorityFilter]);

  const filteredTrailers = useMemo(() => data.trailers.filter((t) => (!searchTerm || t.id.toLowerCase().includes(searchTerm.toLowerCase()) || t.plateNo.toLowerCase().includes(searchTerm.toLowerCase()) || t.warehouse.toLowerCase().includes(searchTerm.toLowerCase())) && (trailerStatusFilter === "all" || t.status === trailerStatusFilter)), [searchTerm, trailerStatusFilter]);

  const filteredMovements = useMemo(() => data.yardMovements.filter((m) => (!searchTerm || m.id.toLowerCase().includes(searchTerm.toLowerCase()) || m.truckPlate.toLowerCase().includes(searchTerm.toLowerCase()) || m.warehouse.toLowerCase().includes(searchTerm.toLowerCase())) && (movementStatusFilter === "all" || m.status === movementStatusFilter)), [searchTerm, movementStatusFilter]);

  const filteredSchedule = useMemo(() => data.dockSchedule.filter((s) => (!searchTerm || s.id.toLowerCase().includes(searchTerm.toLowerCase()) || s.carrierName.toLowerCase().includes(searchTerm.toLowerCase()) || s.warehouse.toLowerCase().includes(searchTerm.toLowerCase())) && (scheduleFilter === "all" || s.status === scheduleFilter)), [searchTerm, scheduleFilter]);

  const handleSort = (field: string) => { if (sortField === field) setSortDir(sortDir === "asc" ? "desc" : "asc"); else { setSortField(field); setSortDir("desc"); } };

  const kpis = [
    { label: "Active Trucks", value: data.yardTrucks.filter(t => t.status === "active").length.toString(), icon: <Truck size={18} />, color: COLORS.primary, trend: "+5", up: true },
    { label: "Dock Operations", value: data.dockOperations.filter(d => ["docked","loading","unloading"].includes(d.status)).length.toString(), icon: <Waypoints size={18} />, color: COLORS.secondary, trend: "-2", up: false },
    { label: "Trailer Pool", value: data.trailers.filter(t => t.status === "available").length.toString(), icon: <Package size={18} />, color: COLORS.accent, trend: "+3", up: true },
    { label: "Avg Turnaround", value: `${(data.dockOperations.reduce((s,d) => s + d.dockUtilization, 0) / data.dockOperations.length).toFixed(1)}%`, icon: <Timer size={18} />, color: COLORS.danger, trend: "-1.2%", up: false },
    { label: "Fuel Alert", value: data.yardTrucks.filter(t => t.fuelLevel < 20).length.toString(), icon: <Fuel size={18} />, color: COLORS.amber, trend: "+1", up: true },
    { label: "Yard Movements Today", value: data.yardMovements.filter(m => m.status === "completed").length.toString(), icon: <Activity size={18} />, color: COLORS.teal, trend: "+8", up: true },
  ];

  const statusBadge = (status: string): string => {
    const map: Record<string, string> = {
      "active": "ytd-badge-green", "idle": "ytd-badge-blue", "maintenance": "ytd-badge-amber", "refueling": "ytd-badge-purple", "off-shift": "ytd-badge-gray", "breakdown": "ytd-badge-red",
      "arriving": "ytd-badge-blue", "checking-in": "ytd-badge-amber", "docked": "ytd-badge-green", "loading": "ytd-badge-purple", "unloading": "ytd-badge-teal", "inspecting": "ytd-badge-blue", "departing": "ytd-badge-gray", "completed": "ytd-badge-green", "delayed": "ytd-badge-red",
      "available": "ytd-badge-green", "in-use": "ytd-badge-blue", "empty-yard": "ytd-badge-gray", "loaded-yard": "ytd-badge-purple", "on-road": "ytd-badge-teal",
      "in-progress": "ytd-badge-blue", "completed-done": "ytd-badge-green", "cancelled": "ytd-badge-gray",
      "scheduled": "ytd-badge-blue", "checked-in": "ytd-badge-green", "no-show": "ytd-badge-red",
    };
    return map[status] || "ytd-badge-gray";
  };
  const priorityBadge = (p: string): string => ({ express: "ytd-badge-red", standard: "ytd-badge-blue", economy: "ytd-badge-gray", emergency: "ytd-badge-red", high: "ytd-badge-red", medium: "ytd-badge-amber", low: "ytd-badge-green" }[p] || "ytd-badge-gray");

  const FieldGrid = ({ fields }: { fields: [string, string][] }) => (
    <div className="ytd-drawer-field-grid">
      {fields.map(([label, val]) => (<div className="ytd-drawer-field" key={label}><span className="ytd-field-label">{label}</span><span className="ytd-field-value">{val}</span></div>))}
    </div>
  );
  const MetricsRow = ({ items }: { items: [string, string, string][] }) => (
    <div className="ytd-drawer-metrics">
      {items.map(([label, value, color], i) => (<div className="ytd-metric-card" key={i} style={{ borderLeft: `4px solid ${color}` }}><span className="ytd-metric-label">{label}</span><span className="ytd-metric-value">{value}</span></div>))}
    </div>
  );

  // DRAWERS
  const renderTruckDrawer = () => {
    if (!selectedTruck) return null;
    const t = selectedTruck;
    return (<>
      <div className="ytd-drawer-overlay" onClick={() => setSelectedTruck(null)} />
      <div className="ytd-drawer-panel">
        <div className="ytd-drawer-header">
          <div className="ytd-drawer-header-left"><Truck size={22} /><div><h3>Truck {t.id}</h3><span className="ytd-drawer-subtitle">{t.plateNo} | {t.type.replace(/-/g," ")}</span></div></div>
          <button className="ytd-drawer-close" onClick={() => setSelectedTruck(null)}><XCircle size={20} /></button>
        </div>
        <div className="ytd-drawer-body">
          <FieldGrid fields={[["Driver", t.driverName], ["Phone", t.driverPhone], ["License", t.licenseNo], ["Type", t.type.replace(/-/g," ").toUpperCase()], ["Warehouse", t.warehouse], ["Current Location", t.currentLocation], ["Assigned Dock", t.assignedDock], ["Shift", t.shift.toUpperCase()], ["Odometer", (t.odometer/1000).toFixed(1) + " km"], ["Engine Hours", t.engineHours + "h"], ["Tire Condition", t.tireCondition], ["Battery", t.batteryVoltage + "V"]]} />
          <MetricsRow items={[["Status", t.status.toUpperCase(), t.status === "active" ? COLORS.success : COLORS.accent], ["Fuel", `${t.fuelLevel}%`, t.fuelLevel >= 30 ? COLORS.success : t.fuelLevel >= 15 ? COLORS.amber : COLORS.danger], ["Trips Today", t.tripsToday.toString(), COLORS.primary]]} />
          <div className="ytd-drawer-actions">
            <button className="ytd-action-btn ytd-action-primary"><CheckCircle2 size={16} /> Assign Dock</button>
            <button className="ytd-action-btn ytd-action-secondary"><Fuel size={16} /> Schedule Fuel</button>
            <button className="ytd-action-btn ytd-action-danger"><Wrench size={16} /> Report Issue</button>
          </div>
        </div>
      </div>
    </>);
  };

  const renderDockDrawer = () => {
    if (!selectedDock) return null;
    const d = selectedDock;
    return (<>
      <div className="ytd-drawer-overlay" onClick={() => setSelectedDock(null)} />
      <div className="ytd-drawer-panel">
        <div className="ytd-drawer-header">
          <div className="ytd-drawer-header-left"><Waypoints size={22} /><div><h3>Dock Op {d.id}</h3><span className="ytd-drawer-subtitle">{d.dockNo} | {d.dockType.toUpperCase()}</span></div></div>
          <button className="ytd-drawer-close" onClick={() => setSelectedDock(null)}><XCircle size={20} /></button>
        </div>
        <div className="ytd-drawer-body">
          <FieldGrid fields={[["Vehicle", d.vehicleNo], ["Driver", d.driverName], ["Carrier", d.carrierName], ["Warehouse", d.warehouse], ["City", d.city], ["Load Type", d.loadType], ["Trailer", d.trailerType.toUpperCase()], ["Arrival", d.arrivalTime], ["Start", d.startTime], ["End", d.endTime], ["Pallets", d.palletCount.toString()], ["Weight", `${(d.weightKg/1000).toFixed(1)} ton`], ["Priority", d.priority.toUpperCase()], ["Temperature", `${d.temperature}\u00B0C`], ["Seal No", d.sealNo], ["Assigned Truck", d.assignedTruck]]} />
          <MetricsRow items={[["Status", d.status.replace(/-/g," ").toUpperCase(), d.status === "completed" ? COLORS.success : d.status === "delayed" ? COLORS.danger : COLORS.primary], ["Utilization", `${d.dockUtilization}%`, d.dockUtilization >= 70 ? COLORS.success : COLORS.amber], ["Load", `${(d.weightKg/1000).toFixed(1)} ton`, COLORS.secondary]]} />
          {d.remarks && <div className="ytd-drawer-notes"><span className="ytd-notes-label">Remarks</span><p className="ytd-notes-text">{d.remarks}</p></div>}
          <div className="ytd-drawer-actions">
            <button className="ytd-action-btn ytd-action-primary"><CheckCircle2 size={16} /> Complete Operation</button>
            <button className="ytd-action-btn ytd-action-danger"><AlertTriangle size={16} /> Report Delay</button>
          </div>
        </div>
      </div>
    </>);
  };

  const renderTrailerDrawer = () => {
    if (!selectedTrailer) return null;
    const t = selectedTrailer;
    return (<>
      <div className="ytd-drawer-overlay" onClick={() => setSelectedTrailer(null)} />
      <div className="ytd-drawer-panel">
        <div className="ytd-drawer-header">
          <div className="ytd-drawer-header-left"><Package size={22} /><div><h3>Trailer {t.id}</h3><span className="ytd-drawer-subtitle">{t.plateNo} | {t.type.toUpperCase()} {t.size}</span></div></div>
          <button className="ytd-drawer-close" onClick={() => setSelectedTrailer(null)}><XCircle size={20} /></button>
        </div>
        <div className="ytd-drawer-body">
          <FieldGrid fields={[["Plate No", t.plateNo], ["Type", t.type.toUpperCase()], ["Size", t.size], ["Carrier", t.carrier], ["Warehouse", t.warehouse], ["Location", t.location], ["City", t.city], ["Max Weight", `${(t.maxWeight/1000).toFixed(1)} ton`], ["Current Weight", `${(t.currentWeight/1000).toFixed(1)} ton`], ["Last Inspection", t.lastInspection], ["Next Inspection", t.nextInspection], ["Insurance Expiry", t.insuranceExpiry]]} />
          <MetricsRow items={[["Status", t.status.replace(/-/g," ").toUpperCase(), COLORS.primary], ["Condition", `${t.condition}%`, t.condition >= 70 ? COLORS.success : t.condition >= 50 ? COLORS.amber : COLORS.danger], ["Capacity", `${Math.round(t.currentWeight/t.maxWeight*100)}%`, COLORS.secondary]]} />
          <div className="ytd-drawer-actions">
            <button className="ytd-action-btn ytd-action-primary"><CheckCircle2 size={16} /> Assign to Dock</button>
            <button className="ytd-action-btn ytd-action-secondary"><ClipboardList size={16} /> Schedule Inspection</button>
          </div>
        </div>
      </div>
    </>);
  };

  const renderMovementDrawer = () => {
    if (!selectedMovement) return null;
    const m = selectedMovement;
    return (<>
      <div className="ytd-drawer-overlay" onClick={() => setSelectedMovement(null)} />
      <div className="ytd-drawer-panel">
        <div className="ytd-drawer-header">
          <div className="ytd-drawer-header-left"><Waypoints size={22} /><div><h3>Movement {m.id}</h3><span className="ytd-drawer-subtitle">{m.truckPlate} | {m.priority.toUpperCase()}</span></div></div>
          <button className="ytd-drawer-close" onClick={() => setSelectedMovement(null)}><XCircle size={20} /></button>
        </div>
        <div className="ytd-drawer-body">
          <FieldGrid fields={[["Truck ID", m.truckId], ["Driver", m.driverName], ["From", m.from], ["To", m.to], ["Warehouse", m.warehouse], ["City", m.city], ["Start", m.startTime], ["End", m.endTime], ["Duration", `${m.duration} min`], ["Distance", `${m.distance} km`], ["Load Weight", `${(m.loadWeight/1000).toFixed(1)} ton`], ["Load Type", m.loadType], ["Fuel Used", `${m.fuelUsed} L`], ["Waiting", `${m.waitingTime} min`], ["Incidents", m.incidents.toString()]]} />
          <MetricsRow items={[["Status", m.status.toUpperCase(), m.status === "completed" ? COLORS.success : m.status === "delayed" ? COLORS.danger : COLORS.primary], ["Priority", m.priority.toUpperCase(), COLORS.accent], ["Distance", `${m.distance} km`, COLORS.info]]} />
          <div className="ytd-drawer-actions">
            <button className="ytd-action-btn ytd-action-primary"><CheckCircle2 size={16} /> Complete</button>
            <button className="ytd-action-btn ytd-action-danger"><AlertTriangle size={16} /> Report Incident</button>
          </div>
        </div>
      </div>
    </>);
  };

  // TAB 0: DASHBOARD
  const renderDashboard = () => (
    <div className="ytd-tab-content">
      <div className="ytd-live-clock">
        <Clock size={16} /><span>{now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true })}</span>
        <span className="ytd-clock-date">{now.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}</span>
      </div>
      <div className="ytd-kpi-grid">{kpis.map((k) => (
        <div className="ytd-kpi-card" key={k.label}>
          <div className="ytd-kpi-icon" style={{ backgroundColor: k.color + "18" }}><span style={{ color: k.color }}>{k.icon}</span></div>
          <div className="ytd-kpi-info"><span className="ytd-kpi-value">{k.value}</span><span className="ytd-kpi-label">{k.label}</span></div>
          <span className={`ytd-kpi-trend ${k.up ? "ytd-trend-up" : "ytd-trend-down"}`}>{k.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}{k.trend}</span>
        </div>
      ))}</div>
      <div className="ytd-charts-grid">
        <div className="ytd-chart-card ytd-chart-lg">
          <h4 className="ytd-chart-title">Monthly Dock Throughput</h4>
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={data.monthlyThroughput}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" /><XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 12 }} /><YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: 8 }} /><Legend />
              <Bar dataKey="inbound" name="Inbound" fill={COLORS.primary} radius={[4,4,0,0]} />
              <Bar dataKey="outbound" name="Outbound" fill={COLORS.secondary} radius={[4,4,0,0]} />
              <Bar dataKey="yardMoves" name="Yard Moves" fill={COLORS.accent} radius={[4,4,0,0]} />
              <Line type="monotone" dataKey="avgTurnaround" name="Avg Turnaround (min)" stroke={COLORS.danger} strokeWidth={2} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div className="ytd-chart-card">
          <h4 className="ytd-chart-title">Truck Type Distribution</h4>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart><Pie data={data.truckTypeBreakdown} cx="50%" cy="50%" outerRadius={80} dataKey="count" nameKey="type" label={({ type, percent }) => `${type} ${(percent * 100).toFixed(0)}%`}>{data.truckTypeBreakdown.map((d, i) => <Cell key={i} fill={d.color} />)}</Pie><Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: 8 }} /></PieChart>
          </ResponsiveContainer>
        </div>
        <div className="ytd-chart-card">
          <h4 className="ytd-chart-title">Dock Utilization Radar</h4>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={data.dockUtilRadar}>
              <PolarGrid stroke="#334155" /><PolarAngleAxis dataKey="subject" tick={{ fill: "#94a3b8", fontSize: 10 }} /><PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#94a3b8", fontSize: 10 }} />
              <Radar name="Mumbai" dataKey="Mumbai" stroke={COLORS.primary} fill={COLORS.primary} fillOpacity={0.15} />
              <Radar name="Delhi NCR" dataKey="Delhi" stroke={COLORS.secondary} fill={COLORS.secondary} fillOpacity={0.15} />
              <Radar name="Bengaluru" dataKey="Bengaluru" stroke={COLORS.accent} fill={COLORS.accent} fillOpacity={0.15} />
              <Legend /><Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: 8 }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div className="ytd-chart-card">
          <h4 className="ytd-chart-title">Trailer Pool Status</h4>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data.trailerPoolDist}><CartesianGrid strokeDasharray="3 3" stroke="#334155" /><XAxis dataKey="status" tick={{ fill: "#94a3b8", fontSize: 10 }} /><YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} /><Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: 8 }} /><Bar dataKey="count" name="Trailers" radius={[4,4,0,0]}>{data.trailerPoolDist.map((d, i) => <Cell key={i} fill={d.color} />)}</Bar></BarChart>
          </ResponsiveContainer>
        </div>
        <div className="ytd-chart-card">
          <h4 className="ytd-chart-title">Hourly Dock Activity</h4>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={data.hourlyDockActivity}><CartesianGrid strokeDasharray="3 3" stroke="#334155" /><XAxis dataKey="hour" tick={{ fill: "#94a3b8", fontSize: 11 }} /><YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} /><Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: 8 }} /><Legend /><Area type="monotone" dataKey="arrivals" name="Arrivals" stroke={COLORS.primary} fill={COLORS.primary} fillOpacity={0.2} /><Area type="monotone" dataKey="departures" name="Departures" stroke={COLORS.secondary} fill={COLORS.secondary} fillOpacity={0.2} /></AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  // TAB 1: YARD TRUCKS
  const renderYardTrucks = () => (
    <div className="ytd-tab-content">
      <div className="ytd-section-header">
        <h3 className="ytd-section-title">Yard Truck Fleet</h3>
        <div className="ytd-filters">
          <div className="ytd-search-box"><Search size={16} /><input type="text" placeholder="Search by ID, plate, driver, warehouse..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} /></div>
          <select className="ytd-filter-select" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}><option value="all">All Status</option><option value="active">Active</option><option value="idle">Idle</option><option value="maintenance">Maintenance</option><option value="refueling">Refueling</option><option value="off-shift">Off-Shift</option><option value="breakdown">Breakdown</option></select>
          <select className="ytd-filter-select" value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }}><option value="all">All Types</option><option value="spotter">Spotter</option><option value="shuttle">Shuttle</option><option value="terminal-tractor">Terminal Tractor</option><option value="reach-truck">Reach Truck</option><option value="yard-mule">Yard Mule</option><option value="prime-mover">Prime Mover</option></select>
        </div>
      </div>
      <div className="ytd-table-wrapper">
        <table className="ytd-table"><thead><tr>
          {[{h:"ID",f:"id"},{h:"Plate",f:"plateNo"},{h:"Driver",f:"driverName"},{h:"Type",f:"type"},{h:"Warehouse",f:"warehouse"},{h:"Location",f:"currentLocation"},{h:"Dock",f:"assignedDock"},{h:"Fuel",f:"fuelLevel"},{h:"Trips",f:"tripsToday"},{h:"Avg Time",f:"avgTripTime"},{h:"Status",f:"status"}].map((col) => (
            <th key={col.h} className="ytd-sortable-th" onClick={() => handleSort(col.f)}>{col.h}{sortField === col.f && <span className="ytd-sort-icon">{sortDir === "asc" ? "\u25B2" : "\u25BC"}</span>}</th>
          ))}
        </tr></thead><tbody>
          {pagedTrucks.map((t) => (
            <tr key={t.id} className="ytd-table-row" onClick={() => setSelectedTruck(t)}>
              <td className="ytd-mono">{t.id}</td><td className="ytd-mono">{t.plateNo}</td><td className="ytd-bold">{t.driverName}</td>
              <td><span className="ytd-type-badge">{t.type.replace(/-/g," ")}</span></td><td>{t.city}</td>
              <td>{t.currentLocation}</td><td className="ytd-mono">{t.assignedDock}</td>
              <td><div className="ytd-bar-bg ytd-bar-sm"><div className="ytd-bar-fill" style={{ width: `${t.fuelLevel}%`, backgroundColor: t.fuelLevel >= 30 ? COLORS.success : t.fuelLevel >= 15 ? COLORS.amber : COLORS.danger }} /><span className="ytd-bar-value">{t.fuelLevel}%</span></div></td>
              <td className="ytd-bold">{t.tripsToday}</td><td className="ytd-mono">{t.avgTripTime}m</td>
              <td><span className={statusBadge(t.status)}>{t.status.replace(/-/g," ")}</span></td>
            </tr>
          ))}
        </tbody></table>
      </div>
      <div className="ytd-pagination">
        <span className="ytd-page-info">Showing {(currentPage - 1) * perPage + 1}-{Math.min(currentPage * perPage, filteredTrucks.length)} of {filteredTrucks.length}</span>
        <div className="ytd-page-buttons">
          <button className="ytd-page-btn" disabled={currentPage === 1} onClick={() => setCurrentPage(1)}>First</button>
          <button className="ytd-page-btn" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Prev</button>
          <button className="ytd-page-btn ytd-page-active">{currentPage}</button>
          <button className="ytd-page-btn" disabled={currentPage >= Math.ceil(filteredTrucks.length / perPage)} onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
          <button className="ytd-page-btn" disabled={currentPage >= Math.ceil(filteredTrucks.length / perPage)} onClick={() => setCurrentPage(Math.ceil(filteredTrucks.length / perPage))}>Last</button>
        </div>
      </div>
    </div>
  );

  // TAB 2: DOCK OPERATIONS
  const renderDockOps = () => (
    <div className="ytd-tab-content">
      <div className="ytd-section-header">
        <h3 className="ytd-section-title">Dock Operations</h3>
        <div className="ytd-filters">
          <div className="ytd-search-box"><Search size={16} /><input type="text" placeholder="Search by ID, vehicle, carrier..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
          <select className="ytd-filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}><option value="all">All Status</option><option value="arriving">Arriving</option><option value="docked">Docked</option><option value="loading">Loading</option><option value="unloading">Unloading</option><option value="completed">Completed</option><option value="delayed">Delayed</option></select>
          <select className="ytd-filter-select" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}><option value="all">All Priority</option><option value="express">Express</option><option value="standard">Standard</option><option value="economy">Economy</option><option value="emergency">Emergency</option></select>
        </div>
      </div>
      <div className="ytd-table-wrapper">
        <table className="ytd-table"><thead><tr>
          {["ID","Dock","Type","Vehicle","Carrier","Load","Pallets","Weight","Priority","Arrival","Status"].map((h) => <th key={h}>{h}</th>)}
        </tr></thead><tbody>
          {filteredDocks.slice(0, 50).map((d) => (
            <tr key={d.id} className="ytd-table-row" onClick={() => setSelectedDock(d)}>
              <td className="ytd-mono">{d.id}</td><td className="ytd-mono">{d.dockNo}</td><td>{d.dockType.toUpperCase()}</td>
              <td className="ytd-mono">{d.vehicleNo}</td><td>{d.carrierName}</td><td>{d.loadType}</td>
              <td>{d.palletCount}</td><td className="ytd-mono">{(d.weightKg/1000).toFixed(1)}t</td>
              <td><span className={priorityBadge(d.priority)}>{d.priority.toUpperCase()}</span></td>
              <td className="ytd-mono">{d.arrivalTime}</td><td><span className={statusBadge(d.status)}>{d.status.replace(/-/g," ")}</span></td>
            </tr>
          ))}
        </tbody></table>
      </div>
    </div>
  );

  // TAB 3: TRAILER POOL
  const renderTrailerPool = () => (
    <div className="ytd-tab-content">
      <div className="ytd-section-header">
        <h3 className="ytd-section-title">Trailer Pool</h3>
        <div className="ytd-filters">
          <div className="ytd-search-box"><Search size={16} /><input type="text" placeholder="Search by ID, plate, warehouse..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
          <select className="ytd-filter-select" value={trailerStatusFilter} onChange={(e) => setTrailerStatusFilter(e.target.value)}><option value="all">All Status</option><option value="available">Available</option><option value="in-use">In Use</option><option value="maintenance">Maintenance</option><option value="empty-yard">Empty Yard</option><option value="loaded-yard">Loaded Yard</option><option value="on-road">On Road</option></select>
        </div>
      </div>
      <div className="ytd-card-grid">
        {filteredTrailers.map((t) => (
          <div className="ytd-trailer-card" key={t.id} onClick={() => setSelectedTrailer(t)}>
            <div className="ytd-trailer-card-header">
              <div className="ytd-trailer-icon-wrapper"><Package size={20} /></div>
              <div className="ytd-trailer-card-info">
                <span className="ytd-trailer-name">{t.id} - {t.plateNo}</span>
                <span className="ytd-trailer-location">{t.type.toUpperCase()} {t.size} | {t.carrier}</span>
              </div>
              <span className={statusBadge(t.status)}>{t.status.replace(/-/g," ")}</span>
            </div>
            <div className="ytd-trailer-card-details">
              <div className="ytd-trailer-detail-item"><span>Warehouse</span><span>{t.warehouse}</span></div>
              <div className="ytd-trailer-detail-item"><span>Location</span><span>{t.location}</span></div>
              <div className="ytd-trailer-detail-item"><span>Max Weight</span><span>{(t.maxWeight/1000).toFixed(1)} ton</span></div>
              <div className="ytd-trailer-detail-item"><span>Current</span><span>{(t.currentWeight/1000).toFixed(1)} ton</span></div>
            </div>
            <div className="ytd-trailer-card-bars">
              <div className="ytd-bar-row"><span>Condition</span><div className="ytd-bar-bg"><div className="ytd-bar-fill" style={{ width: `${t.condition}%`, backgroundColor: t.condition >= 70 ? COLORS.success : t.condition >= 50 ? COLORS.amber : COLORS.danger }} /></div><span>{t.condition}%</span></div>
            </div>
            <div className="ytd-trailer-card-footer">
              <span className="ytd-mono">Insurance: {t.insuranceExpiry}</span>
              <span className="ytd-mono">Next Insp: {t.nextInspection}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // TAB 4: YARD MOVEMENTS
  const renderYardMovements = () => (
    <div className="ytd-tab-content">
      <div className="ytd-section-header">
        <h3 className="ytd-section-title">Yard Movements</h3>
        <div className="ytd-filters">
          <div className="ytd-search-box"><Search size={16} /><input type="text" placeholder="Search by ID, truck, warehouse..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
          <select className="ytd-filter-select" value={movementStatusFilter} onChange={(e) => setMovementStatusFilter(e.target.value)}><option value="all">All Status</option><option value="in-progress">In Progress</option><option value="completed">Completed</option><option value="delayed">Delayed</option><option value="cancelled">Cancelled</option></select>
        </div>
      </div>
      <div className="ytd-table-wrapper">
        <table className="ytd-table"><thead><tr>
          {["ID","Truck","Driver","From","To","Warehouse","Load","Distance","Duration","Fuel","Priority","Status"].map((h) => <th key={h}>{h}</th>)}
        </tr></thead><tbody>
          {filteredMovements.slice(0, 50).map((m) => (
            <tr key={m.id} className="ytd-table-row" onClick={() => setSelectedMovement(m)}>
              <td className="ytd-mono">{m.id}</td><td className="ytd-mono">{m.truckPlate}</td><td>{m.driverName}</td>
              <td>{m.from}</td><td>{m.to}</td><td>{m.city}</td>
              <td>{m.loadType}</td><td className="ytd-mono">{m.distance}km</td><td className="ytd-mono">{m.duration}m</td>
              <td className="ytd-mono">{m.fuelUsed}L</td>
              <td><span className={priorityBadge(m.priority)}>{m.priority.toUpperCase()}</span></td>
              <td><span className={statusBadge(m.status)}>{m.status.toUpperCase()}</span></td>
            </tr>
          ))}
        </tbody></table>
      </div>
    </div>
  );

  // TAB 5: DOCK SCHEDULE
  const renderDockSchedule = () => (
    <div className="ytd-tab-content">
      <div className="ytd-section-header">
        <h3 className="ytd-section-title">Dock Schedule</h3>
        <div className="ytd-filters">
          <div className="ytd-search-box"><Search size={16} /><input type="text" placeholder="Search by ID, carrier, warehouse..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
          <select className="ytd-filter-select" value={scheduleFilter} onChange={(e) => setScheduleFilter(e.target.value)}><option value="all">All Status</option><option value="scheduled">Scheduled</option><option value="checked-in">Checked In</option><option value="in-progress">In Progress</option><option value="completed">Completed</option><option value="no-show">No Show</option><option value="delayed">Delayed</option></select>
        </div>
      </div>
      <div className="ytd-charts-grid" style={{ marginBottom: "1.5rem" }}>
        <div className="ytd-chart-card">
          <h4 className="ytd-chart-title">Fuel Consumption Trend</h4>
          <ResponsiveContainer width="100%" height={260}>
            <ComposedChart data={data.fuelTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" /><XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 12 }} /><YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: 8 }} /><Legend />
              <Bar dataKey="totalLiters" name="Total Liters" fill={COLORS.primary} radius={[4,4,0,0]} />
              <Line type="monotone" dataKey="avgPerTrip" name="Avg L/Trip" stroke={COLORS.accent} strokeWidth={2} />
              <Line type="monotone" dataKey="cost" name="Cost (\u20B9)" stroke={COLORS.secondary} strokeWidth={2} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="ytd-table-wrapper">
        <table className="ytd-table"><thead><tr>
          {["ID","Dock","Warehouse","Time Slot","Carrier","Vehicle","Load","Pallets","Priority","Arrival","Delay","Status"].map((h) => <th key={h}>{h}</th>)}
        </tr></thead><tbody>
          {filteredSchedule.map((s) => (
            <tr key={s.id} className="ytd-table-row">
              <td className="ytd-mono">{s.id}</td><td className="ytd-mono">{s.dockNo}</td><td>{s.city}</td>
              <td>{s.timeSlot}</td><td>{s.carrierName}</td><td className="ytd-mono">{s.vehicleNo}</td>
              <td>{s.loadType}</td><td>{s.expectedPallets}</td>
              <td><span className={priorityBadge(s.priority)}>{s.priority.toUpperCase()}</span></td>
              <td className="ytd-mono">{s.actualArrival}</td>
              <td className={s.delayMinutes > 15 ? "ytd-text-red" : ""}>{s.delayMinutes > 0 ? `${s.delayMinutes}m` : "On time"}</td>
              <td><span className={statusBadge(s.status)}>{s.status.replace(/-/g," ")}</span></td>
            </tr>
          ))}
        </tbody></table>
      </div>
    </div>
  );

  return (
    <div className="ytd-container">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="ytd-tabs-list">
          <TabsTrigger value="dashboard" className="ytd-tab-trigger"><Activity size={16} /> Dashboard</TabsTrigger>
          <TabsTrigger value="trucks" className="ytd-tab-trigger"><Truck size={16} /> Yard Trucks</TabsTrigger>
          <TabsTrigger value="docks" className="ytd-tab-trigger"><Waypoints size={16} /> Dock Ops</TabsTrigger>
          <TabsTrigger value="trailers" className="ytd-tab-trigger"><Package size={16} /> Trailer Pool</TabsTrigger>
          <TabsTrigger value="movements" className="ytd-tab-trigger"><RotateCcw size={16} /> Movements</TabsTrigger>
          <TabsTrigger value="schedule" className="ytd-tab-trigger"><ClipboardList size={16} /> Schedule</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard">{renderDashboard()}</TabsContent>
        <TabsContent value="trucks">{renderYardTrucks()}</TabsContent>
        <TabsContent value="docks">{renderDockOps()}</TabsContent>
        <TabsContent value="trailers">{renderTrailerPool()}</TabsContent>
        <TabsContent value="movements">{renderYardMovements()}</TabsContent>
        <TabsContent value="schedule">{renderDockSchedule()}</TabsContent>
      </Tabs>
      {renderTruckDrawer()}{renderDockDrawer()}{renderTrailerDrawer()}{renderMovementDrawer()}
    </div>
  );
}
