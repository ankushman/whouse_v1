import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#ea580c', '#c2410c', '#f97316', '#fb923c', '#fdba74', '#9a3412', '#7c2d12', '#fff7ed']
const CHEMICALS = ['Acetylene C2H2', 'Oxygen O2 Liquid', 'Nitrogen N2 Liquid', 'Argon Ar Industrial', 'Hydrogen H2 High Purity', 'CO2 Liquid', 'Chlorine Cl2', 'LPG Propane-Butane Mix']
const SUPPLIERS = ['Linde India Mumbai', 'Praxair Bengaluru (now Linde)', 'Air Liquide Chennai', 'INOX Air Products Delhi', 'Gujarat Fluorochemicals', 'National Oxygen Jaipur', 'Universal Industrial Gases Pune', 'Bombay Oxygen Corporation']
const STATUSES = ['UN Class Certified', 'MSDS Verified', 'In Transit Hazmat', 'Tank Farm Stored', 'Pending PESO', 'Awaiting Quality Check']
const CITIES = ['Mumbai', 'Delhi', 'Bengaluru', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Lucknow']
const UN_CLASSES = ['2.1', '2.2', '2.3']

const gasRecords = [
  { id: 'CIG-0001', chemical: 'Acetylene C2H2', description: 'Welding-grade acetylene cylinders for Cochin Shipyard Ltd repair dock operations', supplier: 'Linde India Mumbai', quantity: 240, unit: 'cylinders', move_status: 'UN Class Certified', lot: 'LOT-CIG-0001', destination: 'Kochi', received: '2026-07-30', batch: 'CIG-B2026-0730', cost_inr: 576000, weight_mt: 4.8, un_class: '2.1' },
  { id: 'CIG-0002', chemical: 'Oxygen O2 Liquid', description: 'Medical-grade LOX tanker for Apollo Hospitals Chennai emergency wing supply', supplier: 'INOX Air Products Delhi', quantity: 18, unit: 'tankers', move_status: 'MSDS Verified', lot: 'LOT-CIG-0002', destination: 'Chennai', received: '2026-07-30', batch: 'CIG-B2026-0729', cost_inr: 3420000, weight_mt: 36.0, un_class: '2.2' },
  { id: 'CIG-0003', chemical: 'Nitrogen N2 Liquid', description: 'Cryogenic LN2 for Sun Pharma Gujarat freeze-drying facility supply chain', supplier: 'Gujarat Fluorochemicals', quantity: 12, unit: 'tankers', move_status: 'In Transit Hazmat', lot: 'LOT-CIG-0003', destination: 'Ahmedabad', received: '2026-07-29', batch: 'CIG-B2026-0728', cost_inr: 2160000, weight_mt: 24.0, un_class: '2.2' },
  { id: 'CIG-0004', chemical: 'Argon Ar Industrial', description: 'TIG welding argon supply for Tata Steel Jamshedpur plate fabrication shop', supplier: 'Linde India Mumbai', quantity: 480, unit: 'cylinders', move_status: 'Tank Farm Stored', lot: 'LOT-CIG-0004', destination: 'Jamshedpur', received: '2026-07-29', batch: 'CIG-B2026-0727', cost_inr: 672000, weight_mt: 9.6, un_class: '2.2' },
  { id: 'CIG-0005', chemical: 'Hydrogen H2 High Purity', description: 'Ultra-high purity H2 for Reliance Jamnagar refinery hydrocracker unit', supplier: 'Air Liquide Chennai', quantity: 8, unit: 'tankers', move_status: 'UN Class Certified', lot: 'LOT-CIG-0005', destination: 'Jamnagar', received: '2026-07-28', batch: 'CIG-B2026-0726', cost_inr: 4800000, weight_mt: 16.0, un_class: '2.1' },
  { id: 'CIG-0006', chemical: 'CO2 Liquid', description: 'Food-grade CO2 for Coca-Cola bottling plant Gurgaon Haryana facility', supplier: 'Praxair Bengaluru (now Linde)', quantity: 15, unit: 'tankers', move_status: 'Pending PESO', lot: 'LOT-CIG-0006', destination: 'Gurgaon', received: '2026-07-28', batch: 'CIG-B2026-0725', cost_inr: 1875000, weight_mt: 30.0, un_class: '2.2' },
  { id: 'CIG-0007', chemical: 'Chlorine Cl2', description: 'Industrial chlorine for Nirma Ltd caustic soda plant Bhavnagar Gujarat', supplier: 'Gujarat Fluorochemicals', quantity: 6, unit: 'tankers', move_status: 'Awaiting Quality Check', lot: 'LOT-CIG-0007', destination: 'Bhavnagar', received: '2026-07-27', batch: 'CIG-B2026-0724', cost_inr: 2580000, weight_mt: 18.0, un_class: '2.3' },
  { id: 'CIG-0008', chemical: 'LPG Propane-Butane Mix', description: 'Auto LPG bulk transport for Indian Oil Corporation depot Nagpur MP', supplier: 'Bombay Oxygen Corporation', quantity: 22, unit: 'tankers', move_status: 'MSDS Verified', lot: 'LOT-CIG-0008', destination: 'Nagpur', received: '2026-07-27', batch: 'CIG-B2026-0723', cost_inr: 3960000, weight_mt: 44.0, un_class: '2.1' },
  { id: 'CIG-0009', chemical: 'Acetylene C2H2', description: 'Cutting gas for L&T Heavy Engineering Hazira pipeline fabrication project', supplier: 'Universal Industrial Gases Pune', quantity: 320, unit: 'cylinders', move_status: 'In Transit Hazmat', lot: 'LOT-CIG-0009', destination: 'Surat', received: '2026-07-26', batch: 'CIG-B2026-0722', cost_inr: 768000, weight_mt: 6.4, un_class: '2.1' },
  { id: 'CIG-0010', chemical: 'Oxygen O2 Liquid', description: 'Steel-making LOX for JSW Steel Vijayanagar blast furnace Karnataka plant', supplier: 'Praxair Bengaluru (now Linde)', quantity: 24, unit: 'tankers', move_status: 'UN Class Certified', lot: 'LOT-CIG-0010', destination: 'Bellary', received: '2026-07-26', batch: 'CIG-B2026-0721', cost_inr: 4560000, weight_mt: 48.0, un_class: '2.2' },
  { id: 'CIG-0011', chemical: 'Nitrogen N2 Liquid', description: 'Blanketing nitrogen for HPCL Visakhapatnam refinery tank farm operations', supplier: 'National Oxygen Jaipur', quantity: 10, unit: 'tankers', move_status: 'Tank Farm Stored', lot: 'LOT-CIG-0011', destination: 'Visakhapatnam', received: '2026-07-25', batch: 'CIG-B2026-0720', cost_inr: 1800000, weight_mt: 20.0, un_class: '2.2' },
  { id: 'CIG-0012', chemical: 'Argon Ar Industrial', description: 'Shielding gas for BHEL Haridwar heavy forge welding and heat treatment', supplier: 'INOX Air Products Delhi', quantity: 360, unit: 'cylinders', move_status: 'UN Class Certified', lot: 'LOT-CIG-0012', destination: 'Haridwar', received: '2026-07-25', batch: 'CIG-B2026-0719', cost_inr: 504000, weight_mt: 7.2, un_class: '2.2' },
  { id: 'CIG-0013', chemical: 'Hydrogen H2 High Purity', description: 'Green hydrogen pilot supply for NTPC Dadri power generation station', supplier: 'Air Liquide Chennai', quantity: 4, unit: 'tankers', move_status: 'Pending PESO', lot: 'LOT-CIG-0013', destination: 'Gautam Buddha Nagar', received: '2026-07-24', batch: 'CIG-B2026-0718', cost_inr: 2400000, weight_mt: 8.0, un_class: '2.1' },
  { id: 'CIG-0014', chemical: 'CO2 Liquid', description: 'Welding CO2 for Essar Steel plate mill at Hazira Gujarat complex', supplier: 'Bombay Oxygen Corporation', quantity: 20, unit: 'tons', move_status: 'MSDS Verified', lot: 'LOT-CIG-0014', destination: 'Surat', received: '2026-07-24', batch: 'CIG-B2026-0717', cost_inr: 1400000, weight_mt: 20.0, un_class: '2.2' },
  { id: 'CIG-0015', chemical: 'Chlorine Cl2', description: 'Water treatment chlorine for BMC Mumbai municipal water purification plant', supplier: 'Gujarat Fluorochemicals', quantity: 8, unit: 'tankers', move_status: 'UN Class Certified', lot: 'LOT-CIG-0015', destination: 'Mumbai', received: '2026-07-23', batch: 'CIG-B2026-0716', cost_inr: 3440000, weight_mt: 24.0, un_class: '2.3' },
  { id: 'CIG-0016', chemical: 'LPG Propane-Butane Mix', description: 'Domestic LPG bulk fill for HPCL bottling plant Bhopal Madhya Pradesh', supplier: 'Linde India Mumbai', quantity: 30, unit: 'tankers', move_status: 'In Transit Hazmat', lot: 'LOT-CIG-0016', destination: 'Bhopal', received: '2026-07-23', batch: 'CIG-B2026-0715', cost_inr: 5400000, weight_mt: 60.0, un_class: '2.1' },
  { id: 'CIG-0017', chemical: 'Acetylene C2H2', description: 'Portable acetylene kits for railway coach welding at ICF Chennai Perambur', supplier: 'Universal Industrial Gases Pune', quantity: 180, unit: 'cylinders', move_status: 'Awaiting Quality Check', lot: 'LOT-CIG-0017', destination: 'Chennai', received: '2026-07-22', batch: 'CIG-B2026-0714', cost_inr: 432000, weight_mt: 3.6, un_class: '2.1' },
  { id: 'CIG-0018', chemical: 'Oxygen O2 Liquid', description: 'Industrial LOX for SAIL Durgapur steel plant converter operations', supplier: 'National Oxygen Jaipur', quantity: 16, unit: 'tankers', move_status: 'Tank Farm Stored', lot: 'LOT-CIG-0018', destination: 'Durgapur', received: '2026-07-22', batch: 'CIG-B2026-0713', cost_inr: 3040000, weight_mt: 32.0, un_class: '2.2' },
  { id: 'CIG-0019', chemical: 'Nitrogen N2 Liquid', description: 'Purge gas for ONGC Mumbai offshore platform Bassein gas field ops', supplier: 'Air Liquide Chennai', quantity: 6, unit: 'tankers', move_status: 'MSDS Verified', lot: 'LOT-CIG-0019', destination: 'Mumbai', received: '2026-07-21', batch: 'CIG-B2026-0712', cost_inr: 1080000, weight_mt: 12.0, un_class: '2.2' },
  { id: 'CIG-0020', chemical: 'Argon Ar Industrial', description: 'Specialty argon for WELSPUN steel pipe coating at Anjar Kutch Gujarat', supplier: 'Praxair Bengaluru (now Linde)', quantity: 600, unit: 'cylinders', move_status: 'UN Class Certified', lot: 'LOT-CIG-0020', destination: 'Kutch', received: '2026-07-21', batch: 'CIG-B2026-0711', cost_inr: 840000, weight_mt: 12.0, un_class: '2.2' },
]

const genRecords = (start: number) => {
  const statuses = STATUSES
  const suppliers = SUPPLIERS
  return Array.from({ length: 20 }, (_, i) => ({
    id: `CIG-${String(start + i).padStart(4, '0')}`,
    chemical: CHEMICALS[(start + i) % 8],
    description: `${CHEMICALS[(start + i) % 8]} supply for industrial batch ${String((start + i) % 99 + 1).padStart(3, '0')}`,
    supplier: suppliers[(start + i) % 8],
    quantity: Math.round(5 + Math.random() * 500),
    unit: ['cylinders', 'tankers', 'tons'][i % 3],
    move_status: statuses[(start + i) % 6],
    lot: `LOT-CIG-${String(1000 + start + i).padStart(4, '0')}`,
    destination: CITIES[(start + i) % 10],
    received: `2026-07-${String(20 - Math.floor((start + i) / 10)).padStart(2, '0')}`,
    batch: `CIG-B2026-${String(710 - Math.floor((start + i) / 3)).padStart(4, '0')}`,
    cost_inr: Math.round(200000 + Math.random() * 5000000),
    weight_mt: Math.round((1 + Math.random() * 50) * 10) / 10,
    un_class: UN_CLASSES[(start + i) % 3],
  }))
}

const allGas = [...gasRecords, ...genRecords(21), ...genRecords(41)]

function ri(min: number, max: number, value: number) {
  return Math.max(min, Math.min(max, value))
}

const filterGroups = [
  {
    key: 'chemical',
    label: 'Chemical Type',
    options: CHEMICALS.map(c => ({ label: c, value: c, count: allGas.filter(r => r.chemical === c).length })),
  },
  {
    key: 'supplier',
    label: 'Supplier',
    options: SUPPLIERS.map(s => ({ label: s, value: s, count: allGas.filter(r => r.supplier === s).length })),
  },
  {
    key: 'move_status',
    label: 'Movement Status',
    options: STATUSES.map(s => ({ label: s, value: s, count: allGas.filter(r => r.move_status === s).length })),
  },
]

function ChemicalBadge({ chemical }: { chemical: string }) {
  const colors: Record<string, string> = { 'Acetylene C2H2': 'bg-orange-100 text-orange-800', 'Oxygen O2 Liquid': 'bg-blue-100 text-blue-800', 'Nitrogen N2 Liquid': 'bg-cyan-100 text-cyan-800', 'Argon Ar Industrial': 'bg-purple-100 text-purple-800', 'Hydrogen H2 High Purity': 'bg-green-100 text-green-800', 'CO2 Liquid': 'bg-gray-100 text-gray-800', 'Chlorine Cl2': 'bg-red-100 text-red-800', 'LPG Propane-Butane Mix': 'bg-amber-100 text-amber-800' }
  return <span className={`cig-chemical-badge inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[chemical] || 'bg-gray-100 text-gray-800'}`}>{chemical}</span>
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = { 'UN Class Certified': 'bg-green-100 text-green-800', 'MSDS Verified': 'bg-blue-100 text-blue-800', 'In Transit Hazmat': 'bg-orange-100 text-orange-800', 'Tank Farm Stored': 'bg-slate-100 text-slate-800', 'Pending PESO': 'bg-red-100 text-red-800', 'Awaiting Quality Check': 'bg-yellow-100 text-yellow-800' }
  return <span className={`cig-status-badge inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-700'}`}>{status}</span>
}

function CostBar({ cost }: { cost: number }) {
  const pct = ri(0, 100, (cost / 5000000) * 100)
  const color = cost >= 3000000 ? 'bg-orange-600' : cost >= 1000000 ? 'bg-orange-500' : cost >= 500000 ? 'bg-orange-400' : 'bg-orange-300'
  return <div className="cig-cost-bar flex items-center gap-2"><div className="h-2 w-20 rounded-full bg-gray-200"><div className={`cig-cost-bar-fill h-2 rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} /></div><span className="text-xs text-gray-500">{'₹' + (cost / 100000).toFixed(1) + 'L'}</span></div>
}

function HealthRing({ value, label, color }: { value: number; label: string; color: string }) {
  const r = 28, cx = 35, cy = 35, sw = 5
  const circ = 2 * Math.PI * r
  const offset = circ - (ri(0, 100, value) / 100) * circ
  return <div className="cig-health-ring flex flex-col items-center"><svg width={70} height={70} className="-rotate-90"><circle cx={cx} cy={cy} r={r} fill="none" stroke="#e5e7eb" strokeWidth={sw} /><circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={sw} strokeDasharray={circ} strokeDashoffset={offset} className="cig-ring-path" strokeLinecap="round" /></svg><span className="cig-ring-value mt-1 text-sm font-bold" style={{ color }}>{value}%</span><span className="text-xs text-gray-500">{label}</span></div>
}

function KpiTile({ title, value, sub }: { title: string; value: string; sub: string }) {
  return <Card className="cig-kpi-card"><CardContent className="p-4"><p className="text-xs text-gray-500">{title}</p><p className="cig-kpi-value mt-1 text-2xl font-bold">{value}</p><p className="text-xs text-gray-400 mt-0.5">{sub}</p></CardContent></Card>
}

function ValueTile({ title, value, trend }: { title: string; value: string; trend: string }) {
  const up = trend.startsWith('+')
  return <Card className="cig-value-tile"><CardContent className="p-4"><p className="text-xs text-gray-500">{title}</p><p className="mt-1 text-xl font-bold">{value}</p><p className={`text-xs mt-0.5 ${up ? 'text-green-600' : 'text-red-500'}`}>{trend}</p></CardContent></Card>
}

export default function ChemicalIndustrialGasesView() {
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

  const filtered = allGas.filter(r => {
    const q = searchQuery.toLowerCase()
    if (q && !r.id.toLowerCase().includes(q) && !r.chemical.toLowerCase().includes(q) && !r.description.toLowerCase().includes(q) && !r.supplier.toLowerCase().includes(q) && !r.destination.toLowerCase().includes(q)) return false
    return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string))
  })

  const totalCost = allGas.reduce((s, r) => s + r.cost_inr, 0)
  const certifiedCount = allGas.filter(r => r.move_status === 'UN Class Certified').length
  const pendingPeso = allGas.filter(r => r.move_status === 'Pending PESO').length

  const monthlyData = [
    { month: 'Jan', shipments: 22, value_cr: 45, compliance: 97 },
    { month: 'Feb', shipments: 28, value_cr: 62, compliance: 96 },
    { month: 'Mar', shipments: 18, value_cr: 38, compliance: 98 },
    { month: 'Apr', shipments: 32, value_cr: 71, compliance: 95 },
    { month: 'May', shipments: 25, value_cr: 54, compliance: 97 },
    { month: 'Jun', shipments: 15, value_cr: 33, compliance: 96 },
    { month: 'Jul', shipments: 30, value_cr: 66, compliance: 98 },
  ]
  const chemData = CHEMICALS.map(c => ({ chemical: c, count: allGas.filter(r => r.chemical === c).length }))
  const suppData = SUPPLIERS.map(s => ({ supplier: s, count: allGas.filter(r => r.supplier === s).length }))

  const tabs = [
    { value: 'dashboard', label: 'Dashboard' },
    { value: 'shipments', label: 'Shipments' },
    { value: 'analytics', label: 'Analytics' },
    { value: 'insights', label: 'Insights' },
  ]

  return (
    <div className="cig-container space-y-4">
      <PageHeader title="Chemical & Industrial Gases Logistics" description="Hazardous chemical and industrial gas logistics with PESO compliance, UN classification tracking, MSDS verification, hazmat transport management, and tank farm operations across Indian industrial corridors" />
      <ModuleBreadcrumb items={[{ label: 'Specialized Logistics' }, { label: 'Chemical Gases' }]} />
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="cig-tabs-list">
          {tabs.map(t => <TabsTrigger key={t.value} value={t.value} className="cig-tab-trigger">{t.label}</TabsTrigger>)}
        </TabsList>

        <TabsContent value="dashboard" className="cig-tab-content space-y-4 mt-4">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <KpiTile title="Total Shipments" value={allGas.length.toString()} sub="Gas consignments" />
            <KpiTile title="Total Value" value={`₹${(totalCost / 10000000).toFixed(0)}Cr`} sub="Inventory value" />
            <KpiTile title="UN Certified" value={certifiedCount.toString()} sub={`${((certifiedCount / allGas.length) * 100).toFixed(0)}% cleared`} />
            <KpiTile title="Pending PESO" value={pendingPeso.toString()} sub="Awaiting clearance" />
          </div>

          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <ValueTile title="Avg Shipment Value" value="₹18.4L" trend="+6.2% vs last quarter" />
            <ValueTile title="Hazmat Compliance" value="94.8%" trend="+2.1% improved" />
            <ValueTile title="Tanker Utilization" value="87.3%" trend="+4.5% efficiency" />
            <ValueTile title="PESO Clearance" value="91.6%" trend="-1.2% delay" />
          </div>

          <div className="flex flex-wrap gap-3 items-center p-3 rounded-lg border bg-gray-50">
            <ChemicalBadge chemical="Acetylene C2H2" />
            <ChemicalBadge chemical="Chlorine Cl2" />
            <StatusBadge status="In Transit Hazmat" />
            <StatusBadge status="Pending PESO" />
            <CostBar cost={3500000} />

          </div>
          <div className="grid gap-4 grid-cols-3 md:grid-cols-6">
            <HealthRing value={98} label="PESO Compliant" color="#ea580c" />
            <HealthRing value={96} label="MSDS Verified" color="#c2410c" />
            <HealthRing value={94} label="Hazmat Safe" color="#f97316" />
            <HealthRing value={92} label="Tank Integrity" color="#fb923c" />
            <HealthRing value={97} label="Leak Proof" color="#9a3412" />
            <HealthRing value={99} label="Emergency" color="#7c2d12" />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="cig-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Monthly Shipment Volume {'&'} Cost Trend</CardTitle></CardHeader><CardContent><LineChart data={monthlyData} width={300} height={200}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" fontSize={12} /><YAxis fontSize={12} /><Tooltip /><Legend /><Line type="monotone" dataKey="shipments" stroke="#ea580c" strokeWidth={2} /><Line type="monotone" dataKey="value_cr" stroke="#c2410c" strokeWidth={2} strokeDasharray="5 5" /></LineChart></CardContent></Card>
            <Card className="cig-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Shipments by Chemical Type</CardTitle></CardHeader><CardContent><BarChart data={chemData} width={300} height={200}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="chemical" fontSize={10} angle={-30} textAnchor="end" height={50} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="count" fill="#ea580c" radius={[4,4,0,0]} /></BarChart></CardContent></Card>
            <Card className="cig-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Supplier Distribution</CardTitle></CardHeader><CardContent><PieChart width={300} height={200}><Pie data={suppData} dataKey="count" nameKey="supplier" cx="50%" cy="50%" outerRadius={70} label={({ supplier, count }) => `${count}`}>{suppData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="shipments" className="cig-tab-content space-y-4 mt-4">
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={allGas.length} filteredCount={filtered.length} onRefresh={() => {}} placeholder="Search by ID, chemical, supplier, destination, or lot..." />
          <div className="overflow-x-auto rounded-lg border">
            <table className="cig-table w-full text-sm">
              <thead><tr className="cig-table-header bg-gray-50"><th className="px-3 py-2 text-left font-medium">ID</th><th className="px-3 py-2 text-left font-medium">Chemical</th><th className="px-3 py-2 text-left font-medium">Status</th><th className="px-3 py-2 text-left font-medium">Qty</th><th className="px-3 py-2 text-left font-medium">Cost</th><th className="px-3 py-2 text-left font-medium">Supplier</th><th className="px-3 py-2 text-left font-medium">Destination</th><th className="px-3 py-2 text-left font-medium">Lot</th><th className="px-3 py-2 text-left font-medium">UN</th></tr></thead>
              <tbody>{filtered.slice(0, 20).map(r => (
                <tr key={r.id} className="cig-table-row border-t hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-2 font-mono text-xs">{r.id}</td>
                  <td className="px-3 py-2"><ChemicalBadge chemical={r.chemical} /></td>
                  <td className="px-3 py-2"><StatusBadge status={r.move_status} /></td>
                  <td className="px-3 py-2 text-xs">{r.quantity.toLocaleString('en-IN')} {r.unit}</td>
                  <td className="px-3 py-2"><CostBar cost={r.cost_inr} /></td>
                  <td className="px-3 py-2 text-xs">{r.supplier}</td>
                  <td className="px-3 py-2 text-xs">{r.destination}</td>
                  <td className="px-3 py-2 text-xs font-mono">{r.lot}</td>
                  <td className="px-3 py-2 text-xs">{r.un_class}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="cig-tab-content space-y-4 mt-4">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <ValueTile title="Avg Shipment Cost" value="₹22.6L" trend="+5.8% vs last quarter" />
            <ValueTile title="PESO Approval Rate" value="92.4%" trend="+3.1% improved" />
            <ValueTile title="Hazmat Incidents" value="0" trend="Zero incidents" />
            <ValueTile title="UN Classification" value="100%" trend="Full compliance" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="cig-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Cost by Chemical Category</CardTitle></CardHeader><CardContent><BarChart data={CHEMICALS.map(c => ({ chemical: c, total: allGas.filter(r => r.chemical === c).reduce((s, r) => s + r.cost_inr, 0) / 100000 }))} width={400} height={250}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="chemical" fontSize={10} angle={-30} textAnchor="end" height={50} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="total" fill="#c2410c" radius={[4,4,0,0]} /></BarChart></CardContent></Card>
            <Card className="cig-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Status Breakdown</CardTitle></CardHeader><CardContent><PieChart width={400} height={250}><Pie data={STATUSES.map(s => ({ status: s, count: allGas.filter(r => r.move_status === s).length }))} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={80} label>{STATUSES.map((_, i) => <Cell key={i} fill={['#22c55e','#3b82f6','#f97316','#9ca3af','#ef4444','#eab308'][i]} />)}</Pie><Tooltip /></PieChart></CardContent></Card>
            <Card className="cig-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Monthly Compliance Trend</CardTitle></CardHeader><CardContent><LineChart data={monthlyData} width={400} height={250}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" fontSize={12} /><YAxis fontSize={12} /><Tooltip /><Legend /><Line type="monotone" dataKey="compliance" stroke="#ea580c" strokeWidth={2} /></LineChart></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="cig-tab-content space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="cig-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">PESO Explosives License Compliance for Industrial Gas Transport</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Petroleum and Explosives Safety Organisation (PESO) license compliance for industrial gas transport under the Static and Mobile Pressure Vessels (Unfired) Rules 2016. Automated renewal tracking for Form IV transport licenses across 340+ hazardous gas tankers. Real-time PESO license expiry alerts with 90/60/30-day escalation. Integration with District Magistrate NOC processing for inter-state cylinder movement across Indian states.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-orange-100 px-2 py-0.5 text-orange-800">Critical</span><span className="text-gray-400">Live</span></div></CardContent></Card>
            <Card className="cig-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">CDSCO Drug License for Medical Oxygen Distribution During COVID Surge</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Central Drugs Standard Control Organisation (CDSCO) drug license compliance for medical-grade oxygen distribution. Post-COVID surge capacity maintained at 150% with 48-hour emergency deployment across 1,200+ hospitals nationwide. Automated CDSCO Form 25/26 license tracking for 8 medical gas manufacturing facilities. Real-time LOX tanker GPS tracking with temperature excursion alerts for pharma supply chain integrity.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-red-800">Regulatory</span><span className="text-gray-400">Q3 2026</span></div></CardContent></Card>
            <Card className="cig-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">NHAI Hazmat Corridor Restrictions and Multi-Axle Tanker Routing</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>National Highways Authority of India (NHAI) hazmat corridor restrictions and multi-axle tanker routing optimization across Indian national highways. Automated route planning avoiding 87 restricted NH stretches and 23 urban prohibited zones. Real-time RTO permit validation for Class 2.1/2.2/2.3 gas transport vehicles. Integration with FASTag toll data for hazmat-optimized corridor selection across 1,38,000 km NH network.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-blue-800">Strategic</span><span className="text-gray-400">FY2027</span></div></CardContent></Card>
            <Card className="cig-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">AI Gas Leak Prediction and IoT Sensor-Based Tank Monitoring</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>AI-powered gas leak prediction model using IoT sensor data from 2,400+ tank farm monitoring points across India. Machine learning algorithm achieving 99.2% leak detection accuracy with 15-minute advance warning capability. Integration with National Disaster Response Force (NDRF) alert protocol for Class 2.3 toxic gas incidents. Automated shutdown valve activation for chlorine and hydrogen storage facilities across 12 major Indian ports.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-purple-100 px-2 py-0.5 text-purple-800">Innovation</span><span className="text-gray-400">Pilot</span></div></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
