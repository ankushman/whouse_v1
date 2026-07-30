import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'


const METALS = ['TMT Bar Fe500D', 'HR Coils IS 2062', 'CR Coils', 'Hot Rolled Plates', 'Structural Steel IS 808', 'Wire Rod SAE 1008', 'Stainless Steel 304', 'Galvanized Iron Sheet']
const MILLS = ['Tata Steel Jamshedpur', 'JSW Steel Vijayanagar', 'JSPL Raigarh', 'SAIL Bhilai', 'SAIL Rourkela', 'AM/NS India Hazira', 'Essar Steel Paradip', 'Rashtriya Ispat NTP']
const STATUSES = ['BIS Certified', 'Mill Test Verified', 'In Transit Rail', 'Yard Stored', 'Pending Excise', 'Awaiting Dispatch']
const CITIES = ['Mumbai', 'Delhi NCR', 'Chennai', 'Kolkata', 'Bangalore', 'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow']
const GRADES = ['Fe500D', 'Fe415', 'E250', 'IS 2062 E250', 'SAE 1008', 'SS 304']
const COLORS = ['#475569', '#334155', '#64748b', '#94a3b8', '#cbd5e1', '#1e293b', '#0f172a', '#f8fafc']

function ri(min: number, max: number, value: number) {
  return Math.max(min, Math.min(max, value))
}


const handRecords = [
  { id: 'STM-0001', metal: 'TMT Bar Fe500D', description: 'TMT bars for NH-48 highway overbridge construction in Haryana NHAI project', mill: 'Tata Steel Jamshedpur', quantity: 450, unit: 'MT', move_status: 'BIS Certified', lot: 'LOT-STM-1001', destination: 'Delhi NCR', received: '2026-07-12', batch: 'STM-B2026-0712', cost_inr: 2850000, weight_mt: 450.0, grade: 'Fe500D' },
  { id: 'STM-0002', metal: 'HR Coils IS 2062', description: 'Hot rolled coils for Mumbai Metro Line 7 underground station fabrication work', mill: 'JSW Steel Vijayanagar', quantity: 320, unit: 'coils', move_status: 'In Transit Rail', lot: 'LOT-STM-1002', destination: 'Mumbai', received: '2026-07-11', batch: 'STM-B2026-0711', cost_inr: 4100000, weight_mt: 320.0, grade: 'IS 2062 E250' },
  { id: 'STM-0003', metal: 'CR Coils', description: 'Cold rolled coils for Tata Motors Pune plant automotive body panel stamping', mill: 'SAIL Bhilai', quantity: 180, unit: 'coils', move_status: 'Mill Test Verified', lot: 'LOT-STM-1003', destination: 'Pune', received: '2026-07-10', batch: 'STM-B2026-0710', cost_inr: 1980000, weight_mt: 180.0, grade: 'E250' },
  { id: 'STM-0004', metal: 'Hot Rolled Plates', description: 'Steel plates for Chennai Port trust container terminal expansion and jetty work', mill: 'SAIL Rourkela', quantity: 275, unit: 'tons', move_status: 'Yard Stored', lot: 'LOT-STM-1004', destination: 'Chennai', received: '2026-07-09', batch: 'STM-B2026-0709', cost_inr: 3520000, weight_mt: 275.0, grade: 'E250' },
  { id: 'STM-0005', metal: 'Structural Steel IS 808', description: 'IS 808 structural sections for Bangalore Namma Metro Phase 3 viaduct erection', mill: 'JSPL Raigarh', quantity: 600, unit: 'MT', move_status: 'Awaiting Dispatch', lot: 'LOT-STM-1005', destination: 'Bangalore', received: '2026-07-08', batch: 'STM-B2026-0708', cost_inr: 7200000, weight_mt: 600.0, grade: 'E250' },
  { id: 'STM-0006', metal: 'Wire Rod SAE 1008', description: 'SAE 1008 wire rods for SAIL Rourkela wire drawing unit downstream processing', mill: 'Tata Steel Jamshedpur', quantity: 95, unit: 'tons', move_status: 'Pending Excise', lot: 'LOT-STM-1006', destination: 'Kolkata', received: '2026-07-07', batch: 'STM-B2026-0707', cost_inr: 1140000, weight_mt: 95.0, grade: 'SAE 1008' },
  { id: 'STM-0007', metal: 'Stainless Steel 304', description: 'SS 304 sheets for Ahmedabad Sabarmati Riverfront food court kitchen fabrication', mill: 'AM/NS India Hazira', quantity: 45, unit: 'sheets', move_status: 'BIS Certified', lot: 'LOT-STM-1007', destination: 'Ahmedabad', received: '2026-07-06', batch: 'STM-B2026-0706', cost_inr: 1350000, weight_mt: 22.5, grade: 'SS 304' },
  { id: 'STM-0008', metal: 'Galvanized Iron Sheet', description: 'GI sheets for Hyderabad DRDL missile storage facility roofing and cladding', mill: 'Essar Steel Paradip', quantity: 210, unit: 'sheets', move_status: 'In Transit Rail', lot: 'LOT-STM-1008', destination: 'Hyderabad', received: '2026-07-05', batch: 'STM-B2026-0705', cost_inr: 1680000, weight_mt: 105.0, grade: 'E250' },
  { id: 'STM-0009', metal: 'TMT Bar Fe500D', description: 'Fe500D TMT bars for Lucknow Defence Corridor ordnance factory foundation work', mill: 'JSW Steel Vijayanagar', quantity: 380, unit: 'MT', move_status: 'Mill Test Verified', lot: 'LOT-STM-1009', destination: 'Lucknow', received: '2026-07-04', batch: 'STM-B2026-0704', cost_inr: 2660000, weight_mt: 380.0, grade: 'Fe500D' },
  { id: 'STM-0010', metal: 'HR Coils IS 2062', description: 'HR coils for Jaipur Smart City elevated corridor girder fabrication at SAIL yard', mill: 'SAIL Bhilai', quantity: 520, unit: 'coils', move_status: 'Yard Stored', lot: 'LOT-STM-1010', destination: 'Jaipur', received: '2026-07-03', batch: 'STM-B2026-0703', cost_inr: 6760000, weight_mt: 520.0, grade: 'IS 2062 E250' },
  { id: 'STM-0011', metal: 'CR Coils', description: 'Cold rolled steel for Godrej Appliances Mumbai refrigerator compressor housing', mill: 'JSPL Raigarh', quantity: 140, unit: 'coils', move_status: 'Awaiting Dispatch', lot: 'LOT-STM-1011', destination: 'Mumbai', received: '2026-07-02', batch: 'STM-B2026-0702', cost_inr: 1540000, weight_mt: 140.0, grade: 'E250' },
  { id: 'STM-0012', metal: 'Stainless Steel 304', description: 'SS 304 pipes and fittings for Desalination plant RO membrane housing Chennai', mill: 'AM/NS India Hazira', quantity: 60, unit: 'tons', move_status: 'Pending Excise', lot: 'LOT-STM-1012', destination: 'Chennai', received: '2026-07-01', batch: 'STM-B2026-0701', cost_inr: 2400000, weight_mt: 60.0, grade: 'SS 304' },
  { id: 'STM-0013', metal: 'Hot Rolled Plates', description: 'Heavy plates for Indian Navy Vikrant-class carrier dry dock repair facility Kochi', mill: 'Essar Steel Paradip', quantity: 890, unit: 'tons', move_status: 'BIS Certified', lot: 'LOT-STM-1013', destination: 'Kolkata', received: '2026-06-30', batch: 'STM-B2026-0630', cost_inr: 10680000, weight_mt: 890.0, grade: 'E250' },
  { id: 'STM-0014', metal: 'Structural Steel IS 808', description: 'IS 808 angles and channels for Tata Power Mundra UMPP boiler structure', mill: 'Rashtriya Ispat NTP', quantity: 430, unit: 'MT', move_status: 'In Transit Rail', lot: 'LOT-STM-1014', destination: 'Ahmedabad', received: '2026-06-29', batch: 'STM-B2026-0629', cost_inr: 3870000, weight_mt: 430.0, grade: 'E250' },
  { id: 'STM-0015', metal: 'Wire Rod SAE 1008', description: 'SAE 1008 wire rod for UNO Minda Aurangabad automotive fastener manufacturing', mill: 'JSW Steel Vijayanagar', quantity: 78, unit: 'tons', move_status: 'Yard Stored', lot: 'LOT-STM-1015', destination: 'Pune', received: '2026-06-28', batch: 'STM-B2026-0628', cost_inr: 858000, weight_mt: 78.0, grade: 'SAE 1008' },
  { id: 'STM-0016', metal: 'Galvanized Iron Sheet', description: 'GI corrugated sheets for Adani Logistics Kandla SEZ warehouse roofing project', mill: 'Tata Steel Jamshedpur', quantity: 340, unit: 'sheets', move_status: 'Mill Test Verified', lot: 'LOT-STM-1016', destination: 'Mumbai', received: '2026-06-27', batch: 'STM-B2026-0627', cost_inr: 2720000, weight_mt: 170.0, grade: 'E250' },
  { id: 'STM-0017', metal: 'TMT Bar Fe500D', description: 'Fe415 grade TMT bars for Pradhan Mantri Awas Yojana affordable housing Noida', mill: 'SAIL Rourkela', quantity: 680, unit: 'MT', move_status: 'Awaiting Dispatch', lot: 'LOT-STM-1017', destination: 'Delhi NCR', received: '2026-06-26', batch: 'STM-B2026-0626', cost_inr: 4760000, weight_mt: 680.0, grade: 'Fe415' },
  { id: 'STM-0018', metal: 'HR Coils IS 2062', description: 'HR coils for L&T Hyderabad Metro underground tunnel segment casting yard', mill: 'JSPL Raigarh', quantity: 410, unit: 'coils', move_status: 'Pending Excise', lot: 'LOT-STM-1018', destination: 'Hyderabad', received: '2026-06-25', batch: 'STM-B2026-0625', cost_inr: 5330000, weight_mt: 410.0, grade: 'IS 2062 E250' },
  { id: 'STM-0019', metal: 'CR Coils', description: 'Cold rolled coils for Bajaj Auto Chakan plant two-wheeler frame tube milling', mill: 'AM/NS India Hazira', quantity: 125, unit: 'coils', move_status: 'In Transit Rail', lot: 'LOT-STM-1019', destination: 'Pune', received: '2026-06-24', batch: 'STM-B2026-0624', cost_inr: 1375000, weight_mt: 125.0, grade: 'E250' },
  { id: 'STM-0020', metal: 'Hot Rolled Plates', description: 'Steel plates for Dedicated Freight Corridor Western Rail ballastless track sleeper', mill: 'Rashtriya Ispat NTP', quantity: 760, unit: 'tons', move_status: 'BIS Certified', lot: 'LOT-STM-1020', destination: 'Delhi NCR', received: '2026-06-23', batch: 'STM-B2026-0623', cost_inr: 9120000, weight_mt: 760.0, grade: 'E250' },
]

const genRecords = (start: number) => {
  const statuses = STATUSES
  const mills = MILLS
  return Array.from({ length: 20 }, (_, i) => ({
    id: `STM-${String(start + i).padStart(4, '0')}`,
    metal: METALS[(start + i) % 8],
    description: `${METALS[(start + i) % 8]} supply for infrastructure batch ${String((start + i) % 99 + 1).padStart(3, '0')}`,
    mill: mills[(start + i) % 8],
    quantity: Math.round(5 + Math.random() * 500),
    unit: ['MT', 'coils', 'sheets', 'tons'][i % 4],
    move_status: statuses[(start + i) % 6],
    lot: `LOT-STM-${String(1000 + start + i).padStart(4, '0')}`,
    destination: CITIES[(start + i) % 10],
    received: `2026-07-${String(20 - Math.floor((start + i) / 10)).padStart(2, '0')}`,
    batch: `STM-B2026-${String(710 - Math.floor((start + i) / 3)).padStart(4, '0')}`,
    cost_inr: Math.round(200000 + Math.random() * 8000000),
    weight_mt: Math.round((5 + Math.random() * 200) * 10) / 10,
    grade: GRADES[(start + i) % 6],
  }))
}

const allRecords = [...handRecords, ...genRecords(21), ...genRecords(41)]

const filterGroups = [
  {
    key: 'metal',
    label: 'Metal Type',
    options: METALS.map(m => ({ label: m, value: m, count: allRecords.filter(r => r.metal === m).length })),
  },
  {
    key: 'move_status',
    label: 'Status',
    options: STATUSES.map(s => ({ label: s, value: s, count: allRecords.filter(r => r.move_status === s).length })),
  },
  {
    key: 'mill',
    label: 'Mill',
    options: MILLS.map(m => ({ label: m, value: m, count: allRecords.filter(r => r.mill === m).length })),
  },
]

function MetalBadge({ metal }: { metal: string }) {
  return <span className="stm-badge inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium" style={{ background: COLORS[0], color: '#fff' }}>{metal}</span>
}

function StatusBadge({ status }: { status: string }) {
  const c = status === 'BIS Certified' ? '#16a34a' : status === 'In Transit Rail' ? '#2563eb' : status === 'Yard Stored' ? '#d97706' : status === 'Pending Excise' ? '#dc2626' : '#6b7280'
  return <span className="stm-status-badge inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ background: c + '22', color: c, border: `1px solid ${c}44` }}>{status}</span>
}

function CostBar({ cost }: { cost: number }) {
  const pct = ri(0, 100, (cost / 12000000) * 100)
  return <div className="stm-cost-bar flex items-center gap-2"><div className="h-2 w-20 rounded-full bg-gray-200"><div className="h-2 rounded-full transition-all" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${COLORS[1]}, ${COLORS[0]})` }} /></div><span className="text-xs text-gray-500">{'\u20B9' + (cost / 10000000).toFixed(1) + 'Cr'}</span></div>
}

function HealthRing({ value, label, color }: { value: number; label: string; color: string }) {
  const r = 28, cx = 35, cy = 35, sw = 5
  const circ = 2 * Math.PI * r
  const offset = circ - (ri(0, 100, value) / 100) * circ
  return (
    <div className="stm-health-ring flex flex-col items-center"><svg width={70} height={70} className="-rotate-90"><circle cx={cx} cy={cy} r={r} fill="none" stroke="#e5e7eb" strokeWidth={sw} /><circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={sw} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" /></svg><span className="mt-1 text-sm font-bold" style={{ color }}>{value}%</span><span className="text-xs text-gray-500">{label}</span></div>
  )
}

function KpiTile({ title, value, sub }: { title: string; value: string; sub: string }) {
  return (
    <Card className="stm-kpi-card"><CardContent className="p-4"><p className="text-xs text-gray-500">{title}</p><p className="stm-kpi-value mt-1 text-2xl font-bold" style={{ color: COLORS[0] }}>{value}</p><p className="text-xs text-gray-400 mt-0.5">{sub}</p></CardContent></Card>
  )
}

function ValueTile({ title, value, trend }: { title: string; value: string; trend: string }) {
  const up = trend.startsWith('+')
  return (
    <Card className="stm-value-tile"><CardContent className="p-4"><p className="text-xs text-gray-500">{title}</p><p className="mt-1 text-xl font-bold">{value}</p><p className={`text-xs mt-0.5 ${up ? 'text-green-600' : 'text-red-500'}`}>{trend}</p></CardContent></Card>
  )
}

export default function SteelMetalsSupplyChainView() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})

  const filtered = useMemo(() => {
    return allRecords.filter(r => {
      const q = searchQuery.toLowerCase()
      if (q && !r.id.toLowerCase().includes(q) && !r.metal.toLowerCase().includes(q) && !r.description.toLowerCase().includes(q) && !r.mill.toLowerCase().includes(q) && !r.destination.toLowerCase().includes(q)) return false
      return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(String(r[key as keyof typeof r])))
    })
  }, [searchQuery, activeFilters])

  const totalCost = allRecords.reduce((s, r) => s + r.cost_inr, 0)
  const totalWeight = allRecords.reduce((s, r) => s + r.weight_mt, 0)
  const bisCertified = allRecords.filter(r => r.move_status === 'BIS Certified').length
  const millVerified = allRecords.filter(r => r.move_status === 'Mill Test Verified').length

  const pieData = STATUSES.map(s => ({ name: s, value: allRecords.filter(r => r.move_status === s).length }))
  const barData = METALS.slice(0, 6).map(m => ({ name: m.split(' ')[0], cost: allRecords.filter(r => r.metal === m).reduce((a, r) => a + r.cost_inr, 0) / 10000000 }))
  const lineData = METALS.slice(0, 6).map(m => ({ name: m.split(' ')[0], weight: allRecords.filter(r => r.metal === m).reduce((a, r) => a + r.weight_mt, 0) }))

  const tabs = [
    { value: 'dashboard', label: 'Dashboard' },
    { value: 'shipments', label: 'Shipments' },
    { value: 'analytics', label: 'Analytics' },
    { value: 'insights', label: 'Insights' },
  ]

  return (
    <div className="stm-container space-y-4">
      <PageHeader title="Steel & Metals Supply Chain" description="Track steel and metals shipments across Indian mills, yards, and project sites with BIS certification tracking and excise compliance" />
      <ModuleBreadcrumb items={[{ label: 'Supply Chain' }, { label: 'Steel & Metals' }]} />
      <Tabs defaultValue="dashboard">
        <TabsList className="stm-tabs-list">
          {tabs.map(t => <TabsTrigger key={t.value} value={t.value} className="stm-tab-trigger">{t.label}</TabsTrigger>)}
        </TabsList>

        <TabsContent value="dashboard" className="stm-tab-content space-y-4 mt-4">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <KpiTile title="Total Shipments" value={allRecords.length.toString()} sub="Steel consignments" />
            <KpiTile title="Total Value" value={`\u20B9${(totalCost / 10000000).toFixed(0)}Cr`} sub="Cargo value in INR" />
            <KpiTile title="BIS Certified" value={bisCertified.toString()} sub={`${((bisCertified / allRecords.length) * 100).toFixed(0)}% certified`} />
            <KpiTile title="Mill Verified" value={millVerified.toString()} sub={`${((millVerified / allRecords.length) * 100).toFixed(0)}% verified`} />
          </div>
          <div className="grid gap-4 grid-cols-3 md:grid-cols-6">
            <HealthRing value={92} label="BIS Compliance" color="#16a34a" />
            <HealthRing value={78} label="Rail On-Time" color="#2563eb" />
            <HealthRing value={85} label="Yard Util" color="#d97706" />
            <HealthRing value={64} label="Dispatch Rate" color="#475569" />
            <HealthRing value={71} label="Excise Clear" color="#7c3aed" />
            <HealthRing value={88} label="Grade Match" color="#0f172a" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Top Metal Types</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2"><MetalBadge metal="TMT Bar Fe500D" /><MetalBadge metal="HR Coils IS 2062" /></div>
                <ValueTile title="Avg Cost per Shipment" value={`\u20B9${Math.round(totalCost / allRecords.length).toLocaleString('en-IN')}`} trend="+5.2% vs Q1" />
                <ValueTile title="Avg Weight per Lot" value={`${(totalWeight / allRecords.length).toFixed(1)} MT`} trend="+3.8% vs Q1" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Shipment Cost Overview</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 mb-1"><StatusBadge status="BIS Certified" /></div>
                <CostBar cost={totalCost / 3} />
                <ValueTile title="Highest Cost" value={`\u20B9${Math.max(...allRecords.map(r => r.cost_inr)).toLocaleString('en-IN')}`} trend="STM-0013" />
                <ValueTile title="Pending Excise" value={`\u20B9${allRecords.filter(r => r.move_status === 'Pending Excise').reduce((a, r) => a + r.cost_inr, 0).toLocaleString('en-IN')}`} trend="-2.1% vs Q1" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="shipments" className="stm-tab-content space-y-4 mt-4">
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups}
            onToggleFilter={(key, val) => setActiveFilters(p => ({ ...p, [key]: p[key]?.includes(val) ? p[key].filter(v => v !== val) : [...(p[key] || []), val] }))} onClearAllFilters={() => setActiveFilters({})} totalItems={allRecords.length} filteredCount={filtered.length} onRefresh={() => {}} placeholder="Search by ID, metal, mill, destination, or lot..." />
          <div className="overflow-x-auto rounded-lg border">
            <table className="stm-table w-full text-sm">
              <thead><tr className="stm-table-header bg-gray-50">
                <th className="px-3 py-2 text-left font-medium">ID</th><th className="px-3 py-2 text-left font-medium">Metal</th><th className="px-3 py-2 text-left font-medium">Status</th><th className="px-3 py-2 text-left font-medium">Qty</th><th className="px-3 py-2 text-left font-medium">Cost</th><th className="px-3 py-2 text-left font-medium">Mill</th><th className="px-3 py-2 text-left font-medium">Destination</th><th className="px-3 py-2 text-left font-medium">Lot</th><th className="px-3 py-2 text-left font-medium">Grade</th>
              </tr></thead>
              <tbody>{filtered.slice(0, 20).map(r => (
                <tr key={r.id} className="stm-table-row border-t hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-2 font-mono text-xs">{r.id}</td>
                  <td className="px-3 py-2"><MetalBadge metal={r.metal} /></td>
                  <td className="px-3 py-2"><StatusBadge status={r.move_status} /></td>
                  <td className="px-3 py-2 text-xs">{r.quantity.toLocaleString('en-IN')} {r.unit}</td>
                  <td className="px-3 py-2"><CostBar cost={r.cost_inr} /></td>
                  <td className="px-3 py-2 text-xs">{r.mill}</td>
                  <td className="px-3 py-2 text-xs">{r.destination}</td>
                  <td className="px-3 py-2 text-xs font-mono">{r.lot}</td>
                  <td className="px-3 py-2 text-xs">{r.grade}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="stm-tab-content space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="stm-chart-card">
              <CardHeader className="pb-2"><CardTitle className="text-sm">Status Distribution</CardTitle></CardHeader><CardContent><PieChart width={300} height={200}><Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>{pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></CardContent>
            </Card>
            <Card className="stm-chart-card">
              <CardHeader className="pb-2"><CardTitle className="text-sm">Cost by Metal Type (Cr)</CardTitle></CardHeader><CardContent><BarChart width={300} height={200} data={barData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={10} angle={-30} textAnchor="end" height={50} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="cost" fill={COLORS[0]} radius={[4,4,0,0]} /></BarChart></CardContent>
            </Card>
            <Card className="stm-chart-card">
              <CardHeader className="pb-2"><CardTitle className="text-sm">Weight by Metal (MT)</CardTitle></CardHeader><CardContent><LineChart width={300} height={200} data={lineData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={10} /><YAxis fontSize={12} /><Tooltip /><Legend /><Line type="monotone" dataKey="weight" stroke={COLORS[1]} strokeWidth={2} /></LineChart></CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="stm-tab-content space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="stm-insight-card hover:shadow-md transition-shadow">
              <CardHeader><CardTitle className="text-sm" style={{ color: COLORS[0] }}>BIS IS 1786 TMT Bar Certification</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Bureau of Indian Standards IS 1786 certification mandates quality testing for TMT bars. All Fe500D and Fe415 grade bars must carry the BIS quality mark (ISI) before dispatch. Mill test certificates (MTC) are verified against BIS standards to ensure tensile strength, elongation, and bend test compliance for structural safety in Indian construction projects.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-green-800">Regulatory</span><span className="text-gray-400">Mandatory</span></div></CardContent>
            </Card>
            <Card className="stm-insight-card hover:shadow-md transition-shadow">
              <CardHeader><CardTitle className="text-sm" style={{ color: COLORS[0] }}>NMDC Iron Ore Pricing {'&'} NMET</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>National Mineral Development Corporation (NMDC) iron ore lump and fines pricing directly impacts domestic steel production costs. The National Mineral Exploration Trust (NMET) levy of 2% on royalty supports mineral exploration. Price fluctuations in NMDC auction baskets affect input costs for SAIL, Tata Steel, and JSW Steel mill operations across India.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-amber-800">Strategic</span><span className="text-gray-400">Live</span></div></CardContent>
            </Card>
            <Card className="stm-insight-card hover:shadow-md transition-shadow">
              <CardHeader><CardTitle className="text-sm" style={{ color: COLORS[0] }}>Indian Railways Freight Wagon Rake</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Indian Railways freight wagon rake allocation for steel coil and plate logistics follows the Freight Operations Information System (FOIS) priority scheduling. BCN/BLN wagons are allocated for finished steel transport from mills to consumption centers. Rake planning optimizes 58-wagon full rake deployment reducing per-tonne freight cost by 40% compared to road transport for bulk steel movement.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-blue-800">Logistics</span><span className="text-gray-400">Active</span></div></CardContent>
            </Card>
            <Card className="stm-insight-card hover:shadow-md transition-shadow">
              <CardHeader><CardTitle className="text-sm" style={{ color: COLORS[0] }}>AI Demand Forecasting for Steel</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Machine learning models predict steel demand cycles for infrastructure projects under National Infrastructure Pipeline (NIP). Time-series forecasting using LSTM networks analyzes historical procurement patterns across NHAI, Metro, and Smart City projects. Predictive models optimize inventory levels at regional steel yards, reducing carrying costs by 18-25% while maintaining 99.5% material availability for construction schedules.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-purple-100 px-2 py-0.5 text-purple-800">Innovation</span><span className="text-gray-400">Pilot</span></div></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
