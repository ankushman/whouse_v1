import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#7c2d12', '#9a3412', '#c2410c', '#ea580c', '#fb923c', '#431407', '#7f1d1d', '#fff7ed']
const PRODUCTS = ['W320 Whole Cashew', 'W240 Grade Cashew', 'W450 Split Cashew', 'W210 Jumbo Cashew', 'Cashew Kernels LP', 'Cashew Shell Liquid CNSL', 'Cashew Butter Roasted', 'Cashew Flour Blanched']
const PROCESSORS = ['Kollam Cashew Board Kerala', 'Goa Cashew Factory Mapusa', 'Karnataka Cashew Mangalore', 'Quilon Processing Kerala', 'Palghar Cashew Mill Maharashtra', 'Kerala Cashew Dev Corp', 'Thanjavur Nut Co Tamil Nadu', 'Cochin Cashew Exporters']
const STATUSES = ['FSSAI Licensed', 'APEDA Certified', 'In Transit Reefer', 'Cold Store', 'Pending CEPA', 'Awaiting Roasting']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="cpl-badge inline-block px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="cpl-status inline-block px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="cpl-costbar w-full bg-orange-100 rounded h-2"><div className="bg-orange-600 h-2 rounded" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ value, label, size = 64 }: { value: number; label: string; size?: number }) => {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (ri(0, 100, value) / 100) * circ
  return (
    <div className="cpl-health-ring flex flex-col items-center">
      <svg width={size} height={size}><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={4} /><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#7c2d12" strokeWidth={4} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`} /></svg>
      <span className="text-xs font-semibold" style={{ color: COLORS[0] }}>{value}%</span>
      <span className="text-[10px] text-gray-500">{label}</span>
    </div>
  )
}

const KpiTile = ({ label, value, icon }: { label: string; value: string; icon: string }) => (
  <Card className="cpl-kpi"><CardContent className="p-4"><div className="flex items-center gap-3"><span className="text-2xl">{icon}</span><div><p className="text-xs text-gray-500">{label}</p><p className="text-xl font-bold" style={{ color: COLORS[0] }}>{value}</p></div></div></CardContent></Card>
)

const ValueTile = ({ label, value }: { label: string; value: string }) => (
  <Card className="cpl-value"><CardContent className="p-4"><p className="text-xs text-gray-500">{label}</p><p className="text-lg font-semibold" style={{ color: COLORS[1] }}>{value}</p></CardContent></Card>
)

const genRecords = (startIdx: number) => Array.from({ length: 20 }, (_, i) => {
  const idx = startIdx + i
  const units = ['kg', 'MT', 'boxes', 'packets']
  return {
    id: `CPL-${String(idx).padStart(4, '0')}`, product: PRODUCTS[idx % 8], processor: PROCESSORS[idx % 8],
    status: STATUSES[idx % 6], qty: ri(20, 5000, 150 + idx * 62), unit: units[idx % 4],
    cost: ri(10000, 800000, 35000 + idx * 12500), date: `2025-01-${String(ri(1, 28, idx % 28 + 1)).padStart(2, '0')}`,
  }
})

const handRecords = [
  { id: 'CPL-0001', product: 'W320 Whole Cashew', processor: 'Kollam Cashew Board Kerala', status: 'In Transit Reefer', qty: 2000, unit: 'kg', cost: 680000, date: '2025-01-03' },
  { id: 'CPL-0002', product: 'W240 Grade Cashew', processor: 'Goa Cashew Factory Mapusa', status: 'APEDA Certified', qty: 1500, unit: 'kg', cost: 540000, date: '2025-01-05' },
  { id: 'CPL-0003', product: 'W450 Split Cashew', processor: 'Karnataka Cashew Mangalore', status: 'Cold Store', qty: 3200, unit: 'boxes', cost: 256000, date: '2025-01-07' },
  { id: 'CPL-0004', product: 'W210 Jumbo Cashew', processor: 'Quilon Processing Kerala', status: 'FSSAI Licensed', qty: 800, unit: 'kg', cost: 480000, date: '2025-01-09' },
  { id: 'CPL-0005', product: 'Cashew Kernels LP', processor: 'Palghar Cashew Mill Maharashtra', status: 'Pending CEPA', qty: 4500, unit: 'packets', cost: 135000, date: '2025-01-10' },
  { id: 'CPL-0006', product: 'Cashew Shell Liquid CNSL', processor: 'Kerala Cashew Dev Corp', status: 'Awaiting Roasting', qty: 6000, unit: 'kg', cost: 180000, date: '2025-01-12' },
  { id: 'CPL-0007', product: 'Cashew Butter Roasted', processor: 'Thanjavur Nut Co Tamil Nadu', status: 'In Transit Reefer', qty: 1200, unit: 'boxes', cost: 360000, date: '2025-01-13' },
  { id: 'CPL-0008', product: 'Cashew Flour Blanched', processor: 'Cochin Cashew Exporters', status: 'Cold Store', qty: 2400, unit: 'packets', cost: 96000, date: '2025-01-15' },
  { id: 'CPL-0009', product: 'W320 Whole Cashew', processor: 'Quilon Processing Kerala', status: 'FSSAI Licensed', qty: 2800, unit: 'kg', cost: 952000, date: '2025-01-16' },
  { id: 'CPL-0010', product: 'W240 Grade Cashew', processor: 'Kollam Cashew Board Kerala', status: 'APEDA Certified', qty: 1800, unit: 'kg', cost: 648000, date: '2025-01-17' },
  { id: 'CPL-0011', product: 'W210 Jumbo Cashew', processor: 'Goa Cashew Factory Mapusa', status: 'In Transit Reefer', qty: 950, unit: 'kg', cost: 570000, date: '2025-01-18' },
  { id: 'CPL-0012', product: 'W450 Split Cashew', processor: 'Karnataka Cashew Mangalore', status: 'Pending CEPA', qty: 3800, unit: 'boxes', cost: 304000, date: '2025-01-19' },
  { id: 'CPL-0013', product: 'Cashew Kernels LP', processor: 'Palghar Cashew Mill Maharashtra', status: 'Cold Store', qty: 5200, unit: 'packets', cost: 156000, date: '2025-01-20' },
  { id: 'CPL-0014', product: 'Cashew Shell Liquid CNSL', processor: 'Kerala Cashew Dev Corp', status: 'Awaiting Roasting', qty: 7000, unit: 'kg', cost: 210000, date: '2025-01-21' },
  { id: 'CPL-0015', product: 'Cashew Butter Roasted', processor: 'Cochin Cashew Exporters', status: 'FSSAI Licensed', qty: 1600, unit: 'boxes', cost: 480000, date: '2025-01-22' },
  { id: 'CPL-0016', product: 'Cashew Flour Blanched', processor: 'Thanjavur Nut Co Tamil Nadu', status: 'In Transit Reefer', qty: 3000, unit: 'packets', cost: 120000, date: '2025-01-23' },
  { id: 'CPL-0017', product: 'W320 Whole Cashew', processor: 'Cochin Cashew Exporters', status: 'APEDA Certified', qty: 2200, unit: 'kg', cost: 748000, date: '2025-01-24' },
  { id: 'CPL-0018', product: 'W240 Grade Cashew', processor: 'Kollam Cashew Board Kerala', status: 'Pending CEPA', qty: 3500, unit: 'kg', cost: 1260000, date: '2025-01-25' },
  { id: 'CPL-0019', product: 'W210 Jumbo Cashew', processor: 'Quilon Processing Kerala', status: 'Cold Store', qty: 650, unit: 'kg', cost: 390000, date: '2025-01-26' },
  { id: 'CPL-0020', product: 'Cashew Kernels LP', processor: 'Goa Cashew Factory Mapusa', status: 'FSSAI Licensed', qty: 4800, unit: 'packets', cost: 144000, date: '2025-01-27' },
]




export default function CashewProcessingLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = [...handRecords, ...genRecords(21), ...genRecords(41)]

  const filteredRecords = useMemo(() => {
    return allRecords.filter(r => {
      if (searchQuery && !r.id.toLowerCase().includes(searchQuery.toLowerCase()) && !r.product.toLowerCase().includes(searchQuery.toLowerCase())) return false
      return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string))
    })
  }, [searchQuery, activeFilters, allRecords])

  const filterGroups = [
    { key: 'product', label: 'Product Type', options: PRODUCTS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.product === p).length })) },
    { key: 'status', label: 'Status', options: STATUSES.map(s => ({ value: s, label: s, count: allRecords.filter(r => r.status === s).length })) },
  ]

  const trendData = PRODUCTS.slice(0, 6).map((p, i) => ({ name: p.split(' ').slice(0, 2).join(' '), shipments: 12 + i * 9, cost: 180000 + i * 42000 }))
  const processorChart = PROCESSORS.slice(0, 6).map((p, i) => ({ name: p.split(' ').slice(0, 2).join(' '), volume: 200 + i * 110, revenue: 8 + i * 4 }))
  const statusPie = STATUSES.map((s, i) => ({ name: s.split(' ').slice(0, 2).join(' '), value: 10 + i * 5 }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="cpl-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Cashew Processing' }]} />
      <PageHeader title="Cashew Processing Logistics" description="Track raw cashew, processed kernels and cashew by-products across India" />
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-orange-50">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <KpiTile icon="🥜" label="Total Shipments" value={String(allRecords.length)} />
            <KpiTile icon="🏭" label="Active Processors" value={String(PROCESSORS.length)} />
            <KpiTile icon="💰" label="Total Value" value={`₹${(allRecords.reduce((a, r) => a + r.cost, 0) / 100000).toFixed(1)}L`} />
            <KpiTile icon="📈" label="Avg Cost" value={`₹${Math.round(allRecords.reduce((a, r) => a + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>

          <Card className="cpl-health-grid">
            <CardHeader><CardTitle>Operational Health</CardTitle></CardHeader>
            <CardContent>
              <div className="flex justify-around">
                <HealthRing value={88} label="Peeling" />
                <HealthRing value={93} label="Grading" />
                <HealthRing value={76} label="Roasting" />
                <HealthRing value={96} label="FSSAI" />
                <HealthRing value={81} label="Export" />
                <HealthRing value={85} label="Yield" />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="W320 Dispatched" value="5,000 kg" />
            <ValueTile label="CNSL Processed" value="13,000 kg" />
            <ValueTile label="Pending CEPA" value="₹2.4L" />
            <ValueTile label="APEDA Certified" value="28 Lots" />
          </div>
        </TabsContent>

        <TabsContent value="shipments" className="space-y-4">
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={(key, value) => setActiveFilters(p => ({ ...p, [key]: p[key]?.includes(value) ? p[key].filter((v: string) => v !== value) : [...(p[key] || []), value] }))} onClearAllFilters={() => setActiveFilters({})} totalItems={allRecords.length} filteredCount={filteredRecords.length} onRefresh={() => {}} placeholder="Search by ID, product, processor, or lot..." />

          <Card className="cpl-table-card">
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-orange-50">
                    <th className="p-3 text-left">ID</th>
                    <th className="p-3 text-left">Product</th>
                    <th className="p-3 text-left">Processor</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-right">Qty</th>
                    <th className="p-3 text-right">Cost</th>
                    <th className="p-3 text-left">Cost Bar</th>
                    <th className="p-3 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.slice(0, 15).map(r => (
                    <tr key={r.id} className="border-b hover:bg-orange-50/50">
                      <td className="p-3 font-mono text-xs">{r.id}</td>
                      <td className="p-3"><ProductBadge name={r.product} /></td>
                      <td className="p-3 text-xs">{r.processor}</td>
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
              <CardHeader><CardTitle>Processing Trend</CardTitle></CardHeader>
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
              <CardHeader><CardTitle>Processor Volume</CardTitle></CardHeader>
              <CardContent>
                <BarChart width={500} height={250} data={processorChart}>
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
            <Card className="cpl-insight"><CardHeader><CardTitle>Cashew Export Promotion Act</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">CEPA (Cashew Export Promotion Act) governs Indian cashew export through APEDA registration. India accounts for 40% of global cashew processing, with Kerala and Goa being historic hubs and Karnataka emerging as a major processing centre.</p></CardContent></Card>
            <Card className="cpl-insight"><CardHeader><CardTitle>FSSAI Cashew Kernel Standards</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">FSSAI mandates moisture content below 5% and aflatoxin limits for cashew kernels under FSSAI regulations. Cashew grades W180 to W500 are classified by kernel count per pound, with W210 and W240 commanding premium export pricing.</p></CardContent></Card>
            <Card className="cpl-insight"><CardHeader><CardTitle>CNSL Industrial Applications</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Cashew Nut Shell Liquid (CNSL) is a valuable by-product used in brake linings, friction materials, and marine coatings. India produces 120,000 MT of CNSL annually, with new bio-resin formulations replacing phenol-formaldehyde in green composites.</p></CardContent></Card>
            <Card className="cpl-insight"><CardHeader><CardTitle>AI Cashew Grading Systems</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">AI vision grading systems achieve 95% accuracy in cashew kernel size classification. Automated shelling machines with laser calibration reduce breakage from 18% to 8%, improving W240 and W320 grade yield for export consignments.</p></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
