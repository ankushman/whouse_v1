import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#b45309', '#92400e', '#d97706', '#f59e0b', '#fbbf24', '#78350f', '#451a03', '#fffbeb']

const LEATHERS = ['Finished Leather Cow', 'Finished Leather Goat', 'Chrome Tanned Hide', 'Vegetable Tanned', 'Leather Shoe Upper', 'Safety Shoe Industrial', 'Leather Belt Strap', 'Suede Nappa']

const MANUFACTURERS = ['CLRI Chennai Council', 'Tata Leather Mumbai', 'Farida Shoes Kanpur', 'Bata India Kolkata', 'Relaxo Footwear Noida', 'Liberty Shoes Karnal', 'Mirza International Agra', 'Superhouse Group Lucknow']
const STATUSES = ['IS 6710 Tested', 'REACH Compliant', 'In Transit Hazmat', 'Warehouse Climate Ctrl', 'Pending GST Refund', 'Awaiting Export QC']
const UNITS = ['sqft', 'sqmt', 'pairs', 'sheets']

const ri = (min: number, max: number, value: number) => Math.min(max, Math.max(min, value))

const genRecords = (startId: number) =>
  Array.from({ length: 20 }, (_, i) => ({
    id: `LFS-${startId + i}`,
    leather: LEATHERS[(startId + i) % 8],
    manufacturer: MANUFACTURERS[(startId + i * 3) % 8],
    status: STATUSES[(startId + i * 2) % 6],
    unit: UNITS[(startId + i) % 4],
    quantity: ri(50, 5000, ((startId + i) * 137) % 5000),
    cost: ri(1000, 80000, ((startId + i) * 4219) % 80000),
    health: ri(40, 100, ((startId + i * 7) % 60) + 40),
    date: `2025-0${ri(1, 6, ((startId + i) % 6) + 1)}-${String(ri(1, 28, ((startId + i * 3) % 28) + 1)).padStart(2, '0')}`,
  }))

const RECORDS = [
  { id: 'LFS-1', leather: 'Finished Leather Cow', manufacturer: 'CLRI Chennai Council', status: 'IS 6710 Tested', unit: 'sqft', quantity: 2400, cost: 35000, health: 92, date: '2025-01-12' },
  { id: 'LFS-2', leather: 'Chrome Tanned Hide', manufacturer: 'Tata Leather Mumbai', status: 'REACH Compliant', unit: 'sheets', quantity: 800, cost: 52000, health: 88, date: '2025-01-18' },
  { id: 'LFS-3', leather: 'Leather Shoe Upper', manufacturer: 'Farida Shoes Kanpur', status: 'In Transit Hazmat', unit: 'pairs', quantity: 1500, cost: 28000, health: 75, date: '2025-02-03' },
  { id: 'LFS-4', leather: 'Vegetable Tanned', manufacturer: 'Bata India Kolkata', status: 'Warehouse Climate Ctrl', unit: 'sqmt', quantity: 600, cost: 41000, health: 95, date: '2025-02-14' },
  { id: 'LFS-5', leather: 'Safety Shoe Industrial', manufacturer: 'Relaxo Footwear Noida', status: 'Pending GST Refund', unit: 'pairs', quantity: 3200, cost: 19000, health: 82, date: '2025-02-22' },
  { id: 'LFS-6', leather: 'Suede Nappa', manufacturer: 'Liberty Shoes Karnal', status: 'Awaiting Export QC', unit: 'sqft', quantity: 950, cost: 67000, health: 70, date: '2025-03-01' },
  { id: 'LFS-7', leather: 'Leather Belt Strap', manufacturer: 'Mirza International Agra', status: 'IS 6710 Tested', unit: 'sheets', quantity: 1800, cost: 24000, health: 91, date: '2025-03-08' },
  { id: 'LFS-8', leather: 'Finished Leather Goat', manufacturer: 'Superhouse Group Lucknow', status: 'REACH Compliant', unit: 'sqmt', quantity: 450, cost: 58000, health: 86, date: '2025-03-15' },
  { id: 'LFS-9', leather: 'Finished Leather Cow', manufacturer: 'CLRI Chennai Council', status: 'In Transit Hazmat', unit: 'sqft', quantity: 2100, cost: 33000, health: 68, date: '2025-03-21' },
  { id: 'LFS-10', leather: 'Chrome Tanned Hide', manufacturer: 'Farida Shoes Kanpur', status: 'Warehouse Climate Ctrl', unit: 'sheets', quantity: 720, cost: 47000, health: 94, date: '2025-04-02' },
  { id: 'LFS-11', leather: 'Leather Shoe Upper', manufacturer: 'Tata Leather Mumbai', status: 'Pending GST Refund', unit: 'pairs', quantity: 4100, cost: 15000, health: 79, date: '2025-04-10' },
  { id: 'LFS-12', leather: 'Vegetable Tanned', manufacturer: 'Relaxo Footwear Noida', status: 'Awaiting Export QC', unit: 'sqmt', quantity: 380, cost: 71000, health: 87, date: '2025-04-18' },
  { id: 'LFS-13', leather: 'Safety Shoe Industrial', manufacturer: 'Bata India Kolkata', status: 'IS 6710 Tested', unit: 'pairs', quantity: 2800, cost: 21000, health: 93, date: '2025-04-25' },
  { id: 'LFS-14', leather: 'Suede Nappa', manufacturer: 'CLRI Chennai Council', status: 'REACH Compliant', unit: 'sqft', quantity: 1100, cost: 62000, health: 84, date: '2025-05-02' },
  { id: 'LFS-15', leather: 'Leather Belt Strap', manufacturer: 'Liberty Shoes Karnal', status: 'In Transit Hazmat', unit: 'sheets', quantity: 650, cost: 38000, health: 72, date: '2025-05-09' },
  { id: 'LFS-16', leather: 'Finished Leather Goat', manufacturer: 'Mirza International Agra', status: 'Warehouse Climate Ctrl', unit: 'sqmt', quantity: 520, cost: 55000, health: 96, date: '2025-05-16' },
  { id: 'LFS-17', leather: 'Finished Leather Cow', manufacturer: 'Superhouse Group Lucknow', status: 'Pending GST Refund', unit: 'sqft', quantity: 1900, cost: 30000, health: 77, date: '2025-05-23' },
  { id: 'LFS-18', leather: 'Chrome Tanned Hide', manufacturer: 'Tata Leather Mumbai', status: 'Awaiting Export QC', unit: 'sheets', quantity: 870, cost: 49000, health: 89, date: '2025-06-01' },
  { id: 'LFS-19', leather: 'Leather Shoe Upper', manufacturer: 'Bata India Kolkata', status: 'IS 6710 Tested', unit: 'pairs', quantity: 3600, cost: 17000, health: 85, date: '2025-06-08' },
  { id: 'LFS-20', leather: 'Vegetable Tanned', manufacturer: 'Farida Shoes Kanpur', status: 'REACH Compliant', unit: 'sqmt', quantity: 430, cost: 64000, health: 90, date: '2025-06-15' },
  ...genRecords(21),
  ...genRecords(41),
]

const LeatherBadge = ({ label }: { label: string }) => (
  <span className="lfs-leather-badge" style={{ background: COLORS[7], color: COLORS[2], border: `1px solid ${COLORS[0]}`, padding: '2px 8px', borderRadius: 4, fontSize: 12, fontWeight: 600 }}>{label}</span>
)

const StatusBadge = ({ status }: { status: string }) => {
  const c = STATUSES.indexOf(status) % COLORS.length
  return <span style={{ background: `${COLORS[c]}22`, color: COLORS[c], border: `1px solid ${COLORS[c]}44`, padding: '2px 8px', borderRadius: 4, fontSize: 12, fontWeight: 600 }}>{status}</span>
}

const CostBar = ({ cost, maxCost }: { cost: number; maxCost: number }) => (
  <div style={{ width: '100%', height: 6, background: '#f5f5f4', borderRadius: 3 }}>
    <div style={{ width: `${ri(0, 100, (cost / maxCost) * 100)}%`, height: '100%', background: `linear-gradient(90deg, ${COLORS[0]}, ${COLORS[3]})`, borderRadius: 3 }} />
  </div>
)

const HealthRing = ({ value, size = 40 }: { value: number; size?: number }) => {
  const r = (size - 6) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (ri(0, 100, value) / 100) * circ
  const col = value >= 85 ? '#16a34a' : value >= 65 ? COLORS[3] : '#dc2626'
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e7e5e4" strokeWidth={3} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={col} strokeWidth={3} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      <text x={size / 2} y={size / 2 + 1} textAnchor="middle" dominantBaseline="middle" fontSize={10} fontWeight={700} fill={col}>{value}</text>
    </svg>
  )
}

const KpiTile = ({ title, value, sub }: { title: string; value: string; sub: string }) => (
  <Card className="lfs-kpi-tile"><CardContent className="p-4"><p className="text-xs text-muted-foreground">{title}</p><p className="text-xl font-bold" style={{ color: COLORS[0] }}>{value}</p><p className="text-xs text-muted-foreground mt-1">{sub}</p></CardContent></Card>
)

const ValueTile = ({ label, value }: { label: string; value: string }) => (
  <div className="lfs-value-tile flex flex-col gap-1 p-3 rounded-lg" style={{ background: COLORS[7] }}>
    <span className="text-xs text-muted-foreground">{label}</span>
    <span className="text-lg font-semibold" style={{ color: COLORS[1] }}>{value}</span>
  </div>
)

const INSIGHTS = [
  { title: 'CLRI Testing Standards', desc: 'Central Leather Research Institute mandates IS 6710 compliance for all leather exports from India, covering tensile strength, tear resistance, and color fastness.', icon: '🔬' },
  { title: 'CPCB Tannery Effluent Norms', desc: 'Central Pollution Control Board enforces strict BOD/COD limits for tannery effluents under E(P) Act 1986. Non-compliance leads to closure.', icon: '🏭' },
  { title: 'FIEO Export Incentives', desc: 'Federation of Indian Export Organizations provides MEIS/RODTEP benefits for leather footwear exporters, covering 2-5% of FOB value.', icon: '📦' },
  { title: 'AI Leather Defect Grading', desc: 'Machine vision systems detect scars, insect bites, and grain defects on hides with 94% accuracy, reducing manual inspection by 60%.', icon: '🤖' },
]

export default function LeatherFootwearSupplyChainView() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})

  const allRecords = RECORDS
  const maxCost = Math.max(...allRecords.map(r => r.cost))
  const lineData = allRecords.slice(0, 10).map(r => ({ date: r.date.slice(5), cost: r.cost, health: r.health }))
  const barData = LEATHERS.map((l, i) => ({ name: l.split(' ').slice(-1)[0], qty: ri(200, 5000, allRecords.filter(r => r.leather === l).reduce((s, r) => s + r.quantity, 0) || ((i + 1) * 600)), fill: COLORS[i % COLORS.length] }))
  const pieData = STATUSES.map((s, i) => ({ name: s.split(' ')[0], value: ri(5, 30, allRecords.filter(r => r.status === s).length || ((i + 1) * 4) + 3), fill: COLORS[i % COLORS.length] }))

  const kpis = [
    { title: 'Total Shipments', value: String(allRecords.length), sub: 'Across India' },
    { title: 'Active Inventory', value: `${(allRecords.reduce((s, r) => s + r.quantity, 0) / 1000).toFixed(1)}K`, sub: 'Mixed units' },
    { title: 'Total Value', value: `₹${(allRecords.reduce((s, r) => s + r.cost, 0) / 100000).toFixed(1)}L`, sub: 'Estimated cost' },
    { title: 'Avg Health', value: `${(allRecords.reduce((s, r) => s + r.health, 0) / allRecords.length).toFixed(0)}%`, sub: 'Supply score' },
  ]

  const filterGroups = [
    { key: 'leather', label: 'Leather Type', options: LEATHERS.map(l => ({ label: l, value: l, count: allRecords.filter(r => r.leather === l).length })) },
    { key: 'status', label: 'Status', options: STATUSES.map(s => ({ label: s, value: s, count: allRecords.filter(r => r.status === s).length })) },
    { key: 'manufacturer', label: 'Manufacturer', options: MANUFACTURERS.map(m => ({ label: m, value: m, count: allRecords.filter(r => r.manufacturer === m).length })) },
  ]

  const filtered = React.useMemo(() => {
    let data = allRecords
    if (searchQuery) data = data.filter(r => r.id.toLowerCase().includes(searchQuery.toLowerCase()) || r.leather.toLowerCase().includes(searchQuery.toLowerCase()) || r.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()))
    Object.entries(activeFilters).forEach(([key, vals]) => { if (vals.length) data = data.filter(r => vals.includes((r as Record<string, unknown>)[key] as string)) })
    return data
  }, [searchQuery, activeFilters, allRecords])

  return (
    <div className="lfs-root p-6 space-y-6">
      <ModuleBreadcrumb items={[{ label: 'Modules' }, { label: 'Leather & Footwear Supply Chain' }]} />
      <PageHeader title="Leather & Footwear Supply Chain" description="Track leather and footwear shipments across India" />
      <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={(key, val) => setActiveFilters(p => ({ ...p, [key]: p[key]?.includes(val) ? p[key].filter(v => v !== val) : [...(p[key] || []), val] }))} onClearAllFilters={() => setActiveFilters({})} totalItems={allRecords.length} filteredCount={filtered.length} onRefresh={() => {}} placeholder="Search by ID, leather, manufacturer..." />
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard" className="space-y-6 mt-4">
          <div className="grid grid-cols-4 gap-4">
            {kpis.map((k, i) => <KpiTile key={i} title={k.title} value={k.value} sub={k.sub} />)}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader><CardTitle className="text-sm">Shipment Cost Trend</CardTitle></CardHeader>
              <CardContent>
                <LineChart width={480} height={220} data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" fontSize={11} />
                  <YAxis fontSize={11} />
                  <Tooltip /><Legend />
                  <Line type="monotone" dataKey="cost" stroke={COLORS[0]} strokeWidth={2} />
                  <Line type="monotone" dataKey="health" stroke={COLORS[3]} strokeWidth={2} />
                </LineChart>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-sm">Leather Type Quantity</CardTitle></CardHeader>
              <CardContent>
                <BarChart width={480} height={220} data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={10} />
                  <YAxis fontSize={11} />
                  <Tooltip />
                  <Bar dataKey="qty">
                    {barData.map((e, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader><CardTitle className="text-sm">Status Breakdown</CardTitle></CardHeader>
            <CardContent className="flex justify-center">
              <PieChart width={320} height={320}>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={110} dataKey="value" label={({ name }) => name} labelLine={false}>
                  {pieData.map((e, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip /><Legend />
              </PieChart>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="inventory" className="space-y-4 mt-4">
          <div className="grid grid-cols-4 gap-4">
            {kpis.map((k, i) => <ValueTile key={i} label={k.title} value={k.value} />)}
          </div>
          <Card><CardContent className="p-0">
            <table className="w-full text-sm">
              <thead><tr className="border-b" style={{ background: COLORS[7] }}>
                <th className="text-left p-3 font-medium">ID</th>
                <th className="text-left p-3 font-medium">Leather</th>
                <th className="text-left p-3 font-medium">Manufacturer</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="text-left p-3 font-medium">Qty</th>
                <th className="text-left p-3 font-medium">Cost</th>
                <th className="text-left p-3 font-medium">Health</th>
              </tr></thead>
              <tbody>
                {filtered.slice(0, 15).map(r => (
                  <tr key={r.id} className="border-b hover:bg-amber-50/50">
                    <td className="p-3 font-mono text-xs">{r.id}</td>
                    <td className="p-3"><LeatherBadge label={r.leather} /></td>
                    <td className="p-3 text-xs">{r.manufacturer}</td>
                    <td className="p-3"><StatusBadge status={r.status} /></td>
                    <td className="p-3 text-xs">{r.quantity.toLocaleString()} {r.unit}</td>
                    <td className="p-3 text-xs w-32">
                      <span>₹{r.cost.toLocaleString()}</span>
                      <div className="mt-1"><CostBar cost={r.cost} maxCost={maxCost} /></div>
                    </td>
                    <td className="p-3"><HealthRing value={r.health} size={36} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent></Card>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4 mt-4">
          <div className="grid grid-cols-3 gap-4">
            {allRecords.slice(0, 6).map(r => (
              <Card key={r.id}><CardContent className="p-4 flex items-center gap-3">
                <HealthRing value={r.health} size={44} />
                <div>
                  <p className="text-sm font-semibold">{r.id}</p>
                  <p className="text-xs text-muted-foreground">{r.leather}</p>
                  <LeatherBadge label={r.status} />
                </div>
              </CardContent></Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="insights" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            {INSIGHTS.map((ins, i) => (
              <Card key={i}>
                <CardHeader><CardTitle className="text-sm flex items-center gap-2">{ins.icon} {ins.title}</CardTitle></CardHeader>
                <CardContent><p className="text-xs text-muted-foreground leading-relaxed">{ins.desc}</p></CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
