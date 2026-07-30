"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area,
  ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Users, Clock, TrendingUp, BarChart3, Calendar, Shield, Award,
  AlertTriangle, CheckCircle2, Eye, X, Search, Activity, Target, Zap, Star,
  ArrowRightLeft, UserCheck, UserMinus, Timer, IndianRupee, Briefcase, MapPin,
  HardHat, Wrench, ShieldCheck, ClipboardCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// ============================================================================
// Types
// ============================================================================
type Department = "Receiving" | "Picking" | "Packing" | "Shipping" | "Quality Control" | "Maintenance" | "Administration" | "Security";
type Shift = "Morning" | "Afternoon" | "Night";
type EmployeeStatus = "active" | "on-leave" | "absent" | "terminated";
type SwapStatus = "pending" | "approved" | "rejected";
type OTApprovalStatus = "pending" | "approved" | "rejected";

const WAREHOUSES = [
  "WH-Mumbai-Navi", "WH-Delhi-NCR", "WH-Chennai-Siruseri",
  "WH-Bangalore-Whitefield", "WH-Kolkata-Haldia", "WH-Hyderabad-Gachibowli",
] as const;

const DEPARTMENTS: Department[] = [
  "Receiving", "Picking", "Packing", "Shipping",
  "Quality Control", "Maintenance", "Administration", "Security",
];

const SHIFTS: { name: Shift; time: string }[] = [
  { name: "Morning", time: "6AM – 2PM" },
  { name: "Afternoon", time: "2PM – 10PM" },
  { name: "Night", time: "10PM – 6AM" },
];

const DEPT_COLORS: Record<Department, string> = {
  Receiving: "#8b5cf6",
  Picking: "#10b981",
  Packing: "#3b82f6",
  Shipping: "#f59e0b",
  "Quality Control": "#ec4899",
  Maintenance: "#06b6d4",
  Administration: "#6b7280",
  Security: "#eab308",
};

const SHIFT_COLORS: Record<Shift, string> = {
  Morning: "#f59e0b",
  Afternoon: "#10b981",
  Night: "#8b5cf6",
};

const INDIAN_FIRST = [
  "Arjun", "Priya", "Rahul", "Sneha", "Vikram", "Ananya", "Amit", "Kavya",
  "Rohit", "Divya", "Suresh", "Meera", "Nikhil", "Pooja", "Manish", "Ritu",
  "Arun", "Swati", "Rajesh", "Neha", "Deepak", "Shalini", "Kiran", "Anita",
  "Sanjay", "Lakshmi", "Vishal", "Sunita", "Pradeep", "Geeta", "Mahesh", "Rekha",
  "Ramesh", "Savita", "Ashok", "Bhavna", "Dinesh", "Hema", "Ganesh", "Jaya",
  "Harish", "Kamini", "Inder", "Lata", "Jagdish", "Mona", "Karthik", "Nisha",
  "Prakash", "Rashmi", "Alok", "Suman", "Bharat", "Tanuja", "Chirag", "Usha",
  "Dhruv", "Vidya", "Eshwar", "Yamini", "Farhan", "Zara", "Gaurav", "Aditi",
  "Himanshu", "Bindu", "Jitendra", "Kavitha", "Lalit", "Madhuri", "Naveen",
  "Omkar", "Parul", "Qadir", "Radhika", "Siddharth", "Tulasi", "Umang", "Vandana",
  "Waseem", "Xena", "Yogesh", "Alpana", "Brijesh", "Chitra", "Devendra", "Firdaus",
  "Girish", "Ila", "Javed", "Kusum", "Mohan", "Nandini", "Pankaj", "Reshma",
  "Satish", "Trupti", "Uday", "Vimala",
];

const INDIAN_LAST = [
  "Sharma", "Patel", "Kumar", "Singh", "Gupta", "Reddy", "Iyer", "Nair",
  "Joshi", "Rao", "Mehta", "Verma", "Chopra", "Malhotra", "Bhat", "Deshmukh",
  "Pillai", "Menon", "Hegde", "Kulkarni", "Bhattacharya", "Mukherjee", "Chatterjee",
  "Banerjee", "Nayak", "Saxena", "Mishra", "Tiwari", "Dubey", "Pandey", "Agarwal",
  "Kapoor", "Khanna", "Bajaj", "Chauhan", "Rathore", "Shukla", "Yadav", "Thakur",
  "Puri", "Seth", "Chadha", "Bawa", "Kaur", "Dhillon", "Sandhu", "Gill",
  "Bhatia", "Goyal", "Arora", "Madan", "Chopra", "Bansal", "Goel", "Mittal",
  "Oberoi", "Dhawan", "Suri", "Kalra", "Chawla", "Monga", "Kohli", "Gera",
  "Nanda", "Wadhwa", "Tandon", "Pahwa", "Sahni", "Kakkar", "Grover", "Behl",
  "Mehra", "Sehgal", "Kapur", "Ahuja", "Batra", "Chhibber", "Khosla", "Mahajan",
];

const ROLES: Record<Department, string[]> = {
  Receiving: ["Receiving Clerk", "Dock Worker", "Unloading Lead", "Inbound Coordinator"],
  Picking: ["Picker", "Pick Lead", "Zone Picker", "Batch Picker"],
  Packing: ["Packer", "Pack Lead", "Quality Packer", "Kitting Specialist"],
  Shipping: ["Shipping Clerk", "Loader", "Dispatch Lead", "Manifest Coordinator"],
  "Quality Control": ["QC Inspector", "QA Analyst", "Auditor", "Compliance Officer"],
  Maintenance: ["Technician", "Electrician", "HVAC Specialist", "Maintenance Lead"],
  Administration: ["Admin Executive", "HR Coordinator", "Data Entry Operator", "Office Manager"],
  Security: ["Security Guard", "CCTV Operator", "Access Controller", "Security Supervisor"],
};

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  department: Department;
  role: string;
  warehouse: string;
  shift: Shift;
  status: EmployeeStatus;
  attendancePct: number;
  productivityScore: number;
  hourlyRate: number;
  checkIn: string | null;
  checkOut: string | null;
  breakDuration: number;
  overtimeHours: number;
  totalDaysWorked: number;
  phone: string;
  email: string;
  joinDate: number;
}

interface ShiftSwapRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  currentShift: Shift;
  requestedShift: Shift;
  reason: string;
  date: string;
  status: SwapStatus;
}

interface OTApproval {
  id: string;
  employeeId: string;
  employeeName: string;
  department: Department;
  hoursRequested: number;
  date: string;
  reason: string;
  status: OTApprovalStatus;
  manager: string;
}

interface WeeklyAttendance {
  day: string;
  present: number;
  absent: number;
  leave: number;
  late: number;
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
  const rand = seededRandom(125125);
  const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(rand() * arr.length)];

  const now = Date.now();
  const dayMs = 86400000;

  // Generate 100 employees
  const employees: Employee[] = [];
  const usedNames = new Set<string>();

  for (let i = 0; i < 100; i++) {
    let firstName: string, lastName: string, fullName: string;
    do {
      firstName = pick(INDIAN_FIRST);
      lastName = pick(INDIAN_LAST);
      fullName = `${firstName} ${lastName}`;
    } while (usedNames.has(fullName));
    usedNames.add(fullName);

    const dept = pick(DEPARTMENTS);
    const role = pick(ROLES[dept]);
    const shift = pick(["Morning", "Afternoon", "Night"] as Shift[]);
    const statusRoll = rand();
    const status: EmployeeStatus =
      statusRoll < 0.82 ? "active" : statusRoll < 0.9 ? "on-leave" : statusRoll < 0.96 ? "absent" : "terminated";

    const attendancePct = status === "terminated"
      ? Math.floor(rand() * 40) + 30
      : status === "on-leave" || status === "absent"
        ? Math.floor(rand() * 30) + 50
        : Math.floor(rand() * 20) + 80;

    const productivityScore = status === "terminated"
      ? Math.floor(rand() * 40) + 20
      : status === "absent"
        ? Math.floor(rand() * 30) + 30
        : Math.floor(rand() * 25) + 75;

    const hourlyRate = Math.floor(rand() * 250) + 200;
    const daysWorked = Math.floor(rand() * 260) + 20;
    const joinDate = now - daysWorked * dayMs;

    const checkInHour = shift === "Morning" ? 5 + rand() * 2 : shift === "Afternoon" ? 13 + rand() * 2 : 21 + rand() * 2;
    const checkInMin = Math.floor(rand() * 60);
    const checkInHourInt = Math.floor(checkInHour);
    const checkInTime = `${String(checkInHourInt).padStart(2, "0")}:${String(checkInMin).padStart(2, "0")}`;

    const checkoutHour = checkInHour + 8 + rand() * 2;
    const checkoutMin = Math.floor(rand() * 60);
    const checkoutHourInt = Math.floor(checkoutHour);
    const checkOutTime = `${String(checkoutHourInt).padStart(2, "0")}:${String(checkoutMin).padStart(2, "0")}`;

    const breakDuration = Math.floor(rand() * 45) + 15;
    const overtimeHours = Math.round((checkoutHour - (checkInHour + 8)) * 10) / 10;

    employees.push({
      id: `EMP-${String(i + 1).padStart(4, "0")}`,
      firstName,
      lastName,
      department: dept,
      role,
      warehouse: pick(WAREHOUSES),
      shift,
      status,
      attendancePct,
      productivityScore,
      hourlyRate,
      checkIn: status === "active" ? checkInTime : status === "absent" ? null : checkInTime,
      checkOut: status === "active" ? checkOutTime : null,
      breakDuration,
      overtimeHours: Math.max(0, overtimeHours),
      totalDaysWorked: daysWorked,
      phone: `+91 ${Math.floor(rand() * 9000 + 1000)}${Math.floor(rand() * 90000 + 10000)}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@autoflow.in`,
      joinDate,
    });
  }

  // Generate shift swap requests
  const swapRequests: ShiftSwapRequest[] = [];
  const swapReasons = [
    "Personal emergency", "Medical appointment", "Family commitment",
    "Transport issues", "Exam preparation", "Childcare needs", "Religious observance",
  ];
  for (let i = 0; i < 15; i++) {
    const emp = pick(employees);
    const shifts: Shift[] = ["Morning", "Afternoon", "Night"];
    const currentShift = emp.shift;
    const otherShifts = shifts.filter((s) => s !== currentShift);
    const requestedShift = pick(otherShifts);
    const swapDate = new Date(now - Math.floor(rand() * 14) * dayMs);
    const statusRoll = rand();
    swapRequests.push({
      id: `SWP-${String(i + 1).padStart(4, "0")}`,
      employeeId: emp.id,
      employeeName: `${emp.firstName} ${emp.lastName}`,
      currentShift,
      requestedShift,
      reason: pick(swapReasons),
      date: swapDate.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      status: statusRoll < 0.4 ? "pending" : statusRoll < 0.8 ? "approved" : "rejected",
    });
  }

  // Generate overtime approvals
  const otApprovals: OTApproval[] = [];
  const otReasons = [
    "Seasonal peak load", "Urgent shipment deadline", "Staff shortage",
    "Special project completion", "Inventory audit", "Year-end reconciliation",
  ];
  const managers = ["R.K. Sharma", "S. Gupta", "P. Mehta", "A. Verma", "D. Iyer"];
  for (let i = 0; i < 12; i++) {
    const emp = pick(employees.filter((e) => e.status === "active"));
    const otDate = new Date(now - Math.floor(rand() * 7) * dayMs);
    const statusRoll = rand();
    otApprovals.push({
      id: `OT-${String(i + 1).padStart(4, "0")}`,
      employeeId: emp.id,
      employeeName: `${emp.firstName} ${emp.lastName}`,
      department: emp.department,
      hoursRequested: Math.floor(rand() * 4) + 1,
      date: otDate.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      reason: pick(otReasons),
      status: statusRoll < 0.5 ? "pending" : statusRoll < 0.85 ? "approved" : "rejected",
      manager: pick(managers),
    });
  }

  // Weekly attendance data
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weeklyAttendance: WeeklyAttendance[] = daysOfWeek.map((day) => ({
    day,
    present: Math.floor(rand() * 15) + 70,
    absent: Math.floor(rand() * 8) + 2,
    leave: Math.floor(rand() * 5) + 1,
    late: Math.floor(rand() * 10) + 3,
  }));

  // Monthly attendance heatmap data (4 weeks × 7 days)
  const heatmapData: { day: string; value: number }[] = [];
  const monthNames = ["W1", "W2", "W3", "W4"];
  for (const week of monthNames) {
    for (const day of daysOfWeek) {
      heatmapData.push({
        day: `${week}-${day}`,
        value: day === "Sun" ? Math.floor(rand() * 30) + 20 : Math.floor(rand() * 20) + 75,
      });
    }
  }

  // Labor cost trend
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const laborCostTrend = months.map((month) => ({
    month,
    baseCost: Math.floor(rand() * 500000) + 2000000,
    overtimeCost: Math.floor(rand() * 200000) + 100000,
    total: 0,
  }));
  laborCostTrend.forEach((d) => { d.total = d.baseCost + d.overtimeCost; });

  return { employees, swapRequests, otApprovals, weeklyAttendance, heatmapData, laborCostTrend };
}

// ============================================================================
// Component
// ============================================================================
export default function LaborManagementView() {
  const data = useMemo(() => generateData(), []);
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDept, setFilterDept] = useState("all");
  const [filterShift, setFilterShift] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterWarehouse, setFilterWarehouse] = useState("all");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const tabs = [
    { label: "Workforce Overview", icon: Users },
    { label: "Employee Directory", icon: Search },
    { label: "Shift Scheduler", icon: Calendar },
    { label: "Attendance & Time", icon: Clock },
    { label: "Performance & OT", icon: TrendingUp },
  ];

  // KPI computations
  const totalEmployees = data.employees.length;
  const onShift = data.employees.filter((e) => e.status === "active").length;
  const absent = data.employees.filter((e) => e.status === "absent").length;
  const totalOT = Math.round(data.employees.reduce((s, e) => s + e.overtimeHours, 0));
  const avgProductivity = Math.round(data.employees.reduce((s, e) => s + e.productivityScore, 0) / totalEmployees);
  const monthlyLaborCost = Math.round(data.employees.reduce((s, e) => s + e.hourlyRate * 8 * 22, 0));

  // Department distribution
  const deptDist = DEPARTMENTS.map((d) => ({
    name: d,
    value: data.employees.filter((e) => e.department === d).length,
    color: DEPT_COLORS[d],
  }));

  // Shift coverage
  const shiftCoverage = SHIFTS.map((s) => ({
    name: s.name,
    morning: s.name === "Morning" ? data.employees.filter((e) => e.shift === "Morning" && e.status === "active").length : 0,
    afternoon: s.name === "Afternoon" ? data.employees.filter((e) => e.shift === "Afternoon" && e.status === "active").length : 0,
    night: s.name === "Night" ? data.employees.filter((e) => e.shift === "Night" && e.status === "active").length : 0,
  }));

  // Shift per warehouse data for scheduler
  const shiftWarehouseData = WAREHOUSES.map((wh) => {
    const whEmps = data.employees.filter((e) => e.warehouse === wh && e.status === "active");
    return {
      warehouse: wh,
      morning: whEmps.filter((e) => e.shift === "Morning").length,
      afternoon: whEmps.filter((e) => e.shift === "Afternoon").length,
      night: whEmps.filter((e) => e.shift === "Night").length,
      total: whEmps.length,
    };
  });

  // Filtered employees
  const filteredEmployees = useMemo(() => {
    return data.employees.filter((e) => {
      const fullName = `${e.firstName} ${e.lastName}`.toLowerCase();
      const idLower = e.id.toLowerCase();
      if (searchTerm && !fullName.includes(searchTerm.toLowerCase()) && !idLower.includes(searchTerm.toLowerCase())) return false;
      if (filterDept !== "all" && e.department !== filterDept) return false;
      if (filterShift !== "all" && e.shift !== filterShift) return false;
      if (filterStatus !== "all" && e.status !== filterStatus) return false;
      if (filterWarehouse !== "all" && e.warehouse !== filterWarehouse) return false;
      return true;
    });
  }, [data.employees, searchTerm, filterDept, filterShift, filterStatus, filterWarehouse]);

  // Department productivity
  const deptProductivity = DEPARTMENTS.map((d) => {
    const deptEmps = data.employees.filter((e) => e.department === d);
    const avgProd = deptEmps.length > 0
      ? Math.round(deptEmps.reduce((s, e) => s + e.productivityScore, 0) / deptEmps.length)
      : 0;
    return { name: d, productivity: avgProd, color: DEPT_COLORS[d] };
  });

  // Overtime distribution
  const otRanges = [
    { name: "0–1 hrs", value: data.employees.filter((e) => e.overtimeHours <= 1).length, color: "#10b981" },
    { name: "1–2 hrs", value: data.employees.filter((e) => e.overtimeHours > 1 && e.overtimeHours <= 2).length, color: "#f59e0b" },
    { name: "2–3 hrs", value: data.employees.filter((e) => e.overtimeHours > 2 && e.overtimeHours <= 3).length, color: "#f97316" },
    { name: "3+ hrs", value: data.employees.filter((e) => e.overtimeHours > 3).length, color: "#ef4444" },
  ];

  // Top performers
  const topPerformers = [...data.employees]
    .filter((e) => e.status === "active")
    .sort((a, b) => b.productivityScore - a.productivityScore)
    .slice(0, 10);

  // Format helpers
  const fmtINR = (n: number) => `₹${n.toLocaleString("en-IN")}`;

  const deptClass = (dept: Department) => {
    const map: Record<string, string> = {
      Receiving: "lm-dept-receiving", Picking: "lm-dept-picking", Packing: "lm-dept-packing",
      Shipping: "lm-dept-shipping", "Quality Control": "lm-dept-quality",
      Maintenance: "lm-dept-maintenance", Administration: "lm-dept-admin", Security: "lm-dept-security",
    };
    return map[dept] || "";
  };

  const shiftClass = (shift: Shift) => {
    const map: Record<string, string> = {
      Morning: "lm-shift-morning", Afternoon: "lm-shift-afternoon", Night: "lm-shift-night",
    };
    return map[shift] || "";
  };

  const statusClass = (status: EmployeeStatus) => {
    const map: Record<string, string> = {
      active: "lm-status-active", "on-leave": "lm-status-on-leave",
      absent: "lm-status-absent", terminated: "lm-status-terminated",
    };
    return map[status] || "";
  };

  const otHoursClass = (hrs: number) => {
    if (hrs > 2) return "lm-overtime-critical";
    if (hrs > 1) return "lm-overtime-warning";
    return "lm-overtime-normal";
  };

  const progressClass = (val: number) => {
    if (val >= 80) return "lm-progress-high";
    if (val >= 60) return "lm-progress-mid";
    return "lm-progress-low";
  };

  const heatmapClass = (val: number, isWeekend: boolean) => {
    if (isWeekend) return "lm-heatmap-weekend";
    if (val >= 85) return "lm-heatmap-high";
    if (val >= 70) return "lm-heatmap-mid";
    return "lm-heatmap-low";
  };

  const swapStatusClass = (s: SwapStatus) => {
    const map: Record<string, string> = { pending: "lm-swap-pending", approved: "lm-swap-approved", rejected: "lm-swap-rejected" };
    return map[s];
  };

  const otStatusClass = (s: OTApprovalStatus) => {
    const map: Record<string, string> = { pending: "lm-ot-pending", approved: "lm-ot-approved", rejected: "lm-ot-rejected" };
    return map[s];
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="lm-tracking-header">
        <div className="lm-tracking-header-top-border" />
        <div className="lm-header-content">
          <div className="lm-header-left">
            <div className="lm-header-icon-wrap">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="lm-header-title">Labor Management & Workforce Scheduling</h1>
              <p className="lm-header-subtitle">Comprehensive workforce tracking, shift management, attendance, and performance analytics across 6 warehouses</p>
            </div>
          </div>
          <div className="lm-header-badges">
            <div className="lm-badge lm-badge-violet">
              <Users className="h-3.5 w-3.5" />
              <span>{totalEmployees} Employees</span>
            </div>
            <div className="lm-badge lm-badge-emerald">
              <UserCheck className="h-3.5 w-3.5" />
              <span>{onShift} On Shift</span>
            </div>
            <div className="lm-badge lm-badge-amber">
              <Timer className="h-3.5 w-3.5" />
              <span>{totalOT} OT Hours Today</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="lm-tabs-bar">
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            className={`lm-tab ${activeTab === i ? "lm-tab-active" : ""}`}
            onClick={() => setActiveTab(i)}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ===== TAB 0: Workforce Overview ===== */}
      {activeTab === 0 && (
        <div className="lm-tab-content space-y-4">
          {/* KPI Cards */}
          <div className="lm-overview-grid">
            {[
              { label: "Total Employees", value: totalEmployees, icon: Users, gradient: "lm-kpi-gradient-1" },
              { label: "On Shift", value: onShift, icon: UserCheck, gradient: "lm-kpi-gradient-2" },
              { label: "Absent Today", value: absent, icon: UserMinus, gradient: "lm-kpi-gradient-3" },
              { label: "Overtime Hours", value: totalOT, icon: Clock, gradient: "lm-kpi-gradient-4" },
              { label: "Avg Productivity", value: `${avgProductivity}%`, icon: Target, gradient: "lm-kpi-gradient-5" },
              { label: "Monthly Labor Cost", value: fmtINR(monthlyLaborCost), icon: IndianRupee, gradient: "lm-kpi-gradient-6" },
            ].map((kpi, i) => (
              <div key={kpi.label} className={`lm-kpi-card ${kpi.gradient} lm-stagger-${Math.min(i + 1, 6)}`}>
                <div className="lm-kpi-icon-wrap">
                  <kpi.icon className="h-5 w-5" />
                </div>
                <div className="lm-kpi-text">
                  <p className="lm-kpi-label">{kpi.label}</p>
                  <p className="lm-kpi-value">{kpi.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Row 1 */}
          <div className="lm-overview-grid">
            <Card className="hover-lift-sm lm-chart-card lm-stagger-7">
              <CardHeader className="pb-2">
                <CardTitle className="lm-card-title text-sm">
                  <Briefcase className="h-4 w-4" style={{ color: "#8b5cf6" }} /> Department Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={deptDist} cx="50%" cy="50%" outerRadius={80} dataKey="value" nameKey="name" label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                        {deptDist.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                      </Pie>
                      <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                      <Legend wrapperStyle={{ fontSize: 10 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-lift-sm lm-chart-card lm-stagger-8">
              <CardHeader className="pb-2">
                <CardTitle className="lm-card-title text-sm">
                  <Clock className="h-4 w-4" style={{ color: "#10b981" }} /> Shift Coverage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={SHIFTS.map((s) => ({ name: s.name, count: data.employees.filter((e) => e.shift === s.name && e.status === "active").length, color: SHIFT_COLORS[s.name] }))}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                      <Bar dataKey="count" name="Employees" radius={[4, 4, 0, 0]}>
                        {SHIFTS.map((s, idx) => <Cell key={idx} fill={SHIFT_COLORS[s.name]} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-lift-sm lm-chart-card lm-stagger-9">
              <CardHeader className="pb-2">
                <CardTitle className="lm-card-title text-sm">
                  <Calendar className="h-4 w-4" style={{ color: "#f59e0b" }} /> Weekly Attendance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={data.weeklyAttendance}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                      <Legend wrapperStyle={{ fontSize: 10 }} />
                      <Bar dataKey="present" fill="#10b981" name="Present" radius={[2, 2, 0, 0]} />
                      <Bar dataKey="absent" fill="#ef4444" name="Absent" radius={[2, 2, 0, 0]} />
                      <Line type="monotone" dataKey="late" stroke="#f59e0b" name="Late" strokeWidth={2} dot={{ r: 3 }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Labor Cost Trend */}
          <Card className="hover-lift-sm lm-chart-card lm-stagger-10">
            <CardHeader className="pb-2">
              <CardTitle className="lm-card-title text-sm">
                <IndianRupee className="h-4 w-4" style={{ color: "#ec4899" }} /> Monthly Labor Cost Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.laborCostTrend}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`} />
                    <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} formatter={(v: number) => fmtINR(v)} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Area type="monotone" dataKey="baseCost" fill="#8b5cf6" stroke="#8b5cf6" fillOpacity={0.2} name="Base Cost" />
                    <Area type="monotone" dataKey="overtimeCost" fill="#f59e0b" stroke="#f59e0b" fillOpacity={0.2} name="Overtime Cost" />
                    <Area type="monotone" dataKey="total" fill="#10b981" stroke="#10b981" fillOpacity={0.1} name="Total" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ===== TAB 1: Employee Directory ===== */}
      {activeTab === 1 && (
        <div className="lm-tab-content space-y-4">
          {/* Filter Bar */}
          <div className="lm-filter-bar">
            <div className="lm-filter-group">
              <div className="lm-search-wrap">
                <Search className="lm-search-icon h-4 w-4" />
                <input
                  className="lm-search-input"
                  placeholder="Search by name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select className="lm-filter-select" value={filterDept} onChange={(e) => setFilterDept(e.target.value)}>
                <option value="all">All Departments</option>
                {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
              <select className="lm-filter-select" value={filterShift} onChange={(e) => setFilterShift(e.target.value)}>
                <option value="all">All Shifts</option>
                {SHIFTS.map((s) => <option key={s.name} value={s.name}>{s.name}</option>)}
              </select>
              <select className="lm-filter-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="on-leave">On Leave</option>
                <option value="absent">Absent</option>
                <option value="terminated">Terminated</option>
              </select>
              <select className="lm-filter-select" value={filterWarehouse} onChange={(e) => setFilterWarehouse(e.target.value)}>
                <option value="all">All Warehouses</option>
                {WAREHOUSES.map((w) => <option key={w} value={w}>{w}</option>)}
              </select>
            </div>
            <div className="lm-filter-info">
              <span className="lm-filter-count">{filteredEmployees.length} of {totalEmployees} employees</span>
            </div>
          </div>

          {/* Table */}
          <div className="lm-table-wrap" style={{ maxHeight: "540px", overflowY: "auto" }}>
            <table className="lm-table">
              <thead className="lm-table-head">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Role</th>
                  <th>Warehouse</th>
                  <th>Shift</th>
                  <th>Status</th>
                  <th>Attendance</th>
                  <th>Productivity</th>
                  <th>Rate (₹/hr)</th>
                  <th className="lm-cell-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="lm-table-row">
                    <td className="lm-cell-mono">{emp.id}</td>
                    <td className="lm-cell-name">{emp.firstName} {emp.lastName}</td>
                    <td><span className={`lm-dept-badge ${deptClass(emp.department)}`}>{emp.department}</span></td>
                    <td className="lm-cell-dept">{emp.role}</td>
                    <td className="lm-cell-warehouse">{emp.warehouse}</td>
                    <td><span className={`lm-shift-badge ${shiftClass(emp.shift)}`}>{emp.shift}</span></td>
                    <td>
                      <span className={`lm-status-badge ${statusClass(emp.status)}`}>
                        <span className="lm-status-dot" />
                        {emp.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ minWidth: "60px" }}>
                        <div className="lm-progress-label">
                          <span>{emp.attendancePct}%</span>
                        </div>
                        <div className="lm-progress-bar">
                          <div className={`lm-progress-fill ${progressClass(emp.attendancePct)}`} style={{ width: `${emp.attendancePct}%` }} />
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ minWidth: "60px" }}>
                        <div className="lm-progress-label">
                          <span className="lm-progress-value">{emp.productivityScore}</span>
                        </div>
                        <div className="lm-progress-bar">
                          <div className={`lm-progress-fill ${progressClass(emp.productivityScore)}`} style={{ width: `${emp.productivityScore}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="lm-cell-mono">{emp.hourlyRate}</td>
                    <td className="lm-cell-center">
                      <button className="lm-action-btn" onClick={() => setSelectedEmployee(emp)}>
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Drawer */}
          {selectedEmployee && (
            <>
              <div className="lm-drawer-backdrop" onClick={() => setSelectedEmployee(null)} />
              <div className="lm-drawer">
                <div className="lm-drawer-header">
                  <div>
                    <h2 className="lm-drawer-title">{selectedEmployee.firstName} {selectedEmployee.lastName}</h2>
                    <p className="lm-drawer-subtitle">{selectedEmployee.id} · {selectedEmployee.role}</p>
                  </div>
                  <button className="lm-drawer-close" onClick={() => setSelectedEmployee(null)}>
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="lm-drawer-body">
                  {/* Stats */}
                  <div className="lm-drawer-stats">
                    <div className="lm-drawer-stat">
                      <span className="lm-drawer-stat-value" style={{ color: selectedEmployee.attendancePct >= 80 ? "#6ee7b7" : "#fca5a5" }}>{selectedEmployee.attendancePct}%</span>
                      <span className="lm-drawer-stat-label">Attendance</span>
                    </div>
                    <div className="lm-drawer-stat">
                      <span className="lm-drawer-stat-value" style={{ color: selectedEmployee.productivityScore >= 80 ? "#6ee7b7" : "#fcd34d" }}>{selectedEmployee.productivityScore}</span>
                      <span className="lm-drawer-stat-label">Productivity</span>
                    </div>
                    <div className="lm-drawer-stat">
                      <span className="lm-drawer-stat-value">{selectedEmployee.overtimeHours}h</span>
                      <span className="lm-drawer-stat-label">Overtime</span>
                    </div>
                  </div>

                  {/* Personal Info */}
                  <div className="lm-drawer-section">
                    <h3 className="lm-drawer-section-title">
                      <ShieldCheck className="h-4 w-4" style={{ color: "#8b5cf6" }} /> Personal Information
                    </h3>
                    <div className="lm-drawer-info-grid">
                      <div className="lm-drawer-info-item">
                        <span className="lm-info-label">Department</span>
                        <span className="lm-info-value"><span className={`lm-dept-badge ${deptClass(selectedEmployee.department)}`}>{selectedEmployee.department}</span></span>
                      </div>
                      <div className="lm-drawer-info-item">
                        <span className="lm-info-label">Shift</span>
                        <span className="lm-info-value"><span className={`lm-shift-badge ${shiftClass(selectedEmployee.shift)}`}>{selectedEmployee.shift}</span></span>
                      </div>
                      <div className="lm-drawer-info-item">
                        <span className="lm-info-label">Warehouse</span>
                        <span className="lm-info-value">{selectedEmployee.warehouse}</span>
                      </div>
                      <div className="lm-drawer-info-item">
                        <span className="lm-info-label">Status</span>
                        <span className="lm-info-value"><span className={`lm-status-badge ${statusClass(selectedEmployee.status)}`}><span className="lm-status-dot" />{selectedEmployee.status}</span></span>
                      </div>
                      <div className="lm-drawer-info-item">
                        <span className="lm-info-label">Phone</span>
                        <span className="lm-info-mono">{selectedEmployee.phone}</span>
                      </div>
                      <div className="lm-drawer-info-item">
                        <span className="lm-info-label">Email</span>
                        <span className="lm-info-value" style={{ fontSize: "0.72rem" }}>{selectedEmployee.email}</span>
                      </div>
                    </div>
                  </div>

                  {/* Work Details */}
                  <div className="lm-drawer-section">
                    <h3 className="lm-drawer-section-title">
                      <Briefcase className="h-4 w-4" style={{ color: "#10b981" }} /> Work Details
                    </h3>
                    <div className="lm-drawer-info-grid">
                      <div className="lm-drawer-info-item">
                        <span className="lm-info-label">Hourly Rate</span>
                        <span className="lm-info-currency">{fmtINR(selectedEmployee.hourlyRate)}/hr</span>
                      </div>
                      <div className="lm-drawer-info-item">
                        <span className="lm-info-label">Days Worked</span>
                        <span className="lm-info-value">{selectedEmployee.totalDaysWorked}</span>
                      </div>
                      <div className="lm-drawer-info-item">
                        <span className="lm-info-label">Check-In</span>
                        <span className="lm-info-mono">{selectedEmployee.checkIn || "—"}</span>
                      </div>
                      <div className="lm-drawer-info-item">
                        <span className="lm-info-label">Check-Out</span>
                        <span className="lm-info-mono">{selectedEmployee.checkOut || "—"}</span>
                      </div>
                      <div className="lm-drawer-info-item">
                        <span className="lm-info-label">Break Duration</span>
                        <span className="lm-info-value">{selectedEmployee.breakDuration} min</span>
                      </div>
                      <div className="lm-drawer-info-item">
                        <span className="lm-info-label">Join Date</span>
                        <span className="lm-info-value">{new Date(selectedEmployee.joinDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bars */}
                  <div className="lm-drawer-section">
                    <h3 className="lm-drawer-section-title">
                      <BarChart3 className="h-4 w-4" style={{ color: "#f59e0b" }} /> Performance Metrics
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                      <div>
                        <div className="lm-progress-label">
                          <span>Attendance Rate</span>
                          <span className="lm-progress-value">{selectedEmployee.attendancePct}%</span>
                        </div>
                        <div className="lm-progress-bar">
                          <div className={`lm-progress-fill ${progressClass(selectedEmployee.attendancePct)}`} style={{ width: `${selectedEmployee.attendancePct}%` }} />
                        </div>
                      </div>
                      <div>
                        <div className="lm-progress-label">
                          <span>Productivity Score</span>
                          <span className="lm-progress-value">{selectedEmployee.productivityScore}/100</span>
                        </div>
                        <div className="lm-progress-bar">
                          <div className={`lm-progress-fill ${progressClass(selectedEmployee.productivityScore)}`} style={{ width: `${selectedEmployee.productivityScore}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* ===== TAB 2: Shift Scheduler ===== */}
      {activeTab === 2 && (
        <div className="lm-tab-content space-y-4">
          {/* Shift Grid Headers */}
          <div className="lm-shift-grid">
            {SHIFTS.map((shift) => (
              <div key={shift.name}>
                <div className={`lm-shift-col-header lm-shift-${shift.name.toLowerCase()}-header`}>
                  {shift.name} Shift
                  <span className="lm-shift-time">{shift.time}</span>
                </div>
                {WAREHOUSES.map((wh) => {
                  const whData = shiftWarehouseData.find((w) => w.warehouse === wh);
                  const count = whData ? whData[shift.name.toLowerCase() as keyof typeof whData] as number : 0;
                  const maxCapacity = 15;
                  const pctFill = Math.round((count / maxCapacity) * 100);
                  return (
                    <div key={wh} className={`lm-shift-card lm-shift-card-${shift.name.toLowerCase()}`} style={{ marginBottom: "0.5rem" }}>
                      <p className="lm-shift-card-warehouse">{wh.replace("WH-", "")}</p>
                      <p className="lm-shift-card-count">{count}</p>
                      <p className="lm-shift-card-label">employees</p>
                      <div className="lm-shift-card-bar">
                        <div className={`lm-shift-card-bar-fill lm-shift-card-bar-fill-${shift.name.toLowerCase()}`} style={{ width: `${Math.min(pctFill, 100)}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Shift Swap Requests */}
          <div className="lm-swap-section">
            <h3 className="lm-swap-title">
              <ArrowRightLeft className="h-4 w-4" style={{ color: "#8b5cf6" }} /> Shift Swap Requests
            </h3>
            <div className="lm-table-wrap" style={{ maxHeight: "320px", overflowY: "auto" }}>
              <table className="lm-table">
                <thead className="lm-table-head">
                  <tr>
                    <th>ID</th>
                    <th>Employee</th>
                    <th>Current Shift</th>
                    <th>Requested Shift</th>
                    <th>Reason</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.swapRequests.map((req) => (
                    <tr key={req.id} className="lm-table-row">
                      <td className="lm-cell-mono">{req.id}</td>
                      <td className="lm-cell-name">{req.employeeName}</td>
                      <td><span className={`lm-shift-badge ${shiftClass(req.currentShift)}`}>{req.currentShift}</span></td>
                      <td><span className={`lm-shift-badge ${shiftClass(req.requestedShift)}`}>{req.requestedShift}</span></td>
                      <td className="lm-cell-dept">{req.reason}</td>
                      <td className="lm-cell-mono">{req.date}</td>
                      <td><span className={`lm-swap-badge ${swapStatusClass(req.status)}`}>{req.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ===== TAB 3: Attendance & Time Tracking ===== */}
      {activeTab === 3 && (
        <div className="lm-tab-content space-y-4">
          {/* Daily Register Header */}
          <div className="lm-attendance-date-header">
            <span className="lm-attendance-date">
              <Calendar className="h-4 w-4 inline mr-2" style={{ color: "#8b5cf6" }} />
              {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}
            </span>
            <div className="lm-attendance-summary">
              <span className="lm-attendance-stat lm-attendance-stat-present">
                <CheckCircle2 className="h-3.5 w-3.5" /> {onShift} Present
              </span>
              <span className="lm-attendance-stat lm-attendance-stat-absent">
                <UserMinus className="h-3.5 w-3.5" /> {absent} Absent
              </span>
              <span className="lm-attendance-stat lm-attendance-stat-late">
                <AlertTriangle className="h-3.5 w-3.5" /> {data.employees.filter((e) => e.checkIn && e.status === "active" && parseInt(e.checkIn.split(":")[0]) > (e.shift === "Morning" ? 7 : e.shift === "Afternoon" ? 15 : 23)).length} Late
              </span>
              <span className="lm-attendance-stat lm-attendance-stat-leave">
                <Clock className="h-3.5 w-3.5" /> {data.employees.filter((e) => e.status === "on-leave").length} On Leave
              </span>
            </div>
          </div>

          {/* Attendance Register Table */}
          <div className="lm-table-wrap" style={{ maxHeight: "480px", overflowY: "auto" }}>
            <table className="lm-table">
              <thead className="lm-table-head">
                <tr>
                  <th>ID</th>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Shift</th>
                  <th>Status</th>
                  <th>Check-In</th>
                  <th>Check-Out</th>
                  <th>Break</th>
                  <th>Overtime</th>
                  <th>Attendance %</th>
                </tr>
              </thead>
              <tbody>
                {data.employees.slice(0, 50).map((emp) => (
                  <tr key={emp.id} className="lm-table-row">
                    <td className="lm-cell-mono">{emp.id}</td>
                    <td className="lm-cell-name">{emp.firstName} {emp.lastName}</td>
                    <td><span className={`lm-dept-badge ${deptClass(emp.department)}`}>{emp.department}</span></td>
                    <td><span className={`lm-shift-badge ${shiftClass(emp.shift)}`}>{emp.shift}</span></td>
                    <td>
                      <span className={`lm-status-badge ${statusClass(emp.status)}`}>
                        <span className="lm-status-dot" />{emp.status}
                      </span>
                    </td>
                    <td className="lm-checkin-time">{emp.checkIn || <span style={{ color: "#ef4444" }}>—</span>}</td>
                    <td className="lm-checkin-time">{emp.checkOut || <span style={{ color: "#64748b" }}>In Progress</span>}</td>
                    <td className="lm-break-duration">{emp.breakDuration} min</td>
                    <td className={`lm-overtime-hours ${otHoursClass(emp.overtimeHours)}`}>{emp.overtimeHours.toFixed(1)}h</td>
                    <td>
                      <div style={{ minWidth: "50px" }}>
                        <div className="lm-progress-bar">
                          <div className={`lm-progress-fill ${progressClass(emp.attendancePct)}`} style={{ width: `${emp.attendancePct}%` }} />
                        </div>
                        <span style={{ fontSize: "0.66rem", color: "#94a3b8", marginTop: "0.15rem", display: "block" }}>{emp.attendancePct}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Monthly Heatmap */}
          <div className="lm-heatmap-section">
            <h3 className="lm-swap-title">
              <BarChart3 className="h-4 w-4" style={{ color: "#10b981" }} /> Monthly Attendance Heatmap
            </h3>
            <div className="lm-heatmap-grid">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <div key={day} className="lm-heatmap-day">{day}</div>
              ))}
              {data.heatmapData.map((cell, i) => {
                const isWeekend = cell.day.endsWith("-Sun") || cell.day.endsWith("-Sat");
                return (
                  <div
                    key={i}
                    className={`lm-heatmap-cell ${heatmapClass(cell.value, isWeekend)}`}
                    title={`${cell.day}: ${cell.value}%`}
                  >
                    {cell.value}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ===== TAB 4: Performance & Overtime ===== */}
      {activeTab === 4 && (
        <div className="lm-tab-content space-y-4">
          {/* Charts Row */}
          <div className="lm-overview-grid">
            {/* Department Productivity */}
            <Card className="hover-lift-sm lm-chart-card lm-stagger-1">
              <CardHeader className="pb-2">
                <CardTitle className="lm-card-title text-sm">
                  <BarChart3 className="h-4 w-4" style={{ color: "#8b5cf6" }} /> Department Productivity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={deptProductivity} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} />
                      <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={100} />
                      <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                      <Bar dataKey="productivity" name="Avg Productivity" radius={[0, 4, 4, 0]}>
                        {deptProductivity.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Overtime Distribution */}
            <Card className="hover-lift-sm lm-chart-card lm-stagger-2">
              <CardHeader className="pb-2">
                <CardTitle className="lm-card-title text-sm">
                  <Clock className="h-4 w-4" style={{ color: "#f59e0b" }} /> Overtime Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={otRanges} cx="50%" cy="50%" outerRadius={80} innerRadius={40} dataKey="value" nameKey="name" label={({ name, value }) => `${name}: ${value}`}>
                        {otRanges.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                      </Pie>
                      <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                      <Legend wrapperStyle={{ fontSize: 10 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Top Performers */}
            <Card className="hover-lift-sm lm-chart-card lm-stagger-3">
              <CardHeader className="pb-2">
                <CardTitle className="lm-card-title text-sm">
                  <Award className="h-4 w-4" style={{ color: "#10b981" }} /> Top 10 Performers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ maxHeight: "280px", overflowY: "auto" }}>
                  <table className="lm-table">
                    <thead className="lm-table-head">
                      <tr>
                        <th className="lm-cell-center">#</th>
                        <th>Name</th>
                        <th>Department</th>
                        <th className="lm-cell-center">Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topPerformers.map((emp, idx) => (
                        <tr key={emp.id} className="lm-table-row">
                          <td className="lm-cell-center">
                            <span className={`lm-performer-rank ${idx === 0 ? "lm-rank-1" : idx === 1 ? "lm-rank-2" : idx === 2 ? "lm-rank-3" : "lm-rank-default"}`}>
                              {idx + 1}
                            </span>
                          </td>
                          <td className="lm-cell-name">{emp.firstName} {emp.lastName}</td>
                          <td><span className={`lm-dept-badge ${deptClass(emp.department)}`}>{emp.department}</span></td>
                          <td className="lm-cell-center">
                            <span style={{ fontWeight: 700, color: emp.productivityScore >= 90 ? "#6ee7b7" : emp.productivityScore >= 80 ? "#fcd34d" : "#94a3b8" }}>
                              {emp.productivityScore}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Overtime Approval Queue */}
          <Card className="hover-lift-sm lm-chart-card lm-stagger-4">
            <CardHeader className="pb-2">
              <CardTitle className="lm-card-title text-sm">
                <AlertTriangle className="h-4 w-4" style={{ color: "#f59e0b" }} /> Overtime Approval Queue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="lm-table-wrap" style={{ maxHeight: "320px", overflowY: "auto" }}>
                <table className="lm-table">
                  <thead className="lm-table-head">
                    <tr>
                      <th>ID</th>
                      <th>Employee</th>
                      <th>Department</th>
                      <th>Hours Req.</th>
                      <th>Date</th>
                      <th>Reason</th>
                      <th>Manager</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.otApprovals.map((ot) => (
                      <tr key={ot.id} className="lm-table-row">
                        <td className="lm-cell-mono">{ot.id}</td>
                        <td className="lm-cell-name">{ot.employeeName}</td>
                        <td><span className={`lm-dept-badge ${deptClass(ot.department)}`}>{ot.department}</span></td>
                        <td className="lm-cell-center">
                          <span className={`lm-overtime-hours ${ot.hoursRequested >= 3 ? "lm-overtime-critical" : ot.hoursRequested >= 2 ? "lm-overtime-warning" : "lm-overtime-normal"}`}>
                            {ot.hoursRequested}h
                          </span>
                        </td>
                        <td className="lm-cell-mono">{ot.date}</td>
                        <td className="lm-cell-dept">{ot.reason}</td>
                        <td className="lm-cell-name">{ot.manager}</td>
                        <td><span className={`lm-ot-status ${otStatusClass(ot.status)}`}>{ot.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
