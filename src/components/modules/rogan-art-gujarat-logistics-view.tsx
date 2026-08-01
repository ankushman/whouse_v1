import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#991b1b', '#b91c1c', '#dc2626', '#ef4444', '#f87171', '#7f1d1d', '#450a0a', '#fee2e2']
const PRODUCTS = ['Rogan Tree of Life Panel', 'Rogan Floral Textile Art', 'Rogan Peacock Design Scroll', 'Rogan Abstract Canvas', 'Rogan Mandala Art Panel', 'Rogan Camel Decorative Panel', 'Rogan Bride Palanquin Art', 'Rogan Heritage Wall Hanging']
const ARTISANS = ['Rogan Art Heritage Guild Kutch', 'Nirona Village Artisans Gujarat', 'Bhuj Rogan Collective Gujarat', 'Anjar Traditional Painters Gujarat', 'Mundra Art Cluster Gujarat', 'Mandvi Rogan Society Gujarat', 'Rapar Village Craftsmen Gujarat', 'Abdasa Rogan Workshop Gujarat']
const STATUSES = ['GI Gujarat Rogan Art Mark', 'Castor Oil Pigment QC', 'Hand-Painted Finish QC', 'Flat Pack Carton Box', 'Climate Control Storage', 'Rogan Art Adhesion Test']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-red-100 text-red-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="w-24 h-2 bg-red-200 rounded-full overflow-hidden"><div className="h-full bg-red-700 rounded-full" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ label, value, size = 80 }: { label: string; value: number; size?: number }) => {
  const r = (size - 12) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#fee2e2" strokeWidth="6" />
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
    id: `ROG-${String(offset + i + 1).padStart(4, '0')}`,
    painter: ARTISANS[(offset + i) % ARTISANS.length], ware: PRODUCTS[(offset + i) % PRODUCTS.length],
    status: STATUSES[(offset + i) % STATUSES.length], qty: ri(1, 20, ((offset + i) * 19) % 20) + 1,
    cost: ri(4000, 52000, ((offset + i) * 10707) % 48000) + 4000,
    date: new Date(2024, ((offset + i) % 12), ri(1, 28, (offset + i) % 28)).toISOString().slice(0, 10),
  }))

const roganrecords = [
  { id: 'ROG-0001', painter: 'Rogan Art Heritage Guild Kutch', ware: 'Rogan Tree of Life Panel', status: 'GI Gujarat Rogan Art Mark', qty: 3, cost: 48000, date: '2024-01-15' },
  { id: 'ROG-0002', painter: 'Nirona Village Artisans Gujarat', ware: 'Rogan Floral Textile Art', status: 'Castor Oil Pigment QC', qty: 5, cost: 36000, date: '2024-01-28' },
  { id: 'ROG-0003', painter: 'Bhuj Rogan Collective Gujarat', ware: 'Rogan Peacock Design Scroll', status: 'Hand-Painted Finish QC', qty: 2, cost: 52000, date: '2024-02-10' },
  { id: 'ROG-0004', painter: 'Anjar Traditional Painters Gujarat', ware: 'Rogan Abstract Canvas', status: 'Flat Pack Carton Box', qty: 7, cost: 22000, date: '2024-02-22' },
  { id: 'ROG-0005', painter: 'Mundra Art Cluster Gujarat', ware: 'Rogan Mandala Art Panel', status: 'Climate Control Storage', qty: 4, cost: 44000, date: '2024-03-08' },
  { id: 'ROG-0006', painter: 'Mandvi Rogan Society Gujarat', ware: 'Rogan Camel Decorative Panel', status: 'Rogan Art Adhesion Test', qty: 6, cost: 28000, date: '2024-03-20' },
  { id: 'ROG-0007', painter: 'Rapar Village Craftsmen Gujarat', ware: 'Rogan Bride Palanquin Art', status: 'GI Gujarat Rogan Art Mark', qty: 2, cost: 50000, date: '2024-04-03' },
  { id: 'ROG-0008', painter: 'Abdasa Rogan Workshop Gujarat', ware: 'Rogan Heritage Wall Hanging', status: 'Castor Oil Pigment QC', qty: 8, cost: 16000, date: '2024-04-16' },
  { id: 'ROG-0009', painter: 'Rogan Art Heritage Guild Kutch', ware: 'Rogan Peacock Design Scroll', status: 'Hand-Painted Finish QC', qty: 4, cost: 40000, date: '2024-04-28' },
  { id: 'ROG-0010', painter: 'Nirona Village Artisans Gujarat', ware: 'Rogan Tree of Life Panel', status: 'Flat Pack Carton Box', qty: 3, cost: 48000, date: '2024-05-10' },
  { id: 'ROG-0011', painter: 'Bhuj Rogan Collective Gujarat', ware: 'Rogan Floral Textile Art', status: 'Climate Control Storage', qty: 5, cost: 32000, date: '2024-05-23' },
  { id: 'ROG-0012', painter: 'Anjar Traditional Painters Gujarat', ware: 'Rogan Abstract Canvas', status: 'Rogan Art Adhesion Test', qty: 6, cost: 20000, date: '2024-06-05' },
  { id: 'ROG-0013', painter: 'Mundra Art Cluster Gujarat', ware: 'Rogan Mandala Art Panel', status: 'GI Gujarat Rogan Art Mark', qty: 3, cost: 46000, date: '2024-06-18' },
  { id: 'ROG-0014', painter: 'Mandvi Rogan Society Gujarat', ware: 'Rogan Camel Decorative Panel', status: 'Castor Oil Pigment QC', qty: 7, cost: 24000, date: '2024-07-01' },
  { id: 'ROG-0015', painter: 'Rapar Village Craftsmen Gujarat', ware: 'Rogan Bride Palanquin Art', status: 'Hand-Painted Finish QC', qty: 2, cost: 52000, date: '2024-07-14' },
  { id: 'ROG-0016', painter: 'Abdasa Rogan Workshop Gujarat', ware: 'Rogan Heritage Wall Hanging', status: 'Flat Pack Carton Box', qty: 10, cost: 12000, date: '2024-07-26' },
  { id: 'ROG-0017', painter: 'Rogan Art Heritage Guild Kutch', ware: 'Rogan Tree of Life Panel', status: 'Climate Control Storage', qty: 4, cost: 42000, date: '2024-08-08' },
  { id: 'ROG-0018', painter: 'Nirona Village Artisans Gujarat', ware: 'Rogan Floral Textile Art', status: 'Rogan Art Adhesion Test', qty: 5, cost: 30000, date: '2024-08-20' },
  { id: 'ROG-0019', painter: 'Bhuj Rogan Collective Gujarat', ware: 'Rogan Peacock Design Scroll', status: 'GI Gujarat Rogan Art Mark', qty: 3, cost: 50000, date: '2024-09-02' },
  { id: 'ROG-0020', painter: 'Anjar Traditional Painters Gujarat', ware: 'Rogan Abstract Canvas', status: 'Castor Oil Pigment QC', qty: 8, cost: 18000, date: '2024-09-14' },
]

export default function RoganArtGujaratLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})

  const allRecords = [...roganrecords, ...genRecords(21), ...genRecords(41)]

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
    <div className="rog-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Rogan Art Gujarat' }]} />
      <PageHeader title="Rogan Art Gujarat Logistics" description="Gujarat Kutch Rogan art castor oil painting supply chain with GI Gujarat Rogan Art Mark, castor oil pigment quality control, hand-painted finish verification, flat pack carton packaging, climate-controlled storage, and Rogan art adhesion testing across 8 artisan clusters in Nirona, Bhuj, and Mundra" />
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="bg-red-100">
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
            <HealthRing label="GI Tag" value={91} />
            <HealthRing label="Pigment" value={87} />
            <HealthRing label="Finish" value={83} />
            <HealthRing label="Carton" value={78} />
            <HealthRing label="Climate" value={85} />
            <HealthRing label="Adhesion" value={90} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Rogan Families" value="3 Active" />
            <ValueTile label="Tradition" value="Since 400yr" />
            <ValueTile label="Export Markets" value="6 Countries" />
            <ValueTile label="Annual Revenue" value="₹2.4 Crore" />
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
            placeholder="Search Rogan art shipments..."
          />
          <div className="rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-red-100">
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
                  <tr key={record.id} className="border-t hover:bg-red-50/50">
                    <td className="p-3 font-mono text-xs">{record.id}</td>
                    <td className="p-3"><ProductBadge name={record.ware} /></td>
                    <td className="p-3">{record.painter}</td>
                    <td className="p-3"><StatusBadge status={record.status} /></td>
                    <td className="p-3">{record.qty} {['pcs', 'panels', 'scrolls', 'frames'][parseInt(record.id.slice(4)) % 4]}</td>
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
              <CardHeader><CardTitle>Rogan Art — 400-Year Kutch Castor Oil Painting Heritage</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">Rogan art represents one of the rarest and most technically demanding traditional textile painting art forms of India having been continuously practised for over four centuries by the Khatri Muslim artisan families of the Nirona village in the Kutch district of Gujarat where the hereditary Rogan painters create extraordinarily intricate and vividly coloured decorative textile panels and wall hangings using a unique painting technique that employs castor oil-based mineral pigments applied without any brush or painting instrument instead being transferred from a metal stylus or kalam onto the fabric surface through a distinctive half-kalam transfer technique where the painter first prepares the Rogan pigment paste by boiling castor oil for several days until it reaches a thick sticky consistency which is then mixed with natural mineral and vegetable pigments to create a range of vivid reds yellows oranges greens and blues that characterise the Rogan art palette where the painter creates the design motifs by loading the Rogan pigment paste onto a flat metal stylus and then folding the painted motif in half while the pigment is still wet transferring the design onto the other half of the fabric creating a perfectly symmetrical mirror-image pattern that is the signature characteristic of authentic Rogan art where the Tree of Life motif is the most celebrated Rogan design featuring an elaborately detailed tree with spreading branches populated by brilliantly coloured birds flowers and foliage rendered in the distinctive Rogan technique producing textile panels of extraordinary visual complexity and artistic sophistication that have earned international recognition as one of India's most distinctive and culturally significant intangible cultural heritage art forms where the Rogan art tradition was historically practised exclusively by the Khatri families of Nirona village who passed the technique from father to son through generations maintaining strict artisanal secrecy regarding the castor oil pigment preparation and application techniques that produce the characteristic Rogan art quality and visual impact where the painstaking hand-executed Rogan painting process requires extraordinary manual dexterity and years of apprenticeship training to master the precise pigment transfer and folding technique that produces the perfectly symmetrical designs that distinguish authentic Rogan art from painted reproductions executed with conventional brush techniques that lack the distinctive mirror-image symmetry and castor oil pigment texture of genuine Rogan art textile panels.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Castor Oil Pigment QC & Hand-Painted Finish Standards</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The castor oil pigment quality control framework for Rogan art establishes a comprehensive quality assurance protocol for the unique Rogan pigment preparation and application process where the castor oil base must be boiled for a minimum duration of forty-eight hours at controlled temperature between one hundred eighty and two hundred degrees Celsius to achieve the required thick sticky paste consistency measured by the standardised viscosity test using a calibrated Ford cup flow meter where the acceptable viscosity range for Grade A Rogan pigment paste falls between twenty-five and thirty-five seconds confirming the oil has been properly polymerised to achieve the required adhesive and transfer properties that enable the distinctive Rogan half-kalam mirror-image transfer technique where the pigment paste must possess sufficient tackiness to adhere to the fabric surface upon transfer while maintaining the precise design outline fidelity without bleeding or spreading beyond the intended design boundaries where the pigment tack test measures the adhesive force using a standardised peel test method at five reference points across the painted surface confirming uniform pigment adhesion characteristics that ensure consistent transfer quality across the entire textile panel surface where the mineral pigment component of the Rogan pigment paste is subjected to particle size analysis using laser diffraction methodology confirming maximum particle size of fifteen microns for Grade A pigment ensuring smooth consistent pigment application without visible particle granularity or surface roughness that would compromise the visual quality of the finished Rogan art textile panel where the pigment colour consistency is verified through spectrophotometric colour measurement at three reference points confirming colour deviation within the Delta E tolerance of two units from the reference colour standard for each Rogan pigment colour confirming batch-to-batch colour consistency that is essential for maintaining the distinctive Rogan art visual quality across multiple textile panels produced from different pigment batches where the hand-painted finish quality assessment evaluates the design outline precision measured as deviation from the reference design template at ten reference points confirming outline accuracy within plus or minus one millimetre of the specified design coordinates verifying the exceptional manual precision of the Rogan artisan in executing the complex Tree of Life and other traditional Rogan design motifs using the distinctive half-kalam transfer technique that produces perfectly symmetrical mirror-image patterns.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Flat Pack Carton Packaging for Rogan Art Textile Transit</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">Flat pack corrugated carton packaging with acid-free tissue interleaving and silica gel desiccant protection has been specifically designed for the Rogan art textile panel logistics supply chain to protect the delicate hand-painted castor oil pigment surfaces the cotton or silk fabric substrates and the intricate symmetrical design motifs that characterise authentic Rogan art textile panels from the physical abrasion moisture exposure and mechanical compression hazards encountered during transit from the Kutch district artisan workshops in Nirona Bhuj and the surrounding villages of the Kutch district to domestic retail distribution points across Gujarat and the broader Indian market and international shipping destinations serving the growing global demand for authentic Rogan art textile panels and wall hangings where the Rogan art products require specialised packaging to prevent pigment surface abrasion that could damage the distinctive castor oil pigment texture and adhesion characteristics that distinguish genuine Rogan art textile panels from conventional painted textile products. The packaging specification utilises five-ply double-wall corrugated fibreboard cartons with minimum burst strength of fourteen kilopascals and minimum edge crush resistance of six kilonewtons per metre measured in accordance with IS 10641 corrugated board testing methodology ensuring the outer shipping container provides adequate mechanical protection against the stacking pressures and handling forces encountered during road transit from the Kutch production centres to the major retail distribution hubs of Ahmedabad Mumbai Delhi and the international air cargo terminals serving the export market for authentic Rogan art textile panels where the inner packaging configuration wraps each Rogan art textile panel individually in acid-free tissue paper with pH neutral value between six point five and seven point five measured in accordance with ISO 10716 permanent paper acidity testing methodology ensuring the tissue interleaving paper does not generate acidic degradation products that could cause castor oil pigment hydrolysis or cotton fibre oxidation during the extended transit and storage cycle where the Rogan art textile panel may remain in packaging for periods exceeding six months during international shipping to retail destinations in Europe North America and East Asia where the growing collector and institutional market for authentic Indian heritage art textile products has created significant demand for properly packaged Rogan art panels that maintain their pristine condition throughout the international distribution chain.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Climate Storage & Rogan Art Heritage Market Development</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">Climate-controlled storage facilities with precise temperature and humidity regulation have been established for the Rogan art textile panel supply chain to protect the castor oil pigment surfaces and cotton fabric substrates from the environmental degradation risks posed by the extreme arid climate of the Kutch district and the high-humidity conditions encountered during transit through coastal shipping routes to domestic and international market destinations where temperature fluctuations exceeding fifteen degrees Celsius and relative humidity variations exceeding thirty percent can cause castor oil pigment cracking pigment adhesion failure and cotton fibre dimensional instability that would irreversibly compromise the visual quality and material integrity of authentic Rogan art textile panels where the climate-controlled storage specification maintains temperature within the range of eighteen to twenty-five degrees Celsius with relative humidity between forty-five and fifty-five percent measured by calibrated digital sensors with continuous monitoring and alarm thresholds that alert warehouse personnel when environmental conditions approach the tolerance boundaries where the storage facility employs HEPA-filtered air circulation systems preventing airborne particulate contamination that could abrade the delicate castor oil pigment surfaces of stored Rogan art panels and UV-filtered lighting preventing photo-oxidative degradation of the natural mineral pigments that provide the distinctive vivid colour palette of Rogan art where the red and yellow mineral pigments are particularly susceptible to UV-induced fading that would diminish the characteristic visual impact of authentic Rogan art textile panels over extended storage periods. The Rogan art heritage market development initiative led by the Gujarat State Khadi and Village Industries Board in collaboration with the Nirona Village Rogan Art Cooperative and the National Handicrafts and Handlooms Museum has established a comprehensive market access platform connecting the remaining active Rogan artisan families with institutional buyers including the Gujarat State Emporium chain national craft museums and galleries premium interior design firms and international heritage art collectors where the GI Gujarat Rogan Art Mark provides the cultural provenance and authenticity assurance framework needed to establish premium market positioning for authentic Rogan art textile panels in the growing global market for intangible cultural heritage art products where the extraordinary rarity and technical sophistication of the Rogan art tradition with fewer than ten active artisan practitioners worldwide has created exceptional collector value and cultural significance that positions authentic Rogan art panels as among the most sought-after traditional Indian textile art products in the international heritage art and sustainable craft market.</p></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}



