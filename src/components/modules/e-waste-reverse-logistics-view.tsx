import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#16a34a', '#15803d', '#22c55e', '#4ade80', '#86efac', '#166534', '#65a30d', '#a3e635']

const WASTE_TYPES = ['Mobile Phones', 'Laptop Batteries', 'PCB Assemblies', 'CRT Monitors', 'Inverters', 'LED Panels', 'EV Batteries', 'Cable Harness']
const RECYCLERS = ['EcoRecycle India', 'GreenTech Dhanbad', 'Attero Recycling', 'Karo Sambhav', 'Cerebra Green', 'Re sustainability', 'E-Parisaraa', 'Namo E-Waste']
const DISPOSITION = ['Recycled', 'Refurbished', 'Certified Destroy', 'Landfill Safe', 'Component Recover', 'Export Certified']

const items = [
  { id: 'EWC-0001', type: 'Mobile Phones', recycler: 'Attero Recycling', disposition: 'Recycled', weight_kg: 12.5, hazardous: true, co2_saved: 8.2, recovery_rate: 94, date_received: '2026-07-30', source: 'Croma Exchange', value_inr: 3500, compliance_cert: 'CPCB-2026-ATR' },
  { id: 'EWC-0002', type: 'Laptop Batteries', recycler: 'EcoRecycle India', disposition: 'Component Recover', weight_kg: 28.3, hazardous: true, co2_saved: 15.6, recovery_rate: 88, date_received: '2026-07-29', source: 'Amazon Returns', value_inr: 8200, compliance_cert: 'CPCB-2026-ECI' },
  { id: 'EWC-0003', type: 'PCB Assemblies', recycler: 'GreenTech Dhanbad', disposition: 'Recycled', weight_kg: 45.7, hazardous: true, co2_saved: 32.1, recovery_rate: 91, date_received: '2026-07-29', source: 'TCS Asset Disposal', value_inr: 12500, compliance_cert: 'CPCB-2026-GTD' },
  { id: 'EWC-0004', type: 'CRT Monitors', recycler: 'Re sustainability', disposition: 'Certified Destroy', weight_kg: 85.2, hazardous: true, co2_saved: 5.8, recovery_rate: 72, date_received: '2026-07-28', source: 'Reliance Digital', value_inr: 1200, compliance_cert: 'CPCB-2026-RST' },
  { id: 'EWC-0005', type: 'Inverters', recycler: 'Karo Sambhav', disposition: 'Refurbished', weight_kg: 35.0, hazardous: false, co2_saved: 18.4, recovery_rate: 96, date_received: '2026-07-28', source: 'BESCOM Bulk', value_inr: 15600, compliance_cert: 'CPCB-2026-KSB' },
  { id: 'EWC-0006', type: 'EV Batteries', recycler: 'Cerebra Green', disposition: 'Component Recover', weight_kg: 120.5, hazardous: true, co2_saved: 45.2, recovery_rate: 82, date_received: '2026-07-27', source: 'Ola EV Depot', value_inr: 42000, compliance_cert: 'CPCB-2026-CRG' },
  { id: 'EWC-0007', type: 'LED Panels', recycler: 'E-Parisaraa', disposition: 'Recycled', weight_kg: 18.9, hazardous: false, co2_saved: 12.3, recovery_rate: 89, date_received: '2026-07-27', source: 'Philips Trade-In', value_inr: 5800, compliance_cert: 'CPCB-2026-EPR' },
  { id: 'EWC-0008', type: 'Cable Harness', recycler: 'Namo E-Waste', disposition: 'Recycled', weight_kg: 52.4, hazardous: false, co2_saved: 28.7, recovery_rate: 95, date_received: '2026-07-26', source: 'Maruti Suzuki', value_inr: 9400, compliance_cert: 'CPCB-2026-NWE' },
  { id: 'EWC-0009', type: 'Mobile Phones', recycler: 'Attero Recycling', disposition: 'Refurbished', weight_kg: 8.2, hazardous: true, co2_saved: 6.1, recovery_rate: 98, date_received: '2026-07-26', source: 'Flipkart Returns', value_inr: 12800, compliance_cert: 'CPCB-2026-ATR' },
  { id: 'EWC-0010', type: 'Laptop Batteries', recycler: 'EcoRecycle India', disposition: 'Certified Destroy', weight_kg: 22.1, hazardous: true, co2_saved: 10.4, recovery_rate: 75, date_received: '2026-07-25', source: 'HP India Takeback', value_inr: 2100, compliance_cert: 'CPCB-2026-ECI' },
  { id: 'EWC-0011', type: 'PCB Assemblies', recycler: 'Cerebra Green', disposition: 'Recycled', weight_kg: 38.6, hazardous: true, co2_saved: 25.8, recovery_rate: 90, date_received: '2026-07-25', source: 'Wipro IT Assets', value_inr: 11200, compliance_cert: 'CPCB-2026-CRG' },
  { id: 'EWC-0012', type: 'CRT Monitors', recycler: 'Re sustainability', disposition: 'Landfill Safe', weight_kg: 92.0, hazardous: true, co2_saved: 3.2, recovery_rate: 65, date_received: '2026-07-24', source: 'Govt Office Disposal', value_inr: 800, compliance_cert: 'CPCB-2026-RST' },
  { id: 'EWC-0013', type: 'EV Batteries', recycler: 'GreenTech Dhanbad', disposition: 'Component Recover', weight_kg: 145.8, hazardous: true, co2_saved: 52.3, recovery_rate: 84, date_received: '2026-07-24', source: 'Ather Energy', value_inr: 48500, compliance_cert: 'CPCB-2026-GTD' },
  { id: 'EWC-0014', type: 'Inverters', recycler: 'Karo Sambhav', disposition: 'Recycled', weight_kg: 42.3, hazardous: false, co2_saved: 22.6, recovery_rate: 92, date_received: '2026-07-23', source: 'Luminous India', value_inr: 18200, compliance_cert: 'CPCB-2026-KSB' },
  { id: 'EWC-0015', type: 'LED Panels', recycler: 'E-Parisaraa', disposition: 'Recycled', weight_kg: 15.7, hazardous: false, co2_saved: 10.8, recovery_rate: 91, date_received: '2026-07-23', source: 'Havells Exchange', value_inr: 6200, compliance_cert: 'CPCB-2026-EPR' },
  { id: 'EWC-0016', type: 'Cable Harness', recycler: 'Namo E-Waste', disposition: 'Recycled', weight_kg: 48.9, hazardous: false, co2_saved: 26.4, recovery_rate: 93, date_received: '2026-07-22', source: 'Tata Motors', value_inr: 8800, compliance_cert: 'CPCB-2026-NWE' },
  { id: 'EWC-0017', type: 'Mobile Phones', recycler: 'Attero Recycling', disposition: 'Export Certified', weight_kg: 5.6, hazardous: true, co2_saved: 4.2, recovery_rate: 97, date_received: '2026-07-22', source: 'Samsung Care', value_inr: 16400, compliance_cert: 'CPCB-2026-ATR' },
  { id: 'EWC-0018', type: 'Laptop Batteries', recycler: 'Cerebra Green', disposition: 'Recycled', weight_kg: 31.4, hazardous: true, co2_saved: 17.8, recovery_rate: 87, date_received: '2026-07-21', source: 'Lenovo India', value_inr: 7600, compliance_cert: 'CPCB-2026-CRG' },
  { id: 'EWC-0019', type: 'PCB Assemblies', recycler: 'EcoRecycle India', disposition: 'Component Recover', weight_kg: 55.2, hazardous: true, co2_saved: 38.5, recovery_rate: 89, date_received: '2026-07-21', source: 'Infosys E-Waste', value_inr: 14800, compliance_cert: 'CPCB-2026-ECI' },
  { id: 'EWC-0020', type: 'EV Batteries', recycler: 'Re sustainability', disposition: 'Refurbished', weight_kg: 135.0, hazardous: true, co2_saved: 48.9, recovery_rate: 86, date_received: '2026-07-20', source: 'Mahindra EV', value_inr: 52300, compliance_cert: 'CPCB-2026-RST' },
]

const genRecords = (start: number) => {
  const dispositions = ['Recycled', 'Recycled', 'Component Recover', 'Refurbished', 'Certified Destroy', 'Landfill Safe', 'Export Certified']
  const sources = ['Croma Exchange', 'Amazon Returns', 'TCS Asset Disposal', 'Reliance Digital', 'BESCOM Bulk', 'Ola EV Depot', 'Philips Trade-In', 'Maruti Suzuki', 'Flipkart Returns', 'HP India Takeback', 'Wipro IT Assets', 'Govt Office Disposal', 'Ather Energy', 'Luminous India', 'Havells Exchange']
  return Array.from({ length: 40 }, (_, i) => ({
    id: `EWC-${String(start + i).padStart(4, '0')}`,
    type: WASTE_TYPES[(start + i) % 8],
    recycler: RECYCLERS[(start + i) % 8],
    disposition: dispositions[(start + i) % dispositions.length],
    weight_kg: Math.round((5 + Math.random() * 150) * 10) / 10,
    hazardous: WASTE_TYPES[(start + i) % 8] !== 'Cable Harness' && WASTE_TYPES[(start + i) % 8] !== 'LED Panels' && WASTE_TYPES[(start + i) % 8] !== 'Inverters',
    co2_saved: Math.round((3 + Math.random() * 55) * 10) / 10,
    recovery_rate: Math.round(60 + Math.random() * 40),
    date_received: `2026-07-${String(20 - Math.floor((start + i) / 8)).padStart(2, '0')}`,
    source: sources[(start + i) % 15],
    value_inr: Math.round(800 + Math.random() * 52000),
    compliance_cert: `CPCB-2026-${RECYCLERS[(start + i) % 8].substring(0, 3).toUpperCase()}`,
  }))
}

const allItems = [...items, ...genRecords(21), ...genRecords(61)]

function ri(min: number, max: number, value: number) {
  return Math.max(min, Math.min(max, value))
}

const filterGroups = [
  {
    key: 'type',
    label: 'Waste Type',
    options: WASTE_TYPES.map(t => ({ label: t, value: t, count: allItems.filter(d => d.type === t).length })),
  },
  {
    key: 'recycler',
    label: 'Recycler',
    options: RECYCLERS.map(r => ({ label: r, value: r, count: allItems.filter(d => d.recycler === r).length })),
  },
  {
    key: 'disposition',
    label: 'Disposition',
    options: DISPOSITION.map(d => ({ label: d, value: d, count: allItems.filter(i => i.disposition === d).length })),
  },
]

function TypeBadge({ type }: { type: string }) {
  const colors: Record<string, string> = { 'Mobile Phones': 'bg-green-100 text-green-800', 'Laptop Batteries': 'bg-emerald-100 text-emerald-800', 'PCB Assemblies': 'bg-lime-100 text-lime-800', 'CRT Monitors': 'bg-yellow-100 text-yellow-800', Inverters: 'bg-teal-100 text-teal-800', 'LED Panels': 'bg-cyan-100 text-cyan-800', 'EV Batteries': 'bg-blue-100 text-blue-800', 'Cable Harness': 'bg-slate-100 text-slate-800' }
  return <span className={`ewc-type-badge inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[type] || 'bg-gray-100 text-gray-800'}`}>{type}</span>
}

function RecyclerBadge({ recycler }: { recycler: string }) {
  const colors: Record<string, string> = { 'EcoRecycle India': 'bg-green-100 text-green-800', 'GreenTech Dhanbad': 'bg-emerald-100 text-emerald-800', 'Attero Recycling': 'bg-lime-100 text-lime-800', 'Karo Sambhav': 'bg-teal-100 text-teal-800', 'Cerebra Green': 'bg-cyan-100 text-cyan-800', 'Re sustainability': 'bg-blue-100 text-blue-800', 'E-Parisaraa': 'bg-violet-100 text-violet-800', 'Namo E-Waste': 'bg-orange-100 text-orange-800' }
  return <span className={`ewc-recycler-badge inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[recycler] || 'bg-gray-100 text-gray-800'}`}>{recycler}</span>
}

function DispositionBadge({ disposition }: { disposition: string }) {
  const colors: Record<string, string> = { Recycled: 'bg-green-100 text-green-800', Refurbished: 'bg-blue-100 text-blue-800', 'Certified Destroy': 'bg-red-100 text-red-800', 'Landfill Safe': 'bg-amber-100 text-amber-800', 'Component Recover': 'bg-violet-100 text-violet-800', 'Export Certified': 'bg-indigo-100 text-indigo-800' }
  return <span className={`ewc-disp-badge inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[disposition] || 'bg-gray-100 text-gray-700'}`}>{disposition}</span>
}

function RecoveryBar({ rate }: { rate: number }) {
  const pct = ri(0, 100, rate)
  const color = pct >= 90 ? 'bg-green-500' : pct >= 80 ? 'bg-yellow-500' : 'bg-orange-500'
  return <div className="ewc-recovery-bar flex items-center gap-2"><div className="h-2 w-20 rounded-full bg-gray-200"><div className={`ewc-recovery-bar-fill h-2 rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} /></div><span className="text-xs text-gray-500">{rate}%</span></div>
}

function HealthRing({ value, label, color }: { value: number; label: string; color: string }) {
  const r = 28, cx = 35, cy = 35, sw = 5
  const circ = 2 * Math.PI * r
  const offset = circ - (ri(0, 100, value) / 100) * circ
  return <div className="ewc-health-ring flex flex-col items-center"><svg width={70} height={70} className="-rotate-90"><circle cx={cx} cy={cy} r={r} fill="none" stroke="#e5e7eb" strokeWidth={sw} /><circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={sw} strokeDasharray={circ} strokeDashoffset={offset} className="ewc-ring-path" strokeLinecap="round" /></svg><span className="ewc-ring-value mt-1 text-sm font-bold" style={{ color }}>{value}%</span><span className="text-xs text-gray-500">{label}</span></div>
}

function KpiTile({ title, value, sub }: { title: string; value: string; sub: string }) {
  return <Card className="ewc-kpi-card"><CardContent className="p-4"><p className="text-xs text-gray-500">{title}</p><p className="ewc-kpi-value mt-1 text-2xl font-bold">{value}</p><p className="text-xs text-gray-400 mt-0.5">{sub}</p></CardContent></Card>
}

function ValueTile({ title, value, trend }: { title: string; value: string; trend: string }) {
  const up = trend.startsWith('+')
  return <Card className="ewc-value-tile"><CardContent className="p-4"><p className="text-xs text-gray-500">{title}</p><p className="mt-1 text-xl font-bold">{value}</p><p className={`text-xs mt-0.5 ${up ? 'text-green-600' : 'text-red-500'}`}>{trend}</p></CardContent></Card>
}

export default function EWasteReverseLogisticsView() {
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

  const filtered = allItems.filter(d => {
    const q = searchQuery.toLowerCase()
    if (q && !d.id.toLowerCase().includes(q) && !d.type.toLowerCase().includes(q) && !d.recycler.toLowerCase().includes(q) && !d.source.toLowerCase().includes(q)) return false
    return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(d[key as keyof typeof d] as string))
  })

  const totalWeight = allItems.reduce((s, d) => s + d.weight_kg, 0)
  const totalCO2 = allItems.reduce((s, d) => s + d.co2_saved, 0)
  const recycledCount = allItems.filter(d => d.disposition === 'Recycled').length
  const avgRecovery = (allItems.reduce((s, d) => s + d.recovery_rate, 0) / allItems.length).toFixed(1)

  const monthlyData = [
    { month: 'Jan', items: 180, weight_ton: 2.8, co2: 1450 },
    { month: 'Feb', items: 210, weight_ton: 3.2, co2: 1680 },
    { month: 'Mar', items: 195, weight_ton: 3.0, co2: 1520 },
    { month: 'Apr', items: 240, weight_ton: 3.8, co2: 1940 },
    { month: 'May', items: 225, weight_ton: 3.5, co2: 1810 },
    { month: 'Jun', items: 260, weight_ton: 4.1, co2: 2100 },
    { month: 'Jul', items: 248, weight_ton: 3.9, co2: 2050 },
  ]
  const typeData = WASTE_TYPES.map(t => ({ type: t, count: allItems.filter(d => d.type === t).length }))
  const recyclerData = RECYCLERS.map(r => ({ recycler: r, count: allItems.filter(d => d.recycler === r).length }))

  const tabs = [
    { value: 'dashboard', label: 'Dashboard' },
    { value: 'items', label: 'E-Waste Items' },
    { value: 'analytics', label: 'Analytics' },
    { value: 'insights', label: 'Insights' },
  ]

  return (
    <div className="ewc-container space-y-4">
      <PageHeader title="E-Waste Reverse Logistics" description="CPCB-compliant e-waste collection, sorting, and responsible recycling across India" />
      <ModuleBreadcrumb items={[{ label: 'Sustainability' }, { label: 'E-Waste Reverse Logistics' }]} />
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="ewc-tabs-list">
          {tabs.map(t => <TabsTrigger key={t.value} value={t.value} className="ewc-tab-trigger">{t.label}</TabsTrigger>)}
        </TabsList>

        <TabsContent value="dashboard" className="ewc-tab-content space-y-4 mt-4">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <KpiTile title="Items Processed" value={allItems.length.toString()} sub="This month" />
            <KpiTile title="Total Weight" value={`${(totalWeight / 1000).toFixed(1)}T`} sub="E-waste collected" />
            <KpiTile title="CO2 Saved" value={`${totalCO2.toFixed(0)} kg`} sub="Carbon offset" />
            <KpiTile title="Avg Recovery" value={`${avgRecovery}%`} sub="Material recovery" />
          </div>
          <div className="grid gap-4 grid-cols-3 md:grid-cols-6">
            <HealthRing value={96} label="CPCB Score" color="#16a34a" />
            <HealthRing value={91} label="Recycle Rate" color="#15803d" />
            <HealthRing value={84} label="Refurb Rate" color="#22c55e" />
            <HealthRing value={98} label="Data Destroy" color="#166534" />
            <HealthRing value={77} label="EV Battery" color="#65a30d" />
            <HealthRing value={93} label="EPR Compliant" color="#4ade80" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="ewc-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Monthly Collection Volume</CardTitle></CardHeader><CardContent><LineChart data={monthlyData} width={300} height={200}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" fontSize={12} /><YAxis fontSize={12} /><Tooltip /><Legend /><Line type="monotone" dataKey="items" stroke="#16a34a" strokeWidth={2} /><Line type="monotone" dataKey="co2" stroke="#15803d" strokeWidth={2} strokeDasharray="5 5" /></LineChart></CardContent></Card>
            <Card className="ewc-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Items by E-Waste Type</CardTitle></CardHeader><CardContent><BarChart data={typeData} width={300} height={200}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="type" fontSize={10} angle={-30} textAnchor="end" height={50} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="count" fill="#16a34a" radius={[4,4,0,0]} /></BarChart></CardContent></Card>
            <Card className="ewc-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Recycler Distribution</CardTitle></CardHeader><CardContent><PieChart width={300} height={200}><Pie data={recyclerData} dataKey="count" nameKey="recycler" cx="50%" cy="50%" outerRadius={70} label={({ recycler, count }) => `${recycler}: ${count}`}>{recyclerData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="items" className="ewc-tab-content space-y-4 mt-4">
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={allItems.length} filteredCount={filtered.length} onRefresh={() => {}} placeholder="Search by ID, type, recycler, or source..." />
          <div className="overflow-x-auto rounded-lg border">
            <table className="ewc-table w-full text-sm">
              <thead><tr className="ewc-table-header bg-gray-50"><th className="px-3 py-2 text-left font-medium">ID</th><th className="px-3 py-2 text-left font-medium">Type</th><th className="px-3 py-2 text-left font-medium">Recycler</th><th className="px-3 py-2 text-left font-medium">Weight</th><th className="px-3 py-2 text-left font-medium">Disposition</th><th className="px-3 py-2 text-left font-medium">Recovery</th><th className="px-3 py-2 text-left font-medium">CO2</th><th className="px-3 py-2 text-left font-medium">Source</th><th className="px-3 py-2 text-left font-medium">Value</th></tr></thead>
              <tbody>{filtered.slice(0, 20).map(d => (
                <tr key={d.id} className="ewc-table-row border-t hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-2 font-mono text-xs">{d.id}</td>
                  <td className="px-3 py-2"><TypeBadge type={d.type} /></td>
                  <td className="px-3 py-2"><RecyclerBadge recycler={d.recycler} /></td>
                  <td className="px-3 py-2 text-xs">{d.weight_kg} kg</td>
                  <td className="px-3 py-2"><DispositionBadge disposition={d.disposition} /></td>
                  <td className="px-3 py-2"><RecoveryBar rate={d.recovery_rate} /></td>
                  <td className="px-3 py-2 text-xs text-green-700">{d.co2_saved} kg</td>
                  <td className="px-3 py-2 text-xs">{d.source}</td>
                  <td className="px-3 py-2 text-xs">₹{d.value_inr.toLocaleString('en-IN')}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="ewc-tab-content space-y-4 mt-4">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <ValueTile title="Avg Weight/item" value="38.5 kg" trend="+5.2% vs last month" />
            <ValueTile title="Total Value" value="₹12.4L" trend="+18.3% growth" />
            <ValueTile title="Hazardous %" value="62%" trend="-3% reduced" />
            <ValueTile title="EPR Targets" value="88%" trend="+6% achieved" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="ewc-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Recycler Throughput</CardTitle></CardHeader><CardContent><BarChart data={recyclerData} width={400} height={250}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="recycler" fontSize={10} angle={-30} textAnchor="end" height={50} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="count" fill="#15803d" radius={[4,4,0,0]} /></BarChart></CardContent></Card>
            <Card className="ewc-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Disposition Mix</CardTitle></CardHeader><CardContent><PieChart width={400} height={250}><Pie data={DISPOSITION.map(d => ({ disp: d, count: allItems.filter(i => i.disposition === d).length }))} dataKey="count" nameKey="disp" cx="50%" cy="50%" outerRadius={80} label>{DISPOSITION.map((_, i) => <Cell key={i} fill={['#22c55e','#3b82f6','#ef4444','#f59e0b','#8b5cf6','#6366f1'][i]} />)}</Pie><Tooltip /></PieChart></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="ewc-tab-content space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="ewc-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">EPR Extended Producer Responsibility Portal</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>CPCB EPR portal integration for real-time compliance tracking. Automated PRO returns filing for 150+ producer organizations. Target: 100% EPR compliance by March 2027 with zero manual filing.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-green-800">Mandatory</span><span className="text-gray-400">Q4 2026</span></div></CardContent></Card>
            <Card className="ewc-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">EV Battery Second-Life Program</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Partnering with Ather, Ola, and Mahindra for EV battery second-life repurposing. Used EV batteries reconditioned for solar storage systems in rural Karnataka. 500+ batteries processed monthly with 86% recovery rate.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-800">High Impact</span><span className="text-gray-400">FY2027</span></div></CardContent></Card>
            <Card className="ewc-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">Urban E-Waste Collection Kiosks</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>50 smart e-waste collection kiosks deployed across Bangalore, Delhi, and Mumbai malls. Citizens drop old phones and electronics for instant cash via UPI. AI-powered sorting identifies precious metal recovery potential.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-lime-100 px-2 py-0.5 text-lime-800">Growth</span><span className="text-gray-400">Q1 2027</span></div></CardContent></Card>
            <Card className="ewc-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">Precious Metal Recovery Lab</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>In-house hydrometallurgical recovery extracting gold, silver, and palladium from PCB assemblies. Current yield: 2.4g Au, 12g Ag per tonne of PCB waste. Revenue potential: ₹18L/month at current volumes.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-teal-100 px-2 py-0.5 text-teal-800">Revenue</span><span className="text-gray-400">Pilot</span></div></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
