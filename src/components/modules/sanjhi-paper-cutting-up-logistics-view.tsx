import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#6d28d9', '#7c3aed', '#8b5cf6', '#a78bfa', '#c4b5fd', '#5b21b6', '#4c1d95', '#ede9fe']
const PRODUCTS = ['Sanjhi Radha Krishna Silhouette', 'Sanjhi Peacock Canopy Panel', 'Sanjhi Lotus Arch Mural', 'Sanjhi Tree of Life Screen', 'Sanjhi Gopuka Dance Scroll', 'Sanjhi Temple Dome Stencil', 'Sanjhi Yamuna River Scene', 'Sanjhi Floral Jhula Hanging']
const ARTISANS = ['Mathura Sanjhi Art Guild UP', 'Vrindavan Temple Artists UP', 'Gokul Heritage Cluster UP', 'Nandgaon Paper Cutters UP', 'Barsana Sanjhi Collective UP', 'Govardhan Village Artisans UP', 'Agra Craft Society UP', 'Fatehpur Sikri Guild UP']
const STATUSES = ['GI UP Sanjhi Mark', 'Paper Cut Precision QC', 'Stencil Symmetry Check', 'Natural Pigment Adhesion Test', 'Silhouette Definition Audit', 'Frame Preservation Rating']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-violet-100 text-violet-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="w-24 h-2 bg-violet-200 rounded-full overflow-hidden"><div className="h-full bg-violet-700 rounded-full" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ label, value, size = 80 }: { label: string; value: number; size?: number }) => {
  const r = (size - 12) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#ede9fe" strokeWidth="6" />
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
    id: `SJC-${String(offset + i + 1).padStart(4, '0')}`,
    artist: ARTISANS[(offset + i) % ARTISANS.length], design: PRODUCTS[(offset + i) % PRODUCTS.length],
    status: STATUSES[(offset + i) % STATUSES.length], qty: ri(1, 12, ((offset + i) * 19) % 12) + 1,
    cost: ri(5500, 65000, ((offset + i) * 11707) % 59500) + 5500,
    date: new Date(2024, ((offset + i) % 12), ri(1, 28, (offset + i) % 28)).toISOString().slice(0, 10),
  }))

const sanjhirecords = [
  { id: 'SJC-0001', artist: 'Mathura Sanjhi Art Guild UP', design: 'Sanjhi Radha Krishna Silhouette', status: 'GI UP Sanjhi Mark', qty: 4, cost: 62000, date: '2024-01-15' },
  { id: 'SJC-0002', artist: 'Vrindavan Temple Artists UP', design: 'Sanjhi Peacock Canopy Panel', status: 'Paper Cut Precision QC', qty: 6, cost: 34000, date: '2024-01-28' },
  { id: 'SJC-0003', artist: 'Gokul Heritage Cluster UP', design: 'Sanjhi Lotus Arch Mural', status: 'Stencil Symmetry Check', qty: 3, cost: 65000, date: '2024-02-10' },
  { id: 'SJC-0004', artist: 'Nandgaon Paper Cutters UP', design: 'Sanjhi Tree of Life Screen', status: 'Natural Pigment Adhesion Test', qty: 8, cost: 18000, date: '2024-02-22' },
  { id: 'SJC-0005', artist: 'Barsana Sanjhi Collective UP', design: 'Sanjhi Gopuka Dance Scroll', status: 'Silhouette Definition Audit', qty: 5, cost: 48000, date: '2024-03-08' },
  { id: 'SJC-0006', artist: 'Govardhan Village Artisans UP', design: 'Sanjhi Temple Dome Stencil', status: 'Frame Preservation Rating', qty: 2, cost: 65000, date: '2024-03-20' },
  { id: 'SJC-0007', artist: 'Agra Craft Society UP', design: 'Sanjhi Yamuna River Scene', status: 'GI UP Sanjhi Mark', qty: 7, cost: 22000, date: '2024-04-03' },
  { id: 'SJC-0008', artist: 'Fatehpur Sikri Guild UP', design: 'Sanjhi Floral Jhula Hanging', status: 'Paper Cut Precision QC', qty: 4, cost: 56000, date: '2024-04-16' },
  { id: 'SJC-0009', artist: 'Mathura Sanjhi Art Guild UP', design: 'Sanjhi Radha Krishna Silhouette', status: 'Stencil Symmetry Check', qty: 6, cost: 38000, date: '2024-04-28' },
  { id: 'SJC-0010', artist: 'Vrindavan Temple Artists UP', design: 'Sanjhi Peacock Canopy Panel', status: 'Natural Pigment Adhesion Test', qty: 3, cost: 60000, date: '2024-05-10' },
  { id: 'SJC-0011', artist: 'Gokul Heritage Cluster UP', design: 'Sanjhi Lotus Arch Mural', status: 'Silhouette Definition Audit', qty: 8, cost: 20000, date: '2024-05-23' },
  { id: 'SJC-0012', artist: 'Nandgaon Paper Cutters UP', design: 'Sanjhi Tree of Life Screen', status: 'Frame Preservation Rating', qty: 5, cost: 44000, date: '2024-06-05' },
  { id: 'SJC-0013', artist: 'Barsana Sanjhi Collective UP', design: 'Sanjhi Gopuka Dance Scroll', status: 'GI UP Sanjhi Mark', qty: 4, cost: 62000, date: '2024-06-18' },
  { id: 'SJC-0014', artist: 'Govardhan Village Artisans UP', design: 'Sanjhi Temple Dome Stencil', status: 'Paper Cut Precision QC', qty: 7, cost: 24000, date: '2024-07-01' },
  { id: 'SJC-0015', artist: 'Agra Craft Society UP', design: 'Sanjhi Yamuna River Scene', status: 'Stencil Symmetry Check', qty: 3, cost: 58000, date: '2024-07-14' },
  { id: 'SJC-0016', artist: 'Fatehpur Sikri Guild UP', design: 'Sanjhi Floral Jhula Hanging', status: 'Natural Pigment Adhesion Test', qty: 6, cost: 32000, date: '2024-07-26' },
  { id: 'SJC-0017', artist: 'Mathura Sanjhi Art Guild UP', design: 'Sanjhi Radha Krishna Silhouette', status: 'Silhouette Definition Audit', qty: 4, cost: 65000, date: '2024-08-08' },
  { id: 'SJC-0018', artist: 'Vrindavan Temple Artists UP', design: 'Sanjhi Peacock Canopy Panel', status: 'Frame Preservation Rating', qty: 6, cost: 36000, date: '2024-08-20' },
  { id: 'SJC-0019', artist: 'Gokul Heritage Cluster UP', design: 'Sanjhi Lotus Arch Mural', status: 'GI UP Sanjhi Mark', qty: 3, cost: 62000, date: '2024-09-02' },
  { id: 'SJC-0020', artist: 'Nandgaon Paper Cutters UP', design: 'Sanjhi Tree of Life Screen', status: 'Paper Cut Precision QC', qty: 8, cost: 16000, date: '2024-09-14' },
]

export default function SanjhiPaperCuttingUpLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})

  const allRecords = [...sanjhirecords, ...genRecords(21), ...genRecords(41)]

  const filteredRecords = useMemo(() => {
    if (!searchQuery && Object.keys(activeFilters).every(k => !activeFilters[k].length)) return allRecords
    const sq = searchQuery.toLowerCase()
    return allRecords.filter(r => { if (sq && !r.id.toLowerCase().includes(sq) && !r.design.toLowerCase().includes(sq)) return false; return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string)); })
  }, [searchQuery, activeFilters, allRecords])

  const filterGroups = [
    { key: 'design', label: 'Design', options: PRODUCTS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.design === p).length })) },
    { key: 'artist', label: 'Artist', options: ARTISANS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.artist === p).length })) },
  ]

  const trendData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m, i) => ({ month: m, shipments: ri(4, 20, allRecords.length * 0.10 + i * 3) }))
  const artistChart = ARTISANS.map(p => ({ name: p.split(' ').slice(0, 2).join(' '), volume: allRecords.filter(r => r.artist === p).reduce((s, r) => s + r.qty, 0) }))
  const statusPie = STATUSES.map(s => ({ name: s, value: allRecords.filter(r => r.status === s).length }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="sjc-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Sanjhi Paper Art' }]} />
      <PageHeader title="Sanjhi Paper Cutting Uttar Pradesh Logistics" description="Uttar Pradesh Mathura Vrindavan Sanjhi paper cutting stencil art supply chain with GI UP Sanjhi Mark certification, paper cut precision quality control, stencil symmetry verification, natural pigment adhesion testing, silhouette definition audit, and frame preservation rating across 8 Sanjhi artisan clusters in Braj region" />
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="bg-violet-100">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <KpiTile label="Total Shipments" value={allRecords.length} />
            <KpiTile label="Active Designs" value={PRODUCTS.length} />
            <KpiTile label="Artist Clusters" value={ARTISANS.length} />
            <KpiTile label="Avg Cost" value={`₹${Math.round(allRecords.reduce((s, r) => s + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>
          <div className="grid grid-cols-6 gap-4">
            <HealthRing label="GI Tag" value={93} />
            <HealthRing label="Precision" value={90} />
            <HealthRing label="Symmetry" value={87} />
            <HealthRing label="Pigment" value={85} />
            <HealthRing label="Silhouette" value={92} />
            <HealthRing label="Frame" value={88} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Sanjhi Families" value="12 Active" />
            <ValueTile label="Tradition" value="Since 1500 AD" />
            <ValueTile label="Export Markets" value="5 Countries" />
            <ValueTile label="Annual Revenue" value="₹1.2 Crore" />
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
            placeholder="Search Sanjhi paper art shipments..."
          />
          <div className="rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-violet-100">
                <tr>
                  <th className="p-3 text-left font-medium">ID</th>
                  <th className="p-3 text-left font-medium">Design</th>
                  <th className="p-3 text-left font-medium">Artist</th>
                  <th className="p-3 text-left font-medium">Status</th>
                  <th className="p-3 text-left font-medium">Qty</th>
                  <th className="p-3 text-left font-medium">Cost</th>
                  <th className="p-3 text-left font-medium">Cost Bar</th>
                  <th className="p-3 text-left font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map(record => (
                  <tr key={record.id} className="border-t hover:bg-violet-50/50">
                    <td className="p-3 font-mono text-xs">{record.id}</td>
                    <td className="p-3"><ProductBadge name={record.design} /></td>
                    <td className="p-3">{record.artist}</td>
                    <td className="p-3"><StatusBadge status={record.status} /></td>
                    <td className="p-3">{record.qty} {['panels', 'scrolls', 'murals', 'hangings'][parseInt(record.id.slice(4)) % 4]}</td>
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
              <CardHeader><CardTitle>Artist Volume</CardTitle></CardHeader>
              <CardContent>
                <BarChart width={500} height={300} data={artistChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="volume" fill={COLORS[0]}>
                    {artistChart.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
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
              <CardHeader><CardTitle>Sanjhi Paper Cutting — Sacred Braj Region Temple Art Tradition</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">Sanjhi paper cutting art represents one of the most spiritually significant and technically refined stencil art traditions of India having originated approximately five hundred years ago in the Braj region of Uttar Pradesh centred on the holy cities of Mathura and Vrindavan where the tradition developed as a devotional art form practiced by Brahmin priests and temple artisans who created elaborate paper stencil compositions depicting the Krishna lila divine play episodes from the life of Lord Krishna for ritual display during the annual Sanjhi festival celebrated during the auspicious Sharad Purnima full moon in the month of Ashvin where the Sanjhi art technique involves the painstaking hand-cutting of intricate stencil patterns from handmade paper using specially sharpened surgical-grade fine cutting tools producing extraordinarily detailed silhouette compositions featuring Radha Krishna figures peacocks lotus flowers temple domes floral archways and elaborate landscape scenes from the Braj region mythology rendered entirely in paper cut silhouette form without any drawing or painting assistance where each Sanjhi stencil composition is created by cutting multiple layers of coloured paper using a single continuous cutting motion that produces clean precise edges without tearing or fraying requiring extraordinary hand control and spatial awareness to maintain the structural integrity of the delicate paper design which often features interconnected lattice patterns and fine filigree elements as thin as one millimetre in width where the completed Sanjhi stencil is mounted on a contrasting background panel or backlit to create a luminous silhouette effect that reveals the extraordinary precision and artistry of the paper cutting technique where the traditional Sanjhi compositions follow canonical design guidelines established by the Vrindavan temple tradition specifying the iconographic proportions colour symbolism and narrative sequencing of the Krishna lila episodes ensuring each Sanjhi artwork faithfully represents the sacred devotional tradition of the Braj region.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Paper Cut Precision QC & Stencil Symmetry Standards</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The paper cut precision quality control and stencil symmetry verification protocols for Sanjhi paper cutting art establish the primary technical quality assurance framework for the traditional hand-cut stencil process that defines the authentic Sanjhi art visual quality and devotional accuracy where the paper cut precision test measures the edge quality and dimensional accuracy of the hand-cut paper stencil elements using digital microscopy at thirty times magnification confirming clean smooth edges without tearing feathering or jagged cutting marks that would indicate inadequate blade sharpness or improper cutting technique where the precision test also measures the minimum feature width of the stencil elements confirming the finest filigree elements maintain structural integrity at widths down to one millimetre without tearing or collapsing during the cutting process ensuring the Sanjhi stencil demonstrates the extraordinary hand cutting skill that characterises master-level Sanjhi paper art execution where the stencil symmetry test evaluates the bilateral and radial symmetry of the Sanjhi composition using digital scanning and automated symmetry analysis software confirming symmetry accuracy within plus or minus zero point five millimetres for all design elements ensuring the balanced devotional composition quality that defines the canonical Sanjhi aesthetic where the symmetry test examines critical design features including the Radha Krishna figure proportions peacock feather patterns lotus petal arrangements temple dome curvature and floral vine scroll continuity verifying that the composition maintains the prescribed symmetrical balance specified in the Vrindavan temple Sanjhi design canons ensuring each Sanjhi artwork faithfully represents the sacred design tradition without asymmetry or distortion that would compromise both the aesthetic quality and the devotional authenticity of the temple Sanjhi art form where the traditional Sanjhi cutting technique produces positive and negative stencil pairs that must be perfectly complementary with the cut-out paper elements fitting precisely into the corresponding void spaces of the companion stencil sheet.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Natural Pigment Adhesion & Silhouette Definition Verification</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The natural pigment adhesion and silhouette definition verification protocols ensure the colour quality and visual clarity of authentic Sanjhi paper cutting art where the natural pigment adhesion test measures the bonding strength and colour intensity of the traditional mineral and vegetable pigments applied to the handmade paper stencil substrate using cross-hatch adhesion testing confirming minimum adhesion rating of four on the five-point scale ensuring the natural pigment colours including red from vermilion and natural madder yellow from turmeric and haldi blue from natural indigo leaf extract green from natural leaf chlorophyll and white from natural zinc oxide maintain permanent colour adhesion on the paper substrate without flaking peeling or fading that would compromise the visual quality and devotional significance of the Sanjhi artwork where the natural pigment preparation test evaluates the pigment binder concentration using gravimetric analysis confirming gum arabic binder concentration between eight and twelve percent by weight ensuring adequate pigment binding strength while maintaining the natural matte finish and soft colour quality that characterises authentic Sanjhi art pigments without the glossy artificial appearance of synthetic colouring materials where the silhouette definition test evaluates the visual clarity and edge sharpness of the Sanjhi silhouette composition under standardised lighting conditions at five hundred lux illuminance confirming all stencil elements are clearly distinguishable with clean crisp edge definition without shadow bleeding halo effects or colour contamination between adjacent design elements where the silhouette test examines the contrast ratio between the stencil elements and the background surface confirming minimum contrast ratio of four to one ensuring the Sanjhi paper cutting design is clearly visible and aesthetically compelling when displayed in the temple shrine or gallery exhibition environment where the silhouette clarity is critical for the devotional function of the Sanjhi art as a ritual focal point during the Sanjhi festival celebrations.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Frame Preservation & Sanjhi Heritage Market Development</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The frame preservation rating and Sanjhi heritage market development framework provides the conservation quality assurance and market infrastructure for the Sanjhi paper cutting art supply chain ensuring all GI-certified Sanjhi artworks are properly preserved and presented while connecting the remaining Sanjhi artisan families with institutional and collector market demand for authentic temple paper cutting art where the frame preservation rating test evaluates the conservation quality of the mounting framing and display system for each Sanjhi artwork confirming acid-free conservation-grade mounting board with pH value between seven point five and eight point five providing a chemically stable environment that prevents acid migration from the mounting board to the handmade paper stencil substrate preventing paper yellowing embrittlement and foxing that would degrade the Sanjhi artwork over time where the framing glass specification requires UV-filtering conservation glass with minimum ninety-seven percent ultraviolet radiation block rate preventing light-induced pigment fading and paper fibre degradation while maintaining clear optical visibility of the delicate Sanjhi silhouette design where the frame seal test confirms airtight sealing preventing moisture and atmospheric pollutant ingress that could cause paper discolouration mould growth or pigment deterioration in the enclosed frame environment ensuring the Sanjhi artwork maintains its visual quality and structural integrity for minimum fifty years of museum-quality display life where the Sanjhi heritage market development initiative led by the Uttar Pradesh State Handicrafts and Handlooms Development Corporation in collaboration with the Mathura District Cultural Authority and the Vrindavan Temple Trust has established institutional procurement and exhibition programmes connecting the twelve active Sanjhi paper cutting artisan families with the National Museum New Delhi the Uttar Pradesh State Museum Lucknow and international cultural institutions including the British Museum London the Metropolitan Museum of Art New York and the Asian Civilisations Museum Singapore creating sustainable market demand for authentic GI-certified Sanjhi paper art with projected annual revenue growth of eighteen percent driven by expanding global recognition of Sanjhi as one of the most technically accomplished and spiritually significant Indian paper art traditions.</p></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}



