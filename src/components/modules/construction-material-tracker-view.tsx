import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#ea580c', '#c2410c', '#f97316', '#fb923c', '#fdba74', '#9a3412', '#7c2d12', '#fed7aa']

const MATERIAL_TYPES = ['Cement', 'Steel Rebar', 'Bricks', 'Sand', 'Aggregates', 'Timber', 'Tiles', 'Electrical Conduit']
const PROJECT_SITES = ['Mumbai Metro Line 9', 'Delhi Smart City', 'Bengaluru Airport T3', 'Hyderabad IT Corridor', 'Chennai Port Expansion', 'Pune Highway NH48', 'Kolkata Bridge Project', 'Nagpur MIHAN']
const DELIVERY_STATUS = ['On Schedule', 'Delayed', 'Delivered', 'In Transit', 'Quality Hold', 'Cancelled']

const materials = [
  { id: 'CMT-0001', material: 'Cement', supplier: 'UltraTech Cement', quantity: 5000, unit: 'bags', site: 'Mumbai Metro Line 9', status: 'In Transit', po_number: 'PO-2026-08451', received: '2026-07-30', truck_id: 'MH-12-AB1234', grade: 'OPC 53', eta: '2026-07-31', cost_inr: 1750000 },
  { id: 'CMT-0002', material: 'Steel Rebar', supplier: 'TATA Steel', quantity: 120, unit: 'MT', site: 'Delhi Smart City', status: 'On Schedule', po_number: 'PO-2026-08452', received: '2026-07-30', truck_id: 'HR-26-CD5678', grade: 'Fe500D TMT', eta: '2026-08-02', cost_inr: 8400000 },
  { id: 'CMT-0003', material: 'Bricks', supplier: 'JK Bricks', quantity: 50000, unit: 'pcs', site: 'Bengaluru Airport T3', status: 'Delivered', po_number: 'PO-2026-08453', received: '2026-07-29', truck_id: 'KA-01-EF9012', grade: 'A-Class', eta: '-', cost_inr: 375000 },
  { id: 'CMT-0004', material: 'Sand', supplier: 'River Sand Co', quantity: 200, unit: 'cum', site: 'Hyderabad IT Corridor', status: 'Delayed', po_number: 'PO-2026-08454', received: '2026-07-29', truck_id: 'TS-08-GH3456', grade: 'River Washed', eta: '2026-08-03', cost_inr: 420000 },
  { id: 'CMT-0005', material: 'Aggregates', supplier: 'Lafarge Aggregates', quantity: 350, unit: 'MT', site: 'Chennai Port Expansion', status: 'On Schedule', po_number: 'PO-2026-08455', received: '2026-07-28', truck_id: 'TN-33-IJ7890', grade: '20mm M-Sand', eta: '2026-08-01', cost_inr: 525000 },
  { id: 'CMT-0006', material: 'Timber', supplier: 'Century Ply', quantity: 800, unit: 'sqft', site: 'Pune Highway NH48', status: 'Quality Hold', po_number: 'PO-2026-08456', received: '2026-07-28', truck_id: 'MH-14-KL1234', grade: 'Teak B-Grade', eta: '-', cost_inr: 960000 },
  { id: 'CMT-0007', material: 'Tiles', supplier: 'Kajaria Ceramics', quantity: 3000, unit: 'sqm', site: 'Kolkata Bridge Project', status: 'In Transit', po_number: 'PO-2026-08457', received: '2026-07-27', truck_id: 'WB-22-MN5678', grade: 'Vitrified 800x800', eta: '2026-07-30', cost_inr: 1440000 },
  { id: 'CMT-0008', material: 'Electrical Conduit', supplier: 'Polycab India', quantity: 15000, unit: 'm', site: 'Nagpur MIHAN', status: 'Delivered', po_number: 'PO-2026-08458', received: '2026-07-27', truck_id: 'MH-31-OP9012', grade: 'ISI HDPE', eta: '-', cost_inr: 225000 },
  { id: 'CMT-0009', material: 'Cement', supplier: 'Ambuja Cement', quantity: 8000, unit: 'bags', site: 'Delhi Smart City', status: 'On Schedule', po_number: 'PO-2026-08459', received: '2026-07-26', truck_id: 'RJ-20-QR3456', grade: 'PPC 43', eta: '2026-08-04', cost_inr: 2640000 },
  { id: 'CMT-0010', material: 'Steel Rebar', supplier: 'SAIL Bhilai', quantity: 80, unit: 'MT', site: 'Mumbai Metro Line 9', status: 'In Transit', po_number: 'PO-2026-08460', received: '2026-07-26', truck_id: 'CG-04-ST7890', grade: 'Fe500D TMT', eta: '2026-07-31', cost_inr: 5600000 },
  { id: 'CMT-0011', material: 'Bricks', supplier: 'Birla AAC', quantity: 2000, unit: 'blocks', site: 'Hyderabad IT Corridor', status: 'Delivered', po_number: 'PO-2026-08461', received: '2026-07-25', truck_id: 'TS-09-UV1234', grade: 'AAC 600x200', eta: '-', cost_inr: 480000 },
  { id: 'CMT-0012', material: 'Sand', supplier: 'Robo Silicon', quantity: 150, unit: 'cum', site: 'Bengaluru Airport T3', status: 'On Schedule', po_number: 'PO-2026-08462', received: '2026-07-25', truck_id: 'KA-41-WX5678', grade: 'M-Sand P-II', eta: '2026-08-02', cost_inr: 375000 },
  { id: 'CMT-0013', material: 'Aggregates', supplier: 'UltraTech Aggregates', quantity: 500, unit: 'MT', site: 'Kolkata Bridge Project', status: 'Cancelled', po_number: 'PO-2026-08463', received: '2026-07-24', truck_id: '-', grade: '40mm WMM', eta: '-', cost_inr: 0 },
  { id: 'CMT-0014', material: 'Timber', supplier: 'Greenply Industries', quantity: 1200, unit: 'sqft', site: 'Chennai Port Expansion', status: 'In Transit', po_number: 'PO-2026-08464', received: '2026-07-24', truck_id: 'TN-07-YZ9012', grade: 'Sal Wood A', eta: '2026-07-29', cost_inr: 1800000 },
  { id: 'CMT-0015', material: 'Tiles', supplier: 'Somany Ceramics', quantity: 1500, unit: 'sqm', site: 'Pune Highway NH48', status: 'Delayed', po_number: 'PO-2026-08465', received: '2026-07-23', truck_id: 'MH-15-AB3456', grade: 'GVT 600x600', eta: '2026-08-05', cost_inr: 675000 },
  { id: 'CMT-0016', material: 'Electrical Conduit', supplier: 'Finolex Cables', quantity: 8000, unit: 'm', site: 'Delhi Smart City', status: 'Delivered', po_number: 'PO-2026-08466', received: '2026-07-23', truck_id: 'HR-26-CD7890', grade: 'PVC 25mm', eta: '-', cost_inr: 160000 },
  { id: 'CMT-0017', material: 'Cement', supplier: 'Dalmia Cement', quantity: 6000, unit: 'bags', site: 'Hyderabad IT Corridor', status: 'On Schedule', po_number: 'PO-2026-08467', received: '2026-07-22', truck_id: 'TS-10-EF9012', grade: 'OPC 43', eta: '2026-08-03', cost_inr: 1980000 },
  { id: 'CMT-0018', material: 'Steel Rebar', supplier: 'JSW Steel', quantity: 200, unit: 'MT', site: 'Chennai Port Expansion', status: 'Quality Hold', po_number: 'PO-2026-08468', received: '2026-07-22', truck_id: 'TN-22-GH3456', grade: 'Fe550D TMT', eta: '-', cost_inr: 14000000 },
  { id: 'CMT-0019', material: 'Sand', supplier: 'M-Sand India', quantity: 300, unit: 'cum', site: 'Mumbai Metro Line 9', status: 'Delivered', po_number: 'PO-2026-08469', received: '2026-07-21', truck_id: 'MH-02-IJ7890', grade: 'M-Sand P-I', eta: '-', cost_inr: 660000 },
  { id: 'CMT-0020', material: 'Bricks', supplier: 'Red Clay Bricks', quantity: 100000, unit: 'pcs', site: 'Kolkata Bridge Project', status: 'On Schedule', po_number: 'PO-2026-08470', received: '2026-07-21', truck_id: 'WB-11-KL1234', grade: 'Red Clay 1st', eta: '2026-08-06', cost_inr: 600000 },
]

const genRecords = (start: number) => {
  const statuses = ['On Schedule', 'Delayed', 'Delivered', 'In Transit', 'Quality Hold', 'Cancelled']
  const suppliers = ['UltraTech Cement', 'TATA Steel', 'JK Bricks', 'Lafarge Aggregates', 'Century Ply', 'Kajaria Ceramics', 'Polycab India', 'SAIL Bhilai']
  return Array.from({ length: 40 }, (_, i) => ({
    id: `CMT-${String(start + i).padStart(4, '0')}`,
    material: MATERIAL_TYPES[(start + i) % 8],
    supplier: suppliers[(start + i) % 8],
    quantity: Math.round(50 + Math.random() * 99950),
    unit: ['bags', 'MT', 'pcs', 'cum', 'sqft', 'sqm', 'm'][i % 7],
    site: PROJECT_SITES[(start + i) % 8],
    status: statuses[(start + i) % 6],
    po_number: `PO-2026-${String(8470 + start + i).padStart(5, '0')}`,
    received: `2026-07-${String(20 - Math.floor((start + i) / 10)).padStart(2, '0')}`,
    truck_id: Math.random() > 0.1 ? `XX-00-${String(start + i).padStart(4, '0')}` : '-',
    grade: `Grade ${String.fromCharCode(65 + (start + i) % 5)}`,
    eta: statuses[(start + i) % 6] === 'Delivered' || statuses[(start + i) % 6] === 'Cancelled' ? '-' : `2026-08-${String(((start + i) % 10) + 1).padStart(2, '0')}`,
    cost_inr: Math.round(100000 + Math.random() * 10000000),
  }))
}

const allMaterials = [...materials, ...genRecords(21), ...genRecords(61)]

function ri(min: number, max: number, value: number) {
  return Math.max(min, Math.min(max, value))
}

const filterGroups = [
  {
    key: 'material',
    label: 'Material Type',
    options: MATERIAL_TYPES.map(m => ({ label: m, value: m, count: allMaterials.filter(d => d.material === m).length })),
  },
  {
    key: 'site',
    label: 'Project Site',
    options: PROJECT_SITES.map(s => ({ label: s, value: s, count: allMaterials.filter(d => d.site === s).length })),
  },
  {
    key: 'status',
    label: 'Delivery Status',
    options: DELIVERY_STATUS.map(s => ({ label: s, value: s, count: allMaterials.filter(d => d.status === s).length })),
  },
]

function MaterialBadge({ material }: { material: string }) {
  const colors: Record<string, string> = { Cement: 'bg-gray-200 text-gray-800', 'Steel Rebar': 'bg-slate-300 text-slate-800', Bricks: 'bg-red-100 text-red-800', Sand: 'bg-amber-100 text-amber-800', Aggregates: 'bg-stone-200 text-stone-800', Timber: 'bg-yellow-100 text-yellow-800', Tiles: 'bg-orange-100 text-orange-800', 'Electrical Conduit': 'bg-blue-100 text-blue-800' }
  return <span className={`cmt-material-badge inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[material] || 'bg-gray-100 text-gray-800'}`}>{material}</span>
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = { 'On Schedule': 'bg-green-100 text-green-800', Delayed: 'bg-red-100 text-red-800', Delivered: 'bg-emerald-100 text-emerald-800', 'In Transit': 'bg-blue-100 text-blue-800', 'Quality Hold': 'bg-amber-100 text-amber-800', Cancelled: 'bg-gray-200 text-gray-600' }
  return <span className={`cmt-status-badge inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-700'}`}>{status}</span>
}

function CostBar({ cost }: { cost: number }) {
  const pct = ri(0, 100, (cost / 15000000) * 100)
  const color = cost >= 10000000 ? 'bg-orange-600' : cost >= 5000000 ? 'bg-orange-500' : cost >= 1000000 ? 'bg-orange-400' : 'bg-orange-300'
  return <div className="cmt-cost-bar flex items-center gap-2"><div className="h-2 w-20 rounded-full bg-gray-200"><div className={`cmt-cost-bar-fill h-2 rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} /></div><span className="text-xs text-gray-500">{'₹' + (cost / 100000).toFixed(1) + 'L'}</span></div>
}

function HealthRing({ value, label, color }: { value: number; label: string; color: string }) {
  const r = 28, cx = 35, cy = 35, sw = 5
  const circ = 2 * Math.PI * r
  const offset = circ - (ri(0, 100, value) / 100) * circ
  return <div className="cmt-health-ring flex flex-col items-center"><svg width={70} height={70} className="-rotate-90"><circle cx={cx} cy={cy} r={r} fill="none" stroke="#e5e7eb" strokeWidth={sw} /><circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={sw} strokeDasharray={circ} strokeDashoffset={offset} className="cmt-ring-path" strokeLinecap="round" /></svg><span className="cmt-ring-value mt-1 text-sm font-bold" style={{ color }}>{value}%</span><span className="text-xs text-gray-500">{label}</span></div>
}

function KpiTile({ title, value, sub }: { title: string; value: string; sub: string }) {
  return <Card className="cmt-kpi-card"><CardContent className="p-4"><p className="text-xs text-gray-500">{title}</p><p className="cmt-kpi-value mt-1 text-2xl font-bold">{value}</p><p className="text-xs text-gray-400 mt-0.5">{sub}</p></CardContent></Card>
}

function ValueTile({ title, value, trend }: { title: string; value: string; trend: string }) {
  const up = trend.startsWith('+')
  return <Card className="cmt-value-tile"><CardContent className="p-4"><p className="text-xs text-gray-500">{title}</p><p className="mt-1 text-xl font-bold">{value}</p><p className={`text-xs mt-0.5 ${up ? 'text-green-600' : 'text-red-500'}`}>{trend}</p></CardContent></Card>
}

export default function ConstructionMaterialTrackerView() {
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

  const filtered = allMaterials.filter(d => {
    const q = searchQuery.toLowerCase()
    if (q && !d.id.toLowerCase().includes(q) && !d.material.toLowerCase().includes(q) && !d.supplier.toLowerCase().includes(q) && !d.site.toLowerCase().includes(q) && !d.po_number.toLowerCase().includes(q)) return false
    return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(d[key as keyof typeof d] as string))
  })

  const totalCost = allMaterials.reduce((s, d) => s + d.cost_inr, 0)
  const onSchedule = allMaterials.filter(d => d.status === 'On Schedule').length
  const delayed = allMaterials.filter(d => d.status === 'Delayed').length
  const delivered = allMaterials.filter(d => d.status === 'Delivered').length

  const monthlyData = [
    { month: 'Jan', orders: 85, cost_cr: 42, onTime: 78 },
    { month: 'Feb', orders: 92, cost_cr: 48, onTime: 84 },
    { month: 'Mar', orders: 110, cost_cr: 62, onTime: 95 },
    { month: 'Apr', orders: 98, cost_cr: 55, onTime: 88 },
    { month: 'May', orders: 75, cost_cr: 38, onTime: 68 },
    { month: 'Jun', orders: 65, cost_cr: 32, onTime: 58 },
    { month: 'Jul', orders: 120, cost_cr: 72, onTime: 105 },
  ]
  const materialData = MATERIAL_TYPES.map(m => ({ material: m, count: allMaterials.filter(d => d.material === m).length }))
  const siteData = PROJECT_SITES.map(s => ({ site: s.replace(/\s/g, '\n'), count: allMaterials.filter(d => d.site === s).length }))

  const tabs = [
    { value: 'dashboard', label: 'Dashboard' },
    { value: 'materials', label: 'Materials' },
    { value: 'analytics', label: 'Analytics' },
    { value: 'insights', label: 'Insights' },
  ]

  return (
    <div className="cmt-container space-y-4">
      <PageHeader title="Construction Material Tracker" description="Infrastructure project material tracking, supplier coordination, quality inspection, and cost management for large-scale construction sites across India" />
      <ModuleBreadcrumb items={[{ label: 'Project Logistics' }, { label: 'Construction Materials' }]} />
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="cmt-tabs-list">
          {tabs.map(t => <TabsTrigger key={t.value} value={t.value} className="cmt-tab-trigger">{t.label}</TabsTrigger>)}
        </TabsList>

        <TabsContent value="dashboard" className="cmt-tab-content space-y-4 mt-4">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <KpiTile title="Total Orders" value={allMaterials.length.toString()} sub="Active POs" />
            <KpiTile title="Total Cost" value={`₹${(totalCost / 10000000).toFixed(1)}Cr`} sub="Procurement value" />
            <KpiTile title="On Schedule" value={onSchedule.toString()} sub={`${((onSchedule / allMaterials.length) * 100).toFixed(0)}% on-time`} />
            <KpiTile title="Delivered" value={delivered.toString()} sub="Completed orders" />
          </div>
          <div className="grid gap-4 grid-cols-3 md:grid-cols-6">
            <HealthRing value={92} label="On-Time Delivery" color="#ea580c" />
            <HealthRing value={87} label="Quality Pass" color="#c2410c" />
            <HealthRing value={94} label="Supplier Rating" color="#f97316" />
            <HealthRing value={78} label="Cost Efficiency" color="#9a3412" />
            <HealthRing value={96} label="PO Compliance" color="#7c2d12" />
            <HealthRing value={89} label="Site Readiness" color="#fb923c" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="cmt-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Monthly Orders & Cost</CardTitle></CardHeader><CardContent><LineChart data={monthlyData} width={300} height={200}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" fontSize={12} /><YAxis fontSize={12} /><Tooltip /><Legend /><Line type="monotone" dataKey="orders" stroke="#ea580c" strokeWidth={2} /><Line type="monotone" dataKey="onTime" stroke="#c2410c" strokeWidth={2} strokeDasharray="5 5" /></LineChart></CardContent></Card>
            <Card className="cmt-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Orders by Material</CardTitle></CardHeader><CardContent><BarChart data={materialData} width={300} height={200}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="material" fontSize={10} angle={-30} textAnchor="end" height={50} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="count" fill="#ea580c" radius={[4,4,0,0]} /></BarChart></CardContent></Card>
            <Card className="cmt-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Site Distribution</CardTitle></CardHeader><CardContent><PieChart width={300} height={200}><Pie data={siteData} dataKey="count" nameKey="site" cx="50%" cy="50%" outerRadius={70} label={({ count }) => `${count}`}>{siteData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="materials" className="cmt-tab-content space-y-4 mt-4">
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={allMaterials.length} filteredCount={filtered.length} onRefresh={() => {}} placeholder="Search by ID, material, supplier, site, or PO number..." />
          <div className="overflow-x-auto rounded-lg border">
            <table className="cmt-table w-full text-sm">
              <thead><tr className="cmt-table-header bg-gray-50"><th className="px-3 py-2 text-left font-medium">ID</th><th className="px-3 py-2 text-left font-medium">Material</th><th className="px-3 py-2 text-left font-medium">Supplier</th><th className="px-3 py-2 text-left font-medium">Site</th><th className="px-3 py-2 text-left font-medium">Status</th><th className="px-3 py-2 text-left font-medium">Quantity</th><th className="px-3 py-2 text-left font-medium">Cost</th><th className="px-3 py-2 text-left font-medium">Grade</th><th className="px-3 py-2 text-left font-medium">ETA</th></tr></thead>
              <tbody>{filtered.slice(0, 20).map(d => (
                <tr key={d.id} className="cmt-table-row border-t hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-2 font-mono text-xs">{d.id}</td>
                  <td className="px-3 py-2"><MaterialBadge material={d.material} /></td>
                  <td className="px-3 py-2 text-xs">{d.supplier}</td>
                  <td className="px-3 py-2 text-xs">{d.site}</td>
                  <td className="px-3 py-2"><StatusBadge status={d.status} /></td>
                  <td className="px-3 py-2 text-xs">{d.quantity.toLocaleString('en-IN')} {d.unit}</td>
                  <td className="px-3 py-2"><CostBar cost={d.cost_inr} /></td>
                  <td className="px-3 py-2 text-xs">{d.grade}</td>
                  <td className="px-3 py-2 text-xs">{d.eta}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="cmt-tab-content space-y-4 mt-4">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <ValueTile title="Avg Order Value" value="₹4.8L" trend="+9.5% vs last quarter" />
            <ValueTile title="Delay Rate" value="8.2%" trend="-3.1% improved" />
            <ValueTile title="Quality Rejection" value="2.4%" trend="-0.8% reduced" />
            <ValueTile title="Supplier Score" value="4.5/5" trend="+0.2 improved" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="cmt-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Material Cost Breakdown</CardTitle></CardHeader><CardContent><BarChart data={MATERIAL_TYPES.map(m => ({ material: m, total: allMaterials.filter(d => d.material === m).reduce((s, d) => s + d.cost_inr, 0) / 10000000 }))} width={400} height={250}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="material" fontSize={10} angle={-30} textAnchor="end" height={50} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="total" fill="#c2410c" radius={[4,4,0,0]} /></BarChart></CardContent></Card>
            <Card className="cmt-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Status Breakdown</CardTitle></CardHeader><CardContent><PieChart width={400} height={250}><Pie data={DELIVERY_STATUS.map(s => ({ status: s, count: allMaterials.filter(d => d.status === s).length }))} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={80} label>{DELIVERY_STATUS.map((_, i) => <Cell key={i} fill={['#22c55e','#ef4444','#10b981','#3b82f6','#f59e0b','#9ca3af'][i]} />)}</Pie><Tooltip /></PieChart></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="cmt-tab-content space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="cmt-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">Bharatmala Pariyojana Material Pipeline</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Integration with NHAI Bharatmala Phase-II project covering 12,000 km of national highways. Automated material forecasting based on construction milestones and Gantt chart progress. Real-time tracking of 847 active POs across 28 project sites. Monthly procurement savings of 8.5% through consolidated bulk ordering.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-orange-100 px-2 py-0.5 text-orange-800">Critical</span><span className="text-gray-400">Live</span></div></CardContent></Card>
            <Card className="cmt-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">Drone-Based Site Inventory Audit</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>DJI Matrice drones with LiDAR sensors performing weekly site inventory counts at 8 project locations. Volume estimation accuracy of 97.3% for sand, aggregate, and earthwork stockpiles. Automated reconciliation with ERP procurement records, flagging 12% discrepancy between delivered and on-site quantities.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-amber-800">Operational</span><span className="text-gray-400">Q3 2026</span></div></CardContent></Card>
            <Card className="cmt-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">RMC Ready-Mix Concrete Tracking</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>GPS-enabled transit mixer tracking for Ready-Mix Concrete from 5 batching plants across Mumbai-Pune corridor. Real-time slump monitoring and temperature sensors ensure concrete quality during 90-minute delivery window. Integration with NDT testing labs for automated cube strength reporting at 7/28 day intervals.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5 text-yellow-800">Growth</span><span className="text-gray-400">FY2027</span></div></CardContent></Card>
            <Card className="cmt-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">AI-Powered Demand Forecasting</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Machine learning models trained on 3 years of project data predicting material requirements 6 weeks ahead with 89% accuracy. Seasonal adjustment for monsoon-related delays in sand and aggregate supply. Auto-generates purchase recommendations when inventory drops below 2-week safety stock threshold.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-stone-200 px-2 py-0.5 text-stone-800">Innovation</span><span className="text-gray-400">Pilot</span></div></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
