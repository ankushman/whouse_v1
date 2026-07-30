import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#b91c1c', '#dc2626', '#ef4444', '#f87171', '#fca5a5', '#7f1d1d', '#991b1b', '#fef2f2']
const PRODUCTS = ['Banarasi Silk Saree', 'Kanchipuram Pattu', 'Pochampally Ikat', 'Chanderi Maheshwari', 'Patola Rajkot Double', 'Muga Silk Assam', 'Bhagalpur Tussar', 'Kashmir Pashmina']
const WEAVERS = ['Banaras Weavers Co-op', 'Kanchipuram Silk Society', 'Pochampally Handloom', 'Chanderi Weavers Guild', 'Rajkot Patola House', 'Sualkuchi Assam Silk', 'Bhagalpur Silk Board', 'Srinagar Pashmina Artisans']
const STATUSES = ['GI Silk Certified', 'Handloom Mark', 'In Transit Flatbed', 'Climate Store', 'Pending GST 5%', 'Awaiting Weave QC']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="sth-badge inline-block px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="sth-status inline-block px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="sth-costbar w-full bg-red-100 rounded h-2"><div className="bg-red-600 h-2 rounded" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ value, label, size = 64 }: { value: number; label: string; size?: number }) => {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (ri(0, 100, value) / 100) * circ
  return (
    <div className="sth-health-ring flex flex-col items-center">
      <svg width={size} height={size}><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={4} /><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#b91c1c" strokeWidth={4} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`} /></svg>
      <span className="text-xs font-semibold" style={{ color: COLORS[0] }}>{value}%</span>
      <span className="text-[10px] text-gray-500">{label}</span>
    </div>
  )
}

const KpiTile = ({ label, value, icon }: { label: string; value: string; icon: string }) => (
  <Card className="sth-kpi"><CardContent className="p-4"><div className="flex items-center gap-3"><span className="text-2xl">{icon}</span><div><p className="text-xs text-gray-500">{label}</p><p className="text-xl font-bold" style={{ color: COLORS[0] }}>{value}</p></div></div></CardContent></Card>
)

const ValueTile = ({ label, value }: { label: string; value: string }) => (
  <Card className="sth-value"><CardContent className="p-4"><p className="text-xs text-gray-500">{label}</p><p className="text-lg font-semibold" style={{ color: COLORS[1] }}>{value}</p></CardContent></Card>
)

const genRecords = (startIdx: number) => Array.from({ length: 20 }, (_, i) => {
  const idx = startIdx + i
  const units = ['m', 'yards', 'pcs', 'sets']
  return {
    id: `STH-${String(idx).padStart(4, '0')}`, product: PRODUCTS[idx % 8], weaver: WEAVERS[idx % 8],
    status: STATUSES[idx % 6], qty: ri(10, 1000, 50 + idx * 46), unit: units[idx % 4],
    cost: ri(20000, 800000, 40000 + idx * 16000), date: `2025-02-${String(ri(1, 28, idx % 28 + 1)).padStart(2, '0')}`,
  }
})

const silkRecords = [
  { id: 'STH-0001', product: 'Banarasi Silk Saree', weaver: 'Banaras Weavers Co-op', status: 'GI Silk Certified', qty: 120, unit: 'pcs', cost: 720000, date: '2025-02-04' },
  { id: 'STH-0002', product: 'Kanchipuram Pattu', weaver: 'Kanchipuram Silk Society', status: 'Handloom Mark', qty: 80, unit: 'pcs', cost: 800000, date: '2025-02-06' },
  { id: 'STH-0003', product: 'Pochampally Ikat', weaver: 'Pochampally Handloom', status: 'In Transit Flatbed', qty: 200, unit: 'm', cost: 240000, date: '2025-02-08' },
  { id: 'STH-0004', product: 'Chanderi Maheshwari', weaver: 'Chanderi Weavers Guild', status: 'Climate Store', qty: 150, unit: 'm', cost: 180000, date: '2025-02-10' },
  { id: 'STH-0005', product: 'Patola Rajkot Double', weaver: 'Rajkot Patola House', status: 'Pending GST 5%', qty: 25, unit: 'pcs', cost: 625000, date: '2025-02-11' },
  { id: 'STH-0006', product: 'Muga Silk Assam', weaver: 'Sualkuchi Assam Silk', status: 'Awaiting Weave QC', qty: 300, unit: 'm', cost: 360000, date: '2025-02-13' },
  { id: 'STH-0007', product: 'Bhagalpur Tussar', weaver: 'Bhagalpur Silk Board', status: 'GI Silk Certified', qty: 500, unit: 'm', cost: 200000, date: '2025-02-14' },
  { id: 'STH-0008', product: 'Kashmir Pashmina', weaver: 'Srinagar Pashmina Artisans', status: 'In Transit Flatbed', qty: 30, unit: 'pcs', cost: 900000, date: '2025-02-16' },
  { id: 'STH-0009', product: 'Banarasi Silk Saree', weaver: 'Banaras Weavers Co-op', status: 'Handloom Mark', qty: 100, unit: 'pcs', cost: 600000, date: '2025-02-17' },
  { id: 'STH-0010', product: 'Kanchipuram Pattu', weaver: 'Kanchipuram Silk Society', status: 'Climate Store', qty: 65, unit: 'pcs', cost: 650000, date: '2025-02-18' },
  { id: 'STH-0011', product: 'Pochampally Ikat', weaver: 'Pochampally Handloom', status: 'GI Silk Certified', qty: 180, unit: 'm', cost: 216000, date: '2025-02-19' },
  { id: 'STH-0012', product: 'Chanderi Maheshwari', weaver: 'Chanderi Weavers Guild', status: 'Awaiting Weave QC', qty: 220, unit: 'm', cost: 264000, date: '2025-02-20' },
  { id: 'STH-0013', product: 'Patola Rajkot Double', weaver: 'Rajkot Patola House', status: 'In Transit Flatbed', qty: 20, unit: 'pcs', cost: 500000, date: '2025-02-21' },
  { id: 'STH-0014', product: 'Muga Silk Assam', weaver: 'Sualkuchi Assam Silk', status: 'Pending GST 5%', qty: 350, unit: 'm', cost: 420000, date: '2025-02-22' },
  { id: 'STH-0015', product: 'Bhagalpur Tussar', weaver: 'Bhagalpur Silk Board', status: 'Handloom Mark', qty: 400, unit: 'm', cost: 160000, date: '2025-02-23' },
  { id: 'STH-0016', product: 'Kashmir Pashmina', weaver: 'Srinagar Pashmina Artisans', status: 'GI Silk Certified', qty: 40, unit: 'pcs', cost: 1200000, date: '2025-02-24' },
  { id: 'STH-0017', product: 'Banarasi Silk Saree', weaver: 'Banaras Weavers Co-op', status: 'Awaiting Weave QC', qty: 90, unit: 'pcs', cost: 540000, date: '2025-02-25' },
  { id: 'STH-0018', product: 'Kanchipuram Pattu', weaver: 'Kanchipuram Silk Society', status: 'In Transit Flatbed', qty: 70, unit: 'pcs', cost: 700000, date: '2025-02-26' },
  { id: 'STH-0019', product: 'Pochampally Ikat', weaver: 'Pochampally Handloom', status: 'Climate Store', qty: 250, unit: 'm', cost: 300000, date: '2025-02-27' },
  { id: 'STH-0020', product: 'Chanderi Maheshwari', weaver: 'Chanderi Weavers Guild', status: 'GI Silk Certified', qty: 175, unit: 'm', cost: 210000, date: '2025-02-28' },
]




export default function SilkTextileHeritageSupplyChainView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = [...silkRecords, ...genRecords(21), ...genRecords(41)]

  const filteredRecords = useMemo(() => {
    return allRecords.filter(r => {
      if (searchQuery && !r.id.toLowerCase().includes(searchQuery.toLowerCase()) && !r.product.toLowerCase().includes(searchQuery.toLowerCase())) return false
      return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string))
    })
  }, [searchQuery, activeFilters, allRecords])

  const filterGroups = [
    { key: 'product', label: 'Silk Type', options: PRODUCTS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.product === p).length })) },
    { key: 'status', label: 'Status', options: STATUSES.map(s => ({ value: s, label: s, count: allRecords.filter(r => r.status === s).length })) },
  ]

  const trendData = PRODUCTS.slice(0, 6).map((p, i) => ({ name: p.split(' ').slice(0, 2).join(' '), shipments: 10 + i * 5, cost: 200000 + i * 100000 }))
  const weaverChart = WEAVERS.slice(0, 6).map((w, i) => ({ name: w.split(' ').slice(0, 2).join(' '), volume: 60 + i * 40, revenue: 4 + i * 3 }))
  const statusPie = STATUSES.map((s, i) => ({ name: s.split(' ').slice(0, 2).join(' '), value: 10 + i * 4 }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="sth-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Silk & Textile Heritage' }]} />
      <PageHeader title="Silk & Textile Heritage Supply Chain" description="Track India's GI-tagged silk and heritage textile logistics from weaver clusters to global fashion markets" />
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-red-50">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <KpiTile icon="🧵" label="Total Shipments" value={String(allRecords.length)} />
            <KpiTile icon="🏭" label="Weaver Clusters" value={String(WEAVERS.length)} />
            <KpiTile icon="💰" label="Total Value" value={`₹${(allRecords.reduce((a, r) => a + r.cost, 0) / 10000000).toFixed(2)}Cr`} />
            <KpiTile icon="📈" label="Avg Cost" value={`₹${Math.round(allRecords.reduce((a, r) => a + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>

          <Card className="sth-health-grid">
            <CardHeader><CardTitle>Operational Health</CardTitle></CardHeader>
            <CardContent>
              <div className="flex justify-around">
                <HealthRing value={80} label="Weave Quality" />
                <HealthRing value={74} label="Silk Purity" />
                <HealthRing value={85} label="GI Tags" />
                <HealthRing value={69} label="Handloom" />
                <HealthRing value={92} label="Export" />
                <HealthRing value={71} label="Weaver Pay" />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Banarasi Stock" value="310 pcs" />
            <ValueTile label="Kanchipuram" value="215 pcs" />
            <ValueTile label="In Flatbed Transit" value="36 Lots" />
            <ValueTile label="GI Certified" value="58 Lots" />
          </div>
        </TabsContent>

        <TabsContent value="shipments" className="space-y-4">
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={(key, value) => setActiveFilters(p => ({ ...p, [key]: p[key]?.includes(value) ? p[key].filter((v: string) => v !== value) : [...(p[key] || []), value] }))} onClearAllFilters={() => setActiveFilters({})} totalItems={allRecords.length} filteredCount={filteredRecords.length} onRefresh={() => {}} placeholder="Search by ID, silk type, weaver, or lot..." />

          <Card className="sth-table-card">
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-red-50">
                    <th className="p-3 text-left">ID</th>
                    <th className="p-3 text-left">Silk Type</th>
                    <th className="p-3 text-left">Weaver Cluster</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-right">Qty</th>
                    <th className="p-3 text-right">Cost</th>
                    <th className="p-3 text-left">Cost Bar</th>
                    <th className="p-3 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.slice(0, 15).map(r => (
                    <tr key={r.id} className="border-b hover:bg-red-50/50">
                      <td className="p-3 font-mono text-xs">{r.id}</td>
                      <td className="p-3"><ProductBadge name={r.product} /></td>
                      <td className="p-3 text-xs">{r.weaver}</td>
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
                  <Line type="monotone" dataKey="cost" stroke={COLORS[2]} strokeWidth={2} />
                </LineChart>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Weaver Cluster Volume</CardTitle></CardHeader>
              <CardContent>
                <BarChart width={500} height={250} data={weaverChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={10} />
                  <YAxis fontSize={11} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="volume" fill={COLORS[0]} />
                  <Bar dataKey="revenue" fill={COLORS[2]} />
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
            <Card className="sth-insight"><CardHeader><CardTitle>Banarasi GI Silk Tag</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Banarasi Silk Sarees received GI registration in 2009 protecting the 500-year weaving tradition of Varanasi. Only sarees woven within Varanasi, Chandauli, Jaunpur, and Azamgarh districts using pure silk with specific zari patterns can carry the Banarasi GI tag.</p></CardContent></Card>
            <Card className="sth-insight"><CardHeader><CardTitle>Handloom Reservation Act</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Handloom Reservation Act 1985 reserves 11 textile items exclusively for handloom production including sarees, dhotis, and lungis. India has 3.5 million handlooms, the world's largest handloom workforce, producing 15% of total textile output with zero carbon footprint.</p></CardContent></Card>
            <Card className="sth-insight"><CardHeader><CardTitle>Kanchipuram Temple Town Silk</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Kanchipuram silk sarees use mulberry silk with 60% zari content, each taking 15-30 days to weave on traditional pit looms. The GI tag ensures only sarees woven within Kanchipuram taluk with minimum 50% pure mulberry silk qualify, supporting 5,000+ weaver families.</p></CardContent></Card>
            <Card className="sth-insight"><CardHeader><CardTitle>Heritage Textile Cold Chain</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Natural silk textiles require humidity-controlled logistics at 45-55% RH to prevent mildew during monsoon transit. IoT-enabled storage vaults with UV protection and nitrogen-flushed containers preserve dye fastness and fabric integrity for GI-certified heritage textiles worth over ₹10,000 per meter.</p></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
