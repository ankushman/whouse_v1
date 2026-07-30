import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#0284c7', '#0369a1', '#0ea5e9', '#38bdf8', '#7dd3fc', '#075985', '#0c4a6e', '#bae6fd']

const PART_TYPES = ['Engine Components', 'Brake Systems', 'Transmission', 'Electrical Harness', 'Suspension Parts', 'Body Panels', 'Exhaust Systems', 'Wheel Bearings']
const OEM_MANUFACTURERS = ['Maruti Suzuki', 'Tata Motors', 'Mahindra', 'Hyundai India', 'Honda Cars', 'Toyota Kirloskar', 'Kia India', 'MG Motor']
const INSPECTION_STATUS = ['Passed', 'Pending QC', 'Failed', 'Re-Inspection', 'Quarantine', 'Certified']

const parts = [
  { id: 'AUP-0001', part: 'Engine Components', description: 'MPI Cylinder Head Assembly 1.5L', oem: 'Maruti Suzuki', quantity: 120, unit: 'pcs', status: 'Certified', warehouse: 'Gurugram DC-1', po: 'PO-AUTO-28451', received: '2026-07-30', batch: 'BH-2026-0721', cost_inr: 2880000, lead_time_days: 14 },
  { id: 'AUP-0002', part: 'Brake Systems', description: 'ABS Module Bosch 9.0 Gen3', oem: 'Tata Motors', quantity: 85, unit: 'pcs', status: 'Passed', warehouse: 'Pune DC-2', po: 'PO-AUTO-28452', received: '2026-07-30', batch: 'BH-2026-0722', cost_inr: 2125000, lead_time_days: 10 },
  { id: 'AUP-0003', part: 'Transmission', description: 'CVT Gearbox Unit FWD', oem: 'Honda Cars', quantity: 40, unit: 'sets', status: 'Pending QC', warehouse: 'Chennai DC-3', po: 'PO-AUTO-28453', received: '2026-07-29', batch: 'BH-2026-0719', cost_inr: 5200000, lead_time_days: 21 },
  { id: 'AUP-0004', part: 'Electrical Harness', description: 'Wiring Harness Dashboard LHD', oem: 'Hyundai India', quantity: 500, unit: 'pcs', status: 'Passed', warehouse: 'Sriperumbudur DC', po: 'PO-AUTO-28454', received: '2026-07-29', batch: 'BH-2026-0718', cost_inr: 975000, lead_time_days: 7 },
  { id: 'AUP-0005', part: 'Suspension Parts', description: 'MacPherson Strut Assembly Front', oem: 'Mahindra', quantity: 200, unit: 'sets', status: 'Failed', warehouse: 'Nashik DC-4', po: 'PO-AUTO-28455', received: '2026-07-28', batch: 'BH-2026-0716', cost_inr: 1600000, lead_time_days: 12 },
  { id: 'AUP-0006', part: 'Body Panels', description: 'Front Bumper PP+EPDM Painted', oem: 'Kia India', quantity: 300, unit: 'pcs', status: 'Re-Inspection', warehouse: 'Anantapur DC-5', po: 'PO-AUTO-28456', received: '2026-07-28', batch: 'BH-2026-0715', cost_inr: 810000, lead_time_days: 8 },
  { id: 'AUP-0007', part: 'Exhaust Systems', description: 'Catalytic Converter Euro 6', oem: 'Toyota Kirloskar', quantity: 150, unit: 'pcs', status: 'Certified', warehouse: 'Bangalore DC-6', po: 'PO-AUTO-28457', received: '2026-07-27', batch: 'BH-2026-0714', cost_inr: 3375000, lead_time_days: 18 },
  { id: 'AUP-0008', part: 'Wheel Bearings', description: 'Hub Bearing Assembly 60mm Gen3', oem: 'MG Motor', quantity: 1000, unit: 'pcs', status: 'Passed', warehouse: 'Halol DC-7', po: 'PO-AUTO-28458', received: '2026-07-27', batch: 'BH-2026-0713', cost_inr: 650000, lead_time_days: 5 },
  { id: 'AUP-0009', part: 'Engine Components', description: 'Piston Ring Set 75mm Forged', oem: 'Tata Motors', quantity: 600, unit: 'sets', status: 'Pending QC', warehouse: 'Gurugram DC-1', po: 'PO-AUTO-28459', received: '2026-07-26', batch: 'BH-2026-0711', cost_inr: 420000, lead_time_days: 10 },
  { id: 'AUP-0010', part: 'Brake Systems', description: 'Disc Rotor Ventilated 320mm', oem: 'Mahindra', quantity: 400, unit: 'pcs', status: 'Passed', warehouse: 'Pune DC-2', po: 'PO-AUTO-28460', received: '2026-07-26', batch: 'BH-2026-0710', cost_inr: 1120000, lead_time_days: 8 },
  { id: 'AUP-0011', part: 'Transmission', description: 'Dual Clutch Assembly 7DCT300', oem: 'Hyundai India', quantity: 25, unit: 'sets', status: 'Quarantine', warehouse: 'Chennai DC-3', po: 'PO-AUTO-28461', received: '2026-07-25', batch: 'BH-2026-0708', cost_inr: 4500000, lead_time_days: 28 },
  { id: 'AUP-0012', part: 'Electrical Harness', description: 'EV Battery Cable Harness 800V', oem: 'Tata Motors', quantity: 75, unit: 'pcs', status: 'Certified', warehouse: 'Sriperumbudur DC', po: 'PO-AUTO-28462', received: '2026-07-25', batch: 'BH-2026-0707', cost_inr: 1875000, lead_time_days: 15 },
  { id: 'AUP-0013', part: 'Suspension Parts', description: 'Coil Spring Progressive Rate', oem: 'Maruti Suzuki', quantity: 800, unit: 'pcs', status: 'Passed', warehouse: 'Nashik DC-4', po: 'PO-AUTO-28463', received: '2026-07-24', batch: 'BH-2026-0705', cost_inr: 480000, lead_time_days: 6 },
  { id: 'AUP-0014', part: 'Body Panels', description: 'Tailgate Outer Panel Steel', oem: 'Honda Cars', quantity: 180, unit: 'pcs', status: 'Pending QC', warehouse: 'Gurugram DC-1', po: 'PO-AUTO-28464', received: '2026-07-24', batch: 'BH-2026-0704', cost_inr: 540000, lead_time_days: 9 },
  { id: 'AUP-0015', part: 'Exhaust Systems', description: 'Diesel Particulate Filter 5.0L', oem: 'Mahindra', quantity: 60, unit: 'pcs', status: 'Re-Inspection', warehouse: 'Pune DC-2', po: 'PO-AUTO-28465', received: '2026-07-23', batch: 'BH-2026-0702', cost_inr: 2100000, lead_time_days: 20 },
  { id: 'AUP-0016', part: 'Wheel Bearings', description: 'Tapered Roller Bearing Set 4x4', oem: 'Toyota Kirloskar', quantity: 350, unit: 'sets', status: 'Certified', warehouse: 'Bangalore DC-6', po: 'PO-AUTO-28466', received: '2026-07-23', batch: 'BH-2026-0701', cost_inr: 735000, lead_time_days: 7 },
  { id: 'AUP-0017', part: 'Engine Components', description: 'Turbocharger VGT 1.4T', oem: 'Hyundai India', quantity: 45, unit: 'pcs', status: 'Passed', warehouse: 'Sriperumbudur DC', po: 'PO-AUTO-28467', received: '2026-07-22', batch: 'BH-2026-0629', cost_inr: 3375000, lead_time_days: 22 },
  { id: 'AUP-0018', part: 'Brake Systems', description: 'Brake Pad Set Ceramic Front', oem: 'Maruti Suzuki', quantity: 1500, unit: 'sets', status: 'Passed', warehouse: 'Gurugram DC-1', po: 'PO-AUTO-28468', received: '2026-07-22', batch: 'BH-2026-0628', cost_inr: 375000, lead_time_days: 5 },
  { id: 'AUP-0019', part: 'Transmission', description: 'Torque Converter Assembly AWD', oem: 'MG Motor', quantity: 30, unit: 'sets', status: 'Failed', warehouse: 'Halol DC-7', po: 'PO-AUTO-28469', received: '2026-07-21', batch: 'BH-2026-0625', cost_inr: 3600000, lead_time_days: 25 },
  { id: 'AUP-0020', part: 'Suspension Parts', description: 'Control Arm Aluminum Forged', oem: 'Kia India', quantity: 250, unit: 'pcs', status: 'Certified', warehouse: 'Anantapur DC-5', po: 'PO-AUTO-28470', received: '2026-07-21', batch: 'BH-2026-0624', cost_inr: 1250000, lead_time_days: 11 },
]

const genRecords = (start: number) => {
  const statuses = ['Passed', 'Pending QC', 'Failed', 'Re-Inspection', 'Quarantine', 'Certified']
  const warehouses = ['Gurugram DC-1', 'Pune DC-2', 'Chennai DC-3', 'Sriperumbudur DC', 'Nashik DC-4', 'Anantapur DC-5', 'Bangalore DC-6', 'Halol DC-7']
  return Array.from({ length: 40 }, (_, i) => ({
    id: `AUP-${String(start + i).padStart(4, '0')}`,
    part: PART_TYPES[(start + i) % 8],
    description: `${PART_TYPES[(start + i) % 8]} Assembly ${(start + i) % 99 + 1}`,
    oem: OEM_MANUFACTURERS[(start + i) % 8],
    quantity: Math.round(10 + Math.random() * 1990),
    unit: ['pcs', 'sets', 'units'][i % 3],
    status: statuses[(start + i) % 6],
    warehouse: warehouses[(start + i) % 8],
    po: `PO-AUTO-${String(28470 + start + i).padStart(5, '0')}`,
    received: `2026-07-${String(20 - Math.floor((start + i) / 10)).padStart(2, '0')}`,
    batch: `BH-2026-${String(624 - Math.floor((start + i) / 3)).padStart(4, '0')}`,
    cost_inr: Math.round(50000 + Math.random() * 5000000),
    lead_time_days: Math.round(3 + Math.random() * 27),
  }))
}

const allParts = [...parts, ...genRecords(21), ...genRecords(61)]

function ri(min: number, max: number, value: number) {
  return Math.max(min, Math.min(max, value))
}

const filterGroups = [
  {
    key: 'part',
    label: 'Part Type',
    options: PART_TYPES.map(p => ({ label: p, value: p, count: allParts.filter(d => d.part === p).length })),
  },
  {
    key: 'oem',
    label: 'OEM Manufacturer',
    options: OEM_MANUFACTURERS.map(o => ({ label: o, value: o, count: allParts.filter(d => d.oem === o).length })),
  },
  {
    key: 'status',
    label: 'Inspection Status',
    options: INSPECTION_STATUS.map(s => ({ label: s, value: s, count: allParts.filter(d => d.status === s).length })),
  },
]

function PartBadge({ part }: { part: string }) {
  const colors: Record<string, string> = { 'Engine Components': 'bg-sky-100 text-sky-800', 'Brake Systems': 'bg-red-100 text-red-800', Transmission: 'bg-blue-100 text-blue-800', 'Electrical Harness': 'bg-cyan-100 text-cyan-800', 'Suspension Parts': 'bg-indigo-100 text-indigo-800', 'Body Panels': 'bg-teal-100 text-teal-800', 'Exhaust Systems': 'bg-orange-100 text-orange-800', 'Wheel Bearings': 'bg-amber-100 text-amber-800' }
  return <span className={`aup-part-badge inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[part] || 'bg-gray-100 text-gray-800'}`}>{part}</span>
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = { Passed: 'bg-green-100 text-green-800', 'Pending QC': 'bg-yellow-100 text-yellow-800', Failed: 'bg-red-100 text-red-800', 'Re-Inspection': 'bg-orange-100 text-orange-800', Quarantine: 'bg-gray-200 text-gray-700', Certified: 'bg-sky-100 text-sky-800' }
  return <span className={`aup-status-badge inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-700'}`}>{status}</span>
}

function CostBar({ cost }: { cost: number }) {
  const pct = ri(0, 100, (cost / 5500000) * 100)
  const color = cost >= 3000000 ? 'bg-sky-600' : cost >= 1000000 ? 'bg-sky-500' : cost >= 500000 ? 'bg-sky-400' : 'bg-sky-300'
  return <div className="aup-cost-bar flex items-center gap-2"><div className="h-2 w-20 rounded-full bg-gray-200"><div className={`aup-cost-bar-fill h-2 rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} /></div><span className="text-xs text-gray-500">{'₹' + (cost / 100000).toFixed(1) + 'L'}</span></div>
}

function HealthRing({ value, label, color }: { value: number; label: string; color: string }) {
  const r = 28, cx = 35, cy = 35, sw = 5
  const circ = 2 * Math.PI * r
  const offset = circ - (ri(0, 100, value) / 100) * circ
  return <div className="aup-health-ring flex flex-col items-center"><svg width={70} height={70} className="-rotate-90"><circle cx={cx} cy={cy} r={r} fill="none" stroke="#e5e7eb" strokeWidth={sw} /><circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={sw} strokeDasharray={circ} strokeDashoffset={offset} className="aup-ring-path" strokeLinecap="round" /></svg><span className="aup-ring-value mt-1 text-sm font-bold" style={{ color }}>{value}%</span><span className="text-xs text-gray-500">{label}</span></div>
}

function KpiTile({ title, value, sub }: { title: string; value: string; sub: string }) {
  return <Card className="aup-kpi-card"><CardContent className="p-4"><p className="text-xs text-gray-500">{title}</p><p className="aup-kpi-value mt-1 text-2xl font-bold">{value}</p><p className="text-xs text-gray-400 mt-0.5">{sub}</p></CardContent></Card>
}

function ValueTile({ title, value, trend }: { title: string; value: string; trend: string }) {
  const up = trend.startsWith('+')
  return <Card className="aup-value-tile"><CardContent className="p-4"><p className="text-xs text-gray-500">{title}</p><p className="mt-1 text-xl font-bold">{value}</p><p className={`text-xs mt-0.5 ${up ? 'text-green-600' : 'text-red-500'}`}>{trend}</p></CardContent></Card>
}

export default function AutomotivePartsLogisticsView() {
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

  const filtered = allParts.filter(d => {
    const q = searchQuery.toLowerCase()
    if (q && !d.id.toLowerCase().includes(q) && !d.part.toLowerCase().includes(q) && !d.oem.toLowerCase().includes(q) && !d.description.toLowerCase().includes(q) && !d.warehouse.toLowerCase().includes(q)) return false
    return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(d[key as keyof typeof d] as string))
  })

  const totalCost = allParts.reduce((s, d) => s + d.cost_inr, 0)
  const passedCount = allParts.filter(d => d.status === 'Passed').length
  const certifiedCount = allParts.filter(d => d.status === 'Certified').length
  const failedCount = allParts.filter(d => d.status === 'Failed' || d.status === 'Quarantine').length

  const monthlyData = [
    { month: 'Jan', parts: 320, value_cr: 18, quality: 94 },
    { month: 'Feb', parts: 358, value_cr: 22, quality: 92 },
    { month: 'Mar', parts: 410, value_cr: 28, quality: 96 },
    { month: 'Apr', parts: 385, value_cr: 25, quality: 93 },
    { month: 'May', parts: 340, value_cr: 20, quality: 95 },
    { month: 'Jun', parts: 295, value_cr: 17, quality: 91 },
    { month: 'Jul', parts: 420, value_cr: 32, quality: 94 },
  ]
  const partData = PART_TYPES.map(p => ({ part: p, count: allParts.filter(d => d.part === p).length }))
  const oemData = OEM_MANUFACTURERS.map(o => ({ oem: o, count: allParts.filter(d => d.oem === o).length }))

  const tabs = [
    { value: 'dashboard', label: 'Dashboard' },
    { value: 'parts', label: 'Parts Inventory' },
    { value: 'analytics', label: 'Analytics' },
    { value: 'insights', label: 'Insights' },
  ]

  return (
    <div className="aup-container space-y-4">
      <PageHeader title="Automotive Parts Logistics" description="OEM parts tracking, quality inspection, batch traceability, and JIT delivery management for Indian automotive supply chain" />
      <ModuleBreadcrumb items={[{ label: 'Specialized Logistics' }, { label: 'Automotive Parts' }]} />
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="aup-tabs-list">
          {tabs.map(t => <TabsTrigger key={t.value} value={t.value} className="aup-tab-trigger">{t.label}</TabsTrigger>)}
        </TabsList>

        <TabsContent value="dashboard" className="aup-tab-content space-y-4 mt-4">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <KpiTile title="Total SKUs" value={allParts.length.toString()} sub="Unique part records" />
            <KpiTile title="Total Value" value={`₹${(totalCost / 10000000).toFixed(1)}Cr`} sub="Inventory value" />
            <KpiTile title="Quality Pass" value={passedCount.toString()} sub={`${((passedCount / allParts.length) * 100).toFixed(0)}% pass rate`} />
            <KpiTile title="Certified" value={certifiedCount.toString()} sub="Ready for assembly" />
          </div>
          <div className="grid gap-4 grid-cols-3 md:grid-cols-6">
            <HealthRing value={96} label="Batch Trace" color="#0284c7" />
            <HealthRing value={92} label="JIT Delivery" color="#0369a1" />
            <HealthRing value={94} label="Quality Score" color="#0ea5e9" />
            <HealthRing value={88} label="OEM SLA" color="#075985" />
            <HealthRing value={97} label="Barcode Scan" color="#0c4a6e" />
            <HealthRing value={91} label="Defect Detection" color="#38bdf8" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="aup-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Monthly Parts Volume & Quality</CardTitle></CardHeader><CardContent><LineChart data={monthlyData} width={300} height={200}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" fontSize={12} /><YAxis fontSize={12} /><Tooltip /><Legend /><Line type="monotone" dataKey="parts" stroke="#0284c7" strokeWidth={2} /><Line type="monotone" dataKey="quality" stroke="#0369a1" strokeWidth={2} strokeDasharray="5 5" /></LineChart></CardContent></Card>
            <Card className="aup-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Parts by Category</CardTitle></CardHeader><CardContent><BarChart data={partData} width={300} height={200}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="part" fontSize={10} angle={-30} textAnchor="end" height={50} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="count" fill="#0284c7" radius={[4,4,0,0]} /></BarChart></CardContent></Card>
            <Card className="aup-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">OEM Distribution</CardTitle></CardHeader><CardContent><PieChart width={300} height={200}><Pie data={oemData} dataKey="count" nameKey="oem" cx="50%" cy="50%" outerRadius={70} label={({ oem, count }) => `${count}`}>{oemData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="parts" className="aup-tab-content space-y-4 mt-4">
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={allParts.length} filteredCount={filtered.length} onRefresh={() => {}} placeholder="Search by ID, part, OEM, description, or warehouse..." />
          <div className="overflow-x-auto rounded-lg border">
            <table className="aup-table w-full text-sm">
              <thead><tr className="aup-table-header bg-gray-50"><th className="px-3 py-2 text-left font-medium">ID</th><th className="px-3 py-2 text-left font-medium">Part</th><th className="px-3 py-2 text-left font-medium">OEM</th><th className="px-3 py-2 text-left font-medium">Status</th><th className="px-3 py-2 text-left font-medium">Qty</th><th className="px-3 py-2 text-left font-medium">Cost</th><th className="px-3 py-2 text-left font-medium">Warehouse</th><th className="px-3 py-2 text-left font-medium">Lead Time</th><th className="px-3 py-2 text-left font-medium">Batch</th></tr></thead>
              <tbody>{filtered.slice(0, 20).map(d => (
                <tr key={d.id} className="aup-table-row border-t hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-2 font-mono text-xs">{d.id}</td>
                  <td className="px-3 py-2"><PartBadge part={d.part} /></td>
                  <td className="px-3 py-2 text-xs">{d.oem}</td>
                  <td className="px-3 py-2"><StatusBadge status={d.status} /></td>
                  <td className="px-3 py-2 text-xs">{d.quantity.toLocaleString('en-IN')} {d.unit}</td>
                  <td className="px-3 py-2"><CostBar cost={d.cost_inr} /></td>
                  <td className="px-3 py-2 text-xs">{d.warehouse}</td>
                  <td className="px-3 py-2 text-xs">{d.lead_time_days}d</td>
                  <td className="px-3 py-2 text-xs">{d.batch}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="aup-tab-content space-y-4 mt-4">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <ValueTile title="Avg SKU Value" value="₹3.2L" trend="+7.5% vs last quarter" />
            <ValueTile title="Lead Time" value="12.4d" trend="-1.8d improved" />
            <ValueTile title="Failure Rate" value="3.8%" trend="-1.2% reduced" />
            <ValueTile title="OEM Score" value="4.6/5" trend="+0.3 improved" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="aup-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Part Value by Category</CardTitle></CardHeader><CardContent><BarChart data={PART_TYPES.map(p => ({ part: p, total: allParts.filter(d => d.part === p).reduce((s, d) => s + d.cost_inr, 0) / 10000000 }))} width={400} height={250}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="part" fontSize={10} angle={-30} textAnchor="end" height={50} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="total" fill="#0369a1" radius={[4,4,0,0]} /></BarChart></CardContent></Card>
            <Card className="aup-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Inspection Status Breakdown</CardTitle></CardHeader><CardContent><PieChart width={400} height={250}><Pie data={INSPECTION_STATUS.map(s => ({ status: s, count: allParts.filter(d => d.status === s).length }))} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={80} label>{INSPECTION_STATUS.map((_, i) => <Cell key={i} fill={['#22c55e','#eab308','#ef4444','#f97316','#9ca3af','#0ea5e9'][i]} />)}</Pie><Tooltip /></PieChart></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="aup-tab-content space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="aup-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">JIT Kanban for Maruti Suzuki Supply Chain</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Electronic Kanban integration with Maruti Suzuki Manesar and Gujarat plants. Real-time bin-level monitoring triggers automatic replenishment when stock drops below 2-hour buffer. Zero line-stoppages achieved in Q2 2026 across 8 Tier-1 suppliers. EDI 852/856/855 integration for automated PO and ASN exchange.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-sky-100 px-2 py-0.5 text-sky-800">Critical</span><span className="text-gray-400">Live</span></div></CardContent></Card>
            <Card className="aup-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">AI Vision Quality Inspection</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Computer vision system with 12 industrial cameras at receiving docks performing 100% visual inspection of brake discs, engine blocks, and body panels. Defect detection accuracy of 99.2% for surface finish, dimensional tolerance, and paint quality. Reduces manual QC time by 65% while catching defects missed by human inspectors.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-blue-800">Operational</span><span className="text-gray-400">Q3 2026</span></div></CardContent></Card>
            <Card className="aup-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">EV Battery Pack Reverse Logistics</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Dedicated reverse logistics for EV battery modules from Tata Motors and Mahindra service centers. DGCC-compliant packaging and ADR-certified transport for lithium-ion packs. Battery health diagnostic at 4 regional hubs before routing to recycling or second-life repurposing. 85% material recovery rate target by FY2027.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-cyan-100 px-2 py-0.5 text-cyan-800">Growth</span><span className="text-gray-400">FY2027</span></div></CardContent></Card>
            <Card className="aup-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">Predictive Batch Failure Analytics</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Machine learning model trained on 18 months of inspection data identifying patterns in supplier batch failures. Predicts failure probability per batch with 87% accuracy 48 hours before QC. Used to preemptively quarantine suspect batches from 3 underperforming suppliers, saving ₹4.2Cr in warranty claims annually.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-indigo-100 px-2 py-0.5 text-indigo-800">Innovation</span><span className="text-gray-400">Pilot</span></div></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
