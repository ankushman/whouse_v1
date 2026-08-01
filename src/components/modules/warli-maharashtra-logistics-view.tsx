import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#78350f', '#92400e', '#b45309', '#d97706', '#f59e0b', '#451a03', '#78350f', '#fef3c7']
const PRODUCTS = ['Warli Harvest Dance Panel', 'Warli Wedding Procession Art', 'Warli Tree of Life Mural', 'Warli Fishing Scene Canvas', 'Warli Tarpa Dance Scroll', 'Warli Village Festival Panel', 'Warli Animal Herd Mural', 'Warli Hunting Scene Painting']
const ARTISANS = ['Warli Adivasi Art Cooperative MH', 'Dahanu Forest Tribe Artists MH', 'Jawhar Warli Heritage Guild MH', 'Palghar Tribal Painters MH', 'Mokhada Warli Village Cluster MH', 'Talasari Adivasi Society MH', 'Vikramgad Warli Collective MH', 'Wada Warli Traditional Artists MH']
const STATUSES = ['GI Maharashtra Warli Mark', 'Rice Paste Pigment QC', 'Mud Wall Adhesion QC', 'Flat Cardboard Box Pack', 'Dry Room Ambient Storage', 'Warli Pattern Symmetry Test']

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
    id: `WAR-${String(offset + i + 1).padStart(4, '0')}`,
    painter: ARTISANS[(offset + i) % ARTISANS.length], ware: PRODUCTS[(offset + i) % PRODUCTS.length],
    status: STATUSES[(offset + i) % STATUSES.length], qty: ri(1, 20, ((offset + i) * 19) % 20) + 1,
    cost: ri(4000, 52000, ((offset + i) * 10707) % 48000) + 4000,
    date: new Date(2024, ((offset + i) % 12), ri(1, 28, (offset + i) % 28)).toISOString().slice(0, 10),
  }))

const warlirecords = [
  { id: 'WAR-0001', painter: 'Warli Adivasi Art Cooperative MH', ware: 'Warli Harvest Dance Panel', status: 'GI Maharashtra Warli Mark', qty: 3, cost: 48000, date: '2024-01-15' },
  { id: 'WAR-0002', painter: 'Dahanu Forest Tribe Artists MH', ware: 'Warli Wedding Procession Art', status: 'Rice Paste Pigment QC', qty: 5, cost: 36000, date: '2024-01-28' },
  { id: 'WAR-0003', painter: 'Jawhar Warli Heritage Guild MH', ware: 'Warli Tree of Life Mural', status: 'Mud Wall Adhesion QC', qty: 2, cost: 52000, date: '2024-02-10' },
  { id: 'WAR-0004', painter: 'Palghar Tribal Painters MH', ware: 'Warli Fishing Scene Canvas', status: 'Flat Cardboard Box Pack', qty: 7, cost: 22000, date: '2024-02-22' },
  { id: 'WAR-0005', painter: 'Mokhada Warli Village Cluster MH', ware: 'Warli Tarpa Dance Scroll', status: 'Dry Room Ambient Storage', qty: 4, cost: 44000, date: '2024-03-08' },
  { id: 'WAR-0006', painter: 'Talasari Adivasi Society MH', ware: 'Warli Village Festival Panel', status: 'Warli Pattern Symmetry Test', qty: 6, cost: 28000, date: '2024-03-20' },
  { id: 'WAR-0007', painter: 'Vikramgad Warli Collective MH', ware: 'Warli Animal Herd Mural', status: 'GI Maharashtra Warli Mark', qty: 2, cost: 50000, date: '2024-04-03' },
  { id: 'WAR-0008', painter: 'Wada Warli Traditional Artists MH', ware: 'Warli Hunting Scene Painting', status: 'Rice Paste Pigment QC', qty: 8, cost: 16000, date: '2024-04-16' },
  { id: 'WAR-0009', painter: 'Warli Adivasi Art Cooperative MH', ware: 'Warli Wedding Procession Art', status: 'Mud Wall Adhesion QC', qty: 4, cost: 40000, date: '2024-04-28' },
  { id: 'WAR-0010', painter: 'Dahanu Forest Tribe Artists MH', ware: 'Warli Harvest Dance Panel', status: 'Flat Cardboard Box Pack', qty: 3, cost: 48000, date: '2024-05-10' },
  { id: 'WAR-0011', painter: 'Jawhar Warli Heritage Guild MH', ware: 'Warli Tree of Life Mural', status: 'Dry Room Ambient Storage', qty: 5, cost: 32000, date: '2024-05-23' },
  { id: 'WAR-0012', painter: 'Palghar Tribal Painters MH', ware: 'Warli Fishing Scene Canvas', status: 'Warli Pattern Symmetry Test', qty: 6, cost: 20000, date: '2024-06-05' },
  { id: 'WAR-0013', painter: 'Mokhada Warli Village Cluster MH', ware: 'Warli Tarpa Dance Scroll', status: 'GI Maharashtra Warli Mark', qty: 3, cost: 46000, date: '2024-06-18' },
  { id: 'WAR-0014', painter: 'Talasari Adivasi Society MH', ware: 'Warli Village Festival Panel', status: 'Rice Paste Pigment QC', qty: 7, cost: 24000, date: '2024-07-01' },
  { id: 'WAR-0015', painter: 'Vikramgad Warli Collective MH', ware: 'Warli Animal Herd Mural', status: 'Mud Wall Adhesion QC', qty: 2, cost: 52000, date: '2024-07-14' },
  { id: 'WAR-0016', painter: 'Wada Warli Traditional Artists MH', ware: 'Warli Hunting Scene Painting', status: 'Flat Cardboard Box Pack', qty: 10, cost: 12000, date: '2024-07-26' },
  { id: 'WAR-0017', painter: 'Warli Adivasi Art Cooperative MH', ware: 'Warli Harvest Dance Panel', status: 'Dry Room Ambient Storage', qty: 4, cost: 42000, date: '2024-08-08' },
  { id: 'WAR-0018', painter: 'Dahanu Forest Tribe Artists MH', ware: 'Warli Wedding Procession Art', status: 'Warli Pattern Symmetry Test', qty: 5, cost: 30000, date: '2024-08-20' },
  { id: 'WAR-0019', painter: 'Jawhar Warli Heritage Guild MH', ware: 'Warli Tree of Life Mural', status: 'GI Maharashtra Warli Mark', qty: 3, cost: 50000, date: '2024-09-02' },
  { id: 'WAR-0020', painter: 'Palghar Tribal Painters MH', ware: 'Warli Fishing Scene Canvas', status: 'Rice Paste Pigment QC', qty: 8, cost: 18000, date: '2024-09-14' },
]

export default function WarliMaharashtraLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})

  const allRecords = [...warlirecords, ...genRecords(21), ...genRecords(41)]

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
    <div className="war-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Warli Maharashtra' }]} />
      <PageHeader title="Warli Maharashtra Logistics" description="Maharashtra Warli tribal art supply chain with GI Maharashtra Warli Mark, rice paste pigment quality control, mud wall adhesion verification, flat cardboard box packaging, dry room ambient storage, and Warli pattern symmetry testing across 8 tribal artisan clusters in Dahanu, Jawhar, and Palghar" />
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
            <KpiTile label="Tribal Clusters" value={ARTISANS.length} />
            <KpiTile label="Avg Cost" value={`₹${Math.round(allRecords.reduce((s, r) => s + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>
          <div className="grid grid-cols-6 gap-4">
            <HealthRing label="GI Tag" value={88} />
            <HealthRing label="Pigment" value={82} />
            <HealthRing label="Adhesion" value={79} />
            <HealthRing label="Pack" value={85} />
            <HealthRing label="Storage" value={90} />
            <HealthRing label="Pattern" value={86} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Warli Families" value="350+ Active" />
            <ValueTile label="Tradition" value="Since 2500 BC" />
            <ValueTile label="Export Markets" value="5 Countries" />
            <ValueTile label="Annual Revenue" value="₹1.2 Crore" />
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
            placeholder="Search Warli art shipments..."
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
                    <td className="p-3">{record.qty} {['pcs', 'panels', 'murals', 'scrolls'][parseInt(record.id.slice(4)) % 4]}</td>
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
              <CardHeader><CardTitle>Tribal Volume</CardTitle></CardHeader>
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
              <CardHeader><CardTitle>Warli Art — 2500 BC Adivasi Tribal Wall Painting Heritage</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">Warli art represents one of the most ancient and culturally significant forms of tribal wall painting in India having been continuously practised for over four thousand five hundred years by the Warli Adivasi tribal communities inhabiting the mountainous forest regions of the northern Sahyadri Range in the Palghar district of Maharashtra where the Warli tribal artists create geometrically stylised narrative paintings depicting scenes of daily tribal life including the harvest dance wedding processions hunting expeditions fishing activities and the sacred Tarpa dance performed around the traditional Tarpa trumpet instrument using a distinctive painting technique that employs only white rice paste pigment applied on mud-brown earth-toned wall surfaces creating striking monochrome compositions with remarkable visual rhythm and narrative complexity that convey the profound spiritual connection between the Warli tribal community and the natural environment that sustains their traditional way of life where the Warli painting tradition is believed to predate the Indus Valley civilisation with archaeological evidence suggesting the geometric patterns and circle-triangle-square motifs characteristic of Warli art have been used by the indigenous tribal communities of the Sahyadri region since approximately two thousand five hundred BCE making Warli art one of the oldest continuously practised art traditions in human history where the Warli painting technique uses a bamboo stick chewed at the end to create a primitive brush that applies the white rice paste pigment prepared by grinding soaked rice mixed with water and gum Arabic to achieve the required painting consistency onto the prepared mud wall surface that has been coated with a mixture of cow dung and red mud termeric creating the characteristic brown background against which the white Warli figures and patterns create their distinctive monochrome visual impact where the fundamental Warli artistic vocabulary consists of geometric shapes including the circle representing the sun and moon the triangle representing mountains and trees and the square representing the sacred enclosure or human habitation from which all Warli narrative compositions are constructed through intricate combinations and arrangements of these three basic geometric forms creating complex scenes of tribal life that convey both the mundane activities of daily existence and the sacred rituals and ceremonies that define the spiritual and cultural identity of the Warli Adivasi community where the Warli painting tradition was traditionally practised exclusively by women of the Warli tribe who created these sacred paintings on the mud walls of their homes during the wedding season and harvest festivals as rituals intended to invoke divine blessings for fertility prosperity and protection from evil spirits establishing the Warli art form as an integral component of the tribal cultural and spiritual practice rather than merely a decorative art tradition.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Rice Paste Pigment QC & Mud Wall Adhesion Standards</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The rice paste pigment quality control framework for Warli art establishes a comprehensive testing protocol for the traditional white rice paste pigment used exclusively in authentic Warli tribal wall paintings where the pigment preparation begins with soaking selected varieties of short-grain white rice for a minimum of twelve hours in clean water followed by hand-grinding the soaked rice on a traditional stone grinding surface to achieve a smooth homogeneous paste consistency measured by the standardised viscosity test using a Ford cup flow meter where the acceptable viscosity range for Grade A Warli rice paste pigment falls between thirty and forty-five seconds confirming the paste has been ground to the correct fineness and moisture content to produce clean precise lines when applied with the traditional bamboo stick brush onto the prepared mud wall surface where the pigment brightness test measures the reflectance value of the dried rice paste pigment using a calibrated spectrophotometer confirming minimum reflectance of eighty-five percent at five hundred and fifty nanometre wavelength confirming the white pigment provides sufficient contrast against the characteristic mud-brown background surface of authentic Warli paintings where the pigment adhesion test evaluates the bond strength between the dried rice paste pigment and the mud wall surface using a standardised tape peel test method measuring the percentage of pigment removed by adhesive tape applied at five reference points across the painted surface confirming minimum adhesion retention of ninety-five percent verifying the rice paste pigment has formed a durable bond with the mud wall substrate that will resist flaking and deterioration during transit and display of Warli art panels where the mud wall adhesion quality control protocol requires the prepared painting surface to meet minimum surface roughness of grade three on the ASTM surface profile comparison coupons confirming sufficient surface texture for the rice paste pigment to mechanically anchor to the mud wall surface without sliding or running during the painting process where the mud wall preparation involves applying three consecutive coats of cow dung and red mud termeric mixture at twenty-four hour intervals between coats allowing each coat to dry completely before the next application creating a smooth uniform brown painting surface with pH value between six point five and seven point five measured in accordance with ISO 10716 methodology ensuring the mud wall surface chemistry does not cause rice paste pigment degradation or colour yellowing over time where the prepared mud wall panels for commercial Warli art products are mounted on lightweight rigid backing boards using acid-free adhesive providing a stable substrate for the Warli painting that can be safely transported without risk of mud wall cracking or pigment delamination during the logistics supply chain from the tribal artisan village workshops in Dahanu Jawhar and Palghar to urban retail and gallery destinations across India and international markets.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Flat Cardboard Box Packaging for Warli Art Panel Transit</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">Flat cardboard box packaging with foam corner inserts and acid-free tissue interleaving has been specifically developed for the Warli tribal art panel supply chain to protect the delicate rice paste pigment surfaces and fragile mud wall substrates from the physical abrasion impact damage moisture exposure and vibration hazards encountered during transit from the tribal artisan village workshops in the Sahyadri mountain region of Palghar district to urban retail distribution points in Mumbai Pune Delhi and international shipping destinations serving the growing global demand for authentic Warli tribal art products where the packaging specification utilises five-ply double-wall corrugated fibreboard cartons with minimum burst strength of fourteen kilopascals and minimum edge crush resistance of six kilonewtons per metre measured in accordance with IS 10641 corrugated board testing methodology ensuring the outer shipping container provides adequate mechanical protection against the stacking pressures and handling forces encountered during road transit from the mountainous tribal village production centres to major urban retail distribution hubs where the inner packaging configuration uses custom-cut polyethylene foam corner inserts at all eight corners of each Warli art panel preventing direct contact between the painted surface and the cardboard container walls eliminating the risk of pigment surface abrasion from cardboard fibres and vibration-induced friction damage during transit on the winding mountain roads connecting the tribal village workshops to the national highway network where each Warli art panel is individually wrapped in acid-free tissue paper with pH neutral value between six point five and seven point five providing a protective interleaving layer that prevents any chemical interaction between the packaging materials and the rice paste pigment surface that could cause pigment discoloration or degradation during extended transit periods where the packaging includes a silica gel desiccant sachet providing moisture absorption capacity of at least five grams per cubic metre of packaging volume maintaining relative humidity below fifty-five percent within the sealed packaging container preventing ambient moisture condensation that could cause the rice paste pigment to soften or the mud wall substrate to develop mould growth during transit through high-humidity coastal regions where the complete packaging assembly is sealed with pressure-sensitive tape bearing the GI Maharashtra Warli Mark certification logo and handling instructions in Hindi English and Marathi languages ensuring proper handling throughout the distribution chain from the tribal artisan village production centres to urban retail and international gallery destinations serving the growing collector and institutional market for authentic Warli tribal art products.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Dry Room Storage & Warli Heritage Market Development</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">Dry room ambient storage facilities with controlled temperature and humidity management have been established for the Warli tribal art panel supply chain to protect the rice paste pigment surfaces and mud wall substrates from the environmental degradation risks posed by the high-humidity monsoon climate of the Sahyadri coastal region where relative humidity frequently exceeds eighty-five percent during the June through September monsoon season creating conditions that can cause rice paste pigment softening mud wall substrate mould growth and insect infestation by paper mites and silverfish that would irreversibly compromise the visual quality and structural integrity of authentic Warli tribal art panels where the dry room storage specification maintains temperature within the range of twenty to twenty-eight degrees Celsius with relative humidity between forty and fifty-five percent measured by calibrated digital sensors with continuous monitoring and automated dehumidification activation when humidity exceeds the fifty-five percent threshold ensuring consistent storage conditions throughout the annual monsoon cycle without requiring air-conditioned climate control that would be economically impractical for village-level storage facilities where the storage room construction utilises moisture-resistant plastered walls with damp-proof course membrane at foundation level and louvered ventilation openings with insect mesh screens preventing moisture ingress and pest access while enabling natural air circulation that assists the dehumidification system in maintaining the required storage environment where the stored Warli art panels are arranged vertically on padded shelving with each panel separated by acid-free tissue interleaving preventing pigment-to-pigment contact that could cause transfer or abrasion damage during storage retrieval and handling operations. The Warli heritage market development initiative led by the Maharashtra State Tribal Development Department in collaboration with the Warli Adivasi Art Cooperative and the Tribal Welfare Commissioner has established a comprehensive artisan empowerment programme connecting over three hundred and fifty active Warli tribal artist families with institutional buyers including the Maharashtra State Emporium national craft museums tribal art galleries and international fair trade organisations where the GI Maharashtra Warli Mark provides the cultural provenance and authenticity assurance framework essential for establishing premium market positioning for authentic Warli tribal art products in the growing global market for indigenous and tribal art where the extraordinary antiquity of the Warli art tradition with its four thousand five hundred year heritage spanning from the prehistoric rock art origins through to contemporary tribal art practice has created exceptional cultural significance and collector value that positions authentic Warli art panels as among the most culturally important tribal art products in the global indigenous art and sustainable heritage craft market.</p></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}



