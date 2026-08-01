import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#166534', '#15803d', '#16a34a', '#22c55e', '#4ade80', '#14532d', '#052e16', '#dcfce7']
const PRODUCTS = ['Gond Tree of Life Panel', 'Gond Forest Animal Mural', 'Gond Fish Pond Painting', 'Gond Bird Dance Canvas', 'Gond Village Scene Scroll', 'Gond Mythical Serpent Art', 'Gond Sun Moon Mural', 'Gond Harvest Festival Panel']
const ARTISANS = ['Gond Adivasi Art Collective MP', 'Bhopal Gond Heritage Guild MP', 'Mandla Tribal Painters MP', 'Dindori Gond Village Cluster MP', 'Seoni Forest Artists MP', 'Shahpura Gond Society MP', 'Umaria Gond Cooperative MP', 'Jabalpur Gond Traditional MP']
const STATUSES = ['GI Madhya Pradesh Gond Mark', 'Natural Earth Pigment QC', 'Canvas Primer Coat QC', 'Flat Corrugated Carton Box', 'Dry Dehumidified Storage', 'Gond Pattern Fidelity Test']

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
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#dcfce7" strokeWidth="6" />
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
    id: `GND-${String(offset + i + 1).padStart(4, '0')}`,
    painter: ARTISANS[(offset + i) % ARTISANS.length], ware: PRODUCTS[(offset + i) % PRODUCTS.length],
    status: STATUSES[(offset + i) % STATUSES.length], qty: ri(1, 20, ((offset + i) * 19) % 20) + 1,
    cost: ri(4000, 52000, ((offset + i) * 10707) % 48000) + 4000,
    date: new Date(2024, ((offset + i) % 12), ri(1, 28, (offset + i) % 28)).toISOString().slice(0, 10),
  }))

const gondrecords = [
  { id: 'GND-0001', painter: 'Gond Adivasi Art Collective MP', ware: 'Gond Tree of Life Panel', status: 'GI Madhya Pradesh Gond Mark', qty: 3, cost: 48000, date: '2024-01-15' },
  { id: 'GND-0002', painter: 'Bhopal Gond Heritage Guild MP', ware: 'Gond Forest Animal Mural', status: 'Natural Earth Pigment QC', qty: 5, cost: 36000, date: '2024-01-28' },
  { id: 'GND-0003', painter: 'Mandla Tribal Painters MP', ware: 'Gond Fish Pond Painting', status: 'Canvas Primer Coat QC', qty: 2, cost: 52000, date: '2024-02-10' },
  { id: 'GND-0004', painter: 'Dindori Gond Village Cluster MP', ware: 'Gond Bird Dance Canvas', status: 'Flat Corrugated Carton Box', qty: 7, cost: 22000, date: '2024-02-22' },
  { id: 'GND-0005', painter: 'Seoni Forest Artists MP', ware: 'Gond Village Scene Scroll', status: 'Dry Dehumidified Storage', qty: 4, cost: 44000, date: '2024-03-08' },
  { id: 'GND-0006', painter: 'Shahpura Gond Society MP', ware: 'Gond Mythical Serpent Art', status: 'Gond Pattern Fidelity Test', qty: 6, cost: 28000, date: '2024-03-20' },
  { id: 'GND-0007', painter: 'Umaria Gond Cooperative MP', ware: 'Gond Sun Moon Mural', status: 'GI Madhya Pradesh Gond Mark', qty: 2, cost: 50000, date: '2024-04-03' },
  { id: 'GND-0008', painter: 'Jabalpur Gond Traditional MP', ware: 'Gond Harvest Festival Panel', status: 'Natural Earth Pigment QC', qty: 8, cost: 16000, date: '2024-04-16' },
  { id: 'GND-0009', painter: 'Gond Adivasi Art Collective MP', ware: 'Gond Forest Animal Mural', status: 'Canvas Primer Coat QC', qty: 4, cost: 40000, date: '2024-04-28' },
  { id: 'GND-0010', painter: 'Bhopal Gond Heritage Guild MP', ware: 'Gond Tree of Life Panel', status: 'Flat Corrugated Carton Box', qty: 3, cost: 48000, date: '2024-05-10' },
  { id: 'GND-0011', painter: 'Mandla Tribal Painters MP', ware: 'Gond Fish Pond Painting', status: 'Dry Dehumidified Storage', qty: 5, cost: 32000, date: '2024-05-23' },
  { id: 'GND-0012', painter: 'Dindori Gond Village Cluster MP', ware: 'Gond Bird Dance Canvas', status: 'Gond Pattern Fidelity Test', qty: 6, cost: 20000, date: '2024-06-05' },
  { id: 'GND-0013', painter: 'Seoni Forest Artists MP', ware: 'Gond Village Scene Scroll', status: 'GI Madhya Pradesh Gond Mark', qty: 3, cost: 46000, date: '2024-06-18' },
  { id: 'GND-0014', painter: 'Shahpura Gond Society MP', ware: 'Gond Mythical Serpent Art', status: 'Natural Earth Pigment QC', qty: 7, cost: 24000, date: '2024-07-01' },
  { id: 'GND-0015', painter: 'Umaria Gond Cooperative MP', ware: 'Gond Sun Moon Mural', status: 'Canvas Primer Coat QC', qty: 2, cost: 52000, date: '2024-07-14' },
  { id: 'GND-0016', painter: 'Jabalpur Gond Traditional MP', ware: 'Gond Harvest Festival Panel', status: 'Flat Corrugated Carton Box', qty: 10, cost: 12000, date: '2024-07-26' },
  { id: 'GND-0017', painter: 'Gond Adivasi Art Collective MP', ware: 'Gond Tree of Life Panel', status: 'Dry Dehumidified Storage', qty: 4, cost: 42000, date: '2024-08-08' },
  { id: 'GND-0018', painter: 'Bhopal Gond Heritage Guild MP', ware: 'Gond Fish Pond Painting', status: 'Gond Pattern Fidelity Test', qty: 5, cost: 30000, date: '2024-08-20' },
  { id: 'GND-0019', painter: 'Mandla Tribal Painters MP', ware: 'Gond Forest Animal Mural', status: 'GI Madhya Pradesh Gond Mark', qty: 3, cost: 50000, date: '2024-09-02' },
  { id: 'GND-0020', painter: 'Dindori Gond Village Cluster MP', ware: 'Gond Bird Dance Canvas', status: 'Natural Earth Pigment QC', qty: 8, cost: 18000, date: '2024-09-14' },
]

export default function GondMadhyaLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})

  const allRecords = [...gondrecords, ...genRecords(21), ...genRecords(41)]

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
    <div className="gnd-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Gond Madhya Pradesh' }]} />
      <PageHeader title="Gond Madhya Pradesh Logistics" description="Madhya Pradesh Gond tribal art supply chain with GI Madhya Pradesh Gond Mark, natural earth pigment quality control, canvas primer coat verification, flat corrugated carton packaging, dry dehumidified storage, and Gond pattern fidelity testing across 8 tribal artisan clusters in Mandla, Dindori, and Seoni" />
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
            <KpiTile label="Tribal Clusters" value={ARTISANS.length} />
            <KpiTile label="Avg Cost" value={`₹${Math.round(allRecords.reduce((s, r) => s + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>
          <div className="grid grid-cols-6 gap-4">
            <HealthRing label="GI Tag" value={87} />
            <HealthRing label="Pigment" value={83} />
            <HealthRing label="Primer" value={80} />
            <HealthRing label="Pack" value={85} />
            <HealthRing label="Storage" value={91} />
            <HealthRing label="Pattern" value={88} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Gond Families" value="500+ Active" />
            <ValueTile label="Tradition" value="Since 1500 AD" />
            <ValueTile label="Export Markets" value="6 Countries" />
            <ValueTile label="Annual Revenue" value="₹1.8 Crore" />
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
            placeholder="Search Gond art shipments..."
          />
          <div className="rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-green-100">
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
                  <tr key={record.id} className="border-t hover:bg-green-50/50">
                    <td className="p-3 font-mono text-xs">{record.id}</td>
                    <td className="p-3"><ProductBadge name={record.ware} /></td>
                    <td className="p-3">{record.painter}</td>
                    <td className="p-3"><StatusBadge status={record.status} /></td>
                    <td className="p-3">{record.qty} {['pcs', 'panels', 'murals', 'scrolls'][parseInt(record.id.slice(4)) % 4]}</td>
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
              <CardHeader><CardTitle>Tribal Volume</CardTitle></CardHeader>
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
              <CardHeader><CardTitle>Gond Art — 500-Year Madhya Pradesh Tribal Painting Heritage</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">Gond art represents one of the most visually distinctive and culturally rich tribal painting traditions of central India having been continuously practised for over five centuries by the Gond Adivasi tribal communities inhabiting the dense forest regions of the Satpura and Vindhya hill ranges in the Mandla Dindori Seoni and Shahdol districts of Madhya Pradesh where the Gond tribal artists create vividly coloured narrative paintings depicting the sacred relationship between the Gond community and the natural forest environment through elaborate compositions featuring trees animals birds fish and mythical serpent forms rendered in the characteristic Gond artistic style using bold black outlines filled with vibrant flat colour areas and intricate dot-dash-line pattern fills that create a sense of rhythmic visual energy unique to the Gond art tradition where the Gond painting style originated from the traditional practice of decorating the mud walls and floors of Gond tribal homes with sacred geometric patterns and nature motifs during wedding ceremonies harvest festivals and sacred rituals intended to invoke the blessings of the forest deities and ensure prosperity and protection for the tribal community where the Gond artistic vocabulary centres on the Tree of Life motif that symbolises the sacred connection between the earthly and celestial realms through an elaborately detailed tree form populated with animals birds fish and mythical creatures connected by rhythmic pattern lines representing the life force energy that flows through all living beings in the Gond cosmological worldview where each Gond painting begins with a bold black outline created using charcoal or lampblack pigment defining the contours of the tree animal or narrative figure followed by the application of vivid natural mineral and vegetable pigments in flat colour areas within the outlined forms with the characteristic Gond pattern fills executed using fine brush work creating intricate sequences of dots dashes parallel lines cross-hatching and concentric geometric patterns within each coloured area giving the Gond painting its distinctive visual texture and rhythmic complexity that distinguishes authentic Gond tribal art from painted reproductions executed in other Indian folk art styles where the Gond art tradition was brought to national and international attention through the pioneering work of the late Jangarh Singh Shyam a Gond tribal artist from Patangarh village in Mandla district who transformed the traditional Gond wall painting technique into a contemporary art form using canvas and paper substrates creating a new genre of Gond art that gained recognition in major art galleries and museums worldwide establishing the Gond art tradition as one of the most celebrated Indian tribal art forms in the global contemporary art and heritage craft market.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Natural Earth Pigment QC & Canvas Primer Standards</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The natural earth pigment quality control framework for Gond art establishes a comprehensive testing protocol for the traditional mineral and vegetable pigments used in authentic Gond tribal paintings where the pigment palette includes red ochre derived from iron oxide-rich laterite soil deposits found in the Dindori and Mandla forest regions yellow ochre from limonite clay deposits white kaolin clay from river bed deposits black lampblack from partially burnt wood charcoal green from crushed chlorite mineral and blue from indigo plant extract where each pigment must meet particle size specifications with maximum particle diameter of twenty-five microns measured by laser diffraction analysis ensuring smooth consistent pigment application without visible particle granularity on the painting surface where the pigment brightness test measures the reflectance value of each dried pigment using a calibrated spectrophotometer confirming minimum reflectance values of sixty percent for white kaolin fifty percent for yellow ochre forty-five percent for red ochre and thirty-five percent for green chlorite confirming sufficient colour intensity and vibrancy that meets the visual quality standards established by the Gond Adivasi Art Collective for authentic Gond tribal art products where the pigment lightfastness test exposes dried pigment samples to accelerated UV radiation equivalent to five hundred hours of direct sunlight exposure measured in accordance with ASTM D4303 lightfastness testing methodology confirming colour retention within Delta E five units of the original colour value ensuring the Gond painting colours maintain their characteristic vibrancy over extended display periods without significant fading that would compromise the visual quality and market value of the artwork where the canvas primer coat quality control requires the canvas substrate to be primed with two coats of acrylic gesso primer providing a smooth semi-absorbent painting surface with primer thickness between fifty and eighty microns measured by digital micrometer at five reference points confirming uniform primer coverage across the entire canvas surface where the primer adhesion test uses a standardised cross-hatch adhesion test in accordance with ASTM D3359 methodology confirming minimum adhesion rating of 4B where less than five percent of the cross-hatch grid area shows primer delamination verifying the primer has formed a durable bond with the canvas fabric that supports the Gond painting technique involving repeated layering of bold outline pigment and fine pattern fill details without primer flaking or surface cracking that would compromise the visual quality and long-term durability of authentic Gond tribal art paintings.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Flat Corrugated Carton Packaging for Gond Art Canvas Transit</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">Flat corrugated carton packaging with acid-free tissue interleaving and foam edge protection has been specifically designed for the Gond tribal art canvas supply chain to protect the painted canvas surfaces from physical abrasion moisture exposure and mechanical compression damage during transit from the tribal artisan village workshops in the Mandla Dindori and Seoni forest districts of Madhya Pradesh to urban retail distribution points in Bhopal Delhi Mumbai and international shipping destinations serving the growing global demand for authentic Gond tribal art products where the packaging specification utilises five-ply double-wall corrugated fibreboard cartons with minimum burst strength of fourteen kilopascals and minimum edge crush resistance of six kilonewtons per metre measured in accordance with IS 10641 corrugated board testing methodology ensuring the outer shipping container provides adequate mechanical protection against stacking pressures and handling forces encountered during road transit from the remote forest village production centres to major urban retail hubs where the inner packaging configuration wraps each Gond art canvas individually in acid-free tissue paper with pH neutral value between six point five and seven point five measured in accordance with ISO 10716 permanent paper acidity testing methodology ensuring the tissue paper does not generate acidic degradation products that could cause pigment discoloration or canvas fibre oxidation during extended transit and storage periods where each wrapped canvas is further protected by custom-cut expanded polyethylene foam edge strips at all four edges preventing direct contact between the painted canvas surface and the cardboard container walls eliminating the risk of pigment abrasion from cardboard fibres and vibration-induced friction damage during transit on the winding forest hill roads connecting the tribal village workshops to the national highway network where the packaging includes a silica gel desiccant sachet providing moisture absorption capacity calculated based on the packaging volume maintaining relative humidity below fifty percent within the sealed container preventing ambient moisture condensation during transit through the humid monsoon season prevalent in the Satpura hill region of Madhya Pradesh where relative humidity frequently exceeds eighty percent during the June through September monsoon months creating conditions that could cause canvas warping pigment softening and mould growth if the packaged Gond art canvases are not adequately protected from ambient moisture during the transit and distribution cycle from tribal village production to urban retail and international gallery destinations.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Dry Dehumidified Storage & Gond Heritage Market Development</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">Dry dehumidified storage facilities with automated humidity control have been established for the Gond tribal art canvas supply chain to protect the natural earth pigment surfaces and canvas substrates from the extreme humidity fluctuations of the Madhya Pradesh monsoon climate where relative humidity varies from below thirty percent during the dry summer months to above eighty-five percent during the peak monsoon season creating environmental stress cycles that can cause canvas dimensional instability natural pigment cracking and mould growth on both the painted surface and the unpainted canvas reverse that would irreversibly compromise the visual quality and material integrity of authentic Gond tribal art canvases where the dehumidified storage specification maintains temperature within the range of twenty to twenty-eight degrees Celsius with relative humidity between forty and fifty percent measured by calibrated digital sensors with continuous monitoring and automated dehumidifier activation when humidity exceeds the fifty percent threshold ensuring consistent storage conditions throughout the annual climate cycle without requiring expensive air-conditioned climate control that would be economically impractical for village-level storage facilities in the remote forest districts of Mandla and Dindori where the storage facility construction utilises moisture-resistant plastered walls with damp-proof course membrane and louvered ventilation with insect mesh screens preventing moisture ingress pest access and enabling natural air circulation that assists the dehumidification system in maintaining the required storage environment where the stored Gond art canvases are arranged vertically on padded shelving with acid-free tissue interleaving between each canvas preventing pigment-to-pigment contact that could cause paint transfer or abrasion during storage retrieval and handling operations. The Gond heritage market development initiative led by the Madhya Pradesh State Tribal Welfare Department in collaboration with the Gond Adivasi Art Collective Bhopal and the Indira Gandhi Rashtriya Manav Sangrahalaya National Museum of Mankind has established a comprehensive tribal artisan empowerment programme connecting over five hundred active Gond tribal artist families across eight district clusters with institutional buyers including the MP State Emporium national tribal art galleries and international fair trade organisations where the GI Madhya Pradesh Gond Mark provides the cultural provenance and authenticity assurance framework essential for establishing premium market positioning for authentic Gond tribal art products in the growing global market for indigenous tribal art where the extraordinary visual vitality of Gond art with its bold outlines vibrant natural pigments and intricate pattern fills has created exceptional collector demand positioning authentic Gond tribal paintings as among the most sought-after Indian tribal art products in the international heritage art and sustainable craft market.</p></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}



