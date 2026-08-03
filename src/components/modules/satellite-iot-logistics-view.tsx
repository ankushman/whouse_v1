'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts'

interface SIOTRecord {
  id: string; projectId: string; region: string; groundStation: string; operator: string; constellation: string
  devicesServed: number; bandwidthMbps: number; investmentCr: number; status: string; priority: string
  origin: string; destination: string; shipDate: string; transitDays: number; state: string; remarks: string
}

const COLORS = ['#7c3aed', '#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe', '#ede9fe', '#f5f3ff', '#faf5ff']

const records: SIOTRecord[] = [
  { id: 'SIOT-001', projectId: 'SIOT-001', region: 'Karnataka', groundStation: 'ISRO Bengaluru (ISTRAC)', operator: 'ISRO/DoS', constellation: 'NavIC (IRNSS)',
    devicesServed: 500000, bandwidthMbps: 1200, investmentCr: 800, status: 'Delivered', priority: 'High', origin: 'ISRO HQ Bengaluru', destination: 'ISTRAC Campus', shipDate: '2024-02-10', transitDays: 15, state: 'South',
    remarks: 'Primary NavIC ground control handling 7 IRNSS satellites, supports 500K IoT devices across South India with 1.2 Gbps throughput' },
  { id: 'SIOT-002', projectId: 'SIOT-002', region: 'Andhra Pradesh', groundStation: 'Satish Dhawan Sriharikota', operator: 'ISRO/DoS', constellation: 'GSAT-24 (Indian GEO)',
    devicesServed: 350000, bandwidthMbps: 800, investmentCr: 600, status: 'Delivered', priority: 'Medium', origin: 'SAC Ahmedabad', destination: 'SHAR Sriharikota', shipDate: '2024-01-15', transitDays: 20, state: 'South',
    remarks: 'GSAT-24 downlink station with 800 Mbps capacity, serves AP/TN logistics corridor for agricultural IoT monitoring' },
  { id: 'SIOT-003', projectId: 'SIOT-003', region: 'Gujarat', groundStation: 'ISRO Ahmedabad', operator: 'OneWeb India', constellation: 'OneWeb GEN-1 LEO',
    devicesServed: 1200000, bandwidthMbps: 1500, investmentCr: 1200, status: 'Delivered', priority: 'Critical', origin: 'OneWeb UK Gateway', destination: 'ISRO Ahmedabad', shipDate: '2023-11-20', transitDays: 25, state: 'West',
    remarks: 'OneWeb gateway with 1,500 Mbps bandwidth, largest LEO ground station in India serving 1.2M devices across Western region' },
  { id: 'SIOT-004', projectId: 'SIOT-004', region: 'Kerala', groundStation: 'Ground Station Thiruvananthapuram', operator: 'ISRO/DoS', constellation: 'NavIC (IRNSS)',
    devicesServed: 280000, bandwidthMbps: 600, investmentCr: 450, status: 'In Transit', priority: 'Medium', origin: 'VSSC Thiruvananthapuram', destination: 'GS Thiruvananthapuram', shipDate: '2024-06-05', transitDays: 18, state: 'South',
    remarks: 'NavIC regional station for Kerala, critical for maritime and coastal IoT logistics with fishing fleet tracking integration' },
  { id: 'SIOT-005', projectId: 'SIOT-005', region: 'Tamil Nadu', groundStation: 'Master Control Hassan', operator: 'Tata Sky Satellite', constellation: 'GSAT-24 (Indian GEO)',
    devicesServed: 450000, bandwidthMbps: 1000, investmentCr: 700, status: 'Delivered', priority: 'High', origin: 'ISRO Bengaluru', destination: 'MCF Hassan', shipDate: '2024-03-01', transitDays: 22, state: 'South',
    remarks: 'GSAT-24 control with 1,000 Mbps, backbone for Tata Sky satellite IoT services across Tamil Nadu logistics hubs' },
  { id: 'SIOT-006', projectId: 'SIOT-006', region: 'Maharashtra', groundStation: 'SAC Ahmedabad', operator: 'Nelco (HCISCOM)', constellation: 'Hughes Jupiter',
    devicesServed: 800000, bandwidthMbps: 1800, investmentCr: 1100, status: 'In Transit', priority: 'High', origin: 'Hughes USA', destination: 'SAC Ahmedabad', shipDate: '2024-05-20', transitDays: 30, state: 'West',
    remarks: 'Hughes Jupiter VSAT hub, 1,800 Mbps for Maharashtra IoT covering Mumbai-Pune industrial corridor with 800K endpoints' },
  { id: 'SIOT-007', projectId: 'SIOT-007', region: 'Odisha', groundStation: 'PRL Giridih', operator: 'Starlink India', constellation: 'Starlink LEO (v2 mini)',
    devicesServed: 2000000, bandwidthMbps: 2000, investmentCr: 1500, status: 'In Transit', priority: 'High', origin: 'Starlink Launch Site', destination: 'PRL Giridih', shipDate: '2024-06-15', transitDays: 35, state: 'East',
    remarks: 'Starlink LEO ground station with 2,000 Mbps, highest capacity non-GEO station in Eastern India serving mining and port IoT' },
  { id: 'SIOT-008', projectId: 'SIOT-008', region: 'Assam', groundStation: 'ARFI Guwahati', operator: 'ISRO/DoS', constellation: 'NavIC (IRNSS)',
    devicesServed: 150000, bandwidthMbps: 400, investmentCr: 300, status: 'Delivered', priority: 'Medium', origin: 'ISRO Shillong', destination: 'ARFI Guwahati', shipDate: '2024-01-25', transitDays: 28, state: 'NE',
    remarks: 'NavIC station covering NE India, vital for remote area logistics and disaster management IoT with 150K device coverage' },
  { id: 'SIOT-009', projectId: 'SIOT-009', region: 'Ladakh', groundStation: 'NARL Gadanki', operator: 'Pixxel (hyperspectral IoT)', constellation: 'Pixxel hyperspectral',
    devicesServed: 80000, bandwidthMbps: 300, investmentCr: 200, status: 'Processing', priority: 'Medium', origin: 'Pixxel Bengaluru', destination: 'NARL Gadanki', shipDate: '2024-07-10', transitDays: 40, state: 'North',
    remarks: 'Pixxel hyperspectral IoT uplink, 300 Mbps for Ladakh remote sensing and border logistics applications at high altitude' },
  { id: 'SIOT-010', projectId: 'SIOT-010', region: 'Rajasthan', groundStation: 'IIRS Dehradun', operator: 'ISRO/DoS', constellation: 'ESA Copernicus',
    devicesServed: 250000, bandwidthMbps: 500, investmentCr: 350, status: 'In Transit', priority: 'Medium', origin: 'ESA Darmstadt', destination: 'IIRS Dehradun', shipDate: '2024-05-01', transitDays: 32, state: 'North',
    remarks: 'ESA Copernicus data relay for Rajasthan, supports agricultural IoT monitoring over 250K hectares of desert farming' },
  { id: 'SIOT-011', projectId: 'SIOT-011', region: 'UP', groundStation: 'NEC Shillong', operator: 'Airtel Satellite', constellation: 'Inmarsat BGAN',
    devicesServed: 600000, bandwidthMbps: 900, investmentCr: 650, status: 'Delivered', priority: 'High', origin: 'Inmarsat London', destination: 'NEC Shillong', shipDate: '2024-02-28', transitDays: 38, state: 'East',
    remarks: 'Inmarsat BGAN for UP logistics, 900 Mbps covering Gangetic plain supply chains with 600K agricultural IoT endpoints' },
  { id: 'SIOT-012', projectId: 'SIOT-012', region: 'West Bengal', groundStation: 'Antarctica Bharati', operator: 'Bellatrix Aerospace', constellation: 'Bellatrix LEO',
    devicesServed: 180000, bandwidthMbps: 350, investmentCr: 250, status: 'Delayed', priority: 'Medium', origin: 'Bellatrix Bengaluru', destination: 'Bharati Station', shipDate: '2024-03-15', transitDays: 45, state: 'East',
    remarks: 'Bellatrix LEO nano-satellite IoT relay via Antarctica Bharati, 350 Mbps serving Eastern India - delayed due to extreme weather window at Bharati Station' },
  { id: 'SIOT-013', projectId: 'SIOT-013', region: 'Telangana', groundStation: 'NRSC Hyderabad', operator: 'Dhruva Space', constellation: 'DSX (Dhruva Space)',
    devicesServed: 5000000, bandwidthMbps: 2000, investmentCr: 1500, status: 'Delivered', priority: 'Critical', origin: 'Dhruva Space HQ', destination: 'NRSC Hyderabad', shipDate: '2023-10-05', transitDays: 20, state: 'South',
    remarks: 'DSX ground station with 2,000 Mbps, India&apos;s largest dedicated satellite IoT hub in Telangana serving 5M devices' },
  { id: 'SIOT-014', projectId: 'SIOT-014', region: 'J&K', groundStation: 'IIT Bombay', operator: 'Jio Space', constellation: 'Iridium NEXT',
    devicesServed: 50000, bandwidthMbps: 100, investmentCr: 150, status: 'Processing', priority: 'Medium', origin: 'Iridium Gateway', destination: 'IIT Bombay', shipDate: '2024-07-20', transitDays: 50, state: 'North',
    remarks: 'Iridium NEXT gateway for J&amp;K mountain logistics, 100 Mbps for border monitoring and remote valley supply chain tracking' },
]

export default function SatelliteIotLogisticsView() {
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
      Object.entries(activeFilters).every(([k, vs]) => vs.length === 0 || vs.includes(String(r[k as keyof SIOTRecord])))
    )
    return result
  }, [searchQuery, activeFilters])

  const filterGroups = useMemo(() => [
    { key: 'status', label: 'Status', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.status] = (m[r.status] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'priority', label: 'Priority', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.priority] = (m[r.priority] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'constellation', label: 'Constellation', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.constellation] = (m[r.constellation] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'state', label: 'State/Zone', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.state] = (m[r.state] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
  ], [])

  const kpis = useMemo(() => [
    { label: 'Total Devices Connected', value: `${(filtered.reduce((a: number, r) => a + r.devicesServed, 0) / 1000000).toFixed(1)}M` },
    { label: 'Avg Bandwidth', value: `${Math.round(filtered.reduce((a: number, r) => a + r.bandwidthMbps, 0) / Math.max(1, filtered.length))} Mbps` },
    { label: 'Coverage Area', value: `${new Set(filtered.map(r => r.state)).size} Zones` },
    { label: 'Total Investment', value: `&#8377;${filtered.reduce((a: number, r) => a + r.investmentCr, 0).toLocaleString()} Cr` },
  ], [filtered])

  const cd = useMemo(() => {
    const grp = (fn: (r: SIOTRecord) => string, val: (r: SIOTRecord) => number) =>
      Object.entries(filtered.reduce((a: Record<string, number>, r) => { a[fn(r)] = (a[fn(r)] || 0) + val(r); return a }, {})).map(([name, value]) => ({ name, value }))
    const barState = grp(r => r.state, r => r.devicesServed)
    const statePie = grp(r => r.state, () => 1)
    const statusPie = grp(r => r.status, () => 1)
    const constellationBar = grp(r => r.constellation, () => 1)
    const priorityPie = grp(r => r.priority, () => 1)
    const totalState = grp(r => r.state, r => r.investmentCr)
    const investStation = filtered.map(r => ({ name: r.groundStation.split('(')[0].trim().slice(0, 16), value: r.investmentCr }))
    const lm = filtered.reduce((a: Record<string, { devicesServed: number; bandwidthMbps: number }>, r) => {
      if (!a[r.state]) a[r.state] = { devicesServed: 0, bandwidthMbps: 0 }
      a[r.state].devicesServed += r.devicesServed; a[r.state].bandwidthMbps += r.bandwidthMbps; return a
    }, {})
    const lineData = Object.entries(lm).map(([name, v]) => ({ name, devices: v.devicesServed, bandwidth: v.bandwidthMbps }))
    return { barState, statePie, statusPie, constellationBar, priorityPie, totalState, investStation, lineData }
  }, [filtered])

  const sc = (s: string) => s === 'Delayed' ? 'bg-red-100 text-red-800' : s === 'Delivered' ? 'bg-green-100 text-green-800' : s === 'In Transit' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'

  return (
    <div className="siot-root p-6 space-y-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics', href: '/logistics' }, { label: 'Satellite IoT' }]} />
      <PageHeader title="Satellite IoT Logistics" description="Monitor satellite ground stations, constellation connectivity, and IoT device deployment across India" />
      <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
      <div className="siot-tabs flex gap-2">{['dashboard', 'registry', 'analytics', 'insights'].map(t => (
        <button key={t} onClick={() => setTab(t)} className={`siot-tab px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? 'bg-violet-600 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
      ))}</div>

      {tab === 'dashboard' && (<>
        <div className="siot-kpi-grid grid grid-cols-4 gap-4">{kpis.map((k, i) => (
          <Card key={i} className="siot-kpi-card"><CardContent className="p-4"><p className="siot-kpi-label text-sm text-muted-foreground">{k.label}</p><p className="siot-kpi-value text-2xl font-bold mt-1" dangerouslySetInnerHTML={{ __html: k.value }} /></CardContent></Card>
        ))}</div>
        <div className="siot-dash-charts grid grid-cols-2 gap-4 mt-4">
          <Card><CardHeader><CardTitle className="siot-chart-title text-sm">Devices Served by Zone</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={cd.barState}><XAxis dataKey="name" fontSize={11} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#7c3aed" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader><CardTitle className="siot-chart-title text-sm">Stations by Zone</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={cd.statePie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label fontSize={10}>{cd.statePie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
      </>)}

      {tab === 'registry' && (<>
        <div className="siot-reg-charts grid grid-cols-2 gap-4 mb-4">
          <Card><CardHeader><CardTitle className="siot-chart-title text-sm">Investment per Ground Station (&#8377; Cr)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={cd.investStation}><XAxis dataKey="name" fontSize={10} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader><CardTitle className="siot-chart-title text-sm">Status Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={cd.statusPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label fontSize={10}>{cd.statusPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
        <div className="siot-records space-y-3">{filtered.map(r => (
          <Card key={r.id} className={`siot-record-card ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : 'border-l-4 border-l-violet-600'}`}><CardContent className="p-4">
            <div className="flex justify-between items-start"><div>
              <p className="font-semibold text-sm">{r.projectId} &#8594; {r.groundStation}</p>
              <p className="text-xs text-muted-foreground mt-1">{r.region} | {r.operator} | {r.constellation}</p>
              <p className="text-xs mt-1">{(r.devicesServed / 1000).toFixed(0)}K devices | {r.bandwidthMbps} Mbps | &#8377;{r.investmentCr} Cr | {r.transitDays}d</p>
            </div><div className="flex gap-1 shrink-0 ml-3">
              <Badge className={sc(r.status)} variant="secondary">{r.status}</Badge>
              <Badge variant="outline" className="text-xs">{r.priority}</Badge>
            </div></div>
            <p className="text-xs text-muted-foreground mt-2">{r.remarks}</p>
          </CardContent></Card>
        ))}</div>
      </>)}

      {tab === 'analytics' && (<div className="siot-analytics grid grid-cols-2 gap-4">
        <Card><CardHeader><CardTitle className="siot-chart-title text-sm">Devices vs Bandwidth by Zone</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><LineChart data={cd.lineData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={10} /><YAxis yAxisId="left" fontSize={11} /><YAxis yAxisId="right" orientation="right" fontSize={11} /><Tooltip /><Legend /><Line yAxisId="left" type="monotone" dataKey="devices" stroke="#7c3aed" name="Devices" /><Line yAxisId="right" type="monotone" dataKey="bandwidth" stroke="#f59e0b" name="Bandwidth (Mbps)" /></LineChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="siot-chart-title text-sm">Total Investment by Zone (&#8377; Cr)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={cd.totalState}><XAxis dataKey="name" fontSize={10} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="siot-chart-title text-sm">Constellation Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={cd.constellationBar}><XAxis dataKey="name" fontSize={8} angle={-30} textAnchor="end" height={60} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#a78bfa" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="siot-chart-title text-sm">Priority Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={cd.priorityPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label fontSize={11}>{cd.priorityPie.map((_, i) => <Cell key={i} fill={COLORS[(i + 2) % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
      </div>)}

      {tab === 'insights' && (<div className="siot-insights grid grid-cols-2 gap-4">
        <Card className="siot-insight-card border-l-4 border-l-violet-600"><CardContent className="p-5">
          <h4 className="siot-insight-title font-semibold text-base">NavIC vs GPS for Indian Logistics</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">India&apos;s NavIC provides better accuracy over Indian subcontinent (5m vs 10m GPS). Essential for IoT logistics tracking in rural and hilly terrain. Government mandate for NavIC adoption in logistics from 2025 onwards.</p>
        </CardContent></Card>
        <Card className="siot-insight-card border-l-4 border-l-violet-600"><CardContent className="p-5">
          <h4 className="siot-insight-title font-semibold text-base">LEO Satellite IoT Revolution</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Low Earth Orbit constellations like Starlink and OneWeb enable sub-50ms latency for IoT. Over 200,000 devices in India expected on LEO networks by 2026, critical for real-time supply chain monitoring.</p>
        </CardContent></Card>
        <Card className="siot-insight-card border-l-4 border-l-violet-600"><CardContent className="p-5">
          <h4 className="siot-insight-title font-semibold text-base">Satellite-Ground Hybrid Networks</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Combining satellite backhaul with ground IoT creates resilient logistics networks with 99.9% uptime even in remote areas. ISRO hybrid terminals deployed at 15 major logistics hubs across India.</p>
        </CardContent></Card>
        <Card className="siot-insight-card border-l-4 border-l-violet-600"><CardContent className="p-5">
          <h4 className="siot-insight-title font-semibold text-base">India Space IoT Target 2030</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">India aims to connect 50 million IoT devices via satellite by 2030. DoS allocated &#8377;10,000 Cr for space-based IoT infrastructure. Public-private partnerships with Nelco, Airtel, and Jio accelerating deployment nationwide.</p>
        </CardContent></Card>
      </div>)}
    </div>
  )
}
