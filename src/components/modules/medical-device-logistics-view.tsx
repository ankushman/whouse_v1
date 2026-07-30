import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#dc2626', '#b91c1c', '#ef4444', '#f87171', '#fca5a5', '#991b1b', '#7f1d1d', '#fee2e2']

const DEVICE_TYPES = ['Surgical Instruments', 'Diagnostic Imaging', 'Implants & Prosthetics', 'IVD Kits', 'Patient Monitors', 'Ventilators', 'Sterilization Units', 'Lab Equipment']
const MANUFACTURERS = ['TransAsia Biomedicals', 'Trivitron Healthcare', 'BPL Medical', 'Philips India', 'GE Healthcare India', 'Siemens Healthineers', 'Polymed', 'Narang Medical']
const REGULATION_STATUS = ['CDSCO Approved', 'FDA 510(k)', 'CE Marked', 'Under Review', 'Recalled', 'Pending Certification']

const devices = [
  { id: 'MDL-0001', device: 'Surgical Instruments', description: 'Titanium Orthopedic Screw Set 4.5mm', manufacturer: 'Polymed', quantity: 200, unit: 'sets', regulation: 'CDSCO Approved', hospital: 'AIIMS Delhi', po: 'PO-MD-28451', received: '2026-07-30', batch: 'MD-B2026-0721', cost_inr: 3200000, expiry: '2029-07-30', udi: 'UDI-IN-2026-001234' },
  { id: 'MDL-0002', device: 'Diagnostic Imaging', description: 'Portable X-Ray 100mA HF Unit', manufacturer: 'BPL Medical', quantity: 5, unit: 'units', regulation: 'CE Marked', hospital: 'Apollo Chennai', po: 'PO-MD-28452', received: '2026-07-30', batch: 'MD-B2026-0722', cost_inr: 8750000, expiry: '2031-07-30', udi: 'UDI-IN-2026-001235' },
  { id: 'MDL-0003', device: 'Implants & Prosthetics', description: 'Cobalt-Chrome Hip Stem Size 3', manufacturer: 'Narang Medical', quantity: 50, unit: 'pcs', regulation: 'CDSCO Approved', hospital: 'Fortis Gurgaon', po: 'PO-MD-28453', received: '2026-07-29', batch: 'MD-B2026-0719', cost_inr: 4500000, expiry: 'N/A', udi: 'UDI-IN-2026-001236' },
  { id: 'MDL-0004', device: 'IVD Kits', description: 'HbA1c ELISA Test Kit 100 Tests', manufacturer: 'TransAsia Biomedicals', quantity: 1000, unit: 'kits', regulation: 'CDSCO Approved', hospital: 'Manipal Bangalore', po: 'PO-MD-28454', received: '2026-07-29', batch: 'MD-B2026-0718', cost_inr: 2500000, expiry: '2027-01-29', udi: 'UDI-IN-2026-001237' },
  { id: 'MDL-0005', device: 'Patient Monitors', description: 'Multipara Monitor 12.1" Touch SpO2', manufacturer: 'Philips India', quantity: 25, unit: 'units', regulation: 'FDA 510(k)', hospital: 'Medanta Lucknow', po: 'PO-MD-28455', received: '2026-07-28', batch: 'MD-B2026-0716', cost_inr: 6250000, expiry: '2031-07-28', udi: 'UDI-IN-2026-001238' },
  { id: 'MDL-0006', device: 'Ventilators', description: 'ICU Ventilator invasive+non-invasive', manufacturer: 'Trivitron Healthcare', quantity: 12, unit: 'units', regulation: 'CDSCO Approved', hospital: 'Kokilaben Mumbai', po: 'PO-MD-28456', received: '2026-07-28', batch: 'MD-B2026-0715', cost_inr: 5400000, expiry: '2030-07-28', udi: 'UDI-IN-2026-001239' },
  { id: 'MDL-0007', device: 'Sterilization Units', description: 'Autoclave Class B 23L 134C', manufacturer: 'GE Healthcare India', quantity: 30, unit: 'units', regulation: 'CE Marked', hospital: 'Max Super Specialty', po: 'PO-MD-28457', received: '2026-07-27', batch: 'MD-B2026-0714', cost_inr: 2100000, expiry: '2031-07-27', udi: 'UDI-IN-2026-001240' },
  { id: 'MDL-0008', device: 'Lab Equipment', description: 'Hematology Analyzer 5-Part Diff', manufacturer: 'Siemens Healthineers', quantity: 8, unit: 'units', regulation: 'FDA 510(k)', hospital: 'CMC Vellore', po: 'PO-MD-28458', received: '2026-07-27', batch: 'MD-B2026-0713', cost_inr: 12000000, expiry: '2030-07-27', udi: 'UDI-IN-2026-001241' },
  { id: 'MDL-0009', device: 'Surgical Instruments', description: 'Laparoscopic Trocar 10mm Optical', manufacturer: 'Narang Medical', quantity: 500, unit: 'pcs', regulation: 'CDSCO Approved', hospital: 'AIIMS Delhi', po: 'PO-MD-28459', received: '2026-07-26', batch: 'MD-B2026-0711', cost_inr: 750000, expiry: '2028-07-26', udi: 'UDI-IN-2026-001242' },
  { id: 'MDL-0010', device: 'Diagnostic Imaging', description: 'Ultrasound Convex 3.5MHz Probe', manufacturer: 'Philips India', quantity: 15, unit: 'pcs', regulation: 'CE Marked', hospital: 'Apollo Chennai', po: 'PO-MD-28460', received: '2026-07-26', batch: 'MD-B2026-0710', cost_inr: 3375000, expiry: '2030-07-26', udi: 'UDI-IN-2026-001243' },
  { id: 'MDL-0011', device: 'Implants & Prosthetics', description: 'PEEK Spinal Cage TLIF 12mm', manufacturer: 'Polymed', quantity: 80, unit: 'pcs', regulation: 'Under Review', hospital: 'Fortis Gurgaon', po: 'PO-MD-28461', received: '2026-07-25', batch: 'MD-B2026-0708', cost_inr: 6400000, expiry: 'N/A', udi: 'UDI-IN-2026-001244' },
  { id: 'MDL-0012', device: 'IVD Kits', description: 'RT-PCR COVID-19 Kit 50 Tests', manufacturer: 'TransAsia Biomedicals', quantity: 2000, unit: 'kits', regulation: 'CDSCO Approved', hospital: 'Manipal Bangalore', po: 'PO-MD-28462', received: '2026-07-25', batch: 'MD-B2026-0707', cost_inr: 600000, expiry: '2027-02-25', udi: 'UDI-IN-2026-001245' },
  { id: 'MDL-0013', device: 'Patient Monitors', description: 'Wireless Telemetry ECG 12-Lead', manufacturer: 'BPL Medical', quantity: 40, unit: 'units', regulation: 'Pending Certification', hospital: 'Medanta Lucknow', po: 'PO-MD-28463', received: '2026-07-24', batch: 'MD-B2026-0705', cost_inr: 4800000, expiry: '2030-07-24', udi: 'UDI-IN-2026-001246' },
  { id: 'MDL-0014', device: 'Ventilators', description: 'Transport Ventilator MRI Compatible', manufacturer: 'Trivitron Healthcare', quantity: 6, unit: 'units', regulation: 'Recalled', hospital: 'Kokilaben Mumbai', po: 'PO-MD-28464', received: '2026-07-24', batch: 'MD-B2026-0704', cost_inr: 1800000, expiry: '2028-07-24', udi: 'UDI-IN-2026-001247' },
  { id: 'MDL-0015', device: 'Sterilization Units', description: 'ETO Sterilizer 200L Cabinet', manufacturer: 'GE Healthcare India', quantity: 10, unit: 'units', regulation: 'CDSCO Approved', hospital: 'Max Super Specialty', po: 'PO-MD-28465', received: '2026-07-23', batch: 'MD-B2026-0702', cost_inr: 4500000, expiry: '2032-07-23', udi: 'UDI-IN-2026-001248' },
  { id: 'MDL-0016', device: 'Lab Equipment', description: 'Microbiology Automated Culture 120pos', manufacturer: 'Siemens Healthineers', quantity: 4, unit: 'units', regulation: 'FDA 510(k)', hospital: 'CMC Vellore', po: 'PO-MD-28466', received: '2026-07-23', batch: 'MD-B2026-0701', cost_inr: 8400000, expiry: '2030-07-23', udi: 'UDI-IN-2026-001249' },
  { id: 'MDL-0017', device: 'Surgical Instruments', description: 'Power Drill Orthopedic 18V Li-ion', manufacturer: 'Narang Medical', quantity: 25, unit: 'units', regulation: 'CE Marked', hospital: 'AIIMS Delhi', po: 'PO-MD-28467', received: '2026-07-22', batch: 'MD-B2026-0629', cost_inr: 1875000, expiry: '2029-07-22', udi: 'UDI-IN-2026-001250' },
  { id: 'MDL-0018', device: 'Diagnostic Imaging', description: 'C-Arm 9" Image Intensifier', manufacturer: 'Philips India', quantity: 3, unit: 'units', regulation: 'CDSCO Approved', hospital: 'Apollo Chennai', po: 'PO-MD-28468', received: '2026-07-22', batch: 'MD-B2026-0628', cost_inr: 9600000, expiry: '2031-07-22', udi: 'UDI-IN-2026-001251' },
  { id: 'MDL-0019', device: 'Implants & Prosthetics', description: 'Cardiac Stent DES 2.5x18mm', manufacturer: 'Polymed', quantity: 150, unit: 'pcs', regulation: 'FDA 510(k)', hospital: 'Fortis Gurgaon', po: 'PO-MD-28469', received: '2026-07-21', batch: 'MD-B2026-0625', cost_inr: 5250000, expiry: 'N/A', udi: 'UDI-IN-2026-001252' },
  { id: 'MDL-0020', device: 'IVD Kits', description: 'Dengue NS1 Ag Rapid Card 25 Test', manufacturer: 'TransAsia Biomedicals', quantity: 5000, unit: 'kits', regulation: 'CDSCO Approved', hospital: 'Manipal Bangalore', po: 'PO-MD-28470', received: '2026-07-21', batch: 'MD-B2026-0624', cost_inr: 375000, expiry: '2027-03-21', udi: 'UDI-IN-2026-001253' },
]

const genRecords = (start: number) => {
  const statuses = ['CDSCO Approved', 'FDA 510(k)', 'CE Marked', 'Under Review', 'Recalled', 'Pending Certification']
  const hospitals = ['AIIMS Delhi', 'Apollo Chennai', 'Fortis Gurgaon', 'Manipal Bangalore', 'Medanta Lucknow', 'Kokilaben Mumbai', 'Max Super Specialty', 'CMC Vellore']
  return Array.from({ length: 40 }, (_, i) => ({
    id: `MDL-${String(start + i).padStart(4, '0')}`,
    device: DEVICE_TYPES[(start + i) % 8],
    description: `${DEVICE_TYPES[(start + i) % 8]} Unit ${String((start + i) % 99 + 1).padStart(3, '0')}`,
    manufacturer: MANUFACTURERS[(start + i) % 8],
    quantity: Math.round(1 + Math.random() * 999),
    unit: ['sets', 'units', 'pcs', 'kits'][i % 4],
    regulation: statuses[(start + i) % 6],
    hospital: hospitals[(start + i) % 8],
    po: `PO-MD-${String(28470 + start + i).padStart(5, '0')}`,
    received: `2026-07-${String(20 - Math.floor((start + i) / 10)).padStart(2, '0')}`,
    batch: `MD-B2026-${String(624 - Math.floor((start + i) / 3)).padStart(4, '0')}`,
    cost_inr: Math.round(100000 + Math.random() * 10000000),
    expiry: statuses[(start + i) % 6] === 'Recalled' ? 'Expired' : `202${7 + ((start + i) % 4)}-${String(((start + i) % 28) + 1).padStart(2, '0')}-${String(((start + i) % 28) + 1).padStart(2, '0')}`,
    udi: `UDI-IN-2026-${String(1254 + start + i).padStart(6, '0')}`,
  }))
}

const allDevices = [...devices, ...genRecords(21), ...genRecords(61)]

function ri(min: number, max: number, value: number) {
  return Math.max(min, Math.min(max, value))
}

const filterGroups = [
  {
    key: 'device',
    label: 'Device Type',
    options: DEVICE_TYPES.map(d => ({ label: d, value: d, count: allDevices.filter(r => r.device === d).length })),
  },
  {
    key: 'manufacturer',
    label: 'Manufacturer',
    options: MANUFACTURERS.map(m => ({ label: m, value: m, count: allDevices.filter(r => r.manufacturer === m).length })),
  },
  {
    key: 'regulation',
    label: 'Regulation Status',
    options: REGULATION_STATUS.map(s => ({ label: s, value: s, count: allDevices.filter(r => r.regulation === s).length })),
  },
]

function DeviceBadge({ device }: { device: string }) {
  const colors: Record<string, string> = { 'Surgical Instruments': 'bg-red-100 text-red-800', 'Diagnostic Imaging': 'bg-rose-100 text-rose-800', 'Implants & Prosthetics': 'bg-pink-100 text-pink-800', 'IVD Kits': 'bg-fuchsia-100 text-fuchsia-800', 'Patient Monitors': 'bg-orange-100 text-orange-800', Ventilators: 'bg-amber-100 text-amber-800', 'Sterilization Units': 'bg-yellow-100 text-yellow-800', 'Lab Equipment': 'bg-lime-100 text-lime-800' }
  return <span className={`mdl-device-badge inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[device] || 'bg-gray-100 text-gray-800'}`}>{device}</span>
}

function RegulationBadge({ regulation }: { regulation: string }) {
  const colors: Record<string, string> = { 'CDSCO Approved': 'bg-green-100 text-green-800', 'FDA 510(k)': 'bg-blue-100 text-blue-800', 'CE Marked': 'bg-indigo-100 text-indigo-800', 'Under Review': 'bg-yellow-100 text-yellow-800', Recalled: 'bg-red-100 text-red-800', 'Pending Certification': 'bg-gray-200 text-gray-700' }
  return <span className={`mdl-regulation-badge inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[regulation] || 'bg-gray-100 text-gray-700'}`}>{regulation}</span>
}

function CostBar({ cost }: { cost: number }) {
  const pct = ri(0, 100, (cost / 12000000) * 100)
  const color = cost >= 5000000 ? 'bg-red-600' : cost >= 2000000 ? 'bg-red-500' : cost >= 500000 ? 'bg-red-400' : 'bg-red-300'
  return <div className="mdl-cost-bar flex items-center gap-2"><div className="h-2 w-20 rounded-full bg-gray-200"><div className={`mdl-cost-bar-fill h-2 rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} /></div><span className="text-xs text-gray-500">{'₹' + (cost / 100000).toFixed(1) + 'L'}</span></div>
}

function HealthRing({ value, label, color }: { value: number; label: string; color: string }) {
  const r = 28, cx = 35, cy = 35, sw = 5
  const circ = 2 * Math.PI * r
  const offset = circ - (ri(0, 100, value) / 100) * circ
  return <div className="mdl-health-ring flex flex-col items-center"><svg width={70} height={70} className="-rotate-90"><circle cx={cx} cy={cy} r={r} fill="none" stroke="#e5e7eb" strokeWidth={sw} /><circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={sw} strokeDasharray={circ} strokeDashoffset={offset} className="mdl-ring-path" strokeLinecap="round" /></svg><span className="mdl-ring-value mt-1 text-sm font-bold" style={{ color }}>{value}%</span><span className="text-xs text-gray-500">{label}</span></div>
}

function KpiTile({ title, value, sub }: { title: string; value: string; sub: string }) {
  return <Card className="mdl-kpi-card"><CardContent className="p-4"><p className="text-xs text-gray-500">{title}</p><p className="mdl-kpi-value mt-1 text-2xl font-bold">{value}</p><p className="text-xs text-gray-400 mt-0.5">{sub}</p></CardContent></Card>
}

function ValueTile({ title, value, trend }: { title: string; value: string; trend: string }) {
  const up = trend.startsWith('+')
  return <Card className="mdl-value-tile"><CardContent className="p-4"><p className="text-xs text-gray-500">{title}</p><p className="mt-1 text-xl font-bold">{value}</p><p className={`text-xs mt-0.5 ${up ? 'text-green-600' : 'text-red-500'}`}>{trend}</p></CardContent></Card>
}

export default function MedicalDeviceLogisticsView() {
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

  const filtered = allDevices.filter(d => {
    const q = searchQuery.toLowerCase()
    if (q && !d.id.toLowerCase().includes(q) && !d.device.toLowerCase().includes(q) && !d.description.toLowerCase().includes(q) && !d.manufacturer.toLowerCase().includes(q) && !d.hospital.toLowerCase().includes(q)) return false
    return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(d[key as keyof typeof d] as string))
  })

  const totalCost = allDevices.reduce((s, d) => s + d.cost_inr, 0)
  const cdSCOApproved = allDevices.filter(d => d.regulation === 'CDSCO Approved').length
  const recalled = allDevices.filter(d => d.regulation === 'Recalled').length

  const monthlyData = [
    { month: 'Jan', devices: 85, value_cr: 12, compliance: 96 },
    { month: 'Feb', devices: 92, value_cr: 15, compliance: 94 },
    { month: 'Mar', devices: 108, value_cr: 18, compliance: 97 },
    { month: 'Apr', devices: 95, value_cr: 14, compliance: 95 },
    { month: 'May', devices: 78, value_cr: 11, compliance: 93 },
    { month: 'Jun', devices: 70, value_cr: 9, compliance: 92 },
    { month: 'Jul', devices: 115, value_cr: 20, compliance: 96 },
  ]
  const deviceData = DEVICE_TYPES.map(d => ({ device: d, count: allDevices.filter(r => r.device === d).length }))
  const mfgData = MANUFACTURERS.map(m => ({ mfg: m, count: allDevices.filter(r => r.manufacturer === m).length }))

  const tabs = [
    { value: 'dashboard', label: 'Dashboard' },
    { value: 'devices', label: 'Devices' },
    { value: 'analytics', label: 'Analytics' },
    { value: 'insights', label: 'Insights' },
  ]

  return (
    <div className="mdl-container space-y-4">
      <PageHeader title="Medical Device Logistics" description="Regulated medical device tracking with CDSCO/FDA compliance, UDI traceability, cold chain monitoring, and hospital delivery management" />
      <ModuleBreadcrumb items={[{ label: 'Healthcare Logistics' }, { label: 'Medical Devices' }]} />
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mdl-tabs-list">
          {tabs.map(t => <TabsTrigger key={t.value} value={t.value} className="mdl-tab-trigger">{t.label}</TabsTrigger>)}
        </TabsList>

        <TabsContent value="dashboard" className="mdl-tab-content space-y-4 mt-4">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <KpiTile title="Total Devices" value={allDevices.length.toString()} sub="Tracked items" />
            <KpiTile title="Total Value" value={`₹${(totalCost / 10000000).toFixed(1)}Cr`} sub="Inventory value" />
            <KpiTile title="CDSCO Approved" value={cdSCOApproved.toString()} sub={`${((cdSCOApproved / allDevices.length) * 100).toFixed(0)}% compliant`} />
            <KpiTile title="Recalled" value={recalled.toString()} sub="Active recalls" />
          </div>
          <div className="grid gap-4 grid-cols-3 md:grid-cols-6">
            <HealthRing value={98} label="UDI Trace" color="#dc2626" />
            <HealthRing value={96} label="Regulatory" color="#b91c1c" />
            <HealthRing value={93} label="Cold Chain" color="#ef4444" />
            <HealthRing value={91} label="Sterility" color="#991b1b" />
            <HealthRing value={95} label="Delivery SLA" color="#7f1d1d" />
            <HealthRing value={97} label="Lot Tracking" color="#f87171" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="mdl-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Monthly Device Volume & Compliance</CardTitle></CardHeader><CardContent><LineChart data={monthlyData} width={300} height={200}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" fontSize={12} /><YAxis fontSize={12} /><Tooltip /><Legend /><Line type="monotone" dataKey="devices" stroke="#dc2626" strokeWidth={2} /><Line type="monotone" dataKey="compliance" stroke="#b91c1c" strokeWidth={2} strokeDasharray="5 5" /></LineChart></CardContent></Card>
            <Card className="mdl-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Devices by Category</CardTitle></CardHeader><CardContent><BarChart data={deviceData} width={300} height={200}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="device" fontSize={10} angle={-30} textAnchor="end" height={50} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="count" fill="#dc2626" radius={[4,4,0,0]} /></BarChart></CardContent></Card>
            <Card className="mdl-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Manufacturer Distribution</CardTitle></CardHeader><CardContent><PieChart width={300} height={200}><Pie data={mfgData} dataKey="count" nameKey="mfg" cx="50%" cy="50%" outerRadius={70} label={({ mfg, count }) => `${count}`}>{mfgData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="devices" className="mdl-tab-content space-y-4 mt-4">
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={allDevices.length} filteredCount={filtered.length} onRefresh={() => {}} placeholder="Search by ID, device, manufacturer, description, or hospital..." />
          <div className="overflow-x-auto rounded-lg border">
            <table className="mdl-table w-full text-sm">
              <thead><tr className="mdl-table-header bg-gray-50"><th className="px-3 py-2 text-left font-medium">ID</th><th className="px-3 py-2 text-left font-medium">Device</th><th className="px-3 py-2 text-left font-medium">Regulation</th><th className="px-3 py-2 text-left font-medium">Qty</th><th className="px-3 py-2 text-left font-medium">Cost</th><th className="px-3 py-2 text-left font-medium">Manufacturer</th><th className="px-3 py-2 text-left font-medium">Hospital</th><th className="px-3 py-2 text-left font-medium">UDI</th><th className="px-3 py-2 text-left font-medium">Expiry</th></tr></thead>
              <tbody>{filtered.slice(0, 20).map(d => (
                <tr key={d.id} className="mdl-table-row border-t hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-2 font-mono text-xs">{d.id}</td>
                  <td className="px-3 py-2"><DeviceBadge device={d.device} /></td>
                  <td className="px-3 py-2"><RegulationBadge regulation={d.regulation} /></td>
                  <td className="px-3 py-2 text-xs">{d.quantity.toLocaleString('en-IN')} {d.unit}</td>
                  <td className="px-3 py-2"><CostBar cost={d.cost_inr} /></td>
                  <td className="px-3 py-2 text-xs">{d.manufacturer}</td>
                  <td className="px-3 py-2 text-xs">{d.hospital}</td>
                  <td className="px-3 py-2 text-xs font-mono">{d.udi.slice(-6)}</td>
                  <td className="px-3 py-2 text-xs">{d.expiry}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="mdl-tab-content space-y-4 mt-4">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <ValueTile title="Avg Device Value" value="₹8.5L" trend="+6.2% vs last quarter" />
            <ValueTile title="CDSCO Approval Rate" value="94.8%" trend="+2.1% improved" />
            <ValueTile title="Recall Rate" value="0.4%" trend="-0.1% reduced" />
            <ValueTile title="Hospital SLA" value="4.2/5" trend="+0.4 improved" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="mdl-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Revenue by Device Category</CardTitle></CardHeader><CardContent><BarChart data={DEVICE_TYPES.map(d => ({ device: d, total: allDevices.filter(r => r.device === d).reduce((s, r) => s + r.cost_inr, 0) / 10000000 }))} width={400} height={250}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="device" fontSize={10} angle={-30} textAnchor="end" height={50} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="total" fill="#b91c1c" radius={[4,4,0,0]} /></BarChart></CardContent></Card>
            <Card className="mdl-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Regulation Status Breakdown</CardTitle></CardHeader><CardContent><PieChart width={400} height={250}><Pie data={REGULATION_STATUS.map(s => ({ status: s, count: allDevices.filter(d => d.regulation === s).length }))} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={80} label>{REGULATION_STATUS.map((_, i) => <Cell key={i} fill={['#22c55e','#3b82f6','#6366f1','#eab308','#ef4444','#9ca3af'][i]} />)}</Pie><Tooltip /></PieChart></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="mdl-tab-content space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="mdl-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">CDSCO SUGAM Digital Portal Integration</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Real-time integration with Central Drugs Standard Control Organisation SUGAM portal for automated license renewal and import registration. All 222 active device licenses tracked with 90-day expiry alerts. Automated MD-7, MD-8, and MD-9 form submissions reducing compliance processing time by 72%. Zero regulatory non-compliance incidents in FY2026.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-red-800">Critical</span><span className="text-gray-400">Live</span></div></CardContent></Card>
            <Card className="mdl-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">IoT-Enabled Sterility Monitoring</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Biological indicator (BI) and chemical indicator (CI) tracking for 350+ sterilization cycles per month across 4 distribution centers. Real-time temperature/humidity monitoring in sterile storage zones with automated quarantine triggers. Integration with hospital ERP systems for automatic device receipt confirmation upon sterilization validation.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-rose-100 px-2 py-0.5 text-rose-800">Operational</span><span className="text-gray-400">Q3 2026</span></div></CardContent></Card>
            <Card className="mdl-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">Ayushman Bharat Medical Device Pool</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Dedicated device pool management for Pradhan Mantri Jan Arogya Yojana (PMJAY) empanelled hospitals. Priority allocation of critical care devices — ventilators, monitors, and surgical kits — to 1,500+ Tier-2/Tier-3 hospitals. Dynamic reallocation based on real-time ICU bed occupancy data from NHS dashboards.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-pink-100 px-2 py-0.5 text-pink-800">Growth</span><span className="text-gray-400">FY2027</span></div></CardContent></Card>
            <Card className="mdl-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">Blockchain UDI Track-and-Trace</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Immutably recording every device movement from manufacturer to patient on a permissioned blockchain. Each device carries a unique Device Identification (UDI) scanned at 8 checkpoints. Enables 3-second recall traceability across the entire supply chain. Pilot with 5 manufacturers and 12 hospitals showing 100% tracking accuracy.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-fuchsia-100 px-2 py-0.5 text-fuchsia-800">Innovation</span><span className="text-gray-400">Pilot</span></div></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
