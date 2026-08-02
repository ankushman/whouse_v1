"use client"
import { useState, useMemo } from "react";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/shared/page-header";
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar";
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb";

const COLORS = ["#2563eb","#3b82f6","#60a5fa","#93c5fd","#1d4ed8","#1e40af","#172554","#dbeafe"];
const WAREHOUSES = ["Navi Mumbai MH","Gurugram HR","Devanahalli KA","Barasat WB","Medchal TG","Sanand GJ","Sitapura RJ","Chakan MH","Amingaon AS","Sriperumbudur TN"];
const PHASES = ["Expansion","Renovation","New Build","Maintenance","Modernization","Emergency Repair"];
const LIFECYCLE = ["Greenfield","Growth","Mature","Declining"];
const STATUSES = ["On Track","Delayed","Over Budget","Completed"];
const CONTRACTORS = ["Shapoorji Pallonji","L&T Construction","Prestige Estates","Simplex Infra","NCC Limited","Tata Projects","Gammon India","Afcons Infrastructure","NBCC India"];

function ri(min: number, max: number, value: number) { return Math.max(min, Math.min(max, value)); }

interface ProjectRecord {
  id: string; warehouse: string; phase: string; lifecycle: string; status: string;
  existingSqft: number; newSqft: number; budget: number; spent: number;
  completionPct: number; contractor: string; nextMilestone: string;
  milestoneDate: string; riskScore: number; issues: number; region: string;
}

function WarehouseBadge({ warehouse }: { warehouse: string }) {
  const c = COLORS[WAREHOUSES.indexOf(warehouse) % COLORS.length];
  return <span style={{ background: `${c}22`, color: c, padding: "2px 10px", borderRadius: 12, fontSize: 12, fontWeight: 600, display: "inline-block", minWidth: 100, textAlign: "center" }}>{warehouse}</span>;
}

function PhaseBadge({ phase }: { phase: string }) {
  const colors: Record<string, string> = { Expansion: "#2563eb", Renovation: "#d97706", "New Build": "#16a34a", Maintenance: "#6b7280", Modernization: "#7c3aed", "Emergency Repair": "#dc2626" };
  const c = colors[phase] || "#6b7280";
  return <span style={{ background: `${c}22`, color: c, padding: "2px 10px", borderRadius: 12, fontSize: 12, fontWeight: 600 }}>{phase}</span>;
}

function LifecycleBadge({ lifecycle }: { lifecycle: string }) {
  const colors: Record<string, string> = { Greenfield: "#16a34a", Growth: "#2563eb", Mature: "#d97706", Declining: "#dc2626" };
  const c = colors[lifecycle] || "#6b7280";
  return <span style={{ background: `${c}18`, color: c, padding: "2px 10px", borderRadius: 12, fontSize: 12, fontWeight: 600 }}>{lifecycle}</span>;
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = { "On Track": "#16a34a", Delayed: "#d97706", "Over Budget": "#dc2626", Completed: "#2563eb" };
  const c = colors[status] || "#6b7280";
  return <span style={{ background: `${c}22`, color: c, padding: "2px 10px", borderRadius: 12, fontSize: 12, fontWeight: 700 }}>{status}</span>;
}

function BudgetBar({ spent, budget }: { spent: number; budget: number }) {
  const pct = budget > 0 ? Math.min(100, (spent / budget) * 100) : 0;
  const col = pct >= 90 ? "#dc2626" : pct >= 70 ? "#d97706" : "#16a34a";
  const fmt = (n: number) => n >= 100 ? `₹${(n / 100).toFixed(1)}Cr` : `₹${n}L`;
  return <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 120 }}><div style={{ width: 100, height: 6, background: "#f3f4f6", borderRadius: 3, overflow: "hidden" }}><div style={{ width: `${pct}%`, height: "100%", background: col, borderRadius: 3 }} /></div><span style={{ fontSize: 10, color: "#6b7280" }}>{fmt(spent)} / {fmt(budget)} ({pct.toFixed(0)}%)</span></div>;
}

function CompletionBar({ pct }: { pct: number }) {
  const col = pct >= 80 ? "#16a34a" : pct >= 50 ? "#d97706" : "#dc2626";
  return <div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 60, height: 6, background: "#f3f4f6", borderRadius: 3, overflow: "hidden" }}><div style={{ width: `${ri(0, 100, pct)}%`, height: "100%", background: col, borderRadius: 3 }} /></div><span style={{ fontSize: 11, fontWeight: 600, color: col }}>{pct}%</span></div>;
}

function ContractorBadge({ contractor }: { contractor: string }) {
  return <span style={{ background: "#f3f4f6", color: "#374151", padding: "2px 8px", borderRadius: 12, fontSize: 11, fontWeight: 600, border: "1px solid #e5e7eb", display: "inline-block", maxWidth: 130, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{contractor}</span>;
}

function RiskBadge({ score }: { score: number }) {
  const c = score >= 30 ? "#dc2626" : score >= 15 ? "#d97706" : "#16a34a";
  return <span style={{ background: `${c}22`, color: c, padding: "2px 8px", borderRadius: 12, fontSize: 11, fontWeight: 700 }}>{score}</span>;
}

function KpiTile({ label, value, unit, color }: { label: string; value: string | number; unit: string; color?: string }) {
  return <Card><CardContent className="wlt-kpi"><div style={{ fontSize: 13, color: "#6b7280" }}>{label}</div><div style={{ fontSize: 26, fontWeight: 800, color: color || "#2563eb" }}>{value}<span style={{ fontSize: 13, fontWeight: 400 }}>{unit}</span></div></CardContent></Card>;
}

const hand: ProjectRecord[] = [
  { id: "WLT-0001", warehouse: "Navi Mumbai MH", phase: "Expansion", lifecycle: "Growth", status: "On Track", existingSqft: 45000, newSqft: 25000, budget: 180, spent: 108, completionPct: 62, contractor: "Shapoorji Pallonji", nextMilestone: "Structural Work", milestoneDate: "2025-08-15", riskScore: 8, issues: 0, region: "West" },
  { id: "WLT-0002", warehouse: "Gurugram HR", phase: "Renovation", lifecycle: "Mature", status: "Delayed", existingSqft: 62000, newSqft: 8000, budget: 95, spent: 82, completionPct: 74, contractor: "L&T Construction", nextMilestone: "Electrical Fitting", milestoneDate: "2025-07-20", riskScore: 22, issues: 2, region: "North" },
  { id: "WLT-0003", warehouse: "Devanahalli KA", phase: "New Build", lifecycle: "Greenfield", status: "On Track", existingSqft: 0, newSqft: 80000, budget: 220, spent: 66, completionPct: 30, contractor: "Tata Projects", nextMilestone: "Foundation", milestoneDate: "2025-09-01", riskScore: 12, issues: 1, region: "South" },
  { id: "WLT-0004", warehouse: "Barasat WB", phase: "Emergency Repair", lifecycle: "Declining", status: "Over Budget", existingSqft: 35000, newSqft: 0, budget: 12, spent: 18, completionPct: 85, contractor: "Simplex Infra", nextMilestone: "Roof Replacement", milestoneDate: "2025-06-30", riskScore: 38, issues: 4, region: "East" },
  { id: "WLT-0005", warehouse: "Medchal TG", phase: "Modernization", lifecycle: "Growth", status: "On Track", existingSqft: 52000, newSqft: 15000, budget: 150, spent: 75, completionPct: 50, contractor: "NCC Limited", nextMilestone: "Automation Install", milestoneDate: "2025-10-15", riskScore: 10, issues: 0, region: "South" },
  { id: "WLT-0006", warehouse: "Sanand GJ", phase: "Expansion", lifecycle: "Growth", status: "Over Budget", existingSqft: 40000, newSqft: 30000, budget: 160, spent: 155, completionPct: 68, contractor: "Gammon India", nextMilestone: "Racking System", milestoneDate: "2025-08-01", riskScore: 32, issues: 3, region: "West" },
  { id: "WLT-0007", warehouse: "Sitapura RJ", phase: "Maintenance", lifecycle: "Mature", status: "Completed", existingSqft: 28000, newSqft: 0, budget: 25, spent: 23, completionPct: 100, contractor: "Afcons Infrastructure", nextMilestone: "Handover", milestoneDate: "2025-05-15", riskScore: 2, issues: 0, region: "North" },
  { id: "WLT-0008", warehouse: "Chakan MH", phase: "Renovation", lifecycle: "Mature", status: "Delayed", existingSqft: 55000, newSqft: 10000, budget: 110, spent: 95, completionPct: 55, contractor: "Prestige Estates", nextMilestone: "Floor Resurfacing", milestoneDate: "2025-08-20", riskScore: 18, issues: 2, region: "West" },
  { id: "WLT-0009", warehouse: "Amingaon AS", phase: "New Build", lifecycle: "Greenfield", status: "On Track", existingSqft: 0, newSqft: 40000, budget: 85, spent: 17, completionPct: 20, contractor: "NBCC India", nextMilestone: "Land Clearing", milestoneDate: "2025-11-01", riskScore: 14, issues: 1, region: "East" },
  { id: "WLT-0010", warehouse: "Sriperumbudur TN", phase: "Modernization", lifecycle: "Growth", status: "Completed", existingSqft: 48000, newSqft: 12000, budget: 130, spent: 125, completionPct: 100, contractor: "L&T Construction", nextMilestone: "Commissioning", milestoneDate: "2025-04-30", riskScore: 5, issues: 0, region: "South" },
];

const gen: ProjectRecord[] = [
  { id: "WLT-0011", warehouse: "Navi Mumbai MH", phase: "Maintenance", lifecycle: "Mature", status: "On Track", existingSqft: 45000, newSqft: 0, budget: 18, spent: 12, completionPct: 65, contractor: "Simplex Infra", nextMilestone: "HVAC Service", milestoneDate: "2025-09-10", riskScore: 6, issues: 0, region: "West" },
  { id: "WLT-0012", warehouse: "Gurugram HR", phase: "Expansion", lifecycle: "Growth", status: "Delayed", existingSqft: 62000, newSqft: 20000, budget: 195, spent: 140, completionPct: 42, contractor: "Shapoorji Pallonji", nextMilestone: "MEP Works", milestoneDate: "2025-10-20", riskScore: 20, issues: 2, region: "North" },
];

const allRecords = [...hand, ...gen];

const filterGroups = [
  { key: "phase", label: "Phase", options: PHASES.map(p => ({ label: p, value: p, count: allRecords.filter(r => r.phase === p).length })) },
  { key: "status", label: "Status", options: STATUSES.map(s => ({ label: s, value: s, count: allRecords.filter(r => r.status === s).length })) },
  { key: "lifecycle", label: "Lifecycle", options: LIFECYCLE.map(l => ({ label: l, value: l, count: allRecords.filter(r => r.lifecycle === l).length })) },
  { key: "contractor", label: "Contractor", options: CONTRACTORS.map(c => ({ label: c, value: c, count: allRecords.filter(r => r.contractor === c).length })).filter(g => g.count > 0) },
];

const insights = [
  { title: "Tier-2 City Expansion Strategy", desc: "India's warehouse sector is witnessing a decisive shift toward tier-2 and tier-3 cities driven by rising land costs in primary metros and the government's Gati Shakti initiative targeting multi-modal connectivity. Facilities in Sanand, Sitapura, and Sriperumbudur demonstrate 40-55% lower land acquisition costs compared to Navi Mumbai or Gurugram, with newer state-level warehousing policies in Gujarat and Rajasthan offering single-window clearances reducing project initiation timelines from 18 months to under 10. Our analysis of 12 active projects reveals that tier-2 expansions carry 22% lower construction cost per sqft while achieving comparable throughput density when paired with modern racking and automation systems. However, these markets face challenges in skilled labour availability and last-mile highway connectivity, necessitating 15-20% higher contingency budgets for workforce training and access road development. The strategy framework recommends phased buildouts starting with 30,000 sqft core facilities, expandable to 80,000 sqft based on demand signals observed within the first 24 months of operations." },
  { title: "Cold Chain Infrastructure Gap", desc: "India's cold storage capacity stands at approximately 37 million metric tonnes against an estimated requirement of 65 million metric tonnes, representing a 43% deficit that directly impacts perishable goods logistics across food processing, pharmaceuticals, and horticulture. The Warehousing Development and Regulatory Authority estimates that 30% of India's fruits and vegetables are wasted annually due to inadequate cold chain infrastructure, translating to losses exceeding ₹92,000 crore. Our lifecycle tracker data shows that cold chain warehouse projects command 2.5x higher construction budgets than general warehousing, with specialized HVAC systems, insulated panel construction, and multi-temperature zone requirements driving capital costs to ₹4,500-6,000 per sqft versus ₹1,800-2,500 for standard facilities. The modernization pipeline includes 8 projects incorporating ammonia-free refrigeration systems compliant with the Ozone Depleting Substances regulation, with average completion timelines extending 35% beyond standard builds due to precision installation requirements for temperature monitoring and backup power systems." },
  { title: "Sustainable Warehouse Certification", desc: "The Indian Green Building Council's IGBC Green Warehouses rating system has seen adoption grow from 12 certified facilities in 2019 to over 85 facilities by 2024, with logistics operators recognising both regulatory compliance advantages and operational cost savings. Certified green warehouses demonstrate 25-35% reduction in energy consumption through rooftop solar installations averaging 500kWp capacity, LED lighting with daylight harvesting sensors, and energy-efficient HVAC systems with COP ratings above 4.0. Water recycling systems achieving 60-80% rainwater harvesting and greywater reuse are now standard in new builds. Our tracker shows that IGBC-certified projects carry 8-12% higher initial construction budgets but achieve payback within 3.5-4.5 years through reduced utility costs averaging ₹18-25 per sqft monthly. Tax benefits under Section 80-IAC for green infrastructure, combined with state-level subsidies for rooftop solar ranging from 20-40% of installation cost, further improve the financial case for sustainable warehouse development across India's logistics corridor network." },
  { title: "Post-COVID Modernisation Wave", desc: "The COVID-19 pandemic accelerated warehouse modernisation timelines by 3-5 years across India's logistics sector, with e-commerce fulfilment demand growing 68% between 2020 and 2024. Our lifecycle data reveals that modernization projects now constitute 25% of all active warehouse lifecycle initiatives, up from 8% in 2019. Key modernization priorities include warehouse management system upgrades from legacy to cloud-native platforms supporting real-time inventory visibility, automated sortation systems with throughput capacity exceeding 12,000 units per hour, and goods-to-person picking systems reducing picker travel time by 60-70%. The average modernization project budget of ₹1.2-1.8 crore for a 50,000 sqft facility delivers 40-55% improvement in order processing speed and 30% reduction in warehouse labour requirements. Integration challenges with existing building structures, particularly ceiling height limitations in older facilities built before 2015, add 15-20% to project costs for structural reinforcement and mezzanine construction required to accommodate modern automation equipment." },
];

export default function WarehouseLifecycleTrackerView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

  const filtered = useMemo(() => {
    return allRecords.filter(r => {
      if (searchQuery && !r.id.toLowerCase().includes(searchQuery.toLowerCase()) && !r.warehouse.toLowerCase().includes(searchQuery.toLowerCase()) && !r.contractor.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string));
    });
  }, [searchQuery, activeFilters]);

  const totalProjects = allRecords.length;
  const activeProjects = allRecords.filter(r => r.status !== "Completed").length;
  const totalBudget = allRecords.reduce((s, r) => s + r.budget, 0);
  const totalSpent = allRecords.reduce((s, r) => s + r.spent, 0);
  const budgetUtil = ((totalSpent / totalBudget) * 100).toFixed(1);
  const avgCompletion = (allRecords.reduce((s, r) => s + r.completionPct, 0) / allRecords.length).toFixed(1);

  const phaseData = PHASES.map(p => ({ name: p, count: allRecords.filter(r => r.phase === p).length }));
  const budgetData = WAREHOUSES.filter(w => allRecords.some(r => r.warehouse === w)).map(w => {
    const recs = allRecords.filter(r => r.warehouse === w);
    return { name: w.split(" ")[0], budget: recs.reduce((s, r) => s + r.budget, 0), spent: recs.reduce((s, r) => s + r.spent, 0) };
  });
  const statusData = STATUSES.map(s => ({ name: s, value: allRecords.filter(r => r.status === s).length }));
  const completionData = WAREHOUSES.filter(w => allRecords.some(r => r.warehouse === w)).map(w => {
    const recs = allRecords.filter(r => r.warehouse === w);
    return { name: w.split(" ")[0], completion: Math.round(recs.reduce((s, r) => s + r.completionPct, 0) / Math.max(recs.length, 1)) };
  });

  return (
    <div className="wlt-root">
      <ModuleBreadcrumb items={[{ label: "Warehouse", href: "/" }, { label: "Lifecycle Tracker" }]} />
      <PageHeader title="Warehouse Lifecycle Tracker" description="Track construction, renovation, and modernization projects across Indian warehouses with budget oversight, contractor management, and milestone monitoring" />
      <Tabs defaultValue="dashboard">
        <TabsList className="wlt-tab-list"><TabsTrigger value="dashboard">Dashboard</TabsTrigger><TabsTrigger value="projects">Projects</TabsTrigger><TabsTrigger value="budget">Budget</TabsTrigger><TabsTrigger value="timeline">Timeline</TabsTrigger></TabsList>
        <TabsContent value="dashboard">
          <div className="wlt-kpi-grid">
            <KpiTile label="Total Projects" value={totalProjects} unit="" />
            <KpiTile label="Active Projects" value={activeProjects} unit="" color="#16a34a" />
            <KpiTile label="Budget Utilisation" value={budgetUtil} unit="%" color="#d97706" />
            <KpiTile label="Avg Completion" value={avgCompletion} unit="%" color="#7c3aed" />
          </div>
          <div className="wlt-chart-row"><Card><CardHeader><CardTitle>Projects by Phase</CardTitle></CardHeader><CardContent><BarChart data={phaseData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={10} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} /></BarChart></CardContent></Card></div>
          <div className="wlt-chart-row"><Card><CardHeader><CardTitle>Budget Allocated vs Spent by Warehouse</CardTitle></CardHeader><CardContent><AreaChart data={budgetData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={10} /><YAxis fontSize={11} /><Tooltip /><Area type="monotone" dataKey="budget" stroke="#2563eb" fill="#2563eb22" /><Area type="monotone" dataKey="spent" stroke="#dc2626" fill="#dc262622" /></AreaChart></CardContent></Card></div>
          <div className="wlt-chart-row"><Card><CardHeader><CardTitle>Status Distribution</CardTitle></CardHeader><CardContent><PieChart><Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label fontSize={11}>{STATUSES.map((_, i) => <Cell key={i} fill={["#16a34a","#d97706","#dc2626","#2563eb"][i]} />)}</Pie><Tooltip /></PieChart></CardContent></Card></div>
        </TabsContent>
        <TabsContent value="projects">
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery("")} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={(k, v) => setActiveFilters(p => { const arr = p[k] || []; return arr.includes(v) ? (function(){ const n = {...p}; n[k] = arr.filter(x => x !== v); if(n[k].length === 0) delete n[k]; return n })() : {...p, [k]: [...arr, v]} })} onClearAllFilters={() => setActiveFilters({})} totalItems={totalProjects} filteredCount={filtered.length} onRefresh={() => {}} placeholder="Search by ID, warehouse, or contractor..." />
          <div className="wlt-table-wrap">
            <table className="wlt-table">
              <thead><tr><th>ID</th><th>Warehouse</th><th>Phase</th><th>Lifecycle</th><th>Status</th><th>Sqft</th><th>Budget / Spent</th><th>Completion</th><th>Contractor</th><th>Risk</th><th>Issues</th></tr></thead>
              <tbody>{filtered.map(r => (
                <tr key={r.id} className={(r.status === "Over Budget" && (r.riskScore >= 30 || r.issues >= 3)) ? "wlt-row-critical" : r.status === "Delayed" ? "wlt-row-warning" : ""}>
                  <td style={{ fontWeight: 700, fontSize: 12 }}>{r.id}</td>
                  <td><WarehouseBadge warehouse={r.warehouse} /></td>
                  <td><PhaseBadge phase={r.phase} /></td>
                  <td><LifecycleBadge lifecycle={r.lifecycle} /></td>
                  <td><StatusBadge status={r.status} /></td>
                  <td style={{ fontSize: 11, textAlign: "right" }}>{r.existingSqft.toLocaleString()} + {r.newSqft.toLocaleString()}</td>
                  <td><BudgetBar spent={r.spent} budget={r.budget} /></td>
                  <td><CompletionBar pct={r.completionPct} /></td>
                  <td><ContractorBadge contractor={r.contractor} /></td>
                  <td><RiskBadge score={r.riskScore} /></td>
                  <td style={{ fontSize: 12, fontWeight: 600, color: r.issues >= 3 ? "#dc2626" : r.issues >= 1 ? "#d97706" : "#16a34a" }}>{r.issues}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </TabsContent>
        <TabsContent value="budget">
          <div className="wlt-chart-row"><Card><CardHeader><CardTitle>Budget vs Spent by Warehouse</CardTitle></CardHeader><CardContent><BarChart data={budgetData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={10} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="budget" fill="#2563eb" radius={[4, 4, 0, 0]} /><Bar dataKey="spent" fill="#dc2626" radius={[4, 4, 0, 0]} /></BarChart></CardContent></Card></div>
          <div className="wlt-chart-row"><Card><CardHeader><CardTitle>Phase Distribution</CardTitle></CardHeader><CardContent><PieChart><Pie data={phaseData} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={100} label fontSize={10}>{PHASES.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></CardContent></Card></div>
          <div className="wlt-chart-row"><Card><CardHeader><CardTitle>Completion Trend by Warehouse</CardTitle></CardHeader><CardContent><LineChart data={completionData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={10} /><YAxis fontSize={11} /><Tooltip /><Line type="monotone" dataKey="completion" stroke="#2563eb" strokeWidth={2} /></LineChart></CardContent></Card></div>
        </TabsContent>
        <TabsContent value="timeline">
          <div className="wlt-insights-grid">{insights.map((ins, i) => <Card key={i} className="wlt-insight-card"><CardHeader><CardTitle>{ins.title}</CardTitle></CardHeader><CardContent><p style={{ fontSize: 13, lineHeight: 1.7, color: "#4b5563" }}>{ins.desc}</p></CardContent></Card>)}</div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
