import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#65a30d', '#4d7c0f', '#84cc16', '#a3e635', '#bef264', '#3f6212', '#365314', '#f7fee7']

const FERTILIZERS = ['Urea 46% N', 'DAP 18:46:0', 'MOP 60% K2O', 'NPK 10:26:26', 'SSP 16% P2O5', 'Zinc Sulphate', 'Neem Coated Urea', 'Organic Vermicompost']
const MANUFACTURERS = ['IFFCO New Delhi', 'Chambal Fertilizer Kota', 'NFL Noida', 'CFCL Vijayawada', 'RCF Mumbai', 'GSFC Gujarat', 'Coromandel International Chennai', 'Paradeep Phosphates Odisha']
const STATUSES = ['FCO Licensed', 'NABL Tested', 'In Transit Rail', 'Godown Stored', 'Pending DBT Subsidy', 'Awaiting Kharif Dispatch']
const CITIES = ['Ludhiana', 'Indore', 'Bhopal', 'Nagpur', 'Jaipur', 'Patna', 'Lucknow', 'Hyderabad', 'Bhubaneswar', 'Mysore']

function ri(min: number, max: number, value: number) {
  return Math.max(min, Math.min(max, value))
}

const fertilizerRecords = [
  { id: 'FAC-0001', fertilizer: 'Urea 46% N', description: 'Neem coated urea for Kharif paddy in Punjab under NBS scheme with PM Kisan DBT subsidy', manufacturer: 'IFFCO New Delhi', quantity: 3200, unit: 'MT', move_status: 'FCO Licensed', lot: 'LOT-FAC-1001', destination: 'Ludhiana', received: '2026-07-20', batch: 'FAC-B2026-0720', cost_inr: 9600000, weight_mt: 3200.0, subsidy_pct: 68.5 },
  { id: 'FAC-0002', fertilizer: 'DAP 18:46:0', description: 'DAP granular for soybean Kharif sowing in Madhya Pradesh via rail rake from Paradip port', manufacturer: 'Paradeep Phosphates Odisha', quantity: 1800, unit: 'MT', move_status: 'In Transit Rail', lot: 'LOT-FAC-1002', destination: 'Indore', received: '2026-07-19', batch: 'FAC-B2026-0719', cost_inr: 14400000, weight_mt: 1800.0, subsidy_pct: 55.2 },
  { id: 'FAC-0003', fertilizer: 'MOP 60% K2O', description: 'Muriate of potash for cotton Rabi prep in Maharashtra godown stored at Nagpur APMC', manufacturer: 'GSFC Gujarat', quantity: 850, unit: 'MT', move_status: 'Godown Stored', lot: 'LOT-FAC-1003', destination: 'Nagpur', received: '2026-07-18', batch: 'FAC-B2026-0718', cost_inr: 7650000, weight_mt: 850.0, subsidy_pct: 42.0 },
  { id: 'FAC-0004', fertilizer: 'NPK 10:26:26', description: 'NPK complex for sugarcane top dressing in Uttar Pradesh NABL tested at Lucknow lab', manufacturer: 'Chambal Fertilizer Kota', quantity: 1200, unit: 'bags', move_status: 'NABL Tested', lot: 'LOT-FAC-1004', destination: 'Lucknow', received: '2026-07-17', batch: 'FAC-B2026-0717', cost_inr: 5400000, weight_mt: 60.0, subsidy_pct: 48.8 },
  { id: 'FAC-0005', fertilizer: 'SSP 16% P2O5', description: 'Single super phosphate for groundnut Kharif in Rajasthan awaiting DBT subsidy clearance', manufacturer: 'GSFC Gujarat', quantity: 2400, unit: 'bags', move_status: 'Pending DBT Subsidy', lot: 'LOT-FAC-1005', destination: 'Jaipur', received: '2026-07-16', batch: 'FAC-B2026-0716', cost_inr: 2880000, weight_mt: 120.0, subsidy_pct: 38.5 },
  { id: 'FAC-0006', fertilizer: 'Zinc Sulphate', description: 'Zinc sulphate heptahydrate 21% Zn for rice zinc deficiency correction in Bihar paddy', manufacturer: 'NFL Noida', quantity: 450, unit: 'quentals', move_status: 'Awaiting Kharif Dispatch', lot: 'LOT-FAC-1006', destination: 'Patna', received: '2026-07-15', batch: 'FAC-B2026-0715', cost_inr: 1350000, weight_mt: 45.0, subsidy_pct: 35.0 },
  { id: 'FAC-0007', fertilizer: 'Neem Coated Urea', description: 'Neem coated urea 46% N for wheat Rabi pre-positioning at Bhopal regional godown', manufacturer: 'IFFCO New Delhi', quantity: 5000, unit: 'bags', move_status: 'Godown Stored', lot: 'LOT-FAC-1007', destination: 'Bhopal', received: '2026-07-14', batch: 'FAC-B2026-0714', cost_inr: 15000000, weight_mt: 250.0, subsidy_pct: 72.0 },
  { id: 'FAC-0008', fertilizer: 'Organic Vermicompost', description: 'Organic vermicompost NPK 1.5-1-1.5 for zero budget natural farming in Karnataka', manufacturer: 'Coromandel International Chennai', quantity: 600, unit: 'tons', move_status: 'FCO Licensed', lot: 'LOT-FAC-1008', destination: 'Mysore', received: '2026-07-13', batch: 'FAC-B2026-0713', cost_inr: 900000, weight_mt: 600.0, subsidy_pct: 25.0 },
  { id: 'FAC-0009', fertilizer: 'Urea 46% N', description: 'Prilled urea for jute retting in West Bengal FCO licensed batch from RCF Mumbai plant', manufacturer: 'RCF Mumbai', quantity: 2800, unit: 'MT', move_status: 'FCO Licensed', lot: 'LOT-FAC-1009', destination: 'Bhubaneswar', received: '2026-07-12', batch: 'FAC-B2026-0712', cost_inr: 8400000, weight_mt: 2800.0, subsidy_pct: 70.2 },
  { id: 'FAC-0010', fertilizer: 'DAP 18:46:0', description: 'DAP for Kharif maize in Telangana rail dispatch via Secunderabad to Hyderabad APMC', manufacturer: 'CFCL Vijayawada', quantity: 1500, unit: 'MT', move_status: 'In Transit Rail', lot: 'LOT-FAC-1010', destination: 'Hyderabad', received: '2026-07-11', batch: 'FAC-B2026-0711', cost_inr: 12000000, weight_mt: 1500.0, subsidy_pct: 58.0 },
  { id: 'FAC-0011', fertilizer: 'MOP 60% K2O', description: 'Potash for onion Rabi in Nashik region stored at Chambal Fertilizer Kota depot', manufacturer: 'Chambal Fertilizer Kota', quantity: 720, unit: 'MT', move_status: 'Godown Stored', lot: 'LOT-FAC-1011', destination: 'Nagpur', received: '2026-07-10', batch: 'FAC-B2026-0710', cost_inr: 6480000, weight_mt: 720.0, subsidy_pct: 44.5 },
  { id: 'FAC-0012', fertilizer: 'NPK 10:26:26', description: 'NPK grade for potato Kharif in Meerut Uttar Pradesh pending DBT PM Kisan linkage', manufacturer: 'NFL Noida', quantity: 950, unit: 'bags', move_status: 'Pending DBT Subsidy', lot: 'LOT-FAC-1012', destination: 'Lucknow', received: '2026-07-09', batch: 'FAC-B2026-0709', cost_inr: 4275000, weight_mt: 47.5, subsidy_pct: 50.0 },
  { id: 'FAC-0013', fertilizer: 'SSP 16% P2O5', description: 'SSP for mustard Rabi in Alwar Rajasthan awaiting Kharif dispatch to district cooperative', manufacturer: 'GSFC Gujarat', quantity: 1800, unit: 'bags', move_status: 'Awaiting Kharif Dispatch', lot: 'LOT-FAC-1013', destination: 'Jaipur', received: '2026-07-08', batch: 'FAC-B2026-0708', cost_inr: 2160000, weight_mt: 90.0, subsidy_pct: 40.2 },
  { id: 'FAC-0014', fertilizer: 'Zinc Sulphate', description: 'Zinc sulphate monohydrate for paddy zinc deficiency in Ludhiana Punjab NABL tested', manufacturer: 'NFL Noida', quantity: 350, unit: 'quentals', move_status: 'NABL Tested', lot: 'LOT-FAC-1014', destination: 'Ludhiana', received: '2026-07-07', batch: 'FAC-B2026-0707', cost_inr: 1050000, weight_mt: 35.0, subsidy_pct: 32.0 },
  { id: 'FAC-0015', fertilizer: 'Neem Coated Urea', description: 'Neem coated urea for cotton Kharif in Indore MP via IFFCO cooperative society network', manufacturer: 'IFFCO New Delhi', quantity: 4200, unit: 'bags', move_status: 'FCO Licensed', lot: 'LOT-FAC-1015', destination: 'Indore', received: '2026-07-06', batch: 'FAC-B2026-0706', cost_inr: 12600000, weight_mt: 210.0, subsidy_pct: 74.0 },
  { id: 'FAC-0016', fertilizer: 'Organic Vermicompost', description: 'Vermicompost for organic farming Sikkim state NPOP certified FCO licensed lot dispatch', manufacturer: 'Coromandel International Chennai', quantity: 800, unit: 'tons', move_status: 'FCO Licensed', lot: 'LOT-FAC-1016', destination: 'Bhopal', received: '2026-07-05', batch: 'FAC-B2026-0705', cost_inr: 1200000, weight_mt: 800.0, subsidy_pct: 30.0 },
  { id: 'FAC-0017', fertilizer: 'Urea 46% N', description: 'Urea for basmati rice Kharif in Karnal Haryana via rail rake from IFFCO Phulpur plant', manufacturer: 'IFFCO New Delhi', quantity: 3600, unit: 'MT', move_status: 'In Transit Rail', lot: 'LOT-FAC-1017', destination: 'Ludhiana', received: '2026-07-04', batch: 'FAC-B2026-0704', cost_inr: 10800000, weight_mt: 3600.0, subsidy_pct: 69.0 },
  { id: 'FAC-0018', fertilizer: 'DAP 18:46:0', description: 'DAP for pulses Kharif in Gulbarga Karnataka NABL tested at Bengaluru fertilizer lab', manufacturer: 'CFCL Vijayawada', quantity: 1100, unit: 'MT', move_status: 'NABL Tested', lot: 'LOT-FAC-1018', destination: 'Mysore', received: '2026-07-03', batch: 'FAC-B2026-0703', cost_inr: 8800000, weight_mt: 1100.0, subsidy_pct: 56.5 },
  { id: 'FAC-0019', fertilizer: 'MOP 60% K2O', description: 'Potash for banana and grape Rabi in Maharashtra via RCF Mumbai warehousing network', manufacturer: 'RCF Mumbai', quantity: 680, unit: 'MT', move_status: 'Godown Stored', lot: 'LOT-FAC-1019', destination: 'Nagpur', received: '2026-07-02', batch: 'FAC-B2026-0702', cost_inr: 6120000, weight_mt: 680.0, subsidy_pct: 46.0 },
  { id: 'FAC-0020', fertilizer: 'NPK 10:26:26', description: 'NPK for vegetable Kharif in Patna Bihar pending DBT subsidy under PM Kisan SAMMAN', manufacturer: 'Chambal Fertilizer Kota', quantity: 750, unit: 'bags', move_status: 'Pending DBT Subsidy', lot: 'LOT-FAC-1020', destination: 'Patna', received: '2026-07-01', batch: 'FAC-B2026-0701', cost_inr: 3375000, weight_mt: 37.5, subsidy_pct: 52.0 },
]

const genRecords = (start: number) => {
  const statuses = STATUSES
  const manufacturers = MANUFACTURERS
  return Array.from({ length: 20 }, (_, i) => ({
    id: `FAC-${String(start + i).padStart(4, '0')}`,
    fertilizer: FERTILIZERS[(start + i) % 8],
    description: `${FERTILIZERS[(start + i) % 8]} supply for Kharif batch ${String((start + i) % 99 + 1).padStart(3, '0')}`,
    manufacturer: manufacturers[(start + i) % 8],
    quantity: Math.round(10 + Math.random() * 500),
    unit: ['MT', 'bags', 'tons', 'quentals'][i % 4],
    move_status: statuses[(start + i) % 6],
    lot: `LOT-FAC-${String(1000 + start + i).padStart(4, '0')}`,
    destination: CITIES[(start + i) % 10],
    received: `2026-07-${String(20 - Math.floor((start + i) / 10)).padStart(2, '0')}`,
    batch: `FAC-B2026-${String(710 - Math.floor((start + i) / 3)).padStart(4, '0')}`,
    cost_inr: Math.round(80000 + Math.random() * 3000000),
    weight_mt: Math.round((5 + Math.random() * 100) * 10) / 10,
    subsidy_pct: Math.round((30 + Math.random() * 50) * 10) / 10,
  }))
}

const allFertilizer = [...fertilizerRecords, ...genRecords(21), ...genRecords(41)]

const filterGroups = [
  {
    key: 'fertilizer',
    label: 'Fertilizer Type',
    options: FERTILIZERS.map(f => ({ label: f, value: f, count: allFertilizer.filter(r => r.fertilizer === f).length })),
  },
  {
    key: 'move_status',
    label: 'Status',
    options: STATUSES.map(s => ({ label: s, value: s, count: allFertilizer.filter(r => r.move_status === s).length })),
  },
  {
    key: 'manufacturer',
    label: 'Manufacturer',
    options: MANUFACTURERS.map(m => ({ label: m, value: m, count: allFertilizer.filter(r => r.manufacturer === m).length })),
  },
]

function FertilizerBadge({ fertilizer }: { fertilizer: string }) {
  const c = COLORS[FERTILIZERS.indexOf(fertilizer) % COLORS.length]
  return <span className="fac-fertilizer-badge inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium" style={{ background: c + '22', color: c, border: `1px solid ${c}44` }}>{fertilizer}</span>
}

function StatusBadge({ status }: { status: string }) {
  const c = status === 'FCO Licensed' ? '#16a34a' : status === 'NABL Tested' ? '#2563eb' : status === 'In Transit Rail' ? '#d97706' : status === 'Godown Stored' ? '#65a30d' : status === 'Pending DBT Subsidy' ? '#dc2626' : '#6b7280'
  return <span className="fac-status-badge inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ background: c + '22', color: c, border: `1px solid ${c}44` }}>{status}</span>
}

function CostBar({ cost }: { cost: number }) {
  const pct = ri(0, 100, (cost / 3000000) * 100)
  return <div className="fac-cost-bar flex items-center gap-2"><div className="h-2 w-20 rounded-full bg-gray-200"><div className="h-2 rounded-full transition-all" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${COLORS[1]}, ${COLORS[0]})` }} /></div><span className="text-xs text-gray-500">{'\u20B9' + (cost / 10000000).toFixed(1) + 'Cr'}</span></div>
}

function HealthRing({ value, label, color }: { value: number; label: string; color: string }) {
  const r = 28, cx = 35, cy = 35, sw = 5
  const circ = 2 * Math.PI * r
  const offset = circ - (ri(0, 100, value) / 100) * circ
  return <div className="fac-health-ring flex flex-col items-center"><svg width={70} height={70} className="-rotate-90"><circle cx={cx} cy={cy} r={r} fill="none" stroke="#e5e7eb" strokeWidth={sw} /><circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={sw} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" /></svg><span className="fac-ring-value mt-1 text-sm font-bold" style={{ color }}>{value}%</span><span className="text-xs text-gray-500">{label}</span></div>
}

function KpiTile({ title, value, sub }: { title: string; value: string; sub: string }) {
  return (
    <Card className="fac-kpi-card"><CardContent className="p-4"><p className="text-xs text-gray-500">{title}</p><p className="fac-kpi-value mt-1 text-2xl font-bold" style={{ color: COLORS[0] }}>{value}</p><p className="text-xs text-gray-400 mt-0.5">{sub}</p></CardContent></Card>
  )
}

function ValueTile({ title, value, trend }: { title: string; value: string; trend: string }) {
  const up = trend.startsWith('+')
  return (
    <Card className="fac-value-tile"><CardContent className="p-4"><p className="text-xs text-gray-500">{title}</p><p className="mt-1 text-xl font-bold">{value}</p><p className={`text-xs mt-0.5 ${up ? 'text-green-600' : 'text-red-500'}`}>{trend}</p></CardContent></Card>
  )
}

export default function FertilizerAgriChemicalsView() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})

  const filtered = useMemo(() => {
    return allFertilizer.filter(r => {
      const q = searchQuery.toLowerCase()
      if (q && !r.id.toLowerCase().includes(q) && !r.fertilizer.toLowerCase().includes(q) &&
        !r.description.toLowerCase().includes(q) && !r.manufacturer.toLowerCase().includes(q) && !r.destination.toLowerCase().includes(q)) return false
      return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(String(r[key as keyof typeof r])))
    })
  }, [searchQuery, activeFilters])

  const totalCost = allFertilizer.reduce((s, r) => s + r.cost_inr, 0)
  const totalWeight = allFertilizer.reduce((s, r) => s + r.weight_mt, 0)
  const fcoLicensed = allFertilizer.filter(r => r.move_status === 'FCO Licensed').length
  const nablTested = allFertilizer.filter(r => r.move_status === 'NABL Tested').length

  const pieData = STATUSES.map(s => ({ name: s, value: allFertilizer.filter(r => r.move_status === s).length }))
  const barData = FERTILIZERS.slice(0, 6).map(f => ({ name: f.split(' ')[0], cost: allFertilizer.filter(r => r.fertilizer === f).reduce((a, r) => a + r.cost_inr, 0) / 10000000 }))
  const lineData = [{ month: 'Jan', subsidy: 48, weight: 2800 }, { month: 'Feb', subsidy: 52, weight: 3200 },
    { month: 'Mar', subsidy: 58, weight: 4100 }, { month: 'Apr', subsidy: 45, weight: 2600 },
    { month: 'May', subsidy: 38, weight: 1900 }, { month: 'Jun', subsidy: 42, weight: 2200 },
    { month: 'Jul', subsidy: 62, weight: 4500 }]

  const tabs = [
    { value: 'dashboard', label: 'Dashboard' },
    { value: 'shipments', label: 'Shipments' },
    { value: 'analytics', label: 'Analytics' },
    { value: 'insights', label: 'Insights' },
  ]

  return (
    <div className="fac-container space-y-4">
      <PageHeader title="Fertilizer & Agri Chemicals Logistics" description="Track fertilizer and agri-chemical shipments across Indian warehouses with FCO licensing, NABL testing, NBS subsidy, and PM Kisan DBT compliance for Kharif and Rabi seasons" />
      <ModuleBreadcrumb items={[{ label: 'Agri Logistics' }, { label: 'Fertilizer & Agri Chemicals' }]} />
      <Tabs defaultValue="dashboard">
        <TabsList className="fac-tabs-list">
          {tabs.map(t => <TabsTrigger key={t.value} value={t.value} className="fac-tab-trigger">{t.label}</TabsTrigger>)}
        </TabsList>

        <TabsContent value="dashboard" className="fac-tab-content space-y-4 mt-4">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <KpiTile title="Total Shipments" value={allFertilizer.length.toString()} sub="Fertilizer consignments" />
            <KpiTile title="Total Value" value={`\u20B9${(totalCost / 10000000).toFixed(0)}Cr`} sub="Cargo value in INR" />
            <KpiTile title="FCO Licensed" value={fcoLicensed.toString()} sub={`${((fcoLicensed / allFertilizer.length) * 100).toFixed(0)}% certified`} />
            <KpiTile title="NABL Tested" value={nablTested.toString()} sub={`${((nablTested / allFertilizer.length) * 100).toFixed(0)}% tested`} />
          </div>
          <div className="grid gap-4 grid-cols-3 md:grid-cols-6">
            <HealthRing value={94} label="FCO Compliance" color="#65a30d" />
            <HealthRing value={88} label="NBS Subsidy" color="#4d7c0f" />
            <HealthRing value={76} label="DBT Linked" color="#84cc16" />
            <HealthRing value={92} label="Rail Dispatch" color="#3f6212" />
            <HealthRing value={85} label="Godown Util" color="#365314" />
            <HealthRing value={97} label="Kharif Ready" color="#a3e635" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Top Fertilizer Types</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2"><FertilizerBadge fertilizer="Urea 46% N" /><FertilizerBadge fertilizer="DAP 18:46:0" /></div>
                <ValueTile title="Avg Subsidy Pct" value={`${(allFertilizer.reduce((s, r) => s + r.subsidy_pct, 0) / allFertilizer.length).toFixed(1)}%`} trend="+3.2% vs FY25" />
                <ValueTile title="Avg Weight" value={`${(totalWeight / allFertilizer.length).toFixed(1)} MT`} trend="+5.1% vs Q1" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Shipment Cost Overview</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 mb-1"><StatusBadge status="FCO Licensed" /></div>
                <CostBar cost={totalCost / 3} />
                <ValueTile title="Highest Cost" value={`\u20B9${Math.max(...allFertilizer.map(r => r.cost_inr)).toLocaleString('en-IN')}`} trend="FAC-0001" />
                <ValueTile title="Pending DBT" value={`\u20B9${allFertilizer.filter(r => r.move_status === 'Pending DBT Subsidy').reduce((a, r) => a + r.cost_inr, 0).toLocaleString('en-IN')}`} trend="-2.8% vs Q1" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="shipments" className="fac-tab-content space-y-4 mt-4">
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups}
            onToggleFilter={(key, val) => setActiveFilters(p => ({ ...p, [key]: p[key]?.includes(val) ? p[key].filter(v => v !== val) : [...(p[key] || []), val] }))} onClearAllFilters={() => setActiveFilters({})} totalItems={allFertilizer.length} filteredCount={filtered.length} onRefresh={() => {}} placeholder="Search by ID, fertilizer, manufacturer, destination, or lot..." />
          <div className="overflow-x-auto rounded-lg border">
            <table className="fac-table w-full text-sm">
              <thead><tr className="fac-table-header bg-gray-50">
                <th className="px-3 py-2 text-left font-medium">ID</th><th className="px-3 py-2 text-left font-medium">Fertilizer</th><th className="px-3 py-2 text-left font-medium">Status</th><th className="px-3 py-2 text-left font-medium">Qty</th><th className="px-3 py-2 text-left font-medium">Cost</th><th className="px-3 py-2 text-left font-medium">Manufacturer</th><th className="px-3 py-2 text-left font-medium">Destination</th><th className="px-3 py-2 text-left font-medium">Subsidy</th>
              </tr></thead>
              <tbody>{filtered.slice(0, 20).map(r => (
                <tr key={r.id} className="fac-table-row border-t hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-2 font-mono text-xs">{r.id}</td>
                  <td className="px-3 py-2"><FertilizerBadge fertilizer={r.fertilizer} /></td>
                  <td className="px-3 py-2"><StatusBadge status={r.move_status} /></td>
                  <td className="px-3 py-2 text-xs">{r.quantity.toLocaleString('en-IN')} {r.unit}</td>
                  <td className="px-3 py-2"><CostBar cost={r.cost_inr} /></td>
                  <td className="px-3 py-2 text-xs">{r.manufacturer}</td>
                  <td className="px-3 py-2 text-xs">{r.destination}</td>
                  <td className="px-3 py-2 text-xs">{r.subsidy_pct}%</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="fac-tab-content space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="fac-chart-card">
              <CardHeader className="pb-2"><CardTitle className="text-sm">Status Distribution</CardTitle></CardHeader><CardContent><PieChart width={300} height={200}><Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>{pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></CardContent>
            </Card>
            <Card className="fac-chart-card">
              <CardHeader className="pb-2"><CardTitle className="text-sm">Cost by Fertilizer Type (Cr)</CardTitle></CardHeader><CardContent><BarChart width={300} height={200} data={barData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={10} angle={-30} textAnchor="end" height={50} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="cost" fill={COLORS[0]} radius={[4,4,0,0]} /></BarChart></CardContent>
            </Card>
            <Card className="fac-chart-card">
              <CardHeader className="pb-2"><CardTitle className="text-sm">Monthly Subsidy {'&'} Weight</CardTitle></CardHeader><CardContent><LineChart width={300} height={200} data={lineData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" fontSize={12} /><YAxis fontSize={12} /><Tooltip /><Legend /><Line type="monotone" dataKey="subsidy" stroke={COLORS[0]} strokeWidth={2} /><Line type="monotone" dataKey="weight" stroke={COLORS[1]} strokeWidth={2} strokeDasharray="5 5" /></LineChart></CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="fac-tab-content space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="fac-insight-card hover:shadow-md transition-shadow">
              <CardHeader><CardTitle className="text-sm" style={{ color: COLORS[0] }}>FCO Fertilizer Control Order {'&'} NBS Nutrient Based Subsidy</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Fertilizer Control Order (FCO) 1985 under Essential Commodities Act mandates quality standards for all fertilizers sold in India. NBS scheme fixes subsidy per kg of nutrient (N, P, K, S) instead of per product. Department of Fertilizers monitors MRP and subsidy disbursement through iFMS portal. FCO amendment 2023 introduced neem coating mandate for urea and digital lab reporting for NABL accredited testing across 178 fertilizer quality labs.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-lime-100 px-2 py-0.5 text-lime-800">Regulatory</span><span className="text-gray-400">Mandatory</span></div></CardContent>
            </Card>
            <Card className="fac-insight-card hover:shadow-md transition-shadow">
              <CardHeader><CardTitle className="text-sm" style={{ color: COLORS[0] }}>DBT Direct Benefit Transfer {'&'} PM Kisan SAMMAN</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Direct Benefit Transfer for fertilizer subsidy via PM Kisan SAMMAN ensures subsidy reaches farmers directly through Aadhaar-linked bank accounts. Rs 1.75 lakh crore allocated for FY2026-27 fertilizer subsidy. CONCOR and Indian Railways rake movement integrated with DBT portal for end-to-end tracking. 11.8 crore farmer beneficiaries verified through PFMS (Public Financial Management System) with real-time subsidy reconciliation against PoS devices at 2.4 lakh retail fertilizer shops.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-green-800">Strategic</span><span className="text-gray-400">Live</span></div></CardContent>
            </Card>
            <Card className="fac-insight-card hover:shadow-md transition-shadow">
              <CardHeader><CardTitle className="text-sm" style={{ color: COLORS[0] }}>Railways Rake Movement for Kharif Season Urea {'&'} DAP</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Indian Railways operates dedicated 3000 MT supercharged rake services for Kharif season urea and DAP distribution from plants to state warehouses. CONCOR containerized fertilizer movement on Western and Eastern Dedicated Freight Corridors reducing transit time by 40%. Rake loading plans coordinated with Ministry of Agriculture Kharif requirements for 14 major producing states. 2800+ rakes dispatched during Kharif 2025 with 96.5% on-time performance tracking via Railways FOIS system.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-amber-800">Logistics</span><span className="text-gray-400">Active</span></div></CardContent>
            </Card>
            <Card className="fac-insight-card hover:shadow-md transition-shadow">
              <CardHeader><CardTitle className="text-sm" style={{ color: COLORS[0] }}>AI Soil Health Card Analytics {'&'} NPK Demand Prediction for Rabi</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>AI-powered soil health card analytics processing 14.5 crore soil samples from 464 districts to predict NPK demand for Rabi 2026-27 sowing season. Machine learning models with 91.5% accuracy forecast district-wise fertilizer requirements 90 days ahead. Integration with Soil Health Card scheme recommendations enabling precision fertilizer allocation reducing urea overuse by 18%. Customized fertilizer blend prescriptions for 240+ FFDC units optimizing nutrient application for wheat, mustard, and chickpea.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-purple-100 px-2 py-0.5 text-purple-800">Innovation</span><span className="text-gray-400">Pilot</span></div></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
