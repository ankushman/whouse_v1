import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#15803d', '#166534', '#16a34a', '#4ade80', '#86efac', '#14532d', '#052e16', '#bbf7d0']

const EWASTE_TYPES = ['Smartphones', 'Laptop PCs', 'LED Monitors', 'PCB Assemblies', 'Li-Ion Batteries', 'Inverters/UPS', 'Server Racks', 'Circuit Boards']
const RECYCLERS = ['Attero Roorkee', 'E-Parisaraa Bengaluru', 'Cerebra Chennai', 'Green-o-Tech Noida', 'Ecotech Mumbai', 'Karo Sambhav Delhi', 'Zeenext Hyd', 'Ecoreco Pune']
const PROCESS_STATUS = ['Dismantled', 'Shredded', 'Precious Recovered', 'Refurbished', 'Hazardous Segregated', 'Awaiting Collection']

const ewasteRecords = [
  { id: 'EWC-0001', ewaste: 'Smartphones', description: 'Mixed Mobile Phones 2.5MT Lot Containing Au, Ag, Cu Recovery', recycler: 'Attero Roorkee', quantity: 2500, unit: 'kg', process_status: 'Precious Recovered', lot: 'LOT-EWC-9041', destination: 'Kabadiwala Hub Delhi NCR', received: '2026-07-30', batch: 'EWC-B2026-0721', cost_inr: 8500000, recovery_rate: 94.2, hazardous_class: 'R2' },
  { id: 'EWC-0002', ewaste: 'Laptop PCs', description: 'End-of-Life Enterprise Laptops 8MT HDD Data Sanitized DOD 5220', recycler: 'Cerebra Chennai', quantity: 8000, unit: 'kg', process_status: 'Refurbished', lot: 'LOT-EWC-9038', destination: 'Re-use Marketplace Bengaluru', received: '2026-07-30', batch: 'EWC-B2026-0720', cost_inr: 32000000, recovery_rate: 78.5, hazardous_class: 'R4' },
  { id: 'EWC-0003', ewaste: 'LED Monitors', description: 'CRT and LED Mixed 12MT Mercury Panel Safe Handling ISO 14001', recycler: 'E-Parisaraa Bengaluru', quantity: 12000, unit: 'kg', process_status: 'Dismantled', lot: 'LOT-EWC-9012', destination: 'Glass Recycler Vizag', received: '2026-07-29', batch: 'EWC-B2026-0719', cost_inr: 18000000, recovery_rate: 88.0, hazardous_class: 'R3' },
  { id: 'EWC-0004', ewaste: 'PCB Assemblies', description: 'Mixed Telecom PCB 1.5MT Cu Recovery Au Plating Stripped', recycler: 'Green-o-Tech Noida', quantity: 1500, unit: 'kg', process_status: 'Precious Recovered', lot: 'LOT-EWC-9027', destination: 'Copper Smelter Jharkhand', received: '2026-07-29', batch: 'EWC-B2026-0718', cost_inr: 12000000, recovery_rate: 96.8, hazardous_class: 'R2' },
  { id: 'EWC-0005', ewaste: 'Li-Ion Batteries', description: 'EV Battery Pack NMC 5MT Cobalt Li Recovery Hydrometallurgy', recycler: 'Ecotech Mumbai', quantity: 5000, unit: 'kg', process_status: 'Shredded', lot: 'LOT-EWC-9031', destination: 'Li Recovery Plant Gujarat', received: '2026-07-28', batch: 'EWC-B2026-0716', cost_inr: 42000000, recovery_rate: 92.4, hazardous_class: 'R5' },
  { id: 'EWC-0006', ewaste: 'Inverters/UPS', description: 'Lead-Acid Battery UPS 18MT Pb Recovery Smelting ISRI Grade', recycler: 'Karo Sambhav Delhi', quantity: 18000, unit: 'kg', process_status: 'Hazardous Segregated', lot: 'LOT-EWC-9040', destination: 'Lead Smelter Bhiwandi', received: '2026-07-28', batch: 'EWC-B2026-0715', cost_inr: 8600000, recovery_rate: 97.2, hazardous_class: 'R6' },
  { id: 'EWC-0007', ewaste: 'Server Racks', description: 'Data Center Decom 4MT Mixed Servers HDD Cryptographic Erase', recycler: 'Zeenext Hyd', quantity: 4000, unit: 'kg', process_status: 'Dismantled', lot: 'LOT-EWC-9008', destination: 'Cloud Datacenter Secunderabad', received: '2026-07-27', batch: 'EWC-B2026-0714', cost_inr: 28000000, recovery_rate: 85.0, hazardous_class: 'R4' },
  { id: 'EWC-0008', ewaste: 'Circuit Boards', description: 'BGA Multi-Layer PCB 0.8MT Gold Fingers IC Chip Recovery', recycler: 'Ecoreco Pune', quantity: 800, unit: 'kg', process_status: 'Precious Recovered', lot: 'LOT-EWC-9037', destination: 'Precious Metal Refinery Mumbai', received: '2026-07-27', batch: 'EWC-B2026-0713', cost_inr: 22000000, recovery_rate: 98.5, hazardous_class: 'R2' },
  { id: 'EWC-0009', ewaste: 'Smartphones', description: 'Apple Samsung Mixed Lot 3MT Battery Segregated Safe Discharge', recycler: 'Attero Roorkee', quantity: 3000, unit: 'kg', process_status: 'Dismantled', lot: 'LOT-EWC-9039', destination: 'Li Recovery Roorkee', received: '2026-07-26', batch: 'EWC-B2026-0711', cost_inr: 10500000, recovery_rate: 91.0, hazardous_class: 'R5' },
  { id: 'EWC-0010', ewaste: 'Laptop PCs', description: 'Govt Office E-Waste 6MT CPCB Registered Collection Center', recycler: 'E-Parisaraa Bengaluru', quantity: 6000, unit: 'kg', process_status: 'Awaiting Collection', lot: 'LOT-EWC-9026', destination: 'KSPCB Warehouse Bengaluru', received: '2026-07-26', batch: 'EWC-B2026-0710', cost_inr: 15000000, recovery_rate: 0, hazardous_class: 'R1' },
  { id: 'EWC-0011', ewaste: 'LED Monitors', description: 'IT Park Clearance 15MT Mixed IT Equipment Asset Tagged', recycler: 'Cerebra Chennai', quantity: 15000, unit: 'kg', process_status: 'Dismantled', lot: 'LOT-EWC-9011', destination: 'DigiLocker Asset TN', received: '2026-07-25', batch: 'EWC-B2026-0708', cost_inr: 24000000, recovery_rate: 86.5, hazardous_class: 'R3' },
  { id: 'EWC-0012', ewaste: 'PCB Assemblies', description: 'Defence PCB Scrap 0.5MT ITAR Controlled Classified Destruction', recycler: 'Green-o-Tech Noida', quantity: 500, unit: 'kg', process_status: 'Shredded', lot: 'LOT-EWC-9007', destination: 'DRDO Hyderabad', received: '2026-07-25', batch: 'EWC-B2026-0707', cost_inr: 18000000, recovery_rate: 99.1, hazardous_class: 'R2' },
  { id: 'EWC-0013', ewaste: 'Li-Ion Batteries', description: 'Two-Wheeler EV Battery NCM 3.2MT Collection from Bajaj Chakan', recycler: 'Ecotech Mumbai', quantity: 3200, unit: 'kg', process_status: 'Awaiting Collection', lot: 'LOT-EWC-9030', destination: 'FAME II Collection Pune', received: '2026-07-24', batch: 'EWC-B2026-0705', cost_inr: 26000000, recovery_rate: 0, hazardous_class: 'R5' },
  { id: 'EWC-0014', ewaste: 'Inverters/UPS', description: 'Solar Power Plant UPS 8MT Acid Neutralization ETP Treatment', recycler: 'Karo Sambhav Delhi', quantity: 8000, unit: 'kg', process_status: 'Hazardous Segregated', lot: 'LOT-EWC-9025', destination: 'Solar E-Waste Hub Jaipur', received: '2026-07-24', batch: 'EWC-B2026-0704', cost_inr: 6200000, recovery_rate: 96.0, hazardous_class: 'R6' },
  { id: 'EWC-0015', ewaste: 'Server Racks', description: 'Banking Data Center 6MT RBI Compliant Degaussing Cryptographic Erase', recycler: 'Zeenext Hyd', quantity: 6000, unit: 'kg', process_status: 'Dismantled', lot: 'LOT-EWC-9036', destination: 'SBI Data Center Mumbai', received: '2026-07-23', batch: 'EWC-B2026-0702', cost_inr: 38000000, recovery_rate: 82.0, hazardous_class: 'R4' },
  { id: 'EWC-0016', ewaste: 'Circuit Boards', description: 'Consumer Electronics Mixed PCB 1.2MT Cu Au Ag Urban Mining', recycler: 'Ecoreco Pune', quantity: 1200, unit: 'kg', process_status: 'Precious Recovered', lot: 'LOT-EWC-9024', destination: 'Urban Mine Hub Mumbai', received: '2026-07-23', batch: 'EWC-B2026-0701', cost_inr: 32000000, recovery_rate: 97.8, hazardous_class: 'R2' },
  { id: 'EWC-0017', ewaste: 'Smartphones', description: 'Telecom Tower Battery Backup 2.8MT LiFePO4 Cells Recovery', recycler: 'Attero Roorkee', quantity: 2800, unit: 'kg', process_status: 'Shredded', lot: 'LOT-EWC-9023', destination: 'Jio Tower Collection Pan-India', received: '2026-07-22', batch: 'EWC-B2026-0629', cost_inr: 9800000, recovery_rate: 93.5, hazardous_class: 'R5' },
  { id: 'EWC-0018', ewaste: 'Laptop PCs', description: 'ITI Training Center 4MT Mixed IT Assets State Govt Surplus', recycler: 'E-Parisaraa Bengaluru', quantity: 4000, unit: 'kg', process_status: 'Refurbished', lot: 'LOT-EWC-9022', destination: 'State IT Dept Bengaluru', received: '2026-07-22', batch: 'EWC-B2026-0628', cost_inr: 12000000, recovery_rate: 72.0, hazardous_class: 'R4' },
  { id: 'EWC-0019', ewaste: 'LED Monitors', description: 'Hospital Biomedical LCD 2MT Fluorescent Tube Hg Segregation', recycler: 'Cerebra Chennai', quantity: 2000, unit: 'kg', process_status: 'Hazardous Segregated', lot: 'LOT-EWC-9010', destination: 'BMW Bio-Medical Waste TN', received: '2026-07-21', batch: 'EWC-B2026-0625', cost_inr: 8400000, recovery_rate: 84.0, hazardous_class: 'R6' },
  { id: 'EWC-0020', ewaste: 'PCB Assemblies', description: 'Smart Meter PCB 1.8MT IS 16430 BIS Certified E-Waste Lot', recycler: 'Green-o-Tech Noida', quantity: 1800, unit: 'kg', process_status: 'Shredded', lot: 'LOT-EWC-9021', destination: 'Smart Meter Hub Noida', received: '2026-07-21', batch: 'EWC-B2026-0624', cost_inr: 14000000, recovery_rate: 95.2, hazardous_class: 'R2' },
]

const genRecords = (start: number) => {
  const statuses = ['Dismantled', 'Shredded', 'Precious Recovered', 'Refurbished', 'Hazardous Segregated', 'Awaiting Collection']
  const destinations = ['Kabadiwala Hub Delhi', 'Re-use Marketplace Bengaluru', 'Glass Recycler Vizag', 'Copper Smelter Jharkhand', 'Li Recovery Plant Gujarat', 'Lead Smelter Bhiwandi', 'Cloud Datacenter Hyd', 'Precious Metal Mumbai']
  return Array.from({ length: 40 }, (_, i) => ({
    id: `EWC-${String(start + i).padStart(4, '0')}`,
    ewaste: EWASTE_TYPES[(start + i) % 8],
    description: `${EWASTE_TYPES[(start + i) % 8]} Lot ${String((start + i) % 99 + 1).padStart(3, '0')}`,
    recycler: RECYCLERS[(start + i) % 8],
    quantity: Math.round(200 + Math.random() * 18000),
    unit: 'kg',
    process_status: statuses[(start + i) % 6],
    lot: `LOT-EWC-${String(9021 + start + i)}`,
    destination: destinations[(start + i) % 8],
    received: `2026-07-${String(20 - Math.floor((start + i) / 10)).padStart(2, '0')}`,
    batch: `EWC-B2026-${String(624 - Math.floor((start + i) / 3)).padStart(4, '0')}`,
    cost_inr: Math.round(2000000 + Math.random() * 45000000),
    recovery_rate: statuses[(start + i) % 6] === 'Awaiting Collection' ? 0 : Math.round((80 + Math.random() * 20) * 10) / 10,
    hazardous_class: ['R1', 'R2', 'R3', 'R4', 'R5', 'R6'][i % 6],
  }))
}

const allEwaste = [...ewasteRecords, ...genRecords(21), ...genRecords(61)]

function ri(min: number, max: number, value: number) {
  return Math.max(min, Math.min(max, value))
}

const filterGroups = [
  {
    key: 'ewaste',
    label: 'E-Waste Type',
    options: EWASTE_TYPES.map(t => ({ label: t, value: t, count: allEwaste.filter(r => r.ewaste === t).length })),
  },
  {
    key: 'recycler',
    label: 'Recycler',
    options: RECYCLERS.map(r => ({ label: r, value: r, count: allEwaste.filter(rec => rec.recycler === r).length })),
  },
  {
    key: 'process_status',
    label: 'Process Status',
    options: PROCESS_STATUS.map(s => ({ label: s, value: s, count: allEwaste.filter(r => r.process_status === s).length })),
  },
]

function EwasteBadge({ ewaste }: { ewaste: string }) {
  const colors: Record<string, string> = { Smartphones: 'bg-slate-100 text-slate-800', 'Laptop PCs': 'bg-blue-100 text-blue-800', 'LED Monitors': 'bg-purple-100 text-purple-800', 'PCB Assemblies': 'bg-green-100 text-green-800', 'Li-Ion Batteries': 'bg-red-100 text-red-800', 'Inverters/UPS': 'bg-amber-100 text-amber-800', 'Server Racks': 'bg-cyan-100 text-cyan-800', 'Circuit Boards': 'bg-emerald-100 text-emerald-800' }
  return <span className={`ewc-ewaste-badge inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[ewaste] || 'bg-gray-100 text-gray-800'}`}>{ewaste}</span>
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = { Dismantled: 'bg-blue-100 text-blue-800', Shredded: 'bg-green-100 text-green-800', 'Precious Recovered': 'bg-yellow-100 text-yellow-800', Refurbished: 'bg-teal-100 text-teal-800', 'Hazardous Segregated': 'bg-red-100 text-red-800', 'Awaiting Collection': 'bg-gray-200 text-gray-700' }
  return <span className={`ewc-status-badge inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-700'}`}>{status}</span>
}

function CostBar({ cost }: { cost: number }) {
  const pct = ri(0, 100, (cost / 50000000) * 100)
  const color = cost >= 35000000 ? 'bg-green-600' : cost >= 15000000 ? 'bg-green-500' : cost >= 5000000 ? 'bg-green-400' : 'bg-green-300'
  return <div className="ewc-cost-bar flex items-center gap-2"><div className="h-2 w-20 rounded-full bg-gray-200"><div className={`ewc-cost-bar-fill h-2 rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} /></div><span className="text-xs text-gray-500">{'₹' + (cost / 10000000).toFixed(1) + 'Cr'}</span></div>
}

function HealthRing({ value, label, color }: { value: number; label: string; color: string }) {
  const r = 28, cx = 35, cy = 35, sw = 5
  const circ = 2 * Math.PI * r
  const offset = circ - (ri(0, 100, value) / 100) * circ
  return <div className="ewc-health-ring flex flex-col items-center"><svg width={70} height={70} className="-rotate-90"><circle cx={cx} cy={cy} r={r} fill="none" stroke="#e5e7eb" strokeWidth={sw} /><circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={sw} strokeDasharray={circ} strokeDashoffset={offset} className="ewc-ring-path" strokeLinecap="round" /></svg><span className="ewc-ring-value mt-1 text-sm font-bold" style={{ color }}>{value}%</span><span className="text-xs text-gray-500">{label}</span></div>
}

function KpiTile({ title, value, sub }: { title: string; value: string; sub: string }) {
  return <Card className="ewc-kpi-card"><CardContent className="p-4"><p className="text-xs text-gray-500">{title}</p><p className="ewc-kpi-value mt-1 text-2xl font-bold">{value}</p><p className="text-xs text-gray-400 mt-0.5">{sub}</p></CardContent></Card>
}

function ValueTile({ title, value, trend }: { title: string; value: string; trend: string }) {
  const up = trend.startsWith('+')
  return <Card className="ewc-value-tile"><CardContent className="p-4"><p className="text-xs text-gray-500">{title}</p><p className="mt-1 text-xl font-bold">{value}</p><p className={`text-xs mt-0.5 ${up ? 'text-green-600' : 'text-red-500'}`}>{trend}</p></CardContent></Card>
}

export default function EwasteCircularEconomyView() {
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

  const filtered = allEwaste.filter(e => {
    const q = searchQuery.toLowerCase()
    if (q && !e.id.toLowerCase().includes(q) && !e.ewaste.toLowerCase().includes(q) && !e.description.toLowerCase().includes(q) && !e.recycler.toLowerCase().includes(q) && !e.destination.toLowerCase().includes(q)) return false
    return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(e[key as keyof typeof e] as string))
  })

  const totalCost = allEwaste.reduce((s, e) => s + e.cost_inr, 0)
  const recovered = allEwaste.filter(e => e.process_status === 'Precious Recovered').length
  const dismantled = allEwaste.filter(e => e.process_status === 'Dismantled').length

  const monthlyData = [
    { month: 'Jan', tons: 45, value_cr: 28, recovery: 92 },
    { month: 'Feb', tons: 62, value_cr: 38, recovery: 94 },
    { month: 'Mar', tons: 85, value_cr: 55, recovery: 95 },
    { month: 'Apr', tons: 38, value_cr: 22, recovery: 91 },
    { month: 'May', tons: 72, value_cr: 48, recovery: 93 },
    { month: 'Jun', tons: 28, value_cr: 15, recovery: 90 },
    { month: 'Jul', tons: 92, value_cr: 62, recovery: 96 },
  ]
  const ewasteData = EWASTE_TYPES.map(t => ({ ewaste: t, count: allEwaste.filter(r => r.ewaste === t).length }))
  const recyclerData = RECYCLERS.map(r => ({ recycler: r, count: allEwaste.filter(rec => rec.recycler === r).length }))

  const tabs = [
    { value: 'dashboard', label: 'Dashboard' },
    { value: 'collection', label: 'Collection' },
    { value: 'analytics', label: 'Analytics' },
    { value: 'insights', label: 'Insights' },
  ]

  return (
    <div className="ewc-container space-y-4">
      <PageHeader title="E-Waste Circular Economy" description="End-of-life electronics reverse logistics with CPCB E-Waste (Management) Rules 2022 compliance, EPR authorization tracking, extended producer responsibility fulfillment, and urban mining precious metal recovery across India's 312 authorized e-waste recyclers" />
      <ModuleBreadcrumb items={[{ label: 'Sustainability' }, { label: 'E-Waste Circular' }]} />
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="ewc-tabs-list">
          {tabs.map(t => <TabsTrigger key={t.value} value={t.value} className="ewc-tab-trigger">{t.label}</TabsTrigger>)}
        </TabsList>

        <TabsContent value="dashboard" className="ewc-tab-content space-y-4 mt-4">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <KpiTile title="Total Lots" value={allEwaste.length.toString()} sub="E-waste consignments" />
            <KpiTile title="Total Value" value={`₹${(totalCost / 10000000).toFixed(0)}Cr`} sub="Processing value" />
            <KpiTile title="Precious Recovered" value={recovered.toString()} sub={`${((recovered / allEwaste.length) * 100).toFixed(0)}% Au/Ag/Cu extracted`} />
            <KpiTile title="Dismantled" value={dismantled.toString()} sub="Processed this month" />
          </div>
          <div className="grid gap-4 grid-cols-3 md:grid-cols-6">
            <HealthRing value={95} label="CPCB Compliance" color="#15803d" />
            <HealthRing value={93} label="Au Recovery" color="#166534" />
            <HealthRing value={97} label="Cu Recovery" color="#16a34a" />
            <HealthRing value={89} label="EPR Targets" color="#14532d" />
            <HealthRing value={96} label="Li Recovery" color="#052e16" />
            <HealthRing value={92} label="Refurbish Rate" color="#4ade80" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="ewc-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Monthly Tonnage & Recovery Rate %</CardTitle></CardHeader><CardContent><LineChart data={monthlyData} width={300} height={200}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" fontSize={12} /><YAxis fontSize={12} /><Tooltip /><Legend /><Line type="monotone" dataKey="tons" stroke="#15803d" strokeWidth={2} /><Line type="monotone" dataKey="recovery" stroke="#166534" strokeWidth={2} strokeDasharray="5 5" /></LineChart></CardContent></Card>
            <Card className="ewc-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Collection by E-Waste Type</CardTitle></CardHeader><CardContent><BarChart data={ewasteData} width={300} height={200}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="ewaste" fontSize={10} angle={-30} textAnchor="end" height={50} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="count" fill="#15803d" radius={[4,4,0,0]} /></BarChart></CardContent></Card>
            <Card className="ewc-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Recycler Distribution</CardTitle></CardHeader><CardContent><PieChart width={300} height={200}><Pie data={recyclerData} dataKey="count" nameKey="recycler" cx="50%" cy="50%" outerRadius={70} label={({ recycler, count }) => `${count}`}>{recyclerData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="collection" className="ewc-tab-content space-y-4 mt-4">
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={allEwaste.length} filteredCount={filtered.length} onRefresh={() => {}} placeholder="Search by ID, e-waste type, recycler, destination, or lot..." />
          <div className="overflow-x-auto rounded-lg border">
            <table className="ewc-table w-full text-sm">
              <thead><tr className="ewc-table-header bg-gray-50"><th className="px-3 py-2 text-left font-medium">ID</th><th className="px-3 py-2 text-left font-medium">E-Waste</th><th className="px-3 py-2 text-left font-medium">Status</th><th className="px-3 py-2 text-left font-medium">Weight</th><th className="px-3 py-2 text-left font-medium">Value</th><th className="px-3 py-2 text-left font-medium">Recycler</th><th className="px-3 py-2 text-left font-medium">Destination</th><th className="px-3 py-2 text-left font-medium">Lot</th><th className="px-3 py-2 text-left font-medium">Rec%</th></tr></thead>
              <tbody>{filtered.slice(0, 20).map(e => (
                <tr key={e.id} className="ewc-table-row border-t hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-2 font-mono text-xs">{e.id}</td>
                  <td className="px-3 py-2"><EwasteBadge ewaste={e.ewaste} /></td>
                  <td className="px-3 py-2"><StatusBadge status={e.process_status} /></td>
                  <td className="px-3 py-2 text-xs">{(e.quantity / 1000).toFixed(1)}T {e.unit}</td>
                  <td className="px-3 py-2"><CostBar cost={e.cost_inr} /></td>
                  <td className="px-3 py-2 text-xs">{e.recycler}</td>
                  <td className="px-3 py-2 text-xs">{e.destination}</td>
                  <td className="px-3 py-2 text-xs font-mono">{e.lot}</td>
                  <td className="px-3 py-2 text-xs">{e.recovery_rate > 0 ? e.recovery_rate + '%' : 'N/A'}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="ewc-tab-content space-y-4 mt-4">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <ValueTile title="Avg Recovery Rate" value="93.4%" trend="+1.8% improved" />
            <ValueTile title="Urban Mining Value" value="₹12.5Cr" trend="+22.5% vs last year" />
            <ValueTile title="EPR Fulfillment" value="89.2%" trend="+6.4% on target" />
            <ValueTile title="Refurbish Revenue" value="₹4.8Cr" trend="+15.2% growing" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="ewc-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Value by E-Waste Category</CardTitle></CardHeader><CardContent><BarChart data={EWASTE_TYPES.map(t => ({ ewaste: t, total: allEwaste.filter(r => r.ewaste === t).reduce((s, r) => s + r.cost_inr, 0) / 10000000 }))} width={400} height={250}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="ewaste" fontSize={10} angle={-30} textAnchor="end" height={50} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="total" fill="#166534" radius={[4,4,0,0]} /></BarChart></CardContent></Card>
            <Card className="ewc-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Process Status Breakdown</CardTitle></CardHeader><CardContent><PieChart width={400} height={250}><Pie data={PROCESS_STATUS.map(s => ({ status: s, count: allEwaste.filter(e => e.process_status === s).length }))} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={80} label>{PROCESS_STATUS.map((_, i) => <Cell key={i} fill={['#3b82f6','#22c55e','#eab308','#14b8a6','#ef4444','#9ca3af'][i]} />)}</Pie><Tooltip /></PieChart></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="ewc-tab-content space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="ewc-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">CPCB E-Waste Management Rules 2022 Digital Tracking</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Central Pollution Control Board (CPCB) E-Waste (Management) Rules 2022 compliance tracking across 312 authorized dismantlers and recyclers in 28 states. Automated Extended Producer Responsibility (EPR) portal integration for 1,200+ producers meeting annual collection targets under Schedule IV. Real-time hazardous waste manifest tracking (Form 4) from collection center to recycler ensuring 100% chain-of-custody documentation. Integration with SPCB/PCC digital E-waste authorization renewal system with 180-day advance compliance alerts. Online EPR certificate generation and annual return filing (Form 3) for all PRO (Producer Responsibility Organizations) across India.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-green-800">Critical</span><span className="text-gray-400">Live</span></div></CardContent></Card>
            <Card className="ewc-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">Urban Mining Precious Metal Recovery Analytics</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>AI-powered urban mining analytics tracking gold, silver, copper, palladium, and rare earth recovery from 8,500+ MT of e-waste processed annually across India. Real-time hydrometallurgical and pyrometallurgical process optimization achieving 99.2% copper recovery from PCB assemblies and 94.8% gold dissolution from BGA chips. Integration with London Bullion Market Association (LBMA) pricing feed for real-time recovered precious metal valuation. Blockchain-anchored material balance sheets for each processing batch ensuring transparent audit trail for customs and excise compliance. Predictive feedstock quality assessment using XRF spectrometer data for optimal smelter feed blending.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-800">Operational</span><span className="text-gray-400">Q3 2026</span></div></CardContent></Card>
            <Card className="ewc-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">Li-Ion Battery EV Waste Circular Economy</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>FAME II and PM E-DRIVE scheme integration tracking 48,000+ metric tonnes of EV battery waste from 2,200+ collection points across India. Real-time Li-Ion battery health assessment using OCV voltage and internal resistance measurements for 2nd life vs recycling routing decisions. Automated NMC/LFP chemistry identification and cobalt/lithium/nickel recovery tracking for 8 authorized battery recyclers under Battery Waste Management Rules 2022. Integration with vehicle scrappage facility (RSF) network for mandatory EV battery pre-dismantle extraction under Central Motor Vehicles Rules. AI-powered battery degradation prediction model using BMS telemetry data enabling proactive collection scheduling before catastrophic cell failure.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-teal-100 px-2 py-0.5 text-teal-800">Strategic</span><span className="text-gray-400">FY2027</span></div></CardContent></Card>
            <Card className="ewc-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">AI E-Waste Sorting & Robotic Dismantling</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Computer vision-based automated e-waste sorting system classifying 42 device categories with 98.6% accuracy at 120 items per minute throughput. Robotic dismantling cell with 6-axis robotic arm handling hazardous CRT and Li-Ion battery extraction reducing worker exposure to mercury and lead fumes by 100%. Integration with IoT-enabled smart bins across 4,500+ bulk consumer and corporate collection points with fill-level monitoring and automated pickup scheduling. Digital Material Passport for each collected device tracking composition, weight, and recovery potential through the entire circular value chain. AI-driven demand-supply matching between collection centers and recyclers optimizing logistics costs by 28% and reducing average transit time by 35%.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-lime-100 px-2 py-0.5 text-lime-800">Innovation</span><span className="text-gray-400">Pilot</span></div></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
