"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  ComposedChart, Bar, BarChart, Line, AreaChart, Area, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ScanLine, ShieldCheck, Users, Truck, Camera, Fingerprint, AlertTriangle, Clock, MapPin, Phone, CreditCard,
  BadgeCheck, ChevronRight, Eye, FileText, XCircle, CheckCircle2, Timer, TrendingUp, Activity, Monitor, Lock, Unlock,
  Car, Package, UserCheck, ScanFace, ClipboardList, Search, ArrowUpRight, ArrowDownRight,
} from "lucide-react";

// ===== TYPES =====
interface GateEntry {
  id: string; type: "inbound" | "outbound"; category: "vehicle" | "visitor" | "employee" | "vendor" | "delivery";
  entityName: string; entityPhone: string; vehicleNo: string; purpose: string;
  gateNo: string; checkpoint: string; warehouse: string; city: string; state: string;
  checkInTime: string; checkOutTime: string; duration: number; status: "checked-in" | "checked-out" | "pending" | "denied" | "blacklisted";
  securityLevel: "low" | "medium" | "high" | "critical";
  badgeNo: string; escortRequired: boolean; itemsCarried: number;
  temperature: number; temperaturePass: boolean;
  escortName: string; remarks: string;
}

interface SecurityGuard {
  id: string; name: string; phone: string; empCode: string;
  shift: "morning" | "afternoon" | "night"; gateAssigned: string; warehouse: string; city: string;
  rank: "head-guard" | "senior-guard" | "guard" | "trainee";
  specialization: string[]; status: "on-duty" | "on-break" | "off-duty" | "training";
  totalChecks: number; checksToday: number; avgProcessingTime: number;
  incidentsHandled: number; complianceScore: number;
  certifications: string[]; age: number; gender: string;
  lastTraining: string; licenseExpiry: string;
}

interface CCTVCamera {
  id: string; name: string; location: string; warehouse: string; city: string;
  type: "dome" | "bullet" | "ptz" | "thermal"; resolution: string;
  status: "online" | "offline" | "maintenance" | "recording" | "alert";
  fov: string; nightVision: boolean; aiEnabled: boolean;
  storageDays: number; lastMaintenance: string; ipAddress: string;
  uptime: number; alertsToday: number; recordingHours: number;
}

interface AccessEvent {
  id: string; userId: string; userName: string; role: string; department: string;
  accessPoint: string; warehouse: string; city: string;
  accessType: "entry" | "exit" | "denied" | "forced" | "tamper";
  method: "badge" | "biometric" | "rfid" | "mobile" | "pin" | "manual";
  timestamp: string; zone: string;
  riskScore: number; biometricMatch: number;
  deviceStatus: "normal" | "flagged" | "malfunction";
}

interface SecurityAlert {
  id: string; type: string; severity: "critical" | "high" | "medium" | "low";
  source: string; location: string; warehouse: string; city: string;
  timestamp: string; status: "open" | "investigating" | "resolved" | "escalated" | "false-alarm";
  description: string;
  assignedTo: string; responseTime: number; resolvedAt: string;
  rootCause: string; correctiveAction: string;
  cameraRef: string; cctvFootage: boolean;
}

// ===== CONSTANTS =====
const COLORS = { primary: "#0d9488", secondary: "#6366f1", accent: "#f59e0b", danger: "#ef4444", success: "#22c55e", info: "#3b82f6", purple: "#a855f7", pink: "#ec4899" };

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
function formatDuration(mins: number): string {
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

// ===== GENERATE DATA =====
function seededRandom(seed: number) {
  let s = seed;
  return function (min = 0, max = 1) {
    s = (s * 16807) % 2147483647;
    return min + (s / 2147483647) * (max - min);
  };
}

function generateData() {
  const r = seededRandom(171);

  const guardFirstNames = ["Rajesh","Suresh","Mohan","Ravi","Amit","Vijay","Sunil","Deepak","Sanjay","Pradeep","Krishna","Anil","Ramesh","Mahesh","Ganesh","Dinesh","Naresh","Prakash","Harish","Kishore","Ashok","Manoj","Ajay","Vikram","Arun","Subhash","Dilip","Nandlal","Prabhu","Thakur"];
  const guardLastNames = ["Yadav","Singh","Kumar","Sharma","Gupta","Patel","Joshi","Reddy","Nair","Pillai","Verma","Mishra","Pandey","Thakur","Chauhan","Rathore","Maurya","Kulkarni","Deshmukh","Iyer"];
  const visitorFirstNames = ["Arjun","Priya","Vikram","Sneha","Rahul","Anita","Karthik","Deepa","Siddharth","Meera","Nikhil","Pooja","Varun","Nisha","Aditya","Sunita","Rohan","Kavita","Manish","Swati"];
  const visitorLastNames = ["Mehta","Kapoor","Malhotra","Bhatia","Chopra","Rao","Iyengar","Menon","Banerjee","Chatterjee","Desai","Sheth","Puri","Tandon","Bajaj"];

  const gateNames = ["Gate A - Main","Gate B - Loading","Gate C - Delivery","Gate D - Emergency","Gate E - Staff","Gate F - VIP","Gate G - Rear","Gate H - Temp"];
  const checkpoints = ["CP-1 Outer Perimeter","CP-2 Entry Barrier","CP-3 X-Ray Scanner","CP-4 Biometric","CP-5 Loading Bay","CP-6 Staff Turnstile","CP-7 Vehicle Weighbridge","CP-8 Final Exit"];
  const gatePurposes = ["Delivery","Pickup","Client Visit","Audit","Maintenance","Staff Entry","Vendor Meeting","Govt Inspection","IT Service","Waste Disposal","Fumigation","Fire Drill","Courier","Cash Transit","Equipment Demo"];
  const ranks = ["head-guard","senior-guard","guard","trainee"] as const;
  const shifts = ["morning","afternoon","night"] as const;
  const specializations = ["access-control","vehicle-inspection","cctv-monitoring","fire-safety","crowd-management","threat-assessment","first-aid","evacuation"];
  const certifications = ["PSARA Licensed","Fire Safety Cert","First Aid Certified","CCTV Operator","X-Ray Scanner","Crowd Control","Self Defence","Firearms Trained"];
  const cameraTypes = ["dome","bullet","ptz","thermal"] as const;
  const resolutions = ["1080p","2K","4K","5MP","8MP"];
  const cameraLocations = ["Main Gate Entrance","Loading Dock Area","Warehouse Interior A","Warehouse Interior B","Packing Zone","Perimeter Fence N","Perimeter Fence E","Perimeter Fence S","Perimeter Fence W","Staff Entry","Admin Block","Parking Lot","CCTV Control Room","High-Value Storage","Hazmat Zone","Emergency Exit","Weighbridge","Receiving Dock","Dispatch Bay","Cafeteria Entrance"];
  const alertTypes = ["Unauthorized Access","Perimeter Breach","Tailgating Detected","Vehicle Overstay","Unattended Baggage","Fire Alarm","CCTV Blind Spot","Badge Cloning","Forced Door Open","Lock Tamper","Motion After Hours","Temperature Anomaly","Chemical Spill","Crowd Surge","Power Failure"];
  const departments = ["Operations","IT","Admin","HR","Finance","Logistics","Warehouse","Maintenance","Quality","Security"];
  const accessPoints = ["Main Gate Turnstile","Staff Entry Door","Warehouse Side Door","Loading Bay Gate","Admin Block Door","Server Room","Hazmat Zone Door","High-Value Vault","Emergency Exit","Parking Gate"];
  const accessMethods = ["badge","biometric","rfid","mobile","pin","manual"] as const;
  const zones = ["Zone A - General","Zone B - Receiving","Zone C - Storage","Zone D - Shipping","Zone E - Admin","Zone F - Restricted","Zone G - Hazmat","Zone H - VIP"];
  const statuses5 = ["checked-in","checked-out","pending","denied","blacklisted"] as const;
  const categories5 = ["vehicle","visitor","employee","vendor","delivery"] as const;
  const secLevels = ["low","medium","high","critical"] as const;
  const guardStatuses = ["on-duty","on-break","off-duty","training"] as const;
  const cameraStatuses = ["online","offline","maintenance","recording","alert"] as const;
  const accessTypes = ["entry","exit","denied","forced","tamper"] as const;
  const alertStatuses = ["open","investigating","resolved","escalated","false-alarm"] as const;
  const alertSevs = ["critical","high","medium","low"] as const;
  const alertSources = ["CCTV AI","Manual Report","Badge System","Motion Sensor","Fire Panel","Perimeter Alarm"];
  const deviceStatuses = ["normal","flagged","malfunction"] as const;
  const causes = ["Unauthorized personnel","Equipment malfunction","False positive from AI","Tailgating by staff","Expired badge used","Camera obstruction","Network timeout","Power surge","Human error","Unknown"];
  const actions = ["Guard dispatched","CCTV footage reviewed","Badge deactivated","Lock changed","Perimeter patrol increased","System reboot","Staff counselled","Incident report filed","Escalated to management","False alarm logged"];

  function pick<T>(arr: readonly T[]): T { return arr[Math.floor(r() * arr.length)]; }
  function pickN(arr: string[], n: number): string[] { const s = new Set<string>(); while (s.size < Math.min(n, arr.length)) s.add(pick(arr)); return [...s]; }
  function phone() { return `+91 ${9000000000 + Math.floor(r() * 999999999)}`; }
  function regPlate() { return `${String.fromCharCode(65+Math.floor(r()*26))}${String.fromCharCode(65+Math.floor(r()*26))}${String.fromCharCode(65+Math.floor(r()*26))}-${Math.floor(r()*100).toString().padStart(2,"0")}-${String.fromCharCode(65+Math.floor(r()*26))}${String.fromCharCode(65+Math.floor(r()*26))}-${Math.floor(r()*10000).toString().padStart(4,"0")}`; }
  function date2025() { return `2025-${String(Math.floor(r()*12)+1).padStart(2,"0")}-${String(Math.floor(r()*28)+1).padStart(2,"0")}`; }
  function ts() { return `2025-07-28 ${String(Math.floor(r()*18)+5).padStart(2,"0")}:${String(Math.floor(r()*60)).padStart(2,"0")}:${String(Math.floor(r()*60)).padStart(2,"0")}`; }

  // Gate Entries (150)
  const gateEntries: GateEntry[] = Array.from({ length: 150 }, (_, i) => {
    const wh = pick(warehouses);
    const cat = pick(categories5);
    const fn = cat === "employee" ? pick(guardFirstNames) : pick(visitorFirstNames);
    const ln = cat === "employee" ? pick(guardLastNames) : pick(visitorLastNames);
    const cinH = Math.floor(r() * 14) + 5;
    const cinM = Math.floor(r() * 60);
    const dur = Math.floor(r() * 480) + 15;
    const st = pick(statuses5);
    return {
      id: `GE-${String(i+1).padStart(4,"0")}`, type: pick(["inbound","outbound"] as const), category: cat,
      entityName: `${fn} ${ln}`, entityPhone: phone(),
      vehicleNo: (cat === "vehicle" || cat === "delivery" || cat === "vendor") ? regPlate() : "N/A",
      purpose: pick(gatePurposes), gateNo: pick(gateNames), checkpoint: pick(checkpoints),
      warehouse: wh.name, city: wh.city, state: wh.state,
      checkInTime: `${String(cinH).padStart(2,"0")}:${String(cinM).padStart(2,"0")}`,
      checkOutTime: st !== "checked-in" ? `${String(Math.min(cinH+Math.floor(dur/60),23)).padStart(2,"0")}:${String((cinM+dur)%60).padStart(2,"0")}` : "--:--",
      duration: dur, status: st, securityLevel: pick(secLevels),
      badgeNo: `BG-${String(Math.floor(r()*9000)+1000)}`, escortRequired: r() > 0.7,
      itemsCarried: Math.floor(r() * 8),
      temperature: Math.round((36+r()*3)*10)/10, temperaturePass: r() > 0.1,
      escortName: r() > 0.7 ? `${pick(guardFirstNames)} ${pick(guardLastNames)}` : "N/A",
      remarks: r() > 0.8 ? pick(["Normal entry","VIP visitor","Govt official","First visit","Regular vendor","Contract renewal","Fire audit visit","IT maintenance"]) : "",
    };
  });

  // Security Guards (40)
  const securityGuards: SecurityGuard[] = Array.from({ length: 40 }, (_, i) => {
    const wh = pick(warehouses);
    return {
      id: `SG-${String(i+1).padStart(4,"0")}`, name: `${pick(guardFirstNames)} ${pick(guardLastNames)}`,
      phone: phone(), empCode: `SEC-${String(i+1).padStart(4,"0")}`,
      shift: pick(shifts), gateAssigned: pick(gateNames), warehouse: wh.name, city: wh.city,
      rank: pick(ranks), specialization: pickN(specializations, Math.floor(r()*3)+1),
      status: pick(guardStatuses), totalChecks: Math.floor(r()*5000)+500, checksToday: Math.floor(r()*80)+5,
      avgProcessingTime: Math.round((1+r()*5)*10)/10, incidentsHandled: Math.floor(r()*30),
      complianceScore: Math.round((70+r()*30)*10)/10, certifications: pickN(certifications, Math.floor(r()*4)+1),
      age: Math.floor(r()*25)+22, gender: r() > 0.15 ? "Male" : "Female",
      lastTraining: date2025(), licenseExpiry: `2026-${String(Math.floor(r()*12)+1).padStart(2,"0")}-${String(Math.floor(r()*28)+1).padStart(2,"0")}`,
    };
  });

  // CCTV Cameras (60)
  const cctvCameras: CCTVCamera[] = Array.from({ length: 60 }, (_, i) => {
    const wh = pick(warehouses);
    return {
      id: `CAM-${String(i+1).padStart(3,"0")}`,
      name: `${cameraLocations[i % cameraLocations.length]}${Math.floor(i / cameraLocations.length) > 0 ? " #"+(Math.floor(i/cameraLocations.length)+1) : ""}`,
      location: cameraLocations[i % cameraLocations.length],
      warehouse: wh.name, city: wh.city, type: pick(cameraTypes), resolution: pick(resolutions),
      status: pick(cameraStatuses), fov: `${Math.floor(r()*150)+30}\u00B0`,
      nightVision: r() > 0.2, aiEnabled: r() > 0.3,
      storageDays: Math.floor(r()*60)+7, lastMaintenance: date2025(),
      ipAddress: `192.168.${Math.floor(r()*10)+1}.${Math.floor(r()*254)+1}`,
      uptime: Math.round((85+r()*15)*10)/10, alertsToday: Math.floor(r()*5),
      recordingHours: Math.round((18+r()*6)*10)/10,
    };
  });

  // Access Events (100)
  const accessEvents: AccessEvent[] = Array.from({ length: 100 }, (_, i) => ({
    id: `AE-${String(i+1).padStart(5,"0")}`, userId: `USR-${String(Math.floor(r()*5000)+1000)}`,
    userName: `${pick(visitorFirstNames)} ${pick(visitorLastNames)}`,
    role: pick(departments), department: pick(departments), accessPoint: pick(accessPoints),
    warehouse: pick(warehouses).name, city: pick(warehouses).city,
    accessType: pick(accessTypes), method: pick(accessMethods),
    timestamp: ts(), zone: pick(zones), riskScore: Math.round(r()*100),
    biometricMatch: Math.round((80+r()*20)*10)/10, deviceStatus: pick(deviceStatuses),
  }));

  // Security Alerts (30)
  const securityAlerts: SecurityAlert[] = Array.from({ length: 30 }, (_, i) => {
    const st = pick(alertStatuses);
    const rt = Math.round(r()*30);
    const h = Math.floor(r()*14)+6;
    const m = Math.floor(r()*60);
    return {
      id: `SA-${String(i+1).padStart(4,"0")}`, type: pick(alertTypes), severity: pick(alertSevs),
      source: pick(alertSources), location: pick(cameraLocations),
      warehouse: pick(warehouses).name, city: pick(warehouses).city,
      timestamp: ts(), status: st,
      description: `${pick(alertTypes)} detected at ${pick(cameraLocations)} during routine monitoring`,
      assignedTo: `${pick(guardFirstNames)} ${pick(guardLastNames)}`,
      responseTime: rt,
      resolvedAt: (st === "resolved" || st === "false-alarm") ? `2025-07-28 ${String(h+Math.floor(rt/60)).padStart(2,"0")}:${String(m+rt).padStart(2,"0")}` : "--",
      rootCause: pick(causes), correctiveAction: pick(actions),
      cameraRef: `CAM-${String(Math.floor(r()*60)+1).padStart(3,"0")}`, cctvFootage: r() > 0.2,
    };
  });

  // Chart data
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const monthlyGateData = months.map((m) => ({ month: m, inbound: Math.floor(800+r()*600), outbound: Math.floor(700+r()*500), incidents: Math.floor(5+r()*20), avgResponseMin: Math.round((3+r()*10)*10)/10 }));
  const categoryBreakdown = [
    { category: "Vehicle", value: Math.floor(r()*300)+200, color: COLORS.primary },
    { category: "Visitor", value: Math.floor(r()*200)+100, color: COLORS.secondary },
    { category: "Employee", value: Math.floor(r()*500)+300, color: COLORS.accent },
    { category: "Vendor", value: Math.floor(r()*150)+80, color: COLORS.danger },
    { category: "Delivery", value: Math.floor(r()*250)+150, color: COLORS.success },
  ];
  const warehouseSecurityRadar = [
    { subject: "Gate Throughput", Mumbai: Math.floor(r()*30)+60, Delhi: Math.floor(r()*30)+60, Bengaluru: Math.floor(r()*30)+60 },
    { subject: "Response Time", Mumbai: Math.floor(r()*30)+60, Delhi: Math.floor(r()*30)+60, Bengaluru: Math.floor(r()*30)+60 },
    { subject: "CCTV Coverage", Mumbai: Math.floor(r()*30)+60, Delhi: Math.floor(r()*30)+60, Bengaluru: Math.floor(r()*30)+60 },
    { subject: "Access Compliance", Mumbai: Math.floor(r()*30)+60, Delhi: Math.floor(r()*30)+60, Bengaluru: Math.floor(r()*30)+60 },
    { subject: "Incident Resolution", Mumbai: Math.floor(r()*30)+60, Delhi: Math.floor(r()*30)+60, Bengaluru: Math.floor(r()*30)+60 },
    { subject: "Staff Training", Mumbai: Math.floor(r()*30)+60, Delhi: Math.floor(r()*30)+60, Bengaluru: Math.floor(r()*30)+60 },
  ];
  const securityLevelDist = [
    { level: "Low", count: Math.floor(r()*200)+300, color: COLORS.success },
    { level: "Medium", count: Math.floor(r()*150)+150, color: COLORS.info },
    { level: "High", count: Math.floor(r()*80)+50, color: COLORS.accent },
    { level: "Critical", count: Math.floor(r()*20)+5, color: COLORS.danger },
  ];
  const hourlyTrafficData = Array.from({ length: 17 }, (_, i) => {
    const h = i + 6;
    return { hour: `${h}:00`, inbound: h >= 7 && h <= 10 ? Math.floor(r()*40)+20 : Math.floor(r()*15)+5, outbound: h >= 16 && h <= 19 ? Math.floor(r()*40)+20 : Math.floor(r()*10)+3 };
  });
  const alertTrendData = months.map((m) => ({ month: m, critical: Math.floor(r()*5)+1, high: Math.floor(r()*10)+3, medium: Math.floor(r()*15)+5, low: Math.floor(r()*20)+10, resolved: Math.floor(r()*30)+15 }));
  const accessMethodDist = [
    { method: "Badge", count: Math.floor(r()*300)+200, color: COLORS.primary },
    { method: "Biometric", count: Math.floor(r()*200)+150, color: COLORS.secondary },
    { method: "RFID", count: Math.floor(r()*100)+80, color: COLORS.accent },
    { method: "Mobile App", count: Math.floor(r()*150)+100, color: COLORS.success },
    { method: "PIN", count: Math.floor(r()*80)+30, color: COLORS.info },
    { method: "Manual", count: Math.floor(r()*50)+20, color: COLORS.purple },
  ];

  return {
    gateEntries, securityGuards, cctvCameras, accessEvents, securityAlerts,
    monthlyGateData, categoryBreakdown, warehouseSecurityRadar, securityLevelDist, hourlyTrafficData, alertTrendData, accessMethodDist,
    months, gatePurposes, gateNames, checkpoints, specializations, certifications,
  };
}

const data = generateData();

export default function GateSecurityView() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [securityLevelFilter, setSecurityLevelFilter] = useState("all");
  const [selectedEntry, setSelectedEntry] = useState<GateEntry | null>(null);
  const [selectedGuard, setSelectedGuard] = useState<SecurityGuard | null>(null);
  const [selectedCamera, setSelectedCamera] = useState<CCTVCamera | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<SecurityAlert | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<string>("id");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [alertFilter, setAlertFilter] = useState("all");
  const [alertSevFilter, setAlertSevFilter] = useState("all");
  const [cameraStatusFilter, setCameraStatusFilter] = useState("all");
  const [accessTypeFilter, setAccessTypeFilter] = useState("all");
  const [now, setNow] = useState(new Date());

  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);

  const perPage = 12;

  const filteredEntries = useMemo(() => {
    const res = data.gateEntries.filter((e) => {
      const ms = !searchTerm || e.id.toLowerCase().includes(searchTerm.toLowerCase()) || e.entityName.toLowerCase().includes(searchTerm.toLowerCase()) || e.vehicleNo.toLowerCase().includes(searchTerm.toLowerCase()) || e.warehouse.toLowerCase().includes(searchTerm.toLowerCase());
      return ms && (statusFilter === "all" || e.status === statusFilter) && (categoryFilter === "all" || e.category === categoryFilter) && (securityLevelFilter === "all" || e.securityLevel === securityLevelFilter);
    });
    res.sort((a, b) => {
      const va = a[sortField as keyof GateEntry]; const vb = b[sortField as keyof GateEntry];
      if (typeof va === "string" && typeof vb === "string") return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
      if (typeof va === "number" && typeof vb === "number") return sortDir === "asc" ? va - vb : vb - va;
      return 0;
    });
    return res;
  }, [searchTerm, statusFilter, categoryFilter, securityLevelFilter, sortField, sortDir]);

  const pagedEntries = filteredEntries.slice((currentPage - 1) * perPage, currentPage * perPage);

  const filteredGuards = useMemo(() => {
    return data.securityGuards.filter((g) => !searchTerm || g.name.toLowerCase().includes(searchTerm.toLowerCase()) || g.empCode.toLowerCase().includes(searchTerm.toLowerCase()) || g.warehouse.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm]);

  const filteredCameras = useMemo(() => {
    return data.cctvCameras.filter((c) => (!searchTerm || c.id.toLowerCase().includes(searchTerm.toLowerCase()) || c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.warehouse.toLowerCase().includes(searchTerm.toLowerCase())) && (cameraStatusFilter === "all" || c.status === cameraStatusFilter));
  }, [searchTerm, cameraStatusFilter]);

  const filteredAccess = useMemo(() => {
    return data.accessEvents.filter((e) => (!searchTerm || e.id.toLowerCase().includes(searchTerm.toLowerCase()) || e.userName.toLowerCase().includes(searchTerm.toLowerCase()) || e.warehouse.toLowerCase().includes(searchTerm.toLowerCase())) && (accessTypeFilter === "all" || e.accessType === accessTypeFilter));
  }, [searchTerm, accessTypeFilter]);

  const filteredAlerts = useMemo(() => {
    return data.securityAlerts.filter((a) => (!searchTerm || a.id.toLowerCase().includes(searchTerm.toLowerCase()) || a.type.toLowerCase().includes(searchTerm.toLowerCase()) || a.warehouse.toLowerCase().includes(searchTerm.toLowerCase())) && (alertFilter === "all" || a.status === alertFilter) && (alertSevFilter === "all" || a.severity === alertSevFilter));
  }, [searchTerm, alertFilter, alertSevFilter]);

  const handleSort = (field: string) => { if (sortField === field) setSortDir(sortDir === "asc" ? "desc" : "asc"); else { setSortField(field); setSortDir("desc"); } };

  const kpis = [
    { label: "Total Entries Today", value: data.gateEntries.length.toString(), icon: <ScanLine size={18} />, color: COLORS.primary, trend: "+12%", up: true },
    { label: "Active Security Guards", value: data.securityGuards.filter(g => g.status === "on-duty").length.toString(), icon: <ShieldCheck size={18} />, color: COLORS.secondary, trend: "+3", up: true },
    { label: "CCTV Cameras Online", value: data.cctvCameras.filter(c => c.status === "online" || c.status === "recording").length.toString(), icon: <Camera size={18} />, color: COLORS.accent, trend: "-2", up: false },
    { label: "Open Alerts", value: data.securityAlerts.filter(a => a.status === "open" || a.status === "investigating").length.toString(), icon: <AlertTriangle size={18} />, color: COLORS.danger, trend: "+5", up: true },
    { label: "Denied Entries", value: data.gateEntries.filter(e => e.status === "denied").length.toString(), icon: <XCircle size={18} />, color: COLORS.purple, trend: "-3", up: false },
    { label: "Avg Response (min)", value: (data.securityAlerts.reduce((s, a) => s + a.responseTime, 0) / data.securityAlerts.length).toFixed(1), icon: <Timer size={18} />, color: COLORS.info, trend: "-0.5m", up: false },
  ];

  const statusBadge = (status: string): string => {
    const map: Record<string, string> = {
      "checked-in": "gse-badge-green", "checked-out": "gse-badge-blue", "pending": "gse-badge-amber", "denied": "gse-badge-red", "blacklisted": "gse-badge-red",
      "on-duty": "gse-badge-green", "on-break": "gse-badge-amber", "off-duty": "gse-badge-gray", "training": "gse-badge-purple",
      "online": "gse-badge-green", "offline": "gse-badge-red", "maintenance": "gse-badge-amber", "recording": "gse-badge-blue", "alert": "gse-badge-red",
      "open": "gse-badge-red", "investigating": "gse-badge-amber", "resolved": "gse-badge-green", "escalated": "gse-badge-red", "false-alarm": "gse-badge-gray",
      "entry": "gse-badge-green", "exit": "gse-badge-blue", "forced": "gse-badge-red", "tamper": "gse-badge-amber",
    };
    return map[status] || "gse-badge-gray";
  };
  const secLevelBadge = (level: string): string => ({ low: "gse-badge-green", medium: "gse-badge-blue", high: "gse-badge-amber", critical: "gse-badge-red" }[level] || "gse-badge-gray");

  // Helper for field grid rendering
  const FieldGrid = ({ fields }: { fields: [string, string][] }) => (
    <div className="gse-drawer-field-grid">
      {fields.map(([label, val]) => (
        <div className="gse-drawer-field" key={label}><span className="gse-field-label">{label}</span><span className="gse-field-value">{val}</span></div>
      ))}
    </div>
  );
  const MetricsRow = ({ items }: { items: [string, string, string][] }) => (
    <div className="gse-drawer-metrics">
      {items.map(([label, value, color], i) => (
        <div className="gse-metric-card" key={i} style={{ borderLeft: `4px solid ${color}` }}><span className="gse-metric-label">{label}</span><span className="gse-metric-value">{value}</span></div>
      ))}
    </div>
  );

  // DRAWERS
  const renderEntryDrawer = () => {
    if (!selectedEntry) return null;
    const e = selectedEntry;
    return (
      <>
        <div className="gse-drawer-overlay" onClick={() => setSelectedEntry(null)} />
        <div className="gse-drawer-panel">
          <div className="gse-drawer-header">
            <div className="gse-drawer-header-left">
              <ScanLine size={22} />
              <div>
                <h3>Gate Entry {e.id}</h3>
                <span className="gse-drawer-subtitle">{e.warehouse} | {e.gateNo}</span>
              </div>
            </div>
            <button className="gse-drawer-close" onClick={() => setSelectedEntry(null)}><XCircle size={20} /></button>
          </div>
          <div className="gse-drawer-body">
            <FieldGrid fields={[
              ["Entity", e.entityName], ["Phone", e.entityPhone],
              ["Category", e.category.charAt(0).toUpperCase() + e.category.slice(1)],
              ["Vehicle No", e.vehicleNo], ["Purpose", e.purpose], ["Gate", e.gateNo],
              ["Checkpoint", e.checkpoint], ["City", `${e.city}, ${e.state}`],
              ["Check In", e.checkInTime], ["Check Out", e.checkOutTime],
              ["Duration", formatDuration(e.duration)], ["Badge No", e.badgeNo],
              ["Temperature", `${e.temperature}\u00B0C ${e.temperaturePass ? "\u2713" : "\u2717"}`],
              ["Security Level", e.securityLevel.charAt(0).toUpperCase() + e.securityLevel.slice(1)],
              ["Escort Required", e.escortRequired ? "Yes" : "No"], ["Items Carried", e.itemsCarried.toString()],
            ]} />
            <div className="gse-drawer-metrics">
              <div className="gse-metric-card" style={{ borderLeft: `4px solid ${COLORS.primary}` }}><span className="gse-metric-label">Status</span><span className="gse-metric-value"><span className={statusBadge(e.status)}>{e.status.replace(/-/g," ").toUpperCase()}</span></span></div>
              <div className="gse-metric-card" style={{ borderLeft: `4px solid ${COLORS.secondary}` }}><span className="gse-metric-label">Type</span><span className="gse-metric-value">{e.type.toUpperCase()}</span></div>
              <div className="gse-metric-card" style={{ borderLeft: `4px solid ${COLORS.accent}` }}><span className="gse-metric-label">Escort</span><span className="gse-metric-value">{e.escortName}</span></div>
            </div>
            {e.remarks && <div className="gse-drawer-notes"><span className="gse-notes-label">Remarks</span><p className="gse-notes-text">{e.remarks}</p></div>}
            <div className="gse-drawer-actions">
              <button className="gse-action-btn gse-action-primary"><CheckCircle2 size={16} /> Approve Entry</button>
              <button className="gse-action-btn gse-action-danger"><XCircle size={16} /> Deny Entry</button>
              <button className="gse-action-btn gse-action-secondary"><ClipboardList size={16} /> Log Incident</button>
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderGuardDrawer = () => {
    if (!selectedGuard) return null;
    const g = selectedGuard;
    return (
      <>
        <div className="gse-drawer-overlay" onClick={() => setSelectedGuard(null)} />
        <div className="gse-drawer-panel">
          <div className="gse-drawer-header">
            <div className="gse-drawer-header-left">
              <ShieldCheck size={22} />
              <div>
                <h3>{g.name}</h3>
                <span className="gse-drawer-subtitle">{g.empCode} | {g.rank.replace(/-/g," ").toUpperCase()}</span>
              </div>
            </div>
            <button className="gse-drawer-close" onClick={() => setSelectedGuard(null)}><XCircle size={20} /></button>
          </div>
          <div className="gse-drawer-body">
            <FieldGrid fields={[
              ["Phone", g.phone], ["Shift", g.shift.toUpperCase()], ["Gate Assigned", g.gateAssigned],
              ["Warehouse", g.warehouse], ["City", g.city], ["Age", g.age.toString()],
              ["Gender", g.gender], ["Last Training", g.lastTraining], ["License Expiry", g.licenseExpiry],
              ["Rank", g.rank.replace(/-/g," ").toUpperCase()],
            ]} />
            <MetricsRow items={[
              ["Checks Today", g.checksToday.toString(), COLORS.primary],
              ["Compliance Score", `${g.complianceScore}%`, COLORS.secondary],
              ["Incidents Handled", g.incidentsHandled.toString(), COLORS.accent],
            ]} />
            <div className="gse-drawer-tags">
              <span className="gse-tag-label">Specializations</span>
              <div className="gse-tag-container">{g.specialization.map((s) => <span className="gse-tag" key={s}>{s.replace(/-/g," ")}</span>)}</div>
            </div>
            <div className="gse-drawer-tags">
              <span className="gse-tag-label">Certifications</span>
              <div className="gse-tag-container">{g.certifications.map((c) => <span className="gse-tag gse-tag-cert" key={c}>{c}</span>)}</div>
            </div>
            <div className="gse-drawer-actions">
              <button className="gse-action-btn gse-action-primary"><UserCheck size={16} /> Assign Shift</button>
              <button className="gse-action-btn gse-action-secondary"><ClipboardList size={16} /> Schedule Training</button>
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderCameraDrawer = () => {
    if (!selectedCamera) return null;
    const c = selectedCamera;
    return (
      <>
        <div className="gse-drawer-overlay" onClick={() => setSelectedCamera(null)} />
        <div className="gse-drawer-panel">
          <div className="gse-drawer-header">
            <div className="gse-drawer-header-left">
              <Camera size={22} />
              <div>
                <h3>{c.name}</h3>
                <span className="gse-drawer-subtitle">{c.id} | {c.warehouse}</span>
              </div>
            </div>
            <button className="gse-drawer-close" onClick={() => setSelectedCamera(null)}><XCircle size={20} /></button>
          </div>
          <div className="gse-drawer-body">
            <FieldGrid fields={[
              ["Location", c.location], ["Type", c.type.toUpperCase()], ["Resolution", c.resolution],
              ["FOV", c.fov], ["City", c.city], ["IP Address", c.ipAddress],
              ["Last Maintenance", c.lastMaintenance], ["Storage Days", `${c.storageDays} days`],
              ["Recording Hours", `${c.recordingHours}h/day`], ["Alerts Today", c.alertsToday.toString()],
            ]} />
            <MetricsRow items={[
              ["Uptime", `${c.uptime}%`, COLORS.primary],
              ["Night Vision", c.nightVision ? "Enabled" : "Disabled", COLORS.success],
              ["AI Enabled", c.aiEnabled ? "Enabled" : "Disabled", COLORS.secondary],
            ]} />
            <div className="gse-drawer-actions">
              <button className="gse-action-btn gse-action-primary"><Eye size={16} /> View Live Feed</button>
              <button className="gse-action-btn gse-action-secondary"><FileText size={16} /> Download Footage</button>
              <button className="gse-action-btn gse-action-danger"><AlertTriangle size={16} /> Report Issue</button>
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderAlertDrawer = () => {
    if (!selectedAlert) return null;
    const a = selectedAlert;
    return (
      <>
        <div className="gse-drawer-overlay" onClick={() => setSelectedAlert(null)} />
        <div className="gse-drawer-panel">
          <div className="gse-drawer-header">
            <div className="gse-drawer-header-left">
              <AlertTriangle size={22} />
              <div>
                <h3>Alert {a.id}</h3>
                <span className="gse-drawer-subtitle">{a.type} | {a.severity.toUpperCase()}</span>
              </div>
            </div>
            <button className="gse-drawer-close" onClick={() => setSelectedAlert(null)}><XCircle size={20} /></button>
          </div>
          <div className="gse-drawer-body">
            <FieldGrid fields={[
              ["Source", a.source], ["Location", a.location], ["Warehouse", a.warehouse],
              ["City", a.city], ["Timestamp", a.timestamp], ["Assigned To", a.assignedTo],
              ["Response Time", `${a.responseTime} min`], ["Camera Ref", a.cameraRef],
              ["CCTV Footage", a.cctvFootage ? "Available" : "Not Available"],
              ["Resolved At", a.resolvedAt], ["Status", a.status.replace(/-/g," ").toUpperCase()],
            ]} />
            <MetricsRow items={[
              ["Severity", a.severity.toUpperCase(), a.severity === "critical" ? COLORS.danger : a.severity === "high" ? COLORS.accent : COLORS.info],
              ["Risk Level", a.severity === "critical" ? "EXTREME" : a.severity === "high" ? "HIGH" : a.severity === "medium" ? "MODERATE" : "LOW", COLORS.accent],
              ["Response", `${a.responseTime} min`, COLORS.info],
            ]} />
            <div className="gse-drawer-notes"><span className="gse-notes-label">Description</span><p className="gse-notes-text">{a.description}</p></div>
            <div className="gse-drawer-notes"><span className="gse-notes-label">Root Cause</span><p className="gse-notes-text">{a.rootCause}</p></div>
            <div className="gse-drawer-notes"><span className="gse-notes-label">Corrective Action</span><p className="gse-notes-text">{a.correctiveAction}</p></div>
            <div className="gse-drawer-actions">
              <button className="gse-action-btn gse-action-primary"><CheckCircle2 size={16} /> Resolve Alert</button>
              <button className="gse-action-btn gse-action-danger"><ArrowUpRight size={16} /> Escalate</button>
              <button className="gse-action-btn gse-action-secondary"><FileText size={16} /> Generate Report</button>
            </div>
          </div>
        </div>
      </>
    );
  };

  // TAB 0: DASHBOARD
  const renderDashboard = () => (
    <div className="gse-tab-content">
      <div className="gse-live-clock">
        <Clock size={16} />
        <span>{now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true })}</span>
        <span className="gse-clock-date">{now.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}</span>
      </div>
      <div className="gse-kpi-grid">
        {kpis.map((k) => (
          <div className="gse-kpi-card" key={k.label}>
            <div className="gse-kpi-icon" style={{ backgroundColor: k.color + "18" }}><span style={{ color: k.color }}>{k.icon}</span></div>
            <div className="gse-kpi-info"><span className="gse-kpi-value">{k.value}</span><span className="gse-kpi-label">{k.label}</span></div>
            <span className={`gse-kpi-trend ${k.up ? "gse-trend-up" : "gse-trend-down"}`}>{k.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}{k.trend}</span>
          </div>
        ))}
      </div>
      <div className="gse-charts-grid">
        <div className="gse-chart-card gse-chart-lg">
          <h4 className="gse-chart-title">Monthly Gate Traffic & Incidents</h4>
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={data.monthlyGateData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: 8 }} />
              <Legend />
              <Bar dataKey="inbound" name="Inbound" fill={COLORS.primary} radius={[4,4,0,0]} />
              <Bar dataKey="outbound" name="Outbound" fill={COLORS.secondary} radius={[4,4,0,0]} />
              <Bar dataKey="incidents" name="Incidents" fill={COLORS.danger} radius={[4,4,0,0]} />
              <Line type="monotone" dataKey="avgResponseMin" name="Avg Response (min)" stroke={COLORS.accent} strokeWidth={2} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div className="gse-chart-card">
          <h4 className="gse-chart-title">Entry Category Distribution</h4>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={data.categoryBreakdown} cx="50%" cy="50%" outerRadius={80} dataKey="value" nameKey="category" label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}>
                {data.categoryBreakdown.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="gse-chart-card">
          <h4 className="gse-chart-title">Warehouse Security Radar</h4>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={data.warehouseSecurityRadar}>
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: "#94a3b8", fontSize: 10 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#94a3b8", fontSize: 10 }} />
              <Radar name="Mumbai" dataKey="Mumbai" stroke={COLORS.primary} fill={COLORS.primary} fillOpacity={0.15} />
              <Radar name="Delhi NCR" dataKey="Delhi" stroke={COLORS.secondary} fill={COLORS.secondary} fillOpacity={0.15} />
              <Radar name="Bengaluru" dataKey="Bengaluru" stroke={COLORS.accent} fill={COLORS.accent} fillOpacity={0.15} />
              <Legend />
              <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: 8 }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div className="gse-chart-card">
          <h4 className="gse-chart-title">Security Level Distribution</h4>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data.securityLevelDist}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="level" tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: 8 }} />
              <Bar dataKey="count" name="Entries" radius={[4,4,0,0]}>
                {data.securityLevelDist.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="gse-chart-card">
          <h4 className="gse-chart-title">Hourly Traffic Flow</h4>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={data.hourlyTrafficData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="hour" tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: 8 }} />
              <Legend />
              <Area type="monotone" dataKey="inbound" name="Inbound" stroke={COLORS.primary} fill={COLORS.primary} fillOpacity={0.2} />
              <Area type="monotone" dataKey="outbound" name="Outbound" stroke={COLORS.secondary} fill={COLORS.secondary} fillOpacity={0.2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  // TAB 1: GATE ENTRIES
  const renderGateEntries = () => (
    <div className="gse-tab-content">
      <div className="gse-section-header">
        <h3 className="gse-section-title">Gate Entry Log</h3>
        <div className="gse-filters">
          <div className="gse-search-box"><Search size={16} /><input type="text" placeholder="Search by ID, name, vehicle, warehouse..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} /></div>
          <select className="gse-filter-select" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}><option value="all">All Status</option><option value="checked-in">Checked In</option><option value="checked-out">Checked Out</option><option value="pending">Pending</option><option value="denied">Denied</option><option value="blacklisted">Blacklisted</option></select>
          <select className="gse-filter-select" value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}><option value="all">All Categories</option><option value="vehicle">Vehicle</option><option value="visitor">Visitor</option><option value="employee">Employee</option><option value="vendor">Vendor</option><option value="delivery">Delivery</option></select>
          <select className="gse-filter-select" value={securityLevelFilter} onChange={(e) => { setSecurityLevelFilter(e.target.value); setCurrentPage(1); }}><option value="all">All Security Levels</option><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="critical">Critical</option></select>
        </div>
      </div>
      <div className="gse-table-wrapper">
        <table className="gse-table">
          <thead><tr>
            {[
              {h:"ID",f:"id"},{h:"Type",f:"type"},{h:"Category",f:"category"},{h:"Entity",f:"entityName"},
              {h:"Vehicle No",f:"vehicleNo"},{h:"Purpose",f:"purpose"},{h:"Gate",f:"gateNo"},{h:"Warehouse",f:"warehouse"},
              {h:"Security",f:"securityLevel"},{h:"Check In",f:"checkInTime"},{h:"Status",f:"status"}
            ].map((col) => (
              <th key={col.h} className="gse-sortable-th" onClick={() => handleSort(col.f)}>
                {col.h}{sortField === col.f && <span className="gse-sort-icon">{sortDir === "asc" ? "\u25B2" : "\u25BC"}</span>}
              </th>
            ))}
          </tr></thead>
          <tbody>
            {pagedEntries.map((e) => (
              <tr key={e.id} className="gse-table-row" onClick={() => setSelectedEntry(e)}>
                <td className="gse-mono">{e.id}</td>
                <td><span className={`gse-type-badge ${e.type === "inbound" ? "gse-type-in" : "gse-type-out"}`}>{e.type === "inbound" ? "\u25BC IN" : "\u25B2 OUT"}</span></td>
                <td>{e.category.charAt(0).toUpperCase() + e.category.slice(1)}</td>
                <td className="gse-bold">{e.entityName}</td>
                <td className="gse-mono">{e.vehicleNo}</td>
                <td>{e.purpose}</td>
                <td>{e.gateNo}</td>
                <td>{e.city}</td>
                <td><span className={secLevelBadge(e.securityLevel)}>{e.securityLevel.toUpperCase()}</span></td>
                <td className="gse-mono">{e.checkInTime}</td>
                <td><span className={statusBadge(e.status)}>{e.status.replace(/-/g," ")}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="gse-pagination">
        <span className="gse-page-info">Showing {(currentPage - 1) * perPage + 1}-{Math.min(currentPage * perPage, filteredEntries.length)} of {filteredEntries.length}</span>
        <div className="gse-page-buttons">
          <button className="gse-page-btn" disabled={currentPage === 1} onClick={() => setCurrentPage(1)}>First</button>
          <button className="gse-page-btn" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Prev</button>
          <button className="gse-page-btn gse-page-active">{currentPage}</button>
          <button className="gse-page-btn" disabled={currentPage >= Math.ceil(filteredEntries.length / perPage)} onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
          <button className="gse-page-btn" disabled={currentPage >= Math.ceil(filteredEntries.length / perPage)} onClick={() => setCurrentPage(Math.ceil(filteredEntries.length / perPage))}>Last</button>
        </div>
      </div>
    </div>
  );

  // TAB 2: SECURITY PERSONNEL
  const renderSecurityPersonnel = () => {
    const onDuty = data.securityGuards.filter(g => g.status === "on-duty").length;
    const avgComp = (data.securityGuards.reduce((s, g) => s + g.complianceScore, 0) / data.securityGuards.length).toFixed(1);
    return (
      <div className="gse-tab-content">
        <div className="gse-section-header">
          <h3 className="gse-section-title">Security Personnel</h3>
          <div className="gse-filters">
            <div className="gse-search-box"><Search size={16} /><input type="text" placeholder="Search by name, code, warehouse..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
          </div>
        </div>
        <div className="gse-guard-stats">
          <div className="gse-guard-stat-card"><span className="gse-guard-stat-value">{data.securityGuards.length}</span><span className="gse-guard-stat-label">Total Guards</span></div>
          <div className="gse-guard-stat-card"><span className="gse-guard-stat-value" style={{ color: COLORS.success }}>{onDuty}</span><span className="gse-guard-stat-label">On Duty</span></div>
          <div className="gse-guard-stat-card"><span className="gse-guard-stat-value" style={{ color: COLORS.accent }}>{data.securityGuards.filter(g => g.status === "on-break").length}</span><span className="gse-guard-stat-label">On Break</span></div>
          <div className="gse-guard-stat-card"><span className="gse-guard-stat-value">{avgComp}%</span><span className="gse-guard-stat-label">Avg Compliance</span></div>
        </div>
        <div className="gse-card-grid">
          {filteredGuards.map((g) => (
            <div className="gse-guard-card" key={g.id} onClick={() => setSelectedGuard(g)}>
              <div className="gse-guard-card-header">
                <div className="gse-guard-avatar">{g.name.split(" ").map(n => n[0]).join("").slice(0, 2)}</div>
                <div className="gse-guard-card-info">
                  <span className="gse-guard-name">{g.name}</span>
                  <span className="gse-guard-code">{g.empCode} | {g.rank.replace(/-/g," ")}</span>
                </div>
                <span className={`gse-guard-status-dot ${g.status === "on-duty" ? "gse-dot-green" : g.status === "on-break" ? "gse-dot-amber" : "gse-dot-gray"}`} title={g.status} />
              </div>
              <div className="gse-guard-card-details">
                <div className="gse-guard-detail-row"><MapPin size={14} /><span>{g.warehouse} | {g.gateAssigned}</span></div>
                <div className="gse-guard-detail-row"><Clock size={14} /><span>{g.shift.toUpperCase()} Shift</span></div>
              </div>
              <div className="gse-guard-card-bars">
                <div className="gse-bar-row"><span>Compliance</span><div className="gse-bar-bg"><div className="gse-bar-fill" style={{ width: `${g.complianceScore}%`, backgroundColor: g.complianceScore >= 85 ? COLORS.success : g.complianceScore >= 70 ? COLORS.accent : COLORS.danger }} /></div><span>{g.complianceScore}%</span></div>
                <div className="gse-bar-row"><span>Checks Today</span><div className="gse-bar-bg"><div className="gse-bar-fill" style={{ width: `${Math.min(g.checksToday, 80) / 80 * 100}%`, backgroundColor: COLORS.secondary }} /></div><span>{g.checksToday}</span></div>
              </div>
              <div className="gse-guard-card-tags">{g.specialization.slice(0, 2).map((s) => <span className="gse-mini-tag" key={s}>{s.replace(/-/g," ")}</span>)}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // TAB 3: CCTV SURVEILLANCE
  const renderCCTV = () => {
    const onlineCt = data.cctvCameras.filter(c => c.status === "online" || c.status === "recording").length;
    return (
      <div className="gse-tab-content">
        <div className="gse-section-header">
          <h3 className="gse-section-title">CCTV Surveillance</h3>
          <div className="gse-filters">
            <div className="gse-search-box"><Search size={16} /><input type="text" placeholder="Search by camera ID, name, warehouse..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
            <select className="gse-filter-select" value={cameraStatusFilter} onChange={(e) => setCameraStatusFilter(e.target.value)}><option value="all">All Status</option><option value="online">Online</option><option value="recording">Recording</option><option value="offline">Offline</option><option value="maintenance">Maintenance</option><option value="alert">Alert</option></select>
          </div>
        </div>
        <div className="gse-cctv-stats">
          <div className="gse-cctv-stat-card"><Monitor size={22} style={{ color: COLORS.primary }} /><div><span className="gse-cctv-stat-value">{data.cctvCameras.length}</span><span className="gse-cctv-stat-label">Total Cameras</span></div></div>
          <div className="gse-cctv-stat-card"><Eye size={22} style={{ color: COLORS.success }} /><div><span className="gse-cctv-stat-value">{onlineCt}</span><span className="gse-cctv-stat-label">Online/Recording</span></div></div>
          <div className="gse-cctv-stat-card"><XCircle size={22} style={{ color: COLORS.danger }} /><div><span className="gse-cctv-stat-value">{data.cctvCameras.filter(c => c.status === "offline").length}</span><span className="gse-cctv-stat-label">Offline</span></div></div>
          <div className="gse-cctv-stat-card"><Fingerprint size={22} style={{ color: COLORS.secondary }} /><div><span className="gse-cctv-stat-value">{data.cctvCameras.filter(c => c.aiEnabled).length}</span><span className="gse-cctv-stat-label">AI-Enabled</span></div></div>
        </div>
        <div className="gse-card-grid">
          {filteredCameras.map((c) => (
            <div className="gse-camera-card" key={c.id} onClick={() => setSelectedCamera(c)}>
              <div className="gse-camera-card-header">
                <div className="gse-camera-icon-wrapper"><Camera size={20} /></div>
                <div className="gse-camera-card-info">
                  <span className="gse-camera-name">{c.id} - {c.name}</span>
                  <span className="gse-camera-location">{c.warehouse} | {c.location}</span>
                </div>
                <span className={statusBadge(c.status)}>{c.status.toUpperCase()}</span>
              </div>
              <div className="gse-camera-card-details">
                <div className="gse-camera-detail-item"><span>Type</span><span className="gse-camera-badge">{c.type.toUpperCase()}</span></div>
                <div className="gse-camera-detail-item"><span>Resolution</span><span>{c.resolution}</span></div>
                <div className="gse-camera-detail-item"><span>FOV</span><span>{c.fov}</span></div>
                <div className="gse-camera-detail-item"><span>Storage</span><span>{c.storageDays} days</span></div>
              </div>
              <div className="gse-camera-card-bars">
                <div className="gse-bar-row"><span>Uptime</span><div className="gse-bar-bg"><div className="gse-bar-fill" style={{ width: `${c.uptime}%`, backgroundColor: c.uptime >= 95 ? COLORS.success : c.uptime >= 90 ? COLORS.accent : COLORS.danger }} /></div><span>{c.uptime}%</span></div>
              </div>
              <div className="gse-camera-card-features">
                {c.nightVision && <span className="gse-camera-feature"><Eye size={14} /> Night Vision</span>}
                {c.aiEnabled && <span className="gse-camera-feature gse-ai-badge"><Fingerprint size={14} /> AI Enabled</span>}
              </div>
              <div className="gse-camera-card-footer">
                <span className="gse-mono">IP: {c.ipAddress}</span>
                <span className="gse-mono">Recording: {c.recordingHours}h/day</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // TAB 4: ACCESS CONTROL
  const renderAccessControl = () => (
    <div className="gse-tab-content">
      <div className="gse-section-header">
        <h3 className="gse-section-title">Access Control Log</h3>
        <div className="gse-filters">
          <div className="gse-search-box"><Search size={16} /><input type="text" placeholder="Search by ID, user, warehouse..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
          <select className="gse-filter-select" value={accessTypeFilter} onChange={(e) => setAccessTypeFilter(e.target.value)}><option value="all">All Types</option><option value="entry">Entry</option><option value="exit">Exit</option><option value="denied">Denied</option><option value="forced">Forced</option><option value="tamper">Tamper</option></select>
        </div>
      </div>
      <div className="gse-charts-grid" style={{ marginBottom: "1.5rem" }}>
        <div className="gse-chart-card">
          <h4 className="gse-chart-title">Alert Trend by Severity</h4>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data.alertTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: 8 }} />
              <Legend />
              <Bar dataKey="critical" name="Critical" stackId="a" fill={COLORS.danger} />
              <Bar dataKey="high" name="High" stackId="a" fill={COLORS.accent} />
              <Bar dataKey="medium" name="Medium" stackId="a" fill={COLORS.info} />
              <Bar dataKey="low" name="Low" stackId="a" fill={COLORS.success} />
              <Line type="monotone" dataKey="resolved" name="Resolved" stroke={COLORS.primary} strokeWidth={2} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="gse-chart-card">
          <h4 className="gse-chart-title">Access Method Distribution</h4>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={data.accessMethodDist} cx="50%" cy="50%" outerRadius={80} dataKey="count" nameKey="method" label={({ method, percent }) => `${method} ${(percent * 100).toFixed(0)}%`}>
                {data.accessMethodDist.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="gse-table-wrapper">
        <table className="gse-table">
          <thead><tr>
            {["ID","Timestamp","User","Role","Access Point","Zone","Method","Type","Biometric %","Risk"].map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {filteredAccess.slice(0, 50).map((e) => (
              <tr key={e.id} className="gse-table-row">
                <td className="gse-mono">{e.id}</td>
                <td className="gse-mono">{e.timestamp}</td>
                <td className="gse-bold">{e.userName}</td>
                <td>{e.department}</td>
                <td>{e.accessPoint}</td>
                <td>{e.zone}</td>
                <td><span className="gse-method-badge">{e.method.toUpperCase()}</span></td>
                <td><span className={statusBadge(e.accessType)}>{e.accessType.toUpperCase()}</span></td>
                <td><div className="gse-bar-bg gse-bar-sm"><div className="gse-bar-fill" style={{ width: `${e.biometricMatch}%`, backgroundColor: e.biometricMatch >= 95 ? COLORS.success : e.biometricMatch >= 85 ? COLORS.accent : COLORS.danger }} /><span className="gse-bar-value">{e.biometricMatch}%</span></div></td>
                <td><span className={`gse-risk-badge ${e.riskScore >= 80 ? "gse-risk-high" : e.riskScore >= 50 ? "gse-risk-medium" : "gse-risk-low"}`}>{e.riskScore}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // TAB 5: ALERTS & INCIDENTS
  const renderAlerts = () => (
    <div className="gse-tab-content">
      <div className="gse-section-header">
        <h3 className="gse-section-title">Security Alerts & Incidents</h3>
        <div className="gse-filters">
          <div className="gse-search-box"><Search size={16} /><input type="text" placeholder="Search by ID, type, warehouse..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
          <select className="gse-filter-select" value={alertFilter} onChange={(e) => setAlertFilter(e.target.value)}><option value="all">All Status</option><option value="open">Open</option><option value="investigating">Investigating</option><option value="resolved">Resolved</option><option value="escalated">Escalated</option><option value="false-alarm">False Alarm</option></select>
          <select className="gse-filter-select" value={alertSevFilter} onChange={(e) => setAlertSevFilter(e.target.value)}><option value="all">All Severity</option><option value="critical">Critical</option><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option></select>
        </div>
      </div>
      <div className="gse-card-grid">
        {filteredAlerts.map((a) => (
          <div className="gse-alert-card" key={a.id} onClick={() => setSelectedAlert(a)}>
            <div className="gse-alert-card-header">
              <div className="gse-alert-icon-wrapper" style={{ backgroundColor: a.severity === "critical" ? COLORS.danger + "22" : a.severity === "high" ? COLORS.accent + "22" : COLORS.info + "22" }}>
                <AlertTriangle size={20} style={{ color: a.severity === "critical" ? COLORS.danger : a.severity === "high" ? COLORS.accent : COLORS.info }} />
              </div>
              <div className="gse-alert-card-info">
                <span className="gse-alert-title">{a.id} - {a.type}</span>
                <span className="gse-alert-location">{a.warehouse} | {a.location}</span>
              </div>
              <span className={`gse-sev-badge gse-sev-${a.severity}`}>{a.severity.toUpperCase()}</span>
            </div>
            <div className="gse-alert-card-body">
              <p className="gse-alert-desc">{a.description.slice(0, 100)}{a.description.length > 100 ? "..." : ""}</p>
              <div className="gse-alert-meta">
                <span><Clock size={14} /> {a.timestamp}</span>
                <span><Fingerprint size={14} /> {a.source}</span>
                <span><Timer size={14} /> {a.responseTime}min response</span>
              </div>
            </div>
            <div className="gse-alert-card-footer">
              <span className={statusBadge(a.status)}>{a.status.replace(/-/g," ")}</span>
              <span>Assigned: {a.assignedTo}</span>
              {a.cctvFootage && <span className="gse-cctv-badge"><Camera size={14} /> CCTV Available</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // MAIN RENDER
  return (
    <div className="gse-container">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="gse-tabs-list">
          <TabsTrigger value="dashboard" className="gse-tab-trigger"><Activity size={16} /> Dashboard</TabsTrigger>
          <TabsTrigger value="entries" className="gse-tab-trigger"><ScanLine size={16} /> Gate Entries</TabsTrigger>
          <TabsTrigger value="personnel" className="gse-tab-trigger"><ShieldCheck size={16} /> Personnel</TabsTrigger>
          <TabsTrigger value="cctv" className="gse-tab-trigger"><Camera size={16} /> CCTV</TabsTrigger>
          <TabsTrigger value="access" className="gse-tab-trigger"><Fingerprint size={16} /> Access Control</TabsTrigger>
          <TabsTrigger value="alerts" className="gse-tab-trigger"><AlertTriangle size={16} /> Alerts</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard">{renderDashboard()}</TabsContent>
        <TabsContent value="entries">{renderGateEntries()}</TabsContent>
        <TabsContent value="personnel">{renderSecurityPersonnel()}</TabsContent>
        <TabsContent value="cctv">{renderCCTV()}</TabsContent>
        <TabsContent value="access">{renderAccessControl()}</TabsContent>
        <TabsContent value="alerts">{renderAlerts()}</TabsContent>
      </Tabs>
      {renderEntryDrawer()}
      {renderGuardDrawer()}
      {renderCameraDrawer()}
      {renderAlertDrawer()}
    </div>
  );
}
