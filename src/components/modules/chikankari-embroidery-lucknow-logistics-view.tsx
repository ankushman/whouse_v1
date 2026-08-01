import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#0e7490', '#0891b2', '#06b6d4', '#22d3ee', '#67e8f9', '#155e75', '#164e63', '#ecfeff']
const PRODUCTS = ['Chikankari Mulmul Kurta Set', 'Lucknowi Shadow Work Saree', 'Chikan Cotton Embroidered Suit', 'Mukaish Zardozi Chikan Panel', 'Lucknowi Tepchi Work Dupatta', 'Chikan Phanda Embroidered Gown', 'Bakhiya Shadow Work Salwar Set', 'Chikankari Muslin Stole']
const EMBROIDERERS = ['Lucknow Chikan Artisan Guild', 'Chowk Heritage Embroidery Centre', 'Aminabad Chikan Weavers Society', 'Old City Chikan Workshop', 'Hazratganj Embroidery Colony', 'Nakhas Chikankari Cooperative', 'Aliganj Shadow Work Studio', 'Gomti Nagar Chikan Art Centre']
const STATUSES = ['GI Chikankari Craft Mark', 'IS 16915 Chikan Embroidery Grade A', 'Acid-Free Tissue Flat Pack', 'Temperature-Controlled Van Transit', 'Moisture-Free Storage 18-25C', 'Stitch Tension QC']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-cyan-100 text-cyan-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="w-24 h-2 bg-cyan-200 rounded-full overflow-hidden"><div className="h-full bg-cyan-700 rounded-full" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ label, value, size = 80 }: { label: string; value: number; size?: number }) => {
  const r = (size - 12) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#ecfeff" strokeWidth="6" />
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
    id: `CEL-${String(offset + i + 1).padStart(4, '0')}`,
    embroiderer: EMBROIDERERS[(offset + i) % EMBROIDERERS.length], ware: PRODUCTS[(offset + i) % PRODUCTS.length],
    status: STATUSES[(offset + i) % STATUSES.length], qty: ri(1, 300, ((offset + i) * 37) % 300) + 1,
    cost: ri(800, 32000, ((offset + i) * 13097) % 31200) + 800,
    date: new Date(2024, ((offset + i) % 12), ri(1, 28, (offset + i) % 28)).toISOString().slice(0, 10),
  }))

const chikanRecords = [
  { id: 'CEL-0001', embroiderer: 'Lucknow Chikan Artisan Guild', ware: 'Chikankari Mulmul Kurta Set', status: 'GI Chikankari Craft Mark', qty: 45, cost: 4800, date: '2024-01-08' },
  { id: 'CEL-0002', embroiderer: 'Chowk Heritage Embroidery Centre', ware: 'Lucknowi Shadow Work Saree', status: 'IS 16915 Chikan Embroidery Grade A', qty: 20, cost: 15000, date: '2024-01-20' },
  { id: 'CEL-0003', embroiderer: 'Aminabad Chikan Weavers Society', ware: 'Chikan Cotton Embroidered Suit', status: 'Acid-Free Tissue Flat Pack', qty: 80, cost: 3200, date: '2024-02-05' },
  { id: 'CEL-0004', embroiderer: 'Old City Chikan Workshop', ware: 'Mukaish Zardozi Chikan Panel', status: 'Temperature-Controlled Van Transit', qty: 15, cost: 28000, date: '2024-02-18' },
  { id: 'CEL-0005', embroiderer: 'Hazratganj Embroidery Colony', ware: 'Lucknowi Tepchi Work Dupatta', status: 'Moisture-Free Storage 18-25C', qty: 100, cost: 1800, date: '2024-03-02' },
  { id: 'CEL-0006', embroiderer: 'Nakhas Chikankari Cooperative', ware: 'Chikan Phanda Embroidered Gown', qty: 25, cost: 8500, date: '2024-03-15', status: 'Stitch Tension QC' },
  { id: 'CEL-0007', embroiderer: 'Aliganj Shadow Work Studio', ware: 'Bakhiya Shadow Work Salwar Set', status: 'GI Chikankari Craft Mark', qty: 60, cost: 4200, date: '2024-03-28' },
  { id: 'CEL-0008', embroiderer: 'Gomti Nagar Chikan Art Centre', ware: 'Chikankari Muslin Stole', status: 'IS 16915 Chikan Embroidery Grade A', qty: 120, cost: 1200, date: '2024-04-10' },
  { id: 'CEL-0009', embroiderer: 'Lucknow Chikan Artisan Guild', ware: 'Mukaish Zardozi Chikan Panel', status: 'Acid-Free Tissue Flat Pack', qty: 12, cost: 25000, date: '2024-04-22' },
  { id: 'CEL-0010', embroiderer: 'Chowk Heritage Embroidery Centre', ware: 'Chikankari Mulmul Kurta Set', status: 'Temperature-Controlled Van Transit', qty: 55, cost: 5200, date: '2024-05-05' },
  { id: 'CEL-0011', embroiderer: 'Aminabad Chikan Weavers Society', ware: 'Lucknowi Shadow Work Saree', status: 'Moisture-Free Storage 18-25C', qty: 18, cost: 16500, date: '2024-05-18' },
  { id: 'CEL-0012', embroiderer: 'Old City Chikan Workshop', ware: 'Chikan Phanda Embroidered Gown', status: 'Stitch Tension QC', qty: 22, cost: 9200, date: '2024-06-01' },
  { id: 'CEL-0013', embroiderer: 'Hazratganj Embroidery Colony', ware: 'Bakhiya Shadow Work Salwar Set', status: 'GI Chikankari Craft Mark', qty: 70, cost: 3800, date: '2024-06-14' },
  { id: 'CEL-0014', embroiderer: 'Nakhas Chikankari Cooperative', ware: 'Chikankari Muslin Stole', status: 'IS 16915 Chikan Embroidery Grade A', qty: 150, cost: 1000, date: '2024-06-28' },
  { id: 'CEL-0015', embroiderer: 'Aliganj Shadow Work Studio', ware: 'Lucknowi Tepchi Work Dupatta', status: 'Acid-Free Tissue Flat Pack', qty: 90, cost: 1600, date: '2024-07-08' },
  { id: 'CEL-0016', embroiderer: 'Gomti Nagar Chikan Art Centre', ware: 'Chikan Cotton Embroidered Suit', status: 'Temperature-Controlled Van Transit', qty: 65, cost: 4500, date: '2024-07-18' },
  { id: 'CEL-0017', embroiderer: 'Lucknow Chikan Artisan Guild', ware: 'Mukaish Zardozi Chikan Panel', status: 'Moisture-Free Storage 18-25C', qty: 10, cost: 30000, date: '2024-07-25' },
  { id: 'CEL-0018', embroiderer: 'Chowk Heritage Embroidery Centre', ware: 'Lucknowi Shadow Work Saree', status: 'Stitch Tension QC', qty: 16, cost: 18000, date: '2024-08-02' },
  { id: 'CEL-0019', embroiderer: 'Aminabad Chikan Weavers Society', ware: 'Chikankari Mulmul Kurta Set', qty: 50, cost: 5000, date: '2024-08-12', status: 'GI Chikankari Craft Mark' },
  { id: 'CEL-0020', embroiderer: 'Old City Chikan Workshop', ware: 'Chikan Phanda Embroidered Gown', status: 'IS 16915 Chikan Embroidery Grade A', qty: 28, cost: 8800, date: '2024-08-22' },
]

export default function ChikankariEmbroideryLucknowLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = [...chikanRecords, ...genRecords(21), ...genRecords(41)]

  const filteredRecords = useMemo(() => {
    if (!searchQuery && Object.keys(activeFilters).every(k => !activeFilters[k].length)) return allRecords
    const sq = searchQuery.toLowerCase()
    return allRecords.filter(r => { if (sq && !r.id.toLowerCase().includes(sq) && !r.ware.toLowerCase().includes(sq)) return false; return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string)); })
  }, [searchQuery, activeFilters, allRecords])

  const filterGroups = [
    { key: 'ware', label: 'Ware', options: PRODUCTS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.ware === p).length })) },
    { key: 'embroiderer', label: 'Embroiderer', options: EMBROIDERERS.map(e => ({ value: e, label: e, count: allRecords.filter(r => r.embroiderer === e).length })) },
  ]

  const trendData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m, i) => ({ month: m, shipments: ri(25, 95, allRecords.length * 0.35 + i * 12) }))
  const embroidererChart = EMBROIDERERS.map(e => ({ name: e.split(' ').slice(0, 2).join(' '), volume: allRecords.filter(r => r.embroiderer === e).reduce((s, r) => s + r.qty, 0) }))
  const statusPie = STATUSES.map(s => ({ name: s, value: allRecords.filter(r => r.status === s).length }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="cel-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Chikankari Embroidery Lucknow UP' }]} />
      <PageHeader title="Chikankari Embroidery Lucknow UP Logistics" description="Uttar Pradesh Chikankari shadow work embroidery supply chain with IS 16915 Chikan craft compliance, stitch tension QC, acid-free tissue flat packaging, and GI Chikankari Craft Mark certification across 8 heritage artisan clusters in Lucknow district" />
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="bg-cyan-100">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <KpiTile label="Total Shipments" value={allRecords.length} />
            <KpiTile label="Active Ware" value={PRODUCTS.length} />
            <KpiTile label="Embroiderer Clusters" value={EMBROIDERERS.length} />
            <KpiTile label="Avg Cost" value={`₹${Math.round(allRecords.reduce((s, r) => s + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>
          <div className="grid grid-cols-6 gap-4">
            <HealthRing label="GI Tag" value={92} />
            <HealthRing label="IS 16915" value={88} />
            <HealthRing label="Tissue" value={85} />
            <HealthRing label="Van" value={81} />
            <HealthRing label="Storage" value={89} />
            <HealthRing label="Stitch" value={94} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Artisan Families" value="6,500+" />
            <ValueTile label="Lucknow City" value="Since 16th C" />
            <ValueTile label="Export Markets" value="28 Countries" />
            <ValueTile label="Annual Revenue" value="₹45 Crore" />
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
            placeholder="Search Chikankari embroidery shipments..."
          />
          <div className="rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-cyan-100">
                <tr>
                  <th className="p-3 text-left font-medium">ID</th>
                  <th className="p-3 text-left font-medium">Ware</th>
                  <th className="p-3 text-left font-medium">Embroiderer</th>
                  <th className="p-3 text-left font-medium">Status</th>
                  <th className="p-3 text-left font-medium">Qty</th>
                  <th className="p-3 text-left font-medium">Cost</th>
                  <th className="p-3 text-left font-medium">Cost Bar</th>
                  <th className="p-3 text-left font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map(record => (
                  <tr key={record.id} className="border-t hover:bg-cyan-50/50">
                    <td className="p-3 font-mono text-xs">{record.id}</td>
                    <td className="p-3"><ProductBadge name={record.ware} /></td>
                    <td className="p-3">{record.embroiderer}</td>
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
              <CardHeader><CardTitle>Embroiderer Volume</CardTitle></CardHeader>
              <CardContent>
                <BarChart width={500} height={300} data={embroidererChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="volume" fill={COLORS[0]}>
                    {embroidererChart.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
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
              <CardHeader><CardTitle>Chikankari Embroidery — 500-Year Mughal Court Art of Lucknow</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Chikankari is a delicate and refined form of hand embroidery originating from Lucknow in Uttar Pradesh, with its origins tracing back to the Mughal courts of the sixteenth century when Empress Nur Jahan is said to have patronised and refined this exquisite white-on-white embroidery technique that has become synonymous with the cultural elegance of Lucknow, the City of Nawabs. The term Chikankari derives from the Persian word chikan meaning embroidery or delicate needlework, reflecting the Persian aesthetic influence that shaped this art form through the Mughal dynasty's patronage of fine crafts and decorative arts across their Indian empire. The defining characteristic of Chikankari embroidery is the shadow work technique known as bakhiya where the embroidery stitch is worked on the reverse side of the fabric, creating a subtle shadow effect visible on the front surface that gives the impression of the design being gently painted or printed onto the cloth rather than stitched through it, an optical illusion achieved through precise manipulation of fine white cotton thread on lightweight muslin, mulmul, or organza fabric bases. Chikankari encompasses over thirty distinct stitch techniques including tepchi (running stitch), murri (rice-grain shape fill), phanda (dense knot clusters), jali (openwork lattice created by thread withdrawal and re-weaving), and zardozi (metal thread overlay work), each technique requiring different levels of skill and producing distinct textural effects that are combined within a single Chikankari composition to create layered visual depth and tactile richness. Today approximately 6,500 artisan families across eight heritage clusters within Lucknow city and surrounding Awadh region sustain this tradition, generating an estimated 45 crore rupees annually through domestic fashion retail, wedding trousseau markets, government emporiums, and growing international demand for authentic Lucknowi Chikankari embroidery from fashion designers and textile art collectors worldwide who value this craft as one of India's most elegant and sophisticated textile traditions.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>IS 16915 Chikan Embroidery Standards & Stitch Tension QC</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">The IS 16915 standard for Chikankari embroidery products establishes India's first dedicated quality certification framework for this delicate Lucknowi embroidery tradition, ensuring consistency, authenticity, and consumer protection across the Chikankari craft supply chain from raw cotton fabric sourcing through finished embroidered garment delivery to retail and export markets. The standard specifies detailed requirements for the fabric substrate, mandating fine-count cotton muslin or mulmul with minimum thread count of 80 ends per inch for plain weave fabric bases and 120 ends per inch for premium organza substrates, ensuring the fine fabric can withstand the extensive needlework manipulation involved in Chikankari without developing distortion, puckering, or hole enlargement around densely stitched areas. Stitch quality requirements for Grade A certification mandate uniform stitch density of 12 to 16 stitches per centimetre for tepchi running stitch outlines and 8 to 12 knots per square centimetre for phanda cluster fill areas, verified through calibrated magnification inspection at NABL-accredited textile testing laboratories using digital measuring microscopes with minimum 30x magnification capability. Thread quality mandates 100% extra-fine Egyptian cotton embroidery floss with minimum 2-ply twist and tensile strength of 400 grams-force, ensuring the fine white thread maintains structural integrity through the extensive embroidery process and subsequent washing and finishing stages without fraying, breaking, or losing the crisp definition that characterises premium Chikankari work. The critical stitch tension parameter measures the tightness and evenness of needle penetration through the fabric, where Grade A certification requires tension deviation not exceeding 5% from the specified standard across the entire embroidered area, ensuring consistent visual appearance and preventing the uneven puckering or distortion that indicates poor craftsmanship or improper fabric tensioning during the hand embroidery process that can diminish the value and aesthetic appeal of finished Chikankari garments and textile products.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Acid-Free Tissue Flat Pack for Chikankari Embroidery Transit</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Acid-free tissue flat pack packaging has been specifically engineered for Chikankari embroidery products to protect the delicate white-on-white embroidery stitches, fine cotton muslin fabric, and shadow work surface details from physical abrasion, moisture damage, and chemical degradation during transit from Lucknow artisan workshops to retail showrooms, bridal trousseau boutiques, government emporiums, and international export destinations across the globe. Each individual Chikankari garment undergoes a careful multi-layer flat-pack protocol where the piece is first inspected for any loose threads or incomplete stitches, then layered between sheets of acid-free tissue paper that prevent chemical yellowing and oxidation of the fine white cotton embroidery thread during prolonged storage and transit periods, a critical protection measure since standard acidic tissue paper releases trace amounts of acetic acid over time that can cause permanent yellowing of the natural cotton fibres and dull the crisp white embroidery contrast that defines premium Chikankari work. The tissue-interleaved garment is placed flat within a rigid cardboard folder constructed from 600 GSM acid-free corrugated board with custom-cut fabric support panels that prevent any folding or creasing of the embroidered areas during stacking and transit, as permanent fold creases through Chikankari embroidery can cause irreversible damage to the delicate stitchwork and shadow work patterns that give Lucknowi Chikankari its distinctive aesthetic character. The flat-pack folder is sealed within a polyethylene moisture barrier bag with silica gel desiccant packets rated for 30 gram absorption capacity per garment, maintaining relative humidity below 35% during transit to protect the natural cotton fibres from humidity-induced fungal growth and thread degradation that are particularly prevalent during the hot and humid summer monsoon season across Uttar Pradesh from June through September when ambient humidity frequently exceeds 85%. This acid-free tissue flat-pack system has been validated to ISTA 3A transit simulation protocols, demonstrating capability to withstand stacking compression of 150 kilograms and vibration exposure equivalent to 2,000 kilometres of road transit without any fabric creasing or embroidery damage, reducing the historical transit damage rate for Chikankari garments from 11% to under 1.5% since its adoption across the certified Chikankari supply chain in 2024.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>AI Stitch Pattern Analysis & Chikankari Craft Market Expansion</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Artificial intelligence and advanced imaging technologies are introducing transformative quality assurance capabilities to the Chikankari embroidery craft, where the fine stitch density, shadow work uniformity, and jali openwork precision that define the highest quality pieces have traditionally required years of master artisan experience to evaluate and grade consistently across different production batches and artisan workshops producing Chikankari for the domestic and export markets. The AI stitch analysis system employs high-resolution backlit scanning at 2400 dots per inch to capture detailed images of the Chikankari embroidery from both front and reverse sides of the fabric, analysing stitch density uniformity, shadow work consistency, and thread tension evenness across the embroidered surface with precision to 0.02 millimetres, detecting irregularities such as uneven stitch spacing, thread tension variation, incomplete jali lattice openings, or shadow work misalignment that indicate either substandard craftsmanship or improper fabric preparation during the production process. Computer vision algorithms trained on over 30,000 authenticated Chikankari pattern compositions can verify stitch authenticity by comparing the precise needle technique combinations, stitch direction patterns, and overall embroidery quality against a reference database of master artisan works from each of the eight Lucknow heritage clusters, providing objective quality grading that supplements the traditional assessment by experienced Chikankari craft evaluators who have historically relied on subjective visual inspection to determine quality grades. The Uttar Pradesh Handloom and Textile Department has begun piloting this AI verification system in its export certification pipeline for Chikankari products, reducing quality rejection rates at government UP Handloom emporiums from 16% to under 4% while accelerating the certification timeline from an average of 7 working days to under 36 hours for qualifying Chikankari embroidery shipments destined for export markets. India's GI protection for Lucknow Chikankari, combined with the emerging digital authentication infrastructure, has significantly expanded export partnerships with international fashion retailers and luxury department stores in the United Kingdom, France, the United States, Japan, and the United Arab Emirates who now require verifiable digital provenance certificates and quality grading documentation for authentic Chikankari pieces, driving premium pricing and strengthening market confidence in this 500-year Mughal court embroidery tradition that remains one of India's most treasured textile heritage arts.</p></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
