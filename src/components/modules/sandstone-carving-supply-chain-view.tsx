import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#92400e', '#a16207', '#ca8a04', '#eab308', '#facc15', '#78350f', '#451a03', '#fef9c3']
const PRODUCTS = ['Red Sandstone Jali Panel', 'Makrana Marble Buddha', 'Dholpur Sandstone Pillar', 'Odisha Lingam Sculpture', 'Sandstone Garden Fountain', 'Marble Inlay Table Top', 'Stone Carved Elephant Pair', 'Sandstone Temple Arch']
const ARTISANS = ['Jodhpur Stone Craft Cluster', 'Jaipur Marble Atelier', 'Udaipur Sandstone Works', 'Khajuraho Heritage Studio', 'Konark Stone Artisans', 'Agra Marble Craft', 'Bikaner Sandstone Yard', 'Puri Sculptors Guild']
const STATUSES = ['GI Stone Craft Mark', 'IS 11223 Stone Grade', 'Foam-Wrapped Crate', 'Flatbed Truck Transit', 'Open Yard Storage', 'Chisel Finish QC']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="scc-badge inline-block px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="scc-status inline-block px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="scc-costbar w-full bg-amber-100 rounded h-2"><div className="bg-amber-600 h-2 rounded" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ value, label, size = 64 }: { value: number; label: string; size?: number }) => {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (ri(0, 100, value) / 100) * circ
  return (
    <div className="scc-health-ring flex flex-col items-center">
      <svg width={size} height={size}><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={4} /><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#92400e" strokeWidth={4} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`} /></svg>
      <span className="text-xs font-semibold" style={{ color: COLORS[0] }}>{value}%</span>
      <span className="text-[10px] text-gray-500">{label}</span>
    </div>
  )
}

const KpiTile = ({ label, value, icon }: { label: string; value: string; icon: string }) => (
  <Card className="scc-kpi"><CardContent className="p-4"><div className="flex items-center gap-3"><span className="text-2xl">{icon}</span><div><p className="text-xs text-gray-500">{label}</p><p className="text-xl font-bold" style={{ color: COLORS[0] }}>{value}</p></div></div></CardContent></Card>
)

const ValueTile = ({ label, value }: { label: string; value: string }) => (
  <Card className="scc-value"><CardContent className="p-4"><p className="text-xs text-gray-500">{label}</p><p className="text-lg font-semibold" style={{ color: COLORS[1] }}>{value}</p></CardContent></Card>
)

const genRecords = (startIdx: number) => Array.from({ length: 20 }, (_, i) => {
  const idx = startIdx + i
  const units = ['pcs', 'pairs', 'sets', 'units']
  return {
    id: `SCC-${String(idx).padStart(4, '0')}`, product: PRODUCTS[idx % 8], artisan: ARTISANS[idx % 8],
    status: STATUSES[idx % 6], qty: ri(2, 200, 5 + idx * 3), unit: units[idx % 4],
    cost: ri(15000, 850000, 25000 + idx * 14000), date: `2025-01-${String(ri(1, 28, idx % 28 + 1)).padStart(2, '0')}`,
  }
})

const handRecords = [
  { id: 'SCC-0001', product: 'Red Sandstone Jali Panel', artisan: 'Jodhpur Stone Craft Cluster', status: 'GI Stone Craft Mark', qty: 48, unit: 'pcs', cost: 288000, date: '2025-01-03' },
  { id: 'SCC-0002', product: 'Makrana Marble Buddha', artisan: 'Jaipur Marble Atelier', status: 'Foam-Wrapped Crate', qty: 12, unit: 'pcs', cost: 720000, date: '2025-01-05' },
  { id: 'SCC-0003', product: 'Dholpur Sandstone Pillar', artisan: 'Udaipur Sandstone Works', status: 'Flatbed Truck Transit', qty: 24, unit: 'sets', cost: 360000, date: '2025-01-07' },
  { id: 'SCC-0004', product: 'Odisha Lingam Sculpture', artisan: 'Konark Stone Artisans', status: 'Chisel Finish QC', qty: 8, unit: 'pcs', cost: 480000, date: '2025-01-08' },
  { id: 'SCC-0005', product: 'Sandstone Garden Fountain', artisan: 'Jodhpur Stone Craft Cluster', status: 'Open Yard Storage', qty: 6, unit: 'sets', cost: 540000, date: '2025-01-10' },
  { id: 'SCC-0006', product: 'Marble Inlay Table Top', artisan: 'Agra Marble Craft', status: 'IS 11223 Stone Grade', qty: 30, unit: 'pcs', cost: 450000, date: '2025-01-11' },
  { id: 'SCC-0007', product: 'Stone Carved Elephant Pair', artisan: 'Bikaner Sandstone Yard', status: 'Foam-Wrapped Crate', qty: 18, unit: 'pairs', cost: 324000, date: '2025-01-13' },
  { id: 'SCC-0008', product: 'Sandstone Temple Arch', artisan: 'Khajuraho Heritage Studio', status: 'GI Stone Craft Mark', qty: 4, unit: 'sets', cost: 680000, date: '2025-01-14' },
  { id: 'SCC-0009', product: 'Red Sandstone Jali Panel', artisan: 'Jaipur Marble Atelier', status: 'Flatbed Truck Transit', qty: 60, unit: 'pcs', cost: 360000, date: '2025-01-16' },
  { id: 'SCC-0010', product: 'Makrana Marble Buddha', artisan: 'Puri Sculptors Guild', status: 'Chisel Finish QC', qty: 10, unit: 'pcs', cost: 600000, date: '2025-01-17' },
  { id: 'SCC-0011', product: 'Dholpur Sandstone Pillar', artisan: 'Jodhpur Stone Craft Cluster', status: 'Open Yard Storage', qty: 36, unit: 'sets', cost: 252000, date: '2025-01-18' },
  { id: 'SCC-0012', product: 'Odisha Lingam Sculpture', artisan: 'Konark Stone Artisans', status: 'IS 11223 Stone Grade', qty: 15, unit: 'pcs', cost: 375000, date: '2025-01-19' },
  { id: 'SCC-0013', product: 'Sandstone Garden Fountain', artisan: 'Udaipur Sandstone Works', status: 'Foam-Wrapped Crate', qty: 8, unit: 'sets', cost: 640000, date: '2025-01-21' },
  { id: 'SCC-0014', product: 'Marble Inlay Table Top', artisan: 'Agra Marble Craft', status: 'Flatbed Truck Transit', qty: 45, unit: 'pcs', cost: 270000, date: '2025-01-22' },
  { id: 'SCC-0015', product: 'Stone Carved Elephant Pair', artisan: 'Bikaner Sandstone Yard', status: 'GI Stone Craft Mark', qty: 22, unit: 'pairs', cost: 396000, date: '2025-01-23' },
  { id: 'SCC-0016', product: 'Sandstone Temple Arch', artisan: 'Khajuraho Heritage Studio', status: 'Chisel Finish QC', qty: 3, unit: 'sets', cost: 810000, date: '2025-01-24' },
  { id: 'SCC-0017', product: 'Red Sandstone Jali Panel', artisan: 'Puri Sculptors Guild', status: 'Open Yard Storage', qty: 72, unit: 'pcs', cost: 432000, date: '2025-01-25' },
  { id: 'SCC-0018', product: 'Makrana Marble Buddha', artisan: 'Jaipur Marble Atelier', status: 'IS 11223 Stone Grade', qty: 14, unit: 'pcs', cost: 840000, date: '2025-01-26' },
  { id: 'SCC-0019', product: 'Dholpur Sandstone Pillar', artisan: 'Udaipur Sandstone Works', status: 'Foam-Wrapped Crate', qty: 20, unit: 'sets', cost: 300000, date: '2025-01-27' },
  { id: 'SCC-0020', product: 'Odisha Lingam Sculpture', artisan: 'Konark Stone Artisans', status: 'Flatbed Truck Transit', qty: 11, unit: 'pcs', cost: 495000, date: '2025-01-28' },
]

export default function SandstoneCarvingSupplyChainView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = [...handRecords, ...genRecords(21), ...genRecords(41)]

  const filteredRecords = useMemo(() => {
    return allRecords.filter(r => {
      if (searchQuery && !r.id.toLowerCase().includes(searchQuery.toLowerCase()) && !r.product.toLowerCase().includes(searchQuery.toLowerCase()) && !r.artisan.toLowerCase().includes(searchQuery.toLowerCase())) return false
      return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string))
    })
  }, [searchQuery, activeFilters, allRecords])

  const filterGroups = [
    { key: 'product', label: 'Product', options: PRODUCTS.map(s => ({ value: s, label: s, count: allRecords.filter(r => r.product === s).length })) },
    { key: 'status', label: 'Status', options: STATUSES.map(s => ({ value: s, label: s, count: allRecords.filter(r => r.status === s).length })) },
  ]

  const trendData = PRODUCTS.slice(0, 6).map((p, i) => ({ name: p.split(' ').slice(0, 2).join(' '), shipments: 8 + i * 6, cost: 180000 + i * 48000 }))
  const artisanChart = ARTISANS.slice(0, 6).map((a, i) => ({ name: a.split(' ').slice(0, 2).join(' '), volume: 20 + i * 12, revenue: 5 + i * 2.5 }))
  const statusPie = STATUSES.map((s, i) => ({ name: s.split(' ').slice(0, 2).join(' '), value: 10 + i * 5 }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="scc-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Sandstone Carving' }]} />
      <PageHeader title="Sandstone Carving Supply Chain" description="Track red sandstone and marble carvings from Rajasthan's quarries and Odisha's workshops through sculpting, finishing, and shipping" />
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
            <KpiTile icon="🔨" label="Artisan Clusters" value={String(ARTISANS.length)} />
            <KpiTile icon="💰" label="Total Value" value={`₹${(allRecords.reduce((a, r) => a + r.cost, 0) / 100000).toFixed(1)}L`} />
            <KpiTile icon="📊" label="Avg Cost" value={`₹${Math.round(allRecords.reduce((a, r) => a + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>

          <Card className="scc-health-grid">
            <CardHeader><CardTitle>Operational Health</CardTitle></CardHeader>
            <CardContent>
              <div className="flex justify-around">
                <HealthRing value={81} label="Quarrying" />
                <HealthRing value={88} label="Sculpting" />
                <HealthRing value={74} label="Finishing" />
                <HealthRing value={92} label="Quality" />
                <HealthRing value={70} label="Packing" />
                <HealthRing value={85} label="Export" />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Jali Panels Shipped" value="108 pcs" />
            <ValueTile label="Buddha Sculptures" value="36 pcs" />
            <ValueTile label="GI Certified" value="18 Lots" />
            <ValueTile label="Export Ready" value="42 Units" />
          </div>
        </TabsContent>

        <TabsContent value="shipments" className="space-y-4">
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={(key, value) => setActiveFilters(p => ({ ...p, [key]: p[key]?.includes(value) ? p[key].filter((v: string) => v !== value) : [...(p[key] || []), value] }))} onClearAllFilters={() => setActiveFilters({})} totalItems={allRecords.length} filteredCount={filteredRecords.length} onRefresh={() => {}} placeholder="Search by ID, product, artisan, or status..." />

          <Card className="scc-table-card">
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-amber-50">
                    <th className="p-3 text-left">ID</th>
                    <th className="p-3 text-left">Product</th>
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
                    <tr key={r.id} className="border-b hover:bg-amber-50/50">
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
                  <Line type="monotone" dataKey="cost" stroke={COLORS[3]} strokeWidth={2} />
                </LineChart>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Artisan Cluster Output</CardTitle></CardHeader>
              <CardContent>
                <BarChart width={500} height={250} data={artisanChart}>
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
            <Card className="scc-insight">
              <CardHeader><CardTitle>Rajasthan & Odisha — India's Stone Carving Heritage</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-gray-600">Rajasthan's Jodhpur, Jaipur, and Udaipur have been stone carving centres since the 12th century, producing red sandstone (Dholpur pink), Jodhpur red, and Jaisalmer yellow sandstone for palaces, temples, and heritage buildings. Odisha's Puri and Konark artisans produce religious stone sculptures for temples worldwide. India's stone carving industry employs 2.5 lakh artisans across Rajasthan, Gujarat, Madhya Pradesh, and Odisha, with annual production of 15 lakh tonnes of carved stone products valued at Rs 8,500 crore. GI-tagged Odisha Stone Carving and Rajasthan Stone Craft protect geographic authenticity.</p></CardContent>
            </Card>
            <Card className="scc-insight">
              <CardHeader><CardTitle>IS 11223 Stone Grading & Finishing Standards</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-gray-600">IS 11223 classifies natural building stone by compressive strength (minimum 40 MPa for structural, 20 MPa for decorative), water absorption (below 3% for exterior), and porosity. Sandstone must pass freeze-thaw cycles for export to cold climates. Marble grading uses A/B/C based on vein density, colour consistency, and surface hardness (Mohs 3-5). Chisel finish grades include rough-hewn, fine-chisel, polished (mirror finish below 0.5 micron Ra), and flamed (textured for anti-slip). Acid resistance testing uses 10% HCl for 24 hours to check calcium carbonate reactivity.</p></CardContent>
            </Card>
            <Card className="scc-insight">
              <CardHeader><CardTitle>Stone Logistics & Heavy Transport Requirements</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-gray-600">Sandstone blocks weigh 2-8 tonnes per cubic metre, requiring flatbed trucks with 20-40 tonne capacity, crane loading at quarries, and reinforced wooden crating for finished carvings. Transport from Jodhpur quarries to Mumbai port (950 km) takes 2-3 days via NH48. Foam-wrapped and bubble-lined crates prevent chipping during transit. Open yard storage at 25-35°C with tarpaulin cover prevents thermal cracking. Importers in EU require ISPM-15 fumigation certificates. India exports carved stone to 65 countries with major markets in UAE, UK, USA, and Singapore.</p></CardContent>
            </Card>
            <Card className="scc-insight">
              <CardHeader><CardTitle>AI Stone Quality Scanning & Heritage Restoration</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-gray-600">AI-powered 3D laser scanning maps stone surfaces at 0.1mm resolution, detecting micro-cracks and porosity invisible to human inspection. Machine learning predicts stone durability under weathering conditions with 85% accuracy over 50-year simulations. India's heritage building restoration market is Rs 2,800 crore (2025) growing 12% annually, driven by ASI conservation projects and UNESCO World Heritage sites. 3D-printed templates enable precise reproduction of deteriorated carvings for 42 ASI-maintained monuments. Blockchain provenance tracking ensures ethical sourcing from licensed quarries.</p></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
