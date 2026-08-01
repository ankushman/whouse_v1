import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#dc2626', '#ea580c', '#f59e0b', '#84cc16', '#06b6d4', '#6366f1', '#ec4899', '#a855f7']

const INCIDENT_TYPES = ['Slip/Fall', 'Equipment Malfunction', 'Fire Alert', 'Chemical Spill', 'Electrical Hazard', 'Structural Damage', 'Ergonomic Injury', 'Near Miss']
const AREAS = ['Loading Dock', 'Storage Zone A', 'Cold Storage', 'Packing Area', 'Mezzanine', 'External Yard', 'Office Wing', 'Racking Aisle']
const SEVERITIES = ['Critical', 'High', 'Medium', 'Low']

const incidents = [
  { id: 'WSC-0001', type: 'Slip/Fall', area: 'Loading Dock', severity: 'Medium', risk_score: 62, reported_by: 'Amit T.', date: '2026-07-30 08:15', status: 'Resolved', root_cause: 'Wet floor after rain', corrective: 'Anti-slip mats installed' },
  { id: 'WSC-0002', type: 'Fire Alert', area: 'Cold Storage', severity: 'Critical', risk_score: 95, reported_by: 'Priya M.', date: '2026-07-29 14:22', status: 'Investigating', root_cause: 'Compressor overheating', corrective: 'Thermal sensor added' },
  { id: 'WSC-0003', type: 'Equipment Malfunction', area: 'Racking Aisle', severity: 'High', risk_score: 78, reported_by: 'Deepak S.', date: '2026-07-29 11:40', status: 'Open', root_cause: 'Forklift hydraulic leak', corrective: 'Pending maintenance' },
  { id: 'WSC-0004', type: 'Chemical Spill', area: 'Storage Zone A', severity: 'Critical', risk_score: 91, reported_by: 'Sunita K.', date: '2026-07-28 16:05', status: 'Resolved', root_cause: 'Container seal failure', corrective: 'Secondary containment added' },
  { id: 'WSC-0005', type: 'Near Miss', area: 'Mezzanine', severity: 'Low', risk_score: 28, reported_by: 'Ravi P.', date: '2026-07-28 09:30', status: 'Closed', root_cause: 'Loose railing', corrective: 'Railing bolt tightened' },
  { id: 'WSC-0006', type: 'Ergonomic Injury', area: 'Packing Area', severity: 'Medium', risk_score: 55, reported_by: 'Meena G.', date: '2026-07-27 13:18', status: 'Resolved', root_cause: 'Repetitive lifting', corrective: 'Ergonomic mats deployed' },
  { id: 'WSC-0007', type: 'Electrical Hazard', area: 'External Yard', severity: 'High', risk_score: 82, reported_by: 'Kiran B.', date: '2026-07-27 07:45', status: 'Open', root_cause: 'Exposed wiring', corrective: 'Electrician scheduled' },
  { id: 'WSC-0008', type: 'Structural Damage', area: 'Racking Aisle', severity: 'High', risk_score: 88, reported_by: 'Vikram D.', date: '2026-07-26 15:55', status: 'Investigating', root_cause: 'Rack overload', corrective: 'Load limits enforced' },
  { id: 'WSC-0009', type: 'Slip/Fall', area: 'Office Wing', severity: 'Low', risk_score: 22, reported_by: 'Anita R.', date: '2026-07-26 10:20', status: 'Closed', root_cause: 'Cable across walkway', corrective: 'Cable management fixed' },
  { id: 'WSC-0010', type: 'Equipment Malfunction', area: 'Loading Dock', severity: 'Medium', risk_score: 58, reported_by: 'Suresh N.', date: '2026-07-25 12:10', status: 'Resolved', root_cause: 'Conveyor belt jam', corrective: 'Belt tension adjusted' },
  { id: 'WSC-0011', type: 'Fire Alert', area: 'Storage Zone A', severity: 'High', risk_score: 75, reported_by: 'Harish V.', date: '2026-07-25 08:55', status: 'Resolved', root_cause: 'Welding spark', corrective: 'Hot work permit enforced' },
  { id: 'WSC-0012', type: 'Near Miss', area: 'External Yard', severity: 'Medium', risk_score: 45, reported_by: 'Pooja J.', date: '2026-07-24 17:30', status: 'Closed', root_cause: 'Reversing truck', corrective: 'Spotter deployed' },
  { id: 'WSC-0013', type: 'Ergonomic Injury', area: 'Packing Area', severity: 'Medium', risk_score: 52, reported_by: 'Rajesh L.', date: '2026-07-24 09:15', status: 'Resolved', root_cause: 'Heavy box handling', corrective: 'Lift assist provided' },
  { id: 'WSC-0014', type: 'Chemical Spill', area: 'Cold Storage', severity: 'High', risk_score: 71, reported_by: 'Geeta W.', date: '2026-07-23 14:40', status: 'Open', root_cause: 'Ammonia leak', corrective: 'Ventilation upgraded' },
  { id: 'WSC-0015', type: 'Slip/Fall', area: 'Mezzanine', severity: 'Low', risk_score: 30, reported_by: 'Aditya S.', date: '2026-07-23 11:25', status: 'Closed', root_cause: 'Stair tread worn', corrective: 'Tread replaced' },
  { id: 'WSC-0016', type: 'Electrical Hazard', area: 'Racking Aisle', severity: 'Critical', risk_score: 93, reported_by: 'Nandini A.', date: '2026-07-22 16:20', status: 'Resolved', root_cause: 'Flooded junction box', corrective: 'IP67 enclosures fitted' },
  { id: 'WSC-0017', type: 'Structural Damage', area: 'Loading Dock', severity: 'Medium', risk_score: 60, reported_by: 'Manoj T.', date: '2026-07-22 08:00', status: 'Resolved', root_cause: 'Bumper post damage', corrective: 'Steel post installed' },
  { id: 'WSC-0018', type: 'Equipment Malfunction', area: 'External Yard', severity: 'High', risk_score: 76, reported_by: 'Rekha M.', date: '2026-07-21 13:50', status: 'Investigating', root_cause: 'Crane cable fray', corrective: 'Inspection ordered' },
  { id: 'WSC-0019', type: 'Near Miss', area: 'Storage Zone A', severity: 'Low', risk_score: 25, reported_by: 'Tarun P.', date: '2026-07-21 10:30', status: 'Closed', root_cause: 'Falling object', corrective: 'Rack netting added' },
  { id: 'WSC-0020', type: 'Fire Alert', area: 'Packing Area', severity: 'Medium', risk_score: 48, reported_by: 'Isha R.', date: '2026-07-20 15:10', status: 'Resolved', root_cause: 'Dust ignition', corrective: 'Dust extraction system' },
  { id: 'WSC-0021', type: 'Slip/Fall', area: 'Loading Dock', severity: 'Medium', risk_score: 56, reported_by: 'Nikhil B.', date: '2026-07-20 07:35', status: 'Closed', root_cause: 'Oil spillage', corrective: 'Absorbent mats placed' },
  { id: 'WSC-0022', type: 'Chemical Spill', area: 'Storage Zone A', severity: 'Critical', risk_score: 97, reported_by: 'Bhawana K.', date: '2026-07-19 12:45', status: 'Resolved', root_cause: 'Tank valve failure', corrective: 'Double valve system' },
  { id: 'WSC-0023', type: 'Ergonomic Injury', area: 'Cold Storage', severity: 'Low', risk_score: 32, reported_by: 'Dinesh G.', date: '2026-07-19 09:20', status: 'Closed', root_cause: 'Cold exposure', corrective: 'Rest breaks enforced' },
  { id: 'WSC-0024', type: 'Electrical Hazard', area: 'Office Wing', severity: 'Medium', risk_score: 50, reported_by: 'Swati N.', date: '2026-07-18 14:55', status: 'Resolved', root_cause: 'Overloaded circuit', corrective: 'Dedicated circuit added' },
  { id: 'WSC-0025', type: 'Structural Damage', area: 'Mezzanine', severity: 'High', risk_score: 80, reported_by: 'Lakshmi H.', date: '2026-07-18 08:40', status: 'Open', root_cause: 'Floor crack', corrective: 'Structural engineer called' },
  { id: 'WSC-0026', type: 'Equipment Malfunction', area: 'Packing Area', severity: 'Medium', risk_score: 54, reported_by: 'Kavita D.', date: '2026-07-17 11:15', status: 'Closed', root_cause: 'Shrink wrap issue', corrective: 'Machine recalibrated' },
  { id: 'WSC-0027', type: 'Near Miss', area: 'Racking Aisle', severity: 'Low', risk_score: 20, reported_by: 'Sunil F.', date: '2026-07-17 07:00', status: 'Closed', root_cause: 'Poor visibility', corrective: 'LED upgrade complete' },
  { id: 'WSC-0028', type: 'Fire Alert', area: 'External Yard', severity: 'High', risk_score: 72, reported_by: 'Ravi C.', date: '2026-07-16 16:30', status: 'Resolved', root_cause: 'Diesel spill ignition', corrective: 'Spill kit positioned' },
  { id: 'WSC-0029', type: 'Slip/Fall', area: 'Cold Storage', severity: 'Medium', risk_score: 48, reported_by: 'Arun E.', date: '2026-07-16 09:50', status: 'Closed', root_cause: 'Ice buildup', corrective: 'De-icing schedule added' },
  { id: 'WSC-0030', type: 'Chemical Spill', area: 'Loading Dock', severity: 'High', risk_score: 68, reported_by: 'Priya V.', date: '2026-07-15 13:25', status: 'Resolved', root_cause: 'Battery acid leak', corrective: 'Tray containment fixed' },
]

const genRecords = (start: number) => {
  const statuses = ['Resolved', 'Open', 'Investigating', 'Closed']
  const reporters = ['Amit T.', 'Priya M.', 'Deepak S.', 'Sunita K.', 'Ravi P.', 'Meena G.', 'Kiran B.', 'Vikram D.', 'Anita R.', 'Suresh N.', 'Harish V.', 'Pooja J.', 'Rajesh L.', 'Geeta W.', 'Aditya S.', 'Nandini A.', 'Manoj T.', 'Rekha M.', 'Tarun P.', 'Isha R.', 'Nikhil B.', 'Bhawana K.', 'Dinesh G.', 'Swati N.', 'Lakshmi H.', 'Kavita D.', 'Sunil F.', 'Ravi C.', 'Arun E.', 'Priya V.']
  const roots = ['Wet surface', 'Overheating', 'Wear and tear', 'Seal failure', 'Human error', 'Design flaw', 'Operator error', 'Material fatigue']
  const actions = ['Maintenance scheduled', 'Part replaced', 'Training conducted', 'Policy updated', 'Equipment upgraded', 'Inspection done', 'Warning signage added', 'Shutdown procedure']
  return Array.from({ length: 30 }, (_, i) => ({
    id: `WSC-${String(start + i).padStart(4, '0')}`,
    type: INCIDENT_TYPES[(start + i) % 8],
    area: AREAS[(start + i) % 8],
    severity: SEVERITIES[(start + i) % 4],
    risk_score: Math.round(15 + Math.random() * 85),
    reported_by: reporters[(start + i) % 30],
    date: `2026-07-${String(15 - Math.floor((start + i) / 8)).padStart(2, '0')} ${String(7 + (start + i) % 12).padStart(2, '0')}:${String((start + i) * 3 % 60).padStart(2, '0')}`,
    status: statuses[(start + i) % 4],
    root_cause: roots[(start + i) % 8],
    corrective: actions[(start + i) % 8],
  }))
}

const allIncidents = [...incidents, ...genRecords(31), ...genRecords(61)]

function ri(min: number, max: number, value: number) {
  return Math.max(min, Math.min(max, value))
}

const filterGroups = [
  {
    key: 'type',
    label: 'Incident Type',
    options: INCIDENT_TYPES.map(t => ({ label: t, value: t, count: allIncidents.filter(d => d.type === t).length })),
  },
  {
    key: 'area',
    label: 'Area',
    options: AREAS.map(a => ({ label: a, value: a, count: allIncidents.filter(d => d.area === a).length })),
  },
  {
    key: 'severity',
    label: 'Severity',
    options: SEVERITIES.map(s => ({ label: s, value: s, count: allIncidents.filter(d => d.severity === s).length })),
  },
]

function TypeBadge({ type }: { type: string }) {
  const colors: Record<string, string> = { 'Slip/Fall': 'bg-amber-100 text-amber-800', 'Equipment Malfunction': 'bg-orange-100 text-orange-800', 'Fire Alert': 'bg-red-100 text-red-800', 'Chemical Spill': 'bg-purple-100 text-purple-800', 'Electrical Hazard': 'bg-yellow-100 text-yellow-800', 'Structural Damage': 'bg-rose-100 text-rose-800', 'Ergonomic Injury': 'bg-teal-100 text-teal-800', 'Near Miss': 'bg-gray-100 text-gray-700' }
  return <span className={`wsc-type-badge inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[type] || 'bg-gray-100 text-gray-700'}`}>{type}</span>
}

function AreaBadge({ area }: { area: string }) {
  const colors: Record<string, string> = { 'Loading Dock': 'bg-blue-100 text-blue-800', 'Storage Zone A': 'bg-indigo-100 text-indigo-800', 'Cold Storage': 'bg-cyan-100 text-cyan-800', 'Packing Area': 'bg-green-100 text-green-800', 'Mezzanine': 'bg-violet-100 text-violet-800', 'External Yard': 'bg-amber-100 text-amber-800', 'Office Wing': 'bg-pink-100 text-pink-800', 'Racking Aisle': 'bg-slate-100 text-slate-800' }
  return <span className={`wsc-area-badge inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[area] || 'bg-gray-100 text-gray-700'}`}>{area}</span>
}

function SeverityBadge({ severity }: { severity: string }) {
  const colors: Record<string, string> = { Critical: 'bg-red-100 text-red-800', High: 'bg-orange-100 text-orange-800', Medium: 'bg-yellow-100 text-yellow-800', Low: 'bg-green-100 text-green-800' }
  return <span className={`wsc-severity-badge inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[severity] || 'bg-gray-100 text-gray-700'}`}>{severity}</span>
}

function RiskBar({ score }: { score: number }) {
  const pct = ri(0, 100, score)
  const color = pct >= 80 ? 'bg-red-500' : pct >= 60 ? 'bg-orange-500' : pct >= 40 ? 'bg-yellow-500' : 'bg-green-500'
  return <div className="wsc-risk-bar flex items-center gap-2"><div className="h-2 w-20 rounded-full bg-gray-200"><div className={`wsc-risk-bar-fill h-2 rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} /></div><span className="text-xs text-gray-500">{score}</span></div>
}

function HealthRing({ value, label, color }: { value: number; label: string; color: string }) {
  const r = 28, cx = 35, cy = 35, sw = 5
  const circ = 2 * Math.PI * r
  const offset = circ - (ri(0, 100, value) / 100) * circ
  return <div className="wsc-health-ring flex flex-col items-center"><svg width={70} height={70} className="-rotate-90"><circle cx={cx} cy={cy} r={r} fill="none" stroke="#e5e7eb" strokeWidth={sw} /><circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={sw} strokeDasharray={circ} strokeDashoffset={offset} className="wsc-ring-path" strokeLinecap="round" /></svg><span className="wsc-ring-value mt-1 text-sm font-bold" style={{ color }}>{value}%</span><span className="text-xs text-gray-500">{label}</span></div>
}

function KpiTile({ title, value, sub }: { title: string; value: string; sub: string }) {
  return <Card className="wsc-kpi-card"><CardContent className="p-4"><p className="text-xs text-gray-500">{title}</p><p className="wsc-kpi-value mt-1 text-2xl font-bold">{value}</p><p className="text-xs text-gray-400 mt-0.5">{sub}</p></CardContent></Card>
}

function ValueTile({ title, value, trend }: { title: string; value: string; trend: string }) {
  const up = trend.startsWith('+')
  return <Card className="wsc-value-tile"><CardContent className="p-4"><p className="text-xs text-gray-500">{title}</p><p className="mt-1 text-xl font-bold">{value}</p><p className={`text-xs mt-0.5 ${up ? 'text-red-500' : 'text-green-600'}`}>{trend}</p></CardContent></Card>
}

export default function WarehouseSafetyView() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})

  const toggleFilter = (key: string, value: string) => {
    setActiveFilters(prev => {
      const curr = prev[key] || []
      const next = curr.includes(value) ? curr.filter(v => v !== value) : [...curr, value]
      return next.length > 0 ? { ...prev, [key]: next } : Object.fromEntries(Object.entries(prev).filter(([k]) => k !== key))
    })
  }

  const filtered = allIncidents.filter(d => {
    const q = searchQuery.toLowerCase()
    if (q && !d.id.toLowerCase().includes(q) && !d.type.toLowerCase().includes(q) && !d.area.toLowerCase().includes(q) && !d.reported_by.toLowerCase().includes(q)) return false
    return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(d[key as keyof typeof d] as string))
  })

  const resolved = allIncidents.filter(d => d.status === 'Resolved' || d.status === 'Closed').length
  const openCount = allIncidents.filter(d => d.status === 'Open' || d.status === 'Investigating').length
  const criticalCount = allIncidents.filter(d => d.severity === 'Critical').length

  const weeklyData = [
    { week: 'W1 Jul', incidents: 18, resolved: 15, critical: 3 },
    { week: 'W2 Jul', incidents: 22, resolved: 18, critical: 4 },
    { week: 'W3 Jul', incidents: 15, resolved: 14, critical: 1 },
    { week: 'W4 Jul', incidents: 20, resolved: 17, critical: 5 },
    { week: 'W5 Jul', incidents: 12, resolved: 11, critical: 2 },
    { week: 'W6 Jul', incidents: 16, resolved: 15, critical: 3 },
  ]
  const areaData = AREAS.map(a => ({ area: a, count: allIncidents.filter(d => d.area === a).length }))
  const typeData = INCIDENT_TYPES.map(t => ({ type: t, count: allIncidents.filter(d => d.type === t).length }))

  const tabs = [
    { value: 'dashboard', label: 'Dashboard' },
    { value: 'incidents', label: 'Incidents' },
    { value: 'analytics', label: 'Analytics' },
    { value: 'insights', label: 'Insights' },
  ]

  return (
    <div className="wsc-container space-y-4">
      <PageHeader title="Warehouse Safety Command" description="Incident tracking, hazard monitoring, and safety compliance for Indian warehouses" />
      <ModuleBreadcrumb items={[{ label: 'Operations' }, { label: 'Safety Command' }]} />
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="wsc-tabs-list">
          {tabs.map(t => <TabsTrigger key={t.value} value={t.value} className="wsc-tab-trigger">{t.label}</TabsTrigger>)}
        </TabsList>

        <TabsContent value="dashboard" className="wsc-tab-content space-y-4 mt-4">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <KpiTile title="Total Incidents" value={allIncidents.length.toString()} sub="Last 30 days" />
            <KpiTile title="Open Cases" value={openCount.toString()} sub="Pending resolution" />
            <KpiTile title="Critical" value={criticalCount.toString()} sub="Immediate action" />
            <KpiTile title="Resolution Rate" value={`${((resolved / allIncidents.length) * 100).toFixed(0)}%`} sub="Resolved + Closed" />
          </div>
          <div className="grid gap-4 grid-cols-3 md:grid-cols-6">
            <HealthRing value={94} label="Compliance" color="#dc2626" />
            <HealthRing value={82} label="PPE Usage" color="#ea580c" />
            <HealthRing value={76} label="Training" color="#f59e0b" />
            <HealthRing value={91} label="Inspection" color="#84cc16" />
            <HealthRing value={88} label="Drill Ready" color="#06b6d4" />
            <HealthRing value={97} label="Response" color="#6366f1" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="wsc-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Weekly Incident Trend</CardTitle></CardHeader><CardContent><LineChart data={weeklyData} width={300} height={200}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="week" fontSize={12} /><YAxis fontSize={12} /><Tooltip /><Legend /><Line type="monotone" dataKey="incidents" stroke="#dc2626" strokeWidth={2} /><Line type="monotone" dataKey="resolved" stroke="#84cc16" strokeWidth={2} strokeDasharray="5 5" /><Line type="monotone" dataKey="critical" stroke="#f59e0b" strokeWidth={2} /></LineChart></CardContent></Card>
            <Card className="wsc-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Incidents by Area</CardTitle></CardHeader><CardContent><BarChart data={areaData} width={300} height={200}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="area" fontSize={10} angle={-30} textAnchor="end" height={50} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="count" fill="#dc2626" radius={[4,4,0,0]} /></BarChart></CardContent></Card>
            <Card className="wsc-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Incident Type Mix</CardTitle></CardHeader><CardContent><PieChart width={300} height={200}><Pie data={typeData} dataKey="count" nameKey="type" cx="50%" cy="50%" outerRadius={70} label={({ type, count }) => `${type}: ${count}`}>{typeData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="incidents" className="wsc-tab-content space-y-4 mt-4">
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={allIncidents.length} filteredCount={filtered.length} onRefresh={() => {}} placeholder="Search by ID, type, area, or reporter..." />
          <div className="overflow-x-auto rounded-lg border">
            <table className="wsc-table w-full text-sm">
              <thead><tr className="wsc-table-header bg-gray-50"><th className="px-3 py-2 text-left font-medium">ID</th><th className="px-3 py-2 text-left font-medium">Type</th><th className="px-3 py-2 text-left font-medium">Area</th><th className="px-3 py-2 text-left font-medium">Severity</th><th className="px-3 py-2 text-left font-medium">Risk</th><th className="px-3 py-2 text-left font-medium">Status</th><th className="px-3 py-2 text-left font-medium">Reporter</th><th className="px-3 py-2 text-left font-medium">Date</th></tr></thead>
              <tbody>{filtered.slice(0, 20).map(d => (
                <tr key={d.id} className="wsc-table-row border-t hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-2 font-mono text-xs">{d.id}</td>
                  <td className="px-3 py-2"><TypeBadge type={d.type} /></td>
                  <td className="px-3 py-2"><AreaBadge area={d.area} /></td>
                  <td className="px-3 py-2"><SeverityBadge severity={d.severity} /></td>
                  <td className="px-3 py-2"><RiskBar score={d.risk_score} /></td>
                  <td className="px-3 py-2"><span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${d.status === 'Resolved' || d.status === 'Closed' ? 'bg-green-100 text-green-800' : d.status === 'Open' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>{d.status}</span></td>
                  <td className="px-3 py-2 text-xs">{d.reported_by}</td>
                  <td className="px-3 py-2 text-xs">{d.date}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="wsc-tab-content space-y-4 mt-4">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <ValueTile title="Avg Risk Score" value="58.4" trend="+3.2 vs last month" />
            <ValueTile title="MTTR" value="2.3 days" trend="-0.4 improved" />
            <ValueTile title="Near Miss Ratio" value="12.8%" trend="-1.5% improved" />
            <ValueTile title="Compliance Score" value="94%" trend="+2.1% improved" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="wsc-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Area Risk Exposure</CardTitle></CardHeader><CardContent><BarChart data={areaData} width={400} height={250}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="area" fontSize={10} angle={-30} textAnchor="end" height={50} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="count" fill="#ea580c" radius={[4,4,0,0]} /></BarChart></CardContent></Card>
            <Card className="wsc-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Severity Breakdown</CardTitle></CardHeader><CardContent><PieChart width={400} height={250}><Pie data={SEVERITIES.map(s => ({ severity: s, count: allIncidents.filter(d => d.severity === s).length }))} dataKey="count" nameKey="severity" cx="50%" cy="50%" outerRadius={80} label>{SEVERITIES.map((_, i) => <Cell key={i} fill={['#ef4444','#f97316','#eab308','#22c55e'][i]} />)}</Pie><Tooltip /></PieChart></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="wsc-tab-content space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="wsc-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">IoT Wearable Safety Monitors</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Smart helmets with biometric sensors deployed across 5 warehouses. Real-time heart rate, temperature, and fall detection alerts. 40% reduction in ergonomic injury response time since deployment.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-red-800">Critical Priority</span><span className="text-gray-400">Q3 2026</span></div></CardContent></Card>
            <Card className="wsc-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">AI CCTV Hazard Detection</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Computer vision system monitoring 128 camera feeds for PPE non-compliance, unauthorized zone entry, and fire/smoke detection. 92% accuracy with 0.3s alert latency. Integrated with safety command dashboard.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-orange-100 px-2 py-0.5 text-orange-800">In Progress</span><span className="text-gray-400">Q4 2026</span></div></CardContent></Card>
            <Card className="wsc-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">OSHA-aligned Safety Training</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Quarterly safety drills covering fire evacuation, chemical spill response, and first aid. 76% training completion rate with target of 95% by year-end. VR-based immersive training module pilot in 2 locations.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5 text-yellow-800">Ongoing</span><span className="text-gray-400">Monthly</span></div></CardContent></Card>
            <Card className="wsc-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">Automated Compliance Reporting</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Factories Act and BOCW compliance dashboard auto-generating monthly reports for Indian regulatory bodies. Digital safety audit trails with photographic evidence and timestamped corrective actions.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-violet-100 px-2 py-0.5 text-violet-800">Strategic</span><span className="text-gray-400">FY2027</span></div></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
