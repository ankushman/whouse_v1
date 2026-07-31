import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#7c2d12', '#9a3412', '#7f1d1d', '#451a03', '#b45309', '#a16207', '#854d0e', '#fef3c7']
const PRODUCTS = ['Ladakh Thangka Wheel of Life', 'Leh Shakyamuni Buddha Panel', 'Hemis Monastery Green Tara', 'Ladakh Kalachakra Mandala', 'Thiksay Monastery Medicine Buddha', 'Ladakh Yamantaka Wrathful Deity', 'Leh Avalokiteshvara Chenrezig', 'Diskit Monastery Mahakala Thangka']
const ARTISANS = ['Leh Thangka Painting Guild', 'Hemis Monastery Art Studio', 'Thiksay Monastery Atelier', 'Diskit Nubra Art Collective', 'Lamayuru Heritage Painters', 'Stok Palace Thangka Workshop', 'Shey Monastery Art Society', 'Alchi Choskor Art Centre']
const STATUSES = ['GI Ladakh Thangka Mark', 'IS 16987 Thangka Art Grade A', 'Silk Brocade Mount QC', 'Barrel Roll Canvas Transit', 'Monastery Storage 15-22C', 'Mineral Pigment Fidelity QC']

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
    id: `TKA-${String(offset + i + 1).padStart(4, '0')}`,
    painter: ARTISANS[(offset + i) % ARTISANS.length], ware: PRODUCTS[(offset + i) % PRODUCTS.length],
    status: STATUSES[(offset + i) % STATUSES.length], qty: ri(1, 30, ((offset + i) * 29) % 30) + 1,
    cost: ri(8000, 95000, ((offset + i) * 13721) % 87000) + 8000,
    date: new Date(2024, ((offset + i) % 12), ri(1, 28, (offset + i) % 28)).toISOString().slice(0, 10),
  }))



const thangkaRecords = [
  { id: 'TKA-0001', painter: 'Leh Thangka Painting Guild', ware: 'Ladakh Thangka Wheel of Life', status: 'GI Ladakh Thangka Mark', qty: 2, cost: 88000, date: '2024-01-08' },
  { id: 'TKA-0002', painter: 'Hemis Monastery Art Studio', ware: 'Leh Shakyamuni Buddha Panel', status: 'IS 16987 Thangka Art Grade A', qty: 3, cost: 72000, date: '2024-01-22' },
  { id: 'TKA-0003', painter: 'Thiksay Monastery Atelier', ware: 'Hemis Monastery Green Tara', status: 'Silk Brocade Mount QC', qty: 4, cost: 65000, date: '2024-02-05' },
  { id: 'TKA-0004', painter: 'Diskit Nubra Art Collective', ware: 'Ladakh Kalachakra Mandala', status: 'Barrel Roll Canvas Transit', qty: 2, cost: 92000, date: '2024-02-18' },
  { id: 'TKA-0005', painter: 'Lamayuru Heritage Painters', ware: 'Thiksay Monastery Medicine Buddha', status: 'Monastery Storage 15-22C', qty: 5, cost: 45000, date: '2024-03-02' },
  { id: 'TKA-0006', painter: 'Stok Palace Thangka Workshop', ware: 'Ladakh Yamantaka Wrathful Deity', status: 'Mineral Pigment Fidelity QC', qty: 3, cost: 78000, date: '2024-03-15' },
  { id: 'TKA-0007', painter: 'Shey Monastery Art Society', ware: 'Leh Avalokiteshvara Chenrezig', status: 'GI Ladakh Thangka Mark', qty: 4, cost: 55000, date: '2024-03-28' },
  { id: 'TKA-0008', painter: 'Alchi Choskor Art Centre', ware: 'Diskit Monastery Mahakala Thangka', status: 'IS 16987 Thangka Art Grade A', qty: 6, cost: 32000, date: '2024-04-10' },
  { id: 'TKA-0009', painter: 'Leh Thangka Painting Guild', ware: 'Hemis Monastery Green Tara', status: 'Silk Brocade Mount QC', qty: 2, cost: 85000, date: '2024-04-22' },
  { id: 'TKA-0010', painter: 'Hemis Monastery Art Studio', ware: 'Ladakh Thangka Wheel of Life', status: 'Barrel Roll Canvas Transit', qty: 3, cost: 68000, date: '2024-05-05' },
  { id: 'TKA-0011', painter: 'Thiksay Monastery Atelier', ware: 'Leh Shakyamuni Buddha Panel', status: 'Monastery Storage 15-22C', qty: 4, cost: 48000, date: '2024-05-18' },
  { id: 'TKA-0012', painter: 'Diskit Nubra Art Collective', ware: 'Ladakh Kalachakra Mandala', status: 'Mineral Pigment Fidelity QC', qty: 2, cost: 95000, date: '2024-05-30' },
  { id: 'TKA-0013', painter: 'Lamayuru Heritage Painters', ware: 'Thiksay Monastery Medicine Buddha', status: 'GI Ladakh Thangka Mark', qty: 5, cost: 38000, date: '2024-06-12' },
  { id: 'TKA-0014', painter: 'Stok Palace Thangka Workshop', ware: 'Ladakh Yamantaka Wrathful Deity', status: 'IS 16987 Thangka Art Grade A', qty: 3, cost: 74000, date: '2024-06-24' },
  { id: 'TKA-0015', painter: 'Shey Monastery Art Society', ware: 'Leh Avalokiteshvara Chenrezig', status: 'Silk Brocade Mount QC', qty: 4, cost: 52000, date: '2024-07-06' },
  { id: 'TKA-0016', painter: 'Alchi Choskor Art Centre', ware: 'Diskit Monastery Mahakala Thangka', status: 'Barrel Roll Canvas Transit', qty: 6, cost: 28000, date: '2024-07-18' },
  { id: 'TKA-0017', painter: 'Leh Thangka Painting Guild', ware: 'Ladakh Thangka Wheel of Life', status: 'Monastery Storage 15-22C', qty: 2, cost: 90000, date: '2024-07-30' },
  { id: 'TKA-0018', painter: 'Hemis Monastery Art Studio', ware: 'Leh Shakyamuni Buddha Panel', status: 'Mineral Pigment Fidelity QC', qty: 3, cost: 62000, date: '2024-08-10' },
  { id: 'TKA-0019', painter: 'Thiksay Monastery Atelier', ware: 'Hemis Monastery Green Tara', status: 'GI Ladakh Thangka Mark', qty: 4, cost: 50000, date: '2024-08-22' },
  { id: 'TKA-0020', painter: 'Diskit Nubra Art Collective', ware: 'Ladakh Kalachakra Mandala', status: 'IS 16987 Thangka Art Grade A', qty: 2, cost: 82000, date: '2024-09-03' },
]

export default function ThangkaPaintingLadakhLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = [...thangkaRecords, ...genRecords(21), ...genRecords(41)]



  const filteredRecords = useMemo(() => {
    if (!searchQuery && Object.keys(activeFilters).every(k => !activeFilters[k].length)) return allRecords
    const sq = searchQuery.toLowerCase()
    return allRecords.filter(r => { if (sq && !r.id.toLowerCase().includes(sq) && !r.ware.toLowerCase().includes(sq)) return false; return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string)); })
  }, [searchQuery, activeFilters, allRecords])

  const filterGroups = [
    { key: 'ware', label: 'Ware', options: PRODUCTS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.ware === p).length })) },
    { key: 'painter', label: 'Painter', options: ARTISANS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.painter === p).length })) },
  ]

  const trendData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m, i) => ({ month: m, shipments: ri(5, 28, allRecords.length * 0.13 + i * 3) }))
  const artisanChart = ARTISANS.map(p => ({ name: p.split(' ').slice(0, 2).join(' '), volume: allRecords.filter(r => r.painter === p).reduce((s, r) => s + r.qty, 0) }))
  const statusPie = STATUSES.map(s => ({ name: s, value: allRecords.filter(r => r.status === s).length }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="tka-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Thangka Painting Ladakh' }]} />
      <PageHeader title="Thangka Painting Ladakh Logistics" description="Ladakh Buddhist Thangka scroll painting supply chain with IS 16987 certification, mineral pigment fidelity QC, silk brocade mount framing, and GI Ladakh Thangka Mark across 8 monastery art ateliers in Leh, Hemis, and Diskit" />
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
            <KpiTile label="Monastery Ateliers" value={ARTISANS.length} />
            <KpiTile label="Avg Cost" value={`₹${Math.round(allRecords.reduce((s, r) => s + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>
          <div className="grid grid-cols-6 gap-4">
            <HealthRing label="GI Tag" value={96} />
            <HealthRing label="IS 16987" value={91} />
            <HealthRing label="Brocade" value={87} />
            <HealthRing label="Barrel" value={82} />
            <HealthRing label="Monastery" value={89} />
            <HealthRing label="Pigment" value={93} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Monasteries" value="12 Active" />
            <ValueTile label="Tradition" value="Since 11th C" />
            <ValueTile label="Export Markets" value="6 Countries" />
            <ValueTile label="Annual Revenue" value="₹2.4 Crore" />
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
            placeholder="Search Thangka painting shipments..."
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
                    <td className="p-3">{record.qty} {['pcs', 'sets', 'panels', 'scrolls'][parseInt(record.id.slice(4)) % 4]}</td>
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
              <CardHeader><CardTitle>Ladakh Thangka — Millennial Tibetan Buddhist Sacred Painting Tradition</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">Ladakh Thangka painting represents one of the most sacred and technically demanding artistic traditions in the Himalayan Buddhist world, having been continuously practised for over a millennium within the monastery art ateliers of Ladakh where master painters trained in the Tibetan Buddhist canonical painting traditions create intricate devotional scroll paintings depicting Buddhist deities, mandala cosmological diagrams, and narrative scenes from the life of the historical Buddha Shakyamuni using a sophisticated technique of applying successive layers of mineral pigments derived from precious and semi-precious stones including lapis lazuli blue from the Afghan Badakhshan mines for the celestial blue passages representing the sky and water elements, malachite green from copper carbonate minerals for the verdant vegetation zones surrounding the divine figures, cinnabar red from mercury sulphide ore for the auspicious red passages symbolising spiritual power and transformation, and gold leaf applied through the meticulous fire-gilding technique where 24-karat gold is pounded into microscopically thin sheets and applied to the crown ornaments, aureole halos, and throne back elements of the principal deity figures creating the luminous golden highlights that distinguish authentic Ladakh Thangka paintings from the printed reproductions and commercially produced imitation paintings that have increasingly appeared in tourist markets along the Leh-Srinagar highway and online retail platforms serving the growing international demand for Tibetan Buddhist sacred art objects. The Thangka painting tradition was introduced to Ladakh during the early diffusion of Tibetan Buddhism in the tenth and eleventh centuries CE through the cultural missions of the great Tibetan lotsawa translators who travelled between Central Tibet and the western Himalayan kingdoms of Ladakh, Lahaul, and Spiti establishing the monastic artistic canons that continue to define the visual vocabulary of Ladakh Thangka painting today across the twelve active monastery art ateliers operating in the Leh district where approximately forty-five monks and lay painters maintain this irreplaceable cultural heritage tradition under the guidance of senior lamas who ensure strict adherence to the canonical iconometric proportions specified in the Tibetan Buddhist artistic treatise known as the Tshigub or Collection of All Knowledge which defines the precise geometric ratios governing the body proportions, hand gestures or mudras, throne back ornamentation, aureole dimensions, and surrounding mandala palace architecture that must be followed with mathematical precision to produce a Thangka painting that meets the ritual requirements for consecration and ceremonial use within the Ladakhi Buddhist monastic liturgical calendar.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>IS 16987 Thangka Art Standards & Mineral Pigment Fidelity QC</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The IS 16987 standard for Thangka art establishes India's first comprehensive quality certification framework specifically designed for the Tibetan Buddhist Thangka painting tradition as practised in the Ladakh region, specifying detailed requirements for mineral pigment composition and sourcing authentication, cotton canvas fabric substrate preparation and sizing parameters, iconometric proportion accuracy verification against the Tibetan Buddhist Tshigub canonical proportions, gold leaf application technique verification, and silk brocade mount framing quality that collectively distinguish authentic Ladakh Thangka paintings created within the monastery art atelier tradition from machine-printed reproductions and commercially manufactured imitation paintings produced for the tourist souvenir market that lack the mineral pigment depth, gold leaf luminosity, and canonical iconometric accuracy that define ritual-grade Thangka paintings suitable for monastic consecration and ceremonial use. The mineral pigment composition requirements for IS 16987 Grade A certification mandate exclusively naturally derived mineral pigments including lapis lazuli ultramarine blue with minimum colour saturation measured through CIELAB chroma values exceeding 45 units verified through portable X-ray fluorescence spectroscopy confirming the presence of characteristic elemental markers including calcium and sulphur from the lazurite mineral structure at concentrations consistent with natural lapis lazuli rather than synthetic ultramarine blue manufactured from sodium aluminosilicate, malachite green with minimum copper carbonate content of 65% verified through energy-dispersive X-ray spectroscopy confirming the crystalline morphology characteristic of natural malachite mineral pigment rather than synthetic phthalocyanine green organic pigment, cinnabar red with minimum mercury sulphide content of 85% verified through Raman spectroscopy confirming the characteristic vibrational modes of natural cinnabar crystal structure at 252 and 343 reciprocal centimetres distinguishing natural cinnabar from synthetic cadmium red pigment, and 24-karat gold leaf with minimum purity of 99.5% verified through inductively coupled plasma mass spectrometry confirming the absence of base metal adulterants including copper, silver, and nickel that would indicate commercially manufactured gold leaf produced for non-artistic industrial applications rather than the hand-beaten artisan gold leaf produced specifically for Thangka painting applications in the traditional metalworking workshops of Leh and Srinagar where gold is beaten to a thickness of approximately one micrometre for application to the crown ornaments and aureole halos of the principal deity figures in Ladakh Thangka paintings.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Silk Brocade Mount & Barrel Roll Canvas Transit for Thangka Paintings</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">Silk brocade mount framing with barrel roll canvas packaging has been specifically developed for the Ladakh Thangka painting logistics supply chain to protect the delicate mineral pigment surfaces, gold leaf ornamentation, and cotton canvas substrates that characterise authentic Ladakh Thangka paintings from the extreme environmental conditions encountered during transit from the high-altitude monastery production centres at elevations exceeding 3,500 metres above sea level in the Leh and Ladakh districts to domestic gallery and museum destinations across New Delhi, Mumbai, Dharamshala, and Varanasi, and international export destinations serving the global Tibetan Buddhist art collector community in the United States, Europe, Taiwan, and Japan where significant institutional and private collections of Tibetan Buddhist sacred art actively seek authenticated Ladakh Thangka paintings for acquisition, exhibition, and ritual consecration purposes that require museum-quality preservation conditions during international shipping through multiple climatic zones ranging from the extreme cold and low humidity of the Ladakhi Himalayan plateau to the tropical heat and high humidity of the Indian subcontinent monsoon belt and the controlled climate of international cargo aircraft. The silk brocade mount framing specification utilises hand-woven Varanasi silk brocade fabric with minimum grammage of 120 GSM and supplementary gold zari thread content of 15% by weight as the primary mounting material providing a luxurious protective border that frames the Thangka painting while allowing the cotton canvas substrate to expand and contract with humidity changes without developing wrinkles or tension distortions that could damage the mineral pigment layers, with the brocade mount constructed in the traditional Tibetan Buddhist yellow-door style where a central rectangular brocade border in auspicious yellow frames the painted image area with red and blue secondary borders representing the rainbow aura of enlightened wisdom that surrounds the Buddhist deity figures depicted within the Thangka composition. Each completed Thangka painting with its silk brocade mount is carefully rolled around a custom-cut seasoned cedar wood dowel with the painted surface facing inward protected by acid-free tissue paper interleave, then placed within a moisture-barrier polyethylene tube liner and secured within a rigid outer shipping container constructed from 6-millimetre double-wall corrugated fibreboard with internal cushioning of closed-cell polyethylene foam at all contact points providing comprehensive protection against the temperature fluctuations from minus 30 degrees Celsius at the Ladakh monastery production sites to plus 40 degrees Celsius at the Indian plains distribution hubs, atmospheric pressure changes during air cargo transit at altitudes exceeding 10,000 metres, and mechanical vibration and impact forces encountered during road transport along the Leh-Manali highway and the Srinagar-Leh road that connect the remote Ladakhi monastery art ateliers to the national transport network.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>AI Pigment Analysis & Ladakh Thangka Heritage Market Expansion</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">Artificial intelligence and spectral imaging technologies are being progressively deployed to authenticate Ladakh Thangka paintings and verify the distinctive mineral pigment compositions, gold leaf application signatures, and Tibetan Buddhist iconometric proportions that distinguish genuine monastery-atelier Thangka paintings from the growing volume of machine-printed reproductions and commercially manufactured imitation paintings that have increasingly appeared in both the Ladakh tourist market along the Leh main bazaar and international online retail platforms serving the global demand for Tibetan Buddhist sacred art objects. The AI authentication system for Ladakh Thangka employs ultra-high-resolution scanning at 600 dots per inch combined with visible-induced luminescence imaging and infrared reflectography across the 750 to 2500 nanometre spectral range to capture the complete pigment layer stratigraphy and underdrawing carbon sketch structure beneath the visible mineral pigment surface of finished Thangka paintings, analysing the mineral pigment spectral signatures characteristic of the traditional Ladakhi atelier palette including the lapis lazuli ultramarine blue absorption bands at 380 and 600 nanometres that distinguish natural Afghan lapis lazuli from synthetic ultramarine blue, the malachite green reflectance peak at 540 nanometres characteristic of natural copper carbonate mineral pigment, the cinnabar red reflectance spectrum with characteristic mercury sulphide absorption features that distinguish natural cinnabar from synthetic cadmium red and organic azo red pigments, and the gold leaf surface reflectance pattern with characteristic specular highlight distribution that distinguishes hand-beaten 24-karat artisan gold leaf from machine-rolled commercial gold leaf produced for industrial gilding applications. Machine learning algorithms trained on authenticated Ladakh Thangka reference samples from all twelve active monastery ateliers can verify painting authenticity with 94% accuracy by detecting subtle artisan signatures including the mineral pigment particle size distribution patterns characteristic of hand-ground natural pigments where each colour requires between eight and twelve hours of hand-grinding on a stone slab to achieve the fine particle size necessary for smooth pigment application on the cotton canvas substrate, the gold leaf application density and coverage uniformity patterns that reflect the individual hand application technique of each monastery-trained painter where the gold leaf is breathed onto the painted surface using a technique requiring years of practice to achieve the characteristic even coverage without overlap gaps or wrinkle formations that distinguish master-level gold leaf application from the less precise application found on commercially produced imitation Thangka paintings, and the iconometric proportion accuracy within the established Tibetan Buddhist Tshigub canons that define the precise geometric relationships between the deity body proportions, throne architecture, aureole dimensions, mandala palace structure, and surrounding landscape elements according to the specific visual vocabulary maintained across the Ladakh monastery art atelier tradition where this combination of mineral pigment mastery, gold leaf artistry, and canonical iconometric precision continues to sustain one of the Himalayan region's most technically demanding and spiritually significant sacred art traditions.</p></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
