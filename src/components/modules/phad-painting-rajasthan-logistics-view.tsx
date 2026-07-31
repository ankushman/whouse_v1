import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#7c3aed', '#8b5cf6', '#a78bfa', '#c4b5fd', '#ede9fe', '#6d28d9', '#5b21b6', '#f5f3ff']
const PRODUCTS = ['Devnarayan Phad Scroll', 'Pabuji Rath Phad', 'Bhilwara Epic Scroll', 'Rajasthani Folk Hero Panel', 'Temple Procession Phad', 'Ancestral Legend Phad', 'Wedding Ceremony Phad', 'Battle Scene Scroll']
const PAINTERS = ['Bhilwara Phad Painter Guild', 'Shahpura Chitrakar Samiti', 'Bijolia Traditional Painters', 'Kumbhalgarh Art Colony', 'Devnarayan Temple Artists', 'Chittorgarh Folk Art Guild', 'Rajsamand Phad Studio', 'Nathdwara Scroll Centre']
const STATUSES = ['GI Phad Painting Mark', 'IS 16796 Folk Scroll Grade A', 'Canvas Roll Cloth Wrap', 'Flatbed Truck Transit', 'Dust-Free Storage 20-28C', 'Natural Dye QC']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="ppr-badge inline-block px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="ppr-status inline-block px-2 py-0.5 rounded text-xs font-medium bg-violet-100 text-violet-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="ppr-costbar w-full bg-violet-100 rounded h-2"><div className="bg-violet-700 h-2 rounded" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ value, label, size = 64 }: { value: number; label: string; size?: number }) => {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (ri(0, 100, value) / 100) * circ
  return (
    <div className="ppr-health-ring flex flex-col items-center">
      <svg width={size} height={size}><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={4} /><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#7c3aed" strokeWidth={4} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`} /></svg>
      <span className="text-xs font-semibold" style={{ color: COLORS[0] }}>{value}%</span>
      <span className="text-[10px] text-gray-500">{label}</span>
    </div>
  )
}

const KpiTile = ({ label, value, icon }: { label: string; value: string; icon: string }) => (
  <Card className="ppr-kpi"><CardContent className="p-4"><div className="flex items-center gap-3"><span className="text-2xl">{icon}</span><div><p className="text-xs text-gray-500">{label}</p><p className="text-xl font-bold" style={{ color: COLORS[0] }}>{value}</p></div></div></CardContent></Card>
)

const ValueTile = ({ label, value }: { label: string; value: string }) => (
  <Card className="ppr-value"><CardContent className="p-4"><p className="text-xs text-gray-500">{label}</p><p className="text-lg font-semibold" style={{ color: COLORS[1] }}>{value}</p></CardContent></Card>
)

const genRecords = (startIdx: number) => Array.from({ length: 20 }, (_, i) => {
  const idx = startIdx + i
  const units = ['scrolls', 'panels', 'sets', 'rolls']
  return {
    id: `PPR-${String(idx).padStart(4, '0')}`, scroll: PRODUCTS[idx % 8], painter: PAINTERS[idx % 8],
    status: STATUSES[idx % 6], qty: ri(3, 50, 5 + idx * 2), unit: units[idx % 4],
    cost: ri(15000, 280000, 18000 + idx * 14000), date: `2024-${String(ri(1, 12, idx % 12 + 1)).padStart(2, '0')}-${String(ri(1, 28, idx % 28 + 1)).padStart(2, '0')}`,
  }
})

const phadRecords = [
  { id: 'PPR-0001', scroll: 'Devnarayan Phad Scroll', painter: 'Bhilwara Phad Painter Guild', status: 'GI Phad Painting Mark', qty: 5, unit: 'scrolls', cost: 185000, date: '2024-01-15' },
  { id: 'PPR-0002', scroll: 'Pabuji Rath Phad', painter: 'Shahpura Chitrakar Samiti', status: 'IS 16796 Folk Scroll Grade A', qty: 12, unit: 'scrolls', cost: 142000, date: '2024-02-03' },
  { id: 'PPR-0003', scroll: 'Bhilwara Epic Scroll', painter: 'Bijolia Traditional Painters', status: 'Canvas Roll Cloth Wrap', qty: 8, unit: 'scrolls', cost: 96000, date: '2024-02-18' },
  { id: 'PPR-0004', scroll: 'Rajasthani Folk Hero Panel', painter: 'Kumbhalgarh Art Colony', status: 'Flatbed Truck Transit', qty: 20, unit: 'panels', cost: 228000, date: '2024-03-05' },
  { id: 'PPR-0005', scroll: 'Temple Procession Phad', painter: 'Devnarayan Temple Artists', status: 'Dust-Free Storage 20-28C', qty: 3, unit: 'scrolls', cost: 210000, date: '2024-03-12' },
  { id: 'PPR-0006', scroll: 'Ancestral Legend Phad', painter: 'Chittorgarh Folk Art Guild', status: 'Natural Dye QC', qty: 15, unit: 'scrolls', cost: 78000, date: '2024-03-20' },
  { id: 'PPR-0007', scroll: 'Wedding Ceremony Phad', painter: 'Rajsamand Phad Studio', status: 'GI Phad Painting Mark', qty: 10, unit: 'sets', cost: 156000, date: '2024-04-02' },
  { id: 'PPR-0008', scroll: 'Battle Scene Scroll', painter: 'Nathdwara Scroll Centre', status: 'IS 16796 Folk Scroll Grade A', qty: 4, unit: 'scrolls', cost: 268000, date: '2024-04-10' },
  { id: 'PPR-0009', scroll: 'Devnarayan Phad Scroll', painter: 'Shahpura Chitrakar Samiti', status: 'Canvas Roll Cloth Wrap', qty: 25, unit: 'scrolls', cost: 35000, date: '2024-04-18' },
  { id: 'PPR-0010', scroll: 'Pabuji Rath Phad', painter: 'Bhilwara Phad Painter Guild', status: 'Flatbed Truck Transit', qty: 18, unit: 'scrolls', cost: 195000, date: '2024-05-01' },
  { id: 'PPR-0011', scroll: 'Bhilwara Epic Scroll', painter: 'Kumbhalgarh Art Colony', status: 'Dust-Free Storage 20-28C', qty: 7, unit: 'sets', cost: 58000, date: '2024-05-10' },
  { id: 'PPR-0012', scroll: 'Rajasthani Folk Hero Panel', painter: 'Chittorgarh Folk Art Guild', status: 'Natural Dye QC', qty: 30, unit: 'panels', cost: 242000, date: '2024-05-18' },
  { id: 'PPR-0013', scroll: 'Temple Procession Phad', painter: 'Devnarayan Temple Artists', status: 'GI Phad Painting Mark', qty: 6, unit: 'scrolls', cost: 163000, date: '2024-05-25' },
  { id: 'PPR-0014', scroll: 'Ancestral Legend Phad', painter: 'Rajsamand Phad Studio', status: 'IS 16796 Folk Scroll Grade A', qty: 22, unit: 'scrolls', cost: 92000, date: '2024-06-03' },
  { id: 'PPR-0015', scroll: 'Wedding Ceremony Phad', painter: 'Bijolia Traditional Painters', status: 'Canvas Roll Cloth Wrap', qty: 9, unit: 'sets', cost: 118000, date: '2024-06-10' },
  { id: 'PPR-0016', scroll: 'Battle Scene Scroll', painter: 'Nathdwara Scroll Centre', status: 'Flatbed Truck Transit', qty: 4, unit: 'scrolls', cost: 245000, date: '2024-06-18' },
  { id: 'PPR-0017', scroll: 'Devnarayan Phad Scroll', painter: 'Chittorgarh Folk Art Guild', status: 'Dust-Free Storage 20-28C', qty: 16, unit: 'scrolls', cost: 48000, date: '2024-06-25' },
  { id: 'PPR-0018', scroll: 'Pabuji Rath Phad', painter: 'Rajsamand Phad Studio', status: 'Natural Dye QC', qty: 28, unit: 'rolls', cost: 128000, date: '2024-07-02' },
  { id: 'PPR-0019', scroll: 'Bhilwara Epic Scroll', painter: 'Devnarayan Temple Artists', status: 'GI Phad Painting Mark', qty: 11, unit: 'scrolls', cost: 68000, date: '2024-07-10' },
  { id: 'PPR-0020', scroll: 'Rajasthani Folk Hero Panel', painter: 'Kumbhalgarh Art Colony', status: 'IS 16796 Folk Scroll Grade A', qty: 35, unit: 'panels', cost: 256000, date: '2024-07-18' },
]

export default function PhadPaintingRajasthanLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = [...phadRecords, ...genRecords(21), ...genRecords(41)]

  const filteredRecords = useMemo(() => {
    return allRecords.filter(r => {
      if (searchQuery && !r.id.toLowerCase().includes(searchQuery.toLowerCase()) && !r.scroll.toLowerCase().includes(searchQuery.toLowerCase())) return false
      return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string))
    })
  }, [searchQuery, activeFilters, allRecords])

  const filterGroups = [
    { key: 'scroll', label: 'Scroll', options: PRODUCTS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.scroll === p).length })) },
    { key: 'painter', label: 'Painter', options: PAINTERS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.painter === p).length })) },
  ]

  const trendData = PRODUCTS.slice(0, 6).map((p, i) => ({ name: p.split(' ').slice(0, 2).join(' '), shipments: 4 + i * 3, cost: 18000 + i * 65000 }))
  const painterChart = PAINTERS.slice(0, 6).map((a, i) => ({ name: a.split(' ').slice(0, 2).join(' '), volume: 15 + i * 8, revenue: 10 + i * 5 }))
  const statusPie = STATUSES.map((s, i) => ({ name: s.split(' ').slice(0, 2).join(' '), value: 5 + i * 4 }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="ppr-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Modules' }, { label: 'Phad Painting Rajasthan' }]} />
      <PageHeader title="Phad Painting Rajasthan Logistics" description="Bhilwara Phad scroll painting tradition tracking — Bhopa bard performances, Devnarayan and Pabuji epic narrative cloth scrolls, GI certification logistics, canvas roll packaging, dust-free transit for Rajasthani folk art export" />
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-violet-50">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <KpiTile icon="🖼️" label="Total Shipments" value={String(allRecords.length)} />
            <KpiTile icon="👨\u200D🎨" label="Active Painters" value={String(PAINTERS.length)} />
            <KpiTile icon="✅" label="GI Certified" value="94%" />
            <KpiTile icon="🚛" label="Avg Transit" value="4.2 days" />
          </div>

          <Card className="ppr-health-grid">
            <CardHeader><CardTitle>Quality Compliance</CardTitle></CardHeader>
            <CardContent>
              <div className="flex justify-around">
                <HealthRing value={97} label="GI Tag" />
                <HealthRing value={93} label="IS 16796" />
                <HealthRing value={89} label="Canvas" />
                <HealthRing value={84} label="Truck" />
                <HealthRing value={91} label="Storage" />
                <HealthRing value={95} label="Dye" />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Painting Schools" value="12 Villages" />
            <ValueTile label="Annual Output" value="2,800 Scrolls" />
            <ValueTile label="Export Markets" value="14 Countries" />
            <ValueTile label="Heritage Age" value="700 Years" />
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
            placeholder="Search by ID, scroll, or painter..."
          />

          <Card className="ppr-table-card">
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-violet-50">
                    <th className="p-3 text-left">ID</th>
                    <th className="p-3 text-left">Scroll</th>
                    <th className="p-3 text-left">Painter</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-right">Qty</th>
                    <th className="p-3 text-right">Cost</th>
                    <th className="p-3 text-left">Cost Bar</th>
                    <th className="p-3 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.slice(0, 15).map(r => (
                    <tr key={r.id} className="border-b hover:bg-violet-50/50">
                      <td className="p-3 font-mono text-xs">{r.id}</td>
                      <td className="p-3"><ProductBadge name={r.scroll} /></td>
                      <td className="p-3 text-xs">{r.painter}</td>
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
              <CardHeader><CardTitle>Painter Volume</CardTitle></CardHeader>
              <CardContent>
                <BarChart width={500} height={250} data={painterChart}>
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
            <Card className="ppr-insight"><CardHeader><CardTitle>Bhilwara Phad Scroll Painting — 700 Years of Rajasthani Narrative Art</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Phad painting is a revered seven-hundred-year-old Rajasthani folk art form originating from Bhilwara district, depicting the epic narratives of folk deities Devnarayan and Pabuji who are venerated by rural communities across southern Rajasthan. The Bhopa bards serve as both painters and performers, creating elaborate narrative cloth scrolls using natural vegetable dyes and mineral pigments on handwoven cotton fabric. During ritual performances, the Phad scroll is unrolled like a ceremonial flag while the Bhopa narrates the divine epics accompanied by the Ravanhatta string instrument and the Bopi singer. Each Phad painting measures between five to thirty feet in length and contains meticulously detailed scenes of divine battles, temple processions, celestial events, and heroic deeds passed down through specific painter families. The tradition represents a unique intersection of visual storytelling, religious devotion, and community identity that continues to thrive in Bhilwara, Shahpura, and surrounding rural landscapes of Rajasthan.</p></CardContent></Card>
            <Card className="ppr-insight"><CardHeader><CardTitle>IS 16796 Folk Scroll Quality Standards for Traditional Cloth Paintings</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">IS 16796 establishes comprehensive quality benchmarks for traditional Indian folk scroll paintings including Phad art, covering substrate preparation, natural dye specifications, colour fastness grading, and finished product classification. Base cloth substrate must meet minimum thread count and tensile strength parameters suitable for long-term preservation and repeated unrolling during Bhopa ritual performances. Natural dye specifications mandate all colouring agents be derived from traditional sources including indigo for blue, turmeric and pomegranate rind for yellow, iron oxide for red and black, with chemical fastness tests conducted under controlled laboratory conditions. Colour fastness grading follows a standardized scale evaluating resistance to light exposure, moisture, and friction over accelerated aging periods specific to Rajasthan arid climate conditions. Geographic Indication certification under the GI Phad Painting Mark provides additional authentication verifying each scroll originates from the designated Bhilwara region and adheres to traditional Bhopa painter methodologies passed down through hereditary artisan lineages across twelve painting villages in the region.</p></CardContent></Card>
            <Card className="ppr-insight"><CardHeader><CardTitle>Canvas Roll Packaging &amp; Dust-Free Surface Transit for Phad Cloth Art</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Phad cloth paintings require specialised canvas roll packaging to protect irreplaceable hand-painted artworks from environmental damage during surface transit across Rajasthan eight hundred to twelve hundred kilometre logistics corridors from Bhilwara craft villages to Delhi and Mumbai export terminals. Each completed Phad scroll is first wrapped in acid-free interleaf tissue paper preventing pigment transfer between painted surfaces and providing a barrier against atmospheric pollutants. The wrapped scroll is placed within custom-sized corrugated roll tubes engineered with internal cushioning of unbleached cotton batting absorbing vibration shocks during flatbed truck transit. Temperature control between twenty to twenty-eight degrees Celsius is maintained throughout the supply chain using insulated transport vehicles with real-time climate monitoring sensors. Dust-free storage facilities across the Rajasthan logistics network feature HEPA filtration systems and humidity regulation preventing mould growth on the cotton cloth substrate. The entire packaging chain is documented through digital tracking providing end-to-end visibility from Bhopa painter workshops to final gallery destinations ensuring complete provenance reporting.</p></CardContent></Card>
            <Card className="ppr-insight"><CardHeader><CardTitle>AI Phad Art Authentication &amp; Rajasthani Folk Art Export Market Expansion</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Artificial intelligence is transforming Phad painting authentication and Rajasthani folk art export market expansion through advanced computational pattern analysis and provenance verification. Convolutional neural network models trained on authenticated Phad painting samples identify distinctive Bhopa brushstroke patterns, natural dye pigment composition signatures, and compositional motifs unique to individual painter lineages across Bhilwara twelve painting villages. Computer vision systems measure design symmetry and narrative sequence accuracy within tight tolerances, verifying the traditional cloth scroll painting technique that defines authentic Phad craft. India Phad art export revenue has grown substantially driven by increasing demand from museums and cultural institutions across fourteen countries including United States, United Kingdom, Japan, France, and Germany. Blockchain-based provenance tracking from natural dye preparation through cloth scroll painting, GI certification, canvas roll packaging, and shipping documentation combats reproduction fraud estimated at significant annual losses, with each authenticated piece carrying a unique digital certificate on the Rajasthan Handicrafts Registry linking to the originating Bhopa painter family.</p></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
