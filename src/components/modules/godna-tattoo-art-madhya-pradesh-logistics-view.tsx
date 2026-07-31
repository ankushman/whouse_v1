import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#b45309', '#92400e', '#78350f', '#451a03', '#d97706', '#713f12', '#422006', '#fef3c7']
const PRODUCTS = ['Godna Tree of Life Panel', 'MP Godna Peacock Motif Canvas', 'Godna Sacred Scorpion Design', 'MP Godna Fish Pond Mural', 'Godna Sun Moon Celestial Art', 'Godna Cobra Serpent Panel', 'MP Godna Floral Vine Scroll', 'Godna Ritual Circle Mandala']
const ARTISANS = ['Jhabua Godna Artisan Collective', 'Mandla Tribal Tattoo Society', 'Dhar Godna Heritage Guild', 'Barwani Body Art Cooperative', 'Khandwa Godna Painters Colony', 'Alirajpur Tribal Art Studio', 'Khargone Godna Craft Centre', 'Burhanpur Godna Tradition Society']
const STATUSES = ['GI Godna Art Mark', 'IS 15925 Tattoo Art Grade A', 'Canvas Roll Flat Pack', 'Enclosed Truck Transit', 'Dry Storage 15-25C', 'Natural Pigment QC']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-amber-100 text-amber-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="w-24 h-2 bg-amber-200 rounded-full overflow-hidden"><div className="h-full bg-amber-700 rounded-full" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ label, value, size = 80 }: { label: string; value: number; size?: number }) => {
  const r = (size - 12) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#fef3c7" strokeWidth="6" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={COLORS[0]} strokeWidth="6" strokeDasharray={`${c}`} strokeDashoffset={c - (value / 100) * c} strokeLinecap="round" />
      </svg>
      <span className="text-xs font-medium" style={{ color: COLORS[0] }}>{label} {value}%</span>
    </div>
  )
}

const KpiTile = ({ label, value }: { label: string; value: string | number }) => (
  <Card className="p-4"><p className="text-sm text-muted-foreground">{label}</p><p className="text-2xl font-bold mt-1">{value}</p></Card>
)

const ValueTile = ({ label, value }: { label: string; value: string }) => (
  <Card className="p-4 border-l-4" style={{ borderLeftColor: COLORS[1] }}><p className="text-sm text-muted-foreground">{label}</p><p className="text-lg font-semibold mt-1" style={{ color: COLORS[1] }}>{value}</p></Card>
)

const genRecords = (offset: number) =>
  Array.from({ length: 20 }, (_, i) => ({
    id: `GDA-${String(offset + i + 1).padStart(4, '0')}`,
    painter: ARTISANS[(offset + i) % ARTISANS.length], ware: PRODUCTS[(offset + i) % PRODUCTS.length],
    status: STATUSES[(offset + i) % STATUSES.length], qty: ri(1, 35, ((offset + i) * 31) % 35) + 1,
    cost: ri(5000, 98000, ((offset + i) * 14173) % 93000) + 5000,
    date: new Date(2024, ((offset + i) % 12), ri(1, 28, (offset + i) % 28)).toISOString().slice(0, 10),
  }))

const godnaRecords = [
  { id: 'GDA-0001', painter: 'Jhabua Godna Artisan Collective', ware: 'Godna Tree of Life Panel', status: 'GI Godna Art Mark', qty: 5, cost: 45000, date: '2024-01-12' },
  { id: 'GDA-0002', painter: 'Mandla Tribal Tattoo Society', ware: 'MP Godna Peacock Motif Canvas', status: 'IS 15925 Tattoo Art Grade A', qty: 7, cost: 38000, date: '2024-01-25' },
  { id: 'GDA-0003', painter: 'Dhar Godna Heritage Guild', ware: 'Godna Sacred Scorpion Design', status: 'Canvas Roll Flat Pack', qty: 4, cost: 62000, date: '2024-02-08' },
  { id: 'GDA-0004', painter: 'Barwani Body Art Cooperative', ware: 'MP Godna Fish Pond Mural', status: 'Enclosed Truck Transit', qty: 8, cost: 28000, date: '2024-02-20' },
  { id: 'GDA-0005', painter: 'Khandwa Godna Painters Colony', ware: 'Godna Sun Moon Celestial Art', status: 'Dry Storage 15-25C', qty: 3, cost: 72000, date: '2024-03-05' },
  { id: 'GDA-0006', painter: 'Alirajpur Tribal Art Studio', ware: 'Godna Cobra Serpent Panel', status: 'Natural Pigment QC', qty: 6, cost: 48000, date: '2024-03-18' },
  { id: 'GDA-0007', painter: 'Khargone Godna Craft Centre', ware: 'MP Godna Floral Vine Scroll', status: 'GI Godna Art Mark', qty: 4, cost: 68000, date: '2024-03-30' },
  { id: 'GDA-0008', painter: 'Burhanpur Godna Tradition Society', ware: 'Godna Ritual Circle Mandala', status: 'IS 15925 Tattoo Art Grade A', qty: 9, cost: 24000, date: '2024-04-12' },
  { id: 'GDA-0009', painter: 'Jhabua Godna Artisan Collective', ware: 'MP Godna Peacock Motif Canvas', status: 'Canvas Roll Flat Pack', qty: 5, cost: 52000, date: '2024-04-24' },
  { id: 'GDA-0010', painter: 'Mandla Tribal Tattoo Society', ware: 'Godna Tree of Life Panel', status: 'Enclosed Truck Transit', qty: 7, cost: 36000, date: '2024-05-06' },
  { id: 'GDA-0011', painter: 'Dhar Godna Heritage Guild', ware: 'Godna Sacred Scorpion Design', status: 'Dry Storage 15-25C', qty: 4, cost: 65000, date: '2024-05-18' },
  { id: 'GDA-0012', painter: 'Barwani Body Art Cooperative', ware: 'MP Godna Fish Pond Mural', status: 'Natural Pigment QC', qty: 6, cost: 42000, date: '2024-05-30' },
  { id: 'GDA-0013', painter: 'Khandwa Godna Painters Colony', ware: 'Godna Sun Moon Celestial Art', status: 'GI Godna Art Mark', qty: 8, cost: 30000, date: '2024-06-12' },
  { id: 'GDA-0014', painter: 'Alirajpur Tribal Art Studio', ware: 'Godna Cobra Serpent Panel', status: 'IS 15925 Tattoo Art Grade A', qty: 3, cost: 75000, date: '2024-06-24' },
  { id: 'GDA-0015', painter: 'Khargone Godna Craft Centre', ware: 'MP Godna Floral Vine Scroll', status: 'Canvas Roll Flat Pack', qty: 10, cost: 22000, date: '2024-07-06' },
  { id: 'GDA-0016', painter: 'Burhanpur Godna Tradition Society', ware: 'Godna Ritual Circle Mandala', status: 'Enclosed Truck Transit', qty: 5, cost: 58000, date: '2024-07-18' },
  { id: 'GDA-0017', painter: 'Jhabua Godna Artisan Collective', ware: 'MP Godna Fish Pond Mural', status: 'Dry Storage 15-25C', qty: 4, cost: 70000, date: '2024-07-30' },
  { id: 'GDA-0018', painter: 'Mandla Tribal Tattoo Society', ware: 'Godna Tree of Life Panel', status: 'Natural Pigment QC', qty: 7, cost: 35000, date: '2024-08-10' },
  { id: 'GDA-0019', painter: 'Dhar Godna Heritage Guild', ware: 'MP Godna Peacock Motif Canvas', status: 'GI Godna Art Mark', qty: 6, cost: 48000, date: '2024-08-22' },
  { id: 'GDA-0020', painter: 'Barwani Body Art Cooperative', ware: 'Godna Sacred Scorpion Design', status: 'IS 15925 Tattoo Art Grade A', qty: 5, cost: 56000, date: '2024-09-03' },
]

export default function GodnaTattooArtMadhyaPradeshLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = [...godnaRecords, ...genRecords(21), ...genRecords(41)]

  const filteredRecords = useMemo(() => {
    if (!searchQuery && Object.keys(activeFilters).every(k => !activeFilters[k].length)) return allRecords
    const sq = searchQuery.toLowerCase()
    return allRecords.filter(r => { if (sq && !r.id.toLowerCase().includes(sq) && !r.ware.toLowerCase().includes(sq)) return false; return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string)); })
  }, [searchQuery, activeFilters, allRecords])

  const filterGroups = [
    { key: 'ware', label: 'Ware', options: PRODUCTS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.ware === p).length })) },
    { key: 'painter', label: 'Painter', options: ARTISANS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.painter === p).length })) },
  ]

  const trendData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m, i) => ({ month: m, shipments: ri(5, 30, allRecords.length * 0.14 + i * 4) }))
  const artisanChart = ARTISANS.map(p => ({ name: p.split(' ').slice(0, 2).join(' '), volume: allRecords.filter(r => r.painter === p).reduce((s, r) => s + r.qty, 0) }))
  const statusPie = STATUSES.map(s => ({ name: s, value: allRecords.filter(r => r.status === s).length }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="gda-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Godna Tattoo Art MP' }]} />
      <PageHeader title="Godna Tattoo Art Madhya Pradesh Logistics" description="Godna tribal tattoo art supply chain with IS 15925 tattoo art compliance, natural pigment fidelity QC, canvas roll flat pack packaging, and GI Godna Art Mark certification across 8 heritage artisan clusters in Jhabua, Mandla, and Dhar districts" />
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="bg-amber-100">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <KpiTile label="Total Shipments" value={allRecords.length} />
            <KpiTile label="Active Ware" value={PRODUCTS.length} />
            <KpiTile label="Artisan Clusters" value={ARTISANS.length} />
            <KpiTile label="Avg Cost" value={`₹${Math.round(allRecords.reduce((s, r) => s + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>
          <div className="grid grid-cols-6 gap-4">
            <HealthRing label="GI Tag" value={92} />
            <HealthRing label="IS 15925" value={88} />
            <HealthRing label="Canvas" value={85} />
            <HealthRing label="Truck" value={82} />
            <HealthRing label="Dry Store" value={90} />
            <HealthRing label="Pigment QC" value={94} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Artisan Families" value="35+" />
            <ValueTile label="Godna Tradition" value="Since 14th C" />
            <ValueTile label="Export Markets" value="7 Countries" />
            <ValueTile label="Annual Revenue" value="₹2.8 Crore" />
          </div>
        </TabsContent>
        <TabsContent value="shipments" className="space-y-6">
          <SearchFilterToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onClearSearch={() => setSearchQuery('')}
            activeFilters={activeFilters}
            filterGroups={filterGroups}
            onToggleFilter={(group, val) => setActiveFilters(prev => ({ ...prev, [group]: prev[group]?.includes(val) ? prev[group].filter(v => v !== val) : [...(prev[group] || []), val] }))}
            onClearAllFilters={() => setActiveFilters({})}
            totalItems={allRecords.length}
            filteredCount={filteredRecords.length}
            onRefresh={() => {}}
            placeholder="Search Godna tattoo art shipments..."
          />
          <div className="rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-amber-100">
                <tr>
                  <th className="p-3 text-left font-medium">ID</th>
                  <th className="p-3 text-left font-medium">Ware</th>
                  <th className="p-3 text-left font-medium">Painter</th>
                  <th className="p-3 text-left font-medium">Status</th>
                  <th className="p-3 text-left font-medium">Qty</th>
                  <th className="p-3 text-left font-medium">Cost</th>
                  <th className="p-3 text-left font-medium">Cost Bar</th>
                  <th className="p-3 text-left font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map(record => (
                  <tr key={record.id} className="border-t hover:bg-amber-50/50">
                    <td className="p-3 font-mono text-xs">{record.id}</td>
                    <td className="p-3"><ProductBadge name={record.ware} /></td>
                    <td className="p-3">{record.painter}</td>
                    <td className="p-3"><StatusBadge status={record.status} /></td>
                    <td className="p-3">{record.qty} {['pcs', 'sets', 'pairs', 'units'][parseInt(record.id.slice(4)) % 4]}</td>
                    <td className="p-3 font-mono">₹{record.cost.toLocaleString()}</td>
                    <td className="p-3"><CostBar cost={record.cost} max={maxCost} /></td>
                    <td className="p-3">{record.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle>Shipment Trend</CardTitle></CardHeader>
              <CardContent>
                <LineChart width={500} height={300} data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="shipments" stroke={COLORS[0]} strokeWidth={2} />
                </LineChart>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Artisan Volume</CardTitle></CardHeader>
              <CardContent>
                <BarChart width={500} height={300} data={artisanChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="volume" fill={COLORS[0]}>
                    {artisanChart.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader><CardTitle>Status Distribution</CardTitle></CardHeader>
            <CardContent>
              <PieChart width={500} height={300}>
                <Pie data={statusPie} cx="50%" cy="50%" outerRadius={100} dataKey="value" label>
                  {statusPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle>Godna Tattoo Art — 700-Year Madhya Pradesh Tribal Body Art Tradition</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Godna is a deeply significant tribal tattoo art tradition originating from the Bhil, Gond, and Baiga tribal communities of Madhya Pradesh that has been practised for over seven centuries as both a permanent body adornment practice and a textile art form where the distinctive Godna tattoo motifs are transposed from human skin onto canvas and fabric surfaces for commercial and cultural preservation purposes, creating a unique bridge between the intimate tribal body art tradition and the broader contemporary art market that enables the tribal artisan communities of Jhabua, Mandla, Dhar, Barwani, and Alirajpur districts to sustain their cultural heritage through economic livelihood generation from the sale of Godna motif art panels, textile hangings, and decorative objects that carry the authentic visual vocabulary of the central Indian tribal tattooing tradition. The Godna tattoo tradition within the Bhil tribal community serves as a living repository of tribal cosmology, spiritual beliefs, and social identity markers that are permanently inscribed onto the body through the traditional hand-tapped tattooing method where a sharpened bamboo stick or thorn needle is dipped into a paste made from carbonised soot mixed with mustard oil and local herbal extracts, then repeatedly tapped into the skin to deposit the pigment beneath the epidermal layer where it remains permanently visible as a dark blue-black design that carries specific cultural meanings related to the individual's tribal clan affiliation, spiritual guardian spirit connection, life stage transition markers including marriage readiness and maternal protection symbols, and decorative motifs drawn from the natural environment including the sacred Tree of Life representing the tribal understanding of cosmic interconnectedness between the earthly realm and the spirit world, the peacock symbolising beauty and divine grace within the tribal aesthetic tradition, the scorpion representing protective power and the ability to defend against evil spiritual forces, and the fish and water motifs representing fertility abundance and the life-sustaining power of the monsoon rivers and ponds that define the agricultural and spiritual landscape of the central Indian tribal heartland where the Godna tradition has been continuously maintained as an unbroken cultural practice for over seven hundred years across successive generations of tribal women who traditionally serve as both the practitioners and the primary recipients of Godna tattoo art within the community's matriarchal social structure where tattooing knowledge and technique is transmitted from grandmother to mother to daughter as a sacred familial inheritance.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>IS 15925 Tattoo Art Standards & Natural Pigment Fidelity QC</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">The IS 15925 standard for Godna tattoo art establishes India's first dedicated quality certification framework for the commercial transposition of tribal tattoo motifs onto canvas and textile substrates, specifying comprehensive requirements for natural pigment composition derived from traditional soot-and-oil formulations, hand-applied brush stroke technique verification, canvas fabric substrate quality parameters, colour fastness durability testing, and motif accuracy assessment that collectively distinguish authentic Godna art panels created by tribal artisans from machine-printed reproductions and mass-produced imitations that have increasingly appeared in both domestic Indian tribal art markets and international online retail platforms serving collectors and interior decorators seeking authentic Indian tribal art for exhibition and decorative purposes. The natural pigment composition requirements for IS 15925 Grade A certification mandate exclusively natural carbon-derived pigments sourced through the traditional soot carbonisation process where specific hardwood species including mahua, tendu, and sal are combusted under controlled oxygen-restricted conditions to produce fine carbon soot particles that are then mixed with cold-pressed mustard oil and traditional herbal binding agents extracted from locally available plant species to create the distinctive Godna pigment paste that produces characteristically deep blue-black line work on both skin and canvas surfaces, with spectrophotometric verification confirming natural carbon origin and excluding any synthetic black pigment formulations including carbon black industrial pigments, iron oxide black dispersions, and acrylic-based black inks that produce fundamentally different surface texture characteristics and spectral absorption profiles detectable through laboratory analysis comparing sample pigment crystalline structures against certified natural carbon pigment reference standards maintained in the IS 15925 standard appendix. Natural pigment fidelity verification for Grade A certification mandates accelerated light fastness testing through 300 hours of xenon arc exposure per ISO 105-B02 with maximum permitted colour change measured through CIELAB Delta E values not exceeding 5.0 units for the primary black pigment, ensuring the natural carbon-based pigments retain their original intensity and tonal depth under prolonged display conditions including the extended exhibition periods common in tribal art gallery environments and museum collections where Godna art panels remain exposed to continuous gallery illumination conditions that subject the painted surfaces to sustained thermal and photometric stress potentially degrading improperly formulated synthetic pigment reproductions.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Canvas Roll Flat Pack Packaging for Godna Tattoo Art Panels</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Canvas roll flat pack packaging has been specifically developed for the Godna tattoo art logistics supply chain to protect the hand-painted natural pigment surfaces, tribal motif compositions, and cotton canvas fabric substrates that characterise authentic Godna art panels from the physical and environmental hazards encountered during transit from the Madhya Pradesh tribal artisan workshops to domestic art gallery destinations across Bhopal, Delhi, and Mumbai, and international export destinations serving the global tribal art collector community in Europe, North America, and East Asia where significant institutional and private collections of Indian tribal art actively seek authenticated Godna art panels for acquisition and exhibition purposes that require museum-quality preservation during international shipping. The packaging specification utilises plain weave cotton canvas with minimum grammage of 120 GSM and pH range 6.5 to 7.5 as the primary substrate material for the Godna art panels themselves, with each completed panel inspected under standardised D65 daylight illumination verifying natural pigment surface integrity, tribal motif compositional accuracy, canvas fabric condition, and overall artistic quality before being interleaved with acid-free tissue paper between the painted surface and a protective muslin over-wrap layer, then rolled around a custom-cut acid-free cardboard tube with the painted surface facing outward to prevent pigment-to-pigment contact during rolled storage, secured with cotton tying tape at three equidistant points along the roll length, and placed within a rigid outer shipping container constructed from 5-millimetre double-wall corrugated fibreboard with internal cushioning strips of polyethylene foam at all four edges providing shock absorption protection against the impact and vibration forces encountered during road transport through Madhya Pradesh's highway networks connecting the tribal artisan production centres in Jhabua, Mandla, and Dhar districts to the major urban distribution hubs and subsequent air cargo transit to international destinations.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>AI Motif Authentication & Godna Tattoo Art Heritage Market Development</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Artificial intelligence and computational image analysis technologies are being progressively deployed to authenticate Godna tattoo art panels and verify the distinctive hand-painted brush stroke patterns, natural carbon pigment signatures, and tribal motif compositional elements that distinguish genuine Godna artworks created by Bhil, Gond, and Baiga tribal artisans from the growing volume of machine-printed reproductions and digitally copied imitations that have increasingly appeared in both domestic Indian tribal art markets and international online retail platforms serving the global demand for authentic Indian tribal art. The AI authentication system for Godna art employs ultra-high-resolution scanning at 4800 dots per inch combined with multispectral imaging across the visible and near-infrared spectrum from 400 to 900 nanometres wavelength range to capture the complete surface topography and pigment composition of finished Godna art panels, analysing the hand-painted brush stroke direction and pressure patterns characteristic of the tribal artisan's bamboo brush technique, natural carbon soot pigment particle distribution characteristics that differ fundamentally from the uniform pigment dispersion of synthetic printing inks, and the compositional proportion accuracy within the established Godna tribal motif canons that define the spatial arrangement of Tree of Life structures, peacock and scorpion figures, fish and water elements, and decorative border patterns according to the specific visual vocabulary of the Madhya Pradesh tribal tattooing tradition transmitted through generations of Bhil, Gond, and Baiga communities over seven centuries of continuous cultural practice in the central Indian tribal heartland. Machine learning algorithms trained on authenticated Godna reference samples can verify artwork authenticity with 94% accuracy by detecting subtle hand-painting signatures including the characteristic brush stroke width variation reflecting the tribal artisan's hand-eye coordination during bamboo brush application, the natural carbon pigment particle aggregation patterns visible through high-magnification imaging that differ fundamentally from machine-printed pigment deposition, and the motif proportion accuracy within the established Godna tribal art canons that define the spatial arrangement of sacred symbols, natural world motifs, and decorative elements according to the specific visual vocabulary of the Madhya Pradesh Godna tattoo art tradition as practised across approximately 35 active tribal artisan families in the Jhabua, Mandla, and Dhar production centres of Madhya Pradesh.</p></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
