import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#be123c', '#e11d48', '#f43f5e', '#fb7185', '#fecdd3', '#9f1239', '#881337', '#fff1f2']
const PRODUCTS = ['Roghan Tree of Life Panel', 'Roghan Peacock Motif Art', 'Camel Caravan Roghan Painting', 'Roghan Floral Border Panel', 'Sacred Bull Roghan Art', 'Desert Village Roghan Scene', 'Mirror Work Roghan Frame', 'Royal Procession Roghan']
const ARTISANS = ['Nirona Roghan Art Village', 'Bhuj Roghan Craft Centre', 'Anjar Traditional Roghan', 'Mandvi Roghan Studio', 'Nakhatrana Artisan Guild', 'Bhachau Folk Art Cluster', 'Rapar Desert Artists', 'Khavda Roghan Collective']
const STATUSES = ['GI Roghan Paint Mark', 'IS 16794 Fabric Grade A', 'Cotton Fabric Flat Wrap', 'Palletised Truck Transit', 'Dry Storage 20-28C', 'Oil Pigment QC']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="rpg-badge inline-block px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="rpg-status inline-block px-2 py-0.5 rounded text-xs font-medium bg-rose-100 text-rose-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="rpg-costbar w-full bg-rose-100 rounded h-2"><div className="bg-rose-700 h-2 rounded" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ value, label, size = 64 }: { value: number; label: string; size?: number }) => {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (ri(0, 100, value) / 100) * circ
  return (
    <div className="rpg-health-ring flex flex-col items-center">
      <svg width={size} height={size}><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={4} /><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#be123c" strokeWidth={4} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`} /></svg>
      <span className="text-xs font-semibold" style={{ color: COLORS[0] }}>{value}%</span>
      <span className="text-[10px] text-gray-500">{label}</span>
    </div>
  )
}

const KpiTile = ({ label, value, icon }: { label: string; value: string; icon: string }) => (
  <Card className="rpg-kpi"><CardContent className="p-4"><div className="flex items-center gap-3"><span className="text-2xl">{icon}</span><div><p className="text-xs text-gray-500">{label}</p><p className="text-xl font-bold" style={{ color: COLORS[0] }}>{value}</p></div></div></CardContent></Card>
)

const ValueTile = ({ label, value }: { label: string; value: string }) => (
  <Card className="rpg-value"><CardContent className="p-4"><p className="text-xs text-gray-500">{label}</p><p className="text-lg font-semibold" style={{ color: COLORS[1] }}>{value}</p></CardContent></Card>
)

const genRecords = (startIdx: number) => Array.from({ length: 20 }, (_, i) => {
  const idx = startIdx + i
  const units = ['pcs', 'panels', 'sets', 'frames']
  return {
    id: `RPG-${String(idx).padStart(4, '0')}`, product: PRODUCTS[idx % 8], artisan: ARTISANS[idx % 8],
    status: STATUSES[idx % 6], qty: ri(3, 50, 5 + idx * 2), unit: units[idx % 4],
    cost: ri(8000, 250000, 12000 + idx * 12000), date: `2025-07-${String(ri(1, 28, idx % 28 + 1)).padStart(2, '0')}`,
  }
})

const roghanRecords = [
  { id: 'RPG-0001', product: 'Roghan Tree of Life Panel', artisan: 'Nirona Roghan Art Village', status: 'GI Roghan Paint Mark', qty: 5, unit: 'pcs', cost: 45000, date: '2025-07-02' },
  { id: 'RPG-0002', product: 'Roghan Peacock Motif Art', artisan: 'Bhuj Roghan Craft Centre', status: 'IS 16794 Fabric Grade A', qty: 12, unit: 'panels', cost: 95000, date: '2025-07-04' },
  { id: 'RPG-0003', product: 'Camel Caravan Roghan Painting', artisan: 'Anjar Traditional Roghan', status: 'Cotton Fabric Flat Wrap', qty: 8, unit: 'sets', cost: 62000, date: '2025-07-05' },
  { id: 'RPG-0004', product: 'Roghan Floral Border Panel', artisan: 'Mandvi Roghan Studio', status: 'Palletised Truck Transit', qty: 20, unit: 'pcs', cost: 135000, date: '2025-07-07' },
  { id: 'RPG-0005', product: 'Sacred Bull Roghan Art', artisan: 'Nakhatrana Artisan Guild', status: 'Dry Storage 20-28C', qty: 3, unit: 'frames', cost: 210000, date: '2025-07-08' },
  { id: 'RPG-0006', product: 'Desert Village Roghan Scene', artisan: 'Bhachau Folk Art Cluster', status: 'Oil Pigment QC', qty: 15, unit: 'pcs', cost: 78000, date: '2025-07-10' },
  { id: 'RPG-0007', product: 'Mirror Work Roghan Frame', artisan: 'Rapar Desert Artists', status: 'GI Roghan Paint Mark', qty: 10, unit: 'panels', cost: 88000, date: '2025-07-11' },
  { id: 'RPG-0008', product: 'Royal Procession Roghan', artisan: 'Khavda Roghan Collective', status: 'IS 16794 Fabric Grade A', qty: 4, unit: 'sets', cost: 185000, date: '2025-07-13' },
  { id: 'RPG-0009', product: 'Roghan Tree of Life Panel', artisan: 'Nirona Roghan Art Village', status: 'Cotton Fabric Flat Wrap', qty: 25, unit: 'pcs', cost: 35000, date: '2025-07-14' },
  { id: 'RPG-0010', product: 'Roghan Peacock Motif Art', artisan: 'Bhuj Roghan Craft Centre', status: 'Palletised Truck Transit', qty: 18, unit: 'panels', cost: 115000, date: '2025-07-15' },
  { id: 'RPG-0011', product: 'Camel Caravan Roghan Painting', artisan: 'Anjar Traditional Roghan', status: 'Dry Storage 20-28C', qty: 7, unit: 'sets', cost: 58000, date: '2025-07-16' },
  { id: 'RPG-0012', product: 'Roghan Floral Border Panel', artisan: 'Mandvi Roghan Studio', status: 'Oil Pigment QC', qty: 30, unit: 'pcs', cost: 142000, date: '2025-07-17' },
  { id: 'RPG-0013', product: 'Sacred Bull Roghan Art', artisan: 'Nakhatrana Artisan Guild', status: 'GI Roghan Paint Mark', qty: 6, unit: 'frames', cost: 198000, date: '2025-07-18' },
  { id: 'RPG-0014', product: 'Desert Village Roghan Scene', artisan: 'Bhachau Folk Art Cluster', status: 'IS 16794 Fabric Grade A', qty: 22, unit: 'pcs', cost: 92000, date: '2025-07-19' },
  { id: 'RPG-0015', product: 'Mirror Work Roghan Frame', artisan: 'Rapar Desert Artists', status: 'Cotton Fabric Flat Wrap', qty: 9, unit: 'panels', cost: 72000, date: '2025-07-20' },
  { id: 'RPG-0016', product: 'Royal Procession Roghan', artisan: 'Khavda Roghan Collective', status: 'Palletised Truck Transit', qty: 4, unit: 'sets', cost: 245000, date: '2025-07-21' },
  { id: 'RPG-0017', product: 'Roghan Tree of Life Panel', artisan: 'Nirona Roghan Art Village', status: 'Dry Storage 20-28C', qty: 16, unit: 'pcs', cost: 48000, date: '2025-07-22' },
  { id: 'RPG-0018', product: 'Roghan Peacock Motif Art', artisan: 'Bhuj Roghan Craft Centre', status: 'Oil Pigment QC', qty: 28, unit: 'panels', cost: 128000, date: '2025-07-23' },
  { id: 'RPG-0019', product: 'Camel Caravan Roghan Painting', artisan: 'Anjar Traditional Roghan', status: 'GI Roghan Paint Mark', qty: 11, unit: 'sets', cost: 68000, date: '2025-07-24' },
  { id: 'RPG-0020', product: 'Roghan Floral Border Panel', artisan: 'Mandvi Roghan Studio', status: 'IS 16794 Fabric Grade A', qty: 35, unit: 'pcs', cost: 165000, date: '2025-07-25' },
]

export default function RoghanPaintingGujaratLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = [...roghanRecords, ...genRecords(21), ...genRecords(41)]

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

  const trendData = PRODUCTS.slice(0, 6).map((p, i) => ({ name: p.split(' ').slice(0, 2).join(' '), shipments: 4 + i * 3, cost: 80000 + i * 65000 }))
  const artisanChart = ARTISANS.slice(0, 6).map((a, i) => ({ name: a.split(' ').slice(0, 2).join(' '), volume: 15 + i * 8, revenue: 10 + i * 5 }))
  const statusPie = STATUSES.map((s, i) => ({ name: s.split(' ').slice(0, 2).join(' '), value: 5 + i * 4 }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="rpg-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Roghan Painting Gujarat' }]} />
      <PageHeader title="Roghan Painting Gujarat Logistics" description="Track Gujarat's 300-year Kutch Roghan freehand painting tradition from Nirona, Bhuj, and Mandvi craft villages through castor oil pigment preparation, GI-tagged fabric art certification, cotton fabric flat packaging, and temperature-controlled transit for heritage textile art export to global gallery and cultural exhibition markets" />
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-rose-50">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <KpiTile icon="🎨" label="Total Roghan Art" value={String(allRecords.length)} />
            <KpiTile icon="🏘️" label="Artisan Clusters" value={String(ARTISANS.length)} />
            <KpiTile icon="💰" label="Total Value" value={`₹${(allRecords.reduce((a, r) => a + r.cost, 0) / 10000000).toFixed(2)}Cr`} />
            <KpiTile icon="📈" label="Avg Piece" value={`₹${Math.round(allRecords.reduce((a, r) => a + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>

          <Card className="rpg-health-grid">
            <CardHeader><CardTitle>Quality Compliance</CardTitle></CardHeader>
            <CardContent>
              <div className="flex justify-around">
                <HealthRing value={96} label="GI Tag" />
                <HealthRing value={92} label="IS 16794" />
                <HealthRing value={88} label="Fabric" />
                <HealthRing value={81} label="Truck" />
                <HealthRing value={90} label="Storage" />
                <HealthRing value={94} label="Pigment" />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Roghan Art Clusters" value="8 Villages" />
            <ValueTile label="Annual Production" value="3,500 Pieces" />
            <ValueTile label="Export Markets" value="18 Countries" />
            <ValueTile label="Heritage Age" value="300 Years" />
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

          <Card className="rpg-table-card">
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-rose-50">
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
                    <tr key={r.id} className="border-b hover:bg-rose-50/50">
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
            <Card className="rpg-insight"><CardHeader><CardTitle>Kutch Roghan Freehand Painting — 300 Years of Heritage Textile Art</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Roghan painting is a 300-year-old freehand fabric art tradition from Kutch, Gujarat, practiced exclusively by the Khatri Muslim community in Nirona village. The art form uses castor oil-based pigments hand-painted onto cotton or silk fabric without any brush, stencil, or printing equipment. Artisans prepare pigments by boiling castor oil for 12-14 hours until it thickens into a paste, then mix natural mineral and vegetable dyes — red from kermes insects, yellow from turmeric and pomegranate rind, blue from indigo, and black from iron filings — to create vivid non-fading colours. The signature technique involves painting one half of a design, then folding the fabric to transfer the mirror image, creating perfectly symmetrical Tree of Life, peacock, floral, and geometric motifs. Each piece takes 3-15 days depending on complexity. Recognised with GI tag in 2023, fewer than 15 master artisans remain active today, making authentic Roghan art among the rarest Indian textile crafts.</p></CardContent></Card>
            <Card className="rpg-insight"><CardHeader><CardTitle>IS 16794 Fabric Paint Quality Standards for Hand-Painted Textile Art</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">IS 16794 establishes quality benchmarks for traditional hand-painted textile arts including Roghan fabric painting, covering substrate preparation, pigment adhesion, colour fastness, and finished product grading. Base fabric must be pre-washed cotton with thread count 120-180 per inch, pH 6.5-7.5 after scouring, and moisture regain below 8% before pigment application. Castor oil pigment binder must achieve minimum viscosity of 15,000 centipoise at 25 degrees Celsius to ensure proper fabric penetration without bleeding. Colour fastness requirements mandate Grade 4 minimum on ISO 105-B02 for light fastness, Grade 3-4 on ISO 105-C06 for wash fastness, and Grade 4 on ISO 105-X12 for rubbing fastness. Fabric Grade A certification requires no visible pigment bleeding after 30-minute water immersion test, uniform colour density across a 30cm by 30cm test swatch measured by spectrophotometer with Delta E below 3.0. Heavy metal content must comply with REACH limits — lead below 90 ppm, cadmium below 50 ppm, mercury below 25 ppm. Finished Roghan paintings undergo accelerated aging at 40 degrees Celsius, 80% relative humidity for 120 hours per IS 16794 Annexure D protocol.</p></CardContent></Card>
            <Card className="rpg-insight"><CardHeader><CardTitle>Cotton Fabric Flat Packaging &amp; Temperature-Controlled Transit Logistics</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Roghan paintings on cotton fabric require specialised flat-wrap packaging to prevent pigment cracking, oil migration, and moisture damage during 800-1,200 km surface transit from Kutch craft villages to Mumbai export terminals or Ahmedabad air cargo hubs. Each completed fabric panel is interleaved with acid-free tissue paper (pH 7.0-7.5, 40 GSM) to prevent pigment-to-fabric transfer when stacked. Flat packaging on rigid corrugated board (5-ply, E-flute 1.8mm) maintains fabric tension without creasing the delicate castor oil pigment surface. Palletised truck transit with insulated cargo bays maintains 20-28 degrees Celsius temperature range, critical because castor oil pigments soften above 35 degrees Celsius causing design deformation. Dry storage with relative humidity below 40% prevents cotton fabric from absorbing moisture that would dilute water-soluble natural dyes. Desiccant silica gel packs (200g per square metre of fabric) placed inside sealed polyethylene liners provide 72-hour moisture protection during monsoon transit. Gujarat's Kutch district logistics network handles approximately 3,500 Roghan shipments annually, with damage rates reduced from 12% to 2.5% under Gujarat State Handicrafts Corporation packaging protocols implemented since 2021, covering Nirona, Bhuj, and Mandvi craft clusters.</p></CardContent></Card>
            <Card className="rpg-insight"><CardHeader><CardTitle>AI Freehand Art Authentication &amp; Roghan Export Market Growth</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">AI-powered image analysis of Roghan freehand painting patterns enables quality authentication and export market expansion by detecting micro-level brushstroke variations unique to individual artisan families in Nirona and surrounding Kutch villages. Convolutional neural networks trained on 15,000 authenticated Roghan samples achieve 96% accuracy in distinguishing genuine hand-painted Roghan from machine-printed reproductions by analysing castor oil pigment thickness variations, fold-transfer symmetry precision, and natural dye spectral signatures invisible to the naked eye. Computer vision systems measure design symmetry deviation within 0.3mm tolerance, verifying the traditional half-painting fold-transfer technique that defines authentic Roghan craft. India's Roghan art export revenue grew 180% from Rs 8 crore in 2019 to Rs 22 crore in 2025, targeting Rs 50 crore by 2028 driven by international gallery demand across 18 countries including USA, UK, Japan, France, and Australia. Blockchain-based provenance tracking from castor oil pigment preparation through fabric painting, GI certification, and shipping documentation combats reproduction fraud estimated at Rs 3.5 crore annually, with each authenticated piece carrying a unique QR-linked digital certificate on the Gujarat Handicrafts Registry.</p></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
