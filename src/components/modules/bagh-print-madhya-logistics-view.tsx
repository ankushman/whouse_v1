import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#b45309', '#d97706', '#f59e0b', '#fbbf24', '#fde68a', '#92400e', '#78350f', '#fef3c7']
const PRODUCTS = ['Bagh Parrot Floral Panel', 'Bagh Mango Tree Panel', 'Bagh Jungle Forest Print', 'Bagh Lotus Pond Scroll', 'Bagh Peacock Dance Panel', 'Bagh Vine Trellis Mural', 'Bagh Sunset Garden Scroll', 'Bagh Tribal Animal Panel']
const ARTISANS = ['Bagh Print Artisan Cooperative MP', 'Dhar Bagh Heritage Guild MP', 'Bagh Udyog Village Cluster MP', 'Jhabua Block Printer Society MP', 'Alirajpur Traditional Printers MP', 'Dhar Handloom Print Collective MP', 'Mandla Bagh Artisans Guild MP', 'Kukshi Bagh Block Printers MP']
const STATUSES = ['GI Madhya Pradesh Bagh Mark', 'Alizarin Red Mordant QC', 'Indigo Vat Dye Fastness', 'Hand Block Impression Depth', 'Fabric Shrinkage Verify', 'Natural Dye Pigment Audit']

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
    id: `BGH-${String(offset + i + 1).padStart(4, '0')}`,
    printer: ARTISANS[(offset + i) % ARTISANS.length], design: PRODUCTS[(offset + i) % PRODUCTS.length],
    status: STATUSES[(offset + i) % STATUSES.length], qty: ri(1, 20, ((offset + i) * 19) % 20) + 1,
    cost: ri(3200, 44000, ((offset + i) * 10707) % 40800) + 3200,
    date: new Date(2024, ((offset + i) % 12), ri(1, 28, (offset + i) % 28)).toISOString().slice(0, 10),
  }))

const baghrecords = [
  { id: 'BGH-0001', printer: 'Bagh Print Artisan Cooperative MP', design: 'Bagh Parrot Floral Panel', status: 'GI Madhya Pradesh Bagh Mark', qty: 4, cost: 42000, date: '2024-01-15' },
  { id: 'BGH-0002', printer: 'Dhar Bagh Heritage Guild MP', design: 'Bagh Mango Tree Panel', status: 'Alizarin Red Mordant QC', qty: 6, cost: 30000, date: '2024-01-28' },
  { id: 'BGH-0003', printer: 'Bagh Udyog Village Cluster MP', design: 'Bagh Jungle Forest Print', status: 'Indigo Vat Dye Fastness', qty: 3, cost: 44000, date: '2024-02-10' },
  { id: 'BGH-0004', printer: 'Jhabua Block Printer Society MP', design: 'Bagh Lotus Pond Scroll', status: 'Hand Block Impression Depth', qty: 8, cost: 18000, date: '2024-02-22' },
  { id: 'BGH-0005', printer: 'Alirajpur Traditional Printers MP', design: 'Bagh Peacock Dance Panel', status: 'Fabric Shrinkage Verify', qty: 5, cost: 38000, date: '2024-03-08' },
  { id: 'BGH-0006', printer: 'Dhar Handloom Print Collective MP', design: 'Bagh Vine Trellis Mural', status: 'Natural Dye Pigment Audit', qty: 7, cost: 24000, date: '2024-03-20' },
  { id: 'BGH-0007', printer: 'Mandla Bagh Artisans Guild MP', design: 'Bagh Sunset Garden Scroll', status: 'GI Madhya Pradesh Bagh Mark', qty: 2, cost: 44000, date: '2024-04-03' },
  { id: 'BGH-0008', printer: 'Kukshi Bagh Block Printers MP', design: 'Bagh Tribal Animal Panel', status: 'Alizarin Red Mordant QC', qty: 9, cost: 12000, date: '2024-04-16' },
  { id: 'BGH-0009', printer: 'Bagh Print Artisan Cooperative MP', design: 'Bagh Mango Tree Panel', status: 'Indigo Vat Dye Fastness', qty: 4, cost: 36000, date: '2024-04-28' },
  { id: 'BGH-0010', printer: 'Dhar Bagh Heritage Guild MP', design: 'Bagh Parrot Floral Panel', status: 'Hand Block Impression Depth', qty: 6, cost: 28000, date: '2024-05-10' },
  { id: 'BGH-0011', printer: 'Bagh Udyog Village Cluster MP', design: 'Bagh Jungle Forest Print', status: 'Fabric Shrinkage Verify', qty: 3, cost: 40000, date: '2024-05-23' },
  { id: 'BGH-0012', printer: 'Jhabua Block Printer Society MP', design: 'Bagh Lotus Pond Scroll', status: 'Natural Dye Pigment Audit', qty: 5, cost: 26000, date: '2024-06-05' },
  { id: 'BGH-0013', printer: 'Alirajpur Traditional Printers MP', design: 'Bagh Peacock Dance Panel', status: 'GI Madhya Pradesh Bagh Mark', qty: 7, cost: 22000, date: '2024-06-18' },
  { id: 'BGH-0014', printer: 'Dhar Handloom Print Collective MP', design: 'Bagh Vine Trellis Mural', status: 'Alizarin Red Mordant QC', qty: 4, cost: 38000, date: '2024-07-01' },
  { id: 'BGH-0015', printer: 'Mandla Bagh Artisans Guild MP', design: 'Bagh Sunset Garden Scroll', status: 'Indigo Vat Dye Fastness', qty: 8, cost: 16000, date: '2024-07-14' },
  { id: 'BGH-0016', printer: 'Kukshi Bagh Block Printers MP', design: 'Bagh Tribal Animal Panel', status: 'Hand Block Impression Depth', qty: 3, cost: 42000, date: '2024-07-26' },
  { id: 'BGH-0017', printer: 'Bagh Print Artisan Cooperative MP', design: 'Bagh Parrot Floral Panel', status: 'Fabric Shrinkage Verify', qty: 5, cost: 34000, date: '2024-08-08' },
  { id: 'BGH-0018', printer: 'Dhar Bagh Heritage Guild MP', design: 'Bagh Mango Tree Panel', status: 'Natural Dye Pigment Audit', qty: 6, cost: 20000, date: '2024-08-20' },
  { id: 'BGH-0019', printer: 'Bagh Udyog Village Cluster MP', design: 'Bagh Jungle Forest Print', status: 'GI Madhya Pradesh Bagh Mark', qty: 4, cost: 40000, date: '2024-09-02' },
  { id: 'BGH-0020', printer: 'Jhabua Block Printer Society MP', design: 'Bagh Lotus Pond Scroll', status: 'Alizarin Red Mordant QC', qty: 10, cost: 14000, date: '2024-09-14' },
]

export default function BaghPrintMadhyaLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})

  const allRecords = [...baghrecords, ...genRecords(21), ...genRecords(41)]

  const filteredRecords = useMemo(() => {
    if (!searchQuery && Object.keys(activeFilters).every(k => !activeFilters[k].length)) return allRecords
    const sq = searchQuery.toLowerCase()
    return allRecords.filter(r => { if (sq && !r.id.toLowerCase().includes(sq) && !r.design.toLowerCase().includes(sq)) return false; return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string)); })
  }, [searchQuery, activeFilters, allRecords])

  const filterGroups = [
    { key: 'design', label: 'Design', options: PRODUCTS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.design === p).length })) },
    { key: 'printer', label: 'Printer', options: ARTISANS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.printer === p).length })) },
  ]

  const trendData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m, i) => ({ month: m, shipments: ri(4, 20, allRecords.length * 0.10 + i * 3) }))
  const printerChart = ARTISANS.map(p => ({ name: p.split(' ').slice(0, 2).join(' '), volume: allRecords.filter(r => r.printer === p).reduce((s, r) => s + r.qty, 0) }))
  const statusPie = STATUSES.map(s => ({ name: s, value: allRecords.filter(r => r.status === s).length }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="bgh-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Bagh Print MP' }]} />
      <PageHeader title="Bagh Print Madhya Pradesh Logistics" description="Madhya Pradesh Bagh hand block print supply chain with GI Madhya Pradesh Bagh Mark certification, alizarin red mordant quality control, indigo vat dye fastness verification, hand block impression depth testing, fabric shrinkage analysis, and natural dye pigment auditing across 8 Bagh printer clusters in Dhar, Jhabua, and Alirajpur" />
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
            <KpiTile label="Print Clusters" value={ARTISANS.length} />
            <KpiTile label="Avg Cost" value={`₹${Math.round(allRecords.reduce((s, r) => s + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>
          <div className="grid grid-cols-6 gap-4">
            <HealthRing label="GI Tag" value={91} />
            <HealthRing label="Mordant" value={87} />
            <HealthRing label="Dye" value={84} />
            <HealthRing label="Block" value={90} />
            <HealthRing label="Shrink" value={86} />
            <HealthRing label="Pigment" value={88} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Printer Families" value="30 Active" />
            <ValueTile label="Tradition" value="Since 1000 AD" />
            <ValueTile label="Export Markets" value="8 Countries" />
            <ValueTile label="Annual Revenue" value="₹3.2 Crore" />
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
            placeholder="Search Bagh print shipments..."
          />
          <div className="rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-amber-100">
                <tr>
                  <th className="p-3 text-left font-medium">ID</th>
                  <th className="p-3 text-left font-medium">Design</th>
                  <th className="p-3 text-left font-medium">Printer</th>
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
                    <td className="p-3">{record.printer}</td>
                    <td className="p-3"><StatusBadge status={record.status} /></td>
                    <td className="p-3">{record.qty} {['panels', 'scrolls', 'bolts', 'yards'][parseInt(record.id.slice(4)) % 4]}</td>
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
              <CardHeader><CardTitle>Printer Volume</CardTitle></CardHeader>
              <CardContent>
                <BarChart width={500} height={300} data={printerChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="volume" fill={COLORS[0]}>
                    {printerChart.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
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
              <CardHeader><CardTitle>Bagh Print — 1000-Year Madhya Pradesh Hand Block Printing Heritage</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">Bagh print represents one of the most visually distinctive and technically sophisticated hand block printing traditions of India having originated approximately one thousand years ago in the village of Bagh located in the Dhar district of Madhya Pradesh where the Bagh Khatri community of Muslim block printers developed a unique natural dye printing technique that produces extraordinarily vibrant red and black floral and geometric patterns on cotton and silk fabrics using a complex alizarin mordant printing process combined with indigo vat dyeing that creates the distinctive Bagh print colour palette of deep alizarin red brilliant black and indigo blue on white cotton ground that distinguishes Bagh print from all other Indian hand block printing traditions where the Bagh printing technique employs hand-carved teakwood blocks dipped in a specially prepared alizarin mordant paste containing alum and tamarind seed gum that is precisely stamped onto the fabric surface to create the negative-reserve pattern areas that remain white after the subsequent alizarin red dyeing process where the fabric after mordant printing is immersed in a heated alizarin dye bath prepared from the roots of the Indian madder plant Rubia cordifolia containing the red dye compound alizarin that binds chemically with the alum mordant in the stamped areas producing permanent alizarin red colour only in the mordant-printed pattern areas while the unstamped areas remain undyed white creating the characteristic red-on-white Bagh print pattern that is subsequently enhanced by the application of a black iron-based dye paste known as kashikap prepared from iron rust vinegar and jaggery that is hand-painted or block-printed over the alizarin red pattern providing the characteristic black outline and fill details that complete the Bagh print design vocabulary where the Bagh print design repertoire features bold stylised floral motifs including the parrot motif the mango tree motif the lotus pond motif the jungle forest motif and the vine trellis motif that reflect the natural environment of the Bagh village area in the Narmada River valley of Madhya Pradesh where the lush tropical forest landscape provides the artistic inspiration for the distinctive organic flowing design patterns that characterise authentic Bagh print fabric and position it among the most culturally significant hand block printing traditions of India having received the Geographical Indication registration as GI Madhya Pradesh Bagh Mark providing legal protection and cultural provenance certification for authentic Bagh printed textiles produced by the traditional Bagh Khatri artisan community of Dhar district.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Alizarin Red Mordant QC & Indigo Vat Dye Fastness Standards</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The alizarin red mordant quality control and indigo vat dye fastness verification protocols for Bagh print establish the primary quality assurance framework for the traditional natural dye printing process that defines the authentic Bagh print visual quality and colour permanence characteristics where the alizarin mordant paste quality test measures the concentration of alum potassium aluminium sulphate in the mordant paste using gravimetric analysis confirming alum concentration between twelve and eighteen percent by weight in the tamarind seed gum binder paste ensuring sufficient mordant concentration to produce permanent alizarin red dye fixation on the cotton fabric substrate with minimum colour fastness rating of four on the ISO 105-C06 five-point wash fastness scale confirming the alizarin red colour maintains its intensity and hue after five standard wash cycles at sixty degrees Celsius without significant fading staining or colour shift that would compromise the visual quality and market value of the Bagh printed textile where the alum concentration below the specified minimum range causes inadequate mordant fixation resulting in pale washed-out red colour that does not meet the premium quality standards required for GI-certified Bagh print products while alum concentration above the maximum range causes fabric stiffness and harsh hand feel that diminishes the desirable soft drape quality of authentic Bagh printed cotton fabric where the indigo vat dye fastness test evaluates the resistance of the indigo blue component of the Bagh print colour palette to rubbing and light exposure using ISO 105-X12 crocking fastness and ISO 105-B02 light fastness testing methodologies confirming minimum crocking fastness rating of three on the five-point grey scale and minimum light fastness rating of four on the eight-point blue wool scale ensuring the indigo blue colour resists rubbing transfer during normal wear and resists fading under prolonged light exposure during display and storage of Bagh printed textile products in retail and institutional environments where the natural indigo vat dye derived from Indigofera tinctoria plant leaves is particularly susceptible to photo-oxidative degradation and mechanical rubbing transfer requiring stringent quality control testing to confirm the dye fastness performance meets the durability requirements for premium hand block printed textile products intended for garment home furnishing and institutional art collection applications.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Hand Block Impression Depth & Fabric Shrinkage Analysis</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The hand block impression depth quality control test for Bagh print establishes a precise measurement protocol for the printed pattern sharpness and colour saturation depth that defines the premium visual quality of authentic Bagh printed textiles where the impression depth test uses a calibrated digital micrometer to measure the physical depth of the printed mordant and dye paste penetration into the cotton fabric substrate at five randomly selected positions on each printed panel confirming impression depth between zero point three and zero point five millimetres indicating complete paste penetration through the fabric surface layer without excessive bleed-through to the reverse fabric face that would cause pattern indistinctness and colour registration inaccuracies where impression depth below the minimum range indicates inadequate printing pressure or insufficient paste viscosity causing shallow surface-only colour application that produces faded patchy pattern appearance after dyeing while impression depth above the maximum range indicates excessive printing pressure causing block distortion fabric compaction and paste bleed-through that compromises the pattern definition and creates reverse-side staining requiring corrective adjustment of the block printing pressure and paste viscosity before the production run continues where the hand block carving quality test examines each teakwood printing block under magnification confirming minimum line width of one point five millimetres for fine detail lines and minimum relief depth of three millimetres for broad area printing surfaces ensuring the hand-carved teakwood block produces clean sharp pattern impressions with consistent ink transfer across repeated printing cycles without block degradation line fracture or surface wear that would compromise the pattern quality during the production run of Bagh printed textile panels where each hand-carved teakwood printing block has a production service life of approximately five hundred printing impressions before requiring resurfacing or replacement ensuring consistent pattern quality throughout the complete production cycle of Bagh printed textile products from the artisan workshop to the finished product packaging stage where the fabric shrinkage analysis test measures the dimensional change of the printed cotton fabric after the complete Bagh printing process sequence including mordant printing alizarin dyeing indigo dyeing iron black application and post-dye washing and drying confirming maximum cumulative shrinkage of four percent in both warp and weft directions in accordance with IS 6339 textile dimensional stability testing ensuring garment manufacturers receive Bagh printed cotton fabric with predictable dimensional behaviour that enables precise pattern cutting and garment construction for the premium fashion and home textile markets that constitute the primary customer base for authentic GI-certified Bagh printed textile products from Madhya Pradesh.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Natural Dye Pigment Audit & Bagh Heritage Market Development</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The natural dye pigment audit for Bagh print establishes a comprehensive chemical verification framework ensuring that all dye materials used in the Bagh printing process are derived exclusively from traditional natural sources without synthetic dye adulteration that would compromise the cultural authenticity and natural dye certification status of GI-certified Bagh printed textile products where the pigment audit employs thin-layer chromatography and UV-visible spectrophotometry analysis of the dye extracts to confirm the presence of the characteristic natural dye marker compounds alizarin from Rubia cordifolia madder root indican from Indigofera tinctoria indigo leaves and iron tannate from the iron rust jaggery kashikap black dye preparation confirming that the red blue and black colour components of the Bagh print are derived exclusively from the declared natural plant and mineral sources without contamination from synthetic azo anthraquinone or phthalocyanine dye compounds that are commonly used in commercial textile printing but prohibited in GI-certified Bagh natural dye print products where the audit also verifies that the dye preparation process follows the traditional Bagh method specifications including minimum madder root boiling time of four hours for alizarin extraction minimum indigo fermentation period of seven days for indigo vat preparation and minimum iron rust ageing period of fifteen days for kashikap black dye preparation ensuring the natural dye materials are properly processed to develop the full colour strength and fastness properties that characterise authentic Bagh printed textile products where the Bagh heritage market development initiative led by the Madhya Pradesh State Handloom and Handicrafts Development Corporation in collaboration with the Bagh Print Artisan Cooperative Dhar and the Indira Gandhi Rashtriya Manav Sangrahalaya Bhopal has established a comprehensive cultural heritage market platform connecting the thirty active Bagh Khatri printer families with institutional buyers including the National Handicrafts Museum New Delhi the Crafts Museum Delhi the British Museum London and premium fashion brands including Fabindura and Good Earth who source GI-certified Bagh printed fabric for their heritage textile collections where the growing global demand for natural dye sustainable textile products has created exceptional market opportunities for authentic Bagh print positioning it as one of the most commercially viable Indian hand block printing traditions in the premium sustainable textile market segment with projected annual growth of fifteen percent driven by expanding consumer preference for natural dye eco-friendly textile products in the domestic and international fashion markets.</p></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}



