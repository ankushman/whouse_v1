import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#166534', '#15803d', '#16a34a', '#22c55e', '#4ade80', '#14532d', '#052e16', '#f0fdf4']
const PRODUCTS = ['Pipli Lord Jagannath Canopy', 'Odisha Applique Temple Umbrella', 'Pipli Chandua Wall Hanging', 'Pipli Applique Garden Umbrella', 'Rath Yatra Pipli Decorative Banner', 'Pipli Hand-Stitched Bedspread', 'Odisha Pipli Lampshade Cover', 'Pipli Applique Toran Door Hanging']
const ARTISANS = ['Pipli Applique Artisan Guild', 'Bhubaneswar Chandua Cooperative', 'Cuttack Heritage Applique Society', 'Puri Jagannath Temple Crafts', 'Khordha Pipli Workshop', 'Dhenkanal Applique Colony', 'Nayagarh Chandua Art Centre', 'Sambalpur Pipli Cooperative']
const STATUSES = ['GI Pipli Applique Mark', 'IS 16919 Applique Craft Grade A', 'Roll-Wrapped Cloth Bundle', 'Enclosed Truck Transit', 'Dry Storage 20-30C', 'Stitch Spacing QC']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="w-24 h-2 bg-green-200 rounded-full overflow-hidden"><div className="h-full bg-green-700 rounded-full" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ label, value, size = 80 }: { label: string; value: number; size?: number }) => {
  const r = (size - 12) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f0fdf4" strokeWidth="6" />
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
    id: `OPA-${String(offset + i + 1).padStart(4, '0')}`,
    artisan: ARTISANS[(offset + i) % ARTISANS.length], ware: PRODUCTS[(offset + i) % PRODUCTS.length],
    status: STATUSES[(offset + i) % STATUSES.length], qty: ri(1, 200, ((offset + i) * 37) % 200) + 1,
    cost: ri(600, 22000, ((offset + i) * 13097) % 21400) + 600,
    date: new Date(2024, ((offset + i) % 12), ri(1, 28, (offset + i) % 28)).toISOString().slice(0, 10),
  }))

const pipliRecords = [
  { id: 'OPA-0001', artisan: 'Pipli Applique Artisan Guild', ware: 'Pipli Lord Jagannath Canopy', status: 'GI Pipli Applique Mark', qty: 12, cost: 15000, date: '2024-01-08' },
  { id: 'OPA-0002', artisan: 'Bhubaneswar Chandua Cooperative', ware: 'Odisha Applique Temple Umbrella', status: 'IS 16919 Applique Craft Grade A', qty: 20, cost: 8500, date: '2024-01-20' },
  { id: 'OPA-0003', artisan: 'Cuttack Heritage Applique Society', ware: 'Pipli Chandua Wall Hanging', status: 'Roll-Wrapped Cloth Bundle', qty: 35, cost: 3200, date: '2024-02-05' },
  { id: 'OPA-0004', artisan: 'Puri Jagannath Temple Crafts', ware: 'Pipli Applique Garden Umbrella', status: 'Enclosed Truck Transit', qty: 18, cost: 6200, date: '2024-02-18' },
  { id: 'OPA-0005', artisan: 'Khordha Pipli Workshop', ware: 'Rath Yatra Pipli Decorative Banner', status: 'Dry Storage 20-30C', qty: 25, cost: 4800, date: '2024-03-02' },
  { id: 'OPA-0006', artisan: 'Dhenkanal Applique Colony', ware: 'Pipli Hand-Stitched Bedspread', qty: 30, cost: 5600, date: '2024-03-15', status: 'Stitch Spacing QC' },
  { id: 'OPA-0007', artisan: 'Nayagarh Chandua Art Centre', ware: 'Odisha Pipli Lampshade Cover', status: 'GI Pipli Applique Mark', qty: 45, cost: 2200, date: '2024-03-28' },
  { id: 'OPA-0008', artisan: 'Sambalpur Pipli Cooperative', ware: 'Pipli Applique Toran Door Hanging', status: 'IS 16919 Applique Craft Grade A', qty: 60, cost: 1800, date: '2024-04-10' },
  { id: 'OPA-0009', artisan: 'Pipli Applique Artisan Guild', ware: 'Rath Yatra Pipli Decorative Banner', status: 'Roll-Wrapped Cloth Bundle', qty: 22, cost: 4500, date: '2024-04-22' },
  { id: 'OPA-0010', artisan: 'Bhubaneswar Chandua Cooperative', ware: 'Pipli Lord Jagannath Canopy', status: 'Enclosed Truck Transit', qty: 10, cost: 16500, date: '2024-05-04' },
  { id: 'OPA-0011', artisan: 'Cuttack Heritage Applique Society', ware: 'Pipli Hand-Stitched Bedspread', status: 'Dry Storage 20-30C', qty: 28, cost: 5200, date: '2024-05-16' },
  { id: 'OPA-0012', artisan: 'Puri Jagannath Temple Crafts', ware: 'Odisha Applique Temple Umbrella', status: 'Stitch Spacing QC', qty: 15, cost: 9200, date: '2024-05-28' },
  { id: 'OPA-0013', artisan: 'Khordha Pipli Workshop', ware: 'Pipli Chandua Wall Hanging', status: 'GI Pipli Applique Mark', qty: 40, cost: 2800, date: '2024-06-10' },
  { id: 'OPA-0014', artisan: 'Dhenkanal Applique Colony', ware: 'Pipli Applique Garden Umbrella', status: 'IS 16919 Applique Craft Grade A', qty: 16, cost: 5800, date: '2024-06-22' },
  { id: 'OPA-0015', artisan: 'Nayagarh Chandua Art Centre', ware: 'Pipli Applique Toran Door Hanging', status: 'Roll-Wrapped Cloth Bundle', qty: 55, cost: 1600, date: '2024-07-05' },
  { id: 'OPA-0016', artisan: 'Sambalpur Pipli Cooperative', ware: 'Odisha Pipli Lampshade Cover', status: 'Enclosed Truck Transit', qty: 50, cost: 2000, date: '2024-07-16' },
  { id: 'OPA-0017', artisan: 'Pipli Applique Artisan Guild', ware: 'Pipli Lord Jagannath Canopy', status: 'Dry Storage 20-30C', qty: 8, cost: 18000, date: '2024-07-24' },
  { id: 'OPA-0018', artisan: 'Bhubaneswar Chandua Cooperative', ware: 'Rath Yatra Pipli Decorative Banner', status: 'Stitch Spacing QC', qty: 20, cost: 4200, date: '2024-08-01' },
  { id: 'OPA-0019', artisan: 'Cuttack Heritage Applique Society', ware: 'Pipli Applique Toran Door Hanging', status: 'GI Pipli Applique Mark', qty: 65, cost: 1400, date: '2024-08-10' },
  { id: 'OPA-0020', artisan: 'Puri Jagannath Temple Crafts', ware: 'Odisha Pipli Lampshade Cover', status: 'IS 16919 Applique Craft Grade A', qty: 42, cost: 2100, date: '2024-08-20' },
]

export default function OdishaPipliAppliqueLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = [...pipliRecords, ...genRecords(21), ...genRecords(41)]

  const filteredRecords = useMemo(() => {
    if (!searchQuery && Object.keys(activeFilters).every(k => !activeFilters[k].length)) return allRecords
    const sq = searchQuery.toLowerCase()
    return allRecords.filter(r => { if (sq && !r.id.toLowerCase().includes(sq) && !r.ware.toLowerCase().includes(sq)) return false; return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string)); })
  }, [searchQuery, activeFilters, allRecords])

  const filterGroups = [
    { key: 'ware', label: 'Ware', options: PRODUCTS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.ware === p).length })) },
    { key: 'artisan', label: 'Artisan', options: ARTISANS.map(a => ({ value: a, label: a, count: allRecords.filter(r => r.artisan === a).length })) },
  ]

  const trendData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m, i) => ({ month: m, shipments: ri(20, 75, allRecords.length * 0.3 + i * 10) }))
  const artisanChart = ARTISANS.map(a => ({ name: a.split(' ').slice(0, 2).join(' '), volume: allRecords.filter(r => r.artisan === a).reduce((s, r) => s + r.qty, 0) }))
  const statusPie = STATUSES.map(s => ({ name: s, value: allRecords.filter(r => r.status === s).length }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="opa-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Odisha Pipli Applique' }]} />
      <PageHeader title="Odisha Pipli Applique Logistics" description="Odisha Pipli Chandua applique craft supply chain with IS 16919 applique craft compliance, hand-stitch spacing QC, roll-wrapped cloth bundle packaging, and GI Pipli Applique Mark certification across 8 heritage artisan clusters in Pipli and Puri districts" />
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="bg-green-100">
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
            <HealthRing label="IS 16919" value={87} />
            <HealthRing label="Roll" value={84} />
            <HealthRing label="Truck" value={80} />
            <HealthRing label="Storage" value={88} />
            <HealthRing label="Stitch" value={93} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Artisan Families" value="5,000+" />
            <ValueTile label="Pipli Village" value="Since 10th C" />
            <ValueTile label="Export Markets" value="15 Countries" />
            <ValueTile label="Annual Revenue" value="₹12 Crore" />
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
            placeholder="Search Pipli applique shipments..."
          />
          <div className="rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-green-100">
                <tr>
                  <th className="p-3 text-left font-medium">ID</th>
                  <th className="p-3 text-left font-medium">Ware</th>
                  <th className="p-3 text-left font-medium">Artisan</th>
                  <th className="p-3 text-left font-medium">Status</th>
                  <th className="p-3 text-left font-medium">Qty</th>
                  <th className="p-3 text-left font-medium">Cost</th>
                  <th className="p-3 text-left font-medium">Cost Bar</th>
                  <th className="p-3 text-left font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map(record => (
                  <tr key={record.id} className="border-t hover:bg-green-50/50">
                    <td className="p-3 font-mono text-xs">{record.id}</td>
                    <td className="p-3"><ProductBadge name={record.ware} /></td>
                    <td className="p-3">{record.artisan}</td>
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
              <CardHeader><CardTitle>Odisha Pipli Applique — 1,000-Year Temple Art of Pipli</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Odisha Pipli applique is a vibrant textile craft tradition originating from Pipli village in the Puri district of Odisha, where artisan communities have practised the art of Chandua appliqué work for over a thousand years, creating colourful decorative pieces that are integral to the religious and cultural life of the Jagannath temple tradition and the broader Odishan cultural landscape. The term Pipli derives from the village name where this distinctive appliqué technique was developed and refined by local artisan communities under the patronage of the Jagannath temple in Puri, one of India's most sacred Hindu pilgrimage sites where elaborately decorated canopies, umbrellas, and ceremonial banners created by Pipli artisans are essential ritual objects used in daily temple worship, annual Rath Yatra chariot festival processions, and major religious ceremonies throughout the Hindu calendar year. The Pipli appliqué technique involves cutting geometric and figurative shapes from brightly coloured cotton, silk, or velvet fabric and meticulously hand-stitching them onto a base fabric using a distinctive needle-turn appliqué stitch where the cut fabric shapes are folded under at the edges and sewn onto the background fabric with small, evenly spaced running stitches that create a neat raised outline around each appliqué element, producing vibrant decorative compositions featuring Lord Jagannath and his sibling deities Balabhadra and Subhadra, geometric flower and tree motifs, animal figures, and elaborate border patterns in bold contrasting colours of deep red, bright yellow, emerald green, royal blue, and stark black against white or cream background fabric. The traditional Pipli colour palette is deeply symbolic in the Jagannath religious tradition, where specific colour combinations are prescribed for different ritual contexts: red and yellow predominating for festive temple decorations, green and blue for ceremonial umbrellas used during monsoon worship, and black-bordered white compositions for specific mourning and penance ritual observances. Today approximately 5,000 artisan families across eight heritage clusters in Pipli, Bhubaneswar, Cuttack, Puri, Khordha, Dhenkanal, Nayagarh, and Sambalpur districts sustain this tradition, generating an estimated 12 crore rupees annually through temple commissions, Rath Yatra supplies, government emporium sales, domestic home décor markets, and growing international demand for authentic Pipli appliqué decorative art pieces that bring the vibrant colour and spiritual symbolism of Odishan temple culture to homes and galleries worldwide.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>IS 16919 Applique Craft Standards & Stitch Spacing Certification</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">The IS 16919 standard for Pipli appliqué craft products establishes India's first dedicated quality certification framework for this distinctive Odisha textile art tradition, ensuring the traditional hand-stitching quality, fabric durability, and colour fastness that distinguish genuine Pipli Chandua appliqué work from machine-stitched commercial imitations and printed fabric reproductions that increasingly appear in domestic and international markets. The standard specifies detailed requirements for the base fabric substrate, mandating unbleached cotton canvas with minimum thread count of 60 ends per inch and grammage of 200 GSM for standard decorative products and pure cotton silk for premium temple ritual pieces, ensuring the base fabric provides adequate structural support for the extensive hand-stitching and layered appliqué construction that characterises authentic Pipli work without distortion or puckering at stitch points across the full fabric surface. Stitch quality requirements for Grade A certification mandate the traditional Pipli needle-turn appliqué stitch with consistent stitch spacing of 3 to 5 millimetres between consecutive stitches around all appliqué shape outlines, verified through calibrated digital measurement at NABL-accredited textile testing laboratories using 20x magnification inspection that examines a minimum of 100 consecutive stitches per sampled piece to ensure uniform spacing and consistent stitch tension throughout the entire decorative composition. Fabric colour quality for Grade A certification requires azo-free reactive dyes with minimum colourfastness ratings of 4 on the ISO 105-C06 washing scale and 5 on the ISO 105-B02 lightfastness scale, ensuring the vibrant Pipli colour palette resists fading and colour bleeding through years of display in temple environments and outdoor festival conditions where the appliqué pieces are exposed to direct sunlight, rain, and temperature fluctuations during Rath Yatra processions and other outdoor religious ceremonies that are central to the Jagannath worship tradition. Stitch spacing consistency tolerance is defined as maximum 1.5 millimetre deviation from the specified 3 to 5 millimetre standard spacing across the full appliqué piece, with any deviation exceeding this tolerance at more than 5% of measured stitch points resulting in automatic downgrade to Grade B classification.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Roll-Wrapped Cloth Bundle Packaging for Pipli Applique</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Roll-wrapped cloth bundle packaging has been specifically designed for Pipli appliqué products to protect the delicate hand-stitched fabric surfaces, raised appliqué elements, multi-layered Chandua constructions, and vibrant cotton fabric colours from physical abrasion, moisture damage, and compression during transit from Odisha artisan workshops to temple supply depots, government handicraft emporiums, domestic retail outlets, and international export destinations across the globe. Each individual Pipli appliqué piece undergoes a careful inspection and wrapping protocol where the piece is first checked for loose threads or incomplete stitch work, then rolled around a lightweight cardboard tube core that prevents sharp fold creases across the hand-stitched appliqué elements that could permanently damage the raised needle-turn stitching and distort the decorative fabric cutouts that define the visual appeal of authentic Pipli Chandua work. The rolled piece is wrapped in breathable unbleached cotton muslin cloth secured with low-tack cotton tying tape, providing a protective outer layer that prevents dust accumulation and minor abrasion while allowing air circulation to prevent moisture buildup within the rolled bundle that could cause fungal growth or colour bleeding on the bright cotton fabrics during extended transit periods in the humid coastal climate of Odisha and eastern India. The cloth-wrapped rolls are bundled together in groups of 5 to 10 pieces within corrugated shipping cartons lined with polyethylene moisture barrier film and cushioned with air-cell bubble wrap providing both crush resistance and vibration dampening during road and rail transit across India's diverse terrain from the Odisha artisan clusters to retail destinations nationwide and international shipping ports. Silica gel desiccant packets rated for 50 gram absorption capacity per carton are included to maintain relative humidity below 45% during transit, protecting the cotton fabrics and azo-free reactive dyes from humidity-induced degradation that is particularly critical during the Odisha monsoon season from June through September when atmospheric humidity routinely exceeds 85% across the Pipli and Puri craft production districts. This roll-wrapped cloth bundle packaging system has been validated to ISTA 3A transit simulation protocols and demonstrates capability to withstand drops from 60 centimetres and road vibration equivalent to 2,000 kilometres of transit without any fabric damage, reducing the historical transit damage rate for Pipli appliqué products from 10% to under 2% since its adoption across the certified supply chain.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>AI Stitch Pattern Verification & Pipli Applique Market Expansion</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Artificial intelligence and advanced imaging technologies are introducing quality assurance capabilities to the Pipli appliqué craft, where the hand-stitch spacing consistency, appliqué shape cutting precision, and overall compositional symmetry that define the highest quality pieces have traditionally required years of master artisan experience and subjective visual assessment to evaluate and certify consistently across the diverse production workshops in Pipli and surrounding Odisha districts. The AI verification system employs high-resolution flatbed scanning at 1200 dots per inch to capture detailed digital images of finished Pipli appliqué pieces, analysing every stitch point and appliqué shape boundary across the fabric surface with precision to 0.05 millimetres, measuring stitch spacing uniformity, needle-turn fold neatness, fabric shape cutting precision, and overall compositional balance against the established design templates and quality parameters that define each traditional Pipli decorative motif category. Computer vision algorithms trained on over 12,000 authenticated Pipli Chandua compositions can verify design authenticity by comparing stitch technique consistency, colour palette accuracy, traditional motif proportions, and overall compositional harmony against a reference database of master artisan works from each of the eight Odisha heritage clusters, providing objective quality grading that supplements traditional assessment by experienced Pipli craft evaluators who have historically relied on visual inspection alone. The Odisha State Handloom and Handicrafts Corporation has piloted this AI verification in its export certification pipeline for Pipli appliqué products, reducing quality rejection rates at government Utkalika emporiums from 14% to under 3% while accelerating the certification timeline from 6 working days to under 36 hours for qualifying Pipli appliqué shipments. India's GI protection for Pipli Chandua appliqué combined with digital authentication infrastructure has expanded export partnerships with international home décor retailers and cultural heritage organisations in the United States, United Kingdom, Germany, Japan, and Australia who demand verifiable provenance documentation for authentic Pipli appliqué pieces that bring the sacred colour symbolism and devotional artistry of the Jagannath temple tradition to international audiences, driving premium pricing and market confidence in this 1,000-year Odisha textile heritage craft.</p></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
