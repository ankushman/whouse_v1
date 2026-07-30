import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#1e3a5f', '#172554', '#1e40af', '#3b82f6', '#60a5fa', '#1d4ed8', '#2563eb', '#dbeafe']

const SUPPLY_TYPES = ['Ammunition', 'Small Arms', 'Artillery Systems', 'Radar Units', 'Armored Vehicles', 'Communication Systems', 'Aviation Spares', 'NBC Equipment']
const COMMANDS = ['Army HQ Delhi', 'Western Command Chandimandir', 'Eastern Command Kolkata', 'Southern Command Pune', 'Northern Command Udhampur', 'Central Command Lucknow', 'Navy HQ New Delhi', 'IAF HQ New Delhi']
const CLEARANCE_STATUS = ['DGQA Cleared', 'Under Trial', 'Import Cleared', 'Reject & Return', 'Held for Audit', 'Pending Approval']

const supplyRecords = [
  { id: 'DSC-0001', supply: 'Ammunition', description: '5.56mm INSAS Rifle Ball MK-II 1200 rnds', command: 'Northern Command Udhampur', quantity: 2400, unit: 'boxes', clearance: 'DGQA Cleared', contractor: 'OFB Varangaon', received: '2026-07-30', batch: 'DSC-B2026-0721', cost_inr: 48000000, priority: 'High', storage: 'Depot-A' },
  { id: 'DSC-0002', supply: 'Small Arms', description: 'INSAS 7.62mm Assault Rifle Excalibur Mk.1', command: 'Western Command Chandimandir', quantity: 1500, unit: 'rifles', clearance: 'DGQA Cleared', contractor: 'OFB Ishapore', received: '2026-07-30', batch: 'DSC-B2026-0720', cost_inr: 94500000, priority: 'Critical', storage: 'Armory-1' },
  { id: 'DSC-0003', supply: 'Artillery Systems', description: '155mm Kalyani MGS HE Shell Series', command: 'Eastern Command Kolkata', quantity: 500, unit: 'shells', clearance: 'Under Trial', contractor: 'Bharat Forge Pune', received: '2026-07-29', batch: 'DSC-B2026-0719', cost_inr: 225000000, priority: 'High', storage: 'ASP-3' },
  { id: 'DSC-0004', supply: 'Radar Units', description: 'Swathi Weapon Locating Radar WBTR', command: 'Southern Command Pune', quantity: 2, unit: 'units', clearance: 'Import Cleared', contractor: 'BEL Bangalore', received: '2026-07-29', batch: 'DSC-B2026-0718', cost_inr: 380000000, priority: 'Critical', storage: 'Tech-Park' },
  { id: 'DSC-0005', supply: 'Armored Vehicles', description: 'T-90 Bhishmk Spares Track Assembly Set', command: 'Western Command Chandimandir', quantity: 24, unit: 'sets', clearance: 'DGQA Cleared', contractor: 'HVF Avadi', received: '2026-07-28', batch: 'DSC-B2026-0716', cost_inr: 144000000, priority: 'High', storage: 'EME-Workshop' },
  { id: 'DSC-0006', supply: 'Communication Systems', description: 'SECURE-T ACS Manpack VHF SDR Radio', command: 'Army HQ Delhi', quantity: 350, unit: 'radios', clearance: 'DGQA Cleared', contractor: 'BEL Ghaziabad', received: '2026-07-28', batch: 'DSC-B2026-0715', cost_inr: 87500000, priority: 'Medium', storage: 'Signal-Store' },
  { id: 'DSC-0007', supply: 'Aviation Spares', description: 'Su-30MKI AL-31FP Engine Module Set', command: 'IAF HQ New Delhi', quantity: 8, unit: 'modules', clearance: 'Import Cleared', contractor: 'HAL Nasik', received: '2026-07-27', batch: 'DSC-B2026-0714', cost_inr: 560000000, priority: 'Critical', storage: 'Base-Depot' },
  { id: 'DSC-0008', supply: 'NBC Equipment', description: 'NBC Recon Vehicle Mark-II Detection Suite', command: 'Northern Command Udhampur', quantity: 12, unit: 'units', clearance: 'Under Trial', contractor: 'DRDO Delhi', received: '2026-07-27', batch: 'DSC-B2026-0713', cost_inr: 96000000, priority: 'High', storage: 'NBC-Corp' },
  { id: 'DSC-0009', supply: 'Ammunition', description: '125mm APFSDS FSAPDS Mk-II Arjun', command: 'Southern Command Pune', quantity: 800, unit: 'rounds', clearance: 'DGQA Cleared', contractor: 'OFB Khadki', received: '2026-07-26', batch: 'DSC-B2026-0711', cost_inr: 200000000, priority: 'Critical', storage: 'ASP-1' },
  { id: 'DSC-0010', supply: 'Small Arms', description: 'BNS Tor Pistol 9x19mm with Holster', command: 'Navy HQ New Delhi', quantity: 5000, unit: 'pistols', clearance: 'DGQA Cleared', contractor: 'OFB Kanpur', received: '2026-07-26', batch: 'DSC-B2026-0710', cost_inr: 75000000, priority: 'Medium', storage: 'Naval-Armory' },
  { id: 'DSC-0011', supply: 'Artillery Systems', description: 'Pinaka MBRL Rocket Mk-III HE Warhead', command: 'Eastern Command Kolkata', quantity: 1200, unit: 'rockets', clearance: 'Reject & Return', contractor: 'Tata SDR Pune', received: '2026-07-25', batch: 'DSC-B2026-0708', cost_inr: 180000000, priority: 'High', storage: 'QC-Hold' },
  { id: 'DSC-0012', supply: 'Radar Units', description: 'Akash Missile Guidance Radar Rajendra', command: 'Central Command Lucknow', quantity: 4, unit: 'units', clearance: 'DGQA Cleared', contractor: 'BEL Hyderabad', received: '2026-07-25', batch: 'DSC-B2026-0707', cost_inr: 420000000, priority: 'Critical', storage: 'SAM-Depot' },
  { id: 'DSC-0013', supply: 'Armored Vehicles', description: 'BMP-2 Sarath Spares FCS Module', command: 'Western Command Chandimandir', quantity: 36, unit: 'modules', clearance: 'Held for Audit', contractor: 'OFB Medak', received: '2026-07-24', batch: 'DSC-B2026-0705', cost_inr: 108000000, priority: 'Medium', storage: 'Audit-Hold' },
  { id: 'DSC-0014', supply: 'Communication Systems', description: 'SATCOM GSAT-7A Ground Terminal X-Band', command: 'IAF HQ New Delhi', quantity: 6, unit: 'terminals', clearance: 'Import Cleared', contractor: 'ISRO Ahmedabad', received: '2026-07-24', batch: 'DSC-B2026-0704', cost_inr: 156000000, priority: 'High', storage: 'Comm-Center' },
  { id: 'DSC-0015', supply: 'Aviation Spares', description: 'Dhruv ALH Mk-IV Main Rotor Blade Set', command: 'Army HQ Delhi', quantity: 16, unit: 'blade sets', clearance: 'DGQA Cleared', contractor: 'HAL Bangalore', received: '2026-07-23', batch: 'DSC-B2026-0702', cost_inr: 192000000, priority: 'Critical', storage: 'AAC-Depot' },
  { id: 'DSC-0016', supply: 'NBC Equipment', description: 'Individual Chemical Protective Suit Mark-V', command: 'Eastern Command Kolkata', quantity: 5000, unit: 'suits', clearance: 'Pending Approval', contractor: 'Hindustan Rubber', received: '2026-07-23', batch: 'DSC-B2026-0701', cost_inr: 35000000, priority: 'Medium', storage: 'NBC-Store' },
  { id: 'DSC-0017', supply: 'Ammunition', description: '30mm BMP-2 APDS-T Ammunition Lot', command: 'Northern Command Udhampur', quantity: 3000, unit: 'rounds', clearance: 'DGQA Cleared', contractor: 'OFB Ambernath', received: '2026-07-22', batch: 'DSC-B2026-0629', cost_inr: 120000000, priority: 'High', storage: 'ASP-5' },
  { id: 'DSC-0018', supply: 'Small Arms', description: 'Sig Sauer 7.62mm SIG716i Assault Rifle', command: 'Central Command Lucknow', quantity: 2500, unit: 'rifles', clearance: 'Import Cleared', contractor: 'SIG Sauer USA', received: '2026-07-22', batch: 'DSC-B2026-0628', cost_inr: 175000000, priority: 'High', storage: 'Armory-2' },
  { id: 'DSC-0019', supply: 'Artillery Systems', description: 'M777 A2 Ultra-Light Howitzer Spare Barrel', command: 'Northern Command Udhampur', quantity: 6, unit: 'barrels', clearance: 'Import Cleared', contractor: 'BAE Systems UK', received: '2026-07-21', batch: 'DSC-B2026-0625', cost_inr: 270000000, priority: 'Critical', storage: 'ASP-2' },
  { id: 'DSC-0020', supply: 'Radar Units', description: 'LRTR Long Range Tracking Radar S-Band', command: 'Navy HQ New Delhi', quantity: 1, unit: 'unit', clearance: 'Under Trial', contractor: 'DRDO LRDE', received: '2026-07-21', batch: 'DSC-B2026-0624', cost_inr: 850000000, priority: 'Critical', storage: 'DRDO-Lab' },
]

const genRecords = (start: number) => {
  const statuses = ['DGQA Cleared', 'Under Trial', 'Import Cleared', 'Reject & Return', 'Held for Audit', 'Pending Approval']
  const contractors = ['OFB Varangaon', 'OFB Ishapore', 'Bharat Forge', 'BEL Bangalore', 'HVF Avadi', 'BEL Ghaziabad', 'HAL Nasik', 'DRDO Delhi']
  return Array.from({ length: 40 }, (_, i) => ({
    id: `DSC-${String(start + i).padStart(4, '0')}`,
    supply: SUPPLY_TYPES[(start + i) % 8],
    description: `${SUPPLY_TYPES[(start + i) % 8]} Item ${String((start + i) % 99 + 1).padStart(3, '0')}`,
    command: COMMANDS[(start + i) % 8],
    quantity: Math.round(1 + Math.random() * 4999),
    unit: ['boxes', 'rifles', 'units', 'rounds', 'sets', 'radios', 'modules', 'suits'][i % 8],
    clearance: statuses[(start + i) % 6],
    contractor: contractors[(start + i) % 8],
    received: `2026-07-${String(20 - Math.floor((start + i) / 10)).padStart(2, '0')}`,
    batch: `DSC-B2026-${String(624 - Math.floor((start + i) / 3)).padStart(4, '0')}`,
    cost_inr: Math.round(10000000 + Math.random() * 500000000),
    priority: ['Critical', 'High', 'Medium', 'Low'][(start + i) % 4],
    storage: `Store-${String((start + i) % 20 + 1).padStart(2, '0')}`,
  }))
}

const allSupply = [...supplyRecords, ...genRecords(21), ...genRecords(61)]

function ri(min: number, max: number, value: number) {
  return Math.max(min, Math.min(max, value))
}

const filterGroups = [
  {
    key: 'supply',
    label: 'Supply Type',
    options: SUPPLY_TYPES.map(s => ({ label: s, value: s, count: allSupply.filter(r => r.supply === s).length })),
  },
  {
    key: 'command',
    label: 'Command',
    options: COMMANDS.map(c => ({ label: c, value: c, count: allSupply.filter(r => r.command === c).length })),
  },
  {
    key: 'clearance',
    label: 'Clearance Status',
    options: CLEARANCE_STATUS.map(s => ({ label: s, value: s, count: allSupply.filter(r => r.clearance === s).length })),
  },
]

function SupplyBadge({ supply }: { supply: string }) {
  const colors: Record<string, string> = { Ammunition: 'bg-red-100 text-red-800', 'Small Arms': 'bg-orange-100 text-orange-800', 'Artillery Systems': 'bg-yellow-100 text-yellow-800', 'Radar Units': 'bg-blue-100 text-blue-800', 'Armored Vehicles': 'bg-green-100 text-green-800', 'Communication Systems': 'bg-cyan-100 text-cyan-800', 'Aviation Spares': 'bg-indigo-100 text-indigo-800', 'NBC Equipment': 'bg-purple-100 text-purple-800' }
  return <span className={`dsc-supply-badge inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[supply] || 'bg-gray-100 text-gray-800'}`}>{supply}</span>
}

function ClearanceBadge({ clearance }: { clearance: string }) {
  const colors: Record<string, string> = { 'DGQA Cleared': 'bg-green-100 text-green-800', 'Under Trial': 'bg-yellow-100 text-yellow-800', 'Import Cleared': 'bg-blue-100 text-blue-800', 'Reject & Return': 'bg-red-100 text-red-800', 'Held for Audit': 'bg-orange-100 text-orange-800', 'Pending Approval': 'bg-gray-200 text-gray-700' }
  return <span className={`dsc-clearance-badge inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[clearance] || 'bg-gray-100 text-gray-700'}`}>{clearance}</span>
}

function CostBar({ cost }: { cost: number }) {
  const pct = ri(0, 100, (cost / 500000000) * 100)
  const color = cost >= 250000000 ? 'bg-blue-700' : cost >= 100000000 ? 'bg-blue-600' : cost >= 50000000 ? 'bg-blue-500' : 'bg-blue-400'
  return <div className="dsc-cost-bar flex items-center gap-2"><div className="h-2 w-20 rounded-full bg-gray-200"><div className={`dsc-cost-bar-fill h-2 rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} /></div><span className="text-xs text-gray-500">{'₹' + (cost / 10000000).toFixed(1) + 'Cr'}</span></div>
}

function HealthRing({ value, label, color }: { value: number; label: string; color: string }) {
  const r = 28, cx = 35, cy = 35, sw = 5
  const circ = 2 * Math.PI * r
  const offset = circ - (ri(0, 100, value) / 100) * circ
  return <div className="dsc-health-ring flex flex-col items-center"><svg width={70} height={70} className="-rotate-90"><circle cx={cx} cy={cy} r={r} fill="none" stroke="#e5e7eb" strokeWidth={sw} /><circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={sw} strokeDasharray={circ} strokeDashoffset={offset} className="dsc-ring-path" strokeLinecap="round" /></svg><span className="dsc-ring-value mt-1 text-sm font-bold" style={{ color }}>{value}%</span><span className="text-xs text-gray-500">{label}</span></div>
}

function KpiTile({ title, value, sub }: { title: string; value: string; sub: string }) {
  return <Card className="dsc-kpi-card"><CardContent className="p-4"><p className="text-xs text-gray-500">{title}</p><p className="dsc-kpi-value mt-1 text-2xl font-bold">{value}</p><p className="text-xs text-gray-400 mt-0.5">{sub}</p></CardContent></Card>
}

function ValueTile({ title, value, trend }: { title: string; value: string; trend: string }) {
  const up = trend.startsWith('+')
  return <Card className="dsc-value-tile"><CardContent className="p-4"><p className="text-xs text-gray-500">{title}</p><p className="mt-1 text-xl font-bold">{value}</p><p className={`text-xs mt-0.5 ${up ? 'text-green-600' : 'text-red-500'}`}>{trend}</p></CardContent></Card>
}

export default function DefenceSupplyChainView() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})

  const toggleFilter = (key: string, value: string) => {
    setActiveFilters(prev => {
      const curr = prev[key] || []
      const next = curr.includes(value) ? curr.filter(v => v !== value) : [...curr, value]
      return next.length > 0 ? { ...prev, [key]: next } : Object.fromEntries(Object.entries(prev).filter(([k]) => k !== key))
    })
  }

  const filtered = allSupply.filter(s => {
    const q = searchQuery.toLowerCase()
    if (q && !s.id.toLowerCase().includes(q) && !s.supply.toLowerCase().includes(q) && !s.description.toLowerCase().includes(q) && !s.command.toLowerCase().includes(q) && !s.contractor.toLowerCase().includes(q)) return false
    return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(s[key as keyof typeof s] as string))
  })

  const totalCost = allSupply.reduce((sum, s) => sum + s.cost_inr, 0)
  const dgqaCleared = allSupply.filter(s => s.clearance === 'DGQA Cleared').length
  const criticalItems = allSupply.filter(s => s.priority === 'Critical').length

  const monthlyData = [
    { month: 'Jan', shipments: 42, value_cr: 180, readiness: 88 },
    { month: 'Feb', shipments: 38, value_cr: 155, readiness: 86 },
    { month: 'Mar', shipments: 55, value_cr: 240, readiness: 91 },
    { month: 'Apr', shipments: 48, value_cr: 210, readiness: 89 },
    { month: 'May', shipments: 62, value_cr: 275, readiness: 93 },
    { month: 'Jun', shipments: 35, value_cr: 145, readiness: 85 },
    { month: 'Jul', shipments: 58, value_cr: 258, readiness: 92 },
  ]
  const supplyData = SUPPLY_TYPES.map(s => ({ supply: s, count: allSupply.filter(r => r.supply === s).length }))
  const cmdData = COMMANDS.map(c => ({ command: c, count: allSupply.filter(r => r.command === c).length }))

  const tabs = [
    { value: 'dashboard', label: 'Dashboard' },
    { value: 'inventory', label: 'Inventory' },
    { value: 'analytics', label: 'Analytics' },
    { value: 'insights', label: 'Insights' },
  ]

  return (
    <div className="dsc-container space-y-4">
      <PageHeader title="Defence Supply Chain" description="Indian Armed Forces supply chain management with DGQA quality assurance, Ordnance Factory tracking, DRDO procurement coordination, and tri-service logistics across Indian Army, Navy, and Air Force commands" />
      <ModuleBreadcrumb items={[{ label: 'Government Logistics' }, { label: 'Defence Supply Chain' }]} />
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="dsc-tabs-list">
          {tabs.map(t => <TabsTrigger key={t.value} value={t.value} className="dsc-tab-trigger">{t.label}</TabsTrigger>)}
        </TabsList>

        <TabsContent value="dashboard" className="dsc-tab-content space-y-4 mt-4">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <KpiTile title="Total Items" value={allSupply.length.toString()} sub="Tracked consignments" />
            <KpiTile title="Total Value" value={`₹${(totalCost / 10000000).toFixed(0)}Cr`} sub="Procurement value" />
            <KpiTile title="DGQA Cleared" value={dgqaCleared.toString()} sub={`${((dgqaCleared / allSupply.length) * 100).toFixed(0)}% approved`} />
            <KpiTile title="Critical Items" value={criticalItems.toString()} sub="Priority dispatch" />
          </div>
          <div className="grid gap-4 grid-cols-3 md:grid-cols-6">
            <HealthRing value={92} label="Readiness" color="#1e3a5f" />
            <HealthRing value={96} label="DGQA Pass" color="#172554" />
            <HealthRing value={94} label="Logistics SLA" color="#1e40af" />
            <HealthRing value={90} label="Stock Adequacy" color="#3b82f6" />
            <HealthRing value={98} label="Security" color="#1d4ed8" />
            <HealthRing value={95} label="Indent Fill" color="#2563eb" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="dsc-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Monthly Shipments & Readiness Index</CardTitle></CardHeader><CardContent><LineChart data={monthlyData} width={300} height={200}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" fontSize={12} /><YAxis fontSize={12} /><Tooltip /><Legend /><Line type="monotone" dataKey="shipments" stroke="#1e3a5f" strokeWidth={2} /><Line type="monotone" dataKey="readiness" stroke="#172554" strokeWidth={2} strokeDasharray="5 5" /></LineChart></CardContent></Card>
            <Card className="dsc-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Items by Supply Type</CardTitle></CardHeader><CardContent><BarChart data={supplyData} width={300} height={200}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="supply" fontSize={10} angle={-30} textAnchor="end" height={50} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="count" fill="#1e3a5f" radius={[4,4,0,0]} /></BarChart></CardContent></Card>
            <Card className="dsc-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Command Distribution</CardTitle></CardHeader><CardContent><PieChart width={300} height={200}><Pie data={cmdData} dataKey="count" nameKey="command" cx="50%" cy="50%" outerRadius={70} label={({ command, count }) => `${count}`}>{cmdData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="inventory" className="dsc-tab-content space-y-4 mt-4">
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={allSupply.length} filteredCount={filtered.length} onRefresh={() => {}} placeholder="Search by ID, supply type, command, contractor, or description..." />
          <div className="overflow-x-auto rounded-lg border">
            <table className="dsc-table w-full text-sm">
              <thead><tr className="dsc-table-header bg-gray-50"><th className="px-3 py-2 text-left font-medium">ID</th><th className="px-3 py-2 text-left font-medium">Supply Type</th><th className="px-3 py-2 text-left font-medium">Clearance</th><th className="px-3 py-2 text-left font-medium">Qty</th><th className="px-3 py-2 text-left font-medium">Cost</th><th className="px-3 py-2 text-left font-medium">Command</th><th className="px-3 py-2 text-left font-medium">Contractor</th><th className="px-3 py-2 text-left font-medium">Priority</th><th className="px-3 py-2 text-left font-medium">Storage</th></tr></thead>
              <tbody>{filtered.slice(0, 20).map(s => (
                <tr key={s.id} className="dsc-table-row border-t hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-2 font-mono text-xs">{s.id}</td>
                  <td className="px-3 py-2"><SupplyBadge supply={s.supply} /></td>
                  <td className="px-3 py-2"><ClearanceBadge clearance={s.clearance} /></td>
                  <td className="px-3 py-2 text-xs">{s.quantity.toLocaleString('en-IN')} {s.unit}</td>
                  <td className="px-3 py-2"><CostBar cost={s.cost_inr} /></td>
                  <td className="px-3 py-2 text-xs">{s.command}</td>
                  <td className="px-3 py-2 text-xs">{s.contractor}</td>
                  <td className="px-3 py-2 text-xs">{s.priority}</td>
                  <td className="px-3 py-2 text-xs">{s.storage}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="dsc-tab-content space-y-4 mt-4">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <ValueTile title="Avg Procurement Cycle" value="42 days" trend="-5 days faster" />
            <ValueTile title="DGQA Pass Rate" value="96.8%" trend="+1.2% improved" />
            <ValueTile title="Critical Fill Rate" value="94.5%" trend="+3.1% improved" />
            <ValueTile title="Indigenous Content" value="72.4%" trend="+4.8% Make in India" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="dsc-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Value by Supply Category</CardTitle></CardHeader><CardContent><BarChart data={SUPPLY_TYPES.map(s => ({ supply: s, total: allSupply.filter(r => r.supply === s).reduce((sum, r) => sum + r.cost_inr, 0) / 10000000 }))} width={400} height={250}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="supply" fontSize={10} angle={-30} textAnchor="end" height={50} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="total" fill="#172554" radius={[4,4,0,0]} /></BarChart></CardContent></Card>
            <Card className="dsc-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Clearance Status Breakdown</CardTitle></CardHeader><CardContent><PieChart width={400} height={250}><Pie data={CLEARANCE_STATUS.map(s => ({ status: s, count: allSupply.filter(r => r.clearance === s).length }))} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={80} label>{CLEARANCE_STATUS.map((_, i) => <Cell key={i} fill={['#22c55e','#eab308','#3b82f6','#ef4444','#f97316','#9ca3af'][i]} />)}</Pie><Tooltip /></PieChart></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="dsc-tab-content space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="dsc-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">DGQA Digital Inspection Platform</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>End-to-end digitization of Directorate General of Quality Assurance inspection workflow across 41 Ordnance Factories and 18 Defence PSUs. Real-time non-destructive testing (NDT) results with ultrasonic thickness gauging, radiographic inspection, and magnetic particle testing. Automated DGQA J2/J3/J4 inspection report generation reducing clearance time from 14 days to 3 days. Blockchain-based certificate of conformance ensuring tamper-proof quality documentation.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-blue-800">Critical</span><span className="text-gray-400">Live</span></div></CardContent></Card>
            <Card className="dsc-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">Make in India Defence Corridor Integration</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Logistics network optimization across India's 6 defence industrial corridors: UP, Tamil Nadu, Gujarat, Karnataka, Maharashtra, and Rajasthan. Real-time vendor capacity tracking for 350+ MSME suppliers feeding into OFB and DPSU production lines. Automated demand-supply matching engine for indigenization of 425 imported defence items. Integration with iDEX (Innovations for Defence Excellence) startup procurement pipeline.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-indigo-100 px-2 py-0.5 text-indigo-800">Operational</span><span className="text-gray-400">Q3 2026</span></div></CardContent></Card>
            <Card className="dsc-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">Tri-Service Integrated Logistics Command</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Unified logistics management platform serving Indian Army, Navy, and Air Force with shared depot infrastructure. Cross-service spare pooling reducing inventory carrying cost by 22% across 84 ordnance depots. Automated demand forecasting using historical consumption patterns, operational deployment data, and war-game scenario modeling. Integration with Defence Accounts Department (DAD) for real-time budget utilization tracking against capital expenditure plans.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-cyan-100 px-2 py-0.5 text-cyan-800">Strategic</span><span className="text-gray-400">FY2027</span></div></CardContent></Card>
            <Card className="dsc-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">AI-Powered Predictive Spares Management</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Machine learning model predicting component failure across T-90, Su-30MKI, Rafale, and INS Vikrant platforms with 87% accuracy 6 months ahead. Automated reorder point optimization reducing emergency procurement by 35% for 12,000+ critical spares. Digital twin simulation of each weapon platform tracking real-time component health and remaining useful life (RUL). Integration with Army ERP and Naval ERP for seamless indent-to-delivery tracking with 99.2% fill rate for Category-A items.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-purple-100 px-2 py-0.5 text-purple-800">Innovation</span><span className="text-gray-400">Pilot</span></div></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
