import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#78716c', '#57534e', '#a8a29e', '#d6d3d1', '#44403c', '#292524', '#f5f5f4', '#1c1917']

const MINERAL_TYPES = ['Iron Ore', 'Bauxite', 'Coal', 'Limestone', 'Manganese Ore', 'Copper Ore', 'Gold Ore', 'Chromite']
const MINES = ['NMDC Bailadila', 'NALCO Damanjodi', 'Coal India Jharia', 'Hindalco Baphlimali', 'Vedanta Jharsuguda', 'SAIL Barsua', 'HCL Khetri', 'OMC Sukinda']
const TRANSPORT_STATUS = ['In Transit', 'At Railhead', 'Quality Verified', 'Dispatched', 'Held for Review', 'Scheduled']

const mineralRecords = [
  { id: 'MML-0001', mineral: 'Iron Ore', description: 'Hematite Fe 64.5% Lumps Grade-A', mine: 'NMDC Bailadila', quantity: 25000, unit: 'mt', transport_status: 'In Transit', rake: 'RKG-2026-0841', destination: 'SAIL Rourkela', received: '2026-07-30', batch: 'MML-B2026-0721', cost_inr: 187500000, fe_pct: 64.5, grade: 'A' },
  { id: 'MML-0002', mineral: 'Bauxite', description: 'Gibbsite Al2O3 52% Refractory Grade', mine: 'NALCO Damanjodi', quantity: 42000, unit: 'mt', transport_status: 'At Railhead', rake: 'ECOR-2026-0038', destination: 'NALCO Smelter', received: '2026-07-30', batch: 'MML-B2026-0720', cost_inr: 63000000, fe_pct: 0, grade: 'Refractory' },
  { id: 'MML-0003', mineral: 'Coal', description: 'Coking Coal GCV 6200 AR ROM', mine: 'Coal India Jharia', quantity: 85000, unit: 'mt', transport_status: 'Quality Verified', rake: 'ECR-2026-0012', destination: 'Tata Steel Jamshedpur', received: '2026-07-29', batch: 'MML-B2026-0719', cost_inr: 510000000, fe_pct: 0, grade: 'Coking' },
  { id: 'MML-0004', mineral: 'Limestone', description: 'Calcite CaCO3 96% Cement Grade', mine: 'Vedanta Jharsuguda', quantity: 35000, unit: 'mt', transport_status: 'Dispatched', rake: 'SER-2026-0027', destination: 'UltraTech Nathdwara', received: '2026-07-29', batch: 'MML-B2026-0718', cost_inr: 14000000, fe_pct: 0, grade: 'Cement' },
  { id: 'MML-0005', mineral: 'Manganese Ore', description: 'Psilomelane Mn 48% Lumps', mine: 'MOCD Nagpur', quantity: 8000, unit: 'mt', transport_status: 'In Transit', rake: 'CR-2026-0031', destination: 'SAIL Bhilai', received: '2026-07-28', batch: 'MML-B2026-0716', cost_inr: 56000000, fe_pct: 0, grade: 'High-Grade' },
  { id: 'MML-0006', mineral: 'Copper Ore', description: 'Chalcopyrite Cu 1.8% Sulphide', mine: 'HCL Khetri', quantity: 55000, unit: 'mt', transport_status: 'At Railhead', rake: 'NWR-2026-0040', destination: 'HCL Smelter Khetri', received: '2026-07-28', batch: 'MML-B2026-0715', cost_inr: 275000000, fe_pct: 0, grade: 'Sulphide' },
  { id: 'MML-0007', mineral: 'Gold Ore', description: 'Arhenopyrite Au 3.2 g/t', mine: 'HGML Hutti', quantity: 12000, unit: 'mt', transport_status: 'Quality Verified', rake: 'SCR-2026-0008', destination: 'HGML Gold Refinery', received: '2026-07-27', batch: 'MML-B2026-0714', cost_inr: 960000000, fe_pct: 0, grade: 'Primary' },
  { id: 'MML-0008', mineral: 'Chromite', description: 'Chromite Cr2O3 52% Beneficiated', mine: 'OMC Sukinda', quantity: 15000, unit: 'mt', transport_status: 'Dispatched', rake: 'ECoR-2026-0037', destination: 'FACOR Bhadrak', received: '2026-07-27', batch: 'MML-B2026-0713', cost_inr: 82500000, fe_pct: 0, grade: 'Beneficiated' },
  { id: 'MML-0009', mineral: 'Iron Ore', description: 'Magnetite Fe 68.2% Fines Grade-B', mine: 'NMDC Bailadila', quantity: 60000, unit: 'mt', transport_status: 'In Transit', rake: 'RKG-2026-0839', destination: 'JSW Vijayanagar', received: '2026-07-26', batch: 'MML-B2026-0711', cost_inr: 390000000, fe_pct: 68.2, grade: 'B' },
  { id: 'MML-0010', mineral: 'Bauxite', description: 'Boehmite Al2O3 58% Metallurgical Grade', mine: 'Hindalco Baphlimali', quantity: 28000, unit: 'mt', transport_status: 'At Railhead', rake: 'SER-2026-0026', destination: 'Hindalco Renukoot', received: '2026-07-26', batch: 'MML-B2026-0710', cost_inr: 50400000, fe_pct: 0, grade: 'Metallurgical' },
  { id: 'MML-0011', mineral: 'Coal', description: 'Thermal Coal GCV 4800 NAR ROM', mine: 'Coal India Jharia', quantity: 120000, unit: 'mt', transport_status: 'Dispatched', rake: 'ECR-2026-0011', destination: 'NTPC Talcher', received: '2026-07-25', batch: 'MML-B2026-0708', cost_inr: 420000000, fe_pct: 0, grade: 'Thermal' },
  { id: 'MML-0012', mineral: 'Limestone', description: 'Dolomite CaMg(CO3)2 42% MgO', mine: 'SAIL Barsua', quantity: 18000, unit: 'mt', transport_status: 'Held for Review', rake: 'SER-2026-0025', destination: 'SAIL Rourkela', received: '2026-07-25', batch: 'MML-B2026-0707', cost_inr: 9000000, fe_pct: 0, grade: 'Dolomite' },
  { id: 'MML-0013', mineral: 'Manganese Ore', description: 'Pyrolusite Mn 38% Fines', mine: 'MOCD Nagpur', quantity: 12000, unit: 'mt', transport_status: 'Scheduled', rake: 'CR-2026-0030', destination: 'ESIL Nagpur', received: '2026-07-24', batch: 'MML-B2026-0705', cost_inr: 60000000, fe_pct: 0, grade: 'Fines' },
  { id: 'MML-0014', mineral: 'Copper Ore', description: 'Bornite Cu 2.1% Oxide', mine: 'HCL Khetri', quantity: 40000, unit: 'mt', transport_status: 'In Transit', rake: 'NWR-2026-0039', destination: 'HCL Malanjkhand', received: '2026-07-24', batch: 'MML-B2026-0704', cost_inr: 200000000, fe_pct: 0, grade: 'Oxide' },
  { id: 'MML-0015', mineral: 'Gold Ore', description: 'Free Milling Au 5.1 g/t Oxide', mine: 'HGML Hutti', quantity: 8000, unit: 'mt', transport_status: 'Quality Verified', rake: 'SCR-2026-0007', destination: 'HGML Cyanidation Plant', received: '2026-07-23', batch: 'MML-B2026-0702', cost_inr: 640000000, fe_pct: 0, grade: 'Oxide' },
  { id: 'MML-0016', mineral: 'Chromite', description: 'Lump Ore Cr2O3 46% ROM', mine: 'OMC Sukinda', quantity: 22000, unit: 'mt', transport_status: 'At Railhead', rake: 'ECoR-2026-0036', destination: 'IMFA Choudwar', received: '2026-07-23', batch: 'MML-B2026-0701', cost_inr: 77000000, fe_pct: 0, grade: 'ROM' },
  { id: 'MML-0017', mineral: 'Iron Ore', description: 'Hematite Fe 62.0% Fines Grade-B', mine: 'Vedanta Jharsuguda', quantity: 45000, unit: 'mt', transport_status: 'Dispatched', rake: 'ECOR-2026-0029', destination: 'SAIL Bokaro', received: '2026-07-22', batch: 'MML-B2026-0629', cost_inr: 225000000, fe_pct: 62.0, grade: 'B' },
  { id: 'MML-0018', mineral: 'Bauxite', description: 'Diaspore Al2O3 55% Low-Silica', mine: 'NALCO Damanjodi', quantity: 55000, unit: 'mt', transport_status: 'In Transit', rake: 'ECOR-2026-0028', destination: 'Vedanta Lanjigarh', received: '2026-07-22', batch: 'MML-B2026-0628', cost_inr: 93500000, fe_pct: 0, grade: 'Low-Silica' },
  { id: 'MML-0019', mineral: 'Coal', description: 'Washed Coal GCV 5500 ROM MCL', mine: 'Coal India Jharia', quantity: 95000, unit: 'mt', transport_status: 'Scheduled', rake: 'SECR-2026-0010', destination: 'JSPL Raigarh', received: '2026-07-21', batch: 'MML-B2026-0625', cost_inr: 475000000, fe_pct: 0, grade: 'Washed' },
  { id: 'MML-0020', mineral: 'Limestone', description: 'Calcite CaCO3 92% Steel Grade', mine: 'SAIL Barsua', quantity: 25000, unit: 'mt', transport_status: 'Dispatched', rake: 'SER-2026-0024', destination: 'JSW Dolvi', received: '2026-07-21', batch: 'MML-B2026-0624', cost_inr: 10000000, fe_pct: 0, grade: 'Steel' },
]

const genRecords = (start: number) => {
  const statuses = ['In Transit', 'At Railhead', 'Quality Verified', 'Dispatched', 'Held for Review', 'Scheduled']
  const destinations = ['SAIL Rourkela', 'Tata Steel Jamshedpur', 'JSW Vijayanagar', 'JSPL Raigarh', 'NALCO Smelter', 'NTPC Talcher', 'Vedanta Lanjigarh', 'Hindalco Renukoot']
  return Array.from({ length: 40 }, (_, i) => ({
    id: `MML-${String(start + i).padStart(4, '0')}`,
    mineral: MINERAL_TYPES[(start + i) % 8],
    description: `${MINERAL_TYPES[(start + i) % 8]} Shipment ${String((start + i) % 99 + 1).padStart(3, '0')}`,
    mine: MINES[(start + i) % 8],
    quantity: Math.round(5000 + Math.random() * 95000),
    unit: 'mt',
    transport_status: statuses[(start + i) % 6],
    rake: `RK-${String(28470 + start + i).padStart(5, '0')}`,
    destination: destinations[(start + i) % 8],
    received: `2026-07-${String(20 - Math.floor((start + i) / 10)).padStart(2, '0')}`,
    batch: `MML-B2026-${String(624 - Math.floor((start + i) / 3)).padStart(4, '0')}`,
    cost_inr: Math.round(5000000 + Math.random() * 800000000),
    fe_pct: MINERAL_TYPES[(start + i) % 8] === 'Iron Ore' ? Math.round((58 + Math.random() * 12) * 10) / 10 : 0,
    grade: ['A', 'B', 'C', 'ROM', 'Fines', 'Lumps', 'Sulphide', 'Oxide'][(start + i) % 8],
  }))
}

const allMinerals = [...mineralRecords, ...genRecords(21), ...genRecords(61)]

function ri(min: number, max: number, value: number) {
  return Math.max(min, Math.min(max, value))
}

const filterGroups = [
  {
    key: 'mineral',
    label: 'Mineral Type',
    options: MINERAL_TYPES.map(m => ({ label: m, value: m, count: allMinerals.filter(r => r.mineral === m).length })),
  },
  {
    key: 'mine',
    label: 'Mine Source',
    options: MINES.map(m => ({ label: m, value: m, count: allMinerals.filter(r => r.mine === m).length })),
  },
  {
    key: 'transport_status',
    label: 'Transport Status',
    options: TRANSPORT_STATUS.map(s => ({ label: s, value: s, count: allMinerals.filter(r => r.transport_status === s).length })),
  },
]

function MineralBadge({ mineral }: { mineral: string }) {
  const colors: Record<string, string> = { 'Iron Ore': 'bg-red-100 text-red-800', Bauxite: 'bg-amber-100 text-amber-800', Coal: 'bg-stone-100 text-stone-800', Limestone: 'bg-gray-100 text-gray-800', 'Manganese Ore': 'bg-purple-100 text-purple-800', 'Copper Ore': 'bg-orange-100 text-orange-800', 'Gold Ore': 'bg-yellow-100 text-yellow-800', Chromite: 'bg-zinc-100 text-zinc-800' }
  return <span className={`mml-mineral-badge inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[mineral] || 'bg-gray-100 text-gray-800'}`}>{mineral}</span>
}

function TransportBadge({ status }: { status: string }) {
  const colors: Record<string, string> = { 'In Transit': 'bg-blue-100 text-blue-800', 'At Railhead': 'bg-cyan-100 text-cyan-800', 'Quality Verified': 'bg-green-100 text-green-800', Dispatched: 'bg-emerald-100 text-emerald-800', 'Held for Review': 'bg-red-100 text-red-800', Scheduled: 'bg-gray-200 text-gray-700' }
  return <span className={`mml-transport-badge inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-700'}`}>{status}</span>
}

function CostBar({ cost }: { cost: number }) {
  const pct = ri(0, 100, (cost / 1000000000) * 100)
  const color = cost >= 500000000 ? 'bg-stone-600' : cost >= 100000000 ? 'bg-stone-500' : cost >= 50000000 ? 'bg-stone-400' : 'bg-stone-300'
  return <div className="mml-cost-bar flex items-center gap-2"><div className="h-2 w-20 rounded-full bg-gray-200"><div className={`mml-cost-bar-fill h-2 rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} /></div><span className="text-xs text-gray-500">{'₹' + (cost / 10000000).toFixed(1) + 'Cr'}</span></div>
}

function HealthRing({ value, label, color }: { value: number; label: string; color: string }) {
  const r = 28, cx = 35, cy = 35, sw = 5
  const circ = 2 * Math.PI * r
  const offset = circ - (ri(0, 100, value) / 100) * circ
  return <div className="mml-health-ring flex flex-col items-center"><svg width={70} height={70} className="-rotate-90"><circle cx={cx} cy={cy} r={r} fill="none" stroke="#e5e7eb" strokeWidth={sw} /><circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={sw} strokeDasharray={circ} strokeDashoffset={offset} className="mml-ring-path" strokeLinecap="round" /></svg><span className="mml-ring-value mt-1 text-sm font-bold" style={{ color }}>{value}%</span><span className="text-xs text-gray-500">{label}</span></div>
}

function KpiTile({ title, value, sub }: { title: string; value: string; sub: string }) {
  return <Card className="mml-kpi-card"><CardContent className="p-4"><p className="text-xs text-gray-500">{title}</p><p className="mml-kpi-value mt-1 text-2xl font-bold">{value}</p><p className="text-xs text-gray-400 mt-0.5">{sub}</p></CardContent></Card>
}

function ValueTile({ title, value, trend }: { title: string; value: string; trend: string }) {
  const up = trend.startsWith('+')
  return <Card className="mml-value-tile"><CardContent className="p-4"><p className="text-xs text-gray-500">{title}</p><p className="mt-1 text-xl font-bold">{value}</p><p className={`text-xs mt-0.5 ${up ? 'text-green-600' : 'text-red-500'}`}>{trend}</p></CardContent></Card>
}

export default function MiningMineralsLogisticsView() {
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

  const filtered = allMinerals.filter(m => {
    const q = searchQuery.toLowerCase()
    if (q && !m.id.toLowerCase().includes(q) && !m.mineral.toLowerCase().includes(q) && !m.description.toLowerCase().includes(q) && !m.mine.toLowerCase().includes(q) && !m.destination.toLowerCase().includes(q)) return false
    return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(m[key as keyof typeof m] as string))
  })

  const totalCost = allMinerals.reduce((s, m) => s + m.cost_inr, 0)
  const inTransit = allMinerals.filter(m => m.transport_status === 'In Transit').length
  const qualityVerified = allMinerals.filter(m => m.transport_status === 'Quality Verified').length

  const monthlyData = [
    { month: 'Jan', rakes: 185, tonnage_k: 450, quality: 96 },
    { month: 'Feb', rakes: 210, tonnage_k: 520, quality: 95 },
    { month: 'Mar', rakes: 178, tonnage_k: 410, quality: 97 },
    { month: 'Apr', rakes: 245, tonnage_k: 610, quality: 94 },
    { month: 'May', rakes: 198, tonnage_k: 480, quality: 96 },
    { month: 'Jun', rakes: 162, tonnage_k: 390, quality: 93 },
    { month: 'Jul', rakes: 228, tonnage_k: 560, quality: 97 },
  ]
  const mineralData = MINERAL_TYPES.map(m => ({ mineral: m, count: allMinerals.filter(r => r.mineral === m).length }))
  const mineData = MINES.map(m => ({ mine: m, count: allMinerals.filter(r => r.mine === m).length }))

  const tabs = [
    { value: 'dashboard', label: 'Dashboard' },
    { value: 'shipments', label: 'Shipments' },
    { value: 'analytics', label: 'Analytics' },
    { value: 'insights', label: 'Insights' },
  ]

  return (
    <div className="mml-container space-y-4">
      <PageHeader title="Mining & Minerals Logistics" description="End-to-end mineral transport logistics with Indian Railway rake management, mine-to-plant tracking, ore grade quality verification, and multi-modal freight coordination across Indian mining operations" />
      <ModuleBreadcrumb items={[{ label: 'Bulk Logistics' }, { label: 'Mining & Minerals' }]} />
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mml-tabs-list">
          {tabs.map(t => <TabsTrigger key={t.value} value={t.value} className="mml-tab-trigger">{t.label}</TabsTrigger>)}
        </TabsList>

        <TabsContent value="dashboard" className="mml-tab-content space-y-4 mt-4">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <KpiTile title="Total Shipments" value={allMinerals.length.toString()} sub="Mineral consignments" />
            <KpiTile title="Total Value" value={`₹${(totalCost / 10000000).toFixed(0)}Cr`} sub="Cargo value" />
            <KpiTile title="In Transit" value={inTransit.toString()} sub={`${((inTransit / allMinerals.length) * 100).toFixed(0)}% on rail` } />
            <KpiTile title="Quality Verified" value={qualityVerified.toString()} sub={`${((qualityVerified / allMinerals.length) * 100).toFixed(0)}% passed`} />
          </div>
          <div className="grid gap-4 grid-cols-3 md:grid-cols-6">
            <HealthRing value={96} label="Rake Utilization" color="#78716c" />
            <HealthRing value={94} label="Grade Match" color="#57534e" />
            <HealthRing value={93} label="Loading Speed" color="#a8a29e" />
            <HealthRing value={97} label="Safety Score" color="#44403c" />
            <HealthRing value={91} label="On-Time" color="#292524" />
            <HealthRing value={95} label="Blending Acc." color="#78716c" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="mml-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Monthly Rake Dispatch & Quality Index</CardTitle></CardHeader><CardContent><LineChart data={monthlyData} width={300} height={200}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" fontSize={12} /><YAxis fontSize={12} /><Tooltip /><Legend /><Line type="monotone" dataKey="rakes" stroke="#78716c" strokeWidth={2} /><Line type="monotone" dataKey="quality" stroke="#57534e" strokeWidth={2} strokeDasharray="5 5" /></LineChart></CardContent></Card>
            <Card className="mml-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Shipments by Mineral Type</CardTitle></CardHeader><CardContent><BarChart data={mineralData} width={300} height={200}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="mineral" fontSize={10} angle={-30} textAnchor="end" height={50} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="count" fill="#78716c" radius={[4,4,0,0]} /></BarChart></CardContent></Card>
            <Card className="mml-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Mine Source Distribution</CardTitle></CardHeader><CardContent><PieChart width={300} height={200}><Pie data={mineData} dataKey="count" nameKey="mine" cx="50%" cy="50%" outerRadius={70} label={({ mine, count }) => `${count}`}>{mineData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="shipments" className="mml-tab-content space-y-4 mt-4">
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={allMinerals.length} filteredCount={filtered.length} onRefresh={() => {}} placeholder="Search by ID, mineral, mine, destination, or rake..." />
          <div className="overflow-x-auto rounded-lg border">
            <table className="mml-table w-full text-sm">
              <thead><tr className="mml-table-header bg-gray-50"><th className="px-3 py-2 text-left font-medium">ID</th><th className="px-3 py-2 text-left font-medium">Mineral</th><th className="px-3 py-2 text-left font-medium">Status</th><th className="px-3 py-2 text-left font-medium">Qty</th><th className="px-3 py-2 text-left font-medium">Cost</th><th className="px-3 py-2 text-left font-medium">Mine</th><th className="px-3 py-2 text-left font-medium">Destination</th><th className="px-3 py-2 text-left font-medium">Rake</th><th className="px-3 py-2 text-left font-medium">Grade</th></tr></thead>
              <tbody>{filtered.slice(0, 20).map(m => (
                <tr key={m.id} className="mml-table-row border-t hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-2 font-mono text-xs">{m.id}</td>
                  <td className="px-3 py-2"><MineralBadge mineral={m.mineral} /></td>
                  <td className="px-3 py-2"><TransportBadge status={m.transport_status} /></td>
                  <td className="px-3 py-2 text-xs">{m.quantity.toLocaleString('en-IN')} {m.unit}</td>
                  <td className="px-3 py-2"><CostBar cost={m.cost_inr} /></td>
                  <td className="px-3 py-2 text-xs">{m.mine}</td>
                  <td className="px-3 py-2 text-xs">{m.destination}</td>
                  <td className="px-3 py-2 text-xs font-mono">{m.rake}</td>
                  <td className="px-3 py-2 text-xs">{m.grade}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="mml-tab-content space-y-4 mt-4">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <ValueTile title="Avg Shipment Tonnage" value="42,500 MT" trend="+7.8% vs last quarter" />
            <ValueTile title="Grade Consistency" value="94.6%" trend="+1.5% improved" />
            <ValueTile title="Rail Utilization" value="89.3%" trend="+3.2% improved" />
            <ValueTile title="Loading Cycle" value="18.4 hrs" trend="-1.2 hrs faster" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="mml-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Revenue by Mineral Category</CardTitle></CardHeader><CardContent><BarChart data={MINERAL_TYPES.map(m => ({ mineral: m, total: allMinerals.filter(r => r.mineral === m).reduce((s, r) => s + r.cost_inr, 0) / 10000000 }))} width={400} height={250}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="mineral" fontSize={10} angle={-30} textAnchor="end" height={50} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="total" fill="#57534e" radius={[4,4,0,0]} /></BarChart></CardContent></Card>
            <Card className="mml-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Transport Status Breakdown</CardTitle></CardHeader><CardContent><PieChart width={400} height={250}><Pie data={TRANSPORT_STATUS.map(s => ({ status: s, count: allMinerals.filter(m => m.transport_status === s).length }))} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={80} label>{TRANSPORT_STATUS.map((_, i) => <Cell key={i} fill={['#3b82f6','#06b6d4','#22c55e','#10b981','#ef4444','#9ca3af'][i]} />)}</Pie><Tooltip /></PieChart></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="mml-tab-content space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="mml-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">Indian Railway RAKE Optimization System</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Real-time integration with Indian Railway FREIGHT OPERATIONS INFORMATION SYSTEM (FOIS) for rake placement, tracking, and detention monitoring across 6,500+ rakes monthly. AI-powered rake allocation engine reducing idle turnaround time by 32% at major sidings. Automated siding capacity management for Bailadila, Damanjodi, and Barsua loading points. Integration with RDSON for wagon planning 72 hours ahead.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-stone-100 px-2 py-0.5 text-stone-800">Critical</span><span className="text-gray-400">Live</span></div></CardContent></Card>
            <Card className="mml-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">Drone-Based Ore Grade Assaying</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Autonomous drone fleet of 24 units conducting XRF (X-Ray Fluorescence) grade mapping across 8 open-cast mines daily. Hyperspectral imaging achieving 98.2% accuracy for Fe content prediction in iron ore stockpiles. AI-assisted blast planning optimization using real-time grade block models reducing dilution by 18%. Digital twin of 12 beneficiation plants enabling predictive quality control.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-amber-800">Operational</span><span className="text-gray-400">Q3 2026</span></div></CardContent></Card>
            <Card className="mml-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">MMDR Act 2015 Compliance Portal</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>End-to-end compliance tracking for Ministry of Mines Mineral Concession Rules across 35 active mining leases. Automated royalty calculation and IBMD (Indian Bureau of Mines Despatch) return filing for all mineral dispatches. Integration with Pradhan Mantri Khanij Kshetra Kalyan Yojana (PMKKY) fund tracking ensuring 60% District Mineral Fund allocation compliance. Real-time Environmental Clearance (EC) condition monitoring at 12 mining sites.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-orange-100 px-2 py-0.5 text-orange-800">Strategic</span><span className="text-gray-400">FY2027</span></div></CardContent></Card>
            <Card className="mml-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">Koyali-Bhilai Auto-Blending Logistics</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Automated ore blending algorithm optimizing Fe grade targets across 4 NMDC sources for SAIL Bhilai blast furnaces. Real-time stockpile 3D modeling using drone LiDAR scanning every 48 hours at 8 mine-head stockyards. Predictive maintenance for 340+ conveyor belts and 62 stacker-reclaimers reducing unplanned downtime by 45%. Integration with GPS-tracked truck fleet of 1,200+ vehicles for last-mile mine-to-rail connectivity.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-purple-100 px-2 py-0.5 text-purple-800">Innovation</span><span className="text-gray-400">Pilot</span></div></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
