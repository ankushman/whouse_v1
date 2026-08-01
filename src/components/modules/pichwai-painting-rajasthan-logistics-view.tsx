import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#be185d', '#9d174d', '#831843', '#500724', '#ec4899', '#701a75', '#86198f', '#fdf2f8']
const PRODUCTS = ['Srinathji Pichwai Temple Panel', 'Annakoot Festival Pichwai Cloth', 'Govardhan Lila Pichwai Hanging', 'Holi Pichwai Festival Screen', 'Raslila Pichwai Scroll Panel', 'Gopashtami Temple Pichwai', 'Summer Pichwai Cloth Curtain', 'Lotus Pond Srinathji Pichwai']
const ARTISANS = ['Nathdwara Pichwai Painter Guild', 'Udaipur Temple Art Centre', 'Chittorgarh Heritage Painters', 'Kankroli Devotional Art Studio', 'Rajsamand Cloth Painters Colony', 'Bhilwara Pichwai Collective', 'Ajmer Traditional Cloth Guild', 'Jodhpur Nathdwara Art Colony']
const STATUSES = ['GI Pichwai Painting Mark', 'IS 16799 Temple Cloth Grade A', 'Silk Cloth Roll Flat Pack', 'Palletised Truck Transit', 'Dust-Free Storage 20-25C', 'Gold Leaf Adhesion QC']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-pink-100 text-pink-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="w-24 h-2 bg-pink-200 rounded-full overflow-hidden"><div className="h-full bg-pink-700 rounded-full" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ label, value, size = 80 }: { label: string; value: number; size?: number }) => {
  const r = (size - 12) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#fdf2f8" strokeWidth="6" />
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
    id: `PPA-${String(offset + i + 1).padStart(4, '0')}`,
    painter: ARTISANS[(offset + i) % ARTISANS.length], ware: PRODUCTS[(offset + i) % PRODUCTS.length],
    status: STATUSES[(offset + i) % STATUSES.length], qty: ri(1, 35, ((offset + i) * 31) % 35) + 1,
    cost: ri(5000, 98000, ((offset + i) * 14173) % 93000) + 5000,
    date: new Date(2024, ((offset + i) % 12), ri(1, 28, (offset + i) % 28)).toISOString().slice(0, 10),
  }))

const pichwaiRecords = [
  { id: 'PPA-0001', painter: 'Nathdwara Pichwai Painter Guild', ware: 'Srinathji Pichwai Temple Panel', status: 'GI Pichwai Painting Mark', qty: 3, cost: 85000, date: '2024-01-12' },
  { id: 'PPA-0002', painter: 'Udaipur Temple Art Centre', ware: 'Annakoot Festival Pichwai Cloth', status: 'IS 16799 Temple Cloth Grade A', qty: 5, cost: 125000, date: '2024-01-25' },
  { id: 'PPA-0003', painter: 'Chittorgarh Heritage Painters', ware: 'Govardhan Lila Pichwai Hanging', status: 'Silk Cloth Roll Flat Pack', qty: 8, cost: 68000, date: '2024-02-08' },
  { id: 'PPA-0004', painter: 'Kankroli Devotional Art Studio', ware: 'Holi Pichwai Festival Screen', status: 'Palletised Truck Transit', qty: 12, cost: 95000, date: '2024-02-20' },
  { id: 'PPA-0005', painter: 'Rajsamand Cloth Painters Colony', ware: 'Raslila Pichwai Scroll Panel', status: 'Dust-Free Storage 20-25C', qty: 4, cost: 110000, date: '2024-03-05' },
  { id: 'PPA-0006', painter: 'Bhilwara Pichwai Collective', ware: 'Gopashtami Temple Pichwai', status: 'Gold Leaf Adhesion QC', qty: 6, cost: 92000, date: '2024-03-18' },
  { id: 'PPA-0007', painter: 'Ajmer Traditional Cloth Guild', ware: 'Summer Pichwai Cloth Curtain', status: 'GI Pichwai Painting Mark', qty: 10, cost: 145000, date: '2024-03-30' },
  { id: 'PPA-0008', painter: 'Jodhpur Nathdwara Art Colony', ware: 'Lotus Pond Srinathji Pichwai', status: 'IS 16799 Temple Cloth Grade A', qty: 3, cost: 75000, date: '2024-04-12' },
  { id: 'PPA-0009', painter: 'Nathdwara Pichwai Painter Guild', ware: 'Annakoot Festival Pichwai Cloth', status: 'Silk Cloth Roll Flat Pack', qty: 5, cost: 155000, date: '2024-04-24' },
  { id: 'PPA-0010', painter: 'Udaipur Temple Art Centre', ware: 'Srinathji Pichwai Temple Panel', status: 'Palletised Truck Transit', qty: 7, cost: 65000, date: '2024-05-06' },
  { id: 'PPA-0011', painter: 'Chittorgarh Heritage Painters', ware: 'Govardhan Lila Pichwai Hanging', status: 'Dust-Free Storage 20-25C', qty: 4, cost: 48000, date: '2024-05-18' },
  { id: 'PPA-0012', painter: 'Kankroli Devotional Art Studio', ware: 'Holi Pichwai Festival Screen', status: 'Gold Leaf Adhesion QC', qty: 6, cost: 225000, date: '2024-05-30' },
  { id: 'PPA-0013', painter: 'Rajsamand Cloth Painters Colony', ware: 'Raslila Pichwai Scroll Panel', status: 'GI Pichwai Painting Mark', qty: 8, cost: 185000, date: '2024-06-12' },
  { id: 'PPA-0014', painter: 'Bhilwara Pichwai Collective', ware: 'Gopashtami Temple Pichwai', status: 'IS 16799 Temple Cloth Grade A', qty: 3, cost: 340000, date: '2024-06-24' },
  { id: 'PPA-0015', painter: 'Ajmer Traditional Cloth Guild', ware: 'Summer Pichwai Cloth Curtain', status: 'Silk Cloth Roll Flat Pack', qty: 10, cost: 132000, date: '2024-07-06' },
  { id: 'PPA-0016', painter: 'Jodhpur Nathdwara Art Colony', ware: 'Lotus Pond Srinathji Pichwai', status: 'Palletised Truck Transit', qty: 5, cost: 275000, date: '2024-07-18' },
  { id: 'PPA-0017', painter: 'Nathdwara Pichwai Painter Guild', ware: 'Holi Pichwai Festival Screen', status: 'Dust-Free Storage 20-25C', qty: 4, cost: 198000, date: '2024-07-30' },
  { id: 'PPA-0018', painter: 'Udaipur Temple Art Centre', ware: 'Srinathji Pichwai Temple Panel', status: 'Gold Leaf Adhesion QC', qty: 7, cost: 35000, date: '2024-08-10' },
  { id: 'PPA-0019', painter: 'Chittorgarh Heritage Painters', ware: 'Annakoot Festival Pichwai Cloth', status: 'GI Pichwai Painting Mark', qty: 6, cost: 48000, date: '2024-08-22' },
  { id: 'PPA-0020', painter: 'Kankroli Devotional Art Studio', ware: 'Govardhan Lila Pichwai Hanging', status: 'IS 16799 Temple Cloth Grade A', qty: 5, cost: 156000, date: '2024-09-03' },
]

export default function PichwaiPaintingRajasthanLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = [...pichwaiRecords, ...genRecords(21), ...genRecords(41)]

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
    <div className="ppa-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Pichwai Painting Rajasthan' }]} />
      <PageHeader title="Pichwai Painting Rajasthan Logistics" description="Pichwai devotional cloth painting supply chain with IS 16799 temple cloth compliance, gold leaf adhesion QC, silk cloth roll flat pack packaging, and GI Pichwai Painting Mark certification across 8 heritage artisan clusters in Nathdwara, Udaipur, and Chittorgarh districts of Rajasthan" />
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="bg-pink-100">
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
            <HealthRing label="IS 16799" value={92} />
            <HealthRing label="Silk" value={88} />
            <HealthRing label="Truck" value={85} />
            <HealthRing label="Dust-Free" value={93} />
            <HealthRing label="Gold QC" value={97} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Artisan Families" value="100+" />
            <ValueTile label="Pichwai Tradition" value="Since 17th C" />
            <ValueTile label="Export Markets" value="20 Countries" />
            <ValueTile label="Annual Revenue" value="₹5.2 Crore" />
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
            placeholder="Search Pichwai painting shipments..."
          />
          <div className="rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-pink-100">
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
                  <tr key={record.id} className="border-t hover:bg-pink-50/50">
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
              <CardHeader><CardTitle>Nathdwara Pichwai — 400-Year Srinathji Devotional Cloth Painting Tradition</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Pichwai is a profoundly sacred devotional cloth painting tradition originating from Nathdwara in the Mewar region of Rajasthan that has been continuously practised for over four centuries as a specialised form of temple art created exclusively for the worship of Lord Srinathji, a manifestation of Krishna revered as the supreme deity of the Pushtimarg Vaishnava tradition established by the philosopher-saint Vallabhacharya in the sixteenth century, with the Pichwai painting tradition developing as an essential visual component of the elaborate daily worship rituals known as Sewa that form the core spiritual practice of the Pushtimarg community where large-scale painted cloth hangings serve as the sacred backdrop for the Srinathji idol during the eight daily darshan ceremonies that mark the rhythm of devotional life in the Nathdwara temple and in the private home shrines of Pushtimarg devotees across Rajasthan, Gujarat, and the global Pushtimarg diaspora community. The Pichwai painting technique involves applying natural mineral pigments mixed with gum arabic and limestone binder onto hand-woven cotton or silk cloth substrates using handcrafted brushes of varying sizes for different compositional elements, with the most distinctive feature being the application of pure gold leaf known as Varak that is painstakingly burnished onto the painted surface using agate stone tools to create luminous golden ornamentation depicting the divine jewellery, sacred architecture, and celestial elements that define the Srinathji iconographic tradition where gold leaf represents the divine radiance and spiritual purity of the deity figure at the centre of each Pichwai composition. Each Pichwai can measure from two metres to over eight metres in width and requires between two and six months of concentrated artisan labour to complete depending on the complexity of the narrative composition, the density of gold leaf ornamentation, and the number of human and animal figures depicted in the devotional scene. The hereditary Pichwai painter families known as chitrakars maintain approximately fifteen active ateliers in Nathdwara where fewer than one hundred master painters sustain this irreplaceable temple art tradition, creating Pichwai compositions for both the primary Nathdwara Srinathji temple and for the worldwide Pushtimarg devotional community that maintains active Srinathji worship traditions in over twenty countries across North America, Europe, East Africa, and Southeast Asia.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>IS 16799 Temple Cloth Standards & Gold Leaf Adhesion QC</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">The IS 16799 standard for Pichwai temple cloth painting establishes India's first dedicated quality certification framework for this 400-year-old Nathdwara devotional art tradition, specifying comprehensive requirements for natural mineral pigment composition derived from the Rajasthan geological zone, hand-painted application technique verification using traditional chitrakar brush methods, cotton and silk cloth substrate quality parameters, pure gold leaf purity and adhesion durability testing, and Srinathji iconographic accuracy assessment that collectively distinguish authentic Nathdwara temple Pichwai paintings created by hereditary chitrakar families from commercial reproductions and mass-produced imitations that have increasingly appeared in both domestic Indian religious art markets and international online retail platforms serving the Pushtimarg devotional community and institutional art collectors seeking authenticated Pichwai for temple worship and museum exhibition purposes. The natural mineral pigment composition requirements for IS 16799 Grade A certification mandate exclusively natural mineral-derived pigments sourced from the Rajasthan geological zone, including red ochre from the Jodhpur laterite deposits for the deep red passages depicting festival scenes and divine manifestations, golden yellow from the Jaipur mineraliferous zones for the auspicious golden zones representing divine light and celestial radiance, white from the Udaipur region kaolin clay deposits for the pure white lotus flower and cow figure elements central to Srinathji iconography, and carbon black from charred local hardwood species mixed with natural gum arabic binder for the precise black outline work that defines the distinctive Pichwai compositional style. Gold leaf purity requirements for Grade A certification mandate a minimum gold content of 99.5% with thickness variation not exceeding 0.5 micrometres across the entire Pichwai surface, verified through X-ray fluorescence spectroscopy confirming elemental gold composition and excluding any gold alloy or gold-coloured metallic substitute materials that produce characteristically different spectral signatures detectable through laboratory analysis against certified pure gold leaf reference standards maintained in the IS 16799 standard appendix. Gold leaf adhesion durability testing mandates tape peel resistance at minimum 800 grams per centimetre peel force ensuring the gold leaf remains securely bonded to the painted surface under the handling and display conditions encountered during temple darshan ceremonies, transit through the Rajasthan distribution networks, and international shipping to Pushtimarg temples and collector destinations worldwide.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Silk Cloth Roll Flat Pack Packaging for Pichwai Temple Hangings</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Silk cloth roll flat pack packaging has been specifically developed for the Pichwai temple cloth logistics supply chain to protect the hand-painted natural mineral pigment surfaces, pure gold leaf ornamentation, elaborate devotional compositions, and delicate cotton and silk cloth substrates that characterise authentic Nathdwara Pichwai temple hangings from the physical and environmental hazards encountered during transit from the Rajasthan artisan ateliers to domestic temple destinations across Nathdwara, Mumbai, and Delhi, and international export destinations serving the global Pushtimarg devotional community in East Africa, the United Kingdom, North America, and Southeast Asia where significant populations of Pushtimarg devotees maintain active Srinathji worship traditions requiring authentic Pichwai temple backdrops imported from Nathdwara's heritage chitrakar production centres. The packaging specification utilises plain weave cotton muslin with minimum grammage of 80 GSM and pH range 6.5 to 7.5 as the primary interleaving material, providing a soft breathable protective layer that prevents friction damage to the hand-painted natural mineral pigment surfaces and gold leaf ornamentation while allowing adequate air circulation to prevent moisture condensation that could cause gold leaf delamination or natural pigment degradation during transit through the arid desert conditions of Rajasthan and the humid coastal conditions encountered during multi-modal transportation to international destinations. Each Pichwai temple hanging is inspected under standardised D65 daylight illumination verifying natural pigment surface integrity, gold leaf coverage completeness and adhesion quality, cloth substrate condition, Srinathji iconographic compositional accuracy, and overall artistic quality before being interleaved with acid-free tissue paper between successive layers when the Pichwai is rolled for transit, then carefully rolled around a custom-cut acid-free cardboard tube with the painted surface facing outward to prevent pigment-to-pigment contact and gold leaf abrasion, secured with cotton tying tape at four equidistant points along the roll length, and placed within a rigid outer shipping container constructed from 5-millimetre double-wall corrugated fibreboard with internal cushioning strips of polyethylene foam at all four edges and desiccant packets providing moisture barrier protection against the varying humidity conditions encountered during the multi-modal logistics chain connecting Nathdwara's ateliers to Pushtimarg temple destinations across Rajasthan, Gujarat, and the international Pushtimarg community spanning over twenty countries worldwide.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>AI Gold Leaf Pattern Verification & Pichwai Heritage Collector Market</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Artificial intelligence and computational gold leaf analysis technologies are being progressively deployed to authenticate Pichwai temple cloth paintings and verify the distinctive hand-painted brush stroke patterns, natural mineral pigment spectral signatures, and gold leaf ornamentation compositions that distinguish genuine Nathdwara Pichwai artworks created by hereditary chitrakar families from the growing volume of machine-printed reproductions and gold-coloured metallic substitute imitations that have increasingly appeared in both domestic Indian religious art markets and international online retail platforms serving the global Pushtimarg devotional community and institutional art collectors seeking authenticated Pichwai for temple worship and museum exhibition purposes. The AI authentication system for Pichwai paintings employs ultra-high-resolution scanning at 4800 dots per inch combined with multispectral imaging across the visible and near-infrared spectrum from 400 to 900 nanometres wavelength range to capture the complete surface topography and gold leaf distribution pattern of finished Pichwai temple hangings, analysing the hand-painted brush stroke direction and pressure patterns characteristic of the chitrakar's traditional brush technique using handcrafted squirrel-hair and palm-fibre brushes of varying diameters, natural mineral pigment particle distribution characteristics that differ fundamentally from the uniform pigment dispersion of synthetic printing inks, and the gold leaf density and burnishing pattern accuracy within the established Pichwai ornamentation canons that define the spatial arrangement of divine jewellery elements, sacred architectural gold borders, and celestial gold ornamentation according to the specific visual vocabulary of the Nathdwara Pichwai tradition transmitted through generations of hereditary chitrakar families over four centuries of continuous temple art practice in the Mewar region of Rajasthan. Machine learning algorithms trained on authenticated Pichwai reference samples from all major Nathdwara ateliers can verify artwork authenticity with 97% accuracy by detecting subtle hand-painting signatures including the characteristic brush stroke width variation reflecting the individual chitrakar's hand-eye coordination during squirrel-hair brush application, the natural mineral pigment particle aggregation patterns visible through high-magnification imaging that differ fundamentally from machine-printed pigment deposition, and the gold leaf burnishing pressure patterns that create unique micro-texture signatures on the gold surface reflecting each artisan's agate stone tool handling technique, collectively enabling the AI system to identify individual artisan families within the Nathdwara chitrakar community through their distinctive gold leaf ornamentation signatures that constitute an artistic fingerprint unique to each hereditary Pichwai painting tradition maintained across the approximately fifteen active ateliers and fewer than one hundred master chitrakars preserving this irreplaceable 400-year-old temple art heritage.</p></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
