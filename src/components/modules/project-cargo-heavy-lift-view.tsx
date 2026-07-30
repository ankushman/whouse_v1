import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#7c3aed', '#6d28d9', '#8b5cf6', '#a78bfa', '#c4b5fd', '#5b21b6', '#4c1d95', '#ede9fe']

const EQUIPMENT_TYPES = ['Wind Turbine Nacelle', 'Transformer 400kV', 'Tunnel Boring Machine', 'Crawler Crane 300T', 'Gas Turbine Module', 'Steel Bridge Girder', 'Satellite Payload', 'Reactor Pressure Vessel']
const PROJECT_FORWARDERS = ['Agarwal Packers Delhi', 'Sagari Mumbai', 'Project Air Sea Kolkata', 'Freight Systems Chennai', 'Omtrans Hyderabad', 'Century Bengaluru', 'TCI Project Noida', 'Allcargo Logistics Mumbai']
const MOVE_STATUS = ['Route Surveyed', 'Customs Cleared', 'In Transit ODC', 'At Site RIG', 'Pending Permit', 'Awaiting Heavy Lift']

const projectRecords = [
  { id: 'PCL-0001', equipment: 'Wind Turbine Nacelle', description: 'Vestas V150 4.2MW nacelle assembly 85MT single piece over-dimensional cargo Mundra to Satara wind farm NH-48 route survey', forwarder: 'Agarwal Packers Delhi', quantity: 1, unit: 'nacelle', move_status: 'Route Surveyed', lot: 'LOT-PCL-9051', destination: 'Satara Wind Farm MH', received: '2026-07-30', batch: 'PCL-B2026-0730', cost_inr: 85000000, weight_mt: 85.0, dimensions_m: '12.5x4.2x4.8' },
  { id: 'PCL-0002', equipment: 'Transformer 400kV', description: 'ABB 400kV 250MVA power transformer 180MT single piece from Vadodara BHEL factory to Rewri Grid Substation Rajasthan heavy haul', forwarder: 'Sagari Mumbai', quantity: 2, unit: 'units', move_status: 'In Transit ODC', lot: 'LOT-PCL-9048', destination: 'Rewri Substation RJ', received: '2026-07-30', batch: 'PCL-B2026-0729', cost_inr: 120000000, weight_mt: 180.0, dimensions_m: '9.8x3.8x4.2' },
  { id: 'PCL-0003', equipment: 'Tunnel Boring Machine', description: 'Herrenknecht TBM 6.28m diameter cutter head 120MT imported from Shanghai via Kandla port to Mumbai Metro Line-12 underground', forwarder: 'Project Air Sea Kolkata', quantity: 1, unit: 'unit', move_status: 'Customs Cleared', lot: 'LOT-PCL-9045', destination: 'Mumbai Metro Line-12 MH', received: '2026-07-29', batch: 'PCL-B2026-0728', cost_inr: 350000000, weight_mt: 120.0, dimensions_m: '10.2x6.5x6.5' },
  { id: 'PCL-0004', equipment: 'Crawler Crane 300T', description: 'Liebherr LR 1300 crawler crane 300T capacity dismantled 45 sections from Nhava Sheva JNPT port to Navi Mumbai refinery site', forwarder: 'Freight Systems Chennai', quantity: 45, unit: 'sections', move_status: 'At Site RIG', lot: 'LOT-PCL-9042', destination: 'HPCL Refinery Navi Mumbai', received: '2026-07-29', batch: 'PCL-B2026-0727', cost_inr: 45000000, weight_mt: 300.0, dimensions_m: '18.0x6.0x5.5' },
  { id: 'PCL-0005', equipment: 'Gas Turbine Module', description: 'GE 9HA.01 gas turbine generator module 420MT for NTPC Barh Stage-II supercritical power plant from Kandla to Bihar multi-axle trailer', forwarder: 'Omtrans Hyderabad', quantity: 4, unit: 'modules', move_status: 'In Transit ODC', lot: 'LOT-PCL-9039', destination: 'NTPC Barh Bihar', received: '2026-07-28', batch: 'PCL-B2026-0726', cost_inr: 560000000, weight_mt: 420.0, dimensions_m: '15.0x5.2x5.8' },
  { id: 'PCL-0006', equipment: 'Steel Bridge Girder', description: 'BSL I-girder 65M span 95MT for Bogibeel rail-cum-road bridge over Brahmaputra Assam from Durgapur steel plant to Dibrugarh', forwarder: 'Century Bengaluru', quantity: 8, unit: 'girders', move_status: 'Pending Permit', lot: 'LOT-PCL-9036', destination: 'Bogibeel Bridge Assam', received: '2026-07-28', batch: 'PCL-B2026-0725', cost_inr: 95000000, weight_mt: 95.0, dimensions_m: '65.0x3.2x4.5' },
  { id: 'PCL-0007', equipment: 'Satellite Payload', description: 'ISRO GSAT-31 communication satellite payload module 8MT vibration-sensitive clean room environment transport from Bengaluru to SDSC Sriharikota', forwarder: 'TCI Project Noida', quantity: 1, unit: 'payload', move_status: 'Customs Cleared', lot: 'LOT-PCL-9033', destination: 'SDSC Sriharikota AP', received: '2026-07-27', batch: 'PCL-B2026-0724', cost_inr: 180000000, weight_mt: 8.0, dimensions_m: '4.5x3.0x3.0' },
  { id: 'PCL-0008', equipment: 'Reactor Pressure Vessel', description: 'NPCIL 700MWe PHWR reactor pressure vessel 380MT from L&T Hazira to Kakrapar Nuclear Plant Gujarat specialized nuclear-grade transport', forwarder: 'Allcargo Logistics Mumbai', quantity: 1, unit: 'vessel', move_status: 'Awaiting Heavy Lift', lot: 'LOT-PCL-9030', destination: 'Kakrapar Nuclear GJ', received: '2026-07-27', batch: 'PCL-B2026-0723', cost_inr: 420000000, weight_mt: 380.0, dimensions_m: '8.5x8.5x12.0' },
  { id: 'PCL-0009', equipment: 'Wind Turbine Nacelle', description: 'Siemens Gamesa SG 5.0-145 nacelle 92MT for Adani Green 2GW Khavda wind energy park Kutch Gujarat renewable energy project', forwarder: 'Agarwal Packers Delhi', quantity: 3, unit: 'nacelles', move_status: 'In Transit ODC', lot: 'LOT-PCL-9027', destination: 'Khavda Wind Park GJ', received: '2026-07-26', batch: 'PCL-B2026-0722', cost_inr: 210000000, weight_mt: 92.0, dimensions_m: '13.0x4.5x5.0' },
  { id: 'PCL-0010', equipment: 'Transformer 400kV', description: 'TBEA 765kV 500MVA auto-transformer 210MT from Jhansi BHEL to Agra substation under UP Restructured Distribution Sector Project DRP', forwarder: 'Sagari Mumbai', quantity: 1, unit: 'unit', move_status: 'Route Surveyed', lot: 'LOT-PCL-9024', destination: 'Agra Substation UP', received: '2026-07-26', batch: 'PCL-B2026-0721', cost_inr: 98000000, weight_mt: 210.0, dimensions_m: '11.0x4.0x4.5' },
  { id: 'PCL-0011', equipment: 'Tunnel Boring Machine', description: 'CRCHI TBM 6.0m diameter for Kolkata East-West Metro underwater tunnel under Hooghly River 90MT shield section from Chennai port', forwarder: 'Project Air Sea Kolkata', quantity: 1, unit: 'unit', move_status: 'Pending Permit', lot: 'LOT-PCL-9021', destination: 'Kolkata Metro West Bengal', received: '2026-07-25', batch: 'PCL-B2026-0720', cost_inr: 280000000, weight_mt: 90.0, dimensions_m: '9.5x6.0x6.0' },
  { id: 'PCL-0012', equipment: 'Crawler Crane 300T', description: 'Demag CC 2800 600T crawler crane for Reliance Jamnagar petrochemical expansion project 65 sections imported via Mundra multi-modal', forwarder: 'Freight Systems Chennai', quantity: 65, unit: 'sections', move_status: 'Customs Cleared', lot: 'LOT-PCL-9018', destination: 'Reliance Jamnagar GJ', received: '2026-07-25', batch: 'PCL-B2026-0719', cost_inr: 68000000, weight_mt: 600.0, dimensions_m: '22.0x6.5x6.0' },
  { id: 'PCL-0013', equipment: 'Gas Turbine Module', description: 'Siemens SGT5-8000H gas turbine 350MT for Adani Mundra LNG terminal captive power plant imported via Hamburg to Mundra port', forwarder: 'Omtrans Hyderabad', quantity: 2, unit: 'modules', move_status: 'Awaiting Heavy Lift', lot: 'LOT-PCL-9015', destination: 'Adani Mundra LNG GJ', received: '2026-07-24', batch: 'PCL-B2026-0718', cost_inr: 320000000, weight_mt: 350.0, dimensions_m: '14.0x5.0x5.5' },
  { id: 'PCL-0014', equipment: 'Steel Bridge Girder', description: 'NYC I-girder 45M span 78MT for Chenab Bridge Anji Khad Kashmir worlds highest rail bridge steel structure from Bhilai SAIL plant', forwarder: 'Century Bengaluru', quantity: 12, unit: 'girders', move_status: 'In Transit ODC', lot: 'LOT-PCL-9012', destination: 'Chenab Bridge Kashmir', received: '2026-07-24', batch: 'PCL-B2026-0717', cost_inr: 165000000, weight_mt: 78.0, dimensions_m: '45.0x2.8x3.8' },
  { id: 'PCL-0015', equipment: 'Satellite Payload', description: 'ISRO NVS-01 navigation satellite 5.2MT payload integration from Bengaluru ISAC to SDSC SHAR with anti-vibration hydraulic suspension trailer', forwarder: 'TCI Project Noida', quantity: 1, unit: 'payload', move_status: 'At Site RIG', lot: 'LOT-PCL-9009', destination: 'SDSC SHAR AP', received: '2026-07-23', batch: 'PCL-B2026-0716', cost_inr: 145000000, weight_mt: 5.2, dimensions_m: '3.8x2.5x2.5' },
  { id: 'PCL-0016', equipment: 'Reactor Pressure Vessel', description: 'NPCIL 600MWe PFBR fast breeder reactor vessel 250MT from IGCAR Kalpakkam to BHAVINI Madras Atomic Power Project prototype', forwarder: 'Allcargo Logistics Mumbai', quantity: 1, unit: 'vessel', move_status: 'Route Surveyed', lot: 'LOT-PCL-9006', destination: 'BHAVINI Kalpakkam TN', received: '2026-07-23', batch: 'PCL-B2026-0715', cost_inr: 310000000, weight_mt: 250.0, dimensions_m: '7.5x7.5x10.0' },
  { id: 'PCL-0017', equipment: 'Wind Turbine Nacelle', description: 'Suzlon S144 3.15MW nacelle 78MT for Rewa Ultra Mega Solar hybrid wind project 450MW Madhya PradeshWind Park', forwarder: 'Agarwal Packers Delhi', quantity: 5, unit: 'nacelles', move_status: 'Route Surveyed', lot: 'LOT-PCL-9003', destination: 'Rewa Wind Park MP', received: '2026-07-22', batch: 'PCL-B2026-0714', cost_inr: 175000000, weight_mt: 78.0, dimensions_m: '11.5x3.8x4.2' },
  { id: 'PCL-0018', equipment: 'Transformer 400kV', description: 'Crompton Greaves 220kV 160MVA generator transformer 145MT for Tata Power Trombay unit 8 Mumbai modernization project', forwarder: 'Sagari Mumbai', quantity: 1, unit: 'unit', move_status: 'At Site RIG', lot: 'LOT-PCL-9050', destination: 'Tata Power Trombay MH', received: '2026-07-22', batch: 'PCL-B2026-0713', cost_inr: 72000000, weight_mt: 145.0, dimensions_m: '9.0x3.5x4.0' },
  { id: 'PCL-0019', equipment: 'Tunnel Boring Machine', description: 'Robbins TBM 6.7m for Delhi RRTS underground section Sahibabad to Duhai corridor 105MT cutterhead replacement from Mumbai dock', forwarder: 'Project Air Sea Kolkata', quantity: 1, unit: 'unit', move_status: 'Pending Permit', lot: 'LOT-PCL-9047', destination: 'NCRTC Delhi Meerut', received: '2026-07-21', batch: 'PCL-B2026-0712', cost_inr: 260000000, weight_mt: 105.0, dimensions_m: '10.8x6.7x6.7' },
  { id: 'PCL-0020', equipment: 'Crawler Crane 300T', description: 'Kobelco CKE3000G 300T crawler for L&T Surat Barrage construction project 38 modules barge transport from Mumbai to Surat port', forwarder: 'Freight Systems Chennai', quantity: 38, unit: 'modules', move_status: 'In Transit ODC', lot: 'LOT-PCL-9044', destination: 'L&T Surat Barrage GJ', received: '2026-07-21', batch: 'PCL-B2026-0711', cost_inr: 52000000, weight_mt: 280.0, dimensions_m: '16.0x5.5x5.0' },
]

const genRecords = (start: number) => {
  const statuses = ['Route Surveyed', 'Customs Cleared', 'In Transit ODC', 'At Site RIG', 'Pending Permit', 'Awaiting Heavy Lift']
  const destinations = ['Satara Wind Farm MH', 'Rewri Substation RJ', 'Mumbai Metro MH', 'HPCL Refinery Mumbai', 'NTPC Barh Bihar', 'Bogibeel Bridge Assam', 'SDSC Sriharikota AP', 'Kakrapar Nuclear GJ', 'Khavda Wind Park GJ', 'Agra Substation UP', 'Reliance Jamnagar GJ', 'Chenab Bridge Kashmir']
  return Array.from({ length: 40 }, (_, i) => ({
    id: `PCL-${String(start + i).padStart(4, '0')}`,
    equipment: EQUIPMENT_TYPES[(start + i) % 8],
    description: `${EQUIPMENT_TYPES[(start + i) % 8]} Lot ${String((start + i) % 99 + 1).padStart(3, '0')} heavy lift consignment`,
    forwarder: PROJECT_FORWARDERS[(start + i) % 8],
    quantity: Math.round(1 + Math.random() * 65),
    unit: 'units',
    move_status: statuses[(start + i) % 6],
    lot: `LOT-PCL-${String(9021 + start + i)}`,
    destination: destinations[(start + i) % 12],
    received: `2026-07-${String(20 - Math.floor((start + i) / 10)).padStart(2, '0')}`,
    batch: `PCL-B2026-${String(710 - Math.floor((start + i) / 3)).padStart(4, '0')}`,
    cost_inr: Math.round(25000000 + Math.random() * 500000000),
    weight_mt: Math.round((5 + Math.random() * 450) * 10) / 10,
    dimensions_m: `${(Math.round(5 + Math.random() * 20) * 10) / 10}x${(Math.round(2 + Math.random() * 5) * 10) / 10}x${(Math.round(2 + Math.random() * 7) * 10) / 10}`,
  }))
}

const allProjectCargo = [...projectRecords, ...genRecords(21), ...genRecords(61)]

function ri(min: number, max: number, value: number) {
  return Math.max(min, Math.min(max, value))
}

const filterGroups = [
  {
    key: 'equipment',
    label: 'Equipment Type',
    options: EQUIPMENT_TYPES.map(t => ({ label: t, value: t, count: allProjectCargo.filter(r => r.equipment === t).length })),
  },
  {
    key: 'forwarder',
    label: 'Project Forwarder',
    options: PROJECT_FORWARDERS.map(f => ({ label: f, value: f, count: allProjectCargo.filter(r => r.forwarder === f).length })),
  },
  {
    key: 'move_status',
    label: 'Move Status',
    options: MOVE_STATUS.map(s => ({ label: s, value: s, count: allProjectCargo.filter(r => r.move_status === s).length })),
  },
]

function EquipmentBadge({ equipment }: { equipment: string }) {
  const colors: Record<string, string> = { 'Wind Turbine Nacelle': 'bg-violet-100 text-violet-800', 'Transformer 400kV': 'bg-purple-100 text-purple-800', 'Tunnel Boring Machine': 'bg-blue-100 text-blue-800', 'Crawler Crane 300T': 'bg-fuchsia-100 text-fuchsia-800', 'Gas Turbine Module': 'bg-red-100 text-red-800', 'Steel Bridge Girder': 'bg-slate-100 text-slate-800', 'Satellite Payload': 'bg-indigo-100 text-indigo-800', 'Reactor Pressure Vessel': 'bg-amber-100 text-amber-800' }
  return <span className={`pcl-equipment-badge inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[equipment] || 'bg-gray-100 text-gray-800'}`}>{equipment}</span>
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = { 'Route Surveyed': 'bg-blue-100 text-blue-800', 'Customs Cleared': 'bg-green-100 text-green-800', 'In Transit ODC': 'bg-amber-100 text-amber-800', 'At Site RIG': 'bg-violet-100 text-violet-800', 'Pending Permit': 'bg-yellow-100 text-yellow-800', 'Awaiting Heavy Lift': 'bg-gray-200 text-gray-700' }
  return <span className={`pcl-status-badge inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-700'}`}>{status}</span>
}

function CostBar({ cost }: { cost: number }) {
  const pct = ri(0, 100, (cost / 500000000) * 100)
  const color = cost >= 350000000 ? 'bg-violet-600' : cost >= 150000000 ? 'bg-violet-500' : cost >= 50000000 ? 'bg-violet-400' : 'bg-violet-300'
  return <div className="pcl-cost-bar flex items-center gap-2"><div className="h-2 w-20 rounded-full bg-gray-200"><div className={`pcl-cost-bar-fill h-2 rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} /></div><span className="text-xs text-gray-500">{'₹' + (cost / 10000000).toFixed(1) + 'Cr'}</span></div>
}

function HealthRing({ value, label, color }: { value: number; label: string; color: string }) {
  const r = 28, cx = 35, cy = 35, sw = 5
  const circ = 2 * Math.PI * r
  const offset = circ - (ri(0, 100, value) / 100) * circ
  return <div className="pcl-health-ring flex flex-col items-center"><svg width={70} height={70} className="-rotate-90"><circle cx={cx} cy={cy} r={r} fill="none" stroke="#e5e7eb" strokeWidth={sw} /><circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={sw} strokeDasharray={circ} strokeDashoffset={offset} className="pcl-ring-path" strokeLinecap="round" /></svg><span className="pcl-ring-value mt-1 text-sm font-bold" style={{ color }}>{value}%</span><span className="text-xs text-gray-500">{label}</span></div>
}

function KpiTile({ title, value, sub }: { title: string; value: string; sub: string }) {
  return <Card className="pcl-kpi-card"><CardContent className="p-4"><p className="text-xs text-gray-500">{title}</p><p className="pcl-kpi-value mt-1 text-2xl font-bold">{value}</p><p className="text-xs text-gray-400 mt-0.5">{sub}</p></CardContent></Card>
}

function ValueTile({ title, value, trend }: { title: string; value: string; trend: string }) {
  const up = trend.startsWith('+')
  return <Card className="pcl-value-tile"><CardContent className="p-4"><p className="text-xs text-gray-500">{title}</p><p className="mt-1 text-xl font-bold">{value}</p><p className={`text-xs mt-0.5 ${up ? 'text-green-600' : 'text-red-500'}`}>{trend}</p></CardContent></Card>
}

export default function ProjectCargoHeavyLiftView() {
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

  const filtered = allProjectCargo.filter(e => {
    const q = searchQuery.toLowerCase()
    if (q && !e.id.toLowerCase().includes(q) && !e.equipment.toLowerCase().includes(q) && !e.description.toLowerCase().includes(q) && !e.forwarder.toLowerCase().includes(q) && !e.destination.toLowerCase().includes(q)) return false
    return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(e[key as keyof typeof e] as string))
  })

  const totalCost = allProjectCargo.reduce((s, e) => s + e.cost_inr, 0)
  const inTransit = allProjectCargo.filter(e => e.move_status === 'In Transit ODC').length
  const atSite = allProjectCargo.filter(e => e.move_status === 'At Site RIG').length
  const totalWeight = allProjectCargo.reduce((s, e) => s + e.weight_mt * e.quantity, 0)

  const monthlyData = [
    { month: 'Jan', lifts: 12, value_cr: 85, weight_kmt: 4.2 },
    { month: 'Feb', lifts: 18, value_cr: 142, weight_kmt: 6.8 },
    { month: 'Mar', lifts: 25, value_cr: 198, weight_kmt: 9.5 },
    { month: 'Apr', lifts: 8, value_cr: 62, weight_kmt: 2.8 },
    { month: 'May', lifts: 32, value_cr: 265, weight_kmt: 12.4 },
    { month: 'Jun', lifts: 5, value_cr: 38, weight_kmt: 1.8 },
    { month: 'Jul', lifts: 35, value_cr: 298, weight_kmt: 14.2 },
  ]
  const equipmentData = EQUIPMENT_TYPES.map(t => ({ equipment: t.split(' ').slice(0, 2).join(' '), count: allProjectCargo.filter(r => r.equipment === t).length }))
  const forwarderData = PROJECT_FORWARDERS.map(f => ({ forwarder: f.split(' ').slice(-2).join(' '), count: allProjectCargo.filter(r => r.forwarder === f).length }))

  const tabs = [
    { value: 'dashboard', label: 'Dashboard' },
    { value: 'movements', label: 'Movements' },
    { value: 'analytics', label: 'Analytics' },
    { value: 'insights', label: 'Insights' },
  ]

  return (
    <div className="pcl-container space-y-4">
      <PageHeader title="Project Cargo & Heavy Lift" description="Over-dimensional (ODC) and out-of-gauge (OOG) project cargo logistics for wind turbines, power transformers, tunnel boring machines, crawler cranes, gas turbines, steel bridge girders, satellite payloads, and nuclear reactor vessels with multi-axle heavy haul routing, state highway permit management, customs ODC clearance, route survey engineering, and RIG (Rigging, Installation, Grouting) at destination sites across Indian infrastructure mega-projects" />
      <ModuleBreadcrumb items={[{ label: 'Specialized' }, { label: 'Project Cargo' }]} />
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="pcl-tabs-list">
          {tabs.map(t => <TabsTrigger key={t.value} value={t.value} className="pcl-tab-trigger">{t.label}</TabsTrigger>)}
        </TabsList>

        <TabsContent value="dashboard" className="pcl-tab-content space-y-4 mt-4">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <KpiTile title="Total Consignments" value={allProjectCargo.length.toString()} sub="Heavy lift lots" />
            <KpiTile title="Total Weight" value={`${(totalWeight / 1000).toFixed(1)}kMT`} sub="Metric tonnes total" />
            <KpiTile title="Total Value" value={`₹${(totalCost / 10000000).toFixed(0)}Cr`} sub="Project cargo value" />
            <KpiTile title="In Transit ODC" value={inTransit.toString()} sub={`${((inTransit / allProjectCargo.length) * 100).toFixed(0)}% on road` } />
          </div>
          <div className="grid gap-4 grid-cols-3 md:grid-cols-6">
            <HealthRing value={96} label="Route Compliance" color="#7c3aed" />
            <HealthRing value={98} label="Safety Record" color="#6d28d9" />
            <HealthRing value={92} label="Permit Approved" color="#8b5cf6" />
            <HealthRing value={95} label="On-Time SLA" color="#5b21b6" />
            <HealthRing value={97} label="Insurance Valid" color="#a78bfa" />
            <HealthRing value={94} label="Customs Cleared" color="#c4b5fd" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="pcl-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Monthly Lifts & Weight (kMT)</CardTitle></CardHeader><CardContent><LineChart data={monthlyData} width={300} height={200}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" fontSize={12} /><YAxis fontSize={12} /><Tooltip /><Legend /><Line type="monotone" dataKey="lifts" stroke="#7c3aed" strokeWidth={2} /><Line type="monotone" dataKey="weight_kmt" stroke="#6d28d9" strokeWidth={2} strokeDasharray="5 5" /></LineChart></CardContent></Card>
            <Card className="pcl-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Equipment Type Distribution</CardTitle></CardHeader><CardContent><BarChart data={equipmentData} width={300} height={200}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="equipment" fontSize={10} angle={-30} textAnchor="end" height={50} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="count" fill="#7c3aed" radius={[4,4,0,0]} /></BarChart></CardContent></Card>
            <Card className="pcl-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Forwarder Market Share</CardTitle></CardHeader><CardContent><PieChart width={300} height={200}><Pie data={forwarderData} dataKey="count" nameKey="forwarder" cx="50%" cy="50%" outerRadius={70} label={({ forwarder, count }) => `${count}`}>{forwarderData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="movements" className="pcl-tab-content space-y-4 mt-4">
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={allProjectCargo.length} filteredCount={filtered.length} onRefresh={() => {}} placeholder="Search by ID, equipment, forwarder, destination, or lot..." />
          <div className="overflow-x-auto rounded-lg border">
            <table className="pcl-table w-full text-sm">
              <thead><tr className="pcl-table-header bg-gray-50"><th className="px-3 py-2 text-left font-medium">ID</th><th className="px-3 py-2 text-left font-medium">Equipment</th><th className="px-3 py-2 text-left font-medium">Status</th><th className="px-3 py-2 text-left font-medium">Weight</th><th className="px-3 py-2 text-left font-medium">Value</th><th className="px-3 py-2 text-left font-medium">Forwarder</th><th className="px-3 py-2 text-left font-medium">Destination</th><th className="px-3 py-2 text-left font-medium">Dims</th><th className="px-3 py-2 text-left font-medium">MT</th></tr></thead>
              <tbody>{filtered.slice(0, 20).map(e => (
                <tr key={e.id} className="pcl-table-row border-t hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-2 font-mono text-xs">{e.id}</td>
                  <td className="px-3 py-2"><EquipmentBadge equipment={e.equipment} /></td>
                  <td className="px-3 py-2"><StatusBadge status={e.move_status} /></td>
                  <td className="px-3 py-2 text-xs">{e.weight_mt}MT</td>
                  <td className="px-3 py-2"><CostBar cost={e.cost_inr} /></td>
                  <td className="px-3 py-2 text-xs">{e.forwarder}</td>
                  <td className="px-3 py-2 text-xs">{e.destination}</td>
                  <td className="px-3 py-2 text-xs">{e.dimensions_m}</td>
                  <td className="px-3 py-2 text-xs">{e.quantity}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="pcl-tab-content space-y-4 mt-4">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <ValueTile title="Avg Move Time" value="8.5 days" trend="-15% faster" />
            <ValueTile title="ODC Permit Rate" value="94.2%" trend="+3.1% approved" />
            <ValueTile title="Heavy Lift Revenue" value="₹485Cr" trend="+28% YoY" />
            <ValueTile title="Safety Index" value="99.6%" trend="+0.4% improved" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="pcl-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Revenue by Equipment Category</CardTitle></CardHeader><CardContent><BarChart data={EQUIPMENT_TYPES.map(t => ({ equipment: t.split(' ').slice(0, 2).join(' '), total: allProjectCargo.filter(r => r.equipment === t).reduce((s, r) => s + r.cost_inr, 0) / 10000000 }))} width={400} height={250}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="equipment" fontSize={10} angle={-30} textAnchor="end" height={50} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="total" fill="#6d28d9" radius={[4,4,0,0]} /></BarChart></CardContent></Card>
            <Card className="pcl-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Move Status Breakdown</CardTitle></CardHeader><CardContent><PieChart width={400} height={250}><Pie data={MOVE_STATUS.map(s => ({ status: s, count: allProjectCargo.filter(e => e.move_status === s).length }))} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={80} label>{MOVE_STATUS.map((_, i) => <Cell key={i} fill={['#3b82f6','#22c55e','#f59e0b','#8b5cf6','#eab308','#9ca3af'][i]} />)}</Pie><Tooltip /></PieChart></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="pcl-tab-content space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="pcl-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">NHAI ODC Over-Dimensional Cargo Movement Management</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>National Highways Authority of India (NHAI) integrated ODC permit management system for heavy cargo movements across 1,39,000 km of national highway network. Real-time automated permit processing with multi-state corridor approval workflow reducing permit acquisition time from 15 days to 72 hours. Integration with NHAI toll plaza override system enabling ODC vehicles to bypass FASTag toll points with automated vehicle detection using RFID and ANPR cameras. Route deviation monitoring through GPS/GIS tracking ensuring vehicles stay on approved ODC corridor routes avoiding low-clearance bridges and sharp curve sections. Dynamic weight bridge data integration from 2,800+ weigh stations across national highways verifying actual axle weights against permitted limits with 99.2% compliance rate.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-violet-100 px-2 py-0.5 text-violet-800">Critical</span><span className="text-gray-400">Live</span></div></CardContent></Card>
            <Card className="pcl-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">RIG (Rigging Installation Grouting) Site Execution Tracking</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>End-to-end RIG execution management from port gate to final positioning covering crane selection, rigging methodology, and foundation grouting for mega infrastructure projects worth {'₹'}12 lakh crore under execution. Real-time mobile crane and SPMT (Self-Propelled Modular Transporter) positioning accuracy monitoring with centimeter-level GPS for critical lifts requiring sub-5mm alignment tolerance. Integration with L&T, TATA Projects, Afcons, and 28 other EPC contractors for synchronized delivery scheduling ensuring equipment arrives precisely when foundation and rigging preparations are complete. Digital method statement and lift plan approval workflow with client third-party inspection agencies covering all critical lifts above 100MT. Structural integrity monitoring during heavy lift operations with real-time load cell data and wind speed monitoring triggering automatic lift suspension when conditions exceed safety thresholds.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-purple-100 px-2 py-0.5 text-purple-800">Operational</span><span className="text-gray-400">Q3 2026</span></div></CardContent></Card>
            <Card className="pcl-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">Multi-Axle Trailer & Heavy Haul Fleet Optimization</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>AI-powered heavy haul fleet optimization managing 450+ multi-axle trailers (16-72 axle configurations) for payloads from 80MT to 800MT across Indian highway network. Automated trailer configuration selection based on cargo dimensions, weight distribution analysis, and route constraints ensuring optimal axle loading within 10.2T per axle national highway limit. Integration with state RTO offices for special registration certificate automation and escort vehicle deployment scheduling for ODC movements exceeding 3.5M width. Predictive maintenance system for trailer hydraulic axles, suspension systems, and brake modules using vibration analysis and oil condition monitoring reducing fleet downtime by 35%. Real-time driver fatigue monitoring and rest stop compliance through in-cab IoT telematics ensuring heavy haul safety standards compliance with Indian Motor Vehicles Act and Arai crash safety norms.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-indigo-100 px-2 py-0.5 text-indigo-800">Strategic</span><span className="text-gray-400">FY2027</span></div></CardContent></Card>
            <Card className="pcl-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">Infrastructure Mega-Project Demand Forecasting</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Machine learning model forecasting project cargo demand 12 months ahead with 89% accuracy integrating data from NITI Aayog infrastructure pipeline tracker, Ministry of Road Transport mega bridge projects, and NHCP Bharatmala Pariyojana phase-II schedules. Correlation analysis between government capex announcements, tender award dates, and actual heavy cargo movement requirements for 42 active infrastructure mega-projects including NMCRL nuclear power, Dedicated Freight Corridor, and Smart Cities Mission. Dynamic pricing model for project cargo freight rates based on route complexity index, seasonal demand patterns, and equipment availability across 8 forwarder hubs. Integration with Indian Ports Association (IPA) vessel scheduling data for break-bulk and project cargo berth planning at 12 major ports handling ODC imports from Europe, China, and South Korea.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-fuchsia-100 px-2 py-0.5 text-fuchsia-800">Innovation</span><span className="text-gray-400">Pilot</span></div></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
