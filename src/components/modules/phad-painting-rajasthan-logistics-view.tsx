import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#7c3aed', '#8b5cf6', '#a78bfa', '#c4b5fd', '#ede9fe', '#6d28d9', '#5b21b6', '#f5f3ff']
const PRODUCTS = ['Devnarayan Phad Scroll Panel', 'Pabuji Rathod Epic Phad', 'Bhilwara Hero Legend Scroll', 'Rajasthani Folk Devotion Panel', 'Temple Procession Phad Cloth', 'Ancestral Hero Worship Scroll', 'Royal Court Scene Phad', 'Battle Narrative Scroll Panel']
const PAINTERS = ['Bhilwara Phad Painter Guild', 'Shahpura Chitrakar Samiti', 'Bijolia Traditional Phad Artists', 'Kumbhalgarh Folk Art Colony', 'Devnarayan Temple Painter Society', 'Chittorgarh Scroll Art Guild', 'Rajsamand Phad Heritage Studio', 'Nathdwara Devotional Art Centre']
const STATUSES = ['GI Phad Painting Mark', 'IS 16796 Folk Scroll Grade A', 'Canvas Roll Cloth Wrap', 'Flatbed Truck Transit', 'Dust-Free Storage 20-28C', 'Natural Pigment Fidelity QC']

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
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f5f3ff" strokeWidth="6" />
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
    id: `PPR-${String(offset + i + 1).padStart(4, '0')}`,
    painter: PAINTERS[(offset + i) % PAINTERS.length], ware: PRODUCTS[(offset + i) % PRODUCTS.length],
    status: STATUSES[(offset + i) % STATUSES.length], qty: ri(1, 35, ((offset + i) * 31) % 35) + 1,
    cost: ri(5000, 98000, ((offset + i) * 14173) % 93000) + 5000,
    date: new Date(2024, ((offset + i) % 12), ri(1, 28, (offset + i) % 28)).toISOString().slice(0, 10),
  }))

const phadRecords = [
  { id: 'PPR-0001', painter: 'Bhilwara Phad Painter Guild', ware: 'Devnarayan Phad Scroll Panel', status: 'GI Phad Painting Mark', qty: 3, cost: 92000, date: '2024-01-10' },
  { id: 'PPR-0002', painter: 'Shahpura Chitrakar Samiti', ware: 'Pabuji Rathod Epic Phad', status: 'IS 16796 Folk Scroll Grade A', qty: 5, cost: 78000, date: '2024-01-23' },
  { id: 'PPR-0003', painter: 'Bijolia Traditional Phad Artists', ware: 'Bhilwara Hero Legend Scroll', status: 'Canvas Roll Cloth Wrap', qty: 4, cost: 85000, date: '2024-02-06' },
  { id: 'PPR-0004', painter: 'Kumbhalgarh Folk Art Colony', ware: 'Rajasthani Folk Devotion Panel', status: 'Flatbed Truck Transit', qty: 7, cost: 52000, date: '2024-02-18' },
  { id: 'PPR-0005', painter: 'Devnarayan Temple Painter Society', ware: 'Temple Procession Phad Cloth', status: 'Dust-Free Storage 20-28C', qty: 6, cost: 68000, date: '2024-03-02' },
  { id: 'PPR-0006', painter: 'Chittorgarh Scroll Art Guild', ware: 'Ancestral Hero Worship Scroll', status: 'Natural Pigment Fidelity QC', qty: 8, cost: 42000, date: '2024-03-15' },
  { id: 'PPR-0007', painter: 'Rajsamand Phad Heritage Studio', ware: 'Royal Court Scene Phad', status: 'GI Phad Painting Mark', qty: 3, cost: 95000, date: '2024-03-28' },
  { id: 'PPR-0008', painter: 'Nathdwara Devotional Art Centre', ware: 'Battle Narrative Scroll Panel', status: 'IS 16796 Folk Scroll Grade A', qty: 9, cost: 35000, date: '2024-04-10' },
  { id: 'PPR-0009', painter: 'Bhilwara Phad Painter Guild', ware: 'Pabuji Rathod Epic Phad', status: 'Canvas Roll Cloth Wrap', qty: 5, cost: 72000, date: '2024-04-22' },
  { id: 'PPR-0010', painter: 'Shahpura Chitrakar Samiti', ware: 'Devnarayan Phad Scroll Panel', status: 'Flatbed Truck Transit', qty: 4, cost: 88000, date: '2024-05-05' },
  { id: 'PPR-0011', painter: 'Bijolia Traditional Phad Artists', ware: 'Bhilwara Hero Legend Scroll', status: 'Dust-Free Storage 20-28C', qty: 7, cost: 55000, date: '2024-05-17' },
  { id: 'PPR-0012', painter: 'Kumbhalgarh Folk Art Colony', ware: 'Rajasthani Folk Devotion Panel', status: 'Natural Pigment Fidelity QC', qty: 6, cost: 64000, date: '2024-05-30' },
  { id: 'PPR-0013', painter: 'Devnarayan Temple Painter Society', ware: 'Temple Procession Phad Cloth', status: 'GI Phad Painting Mark', qty: 3, cost: 91000, date: '2024-06-12' },
  { id: 'PPR-0014', painter: 'Chittorgarh Scroll Art Guild', ware: 'Ancestral Hero Worship Scroll', status: 'IS 16796 Folk Scroll Grade A', qty: 8, cost: 40000, date: '2024-06-24' },
  { id: 'PPR-0015', painter: 'Rajsamand Phad Heritage Studio', ware: 'Royal Court Scene Phad', status: 'Canvas Roll Cloth Wrap', qty: 10, cost: 28000, date: '2024-07-06' },
  { id: 'PPR-0016', painter: 'Nathdwara Devotional Art Centre', ware: 'Battle Narrative Scroll Panel', status: 'Flatbed Truck Transit', qty: 5, cost: 75000, date: '2024-07-18' },
  { id: 'PPR-0017', painter: 'Bhilwara Phad Painter Guild', ware: 'Rajasthani Folk Devotion Panel', status: 'Dust-Free Storage 20-28C', qty: 4, cost: 82000, date: '2024-07-30' },
  { id: 'PPR-0018', painter: 'Shahpura Chitrakar Samiti', ware: 'Devnarayan Phad Scroll Panel', status: 'Natural Pigment Fidelity QC', qty: 7, cost: 48000, date: '2024-08-10' },
  { id: 'PPR-0019', painter: 'Bijolia Traditional Phad Artists', ware: 'Pabuji Rathod Epic Phad', status: 'GI Phad Painting Mark', qty: 6, cost: 60000, date: '2024-08-22' },
  { id: 'PPR-0020', painter: 'Kumbhalgarh Folk Art Colony', ware: 'Bhilwara Hero Legend Scroll', status: 'IS 16796 Folk Scroll Grade A', qty: 5, cost: 70000, date: '2024-09-03' },
]

export default function PhadPaintingRajasthanLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = [...phadRecords, ...genRecords(21), ...genRecords(41)]

  const filteredRecords = useMemo(() => {
    if (!searchQuery && Object.keys(activeFilters).every(k => !activeFilters[k].length)) return allRecords
    const sq = searchQuery.toLowerCase()
    return allRecords.filter(r => { if (sq && !r.id.toLowerCase().includes(sq) && !r.ware.toLowerCase().includes(sq)) return false; return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string)); })
  }, [searchQuery, activeFilters, allRecords])

  const filterGroups = [
    { key: 'ware', label: 'Ware', options: PRODUCTS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.ware === p).length })) },
    { key: 'painter', label: 'Painter', options: PAINTERS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.painter === p).length })) },
  ]

  const trendData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m, i) => ({ month: m, shipments: ri(5, 30, allRecords.length * 0.14 + i * 4) }))
  const painterChart = PAINTERS.map(p => ({ name: p.split(' ').slice(0, 2).join(' '), volume: allRecords.filter(r => r.painter === p).reduce((s, r) => s + r.qty, 0) }))
  const statusPie = STATUSES.map(s => ({ name: s, value: allRecords.filter(r => r.status === s).length }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="ppr-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Phad Painting Rajasthan' }]} />
      <PageHeader title="Phad Painting Rajasthan Logistics" description="Phad epic narrative scroll painting supply chain with IS 16796 folk scroll grade compliance, natural pigment fidelity QC, canvas roll cloth wrap packaging, and GI Phad Painting Mark certification across 8 heritage artisan clusters in Bhilwara, Shahpura, and Chittorgarh districts of Rajasthan" />
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
            <KpiTile label="Active Ware" value={PRODUCTS.length} />
            <KpiTile label="Painter Clusters" value={PAINTERS.length} />
            <KpiTile label="Avg Cost" value={`₹${Math.round(allRecords.reduce((s, r) => s + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>
          <div className="grid grid-cols-6 gap-4">
            <HealthRing label="GI Tag" value={96} />
            <HealthRing label="IS 16796" value={92} />
            <HealthRing label="Canvas" value={89} />
            <HealthRing label="Truck" value={85} />
            <HealthRing label="Dust Free" value={91} />
            <HealthRing label="Pigment" value={94} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Artisan Families" value="35+" />
            <ValueTile label="Phad Tradition" value="Since 14th C" />
            <ValueTile label="Export Markets" value="11 Countries" />
            <ValueTile label="Annual Revenue" value="₹5.5 Crore" />
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
            placeholder="Search Phad painting shipments..."
          />
          <div className="rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-violet-100">
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
                  <tr key={record.id} className="border-t hover:bg-violet-50/50">
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
              <CardHeader><CardTitle>Painter Volume</CardTitle></CardHeader>
              <CardContent>
                <BarChart width={500} height={300} data={painterChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="volume" fill={COLORS[0]}>
                    {painterChart.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
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
              <CardHeader><CardTitle>Phad Painting — 700-Year Rajasthani Epic Narrative Scroll Tradition</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Phad painting is one of India's most distinctive and culturally significant narrative scroll art traditions, originating in the Bhilwara district of Rajasthan where the Joshi family of priest-painters has maintained this extraordinary folk art form for over seven centuries, creating elaborate rectangular cloth paintings measuring up to 15 feet in length and 5 feet in width that depict the complete legendary narratives of folk deities and hero-saints including the most revered Phad subjects of Devnarayan, an incarnation of Lord Vishnu worshipped by the Gujjar pastoral community of Rajasthan, and Pabuji Rathod, a fourteenth-century Rajput hero whose legendary deeds of courage, chivalry, and divine intervention have been celebrated through Phad recitation performances across the desert landscapes of Marwar and Mewar regions of Rajasthan for generations. The Phad painting tradition is unique among Indian art forms in that the painted scroll is not merely a decorative artwork but serves as the sacred visual scripture for an elaborate night-long musical recitation ceremony known as Phad Bachi, where the Bhopa priest-singer unfolds the painted scroll in the village courtyard or temple precinct and sings the epic narrative of Devnarayan or Pabuji while his wife the Bhopi accompanies with a lamp illuminating specific sections of the scroll as the narrative progresses through the sequential episodes depicted in the painting, creating an immersive multimedia storytelling experience that combines visual art, devotional music, and oral narrative performance into a unified ceremonial event that has been the primary mode of religious and cultural transmission in the rural communities of southeastern Rajasthan for centuries. The painting technique employs natural mineral pigments including red ochre from the Aravalli ranges for the dominant red tones that characterise Phad compositions, yellow orpiment for golden highlights, green earth pigment from the Jaipur mineral belt for verdant landscape zones, indigo blue from the Gujarat cultivation areas for sky and water elements, and lamp black from burnt mustard oil for the bold black outlines that define the narrative figures and architectural elements, all ground by hand and mixed with gum arabic binder from the kejri tree before being applied using handcrafted squirrel-hair brushes capable of producing the remarkably fine line work that distinguishes the Joshi Phad painting tradition from other Indian folk art styles.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>IS 16796 Folk Scroll Standards & Natural Pigment Fidelity QC</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">The IS 16796 standard for Phad painting establishes India's dedicated quality certification framework for this seven-century Rajasthani narrative scroll art tradition, specifying requirements for natural mineral pigment composition, cotton canvas substrate quality, hand-painted application technique verification, narrative iconographic accuracy, and colour fastness durability that collectively distinguish genuine hand-painted Phad scrolls from screen-printed, digitally printed, and hand-painted imitations produced outside the traditional Joshi family artisan lineage that lack the authentic pigment preparation knowledge, compositional canons, and brush stroke precision that define the genuine Bhilwara Phad painting tradition recognised under the Geographical Indications registry of India as a protected heritage art form originating specifically from the Bhilwara and Shahpura regions of southeastern Rajasthan. The natural pigment composition requirements for IS 16796 Grade A certification mandate exclusively natural mineral pigments sourced from the designated Rajasthan geological zones including red ochre from the Bhilwara-Aravlli laterite formations providing the characteristic warm red that dominates authentic Phad compositions and forms the background colour of all genuine Phad scrolls, yellow orpiment from the Jaipur-Bharatpur mineral belt for golden yellow accent areas in royal court scenes and deity ornamentation zones, indigo blue from the Kutch-Gujarat cultivation areas for sky and water elements that provide the characteristic chromatic contrast against the dominant red ground of the Phad scroll composition, and lamp black produced by burning pure mustard oil in a controlled flame and collecting the carbon soot deposit on a cooled metal surface providing the deep black outlines and shadow areas that define the narrative figures, architectural structures, and decorative border patterns characteristic of the Joshi family Phad painting technique with its distinctive bold black contour lines measuring approximately 1.5 to 2.0 millimetres in width. Natural pigment fidelity verification for Grade A certification mandates spectrophotometric analysis of pigment samples extracted from non-critical border areas of each certified Phad scroll, comparing absorption spectra across the 380 to 780 nanometres visible range against certified natural pigment reference profiles maintained in the IS 16796 standard appendix, with maximum permitted spectral deviation of 6% from reference profiles for red ochre pigments and 4% for indigo blue pigments, ensuring that only genuine naturally prepared mineral pigments meeting the specified geological origin and chemical composition requirements qualify for Grade A certification of Phad painting artworks destined for institutional collection, museum acquisition, and international cultural heritage art market distribution channels.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Canvas Roll Cloth Wrap Packaging for Phad Scroll Paintings</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Canvas roll cloth wrap packaging has been specifically developed for the Phad painting logistics supply chain to protect the large-format hand-painted cotton cloth scrolls that can measure up to 15 feet in length from the numerous physical and environmental hazards encountered during transit from the Bhilwara and Shahpura artisan workshops to domestic temple destinations across Rajasthan, Gujarat, and Maharashtra, and international export destinations including museum textile collections in Europe, North America, and East Asia where the increasing international recognition of Phad painting as one of India's most important intangible cultural heritage art forms has generated growing institutional demand from major museums and cultural organisations seeking to acquire authenticated IS 16796 Grade A certified Phad scrolls for permanent collection and temporary exhibition programmes showcasing the rich diversity of Indian narrative painting traditions. The canvas roll packaging specification employs unbleached cotton duck canvas with minimum grammage of 250 GSM providing a robust protective outer wrapping layer with sufficient tensile strength to withstand the handling stresses encountered during the rolling and unrolling operations required for large-format Phad scroll transportation, with pH range between 6.5 and 7.5 ensuring no acidic chemical interaction with the natural mineral pigments applied to the Phad scroll surface during extended transit periods that may extend to several weeks for sea freight shipments to international destinations. Each Phad scroll undergoes pre-packaging inspection under standardised D65 daylight illumination verifying mineral pigment surface integrity, narrative composition completeness, painted figure and architectural element condition, and overall scroll structural stability including verification of the canvas substrate attachment points and edge binding integrity that maintain the scroll's structural coherence throughout the rolling and transit operations. The inspected Phad scroll is carefully rolled around a custom-dimensioned seasoned hardwood dowel with diameter matched to the scroll width providing gentle curvature support that prevents creasing or folding of the painted cotton cloth surface, then wrapped in the protective cotton duck canvas outer layer with acid-free tissue paper interleaving between the painted surface and the canvas wrap, secured with cotton tying straps at minimum five evenly spaced positions along the roll length, and placed within a custom-built wooden crate constructed from seasoned kiln-dried pine with moisture content not exceeding 12 percent and lined with polyethylene foam cushioning strips along all internal surfaces providing shock absorption protection against the impact and vibration forces encountered during multi-modal transit through road, rail, and air cargo networks from the Rajasthani artisan workshops to domestic and international destination points.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>AI Narrative Compositional Analysis & Phad Heritage Market Development</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Artificial intelligence and computational art analysis technologies are being deployed to authenticate Phad scroll paintings and verify the distinctive hand-painted brush stroke characteristics, natural pigment composition profiles, and narrative compositional structures that distinguish genuine Joshi family Phad scrolls from the growing volume of non-authentic Phad-style paintings produced by artists outside the traditional Bhilwara-Shahpura artisan lineage and by machine-printed reproduction processes that have increasingly attempted to replicate the distinctive visual vocabulary and narrative arrangement of genuine Phad painting for both domestic Rajasthani souvenir markets and international online art retail platforms where the unique aesthetic appeal of Phad scroll compositions featuring bold red grounds, animated narrative figures, and elaborate architectural border patterns has attracted collector interest from buyers unfamiliar with the specific authentication criteria that distinguish genuine heritage Phad paintings from derivative works. The AI verification system for Phad art employs ultra-high-resolution digital scanning at 4800 dots per inch combined with infrared reflectography at near-infrared wavelengths from 750 to 1100 nanometres to capture both the visible surface topography and subsurface pigment layer structure of finished Phad scrolls, analysing the hand-painted brush stroke direction and pressure variation patterns, mineral pigment particle size distribution characteristics visible through high-magnification imaging, and the compositional spatial relationships between narrative figures, architectural elements, decorative border patterns, and ground colour zones against a comprehensive reference database containing authenticated Phad masterworks from the principal Joshi family workshops in Bhilwara, Shahpura, and surrounding districts of southeastern Rajasthan where the approximately 35 remaining active Phad painter families maintain the authentic tradition. Machine learning algorithms trained on this reference dataset can verify Phad painting authenticity with 97.5% accuracy by detecting the characteristic hand-application signatures including the consistent brush stroke width of approximately 1.5 to 2.0 millimetres for contour outlines produced by the traditional Joshi squirrel-hair brush technique, the natural mineral pigment layer structure visible through infrared reflectography that reveals the characteristic two-layer application sequence where underdrawing lines are applied first in lamp black followed by colour fills in mineral pigments producing a distinctive subsurface layer boundary pattern, and the compositional proportion accuracy within the established Phad narrative canons that define the spatial arrangement of the Devnarayan or Pabuji epic episodes across the scroll surface according to the specific visual storytelling sequence transmitted through the Joshi family painting tradition for over seven centuries.</p></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
