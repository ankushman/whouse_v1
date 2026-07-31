import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#5b21b6', '#6d28d9', '#7c3aed', '#8b5cf6', '#a78bfa', '#4c1d95', '#2e1065', '#ede9fe']
const PRODUCTS = ['Chanderi Silk Saree MP', 'Chanderi Cotton Silk Stole', 'MP Chanderi Butidar Fabric', 'Chanderi Ekta Pattern Suit', 'Madhya Pradesh Chanderi Dupatta', 'Chanderi Handloom Lehenga Set', 'MP Chanderi Temple Border Saree', 'Chanderi Pure Silk Kurta Fabric']
const WEAVERS = ['Chanderi Weavers Artisan Guild', 'Ashoknagar Silk Weaving Society', 'Isagarh Heritage Weavers Colony', 'Mungaoli Chanderi Cooperative', 'Shadpur Chanderi Workshop', 'Biaora Silk Weaving Centre', 'Guna Chanderi Handloom Studio', 'Lalitpur Chanderi Craft Society']
const STATUSES = ['GI Chanderi Silk Mark', 'IS 16923 Chanderi Textile Grade A', 'Muslin Roll with Tissue Interleave', 'Air-Conditioned Truck Transit', 'Humidity-Free Vault 20-25C', 'Weft Alignment QC']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-violet-100 text-violet-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="w-24 h-2 bg-violet-200 rounded-full overflow-hidden"><div className="h-full bg-violet-700 rounded-full" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ label, value, size = 80 }: { label: string; value: number; size?: number }) => {
  const r = (size - 12) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#ede9fe" strokeWidth="6" />
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
    id: `CSW-${String(offset + i + 1).padStart(4, '0')}`,
    weaver: WEAVERS[(offset + i) % WEAVERS.length], ware: PRODUCTS[(offset + i) % PRODUCTS.length],
    status: STATUSES[(offset + i) % STATUSES.length], qty: ri(1, 40, ((offset + i) * 39) % 40) + 1,
    cost: ri(5000, 95000, ((offset + i) * 12467) % 90000) + 5000,
    date: new Date(2024, ((offset + i) % 12), ri(1, 28, (offset + i) % 28)).toISOString().slice(0, 10),
  }))

const chanderiRecords = [
  { id: 'CSW-0001', weaver: 'Chanderi Weavers Artisan Guild', ware: 'Chanderi Silk Saree MP', status: 'GI Chanderi Silk Mark', qty: 4, cost: 85000, date: '2024-01-10' },
  { id: 'CSW-0002', weaver: 'Ashoknagar Silk Weaving Society', ware: 'Chanderi Cotton Silk Stole', status: 'IS 16923 Chanderi Textile Grade A', qty: 12, cost: 28000, date: '2024-01-25' },
  { id: 'CSW-0003', weaver: 'Isagarh Heritage Weavers Colony', ware: 'MP Chanderi Butidar Fabric', status: 'Muslin Roll with Tissue Interleave', qty: 6, cost: 72000, date: '2024-02-08' },
  { id: 'CSW-0004', weaver: 'Mungaoli Chanderi Cooperative', ware: 'Chanderi Ekta Pattern Suit', status: 'Air-Conditioned Truck Transit', qty: 8, cost: 45000, date: '2024-02-22' },
  { id: 'CSW-0005', weaver: 'Shadpur Chanderi Workshop', ware: 'Madhya Pradesh Chanderi Dupatta', status: 'Humidity-Free Vault 20-25C', qty: 15, cost: 22000, date: '2024-03-05' },
  { id: 'CSW-0006', weaver: 'Biaora Silk Weaving Centre', ware: 'Chanderi Handloom Lehenga Set', status: 'Weft Alignment QC', qty: 5, cost: 92000, date: '2024-03-18' },
  { id: 'CSW-0007', weaver: 'Guna Chanderi Handloom Studio', ware: 'MP Chanderi Temple Border Saree', status: 'GI Chanderi Silk Mark', qty: 3, cost: 88000, date: '2024-03-30' },
  { id: 'CSW-0008', weaver: 'Lalitpur Chanderi Craft Society', ware: 'Chanderi Pure Silk Kurta Fabric', status: 'IS 16923 Chanderi Textile Grade A', qty: 10, cost: 35000, date: '2024-04-12' },
  { id: 'CSW-0009', weaver: 'Chanderi Weavers Artisan Guild', ware: 'Chanderi Cotton Silk Stole', status: 'Muslin Roll with Tissue Interleave', qty: 7, cost: 58000, date: '2024-04-24' },
  { id: 'CSW-0010', weaver: 'Ashoknagar Silk Weaving Society', ware: 'Chanderi Silk Saree MP', status: 'Air-Conditioned Truck Transit', qty: 4, cost: 82000, date: '2024-05-06' },
  { id: 'CSW-0011', weaver: 'Isagarh Heritage Weavers Colony', ware: 'MP Chanderi Butidar Fabric', status: 'Humidity-Free Vault 20-25C', qty: 9, cost: 48000, date: '2024-05-18' },
  { id: 'CSW-0012', weaver: 'Mungaoli Chanderi Cooperative', ware: 'Chanderi Ekta Pattern Suit', status: 'Weft Alignment QC', qty: 11, cost: 32000, date: '2024-05-30' },
  { id: 'CSW-0013', weaver: 'Shadpur Chanderi Workshop', ware: 'Madhya Pradesh Chanderi Dupatta', status: 'GI Chanderi Silk Mark', qty: 14, cost: 18000, date: '2024-06-12' },
  { id: 'CSW-0014', weaver: 'Biaora Silk Weaving Centre', ware: 'Chanderi Handloom Lehenga Set', status: 'IS 16923 Chanderi Textile Grade A', qty: 6, cost: 75000, date: '2024-06-24' },
  { id: 'CSW-0015', weaver: 'Guna Chanderi Handloom Studio', ware: 'MP Chanderi Temple Border Saree', status: 'Muslin Roll with Tissue Interleave', qty: 18, cost: 15000, date: '2024-07-06' },
  { id: 'CSW-0016', weaver: 'Lalitpur Chanderi Craft Society', ware: 'Chanderi Pure Silk Kurta Fabric', status: 'Air-Conditioned Truck Transit', qty: 5, cost: 88000, date: '2024-07-18' },
  { id: 'CSW-0017', weaver: 'Chanderi Weavers Artisan Guild', ware: 'Chanderi Handloom Lehenga Set', status: 'Humidity-Free Vault 20-25C', qty: 8, cost: 52000, date: '2024-07-30' },
  { id: 'CSW-0018', weaver: 'Ashoknagar Silk Weaving Society', ware: 'MP Chanderi Temple Border Saree', status: 'Weft Alignment QC', qty: 3, cost: 90000, date: '2024-08-10' },
  { id: 'CSW-0019', weaver: 'Isagarh Heritage Weavers Colony', ware: 'Chanderi Silk Saree MP', status: 'GI Chanderi Silk Mark', qty: 7, cost: 68000, date: '2024-08-22' },
  { id: 'CSW-0020', weaver: 'Mungaoli Chanderi Cooperative', ware: 'Chanderi Cotton Silk Stole', status: 'IS 16923 Chanderi Textile Grade A', qty: 10, cost: 40000, date: '2024-09-03' },
]

export default function ChanderiSilkWeavingMadhyaPradeshLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = [...chanderiRecords, ...genRecords(21), ...genRecords(41)]

  const filteredRecords = useMemo(() => {
    if (!searchQuery && Object.keys(activeFilters).every(k => !activeFilters[k].length)) return allRecords
    const sq = searchQuery.toLowerCase()
    return allRecords.filter(r => { if (sq && !r.id.toLowerCase().includes(sq) && !r.ware.toLowerCase().includes(sq)) return false; return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string)); })
  }, [searchQuery, activeFilters, allRecords])

  const filterGroups = [
    { key: 'ware', label: 'Ware', options: PRODUCTS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.ware === p).length })) },
    { key: 'weaver', label: 'Weaver', options: WEAVERS.map(w => ({ value: w, label: w, count: allRecords.filter(r => r.weaver === w).length })) },
  ]

  const trendData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m, i) => ({ month: m, shipments: ri(10, 45, allRecords.length * 0.2 + i * 7) }))
  const weaverChart = WEAVERS.map(w => ({ name: w.split(' ').slice(0, 2).join(' '), volume: allRecords.filter(r => r.weaver === w).reduce((s, r) => s + r.qty, 0) }))
  const statusPie = STATUSES.map(s => ({ name: s, value: allRecords.filter(r => r.status === s).length }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="csw-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Chanderi Silk Weaving Madhya Pradesh' }]} />
      <PageHeader title="Chanderi Silk Weaving Madhya Pradesh Logistics" description="Chanderi silk weaving supply chain with IS 16923 Chanderi textile compliance, weft alignment QC, muslin roll tissue interleave packaging, and GI Chanderi Silk Mark certification across 8 heritage weaver clusters in Ashoknagar, Guna, and Lalitpur districts" />
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="bg-violet-100">
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
            <HealthRing label="GI Tag" value={96} />
            <HealthRing label="IS 16923" value={93} />
            <HealthRing label="Muslin" value={90} />
            <HealthRing label="AC Truck" value={87} />
            <HealthRing label="Vault" value={92} />
            <HealthRing label="Weft" value={95} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Artisan Families" value="1,500+" />
            <ValueTile label="Chanderi Tradition" value="Since 11th C" />
            <ValueTile label="Export Markets" value="28 Countries" />
            <ValueTile label="Annual Revenue" value="₹55 Crore" />
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
            placeholder="Search Chanderi silk weaving shipments..."
          />
          <div className="rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-violet-100">
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
                  <tr key={record.id} className="border-t hover:bg-violet-50/50">
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
              <CardHeader><CardTitle>Chanderi Silk Weaving — 900-Year Bundelkhand Heritage Textile Tradition</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Chanderi silk weaving is one of India's most celebrated and historically significant handloom textile traditions, originating in the ancient town of Chanderi in the Ashoknagar district of Madhya Pradesh state during the eleventh century under the patronage of the Bundela Rajput kings who established the town as a premier centre for producing extraordinarily fine silk and cotton textiles that combined Persian-inspired artistic motifs with indigenous Indian weaving techniques to create fabrics of legendary beauty and delicacy that were treasured by Mughal emperors, Rajput royal courts, and aristocratic families throughout medieval India. The Chanderi weaving tradition derives its name from the town of Chanderi itself, a historic settlement situated at the edge of the Vindhyachal mountain range in the Bundelkhand region where the unique combination of locally available fine silk yarn, pure cotton thread, and the extraordinary weaving skills of the Ansari and other Muslim weaving communities who settled in Chanderi during the medieval period created an enduring textile art form that has maintained its distinctive character and exceptional quality across nine centuries of continuous production. The hallmark of authentic Chanderi weaving is the creation of fabrics with an almost transparent, gossamer-light quality that belies their remarkable structural strength, achieved through the use of extraordinarily fine silk yarn in the warp direction with counts ranging from 200 to 400 threads per inch combined with premium quality cotton yarn in the weft producing the characteristic sheer texture and subtle lustre that immediately distinguishes Chanderi fabric from all other Indian handloom textiles. The traditional Chanderi design vocabulary includes the iconic butidar pattern featuring small buti or paisley motifs densely distributed across the fabric surface in gold zari thread, the ekta pattern with single-repeat geometric designs, the jangla pattern depicting lush forest and vine motifs, and the distinctive temple border design inspired by the architectural elements of the historic Chanderi fort and its cluster of ancient Jain and Hindu temples that have defined the town's skyline for over a millennium. Today approximately 1,500 weaver families across eight heritage clusters in Ashoknagar, Guna, and Lalitpur districts sustain this irreplaceable textile tradition, operating traditional pit looms in their homes and workshops to produce Chanderi sarees, stoles, dupattas, and fabric lengths that command premium prices in domestic and international markets, generating an estimated 55 crore rupees annually for the Bundelkhand weaving community.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>IS 16923 Chanderi Textile Standards & Weft Alignment QC</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">The IS 16923 standard for Chanderi textiles establishes India's first dedicated quality certification framework for this legendary Bundelkhand handloom weaving tradition, specifying detailed requirements for authentic silk and cotton yarn quality, traditional handloom weaving technique execution, distinctive Chanderi design motif vocabulary compliance, and the extraordinary fabric sheer quality that distinguishes genuine Chanderi textiles from powerloom reproductions and non-authentic imitations produced using mechanical weaving equipment that cannot replicate the delicate hand-woven character and gossamer transparency of authentic Chanderi fabric. The standard mandates yarn quality requirements for Grade A certification: silk warp yarn must be certified mulberry silk with minimum filament length of 600 metres per cocoon, individual filament diameter not exceeding 12 microns, and twist per inch within the range of 28 to 34 for single warp yarn, verified through digital twist measurement at authorised textile testing laboratories to ensure the fine yarn quality that produces the characteristic Chanderi fabric transparency and subtle lustre. Cotton weft yarn for Grade A Chanderi must be certified combed cotton with minimum 2/80s count for standard Chanderi fabric and minimum 2/100s count for premium lightweight Chanderi muslin variants, ensuring the soft hand feel and natural breathability that authentic Chanderi textiles are renowned for across centuries of use in India's diverse climate zones ranging from tropical monsoon humidity to arid summer heat. Weft alignment requirements for IS 16923 Grade A certification mandate maximum permissible weft deviation of plus or minus 0.3 millimetres per 10 centimetres of fabric width, verified through digital fabric analysis equipment at five equally spaced measurement points across the full fabric width, ensuring the geometric precision of traditional Chanderi butidar and jangla pattern motifs that require absolutely uniform weft insertion to maintain their designated scale and proportion across the complete fabric surface without the distortion that characterises powerloom Chanderi reproductions. Fabric weight requirements for Grade A certification specify grammage ranges between 45 and 75 grams per square metre for lightweight Chanderi muslin and between 75 and 120 grams per square metre for standard Chanderi silk-cotton fabric, with permissible variation not exceeding plus or minus 5% across the full fabric length verified through gravimetric testing at three points per fabric piece.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Muslin Roll Tissue Interleave Packaging for Chanderi Silk</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Muslin roll packaging with tissue interleave has been specifically engineered for Chanderi silk textiles to protect the extraordinarily fine and delicate fabric structure, gold zari butidar motifs, and gossamer-light silk yarn from the numerous physical abrasion, tension, and environmental hazards encountered during transit from the Bundelkhand heritage weaving clusters to domestic retail destinations across India and international export markets spanning twenty-eight countries that currently import certified Chanderi textiles for boutique retail, heritage textile collections, and luxury fashion house sourcing. Each Chanderi textile piece undergoes a meticulous preparation sequence before packaging: first inspected under standardised daylight D65 illumination to verify weave integrity and detect any weft distortion, broken warp threads, zari oxidation, or fabric surface defects that could worsen during transit handling, then measured and recorded for precise fabric dimensions, grammage, and pattern alignment verification before being carefully rolled onto a custom-diameter acid-free cardboard tube with core diameter of 75 millimetres providing a gentle rolling radius that avoids creating sharp creases or permanent fold lines in the delicate fabric. The rolling process incorporates tissue interleave sheets of acid-free non-woven fabric placed between each complete wrap of the Chanderi textile around the cardboard core tube, preventing any friction contact between successive fabric layers that could abrade the delicate silk yarn surface or dislodge the fine gold zari butidar motifs during the rolling process and subsequent transit vibration exposure. The muslin-wrapped and tissue-interleaved Chanderi roll is enclosed in a custom-sized outer packaging of breathable unbleached cotton muslin fabric providing protection from dust and light exposure while maintaining adequate ventilation to prevent moisture accumulation within the packaging that could promote fungal growth on the natural silk and cotton fibres during extended transit periods that can range from several days for domestic surface shipments to several weeks for consolidated international export consignments routed through Mumbai and Delhi cargo terminals to overseas destinations. Silica gel desiccant packets rated for 100 gram absorption capacity are enclosed within the muslin outer wrap to maintain relative humidity between 35% and 45% during transit, critical for protecting the natural silk fibres used in authentic Chanderi weaving that are highly susceptible to moisture-induced mildew staining and tensile strength degradation under humidity conditions exceeding 55%.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>AI Weft Pattern Analysis & Chanderi Silk Global Market Strategy</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Artificial intelligence and advanced textile imaging technologies are now being deployed to authenticate and quality-grade Chanderi silk textiles, addressing the growing market challenge where sophisticated powerloom reproductions and non-authentic imitations from mechanical weaving centres have increasingly attempted to replicate the distinctive visual appearance and gossamer quality of genuine hand-woven Chanderi fabric, undermining both the premium market positioning and the cultural heritage value of authentic Chanderi textiles produced by certified handloom weavers in the Bundelkhand heritage clusters. The AI authentication system employs high-resolution digital fabric scanning at 3,200 dots per inch to capture the complete weave structure and surface topography of finished Chanderi textiles, analysing individual thread interlacement patterns, weft insertion regularity, zari thread wrapping technique, and motif execution precision against a comprehensive reference database of over 18,000 authenticated Chanderi textile samples spanning all major design categories and heritage cluster production centres across multiple decades of documented Chanderi weaving output. Machine learning algorithms trained on this extensive dataset can distinguish genuine handloom Chanderi from powerloom reproductions with 99.1% accuracy by detecting subtle structural signatures invisible to standard visual inspection, including the characteristic micro-variation in weft spacing inherent to hand-throw shuttle operation versus the mathematically uniform weft density of powerloom weaving, the slight irregularity in hand-tied zari thread tension that produces the natural organic quality of authentic Chanderi butidar motifs versus the mechanically precise zari placement in powerloom imitations, and the distinct handloom selvedge construction technique that produces the characteristically neat and slightly raised selvedge edges of genuine Chanderi fabric that cannot be replicated by any mechanical selvedge formation system currently available in the global textile machinery industry. The Madhya Pradesh State Handloom and Handicrafts Department has integrated this AI verification into its GI certification pipeline for Chanderi textiles, reducing the incidence of non-authentic Chanderi products in government handloom emporium channels from an estimated 12% to under 1.5% since implementation while reducing the authentication processing time from 15 working days to under 60 hours for qualifying pieces, enabling the Chanderi weaver community to respond more rapidly to the growing international demand for verified heritage textiles from luxury fashion brands in Paris, Milan, and Tokyo who now require verifiable digital provenance certificates and AI-authenticated quality grading for all Chanderi textile products sourced from the Bundelkhand heritage weaving clusters.</p></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
