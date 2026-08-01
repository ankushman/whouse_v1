import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#4338ca', '#3730a3', '#6366f1', '#818cf8', '#a5b4fc', '#312e81', '#1e1b4b', '#e0e7ff']

const BATTERY_TYPES = ['NMC 811 Prismatic', 'LFP Cylindrical', 'NCA Pouch', 'Sodium-Ion', 'Solid-State LFP', 'LMFP Prismatic', 'NMC 523 Cylindrical', 'LTO Pouch']
const OEM_MANUFACTURERS = ['Tata Motors', 'Mahindra EV', 'Ola Electric', 'Ather Energy', 'BYD India', 'MG Motor India', 'TVS iCube', 'Bajaj Chetak']
const SUPPLY_STATUS = ['Grade-A Certified', 'SOC Tested', 'In Transit', 'Warehouse Stored', 'Pending BIS', 'Awaiting Allocation']

const evBatteryRecords = [
  { id: 'EVB-0001', battery: 'NMC 811 Prismatic', description: '72kWh NCM811 prismatic cell pack IS 16046 certified for Nexon EV Max Long Range 500km ARAI with 8-year warranty', oem: 'Tata Motors', quantity: 2400, unit: 'packs', supply_status: 'Grade-A Certified', lot: 'LOT-EVB-9051', destination: 'Tata Sanand Plant Gujarat', received: '2026-07-30', batch: 'EVB-B2026-0730', cost_inr: 288000000, soc_pct: 98.2, cycle_life: 3500 },
  { id: 'EVB-0002', battery: 'LFP Cylindrical', description: '38.5kWh LFP cylindrical pack for XUV400 EV with blade cell architecture 4680 format CATL supply chain', oem: 'Mahindra EV', quantity: 3200, unit: 'packs', supply_status: 'SOC Tested', lot: 'LOT-EVB-9048', destination: 'Mahindra Nashik Plant MH', received: '2026-07-30', batch: 'EVB-B2026-0729', cost_inr: 176000000, soc_pct: 97.8, cycle_life: 5000 },
  { id: 'EVB-0003', battery: 'NCA Pouch', description: '3.5kWh NCA pouch module 21700 cells for S1 Pro Gen3 scooter swappable battery pack with 5000 cycle BMS', oem: 'Ola Electric', quantity: 18000, unit: 'modules', supply_status: 'In Transit', lot: 'LOT-EVB-9045', destination: 'Ola Futurefactory Tamil Nadu', received: '2026-07-29', batch: 'EVB-B2026-0728', cost_inr: 126000000, soc_pct: 99.1, cycle_life: 1500 },
  { id: 'EVB-0004', battery: 'Sodium-Ion', description: '30kWh sodium-ion prismatic pack for affordable 4W EV sub-4L segment ARAI certified emerging battery chemistry', oem: 'Ather Energy', quantity: 5000, unit: 'packs', supply_status: 'Warehouse Stored', lot: 'LOT-EVB-9042', destination: 'Ather Hosur Factory TN', received: '2026-07-29', batch: 'EVB-B2026-0727', cost_inr: 75000000, soc_pct: 96.5, cycle_life: 3000 },
  { id: 'EVB-0005', battery: 'Solid-State LFP', description: '50kWh solid-state LFP prototype pack for Atto 3 EV FAME III next-gen limited production batch 200 units', oem: 'BYD India', quantity: 200, unit: 'packs', supply_status: 'Pending BIS', lot: 'LOT-EVB-9039', destination: 'BYD Chennai Plant TN', received: '2026-07-28', batch: 'EVB-B2026-0726', cost_inr: 48000000, soc_pct: 99.5, cycle_life: 8000 },
  { id: 'EVB-0006', battery: 'LMFP Prismatic', description: '42kWh LMFP prismatic pack cost-optimized for ZS EV successor with manganese-enhanced LFP chemistry 400Wh/kg', oem: 'MG Motor India', quantity: 1800, unit: 'packs', supply_status: 'Grade-A Certified', lot: 'LOT-EVB-9036', destination: 'MG Halol Plant Gujarat', received: '2026-07-28', batch: 'EVB-B2026-0725', cost_inr: 108000000, soc_pct: 97.2, cycle_life: 4500 },
  { id: 'EVB-0007', battery: 'NMC 523 Cylindrical', description: '4.3kWh NMC523 cylindrical module 18650 format for iQube ST Gen2 scooter 100km range IoT-connected BMS', oem: 'TVS iCube', quantity: 12000, unit: 'modules', supply_status: 'Awaiting Allocation', lot: 'LOT-EVB-9033', destination: 'TVS Hosur Plant TN', received: '2026-07-27', batch: 'EVB-B2026-0724', cost_inr: 72000000, soc_pct: 98.0, cycle_life: 1800 },
  { id: 'EVB-0008', battery: 'LTO Pouch', description: '15kWh LTO pouch pack ultra-fast charging for Chetak Technology demonstrator bus rapid 10-min charge cycle', oem: 'Bajaj Chetak', quantity: 600, unit: 'packs', supply_status: 'SOC Tested', lot: 'LOT-EVB-9030', destination: 'Bajaj Akurdi Plant MH', received: '2026-07-27', batch: 'EVB-B2026-0723', cost_inr: 54000000, soc_pct: 99.8, cycle_life: 15000 },
  { id: 'EVB-0009', battery: 'NMC 811 Prismatic', description: '60.5kWh NCM811 high-nickel prismatic pack Safari EV Harrier successor with silicon-anode 720Wh/L energy density', oem: 'Tata Motors', quantity: 1500, unit: 'packs', supply_status: 'In Transit', lot: 'LOT-EVB-9027', destination: 'Tata Jamshedpur JH', received: '2026-07-26', batch: 'EVB-B2026-0722', cost_inr: 165000000, soc_pct: 97.5, cycle_life: 3200 },
  { id: 'EVB-0010', battery: 'LFP Cylindrical', description: '40kWh LFP blade cell pack for XUV300e compact SUV 450km range with V2L vehicle-to-load functionality', oem: 'Mahindra EV', quantity: 2800, unit: 'packs', supply_status: 'Grade-A Certified', lot: 'LOT-EVB-9024', destination: 'Mahindra Chakan Plant MH', received: '2026-07-26', batch: 'EVB-B2026-0721', cost_inr: 134400000, soc_pct: 98.5, cycle_life: 4800 },
  { id: 'EVB-0011', battery: 'NCA Pouch', description: '2.9kWh NCA pouch for S1 Air Gen3 budget scooter swappable with Battery-as-a-Service model Ola Hypercharger', oem: 'Ola Electric', quantity: 25000, unit: 'modules', supply_status: 'Warehouse Stored', lot: 'LOT-EVB-9021', destination: 'Ola Krbl Hub UP', received: '2026-07-25', batch: 'EVB-B2026-0720', cost_inr: 100000000, soc_pct: 99.3, cycle_life: 1400 },
  { id: 'EVB-0012', battery: 'Sodium-Ion', description: '25kWh sodium-ion for 450S flagship scooter Jio-bharat BaaS partnership 200K swap stations across India tier-2/3', oem: 'Ather Energy', quantity: 8000, unit: 'modules', supply_status: 'Pending BIS', lot: 'LOT-EVB-9018', destination: 'Ather Bangalore R&D KA', received: '2026-07-25', batch: 'EVB-B2026-0719', cost_inr: 64000000, soc_pct: 96.0, cycle_life: 2800 },
  { id: 'EVB-0013', battery: 'Solid-State LFP', description: '75kWh solid-state pack for Seal luxury EV import CKD assembly with sulfide electrolyte 600Wh/kg prototype', oem: 'BYD India', quantity: 100, unit: 'packs', supply_status: 'SOC Tested', lot: 'LOT-EVB-9015', destination: 'BYD Pune R&D MH', received: '2026-07-24', batch: 'EVB-B2026-0718', cost_inr: 35000000, soc_pct: 99.6, cycle_life: 7500 },
  { id: 'EVB-0014', battery: 'LMFP Prismatic', description: '35kWh LMFP for MG4 EV hatchback India launch 380km range cost leader under 15L on-road segment', oem: 'MG Motor India', quantity: 2200, unit: 'packs', supply_status: 'In Transit', lot: 'LOT-EVB-9012', destination: 'MG Vadodara Plant GJ', received: '2026-07-24', batch: 'EVB-B2026-0717', cost_inr: 92400000, soc_pct: 97.8, cycle_life: 4200 },
  { id: 'EVB-0015', battery: 'NMC 523 Cylindrical', description: '3.2kWh NMC523 21700 for Raider EV cruiser motorcycle 180km range high-performance BMS with regen optimization', oem: 'TVS iCube', quantity: 6000, unit: 'modules', supply_status: 'Grade-A Certified', lot: 'LOT-EVB-9009', destination: 'TVS Mysore Plant KA', received: '2026-07-23', batch: 'EVB-B2026-0716', cost_inr: 48000000, soc_pct: 98.3, cycle_life: 2000 },
  { id: 'EVB-0016', battery: 'LTO Pouch', description: '100kWh LTO pack for electric city bus BEST Mumbai 150-charge-cycle daily operation Tata Starbus partnership', oem: 'Bajaj Chetak', quantity: 150, unit: 'packs', supply_status: 'Awaiting Allocation', lot: 'LOT-EVB-9006', destination: 'BEST Depot Mumbai MH', received: '2026-07-23', batch: 'EVB-B2026-0715', cost_inr: 22500000, soc_pct: 99.9, cycle_life: 12000 },
  { id: 'EVB-0017', battery: 'NMC 811 Prismatic', description: '35kWh NCM811 for Punch EV compact hatchback 350km ARAI Tiago sibling architecture shared battery platform', oem: 'Tata Motors', quantity: 4800, unit: 'packs', supply_status: 'Warehouse Stored', lot: 'LOT-EVB-9003', destination: 'Tata Ranjangaon Plant MH', received: '2026-07-22', batch: 'EVB-B2026-0714', cost_inr: 168000000, soc_pct: 97.0, cycle_life: 3800 },
  { id: 'EVB-0018', battery: 'LFP Cylindrical', description: '50kWh LFP blade cell for Thar.e off-road EV with IP67 waterproofing 400mm wading depth military-grade sealing', oem: 'Mahindra EV', quantity: 800, unit: 'packs', supply_status: 'SOC Tested', lot: 'LOT-EVB-9050', destination: 'Mahindra Igatpuri MH', received: '2026-07-22', batch: 'EVB-B2026-0713', cost_inr: 56000000, soc_pct: 98.8, cycle_life: 5200 },
  { id: 'EVB-0019', battery: 'NCA Pouch', description: '5kWh NCA for Ola Cruiser autonomous ride-hailing robotaxi fleet Level-4 self-driving swappable pack 8000 units', oem: 'Ola Electric', quantity: 8000, unit: 'modules', supply_status: 'In Transit', lot: 'LOT-EVB-9047', destination: 'Ola BKC Hub Mumbai', received: '2026-07-21', batch: 'EVB-B2026-0712', cost_inr: 96000000, soc_pct: 99.2, cycle_life: 1600 },
  { id: 'EVB-0020', battery: 'Sodium-Ion', description: '8kWh sodium-ion 3W cargo EV for最后一mile delivery Zepto/Dunzo partnership 500K swap stations metro cities', oem: 'Ather Energy', quantity: 15000, unit: 'modules', supply_status: 'Grade-A Certified', lot: 'LOT-EVB-9044', destination: 'Ather Gurgaon Hub HR', received: '2026-07-21', batch: 'EVB-B2026-0711', cost_inr: 90000000, soc_pct: 96.8, cycle_life: 3200 },
]

const genRecords = (start: number) => {
  const statuses = ['Grade-A Certified', 'SOC Tested', 'In Transit', 'Warehouse Stored', 'Pending BIS', 'Awaiting Allocation']
  const destinations = ['Tata Sanand GJ', 'Mahindra Nashik MH', 'Ola Futurefactory TN', 'Ather Hosur TN', 'BYD Chennai TN', 'MG Halol GJ', 'TVS Hosur TN', 'Bajaj Akurdi MH', 'Tata Jamshedpur JH', 'Mahindra Chakan MH', 'Ola Krbl UP', 'Ather Bangalore KA']
  return Array.from({ length: 40 }, (_, i) => ({
    id: `EVB-${String(start + i).padStart(4, '0')}`,
    battery: BATTERY_TYPES[(start + i) % 8],
    description: `${BATTERY_TYPES[(start + i) % 8]} pack Lot ${String((start + i) % 99 + 1).padStart(3, '0')} for EV supply chain`,
    oem: OEM_MANUFACTURERS[(start + i) % 8],
    quantity: Math.round(100 + Math.random() * 25000),
    unit: (start + i) % 3 === 0 ? 'packs' : 'modules',
    supply_status: statuses[(start + i) % 6],
    lot: `LOT-EVB-${String(9021 + start + i)}`,
    destination: destinations[(start + i) % 12],
    received: `2026-07-${String(20 - Math.floor((start + i) / 10)).padStart(2, '0')}`,
    batch: `EVB-B2026-${String(710 - Math.floor((start + i) / 3)).padStart(4, '0')}`,
    cost_inr: Math.round(20000000 + Math.random() * 260000000),
    soc_pct: Math.round((95 + Math.random() * 5) * 10) / 10,
    cycle_life: Math.round(1000 + Math.random() * 14000),
  }))
}

const allEvBattery = [...evBatteryRecords, ...genRecords(21), ...genRecords(61)]

function ri(min: number, max: number, value: number) {
  return Math.max(min, Math.min(max, value))
}

const filterGroups = [
  {
    key: 'battery',
    label: 'Battery Type',
    options: BATTERY_TYPES.map(t => ({ label: t, value: t, count: allEvBattery.filter(r => r.battery === t).length })),
  },
  {
    key: 'oem',
    label: 'OEM Manufacturer',
    options: OEM_MANUFACTURERS.map(r => ({ label: r, value: r, count: allEvBattery.filter(rec => rec.oem === r).length })),
  },
  {
    key: 'supply_status',
    label: 'Supply Status',
    options: SUPPLY_STATUS.map(s => ({ label: s, value: s, count: allEvBattery.filter(r => r.supply_status === s).length })),
  },
]

function BatteryBadge({ battery }: { battery: string }) {
  const colors: Record<string, string> = { 'NMC 811 Prismatic': 'bg-indigo-100 text-indigo-800', 'LFP Cylindrical': 'bg-blue-100 text-blue-800', 'NCA Pouch': 'bg-violet-100 text-violet-800', 'Sodium-Ion': 'bg-amber-100 text-amber-800', 'Solid-State LFP': 'bg-emerald-100 text-emerald-800', 'LMFP Prismatic': 'bg-teal-100 text-teal-800', 'NMC 523 Cylindrical': 'bg-purple-100 text-purple-800', 'LTO Pouch': 'bg-rose-100 text-rose-800' }
  return <span className={`evb-battery-badge inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[battery] || 'bg-gray-100 text-gray-800'}`}>{battery}</span>
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = { 'Grade-A Certified': 'bg-green-100 text-green-800', 'SOC Tested': 'bg-blue-100 text-blue-800', 'In Transit': 'bg-indigo-100 text-indigo-800', 'Warehouse Stored': 'bg-slate-100 text-slate-800', 'Pending BIS': 'bg-yellow-100 text-yellow-800', 'Awaiting Allocation': 'bg-gray-200 text-gray-700' }
  return <span className={`evb-status-badge inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-700'}`}>{status}</span>
}

function CostBar({ cost }: { cost: number }) {
  const pct = ri(0, 100, (cost / 280000000) * 100)
  const color = cost >= 200000000 ? 'bg-indigo-600' : cost >= 100000000 ? 'bg-indigo-500' : cost >= 50000000 ? 'bg-indigo-400' : 'bg-indigo-300'
  return <div className="evb-cost-bar flex items-center gap-2"><div className="h-2 w-20 rounded-full bg-gray-200"><div className={`evb-cost-bar-fill h-2 rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} /></div><span className="text-xs text-gray-500">{'₹' + (cost / 10000000).toFixed(1) + 'Cr'}</span></div>
}

function HealthRing({ value, label, color }: { value: number; label: string; color: string }) {
  const r = 28, cx = 35, cy = 35, sw = 5
  const circ = 2 * Math.PI * r
  const offset = circ - (ri(0, 100, value) / 100) * circ
  return <div className="evb-health-ring flex flex-col items-center"><svg width={70} height={70} className="-rotate-90"><circle cx={cx} cy={cy} r={r} fill="none" stroke="#e5e7eb" strokeWidth={sw} /><circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={sw} strokeDasharray={circ} strokeDashoffset={offset} className="evb-ring-path" strokeLinecap="round" /></svg><span className="evb-ring-value mt-1 text-sm font-bold" style={{ color }}>{value}%</span><span className="text-xs text-gray-500">{label}</span></div>
}

function KpiTile({ title, value, sub }: { title: string; value: string; sub: string }) {
  return <Card className="evb-kpi-card"><CardContent className="p-4"><p className="text-xs text-gray-500">{title}</p><p className="evb-kpi-value mt-1 text-2xl font-bold">{value}</p><p className="text-xs text-gray-400 mt-0.5">{sub}</p></CardContent></Card>
}

function ValueTile({ title, value, trend }: { title: string; value: string; trend: string }) {
  const up = trend.startsWith('+')
  return <Card className="evb-value-tile"><CardContent className="p-4"><p className="text-xs text-gray-500">{title}</p><p className="mt-1 text-xl font-bold">{value}</p><p className={`text-xs mt-0.5 ${up ? 'text-green-600' : 'text-red-500'}`}>{trend}</p></CardContent></Card>
}

export default function EvBatterySupplyChainView() {
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

  const filtered = allEvBattery.filter(e => {
    const q = searchQuery.toLowerCase()
    if (q && !e.id.toLowerCase().includes(q) && !e.battery.toLowerCase().includes(q) && !e.description.toLowerCase().includes(q) && !e.oem.toLowerCase().includes(q) && !e.destination.toLowerCase().includes(q)) return false
    return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(e[key as keyof typeof e] as string))
  })

  const totalCost = allEvBattery.reduce((s, e) => s + e.cost_inr, 0)
  const totalUnits = allEvBattery.reduce((s, e) => s + e.quantity, 0)
  const gradeA = allEvBattery.filter(e => e.supply_status === 'Grade-A Certified').length
  const inTransit = allEvBattery.filter(e => e.supply_status === 'In Transit').length

  const monthlyData = [
    { month: 'Jan', units: 45000, value_cr: 125, avg_soc: 97.8 },
    { month: 'Feb', units: 68000, value_cr: 198, avg_soc: 97.5 },
    { month: 'Mar', units: 92000, value_cr: 285, avg_soc: 98.0 },
    { month: 'Apr', units: 55000, value_cr: 162, avg_soc: 97.2 },
    { month: 'May', units: 110000, value_cr: 345, avg_soc: 98.4 },
    { month: 'Jun', units: 32000, value_cr: 88, avg_soc: 97.0 },
    { month: 'Jul', units: 125000, value_cr: 398, avg_soc: 98.6 },
  ]
  const batteryData = BATTERY_TYPES.map(t => ({ battery: t.split(' ').slice(0, 2).join(' '), count: allEvBattery.filter(r => r.battery === t).reduce((s, r) => s + r.quantity, 0) }))
  const oemData = OEM_MANUFACTURERS.map(r => ({ oem: r, count: allEvBattery.filter(rec => rec.oem === r).reduce((s, rec) => s + rec.quantity, 0) }))

  const tabs = [
    { value: 'dashboard', label: 'Dashboard' },
    { value: 'inventory', label: 'Inventory' },
    { value: 'analytics', label: 'Analytics' },
    { value: 'insights', label: 'Insights' },
  ]

  return (
    <div className="evb-container space-y-4">
      <PageHeader title="EV Battery Supply Chain" description="End-to-end electric vehicle battery pack warehousing, state-of-charge testing, BIS certification tracking, and OEM allocation logistics covering NMC/LFP/NCA/sodium-ion/solid-state cell chemistries under FAME III and PM E-DRIVE scheme with Battery Waste Management Rules 2022 compliance, production-linked incentive (PLI) ACC gigafactory supply monitoring, and advanced battery management system analytics" />
      <ModuleBreadcrumb items={[{ label: 'Automotive' }, { label: 'EV Battery Supply' }]} />
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="evb-tabs-list">
          {tabs.map(t => <TabsTrigger key={t.value} value={t.value} className="evb-tab-trigger">{t.label}</TabsTrigger>)}
        </TabsList>

        <TabsContent value="dashboard" className="evb-tab-content space-y-4 mt-4">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <KpiTile title="Total Consignments" value={allEvBattery.length.toString()} sub="Battery lots" />
            <KpiTile title="Total Units" value={`${(totalUnits / 1000).toFixed(0)}K`} sub="Packs + modules" />
            <KpiTile title="Total Value" value={`₹${(totalCost / 10000000).toFixed(0)}Cr`} sub="Supply chain value" />
            <KpiTile title="In Transit" value={inTransit.toString()} sub={`${((inTransit / allEvBattery.length) * 100).toFixed(0)}% in pipeline`} />
          </div>
          <div className="grid gap-4 grid-cols-3 md:grid-cols-6">
            <HealthRing value={96} label="BIS Certified" color="#4338ca" />
            <HealthRing value={98} label="Avg SOC" color="#3730a3" />
            <HealthRing value={94} label="Grade-A Rate" color="#6366f1" />
            <HealthRing value={91} label="Cycle Life OK" color="#312e81" />
            <HealthRing value={97} label="Thermal Safe" color="#818cf8" />
            <HealthRing value={93} label="On-Time" color="#a5b4fc" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="evb-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Monthly Battery Units & Avg SOC %</CardTitle></CardHeader><CardContent><LineChart data={monthlyData} width={300} height={200}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" fontSize={12} /><YAxis fontSize={12} /><Tooltip /><Legend /><Line type="monotone" dataKey="units" stroke="#4338ca" strokeWidth={2} /><Line type="monotone" dataKey="avg_soc" stroke="#3730a3" strokeWidth={2} strokeDasharray="5 5" /></LineChart></CardContent></Card>
            <Card className="evb-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Battery Dispatch by Chemistry</CardTitle></CardHeader><CardContent><BarChart data={batteryData} width={300} height={200}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="battery" fontSize={10} angle={-30} textAnchor="end" height={50} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="count" fill="#4338ca" radius={[4,4,0,0]} /></BarChart></CardContent></Card>
            <Card className="evb-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">OEM Battery Distribution</CardTitle></CardHeader><CardContent><PieChart width={300} height={200}><Pie data={oemData} dataKey="count" nameKey="oem" cx="50%" cy="50%" outerRadius={70} label={({ oem, count }) => `${(count / 1000).toFixed(0)}K`}>{oemData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="inventory" className="evb-tab-content space-y-4 mt-4">
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={allEvBattery.length} filteredCount={filtered.length} onRefresh={() => {}} placeholder="Search by ID, battery type, OEM, destination, or lot..." />
          <div className="overflow-x-auto rounded-lg border">
            <table className="evb-table w-full text-sm">
              <thead><tr className="evb-table-header bg-gray-50"><th className="px-3 py-2 text-left font-medium">ID</th><th className="px-3 py-2 text-left font-medium">Battery</th><th className="px-3 py-2 text-left font-medium">Status</th><th className="px-3 py-2 text-left font-medium">Qty</th><th className="px-3 py-2 text-left font-medium">Value</th><th className="px-3 py-2 text-left font-medium">OEM</th><th className="px-3 py-2 text-left font-medium">Destination</th><th className="px-3 py-2 text-left font-medium">SOC%</th><th className="px-3 py-2 text-left font-medium">Cycles</th></tr></thead>
              <tbody>{filtered.slice(0, 20).map(e => (
                <tr key={e.id} className="evb-table-row border-t hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-2 font-mono text-xs">{e.id}</td>
                  <td className="px-3 py-2"><BatteryBadge battery={e.battery} /></td>
                  <td className="px-3 py-2"><StatusBadge status={e.supply_status} /></td>
                  <td className="px-3 py-2 text-xs">{(e.quantity / 1000).toFixed(1)}K</td>
                  <td className="px-3 py-2"><CostBar cost={e.cost_inr} /></td>
                  <td className="px-3 py-2 text-xs">{e.oem}</td>
                  <td className="px-3 py-2 text-xs">{e.destination}</td>
                  <td className="px-3 py-2 text-xs">{e.soc_pct}%</td>
                  <td className="px-3 py-2 text-xs">{e.cycle_life.toLocaleString()}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="evb-tab-content space-y-4 mt-4">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <ValueTile title="Avg SOC on Arrival" value="98.1%" trend="+0.4% improved" />
            <ValueTile title="Avg Cycle Life" value="4,200" trend="+320 vs FY25" />
            <ValueTile title="FAME III Units" value="185K" trend="+85% YoY growth" />
            <ValueTile title="PLI ACC Output" value="32GWh" trend="+140% capacity" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="evb-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Supply Chain Value by Chemistry</CardTitle></CardHeader><CardContent><BarChart data={BATTERY_TYPES.map(t => ({ battery: t.split(' ').slice(0, 2).join(' '), total: allEvBattery.filter(r => r.battery === t).reduce((s, r) => s + r.cost_inr, 0) / 10000000 }))} width={400} height={250}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="battery" fontSize={10} angle={-30} textAnchor="end" height={50} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="total" fill="#3730a3" radius={[4,4,0,0]} /></BarChart></CardContent></Card>
            <Card className="evb-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Supply Status Breakdown</CardTitle></CardHeader><CardContent><PieChart width={400} height={250}><Pie data={SUPPLY_STATUS.map(s => ({ status: s, count: allEvBattery.filter(e => e.supply_status === s).length }))} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={80} label>{SUPPLY_STATUS.map((_, i) => <Cell key={i} fill={['#22c55e','#3b82f6','#6366f1','#64748b','#eab308','#9ca3af'][i]} />)}</Pie><Tooltip /></PieChart></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="evb-tab-content space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="evb-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">FAME III & PM E-DRIVE EV Battery Subsidy Tracking</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Faster Adoption and Manufacturing of Electric Vehicles (FAME) III scheme and PM E-DRIVE replacing FAME II with {'₹'}12,500 crore outlay for EV battery demand incentive tracking. Real-time subsidy disbursement monitoring for 4.2 lakh EVs across 8 OEMs with battery chemistry-specific incentive rates. Integration with Ministry of Heavy Industries PLI-ACC (Advanced Chemistry Cell) scheme tracking 32GWh cumulative output from 4 operational gigafactories (Ola Cell, Reliance New Energy, Exide Leclanche, Amara Raja). Automated BIS IS 16046 and AIS 156 certification verification for all incoming battery packs with 30-day advance expiry alerts preventing non-compliant inventory acceptance. Phase-wise localization tracking achieving 60% domestic value addition in FY2026 targeting 80% by FY2028.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-indigo-100 px-2 py-0.5 text-indigo-800">Critical</span><span className="text-gray-400">Live</span></div></CardContent></Card>
            <Card className="evb-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">Battery Waste Management Rules 2022 Compliance Portal</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Battery Waste Management Rules 2022 (BWMR) compliance tracking for all EV battery pack producers, importers, and bulk consumers under CPCB registration. Extended Producer Responsibility (EPR) credit tracking for 8 registered producers with annual collection and recycling target monitoring. Digital manifest system (Form BWR-1 to BWR-6) tracking battery lifecycle from OEM factory to collection center to authorized recycler ensuring 100% chain-of-custody. Integration with Battery Pass India initiative for QR-based material passport containing chemistry, capacity, SOC, cycle count, and recycling instructions for every pack entering Indian market. Automated hazardous waste classification and handling compliance ensuring lithium, cobalt, and nickel-bearing waste meets SPCB hazardous waste storage and transportation requirements.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-blue-800">Regulatory</span><span className="text-gray-400">Q3 2026</span></div></CardContent></Card>
            <Card className="evb-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">PLI-ACC Gigafactory Supply Chain Visibility</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Production-Linked Incentive scheme for National Programme on Advanced Chemistry Cell (ACC) Battery Storage tracking 50GWh cumulative domestic manufacturing target by FY2030. Real-time supply chain monitoring for 4 operational and 6 under-construction gigafactories across Gujarat, Tamil Nadu, Andhra Pradesh, and Karnataka. Critical mineral dependency mapping for lithium (85% imported from China/Australia), cobalt (72% from DRC), and nickel (68% from Indonesia) with strategic reserve buffer tracking. Integration with mines ministry critical mineral exploration dashboard for Khanij Bidesh India Ltd (KABIL) overseas lithium and cobalt asset development in Argentina, Australia, and Chile. Container-level tracking from cathode precursor supplier to cell manufacturer to pack assembler with 72-hour lead time visibility and automated shortage alerts.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-violet-100 px-2 py-0.5 text-violet-800">Strategic</span><span className="text-gray-400">FY2028</span></div></CardContent></Card>
            <Card className="evb-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">AI-Powered BMS Analytics & Battery Health Prediction</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Machine learning-based Battery Management System (BMS) analytics processing 2.8 million data points daily from 185,000+ connected EV battery packs across India. Deep learning model predicting remaining useful life (RUL) with 96.5% accuracy at pack level enabling proactive warranty replacement scheduling 3 months before failure threshold. Real-time thermal runaway risk detection analyzing cell-level voltage, temperature, and impedance deviations with 15-minute early warning capability. Integration with cell manufacturer quality databases for batch-level defect correlation mapping identifying systematic degradation patterns in specific cell lots. Digital twin simulation for each battery chemistry type projecting capacity fade curves under Indian climate conditions (45C+ summer, 80%+ monsoon humidity) for accurate warranty cost provisioning and 2nd-life residual value assessment.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-purple-100 px-2 py-0.5 text-purple-800">Innovation</span><span className="text-gray-400">Pilot</span></div></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
