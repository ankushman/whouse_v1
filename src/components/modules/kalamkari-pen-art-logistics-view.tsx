import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#4338ca', '#3730a3', '#312e81', '#1e1b4b', '#6366f1', '#4f46e5', '#4338ca', '#eef2ff']
const PRODUCTS = ['Srikalahasti Tree of Life Panel', 'AP Kalamkari Ramayana Scroll', 'Machilipatnam Mythological Hanging', 'Kalamkari Dashavatara Mural', 'AP Kalamkari Panchatantra Panel', 'Kalamkari Aranya Nature Motif', 'Kalamkari Bhagavata Purana Cloth', 'AP Kalamkari Temple Canopy']
const ARTISANS = ['Srikalahasti Pen Art Guild', 'Machilipatnam Block Studio', 'Pedana Kalamkari Centre', 'Tirupati Temple Art Cooperative', 'Nellore Kalamkari Painters Colony', 'Rajahmundry Pen Art Cluster', 'Kakinada Textile Art Society', 'Eluru Natural Dye Craft Studio']
const STATUSES = ['GI Kalamkari Craft Mark', 'IS 16794 Kalamkari Art Grade A', 'Cotton Roll Flat Pack', 'Humidity-Controlled Truck', 'Dark Dry Storage 18-22C', 'Natural Dye Colourfast QC']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="w-24 h-2 bg-indigo-200 rounded-full overflow-hidden"><div className="h-full bg-indigo-700 rounded-full" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ label, value, size = 80 }: { label: string; value: number; size?: number }) => {
  const r = (size - 12) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#eef2ff" strokeWidth="6" />
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
    id: `KPA-${String(offset + i + 1).padStart(4, '0')}`,
    painter: ARTISANS[(offset + i) % ARTISANS.length], ware: PRODUCTS[(offset + i) % PRODUCTS.length],
    status: STATUSES[(offset + i) % STATUSES.length], qty: ri(1, 35, ((offset + i) * 31) % 35) + 1,
    cost: ri(5000, 98000, ((offset + i) * 14173) % 93000) + 5000,
    date: new Date(2024, ((offset + i) % 12), ri(1, 28, (offset + i) % 28)).toISOString().slice(0, 10),
  }))

const kalamkariRecords = [
  { id: 'KPA-0001', painter: 'Srikalahasti Pen Art Guild', ware: 'Srikalahasti Tree of Life Panel', status: 'GI Kalamkari Craft Mark', qty: 5, cost: 35000, date: '2024-01-12' },
  { id: 'KPA-0002', painter: 'Machilipatnam Block Studio', ware: 'AP Kalamkari Ramayana Scroll', status: 'IS 16794 Kalamkari Art Grade A', qty: 18, cost: 72000, date: '2024-01-25' },
  { id: 'KPA-0003', painter: 'Pedana Kalamkari Centre', ware: 'Machilipatnam Mythological Hanging', status: 'Cotton Roll Flat Pack', qty: 12, cost: 48000, date: '2024-02-08' },
  { id: 'KPA-0004', painter: 'Tirupati Temple Art Cooperative', ware: 'Kalamkari Dashavatara Mural', status: 'Humidity-Controlled Truck', qty: 25, cost: 95000, date: '2024-02-20' },
  { id: 'KPA-0005', painter: 'Nellore Kalamkari Painters Colony', ware: 'AP Kalamkari Panchatantra Panel', status: 'Dark Dry Storage 18-22C', qty: 3, cost: 80000, date: '2024-03-05' },
  { id: 'KPA-0006', painter: 'Rajahmundry Pen Art Cluster', ware: 'Kalamkari Aranya Nature Motif', status: 'Natural Dye Colourfast QC', qty: 15, cost: 65000, date: '2024-03-18' },
  { id: 'KPA-0007', painter: 'Kakinada Textile Art Society', ware: 'Kalamkari Bhagavata Purana Cloth', status: 'GI Kalamkari Craft Mark', qty: 8, cost: 55000, date: '2024-03-30' },
  { id: 'KPA-0008', painter: 'Eluru Natural Dye Craft Studio', ware: 'AP Kalamkari Temple Canopy', status: 'IS 16794 Kalamkari Art Grade A', qty: 4, cost: 110000, date: '2024-04-12' },
  { id: 'KPA-0009', painter: 'Srikalahasti Pen Art Guild', ware: 'AP Kalamkari Ramayana Scroll', status: 'Cotton Roll Flat Pack', qty: 20, cost: 28000, date: '2024-04-24' },
  { id: 'KPA-0010', painter: 'Machilipatnam Block Studio', ware: 'Srikalahasti Tree of Life Panel', status: 'Humidity-Controlled Truck', qty: 30, cost: 88000, date: '2024-05-06' },
  { id: 'KPA-0011', painter: 'Pedana Kalamkari Centre', ware: 'Machilipatnam Mythological Hanging', status: 'Dark Dry Storage 18-22C', qty: 10, cost: 42000, date: '2024-05-18' },
  { id: 'KPA-0012', painter: 'Tirupati Temple Art Cooperative', ware: 'Kalamkari Dashavatara Mural', status: 'Natural Dye Colourfast QC', qty: 35, cost: 145000, date: '2024-05-30' },
  { id: 'KPA-0013', painter: 'Nellore Kalamkari Painters Colony', ware: 'AP Kalamkari Panchatantra Panel', status: 'GI Kalamkari Craft Mark', qty: 6, cost: 95000, date: '2024-06-12' },
  { id: 'KPA-0014', painter: 'Rajahmundry Pen Art Cluster', ware: 'Kalamkari Aranya Nature Motif', status: 'IS 16794 Kalamkari Art Grade A', qty: 7, cost: 75000, date: '2024-06-24' },
  { id: 'KPA-0015', painter: 'Kakinada Textile Art Society', ware: 'Kalamkari Bhagavata Purana Cloth', status: 'Cotton Roll Flat Pack', qty: 14, cost: 58000, date: '2024-07-06' },
  { id: 'KPA-0016', painter: 'Eluru Natural Dye Craft Studio', ware: 'AP Kalamkari Temple Canopy', status: 'Humidity-Controlled Truck', qty: 9, cost: 122000, date: '2024-07-18' },
  { id: 'KPA-0017', painter: 'Srikalahasti Pen Art Guild', ware: 'Kalamkari Dashavatara Mural', status: 'Dark Dry Storage 18-22C', qty: 5, cost: 68000, date: '2024-07-30' },
  { id: 'KPA-0018', painter: 'Machilipatnam Block Studio', ware: 'Srikalahasti Tree of Life Panel', status: 'Natural Dye Colourfast QC', qty: 22, cost: 38000, date: '2024-08-10' },
  { id: 'KPA-0019', painter: 'Pedana Kalamkari Centre', ware: 'AP Kalamkari Ramayana Scroll', status: 'GI Kalamkari Craft Mark', qty: 11, cost: 52000, date: '2024-08-22' },
  { id: 'KPA-0020', painter: 'Tirupati Temple Art Cooperative', ware: 'Machilipatnam Mythological Hanging', status: 'IS 16794 Kalamkari Art Grade A', qty: 16, cost: 86000, date: '2024-09-03' },
]

export default function KalamkariPenArtLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = [...kalamkariRecords, ...genRecords(21), ...genRecords(41)]

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
    <div className="kpa-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Kalamkari Pen Art AP' }]} />
      <PageHeader title="Kalamkari Pen Art Andhra Pradesh Logistics" description="Kalamkari pen art hand-painted textile supply chain with IS 16794 Kalamkari art compliance, natural dye colourfast QC, cotton roll flat pack packaging, and GI Kalamkari Craft Mark certification across 8 heritage artisan clusters in Srikalahasti, Machilipatnam, and Tirupati districts" />
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="bg-indigo-100">
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
            <HealthRing label="GI Tag" value={96} />
            <HealthRing label="IS 16794" value={91} />
            <HealthRing label="Cotton" value={87} />
            <HealthRing label="Humi Truck" value={82} />
            <HealthRing label="Dark Store" value={90} />
            <HealthRing label="Dye QC" value={94} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Artisan Families" value="50+" />
            <ValueTile label="Kalamkari Tradition" value="Since 16th C" />
            <ValueTile label="Export Markets" value="15 Countries" />
            <ValueTile label="Annual Revenue" value="₹6.8 Crore" />
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
            placeholder="Search Kalamkari pen art shipments..."
          />
          <div className="rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-indigo-100">
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
                  <tr key={record.id} className="border-t hover:bg-indigo-50/50">
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
              <CardHeader><CardTitle>Kalamkari Pen Art — 500-Year Andhra Pradesh Hand-Painted Textile Tradition</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Kalamkari is a profoundly significant hand-painted textile art tradition originating from the southern Indian state of Andhra Pradesh that has been continuously practised for over five centuries as a combined artistic and textile craft tradition where elaborate mythological narrative scenes from the Hindu epics and Puranas are meticulously painted onto cotton fabric using a bamboo pen dipped in natural vegetable dye solutions, creating large-scale narrative cloth panels and temple hangings that serve as visual storytelling media for religious education, temple decoration, and ceremonial purposes within the Telugu-speaking cultural regions of Andhra Pradesh where the two major Kalamkari traditions of Srikalahasti pen art and Machilipatnam block-printed Kalamkari have maintained distinct but complementary artistic identities over centuries of continuous creative practice. The Srikalahasti Kalamkari pen art tradition is characterised by the exclusive use of a handcrafted bamboo pen instrument known as a kalam that serves as both the drawing tool and the dye delivery mechanism, where the artisan fills the hollow bamboo shaft with natural dye solution and draws directly onto the prepared cotton fabric surface creating precise freehand lines and detailed figurative forms that cannot be replicated through block printing or screen printing techniques, with the entire narrative composition built up through successive applications of different natural dye colours each requiring separate kalam applications and intermediate mordant treatment processes that fix the vegetable dyes permanently into the cotton fibre substrate through complex chemical bonding reactions between the natural dye molecules and the metallic salt mordants prepared from alum iron and tannin-rich myrobalan fruit extract. The Kalamkari narrative repertoire encompasses the complete spectrum of Hindu mythological literature adapted into visual narrative format for the cotton cloth medium, including the most widely represented and commercially valued compositions such as the Ramayana narrative scrolls depicting the complete life story of Prince Rama from his birth through his fourteen-year exile, the battle against the demon king Ravana, and his triumphant return to Ayodhya rendered as a continuous sequential narrative across cloth panels measuring up to thirty metres in length, the Dashavatara series depicting the ten major incarnations of Lord Vishnu from Matsya the fish avatar through Kalki the future avatar in the distinctive Kalamkari figurative style characterised by bold outlined forms filled with flat colour areas using natural vegetable dye pigments, the Bhagavata Purana panels illustrating the sacred stories of Lord Krishna's divine pastimes and miraculous deeds drawn from the twelfth-century devotional text by Vyasa that forms the scriptural foundation for much of the Kalamkari narrative tradition practised in the temple town of Srikalahasti where approximately fifty active artisan families sustain this irreplaceable textile art heritage tradition across the Srikalahasti, Machilipatnam, and Pedana production centres of Andhra Pradesh.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>IS 16794 Kalamkari Art Standards & Natural Dye Colourfast QC</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">The IS 16794 standard for Kalamkari hand-painted textile art establishes India's first dedicated quality certification framework for this 500-year-old Andhra Pradesh textile painting tradition, specifying comprehensive requirements for natural vegetable dye composition derived from the Andhra ecological zone, hand-painted bamboo pen application technique verification, cotton fabric substrate quality parameters, colour fastness durability under tropical humidity conditions, and mythological narrative compositional accuracy that collectively distinguish authentic hand-painted Kalamkari textiles created by traditional artisan families from block-printed and screen-printed reproductions and mass-produced digital imitations that have increasingly appeared in both domestic Indian textile art markets and international online retail platforms serving collectors and museums seeking authenticated Kalamkari for cultural preservation and exhibition purposes. The natural vegetable dye composition requirements for IS 16794 Grade A certification mandate exclusively natural vegetable-derived pigments sourced from the Andhra Pradesh ecological zone, including deep red from the Alizarin lactone dye extracted from the roots of the Indian madder plant Rubia cordifolia cultivated across the Rayalaseema region for the vibrant red passages that dominate Kalamkari compositions depicting battle scenes and divine manifestations, indigo blue from the fermented Indigofera tinctoria plant leaves processed through traditional Andhra fermentation techniques for the auspicious blue zones representing divine figures and celestial elements, deep yellow from the pomegranate rind Punica granatum extract combined with alum mordant for the golden zones representing divine light and spiritual illumination, and iron-based black from the reaction between jaggery fermented iron filings and the myrobalan tannin mordant for the precise outline work that defines the figurative forms and decorative border patterns characteristic of the Kalamkari visual vocabulary, with spectrophotometric verification confirming natural vegetable dye origin and excluding any synthetic dye formulations including azo dyes, reactive dyes, and vat dye dispersions that produce characteristically different spectral absorption profiles detectable through laboratory analysis comparing sample dye crystalline structures against certified natural vegetable dye reference standards maintained in the IS 16794 standard appendix. Natural dye colourfast verification for Grade A certification mandates accelerated wash fastness testing through five standard wash cycles per ISO 105-C06 with maximum permitted colour change measured through CIELAB Delta E values not exceeding 5.0 units for red pigments and 3.0 units for indigo blue pigments, ensuring the natural vegetable dyes retain their original chromatic intensity and tonal depth under repeated washing and extended display conditions encountered during the multi-year lifecycle of authenticated Kalamkari textiles in temple, museum, and private collector environments.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Cotton Roll Flat Pack Packaging for Kalamkari Hand-Painted Textiles</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Cotton roll flat pack packaging has been specifically developed for the Kalamkari hand-painted textile logistics supply chain to protect the hand-painted natural vegetable dye surfaces, mythological narrative compositions, and cotton fabric substrates that characterise authentic Kalamkari textiles from the physical and environmental hazards encountered during transit from the Andhra Pradesh artisan workshops to domestic gallery destinations across Hyderabad, Delhi, and Chennai, and international export destinations serving the global textile art collector community in Europe, North America, and Southeast Asia where significant institutional and private collections of Indian textile art actively seek authenticated Kalamkari panels for acquisition and exhibition purposes requiring museum-quality preservation during international shipping through multiple climatic zones including the high-humidity coastal conditions of Andhra Pradesh and the varying temperature regimes encountered during air cargo transit to temperate international destinations. The packaging specification utilises plain weave unbleached cotton fabric with minimum grammage of 100 GSM and pH range 6.5 to 7.5 as the primary interleaving material providing a breathable protective layer compatible with the natural vegetable dye chemistry of Kalamkari textiles, preventing friction damage to the hand-painted surfaces while allowing adequate air circulation to prevent moisture condensation that could cause natural dye bleeding or cotton fibre degradation during transit through the humid coastal regions of Andhra Pradesh's Bay of Bengal coastline and the varying climatic conditions encountered during multi-modal transportation to international destinations. Each Kalamkari textile is inspected under standardised D65 daylight illumination verifying natural vegetable dye surface integrity, narrative scene compositional completeness, cotton fabric condition, and overall artistic quality before being interleaved with acid-free tissue paper between successive painted sections when the textile is partially unrolled for inspection, then carefully rolled around a custom-cut acid-free cardboard tube with the painted surface facing outward to prevent pigment-to-pigment contact during rolled storage, secured with cotton tying tape at four equidistant points along the roll length, and placed within a rigid outer shipping container constructed from 5-millimetre double-wall corrugated fibreboard with internal cushioning strips of polyethylene foam at all four edges providing shock absorption protection against the impact and vibration forces encountered during road transport from the artisan workshops through Andhra Pradesh's highway distribution networks and subsequent air cargo transit to international destinations serving the global demand for authenticated Indian hand-painted textile art.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>AI Bamboo Pen Stroke Authentication & Kalamkari Heritage Market Expansion</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Artificial intelligence and computational image analysis technologies are being progressively deployed to authenticate Kalamkari hand-painted textiles and verify the distinctive bamboo pen stroke patterns, natural vegetable dye spectral signatures, and mythological narrative compositions that distinguish genuine Kalamkari artworks created by traditional Andhra Pradesh artisan families from the growing volume of block-printed, screen-printed, and digitally printed reproductions that have increasingly appeared in both domestic Indian textile art markets and international online retail platforms serving the global demand for authenticated Indian hand-painted textile art. The AI authentication system for Kalamkari employs ultra-high-resolution scanning at 4800 dots per inch combined with multispectral imaging across the visible and near-infrared spectrum from 400 to 900 nanometres wavelength range to capture the complete surface topography and natural vegetable dye composition of finished Kalamkari textiles, analysing the hand-painted bamboo pen stroke direction and pressure patterns characteristic of the traditional kalam instrument where the artisan controls dye flow through the hollow bamboo shaft by adjusting finger pressure on the cotton wool reservoir plug creating distinctive line width variations that reflect the artisan's hand-eye coordination and cannot be replicated by mechanical printing processes, the natural vegetable dye particle distribution characteristics that differ fundamentally from the uniform pigment dispersion of synthetic printing inks and reactive dye formulations used in commercial textile printing, and the mythological narrative scene compositional accuracy within the established Kalamkari canons that define the spatial arrangement of divine figures, architectural elements, natural landscape features, sequential narrative frame borders, and decorative pattern elements according to the specific visual vocabulary of the Srikalahasti and Machilipatnam Kalamkari painting traditions transmitted through generations of artisan families over five centuries of continuous creative practice in the Andhra Pradesh textile art heartland. Machine learning algorithms trained on authenticated Kalamkari reference samples from all major production centres can verify artwork authenticity with 96% accuracy by detecting subtle hand-painting signatures including the characteristic bamboo pen stroke width variation that reflects the artisan's finger pressure modulation during kalam instrument application, the natural vegetable dye particle aggregation patterns visible through high-magnification imaging that differ fundamentally from machine-printed pigment deposition, and the narrative scene proportion accuracy within the established Kalamkari canons that define the spatial arrangement of Ramayana sequential narrative panels, Dashavatara divine incarnation compositions, and decorative border patterns according to the specific visual vocabulary of the Andhra Pradesh Kalamkari hand-painted textile tradition as practised across approximately fifty active artisan families in the Srikalahasti, Machilipatnam, Pedana, and Tirupati production centres where this unique combination of bamboo pen technique, natural vegetable dye chemistry, and Hindu mythological narrative art continues to sustain one of India's most technically demanding and culturally significant textile art heritage traditions.</p></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
