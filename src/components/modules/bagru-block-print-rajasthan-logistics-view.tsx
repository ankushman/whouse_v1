import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#c2410c', '#ea580c', '#f97316', '#fb923c', '#fdba74', '#9a3412', '#7c2d12', '#ffedd5']
const PRODUCTS = ['Bagru Indigo Floral Saree', 'Bagru Red Black Bed Sheet', 'Bagru Syahi Gerua Yardage', 'Bagru Mor Peacock Panel', 'Bagru Tree of Life Scroll', 'Bagru Sola Singhar Runners', 'Bagru Jharokha Curtain Panel', 'Bagru Champak Flower Bolt']
const ARTISANS = ['Bagru Chhipa Mohalla Printers RJ', 'Sanganer Block Printer Guild RJ', 'Jaipur Bagru Heritage Cluster RJ', 'Malviya Nagar Print Cooperative RJ', 'Chaksu Traditional Printers RJ', 'Phagi Bagru Artisan Society RJ', 'Jobner Block Print Village RJ', 'Kishangarh Hand Print RJ']
const STATUSES = ['GI Rajasthan Bagru Mark', 'Indigo Fermentation Vat QC', 'Syahi Black Mud Resist Check', 'Gerua Alizarin Mordant QC', 'Bagru Motif Registration', 'Textile Wash Fastness Test']

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
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#ffedd5" strokeWidth="6" />
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
    id: `BRP-${String(offset + i + 1).padStart(4, '0')}`,
    printer: ARTISANS[(offset + i) % ARTISANS.length], design: PRODUCTS[(offset + i) % PRODUCTS.length],
    status: STATUSES[(offset + i) % STATUSES.length], qty: ri(1, 20, ((offset + i) * 19) % 20) + 1,
    cost: ri(3800, 50000, ((offset + i) * 10707) % 46200) + 3800,
    date: new Date(2024, ((offset + i) % 12), ri(1, 28, (offset + i) % 28)).toISOString().slice(0, 10),
  }))

const bagrurecords = [
  { id: 'BRP-0001', printer: 'Bagru Chhipa Mohalla Printers RJ', design: 'Bagru Indigo Floral Saree', status: 'GI Rajasthan Bagru Mark', qty: 5, cost: 48000, date: '2024-01-15' },
  { id: 'BRP-0002', printer: 'Sanganer Block Printer Guild RJ', design: 'Bagru Red Black Bed Sheet', status: 'Indigo Fermentation Vat QC', qty: 8, cost: 32000, date: '2024-01-28' },
  { id: 'BRP-0003', printer: 'Jaipur Bagru Heritage Cluster RJ', design: 'Bagru Syahi Gerua Yardage', status: 'Syahi Black Mud Resist Check', qty: 3, cost: 50000, date: '2024-02-10' },
  { id: 'BRP-0004', printer: 'Malviya Nagar Print Cooperative RJ', design: 'Bagru Mor Peacock Panel', status: 'Gerua Alizarin Mordant QC', qty: 7, cost: 22000, date: '2024-02-22' },
  { id: 'BRP-0005', printer: 'Chaksu Traditional Printers RJ', design: 'Bagru Tree of Life Scroll', status: 'Bagru Motif Registration', qty: 4, cost: 44000, date: '2024-03-08' },
  { id: 'BRP-0006', printer: 'Phagi Bagru Artisan Society RJ', design: 'Bagru Sola Singhar Runners', status: 'Textile Wash Fastness Test', qty: 6, cost: 28000, date: '2024-03-20' },
  { id: 'BRP-0007', printer: 'Jobner Block Print Village RJ', design: 'Bagru Jharokha Curtain Panel', status: 'GI Rajasthan Bagru Mark', qty: 2, cost: 50000, date: '2024-04-03' },
  { id: 'BRP-0008', printer: 'Kishangarh Hand Print RJ', design: 'Bagru Champak Flower Bolt', status: 'Indigo Fermentation Vat QC', qty: 10, cost: 14000, date: '2024-04-16' },
  { id: 'BRP-0009', printer: 'Bagru Chhipa Mohalla Printers RJ', design: 'Bagru Red Black Bed Sheet', status: 'Syahi Black Mud Resist Check', qty: 5, cost: 42000, date: '2024-04-28' },
  { id: 'BRP-0010', printer: 'Sanganer Block Printer Guild RJ', design: 'Bagru Indigo Floral Saree', status: 'Gerua Alizarin Mordant QC', qty: 8, cost: 36000, date: '2024-05-10' },
  { id: 'BRP-0011', printer: 'Jaipur Bagru Heritage Cluster RJ', design: 'Bagru Syahi Gerua Yardage', status: 'Bagru Motif Registration', qty: 3, cost: 46000, date: '2024-05-23' },
  { id: 'BRP-0012', printer: 'Malviya Nagar Print Cooperative RJ', design: 'Bagru Mor Peacock Panel', status: 'Textile Wash Fastness Test', qty: 6, cost: 24000, date: '2024-06-05' },
  { id: 'BRP-0013', printer: 'Chaksu Traditional Printers RJ', design: 'Bagru Tree of Life Scroll', status: 'GI Rajasthan Bagru Mark', qty: 4, cost: 48000, date: '2024-06-18' },
  { id: 'BRP-0014', printer: 'Phagi Bagru Artisan Society RJ', design: 'Bagru Sola Singhar Runners', status: 'Indigo Fermentation Vat QC', qty: 9, cost: 18000, date: '2024-07-01' },
  { id: 'BRP-0015', printer: 'Jobner Block Print Village RJ', design: 'Bagru Jharokha Curtain Panel', status: 'Syahi Black Mud Resist Check', qty: 7, cost: 30000, date: '2024-07-14' },
  { id: 'BRP-0016', printer: 'Kishangarh Hand Print RJ', design: 'Bagru Champak Flower Bolt', status: 'Gerua Alizarin Mordant QC', qty: 5, cost: 38000, date: '2024-07-26' },
  { id: 'BRP-0017', printer: 'Bagru Chhipa Mohalla Printers RJ', design: 'Bagru Indigo Floral Saree', status: 'Bagru Motif Registration', qty: 3, cost: 50000, date: '2024-08-08' },
  { id: 'BRP-0018', printer: 'Sanganer Block Printer Guild RJ', design: 'Bagru Red Black Bed Sheet', status: 'Textile Wash Fastness Test', qty: 6, cost: 26000, date: '2024-08-20' },
  { id: 'BRP-0019', printer: 'Jaipur Bagru Heritage Cluster RJ', design: 'Bagru Syahi Gerua Yardage', status: 'GI Rajasthan Bagru Mark', qty: 4, cost: 44000, date: '2024-09-02' },
  { id: 'BRP-0020', printer: 'Malviya Nagar Print Cooperative RJ', design: 'Bagru Mor Peacock Panel', status: 'Indigo Fermentation Vat QC', qty: 8, cost: 20000, date: '2024-09-14' },
]

export default function BagruBlockPrintRajasthanLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})

  const allRecords = [...bagrurecords, ...genRecords(21), ...genRecords(41)]

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
    <div className="brp-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Bagru Block Print' }]} />
      <PageHeader title="Bagru Block Print Rajasthan Logistics" description="Rajasthan Bagru hand block print supply chain with GI Rajasthan Bagru Mark certification, indigo fermentation vat quality control, Syahi black mud resist verification, Gerua alizarin mordant testing, Bagru motif registration, and textile wash fastness analysis across 8 Chhipa printer clusters in Bagru Sanganer and Jaipur" />
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
            <KpiTile label="Print Clusters" value={ARTISANS.length} />
            <KpiTile label="Avg Cost" value={`₹${Math.round(allRecords.reduce((s, r) => s + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>
          <div className="grid grid-cols-6 gap-4">
            <HealthRing label="GI Tag" value={93} />
            <HealthRing label="Indigo" value={88} />
            <HealthRing label="Syahi" value={85} />
            <HealthRing label="Gerua" value={90} />
            <HealthRing label="Motif" value={86} />
            <HealthRing label="Fastness" value={91} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Chhipa Families" value="40 Active" />
            <ValueTile label="Tradition" value="Since 1600 AD" />
            <ValueTile label="Export Markets" value="12 Countries" />
            <ValueTile label="Annual Revenue" value="₹5.8 Crore" />
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
            placeholder="Search Bagru block print shipments..."
          />
          <div className="rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-orange-100">
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
                  <tr key={record.id} className="border-t hover:bg-orange-50/50">
                    <td className="p-3 font-mono text-xs">{record.id}</td>
                    <td className="p-3"><ProductBadge name={record.design} /></td>
                    <td className="p-3">{record.printer}</td>
                    <td className="p-3"><StatusBadge status={record.status} /></td>
                    <td className="p-3">{record.qty} {['sarees', 'panels', 'bolts', 'yards'][parseInt(record.id.slice(4)) % 4]}</td>
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
              <CardHeader><CardTitle>Bagru Print — 400-Year Rajasthan Chhipa Community Block Printing Heritage</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">Bagru print represents one of the most commercially significant and culturally iconic hand block printing traditions of Rajasthan having originated approximately four hundred years ago in the village of Bagru located thirty kilometres southeast of Jaipur on the Jaipur Ajmer highway where the Chhipa community of traditional textile printers developed a unique resist-dye and direct-dye hand block printing technique that produces the characteristic Bagru colour palette of deep indigo blue iron-black Syahi and vibrant alizarin red Gerua on unbleached cotton ground fabric that distinguishes Bagru print from the closely related Sanganer block printing tradition which typically uses a finer lighter design repertoire on white bleached fabric where the Bagru printing technique employs two primary printing methods the Syahi-Begar method combining black and red printing and the Tinchha method using indigo blue black and red in a three-colour printing sequence that produces the distinctive bold contrasting Bagru print aesthetic that is particularly valued for bed linens table linens and home furnishing textiles where the Syahi black colour is produced using a traditional iron-based black dye preparation called Tarvelan made from rusted horse shoe nails soaked in a solution of jaggery water and tamarind seed gum fermented for fifteen days in an earthen pot to develop the iron tannate black pigment that is hand-applied as a resist paste or directly printed onto the cotton fabric using hand-carved teakwood blocks before the fabric enters the indigo vat and alizarin red dyeing sequences where the Gerua red colour is produced using the alizarin mordant printing process with alum mordant paste stamped onto the fabric followed by immersion in a heated alizarin dye bath prepared from Rubia cordifolia madder root producing the vibrant red colour that contrasts with the indigo blue and iron black to create the distinctive Bagru tri-colour design vocabulary that has made Bagru printed textiles among the most commercially successful Indian hand block printed products in both domestic and international markets with the GI Rajasthan Bagru Mark providing cultural provenance certification and legal protection for authentic Bagru printed textiles produced by the traditional Chhipa artisan families of the Bagru printing cluster.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Indigo Fermentation Vat QC & Syahi Black Mud Resist Standards</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The indigo fermentation vat quality control and Syahi black mud resist verification protocols for Bagru print establish the primary technical quality assurance framework for the traditional natural dyeing processes that define the authentic Bagru print colour quality and fastness characteristics where the indigo fermentation vat test measures the indigo concentration pH value and reduction potential of the natural indigo vat using spectrophotometric analysis and digital pH meter testing confirming indigo concentration between two and four grams per litre of vat solution pH value between ten and eleven indicating adequate alkalinity for optimal indigo reduction and oxidation-reduction potential below negative two hundred millivolts confirming complete reduction of indigo to the soluble leuco-indigo form that penetrates the cotton fibre uniformly during the dipping process producing deep even indigo blue colour on the printed fabric surface where the vat temperature is maintained between twenty-five and thirty degrees Celsius throughout the dyeing cycle ensuring consistent indigo colour development without the patchy uneven dyeing that occurs at lower temperatures or the premature indigo oxidation and vat exhaustion that occurs at higher temperatures where each fabric piece undergoes between four and eight indigo dipping cycles with intermediate air oxidation exposure between dips to develop the deep indigo blue colour intensity that characterises premium Bagru printed textiles where the Syahi black mud resist quality test evaluates the iron content and adhesion of the Tarvelan iron-based black paste using atomic absorption spectroscopy confirming iron concentration between eight and twelve percent by weight in the paste formulation and minimum adhesion retention of ninety percent after the standardised wash abrasion test ensuring the Syahi black pattern maintains sharp definition and consistent colour intensity after the complete Bagru printing and washing sequence without bleeding feathering or detachment that would compromise the distinctive bold graphic quality of the Bagru print design vocabulary where the traditional Syahi black resist paste functions as both a colour agent producing the black pattern areas and as a resist medium preventing the alizarin red and indigo blue dyes from penetrating the black-printed areas during subsequent dyeing stages maintaining the crisp colour separation between the black red and indigo blue pattern elements that defines the characteristic Bagru print visual aesthetic.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Gerua Alizarin Mordant QC & Bagru Motif Registration</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The Gerua alizarin mordant quality control and Bagru motif registration verification protocols ensure the colour quality and design authenticity of authentic Bagru printed textiles where the Gerua alizarin mordant paste quality test measures the alum potassium aluminium sulphate concentration in the mordant paste using gravimetric analysis confirming alum concentration between fifteen and twenty percent by weight in the tamarind seed gum binder medium ensuring sufficient mordant concentration for permanent alizarin red dye fixation on the unbleached cotton substrate with minimum wash fastness rating of four on the ISO 105-C06 five-point scale confirming the Gerua red colour maintains its characteristic vibrant warm hue after five standard wash cycles at sixty degrees Celsius without significant fading or staining of adjacent fabric areas that would diminish the premium visual quality and market value of the Bagru printed textile where the alum concentration below the specified minimum range produces pale washed-out Gerua red that does not meet the quality standards for GI-certified Bagru print products while alum concentration above the maximum range causes fabric stiffness and harsh hand feel that compromises the desirable soft draping quality of authentic Bagru printed cotton textiles used for home furnishing and garment applications where the Bagru motif registration test examines each printed panel against the master Bagru motif reference library maintained by the Bagru Chhipa Mohalla Artisan Cooperative containing photographic documentation of over sixty traditional Bagru motifs including the Sola Singhar sunflower motif the Mor peacock motif the Jharokha window motif the Champak flower motif and the Tree of Life motif verifying that the printed pattern accurately reproduces the traditional motif design with correct proportional relationships between pattern elements accurate block registration alignment and consistent colour application within the specified tolerance of plus or minus one millimetre for pattern alignment and plus or minus five percent for colour intensity ensuring the printed Bagru textile faithfully represents the traditional Bagru design vocabulary without modern simplification or alteration that would compromise the cultural authenticity and heritage value of the GI-certified Bagru printed product.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Textile Wash Fastness & Bagru Heritage Market Development</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The textile wash fastness testing and Bagru heritage market development framework provides the quality assurance and market infrastructure for the Bagru hand block printing supply chain ensuring that all GI-certified Bagru printed textile products meet the durability requirements for premium home furnishing and fashion applications while connecting the traditional Bagru Chhipa artisan families with growing domestic and international market demand for authentic natural dye hand printed textiles where the wash fastness test evaluates the colour durability of all three Bagru print colour components indigo blue Syahi black and Gerua red using the ISO 105-C06 standardised washing procedure with ECE reference detergent at forty degrees Celsius for thirty minutes repeated for five cycles measuring colour change on the five-point grey scale and staining on adjacent multifibre fabric on the four-point staining scale confirming minimum ratings of four for colour change and three for staining for all three colour components ensuring the Bagru printed textile maintains its characteristic colour intensity and contrast after repeated home laundering without significant fading colour bleeding or pattern degradation that would compromise the visual quality and consumer satisfaction with the Bagru printed product where the Bagru heritage market development initiative led by the Rajasthan State Handloom and Handicrafts Development Corporation in collaboration with the Bagru Chhipa Mohalla Printers Cooperative and the Jawahar Kala Kendra Jaipur has established a comprehensive cultural heritage market platform connecting the forty active Bagru Chhipa printer families with institutional buyers including the National Handicrafts Museum New Delhi the Rajasthan Government Emporium chain and international retailers including IKEA Habitat and West Elm who source GI-certified Bagru printed home textiles for their sustainable natural product collections where the growing global consumer preference for eco-friendly natural dye hand printed textile products has created exceptional market opportunities for authentic Bagru print positioning it as one of the most commercially vibrant Indian hand block printing traditions with projected annual revenue growth of twelve percent driven by expanding demand for sustainable handmade home furnishing products in the premium lifestyle retail market segment across North America Europe and the Asia-Pacific region.</p></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}



