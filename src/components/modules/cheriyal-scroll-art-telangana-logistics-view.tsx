import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#9f1239', '#be123c', '#e11d48', '#fb7185', '#fda4af', '#881337', '#4c0519', '#ffe4e6']
const PRODUCTS = ['Cheriyal Coiling Snake Scroll', 'Cheriyal Markandeya Panel', 'Cheriyal Vishnu Dashavatara Scroll', 'Cheriyal Krishna Gopika Panel', 'Cheriyal Shiva Parvathi Scroll', 'Cheriyal Ramayana Episode Panel', 'Cheriyal Hanuman Sundarkand Scroll', 'Cheriyal Village Deity Mask Panel']
const ARTISANS = ['Cheriyal Nakashi Art Guild Telangana', 'Warangal Cheriyal Heritage Society TG', 'Jangaon Nakashi Painters Cluster TG', 'Siddipet Cheriyal Scroll Collective TG', 'Medak Cheriyal Art Cooperative TG', 'Narsapur Cheriyal Traditional Artists TG', 'Karimnagar Nakashi Folk Painters TG', 'Hyderabad Cheriyal Academy TG']
const STATUSES = ['GI Telangana Cheriyal Mark', 'Nakkashi Line Boldness QC', 'Khadi Canvas Stretch Test', 'Tamarind Seed Gum Binder QC', 'Naphthalene Fumigation Pack', 'Cheriyal Narrative Fidelity Audit']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-rose-100 text-rose-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="w-24 h-2 bg-rose-200 rounded-full overflow-hidden"><div className="h-full bg-rose-700 rounded-full" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ label, value, size = 80 }: { label: string; value: number; size?: number }) => {
  const r = (size - 12) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#ffe4e6" strokeWidth="6" />
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
    id: `CHY-${String(offset + i + 1).padStart(4, '0')}`,
    painter: ARTISANS[(offset + i) % ARTISANS.length], ware: PRODUCTS[(offset + i) % PRODUCTS.length],
    status: STATUSES[(offset + i) % STATUSES.length], qty: ri(1, 20, ((offset + i) * 19) % 20) + 1,
    cost: ri(3500, 48000, ((offset + i) * 10111) % 44500) + 3500,
    date: new Date(2024, ((offset + i) % 12), ri(1, 28, (offset + i) % 28)).toISOString().slice(0, 10),
  }))

const cheriyalrecords = [
  { id: 'CHY-0001', painter: 'Cheriyal Nakashi Art Guild Telangana', ware: 'Cheriyal Coiling Snake Scroll', status: 'GI Telangana Cheriyal Mark', qty: 3, cost: 45000, date: '2024-01-15' },
  { id: 'CHY-0002', painter: 'Warangal Cheriyal Heritage Society TG', ware: 'Cheriyal Markandeya Panel', status: 'Nakkashi Line Boldness QC', qty: 5, cost: 32000, date: '2024-01-28' },
  { id: 'CHY-0003', painter: 'Jangaon Nakashi Painters Cluster TG', ware: 'Cheriyal Vishnu Dashavatara Scroll', status: 'Khadi Canvas Stretch Test', qty: 2, cost: 48000, date: '2024-02-10' },
  { id: 'CHY-0004', painter: 'Siddipet Cheriyal Scroll Collective TG', ware: 'Cheriyal Krishna Gopika Panel', status: 'Tamarind Seed Gum Binder QC', qty: 7, cost: 20000, date: '2024-02-22' },
  { id: 'CHY-0005', painter: 'Medak Cheriyal Art Cooperative TG', ware: 'Cheriyal Shiva Parvathi Scroll', status: 'Naphthalene Fumigation Pack', qty: 4, cost: 42000, date: '2024-03-08' },
  { id: 'CHY-0006', painter: 'Narsapur Cheriyal Traditional Artists TG', ware: 'Cheriyal Ramayana Episode Panel', status: 'Cheriyal Narrative Fidelity Audit', qty: 6, cost: 26000, date: '2024-03-20' },
  { id: 'CHY-0007', painter: 'Karimnagar Nakashi Folk Painters TG', ware: 'Cheriyal Hanuman Sundarkand Scroll', status: 'GI Telangana Cheriyal Mark', qty: 2, cost: 48000, date: '2024-04-03' },
  { id: 'CHY-0008', painter: 'Hyderabad Cheriyal Academy TG', ware: 'Cheriyal Village Deity Mask Panel', status: 'Nakkashi Line Boldness QC', qty: 8, cost: 14000, date: '2024-04-16' },
  { id: 'CHY-0009', painter: 'Cheriyal Nakashi Art Guild Telangana', ware: 'Cheriyal Krishna Gopika Panel', status: 'Khadi Canvas Stretch Test', qty: 4, cost: 38000, date: '2024-04-28' },
  { id: 'CHY-0010', painter: 'Warangal Cheriyal Heritage Society TG', ware: 'Cheriyal Coiling Snake Scroll', status: 'Tamarind Seed Gum Binder QC', qty: 3, cost: 44000, date: '2024-05-10' },
  { id: 'CHY-0011', painter: 'Jangaon Nakashi Painters Cluster TG', ware: 'Cheriyal Vishnu Dashavatara Scroll', status: 'Naphthalene Fumigation Pack', qty: 5, cost: 30000, date: '2024-05-23' },
  { id: 'CHY-0012', painter: 'Siddipet Cheriyal Scroll Collective TG', ware: 'Cheriyal Markandeya Panel', status: 'Cheriyal Narrative Fidelity Audit', qty: 6, cost: 18000, date: '2024-06-05' },
  { id: 'CHY-0013', painter: 'Medak Cheriyal Art Cooperative TG', ware: 'Cheriyal Shiva Parvathi Scroll', status: 'GI Telangana Cheriyal Mark', qty: 3, cost: 46000, date: '2024-06-18' },
  { id: 'CHY-0014', painter: 'Narsapur Cheriyal Traditional Artists TG', ware: 'Cheriyal Ramayana Episode Panel', status: 'Nakkashi Line Boldness QC', qty: 7, cost: 22000, date: '2024-07-01' },
  { id: 'CHY-0015', painter: 'Karimnagar Nakashi Folk Painters TG', ware: 'Cheriyal Hanuman Sundarkand Scroll', status: 'Khadi Canvas Stretch Test', qty: 2, cost: 48000, date: '2024-07-14' },
  { id: 'CHY-0016', painter: 'Hyderabad Cheriyal Academy TG', ware: 'Cheriyal Village Deity Mask Panel', status: 'Tamarind Seed Gum Binder QC', qty: 10, cost: 10000, date: '2024-07-26' },
  { id: 'CHY-0017', painter: 'Cheriyal Nakashi Art Guild Telangana', ware: 'Cheriyal Coiling Snake Scroll', status: 'Naphthalene Fumigation Pack', qty: 4, cost: 40000, date: '2024-08-08' },
  { id: 'CHY-0018', painter: 'Warangal Cheriyal Heritage Society TG', ware: 'Cheriyal Markandeya Panel', status: 'Cheriyal Narrative Fidelity Audit', qty: 5, cost: 28000, date: '2024-08-20' },
  { id: 'CHY-0019', painter: 'Jangaon Nakashi Painters Cluster TG', ware: 'Cheriyal Vishnu Dashavatara Scroll', status: 'GI Telangana Cheriyal Mark', qty: 3, cost: 46000, date: '2024-09-02' },
  { id: 'CHY-0020', painter: 'Siddipet Cheriyal Scroll Collective TG', ware: 'Cheriyal Krishna Gopika Panel', status: 'Nakkashi Line Boldness QC', qty: 8, cost: 16000, date: '2024-09-14' },
]

export default function CheriyalScrollArtTelanganaLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})

  const allRecords = [...cheriyalrecords, ...genRecords(21), ...genRecords(41)]

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
    <div className="che-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Cheriyal Scroll Art' }]} />
      <PageHeader title="Cheriyal Scroll Art Telangana Logistics" description="Telangana Cheriyal Nakashi scroll painting supply chain with GI Telangana Cheriyal Mark certification, Nakkashi line boldness quality control, khadi canvas stretch testing, tamarind seed gum binder verification, naphthalene fumigation packaging, and Cheriyal narrative fidelity auditing across 8 Nakashi artisan clusters in Warangal, Jangaon, and Medak" />
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="bg-rose-100">
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
            <HealthRing label="Line" value={88} />
            <HealthRing label="Canvas" value={85} />
            <HealthRing label="Gum" value={83} />
            <HealthRing label="Fumigation" value={90} />
            <HealthRing label="Narrative" value={87} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Nakashi Families" value="12 Active" />
            <ValueTile label="Tradition" value="Since 1500 AD" />
            <ValueTile label="Export Markets" value="5 Countries" />
            <ValueTile label="Annual Revenue" value="₹1.4 Crore" />
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
            placeholder="Search Cheriyal scroll art shipments..."
          />
          <div className="rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-rose-100">
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
                  <tr key={record.id} className="border-t hover:bg-rose-50/50">
                    <td className="p-3 font-mono text-xs">{record.id}</td>
                    <td className="p-3"><ProductBadge name={record.ware} /></td>
                    <td className="p-3">{record.painter}</td>
                    <td className="p-3"><StatusBadge status={record.status} /></td>
                    <td className="p-3">{record.qty} {['scrolls', 'panels', 'frames', 'sets'][parseInt(record.id.slice(4)) % 4]}</td>
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
              <CardHeader><CardTitle>Cheriyal Art — 500-Year Telangana Nakashi Scroll Painting Heritage</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">Cheriyal scroll painting represents one of the most distinctive and visually striking narrative folk art traditions of South India having originated approximately five hundred years ago in the fifteenth century in the village of Cheriyal located in the Warangal district of the newly formed state of Telangana where the Cheriyal Nakashi artisan community developed a unique style of scroll painting that served as the visual storytelling medium for the traditional scroll narrators known as the Shiva Shakti or Picchakunta community who travelled from village to village across the Telugu heartland unrolling their painted narrative scrolls and singing the mythological stories depicted on the painted cloth surface to rural audiences who had limited access to other forms of entertainment and religious instruction where the Cheriyal scrolls are painted on a specially prepared khadi cotton canvas substrate treated with a mixture of white clay locally known as chudi mitti or sieved white earth combined with tamarind seed gum providing a smooth white painting surface that preserves the vibrant mineral pigments applied in the distinctive Cheriyal Nakashi painting style characterised by bold black contour lines of consistent two-millimetre width forming the primary structural outlines of all figures and decorative elements and the extensive use of bright flat colour areas in vermilion red Indian yellow turquoise blue and lampblack with no shading or gradient effects creating the distinctive flat graphic visual quality that distinguishes Cheriyal art from all other Indian folk painting traditions where the Cheriyal scroll narrative content draws exclusively from the Hindu mythological tradition including stories from the Ramayana the Mahabharata the Markandeya Purana the Vishnu Dashavatara legends and local village deity mythology providing a comprehensive pictorial repertoire of over forty distinct narrative episodes that form the core thematic library of the Cheriyal scroll painting tradition where each narrative scroll can extend to thirty feet or more in length containing multiple sequential painted panels depicting the progressive episodes of a single mythological story arranged in a horizontal narrative band that the scroll narrator progressively reveals as the oral storytelling performance unfolds before the village audience creating an immersive multimedia storytelling experience combining visual art oral narration and musical accompaniment that has been practised continuously by the Cheriyal Nakashi artisan families for over five centuries maintaining remarkable stylistic consistency across generations of practitioners who inherit and transmit the complete Cheriyal painting vocabulary from master to apprentice within the hereditary Nakashi artisan community of Cheriyal village.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Nakkashi Line Boldness QC & Khadi Canvas Standards</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The Nakkashi line boldness quality control framework for Cheriyal scroll painting establishes a precise measurement protocol for the characteristic bold contour lines that form the defining visual element of the Cheriyal Nakashi painting style where the traditional Cheriyal line is rendered using a specially prepared lampblack carbon pigment derived from partially burnt sesame oil lamp soot mixed with tamarind seed gum binder to create a smooth-flowing black ink applied using a hand-tied squirrel hair brush known as a kuchi that produces the distinctive bold sweeping contour lines of consistent width that define all figure outlines architectural elements decorative borders and narrative separators in the Cheriyal scroll painting where the line boldness quality control test measures the width of representative contour lines at ten randomly selected positions on each Cheriyal scroll using calibrated digital calipers confirming consistent line width within the acceptable range of one point five to two point five millimetres with maximum permissible variation of zero point five millimetres across the measured positions ensuring the bold consistent line quality that characterises authentic Cheriyal Nakashi painting where deviations beyond the acceptable range indicate inadequate brush preparation inconsistent pigment viscosity or painter fatigue requiring corrective action before the scroll proceeds to the next production stage where the khadi cotton canvas substrate quality control requires handwoven khadi cotton fabric with minimum grammage of one hundred and fifty grams per square metre tested in accordance with IS 1190 handloom cotton fabric specifications confirming sufficient canvas thickness and rigidity to support the heavy white clay ground preparation and the bold pigment applications employed in the Cheriyal scroll painting technique without canvas distortion fibre lift or ground layer cracking during handling rolling and unrolling of the completed scroll where the canvas ground preparation quality test measures the thickness uniformity of the white clay and tamarind seed gum ground layer using a digital micrometer confirming ground layer thickness between zero point eight and one point two millimetres across the entire canvas surface with maximum variation of zero point two millimetres ensuring consistent painting surface quality for the bold line and flat colour applications that define the Cheriyal Nakashi visual style where the canvas moisture content test confirms equilibrium moisture content below eight percent measured in accordance with IS 6339 textile moisture testing methodology preventing subsequent dimensional changes that could cause ground layer cracking or pigment delamination during storage and transit of the completed Cheriyal scroll paintings from the Cheriyal production workshops to institutional buyers and exhibition venues across India and internationally.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Naphthalene Fumigation & Tamarind Seed Gum Binder Testing</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">Naphthalene fumigation packaging with sealed polyethylene sleeve protection and rigid cylindrical container transit has been specifically developed for the Cheriyal scroll painting supply chain to protect the khadi cotton canvas substrates and mineral pigment surfaces from the biological degradation hazards posed by insect infestation fungal colonisation and environmental moisture exposure during transit from the Cheriyal artisan workshops in Warangal district to urban retail galleries museum collections and international exhibition venues where the Cheriyal scroll painting with its cotton canvas substrate and organic tamarind seed gum binder is particularly vulnerable to silverfish insect attack that consumes the starch-based gum binder causing pigment flaking and ground layer detachment and to fungal colonisation by Aspergillus species that proliferates in the warm humid tropical climate of Telangana where ambient humidity frequently exceeds seventy percent during the monsoon season from June through September creating conditions that accelerate biological degradation of the organic materials used in Cheriyal scroll construction where the naphthalene fumigation treatment protocol places crystalline naphthalene fumigant sachets within each sealed polyethylene sleeve at a dosage rate of twenty grams per cubic metre of packaging volume providing sustained vapour-phase insecticide protection throughout the transit period of up to sixty days preventing silverfish beetle and mite infestation of the cotton canvas substrate and tamarind seed gum binder layer where the fumigant sachets are separated from the scroll painting surface by acid-free tissue interleaving preventing direct naphthalene contact with the painted surface that could cause pigment discoloration or binder softening where the sealed polyethylene sleeve provides a moisture barrier maintaining relative humidity below fifty percent within the packaging preventing fungal spore germination and mycelial growth on the cotton canvas substrate during transit through high-humidity zones where the rigid cylindrical container fabricated from spiral-wound kraft paper tube with minimum edge crush resistance of five kilonewtons per metre prevents lateral compression and stacking damage to the rolled Cheriyal scrolls during road transit from the Cheriyal production centre to distribution hubs in Hyderabad and international air cargo terminals ensuring the delicate cotton canvas scrolls maintain their cylindrical roll form without flattening creasing or ground layer cracking that would compromise the visual quality and structural integrity of the completed Cheriyal scroll paintings during the complete transit cycle from artisan workshop to end buyer destination.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Cheriyal Narrative Fidelity Audit & Heritage Market Growth</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The Cheriyal narrative fidelity audit establishes a comprehensive cultural authenticity verification framework for the Cheriyal scroll painting supply chain ensuring that each completed scroll faithfully represents the traditional mythological narrative content and visual iconography conventions that define the Cheriyal Nakashi painting tradition and distinguish authentic Cheriyal scrolls from derivative or commercially simplified reproductions that lack the full depth and complexity of the traditional Cheriyal narrative repertoire where the narrative fidelity audit examines each completed scroll against the master Cheriyal narrative reference library maintained by the Cheriyal Nakashi Art Guild containing photographic documentation and detailed descriptions of over forty canonical Cheriyal narrative episodes including the correct sequential arrangement of story panels the accurate depiction of mythological figures with their correct attributes and iconographic markers the proper inclusion of decorative border motifs and the authentic Cheriyal colour palette conventions that must be maintained for each narrative type where the audit verifies that the painted narrative content corresponds accurately to the declared story episode without omission of essential visual elements or insertion of non-traditional decorative additions that would compromise the cultural authenticity of the Cheriyal scroll where the Cheriyal heritage market development initiative led by the Telangana State Department of Handlooms and Textiles in collaboration with the Cheriyal Nakashi Art Guild and the Salar Jung Museum Hyderabad has established a comprehensive cultural heritage market platform connecting the remaining twelve active Cheriyal Nakashi families with institutional buyers including the National Museum New Delhi the Crafts Museum New Delhi the Salar Jung Museum Hyderabad and international collectors through the GI Telangana Cheriyal Mark that provides cultural provenance and authenticity certification essential for establishing premium market positioning for authentic Cheriyal scrolls in the growing global market for Indian heritage folk art where the extraordinary narrative richness and visual distinctiveness of Cheriyal scroll painting as the only surviving Telugu narrative scroll painting tradition positions authentic Cheriyal scrolls among the most culturally significant Indian folk art products commanding premium pricing from institutional collectors and heritage art museums worldwide.</p></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}



