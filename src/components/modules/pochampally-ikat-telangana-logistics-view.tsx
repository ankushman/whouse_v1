import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#1e3a5f', '#1e40af', '#2563eb', '#3b82f6', '#60a5fa', '#1e3a8a', '#172554', '#eff6ff']
const PRODUCTS = ['Pochampally Ikat Silk Saree', 'Bhoodan Pochampally Cotton Saree', 'Pochampally Tie-Dye Dupatta', 'Ikat Weaving Wall Panel', 'Pochampally Geometric Ikat Stole', 'Telugu Ikat Temple Border Saree', 'Pochampally Ikat Cushion Cover Set', 'Nalgonda Ikat Silk Kurta Fabric']
const WEAVERS = ['Pochampally Ikat Weavers Society', 'Bhoodan Ikat Weaving Guild', 'Nalgonda Heritage Weavers Colony', 'Warangal Pochampally Workshop', 'Hyderabad Ikat Art Centre', 'Siddipet Ikat Cooperative', 'Yadadri Pochampally Society', 'Khammam Ikat Handloom Studio']
const STATUSES = ['GI Pochampally Ikat Mark', 'IS 16916 Ikat Textile Grade A', 'Muslin Roll with Tissue Interleave', 'Enclosed Truck Transit', 'Dry Storage 20-28C', 'Ikat Pattern Alignment QC']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
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
    id: `PIT-${String(offset + i + 1).padStart(4, '0')}`,
    weaver: WEAVERS[(offset + i) % WEAVERS.length], ware: PRODUCTS[(offset + i) % PRODUCTS.length],
    status: STATUSES[(offset + i) % STATUSES.length], qty: ri(1, 180, ((offset + i) * 37) % 180) + 1,
    cost: ri(2000, 52000, ((offset + i) * 13097) % 50000) + 2000,
    date: new Date(2024, ((offset + i) % 12), ri(1, 28, (offset + i) % 28)).toISOString().slice(0, 10),
  }))

const pochampallyRecords = [
  { id: 'PIT-0001', weaver: 'Pochampally Ikat Weavers Society', ware: 'Pochampally Ikat Silk Saree', status: 'GI Pochampally Ikat Mark', qty: 15, cost: 42000, date: '2024-01-06' },
  { id: 'PIT-0002', weaver: 'Bhoodan Ikat Weaving Guild', ware: 'Bhoodan Pochampally Cotton Saree', status: 'IS 16916 Ikat Textile Grade A', qty: 40, cost: 8500, date: '2024-01-18' },
  { id: 'PIT-0003', weaver: 'Nalgonda Heritage Weavers Colony', ware: 'Pochampally Tie-Dye Dupatta', status: 'Muslin Roll with Tissue Interleave', qty: 70, cost: 3200, date: '2024-02-04' },
  { id: 'PIT-0004', weaver: 'Warangal Pochampally Workshop', ware: 'Ikat Weaving Wall Panel', status: 'Enclosed Truck Transit', qty: 10, cost: 35000, date: '2024-02-16' },
  { id: 'PIT-0005', weaver: 'Hyderabad Ikat Art Centre', ware: 'Pochampally Geometric Ikat Stole', status: 'Dry Storage 20-28C', qty: 55, cost: 4800, date: '2024-03-01' },
  { id: 'PIT-0006', weaver: 'Siddipet Ikat Cooperative', ware: 'Telugu Ikat Temple Border Saree', qty: 12, cost: 38000, date: '2024-03-14', status: 'Ikat Pattern Alignment QC' },
  { id: 'PIT-0007', weaver: 'Yadadri Pochampally Society', ware: 'Pochampally Ikat Cushion Cover Set', status: 'GI Pochampally Ikat Mark', qty: 35, cost: 5600, date: '2024-03-26' },
  { id: 'PIT-0008', weaver: 'Khammam Ikat Handloom Studio', ware: 'Nalgonda Ikat Silk Kurta Fabric', status: 'IS 16916 Ikat Textile Grade A', qty: 60, cost: 6200, date: '2024-04-08' },
  { id: 'PIT-0009', weaver: 'Pochampally Ikat Weavers Society', ware: 'Bhoodan Pochampally Cotton Saree', status: 'Muslin Roll with Tissue Interleave', qty: 45, cost: 9200, date: '2024-04-20' },
  { id: 'PIT-0010', weaver: 'Bhoodan Ikat Weaving Guild', ware: 'Pochampally Ikat Silk Saree', status: 'Enclosed Truck Transit', qty: 8, cost: 48000, date: '2024-05-02' },
  { id: 'PIT-0011', weaver: 'Nalgonda Heritage Weavers Colony', ware: 'Pochampally Tie-Dye Dupatta', status: 'Dry Storage 20-28C', qty: 65, cost: 2800, date: '2024-05-15' },
  { id: 'PIT-0012', weaver: 'Warangal Pochampally Workshop', ware: 'Telugu Ikat Temple Border Saree', status: 'Ikat Pattern Alignment QC', qty: 10, cost: 40000, date: '2024-05-28' },
  { id: 'PIT-0013', weaver: 'Hyderabad Ikat Art Centre', ware: 'Ikat Weaving Wall Panel', status: 'GI Pochampally Ikat Mark', qty: 14, cost: 32000, date: '2024-06-10' },
  { id: 'PIT-0014', weaver: 'Siddipet Ikat Cooperative', ware: 'Pochampally Geometric Ikat Stole', status: 'IS 16916 Ikat Textile Grade A', qty: 50, cost: 4200, date: '2024-06-22' },
  { id: 'PIT-0015', weaver: 'Yadadri Pochampally Society', ware: 'Pochampally Ikat Cushion Cover Set', status: 'Muslin Roll with Tissue Interleave', qty: 30, cost: 5800, date: '2024-07-05' },
  { id: 'PIT-0016', weaver: 'Khammam Ikat Handloom Studio', ware: 'Nalgonda Ikat Silk Kurta Fabric', status: 'Enclosed Truck Transit', qty: 55, cost: 5800, date: '2024-07-16' },
  { id: 'PIT-0017', weaver: 'Pochampally Ikat Weavers Society', ware: 'Telugu Ikat Temple Border Saree', status: 'Dry Storage 20-28C', qty: 11, cost: 45000, date: '2024-07-24' },
  { id: 'PIT-0018', weaver: 'Bhoodan Ikat Weaving Guild', ware: 'Ikat Weaving Wall Panel', status: 'Ikat Pattern Alignment QC', qty: 8, cost: 38000, date: '2024-08-01' },
  { id: 'PIT-0019', weaver: 'Nalgonda Heritage Weavers Colony', ware: 'Pochampally Ikat Silk Saree', status: 'GI Pochampally Ikat Mark', qty: 18, cost: 50000, date: '2024-08-10' },
  { id: 'PIT-0020', weaver: 'Warangal Pochampally Workshop', ware: 'Nalgonda Ikat Silk Kurta Fabric', status: 'IS 16916 Ikat Textile Grade A', qty: 48, cost: 6500, date: '2024-08-20' },
]

export default function PochampallyIkatTelanganaLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = [...pochampallyRecords, ...genRecords(21), ...genRecords(41)]

  const filteredRecords = useMemo(() => {
    if (!searchQuery && Object.keys(activeFilters).every(k => !activeFilters[k].length)) return allRecords
    const sq = searchQuery.toLowerCase()
    return allRecords.filter(r => { if (sq && !r.id.toLowerCase().includes(sq) && !r.ware.toLowerCase().includes(sq)) return false; return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string)); })
  }, [searchQuery, activeFilters, allRecords])

  const filterGroups = [
    { key: 'ware', label: 'Ware', options: PRODUCTS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.ware === p).length })) },
    { key: 'weaver', label: 'Weaver', options: WEAVERS.map(w => ({ value: w, label: w, count: allRecords.filter(r => r.weaver === w).length })) },
  ]

  const trendData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m, i) => ({ month: m, shipments: ri(18, 65, allRecords.length * 0.3 + i * 9) }))
  const weaverChart = WEAVERS.map(w => ({ name: w.split(' ').slice(0, 2).join(' '), volume: allRecords.filter(r => r.weaver === w).reduce((s, r) => s + r.qty, 0) }))
  const statusPie = STATUSES.map(s => ({ name: s, value: allRecords.filter(r => r.status === s).length }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="pit-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Pochampally Ikat Telangana' }]} />
      <PageHeader title="Pochampally Ikat Telangana Logistics" description="Telangana Pochampally ikat weaving supply chain with IS 16916 ikat textile compliance, resist-dye pattern alignment QC, muslin roll packaging, and GI Pochampally Ikat Mark certification across 8 heritage artisan clusters in Nalgonda and Yadadri districts" />
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
            <KpiTile label="Active Ware" value={PRODUCTS.length} />
            <KpiTile label="Weaver Clusters" value={WEAVERS.length} />
            <KpiTile label="Avg Cost" value={`₹${Math.round(allRecords.reduce((s, r) => s + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>
          <div className="grid grid-cols-6 gap-4">
            <HealthRing label="GI Tag" value={92} />
            <HealthRing label="IS 16916" value={88} />
            <HealthRing label="Muslin" value={86} />
            <HealthRing label="Truck" value={83} />
            <HealthRing label="Storage" value={90} />
            <HealthRing label="Ikat" value={95} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Artisan Families" value="3,000+" />
            <ValueTile label="Pochampally Village" value="Since 15th C" />
            <ValueTile label="Export Markets" value="20 Countries" />
            <ValueTile label="Annual Revenue" value="₹35 Crore" />
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
            placeholder="Search Pochampally ikat shipments..."
          />
          <div className="rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-blue-100">
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
                  <tr key={record.id} className="border-t hover:bg-blue-50/50">
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
              <CardHeader><CardTitle>Pochampally Ikat — 600-Year Telugu Weaving Tradition of Nalgonda</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Pochampally ikat is a renowned Indian textile tradition originating from Pochampally village in the Yadadri Bhuvanagiri district of Telangana, where local weavers have practised the intricate art of ikat weaving for over 600 years since the community's migration from the historic Golconda kingdom region during the fifteenth century under the patronage of the Qutb Shahi dynasty rulers who established textile production centres across the Deccan plateau. The term ikat derives from the Malay-Indonesian word mengikat meaning to bind or tie, referring to the resist-dyeing technique where individual yarns are tightly wrapped with resist materials at precisely calculated intervals before being dyed in specific colours, creating patterns that emerge only when the dyed yarns are woven together on the handloom. Pochampally weavers specialise in a distinctive single-ikat variant where primarily the warp yarns are resist-dyed before weaving, though the most complex and valued pieces employ a double-ikat technique approaching the precision of Patola, featuring bold geometric patterns inspired by traditional Telugu temple architecture, Islamic arch motifs from the Qutb Shahi heritage, and vibrant colour combinations in deep blue, crimson red, golden yellow, and emerald green that have become internationally recognised hallmarks of authentic Pochampally ikat design. The traditional production process involves multiple stages of yarn preparation, resist wrapping, sequential dyeing in different colours, unwrapping, rewinding onto the loom beam, and hand-weaving on pit looms operated by two weavers working in tandem for wider silk pieces, with a single complex silk saree requiring three to four weeks of dedicated effort from initial pattern calculation through finished weaving. Today approximately 3,000 artisan families across eight heritage clusters in Pochampally, Bhoodan, Nalgonda, Warangal, and surrounding Telangana districts sustain this tradition, with annual turnover estimated at 35 crore rupees through domestic bridal and festive markets, government handloom emporiums, and growing international demand for authentic Telugu ikat textiles from fashion designers and textile art collectors across Europe, North America, and Southeast Asia.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>IS 16916 Ikat Textile Standards & Pattern Alignment Certification</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">The IS 16916 standard for Pochampally ikat textiles establishes India's quality certification framework for this distinctive Telugu weaving tradition, ensuring the characteristic geometric precision and colour vibrancy that distinguishes genuine Pochampally ikat from commercially printed imitations and machine-produced ikat reproductions that increasingly flood the textile market. The standard specifies detailed requirements for the yarn substrate, mandating silk yarns with minimum filament count of 18 denier for warp threads and 22 denier for weft threads with twist density of 55 twists per metre for silk and 35 twists per metre for cotton variants, ensuring the yarns maintain structural integrity through the extensive resist-dyeing manipulation and high-tension weaving process that characterises Pochampally ikat production. Dye quality requirements for Grade A certification mandate vat or reactive dyes with minimum colourfastness ratings of 4 on the ISO 105-C06 washing scale and 5 on the ISO 105-B02 lightfastness scale for silk products, and natural vegetable-derived dyes acceptable for cotton variants, ensuring the vibrant Pochampally colour palette resists fading through normal wear, washing, and prolonged display conditions. The critical quality parameter for IS 16916 certification is the ikat pattern alignment accuracy, where the resist-dyed pattern segments on the warp yarns must align with the weft interlacing to within 1.0 millimetre tolerance for single ikat and 0.8 millimetre tolerance for double ikat pieces at every pattern boundary across the full fabric width, verified through digital magnification inspection at 20x minimum at NABL-accredited textile testing laboratories. Any deviation exceeding the specified tolerance at more than five boundary points per square metre results in automatic downgrade to Grade B classification, reflecting the high precision standard expected from authentic hand-ikat production where even minor pattern misalignment is visible to trained observers and diminishes the geometric clarity that defines premium Pochampally ikat textile products.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Muslin Roll with Tissue Interleave Packaging for Ikat Textiles</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Muslin roll with tissue interleave packaging has been specifically designed for Pochampally ikat textiles to protect the intricate geometric patterns, vibrant resist-dyed colours, and fine silk or cotton fabric surfaces from physical abrasion, colour transfer, and environmental moisture during transit from Telangana handloom workshops to retail destinations across India and international export markets worldwide. Each individual Pochampally ikat textile piece undergoes a careful multi-layer wrapping protocol beginning with acid-free tissue paper interleaved along the entire fabric length to prevent dye transfer between adjacent folds of the multi-coloured ikat patterns where bright geometric colour boundaries in direct contact can cause colour bleeding during the vibration and humidity fluctuations encountered during road and rail transit across India's diverse climatic zones. The tissue-interleaved fabric is carefully rolled around a custom-cut cotton batting roller to prevent sharp fold creases across the ikat pattern boundaries that would permanently damage both the resist-dyed yarn colour zones and the woven fabric structure. The rolled textile is wrapped in breathable unbleached cotton muslin and placed inside a rigid cylindrical tube constructed from reinforced 5-ply kraft paper with polyethylene foam end caps providing both crush resistance and moisture barrier protection during stacking and transit in shared cargo containers. Silica gel desiccant packets rated for 80 gram absorption capacity are placed within each tube to maintain relative humidity below 40% during transit, as the reactive dyes used in Pochampally ikat production are sensitive to prolonged high humidity exposure that can cause dye migration and blurring of the sharp geometric pattern boundaries that are the defining aesthetic characteristic of authentic Pochampally ikat design. This muslin roll packaging system has been validated to ISTA 3A transit simulation protocols, demonstrating capability to withstand drops from 76 centimetres and stacking compression of 180 kilograms without fabric damage, reducing the historical transit damage rate for Pochampally ikat textiles from 9% to under 2% since its adoption across the certified supply chain.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>AI Pattern Analysis & Pochampally Ikat Market Expansion</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Artificial intelligence and advanced imaging technologies are transforming quality assurance capabilities for the Pochampally ikat craft, where the geometric pattern precision and colour boundary sharpness that define the highest quality pieces have traditionally required years of master weaver experience and subjective visual assessment to evaluate and certify consistently across the diverse artisan workshops producing Pochampally ikat across Telangana state. The AI pattern verification system employs high-resolution flatbed scanning at 1200 dots per inch to capture precise digital images of finished ikat textiles, analysing every geometric pattern intersection and colour boundary across the fabric surface with sub-pixel accuracy to measure pattern alignment deviation with precision to 0.1 millimetres, detecting irregularities such as pattern drift, colour boundary blur, dye bleeding at resist points, or geometric distortion that indicate substandard resist-dyeing technique or improper weaving tension during handloom production. Computer vision algorithms trained on over 15,000 authenticated Pochampally ikat pattern compositions can verify design authenticity by comparing geometric pattern precision, colour palette consistency, traditional motif placement, and overall compositional symmetry against a reference database of master weaver works from each of the eight heritage clusters in the Pochampally and Nalgonda regions, providing objective quality grading that supplements traditional assessment. The Telangana State Handlooms and Textiles Department has piloted this AI verification in its procurement pipeline, reducing quality rejection rates at government Pochampally Ikat emporiums from 17% to under 4% while accelerating certification from 8 working days to under 48 hours for qualifying shipments. India's GI protection for Pochampally ikat combined with digital authentication has expanded export partnerships with premium textile retailers in Japan, Italy, the United Kingdom, and the United States who demand verifiable provenance documentation for authentic Telugu ikat textiles that command premium pricing from 15,000 to over 75,000 rupees per saree depending on complexity and pattern density.</p></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
