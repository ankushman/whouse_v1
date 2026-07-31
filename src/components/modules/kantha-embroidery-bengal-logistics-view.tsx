import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#be123c', '#e11d48', '#f43f5e', '#fb7185', '#fda4af', '#9f1239', '#881337', '#ffe4e6']
const PRODUCTS = ['Kantha Running Stitch Saree', 'Bengal Nakshi Kantha Quilt', 'Kantha Embroidered Dupatta', 'Kantha Sujani Thread Panel', 'Bengal Kantha Cushion Cover Set', 'Kantha Lep Kantha Shawl', 'Kantha Embroidered Bedspread', 'Kantha Patchwork Wall Hanging']
const EMBROIDERERS = ['Bolpur Santiniketan Kantha Guild', 'Birbhum Rural Embroidery Society', 'Murshidabad Kantha Art Centre', 'Nadia Traditional Kantha Cooperative', 'Howrah Bengal Stitch Workshop', 'Bardhaman Kantha Heritage Colony', 'Hooghly Kantha Craft Studio', 'North 24 Parganas Kantha Guild']
const STATUSES = ['GI Kantha Embroidery Mark', 'IS 16924 Kantha Stitch Grade A', 'Acid-Free Tissue Flat Pack', 'Enclosed Truck Transit', 'Dry Storage 20-30C', 'Running Stitch Evenness QC']

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
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#ffe4e6" strokeWidth="6" />
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
    id: `KTE-${String(offset + i + 1).padStart(4, '0')}`,
    embroiderer: EMBROIDERERS[(offset + i) % EMBROIDERERS.length], ware: PRODUCTS[(offset + i) % PRODUCTS.length],
    status: STATUSES[(offset + i) % STATUSES.length], qty: ri(1, 48, ((offset + i) * 53) % 48) + 1,
    cost: ri(2000, 62000, ((offset + i) * 10987) % 60000) + 2000,
    date: new Date(2024, ((offset + i) % 12), ri(1, 28, (offset + i) % 28)).toISOString().slice(0, 10),
  }))

const kanthaRecords = [
  { id: 'KTE-0001', embroiderer: 'Bolpur Santiniketan Kantha Guild', ware: 'Kantha Running Stitch Saree', status: 'GI Kantha Embroidery Mark', qty: 6, cost: 55000, date: '2024-01-12' },
  { id: 'KTE-0002', embroiderer: 'Birbhum Rural Embroidery Society', ware: 'Bengal Nakshi Kantha Quilt', status: 'IS 16924 Kantha Stitch Grade A', qty: 4, cost: 60000, date: '2024-01-25' },
  { id: 'KTE-0003', embroiderer: 'Murshidabad Kantha Art Centre', ware: 'Kantha Embroidered Dupatta', status: 'Acid-Free Tissue Flat Pack', qty: 12, cost: 18000, date: '2024-02-08' },
  { id: 'KTE-0004', embroiderer: 'Nadia Traditional Kantha Cooperative', ware: 'Kantha Sujani Thread Panel', status: 'Enclosed Truck Transit', qty: 5, cost: 52000, date: '2024-02-20' },
  { id: 'KTE-0005', embroiderer: 'Howrah Bengal Stitch Workshop', ware: 'Bengal Kantha Cushion Cover Set', status: 'Dry Storage 20-30C', qty: 15, cost: 14000, date: '2024-03-05' },
  { id: 'KTE-0006', embroiderer: 'Bardhaman Kantha Heritage Colony', ware: 'Kantha Lep Kantha Shawl', status: 'Running Stitch Evenness QC', qty: 8, cost: 42000, date: '2024-03-18' },
  { id: 'KTE-0007', embroiderer: 'Hooghly Kantha Craft Studio', ware: 'Kantha Embroidered Bedspread', status: 'GI Kantha Embroidery Mark', qty: 3, cost: 58000, date: '2024-03-30' },
  { id: 'KTE-0008', embroiderer: 'North 24 Parganas Kantha Guild', ware: 'Kantha Patchwork Wall Hanging', status: 'IS 16924 Kantha Stitch Grade A', qty: 10, cost: 25000, date: '2024-04-12' },
  { id: 'KTE-0009', embroiderer: 'Bolpur Santiniketan Kantha Guild', ware: 'Bengal Nakshi Kantha Quilt', status: 'Acid-Free Tissue Flat Pack', qty: 7, cost: 48000, date: '2024-04-24' },
  { id: 'KTE-0010', embroiderer: 'Birbhum Rural Embroidery Society', ware: 'Kantha Running Stitch Saree', status: 'Enclosed Truck Transit', qty: 5, cost: 56000, date: '2024-05-06' },
  { id: 'KTE-0011', embroiderer: 'Murshidabad Kantha Art Centre', ware: 'Kantha Sujani Thread Panel', status: 'Dry Storage 20-30C', qty: 9, cost: 32000, date: '2024-05-18' },
  { id: 'KTE-0012', embroiderer: 'Nadia Traditional Kantha Cooperative', ware: 'Kantha Embroidered Dupatta', status: 'Running Stitch Evenness QC', qty: 14, cost: 16000, date: '2024-05-30' },
  { id: 'KTE-0013', embroiderer: 'Howrah Bengal Stitch Workshop', ware: 'Kantha Lep Kantha Shawl', status: 'GI Kantha Embroidery Mark', qty: 6, cost: 50000, date: '2024-06-12' },
  { id: 'KTE-0014', embroiderer: 'Bardhaman Kantha Heritage Colony', ware: 'Bengal Kantha Cushion Cover Set', status: 'IS 16924 Kantha Stitch Grade A', qty: 18, cost: 12000, date: '2024-06-24' },
  { id: 'KTE-0015', embroiderer: 'Hooghly Kantha Craft Studio', ware: 'Kantha Patchwork Wall Hanging', status: 'Acid-Free Tissue Flat Pack', qty: 4, cost: 54000, date: '2024-07-06' },
  { id: 'KTE-0016', embroiderer: 'North 24 Parganas Kantha Guild', ware: 'Kantha Embroidered Bedspread', status: 'Enclosed Truck Transit', qty: 8, cost: 38000, date: '2024-07-18' },
  { id: 'KTE-0017', embroiderer: 'Bolpur Santiniketan Kantha Guild', ware: 'Kantha Sujani Thread Panel', status: 'Dry Storage 20-30C', qty: 11, cost: 28000, date: '2024-07-30' },
  { id: 'KTE-0018', embroiderer: 'Birbhum Rural Embroidery Society', ware: 'Kantha Running Stitch Saree', status: 'Running Stitch Evenness QC', qty: 3, cost: 58000, date: '2024-08-10' },
  { id: 'KTE-0019', embroiderer: 'Murshidabad Kantha Art Centre', ware: 'Bengal Nakshi Kantha Quilt', status: 'GI Kantha Embroidery Mark', qty: 7, cost: 45000, date: '2024-08-22' },
  { id: 'KTE-0020', embroiderer: 'Nadia Traditional Kantha Cooperative', ware: 'Kantha Embroidered Dupatta', status: 'IS 16924 Kantha Stitch Grade A', qty: 10, cost: 30000, date: '2024-09-03' },
]

export default function KanthaEmbroideryBengalLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = [...kanthaRecords, ...genRecords(21), ...genRecords(41)]

  const filteredRecords = useMemo(() => {
    if (!searchQuery && Object.keys(activeFilters).every(k => !activeFilters[k].length)) return allRecords
    const sq = searchQuery.toLowerCase()
    return allRecords.filter(r => { if (sq && !r.id.toLowerCase().includes(sq) && !r.ware.toLowerCase().includes(sq)) return false; return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string)); })
  }, [searchQuery, activeFilters, allRecords])

  const filterGroups = [
    { key: 'ware', label: 'Ware', options: PRODUCTS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.ware === p).length })) },
    { key: 'embroiderer', label: 'Embroiderer', options: EMBROIDERERS.map(e => ({ value: e, label: e, count: allRecords.filter(r => r.embroiderer === e).length })) },
  ]

  const trendData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m, i) => ({ month: m, shipments: ri(8, 38, allRecords.length * 0.17 + i * 6) }))
  const embroidererChart = EMBROIDERERS.map(e => ({ name: e.split(' ').slice(0, 2).join(' '), volume: allRecords.filter(r => r.embroiderer === e).reduce((s, r) => s + r.qty, 0) }))
  const statusPie = STATUSES.map(s => ({ name: s, value: allRecords.filter(r => r.status === s).length }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="kte-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Kantha Embroidery Bengal' }]} />
      <PageHeader title="Kantha Embroidery Bengal Logistics" description="Kantha embroidery supply chain with IS 16924 Kantha stitch compliance, running stitch evenness QC, acid-free tissue flat pack packaging, and GI Kantha Embroidery Mark certification across 8 heritage artisan clusters in Birbhum, Murshidabad, and Nadia districts" />
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
            <KpiTile label="Active Ware" value={PRODUCTS.length} />
            <KpiTile label="Embroiderer Clusters" value={EMBROIDERERS.length} />
            <KpiTile label="Avg Cost" value={`₹${Math.round(allRecords.reduce((s, r) => s + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>
          <div className="grid grid-cols-6 gap-4">
            <HealthRing label="GI Tag" value={94} />
            <HealthRing label="IS 16924" value={89} />
            <HealthRing label="Tissue" value={87} />
            <HealthRing label="Truck" value={83} />
            <HealthRing label="Storage" value={91} />
            <HealthRing label="Stitch" value={96} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Artisan Families" value="1,800+" />
            <ValueTile label="Kantha Tradition" value="Since 6th C BCE" />
            <ValueTile label="Export Markets" value="32 Countries" />
            <ValueTile label="Annual Revenue" value="₹48 Crore" />
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
            placeholder="Search Kantha embroidery shipments..."
          />
          <div className="rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-rose-100">
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
                  <tr key={record.id} className="border-t hover:bg-rose-50/50">
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
              <CardHeader><CardTitle>Kantha Embroidery — 2,500-Year Bengal Needlework Tradition</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Kantha embroidery represents one of India's oldest and most artistically distinctive textile needlework traditions, originating in the Bengal region over 2,500 years ago as a practical household craft practiced by rural women who transformed worn-out cotton saris and dhotis into beautifully embroidered quilts, wraps, and ceremonial textiles using the simple running stitch technique that gives Kantha its name, derived from the Sanskrit word kontha meaning rags or patched cloth. The Kantha tradition is deeply embedded in the cultural life of rural Bengal where generations of women have developed an extraordinarily rich embroidery vocabulary using nothing more than a simple needle, cotton thread, and layered old fabric to create narrative textile art that depicts scenes from Hindu mythology, Bengali folk tales, daily rural life, and the natural world with a distinctive linear stitch style that produces flowing, almost calligraphic designs of remarkable artistic sophistication despite the extreme technical simplicity of the running stitch technique. The traditional Kantha embroidery vocabulary encompasses several distinct regional styles each bearing the unique aesthetic character of its area of origin: the Nakshi Kantha of Rajshahi and Bogra districts featuring elaborate pictorial narratives with densely embroidered figures and scenes from the Ramayana and Mahabharata epics, the Sujani Kantha of Bhagalpur and Munger regions characterised by bold geometric patterns and ritualistic designs created for ceremonial childbirth and wedding gifts, the Lep Kantha of Maldah and Murshidabad featuring thick multi-layered quilting stitch patterns producing warm padded wraps for winter use, the Oaar Kantha of Nadia and North 24 Parganas districts distinguished by decorative pillow cover designs with elaborate floral border patterns, and the Archilata Kantha used for covering mirrors and toilet articles featuring small diamond and lotus motifs in symmetrical arrangements. The authentic Kantha technique uses exclusively the running stitch worked through multiple layers of soft cotton fabric, with the characteristic rippled texture of the background fabric created by the tension of the embroidery stitches pulling the layered cloth into gentle undulations that produce a unique tactile quality immediately distinguishable from all other Indian embroidery traditions. Today approximately 1,800 artisan families across eight heritage clusters in Birbhum, Murshidabad, Nadia, Howrah, Bardhaman, Hooghly, and North 24 Parganas districts sustain this irreplaceable tradition, generating an estimated 48 crore rupees annually through domestic boutique retail, government handicraft emporiums, international fashion house collaborations, and growing museum textile collections worldwide.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>IS 16924 Kantha Stitch Standards & Running Stitch Evenness QC</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">The IS 16924 standard for Kantha embroidery establishes India's first comprehensive quality certification framework for this ancient Bengal needlework tradition, specifying requirements for authentic running stitch technique execution, traditional material quality, stitch density uniformity, and design vocabulary compliance that distinguish genuine hand-embroidered Kantha work from machine-embroidered reproductions and printed imitations that have increasingly appeared in both domestic Indian craft markets and international online retail platforms over the past decade. The standard mandates stitch technique requirements for Grade A certification: exclusively hand-executed running stitch using the traditional Bengal Kantha method where the needle passes continuously through multiple fabric layers in a uniform directional pattern producing the characteristic even stitch length between 2 and 4 millimetres per stitch with permissible variation not exceeding plus or minus 0.5 millimetres measured across any 10-centimetre sample area, verified through digital stitch measurement equipment at authorised textile testing laboratories using calibrated macro-photography systems capable of resolving individual thread paths at 100x magnification. Thread quality requirements for IS 16924 Grade A certification mandate the use of premium quality mercerised cotton embroidery thread with minimum 2-ply construction, tensile strength exceeding 450 grams per tex, and colour fastness rating of minimum 4 on the ISO 105-C06 wash fastness scale and minimum 5 on the ISO 105-B02 light fastness scale, ensuring the embroidery thread maintains its colour intensity and structural integrity across decades of use and display in both domestic and museum environments. Running stitch evenness requirements for Grade A certification mandate maximum permissible stitch length variation of plus or minus 15% across the complete embroidered surface area, verified through automated digital image analysis at five randomly selected 5-centimetre sample areas on each piece, ensuring the uniform rhythmic stitch cadence that distinguishes authentic hand-executed Kantha work from the mechanically precise and characteristically uniform stitch patterns produced by computerised embroidery machines that cannot replicate the subtle organic variations inherent in genuine hand needlework.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Acid-Free Tissue Flat Pack Packaging for Kantha Embroidery</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Acid-free tissue flat pack packaging has been specifically developed for Kantha embroidery products to protect the delicate running stitch work, layered cotton ground fabric, and traditional embroidery thread surfaces from the physical abrasion, moisture damage, and contamination risks encountered during transit from Bengal artisan workshops to domestic retail destinations across India and international export markets spanning thirty-two countries that currently import certified Kantha embroidery products for boutique retail, museum textile collections, heritage craft exhibitions, and luxury lifestyle brand sourcing that has grown substantially over the past decade as global awareness of Bengal Kantha embroidery has expanded through international design collaborations and cultural exchange programmes. Each Kantha embroidery piece undergoes careful preparation before packaging: first inspected under natural daylight conditions to verify stitch integrity across the complete embroidered surface area, checking for any loose threads, broken stitch paths, fabric layer separation, or tension irregularities that could worsen during the physical handling and vibration exposure of transit through India's diverse transportation networks from Bengal to national and international cargo hubs. The inspected piece is laid flat on a clean workspace and gently smoothed using cotton-gloved hands to remove any wrinkles or folds without applying tension that could distort the embroidered surface or loosen the running stitch tension that maintains the structural integrity of the layered fabric construction. The prepared piece is wrapped in pH-neutral acid-free tissue paper meeting ISO 10716 archival quality standards with alpha-cellulose content exceeding 97% and lignin content below 1%, providing chemical stability that prevents any acidic degradation of the cotton embroidery thread and fabric layers during extended storage and transit periods that can range from several days for domestic shipments to several weeks for consolidated international export consignments routed through Kolkata and Mumbai cargo terminals to overseas destinations in Europe, North America, and East Asia.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>AI Stitch Pattern Verification & Kantha Embroidery Global Expansion</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Artificial intelligence and computer vision technologies are now being deployed to authenticate Kantha embroidery and verify the hand-executed running stitch quality that distinguishes genuine Bengal Kantha work from the growing volume of machine-embroidered reproductions and digitally printed imitations that have increasingly infiltrated craft retail channels, undermining both the premium market positioning and the cultural heritage value of authentic Kantha embroidery produced by certified artisan families in the Bengal heritage clusters. The AI authentication system employs high-resolution digital scanning at 5,600 dots per inch to capture the complete surface topography of finished Kantha embroidery pieces, analysing individual running stitch paths, thread tension patterns, background fabric ripple characteristics, and motif execution precision against a comprehensive reference database containing over 16,000 authenticated Kantha embroidery samples spanning all major regional Kantha styles and production centres across the Bengal heritage clusters. Machine learning algorithms trained on this extensive dataset can distinguish genuine hand-embroidered Kantha from machine-embroidered reproductions with 99.3% accuracy by detecting subtle structural signatures invisible to standard visual inspection, including the characteristic micro-variation in stitch spacing inherent to hand needlework versus the mathematically uniform stitch intervals produced by computerised embroidery machines, the naturally variable thread tension patterns of hand-pulled running stitches versus the mechanically consistent tension of machine embroidery, and the distinctive background fabric ripple texture created by hand stitch tension through layered cotton that produces gentle undulations with unique organic characteristics impossible to replicate with mechanical embroidery equipment. The West Bengal State Handicrafts Development Corporation has integrated this AI verification system into its GI certification pipeline for Kantha embroidery, reducing the incidence of non-authentic Kantha products in government handicraft emporium channels from an estimated 16% to under 2% since deployment while accelerating the authentication timeline from 20 working days to under 48 hours for qualifying pieces, enabling the Bengal Kantha artisan community to respond more rapidly to the growing international demand for verified heritage textile craft from luxury fashion houses in Paris, London, and New York who now require verifiable digital provenance certificates and AI-authenticated quality grading for all Kantha embroidery products sourced from certified Bengal artisan clusters.</p></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
