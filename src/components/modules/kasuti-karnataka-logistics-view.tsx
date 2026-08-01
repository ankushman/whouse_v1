import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#7c2d12', '#92400e', '#b45309', '#d97706', '#f59e0b', '#78350f', '#451a03', '#fef3c7']
const PRODUCTS = ['Kasuti Gopuram Border', 'Kasuti Chariot Motif Saree', 'Kasuti Lotus Pallu Panel', 'Kasuti Peacock Border Dupatta', 'Kasuti Temple Tower Hanky', 'Kasuti Durmukha Frame Panel', 'Kasuti Tulasi Mantap Hanging', 'Kasuti Elephanta Cushion Cover']
const ARTISANS = ['Dharwad Kasuti Cluster KA', 'Hubli Handloom Guild KA', 'Belagavi Embroidery Society KA', 'Bijapur Craft Collective KA', 'Mysore Palace Arts KA', 'Shimoga Rural Embroidery KA', 'Gulbarga Heritage Cluster KA', 'Udipi Craft Workshop KA']
const STATUSES = ['GI Karnataka Kasuti Mark', 'Thread Count Stitch QC', 'Mirror Work Integration Test', 'Pattern Symmetry Check', 'Silk Floss Tension Test', 'Traditional Motif Fidelity Audit']

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
  <Card className="p-4 border-l-4" style={{ borderLeftColor: COLORS[2] }}><p className="text-sm text-muted-foreground">{label}</p><p className="text-lg font-semibold mt-1" style={{ color: COLORS[2] }}>{value}</p></Card>
)

const genRecords = (offset: number) =>
  Array.from({ length: 20 }, (_, i) => ({
    id: `KSU-${String(offset + i + 1).padStart(4, '0')}`,
    artisan: ARTISANS[(offset + i) % ARTISANS.length], design: PRODUCTS[(offset + i) % PRODUCTS.length],
    status: STATUSES[(offset + i) % STATUSES.length], qty: ri(1, 6, ((offset + i) * 19) % 6) + 1,
    cost: ri(5000, 180000, ((offset + i) * 11307) % 175000) + 5000,
    date: new Date(2024, ((offset + i) % 12), ri(1, 28, (offset + i) % 28)).toISOString().slice(0, 10),
  }))

const kasutirecords = [
  { id: 'KSU-0001', artisan: 'Dharwad Kasuti Cluster KA', design: 'Kasuti Gopuram Border', status: 'GI Karnataka Kasuti Mark', qty: 3, cost: 165000, date: '2024-01-07' },
  { id: 'KSU-0002', artisan: 'Hubli Handloom Guild KA', design: 'Kasuti Chariot Motif Saree', status: 'Thread Count Stitch QC', qty: 2, cost: 120000, date: '2024-01-20' },
  { id: 'KSU-0003', artisan: 'Belagavi Embroidery Society KA', design: 'Kasuti Lotus Pallu Panel', status: 'Mirror Work Integration Test', qty: 5, cost: 45000, date: '2024-02-02' },
  { id: 'KSU-0004', artisan: 'Bijapur Craft Collective KA', design: 'Kasuti Peacock Border Dupatta', status: 'Pattern Symmetry Check', qty: 3, cost: 95000, date: '2024-02-15' },
  { id: 'KSU-0005', artisan: 'Mysore Palace Arts KA', design: 'Kasuti Temple Tower Hanky', status: 'Silk Floss Tension Test', qty: 4, cost: 25000, date: '2024-02-28' },
  { id: 'KSU-0006', artisan: 'Shimoga Rural Embroidery KA', design: 'Kasuti Durmukha Frame Panel', status: 'Traditional Motif Fidelity Audit', qty: 2, cost: 175000, date: '2024-03-12' },
  { id: 'KSU-0007', artisan: 'Gulbarga Heritage Cluster KA', design: 'Kasuti Tulasi Mantap Hanging', status: 'GI Karnataka Kasuti Mark', qty: 6, cost: 35000, date: '2024-03-25' },
  { id: 'KSU-0008', artisan: 'Udipi Craft Workshop KA', design: 'Kasuti Elephanta Cushion Cover', status: 'Thread Count Stitch QC', qty: 3, cost: 150000, date: '2024-04-07' },
  { id: 'KSU-0009', artisan: 'Dharwad Kasuti Cluster KA', design: 'Kasuti Gopuram Border', status: 'Mirror Work Integration Test', qty: 4, cost: 85000, date: '2024-04-20' },
  { id: 'KSU-0010', artisan: 'Hubli Handloom Guild KA', design: 'Kasuti Chariot Motif Saree', status: 'Pattern Symmetry Check', qty: 2, cost: 180000, date: '2024-05-03' },
  { id: 'KSU-0011', artisan: 'Belagavi Embroidery Society KA', design: 'Kasuti Lotus Pallu Panel', status: 'Silk Floss Tension Test', qty: 5, cost: 40000, date: '2024-05-16' },
  { id: 'KSU-0012', artisan: 'Bijapur Craft Collective KA', design: 'Kasuti Peacock Border Dupatta', status: 'Traditional Motif Fidelity Audit', qty: 3, cost: 110000, date: '2024-05-29' },
  { id: 'KSU-0013', artisan: 'Mysore Palace Arts KA', design: 'Kasuti Temple Tower Hanky', status: 'GI Karnataka Kasuti Mark', qty: 4, cost: 55000, date: '2024-06-11' },
  { id: 'KSU-0014', artisan: 'Shimoga Rural Embroidery KA', design: 'Kasuti Durmukha Frame Panel', status: 'Thread Count Stitch QC', qty: 2, cost: 170000, date: '2024-06-24' },
  { id: 'KSU-0015', artisan: 'Gulbarga Heritage Cluster KA', design: 'Kasuti Tulasi Mantap Hanging', status: 'Mirror Work Integration Test', qty: 6, cost: 30000, date: '2024-07-07' },
  { id: 'KSU-0016', artisan: 'Udipi Craft Workshop KA', design: 'Kasuti Elephanta Cushion Cover', status: 'Pattern Symmetry Check', qty: 3, cost: 140000, date: '2024-07-20' },
  { id: 'KSU-0017', artisan: 'Dharwad Kasuti Cluster KA', design: 'Kasuti Gopuram Border', status: 'Silk Floss Tension Test', qty: 4, cost: 70000, date: '2024-08-02' },
  { id: 'KSU-0018', artisan: 'Hubli Handloom Guild KA', design: 'Kasuti Chariot Motif Saree', status: 'Traditional Motif Fidelity Audit', qty: 2, cost: 160000, date: '2024-08-15' },
  { id: 'KSU-0019', artisan: 'Belagavi Embroidery Society KA', design: 'Kasuti Lotus Pallu Panel', status: 'GI Karnataka Kasuti Mark', qty: 5, cost: 20000, date: '2024-08-28' },
  { id: 'KSU-0020', artisan: 'Bijapur Craft Collective KA', design: 'Kasuti Peacock Border Dupatta', status: 'Thread Count Stitch QC', qty: 3, cost: 130000, date: '2024-09-10' },
]

export default function KasutiKarnatakaLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})

  const allRecords = [...kasutirecords, ...genRecords(21), ...genRecords(41)]

  const filteredRecords = useMemo(() => {
    if (!searchQuery && Object.keys(activeFilters).every(k => !activeFilters[k].length)) return allRecords
    const sq = searchQuery.toLowerCase()
    return allRecords.filter(r => { if (sq && !r.id.toLowerCase().includes(sq) && !r.design.toLowerCase().includes(sq)) return false; return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string)); })
  }, [searchQuery, activeFilters, allRecords])

  const filterGroups = [
    { key: 'design', label: 'Design', options: PRODUCTS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.design === p).length })) },
    { key: 'artisan', label: 'Artisan', options: ARTISANS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.artisan === p).length })) },
  ]

  const trendData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m, i) => ({ month: m, shipments: ri(2, 12, allRecords.length * 0.10 + i * 2) }))
  const artisanChart = ARTISANS.map(p => ({ name: p.split(' ').slice(0, 2).join(' '), volume: allRecords.filter(r => r.artisan === p).reduce((s, r) => s + r.qty, 0) }))
  const statusPie = STATUSES.map(s => ({ name: s, value: allRecords.filter(r => r.status === s).length }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="ksu-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Kasuti Art' }]} />
      <PageHeader title="Kasuti Karnataka Logistics" description="Karnataka Kasuti counted-thread embroidery supply chain with GI Karnataka Kasuti Mark certification thread count stitch quality control mirror work integration testing pattern symmetry verification silk floss tension testing and traditional motif fidelity audit across 8 Kasuti embroidery clusters in Dharwad Hubli Belagavi and Mysore" />
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
            <KpiTile label="Active Designs" value={PRODUCTS.length} />
            <KpiTile label="Embroidery Clusters" value={ARTISANS.length} />
            <KpiTile label="Avg Cost" value={`₹${Math.round(allRecords.reduce((s, r) => s + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>
          <div className="grid grid-cols-6 gap-4">
            <HealthRing label="GI Tag" value={94} />
            <HealthRing label="Stitch" value={91} />
            <HealthRing label="Mirror" value={88} />
            <HealthRing label="Pattern" value={93} />
            <HealthRing label="Floss" value={87} />
            <HealthRing label="Motif" value={90} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Lambani Families" value="12 Active" />
            <ValueTile label="Tradition" value="Since 600 AD" />
            <ValueTile label="Export Markets" value="5 Countries" />
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
            placeholder="Search Kasuti art shipments..."
          />
          <div className="rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-amber-100">
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
                  <tr key={record.id} className="border-t hover:bg-amber-50/50">
                    <td className="p-3 font-mono text-xs">{record.id}</td>
                    <td className="p-3"><ProductBadge name={record.design} /></td>
                    <td className="p-3">{record.artisan}</td>
                    <td className="p-3"><StatusBadge status={record.status} /></td>
                    <td className="p-3">{record.qty} {['sarees', 'panels', 'dupattas', 'hangings'][parseInt(record.id.slice(4)) % 4]}</td>
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
              <CardHeader><CardTitle>Kasuti Karnataka — Ancient Dharwad Counted-Thread Embroidery Tradition</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">Kasuti represents one of the most technically intricate and culturally significant counted-thread embroidery traditions of South India originating in the Dharwad district of northern Karnataka where the Lambani and Brahmin women communities have maintained this unbroken hand-embroidery tradition for over fourteen centuries since approximately six hundred AD making Kasuti one of the oldest continuously practised needlework art forms in the Indian subcontinent where the term Kasuti derives from the Kannada words kai meaning hand and suti meaning cotton thread reflecting the fundamental technique of creating intricate patterns by counting threads of the base fabric and embroidering directly onto the woven cloth without tracing or transfer patterns where the Kasuti technique requires the embroiderer to mentally visualize the complete pattern and count the exact number of warp and weft threads of the base fabric to determine the precise stitch placement positions that will produce the intended geometric and figurative design elements with mathematical precision where the traditional Kasuti embroidery employs four primary stitch types each serving a distinct structural purpose in the design composition the gavanti stitch which is a double-running stitch that produces identical patterns on both sides of the fabric making it the signature technique of Kasuti embroidery the murgi stitch which is a zigzag running stitch used to fill pattern areas with dense textured colour the negi stitch which is a simple running or darning stitch used for outline work and connecting pattern elements and the menthi stitch which is a cross-stitch variant used for filling small geometric pattern areas where the most skilled Kasuti embroiderers can produce designs using only the gavanti double-running stitch creating perfectly reversible embroideries that are identical on both sides of the fabric a technical feat that requires extraordinary spatial reasoning and counting precision where the characteristic Kasuti design vocabulary draws primarily on the architectural and religious motifs of the Karnataka temple tradition including the gopuram or temple tower motif representing the sacred mountain gateway of the Hindu temple the ratha or temple chariot motif depicting the ornate festival processional chariots of Karnataka temples the lotus or tamarai motif representing spiritual purity and divine beauty the hamsa or swan motif representing the sacred goose of Hindu mythology the tulasi or basil plant motif representing the sacred household basil plant and the elaborate geometric border patterns that frame the central design composition of each Kasuti textile piece where the traditional Kasuti embroidery process for a single saree typically requires three to six months of continuous daily work by a skilled embroiderer with the most complex gavanti-stitch designs requiring up to one year of concentrated counting and stitching work across the full six to nine yards of saree fabric producing an estimated fifty thousand to one hundred thousand individual counted stitches per completed piece.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Thread Count Stitch QC and Mirror Work Integration Standards</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The thread count stitch quality control and mirror work integration testing protocols for Karnataka Kasuti establish the primary technical quality assurance framework for the traditional counted-thread embroidery process that ensures the stitch accuracy and pattern quality of authentic GI-certified Kasuti products where the thread count stitch QC evaluates the precision of the counted-thread stitch placement on the base fabric confirming that each stitch is positioned at exactly the calculated warp and weft thread intersection point determined by the design pattern where the stitch placement accuracy is measured using digital microscopy at twenty-five-times magnification confirming each stitch penetrates the base fabric within plus or minus zero point one thread positions of the calculated ideal stitch location where any stitch deviating beyond this tolerance produces a visible pattern distortion that disrupts the geometric regularity of the Kasuti design and significantly reduces the artistic and commercial value of the finished piece where the gavanti double-running stitch quality test specifically evaluates the symmetry and completeness of the signature reversible double-running stitch technique confirming that the pattern on the reverse side of the fabric is an exact mirror image of the front side pattern with no visible thread carryovers or skipped stitch points that would indicate inconsistent stitch tension or incorrect counting where the stitch density test measures the number of stitches per square centimetre of the embroidered area confirming the stitch density meets the minimum standard of forty-five stitches per square centimetre for the gavanti technique and sixty stitches per square centimetre for the murgi zigzag filling technique where the mirror work integration test evaluates the precision of the traditional shisha or mirror-work elements that are incorporated into certain Kasuti embroidery designs as decorative accent features where small circular mirrors of five to fifteen millimetres diameter are secured to the fabric using a framework of interlocking counted-stitches that hold the mirror flat and centered within a geometric stitch frame without any mirror edge exposure or loose stitch attachment that would allow mirror displacement during handling or washing where the mirror frame stitch test confirms the mirror is anchored by a minimum of twelve interlocking stitch points evenly distributed around the mirror circumference with consistent stitch tension within plus or minus ten percent variation around each mirror.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Pattern Symmetry Check and Silk Floss Tension Verification</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The pattern symmetry check and silk floss tension verification protocols ensure the visual quality and structural integrity of authentic Karnataka Kasuti embroidery pieces where the pattern symmetry test evaluates the bilateral and rotational symmetry of the embroidered design elements that are the defining visual characteristic of traditional Kasuti embroidery where the test uses high-resolution digital scanning at four hundred dots per inch followed by automated symmetry analysis software that detects and measures the positional deviation of corresponding design elements on either side of the central axis of bilateral symmetry or at equivalent angular positions around the axis of rotational symmetry confirming the symmetry deviation is less than zero point three millimetres for any pair of corresponding design elements across the entire embroidered area where symmetry deviations exceeding this tolerance produce a visually perceptible asymmetry that is immediately apparent to trained Kasuti quality inspectors and significantly compromises the aesthetic harmony and cultural authenticity of the Kasuti piece where the pattern regularity test additionally evaluates the spacing consistency between repeated design elements in the Kasuti border and field patterns confirming the inter-element spacing variation is within plus or minus five percent of the mean spacing value ensuring the repetitive geometric patterns maintain a uniform visual rhythm across the entire fabric surface without progressive spacing drift that would indicate counting fatigue or inconsistent technique by the embroiderer where the silk floss tension verification evaluates the thread tension uniformity of the embroidery floss used in the Kasuti stitching process where the test measures the resistance force required to pull a standard length of embroidery floss through the fabric at a controlled speed using a digital tensiometer confirming the thread tension is consistent within plus or minus eight percent across the full embroidery area where tension variations beyond this range produce visible surface irregularities including puckering or gathering of the base fabric around tightly tensioned stitches and loose looping of floss around insufficiently tensioned stitches creating an uneven surface texture that reduces both the visual quality and the physical durability of the Kasuti embroidery.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Traditional Motif Fidelity Audit and Kasuti Heritage Market Development</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The traditional motif fidelity audit and Kasuti heritage market development framework provides the artistic quality assurance and commercial market infrastructure for the Karnataka Kasuti counted-thread embroidery supply chain ensuring that all GI-certified Kasuti products demonstrate the authentic traditional motif vocabulary and cultural design integrity that defines the fourteen-century Dharwad Kasuti embroidery tradition while connecting the active Kasuti embroiderer communities across Dharwad Hubli Belagavi Bijapur Mysore Shimoga Gulbarga and Udipi with growing institutional and international collector market demand for authentic Karnataka Kasuti textiles where the traditional motif fidelity audit evaluates the presence and accuracy of the characteristic Kasuti design vocabulary elements that distinguish authentic Dharwad-region Kasuti from non-traditional reproductions and machine-embroidered imitations including the sacred gopuram temple tower motif in its three traditional variants the ratha temple chariot motif with its ornate canopy and wheel detailing the hamsa celestial swan motif with its gracefully curved neck and spread wing pattern the lotus padma motif in its multi-petal symmetric form the durmukha or mythical lion-mask motif and the characteristic Kasuti geometric border patterns featuring interlocking diamond chain and stepped triangle compositions where the motif execution test verifies the precision and clarity of each pattern element confirming the counted-thread stitching produces clean sharp pattern edges with consistent stitch directionality within each design element without the irregular stitch direction changes that indicate counting errors or technique inconsistency where the traditional Kasuti stitch-type test confirms the exclusive use of the four authenticated Kasuti stitch types being the gavanti double-running stitch the murgi zigzag running stitch the negi simple running stitch and the menthi cross-stitch without any non-traditional stitch types that would compromise the heritage authenticity of the GI-certified Kasuti product where the Kasuti heritage market development initiative led by the Karnataka State Handloom and Handicrafts Development Corporation in collaboration with the National Handloom Development Corporation the Dharwad Kasuti Welfare Association and the Karnataka Chitrakala Parishath has established institutional patronage connecting the active Kasuti embroiderer communities with the Karnataka State Emporium and international cultural exhibitions with projected annual revenue growth of twenty-eight percent for the Karnataka Kasuti sector.</p></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}



