import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#047857', '#065f46', '#10b981', '#34d399', '#6ee7b7', '#064e3b', '#022c22', '#ecfdf5']
const MATERIALS = ['Ferrous Scrap HMS1', 'Non-Ferrous Copper', 'Aluminium Taint Tabor', 'E-Waste PCB Boards', 'Battery Lead Scrap', 'Plastic PET Flakes', 'Rubber Tire Crumb', 'Glass Cullet Mixed']
const FACILITIES = ['Mumbai Scrap Yard', 'Delhi NCR Recycling Hub', 'Chennai E-Waste Park', 'Kolkata Metal Yard', 'Ahmedabad Plastic Plant', 'Pune Battery Recycler', 'Bangalore Glass Unit', 'Hyderabad Rubber Plant']
const STATUSES = ['MPCB Licensed', 'E-Waste Rules 2016', 'In Transit Open Truck', 'Yard Stored', 'Pending GST Refund', 'Awaiting Shredding']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const MaterialBadge = ({ name }: { name: string }) => (
  <span className="srl-badge inline-block px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="srl-status inline-block px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="srl-costbar w-full bg-emerald-100 rounded h-2"><div className="bg-emerald-600 h-2 rounded" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ value, label, size = 64 }: { value: number; label: string; size?: number }) => {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (ri(0, 100, value) / 100) * circ
  return (
    <div className="srl-health-ring flex flex-col items-center">
      <svg width={size} height={size}><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={4} /><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#047857" strokeWidth={4} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`} /></svg>
      <span className="text-xs font-semibold" style={{ color: COLORS[0] }}>{value}%</span>
      <span className="text-[10px] text-gray-500">{label}</span>
    </div>
  )
}

const KpiTile = ({ label, value, icon }: { label: string; value: string; icon: string }) => (
  <Card className="srl-kpi"><CardContent className="p-4"><div className="flex items-center gap-3"><span className="text-2xl">{icon}</span><div><p className="text-xs text-gray-500">{label}</p><p className="text-xl font-bold" style={{ color: COLORS[0] }}>{value}</p></div></div></CardContent></Card>
)

const ValueTile = ({ label, value }: { label: string; value: string }) => (
  <Card className="srl-value"><CardContent className="p-4"><p className="text-xs text-gray-500">{label}</p><p className="text-lg font-semibold" style={{ color: COLORS[1] }}>{value}</p></CardContent></Card>
)

const genRecords = (startIdx: number) => Array.from({ length: 20 }, (_, i) => {
  const idx = startIdx + i
  const units = ['MT', 'kg', 'tons', 'bales']
  return {
    id: `SRL-${String(idx).padStart(4, '0')}`, material: MATERIALS[idx % 8], facility: FACILITIES[idx % 8],
    status: STATUSES[idx % 6], qty: ri(50, 8000, 300 + idx * 95), unit: units[idx % 4],
    cost: ri(5000, 500000, 18000 + idx * 9200), date: `2025-01-${String(ri(1, 28, idx % 28 + 1)).padStart(2, '0')}`,
  }
})

const handRecords = [
  { id: 'SRL-0001', material: 'Ferrous Scrap HMS1', facility: 'Mumbai Scrap Yard', status: 'In Transit Open Truck', qty: 4500, unit: 'MT', cost: 225000, date: '2025-01-03' },
  { id: 'SRL-0002', material: 'Non-Ferrous Copper', facility: 'Delhi NCR Recycling Hub', status: 'MPCB Licensed', qty: 1200, unit: 'kg', cost: 480000, date: '2025-01-05' },
  { id: 'SRL-0003', material: 'Aluminium Taint Tabor', facility: 'Kolkata Metal Yard', status: 'Yard Stored', qty: 3200, unit: 'MT', cost: 144000, date: '2025-01-07' },
  { id: 'SRL-0004', material: 'E-Waste PCB Boards', facility: 'Chennai E-Waste Park', status: 'E-Waste Rules 2016', qty: 850, unit: 'kg', cost: 340000, date: '2025-01-09' },
  { id: 'SRL-0005', material: 'Battery Lead Scrap', facility: 'Pune Battery Recycler', status: 'Pending GST Refund', qty: 1800, unit: 'kg', cost: 162000, date: '2025-01-10' },
  { id: 'SRL-0006', material: 'Plastic PET Flakes', facility: 'Ahmedabad Plastic Plant', status: 'Awaiting Shredding', qty: 6200, unit: 'kg', cost: 93000, date: '2025-01-12' },
  { id: 'SRL-0007', material: 'Rubber Tire Crumb', facility: 'Hyderabad Rubber Plant', status: 'In Transit Open Truck', qty: 2800, unit: 'bales', cost: 112000, date: '2025-01-13' },
  { id: 'SRL-0008', material: 'Glass Cullet Mixed', facility: 'Bangalore Glass Unit', status: 'Yard Stored', qty: 5400, unit: 'kg', cost: 54000, date: '2025-01-15' },
  { id: 'SRL-0009', material: 'Ferrous Scrap HMS1', facility: 'Kolkata Metal Yard', status: 'MPCB Licensed', qty: 7200, unit: 'MT', cost: 360000, date: '2025-01-16' },
  { id: 'SRL-0010', material: 'Non-Ferrous Copper', facility: 'Mumbai Scrap Yard', status: 'E-Waste Rules 2016', qty: 950, unit: 'kg', cost: 427500, date: '2025-01-18' },
  { id: 'SRL-0011', material: 'Aluminium Taint Tabor', facility: 'Delhi NCR Recycling Hub', status: 'In Transit Open Truck', qty: 4100, unit: 'MT', cost: 184500, date: '2025-01-19' },
  { id: 'SRL-0012', material: 'E-Waste PCB Boards', facility: 'Chennai E-Waste Park', status: 'Pending GST Refund', qty: 1600, unit: 'kg', cost: 320000, date: '2025-01-20' },
  { id: 'SRL-0013', material: 'Battery Lead Scrap', facility: 'Pune Battery Recycler', status: 'Awaiting Shredding', qty: 2200, unit: 'kg', cost: 198000, date: '2025-01-21' },
  { id: 'SRL-0014', material: 'Plastic PET Flakes', facility: 'Ahmedabad Plastic Plant', status: 'Yard Stored', qty: 7800, unit: 'kg', cost: 117000, date: '2025-01-22' },
  { id: 'SRL-0015', material: 'Rubber Tire Crumb', facility: 'Hyderabad Rubber Plant', status: 'MPCB Licensed', qty: 3500, unit: 'bales', cost: 140000, date: '2025-01-23' },
  { id: 'SRL-0016', material: 'Glass Cullet Mixed', facility: 'Bangalore Glass Unit', status: 'In Transit Open Truck', qty: 4200, unit: 'kg', cost: 42000, date: '2025-01-24' },
  { id: 'SRL-0017', material: 'Ferrous Scrap HMS1', facility: 'Mumbai Scrap Yard', status: 'E-Waste Rules 2016', qty: 5800, unit: 'MT', cost: 290000, date: '2025-01-25' },
  { id: 'SRL-0018', material: 'Non-Ferrous Copper', facility: 'Kolkata Metal Yard', status: 'Pending GST Refund', qty: 1400, unit: 'kg', cost: 560000, date: '2025-01-26' },
  { id: 'SRL-0019', material: 'Battery Lead Scrap', facility: 'Delhi NCR Recycling Hub', status: 'MPCB Licensed', qty: 2600, unit: 'kg', cost: 234000, date: '2025-01-27' },
  { id: 'SRL-0020', material: 'Aluminium Taint Tabor', facility: 'Chennai E-Waste Park', status: 'Awaiting Shredding', qty: 5000, unit: 'MT', cost: 225000, date: '2025-01-28' },
]





export default function ScrapRecyclingLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = [...handRecords, ...genRecords(21), ...genRecords(41)]

  const filteredRecords = useMemo(() => {
    return allRecords.filter(r => {
      if (searchQuery && !r.id.toLowerCase().includes(searchQuery.toLowerCase()) && !r.material.toLowerCase().includes(searchQuery.toLowerCase())) return false
      return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string))
    })
  }, [searchQuery, activeFilters, allRecords])

  const filterGroups = [
    { key: 'material', label: 'Material Type', options: MATERIALS.map(m => ({ value: m, label: m, count: allRecords.filter(r => r.material === m).length })) },
    { key: 'status', label: 'Status', options: STATUSES.map(s => ({ value: s, label: s, count: allRecords.filter(r => r.status === s).length })) },
  ]

  const trendData = MATERIALS.slice(0, 6).map((m, i) => ({ name: m.split(' ')[0], shipments: 15 + i * 10, cost: 120000 + i * 38000 }))
  const facilityChart = FACILITIES.slice(0, 6).map((f, i) => ({ name: f.split(' ').slice(0, 2).join(' '), volume: 250 + i * 140, revenue: 8 + i * 4 }))
  const statusPie = STATUSES.map((s, i) => ({ name: s.split(' ').slice(0, 2).join(' '), value: 10 + i * 4 }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="srl-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Scrap & Recycling' }]} />
      <PageHeader title="Scrap & Recycling Logistics" description="Track scrap material collection and recycling operations across India" />
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-emerald-50">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <KpiTile icon="♻️" label="Total Shipments" value={String(allRecords.length)} />
            <KpiTile icon="🏭" label="Active Facilities" value={String(FACILITIES.length)} />
            <KpiTile icon="💰" label="Total Value" value={`₹${(allRecords.reduce((a, r) => a + r.cost, 0) / 100000).toFixed(1)}L`} />
            <KpiTile icon="📈" label="Avg Cost" value={`₹${Math.round(allRecords.reduce((a, r) => a + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>

          <Card className="srl-health-grid">
            <CardHeader><CardTitle>Operational Health</CardTitle></CardHeader>
            <CardContent>
              <div className="flex justify-around">
                <HealthRing value={82} label="Collection" />
                <HealthRing value={89} label="Sorting" />
                <HealthRing value={74} label="Processing" />
                <HealthRing value={91} label="Compliance" />
                <HealthRing value={68} label="Recovery" />
                <HealthRing value={86} label="Sustainability" />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Ferrous Collected" value="2,340 MT" />
            <ValueTile label="E-Waste Processed" value="1,200 kg" />
            <ValueTile label="Pending GST" value="₹6.8L" />
            <ValueTile label="MPCB Licensed" value="18 Yards" />
          </div>
        </TabsContent>

        <TabsContent value="shipments" className="space-y-4">
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={(key, value) => setActiveFilters(p => ({ ...p, [key]: p[key]?.includes(value) ? p[key].filter((v: string) => v !== value) : [...(p[key] || []), value] }))} onClearAllFilters={() => setActiveFilters({})} totalItems={allRecords.length} filteredCount={filteredRecords.length} onRefresh={() => {}} placeholder="Search by ID, material, facility, or lot..." />

          <Card className="srl-table-card">
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-emerald-50">
                    <th className="p-3 text-left">ID</th>
                    <th className="p-3 text-left">Material</th>
                    <th className="p-3 text-left">Facility</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-right">Qty</th>
                    <th className="p-3 text-right">Cost</th>
                    <th className="p-3 text-left">Cost Bar</th>
                    <th className="p-3 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.slice(0, 15).map(r => (
                    <tr key={r.id} className="border-b hover:bg-emerald-50/50">
                      <td className="p-3 font-mono text-xs">{r.id}</td>
                      <td className="p-3"><MaterialBadge name={r.material} /></td>
                      <td className="p-3 text-xs">{r.facility}</td>
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
              <CardHeader><CardTitle>Collection Trend</CardTitle></CardHeader>
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
              <CardHeader><CardTitle>Facility Volume</CardTitle></CardHeader>
              <CardContent>
                <BarChart width={500} height={250} data={facilityChart}>
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
            <Card className="srl-insight"><CardHeader><CardTitle>E-Waste Management Rules 2016</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">CPCB-authorized dismantlers must follow E-Waste Rules 2016 for collection, segregation, and disposal. Producers have Extended Producer Responsibility targets for electronic waste recovery across Indian states.</p></CardContent></Card>
            <Card className="srl-insight"><CardHeader><CardTitle>Metal Recycling Federation of India</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">MRFI advocates for uniform ferrous scrap import duty reduction from 2.5% to zero. India imports 7 MT of ferrous scrap annually, with major sources being US, UK, and Middle East for steel-making feedstock.</p></CardContent></Card>
            <Card className="srl-insight"><CardHeader><CardTitle>Extended Producer Responsibility</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">EPR framework under Plastic Waste Management Rules 2016 mandates producers to recycle plastic waste. PIB-backed PRO agencies coordinate collection targets for PET, HDPE, and multi-layer packaging across 28 states.</p></CardContent></Card>
            <Card className="srl-insight"><CardHeader><CardTitle>AI-Driven Scrap Grading</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Automated metal composition analysis using XRF spectroscopy and AI vision grading improves scrap sorting accuracy by 35%. IoT-enabled yards track real-time material flow and purity for ferrous and non-ferrous streams.</p></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
