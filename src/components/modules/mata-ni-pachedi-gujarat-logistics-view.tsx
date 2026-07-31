import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#059669', '#047857', '#065f46', '#064e3b', '#10b981', '#022c22', '#011a13', '#ecfdf5']
const PRODUCTS = ['Mata Ambika Devi Panel', 'Mata Bahuchara Stencil Screen', 'Gujarat Mata Kalika Narrative', 'Mata Amba Tiger Rider Panel', 'Mata Khodiyar Crocodile Scene', 'Mata Chamunda Battle Panel', 'Mata Ashapura Desert Screen', 'Gujarat Mata Hinglaj Devotion']
const ARTISANS = ['Ahmedabad Mata Ni Pachedi Guild', 'Chhota Udaipur Devi Art Society', 'Rajpipla Temple Art Cooperative', 'Santrampur Mata Pachedi Centre', 'Dohad Devotional Art Studio', 'Bharuch Temple Painters Colony', 'Narmada Riverbank Art Cluster', 'Vadodara Mata Ni Pachedi Society']
const STATUSES = ['GI Mata Ni Pachedi Mark', 'IS 16929 Pachedi Art Grade A', 'Muslin Roll with Tissue Interleave', 'Palletised Truck Transit', 'Dry Storage 18-25C', 'Natural Dye Fidelity QC']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="w-24 h-2 bg-emerald-200 rounded-full overflow-hidden"><div className="h-full bg-emerald-700 rounded-full" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ label, value, size = 80 }: { label: string; value: number; size?: number }) => {
  const r = (size - 12) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#ecfdf5" strokeWidth="6" />
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
    id: `MNP-${String(offset + i + 1).padStart(4, '0')}`,
    painter: ARTISANS[(offset + i) % ARTISANS.length], ware: PRODUCTS[(offset + i) % PRODUCTS.length],
    status: STATUSES[(offset + i) % STATUSES.length], qty: ri(1, 35, ((offset + i) * 31) % 35) + 1,
    cost: ri(5000, 98000, ((offset + i) * 14173) % 93000) + 5000,
    date: new Date(2024, ((offset + i) % 12), ri(1, 28, (offset + i) % 28)).toISOString().slice(0, 10),
  }))

const mataRecords = [
  { id: 'MNP-0001', painter: 'Ahmedabad Mata Ni Pachedi Guild', ware: 'Mata Ambika Devi Panel', status: 'GI Mata Ni Pachedi Mark', qty: 5, cost: 45000, date: '2024-01-12' },
  { id: 'MNP-0002', painter: 'Chhota Udaipur Devi Art Society', ware: 'Mata Bahuchara Stencil Screen', status: 'IS 16929 Pachedi Art Grade A', qty: 7, cost: 38000, date: '2024-01-25' },
  { id: 'MNP-0003', painter: 'Rajpipla Temple Art Cooperative', ware: 'Gujarat Mata Kalika Narrative', status: 'Muslin Roll with Tissue Interleave', qty: 4, cost: 62000, date: '2024-02-08' },
  { id: 'MNP-0004', painter: 'Santrampur Mata Pachedi Centre', ware: 'Mata Amba Tiger Rider Panel', status: 'Palletised Truck Transit', qty: 8, cost: 28000, date: '2024-02-20' },
  { id: 'MNP-0005', painter: 'Dohad Devotional Art Studio', ware: 'Mata Khodiyar Crocodile Scene', status: 'Dry Storage 18-25C', qty: 3, cost: 72000, date: '2024-03-05' },
  { id: 'MNP-0006', painter: 'Bharuch Temple Painters Colony', ware: 'Mata Chamunda Battle Panel', status: 'Natural Dye Fidelity QC', qty: 6, cost: 48000, date: '2024-03-18' },
  { id: 'MNP-0007', painter: 'Narmada Riverbank Art Cluster', ware: 'Mata Ashapura Desert Screen', status: 'GI Mata Ni Pachedi Mark', qty: 4, cost: 68000, date: '2024-03-30' },
  { id: 'MNP-0008', painter: 'Vadodara Mata Ni Pachedi Society', ware: 'Gujarat Mata Hinglaj Devotion', status: 'IS 16929 Pachedi Art Grade A', qty: 9, cost: 24000, date: '2024-04-12' },
  { id: 'MNP-0009', painter: 'Ahmedabad Mata Ni Pachedi Guild', ware: 'Mata Bahuchara Stencil Screen', status: 'Muslin Roll with Tissue Interleave', qty: 5, cost: 52000, date: '2024-04-24' },
  { id: 'MNP-0010', painter: 'Chhota Udaipur Devi Art Society', ware: 'Mata Ambika Devi Panel', status: 'Palletised Truck Transit', qty: 7, cost: 36000, date: '2024-05-06' },
  { id: 'MNP-0011', painter: 'Rajpipla Temple Art Cooperative', ware: 'Gujarat Mata Kalika Narrative', status: 'Dry Storage 18-25C', qty: 4, cost: 65000, date: '2024-05-18' },
  { id: 'MNP-0012', painter: 'Santrampur Mata Pachedi Centre', ware: 'Mata Amba Tiger Rider Panel', status: 'Natural Dye Fidelity QC', qty: 6, cost: 42000, date: '2024-05-30' },
  { id: 'MNP-0013', painter: 'Dohad Devotional Art Studio', ware: 'Mata Khodiyar Crocodile Scene', status: 'GI Mata Ni Pachedi Mark', qty: 8, cost: 30000, date: '2024-06-12' },
  { id: 'MNP-0014', painter: 'Bharuch Temple Painters Colony', ware: 'Mata Chamunda Battle Panel', status: 'IS 16929 Pachedi Art Grade A', qty: 3, cost: 75000, date: '2024-06-24' },
  { id: 'MNP-0015', painter: 'Narmada Riverbank Art Cluster', ware: 'Mata Ashapura Desert Screen', status: 'Muslin Roll with Tissue Interleave', qty: 10, cost: 22000, date: '2024-07-06' },
  { id: 'MNP-0016', painter: 'Vadodara Mata Ni Pachedi Society', ware: 'Gujarat Mata Hinglaj Devotion', status: 'Palletised Truck Transit', qty: 5, cost: 58000, date: '2024-07-18' },
  { id: 'MNP-0017', painter: 'Ahmedabad Mata Ni Pachedi Guild', ware: 'Mata Amba Tiger Rider Panel', status: 'Dry Storage 18-25C', qty: 4, cost: 70000, date: '2024-07-30' },
  { id: 'MNP-0018', painter: 'Chhota Udaipur Devi Art Society', ware: 'Mata Ambika Devi Panel', status: 'Natural Dye Fidelity QC', qty: 7, cost: 35000, date: '2024-08-10' },
  { id: 'MNP-0019', painter: 'Rajpipla Temple Art Cooperative', ware: 'Mata Bahuchara Stencil Screen', status: 'GI Mata Ni Pachedi Mark', qty: 6, cost: 48000, date: '2024-08-22' },
  { id: 'MNP-0020', painter: 'Santrampur Mata Pachedi Centre', ware: 'Gujarat Mata Kalika Narrative', status: 'IS 16929 Pachedi Art Grade A', qty: 5, cost: 56000, date: '2024-09-03' },
]

export default function MataNiPachediGujaratLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = [...mataRecords, ...genRecords(21), ...genRecords(41)]

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
    <div className="mnp-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Mata Ni Pachedi Gujarat' }]} />
      <PageHeader title="Mata Ni Pachedi Gujarat Logistics" description="Mata Ni Pachedi devotional textile supply chain with IS 16929 Pachedi art compliance, natural dye fidelity QC, muslin roll tissue interleave packaging, and GI Mata Ni Pachedi Mark certification across 8 heritage artisan clusters in Ahmedabad, Chhota Udaipur, and Vadodara districts" />
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="bg-emerald-100">
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
            <HealthRing label="GI Tag" value={95} />
            <HealthRing label="IS 16929" value={90} />
            <HealthRing label="Muslin" value={87} />
            <HealthRing label="Truck" value={84} />
            <HealthRing label="Dry Store" value={91} />
            <HealthRing label="Dye QC" value={93} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Artisan Families" value="40+" />
            <ValueTile label="Pachedi Tradition" value="Since 12th C" />
            <ValueTile label="Export Markets" value="9 Countries" />
            <ValueTile label="Annual Revenue" value="₹3.2 Crore" />
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
            placeholder="Search Mata Ni Pachedi shipments..."
          />
          <div className="rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-emerald-100">
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
                  <tr key={record.id} className="border-t hover:bg-emerald-50/50">
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
              <CardHeader><CardTitle>Mata Ni Pachedi — 900-Year Gujarati Devotional Textile Narrative Tradition</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Mata Ni Pachedi is a unique and deeply revered devotional textile art tradition from Gujarat that has been practised by the Vaghri and Rohit communities for over nine centuries, creating elaborate hand-painted cloth panels depicting the sacred legends and miraculous deeds of the Hindu mother goddesses known as Mata, with the tradition centred on the creation of shrine-like textile backdrops used during the Navratri festival and other important religious ceremonies where the painted cloth serves as a temporary temple sanctuary for the goddess figure that is the focal point of devotional worship by the Vaghri community's predominantly matriarchal social structure where women hold primary religious authority within the household and community ceremonial life. The painting technique involves applying natural mineral and vegetable dyes onto hand-woven unbleached cotton or muslin fabric using handcrafted bamboo brushes and metal stylus tools, with the colour palette restricted to traditional earth-derived red, black, yellow, and white pigments that carry deep symbolic significance within the Mata worship tradition: deep red representing the goddess's divine power and creative energy, black representing the protective force that destroys evil and shields devotees from harm, yellow representing auspiciousness and prosperity invoked through the goddess's blessings, and white representing spiritual purity and the goddess's role as the ultimate refuge for devotees seeking liberation from worldly suffering. Each Mata Ni Pachedi panel depicts a specific goddess narrative drawn from the extensive Gujarati folk tradition of Mata legends, including the most commonly represented deities such as Mata Ambika who is depicted riding her sacred tiger or lion mount symbolising her triumph over the forces of ignorance and darkness, Mata Bahuchara who is shown with her symbolic rooster mount representing her role as the protector of women's honour and dignity, Mata Khodiyar depicted mounted on her crocodile vehicle signifying her power over the aquatic realm and her connection to the monsoon rains that sustain Gujarat's agricultural prosperity, and Mata Chamunda portrayed in her fierce warrior form carrying weapons of divine destruction vanquishing the demon armies that threaten cosmic order and dharmic righteousness.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>IS 16929 Pachedi Art Standards & Natural Dye Fidelity QC</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">The IS 16929 standard for Mata Ni Pachedi establishes India's first dedicated quality certification framework for this ancient Gujarati devotional textile art tradition, specifying comprehensive requirements for natural mineral and vegetable dye composition, hand-painted application technique verification, fabric substrate quality, colour fastness durability, and narrative iconographic accuracy that collectively distinguish genuine hand-painted Mata Ni Pachedi textiles from block-printed, screen-printed, and digitally printed imitations that have increasingly appeared in both domestic Indian religious supply markets and international online marketplaces serving the global Gujarati diaspora community seeking authentic Mata Ni Pachedi shrine backdrops for home Navratri celebrations and temple decoration purposes during the nine-night festival dedicated to the worship of the nine forms of the Hindu mother goddess Durga. The natural dye composition requirements for IS 16929 Grade A certification mandate exclusively natural mineral and vegetable-derived pigments sourced from the Gujarat ecological zone, including red ochre from the Kutch laterite deposits for the sacred red colour that dominates Mata Ni Pachedi compositions, iron oxide black derived from rusting iron filings fermented in jaggery solution for the protective black outlines and shadow areas, turmeric-derived yellow from locally cultivated Curcuma longa rhizomes for auspicious yellow zones, and rice paste white for pure white highlights representing the goddess's spiritual purity and divine light, with spectrophotometric verification confirming natural origin and excluding any synthetic dye formulations including azo dyes, reactive dyes, and pigment dispersions that produce characteristically different spectral absorption profiles detectable through laboratory analysis comparing sample dye crystalline structures against certified natural dye reference standards maintained in the IS 16929 standard appendix. Natural dye fidelity verification for Grade A certification mandates accelerated light fastness testing through 300 hours of xenon arc exposure per ISO 105-B02 with maximum permitted colour change measured through CIELAB Delta E values not exceeding 6.0 units for red pigments and 4.0 units for black pigments, ensuring the natural dyes retain their original colour intensity and chromatic saturation under prolonged display conditions including the extended Navratri festival periods where Mata Ni Pachedi textiles remain exposed to temple lamp illumination and daylight conditions for continuous nine-day worship cycles that subject the painted fabric surfaces to sustained thermal and photometric stress.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Muslin Roll with Tissue Interleave Packaging for Mata Ni Pachedi</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Muslin roll packaging with acid-free tissue interleave has been specifically developed for the Mata Ni Pachedi logistics supply chain to protect the hand-painted natural dye surfaces, sacred narrative compositions, and delicate cotton fabric substrates that characterise authentic Mata Ni Pachedi textiles from the physical and environmental hazards encountered during transit from the Gujarat artisan workshops to domestic temple destinations across Gujarat, Rajasthan, and Maharashtra, and international export destinations serving the global Gujarati diaspora communities in East Africa, the United Kingdom, North America, and Southeast Asia where significant populations of Gujarati Hindu devotees maintain active Navratri worship traditions requiring authentic Mata Ni Pachedi shrine backdrops imported from Gujarat's heritage artisan production centres. The packaging specification utilises plain weave unbleached cotton muslin with minimum grammage of 80 GSM and pH range 6.5 to 7.5 as the primary wrapping material, providing a soft breathable protective layer that prevents friction damage to the hand-painted natural dye surfaces while allowing adequate air circulation to prevent moisture condensation that could cause natural dye bleeding or fabric substrate degradation during transit through the humid coastal regions of Gujarat and the varying climatic conditions encountered during multi-modal transportation to international destinations. Each Mata Ni Pachedi textile is inspected under standardised D65 daylight illumination verifying dye surface integrity, painted narrative completeness, fabric condition, and overall compositional quality before being interleaved with acid-free tissue paper between the painted surface and the muslin wrapping layer, then rolled around a custom-cut acid-free cardboard tube with the painted surface facing outward to prevent pigment-to-pigment contact, secured with cotton tying tape, and placed within a rigid outer container constructed from 5-millimetre double-wall corrugated fibreboard with internal cushioning strips of polyethylene foam at all four edges providing shock absorption protection against the impact and vibration forces encountered during road transport from the artisan workshops through Gujarat's freight distribution networks and subsequent air cargo transit to international destinations.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>AI Narrative Iconography Verification & Mata Ni Pachedi Heritage Market Development</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Artificial intelligence and advanced computational image analysis technologies are being progressively deployed to authenticate Mata Ni Pachedi textiles and verify the distinctive hand-painted brush stroke patterns, natural dye spectral signatures, and narrative iconographic compositions that distinguish genuine Mata Ni Pachedi artworks from the growing volume of machine-printed and digitally reproduced imitations that have increasingly appeared in both domestic Indian temple art supply markets and international online retail platforms catering to the global Gujarati Hindu diaspora community seeking authentic devotional textiles for Navratri festival celebrations and permanent home shrine installations. The AI authentication system for Mata Ni Pachedi employs ultra-high-resolution scanning at 4800 dots per inch combined with multispectral imaging across the visible near-infrared spectrum from 400 to 900 nanometres wavelength range to capture the complete surface topography and pigment composition of finished Mata Ni Pachedi textiles, analysing the hand-painted brush stroke direction and pressure patterns, natural dye particle distribution characteristics, and narrative iconographic element proportions against a comprehensive reference database containing authenticated Mata Ni Pachedi masterworks from all major Vaghri and Rohit community artisan families across the Ahmedabad, Chhota Udaipur, Rajpipla, and Vadodara production centres of Gujarat where the approximately 40 remaining active Mata Ni Pachedi artisan families sustain this irreplaceable devotional textile tradition. Machine learning algorithms trained on this reference database can verify Mata Ni Pachedi authenticity with 96% accuracy by detecting subtle hand-painting signatures including the characteristic brush stroke width variation that reflects the artisan's hand-eye coordination during bamboo brush application, the natural mineral dye particle aggregation patterns visible through high-magnification imaging that differ fundamentally from the uniform pigment distribution of synthetic printing inks, and the compositional proportion accuracy within the established Mata iconographic canons that define the spatial arrangement of goddess figures, sacred mount animals, decorative border patterns, and narrative scene elements according to the specific visual vocabulary of the Vaghri Mata Ni Pachedi painting tradition transmitted through generations of artisan families over nine centuries of continuous devotional art practice in Gujarat.</p></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
