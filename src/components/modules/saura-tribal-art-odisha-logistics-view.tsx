import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#854d0e', '#713f12', '#365314', '#1a2e05', '#a16207', '#4d7c0f', '#3f6212', '#fef9c3']
const PRODUCTS = ['Saura Tree of Life Canvas', 'OD Saura Ritual Wall Panel', 'Saura Community Harvest Mural', 'OD Saura Spirit Horse Art', 'Saura Sacred Fish Pond Panel', 'Saura Celestial Sun Motif Art', 'OD Saura Forest Canopy Canvas', 'Saura Tribal Dance Scene']
const ARTISANS = ['Koraput Saura Tribal Art Guild', 'Rayagada Saura Painting Society', 'Ganjam Saura Heritage Cooperative', 'Malkangiri Saura Art Centre', 'Nabarangpur Saura Craft Studio', 'Gajapati Saura Wall Art Colony', 'Phulbani Saura Artisan Cluster', 'Boudh Saura Traditional Society']
const STATUSES = ['GI Saura Art Mark', 'IS 16734 Saura Art Grade A', 'Canvas Flat Wrap Pack', 'Enclosed Truck Transit', 'Dry Storage 18-28C', 'Natural Mineral Pigment QC']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-lime-100 text-lime-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="w-24 h-2 bg-lime-200 rounded-full overflow-hidden"><div className="h-full bg-lime-700 rounded-full" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ label, value, size = 80 }: { label: string; value: number; size?: number }) => {
  const r = (size - 12) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#fef9c3" strokeWidth="6" />
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
    id: `STA-${String(offset + i + 1).padStart(4, '0')}`,
    painter: ARTISANS[(offset + i) % ARTISANS.length], ware: PRODUCTS[(offset + i) % PRODUCTS.length],
    status: STATUSES[(offset + i) % STATUSES.length], qty: ri(1, 35, ((offset + i) * 31) % 35) + 1,
    cost: ri(5000, 98000, ((offset + i) * 14173) % 93000) + 5000,
    date: new Date(2024, ((offset + i) % 12), ri(1, 28, (offset + i) % 28)).toISOString().slice(0, 10),
  }))

const sauraRecords = [
  { id: 'STA-0001', painter: 'Koraput Saura Tribal Art Guild', ware: 'Saura Tree of Life Canvas', status: 'GI Saura Art Mark', qty: 5, cost: 45000, date: '2024-01-12' },
  { id: 'STA-0002', painter: 'Rayagada Saura Painting Society', ware: 'OD Saura Ritual Wall Panel', status: 'IS 16734 Saura Art Grade A', qty: 7, cost: 38000, date: '2024-01-25' },
  { id: 'STA-0003', painter: 'Ganjam Saura Heritage Cooperative', ware: 'Saura Community Harvest Mural', status: 'Canvas Flat Wrap Pack', qty: 4, cost: 62000, date: '2024-02-08' },
  { id: 'STA-0004', painter: 'Malkangiri Saura Art Centre', ware: 'OD Saura Spirit Horse Art', status: 'Enclosed Truck Transit', qty: 8, cost: 28000, date: '2024-02-20' },
  { id: 'STA-0005', painter: 'Nabarangpur Saura Craft Studio', ware: 'Saura Sacred Fish Pond Panel', status: 'Dry Storage 18-28C', qty: 3, cost: 72000, date: '2024-03-05' },
  { id: 'STA-0006', painter: 'Gajapati Saura Wall Art Colony', ware: 'Saura Celestial Sun Motif Art', status: 'Natural Mineral Pigment QC', qty: 6, cost: 48000, date: '2024-03-18' },
  { id: 'STA-0007', painter: 'Phulbani Saura Artisan Cluster', ware: 'OD Saura Forest Canopy Canvas', status: 'GI Saura Art Mark', qty: 4, cost: 68000, date: '2024-03-30' },
  { id: 'STA-0008', painter: 'Boudh Saura Traditional Society', ware: 'Saura Tribal Dance Scene', status: 'IS 16734 Saura Art Grade A', qty: 9, cost: 24000, date: '2024-04-12' },
  { id: 'STA-0009', painter: 'Koraput Saura Tribal Art Guild', ware: 'OD Saura Ritual Wall Panel', status: 'Canvas Flat Wrap Pack', qty: 5, cost: 52000, date: '2024-04-24' },
  { id: 'STA-0010', painter: 'Rayagada Saura Painting Society', ware: 'Saura Tree of Life Canvas', status: 'Enclosed Truck Transit', qty: 7, cost: 36000, date: '2024-05-06' },
  { id: 'STA-0011', painter: 'Ganjam Saura Heritage Cooperative', ware: 'Saura Community Harvest Mural', status: 'Dry Storage 18-28C', qty: 4, cost: 65000, date: '2024-05-18' },
  { id: 'STA-0012', painter: 'Malkangiri Saura Art Centre', ware: 'OD Saura Spirit Horse Art', status: 'Natural Mineral Pigment QC', qty: 6, cost: 42000, date: '2024-05-30' },
  { id: 'STA-0013', painter: 'Nabarangpur Saura Craft Studio', ware: 'Saura Sacred Fish Pond Panel', status: 'GI Saura Art Mark', qty: 8, cost: 30000, date: '2024-06-12' },
  { id: 'STA-0014', painter: 'Gajapati Saura Wall Art Colony', ware: 'Saura Celestial Sun Motif Art', status: 'IS 16734 Saura Art Grade A', qty: 3, cost: 75000, date: '2024-06-24' },
  { id: 'STA-0015', painter: 'Phulbani Saura Artisan Cluster', ware: 'OD Saura Forest Canopy Canvas', status: 'Canvas Flat Wrap Pack', qty: 10, cost: 22000, date: '2024-07-06' },
  { id: 'STA-0016', painter: 'Boudh Saura Traditional Society', ware: 'Saura Tribal Dance Scene', status: 'Enclosed Truck Transit', qty: 5, cost: 58000, date: '2024-07-18' },
  { id: 'STA-0017', painter: 'Koraput Saura Tribal Art Guild', ware: 'OD Saura Spirit Horse Art', status: 'Dry Storage 18-28C', qty: 4, cost: 70000, date: '2024-07-30' },
  { id: 'STA-0018', painter: 'Rayagada Saura Painting Society', ware: 'Saura Tree of Life Canvas', status: 'Natural Mineral Pigment QC', qty: 7, cost: 35000, date: '2024-08-10' },
  { id: 'STA-0019', painter: 'Ganjam Saura Heritage Cooperative', ware: 'OD Saura Ritual Wall Panel', status: 'GI Saura Art Mark', qty: 6, cost: 48000, date: '2024-08-22' },
  { id: 'STA-0020', painter: 'Malkangiri Saura Art Centre', ware: 'Saura Community Harvest Mural', status: 'IS 16734 Saura Art Grade A', qty: 5, cost: 56000, date: '2024-09-03' },
]

export default function SauraTribalArtOdishaLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = [...sauraRecords, ...genRecords(21), ...genRecords(41)]

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
    <div className="sta-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Saura Tribal Art Odisha' }]} />
      <PageHeader title="Saura Tribal Art Odisha Logistics" description="Saura tribal wall mural supply chain with IS 16734 Saura art compliance, natural mineral pigment QC, canvas flat wrap packaging, and GI Saura Art Mark certification across 8 heritage artisan clusters in Koraput, Rayagada, and Ganjam districts of Odisha" />
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="bg-lime-100">
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
            <HealthRing label="GI Tag" value={91} />
            <HealthRing label="IS 16734" value={87} />
            <HealthRing label="Canvas" value={84} />
            <HealthRing label="Truck" value={80} />
            <HealthRing label="Dry Store" value={89} />
            <HealthRing label="Pigment QC" value={93} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Artisan Families" value="30+" />
            <ValueTile label="Saura Tradition" value="Since 15th C" />
            <ValueTile label="Export Markets" value="6 Countries" />
            <ValueTile label="Annual Revenue" value="₹2.1 Crore" />
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
            placeholder="Search Saura tribal art shipments..."
          />
          <div className="rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-lime-100">
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
                  <tr key={record.id} className="border-t hover:bg-lime-50/50">
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
              <CardHeader><CardTitle>Saura Tribal Art — 600-Year Odisha Wall Mural Tradition</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Saura tribal art is a profoundly significant wall painting tradition originating from the Saura tribal communities of southern Odisha that has been continuously practised for over six centuries as both a sacred ritual practice and a vibrant visual art form where the distinctive Saura geometric and figurative motifs are painted on the mud-plastered walls of tribal homes, community gathering spaces, and grain storage structures using naturally derived mineral and vegetable pigments applied with handcrafted bamboo brushes and cotton fibre applicators, creating elaborate compositions that document the Saura community's spiritual cosmology, agricultural lifecycle, social customs, and deeply animistic relationship with the natural environment of the Eastern Ghats hill ranges that define the tribal heartland of Koraput, Rayagada, Ganjam, and Malkangiri districts where the approximately 30 remaining active Saura artist families sustain this irreplaceable tribal visual heritage tradition. The Saura painting tradition is characterised by its distinctive visual vocabulary of geometric forms including concentric circles, triangles, and rectangles that are combined with stylised human figures, animal forms, plant motifs, and architectural elements to create complex narrative compositions that serve multiple functions within Saura tribal society: the Ittal or sacred wall murals painted during the birth ceremonies and wedding rituals of Saura community members serve as spiritual protection for the household and its inhabitants; the Idital or ceremonial wall paintings created during agricultural festivals and harvest celebrations document the community's relationship with the land, the monsoon cycle, and the bounty of the Eastern Ghats forests that provide the Saura people with forest produce, medicinal plants, and building materials essential for their traditional way of life. The central motif in most Saura wall paintings is the iconic Tree of Life composition known as the Saura Life Tree or Marang Ghar that represents the tribal community's understanding of cosmic interconnectedness between the earthly realm of human existence, the spirit world of ancestral guardians and nature deities, and the celestial sphere of sun, moon, and stars that together form the Saura cosmological framework governing all aspects of tribal life from agricultural planting cycles to community governance decisions and individual life stage transition ceremonies marking birth, puberty, marriage, and death within the continuous cycle of Saura tribal existence maintained across generations of unbroken cultural practice in the Odisha tribal heartland.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>IS 16734 Saura Art Standards & Natural Mineral Pigment QC</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">The IS 16734 standard for Saura tribal art establishes India's first dedicated quality certification framework for the distinctive Odisha tribal wall painting tradition transposed onto canvas and textile substrates for commercial and cultural preservation purposes, specifying comprehensive requirements for natural mineral pigment composition derived from the Odisha geological zone, hand-painted application technique verification using traditional bamboo brush methods, canvas fabric substrate quality parameters, colour fastness durability under tropical monsoon conditions, and geometric motif accuracy assessment that collectively distinguish authentic Saura art panels created by tribal artisans from machine-printed reproductions and mass-produced imitations that have increasingly appeared in both domestic Indian tribal art markets and international online retail platforms serving collectors and museums seeking authentic Indian tribal wall art for exhibition and cultural preservation purposes. The natural mineral pigment composition requirements for IS 16734 Grade A certification mandate exclusively natural mineral-derived pigments sourced from the Odisha Eastern Ghats geological zone, including deep red ochre from the laterite iron-rich soil deposits of Koraput and Rayagada districts for the vibrant red passages that dominate Saura wall compositions depicting sacred ritual scenes and community life narratives, yellow ochre from the weathered granite formations of the Malkangiri hill ranges for the golden zones representing celestial sun motifs and harvest abundance celebrations, white kaolin clay from the Ganjam coastal deposits for the pure white geometric border patterns and sacred symbol elements that frame Saura compositions, and carbon black from charred Mahua and Sal wood soot mixed with tamarind seed gum binder for the bold black outline elements that define the distinctive Saura geometric aesthetic characterised by precise triangular and circular forms rendered in bold black contours that create the visual framework for all Saura mural compositions, with spectrophotometric verification confirming natural mineral origin and excluding any synthetic pigment formulations including azo dyes, reactive pigments, and industrial colour dispersions that produce characteristically different spectral absorption profiles detectable through laboratory analysis comparing sample pigment crystalline structures against certified natural mineral pigment reference standards maintained in the IS 16734 standard appendix.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Canvas Flat Wrap Packaging for Saura Tribal Art Panels</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Canvas flat wrap packaging has been specifically developed for the Saura tribal art logistics supply chain to protect the hand-painted natural mineral pigment surfaces, geometric and figurative mural compositions, and cotton canvas fabric substrates that characterise authentic Saura art panels transposed from traditional wall painting onto portable canvas formats for commercial distribution and cultural preservation purposes, protecting these delicate artworks from the physical and environmental hazards encountered during transit from the Odisha tribal artisan workshops to domestic art gallery destinations across Bhubaneswar, Delhi, and Mumbai, and international export destinations serving the global tribal art collector community in Europe, North America, and East Asia where significant institutional and private collections of Indian tribal and folk art actively seek authenticated Saura wall art panels for acquisition and exhibition purposes requiring museum-quality preservation during international shipping through multiple climatic zones. The packaging specification utilises plain weave cotton canvas with minimum grammage of 140 GSM and pH range 6.5 to 7.5 as the primary substrate material for the Saura art panels themselves, with each completed panel inspected under standardised D65 daylight illumination verifying natural mineral pigment surface integrity, geometric motif compositional accuracy, canvas fabric condition, and overall artistic quality before being wrapped in acid-free tissue paper as an interleaving protective layer between the painted surface and a rigid corrugated fibreboard backing sheet that prevents flexural stress damage during transit, then encased within a clear polyester protective sleeve providing moisture barrier protection against the high-humidity conditions encountered during monsoon season logistics operations across Odisha's coastal and riverine transport networks connecting the tribal artisan production centres in the Koraput and Rayagada hill districts to the major urban distribution hubs and subsequently placed within a rigid outer shipping container constructed from 5-millimetre double-wall corrugated fibreboard with internal cushioning strips of polyethylene foam at all four edges and corner protection inserts providing comprehensive shock absorption against the impact and vibration forces encountered during road transport through the mountainous Eastern Ghats road network and subsequent multi-modal transportation to international destinations serving the global demand for authenticated Indian tribal art.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>AI Geometric Motif Authentication & Saura Tribal Art Heritage Preservation</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Artificial intelligence and computational geometric analysis technologies are being progressively deployed to authenticate Saura tribal art panels and verify the distinctive hand-painted geometric patterns, natural mineral pigment signatures, and figurative motif compositions that distinguish genuine Saura artworks created by Odisha's Saura tribal artisan communities from the growing volume of machine-printed reproductions and digitally copied imitations that have increasingly appeared in both domestic Indian tribal art markets and international online retail platforms serving the global demand for authentic Indian tribal wall art. The AI authentication system for Saura art employs ultra-high-resolution scanning at 4800 dots per inch combined with multispectral imaging across the visible and near-infrared spectrum from 400 to 900 nanometres wavelength range to capture the complete surface topography and pigment composition of finished Saura art panels, analysing the hand-painted geometric element precision and spacing patterns characteristic of the Saura artisan's traditional bamboo brush technique, natural mineral pigment particle distribution characteristics that differ fundamentally from the uniform pigment dispersion of synthetic printing inks, and the compositional proportion accuracy within the established Saura geometric canons that define the spatial arrangement of Tree of Life central motifs, concentric circle border elements, triangular figurative forms, and ceremonial narrative scene frameworks according to the specific visual vocabulary of the Odisha Saura tribal painting tradition transmitted through generations of Saura families over six centuries of continuous cultural practice in the Eastern Ghats tribal heartland. Machine learning algorithms trained on authenticated Saura reference samples can verify artwork authenticity with 93% accuracy by detecting subtle hand-painting signatures including the characteristic geometric line width variation reflecting the tribal artisan's hand-eye coordination during bamboo brush application, the natural mineral pigment particle aggregation patterns visible through high-magnification imaging that differ fundamentally from machine-printed pigment deposition, and the geometric proportion accuracy within the established Saura art canons that define the spatial arrangement of sacred Tree of Life structures, human figure processions, animal form representations, and ceremonial border patterns according to the specific visual vocabulary of the Odisha Saura tribal wall painting tradition as practised across approximately 30 active Saura artisan families in the Koraput, Rayagada, Ganjam, and Malkangiri production centres of Odisha where this unique combination of geometric abstraction, spiritual cosmology, and tribal community identity continues to sustain one of India's most distinctive and visually powerful tribal art heritage traditions.</p></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
