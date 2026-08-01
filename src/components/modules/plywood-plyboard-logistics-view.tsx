import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#1c1917', '#292524', '#44403c', '#57534e', '#78716c', '#0c0a09', '#422006', '#fafaf9']
const PRODUCTS = ['MR Plywood 18mm BWR', 'Commercial Ply 12mm', 'Shuttering Ply 18mm', 'Block Board 19mm', 'Flush Door Commercial', 'MDF Board 6mm', 'Veneer Oak Natural', 'Particle Board 18mm']
const MANUFACTURERS = ['Century Plyboards Kolkata', 'Greenply Industries Delhi', 'Kitply Industries Guwahati', 'Sarda Plyboards Ahmedabad', 'Action Tesa Mumbai', 'National Ply Ind Rampur', 'Archid Ply Nadiad', 'Plum Plyboards Jalandhar']
const STATUSES = ['IS 303 Certified', 'BIS IS 710', 'In Transit Flatbed', 'Yard Stored', 'Pending GST 18%', 'Awaiting Bending Test']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="pwl-badge inline-block px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="pwl-status inline-block px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="pwl-costbar w-full bg-amber-100 rounded h-2"><div className="bg-amber-700 h-2 rounded" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ value, label, size = 64 }: { value: number; label: string; size?: number }) => {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (ri(0, 100, value) / 100) * circ
  return (
    <div className="pwl-health-ring flex flex-col items-center">
      <svg width={size} height={size}><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={4} /><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1c1917" strokeWidth={4} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`} /></svg>
      <span className="text-xs font-semibold" style={{ color: COLORS[0] }}>{value}%</span>
      <span className="text-[10px] text-gray-500">{label}</span>
    </div>
  )
}

const KpiTile = ({ label, value, icon }: { label: string; value: string; icon: string }) => (
  <Card className="pwl-kpi"><CardContent className="p-4"><div className="flex items-center gap-3"><span className="text-2xl">{icon}</span><div><p className="text-xs text-gray-500">{label}</p><p className="text-xl font-bold" style={{ color: COLORS[0] }}>{value}</p></div></div></CardContent></Card>
)

const ValueTile = ({ label, value }: { label: string; value: string }) => (
  <Card className="pwl-value"><CardContent className="p-4"><p className="text-xs text-gray-500">{label}</p><p className="text-lg font-semibold" style={{ color: COLORS[1] }}>{value}</p></CardContent></Card>
)

const genRecords = (startIdx: number) => Array.from({ length: 20 }, (_, i) => {
  const idx = startIdx + i
  const units = ['sheets', 'sqft', 'tons', 'pieces']
  return {
    id: `PWL-${String(idx).padStart(4, '0')}`, product: PRODUCTS[idx % 8], manufacturer: MANUFACTURERS[idx % 8],
    status: STATUSES[idx % 6], qty: ri(50, 5000, 200 + idx * 120), unit: units[idx % 4],
    cost: ri(20000, 600000, 35000 + idx * 19000), date: `2025-05-${String(ri(1, 28, idx % 28 + 1)).padStart(2, '0')}`,
  }
})

const plyRecords = [
  { id: 'PWL-0001', product: 'MR Plywood 18mm BWR', manufacturer: 'Century Plyboards Kolkata', status: 'IS 303 Certified', qty: 2000, unit: 'sheets', cost: 400000, date: '2025-05-04' },
  { id: 'PWL-0002', product: 'Commercial Ply 12mm', manufacturer: 'Greenply Industries Delhi', status: 'BIS IS 710', qty: 3000, unit: 'sheets', cost: 360000, date: '2025-05-06' },
  { id: 'PWL-0003', product: 'Shuttering Ply 18mm', manufacturer: 'Kitply Industries Guwahati', status: 'In Transit Flatbed', qty: 500, unit: 'sheets', cost: 350000, date: '2025-05-08' },
  { id: 'PWL-0004', product: 'Block Board 19mm', manufacturer: 'Sarda Plyboards Ahmedabad', status: 'Yard Stored', qty: 1200, unit: 'sheets', cost: 240000, date: '2025-05-10' },
  { id: 'PWL-0005', product: 'Flush Door Commercial', manufacturer: 'Action Tesa Mumbai', status: 'Pending GST 18%', qty: 400, unit: 'pieces', cost: 200000, date: '2025-05-11' },
  { id: 'PWL-0006', product: 'MDF Board 6mm', manufacturer: 'National Ply Ind Rampur', status: 'Awaiting Bending Test', qty: 4000, unit: 'sheets', cost: 160000, date: '2025-05-13' },
  { id: 'PWL-0007', product: 'Veneer Oak Natural', manufacturer: 'Archid Ply Nadiad', status: 'IS 303 Certified', qty: 800, unit: 'sqft', cost: 280000, date: '2025-05-14' },
  { id: 'PWL-0008', product: 'Particle Board 18mm', manufacturer: 'Plum Plyboards Jalandhar', status: 'In Transit Flatbed', qty: 2500, unit: 'sheets', cost: 175000, date: '2025-05-16' },
  { id: 'PWL-0009', product: 'MR Plywood 18mm BWR', manufacturer: 'Century Plyboards Kolkata', status: 'BIS IS 710', qty: 1800, unit: 'sheets', cost: 360000, date: '2025-05-17' },
  { id: 'PWL-0010', product: 'Commercial Ply 12mm', manufacturer: 'Greenply Industries Delhi', status: 'Yard Stored', qty: 2800, unit: 'sheets', cost: 336000, date: '2025-05-18' },
  { id: 'PWL-0011', product: 'Shuttering Ply 18mm', manufacturer: 'Kitply Industries Guwahati', status: 'IS 303 Certified', qty: 450, unit: 'sheets', cost: 315000, date: '2025-05-19' },
  { id: 'PWL-0012', product: 'Block Board 19mm', manufacturer: 'Sarda Plyboards Ahmedabad', status: 'Awaiting Bending Test', qty: 1100, unit: 'sheets', cost: 220000, date: '2025-05-20' },
  { id: 'PWL-0013', product: 'Flush Door Commercial', manufacturer: 'Action Tesa Mumbai', status: 'In Transit Flatbed', qty: 350, unit: 'pieces', cost: 175000, date: '2025-05-21' },
  { id: 'PWL-0014', product: 'MDF Board 6mm', manufacturer: 'National Ply Ind Rampur', status: 'Pending GST 18%', qty: 3800, unit: 'sheets', cost: 152000, date: '2025-05-22' },
  { id: 'PWL-0015', product: 'Veneer Oak Natural', manufacturer: 'Archid Ply Nadiad', status: 'BIS IS 710', qty: 750, unit: 'sqft', cost: 262500, date: '2025-05-23' },
  { id: 'PWL-0016', product: 'Particle Board 18mm', manufacturer: 'Plum Plyboards Jalandhar', status: 'Yard Stored', qty: 2200, unit: 'sheets', cost: 154000, date: '2025-05-24' },
  { id: 'PWL-0017', product: 'MR Plywood 18mm BWR', manufacturer: 'Century Plyboards Kolkata', status: 'IS 303 Certified', qty: 1600, unit: 'sheets', cost: 320000, date: '2025-05-25' },
  { id: 'PWL-0018', product: 'Commercial Ply 12mm', manufacturer: 'Greenply Industries Delhi', status: 'Awaiting Bending Test', qty: 2600, unit: 'sheets', cost: 312000, date: '2025-05-26' },
  { id: 'PWL-0019', product: 'Shuttering Ply 18mm', manufacturer: 'Kitply Industries Guwahati', status: 'In Transit Flatbed', qty: 480, unit: 'sheets', cost: 336000, date: '2025-05-27' },
  { id: 'PWL-0020', product: 'Block Board 19mm', manufacturer: 'Sarda Plyboards Ahmedabad', status: 'BIS IS 710', qty: 1000, unit: 'sheets', cost: 200000, date: '2025-05-28' },
]




export default function PlywoodPlyboardLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = [...plyRecords, ...genRecords(21), ...genRecords(41)]

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

  const trendData = PRODUCTS.slice(0, 6).map((p, i) => ({ name: p.split(' ').slice(0, 2).join(' '), shipments: 15 + i * 8, cost: 150000 + i * 30000 }))
  const mfgChart = MANUFACTURERS.slice(0, 6).map((m, i) => ({ name: m.split(' ').slice(0, 2).join(' '), volume: 200 + i * 150, revenue: 10 + i * 6 }))
  const statusPie = STATUSES.map((s, i) => ({ name: s.split(' ').slice(0, 2).join(' '), value: 10 + i * 5 }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="pwl-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Plywood & Plyboard' }]} />
      <PageHeader title="Plywood & Plyboard Logistics" description="Track plywood and plyboard shipments from Indian manufacturing units to construction sites and dealers" />
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-amber-50">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <KpiTile icon="🪵" label="Total Shipments" value={String(allRecords.length)} />
            <KpiTile icon="🏭" label="Manufacturing Units" value={String(MANUFACTURERS.length)} />
            <KpiTile icon="💰" label="Total Value" value={`₹${(allRecords.reduce((a, r) => a + r.cost, 0) / 100000).toFixed(1)}L`} />
            <KpiTile icon="📈" label="Avg Cost" value={`₹${Math.round(allRecords.reduce((a, r) => a + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>

          <Card className="pwl-health-grid">
            <CardHeader><CardTitle>Operational Health</CardTitle></CardHeader>
            <CardContent>
              <div className="flex justify-around">
                <HealthRing value={83} label="BIS Compl." />
                <HealthRing value={78} label="Moisture" />
                <HealthRing value={86} label="Load" />
                <HealthRing value={71} label="Flatbed" />
                <HealthRing value={89} label="Bending" />
                <HealthRing value={74} label="Glue Bond" />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="MR Plywood Stock" value="5,400 sheets" />
            <ValueTile label="In Flatbed Transit" value="28 Lots" />
            <ValueTile label="Pending GST 18%" value="₹3.2L" />
            <ValueTile label="Bending Passed" value="36 Batches" />
          </div>
        </TabsContent>

        <TabsContent value="shipments" className="space-y-4">
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={(key, value) => setActiveFilters(p => ({ ...p, [key]: p[key]?.includes(value) ? p[key].filter((v: string) => v !== value) : [...(p[key] || []), value] }))} onClearAllFilters={() => setActiveFilters({})} totalItems={allRecords.length} filteredCount={filteredRecords.length} onRefresh={() => {}} placeholder="Search by ID, product, manufacturer, or lot..." />

          <Card className="pwl-table-card">
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-amber-50">
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
                    <tr key={r.id} className="border-b hover:bg-amber-50/50">
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
            <Card className="pwl-insight"><CardHeader><CardTitle>IS 303 Plywood Standards</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">BIS IS 303 specifies general-purpose plywood requirements including moisture resistance (MR), boiling water resistance (BWR), and boiling water proof (BWP) grades. India produces 8 million cubic metres of plywood annually with ₹18,000 crore market size, dominated by MR and BWR grades for interior applications.</p></CardContent></Card>
            <Card className="pwl-insight"><CardHeader><CardTitle>Formaldehyde Emission Norms</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">CPCB mandates E1 formaldehyde emission limits for indoor plywood products at 0.124 mg/m3. Leading manufacturers use phenol-formaldehyde (PF) resin instead of urea-formaldehyde (UF) for BWR grades. EU CARB-II compliance enables ₹2,500 crore plywood exports to US and European markets.</p></CardContent></Card>
            <Card className="pwl-insight"><CardHeader><CardTitle>Timber Sourcing & Sustainability</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">India sources poplar from Punjab and Haryana farms, eucalyptus from Gujarat, and teak from MP forests for plywood core. FSC and PEFC chain-of-custody certification covers 15% of Indian plywood output. Imported tropical hardwood from Myanmar and Indonesia faces 40% customs duty boosting domestic plantation timber demand.</p></CardContent></Card>
            <Card className="pwl-insight"><CardHeader><CardTitle>AI Defect Detection in Plywood</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Computer vision systems detect surface defects, core gaps, and delamination in plywood at 98.5% accuracy. AI-powered moisture sensors during kiln drying reduce warpage defects by 35%. Real-time bending strength prediction from veneer density scanning eliminates 90% of pre-shipment rejections.</p></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
