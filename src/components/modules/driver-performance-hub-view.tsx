"use client"
import { useState, useMemo } from "react";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/shared/page-header";
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar";
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb";

const COLORS = ["#7c3aed", "#8b5cf6", "#a78bfa", "#c4b5fd", "#6d28d9", "#5b21b6", "#4c1d95", "#ede9fe"];
const HUBS = ["Mumbai Central MH", "Delhi NCR DL", "Bangalore KA", "Chennai TN", "Kolkata WB", "Hyderabad TS", "Pune MH", "Jaipur RJ"];
const VEHICLES = ["Tata Ace", "Eicher 19ft", "Tata 407", "Ashok Leyland 20ft", "BharatBenz 28ft", "Mahindra Bolero", "Isuzu 40ft", "Eicher 35ft"];
const RANKS = ["Platinum Driver", "Gold Driver", "Silver Driver", "Bronze Driver", "Trainee", "Probation"];
const INCIDENTS = ["None", "Minor Delay", "Traffic Violation", "Vehicle Damage", "Cargo Damage", "Route Deviation", "Accident", "Fuel Theft"];

function ri(min: number, max: number, value: number) { return Math.max(min, Math.min(max, value)); }

interface DriverRecord {
  id: string;
  name: string;
  hub: string;
  vehicle: string;
  rank: string;
  trips: number;
  onTime: number;
  avgRating: number;
  fuelEfficiency: number;
  distanceKm: number;
  incidents: string;
  incidentsCount: number;
  idleHours: number;
  trainingHours: number;
  experience: number;
  safetyScore: number;
  earnings: number;
}

function HubBadge({ hub }: { hub: string }) {
  const c = COLORS[HUBS.indexOf(hub) % COLORS.length];
  return <span style={{ background: `${c}22`, color: c, padding: "2px 10px", borderRadius: 12, fontSize: 12, fontWeight: 600, display: "inline-block", minWidth: 90, textAlign: "center" }}>{hub}</span>;
}

function VehicleBadge({ vehicle }: { vehicle: string }) {
  return <span style={{ background: "#f3f4f6", color: "#374151", padding: "2px 10px", borderRadius: 12, fontSize: 12, fontWeight: 600, border: "1px solid #e5e7eb" }}>{vehicle}</span>;
}

function RankBadge({ rank }: { rank: string }) {
  const colors: Record<string, string> = { "Platinum Driver": "#7c3aed", "Gold Driver": "#d97706", "Silver Driver": "#6b7280", "Bronze Driver": "#b45309", "Trainee": "#3b82f6", "Probation": "#dc2626" };
  const c = colors[rank] || "#6b7280";
  return <span style={{ background: `${c}22`, color: c, padding: "2px 10px", borderRadius: 12, fontSize: 12, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 4 }}>{rank === "Platinum Driver" ? "\u2666" : rank === "Gold Driver" ? "\u2605" : rank === "Silver Driver" ? "\u25C6" : ""} {rank.replace(" Driver", "")}</span>;
}

function RatingBar({ rating }: { rating: number }) {
  const pct = ri(0, 100, (rating / 5) * 100);
  const col = rating >= 4.5 ? "#16a34a" : rating >= 3.5 ? "#d97706" : "#dc2626";
  const stars = Math.round(rating);
  return <div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 70, height: 6, background: "#f3f4f6", borderRadius: 3, overflow: "hidden" }}><div style={{ width: `${pct}%`, height: "100%", background: col, borderRadius: 3 }} /></div><span style={{ fontSize: 11, fontWeight: 700, color: col }}>{rating.toFixed(1)}</span><span style={{ fontSize: 10, color: "#d97706" }}>{"\u2605".repeat(stars)}{"\u2606".repeat(5 - stars)}</span></div>;
}

function SafetyRing({ score }: { score: number }) {
  const r = 18, sw = 3, circ = 2 * Math.PI * r, off = circ * (1 - ri(0, 100, score) / 100);
  const col = score >= 85 ? "#16a34a" : score >= 60 ? "#d97706" : "#dc2626";
  return <svg width={44} height={44}><circle cx={22} cy={22} r={r} fill="none" stroke="#e5e7eb" strokeWidth={sw} /><circle cx={22} cy={22} r={r} fill="none" stroke={col} strokeWidth={sw} strokeDasharray={circ} strokeDashoffset={off} strokeLinecap="round" transform="rotate(-90 22 22)" /><text x={22} y={26} textAnchor="middle" fontSize={11} fontWeight={700} fill={col}>{score}</text></svg>;
}

function FuelBar({ efficiency }: { efficiency: number }) {
  const pct = ri(0, 100, efficiency);
  const col = efficiency >= 80 ? "#16a34a" : efficiency >= 60 ? "#d97706" : "#dc2626";
  return <div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 60, height: 6, background: "#f3f4f6", borderRadius: 3, overflow: "hidden" }}><div style={{ width: `${pct}%`, height: "100%", background: col, borderRadius: 3 }} /></div><span style={{ fontSize: 11, fontWeight: 600, color: col }}>{efficiency}%</span></div>;
}

function KpiTile({ label, value, unit, color }: { label: string; value: number; unit: string; color?: string }) {
  return <Card><CardContent className="dph-kpi"><div style={{ fontSize: 13, color: "#6b7280" }}>{label}</div><div style={{ fontSize: 26, fontWeight: 800, color: color || "#7c3aed" }}>{value.toLocaleString()}<span style={{ fontSize: 13, fontWeight: 400 }}>{unit}</span></div></CardContent></Card>;
}

function IncidentBadge({ incident }: { incident: string }) {
  const severe = incident === "Accident" || incident === "Fuel Theft" || incident === "Cargo Damage";
  return <span style={{ background: severe ? "#dc262622" : incident === "None" ? "#16a34a22" : "#d9770622", color: severe ? "#dc2626" : incident === "None" ? "#16a34a" : "#d97706", padding: "2px 10px", borderRadius: 12, fontSize: 12, fontWeight: 600 }}>{incident}</span>;
}

const NAMES = ["Rajesh Kumar", "Suresh Yadav", "Amit Patel", "Vikram Singh", "Manoj Tiwari", "Anil Sharma", "Ravi Verma", "Pradeep Gupta", "Sunil Mehta", "Dinesh Rao", "Krishna Murthy", "Harish Nair", "Ganesh Patil", "Siddharth Das", "Arun Reddy", "Bhagwat Jha", "Nikhil Joshi", "Santosh Kulkarni", "Ramesh Iyer", "Kiran Hegde"];

function genRecords(offset: number): DriverRecord[] {
  return Array.from({ length: 16 }, (_, i) => ({
    id: `DPH-${String(offset + i + 1).padStart(4, "0")}`,
    name: NAMES[(offset + i) % NAMES.length],
    hub: HUBS[(offset + i) % HUBS.length],
    vehicle: VEHICLES[(offset + i) % VEHICLES.length],
    rank: RANKS[(offset + i) % RANKS.length],
    trips: ri(8, 120, 12 + ((offset + i) * 11) % 108),
    onTime: ri(55, 100, 60 + ((offset + i) * 7) % 40),
    avgRating: ri(2.8, 5.0, 3.0 + ((offset + i) * 0.4) % 2.0),
    fuelEfficiency: ri(42, 98, 48 + ((offset + i) * 7) % 50),
    distanceKm: ri(1200, 28000, 2000 + ((offset + i) * 1800) % 26000),
    incidents: INCIDENTS[(offset + i) % INCIDENTS.length],
    incidentsCount: ri(0, 5, ((offset + i) * 3) % 6),
    idleHours: ri(2, 28, 3 + ((offset + i) * 5) % 25),
    trainingHours: ri(0, 48, ((offset + i) * 7) % 48),
    experience: ri(6, 180, 8 + ((offset + i) * 13) % 172),
    safetyScore: ri(35, 99, 40 + ((offset + i) * 9) % 59),
    earnings: ri(12000, 85000, 15000 + ((offset + i) * 5800) % 70000),
  }));
}

const hand: DriverRecord[] = [
  { id: "DPH-0001", name: "Rajesh Kumar", hub: "Mumbai Central MH", vehicle: "Tata 407", rank: "Platinum Driver", trips: 98, onTime: 96, avgRating: 4.9, fuelEfficiency: 92, distanceKm: 24500, incidents: "None", incidentsCount: 0, idleHours: 4, trainingHours: 24, experience: 96, safetyScore: 97, earnings: 72000 },
  { id: "DPH-0002", name: "Suresh Yadav", hub: "Delhi NCR DL", vehicle: "Eicher 19ft", rank: "Gold Driver", trips: 82, onTime: 89, avgRating: 4.6, fuelEfficiency: 85, distanceKm: 18200, incidents: "Minor Delay", incidentsCount: 1, idleHours: 8, trainingHours: 18, experience: 72, safetyScore: 88, earnings: 58000 },
  { id: "DPH-0003", name: "Amit Patel", hub: "Bangalore KA", vehicle: "Ashok Leyland 20ft", rank: "Gold Driver", trips: 76, onTime: 92, avgRating: 4.7, fuelEfficiency: 88, distanceKm: 16800, incidents: "None", incidentsCount: 0, idleHours: 5, trainingHours: 20, experience: 60, safetyScore: 91, earnings: 55000 },
  { id: "DPH-0004", name: "Vikram Singh", hub: "Chennai TN", vehicle: "BharatBenz 28ft", rank: "Silver Driver", trips: 65, onTime: 78, avgRating: 3.8, fuelEfficiency: 72, distanceKm: 14200, incidents: "Traffic Violation", incidentsCount: 2, idleHours: 12, trainingHours: 12, experience: 36, safetyScore: 68, earnings: 42000 },
  { id: "DPH-0005", name: "Manoj Tiwari", hub: "Kolkata WB", vehicle: "Mahindra Bolero", rank: "Bronze Driver", trips: 42, onTime: 68, avgRating: 3.2, fuelEfficiency: 58, distanceKm: 9800, incidents: "Vehicle Damage", incidentsCount: 3, idleHours: 18, trainingHours: 8, experience: 18, safetyScore: 52, earnings: 28000 },
  { id: "DPH-0006", name: "Anil Sharma", hub: "Hyderabad TS", vehicle: "Isuzu 40ft", rank: "Platinum Driver", trips: 105, onTime: 98, avgRating: 4.8, fuelEfficiency: 95, distanceKm: 26200, incidents: "None", incidentsCount: 0, idleHours: 3, trainingHours: 28, experience: 120, safetyScore: 99, earnings: 82000 },
  { id: "DPH-0007", name: "Ravi Verma", hub: "Pune MH", vehicle: "Eicher 35ft", rank: "Probation", trips: 15, onTime: 58, avgRating: 2.9, fuelEfficiency: 48, distanceKm: 3200, incidents: "Route Deviation", incidentsCount: 2, idleHours: 22, trainingHours: 6, experience: 8, safetyScore: 38, earnings: 18000 },
  { id: "DPH-0008", name: "Pradeep Gupta", hub: "Jaipur RJ", vehicle: "Tata Ace", rank: "Silver Driver", trips: 58, onTime: 82, avgRating: 4.0, fuelEfficiency: 76, distanceKm: 12500, incidents: "Minor Delay", incidentsCount: 1, idleHours: 10, trainingHours: 14, experience: 42, safetyScore: 72, earnings: 38000 },
  { id: "DPH-0009", name: "Sunil Mehta", hub: "Mumbai Central MH", vehicle: "BharatBenz 28ft", rank: "Gold Driver", trips: 88, onTime: 91, avgRating: 4.5, fuelEfficiency: 84, distanceKm: 19800, incidents: "None", incidentsCount: 0, idleHours: 6, trainingHours: 22, experience: 84, safetyScore: 89, earnings: 65000 },
  { id: "DPH-0010", name: "Dinesh Rao", hub: "Chennai TN", vehicle: "Tata 407", rank: "Trainee", trips: 28, onTime: 72, avgRating: 3.5, fuelEfficiency: 62, distanceKm: 5800, incidents: "Cargo Damage", incidentsCount: 1, idleHours: 16, trainingHours: 10, experience: 12, safetyScore: 58, earnings: 22000 },
];

const gen = [...genRecords(10), ...genRecords(26), ...genRecords(42)];
const allRecords = [...hand, ...gen];

const filterGroups = [
  { key: "hub", label: "Hub", options: HUBS.map(h => ({ label: h, value: h, count: Math.floor(Math.random() * 10) + 5 })) },
  { key: "vehicle", label: "Vehicle", options: VEHICLES.map(v => ({ label: v, value: v, count: Math.floor(Math.random() * 10) + 5 })) },
  { key: "rank", label: "Rank", options: RANKS.map(r => ({ label: r, value: r, count: Math.floor(Math.random() * 10) + 5 })) },
  { key: "incidents", label: "Incident Type", options: INCIDENTS.map(i => ({ label: i, value: i, count: Math.floor(Math.random() * 10) + 5 })) },
];

const insights = [
  { title: "Platinum Driver Retention Strategy", desc: "Network's 12 Platinum Drivers maintain a 97% average safety score and 4.8+ rating. These top performers handle 35% of total trip volume while generating 28% higher revenue per trip than network average. A targeted retention programme offering monthly safety bonuses, preferred route assignments, and vehicle upgrade eligibility has maintained 100% retention among Platinum tier for the past 18 months." },
  { title: "Probation Driver Intervention Protocol", desc: "Drivers entering Probation status (safety score below 45 or incident count exceeding 3 in 30 days) trigger an automatic intervention workflow: mandatory 8-hour refresher training, supervised trips for 2 weeks, and weekly performance reviews. Data shows 68% of probation drivers recover to Bronze or Silver tier within 60 days, while 15% exit the programme voluntarily. Early intervention saves an estimated 12L per driver in avoided accident costs." },
  { title: "Fuel Efficiency Coaching Impact", desc: "Drivers completing the eco-driving coaching module show 18% average improvement in fuel efficiency scores. The programme uses telematics data to identify specific behaviours — excessive idling, harsh acceleration, and sub-optimal gear shifting — and provides personalised coaching plans. Bangalore hub achieved the highest improvement rate of 24% after implementing gamified fuel-saving challenges with monthly rewards." },
  { title: "Cross-Regional Experience Transfer", desc: "Drivers with experience on multiple corridor types (highway, urban, hilly) show 22% higher safety adaptability scores during new route assignments. The system now routes experienced multi-corridor drivers for first-time route launches, reducing initial incident rates by 35% compared to single-corridor drivers. A corridor certification programme tracks driver proficiency across 8 major Indian freight corridors." },
];

export default function DriverPerformanceHubView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

  const filtered = useMemo(() => {
    return allRecords.filter(r => {
      if (searchQuery && !r.id.toLowerCase().includes(searchQuery.toLowerCase()) && !r.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string));
    });
  }, [searchQuery, activeFilters]);

  const totalRecords = allRecords.length;
  const filteredCount = filtered.length;
  const avgRating = (allRecords.reduce((s, r) => s + r.avgRating, 0) / allRecords.length).toFixed(1);
  const totalTrips = allRecords.reduce((s, r) => s + r.trips, 0);
  const totalDistance = allRecords.reduce((s, r) => s + r.distanceKm, 0);
  const avgSafety = Math.round(allRecords.reduce((s, r) => s + r.safetyScore, 0) / allRecords.length);

  const rankData = RANKS.map(rk => ({ name: rk.replace(" Driver", ""), count: allRecords.filter(r => r.rank === rk).length, avgSafety: Math.round(allRecords.filter(r => r.rank === rk).reduce((s, r) => s + r.safetyScore, 0) / Math.max(allRecords.filter(r => r.rank === rk).length, 1)) }));

  const hubData = HUBS.map(h => {
    const recs = allRecords.filter(r => r.hub === h);
    return { name: h, trips: recs.reduce((s, r) => s + r.trips, 0), earnings: Math.round(recs.reduce((s, r) => s + r.earnings, 0) / 1000) };
  });

  const vehicleData = VEHICLES.map(v => {
    const recs = allRecords.filter(r => r.vehicle === v);
    return { name: v, fuel: Math.round(recs.reduce((s, r) => s + r.fuelEfficiency, 0) / Math.max(recs.length, 1)), distance: Math.round(recs.reduce((s, r) => s + r.distanceKm, 0) / Math.max(recs.length, 1) / 1000) };
  });

  return (
    <div className="dph-root">
      <ModuleBreadcrumb items={[{ label: "Fleet", href: "/" }, { label: "Driver Performance Hub" }]} />
      <PageHeader title="Driver Performance Hub" description="Comprehensive driver scorecards with safety analytics, fuel efficiency coaching, rank progression tracking, and performance-based incentive management across 8 Indian logistics hubs" />
      <Tabs defaultValue="dashboard">
        <TabsList className="dph-tab-list"><TabsTrigger value="dashboard">Dashboard</TabsTrigger><TabsTrigger value="drivers">Drivers</TabsTrigger><TabsTrigger value="analytics">Analytics</TabsTrigger><TabsTrigger value="insights">Insights</TabsTrigger></TabsList>
        <TabsContent value="dashboard">
          <div className="dph-kpi-grid">
            <KpiTile label="Total Drivers" value={totalRecords} unit="" />
            <KpiTile label="Avg Rating" value={parseFloat(avgRating)} unit="/5" color="#d97706" />
            <KpiTile label="Total Trips" value={totalTrips} unit="" color="#0891b2" />
            <KpiTile label="Avg Safety" value={avgSafety} unit="%" color="#16a34a" />
          </div>
          <div className="dph-chart-row"><Card><CardHeader><CardTitle>Trips & Earnings by Hub</CardTitle></CardHeader><CardContent><BarChart data={hubData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={10} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="trips" fill="#7c3aed" radius={[4, 4, 0, 0]} /><Bar dataKey="earnings" fill="#8b5cf6" radius={[4, 4, 0, 0]} /></BarChart></CardContent></Card></div>
          <div className="dph-chart-row"><Card><CardHeader><CardTitle>Fuel Efficiency vs Distance by Vehicle</CardTitle></CardHeader><CardContent><LineChart data={vehicleData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={10} /><YAxis fontSize={11} /><Tooltip /><Line type="monotone" dataKey="fuel" stroke="#7c3aed" strokeWidth={2} /><Line type="monotone" dataKey="distance" stroke="#06b6d4" strokeWidth={2} strokeDasharray="5 5" /></LineChart></CardContent></Card></div>
          <div className="dph-chart-row"><Card><CardHeader><CardTitle>Driver Count & Avg Safety by Rank</CardTitle></CardHeader><CardContent><BarChart data={rankData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={10} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="count" fill="#a78bfa" radius={[4, 4, 0, 0]} /><Bar dataKey="avgSafety" fill="#16a34a" radius={[4, 4, 0, 0]} /></BarChart></CardContent></Card></div>
        </TabsContent>
        <TabsContent value="drivers">
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery("")} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={(k, v) => setActiveFilters(p => { const arr = p[k] || []; return arr.includes(v) ? (function(){ const n = {...p}; n[k] = arr.filter(x => x !== v); if(n[k].length === 0) delete n[k]; return n })() : {...p, [k]: [...arr, v]} })} onClearAllFilters={() => setActiveFilters({})} totalItems={totalRecords} filteredCount={filteredCount} onRefresh={() => {}} placeholder="Search by ID or driver name..." />
          <div className="dph-table-wrap">
            <table className="dph-table">
              <thead><tr><th>ID</th><th>Driver</th><th>Hub</th><th>Vehicle</th><th>Rank</th><th>Trips</th><th>OTD</th><th>Rating</th><th>Fuel</th><th>Safety</th><th>Exp.</th><th>Earnings</th><th>Incident</th></tr></thead>
              <tbody>{filtered.map(r => (
                <tr key={r.id} className={r.incidentsCount >= 3 ? "dph-row-critical" : r.rank === "Probation" ? "dph-row-warning" : ""}>
                  <td style={{ fontWeight: 700, fontSize: 12 }}>{r.id}</td>
                  <td style={{ fontSize: 12, fontWeight: 600, minWidth: 100 }}>{r.name}</td>
                  <td><HubBadge hub={r.hub} /></td>
                  <td><VehicleBadge vehicle={r.vehicle} /></td>
                  <td><RankBadge rank={r.rank} /></td>
                  <td style={{ fontSize: 12, fontWeight: 600 }}>{r.trips}</td>
                  <td style={{ fontSize: 12, fontWeight: 600, color: r.onTime >= 90 ? "#16a34a" : r.onTime >= 75 ? "#d97706" : "#dc2626" }}>{r.onTime}%</td>
                  <td><RatingBar rating={r.avgRating} /></td>
                  <td><FuelBar efficiency={r.fuelEfficiency} /></td>
                  <td><SafetyRing score={r.safetyScore} /></td>
                  <td style={{ fontSize: 12 }}>{r.experience}mo</td>
                  <td style={{ fontSize: 12, fontWeight: 600, color: "#7c3aed" }}>\u20b9{(r.earnings / 1000).toFixed(1)}K</td>
                  <td><IncidentBadge incident={r.incidents} /></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </TabsContent>
        <TabsContent value="analytics">
          <div className="dph-chart-row"><Card><CardHeader><CardTitle>Rank Distribution</CardTitle></CardHeader><CardContent><PieChart><Pie data={RANKS.map(rk => ({ name: rk.replace(" Driver", ""), value: allRecords.filter(r => r.rank === rk).length }))} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={110} label fontSize={10}>{RANKS.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></CardContent></Card></div>
          <div className="dph-chart-row"><Card><CardHeader><CardTitle>Rating vs Safety Score Correlation</CardTitle></CardHeader><CardContent><AreaChart data={allRecords.slice(0, 25).map(r => ({ name: r.name.split(" ")[0], rating: r.avgRating, safety: r.safetyScore }))}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={9} /><YAxis fontSize={11} /><Tooltip /><Area type="monotone" dataKey="rating" stroke="#d97706" fill="#d9770622" /><Area type="monotone" dataKey="safety" stroke="#16a34a" fill="#16a34a22" /></AreaChart></CardContent></Card></div>
        </TabsContent>
        <TabsContent value="insights">
          <div className="dph-insights-grid">{insights.map((ins, i) => <Card key={i} className="dph-insight-card"><CardHeader><CardTitle>{ins.title}</CardTitle></CardHeader><CardContent><p style={{ fontSize: 13, lineHeight: 1.7, color: "#4b5563" }}>{ins.desc}</p></CardContent></Card>)}</div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
