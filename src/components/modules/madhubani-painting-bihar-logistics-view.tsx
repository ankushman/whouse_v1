import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#92400e', '#a16207', '#ca8a04', '#eab308', '#fde047', '#78350f', '#451a03', '#fefce8']
const PRODUCTS = ['Kohbar Ghar Painting', 'Sita Swayamvar Panel', 'Fish Fertility Madhubani', 'Sun God Surya Art', 'Tree of Life Painting', 'Radha Krishna Madhubani', 'Snake Goddess Panel', 'Mithila Wedding Scene']
const ARTISANS = ['Madhubani Village Artists', 'Ranti Village Cluster', 'Jitwarpur Painting Centre', 'Saurath Artisan Guild', 'Rasulpur Folk Art Colony', 'Laheria Ghati Painters', 'Benipatti Mithila Art', 'Bisfi Rural Women Artists']
const STATUSES = ['GI Madhubani Paint Mark', 'IS 16790 Folk Art Grade A', 'Acid-Free Paper Roll', 'Flatbed Truck Transit', 'Dry Storage 18-25C', 'Pigment Colour QC']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="mpb-badge inline-block px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="mpb-status inline-block px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="mpb-costbar w-full bg-amber-100 rounded h-2"><div className="bg-amber-700 h-2 rounded" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ value, label, size = 64 }: { value: number; label: string; size?: number }) => {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (ri(0, 100, value) / 100) * circ
  return (
    <div className="mpb-health-ring flex flex-col items-center">
      <svg width={size} height={size}><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={4} /><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#92400e" strokeWidth={4} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`} /></svg>
      <span className="text-xs font-semibold" style={{ color: COLORS[0] }}>{value}%</span>
      <span className="text-[10px] text-gray-500">{label}</span>
    </div>
  )
}

const KpiTile = ({ label, value, icon }: { label: string; value: string; icon: string }) => (
  <Card className="mpb-kpi"><CardContent className="p-4"><div className="flex items-center gap-3"><span className="text-2xl">{icon}</span><div><p className="text-xs text-gray-500">{label}</p><p className="text-xl font-bold" style={{ color: COLORS[0] }}>{value}</p></div></div></CardContent></Card>
)

const ValueTile = ({ label, value }: { label: string; value: string }) => (
  <Card className="mpb-value"><CardContent className="p-4"><p className="text-xs text-gray-500">{label}</p><p className="text-lg font-semibold" style={{ color: COLORS[1] }}>{value}</p></CardContent></Card>
)

const genRecords = (startIdx: number) => Array.from({ length: 20 }, (_, i) => {
  const idx = startIdx + i
  const units = ['pcs', 'sets', 'rolls', 'panels']
  return {
    id: `MPB-${String(idx).padStart(4, '0')}`, product: PRODUCTS[idx % 8], artisan: ARTISANS[idx % 8],
    status: STATUSES[idx % 6], qty: ri(5, 80, 8 + idx * 3), unit: units[idx % 4],
    cost: ri(3000, 45000, 5000 + idx * 2000), date: `2025-07-${String(ri(1, 28, idx % 28 + 1)).padStart(2, '0')}`,
  }
})

const madhubaniRecords = [
  { id: 'MPB-0001', product: 'Kohbar Ghar Painting', artisan: 'Madhubani Village Artists', status: 'GI Madhubani Paint Mark', qty: 12, unit: 'pcs', cost: 18000, date: '2025-07-02' },
  { id: 'MPB-0002', product: 'Sita Swayamvar Panel', artisan: 'Ranti Village Cluster', status: 'IS 16790 Folk Art Grade A', qty: 25, unit: 'panels', cost: 12000, date: '2025-07-04' },
  { id: 'MPB-0003', product: 'Fish Fertility Madhubani', artisan: 'Jitwarpur Painting Centre', status: 'Acid-Free Paper Roll', qty: 8, unit: 'rolls', cost: 35000, date: '2025-07-05' },
  { id: 'MPB-0004', product: 'Sun God Surya Art', artisan: 'Saurath Artisan Guild', status: 'Flatbed Truck Transit', qty: 15, unit: 'pcs', cost: 22000, date: '2025-07-07' },
  { id: 'MPB-0005', product: 'Tree of Life Painting', artisan: 'Rasulpur Folk Art Colony', status: 'Dry Storage 18-25C', qty: 30, unit: 'sets', cost: 8000, date: '2025-07-08' },
  { id: 'MPB-0006', product: 'Radha Krishna Madhubani', artisan: 'Laheria Ghati Painters', status: 'Pigment Colour QC', qty: 6, unit: 'pcs', cost: 42000, date: '2025-07-10' },
  { id: 'MPB-0007', product: 'Snake Goddess Panel', artisan: 'Benipatti Mithila Art', status: 'GI Madhubani Paint Mark', qty: 10, unit: 'panels', cost: 28000, date: '2025-07-11' },
  { id: 'MPB-0008', product: 'Mithila Wedding Scene', artisan: 'Bisfi Rural Women Artists', status: 'IS 16790 Folk Art Grade A', qty: 20, unit: 'sets', cost: 15000, date: '2025-07-13' },
  { id: 'MPB-0009', product: 'Kohbar Ghar Painting', artisan: 'Madhubani Village Artists', status: 'Acid-Free Paper Roll', qty: 14, unit: 'pcs', cost: 21000, date: '2025-07-14' },
  { id: 'MPB-0010', product: 'Sita Swayamvar Panel', artisan: 'Ranti Village Cluster', status: 'Flatbed Truck Transit', qty: 18, unit: 'panels', cost: 9500, date: '2025-07-15' },
  { id: 'MPB-0011', product: 'Fish Fertility Madhubani', artisan: 'Jitwarpur Painting Centre', status: 'Dry Storage 18-25C', qty: 7, unit: 'rolls', cost: 38000, date: '2025-07-16' },
  { id: 'MPB-0012', product: 'Sun God Surya Art', artisan: 'Saurath Artisan Guild', status: 'Pigment Colour QC', qty: 22, unit: 'pcs', cost: 16500, date: '2025-07-17' },
  { id: 'MPB-0013', product: 'Tree of Life Painting', artisan: 'Rasulpur Folk Art Colony', status: 'GI Madhubani Paint Mark', qty: 35, unit: 'sets', cost: 7500, date: '2025-07-18' },
  { id: 'MPB-0014', product: 'Radha Krishna Madhubani', artisan: 'Laheria Ghati Painters', status: 'IS 16790 Folk Art Grade A', qty: 5, unit: 'pcs', cost: 44000, date: '2025-07-19' },
  { id: 'MPB-0015', product: 'Snake Goddess Panel', artisan: 'Benipatti Mithila Art', status: 'Acid-Free Paper Roll', qty: 9, unit: 'panels', cost: 30000, date: '2025-07-20' },
  { id: 'MPB-0016', product: 'Mithila Wedding Scene', artisan: 'Bisfi Rural Women Artists', status: 'Flatbed Truck Transit', qty: 16, unit: 'sets', cost: 13000, date: '2025-07-21' },
  { id: 'MPB-0017', product: 'Kohbar Ghar Painting', artisan: 'Madhubani Village Artists', status: 'Dry Storage 18-25C', qty: 11, unit: 'pcs', cost: 25000, date: '2025-07-22' },
  { id: 'MPB-0018', product: 'Sita Swayamvar Panel', artisan: 'Ranti Village Cluster', status: 'Pigment Colour QC', qty: 28, unit: 'panels', cost: 11000, date: '2025-07-23' },
  { id: 'MPB-0019', product: 'Fish Fertility Madhubani', artisan: 'Jitwarpur Painting Centre', status: 'GI Madhubani Paint Mark', qty: 6, unit: 'rolls', cost: 40000, date: '2025-07-24' },
  { id: 'MPB-0020', product: 'Sun God Surya Art', artisan: 'Saurath Artisan Guild', status: 'IS 16790 Folk Art Grade A', qty: 19, unit: 'pcs', cost: 19500, date: '2025-07-25' },
]

export default function MadhubaniPaintingBiharLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = [...madhubaniRecords, ...genRecords(21), ...genRecords(41)]

  const filteredRecords = useMemo(() => {
    return allRecords.filter(r => {
      if (searchQuery && !r.id.toLowerCase().includes(searchQuery.toLowerCase()) && !r.product.toLowerCase().includes(searchQuery.toLowerCase())) return false
      return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string))
    })
  }, [searchQuery, activeFilters, allRecords])

  const filterGroups = [
    { key: 'product', label: 'Product', options: PRODUCTS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.product === p).length })) },
    { key: 'artisan', label: 'Artisan', options: ARTISANS.map(a => ({ value: a, label: a, count: allRecords.filter(r => r.artisan === a).length })) },
  ]

  const trendData = PRODUCTS.slice(0, 6).map((p, i) => ({ name: p.split(' ').slice(0, 2).join(' '), shipments: 4 + i * 3, cost: 8000 + i * 6500 }))
  const artisanChart = ARTISANS.slice(0, 6).map((a, i) => ({ name: a.split(' ').slice(0, 2).join(' '), volume: 15 + i * 8, revenue: 10 + i * 5 }))
  const statusPie = STATUSES.map((s, i) => ({ name: s.split(' ').slice(0, 2).join(' '), value: 5 + i * 4 }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="mpb-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Madhubani Painting Bihar' }]} />
      <PageHeader title="Madhubani Painting Bihar Logistics" description="Track Bihar's 2,500-year Mithila painting heritage through GI-tagged certification, acid-free paper logistics, natural pigment quality control, flatbed truck transit, dry storage, and global export distribution" />
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-amber-50">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <KpiTile icon="🎨" label="Total Paintings" value={String(allRecords.length)} />
            <KpiTile icon="👥" label="Artisan Clusters" value={String(ARTISANS.length)} />
            <KpiTile icon="💰" label="Total Value" value={`₹${(allRecords.reduce((a, r) => a + r.cost, 0) / 100000).toFixed(1)}L`} />
            <KpiTile icon="📈" label="Avg Cost" value={`₹${Math.round(allRecords.reduce((a, r) => a + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>

          <Card className="mpb-health-grid">
            <CardHeader><CardTitle>Quality Compliance</CardTitle></CardHeader>
            <CardContent>
              <div className="flex justify-around">
                <HealthRing value={95} label="GI Tag" />
                <HealthRing value={91} label="IS 16790" />
                <HealthRing value={87} label="Paper" />
                <HealthRing value={80} label="Truck" />
                <HealthRing value={93} label="Storage" />
                <HealthRing value={89} label="Pigment" />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Artisan Families" value="5,000+" />
            <ValueTile label="Annual Production" value="2 Lakh pcs" />
            <ValueTile label="Export Markets" value="18 Countries" />
            <ValueTile label="GI Varieties" value="5 Styles" />
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
            placeholder="Search by ID, product, or artisan..."
          />

          <Card className="mpb-table-card">
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
              <CardHeader><CardTitle>Artisan Volume</CardTitle></CardHeader>
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
            <Card className="mpb-insight"><CardHeader><CardTitle>Madhubani — Bihar's 2,500-Year Mithila Painting Tradition</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Madhubani painting originates from the Mithila region of Bihar with roots stretching over 2,500 years to the time of King Janaka and Princess Sita. Traditionally painted by women on freshly plastered mud walls during weddings and festivals, the artform depicts Hindu deities, court scenes, fertility symbols, and nature using five styles: Bharni, Katchni, Tantrik, Godna, and Kohbar. The GI tag was registered in 2007-2008 protecting authenticity from Madhubani, Darbhanga, and Sitamarhi districts. Over 5,000 artisan families sustain this heritage producing 2 lakh paintings annually valued at Rs 100 crore. The art transitioned from wall to handmade paper in the 1960s after a Bihar drought prompted the All India Handicrafts Board to promote paper-based Madhubani for commercial sale, and today it is celebrated globally at the British Museum, Smithsonian, and Louvre.</p></CardContent></Card>
            <Card className="mpb-insight"><CardHeader><CardTitle>IS 16790 Folk Art Standards &amp; Quality Certification</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">IS 16790 covers folk art painting standards specifying acid-free handmade paper with pH 7.0-8.5, grammage 120-300 gsm, and thickness 0.3-1.2 mm for Madhubani paintings. Pigment fastness must achieve minimum Grade 4 on ISO 105-X12 dry rubbing and Grade 3 on wet rubbing. Natural pigments including red from kumkum, yellow from turmeric, black from soot and lampblack, green from leaves, and white from rice paste must pass heavy metal testing with lead below 90 ppm, arsenic below 25 ppm, mercury below 10 ppm. Colour density by spectrophotometer must maintain delta E below 3.0 between batches. Paper tensile strength minimum 2.5 kN/m MD and 1.5 kN/m CD prevents tearing. Humidity resistance at 85% RH for 48 hours must show no fungal growth or pigment bleeding. Each GI-certified painting carries a holographic tag with QR code linking to artisan registration.</p></CardContent></Card>
            <Card className="mpb-insight"><CardHeader><CardTitle>Paper, Pigment &amp; Painting Packaging Logistics</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Madhubani paintings are rolled on acid-free cardboard tubes (50mm diameter, 3mm wall) wrapped in silicone-release glassine paper preventing pigment transfer. Each roll is sealed in a polypropylene tube with desiccant sachets (5g silica gel per 300mm) maintaining relative humidity below 40%. Maximum stack is 6 tubes vertically, 3 layers horizontally in corrugated boxes. From Madhubani to Patna (180 km) takes 4-5 hours via NH527 in covered flatbed trucks at 18-25 degrees Celsius. International shipments are flat-packed between acid-free foam boards (6mm) in ISPM-15 wooden crates. Surface-framed paintings require corner protectors and 10mm bubble-wrap cushioning. Bihar Handicrafts Development Corporation runs 12 regional packaging centres serving 3,200 artisans. Transit damage reduced from 18% in 2015 to 3.2% in 2024 under the GI packaging protocol.</p></CardContent></Card>
            <Card className="mpb-insight"><CardHeader><CardTitle>AI Digitisation &amp; Global Export Expansion</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">AI-powered image recognition digitises Madhubani paintings at 600 DPI in under 90 seconds, creating archival copies for blockchain provenance ledgers. ML classifiers trained on 50,000 annotated images achieve 96% accuracy identifying the five traditional styles and detecting counterfeit reproductions lacking authentic brush stroke patterns. India's Madhubani export market grew 85% from Rs 32 crore (2019) to Rs 59 crore (2025), targeting Rs 120 crore by 2028 with demand from USA, UK, Japan, France, and Australia. Online platforms including Amazon Handmade, Etsy, and GeM account for 40% of new export orders. AI-assisted design generation creates contemporary adaptations for wallpaper, textiles, and decor in hours. NID Patna runs AI-ML workshops for 500 artisans annually, bridging the digital divide while preserving Mithila's 2,500-year-old visual vocabulary. UNESCO intangible heritage nomination is under preparation for 2026.</p></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
