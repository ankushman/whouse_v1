import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#1a4d2e', '#2d6a4f', '#40916c', '#52b788', '#74c69d', '#1b4332', '#081c15', '#d8f3dc']
const PRODUCTS = ['Kashmir Sozni Pashmina Shawl', 'Sozni Embroidered Cashmere Stole', 'Kashmir Crewel Sozni Panel', 'Sozni Chain Stitch Rug', 'Kashmir Sozni Silk Saree Border', 'Sozni Needle Work Kurta Set', 'Kashmir Ari Sozni Wall Hanging', 'Sozni Embroidered Cushion Cover Set']
const EMBROIDERERS = ['Srinagar Sozni Artisan Guild', 'Downtown Srinagar Embroidery Society', 'Nowgam Sozni Workshop Colony', 'Naseem Bagh Heritage Embroiderers', 'Hazratbal Sozni Craft Centre', 'Ganderbal Kashmir Embroidery Guild', 'Badgam Sozni Cooperative Society', 'Pampore Heritage Sozni Studio']
const STATUSES = ['GI Kashmir Sozni Mark', 'IS 16920 Sozni Embroidery Grade A', 'Acid-Free Tissue Flat Pack', 'Temperature-Controlled Van Transit', 'Moisture-Free Storage 18-25C', 'Stitch Count Density QC']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="w-24 h-2 bg-emerald-200 rounded-full overflow-hidden"><div className="h-full bg-emerald-700 rounded-full" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ label, value, size = 80 }: { label: string; value: number; size?: number }) => {
  const r = (size - 12) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#d8f3dc" strokeWidth="6" />
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
    id: `KSE-${String(offset + i + 1).padStart(4, '0')}`,
    embroiderer: EMBROIDERERS[(offset + i) % EMBROIDERERS.length], ware: PRODUCTS[(offset + i) % PRODUCTS.length],
    status: STATUSES[(offset + i) % STATUSES.length], qty: ri(1, 50, ((offset + i) * 41) % 50) + 1,
    cost: ri(3000, 85000, ((offset + i) * 11273) % 82000) + 3000,
    date: new Date(2024, ((offset + i) % 12), ri(1, 28, (offset + i) % 28)).toISOString().slice(0, 10),
  }))

const sozniRecords = [
  { id: 'KSE-0001', embroiderer: 'Srinagar Sozni Artisan Guild', ware: 'Kashmir Sozni Pashmina Shawl', status: 'GI Kashmir Sozni Mark', qty: 6, cost: 78000, date: '2024-01-15' },
  { id: 'KSE-0002', embroiderer: 'Downtown Srinagar Embroidery Society', ware: 'Sozni Embroidered Cashmere Stole', status: 'IS 16920 Sozni Embroidery Grade A', qty: 10, cost: 45000, date: '2024-01-28' },
  { id: 'KSE-0003', embroiderer: 'Nowgam Sozni Workshop Colony', ware: 'Kashmir Crewel Sozni Panel', status: 'Acid-Free Tissue Flat Pack', qty: 8, cost: 32000, date: '2024-02-12' },
  { id: 'KSE-0004', embroiderer: 'Naseem Bagh Heritage Embroiderers', ware: 'Sozni Chain Stitch Rug', status: 'Temperature-Controlled Van Transit', qty: 4, cost: 65000, date: '2024-02-25' },
  { id: 'KSE-0005', embroiderer: 'Hazratbal Sozni Craft Centre', ware: 'Kashmir Sozni Silk Saree Border', status: 'Moisture-Free Storage 18-25C', qty: 12, cost: 28000, date: '2024-03-08' },
  { id: 'KSE-0006', embroiderer: 'Ganderbal Kashmir Embroidery Guild', ware: 'Sozni Needle Work Kurta Set', status: 'Stitch Count Density QC', qty: 7, cost: 55000, date: '2024-03-22' },
  { id: 'KSE-0007', embroiderer: 'Badgam Sozni Cooperative Society', ware: 'Kashmir Ari Sozni Wall Hanging', status: 'GI Kashmir Sozni Mark', qty: 3, cost: 82000, date: '2024-04-05' },
  { id: 'KSE-0008', embroiderer: 'Pampore Heritage Sozni Studio', ware: 'Sozni Embroidered Cushion Cover Set', status: 'IS 16920 Sozni Embroidery Grade A', qty: 15, cost: 18000, date: '2024-04-18' },
  { id: 'KSE-0009', embroiderer: 'Srinagar Sozni Artisan Guild', ware: 'Sozni Embroidered Cashmere Stole', status: 'Acid-Free Tissue Flat Pack', qty: 9, cost: 52000, date: '2024-05-02' },
  { id: 'KSE-0010', embroiderer: 'Downtown Srinagar Embroidery Society', ware: 'Kashmir Sozni Pashmina Shawl', status: 'Temperature-Controlled Van Transit', qty: 5, cost: 72000, date: '2024-05-15' },
  { id: 'KSE-0011', embroiderer: 'Nowgam Sozni Workshop Colony', ware: 'Sozni Chain Stitch Rug', status: 'Moisture-Free Storage 18-25C', qty: 6, cost: 62000, date: '2024-05-28' },
  { id: 'KSE-0012', embroiderer: 'Naseem Bagh Heritage Embroiderers', ware: 'Kashmir Crewel Sozni Panel', status: 'Stitch Count Density QC', qty: 11, cost: 35000, date: '2024-06-10' },
  { id: 'KSE-0013', embroiderer: 'Hazratbal Sozni Craft Centre', ware: 'Sozni Needle Work Kurta Set', status: 'GI Kashmir Sozni Mark', qty: 8, cost: 48000, date: '2024-06-22' },
  { id: 'KSE-0014', embroiderer: 'Ganderbal Kashmir Embroidery Guild', ware: 'Kashmir Sozni Silk Saree Border', status: 'IS 16920 Sozni Embroidery Grade A', qty: 14, cost: 22000, date: '2024-07-04' },
  { id: 'KSE-0015', embroiderer: 'Badgam Sozni Cooperative Society', ware: 'Sozni Embroidered Cushion Cover Set', status: 'Acid-Free Tissue Flat Pack', qty: 20, cost: 15000, date: '2024-07-18' },
  { id: 'KSE-0016', embroiderer: 'Pampore Heritage Sozni Studio', ware: 'Kashmir Ari Sozni Wall Hanging', status: 'Temperature-Controlled Van Transit', qty: 4, cost: 80000, date: '2024-07-30' },
  { id: 'KSE-0017', embroiderer: 'Srinagar Sozni Artisan Guild', ware: 'Sozni Needle Work Kurta Set', status: 'Moisture-Free Storage 18-25C', qty: 10, cost: 42000, date: '2024-08-10' },
  { id: 'KSE-0018', embroiderer: 'Downtown Srinagar Embroidery Society', ware: 'Kashmir Sozni Pashmina Shawl', status: 'Stitch Count Density QC', qty: 3, cost: 85000, date: '2024-08-20' },
  { id: 'KSE-0019', embroiderer: 'Nowgam Sozni Workshop Colony', ware: 'Sozni Embroidered Cashmere Stole', status: 'GI Kashmir Sozni Mark', qty: 7, cost: 58000, date: '2024-09-01' },
  { id: 'KSE-0020', embroiderer: 'Naseem Bagh Heritage Embroiderers', ware: 'Sozni Chain Stitch Rug', status: 'IS 16920 Sozni Embroidery Grade A', qty: 5, cost: 68000, date: '2024-09-12' },
]

export default function KashmirSozniEmbroideryLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = [...sozniRecords, ...genRecords(21), ...genRecords(41)]

  const filteredRecords = useMemo(() => {
    if (!searchQuery && Object.keys(activeFilters).every(k => !activeFilters[k].length)) return allRecords
    const sq = searchQuery.toLowerCase()
    return allRecords.filter(r => { if (sq && !r.id.toLowerCase().includes(sq) && !r.ware.toLowerCase().includes(sq)) return false; return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string)); })
  }, [searchQuery, activeFilters, allRecords])

  const filterGroups = [
    { key: 'ware', label: 'Ware', options: PRODUCTS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.ware === p).length })) },
    { key: 'embroiderer', label: 'Embroiderer', options: EMBROIDERERS.map(e => ({ value: e, label: e, count: allRecords.filter(r => r.embroiderer === e).length })) },
  ]

  const trendData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m, i) => ({ month: m, shipments: ri(8, 38, allRecords.length * 0.18 + i * 5) }))
  const embroidererChart = EMBROIDERERS.map(e => ({ name: e.split(' ').slice(0, 2).join(' '), volume: allRecords.filter(r => r.embroiderer === e).reduce((s, r) => s + r.qty, 0) }))
  const statusPie = STATUSES.map(s => ({ name: s, value: allRecords.filter(r => r.status === s).length }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="kse-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Kashmir Sozni Embroidery' }]} />
      <PageHeader title="Kashmir Sozni Embroidery Logistics" description="Kashmir Sozni embroidery supply chain with IS 16920 sozni needlework compliance, stitch count density QC, acid-free tissue flat pack packaging, and GI Kashmir Sozni Mark certification across 8 heritage artisan clusters in Srinagar, Ganderbal, and Badgam districts" />
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="bg-emerald-100">
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
            <HealthRing label="GI Tag" value={96} />
            <HealthRing label="IS 16920" value={92} />
            <HealthRing label="Tissue" value={89} />
            <HealthRing label="Van" value={85} />
            <HealthRing label="Storage" value={93} />
            <HealthRing label="Stitch" value={97} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Artisan Families" value="800+" />
            <ValueTile label="Sozni Tradition" value="Since 15th C" />
            <ValueTile label="Export Markets" value="18 Countries" />
            <ValueTile label="Annual Revenue" value="₹28 Crore" />
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
            placeholder="Search Kashmir Sozni embroidery shipments..."
          />
          <div className="rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-emerald-100">
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
                  <tr key={record.id} className="border-t hover:bg-emerald-50/50">
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
              <CardHeader><CardTitle>Kashmir Sozni Embroidery — 600-Year Valley Needlework Tradition</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Kashmir Sozni embroidery represents one of the finest and most technically demanding needlework traditions in the world, originating in the Kashmir Valley during the fifteenth century under the patronage of Sultan Zain-ul-Abidin who invited master craftsmen from Central Asia and Persia to establish sophisticated textile workshops in the Srinagar royal court, creating an enduring artistic legacy that has been continuously practised and refined by generations of Kashmiri artisan families across the valley's historic craft neighbourhoods of Downtown Srinagar, Nowgam, Naseem Bagh, and Hazratbal for over six centuries. The Sozni technique derives its name from the Persian word sozan meaning needle, and is distinguished from all other Indian embroidery traditions by its extraordinarily fine counted-thread work where the artisan creates mirror-image symmetrical patterns on both sides of the fabric simultaneously using a single needle and continuous thread, producing embroideries that are virtually identical in appearance on the obverse and reverse surfaces, a technical feat achievable only through years of dedicated apprenticeship and exceptional manual dexterity. The standard Sozni stitch density for authentic Grade A work ranges from 2,500 to 4,000 individual stitches per square centimetre, with master-level pieces in the pashmina shawl category achieving counts exceeding 5,000 stitches per square centimetre across the entire surface area of a full-size shawl measuring approximately 200 by 100 centimetres, requiring a single master embroiderer between 18 and 36 months of continuous daily work to complete at the highest quality level. The traditional Sozni pattern vocabulary draws extensively from Kashmir's natural environment and Islamic geometric art traditions, featuring intricate floral motifs including the iconic kashmiri gulab rose, panj paanch five-petal flower, badam almond bud, dain tree of life, and elaborate geometric lattice patterns called jali work that creates a delicate mesh-like surface effect resembling fine lacework while maintaining structural integrity across decades of use and careful handling. Today approximately 800 artisan families across eight heritage clusters in Srinagar, Ganderbal, Badgam, and Pampore districts sustain this irreplaceable craft tradition, generating an estimated 28 crore rupees annually through domestic luxury textile markets, government handicraft emporiums, international boutique retailers, and private collectors who value authentic Kashmir Sozni embroidery as among the finest handwork produced anywhere in the world.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>IS 16920 Sozni Embroidery Standards & Stitch Count Density QC</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">The IS 16920 standard for Kashmir Sozni embroidery establishes India's first comprehensive quality certification framework specifically designed for this ultra-fine counted-thread needlework tradition, ensuring authentic stitch density, traditional motif execution, and premium material quality that distinguish genuine Kashmir Sozni work from machine-embroidered imitations and lower-quality needlework from other regions that attempt to replicate the distinctive Sozni aesthetic without achieving its extraordinary technical precision and bilateral symmetry. The standard specifies detailed requirements for the embroidery substrate based on the product category: pashmina wool shawls must use certified Changthangi pashmina fibre with minimum fibre diameter of 12 microns and fabric grammage exceeding 200 GSM verified through optical fibre analysis at authorised testing laboratories, while cashmere stoles must use Grade A Mongolian cashmere with minimum 14.5 micron fibre diameter and surface evenness verified through digital surface profilometry. Stitch count density requirements for IS 16920 Grade A certification mandate minimum 2,500 stitches per square centimetre for standard Sozni work and minimum 4,000 stitches per square centimetre for premium pashmina Sozni pieces, verified through high-resolution digital scanning at 200x magnification across five randomly selected one-centimetre sample areas on each piece, with permissible density variation not exceeding plus or minus 8% across the entire surface ensuring uniform quality throughout the embroidery. Bilateral symmetry requirements for Grade A certification mandate visual matching between front and back surfaces rated at minimum 92% similarity through pixel-level digital comparison using calibrated scanning equipment, as the true Sozni technique produces near-identical obverse and reverse surfaces that cannot be replicated by any mechanical embroidery process currently available in the global textile industry. Colour fastness requirements mandate minimum rating of 4 on the ISO 105-C06 wash fastness scale and rating of 5 on the ISO 105-B02 light fastness scale for all embroidery threads, verified through accredited laboratory testing to ensure the vivid Sozni colours maintain their brilliance across decades of intended use in luxury textile applications.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Acid-Free Tissue Flat Pack Packaging for Sozni Embroidery</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Acid-free tissue flat pack packaging has been specifically developed for Kashmir Sozni embroidery products to protect the extraordinarily fine stitch work, delicate pashmina and cashmere ground fabric, and premium silk embroidery threads from the multiple environmental and mechanical hazards encountered during transit from Kashmir Valley workshops to domestic retail destinations across India and international export markets throughout Europe, North America, East Asia, and the Middle East. Each individual Sozni embroidery piece undergoes a meticulous multi-stage preparation process before packaging: first inspected under 20x magnification to verify stitch integrity and identify any loose threads or tension irregularities that could worsen during transit, then gently pressed between acid-free blotting paper sheets using controlled pressure not exceeding 50 grams per square centimetre to flatten the fabric without compressing the dimensional embroidery relief that gives Sozni work its distinctive tactile and visual three-dimensional quality. The prepared piece is wrapped in pH-neutral acid-free tissue paper meeting ISO 10716 archival quality standards with alpha-cellulose content exceeding 97% and lignin content below 1%, preventing any acidic degradation of the natural protein fibres in pashmina and cashmere substrates during storage periods that can extend from weeks for domestic shipments to months for consolidated international export consignments routed through Mumbai and Delhi cargo hubs. The tissue-wrapped piece is placed flat in a custom-sized rigid cardboard carrier constructed from 600 GSM acid-free corrugated board with internal dimensions providing minimum 25 millimetres clearance on all four sides, allowing the embroidery to lie perfectly flat without any folding, creasing, or compression of the fine stitch work during stacking and transport operations. Silica gel desiccant packets rated for 50 gram absorption capacity are included within each flat pack to maintain relative humidity between 30% and 40% during transit, as the natural pashmina and cashmere fibres used in authentic Sozni embroidery are highly hygroscopic and can develop mildew staining under humidity conditions exceeding 60% that are commonly encountered during monsoon-season transit through India's tropical climate zones between July and September.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>AI Stitch Pattern Verification & Kashmir Sozni Market Growth</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Artificial intelligence and computer vision technologies are now being deployed to verify the authenticity and quality grading of Kashmir Sozni embroidery, addressing a critical market challenge where sophisticated machine-embroidered imitations from overseas manufacturing centres have increasingly attempted to pass as authentic Kashmir Sozni work in both domestic and international markets, undermining the livelihoods of genuine Kashmiri Sozni artisans and eroding consumer confidence in this heritage craft tradition. The AI verification system employs high-resolution digital scanning at 6,400 dots per inch resolution to capture the complete surface topography of each Sozni embroidery piece, analysing individual stitch geometry, thread tension patterns, bilateral symmetry fidelity between obverse and reverse surfaces, and motif execution accuracy against a reference database containing over 15,000 authenticated Sozni pieces from all eight Kashmir heritage clusters spanning multiple decades of production. Machine learning algorithms trained on this comprehensive dataset can detect machine-embroidered imitations with 99.2% accuracy by identifying telltale signatures such as perfectly uniform stitch spacing indicating computerised embroidery machine operation, thread tension patterns inconsistent with hand needlework dynamics, surface平整 irregularities from mechanical hoop tension, and the absence of the characteristic slight bilateral asymmetry that is the hallmark of genuine hand-executed Sozni work where even the most skilled master artisan produces micro-variations in stitch placement between the two surfaces that are invisible to the naked eye but clearly distinguishable through AI-powered analysis. The Jammu and Kashmir Directorate of Handicrafts has implemented this AI verification system in its export certification pipeline, reducing the rate of fraudulent Sozni embroidery passing through quality checkpoints from an estimated 15% to under 2% since deployment, while simultaneously accelerating the authentication process from 15 working days to under 72 hours for qualifying pieces. The combination of GI certification protection, AI-powered authentication infrastructure, and growing international demand for verified heritage crafts has positioned Kashmir Sozni embroidery as one of India's fastest-growing premium textile craft exports, with annual revenue increasing from approximately 15 crore to 28 crore rupees over the past five years, driven primarily by luxury fashion house partnerships in Paris, Milan, and Tokyo who now require blockchain-verified digital provenance certificates with AI authentication scores for all Sozni embroidery pieces sourced from certified Kashmir artisan clusters.</p></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
