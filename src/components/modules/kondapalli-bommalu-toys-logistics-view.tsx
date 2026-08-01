import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#b91c1c', '#dc2626', '#ef4444', '#f87171', '#fca5a5', '#991b1b', '#7f1d1d', '#fef2f2']
const PRODUCTS = ['Dasavatara Doll Set', 'Ambari Elephant Pair', 'Pattabhi Rama Panel', 'Bullock Cart Model', 'Teapot Kitchen Set', 'Ten Avatars Panel', 'Village Scene Diorama', 'Bride Groom Doll Set']
const TOYMAKERS = ['Kondapalli Main Street', 'Bommireddypalli Art Colony', 'Ibrahimpatnam Craft Centre', 'Kondapalli Hilltop Workshop', 'Vijayawada Toy Market', 'Gollapudi Artisan Village', 'Penamaluru Toy Guild', 'Mangalagiri Craft Cluster']
const STATUSES = ['GI Kondapalli Toy Mark', 'IS 13371 Wood Craft Grade A', 'Bubble-Wrapped Box', 'Palletised Van Transit', 'Dry Storage 20-25C', 'Paint Lead QC']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="kbt-badge inline-block px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="kbt-status inline-block px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="kbt-costbar w-full bg-red-100 rounded h-2"><div className="bg-red-700 h-2 rounded" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ value, label, size = 64 }: { value: number; label: string; size?: number }) => {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (ri(0, 100, value) / 100) * circ
  return (
    <div className="kbt-health-ring flex flex-col items-center">
      <svg width={size} height={size}><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={4} /><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#b91c1c" strokeWidth={4} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`} /></svg>
      <span className="text-xs font-semibold" style={{ color: COLORS[0] }}>{value}%</span>
      <span className="text-[10px] text-gray-500">{label}</span>
    </div>
  )
}

const KpiTile = ({ label, value, icon }: { label: string; value: string; icon: string }) => (
  <Card className="kbt-kpi"><CardContent className="p-4"><div className="flex items-center gap-3"><span className="text-2xl">{icon}</span><div><p className="text-xs text-gray-500">{label}</p><p className="text-xl font-bold" style={{ color: COLORS[0] }}>{value}</p></div></div></CardContent></Card>
)

const ValueTile = ({ label, value }: { label: string; value: string }) => (
  <Card className="kbt-value"><CardContent className="p-4"><p className="text-xs text-gray-500">{label}</p><p className="text-lg font-semibold" style={{ color: COLORS[1] }}>{value}</p></CardContent></Card>
)

const genRecords = (startIdx: number) => Array.from({ length: 20 }, (_, i) => {
  const idx = startIdx + i
  const units = ['pcs', 'sets', 'pairs', 'boxes']
  return {
    id: `KBT-${String(idx).padStart(4, '0')}`, product: PRODUCTS[idx % 8], toymaker: TOYMAKERS[idx % 8],
    status: STATUSES[idx % 6], qty: ri(5, 80, 8 + idx * 3), unit: units[idx % 4],
    cost: ri(3000, 45000, 5000 + idx * 2000), date: `2025-07-${String(ri(1, 28, idx % 28 + 1)).padStart(2, '0')}`,
  }
})

const kondapalliRecords = [
  { id: 'KBT-0001', product: 'Dasavatara Doll Set', toymaker: 'Kondapalli Main Street', status: 'GI Kondapalli Toy Mark', qty: 12, unit: 'sets', cost: 18000, date: '2025-07-02' },
  { id: 'KBT-0002', product: 'Ambari Elephant Pair', toymaker: 'Bommireddypalli Art Colony', status: 'IS 13371 Wood Craft Grade A', qty: 25, unit: 'pairs', cost: 12000, date: '2025-07-04' },
  { id: 'KBT-0003', product: 'Pattabhi Rama Panel', toymaker: 'Ibrahimpatnam Craft Centre', status: 'Bubble-Wrapped Box', qty: 8, unit: 'pcs', cost: 35000, date: '2025-07-05' },
  { id: 'KBT-0004', product: 'Bullock Cart Model', toymaker: 'Kondapalli Hilltop Workshop', status: 'Palletised Van Transit', qty: 15, unit: 'pcs', cost: 22000, date: '2025-07-07' },
  { id: 'KBT-0005', product: 'Teapot Kitchen Set', toymaker: 'Vijayawada Toy Market', status: 'Dry Storage 20-25C', qty: 30, unit: 'sets', cost: 8000, date: '2025-07-08' },
  { id: 'KBT-0006', product: 'Ten Avatars Panel', toymaker: 'Gollapudi Artisan Village', status: 'Paint Lead QC', qty: 6, unit: 'pcs', cost: 42000, date: '2025-07-10' },
  { id: 'KBT-0007', product: 'Village Scene Diorama', toymaker: 'Penamaluru Toy Guild', status: 'GI Kondapalli Toy Mark', qty: 10, unit: 'boxes', cost: 28000, date: '2025-07-11' },
  { id: 'KBT-0008', product: 'Bride Groom Doll Set', toymaker: 'Mangalagiri Craft Cluster', status: 'IS 13371 Wood Craft Grade A', qty: 20, unit: 'sets', cost: 15000, date: '2025-07-13' },
  { id: 'KBT-0009', product: 'Dasavatara Doll Set', toymaker: 'Kondapalli Main Street', status: 'Bubble-Wrapped Box', qty: 14, unit: 'sets', cost: 21000, date: '2025-07-14' },
  { id: 'KBT-0010', product: 'Ambari Elephant Pair', toymaker: 'Bommireddypalli Art Colony', status: 'Palletised Van Transit', qty: 18, unit: 'pairs', cost: 9500, date: '2025-07-15' },
  { id: 'KBT-0011', product: 'Pattabhi Rama Panel', toymaker: 'Ibrahimpatnam Craft Centre', status: 'Dry Storage 20-25C', qty: 7, unit: 'pcs', cost: 38000, date: '2025-07-16' },
  { id: 'KBT-0012', product: 'Bullock Cart Model', toymaker: 'Kondapalli Hilltop Workshop', status: 'Paint Lead QC', qty: 22, unit: 'pcs', cost: 16500, date: '2025-07-17' },
  { id: 'KBT-0013', product: 'Teapot Kitchen Set', toymaker: 'Vijayawada Toy Market', status: 'GI Kondapalli Toy Mark', qty: 35, unit: 'sets', cost: 7500, date: '2025-07-18' },
  { id: 'KBT-0014', product: 'Ten Avatars Panel', toymaker: 'Gollapudi Artisan Village', status: 'IS 13371 Wood Craft Grade A', qty: 5, unit: 'pcs', cost: 44000, date: '2025-07-19' },
  { id: 'KBT-0015', product: 'Village Scene Diorama', toymaker: 'Penamaluru Toy Guild', status: 'Bubble-Wrapped Box', qty: 9, unit: 'boxes', cost: 30000, date: '2025-07-20' },
  { id: 'KBT-0016', product: 'Bride Groom Doll Set', toymaker: 'Mangalagiri Craft Cluster', status: 'Palletised Van Transit', qty: 16, unit: 'sets', cost: 13000, date: '2025-07-21' },
  { id: 'KBT-0017', product: 'Dasavatara Doll Set', toymaker: 'Kondapalli Main Street', status: 'Dry Storage 20-25C', qty: 11, unit: 'sets', cost: 25000, date: '2025-07-22' },
  { id: 'KBT-0018', product: 'Ambari Elephant Pair', toymaker: 'Bommireddypalli Art Colony', status: 'Paint Lead QC', qty: 28, unit: 'pairs', cost: 11000, date: '2025-07-23' },
  { id: 'KBT-0019', product: 'Pattabhi Rama Panel', toymaker: 'Ibrahimpatnam Craft Centre', status: 'GI Kondapalli Toy Mark', qty: 6, unit: 'pcs', cost: 40000, date: '2025-07-24' },
  { id: 'KBT-0020', product: 'Bullock Cart Model', toymaker: 'Kondapalli Hilltop Workshop', status: 'IS 13371 Wood Craft Grade A', qty: 19, unit: 'pcs', cost: 19500, date: '2025-07-25' },
]

export default function KondapalliBommaluToysLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = [...kondapalliRecords, ...genRecords(21), ...genRecords(41)]

  const filteredRecords = useMemo(() => {
    return allRecords.filter(r => {
      if (searchQuery && !r.id.toLowerCase().includes(searchQuery.toLowerCase()) && !r.product.toLowerCase().includes(searchQuery.toLowerCase())) return false
      return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string))
    })
  }, [searchQuery, activeFilters, allRecords])

  const filterGroups = [
    { key: 'product', label: 'Product', options: PRODUCTS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.product === p).length })) },
    { key: 'status', label: 'Status', options: STATUSES.map(s => ({ value: s, label: s, count: allRecords.filter(r => r.status === s).length })) },
  ]

  const trendData = PRODUCTS.slice(0, 6).map((p, i) => ({ name: p.split(' ').slice(0, 2).join(' '), shipments: 4 + i * 3, cost: 8000 + i * 6500 }))
  const toymakerChart = TOYMAKERS.slice(0, 6).map((t, i) => ({ name: t.split(' ').slice(0, 2).join(' '), volume: 15 + i * 8, revenue: 10 + i * 5 }))
  const statusPie = STATUSES.map((s, i) => ({ name: s.split(' ').slice(0, 2).join(' '), value: 5 + i * 4 }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="kbt-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Kondapalli Bommalu Toys' }]} />
      <PageHeader title="Kondapalli Bommalu Toys Logistics" description="Track Andhra Pradesh's iconic 400-year wooden toy heritage from Kondapalli village through tella poniki wood carving, vegetable-dye painting, GI-tagged quality certification, bubble-wrap packaging, and domestic-international distribution" />
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-red-50">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <KpiTile icon="🎭" label="Total Toys" value={String(allRecords.length)} />
            <KpiTile icon="🏭" label="Toymakers" value={String(TOYMAKERS.length)} />
            <KpiTile icon="💰" label="Total Value" value={`₹${(allRecords.reduce((a, r) => a + r.cost, 0) / 100000).toFixed(1)}L`} />
            <KpiTile icon="📈" label="Avg Toy" value={`₹${Math.round(allRecords.reduce((a, r) => a + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>

          <Card className="kbt-health-grid">
            <CardHeader><CardTitle>Quality Compliance</CardTitle></CardHeader>
            <CardContent>
              <div className="flex justify-around">
                <HealthRing value={95} label="GI Tag" />
                <HealthRing value={91} label="IS 13371" />
                <HealthRing value={87} label="Bubble" />
                <HealthRing value={80} label="Van" />
                <HealthRing value={93} label="Dry Store" />
                <HealthRing value={89} label="Paint QC" />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Artisan Families" value="300+" />
            <ValueTile label="Annual Production" value="5 Lakh pcs" />
            <ValueTile label="Export Markets" value="12 Countries" />
            <ValueTile label="Toy Varieties" value="200+" />
          </div>
        </TabsContent>

        <TabsContent value="shipments" className="space-y-4">
          <SearchFilterToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onClearSearch={() => setSearchQuery('')}
            activeFilters={activeFilters}
            filterGroups={filterGroups}
            onToggleFilter={(key, value) => setActiveFilters(p => ({ ...p, [key]: p[key]?.includes(value) ? p[key].filter((v: string) => v !== value) : [...(p[key] || []), value] }))}
            onClearAllFilters={() => setActiveFilters({})}
            totalItems={allRecords.length}
            filteredCount={filteredRecords.length}
            onRefresh={() => {}}
            placeholder="Search by ID, product, or toymaker..."
          />

          <Card className="kbt-table-card">
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-red-50">
                    <th className="p-3 text-left">ID</th>
                    <th className="p-3 text-left">Product</th>
                    <th className="p-3 text-left">Toymaker</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-right">Qty</th>
                    <th className="p-3 text-right">Cost</th>
                    <th className="p-3 text-left">Cost Bar</th>
                    <th className="p-3 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.slice(0, 15).map(r => (
                    <tr key={r.id} className="border-b hover:bg-red-50/50">
                      <td className="p-3 font-mono text-xs">{r.id}</td>
                      <td className="p-3"><ProductBadge name={r.product} /></td>
                      <td className="p-3 text-xs">{r.toymaker}</td>
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
              <CardHeader><CardTitle>Toymaker Volume</CardTitle></CardHeader>
              <CardContent>
                <BarChart width={500} height={250} data={toymakerChart}>
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
            <Card className="kbt-insight"><CardHeader><CardTitle>Kondapalli — Andhra Pradesh's 400-Year Wooden Toy Heritage</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Kondapalli village near Vijayawada in Andhra Pradesh has been India's premier wooden toy centre for over 400 years, tracing origins to the 16th century when artisans from Rajasthan migrated under Vijayanagara patronage. The toys are crafted from locally sourced tella poniki (white sanderwood, Wrightia tinctoria), a lightweight softwood ideal for detailed carving. The artform uses 35 traditional vegetable and mineral colours including red from alizarin root, yellow from myrobalan, green from indigo mixed with pomegranate rind, and black from iron filings with tamarind paste. GI-tagged Kondapalli Bommalu was registered in 2018. The craft supports 300 artisan families across Kondapalli and Bommireddypalli villages with annual production of 5 lakh toys valued at Rs 25 crore. Major festivals like Dasara, Sankranti, and Dussehra drive 60% of domestic demand, while international buyers from USA, Japan, and Germany account for 15% of exports.</p></CardContent></Card>
            <Card className="kbt-insight"><CardHeader><CardTitle>IS 13371 Wood Craft &amp; Toy Safety Standards</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">IS 13371 specifies wooden toy safety requirements including dimensional tolerances (plus or minus 1mm for parts under 50mm), surface finish roughness below Ra 3.2 micrometres, and sharp edge radius minimum 2mm to prevent child injury. Lead content in paints must not exceed 90 ppm (parts per million) as per IS 15481 toy safety standard, with cadmium below 75 ppm and mercury below 25 ppm. Wood moisture content must be 8-12% to prevent cracking or warping. Tella poniki wood density at 0.35-0.45 g/cm3 makes toys lightweight yet durable. Paint adhesion tested by cross-cut method (IS 104) requiring minimum 4B rating. Mechanical strength test requires toy to withstand 50N compressive force without permanent deformation. Colour fastness minimum Grade 4 on ISO 105-X12 rubbing test. Flammability must meet IS 9873 requiring self-extinguishing within 2 seconds of flame removal.</p></CardContent></Card>
            <Card className="kbt-insight"><CardHeader><CardTitle>Delicate Toy Packaging &amp; Transport Logistics</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Kondapalli toys are inherently fragile with protruding parts (elephant trunks, doll arms, bullock cart axles) requiring individual bubble-wrap encasement with 10mm bubble diameter and density 18 kg/m3. Each toy is placed in a die-cut foam insert within a 5-ply corrugated box. Maximum stack height is 4 boxes (3 kg each) to prevent crushing. From Kondapalli to Hyderabad (270 km) takes 5-6 hours via NH65 in covered transport maintaining 20-25 degrees Celsius. Storage humidity must stay below 50% to prevent tella poniki wood from swelling. Paint surfaces are susceptible to abrasion during transit — anti-abrasion tissue interleaving between layers reduces scratch damage by 85%. Breakage rate reduced from 12% to 2.5% under AP Handicrafts Development Corporation packaging programme since 2020, covering 180 artisan families across Krishna district.</p></CardContent></Card>
            <Card className="kbt-insight"><CardHeader><CardTitle>AI Toy Design &amp; Global Export Growth</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">AI-powered parametric design tools generate new Kondapalli toy patterns in 2 hours versus 3 days for hand-carved prototypes, allowing rapid diversification from traditional mythology to contemporary themes (space, robots, wildlife) while preserving the distinctive Kondapalli colour palette. Machine learning inspects painted surfaces at 94% accuracy detecting lead contamination, paint chips, and wood grain defects that human quality checkers miss 15% of the time. India's wooden toy export from Andhra Pradesh grew 140% from Rs 8 crore (2019) to Rs 19.2 crore (2025), targeting Rs 40 crore by 2028. Major buyers include Hamleys, FAO Schwarz, and specialty toy boutiques in Europe. Online marketplaces (Amazon, Etsy) account for 35% of new international orders. Blockchain provenance from raw wood sourcing to finished toy combats machine-made imitations estimated at Rs 6 crore annually.</p></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
