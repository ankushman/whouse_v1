import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#0f766e', '#115e59', '#14b8a6', '#2dd4bf', '#5eead4', '#134e4a', '#042f2e', '#f0fdfa']
const PAPERS = ['Kraft Paper GSM 80', 'Newsprint 45 GSM', 'Copier A4 Paper', 'Tissue Paper Jumbo', 'Duplex Board', 'Corrugated Flute', 'Writing Printing Paper', 'Paper Pulp Hardwood']
const MILLS = ['JK Paper Rayagada', 'Ballarpur Industries Chennai', 'Century Pulp Lalkua', 'TNPL Karur', 'ITC PSPD Bhadrachalam', 'West Coast Paper Dandeli', 'Seshasayee Paper Erode', 'Emami Paper Balasore']
const STATUSES = ['ISI IS 12921 Certified', 'FSC Chain of Custody', 'In Transit Rail', 'Warehouse Climate Ctrl', 'Pending Excise', 'Awaiting Print House']

const ri = (min: number, max: number, value: number) => Math.min(max, Math.max(min, value))

const PaperBadge = ({ name }: { name: string }) => (
  <span className="ppl-badge inline-block px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="ppl-status inline-block px-2 py-0.5 rounded text-xs font-medium bg-teal-100 text-teal-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="ppl-costbar w-full bg-teal-100 rounded h-2"><div className="bg-teal-600 h-2 rounded" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ value, label, size = 64 }: { value: number; label: string; size?: number }) => {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (ri(0, 100, value) / 100) * circ
  return (
    <div className="ppl-health-ring flex flex-col items-center">
      <svg width={size} height={size}><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={4} /><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#0f766e" strokeWidth={4} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`} /></svg>
      <span className="text-xs font-semibold" style={{ color: COLORS[0] }}>{value}%</span>
      <span className="text-[10px] text-gray-500">{label}</span>
    </div>
  )
}

const KpiTile = ({ label, value, icon }: { label: string; value: string; icon: string }) => (
  <Card className="ppl-kpi"><CardContent className="p-4"><div className="flex items-center gap-3"><span className="text-2xl">{icon}</span><div><p className="text-xs text-gray-500">{label}</p><p className="text-xl font-bold" style={{ color: COLORS[0] }}>{value}</p></div></div></CardContent></Card>
)

const ValueTile = ({ label, value }: { label: string; value: string }) => (
  <Card className="ppl-value"><CardContent className="p-4"><p className="text-xs text-gray-500">{label}</p><p className="text-lg font-semibold" style={{ color: COLORS[1] }}>{value}</p></CardContent></Card>
)

const genRecords = (startIdx: number) => Array.from({ length: 20 }, (_, i) => {
  const idx = startIdx + i
  const units = ['MT', 'reams', 'rolls', 'bales']
  return {
    id: `PPL-${String(idx).padStart(4, '0')}`, paper: PAPERS[idx % 8], mill: MILLS[idx % 8],
    status: STATUSES[idx % 6], qty: ri(50, 5000, 200 + idx * 73), unit: units[idx % 4],
    cost: ri(10000, 800000, 25000 + idx * 11300), date: `2025-01-${String(ri(1, 28, idx % 28 + 1)).padStart(2, '0')}`,
  }
})

const handRecords = [
  { id: 'PPL-0001', paper: 'Kraft Paper GSM 80', mill: 'JK Paper Rayagada', status: 'In Transit Rail', qty: 2400, unit: 'MT', cost: 185000, date: '2025-01-05' },
  { id: 'PPL-0002', paper: 'Newsprint 45 GSM', mill: 'TNPL Karur', status: 'Warehouse Climate Ctrl', qty: 12000, unit: 'reams', cost: 342000, date: '2025-01-08' },
  { id: 'PPL-0003', paper: 'Copier A4 Paper', mill: 'ITC PSPD Bhadrachalam', status: 'FSC Chain of Custody', qty: 8500, unit: 'reams', cost: 510000, date: '2025-01-10' },
  { id: 'PPL-0004', paper: 'Tissue Paper Jumbo', mill: 'Century Pulp Lalkua', status: 'Pending Excise', qty: 320, unit: 'rolls', cost: 128000, date: '2025-01-12' },
  { id: 'PPL-0005', paper: 'Duplex Board', mill: 'Ballarpur Industries Chennai', status: 'Awaiting Print House', qty: 4500, unit: 'bales', cost: 675000, date: '2025-01-14' },
  { id: 'PPL-0006', paper: 'Corrugated Flute', mill: 'West Coast Paper Dandeli', status: 'In Transit Rail', qty: 6800, unit: 'MT', cost: 238000, date: '2025-01-15' },
  { id: 'PPL-0007', paper: 'Writing Printing Paper', mill: 'Seshasayee Paper Erode', status: 'ISI IS 12921 Certified', qty: 5200, unit: 'reams', cost: 312000, date: '2025-01-16' },
  { id: 'PPL-0008', paper: 'Paper Pulp Hardwood', mill: 'Emami Paper Balasore', status: 'Warehouse Climate Ctrl', qty: 950, unit: 'MT', cost: 427500, date: '2025-01-18' },
  { id: 'PPL-0009', paper: 'Kraft Paper GSM 80', mill: 'TNPL Karur', status: 'FSC Chain of Custody', qty: 1800, unit: 'MT', cost: 144000, date: '2025-01-19' },
  { id: 'PPL-0010', paper: 'Newsprint 45 GSM', mill: 'JK Paper Rayagada', status: 'Pending Excise', qty: 15000, unit: 'reams', cost: 450000, date: '2025-01-20' },
  { id: 'PPL-0011', paper: 'Copier A4 Paper', mill: 'Ballarpur Industries Chennai', status: 'In Transit Rail', qty: 6200, unit: 'reams', cost: 372000, date: '2025-01-21' },
  { id: 'PPL-0012', paper: 'Tissue Paper Jumbo', mill: 'ITC PSPD Bhadrachalam', status: 'Awaiting Print House', qty: 180, unit: 'rolls', cost: 72000, date: '2025-01-22' },
  { id: 'PPL-0013', paper: 'Duplex Board', mill: 'Century Pulp Lalkua', status: 'Warehouse Climate Ctrl', qty: 3100, unit: 'bales', cost: 465000, date: '2025-01-23' },
  { id: 'PPL-0014', paper: 'Corrugated Flute', mill: 'Seshasayee Paper Erode', status: 'ISI IS 12921 Certified', qty: 4200, unit: 'MT', cost: 147000, date: '2025-01-24' },
  { id: 'PPL-0015', paper: 'Writing Printing Paper', mill: 'West Coast Paper Dandeli', status: 'FSC Chain of Custody', qty: 7800, unit: 'reams', cost: 468000, date: '2025-01-25' },
  { id: 'PPL-0016', paper: 'Paper Pulp Hardwood', mill: 'JK Paper Rayagada', status: 'In Transit Rail', qty: 1200, unit: 'MT', cost: 540000, date: '2025-01-26' },
  { id: 'PPL-0017', paper: 'Kraft Paper GSM 80', mill: 'Emami Paper Balasore', status: 'Pending Excise', qty: 3600, unit: 'MT', cost: 288000, date: '2025-01-27' },
  { id: 'PPL-0018', paper: 'Newsprint 45 GSM', mill: 'Century Pulp Lalkua', status: 'Warehouse Climate Ctrl', qty: 9800, unit: 'reams', cost: 294000, date: '2025-01-28' },
  { id: 'PPL-0019', paper: 'Duplex Board', mill: 'TNPL Karur', status: 'Awaiting Print House', qty: 2700, unit: 'bales', cost: 405000, date: '2025-01-29' },
  { id: 'PPL-0020', paper: 'Corrugated Flute', mill: 'ITC PSPD Bhadrachalam', status: 'ISI IS 12921 Certified', qty: 5100, unit: 'MT', cost: 178500, date: '2025-01-30' },
]













export default function PaperPulpLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = [...handRecords, ...genRecords(21), ...genRecords(41)]

  const filteredRecords = useMemo(() => {
    return allRecords.filter(r => {
      if (searchQuery && !r.id.toLowerCase().includes(searchQuery.toLowerCase()) && !r.paper.toLowerCase().includes(searchQuery.toLowerCase())) return false
      return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string))
    })
  }, [searchQuery, activeFilters, allRecords])

  const filterGroups = [
    { key: 'paper', label: 'Paper Type', options: PAPERS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.paper === p).length })) },
    { key: 'status', label: 'Status', options: STATUSES.map(s => ({ value: s, label: s, count: allRecords.filter(r => r.status === s).length })) },
  ]

  const trendData = PAPERS.slice(0, 6).map((p, i) => ({ name: p.split(' ')[0], shipments: 20 + i * 12, cost: 150000 + i * 45000 }))
  const millChart = MILLS.slice(0, 6).map((m, i) => ({ name: m.split(' ').slice(0, 2).join(' '), volume: 300 + i * 120, revenue: 12 + i * 5 }))
  const statusPie = STATUSES.map((s, i) => ({ name: s.split(' ').slice(0, 2).join(' '), value: 8 + i * 3 }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="ppl-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Paper & Pulp' }]} />
      <PageHeader title="Paper & Pulp Logistics" description="Track paper and pulp shipments across India" />
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-teal-50">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <KpiTile icon="📦" label="Total Shipments" value={String(allRecords.length)} />
            <KpiTile icon="🏭" label="Active Mills" value={String(MILLS.length)} />
            <KpiTile icon="💰" label="Total Value" value={`₹${(allRecords.reduce((a, r) => a + r.cost, 0) / 100000).toFixed(1)}L`} />
            <KpiTile icon="📈" label="Avg Cost" value={`₹${Math.round(allRecords.reduce((a, r) => a + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>

          <Card className="ppl-health-grid">
            <CardHeader><CardTitle>Operational Health</CardTitle></CardHeader>
            <CardContent>
              <div className="flex justify-around">
                <HealthRing value={87} label="On-Time" />
                <HealthRing value={92} label="Quality" />
                <HealthRing value={78} label="Capacity" />
                <HealthRing value={95} label="Compliance" />
                <HealthRing value={71} label="Efficiency" />
                <HealthRing value={84} label="Sustainability" />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Kraft Shipped" value="1,240 MT" />
            <ValueTile label="Newsprint In Transit" value="8,500 reams" />
            <ValueTile label="Pending Excise" value="₹4.2L" />
            <ValueTile label="FSC Certified" value="23 Lots" />
          </div>
        </TabsContent>

        <TabsContent value="shipments" className="space-y-4">
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={(key, value) => setActiveFilters(p => ({ ...p, [key]: p[key]?.includes(value) ? p[key].filter((v: string) => v !== value) : [...(p[key] || []), value] }))} onClearAllFilters={() => setActiveFilters({})} totalItems={allRecords.length} filteredCount={filteredRecords.length} onRefresh={() => {}} placeholder="Search by ID, paper, mill, destination, or lot..." />

          <Card className="ppl-table-card">
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-teal-50">
                    <th className="p-3 text-left">ID</th>
                    <th className="p-3 text-left">Paper</th>
                    <th className="p-3 text-left">Mill</th>
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
                      <td className="p-3"><PaperBadge name={r.paper} /></td>
                      <td className="p-3 text-xs">{r.mill}</td>
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
              <CardHeader><CardTitle>Mill Volume</CardTitle></CardHeader>
              <CardContent>
                <BarChart width={500} height={250} data={millChart}>
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
            <Card className="ppl-insight"><CardHeader><CardTitle>BIS Paper Standards</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">BIS mandates IS 12921 for kraft paper in packaging. Compliance ensures moisture resistance and burst strength for Indian FMCG supply chains.</p></CardContent></Card>
            <Card className="ppl-insight"><CardHeader><CardTitle>FSC Sustainable Pulp</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Forest Stewardship Council chain-of-custody certification tracks pulp from certified forests to end-product, critical for EU market exports.</p></CardContent></Card>
            <Card className="ppl-insight"><CardHeader><CardTitle>Indian Railways Newsprint Freight</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Indian Railways offers concessional freight rates for newsprint. The Konkan Railway corridor reduces transit for West Coast mills by 40%.</p></CardContent></Card>
            <Card className="ppl-insight"><CardHeader><CardTitle>AI FMCG Corrugated Demand</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">AI-driven demand forecasting for FMCG corrugated packaging shows 18% YoY growth. E-commerce expansion drives duplex board demand in Tier-2 cities.</p></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
