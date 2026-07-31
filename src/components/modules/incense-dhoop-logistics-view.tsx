import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#701a75', '#86198f', '#a21caf', '#c026d3', '#d946ef', '#4a044e', '#581c87', '#fdf4ff']
const PRODUCTS = ['Agarbatti Premium 8"', 'Champa Dhoop Sticks', 'Cone Incense Sambrani', 'Sandalwood Dhoop', 'Loban Benzoin Crystals', 'Floral Mogra Agarbatti', 'Meditation Sage Bundles', 'Camphor Tablets 50g']
const MANUFACTURERS = ['Cycle Pure Agarbatti Mysore', 'Moksh Agarbatti Kolkata', 'Radhe Shyam Indore', 'N R Agarbatti Bangalore', 'Sacred Elephant Chennai', 'Hem Incense Mumbai', 'Tulasi Agarbatti Jaipur', 'Presto Agarbatti Guwahati']
const STATUSES = ['IS 6041 Certified', 'Export QC Cleared', 'MoEFCC Compliance', 'In Transit Covered', 'Yard Dry Storage', 'Fragrance Stability Test']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="idl-badge inline-block px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="idl-status inline-block px-2 py-0.5 rounded text-xs font-medium bg-fuchsia-100 text-fuchsia-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="idl-costbar w-full bg-fuchsia-100 rounded h-2"><div className="bg-fuchsia-700 h-2 rounded" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ value, label, size = 64 }: { value: number; label: string; size?: number }) => {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (ri(0, 100, value) / 100) * circ
  return (
    <div className="idl-health-ring flex flex-col items-center">
      <svg width={size} height={size}><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={4} /><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#701a75" strokeWidth={4} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`} /></svg>
      <span className="text-xs font-semibold" style={{ color: COLORS[0] }}>{value}%</span>
      <span className="text-[10px] text-gray-500">{label}</span>
    </div>
  )
}

const KpiTile = ({ label, value, icon }: { label: string; value: string; icon: string }) => (
  <Card className="idl-kpi"><CardContent className="p-4"><div className="flex items-center gap-3"><span className="text-2xl">{icon}</span><div><p className="text-xs text-gray-500">{label}</p><p className="text-xl font-bold" style={{ color: COLORS[0] }}>{value}</p></div></div></CardContent></Card>
)

const ValueTile = ({ label, value }: { label: string; value: string }) => (
  <Card className="idl-value"><CardContent className="p-4"><p className="text-xs text-gray-500">{label}</p><p className="text-lg font-semibold" style={{ color: COLORS[1] }}>{value}</p></CardContent></Card>
)

const genRecords = (startIdx: number) => Array.from({ length: 20 }, (_, i) => {
  const idx = startIdx + i
  const units = ['boxes', 'packs', 'kg', 'cartons']
  return {
    id: `IDL-${String(idx).padStart(4, '0')}`, product: PRODUCTS[idx % 8], manufacturer: MANUFACTURERS[idx % 8],
    status: STATUSES[idx % 6], qty: ri(100, 8000, 300 + idx * 160), unit: units[idx % 4],
    cost: ri(15000, 400000, 25000 + idx * 14000), date: `2025-06-${String(ri(1, 28, idx % 28 + 1)).padStart(2, '0')}`,
  }
})

const incenseRecords = [
  { id: 'IDL-0001', product: 'Agarbatti Premium 8"', manufacturer: 'Cycle Pure Agarbatti Mysore', status: 'IS 6041 Certified', qty: 5000, unit: 'boxes', cost: 250000, date: '2025-06-02' },
  { id: 'IDL-0002', product: 'Champa Dhoop Sticks', manufacturer: 'Moksh Agarbatti Kolkata', status: 'Export QC Cleared', qty: 3200, unit: 'packs', cost: 128000, date: '2025-06-04' },
  { id: 'IDL-0003', product: 'Cone Incense Sambrani', manufacturer: 'Radhe Shyam Indore', status: 'MoEFCC Compliance', qty: 1800, unit: 'cartons', cost: 90000, date: '2025-06-05' },
  { id: 'IDL-0004', product: 'Sandalwood Dhoop', manufacturer: 'N R Agarbatti Bangalore', status: 'In Transit Covered', qty: 2500, unit: 'packs', cost: 175000, date: '2025-06-07' },
  { id: 'IDL-0005', product: 'Loban Benzoin Crystals', manufacturer: 'Sacred Elephant Chennai', status: 'Yard Dry Storage', qty: 800, unit: 'kg', cost: 96000, date: '2025-06-08' },
  { id: 'IDL-0006', product: 'Floral Mogra Agarbatti', manufacturer: 'Hem Incense Mumbai', status: 'Fragrance Stability Test', qty: 4000, unit: 'boxes', cost: 160000, date: '2025-06-10' },
  { id: 'IDL-0007', product: 'Meditation Sage Bundles', manufacturer: 'Tulasi Agarbatti Jaipur', status: 'IS 6041 Certified', qty: 1200, unit: 'packs', cost: 84000, date: '2025-06-11' },
  { id: 'IDL-0008', product: 'Camphor Tablets 50g', manufacturer: 'Presto Agarbatti Guwahati', status: 'Export QC Cleared', qty: 6000, unit: 'boxes', cost: 180000, date: '2025-06-13' },
  { id: 'IDL-0009', product: 'Agarbatti Premium 8"', manufacturer: 'Cycle Pure Agarbatti Mysore', status: 'MoEFCC Compliance', qty: 4800, unit: 'boxes', cost: 240000, date: '2025-06-14' },
  { id: 'IDL-0010', product: 'Champa Dhoop Sticks', manufacturer: 'Moksh Agarbatti Kolkata', status: 'In Transit Covered', qty: 3000, unit: 'packs', cost: 120000, date: '2025-06-15' },
  { id: 'IDL-0011', product: 'Cone Incense Sambrani', manufacturer: 'Radhe Shyam Indore', status: 'Yard Dry Storage', qty: 1600, unit: 'cartons', cost: 80000, date: '2025-06-16' },
  { id: 'IDL-0012', product: 'Sandalwood Dhoop', manufacturer: 'N R Agarbatti Bangalore', status: 'IS 6041 Certified', qty: 2200, unit: 'packs', cost: 154000, date: '2025-06-17' },
  { id: 'IDL-0013', product: 'Loban Benzoin Crystals', manufacturer: 'Sacred Elephant Chennai', status: 'Fragrance Stability Test', qty: 750, unit: 'kg', cost: 90000, date: '2025-06-18' },
  { id: 'IDL-0014', product: 'Floral Mogra Agarbatti', manufacturer: 'Hem Incense Mumbai', status: 'Export QC Cleared', qty: 3800, unit: 'boxes', cost: 152000, date: '2025-06-19' },
  { id: 'IDL-0015', product: 'Meditation Sage Bundles', manufacturer: 'Tulasi Agarbatti Jaipur', status: 'In Transit Covered', qty: 1100, unit: 'packs', cost: 77000, date: '2025-06-20' },
  { id: 'IDL-0016', product: 'Camphor Tablets 50g', manufacturer: 'Presto Agarbatti Guwahati', status: 'MoEFCC Compliance', qty: 5500, unit: 'boxes', cost: 165000, date: '2025-06-21' },
  { id: 'IDL-0017', product: 'Agarbatti Premium 8"', manufacturer: 'Cycle Pure Agarbatti Mysore', status: 'Yard Dry Storage', qty: 4500, unit: 'boxes', cost: 225000, date: '2025-06-22' },
  { id: 'IDL-0018', product: 'Champa Dhoop Sticks', manufacturer: 'Moksh Agarbatti Kolkata', status: 'Fragrance Stability Test', qty: 2800, unit: 'packs', cost: 112000, date: '2025-06-23' },
  { id: 'IDL-0019', product: 'Cone Incense Sambrani', manufacturer: 'Radhe Shyam Indore', status: 'IS 6041 Certified', qty: 1400, unit: 'cartons', cost: 70000, date: '2025-06-24' },
  { id: 'IDL-0020', product: 'Sandalwood Dhoop', manufacturer: 'N R Agarbatti Bangalore', status: 'Export QC Cleared', qty: 2000, unit: 'packs', cost: 140000, date: '2025-06-25' },
]



export default function IncenseDhoopLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = [...incenseRecords, ...genRecords(21), ...genRecords(41)]

  const filteredRecords = useMemo(() => {
    return allRecords.filter(r => {
      if (searchQuery && !r.id.toLowerCase().includes(searchQuery.toLowerCase()) && !r.product.toLowerCase().includes(searchQuery.toLowerCase())) return false
      return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string))
    })
  }, [searchQuery, activeFilters, allRecords])

  const filterGroups = [
    { key: 'product', label: 'Product', options: PRODUCTS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.product === p).length })) },
    { key: 'status', label: 'Status', options: STATUSES.map(s => ({ value: s, label: s, count: allRecords.filter(r => r.status === s).length })) },
  ]

  const trendData = PRODUCTS.slice(0, 6).map((p, i) => ({ name: p.split(' ').slice(0, 2).join(' '), shipments: 12 + i * 7, cost: 80000 + i * 25000 }))
  const mfgChart = MANUFACTURERS.slice(0, 6).map((m, i) => ({ name: m.split(' ').slice(0, 2).join(' '), volume: 150 + i * 120, revenue: 8 + i * 5 }))
  const statusPie = STATUSES.map((s, i) => ({ name: s.split(' ').slice(0, 2).join(' '), value: 8 + i * 4 }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="idl-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Incense & Dhoop' }]} />
      <PageHeader title="Incense & Dhoop Logistics" description="Track incense sticks, dhoop, sambrani and camphor shipments from Indian agarbatti clusters to domestic and export markets" />
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-fuchsia-50">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <KpiTile icon="🪔" label="Total Shipments" value={String(allRecords.length)} />
            <KpiTile icon="🏭" label="Manufacturing Units" value={String(MANUFACTURERS.length)} />
            <KpiTile icon="💰" label="Total Value" value={`₹${(allRecords.reduce((a, r) => a + r.cost, 0) / 100000).toFixed(1)}L`} />
            <KpiTile icon="📈" label="Avg Cost" value={`₹${Math.round(allRecords.reduce((a, r) => a + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>

          <Card className="idl-health-grid">
            <CardHeader><CardTitle>Operational Health</CardTitle></CardHeader>
            <CardContent>
              <div className="flex justify-around">
                <HealthRing value={88} label="IS 6041" />
                <HealthRing value={82} label="Fragrance" />
                <HealthRing value={76} label="Dry Store" />
                <HealthRing value={91} label="Export QC" />
                <HealthRing value={85} label="MoEFCC" />
                <HealthRing value={79} label="Burn Rate" />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Agarbatti Stock" value="14,200 boxes" />
            <ValueTile label="Export Ready" value="22 Lots" />
            <ValueTile label="Fragrance Tested" value="48 Batches" />
            <ValueTile label="Dry Storage Used" value="78%" />
          </div>
        </TabsContent>

        <TabsContent value="shipments" className="space-y-4">
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={(key, value) => setActiveFilters(p => ({ ...p, [key]: p[key]?.includes(value) ? p[key].filter((v: string) => v !== value) : [...(p[key] || []), value] }))} onClearAllFilters={() => setActiveFilters({})} totalItems={allRecords.length} filteredCount={filteredRecords.length} onRefresh={() => {}} placeholder="Search by ID, product, manufacturer, or lot..." />

          <Card className="idl-table-card">
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-fuchsia-50">
                    <th className="p-3 text-left">ID</th>
                    <th className="p-3 text-left">Product</th>
                    <th className="p-3 text-left">Manufacturer</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-right">Qty</th>
                    <th className="p-3 text-right">Cost</th>
                    <th className="p-3 text-left">Cost Bar</th>
                    <th className="p-3 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.slice(0, 15).map(r => (
                    <tr key={r.id} className="border-b hover:bg-fuchsia-50/50">
                      <td className="p-3 font-mono text-xs">{r.id}</td>
                      <td className="p-3"><ProductBadge name={r.product} /></td>
                      <td className="p-3 text-xs">{r.manufacturer}</td>
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
              <CardHeader><CardTitle>Manufacturer Volume</CardTitle></CardHeader>
              <CardContent>
                <BarChart width={500} height={250} data={mfgChart}>
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
            <Card className="idl-insight"><CardHeader><CardTitle>India World Agarbatti Capital</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">India produces 1,500 crore agarbatti sticks annually worth ₹7,500 crore, making it the world's largest incense manufacturer. Karnataka (Mysore, Bangalore) leads production with 35% market share, followed by Gujarat (15%) and MP (10%). The agarbatti industry provides direct employment to 10 lakh workers, predominantly women from rural households, supporting the UN SDG for gender equality and decent work.</p></CardContent></Card>
            <Card className="idl-insight"><CardHeader><CardTitle>IS 6041 Quality Standards</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">BIS IS 6041 specifies agarbatti quality covering burning time (minimum 30 minutes for 8-inch sticks), ash content below 8%, bamboo stick straightness tolerance, and permissible charcoal dust levels. Raw bamboo sticks are imported from China and Vietnam at ₹1.50 per thousand sticks. The automatic agarbatti making machine produces 400 sticks per minute versus 80 sticks per minute by hand-rolling.</p></CardContent></Card>
            <Card className="idl-insight"><CardHeader><CardTitle>MoEFCC Charcoal-Free Green Initiative</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">The Ministry of Environment mandates reduced charcoal usage in incense production under the National Clean Air Programme. Manufacturers are transitioning to sawdust-based and herbal powder formulations. Green dhoop made from cow dung, neem, and herbs captures 12% of the market with 45% year-on-year growth. Perfume-grade essential oil sourcing from Kannauj rose and Mysore sandalwood drives premiumization.</p></CardContent></Card>
            <Card className="idl-insight"><CardHeader><CardTitle>Export Markets & AI Fragrance Matching</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Indian incense exports reach 85 countries generating ₹2,200 crore annually, with USA (25%), UAE (15%), UK (10%), and Nigeria (8%) as top destinations. AI-powered fragrance profiling systems match agarbatti blends to regional preferences with 87% accuracy. Blockchain traceability from raw material sourcing through Mysore workshops to Dubai retail shelves ensures GI protection and premium pricing.</p></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
