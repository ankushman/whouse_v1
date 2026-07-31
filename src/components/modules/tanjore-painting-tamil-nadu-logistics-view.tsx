import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#831843', '#9d174d', '#be185d', '#ec4899', '#f9a8d4', '#701a75', '#4a044e', '#fdf2f8']
const PRODUCTS = ['Tanjore Marigold Lakshmi Panel', 'Nataraja Cosmic Dance Painting', 'Tanjore Dasavathara Set', 'Goddess Saraswati Tanjore Board', 'Tanjore Krishna Butter Ball', 'Ganesha Tanjore Gold Relief', 'Tanjore Vishnu Anantashayana', 'Tanjore Kamakshi Devi Panel']
const PAINTERS = ['Tanjore Traditional Art Guild', 'Kumbakonam Heritage Painters', 'Thanjavur Palace Art Society', 'Mannargudi Tanjore Colony', 'Mayavaram Devotional Arts', 'Papanasam Tanjore Workshop', 'Nagapattinam Gold Foil Centre', 'Thiruvarur Temple Painters']
const STATUSES = ['GI Tanjore Painting Mark', 'IS 16913 Tanjore Art Grade A', 'Hardboard Case with Bubble Wrap', 'Air-Conditioned Van Transit', 'Humidity-Free Vault 20-25C', 'Gold Foil Gilding QC']

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
    id: `TPN-${String(offset + i + 1).padStart(4, '0')}`,
    painter: PAINTERS[(offset + i) % PAINTERS.length], ware: PRODUCTS[(offset + i) % PRODUCTS.length],
    status: STATUSES[(offset + i) % STATUSES.length], qty: ri(1, 100, ((offset + i) * 37) % 100) + 1,
    cost: ri(3500, 85000, ((offset + i) * 13097) % 81500) + 3500,
    date: new Date(2024, ((offset + i) % 12), ri(1, 28, (offset + i) % 28)).toISOString().slice(0, 10),
  }))

const tanjoreRecords = [
  { id: 'TPN-0001', painter: 'Tanjore Traditional Art Guild', ware: 'Tanjore Marigold Lakshmi Panel', status: 'GI Tanjore Painting Mark', qty: 8, cost: 35000, date: '2024-01-08' },
  { id: 'TPN-0002', painter: 'Kumbakonam Heritage Painters', ware: 'Nataraja Cosmic Dance Painting', status: 'IS 16913 Tanjore Art Grade A', qty: 5, cost: 52000, date: '2024-01-20' },
  { id: 'TPN-0003', painter: 'Thanjavur Palace Art Society', ware: 'Tanjore Dasavathara Set', status: 'Hardboard Case with Bubble Wrap', qty: 3, cost: 78000, date: '2024-02-05' },
  { id: 'TPN-0004', painter: 'Mannargudi Tanjore Colony', ware: 'Goddess Saraswati Tanjore Board', status: 'Air-Conditioned Van Transit', qty: 12, cost: 28000, date: '2024-02-18' },
  { id: 'TPN-0005', painter: 'Mayavaram Devotional Arts', ware: 'Tanjore Krishna Butter Ball', status: 'Humidity-Free Vault 20-25C', qty: 15, cost: 18000, date: '2024-03-02' },
  { id: 'TPN-0006', painter: 'Papanasam Tanjore Workshop', ware: 'Ganesha Tanjore Gold Relief', qty: 20, cost: 12000, date: '2024-03-15', status: 'Gold Foil Gilding QC' },
  { id: 'TPN-0007', painter: 'Nagapattinam Gold Foil Centre', ware: 'Tanjore Vishnu Anantashayana', status: 'GI Tanjore Painting Mark', qty: 4, cost: 65000, date: '2024-03-28' },
  { id: 'TPN-0008', painter: 'Thiruvarur Temple Painters', ware: 'Tanjore Kamakshi Devi Panel', status: 'IS 16913 Tanjore Art Grade A', qty: 10, cost: 32000, date: '2024-04-10' },
  { id: 'TPN-0009', painter: 'Tanjore Traditional Art Guild', ware: 'Nataraja Cosmic Dance Painting', status: 'Hardboard Case with Bubble Wrap', qty: 6, cost: 48000, date: '2024-04-22' },
  { id: 'TPN-0010', painter: 'Kumbakonam Heritage Painters', ware: 'Tanjore Marigold Lakshmi Panel', status: 'Air-Conditioned Van Transit', qty: 9, cost: 38000, date: '2024-05-05' },
  { id: 'TPN-0011', painter: 'Thanjavur Palace Art Society', ware: 'Ganesha Tanjore Gold Relief', status: 'Humidity-Free Vault 20-25C', qty: 18, cost: 15000, date: '2024-05-18' },
  { id: 'TPN-0012', painter: 'Mannargudi Tanjore Colony', ware: 'Tanjore Dasavathara Set', status: 'Gold Foil Gilding QC', qty: 2, cost: 82000, date: '2024-06-01' },
  { id: 'TPN-0013', painter: 'Mayavaram Devotional Arts', ware: 'Goddess Saraswati Tanjore Board', status: 'GI Tanjore Painting Mark', qty: 11, cost: 26000, date: '2024-06-14' },
  { id: 'TPN-0014', painter: 'Papanasam Tanjore Workshop', ware: 'Tanjore Krishna Butter Ball', status: 'IS 16913 Tanjore Art Grade A', qty: 14, cost: 20000, date: '2024-06-28' },
  { id: 'TPN-0015', painter: 'Nagapattinam Gold Foil Centre', ware: 'Tanjore Vishnu Anantashayana', status: 'Hardboard Case with Bubble Wrap', qty: 3, cost: 72000, date: '2024-07-08' },
  { id: 'TPN-0016', painter: 'Thiruvarur Temple Painters', ware: 'Tanjore Kamakshi Devi Panel', status: 'Air-Conditioned Van Transit', qty: 7, cost: 34000, date: '2024-07-18' },
  { id: 'TPN-0017', painter: 'Tanjore Traditional Art Guild', ware: 'Tanjore Dasavathara Set', status: 'Humidity-Free Vault 20-25C', qty: 2, cost: 85000, date: '2024-07-25' },
  { id: 'TPN-0018', painter: 'Kumbakonam Heritage Painters', ware: 'Tanjore Vishnu Anantashayana', status: 'Gold Foil Gilding QC', qty: 4, cost: 68000, date: '2024-08-02' },
  { id: 'TPN-0019', painter: 'Thanjavur Palace Art Society', ware: 'Tanjore Krishna Butter Ball', status: 'GI Tanjore Painting Mark', qty: 16, cost: 16000, date: '2024-08-12' },
  { id: 'TPN-0020', painter: 'Mannargudi Tanjore Colony', ware: 'Tanjore Kamakshi Devi Panel', status: 'IS 16913 Tanjore Art Grade A', qty: 8, cost: 30000, date: '2024-08-22' },
]

export default function TanjorePaintingTamilNaduLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = [...tanjoreRecords, ...genRecords(21), ...genRecords(41)]

  const filteredRecords = useMemo(() => {
    if (!searchQuery && Object.keys(activeFilters).every(k => !activeFilters[k].length)) return allRecords
    const sq = searchQuery.toLowerCase()
    return allRecords.filter(r => { if (sq && !r.id.toLowerCase().includes(sq) && !r.ware.toLowerCase().includes(sq)) return false; return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string)); })
  }, [searchQuery, activeFilters, allRecords])

  const filterGroups = [
    { key: 'ware', label: 'Ware', options: PRODUCTS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.ware === p).length })) },
    { key: 'painter', label: 'Painter', options: PAINTERS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.painter === p).length })) },
  ]

  const trendData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m, i) => ({ month: m, shipments: ri(8, 45, allRecords.length * 0.25 + i * 6) }))
  const painterChart = PAINTERS.map(p => ({ name: p.split(' ').slice(0, 2).join(' '), volume: allRecords.filter(r => r.painter === p).reduce((s, r) => s + r.qty, 0) }))
  const statusPie = STATUSES.map(s => ({ name: s, value: allRecords.filter(r => r.status === s).length }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="tpn-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Tanjore Painting Tamil Nadu' }]} />
      <PageHeader title="Tanjore Painting Tamil Nadu Logistics" description="Tamil Nadu Tanjore classical painting supply chain with IS 16913 Tanjore art compliance, 22K gold foil gilding QC, hardboard case packaging, and GI Tanjore Painting Mark certification across 8 heritage artisan clusters in Thanjavur district" />
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
            <KpiTile label="Painter Clusters" value={PAINTERS.length} />
            <KpiTile label="Avg Cost" value={`₹${Math.round(allRecords.reduce((s, r) => s + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>
          <div className="grid grid-cols-6 gap-4">
            <HealthRing label="GI Tag" value={95} />
            <HealthRing label="IS 16913" value={91} />
            <HealthRing label="Box" value={87} />
            <HealthRing label="Van" value={84} />
            <HealthRing label="Vault" value={93} />
            <HealthRing label="Gilding" value={96} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Artisan Families" value="2,200+" />
            <ValueTile label="Thanjavur District" value="Since 1600s" />
            <ValueTile label="Export Markets" value="22 Countries" />
            <ValueTile label="Annual Revenue" value="₹25 Crore" />
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
            placeholder="Search Tanjore painting shipments..."
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
              <CardHeader><CardTitle>Tanjore Painting — 400-Year Maratha Court Art of Thanjavur</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Tanjore painting is a celebrated classical South Indian art form originating from Thanjavur district in Tamil Nadu, with its origins tracing back to the early seventeenth century during the reign of the Maratha Nayak kings who patronised this distinctive style of devotional panel painting that blends Chola dynasty temple art traditions with Maratha decorative sensibilities. The art form flourished under the patronage of Serfoji II Bhonsle, the learned Maratha ruler of Thanjavur in the late eighteenth and early nineteenth centuries, who established a formal painting atelier within the Thanjavur palace complex where master artists developed and codified the techniques that define authentic Tanjore painting to this day. The hallmark of Tanjore painting is the lavish use of 22-carat gold foil embossed over a specially prepared chalk-and-gesso relief surface, creating a three-dimensional effect where gods, goddesses, and celestial figures appear to emerge from the painting board with remarkable luminous depth and opulent radiance that is immediately recognisable as authentic Tanjore work. The traditional painting process begins with a jackwood or teak plywood board coated with multiple layers of cloth pasted with tamarind seed paste, followed by application of a smooth limestone chalk-and-gesso mixture onto which the artist sketches the deity composition and builds up relief areas using a special gum-based gesso compound mixed with Arabic gum and finely ground limestone powder. Gold foil sheets are then meticulously cut and applied over the raised gesso areas, followed by painting of flat colour areas using vibrant natural and semi-natural pigments, creating a stunning contrast between the gleaming three-dimensional gold elements and the rich flat colour backgrounds that characterise the Tanjore style. Today approximately 2,200 artisan families across eight heritage clusters in and around Thanjavur sustain this tradition, generating an estimated 25 crore rupees annually through domestic temple commissions, government emporium sales, and international demand from Indian diaspora communities and heritage art collectors worldwide.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>IS 16913 Tanjore Art Quality Standards & Gold Foil Certification</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">The IS 16913 standard for Tanjore paintings establishes India's first dedicated quality certification framework for this classical South Indian panel painting tradition, ensuring authenticity and consumer protection across the Tanjore painting supply chain from raw material sourcing through finished artwork delivery to collectors and temples. The standard specifies rigorous requirements for the painting substrate, mandating jackwood or teak plywood board with minimum thickness of 6 millimetres for standard sizes up to 60 centimetres and 12 millimetres for larger works, ensuring structural stability through the multi-layer cloth-and-gesso preparation process that adds significant weight and dimensional stress to the board. Gold foil quality requirements for IS 16913 Grade A certification mandate genuine 22-carat gold leaf with minimum purity of 91.6% and thickness of 0.1 microns, verified through X-ray fluorescence spectroscopy at NABL-accredited laboratories, distinguishing authentic hand-embossed Tanjore gold work from cheaper electroplated or imitation foil applications found in non-certified commercial reproductions. Gesso relief quality requires the chalk-and-gum compound to maintain minimum relief height of 1.5 millimetres above the board surface for principal deity figures and 0.8 millimetres for decorative border elements, ensuring the characteristic three-dimensional depth that distinguishes premium Tanjore paintings from flat decorative imitations. Adhesion testing mandates the gold foil maintain 96% surface coverage after 180 cycles of standard abrasion testing using the Taber Abraser with CS-10 wheels, simulating decades of gentle handling, temple ritual worship, and periodic cleaning that devotional Tanjore paintings experience throughout their functional lifetime in domestic prayer rooms and temple sanctums.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Hardboard Case with Bubble Wrap for Tanjore Painting Transit</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Hardboard case packaging with multi-layer bubble wrap protection has been specifically engineered for Tanjore paintings to safeguard the delicate gold foil embossing, raised gesso relief surfaces, painted colour areas, and wooden board substrate from the numerous physical and environmental hazards encountered during transit from Thanjavur district artisan workshops to domestic temples, government emporiums, gallery showrooms, and international export destinations. Each individual Tanjore painting undergoes a meticulous multi-stage wrapping protocol: first a layer of acid-free tissue paper to prevent any chemical interaction between the painting surface and packaging materials, followed by a generous wrapping of 10-millimetre bubble wrap with the bubbles facing outward to prevent imprint marks on the painted surface, then secured with low-tack masking tape that leaves no adhesive residue upon removal. The bubble-wrapped painting is placed inside a custom-made hardboard case constructed from 4-millimetre high-density hardboard panels joined with metal corner brackets, with additional foam padding blocks at all four corners and a full-layer foam sheet on both the front and back faces providing comprehensive cushioning against impact shocks from drops, vibration during road and rail transit, and stacking pressure from other cargo in shared container shipments. Silica gel desiccant packets rated for 50 gram absorption capacity are placed inside every case to maintain relative humidity below 40% during transit, as the natural gesso compound used in Tanjore painting is hygroscopic and can absorb atmospheric moisture during the Tamil Nadu monsoon season from October through December, potentially causing gesso softening and gold foil detachment if humidity conditions exceed acceptable thresholds during extended transit periods. This hardboard packaging system has been validated to ISTA 3A transit simulation protocols and demonstrates capability to withstand drops from 90 centimetres without any damage to gold foil or gesso relief elements, reducing the historical transit damage rate for Tanjore paintings from 10% to under 1.5% since its adoption across the certified Tanjore art supply chain.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>AI Gold Foil Authentication & Tanjore Art Market Expansion</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Artificial intelligence and high-resolution imaging technologies are revolutionising quality assurance and authentication for the Tanjore painting craft, where the intricate gold foil relief work and gesso preparation that define the highest quality pieces have traditionally demanded decades of master artisan expertise to evaluate and grade with consistency. The AI authentication system employs structured light three-dimensional scanning to create precise surface topography maps of each Tanjore painting, measuring gold foil relief uniformity across the painted surface with sub-micron accuracy and detecting defects such as air pockets beneath the foil, uneven gesso curing, or foil lifting at relief edges that indicate either substandard craftsmanship or improper storage conditions during the production process. Computer vision algorithms trained on a database of over 25,000 authenticated Tanjore painting compositions can verify artistic authenticity by comparing deity figure proportions, background colour palette consistency, gold foil relief patterns, and overall compositional balance against reference works from certified master artisans of each heritage cluster, providing objective quality grading that supplements the traditional subjective assessment by senior craft evaluators. The Tamil Nadu Handicrafts Development Corporation has integrated this AI verification into its procurement and export certification pipeline, reducing quality rejection rates at government Lakshmi Mittal emporiums from 14% to under 3% while accelerating the certification timeline from an average of 8 working days to under 36 hours for qualifying Tanjore painting shipments. India's GI protection for Tanjore painting combined with the digital authentication infrastructure has expanded export opportunities significantly, with luxury art dealers in the United States, United Kingdom, Singapore, and the United Arab Emirates now demanding verifiable digital provenance certificates with each Tanjore painting purchase, driving premium pricing and greater market confidence in this 400-year South Indian classical art tradition.</p></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
