import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#65a30d', '#4d7c0f', '#84cc16', '#a3e635', '#bef264', '#3f6212', '#16a34a', '#22c55e']

const CROP_TYPES = ['Rice', 'Wheat', 'Sugarcane', 'Cotton', 'Soybean', 'Maize', 'Pulses', 'Spices']
const MANDIS = ['Azadpur Delhi', 'Kandla Gujarat', 'Navi Mumbai', 'Losal Rajasthan', 'Guntur AP', 'Kolkata WB', 'Indore MP', 'Coimbatore TN']
const GRADE_STATUS = ['Grade A', 'Grade B', 'Grade C', 'Rejected']

const shipments = [
  { id: 'ASC-0001', crop: 'Rice', mandi: 'Azadpur Delhi', grade: 'Grade A', weight_ton: 24.5, moisture: 12.1, price_per_quintal: 3200, farmer: 'Rajesh Kumar', origin: 'Punjab', received: '2026-07-30', truck_id: 'KA-01-AB1234' },
  { id: 'ASC-0002', crop: 'Wheat', mandi: 'Kandla Gujarat', grade: 'Grade A', weight_ton: 18.2, moisture: 10.8, price_per_quintal: 2850, farmer: 'Prakash Patel', origin: 'Gujarat', received: '2026-07-30', truck_id: 'GJ-05-CD5678' },
  { id: 'ASC-0003', crop: 'Sugarcane', mandi: 'Navi Mumbai', grade: 'Grade B', weight_ton: 42.0, moisture: 68.2, price_per_quintal: 350, farmer: 'Suresh Deshmukh', origin: 'Maharashtra', received: '2026-07-29', truck_id: 'MH-12-EF9012' },
  { id: 'ASC-0004', crop: 'Cotton', mandi: 'Guntur AP', grade: 'Grade A', weight_ton: 15.8, moisture: 8.5, price_per_quintal: 7200, farmer: 'Venkat Rao', origin: 'Telangana', received: '2026-07-29', truck_id: 'TS-08-GH3456' },
  { id: 'ASC-0005', crop: 'Soybean', mandi: 'Indore MP', grade: 'Grade B', weight_ton: 22.4, moisture: 11.2, price_per_quintal: 4600, farmer: 'Anil Sharma', origin: 'Madhya Pradesh', received: '2026-07-28', truck_id: 'MP-09-IJ7890' },
  { id: 'ASC-0006', crop: 'Maize', mandi: 'Kolkata WB', grade: 'Grade C', weight_ton: 35.0, moisture: 14.5, price_per_quintal: 2100, farmer: 'Bipin Das', origin: 'West Bengal', received: '2026-07-28', truck_id: 'WB-22-KL1234' },
  { id: 'ASC-0007', crop: 'Pulses', mandi: 'Losal Rajasthan', grade: 'Grade A', weight_ton: 12.6, moisture: 9.8, price_per_quintal: 6800, farmer: 'Gopal Singh', origin: 'Rajasthan', received: '2026-07-27', truck_id: 'RJ-14-MN5678' },
  { id: 'ASC-0008', crop: 'Spices', mandi: 'Coimbatore TN', grade: 'Grade A', weight_ton: 4.2, moisture: 7.2, price_per_quintal: 12500, farmer: 'Murugan V.', origin: 'Tamil Nadu', received: '2026-07-27', truck_id: 'TN-33-OP9012' },
  { id: 'ASC-0009', crop: 'Rice', mandi: 'Azadpur Delhi', grade: 'Grade B', weight_ton: 28.8, moisture: 13.4, price_per_quintal: 2980, farmer: 'Harpreet Kaur', origin: 'Haryana', received: '2026-07-26', truck_id: 'HR-26-QR3456' },
  { id: 'ASC-0010', crop: 'Wheat', mandi: 'Kandla Gujarat', grade: 'Grade A', weight_ton: 20.1, moisture: 10.2, price_per_quintal: 3100, farmer: 'Ramesh Bhai', origin: 'Rajasthan', received: '2026-07-26', truck_id: 'RJ-20-ST7890' },
  { id: 'ASC-0011', crop: 'Cotton', mandi: 'Guntur AP', grade: 'Grade C', weight_ton: 16.5, moisture: 15.8, price_per_quintal: 5800, farmer: 'Lakshmi Devi', origin: 'Andhra Pradesh', received: '2026-07-25', truck_id: 'AP-28-UV1234' },
  { id: 'ASC-0012', crop: 'Soybean', mandi: 'Indore MP', grade: 'Grade A', weight_ton: 19.8, moisture: 10.1, price_per_quintal: 5200, farmer: 'Deepak Tiwari', origin: 'Madhya Pradesh', received: '2026-07-25', truck_id: 'MP-23-WX5678' },
  { id: 'ASC-0013', crop: 'Sugarcane', mandi: 'Navi Mumbai', grade: 'Grade A', weight_ton: 48.2, moisture: 66.5, price_per_quintal: 380, farmer: 'Sanjay Jadhav', origin: 'Karnataka', received: '2026-07-24', truck_id: 'KA-18-YZ9012' },
  { id: 'ASC-0014', crop: 'Maize', mandi: 'Kolkata WB', grade: 'Grade B', weight_ton: 30.5, moisture: 12.8, price_per_quintal: 2350, farmer: 'Amit Pal', origin: 'Bihar', received: '2026-07-24', truck_id: 'BR-12-AB3456' },
  { id: 'ASC-0015', crop: 'Pulses', mandi: 'Losal Rajasthan', grade: 'Grade B', weight_ton: 10.4, moisture: 11.5, price_per_quintal: 5900, farmer: 'Kamla Devi', origin: 'Uttar Pradesh', received: '2026-07-23', truck_id: 'UP-81-CD7890' },
  { id: 'ASC-0016', crop: 'Spices', mandi: 'Coimbatore TN', grade: 'Grade B', weight_ton: 3.8, moisture: 9.5, price_per_quintal: 9800, farmer: 'Kannan S.', origin: 'Kerala', received: '2026-07-23', truck_id: 'KL-07-EF9012' },
  { id: 'ASC-0017', crop: 'Rice', mandi: 'Azadpur Delhi', grade: 'Rejected', weight_ton: 25.2, moisture: 18.2, price_per_quintal: 0, farmer: 'Mohan Lal', origin: 'Punjab', received: '2026-07-22', truck_id: 'PB-11-GH3456' },
  { id: 'ASC-0018', crop: 'Wheat', mandi: 'Kandla Gujarat', grade: 'Grade A', weight_ton: 22.6, moisture: 9.5, price_per_quintal: 3200, farmer: 'Nitin Shah', origin: 'Gujarat', received: '2026-07-22', truck_id: 'GJ-27-IJ7890' },
  { id: 'ASC-0019', crop: 'Cotton', mandi: 'Guntur AP', grade: 'Grade A', weight_ton: 14.2, moisture: 7.8, price_per_quintal: 7800, farmer: 'Srinivas M.', origin: 'Maharashtra', received: '2026-07-21', truck_id: 'MH-43-KL1234' },
  { id: 'ASC-0020', crop: 'Soybean', mandi: 'Indore MP', grade: 'Grade C', weight_ton: 21.0, moisture: 14.2, price_per_quintal: 3800, farmer: 'Vijay Patil', origin: 'Maharashtra', received: '2026-07-21', truck_id: 'MH-15-MN5678' },
]

const genRecords = (start: number) => {
  const statuses = ['Grade A', 'Grade A', 'Grade B', 'Grade B', 'Grade C', 'Rejected']
  const farmers = ['Rajesh Kumar', 'Prakash Patel', 'Suresh Deshmukh', 'Venkat Rao', 'Anil Sharma', 'Bipin Das', 'Gopal Singh', 'Murugan V.', 'Harpreet Kaur', 'Ramesh Bhai', 'Lakshmi Devi', 'Deepak Tiwari', 'Sanjay Jadhav', 'Amit Pal', 'Kamla Devi', 'Kannan S.', 'Mohan Lal', 'Nitin Shah', 'Srinivas M.', 'Vijay Patil']
  const origins = ['Punjab', 'Gujarat', 'Maharashtra', 'Telangana', 'MP', 'West Bengal', 'Rajasthan', 'Tamil Nadu', 'Haryana', 'Karnataka', 'AP', 'Bihar', 'UP', 'Kerala']
  return Array.from({ length: 40 }, (_, i) => ({
    id: `ASC-${String(start + i).padStart(4, '0')}`,
    crop: CROP_TYPES[(start + i) % 8],
    mandi: MANDIS[(start + i) % 8],
    grade: statuses[(start + i) % 6],
    weight_ton: Math.round((3 + Math.random() * 48) * 10) / 10,
    moisture: Math.round((6 + Math.random() * 14) * 10) / 10,
    price_per_quintal: statuses[(start + i) % 6] === 'Rejected' ? 0 : Math.round(300 + Math.random() * 12200),
    farmer: farmers[(start + i) % 20],
    origin: origins[(start + i) % 14],
    received: `2026-07-${String(20 - Math.floor((start + i) / 10)).padStart(2, '0')}`,
    truck_id: `XX-00-${String(start + i).padStart(4, '0')}`,
  }))
}

const allShipments = [...shipments, ...genRecords(21), ...genRecords(61)]

function ri(min: number, max: number, value: number) {
  return Math.max(min, Math.min(max, value))
}

const filterGroups = [
  {
    key: 'crop',
    label: 'Crop Type',
    options: CROP_TYPES.map(c => ({ label: c, value: c, count: allShipments.filter(d => d.crop === c).length })),
  },
  {
    key: 'mandi',
    label: 'Mandi',
    options: MANDIS.map(m => ({ label: m, value: m, count: allShipments.filter(d => d.mandi === m).length })),
  },
  {
    key: 'grade',
    label: 'Grade',
    options: GRADE_STATUS.map(g => ({ label: g, value: g, count: allShipments.filter(d => d.grade === g).length })),
  },
]

function CropBadge({ crop }: { crop: string }) {
  const colors: Record<string, string> = { Rice: 'bg-amber-100 text-amber-800', Wheat: 'bg-yellow-100 text-yellow-800', Sugarcane: 'bg-lime-100 text-lime-800', Cotton: 'bg-green-100 text-green-800', Soybean: 'bg-emerald-100 text-emerald-800', Maize: 'bg-teal-100 text-teal-800', Pulses: 'bg-orange-100 text-orange-800', Spices: 'bg-red-100 text-red-800' }
  return <span className={`asc-crop-badge inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[crop] || 'bg-gray-100 text-gray-800'}`}>{crop}</span>
}

function GradeBadge({ grade }: { grade: string }) {
  const colors: Record<string, string> = { 'Grade A': 'bg-green-100 text-green-800', 'Grade B': 'bg-yellow-100 text-yellow-800', 'Grade C': 'bg-orange-100 text-orange-800', Rejected: 'bg-red-100 text-red-800' }
  return <span className={`asc-grade-badge inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[grade] || 'bg-gray-100 text-gray-700'}`}>{grade}</span>
}

function MoistureBar({ moisture }: { moisture: number }) {
  const pct = ri(0, 100, (moisture / 25) * 100)
  const color = moisture <= 12 ? 'bg-green-500' : moisture <= 14 ? 'bg-yellow-500' : 'bg-red-500'
  return <div className="asc-moisture-bar flex items-center gap-2"><div className="h-2 w-20 rounded-full bg-gray-200"><div className={`asc-moisture-bar-fill h-2 rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} /></div><span className="text-xs text-gray-500">{moisture}%</span></div>
}

function HealthRing({ value, label, color }: { value: number; label: string; color: string }) {
  const r = 28, cx = 35, cy = 35, sw = 5
  const circ = 2 * Math.PI * r
  const offset = circ - (ri(0, 100, value) / 100) * circ
  return <div className="asc-health-ring flex flex-col items-center"><svg width={70} height={70} className="-rotate-90"><circle cx={cx} cy={cy} r={r} fill="none" stroke="#e5e7eb" strokeWidth={sw} /><circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={sw} strokeDasharray={circ} strokeDashoffset={offset} className="asc-ring-path" strokeLinecap="round" /></svg><span className="asc-ring-value mt-1 text-sm font-bold" style={{ color }}>{value}%</span><span className="text-xs text-gray-500">{label}</span></div>
}

function KpiTile({ title, value, sub }: { title: string; value: string; sub: string }) {
  return <Card className="asc-kpi-card"><CardContent className="p-4"><p className="text-xs text-gray-500">{title}</p><p className="asc-kpi-value mt-1 text-2xl font-bold">{value}</p><p className="text-xs text-gray-400 mt-0.5">{sub}</p></CardContent></Card>
}

function ValueTile({ title, value, trend }: { title: string; value: string; trend: string }) {
  const up = trend.startsWith('+')
  return <Card className="asc-value-tile"><CardContent className="p-4"><p className="text-xs text-gray-500">{title}</p><p className="mt-1 text-xl font-bold">{value}</p><p className={`text-xs mt-0.5 ${up ? 'text-green-600' : 'text-red-500'}`}>{trend}</p></CardContent></Card>
}

export default function AgriSupplyChainView() {
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

  const filtered = allShipments.filter(d => {
    const q = searchQuery.toLowerCase()
    if (q && !d.id.toLowerCase().includes(q) && !d.crop.toLowerCase().includes(q) && !d.farmer.toLowerCase().includes(q) && !d.origin.toLowerCase().includes(q) && !d.mandi.toLowerCase().includes(q)) return false
    return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(d[key as keyof typeof d] as string))
  })

  const gradeA = allShipments.filter(d => d.grade === 'Grade A').length
  const totalWeight = allShipments.reduce((s, d) => s + d.weight_ton, 0)
  const totalValue = allShipments.reduce((s, d) => s + (d.price_per_quintal * d.weight_ton * 10), 0)
  const rejectedCount = allShipments.filter(d => d.grade === 'Rejected').length

  const monthlyData = [
    { month: 'Jan', shipments: 180, weight_ton: 680, msp_value: 245 },
    { month: 'Feb', shipments: 210, weight_ton: 790, msp_value: 285 },
    { month: 'Mar', shipments: 240, weight_ton: 920, msp_value: 320 },
    { month: 'Apr', shipments: 195, weight_ton: 720, msp_value: 260 },
    { month: 'May', shipments: 160, weight_ton: 580, msp_value: 210 },
    { month: 'Jun', shipments: 140, weight_ton: 520, msp_value: 185 },
    { month: 'Jul', shipments: 200, weight_ton: 750, msp_value: 270 },
  ]
  const cropData = CROP_TYPES.map(c => ({ crop: c, count: allShipments.filter(d => d.crop === c).length }))
  const mandiData = MANDIS.map(m => ({ mandi: m, count: allShipments.filter(d => d.mandi === m).length }))

  const tabs = [
    { value: 'dashboard', label: 'Dashboard' },
    { value: 'shipments', label: 'Shipments' },
    { value: 'analytics', label: 'Analytics' },
    { value: 'insights', label: 'Insights' },
  ]

  return (
    <div className="asc-container space-y-4">
      <PageHeader title="Agri Supply Chain" description="Mandi-integrated agricultural commodity tracking, grading and MSP compliance for Indian farm produce" />
      <ModuleBreadcrumb items={[{ label: 'Supply Chain' }, { label: 'Agri Supply Chain' }]} />
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="asc-tabs-list">
          {tabs.map(t => <TabsTrigger key={t.value} value={t.value} className="asc-tab-trigger">{t.label}</TabsTrigger>)}
        </TabsList>

        <TabsContent value="dashboard" className="asc-tab-content space-y-4 mt-4">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <KpiTile title="Total Shipments" value={allShipments.length.toString()} sub="This season" />
            <KpiTile title="Grade A" value={gradeA.toString()} sub={`${((gradeA / allShipments.length) * 100).toFixed(0)}% quality`} />
            <KpiTile title="Total Weight" value={`${(totalWeight / 100).toFixed(1)}T`} sub="Commodity received" />
            <KpiTile title="MSP Value" value={`₹${(totalValue / 10000000).toFixed(1)}Cr`} sub="At MSP rates" />
          </div>
          <div className="grid gap-4 grid-cols-3 md:grid-cols-6">
            <HealthRing value={94} label="Grade A Rate" color="#65a30d" />
            <HealthRing value={88} label="MSP Compliant" color="#4d7c0f" />
            <HealthRing value={76} label="Moisture OK" color="#84cc16" />
            <HealthRing value={92} label="Traceability" color="#3f6212" />
            <HealthRing value={85} label="Farmer Paid" color="#16a34a" />
            <HealthRing value={97} label="eNAM Linked" color="#22c55e" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="asc-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Monthly Shipments & Weight</CardTitle></CardHeader><CardContent><LineChart data={monthlyData} width={300} height={200}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" fontSize={12} /><YAxis fontSize={12} /><Tooltip /><Legend /><Line type="monotone" dataKey="shipments" stroke="#65a30d" strokeWidth={2} /><Line type="monotone" dataKey="msp_value" stroke="#4d7c0f" strokeWidth={2} strokeDasharray="5 5" /></LineChart></CardContent></Card>
            <Card className="asc-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Shipments by Crop</CardTitle></CardHeader><CardContent><BarChart data={cropData} width={300} height={200}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="crop" fontSize={10} angle={-30} textAnchor="end" height={50} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="count" fill="#65a30d" radius={[4,4,0,0]} /></BarChart></CardContent></Card>
            <Card className="asc-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Mandi Distribution</CardTitle></CardHeader><CardContent><PieChart width={300} height={200}><Pie data={mandiData} dataKey="count" nameKey="mandi" cx="50%" cy="50%" outerRadius={70} label={({ mandi, count }) => `${count}`}>{mandiData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="shipments" className="asc-tab-content space-y-4 mt-4">
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={allShipments.length} filteredCount={filtered.length} onRefresh={() => {}} placeholder="Search by ID, crop, farmer, origin, or mandi..." />
          <div className="overflow-x-auto rounded-lg border">
            <table className="asc-table w-full text-sm">
              <thead><tr className="asc-table-header bg-gray-50"><th className="px-3 py-2 text-left font-medium">ID</th><th className="px-3 py-2 text-left font-medium">Crop</th><th className="px-3 py-2 text-left font-medium">Mandi</th><th className="px-3 py-2 text-left font-medium">Grade</th><th className="px-3 py-2 text-left font-medium">Weight</th><th className="px-3 py-2 text-left font-medium">Moisture</th><th className="px-3 py-2 text-left font-medium">Price/Qtl</th><th className="px-3 py-2 text-left font-medium">Farmer</th><th className="px-3 py-2 text-left font-medium">Origin</th></tr></thead>
              <tbody>{filtered.slice(0, 20).map(d => (
                <tr key={d.id} className="asc-table-row border-t hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-2 font-mono text-xs">{d.id}</td>
                  <td className="px-3 py-2"><CropBadge crop={d.crop} /></td>
                  <td className="px-3 py-2 text-xs">{d.mandi}</td>
                  <td className="px-3 py-2"><GradeBadge grade={d.grade} /></td>
                  <td className="px-3 py-2 text-xs">{d.weight_ton}T</td>
                  <td className="px-3 py-2"><MoistureBar moisture={d.moisture} /></td>
                  <td className="px-3 py-2 text-xs">{d.price_per_quintal > 0 ? `₹${d.price_per_quintal.toLocaleString('en-IN')}` : '-'}</td>
                  <td className="px-3 py-2 text-xs">{d.farmer}</td>
                  <td className="px-3 py-2 text-xs">{d.origin}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="asc-tab-content space-y-4 mt-4">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <ValueTile title="Avg Weight" value="22.4T" trend="+8.5% vs last season" />
            <ValueTile title="Avg MSP" value="₹4,250/qtl" trend="+6.2% increased" />
            <ValueTile title="Rejection Rate" value="5.2%" trend="-2.1% improved" />
            <ValueTile title="Farmer Satisfaction" value="4.2/5" trend="+0.3 improved" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="asc-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Crop Volume</CardTitle></CardHeader><CardContent><BarChart data={cropData} width={400} height={250}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="crop" fontSize={10} angle={-30} textAnchor="end" height={50} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="count" fill="#4d7c0f" radius={[4,4,0,0]} /></BarChart></CardContent></Card>
            <Card className="asc-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Grade Breakdown</CardTitle></CardHeader><CardContent><PieChart width={400} height={250}><Pie data={GRADE_STATUS.map(g => ({ grade: g, count: allShipments.filter(d => d.grade === g).length }))} dataKey="count" nameKey="grade" cx="50%" cy="50%" outerRadius={80} label>{GRADE_STATUS.map((_, i) => <Cell key={i} fill={['#22c55e','#eab308','#f97316','#ef4444'][i]} />)}</Pie><Tooltip /></PieChart></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="asc-tab-content space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="asc-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">eNAM Digital Marketplace Integration</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Direct integration with National Agriculture Market (eNAM) for transparent price discovery. Real-time MSP benchmarking across 1,000+ mandis. Farmers receive instant payment via DBT within 48 hours of grading completion. 97% eNAM linkage achieved.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-lime-100 px-2 py-0.5 text-lime-800">Critical</span><span className="text-gray-400">Live</span></div></CardContent></Card>
            <Card className="asc-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">IoT Silo Monitoring</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>IoT sensors across 45 storage silos monitoring temperature, humidity, and grain condition 24/7. AI-powered aeration control reducing storage losses from 8% to 2.5%. Automated alerts for moisture threshold breaches and pest detection.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-green-800">Operational</span><span className="text-gray-400">Q3 2026</span></div></CardContent></Card>
            <Card className="asc-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">Kisan Rail Cold Chain</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Partnership with Indian Railways Kisan Rail for temperature-controlled perishable transport. Delhi-Mumbai corridor in 18 hours vs 48-hour road transport. Reduced transport cost by 35% while maintaining 98% freshness rate for fruits and vegetables.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-800">Growth</span><span className="text-gray-400">FY2027</span></div></CardContent></Card>
            <Card className="asc-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">Drone Crop Quality Assessment</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>DGCA-approved drone flights for pre-harvest crop quality estimation. Multispectral imaging predicts yield, protein content, and moisture levels 2 weeks before harvest. Accuracy: 91% for wheat, 88% for rice. Helping 2,400+ farmers optimize harvest timing.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-teal-100 px-2 py-0.5 text-teal-800">Innovation</span><span className="text-gray-400">Pilot</span></div></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
