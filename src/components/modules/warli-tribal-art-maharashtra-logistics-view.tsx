import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#78350f', '#92400e', '#a16207', '#ca8a04', '#fbbf24', '#451a03', '#1c1917', '#fefce8']
const PRODUCTS = ['Warli Marriage Scene Painting', 'Tarpa Dance Warli Panel', 'Harvest Festival Warli Art', 'Village Life Warli Canvas', 'Sacred Tree Warli Mural', 'Hunting Scene Warli Scroll', 'Wedding Procession Warli', 'Solar System Warli Folk Art']
const ARTISANS = ['Dahanu Adivasi Warli Group', 'Jawhar Tribal Art Centre', 'Palghar Warli Artists', 'Mokhada Folk Art Colony', 'Talasari Adivasi Cluster', 'Vikramgad Warli Studio', 'Wada Rural Art Collective', 'Shahapur Warli Painters']
const STATUSES = ['GI Warli Tribal Art Mark', 'IS 16793 Folk Paint Grade A', 'Rice-Paste Treated Canvas', 'Shock-Proof Van Transit', 'Dust-Free Storage 20-28C', 'Earth Pigment QC']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="wtm-badge inline-block px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="wtm-status inline-block px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="wtm-costbar w-full bg-amber-100 rounded h-2"><div className="bg-amber-700 h-2 rounded" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ value, label, size = 64 }: { value: number; label: string; size?: number }) => {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (ri(0, 100, value) / 100) * circ
  return (
    <div className="wtm-health-ring flex flex-col items-center">
      <svg width={size} height={size}><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={4} /><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#78350f" strokeWidth={4} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`} /></svg>
      <span className="text-xs font-semibold" style={{ color: COLORS[0] }}>{value}%</span>
      <span className="text-[10px] text-gray-500">{label}</span>
    </div>
  )
}

const KpiTile = ({ label, value, icon }: { label: string; value: string; icon: string }) => (
  <Card className="wtm-kpi"><CardContent className="p-4"><div className="flex items-center gap-3"><span className="text-2xl">{icon}</span><div><p className="text-xs text-gray-500">{label}</p><p className="text-xl font-bold" style={{ color: COLORS[0] }}>{value}</p></div></div></CardContent></Card>
)

const ValueTile = ({ label, value }: { label: string; value: string }) => (
  <Card className="wtm-value"><CardContent className="p-4"><p className="text-xs text-gray-500">{label}</p><p className="text-lg font-semibold" style={{ color: COLORS[1] }}>{value}</p></CardContent></Card>
)

const genRecords = (startIdx: number) => Array.from({ length: 20 }, (_, i) => {
  const idx = startIdx + i
  const units = ['pcs', 'panels', 'sets', 'frames']
  return {
    id: `WTM-${String(idx).padStart(4, '0')}`, product: PRODUCTS[idx % 8], artisan: ARTISANS[idx % 8],
    status: STATUSES[idx % 6], qty: ri(3, 50, 5 + idx * 2), unit: units[idx % 4],
    cost: ri(8000, 250000, 12000 + idx * 12000), date: `2025-07-${String(ri(1, 28, idx % 28 + 1)).padStart(2, '0')}`,
  }
})

const warliRecords = [
  { id: 'WTM-0001', product: 'Warli Marriage Scene Painting', artisan: 'Dahanu Adivasi Warli Group', status: 'GI Warli Tribal Art Mark', qty: 5, unit: 'pcs', cost: 25000, date: '2025-07-02' },
  { id: 'WTM-0002', product: 'Tarpa Dance Warli Panel', artisan: 'Jawhar Tribal Art Centre', status: 'IS 16793 Folk Paint Grade A', qty: 18, unit: 'panels', cost: 52000, date: '2025-07-04' },
  { id: 'WTM-0003', product: 'Harvest Festival Warli Art', artisan: 'Palghar Warli Artists', status: 'Rice-Paste Treated Canvas', qty: 12, unit: 'sets', cost: 38000, date: '2025-07-05' },
  { id: 'WTM-0004', product: 'Village Life Warli Canvas', artisan: 'Mokhada Folk Art Colony', status: 'Shock-Proof Van Transit', qty: 25, unit: 'pcs', cost: 75000, date: '2025-07-07' },
  { id: 'WTM-0005', product: 'Sacred Tree Warli Mural', artisan: 'Talasari Adivasi Cluster', status: 'Dust-Free Storage 20-28C', qty: 3, unit: 'frames', cost: 120000, date: '2025-07-08' },
  { id: 'WTM-0006', product: 'Hunting Scene Warli Scroll', artisan: 'Vikramgad Warli Studio', status: 'Earth Pigment QC', qty: 15, unit: 'pcs', cost: 45000, date: '2025-07-10' },
  { id: 'WTM-0007', product: 'Wedding Procession Warli', artisan: 'Wada Rural Art Collective', status: 'GI Warli Tribal Art Mark', qty: 8, unit: 'panels', cost: 68000, date: '2025-07-11' },
  { id: 'WTM-0008', product: 'Solar System Warli Folk Art', artisan: 'Shahapur Warli Painters', status: 'IS 16793 Folk Paint Grade A', qty: 4, unit: 'sets', cost: 155000, date: '2025-07-13' },
  { id: 'WTM-0009', product: 'Warli Marriage Scene Painting', artisan: 'Dahanu Adivasi Warli Group', status: 'Rice-Paste Treated Canvas', qty: 20, unit: 'pcs', cost: 22000, date: '2025-07-14' },
  { id: 'WTM-0010', product: 'Tarpa Dance Warli Panel', artisan: 'Jawhar Tribal Art Centre', status: 'Shock-Proof Van Transit', qty: 30, unit: 'panels', cost: 65000, date: '2025-07-15' },
  { id: 'WTM-0011', product: 'Harvest Festival Warli Art', artisan: 'Palghar Warli Artists', status: 'Dust-Free Storage 20-28C', qty: 10, unit: 'sets', cost: 42000, date: '2025-07-16' },
  { id: 'WTM-0012', product: 'Village Life Warli Canvas', artisan: 'Mokhada Folk Art Colony', status: 'Earth Pigment QC', qty: 35, unit: 'pcs', cost: 95000, date: '2025-07-17' },
  { id: 'WTM-0013', product: 'Sacred Tree Warli Mural', artisan: 'Talasari Adivasi Cluster', status: 'GI Warli Tribal Art Mark', qty: 6, unit: 'frames', cost: 145000, date: '2025-07-18' },
  { id: 'WTM-0014', product: 'Hunting Scene Warli Scroll', artisan: 'Vikramgad Warli Studio', status: 'IS 16793 Folk Paint Grade A', qty: 22, unit: 'pcs', cost: 58000, date: '2025-07-19' },
  { id: 'WTM-0015', product: 'Wedding Procession Warli', artisan: 'Wada Rural Art Collective', status: 'Rice-Paste Treated Canvas', qty: 7, unit: 'panels', cost: 55000, date: '2025-07-20' },
  { id: 'WTM-0016', product: 'Solar System Warli Folk Art', artisan: 'Shahapur Warli Painters', status: 'Shock-Proof Van Transit', qty: 4, unit: 'sets', cost: 180000, date: '2025-07-21' },
  { id: 'WTM-0017', product: 'Warli Marriage Scene Painting', artisan: 'Dahanu Adivasi Warli Group', status: 'Dust-Free Storage 20-28C', qty: 14, unit: 'pcs', cost: 32000, date: '2025-07-22' },
  { id: 'WTM-0018', product: 'Tarpa Dance Warli Panel', artisan: 'Jawhar Tribal Art Centre', status: 'Earth Pigment QC', qty: 28, unit: 'panels', cost: 72000, date: '2025-07-23' },
  { id: 'WTM-0019', product: 'Harvest Festival Warli Art', artisan: 'Palghar Warli Artists', status: 'GI Warli Tribal Art Mark', qty: 16, unit: 'sets', cost: 48000, date: '2025-07-24' },
  { id: 'WTM-0020', product: 'Village Life Warli Canvas', artisan: 'Mokhada Folk Art Colony', status: 'IS 16793 Folk Paint Grade A', qty: 40, unit: 'pcs', cost: 125000, date: '2025-07-25' },
]

export default function WarliTribalArtMaharashtraLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = [...warliRecords, ...genRecords(21), ...genRecords(41)]

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

  const trendData = PRODUCTS.slice(0, 6).map((p, i) => ({ name: p.split(' ').slice(0, 2).join(' '), shipments: 4 + i * 3, cost: 30000 + i * 25000 }))
  const artisanChart = ARTISANS.slice(0, 6).map((a, i) => ({ name: a.split(' ').slice(0, 2).join(' '), volume: 15 + i * 8, revenue: 10 + i * 5 }))
  const statusPie = STATUSES.map((s, i) => ({ name: s.split(' ').slice(0, 2).join(' '), value: 5 + i * 4 }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="wtm-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Warli Tribal Art Maharashtra' }]} />
      <PageHeader title="Warli Tribal Art Maharashtra Logistics" description="Track Maharashtra's 2,500-year Warli tribal art tradition from Dahanu, Jawhar, and Palghar Adivasi communities through rice-paste-on-mud painting, GI-tagged tribal art certification, treated canvas packaging, and shock-proof transit for global folk art exhibition and cultural heritage export markets" />
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-amber-50">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <KpiTile icon="🎨" label="Total Artworks" value={String(allRecords.length)} />
            <KpiTile icon="🏘️" label="Adivasi Clusters" value={String(ARTISANS.length)} />
            <KpiTile icon="💰" label="Total Value" value={`₹${(allRecords.reduce((a, r) => a + r.cost, 0) / 10000000).toFixed(2)}Cr`} />
            <KpiTile icon="📈" label="Avg Artwork" value={`₹${Math.round(allRecords.reduce((a, r) => a + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>

          <Card className="wtm-health-grid">
            <CardHeader><CardTitle>Quality Compliance</CardTitle></CardHeader>
            <CardContent>
              <div className="flex justify-around">
                <HealthRing value={96} label="GI Tag" />
                <HealthRing value={92} label="IS 16793" />
                <HealthRing value={88} label="Canvas" />
                <HealthRing value={81} label="Shock Van" />
                <HealthRing value={90} label="Dust Store" />
                <HealthRing value={94} label="Pigment" />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Adivasi Families" value="12,000+" />
            <ValueTile label="Annual Artworks" value="45,000 pcs" />
            <ValueTile label="Export Markets" value="18 Countries" />
            <ValueTile label="Heritage Age" value="2,500 Years" />
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

          <Card className="wtm-table-card">
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-amber-50">
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
                    <tr key={r.id} className="border-b hover:bg-amber-50/50">
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
              <CardHeader><CardTitle>Artisan Volume</CardTitle></CardHeader>
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
            <Card className="wtm-insight"><CardHeader><CardTitle>Warli Tribal Art — Maharashtra's 2,500-Year Adivasi Heritage</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Warli art is one of India's oldest tribal art forms originating from the Warli and other Adivasi communities of the Sahyadri Range in Maharashtra's Palghar, Dahanu, and Jawhar regions, dating back approximately 2,500-3,000 years to the pre-Aryan period. The art uses only white rice paste (from fermented rice mixed with gum arabic and water) painted on mud-brown cow-dung-washed walls, depicting scenes of daily tribal life — hunting, dancing (Tarpa dance), farming, wedding processions, and sacred trees — rendered in geometric shapes: circles (sun/moon), triangles (mountains/trees), squares (sacred enclosures), and lines (human figures in motion). Unlike classical Indian art traditions, Warli paintings are created exclusively by women during wedding rituals and harvest festivals as acts of devotion to Mother Earth. The tradition supports approximately 12,000 Adivasi families across 400+ villages in Thane, Palghar, and Nashik districts. Recognised with GI tag in 2014, annual production exceeds 45,000 artworks valued at Rs 25 crore with exports to 18 countries including USA, UK, Japan, and France.</p></CardContent></Card>
            <Card className="wtm-insight"><CardHeader><CardTitle>IS 16793 Folk Paint &amp; Earth Pigment Standards</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">IS 16793 covers tribal and folk painting quality including rice paste medium specifications (minimum 72-hour fermented rice slurry with gum arabic binder, viscosity 800-1200 cP, pH 5.5-6.5), substrate preparation (cow-dung-washed mud wall with minimum 3 coats, each dried 24 hours, final coat mixed with red laterite for characteristic brown background), and earth pigment purity standards (rice paste white reflectance minimum 85% on ISO 7724, natural red ochre Fe2O3 minimum 45% for border decorations). Colour adhesion must pass minimum 50 tape-pull cycles per ASTM D3359 Method B without pigment loss. Finished paintings must resist mould growth under accelerated humidity test (30 degrees Celsius, 95% RH, 168 hours) per IS 16793 Annexure D. Heavy metal content in rice paste must meet food-grade safety (lead below 10 ppm, arsenic below 5 ppm) as Warli art is traditionally applied inside dwellings where tribal families live and sleep. Canvas-mounted reproductions require pre-treated cotton canvas (300 GSM, pH 7.0-7.5) with rice paste applied using traditional bamboo stick brushes (diameter 2-4mm for fine lines, 8-12mm for figures).</p></CardContent></Card>
            <Card className="wtm-insight"><CardHeader><CardTitle>Rice-Paste-on-Mud Art Fragility &amp; Packaging Transit</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Warli art on mud walls is inherently ephemeral — traditional paintings last 2-5 years before weathering. Canvas-mounted reproductions for commercial sale require extreme care: rice paste medium is water-soluble and loses adhesion above 35% humidity, making moisture the primary damage vector during logistics. Each canvas is sprayed with clear acrylic fixative (2-3 coats, 30-minute drying between coats) before being rolled on acid-free tube and sealed in polyethylene sleeve with silica gel desiccant packets (50g per 0.5 square metres). From Dahanu/Jawhar to Mumbai (120-150 km) takes 4-6 hours via NH48 and SH35 in shock-proof insulated vans maintaining temperature below 28 degrees Celsius and humidity below 40%. Monsoon season (June-September) is critical — humidity exceeds 90% requiring double-sealed packaging with thermal insulation blankets. India Post registered parcel service handles 60% of domestic shipments while DHL/FedEx handle international exports with IATA Category A fragile cargo classification. Damage rate reduced from 20% to 5% under Maharashtra State Art Directorate packaging guidelines since 2018, covering 3,200 shipments across Dahanu, Jawhar, and Palghar clusters.</p></CardContent></Card>
            <Card className="wtm-insight"><CardHeader><CardTitle>AI Tribal Art Documentation &amp; Global Folk Art Market</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">AI-powered pattern analysis of Warli art creates comprehensive digital archives documenting geometric motifs, composition rules, and brushstroke techniques unique to each village cluster, completing documentation of 100 paintings in 8 hours versus 60 days for manual ethnographic recording. Machine learning classifies Warli styles across Dahanu, Jawhar, Mokhada, and Vikramgad traditions at 97% accuracy by analysing triangle-to-circle ratios, figure density per square inch, and composition balance metrics unique to each school. Automated provenance verification detects machine-printed fakes masquerading as hand-painted Warli with 88% precision by analysing bamboo brush stroke irregularities (hand-painted strokes show 15-25 micron width variation versus less than 3 microns for machine-printed). India's Warli art export grew 200% from Rs 8 crore (2018) to Rs 25 crore (2025), targeting Rs 60 crore by 2028 with growing demand from cultural museums (Smithsonian, British Museum, Quai Branly) and eco-tourism resorts in 18 countries. Blockchain provenance tracking from rice-paste preparation through painting, canvas mounting, and shipping combats mass-produced fakes estimated at Rs 12 crore annually, with QR-code authentication tags now required for all GI-certified Warli exports since 2024.</p></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
