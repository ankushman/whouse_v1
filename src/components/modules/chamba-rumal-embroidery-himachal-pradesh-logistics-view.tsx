import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#1e40af', '#1e3a8a', '#172554', '#1e1b4b', '#2563eb', '#3730a3', '#312e81', '#eff6ff']
const PRODUCTS = ['Chamba Rumal Pahari Landscape', 'HP Chamba Krishna Leela Panel', 'Chamba Gaddi Wedding Rumal', 'Chamba Devi Worship Embroidery', 'HP Chamba Floral Vine Rumal', 'Chamba Hunting Scene Panel', 'HP Chamba Tree of Life Rumal', 'Chamba Palace Court Scene']
const ARTISANS = ['Chamba Rumal Embroidery Guild', 'Dalhousie Hand-Stitch Society', 'Kangra Pahari Art Cooperative', 'Dharamshala Heritage Stitch Centre', 'Bharmour Chamba Art Studio', 'Palampur Rumal Craft Colony', 'Mandi Chamba Needle Cluster', 'Sundernagar Chamba Tradition Society']
const STATUSES = ['GI Chamba Rumal Mark', 'IS 16638 Rumal Embroidery Grade A', 'Muslin Roll Tissue Interleave', 'Palletised Truck Transit', 'Dry Storage 15-25C', 'Silk Floss Colour QC']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="w-24 h-2 bg-blue-200 rounded-full overflow-hidden"><div className="h-full bg-blue-700 rounded-full" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ label, value, size = 80 }: { label: string; value: number; size?: number }) => {
  const r = (size - 12) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#eff6ff" strokeWidth="6" />
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
    id: `CRE-${String(offset + i + 1).padStart(4, '0')}`,
    painter: ARTISANS[(offset + i) % ARTISANS.length], ware: PRODUCTS[(offset + i) % PRODUCTS.length],
    status: STATUSES[(offset + i) % STATUSES.length], qty: ri(1, 35, ((offset + i) * 31) % 35) + 1,
    cost: ri(5000, 98000, ((offset + i) * 14173) % 93000) + 5000,
    date: new Date(2024, ((offset + i) % 12), ri(1, 28, (offset + i) % 28)).toISOString().slice(0, 10),
  }))

const chambaRecords = [
  { id: 'CRE-0001', painter: 'Chamba Rumal Embroidery Guild', ware: 'Chamba Rumal Pahari Landscape', status: 'GI Chamba Rumal Mark', qty: 4, cost: 52000, date: '2024-01-12' },
  { id: 'CRE-0002', painter: 'Dalhousie Hand-Stitch Society', ware: 'HP Chamba Krishna Leela Panel', status: 'IS 16638 Rumal Embroidery Grade A', qty: 6, cost: 38000, date: '2024-01-25' },
  { id: 'CRE-0003', painter: 'Kangra Pahari Art Cooperative', ware: 'Chamba Gaddi Wedding Rumal', status: 'Muslin Roll Tissue Interleave', qty: 3, cost: 68000, date: '2024-02-08' },
  { id: 'CRE-0004', painter: 'Dharamshala Heritage Stitch Centre', ware: 'Chamba Devi Worship Embroidery', status: 'Palletised Truck Transit', qty: 8, cost: 25000, date: '2024-02-20' },
  { id: 'CRE-0005', painter: 'Bharmour Chamba Art Studio', ware: 'HP Chamba Floral Vine Rumal', status: 'Dry Storage 15-25C', qty: 5, cost: 74000, date: '2024-03-05' },
  { id: 'CRE-0006', painter: 'Palampur Rumal Craft Colony', ware: 'Chamba Hunting Scene Panel', status: 'Silk Floss Colour QC', qty: 7, cost: 42000, date: '2024-03-18' },
  { id: 'CRE-0007', painter: 'Mandi Chamba Needle Cluster', ware: 'HP Chamba Tree of Life Rumal', status: 'GI Chamba Rumal Mark', qty: 4, cost: 66000, date: '2024-03-30' },
  { id: 'CRE-0008', painter: 'Sundernagar Chamba Tradition Society', ware: 'Chamba Palace Court Scene', status: 'IS 16638 Rumal Embroidery Grade A', qty: 9, cost: 21000, date: '2024-04-12' },
  { id: 'CRE-0009', painter: 'Chamba Rumal Embroidery Guild', ware: 'HP Chamba Krishna Leela Panel', status: 'Muslin Roll Tissue Interleave', qty: 5, cost: 55000, date: '2024-04-24' },
  { id: 'CRE-0010', painter: 'Dalhousie Hand-Stitch Society', ware: 'Chamba Rumal Pahari Landscape', status: 'Palletised Truck Transit', qty: 6, cost: 34000, date: '2024-05-06' },
  { id: 'CRE-0011', painter: 'Kangra Pahari Art Cooperative', ware: 'Chamba Gaddi Wedding Rumal', status: 'Dry Storage 15-25C', qty: 3, cost: 70000, date: '2024-05-18' },
  { id: 'CRE-0012', painter: 'Dharamshala Heritage Stitch Centre', ware: 'Chamba Devi Worship Embroidery', status: 'Silk Floss Colour QC', qty: 8, cost: 40000, date: '2024-05-30' },
  { id: 'CRE-0013', painter: 'Bharmour Chamba Art Studio', ware: 'HP Chamba Floral Vine Rumal', status: 'GI Chamba Rumal Mark', qty: 5, cost: 28000, date: '2024-06-12' },
  { id: 'CRE-0014', painter: 'Palampur Rumal Craft Colony', ware: 'Chamba Hunting Scene Panel', status: 'IS 16638 Rumal Embroidery Grade A', qty: 7, cost: 78000, date: '2024-06-24' },
  { id: 'CRE-0015', painter: 'Mandi Chamba Needle Cluster', ware: 'HP Chamba Tree of Life Rumal', status: 'Muslin Roll Tissue Interleave', qty: 4, cost: 60000, date: '2024-07-06' },
  { id: 'CRE-0016', painter: 'Sundernagar Chamba Tradition Society', ware: 'Chamba Palace Court Scene', status: 'Palletised Truck Transit', qty: 10, cost: 20000, date: '2024-07-18' },
  { id: 'CRE-0017', painter: 'Chamba Rumal Embroidery Guild', ware: 'Chamba Devi Worship Embroidery', status: 'Dry Storage 15-25C', qty: 3, cost: 72000, date: '2024-07-30' },
  { id: 'CRE-0018', painter: 'Dalhousie Hand-Stitch Society', ware: 'Chamba Rumal Pahari Landscape', status: 'Silk Floss Colour QC', qty: 6, cost: 36000, date: '2024-08-10' },
  { id: 'CRE-0019', painter: 'Kangra Pahari Art Cooperative', ware: 'HP Chamba Krishna Leela Panel', status: 'GI Chamba Rumal Mark', qty: 5, cost: 50000, date: '2024-08-22' },
  { id: 'CRE-0020', painter: 'Dharamshala Heritage Stitch Centre', ware: 'Chamba Gaddi Wedding Rumal', status: 'IS 16638 Rumal Embroidery Grade A', qty: 8, cost: 58000, date: '2024-09-03' },
]

export default function ChambaRumalEmbroideryHimachalPradeshLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = [...chambaRecords, ...genRecords(21), ...genRecords(41)]

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
    <div className="cre-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Chamba Rumal Embroidery HP' }]} />
      <PageHeader title="Chamba Rumal Embroidery Himachal Pradesh Logistics" description="Chamba Rumal hand-embroidered textile supply chain with IS 16638 rumal embroidery compliance, silk floss colour QC, muslin roll tissue interleave packaging, and GI Chamba Rumal Mark certification across 8 heritage artisan clusters in Chamba, Kangra, and Dharamshala districts" />
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="bg-blue-100">
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
            <HealthRing label="IS 16638" value={90} />
            <HealthRing label="Muslin" value={86} />
            <HealthRing label="Truck" value={83} />
            <HealthRing label="Dry Store" value={88} />
            <HealthRing label="Floss QC" value={92} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Artisan Families" value="25+" />
            <ValueTile label="Chamba Tradition" value="Since 17th C" />
            <ValueTile label="Export Markets" value="8 Countries" />
            <ValueTile label="Annual Revenue" value="₹1.9 Crore" />
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
            placeholder="Search Chamba Rumal embroidery shipments..."
          />
          <div className="rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-blue-100">
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
                  <tr key={record.id} className="border-t hover:bg-blue-50/50">
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
              <CardHeader><CardTitle>Chamba Rumal — 400-Year Himachal Pahari Hand Embroidery Tradition</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Chamba Rumal is a uniquely distinctive hand-embroidered textile art tradition originating from the Chamba region of Himachal Pradesh that has been continuously practised for over four centuries as both a refined court art form and a domestic ritual textile practice where intricate narrative scenes from the Pahari miniature painting tradition are meticulously rendered in silk floss thread on fine muslin cotton fabric using the double satin stitch technique known as do-rookha that produces an identical appearance on both sides of the embroidered textile, creating a reversible handkerchief-sized cloth known as a Rumal that historically served as a ceremonial gift item presented during weddings, religious festivals, and diplomatic exchanges within the Pahari court culture of the Chamba and Kangra kingdoms where the embroidery tradition reached its highest artistic expression under the patronage of the Chamba royal family during the seventeenth and eighteenth centuries. The Chamba Rumal embroidery technique involves tracing a design outline derived from Pahari miniature painting compositions onto hand-woven unbleached cotton muslin fabric using a charcoal or iron gall solution transferred from a perforated paper pattern, then filling the outlined design areas with uniformly spaced parallel satin stitches executed in untwisted silk floss thread of varying natural dye colours that create smooth colour transitions across the embroidered surface producing the characteristic painterly quality that distinguishes Chamba Rumal from other Indian textile embroidery traditions where the embroidery typically follows geometric or repeating pattern formats rather than the figurative narrative compositions drawn from the rich visual vocabulary of Pahari miniature painting. The narrative themes depicted on Chamba Rumal embroideries encompass an extensive repertoire drawn from Hindu mythology and Pahari court life, including the most commonly represented subjects such as the Krishna Leela panels portraying the divine pastimes of Lord Krishna in the pastoral landscapes of Vrindavan and Gokul adapted into the visual vocabulary of the Kangra Valley Pahari painting tradition, the Devi worship panels depicting the various forms of the Hindu mother goddess in the distinctive Pahari artistic style characterised by graceful female figures with prominent eyes and flowing drapery, the Gaddi tribal wedding scenes documenting the traditional marriage ceremonies of the Gaddi pastoral community that has inhabited the Chamba and Kangra hill regions for centuries, and the elaborate palace court scenes depicting the royal court life processions, hunting expeditions, and festival celebrations of the Chamba kings whose patronage sustained the Chamba Rumal embroidery tradition at its artistic peak during the golden age of Pahari court culture in the seventeenth and eighteenth centuries when master embroiderers from the Chamba royal atelier created the finest surviving examples of this irreplaceable textile art tradition that continues to be maintained by approximately twenty-five active artisan families across the Chamba, Kangra, and Dharamshala districts of present-day Himachal Pradesh.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>IS 16638 Rumal Embroidery Standards & Silk Floss Colour QC</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">The IS 16638 standard for Chamba Rumal embroidery establishes India's first dedicated quality certification framework for this 400-year-old Himachal Pahari hand-embroidered textile tradition, specifying comprehensive requirements for silk floss thread composition and quality, double satin stitch technique verification, muslin cotton fabric substrate parameters, embroidery stitch density and uniformity standards, and Pahari miniature painting narrative compositional accuracy that collectively distinguish authentic Chamba Rumal textiles created by traditional Himachali artisan families from machine-embroidered reproductions and mass-produced printed imitations that have increasingly appeared in both domestic Indian handicraft markets and international online retail platforms serving collectors and museums seeking authenticated Chamba Rumal for cultural preservation and exhibition purposes. The silk floss thread composition requirements for IS 16638 Grade A certification mandate exclusively natural silk floss thread with minimum denier count of 120 and twist factor not exceeding 2.0 turns per centimetre ensuring the thread remains sufficiently untwisted to produce the smooth satin stitch surface characteristic of authentic Chamba Rumal embroidery, with natural dye colour specifications mandating vegetable-derived dyes sourced from the Himachal Himalayan ecological zone including madder root red from the Rubia cordifolia plant cultivated in the Kangra valley foothills for the vibrant red passages depicting devotional and ceremonial scenes, indigo blue from the Indigofera tinctoria plant processed through traditional Himachali fermentation techniques for the auspicious blue zones representing divine figures and celestial elements, turmeric yellow from locally cultivated Curcuma longa rhizomes for the golden zones representing divine light and spiritual illumination, and iron-based black from rusting iron filings fermented in jaggery and tamarind solution for the precise outline work that defines the figurative forms and decorative border patterns characteristic of the Chamba Rumal visual vocabulary derived from the Pahari miniature painting tradition of the Kangra and Chamba court ateliers. Silk floss colour fastness verification for Grade A certification mandates accelerated wash fastness testing through five standard wash cycles per ISO 105-C06 with maximum permitted colour change measured through CIELAB Delta E values not exceeding 4.0 units for the primary red silk floss and 3.0 units for the indigo blue silk floss, ensuring the natural dyes retain their original chromatic saturation and tonal depth under the repeated gentle hand-washing conditions that characterise the traditional care methods employed by the Chamba Rumal owning families and institutional collectors who maintain authenticated Chamba Rumal textiles in active preservation conditions.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Muslin Roll Tissue Interleave Packaging for Chamba Rumal Textiles</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Muslin roll packaging with acid-free tissue interleave has been specifically developed for the Chamba Rumal embroidery logistics supply chain to protect the hand-embroidered silk floss surfaces, delicate narrative compositions, and fine muslin cotton fabric substrates that characterise authentic Chamba Rumal textiles from the physical and environmental hazards encountered during transit from the Himachal Pradesh artisan workshops to domestic gallery destinations across Shimla, Delhi, and Chandigarh, and international export destinations serving the global Pahari art collector community in Europe, North America, and Japan where significant institutional and private collections of Indian miniature painting and textile art actively seek authenticated Chamba Rumal embroideries for acquisition and exhibition purposes that require museum-quality preservation during international shipping through multiple climatic zones. The packaging specification utilises plain weave unbleached cotton muslin with minimum grammage of 80 GSM and pH range 6.5 to 7.5 as the primary interleaving material providing a soft breathable protective layer that prevents friction damage to the delicate silk floss embroidery surfaces while allowing adequate air circulation to prevent moisture condensation that could cause natural dye bleeding or silk thread degradation during transit through the varying climatic conditions encountered along the mountainous transport routes connecting the Chamba district artisan production centres in the Himalayan foothills to the major urban distribution hubs of Shimla and Chandigarh and subsequently through the plains transport networks to international cargo terminals. Each Chamba Rumal textile is inspected under standardised D65 daylight illumination verifying silk floss embroidery surface integrity, stitch uniformity and density, Pahari miniature painting narrative compositional accuracy, muslin fabric condition, and overall artistic quality before being interleaved with acid-free tissue paper between the embroidered surface and the muslin wrapping layer, then carefully rolled around a custom-cut acid-free cardboard tube with the embroidered surface facing outward to prevent silk floss-to-floss contact that could cause thread abrasion or snagging during transit, secured with cotton tying tape at three equidistant points along the roll length, and placed within a rigid outer shipping container constructed from 5-millimetre double-wall corrugated fibreboard with internal cushioning strips of polyethylene foam at all four edges providing shock absorption protection against the impact and vibration forces encountered during road transport through the Himalayan mountain roads connecting the Chamba district production centres to the national highway network and subsequent air cargo transit to international destinations.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>AI Stitch Pattern Verification & Chamba Rumal Heritage Market Development</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Artificial intelligence and computational image analysis technologies are being progressively deployed to authenticate Chamba Rumal textiles and verify the distinctive hand-embroidered satin stitch patterns, silk floss thread quality characteristics, and Pahari miniature painting narrative compositions that distinguish genuine Chamba Rumal embroideries created by traditional Himachali artisan families from the growing volume of machine-embroidered reproductions and digitally printed imitations that have increasingly appeared in both domestic Indian handicraft markets and international online retail platforms serving the global demand for authenticated Indian textile art. The AI authentication system for Chamba Rumal employs ultra-high-resolution scanning at 4800 dots per inch combined with multispectral imaging across the visible and near-infrared spectrum from 400 to 900 nanometres wavelength range to capture the complete surface topography and silk floss thread composition of finished Chamba Rumal textiles, analysing the hand-embroidered satin stitch direction and spacing uniformity patterns characteristic of the traditional Chamba artisan's do-rookha double satin stitch technique where each stitch must be precisely parallel and uniformly spaced to produce the smooth reversible surface that is the defining technical characteristic of authentic Chamba Rumal embroidery, the natural silk floss thread surface texture characteristics that differ fundamentally from the uniform sheen of machine embroidery polyester threads, and the narrative scene compositional accuracy within the established Pahari miniature painting canons that define the spatial arrangement of divine figures, architectural elements, natural landscape features, and decorative border patterns according to the specific visual vocabulary of the Chamba Rumal embroidery tradition derived from the Kangra and Chamba Pahari miniature painting schools. Machine learning algorithms trained on authenticated Chamba Rumal reference samples from all major production centres can verify artwork authenticity with 95% accuracy by detecting subtle hand-embroidery signatures including the characteristic stitch length variation reflecting the artisan's hand-eye coordination during the painstaking do-rookha satin stitch execution where each square centimetre of embroidered surface requires between 400 and 600 individual stitches placed with sub-millimetre precision, the natural silk floss thread luster variation patterns visible through high-magnification imaging that differ fundamentally from the synthetic sheen of machine embroidery threads, and the compositional proportion accuracy within the established Chamba Rumal canons that define the spatial arrangement of Pahari miniature painting elements transposed into the embroidered textile medium according to the specific visual vocabulary maintained across approximately twenty-five active artisan families in the Chamba, Kangra, and Dharamshala production centres of Himachal Pradesh where this unique combination of Pahari miniature painting aesthetics and reverse-side embroidery technique continues to sustain one of India's most technically demanding and visually exquisite textile art heritage traditions.</p></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
