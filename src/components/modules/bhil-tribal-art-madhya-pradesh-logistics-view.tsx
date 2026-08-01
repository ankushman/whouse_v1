import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#4a1d96', '#5b21b6', '#6d28d9', '#7c3aed', '#8b5cf6', '#2e1065', '#1e0a3e', '#ede9fe']
const PRODUCTS = ['Bhil Dot Deer Hunting Mural', 'Bhil Tribal Tree of Life Panel', 'MP Bhil Peacock Dance Painting', 'Bhil Harvest Festival Canvas', 'Bhil Forest Spirit Wall Art', 'MP Bhil Snake Pattern Mural', 'Bhil Wedding Procession Painting', 'Bhil Sun Moon Cosmic Panel']
const PAINTERS = ['Bhil Jhabua Artisan Guild', 'Dhar Bhil Painting Society', 'Ratlam Tribal Art Centre', 'Alirajpur Bhil Heritage Cooperative', 'Barwani Bhil Craft Colony', 'Khargone Bhil Tribal Studio', 'Khandwa Bhil Art Workshop', 'Burhanpur Bhil Wall Art Society']
const STATUSES = ['GI Bhil Tribal Art Mark', 'IS 16926 Bhil Art Grade A', 'Acid-Free Cardboard Flat Pack', 'Dedicated Truck Transit', 'Dry Storage 18-28C', 'Natural Pigment Adhesion QC']

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
    id: `BTA-${String(offset + i + 1).padStart(4, '0')}`,
    painter: PAINTERS[(offset + i) % PAINTERS.length], ware: PRODUCTS[(offset + i) % PRODUCTS.length],
    status: STATUSES[(offset + i) % STATUSES.length], qty: ri(1, 35, ((offset + i) * 31) % 35) + 1,
    cost: ri(5000, 98000, ((offset + i) * 14173) % 93000) + 5000,
    date: new Date(2024, ((offset + i) % 12), ri(1, 28, (offset + i) % 28)).toISOString().slice(0, 10),
  }))

const bhilRecords = [
  { id: 'BTA-0001', painter: 'Bhil Jhabua Artisan Guild', ware: 'Bhil Dot Deer Hunting Mural', status: 'GI Bhil Tribal Art Mark', qty: 4, cost: 42000, date: '2024-01-10' },
  { id: 'BTA-0002', painter: 'Dhar Bhil Painting Society', ware: 'Bhil Tribal Tree of Life Panel', status: 'IS 16926 Bhil Art Grade A', qty: 6, cost: 38000, date: '2024-01-22' },
  { id: 'BTA-0003', painter: 'Ratlam Tribal Art Centre', ware: 'MP Bhil Peacock Dance Painting', status: 'Acid-Free Cardboard Flat Pack', qty: 3, cost: 55000, date: '2024-02-05' },
  { id: 'BTA-0004', painter: 'Alirajpur Bhil Heritage Cooperative', ware: 'Bhil Harvest Festival Canvas', status: 'Dedicated Truck Transit', qty: 8, cost: 32000, date: '2024-02-18' },
  { id: 'BTA-0005', painter: 'Barwani Bhil Craft Colony', ware: 'Bhil Forest Spirit Wall Art', status: 'Dry Storage 18-28C', qty: 5, cost: 47000, date: '2024-03-02' },
  { id: 'BTA-0006', painter: 'Khargone Bhil Tribal Studio', ware: 'MP Bhil Snake Pattern Mural', status: 'Natural Pigment Adhesion QC', qty: 7, cost: 29000, date: '2024-03-15' },
  { id: 'BTA-0007', painter: 'Khandwa Bhil Art Workshop', ware: 'Bhil Wedding Procession Painting', status: 'GI Bhil Tribal Art Mark', qty: 4, cost: 61000, date: '2024-03-28' },
  { id: 'BTA-0008', painter: 'Burhanpur Bhil Wall Art Society', ware: 'Bhil Sun Moon Cosmic Panel', status: 'IS 16926 Bhil Art Grade A', qty: 9, cost: 25000, date: '2024-04-10' },
  { id: 'BTA-0009', painter: 'Bhil Jhabua Artisan Guild', ware: 'Bhil Tribal Tree of Life Panel', status: 'Acid-Free Cardboard Flat Pack', qty: 6, cost: 44000, date: '2024-04-22' },
  { id: 'BTA-0010', painter: 'Dhar Bhil Painting Society', ware: 'Bhil Dot Deer Hunting Mural', status: 'Dedicated Truck Transit', qty: 3, cost: 58000, date: '2024-05-05' },
  { id: 'BTA-0011', painter: 'Ratlam Tribal Art Centre', ware: 'MP Bhil Peacock Dance Painting', status: 'Dry Storage 18-28C', qty: 7, cost: 35000, date: '2024-05-18' },
  { id: 'BTA-0012', painter: 'Alirajpur Bhil Heritage Cooperative', ware: 'Bhil Harvest Festival Canvas', status: 'Natural Pigment Adhesion QC', qty: 5, cost: 49000, date: '2024-05-30' },
  { id: 'BTA-0013', painter: 'Barwani Bhil Craft Colony', ware: 'Bhil Forest Spirit Wall Art', status: 'GI Bhil Tribal Art Mark', qty: 8, cost: 28000, date: '2024-06-12' },
  { id: 'BTA-0014', painter: 'Khargone Bhil Tribal Studio', ware: 'MP Bhil Snake Pattern Mural', status: 'IS 16926 Bhil Art Grade A', qty: 4, cost: 52000, date: '2024-06-24' },
  { id: 'BTA-0015', painter: 'Khandwa Bhil Art Workshop', ware: 'Bhil Wedding Procession Painting', status: 'Acid-Free Cardboard Flat Pack', qty: 10, cost: 22000, date: '2024-07-06' },
  { id: 'BTA-0016', painter: 'Burhanpur Bhil Wall Art Society', ware: 'Bhil Sun Moon Cosmic Panel', status: 'Dedicated Truck Transit', qty: 6, cost: 41000, date: '2024-07-18' },
  { id: 'BTA-0017', painter: 'Bhil Jhabua Artisan Guild', ware: 'Bhil Forest Spirit Wall Art', status: 'Dry Storage 18-28C', qty: 3, cost: 63000, date: '2024-07-30' },
  { id: 'BTA-0018', painter: 'Dhar Bhil Painting Society', ware: 'Bhil Dot Deer Hunting Mural', status: 'Natural Pigment Adhesion QC', qty: 7, cost: 37000, date: '2024-08-10' },
  { id: 'BTA-0019', painter: 'Ratlam Tribal Art Centre', ware: 'Bhil Tribal Tree of Life Panel', status: 'GI Bhil Tribal Art Mark', qty: 5, cost: 46000, date: '2024-08-22' },
  { id: 'BTA-0020', painter: 'Alirajpur Bhil Heritage Cooperative', ware: 'MP Bhil Peacock Dance Painting', status: 'IS 16926 Bhil Art Grade A', qty: 8, cost: 33000, date: '2024-09-03' },
]

export default function BhilTribalArtMadhyaPradeshLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = [...bhilRecords, ...genRecords(21), ...genRecords(41)]

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
    <div className="bta-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Bhil Tribal Art Madhya Pradesh' }]} />
      <PageHeader title="Bhil Tribal Art Madhya Pradesh Logistics" description="Bhil tribal dot painting supply chain with IS 16926 Bhil art compliance, natural pigment adhesion QC, acid-free cardboard flat pack packaging, and GI Bhil Tribal Art Mark certification across 8 heritage artisan clusters in Jhabua, Dhar, and Alirajpur districts" />
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
            <HealthRing label="IS 16926" value={91} />
            <HealthRing label="Cardboard" value={88} />
            <HealthRing label="Truck" value={85} />
            <HealthRing label="Dry Store" value={93} />
            <HealthRing label="Pigment" value={90} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Artisan Families" value="250+" />
            <ValueTile label="Bhil Tradition" value="Since Prehistoric" />
            <ValueTile label="Export Markets" value="8 Countries" />
            <ValueTile label="Annual Revenue" value="₹4.5 Crore" />
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
            placeholder="Search Bhil tribal art shipments..."
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
              <CardHeader><CardTitle>Bhil Tribal Art — Prehistoric Dot Painting Tradition of Madhya Pradesh</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Bhil tribal art represents one of the oldest continuous artistic traditions on the Indian subcontinent, with its origins tracing back to prehistoric rock shelter paintings found across the Vindhyachal and Satpura hill ranges of Madhya Pradesh that document the Bhil community's deep ancestral connection to the forests, rivers, and wildlife of central India over thousands of years. The Bhil people, who are among the largest indigenous tribal communities in India with a population exceeding four million concentrated in the Jhabua, Alirajpur, Dhar, Ratlam, and Barwani districts of western Madhya Pradesh, developed a distinctive painting style characterised by the use of multicoloured dots arranged in dense patterns to fill outlined figures of animals, human forms, trees, and celestial objects creating vibrant compositions that reflect the tribe's animistic worldview and intimate relationship with the natural environment. Each dot in a Bhil painting carries ritual significance, representing the life force energy that the Bhil community believes permeates all living things and natural phenomena, with the act of painting itself considered a form of spiritual communion with the forest deities and ancestral spirits who protect the tribe and ensure the fertility of crops, health of livestock, and harmony of the seasonal cycles that govern the agricultural calendar of the Bhil community. The painting technique employs natural earth pigments sourced from the local Madhya Pradesh terrain including red ochre from laterite deposits for warm red and orange tones, yellow ochre from weathered sandstone formations for golden yellow areas, white clay kaolin for bright white highlights, and charcoal black from burnt wood for dark outlines and shadow areas, all mixed with natural gum binders extracted from the mahua tree that grows abundantly throughout the Bhil tribal heartland and provides both the binding medium for pigments and an important food source for the community during seasonal food scarcity periods. The Bhil painting tradition remained largely unknown outside central India until the 1980s when government tribal welfare initiatives and cultural preservation programmes brought the art form to national and international attention, leading to its recognition under the Geographical Indications registry as a protected heritage art form originating from the specific tribal communities of western Madhya Pradesh.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>IS 16926 Bhil Art Standards & Natural Pigment Adhesion QC</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">The IS 16926 standard for Bhil tribal art establishes India's first comprehensive quality certification framework specifically designed for this ancient indigenous painting tradition from the Vindhya-Satpura region of Madhya Pradesh, specifying rigorous requirements for authentic natural earth pigment composition, traditional dot application technique verification, substrate quality standards, and pigment adhesion durability testing that collectively distinguish genuine Bhil tribal paintings from factory-produced reproductions and machine-printed imitations that have increasingly appeared in commercial art markets both within India and in international online retail platforms targeting collectors of indigenous and tribal art worldwide. The standard mandates pigment composition requirements for Grade A certification including exclusively natural earth-derived mineral and vegetable pigments sourced from the Madhya Pradesh tribal belt, with mandatory spectrophotometric verification confirming natural origin and excluding any synthetic pigment formulations including azo dyes, phthalocyanine blues and greens, and petroleum-derived organic pigments that produce characteristically different spectral absorption profiles detectable through laboratory X-ray diffraction analysis comparing sample pigment crystalline structures against certified natural earth pigment reference standards maintained in the IS 16926 standard appendix. Pigment adhesion testing for IS 16926 Grade A certification mandates cross-hatch adhesion testing per ASTM D3359 Method B with minimum adhesion rating of 4B on the 0-5B classification scale, ensuring that the natural earth pigments bond securely to both traditional mud-and-cow-dung wall surfaces used in authentic village-level Bhil painting and the commercial canvas and paper substrates used for market-oriented production, with additional requirement for accelerated ageing resistance testing through 500 hours of xenon arc exposure per ASTM G155 with maximum permitted pigment fading measured through CIELAB colour difference Delta E values not exceeding 5.0 units confirming that the natural earth pigments retain their original colour intensity and chromatic saturation under prolonged UV exposure conditions simulating decades of display in well-lit gallery environments and domestic interiors where Bhil paintings are typically displayed by collectors and cultural institutions.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Acid-Free Cardboard Flat Pack Packaging for Bhil Paintings</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Acid-free cardboard flat pack packaging has been specifically developed for the Bhil tribal art logistics supply chain to protect the delicate natural earth pigment surfaces and densely layered dot patterns that characterise authentic Bhil paintings from the physical and environmental hazards encountered during transit from the remote tribal artisan workshops in Jhabua, Alirajpur, and Dhar districts of Madhya Pradesh to domestic art galleries in Mumbai, Delhi, and Bangalore and international export destinations across Europe, North America, and East Asia that require reliable packaging solutions capable of safeguarding these culturally significant artworks through multi-modal transportation involving road transport from village workshops to district collection centres, rail cargo from Indore and Ratlam junctions to major metropolitan distribution hubs, and air freight from Mumbai and Delhi international cargo terminals to overseas destinations. The packaging specification requires acid-free corrugated cardboard with pH range 7.5 to 8.5 measured per TAPPI T529 ensuring no acidic migration that could cause natural earth pigment degradation during extended storage or transit periods, with minimum grammage of 350 GSM double-wall corrugated board providing adequate compression strength to withstand stacking loads of up to 80 kilograms without panel deformation that could cause pigment flaking or dot pattern displacement on the painted surface. Each Bhil painting undergoes pre-packaging inspection under standardised D65 daylight illumination to verify pigment surface integrity, dot pattern completeness, and overall compositional condition before being interleaved with acid-free glassine tissue paper providing a smooth friction-free protective layer between the painted surface and the cardboard packaging material, then secured within a custom-sized flat pack envelope constructed from the acid-free corrugated board with multi-point cushioning using polyethylene foam corner protectors at all four corners and additional foam padding strips along all four edges preventing any direct contact between the cardboard surfaces and the painted artwork during the entire transit journey from the Madhya Pradesh tribal heartland to the final destination gallery or collector premises.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>AI Geometric Pattern Verification & Bhil Heritage Market Development</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Artificial intelligence and computer vision technologies are being progressively deployed to authenticate Bhil tribal paintings and verify the distinctive geometric dot patterns, natural earth pigment compositions, and compositional elements that distinguish genuine Bhil tribal art from mass-produced reproductions and digitally printed imitations that have increasingly attempted to capitalise on the growing national and international market demand for indigenous Indian tribal art in both commercial gallery retail channels and online e-commerce platforms serving collectors worldwide. The AI authentication system for Bhil art employs ultra-high-resolution digital scanning at 4800 dots per inch to capture the complete surface topography of finished paintings, analysing the geometric dot distribution patterns, dot size variation characteristics, inter-dot spacing regularity, and overall compositional geometry against a comprehensive reference database containing over 5000 authenticated Bhil paintings from all major production centres across the Jhabua, Alirajpur, Dhar, Ratlam, and Barwani districts of western Madhya Pradesh, with the machine learning algorithms trained to recognise the subtle signature characteristics that authentic Bhil tribal painters introduce through hand-application of individual dots that create unique fingerprint-like patterns impossible to replicate through mechanical printing or stamping processes. The Madhya Pradesh Tribal Welfare Department has initiated pilot deployment of this AI verification system at six government-run tribal art emporiums in Bhopal, Indore, Ujjain, and Jabalpur, reporting initial results showing authentication accuracy rates exceeding 96% with corresponding reduction in non-authentic artwork incidents from an estimated 14% before implementation to under 3% in the first six months of operation, enabling the Bhil tribal artisan community to access broader market channels with verified authenticity certification that commands premium pricing from both domestic heritage art collectors and international museum curators seeking genuine indigenous Indian tribal art for their permanent collections and temporary exhibition programmes.</p></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
