import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#d97706', '#b45309', '#f59e0b', '#fbbf24', '#fcd34d', '#78350f', '#92400e', '#fef3c7']

const MATERIAL_TYPES = ['Crude Oil', 'Natural Gas', 'LNG', 'LPG', 'Petrochemicals', 'Refined Diesel', 'Aviation Turbine Fuel', 'Bitumen']
const PIPELINES = ['Mumbai High-Uran', 'KG-D6 Onshore', 'Jamnagar Refinery', 'Numaligarh Refinery', 'Koyali Refinery', 'Mathura Refinery', 'Panipat Refinery', 'Mangalore Refinery']
const SUPPLY_STATUS = ['In Pipeline', 'At Terminal', 'Under Quality Check', 'Dispatched', 'Held Up', 'Scheduled']

const supplyRecords = [
  { id: 'OGP-0001', material: 'Crude Oil', description: 'Mumbai High Sour Crude API 38.2', pipeline: 'Mumbai High-Uran', quantity: 45000, unit: 'bbl', supply_status: 'In Pipeline', tanker: 'MT Bharat Prem', received: '2026-07-30', batch: 'OGP-B2026-0721', cost_inr: 185000000, sulphur_pct: 1.2, destination: 'Mumbai Refinery' },
  { id: 'OGP-0002', material: 'Natural Gas', description: 'KG-D6 Dry Gas 98% Methane', pipeline: 'KG-D6 Onshore', quantity: 2800000, unit: 'scm', supply_status: 'At Terminal', tanker: 'Pipeline-01', received: '2026-07-30', batch: 'OGP-B2026-0720', cost_inr: 92000000, sulphur_pct: 0.001, destination: 'KG Basin Plant' },
  { id: 'OGP-0003', material: 'LNG', description: 'QatarGas North Field LNG Cargo', pipeline: 'Mumbai High-Uran', quantity: 145000, unit: 'scm', supply_status: 'Under Quality Check', tanker: 'MT Disha Kumari', received: '2026-07-29', batch: 'OGP-B2026-0719', cost_inr: 210000000, sulphur_pct: 0.003, destination: 'Dahej Terminal' },
  { id: 'OGP-0004', material: 'LPG', description: 'Propane-Butane Mix 60-40 Split', pipeline: 'Koyali Refinery', quantity: 850, unit: 'mt', supply_status: 'Dispatched', tanker: 'MT Suvarna', received: '2026-07-29', batch: 'OGP-B2026-0718', cost_inr: 65000000, sulphur_pct: 0.005, destination: 'Gujarat Bottling' },
  { id: 'OGP-0005', material: 'Petrochemicals', description: 'Ethylene Cracker C2 Feedstock', pipeline: 'Jamnagar Refinery', quantity: 1200, unit: 'mt', supply_status: 'In Pipeline', tanker: 'Pipeline-12', received: '2026-07-28', batch: 'OGP-B2026-0716', cost_inr: 48000000, sulphur_pct: 0.01, destination: 'Reliance Jamnagar' },
  { id: 'OGP-0006', material: 'Refined Diesel', description: 'BS-VI Auto Diesel Cetane 51', pipeline: 'Mathura Refinery', quantity: 32000, unit: 'kl', supply_status: 'Dispatched', tanker: 'Pipeline-07', received: '2026-07-28', batch: 'OGP-B2026-0715', cost_inr: 264000000, sulphur_pct: 0.001, destination: 'Delhi Fuel Depot' },
  { id: 'OGP-0007', material: 'Aviation Turbine Fuel', description: 'ATF JET A-1 Flash Point 38C', pipeline: 'Panipat Refinery', quantity: 5500, unit: 'kl', supply_status: 'Scheduled', tanker: 'MT Indian Pride', received: '2026-07-27', batch: 'OGP-B2026-0714', cost_inr: 55000000, sulphur_pct: 0.0005, destination: 'IGI Airport Delhi' },
  { id: 'OGP-0008', material: 'Bitumen', description: 'VG-30 Paving Grade Bitumen', pipeline: 'Numaligarh Refinery', quantity: 2200, unit: 'mt', supply_status: 'Held Up', tanker: 'Pipeline-19', received: '2026-07-27', batch: 'OGP-B2026-0713', cost_inr: 13200000, sulphur_pct: 4.5, destination: 'NH-48 Highway' },
  { id: 'OGP-0009', material: 'Crude Oil', description: 'Basrah Light Crude API 33.5', pipeline: 'Mumbai High-Uran', quantity: 95000, unit: 'bbl', supply_status: 'In Pipeline', tanker: 'MT Mangal Shakti', received: '2026-07-26', batch: 'OGP-B2026-0711', cost_inr: 380000000, sulphur_pct: 2.8, destination: 'Mangalore Refinery' },
  { id: 'OGP-0010', material: 'Natural Gas', description: 'Cairn Barmer Gas 95% Methane', pipeline: 'KG-D6 Onshore', quantity: 1900000, unit: 'scm', supply_status: 'At Terminal', tanker: 'Pipeline-03', received: '2026-07-26', batch: 'OGP-B2026-0710', cost_inr: 62000000, sulphur_pct: 0.002, destination: 'Barmer Power Plant' },
  { id: 'OGP-0011', material: 'LNG', description: 'Australia Gorgon LNG Cargo Spot', pipeline: 'Mumbai High-Uran', quantity: 170000, unit: 'scm', supply_status: 'Under Quality Check', tanker: 'MT LNG Pioneer', received: '2026-07-25', batch: 'OGP-B2026-0708', cost_inr: 255000000, sulphur_pct: 0.002, destination: 'Kochi Terminal' },
  { id: 'OGP-0012', material: 'LPG', description: 'Pure Propane Commercial Grade', pipeline: 'Mangalore Refinery', quantity: 620, unit: 'mt', supply_status: 'Dispatched', tanker: 'MT LPG Coral', received: '2026-07-25', batch: 'OGP-B2026-0707', cost_inr: 48000000, sulphur_pct: 0.003, destination: 'Kerala Bottling' },
  { id: 'OGP-0013', material: 'Petrochemicals', description: 'Propylene Polymer Grade 99.5%', pipeline: 'Jamnagar Refinery', quantity: 450, unit: 'mt', supply_status: 'Scheduled', tanker: 'Pipeline-14', received: '2026-07-24', batch: 'OGP-B2026-0705', cost_inr: 27000000, sulphur_pct: 0.001, destination: 'Nagothane Plant' },
  { id: 'OGP-0014', material: 'Refined Diesel', description: 'BS-VI HSD Truck Grade Cetane 55', pipeline: 'Koyali Refinery', quantity: 18000, unit: 'kl', supply_status: 'In Pipeline', tanker: 'Pipeline-09', received: '2026-07-24', batch: 'OGP-B2026-0704', cost_inr: 149000000, sulphur_pct: 0.001, destination: 'Ahmedabad Depot' },
  { id: 'OGP-0015', material: 'Aviation Turbine Fuel', description: 'ATF JET A-1 IAF Spec IS-1571', pipeline: 'Panipat Refinery', quantity: 3200, unit: 'kl', supply_status: 'At Terminal', tanker: 'MT Air Force', received: '2026-07-23', batch: 'OGP-B2026-0702', cost_inr: 32000000, sulphur_pct: 0.0003, destination: 'IAF Hindon Base' },
  { id: 'OGP-0016', material: 'Bitumen', description: 'VG-40 High Modulus Paving Grade', pipeline: 'Numaligarh Refinery', quantity: 1800, unit: 'mt', supply_status: 'Held Up', tanker: 'Pipeline-22', received: '2026-07-23', batch: 'OGP-B2026-0701', cost_inr: 10800000, sulphur_pct: 5.1, destination: 'Brahmaputra Expressway' },
  { id: 'OGP-0017', material: 'Crude Oil', description: 'Nigerian Bonny Light Sweet API 35.4', pipeline: 'Mumbai High-Uran', quantity: 72000, unit: 'bbl', supply_status: 'In Pipeline', tanker: 'MT Ocean Grace', received: '2026-07-22', batch: 'OGP-B2026-0629', cost_inr: 295000000, sulphur_pct: 0.15, destination: 'Gujarat Refinery' },
  { id: 'OGP-0018', material: 'Natural Gas', description: 'Assam Gas KSG Pipeline 92% Methane', pipeline: 'KG-D6 Onshore', quantity: 3200000, unit: 'scm', supply_status: 'At Terminal', tanker: 'Pipeline-05', received: '2026-07-22', batch: 'OGP-B2026-0628', cost_inr: 78000000, sulphur_pct: 0.008, destination: 'Assam Fertilizer' },
  { id: 'OGP-0019', material: 'LNG', description: 'US Sabine Pass LNG Cargo Term', pipeline: 'Mumbai High-Uran', quantity: 160000, unit: 'scm', supply_status: 'Dispatched', tanker: 'MT Energy Vision', received: '2026-07-21', batch: 'OGP-B2026-0625', cost_inr: 240000000, sulphur_pct: 0.001, destination: 'Ennore Terminal' },
  { id: 'OGP-0020', material: 'Petrochemicals', description: 'Benzene FCC Extraction Grade', pipeline: 'Koyali Refinery', quantity: 680, unit: 'mt', supply_status: 'Under Quality Check', tanker: 'Pipeline-16', received: '2026-07-21', batch: 'OGP-B2026-0624', cost_inr: 51000000, sulphur_pct: 0.002, destination: 'Vadodara Chemical' },
]

const genRecords = (start: number) => {
  const statuses = ['In Pipeline', 'At Terminal', 'Under Quality Check', 'Dispatched', 'Held Up', 'Scheduled']
  const destinations = ['Mumbai Refinery', 'Delhi Fuel Depot', 'Ahmedabad Depot', 'Kochi Terminal', 'IGI Airport Delhi', 'IAF Hindon Base', 'Gujarat Bottling', 'Assam Fertilizer']
  return Array.from({ length: 40 }, (_, i) => ({
    id: `OGP-${String(start + i).padStart(4, '0')}`,
    material: MATERIAL_TYPES[(start + i) % 8],
    description: `${MATERIAL_TYPES[(start + i) % 8]} Shipment ${String((start + i) % 99 + 1).padStart(3, '0')}`,
    pipeline: PIPELINES[(start + i) % 8],
    quantity: Math.round(10 + Math.random() * 99990),
    unit: ['bbl', 'scm', 'scm', 'mt', 'mt', 'kl', 'kl', 'mt'][i % 8],
    supply_status: statuses[(start + i) % 6],
    tanker: `TK-${String(28470 + start + i).padStart(5, '0')}`,
    received: `2026-07-${String(20 - Math.floor((start + i) / 10)).padStart(2, '0')}`,
    batch: `OGP-B2026-${String(624 - Math.floor((start + i) / 3)).padStart(4, '0')}`,
    cost_inr: Math.round(5000000 + Math.random() * 350000000),
    sulphur_pct: Math.round((Math.random() * 5) * 1000) / 1000,
    destination: destinations[(start + i) % 8],
  }))
}

const allSupply = [...supplyRecords, ...genRecords(21), ...genRecords(61)]

function ri(min: number, max: number, value: number) {
  return Math.max(min, Math.min(max, value))
}

const filterGroups = [
  {
    key: 'material',
    label: 'Material Type',
    options: MATERIAL_TYPES.map(m => ({ label: m, value: m, count: allSupply.filter(r => r.material === m).length })),
  },
  {
    key: 'pipeline',
    label: 'Pipeline / Refinery',
    options: PIPELINES.map(p => ({ label: p, value: p, count: allSupply.filter(r => r.pipeline === p).length })),
  },
  {
    key: 'supply_status',
    label: 'Supply Status',
    options: SUPPLY_STATUS.map(s => ({ label: s, value: s, count: allSupply.filter(r => r.supply_status === s).length })),
  },
]

function MaterialBadge({ material }: { material: string }) {
  const colors: Record<string, string> = { 'Crude Oil': 'bg-yellow-100 text-yellow-800', 'Natural Gas': 'bg-sky-100 text-sky-800', LNG: 'bg-blue-100 text-blue-800', LPG: 'bg-orange-100 text-orange-800', Petrochemicals: 'bg-purple-100 text-purple-800', 'Refined Diesel': 'bg-gray-100 text-gray-800', 'Aviation Turbine Fuel': 'bg-indigo-100 text-indigo-800', Bitumen: 'bg-stone-100 text-stone-800' }
  return <span className={`ogp-material-badge inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[material] || 'bg-gray-100 text-gray-800'}`}>{material}</span>
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = { 'In Pipeline': 'bg-blue-100 text-blue-800', 'At Terminal': 'bg-cyan-100 text-cyan-800', 'Under Quality Check': 'bg-yellow-100 text-yellow-800', Dispatched: 'bg-green-100 text-green-800', 'Held Up': 'bg-red-100 text-red-800', Scheduled: 'bg-gray-200 text-gray-700' }
  return <span className={`ogp-status-badge inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-700'}`}>{status}</span>
}

function CostBar({ cost }: { cost: number }) {
  const pct = ri(0, 100, (cost / 400000000) * 100)
  const color = cost >= 200000000 ? 'bg-amber-600' : cost >= 100000000 ? 'bg-amber-500' : cost >= 30000000 ? 'bg-amber-400' : 'bg-amber-300'
  return <div className="ogp-cost-bar flex items-center gap-2"><div className="h-2 w-20 rounded-full bg-gray-200"><div className={`ogp-cost-bar-fill h-2 rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} /></div><span className="text-xs text-gray-500">{'₹' + (cost / 10000000).toFixed(1) + 'Cr'}</span></div>
}

function HealthRing({ value, label, color }: { value: number; label: string; color: string }) {
  const r = 28, cx = 35, cy = 35, sw = 5
  const circ = 2 * Math.PI * r
  const offset = circ - (ri(0, 100, value) / 100) * circ
  return <div className="ogp-health-ring flex flex-col items-center"><svg width={70} height={70} className="-rotate-90"><circle cx={cx} cy={cy} r={r} fill="none" stroke="#e5e7eb" strokeWidth={sw} /><circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={sw} strokeDasharray={circ} strokeDashoffset={offset} className="ogp-ring-path" strokeLinecap="round" /></svg><span className="ogp-ring-value mt-1 text-sm font-bold" style={{ color }}>{value}%</span><span className="text-xs text-gray-500">{label}</span></div>
}

function KpiTile({ title, value, sub }: { title: string; value: string; sub: string }) {
  return <Card className="ogp-kpi-card"><CardContent className="p-4"><p className="text-xs text-gray-500">{title}</p><p className="ogp-kpi-value mt-1 text-2xl font-bold">{value}</p><p className="text-xs text-gray-400 mt-0.5">{sub}</p></CardContent></Card>
}

function ValueTile({ title, value, trend }: { title: string; value: string; trend: string }) {
  const up = trend.startsWith('+')
  return <Card className="ogp-value-tile"><CardContent className="p-4"><p className="text-xs text-gray-500">{title}</p><p className="mt-1 text-xl font-bold">{value}</p><p className={`text-xs mt-0.5 ${up ? 'text-green-600' : 'text-red-500'}`}>{trend}</p></CardContent></Card>
}

export default function OilGasPipelineSupplyView() {
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

  const filtered = allSupply.filter(s => {
    const q = searchQuery.toLowerCase()
    if (q && !s.id.toLowerCase().includes(q) && !s.material.toLowerCase().includes(q) && !s.description.toLowerCase().includes(q) && !s.pipeline.toLowerCase().includes(q) && !s.destination.toLowerCase().includes(q)) return false
    return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(s[key as keyof typeof s] as string))
  })

  const totalCost = allSupply.reduce((sum, s) => sum + s.cost_inr, 0)
  const inPipeline = allSupply.filter(s => s.supply_status === 'In Pipeline').length
  const dispatched = allSupply.filter(s => s.supply_status === 'Dispatched').length

  const monthlyData = [
    { month: 'Jan', shipments: 125, value_cr: 320, throughput: 89 },
    { month: 'Feb', shipments: 142, value_cr: 385, throughput: 92 },
    { month: 'Mar', shipments: 98, value_cr: 260, throughput: 86 },
    { month: 'Apr', shipments: 168, value_cr: 445, throughput: 94 },
    { month: 'May', shipments: 155, value_cr: 410, throughput: 91 },
    { month: 'Jun', shipments: 132, value_cr: 348, throughput: 88 },
    { month: 'Jul', shipments: 175, value_cr: 468, throughput: 95 },
  ]
  const materialData = MATERIAL_TYPES.map(m => ({ material: m, count: allSupply.filter(r => r.material === m).length }))
  const pipeData = PIPELINES.map(p => ({ pipeline: p, count: allSupply.filter(r => r.pipeline === p).length }))

  const tabs = [
    { value: 'dashboard', label: 'Dashboard' },
    { value: 'supply', label: 'Supply Chain' },
    { value: 'analytics', label: 'Analytics' },
    { value: 'insights', label: 'Insights' },
  ]

  return (
    <div className="ogp-container space-y-4">
      <PageHeader title="Oil & Gas Pipeline Supply" description="Hydrocarbon pipeline logistics with ONGC/OIL/GAIL network tracking, quality testing, tanker scheduling, and BS-VI fuel distribution across Indian refineries and terminals" />
      <ModuleBreadcrumb items={[{ label: 'Energy Logistics' }, { label: 'Oil & Gas' }]} />
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="ogp-tabs-list">
          {tabs.map(t => <TabsTrigger key={t.value} value={t.value} className="ogp-tab-trigger">{t.label}</TabsTrigger>)}
        </TabsList>

        <TabsContent value="dashboard" className="ogp-tab-content space-y-4 mt-4">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <KpiTile title="Total Shipments" value={allSupply.length.toString()} sub="Consignments tracked" />
            <KpiTile title="Total Value" value={`₹${(totalCost / 10000000).toFixed(0)}Cr`} sub="Pipeline value" />
            <KpiTile title="In Pipeline" value={inPipeline.toString()} sub={`${((inPipeline / allSupply.length) * 100).toFixed(0)}% in transit`} />
            <KpiTile title="Dispatched" value={dispatched.toString()} sub="Delivered this month" />
          </div>
          <div className="grid gap-4 grid-cols-3 md:grid-cols-6">
            <HealthRing value={95} label="Pipeline Integrity" color="#d97706" />
            <HealthRing value={93} label="Quality Pass" color="#b45309" />
            <HealthRing value={97} label="Delivery SLA" color="#f59e0b" />
            <HealthRing value={91} label="Tanker Util" color="#fbbf24" />
            <HealthRing value={98} label="Safety Record" color="#78350f" />
            <HealthRing value={94} label="BS-VI Compliant" color="#92400e" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="ogp-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Monthly Shipment Volume & Throughput</CardTitle></CardHeader><CardContent><LineChart data={monthlyData} width={300} height={200}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" fontSize={12} /><YAxis fontSize={12} /><Tooltip /><Legend /><Line type="monotone" dataKey="shipments" stroke="#d97706" strokeWidth={2} /><Line type="monotone" dataKey="throughput" stroke="#b45309" strokeWidth={2} strokeDasharray="5 5" /></LineChart></CardContent></Card>
            <Card className="ogp-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Shipments by Material Type</CardTitle></CardHeader><CardContent><BarChart data={materialData} width={300} height={200}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="material" fontSize={10} angle={-30} textAnchor="end" height={50} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="count" fill="#d97706" radius={[4,4,0,0]} /></BarChart></CardContent></Card>
            <Card className="ogp-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Pipeline / Refinery Distribution</CardTitle></CardHeader><CardContent><PieChart width={300} height={200}><Pie data={pipeData} dataKey="count" nameKey="pipeline" cx="50%" cy="50%" outerRadius={70} label={({ pipeline, count }) => `${count}`}>{pipeData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="supply" className="ogp-tab-content space-y-4 mt-4">
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={allSupply.length} filteredCount={filtered.length} onRefresh={() => {}} placeholder="Search by ID, material, pipeline, tanker, or destination..." />
          <div className="overflow-x-auto rounded-lg border">
            <table className="ogp-table w-full text-sm">
              <thead><tr className="ogp-table-header bg-gray-50"><th className="px-3 py-2 text-left font-medium">ID</th><th className="px-3 py-2 text-left font-medium">Material</th><th className="px-3 py-2 text-left font-medium">Status</th><th className="px-3 py-2 text-left font-medium">Qty</th><th className="px-3 py-2 text-left font-medium">Cost</th><th className="px-3 py-2 text-left font-medium">Pipeline</th><th className="px-3 py-2 text-left font-medium">Tanker</th><th className="px-3 py-2 text-left font-medium">Destination</th><th className="px-3 py-2 text-left font-medium">Sulphur %</th></tr></thead>
              <tbody>{filtered.slice(0, 20).map(s => (
                <tr key={s.id} className="ogp-table-row border-t hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-2 font-mono text-xs">{s.id}</td>
                  <td className="px-3 py-2"><MaterialBadge material={s.material} /></td>
                  <td className="px-3 py-2"><StatusBadge status={s.supply_status} /></td>
                  <td className="px-3 py-2 text-xs">{s.quantity.toLocaleString('en-IN')} {s.unit}</td>
                  <td className="px-3 py-2"><CostBar cost={s.cost_inr} /></td>
                  <td className="px-3 py-2 text-xs">{s.pipeline}</td>
                  <td className="px-3 py-2 text-xs">{s.tanker}</td>
                  <td className="px-3 py-2 text-xs">{s.destination}</td>
                  <td className="px-3 py-2 text-xs">{s.sulphur_pct}%</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="ogp-tab-content space-y-4 mt-4">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <ValueTile title="Avg Shipment Value" value="₹18.2Cr" trend="+12.5% vs last quarter" />
            <ValueTile title="Pipeline Uptime" value="98.7%" trend="+0.8% improved" />
            <ValueTile title="Quality Pass Rate" value="97.3%" trend="+1.2% improved" />
            <ValueTile title="Safety Incidents" value="0" trend="Zero incidents" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="ogp-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Revenue by Material Category</CardTitle></CardHeader><CardContent><BarChart data={MATERIAL_TYPES.map(m => ({ material: m, total: allSupply.filter(r => r.material === m).reduce((s, r) => s + r.cost_inr, 0) / 10000000 }))} width={400} height={250}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="material" fontSize={10} angle={-30} textAnchor="end" height={50} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="total" fill="#b45309" radius={[4,4,0,0]} /></BarChart></CardContent></Card>
            <Card className="ogp-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Supply Status Breakdown</CardTitle></CardHeader><CardContent><PieChart width={400} height={250}><Pie data={SUPPLY_STATUS.map(s => ({ status: s, count: allSupply.filter(r => r.supply_status === s).length }))} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={80} label>{SUPPLY_STATUS.map((_, i) => <Cell key={i} fill={['#3b82f6','#06b6d4','#eab308','#22c55e','#ef4444','#9ca3af'][i]} />)}</Pie><Tooltip /></PieChart></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="ogp-tab-content space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="ogp-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">GAIL National Gas Grid Expansion</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Tracking the Pradhan Mantri Urja Ganga project covering 16,200 km of natural gas pipeline grid across India. Real-time SCADA monitoring of 3,400+ pipeline valve stations with automated pressure regulation. Integration with city gas distribution (CGD) networks in 398 Geographical Areas. LNG regasification terminal capacity expansion at Dahej, Kochi, and upcoming Ennore Phase-2 supporting 45 MMSCMD throughput.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-amber-800">Critical</span><span className="text-gray-400">Live</span></div></CardContent></Card>
            <Card className="ogp-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">Smart Pigging Pipeline Integrity Monitoring</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Intelligent pig inspection runs on 8,500 km of active pipeline every 6 months detecting corrosion, dents, and weld anomalies. Machine learning analysis of MFL (Magnetic Flux Leakage) data reducing false-positive defect calls by 62%. Automated risk ranking of 12,000+ detected features enabling targeted maintenance. Emergency shutdown system (ESD) response time improved to 8 seconds across all critical valve stations.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5 text-yellow-800">Operational</span><span className="text-gray-400">Q3 2026</span></div></CardContent></Card>
            <Card className="ogp-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">BS-VI Fuel Quality Digital Passport</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Every batch of BS-VI compliant fuel carries a blockchain-verified digital quality passport from refinery to retail outlet. Automated sulphur, cetane, and flash point testing at 42 quality checkpoints with results uploaded within 15 minutes. Integration with Petroleum Planning and Analysis Cell (PPAC) for monthly production and consumption reporting. Zero BS-VI non-compliance violations across all 23 Indian refineries for 18 consecutive months.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-orange-100 px-2 py-0.5 text-orange-800">Strategic</span><span className="text-gray-400">FY2027</span></div></CardContent></Card>
            <Card className="ogp-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">AI-Driven Demand Forecasting for Refineries</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Deep learning demand sensing model processing 340+ data streams including festival calendars, monsoon patterns, EV adoption rates, and industrial production indices. Forecast accuracy of 94.2% for diesel, 91.8% for petrol, and 96.1% for ATF across 7-day rolling windows. Dynamic crude oil sourcing optimization saving IOCL, BPCL, and HPCL an estimated USD 180M annually in procurement costs. Integration with Indian Strategic Petroleum Reserve (ISPRL) cavern management.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-purple-100 px-2 py-0.5 text-purple-800">Innovation</span><span className="text-gray-400">Pilot</span></div></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
