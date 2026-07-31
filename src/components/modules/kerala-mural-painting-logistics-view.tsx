import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#166534', '#15803d', '#16a34a', '#22c55e', '#86efac', '#14532d', '#052e16', '#f0fdf4']
const PRODUCTS = ['Guruvayur Temple Mural Panel', 'Padmanabhaswamy Palace Fresco', 'Krishnattam Dance Mural', 'Mattancherry Palace Wall Art', 'Sree Padmanabha Mural Scroll', 'Vaishnava Temple Mural Set', 'Shiva Parvati Mural Panel', 'Ramayana Epic Kerala Mural']
const ARTISANS = ['Guruvayur Mural School', 'Trivandrum Palace Artists', 'Thrissur Temple Art Guild', 'Kochi Heritage Painters', 'Palakkad Mural Studio', 'Kozhikode Traditional Art', 'Kannur Temple Artists', 'Ernakulam Mural Centre']
const STATUSES = ['GI Kerala Mural Mark', 'IS 16792 Fresco Grade A', 'Acid-Free Canvas Roll', 'Enclosed Truck Transit', 'Humidity-Free Vault 20-25C', 'Mineral Pigment QC']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="kmp-badge inline-block px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="kmp-status inline-block px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="kmp-costbar w-full bg-green-100 rounded h-2"><div className="bg-green-700 h-2 rounded" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ value, label, size = 64 }: { value: number; label: string; size?: number }) => {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (ri(0, 100, value) / 100) * circ
  return (
    <div className="kmp-health-ring flex flex-col items-center">
      <svg width={size} height={size}><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={4} /><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#166534" strokeWidth={4} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`} /></svg>
      <span className="text-xs font-semibold" style={{ color: COLORS[0] }}>{value}%</span>
      <span className="text-[10px] text-gray-500">{label}</span>
    </div>
  )
}

const KpiTile = ({ label, value, icon }: { label: string; value: string; icon: string }) => (
  <Card className="kmp-kpi"><CardContent className="p-4"><div className="flex items-center gap-3"><span className="text-2xl">{icon}</span><div><p className="text-xs text-gray-500">{label}</p><p className="text-xl font-bold" style={{ color: COLORS[0] }}>{value}</p></div></div></CardContent></Card>
)

const ValueTile = ({ label, value }: { label: string; value: string }) => (
  <Card className="kmp-value"><CardContent className="p-4"><p className="text-xs text-gray-500">{label}</p><p className="text-lg font-semibold" style={{ color: COLORS[1] }}>{value}</p></CardContent></Card>
)

const genRecords = (startIdx: number) => Array.from({ length: 20 }, (_, i) => {
  const idx = startIdx + i
  const units = ['pcs', 'panels', 'sets', 'scrolls']
  return {
    id: `KMP-${String(idx).padStart(4, '0')}`, product: PRODUCTS[idx % 8], artisan: ARTISANS[idx % 8],
    status: STATUSES[idx % 6], qty: ri(3, 50, 5 + idx * 2), unit: units[idx % 4],
    cost: ri(8000, 250000, 12000 + idx * 12000), date: `2025-07-${String(ri(1, 28, idx % 28 + 1)).padStart(2, '0')}`,
  }
})

const keralaRecords = [
  { id: 'KMP-0001', product: 'Guruvayur Temple Mural Panel', artisan: 'Guruvayur Mural School', status: 'GI Kerala Mural Mark', qty: 5, unit: 'pcs', cost: 45000, date: '2025-07-02' },
  { id: 'KMP-0002', product: 'Padmanabhaswamy Palace Fresco', artisan: 'Trivandrum Palace Artists', status: 'IS 16792 Fresco Grade A', qty: 12, unit: 'panels', cost: 95000, date: '2025-07-04' },
  { id: 'KMP-0003', product: 'Krishnattam Dance Mural', artisan: 'Thrissur Temple Art Guild', status: 'Acid-Free Canvas Roll', qty: 8, unit: 'sets', cost: 62000, date: '2025-07-05' },
  { id: 'KMP-0004', product: 'Mattancherry Palace Wall Art', artisan: 'Kochi Heritage Painters', status: 'Enclosed Truck Transit', qty: 20, unit: 'pcs', cost: 135000, date: '2025-07-07' },
  { id: 'KMP-0005', product: 'Sree Padmanabha Mural Scroll', artisan: 'Palakkad Mural Studio', status: 'Humidity-Free Vault 20-25C', qty: 3, unit: 'scrolls', cost: 210000, date: '2025-07-08' },
  { id: 'KMP-0006', product: 'Vaishnava Temple Mural Set', artisan: 'Kozhikode Traditional Art', status: 'Mineral Pigment QC', qty: 15, unit: 'pcs', cost: 78000, date: '2025-07-10' },
  { id: 'KMP-0007', product: 'Shiva Parvati Mural Panel', artisan: 'Kannur Temple Artists', status: 'GI Kerala Mural Mark', qty: 10, unit: 'panels', cost: 88000, date: '2025-07-11' },
  { id: 'KMP-0008', product: 'Ramayana Epic Kerala Mural', artisan: 'Ernakulam Mural Centre', status: 'IS 16792 Fresco Grade A', qty: 4, unit: 'sets', cost: 185000, date: '2025-07-13' },
  { id: 'KMP-0009', product: 'Guruvayur Temple Mural Panel', artisan: 'Guruvayur Mural School', status: 'Acid-Free Canvas Roll', qty: 25, unit: 'pcs', cost: 35000, date: '2025-07-14' },
  { id: 'KMP-0010', product: 'Padmanabhaswamy Palace Fresco', artisan: 'Trivandrum Palace Artists', status: 'Enclosed Truck Transit', qty: 18, unit: 'panels', cost: 115000, date: '2025-07-15' },
  { id: 'KMP-0011', product: 'Krishnattam Dance Mural', artisan: 'Thrissur Temple Art Guild', status: 'Humidity-Free Vault 20-25C', qty: 7, unit: 'sets', cost: 58000, date: '2025-07-16' },
  { id: 'KMP-0012', product: 'Mattancherry Palace Wall Art', artisan: 'Kochi Heritage Painters', status: 'Mineral Pigment QC', qty: 30, unit: 'pcs', cost: 142000, date: '2025-07-17' },
  { id: 'KMP-0013', product: 'Sree Padmanabha Mural Scroll', artisan: 'Palakkad Mural Studio', status: 'GI Kerala Mural Mark', qty: 6, unit: 'scrolls', cost: 198000, date: '2025-07-18' },
  { id: 'KMP-0014', product: 'Vaishnava Temple Mural Set', artisan: 'Kozhikode Traditional Art', status: 'IS 16792 Fresco Grade A', qty: 22, unit: 'pcs', cost: 92000, date: '2025-07-19' },
  { id: 'KMP-0015', product: 'Shiva Parvati Mural Panel', artisan: 'Kannur Temple Artists', status: 'Acid-Free Canvas Roll', qty: 9, unit: 'panels', cost: 72000, date: '2025-07-20' },
  { id: 'KMP-0016', product: 'Ramayana Epic Kerala Mural', artisan: 'Ernakulam Mural Centre', status: 'Enclosed Truck Transit', qty: 4, unit: 'sets', cost: 245000, date: '2025-07-21' },
  { id: 'KMP-0017', product: 'Guruvayur Temple Mural Panel', artisan: 'Guruvayur Mural School', status: 'Humidity-Free Vault 20-25C', qty: 16, unit: 'pcs', cost: 48000, date: '2025-07-22' },
  { id: 'KMP-0018', product: 'Padmanabhaswamy Palace Fresco', artisan: 'Trivandrum Palace Artists', status: 'Mineral Pigment QC', qty: 28, unit: 'panels', cost: 128000, date: '2025-07-23' },
  { id: 'KMP-0019', product: 'Krishnattam Dance Mural', artisan: 'Thrissur Temple Art Guild', status: 'GI Kerala Mural Mark', qty: 11, unit: 'sets', cost: 68000, date: '2025-07-24' },
  { id: 'KMP-0020', product: 'Mattancherry Palace Wall Art', artisan: 'Kochi Heritage Painters', status: 'IS 16792 Fresco Grade A', qty: 35, unit: 'pcs', cost: 165000, date: '2025-07-25' },
]

export default function KeralaMuralPaintingLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = [...keralaRecords, ...genRecords(21), ...genRecords(41)]

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

  const trendData = PRODUCTS.slice(0, 6).map((p, i) => ({ name: p.split(' ').slice(0, 2).join(' '), shipments: 4 + i * 3, cost: 80000 + i * 65000 }))
  const artisanChart = ARTISANS.slice(0, 6).map((a, i) => ({ name: a.split(' ').slice(0, 2).join(' '), volume: 15 + i * 8, revenue: 10 + i * 5 }))
  const statusPie = STATUSES.map((s, i) => ({ name: s.split(' ').slice(0, 2).join(' '), value: 5 + i * 4 }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="kmp-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Kerala Mural Painting' }]} />
      <PageHeader title="Kerala Mural Painting Logistics" description="Track Kerala's 300-year temple mural painting tradition from Guruvayur, Padmanabhaswamy, and Mattancherry palaces through natural mineral pigment preparation, GI-tagged fresco certification, acid-free canvas packaging, and humidity-controlled transit for heritage art export to global museum and cultural exhibition markets" />
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-green-50">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <KpiTile icon="🎨" label="Total Murals" value={String(allRecords.length)} />
            <KpiTile icon="🏛️" label="Artisan Schools" value={String(ARTISANS.length)} />
            <KpiTile icon="💰" label="Total Value" value={`₹${(allRecords.reduce((a, r) => a + r.cost, 0) / 10000000).toFixed(2)}Cr`} />
            <KpiTile icon="📈" label="Avg Mural" value={`₹${Math.round(allRecords.reduce((a, r) => a + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>

          <Card className="kmp-health-grid">
            <CardHeader><CardTitle>Quality Compliance</CardTitle></CardHeader>
            <CardContent>
              <div className="flex justify-around">
                <HealthRing value={96} label="GI Tag" />
                <HealthRing value={92} label="IS 16792" />
                <HealthRing value={88} label="Canvas" />
                <HealthRing value={81} label="Truck" />
                <HealthRing value={90} label="Vault" />
                <HealthRing value={94} label="Pigment" />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Temple Mural Sites" value="150+" />
            <ValueTile label="Annual Murals" value="2,500 sq ft" />
            <ValueTile label="Export Markets" value="22 Countries" />
            <ValueTile label="Heritage Age" value="300 Years" />
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

          <Card className="kmp-table-card">
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-green-50">
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
                    <tr key={r.id} className="border-b hover:bg-green-50/50">
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
            <Card className="kmp-insight"><CardHeader><CardTitle>Kerala Temple Mural Tradition — 300 Years of Sacred Art</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Kerala mural painting tradition dates to the 15th-17th century with the earliest surviving examples in the Mattancherry Palace (Dutch Palace, built 1555) and Padmanabhaswamy Temple in Thiruvananthapuram. These murals depict episodes from Ramayana, Mahabharata, and Puranas using natural mineral pigments — red and yellow from laterite soil, green from malachite, blue from lapis lazuli, and black from lamp soot carbon — applied on specially prepared lime-plastered walls using traditional panchavarna (five-colour) technique. The tradition flourished under the patronage of Travancore and Kochi royal families who commissioned palace and temple murals as acts of devotion. Major mural sites include Guruvayur Sree Krishna Temple (1,200 sq ft of murals), Mattancherry Palace Ramayana panels (750 sq ft), Ettumanoor Shiva Temple, and Thrissur Vadakkunnathan Temple. Only 60-70 traditional mural artists remain, with the Guruvayur Mural School under the Guruvayur Devaswom Board being the primary training institution preserving this heritage. UNESCO listed Kerala murals among South Asian Intangible Heritage in 2024.</p></CardContent></Card>
            <Card className="kmp-insight"><CardHeader><CardTitle>IS 16792 Fresco &amp; Mineral Pigment Quality Standards</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">IS 16792 covers traditional fresco and mural painting quality including lime plaster substrate preparation (minimum 3 coats of aged lime, each 2mm thick, pH 10.5-11.5 for alkaline stability), mineral pigment purity standards (iron oxide red Fe2O3 minimum 60%, malachite green CuCO3 minimum 45%, carbon black amorphous carbon minimum 85%), and binding medium specifications (tender coconut water fermented 72 hours as natural adhesive). Colour fastness must exceed Grade 4 on ISO 105-B02 for light resistance and Grade 3 minimum on ISO 105-C06 for wash fastness. Surface preparation requires 15-day curing period for lime plaster before painting begins, with moisture content below 8% measured by calcium carbide method. Heavy metal limits: lead below 50 ppm, arsenic below 10 ppm, cadmium below 25 ppm per IS 16474. Finished murals must resist salt efflorescence under accelerated aging test (40 degrees Celsius, 90% humidity, 96 hours) per IS 16792 Annexure C protocol. Touch-up paint must match original within Delta E less than 2.0 on CIE colour space.</p></CardContent></Card>
            <Card className="kmp-insight"><CardHeader><CardTitle>Acid-Free Canvas &amp; Fresco Packaging Transit Logistics</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Kerala mural reproductions on acid-free canvas (pH 7.5-8.5, 300 GSM cotton duck) require careful packaging to prevent pigment cracking and moisture damage. Each canvas panel is rolled on acid-free cardboard tube (diameter 8cm for large murals, 5cm for medium panels) with silicone-release interleaf paper between layers to prevent pigment transfer during 48-72 hour transit from Guruvayur to Kochi port (95 km via NH66) or Thiruvananthapuram airport. Temperature must maintain 20-25 degrees Celsius with humidity below 45% to prevent lime plaster rehydration and fungal growth on natural pigments. Enclosed truck transit with insulated cargo bay maintains climate control within plus or minus 2 degrees Celsius. Kerala's monsoon season (June-September) creates 85-95% humidity challenges requiring desiccant silica gel pouches (100g per square metre of canvas) inside sealed polyethylene liners. Damage rate reduced from 15% to 3% under Kerala Handicrafts Development Corporation packaging guidelines since 2020, covering 1,800 mural shipments across Thrissur, Ernakulam, and Palakkad districts.</p></CardContent></Card>
            <Card className="kmp-insight"><CardHeader><CardTitle>AI Temple Art Digitisation &amp; Heritage Preservation</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">AI-powered multi-spectral imaging of Kerala temple murals creates archival-quality digital reproductions capturing pigment layer depth invisible to naked eye, completing documentation of a 50 square metre mural in 6 hours versus 30 days for manual copying by traditional artists. Machine learning classifies mural styles across Guruvayur, Travancore, and Kochi schools with 94% accuracy by analysing brushstroke patterns, panchavarna colour ratios, and composition geometry unique to each tradition. Automated pigment composition analysis from portable XRF spectroscopy authenticates murals versus modern reproductions at 91% precision by detecting trace mineral signatures from historically accurate pigment sources. India's Kerala mural art export grew 150% from Rs 15 crore (2019) to Rs 38 crore (2025), targeting Rs 80 crore by 2028 with growing demand from museums (Victoria & Albert London, National Museum New Delhi, MET New York) in 22 countries. Blockchain provenance from temple wall preparation through pigments, canvas transfer, and shipping combats reproduction fraud estimated at Rs 8 crore annually.</p></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
