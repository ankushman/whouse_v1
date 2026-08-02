"use client"
import { useState, useMemo } from "react";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/shared/page-header";
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar";
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb";

const COLORS = ["#0d9488", "#14b8a6", "#2dd4bf", "#5eead4", "#0f766e", "#115e59", "#134e4a", "#042f2e"];
const CORRIDORS = ["Mumbai-Delhi NH8", "Delhi-Kolkata NH2", "Bangalore-Chennai NH4", "Mumbai-Pune Expressway", "Delhi-Jaipur NH8", "Chennai-Hyderabad NH9", "Kolkata-Guwahati NH31", "Hyderabad-Bangalore NH44"];
const VEHICLES = ["20ft Container", "32ft Trailer", "40ft Trailer", "Open Truck", "Reefer Van", "Tanker", "Flatbed", "Multi-Axle"];
const CONDITIONS = ["Excellent", "Good", "Moderate", "Poor", "Under Repair", "Roadwork Delay", "Flooded Section", "Accident Zone"];
const WEATHER = ["Clear", "Light Rain", "Heavy Rain", "Fog", "Heat Wave", "Thunderstorm", "High Winds", "Normal"];

function ri(min: number, max: number, value: number) { return Math.max(min, Math.min(max, value)); }

interface RouteRecord {
  id: string;
  corridor: string;
  vehicle: string;
  condition: string;
  weather: string;
  distance: number;
  plannedTime: number;
  actualTime: number;
  etaDeviation: number;
  fuelCost: number;
  tollCost: number;
  totalCost: number;
  onTime: boolean;
  incidents: number;
  trafficIndex: number;
  driverRating: number;
  loadFactor: number;
}

function CorridorBadge({ corridor }: { corridor: string }) {
  const c = COLORS[CORRIDORS.indexOf(corridor) % COLORS.length];
  return <span style={{ background: `${c}22`, color: c, padding: "2px 10px", borderRadius: 12, fontSize: 12, fontWeight: 600, display: "inline-block", minWidth: 110, textAlign: "center" }}>{corridor}</span>;
}

function VehicleBadge({ vehicle }: { vehicle: string }) {
  return <span style={{ background: "#f3f4f6", color: "#374151", padding: "2px 10px", borderRadius: 12, fontSize: 12, fontWeight: 600, border: "1px solid #e5e7eb" }}>{vehicle}</span>;
}

function ConditionBadge({ condition }: { condition: string }) {
  const bad = condition.includes("Poor") || condition.includes("Repair") || condition.includes("Flooded") || condition.includes("Accident");
  const warn = condition.includes("Roadwork");
  return <span style={{ background: bad ? "#dc262622" : warn ? "#d9770622" : "#16a34a22", color: bad ? "#dc2626" : warn ? "#d97706" : "#16a34a", padding: "2px 10px", borderRadius: 12, fontSize: 12, fontWeight: 600 }}>{condition}</span>;
}

function WeatherBadge({ weather }: { weather: string }) {
  const bad = weather.includes("Heavy") || weather.includes("Fog") || weather.includes("Thunderstorm");
  const warn = weather.includes("Light") || weather.includes("Heat") || weather.includes("Winds");
  return <span style={{ background: bad ? "#dc262622" : warn ? "#d9770622" : "#0d948822", color: bad ? "#dc2626" : warn ? "#d97706" : "#0d9488", padding: "2px 10px", borderRadius: 12, fontSize: 12, fontWeight: 600 }}>{weather}</span>;
}

function DeviationBar({ deviation }: { deviation: number }) {
  const abs = Math.abs(deviation);
  const col = abs > 30 ? "#dc2626" : abs > 15 ? "#d97706" : "#16a34a";
  const pct = ri(0, 100, (abs / 60) * 100);
  return <div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 70, height: 6, background: "#f3f4f6", borderRadius: 3, overflow: "hidden" }}><div style={{ width: `${pct}%`, height: "100%", background: col, borderRadius: 3 }} /></div><span style={{ fontSize: 11, fontWeight: 600, color: col }}>{deviation > 0 ? "+" : ""}{deviation}%</span></div>;
}

function LoadRing({ load }: { load: number }) {
  const r = 18, sw = 3, circ = 2 * Math.PI * r, off = circ * (1 - ri(0, 100, load) / 100);
  const col = load >= 85 ? "#16a34a" : load >= 60 ? "#d97706" : "#dc2626";
  return <svg width={44} height={44}><circle cx={22} cy={22} r={r} fill="none" stroke="#e5e7eb" strokeWidth={sw} /><circle cx={22} cy={22} r={r} fill="none" stroke={col} strokeWidth={sw} strokeDasharray={circ} strokeDashoffset={off} strokeLinecap="round" transform="rotate(-90 22 22)" /><text x={22} y={26} textAnchor="middle" fontSize={11} fontWeight={700} fill={col}>{load}%</text></svg>;
}

function KpiTile({ label, value, unit, color }: { label: string; value: number; unit: string; color?: string }) {
  return <Card><CardContent className="rih-kpi"><div style={{ fontSize: 13, color: "#6b7280" }}>{label}</div><div style={{ fontSize: 26, fontWeight: 800, color: color || "#0d9488" }}>{value.toLocaleString()}<span style={{ fontSize: 13, fontWeight: 400 }}>{unit}</span></div></CardContent></Card>;
}

function OnTimeBadge({ onTime }: { onTime: boolean }) {
  return <span style={{ background: onTime ? "#16a34a22" : "#dc262622", color: onTime ? "#16a34a" : "#dc2626", padding: "2px 8px", borderRadius: 10, fontSize: 11, fontWeight: 700 }}>{onTime ? "On Time" : "Delayed"}</span>;
}

function genRecords(offset: number): RouteRecord[] {
  return Array.from({ length: 16 }, (_, i) => ({
    id: `RIH-${String(offset + i + 1).padStart(4, "0")}`,
    corridor: CORRIDORS[(offset + i) % CORRIDORS.length],
    vehicle: VEHICLES[(offset + i) % VEHICLES.length],
    condition: CONDITIONS[(offset + i) % CONDITIONS.length],
    weather: WEATHER[(offset + i) % WEATHER.length],
    distance: ri(180, 1650, 250 + ((offset + i) * 137) % 1400),
    plannedTime: ri(4, 24, 5 + ((offset + i) * 3) % 19),
    actualTime: ri(4, 30, 5 + ((offset + i) * 5) % 25),
    etaDeviation: ri(-12, 55, -8 + ((offset + i) * 7) % 63),
    fuelCost: ri(3500, 42000, 5000 + ((offset + i) * 3100) % 37000),
    tollCost: ri(800, 8500, 1000 + ((offset + i) * 700) % 7500),
    totalCost: ri(5000, 52000, 7000 + ((offset + i) * 3900) % 45000),
    onTime: (offset + i) % 4 !== 0,
    incidents: ri(0, 4, ((offset + i) * 3) % 5),
    trafficIndex: ri(2, 10, 3 + ((offset + i) * 2) % 8),
    driverRating: ri(3.0, 5.0, 3.5 + ((offset + i) * 0.3) % 1.5),
    loadFactor: ri(35, 98, 45 + ((offset + i) * 7) % 53),
  }));
}

const hand: RouteRecord[] = [
  { id: "RIH-0001", corridor: "Mumbai-Delhi NH8", vehicle: "40ft Trailer", condition: "Excellent", weather: "Clear", distance: 1420, plannedTime: 18, actualTime: 17, etaDeviation: -5.6, fuelCost: 38500, tollCost: 6200, totalCost: 44700, onTime: true, incidents: 0, trafficIndex: 4, driverRating: 4.8, loadFactor: 92 },
  { id: "RIH-0002", corridor: "Delhi-Kolkata NH2", vehicle: "32ft Trailer", condition: "Moderate", weather: "Light Rain", distance: 1480, plannedTime: 20, actualTime: 23, etaDeviation: 15, fuelCost: 41200, tollCost: 4800, totalCost: 46000, onTime: false, incidents: 1, trafficIndex: 7, driverRating: 4.2, loadFactor: 78 },
  { id: "RIH-0003", corridor: "Bangalore-Chennai NH4", vehicle: "Reefer Van", condition: "Good", weather: "Clear", distance: 350, plannedTime: 6, actualTime: 5.5, etaDeviation: -8.3, fuelCost: 8200, tollCost: 1800, totalCost: 10000, onTime: true, incidents: 0, trafficIndex: 3, driverRating: 4.9, loadFactor: 85 },
  { id: "RIH-0004", corridor: "Mumbai-Pune Expressway", vehicle: "20ft Container", condition: "Roadwork Delay", weather: "Clear", distance: 160, plannedTime: 3, actualTime: 4.2, etaDeviation: 40, fuelCost: 5800, tollCost: 1200, totalCost: 7000, onTime: false, incidents: 2, trafficIndex: 8, driverRating: 3.8, loadFactor: 65 },
  { id: "RIH-0005", corridor: "Delhi-Jaipur NH8", vehicle: "Open Truck", condition: "Excellent", weather: "Heat Wave", distance: 270, plannedTime: 4.5, actualTime: 4.2, etaDeviation: -6.7, fuelCost: 7800, tollCost: 2400, totalCost: 10200, onTime: true, incidents: 0, trafficIndex: 4, driverRating: 4.5, loadFactor: 88 },
  { id: "RIH-0006", corridor: "Chennai-Hyderabad NH9", vehicle: "Tanker", condition: "Poor", weather: "Heavy Rain", distance: 660, plannedTime: 10, actualTime: 14, etaDeviation: 40, fuelCost: 22500, tollCost: 3200, totalCost: 25700, onTime: false, incidents: 3, trafficIndex: 9, driverRating: 3.5, loadFactor: 55 },
  { id: "RIH-0007", corridor: "Kolkata-Guwahati NH31", vehicle: "Flatbed", condition: "Flooded Section", weather: "Heavy Rain", distance: 1080, plannedTime: 16, actualTime: 22, etaDeviation: 37.5, fuelCost: 34200, tollCost: 2100, totalCost: 36300, onTime: false, incidents: 3, trafficIndex: 9, driverRating: 3.2, loadFactor: 42 },
  { id: "RIH-0008", corridor: "Hyderabad-Bangalore NH44", vehicle: "Multi-Axle", condition: "Good", weather: "Clear", distance: 570, plannedTime: 8, actualTime: 7.5, etaDeviation: -6.3, fuelCost: 16800, tollCost: 2800, totalCost: 19600, onTime: true, incidents: 0, trafficIndex: 3, driverRating: 4.7, loadFactor: 94 },
  { id: "RIH-0009", corridor: "Mumbai-Delhi NH8", vehicle: "32ft Trailer", condition: "Good", weather: "Fog", distance: 1420, plannedTime: 18, actualTime: 21, etaDeviation: 16.7, fuelCost: 39800, tollCost: 6200, totalCost: 46000, onTime: false, incidents: 1, trafficIndex: 6, driverRating: 4.0, loadFactor: 82 },
  { id: "RIH-0010", corridor: "Delhi-Kolkata NH2", vehicle: "40ft Trailer", condition: "Excellent", weather: "Normal", distance: 1480, plannedTime: 20, actualTime: 19, etaDeviation: -5, fuelCost: 40500, tollCost: 4800, totalCost: 45300, onTime: true, incidents: 0, trafficIndex: 4, driverRating: 4.6, loadFactor: 91 },
];

const gen = [...genRecords(10), ...genRecords(26), ...genRecords(42)];
const allRecords = [...hand, ...gen];

const filterGroups = [
  { key: "corridor", label: "Corridor", options: CORRIDORS.map(c => ({ label: c, value: c, count: Math.floor(Math.random() * 10) + 5 })) },
  { key: "vehicle", label: "Vehicle", options: VEHICLES.map(v => ({ label: v, value: v, count: Math.floor(Math.random() * 10) + 5 })) },
  { key: "condition", label: "Road Condition", options: CONDITIONS.map(c => ({ label: c, value: c, count: Math.floor(Math.random() * 10) + 5 })) },
  { key: "weather", label: "Weather", options: WEATHER.map(w => ({ label: w, value: w, count: Math.floor(Math.random() * 10) + 5 })) },
];

const insights = [
  { title: "Mumbai-Delhi NH8 Corridor Performance", desc: "India's busiest freight corridor handles 42% of total route volume with an average on-time rate of 78%. The new Western Peripheral Expressway bypass has reduced Delhi entry congestion by 35%, but the Palwal toll plaza bottleneck adds 45-60 minutes during peak hours. AI-based departure time optimization recommends 10PM-2AM departures to avoid daytime heat and traffic." },
  { title: "Monsoon Impact on East India Routes", desc: "Kolkata-Guwahati NH31 and Chennai-Hyderabad NH9 corridors experience 40-65% ETA deviation during June-September monsoon months. The Siliguri corridor is particularly vulnerable with 12 flood-prone zones. Pre-positioning inventory at Siliguri and Guwahati transit hubs during monsoon season reduces emergency freight costs by 28% while maintaining 95% service levels." },
  { title: "Vehicle Utilization Optimization", desc: "Multi-axle vehicles achieve 15-20% better fuel efficiency per ton-km compared to 20ft containers on routes exceeding 500km. However, last-mile distribution still relies on 20ft containers and open trucks due to infrastructure constraints at smaller hubs. A mixed fleet strategy with multi-axle for trunk routes and smaller vehicles for last-mile optimizes both cost and delivery speed." },
  { title: "Driver Performance and Safety Analytics", desc: "Drivers with ratings above 4.5 show 62% fewer incidents and 18% better fuel efficiency. The network's top 15 drivers maintain an average rating of 4.85 with zero incidents over 12 months. A driver incentive programme linking bonuses to safety metrics and fuel efficiency has reduced insurance premiums by 22% while improving driver retention from 68% to 89%." },
];

export default function RouteIntelligenceHubView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

  const filtered = useMemo(() => {
    return allRecords.filter(r => {
      if (searchQuery && !r.id.toLowerCase().includes(searchQuery.toLowerCase()) && !r.corridor.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string));
    });
  }, [searchQuery, activeFilters]);

  const totalRecords = allRecords.length;
  const filteredCount = filtered.length;
  const onTimeRate = Math.round((allRecords.filter(r => r.onTime).length / allRecords.length) * 100);
  const avgDeviation = Math.round(allRecords.reduce((s, r) => s + Math.abs(r.etaDeviation), 0) / allRecords.length * 10) / 10;
  const totalCost = allRecords.reduce((s, r) => s + r.totalCost, 0);
  const avgLoad = Math.round(allRecords.reduce((s, r) => s + r.loadFactor, 0) / allRecords.length);

  const corridorData = CORRIDORS.map(c => {
    const recs = allRecords.filter(r => r.corridor === c);
    return { name: c, onTime: Math.round((recs.filter(r => r.onTime).length / Math.max(recs.length, 1)) * 100), deviation: Math.round(recs.reduce((s, r) => s + Math.abs(r.etaDeviation), 0) / Math.max(recs.length, 1)) };
  });

  const vehicleData = VEHICLES.map(v => {
    const recs = allRecords.filter(r => r.vehicle === v);
    return { name: v, cost: Math.round(recs.reduce((s, r) => s + r.totalCost, 0) / 1000), load: Math.round(recs.reduce((s, r) => s + r.loadFactor, 0) / Math.max(recs.length, 1)) };
  });

  const conditionData = CONDITIONS.map(c => ({ name: c, count: allRecords.filter(r => r.condition === c).length }));

  return (
    <div className="rih-root">
      <ModuleBreadcrumb items={[{ label: "Transport", href: "/" }, { label: "Route Intelligence Hub" }]} />
      <PageHeader title="Route Intelligence Hub" description="AI-powered route optimization, real-time corridor monitoring, vehicle utilization analytics, and weather-aware dispatch intelligence across 8 major Indian freight corridors" />
      <Tabs defaultValue="dashboard">
        <TabsList className="rih-tab-list"><TabsTrigger value="dashboard">Dashboard</TabsTrigger><TabsTrigger value="routes">Routes</TabsTrigger><TabsTrigger value="analytics">Analytics</TabsTrigger><TabsTrigger value="insights">Insights</TabsTrigger></TabsList>
        <TabsContent value="dashboard">
          <div className="rih-kpi-grid">
            <KpiTile label="On-Time Rate" value={onTimeRate} unit="%" color="#16a34a" />
            <KpiTile label="Avg Deviation" value={avgDeviation} unit="%" color="#d97706" />
            <KpiTile label="Total Cost" value={Math.round(totalCost / 100000)} unit="L" color="#dc2626" />
            <KpiTile label="Avg Load Factor" value={avgLoad} unit="%" color="#0891b2" />
          </div>
          <div className="rih-chart-row"><Card><CardHeader><CardTitle>On-Time % by Corridor</CardTitle></CardHeader><CardContent><BarChart data={corridorData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={9} /><YAxis fontSize={11} domain={[0, 100]} /><Tooltip /><Bar dataKey="onTime" fill="#0d9488" radius={[4, 4, 0, 0]} /></BarChart></CardContent></Card></div>
          <div className="rih-chart-row"><Card><CardHeader><CardTitle>ETA Deviation by Corridor</CardTitle></CardHeader><CardContent><LineChart data={corridorData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={9} /><YAxis fontSize={11} /><Tooltip /><Line type="monotone" dataKey="deviation" stroke="#dc2626" strokeWidth={2} /></LineChart></CardContent></Card></div>
          <div className="rih-chart-row"><Card><CardHeader><CardTitle>Cost vs Load Factor by Vehicle</CardTitle></CardHeader><CardContent><BarChart data={vehicleData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={10} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="cost" fill="#14b8a6" radius={[4, 4, 0, 0]} /><Bar dataKey="load" fill="#f59e0b" radius={[4, 4, 0, 0]} /></BarChart></CardContent></Card></div>
        </TabsContent>
        <TabsContent value="routes">
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery("")} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={(k, v) => setActiveFilters(p => { const arr = p[k] || []; return arr.includes(v) ? (function(){ const n = {...p}; n[k] = arr.filter(x => x !== v); if(n[k].length === 0) delete n[k]; return n })() : {...p, [k]: [...arr, v]} })} onClearAllFilters={() => setActiveFilters({})} totalItems={totalRecords} filteredCount={filteredCount} onRefresh={() => {}} placeholder="Search by ID or corridor..." />
          <div className="rih-table-wrap">
            <table className="rih-table">
              <thead><tr><th>ID</th><th>Corridor</th><th>Vehicle</th><th>Road</th><th>Weather</th><th>Dist.</th><th>ETA Dev</th><th>Cost</th><th>Traffic</th><th>Driver</th><th>Load</th><th>OTD</th><th>Inc.</th></tr></thead>
              <tbody>{filtered.map(r => (
                <tr key={r.id} className={r.incidents >= 3 ? "rih-row-critical" : !r.onTime ? "rih-row-warning" : ""}>
                  <td style={{ fontWeight: 700, fontSize: 12 }}>{r.id}</td>
                  <td><CorridorBadge corridor={r.corridor} /></td>
                  <td><VehicleBadge vehicle={r.vehicle} /></td>
                  <td><ConditionBadge condition={r.condition} /></td>
                  <td><WeatherBadge weather={r.weather} /></td>
                  <td style={{ fontSize: 12 }}>{r.distance} km</td>
                  <td><DeviationBar deviation={r.etaDeviation} /></td>
                  <td style={{ fontSize: 12, fontWeight: 600 }}>\u20b9{(r.totalCost / 1000).toFixed(1)}K</td>
                  <td style={{ fontSize: 12, color: r.trafficIndex >= 8 ? "#dc2626" : r.trafficIndex >= 6 ? "#d97706" : "#16a34a", fontWeight: 600 }}>{r.trafficIndex}/10</td>
                  <td style={{ fontSize: 12, color: r.driverRating >= 4.5 ? "#16a34a" : r.driverRating >= 3.5 ? "#d97706" : "#dc2626", fontWeight: 600 }}>{r.driverRating}</td>
                  <td><LoadRing load={r.loadFactor} /></td>
                  <td><OnTimeBadge onTime={r.onTime} /></td>
                  <td style={{ fontSize: 12, fontWeight: 700, color: r.incidents >= 3 ? "#dc2626" : r.incidents >= 1 ? "#d97706" : "#16a34a", textAlign: "center" }}>{r.incidents}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </TabsContent>
        <TabsContent value="analytics">
          <div className="rih-chart-row"><Card><CardHeader><CardTitle>Route Condition Breakdown</CardTitle></CardHeader><CardContent><PieChart><Pie data={conditionData} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={110} label fontSize={10}>{CONDITIONS.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></CardContent></Card></div>
          <div className="rih-chart-row"><Card><CardHeader><CardTitle>Distance vs Total Cost Correlation</CardTitle></CardHeader><CardContent><AreaChart data={allRecords.slice(0, 30).map(r => ({ name: r.id, distance: r.distance, cost: Math.round(r.totalCost / 1000) }))}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={9} /><YAxis fontSize={11} /><Tooltip /><Area type="monotone" dataKey="distance" stroke="#0d9488" fill="#0d948822" /><Area type="monotone" dataKey="cost" stroke="#f59e0b" fill="#f59e0b22" /></AreaChart></CardContent></Card></div>
        </TabsContent>
        <TabsContent value="insights">
          <div className="rih-insights-grid">{insights.map((ins, i) => <Card key={i} className="rih-insight-card"><CardHeader><CardTitle>{ins.title}</CardTitle></CardHeader><CardContent><p style={{ fontSize: 13, lineHeight: 1.7, color: "#4b5563" }}>{ins.desc}</p></CardContent></Card>)}</div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
