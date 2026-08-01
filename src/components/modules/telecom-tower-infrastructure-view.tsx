import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const EQUIPMENT_TYPES = ['Ground-Based Tower 40M', 'Rooftop Pole 10M', 'Monopole 25M', '5G Small Cell DAS', 'Fiber Cabinet ODF', 'Battery Backup 48V', 'Microwave Antenna', 'GPS Sync Module']
const OEMS = ['Indus Towers Noida', 'Vihaan Networks Delhi', 'Jio Tower Mumbai', 'Airtel Tower Bengaluru', 'American Tower Chennai', 'GTL Infra Hyderabad', 'Tower Vision Kolkata', 'Bharti Infratel Pune']
const STATUSES = ['TRAI Certified', 'Site Survey Done', 'In Transit Rigging', 'Tower Erected', 'Pending DOT Approval', 'Awaiting RF Commissioning']
const CITIES = ['New Delhi', 'Mumbai', 'Bengaluru', 'Chennai', 'Hyderabad', 'Kolkata', 'Pune', 'Jaipur', 'Lucknow', 'Bhopal']
const COLORS = ['#7c3aed', '#6d28d9', '#8b5cf6', '#a78bfa', '#c4b5fd', '#5b21b6', '#4c1d95', '#ede9fe']

function ri(min: number, max: number, value: number) { return Math.max(min, Math.min(max, value)) }

function HealthRing({ value, label, color }: { value: number; label: string; color: string }) {
  const r = 28, c = 2 * Math.PI * r
  return (
    <div className="tti-health-ring flex flex-col items-center gap-1">
      <svg width="72" height="72" viewBox="0 0 72 72"><circle cx="36" cy="36" r={r} fill="none" stroke="#e5e7eb" strokeWidth="6" /><circle cx="36" cy="36" r={r} fill="none" stroke={color} strokeWidth="6" strokeDasharray={c} strokeDashoffset={c - (c * value) / 100} strokeLinecap="round" transform="rotate(-90 36 36)" /></svg>
      <span className="text-xs font-semibold" style={{ color }}>{value}%</span>
      <span className="text-[10px] text-gray-500">{label}</span>
    </div>
  )
}

function EquipBadge({ type }: { type: string }) {
  const idx = EQUIPMENT_TYPES.indexOf(type)
  return <span className="tti-equip-badge inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium text-white" style={{ backgroundColor: COLORS[idx >= 0 ? idx % 8 : 0] }}>{type}</span>
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = { 'TRAI Certified': '#16a34a', 'Site Survey Done': '#2563eb', 'In Transit Rigging': '#f59e0b', 'Tower Erected': '#7c3aed', 'Pending DOT Approval': '#ef4444', 'Awaiting RF Commissioning': '#6366f1' }
  return <span className="tti-status-badge inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium text-white" style={{ backgroundColor: colors[status] || '#6b7280' }}>{status}</span>
}

function CostBar({ cost }: { cost: number }) {
  const pct = ri(0, 100, (cost / 8000000) * 100)
  return <div className="tti-cost-bar w-full h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: '#7c3aed' }} /></div>
}

function KpiTile({ title, value, sub }: { title: string; value: string; sub: string }) {
  return <Card className="tti-kpi-tile"><CardContent className="p-4"><p className="text-xs text-gray-500">{title}</p><p className="text-xl font-bold" style={{ color: '#7c3aed' }}>{value}</p><p className="text-[10px] text-gray-400 mt-1">{sub}</p></CardContent></Card>
}

function ValueTile({ label, value }: { label: string; value: string }) {
  return <div className="tti-value-tile rounded-lg p-3" style={{ backgroundColor: '#ede9fe' }}><p className="text-[10px] text-gray-500">{label}</p><p className="text-sm font-semibold" style={{ color: '#4c1d95' }}>{value}</p></div>
}

const equipRecords = [
  { id: 'TTI-0001', equipment: 'Ground-Based Tower 40M', description: '40M lattice tower for Jio 4G rural rollout covering Varanasi and Lucknow districts in UP East', oem: 'Jio Tower Mumbai', quantity: 15, unit: 'towers', move_status: 'TRAI Certified', lot: 'LOT-TTI-1001', destination: 'Lucknow', received: '2026-07-15', batch: 'TTI-B2026-0710', cost_inr: 4500000, weight_mt: 22.5, height_m: 40 },
  { id: 'TTI-0002', equipment: '5G Small Cell DAS', description: '5G DAS units for Airtel mmWave deployment in Bengaluru Electronic City tech corridor', oem: 'Airtel Tower Bengaluru', quantity: 48, unit: 'modules', move_status: 'Tower Erected', lot: 'LOT-TTI-1002', destination: 'Bengaluru', received: '2026-07-14', batch: 'TTI-B2026-0709', cost_inr: 6800000, weight_mt: 2.4, height_m: 5 },
  { id: 'TTI-0003', equipment: 'Monopole 25M', description: '25M monopole for BSNL 4G upgradation under rural connectivity scheme in MP tribal blocks', oem: 'GTL Infra Hyderabad', quantity: 8, unit: 'poles', move_status: 'Site Survey Done', lot: 'LOT-TTI-1003', destination: 'Bhopal', received: '2026-07-13', batch: 'TTI-B2026-0708', cost_inr: 3200000, weight_mt: 12.8, height_m: 25 },
  { id: 'TTI-0004', equipment: 'Fiber Cabinet ODF', description: 'ODF fiber cabinets for Jio Fiber FTTH rollout in Navi Mumbai residential complexes with GPON', oem: 'Indus Towers Noida', quantity: 30, unit: 'cabinets', move_status: 'In Transit Rigging', lot: 'LOT-TTI-1004', destination: 'Mumbai', received: '2026-07-12', batch: 'TTI-B2026-0707', cost_inr: 2400000, weight_mt: 6.0, height_m: 2.2 },
  { id: 'TTI-0005', equipment: '5G Small Cell DAS', description: 'DAS small cell nodes for Vihaan 5G indoor coverage at Delhi Metro stations and Connaught Place', oem: 'Vihaan Networks Delhi', quantity: 60, unit: 'modules', move_status: 'Pending DOT Approval', lot: 'LOT-TTI-1005', destination: 'New Delhi', received: '2026-07-11', batch: 'TTI-B2026-0706', cost_inr: 7200000, weight_mt: 3.6, height_m: 5 },
  { id: 'TTI-0006', equipment: 'Microwave Antenna', description: 'Microwave backhaul antenna for Indus Towers inter-tower link spanning Thar Desert relay', oem: 'Indus Towers Noida', quantity: 24, unit: 'modules', move_status: 'Awaiting RF Commissioning', lot: 'LOT-TTI-1006', destination: 'Jaipur', received: '2026-07-10', batch: 'TTI-B2026-0705', cost_inr: 5600000, weight_mt: 4.8, height_m: 8 },
  { id: 'TTI-0007', equipment: 'Battery Backup 48V', description: '48V Li-ion battery systems for GTL Infra tower sites in Northeast India 8-hour backup', oem: 'GTL Infra Hyderabad', quantity: 40, unit: 'cabinets', move_status: 'TRAI Certified', lot: 'LOT-TTI-1007', destination: 'Kolkata', received: '2026-07-09', batch: 'TTI-B2026-0704', cost_inr: 1800000, weight_mt: 8.0, height_m: 1.8 },
  { id: 'TTI-0008', equipment: 'Rooftop Pole 10M', description: '10M rooftop poles for American Tower Chennai 4G colocation Anna Nagar and T Nagar areas', oem: 'American Tower Chennai', quantity: 20, unit: 'poles', move_status: 'Tower Erected', lot: 'LOT-TTI-1008', destination: 'Chennai', received: '2026-07-08', batch: 'TTI-B2026-0703', cost_inr: 1600000, weight_mt: 4.5, height_m: 10 },
  { id: 'TTI-0009', equipment: 'GPS Sync Module', description: 'GPS timing sync modules for Bharti Infratel LTE TDD network sync across Pune PCMC region', oem: 'Bharti Infratel Pune', quantity: 35, unit: 'modules', move_status: 'In Transit Rigging', lot: 'LOT-TTI-1009', destination: 'Pune', received: '2026-07-07', batch: 'TTI-B2026-0702', cost_inr: 1400000, weight_mt: 1.2, height_m: 0.5 },
  { id: 'TTI-0010', equipment: 'Ground-Based Tower 40M', description: '40M self-supporting tower for Tower Vision Kolkata 5G macro site along EM Bypass corridor', oem: 'Tower Vision Kolkata', quantity: 6, unit: 'towers', move_status: 'Site Survey Done', lot: 'LOT-TTI-1010', destination: 'Kolkata', received: '2026-07-06', batch: 'TTI-B2026-0701', cost_inr: 5100000, weight_mt: 24.0, height_m: 40 },
  { id: 'TTI-0011', equipment: '5G Small Cell DAS', description: 'TRAI certified 5G small cell for Mumbai suburban railway corridor Virar to Churchgate line', oem: 'Jio Tower Mumbai', quantity: 55, unit: 'modules', move_status: 'TRAI Certified', lot: 'LOT-TTI-1011', destination: 'Mumbai', received: '2026-07-05', batch: 'TTI-B2026-0700', cost_inr: 7800000, weight_mt: 3.3, height_m: 5 },
  { id: 'TTI-0012', equipment: 'Fiber Cabinet ODF', description: 'Fiber ODF cabinets for BSNL BharatNet Phase-3 GPON in Lucknow and Kanpur rural blocks', oem: 'GTL Infra Hyderabad', quantity: 22, unit: 'cabinets', move_status: 'Pending DOT Approval', lot: 'LOT-TTI-1012', destination: 'Lucknow', received: '2026-07-04', batch: 'TTI-B2026-0699', cost_inr: 2100000, weight_mt: 5.5, height_m: 2.0 },
  { id: 'TTI-0013', equipment: 'Monopole 25M', description: '25M camouflaged monopole for Jio Tower 5G SA site near Sardar Patel Stadium Ahmedabad', oem: 'Jio Tower Mumbai', quantity: 10, unit: 'poles', move_status: 'Tower Erected', lot: 'LOT-TTI-1013', destination: 'Jaipur', received: '2026-07-03', batch: 'TTI-B2026-0698', cost_inr: 4800000, weight_mt: 15.2, height_m: 25 },
  { id: 'TTI-0014', equipment: 'Ground-Based Tower 40M', description: '40M tower for Airtel rural 4G expansion in backward Bundelkhand districts under USOF scheme', oem: 'Airtel Tower Bengaluru', quantity: 12, unit: 'towers', move_status: 'In Transit Rigging', lot: 'LOT-TTI-1014', destination: 'Bhopal', received: '2026-07-02', batch: 'TTI-B2026-0697', cost_inr: 5200000, weight_mt: 26.0, height_m: 40 },
  { id: 'TTI-0015', equipment: 'Microwave Antenna', description: 'High-capacity microwave for DOT pending spectrum sharing link Chennai to Mahabalipuram stretch', oem: 'American Tower Chennai', quantity: 18, unit: 'modules', move_status: 'Pending DOT Approval', lot: 'LOT-TTI-1015', destination: 'Chennai', received: '2026-07-01', batch: 'TTI-B2026-0696', cost_inr: 4100000, weight_mt: 3.6, height_m: 8 },
  { id: 'TTI-0016', equipment: 'Rooftop Pole 10M', description: '10M stealth rooftop poles for Airtel 5G DAS in Bengaluru Whitefield IT park complex', oem: 'Airtel Tower Bengaluru', quantity: 28, unit: 'poles', move_status: 'Awaiting RF Commissioning', lot: 'LOT-TTI-1016', destination: 'Bengaluru', received: '2026-06-30', batch: 'TTI-B2026-0695', cost_inr: 2800000, weight_mt: 5.0, height_m: 10 },
  { id: 'TTI-0017', equipment: 'Ground-Based Tower 40M', description: '40M galvanized tower for Vihaan Networks BSNL 4G upgrade Odisha Kalahandi tribal district', oem: 'Vihaan Networks Delhi', quantity: 9, unit: 'towers', move_status: 'Site Survey Done', lot: 'LOT-TTI-1017', destination: 'Kolkata', received: '2026-06-29', batch: 'TTI-B2026-0694', cost_inr: 3900000, weight_mt: 20.0, height_m: 40 },
  { id: 'TTI-0018', equipment: 'Battery Backup 48V', description: '48V VRLA battery racks for Indus Towers NCR 5G hub in Gurugram and Noida Expressway zone', oem: 'Indus Towers Noida', quantity: 50, unit: 'cabinets', move_status: 'TRAI Certified', lot: 'LOT-TTI-1018', destination: 'New Delhi', received: '2026-06-28', batch: 'TTI-B2026-0693', cost_inr: 2200000, weight_mt: 10.0, height_m: 1.8 },
  { id: 'TTI-0019', equipment: 'GPS Sync Module', description: 'Precision GPS sync for GTL Infra NTP synchronization across Assam telecom circle tower sites', oem: 'GTL Infra Hyderabad', quantity: 32, unit: 'modules', move_status: 'In Transit Rigging', lot: 'LOT-TTI-1019', destination: 'Hyderabad', received: '2026-06-27', batch: 'TTI-B2026-0692', cost_inr: 1300000, weight_mt: 1.0, height_m: 0.5 },
  { id: 'TTI-0020', equipment: 'Microwave Antenna', description: 'Microwave PtP antennas for American Tower backhaul upgrade in Pune Hinjewadi IT corridor', oem: 'American Tower Chennai', quantity: 16, unit: 'modules', move_status: 'Tower Erected', lot: 'LOT-TTI-1020', destination: 'Pune', received: '2026-06-26', batch: 'TTI-B2026-0691', cost_inr: 3400000, weight_mt: 3.2, height_m: 8 },
]

const genRecords = (start: number) => {
  const statuses = STATUSES
  const oems = OEMS
  return Array.from({ length: 20 }, (_, i) => ({
    id: `TTI-${String(start + i).padStart(4, '0')}`,
    equipment: EQUIPMENT_TYPES[(start + i) % 8],
    description: `${EQUIPMENT_TYPES[(start + i) % 8]} supply for telecom batch ${String((start + i) % 99 + 1).padStart(3, '0')}`,
    oem: oems[(start + i) % 8],
    quantity: Math.round(2 + Math.random() * 50),
    unit: ['towers', 'poles', 'cabinets', 'modules'][i % 4],
    move_status: statuses[(start + i) % 6],
    lot: `LOT-TTI-${String(1000 + start + i).padStart(4, '0')}`,
    destination: CITIES[(start + i) % 10],
    received: `2026-07-${String(20 - Math.floor((start + i) / 10)).padStart(2, '0')}`,
    batch: `TTI-B2026-${String(710 - Math.floor((start + i) / 3)).padStart(4, '0')}`,
    cost_inr: Math.round(200000 + Math.random() * 8000000),
    weight_mt: Math.round((0.5 + Math.random() * 30) * 10) / 10,
    height_m: Math.round((5 + Math.random() * 40) * 10) / 10,
  }))
}
const allEquip = [...equipRecords, ...genRecords(21), ...genRecords(41)]

export default function TelecomTowerInfrastructureView() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const filtered = useMemo(() => {
    let data = allEquip
    if (searchQuery) data = data.filter(r => r.id.toLowerCase().includes(searchQuery.toLowerCase()) || r.equipment.toLowerCase().includes(searchQuery.toLowerCase()) || r.destination.toLowerCase().includes(searchQuery.toLowerCase()))
    Object.entries(activeFilters).forEach(([key, vals]) => { if (vals.length) data = data.filter(r => vals.includes(String(r[key as keyof typeof r]))) })
    return data
  }, [searchQuery, activeFilters])

  const filterGroups = [
    { key: 'move_status', label: 'Status', options: STATUSES.map(s => ({ value: s, label: s, count: allEquip.filter(r => r.move_status === s).length })) },
    { key: 'equipment', label: 'Equipment', options: EQUIPMENT_TYPES.map(e => ({ value: e, label: e, count: allEquip.filter(r => r.equipment === e).length })) },
    { key: 'oem', label: 'OEM', options: OEMS.map(o => ({ value: o, label: o, count: allEquip.filter(r => r.oem === o).length })) },
  ]
  const kpis = { total: allEquip.length, certified: allEquip.filter(r => r.move_status === 'TRAI Certified').length, inTransit: allEquip.filter(r => r.move_status === 'In Transit Rigging').length, totalCost: allEquip.reduce((a, r) => a + r.cost_inr, 0) }
  const statusData = STATUSES.map(s => ({ name: s, count: allEquip.filter(r => r.move_status === s).length }))
  const oemData = OEMS.map(o => ({ name: o.split(' ')[0], value: allEquip.filter(r => r.oem === o).length }))
  const costByDest = CITIES.slice(0, 6).map(c => ({ name: c, cost: Math.round(allEquip.filter(r => r.destination === c).reduce((a, r) => a + r.cost_inr, 0) / 100000) }))

  return (
    <div className="tti-root space-y-4 p-4">
      <ModuleBreadcrumb items={[{ label: 'Modules' }, { label: 'Telecom Tower Infrastructure' }]} />
      <PageHeader title="Telecom Tower Infrastructure Logistics" description="Track telecom tower deployment, equipment logistics and site commissioning across India" />
      <SearchFilterToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onClearSearch={() => setSearchQuery('')}
        activeFilters={activeFilters}
        filterGroups={filterGroups}
        onToggleFilter={(key, val) => setActiveFilters(p => ({ ...p, [key]: p[key]?.includes(val) ? p[key].filter(v => v !== val) : [...(p[key] || []), val] }))}
        onClearAllFilters={() => setActiveFilters({})}
        totalItems={allEquip.length}
        filteredCount={filtered.length}
        onRefresh={() => window.location.reload()}
        placeholder="Search by ID, equipment, destination..."
      />
      <Tabs defaultValue="dashboard">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="deployment">Deployment</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <div className="grid grid-cols-4 gap-3 mb-4">
            <KpiTile title="Total Assets" value={String(kpis.total)} sub="Tower infrastructure items" />
            <KpiTile title="TRAI Certified" value={String(kpis.certified)} sub="Approved for deployment" />
            <KpiTile title="In Transit" value={String(kpis.inTransit)} sub="Rigging & logistics" />
            <KpiTile title="Total Cost" value={`₹${(kpis.totalCost / 10000000).toFixed(1)}Cr`} sub="Combined asset value" />
          </div>
          <div className="flex gap-6 mb-4 justify-center">
            <HealthRing value={Math.round((kpis.certified / kpis.total) * 100)} label="Certified" color="#16a34a" />
            <HealthRing value={Math.round((kpis.inTransit / kpis.total) * 100)} label="In Transit" color="#f59e0b" />
            <HealthRing value={Math.round((allEquip.filter(r => r.move_status === 'Tower Erected').length / kpis.total) * 100)} label="Erected" color="#7c3aed" />
            <HealthRing value={Math.round((allEquip.filter(r => r.move_status === 'Pending DOT Approval').length / kpis.total) * 100)} label="DOT Pending" color="#ef4444" />
            <HealthRing value={Math.round((allEquip.filter(r => r.move_status === 'Awaiting RF Commissioning').length / kpis.total) * 100)} label="RF Pending" color="#6366f1" />
            <HealthRing value={Math.round((allEquip.filter(r => r.move_status === 'Site Survey Done').length / kpis.total) * 100)} label="Surveyed" color="#2563eb" />
          </div>

          <div className="grid grid-cols-4 gap-2 mb-4">
            <ValueTile label="Avg Cost/Unit" value={`₹${Math.round(kpis.totalCost / kpis.total).toLocaleString('en-IN')}`} />
            <ValueTile label="Total Weight" value={`${allEquip.reduce((a, r) => a + r.weight_mt, 0).toFixed(1)} MT`} />
            <ValueTile label="Destinations" value={`${new Set(allEquip.map(r => r.destination)).size} cities`} />
            <ValueTile label="OEM Partners" value={`${new Set(allEquip.map(r => r.oem)).size} vendors`} />
          </div>

          <Card className="tti-table-card">
            <CardHeader className="pb-2"><CardTitle className="text-sm">Recent Deployments</CardTitle></CardHeader>
            <CardContent className="p-3">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead><tr className="tti-table-head border-b text-left text-gray-500">
                    <th className="py-1.5 px-2">ID</th><th className="py-1.5 px-2">Equipment</th><th className="py-1.5 px-2">OEM</th><th className="py-1.5 px-2">Dest</th><th className="py-1.5 px-2">Status</th><th className="py-1.5 px-2">Cost</th>
                  </tr></thead>
                  <tbody>
                  {filtered.slice(0, 10).map(r => (
                    <tr key={r.id} className="tti-table-row border-b hover:bg-violet-50/50">
                      <td className="py-1.5 px-2 font-mono">{r.id}</td>
                      <td className="py-1.5 px-2"><EquipBadge type={r.equipment} /></td>
                      <td className="py-1.5 px-2">{r.oem}</td>
                      <td className="py-1.5 px-2">{r.destination}</td>
                      <td className="py-1.5 px-2"><StatusBadge status={r.move_status} /></td>
                      <td className="py-1.5 px-2"><div className="w-20"><CostBar cost={r.cost_inr} /></div></td>
                    </tr>
                  ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="deployment">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Deployment Registry — {filtered.length} records</CardTitle></CardHeader>
            <CardContent className="p-3">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead><tr className="tti-table-head border-b text-left text-gray-500">
                    <th className="py-1.5 px-2">ID</th><th className="py-1.5 px-2">Equipment</th><th className="py-1.5 px-2">Qty</th><th className="py-1.5 px-2">OEM</th><th className="py-1.5 px-2">Dest</th><th className="py-1.5 px-2">Status</th><th className="py-1.5 px-2">Lot</th><th className="py-1.5 px-2">Batch</th><th className="py-1.5 px-2">Cost (₹)</th><th className="py-1.5 px-2">Wt(MT)</th>
                  </tr></thead>
                  <tbody>
                  {filtered.map(r => (
                    <tr key={r.id} className="tti-table-row border-b hover:bg-violet-50/50">
                      <td className="py-1.5 px-2 font-mono">{r.id}</td>
                      <td className="py-1.5 px-2"><EquipBadge type={r.equipment} /></td>
                      <td className="py-1.5 px-2">{r.quantity} {r.unit}</td>
                      <td className="py-1.5 px-2">{r.oem}</td>
                      <td className="py-1.5 px-2">{r.destination}</td>
                      <td className="py-1.5 px-2"><StatusBadge status={r.move_status} /></td>
                      <td className="py-1.5 px-2">{r.lot}</td>
                      <td className="py-1.5 px-2">{r.batch}</td>
                      <td className="py-1.5 px-2">{r.cost_inr.toLocaleString('en-IN')}</td>
                      <td className="py-1.5 px-2">{r.weight_mt}</td>
                    </tr>
                  ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-3 gap-4">
            <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Status Distribution</CardTitle></CardHeader><CardContent>
              <PieChart width={300} height={220}><Pie data={statusData} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>{statusData.map((_, i) => <Cell key={i} fill={COLORS[i % 8]} />)}</Pie><Tooltip /><Legend /></PieChart>
            </CardContent></Card>
            <Card><CardHeader className="pb-2"><CardTitle className="text-sm">OEM Contributions</CardTitle></CardHeader><CardContent>
              <BarChart width={300} height={220} data={oemData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={10} /><YAxis fontSize={10} /><Tooltip /><Bar dataKey="value" fill="#7c3aed" /></BarChart>
            </CardContent></Card>
            <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Cost by Destination (₹L)</CardTitle></CardHeader><CardContent>
              <LineChart width={300} height={220} data={costByDest}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={10} /><YAxis fontSize={10} /><Tooltip /><Line type="monotone" dataKey="cost" stroke="#6d28d9" strokeWidth={2} /></LineChart>
            </CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="insights">
          <div className="grid grid-cols-2 gap-4">
            <Card className="tti-insight-card"><CardHeader><CardTitle className="text-sm" style={{ color: '#7c3aed' }}>DoT Right-of-Way & Gati Shakti</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-1">
              <p>Department of Telecommunications right-of-way rules mandate streamlined approvals for tower installations along national highways and railway corridors. The PM Gati Shakti National Master Plan portal enables integrated tower site approvals by syncing with state DOTs, NHAI, and railway authorities for faster deployment in tier-2 and tier-3 cities.</p>
            </CardContent></Card>
            <Card className="tti-insight-card"><CardHeader><CardTitle className="text-sm" style={{ color: '#7c3aed' }}>TRAI QoS Norms & 5G Spectrum</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-1">
              <p>TRAI Quality of Service norms mandate minimum tower density of 0.4 towers per sq km for urban 5G rollout. Spectrum allocation via auction requires operators to deploy 80% of allocated sites within 5 years. Tower infrastructure logistics must align with DoT spectrum rollout milestones and coverage obligations under license conditions.</p>
            </CardContent></Card>
            <Card className="tti-insight-card"><CardHeader><CardTitle className="text-sm" style={{ color: '#7c3aed' }}>USOF Rural Connectivity</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-1">
              <p>Universal Service Obligation Fund supports rural tower deployment under the Digital Village Initiative. USOF subsidizes up to 60% of tower installation costs in aspirational districts and LWE-affected areas. Logistics planning must prioritize BharatNet fiber connectivity and VSAT backhaul for remote tower sites in states like Jharkhand, Chhattisgarh and Odisha.</p>
            </CardContent></Card>
            <Card className="tti-insight-card"><CardHeader><CardTitle className="text-sm" style={{ color: '#7c3aed' }}>AI Tower Site Selection</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-1">
              <p>AI-powered tower site selection leverages geospatial analytics, population density heatmaps and RF propagation modeling for optimal tower placement. Machine learning models analyze terrain data, existing coverage gaps and subscriber demand patterns to recommend site locations, reducing deployment costs by 25-30% while maximizing coverage for 4G/5G networks across Indian telecom circles.</p>
            </CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
