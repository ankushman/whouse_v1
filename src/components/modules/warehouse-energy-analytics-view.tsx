"use client"
import { useState, useMemo } from "react";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/shared/page-header";
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar";
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb";

const COLORS = ["#16a34a", "#22c55e", "#4ade80", "#86efac", "#15803d", "#166534", "#14532d", "#052e16"];
const WAREHOUSES = ["Mumbai Central Hub MH", "Delhi NCR Mega DC DL", "Bangalore South Campus KA", "Chennai Coastal Terminal TN", "Kolkata Eastern Hub WB", "Hyderabad Deccan Park TS", "Pune West Distribution MH", "Jaipur North Yard RJ"];
const ZONES = ["Ambient Storage", "Cold Storage", "Frozen Section", "HVAC Zone", "Loading Dock", "Office Complex", "Conveyor Systems", "EV Charging"];
const SOURCES = ["Grid Power", "Solar Rooftop", "Diesel Generator", "Wind Micro-Turbine", "Battery Storage", "Biomass Cogeneration"];
const CERTS = ["IGBC Certified", "LEED Gold", "GRIHA 4-Star", "BEE 5-Star", "ISO 50001", "Uncertified"];

function ri(min: number, max: number, value: number) { return Math.max(min, Math.min(max, value)); }

interface EnergyRecord {
  id: string;
  warehouse: string;
  zone: string;
  source: string;
  cert: string;
  consumption: number;
  cost: number;
  peakLoad: number;
  efficiency: number;
  co2: number;
  solarGen: number;
  temperature: number;
  humidity: number;
  powerFactor: number;
  uptime: number;
  alerts: number;
}

function WarehouseBadge({ warehouse }: { warehouse: string }) {
  const c = COLORS[WAREHOUSES.indexOf(warehouse) % COLORS.length];
  return <span style={{ background: `${c}22`, color: c, padding: "2px 10px", borderRadius: 12, fontSize: 12, fontWeight: 600, display: "inline-block", minWidth: 120, textAlign: "center" }}>{warehouse.split(" ").slice(0, 2).join(" ")}</span>;
}

function ZoneBadge({ zone }: { zone: string }) {
  const cold = zone.includes("Cold") || zone.includes("Frozen");
  return <span style={{ background: cold ? "#0891b222" : "#16a34a22", color: cold ? "#0891b2" : "#16a34a", padding: "2px 10px", borderRadius: 12, fontSize: 12, fontWeight: 600 }}>{zone}</span>;
}

function SourceBadge({ source }: { source: string }) {
  const green = source.includes("Solar") || source.includes("Wind") || source.includes("Biomass");
  return <span style={{ background: green ? "#16a34a22" : "#f3f4f6", color: green ? "#16a34a" : "#374151", padding: "2px 10px", borderRadius: 12, fontSize: 12, fontWeight: 600, border: green ? "none" : "1px solid #e5e7eb" }}>{source}</span>;
}

function CertBadge({ cert }: { cert: string }) {
  const c = cert === "Uncertified" ? "#dc2626" : "#16a34a";
  return <span style={{ background: `${c}22`, color: c, padding: "2px 8px", borderRadius: 10, fontSize: 11, fontWeight: 600 }}>{cert}</span>;
}

function EfficiencyRing({ efficiency }: { efficiency: number }) {
  const r = 18, sw = 3, circ = 2 * Math.PI * r, off = circ * (1 - ri(0, 100, efficiency) / 100);
  const col = efficiency >= 85 ? "#16a34a" : efficiency >= 70 ? "#d97706" : "#dc2626";
  return <svg width={44} height={44}><circle cx={22} cy={22} r={r} fill="none" stroke="#e5e7eb" strokeWidth={sw} /><circle cx={22} cy={22} r={r} fill="none" stroke={col} strokeWidth={sw} strokeDasharray={circ} strokeDashoffset={off} strokeLinecap="round" transform="rotate(-90 22 22)" /><text x={22} y={26} textAnchor="middle" fontSize={11} fontWeight={700} fill={col}>{efficiency}</text></svg>;
}

function ConsumpBar({ value, max }: { value: number; max: number }) {
  const pct = ri(0, 100, (value / max) * 100);
  const col = value > max * 0.8 ? "#dc2626" : value > max * 0.5 ? "#d97706" : "#16a34a";
  return <div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 80, height: 6, background: "#f3f4f6", borderRadius: 3, overflow: "hidden" }}><div style={{ width: `${pct}%`, height: "100%", background: col, borderRadius: 3 }} /></div><span style={{ fontSize: 11, color: "#6b7280" }}>{value.toLocaleString()}</span></div>;
}

function KpiTile({ label, value, unit, color }: { label: string; value: number; unit: string; color?: string }) {
  return <Card><CardContent className="wea-kpi"><div style={{ fontSize: 13, color: "#6b7280" }}>{label}</div><div style={{ fontSize: 26, fontWeight: 800, color: color || "#16a34a" }}>{value.toLocaleString()}<span style={{ fontSize: 13, fontWeight: 400 }}>{unit}</span></div></CardContent></Card>;
}

function genRecords(offset: number): EnergyRecord[] {
  return Array.from({ length: 16 }, (_, i) => ({
    id: `WEA-${String(offset + i + 1).padStart(4, "0")}`,
    warehouse: WAREHOUSES[(offset + i) % WAREHOUSES.length],
    zone: ZONES[(offset + i) % ZONES.length],
    source: SOURCES[(offset + i) % SOURCES.length],
    cert: CERTS[(offset + i) % CERTS.length],
    consumption: ri(120, 980, 200 + ((offset + i) * 137) % 780),
    cost: ri(8500, 72000, 12000 + ((offset + i) * 4200) % 60000),
    peakLoad: ri(45, 320, 60 + ((offset + i) * 31) % 260),
    efficiency: ri(62, 98, 68 + ((offset + i) * 7) % 30),
    co2: ri(18, 185, 25 + ((offset + i) * 11) % 160),
    solarGen: ri(0, 220, ((offset + i) * 17) % 220),
    temperature: ri(18, 38, 22 + ((offset + i) * 3) % 16),
    humidity: ri(35, 85, 40 + ((offset + i) * 7) % 45),
    powerFactor: ri(72, 99, 78 + ((offset + i) * 3) % 21),
    uptime: ri(94, 100, 95 + ((offset + i) % 6)),
    alerts: ri(0, 8, ((offset + i) * 3) % 9),
  }));
}

const hand: EnergyRecord[] = [
  { id: "WEA-0001", warehouse: "Mumbai Central Hub MH", zone: "Cold Storage", source: "Grid Power", cert: "IGBC Certified", consumption: 820, cost: 65400, peakLoad: 285, efficiency: 94, co2: 148, solarGen: 180, temperature: 24, humidity: 62, powerFactor: 96, uptime: 99.8, alerts: 1 },
  { id: "WEA-0002", warehouse: "Delhi NCR Mega DC DL", zone: "Ambient Storage", source: "Solar Rooftop", cert: "LEED Gold", consumption: 450, cost: 32100, peakLoad: 180, efficiency: 91, co2: 62, solarGen: 210, temperature: 36, humidity: 45, powerFactor: 94, uptime: 99.5, alerts: 2 },
  { id: "WEA-0003", warehouse: "Bangalore South Campus KA", zone: "Frozen Section", source: "Grid Power", cert: "GRIHA 4-Star", consumption: 940, cost: 71200, peakLoad: 310, efficiency: 88, co2: 172, solarGen: 95, temperature: 19, humidity: 55, powerFactor: 92, uptime: 98.7, alerts: 3 },
  { id: "WEA-0004", warehouse: "Chennai Coastal Terminal TN", zone: "HVAC Zone", source: "Diesel Generator", cert: "Uncertified", consumption: 680, cost: 58200, peakLoad: 240, efficiency: 72, co2: 185, solarGen: 0, temperature: 34, humidity: 78, powerFactor: 82, uptime: 96.2, alerts: 6 },
  { id: "WEA-0005", warehouse: "Kolkata Eastern Hub WB", zone: "Loading Dock", source: "Wind Micro-Turbine", cert: "BEE 5-Star", consumption: 280, cost: 18500, peakLoad: 110, efficiency: 96, co2: 28, solarGen: 120, temperature: 30, humidity: 72, powerFactor: 97, uptime: 99.9, alerts: 0 },
  { id: "WEA-0006", warehouse: "Hyderabad Deccan Park TS", zone: "Conveyor Systems", source: "Battery Storage", cert: "ISO 50001", consumption: 520, cost: 39800, peakLoad: 195, efficiency: 89, co2: 85, solarGen: 75, temperature: 32, humidity: 50, powerFactor: 91, uptime: 99.1, alerts: 2 },
  { id: "WEA-0007", warehouse: "Pune West Distribution MH", zone: "Office Complex", source: "Solar Rooftop", cert: "IGBC Certified", consumption: 310, cost: 22400, peakLoad: 125, efficiency: 97, co2: 35, solarGen: 195, temperature: 25, humidity: 48, powerFactor: 98, uptime: 99.7, alerts: 1 },
  { id: "WEA-0008", warehouse: "Jaipur North Yard RJ", zone: "EV Charging", source: "Biomass Cogeneration", cert: "LEED Gold", consumption: 420, cost: 28600, peakLoad: 165, efficiency: 86, co2: 52, solarGen: 85, temperature: 38, humidity: 35, powerFactor: 88, uptime: 97.8, alerts: 3 },
  { id: "WEA-0009", warehouse: "Mumbai Central Hub MH", zone: "Ambient Storage", source: "Grid Power", cert: "IGBC Certified", consumption: 380, cost: 29500, peakLoad: 145, efficiency: 93, co2: 68, solarGen: 160, temperature: 26, humidity: 65, powerFactor: 95, uptime: 99.4, alerts: 1 },
  { id: "WEA-0010", warehouse: "Delhi NCR Mega DC DL", zone: "Cold Storage", source: "Grid Power", cert: "LEED Gold", consumption: 760, cost: 60200, peakLoad: 270, efficiency: 85, co2: 138, solarGen: 145, temperature: 22, humidity: 58, powerFactor: 90, uptime: 98.5, alerts: 4 },
];

const gen = [...genRecords(10), ...genRecords(26), ...genRecords(42)];
const allRecords = [...hand, ...gen];

const filterGroups = [
  { key: "warehouse", label: "Warehouse", options: WAREHOUSES.map(w => ({ label: w.split(" ").slice(0, 2).join(" "), value: w, count: Math.floor(Math.random() * 10) + 5 })) },
  { key: "zone", label: "Zone", options: ZONES.map(z => ({ label: z, value: z, count: Math.floor(Math.random() * 10) + 5 })) },
  { key: "source", label: "Energy Source", options: SOURCES.map(s => ({ label: s, value: s, count: Math.floor(Math.random() * 10) + 5 })) },
  { key: "cert", label: "Certification", options: CERTS.map(c => ({ label: c, value: c, count: Math.floor(Math.random() * 10) + 5 })) },
];

const insights = [
  { title: "Solar Rooftop ROI Acceleration", desc: "Warehouses with solar rooftop installations achieve 35-45% reduction in grid power consumption, with Mumbai Central Hub generating 180 kWh/day from its 500kW rooftop array. The 18-month payback period is significantly shorter than the industry average of 36 months, driven by India's high irradiance levels of 5.5-6.5 kWh/m2/day across most logistics corridors." },
  { title: "Cold Chain Energy Optimization", desc: "Cold storage and frozen sections account for 42% of total warehouse energy consumption despite representing only 15% of floor area. Variable frequency drives on compressors, smart defrost scheduling, and night-time pre-cooling strategies have reduced cold storage energy intensity by 22% across the network, saving an estimated 8.5Cr annually." },
  { title: "Power Factor Correction Programme", desc: "Network-wide power factor averaging 0.91 indicates significant reactive power losses. Installing capacitor banks and active power factor correction units at 6 underperforming warehouses (power factor below 0.85) could reduce kVA demand charges by 12-18%, translating to annual savings of 2.8Cr in electricity bills for Delhi and Chennai locations." },
  { title: "Diesel Generator Phase-Out Plan", desc: "Chennai Coastal Terminal relies on diesel generators for 38% of its energy needs, resulting in the highest CO2 intensity at 185 kg/MWh. A planned transition to grid+solar hybrid by Q4 2026 will eliminate 6,200 tonnes of annual CO2 emissions while reducing energy costs by 24%, with a 30-month ROI on the solar+storage investment." },
];

export default function WarehouseEnergyAnalyticsView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

  const filtered = useMemo(() => {
    return allRecords.filter(r => {
      if (searchQuery && !r.id.toLowerCase().includes(searchQuery.toLowerCase()) && !r.warehouse.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string));
    });
  }, [searchQuery, activeFilters]);

  const totalRecords = allRecords.length;
  const filteredCount = filtered.length;
  const totalConsumption = allRecords.reduce((s, r) => s + r.consumption, 0);
  const totalCost = allRecords.reduce((s, r) => s + r.cost, 0);
  const avgEfficiency = Math.round(allRecords.reduce((s, r) => s + r.efficiency, 0) / allRecords.length);
  const totalSolar = allRecords.reduce((s, r) => s + r.solarGen, 0);

  const warehouseData = WAREHOUSES.map(w => {
    const recs = allRecords.filter(r => r.warehouse === w);
    return { name: w.split(" ").slice(0, 2).join(" "), consumption: Math.round(recs.reduce((s, r) => s + r.consumption, 0) / recs.length), cost: Math.round(recs.reduce((s, r) => s + r.cost, 0) / 1000), solar: Math.round(recs.reduce((s, r) => s + r.solarGen, 0) / recs.length) };
  });

  const sourceData = SOURCES.map(s => {
    const recs = allRecords.filter(r => r.source === s);
    return { name: s, count: recs.length, co2: Math.round(recs.reduce((a, r) => a + r.co2, 0) / Math.max(recs.length, 1)) };
  });

  const zoneData = ZONES.map(z => {
    const recs = allRecords.filter(r => r.zone === z);
    return { name: z, consumption: Math.round(recs.reduce((s, r) => s + r.consumption, 0) / Math.max(recs.length, 1)), efficiency: Math.round(recs.reduce((s, r) => s + r.efficiency, 0) / Math.max(recs.length, 1)) };
  });

  return (
    <div className="wea-root">
      <ModuleBreadcrumb items={[{ label: "Sustainability", href: "/" }, { label: "Warehouse Energy Analytics" }]} />
      <PageHeader title="Warehouse Energy Analytics" description="Comprehensive energy consumption monitoring, green energy tracking, and sustainability certification management across 8 Indian warehouse facilities" />
      <Tabs defaultValue="dashboard">
        <TabsList className="wea-tab-list"><TabsTrigger value="dashboard">Dashboard</TabsTrigger><TabsTrigger value="consumption">Consumption</TabsTrigger><TabsTrigger value="sources">Energy Sources</TabsTrigger><TabsTrigger value="insights">Insights</TabsTrigger></TabsList>
        <TabsContent value="dashboard">
          <div className="wea-kpi-grid">
            <KpiTile label="Total Consumption" value={totalConsumption} unit=" kWh" />
            <KpiTile label="Total Cost" value={Math.round(totalCost / 100000)} unit="L" color="#dc2626" />
            <KpiTile label="Avg Efficiency" value={avgEfficiency} unit="%" color="#0891b2" />
            <KpiTile label="Solar Generated" value={totalSolar} unit=" kWh" color="#d97706" />
          </div>
          <div className="wea-chart-row"><Card><CardHeader><CardTitle>Consumption by Warehouse</CardTitle></CardHeader><CardContent><BarChart data={warehouseData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={10} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="consumption" fill="#16a34a" radius={[4, 4, 0, 0]} /></BarChart></CardContent></Card></div>
          <div className="wea-chart-row"><Card><CardHeader><CardTitle>Cost vs Solar Generation</CardTitle></CardHeader><CardContent><AreaChart data={warehouseData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={10} /><YAxis fontSize={11} /><Tooltip /><Area type="monotone" dataKey="cost" stroke="#dc2626" fill="#dc262622" /><Area type="monotone" dataKey="solar" stroke="#d97706" fill="#d9770622" /></AreaChart></CardContent></Card></div>
          <div className="wea-chart-row"><Card><CardHeader><CardTitle>CO2 Intensity by Energy Source</CardTitle></CardHeader><CardContent><BarChart data={sourceData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={10} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="co2" fill="#14532d" radius={[4, 4, 0, 0]} /></BarChart></CardContent></Card></div>
        </TabsContent>
        <TabsContent value="consumption">
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery("")} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={(k, v) => setActiveFilters(p => { const arr = p[k] || []; return arr.includes(v) ? (function(){ const n = {...p}; n[k] = arr.filter(x => x !== v); if(n[k].length === 0) delete n[k]; return n })() : {...p, [k]: [...arr, v]} })} onClearAllFilters={() => setActiveFilters({})} totalItems={totalRecords} filteredCount={filteredCount} onRefresh={() => {}} placeholder="Search by ID or warehouse..." />
          <div className="wea-table-wrap">
            <table className="wea-table">
              <thead><tr><th>ID</th><th>Warehouse</th><th>Zone</th><th>Source</th><th>Cert</th><th>Consumption</th><th>Cost</th><th>Efficiency</th><th>CO2</th><th>Solar</th><th>Temp</th><th>PF</th><th>Alerts</th></tr></thead>
              <tbody>{filtered.map(r => (
                <tr key={r.id} className={r.alerts >= 5 ? "wea-row-critical" : r.alerts >= 3 ? "wea-row-warning" : ""}>
                  <td style={{ fontWeight: 700, fontSize: 12 }}>{r.id}</td>
                  <td><WarehouseBadge warehouse={r.warehouse} /></td>
                  <td><ZoneBadge zone={r.zone} /></td>
                  <td><SourceBadge source={r.source} /></td>
                  <td><CertBadge cert={r.cert} /></td>
                  <td><ConsumpBar value={r.consumption} max={1000} /></td>
                  <td style={{ fontSize: 12, fontWeight: 600 }}>\u20b9{(r.cost / 1000).toFixed(1)}K</td>
                  <td><EfficiencyRing efficiency={r.efficiency} /></td>
                  <td style={{ fontSize: 12, color: r.co2 > 120 ? "#dc2626" : r.co2 > 60 ? "#d97706" : "#16a34a", fontWeight: 600 }}>{r.co2} kg</td>
                  <td style={{ fontSize: 12, color: r.solarGen > 100 ? "#16a34a" : "#6b7280" }}>{r.solarGen} kWh</td>
                  <td style={{ fontSize: 12 }}>{r.temperature}&#176;C</td>
                  <td style={{ fontSize: 12, color: r.powerFactor >= 90 ? "#16a34a" : "#d97706" }}>{r.powerFactor}</td>
                  <td style={{ fontSize: 12, fontWeight: 700, color: r.alerts >= 5 ? "#dc2626" : r.alerts >= 3 ? "#d97706" : "#16a34a" }}>{r.alerts}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </TabsContent>
        <TabsContent value="sources">
          <div className="wea-chart-row"><Card><CardHeader><CardTitle>Zone-wise Consumption vs Efficiency</CardTitle></CardHeader><CardContent><LineChart data={zoneData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={10} /><YAxis fontSize={11} /><Tooltip /><Line type="monotone" dataKey="consumption" stroke="#16a34a" strokeWidth={2} /><Line type="monotone" dataKey="efficiency" stroke="#0891b2" strokeWidth={2} strokeDasharray="5 5" /></LineChart></CardContent></Card></div>
          <div className="wea-chart-row"><Card><CardHeader><CardTitle>Energy Mix Distribution</CardTitle></CardHeader><CardContent><PieChart><Pie data={SOURCES.map(s => ({ name: s, value: allRecords.filter(r => r.source === s).length }))} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={110} label fontSize={10}>{SOURCES.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></CardContent></Card></div>
        </TabsContent>
        <TabsContent value="insights">
          <div className="wea-insights-grid">{insights.map((ins, i) => <Card key={i} className="wea-insight-card"><CardHeader><CardTitle>{ins.title}</CardTitle></CardHeader><CardContent><p style={{ fontSize: 13, lineHeight: 1.7, color: "#4b5563" }}>{ins.desc}</p></CardContent></Card>)}</div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
