import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#7e22ce', '#9333ea', '#a855f7', '#c084fc', '#d8b4fe', '#581c87', '#6b21a8', '#faf5ff']
const PRODUCTS = ['Sitar Ravi Shankar Pro', 'Tabla Zakir Hussain Set', 'Harmonium Delhi Classic', 'Veena Tanjore Concert', 'Flute Bansuri Bamboo', 'Mridangam Kumbakonam', 'Sarangi Rajasthan Folk', 'Dholak Mumbai Festival']
const ARTISANS = ['Rikhi Ram Musical Delhi', 'Miraj Sitars Maharashtra', 'Mumbai Tabla House', 'Tantra Music Kolkata', 'Kerala Sangeet Works', 'Jaipur Folk Instruments', 'Chennai Carnatic Arts', 'Varanasi Flute Crafters']
const STATUSES = ['GI Musical Craft', 'ASNI Certified', 'In Transit Fragile', 'Climate Store', 'Pending GST 18%', 'Awaiting Tuning QC']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="mil-badge inline-block px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="mil-status inline-block px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="mil-costbar w-full bg-purple-100 rounded h-2"><div className="bg-purple-600 h-2 rounded" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ value, label, size = 64 }: { value: number; label: string; size?: number }) => {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (ri(0, 100, value) / 100) * circ
  return (
    <div className="mil-health-ring flex flex-col items-center">
      <svg width={size} height={size}><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={4} /><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#7e22ce" strokeWidth={4} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`} /></svg>
      <span className="text-xs font-semibold" style={{ color: COLORS[0] }}>{value}%</span>
      <span className="text-[10px] text-gray-500">{label}</span>
    </div>
  )
}

const KpiTile = ({ label, value, icon }: { label: string; value: string; icon: string }) => (
  <Card className="mil-kpi"><CardContent className="p-4"><div className="flex items-center gap-3"><span className="text-2xl">{icon}</span><div><p className="text-xs text-gray-500">{label}</p><p className="text-xl font-bold" style={{ color: COLORS[0] }}>{value}</p></div></div></CardContent></Card>
)

const ValueTile = ({ label, value }: { label: string; value: string }) => (
  <Card className="mil-value"><CardContent className="p-4"><p className="text-xs text-gray-500">{label}</p><p className="text-lg font-semibold" style={{ color: COLORS[1] }}>{value}</p></CardContent></Card>
)

const genRecords = (startIdx: number) => Array.from({ length: 20 }, (_, i) => {
  const idx = startIdx + i
  const units = ['pcs', 'sets', 'pairs', 'lots']
  return {
    id: `MIL-${String(idx).padStart(4, '0')}`, product: PRODUCTS[idx % 8], artisan: ARTISANS[idx % 8],
    status: STATUSES[idx % 6], qty: ri(5, 500, 20 + idx * 24), unit: units[idx % 4],
    cost: ri(8000, 500000, 15000 + idx * 12000), date: `2025-01-${String(ri(1, 28, idx % 28 + 1)).padStart(2, '0')}`,
  }
})

const musicRecords = [
  { id: 'MIL-0001', product: 'Sitar Ravi Shankar Pro', artisan: 'Rikhi Ram Musical Delhi', status: 'GI Musical Craft', qty: 12, unit: 'pcs', cost: 480000, date: '2025-01-04' },
  { id: 'MIL-0002', product: 'Tabla Zakir Hussain Set', artisan: 'Mumbai Tabla House', status: 'ASNI Certified', qty: 25, unit: 'sets', cost: 375000, date: '2025-01-06' },
  { id: 'MIL-0003', product: 'Harmonium Delhi Classic', artisan: 'Tantra Music Kolkata', status: 'In Transit Fragile', qty: 40, unit: 'pcs', cost: 280000, date: '2025-01-08' },
  { id: 'MIL-0004', product: 'Veena Tanjore Concert', artisan: 'Chennai Carnatic Arts', status: 'Climate Store', qty: 8, unit: 'pcs', cost: 640000, date: '2025-01-10' },
  { id: 'MIL-0005', product: 'Flute Bansuri Bamboo', artisan: 'Varanasi Flute Crafters', status: 'Pending GST 18%', qty: 120, unit: 'pcs', cost: 96000, date: '2025-01-11' },
  { id: 'MIL-0006', product: 'Mridangam Kumbakonam', artisan: 'Kerala Sangeet Works', status: 'Awaiting Tuning QC', qty: 15, unit: 'pcs', cost: 225000, date: '2025-01-13' },
  { id: 'MIL-0007', product: 'Sarangi Rajasthan Folk', artisan: 'Jaipur Folk Instruments', status: 'GI Musical Craft', qty: 18, unit: 'pcs', cost: 270000, date: '2025-01-14' },
  { id: 'MIL-0008', product: 'Dholak Mumbai Festival', artisan: 'Mumbai Tabla House', status: 'In Transit Fragile', qty: 60, unit: 'pcs', cost: 180000, date: '2025-01-16' },
  { id: 'MIL-0009', product: 'Sitar Ravi Shankar Pro', artisan: 'Rikhi Ram Musical Delhi', status: 'ASNI Certified', qty: 10, unit: 'pcs', cost: 400000, date: '2025-01-17' },
  { id: 'MIL-0010', product: 'Tabla Zakir Hussain Set', artisan: 'Mumbai Tabla House', status: 'Climate Store', qty: 30, unit: 'sets', cost: 450000, date: '2025-01-18' },
  { id: 'MIL-0011', product: 'Harmonium Delhi Classic', artisan: 'Tantra Music Kolkata', status: 'GI Musical Craft', qty: 35, unit: 'pcs', cost: 245000, date: '2025-01-19' },
  { id: 'MIL-0012', product: 'Veena Tanjore Concert', artisan: 'Chennai Carnatic Arts', status: 'Awaiting Tuning QC', qty: 6, unit: 'pcs', cost: 480000, date: '2025-01-20' },
  { id: 'MIL-0013', product: 'Flute Bansuri Bamboo', artisan: 'Varanasi Flute Crafters', status: 'In Transit Fragile', qty: 150, unit: 'pcs', cost: 120000, date: '2025-01-21' },
  { id: 'MIL-0014', product: 'Mridangam Kumbakonam', artisan: 'Kerala Sangeet Works', status: 'Pending GST 18%', qty: 20, unit: 'pcs', cost: 300000, date: '2025-01-22' },
  { id: 'MIL-0015', product: 'Sarangi Rajasthan Folk', artisan: 'Jaipur Folk Instruments', status: 'ASNI Certified', qty: 22, unit: 'pcs', cost: 330000, date: '2025-01-23' },
  { id: 'MIL-0016', product: 'Dholak Mumbai Festival', artisan: 'Mumbai Tabla House', status: 'Climate Store', qty: 45, unit: 'pcs', cost: 135000, date: '2025-01-24' },
  { id: 'MIL-0017', product: 'Sitar Ravi Shankar Pro', artisan: 'Rikhi Ram Musical Delhi', status: 'Awaiting Tuning QC', qty: 14, unit: 'pcs', cost: 560000, date: '2025-01-25' },
  { id: 'MIL-0018', product: 'Tabla Zakir Hussain Set', artisan: 'Mumbai Tabla House', status: 'In Transit Fragile', qty: 28, unit: 'sets', cost: 420000, date: '2025-01-26' },
  { id: 'MIL-0019', product: 'Harmonium Delhi Classic', artisan: 'Tantra Music Kolkata', status: 'GI Musical Craft', qty: 50, unit: 'pcs', cost: 350000, date: '2025-01-27' },
  { id: 'MIL-0020', product: 'Veena Tanjore Concert', artisan: 'Chennai Carnatic Arts', status: 'ASNI Certified', qty: 9, unit: 'pcs', cost: 720000, date: '2025-01-28' },
]




export default function MusicalInstrumentsLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = [...musicRecords, ...genRecords(21), ...genRecords(41)]

  const filteredRecords = useMemo(() => {
    return allRecords.filter(r => {
      if (searchQuery && !r.id.toLowerCase().includes(searchQuery.toLowerCase()) && !r.product.toLowerCase().includes(searchQuery.toLowerCase())) return false
      return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string))
    })
  }, [searchQuery, activeFilters, allRecords])

  const filterGroups = [
    { key: 'product', label: 'Instrument', options: PRODUCTS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.product === p).length })) },
    { key: 'status', label: 'Status', options: STATUSES.map(s => ({ value: s, label: s, count: allRecords.filter(r => r.status === s).length })) },
  ]

  const trendData = PRODUCTS.slice(0, 6).map((p, i) => ({ name: p.split(' ').slice(0, 2).join(' '), shipments: 5 + i * 4, cost: 100000 + i * 80000 }))
  const artisanChart = ARTISANS.slice(0, 6).map((a, i) => ({ name: a.split(' ').slice(0, 2).join(' '), volume: 20 + i * 15, revenue: 3 + i * 2 }))
  const statusPie = STATUSES.map((s, i) => ({ name: s.split(' ').slice(0, 2).join(' '), value: 10 + i * 4 }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="mil-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Musical Instruments' }]} />
      <PageHeader title="Musical Instruments Logistics" description="Track Indian classical and folk instrument shipments from artisan workshops to global performers" />
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-purple-50">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <KpiTile icon="🎸" label="Total Shipments" value={String(allRecords.length)} />
            <KpiTile icon="🏭" label="Artisan Workshops" value={String(ARTISANS.length)} />
            <KpiTile icon="💰" label="Total Value" value={`₹${(allRecords.reduce((a, r) => a + r.cost, 0) / 100000).toFixed(1)}L`} />
            <KpiTile icon="📈" label="Avg Cost" value={`₹${Math.round(allRecords.reduce((a, r) => a + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>

          <Card className="mil-health-grid">
            <CardHeader><CardTitle>Operational Health</CardTitle></CardHeader>
            <CardContent>
              <div className="flex justify-around">
                <HealthRing value={84} label="Craftsmanship" />
                <HealthRing value={79} label="Tuning QC" />
                <HealthRing value={72} label="Fragile Pack" />
                <HealthRing value={91} label="GI Tags" />
                <HealthRing value={88} label="Export" />
                <HealthRing value={66} label="Artisan Pay" />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Sitar Stock" value="36 pcs" />
            <ValueTile label="Tabla Sets" value="83 sets" />
            <ValueTile label="In Fragile Transit" value="18 Lots" />
            <ValueTile label="Tuning Passed" value="42 Pcs" />
          </div>
        </TabsContent>

        <TabsContent value="shipments" className="space-y-4">
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={(key, value) => setActiveFilters(p => ({ ...p, [key]: p[key]?.includes(value) ? p[key].filter((v: string) => v !== value) : [...(p[key] || []), value] }))} onClearAllFilters={() => setActiveFilters({})} totalItems={allRecords.length} filteredCount={filteredRecords.length} onRefresh={() => {}} placeholder="Search by ID, instrument, artisan, or lot..." />

          <Card className="mil-table-card">
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-purple-50">
                    <th className="p-3 text-left">ID</th>
                    <th className="p-3 text-left">Instrument</th>
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
            <Card className="mil-insight"><CardHeader><CardTitle>Indian Classical Instrument Heritage</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">India has 200+ distinct classical and folk instruments recognized by Sangeet Natak Akademi. Instruments like Tanjore Veena, Miraj Sitar, and Tabla carry GI craft certification, preserving centuries-old gharana traditions from single-family artisan workshops across Delhi, Kolkata, and Chennai.</p></CardContent></Card>
            <Card className="mil-insight"><CardHeader><CardTitle>Fragile Instrument Logistics</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Musical instruments require specialized logistics with humidity-controlled cases, shock-absorbent padding, and vibration-free transport. Sitar gourds are susceptible to cracking below 40% humidity, while tabla skins need 50-60% humidity maintenance during rail and air cargo transit.</p></CardContent></Card>
            <Card className="mil-insight"><CardHeader><CardTitle>Global Indian Music Market</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Indian musical instrument exports exceed $85 million annually to 80+ countries. Ravi Shankar's global popularity created sustained international demand for sitars and tablas. Online marketplaces and direct-to-artist platforms have grown B2C export by 35% since 2022 with YouTube-driven demand.</p></CardContent></Card>
            <Card className="mil-insight"><CardHeader><CardTitle>ASNI Certification Standards</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">All India Sikh and Music Instruments Association certifies instrument quality with acoustic testing, timber grading, and craftsmanship benchmarks. ASNI certification enables access to government craft subsidies under NEGD and enables GST 18% rate benefits for musical instrument exporters.</p></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
