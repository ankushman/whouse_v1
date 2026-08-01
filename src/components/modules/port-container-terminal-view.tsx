import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#0e7490', '#155e75', '#0891b2', '#22d3ee', '#67e8f9', '#164e63', '#0c4a6e', '#a5f3fc']

const CARGO_TYPES = ['TEU Container', 'Reefer Container', 'Flat Rack', 'Open Top', 'Tank Container', 'Break Bulk', 'Ro-Ro Vehicle', 'OOG Project']
const TERMINALS = ['JNPT Mumbai', 'Mundra Adani', 'Chennai Ennore', 'Haldia Syama', 'V.O.C. Tuticorin', 'Cochin Vallarpadam', 'Krishnapatnam', 'Kandla Gandhidham']
const GATE_STATUS = ['Customs Released', 'Under Inspection', 'Gate In', 'Yard Placed', 'Loading', 'Discharged']

const terminalRecords = [
  { id: 'PCT-0001', cargo: 'TEU Container', description: '40HC MAERSK Line Sealed Electronics from Shanghai', terminal: 'JNPT Mumbai', quantity: 2, unit: 'containers', gate_status: 'Customs Released', lot: 'LOT-PCT-9041', destination: 'Nhava Sheva ICD', received: '2026-07-30', batch: 'PCT-B2026-0721', cost_inr: 4200000, dwell_hours: 18, berthing_vessel: 'MSC Anna' },
  { id: 'PCT-0002', cargo: 'Reefer Container', description: '40RF Reefer Lamb Meat from New Zealand Port Chalmers', terminal: 'Chennai Ennore', quantity: 4, unit: 'containers', gate_status: 'Yard Placed', lot: 'LOT-PCT-9038', destination: 'Chennai Cold Store', received: '2026-07-30', batch: 'PCT-B2026-0720', cost_inr: 8600000, dwell_hours: 42, berthing_vessel: 'CMA CGM Titian' },
  { id: 'PCT-0003', cargo: 'Flat Rack', description: '40FR Out-of-Gauge Wind Turbine Blades 55m from Denmark', terminal: 'Mundra Adani', quantity: 6, unit: 'racks', gate_status: 'Under Inspection', lot: 'LOT-PCT-9012', destination: 'Kandla Wind Farm', received: '2026-07-29', batch: 'PCT-B2026-0719', cost_inr: 18500000, dwell_hours: 96, berthing_vessel: 'BBC Charter' },
  { id: 'PCT-0004', cargo: 'Open Top', description: '20OT Steel Coils 28MT from POSCO South Korea', terminal: 'Haldia Syama', quantity: 8, unit: 'containers', gate_status: 'Gate In', lot: 'LOT-PCT-9027', destination: 'Tata Steel Jamshedpur', received: '2026-07-29', batch: 'PCT-B2026-0718', cost_inr: 12400000, dwell_hours: 8, berthing_vessel: 'NYK Apollo' },
  { id: 'PCT-0005', cargo: 'Tank Container', description: '20TK IMO3 ISO Tank Liquid Chemical Propylene Oxide', terminal: 'Cochin Vallarpadam', quantity: 3, unit: 'tanks', gate_status: 'Customs Released', lot: 'LOT-PCT-9031', destination: 'BPCL Kochi Refinery', received: '2026-07-28', batch: 'PCT-B2026-0716', cost_inr: 5200000, dwell_hours: 24, berthing_vessel: 'Stena Superior' },
  { id: 'PCT-0006', cargo: 'Break Bulk', description: '6500 MT Steam Coal Loading at Berth No.4', terminal: 'V.O.C. Tuticorin', quantity: 6500, unit: 'MT', gate_status: 'Loading', lot: 'LOT-PCT-9040', destination: 'Neyveli Lignite Corp', received: '2026-07-28', batch: 'PCT-B2026-0715', cost_inr: 32000000, dwell_hours: 72, berthing_vessel: 'MV Ocean Tiger' },
  { id: 'PCT-0007', cargo: 'Ro-Ro Vehicle', description: '450 Units Maruti Suzuki Baleno Export to South Africa', terminal: 'Mundra Adani', quantity: 450, unit: 'vehicles', gate_status: 'Discharged', lot: 'LOT-PCT-9008', destination: 'Maruti Port Mundra', received: '2026-07-27', batch: 'PCT-B2026-0714', cost_inr: 9800000, dwell_hours: 6, berthing_vessel: 'Hoegh Autoliner' },
  { id: 'PCT-0008', cargo: 'OOG Project', description: '450MT Reactor Vessel Module for Nuclear Power Plant', terminal: 'Krishnapatnam', quantity: 1, unit: 'modules', gate_status: 'Under Inspection', lot: 'LOT-PCT-9037', destination: 'NPCIL Kudankulam', received: '2026-07-27', batch: 'PCT-B2026-0713', cost_inr: 185000000, dwell_hours: 168, berthing_vessel: 'Dockwise Vanguard' },
  { id: 'PCT-0009', cargo: 'TEU Container', description: '20GP Cotton Bale 22MT from Mumbai to Jebel Ali', terminal: 'JNPT Mumbai', quantity: 12, unit: 'containers', gate_status: 'Loading', lot: 'LOT-PCT-9039', destination: 'DP World Jebel Ali', received: '2026-07-26', batch: 'PCT-B2026-0711', cost_inr: 6800000, dwell_hours: 36, berthing_vessel: 'MSC Fantasia' },
  { id: 'PCT-0010', cargo: 'Reefer Container', description: '40RF Grape Export to EU Rotterdam Cold Chain', terminal: 'Krishnapatnam', quantity: 10, unit: 'containers', gate_status: 'Gate In', lot: 'LOT-PCT-9026', destination: 'APEDA Nashik Grapes', received: '2026-07-26', batch: 'PCT-B2026-0710', cost_inr: 18500000, dwell_hours: 12, berthing_vessel: 'Evergreen Ever Utmost' },
  { id: 'PCT-0011', cargo: 'Flat Rack', description: '40FR Transformer 85MT Siemens from Hamburg', terminal: 'Kandla Gandhidham', quantity: 2, unit: 'racks', gate_status: 'Customs Released', lot: 'LOT-PCT-9011', destination: 'GETCO Substation Morbi', received: '2026-07-25', batch: 'PCT-B2026-0708', cost_inr: 14200000, dwell_hours: 48, berthing_vessel: 'Rickmers Hamburg' },
  { id: 'PCT-0012', cargo: 'Break Bulk', description: '12000 MT Iron Ore Pellets for Export to China', terminal: 'V.O.C. Tuticorin', quantity: 12000, unit: 'MT', gate_status: 'Loading', lot: 'LOT-PCT-9007', destination: 'NMDC Export Bay', received: '2026-07-25', batch: 'PCT-B2026-0707', cost_inr: 48000000, dwell_hours: 96, berthing_vessel: 'MV Pacific Fortune' },
  { id: 'PCT-0013', cargo: 'Tank Container', description: '20TK IMO5 Bitumen Heated Tank from Iran Bandar Abbas', terminal: 'Kandla Gandhidham', quantity: 5, unit: 'tanks', gate_status: 'Yard Placed', lot: 'LOT-PCT-9030', destination: 'Indian Oil Kandla', received: '2026-07-24', batch: 'PCT-B2026-0705', cost_inr: 7800000, dwell_hours: 36, berthing_vessel: 'IRISL Iran Shilan' },
  { id: 'PCT-0014', cargo: 'Ro-Ro Vehicle', description: '280 Units Hyundai Creta Export to Latin America', terminal: 'Chennai Ennore', quantity: 280, unit: 'vehicles', gate_status: 'Discharged', lot: 'LOT-PCT-9025', destination: 'Hyundai Port Chennai', received: '2026-07-24', batch: 'PCT-B2026-0704', cost_inr: 6200000, dwell_hours: 10, berthing_vessel: 'Glovis Cosmos' },
  { id: 'PCT-0015', cargo: 'TEU Container', description: '40HC Pharmaceutical Temperature Controlled EU GDP', terminal: 'Mundra Adani', quantity: 3, unit: 'containers', gate_status: 'Under Inspection', lot: 'LOT-PCT-9036', destination: 'Zydus API Ahmedabad', received: '2026-07-23', batch: 'PCT-B2026-0702', cost_inr: 9200000, dwell_hours: 52, berthing_vessel: 'Yang Ming Unity' },
  { id: 'PCT-0016', cargo: 'OOG Project', description: '280MT Bridge Girder Segment for Mumbai Trans-Harbour Link', terminal: 'JNPT Mumbai', quantity: 4, unit: 'segments', gate_status: 'Customs Released', lot: 'LOT-PCT-9024', destination: 'MTHL Casting Yard', received: '2026-07-23', batch: 'PCT-B2026-0701', cost_inr: 64000000, dwell_hours: 120, berthing_vessel: 'MV Heavy Lift Challenger' },
  { id: 'PCT-0017', cargo: 'Reefer Container', description: '40RF Basmati Rice Export to Saudi Arabia Jeddah Port', terminal: 'Kandla Gandhidham', quantity: 15, unit: 'containers', gate_status: 'Gate In', lot: 'LOT-PCT-9023', destination: 'KRBL Basmati Hub', received: '2026-07-22', batch: 'PCT-B2026-0629', cost_inr: 12600000, dwell_hours: 8, berthing_vessel: 'Maersk Sealand' },
  { id: 'PCT-0018', cargo: 'TEU Container', description: '20GP Auto Parts Brake Assembly Export to Thailand', terminal: 'Chennai Ennore', quantity: 20, unit: 'containers', gate_status: 'Loading', lot: 'LOT-PCT-9022', destination: 'Bosch Chennai Plant', received: '2026-07-22', batch: 'PCT-B2026-0628', cost_inr: 5400000, dwell_hours: 28, berthing_vessel: 'RCL Bengal' },
  { id: 'PCT-0019', cargo: 'Break Bulk', description: '8000 MT Fertilizer DAP Unloading from Morocco Jorf', terminal: 'Cochin Vallarpadam', quantity: 8000, unit: 'MT', gate_status: 'Discharged', lot: 'LOT-PCT-9010', destination: 'IFFCO Kochi Depot', received: '2026-07-21', batch: 'PCT-B2026-0625', cost_inr: 28000000, dwell_hours: 64, berthing_vessel: 'MV Fertilizer Express' },
  { id: 'PCT-0020', cargo: 'Flat Rack', description: '40FR Siemens Gas Turbine 120MW from Berlin', terminal: 'Mundra Adani', quantity: 1, unit: 'racks', gate_status: 'Under Inspection', lot: 'LOT-PCT-9021', destination: 'NTPC Mundra UMPP', received: '2026-07-21', batch: 'PCT-B2026-0624', cost_inr: 220000000, dwell_hours: 200, berthing_vessel: 'MV BigLift Fortune' },
]

const genRecords = (start: number) => {
  const statuses = ['Customs Released', 'Under Inspection', 'Gate In', 'Yard Placed', 'Loading', 'Discharged']
  const destinations = ['Nhava Sheva ICD', 'Chennai Cold Store', 'Kandla Wind Farm', 'Tata Steel Jamshedpur', 'BPCL Kochi Refinery', 'Neyveli Lignite Corp', 'Maruti Port Mundra', 'NPCIL Kudankulam']
  const vessels = ['MSC Anna', 'CMA CGM Titian', 'BBC Charter', 'NYK Apollo', 'Stena Superior', 'MV Ocean Tiger', 'Hoegh Autoliner', 'Dockwise Vanguard']
  return Array.from({ length: 40 }, (_, i) => ({
    id: `PCT-${String(start + i).padStart(4, '0')}`,
    cargo: CARGO_TYPES[(start + i) % 8],
    description: `${CARGO_TYPES[(start + i) % 8]} Lot ${String((start + i) % 99 + 1).padStart(3, '0')}`,
    terminal: TERMINALS[(start + i) % 8],
    quantity: Math.round(1 + Math.random() * 500),
    unit: ['containers', 'racks', 'tanks', 'MT', 'vehicles', 'modules', 'segments', 'units'][i % 8],
    gate_status: statuses[(start + i) % 6],
    lot: `LOT-PCT-${String(9021 + start + i)}`,
    destination: destinations[(start + i) % 8],
    received: `2026-07-${String(20 - Math.floor((start + i) / 10)).padStart(2, '0')}`,
    batch: `PCT-B2026-${String(624 - Math.floor((start + i) / 3)).padStart(4, '0')}`,
    cost_inr: Math.round(2000000 + Math.random() * 250000000),
    dwell_hours: Math.round(4 + Math.random() * 200),
    berthing_vessel: vessels[(start + i) % 8],
  }))
}

const allTerminal = [...terminalRecords, ...genRecords(21), ...genRecords(61)]

function ri(min: number, max: number, value: number) {
  return Math.max(min, Math.min(max, value))
}

const filterGroups = [
  {
    key: 'cargo',
    label: 'Cargo Type',
    options: CARGO_TYPES.map(t => ({ label: t, value: t, count: allTerminal.filter(r => r.cargo === t).length })),
  },
  {
    key: 'terminal',
    label: 'Terminal',
    options: TERMINALS.map(t => ({ label: t, value: t, count: allTerminal.filter(r => r.terminal === t).length })),
  },
  {
    key: 'gate_status',
    label: 'Gate Status',
    options: GATE_STATUS.map(s => ({ label: s, value: s, count: allTerminal.filter(r => r.gate_status === s).length })),
  },
]

function CargoBadge({ cargo }: { cargo: string }) {
  const colors: Record<string, string> = { 'TEU Container': 'bg-sky-100 text-sky-800', 'Reefer Container': 'bg-blue-100 text-blue-800', 'Flat Rack': 'bg-teal-100 text-teal-800', 'Open Top': 'bg-cyan-100 text-cyan-800', 'Tank Container': 'bg-orange-100 text-orange-800', 'Break Bulk': 'bg-amber-100 text-amber-800', 'Ro-Ro Vehicle': 'bg-indigo-100 text-indigo-800', 'OOG Project': 'bg-red-100 text-red-800' }
  return <span className={`pct-cargo-badge inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[cargo] || 'bg-gray-100 text-gray-800'}`}>{cargo}</span>
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = { 'Customs Released': 'bg-green-100 text-green-800', 'Under Inspection': 'bg-yellow-100 text-yellow-800', 'Gate In': 'bg-blue-100 text-blue-800', 'Yard Placed': 'bg-cyan-100 text-cyan-800', Loading: 'bg-indigo-100 text-indigo-800', Discharged: 'bg-gray-200 text-gray-700' }
  return <span className={`pct-status-badge inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-700'}`}>{status}</span>
}

function CostBar({ cost }: { cost: number }) {
  const pct = ri(0, 100, (cost / 250000000) * 100)
  const color = cost >= 150000000 ? 'bg-cyan-600' : cost >= 50000000 ? 'bg-cyan-500' : cost >= 10000000 ? 'bg-cyan-400' : 'bg-cyan-300'
  return <div className="pct-cost-bar flex items-center gap-2"><div className="h-2 w-20 rounded-full bg-gray-200"><div className={`pct-cost-bar-fill h-2 rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} /></div><span className="text-xs text-gray-500">{'₹' + (cost / 10000000).toFixed(1) + 'Cr'}</span></div>
}

function HealthRing({ value, label, color }: { value: number; label: string; color: string }) {
  const r = 28, cx = 35, cy = 35, sw = 5
  const circ = 2 * Math.PI * r
  const offset = circ - (ri(0, 100, value) / 100) * circ
  return <div className="pct-health-ring flex flex-col items-center"><svg width={70} height={70} className="-rotate-90"><circle cx={cx} cy={cy} r={r} fill="none" stroke="#e5e7eb" strokeWidth={sw} /><circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={sw} strokeDasharray={circ} strokeDashoffset={offset} className="pct-ring-path" strokeLinecap="round" /></svg><span className="pct-ring-value mt-1 text-sm font-bold" style={{ color }}>{value}%</span><span className="text-xs text-gray-500">{label}</span></div>
}

function KpiTile({ title, value, sub }: { title: string; value: string; sub: string }) {
  return <Card className="pct-kpi-card"><CardContent className="p-4"><p className="text-xs text-gray-500">{title}</p><p className="pct-kpi-value mt-1 text-2xl font-bold">{value}</p><p className="text-xs text-gray-400 mt-0.5">{sub}</p></CardContent></Card>
}

function ValueTile({ title, value, trend }: { title: string; value: string; trend: string }) {
  const up = trend.startsWith('+')
  return <Card className="pct-value-tile"><CardContent className="p-4"><p className="text-xs text-gray-500">{title}</p><p className="mt-1 text-xl font-bold">{value}</p><p className={`text-xs mt-0.5 ${up ? 'text-green-600' : 'text-red-500'}`}>{trend}</p></CardContent></Card>
}

export default function PortContainerTerminalView() {
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

  const filtered = allTerminal.filter(t => {
    const q = searchQuery.toLowerCase()
    if (q && !t.id.toLowerCase().includes(q) && !t.cargo.toLowerCase().includes(q) && !t.description.toLowerCase().includes(q) && !t.terminal.toLowerCase().includes(q) && !t.destination.toLowerCase().includes(q)) return false
    return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(t[key as keyof typeof t] as string))
  })

  const totalCost = allTerminal.reduce((s, t) => s + t.cost_inr, 0)
  const released = allTerminal.filter(t => t.gate_status === 'Customs Released').length
  const inspecting = allTerminal.filter(t => t.gate_status === 'Under Inspection').length

  const monthlyData = [
    { month: 'Jan', teu: 18500, throughput_mt: 280, dwell: 48 },
    { month: 'Feb', teu: 21200, throughput_mt: 340, dwell: 42 },
    { month: 'Mar', teu: 24800, throughput_mt: 420, dwell: 36 },
    { month: 'Apr', teu: 15800, throughput_mt: 220, dwell: 55 },
    { month: 'May', teu: 22100, throughput_mt: 380, dwell: 40 },
    { month: 'Jun', teu: 12400, throughput_mt: 180, dwell: 62 },
    { month: 'Jul', teu: 26500, throughput_mt: 460, dwell: 34 },
  ]
  const cargoData = CARGO_TYPES.map(t => ({ cargo: t, count: allTerminal.filter(r => r.cargo === t).length }))
  const terminalData = TERMINALS.map(t => ({ terminal: t, count: allTerminal.filter(r => r.terminal === t).length }))

  const tabs = [
    { value: 'dashboard', label: 'Dashboard' },
    { value: 'operations', label: 'Operations' },
    { value: 'analytics', label: 'Analytics' },
    { value: 'insights', label: 'Insights' },
  ]

  return (
    <div className="pct-container space-y-4">
      <PageHeader title="Port Container Terminal" description="Multi-cargo port terminal operations with customs ICEGATE integration, ERP vessel berthing optimization, container yard stacking automation, and AIS-based vessel tracking across India's 12 major ports and 200+ minor ports" />
      <ModuleBreadcrumb items={[{ label: 'Port Operations' }, { label: 'Container Terminal' }]} />
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="pct-tabs-list">
          {tabs.map(t => <TabsTrigger key={t.value} value={t.value} className="pct-tab-trigger">{t.label}</TabsTrigger>)}
        </TabsList>

        <TabsContent value="dashboard" className="pct-tab-content space-y-4 mt-4">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <KpiTile title="Total Movements" value={allTerminal.length.toString()} sub="Cargo handling records" />
            <KpiTile title="Total Value" value={`₹${(totalCost / 10000000).toFixed(0)}Cr`} sub="Cargo throughput value" />
            <KpiTile title="Customs Released" value={released.toString()} sub={`${((released / allTerminal.length) * 100).toFixed(0)}% cleared`} />
            <KpiTile title="Under Inspection" value={inspecting.toString()} sub="Pending customs check" />
          </div>
          <div className="grid gap-4 grid-cols-3 md:grid-cols-6">
            <HealthRing value={94} label="Berth Utilization" color="#0e7490" />
            <HealthRing value={88} label="Yard Occupancy" color="#155e75" />
            <HealthRing value={96} label="Gate Turnaround" color="#0891b2" />
            <HealthRing value={82} label="Crane Availability" color="#164e63" />
            <HealthRing value={91} label="Customs Speed" color="#0c4a6e" />
            <HealthRing value={97} label="Vessel On-Time" color="#22d3ee" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="pct-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Monthly TEU Throughput & Dwell Hours</CardTitle></CardHeader><CardContent><LineChart data={monthlyData} width={300} height={200}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" fontSize={12} /><YAxis fontSize={12} /><Tooltip /><Legend /><Line type="monotone" dataKey="teu" stroke="#0e7490" strokeWidth={2} /><Line type="monotone" dataKey="dwell" stroke="#155e75" strokeWidth={2} strokeDasharray="5 5" /></LineChart></CardContent></Card>
            <Card className="pct-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Cargo Type Distribution</CardTitle></CardHeader><CardContent><BarChart data={cargoData} width={300} height={200}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="cargo" fontSize={10} angle={-30} textAnchor="end" height={50} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="count" fill="#0e7490" radius={[4,4,0,0]} /></BarChart></CardContent></Card>
            <Card className="pct-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Terminal Handling Volume</CardTitle></CardHeader><CardContent><PieChart width={300} height={200}><Pie data={terminalData} dataKey="count" nameKey="terminal" cx="50%" cy="50%" outerRadius={70} label={({ terminal, count }) => `${count}`}>{terminalData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="operations" className="pct-tab-content space-y-4 mt-4">
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={allTerminal.length} filteredCount={filtered.length} onRefresh={() => {}} placeholder="Search by ID, cargo type, terminal, destination, or vessel..." />
          <div className="overflow-x-auto rounded-lg border">
            <table className="pct-table w-full text-sm">
              <thead><tr className="pct-table-header bg-gray-50"><th className="px-3 py-2 text-left font-medium">ID</th><th className="px-3 py-2 text-left font-medium">Cargo</th><th className="px-3 py-2 text-left font-medium">Status</th><th className="px-3 py-2 text-left font-medium">Qty</th><th className="px-3 py-2 text-left font-medium">Value</th><th className="px-3 py-2 text-left font-medium">Terminal</th><th className="px-3 py-2 text-left font-medium">Vessel</th><th className="px-3 py-2 text-left font-medium">Lot</th><th className="px-3 py-2 text-left font-medium">Dwell(h)</th></tr></thead>
              <tbody>{filtered.slice(0, 20).map(t => (
                <tr key={t.id} className="pct-table-row border-t hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-2 font-mono text-xs">{t.id}</td>
                  <td className="px-3 py-2"><CargoBadge cargo={t.cargo} /></td>
                  <td className="px-3 py-2"><StatusBadge status={t.gate_status} /></td>
                  <td className="px-3 py-2 text-xs">{t.quantity.toLocaleString('en-IN')} {t.unit}</td>
                  <td className="px-3 py-2"><CostBar cost={t.cost_inr} /></td>
                  <td className="px-3 py-2 text-xs">{t.terminal}</td>
                  <td className="px-3 py-2 text-xs">{t.berthing_vessel}</td>
                  <td className="px-3 py-2 text-xs font-mono">{t.lot}</td>
                  <td className="px-3 py-2 text-xs">{t.dwell_hours}h</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="pct-tab-content space-y-4 mt-4">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <ValueTile title="Avg Dwell Time" value="38.4h" trend="-8.2% improved" />
            <ValueTile title="TEU Throughput" value="26.5K" trend="+14.6% vs Jun" />
            <ValueTile title="Berth Productivity" value="82 MPH" trend="+3.1% gain" />
            <ValueTile title="Revenue Per TEU" value="₹4.2L" trend="+6.8% higher" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="pct-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Value by Cargo Category</CardTitle></CardHeader><CardContent><BarChart data={CARGO_TYPES.map(t => ({ cargo: t, total: allTerminal.filter(r => r.cargo === t).reduce((s, r) => s + r.cost_inr, 0) / 10000000 }))} width={400} height={250}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="cargo" fontSize={10} angle={-30} textAnchor="end" height={50} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="total" fill="#155e75" radius={[4,4,0,0]} /></BarChart></CardContent></Card>
            <Card className="pct-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Gate Status Breakdown</CardTitle></CardHeader><CardContent><PieChart width={400} height={250}><Pie data={GATE_STATUS.map(s => ({ status: s, count: allTerminal.filter(t => t.gate_status === s).length }))} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={80} label>{GATE_STATUS.map((_, i) => <Cell key={i} fill={['#22c55e','#eab308','#3b82f6','#06b6d4','#6366f1','#9ca3af'][i]} />)}</Pie><Tooltip /></PieChart></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="pct-tab-content space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="pct-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">ICEGATE Customs Automation & RFID Port Gate</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Indian Customs EDI System (ICEGATE) integration enabling ACES/AFR automated risk assessment for 100% of container manifests. RFID-based port gate automation at JNPT, Mundra, and Chennai reducing truck turnaround time from 8 hours to 45 minutes. Direct Port Delivery (DPD) and Direct Port Entry (DPE) facility processing 68% of import containers without CFS intervention. Integration with Indian Port Association (IPA) vessel movement database for real-time ETA predictions across 12 major ports.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-cyan-100 px-2 py-0.5 text-cyan-800">Critical</span><span className="text-gray-400">Live</span></div></CardContent></Card>
            <Card className="pct-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">Sagarmala Port-Led Development Berth Optimization</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Sagarmala Programme monitored berthing optimization across 12 major ports handling 95% of India's external trade by volume. Real-time tidal and weather-based berthing window optimization reducing vessel waiting time by 22%. Automated quay crane scheduling powered by AI berth allocation engine processing 850+ vessel calls per month at JNPT alone. Integration with Shipping Corporation of India (SCI) fleet management for coordinated port arrival scheduling. Landlord port model implementation tracking 36 PPP-operated berths across Adani, DP World, and APM Terminals.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-teal-100 px-2 py-0.5 text-teal-800">Strategic</span><span className="text-gray-400">FY2027</span></div></CardContent></Card>
            <Card className="pct-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">Container Yard Block Stacking & RTG Crane AI</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>AI-powered container yard stacking optimization reducing rehandle operations by 35% across 8 terminal operators. Real-time RTG (Rubber Tyred Gantry) crane deployment algorithm minimizing container dwell time below 72-hour SLA for 92% of TEUs. Automated gate-in OCR truck licence plate recognition integrated with Vahan database for registered logistics fleet. Integration with Concor ICD network tracking 42 inland container depots feeding freight to 8 major seaports. Digital twin simulation of yard capacity enabling proactive overflow planning during peak season.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-sky-100 px-2 py-0.5 text-sky-800">Operational</span><span className="text-gray-400">Q3 2026</span></div></CardContent></Card>
            <Card className="pct-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">AIS Vessel Tracking & Just-In-Time Arrival</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Automatic Identification System (AIS) real-time vessel tracking covering 95% of commercial vessels within 50 nautical miles of Indian coast. Just-In-Time (JIT) arrival coordination between port authority, terminal operator, and shipping line reducing bunker consumption by 12%. Predictive ETA model achieving 94% accuracy within 4-hour window using machine learning on historical AIS data, monsoon patterns, and port congestion indices. Integration with Indian Navy and Coast Guard for maritime security alerting on anomalous vessel movements near port approaches.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-blue-800">Innovation</span><span className="text-gray-400">Pilot</span></div></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
