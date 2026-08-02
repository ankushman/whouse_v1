"use client"
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

const COLORS = ["#0891b2", "#06b6d4", "#22d3ee", "#67e8f9", "#0e7490", "#155e75", "#164e63", "#cffafe"]
const PORTS = ["JNPT Mumbai", "Chennai Port", "Kandla Port", "Mundra Port", "Vizag Port", "Kolkata Haldia", "Cochin Port", "Tuticorin Port", "Paradip Port", "Ennore Kamarajar"]
const VESSEL_TYPES = ["Container Ship", "Bulk Carrier", "Tanker", "Ro-Ro", "General Cargo", "LNG Carrier", "VLCC", "Cape Size"]
const OPERATORS = ["Maersk Line", "MSC", "CMA CGM", "COSCO", "Hapag-Lloyd", "Evergreen", "ONE", "Yang Ming", "Adani Ports", "DP World"]
const STATUS = ["At Berth", "Anchored", "Sailing In", "Sailing Out", "Delayed", "Waiting Pilot"]
const CARGO_TYPES = ["Container", "Bulk Coal", "Iron Ore", "Crude Oil", "LNG", "Wheat", "Fertiliser", "Auto", "Machinery", "TEU"]

function ri(min: number, max: number, value: number) { return Math.max(min, Math.min(max, value)) }

const vessels = [
  { id: "PVT-0001", vesselName: "MSC Avni", port: "JNPT Mumbai", type: "Container Ship", status: "At Berth", operator: "MSC", teu: 6200, cargo: "Container", waitHours: 4, berthDays: 2, eta: "2026-07-28", etd: "2026-07-30", draught: 12.8, pilotAssigned: "Capt. R. Sharma", agent: "Shreyas Shipping", flag: "Panama" },
  { id: "PVT-0002", vesselName: "Maersk Bengaluru", port: "Chennai Port", type: "Container Ship", status: "Anchored", operator: "Maersk Line", teu: 8400, cargo: "Container", waitHours: 18, berthDays: 0, eta: "2026-07-29", etd: "2026-08-01", draught: 14.2, pilotAssigned: "Pending", agent: "APL India", flag: "Singapore" },
  { id: "PVT-0003", vesselName: "COSCO Harmony", port: "Mundra Port", type: "Bulk Carrier", status: "At Berth", operator: "COSCO", teu: 0, cargo: "Bulk Coal", waitHours: 6, berthDays: 3, eta: "2026-07-26", etd: "2026-07-30", draught: 15.1, pilotAssigned: "Capt. P. Patel", agent: "Adani Ports", flag: "Hong Kong" },
  { id: "PVT-0004", vesselName: "CMA CGM Ganga", port: "Vizag Port", type: "Tanker", status: "Delayed", operator: "CMA CGM", teu: 0, cargo: "Crude Oil", waitHours: 52, berthDays: 0, eta: "2026-07-25", etd: "2026-07-28", draught: 16.8, pilotAssigned: "Pending", agent: "HPCL Agency", flag: "Liberia" },
  { id: "PVT-0005", vesselName: "Evergreen Godavari", port: "Kandla Port", type: "Container Ship", status: "Sailing In", operator: "Evergreen", teu: 4500, cargo: "TEU", waitHours: 2, berthDays: 0, eta: "2026-07-30", etd: "2026-08-02", draught: 11.6, pilotAssigned: "Capt. A. Khan", agent: "Gateway Terminals", flag: "Taiwan" },
  { id: "PVT-0006", vesselName: "ONE Kaveri", port: "Kolkata Haldia", type: "Bulk Carrier", status: "At Berth", operator: "ONE", teu: 0, cargo: "Iron Ore", waitHours: 8, berthDays: 4, eta: "2026-07-24", etd: "2026-07-29", draught: 13.4, pilotAssigned: "Capt. S. Mukherjee", agent: "SNP Kolkata", flag: "Marshall Islands" },
  { id: "PVT-0007", vesselName: "Yang Ming Narmada", port: "Tuticorin Port", type: "General Cargo", status: "Delayed", operator: "Yang Ming", teu: 1200, cargo: "Machinery", waitHours: 64, berthDays: 0, eta: "2026-07-22", etd: "2026-07-26", draught: 9.8, pilotAssigned: "Pending", agent: "V.O.C. Agency", flag: "Taiwan" },
  { id: "PVT-0008", vesselName: "Hapag-Lloyd Yamuna", port: "Cochin Port", type: "LNG Carrier", status: "At Berth", operator: "Hapag-Lloyd", teu: 0, cargo: "LNG", waitHours: 3, berthDays: 1, eta: "2026-07-29", etd: "2026-07-31", draught: 12.1, pilotAssigned: "Capt. K. Nair", agent: "Petronet LNG", flag: "Germany" },
  { id: "PVT-0009", vesselName: "DP World Sabarmati", port: "Paradip Port", type: "Bulk Carrier", status: "Waiting Pilot", operator: "DP World", teu: 0, cargo: "Wheat", waitHours: 28, berthDays: 0, eta: "2026-07-27", etd: "2026-07-30", draught: 10.5, pilotAssigned: "Pending", agent: "Paradip Port Trust", flag: "UAE" },
  { id: "PVT-0010", vesselName: "Maersk Chennai Express", port: "Ennore Kamarajar", type: "Ro-Ro", status: "Sailing Out", operator: "Maersk Line", teu: 800, cargo: "Auto", waitHours: 5, berthDays: 2, eta: "2026-07-27", etd: "2026-07-29", draught: 8.9, pilotAssigned: "Capt. M. Rajan", agent: "Hyundai India", flag: "Denmark" },
  { id: `PVT-0011`, vesselName: "Adani Daman", port: "Mundra Port", type: "Container Ship", status: "Anchored", operator: "Adani Ports", teu: 7500, cargo: "Container", waitHours: 14, berthDays: 0, eta: "2026-07-30", etd: "2026-08-03", draught: 13.9, pilotAssigned: "Pending", agent: "APM Terminals", flag: "India" },
  { id: `PVT-0012`, vesselName: "VLCC Sagar", port: "Kandla Port", type: "VLCC", status: "Delayed", operator: "COSCO", teu: 0, cargo: "Crude Oil", waitHours: 72, berthDays: 0, eta: "2026-07-20", etd: "2026-07-25", draught: 21.3, pilotAssigned: "Pending", agent: "Indian Oil Corp", flag: "Greece" },
  { id: `PVT-0013`, vesselName: "Cape Size Vedanta", port: "Paradip Port", type: "Cape Size", status: "At Berth", operator: "Adani Ports", teu: 0, cargo: "Iron Ore", waitHours: 10, berthDays: 5, eta: "2026-07-23", etd: "2026-07-29", draught: 18.6, pilotAssigned: "Capt. D. Das", agent: "Vedanta Resources", flag: "Panama" },
  { id: `PVT-0014`, vesselName: "MSC Tapti", port: "JNPT Mumbai", type: "Container Ship", status: "Waiting Pilot", operator: "MSC", teu: 5200, cargo: "Fertiliser", waitHours: 36, berthDays: 0, eta: "2026-07-28", etd: "2026-07-31", draught: 12.4, pilotAssigned: "Pending", agent: "JNPT Customs", flag: "Malta" },
]

const portVesselData = PORTS.map((p, i) => ({ port: p.replace(/ Port| Mumbai| Haldia| Kamarajar/, ""), vessels: ri(3, 18, 6 + Math.round(Math.sin(i * 1.7) * 5 + i * 0.8)) }))
const teuMonthly = Array.from({ length: 12 }, (_, i) => ({ month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i], teu: ri(12000, 28000, 18000 + Math.round(Math.sin(i * 0.6) * 6000 + i * 300)) }))
const statusDist = STATUS.map((s, i) => ({ status: s, count: [8, 4, 3, 2, 5, 2][i] || 1 }))
const berthUtil = PORTS.slice(0, 8).map((p, i) => ({ port: p.replace(/ Port| Mumbai/, ""), utilization: ri(55, 98, 70 + Math.round(Math.sin(i * 2.1) * 20)) }))
const cargoDist = CARGO_TYPES.slice(0, 7).map((c, i) => ({ cargo: c, value: ri(8, 30, 15 + Math.round(Math.sin(i * 1.3) * 10)) }))
const monthlyArrivals = Array.from({ length: 12 }, (_, i) => ({ month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i], arrivals: ri(40, 120, 75 + Math.round(Math.sin(i * 0.5) * 30 + i * 1.5)) }))

const filterGroups = [
  { key: "port", label: "Port", options: PORTS.map(p => ({ label: p, value: p, count: vessels.filter(v => v.port === p).length })) },
  { key: "type", label: "Vessel Type", options: VESSEL_TYPES.map(t => ({ label: t, value: t, count: vessels.filter(v => v.type === t).length })) },
  { key: "status", label: "Status", options: STATUS.map(s => ({ label: s, value: s, count: vessels.filter(v => v.status === s).length })) },
  { key: "operator", label: "Operator", options: OPERATORS.map(o => ({ label: o, value: o, count: vessels.filter(v => v.operator === o).length })) },
]

const statusColor = (s: string) => s === "At Berth" ? "#16a34a" : s === "Anchored" ? "#d97706" : s === "Delayed" ? "#dc2626" : s === "Sailing In" ? "#0891b2" : s === "Sailing Out" ? "#7c3aed" : "#6b7280"

export default function PortVesselTrackerView() {
  const [tab, setTab] = useState("dashboard")
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const filtered = useMemo(() => vessels.filter(v => Object.entries(activeFilters).every(([k, arr]) => !arr.length || arr.includes((v as Record<string, unknown>)[k] as string))), [activeFilters])
  const toggleFilter = (k: string, v: string) => setActiveFilters(p => (function () { const n = { ...p }; n[k] = (n[k] || []).filter(x => x !== v); if (n[k].length === 0) delete n[k]; return n })())

  const kpis = [
    { label: "Total Vessels", value: vessels.length, sub: "across 10 ports", color: "#0891b2" },
    { label: "At Berth", value: vessels.filter(v => v.status === "At Berth").length, sub: "currently docked", color: "#16a34a" },
    { label: "Avg Wait Time", value: `${(vessels.reduce((a, v) => a + v.waitHours, 0) / vessels.length).toFixed(1)}h`, sub: "across all vessels", color: "#d97706" },
    { label: "TEU Throughput", value: `${(vessels.reduce((a, v) => a + v.teu, 0) / 1000).toFixed(1)}K`, sub: "today capacity", color: "#7c3aed" },
  ]

  const PortBadge = (p: string) => <span style={{ background: "#0891b220", color: "#0891b2", padding: "2px 8px", borderRadius: "4px", fontSize: "12px", fontWeight: 500 }}>{p.replace(/ Port| Mumbai| Haldia| Kamarajar/, "")}</span>
  const TypeBadge = (t: string) => <span style={{ background: "#164e6320", color: "#164e63", padding: "2px 8px", borderRadius: "4px", fontSize: "12px" }}>{t}</span>
  const StatusBadge = (s: string) => <span style={{ background: `${statusColor(s)}20`, color: statusColor(s), padding: "2px 8px", borderRadius: "4px", fontSize: "12px", fontWeight: 600 }}>{s}</span>
  const OperatorBadge = (o: string) => <span style={{ background: "#06b6d415", color: "#0e7490", padding: "2px 8px", borderRadius: "4px", fontSize: "12px" }}>{o}</span>
  const TeuBar = (t: number) => t === 0 ? <span style={{ color: "#9ca3af", fontSize: "12px" }}>N/A</span> : <div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: ri(8, 80, (t / 8500) * 80), height: 6, background: "#0891b2", borderRadius: 3 }} /><span style={{ fontSize: "12px", color: "#374151" }}>{t.toLocaleString()}</span></div>
  const WaitBadge = (h: number) => <span style={{ background: h >= 48 ? "#dc262620" : h >= 24 ? "#d9770620" : "#16a34a20", color: h >= 48 ? "#dc2626" : h >= 24 ? "#d97706" : "#16a34a", padding: "2px 8px", borderRadius: "4px", fontSize: "12px", fontWeight: 600 }}>{h}h</span>

  const rowClass = (v: typeof vessels[0]) => (v.status === "Delayed" && v.waitHours >= 48) ? "pvt-row-critical" : (v.status === "Delayed" || v.waitHours >= 24) ? "pvt-row-warning" : ""

  return (
    <div className="pvt-root">
      <PageHeader title="Port Vessel Tracker" description="Real-time vessel tracking across major Indian ports — berth allocation, cargo handling &amp; demurrage monitoring" />
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList><TabsTrigger value="dashboard">Dashboard</TabsTrigger><TabsTrigger value="vessels">Vessels</TabsTrigger><TabsTrigger value="berths">Berths</TabsTrigger><TabsTrigger value="insights">Insights</TabsTrigger></TabsList>
        <TabsContent value="dashboard">
          <div className="pvt-kpi-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 20 }}>
            {kpis.map(k => <Card key={k.label}><CardContent style={{ padding: 20 }}><div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>{k.label}</div><div style={{ fontSize: 28, fontWeight: 700, color: k.color }}>{k.value}</div><div style={{ fontSize: 12, color: "#9ca3af" }}>{k.sub}</div></CardContent></Card>)}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 16 }}>
            <Card><CardHeader><CardTitle style={{ fontSize: 15 }}>Vessel Count by Port</CardTitle></CardHeader><CardContent><BarChart data={portVesselData} height={260}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="port" fontSize={11} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="vessels" fill="#0891b2" radius={[4, 4, 0, 0]} /></BarChart></CardContent></Card>
            <Card><CardHeader><CardTitle style={{ fontSize: 15 }}>Vessel Status Distribution</CardTitle></CardHeader><CardContent><PieChart><Pie data={statusDist} cx="50%" cy="50%" outerRadius={90} dataKey="count" nameKey="status" label={({ status, percent }) => `${status} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={10}>{statusDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></CardContent></Card>
          </div>
          <Card><CardHeader><CardTitle style={{ fontSize: 15 }}>Daily TEU Throughput — 12 Month Trend</CardTitle></CardHeader><CardContent><AreaChart data={teuMonthly} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" fontSize={11} /><YAxis fontSize={11} /><Tooltip /><Area type="monotone" dataKey="teu" stroke="#0891b2" fill="#0891b220" strokeWidth={2} /></AreaChart></CardContent></Card>
        </TabsContent>
        <TabsContent value="vessels">
          <ModuleBreadcrumb items={[{ label: "Port Tracker" }, { label: "Vessels" }]} />
          <SearchFilterToolbar searchQuery="" onSearchChange={() => {}} onClearSearch={() => {}} activeFilters={activeFilters} filterGroups={filterGroups.map(g => ({ key: g.key, label: g.label, options: g.options }))} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={vessels.length} filteredCount={filtered.length} />
          <Card style={{ marginTop: 16, overflow: "auto" }}><CardContent style={{ padding: 0 }}>
            <table className="pvt-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead><tr style={{ background: "#0891b210", borderBottom: "2px solid #0891b2" }}>{["ID", "Vessel", "Port", "Type", "Status", "TEU", "Cargo", "Wait", "Berth", "ETA", "ETD", "Operator"].map(h => <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600, color: "#164e63", whiteSpace: "nowrap" }}>{h}</th>)}</tr></thead>
              <tbody>
                {filtered.map(v => (
                  <tr key={v.id} className={rowClass(v)} style={{ borderBottom: "1px solid #e5e7eb", transition: "background 0.15s" }}>
                    <td style={{ padding: "8px 12px", fontFamily: "monospace", fontSize: 12, color: "#6b7280" }}>{v.id}</td>
                    <td style={{ padding: "8px 12px", fontWeight: 600 }}>{v.vesselName}</td>
                    <td style={{ padding: "8px 12px" }}>{PortBadge(v.port)}</td>
                    <td style={{ padding: "8px 12px" }}>{TypeBadge(v.type)}</td>
                    <td style={{ padding: "8px 12px" }}>{StatusBadge(v.status)}</td>
                    <td style={{ padding: "8px 12px", minWidth: 120 }}>{TeuBar(v.teu)}</td>
                    <td style={{ padding: "8px 12px" }}>{v.cargo}</td>
                    <td style={{ padding: "8px 12px" }}>{WaitBadge(v.waitHours)}</td>
                    <td style={{ padding: "8px 12px" }}>{v.berthDays > 0 ? `${v.berthDays}d` : "—"}</td>
                    <td style={{ padding: "8px 12px", fontSize: 12 }}>{v.eta}</td>
                    <td style={{ padding: "8px 12px", fontSize: 12 }}>{v.etd}</td>
                    <td style={{ padding: "8px 12px" }}>{OperatorBadge(v.operator)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent></Card>
        </TabsContent>
        <TabsContent value="berths">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <Card><CardHeader><CardTitle style={{ fontSize: 15 }}>Berth Utilization by Port (%)</CardTitle></CardHeader><CardContent><BarChart data={berthUtil} height={260} layout="vertical"><CartesianGrid strokeDasharray="3 3" /><XAxis type="number" domain={[0, 100]} fontSize={11} unit="%" /><YAxis dataKey="port" type="category" fontSize={11} width={100} /><Tooltip /><Bar dataKey="utilization" fill="#06b6d4" radius={[0, 4, 4, 0]} /></BarChart></CardContent></Card>
            <Card><CardHeader><CardTitle style={{ fontSize: 15 }}>Cargo Type Distribution</CardTitle></CardHeader><CardContent><PieChart><Pie data={cargoDist} cx="50%" cy="50%" outerRadius={90} dataKey="value" nameKey="cargo" label={({ cargo, percent }) => `${cargo} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={10}>{cargoDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></CardContent></Card>
          </div>
          <Card><CardHeader><CardTitle style={{ fontSize: 15 }}>Monthly Vessel Arrivals Trend</CardTitle></CardHeader><CardContent><LineChart data={monthlyArrivals} height={260}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" fontSize={11} /><YAxis fontSize={11} /><Tooltip /><Line type="monotone" dataKey="arrivals" stroke="#0891b2" strokeWidth={2} dot={{ fill: "#0891b2", r: 4 }} /></LineChart></CardContent></Card>
        </TabsContent>
        <TabsContent value="insights">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Card><CardHeader><CardTitle style={{ fontSize: 15, color: "#0891b2" }}>JNPT Congestion Crisis</CardTitle></CardHeader><CardContent style={{ fontSize: 13.5, lineHeight: 1.7, color: "#374151" }}>Mumbai’s Nhava Sheva (JNPT) handles approximately 55% of India’s container traffic, making it the single most critical node in the country’s maritime logistics chain. However, chronic congestion has plagued the terminal for years. Average vessel turnaround time at JNPT has increased from 2.8 days in 2020 to 4.6 days in 2025, driven by hinterland rail connectivity bottlenecks, inadequate yard capacity, and customs clearance delays. The Mumbai Trans-Harbour Link, while improving surface connectivity, has not addressed the deeper structural issues of berth productivity. Demurrage costs attributable to JNPT delays exceeded ₹2,800 crore last fiscal, directly impacting export competitiveness. The port’s draught limitations (14.5m maximum) prevent it from handling ultra-large container vessels (ULCVs) above 14,000 TEU, forcing mother vessels to anchor at Colombo or Singapore for transshipment. India pays an estimated ₹4,200 crore annually in transshipment charges to foreign ports. The fourth terminal at JNPT, operated by DP World, has added 2.4M TEU capacity but utilization remains below 60% due to integration challenges with existing terminals. Stakeholders are pushing for an integrated port community system to streamline vessel-to-door cargo flow and reduce dwell times by at least 40%.</CardContent></Card>
            <Card><CardHeader><CardTitle style={{ fontSize: 15, color: "#0891b2" }}>Mundra Port — India’s Largest Private Port</CardTitle></CardHeader><CardContent style={{ fontSize: 13.5, lineHeight: 1.7, color: "#374151" }}>Adani Ports and Special Economic Zone (APSEZ) has transformed Mundra from a small coastal jetty into India’s largest private port by volume, handling over 160 million tonnes annually. With a natural draught of 18 meters, Mundra can accommodate Cape Size vessels and VLCCs that JNPT cannot, giving it a decisive advantage in bulk cargo and crude oil imports. The port’s container terminal handled 7.2 million TEUs in FY25, closing the gap with JNPT rapidly. Mundra’s integrated logistics ecosystem — including a dedicated rail corridor to the Dedicated Freight Corridor (DFC), an adjacent SEZ with warehousing, and a captive power plant — offers end-to-end supply chain solutions that government ports cannot match. Average turnaround time at Mundra is 2.1 days versus the national average of 3.8 days. The port has also invested heavily in green infrastructure, including shore-to-ship power, LNG bunkering facilities, and a 60 MW solar farm. APSEZ’s acquisition of Gangavaram and Krishnapatnam ports signals its ambition to control a 30% share of India’s total port capacity by 2028, raising regulatory concerns about monopolistic practices in the maritime sector.</CardContent></Card>
            <Card><CardHeader><CardTitle style={{ fontSize: 15, color: "#0891b2" }}>Sagarmala Programme Impact</CardTitle></CardHeader><CardContent style={{ fontSize: 13.5, lineHeight: 1.7, color: "#374151" }}>The Ministry of Ports, Shipping &amp; Waterways’ Sagarmala project is India’s most ambitious port modernization programme, with an estimated investment of ₹3.5 lakh crore across 707 identified projects. The programme focuses on four pillars: port modernization, port-led industrialization, coastal community development, and inland waterways integration. As of mid-2025, approximately 210 projects worth ₹1.2 lakh crore have been completed, including the V.O. Chidambaranar Port expansion in Tuticorin, the development of Wadhwan Port in Gujarat, and the upgrade of 14 lighthouse tourism destinations. The programme has reduced logistics costs for coastal transport by 15-20% compared to road movement. However, land acquisition delays, environmental clearances for coastal regulation zones, and inter-state coordination challenges have slowed implementation. The inland waterways component under Jal Marg Vikas has increased barge traffic on the Ganga-Bhagirathi-Hooghly corridor by 300%, but remains far below the National Waterways Act targets. Industry experts estimate that full Sagarmala implementation could save ₹40,000 crore annually in logistics costs by improving port throughput by 35% and reducing cargo dwell times by 50% at major ports.</CardContent></Card>
            <Card><CardHeader><CardTitle style={{ fontSize: 15, color: "#0891b2" }}>Green Port Compliance — IMO 2030 Targets</CardTitle></CardHeader><CardContent style={{ fontSize: 13.5, lineHeight: 1.7, color: "#374151" }}>India’s major ports face mounting pressure to comply with International Maritime Organization (IMO) 2030 greenhouse gas emission targets, which mandate a 40% reduction in CO₂ intensity per transport work compared to 2008 levels. The Directorate General of Shipping has issued guidelines requiring all Indian ports above 5 million tonnes annual throughput to install shore power supply (OPS) systems by 2027. So far, only Mundra, Chennai, and Cochin have operational OPS facilities. The transition to LNG as a marine fuel is gaining momentum, with eight Indian ports now offering LNG bunkering services compared to just one in 2022. However, retrofitting older vessels and building the required bunkering infrastructure requires an estimated ₹18,000 crore investment across the port ecosystem. The Carbon Intensity Indicator (CII) rating system is already affecting vessel scheduling — ships with poor CII ratings face longer wait times and higher port charges at environmentally compliant ports. Indian port authorities are also adopting AI-based emission monitoring systems and green hydrogen pilot projects. DP World’s Cochin terminal has reduced per-container emissions by 32% through automated yard equipment and electric drayage trucks. Non-compliance could result in Indian-flagged vessels being denied entry to EU and US ports under emerging carbon border adjustment mechanisms.</CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}