import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#d97706', '#b45309', '#f59e0b', '#fbbf24', '#fde68a', '#78350f', '#451a03', '#fef3c7']

const PANEL_TYPES = ['Mono PERC 550W', 'Poly 450W', 'Bifacial 600W', 'Thin Film CdTe', 'TOPCon 660W', 'HJT 580W', 'Flexible CIGS', 'Micro Inverter Panel']
const INSTALLERS = ['Adani Solar', 'Tata Power Solar', 'Vikram Solar', 'Waaree Energies', 'ReNew Power', 'Azure Power', 'Hero Future', 'Kotak Surya']
const DISPATCH_STATUS = ['QC Certified', 'Flash Tested', 'In Transit', 'Warehouse Stored', 'Pending IEC', 'Awaiting Dispatch']

const solarRecords = [
  { id: 'SOL-0001', panel: 'Mono PERC 550W', description: '72-cell monocrystalline PERC module IS 14286 certified 550Wp for 200MW Rajasthan solar park with PID-resistant encapsulant', installer: 'Adani Solar', quantity: 36000, unit: 'panels', dispatch_status: 'QC Certified', lot: 'LOT-SOL-9051', destination: 'Bhadla Phase-IV Rajasthan', received: '2026-07-30', batch: 'SOL-B2026-0730', cost_inr: 198000000, efficiency_pct: 21.3, iec_cert: 'IS 14286' },
  { id: 'SOL-0002', panel: 'Bifacial 600W', description: '144-cell dual-glass bifacial 600Wp module with 30% rear gain for canal-top installation Gujarat State NFSM', installer: 'Tata Power Solar', quantity: 24000, unit: 'panels', dispatch_status: 'Flash Tested', lot: 'LOT-SOL-9048', destination: 'Canal Top Kutch Gujarat', received: '2026-07-30', batch: 'SOL-B2026-0729', cost_inr: 172800000, efficiency_pct: 22.8, iec_cert: 'IEC 61215' },
  { id: 'SOL-0003', panel: 'TOPCon 660W', description: 'N-type TOPCon 660Wp module 23.5% efficiency for PM Surya Ghar rooftop subsidy scheme 8kW residential systems', installer: 'Vikram Solar', quantity: 12000, unit: 'panels', dispatch_status: 'In Transit', lot: 'LOT-SOL-9042', destination: 'PM Surya Ghar Lucknow UP', received: '2026-07-29', batch: 'SOL-B2026-0728', cost_inr: 95040000, efficiency_pct: 23.5, iec_cert: 'IS 14286' },
  { id: 'SOL-0004', panel: 'Poly 450W', description: '60-cell polycrystalline 450Wp module for SECI 2GW Khandwa auction solar farm Madhya Pradesh grid-connected', installer: 'Waaree Energies', quantity: 48000, unit: 'panels', dispatch_status: 'Warehouse Stored', lot: 'LOT-SOL-9038', destination: 'Khandwa Solar Farm MP', received: '2026-07-29', batch: 'SOL-B2026-0727', cost_inr: 165600000, efficiency_pct: 18.7, iec_cert: 'IEC 61730' },
  { id: 'SOL-0005', panel: 'HJT 580W', description: 'Heterojunction Technology 580Wp silicon module 23.2% efficiency for floating solar on Narmada reservoir Gujarat', installer: 'ReNew Power', quantity: 18000, unit: 'panels', dispatch_status: 'Pending IEC', lot: 'LOT-SOL-9035', destination: 'Narmada Floating Gujarat', received: '2026-07-28', batch: 'SOL-B2026-0726', cost_inr: 145800000, efficiency_pct: 23.2, iec_cert: 'IEC 61215' },
  { id: 'SOL-0006', panel: 'Thin Film CdTe', description: 'First Solar Series 6 CdTe thin-film 420W module for 1GW utility project Bhadla Phase-V Jaisalmer', installer: 'Azure Power', quantity: 62000, unit: 'panels', dispatch_status: 'QC Certified', lot: 'LOT-SOL-9032', destination: 'Bhadla Phase-V Jaisalmer', received: '2026-07-28', batch: 'SOL-B2026-0725', cost_inr: 223200000, efficiency_pct: 19.2, iec_cert: 'UL 1703' },
  { id: 'SOL-0007', panel: 'Flexible CIGS', description: 'CIGS flexible thin-film 350W module for Himalayan off-grid telecom tower power system BSNL installations', installer: 'Hero Future', quantity: 8000, unit: 'panels', dispatch_status: 'Awaiting Dispatch', lot: 'LOT-SOL-9029', destination: 'BSNL Towers Arunachal', received: '2026-07-27', batch: 'SOL-B2026-0724', cost_inr: 32000000, efficiency_pct: 16.8, iec_cert: 'IEC 61646' },
  { id: 'SOL-0008', panel: 'Micro Inverter Panel', description: 'AC module integrated Enphase IQ8 400W micro-inverter panel for premium residential solar+storage Delhi NCR', installer: 'Kotak Surya', quantity: 6000, unit: 'panels', dispatch_status: 'Flash Tested', lot: 'LOT-SOL-9026', destination: 'Delhi NCR Residential', received: '2026-07-27', batch: 'SOL-B2026-0723', cost_inr: 48000000, efficiency_pct: 20.5, iec_cert: 'IS 16221' },
  { id: 'SOL-0009', panel: 'Mono PERC 550W', description: 'High-efficiency PERC module 550Wp for 50MW solar-powered cold storage chain Maharashtra agricultural hub Nashik', installer: 'Adani Solar', quantity: 9000, unit: 'panels', dispatch_status: 'In Transit', lot: 'LOT-SOL-9023', destination: 'Nashik Cold Storage MH', received: '2026-07-26', batch: 'SOL-B2026-0722', cost_inr: 49500000, efficiency_pct: 21.4, iec_cert: 'IS 14286' },
  { id: 'SOL-0010', panel: 'Bifacial 600W', description: 'Dual-glass bifacial 600Wp for PM-KUSUM grid-connected agricultural pump solarization 7.5HP Karnataka', installer: 'Tata Power Solar', quantity: 15000, unit: 'panels', dispatch_status: 'QC Certified', lot: 'LOT-SOL-9020', destination: 'PM-KUSUM Karnataka', received: '2026-07-26', batch: 'SOL-B2026-0721', cost_inr: 108000000, efficiency_pct: 22.6, iec_cert: 'IEC 61215' },
  { id: 'SOL-0011', panel: 'TOPCon 660W', description: 'N-type TOPCon 660Wp for ISRO satellite ground station solar farm Sriharikota 10MW captive power', installer: 'Vikram Solar', quantity: 3000, unit: 'panels', dispatch_status: 'Warehouse Stored', lot: 'LOT-SOL-9017', destination: 'ISRO Sriharikota AP', received: '2026-07-25', batch: 'SOL-B2026-0720', cost_inr: 23760000, efficiency_pct: 23.5, iec_cert: 'IS 14286' },
  { id: 'SOL-0012', panel: 'Poly 450W', description: '60-cell poly 450Wp for railway station rooftop solar mission 5000 stations Indian Railways LED integration', installer: 'Waaree Energies', quantity: 36000, unit: 'panels', dispatch_status: 'Flash Tested', lot: 'LOT-SOL-9014', destination: 'IR Roof Top Pan-India', received: '2026-07-25', batch: 'SOL-B2026-0719', cost_inr: 124200000, efficiency_pct: 18.9, iec_cert: 'IEC 61730' },
  { id: 'SOL-0013', panel: 'HJT 580W', description: 'HJT 580Wp for 100MW green hydrogen electrolyzer solar farm Jamnagar Reliance Sagar project', installer: 'ReNew Power', quantity: 30000, unit: 'panels', dispatch_status: 'Pending IEC', lot: 'LOT-SOL-9011', destination: 'Reliance Sagar Gujarat', received: '2026-07-24', batch: 'SOL-B2026-0718', cost_inr: 243000000, efficiency_pct: 23.1, iec_cert: 'IEC 61215' },
  { id: 'SOL-0014', panel: 'Thin Film CdTe', description: 'CdTe 420Wp for solar tree installations in 200 smart cities mission urban areas central government buildings', installer: 'Azure Power', quantity: 5000, unit: 'panels', dispatch_status: 'Awaiting Dispatch', lot: 'LOT-SOL-9008', destination: 'Smart Cities Mission', received: '2026-07-24', batch: 'SOL-B2026-0717', cost_inr: 18000000, efficiency_pct: 19.0, iec_cert: 'UL 1703' },
  { id: 'SOL-0015', panel: 'Flexible CIGS', description: 'CIGS flexible 350W for Indian Army forward posts Siachen glacier high-altitude solar power 6000m installations', installer: 'Hero Future', quantity: 4000, unit: 'panels', dispatch_status: 'QC Certified', lot: 'LOT-SOL-9005', destination: 'IA Siachen Ladakh', received: '2026-07-23', batch: 'SOL-B2026-0716', cost_inr: 28000000, efficiency_pct: 17.0, iec_cert: 'IEC 61646' },
  { id: 'SOL-0016', panel: 'Micro Inverter Panel', description: 'AC module Enphase IQ8 400W for IIT research lab net-zero campus solar+EV charging 150kW IIT Bombay', installer: 'Kotak Surya', quantity: 7500, unit: 'panels', dispatch_status: 'In Transit', lot: 'LOT-SOL-9002', destination: 'IIT Bombay Campus', received: '2026-07-23', batch: 'SOL-B2026-0715', cost_inr: 60000000, efficiency_pct: 20.8, iec_cert: 'IS 16221' },
  { id: 'SOL-0017', panel: 'Mono PERC 550W', description: 'PERC 550Wp for DDA housing society common area solar 2MW under PM Surya Ghar subsidy Phase-II Delhi', installer: 'Adani Solar', quantity: 7200, unit: 'panels', dispatch_status: 'Warehouse Stored', lot: 'LOT-SOL-9047', destination: 'DDA Housing Delhi', received: '2026-07-22', batch: 'SOL-B2026-0714', cost_inr: 39600000, efficiency_pct: 21.2, iec_cert: 'IS 14286' },
  { id: 'SOL-0018', panel: 'Bifacial 600W', description: 'Bifacial 600Wp dual-glass for NTPC 500MW Anantapur ultra-mega solar park Andhra Pradesh transmission hub', installer: 'Tata Power Solar', quantity: 42000, unit: 'panels', dispatch_status: 'Flash Tested', lot: 'LOT-SOL-9044', destination: 'NTPC Anantapur AP', received: '2026-07-22', batch: 'SOL-B2026-0713', cost_inr: 302400000, efficiency_pct: 22.7, iec_cert: 'IEC 61215' },
  { id: 'SOL-0019', panel: 'TOPCon 660W', description: 'TOPCon 660Wp N-type for Kerala 500MW floating solar Vembanad backwaters fishing community solarization', installer: 'Vikram Solar', quantity: 8000, unit: 'panels', dispatch_status: 'QC Certified', lot: 'LOT-SOL-9041', destination: 'Vembanad Floating Kerala', received: '2026-07-21', batch: 'SOL-B2026-0712', cost_inr: 63360000, efficiency_pct: 23.4, iec_cert: 'IS 14286' },
  { id: 'SOL-0020', panel: 'Poly 450W', description: 'Poly 450Wp for airport solarization AAI 50 airports captive power DG set replacement Phase-III', installer: 'Waaree Energies', quantity: 20000, unit: 'panels', dispatch_status: 'Pending IEC', lot: 'LOT-SOL-9039', destination: 'AAI Airports India', received: '2026-07-21', batch: 'SOL-B2026-0711', cost_inr: 69000000, efficiency_pct: 18.5, iec_cert: 'IEC 61730' },
]

const genRecords = (start: number) => {
  const statuses = ['QC Certified', 'Flash Tested', 'In Transit', 'Warehouse Stored', 'Pending IEC', 'Awaiting Dispatch']
  const destinations = ['Bhadla Phase-IV Rajasthan', 'Canal Top Kutch Gujarat', 'PM Surya Ghar UP', 'Khandwa Solar MP', 'Narmada Floating Gujarat', 'BSNL Towers NE', 'IR Roof Top Pan-India', 'Smart Cities Mission', 'ISRO Sriharikota AP', 'Reliance Sagar Gujarat', 'NTPC Anantapur AP', 'Vembanad Floating Kerala']
  return Array.from({ length: 40 }, (_, i) => ({
    id: `SOL-${String(start + i).padStart(4, '0')}`,
    panel: PANEL_TYPES[(start + i) % 8],
    description: `${PANEL_TYPES[(start + i) % 8]} module Lot ${String((start + i) % 99 + 1).padStart(3, '0')} for solar installation`,
    installer: INSTALLERS[(start + i) % 8],
    quantity: Math.round(2000 + Math.random() * 60000),
    unit: 'panels',
    dispatch_status: statuses[(start + i) % 6],
    lot: `LOT-SOL-${String(9021 + start + i)}`,
    destination: destinations[(start + i) % 12],
    received: `2026-07-${String(20 - Math.floor((start + i) / 10)).padStart(2, '0')}`,
    batch: `SOL-B2026-${String(710 - Math.floor((start + i) / 3)).padStart(4, '0')}`,
    cost_inr: Math.round(15000000 + Math.random() * 280000000),
    efficiency_pct: Math.round((16 + Math.random() * 8) * 10) / 10,
    iec_cert: ['IS 14286', 'IEC 61215', 'IEC 61730', 'UL 1703', 'IEC 61646', 'IS 16221'][i % 6],
  }))
}

const allSolar = [...solarRecords, ...genRecords(21), ...genRecords(61)]

function ri(min: number, max: number, value: number) {
  return Math.max(min, Math.min(max, value))
}

const filterGroups = [
  {
    key: 'panel',
    label: 'Panel Type',
    options: PANEL_TYPES.map(t => ({ label: t, value: t, count: allSolar.filter(r => r.panel === t).length })),
  },
  {
    key: 'installer',
    label: 'Installer',
    options: INSTALLERS.map(r => ({ label: r, value: r, count: allSolar.filter(rec => rec.installer === r).length })),
  },
  {
    key: 'dispatch_status',
    label: 'Dispatch Status',
    options: DISPATCH_STATUS.map(s => ({ label: s, value: s, count: allSolar.filter(r => r.dispatch_status === s).length })),
  },
]

function PanelBadge({ panel }: { panel: string }) {
  const colors: Record<string, string> = { 'Mono PERC 550W': 'bg-amber-100 text-amber-800', 'Poly 450W': 'bg-yellow-100 text-yellow-800', 'Bifacial 600W': 'bg-orange-100 text-orange-800', 'Thin Film CdTe': 'bg-lime-100 text-lime-800', 'TOPCon 660W': 'bg-red-100 text-red-800', 'HJT 580W': 'bg-rose-100 text-rose-800', 'Flexible CIGS': 'bg-teal-100 text-teal-800', 'Micro Inverter Panel': 'bg-cyan-100 text-cyan-800' }
  return <span className={`sol-panel-badge inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[panel] || 'bg-gray-100 text-gray-800'}`}>{panel}</span>
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = { 'QC Certified': 'bg-green-100 text-green-800', 'Flash Tested': 'bg-blue-100 text-blue-800', 'In Transit': 'bg-amber-100 text-amber-800', 'Warehouse Stored': 'bg-slate-100 text-slate-800', 'Pending IEC': 'bg-yellow-100 text-yellow-800', 'Awaiting Dispatch': 'bg-gray-200 text-gray-700' }
  return <span className={`sol-status-badge inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-700'}`}>{status}</span>
}

function CostBar({ cost }: { cost: number }) {
  const pct = ri(0, 100, (cost / 300000000) * 100)
  const color = cost >= 200000000 ? 'bg-amber-600' : cost >= 100000000 ? 'bg-amber-500' : cost >= 50000000 ? 'bg-amber-400' : 'bg-amber-300'
  return <div className="sol-cost-bar flex items-center gap-2"><div className="h-2 w-20 rounded-full bg-gray-200"><div className={`sol-cost-bar-fill h-2 rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} /></div><span className="text-xs text-gray-500">{'₹' + (cost / 10000000).toFixed(1) + 'Cr'}</span></div>
}

function HealthRing({ value, label, color }: { value: number; label: string; color: string }) {
  const r = 28, cx = 35, cy = 35, sw = 5
  const circ = 2 * Math.PI * r
  const offset = circ - (ri(0, 100, value) / 100) * circ
  return <div className="sol-health-ring flex flex-col items-center"><svg width={70} height={70} className="-rotate-90"><circle cx={cx} cy={cy} r={r} fill="none" stroke="#e5e7eb" strokeWidth={sw} /><circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={sw} strokeDasharray={circ} strokeDashoffset={offset} className="sol-ring-path" strokeLinecap="round" /></svg><span className="sol-ring-value mt-1 text-sm font-bold" style={{ color }}>{value}%</span><span className="text-xs text-gray-500">{label}</span></div>
}

function KpiTile({ title, value, sub }: { title: string; value: string; sub: string }) {
  return <Card className="sol-kpi-card"><CardContent className="p-4"><p className="text-xs text-gray-500">{title}</p><p className="sol-kpi-value mt-1 text-2xl font-bold">{value}</p><p className="text-xs text-gray-400 mt-0.5">{sub}</p></CardContent></Card>
}

function ValueTile({ title, value, trend }: { title: string; value: string; trend: string }) {
  const up = trend.startsWith('+')
  return <Card className="sol-value-tile"><CardContent className="p-4"><p className="text-xs text-gray-500">{title}</p><p className="mt-1 text-xl font-bold">{value}</p><p className={`text-xs mt-0.5 ${up ? 'text-green-600' : 'text-red-500'}`}>{trend}</p></CardContent></Card>
}

export default function SolarEnergyLogisticsView() {
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

  const filtered = allSolar.filter(e => {
    const q = searchQuery.toLowerCase()
    if (q && !e.id.toLowerCase().includes(q) && !e.panel.toLowerCase().includes(q) && !e.description.toLowerCase().includes(q) && !e.installer.toLowerCase().includes(q) && !e.destination.toLowerCase().includes(q)) return false
    return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(e[key as keyof typeof e] as string))
  })

  const totalCost = allSolar.reduce((s, e) => s + e.cost_inr, 0)
  const totalPanels = allSolar.reduce((s, e) => s + e.quantity, 0)
  const qcPassed = allSolar.filter(e => e.dispatch_status === 'QC Certified').length
  const inTransit = allSolar.filter(e => e.dispatch_status === 'In Transit').length

  const monthlyData = [
    { month: 'Jan', panels: 120000, value_cr: 180, efficiency: 21.5 },
    { month: 'Feb', panels: 185000, value_cr: 295, efficiency: 21.8 },
    { month: 'Mar', panels: 240000, value_cr: 385, efficiency: 22.1 },
    { month: 'Apr', panels: 160000, value_cr: 252, efficiency: 21.9 },
    { month: 'May', panels: 310000, value_cr: 498, efficiency: 22.4 },
    { month: 'Jun', panels: 95000, value_cr: 142, efficiency: 22.0 },
    { month: 'Jul', panels: 350000, value_cr: 568, efficiency: 22.6 },
  ]
  const panelData = PANEL_TYPES.map(t => ({ panel: t.split(' ').slice(0, 2).join(' '), count: allSolar.filter(r => r.panel === t).reduce((s, r) => s + r.quantity, 0) }))
  const installerData = INSTALLERS.map(r => ({ installer: r, count: allSolar.filter(rec => rec.installer === r).reduce((s, rec) => s + rec.quantity, 0) }))

  const tabs = [
    { value: 'dashboard', label: 'Dashboard' },
    { value: 'shipments', label: 'Shipments' },
    { value: 'analytics', label: 'Analytics' },
    { value: 'insights', label: 'Insights' },
  ]

  return (
    <div className="sol-container space-y-4">
      <PageHeader title="Solar Energy Logistics" description="Pan-India solar PV module warehousing, flash testing, IEC certification tracking, and reverse logistics with MNRE ALMM (Approved List of Models and Manufacturers) compliance, PM Surya Ghar rooftop subsidy fulfillment, SECI/NTPC utility-scale project dispatch, and PM-KUSUM agricultural pump solarization supply chain management" />
      <ModuleBreadcrumb items={[{ label: 'Energy' }, { label: 'Solar Logistics' }]} />
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="sol-tabs-list">
          {tabs.map(t => <TabsTrigger key={t.value} value={t.value} className="sol-tab-trigger">{t.label}</TabsTrigger>)}
        </TabsList>

        <TabsContent value="dashboard" className="sol-tab-content space-y-4 mt-4">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <KpiTile title="Total Consignments" value={allSolar.length.toString()} sub="Solar panel lots" />
            <KpiTile title="Total Panels" value={`${(totalPanels / 1000).toFixed(0)}K`} sub="PV modules across lots" />
            <KpiTile title="Total Value" value={`₹${(totalCost / 10000000).toFixed(0)}Cr`} sub="Procurement value" />
            <KpiTile title="In Transit" value={inTransit.toString()} sub={`${((inTransit / allSolar.length) * 100).toFixed(0)}% in pipeline`} />
          </div>
          <div className="grid gap-4 grid-cols-3 md:grid-cols-6">
            <HealthRing value={97} label="MNRE ALMM" color="#d97706" />
            <HealthRing value={94} label="IEC Certified" color="#b45309" />
            <HealthRing value={91} label="Avg Efficiency" color="#f59e0b" />
            <HealthRing value={88} label="On-Time Delivery" color="#78350f" />
            <HealthRing value={96} label="Flash Test Pass" color="#fbbf24" />
            <HealthRing value={93} label="Damage Free" color="#fde68a" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="sol-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Monthly Panel Dispatch & Avg Efficiency %</CardTitle></CardHeader><CardContent><LineChart data={monthlyData} width={300} height={200}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" fontSize={12} /><YAxis fontSize={12} /><Tooltip /><Legend /><Line type="monotone" dataKey="panels" stroke="#d97706" strokeWidth={2} /><Line type="monotone" dataKey="efficiency" stroke="#b45309" strokeWidth={2} strokeDasharray="5 5" /></LineChart></CardContent></Card>
            <Card className="sol-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Panel Dispatch by Technology Type</CardTitle></CardHeader><CardContent><BarChart data={panelData} width={300} height={200}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="panel" fontSize={10} angle={-30} textAnchor="end" height={50} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="count" fill="#d97706" radius={[4,4,0,0]} /></BarChart></CardContent></Card>
            <Card className="sol-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Installer Panel Distribution</CardTitle></CardHeader><CardContent><PieChart width={300} height={200}><Pie data={installerData} dataKey="count" nameKey="installer" cx="50%" cy="50%" outerRadius={70} label={({ installer, count }) => `${(count / 1000).toFixed(0)}K`}>{installerData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="shipments" className="sol-tab-content space-y-4 mt-4">
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={allSolar.length} filteredCount={filtered.length} onRefresh={() => {}} placeholder="Search by ID, panel type, installer, destination, or lot..." />
          <div className="overflow-x-auto rounded-lg border">
            <table className="sol-table w-full text-sm">
              <thead><tr className="sol-table-header bg-gray-50"><th className="px-3 py-2 text-left font-medium">ID</th><th className="px-3 py-2 text-left font-medium">Panel</th><th className="px-3 py-2 text-left font-medium">Status</th><th className="px-3 py-2 text-left font-medium">Qty</th><th className="px-3 py-2 text-left font-medium">Value</th><th className="px-3 py-2 text-left font-medium">Installer</th><th className="px-3 py-2 text-left font-medium">Destination</th><th className="px-3 py-2 text-left font-medium">Eff%</th><th className="px-3 py-2 text-left font-medium">IEC</th></tr></thead>
              <tbody>{filtered.slice(0, 20).map(e => (
                <tr key={e.id} className="sol-table-row border-t hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-2 font-mono text-xs">{e.id}</td>
                  <td className="px-3 py-2"><PanelBadge panel={e.panel} /></td>
                  <td className="px-3 py-2"><StatusBadge status={e.dispatch_status} /></td>
                  <td className="px-3 py-2 text-xs">{(e.quantity / 1000).toFixed(1)}K</td>
                  <td className="px-3 py-2"><CostBar cost={e.cost_inr} /></td>
                  <td className="px-3 py-2 text-xs">{e.installer}</td>
                  <td className="px-3 py-2 text-xs">{e.destination}</td>
                  <td className="px-3 py-2 text-xs">{e.efficiency_pct}%</td>
                  <td className="px-3 py-2 text-xs font-mono">{e.iec_cert}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="sol-tab-content space-y-4 mt-4">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <ValueTile title="Avg Module Efficiency" value="21.8%" trend="+0.6% vs FY25" />
            <ValueTile title="Capacity Dispatched" value="2.8GWp" trend="+35.2% YoY growth" />
            <ValueTile title="ALMM Compliance" value="99.1%" trend="+2.3% improved" />
            <ValueTile title="PM Surya Ghar Units" value="485K" trend="+120% rooftop" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="sol-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Procurement Value by Panel Technology</CardTitle></CardHeader><CardContent><BarChart data={PANEL_TYPES.map(t => ({ panel: t.split(' ').slice(0, 2).join(' '), total: allSolar.filter(r => r.panel === t).reduce((s, r) => s + r.cost_inr, 0) / 10000000 }))} width={400} height={250}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="panel" fontSize={10} angle={-30} textAnchor="end" height={50} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="total" fill="#b45309" radius={[4,4,0,0]} /></BarChart></CardContent></Card>
            <Card className="sol-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Dispatch Status Breakdown</CardTitle></CardHeader><CardContent><PieChart width={400} height={250}><Pie data={DISPATCH_STATUS.map(s => ({ status: s, count: allSolar.filter(e => e.dispatch_status === s).length }))} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={80} label>{DISPATCH_STATUS.map((_, i) => <Cell key={i} fill={['#22c55e','#3b82f6','#f59e0b','#64748b','#eab308','#9ca3af'][i]} />)}</Pie><Tooltip /></PieChart></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="sol-tab-content space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="sol-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">MNRE ALMM (Approved List of Models & Manufacturers) Digital Registry</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Ministry of New and Renewable Energy (MNRE) ALMM digital compliance tracking for all solar PV models and manufacturers approved under Order dated 24.12.2021. Real-time verification of 3,800+ approved models from 142 manufacturers against IEC/IS test reports from NABL-accredited labs. Automated BIS CRS (Conformity Assessment Scheme) certificate expiry monitoring with 90-day advance alerts preventing non-compliant module procurement. Integration with MNRE solar park allocation portal tracking 42GW of utility-scale project pipeline with module technology mapping. QR-code based module traceability from factory gate to project site ensuring anti-dumping duty compliance and domestic content requirement verification for government tender eligibility.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-amber-800">Critical</span><span className="text-gray-400">Live</span></div></CardContent></Card>
            <Card className="sol-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">PM Surya Ghar Muft Bijli Yojana Rooftop Integration</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Pradhan Mantri Surya Ghar Muft Bijli Yojana (PM-SGMBY) rooftop solar subsidy scheme tracking with 1.28 crore household registrations and 48.5 lakh installations completed. Real-time discom net metering approval workflow automation across 3,200+ electricity distribution companies in 36 states and UTs. Automated subsidy disbursement tracking through Direct Benefit Transfer (DBT) with Ministry of Power integration reducing processing time from 45 days to 12 days. Module-level performance monitoring via IoT-enabled smart meters detecting underperformance, PID degradation, and potential-induced defects within 48 hours. Integration with State Energy Department dashboards providing real-time rooftop capacity addition tracking against national 40GW rooftop target by FY2026.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5 text-yellow-800">National Mission</span><span className="text-gray-400">FY2026</span></div></CardContent></Card>
            <Card className="sol-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">SECI/NTPC Ultra-Mega Solar Park Supply Chain Optimization</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Solar Energy Corporation of India (SECI) and NTPC ultra-mega solar park logistics optimization covering 42 operational parks totaling 28.5GW capacity across 14 states. AI-powered demand forecasting model predicting quarterly module requirements 6 months ahead with 94% accuracy enabling pre-positioned inventory at regional warehouses in Jaisalmer, Anantapur, and Rewa. Multi-modal logistics planning integrating rail freight ( Container Corporation of India CONCOR), road transport, and specialized heavy-haul ODC (Over-Dimensional Cargo) movement for 12M+ module shipments annually. Weather-integrated dispatch scheduling avoiding monsoon season damage losses and optimizing transit through 8 solar corridor hubs with automated loading/unloading systems achieving 0.02% breakage rate.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-orange-100 px-2 py-0.5 text-orange-800">Strategic</span><span className="text-gray-400">Q4 2026</span></div></CardContent></Card>
            <Card className="sol-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">AI-Powered Flash Testing & Degradation Analytics</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Factory-gate and warehouse flash testing data analytics processing 2.5 million IV curve measurements daily from 120+ flash test stations across India. Machine learning model detecting potential-induced degradation (PID) risk modules with 97.2% accuracy 6 months before visible power loss onset. Electroluminescence (EL) imaging integration for micro-crack and hot-spot detection in incoming quality control reducing field failures by 38%. Real-time temperature coefficient (TC) analysis ensuring modules meet IEC 61215 thermal cycling 200-cycle requirement for Indian climate zones. Digital twin simulation predicting 25-year energy yield for each batch using local irradiance data, soiling losses, and degradation curves for bankable performance guarantee management.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-lime-100 px-2 py-0.5 text-lime-800">Innovation</span><span className="text-gray-400">Pilot</span></div></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
