import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#7e22ce', '#9333ea', '#a855f7', '#c084fc', '#d8b4fe', '#6b21a8', '#581c87', '#faf5ff']
const PRODUCTS = ['Patola Double Ikat Saree', 'Rajkot Patola Silk Stole', 'Vegetable-Dyed Patola Dupatta', 'Patola Temple Border Saree', 'Narayanpura Ikat Wall Panel', 'Patola Bridal Wear Set', 'Handloom Patola Table Runner', 'Patola Cotton Ikat Scarf']
const WEAVERS = ['Patola Artisan Weavers Society', 'Rajkot Ikat Weaving Guild', 'Narayanpura Heritage Weavers', 'Surendranagar Patola Colony', 'Wadhwan Patola Workshop', 'Sayla Double Ikat Centre', 'Ahmedabad Patola Emporium', 'Limbdi Patola Cooperative']
const STATUSES = ['GI Patola Ikat Mark', 'IS 16914 Patola Textile Grade A', 'Tissue-Wrapped Silk Roll', 'Air-Conditioned Truck Transit', 'Humidity-Free Vault 20-25C', 'Ikat Alignment QC']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-purple-100 text-purple-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="w-24 h-2 bg-purple-200 rounded-full overflow-hidden"><div className="h-full bg-purple-700 rounded-full" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ label, value, size = 80 }: { label: string; value: number; size?: number }) => {
  const r = (size - 12) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#faf5ff" strokeWidth="6" />
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
    id: `PDI-${String(offset + i + 1).padStart(4, '0')}`,
    weaver: WEAVERS[(offset + i) % WEAVERS.length], ware: PRODUCTS[(offset + i) % PRODUCTS.length],
    status: STATUSES[(offset + i) % STATUSES.length], qty: ri(1, 150, ((offset + i) * 37) % 150) + 1,
    cost: ri(5000, 95000, ((offset + i) * 13097) % 90000) + 5000,
    date: new Date(2024, ((offset + i) % 12), ri(1, 28, (offset + i) % 28)).toISOString().slice(0, 10),
  }))

const patolaRecords = [
  { id: 'PDI-0001', weaver: 'Patola Artisan Weavers Society', ware: 'Patola Double Ikat Saree', status: 'GI Patola Ikat Mark', qty: 6, cost: 85000, date: '2024-01-05' },
  { id: 'PDI-0002', weaver: 'Rajkot Ikat Weaving Guild', ware: 'Rajkot Patola Silk Stole', status: 'IS 16914 Patola Textile Grade A', qty: 25, cost: 15000, date: '2024-01-15' },
  { id: 'PDI-0003', weaver: 'Narayanpura Heritage Weavers', ware: 'Vegetable-Dyed Patola Dupatta', status: 'Tissue-Wrapped Silk Roll', qty: 40, cost: 8500, date: '2024-02-03' },
  { id: 'PDI-0004', weaver: 'Surendranagar Patola Colony', ware: 'Patola Temple Border Saree', status: 'Air-Conditioned Truck Transit', qty: 10, cost: 72000, date: '2024-02-18' },
  { id: 'PDI-0005', weaver: 'Wadhwan Patola Workshop', ware: 'Narayanpura Ikat Wall Panel', status: 'Humidity-Free Vault 20-25C', qty: 8, cost: 45000, date: '2024-03-02' },
  { id: 'PDI-0006', weaver: 'Sayla Double Ikat Centre', ware: 'Patola Bridal Wear Set', qty: 4, cost: 92000, date: '2024-03-15', status: 'Ikat Alignment QC' },
  { id: 'PDI-0007', weaver: 'Ahmedabad Patola Emporium', ware: 'Handloom Patola Table Runner', status: 'GI Patola Ikat Mark', qty: 30, cost: 6200, date: '2024-03-28' },
  { id: 'PDI-0008', weaver: 'Limbdi Patola Cooperative', ware: 'Patola Cotton Ikat Scarf', status: 'IS 16914 Patola Textile Grade A', qty: 55, cost: 4200, date: '2024-04-10' },
  { id: 'PDI-0009', weaver: 'Patola Artisan Weavers Society', ware: 'Rajkot Patola Silk Stole', status: 'Tissue-Wrapped Silk Roll', qty: 20, cost: 12000, date: '2024-04-22' },
  { id: 'PDI-0010', weaver: 'Rajkot Ikat Weaving Guild', ware: 'Patola Double Ikat Saree', status: 'Air-Conditioned Truck Transit', qty: 8, cost: 88000, date: '2024-05-05' },
  { id: 'PDI-0011', weaver: 'Narayanpura Heritage Weavers', ware: 'Vegetable-Dyed Patola Dupatta', status: 'Humidity-Free Vault 20-25C', qty: 35, cost: 7800, date: '2024-05-18' },
  { id: 'PDI-0012', weaver: 'Surendranagar Patola Colony', ware: 'Patola Temple Border Saree', status: 'Ikat Alignment QC', qty: 7, cost: 78000, date: '2024-06-01' },
  { id: 'PDI-0013', weaver: 'Wadhwan Patola Workshop', ware: 'Narayanpura Ikat Wall Panel', status: 'GI Patola Ikat Mark', qty: 12, cost: 48000, date: '2024-06-14' },
  { id: 'PDI-0014', weaver: 'Sayla Double Ikat Centre', ware: 'Patola Bridal Wear Set', status: 'IS 16914 Patola Textile Grade A', qty: 3, cost: 95000, date: '2024-06-28' },
  { id: 'PDI-0015', weaver: 'Ahmedabad Patola Emporium', ware: 'Handloom Patola Table Runner', status: 'Tissue-Wrapped Silk Roll', qty: 28, cost: 5800, date: '2024-07-08' },
  { id: 'PDI-0016', weaver: 'Limbdi Patola Cooperative', ware: 'Patola Cotton Ikat Scarf', status: 'Air-Conditioned Truck Transit', qty: 50, cost: 3800, date: '2024-07-18' },
  { id: 'PDI-0017', weaver: 'Patola Artisan Weavers Society', ware: 'Patola Temple Border Saree', status: 'Humidity-Free Vault 20-25C', qty: 9, cost: 75000, date: '2024-07-25' },
  { id: 'PDI-0018', weaver: 'Rajkot Ikat Weaving Guild', ware: 'Patola Bridal Wear Set', status: 'Ikat Alignment QC', qty: 5, cost: 92000, date: '2024-08-02' },
  { id: 'PDI-0019', weaver: 'Narayanpura Heritage Weavers', ware: 'Patola Cotton Ikat Scarf', status: 'GI Patola Ikat Mark', qty: 60, cost: 3500, date: '2024-08-12' },
  { id: 'PDI-0020', weaver: 'Surendranagar Patola Colony', ware: 'Narayanpura Ikat Wall Panel', status: 'IS 16914 Patola Textile Grade A', qty: 10, cost: 42000, date: '2024-08-22' },
]

export default function PatolaDoubleIkatGujaratLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = [...patolaRecords, ...genRecords(21), ...genRecords(41)]

  const filteredRecords = useMemo(() => {
    if (!searchQuery && Object.keys(activeFilters).every(k => !activeFilters[k].length)) return allRecords
    const sq = searchQuery.toLowerCase()
    return allRecords.filter(r => { if (sq && !r.id.toLowerCase().includes(sq) && !r.ware.toLowerCase().includes(sq)) return false; return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string)); })
  }, [searchQuery, activeFilters, allRecords])

  const filterGroups = [
    { key: 'ware', label: 'Ware', options: PRODUCTS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.ware === p).length })) },
    { key: 'weaver', label: 'Weaver', options: WEAVERS.map(w => ({ value: w, label: w, count: allRecords.filter(r => r.weaver === w).length })) },
  ]

  const trendData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m, i) => ({ month: m, shipments: ri(10, 55, allRecords.length * 0.25 + i * 8) }))
  const weaverChart = WEAVERS.map(w => ({ name: w.split(' ').slice(0, 2).join(' '), volume: allRecords.filter(r => r.weaver === w).reduce((s, r) => s + r.qty, 0) }))
  const statusPie = STATUSES.map(s => ({ name: s, value: allRecords.filter(r => r.status === s).length }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="pdi-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Patola Double Ikat Gujarat' }]} />
      <PageHeader title="Patola Double Ikat Gujarat Logistics" description="Gujarat Patola double ikat silk supply chain with IS 16914 Patola textile compliance, warp-weft alignment QC, tissue-wrapped silk roll packaging, and GI Patola Ikat Mark certification across 8 heritage artisan clusters in Patan and Rajkot districts" />
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="bg-purple-100">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <KpiTile label="Total Shipments" value={allRecords.length} />
            <KpiTile label="Active Ware" value={PRODUCTS.length} />
            <KpiTile label="Weaver Clusters" value={WEAVERS.length} />
            <KpiTile label="Avg Cost" value={`₹${Math.round(allRecords.reduce((s, r) => s + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>
          <div className="grid grid-cols-6 gap-4">
            <HealthRing label="GI Tag" value={94} />
            <HealthRing label="IS 16914" value={90} />
            <HealthRing label="Silk" value={88} />
            <HealthRing label="Truck" value={85} />
            <HealthRing label="Vault" value={92} />
            <HealthRing label="Ikat" value={96} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Artisan Families" value="500+" />
            <ValueTile label="Patan District" value="Since 12th C" />
            <ValueTile label="Export Markets" value="18 Countries" />
            <ValueTile label="Annual Revenue" value="₹18 Crore" />
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
            placeholder="Search Patola ikat shipments..."
          />
          <div className="rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-purple-100">
                <tr>
                  <th className="p-3 text-left font-medium">ID</th>
                  <th className="p-3 text-left font-medium">Ware</th>
                  <th className="p-3 text-left font-medium">Weaver</th>
                  <th className="p-3 text-left font-medium">Status</th>
                  <th className="p-3 text-left font-medium">Qty</th>
                  <th className="p-3 text-left font-medium">Cost</th>
                  <th className="p-3 text-left font-medium">Cost Bar</th>
                  <th className="p-3 text-left font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map(record => (
                  <tr key={record.id} className="border-t hover:bg-purple-50/50">
                    <td className="p-3 font-mono text-xs">{record.id}</td>
                    <td className="p-3"><ProductBadge name={record.ware} /></td>
                    <td className="p-3">{record.weaver}</td>
                    <td className="p-3"><StatusBadge status={record.status} /></td>
                    <td className="p-3">{record.qty} {['pcs', 'sets', 'pairs', 'units'][parseInt(record.id.slice(4)) % 4]}</td>
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
              <CardHeader><CardTitle>Weaver Volume</CardTitle></CardHeader>
              <CardContent>
                <BarChart width={500} height={300} data={weaverChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="volume" fill={COLORS[0]}>
                    {weaverChart.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
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
              <CardHeader><CardTitle>Patola Double Ikat — 900-Year Gujarati Silk Weaving of Patan</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Patola double ikat is one of the world's most complex and labour-intensive textile traditions, originating from Patan in Gujarat where Salvi weavers have practised this extraordinary art for over 900 years since their migration from Karnataka in the twelfth century under the patronage of the Solanki dynasty rulers. Unlike single ikat techniques where only the warp or weft is resist-dyed before weaving, Patola double ikat requires both warp and weft threads to be individually resist-dyed with extraordinary precision so that the patterns interlock perfectly when woven on a traditional handloom, demanding months of meticulous calculation and dyeing work before even a single inch of cloth is produced on the loom. Each Patola saree requires a minimum of four to six months of dedicated work by a master weaver and assistant, involving over 10,000 individual thread-dyeing operations where each silk thread is wrapped with resist material at precisely calculated intervals, dyed in the correct colour sequence, unwrapped, and re-wrapped for the next colour application, a process repeated multiple times for the elaborate multi-coloured designs featuring geometric patterns, floral motifs, animal figures, and sacred Hindu temple iconography that characterise authentic Patola work. The traditional Patola colour palette is derived entirely from natural vegetable and mineral dyes sourced from Gujarat's indigenous plant species, including pomegranate rind for yellow, indigo for blue, madder root for red, and iron rust for black, creating the vibrant yet harmonious colour combinations that have made Patola sarees among the most prized textile treasures in Indian cultural heritage. Today fewer than 500 artisan families across three primary clusters in Patan, Rajkot, and Surendranagar districts sustain this tradition, with annual turnover estimated at 18 crore rupees through domestic bridal and ceremonial markets, government emporium sales, and premium export demand from Indian diaspora communities and international textile collectors who value authentic Patola double ikat as museum-quality wearable art.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>IS 16914 Patola Textile Standards & Warp-Weft Alignment QC</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">The IS 16914 standard for Patola double ikat textiles establishes India's comprehensive quality certification framework for this extraordinary Gujarati silk weaving tradition, ensuring the exceptional precision and quality that distinguishes genuine Patola from simpler single ikat or printed imitations flooding the commercial textile market. The standard specifies stringent requirements for the silk yarn substrate, mandating Grade 5A mulberry silk with minimum filament length of 800 metres per cocoon and twist density of 60 twists per metre for warp threads and 40 twists per metre for weft threads, ensuring the fine silk maintains the structural integrity necessary for the complex double ikat weaving process where both thread systems undergo extensive resist-dyeing manipulation before interlacing on the handloom. Dye quality requirements mandate natural vegetable-based dyes for Grade A certification, with minimum colourfastness ratings of 4 on the ISO 105-C06 washing scale and 6 on the ISO 105-B02 lightfastness scale, ensuring the vibrant Patola colours resist fading through years of wear and display. The defining quality parameter for IS 16914 certification is the warp-weft alignment accuracy, where the resist-dyed pattern on the warp threads must interlock with the corresponding pattern on the weft threads to within 0.5 millimetre tolerance at every pattern intersection point across the entire fabric width, verified through 20x magnification inspection at NABL-accredited textile testing laboratories. Any deviation exceeding this tolerance at more than three intersection points per square centimetre results in automatic downgrade to Grade B classification, reflecting the extraordinary precision demanded by the double ikat technique where even minor misalignment is visible to the trained eye and diminishes the value and authenticity of the finished Patola textile product.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Tissue-Wrapped Silk Roll Packaging for Patola Textiles</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Tissue-wrapped silk roll packaging has been specifically designed for Patola double ikat textiles to protect the delicate multi-coloured silk surfaces, precise warp-weft alignment, and natural vegetable dye colours from the physical and environmental hazards encountered during transit from Patan district handloom workshops to bridal showrooms, government emporiums, and international export destinations across the globe. Each individual Patola saree or textile piece undergoes a meticulous wrapping protocol beginning with a layer of acid-free tissue paper interleaved along the entire fabric length to prevent dye transfer between the closely folded layers of multi-coloured ikat patterns where adjacent colours can bleed if in direct contact during prolonged transit vibration and humidity exposure. The tissue-interleaved fabric is then carefully rolled around a custom-sewn cotton batting core to prevent sharp fold creases that would permanently damage the fine silk warp and weft threads and disrupt the precise ikat pattern alignment across the fabric width. The rolled textile is wrapped in breathable unbleached cotton muslin and placed inside a rigid cylindrical tube constructed from reinforced kraft paper with foam end caps, providing crush resistance and moisture barrier protection during stacking and transit in shared cargo containers. Silica gel desiccant packets rated for 100 gram absorption capacity are placed within each tube to maintain relative humidity below 40% during transit, as the natural vegetable dyes used in authentic Patola production are particularly sensitive to high humidity conditions that can cause dye migration and colour bleeding between the intricate ikat pattern boundaries. This tissue-wrapped roll packaging system has been tested to ISTA 3A transit simulation protocols, demonstrating capability to withstand drops from 90 centimetres and compression forces of 200 kilograms without any fabric damage, reducing the historical transit damage rate for Patola textiles from 15% to under 2% since its adoption across the certified Patola supply chain.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>AI Ikat Alignment Verification & Patola Textile Market Expansion</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Artificial intelligence and advanced imaging technologies are bringing transformative quality assurance capabilities to the Patola double ikat craft, where the extraordinary warp-weft alignment precision that defines genuine Patola work has traditionally required decades of master weaver experience to assess and certify consistently across different production batches and artisan workshops. The AI verification system employs high-resolution flatbed scanning at 1200 dots per inch to capture precise digital images of finished Patola textiles, analysing every pattern intersection point across the fabric width with sub-pixel accuracy to measure warp-weft alignment deviation with precision to 0.05 millimetres, detecting alignment errors that are virtually invisible to the human eye but would disqualify a piece from Grade A certification under IS 16914 standards. Computer vision algorithms trained on over 18,000 authenticated Patola pattern compositions can verify design authenticity by comparing geometric pattern precision, colour palette consistency, border symmetry, and traditional motif placement against a reference database of master weaver works from each of the surviving Patan and Rajkot Salvi weaving families, providing objective quality grading that supplements the traditional assessment by experienced Patola craft evaluators. The Gujarat State Handloom and Handicrafts Development Corporation has begun piloting this AI verification in its export certification pipeline, reducing quality rejection rates at government Handloom Haat emporiums from 20% to under 5% while accelerating the certification timeline from 10 working days to under 48 hours for qualifying Patola shipments. India's GI protection for Patola double ikat, combined with the emerging digital authentication infrastructure, has strengthened export partnerships with premium textile galleries in Japan, Italy, the United Kingdom, and the United States who demand verifiable provenance documentation and quality certification for authentic Patola double ikat pieces that command premium prices ranging from 50,000 to over 200,000 rupees per saree depending on complexity and pattern density.</p></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
