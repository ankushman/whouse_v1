import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#78350f', '#92400e', '#b45309', '#d97706', '#f59e0b', '#451a03', '#7c2d12', '#fef3c7']
const STONES = ['Makrana White Marble', 'Rajasthan Black Granite', 'Kota Blue Limestone', 'Jalore Granite', 'Udaipur Green Marble', 'Chennai Black Galaxy', 'Bangalore Pink Granite', 'Vijayawada Black Pearl']
const QUARRIES = ['Makrana Alwar Rajasthan', 'Jalore Quarry Jodhpur', 'Kota Stone Mills Kota', 'Chennai Granite Hub Tamil Nadu', 'Bangalore Granite Yard Karnataka', 'Udaipur Marble Works Rajasthan', 'Vijayawada Stone Hub AP', 'Nashik Basalt Depot Maharashtra']
const STATUSES = ['BIS IS 11226 Certified', 'IGI Quality Sealed', 'In Transit Flatbed', 'Yard Slab Stored', 'Pending Mining Royalty', 'Awaiting Polishing']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const StoneBadge = ({ name }: { name: string }) => (
  <span className="mgl-badge inline-block px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="mgl-status inline-block px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="mgl-costbar w-full bg-amber-100 rounded h-2"><div className="bg-amber-600 h-2 rounded" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ value, label, size = 64 }: { value: number; label: string; size?: number }) => {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (ri(0, 100, value) / 100) * circ
  return (
    <div className="mgl-health-ring flex flex-col items-center">
      <svg width={size} height={size}><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={4} /><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#78350f" strokeWidth={4} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`} /></svg>
      <span className="text-xs font-semibold" style={{ color: COLORS[0] }}>{value}%</span>
      <span className="text-[10px] text-gray-500">{label}</span>
    </div>
  )
}

const KpiTile = ({ label, value, icon }: { label: string; value: string; icon: string }) => (
  <Card className="mgl-kpi"><CardContent className="p-4"><div className="flex items-center gap-3"><span className="text-2xl">{icon}</span><div><p className="text-xs text-gray-500">{label}</p><p className="text-xl font-bold" style={{ color: COLORS[0] }}>{value}</p></div></div></CardContent></Card>
)

const ValueTile = ({ label, value }: { label: string; value: string }) => (
  <Card className="mgl-value"><CardContent className="p-4"><p className="text-xs text-gray-500">{label}</p><p className="text-lg font-semibold" style={{ color: COLORS[1] }}>{value}</p></CardContent></Card>
)

const genRecords = (startIdx: number) => Array.from({ length: 20 }, (_, i) => {
  const idx = startIdx + i
  const units = ['sqft', 'sqm', 'slabs', 'blocks']
  return {
    id: `MGL-${String(idx).padStart(4, '0')}`, stone: STONES[idx % 8], quarry: QUARRIES[idx % 8],
    status: STATUSES[idx % 6], qty: ri(50, 8000, 200 + idx * 85), unit: units[idx % 4],
    cost: ri(20000, 1200000, 45000 + idx * 22000), date: `2025-01-${String(ri(1, 28, idx % 28 + 1)).padStart(2, '0')}`,
  }
})

const handRecords = [
  { id: 'MGL-0001', stone: 'Makrana White Marble', quarry: 'Makrana Alwar Rajasthan', status: 'In Transit Flatbed', qty: 3200, unit: 'sqft', cost: 640000, date: '2025-01-04' },
  { id: 'MGL-0002', stone: 'Rajasthan Black Granite', quarry: 'Jalore Quarry Jodhpur', status: 'BIS IS 11226 Certified', qty: 1800, unit: 'sqm', cost: 720000, date: '2025-01-06' },
  { id: 'MGL-0003', stone: 'Kota Blue Limestone', quarry: 'Kota Stone Mills Kota', status: 'Yard Slab Stored', qty: 5500, unit: 'sqft', cost: 165000, date: '2025-01-08' },
  { id: 'MGL-0004', stone: 'Jalore Granite', quarry: 'Udaipur Marble Works Rajasthan', status: 'Pending Mining Royalty', qty: 2400, unit: 'slabs', cost: 480000, date: '2025-01-10' },
  { id: 'MGL-0005', stone: 'Udaipur Green Marble', quarry: 'Makrana Alwar Rajasthan', status: 'Awaiting Polishing', qty: 1200, unit: 'sqm', cost: 540000, date: '2025-01-11' },
  { id: 'MGL-0006', stone: 'Chennai Black Galaxy', quarry: 'Chennai Granite Hub Tamil Nadu', status: 'IGI Quality Sealed', qty: 800, unit: 'slabs', cost: 960000, date: '2025-01-13' },
  { id: 'MGL-0007', stone: 'Bangalore Pink Granite', quarry: 'Bangalore Granite Yard Karnataka', status: 'In Transit Flatbed', qty: 4200, unit: 'sqft', cost: 336000, date: '2025-01-14' },
  { id: 'MGL-0008', stone: 'Vijayawada Black Pearl', quarry: 'Vijayawada Stone Hub AP', status: 'BIS IS 11226 Certified', qty: 1500, unit: 'blocks', cost: 375000, date: '2025-01-16' },
  { id: 'MGL-0009', stone: 'Makrana White Marble', quarry: 'Jalore Quarry Jodhpur', status: 'Yard Slab Stored', qty: 6000, unit: 'sqft', cost: 1200000, date: '2025-01-17' },
  { id: 'MGL-0010', stone: 'Rajasthan Black Granite', quarry: 'Kota Stone Mills Kota', status: 'Pending Mining Royalty', qty: 3000, unit: 'sqm', cost: 1200000, date: '2025-01-18' },
  { id: 'MGL-0011', stone: 'Kota Blue Limestone', quarry: 'Nashik Basalt Depot Maharashtra', status: 'IGI Quality Sealed', qty: 4800, unit: 'sqft', cost: 144000, date: '2025-01-19' },
  { id: 'MGL-0012', stone: 'Udaipur Green Marble', quarry: 'Chennai Granite Hub Tamil Nadu', status: 'In Transit Flatbed', qty: 2200, unit: 'slabs', cost: 880000, date: '2025-01-20' },
  { id: 'MGL-0013', stone: 'Chennai Black Galaxy', quarry: 'Bangalore Granite Yard Karnataka', status: 'Awaiting Polishing', qty: 950, unit: 'slabs', cost: 1140000, date: '2025-01-21' },
  { id: 'MGL-0014', stone: 'Bangalore Pink Granite', quarry: 'Vijayawada Stone Hub AP', status: 'BIS IS 11226 Certified', qty: 3600, unit: 'sqft', cost: 288000, date: '2025-01-22' },
  { id: 'MGL-0015', stone: 'Vijayawada Black Pearl', quarry: 'Udaipur Marble Works Rajasthan', status: 'Yard Slab Stored', qty: 2800, unit: 'blocks', cost: 700000, date: '2025-01-23' },
  { id: 'MGL-0016', stone: 'Makrana White Marble', quarry: 'Makrana Alwar Rajasthan', status: 'IGI Quality Sealed', qty: 1500, unit: 'sqm', cost: 675000, date: '2025-01-24' },
  { id: 'MGL-0017', stone: 'Jalore Granite', quarry: 'Jalore Quarry Jodhpur', status: 'In Transit Flatbed', qty: 5200, unit: 'sqft', cost: 260000, date: '2025-01-25' },
  { id: 'MGL-0018', stone: 'Rajasthan Black Granite', quarry: 'Chennai Granite Hub Tamil Nadu', status: 'Pending Mining Royalty', qty: 1100, unit: 'slabs', cost: 440000, date: '2025-01-26' },
  { id: 'MGL-0019', stone: 'Kota Blue Limestone', quarry: 'Kota Stone Mills Kota', status: 'Awaiting Polishing', qty: 7200, unit: 'sqft', cost: 216000, date: '2025-01-27' },
  { id: 'MGL-0020', stone: 'Udaipur Green Marble', quarry: 'Udaipur Marble Works Rajasthan', status: 'BIS IS 11226 Certified', qty: 2000, unit: 'sqm', cost: 900000, date: '2025-01-28' },
]




export default function MarbleGraniteLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = [...handRecords, ...genRecords(21), ...genRecords(41)]

  const filteredRecords = useMemo(() => {
    return allRecords.filter(r => {
      if (searchQuery && !r.id.toLowerCase().includes(searchQuery.toLowerCase()) && !r.stone.toLowerCase().includes(searchQuery.toLowerCase())) return false
      return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string))
    })
  }, [searchQuery, activeFilters, allRecords])

  const filterGroups = [
    { key: 'stone', label: 'Stone Type', options: STONES.map(s => ({ value: s, label: s, count: allRecords.filter(r => r.stone === s).length })) },
    { key: 'status', label: 'Status', options: STATUSES.map(s => ({ value: s, label: s, count: allRecords.filter(r => r.status === s).length })) },
  ]

  const trendData = STONES.slice(0, 6).map((s, i) => ({ name: s.split(' ').slice(0, 2).join(' '), shipments: 10 + i * 8, cost: 200000 + i * 55000 }))
  const quarryChart = QUARRIES.slice(0, 6).map((q, i) => ({ name: q.split(' ').slice(0, 2).join(' '), volume: 150 + i * 100, revenue: 6 + i * 3 }))
  const statusPie = STATUSES.map((s, i) => ({ name: s.split(' ').slice(0, 2).join(' '), value: 12 + i * 4 }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="mgl-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Marble & Granite' }]} />
      <PageHeader title="Marble & Granite Logistics" description="Track natural stone shipments from Indian quarries to processing units and project sites" />
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-amber-50">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <KpiTile icon="🪨" label="Total Shipments" value={String(allRecords.length)} />
            <KpiTile icon="⛏️" label="Active Quarries" value={String(QUARRIES.length)} />
            <KpiTile icon="💰" label="Total Value" value={`₹${(allRecords.reduce((a, r) => a + r.cost, 0) / 100000).toFixed(1)}L`} />
            <KpiTile icon="📈" label="Avg Cost" value={`₹${Math.round(allRecords.reduce((a, r) => a + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>

          <Card className="mgl-health-grid">
            <CardHeader><CardTitle>Operational Health</CardTitle></CardHeader>
            <CardContent>
              <div className="flex justify-around">
                <HealthRing value={79} label="Extraction" />
                <HealthRing value={85} label="Processing" />
                <HealthRing value={72} label="Transit" />
                <HealthRing value={90} label="Quality" />
                <HealthRing value={68} label="Yield" />
                <HealthRing value={82} label="Export" />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Makrana Shipped" value="4,200 sqft" />
            <ValueTile label="Black Galaxy Transit" value="950 slabs" />
            <ValueTile label="Pending Royalty" value="₹8.5L" />
            <ValueTile label="BIS Certified" value="32 Lots" />
          </div>
        </TabsContent>

        <TabsContent value="shipments" className="space-y-4">
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={(key, value) => setActiveFilters(p => ({ ...p, [key]: p[key]?.includes(value) ? p[key].filter((v: string) => v !== value) : [...(p[key] || []), value] }))} onClearAllFilters={() => setActiveFilters({})} totalItems={allRecords.length} filteredCount={filteredRecords.length} onRefresh={() => {}} placeholder="Search by ID, stone, quarry, or lot..." />

          <Card className="mgl-table-card">
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-amber-50">
                    <th className="p-3 text-left">ID</th>
                    <th className="p-3 text-left">Stone</th>
                    <th className="p-3 text-left">Quarry</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-right">Qty</th>
                    <th className="p-3 text-right">Cost</th>
                    <th className="p-3 text-left">Cost Bar</th>
                    <th className="p-3 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.slice(0, 15).map(r => (
                    <tr key={r.id} className="border-b hover:bg-amber-50/50">
                      <td className="p-3 font-mono text-xs">{r.id}</td>
                      <td className="p-3"><StoneBadge name={r.stone} /></td>
                      <td className="p-3 text-xs">{r.quarry}</td>
                      <td className="p-3"><StatusBadge status={r.status} /></td>
                      <td className="p-3 text-right">{r.qty} {r.unit}</td>
                      <td className="p-3 text-right">₹{r.cost.toLocaleString()}</td>
                      <td className="p-3 w-28"><CostBar cost={r.cost} max={maxCost} /></td>
                      <td className="p-3 text-xs text-gray-500">{r.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle>Shipment Trend</CardTitle></CardHeader>
              <CardContent>
                <LineChart width={500} height={250} data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={11} />
                  <YAxis fontSize={11} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="shipments" stroke={COLORS[0]} strokeWidth={2} />
                  <Line type="monotone" dataKey="cost" stroke={COLORS[3]} strokeWidth={2} />
                </LineChart>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Quarry Volume</CardTitle></CardHeader>
              <CardContent>
                <BarChart width={500} height={250} data={quarryChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={10} />
                  <YAxis fontSize={11} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="volume" fill={COLORS[0]} />
                  <Bar dataKey="revenue" fill={COLORS[3]} />
                </BarChart>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader><CardTitle>Status Distribution</CardTitle></CardHeader>
            <CardContent>
              <PieChart width={500} height={300}>
                <Pie data={statusPie} cx={200} cy={150} outerRadius={100} dataKey="value" label>
                  {statusPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card className="mgl-insight"><CardHeader><CardTitle>BIS IS 11226 Marble Standards</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">BIS IS 11226 specifies physical requirements for marble slabs and tiles including water absorption, compressive strength, and abrasion resistance. Rajasthan Makrana marble meets Grade-A export quality for EU and Gulf markets.</p></CardContent></Card>
            <Card className="mgl-insight"><CardHeader><CardTitle>IGI Granite Grading</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Indian Granite Industries Association provides quality grading based on colour uniformity, grain structure, and flaw density. Black Galaxy from Chennai and Himalayan Blue from Odisha command premium pricing in international stone trade fairs.</p></CardContent></Card>
            <Card className="mgl-insight"><CardHeader><CardTitle>Rajasthan Mining Royalty Policy</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Rajasthan government revised mining royalty rates for minor minerals including marble and sandstone. DMG Rajasthan mandates environmental clearance for quarry leases exceeding 5 hectares under EIA Notification 2006.</p></CardContent></Card>
            <Card className="mgl-insight"><CardHeader><CardTitle>AI Stone Defect Detection</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">AI-powered computer vision systems detect micro-cracks, vein discontinuities, and colour banding in marble slabs at processing units. Automated bridge saw cutting reduces waste by 22% and improves slab yield for high-value export orders.</p></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
