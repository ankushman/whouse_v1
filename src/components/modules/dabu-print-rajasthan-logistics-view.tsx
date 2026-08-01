import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#374151', '#4b5563', '#6b7280', '#9ca3af', '#d1d5db', '#1f2937', '#111827', '#f3f4f6']
const PRODUCTS = ['Dabu Indigo Parrot Saree', 'Dabu Mud Resist Bed Sheet', 'Dabu Neem Leaf Panel', 'Dabu Camel Caravan Yardage', 'Dabu Flower Vine Runner', 'Dabu Sun Ray Mural', 'Dabu Peacock Feather Scroll', 'Dabu Desert Bloom Curtain']
const ARTISANS = ['Akola Dabu Printers RJ', 'Jodhpur Mud Resist Guild RJ', 'Bamer Dabu Cluster RJ', 'Barmer Heritage Society RJ', 'Jaisalmer Desert Printers RJ', 'Phalodi Block Artisan RJ', 'Dechhu Village Collective RJ', 'Osian Traditional Print RJ']
const STATUSES = ['GI Rajasthan Dabu Mark', 'Mud Resist Adhesion QC', 'Neem Paste Fermentation Check', 'Indigo Vat Dye Penetration', 'Wash Fastness Rating Test', 'Block Print Registration']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden"><div className="h-full bg-gray-700 rounded-full" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ label, value, size = 80 }: { label: string; value: number; size?: number }) => {
  const r = (size - 12) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f3f4f6" strokeWidth="6" />
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
    id: `DAB-${String(offset + i + 1).padStart(4, '0')}`,
    printer: ARTISANS[(offset + i) % ARTISANS.length], design: PRODUCTS[(offset + i) % PRODUCTS.length],
    status: STATUSES[(offset + i) % STATUSES.length], qty: ri(1, 20, ((offset + i) * 19) % 20) + 1,
    cost: ri(3500, 48000, ((offset + i) * 10807) % 44500) + 3500,
    date: new Date(2024, ((offset + i) % 12), ri(1, 28, (offset + i) % 28)).toISOString().slice(0, 10),
  }))

const daburecords = [
  { id: 'DAB-0001', printer: 'Akola Dabu Printers RJ', design: 'Dabu Indigo Parrot Saree', status: 'GI Rajasthan Dabu Mark', qty: 5, cost: 46000, date: '2024-01-15' },
  { id: 'DAB-0002', printer: 'Jodhpur Mud Resist Guild RJ', design: 'Dabu Mud Resist Bed Sheet', status: 'Mud Resist Adhesion QC', qty: 8, cost: 30000, date: '2024-01-28' },
  { id: 'DAB-0003', printer: 'Bamer Dabu Cluster RJ', design: 'Dabu Neem Leaf Panel', status: 'Neem Paste Fermentation Check', qty: 3, cost: 48000, date: '2024-02-10' },
  { id: 'DAB-0004', printer: 'Barmer Heritage Society RJ', design: 'Dabu Camel Caravan Yardage', status: 'Indigo Vat Dye Penetration', qty: 7, cost: 22000, date: '2024-02-22' },
  { id: 'DAB-0005', printer: 'Jaisalmer Desert Printers RJ', design: 'Dabu Flower Vine Runner', status: 'Wash Fastness Rating Test', qty: 4, cost: 44000, date: '2024-03-08' },
  { id: 'DAB-0006', printer: 'Phalodi Block Artisan RJ', design: 'Dabu Sun Ray Mural', status: 'Block Print Registration', qty: 6, cost: 26000, date: '2024-03-20' },
  { id: 'DAB-0007', printer: 'Dechhu Village Collective RJ', design: 'Dabu Peacock Feather Scroll', status: 'GI Rajasthan Dabu Mark', qty: 2, cost: 48000, date: '2024-04-03' },
  { id: 'DAB-0008', printer: 'Osian Traditional Print RJ', design: 'Dabu Desert Bloom Curtain', status: 'Mud Resist Adhesion QC', qty: 10, cost: 15000, date: '2024-04-16' },
  { id: 'DAB-0009', printer: 'Akola Dabu Printers RJ', design: 'Dabu Indigo Parrot Saree', status: 'Neem Paste Fermentation Check', qty: 5, cost: 42000, date: '2024-04-28' },
  { id: 'DAB-0010', printer: 'Jodhpur Mud Resist Guild RJ', design: 'Dabu Mud Resist Bed Sheet', status: 'Indigo Vat Dye Penetration', qty: 8, cost: 34000, date: '2024-05-10' },
  { id: 'DAB-0011', printer: 'Bamer Dabu Cluster RJ', design: 'Dabu Neem Leaf Panel', status: 'Wash Fastness Rating Test', qty: 3, cost: 48000, date: '2024-05-23' },
  { id: 'DAB-0012', printer: 'Barmer Heritage Society RJ', design: 'Dabu Camel Caravan Yardage', status: 'Block Print Registration', qty: 6, cost: 24000, date: '2024-06-05' },
  { id: 'DAB-0013', printer: 'Jaisalmer Desert Printers RJ', design: 'Dabu Flower Vine Runner', status: 'GI Rajasthan Dabu Mark', qty: 4, cost: 46000, date: '2024-06-18' },
  { id: 'DAB-0014', printer: 'Phalodi Block Artisan RJ', design: 'Dabu Sun Ray Mural', status: 'Mud Resist Adhesion QC', qty: 9, cost: 18000, date: '2024-07-01' },
  { id: 'DAB-0015', printer: 'Dechhu Village Collective RJ', design: 'Dabu Peacock Feather Scroll', status: 'Neem Paste Fermentation Check', qty: 7, cost: 30000, date: '2024-07-14' },
  { id: 'DAB-0016', printer: 'Osian Traditional Print RJ', design: 'Dabu Desert Bloom Curtain', status: 'Indigo Vat Dye Penetration', qty: 5, cost: 38000, date: '2024-07-26' },
  { id: 'DAB-0017', printer: 'Akola Dabu Printers RJ', design: 'Dabu Indigo Parrot Saree', status: 'Wash Fastness Rating Test', qty: 3, cost: 48000, date: '2024-08-08' },
  { id: 'DAB-0018', printer: 'Jodhpur Mud Resist Guild RJ', design: 'Dabu Mud Resist Bed Sheet', status: 'Block Print Registration', qty: 6, cost: 28000, date: '2024-08-20' },
  { id: 'DAB-0019', printer: 'Bamer Dabu Cluster RJ', design: 'Dabu Neem Leaf Panel', status: 'GI Rajasthan Dabu Mark', qty: 4, cost: 44000, date: '2024-09-02' },
  { id: 'DAB-0020', printer: 'Barmer Heritage Society RJ', design: 'Dabu Camel Caravan Yardage', status: 'Mud Resist Adhesion QC', qty: 8, cost: 20000, date: '2024-09-14' },
]

export default function DabuPrintRajasthanLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})

  const allRecords = [...daburecords, ...genRecords(21), ...genRecords(41)]

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
    <div className="dab-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Dabu Print' }]} />
      <PageHeader title="Dabu Print Rajasthan Logistics" description="Rajasthan Dabu mud resist hand block print supply chain with GI Rajasthan Dabu Mark certification, mud resist adhesion quality control, neem paste fermentation verification, indigo vat dye penetration testing, wash fastness rating analysis, and block print registration across 8 Dabu printer clusters in Akola Jodhpur Barmer and Jaisalmer regions" />
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="bg-gray-100">
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
            <HealthRing label="Mud" value={87} />
            <HealthRing label="Neem" value={84} />
            <HealthRing label="Indigo" value={90} />
            <HealthRing label="Fastness" value={88} />
            <HealthRing label="Block" value={85} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Dabu Families" value="30 Active" />
            <ValueTile label="Tradition" value="Since 1650 AD" />
            <ValueTile label="Export Markets" value="8 Countries" />
            <ValueTile label="Annual Revenue" value="₹3.6 Crore" />
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
            placeholder="Search Dabu print shipments..."
          />
          <div className="rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
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
                  <tr key={record.id} className="border-t hover:bg-gray-50/50">
                    <td className="p-3 font-mono text-xs">{record.id}</td>
                    <td className="p-3"><ProductBadge name={record.design} /></td>
                    <td className="p-3">{record.printer}</td>
                    <td className="p-3"><StatusBadge status={record.status} /></td>
                    <td className="p-3">{record.qty} {['sarees', 'sheets', 'panels', 'curtains'][parseInt(record.id.slice(4)) % 4]}</td>
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
              <CardHeader><CardTitle>Dabu Print — Ancient Rajasthani Mud Resist Block Printing Heritage</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">Dabu print represents one of the most distinctive and environmentally significant hand block printing traditions of Rajasthan having originated approximately three hundred fifty years ago in the arid western Rajasthan desert districts of Barmer Jodhpur and Jaisalmer where the traditional Khatri Chhipa printer communities developed a unique mud resist hand block printing technique using a specially prepared resist paste made from local desert clay mixed with decomposed cow dung chuna lime gum arabic and pounded wheat chaff fermented for seven days in an earthen pot to create a thick plastic resist paste that is hand-applied onto the unbleached cotton fabric using hand-carved teakwood blocks to create intricate pattern motifs before the fabric undergoes indigo dyeing in a traditional natural indigo fermentation vat where the mud resist paste protects the printed pattern areas from the indigo dye penetration creating the characteristic Dabu print effect of deep indigo blue background with lighter resist-printed pattern areas that reveal the natural cotton ground colour after the mud resist paste is washed off following the dyeing process producing the distinctive Dabu aesthetic of bold geometric and naturalistic motifs in cream and white against the deep indigo blue background where the Dabu printing technique is distinguished from other Rajasthani block printing traditions by the use of mud resist paste rather than wax resist or direct dye application creating unique textural and tonal qualities in the printed pattern with subtle variations in resist edge quality and indigo dye penetration depth that give each Dabu printed textile its individual handcrafted character where the traditional Dabu motifs draw heavily on the desert landscape and cultural life of western Rajasthan featuring camel caravan trains peacock feathers desert flowering plants geometric lattice patterns and stylised animal forms that reflect the harsh beauty and rich cultural heritage of the Thar Desert region where the Dabu printing communities have maintained this tradition through generations of hereditary practice adapting the craft to changing market demands while preserving the essential mud resist technique and natural indigo dyeing process that defines authentic Dabu print.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Mud Resist Adhesion QC & Neem Paste Fermentation Standards</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The mud resist adhesion quality control and neem paste fermentation verification protocols for Dabu print establish the primary technical quality assurance framework for the traditional mud resist block printing process that defines the authentic Dabu print visual quality and resist effectiveness characteristics where the mud resist adhesion test measures the bond strength and coverage uniformity of the Dabu resist paste on the cotton fabric using standardised tape peel testing and visual inspection under magnification confirming minimum adhesion rating of four on the five-point adhesion scale ensuring the resist paste maintains complete contact with the fabric surface during the indigo dyeing immersion without lifting cracking or detaching that would cause unwanted dye penetration into the resist-protected pattern areas creating blurred edges colour bleeding and loss of pattern definition that compromise the crisp graphic quality of the Dabu print design vocabulary where the resist paste thickness test measures the applied paste depth using digital micrometer measurement confirming paste thickness between zero point eight and one point five millimetres ensuring sufficient resist thickness to completely block indigo dye penetration during the multi-dip indigo dyeing sequence while maintaining the desirable tactile quality of the finished printed fabric where the neem paste fermentation test evaluates the pH value and antimicrobial efficacy of the neem leaf extract incorporated into the Dabu resist paste formulation using digital pH meter testing and agar diffusion antimicrobial assay confirming pH value between eight and nine indicating proper fermentation of the neem leaf and cow dung mixture and minimum antimicrobial inhibition zone of twelve millimetres confirming sufficient neem bioactive compound concentration to prevent mould and bacterial growth on the stored resist paste and on the printed fabric during the multi-day production cycle where the neem leaf extract serves the dual function of providing natural antimicrobial protection for the mud resist paste during the seven-day fermentation period and enhancing the fastness characteristics of the finished Dabu printed textile by inhibiting microbial degradation of the natural dye compounds on the printed fabric surface.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Indigo Vat Dye Penetration & Wash Fastness Rating Verification</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The indigo vat dye penetration and wash fastness rating verification protocols ensure the colour quality and durability of authentic Dabu printed textiles where the indigo vat dye penetration test measures the depth and uniformity of indigo dye absorption into the non-resist fabric areas using spectrophotometric colour analysis confirming indigo colour depth value L star between fifteen and twenty-five and colour uniformity delta E less than two across the dyed fabric surface ensuring the indigo blue colour penetrates the cotton fibre uniformly during the multiple indigo vat dipping cycles producing a deep even indigo blue background that provides maximum contrast with the lighter mud resist pattern areas where the indigo fermentation vat test confirms indigo concentration between three and five grams per litre of vat solution pH value between ten and eleven indicating adequate alkalinity for optimal indigo reduction and oxidation-reduction potential below negative two hundred millivolts confirming complete reduction of natural indigo to the soluble leuco-indigo form that penetrates the cotton fibre uniformly during each dipping cycle where each Dabu printed fabric piece typically undergoes between six and twelve indigo dipping cycles with intermediate air oxidation exposure between dips to develop the deep indigo blue colour intensity that characterises premium Dabu printed textiles where the wash fastness rating test evaluates the colour durability of the indigo blue background and the resist pattern definition using the ISO 105-C06 standardised washing procedure with ECE reference detergent at forty degrees Celsius for thirty minutes repeated for five cycles measuring colour change on the five-point grey scale and staining on adjacent multifibre fabric on the four-point staining scale confirming minimum ratings of four for colour change and three for staining ensuring the Dabu printed textile maintains its characteristic indigo blue colour intensity and sharp pattern definition after repeated home laundering without significant fading colour bleeding or loss of contrast between the indigo blue background and the cream-coloured resist pattern areas.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Block Print Registration & Dabu Heritage Market Development</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The block print registration verification and Dabu heritage market development framework provides the quality assurance and market infrastructure for the Dabu hand block printing supply chain ensuring that all GI-certified Dabu printed textile products meet the design authenticity standards while connecting the traditional Dabu Chhipa printer families with growing domestic and international market demand for authentic mud resist hand printed textiles where the block print registration test examines each printed panel against the master Dabu motif reference library maintained by the Barmer Dabu Printers Cooperative containing photographic documentation of over forty-five traditional Dabu motifs including the Parrot motif the Camel Caravan motif the Neem Leaf motif the Desert Flower motif and the Sun Ray motif verifying that the printed pattern accurately reproduces the traditional Dabu motif design with correct proportional relationships between pattern elements accurate block registration alignment and consistent mud resist paste application within the specified tolerance of plus or minus one millimetre for pattern alignment and plus or minus five percent for resist paste coverage ensuring the Dabu printed textile faithfully represents the traditional Dabu design vocabulary without modern simplification or alteration that would compromise the cultural authenticity and heritage value of the GI-certified Dabu printed product where the Dabu heritage market development initiative led by the Rajasthan State Handloom and Handicrafts Development Corporation in collaboration with the Barmer District Industrial Centre and the Jodhpur Craft Council has established a comprehensive cultural heritage market platform connecting the thirty active Dabu printer families with institutional buyers including the Rajasthan Government Emporium chain the Central Cottage Industries Emporium and international retailers specialising in sustainable handmade textile products who source GI-certified Dabu printed home textiles for their eco-friendly natural product collections where the growing global consumer preference for sustainable mud resist natural dye hand printed textile products has created exceptional market opportunities for authentic Dabu print positioning it as one of the most environmentally distinctive Indian hand block printing traditions with projected annual revenue growth of ten percent driven by expanding demand for sustainable handmade home furnishing products in the premium lifestyle retail market segment across Europe North America and East Asia.</p></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}



