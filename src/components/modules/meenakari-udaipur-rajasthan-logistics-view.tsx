import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#c2410c', '#ea580c', '#f97316', '#fb923c', '#fdba74', '#9a3412', '#7c2d12', '#fff7ed']
const PRODUCTS = ['Meenakari Peacock Pendant', 'Meenakari Elephant figurine', 'Meenakari Lotus Bangle Set', 'Meenakari Sun motif Box', 'Meenakari Floral Earrings', 'Meenakadi Kundan Necklace', 'Meenakari Bird Panel', 'Meenakari Royal Bowl']
const ARTISANS = ['Udaipur Meenakari Guild RJ', 'Jodhpur Enamel House RJ', 'Jaipur Heritage Enamellers RJ', 'Bikaner Artisan Collective RJ', 'Nathdwara Craft Workshop RJ', 'Kishangarh Meenakari Cluster RJ', 'Bhilwara Enamel Atelier RJ', 'Ajmer Traditional Guild RJ']
const STATUSES = ['GI Rajasthan Meenakari Mark', 'Enamel Firing Temp QC', 'Gold Surface Prep Check', 'Colour Fusion Adhesion Test', 'Kundan Setting Precision QC', 'Hand Engraving Detail Audit']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-orange-100 text-orange-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="w-24 h-2 bg-orange-200 rounded-full overflow-hidden"><div className="h-full bg-orange-700 rounded-full" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ label, value, size = 80 }: { label: string; value: number; size?: number }) => {
  const r = (size - 12) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#fff7ed" strokeWidth="6" />
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
    id: `MNK-${String(offset + i + 1).padStart(4, '0')}`,
    artisan: ARTISANS[(offset + i) % ARTISANS.length], design: PRODUCTS[(offset + i) % PRODUCTS.length],
    status: STATUSES[(offset + i) % STATUSES.length], qty: ri(1, 15, ((offset + i) * 19) % 15) + 1,
    cost: ri(8000, 95000, ((offset + i) * 11307) % 87000) + 8000,
    date: new Date(2024, ((offset + i) % 12), ri(1, 28, (offset + i) % 28)).toISOString().slice(0, 10),
  }))

const meenakarirecords = [
  { id: 'MNK-0001', artisan: 'Udaipur Meenakari Guild RJ', design: 'Meenakari Peacock Pendant', status: 'GI Rajasthan Meenakari Mark', qty: 5, cost: 92000, date: '2024-01-12' },
  { id: 'MNK-0002', artisan: 'Jodhpur Enamel House RJ', design: 'Meenakari Elephant figurine', status: 'Enamel Firing Temp QC', qty: 3, cost: 85000, date: '2024-01-25' },
  { id: 'MNK-0003', artisan: 'Jaipur Heritage Enamellers RJ', design: 'Meenakari Lotus Bangle Set', status: 'Gold Surface Prep Check', qty: 8, cost: 72000, date: '2024-02-08' },
  { id: 'MNK-0004', artisan: 'Bikaner Artisan Collective RJ', design: 'Meenakari Sun motif Box', status: 'Colour Fusion Adhesion Test', qty: 4, cost: 95000, date: '2024-02-20' },
  { id: 'MNK-0005', artisan: 'Nathdwara Craft Workshop RJ', design: 'Meenakari Floral Earrings', status: 'Kundan Setting Precision QC', qty: 10, cost: 28000, date: '2024-03-05' },
  { id: 'MNK-0006', artisan: 'Kishangarh Meenakari Cluster RJ', design: 'Meenakadi Kundan Necklace', status: 'Hand Engraving Detail Audit', qty: 2, cost: 95000, date: '2024-03-18' },
  { id: 'MNK-0007', artisan: 'Bhilwara Enamel Atelier RJ', design: 'Meenakari Bird Panel', status: 'GI Rajasthan Meenakari Mark', qty: 6, cost: 58000, date: '2024-04-01' },
  { id: 'MNK-0008', artisan: 'Ajmer Traditional Guild RJ', design: 'Meenakari Royal Bowl', status: 'Enamel Firing Temp QC', qty: 3, cost: 88000, date: '2024-04-14' },
  { id: 'MNK-0009', artisan: 'Udaipur Meenakari Guild RJ', design: 'Meenakari Peacock Pendant', status: 'Gold Surface Prep Check', qty: 7, cost: 42000, date: '2024-04-27' },
  { id: 'MNK-0010', artisan: 'Jodhpur Enamel House RJ', design: 'Meenakari Elephant figurine', status: 'Colour Fusion Adhesion Test', qty: 4, cost: 76000, date: '2024-05-10' },
  { id: 'MNK-0011', artisan: 'Jaipur Heritage Enamellers RJ', design: 'Meenakari Lotus Bangle Set', status: 'Kundan Setting Precision QC', qty: 9, cost: 35000, date: '2024-05-23' },
  { id: 'MNK-0012', artisan: 'Bikaner Artisan Collective RJ', design: 'Meenakari Sun motif Box', status: 'Hand Engraving Detail Audit', qty: 5, cost: 64000, date: '2024-06-05' },
  { id: 'MNK-0013', artisan: 'Nathdwara Craft Workshop RJ', design: 'Meenakari Floral Earrings', status: 'GI Rajasthan Meenakari Mark', qty: 3, cost: 91000, date: '2024-06-18' },
  { id: 'MNK-0014', artisan: 'Kishangarh Meenakari Cluster RJ', design: 'Meenakadi Kundan Necklace', status: 'Enamel Firing Temp QC', qty: 8, cost: 48000, date: '2024-07-01' },
  { id: 'MNK-0015', artisan: 'Bhilwara Enamel Atelier RJ', design: 'Meenakari Bird Panel', status: 'Gold Surface Prep Check', qty: 4, cost: 82000, date: '2024-07-14' },
  { id: 'MNK-0016', artisan: 'Ajmer Traditional Guild RJ', design: 'Meenakari Royal Bowl', status: 'Colour Fusion Adhesion Test', qty: 6, cost: 55000, date: '2024-07-26' },
  { id: 'MNK-0017', artisan: 'Udaipur Meenakari Guild RJ', design: 'Meenakari Peacock Pendant', status: 'Kundan Setting Precision QC', qty: 2, cost: 95000, date: '2024-08-08' },
  { id: 'MNK-0018', artisan: 'Jodhpur Enamel House RJ', design: 'Meenakari Elephant figurine', status: 'Hand Engraving Detail Audit', qty: 7, cost: 38000, date: '2024-08-20' },
  { id: 'MNK-0019', artisan: 'Jaipur Heritage Enamellers RJ', design: 'Meenakari Lotus Bangle Set', status: 'GI Rajasthan Meenakari Mark', qty: 5, cost: 70000, date: '2024-09-02' },
  { id: 'MNK-0020', artisan: 'Bikaner Artisan Collective RJ', design: 'Meenakari Sun motif Box', status: 'Enamel Firing Temp QC', qty: 3, cost: 86000, date: '2024-09-14' },
]

export default function MeenakariUdaipurRajasthanLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})

  const allRecords = [...meenakarirecords, ...genRecords(21), ...genRecords(41)]

  const filteredRecords = useMemo(() => {
    if (!searchQuery && Object.keys(activeFilters).every(k => !activeFilters[k].length)) return allRecords
    const sq = searchQuery.toLowerCase()
    return allRecords.filter(r => { if (sq && !r.id.toLowerCase().includes(sq) && !r.design.toLowerCase().includes(sq)) return false; return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string)); })
  }, [searchQuery, activeFilters, allRecords])

  const filterGroups = [
    { key: 'design', label: 'Design', options: PRODUCTS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.design === p).length })) },
    { key: 'artisan', label: 'Artisan', options: ARTISANS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.artisan === p).length })) },
  ]

  const trendData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m, i) => ({ month: m, shipments: ri(4, 20, allRecords.length * 0.10 + i * 3) }))
  const artisanChart = ARTISANS.map(p => ({ name: p.split(' ').slice(0, 2).join(' '), volume: allRecords.filter(r => r.artisan === p).reduce((s, r) => s + r.qty, 0) }))
  const statusPie = STATUSES.map(s => ({ name: s, value: allRecords.filter(r => r.status === s).length }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="mnk-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Meenakari Art' }]} />
      <PageHeader title="Meenakari Udaipur Rajasthan Logistics" description="Rajasthan Meenakari vitreous enamel art supply chain with GI Rajasthan Meenakari Mark certification, enamel firing temperature quality control, gold surface preparation verification, colour fusion adhesion testing, kundan setting precision inspection, and hand engraving detail audit across 8 Meenakari artisan clusters in Udaipur Jaipur Jodhpur and Kishangarh" />
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="bg-orange-100">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <KpiTile label="Total Shipments" value={allRecords.length} />
            <KpiTile label="Active Designs" value={PRODUCTS.length} />
            <KpiTile label="Artisan Guilds" value={ARTISANS.length} />
            <KpiTile label="Avg Cost" value={`₹${Math.round(allRecords.reduce((s, r) => s + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>
          <div className="grid grid-cols-6 gap-4">
            <HealthRing label="GI Tag" value={94} />
            <HealthRing label="Firing" value={87} />
            <HealthRing label="Surface" value={92} />
            <HealthRing label="Fusion" value={89} />
            <HealthRing label="Kundan" value={95} />
            <HealthRing label="Engraving" value={91} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Meenakari Families" value="12 Active" />
            <ValueTile label="Tradition" value="Since 1550 AD" />
            <ValueTile label="Export Markets" value="8 Countries" />
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
            placeholder="Search Meenakari art shipments..."
          />
          <div className="rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-orange-100">
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
                  <tr key={record.id} className="border-t hover:bg-orange-50/50">
                    <td className="p-3 font-mono text-xs">{record.id}</td>
                    <td className="p-3"><ProductBadge name={record.design} /></td>
                    <td className="p-3">{record.artisan}</td>
                    <td className="p-3"><StatusBadge status={record.status} /></td>
                    <td className="p-3">{record.qty} {['pendants', 'figurines', 'bangles', 'boxes'][parseInt(record.id.slice(4)) % 4]}</td>
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
              <CardHeader><CardTitle>Meenakari Art — Rajasthani Vitreous Enamel on Precious Metal Heritage</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">Meenakari art represents one of the most iconic and technically sophisticated vitreous enamel art traditions of India having originated in the royal courts of Rajasthan approximately five hundred years ago during the reign of Raja Man Singh I of Amber in the sixteenth century where the Persian-inspired art of minakari or meenakari meaning the art of decorating metal with coloured enamels was introduced to the Rajput royal workshops by skilled Persian craftsmen who were invited to the Amber Fort workshops near Jaipur by the Mughal court and who subsequently trained the local Rajasthani metalworkers in the intricate technique of fusing powdered coloured glass enamel onto gold and silver metal surfaces at precise firing temperatures between seven hundred and eight hundred degrees Celsius in a specialised charcoal-fired kiln called the bhatti where the enamelling process begins with the preparation of the gold or silver base metal article which is first hand-engraved with intricate floral geometric or figurative designs using fine steel chasing tools creating grooves and depressions in the metal surface that serve as reservoirs for the enamel powder where the engraved design is then filled with finely ground enamel powder mixed with natural gum arabic binder in a precise sequence following the traditional meenakari colour application order where the red enamel called gulaal is fired first as it requires the highest firing temperature followed by green then blue then yellow then white and finally black enamel colours where each colour requires a separate firing cycle in the bhatti kiln with careful temperature control to ensure proper glass fusion without over-firing that would cause colour discolouration or under-firing that would result in dull opaque enamel surfaces where the distinctive meenakari aesthetic is characterised by vivid saturated enamel colours forming intricate floral motifs including lotus patterns peacock designs paisley scrolls and geometric jali patterns set against the warm golden surface of the base metal creating a vibrant painterly quality that distinguishes Rajasthani meenakari from the simpler enamel work traditions of other Indian regions where the Udaipur meenakari tradition is particularly renowned for its champleve technique on silver where the Jaipur meenakari tradition is famous for its intricate gold Kundan-meena jewellery combining enamel work with gemstone setting in a single masterpiece and where the Jodhpur tradition specialises in bold geometric enamelled designs on silver tableware and decorative objects.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Enamel Firing Temperature QC & Gold Surface Preparation Standards</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The enamel firing temperature quality control and gold surface preparation verification protocols for Meenakari art establish the primary technical quality assurance framework for the traditional Rajasthani vitreous enamel art process that determines the colour brilliance adhesion durability and surface quality of the finished meenakari product where the enamel firing temperature test monitors the kiln internal temperature at each stage of the multi-cycle enamel application process using calibrated optical pyrometers confirming the bhatti kiln temperature reaches the optimal firing range of seven hundred twenty to seven hundred eighty degrees Celsius for red enamel which requires the highest firing temperature followed by six hundred eighty to seven hundred twenty degrees for green enamel six hundred fifty to six hundred eighty degrees for blue enamel six hundred to six hundred fifty degrees for yellow enamel five hundred eighty to six hundred degrees for white enamel and five hundred forty to five hundred eighty degrees for black enamel where each colour firing cycle is maintained at the target temperature for three to five minutes to achieve complete glass fusion producing the characteristic glossy translucent enamel surface that defines premium quality meenakari art where under-firing produces a matte dull enamel surface with poor colour saturation and inadequate metal adhesion that may chip or flake during normal handling while over-firing causes enamel bubbling colour shifting and cracking that destroys the visual quality of the meenakari design where the gold surface preparation test evaluates the cleanliness and micro-texture of the gold base metal before enamel application using visual inspection under ten-times magnification confirming the engraved grooves are free of polishing compound residue metal dust oils and organic contaminants that would prevent proper enamel adhesion and colour fusion where the gold degreasing protocol requires sequential cleaning in an alkaline solution followed by an acid pickle bath followed by distilled water rinse and finally ethanol dehydration ensuring the gold surface achieves a water-break-free condition indicating complete cleanliness ready for enamel powder application where the surface roughness test using a profilometer confirms micro-roughness values between zero point five and two point zero micrometres Ra providing optimal mechanical anchoring for the fused enamel glass layer without excessive surface roughness that would trap air bubbles during the firing process producing unwanted pinholes and surface defects in the finished enamel coating.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Colour Fusion Adhesion Testing & Kundan Setting Precision Verification</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The colour fusion adhesion testing and Kundan setting precision verification protocols ensure the physical durability and gem-setting quality of authentic Meenakari art products where the colour fusion adhesion test evaluates the bond strength between the vitreous enamel layer and the gold or silver base metal substrate using the standard cross-hatch adhesion test method where a lattice pattern of six parallel cuts in each direction is made through the enamel surface to the base metal using a calibrated blade and the adhesion quality is assessed by comparing the amount of enamel dislodged from the grid area against the standardised five-point adhesion rating scale where a rating of five indicates zero enamel detachment representing perfect fusion adhesion between the enamel glass and the metal substrate and a rating of three or above is the minimum acceptable standard for GI-certified Rajasthani Meenakari art products ensuring the enamel colours remain firmly bonded to the metal surface throughout the expected product lifetime of twenty to thirty years without chipping flaking or delamination during normal wearing handling and cleaning conditions where the thermal shock adhesion test subjects the enamelled sample to three rapid temperature cycles between twenty degrees Celsius room temperature and one hundred degrees Celsius hot water immersion measuring any enamel cracking or adhesion failure after the thermal cycling confirming the enamel-to-metal bond can withstand real-world temperature variations without degradation where the Kundan setting precision test evaluates the accuracy and security of gemstone setting in Kundan-meena jewellery pieces that combine meenakari enamel work with traditional Kundan gemstone setting using laser measurement confirming each gemstone is positioned within plus or minus zero point two millimetres of the design specification and the surrounding gold foil bezel contacts the gemstone girdle uniformly on all sides providing secure setting without visible gaps misalignment or asymmetry that would compromise both the aesthetic quality and structural integrity of the Kundan-meena piece where the setting tension test applies a calibrated lateral force of two Newtons to each set gemstone confirming zero movement or rotation in the Kundan setting ensuring the gemstones remain permanently secured in their designated positions.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Hand Engraving Detail Audit & Meenakari Heritage Market Expansion</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The hand engraving detail audit and Meenakari heritage market expansion framework provides the artistic quality assurance and commercial market infrastructure for the Meenakari art supply chain ensuring that all GI-certified Meenakari art products demonstrate the extraordinary hand engraving precision and enamel artistry that defines this royal Rajasthani craft tradition while connecting the twelve remaining active Meenakari artisan families across Udaipur Jaipur Jodhpur and Kishangarh with growing institutional and international collector market demand for authentic Rajasthani enamel art jewellery and decorative objects where the hand engraving detail audit evaluates the precision and artistic quality of the hand-chased engraving patterns on the gold or silver base metal using digital microscopy at thirty-times magnification confirming clean crisp engraved lines without ragged edges chatter marks or inconsistent depth that would indicate inadequate craftsman skill or tool quality verifying line width consistency within plus or minus zero point two millimetres for fine floral detail lines and plus or minus zero point five millimetres for bold contour lines and groove depth consistency within plus or minus zero point one millimetres ensuring the engraved design provides a precise uniform reservoir for the enamel powder that produces consistent colour fill and smooth surface quality across the entire meenakari design where the engraving pattern fidelity test compares the completed engraving against the approved design template confirming all design elements are present correctly proportioned and positioned without omission distortion or artistic deviation from the master pattern ensuring batch-to-batch design consistency across production runs from the same artisan workshop where the Meenakari heritage market expansion initiative led by the Rajasthan Handicrafts Promotion Council in collaboration with the Gem and Jewellery Export Promotion Council and the Rajasthan State Government Department of Art and Culture has established institutional procurement and export promotion programmes connecting the twelve active Meenakari artisan guilds with premium domestic jewellery retail chains including Tanishq Kalyan and Senco Gold plus international luxury brands and museum shops with projected annual export revenue growth of fifteen percent driven by expanding global recognition of Meenakari art as one of the finest vitreous enamel art traditions in the world.</p></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}



