import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#0f766e', '#115e59', '#134e4a', '#042f2e', '#14b8a6', '#0c4a42', '#05332d', '#ccfbf1']
const PRODUCTS = ['Patua Manasa Mangal Scroll', 'WB Patua Krishna Lila Panel', 'Patua Gazi Pir Narrative', 'Patua Chaitanya Devotion Scroll', 'WB Patua Ramayana Panel', 'Patua Kali Worship Canvas', 'Patua Folk Forest Scene', 'WB Patua Bengal Tiger Scroll']
const ARTISANS = ['Midnapore Patua Scroll Guild', 'Bankura Patua Art Society', 'Birbhum Scroll Painter Colony', 'Murshidabad Patua Cooperative', 'Howrah Patua Heritage Centre', 'Nadia Patua Narrative Studio', 'Hooghly Patua Craft Cluster', 'Purulia Patua Traditional Society']
const STATUSES = ['GI Patua Scroll Mark', 'IS 16018 Scroll Art Grade A', 'Kraft Paper Roll Flat Pack', 'Humidity-Controlled Transit', 'Dry Storage 20-28C', 'Natural Dye Binding QC']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-teal-100 text-teal-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="w-24 h-2 bg-teal-200 rounded-full overflow-hidden"><div className="h-full bg-teal-700 rounded-full" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ label, value, size = 80 }: { label: string; value: number; size?: number }) => {
  const r = (size - 12) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#ccfbf1" strokeWidth="6" />
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
    id: `PSA-${String(offset + i + 1).padStart(4, '0')}`,
    painter: ARTISANS[(offset + i) % ARTISANS.length], ware: PRODUCTS[(offset + i) % PRODUCTS.length],
    status: STATUSES[(offset + i) % STATUSES.length], qty: ri(1, 35, ((offset + i) * 31) % 35) + 1,
    cost: ri(5000, 98000, ((offset + i) * 14173) % 93000) + 5000,
    date: new Date(2024, ((offset + i) % 12), ri(1, 28, (offset + i) % 28)).toISOString().slice(0, 10),
  }))

const patuaRecords = [
  { id: 'PSA-0001', painter: 'Midnapore Patua Scroll Guild', ware: 'Patua Manasa Mangal Scroll', status: 'GI Patua Scroll Mark', qty: 5, cost: 45000, date: '2024-01-12' },
  { id: 'PSA-0002', painter: 'Bankura Patua Art Society', ware: 'WB Patua Krishna Lila Panel', status: 'IS 16018 Scroll Art Grade A', qty: 7, cost: 38000, date: '2024-01-25' },
  { id: 'PSA-0003', painter: 'Birbhum Scroll Painter Colony', ware: 'Patua Gazi Pir Narrative', status: 'Kraft Paper Roll Flat Pack', qty: 4, cost: 62000, date: '2024-02-08' },
  { id: 'PSA-0004', painter: 'Murshidabad Patua Cooperative', ware: 'Patua Chaitanya Devotion Scroll', status: 'Humidity-Controlled Transit', qty: 8, cost: 28000, date: '2024-02-20' },
  { id: 'PSA-0005', painter: 'Howrah Patua Heritage Centre', ware: 'WB Patua Ramayana Panel', status: 'Dry Storage 20-28C', qty: 3, cost: 72000, date: '2024-03-05' },
  { id: 'PSA-0006', painter: 'Nadia Patua Narrative Studio', ware: 'Patua Kali Worship Canvas', status: 'Natural Dye Binding QC', qty: 6, cost: 48000, date: '2024-03-18' },
  { id: 'PSA-0007', painter: 'Hooghly Patua Craft Cluster', ware: 'Patua Folk Forest Scene', status: 'GI Patua Scroll Mark', qty: 4, cost: 68000, date: '2024-03-30' },
  { id: 'PSA-0008', painter: 'Purulia Patua Traditional Society', ware: 'WB Patua Bengal Tiger Scroll', status: 'IS 16018 Scroll Art Grade A', qty: 9, cost: 24000, date: '2024-04-12' },
  { id: 'PSA-0009', painter: 'Midnapore Patua Scroll Guild', ware: 'WB Patua Krishna Lila Panel', status: 'Kraft Paper Roll Flat Pack', qty: 5, cost: 52000, date: '2024-04-24' },
  { id: 'PSA-0010', painter: 'Bankura Patua Art Society', ware: 'Patua Manasa Mangal Scroll', status: 'Humidity-Controlled Transit', qty: 7, cost: 36000, date: '2024-05-06' },
  { id: 'PSA-0011', painter: 'Birbhum Scroll Painter Colony', ware: 'Patua Gazi Pir Narrative', status: 'Dry Storage 20-28C', qty: 4, cost: 65000, date: '2024-05-18' },
  { id: 'PSA-0012', painter: 'Murshidabad Patua Cooperative', ware: 'Patua Chaitanya Devotion Scroll', status: 'Natural Dye Binding QC', qty: 6, cost: 42000, date: '2024-05-30' },
  { id: 'PSA-0013', painter: 'Howrah Patua Heritage Centre', ware: 'WB Patua Ramayana Panel', status: 'GI Patua Scroll Mark', qty: 8, cost: 30000, date: '2024-06-12' },
  { id: 'PSA-0014', painter: 'Nadia Patua Narrative Studio', ware: 'Patua Kali Worship Canvas', status: 'IS 16018 Scroll Art Grade A', qty: 3, cost: 75000, date: '2024-06-24' },
  { id: 'PSA-0015', painter: 'Hooghly Patua Craft Cluster', ware: 'Patua Folk Forest Scene', status: 'Kraft Paper Roll Flat Pack', qty: 10, cost: 22000, date: '2024-07-06' },
  { id: 'PSA-0016', painter: 'Purulia Patua Traditional Society', ware: 'WB Patua Bengal Tiger Scroll', status: 'Humidity-Controlled Transit', qty: 5, cost: 58000, date: '2024-07-18' },
  { id: 'PSA-0017', painter: 'Midnapore Patua Scroll Guild', ware: 'Patua Chaitanya Devotion Scroll', status: 'Dry Storage 20-28C', qty: 4, cost: 70000, date: '2024-07-30' },
  { id: 'PSA-0018', painter: 'Bankura Patua Art Society', ware: 'Patua Manasa Mangal Scroll', status: 'Natural Dye Binding QC', qty: 7, cost: 35000, date: '2024-08-10' },
  { id: 'PSA-0019', painter: 'Birbhum Scroll Painter Colony', ware: 'WB Patua Krishna Lila Panel', status: 'GI Patua Scroll Mark', qty: 6, cost: 48000, date: '2024-08-22' },
  { id: 'PSA-0020', painter: 'Murshidabad Patua Cooperative', ware: 'Patua Gazi Pir Narrative', status: 'IS 16018 Scroll Art Grade A', qty: 5, cost: 56000, date: '2024-09-03' },
]

export default function PatuaScrollArtWestBengalLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = [...patuaRecords, ...genRecords(21), ...genRecords(41)]

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
    <div className="psa-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Patua Scroll Art WB' }]} />
      <PageHeader title="Patua Scroll Art West Bengal Logistics" description="Patua scroll narrative art supply chain with IS 16018 scroll art compliance, natural dye binding QC, kraft paper roll flat pack packaging, and GI Patua Scroll Mark certification across 8 heritage artisan clusters in Midnapore, Bankura, and Birbhum districts" />
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="bg-teal-100">
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
            <HealthRing label="GI Tag" value={93} />
            <HealthRing label="IS 16018" value={89} />
            <HealthRing label="Kraft" value={86} />
            <HealthRing label="HumiTransit" value={81} />
            <HealthRing label="Dry Store" value={91} />
            <HealthRing label="Dye QC" value={95} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Artisan Families" value="45+" />
            <ValueTile label="Patua Tradition" value="Since 13th C" />
            <ValueTile label="Export Markets" value="11 Countries" />
            <ValueTile label="Annual Revenue" value="₹4.1 Crore" />
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
            placeholder="Search Patua scroll art shipments..."
          />
          <div className="rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-teal-100">
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
                  <tr key={record.id} className="border-t hover:bg-teal-50/50">
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
              <CardHeader><CardTitle>Patua Scroll Art — 800-Year Bengali Narrative Painting Tradition</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Patua scroll art is a deeply venerated narrative painting tradition originating from the Patua artist communities of West Bengal that has been continuously practised for over eight centuries as a combined visual storytelling and musical performance art form where the artisan paints elaborate sequential narrative scenes onto long scrolls of handmade paper or fabric that are unrolled frame by frame while the Patua singer narrates the corresponding story verses accompanying each painted scene through traditional Bengali folk songs known as pater gaan, creating a unique multimedia performance experience that integrates visual art, music, poetry, and religious storytelling into a single unified artistic expression that has served as the primary means of religious education, entertainment, and cultural transmission within the rural Bengali communities of Midnapore, Bankura, Birbhum, Murshidabad, and surrounding districts of West Bengal where the Patua tradition remains a living cultural practice maintained by approximately 45 active Patua artisan families who sustain this irreplaceable folk art heritage. The Patua scroll painting tradition encompasses an extensive narrative repertoire drawn from the rich tapestry of Bengali religious and folk literature, including the most widely performed and collected scroll narratives such as the Manasa Mangal depicting the goddess Manasa's triumph over the merchant Chand Sadagar who initially refused to worship the serpent goddess, the Krishna Lila scrolls portraying the divine pastimes and miraculous deeds of Lord Krishna in the pastoral landscape of Vrindavan, the Gazi Pir narrative scrolls illustrating the spiritual powers and compassionate deeds of the Muslim saint Gazi Pir whose veneration represents the unique Hindu-Muslim syncretic spiritual tradition of rural Bengal, the Ramayana scrolls depicting the complete epic narrative of Prince Rama's exile, battle against the demon king Ravana, and eventual triumphant return to Ayodhya, and the Chaitanya Devotion scrolls portraying the life and teachings of the sixteenth-century saint Chaitanya Mahaprabhu who founded the Gaudiya Vaishnava spiritual movement that profoundly shaped Bengali religious culture and artistic expression across all folk art traditions including the Patua scroll painting heritage that adapted Chaitanya's devotional themes into its visual narrative vocabulary within decades of the saint's passing.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>IS 16018 Scroll Art Standards & Natural Dye Binding QC</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">The IS 16018 standard for Patua scroll art establishes India's first dedicated quality certification framework for Bengali narrative scroll paintings, specifying comprehensive requirements for natural vegetable dye composition, hand-painted application technique verification on handmade paper substrates, colour fastness durability under tropical humidity conditions, and narrative scene compositional accuracy that collectively distinguish authentic hand-painted Patua scrolls created by traditional artisan families from machine-printed scroll reproductions and mass-produced imitations that have increasingly appeared in both domestic Indian folk art markets and international online retail platforms serving collectors and museums seeking authentic Bengali Patua narrative art for exhibition and cultural preservation purposes. The natural dye composition requirements for IS 16018 Grade A certification mandate exclusively natural vegetable-derived pigments sourced from the Bengal ecological zone, including red from the mineral-rich laterite soil deposits of West Bengal's Bankura and Purulia districts for the vibrant red passages that dominate Patua scroll compositions depicting battle scenes and divine manifestations, yellow from turmeric rhizomes cultivated across the Bengal agricultural landscape for the auspicious golden zones representing divine light and spiritual illumination, deep blue from indigo plant extracts processed through traditional fermentation techniques for the night scenes and water bodies that appear throughout Patua narrative compositions, and black from carbonised lampblack soot mixed with tamarind seed gum as the primary binding agent for the bold black outlines that define the Patua scroll's distinctive graphic style, with spectrophotometric verification confirming natural origin and excluding any synthetic dye formulations including azo dyes, reactive dyes, and pigment dispersions that produce characteristically different spectral absorption profiles detectable through laboratory analysis comparing sample dye crystalline structures against certified natural dye reference standards maintained in the IS 16018 standard appendix. Natural dye binding verification for Grade A certification mandates accelerated humidity resistance testing through 500 hours of exposure to 85% relative humidity at 30 degrees Celsius per modified ISO 105-B02 tropical conditions with maximum permitted dye migration measured through boundary sharpness analysis confirming that the natural pigment binding agents derived from tamarind seed gum and rice paste adhesives maintain sufficient adhesion to the handmade paper substrate under extreme humidity conditions that characterise the Bengal monsoon environment where Patua scrolls are traditionally stored, displayed, and performed.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Kraft Paper Roll Flat Pack Packaging for Patua Scroll Art</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Kraft paper roll flat pack packaging has been specifically developed for the Patua scroll art logistics supply chain to protect the hand-painted natural dye surfaces, sequential narrative compositions, and handmade paper fabric substrates that characterise authentic Patua scroll artworks from the physical and environmental hazards encountered during transit from the West Bengal artisan workshops to domestic gallery destinations across Kolkata, Delhi, and Chennai, and international export destinations serving the global Bengali diaspora community and institutional collectors in Europe, North America, and Japan where significant collections of Indian folk and tribal art actively seek authenticated Patua scroll panels for acquisition, exhibition, and cultural preservation purposes that require museum-quality packaging to protect the delicate hand-painted surfaces during international shipping through multiple climatic zones. The packaging specification utilises unbleached kraft paper with minimum grammage of 100 GSM and pH range 6.5 to 7.5 as the primary wrapping and interleaving material, providing a sturdy yet breathable protective layer that prevents friction damage to the hand-painted natural dye surfaces while allowing adequate air circulation to prevent moisture condensation that could cause natural dye migration or handmade paper substrate degradation during transit through the humid coastal regions of West Bengal and the varying climatic conditions encountered during multi-modal transportation to international destinations. Each Patua scroll is inspected under standardised D65 daylight illumination verifying dye surface integrity, narrative scene sequence completeness, handmade paper condition, and overall artistic quality before being interleaved with acid-free tissue paper between successive narrative panels when the scroll is partially unrolled for inspection, then carefully rolled around a custom-cut acid-free cardboard tube with the painted surface facing outward to prevent pigment-to-pigment contact, secured with cotton tying tape at four equidistant points along the roll length, and placed within a rigid outer shipping container constructed from 5-millimetre double-wall corrugated fibreboard with internal cushioning strips of polyethylene foam at all four edges and silica gel desiccant packets placed at both ends of the roll providing moisture absorption protection against the high-humidity conditions encountered during monsoon season logistics operations across West Bengal's coastal and riverine transport networks.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>AI Narrative Scene Authentication & Patua Scroll Heritage Market Development</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Artificial intelligence and computational image analysis technologies are being progressively deployed to authenticate Patua scroll artworks and verify the distinctive hand-painted brush stroke patterns, natural vegetable dye signatures, and sequential narrative scene compositions that distinguish genuine Patua scrolls created by traditional West Bengali artisan families from the growing volume of machine-printed scroll reproductions and digitally copied imitations that have increasingly appeared in both domestic Indian folk art markets and international online retail platforms serving the global demand for authentic Indian narrative scroll art. The AI authentication system for Patua scrolls employs ultra-high-resolution linear scanning at 4800 dots per inch along the full scroll length combined with multispectral imaging across the visible and near-infrared spectrum from 400 to 900 nanometres wavelength range to capture the complete surface topography and pigment composition of finished Patua scrolls, analysing the hand-painted brush stroke direction and pressure patterns characteristic of the Patua artisan's traditional brush technique using handcrafted palm-leaf brushes and squirrel-hair fine detail brushes, natural vegetable dye particle distribution characteristics that differ fundamentally from the uniform pigment dispersion of synthetic printing inks, and the narrative scene compositional accuracy within the established Patua scroll canons that define the spatial arrangement of deity figures, architectural elements, natural landscape features, and sequential narrative framing devices according to the specific visual vocabulary of the Bengali Patua scroll painting tradition transmitted through generations of Patua families over eight centuries of continuous cultural practice in the West Bengal folk art heartland. Machine learning algorithms trained on authenticated Patua scroll reference samples can verify artwork authenticity with 95% accuracy by detecting subtle hand-painting signatures including the characteristic brush stroke width variation reflecting the artisan's hand-eye coordination during palm-leaf brush application, the natural vegetable dye particle aggregation patterns visible through high-magnification imaging that differ fundamentally from machine-printed pigment deposition, and the narrative scene proportion accuracy within the established Patua scroll art canons that define the spatial arrangement of divine figures, narrative action sequences, decorative border elements, and sequential frame dividers according to the specific visual vocabulary of the West Bengal Patua scroll tradition as practised across approximately 45 active Patua artisan families in the Midnapore, Bankura, Birbhum, Murshidabad, and Nadia production centres of West Bengal where this unique combination of visual art, musical narration, and religious storytelling continues to sustain one of India's most distinctive and irreplaceable folk art heritage traditions.</p></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
