import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#65a30d', '#4d7c0f', '#84cc16', '#a3e635', '#bef264', '#3f6212', '#365314', '#ecfccb']

const INPUT_TYPES = ['Certified Seeds', 'Hybrid Seeds', 'Fertilizers (NPK)', 'Pesticides', 'Micro-nutrients', 'Farm Machinery Parts', 'Drip Irrigation Kits', 'Organic Manure']
const SUPPLIERS = ['IFFCO Kandla', 'NFL Noida', 'KRIBHCO Noida', 'Nuziveedu Seeds Hyderabad', 'Kaveri Seed Mysore', 'Coromandel Vijayawada', 'Rallis Mumbai', 'UPL Ltd Mumbai']
const LOT_STATUS = ['Lab Certified', 'Under Testing', 'Dispatched', 'In Warehouse', 'Quarantine', 'Pending QC']

const agriRecords = [
  { id: 'SAL-0001', input: 'Certified Seeds', description: 'Bt Cotton MECH-162 Breeder Seed 500g', supplier: 'Nuziveedu Seeds Hyderabad', quantity: 12000, unit: 'packets', lot_status: 'Lab Certified', lot: 'LOT-SAL-2841', destination: 'Cotton Hub Jalgaon', received: '2026-07-30', batch: 'SAL-B2026-0721', cost_inr: 8400000, germination_pct: 98.2, validity: '2027-03-30' },
  { id: 'SAL-0002', input: 'Fertilizers (NPK)', description: 'Urea 46% N Prilled Bag 50kg', supplier: 'IFFCO Kandla', quantity: 85000, unit: 'bags', lot_status: 'Dispatched', lot: 'LOT-SAL-2838', destination: 'IFFCO Bhubaneswar', received: '2026-07-30', batch: 'SAL-B2026-0720', cost_inr: 127500000, germination_pct: 0, validity: '2028-07-30' },
  { id: 'SAL-0003', input: 'Hybrid Seeds', description: 'Pusa RH-10 Basmati Hybrid 5kg', supplier: 'Kaveri Seed Mysore', quantity: 5000, unit: 'packets', lot_status: 'Under Testing', lot: 'LOT-SAL-2812', destination: 'Kisan Hub Karnal', received: '2026-07-29', batch: 'SAL-B2026-0719', cost_inr: 12500000, germination_pct: 96.8, validity: '2027-01-29' },
  { id: 'SAL-0004', input: 'Pesticides', description: 'Imidacloprid 17.8% SL Insecticide 1L', supplier: 'UPL Ltd Mumbai', quantity: 25000, unit: 'bottles', lot_status: 'Lab Certified', lot: 'LOT-SAL-2827', destination: 'Agri Hub Sangli', received: '2026-07-29', batch: 'SAL-B2026-0718', cost_inr: 18750000, germination_pct: 0, validity: '2027-07-29' },
  { id: 'SAL-0005', input: 'Micro-nutrients', description: 'Zinc Sulphate Heptahydrate 21% Zn 25kg', supplier: 'Coromandel Vijayawada', quantity: 15000, unit: 'bags', lot_status: 'In Warehouse', lot: 'LOT-SAL-2831', destination: 'KVK Warangal', received: '2026-07-28', batch: 'SAL-B2026-0716', cost_inr: 6750000, germination_pct: 0, validity: '2028-07-28' },
  { id: 'SAL-0006', input: 'Farm Machinery Parts', description: 'Tractor Fuel Filter Assembly Mahindra 575', supplier: 'Rallis Mumbai', quantity: 800, unit: 'sets', lot_status: 'Dispatched', lot: 'LOT-SAL-2840', destination: 'Mahindra Hub Indore', received: '2026-07-28', batch: 'SAL-B2026-0715', cost_inr: 9600000, germination_pct: 0, validity: 'N/A' },
  { id: 'SAL-0007', input: 'Drip Irrigation Kits', description: '16mm Drip Lateral 1000m Roll CRI Certified', supplier: 'NFL Noida', quantity: 3000, unit: 'rolls', lot_status: 'Lab Certified', lot: 'LOT-SAL-2808', destination: 'Jal Bhagirathi Jodhpur', received: '2026-07-27', batch: 'SAL-B2026-0714', cost_inr: 54000000, germination_pct: 0, validity: '2030-07-27' },
  { id: 'SAL-0008', input: 'Organic Manure', description: 'Vermicompost 5kg Bag NPK 1.5-1-1.5', supplier: 'KRIBHCO Noida', quantity: 45000, unit: 'bags', lot_status: 'Quarantine', lot: 'LOT-SAL-2837', destination: 'Organic Hub Mysore', received: '2026-07-27', batch: 'SAL-B2026-0713', cost_inr: 11250000, germination_pct: 0, validity: '2027-07-27' },
  { id: 'SAL-0009', input: 'Certified Seeds', description: 'Mustard Pusa Bold 1kg Certified', supplier: 'Nuziveedu Seeds Hyderabad', quantity: 18000, unit: 'packets', lot_status: 'Lab Certified', lot: 'LOT-SAL-2839', destination: 'Mustard Hub Alwar', received: '2026-07-26', batch: 'SAL-B2026-0711', cost_inr: 5400000, germination_pct: 97.5, validity: '2027-04-26' },
  { id: 'SAL-0010', input: 'Fertilizers (NPK)', description: 'DAP 18:46:00 Granular 50kg Bag', supplier: 'IFFCO Kandla', quantity: 62000, unit: 'bags', lot_status: 'Dispatched', lot: 'LOT-SAL-2826', destination: 'IFFCO Lucknow', received: '2026-07-26', batch: 'SAL-B2026-0710', cost_inr: 155000000, germination_pct: 0, validity: '2028-07-26' },
  { id: 'SAL-0011', input: 'Hybrid Seeds', description: 'KMH-483 Maize Hybrid 4kg Packet', supplier: 'Kaveri Seed Mysore', quantity: 8000, unit: 'packets', lot_status: 'Under Testing', lot: 'LOT-SAL-2811', destination: 'Maize Hub Hyderabad', received: '2026-07-25', batch: 'SAL-B2026-0708', cost_inr: 20000000, germination_pct: 95.2, validity: '2027-01-25' },
  { id: 'SAL-0012', input: 'Pesticides', description: 'Chlorpyrifos 20% EC Emulsifiable 1L', supplier: 'UPL Ltd Mumbai', quantity: 32000, unit: 'bottles', lot_status: 'Pending QC', lot: 'LOT-SAL-2807', destination: 'Agri Hub Nashik', received: '2026-07-25', batch: 'SAL-B2026-0707', cost_inr: 22400000, germination_pct: 0, validity: '2027-07-25' },
  { id: 'SAL-0013', input: 'Micro-nutrients', description: 'Borax 10.5% B 500g Pack Micronutrient', supplier: 'Coromandel Vijayawada', quantity: 50000, unit: 'packs', lot_status: 'Lab Certified', lot: 'LOT-SAL-2830', destination: 'KVK Guntur', received: '2026-07-24', batch: 'SAL-B2026-0705', cost_inr: 7500000, germination_pct: 0, validity: '2028-07-24' },
  { id: 'SAL-0014', input: 'Farm Machinery Parts', description: 'PTO Shaft Assembly TAFE 8445 4WD', supplier: 'Rallis Mumbai', quantity: 400, unit: 'sets', lot_status: 'In Warehouse', lot: 'LOT-SAL-2825', destination: 'TAFE Hub Chennai', received: '2026-07-24', batch: 'SAL-B2026-0704', cost_inr: 7200000, germination_pct: 0, validity: 'N/A' },
  { id: 'SAL-0015', input: 'Drip Irrigation Kits', description: 'Online Dripper 8 LPH CRI Kit 1 Acre', supplier: 'NFL Noida', quantity: 4500, unit: 'kits', lot_status: 'Lab Certified', lot: 'LOT-SAL-2836', destination: 'PMKSY Hub Aurangabad', received: '2026-07-23', batch: 'SAL-B2026-0702', cost_inr: 67500000, germination_pct: 0, validity: '2030-07-23' },
  { id: 'SAL-0016', input: 'Organic Manure', description: 'Neem Cake 5kg Pelletized Azadirachtin 3000ppm', supplier: 'KRIBHCO Noida', quantity: 60000, unit: 'bags', lot_status: 'Dispatched', lot: 'LOT-SAL-2824', destination: 'Organic Hub Hubli', received: '2026-07-23', batch: 'SAL-B2026-0701', cost_inr: 9000000, germination_pct: 0, validity: '2027-07-23' },
  { id: 'SAL-0017', input: 'Certified Seeds', description: 'Pusa-1121 Basmati CSR-30 Certified 5kg', supplier: 'Kaveri Seed Mysore', quantity: 6000, unit: 'packets', lot_status: 'Lab Certified', lot: 'LOT-SAL-2823', destination: 'Basmati Hub Karnal', received: '2026-07-22', batch: 'SAL-B2026-0629', cost_inr: 21000000, germination_pct: 99.1, validity: '2027-04-22' },
  { id: 'SAL-0018', input: 'Fertilizers (NPK)', description: 'MOP 60% K2O Muriate of Potash 50kg', supplier: 'IFFCO Kandla', quantity: 40000, unit: 'bags', lot_status: 'In Warehouse', lot: 'LOT-SAL-2822', destination: 'Spice Hub Kochi', received: '2026-07-22', batch: 'SAL-B2026-0628', cost_inr: 120000000, germination_pct: 0, validity: '2028-07-22' },
  { id: 'SAL-0019', input: 'Hybrid Seeds', description: 'Arka Vikas Tomato Hybrid 10g', supplier: 'Nuziveedu Seeds Hyderabad', quantity: 25000, unit: 'packets', lot_status: 'Under Testing', lot: 'LOT-SAL-2810', destination: 'Horti Hub Bengaluru', received: '2026-07-21', batch: 'SAL-B2026-0625', cost_inr: 6250000, germination_pct: 94.8, validity: '2026-12-21' },
  { id: 'SAL-0020', input: 'Pesticides', description: 'Mancozeb 75% WP Fungicide 1kg', supplier: 'UPL Ltd Mumbai', quantity: 18000, unit: 'packets', lot_status: 'Lab Certified', lot: 'LOT-SAL-2821', destination: 'Grape Hub Nashik', received: '2026-07-21', batch: 'SAL-B2026-0624', cost_inr: 10800000, germination_pct: 0, validity: '2027-07-21' },
]

const genRecords = (start: number) => {
  const statuses = ['Lab Certified', 'Under Testing', 'Dispatched', 'In Warehouse', 'Quarantine', 'Pending QC']
  const destinations = ['Cotton Hub Jalgaon', 'Kisan Hub Karnal', 'Agri Hub Sangli', 'KVK Warangal', 'Mahindra Hub Indore', 'Jal Bhagirathi Jodhpur', 'Organic Hub Mysore', 'Maize Hub Hyderabad']
  return Array.from({ length: 40 }, (_, i) => ({
    id: `SAL-${String(start + i).padStart(4, '0')}`,
    input: INPUT_TYPES[(start + i) % 8],
    description: `${INPUT_TYPES[(start + i) % 8]} Lot ${String((start + i) % 99 + 1).padStart(3, '0')}`,
    supplier: SUPPLIERS[(start + i) % 8],
    quantity: Math.round(100 + Math.random() * 99900),
    unit: ['packets', 'bags', 'bottles', 'sets', 'rolls', 'kits', 'packs', 'units'][i % 8],
    lot_status: statuses[(start + i) % 6],
    lot: `LOT-SAL-${String(2821 + start + i)}`,
    destination: destinations[(start + i) % 8],
    received: `2026-07-${String(20 - Math.floor((start + i) / 10)).padStart(2, '0')}`,
    batch: `SAL-B2026-${String(624 - Math.floor((start + i) / 3)).padStart(4, '0')}`,
    cost_inr: Math.round(2000000 + Math.random() * 200000000),
    germination_pct: INPUT_TYPES[(start + i) % 8].includes('Seed') ? Math.round((92 + Math.random() * 8) * 10) / 10 : 0,
    validity: `202${7 + ((start + i) % 3)}-${String(((start + i) % 12) + 1).padStart(2, '0')}-28`,
  }))
}

const allAgri = [...agriRecords, ...genRecords(21), ...genRecords(61)]

function ri(min: number, max: number, value: number) {
  return Math.max(min, Math.min(max, value))
}

const filterGroups = [
  {
    key: 'input',
    label: 'Input Type',
    options: INPUT_TYPES.map(t => ({ label: t, value: t, count: allAgri.filter(r => r.input === t).length })),
  },
  {
    key: 'supplier',
    label: 'Supplier',
    options: SUPPLIERS.map(s => ({ label: s, value: s, count: allAgri.filter(r => r.supplier === s).length })),
  },
  {
    key: 'lot_status',
    label: 'Lot Status',
    options: LOT_STATUS.map(s => ({ label: s, value: s, count: allAgri.filter(r => r.lot_status === s).length })),
  },
]

function InputBadge({ input }: { input: string }) {
  const colors: Record<string, string> = { 'Certified Seeds': 'bg-green-100 text-green-800', 'Hybrid Seeds': 'bg-lime-100 text-lime-800', 'Fertilizers (NPK)': 'bg-emerald-100 text-emerald-800', Pesticides: 'bg-red-100 text-red-800', 'Micro-nutrients': 'bg-teal-100 text-teal-800', 'Farm Machinery Parts': 'bg-gray-100 text-gray-800', 'Drip Irrigation Kits': 'bg-sky-100 text-sky-800', 'Organic Manure': 'bg-amber-100 text-amber-800' }
  return <span className={`sal-input-badge inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[input] || 'bg-gray-100 text-gray-800'}`}>{input}</span>
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = { 'Lab Certified': 'bg-green-100 text-green-800', 'Under Testing': 'bg-yellow-100 text-yellow-800', Dispatched: 'bg-blue-100 text-blue-800', 'In Warehouse': 'bg-cyan-100 text-cyan-800', Quarantine: 'bg-red-100 text-red-800', 'Pending QC': 'bg-gray-200 text-gray-700' }
  return <span className={`sal-status-badge inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-700'}`}>{status}</span>
}

function CostBar({ cost }: { cost: number }) {
  const pct = ri(0, 100, (cost / 200000000) * 100)
  const color = cost >= 100000000 ? 'bg-lime-600' : cost >= 50000000 ? 'bg-lime-500' : cost >= 10000000 ? 'bg-lime-400' : 'bg-lime-300'
  return <div className="sal-cost-bar flex items-center gap-2"><div className="h-2 w-20 rounded-full bg-gray-200"><div className={`sal-cost-bar-fill h-2 rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} /></div><span className="text-xs text-gray-500">{'₹' + (cost / 10000000).toFixed(1) + 'Cr'}</span></div>
}

function HealthRing({ value, label, color }: { value: number; label: string; color: string }) {
  const r = 28, cx = 35, cy = 35, sw = 5
  const circ = 2 * Math.PI * r
  const offset = circ - (ri(0, 100, value) / 100) * circ
  return <div className="sal-health-ring flex flex-col items-center"><svg width={70} height={70} className="-rotate-90"><circle cx={cx} cy={cy} r={r} fill="none" stroke="#e5e7eb" strokeWidth={sw} /><circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={sw} strokeDasharray={circ} strokeDashoffset={offset} className="sal-ring-path" strokeLinecap="round" /></svg><span className="sal-ring-value mt-1 text-sm font-bold" style={{ color }}>{value}%</span><span className="text-xs text-gray-500">{label}</span></div>
}

function KpiTile({ title, value, sub }: { title: string; value: string; sub: string }) {
  return <Card className="sal-kpi-card"><CardContent className="p-4"><p className="text-xs text-gray-500">{title}</p><p className="sal-kpi-value mt-1 text-2xl font-bold">{value}</p><p className="text-xs text-gray-400 mt-0.5">{sub}</p></CardContent></Card>
}

function ValueTile({ title, value, trend }: { title: string; value: string; trend: string }) {
  const up = trend.startsWith('+')
  return <Card className="sal-value-tile"><CardContent className="p-4"><p className="text-xs text-gray-500">{title}</p><p className="mt-1 text-xl font-bold">{value}</p><p className={`text-xs mt-0.5 ${up ? 'text-green-600' : 'text-red-500'}`}>{trend}</p></CardContent></Card>
}

export default function SeedAgriInputLogisticsView() {
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

  const filtered = allAgri.filter(a => {
    const q = searchQuery.toLowerCase()
    if (q && !a.id.toLowerCase().includes(q) && !a.input.toLowerCase().includes(q) && !a.description.toLowerCase().includes(q) && !a.supplier.toLowerCase().includes(q) && !a.destination.toLowerCase().includes(q)) return false
    return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(a[key as keyof typeof a] as string))
  })

  const totalCost = allAgri.reduce((s, a) => s + a.cost_inr, 0)
  const certified = allAgri.filter(a => a.lot_status === 'Lab Certified').length
  const inTesting = allAgri.filter(a => a.lot_status === 'Under Testing').length

  const monthlyData = [
    { month: 'Jan', lots: 92, value_cr: 48, quality: 97 },
    { month: 'Feb', lots: 108, value_cr: 62, quality: 96 },
    { month: 'Mar', lots: 145, value_cr: 85, quality: 98 },
    { month: 'Apr', lots: 78, value_cr: 38, quality: 95 },
    { month: 'May', lots: 132, value_cr: 72, quality: 97 },
    { month: 'Jun', lots: 55, value_cr: 28, quality: 94 },
    { month: 'Jul', lots: 156, value_cr: 88, quality: 98 },
  ]
  const inputData = INPUT_TYPES.map(t => ({ input: t, count: allAgri.filter(r => r.input === t).length }))
  const supplierData = SUPPLIERS.map(s => ({ supplier: s, count: allAgri.filter(r => r.supplier === s).length }))

  const tabs = [
    { value: 'dashboard', label: 'Dashboard' },
    { value: 'inventory', label: 'Inventory' },
    { value: 'analytics', label: 'Analytics' },
    { value: 'insights', label: 'Insights' },
  ]

  return (
    <div className="sal-container space-y-4">
      <PageHeader title="Seed & Agri Input Logistics" description="Agricultural input supply chain with ICAR certified seed tracking, IS:NSS fertilizer quality assurance, CIB pesticide compliance, and PMKSY drip irrigation distribution across Indian farming regions" />
      <ModuleBreadcrumb items={[{ label: 'Agri Logistics' }, { label: 'Seeds & Inputs' }]} />
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="sal-tabs-list">
          {tabs.map(t => <TabsTrigger key={t.value} value={t.value} className="sal-tab-trigger">{t.label}</TabsTrigger>)}
        </TabsList>

        <TabsContent value="dashboard" className="sal-tab-content space-y-4 mt-4">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <KpiTile title="Total Lots" value={allAgri.length.toString()} sub="Agri input consignments" />
            <KpiTile title="Total Value" value={`₹${(totalCost / 10000000).toFixed(0)}Cr`} sub="Inventory value" />
            <KpiTile title="Lab Certified" value={certified.toString()} sub={`${((certified / allAgri.length) * 100).toFixed(0)}% cleared`} />
            <KpiTile title="Under Testing" value={inTesting.toString()} sub="Pending lab results" />
          </div>
          <div className="grid gap-4 grid-cols-3 md:grid-cols-6">
            <HealthRing value={98} label="Seed Germination" color="#65a30d" />
            <HealthRing value={96} label="Fertilizer Purity" color="#4d7c0f" />
            <HealthRing value={94} label="Pesticide Efficacy" color="#84cc16" />
            <HealthRing value={97} label="Kharif Ready" color="#3f6212" />
            <HealthRing value={92} label="Rabi Stocked" color="#365314" />
            <HealthRing value={99} label="Organic Cert" color="#a3e635" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="sal-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Monthly Lot Volume & Quality Index</CardTitle></CardHeader><CardContent><LineChart data={monthlyData} width={300} height={200}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" fontSize={12} /><YAxis fontSize={12} /><Tooltip /><Legend /><Line type="monotone" dataKey="lots" stroke="#65a30d" strokeWidth={2} /><Line type="monotone" dataKey="quality" stroke="#4d7c0f" strokeWidth={2} strokeDasharray="5 5" /></LineChart></CardContent></Card>
            <Card className="sal-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Inventory by Input Type</CardTitle></CardHeader><CardContent><BarChart data={inputData} width={300} height={200}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="input" fontSize={10} angle={-30} textAnchor="end" height={50} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="count" fill="#65a30d" radius={[4,4,0,0]} /></BarChart></CardContent></Card>
            <Card className="sal-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Supplier Distribution</CardTitle></CardHeader><CardContent><PieChart width={300} height={200}><Pie data={supplierData} dataKey="count" nameKey="supplier" cx="50%" cy="50%" outerRadius={70} label={({ supplier, count }) => `${count}`}>{supplierData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="inventory" className="sal-tab-content space-y-4 mt-4">
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={allAgri.length} filteredCount={filtered.length} onRefresh={() => {}} placeholder="Search by ID, input type, supplier, destination, or lot..." />
          <div className="overflow-x-auto rounded-lg border">
            <table className="sal-table w-full text-sm">
              <thead><tr className="sal-table-header bg-gray-50"><th className="px-3 py-2 text-left font-medium">ID</th><th className="px-3 py-2 text-left font-medium">Input Type</th><th className="px-3 py-2 text-left font-medium">Status</th><th className="px-3 py-2 text-left font-medium">Qty</th><th className="px-3 py-2 text-left font-medium">Cost</th><th className="px-3 py-2 text-left font-medium">Supplier</th><th className="px-3 py-2 text-left font-medium">Destination</th><th className="px-3 py-2 text-left font-medium">Lot</th><th className="px-3 py-2 text-left font-medium">Valid</th></tr></thead>
              <tbody>{filtered.slice(0, 20).map(a => (
                <tr key={a.id} className="sal-table-row border-t hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-2 font-mono text-xs">{a.id}</td>
                  <td className="px-3 py-2"><InputBadge input={a.input} /></td>
                  <td className="px-3 py-2"><StatusBadge status={a.lot_status} /></td>
                  <td className="px-3 py-2 text-xs">{a.quantity.toLocaleString('en-IN')} {a.unit}</td>
                  <td className="px-3 py-2"><CostBar cost={a.cost_inr} /></td>
                  <td className="px-3 py-2 text-xs">{a.supplier}</td>
                  <td className="px-3 py-2 text-xs">{a.destination}</td>
                  <td className="px-3 py-2 text-xs font-mono">{a.lot}</td>
                  <td className="px-3 py-2 text-xs">{a.validity}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="sal-tab-content space-y-4 mt-4">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <ValueTile title="Avg Lot Value" value="₹6.2Cr" trend="+9.5% vs last quarter" />
            <ValueTile title="Seed Germination" value="97.4%" trend="+0.8% improved" />
            <ValueTile title="Kharif Readiness" value="96.8%" trend="+2.1% on target" />
            <ValueTile title="Organic Share" value="14.2%" trend="+3.4% growing" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="sal-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Value by Input Category</CardTitle></CardHeader><CardContent><BarChart data={INPUT_TYPES.map(t => ({ input: t, total: allAgri.filter(r => r.input === t).reduce((s, r) => s + r.cost_inr, 0) / 10000000 }))} width={400} height={250}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="input" fontSize={10} angle={-30} textAnchor="end" height={50} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="total" fill="#4d7c0f" radius={[4,4,0,0]} /></BarChart></CardContent></Card>
            <Card className="sal-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Lot Status Breakdown</CardTitle></CardHeader><CardContent><PieChart width={400} height={250}><Pie data={LOT_STATUS.map(s => ({ status: s, count: allAgri.filter(a => a.lot_status === s).length }))} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={80} label>{LOT_STATUS.map((_, i) => <Cell key={i} fill={['#22c55e','#eab308','#3b82f6','#06b6d4','#ef4444','#9ca3af'][i]} />)}</Pie><Tooltip /></PieChart></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="sal-tab-content space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="sal-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">ICAR Seed Certification Digital Portal</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Real-time integration with Indian Council of Agricultural Research (ICAR) seed certification system tracking 18 State Seed Certification Agencies across India. Automated germination, purity, and vigor testing results uploaded within 48 hours from 42 notified seed testing labs. Blockchain seed traceability from breeder to farmer enabling 100% provenance verification. Integration with Sub-Committee on Crop Standards ensuring NSC and truthfully labelled seed compliance.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-lime-100 px-2 py-0.5 text-lime-800">Critical</span><span className="text-gray-400">Live</span></div></CardContent></Card>
            <Card className="sal-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">PMKSY Per Drop More Crop Integration</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Pradhan Mantri Krishi Sinchayee Yojana micro-irrigation distribution tracking across 28 states and 642 districts. Real-time installation verification via GPS-tagged photographs from 2,400+ authorized dealers. Automated subsidy disbursement tracking through DBT (Direct Benefit Transfer) for 18.5 lakh farmers. IoT-enabled soil moisture sensors on 45,000+ hectare clusters optimizing water-use efficiency from 35% to 72%.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-green-800">Operational</span><span className="text-gray-400">Q3 2026</span></div></CardContent></Card>
            <Card className="sal-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">NBS Soil Health Card Fertilizer Recommendation</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Nutrient Based Subsidy (NBS) scheme integration linking Soil Health Card recommendations from 14.5 crore farmers to precise fertilizer inventory allocation. AI-driven crop-wise NPK demand forecasting model covering 464 districts with 91.5% accuracy for Kharif 2026. Automated customized fertilizer blend prescriptions reducing overuse of urea by 18% while maintaining yield. Real-time tracking of 240+ custom blending units across India.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-800">Strategic</span><span className="text-gray-400">FY2027</span></div></CardContent></Card>
            <Card className="sal-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">Drone Spraying Pesticide Logistics Network</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Kisan Drone Didi program logistics managing 2,500+ agricultural drones across 750 Women Self Help Groups for precision pesticide application. Automated flight planning and spray volume calculation per acre based on crop type, pest density, and wind conditions. Real-time pesticide inventory linked to drone refill stations ensuring zero stockout during critical spraying windows. Integration with ICAR CIB&amp;RC approved chemical list enforcing only registered pesticide usage across 425 formulations.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-teal-100 px-2 py-0.5 text-teal-800">Innovation</span><span className="text-gray-400">Pilot</span></div></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
