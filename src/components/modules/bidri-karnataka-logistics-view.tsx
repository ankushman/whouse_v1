import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#1e3a5f', '#1e40af', '#2563eb', '#3b82f6', '#60a5fa', '#172554', '#1e1b4b', '#eff6ff']
const PRODUCTS = ['Bidri Hookah Base', 'Bidri Flower Vase', 'Bidri Pandan Box', 'Bidri Paan Daan Set', 'Bidri Candle Stand Pair', 'Bidri Serving Tray', 'Bidri Jug and Tumbler', 'Bidri Jewelry Casket']
const ARTISANS = ['Bidar City Craft Guild KA', 'Mehkari Mohalla Artisans KA', 'Chaukhamba Workshop KA', 'Shah Gunj Heritage KA', 'Naubad Street Collective KA', 'Kalyani Bidri Cluster KA', 'Basavakalyan Craft Society KA', 'Gulbarga Artisan Group KA']
const STATUSES = ['GI Karnataka Bidri Mark', 'Zinc Alloy Purity QC', 'Silver Inlay Depth Test', 'Soil Blackening Bond Check', 'Copper Sulphate Patina QC', 'Hand Engraving Detail Audit']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[1] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="w-24 h-2 bg-blue-200 rounded-full overflow-hidden"><div className="h-full bg-blue-700 rounded-full" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ label, value, size = 80 }: { label: string; value: number; size?: number }) => {
  const r = (size - 12) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#eff6ff" strokeWidth="6" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={COLORS[1]} strokeWidth="6" strokeDasharray={`${c}`} strokeDashoffset={c - (value / 100) * c} strokeLinecap="round" />
      </svg>
      <span className="text-xs font-medium" style={{ color: COLORS[1] }}>{label} {value}%</span>
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
    id: `BDR-${String(offset + i + 1).padStart(4, '0')}`,
    artisan: ARTISANS[(offset + i) % ARTISANS.length], design: PRODUCTS[(offset + i) % PRODUCTS.length],
    status: STATUSES[(offset + i) % STATUSES.length], qty: ri(1, 10, ((offset + i) * 19) % 10) + 1,
    cost: ri(5000, 65000, ((offset + i) * 11307) % 60000) + 5000,
    date: new Date(2024, ((offset + i) % 12), ri(1, 28, (offset + i) % 28)).toISOString().slice(0, 10),
  }))

const bidrirecords = [
  { id: 'BDR-0001', artisan: 'Bidar City Craft Guild KA', design: 'Bidri Hookah Base', status: 'GI Karnataka Bidri Mark', qty: 3, cost: 58000, date: '2024-01-08' },
  { id: 'BDR-0002', artisan: 'Mehkari Mohalla Artisans KA', design: 'Bidri Flower Vase', status: 'Zinc Alloy Purity QC', qty: 5, cost: 42000, date: '2024-01-20' },
  { id: 'BDR-0003', artisan: 'Chaukhamba Workshop KA', design: 'Bidri Pandan Box', status: 'Silver Inlay Depth Test', qty: 4, cost: 62000, date: '2024-02-02' },
  { id: 'BDR-0004', artisan: 'Shah Gunj Heritage KA', design: 'Bidri Paan Daan Set', status: 'Soil Blackening Bond Check', qty: 6, cost: 35000, date: '2024-02-15' },
  { id: 'BDR-0005', artisan: 'Naubad Street Collective KA', design: 'Bidri Candle Stand Pair', status: 'Copper Sulphate Patina QC', qty: 3, cost: 64000, date: '2024-02-28' },
  { id: 'BDR-0006', artisan: 'Kalyani Bidri Cluster KA', design: 'Bidri Serving Tray', status: 'Hand Engraving Detail Audit', qty: 4, cost: 48000, date: '2024-03-12' },
  { id: 'BDR-0007', artisan: 'Basavakalyan Craft Society KA', design: 'Bidri Jug and Tumbler', status: 'GI Karnataka Bidri Mark', qty: 7, cost: 28000, date: '2024-03-25' },
  { id: 'BDR-0008', artisan: 'Gulbarga Artisan Group KA', design: 'Bidri Jewelry Casket', status: 'Zinc Alloy Purity QC', qty: 3, cost: 65000, date: '2024-04-07' },
  { id: 'BDR-0009', artisan: 'Bidar City Craft Guild KA', design: 'Bidri Hookah Base', status: 'Silver Inlay Depth Test', qty: 5, cost: 40000, date: '2024-04-20' },
  { id: 'BDR-0010', artisan: 'Mehkari Mohalla Artisans KA', design: 'Bidri Flower Vase', status: 'Soil Blackening Bond Check', qty: 4, cost: 55000, date: '2024-05-03' },
  { id: 'BDR-0011', artisan: 'Chaukhamba Workshop KA', design: 'Bidri Pandan Box', status: 'Copper Sulphate Patina QC', qty: 6, cost: 32000, date: '2024-05-16' },
  { id: 'BDR-0012', artisan: 'Shah Gunj Heritage KA', design: 'Bidri Paan Daan Set', status: 'Hand Engraving Detail Audit', qty: 3, cost: 60000, date: '2024-05-29' },
  { id: 'BDR-0013', artisan: 'Naubad Street Collective KA', design: 'Bidri Candle Stand Pair', status: 'GI Karnataka Bidri Mark', qty: 4, cost: 52000, date: '2024-06-11' },
  { id: 'BDR-0014', artisan: 'Kalyani Bidri Cluster KA', design: 'Bidri Serving Tray', status: 'Zinc Alloy Purity QC', qty: 5, cost: 38000, date: '2024-06-24' },
  { id: 'BDR-0015', artisan: 'Basavakalyan Craft Society KA', design: 'Bidri Jug and Tumbler', status: 'Silver Inlay Depth Test', qty: 3, cost: 62000, date: '2024-07-07' },
  { id: 'BDR-0016', artisan: 'Gulbarga Artisan Group KA', design: 'Bidri Jewelry Casket', status: 'Soil Blackening Bond Check', qty: 7, cost: 26000, date: '2024-07-20' },
  { id: 'BDR-0017', artisan: 'Bidar City Craft Guild KA', design: 'Bidri Hookah Base', status: 'Copper Sulphate Patina QC', qty: 4, cost: 50000, date: '2024-08-02' },
  { id: 'BDR-0018', artisan: 'Mehkari Mohalla Artisans KA', design: 'Bidri Flower Vase', status: 'Hand Engraving Detail Audit', qty: 6, cost: 36000, date: '2024-08-15' },
  { id: 'BDR-0019', artisan: 'Chaukhamba Workshop KA', design: 'Bidri Pandan Box', status: 'GI Karnataka Bidri Mark', qty: 3, cost: 58000, date: '2024-08-28' },
  { id: 'BDR-0020', artisan: 'Shah Gunj Heritage KA', design: 'Bidri Paan Daan Set', status: 'Zinc Alloy Purity QC', qty: 5, cost: 44000, date: '2024-09-10' },
]

export default function BidriKarnatakaLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})

  const allRecords = [...bidrirecords, ...genRecords(21), ...genRecords(41)]

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
    <div className="bdr-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Bidri Art' }]} />
      <PageHeader title="Bidri Karnataka Logistics" description="Karnataka Bidriware silver inlay on blackened zinc alloy supply chain with GI Karnataka Bidri Mark certification zinc alloy purity quality control silver inlay depth testing soil blackening bond verification copper sulphate patina inspection and hand engraving detail audit across 8 Bidri artisan clusters in Bidar Mehkari and Kalyani" />
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="bg-blue-100">
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
            <HealthRing label="Alloy" value={89} />
            <HealthRing label="Inlay" value={92} />
            <HealthRing label="Soil" value={87} />
            <HealthRing label="Patina" value={91} />
            <HealthRing label="Engraving" value={95} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Bidri Families" value="18 Active" />
            <ValueTile label="Tradition" value="Since 1400 AD" />
            <ValueTile label="Export Markets" value="6 Countries" />
            <ValueTile label="Annual Revenue" value="₹1.6 Crore" />
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
            placeholder="Search Bidri art shipments..."
          />
          <div className="rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-blue-100">
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
                  <tr key={record.id} className="border-t hover:bg-blue-50/50">
                    <td className="p-3 font-mono text-xs">{record.id}</td>
                    <td className="p-3"><ProductBadge name={record.design} /></td>
                    <td className="p-3">{record.artisan}</td>
                    <td className="p-3"><StatusBadge status={record.status} /></td>
                    <td className="p-3">{record.qty} {['pieces', 'sets', 'pairs', 'boxes'][parseInt(record.id.slice(4)) % 4]}</td>
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
                  <Line type="monotone" dataKey="shipments" stroke={COLORS[1]} strokeWidth={2} />
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
                  <Bar dataKey="volume" fill={COLORS[1]}>
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
              <CardHeader><CardTitle>Bidriware — Six Hundred Year Old Persian-Influenced Silver Inlay Metal Art of Bidar</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">Bidriware represents one of the most distinctive and technically sophisticated metal inlay art traditions of India having originated in the historic city of Bidar in the northern Karnataka region approximately six hundred years ago during the Bahmani Sultanate period when Persian craftsmen accompanying the royal court introduced the technique of inlaying thin sheets of silver and gold into a dark oxidised zinc-copper alloy base metal to the local Bidar metalworking community where the Bidri craft derives its name from the city of Bidar where the unique black soil found in the Bidar fort area contains a high concentration of copper sulphate and ammonium sulphate minerals that provide the distinctive permanent black oxidised patina characteristic of authentic Bidriware where the Bidriware manufacturing process begins with the preparation of the base metal alloy composed of approximately ninety-five percent zinc and five percent copper that is melted at approximately nine hundred fifty degrees Celsius in a traditional clay crucible and cast into moulds made from locally sourced fine Bidar red clay mixed with sand and molasses to produce the rough form of the desired article whether a hookah base flower vase pandan box paan daan set candle stand serving tray jug or jewelry casket where the cast zinc alloy article is then filed and polished to a smooth surface using progressively finer grades of traditional abrasives including pumice stone and date palm leaf ash producing a uniform matte grey surface ready for the silver inlay process where the artisan hand-engraves intricate floral geometric or arabesque designs into the polished surface using fine steel chisels called the stylus creating narrow grooves of approximately zero point five to one millimetre width and depth into which thin sheets of pure silver ninety-nine point nine percent purity are carefully inlaid and hammered into place using a small pointed punch and hammer technique where the inlaid silver sheet conforms precisely to the engraved groove shape producing crisp sharp silver design elements that stand in vivid contrast against the dark black oxidised background of the zinc alloy surface that is achieved by applying a special paste made from Bidar fort soil mixed with ammonium chloride and water to the surface which reacts chemically with the zinc alloy base turning it permanently black while leaving the silver inlay untouched and shining bright against the dramatic dark background creating the characteristic Bidri aesthetic of brilliant silver designs on a deep lustrous black field that has made Bidriware one of the most prized and collected Indian metal art traditions since the fifteenth century.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Zinc Alloy Purity QC and Silver Inlay Depth Verification Standards</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The zinc alloy purity quality control and silver inlay depth verification protocols for Bidriware establish the primary technical quality assurance framework for the traditional Bidri metal inlay process that determines the alloy quality surface durability and inlay precision of authentic GI-certified Bidriware products where the zinc alloy purity test measures the chemical composition of the cast base metal using X-ray fluorescence spectroscopy confirming the zinc content falls within the accepted range of ninety-three to ninety-seven percent with copper content between three and seven percent ensuring the alloy provides the optimal combination of casting fluidity for capturing fine surface detail in the mould and chemical reactivity with the Bidar fort soil oxidising paste for achieving the permanent black patina that characterises authentic Bidriware where the alloy purity test also screens for unacceptable impurities including lead which must be below zero point one percent cadmium below zero point zero five percent and iron below zero point three percent as these impurities compromise both the blackening reaction quality and the long-term corrosion resistance of the finished Bidri article where the silver inlay depth test measures the depth of the engraved groove channel into which the silver sheet is inlaid using a calibrated depth gauge at five randomly selected points on each silver inlay design element confirming groove depth between zero point five and one point two millimetres ensuring sufficient mechanical anchoring depth for the silver inlay to remain permanently secured in the alloy surface without lifting peeling or working loose during normal handling and cleaning over the expected product lifetime of thirty to fifty years where the silver inlay width consistency test measures the engraved groove width at ten randomly selected points confirming width variation within plus or minus zero point two millimetres ensuring uniform silver line quality across the entire design where the inlay edge definition test evaluates the crispness of the silver-to-alloy boundary using digital microscopy at twenty-times magnification confirming clean sharp edges without silver overflow into adjacent areas or gaps between the silver and the alloy groove walls that would indicate poor inlay workmanship.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Soil Blackening Bond Verification and Copper Sulphate Patina Quality</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The soil blackening bond verification and copper sulphate patina quality assessment protocols ensure the distinctive permanent black surface quality and silver contrast brilliance that defines authentic Bidriware where the soil blackening bond test evaluates the adhesion durability and chemical permanence of the black oxidised patina applied to the zinc alloy surface using the traditional Bidar fort soil oxidising paste by subjecting the blackened surface to a standardised abrasion resistance test using a calibrated steel wool pad under controlled pressure for fifty cycles on a designated test area measuring any patina removal or lightening of the black surface where authentic Bidriware blackening should show zero visible patina removal after fifty cycles confirming the black oxide layer is chemically bonded to the zinc alloy surface rather than merely surface-deposited where the blackening colour consistency test compares the patina colour of the finished Bidri piece against the approved Bidriware black colour standard using a spectrophotometer confirming colour difference Delta E values below two indicating consistent deep black patina colour across the entire surface without areas of grey blue or brown discolouration that would indicate incomplete or non-uniform blackening reaction where the copper sulphate content test analyses the Bidar fort soil used in the blackening paste using atomic absorption spectroscopy confirming copper sulphate concentration between eight and fifteen percent by weight indicating authentic Bidar fort soil with sufficient reactive copper ions to produce the permanent black zinc oxide patina on the alloy surface where soil with insufficient copper sulphate concentration produces an incomplete grey patina that does not achieve the characteristic deep lustrous black of premium Bidriware and soil with excessively high copper sulphate concentration produces a brittle blue-black patina that may crack or flake from the surface during normal handling and cleaning requiring careful soil quality management and precise paste preparation to achieve the optimal blackening result for each Bidriware piece.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Hand Engraving Detail Audit and Bidri Heritage Market Development</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The hand engraving detail audit and Bidri heritage market development framework provides the artistic quality assurance and commercial market infrastructure for the Bidriware supply chain ensuring that all GI-certified Bidri art products demonstrate the extraordinary hand engraving precision and silver inlay artistry that defines this six hundred year old Bidar metal art tradition while connecting the eighteen remaining active Bidri artisan families across Bidar Mehkari Mohalla Chaukhamba Shah Gunj Naubad Street Kalyani Basavakalyan and Gulbarga with growing institutional and international collector market demand for authentic Bidriware metal art objects where the hand engraving detail audit evaluates the precision and artistic quality of the hand-chased engraving patterns on the zinc alloy surface before silver inlay using digital microscopy at twenty-five-times magnification confirming clean crisp engraved lines without ragged edges chatter marks from tool vibration or inconsistent depth that would indicate inadequate craftsman skill or worn engraving tools verifying line width consistency within plus or minus zero point two millimetres for fine floral detail lines and plus or minus zero point five millimetres for bold contour lines ensuring the engraved design provides a precise uniform groove channel for the silver inlay that produces consistent line quality and visual brilliance across the entire Bidri design where the engraving pattern fidelity test compares the completed engraving against the approved design template confirming all design elements including the characteristic Bidri floral motifs Persian arabesque scrolls geometric jali patterns and Mughal-inspired vine designs are present correctly proportioned and positioned without omission distortion or artistic deviation from the master pattern ensuring batch-to-batch design consistency across production runs from the same artisan workshop where the Bidri heritage market development initiative led by the Karnataka State Handicrafts Development Corporation in collaboration with the Bidar District Craft Development Authority and the Bidar City Bidri Craft Cooperative has established institutional procurement and exhibition programmes connecting the eighteen active Bidri artisan guilds with the Karnataka State Government Emporium network the National Handicrafts Museum New Delhi and international cultural institutions with projected annual revenue growth of twenty-two percent driven by expanding global recognition of Bidriware as one of the finest metal inlay art traditions in the world.</p></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}



