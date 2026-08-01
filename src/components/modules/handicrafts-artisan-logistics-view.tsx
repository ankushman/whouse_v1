import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#581c87', '#6b21a8', '#9333ea', '#a855f7', '#c084fc', '#3b0764', '#4c1d95', '#faf5ff']
const PRODUCTS = ['Blue Pottery Jaipur', 'Pashmina Shawl Kashmir', 'Brass Moradabad', 'Chikankari Lucknow', 'Madhubani Painting', 'Kondapalli Toy', 'Kalamkari Textile', 'Kashmir Papier Mache']
const ARTISANS = ['Jaipur Handicraft Cluster', 'Srinagar Craft Guild', 'Moradabad Metal Works', 'Lucknow Chikan Hub', 'Madhubani Bihar Cooperative', 'Kondapalli Andhra Artisans', 'Srikalahasti Kalamkari', 'Srinagar Papier Atelier']
const STATUSES = ['GI Tag Certified', 'EPCH Registered', 'In Transit Fragile', 'Climate Store', 'Pending IGST 12%', 'Awaiting Craft QC']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="hal-badge inline-block px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="hal-status inline-block px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="hal-costbar w-full bg-purple-100 rounded h-2"><div className="bg-purple-600 h-2 rounded" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ value, label, size = 64 }: { value: number; label: string; size?: number }) => {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (ri(0, 100, value) / 100) * circ
  return (
    <div className="hal-health-ring flex flex-col items-center">
      <svg width={size} height={size}><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={4} /><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#581c87" strokeWidth={4} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`} /></svg>
      <span className="text-xs font-semibold" style={{ color: COLORS[0] }}>{value}%</span>
      <span className="text-[10px] text-gray-500">{label}</span>
    </div>
  )
}

const KpiTile = ({ label, value, icon }: { label: string; value: string; icon: string }) => (
  <Card className="hal-kpi"><CardContent className="p-4"><div className="flex items-center gap-3"><span className="text-2xl">{icon}</span><div><p className="text-xs text-gray-500">{label}</p><p className="text-xl font-bold" style={{ color: COLORS[0] }}>{value}</p></div></div></CardContent></Card>
)

const ValueTile = ({ label, value }: { label: string; value: string }) => (
  <Card className="hal-value"><CardContent className="p-4"><p className="text-xs text-gray-500">{label}</p><p className="text-lg font-semibold" style={{ color: COLORS[1] }}>{value}</p></CardContent></Card>
)

const genRecords = (startIdx: number) => Array.from({ length: 20 }, (_, i) => {
  const idx = startIdx + i
  const units = ['pcs', 'sets', 'lots', 'pairs']
  return {
    id: `HAL-${String(idx).padStart(4, '0')}`, product: PRODUCTS[idx % 8], artisan: ARTISANS[idx % 8],
    status: STATUSES[idx % 6], qty: ri(10, 2000, 50 + idx * 38), unit: units[idx % 4],
    cost: ri(5000, 400000, 12000 + idx * 7500), date: `2025-01-${String(ri(1, 28, idx % 28 + 1)).padStart(2, '0')}`,
  }
})

const handRecords = [
  { id: 'HAL-0001', product: 'Blue Pottery Jaipur', artisan: 'Jaipur Handicraft Cluster', status: 'In Transit Fragile', qty: 200, unit: 'pcs', cost: 240000, date: '2025-01-04' },
  { id: 'HAL-0002', product: 'Pashmina Shawl Kashmir', artisan: 'Srinagar Craft Guild', status: 'GI Tag Certified', qty: 120, unit: 'pcs', cost: 360000, date: '2025-01-06' },
  { id: 'HAL-0003', product: 'Brass Moradabad', artisan: 'Moradabad Metal Works', status: 'Climate Store', qty: 800, unit: 'sets', cost: 200000, date: '2025-01-08' },
  { id: 'HAL-0004', product: 'Chikankari Lucknow', artisan: 'Lucknow Chikan Hub', status: 'EPCH Registered', qty: 350, unit: 'pcs', cost: 175000, date: '2025-01-10' },
  { id: 'HAL-0005', product: 'Madhubani Painting', artisan: 'Madhubani Bihar Cooperative', status: 'Pending IGST 12%', qty: 500, unit: 'lots', cost: 150000, date: '2025-01-11' },
  { id: 'HAL-0006', product: 'Kondapalli Toy', artisan: 'Kondapalli Andhra Artisans', status: 'Awaiting Craft QC', qty: 1200, unit: 'pcs', cost: 96000, date: '2025-01-13' },
  { id: 'HAL-0007', product: 'Kalamkari Textile', artisan: 'Srikalahasti Kalamkari', status: 'In Transit Fragile', qty: 250, unit: 'sets', cost: 200000, date: '2025-01-14' },
  { id: 'HAL-0008', product: 'Kashmir Papier Mache', artisan: 'Srinagar Papier Atelier', status: 'GI Tag Certified', qty: 180, unit: 'pcs', cost: 144000, date: '2025-01-16' },
  { id: 'HAL-0009', product: 'Blue Pottery Jaipur', artisan: 'Jaipur Handicraft Cluster', status: 'EPCH Registered', qty: 400, unit: 'pcs', cost: 480000, date: '2025-01-17' },
  { id: 'HAL-0010', product: 'Pashmina Shawl Kashmir', artisan: 'Srinagar Craft Guild', status: 'Climate Store', qty: 80, unit: 'pcs', cost: 240000, date: '2025-01-18' },
  { id: 'HAL-0011', product: 'Brass Moradabad', artisan: 'Moradabad Metal Works', status: 'GI Tag Certified', qty: 650, unit: 'sets', cost: 162500, date: '2025-01-19' },
  { id: 'HAL-0012', product: 'Chikankari Lucknow', artisan: 'Lucknow Chikan Hub', status: 'In Transit Fragile', qty: 280, unit: 'pcs', cost: 140000, date: '2025-01-20' },
  { id: 'HAL-0013', product: 'Madhubani Painting', artisan: 'Madhubani Bihar Cooperative', status: 'Awaiting Craft QC', qty: 600, unit: 'lots', cost: 180000, date: '2025-01-21' },
  { id: 'HAL-0014', product: 'Kondapalli Toy', artisan: 'Kondapalli Andhra Artisans', status: 'EPCH Registered', qty: 1500, unit: 'pcs', cost: 120000, date: '2025-01-22' },
  { id: 'HAL-0015', product: 'Kalamkari Textile', artisan: 'Srikalahasti Kalamkari', status: 'Pending IGST 12%', qty: 300, unit: 'sets', cost: 240000, date: '2025-01-23' },
  { id: 'HAL-0016', product: 'Kashmir Papier Mache', artisan: 'Srinagar Papier Atelier', status: 'Climate Store', qty: 220, unit: 'pcs', cost: 176000, date: '2025-01-24' },
  { id: 'HAL-0017', product: 'Blue Pottery Jaipur', artisan: 'Jaipur Handicraft Cluster', status: 'GI Tag Certified', qty: 350, unit: 'pcs', cost: 420000, date: '2025-01-25' },
  { id: 'HAL-0018', product: 'Pashmina Shawl Kashmir', artisan: 'Srinagar Craft Guild', status: 'In Transit Fragile', qty: 100, unit: 'pcs', cost: 300000, date: '2025-01-26' },
  { id: 'HAL-0019', product: 'Brass Moradabad', artisan: 'Moradabad Metal Works', status: 'Awaiting Craft QC', qty: 900, unit: 'sets', cost: 225000, date: '2025-01-27' },
  { id: 'HAL-0020', product: 'Chikankari Lucknow', artisan: 'Lucknow Chikan Hub', status: 'EPCH Registered', qty: 420, unit: 'pcs', cost: 210000, date: '2025-01-28' },
]




export default function HandicraftsArtisanLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = [...handRecords, ...genRecords(21), ...genRecords(41)]

  const filteredRecords = useMemo(() => {
    return allRecords.filter(r => {
      if (searchQuery && !r.id.toLowerCase().includes(searchQuery.toLowerCase()) && !r.product.toLowerCase().includes(searchQuery.toLowerCase())) return false
      return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string))
    })
  }, [searchQuery, activeFilters, allRecords])

  const filterGroups = [
    { key: 'product', label: 'Craft Type', options: PRODUCTS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.product === p).length })) },
    { key: 'status', label: 'Status', options: STATUSES.map(s => ({ value: s, label: s, count: allRecords.filter(r => r.status === s).length })) },
  ]

  const trendData = PRODUCTS.slice(0, 6).map((p, i) => ({ name: p.split(' ').slice(0, 2).join(' '), shipments: 8 + i * 7, cost: 120000 + i * 22000 }))
  const artisanChart = ARTISANS.slice(0, 6).map((a, i) => ({ name: a.split(' ').slice(0, 2).join(' '), volume: 80 + i * 60, revenue: 5 + i * 3 }))
  const statusPie = STATUSES.map((s, i) => ({ name: s.split(' ').slice(0, 2).join(' '), value: 10 + i * 4 }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="hal-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Handicrafts & Artisan' }]} />
      <PageHeader title="Handicrafts & Artisan Logistics" description="Track Indian handicraft shipments from artisan clusters to global markets" />
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-purple-50">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <KpiTile icon="🎨" label="Total Shipments" value={String(allRecords.length)} />
            <KpiTile icon="🔨" label="Artisan Clusters" value={String(ARTISANS.length)} />
            <KpiTile icon="💰" label="Total Value" value={`₹${(allRecords.reduce((a, r) => a + r.cost, 0) / 100000).toFixed(1)}L`} />
            <KpiTile icon="📈" label="Avg Cost" value={`₹${Math.round(allRecords.reduce((a, r) => a + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>

          <Card className="hal-health-grid">
            <CardHeader><CardTitle>Operational Health</CardTitle></CardHeader>
            <CardContent>
              <div className="flex justify-around">
                <HealthRing value={76} label="Craftsmanship" />
                <HealthRing value={88} label="Packaging" />
                <HealthRing value={71} label="Transit" />
                <HealthRing value={95} label="GI Tags" />
                <HealthRing value={82} label="Export" />
                <HealthRing value={68} label="Artisan Pay" />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Blue Pottery" value="1,350 pcs" />
            <ValueTile label="Pashmina Shipped" value="300 pcs" />
            <ValueTile label="Pending IGST 12%" value="₹3.3L" />
            <ValueTile label="GI Tagged" value="36 Lots" />
          </div>
        </TabsContent>

        <TabsContent value="shipments" className="space-y-4">
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={(key, value) => setActiveFilters(p => ({ ...p, [key]: p[key]?.includes(value) ? p[key].filter((v: string) => v !== value) : [...(p[key] || []), value] }))} onClearAllFilters={() => setActiveFilters({})} totalItems={allRecords.length} filteredCount={filteredRecords.length} onRefresh={() => {}} placeholder="Search by ID, craft, artisan, or lot..." />

          <Card className="hal-table-card">
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-purple-50">
                    <th className="p-3 text-left">ID</th>
                    <th className="p-3 text-left">Craft</th>
                    <th className="p-3 text-left">Artisan</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-right">Qty</th>
                    <th className="p-3 text-right">Cost</th>
                    <th className="p-3 text-left">Cost Bar</th>
                    <th className="p-3 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.slice(0, 15).map(r => (
                    <tr key={r.id} className="border-b hover:bg-purple-50/50">
                      <td className="p-3 font-mono text-xs">{r.id}</td>
                      <td className="p-3"><ProductBadge name={r.product} /></td>
                      <td className="p-3 text-xs">{r.artisan}</td>
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
                  <Line type="monotone" dataKey="cost" stroke={COLORS[2]} strokeWidth={2} />
                </LineChart>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Artisan Volume</CardTitle></CardHeader>
              <CardContent>
                <BarChart width={500} height={250} data={artisanChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={10} />
                  <YAxis fontSize={11} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="volume" fill={COLORS[0]} />
                  <Bar dataKey="revenue" fill={COLORS[2]} />
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
            <Card className="hal-insight"><CardHeader><CardTitle>Geographical Indication Tags</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">India has 350+ GI-tagged products protecting regional crafts. Blue Pottery of Jaipur, Pashmina from Kashmir, Chikankari from Lucknow, and Madhubani paintings from Bihar carry GI certification preventing imitation and enabling premium export pricing.</p></CardContent></Card>
            <Card className="hal-insight"><CardHeader><CardTitle>EPCH Export Promotion</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Export Promotion Council for Handicrafts facilitates Indian artisan goods in 100+ countries. India exports $3.4 billion in handicrafts annually with major markets in USA, EU, UAE, and Japan under favourable IGST 12% export duty structure.</p></CardContent></Card>
            <Card className="hal-insight"><CardHeader><CardTitle>Fragile Handling Standards</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Handicraft logistics require specialized fragile handling with custom foam inserts, temperature-controlled trucks, and shock-sensor packaging. Kashmir papier mache and blue pottery have 15-20% breakage rate without proper shock-absorbent crating.</p></CardContent></Card>
            <Card className="hal-insight"><CardHeader><CardTitle>AI Artisan Marketplace</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">AI-powered platforms connect artisans directly to global buyers, eliminating 40% intermediary margins. Computer vision authenticates craft patterns against GI registries, ensuring genuine products reach consumers with verified provenance certificates.</p></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
