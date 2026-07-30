"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  ComposedChart, Bar, BarChart, Line, AreaChart, Area, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BrainCircuit, Users, Clock, TrendingUp, Activity, DollarSign, AlertTriangle, CheckCircle2, XCircle,
  Search, Eye, ArrowUpRight, ArrowDownRight, Package, CalendarRange, Gauge, Factory,
  ChevronLeft, ChevronRight, Filter, Target, Zap, BarChart3, UserCog, Star, X, FileText, ThermometerSun,
} from "lucide-react";

// ===== TYPES =====
interface LaborForecast {
  id: string; warehouse: string; city: string;
  month: string; year: number;
  zone: string; shift: "morning" | "afternoon" | "night";
  role: string;
  currentHeadcount: number; requiredHeadcount: number; gap: number;
  forecastAccuracy: number; workloadIndex: number; overtimeHours: number;
  costPerWorker: number; totalCost: number;
  productivity: number; attritionRisk: number;
}

interface ShiftSchedule {
  id: string; warehouse: string; city: string;
  date: string; shift: "morning" | "afternoon" | "night";
  supervisor: string; zone: string;
  plannedWorkers: number; actualWorkers: number; attendance: number;
  targetUnits: number; achievedUnits: number; efficiency: number;
  overtimeCount: number; incidentCount: number;
  status: "planned" | "in-progress" | "completed" | "short-staffed" | "overstaffed";
}

interface SkillMatrix {
  id: string; employeeName: string; employeeId: string;
  warehouse: string; city: string;
  department: string; role: string; experienceYears: number;
  forklift: number; picking: number; packing: number; quality: number;
  receiving: number; shipping: number; inventory: number; leadership: number;
  overallScore: number; certificationExpiry: string; trainingDue: string;
}

interface OvertimeRecord {
  id: string; employeeName: string; employeeId: string;
  warehouse: string; city: string;
  date: string; shift: "morning" | "afternoon" | "night";
  department: string; role: string;
  regularHours: number; overtimeHours: number; totalHours: number;
  overtimeReason: string; approvedBy: string;
  cost: number; isExcessive: boolean;
}

interface LaborCost {
  id: string; warehouse: string; city: string;
  month: string; year: number;
  department: string;
  regularCost: number; overtimeCost: number; tempStaffCost: number;
  trainingCost: number; benefitsCost: number;
  totalCost: number; costPerUnit: number; budgetVariance: number;
  headcount: number; avgSalary: number;
}

// ===== CONSTANTS =====
const COLORS = { primary: "#0ea5e9", secondary: "#8b5cf6", accent: "#f97316", danger: "#ef4444", success: "#22c55e", info: "#3b82f6", purple: "#a855f7", pink: "#ec4899", teal: "#14b8a6", amber: "#f59e0b" };
const PIE_COLORS = ["#0ea5e9", "#8b5cf6", "#f97316", "#22c55e", "#ef4444", "#14b8a6", "#a855f7", "#ec4899"];

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

function seededRandom(seed: number) {
  let s = seed;
  return function (min = 0, max = 1) {
    s = (s * 16807) % 2147483647;
    return min + (s / 2147483647) * (max - min);
  };
}

// ===== GENERATE DATA =====
function generateData() {
  const r = seededRandom(174);

  const names = ["Rajesh Kumar","Suresh Yadav","Mohan Singh","Ravi Sharma","Amit Patel","Vijay Gupta","Sunil Reddy","Deepak Joshi","Sanjay Nair","Pradeep Pillai","Krishna Verma","Anil Mishra","Ramesh Pandey","Mahesh Thakur","Ganesh Rathore","Dinesh Maurya","Naresh Kulkarni","Prakash Deshmukh","Harish Iyer","Kishore Rao","Ashok Das","Manoj Chauhan","Ajay Bose","Vikram Mukherjee","Arun Sen","Subhash Dey","Dilip Banerjee","Bhagwat Ghosh","Prabhu Saha","Thakur Mandal","Gopal Nayak","Lakshman Kar","Raju Goyal","Soma Agarwal","Tukaram Bhatt","Balaji Hegde","Murugan Pillai","Kannan Swamy","Selvan Naidu","Kumar Ranganathan","Venkat Rao","Prasad Kulkarni","Madhav Menon","Nandu Iyer","Shankar Reddy"];
  const zones = ["Zone A - Receiving","Zone B - Putaway","Zone C - Picking","Zone D - Packing","Zone E - Shipping","Zone F - QC","Zone G - Returns","Zone H - Cold Storage"];
  const departments = ["Inbound","Outbound","Picking","Packing","QC","Shipping","Receiving","Returns","Cold Chain","Admin"];
  const roles = ["Warehouse Associate","Forklift Operator","Picker","Packer","QC Inspector","Shift Supervisor","Team Lead","Material Handler","Loader","Inventory Clerk","Returns Processor","Cold Chain Operator"];
  const shifts = ["morning","afternoon","night"] as const;
  const scheduleStatuses = ["planned","in-progress","completed","short-staffed","overstaffed"] as const;
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const reasons = ["Peak season demand","Staff absenteeism","Equipment breakdown coverage","Order surge","Training sessions","Year-end processing","Festival rush","Warehouse relocation support","Special project","Client audit preparation"];
  const approvers = ["Operations Manager","HR Manager","Warehouse Manager","Shift In-charge"];

  function pick<T>(arr: readonly T[]): T { return arr[Math.floor(r() * arr.length)]; }
  function date2025() { return `2025-${String(Math.floor(r()*12)+1).padStart(2,"0")}-${String(Math.floor(r()*28)+1).padStart(2,"0")}`; }

  // Labor Forecasts (80)
  const forecasts: LaborForecast[] = Array.from({ length: 80 }, (_, i) => {
    const wh = pick(warehouses);
    const current = Math.floor(r() * 60) + 15;
    const required = Math.floor(r() * 40) + 20;
    return {
      id: `LF-${String(i + 1).padStart(4, "0")}`,
      warehouse: wh.name, city: wh.city,
      month: pick(months), year: 2025,
      zone: pick(zones), shift: pick(shifts), role: pick(roles),
      currentHeadcount: current, requiredHeadcount: required, gap: required - current,
      forecastAccuracy: Math.round((70 + r() * 28) * 10) / 10,
      workloadIndex: Math.round((30 + r() * 70) * 10) / 10,
      overtimeHours: Math.round((0 + r() * 120)),
      costPerWorker: Math.round((800 + r() * 1500)),
      totalCost: Math.round((500000 + r() * 4500000)),
      productivity: Math.round((60 + r() * 35) * 10) / 10,
      attritionRisk: Math.round(r() * 100),
    };
  });

  // Shift Schedules (90)
  const schedules: ShiftSchedule[] = Array.from({ length: 90 }, (_, i) => {
    const wh = pick(warehouses);
    const planned = Math.floor(r() * 30) + 5;
    const actual = Math.floor(r() * planned * 0.3) + Math.floor(planned * 0.7);
    const target = Math.floor(r() * 3000) + 500;
    const achieved = Math.floor(target * (0.6 + r() * 0.5));
    const st = pick(scheduleStatuses);
    return {
      id: `SS-${String(i + 1).padStart(4, "0")}`,
      warehouse: wh.name, city: wh.city,
      date: date2025(), shift: pick(shifts),
      supervisor: pick(names), zone: pick(zones),
      plannedWorkers: planned, actualWorkers: actual, attendance: Math.round((actual / planned) * 1000) / 10,
      targetUnits: target, achievedUnits: Math.min(achieved, target + 200), efficiency: Math.round((achieved / target) * 1000) / 10,
      overtimeCount: Math.floor(r() * 15), incidentCount: Math.floor(r() * 3),
      status: st,
    };
  });

  // Skill Matrix (50)
  const skillMatrix: SkillMatrix[] = Array.from({ length: 50 }, (_, i) => {
    const wh = pick(warehouses);
    const skills = [Math.round(r() * 5) + 1, Math.round(r() * 5) + 1, Math.round(r() * 5) + 1, Math.round(r() * 5) + 1, Math.round(r() * 5) + 1, Math.round(r() * 5) + 1, Math.round(r() * 5) + 1, Math.round(r() * 5) + 1];
    const overall = Math.round(skills.reduce((a, b) => a + b, 0) / 8 * 10) / 10;
    return {
      id: `SM-${String(i + 1).padStart(4, "0")}`,
      employeeName: names[i % names.length],
      employeeId: `EMP${String(1000 + i).padStart(5, "0")}`,
      warehouse: wh.name, city: wh.city,
      department: pick(departments), role: pick(roles),
      experienceYears: Math.floor(r() * 15) + 1,
      forklift: skills[0], picking: skills[1], packing: skills[2], quality: skills[3],
      receiving: skills[4], shipping: skills[5], inventory: skills[6], leadership: skills[7],
      overallScore: overall,
      certificationExpiry: date2025(), trainingDue: date2025(),
    };
  });

  // Overtime Records (60)
  const overtime: OvertimeRecord[] = Array.from({ length: 60 }, (_, i) => {
    const wh = pick(warehouses);
    const reg = 8;
    const ot = Math.round((1 + r() * 6) * 10) / 10;
    return {
      id: `OT-${String(i + 1).padStart(4, "0")}`,
      employeeName: pick(names),
      employeeId: `EMP${String(1000 + Math.floor(r() * 50)).padStart(5, "0")}`,
      warehouse: wh.name, city: wh.city,
      date: date2025(), shift: pick(shifts),
      department: pick(departments), role: pick(roles),
      regularHours: reg, overtimeHours: ot, totalHours: reg + ot,
      overtimeReason: pick(reasons),
      approvedBy: pick(approvers),
      cost: Math.round(ot * (300 + r() * 400)),
      isExcessive: ot > 4,
    };
  });

  // Labor Costs (48)
  const laborCosts: LaborCost[] = Array.from({ length: 48 }, (_, i) => {
    const wh = pick(warehouses);
    const regCost = Math.round(500000 + r() * 3000000);
    const otCost = Math.round(50000 + r() * 800000);
    const tempCost = Math.round(20000 + r() * 500000);
    const trainCost = Math.round(10000 + r() * 200000);
    const benCost = Math.round(80000 + r() * 600000);
    const total = regCost + otCost + tempCost + trainCost + benCost;
    const hc = Math.floor(r() * 80) + 15;
    const budget = Math.round(total * (0.8 + r() * 0.4));
    return {
      id: `LC-${String(i + 1).padStart(4, "0")}`,
      warehouse: wh.name, city: wh.city,
      month: pick(months), year: 2025,
      department: pick(departments),
      regularCost: regCost, overtimeCost: otCost, tempStaffCost: tempCost,
      trainingCost: trainCost, benefitsCost: benCost,
      totalCost: total, costPerUnit: Math.round((total / (Math.floor(r() * 50000) + 5000)) * 100) / 100,
      budgetVariance: Math.round(((total - budget) / budget) * 1000) / 10,
      headcount: hc, avgSalary: Math.round((15000 + r() * 35000)),
    };
  });

  // Dashboard chart data
  const monthlyHeadcount = months.map(m => ({
    month: m,
    actual: Math.floor(120 + r() * 60),
    forecasted: Math.floor(115 + r() * 65),
    optimal: Math.floor(130 + r() * 40),
    attrition: Math.floor(2 + r() * 12),
  }));

  const deptBreakdown = departments.slice(0, 7).map(d => ({
    name: d, value: Math.floor(r() * 80) + 10,
  }));

  const shiftEfficiency = shifts.map(s => ({
    shift: s.charAt(0).toUpperCase() + s.slice(1),
    morning: Math.round(75 + r() * 20),
    afternoon: Math.round(70 + r() * 20),
    night: Math.round(60 + r() * 25),
  }));

  const warehouseLaborRadar = ["Mumbai","Delhi NCR","Bengaluru"].map(city => ({
    city,
    productivity: Math.round(65 + r() * 30),
    attendance: Math.round(80 + r() * 18),
    efficiency: Math.round(60 + r() * 30),
    skillScore: Math.round(50 + r() * 45),
    overtime: Math.round(70 + r() * 25),
  }));

  const overtimeTrend = months.map(m => ({
    month: m,
    hours: Math.floor(200 + r() * 600),
    cost: Math.floor(80000 + r() * 400000),
  }));

  const costBreakdownPie = [
    { name: "Regular", value: 65 }, { name: "Overtime", value: 15 },
    { name: "Temp Staff", value: 8 }, { name: "Training", value: 5 },
    { name: "Benefits", value: 7 },
  ];

  return {
    forecasts, schedules, skillMatrix, overtime, laborCosts,
    monthlyHeadcount, deptBreakdown, shiftEfficiency, warehouseLaborRadar,
    overtimeTrend, costBreakdownPie,
    months: [...months],
    shifts: [...shifts],
    scheduleStatuses: [...scheduleStatuses],
    departments: [...departments],
  };
}

// ===== HELPERS =====
const FieldGrid = ({ fields }: { fields: [string, string][] }) => (
  <div className="wlf-drawer-field-grid">
    {fields.map(([label, val]) => (
      <div className="wlf-drawer-field" key={label}>
        <span className="wlf-field-label">{label}</span>
        <span className="wlf-field-value">{val}</span>
      </div>
    ))}
  </div>
);

const MetricsRow = ({ metrics }: { metrics: { label: string; value: string; icon: React.ReactNode; color: string }[] }) => (
  <div className="wlf-drawer-metrics">
    {metrics.map(m => (
      <div className="wlf-drawer-metric" key={m.label} style={{ borderLeftColor: m.color }}>
        <div className="wlf-metric-icon">{m.icon}</div>
        <div className="wlf-metric-info">
          <span className="wlf-metric-value" style={{ color: m.color }}>{m.value}</span>
          <span className="wlf-metric-label">{m.label}</span>
        </div>
      </div>
    ))}
  </div>
);

const statusBadge = (status: string) => {
  const colors: Record<string, string> = {
    "planned": "#3b82f6", "in-progress": "#f59e0b", "completed": "#22c55e",
    "short-staffed": "#ef4444", "overstaffed": "#8b5cf6",
    "excessive": "#ef4444", "normal": "#22c55e",
  };
  return (
    <span className="wlf-badge" style={{ background: `${colors[status] || "#6b7280"}22`, color: colors[status] || "#6b7280", border: `1px solid ${colors[status] || "#6b7280"}44` }}>
      {status.replace(/-/g, " ")}
    </span>
  );
};

// ===== MAIN COMPONENT =====
export default function WarehouseLaborForecastingView() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterShift, setFilterShift] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDept, setFilterDept] = useState("all");
  const [filterWarehouse, setFilterWarehouse] = useState("all");
  const [filterSkillLevel, setFilterSkillLevel] = useState("all");
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
    { label: "Total Workforce", value: data.forecasts.reduce((s, f) => s + f.currentHeadcount, 0).toLocaleString("en-IN"), icon: <Users />, color: COLORS.primary, change: "+24" },
    { label: "Avg Productivity", value: `${Math.round(data.forecasts.reduce((s, f) => s + f.productivity, 0) / data.forecasts.length)}%`, icon: <Activity />, color: COLORS.success, change: "+3.2%" },
    { label: "Staffing Gap", value: data.forecasts.filter(f => f.gap > 0).length.toString(), icon: <AlertTriangle />, color: COLORS.danger, change: "-5" },
    { label: "Total OT Hours", value: data.overtime.reduce((s, o) => s + o.overtimeHours, 0).toLocaleString("en-IN") + "h", icon: <Clock />, color: COLORS.accent, change: "+12%" },
    { label: "Forecast Accuracy", value: `${Math.round(data.forecasts.reduce((s, f) => s + f.forecastAccuracy, 0) / data.forecasts.length)}%`, icon: <Target />, color: COLORS.secondary, change: "+1.5%" },
    { label: "Monthly Labor Cost", value: formatINR(Math.round(data.laborCosts.reduce((s, l) => s + l.totalCost, 0) / 12)), icon: <DollarSign />, color: COLORS.teal, change: "+8%" },
  ], [data]);

  // ===== DASHBOARD =====
  const DashboardTab = () => (
    <div className="wlf-dashboard">
      <div className="wlf-clock-bar"><Clock size={14} /> <span>{currentTime || new Date().toLocaleTimeString("en-IN", { hour12: true })}</span><span className="wlf-clock-date">{new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span></div>
      <div className="wlf-kpi-grid">
        {kpis.map((k, i) => (
          <div className="wlf-kpi-card" key={i} style={{ borderTopColor: k.color }}>
            <div className="wlf-kpi-icon" style={{ background: `${k.color}18`, color: k.color }}>{k.icon}</div>
            <div className="wlf-kpi-info"><span className="wlf-kpi-value">{k.value}</span><span className="wlf-kpi-label">{k.label}</span></div>
            <span className="wlf-kpi-change" style={{ color: k.change.startsWith("+") && !k.label.includes("Gap") && !k.label.includes("OT") ? COLORS.success : COLORS.danger }}>{k.change.startsWith("+") ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}{k.change}</span>
          </div>
        ))}
      </div>
      <div className="wlf-charts-grid">
        <div className="wlf-chart-card">
          <h4><TrendingUp size={14} /> Monthly Headcount Forecast</h4>
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={data.monthlyHeadcount}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0" }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="actual" fill={COLORS.primary} radius={[4, 4, 0, 0]} name="Actual" />
              <Bar dataKey="forecasted" fill={COLORS.secondary} radius={[4, 4, 0, 0]} name="Forecasted" />
              <Line type="monotone" dataKey="optimal" stroke={COLORS.success} strokeWidth={2} name="Optimal" dot={false} />
              <Line type="monotone" dataKey="attrition" stroke={COLORS.danger} strokeWidth={2} name="Attrition" strokeDasharray="5 5" dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div className="wlf-chart-card">
          <h4><BarChart3 size={14} /> Department Distribution</h4>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={data.deptBreakdown} cx="50%" cy="50%" outerRadius={100} innerRadius={55} paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={{ stroke: "#94a3b8" }}>
                {data.deptBreakdown.map((_, idx) => <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="wlf-chart-card">
          <h4><Gauge size={14} /> Overtime Trend</h4>
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={data.overtimeTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0" }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="hours" fill={COLORS.accent} radius={[4, 4, 0, 0]} name="Hours" />
              <Line type="monotone" dataKey="cost" stroke={COLORS.danger} strokeWidth={2} name="Cost (₹)" dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div className="wlf-chart-card">
          <h4><Factory size={14} /> Warehouse Labor Comparison</h4>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={[
              { metric: "Productivity", ...Object.fromEntries(data.warehouseLaborRadar.map(w => [w.city, w.productivity])) },
              { metric: "Attendance", ...Object.fromEntries(data.warehouseLaborRadar.map(w => [w.city, w.attendance])) },
              { metric: "Efficiency", ...Object.fromEntries(data.warehouseLaborRadar.map(w => [w.city, w.efficiency])) },
              { metric: "Skill Score", ...Object.fromEntries(data.warehouseLaborRadar.map(w => [w.city, w.skillScore])) },
              { metric: "OT Rate", ...Object.fromEntries(data.warehouseLaborRadar.map(w => [w.city, w.overtime])) },
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
        <div className="wlf-chart-card">
          <h4><DollarSign size={14} /> Cost Breakdown</h4>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={data.costBreakdownPie} cx="50%" cy="50%" outerRadius={100} innerRadius={55} paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={{ stroke: "#94a3b8" }}>
                {data.costBreakdownPie.map((_, idx) => <Cell key={idx} fill={[COLORS.primary, COLORS.accent, COLORS.secondary, COLORS.teal, COLORS.purple][idx]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="wlf-chart-card">
          <h4><CalendarRange size={14} /> Shift Efficiency by Zone</h4>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data.shiftEfficiency}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="shift" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0" }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="morning" fill={COLORS.primary} radius={[4, 4, 0, 0]} name="Morning" />
              <Bar dataKey="afternoon" fill={COLORS.secondary} radius={[4, 4, 0, 0]} name="Afternoon" />
              <Bar dataKey="night" fill={COLORS.accent} radius={[4, 4, 0, 0]} name="Night" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  // ===== FORECAST TAB =====
  const ForecastTab = () => {
    const filtered = useMemo(() => {
      let arr = [...data.forecasts];
      if (searchTerm) arr = arr.filter(f => f.warehouse.toLowerCase().includes(searchTerm.toLowerCase()) || f.role.toLowerCase().includes(searchTerm.toLowerCase()) || f.zone.toLowerCase().includes(searchTerm.toLowerCase()));
      if (filterShift !== "all") arr = arr.filter(f => f.shift === filterShift);
      if (sortField) arr.sort((a, b) => { const a1 = (a as any)[sortField]; const b1 = (b as any)[sortField]; if (typeof a1 === "number" && typeof b1 === "number") return sortDir === "asc" ? a1 - b1 : b1 - a1; return sortDir === "asc" ? String(a1).localeCompare(String(b1)) : String(b1).localeCompare(String(a1)); });
      return arr;
    }, [data.forecasts, searchTerm, filterShift, sortField, sortDir]);
    const totalPages = Math.ceil(filtered.length / pageSize);
    const paged = filtered.slice(page * pageSize, (page + 1) * pageSize);
    return (
      <div className="wlf-tab-content">
        <div className="wlf-toolbar">
          <div className="wlf-search"><Search size={14} /><input type="text" placeholder="Search warehouse, role, zone..." value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setPage(0); }} /></div>
          <div className="wlf-filters">
            <select value={filterShift} onChange={e => { setFilterShift(e.target.value); setPage(0); }}><option value="all">All Shifts</option>{data.shifts.map(s => <option key={s} value={s}>{s}</option>)}</select>
          </div>
          <span className="wlf-count">{filtered.length} forecasts</span>
        </div>
        <div className="wlf-table-wrap">
          <table className="wlf-table">
            <thead>
              <tr>
                {(["warehouse","zone","role","shift","currentHeadcount","requiredHeadcount","gap","forecastAccuracy","workloadIndex","productivity","attritionRisk","totalCost"] as const).map(h => (
                  <th key={h} onClick={() => handleSort(h)} className={sortField === h ? `wlf-sorted-${sortDir}` : ""}>
                    {h.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase())} {sortField === h ? (sortDir === "asc" ? "↑" : "↓") : ""}
                  </th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((f, i) => (
                <tr key={f.id} onClick={() => openDrawer("forecast", f)} style={{ background: f.gap > 10 ? "#fef2f244" : undefined }}>
                  <td>{f.warehouse}</td>
                  <td><span className="wlf-zone-badge">{f.zone.split(" - ")[1] || f.zone}</span></td>
                  <td>{f.role}</td>
                  <td><span className={`wlf-shift-tag wlf-shift-${f.shift}`}>{f.shift}</span></td>
                  <td className="wlf-bold">{f.currentHeadcount}</td>
                  <td>{f.requiredHeadcount}</td>
                  <td style={{ color: f.gap > 0 ? COLORS.danger : COLORS.success, fontWeight: 600 }}>{f.gap > 0 ? `+${f.gap}` : f.gap}</td>
                  <td>
                    <div className="wlf-bar-cell"><div className="wlf-bar" style={{ width: `${f.forecastAccuracy}%`, background: f.forecastAccuracy >= 85 ? COLORS.success : f.forecastAccuracy >= 70 ? COLORS.accent : COLORS.danger }} /><span>{f.forecastAccuracy}%</span></div>
                  </td>
                  <td>
                    <div className="wlf-bar-cell"><div className="wlf-bar" style={{ width: `${f.workloadIndex}%`, background: f.workloadIndex >= 70 ? COLORS.danger : f.workloadIndex >= 40 ? COLORS.accent : COLORS.success }} /><span>{f.workloadIndex}</span></div>
                  </td>
                  <td style={{ fontWeight: 600, color: f.productivity >= 80 ? COLORS.success : f.productivity >= 60 ? COLORS.accent : COLORS.danger }}>{f.productivity}%</td>
                  <td>
                    <div className="wlf-bar-cell"><div className="wlf-bar" style={{ width: `${f.attritionRisk}%`, background: f.attritionRisk >= 60 ? COLORS.danger : f.attritionRisk >= 30 ? COLORS.accent : COLORS.success }} /><span>{f.attritionRisk}%</span></div>
                  </td>
                  <td>{formatINR(f.totalCost)}</td>
                  <td><Eye size={14} className="wlf-action-btn" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="wlf-pagination">
            <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}><ChevronLeft size={14} /></button>
            <span>{page + 1} / {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}><ChevronRight size={14} /></button>
          </div>
        )}
      </div>
    );
  };

  // ===== SHIFT SCHEDULES TAB =====
  const ShiftSchedulesTab = () => {
    const filtered = useMemo(() => {
      let arr = [...data.schedules];
      if (searchTerm) arr = arr.filter(s => s.warehouse.toLowerCase().includes(searchTerm.toLowerCase()) || s.supervisor.toLowerCase().includes(searchTerm.toLowerCase()) || s.zone.toLowerCase().includes(searchTerm.toLowerCase()));
      if (filterShift !== "all") arr = arr.filter(s => s.shift === filterShift);
      if (filterStatus !== "all") arr = arr.filter(s => s.status === filterStatus);
      if (sortField) arr.sort((a, b) => { const a1 = (a as any)[sortField]; const b1 = (b as any)[sortField]; if (typeof a1 === "number" && typeof b1 === "number") return sortDir === "asc" ? a1 - b1 : b1 - a1; return sortDir === "asc" ? String(a1).localeCompare(String(b1)) : String(b1).localeCompare(String(a1)); });
      return arr;
    }, [data.schedules, searchTerm, filterShift, filterStatus, sortField, sortDir]);
    const totalPages = Math.ceil(filtered.length / pageSize);
    const paged = filtered.slice(page * pageSize, (page + 1) * pageSize);
    return (
      <div className="wlf-tab-content">
        <div className="wlf-toolbar">
          <div className="wlf-search"><Search size={14} /><input type="text" placeholder="Search warehouse, supervisor, zone..." value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setPage(0); }} /></div>
          <div className="wlf-filters">
            <select value={filterShift} onChange={e => { setFilterShift(e.target.value); setPage(0); }}><option value="all">All Shifts</option>{data.shifts.map(s => <option key={s} value={s}>{s}</option>)}</select>
            <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(0); }}><option value="all">All Statuses</option>{data.scheduleStatuses.map(s => <option key={s} value={s}>{s}</option>)}</select>
          </div>
          <span className="wlf-count">{filtered.length} schedules</span>
        </div>
        <div className="wlf-table-wrap">
          <table className="wlf-table">
            <thead>
              <tr>
                {(["date","warehouse","shift","zone","supervisor","plannedWorkers","actualWorkers","attendance","targetUnits","achievedUnits","efficiency","status"] as const).map(h => (
                  <th key={h} onClick={() => handleSort(h)} className={sortField === h ? `wlf-sorted-${sortDir}` : ""}>
                    {h.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase())} {sortField === h ? (sortDir === "asc" ? "↑" : "↓") : ""}
                  </th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((s, i) => (
                <tr key={s.id} onClick={() => openDrawer("schedule", s)} style={{ background: s.status === "short-staffed" ? "#fef2f244" : undefined }}>
                  <td className="wlf-mono">{s.date}</td>
                  <td>{s.warehouse}</td>
                  <td><span className={`wlf-shift-tag wlf-shift-${s.shift}`}>{s.shift}</span></td>
                  <td><span className="wlf-zone-badge">{s.zone.split(" - ")[1]}</span></td>
                  <td>{s.supervisor}</td>
                  <td className="wlf-bold">{s.plannedWorkers}</td>
                  <td style={{ color: s.actualWorkers < s.plannedWorkers * 0.8 ? COLORS.danger : COLORS.success, fontWeight: 600 }}>{s.actualWorkers}</td>
                  <td>
                    <div className="wlf-bar-cell"><div className="wlf-bar" style={{ width: `${s.attendance}%`, background: s.attendance >= 90 ? COLORS.success : s.attendance >= 70 ? COLORS.accent : COLORS.danger }} /><span>{s.attendance}%</span></div>
                  </td>
                  <td>{s.targetUnits.toLocaleString("en-IN")}</td>
                  <td>{s.achievedUnits.toLocaleString("en-IN")}</td>
                  <td style={{ fontWeight: 700, color: s.efficiency >= 95 ? COLORS.success : s.efficiency >= 80 ? COLORS.accent : COLORS.danger }}>{s.efficiency}%</td>
                  <td>{statusBadge(s.status)}</td>
                  <td><Eye size={14} className="wlf-action-btn" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="wlf-pagination">
            <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}><ChevronLeft size={14} /></button>
            <span>{page + 1} / {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}><ChevronRight size={14} /></button>
          </div>
        )}
      </div>
    );
  };

  // ===== SKILL MATRIX TAB =====
  const SkillMatrixTab = () => {
    const filtered = useMemo(() => {
      let arr = [...data.skillMatrix];
      if (searchTerm) arr = arr.filter(s => s.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) || s.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) || s.role.toLowerCase().includes(searchTerm.toLowerCase()));
      if (filterDept !== "all") arr = arr.filter(s => s.department === filterDept);
      if (filterSkillLevel !== "all") arr = arr.filter(s => s.overallScore >= (filterSkillLevel === "expert" ? 4 : filterSkillLevel === "intermediate" ? 3 : filterSkillLevel === "beginner" ? 0 : 0) && s.overallScore < (filterSkillLevel === "expert" ? 6 : filterSkillLevel === "intermediate" ? 4 : filterSkillLevel === "beginner" ? 3 : 999));
      if (sortField) arr.sort((a, b) => { const a1 = (a as any)[sortField]; const b1 = (b as any)[sortField]; if (typeof a1 === "number" && typeof b1 === "number") return sortDir === "asc" ? a1 - b1 : b1 - a1; return sortDir === "asc" ? String(a1).localeCompare(String(b1)) : String(b1).localeCompare(String(a1)); });
      return arr;
    }, [data.skillMatrix, searchTerm, filterDept, filterSkillLevel, sortField, sortDir]);
    const totalPages = Math.ceil(filtered.length / pageSize);
    const paged = filtered.slice(page * pageSize, (page + 1) * pageSize);
    const renderStars = (val: number) => (
      <div className="wlf-stars">{Array.from({ length: 5 }, (_, i) => <Star key={i} size={12} style={{ fill: i < val ? COLORS.accent : "#e2e8f0", color: i < val ? COLORS.accent : "#e2e8f0" }} />)}</div>
    );
    return (
      <div className="wlf-tab-content">
        <div className="wlf-toolbar">
          <div className="wlf-search"><Search size={14} /><input type="text" placeholder="Search employee, ID, role..." value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setPage(0); }} /></div>
          <div className="wlf-filters">
            <select value={filterDept} onChange={e => { setFilterDept(e.target.value); setPage(0); }}><option value="all">All Departments</option>{data.departments.map(d => <option key={d} value={d}>{d}</option>)}</select>
            <select value={filterSkillLevel} onChange={e => { setFilterSkillLevel(e.target.value); setPage(0); }}><option value="all">All Levels</option><option value="expert">Expert (4+)</option><option value="intermediate">Intermediate (3-4)</option><option value="beginner">Beginner (&lt;3)</option></select>
          </div>
          <span className="wlf-count">{filtered.length} employees</span>
        </div>
        <div className="wlf-table-wrap">
          <table className="wlf-table wlf-skill-table">
            <thead>
              <tr>
                <th onClick={() => handleSort("employeeName")}>Employee {sortField === "employeeName" ? (sortDir === "asc" ? "↑" : "↓") : ""}</th>
                <th>Department</th>
                <th>Experience</th>
                <th>Forklift</th>
                <th>Picking</th>
                <th>Packing</th>
                <th>QC</th>
                <th>Shipping</th>
                <th>Inventory</th>
                <th>Leadership</th>
                <th onClick={() => handleSort("overallScore")}>Overall {sortField === "overallScore" ? (sortDir === "asc" ? "↑" : "↓") : ""}</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((s, i) => (
                <tr key={s.id} onClick={() => openDrawer("skill", s)}>
                  <td><div className="wlf-emp-cell"><span className="wlf-emp-name">{s.employeeName}</span><span className="wlf-emp-id">{s.employeeId}</span></div></td>
                  <td>{s.department}</td>
                  <td>{s.experienceYears} yr</td>
                  <td>{renderStars(s.forklift)}</td>
                  <td>{renderStars(s.picking)}</td>
                  <td>{renderStars(s.packing)}</td>
                  <td>{renderStars(s.quality)}</td>
                  <td>{renderStars(s.shipping)}</td>
                  <td>{renderStars(s.inventory)}</td>
                  <td>{renderStars(s.leadership)}</td>
                  <td><span className="wlf-overall-badge" style={{ background: s.overallScore >= 4 ? `${COLORS.success}22` : s.overallScore >= 3 ? `${COLORS.accent}22` : `${COLORS.danger}22`, color: s.overallScore >= 4 ? COLORS.success : s.overallScore >= 3 ? COLORS.accent : COLORS.danger }}>{s.overallScore.toFixed(1)}</span></td>
                  <td><Eye size={14} className="wlf-action-btn" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="wlf-pagination">
            <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}><ChevronLeft size={14} /></button>
            <span>{page + 1} / {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}><ChevronRight size={14} /></button>
          </div>
        )}
      </div>
    );
  };

  // ===== OVERTIME TAB =====
  const OvertimeTab = () => {
    const filtered = useMemo(() => {
      let arr = [...data.overtime];
      if (searchTerm) arr = arr.filter(o => o.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) || o.overtimeReason.toLowerCase().includes(searchTerm.toLowerCase()));
      if (filterDept !== "all") arr = arr.filter(o => o.department === filterDept);
      if (sortField) arr.sort((a, b) => { const a1 = (a as any)[sortField]; const b1 = (b as any)[sortField]; if (typeof a1 === "number" && typeof b1 === "number") return sortDir === "asc" ? a1 - b1 : b1 - a1; return sortDir === "asc" ? String(a1).localeCompare(String(b1)) : String(b1).localeCompare(String(a1)); });
      return arr;
    }, [data.overtime, searchTerm, filterDept, sortField, sortDir]);
    const totalPages = Math.ceil(filtered.length / pageSize);
    const paged = filtered.slice(page * pageSize, (page + 1) * pageSize);
    return (
      <div className="wlf-tab-content">
        <div className="wlf-toolbar">
          <div className="wlf-search"><Search size={14} /><input type="text" placeholder="Search employee, reason..." value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setPage(0); }} /></div>
          <div className="wlf-filters">
            <select value={filterDept} onChange={e => { setFilterDept(e.target.value); setPage(0); }}><option value="all">All Departments</option>{data.departments.map(d => <option key={d} value={d}>{d}</option>)}</select>
          </div>
          <span className="wlf-count">{filtered.length} records</span>
        </div>
        <div className="wlf-table-wrap">
          <table className="wlf-table">
            <thead>
              <tr>
                {(["date","employeeName","department","shift","regularHours","overtimeHours","totalHours","overtimeReason","approvedBy","cost","isExcessive"] as const).map(h => (
                  <th key={h} onClick={() => handleSort(h)} className={sortField === h ? `wlf-sorted-${sortDir}` : ""}>
                    {h.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase())} {sortField === h ? (sortDir === "asc" ? "↑" : "↓") : ""}
                  </th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((o, i) => (
                <tr key={o.id} onClick={() => openDrawer("overtime", o)} style={{ background: o.isExcessive ? "#fef2f244" : undefined }}>
                  <td className="wlf-mono">{o.date}</td>
                  <td><div className="wlf-emp-cell"><span className="wlf-emp-name">{o.employeeName}</span><span className="wlf-emp-id">{o.employeeId}</span></div></td>
                  <td>{o.department}</td>
                  <td><span className={`wlf-shift-tag wlf-shift-${o.shift}`}>{o.shift}</span></td>
                  <td>{o.regularHours}h</td>
                  <td style={{ fontWeight: 700, color: o.isExcessive ? COLORS.danger : COLORS.accent }}>{o.overtimeHours}h</td>
                  <td className="wlf-bold">{o.totalHours}h</td>
                  <td>{o.overtimeReason}</td>
                  <td>{o.approvedBy}</td>
                  <td>{formatINR(o.cost)}</td>
                  <td>{o.isExcessive ? <AlertTriangle size={14} style={{ color: COLORS.danger }} /> : <CheckCircle2 size={14} style={{ color: COLORS.success }} />}</td>
                  <td><Eye size={14} className="wlf-action-btn" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="wlf-pagination">
            <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}><ChevronLeft size={14} /></button>
            <span>{page + 1} / {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}><ChevronRight size={14} /></button>
          </div>
        )}
      </div>
    );
  };

  // ===== LABOR COSTS TAB =====
  const LaborCostsTab = () => {
    const filtered = useMemo(() => {
      let arr = [...data.laborCosts];
      if (searchTerm) arr = arr.filter(l => l.warehouse.toLowerCase().includes(searchTerm.toLowerCase()) || l.department.toLowerCase().includes(searchTerm.toLowerCase()));
      if (filterDept !== "all") arr = arr.filter(l => l.department === filterDept);
      if (sortField) arr.sort((a, b) => { const a1 = (a as any)[sortField]; const b1 = (b as any)[sortField]; if (typeof a1 === "number" && typeof b1 === "number") return sortDir === "asc" ? a1 - b1 : b1 - a1; return sortDir === "asc" ? String(a1).localeCompare(String(b1)) : String(b1).localeCompare(String(a1)); });
      return arr;
    }, [data.laborCosts, searchTerm, filterDept, sortField, sortDir]);
    const totalPages = Math.ceil(filtered.length / pageSize);
    const paged = filtered.slice(page * pageSize, (page + 1) * pageSize);
    return (
      <div className="wlf-tab-content">
        <div className="wlf-toolbar">
          <div className="wlf-search"><Search size={14} /><input type="text" placeholder="Search warehouse, department..." value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setPage(0); }} /></div>
          <div className="wlf-filters">
            <select value={filterDept} onChange={e => { setFilterDept(e.target.value); setPage(0); }}><option value="all">All Departments</option>{data.departments.map(d => <option key={d} value={d}>{d}</option>)}</select>
          </div>
          <span className="wlf-count">{filtered.length} records</span>
        </div>
        <div className="wlf-table-wrap">
          <table className="wlf-table">
            <thead>
              <tr>
                {(["month","warehouse","department","regularCost","overtimeCost","tempStaffCost","trainingCost","benefitsCost","totalCost","costPerUnit","budgetVariance","headcount"] as const).map(h => (
                  <th key={h} onClick={() => handleSort(h)} className={sortField === h ? `wlf-sorted-${sortDir}` : ""}>
                    {h.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase())} {sortField === h ? (sortDir === "asc" ? "↑" : "↓") : ""}
                  </th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((l, i) => (
                <tr key={l.id} onClick={() => openDrawer("cost", l)} style={{ background: l.budgetVariance > 15 ? "#fef2f244" : undefined }}>
                  <td className="wlf-mono">{l.month} {l.year}</td>
                  <td>{l.warehouse}</td>
                  <td>{l.department}</td>
                  <td>{formatINR(l.regularCost)}</td>
                  <td style={{ color: COLORS.accent }}>{formatINR(l.overtimeCost)}</td>
                  <td>{formatINR(l.tempStaffCost)}</td>
                  <td>{formatINR(l.trainingCost)}</td>
                  <td>{formatINR(l.benefitsCost)}</td>
                  <td className="wlf-bold">{formatINR(l.totalCost)}</td>
                  <td>{formatINR(Math.round(l.costPerUnit * 100))}</td>
                  <td style={{ fontWeight: 700, color: l.budgetVariance > 15 ? COLORS.danger : l.budgetVariance < -5 ? COLORS.success : COLORS.accent }}>{l.budgetVariance > 0 ? "+" : ""}{l.budgetVariance}%</td>
                  <td>{l.headcount}</td>
                  <td><Eye size={14} className="wlf-action-btn" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="wlf-pagination">
            <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}><ChevronLeft size={14} /></button>
            <span>{page + 1} / {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}><ChevronRight size={14} /></button>
          </div>
        )}
      </div>
    );
  };

  // ===== DRAWERS =====
  const ForecastDrawer = () => {
    const f = drawerData as LaborForecast;
    if (!f) return null;
    return (
      <>
        <div className="wlf-overlay" onClick={closeDrawer} />
        <div className="wlf-drawer">
          <div className="wlf-drawer-header">
            <div><h3><BrainCircuit size={18} /> Labor Forecast</h3><span className="wlf-drawer-subtitle">{f.warehouse} • {f.zone} • {f.shift}</span></div>
            <button onClick={closeDrawer}><X size={18} /></button>
          </div>
          <div className="wlf-drawer-body">
            <MetricsRow metrics={[
              { label: "Staffing Gap", value: f.gap > 0 ? `+${f.gap}` : `${f.gap}`, icon: <AlertTriangle size={16} />, color: f.gap > 0 ? COLORS.danger : COLORS.success },
              { label: "Productivity", value: `${f.productivity}%`, icon: <Activity size={16} />, color: f.productivity >= 80 ? COLORS.success : COLORS.accent },
              { label: "Total Cost", value: formatINR(f.totalCost), icon: <DollarSign size={16} />, color: COLORS.primary },
            ]} />
            <FieldGrid fields={[
              ["Role", f.role], ["Month", `${f.month} ${f.year}`], ["Current HC", f.currentHeadcount.toString()],
              ["Required HC", f.requiredHeadcount.toString()], ["Forecast Accuracy", `${f.forecastAccuracy}%`],
              ["Workload Index", f.workloadIndex.toString()], ["OT Hours", f.overtimeHours.toString()],
              ["Cost/Worker", formatINR(f.costPerWorker)], ["Attrition Risk", `${f.attritionRisk}%`],
              ["City", f.city], ["Warehouse", f.warehouse], ["Zone", f.zone],
            ]} />
            <div className="wlf-drawer-actions">
              <button className="wlf-btn wlf-btn-primary"><FileText size={14} /> Export Report</button>
              <button className="wlf-btn wlf-btn-secondary"><UserCog size={14} /> Adjust HC</button>
              <button className="wlf-btn wlf-btn-accent"><CalendarRange size={14} /> Schedule Review</button>
            </div>
          </div>
        </div>
      </>
    );
  };

  const ScheduleDrawer = () => {
    const s = drawerData as ShiftSchedule;
    if (!s) return null;
    return (
      <>
        <div className="wlf-overlay" onClick={closeDrawer} />
        <div className="wlf-drawer">
          <div className="wlf-drawer-header" style={s.status === "short-staffed" ? { background: "linear-gradient(135deg, #ef4444, #dc2626)" } : undefined}>
            <div><h3><CalendarRange size={18} /> Shift Schedule</h3><span className="wlf-drawer-subtitle">{s.warehouse} • {s.date} • {s.shift}</span></div>
            <button onClick={closeDrawer}><X size={18} /></button>
          </div>
          <div className="wlf-drawer-body">
            <MetricsRow metrics={[
              { label: "Efficiency", value: `${s.efficiency}%`, icon: <Gauge size={16} />, color: s.efficiency >= 95 ? COLORS.success : COLORS.accent },
              { label: "Attendance", value: `${s.attendance}%`, icon: <Users size={16} />, color: s.attendance >= 90 ? COLORS.success : COLORS.danger },
              { label: "Achieved", value: s.achievedUnits.toLocaleString("en-IN"), icon: <Package size={16} />, color: COLORS.primary },
            ]} />
            <FieldGrid fields={[
              ["Supervisor", s.supervisor], ["Zone", s.zone], ["Status", s.status],
              ["Planned Workers", s.plannedWorkers.toString()], ["Actual Workers", s.actualWorkers.toString()],
              ["Target Units", s.targetUnits.toLocaleString("en-IN")], ["Achieved Units", s.achievedUnits.toLocaleString("en-IN")],
              ["Overtime Count", s.overtimeCount.toString()], ["Incidents", s.incidentCount.toString()],
              ["City", s.city], ["Warehouse", s.warehouse], ["Date", s.date],
            ]} />
            <div className="wlf-drawer-actions">
              <button className="wlf-btn wlf-btn-primary"><FileText size={14} /> Export Schedule</button>
              <button className="wlf-btn wlf-btn-secondary"><UserCog size={14} /> Reassign Staff</button>
            </div>
          </div>
        </div>
      </>
    );
  };

  const SkillDrawer = () => {
    const s = drawerData as SkillMatrix;
    if (!s) return null;
    return (
      <>
        <div className="wlf-overlay" onClick={closeDrawer} />
        <div className="wlf-drawer">
          <div className="wlf-drawer-header">
            <div><h3><Star size={18} /> Employee Skills</h3><span className="wlf-drawer-subtitle">{s.employeeName} • {s.employeeId}</span></div>
            <button onClick={closeDrawer}><X size={18} /></button>
          </div>
          <div className="wlf-drawer-body">
            <MetricsRow metrics={[
              { label: "Overall Score", value: s.overallScore.toFixed(1), icon: <Star size={16} />, color: s.overallScore >= 4 ? COLORS.success : COLORS.accent },
              { label: "Experience", value: `${s.experienceYears} years`, icon: <Clock size={16} />, color: COLORS.primary },
              { label: "Department", value: s.department, icon: <Factory size={16} />, color: COLORS.secondary },
            ]} />
            <FieldGrid fields={[
              ["Role", s.role], ["Warehouse", s.warehouse], ["City", s.city],
              ["Forklift", `${s.forklift}/5`], ["Picking", `${s.picking}/5`], ["Packing", `${s.packing}/5`],
              ["Quality", `${s.quality}/5`], ["Receiving", `${s.receiving}/5`], ["Shipping", `${s.shipping}/5`],
              ["Inventory", `${s.inventory}/5`], ["Leadership", `${s.leadership}/5`],
              ["Cert Expiry", s.certificationExpiry], ["Training Due", s.trainingDue],
            ]} />
            <div className="wlf-drawer-actions">
              <button className="wlf-btn wlf-btn-primary"><FileText size={14} /> Export Profile</button>
              <button className="wlf-btn wlf-btn-secondary"><Zap size={14} /> Schedule Training</button>
            </div>
          </div>
        </div>
      </>
    );
  };

  const OvertimeDrawer = () => {
    const o = drawerData as OvertimeRecord;
    if (!o) return null;
    return (
      <>
        <div className="wlf-overlay" onClick={closeDrawer} />
        <div className="wlf-drawer" style={o.isExcessive ? { borderColor: COLORS.danger } : undefined}>
          <div className="wlf-drawer-header" style={{ background: o.isExcessive ? "linear-gradient(135deg, #ef4444, #dc2626)" : "linear-gradient(135deg, #f97316, #ea580c)" }}>
            <div><h3><Clock size={18} /> Overtime Record</h3><span className="wlf-drawer-subtitle">{o.employeeName} • {o.employeeId}</span></div>
            <button onClick={closeDrawer}><X size={18} /></button>
          </div>
          <div className="wlf-drawer-body">
            <MetricsRow metrics={[
              { label: "OT Hours", value: `${o.overtimeHours}h`, icon: <Clock size={16} />, color: o.isExcessive ? COLORS.danger : COLORS.accent },
              { label: "Total Hours", value: `${o.totalHours}h`, icon: <Activity size={16} />, color: COLORS.primary },
              { label: "OT Cost", value: formatINR(o.cost), icon: <DollarSign size={16} />, color: COLORS.secondary },
            ]} />
            <FieldGrid fields={[
              ["Date", o.date], ["Shift", o.shift], ["Department", o.department],
              ["Role", o.role], ["Regular Hours", `${o.regularHours}h`], ["Overtime Hours", `${o.overtimeHours}h`],
              ["Reason", o.overtimeReason], ["Approved By", o.approvedBy],
              ["Warehouse", o.warehouse], ["City", o.city],
              ["Excessive", o.isExcessive ? "Yes" : "No"],
            ]} />
            <div className="wlf-drawer-actions">
              <button className="wlf-btn wlf-btn-primary"><FileText size={14} /> Download Record</button>
              <button className="wlf-btn wlf-btn-secondary"><AlertTriangle size={14} /> Flag Review</button>
            </div>
          </div>
        </div>
      </>
    );
  };

  const CostDrawer = () => {
    const l = drawerData as LaborCost;
    if (!l) return null;
    return (
      <>
        <div className="wlf-overlay" onClick={closeDrawer} />
        <div className="wlf-drawer">
          <div className="wlf-drawer-header" style={{ background: "linear-gradient(135deg, #0ea5e9, #8b5cf6)" }}>
            <div><h3><DollarSign size={18} /> Labor Cost Detail</h3><span className="wlf-drawer-subtitle">{l.warehouse} • {l.department} • {l.month} {l.year}</span></div>
            <button onClick={closeDrawer}><X size={18} /></button>
          </div>
          <div className="wlf-drawer-body">
            <MetricsRow metrics={[
              { label: "Total Cost", value: formatINR(l.totalCost), icon: <DollarSign size={16} />, color: COLORS.primary },
              { label: "Budget Variance", value: `${l.budgetVariance > 0 ? "+" : ""}${l.budgetVariance}%`, icon: <TrendingUp size={16} />, color: l.budgetVariance > 15 ? COLORS.danger : l.budgetVariance < -5 ? COLORS.success : COLORS.accent },
              { label: "Headcount", value: l.headcount.toString(), icon: <Users size={16} />, color: COLORS.secondary },
            ]} />
            <FieldGrid fields={[
              ["Regular Cost", formatINR(l.regularCost)], ["Overtime Cost", formatINR(l.overtimeCost)],
              ["Temp Staff Cost", formatINR(l.tempStaffCost)], ["Training Cost", formatINR(l.trainingCost)],
              ["Benefits Cost", formatINR(l.benefitsCost)], ["Cost/Unit", formatINR(Math.round(l.costPerUnit * 100))],
              ["Avg Salary", formatINR(l.avgSalary)], ["City", l.city],
            ]} />
            <div className="wlf-cost-breakdown">
              <h4><BarChart3 size={14} /> Cost Breakdown</h4>
              <div className="wlf-cost-bars">
                {[
                  { label: "Regular", pct: (l.regularCost / l.totalCost * 100), color: COLORS.primary },
                  { label: "Overtime", pct: (l.overtimeCost / l.totalCost * 100), color: COLORS.accent },
                  { label: "Temp", pct: (l.tempStaffCost / l.totalCost * 100), color: COLORS.secondary },
                  { label: "Training", pct: (l.trainingCost / l.totalCost * 100), color: COLORS.teal },
                  { label: "Benefits", pct: (l.benefitsCost / l.totalCost * 100), color: COLORS.purple },
                ].map(bar => (
                  <div className="wlf-cost-bar-row" key={bar.label}>
                    <span className="wlf-cost-bar-label">{bar.label}</span>
                    <div className="wlf-cost-bar-track"><div className="wlf-cost-bar" style={{ width: `${bar.pct}%`, background: bar.color }} /></div>
                    <span className="wlf-cost-bar-pct">{bar.pct.toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="wlf-drawer-actions">
              <button className="wlf-btn wlf-btn-primary"><FileText size={14} /> Download Report</button>
              <button className="wlf-btn wlf-btn-secondary"><TrendingUp size={14} /> Compare</button>
            </div>
          </div>
        </div>
      </>
    );
  };

  const drawerMap: Record<string, React.FC> = {
    forecast: ForecastDrawer, schedule: ScheduleDrawer, skill: SkillDrawer,
    overtime: OvertimeDrawer, cost: CostDrawer,
  };
  const DrawerComponent = drawerMap[drawerType];

  return (
    <div className="wlf-root">
      <Tabs value={activeTab} onValueChange={v => { setActiveTab(v); setPage(0); setSearchTerm(""); setFilterShift("all"); setFilterStatus("all"); setFilterDept("all"); setFilterSkillLevel("all"); setFilterWarehouse("all"); }}>
        <div className="wlf-tabs-header">
          <h2 className="wlf-page-title"><BrainCircuit size={22} /> Warehouse Labor Forecasting</h2>
          <TabsList className="wlf-tabs-list">
            <TabsTrigger value="dashboard"><Gauge size={14} /> Dashboard</TabsTrigger>
            <TabsTrigger value="forecasts"><TrendingUp size={14} /> Forecasts</TabsTrigger>
            <TabsTrigger value="schedules"><CalendarRange size={14} /> Shift Schedules</TabsTrigger>
            <TabsTrigger value="skills"><Star size={14} /> Skill Matrix</TabsTrigger>
            <TabsTrigger value="overtime"><Clock size={14} /> Overtime</TabsTrigger>
            <TabsTrigger value="costs"><DollarSign size={14} /> Labor Costs</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="dashboard"><DashboardTab /></TabsContent>
        <TabsContent value="forecasts"><ForecastTab /></TabsContent>
        <TabsContent value="schedules"><ShiftSchedulesTab /></TabsContent>
        <TabsContent value="skills"><SkillMatrixTab /></TabsContent>
        <TabsContent value="overtime"><OvertimeTab /></TabsContent>
        <TabsContent value="costs"><LaborCostsTab /></TabsContent>
      </Tabs>
      {drawerOpen && DrawerComponent && <DrawerComponent />}
    </div>
  );
}
