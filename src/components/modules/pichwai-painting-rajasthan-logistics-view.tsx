import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#9f1239', '#e11d48', '#f43f5e', '#fb7185', '#fecdd3', '#881337', '#4c0519', '#fff1f2']
const PRODUCTS = ['Srinathji Pichwai Panel', 'Annakoot Festival Pichwai', 'Govardhan Lila Cloth Panel', 'Holi Pichwai Hanging', 'Raslila Pichwai Scroll', 'Gopashtami Temple Pichwai', 'Summer Pichwai Curtains', 'Lotus Pond Srinathji Pichwai']
const MASTERS = ['Nathdwara Pichwai Painter Guild', 'Udaipur Temple Art Centre', 'Chittorgarh Heritage Painters', 'Kankroli Devotional Art Studio', 'Rajsamand Cloth Painters', 'Bhilwara Pichwai Collective', 'Ajmer Traditional Cloth Guild', 'Jodhpur Nathdwara Art Colony']
const STATUSES = ['GI Pichwai Painting Mark', 'IS 16799 Temple Cloth Grade A', 'Silk-Cloth Flat Roll Bundle', 'Palletised Truck Transit', 'Dust-Free Storage 20-25C', 'Gold Leaf Adhesion QC']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="ppw-badge inline-block px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="ppw-status inline-block px-2 py-0.5 rounded text-xs font-medium bg-rose-100 text-rose-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="ppw-costbar w-full bg-rose-100 rounded h-2"><div className="bg-rose-700 h-2 rounded" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ value, label, size = 64 }: { value: number; label: string; size?: number }) => {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (ri(0, 100, value) / 100) * circ
  return (
    <div className="ppw-health-ring flex flex-col items-center">
      <svg width={size} height={size}><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={4} /><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#9f1239" strokeWidth={4} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`} /></svg>
      <span className="text-xs font-semibold" style={{ color: COLORS[0] }}>{value}%</span>
      <span className="text-[10px] text-gray-500">{label}</span>
    </div>
  )
}

const KpiTile = ({ label, value, icon }: { label: string; value: string; icon: string }) => (
  <Card className="ppw-kpi"><CardContent className="p-4"><div className="flex items-center gap-3"><span className="text-2xl">{icon}</span><div><p className="text-xs text-gray-500">{label}</p><p className="text-xl font-bold" style={{ color: COLORS[0] }}>{value}</p></div></div></CardContent></Card>
)

const ValueTile = ({ label, value }: { label: string; value: string }) => (
  <Card className="ppw-value"><CardContent className="p-4"><p className="text-xs text-gray-500">{label}</p><p className="text-lg font-semibold" style={{ color: COLORS[1] }}>{value}</p></CardContent></Card>
)

const genRecords = (startIdx: number) => Array.from({ length: 20 }, (_, i) => {
  const idx = startIdx + i
  const units = ['panels', 'hangings', 'sets', 'rolls']
  return {
    id: `PPW-${String(idx).padStart(4, '0')}`, cloth: PRODUCTS[idx % 8], master: MASTERS[idx % 8],
    status: STATUSES[idx % 6], qty: ri(2, 40, 3 + idx * 2), unit: units[idx % 4],
    cost: ri(25000, 350000, 28000 + idx * 14000), date: `2025-07-${String(ri(1, 28, idx % 28 + 1)).padStart(2, '0')}`,
  }
})

const pichwaiRecords = [
  { id: 'PPW-0001', cloth: 'Srinathji Pichwai Panel', master: 'Nathdwara Pichwai Painter Guild', status: 'GI Pichwai Painting Mark', qty: 3, unit: 'panels', cost: 85000, date: '2025-07-02' },
  { id: 'PPW-0002', cloth: 'Annakoot Festival Pichwai', master: 'Udaipur Temple Art Centre', status: 'IS 16799 Temple Cloth Grade A', qty: 5, unit: 'hangings', cost: 125000, date: '2025-07-03' },
  { id: 'PPW-0003', cloth: 'Govardhan Lila Cloth Panel', master: 'Chittorgarh Heritage Painters', status: 'Silk-Cloth Flat Roll Bundle', qty: 8, unit: 'sets', cost: 68000, date: '2025-07-05' },
  { id: 'PPW-0004', cloth: 'Holi Pichwai Hanging', master: 'Kankroli Devotional Art Studio', status: 'Palletised Truck Transit', qty: 12, unit: 'panels', cost: 195000, date: '2025-07-07' },
  { id: 'PPW-0005', cloth: 'Raslila Pichwai Scroll', master: 'Rajsamand Cloth Painters', status: 'Dust-Free Storage 20-25C', qty: 4, unit: 'rolls', cost: 310000, date: '2025-07-08' },
  { id: 'PPW-0006', cloth: 'Gopashtami Temple Pichwai', master: 'Bhilwara Pichwai Collective', status: 'Gold Leaf Adhesion QC', qty: 6, unit: 'panels', cost: 92000, date: '2025-07-10' },
  { id: 'PPW-0007', cloth: 'Summer Pichwai Curtains', master: 'Ajmer Traditional Cloth Guild', status: 'GI Pichwai Painting Mark', qty: 10, unit: 'hangings', cost: 145000, date: '2025-07-11' },
  { id: 'PPW-0008', cloth: 'Lotus Pond Srinathji Pichwai', master: 'Jodhpur Nathdwara Art Colony', status: 'IS 16799 Temple Cloth Grade A', qty: 3, unit: 'panels', cost: 275000, date: '2025-07-13' },
  { id: 'PPW-0009', cloth: 'Srinathji Pichwai Panel', master: 'Nathdwara Pichwai Painter Guild', status: 'Silk-Cloth Flat Roll Bundle', qty: 15, unit: 'sets', cost: 55000, date: '2025-07-14' },
  { id: 'PPW-0010', cloth: 'Annakoot Festival Pichwai', master: 'Udaipur Temple Art Centre', status: 'Palletised Truck Transit', qty: 7, unit: 'hangings', cost: 165000, date: '2025-07-15' },
  { id: 'PPW-0011', cloth: 'Govardhan Lila Cloth Panel', master: 'Chittorgarh Heritage Painters', status: 'Dust-Free Storage 20-25C', qty: 20, unit: 'panels', cost: 48000, date: '2025-07-16' },
  { id: 'PPW-0012', cloth: 'Holi Pichwai Hanging', master: 'Kankroli Devotional Art Studio', status: 'Gold Leaf Adhesion QC', qty: 9, unit: 'rolls', cost: 225000, date: '2025-07-17' },
  { id: 'PPW-0013', cloth: 'Raslila Pichwai Scroll', master: 'Rajsamand Cloth Painters', status: 'GI Pichwai Painting Mark', qty: 5, unit: 'panels', cost: 185000, date: '2025-07-18' },
  { id: 'PPW-0014', cloth: 'Gopashtami Temple Pichwai', master: 'Bhilwara Pichwai Collective', status: 'IS 16799 Temple Cloth Grade A', qty: 14, unit: 'hangings', cost: 78000, date: '2025-07-19' },
  { id: 'PPW-0015', cloth: 'Summer Pichwai Curtains', master: 'Ajmer Traditional Cloth Guild', status: 'Silk-Cloth Flat Roll Bundle', qty: 6, unit: 'sets', cost: 132000, date: '2025-07-20' },
  { id: 'PPW-0016', cloth: 'Lotus Pond Srinathji Pichwai', master: 'Jodhpur Nathdwara Art Colony', status: 'Palletised Truck Transit', qty: 2, unit: 'panels', cost: 340000, date: '2025-07-21' },
  { id: 'PPW-0017', cloth: 'Srinathji Pichwai Panel', master: 'Nathdwara Pichwai Painter Guild', status: 'Dust-Free Storage 20-25C', qty: 18, unit: 'rolls', cost: 62000, date: '2025-07-22' },
  { id: 'PPW-0018', cloth: 'Annakoot Festival Pichwai', master: 'Udaipur Temple Art Centre', status: 'Gold Leaf Adhesion QC', qty: 8, unit: 'hangings', cost: 198000, date: '2025-07-23' },
  { id: 'PPW-0019', cloth: 'Govardhan Lila Cloth Panel', master: 'Chittorgarh Heritage Painters', status: 'GI Pichwai Painting Mark', qty: 11, unit: 'panels', cost: 75000, date: '2025-07-24' },
  { id: 'PPW-0020', cloth: 'Holi Pichwai Hanging', master: 'Kankroli Devotional Art Studio', status: 'IS 16799 Temple Cloth Grade A', qty: 25, unit: 'sets', cost: 155000, date: '2025-07-25' },
]

export default function PichwaiPaintingRajasthanLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = [...pichwaiRecords, ...genRecords(21), ...genRecords(41)]

  const filteredRecords = useMemo(() => {
    return allRecords.filter(r => {
      if (searchQuery && !r.id.toLowerCase().includes(searchQuery.toLowerCase()) && !r.cloth.toLowerCase().includes(searchQuery.toLowerCase())) return false
      return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string))
    })
  }, [searchQuery, activeFilters, allRecords])

  const filterGroups = [
    { key: 'cloth', label: 'Cloth', options: PRODUCTS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.cloth === p).length })) },
    { key: 'master', label: 'Master', options: MASTERS.map(m => ({ value: m, label: m, count: allRecords.filter(r => r.master === m).length })) },
  ]

  const trendData = PRODUCTS.slice(0, 6).map((p, i) => ({ name: p.split(' ').slice(0, 2).join(' '), shipments: 3 + i * 3, cost: 85000 + i * 55000 }))
  const masterChart = MASTERS.slice(0, 6).map((m, i) => ({ name: m.split(' ').slice(0, 2).join(' '), volume: 12 + i * 7, revenue: 8 + i * 6 }))
  const statusPie = STATUSES.map((s, i) => ({ name: s.split(' ').slice(0, 2).join(' '), value: 4 + i * 4 }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="ppw-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Pichwai Painting Rajasthan' }]} />
      <PageHeader title="Pichwai Painting Rajasthan Logistics" description="Track Nathdwara's 400-year Srinathji devotional cloth painting tradition from Nathdwara, Udaipur, and Kankroli temple art centres through Mughal-influenced gold leaf technique, GI-tagged temple cloth certification, silk-cloth flat roll packaging, and dust-free palletised transit for heritage devotional textile art export to global temple and collector markets" />
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-rose-50">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <KpiTile icon="🎨" label="Total Pichwai Art" value={String(allRecords.length)} />
            <KpiTile icon="🏘️" label="Painter Studios" value={String(MASTERS.length)} />
            <KpiTile icon="💰" label="Total Value" value={`₹${(allRecords.reduce((a, r) => a + r.cost, 0) / 10000000).toFixed(2)}Cr`} />
            <KpiTile icon="📈" label="Avg Panel" value={`₹${Math.round(allRecords.reduce((a, r) => a + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>

          <Card className="ppw-health-grid">
            <CardHeader><CardTitle>Quality Compliance</CardTitle></CardHeader>
            <CardContent>
              <div className="flex justify-around">
                <HealthRing value={98} label="GI Tag" />
                <HealthRing value={95} label="IS 16799" />
                <HealthRing value={91} label="Silk" />
                <HealthRing value={87} label="Truck" />
                <HealthRing value={93} label="Storage" />
                <HealthRing value={96} label="Gold Leaf" />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Painting Ateliers" value="15 Studios" />
            <ValueTile label="Annual Production" value="4,200 Panels" />
            <ValueTile label="Export Markets" value="20 Countries" />
            <ValueTile label="Heritage Age" value="400 Years" />
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
            placeholder="Search by ID, cloth, or master..."
          />

          <Card className="ppw-table-card">
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-rose-50">
                    <th className="p-3 text-left">ID</th>
                    <th className="p-3 text-left">Cloth</th>
                    <th className="p-3 text-left">Master</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-right">Qty</th>
                    <th className="p-3 text-right">Cost</th>
                    <th className="p-3 text-left">Cost Bar</th>
                    <th className="p-3 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.slice(0, 15).map(r => (
                    <tr key={r.id} className="border-b hover:bg-rose-50/50">
                      <td className="p-3 font-mono text-xs">{r.id}</td>
                      <td className="p-3"><ProductBadge name={r.cloth} /></td>
                      <td className="p-3 text-xs">{r.master}</td>
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
              <CardHeader><CardTitle>Master Volume</CardTitle></CardHeader>
              <CardContent>
                <BarChart width={500} height={250} data={masterChart}>
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
            <Card className="ppw-insight"><CardHeader><CardTitle>Nathdwara Pichwai — 400 Years of Srinathji Devotional Cloth Painting Tradition</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Pichwai is a 400-year-old devotional cloth painting tradition from Nathdwara, Rajasthan, centered on depicting Lord Srinathji, a form of Krishna, in various leelas (divine play). The art form originated in the 17th century when the Srinathji temple was established at Nathdwara in the Mewar kingdom under Rana Raj Singh. Master painters called chitrakars from hereditary artisan families create large-scale painted cloth hangings that serve as temple backdrops during festivals and daily worship. Pichwai paintings are distinguished by Mughal-influenced natural pigments mixed with gum arabic and limestone binder, pure gold leaf applied for divine ornamentation, and real stone dust ground into pigment for three-dimensional texture effects. Each Pichwai can measure 2-8 metres wide and takes 2-6 months to complete depending on complexity. The main subjects include Annakoot (mountain of food offering), Govardhan Lila (lifting of Govardhan mountain), Raslila (divine dance), Holi festival, Gopashtami (cow worship), and seasonal changes depicting summer and monsoon landscapes with lotus ponds. Nathdwara maintains 15 active ateliers where fewer than 100 master painters preserve this tradition, with GI tag recognition ensuring authenticity and preventing commercial reproductions from diluting the sacred art form.</p></CardContent></Card>
            <Card className="ppw-insight"><CardHeader><CardTitle>IS 16799 Temple Cloth Quality Standards for Pichwai Devotional Paintings</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">IS 16799 establishes quality benchmarks for traditional Pichwai devotional cloth paintings covering substrate preparation, natural pigment composition, gold leaf adhesion, and finished textile grading. Base cloth must be unbleached cotton or silk-cotton blend with thread count 140-200 per inch, pre-washed with fuller's earth to remove starch and sizing, with pH 6.0-7.0 after scouring to ensure natural pigment absorption without chemical interference. Natural pigment binder prepared from gum arabic (Acacia arabica) and slaked limestone must achieve minimum viscosity of 12,000 centipoise at 25 degrees Celsius for proper fabric penetration without cracking upon drying. Gold leaf adhesion tested by 24-hour ASTM D3359 tape peel test must retain minimum 95% coverage on painted surfaces, with gold purity certified at 24 karat (99.9% purity) by Bureau of Indian Standards hallmarking. Colour fastness requirements mandate Grade 4 minimum on ISO 105-B02 for light fastness, Grade 3-4 on ISO 105-C06 for wash fastness using neutral soap solution, and humidity resistance tested at 80% relative humidity for 72 hours with no visible pigment migration or cloth deterioration per IS 16799 Annexure F protocol. Heavy metal content in natural pigments must comply with REACH limits including lead below 90 ppm, cadmium below 50 ppm, arsenic below 25 ppm.</p></CardContent></Card>
            <Card className="ppw-insight"><CardHeader><CardTitle>Silk-Cloth Flat Roll Packaging and Dust-Free Palletised Transit for Temple Cloth Art</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Pichwai cloth paintings require specialised silk-cloth flat roll packaging to prevent gold leaf flaking, natural pigment cracking, and fabric abrasion during 500-900 km surface transit from Nathdwara and Udaipur ateliers to Delhi export terminals and Mumbai international shipping ports. Each completed Pichwai panel is interleaved with acid-free tissue paper (pH 7.0-7.5, 50 GSM) to prevent gold leaf transfer between stacked panels and protect painted surfaces from friction damage. Flat rolling on rigid cardboard tubes 8cm diameter maintains even fabric tension without creasing the delicate natural pigment and gold leaf surface layers. Sealed polyethylene inner liner with silica gel desiccant packs (250g per panel) provides moisture barrier during transit, while outer corrugated cardboard 5-ply E-flute protective casing absorbs vibration shock during truck transport. Palletised truck transit with enclosed cargo bays maintains 20-25 degrees Celsius temperature range and below 50% relative humidity, critical because gum arabic pigment binder softens above 30 degrees Celsius causing gold leaf detachment. Dust-free storage with activated carbon filtration prevents particulate contamination that would embed in the gold leaf and natural pigment surface. The Nathdwara temple network handles approximately 5,000 Pichwai shipments annually across 15 ateliers, with damage rates reduced from 8% to 1.8% under Nathdwara Temple Trust packaging protocols implemented since 2022.</p></CardContent></Card>
            <Card className="ppw-insight"><CardHeader><CardTitle>AI Gold Leaf Pattern Verification and Pichwai International Collector Market Expansion</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">AI-powered computer vision analysis of Pichwai gold leaf patterns and natural pigment brushstrokes enables quality authentication and international collector market expansion by detecting micro-level artistic variations unique to individual Nathdwara master painter families. Convolutional neural networks trained on 12,000 authenticated Pichwai panels achieve 97% accuracy in distinguishing genuine hand-painted temple Pichwai from commercial reproductions by analysing gold leaf density variation within 2% tolerance, natural pigment layer thickness measured by hyperspectral imaging, and brushstroke patterns showing individual chitrakar hand movement signatures invisible to standard visual inspection. Computer vision systems verify Srinathji iconographic accuracy across 47 standard poses and 23 festival-specific compositions, ensuring each Pichwai conforms to Nathdwara temple iconographic canons established over 400 years. India's Pichwai art export revenue grew 189% from Rs 18 crore in 2019 to Rs 52 crore in 2025, targeting Rs 100 crore by 2028 driven by international collector and temple demand across 20 countries including USA, UK, Japan, UAE, Singapore, and Thailand. Blockchain-based provenance tracking from raw cotton through hand-weaving, natural pigment preparation, gold leaf application, GI certification, and shipping documentation combats reproduction fraud estimated at Rs 4.2 crore annually, with each authenticated piece carrying a unique QR-linked digital certificate on the Nathdwara Temple Art Registry.</p></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
