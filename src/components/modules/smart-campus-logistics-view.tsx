'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts'

interface SCLRecord {
  id: string; projectId: string; city: string; operator: string; campusType: string
  students: number; investmentCr: number; smartDevices: number; status: string; priority: string
  origin: string; destination: string; shipDate: string; transitDays: number; state: string; remarks: string
}

const COLORS = ['#6b21a8', '#7c3aed', '#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe', '#ede9fe', '#f5f3ff']

const records: SCLRecord[] = [
  { id: 'SCL-001', projectId: 'SCL-001', city: 'Bengaluru', operator: 'IISc Smart Campus', campusType: 'Research University',
    students: 12000, investmentCr: 280, smartDevices: 45000, status: 'Delivered', priority: 'Critical', origin: 'JEE Board Complex', destination: 'IISc Main Campus', shipDate: '2024-01-10', transitDays: 5, state: 'Karnataka',
    remarks: 'India&apos;s premier research university with 45,000 IoT smart devices covering energy management, lab safety, attendance tracking, AI-powered CCTV surveillance, and digital twin of 500+ laboratories across 150-acre campus in Bengaluru' },
  { id: 'SCL-002', projectId: 'SCL-002', city: 'Mumbai', operator: 'IIT Bombay Smart Hub', campusType: 'IIT Campus',
    students: 18000, investmentCr: 420, smartDevices: 68000, status: 'Delivered', priority: 'Critical', origin: 'Powai Tech Park', destination: 'IIT Bombay Hostels', shipDate: '2024-01-20', transitDays: 4, state: 'Maharashtra',
    remarks: '68,000 smart devices at IIT Bombay covering hostel energy management with 35% savings, AI food court queue management, automated library logistics, smart parking for 5,000 vehicles, and campus-wide drone delivery for inter-block document logistics' },
  { id: 'SCL-003', projectId: 'SCL-003', city: 'Delhi', operator: 'JNU Integrated Campus', campusType: 'Central University',
    students: 15000, investmentCr: 350, smartDevices: 52000, status: 'Delivered', priority: 'High', origin: 'Vasant Kunj Depot', destination: 'JNU Academic Block', shipDate: '2024-02-05', transitDays: 6, state: 'Delhi',
    remarks: 'JNU smart campus with 52,000 connected devices for solar-powered street lighting, smart water metering across 200+ hostels, AI-based security with facial recognition at 40 gates, and integrated waste management robots covering 1,000-acre campus' },
  { id: 'SCL-004', projectId: 'SCL-004', city: 'Chennai', operator: 'Anna University Tech Park', campusType: 'State University',
    students: 25000, investmentCr: 310, smartDevices: 58000, status: 'Delivered', priority: 'High', origin: 'Guindy Industrial', destination: 'Anna University Main', shipDate: '2024-02-18', transitDays: 7, state: 'Tamil Nadu',
    remarks: 'Anna University&apos;s 58,000-device smart campus covering automated exam logistics for 25,000 students, smart classroom IoT with 500+ connected projectors and HVAC systems, and RFID-based lab equipment tracking across 85 departments' },
  { id: 'SCL-005', projectId: 'SCL-005', city: 'Kharagpur', operator: 'IIT KGP Smart Village', campusType: 'IIT Campus',
    students: 16000, investmentCr: 480, smartDevices: 72000, status: 'Delivered', priority: 'High', origin: 'Midnapore Town', destination: 'IIT KGP Campus', shipDate: '2024-03-01', transitDays: 8, state: 'West Bengal',
    remarks: 'IIT Kharagpur&apos;s 2,100-acre smart campus with 72,000 devices, India&apos;s largest campus solar microgrid at 5 MW, autonomous campus shuttle network with 12 electric busses, and smart agricultural research plots with IoT soil and weather monitoring systems' },
  { id: 'SCL-006', projectId: 'SCL-006', city: 'Hyderabad', operator: 'University of Hyderabad', campusType: 'Central University',
    students: 8000, investmentCr: 190, smartDevices: 28000, status: 'In Transit', priority: 'Medium', origin: 'Gachibowli IT Hub', destination: 'UoH Campus', shipDate: '2024-04-10', transitDays: 9, state: 'Telangana',
    remarks: 'University of Hyderabad smart campus with 28,000 IoT devices covering bio-diversity monitoring in 2,300-acre campus, smart lake water quality sensors, AI-powered herbal garden management, and campus-wide LoRaWAN mesh for underground utility tracking' },
  { id: 'SCL-007', projectId: 'SCL-007', city: 'Kanpur', operator: 'IIT Kanpur Digital Twin', campusType: 'IIT Campus',
    students: 14000, investmentCr: 390, smartDevices: 61000, status: 'Delivered', priority: 'High', origin: 'Kanpur Industrial', destination: 'IIT Kanpur Campus', shipDate: '2024-02-28', transitDays: 10, state: 'Uttar Pradesh',
    remarks: 'IIT Kanpur with full digital twin of campus infrastructure including 200+ buildings, 15 km underground utilities, and real-time energy-water-waste simulation. 61,000 smart devices with AI-powered predictive maintenance reducing equipment downtime by 45%' },
  { id: 'SCL-008', projectId: 'SCL-008', city: 'Roorkee', operator: 'IIT Roorkee Heritage Smart', campusType: 'IIT Campus',
    students: 11000, investmentCr: 260, smartDevices: 38000, status: 'Delivered', priority: 'Medium', origin: 'Roorkee Town', destination: 'IIT Roorkee Main', shipDate: '2024-03-15', transitDays: 11, state: 'Uttar Pradesh',
    remarks: 'India&apos;s oldest technical institution with smart heritage conservation using 38,000 IoT sensors monitoring 175-year-old buildings for structural health, Ganga canal water level sensors, and seismic monitoring network for earthquake early warning across campus' },
  { id: 'SCL-009', projectId: 'SCL-009', city: 'Guwahati', operator: 'IIT Guwahati Green Campus', campusType: 'IIT Campus',
    students: 9000, investmentCr: 320, smartDevices: 42000, status: 'Processing', priority: 'Medium', origin: 'Guwahati City Center', destination: 'IIT Guwahati Campus', shipDate: '2024-06-15', transitDays: 14, state: 'Assam',
    remarks: 'IIT Guwahati&apos;s 700-acre smart campus with 42,000 devices focused on biodiversity conservation, Brahmaputra flood monitoring sensors, solar-powered campus transport, and smart tribal heritage documentation center with AR/VR exhibits' },
  { id: 'SCL-010', projectId: 'SCL-010', city: 'Bhopal', operator: 'IISER Bhopal Research Hub', campusType: 'Research Institute',
    students: 3500, investmentCr: 180, smartDevices: 22000, status: 'In Transit', priority: 'Low', origin: 'Bhopal Habibganj', destination: 'IISER Bhopal Campus', shipDate: '2024-05-20', transitDays: 12, state: 'Madhya Pradesh',
    remarks: 'IISER Bhopal with 22,000 smart devices for advanced chemistry lab automation, radiation safety monitoring in nuclear science labs, AI-powered greenhouse for plant genetics research, and campus-wide mesh network for real-time research data collection' },
  { id: 'SCL-011', projectId: 'SCL-011', city: 'Pune', operator: 'Symbiosis Smart Campus', campusType: 'Deemed University',
    students: 28000, investmentCr: 240, smartDevices: 48000, status: 'Delivered', priority: 'Medium', origin: 'Viman Nagar', destination: 'Symbiosis Lavale', shipDate: '2024-03-28', transitDays: 8, state: 'Maharashtra',
    remarks: 'Symbiosis Pune with 48,000 smart devices across multiple campuses covering multilingual AI translation for 50,000+ international students, smart food courts with AI dietary tracking, automated campus shuttle scheduling, and digital currency ecosystem for campus transactions' },
  { id: 'SCL-012', projectId: 'SCL-012', city: 'Mohali', operator: 'IISER Mohali Tech Campus', campusType: 'Research Institute',
    students: 4000, investmentCr: 210, smartDevices: 26000, status: 'Delivered', priority: 'Low', origin: 'Chandigarh Sector 17', destination: 'IISER Mohali Campus', shipDate: '2024-04-08', transitDays: 7, state: 'Punjab',
    remarks: 'IISER Mohali smart campus with 26,000 devices focusing on astrophysics research data relay, cold chain logistics for biological samples, quantum computing lab environmental monitoring, and smart telescope enclosure climate control for 3.6m DOT observatory' },
  { id: 'SCL-013', projectId: 'SCL-013', city: 'Thiruvananthapuram', operator: 'IIST Space Campus', campusType: 'Specialized Institute',
    students: 5000, investmentCr: 350, smartDevices: 34000, status: 'Delivered', priority: 'High', origin: 'Trivandrum Space Port', destination: 'IIST Valiamala', shipDate: '2024-03-05', transitDays: 9, state: 'Kerala',
    remarks: 'Indian Institute of Space Science and Technology with 34,000 smart devices, satellite ground station integration, clean room logistics tracking for payload assembly, rocket propellant safety monitoring, and ISRO-linked mission control simulation labs for student training' },
  { id: 'SCL-014', projectId: 'SCL-014', city: 'Tirupati', operator: 'IIT Tirupati Smart Campus', campusType: 'IIT Campus',
    students: 6000, investmentCr: 270, smartDevices: 31000, status: 'Delayed', priority: 'Medium', origin: 'Tirupati Temple Town', destination: 'IIT Tirupati Campus', shipDate: '2024-06-01', transitDays: 13, state: 'Andhra Pradesh',
    remarks: 'IIT Tirupati&apos;s new 580-acre smart campus with 31,000 devices, smart heritage management IoT for temple city logistics coordination, solar-powered campus with 2 MW capacity, AI-driven crowd management during Brahmotsavam festival season serving 500,000+ pilgrims' },
]

export default function SmartCampusLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})

  const toggleFilter = (group: string, value: string) => {
    setActiveFilters(prev => {
      const arr = prev[group] || []
      const next = arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value]
      if (!next.length) { const { [group]: _, ...rest } = prev; return rest }
      return { ...prev, [group]: next }
    })
  }

  const filtered = useMemo(() => {
    let result = records
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(r => Object.values(r).some(v => String(v).toLowerCase().includes(q)))
    }
    result = result.filter(r =>
      Object.entries(activeFilters).every(([k, vs]) => vs.length === 0 || vs.includes(String(r[k as keyof SCLRecord])))
    )
    return result
  }, [searchQuery, activeFilters])

  const filterGroups = useMemo(() => [
    { key: 'status', label: 'Status', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.status] = (m[r.status] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'priority', label: 'Priority', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.priority] = (m[r.priority] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'campusType', label: 'Campus Type', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.campusType] = (m[r.campusType] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'state', label: 'State', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.state] = (m[r.state] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
  ], [])

  const kpis = useMemo(() => [
    { label: 'Total Students Covered', value: `${filtered.reduce((a: number, r) => a + r.students, 0).toLocaleString()}` },
    { label: 'Total Smart Devices', value: `${filtered.reduce((a: number, r) => a + r.smartDevices, 0).toLocaleString()}` },
    { label: 'Total Investment', value: `&#8377;${filtered.reduce((a: number, r) => a + r.investmentCr, 0).toLocaleString()} Cr` },
    { label: 'Devices/Student', value: `${(filtered.reduce((a: number, r) => a + r.smartDevices, 0) / Math.max(1, filtered.reduce((a: number, r) => a + r.students, 0))).toFixed(1)}` },
  ], [filtered])

  const cd = useMemo(() => {
    const grp = (fn: (r: SCLRecord) => string, val: (r: SCLRecord) => number) =>
      Object.entries(filtered.reduce((a: Record<string, number>, r) => { a[fn(r)] = (a[fn(r)] || 0) + val(r); return a }, {})).map(([name, value]) => ({ name, value }))
    const barState = grp(r => r.state, r => r.smartDevices)
    const pieState = grp(r => r.state, () => 1)
    const statusPie = grp(r => r.status, () => 1)
    const typeBar = grp(r => r.campusType, () => 1)
    const priorityPie = grp(r => r.priority, () => 1)
    const totalInvest = grp(r => r.state, r => r.investmentCr)
    const effData = filtered.map(r => ({ name: r.city.slice(0, 10), value: +(r.smartDevices / r.students).toFixed(1) }))
    const lm = filtered.reduce((a: Record<string, { students: number; smartDevices: number }>, r) => {
      if (!a[r.state]) a[r.state] = { students: 0, smartDevices: 0 }
      a[r.state].students += r.students; a[r.state].smartDevices += r.smartDevices; return a
    }, {})
    const lineData = Object.entries(lm).map(([name, v]) => ({ name, students: v.students, smartDevices: v.smartDevices }))
    return { barState, pieState, statusPie, typeBar, priorityPie, totalInvest, effData, lineData }
  }, [filtered])

  const sc = (s: string) => s === 'Delayed' ? 'bg-red-100 text-red-800' : s === 'Delivered' ? 'bg-green-100 text-green-800' : s === 'In Transit' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'

  return (
    <div className="scl-root p-6 space-y-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics', href: '/logistics' }, { label: 'Smart Campus' }]} />
      <PageHeader title="Smart Campus Logistics" description="Track smart campus logistics, IoT device deployments, digital twin infrastructure, and university supply chain operations across India's premier educational institutions" />
      <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
      <div className="scl-tabs flex gap-2">{['dashboard', 'registry', 'analytics', 'insights'].map(t => (
        <button key={t} onClick={() => setTab(t)} className={`scl-tab px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? 'bg-purple-800 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
      ))}</div>

      {tab === 'dashboard' && (<>
        <div className="scl-kpi-grid grid grid-cols-4 gap-4">{kpis.map((k, i) => (
          <Card key={i} className="scl-kpi-card"><CardContent className="p-4"><p className="scl-kpi-label text-sm text-muted-foreground">{k.label}</p><p className="scl-kpi-value text-2xl font-bold mt-1" dangerouslySetInnerHTML={{ __html: k.value }} /></CardContent></Card>
        ))}</div>
        <div className="scl-dash-charts grid grid-cols-2 gap-4 mt-4">
          <Card><CardHeader><CardTitle className="scl-chart-title text-sm">Smart Devices by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={cd.barState}><XAxis dataKey="name" fontSize={11} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#6b21a8" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader><CardTitle className="scl-chart-title text-sm">Campus Distribution by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={cd.pieState} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label fontSize={10}>{cd.pieState.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
      </>)}

      {tab === 'registry' && (<>
        <div className="scl-reg-charts grid grid-cols-2 gap-4 mb-4">
          <Card><CardHeader><CardTitle className="scl-chart-title text-sm">Devices per Student by City</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={cd.effData}><XAxis dataKey="name" fontSize={10} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#7c3aed" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader><CardTitle className="scl-chart-title text-sm">Status Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={cd.statusPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label fontSize={10}>{cd.statusPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
        <div className="scl-records space-y-3">{filtered.map(r => (
          <Card key={r.id} className={`scl-record-card ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : 'border-l-4 border-l-purple-800'}`}><CardContent className="p-4">
            <div className="flex justify-between items-start"><div>
              <p className="font-semibold text-sm">{r.projectId} &#8594; {r.city}</p>
              <p className="text-xs text-muted-foreground mt-1">{r.operator} | {r.campusType} | {r.state}</p>
              <p className="text-xs mt-1">{r.students.toLocaleString()} students | {r.smartDevices.toLocaleString()} devices | &#8377;{r.investmentCr} Cr | {r.transitDays}d transit</p>
            </div><div className="flex gap-1 shrink-0 ml-3">
              <Badge className={sc(r.status)} variant="secondary">{r.status}</Badge>
              <Badge variant="outline" className="text-xs">{r.priority}</Badge>
            </div></div>
            <p className="text-xs text-muted-foreground mt-2">{r.remarks}</p>
          </CardContent></Card>
        ))}</div>
      </>)}

      {tab === 'analytics' && (<div className="scl-analytics grid grid-cols-2 gap-4">
        <Card><CardHeader><CardTitle className="scl-chart-title text-sm">Students vs Smart Devices by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><LineChart data={cd.lineData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={10} /><YAxis yAxisId="left" fontSize={11} /><YAxis yAxisId="right" orientation="right" fontSize={11} /><Tooltip /><Legend /><Line yAxisId="left" type="monotone" dataKey="students" stroke="#6b21a8" name="Students" /><Line yAxisId="right" type="monotone" dataKey="smartDevices" stroke="#a78bfa" name="Smart Devices" /></LineChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="scl-chart-title text-sm">Total Investment by State (&#8377; Cr)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={cd.totalInvest}><XAxis dataKey="name" fontSize={10} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="scl-chart-title text-sm">Campus Type Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={cd.typeBar}><XAxis dataKey="name" fontSize={10} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#c4b5fd" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="scl-chart-title text-sm">Priority Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={cd.priorityPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label fontSize={11}>{cd.priorityPie.map((_, i) => <Cell key={i} fill={COLORS[(i + 2) % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
      </div>)}

      {tab === 'insights' && (<div className="scl-insights grid grid-cols-2 gap-4">
        <Card className="scl-insight-card border-l-4 border-l-purple-800"><CardContent className="p-5">
          <h4 className="scl-insight-title font-semibold text-base">India&apos;s 1,000+ Universities Going Smart by 2030</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">India has 1,043 universities and 42,343 colleges enrolling 43 million students. NEP 2020 mandates digital infrastructure upgrades for all NAAC A++ accredited institutions. Smart campus logistics market projected at &#8377;25,000 Cr by 2030, covering IoT deployment, digital twin modeling, and campus supply chain automation.</p>
        </CardContent></Card>
        <Card className="scl-insight-card border-l-4 border-l-purple-800"><CardContent className="p-5">
          <h4 className="scl-insight-title font-semibold text-base">Digital Twin: Campus Infrastructure Simulation</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Campus digital twins integrate BIM models with real-time IoT data for predictive maintenance, energy optimization, and space utilization. IIT Bombay&apos;s twin covers 200+ buildings and saves &#8377;12 Cr annually in energy costs. By 2028, 50+ Indian institutions will deploy digital twins, reducing operational costs by 30%.</p>
        </CardContent></Card>
        <Card className="scl-insight-card border-l-4 border-l-purple-800"><CardContent className="p-5">
          <h4 className="scl-insight-title font-semibold text-base">Campus Supply Chain: Lab to Library Logistics</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Smart campus logistics manages 500+ material categories: lab chemicals, library books, food supplies, medical supplies, and IT equipment. RFID-tagged inventory with AI-driven demand forecasting reduces stockouts by 70% and cuts holding costs by 25%. Campus AGVs deliver lab supplies autonomously at IIT Madras and IIT Kharagpur.</p>
        </CardContent></Card>
        <Card className="scl-insight-card border-l-4 border-l-purple-800"><CardContent className="p-5">
          <h4 className="scl-insight-title font-semibold text-base">Smart Campus Energy Independence</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">India&apos;s top 50 campuses consume 2.5 GW peak power costing &#8377;7,500 Cr annually. Smart energy management with IoT sensors, AI load balancing, and campus microgrids can reduce consumption by 40%. IIT Kharagpur&apos;s 5 MW solar microgrid achieves 60% energy independence, saving &#8377;18 Cr annually with V2G EV integration.</p>
        </CardContent></Card>
      </div>)}
    </div>
  )
}
