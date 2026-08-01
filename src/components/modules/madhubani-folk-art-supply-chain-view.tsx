import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#9f1239', '#be123c', '#881337', '#4c0519', '#e11d48', '#db2777', '#a21caf', '#fce7f3']
const PRODUCTS = ['Madhubani Kohbar Vivah Panel', 'Bihar Mithila Tree of Life', 'Madhubani Sun God Surya Panel', 'Bihar Bharni Style Fish Motif', 'Madhubani Katchni Line Art Panel', 'Bihar Tantric Yantra Canvas', 'Madhubani Godna Tattoo Art Panel', 'Bihar Pashu Pakshi Animal Motif']
const ARTISANS = ['Madhubani Traditional Art Guild', 'Jitwarpur Mithila Painters Society', 'Ranti Village Art Cooperative', 'Darbhanga Heritage Painters', 'Saharsa Mithila Art Centre', 'Madhubani Town Folk Artists', 'Laukahi Village Painting Colony', 'Benipatti Mithila Craft Studio']
const STATUSES = ['GI Madhubani Painting Mark', 'IS 16921 Mithila Art Grade A', 'Hardboard Bubble Wrap Pack', 'Enclosed Truck Transit', 'Dry Storage 18-30C', 'Natural Dye Colourfast QC']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-rose-100 text-rose-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="w-24 h-2 bg-rose-200 rounded-full overflow-hidden"><div className="h-full bg-rose-700 rounded-full" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ label, value, size = 80 }: { label: string; value: number; size?: number }) => {
  const r = (size - 12) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#fce7f3" strokeWidth="6" />
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
    id: `MFA-${String(offset + i + 1).padStart(4, '0')}`,
    painter: ARTISANS[(offset + i) % ARTISANS.length], ware: PRODUCTS[(offset + i) % PRODUCTS.length],
    status: STATUSES[(offset + i) % STATUSES.length], qty: ri(1, 35, ((offset + i) * 31) % 35) + 1,
    cost: ri(5000, 98000, ((offset + i) * 14173) % 93000) + 5000,
    date: new Date(2024, ((offset + i) % 12), ri(1, 28, (offset + i) % 28)).toISOString().slice(0, 10),
  }))


const madhubaniRecords = [
  { id: 'MFA-0001', painter: 'Madhubani Traditional Art Guild', ware: 'Madhubani Kohbar Vivah Panel', status: 'GI Madhubani Painting Mark', qty: 5, cost: 65000, date: '2024-01-10' },
  { id: 'MFA-0002', painter: 'Jitwarpur Mithila Painters Society', ware: 'Bihar Mithila Tree of Life', status: 'IS 16921 Mithila Art Grade A', qty: 8, cost: 42000, date: '2024-01-22' },
  { id: 'MFA-0003', painter: 'Ranti Village Art Cooperative', ware: 'Madhubani Sun God Surya Panel', status: 'Hardboard Bubble Wrap Pack', qty: 12, cost: 28000, date: '2024-02-05' },
  { id: 'MFA-0004', painter: 'Darbhanga Heritage Painters', ware: 'Bihar Bharni Style Fish Motif', status: 'Enclosed Truck Transit', qty: 6, cost: 55000, date: '2024-02-18' },
  { id: 'MFA-0005', painter: 'Saharsa Mithila Art Centre', ware: 'Madhubani Katchni Line Art Panel', status: 'Dry Storage 18-30C', qty: 10, cost: 35000, date: '2024-03-02' },
  { id: 'MFA-0006', painter: 'Madhubani Town Folk Artists', ware: 'Bihar Tantric Yantra Canvas', status: 'Natural Dye Colourfast QC', qty: 7, cost: 48000, date: '2024-03-15' },
  { id: 'MFA-0007', painter: 'Laukahi Village Painting Colony', ware: 'Madhubani Godna Tattoo Art Panel', status: 'GI Madhubani Painting Mark', qty: 4, cost: 72000, date: '2024-03-28' },
  { id: 'MFA-0008', painter: 'Benipatti Mithila Craft Studio', ware: 'Bihar Pashu Pakshi Animal Motif', status: 'IS 16921 Mithila Art Grade A', qty: 9, cost: 21000, date: '2024-04-10' },
  { id: 'MFA-0009', painter: 'Madhubani Traditional Art Guild', ware: 'Madhubani Sun God Surya Panel', status: 'Hardboard Bubble Wrap Pack', qty: 5, cost: 58000, date: '2024-04-22' },
  { id: 'MFA-0010', painter: 'Jitwarpur Mithila Painters Society', ware: 'Madhubani Kohbar Vivah Panel', status: 'Enclosed Truck Transit', qty: 6, cost: 38000, date: '2024-05-05' },
  { id: 'MFA-0011', painter: 'Ranti Village Art Cooperative', ware: 'Bihar Mithila Tree of Life', status: 'Dry Storage 18-30C', qty: 3, cost: 70000, date: '2024-05-18' },
  { id: 'MFA-0012', painter: 'Darbhanga Heritage Painters', ware: 'Bihar Bharni Style Fish Motif', status: 'Natural Dye Colourfast QC', qty: 8, cost: 40000, date: '2024-05-30' },
  { id: 'MFA-0013', painter: 'Saharsa Mithila Art Centre', ware: 'Madhubani Katchni Line Art Panel', status: 'GI Madhubani Painting Mark', qty: 5, cost: 30000, date: '2024-06-12' },
  { id: 'MFA-0014', painter: 'Madhubani Town Folk Artists', ware: 'Bihar Tantric Yantra Canvas', status: 'IS 16921 Mithila Art Grade A', qty: 7, cost: 68000, date: '2024-06-24' },
  { id: 'MFA-0015', painter: 'Laukahi Village Painting Colony', ware: 'Madhubani Godna Tattoo Art Panel', status: 'Hardboard Bubble Wrap Pack', qty: 4, cost: 52000, date: '2024-07-06' },
  { id: 'MFA-0016', painter: 'Benipatti Mithila Craft Studio', ware: 'Bihar Pashu Pakshi Animal Motif', status: 'Enclosed Truck Transit', qty: 10, cost: 22000, date: '2024-07-18' },
  { id: 'MFA-0017', painter: 'Madhubani Traditional Art Guild', ware: 'Bihar Tantric Yantra Canvas', status: 'Dry Storage 18-30C', qty: 3, cost: 75000, date: '2024-07-30' },
  { id: 'MFA-0018', painter: 'Jitwarpur Mithila Painters Society', ware: 'Madhubani Kohbar Vivah Panel', status: 'Natural Dye Colourfast QC', qty: 6, cost: 36000, date: '2024-08-10' },
  { id: 'MFA-0019', painter: 'Ranti Village Art Cooperative', ware: 'Bihar Mithila Tree of Life', status: 'GI Madhubani Painting Mark', qty: 5, cost: 50000, date: '2024-08-22' },
  { id: 'MFA-0020', painter: 'Darbhanga Heritage Painters', ware: 'Madhubani Sun God Surya Panel', status: 'IS 16921 Mithila Art Grade A', qty: 8, cost: 58000, date: '2024-09-03' },
]

export default function MadhubaniFolkArtSupplyChainView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = [...madhubaniRecords, ...genRecords(21), ...genRecords(41)]



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
    <div className="mfa-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Madhubani Folk Art' }]} />
      <PageHeader title="Madhubani Folk Art Supply Chain" description="Bihar Mithila region folk art logistics with IS 16921 certification, natural dye colourfast QC, hardboard bubble wrap packaging, and GI Madhubani Painting Mark across 8 artisan cooperative clusters in Madhubani, Darbhanga, and Saharsa districts" />
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="bg-rose-100">
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
            <HealthRing label="GI Tag" value={94} />
            <HealthRing label="IS 16921" value={88} />
            <HealthRing label="Bubble" value={85} />
            <HealthRing label="Truck" value={80} />
            <HealthRing label="Dry Store" value={87} />
            <HealthRing label="Dye QC" value={91} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Artisan Families" value="300+" />
            <ValueTile label="Tradition" value="Since 7th C BCE" />
            <ValueTile label="Export Markets" value="12 Countries" />
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
            placeholder="Search Madhubani folk art shipments..."
          />
          <div className="rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-rose-100">
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
                  <tr key={record.id} className="border-t hover:bg-rose-50/50">
                    <td className="p-3 font-mono text-xs">{record.id}</td>
                    <td className="p-3"><ProductBadge name={record.ware} /></td>
                    <td className="p-3">{record.painter}</td>
                    <td className="p-3"><StatusBadge status={record.status} /></td>
                    <td className="p-3">{record.qty} {['pcs', 'sets', 'panels', 'canvases'][parseInt(record.id.slice(4)) % 4]}</td>
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
              <CardHeader><CardTitle>Madhubani Folk Art — Ancient Mithila Kingdom Wall Mural Tradition</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">Madhubani folk art is one of the oldest surviving visual art traditions in the Indian subcontinent, originating from the ancient Mithila kingdom in present-day Bihar where women of the region have continuously practised this distinctive wall mural and floor painting tradition for over three thousand years as a sacred domestic ritual art form intricately connected to the ceremonial life-cycle events of the Mithila community including the kohbar ghar bridal chamber decorations created during wedding ceremonies where intricate geometric and floral patterns are painted on the walls and floor of the room where the newly married couple will begin their married life, the chitra ceremony where goddess figures are painted on the walls of family homes to invoke divine blessings during religious festivals and seasonal agricultural celebrations, and the aripan floor drawings created during the autumn harvest festival of Chhath Puja dedicated to the Sun God Surya where elaborate geometric patterns are drawn on the courtyard floors using rice paste and natural pigment solutions in the distinctive Madhubani visual vocabulary characterised by bold black outlines, flat areas of vivid natural colour, and the characteristic absence of three-dimensional perspective in favour of a distinctive frontal compositional style where all figures and objects are depicted in their most recognisable profile or frontal view creating the immediately identifiable Madhubani aesthetic that has become one of India's most internationally recognised folk art traditions. The tradition was transitioned from wall murals to portable paper and canvas formats during the 1960s following a devastating drought in the Madhubani district when the government of Bihar initiated a rural arts and crafts development programme encouraging the traditional Mithila women painters to transfer their wall mural techniques onto handmade paper and canvas substrates for sale in urban markets, creating a new commercial dimension for the Madhubani art tradition that enabled the artisan communities to supplement their agricultural incomes while simultaneously introducing this ancient folk art to national and international audiences through exhibitions at the National Handicrafts Museum in New Delhi, the Crafts Museum in Mumbai, and subsequently through international gallery exhibitions in London, Paris, New York, and Tokyo where Madhubani paintings have been acquired by major institutional collections including the British Museum, the Victoria and Albert Museum, and the Smithsonian Institution establishing Madhubani folk art as one of the most significant Indian visual art traditions in the global contemporary folk art market where authenticated Madhubani paintings created by traditional Mithila artisan families command premium prices from collectors and institutional buyers who value the cultural authenticity and artistic integrity of paintings sourced directly from the twelve key artisan villages of the Madhubani district including Ranti with approximately three hundred active painters, Jitwarpur with two hundred and fifty painters, Rasidpur with one hundred and eighty painters, Laukahi with one hundred and fifty painters, Benipatti with one hundred and twenty painters, and Jhanjharpur with one hundred painters forming the core production network that sustains this irreplaceable three-thousand-year-old cultural heritage tradition of the Mithila region of Bihar.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>IS 16921 Mithila Art Standards & Natural Dye Colourfast QC</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The IS 16921 standard for Madhubani painting establishes India's first comprehensive quality certification framework specifically designed for the Mithila folk art tradition of Bihar, specifying detailed requirements for natural dye and pigment composition authentication, handmade paper and canvas substrate quality parameters, brush technique and line quality verification, compositional canons of the five recognised Madhubani styles including Bharni filled-colour, Katchni hatched-line, Tantric geometric-yantra, Godna tattoo-style, and Gobar cow-dung-textured painting styles, and the distinctive visual vocabulary elements that collectively distinguish authentic Madhubani paintings created by traditional Mithila artisan families from machine-printed reproductions and commercially produced imitations that have increasingly appeared in both domestic Indian handicraft markets and international online retail platforms serving the growing global demand for Indian folk art objects. The natural dye composition requirements for IS 16921 Grade A certification mandate exclusively naturally derived pigments and dyes including lamp black carbon obtained from burning mustard oil in a clay lamp for the characteristic bold black outlines that define all Madhubani painting styles where the black outline quality is considered the primary indicator of artistic skill and traditional authenticity, natural henna red from the Lawsonia inermis plant cultivated in the Saharsa district for the vibrant red fill passages in Bharni-style Madhubani paintings depicting mythological narrative scenes and deity figures, turmeric yellow from locally cultivated Curcuma longa rhizomes for the golden-yellow accent passages representing auspicious elements in the Madhubani visual vocabulary, indigo blue from the Indigofera tinctoria plant processed through traditional Bihar fermentation techniques for the blue passages appearing in Tantric yantra compositions and deity figure garments, and locally sourced rice paste white derived from soaked and ground rice grains for the white line work characteristic of Katchni-style hatched-line Madhubani paintings where fine parallel hatched lines create the tonal shading effects that distinguish this technically demanding painting style from the simpler filled-colour Bharni approach. Natural dye colour fastness verification for IS 16921 Grade A certification mandates accelerated light fastness testing through exposure to xenon arc illumination equivalent to five years of museum display conditions measured through CIELAB Delta E values not exceeding 3.5 units for lamp black carbon outlines and 4.0 units for the henna red fill passages, ensuring the natural pigments retain sufficient chromatic stability and tonal depth under the typical museum and gallery lighting conditions where authenticated Madhubani paintings are displayed for institutional and private collectors who maintain the paintings under controlled environmental conditions consistent with the preventive conservation standards recommended by the Indian National Mission for Cultural Heritage Preservation which provides annual funding support for the Madhubani artisan communities through the GI Madhubani Painting Mark certification programme that currently benefits over three hundred active artisan families across the twelve key production villages of the Madhubani district in Bihar.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Hardboard Bubble Wrap Packaging for Madhubani Painting Transit</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">Hardboard backing with bubble wrap cushioning has been specifically developed for the Madhubani folk art logistics supply chain to protect the delicate natural pigment surfaces, hand-brushed line work, and handmade paper or cotton canvas substrates that characterise authentic Madhubani paintings from the physical and environmental hazards encountered during transit from the Bihar artisan production villages to domestic gallery and museum destinations across Patna, New Delhi, Kolkata, and Mumbai, and international export destinations serving the global folk art collector community in Europe, North America, Japan, and Australia where significant institutional and private collections of Indian folk art actively seek authenticated Madhubani paintings for acquisition and exhibition purposes that require museum-quality preservation during international shipping through multiple climatic zones ranging from the subtropical humidity of the Bihar plains to the dry climate of North Indian exhibition venues and the controlled environments of international cargo aircraft transporting Madhubani paintings to overseas institutional collections. The packaging specification utilises 3-millimetre medium-density fibreboard hardboard panels cut to dimensions exceeding the painting dimensions by five centimetres on all four sides providing a rigid support backing that prevents flexural stress damage to the handmade paper substrate during transit while adding minimal weight to the shipping package for cost-effective road and air cargo transport from the Madhubani district production villages to the major urban distribution hubs of Patna and New Delhi. Each Madhubani painting is inspected under standardised D65 daylight illumination verifying natural pigment colour fidelity, brush line quality, compositional accuracy within the established Madhubani style canons, substrate condition, and overall artistic quality before being interleaved with acid-free tissue paper between the painted surface and the bubble wrap cushioning layer consisting of low-density polyethylene air-bubble sheeting with minimum bubble diameter of 10 millimetres and bubble height of 4 millimetres providing shock absorption protection against the impact and vibration forces encountered during road transport along the national highway network connecting the Madhubani district production centres in Bihar to the major urban distribution hubs. The packaged painting is then placed within a rigid outer shipping container constructed from 5-millimetre double-wall corrugated fibreboard with internal cushioning strips of expanded polyethylene foam at all four edges providing comprehensive edge protection against compression forces during stacking and transit, with moisture-barrier polyethylene liner bags protecting against humidity fluctuations that could cause natural pigment bleeding or paper substrate degradation during transit through the variable climatic conditions encountered along the Bihar-to-Delhi transport corridor and during air cargo transit to international destinations serving the global Madhubani folk art collector community.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>AI Brush Stroke Authentication & Madhubani Heritage Cooperative Network</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">Artificial intelligence and computational image analysis technologies are being progressively deployed to authenticate Madhubani folk art paintings and verify the distinctive hand-brushed line work patterns, natural pigment compositions, and Mithila visual vocabulary elements that distinguish genuine Madhubani paintings created by traditional artisan families from the growing volume of machine-printed reproductions and digitally copied imitations that have increasingly appeared in both the domestic Indian handicraft market and international online retail platforms serving the global demand for authenticated Indian folk art objects. The AI authentication system for Madhubani paintings employs ultra-high-resolution scanning at 1200 dots per inch combined with multispectral imaging across the visible and near-infrared spectrum from 400 to 1100 nanometres wavelength range to capture the complete surface topography and pigment layer structure of finished Madhubani paintings, analysing the hand-brushed line quality characteristics including the characteristic brush pressure variation patterns where the traditional Madhubani artisan uses a handcrafted cotton-tipped brush made from a bamboo stick wrapped with cotton rag to apply the lamp black carbon outline in a single continuous stroke that produces distinctive line width variations reflecting the painter's hand pressure and brush angle that cannot be replicated by digital printing technology, the natural pigment surface texture characteristics where hand-ground pigments create a slightly granular surface texture that differs fundamentally from the uniform smoothness of commercial printing inks, and the compositional accuracy within the established Madhubani style canons that define the spatial arrangement of figures, decorative border patterns, floral motifs, animal forms, and geometric elements according to the specific visual vocabulary maintained by each of the twelve key artisan villages where subtle regional variations in compositional style and motif selection provide additional authentication markers for art historians and forensic analysts. Machine learning algorithms trained on authenticated Madhubani reference samples from all major production centres and all five recognised painting styles can verify artwork authenticity with 93% accuracy by detecting subtle artisan signatures including the characteristic line junction overlap patterns where hand-brushed lines at intersections show slight overlap or underlap reflecting the painter's spatial judgment during the rapid freehand drawing process that is the defining technical characteristic of authentic Madhubani painting where each painting requires between two thousand and five thousand individual brush strokes placed with sub-millimetre precision, the natural pigment colour variation patterns where hand-mixed natural dyes produce subtle chromatic variations between different fill passages of the same nominal colour that differ fundamentally from the pixel-perfect colour uniformity of digital reproductions, and the overall compositional proportion accuracy within the established Madhubani visual vocabulary canons that have been maintained across the three-thousand-year history of this extraordinary Mithila folk art tradition by the women painter communities of the Madhubani district in Bihar where the National Mission on Cultural Heritage of India continues to provide institutional support for the preservation and development of this irreplaceable cultural heritage tradition through GI certification, artisan training programmes, exhibition logistics support, and international market development initiatives that connect the traditional Madhubani artisan cooperatives directly with institutional collectors and museum curators worldwide who seek the cultural authenticity and artistic integrity of paintings sourced from the twelve key production villages of the ancient Mithila kingdom.</p></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
