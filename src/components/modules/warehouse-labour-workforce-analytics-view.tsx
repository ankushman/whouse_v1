"use client";
import { useState } from "react";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar";
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb";

const COLORS = ["#0d9488", "#14b8a6", "#2dd4bf", "#5eead4", "#0f766e", "#115e59", "#134e4a", "#ccfbf1"];
const DEPARTMENTS = ["Receiving", "Putaway", "Picking", "Packing", "Shipping", "QC Inspection", "Returns Processing", "Cold Storage"];
const SKILL_LEVELS = ["Expert", "Skilled", "Semi-Skilled", "Trainee", "Temporary", "Contractor"];
const SHIFTS = ["Morning 6AM-2PM", "Afternoon 2PM-10PM", "Night 10PM-6AM", "Split Shift", "Flex Shift", "On-Call"];
const STATUS = ["Active", "On Leave", "Probation", "Suspended", "Resigned", "Under Training"];
const TABS = ["Dashboard", "Workforce Registry", "Productivity Metrics", "Insights"];

const SC: Record<string, string> = { green: "bg-green-100 text-green-700", amber: "bg-amber-100 text-amber-700", red: "bg-red-100 text-red-700", teal: "bg-teal-100 text-teal-700", slate: "bg-slate-100 text-slate-600", blue: "bg-blue-100 text-blue-700" };
const statusColor: Record<string, string> = { Active: "green", "On Leave": "amber", Probation: "blue", Suspended: "red", Resigned: "slate", "Under Training": "teal" };

function ri(min: number, max: number, value: number) { return Math.min(max, Math.max(min, value)); }

const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthlyHeadcount = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], perm: ri(320, 410, 360 + Math.sin(i * 0.5) * 25), contract: ri(80, 140, 105 + Math.cos(i * 0.4) * 20) }));
const deptDist = DEPARTMENTS.slice(0, 6).map((d, i) => ({ n: d, v: ri(40, 120, 75 - i * 8) }));
const shiftDist = SHIFTS.slice(0, 5).map((s, i) => ({ n: s, v: ri(60, 180, 130 - i * 18) }));
const productivityTrend = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], uph: ri(22, 38, 28 + Math.sin(i * 0.6) * 5), target: 30 }));
const safetyTrend = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], incidents: ri(0, 8, 3 + Math.cos(i * 0.8) * 3) }));

interface Worker { id: string; name: string; employeeId: string; department: string; shift: string; skillLevel: string; status: string; warehouse: string; uph: number; attendance: number; trainingHours: number; safetyScore: number; dateJoined: string; esiNumber: string; pfNumber: string; overtimeHrs: number; }

const workers: Worker[] = [
  { id: "WLA-0001", name: "Rajesh Kumar", employeeId: "WH-MH-1001", department: "Picking", shift: "Morning 6AM-2PM", skillLevel: "Expert", status: "Active", warehouse: "Bhiwandi DC", uph: 38, attendance: 98.5, trainingHours: 120, safetyScore: 96, dateJoined: "2021-03-15", esiNumber: "MH-BAN-45210", pfNumber: "PF/MH/28451", overtimeHrs: 24 },
  { id: "WLA-0002", name: "Priya Sharma", employeeId: "WH-KA-2001", department: "QC Inspection", shift: "Morning 6AM-2PM", skillLevel: "Skilled", status: "Active", warehouse: "Peenya DC", uph: 28, attendance: 97.2, trainingHours: 96, safetyScore: 94, dateJoined: "2022-06-10", esiNumber: "KA-BAN-78432", pfNumber: "PF/KA/51230", overtimeHrs: 18 },
  { id: "WLA-0003", name: "Suresh Patel", employeeId: "WH-GJ-3001", department: "Receiving", shift: "Afternoon 2PM-10PM", skillLevel: "Semi-Skilled", status: "On Leave", warehouse: "Sanand DC", uph: 24, attendance: 82.1, trainingHours: 48, safetyScore: 78, dateJoined: "2023-01-20", esiNumber: "GJ-AMD-12456", pfNumber: "PF/GJ/34671", overtimeHrs: 0 },
  { id: "WLA-0004", name: "Anitha Reddy", employeeId: "WH-TS-4001", department: "Packing", shift: "Morning 6AM-2PM", skillLevel: "Expert", status: "Active", warehouse: "Hyderabad DC", uph: 42, attendance: 99.1, trainingHours: 144, safetyScore: 98, dateJoined: "2020-09-05", esiNumber: "TS-HYD-37891", pfNumber: "PF/TS/19283", overtimeHrs: 36 },
  { id: "WLA-0005", name: "Mohan Singh", employeeId: "WH-DL-5001", department: "Shipping", shift: "Night 10PM-6AM", skillLevel: "Skilled", status: "Probation", warehouse: "NCR DC", uph: 30, attendance: 91.5, trainingHours: 24, safetyScore: 85, dateJoined: "2024-11-01", esiNumber: "DL-NC-89234", pfNumber: "PF/DL/76521", overtimeHrs: 12 },
  { id: "WLA-0006", name: "Lakshmi Nair", employeeId: "WH-KL-6001", department: "Returns Processing", shift: "Morning 6AM-2PM", skillLevel: "Skilled", status: "Active", warehouse: "Kochi DC", uph: 26, attendance: 96.8, trainingHours: 84, safetyScore: 92, dateJoined: "2022-04-18", esiNumber: "KL-COK-56123", pfNumber: "PF/KL/43012", overtimeHrs: 20 },
  { id: "WLA-0007", name: "Deepak Verma", employeeId: "WH-RJ-7001", department: "Cold Storage", shift: "Split Shift", skillLevel: "Semi-Skilled", status: "Under Training", warehouse: "Jaipur DC", uph: 20, attendance: 88.4, trainingHours: 16, safetyScore: 72, dateJoined: "2024-12-10", esiNumber: "RJ-JPR-91347", pfNumber: "PF/RJ/84521", overtimeHrs: 8 },
  { id: "WLA-0008", name: "Kavita Joshi", employeeId: "WH-MH-8001", department: "Putaway", shift: "Morning 6AM-2PM", skillLevel: "Expert", status: "Active", warehouse: "Pune DC", uph: 35, attendance: 98.9, trainingHours: 132, safetyScore: 97, dateJoined: "2021-07-22", esiNumber: "MH-PUN-28473", pfNumber: "PF/MH/62134", overtimeHrs: 28 },
  { id: "WLA-0009", name: "Arjun Das", employeeId: "WH-WB-9001", department: "Picking", shift: "Afternoon 2PM-10PM", skillLevel: "Trainee", status: "Active", warehouse: "Kolkata DC", uph: 18, attendance: 94.5, trainingHours: 40, safetyScore: 80, dateJoined: "2024-10-15", esiNumber: "WB-CAL-67832", pfNumber: "PF/WB/91832", overtimeHrs: 10 },
  { id: "WLA-0010", name: "Sunita Gupta", employeeId: "WH-HR-0101", department: "QC Inspection", shift: "Night 10PM-6AM", skillLevel: "Skilled", status: "Active", warehouse: "Kolkata DC", uph: 32, attendance: 97.8, trainingHours: 108, safetyScore: 95, dateJoined: "2022-02-28", esiNumber: "HR-SND-41298", pfNumber: "PF/HR/75231", overtimeHrs: 22 },
  { id: "WLA-0011", name: "Vijay Mistry", employeeId: "WH-GJ-1101", department: "Shipping", shift: "Morning 6AM-2PM", skillLevel: "Contractor", status: "Active", warehouse: "Surat DC", uph: 33, attendance: 89.2, trainingHours: 32, safetyScore: 82, dateJoined: "2024-06-01", esiNumber: "N/A-Contractor", pfNumber: "N/A-Contractor", overtimeHrs: 40 },
  { id: "WLA-0012", name: "Meera Krishnan", employeeId: "WH-TN-1201", department: "Receiving", shift: "Flex Shift", skillLevel: "Expert", status: "Active", warehouse: "Chennai DC", uph: 36, attendance: 99.4, trainingHours: 156, safetyScore: 99, dateJoined: "2020-05-10", esiNumber: "TN-CHN-12345", pfNumber: "PF/TN/10123", overtimeHrs: 30 },
  { id: "WLA-0013", name: "Rahul Yadav", employeeId: "WH-MP-1301", department: "Picking", shift: "Morning 6AM-2PM", skillLevel: "Semi-Skilled", status: "Suspended", warehouse: "Indore DC", uph: 22, attendance: 65.3, trainingHours: 20, safetyScore: 55, dateJoined: "2023-08-14", esiNumber: "MP-INR-78901", pfNumber: "PF/MP/56789", overtimeHrs: 0 },
  { id: "WLA-0014", name: "Divya Rani", employeeId: "WH-TG-1401", department: "Packing", shift: "On-Call", skillLevel: "Temporary", status: "Resigned", warehouse: "Vizag DC", uph: 25, attendance: 78.6, trainingHours: 12, safetyScore: 70, dateJoined: "2024-09-20", esiNumber: "TG-VZG-34567", pfNumber: "N/A-Temp", overtimeHrs: 4 },
];

const activeCount = workers.filter(w => w.status === "Active").length;
const avgUPH = (workers.filter(w => w.status === "Active").reduce((s, w) => s + w.uph, 0) / activeCount).toFixed(1);
const avgAttendance = (workers.reduce((s, w) => s + w.attendance, 0) / workers.length).toFixed(1);
const totalOT = workers.reduce((s, w) => s + w.overtimeHrs, 0);
const kpis = [
  { l: "Active Workforce", v: activeCount, s: "across 8 warehouses" },
  { l: "Avg UPH", v: avgUPH, s: "units per hour" },
  { l: "Avg Attendance", v: `${avgAttendance}%`, s: "monthly attendance" },
  { l: "Total Overtime", v: `${totalOT}hrs`, s: "current month" },
];

const INSIGHTS = [
  {
    t: "India\u2019s Warehouse Labour Market Transformation",
    c: "India\u2019s warehousing sector, now the world\u2019s third-largest by floor space at 380 million sqft across 15,000+ Grade-A/B/C facilities, is experiencing unprecedented labour demand growth of 28-35% annually driven by e-commerce fulfillment, 3PL consolidation, and the government\u2019s PM GatiShakti National Master Plan targeting 50,000 warehousing nodes by 2030. The sector employs approximately 4.2 crore workers in logistics and warehousing combined, with warehouse direct employment at 85-90 lakh and indirect (transport, loading, last-mile) employment at 2.5-3 crore. The shift from Grade-C godowns to Grade-A automated fulfillment centres has fundamentally changed skill requirements, with demand for semi-skilled pickers growing 40% annually while traditional labour-intensive roles decline by 12-15%. Average warehouse worker wages in organized logistics have risen from \u20b912,000-14,000 per month in 2020 to \u20b918,000-24,000 in 2025 across metro locations, with cold chain specialists commanding \u20b928,000-35,000 due to specialized handling requirements. The competitive landscape is dominated by Amazon TRS, Delhivery, and Reliance Retail offering 20-25% above market wages plus performance-linked bonuses, creating significant retention challenges for mid-sized 3PL operators who lose 18-22% of their trained workforce annually to larger competitors.",
  },
  {
    t: "CLRA Compliance and Labour Law Complexities",
    c: "The Contract Labour (Regulation and Abolition) Act 1970 (CLRA), the Industrial Disputes Act 1947, the Factories Act 1948, and the four new labour codes (Code on Wages 2019, Industrial Relations Code 2020, Social Security Code 2020, and Occupational Safety, Health and Working Conditions Code 2020) create a complex compliance framework that warehouse operators must navigate. For facilities exceeding 20 workers (CLRA threshold) or 10 workers with power machinery (Factories Act), compliance obligations include maintaining registers of employed contract workers, ensuring ESI (Employees\u2019 State Insurance) coverage for all workers earning below \u20b921,000 per month, EPF (Employees\u2019 Provident Fund) contributions at 12% employer + 12% employee, and overtime payments at 2x the normal hourly rate beyond 48 hours per week. The new labour codes consolidate 29 central labour laws into 4 codes, introducing fixed-term employment contracts that eliminate the distinction between permanent and contract workers for benefits purposes, mandatory creche facilities in establishments with 50+ women workers, and digital maintenance of all employment records through the Shram Suvidha Portal. Non-compliance penalties have increased 3-5x under the new codes, with imprisonment provisions for repeat offenders. Warehouse operators managing 200+ workers across multiple states face additional complexity from state-specific amendments, with Maharashtra, Karnataka, and Tamil Nadu imposing stricter overtime limits than the central thresholds.",
  },
  {
    t: "ESIC and PF Compliance Automation",
    c: "The Employees\u2019 State Insurance Corporation (ESIC) and Employees\u2019 Provident Fund Organisation (EPFO) have digitized their compliance frameworks through the ESIC 2.0 portal and EPFO unified portal, enabling automated monthly contributions, real-time compliance tracking, and digital inspection-ready record generation. For warehouse operators with 20+ employees earning below \u20b921,000 per month, ESIC contribution at 3.25% employer + 0.75% employee of gross wages covers medical, maternity, disability, and unemployment benefits. EPF contributions at 12% + 12% apply to establishments with 20+ employees, with KYC-linked UAN (Universal Account Number) enabling seamless portability when workers transition between employers\u2014a critical factor in India\u2019s high-turnover warehouse labour market with average tenure of 8-14 months. The integration of ESIC-EPFO data with the e-Shram portal (national unorganized workers database, 28 crore registrations) is enabling comprehensive workforce analytics, matching worker skills with warehouse demand across regions, and reducing compliance dispute resolution time from 60-90 days to 15-20 working days. Advanced warehouse operators leverage automated compliance engines that calculate contributions, generate challans, file monthly returns, and maintain inspection-ready digital registers, reducing HR compliance team requirements from 1 per 80 workers to 1 per 250 workers.",
  },
  {
    t: "Warehouse Productivity Benchmarking (UPH)",
    c: "Units Per Hour (UPH) is the primary productivity metric for Indian warehouse operations, with industry benchmarks varying significantly by activity type, automation level, and order profile complexity. For manual pick-pack-ship operations, average UPH ranges from 60-80 UPH for single-line orders, 25-35 UPH for multi-line orders, and 15-22 UPH for batched wave picking in traditional racking environments. Modern goods-to-person (GTP) systems achieve 120-180 UPH for single-line and 60-90 UPH for multi-line orders, representing a 2.5-3x productivity improvement over manual operations. India\u2019s top-performing warehouses (Amazon TRS Bhiwandi, Flipkart HSR Layout, Delhivery Nashik) report consolidated pick+pack UPH of 45-55 for multi-line e-commerce orders using put-to-light systems and zone routing optimization. Key productivity levers include slotting optimization (10-15% UPH improvement), voice/RF-directed picking (8-12% improvement), ergonomic workstation design (5-8% improvement), and performance-linked incentive programs (12-18% improvement). The most significant productivity gains come from warehouse management system (WMS) optimization, including intelligent order batching that groups orders by zone proximity, dynamic task interleaving that combines picking and packing in a single walk cycle, and real-time labor balancing algorithms that redistribute workers across zones based on real-time order queue depth.",
  },
];

export default function WarehouseLabourWorkforceAnalyticsView() {
  const [tab, setTab] = useState(0);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [search, setSearch] = useState("");

  const filterGroups = [
    { key: "department", label: "Department", options: DEPARTMENTS.map(d => ({ value: d, count: workers.filter(w => w.department === d).length })) },
    { key: "shift", label: "Shift", options: SHIFTS.map(s => ({ value: s, count: workers.filter(w => w.shift === s).length })) },
    { key: "skillLevel", label: "Skill", options: SKILL_LEVELS.map(s => ({ value: s, count: workers.filter(w => w.skillLevel === s).length })) },
    { key: "status", label: "Status", options: STATUS.map(s => ({ value: s, count: workers.filter(w => w.status === s).length })) },
  ];

  const toggleFilter = (k: string, v: string) => setActiveFilters(p => (function(){ const n={...p}; n[k]=(p[k]||[]).filter(x=>x!==v); if(n[k].length===0) delete n[k]; return n })());

  const filtered = workers.filter(w => {
    if (search) {
      const q = search.toLowerCase();
      if (!w.id.toLowerCase().includes(q) && !w.name.toLowerCase().includes(q) && !w.employeeId.toLowerCase().includes(q) && !w.warehouse.toLowerCase().includes(q)) return false;
    }
    return Object.entries(activeFilters).every(
      ([k, vs]) => vs.includes(w[k as keyof Worker] as string)
    );
  });

  const maxUPH = Math.max(...workers.map(w => w.uph));

  return (
    <div className="wlwa-root p-6 space-y-6">
      <PageHeader
        title="Warehouse Labour Workforce Analytics"
        description="Workforce headcount, attendance tracking, UPH productivity metrics, ESI/PF compliance and labour law management"
      />
      <div className="wlwa-tabs flex gap-1 border-b border-gray-200">
        {TABS.map((t, i) => (
          <button
            key={t}
            onClick={() => setTab(i)}
            className={`wlwa-tab px-4 py-2 text-sm font-medium rounded-t ${
              tab === i ? "bg-teal-600 text-white" : "text-gray-600 hover:bg-teal-50"
            }`}
          >{t}</button>
        ))}
      </div>

      {tab === 0 && (
        <div className="wlwa-dash space-y-6">
          <div className="wlwa-kpis grid grid-cols-4 gap-4">
            {kpis.map(k => (
              <div key={k.l} className="wlwa-kpi bg-white rounded-lg border p-4">
                <div className="text-xs text-gray-500 wlwa-kpi-label">{k.l}</div>
                <div className="text-2xl font-bold text-teal-700 wlwa-kpi-val">{k.v}</div>
                <div className="text-xs text-gray-400 wlwa-kpi-sub">{k.s}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="wlwa-chart bg-white rounded-lg border p-4">
              <h3 className="text-sm font-semibold mb-3">Monthly Headcount (Permanent vs Contract)</h3>
              <BarChart data={monthlyHeadcount} height={220}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="m" /><YAxis /><Tooltip /><Legend />
                <Bar dataKey="perm" fill="#0d9488" radius={[4, 4, 0, 0]} name="Permanent" />
                <Bar dataKey="contract" fill="#5eead4" radius={[4, 4, 0, 0]} name="Contract" />
              </BarChart>
            </div>
            <div className="wlwa-chart bg-white rounded-lg border p-4">
              <h3 className="text-sm font-semibold mb-3">Department Distribution</h3>
              <PieChart width={400} height={220}>
                <Pie data={deptDist} dataKey="v" nameKey="n" cx="50%" cy="50%" outerRadius={80} label>
                  {deptDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="wlwa-chart bg-white rounded-lg border p-4">
              <h3 className="text-sm font-semibold mb-3">Shift Distribution</h3>
              <PieChart width={400} height={220}>
                <Pie data={shiftDist} dataKey="v" nameKey="n" cx="50%" cy="50%" outerRadius={80} label>
                  {shiftDist.map((_, i) => <Cell key={i} fill={COLORS[(i + 2) % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </div>
            <div className="wlwa-chart bg-white rounded-lg border p-4">
              <h3 className="text-sm font-semibold mb-3">UPH vs Target (12 Months)</h3>
              <LineChart data={productivityTrend} height={220}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="m" /><YAxis /><Tooltip /><Legend />
                <Line type="monotone" dataKey="uph" stroke="#0d9488" strokeWidth={2} name="Actual UPH" />
                <Line type="monotone" dataKey="target" stroke="#dc2626" strokeWidth={2} strokeDasharray="5 5" name="Target (30)" />
              </LineChart>
            </div>
          </div>
        </div>
      )}

      {tab === 1 && (
        <div className="wlwa-workforce space-y-4">
          <ModuleBreadcrumb items={[{ label: "Labour", href: "#" }, { label: "Workforce Registry", href: "#" }]} />
          <SearchFilterToolbar searchQuery={search} onSearchChange={setSearch} onClearSearch={() => setSearch("")} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={workers.length} filteredCount={filtered.length} />
          <div className="wlwa-table-wrap overflow-x-auto bg-white rounded-lg border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  {"ID,Name,Emp ID,Department,Shift,Skill,Status,Warehouse,UPH,Attendance,Training Hrs,Safety,Joined,ESI No,PF No,Overtime"
                    .split(",").map(h => (
                    <th key={h} className="px-3 py-2 text-left text-xs font-medium text-gray-500 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(w => {
                  const rowCls = w.status === "Suspended"
                    ? "wlwa-row-critical bg-red-50"
                    : w.status === "On Leave" || w.status === "Probation"
                      ? "wlwa-row-warning bg-amber-50" : "";
                  const up = ri(0, 100, (w.uph / maxUPH) * 100);
                  return (
                    <tr key={w.id} className={`border-b hover:bg-teal-50/50 ${rowCls}`}>
                      <td className="px-3 py-2 font-mono font-medium">{w.id}</td>
                      <td className="px-3 py-2 font-medium">{w.name}</td>
                      <td className="px-3 py-2"><span className="wlwa-badge inline-block px-2 py-0.5 rounded text-xs bg-teal-100 text-teal-700">{w.employeeId}</span></td>
                      <td className="px-3 py-2"><span className="wlwa-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{w.department}</span></td>
                      <td className="px-3 py-2 text-xs">{w.shift}</td>
                      <td className="px-3 py-2"><span className={`wlwa-badge inline-block px-2 py-0.5 rounded text-xs ${w.skillLevel === "Expert" ? "bg-green-100 text-green-700" : w.skillLevel === "Skilled" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"}`}>{w.skillLevel}</span></td>
                      <td className="px-3 py-2"><span className={`wlwa-badge inline-block px-2 py-0.5 rounded text-xs font-semibold ${SC[statusColor[w.status]]}`}>{w.status}</span></td>
                      <td className="px-3 py-2 text-xs">{w.warehouse}</td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          <span className={`font-medium ${w.uph >= 35 ? "text-green-700" : w.uph >= 25 ? "text-amber-700" : "text-red-700"}`}>{w.uph}</span>
                          <div className="w-16 h-1.5 bg-gray-200 rounded">
                            <div className={`wlwa-uphbar h-1.5 rounded ${w.uph >= 35 ? "bg-green-500" : w.uph >= 25 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${up}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <span className={`inline-block px-2 py-0.5 rounded text-xs ${w.attendance >= 95 ? "bg-green-100 text-green-700" : w.attendance >= 85 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>
                          {w.attendance}%
                        </span>
                      </td>
                      <td className="px-3 py-2">{w.trainingHours}h</td>
                      <td className="px-3 py-2">
                        <span className={`inline-block px-2 py-0.5 rounded text-xs ${w.safetyScore >= 90 ? "bg-green-100 text-green-700" : w.safetyScore >= 75 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>
                          {w.safetyScore}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-xs">{w.dateJoined}</td>
                      <td className="px-3 py-2 text-xs font-mono">{w.esiNumber}</td>
                      <td className="px-3 py-2 text-xs font-mono">{w.pfNumber}</td>
                      <td className="px-3 py-2">
                        {w.overtimeHrs > 24 ? <span className="inline-block px-2 py-0.5 rounded text-xs bg-red-100 text-red-700">{w.overtimeHrs}h</span> :
                         w.overtimeHrs > 0 ? <span className="inline-block px-2 py-0.5 rounded text-xs bg-amber-100 text-amber-700">{w.overtimeHrs}h</span> :
                         <span className="text-green-600 text-xs">0h</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 2 && (
        <div className="wlwa-productivity space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="wlwa-chart bg-white rounded-lg border p-4">
              <h3 className="text-sm font-semibold mb-3">Safety Incidents Trend (12 Months)</h3>
              <BarChart data={safetyTrend} height={240}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="m" /><YAxis allowDecimals={false} /><Tooltip />
                <Bar dataKey="incidents" fill="#0f766e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </div>
            <div className="wlwa-chart bg-white rounded-lg border p-4">
              <h3 className="text-sm font-semibold mb-3">Attendance Trend (12 Months)</h3>
              <AreaChart data={Array.from({ length: 12 }, (_, i) => ({ m: MO[i], v: +(ri(90, 99, 94 + Math.sin(i * 0.5) * 3)).toFixed(1) }))} height={240}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="m" /><YAxis domain={[88, 100]} /><Tooltip />
                <Area type="monotone" dataKey="v" stroke="#0d9488" fill="#ccfbf1" />
              </AreaChart>
            </div>
          </div>
          <div className="wlwa-chart bg-white rounded-lg border p-4">
            <h3 className="text-sm font-semibold mb-3">UPH by Department</h3>
            <BarChart data={DEPARTMENTS.slice(0, 6).map(d => ({ n: d, v: ri(18, 42, 28 + Math.random() * 10) }))} height={240}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis /><Tooltip />
              <Bar dataKey="v" fill="#14b8a6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </div>
        </div>
      )}

      {tab === 3 && (
        <div className="wlwa-insights grid grid-cols-2 gap-6">
          {INSIGHTS.map(ins => (
            <div key={ins.t} className="wlwa-insight bg-white rounded-lg border p-5">
              <h3 className="text-base font-bold text-teal-800 mb-2">{ins.t}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{ins.c}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
