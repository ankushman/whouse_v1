import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#3f2305','#5c3a1e','#78522d','#936a3c','#b08d57','#2c1703','#1a0e02','#f5f0e6']
const PRODUCTS = ['Walnut Root Coffee Table','Hand-Carved Screen Divider','Walnut Wood Jewel Box','Khatamband Panel Set','Carved Walnut Wall Mirror','Walnut Dining Chair Set','Papier-Mache Inlay Cabinet','Walnut Wood Bookshelf']
const CRAFTSMEN = ['Srinagar Walnut Craft Guild','Bandipora Sawmill Collective','Anantnag Carving Workshop','Budgam Wood Artisans','Baramulla Furniture Unit','Pulwama Walnut Studio','Shopian Handicraft Centre','Kupwara Wood Workers']
const STATUSES = ['GI Kashmir Walnut Craft','IS 7103 Wood Grade A','Wood Wool Padding','Enclosed Box Truck','Dehumid Warehouse 25C','Wood Moisture QC']

function ri(min: number, max: number, value: number) { return Math.max(min, Math.min(max, value)) }

const ProductBadge = ({ name }: { name: string }) => (
  <span className="kww-badge inline-block px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="kww-status inline-block px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="kww-costbar w-full bg-amber-100 rounded h-2"><div className="bg-amber-700 h-2 rounded" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ value, label, size = 64 }: { value: number; label: string; size?: number }) => {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (ri(0, 100, value) / 100) * circ
  return (
    <div className="kww-health-ring flex flex-col items-center">
      <svg width={size} height={size}><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={4} /><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#3f2305" strokeWidth={4} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`} /></svg>
      <span className="text-xs font-semibold" style={{ color: COLORS[0] }}>{value}%</span>
      <span className="text-[10px] text-gray-500">{label}</span>
    </div>
  )
}

const KpiTile = ({ label, value, icon }: { label: string; value: string; icon: string }) => (
  <Card className="kww-kpi"><CardContent className="p-4"><div className="flex items-center gap-3"><span className="text-2xl">{icon}</span><div><p className="text-xs text-gray-500">{label}</p><p className="text-xl font-bold" style={{ color: COLORS[0] }}>{value}</p></div></div></CardContent></Card>
)

const ValueTile = ({ label, value }: { label: string; value: string }) => (
  <Card className="kww-value"><CardContent className="p-4"><p className="text-xs text-gray-500">{label}</p><p className="text-lg font-semibold" style={{ color: COLORS[1] }}>{value}</p></CardContent></Card>
)

const genRecords = (startIdx: number) => Array.from({ length: 20 }, (_, i) => {
  const idx = startIdx + i
  const locations = ['Srinagar','Bandipora','Anantnag','Budgam','Baramulla','Pulwama','Shopian','Kupwara']
  return {
    id: `KWW-${String(idx).padStart(4, '0')}`, product: PRODUCTS[idx % 8], craftsman: CRAFTSMEN[idx % 8],
    status: STATUSES[idx % 6], moisture: ri(6, 18, 8 + (idx * 3) % 10), health: ri(60, 99, 70 + (idx * 7) % 30),
    cost: ri(800, 25000, 3000 + idx * 1200), date: `2025-${String(ri(1, 12, (idx % 12) + 1)).padStart(2, '0')}-${String(ri(1, 28, (idx % 28) + 1)).padStart(2, '0')}`, location: locations[idx % 8],
  }
})

const handRecords = [
  { id: 'KWW-0001', product: 'Walnut Root Coffee Table', craftsman: 'Srinagar Walnut Craft Guild', status: 'GI Kashmir Walnut Craft', cost: 12500, health: 92, date: '2025-01-15', location: 'Srinagar', moisture: 7.2 },
  { id: 'KWW-0002', product: 'Hand-Carved Screen Divider', craftsman: 'Bandipora Sawmill Collective', status: 'IS 7103 Wood Grade A', cost: 8400, health: 88, date: '2025-01-22', location: 'Bandipora', moisture: 8.1 },
  { id: 'KWW-0003', product: 'Walnut Wood Jewel Box', craftsman: 'Anantnag Carving Workshop', status: 'Wood Wool Padding', cost: 3200, health: 95, date: '2025-02-03', location: 'Anantnag', moisture: 6.8 },
  { id: 'KWW-0004', product: 'Khatamband Panel Set', craftsman: 'Budgam Wood Artisans', status: 'Enclosed Box Truck', cost: 18000, health: 78, date: '2025-02-14', location: 'Budgam', moisture: 9.4 },
  { id: 'KWW-0005', product: 'Carved Walnut Wall Mirror', craftsman: 'Baramulla Furniture Unit', status: 'Dehumid Warehouse 25C', cost: 6700, health: 91, date: '2025-02-28', location: 'Baramulla', moisture: 7.5 },
  { id: 'KWW-0006', product: 'Walnut Dining Chair Set', craftsman: 'Pulwama Walnut Studio', status: 'Wood Moisture QC', cost: 22000, health: 85, date: '2025-03-10', location: 'Pulwama', moisture: 8.9 },
  { id: 'KWW-0007', product: 'Papier-Mache Inlay Cabinet', craftsman: 'Shopian Handicraft Centre', status: 'GI Kashmir Walnut Craft', cost: 15500, health: 90, date: '2025-03-18', location: 'Shopian', moisture: 7.1 },
  { id: 'KWW-0008', product: 'Walnut Wood Bookshelf', craftsman: 'Kupwara Wood Workers', status: 'IS 7103 Wood Grade A', cost: 9800, health: 87, date: '2025-03-25', location: 'Kupwara', moisture: 8.3 },
  { id: 'KWW-0009', product: 'Walnut Root Coffee Table', craftsman: 'Budgam Wood Artisans', status: 'Wood Wool Padding', cost: 14200, health: 93, date: '2025-04-02', location: 'Budgam', moisture: 6.5 },
  { id: 'KWW-0010', product: 'Walnut Wood Jewel Box', craftsman: 'Pulwama Walnut Studio', status: 'Enclosed Box Truck', cost: 2900, health: 96, date: '2025-04-11', location: 'Pulwama', moisture: 7.0 },
  { id: 'KWW-0011', product: 'Carved Walnut Wall Mirror', craftsman: 'Bandipora Sawmill Collective', status: 'Dehumid Warehouse 25C', cost: 7300, health: 82, date: '2025-04-20', location: 'Bandipora', moisture: 9.1 },
  { id: 'KWW-0012', product: 'Papier-Mache Inlay Cabinet', craftsman: 'Kupwara Wood Workers', status: 'Wood Moisture QC', cost: 16800, health: 89, date: '2025-05-01', location: 'Kupwara', moisture: 7.8 },
  { id: 'KWW-0013', product: 'Hand-Carved Screen Divider', craftsman: 'Baramulla Furniture Unit', status: 'GI Kashmir Walnut Craft', cost: 11200, health: 94, date: '2025-05-12', location: 'Baramulla', moisture: 6.9 },
  { id: 'KWW-0014', product: 'Khatamband Panel Set', craftsman: 'Shopian Handicraft Centre', status: 'IS 7103 Wood Grade A', cost: 19500, health: 86, date: '2025-05-20', location: 'Shopian', moisture: 8.6 },
  { id: 'KWW-0015', product: 'Walnut Dining Chair Set', craftsman: 'Anantnag Carving Workshop', status: 'Wood Wool Padding', cost: 24800, health: 80, date: '2025-05-30', location: 'Anantnag', moisture: 9.7 },
  { id: 'KWW-0016', product: 'Walnut Wood Bookshelf', craftsman: 'Srinagar Walnut Craft Guild', status: 'Enclosed Box Truck', cost: 8900, health: 92, date: '2025-06-08', location: 'Srinagar', moisture: 7.3 },
  { id: 'KWW-0017', product: 'Walnut Root Coffee Table', craftsman: 'Shopian Handicraft Centre', status: 'Dehumid Warehouse 25C', cost: 13100, health: 97, date: '2025-06-15', location: 'Shopian', moisture: 6.4 },
  { id: 'KWW-0018', product: 'Khatamband Panel Set', craftsman: 'Anantnag Carving Workshop', status: 'Wood Moisture QC', cost: 20500, health: 84, date: '2025-06-22', location: 'Anantnag', moisture: 8.8 },
  { id: 'KWW-0019', product: 'Walnut Dining Chair Set', craftsman: 'Baramulla Furniture Unit', status: 'GI Kashmir Walnut Craft', cost: 23400, health: 91, date: '2025-07-01', location: 'Baramulla', moisture: 7.6 },
  { id: 'KWW-0020', product: 'Hand-Carved Screen Divider', craftsman: 'Srinagar Walnut Craft Guild', status: 'IS 7103 Wood Grade A', cost: 10800, health: 88, date: '2025-07-10', location: 'Srinagar', moisture: 8.0 },
]

export default function KashmirWalnutWoodCarvingSupplyChainView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = [...handRecords, ...genRecords(21), ...genRecords(41)]

  const filteredRecords = useMemo(() => {
    return allRecords.filter(r => {
      if (searchQuery && !r.id.toLowerCase().includes(searchQuery.toLowerCase()) && !r.product.toLowerCase().includes(searchQuery.toLowerCase()) && !r.craftsman.toLowerCase().includes(searchQuery.toLowerCase())) return false
      return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string))
    })
  }, [searchQuery, activeFilters, allRecords])

  const filterGroups = [
    { key: 'product', label: 'Product', options: PRODUCTS.map(s => ({ value: s, label: s, count: allRecords.filter(r => r.product === s).length })) },
    { key: 'status', label: 'Status', options: STATUSES.map(s => ({ value: s, label: s, count: allRecords.filter(r => r.status === s).length })) },
  ]

  const trendData = PRODUCTS.slice(0, 6).map((p, i) => ({ name: p.split(' ').slice(0, 2).join(' '), shipments: 8 + i * 6, cost: 18000 + i * 4800 }))
  const craftsmanChart = CRAFTSMEN.slice(0, 6).map((c, i) => ({ name: c.split(' ').slice(0, 2).join(' '), volume: 20 + i * 12, revenue: 5 + i * 2.5 }))
  const statusPie = STATUSES.map((s, i) => ({ name: s.split(' ').slice(0, 2).join(' '), value: 10 + i * 5 }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="kww-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Kashmir Walnut' }]} />
      <PageHeader title="Kashmir Walnut Wood Carving Supply Chain" description="Track walnut carvings from Kashmir forests to global art markets — GI tagged, IS 7103 graded" />
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-amber-50">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <KpiTile icon="🪵" label="Total Shipments" value={String(allRecords.length)} />
            <KpiTile icon="🔨" label="Craftsman Clusters" value={String(CRAFTSMEN.length)} />
            <KpiTile icon="💰" label="Total Value" value={`₹${(allRecords.reduce((a, r) => a + r.cost, 0) / 100000).toFixed(1)}L`} />
            <KpiTile icon="💧" label="Avg Moisture" value={`${(allRecords.reduce((a, r) => a + r.moisture, 0) / allRecords.length).toFixed(1)}%`} />
          </div>

          <Card className="kww-health-grid">
            <CardHeader><CardTitle>Operational Health</CardTitle></CardHeader>
            <CardContent>
              <div className="flex justify-around">
                <HealthRing value={91} label="Wood Quality" />
                <HealthRing value={87} label="Moisture Ctrl" />
                <HealthRing value={94} label="Carving Prec." />
                <HealthRing value={82} label="Packaging" />
                <HealthRing value={78} label="Transit Safe" />
                <HealthRing value={96} label="GI Comply" />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Export Ready" value={`${allRecords.filter(r => r.health > 90).length} Units`} />
            <ValueTile label="GI Certified" value={`${allRecords.filter(r => r.status === STATUSES[0]).length} Lots`} />
            <ValueTile label="Grade A Wood" value={`${allRecords.filter(r => r.status === STATUSES[1]).length} Items`} />
            <ValueTile label="In Transit" value={`${allRecords.filter(r => r.status === STATUSES[3]).length} Units`} />
          </div>
        </TabsContent>

        <TabsContent value="shipments" className="space-y-4">
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={(key, value) => setActiveFilters(p => ({ ...p, [key]: p[key]?.includes(value) ? p[key].filter((v: string) => v !== value) : [...(p[key] || []), value] }))} onClearAllFilters={() => setActiveFilters({})} totalItems={allRecords.length} filteredCount={filteredRecords.length} onRefresh={() => {}} placeholder="Search by ID, product, craftsman, or status..." />

          <Card className="kww-table-card">
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-amber-50">
                    <th className="p-3 text-left">ID</th>
                    <th className="p-3 text-left">Product</th>
                    <th className="p-3 text-left">Craftsman</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-right">Cost</th>
                    <th className="p-3 text-right">Health</th>
                    <th className="p-3 text-left">Cost Bar</th>
                    <th className="p-3 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.slice(0, 15).map(r => (
                    <tr key={r.id} className="border-b hover:bg-amber-50/50">
                      <td className="p-3 font-mono text-xs">{r.id}</td>
                      <td className="p-3"><ProductBadge name={r.product} /></td>
                      <td className="p-3 text-xs">{r.craftsman}</td>
                      <td className="p-3"><StatusBadge status={r.status} /></td>
                      <td className="p-3 text-right">₹{r.cost.toLocaleString()}</td>
                      <td className="p-3 text-right">{r.health}%</td>
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
                  <Line type="monotone" dataKey="cost" stroke={COLORS[4]} strokeWidth={2} />
                </LineChart>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Craftsman Cluster Output</CardTitle></CardHeader>
              <CardContent>
                <BarChart width={500} height={250} data={craftsmanChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={10} />
                  <YAxis fontSize={11} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="volume" fill={COLORS[0]} />
                  <Bar dataKey="revenue" fill={COLORS[4]} />
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
            <Card className="kww-insight">
              <CardHeader><CardTitle>Kashmir Walnut — The Crown Jewel of Indian Woodcraft</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-gray-600">Kashmir's walnut wood carving tradition spans 600+ years, originating with Persian artisan families invited by Sultan Zain-ul-Abidin in the 15th century. The Juglans regia tree grows at 5,000-8,000 ft in Kashmir's temperate forests, producing dark, richly grained wood ideal for intricate carving. Each mature tree (40-80 years old) yields 200-500 kg of usable timber. India's walnut carving industry, 90% concentrated in Kashmir, employs 40,000 artisan families with annual production of Rs 450 crore. GI-tagged Kashmir Walnut Wood Carving registered 2018. Major export markets include USA, UK, Germany, and UAE with retail prices ranging from $200 for small boxes to $15,000 for full room divider sets.</p></CardContent>
            </Card>
            <Card className="kww-insight">
              <CardHeader><CardTitle>IS 7103 Walnut Wood Grading & Seasoning Standards</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-gray-600">IS 7103 classifies walnut wood by moisture content (below 12% for finished products, below 20% for rough timber), density (550-650 kg/m3 for premium walnut), and defect limits (maximum 2 knots per square metre for Grade A). Air seasoning takes 6-9 months under controlled conditions at 25°C, 50-60% humidity. Kiln seasoning at 50-60°C for 2-3 weeks accelerates drying while preventing warping. Wood moisture meter calibrated to 6-8% final moisture ensures dimensional stability. Khatamband (geometric interlocking woodwork) requires precise dimensional tolerance of 0.5mm per joint. IS 14658 covers wood finishing with linseed oil and shellac for premium furniture applications.</p></CardContent>
            </Card>
            <Card className="kww-insight">
              <CardHeader><CardTitle>Fragile Wood Packaging & Transport Challenges</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-gray-600">Carved walnut furniture is extremely fragile, requiring individual wood wool or corrugated cardboard wrapping, foam corner protection, and multi-layer packaging in 5-ply corrugated cartons. Maximum stack height is 3 cartons (30 kg each). From Srinagar to Delhi (870 km), transport takes 18-24 hours via NH44 through Banihal tunnel and Jammu highway, requiring enclosed trucks to prevent moisture exposure. Storage humidity must stay at 40-55% to prevent wood swelling or cracking. During winter months (November-March), Jammu-Srinagar highway closure for 2-5 days per snowfall event disrupts logistics, requiring 2-3 week advance inventory dispatch. Only 15% of Kashmir's walnut wood products reach export-quality packaging standards.</p></CardContent>
            </Card>
            <Card className="kww-insight">
              <CardHeader><CardTitle>AI Wood Grain Analysis & Market Expansion</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-gray-600">AI-powered wood grain analysis classifies walnut timber quality by colour, figure, and defect density using computer vision at 98% accuracy, replacing manual grading that achieves only 65% consistency. CNC routers assist with rough shaping while hand finishing preserves artisan character. India's walnut furniture export grew 140% from Rs 120 crore (2019) to Rs 288 crore (2025), targeting Rs 500 crore by 2028. E-commerce platforms (Amazon, Wayfair) account for 28% of new export orders with average order value of $850 for furniture sets. Blockchain provenance tracking from forest harvest to finished product combats illegal timber trade estimated at Rs 150 crore annually in the Kashmir valley.</p></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
