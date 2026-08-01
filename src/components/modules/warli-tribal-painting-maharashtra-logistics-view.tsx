import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#7c2d12', '#92400e', '#b45309', '#d97706', '#f59e0b', '#78350f', '#451a03', '#fef3c7']
const PRODUCTS = ['Warli Harvest Festival Mural', 'Warli Tarpa Dance Painting', 'Maharashtra Warli Tree of Life', 'Warli Wedding Ceremony Panel', 'Warli Hunting Scene Canvas', 'Warli Fishing Community Mural', 'Warli Farming Cycle Painting', 'Warli Cosmic Spiral Canvas']
const PAINTERS = ['Adivasi Warli Artisan Guild', 'Dahanu Tribal Painters Society', 'Talasari Warli Heritage Centre', 'Jawhar Adivasi Art Cooperative', 'Palghar Warli Painting Colony', 'Mokhada Tribal Art Society', 'Wada Warli Craft Studio', 'Vikramgad Warli Artists Guild']
const STATUSES = ['GI Warli Painting Mark', 'IS 16922 Warli Art Grade A', 'Rigid Cardboard Flat Pack', 'Enclosed Truck Transit', 'Dry Storage 18-30C', 'Rice Paste Adhesion QC']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-amber-100 text-amber-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="w-24 h-2 bg-amber-200 rounded-full overflow-hidden"><div className="h-full bg-amber-700 rounded-full" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ label, value, size = 80 }: { label: string; value: number; size?: number }) => {
  const r = (size - 12) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#fef3c7" strokeWidth="6" />
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
    id: `WTP-${String(offset + i + 1).padStart(4, '0')}`,
    painter: PAINTERS[(offset + i) % PAINTERS.length], ware: PRODUCTS[(offset + i) % PRODUCTS.length],
    status: STATUSES[(offset + i) % STATUSES.length], qty: ri(1, 45, ((offset + i) * 47) % 45) + 1,
    cost: ri(2000, 55000, ((offset + i) * 9871) % 53000) + 2000,
    date: new Date(2024, ((offset + i) % 12), ri(1, 28, (offset + i) % 28)).toISOString().slice(0, 10),
  }))

const warliRecords = [
  { id: 'WTP-0001', painter: 'Adivasi Warli Artisan Guild', ware: 'Warli Harvest Festival Mural', status: 'GI Warli Painting Mark', qty: 5, cost: 48000, date: '2024-01-08' },
  { id: 'WTP-0002', painter: 'Dahanu Tribal Painters Society', ware: 'Warli Tarpa Dance Painting', status: 'IS 16922 Warli Art Grade A', qty: 10, cost: 25000, date: '2024-01-20' },
  { id: 'WTP-0003', painter: 'Talasari Warli Heritage Centre', ware: 'Maharashtra Warli Tree of Life', status: 'Rigid Cardboard Flat Pack', qty: 8, cost: 35000, date: '2024-02-03' },
  { id: 'WTP-0004', painter: 'Jawhar Adivasi Art Cooperative', ware: 'Warli Wedding Ceremony Panel', status: 'Enclosed Truck Transit', qty: 4, cost: 52000, date: '2024-02-15' },
  { id: 'WTP-0005', painter: 'Palghar Warli Painting Colony', ware: 'Warli Hunting Scene Canvas', status: 'Dry Storage 18-30C', qty: 12, cost: 18000, date: '2024-02-28' },
  { id: 'WTP-0006', painter: 'Mokhada Tribal Art Society', ware: 'Warli Fishing Community Mural', status: 'Rice Paste Adhesion QC', qty: 6, cost: 42000, date: '2024-03-12' },
  { id: 'WTP-0007', painter: 'Wada Warli Craft Studio', ware: 'Warli Farming Cycle Painting', status: 'GI Warli Painting Mark', qty: 3, cost: 55000, date: '2024-03-25' },
  { id: 'WTP-0008', painter: 'Vikramgad Warli Artists Guild', ware: 'Warli Cosmic Spiral Canvas', status: 'IS 16922 Warli Art Grade A', qty: 15, cost: 15000, date: '2024-04-08' },
  { id: 'WTP-0009', painter: 'Adivasi Warli Artisan Guild', ware: 'Warli Tarpa Dance Painting', status: 'Rigid Cardboard Flat Pack', qty: 7, cost: 38000, date: '2024-04-20' },
  { id: 'WTP-0010', painter: 'Dahanu Tribal Painters Society', ware: 'Warli Harvest Festival Mural', status: 'Enclosed Truck Transit', qty: 9, cost: 32000, date: '2024-05-02' },
  { id: 'WTP-0011', painter: 'Talasari Warli Heritage Centre', ware: 'Warli Wedding Ceremony Panel', status: 'Dry Storage 18-30C', qty: 11, cost: 22000, date: '2024-05-15' },
  { id: 'WTP-0012', painter: 'Jawhar Adivasi Art Cooperative', ware: 'Maharashtra Warli Tree of Life', status: 'Rice Paste Adhesion QC', qty: 6, cost: 45000, date: '2024-05-28' },
  { id: 'WTP-0013', painter: 'Palghar Warli Painting Colony', ware: 'Warli Hunting Scene Canvas', status: 'GI Warli Painting Mark', qty: 14, cost: 16000, date: '2024-06-10' },
  { id: 'WTP-0014', painter: 'Mokhada Tribal Art Society', ware: 'Warli Fishing Community Mural', status: 'IS 16922 Warli Art Grade A', qty: 8, cost: 36000, date: '2024-06-22' },
  { id: 'WTP-0015', painter: 'Wada Warli Craft Studio', ware: 'Warli Cosmic Spiral Canvas', status: 'Rigid Cardboard Flat Pack', qty: 18, cost: 12000, date: '2024-07-05' },
  { id: 'WTP-0016', painter: 'Vikramgad Warli Artists Guild', ware: 'Warli Farming Cycle Painting', status: 'Enclosed Truck Transit', qty: 5, cost: 50000, date: '2024-07-18' },
  { id: 'WTP-0017', painter: 'Adivasi Warli Artisan Guild', ware: 'Warli Wedding Ceremony Panel', status: 'Dry Storage 18-30C', qty: 10, cost: 28000, date: '2024-07-30' },
  { id: 'WTP-0018', painter: 'Dahanu Tribal Painters Society', ware: 'Maharashtra Warli Tree of Life', status: 'Rice Paste Adhesion QC', qty: 4, cost: 52000, date: '2024-08-12' },
  { id: 'WTP-0019', painter: 'Talasari Warli Heritage Centre', ware: 'Warli Harvest Festival Mural', status: 'GI Warli Painting Mark', qty: 7, cost: 40000, date: '2024-08-24' },
  { id: 'WTP-0020', painter: 'Jawhar Adivasi Art Cooperative', ware: 'Warli Tarpa Dance Painting', status: 'IS 16922 Warli Art Grade A', qty: 6, cost: 46000, date: '2024-09-05' },
]

export default function WarliTribalPaintingMaharashtraLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = [...warliRecords, ...genRecords(21), ...genRecords(41)]

  const filteredRecords = useMemo(() => {
    if (!searchQuery && Object.keys(activeFilters).every(k => !activeFilters[k].length)) return allRecords
    const sq = searchQuery.toLowerCase()
    return allRecords.filter(r => { if (sq && !r.id.toLowerCase().includes(sq) && !r.ware.toLowerCase().includes(sq)) return false; return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string)); })
  }, [searchQuery, activeFilters, allRecords])

  const filterGroups = [
    { key: 'ware', label: 'Ware', options: PRODUCTS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.ware === p).length })) },
    { key: 'painter', label: 'Painter', options: PAINTERS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.painter === p).length })) },
  ]

  const trendData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m, i) => ({ month: m, shipments: ri(6, 35, allRecords.length * 0.15 + i * 5) }))
  const painterChart = PAINTERS.map(p => ({ name: p.split(' ').slice(0, 2).join(' '), volume: allRecords.filter(r => r.painter === p).reduce((s, r) => s + r.qty, 0) }))
  const statusPie = STATUSES.map(s => ({ name: s, value: allRecords.filter(r => r.status === s).length }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="wtp-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Warli Tribal Painting Maharashtra' }]} />
      <PageHeader title="Warli Tribal Painting Maharashtra Logistics" description="Warli tribal painting supply chain with IS 16922 Warli art compliance, rice paste adhesion QC, rigid cardboard flat pack packaging, and GI Warli Painting Mark certification across 8 Adivasi artisan clusters in Palghar, Dahanu, and Jawhar districts" />
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="bg-amber-100">
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
            <HealthRing label="GI Tag" value={93} />
            <HealthRing label="IS 16922" value={88} />
            <HealthRing label="Cardboard" value={86} />
            <HealthRing label="Truck" value={82} />
            <HealthRing label="Storage" value={90} />
            <HealthRing label="Paste" value={95} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Artisan Families" value="600+" />
            <ValueTile label="Warli Tradition" value="Since 2500 BCE" />
            <ValueTile label="Export Markets" value="22 Countries" />
            <ValueTile label="Annual Revenue" value="₹18 Crore" />
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
            placeholder="Search Warli tribal painting shipments..."
          />
          <div className="rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-amber-100">
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
                  <tr key={record.id} className="border-t hover:bg-amber-50/50">
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
              <CardHeader><CardTitle>Warli Tribal Painting — 4,500-Year Adivasi Wall Art Tradition</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Warli tribal painting is one of the oldest surviving indigenous art traditions on the Indian subcontinent, originating among the Warli and other Adivasi tribal communities inhabiting the Sahyadri Hill Range of the northern Western Ghats in what is now the Palghar district of Maharashtra state, with archaeological evidence confirming continuous artistic practice stretching back approximately 4,500 years to the prehistoric rock art traditions of central India that are among the earliest known examples of human visual expression anywhere in the world. The Warli painting tradition is deeply rooted in the animistic and nature-worshipping spiritual beliefs of the Warli Adivasi people who have inhabited the forested mountain slopes and coastal plains of the Dahanu, Talasari, Jawhar, Mokhada, Wada, and Vikramgad regions of Palghar district for millennia, maintaining a remarkably coherent artistic vocabulary that uses only geometric shapes — circles representing the sun and moon, triangles symbolising mountains and trees, squares denoting sacred enclosures and human dwellings, and simple stick figures depicting the daily activities of farming, hunting, fishing, dancing, and communal celebration that define the cyclical rhythm of traditional Adivasi life in the Western Ghats. The most iconic Warli painting motif is the Tarpa dance scene depicting a spiral formation of tribal dancers circling around a Tarpa musician playing the traditional trumpet-like instrument at the centre of a celebratory gathering, a composition that encapsulates the communal solidarity and joyful collective expression that characterises Warli tribal culture and has become the universally recognised symbol of Warli art in both domestic and international contexts. Traditional Warli paintings are created on the mud-coated walls of tribal homes using only white pigment made from a mixture of rice paste, water, and gum arabic applied with bamboo stick brushes, producing the distinctive stark white-on-earth-brown visual aesthetic that immediately distinguishes authentic Warli art from all other Indian painting traditions. Today approximately 600 Warli Adivasi artisan families across eight heritage clusters in the Palghar district sustain this irreplaceable prehistoric art tradition, with annual revenues reaching an estimated 18 crore rupees driven by growing international demand for authentic tribal art from galleries in Europe, North America, and East Asia who value Warli painting as a living connection to humanity's earliest artistic impulses and indigenous cultural expression.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>IS 16922 Warli Art Standards & Rice Paste Adhesion QC</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">The IS 16922 standard for Warli tribal painting establishes India's first dedicated quality certification framework for this ancient Adivasi art tradition, specifying requirements for authentic material preparation using traditional rice paste white pigment, correct geometric motif execution following the established Warli artistic vocabulary, proper mud-and-cow-dung wall substrate preparation or canvas equivalent, and pigment adhesion durability that collectively distinguish genuine hand-painted Warli art from screen-printed reproductions and mechanically produced imitations that have increasingly flooded both domestic Indian retail markets and international online art sales platforms. The standard mandates the exclusive use of traditional rice paste pigment preparation for Grade A certification: white pigment prepared from soaked and ground short-grain rice mixed with clean water and natural gum arabic binder extracted from Acacia arabica tree bark in the specific ratio of 3 parts rice paste to 1 part water with gum arabic concentration between 5% and 8% by weight, producing the characteristic opaque white pigment with slightly grainy texture that distinguishes authentic hand-applied Warli rice paste from commercially manufactured titanium dioxide white paint used in printed reproductions. Substrate requirements for Grade A Warli certification specify either traditional mud-and-cow-dung prepared wall surfaces following the exact Adivasi method of applying three coats of smoothly trowelled mud mixed with fermented cow dung and rice husk to create the characteristic warm brown painting ground with surface roughness between 5 and 15 microns Ra ideal for rice paste pigment adhesion, or alternatively handmade canvas or cotton fabric prepared with a ground coat matching the traditional mud wall colour tone within the Munsell colour range 5YR 4/4 to 5YR 5/6 providing an equivalent painting surface for portable Warli art pieces intended for gallery exhibition and retail sale rather than permanent wall installation in tribal homes. Rice paste adhesion testing for IS 16922 Grade A certification mandates minimum 95% pigment retention after 200 cycles of standard dry abrasion testing using the rotary platform abrader with CS-10 wheels at 500 gram load, simulating the handling and light brushing contact that Warli paintings experience during packaging, transit, gallery installation, and collector display environments throughout their expected commercial lifecycle spanning multiple decades of use and display.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Rigid Cardboard Flat Pack Packaging for Warli Paintings</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Rigid cardboard flat pack packaging has been specifically developed for Warli tribal paintings to protect the delicate rice paste pigment surfaces, traditional mud ground substrates or prepared canvas equivalents, and fine bamboo stick brush stroke details from physical damage and environmental degradation during transit from the remote Adivasi village workshops in the Palghar district's forested hill regions to domestic art galleries across Maharashtra and India, international export destinations spanning twenty-two countries, and the growing number of museum and institutional collections worldwide that have begun acquiring authenticated Warli tribal art for their ethnographic and indigenous art holdings. Each Warli painting undergoes careful preparation before packaging: first inspected under natural daylight to verify rice paste pigment adhesion integrity and identify any areas of flaking, lifting, or insect damage commonly associated with the organic rice paste binder used in authentic Warli art, then gently cleaned with a soft dry brush to remove any loose rice starch particles or surface dust without disturbing the painted surface, before being interleaved with acid-free glassine paper sheets protecting the delicate white pigment from friction during handling and transit operations. The prepared painting is placed flat in a custom-cut rigid cardboard carrier constructed from 800 GSM double-wall corrugated board with internal dimensions providing minimum 30 millimetres clearance on all four sides and a padded interior surface lined with 5-millimetre polyethylene foam sheet providing gentle cushioning against vibration and impact forces encountered during road transit from the remote Palghar district village workshops through the Western Ghats mountain roads to Mumbai cargo terminals, a journey of approximately 120 to 180 kilometres that typically requires 4 to 6 hours of road transit through winding mountain routes subject to significant vibration and occasional sudden braking forces that can damage unprotected artworks. Moisture protection is achieved through enclosure of the cardboard-packaged painting in a sealed polyethylene bag with included silica gel desiccant packets rated for 60 gram absorption capacity, maintaining relative humidity below 50% during transit which is critical for protecting the organic rice paste pigment binder used in authentic Warli painting that can soften and become vulnerable to fungal growth under high humidity conditions, particularly during the monsoon season from June through September when ambient humidity in the Palghar district and Mumbai transit corridor routinely exceeds 90% for extended periods.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>AI Geometric Pattern Verification & Warli Art Market Development</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Artificial intelligence and computer vision technologies are now being deployed to authenticate Warli tribal paintings and verify the geometric precision and compositional integrity that distinguish genuine hand-painted Adivasi Warli art from the growing volume of screen-printed reproductions and digitally generated imitations that have increasingly infiltrated both domestic Indian craft emporiums and international online art marketplaces, undermining the market positioning and cultural authenticity of genuine Warli art produced by certified Adivasi artisan families in the Palghar district heritage clusters. The AI authentication system employs ultra-high-resolution scanning at 4,800 dots per inch to capture the complete surface topography of finished Warli paintings, analysing the characteristic geometric motif vocabulary including circle, triangle, and square shapes that form the foundational elements of all Warli compositions, plus the distinctive stick figure human forms depicting farming, hunting, fishing, dancing, and ceremonial activities that populate Warli narrative scenes with remarkable expressiveness despite their extreme geometric simplicity. Machine learning algorithms trained on a reference database of over 12,000 authenticated Warli paintings from all eight Palghar district heritage clusters can detect printed reproductions with 98.7% accuracy by identifying subtle material signatures invisible to human visual inspection, including the perfectly uniform line thickness characteristic of screen printing versus the naturally variable stroke width of hand-applied bamboo stick brushes, the smooth gradient transitions of digital printing versus the slightly grainy texture of hand-ground rice paste pigment, and the mathematically perfect geometric repetitions of mechanical reproduction versus the intentionally organic variations in shape and spacing that reflect the hand of individual Adivasi artists whose distinctive personal styles have been recognised and documented across generations of Warli painting tradition. The Maharashtra State Tribal Development Corporation has implemented this AI verification system in its export certification pipeline for Warli paintings, reducing the rejection rate of non-authentic works at government tribal craft emporiums from an estimated 14% to under 2% since deployment while accelerating the certification timeline from 18 working days to under 48 hours for qualifying pieces, enabling the Warli Adivasi artisan community to respond more rapidly to growing international market demand and maintain competitive pricing against lower-cost printed imitations that have historically undercut genuine hand-painted Warli art in both domestic retail and international export market channels.</p></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
