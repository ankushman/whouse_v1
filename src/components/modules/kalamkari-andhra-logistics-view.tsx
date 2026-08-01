import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#4c1d95', '#5b21b6', '#6d28d9', '#7c3aed', '#8b5cf6', '#4c1d95', '#2e1065', '#f5f3ff']
const PRODUCTS = ['Kalamkari Tree of Life Scroll', 'Kalamkari Ramayana Panel', 'Kalamkari Hanuman Mural', 'Kalamkari Peacock Wall Hanging', 'Kalamkari Vishnu Dashavatara', 'Kalamkari Floral Curtain', 'Kalamkari Gopala Krishna Panel', 'Kalamkari Shiva Parvati Scroll']
const ARTISANS = ['Srikalahasti Pen Art AP', 'Machilipatnam Block Guild AP', 'Pedana Kalamkari Cluster AP', 'Polavaram Temple Art AP', 'Nellore Craft Society AP', 'Tirupati Heritage Weave AP', 'Kurnool Textile Art AP', 'Eluru Kalamkari Workshop AP']
const STATUSES = ['GI AP Kalamkari Mark', 'Natural Mordant Fixation QC', 'Pen Stroke Precision Test', 'Myrobalan Dye Bond Check', 'Alum Mordant Adhesion Test', 'Mythological Narrative Fidelity Audit']

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
  <Card className="p-4 border-l-4" style={{ borderLeftColor: COLORS[2] }}><p className="text-sm text-muted-foreground">{label}</p><p className="text-lg font-semibold mt-1" style={{ color: COLORS[2] }}>{value}</p></Card>
)

const genRecords = (offset: number) =>
  Array.from({ length: 20 }, (_, i) => ({
    id: `KLM-${String(offset + i + 1).padStart(4, '0')}`,
    artisan: ARTISANS[(offset + i) % ARTISANS.length], design: PRODUCTS[(offset + i) % PRODUCTS.length],
    status: STATUSES[(offset + i) % STATUSES.length], qty: ri(1, 10, ((offset + i) * 19) % 10) + 1,
    cost: ri(5000, 55000, ((offset + i) * 11307) % 50000) + 5000,
    date: new Date(2024, ((offset + i) % 12), ri(1, 28, (offset + i) % 28)).toISOString().slice(0, 10),
  }))

const kalamkarirecords = [
  { id: 'KLM-0001', artisan: 'Srikalahasti Pen Art AP', design: 'Kalamkari Tree of Life Scroll', status: 'GI AP Kalamkari Mark', qty: 4, cost: 48000, date: '2024-01-07' },
  { id: 'KLM-0002', artisan: 'Machilipatnam Block Guild AP', design: 'Kalamkari Ramayana Panel', status: 'Natural Mordant Fixation QC', qty: 3, cost: 52000, date: '2024-01-20' },
  { id: 'KLM-0003', artisan: 'Pedana Kalamkari Cluster AP', design: 'Kalamkari Hanuman Mural', status: 'Pen Stroke Precision Test', qty: 6, cost: 28000, date: '2024-02-02' },
  { id: 'KLM-0004', artisan: 'Polavaram Temple Art AP', design: 'Kalamkari Peacock Wall Hanging', status: 'Myrobalan Dye Bond Check', qty: 5, cost: 44000, date: '2024-02-15' },
  { id: 'KLM-0005', artisan: 'Nellore Craft Society AP', design: 'Kalamkari Vishnu Dashavatara', status: 'Alum Mordant Adhesion Test', qty: 7, cost: 16000, date: '2024-02-28' },
  { id: 'KLM-0006', artisan: 'Tirupati Heritage Weave AP', design: 'Kalamkari Floral Curtain', status: 'Mythological Narrative Fidelity Audit', qty: 4, cost: 50000, date: '2024-03-12' },
  { id: 'KLM-0007', artisan: 'Kurnool Textile Art AP', design: 'Kalamkari Gopala Krishna Panel', status: 'GI AP Kalamkari Mark', qty: 8, cost: 12000, date: '2024-03-25' },
  { id: 'KLM-0008', artisan: 'Eluru Kalamkari Workshop AP', design: 'Kalamkari Shiva Parvati Scroll', status: 'Natural Mordant Fixation QC', qty: 3, cost: 54000, date: '2024-04-07' },
  { id: 'KLM-0009', artisan: 'Srikalahasti Pen Art AP', design: 'Kalamkari Tree of Life Scroll', status: 'Pen Stroke Precision Test', qty: 5, cost: 36000, date: '2024-04-20' },
  { id: 'KLM-0010', artisan: 'Machilipatnam Block Guild AP', design: 'Kalamkari Ramayana Panel', status: 'Myrobalan Dye Bond Check', qty: 6, cost: 24000, date: '2024-05-03' },
  { id: 'KLM-0011', artisan: 'Pedana Kalamkari Cluster AP', design: 'Kalamkari Hanuman Mural', status: 'Alum Mordant Adhesion Test', qty: 4, cost: 42000, date: '2024-05-16' },
  { id: 'KLM-0012', artisan: 'Polavaram Temple Art AP', design: 'Kalamkari Peacock Wall Hanging', status: 'Mythological Narrative Fidelity Audit', qty: 7, cost: 18000, date: '2024-05-29' },
  { id: 'KLM-0013', artisan: 'Nellore Craft Society AP', design: 'Kalamkari Vishnu Dashavatara', status: 'GI AP Kalamkari Mark', qty: 3, cost: 50000, date: '2024-06-11' },
  { id: 'KLM-0014', artisan: 'Tirupati Heritage Weave AP', design: 'Kalamkari Floral Curtain', status: 'Natural Mordant Fixation QC', qty: 5, cost: 30000, date: '2024-06-24' },
  { id: 'KLM-0015', artisan: 'Kurnool Textile Art AP', design: 'Kalamkari Gopala Krishna Panel', status: 'Pen Stroke Precision Test', qty: 6, cost: 22000, date: '2024-07-07' },
  { id: 'KLM-0016', artisan: 'Eluru Kalamkari Workshop AP', design: 'Kalamkari Shiva Parvati Scroll', status: 'Myrobalan Dye Bond Check', qty: 4, cost: 40000, date: '2024-07-20' },
  { id: 'KLM-0017', artisan: 'Srikalahasti Pen Art AP', design: 'Kalamkari Tree of Life Scroll', status: 'Alum Mordant Adhesion Test', qty: 8, cost: 14000, date: '2024-08-02' },
  { id: 'KLM-0018', artisan: 'Machilipatnam Block Guild AP', design: 'Kalamkari Ramayana Panel', status: 'Mythological Narrative Fidelity Audit', qty: 3, cost: 52000, date: '2024-08-15' },
  { id: 'KLM-0019', artisan: 'Pedana Kalamkari Cluster AP', design: 'Kalamkari Hanuman Mural', status: 'GI AP Kalamkari Mark', qty: 5, cost: 34000, date: '2024-08-28' },
  { id: 'KLM-0020', artisan: 'Polavaram Temple Art AP', design: 'Kalamkari Peacock Wall Hanging', status: 'Natural Mordant Fixation QC', qty: 7, cost: 20000, date: '2024-09-10' },
]

export default function KalamkariAndhraLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})

  const allRecords = [...kalamkarirecords, ...genRecords(21), ...genRecords(41)]

  const filteredRecords = useMemo(() => {
    if (!searchQuery && Object.keys(activeFilters).every(k => !activeFilters[k].length)) return allRecords
    const sq = searchQuery.toLowerCase()
    return allRecords.filter(r => { if (sq && !r.id.toLowerCase().includes(sq) && !r.design.toLowerCase().includes(sq)) return false; return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string)); })
  }, [searchQuery, activeFilters, allRecords])

  const filterGroups = [
    { key: 'design', label: 'Design', options: PRODUCTS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.design === p).length })) },
    { key: 'artisan', label: 'Artisan', options: ARTISANS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.artisan === p).length })) },
  ]

  const trendData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m, i) => ({ month: m, shipments: ri(3, 18, allRecords.length * 0.10 + i * 3) }))
  const artisanChart = ARTISANS.map(p => ({ name: p.split(' ').slice(0, 2).join(' '), volume: allRecords.filter(r => r.artisan === p).reduce((s, r) => s + r.qty, 0) }))
  const statusPie = STATUSES.map(s => ({ name: s, value: allRecords.filter(r => r.status === s).length }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="klm-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Kalamkari Art' }]} />
      <PageHeader title="Kalamkari Andhra Pradesh Logistics" description="Andhra Pradesh Kalamkari hand-painted textile supply chain with GI AP Kalamkari Mark certification natural mordant fixation quality control pen stroke precision testing myrobalan dye bond verification alum mordant adhesion assessment and mythological narrative fidelity audit across 8 Kalamkari artisan clusters in Srikalahasti Machilipatnam Pedana and Polavaram" />
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
            <KpiTile label="Artisan Clusters" value={ARTISANS.length} />
            <KpiTile label="Avg Cost" value={`₹${Math.round(allRecords.reduce((s, r) => s + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>
          <div className="grid grid-cols-6 gap-4">
            <HealthRing label="GI Tag" value={93} />
            <HealthRing label="Mordant" value={88} />
            <HealthRing label="Pen" value={91} />
            <HealthRing label="Dye" value={86} />
            <HealthRing label="Alum" value={90} />
            <HealthRing label="Narrative" value={94} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Kalamkari Families" value="18 Active" />
            <ValueTile label="Tradition" value="Since 3000 BC" />
            <ValueTile label="Export Markets" value="5 Countries" />
            <ValueTile label="Annual Revenue" value="₹0.6 Crore" />
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
            placeholder="Search Kalamkari art shipments..."
          />
          <div className="rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-violet-100">
                <tr>
                  <th className="p-3 text-left font-medium">ID</th>
                  <th className="p-3 text-left font-medium">Design</th>
                  <th className="p-3 text-left font-medium">Artisan</th>
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
                    <td className="p-3">{record.artisan}</td>
                    <td className="p-3"><StatusBadge status={record.status} /></td>
                    <td className="p-3">{record.qty} {['scrolls', 'panels', 'murals', 'hangings'][parseInt(record.id.slice(4)) % 4]}</td>
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
              <CardHeader><CardTitle>Kalamkari Andhra Pradesh — Ancient Temple Textile Painting Tradition</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">Kalamkari represents one of the most ancient and visually elaborate hand-painted and block-printed textile art traditions of India originating in the Andhra Pradesh region with two historically distinct production centres at Srikalahasti in the Chittoor district renowned for the pen-drawn temple-style Kalamkari tradition and Machilipatnam in the Krishna district famous for the block-printed decorative Kalamkari tradition both drawing on a shared heritage of mythological narrative painting that dates back approximately three thousand years with archaeological evidence suggesting the Kalamkari tradition evolved from the ancient South Indian temple mural painting tradition where skilled artisan painters known as chitrakars created elaborate narrative panels depicting scenes from the great Hindu epics the Ramayana and Mahabharata and the Puranic stories of the various divine incarnations to adorn temple walls and temple chariots for religious festival processions where the term Kalamkari derives from the Persian words kalam meaning pen and kari meaning craftsmanship literally meaning pen-work art reflecting the distinctive freehand drawing technique of the Srikalahasti tradition where the artisan uses a sharpened bamboo pen dipped in fermented jaggery water and kasimi a mixture of iron filings and palm jaggery to create fine freehand outline drawings directly onto the cotton fabric surface producing the intricate character figures decorative borders and narrative scene compositions that define the temple-style Kalamkari art form where the Machilipatnam tradition developed during the Mughal and Golconda Sultanate period as a block-printed variant adapted for producing decorative textiles for domestic and export markets using hand-carved teak wood blocks to stamp the intricate Kalamkari patterns onto the fabric surface in a production technique that is faster than the pen-drawn method but retains the characteristic elaborate pattern vocabulary of flowing vine and floral motifs peacock and parrot designs and stylised tree of life compositions that distinguish authentic Andhra Pradesh Kalamkari from other Indian textile printing traditions where the traditional Kalamkari colour palette uses exclusively natural vegetable and mineral dyes including the distinctive black from the iron-jaggery kasimi preparation red from the alum-mordanted alizarin root extract derived from the madder plant Rubia cordifolia blue from the indigo plant Indigofera tinctoria yellow from the myrobalan fruit Terminalia chebula and pomegranate rind Punica granatum and green from overlapping applications of blue and yellow dye creating the rich earthy warm colour palette that is the hallmark of authentic Andhra Pradesh Kalamkari textile art.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Natural Mordant Fixation QC and Pen Stroke Precision Standards</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The natural mordant fixation quality control and pen stroke precision testing protocols for Andhra Pradesh Kalamkari establish the primary technical quality assurance framework for the traditional hand-painted and block-printed textile art process that ensures the colour fastness and artistic precision of authentic GI-certified Kalamkari products where the natural mordant fixation test evaluates the chemical effectiveness of the traditional mordant preparations used to bind natural dyes to the cotton fabric substrate where alum potassium aluminium sulphate is the primary mordant for red dye fixation and iron from the kasimi mixture is the mordant for black dye formation with myrobalan Terminalia chebula serving as both a dye and an auxiliary mordant that modifies the colour and improves dye uptake where the mordant fixation test uses the standard ISO 105-C06 wash fastness test method subjecting the dyed fabric sample to five consecutive wash cycles in a standard detergent solution at forty degrees Celsius measuring the colour change using spectrophotometer readings against the undyed control sample and the staining of adjacent white fabric confirming the mordanted dye achieves a minimum wash fastness rating of three on the one-to-five grey scale for colour change and three for staining ensuring the natural dye colours remain stable through normal washing and use without significant fading or colour bleeding where the pen stroke precision test evaluates the drawing quality of the Srikalahasti pen-drawn Kalamkari technique using digital microscopy at twenty-times magnification confirming the bamboo pen produces clean sharp continuous outline lines with line width variation within plus or minus zero point three millimetres across the entire drawn composition confirming the artisan maintains consistent pen pressure and ink flow throughout the drawing process where the line continuity test measures the number of visible pen ink interruptions or gaps per metre of drawn line confirming the frequency is less than two interruptions per metre indicating smooth uninterrupted pen strokes that define the master-level Srikalahasti Kalamkari drawing quality where the line curvature test evaluates the smoothness of curved pen strokes in the elaborate vine scroll and figure contour patterns confirming the pen stroke curves flow naturally without visible angularity jagged edges or wobble that would indicate inadequate pen control or poor bamboo pen tip condition.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Myrobalan Dye Bond Verification and Alum Mordant Adhesion Testing</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The myrobalan dye bond verification and alum mordant adhesion testing protocols ensure the colour quality and fastness performance of the natural dye system that produces the distinctive Kalamkari colour palette where the myrobalan dye bond test evaluates the effectiveness of the myrobalan Terminalia chebula fruit extract as both a direct yellow dye and an auxiliary mordant that modifies the fabric surface chemistry to improve the uptake and fastness of subsequent alum-mordanted red and iron-mordanted black dye applications where the myrobalan bond test measures the strength of the myrobalan-fabric chemical bond using the standard crocking fastness test method where a dry and wet rubbing cloth is rubbed against the dyed fabric surface under controlled pressure for ten strokes in each direction measuring the amount of myrobalan colour transferred to the rubbing cloth confirming the dry crocking fastness rating is four or above and the wet crocking fastness rating is three or above on the one-to-five scale ensuring the myrobalan yellow dye is firmly bonded to the cotton fibre and will not rub off during normal handling folding and transport of the finished Kalamkari textile where the myrobalan pH test confirms the myrobalan dye bath pH is between three point five and four point five which is the optimal acidity range for maximum myrobalan dye fixation to the cotton cellulose fibre where the alum mordant adhesion test evaluates the effectiveness of the alum potassium aluminium sulphate mordant in binding the alizarin red dye to the cotton fabric where the test measures the rub fastness of the alum-mordanted red dye areas confirming the red colour achieves a minimum rub fastness of three on the five-point scale without visible colour transfer to adjacent fabric areas or handling surfaces where the mordant uniformity test examines the alum penetration through the fabric thickness using cross-sectional microscopy at fifty-times magnification confirming the alum mordant penetrates through the full fabric thickness from the surface side to the reverse side ensuring the red colour appears equally saturated on both sides of the Kalamkari textile without the uneven front-back colour difference that indicates insufficient mordant penetration.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Mythological Narrative Fidelity Audit and Kalamkari Heritage Market Expansion</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The mythological narrative fidelity audit and Kalamkari heritage market expansion framework provides the artistic quality assurance and commercial market infrastructure for the Andhra Pradesh Kalamkari art supply chain ensuring that all GI-certified Kalamkari art products demonstrate the authentic mythological narrative content and cultural storytelling accuracy that defines the ancient temple textile painting tradition while connecting the eighteen active Kalamkari artisan families across Srikalahasti Machilipatnam Pedana Polavaram Nellore Tirupati Kurnool and Eluru with growing institutional and international market demand for authentic Andhra Pradesh hand-painted and block-printed textiles where the mythological narrative fidelity audit evaluates the presence and accuracy of the characteristic Kalamkari storytelling narrative elements that distinguish authentic temple-style Kalamkari from non-traditional decorative reproductions including the complete Ramayana narrative cycle depicting the key episodes from the birth of Rama through the exile in the Dandaka forest the abduction of Sita by Ravana the battle between Rama and Ravana and the triumphant return to Ayodhya the Dashavatara series depicting the ten principal incarnations of Lord Vishnu from Matsya the fish to Kalki the future incarnation the Gopala Krishna narrative depicting the childhood and pastoral life of Lord Krishna in the Vrindavan cowherd community and the Shiva Parvati narrative depicting the divine marriage and cosmic dance of Lord Shiva confirming these narrative sequences are accurately depicted with the correct iconographic attributes and episode sequence established by the Srikalahasti Kalamkari master artisan tradition where the narrative iconography test verifies that each mythological character is depicted with the correct traditional attributes including Rama with his bow and quiver Hanuman with his mace and mountain-carrying pose Vishnu with his conch discus lotus and mace Shiva with his trident and third eye marking confirming the visual iconography follows the established South Indian temple iconographic conventions without modern modifications or Western-influenced figure styling that would compromise the traditional cultural authenticity of the Kalamkari narrative art where the Kalamkari heritage market development initiative led by the Andhra Pradesh State Handicrafts Development Corporation in collaboration with the Crafts Council of India and the Ministry of Textiles Handloom and Handicrafts Export Promotion Council has established institutional procurement programmes connecting the active Kalamkari artisan communities with the Kalamkari retail cooperative at Srikalahasti the Andhra Pradesh State Emporium and international cultural exhibitions with projected annual revenue growth of thirty percent.</p></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}



