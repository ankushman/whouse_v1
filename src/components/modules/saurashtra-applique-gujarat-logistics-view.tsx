import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#0e7490', '#0891b2', '#06b6d4', '#22d3ee', '#cffafe', '#155e75', '#164e63', '#ecfeff']
const PRODUCTS = ['Tree of Life Applique Panel', 'Saurashtra Geometric Wall Hanging', 'Camel Motif Applique Quilt', 'Peacock Patchwork Curtain', 'Mandala Applique Bedspread', 'Floral Applique Table Runner', 'Elephant Procession Wall Panel', 'Star Patchwork Cushion Set']
const STITCHERS = ['Bhuj Katab Stitchers Guild', 'Rajkot Applique Collective', 'Junagadh Patchwork Centre', 'Jamnagar Traditional Quilters', 'Porbandar Textile Art Society', 'Surendranagar Applique Studio', 'Wankaner Heritage Stitchers', 'Veraval Coastal Applique Guild']
const STATUSES = ['GI Saurashtra Applique Mark', 'IS 16800 Patchwork Textile Grade A', 'Cotton Flat Fold Bundle', 'Palletised Truck Transit', 'Moisture-Free Storage 20-28C', 'Stitch Tension QC']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ p }: { p: string }) => (
  <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{p}</span>
)

const StatusBadge = ({ s }: { s: string }) => (
  <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800">{s}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="w-20 h-2 rounded-full bg-cyan-100"><div className="h-2 rounded-full bg-cyan-700" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ label, value }: { label: string; value: number }) => {
  const r = 40, c = 2 * Math.PI * r, off = c - (value / 100) * c
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="56" height="56" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="#e5e7eb" strokeWidth="8" />
        <circle cx="50" cy="50" r={r} fill="none" stroke={COLORS[0]} strokeWidth="8" strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round" transform="rotate(-90 50 50)" />
        <text x="50" y="54" textAnchor="middle" fontSize="18" fontWeight="700" fill={COLORS[0]}>{value}</text>
      </svg>
      <span className="text-[11px] text-muted-foreground">{label}</span>
    </div>
  )
}

const KpiTile = ({ label, value }: { label: string; value: string | number }) => (
  <Card className="p-4"><p className="text-sm text-muted-foreground">{label}</p><p className="text-2xl font-bold">{value}</p></Card>
)

const ValueTile = ({ label, value }: { label: string; value: string }) => (
  <Card className="p-4"><p className="text-sm text-muted-foreground">{label}</p><p className="text-lg font-semibold" style={{ color: COLORS[1] }}>{value}</p></Card>
)

const genRecords = (offset: number) => Array.from({ length: 20 }, (_, i) => ({
  id: `SAP-${String(offset + i + 1).padStart(4, '0')}`,
  textile: PRODUCTS[(offset + i) % PRODUCTS.length],
  stitcher: STITCHERS[(offset + i) % STITCHERS.length],
  status: STATUSES[(offset + i) % STATUSES.length],
  qty: [1, 2, 3, 4, 5][(offset + i) % 5],
  cost: [8000, 15000, 22000, 35000, 50000, 65000, 80000, 95000, 110000, 125000, 140000, 155000, 168000][(offset + i) % 13],
  unit: ['panels', 'sets', 'quilts', 'yards'][(offset + i) % 4],
  date: `2025-0${(i % 9) + 1}-15` }))

const appliqueRecords = [
  { id: 'SAP-0001', textile: 'Tree of Life Applique Panel', stitcher: 'Bhuj Katab Stitchers Guild', status: 'GI Saurashtra Applique Mark', qty: 3, cost: 45000, unit: 'panels', date: '2025-01-12' },
  { id: 'SAP-0002', textile: 'Saurashtra Geometric Wall Hanging', stitcher: 'Rajkot Applique Collective', status: 'IS 16800 Patchwork Textile Grade A', qty: 2, cost: 28000, unit: 'panels', date: '2025-01-18' },
  { id: 'SAP-0003', textile: 'Camel Motif Applique Quilt', stitcher: 'Junagadh Patchwork Centre', status: 'Cotton Flat Fold Bundle', qty: 5, cost: 75000, unit: 'quilts', date: '2025-02-03' },
  { id: 'SAP-0004', textile: 'Peacock Patchwork Curtain', stitcher: 'Jamnagar Traditional Quilters', status: 'Palletised Truck Transit', qty: 4, cost: 52000, unit: 'yards', date: '2025-02-14' },
  { id: 'SAP-0005', textile: 'Mandala Applique Bedspread', stitcher: 'Porbandar Textile Art Society', status: 'Moisture-Free Storage 20-28C', qty: 1, cost: 92000, unit: 'sets', date: '2025-02-22' },
  { id: 'SAP-0006', textile: 'Floral Applique Table Runner', stitcher: 'Surendranagar Applique Studio', status: 'Stitch Tension QC', qty: 6, cost: 18000, unit: 'sets', date: '2025-03-01' },
  { id: 'SAP-0007', textile: 'Elephant Procession Wall Panel', stitcher: 'Wankaner Heritage Stitchers', status: 'GI Saurashtra Applique Mark', qty: 2, cost: 110000, unit: 'panels', date: '2025-03-09' },
  { id: 'SAP-0008', textile: 'Star Patchwork Cushion Set', stitcher: 'Veraval Coastal Applique Guild', status: 'IS 16800 Patchwork Textile Grade A', qty: 10, cost: 35000, unit: 'sets', date: '2025-03-15' },
  { id: 'SAP-0009', textile: 'Tree of Life Applique Panel', stitcher: 'Rajkot Applique Collective', status: 'Cotton Flat Fold Bundle', qty: 4, cost: 68000, unit: 'panels', date: '2025-03-22' },
  { id: 'SAP-0010', textile: 'Camel Motif Applique Quilt', stitcher: 'Bhuj Katab Stitchers Guild', status: 'Palletised Truck Transit', qty: 3, cost: 85000, unit: 'quilts', date: '2025-04-02' },
  { id: 'SAP-0011', textile: 'Peacock Patchwork Curtain', stitcher: 'Junagadh Patchwork Centre', status: 'Moisture-Free Storage 20-28C', qty: 8, cost: 42000, unit: 'yards', date: '2025-04-10' },
  { id: 'SAP-0012', textile: 'Saurashtra Geometric Wall Hanging', stitcher: 'Porbandar Textile Art Society', status: 'Stitch Tension QC', qty: 2, cost: 32000, unit: 'panels', date: '2025-04-18' },
  { id: 'SAP-0013', textile: 'Mandala Applique Bedspread', stitcher: 'Jamnagar Traditional Quilters', status: 'GI Saurashtra Applique Mark', qty: 1, cost: 125000, unit: 'sets', date: '2025-04-25' },
  { id: 'SAP-0014', textile: 'Floral Applique Table Runner', stitcher: 'Surendranagar Applique Studio', status: 'IS 16800 Patchwork Textile Grade A', qty: 7, cost: 22000, unit: 'sets', date: '2025-05-03' },
  { id: 'SAP-0015', textile: 'Elephant Procession Wall Panel', stitcher: 'Wankaner Heritage Stitchers', status: 'Cotton Flat Fold Bundle', qty: 3, cost: 145000, unit: 'panels', date: '2025-05-11' },
  { id: 'SAP-0016', textile: 'Star Patchwork Cushion Set', stitcher: 'Veraval Coastal Applique Guild', status: 'Palletised Truck Transit', qty: 12, cost: 48000, unit: 'sets', date: '2025-05-19' },
  { id: 'SAP-0017', textile: 'Tree of Life Applique Panel', stitcher: 'Bhuj Katab Stitchers Guild', status: 'Moisture-Free Storage 20-28C', qty: 5, cost: 98000, unit: 'panels', date: '2025-05-27' },
  { id: 'SAP-0018', textile: 'Camel Motif Applique Quilt', stitcher: 'Rajkot Applique Collective', status: 'Stitch Tension QC', qty: 2, cost: 160000, unit: 'quilts', date: '2025-06-04' },
  { id: 'SAP-0019', textile: 'Saurashtra Geometric Wall Hanging', stitcher: 'Junagadh Patchwork Centre', status: 'GI Saurashtra Applique Mark', qty: 4, cost: 56000, unit: 'panels', date: '2025-06-15' },
  { id: 'SAP-0020', textile: 'Star Patchwork Cushion Set', stitcher: 'Veraval Coastal Applique Guild', status: 'Stitch Tension QC', qty: 8, cost: 180000, unit: 'sets', date: '2025-06-28' },
]

export default function SaurashtraAppliqueGujaratLogisticsView() {

  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = [...appliqueRecords, ...genRecords(21), ...genRecords(41)]


  const filteredRecords = useMemo(() => {
    if (!searchQuery) return allRecords.filter(r => Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string)))
    const q = searchQuery.toLowerCase()
    return allRecords.filter(r => (Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string))) && Object.values(r).some(v => String(v).toLowerCase().includes(q)))
  }, [searchQuery, activeFilters, allRecords])

  const filterGroups = [
    { key: 'textile', label: 'Textile', options: PRODUCTS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.textile === p).length })) },
    { key: 'stitcher', label: 'Stitcher', options: STITCHERS.map(s => ({ value: s, label: s, count: allRecords.filter(r => r.stitcher === s).length })) },
  ]


  const trendData = PRODUCTS.slice(0, 6).map((p, i) => ({ name: p.split(' ').slice(0, 2).join(' '), shipments: 20 + i * 6, value: 12000 + i * 8000 }))
  const stitcherChart = STITCHERS.slice(0, 8).map((s, i) => ({ name: s.split(' ')[0], pieces: allRecords.filter(r => r.stitcher === s).reduce((a, r) => a + r.qty, 0) }))
  const statusPie = STATUSES.map((s, i) => ({ name: s.split(' ').slice(0, 2).join(' '), value: 8 + i * 3 }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))


  return (
    <div className="sap-module space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Saurashtra Applique Gujarat' }]} />
      <PageHeader title="Saurashtra Applique Gujarat Logistics" description="Fabric patchwork art logistics from Gujarat's Saurashtra region — tracking Katab applique shipments across Bhuj, Rajkot, and Junagadh" />
      <Tabs defaultValue="dashboard">

        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>


        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <KpiTile label="Total Applique Art" value={allRecords.length} />
            <KpiTile label="Stitcher Clusters" value={STITCHERS.length} />
            <KpiTile label="Total Value" value={`₹${(allRecords.reduce((a, r) => a + r.cost, 0) / 100000).toFixed(1)}L`} />
            <KpiTile label="Avg Piece" value={`₹${Math.round(allRecords.reduce((a, r) => a + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>

          <div className="grid grid-cols-6 gap-4">
            <HealthRing label="GI Tag" value={95} />
            <HealthRing label="IS 16800" value={91} />
            <HealthRing label="Cotton" value={88} />
            <HealthRing label="Truck" value={82} />
            <HealthRing label="Storage" value={90} />
            <HealthRing label="Stitch" value={93} />
          </div>

          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Patchwork Villages" value="20 Communities" />
            <ValueTile label="Annual Output" value="6500 Pieces" />
            <ValueTile label="Export Markets" value="16 Countries" />
            <ValueTile label="Heritage Age" value="500 Years" />
          </div>
        </TabsContent>

        <TabsContent value="shipments" className="space-y-4">
          <SearchFilterToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onClearSearch={() => setSearchQuery('')}
            activeFilters={activeFilters}
            filterGroups={filterGroups}
            onToggleFilter={(key, val) => setActiveFilters(prev => ({ ...prev, [key]: prev[key]?.includes(val) ? prev[key].filter(v => v !== val) : [...(prev[key] || []), val] }))}
            onClearAllFilters={() => setActiveFilters({})}
            totalItems={allRecords.length}
            filteredCount={filteredRecords.length}
            onRefresh={() => {}}
            placeholder="Search applique records..."
          />

          <Card>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-cyan-50">
                    <th className="p-3 text-left">ID</th>
                    <th className="p-3 text-left">Textile</th>
                    <th className="p-3 text-left">Stitcher</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-right">Qty</th>
                    <th className="p-3 text-right">Cost</th>
                    <th className="p-3 text-left">Cost Bar</th>
                    <th className="p-3 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map(r => (
                    <tr key={r.id} className="border-t hover:bg-cyan-50/50">
                      <td className="p-3 font-mono text-xs">{r.id}</td>
                      <td className="p-3"><ProductBadge p={r.textile} /></td>
                      <td className="p-3 text-xs">{r.stitcher}</td>
                      <td className="p-3"><StatusBadge s={r.status} /></td>
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
              <CardHeader><CardTitle>Monthly Shipment Trend</CardTitle></CardHeader>
              <CardContent>
                <LineChart width={500} height={250} data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={11} />
                  <YAxis fontSize={11} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="shipments" stroke={COLORS[0]} strokeWidth={2} />
                  <Line type="monotone" dataKey="value" stroke={COLORS[1]} strokeWidth={2} />
                </LineChart>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Stitcher Output</CardTitle></CardHeader>
              <CardContent>
                <BarChart width={500} height={250} data={stitcherChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={10} />
                  <YAxis fontSize={11} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="pieces" fill={COLORS[0]} />
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
            <Card><CardHeader><CardTitle>Saurashtra Katab Applique — 500 Years of Gujarat Patchwork Textile Heritage</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground leading-relaxed">The Saurashtra Katab applique tradition represents one of India's most distinguished textile arts, spanning over 500 years of continuous practice across the arid landscapes of Gujarat's Saurashtra peninsula. In this ancient craft, skilled artisans — predominantly from the Rabari and Ahir pastoral communities — hand-cut vibrant coloured fabric pieces and meticulously stitch them onto a cotton base fabric to create elaborate geometric patterns, floral motifs, and figurative designs. The iconic Tree of Life motif, peacock patterns, and camel silhouettes are signature elements that distinguish Saurashtra applique from other Indian textile traditions. Each piece requires weeks of dedicated needlework, with artisans using running stitch, blanket stitch, and buttonhole stitch techniques passed down through generations. The Katab method differs from quilting in that fabric shapes are cut and applied to the surface rather than layered, creating a distinctive textured relief effect that catches light and shadow. Bhuj, Rajkot, and Junagadh remain the primary centres where this heritage craft thrives, with master artisans training younger generations in both traditional and contemporary design adaptations for global markets.</p></CardContent></Card>
            <Card><CardHeader><CardTitle>IS 16800 Patchwork Textile Quality Standards for Applique Cotton Art</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground leading-relaxed">Indian Standard IS 16800 establishes comprehensive quality benchmarks for patchwork and applique textile products, providing critical quality assurance for the Saurashtra applique industry. The standard mandates substrate cotton fabric with a thread count ranging from 120 to 160 threads per square inch, ensuring sufficient density to support the weight and tension of applied fabric pieces. Stitch tension requirements specify 6 to 8 stitches per centimetre for the attachment stitch, with variation not exceeding plus or minus 0.5 stitches per centimetre across any single panel. Colour fastness is rigorously tested according to ISO 105-B02, requiring a minimum Grade 4 rating on the 1-8 scale to ensure that the vibrant multicoloured applique pieces resist fading through washing and light exposure. Additionally, fabric adhesion strength must withstand a minimum 5 kilogram tensile pull test per IS 16800 specifications, verifying that each applied patch remains securely bonded to the base textile under stress conditions. These standards are particularly critical for export-bound Saurashtra applique products, where international buyers require documented compliance with measurable quality parameters before accepting shipments.</p></CardContent></Card>
            <Card><CardHeader><CardTitle>Cotton Flat Fold Packaging &amp; Moisture-Controlled Transit for Patchwork Textile</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground leading-relaxed">The specialised packaging protocol for Saurashtra applique textiles follows a meticulous multi-layer approach designed to protect delicate hand-stitched patchwork during transit across India and to international destinations. Each applique piece is first wrapped in acid-free tissue paper, providing a pH-neutral barrier that prevents chemical interaction between the textile fibres and packaging materials. The wrapped textile is then folded flat using the cotton flat fold technique on 5-ply corrugated board, which distributes weight evenly and prevents crease lines from forming in the applied fabric patches. A sealed polyethylene liner encloses each folded piece, creating a moisture barrier essential for Gujarat's humid coastal climate zones. Silica gel desiccant packets — typically 150 grams per standard panel — are placed within the packaging to absorb residual atmospheric moisture, maintaining the relative humidity below 40 percent throughout the shipment duration. This comprehensive packaging system supports the Saurashtra logistics network which handles over 6,500 shipments annually, connecting artisan production centres in Bhuj and Rajkot with domestic retail channels and export warehouses. Temperature-controlled storage facilities maintain conditions between 20 and 28 degrees Celsius, preventing both mould growth in humid conditions and fabric brittleness in arid environments.</p></CardContent></Card>
            <Card><CardHeader><CardTitle>AI Stitch Pattern Authentication &amp; Saurashtra Applique Global Export Growth</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground leading-relaxed">Artificial intelligence technology is revolutionising the authentication and quality verification of Saurashtra Katab applique products through advanced computer vision systems. A convolutional neural network model trained on a curated dataset of 18,000 authenticated hand-stitched applique samples has achieved 95 percent accuracy in distinguishing genuine hand-crafted pieces from machine-applique imitations that increasingly flood the market. The AI system analyses microscopic stitch patterns, thread tension variations, fabric overlap geometries, and the subtle irregularities that characterise authentic human needlework — parameters that are virtually impossible to replicate consistently through automated production. This authentication framework has become essential as Saurashtra applique export revenue has demonstrated remarkable growth, increasing from Rs 15 crore in 2019 to an estimated Rs 42 crore by 2025, driven by rising international demand for authenticated heritage crafts. The export trajectory spans 16 countries across Europe, North America, East Asia, and the Middle East, with premium pricing for GI-tagged certified pieces commanding 40 to 60 percent higher margins compared to uncertified alternatives. The combination of AI-powered authentication and GI geographical indication protection is establishing a new paradigm for preserving and commercialising India's intangible textile heritage while ensuring fair compensation for the artisan communities who sustain these living traditions.</p></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
