import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#1e3a5f', '#1e40af', '#2563eb', '#3b82f6', '#93c5fd', '#172554', '#0c1e3a', '#eff6ff']
const PRODUCTS = ['Dhokra Elephant Figurine', 'Tribal Dancer Bronze Sculpture', 'Bell Metal Horse Pair', 'Dhokra Lakshmi Idol', 'Traditional Lamp Stand', 'Nataraja Dhokra Figure', 'Cow Buffalo Bronze Set', 'Ritual Water Vessel']
const ARTISANS = ['Bankura Dhokra Cluster', 'Bikna Village Artisans', 'Dariapur Metal Workers', 'Midnapore Bell Metal Guild', 'Purulia Lost Wax Studio', 'Burdwan Bronze Crafters', 'Birbhum Tribal Foundry', 'West Bengal Metal Art Society']
const STATUSES = ['GI Dhokra Craft Mark', 'IS 16795 Bell Metal Grade A', 'Straw-Padded Metal Box', 'Flatbed Truck Transit', 'Dry Storage 22-30C', 'Alloy Composition QC']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="dbc-badge inline-block px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="dbc-status inline-block px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="dbc-costbar w-full bg-blue-100 rounded h-2"><div className="bg-blue-700 h-2 rounded" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ value, label, size = 64 }: { value: number; label: string; size?: number }) => {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (ri(0, 100, value) / 100) * circ
  return (
    <div className="dbc-health-ring flex flex-col items-center">
      <svg width={size} height={size}><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={4} /><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1e3a5f" strokeWidth={4} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`} /></svg>
      <span className="text-xs font-semibold" style={{ color: COLORS[0] }}>{value}%</span>
      <span className="text-[10px] text-gray-500">{label}</span>
    </div>
  )
}

const KpiTile = ({ label, value, icon }: { label: string; value: string; icon: string }) => (
  <Card className="dbc-kpi"><CardContent className="p-4"><div className="flex items-center gap-3"><span className="text-2xl">{icon}</span><div><p className="text-xs text-gray-500">{label}</p><p className="text-xl font-bold" style={{ color: COLORS[0] }}>{value}</p></div></div></CardContent></Card>
)

const ValueTile = ({ label, value }: { label: string; value: string }) => (
  <Card className="dbc-value"><CardContent className="p-4"><p className="text-xs text-gray-500">{label}</p><p className="text-lg font-semibold" style={{ color: COLORS[1] }}>{value}</p></CardContent></Card>
)

const genRecords = (startIdx: number) => Array.from({ length: 20 }, (_, i) => {
  const idx = startIdx + i
  const units = ['pcs', 'pairs', 'sets', 'units']
  return {
    id: `DBC-${String(idx).padStart(4, '0')}`, product: PRODUCTS[idx % 8], artisan: ARTISANS[idx % 8],
    status: STATUSES[idx % 6], qty: ri(3, 50, 5 + idx * 2), unit: units[idx % 4],
    cost: ri(8000, 250000, 12000 + idx * 12000), date: `2025-07-${String(ri(1, 28, idx % 28 + 1)).padStart(2, '0')}`,
  }
})

const dhokraRecords = [
  { id: 'DBC-0001', product: 'Dhokra Elephant Figurine', artisan: 'Bankura Dhokra Cluster', status: 'GI Dhokra Craft Mark', qty: 5, unit: 'pcs', cost: 45000, date: '2025-07-02' },
  { id: 'DBC-0002', product: 'Tribal Dancer Bronze Sculpture', artisan: 'Bikna Village Artisans', status: 'IS 16795 Bell Metal Grade A', qty: 12, unit: 'pairs', cost: 95000, date: '2025-07-04' },
  { id: 'DBC-0003', product: 'Bell Metal Horse Pair', artisan: 'Dariapur Metal Workers', status: 'Straw-Padded Metal Box', qty: 8, unit: 'sets', cost: 62000, date: '2025-07-05' },
  { id: 'DBC-0004', product: 'Dhokra Lakshmi Idol', artisan: 'Midnapore Bell Metal Guild', status: 'Flatbed Truck Transit', qty: 20, unit: 'pcs', cost: 135000, date: '2025-07-07' },
  { id: 'DBC-0005', product: 'Traditional Lamp Stand', artisan: 'Purulia Lost Wax Studio', status: 'Dry Storage 22-30C', qty: 3, unit: 'units', cost: 210000, date: '2025-07-08' },
  { id: 'DBC-0006', product: 'Nataraja Dhokra Figure', artisan: 'Burdwan Bronze Crafters', status: 'Alloy Composition QC', qty: 15, unit: 'pcs', cost: 78000, date: '2025-07-10' },
  { id: 'DBC-0007', product: 'Cow Buffalo Bronze Set', artisan: 'Birbhum Tribal Foundry', status: 'GI Dhokra Craft Mark', qty: 10, unit: 'sets', cost: 88000, date: '2025-07-11' },
  { id: 'DBC-0008', product: 'Ritual Water Vessel', artisan: 'West Bengal Metal Art Society', status: 'IS 16795 Bell Metal Grade A', qty: 4, unit: 'units', cost: 185000, date: '2025-07-13' },
  { id: 'DBC-0009', product: 'Dhokra Elephant Figurine', artisan: 'Bankura Dhokra Cluster', status: 'Straw-Padded Metal Box', qty: 25, unit: 'pcs', cost: 35000, date: '2025-07-14' },
  { id: 'DBC-0010', product: 'Tribal Dancer Bronze Sculpture', artisan: 'Bikna Village Artisans', status: 'Flatbed Truck Transit', qty: 18, unit: 'pairs', cost: 115000, date: '2025-07-15' },
  { id: 'DBC-0011', product: 'Bell Metal Horse Pair', artisan: 'Dariapur Metal Workers', status: 'Dry Storage 22-30C', qty: 7, unit: 'sets', cost: 58000, date: '2025-07-16' },
  { id: 'DBC-0012', product: 'Dhokra Lakshmi Idol', artisan: 'Midnapore Bell Metal Guild', status: 'Alloy Composition QC', qty: 30, unit: 'pcs', cost: 142000, date: '2025-07-17' },
  { id: 'DBC-0013', product: 'Traditional Lamp Stand', artisan: 'Purulia Lost Wax Studio', status: 'GI Dhokra Craft Mark', qty: 6, unit: 'units', cost: 198000, date: '2025-07-18' },
  { id: 'DBC-0014', product: 'Nataraja Dhokra Figure', artisan: 'Burdwan Bronze Crafters', status: 'IS 16795 Bell Metal Grade A', qty: 22, unit: 'pcs', cost: 92000, date: '2025-07-19' },
  { id: 'DBC-0015', product: 'Cow Buffalo Bronze Set', artisan: 'Birbhum Tribal Foundry', status: 'Straw-Padded Metal Box', qty: 9, unit: 'sets', cost: 72000, date: '2025-07-20' },
  { id: 'DBC-0016', product: 'Ritual Water Vessel', artisan: 'West Bengal Metal Art Society', status: 'Flatbed Truck Transit', qty: 4, unit: 'units', cost: 245000, date: '2025-07-21' },
  { id: 'DBC-0017', product: 'Dhokra Elephant Figurine', artisan: 'Bankura Dhokra Cluster', status: 'Dry Storage 22-30C', qty: 16, unit: 'pcs', cost: 48000, date: '2025-07-22' },
  { id: 'DBC-0018', product: 'Tribal Dancer Bronze Sculpture', artisan: 'Bikna Village Artisans', status: 'Alloy Composition QC', qty: 28, unit: 'pairs', cost: 128000, date: '2025-07-23' },
  { id: 'DBC-0019', product: 'Bell Metal Horse Pair', artisan: 'Dariapur Metal Workers', status: 'GI Dhokra Craft Mark', qty: 11, unit: 'sets', cost: 68000, date: '2025-07-24' },
  { id: 'DBC-0020', product: 'Dhokra Lakshmi Idol', artisan: 'Midnapore Bell Metal Guild', status: 'IS 16795 Bell Metal Grade A', qty: 35, unit: 'pcs', cost: 165000, date: '2025-07-25' },
]

export default function DhokraBellMetalCraftLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = [...dhokraRecords, ...genRecords(21), ...genRecords(41)]

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
    <div className="dbc-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Dhokra Bell Metal Craft' }]} />
      <PageHeader title="Dhokra Bell Metal Craft Logistics" description="Track India's 4,000-year Dhokra lost-wax casting tradition from Bankura, Bikna, and Purulia through bronze alloy preparation, IS 16795 bell metal certification, straw-padded metal packaging, and flatbed truck transit for tribal heritage art export to global museum and cultural exhibition markets" />
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-blue-50">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <KpiTile icon="🦕" label="Total Castings" value={String(allRecords.length)} />
            <KpiTile icon="🔨" label="Artisan Clusters" value={String(ARTISANS.length)} />
            <KpiTile icon="💰" label="Total Value" value={`₹${(allRecords.reduce((a, r) => a + r.cost, 0) / 10000000).toFixed(2)}Cr`} />
            <KpiTile icon="📈" label="Avg Casting" value={`₹${Math.round(allRecords.reduce((a, r) => a + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>

          <Card className="dbc-health-grid">
            <CardHeader><CardTitle>Quality Compliance</CardTitle></CardHeader>
            <CardContent>
              <div className="flex justify-around">
                <HealthRing value={96} label="GI Tag" />
                <HealthRing value={92} label="IS 16795" />
                <HealthRing value={88} label="Packing" />
                <HealthRing value={81} label="Truck" />
                <HealthRing value={90} label="Storage" />
                <HealthRing value={94} label="Alloy" />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Dhokra Artisan Villages" value="120+" />
            <ValueTile label="Annual Castings" value="18,000 pcs" />
            <ValueTile label="Export Markets" value="28 Countries" />
            <ValueTile label="Heritage Age" value="4,000 Years" />
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

          <Card className="dbc-table-card">
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-blue-50">
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
                    <tr key={r.id} className="border-b hover:bg-blue-50/50">
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
            <Card className="dbc-insight"><CardHeader><CardTitle>Dhokra Lost-Wax Casting Tradition — 4,000 Years of Tribal Metal Art</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Dhokra bell metal craft is one of the oldest known metal casting traditions in the world, dating back to the Indus Valley Civilization (c. 2000 BCE) where the iconic "Dancing Girl" bronze figurine was discovered at Mohenjo-daro. Practised predominantly by the Dhokra Damar tribal communities across West Bengal, Odisha, Chhattisgarh, and Jharkhand, this ancient technique uses the cire-perdue (lost-wax) method where a clay core is coated with beeswax, sculpted with intricate tribal motifs, covered in successive layers of fine clay and rice husk, then fired in a charcoal furnace. The molten bell metal alloy (copper 78-82%, tin 2-5%, zinc 5-10%, lead trace) replaces the molten wax, creating unique single-piece castings with distinctive flowing tribal filigree patterns impossible to replicate by machine. Major centres include Bankura and Bikna villages in West Bengal with over 3,000 artisan families, producing figurines of elephants, horses, tribal dancers, and Hindu deities. UNESCO inscribed Dhokra on its Intangible Cultural Heritage watch list, and India's GI tag for Dhokra crafts covers West Bengal, Odisha, and Chhattisgarh origins.</p></CardContent></Card>
            <Card className="dbc-insight"><CardHeader><CardTitle>IS 16795 Bell Metal Alloy Quality &amp; Composition Standards</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">IS 16795 governs bell metal and dhokra craft alloy quality standards specifying acceptable composition ranges for traditional lost-wax casting products. The standard mandates copper content between 78-82% for structural integrity and acoustic resonance, tin content 2-5% for fluidity and cast detail preservation, zinc 5-10% for hardness and corrosion resistance, with lead strictly below 500 ppm and arsenic below 50 ppm for safety compliance. Alloy melting temperature must reach 1,080-1,100 degrees Celsius in charcoal-fueled crucible furnaces with controlled oxidizing atmosphere to prevent zinc volatilization. Tensile strength minimum 180 MPa, Brinell hardness 55-70 HB, and density 8.4-8.7 g/cm3 are verified through metallurgical testing per IS 1608 and IS 1500 respectively. Surface finish quality grades range from A (mirror-polished display pieces) to C (raw as-cast tribal art), with Grade A requiring maximum 0.2mm surface irregularity measured by profilometer. Chemical composition is validated using optical emission spectrometry with per-batch sampling of one piece per 50 castings, ensuring traceability from raw metal procurement through finished product certification for domestic retail and international museum markets.</p></CardContent></Card>
            <Card className="dbc-insight"><CardHeader><CardTitle>Straw-Padded Metal Box Packaging &amp; Flatbed Truck Transit Logistics</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Dhokra bell metal artefacts require specialised straw-padded packaging in custom-built wooden or corrugated metal boxes to protect delicate filigree extensions and thin-walled castings from vibration fracture during transit. Each piece is wrapped in acid-free tissue paper, nestled in a 5-8cm thick rice straw cushioning bed inside a rigid container, with foam corner blocks preventing lateral movement. The straw acts as natural shock absorber maintaining temperature insulation between 22-30 degrees Celsius, critical for preventing thermal stress cracking in thin copper-tin alloy sections. Transit from Bankura to Kolkata port (220 km via NH14) uses flatbed trucks with spring-suspension platforms, covering 6-8 hours with mandatory speed limits below 40 km/h on rural roads. During monsoon months (June-September), additional waterproof tarpaulin layers and desiccant packets (50g per cubic foot) prevent moisture contact that causes patina discolouration on raw castings. West Bengal Handicrafts Development Corporation reports packaging-related damage reduced from 12% to 2.5% under their 2021 standardised protocol, covering over 8,500 annual dhokra shipments worth Rs 45 crore across domestic and 28 international export destinations.</p></CardContent></Card>
            <Card className="dbc-insight"><CardHeader><CardTitle>AI Alloy Analysis &amp; Dhokra Heritage Preservation Technology</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Artificial intelligence is revolutionising Dhokra bell metal craft preservation through non-destructive alloy composition analysis using portable X-ray fluorescence (XRF) spectroscopy combined with machine learning classification models. These AI systems can authenticate genuine Dhokra artefacts versus machine-made reproductions with 93% accuracy by analysing trace element signatures unique to traditional charcoal-furnace casting — specifically detecting manganese, nickel, and antimony trace patterns characteristic of locally sourced laterite ore smelting in Bankura and Purulia regions. Computer vision algorithms trained on 15,000+ Dhokra piece images automatically grade surface finish quality, detect casting defects like porosity and cold shuts invisible to human inspection, and catalogue tribal motif patterns across regional stylistic variations (Bankura vs. Bikna vs. Odisha schools). India's Dhokra craft export market grew 180% from Rs 22 crore (2019) to Rs 62 crore (2025), targeting Rs 120 crore by 2028 with blockchain provenance tracking from beeswax sourcing through alloy melting, casting, polishing, packaging, and shipping. Digital twin technology creates 3D repositories of master artisan techniques, preserving casting knowledge for future generations as senior Dhokra artisans age and apprentice pipelines shrink.</p></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
