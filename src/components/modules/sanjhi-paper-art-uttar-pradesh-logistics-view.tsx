import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#831843', '#9d174d', '#be185d', '#db2777', '#ec4899', '#500724', '#3b0728', '#fdf2f8']
const PRODUCTS = ['Sanjhi Radha Krishna Stencil Panel', 'UP Sanjhi Peacock Design Screen', 'Sanjhi Lotus Floral Wall Panel', 'Mathura Sanjhi Tree of Life Cutout', 'Sanjhi Bride Groom Wedding Panel', 'UP Sanjhi Gopini Dance Screen', 'Sanjhi Cow Calf Pastoral Scene', 'Vrindavan Sanjhi Krishna Leela Panel']
const ARTISANS = ['Mathura Sanjhi Artisan Guild', 'Vrindavan Paper Cutting Society', 'Agra Sanjhi Heritage Cooperative', 'Govardhan Sanjhi Craft Centre', 'Barsana Sanjhi Workshop', 'Nandgaon Radhavallabh Studio', 'Gokul Sanjhi Art Colony', 'Fatehpur Sanjhi Stencil Society']
const STATUSES = ['GI Sanjhi Art Mark', 'IS 16928 Sanjhi Art Grade A', 'Acid-Free Matboard Flat Pack', 'Enclosed Truck Transit', 'Dry Storage 15-25C', 'Paper Pulp Adhesion QC']

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
    id: `SPA-${String(offset + i + 1).padStart(4, '0')}`,
    painter: ARTISANS[(offset + i) % ARTISANS.length], ware: PRODUCTS[(offset + i) % PRODUCTS.length],
    status: STATUSES[(offset + i) % STATUSES.length], qty: ri(1, 35, ((offset + i) * 31) % 35) + 1,
    cost: ri(5000, 98000, ((offset + i) * 14173) % 93000) + 5000,
    date: new Date(2024, ((offset + i) % 12), ri(1, 28, (offset + i) % 28)).toISOString().slice(0, 10),
  }))

const sanjhiRecords = [
  { id: 'SPA-0001', painter: 'Mathura Sanjhi Artisan Guild', ware: 'Sanjhi Radha Krishna Stencil Panel', status: 'GI Sanjhi Art Mark', qty: 4, cost: 38000, date: '2024-01-08' },
  { id: 'SPA-0002', painter: 'Vrindavan Paper Cutting Society', ware: 'UP Sanjhi Peacock Design Screen', status: 'IS 16928 Sanjhi Art Grade A', qty: 6, cost: 32000, date: '2024-01-20' },
  { id: 'SPA-0003', painter: 'Agra Sanjhi Heritage Cooperative', ware: 'Sanjhi Lotus Floral Wall Panel', status: 'Acid-Free Matboard Flat Pack', qty: 3, cost: 45000, date: '2024-02-03' },
  { id: 'SPA-0004', painter: 'Govardhan Sanjhi Craft Centre', ware: 'Mathura Sanjhi Tree of Life Cutout', status: 'Enclosed Truck Transit', qty: 7, cost: 28000, date: '2024-02-15' },
  { id: 'SPA-0005', painter: 'Barsana Sanjhi Workshop', ware: 'Sanjhi Bride Groom Wedding Panel', status: 'Dry Storage 15-25C', qty: 5, cost: 52000, date: '2024-02-28' },
  { id: 'SPA-0006', painter: 'Nandgaon Radhavallabh Studio', ware: 'UP Sanjhi Gopini Dance Screen', status: 'Paper Pulp Adhesion QC', qty: 8, cost: 24000, date: '2024-03-12' },
  { id: 'SPA-0007', painter: 'Gokul Sanjhi Art Colony', ware: 'Sanjhi Cow Calf Pastoral Scene', status: 'GI Sanjhi Art Mark', qty: 4, cost: 58000, date: '2024-03-25' },
  { id: 'SPA-0008', painter: 'Fatehpur Sanjhi Stencil Society', ware: 'Vrindavan Sanjhi Krishna Leela Panel', status: 'IS 16928 Sanjhi Art Grade A', qty: 9, cost: 22000, date: '2024-04-07' },
  { id: 'SPA-0009', painter: 'Mathura Sanjhi Artisan Guild', ware: 'UP Sanjhi Peacock Design Screen', status: 'Acid-Free Matboard Flat Pack', qty: 5, cost: 42000, date: '2024-04-20' },
  { id: 'SPA-0010', painter: 'Vrindavan Paper Cutting Society', ware: 'Sanjhi Radha Krishna Stencil Panel', status: 'Enclosed Truck Transit', qty: 3, cost: 55000, date: '2024-05-02' },
  { id: 'SPA-0011', painter: 'Agra Sanjhi Heritage Cooperative', ware: 'Sanjhi Lotus Floral Wall Panel', status: 'Dry Storage 15-25C', qty: 7, cost: 30000, date: '2024-05-15' },
  { id: 'SPA-0012', painter: 'Govardhan Sanjhi Craft Centre', ware: 'Mathura Sanjhi Tree of Life Cutout', status: 'Paper Pulp Adhesion QC', qty: 6, cost: 36000, date: '2024-05-28' },
  { id: 'SPA-0013', painter: 'Barsana Sanjhi Workshop', ware: 'Sanjhi Bride Groom Wedding Panel', status: 'GI Sanjhi Art Mark', qty: 4, cost: 48000, date: '2024-06-10' },
  { id: 'SPA-0014', painter: 'Nandgaon Radhavallabh Studio', ware: 'UP Sanjhi Gopini Dance Screen', status: 'IS 16928 Sanjhi Art Grade A', qty: 8, cost: 26000, date: '2024-06-23' },
  { id: 'SPA-0015', painter: 'Gokul Sanjhi Art Colony', ware: 'Sanjhi Cow Calf Pastoral Scene', status: 'Acid-Free Matboard Flat Pack', qty: 10, cost: 20000, date: '2024-07-06' },
  { id: 'SPA-0016', painter: 'Fatehpur Sanjhi Stencil Society', ware: 'Vrindavan Sanjhi Krishna Leela Panel', status: 'Enclosed Truck Transit', qty: 5, cost: 40000, date: '2024-07-18' },
  { id: 'SPA-0017', painter: 'Mathura Sanjhi Artisan Guild', ware: 'Sanjhi Lotus Floral Wall Panel', status: 'Dry Storage 15-25C', qty: 3, cost: 54000, date: '2024-07-30' },
  { id: 'SPA-0018', painter: 'Vrindavan Paper Cutting Society', ware: 'Sanjhi Radha Krishna Stencil Panel', status: 'Paper Pulp Adhesion QC', qty: 7, cost: 34000, date: '2024-08-10' },
  { id: 'SPA-0019', painter: 'Agra Sanjhi Heritage Cooperative', ware: 'UP Sanjhi Peacock Design Screen', status: 'GI Sanjhi Art Mark', qty: 6, cost: 44000, date: '2024-08-22' },
  { id: 'SPA-0020', painter: 'Govardhan Sanjhi Craft Centre', ware: 'Mathura Sanjhi Tree of Life Cutout', status: 'IS 16928 Sanjhi Art Grade A', qty: 4, cost: 50000, date: '2024-09-03' },
]

export default function SanjhiPaperArtUttarPradeshLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = [...sanjhiRecords, ...genRecords(21), ...genRecords(41)]

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
    <div className="spa-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Sanjhi Paper Art Uttar Pradesh' }]} />
      <PageHeader title="Sanjhi Paper Art Uttar Pradesh Logistics" description="Sanjhi stencil paper cutting supply chain with IS 16928 Sanjhi art compliance, paper pulp adhesion QC, acid-free matboard flat pack packaging, and GI Sanjhi Art Mark certification across 8 heritage artisan clusters in Mathura, Vrindavan, and Agra districts of Braj region" />
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
            <HealthRing label="GI Tag" value={94} />
            <HealthRing label="IS 16928" value={89} />
            <HealthRing label="Matboard" value={86} />
            <HealthRing label="Truck" value={83} />
            <HealthRing label="Dry Store" value={90} />
            <HealthRing label="Pulp QC" value={88} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Artisan Families" value="120+" />
            <ValueTile label="Sanjhi Tradition" value="Since 16th C" />
            <ValueTile label="Export Markets" value="6 Countries" />
            <ValueTile label="Annual Revenue" value="₹2.8 Crore" />
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
              <CardHeader><CardTitle>Sanjhi Paper Art — 500-Year Braj Region Devotional Stencil Tradition</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Sanjhi is a highly refined and visually exquisite devotional paper stencil art tradition originating in the Braj region of Uttar Pradesh, specifically centred on the holy cities of Mathura and Vrindavan where the art form has been practised for over five centuries by dedicated communities of Brahmin priests and artisan families who create intricate paper-cut compositions depicting the sacred legends of Krishna and Radha for use in religious ceremonies, temple decorations, and devotional rituals performed during major festivals including Holi, Janmashtami, and Radhashtami that celebrate the divine love stories central to the Vaishnava Hindu religious tradition of the Braj region. The Sanjhi technique involves the meticulous cutting of multiple layers of handmade paper using specially sharpened fine-point scissors and surgical-precision blades to create elaborate stencil patterns of extraordinary delicacy and complexity, with the most accomplished Sanjhi artisans capable of cutting designs featuring hundreds of individual perforations and intricate lacework patterns within a single composition that can take several weeks to complete for large-scale temple installations. The compositional themes of Sanjhi art are drawn exclusively from the Krishna bhakti tradition including scenes from the Bhagavata Purana depicting Krishna's childhood miracles in Gokul, the romantic leela pastimes with the gopinis of Vrindavan, the divine union of Radha and Krishna under the kadamba trees of the Yamuna riverbanks, and the grand ras lila dance festival where Krishna multiplies himself to dance with each gopini simultaneously under the moonlit skies of the Braj autumn season. The colour palette of Sanjhi art traditionally emphasises vibrant pink, magenta, orange, gold, and green reflecting the festive colours of Braj devotional celebrations, with each colour carrying symbolic significance within the Vaishnava iconographic tradition: pink representing divine love, gold representing spiritual enlightenment, green representing the lush Braj forests, and orange representing the sacred fire of devotional worship that illuminates the temple during evening aarti ceremonies.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>IS 16928 Sanjhi Art Standards & Paper Pulp Adhesion QC</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">The IS 16928 standard for Sanjhi paper art establishes India's first dedicated quality certification framework for this endangered Braj region devotional stencil craft, specifying comprehensive requirements for handmade paper substrate quality, cutting precision standards, perforation pattern accuracy, colour application technique, and structural integrity testing that collectively distinguish genuine hand-cut Sanjhi artworks from laser-cut imitations and machine-produced stencil reproductions that have increasingly appeared in both domestic Indian temple supply markets and international online retail platforms catering to the global Hindu diaspora community seeking authentic Braj devotional art for home shrine decoration and temple worship purposes. The handmade paper substrate requirements for IS 16928 Grade A certification mandate traditional tullah handmade paper produced from cotton rag pulp with minimum grammage of 180 GSM, surface smoothness not exceeding 2.5 microns Ra allowing precise blade cutting without fibre tearing, pH range between 6.5 and 7.5 ensuring long-term archival stability preventing acid degradation of the delicate paper surfaces, and tensile strength in both machine and cross-machine directions exceeding 3.5 kilonewtons per metre confirming the paper can withstand the substantial cutting pressure required for intricate Sanjhi stencil patterns without structural failure during the cutting process. Paper pulp adhesion testing for Grade A certification employs the Cobb water absorption test per ISO 535 with maximum water absorption of 25 grams per square metre within 60 seconds confirming the paper surface sealing treatment prevents moisture penetration during transit and storage in the humid tropical conditions of the Braj region, with additional requirement for edge tear resistance exceeding 120 millinewtons measured per TAPPI T414 ensuring that the intricate cut edges of Sanjhi stencils resist tearing and fibre separation during the handling, packaging, and transportation operations that form an essential part of the Sanjhi art logistics supply chain from the Mathura-Vrindavan artisan workshops to domestic temple destinations and international export markets.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Acid-Free Matboard Flat Pack Packaging for Sanjhi Paper Art</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Acid-free matboard flat pack packaging has been specifically engineered for the Sanjhi paper art logistics supply chain to protect the extraordinarily delicate handmade paper surfaces, intricate stencil perforations, fine blade-cut edges, and layered paper compositions that characterise authentic Sanjhi artworks from the physical and environmental hazards encountered during transit from the Braj region artisan workshops in Mathura and Vrindavan to domestic temple installations across Uttar Pradesh, Rajasthan, and Maharashtra, and international export destinations serving Hindu temple communities and cultural institutions in North America, Europe, and Southeast Asia where demand for authentic Braj devotional art has grown substantially over the past decade driven by the expanding global Hindu diaspora and increasing international interest in India's intangible cultural heritage art forms. Each Sanjhi artwork undergoes meticulous pre-packaging inspection under standardised D65 daylight illumination verifying paper surface integrity, stencil perforation completeness, cutting precision along all design contours, and overall structural stability before being interleaved with acid-free glassine tissue paper protecting both front and rear surfaces of the delicate paper composition, then positioned between two custom-cut acid-free conservation-grade matboard panels with pH buffer capacity of 7.5 to 8.5 providing an alkaline reserve that actively neutralises any acidic environmental contaminants that could cause paper degradation during extended transit periods. The matboard-sandwiched Sanjhi artwork is secured within a rigid flat pack envelope constructed from 4-millimetre acid-free corrugated fibreboard with reinforced corner protectors and edge cushioning strips of polyethylene foam, maintaining the complete assembly flat and immobilised throughout multi-modal transit operations including road transport from the Vrindavan workshops through the congested Agra-Delhi freight corridor to air cargo terminals at Indira Gandhi International Airport for international shipments and domestic courier distribution networks for temple deliveries within India's major metropolitan centres.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>AI Stencil Pattern Verification & Sanjhi Heritage Market Development</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Artificial intelligence and high-resolution imaging technologies are being developed to authenticate Sanjhi paper artworks and verify the extraordinary cutting precision, perforation pattern consistency, and hand-crafted quality characteristics that distinguish genuine hand-cut Sanjhi stencils from the growing volume of laser-cut and die-cut imitations that have appeared in both domestic Indian temple art markets and international online platforms serving the Hindu devotional art collector community worldwide. The AI authentication system for Sanjhi art employs ultra-high-resolution flatbed scanning at 6400 dots per inch optical resolution to capture the complete surface topography of finished Sanjhi artworks, analysing every cut edge contour, perforation shape and size distribution, blade stroke direction characteristics, and paper fibre separation patterns against a comprehensive reference database containing authenticated Sanjhi masterworks from all major artisan families and workshop traditions across the Mathura, Vrindavan, Govardhan, and Barsana production centres of the Braj region. Machine learning algorithms trained on this reference dataset can verify Sanjhi authenticity with over 95% accuracy by detecting subtle hand-cutting signatures including the characteristic micro-serration patterns along cut edges produced by fine-point scissors that differ fundamentally from the clean thermal-cut edges of laser imitations, the slight dimensional variation in perforation sizes that reflect the human hand-eye coordination involved in manual paper cutting, and the natural paper fibre separation patterns visible under high magnification that differ between hand-cut and machine-cut stencil perforations in ways undetectable to the unaided human eye but clearly distinguishable through computational image analysis. The Uttar Pradesh Handicrafts Development Department has initiated pilot programmes integrating this AI verification technology at government emporiums in Lucknow and Agra, with plans to extend deployment to Mathura and Vrindavan heritage craft centres to support the approximately 120 remaining Sanjhi artisan families in maintaining market access and premium positioning for their irreplaceable devotional art tradition in both domestic temple supply chains and international cultural heritage art markets.</p></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
