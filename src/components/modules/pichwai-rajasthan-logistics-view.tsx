import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#7e22ce', '#9333ea', '#a855f7', '#c084fc', '#d8b4fe', '#581c87', '#3b0764', '#f3e8ff']
const PRODUCTS = ['Pichwai Shrinathji Lotus Panel', 'Pichwai Cow Herd Scene', 'Pichwai Holi Festival Scroll', 'Pichwai Gopashtami Panel', 'Pichwai Annakuta Festival Art', 'Pichwai Raas Leela Dance Panel', 'Pichwai Mor Mukut Peacock Art', 'Pichwai Goverdhan Lifting Scene']
const ARTISANS = ['Nathdwara Pichwai Guild Rajasthan', 'Udaipur Devotional Painters RJ', 'Chittorgarh Vaishnava Artists RJ', 'Kumbhalgarh Cloth Painters RJ', 'Rajsamand Temple Art Cluster RJ', 'Bhilwara Pichwai Society RJ', 'Jodhpur Nathdwara Tradition RJ', 'Banswara Vaishnav Collective RJ']
const STATUSES = ['GI Rajasthan Pichwai Mark', 'Natural Mineral Pigment QC', 'Cloth Canvas Stretch QC', 'Roll Tube Cardboard Box', 'Humidity Vault Storage', 'Pichwai Colourfast Test']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-purple-100 text-purple-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="w-24 h-2 bg-purple-200 rounded-full overflow-hidden"><div className="h-full bg-purple-700 rounded-full" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ label, value, size = 80 }: { label: string; value: number; size?: number }) => {
  const r = (size - 12) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f3e8ff" strokeWidth="6" />
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
    id: `PIC-${String(offset + i + 1).padStart(4, '0')}`,
    painter: ARTISANS[(offset + i) % ARTISANS.length], ware: PRODUCTS[(offset + i) % PRODUCTS.length],
    status: STATUSES[(offset + i) % STATUSES.length], qty: ri(1, 20, ((offset + i) * 19) % 20) + 1,
    cost: ri(4000, 52000, ((offset + i) * 10707) % 48000) + 4000,
    date: new Date(2024, ((offset + i) % 12), ri(1, 28, (offset + i) % 28)).toISOString().slice(0, 10),
  }))

const pichwairecords = [
  { id: 'PIC-0001', painter: 'Nathdwara Pichwai Guild Rajasthan', ware: 'Pichwai Shrinathji Lotus Panel', status: 'GI Rajasthan Pichwai Mark', qty: 3, cost: 48000, date: '2024-01-15' },
  { id: 'PIC-0002', painter: 'Udaipur Devotional Painters RJ', ware: 'Pichwai Cow Herd Scene', status: 'Natural Mineral Pigment QC', qty: 5, cost: 36000, date: '2024-01-28' },
  { id: 'PIC-0003', painter: 'Chittorgarh Vaishnava Artists RJ', ware: 'Pichwai Holi Festival Scroll', status: 'Cloth Canvas Stretch QC', qty: 2, cost: 52000, date: '2024-02-10' },
  { id: 'PIC-0004', painter: 'Kumbhalgarh Cloth Painters RJ', ware: 'Pichwai Gopashtami Panel', status: 'Roll Tube Cardboard Box', qty: 7, cost: 22000, date: '2024-02-22' },
  { id: 'PIC-0005', painter: 'Rajsamand Temple Art Cluster RJ', ware: 'Pichwai Annakuta Festival Art', status: 'Humidity Vault Storage', qty: 4, cost: 44000, date: '2024-03-08' },
  { id: 'PIC-0006', painter: 'Bhilwara Pichwai Society RJ', ware: 'Pichwai Raas Leela Dance Panel', status: 'Pichwai Colourfast Test', qty: 6, cost: 28000, date: '2024-03-20' },
  { id: 'PIC-0007', painter: 'Jodhpur Nathdwara Tradition RJ', ware: 'Pichwai Mor Mukut Peacock Art', status: 'GI Rajasthan Pichwai Mark', qty: 2, cost: 50000, date: '2024-04-03' },
  { id: 'PIC-0008', painter: 'Banswara Vaishnav Collective RJ', ware: 'Pichwai Goverdhan Lifting Scene', status: 'Natural Mineral Pigment QC', qty: 8, cost: 16000, date: '2024-04-16' },
  { id: 'PIC-0009', painter: 'Nathdwara Pichwai Guild Rajasthan', ware: 'Pichwai Cow Herd Scene', status: 'Cloth Canvas Stretch QC', qty: 4, cost: 40000, date: '2024-04-28' },
  { id: 'PIC-0010', painter: 'Udaipur Devotional Painters RJ', ware: 'Pichwai Shrinathji Lotus Panel', status: 'Roll Tube Cardboard Box', qty: 3, cost: 48000, date: '2024-05-10' },
  { id: 'PIC-0011', painter: 'Chittorgarh Vaishnava Artists RJ', ware: 'Pichwai Holi Festival Scroll', status: 'Humidity Vault Storage', qty: 5, cost: 32000, date: '2024-05-23' },
  { id: 'PIC-0012', painter: 'Kumbhalgarth Cloth Painters RJ', ware: 'Pichwai Gopashtami Panel', status: 'Pichwai Colourfast Test', qty: 6, cost: 20000, date: '2024-06-05' },
  { id: 'PIC-0013', painter: 'Rajsamand Temple Art Cluster RJ', ware: 'Pichwai Annakuta Festival Art', status: 'GI Rajasthan Pichwai Mark', qty: 3, cost: 46000, date: '2024-06-18' },
  { id: 'PIC-0014', painter: 'Bhilwara Pichwai Society RJ', ware: 'Pichwai Raas Leela Dance Panel', status: 'Natural Mineral Pigment QC', qty: 7, cost: 24000, date: '2024-07-01' },
  { id: 'PIC-0015', painter: 'Jodhpur Nathdwara Tradition RJ', ware: 'Pichwai Mor Mukut Peacock Art', status: 'Cloth Canvas Stretch QC', qty: 2, cost: 52000, date: '2024-07-14' },
  { id: 'PIC-0016', painter: 'Banswara Vaishnav Collective RJ', ware: 'Pichwai Goverdhan Lifting Scene', status: 'Roll Tube Cardboard Box', qty: 10, cost: 12000, date: '2024-07-26' },
  { id: 'PIC-0017', painter: 'Nathdwara Pichwai Guild Rajasthan', ware: 'Pichwai Shrinathji Lotus Panel', status: 'Humidity Vault Storage', qty: 4, cost: 42000, date: '2024-08-08' },
  { id: 'PIC-0018', painter: 'Udaipur Devotional Painters RJ', ware: 'Pichwai Holi Festival Scroll', status: 'Pichwai Colourfast Test', qty: 5, cost: 30000, date: '2024-08-20' },
  { id: 'PIC-0019', painter: 'Chittorgarh Vaishnava Artists RJ', ware: 'Pichwai Cow Herd Scene', status: 'GI Rajasthan Pichwai Mark', qty: 3, cost: 50000, date: '2024-09-02' },
  { id: 'PIC-0020', painter: 'Kumbhalgarh Cloth Painters RJ', ware: 'Pichwai Gopashtami Panel', status: 'Natural Mineral Pigment QC', qty: 8, cost: 18000, date: '2024-09-14' },
]

export default function PichwaiRajasthanLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})

  const allRecords = [...pichwairecords, ...genRecords(21), ...genRecords(41)]

  const filteredRecords = useMemo(() => {
    if (!searchQuery && Object.keys(activeFilters).every(k => !activeFilters[k].length)) return allRecords
    const sq = searchQuery.toLowerCase()
    return allRecords.filter(r => { if (sq && !r.id.toLowerCase().includes(sq) && !r.ware.toLowerCase().includes(sq)) return false; return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string)); })
  }, [searchQuery, activeFilters, allRecords])

  const filterGroups = [
    { key: 'ware', label: 'Ware', options: PRODUCTS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.ware === p).length })) },
    { key: 'painter', label: 'Painter', options: ARTISANS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.painter === p).length })) },
  ]

  const trendData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m, i) => ({ month: m, shipments: ri(4, 20, allRecords.length * 0.10 + i * 3) }))
  const artisanChart = ARTISANS.map(p => ({ name: p.split(' ').slice(0, 2).join(' '), volume: allRecords.filter(r => r.painter === p).reduce((s, r) => s + r.qty, 0) }))
  const statusPie = STATUSES.map(s => ({ name: s, value: allRecords.filter(r => r.status === s).length }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="pic-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Pichwai Rajasthan' }]} />
      <PageHeader title="Pichwai Rajasthan Logistics" description="Rajasthan Nathdwara Pichwai devotional cloth painting supply chain with GI Rajasthan Pichwai Mark, natural mineral pigment quality control, cloth canvas stretch verification, roll tube cardboard packaging, humidity vault storage, and Pichwai colourfast testing across 8 artisan clusters in Nathdwara, Udaipur, and Chittorgarh" />
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="bg-purple-100">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <KpiTile label="Total Shipments" value={allRecords.length} />
            <KpiTile label="Active Ware" value={PRODUCTS.length} />
            <KpiTile label="Art Clusters" value={ARTISANS.length} />
            <KpiTile label="Avg Cost" value={`₹${Math.round(allRecords.reduce((s, r) => s + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>
          <div className="grid grid-cols-6 gap-4">
            <HealthRing label="GI Tag" value={92} />
            <HealthRing label="Pigment" value={86} />
            <HealthRing label="Canvas" value={84} />
            <HealthRing label="Pack" value={79} />
            <HealthRing label="Humidity" value={88} />
            <HealthRing label="Colour" value={91} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Pichwai Families" value="12 Active" />
            <ValueTile label="Tradition" value="Since 1670 AD" />
            <ValueTile label="Export Markets" value="8 Countries" />
            <ValueTile label="Annual Revenue" value="₹3.8 Crore" />
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
            placeholder="Search Pichwai art shipments..."
          />
          <div className="rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-purple-100">
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
                  <tr key={record.id} className="border-t hover:bg-purple-50/50">
                    <td className="p-3 font-mono text-xs">{record.id}</td>
                    <td className="p-3"><ProductBadge name={record.ware} /></td>
                    <td className="p-3">{record.painter}</td>
                    <td className="p-3"><StatusBadge status={record.status} /></td>
                    <td className="p-3">{record.qty} {['pcs', 'panels', 'scrolls', 'frames'][parseInt(record.id.slice(4)) % 4]}</td>
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
              <CardHeader><CardTitle>Pichwai Art — 350-Year Nathdwara Vaishnava Cloth Painting Heritage</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">Pichwai art represents one of the most visually spectacular and spiritually significant traditions of Indian devotional cloth painting having been continuously practised for over three hundred and fifty years by the hereditary Pichwai painter families of the Nathdwara temple town in the Rajsamand district of Rajasthan where the skilled Pichwai artists create large-scale painted textile backdrops known as Pichwai meaning literally behind the picture that serve as elaborate devotional decorations for the Shrinathji temple depicting the various festivals rituals and leela divine play episodes from the life of Lord Krishna as Shrinathji the manifestation of the seven-year-old Krishna lifting the Goverdhan mountain where the Pichwai tradition originated in the late seventeenth century when the idol of Shrinathji was installed at the Nathdwara temple in approximately sixteen seventy and the Pichwai paintings were created as large cloth backdrops typically measuring one point five to three metres in height and two to six metres in width that are hung behind the Shrinathji idol in the sanctum sanctorum to create an elaborate and visually immersive devotional environment that enhances the spiritual experience of the daily darshan sacred viewing for the devotees where the Pichwai paintings depict specific seasonal festivals including the Annakuta Govardhan Puja where the mountain of food offerings is displayed before Shrinathji the Holi festival depicting Krishna playing colours with the gopis cowherd maidens the Gopashtami festival celebrating Krishna as the protector of cows the Raas Leela divine dance festival and the Mor Mukut peacock crown festival where each Pichwai painting is meticulously hand-painted using natural mineral pigments on prepared cotton or woven cotton cloth canvas that has been treated with a mixture of wheat starch and gum Arabic to create a smooth painting surface that can support the detailed miniature-style painting techniques employed by the Pichwai artists where the painting process involves first outlining the design in charcoal or ink followed by the careful application of flat colour areas using natural pigments derived from lapis lazuli indigo mercury sulphide orpiment and other mineral sources with the fine detailing and shading executed using increasingly fine brushes sometimes made from squirrel hair to achieve the extraordinary level of miniature painting precision that characterises the finest Pichwai art textile panels produced by the master Pichwai artists of the Nathdwara tradition.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Natural Mineral Pigment QC & Cloth Canvas Stretch Standards</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The natural mineral pigment quality control framework for Pichwai art establishes a rigorous testing protocol for the traditional pigments and painting materials used in the creation of authentic Nathdwara Pichwai devotional cloth paintings where the mineral pigments must be tested for colour purity lightfastness and chemical stability using spectrophotometric analysis confirming Delta E colour deviation within two units from the reference standard for each traditional Pichwai pigment colour including the characteristic deep red mercury sulphide vermillion the vibrant blue lapis lazuli the golden yellow orpiment the rich green malachite and the warm ochre iron oxide that together compose the distinctive Pichwai colour palette where the pigment particle size must not exceed twenty microns measured by laser diffraction analysis confirming the pigment has been ground to sufficiently fine particle size to enable smooth even application without visible granularity on the cloth canvas surface where the cloth canvas preparation quality control requires the cotton fabric substrate to meet IS 16858 handloom cotton fabric standards with minimum thread count of eighty ends per inch and sixty picks per inch confirming the fabric provides a sufficiently dense and uniform weaving structure to support the detailed Pichwai painting technique without fabric distortion or weave pattern showing through the painted design surface where the canvas preparation involves applying a coating of wheat starch and gum Arabic binder mixture at a ratio of three parts starch to one part gum by weight creating a smooth semi-absorbent surface that accepts the mineral pigments without excessive bleeding or spreading beyond the design boundaries where the canvas stretch quality verification measures the dimensional stability of the prepared cloth canvas under controlled humidity conditions confirming the fabric maintains flat dimensions within plus or minus two millimetres across a one metre reference length ensuring the Pichwai painting surface remains flat and wrinkle-free throughout the painting and drying process where the canvas is mounted on a wooden frame using cotton thread lacing through the fabric edges maintaining even tension across the entire painting surface enabling the Pichwai artist to execute the extraordinarily detailed miniature painting work that produces the characteristic fine linework and delicate shading of authentic Nathdwara Pichwai art cloth paintings.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Roll Tube Cardboard Packaging for Pichwai Cloth Panel Transit</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">Roll tube cardboard packaging with acid-free tissue interleaving and moisture barrier protection has been specifically developed for the Pichwai devotional cloth painting supply chain to protect the large-format hand-painted textile panels from the physical damage and environmental hazards encountered during transit from the Nathdwara artisan workshops to temple installations gallery exhibitions and museum collections across India and international destinations where the large dimensions of Pichwai paintings typically measuring one point five to three metres in height and two to six metres in width require a specialised rolling and packaging approach that prevents creasing folding damage to the painted mineral pigment surface and the underlying cotton cloth substrate where the packaging specification utilises heavy-duty Kraft paper tubes with minimum wall thickness of six millimetres and internal diameter matching the Pichwai painting width providing a rigid cylindrical container that supports the rolled Pichwai painting without compression or point loading that could damage the painted surface where the Pichwai cloth panel is rolled painted side facing inward around a core tube of acid-free tissue paper with pH neutral value between six point five and seven point five measured in accordance with ISO 10716 permanent paper acidity testing methodology ensuring the inner tissue wrap does not generate acidic degradation products that could cause mineral pigment hydrolysis or cotton fibre oxidation during extended transit and storage periods where the rolled Pichwai painting is further protected by an outer layer of polyethylene moisture barrier film with water vapour transmission rate below five grams per square metre per day measured in accordance with IS 7073 moisture barrier testing methodology preventing ambient moisture from penetrating the packaging and causing pigment softening or cloth canvas mould growth during transit through high-humidity coastal regions where the complete roll tube packaging assembly is sealed with tamper-evident security tape providing chain-of-custody documentation for the valuable Pichwai art panels during road and air transit to temple and gallery destinations where the packaging bears the GI Rajasthan Pichwai Mark certification label and handling instructions in Hindi and English ensuring proper handling throughout the distribution chain from Nathdwara to national and international Pichwai art installation destinations.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Humidity Vault Storage & Pichwai Heritage Market Development</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">Humidity-controlled vault storage facilities with precise environmental regulation have been established for the Pichwai devotional cloth painting supply chain to protect the delicate mineral pigment surfaces and cotton cloth canvas substrates from the arid desert climate conditions of Rajasthan where the extremely low ambient humidity can cause cotton fibre brittleness and mineral pigment cracking and the high-humidity monsoon season conditions can promote mould growth and pigment softening that would compromise the visual quality and structural integrity of authentic Pichwai art cloth paintings where the vault storage specification maintains temperature within the range of twenty to twenty-four degrees Celsius with relative humidity between forty-five and fifty-five percent measured by calibrated digital sensors with continuous monitoring and alarm thresholds that alert facility personnel when environmental conditions approach tolerance boundaries where the storage vault employs dehumidification systems during the monsoon season and humidification systems during the dry summer months maintaining consistent environmental conditions throughout the annual climate cycle preventing the cyclic humidity stress that causes cotton canvas dimensional changes and mineral pigment adhesion failure over repeated humidity fluctuation cycles where the vault storage racking system uses padded horizontal shelving that supports the stored Pichwai paintings in flat orientation without rolling preventing the compression set and crease formation that can occur in rolled storage of large-format Pichwai cloth panels. The Pichwai heritage market development initiative led by the Rajasthan State Handicrafts Promotion Board in collaboration with the Nathdwara Shrinathji Temple Trust and the National Museum New Delhi has established a comprehensive institutional market access platform connecting the hereditary Pichwai artisan families with temple trusts seeking authentic Pichwai installations national museums requiring heritage art acquisitions and international collectors of Indian devotional art where the GI Rajasthan Pichwai Mark provides the cultural provenance and authenticity assurance framework essential for establishing premium market positioning for authentic Nathdwara Pichwai cloth paintings in the growing global market for Indian spiritual and heritage art where the extraordinary devotional significance and visual grandeur of large-scale Pichwai paintings with their rich mineral pigments and intricate Krishna leela narrative compositions have created exceptional demand from Hindu temple communities worldwide and institutional art collectors seeking authentic Indian devotional art masterworks that embody the living tradition of Nathdwara Pichwai painting.</p></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}



