import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#1d4ed8', '#1e40af', '#2563eb', '#60a5fa', '#93c5fd', '#172554', '#1e3a8a', '#bfdbfe']

const PART_TYPES = ['Turbofan Blade', 'Landing Gear Assy', 'Avionics LRU', 'Hydraulic Actuator', 'APU Module', 'Composite Panel', 'Flight Control Rod', 'Fuel System Valve']
const MRO_FACILITIES = ['HAL Bengaluru', 'Air India MRO Delhi', 'GMR Aero Hyderabad', 'AIESL Mumbai', 'BEL Bengaluru', 'DRDO Hyderabad', 'Boeing MRO Nagpur', 'Airbus TAT Delhi']
const CERT_STATUS = ['DGCA Released', 'FAA 8130-3', 'EASA Form 1', 'Under Inspection', 'Discrepancy Found', 'Pending OEM']

const mroRecords = [
  { id: 'AMR-0001', part: 'Turbofan Blade', description: 'GE CFM56-7B HPT Blade Set Stage 1 Ti-Alloy', facility: 'HAL Bengaluru', quantity: 24, unit: 'blades', cert_status: 'DGCA Released', lot: 'LOT-AMR-9041', destination: 'IndiGo A320neo VT-ILK', received: '2026-07-30', batch: 'AMR-B2026-0721', cost_inr: 42000000, trace_ts: 'FAA-PMA', service_hours: 12500 },
  { id: 'AMR-0002', part: 'Landing Gear Assy', description: 'Boeing 737-8 NLG Main Shock Strut Overhaul', facility: 'Air India MRO Delhi', quantity: 1, unit: 'assembly', cert_status: 'FAA 8130-3', lot: 'LOT-AMR-9038', destination: 'Air India B737-8 VT-PPJ', received: '2026-07-30', batch: 'AMR-B2026-0720', cost_inr: 185000000, trace_ts: 'OEM-Service', service_hours: 28400 },
  { id: 'AMR-0003', part: 'Avionics LRU', description: 'Honeywell FMC CDU Display Unit 737NG P/N 211A5', facility: 'GMR Aero Hyderabad', quantity: 2, unit: 'units', cert_status: 'Under Inspection', lot: 'LOT-AMR-9012', destination: 'SpiceJet B737-800 SG-8953', received: '2026-07-29', batch: 'AMR-B2026-0719', cost_inr: 24000000, trace_ts: 'EASA-Form1', service_hours: 8200 },
  { id: 'AMR-0004', part: 'Hydraulic Actuator', description: 'Moog Flap Actuator A320 CFM LE Mfg 2024', facility: 'AIESL Mumbai', quantity: 4, unit: 'actuators', cert_status: 'EASA Form 1', lot: 'LOT-AMR-9027', destination: 'Vistara A321neo VT-PPX', received: '2026-07-29', batch: 'AMR-B2026-0718', cost_inr: 68000000, trace_ts: 'OEM-New', service_hours: 1200 },
  { id: 'AMR-0005', part: 'APU Module', description: 'Honeywell 131-9A APU Hot Section Inspection Kit', facility: 'BEL Bengaluru', quantity: 1, unit: 'module', cert_status: 'Discrepancy Found', lot: 'LOT-AMR-9031', destination: 'IndiGo A320ceo VT-IKL', received: '2026-07-28', batch: 'AMR-B2026-0716', cost_inr: 92000000, trace_ts: 'OEM-Service', service_hours: 15000 },
  { id: 'AMR-0006', part: 'Composite Panel', description: 'Airbus A350-900 Lower Wing Skin Panel CFRP', facility: 'DRDO Hyderabad', quantity: 6, unit: 'panels', cert_status: 'DGCA Released', lot: 'LOT-AMR-9040', destination: 'Air India A350-900 VT-ANI', received: '2026-07-28', batch: 'AMR-B2026-0715', cost_inr: 56000000, trace_ts: 'EASA-Form1', service_hours: 3500 },
  { id: 'AMR-0007', part: 'Flight Control Rod', description: 'A320 Slat Actuator Pushrod HF8 Steel', facility: 'Boeing MRO Nagpur', quantity: 8, unit: 'rods', cert_status: 'Pending OEM', lot: 'LOT-AMR-9008', destination: 'Akasa Air B737-8 VT-IXP', received: '2026-07-27', batch: 'AMR-B2026-0714', cost_inr: 12000000, trace_ts: 'FAA-PMA', service_hours: 6800 },
  { id: 'AMR-0008', part: 'Fuel System Valve', description: 'B737 Fuel Shut-Off Valve 28VDC Collins Aerospace', facility: 'Airbus TAT Delhi', quantity: 2, unit: 'valves', cert_status: 'Under Inspection', lot: 'LOT-AMR-9037', destination: 'Vistara B787-9 VT-TSG', received: '2026-07-27', batch: 'AMR-B2026-0713', cost_inr: 15000000, trace_ts: 'OEM-New', service_hours: 500 },
  { id: 'AMR-0009', part: 'Turbofan Blade', description: 'LEAP-1A HPC Blade Set Stage 3 Ti-6Al-4V', facility: 'HAL Bengaluru', quantity: 36, unit: 'blades', cert_status: 'FAA 8130-3', lot: 'LOT-AMR-9039', destination: 'IndiGo A321neo VT-ISB', received: '2026-07-26', batch: 'AMR-B2026-0711', cost_inr: 64000000, trace_ts: 'OEM-Service', service_hours: 9800 },
  { id: 'AMR-0010', part: 'Landing Gear Assy', description: 'A320 NLG Steering Collar Overhaul Safran', facility: 'GMR Aero Hyderabad', quantity: 2, unit: 'assemblies', cert_status: 'DGCA Released', lot: 'LOT-AMR-9026', destination: 'AirAsia India A320-200 VT-ATR', received: '2026-07-26', batch: 'AMR-B2026-0710', cost_inr: 220000000, trace_ts: 'EASA-Form1', service_hours: 32000 },
  { id: 'AMR-0011', part: 'Avionics LRU', description: 'Thales FMS TCAS Computer A320 Fit 7', facility: 'AIESL Mumbai', quantity: 1, unit: 'unit', cert_status: 'Under Inspection', lot: 'LOT-AMR-9011', destination: 'Alliance Air ATR-72 VT-AAR', received: '2026-07-25', batch: 'AMR-B2026-0708', cost_inr: 35000000, trace_ts: 'FAA-PMA', service_hours: 15000 },
  { id: 'AMR-0012', part: 'Hydraulic Actuator', description: 'A330 Rudder PCU Actuator Moog MFG-2025', facility: 'Boeing MRO Nagpur', quantity: 1, unit: 'actuator', cert_status: 'Discrepancy Found', lot: 'LOT-AMR-9007', destination: 'Air India A330neo VT-ANH', received: '2026-07-25', batch: 'AMR-B2026-0707', cost_inr: 42000000, trace_ts: 'OEM-New', service_hours: 200 },
  { id: 'AMR-0013', part: 'APU Module', description: 'APS3200 APU Hamilton Sundstrand Hot Section', facility: 'BEL Bengaluru', quantity: 1, unit: 'module', cert_status: 'Pending OEM', lot: 'LOT-AMR-9030', destination: 'IndiGo A320neo VT-IZR', received: '2026-07-24', batch: 'AMR-B2026-0705', cost_inr: 78000000, trace_ts: 'OEM-Service', service_hours: 18200 },
  { id: 'AMR-0014', part: 'Composite Panel', description: 'B777-300ER Horizontal Stabilizer Tip Fairing', facility: 'DRDO Hyderabad', quantity: 2, unit: 'panels', cert_status: 'DGCA Released', lot: 'LOT-AMR-9025', destination: 'Air India B777-300ER VT-ALH', received: '2026-07-24', batch: 'AMR-B2026-0704', cost_inr: 45000000, trace_ts: 'EASA-Form1', service_hours: 5600 },
  { id: 'AMR-0015', part: 'Flight Control Rod', description: 'B737 Max Aileron Bellcrank Assembly QA Tested', facility: 'HAL Bengaluru', quantity: 4, unit: 'rods', cert_status: 'EASA Form 1', lot: 'LOT-AMR-9036', destination: 'SpiceJet B737-800 SG-7021', received: '2026-07-23', batch: 'AMR-B2026-0702', cost_inr: 18000000, trace_ts: 'FAA-PMA', service_hours: 4200 },
  { id: 'AMR-0016', part: 'Fuel System Valve', description: 'A350 Fuel Jettison Valve Parker Hannifin 115VAC', facility: 'Airbus TAT Delhi', quantity: 1, unit: 'valve', cert_status: 'Under Inspection', lot: 'LOT-AMR-9024', destination: 'Air India A350-900 VT-ANJ', received: '2026-07-23', batch: 'AMR-B2026-0701', cost_inr: 22000000, trace_ts: 'OEM-New', service_hours: 800 },
  { id: 'AMR-0017', part: 'Turbofan Blade', description: 'PW1100G GTF Fan Blade Ti-6-4 HPC Stage 1', facility: 'Air India MRO Delhi', quantity: 18, unit: 'blades', cert_status: 'DGCA Released', lot: 'LOT-AMR-9023', destination: 'IndiGo A320neo VT-IKF', received: '2026-07-22', batch: 'AMR-B2026-0629', cost_inr: 58000000, trace_ts: 'OEM-Service', service_hours: 7400 },
  { id: 'AMR-0018', part: 'Landing Gear Assy', description: 'A321 MLG Brake Assy Honeywell Carbon 8-stack', facility: 'GMR Aero Hyderabad', quantity: 4, unit: 'assemblies', cert_status: 'FAA 8130-3', lot: 'LOT-AMR-9022', destination: 'Vistara A321neo VT-PPW', received: '2026-07-22', batch: 'AMR-B2026-0628', cost_inr: 32000000, trace_ts: 'FAA-PMA', service_hours: 11200 },
  { id: 'AMR-0019', part: 'Avionics LRU', description: 'Rockwell Collins ADIRU B737-8 P/N 822-1676-101', facility: 'AIESL Mumbai', quantity: 1, unit: 'unit', cert_status: 'DGCA Released', lot: 'LOT-AMR-9010', destination: 'Akasa Air B737-8 VT-IXQ', received: '2026-07-21', batch: 'AMR-B2026-0625', cost_inr: 48000000, trace_ts: 'OEM-Service', service_hours: 16500 },
  { id: 'AMR-0020', part: 'Hydraulic Actuator', description: 'B787 Elevator PCU Moog Electro-Hydraulic Mfg', facility: 'Boeing MRO Nagpur', quantity: 2, unit: 'actuators', cert_status: 'EASA Form 1', lot: 'LOT-AMR-9021', destination: 'Air India B787-9 VT-TSI', received: '2026-07-21', batch: 'AMR-B2026-0624', cost_inr: 86000000, trace_ts: 'OEM-New', service_hours: 150 },
]

const genRecords = (start: number) => {
  const statuses = ['DGCA Released', 'FAA 8130-3', 'EASA Form 1', 'Under Inspection', 'Discrepancy Found', 'Pending OEM']
  const destinations = ['IndiGo A320neo', 'Air India B737-8', 'SpiceJet B737-800', 'Vistara A321neo', 'Akasa Air B737-8', 'Air India A350-900', 'Alliance Air ATR-72', 'Air India B777-300ER']
  return Array.from({ length: 40 }, (_, i) => ({
    id: `AMR-${String(start + i).padStart(4, '0')}`,
    part: PART_TYPES[(start + i) % 8],
    description: `${PART_TYPES[(start + i) % 8]} Lot ${String((start + i) % 99 + 1).padStart(3, '0')}`,
    facility: MRO_FACILITIES[(start + i) % 8],
    quantity: Math.round(1 + Math.random() * 24),
    unit: ['blades', 'assemblies', 'units', 'actuators', 'modules', 'panels', 'rods', 'valves'][i % 8],
    cert_status: statuses[(start + i) % 6],
    lot: `LOT-AMR-${String(9021 + start + i)}`,
    destination: destinations[(start + i) % 8],
    received: `2026-07-${String(20 - Math.floor((start + i) / 10)).padStart(2, '0')}`,
    batch: `AMR-B2026-${String(624 - Math.floor((start + i) / 3)).padStart(4, '0')}`,
    cost_inr: Math.round(8000000 + Math.random() * 220000000),
    trace_ts: ['FAA-PMA', 'OEM-Service', 'EASA-Form1', 'OEM-New', 'DGCA-Approved', 'PMA-Derived'][i % 6],
    service_hours: Math.round(200 + Math.random() * 30000),
  }))
}

const allMro = [...mroRecords, ...genRecords(21), ...genRecords(61)]

function ri(min: number, max: number, value: number) {
  return Math.max(min, Math.min(max, value))
}

const filterGroups = [
  {
    key: 'part',
    label: 'Part Type',
    options: PART_TYPES.map(t => ({ label: t, value: t, count: allMro.filter(r => r.part === t).length })),
  },
  {
    key: 'facility',
    label: 'MRO Facility',
    options: MRO_FACILITIES.map(f => ({ label: f, value: f, count: allMro.filter(r => r.facility === f).length })),
  },
  {
    key: 'cert_status',
    label: 'Cert Status',
    options: CERT_STATUS.map(s => ({ label: s, value: s, count: allMro.filter(r => r.cert_status === s).length })),
  },
]

function PartBadge({ part }: { part: string }) {
  const colors: Record<string, string> = { 'Turbofan Blade': 'bg-sky-100 text-sky-800', 'Landing Gear Assy': 'bg-amber-100 text-amber-800', 'Avionics LRU': 'bg-green-100 text-green-800', 'Hydraulic Actuator': 'bg-red-100 text-red-800', 'APU Module': 'bg-orange-100 text-orange-800', 'Composite Panel': 'bg-purple-100 text-purple-800', 'Flight Control Rod': 'bg-blue-100 text-blue-800', 'Fuel System Valve': 'bg-yellow-100 text-yellow-800' }
  return <span className={`amr-part-badge inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[part] || 'bg-gray-100 text-gray-800'}`}>{part}</span>
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = { 'DGCA Released': 'bg-green-100 text-green-800', 'FAA 8130-3': 'bg-blue-100 text-blue-800', 'EASA Form 1': 'bg-indigo-100 text-indigo-800', 'Under Inspection': 'bg-yellow-100 text-yellow-800', 'Discrepancy Found': 'bg-red-100 text-red-800', 'Pending OEM': 'bg-gray-200 text-gray-700' }
  return <span className={`amr-status-badge inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-700'}`}>{status}</span>
}

function CostBar({ cost }: { cost: number }) {
  const pct = ri(0, 100, (cost / 220000000) * 100)
  const color = cost >= 150000000 ? 'bg-blue-600' : cost >= 80000000 ? 'bg-blue-500' : cost >= 30000000 ? 'bg-blue-400' : 'bg-blue-300'
  return <div className="amr-cost-bar flex items-center gap-2"><div className="h-2 w-20 rounded-full bg-gray-200"><div className={`amr-cost-bar-fill h-2 rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} /></div><span className="text-xs text-gray-500">{'₹' + (cost / 10000000).toFixed(1) + 'Cr'}</span></div>
}

function HealthRing({ value, label, color }: { value: number; label: string; color: string }) {
  const r = 28, cx = 35, cy = 35, sw = 5
  const circ = 2 * Math.PI * r
  const offset = circ - (ri(0, 100, value) / 100) * circ
  return <div className="amr-health-ring flex flex-col items-center"><svg width={70} height={70} className="-rotate-90"><circle cx={cx} cy={cy} r={r} fill="none" stroke="#e5e7eb" strokeWidth={sw} /><circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={sw} strokeDasharray={circ} strokeDashoffset={offset} className="amr-ring-path" strokeLinecap="round" /></svg><span className="amr-ring-value mt-1 text-sm font-bold" style={{ color }}>{value}%</span><span className="text-xs text-gray-500">{label}</span></div>
}

function KpiTile({ title, value, sub }: { title: string; value: string; sub: string }) {
  return <Card className="amr-kpi-card"><CardContent className="p-4"><p className="text-xs text-gray-500">{title}</p><p className="amr-kpi-value mt-1 text-2xl font-bold">{value}</p><p className="text-xs text-gray-400 mt-0.5">{sub}</p></CardContent></Card>
}

function ValueTile({ title, value, trend }: { title: string; value: string; trend: string }) {
  const up = trend.startsWith('+')
  return <Card className="amr-value-tile"><CardContent className="p-4"><p className="text-xs text-gray-500">{title}</p><p className="mt-1 text-xl font-bold">{value}</p><p className={`text-xs mt-0.5 ${up ? 'text-green-600' : 'text-red-500'}`}>{trend}</p></CardContent></Card>
}

export default function AerospaceMroLogisticsView() {
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

  const filtered = allMro.filter(m => {
    const q = searchQuery.toLowerCase()
    if (q && !m.id.toLowerCase().includes(q) && !m.part.toLowerCase().includes(q) && !m.description.toLowerCase().includes(q) && !m.facility.toLowerCase().includes(q) && !m.destination.toLowerCase().includes(q)) return false
    return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(m[key as keyof typeof m] as string))
  })

  const totalCost = allMro.reduce((s, m) => s + m.cost_inr, 0)
  const released = allMro.filter(m => m.cert_status === 'DGCA Released').length
  const inspecting = allMro.filter(m => m.cert_status === 'Under Inspection').length

  const monthlyData = [
    { month: 'Jan', jobs: 85, value_cr: 180, turn_days: 12 },
    { month: 'Feb', jobs: 102, value_cr: 245, turn_days: 11 },
    { month: 'Mar', jobs: 128, value_cr: 340, turn_days: 10 },
    { month: 'Apr', jobs: 68, value_cr: 155, turn_days: 14 },
    { month: 'May', jobs: 115, value_cr: 310, turn_days: 11 },
    { month: 'Jun', jobs: 48, value_cr: 120, turn_days: 15 },
    { month: 'Jul', jobs: 142, value_cr: 420, turn_days: 9 },
  ]
  const partData = PART_TYPES.map(t => ({ part: t, count: allMro.filter(r => r.part === t).length }))
  const facilityData = MRO_FACILITIES.map(f => ({ facility: f, count: allMro.filter(r => r.facility === f).length }))

  const tabs = [
    { value: 'dashboard', label: 'Dashboard' },
    { value: 'shop-floor', label: 'Shop Floor' },
    { value: 'analytics', label: 'Analytics' },
    { value: 'insights', label: 'Insights' },
  ]

  return (
    <div className="amr-container space-y-4">
      <PageHeader title="Aerospace MRO Logistics" description="Military and civil aviation MRO supply chain with DGCA/FAA/EASA dual certification tracking, serialized component traceability via ATA Spec 2000, RFID rotable management, and OEM-authorized repair across India's 12 certified MRO facilities" />
      <ModuleBreadcrumb items={[{ label: 'Aviation' }, { label: 'MRO Logistics' }]} />
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="amr-tabs-list">
          {tabs.map(t => <TabsTrigger key={t.value} value={t.value} className="amr-tab-trigger">{t.label}</TabsTrigger>)}
        </TabsList>

        <TabsContent value="dashboard" className="amr-tab-content space-y-4 mt-4">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <KpiTile title="Total Work Orders" value={allMro.length.toString()} sub="MRO parts in pipeline" />
            <KpiTile title="Total Value" value={`₹${(totalCost / 10000000).toFixed(0)}Cr`} sub="Inventory and work value" />
            <KpiTile title="DGCA Released" value={released.toString()} sub={`${((released / allMro.length) * 100).toFixed(0)}% certified`} />
            <KpiTile title="Under Inspection" value={inspecting.toString()} sub="Active QC checks" />
          </div>
          <div className="grid gap-4 grid-cols-3 md:grid-cols-6">
            <HealthRing value={95} label="On-Time Delivery" color="#1d4ed8" />
            <HealthRing value={92} label="First Pass Yield" color="#1e40af" />
            <HealthRing value={88} label="OEM Auth Rate" color="#2563eb" />
            <HealthRing value={97} label="Traceability" color="#172554" />
            <HealthRing value={84} label="Turnaround TAT" color="#1e3a8a" />
            <HealthRing value={96} label="Safety Score" color="#60a5fa" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="amr-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Monthly Work Orders & Turnaround Days</CardTitle></CardHeader><CardContent><LineChart data={monthlyData} width={300} height={200}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" fontSize={12} /><YAxis fontSize={12} /><Tooltip /><Legend /><Line type="monotone" dataKey="jobs" stroke="#1d4ed8" strokeWidth={2} /><Line type="monotone" dataKey="turn_days" stroke="#1e40af" strokeWidth={2} strokeDasharray="5 5" /></LineChart></CardContent></Card>
            <Card className="amr-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Work Orders by Part Type</CardTitle></CardHeader><CardContent><BarChart data={partData} width={300} height={200}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="part" fontSize={10} angle={-30} textAnchor="end" height={50} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="count" fill="#1d4ed8" radius={[4,4,0,0]} /></BarChart></CardContent></Card>
            <Card className="amr-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">MRO Facility Distribution</CardTitle></CardHeader><CardContent><PieChart width={300} height={200}><Pie data={facilityData} dataKey="count" nameKey="facility" cx="50%" cy="50%" outerRadius={70} label={({ facility, count }) => `${count}`}>{facilityData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="shop-floor" className="amr-tab-content space-y-4 mt-4">
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={allMro.length} filteredCount={filtered.length} onRefresh={() => {}} placeholder="Search by ID, part type, facility, aircraft, or lot..." />
          <div className="overflow-x-auto rounded-lg border">
            <table className="amr-table w-full text-sm">
              <thead><tr className="amr-table-header bg-gray-50"><th className="px-3 py-2 text-left font-medium">ID</th><th className="px-3 py-2 text-left font-medium">Part</th><th className="px-3 py-2 text-left font-medium">Cert</th><th className="px-3 py-2 text-left font-medium">Qty</th><th className="px-3 py-2 text-left font-medium">Value</th><th className="px-3 py-2 text-left font-medium">Facility</th><th className="px-3 py-2 text-left font-medium">Aircraft</th><th className="px-3 py-2 text-left font-medium">Lot</th><th className="px-3 py-2 text-left font-medium">Trace</th></tr></thead>
              <tbody>{filtered.slice(0, 20).map(m => (
                <tr key={m.id} className="amr-table-row border-t hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-2 font-mono text-xs">{m.id}</td>
                  <td className="px-3 py-2"><PartBadge part={m.part} /></td>
                  <td className="px-3 py-2"><StatusBadge status={m.cert_status} /></td>
                  <td className="px-3 py-2 text-xs">{m.quantity} {m.unit}</td>
                  <td className="px-3 py-2"><CostBar cost={m.cost_inr} /></td>
                  <td className="px-3 py-2 text-xs">{m.facility}</td>
                  <td className="px-3 py-2 text-xs">{m.destination}</td>
                  <td className="px-3 py-2 text-xs font-mono">{m.lot}</td>
                  <td className="px-3 py-2 text-xs">{m.trace_ts}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="amr-tab-content space-y-4 mt-4">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <ValueTile title="Avg Turnaround" value="10.2 days" trend="-18.5% faster" />
            <ValueTile title="First Pass Yield" value="94.6%" trend="+2.3% improved" />
            <ValueTile title="OEM Authorization" value="88.1%" trend="+5.4% expanded" />
            <ValueTile title="Rotable Pool Value" value="₹420Cr" trend="+12.8% growth" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="amr-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Value by Part Category</CardTitle></CardHeader><CardContent><BarChart data={PART_TYPES.map(t => ({ part: t, total: allMro.filter(r => r.part === t).reduce((s, r) => s + r.cost_inr, 0) / 10000000 }))} width={400} height={250}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="part" fontSize={10} angle={-30} textAnchor="end" height={50} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="total" fill="#1e40af" radius={[4,4,0,0]} /></BarChart></CardContent></Card>
            <Card className="amr-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Certification Status Breakdown</CardTitle></CardHeader><CardContent><PieChart width={400} height={250}><Pie data={CERT_STATUS.map(s => ({ status: s, count: allMro.filter(m => m.cert_status === s).length }))} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={80} label>{CERT_STATUS.map((_, i) => <Cell key={i} fill={['#22c55e','#3b82f6','#6366f1','#eab308','#ef4444','#9ca3af'][i]} />)}</Pie><Tooltip /></PieChart></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="amr-tab-content space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="amr-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">DGCA MRO India Regulatory Compliance Automation</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Directorate General of Civil Aviation (DGCA) CAR-M digital compliance tracking for all 12 approved MRO organizations in India. Automated Civil Aircraft Requirements (CAR) 145 maintenance organization approval renewal workflow with 180-day advance alert. E-Logbook integration for AME (Aircraft Maintenance Engineer) license tracking across 8,500+ licensed engineers. Real-time Airworthiness Directive (AD) compliance monitoring from DGCA, FAA, and EASA ensuring zero overdue ADs on 650+ registered aircraft. Integration with DGCA e-GCA portal for digital submission of maintenance release certificates reducing paperwork by 85%.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-blue-800">Critical</span><span className="text-gray-400">Live</span></div></CardContent></Card>
            <Card className="amr-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">ATA Spec 2000 RFID Serialized Traceability</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>ATA Specification 2000 compliant serialized tracking for all life-limited parts (LLP) and rotable components using UHF RFID tags. Real-time part location tracking across 8 MRO facilities with automated RFID gate readers at workshop entry/exit points. Blockchain-anchored chain-of-custody records for critical safety items (CSI) from OEM manufacturing to aircraft installation maintaining 100% provenance. Integration with IATA iSpec 2200 and S1000D for technical publication-linked maintenance task execution. AI-powered predictive component removal forecasting using fleet-wide sensor data, pilot reports, and maintenance history achieving 78% accuracy for unscheduled removal prediction.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-indigo-100 px-2 py-0.5 text-indigo-800">Strategic</span><span className="text-gray-400">Q3 2026</span></div></CardContent></Card>
            <Card className="amr-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">Make in India Defence Aerospace Corridor MRO</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Defence aerospace corridor integration connecting HAL, BEL, DRDO, and private MROs under the Make in India initiative. Tejas Mk1A and Mk2 indigenous fighter MRO capability development with 60% technology transfer from ADA to HAL. LCA (Light Combat Aircraft) squadrons service scheduling across 6 IAF bases with automated rotable pool management. Integration with Defence Public Sector Undertakings (DPSUs) for indigenous aero-engine component testing and qualification. Daulat Beg Oldi and Leh high-altitude fighter base cold-weather maintenance logistics with specialized tooling and heating shelter management.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-sky-100 px-2 py-0.5 text-sky-800">Operational</span><span className="text-gray-400">FY2027</span></div></CardContent></Card>
            <Card className="amr-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">AI Predictive MRO & Digital Twin Engine Health</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Machine learning engine health monitoring (EHM) model processing 2.4 billion sensor data points per flight cycle across 650+ aircraft. Digital twin of GE CFM56 and PW1100G turbofan engines enabling predictive hot-section inspection scheduling 500 flight hours before failure. Automated Non-Destructive Testing (NDT) report analysis with computer vision detecting 99.2% of crack indications in turbine blades. Integration with Flight Data Recorder (FDR) analysis for exceedance-driven component inspection prioritization reducing unscheduled maintenance by 22%. Fleet-wide APU health scoring system optimizing APU removal planning and reducing AOG (Aircraft on Ground) events by 35%.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-violet-100 px-2 py-0.5 text-violet-800">Innovation</span><span className="text-gray-400">Pilot</span></div></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
