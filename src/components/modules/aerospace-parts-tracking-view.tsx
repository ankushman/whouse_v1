import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#7e22ce', '#6b21a8', '#a855f7', '#c084fc', '#d8b4fe', '#581c87', '#3b0764', '#f3e8ff']

const PART_TYPES = ['Turbofan Blades', 'Landing Gear Assembly', 'Avionics Unit', 'Hydraulic Actuator', 'Composite Panels', 'Fuel System Components', 'Flight Control Surfaces', 'Cabin Interior Parts']
const PROGRAMS = ['Tejas MK-1A', 'Sarang Helicopter', 'DRDO AEW&C', 'Gaganyaan Crew Module', 'Dhruv MK-IV', 'NAL Saras PT2N', 'Rustom-II UAV', 'LCA Navy MK2']
const CERTIFICATION_STATUS = ['AS9100D Certified', 'NADCAP Approved', 'Under Audit', 'Conditional Pass', 'Non-Conforming', 'Pending Review']

const parts = [
  { id: 'ASP-0001', part: 'Turbofan Blades', description: 'GE F414 Single Crystal Blade Stage 2', program: 'Tejas MK-1A', quantity: 24, unit: 'pcs', certification: 'AS9100D Certified', facility: 'HAL Bengaluru', po: 'PO-AERO-28451', received: '2026-07-30', batch: 'AERO-B2026-0721', cost_inr: 48000000, shelf_life: 'N/A', serial: 'SN-TF-2026-001' },
  { id: 'ASP-0002', part: 'Landing Gear Assembly', description: 'Main Landing Gear Oleo Strut Assy', program: 'Sarang Helicopter', quantity: 4, unit: 'sets', certification: 'NADCAP Approved', facility: 'BEL Ghaziabad', po: 'PO-AERO-28452', received: '2026-07-30', batch: 'AERO-B2026-0722', cost_inr: 12500000, shelf_life: '15 years', serial: 'SN-LG-2026-002' },
  { id: 'ASP-0003', part: 'Avionics Unit', description: 'Mission Computer ADA-216 Core', program: 'DRDO AEW&C', quantity: 8, unit: 'units', certification: 'AS9100D Certified', facility: 'DRDO Bengaluru', po: 'PO-AERO-28453', received: '2026-07-29', batch: 'AERO-B2026-0719', cost_inr: 64000000, shelf_life: '10 years', serial: 'SN-AV-2026-003' },
  { id: 'ASP-0004', part: 'Hydraulic Actuator', description: 'Primary Flight Control Actuator', program: 'Gaganyaan Crew Module', quantity: 12, unit: 'units', certification: 'AS9100D Certified', facility: 'ISRO Thiruvananthapuram', po: 'PO-AERO-28454', received: '2026-07-29', batch: 'AERO-B2026-0718', cost_inr: 36000000, shelf_life: 'Mission Life', serial: 'SN-HY-2026-004' },
  { id: 'ASP-0005', part: 'Composite Panels', description: 'Carbon Fiber Skin Panel Wing Root', program: 'LCA Navy MK2', quantity: 16, unit: 'panels', certification: 'Under Audit', facility: 'NAL Bengaluru', po: 'PO-AERO-28455', received: '2026-07-28', batch: 'AERO-B2026-0716', cost_inr: 9600000, shelf_life: '20 years', serial: 'SN-CP-2026-005' },
  { id: 'ASP-0006', part: 'Fuel System Components', description: 'Jet A-1 Fuel Feed Pump Assembly', program: 'Dhruv MK-IV', quantity: 6, unit: 'sets', certification: 'NADCAP Approved', facility: 'HAL Hyderabad', po: 'PO-AERO-28456', received: '2026-07-28', batch: 'AERO-B2026-0715', cost_inr: 7200000, shelf_life: '8 years', serial: 'SN-FS-2026-006' },
  { id: 'ASP-0007', part: 'Flight Control Surfaces', description: 'All-Moving Canard Carbon Composite', program: 'Tejas MK-1A', quantity: 10, unit: 'pcs', certification: 'AS9100D Certified', facility: 'ADA Bengaluru', po: 'PO-AERO-28457', received: '2026-07-27', batch: 'AERO-B2026-0714', cost_inr: 28000000, shelf_life: 'N/A', serial: 'SN-FC-2026-007' },
  { id: 'ASP-0008', part: 'Cabin Interior Parts', description: 'Crew Seat Ejection Type MK-10', program: 'Gaganyaan Crew Module', quantity: 4, unit: 'units', certification: 'Conditional Pass', facility: 'HAL Kanpur', po: 'PO-AERO-28458', received: '2026-07-27', batch: 'AERO-B2026-0713', cost_inr: 32000000, shelf_life: 'Single Use', serial: 'SN-CI-2026-008' },
  { id: 'ASP-0009', part: 'Turbofan Blades', description: 'GTRE Kaveri Blade Stage 3 TiAl', program: 'Tejas MK-1A', quantity: 32, unit: 'pcs', certification: 'Under Audit', facility: 'GTRE Bengaluru', po: 'PO-AERO-28459', received: '2026-07-26', batch: 'AERO-B2026-0711', cost_inr: 25600000, shelf_life: 'N/A', serial: 'SN-TF-2026-009' },
  { id: 'ASP-0010', part: 'Landing Gear Assembly', description: 'Nose Wheel Steering Actuator', program: 'NAL Saras PT2N', quantity: 2, unit: 'sets', certification: 'Non-Conforming', facility: 'BEL Ghaziabad', po: 'PO-AERO-28460', received: '2026-07-26', batch: 'AERO-B2026-0710', cost_inr: 4500000, shelf_life: '12 years', serial: 'SN-LG-2026-010' },
  { id: 'ASP-0011', part: 'Avionics Unit', description: 'Radar Warning Receiver RWR-04', program: 'Rustom-II UAV', quantity: 15, unit: 'units', certification: 'AS9100D Certified', facility: 'DRDO Hyderabad', po: 'PO-AERO-28461', received: '2026-07-25', batch: 'AERO-B2026-0708', cost_inr: 22500000, shelf_life: '10 years', serial: 'SN-AV-2026-011' },
  { id: 'ASP-0012', part: 'Hydraulic Actuator', description: 'Utility Actuator Landing Flap', program: 'Dhruv MK-IV', quantity: 8, unit: 'units', certification: 'Pending Review', facility: 'HAL Bengaluru', po: 'PO-AERO-28462', received: '2026-07-25', batch: 'AERO-B2026-0707', cost_inr: 12000000, shelf_life: '10 years', serial: 'SN-HY-2026-012' },
  { id: 'ASP-0013', part: 'Composite Panels', description: 'Glass Epoxy Radome Dome 600mm', program: 'DRDO AEW&C', quantity: 3, unit: 'pcs', certification: 'NADCAP Approved', facility: 'NAL Mysuru', po: 'PO-AERO-28463', received: '2026-07-24', batch: 'AERO-B2026-0705', cost_inr: 5400000, shelf_life: '15 years', serial: 'SN-CP-2026-013' },
  { id: 'ASP-0014', part: 'Fuel System Components', description: 'Self-Sealing Fuel Tank Bladder', program: 'LCA Navy MK2', quantity: 6, unit: 'pcs', certification: 'AS9100D Certified', facility: 'HAL Nasik', po: 'PO-AERO-28464', received: '2026-07-24', batch: 'AERO-B2026-0704', cost_inr: 10800000, shelf_life: '12 years', serial: 'SN-FS-2026-014' },
  { id: 'ASP-0015', part: 'Flight Control Surfaces', description: 'Rudder Pedal Assembly With Linkage', program: 'Sarang Helicopter', quantity: 10, unit: 'sets', certification: 'NADCAP Approved', facility: 'HAL Bengaluru', po: 'PO-AERO-28465', received: '2026-07-23', batch: 'AERO-B2026-0702', cost_inr: 7500000, shelf_life: 'N/A', serial: 'SN-FC-2026-015' },
  { id: 'ASP-0016', part: 'Cabin Interior Parts', description: 'Pressurized Cabin Door Assy', program: 'Tejas MK-1A', quantity: 4, unit: 'units', certification: 'AS9100D Certified', facility: 'HAL Kanpur', po: 'PO-AERO-28466', received: '2026-07-23', batch: 'AERO-B2026-0701', cost_inr: 8800000, shelf_life: '15 years', serial: 'SN-CI-2026-016' },
  { id: 'ASP-0017', part: 'Turbofan Blades', description: 'HPT Nozzle Guide Vane Inconel', program: 'Gaganyaan Crew Module', quantity: 18, unit: 'pcs', certification: 'AS9100D Certified', facility: 'ISRO Bengaluru', po: 'PO-AERO-28467', received: '2026-07-22', batch: 'AERO-B2026-0629', cost_inr: 45000000, shelf_life: 'Mission Life', serial: 'SN-TF-2026-017' },
  { id: 'ASP-0018', part: 'Landing Gear Assembly', description: 'Tail Wheel Assembly Light Aircraft', program: 'NAL Saras PT2N', quantity: 2, unit: 'sets', certification: 'Under Audit', facility: 'HAL Lucknow', po: 'PO-AERO-28468', received: '2026-07-22', batch: 'AERO-B2026-0628', cost_inr: 2200000, shelf_life: '10 years', serial: 'SN-LG-2026-018' },
  { id: 'ASP-0019', part: 'Avionics Unit', description: 'UHF SATCOM Transceiver Module', program: 'Rustom-II UAV', quantity: 6, unit: 'units', certification: 'Conditional Pass', facility: 'DRDO Bengaluru', po: 'PO-AERO-28469', received: '2026-07-21', batch: 'AERO-B2026-0625', cost_inr: 18000000, shelf_life: '8 years', serial: 'SN-AV-2026-019' },
  { id: 'ASP-0020', part: 'Hydraulic Actuator', description: 'Brake Actuator Anti-Skid System', program: 'LCA Navy MK2', quantity: 4, unit: 'units', certification: 'AS9100D Certified', facility: 'HAL Hyderabad', po: 'PO-AERO-28470', received: '2026-07-21', batch: 'AERO-B2026-0624', cost_inr: 8400000, shelf_life: '12 years', serial: 'SN-HY-2026-020' },
]

const genRecords = (start: number) => {
  const statuses = ['AS9100D Certified', 'NADCAP Approved', 'Under Audit', 'Conditional Pass', 'Non-Conforming', 'Pending Review']
  const facilities = ['HAL Bengaluru', 'BEL Ghaziabad', 'DRDO Bengaluru', 'ISRO Thiruvananthapuram', 'NAL Bengaluru', 'HAL Hyderabad', 'ADA Bengaluru', 'HAL Kanpur']
  return Array.from({ length: 40 }, (_, i) => ({
    id: `ASP-${String(start + i).padStart(4, '0')}`,
    part: PART_TYPES[(start + i) % 8],
    description: `${PART_TYPES[(start + i) % 8]} Assy ${String((start + i) % 99 + 1).padStart(3, '0')}`,
    program: PROGRAMS[(start + i) % 8],
    quantity: Math.round(1 + Math.random() * 49),
    unit: ['pcs', 'sets', 'units', 'panels'][i % 4],
    certification: statuses[(start + i) % 6],
    facility: facilities[(start + i) % 8],
    po: `PO-AERO-${String(28470 + start + i).padStart(5, '0')}`,
    received: `2026-07-${String(20 - Math.floor((start + i) / 10)).padStart(2, '0')}`,
    batch: `AERO-B2026-${String(624 - Math.floor((start + i) / 3)).padStart(4, '0')}`,
    cost_inr: Math.round(500000 + Math.random() * 50000000),
    shelf_life: ['N/A', '10 years', '15 years', 'Mission Life', '12 years', '8 years'][i % 6],
    serial: `SN-${String(start + i).padStart(4, '0')}-${String((start + i) % 999 + 1).padStart(3, '0')}`,
  }))
}

const allParts = [...parts, ...genRecords(21), ...genRecords(61)]

function ri(min: number, max: number, value: number) {
  return Math.max(min, Math.min(max, value))
}

const filterGroups = [
  {
    key: 'part',
    label: 'Part Type',
    options: PART_TYPES.map(p => ({ label: p, value: p, count: allParts.filter(d => d.part === p).length })),
  },
  {
    key: 'program',
    label: 'Program',
    options: PROGRAMS.map(p => ({ label: p, value: p, count: allParts.filter(d => d.program === p).length })),
  },
  {
    key: 'certification',
    label: 'Certification Status',
    options: CERTIFICATION_STATUS.map(c => ({ label: c, value: c, count: allParts.filter(d => d.certification === c).length })),
  },
]

function PartBadge({ part }: { part: string }) {
  const colors: Record<string, string> = { 'Turbofan Blades': 'bg-purple-100 text-purple-800', 'Landing Gear Assembly': 'bg-violet-100 text-violet-800', 'Avionics Unit': 'bg-indigo-100 text-indigo-800', 'Hydraulic Actuator': 'bg-blue-100 text-blue-800', 'Composite Panels': 'bg-cyan-100 text-cyan-800', 'Fuel System Components': 'bg-teal-100 text-teal-800', 'Flight Control Surfaces': 'bg-fuchsia-100 text-fuchsia-800', 'Cabin Interior Parts': 'bg-pink-100 text-pink-800' }
  return <span className={`asp-part-badge inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[part] || 'bg-gray-100 text-gray-800'}`}>{part}</span>
}

function CertificationBadge({ certification }: { certification: string }) {
  const colors: Record<string, string> = { 'AS9100D Certified': 'bg-green-100 text-green-800', 'NADCAP Approved': 'bg-emerald-100 text-emerald-800', 'Under Audit': 'bg-yellow-100 text-yellow-800', 'Conditional Pass': 'bg-orange-100 text-orange-800', 'Non-Conforming': 'bg-red-100 text-red-800', 'Pending Review': 'bg-gray-200 text-gray-700' }
  return <span className={`asp-certification-badge inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[certification] || 'bg-gray-100 text-gray-700'}`}>{certification}</span>
}

function CostBar({ cost }: { cost: number }) {
  const pct = ri(0, 100, (cost / 60000000) * 100)
  const color = cost >= 30000000 ? 'bg-purple-600' : cost >= 10000000 ? 'bg-purple-500' : cost >= 5000000 ? 'bg-purple-400' : 'bg-purple-300'
  return <div className="asp-cost-bar flex items-center gap-2"><div className="h-2 w-20 rounded-full bg-gray-200"><div className={`asp-cost-bar-fill h-2 rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} /></div><span className="text-xs text-gray-500">{'₹' + (cost / 10000000).toFixed(1) + 'Cr'}</span></div>
}

function HealthRing({ value, label, color }: { value: number; label: string; color: string }) {
  const r = 28, cx = 35, cy = 35, sw = 5
  const circ = 2 * Math.PI * r
  const offset = circ - (ri(0, 100, value) / 100) * circ
  return <div className="asp-health-ring flex flex-col items-center"><svg width={70} height={70} className="-rotate-90"><circle cx={cx} cy={cy} r={r} fill="none" stroke="#e5e7eb" strokeWidth={sw} /><circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={sw} strokeDasharray={circ} strokeDashoffset={offset} className="asp-ring-path" strokeLinecap="round" /></svg><span className="asp-ring-value mt-1 text-sm font-bold" style={{ color }}>{value}%</span><span className="text-xs text-gray-500">{label}</span></div>
}

function KpiTile({ title, value, sub }: { title: string; value: string; sub: string }) {
  return <Card className="asp-kpi-card"><CardContent className="p-4"><p className="text-xs text-gray-500">{title}</p><p className="asp-kpi-value mt-1 text-2xl font-bold">{value}</p><p className="text-xs text-gray-400 mt-0.5">{sub}</p></CardContent></Card>
}

function ValueTile({ title, value, trend }: { title: string; value: string; trend: string }) {
  const up = trend.startsWith('+')
  return <Card className="asp-value-tile"><CardContent className="p-4"><p className="text-xs text-gray-500">{title}</p><p className="mt-1 text-xl font-bold">{value}</p><p className={`text-xs mt-0.5 ${up ? 'text-green-600' : 'text-red-500'}`}>{trend}</p></CardContent></Card>
}

export default function AerospacePartsTrackingView() {
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

  const filtered = allParts.filter(d => {
    const q = searchQuery.toLowerCase()
    if (q && !d.id.toLowerCase().includes(q) && !d.part.toLowerCase().includes(q) && !d.description.toLowerCase().includes(q) && !d.program.toLowerCase().includes(q) && !d.facility.toLowerCase().includes(q)) return false
    return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(d[key as keyof typeof d] as string))
  })

  const totalCost = allParts.reduce((s, d) => s + d.cost_inr, 0)
  const certified = allParts.filter(d => d.certification === 'AS9100D Certified').length
  const nonConforming = allParts.filter(d => d.certification === 'Non-Conforming').length

  const monthlyData = [
    { month: 'Jan', parts: 45, value_cr: 85, quality: 97 },
    { month: 'Feb', parts: 52, value_cr: 110, quality: 96 },
    { month: 'Mar', parts: 68, value_cr: 145, quality: 98 },
    { month: 'Apr', parts: 58, value_cr: 120, quality: 95 },
    { month: 'May', parts: 42, value_cr: 90, quality: 94 },
    { month: 'Jun', parts: 38, value_cr: 75, quality: 93 },
    { month: 'Jul', parts: 72, value_cr: 160, quality: 97 },
  ]
  const partData = PART_TYPES.map(p => ({ part: p, count: allParts.filter(d => d.part === p).length }))
  const programData = PROGRAMS.map(p => ({ program: p, count: allParts.filter(d => d.program === p).length }))

  const tabs = [
    { value: 'dashboard', label: 'Dashboard' },
    { value: 'parts', label: 'Parts' },
    { value: 'analytics', label: 'Analytics' },
    { value: 'insights', label: 'Insights' },
  ]

  return (
    <div className="asp-container space-y-4">
      <PageHeader title="Aerospace Parts Tracking" description="Defense aerospace components tracking with AS9100D/NADCAP certification management, mission-critical supply chain for Indian aerospace programs" />
      <ModuleBreadcrumb items={[{ label: 'Defense Logistics' }, { label: 'Aerospace Parts' }]} />
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="asp-tabs-list">
          {tabs.map(t => <TabsTrigger key={t.value} value={t.value} className="asp-tab-trigger">{t.label}</TabsTrigger>)}
        </TabsList>

        <TabsContent value="dashboard" className="asp-tab-content space-y-4 mt-4">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <KpiTile title="Total Parts" value={allParts.length.toString()} sub="Tracked assemblies" />
            <KpiTile title="Total Value" value={`₹${(totalCost / 10000000).toFixed(1)}Cr`} sub="Program value" />
            <KpiTile title="AS9100D Certified" value={certified.toString()} sub={`${((certified / allParts.length) * 100).toFixed(0)}% compliant`} />
            <KpiTile title="Non-Conforming" value={nonConforming.toString()} sub="Requires action" />
          </div>
          <div className="grid gap-4 grid-cols-3 md:grid-cols-6">
            <HealthRing value={99} label="Traceability" color="#7e22ce" />
            <HealthRing value={97} label="Cert Quality" color="#6b21a8" />
            <HealthRing value={94} label="NADCAP Rate" color="#a855f7" />
            <HealthRing value={96} label="Clean Room" color="#581c87" />
            <HealthRing value={98} label="Serialization" color="#3b0764" />
            <HealthRing value={92} label="Lead Time" color="#c084fc" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="asp-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Monthly Parts Volume & Quality</CardTitle></CardHeader><CardContent><LineChart data={monthlyData} width={300} height={200}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" fontSize={12} /><YAxis fontSize={12} /><Tooltip /><Legend /><Line type="monotone" dataKey="parts" stroke="#7e22ce" strokeWidth={2} /><Line type="monotone" dataKey="quality" stroke="#6b21a8" strokeWidth={2} strokeDasharray="5 5" /></LineChart></CardContent></Card>
            <Card className="asp-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Parts by Category</CardTitle></CardHeader><CardContent><BarChart data={partData} width={300} height={200}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="part" fontSize={10} angle={-30} textAnchor="end" height={50} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="count" fill="#7e22ce" radius={[4,4,0,0]} /></BarChart></CardContent></Card>
            <Card className="asp-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Program Distribution</CardTitle></CardHeader><CardContent><PieChart width={300} height={200}><Pie data={programData} dataKey="count" nameKey="program" cx="50%" cy="50%" outerRadius={70} label={({ program, count }) => `${count}`}>{programData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="parts" className="asp-tab-content space-y-4 mt-4">
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={allParts.length} filteredCount={filtered.length} onRefresh={() => {}} placeholder="Search by ID, part, program, description, or facility..." />
          <div className="overflow-x-auto rounded-lg border">
            <table className="asp-table w-full text-sm">
              <thead><tr className="asp-table-header bg-gray-50"><th className="px-3 py-2 text-left font-medium">ID</th><th className="px-3 py-2 text-left font-medium">Part</th><th className="px-3 py-2 text-left font-medium">Certification</th><th className="px-3 py-2 text-left font-medium">Qty</th><th className="px-3 py-2 text-left font-medium">Cost</th><th className="px-3 py-2 text-left font-medium">Program</th><th className="px-3 py-2 text-left font-medium">Facility</th><th className="px-3 py-2 text-left font-medium">Serial</th><th className="px-3 py-2 text-left font-medium">Shelf Life</th></tr></thead>
              <tbody>{filtered.slice(0, 20).map(d => (
                <tr key={d.id} className="asp-table-row border-t hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-2 font-mono text-xs">{d.id}</td>
                  <td className="px-3 py-2"><PartBadge part={d.part} /></td>
                  <td className="px-3 py-2"><CertificationBadge certification={d.certification} /></td>
                  <td className="px-3 py-2 text-xs">{d.quantity} {d.unit}</td>
                  <td className="px-3 py-2"><CostBar cost={d.cost_inr} /></td>
                  <td className="px-3 py-2 text-xs">{d.program}</td>
                  <td className="px-3 py-2 text-xs">{d.facility}</td>
                  <td className="px-3 py-2 text-xs font-mono">{d.serial.slice(-7)}</td>
                  <td className="px-3 py-2 text-xs">{d.shelf_life}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="asp-tab-content space-y-4 mt-4">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <ValueTile title="Avg Part Value" value="₹2.8Cr" trend="+8.4% vs last quarter" />
            <ValueTile title="AS9100D Rate" value="96.2%" trend="+1.8% improved" />
            <ValueTile title="NCR Rate" value="1.2%" trend="-0.4% reduced" />
            <ValueTile title="On-Time Delivery" value="88.5%" trend="+3.2% improved" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="asp-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Value by Part Category</CardTitle></CardHeader><CardContent><BarChart data={PART_TYPES.map(p => ({ part: p, total: allParts.filter(d => d.part === p).reduce((s, d) => s + d.cost_inr, 0) / 10000000 }))} width={400} height={250}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="part" fontSize={10} angle={-30} textAnchor="end" height={50} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="total" fill="#6b21a8" radius={[4,4,0,0]} /></BarChart></CardContent></Card>
            <Card className="asp-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Certification Status Breakdown</CardTitle></CardHeader><CardContent><PieChart width={400} height={250}><Pie data={CERTIFICATION_STATUS.map(c => ({ status: c, count: allParts.filter(d => d.certification === c).length }))} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={80} label>{CERTIFICATION_STATUS.map((_, i) => <Cell key={i} fill={['#22c55e','#10b981','#eab308','#f97316','#ef4444','#9ca3af'][i]} />)}</Pie><Tooltip /></PieChart></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="asp-tab-content space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="asp-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">Tejas MK-1A Production Line Tracking</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>End-to-end tracking of 83 Tejas MK-1A fighter jet components across 14 HAL and DRDO production facilities. Real-time synchronization with iGATE manufacturing execution system. Barcode + RFID dual-tracking for every component from raw material to final assembly. 94% on-time delivery to assembly line achieved in Q2 2026.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-purple-100 px-2 py-0.5 text-purple-800">Critical</span><span className="text-gray-400">Live</span></div></CardContent></Card>
            <Card className="asp-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">Gaganyaan Mission-Critical QC Protocol</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Dedicated quality control protocol for all Gaganyaan crew module components meeting ISRO human-rating standards. Triple-redundant inspection: automated NDT (ultrasonic + radiographic), manual visual, and functional test. 100% traceability from alloy batch to installed component. Zero-defect tolerance for all crew safety-critical parts.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-violet-100 px-2 py-0.5 text-violet-800">Operational</span><span className="text-gray-400">Q3 2026</span></div></CardContent></Card>
            <Card className="asp-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">Digital Twin for Turbine Blade Testing</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>FEA-based digital twin of GTRE Kaveri and GE F414 turbofan blades simulating thermal stress, creep, and fatigue life in real-time. Predictive maintenance model forecasting blade replacement 500 flight hours ahead. Connected to ground test rigs at GTRE for continuous model calibration with actual sensor data.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-fuchsia-100 px-2 py-0.5 text-fuchsia-800">Growth</span><span className="text-gray-400">FY2027</span></div></CardContent></Card>
            <Card className="asp-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">Make in India Aerospace Vendor Portal</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Unified vendor portal connecting 180+ MSME aerospace suppliers under the Make in India defense corridor initiative. Automated RFQ distribution and bid evaluation for AS9100D-qualified vendors. Vendor performance scorecards integrating delivery, quality, and cost metrics. Targeting 60% indigenous content in LCA Mark-2 by 2028.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-indigo-100 px-2 py-0.5 text-indigo-800">Innovation</span><span className="text-gray-400">Pilot</span></div></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
