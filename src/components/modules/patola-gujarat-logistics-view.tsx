import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#9f1239', '#881337', '#be123c', '#e11d48', '#f43f5e', '#9f1239', '#4c0519', '#fff1f2']
const PRODUCTS = ['Patola Double Ikat Sari', 'Patola Single Ikat Sari', 'Patola Temple Motif Shawl', 'Patola Elephant Design Stole', 'Patola Parrot Green Sari', 'Patola Floral Navratan Wrap', 'Patola Geometric Salancho', 'Patola Royal Patola Waistband']
const ARTISANS = ['Rajkot Patola Weaving GJ', 'Ahmedabad Salvi Family GJ', 'Surat Double Ikat Guild GJ', 'Vadodara Patola Cluster GJ', 'Bhavnagar Weaving Society GJ', 'Jamnagar Heritage Loom GJ', 'Junagadh Textile Art GJ', 'Gandhinagar Patola Collective GJ']
const STATUSES = ['GI Gujarat Patola Mark', 'Ikat Binding Precision QC', 'Natural Dye Penetration Test', 'Warp Weft Alignment Check', 'Silk Thread Tensile Test', 'Traditional Motif Fidelity Audit']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-rose-100 text-rose-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="w-24 h-2 bg-rose-200 rounded-full overflow-hidden"><div className="h-full bg-rose-700 rounded-full" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ label, value, size = 80 }: { label: string; value: number; size?: number }) => {
  const r = (size - 12) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#fff1f2" strokeWidth="6" />
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
    id: `PTL-${String(offset + i + 1).padStart(4, '0')}`,
    artisan: ARTISANS[(offset + i) % ARTISANS.length], design: PRODUCTS[(offset + i) % PRODUCTS.length],
    status: STATUSES[(offset + i) % STATUSES.length], qty: ri(1, 6, ((offset + i) * 19) % 6) + 1,
    cost: ri(15000, 250000, ((offset + i) * 11307) % 235000) + 15000,
    date: new Date(2024, ((offset + i) % 12), ri(1, 28, (offset + i) % 28)).toISOString().slice(0, 10),
  }))

const patolarecords = [
  { id: 'PTL-0001', artisan: 'Rajkot Patola Weaving GJ', design: 'Patola Double Ikat Sari', status: 'GI Gujarat Patola Mark', qty: 2, cost: 240000, date: '2024-01-06' },
  { id: 'PTL-0002', artisan: 'Ahmedabad Salvi Family GJ', design: 'Patola Single Ikat Sari', status: 'Ikat Binding Precision QC', qty: 3, cost: 180000, date: '2024-01-19' },
  { id: 'PTL-0003', artisan: 'Surat Double Ikat Guild GJ', design: 'Patola Temple Motif Shawl', status: 'Natural Dye Penetration Test', qty: 4, cost: 95000, date: '2024-02-01' },
  { id: 'PTL-0004', artisan: 'Vadodara Patola Cluster GJ', design: 'Patola Elephant Design Stole', status: 'Warp Weft Alignment Check', qty: 2, cost: 220000, date: '2024-02-14' },
  { id: 'PTL-0005', artisan: 'Bhavnagar Weaving Society GJ', design: 'Patola Parrot Green Sari', status: 'Silk Thread Tensile Test', qty: 5, cost: 45000, date: '2024-02-27' },
  { id: 'PTL-0006', artisan: 'Jamnagar Heritage Loom GJ', design: 'Patola Floral Navratan Wrap', status: 'Traditional Motif Fidelity Audit', qty: 3, cost: 200000, date: '2024-03-11' },
  { id: 'PTL-0007', artisan: 'Junagadh Textile Art GJ', design: 'Patola Geometric Salancho', status: 'GI Gujarat Patola Mark', qty: 4, cost: 80000, date: '2024-03-24' },
  { id: 'PTL-0008', artisan: 'Gandhinagar Patola Collective GJ', design: 'Patola Royal Patola Waistband', status: 'Ikat Binding Precision QC', qty: 2, cost: 250000, date: '2024-04-06' },
  { id: 'PTL-0009', artisan: 'Rajkot Patola Weaving GJ', design: 'Patola Double Ikat Sari', status: 'Natural Dye Penetration Test', qty: 3, cost: 160000, date: '2024-04-19' },
  { id: 'PTL-0010', artisan: 'Ahmedabad Salvi Family GJ', design: 'Patola Single Ikat Sari', status: 'Warp Weft Alignment Check', qty: 5, cost: 55000, date: '2024-05-02' },
  { id: 'PTL-0011', artisan: 'Surat Double Ikat Guild GJ', design: 'Patola Temple Motif Shawl', status: 'Silk Thread Tensile Test', qty: 2, cost: 230000, date: '2024-05-15' },
  { id: 'PTL-0012', artisan: 'Vadodara Patola Cluster GJ', design: 'Patola Elephant Design Stole', status: 'Traditional Motif Fidelity Audit', qty: 4, cost: 85000, date: '2024-05-28' },
  { id: 'PTL-0013', artisan: 'Bhavnagar Weaving Society GJ', design: 'Patola Parrot Green Sari', status: 'GI Gujarat Patola Mark', qty: 3, cost: 195000, date: '2024-06-10' },
  { id: 'PTL-0014', artisan: 'Jamnagar Heritage Loom GJ', design: 'Patola Floral Navratan Wrap', status: 'Ikat Binding Precision QC', qty: 2, cost: 245000, date: '2024-06-23' },
  { id: 'PTL-0015', artisan: 'Junagadh Textile Art GJ', design: 'Patola Geometric Salancho', status: 'Natural Dye Penetration Test', qty: 6, cost: 40000, date: '2024-07-06' },
  { id: 'PTL-0016', artisan: 'Gandhinagar Patola Collective GJ', design: 'Patola Royal Patola Waistband', status: 'Warp Weft Alignment Check', qty: 3, cost: 175000, date: '2024-07-19' },
  { id: 'PTL-0017', artisan: 'Rajkot Patola Weaving GJ', design: 'Patola Double Ikat Sari', status: 'Silk Thread Tensile Test', qty: 4, cost: 90000, date: '2024-08-01' },
  { id: 'PTL-0018', artisan: 'Ahmedabad Salvi Family GJ', design: 'Patola Single Ikat Sari', status: 'Traditional Motif Fidelity Audit', qty: 2, cost: 235000, date: '2024-08-14' },
  { id: 'PTL-0019', artisan: 'Surat Double Ikat Guild GJ', design: 'Patola Temple Motif Shawl', status: 'GI Gujarat Patola Mark', qty: 5, cost: 60000, date: '2024-08-27' },
  { id: 'PTL-0020', artisan: 'Vadodara Patola Cluster GJ', design: 'Patola Elephant Design Stole', status: 'Ikat Binding Precision QC', qty: 3, cost: 185000, date: '2024-09-09' },
]

export default function PatolaGujaratLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})

  const allRecords = [...patolarecords, ...genRecords(21), ...genRecords(41)]

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
    <div className="ptl-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Patola Art' }]} />
      <PageHeader title="Patola Gujarat Logistics" description="Gujarat Patola double ikat silk handloom supply chain with GI Gujarat Patola Mark certification ikat binding precision quality control natural dye penetration testing warp weft alignment verification silk thread tensile strength testing and traditional motif fidelity audit across 8 Patola weaving clusters in Rajkot Ahmedabad Surat and Vadodara" />
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="bg-rose-100">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <KpiTile label="Total Shipments" value={allRecords.length} />
            <KpiTile label="Active Designs" value={PRODUCTS.length} />
            <KpiTile label="Weaving Clusters" value={ARTISANS.length} />
            <KpiTile label="Avg Cost" value={`₹${Math.round(allRecords.reduce((s, r) => s + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>
          <div className="grid grid-cols-6 gap-4">
            <HealthRing label="GI Tag" value={96} />
            <HealthRing label="Ikat" value={89} />
            <HealthRing label="Dye" value={92} />
            <HealthRing label="Warp" value={87} />
            <HealthRing label="Silk" value={94} />
            <HealthRing label="Motif" value={91} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Salvi Families" value="8 Active" />
            <ValueTile label="Tradition" value="Since 700 AD" />
            <ValueTile label="Export Markets" value="3 Countries" />
            <ValueTile label="Annual Revenue" value="₹2.5 Crore" />
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
            placeholder="Search Patola art shipments..."
          />
          <div className="rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-rose-100">
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
                  <tr key={record.id} className="border-t hover:bg-rose-50/50">
                    <td className="p-3 font-mono text-xs">{record.id}</td>
                    <td className="p-3"><ProductBadge name={record.design} /></td>
                    <td className="p-3">{record.artisan}</td>
                    <td className="p-3"><StatusBadge status={record.status} /></td>
                    <td className="p-3">{record.qty} {['saris', 'shawls', 'stoles', 'wraps'][parseInt(record.id.slice(4)) % 4]}</td>
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
              <CardHeader><CardTitle>Patola Gujarat — Thirteen Century Rajkot Double Ikat Silk Tradition</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">Patola represents one of the most technically demanding and culturally prestigious handloom weaving traditions of India originating in Patan in the former princely state of Gujarat where the Salvi weaving family has maintained the unbroken double ikat silk weaving tradition for over thirteen hundred years since approximately seven hundred AD making it one of the oldest continuously practised textile art forms in the world where the term Patola derives from the Sanskrit word pattola meaning silk cloth and the Patola weaving technique involves the extraordinarily complex process of double ikat where both the warp and weft silk threads are individually resist-dyed with the precise pattern colours before weaving so that the pattern emerges only when the pre-dyed warp and weft threads intersect on the loom at exactly the correct alignment producing a perfectly registered pattern on both sides of the fabric that is virtually identical in colour and detail on the front and reverse sides of the cloth a technical feat unmatched by any other textile weaving tradition in the world where the traditional Patola double ikat process requires a minimum of four to six months to complete a single sari with the most elaborate designs requiring up to twelve months of painstaking preparation and weaving work where the process begins with the selection of the finest quality mulberry silk yarn from Karnataka which is then meticulously tied and resist-bound with cotton thread at thousands of precisely calculated points on each individual warp and weft thread using a traditional tying frame where the number of tying operations for a single Patola sari can exceed one hundred thousand individual thread bindings each requiring exact positioning to ensure the pattern alignment across the full width of the fabric where after each tying operation the threads are dyed in the specified colour following the traditional Patola colour sequence of red from the madder root Rubia cordifolia blue from the indigo plant Indigofera tinctoria yellow from the turmeric root Curcuma longa green from the pomegranate rind and myrobalan mixture and the distinctive Patola black from the iron-acetate preparation using iron filings soaked in vinegar and jaggery solution where the dyeing process typically requires seven to twelve separate dye baths for each colour in the pattern with additional tying operations between each dye bath to protect previously dyed areas from subsequent colour applications producing the characteristic rich vivid multi-coloured pattern that is the signature visual quality of authentic Gujarat Patola.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Ikat Binding Precision QC and Natural Dye Penetration Standards</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The ikat binding precision quality control and natural dye penetration testing protocols for Gujarat Patola establish the primary technical quality assurance framework for the traditional double ikat silk weaving process that ensures the pattern accuracy and colour quality of authentic GI-certified Patola products where the ikat binding precision test evaluates the accuracy of the resist-binding process that determines which portions of each silk thread receive dye and which portions remain undyed producing the pattern on the finished fabric where the binding precision test measures the position accuracy of each resist-binding point on the warp and weft threads using digital microscopy at thirty-times magnification confirming each binding point is positioned within plus or minus zero point two millimetres of the calculated pattern position where any binding point deviating beyond this tolerance results in a visible pattern misregistration on the finished fabric that appears as a blurred or offset pattern element which significantly reduces the commercial and artistic value of the Patola product where the binding consistency test examines the tension uniformity of all resist-binding points on a single thread confirming the binding tension is consistent within plus or minus five percent across the entire thread length ensuring the resist dye exclusion is equally effective at all binding points without variations in dye leakage that would produce uneven pattern edges where the natural dye penetration test evaluates the depth and uniformity of dye absorption into the silk fibre using the standard cross-sectional dye penetration test where a sample dyed thread is embedded in epoxy resin and sectioned at twenty micrometres thickness using an ultramicrotome then examined under transmitted light microscopy at two hundred times magnification confirming the dye has penetrated through the full silk fibre cross-section from the sericin outer coating through the fibroin core without surface-only dyeing that produces a pale or washed-out colour appearance and without uneven penetration that produces a ring-like dye distribution pattern within the fibre cross-section where the dye penetration depth is measured as the percentage of the fibre cross-sectional area showing visible dye colouration confirming the penetration exceeds ninety-five percent for madder red and indigo blue dye applications.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Warp Weft Alignment and Silk Thread Tensile Strength Verification</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The warp weft alignment verification and silk thread tensile strength testing protocols ensure the structural quality and pattern registration accuracy of authentic Gujarat Patola double ikat silk fabrics where the warp weft alignment test evaluates the precision of the intersection between pre-dyed warp and weft threads on the loom confirming that the pre-dyed pattern elements on the warp threads align correctly with the corresponding pre-dyed pattern elements on the weft threads at each intersection point across the entire fabric width where the alignment accuracy is measured using digital scanning of the finished fabric at six hundred dots per inch resolution comparing the actual pattern registration against the design template confirming the pattern alignment deviation is less than zero point five millimetres at any point across the fabric surface where alignment deviations exceeding this tolerance produce visible pattern blurring and colour mixing at the pattern edges that are immediately apparent to trained Patola quality inspectors and significantly reduce the commercial value of the finished sari where the alignment consistency test measures the pattern registration stability across the full fabric length confirming the alignment does not drift or progressively shift from the beginning to the end of the woven fabric which would indicate loom tension irregularities or inconsistent weaving technique where the silk thread tensile strength test evaluates the mechanical quality of the mulberry silk yarn used in the Patola weaving process using the standard single-fibre tensile test method where individual silk fibres are clamped in a universal testing machine and subjected to increasing tensile force until breaking confirming the minimum breaking force for Patola silk fibres meets or exceeds five grams force per denier and the elongation at break is between fifteen and twenty-five percent of the original fibre length which are the established quality benchmarks for premium mulberry silk suitable for Patola double ikat weaving where the silk thread diameter uniformity test measures the cross-sectional diameter variation along individual silk threads confirming the diameter variation is within plus or minus three percent along the thread length ensuring consistent thread thickness that produces uniform fabric weight and even drape across the finished Patola sari without visible thick or thin thread sections that would appear as fabric texture irregularities.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Traditional Motif Fidelity Audit and Patola Heritage Market Development</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The traditional motif fidelity audit and Patola heritage market development framework provides the artistic quality assurance and commercial market infrastructure for the Gujarat Patola double ikat silk supply chain ensuring that all GI-certified Patola products demonstrate the authentic traditional motif vocabulary and cultural design integrity that defines the thirteen-century Rajkot Patan Patola weaving tradition while connecting the eight active Patola weaving families across Rajkot Ahmedabad Surat Vadodara Bhavnagar Jamnagar Junagadh and Gandhinagar with growing institutional and international collector market demand for authentic Gujarat double ikat silk textiles where the traditional motif fidelity audit evaluates the presence and accuracy of the characteristic Patola design vocabulary elements that distinguish authentic Salvi-family Patola from non-traditional reproductions and machine-imitated ikat textiles including the sacred Vohra Gaj or elephant motif representing royal authority and prosperity the Nari Kunj or human figure motif depicting celestial dancers and temple attendants the Pan Bhat or leaf motif representing the sacred pipal tree and natural abundance the Navratna or nine-gem geometric pattern representing the nine planetary deities of Hindu astrology the Panch Pandava or five-hero geometric pattern and the characteristic Patola border designs featuring elaborate geometric and floral pattern bands that frame the central field composition where the motif execution test verifies the sharpness and clarity of each pattern element confirming the pre-dyed ikat pattern produces clean crisp pattern edges without the characteristic ikat blur or feathering effect that is acceptable in single ikat weaving but is considered a quality defect in the technically superior double ikat Patola tradition where the traditional Patola colour palette test confirms the use of the authentic five-colour Patola palette of deep madder red indigo blue turmeric yellow pomegranate green and iron black without any synthetic or non-traditional colour additions that would compromise the heritage authenticity of the GI-certified Patola product where the Patola heritage market development initiative led by the Gujarat State Handloom and Handicrafts Development Corporation in collaboration with the National Handloom Development Corporation the Patola Weavers Cooperative Society and the Calico Museum of Textiles Ahmedabad has established institutional patronage and exhibition programmes connecting the active Patola weaving families with the Gujarat State Emporium and international cultural exhibitions with projected annual revenue growth of thirty-five percent.</p></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}



