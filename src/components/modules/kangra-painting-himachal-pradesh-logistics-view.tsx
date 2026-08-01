import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#0c4a6e', '#075985', '#0369a1', '#0284c7', '#0ea5e9', '#082f49', '#0a1628', '#e0f2fe']
const PRODUCTS = ['Kangra Valley Landscape Panel', 'Kangra Pahari Devotional Painting', 'HP Kangra Radha Krishna Canvas', 'Kangra Basohli Floral Miniature', 'Kangra Pahari Court Scene Panel', 'HP Kangra Shiva Parvati Painting', 'Kangra Guler School Portrait', 'Kangra Spring Season Landscape']
const PAINTERS = ['Kangra Pahari Art Heritage Guild', 'Dharamshala Kangra Painters Society', 'Nurpur Pahari Art Cooperative', 'Kangra Town Heritage Centre', 'Palampur Kangra Valley Artists', 'Nadaun Kangra Painting Studio', 'Hamirpur Pahari Craft Colony', 'Baijnath Kangra Devotional Society']
const STATUSES = ['GI Kangra Painting Mark', 'IS 16925 Pahari Art Grade A', 'Hardboard Case with Foam Liner', 'Temperature-Controlled Van Transit', 'Humidity-Free Vault 18-25C', 'Natural Pigment Fidelity QC']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-sky-100 text-sky-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="w-24 h-2 bg-sky-200 rounded-full overflow-hidden"><div className="h-full bg-sky-700 rounded-full" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ label, value, size = 80 }: { label: string; value: number; size?: number }) => {
  const r = (size - 12) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e0f2fe" strokeWidth="6" />
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
    id: `KPH-${String(offset + i + 1).padStart(4, '0')}`,
    painter: PAINTERS[(offset + i) % PAINTERS.length], ware: PRODUCTS[(offset + i) % PRODUCTS.length],
    status: STATUSES[(offset + i) % STATUSES.length], qty: ri(1, 35, ((offset + i) * 31) % 35) + 1,
    cost: ri(5000, 98000, ((offset + i) * 14173) % 93000) + 5000,
    date: new Date(2024, ((offset + i) % 12), ri(1, 28, (offset + i) % 28)).toISOString().slice(0, 10),
  }))

const kangraRecords = [
  { id: 'KPH-0001', painter: 'Kangra Pahari Art Heritage Guild', ware: 'Kangra Valley Landscape Panel', status: 'GI Kangra Painting Mark', qty: 3, cost: 92000, date: '2024-01-15' },
  { id: 'KPH-0002', painter: 'Dharamshala Kangra Painters Society', ware: 'Kangra Pahari Devotional Painting', status: 'IS 16925 Pahari Art Grade A', qty: 5, cost: 78000, date: '2024-01-28' },
  { id: 'KPH-0003', painter: 'Nurpur Pahari Art Cooperative', ware: 'HP Kangra Radha Krishna Canvas', status: 'Hardboard Case with Foam Liner', qty: 7, cost: 55000, date: '2024-02-10' },
  { id: 'KPH-0004', painter: 'Kangra Town Heritage Centre', ware: 'Kangra Basohli Floral Miniature', status: 'Temperature-Controlled Van Transit', qty: 4, cost: 85000, date: '2024-02-22' },
  { id: 'KPH-0005', painter: 'Palampur Kangra Valley Artists', ware: 'Kangra Pahari Court Scene Panel', status: 'Humidity-Free Vault 18-25C', qty: 6, cost: 62000, date: '2024-03-05' },
  { id: 'KPH-0006', painter: 'Nadaun Kangra Painting Studio', ware: 'HP Kangra Shiva Parvati Painting', status: 'Natural Pigment Fidelity QC', qty: 8, cost: 48000, date: '2024-03-18' },
  { id: 'KPH-0007', painter: 'Hamirpur Pahari Craft Colony', ware: 'Kangra Guler School Portrait', status: 'GI Kangra Painting Mark', qty: 2, cost: 95000, date: '2024-03-30' },
  { id: 'KPH-0008', painter: 'Baijnath Kangra Devotional Society', ware: 'Kangra Spring Season Landscape', status: 'IS 16925 Pahari Art Grade A', qty: 10, cost: 35000, date: '2024-04-12' },
  { id: 'KPH-0009', painter: 'Kangra Pahari Art Heritage Guild', ware: 'Kangra Pahari Devotional Painting', status: 'Hardboard Case with Foam Liner', qty: 5, cost: 72000, date: '2024-04-24' },
  { id: 'KPH-0010', painter: 'Dharamshala Kangra Painters Society', ware: 'Kangra Valley Landscape Panel', status: 'Temperature-Controlled Van Transit', qty: 4, cost: 88000, date: '2024-05-06' },
  { id: 'KPH-0011', painter: 'Nurpur Pahari Art Cooperative', ware: 'HP Kangra Radha Krishna Canvas', status: 'Humidity-Free Vault 18-25C', qty: 7, cost: 52000, date: '2024-05-18' },
  { id: 'KPH-0012', painter: 'Kangra Town Heritage Centre', ware: 'Kangra Basohli Floral Miniature', status: 'Natural Pigment Fidelity QC', qty: 6, cost: 68000, date: '2024-05-30' },
  { id: 'KPH-0013', painter: 'Palampur Kangra Valley Artists', ware: 'Kangra Pahari Court Scene Panel', status: 'GI Kangra Painting Mark', qty: 9, cost: 42000, date: '2024-06-12' },
  { id: 'KPH-0014', painter: 'Nadaun Kangra Painting Studio', ware: 'HP Kangra Shiva Parvati Painting', status: 'IS 16925 Pahari Art Grade A', qty: 3, cost: 90000, date: '2024-06-24' },
  { id: 'KPH-0015', painter: 'Hamirpur Pahari Craft Colony', ware: 'Kangra Guler School Portrait', status: 'Hardboard Case with Foam Liner', qty: 12, cost: 28000, date: '2024-07-06' },
  { id: 'KPH-0016', painter: 'Baijnath Kangra Devotional Society', ware: 'Kangra Spring Season Landscape', status: 'Temperature-Controlled Van Transit', qty: 5, cost: 75000, date: '2024-07-18' },
  { id: 'KPH-0017', painter: 'Kangra Pahari Art Heritage Guild', ware: 'Kangra Guler School Portrait', status: 'Humidity-Free Vault 18-25C', qty: 8, cost: 55000, date: '2024-07-30' },
  { id: 'KPH-0018', painter: 'Dharamshala Kangra Painters Society', ware: 'Kangra Valley Landscape Panel', status: 'Natural Pigment Fidelity QC', qty: 4, cost: 82000, date: '2024-08-10' },
  { id: 'KPH-0019', painter: 'Nurpur Pahari Art Cooperative', ware: 'HP Kangra Radha Krishna Canvas', status: 'GI Kangra Painting Mark', qty: 6, cost: 65000, date: '2024-08-22' },
  { id: 'KPH-0020', painter: 'Kangra Town Heritage Centre', ware: 'Kangra Pahari Devotional Painting', status: 'IS 16925 Pahari Art Grade A', qty: 7, cost: 58000, date: '2024-09-03' },
]

export default function KangraPaintingHimachalPradeshLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = [...kangraRecords, ...genRecords(21), ...genRecords(41)]

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
    <div className="kph-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Kangra Painting Himachal Pradesh' }]} />
      <PageHeader title="Kangra Painting Himachal Pradesh Logistics" description="Kangra Pahari painting supply chain with IS 16925 Pahari art compliance, natural pigment fidelity QC, hardboard case foam liner packaging, and GI Kangra Painting Mark certification across 8 heritage artisan clusters in Kangra, Dharamshala, and Hamirpur districts" />
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="bg-sky-100">
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
            <HealthRing label="GI Tag" value={97} />
            <HealthRing label="IS 16925" value={93} />
            <HealthRing label="Foam" value={90} />
            <HealthRing label="Van" value={86} />
            <HealthRing label="Vault" value={92} />
            <HealthRing label="Pigment" value={95} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Artisan Families" value="400+" />
            <ValueTile label="Pahari Tradition" value="Since 18th C" />
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
            placeholder="Search Kangra Pahari painting shipments..."
          />
          <div className="rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-sky-100">
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
                  <tr key={record.id} className="border-t hover:bg-sky-50/50">
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
              <CardHeader><CardTitle>Kangra Pahari Painting — 300-Year Himalayan Court Art Tradition</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Kangra Pahari painting is one of India's most refined and aesthetically celebrated classical painting traditions, originating in the Kangra valley of the Himachal Pradesh Himalayas during the mid-eighteenth century under the patronage of the Katoch Rajput rulers who established a magnificent court painting atelier at the Kangra Fort that attracted master artists from the declining Mughal imperial workshops at Delhi and Lahore, creating an extraordinary synthesis of Mughal miniature painting technique with the indigenous Pahari artistic sensibility of the Himalayan hill kingdoms that produced paintings of unparalleled lyrical beauty, naturalism, and emotional depth that are widely regarded as the pinnacle of Indian miniature painting art. The Kangra painting tradition emerged following the 1755 earthquake that devastated the Mughal painting workshops of the Punjab plains, driving master painters trained in the Mughal atelier tradition to seek patronage in the Himalayan hill kingdoms where successive Rajput rulers of Kangra, Guler, Nurpur, Basohli, Chamba, and Mandi established competing court painting workshops that each developed distinctive regional variations within the broader Pahari painting idiom that characterises the artistic output of the western Himalayan region. The Kangra school itself, centred on the Kangra Fort workshop and later the courts of Sansar Chand Katoch who ruled Kangra from 1775 to 1823 and is considered the greatest patron of Kangra painting, achieved its highest artistic expression through a distinctive visual vocabulary combining extraordinarily delicate line work, naturalistic landscape rendering featuring the Kangra valley's distinctive snow-capped Dhauladhar mountain range, lush green pine forests, and meandering Beas River, with devotional themes drawn from Krishna bhakti poetry particularly the Gita Govinda of Jayadeva and the works of Surdas, Kabir, and other Bhakti saint-poets whose devotional verses provided the narrative content for the Kangra school's most celebrated painting series depicting the romantic and spiritual relationship between Krishna and Radha with a tenderness and emotional intimacy unmatched in Indian painting tradition. The painting technique employs natural mineral pigments including locally sourced Kangra earth pigments, gold leaf for decorative areas, and vegetable-derived colours ground by hand and mixed with gum arabic binder, applied on handmade Sanganer paper with handcrafted squirrel-hair brushes capable of producing lines of extraordinary fineness measuring less than 0.2 millimetres in width. Today approximately 400 artisan families across eight heritage clusters in Kangra, Dharamshala, Hamirpur, and surrounding districts sustain this irreplaceable Himalayan court art tradition, generating an estimated 12 crore rupees annually through domestic heritage art collectors, government emporiums, temple commissions, and growing international demand from museum curators and private collectors worldwide.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>IS 16925 Pahari Art Standards & Natural Pigment Fidelity QC</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">The IS 16925 standard for Kangra Pahari painting establishes India's first dedicated quality certification framework for this distinguished Himalayan court painting tradition, specifying requirements for authentic natural mineral and vegetable pigment preparation, traditional hand-ground pigment quality, Sanganer paper substrate specifications, and brush stroke precision that collectively distinguish genuine Kangra Pahari paintings from mass-produced reproductions and machine-printed imitations that have increasingly appeared in both domestic Indian art markets and international online retail platforms. The standard mandates pigment quality requirements for Grade A certification: exclusively natural mineral and vegetable-derived pigments with minimum lightfastness ratings of 5 on the ASTM D4303 scale, including mandatory use of Kangra earth red from the Dhauladhar foothills for warm red areas, neel pani indigo for blue sections, harital orpiment for yellow zones, genuine 22-carat gold leaf for gilded areas verified through X-ray fluorescence spectroscopy, and locally sourced green earth pigment extracted from the Kangra valley's mineral-rich terrain for the distinctive landscape green tones that characterise authentic Kangra school painting and cannot be chemically replicated by synthetic pigment formulations. Substrate requirements for IS 16925 Grade A certification mandate handmade Sanganer paper with minimum grammage of 200 GSM, surface roughness not exceeding 3 microns Ra, and pH range between 6.5 and 7.0, providing the ideal smooth ivory-toned surface for the ultra-fine squirrel-hair brush strokes that define the Kangra Pahari painting technique, with additional requirement for hand-burnishing with agate stone to achieve the characteristic smooth surface finish that allows pigment to adhere with exceptional bond strength. Natural pigment fidelity verification for Grade A certification mandates spectrophotometric analysis of pigment colours across the visible spectrum 380 to 780 nanometres wavelength range, comparing each painted area against certified natural pigment reference profiles maintained in the IS 16925 standard appendix, with maximum permissible spectral deviation of 5% from reference profiles ensuring the painted colours fall within the natural pigment range and cannot be replicated by synthetic pigments that produce characteristically different spectral signatures detectable through laboratory analysis.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Hardboard Case Foam Liner Packaging for Kangra Paintings</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Hardboard case packaging with foam liner cushioning has been specifically engineered for Kangra Pahari paintings to protect the extraordinarily delicate natural pigment surfaces, ultra-fine squirrel-hair brush stroke details, gold leaf gilded areas, and handmade Sanganer paper substrate from the numerous physical and environmental hazards encountered during transit from the Himalayan Kangra valley artisan workshops to domestic art galleries across India and international export destinations that require specialised packaging solutions capable of protecting these fragile heritage art objects through the challenging journey from the mountainous Himachal Pradesh terrain to low-altitude cargo terminals and overseas shipping routes with their dramatic temperature and humidity variations. Each Kangra painting undergoes meticulous preparation before packaging: first inspected under standardised daylight D65 illumination to verify pigment surface integrity, gold leaf adhesion, and line work precision across the complete painted surface, with any areas of pigment lifting, surface cracking, or gold leaf detachment documented and stabilised using conservation-grade gelatin size solution before proceeding to packaging. The inspected painting is interleaved with acid-free glassine tissue paper protecting the painted surface from any friction contact during handling, then placed in a custom-cut high-density polyethylene foam liner block precisely moulded to the painting dimensions providing 360-degree cushioning with minimum 15-millimetre foam clearance above the painted surface preventing any pressure contact with delicate pigment layers during stacking and transit operations. The foam-lined painting is secured within a custom-built hardboard case constructed from 5-millimetre high-density fibreboard with tongue-and-groove corner joints eliminating nail penetration vibration risk, with internal foam padding lining all four interior surfaces creating a protective envelope that maintains the painting flat and undisturbed throughout multi-modal transit from the Himalayan workshops through road transport to Pathankot and Chandigarh cargo terminals, then rail or air cargo to international export destinations.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>AI Brush Stroke Verification & Kangra Heritage Market Development</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Artificial intelligence and advanced imaging technologies are now being deployed to authenticate Kangra Pahari paintings and verify the extraordinary brush stroke precision and natural pigment quality that distinguish genuine Kangra heritage art from printed reproductions and mechanically produced imitations that have increasingly attempted to replicate the distinctive visual elegance and lyrical beauty of Kangra painting in both domestic Indian art retail and international online marketplaces. The AI authentication system employs ultra-high-resolution digital scanning at 6,400 dots per inch to capture the complete surface topography of finished Kangra paintings, analysing every brush stroke contour, pigment layer boundary, gold leaf application edge, and compositional alignment against a comprehensive reference database containing over 8,000 authenticated Kangra Pahari paintings from all major sub-schools and heritage cluster production centres across the Kangra valley and surrounding Himalayan districts. Machine learning algorithms trained on this extensive dataset can verify Kangra painting authenticity with 98.8% accuracy by detecting subtle signatures invisible to human visual inspection, including the characteristic micro-variation in line width that distinguishes hand-applied squirrel-hair brush strokes from the mechanically uniform lines produced by digital printing processes, the natural mineral pigment particle distribution patterns visible through infrared reflectography that differ fundamentally from synthetic pigment spectral profiles, and the compositional proportion accuracy within the established Kangra school canons that reflect the specific aesthetic training and artistic tradition of authentic Kangra Pahari painters. The Himachal Pradesh Department of Art and Culture has integrated this AI verification system into its export certification pipeline for Kangra paintings, reducing the rejection rate of non-authentic works at government art emporiums from an estimated 18% to under 2% since implementation while accelerating the certification timeline from 15 working days to under 60 hours for qualifying pieces, enabling the Kangra painting artisan community to expand international market access and maintain competitive positioning against lower-cost reproductions from overseas manufacturing sources that cannot replicate the authentic natural mineral pigments, hand-ground preparation techniques, and squirrel-hair brush stroke precision that define genuine Kangra Pahari painting as one of the world's finest miniature painting traditions.</p></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
