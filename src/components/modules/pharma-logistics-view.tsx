import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#2563eb', '#1d4ed8', '#3b82f6', '#60a5fa', '#93c5fd', '#1e40af', '#7c3aed', '#6366f1']

const DRUG_CATEGORIES = ['Vaccines', 'Biologics', 'OTC Medicines', 'Insulin', 'Blood Products', 'Oncology Drugs', 'Antibiotics', 'Diagnostics']
const STORAGE_ZONES = ['Cold Room 2-8°C', 'Freezer -20°C', 'Ultra-Low -80°C', 'Ambient CRT', 'Controlled Room', 'Quarantine Hold', 'Inspection Bay', 'Dispatch Staging']
const COMPLIANCE_STATUS = ['Compliant', 'Warning', 'Deviation', 'Critical']

const batches = [
  { id: 'PLC-0001', category: 'Vaccines', zone: 'Cold Room 2-8°C', compliance: 'Compliant', temp_c: 4.2, humidity: 42, expiry: '2027-03-15', batch: 'VAX-B2341', manufacturer: 'Serum Institute', quantity: 50000, deviation_count: 0, last_audit: '2026-07-30 06:00' },
  { id: 'PLC-0002', category: 'Biologics', zone: 'Cold Room 2-8°C', compliance: 'Compliant', temp_c: 3.8, humidity: 45, expiry: '2026-12-28', batch: 'BIO-M8902', manufacturer: 'Biocon', quantity: 12000, deviation_count: 0, last_audit: '2026-07-30 05:30' },
  { id: 'PLC-0003', category: 'Insulin', zone: 'Cold Room 2-8°C', compliance: 'Warning', temp_c: 7.9, humidity: 50, expiry: '2027-06-10', batch: 'INS-N1205', manufacturer: 'Novo Nordisk', quantity: 28000, deviation_count: 2, last_audit: '2026-07-29 22:15' },
  { id: 'PLC-0004', category: 'Blood Products', zone: 'Cold Room 2-8°C', compliance: 'Compliant', temp_c: 2.1, humidity: 38, expiry: '2026-08-05', batch: 'BLD-R4501', manufacturer: 'Red Cross', quantity: 500, deviation_count: 0, last_audit: '2026-07-30 07:00' },
  { id: 'PLC-0005', category: 'Oncology Drugs', zone: 'Freezer -20°C', compliance: 'Compliant', temp_c: -18.5, humidity: 30, expiry: '2027-09-22', batch: 'ONC-K7890', manufacturer: 'Cipla', quantity: 3500, deviation_count: 0, last_audit: '2026-07-30 04:00' },
  { id: 'PLC-0006', category: 'Diagnostics', zone: 'Ambient CRT', compliance: 'Compliant', temp_c: 22.4, humidity: 35, expiry: '2027-01-18', batch: 'DIA-P3421', manufacturer: 'Dr. Lal Path', quantity: 15000, deviation_count: 0, last_audit: '2026-07-29 18:45' },
  { id: 'PLC-0007', category: 'OTC Medicines', zone: 'Controlled Room', compliance: 'Compliant', temp_c: 24.1, humidity: 40, expiry: '2028-04-30', batch: 'OTC-H5670', manufacturer: 'Dabur', quantity: 85000, deviation_count: 0, last_audit: '2026-07-30 02:00' },
  { id: 'PLC-0008', category: 'Antibiotics', zone: 'Ambient CRT', compliance: 'Deviation', temp_c: 28.3, humidity: 62, expiry: '2027-07-14', batch: 'ANT-T9012', manufacturer: 'Sun Pharma', quantity: 42000, deviation_count: 3, last_audit: '2026-07-30 08:10' },
  { id: 'PLC-0009', category: 'Vaccines', zone: 'Cold Room 2-8°C', compliance: 'Compliant', temp_c: 5.1, humidity: 44, expiry: '2027-02-20', batch: 'VAX-C6789', manufacturer: 'Bharat Biotech', quantity: 100000, deviation_count: 0, last_audit: '2026-07-30 03:30' },
  { id: 'PLC-0010', category: 'Biologics', zone: 'Freezer -20°C', compliance: 'Critical', temp_c: -12.8, humidity: 28, expiry: '2026-09-05', batch: 'BIO-A5432', manufacturer: 'Zydus Lifeline', quantity: 8000, deviation_count: 5, last_audit: '2026-07-30 07:45' },
  { id: 'PLC-0011', category: 'Insulin', zone: 'Cold Room 2-8°C', compliance: 'Compliant', temp_c: 4.0, humidity: 41, expiry: '2027-08-11', batch: 'INS-E3210', manufacturer: 'Lupin', quantity: 20000, deviation_count: 1, last_audit: '2026-07-29 20:00' },
  { id: 'PLC-0012', category: 'Oncology Drugs', zone: 'Ultra-Low -80°C', compliance: 'Compliant', temp_c: -78.2, humidity: 15, expiry: '2027-11-03', batch: 'ONC-L7654', manufacturer: 'Natco Pharma', quantity: 1200, deviation_count: 0, last_audit: '2026-07-30 01:00' },
  { id: 'PLC-0013', category: 'Blood Products', zone: 'Cold Room 2-8°C', compliance: 'Warning', temp_c: 7.5, humidity: 48, expiry: '2026-08-12', batch: 'BLD-U8765', manufacturer: 'Apollo Blood Bank', quantity: 300, deviation_count: 1, last_audit: '2026-07-30 06:30' },
  { id: 'PLC-0014', category: 'Antibiotics', zone: 'Ambient CRT', compliance: 'Compliant', temp_c: 23.7, humidity: 37, expiry: '2027-05-25', batch: 'ANT-G4321', manufacturer: 'Aurobindo', quantity: 65000, deviation_count: 0, last_audit: '2026-07-29 16:20' },
  { id: 'PLC-0015', category: 'Diagnostics', zone: 'Controlled Room', compliance: 'Compliant', temp_c: 21.8, humidity: 34, expiry: '2027-03-08', batch: 'DIA-V6543', manufacturer: 'Thyrocare', quantity: 25000, deviation_count: 0, last_audit: '2026-07-30 05:00' },
  { id: 'PLC-0016', category: 'Vaccines', zone: 'Cold Room 2-8°C', compliance: 'Compliant', temp_c: 3.5, humidity: 43, expiry: '2027-04-17', batch: 'VAX-D9876', manufacturer: 'Zydus Cadila', quantity: 75000, deviation_count: 0, last_audit: '2026-07-30 04:30' },
  { id: 'PLC-0017', category: 'Biologics', zone: 'Cold Room 2-8°C', compliance: 'Deviation', temp_c: 9.2, humidity: 55, expiry: '2026-11-30', batch: 'BIO-F2109', manufacturer: 'Dr. Reddys', quantity: 6000, deviation_count: 4, last_audit: '2026-07-30 08:30' },
  { id: 'PLC-0018', category: 'Insulin', zone: 'Freezer -20°C', compliance: 'Compliant', temp_c: -19.1, humidity: 29, expiry: '2027-10-05', batch: 'INS-W8765', manufacturer: 'Wockhardt', quantity: 18000, deviation_count: 0, last_audit: '2026-07-29 23:00' },
  { id: 'PLC-0019', category: 'OTC Medicines', zone: 'Ambient CRT', compliance: 'Compliant', temp_c: 25.0, humidity: 38, expiry: '2028-02-14', batch: 'OTC-X1234', manufacturer: 'Himalaya Wellness', quantity: 92000, deviation_count: 0, last_audit: '2026-07-29 14:00' },
  { id: 'PLC-0020', category: 'Oncology Drugs', zone: 'Freezer -20°C', compliance: 'Warning', temp_c: -14.5, humidity: 33, expiry: '2026-12-20', batch: 'ONC-Y5432', manufacturer: 'Mylan', quantity: 2800, deviation_count: 2, last_audit: '2026-07-30 07:15' },
]

const genRecords = (start: number) => {
  const statuses = ['Compliant', 'Compliant', 'Compliant', 'Warning', 'Deviation']
  const manufacturers = ['Serum Institute', 'Biocon', 'Novo Nordisk', 'Cipla', 'Sun Pharma', 'Dr. Reddys', 'Lupin', 'Aurobindo', 'Bharat Biotech', 'Dabur', 'Natco Pharma', 'Zydus Lifeline', 'Wockhardt', 'Himalaya Wellness', 'Dr. Lal Path']
  return Array.from({ length: 40 }, (_, i) => ({
    id: `PLC-${String(start + i).padStart(4, '0')}`,
    category: DRUG_CATEGORIES[(start + i) % 8],
    zone: STORAGE_ZONES[(start + i) % 8],
    compliance: statuses[(start + i) % 5],
    temp_c: Math.round((-80 + Math.random() * 110) * 10) / 10,
    humidity: Math.round(15 + Math.random() * 55),
    expiry: `2027-${String(1 + (start + i) % 12).padStart(2, '0')}-${String(1 + (start + i) % 28).padStart(2, '0')}`,
    batch: `${DRUG_CATEGORIES[(start + i) % 8].substring(0, 3).toUpperCase()}-${String(1000 + (start + i)).slice(1)}`,
    manufacturer: manufacturers[(start + i) % 15],
    quantity: Math.round(500 + Math.random() * 100000),
    deviation_count: Math.floor(Math.random() * 6),
    last_audit: `2026-07-${String(28 - Math.floor((start + i) / 10)).padStart(2, '0')} ${String((start + i) % 24).padStart(2, '0')}:${String((start + i) * 4 % 60).padStart(2, '0')}`,
  }))
}

const allBatches = [...batches, ...genRecords(21), ...genRecords(61)]

function ri(min: number, max: number, value: number) {
  return Math.max(min, Math.min(max, value))
}

const filterGroups = [
  {
    key: 'category',
    label: 'Drug Category',
    options: DRUG_CATEGORIES.map(c => ({ label: c, value: c, count: allBatches.filter(d => d.category === c).length })),
  },
  {
    key: 'zone',
    label: 'Storage Zone',
    options: STORAGE_ZONES.map(z => ({ label: z, value: z, count: allBatches.filter(d => d.zone === z).length })),
  },
  {
    key: 'compliance',
    label: 'Compliance',
    options: COMPLIANCE_STATUS.map(s => ({ label: s, value: s, count: allBatches.filter(d => d.compliance === s).length })),
  },
]

function CategoryBadge({ category }: { category: string }) {
  const colors: Record<string, string> = { Vaccines: 'bg-blue-100 text-blue-800', Biologics: 'bg-indigo-100 text-indigo-800', 'OTC Medicines': 'bg-green-100 text-green-800', Insulin: 'bg-purple-100 text-purple-800', 'Blood Products': 'bg-red-100 text-red-800', 'Oncology Drugs': 'bg-rose-100 text-rose-800', Antibiotics: 'bg-amber-100 text-amber-800', Diagnostics: 'bg-cyan-100 text-cyan-800' }
  return <span className={`plc-cat-badge inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[category] || 'bg-gray-100 text-gray-800'}`}>{category}</span>
}

function ZoneBadge({ zone }: { zone: string }) {
  const colors: Record<string, string> = { 'Cold Room 2-8°C': 'bg-sky-100 text-sky-800', 'Freezer -20°C': 'bg-blue-100 text-blue-800', 'Ultra-Low -80°C': 'bg-indigo-100 text-indigo-800', 'Ambient CRT': 'bg-green-100 text-green-800', 'Controlled Room': 'bg-teal-100 text-teal-800', 'Quarantine Hold': 'bg-yellow-100 text-yellow-800', 'Inspection Bay': 'bg-violet-100 text-violet-800', 'Dispatch Staging': 'bg-slate-100 text-slate-800' }
  return <span className={`plc-zone-badge inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[zone] || 'bg-gray-100 text-gray-800'}`}>{zone}</span>
}

function ComplianceBadge({ compliance }: { compliance: string }) {
  const colors: Record<string, string> = { Compliant: 'bg-green-100 text-green-800', Warning: 'bg-yellow-100 text-yellow-800', Deviation: 'bg-orange-100 text-orange-800', Critical: 'bg-red-100 text-red-800' }
  return <span className={`plc-comp-badge inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[compliance] || 'bg-gray-100 text-gray-700'}`}>{compliance}</span>
}

function TempBar({ temp }: { temp: number }) {
  const absVal = Math.abs(temp)
  const pct = ri(0, 100, temp >= 0 ? (absVal / 30) * 100 : (absVal / 80) * 100)
  const color = temp < 0 ? 'bg-blue-500' : temp > 25 ? 'bg-orange-500' : temp > 8 ? 'bg-yellow-500' : 'bg-green-500'
  return <div className="plc-temp-bar flex items-center gap-2"><div className="h-2 w-20 rounded-full bg-gray-200"><div className={`plc-temp-bar-fill h-2 rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} /></div><span className="text-xs text-gray-500">{temp}°C</span></div>
}

function HealthRing({ value, label, color }: { value: number; label: string; color: string }) {
  const r = 28, cx = 35, cy = 35, sw = 5
  const circ = 2 * Math.PI * r
  const offset = circ - (ri(0, 100, value) / 100) * circ
  return <div className="plc-health-ring flex flex-col items-center"><svg width={70} height={70} className="-rotate-90"><circle cx={cx} cy={cy} r={r} fill="none" stroke="#e5e7eb" strokeWidth={sw} /><circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={sw} strokeDasharray={circ} strokeDashoffset={offset} className="plc-ring-path" strokeLinecap="round" /></svg><span className="plc-ring-value mt-1 text-sm font-bold" style={{ color }}>{value}%</span><span className="text-xs text-gray-500">{label}</span></div>
}

function KpiTile({ title, value, sub }: { title: string; value: string; sub: string }) {
  return <Card className="plc-kpi-card"><CardContent className="p-4"><p className="text-xs text-gray-500">{title}</p><p className="plc-kpi-value mt-1 text-2xl font-bold">{value}</p><p className="text-xs text-gray-400 mt-0.5">{sub}</p></CardContent></Card>
}

function ValueTile({ title, value, trend }: { title: string; value: string; trend: string }) {
  const up = trend.startsWith('+')
  return <Card className="plc-value-tile"><CardContent className="p-4"><p className="text-xs text-gray-500">{title}</p><p className="mt-1 text-xl font-bold">{value}</p><p className={`text-xs mt-0.5 ${up ? 'text-red-500' : 'text-green-600'}`}>{trend}</p></CardContent></Card>
}

export default function PharmaLogisticsView() {
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

  const filtered = allBatches.filter(d => {
    const q = searchQuery.toLowerCase()
    if (q && !d.id.toLowerCase().includes(q) && !d.batch.toLowerCase().includes(q) && !d.manufacturer.toLowerCase().includes(q) && !d.category.toLowerCase().includes(q)) return false
    return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(d[key as keyof typeof d] as string))
  })

  const compliantCount = allBatches.filter(d => d.compliance === 'Compliant').length
  const deviationCount = allBatches.filter(d => d.compliance === 'Deviation' || d.compliance === 'Critical').length

  const monthlyData = [
    { month: 'Jan', batches: 340, deviations: 12, audits: 89 },
    { month: 'Feb', batches: 380, deviations: 8, audits: 95 },
    { month: 'Mar', batches: 420, deviations: 15, audits: 102 },
    { month: 'Apr', batches: 360, deviations: 6, audits: 91 },
    { month: 'May', batches: 450, deviations: 10, audits: 108 },
    { month: 'Jun', batches: 410, deviations: 7, audits: 98 },
    { month: 'Jul', batches: 440, deviations: 9, audits: 112 },
  ]
  const catData = DRUG_CATEGORIES.map(c => ({ category: c, count: allBatches.filter(d => d.category === c).length }))
  const zoneData = STORAGE_ZONES.map(z => ({ zone: z, count: allBatches.filter(d => d.zone === z).length }))

  const tabs = [
    { value: 'dashboard', label: 'Dashboard' },
    { value: 'batches', label: 'Batches' },
    { value: 'analytics', label: 'Analytics' },
    { value: 'insights', label: 'Insights' },
  ]

  return (
    <div className="plc-container space-y-4">
      <PageHeader title="Pharma Logistics Command" description="Temperature-controlled pharmaceutical warehousing and GDP compliance for India" />
      <ModuleBreadcrumb items={[{ label: 'Operations' }, { label: 'Pharma Logistics' }]} />
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="plc-tabs-list">
          {tabs.map(t => <TabsTrigger key={t.value} value={t.value} className="plc-tab-trigger">{t.label}</TabsTrigger>)}
        </TabsList>

        <TabsContent value="dashboard" className="plc-tab-content space-y-4 mt-4">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <KpiTile title="Total Batches" value={allBatches.length.toString()} sub="Active inventory" />
            <KpiTile title="Compliant" value={compliantCount.toString()} sub={`${((compliantCount / allBatches.length) * 100).toFixed(1)}% GDP rate`} />
            <KpiTile title="Deviations" value={deviationCount.toString()} sub="Requires action" />
            <KpiTile title="Cold Rooms OK" value="96.8%" sub="Temperature SLA" />
          </div>
          <div className="grid gap-4 grid-cols-3 md:grid-cols-6">
            <HealthRing value={98} label="GDP Compliant" color="#2563eb" />
            <HealthRing value={95} label="Temp SLA" color="#1d4ed8" />
            <HealthRing value={92} label="Audit Score" color="#3b82f6" />
            <HealthRing value={88} label="Humidity" color="#60a5fa" />
            <HealthRing value={97} label="Traceability" color="#1e40af" />
            <HealthRing value={94} label="Expiry Mgmt" color="#7c3aed" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="plc-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Monthly Batch Intake & Deviations</CardTitle></CardHeader><CardContent><LineChart data={monthlyData} width={300} height={200}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" fontSize={12} /><YAxis fontSize={12} /><Tooltip /><Legend /><Line type="monotone" dataKey="batches" stroke="#2563eb" strokeWidth={2} /><Line type="monotone" dataKey="deviations" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" /></LineChart></CardContent></Card>
            <Card className="plc-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Batches by Drug Category</CardTitle></CardHeader><CardContent><BarChart data={catData} width={300} height={200}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="category" fontSize={10} angle={-30} textAnchor="end" height={50} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="count" fill="#2563eb" radius={[4,4,0,0]} /></BarChart></CardContent></Card>
            <Card className="plc-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Storage Zone Distribution</CardTitle></CardHeader><CardContent><PieChart width={300} height={200}><Pie data={zoneData} dataKey="count" nameKey="zone" cx="50%" cy="50%" outerRadius={70} label={({ zone, count }) => `${count}`}>{zoneData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="batches" className="plc-tab-content space-y-4 mt-4">
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={allBatches.length} filteredCount={filtered.length} onRefresh={() => {}} placeholder="Search by batch, manufacturer, or category..." />
          <div className="overflow-x-auto rounded-lg border">
            <table className="plc-table w-full text-sm">
              <thead><tr className="plc-table-header bg-gray-50"><th className="px-3 py-2 text-left font-medium">ID</th><th className="px-3 py-2 text-left font-medium">Category</th><th className="px-3 py-2 text-left font-medium">Zone</th><th className="px-3 py-2 text-left font-medium">Temp</th><th className="px-3 py-2 text-left font-medium">Compliance</th><th className="px-3 py-2 text-left font-medium">Batch</th><th className="px-3 py-2 text-left font-medium">Qty</th><th className="px-3 py-2 text-left font-medium">Manufacturer</th><th className="px-3 py-2 text-left font-medium">Audit</th></tr></thead>
              <tbody>{filtered.slice(0, 20).map(d => (
                <tr key={d.id} className="plc-table-row border-t hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-2 font-mono text-xs">{d.id}</td>
                  <td className="px-3 py-2"><CategoryBadge category={d.category} /></td>
                  <td className="px-3 py-2"><ZoneBadge zone={d.zone} /></td>
                  <td className="px-3 py-2"><TempBar temp={d.temp_c} /></td>
                  <td className="px-3 py-2"><ComplianceBadge compliance={d.compliance} /></td>
                  <td className="px-3 py-2 text-xs font-mono">{d.batch}</td>
                  <td className="px-3 py-2 text-xs">{d.quantity.toLocaleString('en-IN')}</td>
                  <td className="px-3 py-2 text-xs">{d.manufacturer}</td>
                  <td className="px-3 py-2 text-xs">{d.last_audit}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="plc-tab-content space-y-4 mt-4">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <ValueTile title="Avg Temp" value="4.2°C" trend="+0.3°C vs target" />
            <ValueTile title="Humidity Avg" value="41%" trend="-2% improved" />
            <ValueTile title="Deviation Rate" value="2.1%" trend="-0.8% improved" />
            <ValueTile title="Audit Pass Rate" value="98.5%" trend="+1.2% improved" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="plc-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Category Volume</CardTitle></CardHeader><CardContent><BarChart data={catData} width={400} height={250}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="category" fontSize={10} angle={-30} textAnchor="end" height={50} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="count" fill="#1d4ed8" radius={[4,4,0,0]} /></BarChart></CardContent></Card>
            <Card className="plc-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Compliance Breakdown</CardTitle></CardHeader><CardContent><PieChart width={400} height={250}><Pie data={COMPLIANCE_STATUS.map(s => ({ status: s, count: allBatches.filter(d => d.compliance === s).length }))} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={80} label>{COMPLIANCE_STATUS.map((_, i) => <Cell key={i} fill={['#22c55e','#eab308','#f97316','#ef4444'][i]} />)}</Pie><Tooltip /></PieChart></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="plc-tab-content space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="plc-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">WHO-GMP Digital Audit Trail</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Blockchain-based audit trail for all pharma batch movements. Every temperature excursion logged immutably with CDSCO compliance. 100% traceability from manufacturer to last-mile delivery across 4 cold chain warehouses.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-blue-800">Critical Priority</span><span className="text-gray-400">Q3 2026</span></div></CardContent></Card>
            <Card className="plc-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">AI Temperature Prediction</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>ML model predicting temperature deviations 30 minutes in advance using IoT sensor fusion data. 92% prediction accuracy across 128 sensors. Automated pre-emptive compressor adjustment prevents 85% of potential excursions.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-indigo-100 px-2 py-0.5 text-indigo-800">In Progress</span><span className="text-gray-400">Q4 2026</span></div></CardContent></Card>
            <Card className="plc-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">CoE Vaccine Hub Expansion</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Centre of Excellence vaccine distribution hub in Hyderabad serving Telangana, AP, and Karnataka. Ultra-cold storage for mRNA vaccines with -80°C capability. Processing 200K+ vaccine doses monthly for state immunization programs.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-violet-100 px-2 py-0.5 text-violet-800">Strategic</span><span className="text-gray-400">FY2027</span></div></CardContent></Card>
            <Card className="plc-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">E-Way Bill Pharma Integration</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Direct integration with GSTN e-way bill portal for pharmaceutical shipments. Auto-generation of e-way bills with drug license validation, MRP verification, and NAFDAC-compliant labeling. 3-second processing vs 4-minute manual.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-purple-100 px-2 py-0.5 text-purple-800">Operational</span><span className="text-gray-400">Live</span></div></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
