import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const MATERIALS = ['OPC 53 Grade Cement', 'PPC Cement', 'White Cement', 'Ready Mix Concrete RMC', 'Fly Ash Bricks', 'AAC Blocks', 'River Sand', 'Aggregates 20mm']
const MANUFACTURERS = ['UltraTech Cement Mumbai', 'Ambuja Cement Ahmedabad', 'ACC Cement Bengaluru', 'Shree Cement Kolkata', 'Dalmia Cement Chennai', 'Ramco Cement Rajkot', 'India Cements Madras', 'JK Cement Noida']
const STATUSES = ['ISI Mark Verified', 'BIS Tested', 'In Transit Bulk', 'Silo Stored', 'Pending E-Way Bill', 'Awaiting Site Delivery']
const CITIES = ['Mumbai', 'Delhi NCR', 'Chennai', 'Kolkata', 'Bangalore', 'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow']
const GRADES = ['53', '43', 'PPC', 'RMC-M25']
const COLORS = ['#b45309', '#92400e', '#d97706', '#f59e0b', '#fbbf24', '#78350f', '#451a03', '#fffbeb']

function ri(min: number, max: number, value: number) {
  return Math.max(min, Math.min(max, value))
}


const materialRecords = [
  { id: 'CBM-0001', material: 'OPC 53 Grade Cement', description: 'OPC 53 Grade cement for NHAI Delhi-Mumbai Expressway Package-4 bridge pier construction in Gujarat stretch', manufacturer: 'UltraTech Cement Mumbai', quantity: 2500, unit: 'bags', move_status: 'ISI Mark Verified', lot: 'LOT-CBM-1001', destination: 'Ahmedabad', received: '2026-07-12', batch: 'CBM-B2026-0712', cost_inr: 1875000, weight_mt: 125.0, grade: '53' },
  { id: 'CBM-0002', material: 'PPC Cement', description: 'PPC cement for Pune Smart City Mission affordable housing block foundation and plastering work', manufacturer: 'Ambuja Cement Ahmedabad', quantity: 3200, unit: 'bags', move_status: 'In Transit Bulk', lot: 'LOT-CBM-1002', destination: 'Pune', received: '2026-07-11', batch: 'CBM-B2026-0711', cost_inr: 2240000, weight_mt: 160.0, grade: 'PPC' },
  { id: 'CBM-0003', material: 'Ready Mix Concrete RMC', description: 'RMC M25 grade for Bangalore Namma Metro Phase-3 underground station slab casting at Indiranagar', manufacturer: 'ACC Cement Bengaluru', quantity: 85, unit: 'm3', move_status: 'BIS Tested', lot: 'LOT-CBM-1003', destination: 'Bangalore', received: '2026-07-10', batch: 'CBM-B2026-0710', cost_inr: 3400000, weight_mt: 204.0, grade: 'RMC-M25' },
  { id: 'CBM-0004', material: 'Fly Ash Bricks', description: 'Fly ash bricks for Chennai Smart City integrated command control center construction at T Nagar', manufacturer: 'Shree Cement Kolkata', quantity: 45000, unit: 'bricks', move_status: 'Silo Stored', lot: 'LOT-CBM-1004', destination: 'Chennai', received: '2026-07-09', batch: 'CBM-B2026-0709', cost_inr: 675000, weight_mt: 90.0, grade: 'PPC' },
  { id: 'CBM-0005', material: 'AAC Blocks', description: 'AAC blocks for Hyderabad Pharma City biotech lab partition wall and external cladding work', manufacturer: 'Dalmia Cement Chennai', quantity: 12000, unit: 'bricks', move_status: 'Awaiting Site Delivery', lot: 'LOT-CBM-1005', destination: 'Hyderabad', received: '2026-07-08', batch: 'CBM-B2026-0708', cost_inr: 1440000, weight_mt: 48.0, grade: '43' },
  { id: 'CBM-0006', material: 'River Sand', description: 'River sand for Lucknow Defence Corridor ordnance factory boundary wall and road construction', manufacturer: 'Ramco Cement Rajkot', quantity: 320, unit: 'm3', move_status: 'Pending E-Way Bill', lot: 'LOT-CBM-1006', destination: 'Lucknow', received: '2026-07-07', batch: 'CBM-B2026-0707', cost_inr: 640000, weight_mt: 512.0, grade: '53' },
  { id: 'CBM-0007', material: 'Aggregates 20mm', description: '20mm aggregates for Kolkata East-West Metro tunnel lining segment casting at Howrah yard', manufacturer: 'India Cements Madras', quantity: 180, unit: 'tons', move_status: 'ISI Mark Verified', lot: 'LOT-CBM-1007', destination: 'Kolkata', received: '2026-07-06', batch: 'CBM-B2026-0706', cost_inr: 1260000, weight_mt: 180.0, grade: 'RMC-M25' },
  { id: 'CBM-0008', material: 'White Cement', description: 'White cement for Jaipur Smart City heritage facade restoration and Johari Bazaar beautification', manufacturer: 'JK Cement Noida', quantity: 800, unit: 'bags', move_status: 'In Transit Bulk', lot: 'LOT-CBM-1008', destination: 'Jaipur', received: '2026-07-05', batch: 'CBM-B2026-0705', cost_inr: 1120000, weight_mt: 40.0, grade: '43' },
  { id: 'CBM-0009', material: 'OPC 53 Grade Cement', description: 'OPC 53 cement for Mumbai Trans-Harbour Link Atal Setu approach ramp and toll plaza work', manufacturer: 'UltraTech Cement Mumbai', quantity: 5000, unit: 'bags', move_status: 'BIS Tested', lot: 'LOT-CBM-1009', destination: 'Mumbai', received: '2026-07-04', batch: 'CBM-B2026-0704', cost_inr: 3750000, weight_mt: 250.0, grade: '53' },
  { id: 'CBM-0010', material: 'PPC Cement', description: 'PPC cement for Navi Mumbai International Airport terminal 1 runway apron and taxiway concrete work', manufacturer: 'Ambuja Cement Ahmedabad', quantity: 8000, unit: 'bags', move_status: 'Silo Stored', lot: 'LOT-CBM-1010', destination: 'Mumbai', received: '2026-07-03', batch: 'CBM-B2026-0703', cost_inr: 5600000, weight_mt: 400.0, grade: 'PPC' },
  { id: 'CBM-0011', material: 'Ready Mix Concrete RMC', description: 'RMC M25 for Delhi NCR Central Vista new Parliament building boundary wall and landscaping', manufacturer: 'ACC Cement Bengaluru', quantity: 120, unit: 'm3', move_status: 'Awaiting Site Delivery', lot: 'LOT-CBM-1011', destination: 'Delhi NCR', received: '2026-07-02', batch: 'CBM-B2026-0702', cost_inr: 4800000, weight_mt: 288.0, grade: 'RMC-M25' },
  { id: 'CBM-0012', material: 'River Sand', description: 'River sand for Ahmedabad Sabarmati Riverfront Phase-2 promenade and commercial complex', manufacturer: 'Shree Cement Kolkata', quantity: 450, unit: 'm3', move_status: 'Pending E-Way Bill', lot: 'LOT-CBM-1012', destination: 'Ahmedabad', received: '2026-07-01', batch: 'CBM-B2026-0701', cost_inr: 900000, weight_mt: 720.0, grade: '53' },
  { id: 'CBM-0013', material: 'Aggregates 20mm', description: '20mm aggregates for Dedicated Freight Corridor Western Rail ballastless track sub-grade', manufacturer: 'Dalmia Cement Chennai', quantity: 600, unit: 'tons', move_status: 'ISI Mark Verified', lot: 'LOT-CBM-1013', destination: 'Delhi NCR', received: '2026-06-30', batch: 'CBM-B2026-0630', cost_inr: 4200000, weight_mt: 600.0, grade: 'RMC-M25' },
  { id: 'CBM-0014', material: 'Fly Ash Bricks', description: 'Fly ash bricks for Pradhan Mantri Awas Yojana PMAY-G pucca houses in Lucknow rural blocks', manufacturer: 'Ramco Cement Rajkot', quantity: 75000, unit: 'bricks', move_status: 'In Transit Bulk', lot: 'LOT-CBM-1014', destination: 'Lucknow', received: '2026-06-29', batch: 'CBM-B2026-0629', cost_inr: 1125000, weight_mt: 150.0, grade: 'PPC' },
  { id: 'CBM-0015', material: 'AAC Blocks', description: 'AAC blocks for Bangalore BMRCL Metro Silver Line depot building and staff quarters', manufacturer: 'India Cements Madras', quantity: 20000, unit: 'bricks', move_status: 'Silo Stored', lot: 'LOT-CBM-1015', destination: 'Bangalore', received: '2026-06-28', batch: 'CBM-B2026-0628', cost_inr: 2400000, weight_mt: 80.0, grade: '43' },
  { id: 'CBM-0016', material: 'White Cement', description: 'White cement for Noida Jewar Airport terminal facade and interior architectural finishes', manufacturer: 'JK Cement Noida', quantity: 1500, unit: 'bags', move_status: 'BIS Tested', lot: 'LOT-CBM-1016', destination: 'Delhi NCR', received: '2026-06-27', batch: 'CBM-B2026-0627', cost_inr: 2100000, weight_mt: 75.0, grade: '43' },
  { id: 'CBM-0017', material: 'OPC 53 Grade Cement', description: 'OPC 53 for NH-48 six-laning Vadodara-Kim expressway overbridge pier and deck slab', manufacturer: 'UltraTech Cement Mumbai', quantity: 4200, unit: 'bags', move_status: 'Awaiting Site Delivery', lot: 'LOT-CBM-1017', destination: 'Ahmedabad', received: '2026-06-26', batch: 'CBM-B2026-0626', cost_inr: 3150000, weight_mt: 210.0, grade: '53' },
  { id: 'CBM-0018', material: 'PPC Cement', description: 'PPC cement for Chennai Port-Maduravoyal elevated corridor pillar construction and road deck', manufacturer: 'Ambuja Cement Ahmedabad', quantity: 6000, unit: 'bags', move_status: 'Pending E-Way Bill', lot: 'LOT-CBM-1018', destination: 'Chennai', received: '2026-06-25', batch: 'CBM-B2026-0625', cost_inr: 4200000, weight_mt: 300.0, grade: 'PPC' },
  { id: 'CBM-0019', material: 'Ready Mix Concrete RMC', description: 'RMC M25 for L&T Hyderabad Metro Pier 78-82 segmental launching at Raidurg stretch', manufacturer: 'ACC Cement Bengaluru', quantity: 95, unit: 'm3', move_status: 'In Transit Bulk', lot: 'LOT-CBM-1019', destination: 'Hyderabad', received: '2026-06-24', batch: 'CBM-B2026-0624', cost_inr: 3800000, weight_mt: 228.0, grade: 'RMC-M25' },
  { id: 'CBM-0020', material: 'River Sand', description: 'River sand for Mumbai Coastal Road tunnel underpass waterproofing and backfill operations', manufacturer: 'Shree Cement Kolkata', quantity: 280, unit: 'm3', move_status: 'ISI Mark Verified', lot: 'LOT-CBM-1020', destination: 'Mumbai', received: '2026-06-23', batch: 'CBM-B2026-0623', cost_inr: 560000, weight_mt: 448.0, grade: '53' },
]

const genRecords = (start: number) => {
  const statuses = STATUSES
  const manufacturers = MANUFACTURERS
  return Array.from({ length: 20 }, (_, i) => ({
    id: `CBM-${String(start + i).padStart(4, '0')}`,
    material: MATERIALS[(start + i) % 8],
    description: `${MATERIALS[(start + i) % 8]} supply for infrastructure batch ${String((start + i) % 99 + 1).padStart(3, '0')}`,
    manufacturer: manufacturers[(start + i) % 8],
    quantity: Math.round(10 + Math.random() * 1000),
    unit: ['bags', 'tons', 'm3', 'bricks'][i % 4],
    move_status: statuses[(start + i) % 6],
    lot: `LOT-CBM-${String(1000 + start + i).padStart(4, '0')}`,
    destination: CITIES[(start + i) % 10],
    received: `2026-07-${String(20 - Math.floor((start + i) / 10)).padStart(2, '0')}`,
    batch: `CBM-B2026-${String(710 - Math.floor((start + i) / 3)).padStart(4, '0')}`,
    cost_inr: Math.round(100000 + Math.random() * 6000000),
    weight_mt: Math.round((5 + Math.random() * 100) * 10) / 10,
    grade: GRADES[(start + i) % 4],
  }))
}

const allMaterial = [...materialRecords, ...genRecords(21), ...genRecords(41)]

const filterGroups = [
  {
    key: 'material',
    label: 'Material Type',
    options: MATERIALS.map(m => ({ label: m, value: m, count: allMaterial.filter(r => r.material === m).length })),
  },
  {
    key: 'move_status',
    label: 'Status',
    options: STATUSES.map(s => ({ label: s, value: s, count: allMaterial.filter(r => r.move_status === s).length })),
  },
  {
    key: 'manufacturer',
    label: 'Manufacturer',
    options: MANUFACTURERS.map(m => ({ label: m, value: m, count: allMaterial.filter(r => r.manufacturer === m).length })),
  },
]

function MaterialBadge({ material }: { material: string }) {
  return <span className="cbm-badge inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium" style={{ background: COLORS[0], color: '#fff' }}>{material}</span>
}

function StatusBadge({ status }: { status: string }) {
  const c = status === 'ISI Mark Verified' ? '#16a34a' : status === 'In Transit Bulk' ? '#2563eb' : status === 'Silo Stored' ? '#d97706' : status === 'Pending E-Way Bill' ? '#dc2626' : '#6b7280'
  return <span className="cbm-status-badge inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ background: c + '22', color: c, border: `1px solid ${c}44` }}>{status}</span>
}

function CostBar({ cost }: { cost: number }) {
  const pct = ri(0, 100, (cost / 6000000) * 100)
  return <div className="cbm-cost-bar flex items-center gap-2"><div className="h-2 w-20 rounded-full bg-gray-200"><div className="h-2 rounded-full transition-all" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${COLORS[1]}, ${COLORS[0]})` }} /></div><span className="text-xs text-gray-500">{'\u20B9' + (cost / 10000000).toFixed(1) + 'Cr'}</span></div>
}

function HealthRing({ value, label, color }: { value: number; label: string; color: string }) {
  const r = 28, cx = 35, cy = 35, sw = 5
  const circ = 2 * Math.PI * r
  const offset = circ - (ri(0, 100, value) / 100) * circ
  return (
    <div className="cbm-health-ring flex flex-col items-center"><svg width={70} height={70} className="-rotate-90"><circle cx={cx} cy={cy} r={r} fill="none" stroke="#e5e7eb" strokeWidth={sw} /><circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={sw} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" /></svg><span className="mt-1 text-sm font-bold" style={{ color }}>{value}%</span><span className="text-xs text-gray-500">{label}</span></div>
  )
}

function KpiTile({ title, value, sub }: { title: string; value: string; sub: string }) {
  return (
    <Card className="cbm-kpi-card"><CardContent className="p-4"><p className="text-xs text-gray-500">{title}</p><p className="cbm-kpi-value mt-1 text-2xl font-bold" style={{ color: COLORS[0] }}>{value}</p><p className="text-xs text-gray-400 mt-0.5">{sub}</p></CardContent></Card>
  )
}

function ValueTile({ title, value, trend }: { title: string; value: string; trend: string }) {
  const up = trend.startsWith('+')
  return (
    <Card className="cbm-value-tile"><CardContent className="p-4"><p className="text-xs text-gray-500">{title}</p><p className="mt-1 text-xl font-bold">{value}</p><p className={`text-xs mt-0.5 ${up ? 'text-green-600' : 'text-red-500'}`}>{trend}</p></CardContent></Card>
  )
}


export default function CementBuildingMaterialsView() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})

  const filtered = useMemo(() => {
    return allMaterial.filter(r => {
      const q = searchQuery.toLowerCase()
      if (q && !r.id.toLowerCase().includes(q) && !r.material.toLowerCase().includes(q) && !r.description.toLowerCase().includes(q) && !r.manufacturer.toLowerCase().includes(q) && !r.destination.toLowerCase().includes(q)) return false
      return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(String(r[key as keyof typeof r])))
    })
  }, [searchQuery, activeFilters])

  const totalCost = allMaterial.reduce((s, r) => s + r.cost_inr, 0)
  const totalWeight = allMaterial.reduce((s, r) => s + r.weight_mt, 0)
  const isiVerified = allMaterial.filter(r => r.move_status === 'ISI Mark Verified').length
  const bisTested = allMaterial.filter(r => r.move_status === 'BIS Tested').length

  const pieData = STATUSES.map(s => ({ name: s, value: allMaterial.filter(r => r.move_status === s).length }))
  const barData = MATERIALS.slice(0, 6).map(m => ({ name: m.split(' ')[0], cost: allMaterial.filter(r => r.material === m).reduce((a, r) => a + r.cost_inr, 0) / 10000000 }))
  const lineData = MATERIALS.slice(0, 6).map(m => ({ name: m.split(' ')[0], weight: allMaterial.filter(r => r.material === m).reduce((a, r) => a + r.weight_mt, 0) }))

  const tabs = [
    { value: 'dashboard', label: 'Dashboard' },
    { value: 'shipments', label: 'Shipments' },
    { value: 'analytics', label: 'Analytics' },
    { value: 'insights', label: 'Insights' },
  ]

  return (
    <div className="cbm-container space-y-4">
      <PageHeader title="Cement & Building Materials Logistics" description="Track cement, RMC, bricks, sand, and aggregate shipments across Indian infrastructure projects with ISI and BIS certification compliance" />
      <ModuleBreadcrumb items={[{ label: 'Supply Chain' }, { label: 'Cement & Building Materials' }]} />
      <Tabs defaultValue="dashboard">
        <TabsList className="cbm-tabs-list">
          {tabs.map(t => <TabsTrigger key={t.value} value={t.value} className="cbm-tab-trigger">{t.label}</TabsTrigger>)}
        </TabsList>

        <TabsContent value="dashboard" className="cbm-tab-content space-y-4 mt-4">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <KpiTile title="Total Shipments" value={allMaterial.length.toString()} sub="Material consignments" />
            <KpiTile title="Total Value" value={`\u20B9${(totalCost / 10000000).toFixed(0)}Cr`} sub="Cargo value in INR" />
            <KpiTile title="ISI Verified" value={isiVerified.toString()} sub={`${((isiVerified / allMaterial.length) * 100).toFixed(0)}% verified`} />
            <KpiTile title="BIS Tested" value={bisTested.toString()} sub={`${((bisTested / allMaterial.length) * 100).toFixed(0)}% tested`} />
          </div>
          <div className="grid gap-4 grid-cols-3 md:grid-cols-6">
            <HealthRing value={94} label="ISI Compliance" color="#16a34a" />
            <HealthRing value={82} label="Transit OTP" color="#2563eb" />
            <HealthRing value={76} label="Silo Capacity" color="#d97706" />
            <HealthRing value={61} label="E-Way Clear" color="#b45309" />
            <HealthRing value={88} label="Grade Match" color="#92400e" />
            <HealthRing value={73} label="Site Delivery" color="#78350f" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Top Material Types</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2"><MaterialBadge material="OPC 53 Grade Cement" /><MaterialBadge material="PPC Cement" /></div>
                <ValueTile title="Avg Cost per Shipment" value={`\u20B9${Math.round(totalCost / allMaterial.length).toLocaleString('en-IN')}`} trend="+4.8% vs Q1" />
                <ValueTile title="Avg Weight per Lot" value={`${(totalWeight / allMaterial.length).toFixed(1)} MT`} trend="+2.6% vs Q1" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Shipment Cost Overview</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 mb-1"><StatusBadge status="ISI Mark Verified" /></div>
                <CostBar cost={totalCost / 3} />
                <ValueTile title="Highest Cost" value={`\u20B9${Math.max(...allMaterial.map(r => r.cost_inr)).toLocaleString('en-IN')}`} trend="CBM-0001" />
                <ValueTile title="Pending E-Way" value={`\u20B9${allMaterial.filter(r => r.move_status === 'Pending E-Way Bill').reduce((a, r) => a + r.cost_inr, 0).toLocaleString('en-IN')}`} trend="-1.9% vs Q1" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="shipments" className="cbm-tab-content space-y-4 mt-4">
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups}
            onToggleFilter={(key, val) => setActiveFilters(p => ({ ...p, [key]: p[key]?.includes(val) ? p[key].filter(v => v !== val) : [...(p[key] || []), val] }))} onClearAllFilters={() => setActiveFilters({})} totalItems={allMaterial.length} filteredCount={filtered.length} onRefresh={() => {}} placeholder="Search by ID, material, manufacturer, destination, or lot..." />
          <div className="overflow-x-auto rounded-lg border">
            <table className="cbm-table w-full text-sm">
              <thead><tr className="cbm-table-header bg-gray-50">
                <th className="px-3 py-2 text-left font-medium">ID</th><th className="px-3 py-2 text-left font-medium">Material</th><th className="px-3 py-2 text-left font-medium">Status</th><th className="px-3 py-2 text-left font-medium">Qty</th><th className="px-3 py-2 text-left font-medium">Cost</th><th className="px-3 py-2 text-left font-medium">Manufacturer</th><th className="px-3 py-2 text-left font-medium">Destination</th><th className="px-3 py-2 text-left font-medium">Lot</th><th className="px-3 py-2 text-left font-medium">Grade</th>
              </tr></thead>
              <tbody>{filtered.slice(0, 20).map(r => (
                <tr key={r.id} className="cbm-table-row border-t hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-2 font-mono text-xs">{r.id}</td>
                  <td className="px-3 py-2"><MaterialBadge material={r.material} /></td>
                  <td className="px-3 py-2"><StatusBadge status={r.move_status} /></td>
                  <td className="px-3 py-2 text-xs">{r.quantity.toLocaleString('en-IN')} {r.unit}</td>
                  <td className="px-3 py-2"><CostBar cost={r.cost_inr} /></td>
                  <td className="px-3 py-2 text-xs">{r.manufacturer}</td>
                  <td className="px-3 py-2 text-xs">{r.destination}</td>
                  <td className="px-3 py-2 text-xs font-mono">{r.lot}</td>
                  <td className="px-3 py-2 text-xs">{r.grade}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="cbm-tab-content space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="cbm-chart-card">
              <CardHeader className="pb-2"><CardTitle className="text-sm">Status Distribution</CardTitle></CardHeader><CardContent><PieChart width={300} height={200}><Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>{pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></CardContent>
            </Card>
            <Card className="cbm-chart-card">
              <CardHeader className="pb-2"><CardTitle className="text-sm">Cost by Material Type (Cr)</CardTitle></CardHeader><CardContent><BarChart width={300} height={200} data={barData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={10} angle={-30} textAnchor="end" height={50} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="cost" fill={COLORS[0]} radius={[4,4,0,0]} /></BarChart></CardContent>
            </Card>
            <Card className="cbm-chart-card">
              <CardHeader className="pb-2"><CardTitle className="text-sm">Weight by Material (MT)</CardTitle></CardHeader><CardContent><LineChart width={300} height={200} data={lineData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={10} /><YAxis fontSize={12} /><Tooltip /><Legend /><Line type="monotone" dataKey="weight" stroke={COLORS[1]} strokeWidth={2} /></LineChart></CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="cbm-tab-content space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="cbm-insight-card hover:shadow-md transition-shadow">
              <CardHeader><CardTitle className="text-sm" style={{ color: COLORS[0] }}>BIS IS 269 OPC Cement Certification {'&'} NABL Lab Testing</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Bureau of Indian Standards IS 269 specification governs ordinary Portland cement 33, 43, and 53 grade quality parameters. NABL accredited laboratories conduct compressive strength, fineness, and setting time tests. All OPC cement bags must display the ISI certification mark and BIS license number as per Cement (Quality Control) Order 2023, ensuring structural safety compliance for Indian construction projects.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-green-800">Regulatory</span><span className="text-gray-400">Mandatory</span></div></CardContent>
            </Card>
            <Card className="cbm-insight-card hover:shadow-md transition-shadow">
              <CardHeader><CardTitle className="text-sm" style={{ color: COLORS[0] }}>NHAI e-Marg {'&'} Smart City Material Procurement</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>National Highways Authority of India e-Marg portal and Smart City Mission GeM procurement portal mandate electronic bidding for cement and building material procurement above {'\u20B925 lakhs'}. Real-time tracking of material dispatch from cement plants to NHAI and Smart City project sites ensures transparency. E-procurement integration with GST e-invoice and e-Way bill systems streamlines logistics documentation.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-amber-800">Strategic</span><span className="text-gray-400">Live</span></div></CardContent>
            </Card>
            <Card className="cbm-insight-card hover:shadow-md transition-shadow">
              <CardHeader><CardTitle className="text-sm" style={{ color: COLORS[0] }}>GST Rate Rationalization {'&'} Sand Mining EC</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>GST rate rationalization on cement currently at 28% with potential reduction to 18% under review. Sand mining requires State Environmental Clearance (EC) under EIA Notification 2006 and mining lease from District Mineral Foundation (DMF). River sand transportation across state borders attracts IGST and mineral royalty, impacting aggregate cost by 15-20% for construction logistics.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-blue-800">Logistics</span><span className="text-gray-400">Active</span></div></CardContent>
            </Card>
            <Card className="cbm-insight-card hover:shadow-md transition-shadow">
              <CardHeader><CardTitle className="text-sm" style={{ color: COLORS[0] }}>AI Demand Forecasting Delhi-Mumbai Expressway</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Machine learning demand forecasting models optimize cement and RMC supply for Delhi-Mumbai Expressway 1386 km corridor and Navi Mumbai International Airport project. LSTM networks analyze historical procurement patterns predicting material requirements 90 days ahead. Predictive analytics reduce cement inventory holding costs by 22% while maintaining 99.2% material availability for critical path construction schedules.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-purple-100 px-2 py-0.5 text-purple-800">Innovation</span><span className="text-gray-400">Pilot</span></div></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
