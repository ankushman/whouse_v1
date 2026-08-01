import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#4338ca', '#3730a3', '#6366f1', '#818cf8', '#a5b4fc', '#312e81', '#1e1b4b', '#eef2ff']

const EQUIPMENT_TYPES = ['Rack Server 2U', 'Blade Server', 'SAN Storage Array', 'UPS 100kVA', 'PDU 48-Port', 'CRAC Unit', 'Network Switch L3', 'Fiber Patch Panel']
const OEMS = ['Dell Technologies India', 'HPE Bengaluru', 'NetApp Bengaluru', 'Cisco India Mumbai', 'Schneider Electric Chennai', 'Vertiv Noida', 'Eaton Power Pune', 'APC by Schneider Noida']
const STATUSES = ['RACK Commissioned', 'SLA Verified', 'In Transit ESD', 'Data Center Stored', 'Pending MEPSY', 'Awaiting Installation']
const CITIES = ['Mumbai MH', 'Bengaluru KA', 'Noida UP', 'Chennai TN', 'Pune MH', 'Hyderabad TG', 'Gurugram HR', 'Kolkata WB', 'Ahmedabad GJ', 'Jaipur RJ']

const dceRecords = [
  { id: 'DCE-0001', equipment: 'Rack Server 2U', description: 'Dell PowerEdge R760 2U rack server 240 units for CtrlS Mumbai Saki Vihar hyperscale Tier-4 data center with dual Xeon Sapphire Rapids hot-aisle containment IS 9001 certified rack commissioning', oem: 'Dell Technologies India', quantity: 240, unit: 'units', move_status: 'RACK Commissioned', lot: 'LOT-DCE-5001', destination: 'Mumbai MH', received: '2026-07-30', batch: 'DCE-B2026-0730', cost_inr: 144000000, weight_mt: 14.4, power_kw: 84.0 },
  { id: 'DCE-0002', equipment: 'Blade Server', description: 'HPE ProLiant BL460c Gen11 blade server 48 units for Yotta Navi Mumbai Dhirubhai Ambani Knowledge City hyperscale with mezzanine network modules SLA verification and thermal profiling', oem: 'HPE Bengaluru', quantity: 48, unit: 'racks', move_status: 'SLA Verified', lot: 'LOT-DCE-5002', destination: 'Bengaluru KA', received: '2026-07-30', batch: 'DCE-B2026-0730', cost_inr: 96000000, weight_mt: 28.8, power_kw: 57.6 },
  { id: 'DCE-0003', equipment: 'SAN Storage Array', description: 'NetApp AFF A900 all-flash SAN storage array 12 units for Tata Communications Hyderabad data center with NVMe SSD shelves SnapMirror DR replication ESD protected air freight', oem: 'NetApp Bengaluru', quantity: 12, unit: 'arrays', move_status: 'In Transit ESD', lot: 'LOT-DCE-5003', destination: 'Hyderabad TG', received: '2026-07-29', batch: 'DCE-B2026-0729', cost_inr: 108000000, weight_mt: 6.0, power_kw: 18.0 },
  { id: 'DCE-0004', equipment: 'UPS 100kVA', description: 'Schneider Electric Galaxy VX 100kVA UPS system 36 units for AdaniConneX Chennai data center park IEC 62040-3 compliant lithium-ion battery backup stored in DC yard staging', oem: 'Schneider Electric Chennai', quantity: 36, unit: 'units', move_status: 'Data Center Stored', lot: 'LOT-DCE-5004', destination: 'Chennai TN', received: '2026-07-29', batch: 'DCE-B2026-0729', cost_inr: 216000000, weight_mt: 43.2, power_kw: 3600.0 },
  { id: 'DCE-0005', equipment: 'PDU 48-Port', description: 'Vertiv Geist rPDU 48-port switched power distribution unit 180 units for Noida Expressway data center corridor with per-outlet metering environmental monitoring pending MEPSY', oem: 'Vertiv Noida', quantity: 180, unit: 'units', move_status: 'Pending MEPSY', lot: 'LOT-DCE-5005', destination: 'Noida UP', received: '2026-07-28', batch: 'DCE-B2026-0728', cost_inr: 27000000, weight_mt: 5.4, power_kw: 0.0 },
  { id: 'DCE-0006', equipment: 'CRAC Unit', description: 'Eaton Power precision cooling CRAC unit 24 pairs for CtrlS Pune Chakan data center 200kW cooling capacity EC fan technology awaiting rack installation clearance', oem: 'Eaton Power Pune', quantity: 24, unit: 'pairs', move_status: 'Awaiting Installation', lot: 'LOT-DCE-5006', destination: 'Pune MH', received: '2026-07-28', batch: 'DCE-B2026-0728', cost_inr: 43200000, weight_mt: 19.2, power_kw: 240.0 },
  { id: 'DCE-0007', equipment: 'Network Switch L3', description: 'Cisco Nexus 9364C Layer 3 network switch 96 units for Reliance Jio Mumbai data center 100GbE uplinks VXLAN BGP EVPN fabric spine-leaf commissioned', oem: 'Cisco India Mumbai', quantity: 96, unit: 'units', move_status: 'RACK Commissioned', lot: 'LOT-DCE-5007', destination: 'Mumbai MH', received: '2026-07-27', batch: 'DCE-B2026-0727', cost_inr: 57600000, weight_mt: 1.9, power_kw: 4.8 },
  { id: 'DCE-0008', equipment: 'Fiber Patch Panel', description: 'APC by Schneider NetShelter fiber patch panel 48-port LC duplex 240 units for STPI Bengaluru Electronic City data center OS2 single-mode MPO cabling SLA verified', oem: 'APC by Schneider Noida', quantity: 240, unit: 'units', move_status: 'SLA Verified', lot: 'LOT-DCE-5008', destination: 'Bengaluru KA', received: '2026-07-27', batch: 'DCE-B2026-0727', cost_inr: 8400000, weight_mt: 0.6, power_kw: 0.0 },
  { id: 'DCE-0009', equipment: 'Rack Server 2U', description: 'HPE ProLiant DL380 Gen11 2U rack server 120 units for AWS Hyderabad ap-south-2 availability zone custom BMC firmware ESD controlled dedicated transport', oem: 'HPE Bengaluru', quantity: 120, unit: 'units', move_status: 'In Transit ESD', lot: 'LOT-DCE-5009', destination: 'Hyderabad TG', received: '2026-07-26', batch: 'DCE-B2026-0726', cost_inr: 72000000, weight_mt: 7.2, power_kw: 42.0 },
  { id: 'DCE-0010', equipment: 'Blade Server', description: 'Dell PowerEdge M660 blade server chassis 32 racks for Microsoft Azure Pune region hot-plug blade modules FlexFabric interconnect stored in staging warehouse', oem: 'Dell Technologies India', quantity: 32, unit: 'racks', move_status: 'Data Center Stored', lot: 'LOT-DCE-5010', destination: 'Mumbai MH', received: '2026-07-26', batch: 'DCE-B2026-0726', cost_inr: 64000000, weight_mt: 19.2, power_kw: 38.4 },
  { id: 'DCE-0011', equipment: 'SAN Storage Array', description: 'NetApp FAS8300 hybrid SAN storage array 18 units for Sify Technologies Chennai Tier-3 data center SATA SSD tiering SnapLock compliance pending MEPSY clearance', oem: 'Cisco India Mumbai', quantity: 18, unit: 'arrays', move_status: 'Pending MEPSY', lot: 'LOT-DCE-5011', destination: 'Chennai TN', received: '2026-07-25', batch: 'DCE-B2026-0725', cost_inr: 90000000, weight_mt: 9.0, power_kw: 27.0 },
  { id: 'DCE-0012', equipment: 'UPS 100kVA', description: 'Vertiv Liebert EXL S1 100kVA UPS 28 units for Web Werks Mumbai Powai colocation online double-conversion ECO mode commissioned with BMS integration', oem: 'Vertiv Noida', quantity: 28, unit: 'units', move_status: 'RACK Commissioned', lot: 'LOT-DCE-5012', destination: 'Noida UP', received: '2026-07-25', batch: 'DCE-B2026-0725', cost_inr: 168000000, weight_mt: 33.6, power_kw: 2800.0 },
  { id: 'DCE-0013', equipment: 'PDU 48-Port', description: 'Schneider Electric Rack PDU 48-port basic 200 units for Nxtra by Airtel Gurugram data center C13 C19 outlets locking receptacles awaiting installation clearance', oem: 'Schneider Electric Chennai', quantity: 200, unit: 'units', move_status: 'Awaiting Installation', lot: 'LOT-DCE-5013', destination: 'Gurugram HR', received: '2026-07-24', batch: 'DCE-B2026-0724', cost_inr: 30000000, weight_mt: 6.0, power_kw: 0.0 },
  { id: 'DCE-0014', equipment: 'CRAC Unit', description: 'Eaton Power DSE 60kW CRAC unit 30 pairs for GPX India Chennai data center redundant compressors free-cooling coils SLA verified for Tier-3 uptime', oem: 'APC by Schneider Noida', quantity: 30, unit: 'pairs', move_status: 'SLA Verified', lot: 'LOT-DCE-5014', destination: 'Chennai TN', received: '2026-07-24', batch: 'DCE-B2026-0724', cost_inr: 54000000, weight_mt: 24.0, power_kw: 300.0 },
  { id: 'DCE-0015', equipment: 'Network Switch L3', description: 'Cisco Catalyst 9500 L3 switch 72 units for Tata Communications Mumbai data center StackWise Virtual MACsec encryption ESD transit via dedicated courier', oem: 'NetApp Bengaluru', quantity: 72, unit: 'units', move_status: 'In Transit ESD', lot: 'LOT-DCE-5015', destination: 'Pune MH', received: '2026-07-23', batch: 'DCE-B2026-0723', cost_inr: 43200000, weight_mt: 1.4, power_kw: 3.6 },
  { id: 'DCE-0016', equipment: 'Fiber Patch Panel', description: 'APC by Schneider Patch Panel 24-port SC 160 units for ESDS Software Solution Noida data center OM3 multimode fiber bend-insensitive cables stored in warehouse', oem: 'Eaton Power Pune', quantity: 160, unit: 'units', move_status: 'Data Center Stored', lot: 'LOT-DCE-5016', destination: 'Noida UP', received: '2026-07-23', batch: 'DCE-B2026-0723', cost_inr: 5600000, weight_mt: 0.5, power_kw: 0.0 },
  { id: 'DCE-0017', equipment: 'Rack Server 2U', description: 'Dell PowerEdge R750xs 2U server 200 units for NTT India Mumbai data center AMD EPYC Milan processors DDR5 memory pending MEPSY certification audit', oem: 'Cisco India Mumbai', quantity: 200, unit: 'units', move_status: 'Pending MEPSY', lot: 'LOT-DCE-5017', destination: 'Kolkata WB', received: '2026-07-22', batch: 'DCE-B2026-0722', cost_inr: 120000000, weight_mt: 12.0, power_kw: 70.0 },
  { id: 'DCE-0018', equipment: 'Blade Server', description: 'HPE Synergy 12000 blade enclosure 16 racks for CtrlS Hyderabad data center Composer management Image Streamer deployed and commissioned for cloud orchestration', oem: 'Schneider Electric Chennai', quantity: 16, unit: 'racks', move_status: 'RACK Commissioned', lot: 'LOT-DCE-5018', destination: 'Hyderabad TG', received: '2026-07-22', batch: 'DCE-B2026-0722', cost_inr: 48000000, weight_mt: 14.4, power_kw: 19.2 },
  { id: 'DCE-0019', equipment: 'SAN Storage Array', description: 'NetApp ASA A250 all-san array 14 units for Zoho Corporation Chennai data center NVMe over Fibre Channel SANtricity operating system SLA verified', oem: 'Vertiv Noida', quantity: 14, unit: 'arrays', move_status: 'SLA Verified', lot: 'LOT-DCE-5019', destination: 'Mumbai MH', received: '2026-07-21', batch: 'DCE-B2026-0721', cost_inr: 70000000, weight_mt: 7.0, power_kw: 21.0 },
  { id: 'DCE-0020', equipment: 'UPS 100kVA', description: 'Schneider Electric Smart-UPS 100kVA 40 units for Sify Noida data center network management card extended runtime modules awaiting installation at facility', oem: 'APC by Schneider Noida', quantity: 40, unit: 'units', move_status: 'Awaiting Installation', lot: 'LOT-DCE-5020', destination: 'Ahmedabad GJ', received: '2026-07-21', batch: 'DCE-B2026-0721', cost_inr: 200000000, weight_mt: 48.0, power_kw: 4000.0 },
]

const genRecords = (start: number) => {
  const statuses = STATUSES
  const oems = OEMS
  return Array.from({ length: 20 }, (_, i) => ({
    id: `DCE-${String(start + i).padStart(4, '0')}`,
    equipment: EQUIPMENT_TYPES[(start + i) % 8],
    description: `${EQUIPMENT_TYPES[(start + i) % 8]} supply for data center batch ${String((start + i) % 99 + 1).padStart(3, '0')}`,
    oem: oems[(start + i) % 8],
    quantity: Math.round(2 + Math.random() * 100),
    unit: ['units', 'racks', 'pairs', 'arrays'][i % 4],
    move_status: statuses[(start + i) % 6],
    lot: `LOT-DCE-${String(1000 + start + i).padStart(4, '0')}`,
    destination: CITIES[(start + i) % 10],
    received: `2026-07-${String(20 - Math.floor((start + i) / 10)).padStart(2, '0')}`,
    batch: `DCE-B2026-${String(710 - Math.floor((start + i) / 3)).padStart(4, '0')}`,
    cost_inr: Math.round(300000 + Math.random() * 10000000),
    weight_mt: Math.round((0.5 + Math.random() * 25) * 10) / 10,
    power_kw: Math.round((0.5 + Math.random() * 100) * 10) / 10,
  }))
}

const allRecords = [...dceRecords, ...genRecords(21), ...genRecords(41)]

function ri(min: number, max: number, value: number) { return Math.max(min, Math.min(max, value)) }

const filterGroups = [
  {
    key: 'equipment',
    label: 'Equipment Type',
    options: EQUIPMENT_TYPES.map(t => ({ label: t, value: t, count: allRecords.filter(r => r.equipment === t).length })),
  },
  {
    key: 'oem',
    label: 'OEM Provider',
    options: OEMS.map(o => ({ label: o, value: o, count: allRecords.filter(r => r.oem === o).length })),
  },
  {
    key: 'move_status',
    label: 'Move Status',
    options: STATUSES.map(s => ({ label: s, value: s, count: allRecords.filter(r => r.move_status === s).length })),
  },
  {
    key: 'destination',
    label: 'Destination',
    options: CITIES.map(c => ({ label: c, value: c, count: allRecords.filter(r => r.destination === c).length })),
  },
]

function EquipBadge({ equipment }: { equipment: string }) {
  const colors: Record<string, string> = { 'Rack Server 2U': 'bg-indigo-100 text-indigo-800', 'Blade Server': 'bg-violet-100 text-violet-800', 'SAN Storage Array': 'bg-blue-100 text-blue-800', 'UPS 100kVA': 'bg-amber-100 text-amber-800', 'PDU 48-Port': 'bg-emerald-100 text-emerald-800', 'CRAC Unit': 'bg-cyan-100 text-cyan-800', 'Network Switch L3': 'bg-rose-100 text-rose-800', 'Fiber Patch Panel': 'bg-teal-100 text-teal-800' }
  return <span className={`dce-equip-badge inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[equipment] || 'bg-gray-100 text-gray-800'}`}>{equipment}</span>
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = { 'RACK Commissioned': 'bg-green-100 text-green-800', 'SLA Verified': 'bg-blue-100 text-blue-800', 'In Transit ESD': 'bg-indigo-100 text-indigo-800', 'Data Center Stored': 'bg-slate-100 text-slate-800', 'Pending MEPSY': 'bg-yellow-100 text-yellow-800', 'Awaiting Installation': 'bg-gray-200 text-gray-700' }
  return <span className={`dce-status-badge inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-700'}`}>{status}</span>
}

function CostBar({ cost }: { cost: number }) {
  const pct = Math.min(100, Math.max(0, (cost / 150000000) * 100))
  const color = cost >= 100000000 ? 'bg-indigo-600' : cost >= 50000000 ? 'bg-indigo-500' : cost >= 20000000 ? 'bg-indigo-400' : 'bg-indigo-300'
  return <div className="dce-cost-bar flex items-center gap-2"><div className="h-2 w-20 rounded-full bg-gray-200"><div className={`dce-cost-bar-fill h-2 rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} /></div><span className="text-xs text-gray-500">{'\u20B9'}{(cost / 10000000).toFixed(1)}Cr</span></div>
}

function HealthRing({ value, label, color }: { value: number; label: string; color: string }) {
  const r = 28, cx = 35, cy = 35, sw = 5
  const circ = 2 * Math.PI * r
  const offset = circ - (Math.min(100, Math.max(0, value)) / 100) * circ
  return <div className="dce-health-ring flex flex-col items-center"><svg width={70} height={70} className="-rotate-90"><circle cx={cx} cy={cy} r={r} fill="none" stroke="#e5e7eb" strokeWidth={sw} /><circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={sw} strokeDasharray={circ} strokeDashoffset={offset} className="dce-ring-path" strokeLinecap="round" /></svg><span className="dce-ring-value mt-1 text-sm font-bold" style={{ color }}>{value}%</span><span className="text-xs text-gray-500">{label}</span></div>
}

function KpiTile({ title, value, sub }: { title: string; value: string; sub: string }) {
  return <Card className="dce-kpi-card"><CardContent className="p-4"><p className="text-xs text-gray-500">{title}</p><p className="dce-kpi-value mt-1 text-2xl font-bold">{value}</p><p className="text-xs text-gray-400 mt-0.5">{sub}</p></CardContent></Card>
}

function ValueTile({ title, value, trend }: { title: string; value: string; trend: string }) {
  const up = trend.startsWith('+')
  return <Card className="dce-value-tile"><CardContent className="p-4"><p className="text-xs text-gray-500">{title}</p><p className="mt-1 text-xl font-bold">{value}</p><p className={`text-xs mt-0.5 ${up ? 'text-green-600' : 'text-red-500'}`}>{trend}</p></CardContent></Card>
}

export default function DataCenterEquipmentView() {
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

  const filtered = useMemo(() => allRecords.filter(e => {
    const q = searchQuery.toLowerCase()
    if (q && !e.id.toLowerCase().includes(q) && !e.equipment.toLowerCase().includes(q) && !e.description.toLowerCase().includes(q) && !e.oem.toLowerCase().includes(q) && !e.destination.toLowerCase().includes(q)) return false
    return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(e[key as keyof typeof e] as string))
  }), [searchQuery, activeFilters])

  const totalCost = allRecords.reduce((s, e) => s + e.cost_inr, 0)
  const totalQty = allRecords.reduce((s, e) => s + e.quantity, 0)
  const totalPower = allRecords.reduce((s, e) => s + e.power_kw, 0)
  const rackComm = allRecords.filter(e => e.move_status === 'RACK Commissioned').length
  const inTransit = allRecords.filter(e => e.move_status === 'In Transit ESD').length
  const dcStored = allRecords.filter(e => e.move_status === 'Data Center Stored').length
  const pendingMepsy = allRecords.filter(e => e.move_status === 'Pending MEPSY').length

  const lineData = [
    { month: 'Jan', units: 4200, value_cr: 85 },
    { month: 'Feb', units: 6800, value_cr: 142 },
    { month: 'Mar', units: 5100, value_cr: 98 },
    { month: 'Apr', units: 8400, value_cr: 186 },
    { month: 'May', units: 9200, value_cr: 210 },
    { month: 'Jun', units: 3800, value_cr: 72 },
    { month: 'Jul', units: 11000, value_cr: 248 },
  ]
  const barData = EQUIPMENT_TYPES.map(t => ({ name: t.split(' ').slice(0, 2).join(' '), count: allRecords.filter(r => r.equipment === t).reduce((s, r) => s + r.quantity, 0) }))
  const pieData = OEMS.map(o => ({ name: o.split(' ').slice(0, 2).join(' '), value: allRecords.filter(r => r.oem === o).reduce((s, r) => s + r.cost_inr, 0) }))

  const tabs = [
    { value: 'dashboard', label: 'Dashboard' },
    { value: 'inventory', label: 'Inventory' },
    { value: 'analytics', label: 'Analytics' },
    { value: 'insights', label: 'Insights' },
  ]

  return (
    <div className="dce-container space-y-4">
      <PageHeader title="Data Center Equipment Logistics" description="End-to-end data center equipment warehousing, ESD-safe handling, MEPSY certification tracking, and hyperscale facility logistics covering rack servers blade servers SAN storage UPS PDU CRAC network switches and fiber patch panels for Indian data center corridor Noida Mumbai Chennai Bengaluru Hyderabad, Tier-4 certification, PUE optimization, and rack installation management across Dell Technologies HPE NetApp Cisco Schneider Electric Vertiv Eaton and APC by Schneider" />
      <ModuleBreadcrumb items={[{ label: 'Infrastructure' }, { label: 'Data Center Equipment' }]} />
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="dce-tabs-list">
          {tabs.map(t => <TabsTrigger key={t.value} value={t.value} className="dce-tab-trigger">{t.label}</TabsTrigger>)}
        </TabsList>

        <TabsContent value="dashboard" className="dce-tab-content space-y-4 mt-4">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <KpiTile title="Total Consignments" value={allRecords.length.toString()} sub="DC equipment lots" />
            <KpiTile title="Total Units" value={`${(totalQty / 1000).toFixed(1)}K`} sub="Equipment items" />
            <KpiTile title="Total Value" value={`{'\u20B9'}${(totalCost / 10000000).toFixed(0)}Cr`} sub="Supply chain value" />
            <KpiTile title="In Transit" value={inTransit.toString()} sub={`${((inTransit / allRecords.length) * 100).toFixed(0)}% in pipeline`} />
          </div>
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <ValueTile title="Rack Utilization" value="94.2%" trend="+3.1% vs Q1" />
            <ValueTile title="SLA Compliance" value="97.8%" trend="+1.2% improved" />
            <ValueTile title="Avg Lead Time" value="5.6 days" trend="-1.2 days faster" />
            <ValueTile title="Power Efficiency" value="1.32 PUE" trend="-0.08 improved" />
          </div>
          <div className="grid gap-4 grid-cols-3 md:grid-cols-6">
            <HealthRing value={96} label="Rack Ready" color="#4338ca" />
            <HealthRing value={94} label="SLA Met" color="#3730a3" />
            <HealthRing value={91} label="ESD Safe" color="#6366f1" />
            <HealthRing value={93} label="Cooling OK" color="#818cf8" />
            <HealthRing value={97} label="On-Time" color="#312e81" />
            <HealthRing value={89} label="PUE Score" color="#1e1b4b" />
          </div>
          <Card><CardContent className="flex flex-wrap items-center gap-3 p-4"><EquipBadge equipment="Rack Server 2U" /><EquipBadge equipment="SAN Storage Array" /><StatusBadge status="RACK Commissioned" /><CostBar cost={allRecords[0].cost_inr} /></CardContent></Card>
        </TabsContent>

        <TabsContent value="inventory" className="dce-tab-content space-y-4 mt-4">
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={allRecords.length} filteredCount={filtered.length} onRefresh={() => {}}
            placeholder="Search by ID, equipment, OEM, destination, or lot..." />
          <div className="overflow-x-auto rounded-lg border">
            <table className="dce-table w-full text-sm">
              <thead><tr className="dce-table-header bg-gray-50"><th className="px-3 py-2 text-left font-medium">ID</th><th className="px-3 py-2 text-left font-medium">Equipment</th><th className="px-3 py-2 text-left font-medium">Status</th><th className="px-3 py-2 text-left font-medium">Qty</th><th className="px-3 py-2 text-left font-medium">Value</th><th className="px-3 py-2 text-left font-medium">OEM</th><th className="px-3 py-2 text-left font-medium">Dest</th><th className="px-3 py-2 text-left font-medium">kW</th><th className="px-3 py-2 text-left font-medium">Wt</th></tr></thead>
              <tbody>{filtered.slice(0, 20).map(r => (
                <tr key={r.id} className="dce-table-row border-t hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-2 font-mono text-xs">{r.id}</td>
                  <td className="px-3 py-2"><EquipBadge equipment={r.equipment} /></td>
                  <td className="px-3 py-2"><StatusBadge status={r.move_status} /></td>
                  <td className="px-3 py-2 text-xs">{r.quantity.toLocaleString()}</td>
                  <td className="px-3 py-2"><CostBar cost={r.cost_inr} /></td>
                  <td className="px-3 py-2 text-xs">{r.oem}</td>
                  <td className="px-3 py-2 text-xs">{r.destination}</td>
                  <td className="px-3 py-2 text-xs">{r.power_kw}kW</td>
                  <td className="px-3 py-2 text-xs">{r.weight_mt}t</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="dce-tab-content space-y-4 mt-4">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <ValueTile title="Avg Cost/Unit" value="{'\u20B9'}1,85,000" trend="-8% vs Q1" />
            <ValueTile title="Rack Density" value="42kW/rack" trend="+12% higher" />
            <ValueTile title="MEITY Allocated" value="{'\u20B9'}12,400Cr" trend="+18% FY26" />
            <ValueTile title="Tier-4 Capacity" value="840MW" trend="+45% expansion" />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="dce-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Monthly Equipment Shipments</CardTitle></CardHeader>
              <CardContent><LineChart data={lineData} width={300} height={200}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" fontSize={12} /><YAxis fontSize={12} /><Tooltip /><Legend /><Line type="monotone" dataKey="units" stroke="#4338ca" strokeWidth={2} /></LineChart></CardContent></Card>
            <Card className="dce-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Equipment Quantity by Type</CardTitle></CardHeader>
              <CardContent><BarChart data={barData} width={300} height={200}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={10} angle={-30} textAnchor="end" height={50} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="count" fill="#3730a3" radius={[4,4,0,0]} /></BarChart></CardContent></Card>
            <Card className="dce-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">OEM Value Distribution</CardTitle></CardHeader>
              <CardContent><PieChart width={300} height={200}><Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={({ name, value }) => `{'\u20B9'}${(value / 10000000).toFixed(0)}Cr`}>{pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="dce-tab-content space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="dce-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">MEITY Data Center Policy and India Data Localization Act Compliance Framework</CardTitle></CardHeader>
              <CardContent className="text-xs text-gray-600 space-y-2"><p>Ministry of Electronics and Information Technology (MEITY) data center policy under Digital India program mandating all personal data of Indian citizens stored domestically per Section 43A of IT Act 2000 and Digital Personal Data Protection Act 2023. Data localization requirements driving hyperscale data center construction across Noida Mumbai Chennai Bengaluru corridors with {'\u20B9'}1.5 lakh crore cumulative investment. Mandatory compliance with CERT-In directions for 6-hour incident reporting and 5-year log retention for critical data center infrastructure. Integration with Aadhaar e-KYC data residency requirements and RBI data localization for payment data storage. Real-time tracking of data center equipment compliance with MEITY notified standards including uptime SLA minimum 99.95% Tier-3 and 99.995% Tier-4 requirements.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-indigo-100 px-2 py-0.5 text-indigo-800">Critical</span><span className="text-gray-400">Live</span></div></CardContent></Card>
            <Card className="dce-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">STPI Tier-4 Certification for Indian Hyperscale Data Center Facilities</CardTitle></CardHeader>
              <CardContent className="text-xs text-gray-600 space-y-2"><p>Software Technology Parks of India (STPI) and Telecommunications Engineering Centre (TEC) certification framework for Tier-4 data center facilities under Uptime Institute standards with N+2 redundancy for power cooling and network infrastructure. Indian hyperscale data centers requiring simultaneous maintainable 2N power distribution with automatic transfer switches and 72-hour diesel generator fuel storage per NFPA 110 and IS 14682 standards. STPI certification mandatory for SEZ and IT park data centers availing Section 10A and 10B income tax exemptions with annual audit. Real-time monitoring of Tier-4 milestones including PUE {'<'}1.4 WUE {'<'}0.8 L/kWh and CUE {'<'}0.2 metrics. Integration with Bureau of Energy Efficiency (BEE) star rating for data center energy performance labeling and ECBC compliance.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-violet-100 px-2 py-0.5 text-violet-800">Regulatory</span><span className="text-gray-400">Q3 2026</span></div></CardContent></Card>
            <Card className="dce-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">Noida-Mumbai-Chennai Data Center Corridor Power Capacity and Green Energy Transition</CardTitle></CardHeader>
              <CardContent className="text-xs text-gray-600 space-y-2"><p>Noida-Mumbai-Chennai data center corridor consuming 4200MW projected by 2027 with state electricity regulatory commissions allocating dedicated power substations and green energy corridors. Uttar Pradesh PVVNL and Maharashtra MSEDCL providing 200MW dedicated feeders for Noida Expressway and Mumbai Airoli data center clusters with differential tariff under UP Electricity Supply Code 2023. Tamil Nadu TNEB allocating 500MW renewable energy bundle for Chennai Sriperumbudur data center park with solar-wind hybrid PPA at {'\u20B9'}3.8 per unit. Green energy tracking with 47 data centers achieving 100% renewable certification through RECs and open access solar. Battery energy storage 500MWh deployment across corridor for grid stability with 4-hour discharge LFP technology.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-800">Strategic</span><span className="text-gray-400">FY2028</span></div></CardContent></Card>
            <Card className="dce-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">AI-Powered PUE Optimization and Predictive Cooling Management for Indian DCs</CardTitle></CardHeader>
              <CardContent className="text-xs text-gray-600 space-y-2"><p>Artificial intelligence-driven Power Usage Effectiveness (PUE) optimization processing 2.8 million sensor data points hourly across 47 Indian data centers with ML models predicting cooling loads 4 hours in advance achieving 18% energy reduction. Deep neural network controlling CRAC unit operations and variable speed drives for chilled water pumps with real-time adjustment based on IT load heat maps and IMD weather data feeds. Predictive cooling reducing water usage effectiveness (WUE) from 1.2 to 0.6 L/kWh through intelligent free cooling during Indian winter November-February across North Indian DCs in Noida and Jaipur. Digital twin simulation with CFD modeling optimizing hot-aisle cold-aisle containment. Integration with BEE targeting national average PUE {'<'}1.3 by 2028 with carbon-neutral cooling through liquid immersion and direct-to-chip technology.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-blue-800">Innovation</span><span className="text-gray-400">Pilot</span></div></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
