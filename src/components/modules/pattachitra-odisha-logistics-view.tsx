import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#115e59', '#0f766e', '#0d9488', '#14b8a6', '#5eead4', '#134e4a', '#042f2e', '#f0fdfa']
const PRODUCTS = ['Jagannath Temple Pattachitra', 'Dasavatara Scroll Panel', 'Radha Krishna Patta', 'Ganesha Pattachitra Scroll', 'Tree of Life Pattachitra', 'Krishna Leela Scroll', 'Buddha Pattachitra Panel', 'Nabakalebara Temple Art']
const ARTISANS = ['Raghurajpur Artist Village', 'Puri Chitrakar Guild', 'Bhubaneswar Patta Centre', 'Konark Heritage Painters', 'Sonepur Scroll Artisans', 'Cuttack Pattachitra Studio', 'Ganjam Traditional Artists', 'Balasore Folk Art Cluster']
const STATUSES = ['GI Pattachitra Mark', 'IS 16791 Handpaint Grade A', 'Treated Cloth Rolled Bundle', 'Enclosed Van Transit', 'Humidity 30-45% Storage', 'Natural Dye QC']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="pco-badge inline-block px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="pco-status inline-block px-2 py-0.5 rounded text-xs font-medium bg-teal-100 text-teal-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="pco-costbar w-full bg-teal-100 rounded h-2"><div className="bg-teal-700 h-2 rounded" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ value, label, size = 64 }: { value: number; label: string; size?: number }) => {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (ri(0, 100, value) / 100) * circ
  return (
    <div className="pco-health-ring flex flex-col items-center">
      <svg width={size} height={size}><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={4} /><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#115e59" strokeWidth={4} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`} /></svg>
      <span className="text-xs font-semibold" style={{ color: COLORS[0] }}>{value}%</span>
      <span className="text-[10px] text-gray-500">{label}</span>
    </div>
  )
}

const KpiTile = ({ label, value, icon }: { label: string; value: string; icon: string }) => (
  <Card className="pco-kpi"><CardContent className="p-4"><div className="flex items-center gap-3"><span className="text-2xl">{icon}</span><div><p className="text-xs text-gray-500">{label}</p><p className="text-xl font-bold" style={{ color: COLORS[0] }}>{value}</p></div></div></CardContent></Card>
)

const ValueTile = ({ label, value }: { label: string; value: string }) => (
  <Card className="pco-value"><CardContent className="p-4"><p className="text-xs text-gray-500">{label}</p><p className="text-lg font-semibold" style={{ color: COLORS[1] }}>{value}</p></CardContent></Card>
)

const genRecords = (startIdx: number) => Array.from({ length: 20 }, (_, i) => {
  const idx = startIdx + i
  const units = ['scrolls', 'panels', 'pattas', 'scrolls']
  return {
    id: `PCO-${String(idx).padStart(4, '0')}`, product: PRODUCTS[idx % 8], artisan: ARTISANS[idx % 8],
    status: STATUSES[idx % 6], qty: ri(5, 80, 8 + idx * 3), unit: units[idx % 4],
    cost: ri(3000, 45000, 5000 + idx * 2000), date: `2024-11-${String(ri(1, 28, idx % 28 + 1)).padStart(2, '0')}`,
  }
})

const pattachitraRecords = [
  { id: 'PCO-0001', product: 'Jagannath Temple Pattachitra', artisan: 'Raghurajpur Artist Village', status: 'GI Pattachitra Mark', qty: 25, unit: 'scrolls', cost: 87500, date: '2024-11-01' },
  { id: 'PCO-0002', product: 'Dasavatara Scroll Panel', artisan: 'Puri Chitrakar Guild', status: 'IS 16791 Handpaint Grade A', qty: 18, unit: 'panels', cost: 64200, date: '2024-11-03' },
  { id: 'PCO-0003', product: 'Radha Krishna Patta', artisan: 'Bhubaneswar Patta Centre', status: 'Treated Cloth Rolled Bundle', qty: 30, unit: 'pattas', cost: 45000, date: '2024-11-05' },
  { id: 'PCO-0004', product: 'Ganesha Pattachitra Scroll', artisan: 'Konark Heritage Painters', status: 'Enclosed Van Transit', qty: 12, unit: 'scrolls', cost: 92000, date: '2024-11-07' },
  { id: 'PCO-0005', product: 'Tree of Life Pattachitra', artisan: 'Sonepur Scroll Artisans', status: 'Humidity 30-45% Storage', qty: 22, unit: 'panels', cost: 71500, date: '2024-11-09' },
  { id: 'PCO-0006', product: 'Krishna Leela Scroll', artisan: 'Cuttack Pattachitra Studio', status: 'Natural Dye QC', qty: 15, unit: 'scrolls', cost: 58300, date: '2024-11-11' },
  { id: 'PCO-0007', product: 'Buddha Pattachitra Panel', artisan: 'Ganjam Traditional Artists', status: 'GI Pattachitra Mark', qty: 20, unit: 'panels', cost: 81000, date: '2024-11-13' },
  { id: 'PCO-0008', product: 'Nabakalebara Temple Art', artisan: 'Balasore Folk Art Cluster', status: 'IS 16791 Handpaint Grade A', qty: 35, unit: 'scrolls', cost: 120000, date: '2024-11-15' },
  { id: 'PCO-0009', product: 'Jagannath Temple Pattachitra', artisan: 'Puri Chitrakar Guild', status: 'Treated Cloth Rolled Bundle', qty: 28, unit: 'scrolls', cost: 98000, date: '2024-11-17' },
  { id: 'PCO-0010', product: 'Dasavatara Scroll Panel', artisan: 'Raghurajpur Artist Village', status: 'Enclosed Van Transit', qty: 16, unit: 'panels', cost: 54700, date: '2024-11-19' },
  { id: 'PCO-0011', product: 'Radha Krishna Patta', artisan: 'Konark Heritage Painters', status: 'Humidity 30-45% Storage', qty: 40, unit: 'pattas', cost: 68000, date: '2024-11-21' },
  { id: 'PCO-0012', product: 'Ganesha Pattachitra Scroll', artisan: 'Bhubaneswar Patta Centre', status: 'Natural Dye QC', qty: 10, unit: 'scrolls', cost: 73200, date: '2024-11-23' },
  { id: 'PCO-0013', product: 'Tree of Life Pattachitra', artisan: 'Cuttack Pattachitra Studio', status: 'GI Pattachitra Mark', qty: 24, unit: 'panels', cost: 88900, date: '2024-11-25' },
  { id: 'PCO-0014', product: 'Krishna Leela Scroll', artisan: 'Sonepur Scroll Artisans', status: 'IS 16791 Handpaint Grade A', qty: 32, unit: 'scrolls', cost: 76400, date: '2024-11-27' },
  { id: 'PCO-0015', product: 'Buddha Pattachitra Panel', artisan: 'Raghurajpur Artist Village', status: 'Treated Cloth Rolled Bundle', qty: 14, unit: 'panels', cost: 62100, date: '2024-12-01' },
  { id: 'PCO-0016', product: 'Nabakalebara Temple Art', artisan: 'Puri Chitrakar Guild', status: 'Enclosed Van Transit', qty: 45, unit: 'scrolls', cost: 145000, date: '2024-12-03' },
  { id: 'PCO-0017', product: 'Jagannath Temple Pattachitra', artisan: 'Ganjam Traditional Artists', status: 'Humidity 30-45% Storage', qty: 19, unit: 'scrolls', cost: 79600, date: '2024-12-05' },
  { id: 'PCO-0018', product: 'Dasavatara Scroll Panel', artisan: 'Balasore Folk Art Cluster', status: 'Natural Dye QC', qty: 27, unit: 'panels', cost: 93500, date: '2024-12-07' },
  { id: 'PCO-0019', product: 'Radha Krishna Patta', artisan: 'Cuttack Pattachitra Studio', status: 'GI Pattachitra Mark', qty: 33, unit: 'pattas', cost: 55000, date: '2024-12-09' },
  { id: 'PCO-0020', product: 'Ganesha Pattachitra Scroll', artisan: 'Bhubaneswar Patta Centre', status: 'IS 16791 Handpaint Grade A', qty: 21, unit: 'scrolls', cost: 84200, date: '2024-12-11' },
]

export default function PattachitraOdishaLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = [...pattachitraRecords, ...genRecords(21), ...genRecords(41)]

  const filteredRecords = useMemo(() => {
    return allRecords.filter(r => {
      if (searchQuery && !r.id.toLowerCase().includes(searchQuery.toLowerCase()) && !r.product.toLowerCase().includes(searchQuery.toLowerCase())) return false
      return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string))
    })
  }, [searchQuery, activeFilters, allRecords])

  const filterGroups = [
    { key: 'product', label: 'Product', options: PRODUCTS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.product === p).length })) },
    { key: 'artisan', label: 'Artisan', options: ARTISANS.map(a => ({ value: a, label: a, count: allRecords.filter(r => r.artisan === a).length })) },
  ]

  const trendData = PRODUCTS.slice(0, 6).map((p, i) => ({ name: p.split(' ').slice(0, 2).join(' '), shipments: 4 + i * 3, cost: 8000 + i * 6500 }))
  const artisanChart = ARTISANS.slice(0, 6).map((a, i) => ({ name: a.split(' ').slice(0, 2).join(' '), volume: 15 + i * 8, revenue: 10 + i * 5 }))
  const statusPie = STATUSES.map((s, i) => ({ name: s.split(' ').slice(0, 2).join(' '), value: 5 + i * 4 }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="pco-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Pattachitra Odisha' }]} />
      <PageHeader title="Pattachitra Odisha Logistics" description="Track Odisha's 1,000-year scroll painting tradition from Raghurajpur artisan village through GI-tagged Pattachitra certification, IS 16791 handpaint grading, treated cloth rolling, enclosed van transit, and humidity-controlled warehouse storage for temple art distribution" />
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-teal-50">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <KpiTile icon="🎨" label="Total Scrolls" value={String(allRecords.length)} />
            <KpiTile icon="🏠" label="Artisan Clusters" value={String(ARTISANS.length)} />
            <KpiTile icon="💰" label="Total Value" value={`₹${(allRecords.reduce((a, r) => a + r.cost, 0) / 100000).toFixed(1)}L`} />
            <KpiTile icon="📈" label="Avg Scroll" value={`₹${Math.round(allRecords.reduce((a, r) => a + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>

          <Card className="pco-health-grid">
            <CardHeader><CardTitle>Quality Compliance</CardTitle></CardHeader>
            <CardContent>
              <div className="flex justify-around">
                <HealthRing value={95} label="GI Mark" />
                <HealthRing value={91} label="IS 16791" />
                <HealthRing value={87} label="Treated" />
                <HealthRing value={80} label="Van" />
                <HealthRing value={93} label="Humidity" />
                <HealthRing value={89} label="Dye QC" />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Artisan Families" value="500+" />
            <ValueTile label="Annual Production" value="8 Lakh scrolls" />
            <ValueTile label="Export Markets" value="18 Countries" />
            <ValueTile label="Scroll Varieties" value="300+" />
          </div>
        </TabsContent>

        <TabsContent value="shipments" className="space-y-4">
          <SearchFilterToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onClearSearch={() => setSearchQuery('')}
            activeFilters={activeFilters}
            filterGroups={filterGroups}
            onToggleFilter={(key, value) => setActiveFilters(p => ({ ...p, [key]: p[key]?.includes(value) ? p[key].filter((v: string) => v !== value) : [...(p[key] || []), value] }))}
            onClearAllFilters={() => setActiveFilters({})}
            totalItems={allRecords.length}
            filteredCount={filteredRecords.length}
            onRefresh={() => {}}
            placeholder="Search by ID, product, or artisan..."
          />

          <Card className="pco-table-card">
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-teal-50">
                    <th className="p-3 text-left">ID</th>
                    <th className="p-3 text-left">Product</th>
                    <th className="p-3 text-left">Artisan</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-right">Qty</th>
                    <th className="p-3 text-right">Cost</th>
                    <th className="p-3 text-left">Cost Bar</th>
                    <th className="p-3 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.slice(0, 15).map(r => (
                    <tr key={r.id} className="border-b hover:bg-teal-50/50">
                      <td className="p-3 font-mono text-xs">{r.id}</td>
                      <td className="p-3"><ProductBadge name={r.product} /></td>
                      <td className="p-3 text-xs">{r.artisan}</td>
                      <td className="p-3"><StatusBadge status={r.status} /></td>
                      <td className="p-3 text-right">{r.qty} {r.unit}</td>
                      <td className="p-3 text-right">₹{r.cost.toLocaleString()}</td>
                      <td className="p-3 w-28"><CostBar cost={r.cost} max={maxCost} /></td>
                      <td className="p-3 text-xs text-gray-500">{r.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle>Shipment Trend</CardTitle></CardHeader>
              <CardContent>
                <LineChart width={500} height={250} data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={11} />
                  <YAxis fontSize={11} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="shipments" stroke={COLORS[0]} strokeWidth={2} />
                  <Line type="monotone" dataKey="cost" stroke={COLORS[3]} strokeWidth={2} />
                </LineChart>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Artisan Cluster Volume</CardTitle></CardHeader>
              <CardContent>
                <BarChart width={500} height={250} data={artisanChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={10} />
                  <YAxis fontSize={11} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="volume" fill={COLORS[0]} />
                  <Bar dataKey="revenue" fill={COLORS[3]} />
                </BarChart>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader><CardTitle>Status Distribution</CardTitle></CardHeader>
            <CardContent>
              <PieChart width={500} height={300}>
                <Pie data={statusPie} cx={200} cy={150} outerRadius={100} dataKey="value" label>
                  {statusPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card className="pco-insight"><CardHeader><CardTitle>Pattachitra — Odisha's 1,000-Year Temple Art Tradition</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Pattachitra is one of the oldest and most disciplined schools of painting in India, originating in Odisha over a millennium ago. The word derives from the Sanskrit 'patta' (cloth) and 'chitra' (picture). Traditionally, Chitrakars (painter families) from Raghurajpur village near Puri have served as hereditary artists for the Jagannath Temple, creating sacred imagery for daily rituals, festival decorations, and pilgrim souvenirs. The artform uses only natural materials — tussar silk or cotton cloth treated with tamarind seed paste, chalk powder, and gum from kaitha tree. Colours are sourced entirely from nature: white from conch shells, red from hingula stone, yellow from orpiment mineral, black from lamp soot, and blue from indigo. Each Pattachitra can take 5-15 days depending on complexity, with master artists commanding prices from Rs 5,000 to Rs 2 lakh per scroll. UNESCO recognised Pattachitra as part of Odisha's intangible cultural heritage in 2023.</p></CardContent></Card>
            <Card className="pco-insight"><CardHeader><CardTitle>IS 16791 Handpaint Standards &amp; GI Certification</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">IS 16791 is the Indian Standard specification for hand-painted products covering Pattachitra and related cloth-based traditional art. The standard mandates minimum cloth GSM of 120 for cotton base and 80 GSM for tussar silk, with tamarind paste coating thickness between 0.3-0.5mm for proper paint adhesion. Paint colour fastness must achieve Grade 4 minimum on ISO 105-X12 (rubbing test) and Grade 3 on ISO 105-B02 (light fastness). GI Pattachitra Mark registration (2018) requires that at least 75% of production processes including cloth preparation, line drawing, colour filling, and border ornamentation be completed within Odisha state. Heavy metal limits follow ASTM D4236: lead below 90 ppm, cadmium below 75 ppm, arsenic below 25 ppm, and mercury below 10 ppm in all natural dye preparations. Acid-free archival storage paper interleaving is mandatory for pieces valued above Rs 10,000 to prevent pigment migration and fungal degradation during long-term warehousing.</p></CardContent></Card>
            <Card className="pco-insight"><CardHeader><CardTitle>Treated Cloth Scroll Packaging &amp; Transit Logistics</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Pattachitra scrolls present unique packaging challenges due to their cloth substrate and mineral pigment surfaces. Finished scrolls are first interleaved with acid-free tissue paper, then rolled around a 2-inch diameter PVC pipe wrapped in cotton batting to prevent creasing and pigment cracking. The rolled bundle is placed in a custom-sewn unbleached muslin bag with silica gel packets (5g per scroll) maintaining relative humidity between 30-45%. Outer packaging uses 7-ply double-wall corrugated boxes with 40mm foam corner protectors. Maximum stack height in warehouse is 3 boxes (approximately 8 kg each) to avoid compression damage. Transit from Raghurajpur to Bhubaneswar (60 km) takes 2 hours via NH316 in enclosed Tata Winger vans with air suspension maintaining temperature 22-28 degrees Celsius. For national distribution to Delhi, Mumbai, and Chennai, Indian Railways parcel service is preferred (48-72 hours) over road transport (3-5 days) due to reduced vibration exposure and 40% lower damage rates. International export uses temperature-controlled air cargo with fumigation certificate compliance under ISPM 15.</p></CardContent></Card>
            <Card className="pco-insight"><CardHeader><CardTitle>AI Digitisation &amp; Jagannath Temple Art Preservation</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Artificial intelligence is revolutionising Pattachitra preservation and market access. High-resolution gigapixel imaging (over 1 billion pixels per scroll) captures brushstroke detail invisible to the naked eye, enabling digital archiving of temple Pattachitra dating back to the 12th century from Jagannath Temple's collection of over 2,000 sacred scrolls. Machine learning models trained on 50,000 annotated Pattachitra images achieve 96% accuracy in identifying artist lineage, regional style variations (Raghurajpur, Puri, Sonepur schools), and detecting modern forgeries by analysing brush pressure patterns and natural dye chemical signatures through hyperspectral imaging. AI-powered design generation tools allow contemporary Chitrakar families to create fusion designs blending traditional motifs with modern themes, reducing design iteration time from 15 days to 2 hours while maintaining aesthetic authenticity. Blockchain-verified provenance certificates from raw cloth sourcing through final painting protect against the estimated Rs 8 crore annual counterfeit Pattachitra market, enabling premium pricing of 25-40% above unverified works in international galleries across 18 countries including USA, UK, Japan, and France.</p></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
