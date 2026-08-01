import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#7c2d12', '#9a3412', '#c2410c', '#ea580c', '#ffedd5', '#6b2710', '#431407', '#fff7ed']
const PRODUCTS = ['Mysore Rosewood Jewelry Box', 'Ivory Floral Inlay Panel', 'Sandalwood Rosewood Chess Set', 'Mysore Palace Scene Relief', 'Temple Procession Inlay Panel', 'Elephant Procession Decorative Box', 'Tipu Sultan Sword Stand', 'Chandra Mahal Wall Art Panel']
const INLAYERS = ['Mysore Palace Craft Workshop', 'Chamarajendra Artisan Guild', 'KR Circle Inlay Centre', 'Jayalakshmipuram Rosewood Studio', 'Mandi Mohalla Wood Inlay Society', 'Gandhi Bazaar Craft Colony', 'Narasimharaja Inlay Artisans', 'Vidyaranyapuram Wood Art Centre']
const STATUSES = ['GI Mysore Rosewood Inlay Mark', 'IS 16805 Wood Inlay Grade A', 'Velvet-Lined Wooden Case', 'Palletised Truck Transit', 'Dry Storage 20-28C', 'Inlay Adhesion QC']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

function ProductBadge({ product }: { product: string }) {
  return <span className="inline-flex items-center rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-800 border border-orange-200">{product}</span>
}
function StatusBadge({ status }: { status: string }) {
  return <span className="inline-flex items-center rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-800 border border-orange-200">{status}</span>
}

function CostBar({ cost, maxCost }: { cost: number; maxCost: number }) {
  const pct = ri(0, 100, (cost / maxCost) * 100)
  return <div className="w-full bg-orange-100 rounded-full h-2"><div className="bg-orange-700 h-2 rounded-full" style={{ width: `${pct}%` }} /></div>
}

function HealthRing({ label, value, color }: { label: string; value: number; color: string }) {
  const r = 40, c = 2 * Math.PI * r, off = c - (value / 100) * c
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="#f3f4f6" strokeWidth="8" />
        <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="8" strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round" transform="rotate(-90 50 50)" />
        <text x="50" y="50" textAnchor="middle" dominantBaseline="central" className="text-sm font-bold fill-gray-800">{value}%</text>
      </svg>
      <span className="text-xs text-gray-600 text-center leading-tight">{label}</span>
    </div>
  )
}
function KpiTile({ title, value, color }: { title: string; value: string; color: string }) {
  return (
    <Card className="border-l-4" style={{ borderLeftColor: color }}>
      <CardContent className="p-4">
        <p className="text-xs text-gray-500 mb-1">{title}</p>
        <p className="text-lg font-bold" style={{ color }}>{value}</p>
      </CardContent>
    </Card>
  )
}
function ValueTile({ title, value }: { title: string; value: string }) {
  return (

    <Card>
      <CardContent className="p-4">
        <p className="text-xs text-gray-500 mb-1">{title}</p>
        <p className="text-lg font-bold text-gray-800">{value}</p>
      </CardContent>
    </Card>
  )
}

function genRecords() {
  const u = ['pcs', 'sets', 'panels', 'pairs']
  return Array.from({ length: 20 }, (_, i) => ({
    id: `MRI-${String(i + 1).padStart(4, '0')}`,
    product: PRODUCTS[i % 8], inlayer: INLAYERS[i % 8], status: STATUSES[i % 6],
    qty: Math.floor(Math.random() * 20) + 1, unit: u[i % 4],
    cost: Math.floor(Math.random() * 435000) + 15000,
    date: `2025-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, '0')}`,
  }))
}

const inlayRecords = [
  { id: 'MRI-0001', product: 'Mysore Rosewood Jewelry Box', inlayer: 'Mysore Palace Craft Workshop', status: 'GI Mysore Rosewood Inlay Mark', qty: 5, unit: 'pcs', cost: 75000, date: '2025-01-15' },
  { id: 'MRI-0002', product: 'Ivory Floral Inlay Panel', inlayer: 'Chamarajendra Artisan Guild', status: 'IS 16805 Wood Inlay Grade A', qty: 3, unit: 'panels', cost: 185000, date: '2025-01-22' },
  { id: 'MRI-0003', product: 'Sandalwood Rosewood Chess Set', inlayer: 'KR Circle Inlay Centre', status: 'Velvet-Lined Wooden Case', qty: 2, unit: 'sets', cost: 125000, date: '2025-02-03' },
  { id: 'MRI-0004', product: 'Mysore Palace Scene Relief', inlayer: 'Jayalakshmipuram Rosewood Studio', status: 'Palletised Truck Transit', qty: 1, unit: 'pcs', cost: 340000, date: '2025-02-10' },
  { id: 'MRI-0005', product: 'Temple Procession Inlay Panel', inlayer: 'Mandi Mohalla Wood Inlay Society', status: 'Dry Storage 20-28C', qty: 4, unit: 'panels', cost: 275000, date: '2025-02-18' },
  { id: 'MRI-0006', product: 'Elephant Procession Decorative Box', inlayer: 'Gandhi Bazaar Craft Colony', status: 'Inlay Adhesion QC', qty: 8, unit: 'pcs', cost: 45000, date: '2025-03-01' },
  { id: 'MRI-0007', product: 'Tipu Sultan Sword Stand', inlayer: 'Narasimharaja Inlay Artisans', status: 'GI Mysore Rosewood Inlay Mark', qty: 3, unit: 'pcs', cost: 95000, date: '2025-03-12' },
  { id: 'MRI-0008', product: 'Chandra Mahal Wall Art Panel', inlayer: 'Vidyaranyapuram Wood Art Centre', status: 'IS 16805 Wood Inlay Grade A', qty: 2, unit: 'panels', cost: 420000, date: '2025-03-20' },
  { id: 'MRI-0009', product: 'Mysore Rosewood Jewelry Box', inlayer: 'KR Circle Inlay Centre', status: 'Velvet-Lined Wooden Case', qty: 12, unit: 'pcs', cost: 180000, date: '2025-04-02' },
  { id: 'MRI-0010', product: 'Ivory Floral Inlay Panel', inlayer: 'Mysore Palace Craft Workshop', status: 'Palletised Truck Transit', qty: 6, unit: 'panels', cost: 310000, date: '2025-04-11' },
  { id: 'MRI-0011', product: 'Sandalwood Rosewood Chess Set', inlayer: 'Mandi Mohalla Wood Inlay Society', status: 'Dry Storage 20-28C', qty: 4, unit: 'sets', cost: 250000, date: '2025-04-19' },
  { id: 'MRI-0012', product: 'Mysore Palace Scene Relief', inlayer: 'Chamarajendra Artisan Guild', status: 'Inlay Adhesion QC', qty: 1, unit: 'pcs', cost: 385000, date: '2025-05-03' },
  { id: 'MRI-0013', product: 'Temple Procession Inlay Panel', inlayer: 'Jayalakshmipuram Rosewood Studio', status: 'GI Mysore Rosewood Inlay Mark', qty: 5, unit: 'panels', cost: 295000, date: '2025-05-14' },
  { id: 'MRI-0014', product: 'Elephant Procession Decorative Box', inlayer: 'Narasimharaja Inlay Artisans', status: 'IS 16805 Wood Inlay Grade A', qty: 10, unit: 'pcs', cost: 15000, date: '2025-05-22' },
  { id: 'MRI-0015', product: 'Tipu Sultan Sword Stand', inlayer: 'Gandhi Bazaar Craft Colony', status: 'Velvet-Lined Wooden Case', qty: 3, unit: 'pcs', cost: 110000, date: '2025-06-01' },
  { id: 'MRI-0016', product: 'Chandra Mahal Wall Art Panel', inlayer: 'Mysore Palace Craft Workshop', status: 'Palletised Truck Transit', qty: 1, unit: 'pcs', cost: 450000, date: '2025-06-10' },
  { id: 'MRI-0017', product: 'Mysore Rosewood Jewelry Box', inlayer: 'Vidyaranyapuram Wood Art Centre', status: 'Dry Storage 20-28C', qty: 15, unit: 'pcs', cost: 225000, date: '2025-06-18' },
  { id: 'MRI-0018', product: 'Ivory Floral Inlay Panel', inlayer: 'KR Circle Inlay Centre', status: 'Inlay Adhesion QC', qty: 2, unit: 'panels', cost: 165000, date: '2025-07-02' },
  { id: 'MRI-0019', product: 'Sandalwood Rosewood Chess Set', inlayer: 'Chamarajendra Artisan Guild', status: 'GI Mysore Rosewood Inlay Mark', qty: 6, unit: 'sets', cost: 375000, date: '2025-07-15' },
  { id: 'MRI-0020', product: 'Mysore Palace Scene Relief', inlayer: 'Mandi Mohalla Wood Inlay Society', status: 'IS 16805 Wood Inlay Grade A', qty: 1, unit: 'pcs', cost: 400000, date: '2025-07-28' },
]

export default function MysoreRosewoodInlayLogisticsView() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = inlayRecords
  const filteredRecords = useMemo(() => {
    return allRecords.filter(r => Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string)))
      .filter(r => !searchQuery || r.product.toLowerCase().includes(searchQuery.toLowerCase()) || r.inlayer.toLowerCase().includes(searchQuery.toLowerCase()) || r.id.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [searchQuery, activeFilters])
  const maxCost = Math.max(...allRecords.map(r => r.cost))
  const filterGroups = [
    { key: 'inlayer', label: 'Inlayer', options: INLAYERS.map(i => ({ value: i, label: i, count: allRecords.filter(r => r.inlayer === i).length })) },
    { key: 'status', label: 'Status', options: STATUSES.map(s => ({ value: s, label: s, count: allRecords.filter(r => r.status === s).length })) },
    { key: 'product', label: 'Artefact', options: PRODUCTS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.product === p).length })) },
  ]
  const onToggleFilter = (key: string, value: string) => setActiveFilters(prev => {
    const cur = prev[key] || []
    return { ...prev, [key]: cur.includes(value) ? cur.filter(v => v !== value) : [...cur, value] }
  })
  const onClearAllFilters = () => setActiveFilters({})

  const monthlyChart = useMemo(() => {
    const m: Record<string, number> = {}
    allRecords.forEach(r => { const mk = r.date.slice(0, 7); m[mk] = (m[mk] || 0) + r.cost })
    return Object.entries(m).map(([month, cost]) => ({ month, cost }))
  }, [])
  const productChart = useMemo(() => PRODUCTS.map(p => ({
    name: p.length > 20 ? p.slice(0, 20) + '...' : p,
    count: allRecords.filter(r => r.product === p).length,
    cost: allRecords.filter(r => r.product === p).reduce((s, r) => s + r.cost, 0)
  })), [])
  const statusPie = useMemo(() => STATUSES.map(s => ({
    name: s.length > 18 ? s.slice(0, 18) + '...' : s,
    value: allRecords.filter(r => r.status === s).length
  })), [])

  return (
    <div className="space-y-6 p-6">

      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Mysore Rosewood Inlay' }]} />
      <PageHeader title="Mysore Rosewood Inlay Logistics" description="Track Mysore rosewood inlay art shipments across the Karnataka logistics network" />
      <Tabs defaultValue="dashboard">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard">
          <div className="grid grid-cols-4 gap-4 mb-6">
            <KpiTile title="Total Shipments" value={String(allRecords.length)} color={COLORS[0]} />
            <KpiTile title="Total Value" value={`\u20b9${allRecords.reduce((s, r) => s + r.cost, 0).toLocaleString()}`} color={COLORS[1]} />
            <KpiTile title="Active Inlayers" value={String(new Set(allRecords.map(r => r.inlayer)).size)} color={COLORS[2]} />
            <KpiTile title="Avg Cost/Unit" value={`\u20b9${Math.round(allRecords.reduce((s, r) => s + r.cost, 0) / allRecords.reduce((s, r) => s + r.qty, 0)).toLocaleString()}`} color={COLORS[3]} />
          </div>
          <div className="grid grid-cols-6 gap-4 mb-6">
            <HealthRing label="GI Mark" value={96} color={COLORS[0]} />
            <HealthRing label="IS 16805" value={92} color={COLORS[1]} />
            <HealthRing label="Velvet" value={89} color={COLORS[2]} />
            <HealthRing label="Truck" value={85} color={COLORS[3]} />
            <HealthRing label="Storage" value={90} color={COLORS[4]} />
            <HealthRing label="Inlay QC" value={94} color={COLORS[5]} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ValueTile title="Inlay Workshops" value="14" />
            <ValueTile title="Annual Volume" value="3,800 Pieces" />
            <ValueTile title="Export Markets" value="22 Countries" />
            <ValueTile title="Heritage Legacy" value="400 Years" />
          </div>
        </TabsContent>
        <TabsContent value="shipments">
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={onToggleFilter} onClearAllFilters={onClearAllFilters} totalItems={allRecords.length} filteredCount={filteredRecords.length} onRefresh={() => {}} placeholder="Search by artefact, inlayer, or ID..." />
          <Card>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead className="bg-orange-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">ID</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">Artefact</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">Inlayer</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">Qty</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">Cost</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">Cost Bar</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map(r => (
                    <tr key={r.id} className="border-t border-orange-50 hover:bg-orange-50/50">
                      <td className="px-4 py-2 font-mono text-xs">{r.id}</td>
                      <td className="px-4 py-2"><ProductBadge product={r.product} /></td>
                      <td className="px-4 py-2 text-xs">{r.inlayer}</td>
                      <td className="px-4 py-2"><StatusBadge status={r.status} /></td>
                      <td className="px-4 py-2 text-xs">{r.qty} {r.unit}</td>
                      <td className="px-4 py-2 text-xs font-medium">\u20b9{r.cost.toLocaleString()}</td>
                      <td className="px-4 py-2 w-32"><CostBar cost={r.cost} maxCost={maxCost} /></td>
                      <td className="px-4 py-2 text-xs text-gray-500">{r.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="analytics">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle>Monthly Shipment Value</CardTitle></CardHeader>

              <CardContent><LineChart width={500} height={250} data={monthlyChart}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Legend /><Line type="monotone" dataKey="cost" stroke={COLORS[0]} strokeWidth={2} /></LineChart></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Product Cost Distribution</CardTitle></CardHeader>
              <CardContent><BarChart width={500} height={250} data={productChart}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" angle={-45} textAnchor="end" height={80} /><YAxis /><Tooltip /><Legend /><Bar dataKey="cost" fill={COLORS[1]} radius={[4, 4, 0, 0]} /></BarChart></CardContent>
            </Card>
          </div>
          <Card className="mt-6">
            <CardHeader><CardTitle>Status Distribution</CardTitle></CardHeader>
            <CardContent><PieChart width={500} height={300}><Pie data={statusPie} cx="50%" cy="50%" outerRadius={100} dataKey="value" label>{statusPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /><Legend /></PieChart></CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="insights">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle>Mysore Rosewood Inlay — 400 Years of Karnataka Wood Art Heritage</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 leading-relaxed">Mysore Rosewood Inlay is a 400-year tradition originating during the Wodeyar dynasty in Mysore, Karnataka. This exquisite craft involves intricate inlay work using ivory, ebony, and silver, hand-cut and fitted into precisely carved channels on rosewood (Dalbergia latifolia) surfaces. Master artisans depict elaborate Mysore Palace scenes, Tipu Sultan historical motifs, grand temple processions, and detailed floral designs. Each masterpiece requires 2 to 8 weeks of dedicated labour, incorporating 200 to 500 individual inlay pieces meticulously shaped and set by hand. The craft represents one of India's finest woodwork traditions, recognized with a Geographical Indication tag protecting its Mysuru origin and authentic hand-crafted techniques passed through generations of artisan families across Karnataka.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>IS 16805 Wood Inlay Quality Standards for Mysore Rosewood Art</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 leading-relaxed">The IS 16805 standard governs wood inlay quality for Mysore rosewood art, mandating rosewood base density between 750 and 850 kg/m³ for structural integrity. Inlay materials must achieve minimum hardness of 2.5 on the Mohs scale — ivory at 2.5, ebony at 3.0, and silver at 2.5. Channel depth tolerance is maintained within 0.1mm per IS 16805 specifications. Each inlay piece undergoes adhesion testing at 10kg point load per piece to ensure permanent bonding. Surface finish requires traditional shellac lacquer application achieving roughness average (Ra) below 1.6 micrometers, providing both protective coating and enhancing the natural lustre of rosewood grain patterns beneath the inlay artwork for lasting preservation.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Velvet-Lined Wooden Case Packaging & Temperature-Controlled Transit for Inlay Art</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 leading-relaxed">Each Mysore rosewood inlay piece receives individual velvet pouch wrapping preventing any inlay piece dislodgment during handling and transit. Artworks are then placed in velvet-lined wooden presentation cases featuring brass hinges and corner protectors for structural rigidity. A bubble-wrap outer layer provides additional shock absorption against vibration. Temperature control between 20-28°C is absolutely critical for rosewood dimensional stability — below 18°C causes wood contraction that cracks inlay channels, while above 30°C risks adhesive softening. The Mysore logistics network handles over 3,800 rosewood inlay shipments annually through the Mysore-Bengaluru industrial corridor, employing specialized temperature-monitored vehicles.</p>

              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>AI Inlay Pattern Verification & Mysore Rosewood International Collector Market</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 leading-relaxed">Advanced CNN models trained on 11,000 authenticated Mysore rosewood inlay pieces now achieve 96% accuracy in distinguishing genuine hand-cut inlay from laser-cut machine reproductions. The AI analyzes chisel channel irregularity patterns, inlay piece hand-cut variation within 0.05mm tolerance, and shellac lacquer spectral signature unique to traditional finishing methods. Mysore rosewood inlay export revenue has grown from \u20b915 crore in 2019 to \u20b942 crore in 2025, with projections targeting \u20b980 crore by 2028. The art now reaches collectors across 22 countries, with major markets in the United States, United Kingdom, Japan, Germany, and the UAE driving international demand for authenticated Karnataka heritage woodwork pieces.</p>
              </CardContent>

            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

