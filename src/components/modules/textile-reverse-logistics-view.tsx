import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#db2777', '#be185d', '#ec4899', '#f472b6', '#f9a8d4', '#9d174d', '#a21caf', '#c026d3']

const GARMENT_TYPES = ['T-Shirts', 'Denim Jeans', 'Formal Shirts', 'Kurta Sets', 'Sportswear', 'Ethnic Wear', 'Innerwear', 'Jackets']
const RETURN_REASONS = ['Size Mismatch', 'Colour Variation', 'Defective Stitch', 'Wrong Item', 'Quality Issue', 'Late Delivery', 'Changed Mind', 'Not As Described']
const PROCESSING_STATUS = ['Quality Check', 'Refurbishing', 'Re-tagging', 'Ready for Resale', 'Donated', 'Recycled Fiber', 'Scrap']

const returns = [
  { id: 'TXR-0001', garment: 'T-Shirts', reason: 'Size Mismatch', status: 'Quality Check', brand: 'Myntra', weight_kg: 0.4, condition_score: 85, return_value_inr: 899, resale_value_inr: 649, source_pin: '560001', received: '2026-07-30', turnaround_days: 2 },
  { id: 'TXR-0002', garment: 'Denim Jeans', reason: 'Colour Variation', status: 'Refurbishing', brand: 'Ajio', weight_kg: 1.2, condition_score: 72, return_value_inr: 2499, resale_value_inr: 1699, source_pin: '400001', received: '2026-07-30', turnaround_days: 3 },
  { id: 'TXR-0003', garment: 'Formal Shirts', reason: 'Defective Stitch', status: 'Re-tagging', brand: 'Flipkart', weight_kg: 0.35, condition_score: 68, return_value_inr: 1899, resale_value_inr: 1199, source_pin: '110001', received: '2026-07-29', turnaround_days: 4 },
  { id: 'TXR-0004', garment: 'Kurta Sets', reason: 'Wrong Item', status: 'Ready for Resale', brand: 'Meesho', weight_kg: 0.6, condition_score: 95, return_value_inr: 1299, resale_value_inr: 1099, source_pin: '700001', received: '2026-07-29', turnaround_days: 1 },
  { id: 'TXR-0005', garment: 'Sportswear', reason: 'Quality Issue', status: 'Recycled Fiber', brand: 'Amazon', weight_kg: 0.45, condition_score: 32, return_value_inr: 3499, resale_value_inr: 0, source_pin: '560100', received: '2026-07-28', turnaround_days: 5 },
  { id: 'TXR-0006', garment: 'Ethnic Wear', reason: 'Changed Mind', status: 'Ready for Resale', brand: 'Myntra', weight_kg: 0.8, condition_score: 98, return_value_inr: 3999, resale_value_inr: 3499, source_pin: '600001', received: '2026-07-28', turnaround_days: 1 },
  { id: 'TXR-0007', garment: 'Innerwear', reason: 'Size Mismatch', status: 'Scrap', brand: 'Flipkart', weight_kg: 0.15, condition_score: 18, return_value_inr: 599, resale_value_inr: 0, source_pin: '122001', received: '2026-07-27', turnaround_days: 6 },
  { id: 'TXR-0008', garment: 'Jackets', reason: 'Not As Described', status: 'Quality Check', brand: 'Ajio', weight_kg: 1.5, condition_score: 78, return_value_inr: 4999, resale_value_inr: 3499, source_pin: '380001', received: '2026-07-27', turnaround_days: 3 },
  { id: 'TXR-0009', garment: 'T-Shirts', reason: 'Late Delivery', status: 'Ready for Resale', brand: 'Meesho', weight_kg: 0.3, condition_score: 92, return_value_inr: 699, resale_value_inr: 599, source_pin: '751001', received: '2026-07-26', turnaround_days: 2 },
  { id: 'TXR-0010', garment: 'Denim Jeans', reason: 'Size Mismatch', status: 'Refurbishing', brand: 'Amazon', weight_kg: 1.1, condition_score: 65, return_value_inr: 2199, resale_value_inr: 1399, source_pin: '411001', received: '2026-07-26', turnaround_days: 4 },
  { id: 'TXR-0011', garment: 'Formal Shirts', reason: 'Colour Variation', status: 'Donated', brand: 'Myntra', weight_kg: 0.4, condition_score: 45, return_value_inr: 1599, resale_value_inr: 0, source_pin: '500001', received: '2026-07-25', turnaround_days: 5 },
  { id: 'TXR-0012', garment: 'Kurta Sets', reason: 'Defective Stitch', status: 'Re-tagging', brand: 'Flipkart', weight_kg: 0.55, condition_score: 70, return_value_inr: 1499, resale_value_inr: 999, source_pin: '302001', received: '2026-07-25', turnaround_days: 3 },
  { id: 'TXR-0013', garment: 'Sportswear', reason: 'Changed Mind', status: 'Ready for Resale', brand: 'Ajio', weight_kg: 0.5, condition_score: 96, return_value_inr: 2999, resale_value_inr: 2599, source_pin: '560034', received: '2026-07-24', turnaround_days: 1 },
  { id: 'TXR-0014', garment: 'Ethnic Wear', reason: 'Wrong Item', status: 'Quality Check', brand: 'Meesho', weight_kg: 0.75, condition_score: 82, return_value_inr: 2499, resale_value_inr: 1899, source_pin: '690001', received: '2026-07-24', turnaround_days: 2 },
  { id: 'TXR-0015', garment: 'Innerwear', reason: 'Quality Issue', status: 'Scrap', brand: 'Amazon', weight_kg: 0.12, condition_score: 22, return_value_inr: 449, resale_value_inr: 0, source_pin: '380015', received: '2026-07-23', turnaround_days: 7 },
  { id: 'TXR-0016', garment: 'Jackets', reason: 'Size Mismatch', status: 'Refurbishing', brand: 'Myntra', weight_kg: 1.3, condition_score: 60, return_value_inr: 5999, resale_value_inr: 3999, source_pin: '110002', received: '2026-07-23', turnaround_days: 4 },
  { id: 'TXR-0017', garment: 'T-Shirts', reason: 'Not As Described', status: 'Ready for Resale', brand: 'Flipkart', weight_kg: 0.35, condition_score: 90, return_value_inr: 799, resale_value_inr: 649, source_pin: '600020', received: '2026-07-22', turnaround_days: 2 },
  { id: 'TXR-0018', garment: 'Denim Jeans', reason: 'Defective Stitch', status: 'Recycled Fiber', brand: 'Ajio', weight_kg: 1.0, condition_score: 28, return_value_inr: 1899, resale_value_inr: 0, source_pin: '682001', received: '2026-07-22', turnaround_days: 6 },
  { id: 'TXR-0019', garment: 'Formal Shirts', reason: 'Late Delivery', status: 'Re-tagging', brand: 'Amazon', weight_kg: 0.38, condition_score: 88, return_value_inr: 2099, resale_value_inr: 1799, source_pin: '400051', received: '2026-07-21', turnaround_days: 2 },
  { id: 'TXR-0020', garment: 'Kurta Sets', reason: 'Colour Variation', status: 'Donated', brand: 'Meesho', weight_kg: 0.65, condition_score: 42, return_value_inr: 999, resale_value_inr: 0, source_pin: '141001', received: '2026-07-21', turnaround_days: 5 },
]

const genRecords = (start: number) => {
  const statuses = ['Quality Check', 'Refurbishing', 'Re-tagging', 'Ready for Resale', 'Donated', 'Recycled Fiber', 'Scrap']
  const brands = ['Myntra', 'Ajio', 'Flipkart', 'Meesho', 'Amazon', 'Snapdeal', 'Limeroad', 'Nykaa Fashion']
  const pincodes = ['560001', '400001', '110001', '700001', '600001', '122001', '380001', '411001', '500001', '302001', '690001', '751001']
  return Array.from({ length: 40 }, (_, i) => ({
    id: `TXR-${String(start + i).padStart(4, '0')}`,
    garment: GARMENT_TYPES[(start + i) % 8],
    reason: RETURN_REASONS[(start + i) % 8],
    status: statuses[(start + i) % 7],
    brand: brands[(start + i) % 8],
    weight_kg: Math.round((0.1 + Math.random() * 1.8) * 100) / 100,
    condition_score: Math.round(15 + Math.random() * 85),
    return_value_inr: Math.round(399 + Math.random() * 5600),
    resale_value_inr: Math.round(Math.random() * 1) * Math.round(299 + Math.random() * 4000),
    source_pin: pincodes[(start + i) % 12],
    received: `2026-07-${String(20 - Math.floor((start + i) / 10)).padStart(2, '0')}`,
    turnaround_days: Math.floor(1 + Math.random() * 7),
  }))
}

const allReturns = [...returns, ...genRecords(21), ...genRecords(61)]

function ri(min: number, max: number, value: number) {
  return Math.max(min, Math.min(max, value))
}

const filterGroups = [
  {
    key: 'garment',
    label: 'Garment Type',
    options: GARMENT_TYPES.map(g => ({ label: g, value: g, count: allReturns.filter(d => d.garment === g).length })),
  },
  {
    key: 'reason',
    label: 'Return Reason',
    options: RETURN_REASONS.map(r => ({ label: r, value: r, count: allReturns.filter(d => d.reason === r).length })),
  },
  {
    key: 'status',
    label: 'Status',
    options: PROCESSING_STATUS.map(s => ({ label: s, value: s, count: allReturns.filter(d => d.status === s).length })),
  },
]

function GarmentBadge({ garment }: { garment: string }) {
  const colors: Record<string, string> = { 'T-Shirts': 'bg-pink-100 text-pink-800', 'Denim Jeans': 'bg-indigo-100 text-indigo-800', 'Formal Shirts': 'bg-blue-100 text-blue-800', 'Kurta Sets': 'bg-rose-100 text-rose-800', Sportswear: 'bg-cyan-100 text-cyan-800', 'Ethnic Wear': 'bg-fuchsia-100 text-fuchsia-800', Innerwear: 'bg-purple-100 text-purple-800', Jackets: 'bg-violet-100 text-violet-800' }
  return <span className={`txr-garment-badge inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[garment] || 'bg-gray-100 text-gray-800'}`}>{garment}</span>
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = { 'Quality Check': 'bg-yellow-100 text-yellow-800', Refurbishing: 'bg-blue-100 text-blue-800', 'Re-tagging': 'bg-cyan-100 text-cyan-800', 'Ready for Resale': 'bg-green-100 text-green-800', Donated: 'bg-teal-100 text-teal-800', 'Recycled Fiber': 'bg-orange-100 text-orange-800', Scrap: 'bg-red-100 text-red-800' }
  return <span className={`txr-status-badge inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-700'}`}>{status}</span>
}

function ConditionBar({ score }: { score: number }) {
  const pct = ri(0, 100, score)
  const color = pct >= 80 ? 'bg-green-500' : pct >= 60 ? 'bg-yellow-500' : pct >= 40 ? 'bg-orange-500' : 'bg-red-500'
  return <div className="txr-cond-bar flex items-center gap-2"><div className="h-2 w-20 rounded-full bg-gray-200"><div className={`txr-cond-bar-fill h-2 rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} /></div><span className="text-xs text-gray-500">{score}/100</span></div>
}

function RecoveryBar({ returnVal, resaleVal }: { returnVal: number; resaleVal: number }) {
  const pct = returnVal > 0 ? ri(0, 100, (resaleVal / returnVal) * 100) : 0
  const color = pct >= 70 ? 'bg-pink-500' : pct >= 40 ? 'bg-yellow-500' : 'bg-red-500'
  return <div className="txr-recovery-bar flex items-center gap-2"><div className="h-2 w-20 rounded-full bg-gray-200"><div className={`txr-recovery-bar-fill h-2 rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} /></div><span className="text-xs text-gray-500">{pct}%</span></div>
}

function HealthRing({ value, label, color }: { value: number; label: string; color: string }) {
  const r = 28, cx = 35, cy = 35, sw = 5
  const circ = 2 * Math.PI * r
  const offset = circ - (ri(0, 100, value) / 100) * circ
  return <div className="txr-health-ring flex flex-col items-center"><svg width={70} height={70} className="-rotate-90"><circle cx={cx} cy={cy} r={r} fill="none" stroke="#e5e7eb" strokeWidth={sw} /><circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={sw} strokeDasharray={circ} strokeDashoffset={offset} className="txr-ring-path" strokeLinecap="round" /></svg><span className="txr-ring-value mt-1 text-sm font-bold" style={{ color }}>{value}%</span><span className="text-xs text-gray-500">{label}</span></div>
}

function KpiTile({ title, value, sub }: { title: string; value: string; sub: string }) {
  return <Card className="txr-kpi-card"><CardContent className="p-4"><p className="text-xs text-gray-500">{title}</p><p className="txr-kpi-value mt-1 text-2xl font-bold">{value}</p><p className="text-xs text-gray-400 mt-0.5">{sub}</p></CardContent></Card>
}

function ValueTile({ title, value, trend }: { title: string; value: string; trend: string }) {
  const up = trend.startsWith('+')
  return <Card className="txr-value-tile"><CardContent className="p-4"><p className="text-xs text-gray-500">{title}</p><p className="mt-1 text-xl font-bold">{value}</p><p className={`text-xs mt-0.5 ${up ? 'text-green-600' : 'text-red-500'}`}>{trend}</p></CardContent></Card>
}

export default function TextileReverseLogisticsView() {
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

  const filtered = allReturns.filter(d => {
    const q = searchQuery.toLowerCase()
    if (q && !d.id.toLowerCase().includes(q) && !d.garment.toLowerCase().includes(q) && !d.brand.toLowerCase().includes(q) && !d.reason.toLowerCase().includes(q)) return false
    return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(d[key as keyof typeof d] as string))
  })

  const resaleReady = allReturns.filter(d => d.status === 'Ready for Resale').length
  const totalReturnVal = allReturns.reduce((s, d) => s + d.return_value_inr, 0)
  const totalResaleVal = allReturns.reduce((s, d) => s + d.resale_value_inr, 0)
  const avgCondition = (allReturns.reduce((s, d) => s + d.condition_score, 0) / allReturns.length).toFixed(0)

  const monthlyData = [
    { month: 'Jan', returns: 320, resale: 180, donated: 45 },
    { month: 'Feb', returns: 380, resale: 210, donated: 52 },
    { month: 'Mar', returns: 350, resale: 195, donated: 48 },
    { month: 'Apr', returns: 420, resale: 240, donated: 60 },
    { month: 'May', returns: 460, resale: 265, donated: 55 },
    { month: 'Jun', returns: 390, resale: 220, donated: 50 },
    { month: 'Jul', returns: 440, resale: 255, donated: 62 },
  ]
  const garmentData = GARMENT_TYPES.map(g => ({ garment: g, count: allReturns.filter(d => d.garment === g).length }))
  const brandData = ['Myntra', 'Ajio', 'Flipkart', 'Meesho', 'Amazon'].map(b => ({ brand: b, count: allReturns.filter(d => d.brand === b).length }))

  const tabs = [
    { value: 'dashboard', label: 'Dashboard' },
    { value: 'returns', label: 'Returns' },
    { value: 'analytics', label: 'Analytics' },
    { value: 'insights', label: 'Insights' },
  ]

  return (
    <div className="txr-container space-y-4">
      <PageHeader title="Textile Reverse Logistics" description="Fashion returns processing, grading, refurbishment and resale recovery for Indian e-commerce" />
      <ModuleBreadcrumb items={[{ label: 'Sustainability' }, { label: 'Textile Returns' }]} />
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="txr-tabs-list">
          {tabs.map(t => <TabsTrigger key={t.value} value={t.value} className="txr-tab-trigger">{t.label}</TabsTrigger>)}
        </TabsList>

        <TabsContent value="dashboard" className="txr-tab-content space-y-4 mt-4">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <KpiTile title="Total Returns" value={allReturns.length.toString()} sub="This month" />
            <KpiTile title="Resale Ready" value={resaleReady.toString()} sub={`${((resaleReady / allReturns.length) * 100).toFixed(0)}% recovery`} />
            <KpiTile title="Return Value" value={`₹${(totalReturnVal / 100000).toFixed(1)}L`} sub="At MRP" />
            <KpiTile title="Resale Value" value={`₹${(totalResaleVal / 100000).toFixed(1)}L`} sub="Recovery amount" />
          </div>
          <div className="grid gap-4 grid-cols-3 md:grid-cols-6">
            <HealthRing value={88} label="Resale Rate" color="#db2777" />
            <HealthRing value={72} label="Avg Condition" color="#be185d" />
            <HealthRing value={65} label="Value Recovery" color="#ec4899" />
            <HealthRing value={82} label="Turnaround" color="#9d174d" />
            <HealthRing value={91} label="Brand SLA" color="#a21caf" />
            <HealthRing value={58} label="Recycle Rate" color="#c026d3" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="txr-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Monthly Returns vs Resale</CardTitle></CardHeader><CardContent><LineChart data={monthlyData} width={300} height={200}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" fontSize={12} /><YAxis fontSize={12} /><Tooltip /><Legend /><Line type="monotone" dataKey="returns" stroke="#db2777" strokeWidth={2} /><Line type="monotone" dataKey="resale" stroke="#be185d" strokeWidth={2} strokeDasharray="5 5" /><Line type="monotone" dataKey="donated" stroke="#9d174d" strokeWidth={2} strokeDasharray="2 2" /></LineChart></CardContent></Card>
            <Card className="txr-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Returns by Garment Type</CardTitle></CardHeader><CardContent><BarChart data={garmentData} width={300} height={200}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="garment" fontSize={10} angle={-30} textAnchor="end" height={50} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="count" fill="#db2777" radius={[4,4,0,0]} /></BarChart></CardContent></Card>
            <Card className="txr-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Top Brand Returns</CardTitle></CardHeader><CardContent><PieChart width={300} height={200}><Pie data={brandData} dataKey="count" nameKey="brand" cx="50%" cy="50%" outerRadius={70} label={({ brand, count }) => `${brand}: ${count}`}>{brandData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="returns" className="txr-tab-content space-y-4 mt-4">
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={allReturns.length} filteredCount={filtered.length} onRefresh={() => {}} placeholder="Search by ID, garment, brand, or reason..." />
          <div className="overflow-x-auto rounded-lg border">
            <table className="txr-table w-full text-sm">
              <thead><tr className="txr-table-header bg-gray-50"><th className="px-3 py-2 text-left font-medium">ID</th><th className="px-3 py-2 text-left font-medium">Garment</th><th className="px-3 py-2 text-left font-medium">Reason</th><th className="px-3 py-2 text-left font-medium">Status</th><th className="px-3 py-2 text-left font-medium">Condition</th><th className="px-3 py-2 text-left font-medium">Recovery</th><th className="px-3 py-2 text-left font-medium">Brand</th><th className="px-3 py-2 text-left font-medium">PIN</th><th className="px-3 py-2 text-left font-medium">Days</th></tr></thead>
              <tbody>{filtered.slice(0, 20).map(d => (
                <tr key={d.id} className="txr-table-row border-t hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-2 font-mono text-xs">{d.id}</td>
                  <td className="px-3 py-2"><GarmentBadge garment={d.garment} /></td>
                  <td className="px-3 py-2 text-xs">{d.reason}</td>
                  <td className="px-3 py-2"><StatusBadge status={d.status} /></td>
                  <td className="px-3 py-2"><ConditionBar score={d.condition_score} /></td>
                  <td className="px-3 py-2"><RecoveryBar returnVal={d.return_value_inr} resaleVal={d.resale_value_inr} /></td>
                  <td className="px-3 py-2 text-xs">{d.brand}</td>
                  <td className="px-3 py-2 text-xs">{d.source_pin}</td>
                  <td className="px-3 py-2 text-xs">{d.turnaround_days}d</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="txr-tab-content space-y-4 mt-4">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <ValueTile title="Avg Condition" value={`${avgCondition}/100`} trend="+3 vs last month" />
            <ValueTile title="Resale Revenue" value="₹8.2L" trend="+14.2% growth" />
            <ValueTile title="Avg Turnaround" value="3.2 days" trend="-0.8 improved" />
            <ValueTile title="Recycle Volume" value="1.8T" trend="+22% increased" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="txr-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Garment Returns Volume</CardTitle></CardHeader><CardContent><BarChart data={garmentData} width={400} height={250}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="garment" fontSize={10} angle={-30} textAnchor="end" height={50} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="count" fill="#be185d" radius={[4,4,0,0]} /></BarChart></CardContent></Card>
            <Card className="txr-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Processing Status Mix</CardTitle></CardHeader><CardContent><PieChart width={400} height={250}><Pie data={PROCESSING_STATUS.map(s => ({ status: s, count: allReturns.filter(d => d.status === s).length }))} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={80} label>{PROCESSING_STATUS.map((_, i) => <Cell key={i} fill={['#eab308','#3b82f6','#06b6d4','#22c55e','#14b8a6','#f97316','#ef4444'][i]} />)}</Pie><Tooltip /></PieChart></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="txr-tab-content space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="txr-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">AI Fabric Grading System</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Computer vision system grading returned garments in under 3 seconds. Evaluates fabric integrity, colour fastness, stitch quality, and pilling. Replaced manual grading at 4 facilities, reducing processing time by 65% and improving grading consistency by 40%.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-pink-100 px-2 py-0.5 text-pink-800">High Impact</span><span className="text-gray-400">Q3 2026</span></div></CardContent></Card>
            <Card className="txr-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">Resale Marketplace Integration</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Direct integration with Myntra Resale, eBay India, and OLX for graded garments. Auto-listing with AI-generated product descriptions and photography. Average time from grading to listing reduced from 48 hours to 2 hours.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-rose-100 px-2 py-0.5 text-rose-800">Revenue</span><span className="text-gray-400">Live</span></div></CardContent></Card>
            <Card className="txr-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">Fiber-to-Fiber Recycling</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Partnership with Recover India for mechanical fiber recycling of unsaleable garments. Converting cotton/polyester blends into reusable yarn for low-cost institutional clothing. 1.8 tonnes processed monthly with 92% fiber recovery rate.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-fuchsia-100 px-2 py-0.5 text-fuchsia-800">Circular Economy</span><span className="text-gray-400">FY2027</span></div></CardContent></Card>
            <Card className="txr-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">Tier-2 Donation Network</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Graded garments not suitable for resale donated through Goonj and Cloth Collection Drive network. Reaching 280+ district-level NGOs across UP, Bihar, Rajasthan, and MP. QR-code tracking ensures end-to-end visibility from warehouse to beneficiary.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-violet-100 px-2 py-0.5 text-violet-800">Social Impact</span><span className="text-gray-400">Ongoing</span></div></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
