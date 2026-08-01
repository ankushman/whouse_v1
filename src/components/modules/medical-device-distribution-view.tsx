import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#059669', '#047857', '#10b981', '#34d399', '#6ee7b7', '#065f46', '#064e3b', '#d1fae5']

const DEVICE_TYPES = ['MRI 3.0T Scanner', 'CT 256-Slice', 'Ultrasound Console', 'X-Ray Digital', 'Patient Monitor ICU', 'Ventilator ICU', 'Surgical Robot Da Vinci', 'Dialysis Machine']
const OEM_MANUFACTURERS = ['GE Healthcare India', 'Siemens Healthineers', 'Philips Healthcare', 'Wipro GE', 'Trivitron Chennai', 'BPL Medical', 'Opto Circuits Bengaluru', 'Transas Vascular']
const DISTRIBUTION_STATUS = ['CDSCO Registered', 'Calibrated', 'In Transit', 'Warehouse Stored', 'Pending BIS', 'Awaiting Installation']

const medDeviceRecords = [
  { id: 'MDD-0001', device: 'MRI 3.0T Scanner', description: 'GE SIGNA Premier 3.0T wide-bore MRI scanner CDSCO registered under MD-30 for AIIMS New Delhi radio-diagnosis department ultra-high field imaging', oem: 'GE Healthcare India', quantity: 2, unit: 'systems', dist_status: 'CDSCO Registered', lot: 'LOT-MDD-9051', destination: 'AIIMS New Delhi', received: '2026-07-30', batch: 'MDD-B2026-0730', cost_inr: 320000000, warranty_yrs: 5, regulatory: 'CDSCO MD-30' },
  { id: 'MDD-0002', device: 'CT 256-Slice', description: 'Siemens SOMATOM X.cite 256-slice CT scanner dual-source photon-counting detector for Apollo Hospitals Chennai advanced cardiac CT angiography', oem: 'Siemens Healthineers', quantity: 3, unit: 'systems', dist_status: 'Calibrated', lot: 'LOT-MDD-9048', destination: 'Apollo Hospitals Chennai', received: '2026-07-30', batch: 'MDD-B2026-0729', cost_inr: 405000000, warranty_yrs: 7, regulatory: 'CDSCO MD-22' },
  { id: 'MDD-0003', device: 'Ultrasound Console', description: 'Philips Affiniti 70 CVx ultrasound console with strain imaging and 3D/4D obstetric cardiology for district hospitals Madhya Pradesh NHM', oem: 'Philips Healthcare', quantity: 15, unit: 'systems', dist_status: 'In Transit', lot: 'LOT-MDD-9045', destination: 'MP District Hospitals', received: '2026-07-29', batch: 'MDD-B2026-0728', cost_inr: 135000000, warranty_yrs: 3, regulatory: 'CDSCO MD-21' },
  { id: 'MDD-0004', device: 'X-Ray Digital', description: 'Wipro GE Brivo DR-F digital radiography system ceiling-mounted wireless DR panel for Fortis Hospitals Bengaluru orthopedic trauma centre', oem: 'Wipro GE', quantity: 8, unit: 'systems', dist_status: 'Warehouse Stored', lot: 'LOT-MDD-9042', destination: 'Fortis Hospitals Bengaluru', received: '2026-07-29', batch: 'MDD-B2026-0727', cost_inr: 96000000, warranty_yrs: 5, regulatory: 'BIS IS 13252' },
  { id: 'MDD-0005', device: 'Patient Monitor ICU', description: 'Trivitron Trident X12 12-inch bedside patient monitor with SpO2 ECG NIBP EtCO2 temp cardiac output for 500-bed hospital ICU JIPMER Puducherry', oem: 'Trivitron Chennai', quantity: 120, unit: 'monitors', dist_status: 'CDSCO Registered', lot: 'LOT-MDD-9039', destination: 'JIPMER Puducherry', received: '2026-07-28', batch: 'MDD-B2026-0726', cost_inr: 144000000, warranty_yrs: 2, regulatory: 'CDSCO MD-26' },
  { id: 'MDD-0006', device: 'Ventilator ICU', description: 'BPL Medical MVS-6100 transport and ICU ventilator with PSV PCV SIMV modes for COVID preparedness 200-bed ward Medanta Gurugram', oem: 'BPL Medical', quantity: 60, unit: 'units', dist_status: 'Calibrated', lot: 'LOT-MDD-9036', destination: 'Medanta Gurugram', received: '2026-07-28', batch: 'MDD-B2026-0725', cost_inr: 180000000, warranty_yrs: 2, regulatory: 'BIS IS 17950' },
  { id: 'MDD-0007', device: 'Surgical Robot Da Vinci', description: 'Intuitive Surgical Da Vinci Xi 4-arm surgical robotic system for Apollo Proton Cancer Centre Chennai minimally invasive oncology surgery', oem: 'Opto Circuits Bengaluru', quantity: 1, unit: 'system', dist_status: 'Pending BIS', lot: 'LOT-MDD-9033', destination: 'Apollo Proton Chennai', received: '2026-07-27', batch: 'MDD-B2026-0724', cost_inr: 650000000, warranty_yrs: 4, regulatory: 'CDSCO MD-35' },
  { id: 'MDD-0008', device: 'Dialysis Machine', description: 'Baxter AK 98 next-generation hemodialysis machine with online HDF for AIIMS dialysis ward 40-station renal replacement therapy unit', oem: 'Transas Vascular', quantity: 40, unit: 'machines', dist_status: 'Awaiting Installation', lot: 'LOT-MDD-9030', destination: 'AIIMS Dialysis Delhi', received: '2026-07-27', batch: 'MDD-B2026-0723', cost_inr: 120000000, warranty_yrs: 3, regulatory: 'CDSCO MD-24' },
  { id: 'MDD-0009', device: 'MRI 3.0T Scanner', description: 'Siemens MAGNETOM Vida 3.0T 70cm open bore MRI with BioMatrix technology for Nanavati Super Speciality Hospital Mumbai neuro-imaging suite', oem: 'Siemens Healthineers', quantity: 1, unit: 'system', dist_status: 'Calibrated', lot: 'LOT-MDD-9027', destination: 'Nanavati Hospital Mumbai', received: '2026-07-26', batch: 'MDD-B2026-0722', cost_inr: 175000000, warranty_yrs: 6, regulatory: 'CDSCO MD-30' },
  { id: 'MDD-0010', device: 'CT 256-Slice', description: 'Philips Incisive CT 512-slice AI-powered CT scanner for early lung cancer screening program Kerala State Health Department 8 district centres', oem: 'Philips Healthcare', quantity: 8, unit: 'systems', dist_status: 'In Transit', lot: 'LOT-MDD-9024', destination: 'Kerala District Centres', received: '2026-07-26', batch: 'MDD-B2026-0721', cost_inr: 640000000, warranty_yrs: 5, regulatory: 'CDSCO MD-22' },
  { id: 'MDD-0011', device: 'Ultrasound Console', description: 'GE Voluson E10 MTC ultrasound with HDlive rendering for high-risk obstetrics scanning at CMC Vellore maternal fetal medicine department', oem: 'GE Healthcare India', quantity: 6, unit: 'systems', dist_status: 'CDSCO Registered', lot: 'LOT-MDD-9021', destination: 'CMC Vellore', received: '2026-07-25', batch: 'MDD-B2026-0720', cost_inr: 72000000, warranty_yrs: 4, regulatory: 'CDSCO MD-21' },
  { id: 'MDD-0012', device: 'X-Ray Digital', description: 'Trivitron Zenith DR-F portable digital X-ray for PHC (Primary Health Centres) tuberculosis screening program Bihar 500 health sub-centres', oem: 'Trivitron Chennai', quantity: 500, unit: 'systems', dist_status: 'Warehouse Stored', lot: 'LOT-MDD-9018', destination: 'Bihar PHC Network', received: '2026-07-25', batch: 'MDD-B2026-0719', cost_inr: 250000000, warranty_yrs: 3, regulatory: 'BIS IS 13252' },
  { id: 'MDD-0013', device: 'Patient Monitor ICU', description: 'Philips IntelliVue MX800 bedside patient monitor central station 32-bed ICU connectivity for Manipal Hospitals Bengaluru critical care wing', oem: 'Philips Healthcare', quantity: 32, unit: 'monitors', dist_status: 'Calibrated', lot: 'LOT-MDD-9015', destination: 'Manipal Hospitals BLR', received: '2026-07-24', batch: 'MDD-B2026-0718', cost_inr: 96000000, warranty_yrs: 2, regulatory: 'CDSCO MD-26' },
  { id: 'MDD-0014', device: 'Ventilator ICU', description: 'Maquet Servo-u premium ICU ventilator with NAVA and NAVA technology for Kokilaben Dhirubhai Ambani Hospital 80-bed neuro-ICU Mumbai', oem: 'Wipro GE', quantity: 80, unit: 'units', dist_status: 'In Transit', lot: 'LOT-MDD-9012', destination: 'Kokilaben Hospital Mumbai', received: '2026-07-24', batch: 'MDD-B2026-0717', cost_inr: 400000000, warranty_yrs: 3, regulatory: 'BIS IS 17950' },
  { id: 'MDD-0015', device: 'Surgical Robot Da Vinci', description: 'Transas Vascular AETHER 2 robotic-assisted vascular intervention system for Escorts Heart Institute Delhi cath lab robotic PCI procedures', oem: 'Transas Vascular', quantity: 1, unit: 'system', dist_status: 'Pending BIS', lot: 'LOT-MDD-9009', destination: 'Escorts Heart Delhi', received: '2026-07-23', batch: 'MDD-B2026-0716', cost_inr: 420000000, warranty_yrs: 5, regulatory: 'CDSCO MD-35' },
  { id: 'MDD-0016', device: 'Dialysis Machine', description: 'Fresenius 5008S CorDiax next-gen dialysis with auto-effluent drain for Tata Memorial Hospital Mumbai 100-bed dialysis unit oncology support', oem: 'BPL Medical', quantity: 100, unit: 'machines', dist_status: 'CDSCO Registered', lot: 'LOT-MDD-9006', destination: 'Tata Memorial Mumbai', received: '2026-07-23', batch: 'MDD-B2026-0715', cost_inr: 300000000, warranty_yrs: 3, regulatory: 'CDSCO MD-24' },
  { id: 'MDD-0017', device: 'MRI 3.0T Scanner', description: 'Canon Vantage Galan 3.0T MRI with Pianissimo Zen silent scanning for Max Super Speciality Hospital Saket Delhi orthopedic and sports medicine imaging', oem: 'Opto Circuits Bengaluru', quantity: 1, unit: 'system', dist_status: 'Calibrated', lot: 'LOT-MDD-9003', destination: 'Max Hospital Saket Delhi', received: '2026-07-22', batch: 'MDD-B2026-0714', cost_inr: 165000000, warranty_yrs: 5, regulatory: 'CDSCO MD-30' },
  { id: 'MDD-0018', device: 'CT 256-Slice', description: 'GE Revolution Apex CT 256-slice with AI-powered auto-gating cardiac scan for Manipal Hospitals Jaipur 6-slice cardiac CT angiography suite', oem: 'GE Healthcare India', quantity: 2, unit: 'systems', dist_status: 'Warehouse Stored', lot: 'LOT-MDD-9050', destination: 'Manipal Jaipur', received: '2026-07-22', batch: 'MDD-B2026-0713', cost_inr: 220000000, warranty_yrs: 6, regulatory: 'CDSCO MD-22' },
  { id: 'MDD-0019', device: 'Ultrasound Console', description: 'Trivitron Elegra Ultimate point-of-care ultrasound for ASHA workers rural screening UP National Health Mission 200 PHCs maternal health', oem: 'Trivitron Chennai', quantity: 200, unit: 'systems', dist_status: 'In Transit', lot: 'LOT-MDD-9047', destination: 'UP PHC ASHA Network', received: '2026-07-21', batch: 'MDD-B2026-0712', cost_inr: 100000000, warranty_yrs: 2, regulatory: 'CDSCO MD-21' },
  { id: 'MDD-0020', device: 'X-Ray Digital', description: 'Siemens Ysio Max DR ceiling-suspended digital radiography for Christian Medical College Ludhiana 4-department radiology upgrade project', oem: 'Siemens Healthineers', quantity: 4, unit: 'systems', dist_status: 'CDSCO Registered', lot: 'LOT-MDD-9044', destination: 'CMC Ludhiana', received: '2026-07-21', batch: 'MDD-B2026-0711', cost_inr: 52000000, warranty_yrs: 5, regulatory: 'BIS IS 13252' },
]

const genRecords = (start: number) => {
  const statuses = ['CDSCO Registered', 'Calibrated', 'In Transit', 'Warehouse Stored', 'Pending BIS', 'Awaiting Installation']
  const destinations = ['AIIMS New Delhi', 'Apollo Chennai', 'Fortis BLR', 'Medanta Gurugram', 'JIPMER Puducherry', 'Kokilaben Mumbai', 'CMC Vellore', 'Max Hospital Delhi', 'Tata Memorial Mumbai', 'Nanavati Mumbai', 'Escorts Heart Delhi', 'Manipal Jaipur']
  return Array.from({ length: 40 }, (_, i) => ({
    id: `MDD-${String(start + i).padStart(4, '0')}`,
    device: DEVICE_TYPES[(start + i) % 8],
    description: `${DEVICE_TYPES[(start + i) % 8]} Lot ${String((start + i) % 99 + 1).padStart(3, '0')} medical device consignment`,
    oem: OEM_MANUFACTURERS[(start + i) % 8],
    quantity: Math.round(1 + Math.random() * 500),
    unit: 'units',
    dist_status: statuses[(start + i) % 6],
    lot: `LOT-MDD-${String(9021 + start + i)}`,
    destination: destinations[(start + i) % 12],
    received: `2026-07-${String(20 - Math.floor((start + i) / 10)).padStart(2, '0')}`,
    batch: `MDD-B2026-${String(710 - Math.floor((start + i) / 3)).padStart(4, '0')}`,
    cost_inr: Math.round(5000000 + Math.random() * 650000000),
    warranty_yrs: Math.round(2 + Math.random() * 6),
    regulatory: ['CDSCO MD-30', 'CDSCO MD-22', 'CDSCO MD-21', 'BIS IS 13252', 'CDSCO MD-26', 'BIS IS 17950', 'CDSCO MD-35', 'CDSCO MD-24'][(start + i) % 8],
  }))
}

const allMedDevice = [...medDeviceRecords, ...genRecords(21), ...genRecords(61)]

function ri(min: number, max: number, value: number) {
  return Math.max(min, Math.min(max, value))
}

const filterGroups = [
  {
    key: 'device',
    label: 'Device Type',
    options: DEVICE_TYPES.map(t => ({ label: t, value: t, count: allMedDevice.filter(r => r.device === t).length })),
  },
  {
    key: 'oem',
    label: 'OEM Manufacturer',
    options: OEM_MANUFACTURERS.map(o => ({ label: o, value: o, count: allMedDevice.filter(r => r.oem === o).length })),
  },
  {
    key: 'dist_status',
    label: 'Distribution Status',
    options: DISTRIBUTION_STATUS.map(s => ({ label: s, value: s, count: allMedDevice.filter(r => r.dist_status === s).length })),
  },
]

function DeviceBadge({ device }: { device: string }) {
  const colors: Record<string, string> = { 'MRI 3.0T Scanner': 'bg-emerald-100 text-emerald-800', 'CT 256-Slice': 'bg-green-100 text-green-800', 'Ultrasound Console': 'bg-teal-100 text-teal-800', 'X-Ray Digital': 'bg-lime-100 text-lime-800', 'Patient Monitor ICU': 'bg-cyan-100 text-cyan-800', 'Ventilator ICU': 'bg-rose-100 text-rose-800', 'Surgical Robot Da Vinci': 'bg-violet-100 text-violet-800', 'Dialysis Machine': 'bg-amber-100 text-amber-800' }
  return <span className={`mdd-device-badge inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[device] || 'bg-gray-100 text-gray-800'}`}>{device}</span>
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = { 'CDSCO Registered': 'bg-green-100 text-green-800', 'Calibrated': 'bg-blue-100 text-blue-800', 'In Transit': 'bg-emerald-100 text-emerald-800', 'Warehouse Stored': 'bg-slate-100 text-slate-800', 'Pending BIS': 'bg-yellow-100 text-yellow-800', 'Awaiting Installation': 'bg-gray-200 text-gray-700' }
  return <span className={`mdd-status-badge inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-700'}`}>{status}</span>
}

function CostBar({ cost }: { cost: number }) {
  const pct = ri(0, 100, (cost / 700000000) * 100)
  const color = cost >= 400000000 ? 'bg-emerald-600' : cost >= 150000000 ? 'bg-emerald-500' : cost >= 50000000 ? 'bg-emerald-400' : 'bg-emerald-300'
  return <div className="mdd-cost-bar flex items-center gap-2"><div className="h-2 w-20 rounded-full bg-gray-200"><div className={`mdd-cost-bar-fill h-2 rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} /></div><span className="text-xs text-gray-500">{'₹' + (cost / 10000000).toFixed(1) + 'Cr'}</span></div>
}

function HealthRing({ value, label, color }: { value: number; label: string; color: string }) {
  const r = 28, cx = 35, cy = 35, sw = 5
  const circ = 2 * Math.PI * r
  const offset = circ - (ri(0, 100, value) / 100) * circ
  return <div className="mdd-health-ring flex flex-col items-center"><svg width={70} height={70} className="-rotate-90"><circle cx={cx} cy={cy} r={r} fill="none" stroke="#e5e7eb" strokeWidth={sw} /><circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={sw} strokeDasharray={circ} strokeDashoffset={offset} className="mdd-ring-path" strokeLinecap="round" /></svg><span className="mdd-ring-value mt-1 text-sm font-bold" style={{ color }}>{value}%</span><span className="text-xs text-gray-500">{label}</span></div>
}

function KpiTile({ title, value, sub }: { title: string; value: string; sub: string }) {
  return <Card className="mdd-kpi-card"><CardContent className="p-4"><p className="text-xs text-gray-500">{title}</p><p className="mdd-kpi-value mt-1 text-2xl font-bold">{value}</p><p className="text-xs text-gray-400 mt-0.5">{sub}</p></CardContent></Card>
}

function ValueTile({ title, value, trend }: { title: string; value: string; trend: string }) {
  const up = trend.startsWith('+')
  return <Card className="mdd-value-tile"><CardContent className="p-4"><p className="text-xs text-gray-500">{title}</p><p className="mt-1 text-xl font-bold">{value}</p><p className={`text-xs mt-0.5 ${up ? 'text-green-600' : 'text-red-500'}`}>{trend}</p></CardContent></Card>
}

export default function MedicalDeviceDistributionView() {
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

  const filtered = allMedDevice.filter(e => {
    const q = searchQuery.toLowerCase()
    if (q && !e.id.toLowerCase().includes(q) && !e.device.toLowerCase().includes(q) && !e.description.toLowerCase().includes(q) && !e.oem.toLowerCase().includes(q) && !e.destination.toLowerCase().includes(q)) return false
    return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(e[key as keyof typeof e] as string))
  })

  const totalCost = allMedDevice.reduce((s, e) => s + e.cost_inr, 0)
  const cdscRegistered = allMedDevice.filter(e => e.dist_status === 'CDSCO Registered').length
  const inTransit = allMedDevice.filter(e => e.dist_status === 'In Transit').length
  const totalUnits = allMedDevice.reduce((s, e) => s + e.quantity, 0)

  const monthlyData = [
    { month: 'Jan', units: 450, value_cr: 120, installs: 28 },
    { month: 'Feb', units: 680, value_cr: 185, installs: 42 },
    { month: 'Mar', units: 920, value_cr: 265, installs: 58 },
    { month: 'Apr', units: 380, value_cr: 95, installs: 22 },
    { month: 'May', units: 1100, value_cr: 325, installs: 72 },
    { month: 'Jun', units: 250, value_cr: 68, installs: 15 },
    { month: 'Jul', units: 1250, value_cr: 398, installs: 82 },
  ]
  const deviceData = DEVICE_TYPES.map(t => ({ device: t.split(' ').slice(0, 2).join(' '), count: allMedDevice.filter(r => r.device === t).reduce((s, r) => s + r.quantity, 0) }))
  const oemData = OEM_MANUFACTURERS.map(o => ({ oem: o.split(' ').slice(-2).join(' '), count: allMedDevice.filter(r => r.oem === o).reduce((s, r) => s + r.quantity, 0) }))

  const tabs = [
    { value: 'dashboard', label: 'Dashboard' },
    { value: 'inventory', label: 'Inventory' },
    { value: 'analytics', label: 'Analytics' },
    { value: 'insights', label: 'Insights' },
  ]

  return (
    <div className="mdd-container space-y-4">
      <PageHeader title="Medical Device Distribution" description="End-to-end medical device warehousing, CDSCO (Central Drugs Standard Control Organisation) registration tracking, BIS certification, calibration management, and hospital installation logistics for diagnostic imaging (MRI/CT/X-ray/Ultrasound), patient monitoring, ICU ventilators, surgical robotics, and dialysis machines under Medical Device Rules 2017, Ayushman Bharat HWC (Health and Wellness Centre) equipment provisioning, and National Health Mission facility augmentation" />
      <ModuleBreadcrumb items={[{ label: 'Healthcare' }, { label: 'Medical Devices' }]} />
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mdd-tabs-list">
          {tabs.map(t => <TabsTrigger key={t.value} value={t.value} className="mdd-tab-trigger">{t.label}</TabsTrigger>)}
        </TabsList>

        <TabsContent value="dashboard" className="mdd-tab-content space-y-4 mt-4">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <KpiTile title="Total Consignments" value={allMedDevice.length.toString()} sub="Medical device lots" />
            <KpiTile title="Total Units" value={totalUnits.toLocaleString()} sub="Devices and systems" />
            <KpiTile title="Total Value" value={`₹${(totalCost / 10000000).toFixed(0)}Cr`} sub="Healthcare equipment value" />
            <KpiTile title="Installations" value="82" sub="Completed this month" />
          </div>
          <div className="grid gap-4 grid-cols-3 md:grid-cols-6">
            <HealthRing value={98} label="CDSCO Compliant" color="#059669" />
            <HealthRing value={96} label="Calibrated" color="#047857" />
            <HealthRing value={94} label="BIS Certified" color="#10b981" />
            <HealthRing value={97} label="Delivery SLA" color="#065f46" />
            <HealthRing value={93} label="Installation OK" color="#34d399" />
            <HealthRing value={95} label="Warranty Active" color="#6ee7b7" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="mdd-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Monthly Units & Installations</CardTitle></CardHeader><CardContent><LineChart data={monthlyData} width={300} height={200}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" fontSize={12} /><YAxis fontSize={12} /><Tooltip /><Legend /><Line type="monotone" dataKey="units" stroke="#059669" strokeWidth={2} /><Line type="monotone" dataKey="installs" stroke="#047857" strokeWidth={2} strokeDasharray="5 5" /></LineChart></CardContent></Card>
            <Card className="mdd-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Distribution by Device Type</CardTitle></CardHeader><CardContent><BarChart data={deviceData} width={300} height={200}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="device" fontSize={10} angle={-30} textAnchor="end" height={50} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="count" fill="#059669" radius={[4,4,0,0]} /></BarChart></CardContent></Card>
            <Card className="mdd-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">OEM Manufacturer Distribution</CardTitle></CardHeader><CardContent><PieChart width={300} height={200}><Pie data={oemData} dataKey="count" nameKey="oem" cx="50%" cy="50%" outerRadius={70} label={({ oem, count }) => `${count}`}>{oemData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="inventory" className="mdd-tab-content space-y-4 mt-4">
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={allMedDevice.length} filteredCount={filtered.length} onRefresh={() => {}} placeholder="Search by ID, device, OEM, destination, or lot..." />
          <div className="overflow-x-auto rounded-lg border">
            <table className="mdd-table w-full text-sm">
              <thead><tr className="mdd-table-header bg-gray-50"><th className="px-3 py-2 text-left font-medium">ID</th><th className="px-3 py-2 text-left font-medium">Device</th><th className="px-3 py-2 text-left font-medium">Status</th><th className="px-3 py-2 text-left font-medium">Qty</th><th className="px-3 py-2 text-left font-medium">Value</th><th className="px-3 py-2 text-left font-medium">OEM</th><th className="px-3 py-2 text-left font-medium">Destination</th><th className="px-3 py-2 text-left font-medium">Reg</th><th className="px-3 py-2 text-left font-medium">Wty</th></tr></thead>
              <tbody>{filtered.slice(0, 20).map(e => (
                <tr key={e.id} className="mdd-table-row border-t hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-2 font-mono text-xs">{e.id}</td>
                  <td className="px-3 py-2"><DeviceBadge device={e.device} /></td>
                  <td className="px-3 py-2"><StatusBadge status={e.dist_status} /></td>
                  <td className="px-3 py-2 text-xs">{e.quantity}</td>
                  <td className="px-3 py-2"><CostBar cost={e.cost_inr} /></td>
                  <td className="px-3 py-2 text-xs">{e.oem}</td>
                  <td className="px-3 py-2 text-xs">{e.destination}</td>
                  <td className="px-3 py-2 text-xs font-mono">{e.regulatory.split(' ').slice(-1)[0]}</td>
                  <td className="px-3 py-2 text-xs">{e.warranty_yrs}yr</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="mdd-tab-content space-y-4 mt-4">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <ValueTile title="Avg Install Time" value="6.2 days" trend="-18% faster" />
            <ValueTile title="CDSCO Reg Rate" value="99.3%" trend="+1.2% compliant" />
            <ValueTile title="Ayushman Deployed" value="12,400" trend="+45% HWC units" />
            <ValueTile title="PMSSY Coverage" value="78%" trend="+12% institutions" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="mdd-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Value by Device Category</CardTitle></CardHeader><CardContent><BarChart data={DEVICE_TYPES.map(t => ({ device: t.split(' ').slice(0, 2).join(' '), total: allMedDevice.filter(r => r.device === t).reduce((s, r) => s + r.cost_inr, 0) / 10000000 }))} width={400} height={250}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="device" fontSize={10} angle={-30} textAnchor="end" height={50} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="total" fill="#047857" radius={[4,4,0,0]} /></BarChart></CardContent></Card>
            <Card className="mdd-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Distribution Status Breakdown</CardTitle></CardHeader><CardContent><PieChart width={400} height={250}><Pie data={DISTRIBUTION_STATUS.map(s => ({ status: s, count: allMedDevice.filter(e => e.dist_status === s).length }))} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={80} label>{DISTRIBUTION_STATUS.map((_, i) => <Cell key={i} fill={['#22c55e','#3b82f6','#10b981','#64748b','#eab308','#9ca3af'][i]} />)}</Pie><Tooltip /></PieChart></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="mdd-tab-content space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="mdd-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">CDSCO Medical Device Rules 2017 Digital Compliance</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Central Drugs Standard Control Organisation (CDSCO) Medical Device Rules 2017 compliance tracking for 4,800+ medical device manufacturers and importers across India. Real-time online SUGAM portal integration for MD registration (Form MD-1 to MD-42), license renewal, and import license management with 180-day advance expiry alerts. Automated Indian Medical Device Registry (MDR) data submission for Class A to Class D medical devices with risk classification-based audit scheduling and quality management system compliance tracking. Integration with Bureau of Indian Standards (BIS) for mandatory IS marking on notified medical devices including X-ray (IS 13252), patient monitors (IS/IEC 60601), and surgical robots (IEC 60601-1-6). Post-market surveillance data management capturing adverse event reports, field safety corrective actions, and device recall coordination across 36 state FDA offices.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-800">Critical</span><span className="text-gray-400">Live</span></div></CardContent></Card>
            <Card className="mdd-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">Ayushman Bharat PMJAY Equipment & HWC Provisioning</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Pradhan Mantri Jan Arogya Yojana (PMJAY) and Ayushman Bharat Health and Wellness Centre (HWC) medical equipment provisioning tracking for 1.5 lakh HWCs and 700+ empaneled hospitals across 33 states and UTs. Real-time equipment deployment monitoring against AB-HWC essential equipment list (42 items including BP monitor, glucometer, weighing scale, tablet, thermal printer) with district-wise coverage gap analysis and procurement prioritization. Integration with National Health Authority (NHA) PMJAY claim data analytics correlating equipment availability at empaneled hospitals with procedure-level claim volumes and denial rates. Automated service level agreement monitoring for 4 OEMs under 5-year comprehensive Annual Maintenance Contract (AMC) ensuring 4-hour response time and 95% uptime SLA compliance. Predictive equipment replacement scheduling based on utilization analytics and depreciation curves enabling budgetary provisioning for Ayushman Bharat 2.0 expansion.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-green-800">National Mission</span><span className="text-gray-400">FY2026</span></div></CardContent></Card>
            <Card className="mdd-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">PMSSY & AIIMS Medical Equipment Standardization</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Pradhan Mantri Swasthya Suraksha Yojana (PMSSY) AIIMS and new AIIMS-like institution medical equipment procurement tracking covering 23 AIIMS institutions and 60+ super-speciality hospitals under PMSSY phases I-VI. Digital tender management integrating GeM (Government e-Marketplace) procurement workflows with technical evaluation committee scoring, price bid analysis, and L1 vendor recommendation automation. Equipment standardization framework implementing Indian Council of Medical Research (ICMR) recommended specifications for 250+ medical device categories ensuring interoperability and vendor-agnostic procurement. Integration with hospital information systems (HIS) for real-time equipment utilization tracking across 23 AIIMS providing utilization efficiency metrics, idle time analysis, and capacity planning for procurement optimization.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-teal-100 px-2 py-0.5 text-teal-800">Strategic</span><span className="text-gray-400">Q4 2026</span></div></CardContent></Card>
            <Card className="mdd-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">AI-Powered Predictive Maintenance & Uptime Analytics</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Machine learning-based predictive maintenance platform processing 8.5 million daily data points from 42,000+ connected medical devices across 850 hospitals in India. Deep learning model predicting equipment failure 72 hours in advance with 94.2% accuracy for critical devices (MRI gradient coil degradation, CT X-ray tube wear, ventilator flow sensor drift) enabling proactive service dispatch before patient impact. Digital twin simulation for each installed MRI and CT scanner modeling thermal behavior, coil aging curves, and usage patterns for accurate remaining useful life estimation and optimal replacement timing. Integration with 8 OEM service networks (GE, Siemens, Philips, Trivitron, BPL) for automated spare parts demand forecasting and technician scheduling reducing mean time to repair (MTTR) from 48 hours to 12 hours. IoT-enabled remote diagnostics enabling 85% of first-level troubleshooting without site visit reducing service cost per device by 32%.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-lime-100 px-2 py-0.5 text-lime-800">Innovation</span><span className="text-gray-400">Pilot</span></div></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
