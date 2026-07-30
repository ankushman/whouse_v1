import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#0284c7', '#0369a1', '#0ea5e9', '#38bdf8', '#7dd3fc', '#075985', '#0c4a6e', '#f0f9ff']

const COMPONENT_TYPES = ['DRAM 16GB', 'NAND Flash 256GB', 'SoC ARM Cortex', 'GPU AI Accelerator', 'Power Management IC', 'Display Driver IC', 'MEMS Sensor', 'RF Module 5G']
const OEMS = ['Tata Electronics Bengaluru', 'Vedanta Foxconn Semicon Gujarat', 'Micron India Hyderabad', 'SPEL Semiconductor Chennai', 'SCL ISRO Chandigarh', 'CG Power Mumbai', 'L&T Semiconductor Pune', 'Texas Instruments Bengaluru']
const MOVE_STATUS = ['ESD Certified', 'AOI Passed', 'In Transit ESD', 'Clean Room Stored', 'Pending BIS CRIS', 'Awaiting SMT Line']

const seeRecords = [
  { id: 'SEE-0001', component: 'DRAM 16GB', description: 'DDR5 16GB SDRAM modules for Tata Electronics OSAT packaging Dhirubhai Ambani Semiconductor Valley clean room Class 1000 IS 13224 compliant', oem: 'Tata Electronics Bengaluru', quantity: 15000, unit: 'units', move_status: 'ESD Certified', lot: 'LOT-SEE-9001', destination: 'Bengaluru KA', received: '2026-07-30', batch: 'SEE-B2026-0730', cost_inr: 225000000, weight_mt: 4.2, esd_class: 'Class1' },
  { id: 'SEE-0002', component: 'NAND Flash 256GB', description: 'TLC 256GB NAND flash wafers 3D V-NAND for Vedanta Foxconn Dholera SEMICON India fab ESD Class 1 handling with nitrogen purge', oem: 'Vedanta Foxconn Semicon Gujarat', quantity: 8000, unit: 'wafers', move_status: 'AOI Passed', lot: 'LOT-SEE-9002', destination: 'Dholera GJ', received: '2026-07-30', batch: 'SEE-B2026-0730', cost_inr: 384000000, weight_mt: 1.8, esd_class: 'Class1' },
  { id: 'SEE-0003', component: 'SoC ARM Cortex', description: 'ARM Cortex-A78 AE SoC die for L&T Semiconductor Pune defence electronics RISC-V co-processor IS 15428 qualified', oem: 'L&T Semiconductor Pune', quantity: 25000, unit: 'units', move_status: 'In Transit ESD', lot: 'LOT-SEE-9003', destination: 'Pune MH', received: '2026-07-29', batch: 'SEE-B2026-0729', cost_inr: 312500000, weight_mt: 2.5, esd_class: 'Class1' },
  { id: 'SEE-0004', component: 'GPU AI Accelerator', description: 'AI inference accelerator GPU 400TOPS for Micron India Hyderabad HBM3e memory subsystem AI data center GPU cluster deployment', oem: 'Micron India Hyderabad', quantity: 3000, unit: 'boards', move_status: 'Clean Room Stored', lot: 'LOT-SEE-9004', destination: 'Hyderabad TG', received: '2026-07-29', batch: 'SEE-B2026-0729', cost_inr: 540000000, weight_mt: 6.0, esd_class: 'Class1' },
  { id: 'SEE-0005', component: 'Power Management IC', description: 'PMIC BMS chip for SPEL Semiconductor Chennai ATMP OSAT line automotive AEC-Q100 Grade 0 qualified wafer probe', oem: 'SPEL Semiconductor Chennai', quantity: 50000, unit: 'units', move_status: 'Pending BIS CRIS', lot: 'LOT-SEE-9005', destination: 'Chennai TN', received: '2026-07-28', batch: 'SEE-B2026-0728', cost_inr: 150000000, weight_mt: 1.2, esd_class: 'Class2' },
  { id: 'SEE-0006', component: 'Display Driver IC', description: 'TDDI display driver IC for SCL ISRO Chandigarh space-grade LCD panel satellite display controller radiation hardened', oem: 'SCL ISRO Chandigarh', quantity: 12000, unit: 'units', move_status: 'Awaiting SMT Line', lot: 'LOT-SEE-9006', destination: 'Chandigarh PB', received: '2026-07-28', batch: 'SEE-B2026-0728', cost_inr: 96000000, weight_mt: 0.8, esd_class: 'Class2' },
  { id: 'SEE-0007', component: 'MEMS Sensor', description: 'MEMS accelerometer gyroscope IMU for CG Power Mumbai industrial IoT sensor module BIS CRS IS 16556 certified', oem: 'CG Power Mumbai', quantity: 80000, unit: 'units', move_status: 'ESD Certified', lot: 'LOT-SEE-9007', destination: 'Mumbai MH', received: '2026-07-27', batch: 'SEE-B2026-0727', cost_inr: 120000000, weight_mt: 3.2, esd_class: 'Class3' },
  { id: 'SEE-0008', component: 'RF Module 5G', description: '5G NR mmWave RF front-end module for Texas Instruments Bengaluru telecom infra sub-6GHz and mmWave dual band', oem: 'Texas Instruments Bengaluru', quantity: 18000, unit: 'boards', move_status: 'AOI Passed', lot: 'LOT-SEE-9008', destination: 'Bengaluru KA', received: '2026-07-27', batch: 'SEE-B2026-0727', cost_inr: 270000000, weight_mt: 5.4, esd_class: 'Class1' },
  { id: 'SEE-0009', component: 'DRAM 16GB', description: 'LPDDR5X 16GB mobile DRAM for smartphone SMT line Foxconn Sri City ASE certified JESD22-A114 ESD test', oem: 'Vedanta Foxconn Semicon Gujarat', quantity: 60000, unit: 'units', move_status: 'In Transit ESD', lot: 'LOT-SEE-9009', destination: 'Sri City AP', received: '2026-07-26', batch: 'SEE-B2026-0726', cost_inr: 180000000, weight_mt: 7.8, esd_class: 'Class1' },
  { id: 'SEE-0010', component: 'NAND Flash 256GB', description: 'QLC 256GB UFS 4.0 embedded storage for Tata Electronics consumer electronics division NAND controller with ECC', oem: 'Tata Electronics Bengaluru', quantity: 35000, unit: 'units', move_status: 'Clean Room Stored', lot: 'LOT-SEE-9010', destination: 'Noida UP', received: '2026-07-26', batch: 'SEE-B2026-0726', cost_inr: 245000000, weight_mt: 4.6, esd_class: 'Class2' },
  { id: 'SEE-0011', component: 'SoC ARM Cortex', description: 'ARM Cortex-M55 MCU for Micron India embedded memory SoC wafer-level chip-scale package WLCSP 0.4mm pitch', oem: 'Micron India Hyderabad', quantity: 100000, unit: 'units', move_status: 'ESD Certified', lot: 'LOT-SEE-9011', destination: 'Hyderabad TG', received: '2026-07-25', batch: 'SEE-B2026-0725', cost_inr: 200000000, weight_mt: 5.0, esd_class: 'Class2' },
  { id: 'SEE-0012', component: 'GPU AI Accelerator', description: 'Edge AI accelerator NPU 50TOPS for L&T Semiconductor defence AI radar signal processing card PCIe Gen5', oem: 'L&T Semiconductor Pune', quantity: 5000, unit: 'boards', move_status: 'Pending BIS CRIS', lot: 'LOT-SEE-9012', destination: 'Pune MH', received: '2026-07-25', batch: 'SEE-B2026-0725', cost_inr: 350000000, weight_mt: 8.5, esd_class: 'Class1' },
  { id: 'SEE-0013', component: 'Power Management IC', description: 'GaN FET driver IC for SPEL Semiconductor EV powertrain inverter SiC MOSFET gate driver 1200V automotive', oem: 'SPEL Semiconductor Chennai', quantity: 40000, unit: 'units', move_status: 'Awaiting SMT Line', lot: 'LOT-SEE-9013', destination: 'Chennai TN', received: '2026-07-24', batch: 'SEE-B2026-0724', cost_inr: 280000000, weight_mt: 2.0, esd_class: 'Class1' },
  { id: 'SEE-0014', component: 'Display Driver IC', description: 'OLED DDI IC for SCL ISRO AMOLED panel avionics display MIL-STD-883 qualified space-grade radiation tolerant', oem: 'SCL ISRO Chandigarh', quantity: 8000, unit: 'units', move_status: 'AOI Passed', lot: 'LOT-SEE-9014', destination: 'Ahmedabad GJ', received: '2026-07-24', batch: 'SEE-B2026-0724', cost_inr: 184000000, weight_mt: 0.6, esd_class: 'Class1' },
  { id: 'SEE-0015', component: 'MEMS Sensor', description: 'Pressure sensor die for CG Power Mumbai automotive MAP sensor BIS CRS registration ECE R10 EMC compliance', oem: 'CG Power Mumbai', quantity: 120000, unit: 'units', move_status: 'In Transit ESD', lot: 'LOT-SEE-9015', destination: 'Nagpur MH', received: '2026-07-23', batch: 'SEE-B2026-0723', cost_inr: 96000000, weight_mt: 4.8, esd_class: 'Class3' },
  { id: 'SEE-0016', component: 'RF Module 5G', description: '5G sub-6GHz RF transceiver module for Texas Instruments Bengaluru base station massive MIMO antenna array module', oem: 'Texas Instruments Bengaluru', quantity: 10000, unit: 'boards', move_status: 'ESD Certified', lot: 'LOT-SEE-9016', destination: 'Bengaluru KA', received: '2026-07-23', batch: 'SEE-B2026-0723', cost_inr: 430000000, weight_mt: 12.0, esd_class: 'Class1' },
  { id: 'SEE-0017', component: 'DRAM 16GB', description: 'DDR5 16GB RDIMM server memory for Micron India cloud data center HBM3 memory module thermal management', oem: 'Micron India Hyderabad', quantity: 20000, unit: 'units', move_status: 'Clean Room Stored', lot: 'LOT-SEE-9017', destination: 'Gurugram HR', received: '2026-07-22', batch: 'SEE-B2026-0722', cost_inr: 300000000, weight_mt: 6.4, esd_class: 'Class1' },
  { id: 'SEE-0018', component: 'NAND Flash 256GB', description: '3D NAND 256GB SSD controller chip for Tata Electronics enterprise storage NAND flash management firmware', oem: 'Tata Electronics Bengaluru', quantity: 45000, unit: 'units', move_status: 'AOI Passed', lot: 'LOT-SEE-9018', destination: 'Bengaluru KA', received: '2026-07-22', batch: 'SEE-B2026-0722', cost_inr: 270000000, weight_mt: 5.8, esd_class: 'Class2' },
  { id: 'SEE-0019', component: 'SoC ARM Cortex', description: 'ARM Cortex-R52 real-time SoC for L&T Semiconductor industrial PLC safety controller IEC 61508 SIL-3', oem: 'L&T Semiconductor Pune', quantity: 30000, unit: 'units', move_status: 'Pending BIS CRIS', lot: 'LOT-SEE-9019', destination: 'Aurangabad MH', received: '2026-07-21', batch: 'SEE-B2026-0721', cost_inr: 165000000, weight_mt: 3.0, esd_class: 'Class2' },
  { id: 'SEE-0020', component: 'GPU AI Accelerator', description: 'AI training accelerator 800TOPS for Vedanta Foxconn Gujarat AI supercomputer HPC cluster liquid cooling GPU', oem: 'Vedanta Foxconn Semicon Gujarat', quantity: 2000, unit: 'boards', move_status: 'Awaiting SMT Line', lot: 'LOT-SEE-9020', destination: 'Dholera GJ', received: '2026-07-21', batch: 'SEE-B2026-0721', cost_inr: 480000000, weight_mt: 15.0, esd_class: 'Class1' },
]

const genRecords = (start: number) => {
  const statuses = ['ESD Certified', 'AOI Passed', 'In Transit ESD', 'Clean Room Stored', 'Pending BIS CRIS', 'Awaiting SMT Line']
  const destinations = ['Bengaluru KA', 'Dholera GJ', 'Hyderabad TG', 'Chennai TN', 'Chandigarh PB', 'Mumbai MH', 'Pune MH', 'Noida UP', 'Sri City AP', 'Gurugram HR', 'Nagpur MH', 'Ahmedabad GJ']
  return Array.from({ length: 40 }, (_, i) => ({
    id: `SEE-${String(start + i).padStart(4, '0')}`,
    component: COMPONENT_TYPES[(start + i) % 8],
    description: `${COMPONENT_TYPES[(start + i) % 8]} Lot ${String((start + i) % 99 + 1).padStart(3, '0')} for semiconductor supply chain India`,
    oem: OEMS[(start + i) % 8],
    quantity: Math.round(500 + Math.random() * 95000),
    unit: (start + i) % 3 === 0 ? 'wafers' : (start + i) % 3 === 1 ? 'boards' : 'units',
    move_status: statuses[(start + i) % 6],
    lot: `LOT-SEE-${String(9001 + start + i)}`,
    destination: destinations[(start + i) % 12],
    received: `2026-07-${String(20 - Math.floor((start + i) / 10)).padStart(2, '0')}`,
    batch: `SEE-B2026-${String(710 - Math.floor((start + i) / 3)).padStart(4, '0')}`,
    cost_inr: Math.round(30000000 + Math.random() * 470000000),
    weight_mt: Math.round((0.5 + Math.random() * 14.5) * 10) / 10,
    esd_class: ['Class1', 'Class2', 'Class3'][(start + i) % 3],
  }))
}

const allRecords = [...seeRecords, ...genRecords(21), ...genRecords(61)]

function ri(label: string, value: number, color: string) {
  return { label, value: Math.min(Math.max(value, 0), 100), color }
}

const filterGroups = [
  {
    key: 'component',
    label: 'Component Type',
    options: COMPONENT_TYPES.map(t => ({ label: t, value: t, count: allRecords.filter(r => r.component === t).length })),
  },
  {
    key: 'oem',
    label: 'OEM Foundry',
    options: OEMS.map(o => ({ label: o, value: o, count: allRecords.filter(r => r.oem === o).length })),
  },
  {
    key: 'move_status',
    label: 'Move Status',
    options: MOVE_STATUS.map(s => ({ label: s, value: s, count: allRecords.filter(r => r.move_status === s).length })),
  },
  {
    key: 'esd_class',
    label: 'ESD Class',
    options: ['Class1', 'Class2', 'Class3'].map(e => ({ label: e, value: e, count: allRecords.filter(r => r.esd_class === e).length })),
  },
]

function ComponentBadge({ component }: { component: string }) {
  const colors: Record<string, string> = { 'DRAM 16GB': 'bg-sky-100 text-sky-800', 'NAND Flash 256GB': 'bg-blue-100 text-blue-800', 'SoC ARM Cortex': 'bg-cyan-100 text-cyan-800', 'GPU AI Accelerator': 'bg-indigo-100 text-indigo-800', 'Power Management IC': 'bg-teal-100 text-teal-800', 'Display Driver IC': 'bg-violet-100 text-violet-800', 'MEMS Sensor': 'bg-amber-100 text-amber-800', 'RF Module 5G': 'bg-rose-100 text-rose-800' }
  return <span className={`see-component-badge inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[component] || 'bg-gray-100 text-gray-800'}`}>{component}</span>
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = { 'ESD Certified': 'bg-green-100 text-green-800', 'AOI Passed': 'bg-blue-100 text-blue-800', 'In Transit ESD': 'bg-indigo-100 text-indigo-800', 'Clean Room Stored': 'bg-slate-100 text-slate-800', 'Pending BIS CRIS': 'bg-yellow-100 text-yellow-800', 'Awaiting SMT Line': 'bg-gray-200 text-gray-700' }
  return <span className={`see-status-badge inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-700'}`}>{status}</span>
}

function CostBar({ cost }: { cost: number }) {
  const pct = Math.min(100, Math.max(0, (cost / 500000000) * 100))
  const color = cost >= 400000000 ? 'bg-sky-600' : cost >= 200000000 ? 'bg-sky-500' : cost >= 100000000 ? 'bg-sky-400' : 'bg-sky-300'
  return <div className="see-cost-bar flex items-center gap-2"><div className="h-2 w-20 rounded-full bg-gray-200"><div className={`see-cost-bar-fill h-2 rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} /></div><span className="text-xs text-gray-500">{'\u20B9'}{(cost / 10000000).toFixed(1)}Cr</span></div>
}

function HealthRing({ value, label, color }: { value: number; label: string; color: string }) {
  const r = 28, cx = 35, cy = 35, sw = 5
  const circ = 2 * Math.PI * r
  const offset = circ - (Math.min(100, Math.max(0, value)) / 100) * circ
  return <div className="see-health-ring flex flex-col items-center"><svg width={70} height={70} className="-rotate-90"><circle cx={cx} cy={cy} r={r} fill="none" stroke="#e5e7eb" strokeWidth={sw} /><circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={sw} strokeDasharray={circ} strokeDashoffset={offset} className="see-ring-path" strokeLinecap="round" /></svg><span className="see-ring-value mt-1 text-sm font-bold" style={{ color }}>{value}%</span><span className="text-xs text-gray-500">{label}</span></div>
}

function KpiTile({ title, value, sub }: { title: string; value: string; sub: string }) {
  return <Card className="see-kpi-card"><CardContent className="p-4"><p className="text-xs text-gray-500">{title}</p><p className="see-kpi-value mt-1 text-2xl font-bold">{value}</p><p className="text-xs text-gray-400 mt-0.5">{sub}</p></CardContent></Card>
}

function ValueTile({ title, value, trend }: { title: string; value: string; trend: string }) {
  const up = trend.startsWith('+')
  return <Card className="see-value-tile"><CardContent className="p-4"><p className="text-xs text-gray-500">{title}</p><p className="mt-1 text-xl font-bold">{value}</p><p className={`text-xs mt-0.5 ${up ? 'text-green-600' : 'text-red-500'}`}>{trend}</p></CardContent></Card>
}

export default function SemiconductorElectronicsView() {
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

  const filtered = allRecords.filter(e => {
    const q = searchQuery.toLowerCase()
    if (q && !e.id.toLowerCase().includes(q) && !e.component.toLowerCase().includes(q) && !e.description.toLowerCase().includes(q) && !e.oem.toLowerCase().includes(q) && !e.destination.toLowerCase().includes(q)) return false
    return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(e[key as keyof typeof e] as string))
  })

  const totalCost = allRecords.reduce((s, e) => s + e.cost_inr, 0)
  const totalQty = allRecords.reduce((s, e) => s + e.quantity, 0)
  const esdCert = allRecords.filter(e => e.move_status === 'ESD Certified').length
  const inTransit = allRecords.filter(e => e.move_status === 'In Transit ESD').length
  const cleanRoom = allRecords.filter(e => e.move_status === 'Clean Room Stored').length
  const pendingBIS = allRecords.filter(e => e.move_status === 'Pending BIS CRIS').length

  const lineData = [
    { month: 'Jan', units: 85000, value_cr: 245 },
    { month: 'Feb', units: 120000, value_cr: 378 },
    { month: 'Mar', units: 95000, value_cr: 298 },
    { month: 'Apr', units: 150000, value_cr: 462 },
    { month: 'May', units: 180000, value_cr: 556 },
    { month: 'Jun', units: 72000, value_cr: 224 },
    { month: 'Jul', units: 210000, value_cr: 648 },
  ]
  const barData = COMPONENT_TYPES.map(t => ({ name: t.split(' ').slice(0, 2).join(' '), count: allRecords.filter(r => r.component === t).reduce((s, r) => s + r.quantity, 0) }))
  const pieData = OEMS.map(o => ({ name: o.split(' ').slice(0, 2).join(' '), value: allRecords.filter(r => r.oem === o).reduce((s, r) => s + r.cost_inr, 0) }))

  const tabs = [
    { value: 'dashboard', label: 'Dashboard' },
    { value: 'inventory', label: 'Inventory' },
    { value: 'analytics', label: 'Analytics' },
    { value: 'insights', label: 'Insights' },
  ]

  return (
    <div className="see-container space-y-4">
      <PageHeader title="Semiconductor & Electronics Supply Chain" description="End-to-end semiconductor component warehousing, ESD-safe handling, BIS CRS certification tracking, and ATMP ecosystem logistics covering DRAM NAND SoC GPU PMIC DDI MEMS RF modules for India Semiconductor Mission PLI scheme, clean room storage, AOI inspection, and SMT line feed management across Tata Electronics Vedanta Foxconn Micron SPEL SCL CG Power L&T Semiconductor and Texas Instruments India fabs" />
      <ModuleBreadcrumb items={[{ label: 'Electronics' }, { label: 'Semiconductor Supply' }]} />
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="see-tabs-list">
          {tabs.map(t => <TabsTrigger key={t.value} value={t.value} className="see-tab-trigger">{t.label}</TabsTrigger>)}
        </TabsList>

        <TabsContent value="dashboard" className="see-tab-content space-y-4 mt-4">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <KpiTile title="Total Consignments" value={allRecords.length.toString()} sub="Semiconductor lots" />
            <KpiTile title="Total Units" value={`${(totalQty / 1000).toFixed(0)}K`} sub="Components" />
            <KpiTile title="Total Value" value={`{'\u20B9'}${(totalCost / 10000000).toFixed(0)}Cr`} sub="Supply chain value" />
            <KpiTile title="In Transit" value={inTransit.toString()} sub={`${((inTransit / allRecords.length) * 100).toFixed(0)}% in pipeline`} />
          </div>
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <ValueTile title="ESD Compliance" value="96.2%" trend="+2.1% vs Q1" />
            <ValueTile title="AOI Yield" value="94.8%" trend="+1.5% improved" />
            <ValueTile title="Avg Lead Time" value="4.2 days" trend="-0.8 days faster" />
            <ValueTile title="Clean Room Util" value="87%" trend="+5% capacity" />
          </div>
          <div className="grid gap-4 grid-cols-3 md:grid-cols-6">
            <HealthRing {...ri('ESD Compliant', 96, '#0284c7')} />
            <HealthRing {...ri('AOI Pass Rate', 94, '#0369a1')} />
            <HealthRing {...ri('Clean Room', 91, '#0ea5e9')} />
            <HealthRing {...ri('Yield Rate', 93, '#38bdf8')} />
            <HealthRing {...ri('On-Time', 97, '#075985')} />
            <HealthRing {...ri('BIS Ready', 89, '#0c4a6e')} />
          </div>
          <Card><CardContent className="flex flex-wrap items-center gap-3 p-4"><ComponentBadge component="DRAM 16GB" /><ComponentBadge component="NAND Flash 256GB" /><StatusBadge status="ESD Certified" /><CostBar cost={allRecords[0].cost_inr} /></CardContent></Card>
        </TabsContent>

        <TabsContent value="inventory" className="see-tab-content space-y-4 mt-4">
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={allRecords.length} filteredCount={filtered.length} onRefresh={() => {}}
            placeholder="Search by ID, component, OEM, destination, or lot..." />
          <div className="overflow-x-auto rounded-lg border">
            <table className="see-table w-full text-sm">
              <thead><tr className="see-table-header bg-gray-50"><th className="px-3 py-2 text-left font-medium">ID</th><th className="px-3 py-2 text-left font-medium">Component</th><th className="px-3 py-2 text-left font-medium">Status</th><th className="px-3 py-2 text-left font-medium">Qty</th><th className="px-3 py-2 text-left font-medium">Value</th><th className="px-3 py-2 text-left font-medium">OEM</th><th className="px-3 py-2 text-left font-medium">Dest</th><th className="px-3 py-2 text-left font-medium">ESD</th><th className="px-3 py-2 text-left font-medium">Wt</th></tr></thead>
              <tbody>{filtered.slice(0, 20).map(r => (
                <tr key={r.id} className="see-table-row border-t hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-2 font-mono text-xs">{r.id}</td>
                  <td className="px-3 py-2"><ComponentBadge component={r.component} /></td>
                  <td className="px-3 py-2"><StatusBadge status={r.move_status} /></td>
                  <td className="px-3 py-2 text-xs">{r.quantity.toLocaleString()}</td>
                  <td className="px-3 py-2"><CostBar cost={r.cost_inr} /></td>
                  <td className="px-3 py-2 text-xs">{r.oem}</td>
                  <td className="px-3 py-2 text-xs">{r.destination}</td>
                  <td className="px-3 py-2 text-xs">{r.esd_class}</td>
                  <td className="px-3 py-2 text-xs">{r.weight_mt}t</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="see-tab-content space-y-4 mt-4">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <ValueTile title="Avg Cost/Unit" value="{'\u20B9'}4,280" trend="-12% vs Q1" />
            <ValueTile title="ESD Class 1 %" value="72%" trend="+8% improved" />
            <ValueTile title="ISM PLI Allocated" value="{'\u20B9'}18,400Cr" trend="+24% FY26" />
            <ValueTile title="ATMP Capacity" value="45MK" trend="+65% expansion" />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="see-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Monthly Component Shipments</CardTitle></CardHeader>
              <CardContent><LineChart data={lineData} width={300} height={200}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" fontSize={12} /><YAxis fontSize={12} /><Tooltip /><Legend /><Line type="monotone" dataKey="units" stroke="#0284c7" strokeWidth={2} /></LineChart></CardContent></Card>
            <Card className="see-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Component Quantity by Type</CardTitle></CardHeader>
              <CardContent><BarChart data={barData} width={300} height={200}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={10} angle={-30} textAnchor="end" height={50} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="count" fill="#0369a1" radius={[4,4,0,0]} /></BarChart></CardContent></Card>
            <Card className="see-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">OEM Value Distribution</CardTitle></CardHeader>
              <CardContent><PieChart width={300} height={200}><Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={({ name, value }) => `{'\u20B9'}${(value / 10000000).toFixed(0)}Cr`}>{pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="see-tab-content space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="see-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">India Semiconductor Mission (ISM) {'\u20B9'}76,000 crore PLI Scheme for Fab Ecosystem</CardTitle></CardHeader>
              <CardContent className="text-xs text-gray-600 space-y-2"><p>India Semiconductor Mission {'\u20B9'}76,000 crore PLI scheme driving fab ecosystem development across Gujarat Dholera and Maharashtra Noida-Chennai corridors. Tata Electronics OSAT facility in Bengaluru and Vedanta Foxconn joint venture fab in Dholera represent {'\u20B9'}1.26 lakh crore cumulative investment approved under ISM. Production-Linked Incentive for semiconductors covering display fabs with 50% capital expenditure subsidy for silicon CMOS fabs and 30% for display fabs. Real-time tracking of PLI milestone disbursements linked to production output volumes wafer starts per month and domestic value addition percentages. Integration with Ministry of Electronics and IT SAG dashboard for quarterly performance review of 5 approved fab projects targeting 28nm to 65nm process nodes by 2027.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-sky-100 px-2 py-0.5 text-sky-800">Critical</span><span className="text-gray-400">Live</span></div></CardContent></Card>
            <Card className="see-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">BIS CRS Registration for Electronics Components and ESD Compliance</CardTitle></CardHeader>
              <CardContent className="text-xs text-gray-600 space-y-2"><p>Bureau of Indian Standards Compulsory Registration Scheme (CRS) mandates IS 13252-1 for IT equipment and IS 17017 for audio/video electronics with mandatory BIS CRS marking before customs clearance at Indian ports. ESD compliance per ANSI/ESD S20.20 and IEC 61340-5-1 standards enforced across all semiconductor warehouses with Class 1 (0-1999V), Class 2 (2000-3999V), and Class 3 (4000V+) ESD sensitivity classifications. Automated BIS CRS certificate expiry tracking with 90-day advance renewal alerts preventing non-compliant component acceptance. Real-time ESD event monitoring across 47 ionization bars and 312 wrist strap stations with deviation alerting and corrective action workflow. Integration with Customs EDI system for automatic CRS validation during import bill of entry processing at Nhava Sheva Chennai and Kolkata ports.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-blue-800">Regulatory</span><span className="text-gray-400">Q3 2026</span></div></CardContent></Card>
            <Card className="see-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">SPEL SCL Fab Capacity Expansion and ATMP Ecosystem in Noida-Chennai</CardTitle></CardHeader>
              <CardContent className="text-xs text-gray-600 space-y-2"><p>SPEL Semiconductor Chennai ATMP (Assembly Test Mark and Pack) capacity expansion from 2.5 billion units to 8 billion units annually under ISM PLI scheme with advanced packaging including flip-chip and SiP capabilities. SCL ISRO Chandigarh semiconductor laboratory upgrading from 180nm to 90nm CMOS process node for strategic defence and space applications with technology transfer from indigenous development. ATMP ecosystem corridor development connecting Noida UP (Tata OSAT) Chennai TN (SPEL FabCity) and Bengaluru KA (Dixon CG Power) with shared supplier networks for lead frames substrates and moulding compounds. Automated WIP tracking between fab and ATMP facilities with lot-level traceability and 48-hour cross-facility transfer time monitoring. Integration with state semiconductor policies of UP Tamil Nadu Karnataka and Gujarat for land allocation power subsidy and water entitlement tracking.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-cyan-100 px-2 py-0.5 text-cyan-800">Strategic</span><span className="text-gray-400">FY2028</span></div></CardContent></Card>
            <Card className="see-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">AI-Powered Defect Analytics for AOI Inspection and Yield Optimization</CardTitle></CardHeader>
              <CardContent className="text-xs text-gray-600 space-y-2"><p>Machine learning-based Automated Optical Inspection (AOI) defect analytics processing 4.2 million wafer images daily across Tata Electronics and Micron India ATMP lines with 99.7% defect detection accuracy. Deep learning CNN model classifying 47 defect types including particle contamination pattern misalignment die crack and solder bridging with sub-micron resolution capability. Real-time yield prediction engine correlating AOI defect density with upstream process parameters enabling predictive process adjustment 15 minutes before yield deviation. Digital twin of semiconductor production line simulating defect propagation and optimizing inspection sampling plans reducing inspection time by 35% while maintaining zero customer escapes. Integration with Statistical Process Control dashboards for Cpk monitoring across 128 critical process parameters with automated OCAP triggering per JEDEC and SEMI standards.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-indigo-100 px-2 py-0.5 text-indigo-800">Innovation</span><span className="text-gray-400">Pilot</span></div></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
