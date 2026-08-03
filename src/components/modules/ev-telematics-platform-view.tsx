'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts'

interface EVTRecord {
  id: string; projectId: string; city: string; operator: string; protocol: string
  fleetSize: number; investmentCr: number; coverageKm: number; status: string; priority: string
  origin: string; destination: string; shipDate: string; transitDays: number; state: string; remarks: string
}

const COLORS = ['#1e3a5f', '#1d4ed8', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe']

const records: EVTRecord[] = [
  { id: 'EVT-001', projectId: 'EVT-001', city: 'Bengaluru', operator: 'Tata Motors Telematics', protocol: 'OBD-II CAN 4G LTE',
    fleetSize: 12000, investmentCr: 480, coverageKm: 950, status: 'Delivered', priority: 'Critical', origin: 'Electronic City Hub', destination: 'Whitefield Depot', shipDate: '2024-01-10', transitDays: 5, state: 'Karnataka',
    remarks: '12,000-vehicle fleet telematics deployment across Bengaluru urban and peri-urban routes, 4G LTE real-time tracking with 30s ping interval and geofence alerts for last-mile EV delivery' },
  { id: 'EVT-002', projectId: 'EVT-002', city: 'Delhi NCR', operator: 'Switch Mobility IoT', protocol: 'J1939 MQTT NB-IoT',
    fleetSize: 18000, investmentCr: 720, coverageKm: 1400, status: 'Delivered', priority: 'Critical', origin: 'Noida Sector 63', destination: 'Gurgaon Udyog Vihar', shipDate: '2024-01-22', transitDays: 7, state: 'Delhi',
    remarks: '18,000 electric bus and three-wheeler telematics covering Delhi NCR, NB-IoT low-power connectivity with 15-minute heartbeat, AIS 140 compliant DVR integration for safety compliance' },
  { id: 'EVT-003', projectId: 'EVT-003', city: 'Mumbai', operator: 'Olectra Telematics Suite', protocol: 'OBD-II UDS 5G SA',
    fleetSize: 9500, investmentCr: 570, coverageKm: 820, status: 'Delivered', priority: 'High', origin: 'Andheri MIDC', destination: 'Navi Mumbai MIDC', shipDate: '2024-02-05', transitDays: 6, state: 'Maharashtra',
    remarks: '9,500 EV fleet across Mumbai metropolitan region, 5G standalone connectivity enabling OTA firmware updates, battery state-of-charge streaming at 5s intervals for real-time range prediction' },
  { id: 'EVT-004', projectId: 'EVT-004', city: 'Hyderabad', operator: 'Mahindra E-Sense', protocol: 'CAN 2.0 LoRaWAN',
    fleetSize: 7500, investmentCr: 340, coverageKm: 680, status: 'Delivered', priority: 'High', origin: 'Hitech City', destination: 'Gachibowli Industrial', shipDate: '2024-02-18', transitDays: 8, state: 'Telangana',
    remarks: 'Hyderabad EV fleet with LoRaWAN mesh for underground parking and tunnel coverage, battery thermal management alerts, driver behavior scoring with AI-powered coaching dashboards' },
  { id: 'EVT-005', projectId: 'EVT-005', city: 'Pune', operator: 'Ather Fleet Connect', protocol: 'BLE Mesh WiFi 6',
    fleetSize: 5500, investmentCr: 220, coverageKm: 450, status: 'In Transit', priority: 'Medium', origin: 'Hinjewadi Tech Park', destination: 'Kharadi IT Hub', shipDate: '2024-04-10', transitDays: 9, state: 'Maharashtra',
    remarks: '5,500 electric two-wheeler fleet for last-mile delivery in Pune IT corridors, BLE mesh connectivity for dense urban areas with sub-meter GPS accuracy using RTK corrections' },
  { id: 'EVT-006', projectId: 'EVT-006', city: 'Chennai', operator: 'TVS iQube Connect', protocol: 'OBD-II Sigfox LPWAN',
    fleetSize: 6800, investmentCr: 310, coverageKm: 520, status: 'Delivered', priority: 'High', origin: 'Ambattur Industrial', destination: 'Sriperumbudur SIPCOT', shipDate: '2024-02-28', transitDays: 7, state: 'Tamil Nadu',
    remarks: '6,800 electric two-wheeler and three-wheeler fleet telematics across Chennai, LPWAN connectivity with 2-year battery life on tracking devices, integrating Tamil Nadu state EV subsidy compliance reporting' },
  { id: 'EVT-007', projectId: 'EVT-007', city: 'Kolkata', operator: 'EMotorad FleetOS', protocol: 'J1939 GSM Edge',
    fleetSize: 4200, investmentCr: 180, coverageKm: 380, status: 'In Transit', priority: 'Medium', origin: 'Salt Lake Sector V', destination: 'Rajarhat New Town', shipDate: '2024-05-05', transitDays: 10, state: 'West Bengal',
    remarks: '4,200 EV fleet in Kolkata metro area, GSM Edge fallback connectivity for consistent coverage, route optimization reducing energy consumption by 18% per trip through regenerative braking coaching' },
  { id: 'EVT-008', projectId: 'EVT-008', city: 'Ahmedabad', operator: 'MG Motor Z-AI', protocol: 'OBD-II CAN 4G VoLTE',
    fleetSize: 3800, investmentCr: 195, coverageKm: 340, status: 'Delivered', priority: 'Medium', origin: 'SG Highway Corridor', destination: 'GIDC Naroda', shipDate: '2024-03-12', transitDays: 6, state: 'Gujarat',
    remarks: '3,800 connected EV fleet across Ahmedabad with AI driver coaching reducing energy waste by 22%, voice-over-LTE emergency calling with automatic crash detection and BMS fire alert relay' },
  { id: 'EVT-009', projectId: 'EVT-009', city: 'Jaipur', operator: 'Hero Electric Sense', protocol: 'BLE 5.0 NB-IoT',
    fleetSize: 3200, investmentCr: 140, coverageKm: 290, status: 'Processing', priority: 'Low', origin: 'Sitapura Industrial', destination: 'Malviya Nagar', shipDate: '2024-06-20', transitDays: 8, state: 'Rajasthan',
    remarks: '3,200 electric two-wheeler fleet in Jaipur smart city zone, BLE proximity unlocking and NB-IoT wide-area tracking, solar-powered charging station integration with automated scheduling based on SoC predictions' },
  { id: 'EVT-010', projectId: 'EVT-010', city: 'Kochi', operator: 'Kerala EV Grid Monitor', protocol: 'MQTT 5G NR',
    fleetSize: 2600, investmentCr: 160, coverageKm: 210, status: 'Delivered', priority: 'Medium', origin: 'Kakkanad Infopark', destination: 'Vytilla Mobility Hub', shipDate: '2024-03-28', transitDays: 7, state: 'Kerala',
    remarks: '2,600 EV telematics deployment in Kochi with V2G-ready communication, real-time grid load balancing alerts when 200+ vehicles charge simultaneously, waterfall charging management reducing peak demand by 35%' },
  { id: 'EVT-011', projectId: 'EVT-011', city: 'Lucknow', operator: 'Yulu Analytics Pro', protocol: 'CAN LoRa GPS LBS',
    fleetSize: 4500, investmentCr: 200, coverageKm: 360, status: 'In Transit', priority: 'High', origin: 'Gomti Nagar', destination: 'Aminabad Old City', shipDate: '2024-05-15', transitDays: 12, state: 'Uttar Pradesh',
    remarks: '4,500 shared EV fleet telematics across Lucknow, hybrid LoRa and GPS+LBS positioning for 95% location accuracy, station balancing algorithms reducing docking wait times by 40% during peak hours' },
  { id: 'EVT-012', projectId: 'EVT-012', city: 'Indore', operator: 'TCS EV Platform', protocol: 'OBD-II 4G MQTT',
    fleetSize: 2100, investmentCr: 95, coverageKm: 180, status: 'Delivered', priority: 'Low', origin: 'Super Corridor', destination: 'Bhawarkuan Junction', shipDate: '2024-04-08', transitDays: 9, state: 'Madhya Pradesh',
    remarks: '2,100 EV fleet telematics with TCS digital twin integration, predictive maintenance reducing breakdowns by 60%, battery degradation modeling enabling 15% longer battery pack warranty optimization' },
  { id: 'EVT-013', projectId: 'EVT-013', city: 'Guwahati', operator: 'NE Smart EV Connect', protocol: 'NB-IoT GSM Satellite',
    fleetSize: 1800, investmentCr: 110, coverageKm: 250, status: 'Delayed', priority: 'Medium', origin: 'Dispur Capital', destination: 'Ambari ISBT', shipDate: '2024-06-01', transitDays: 15, state: 'Assam',
    remarks: '1,800 EV fleet in Northeast India with satellite fallback for connectivity in hilly terrain, multi-modal transport telematics covering river ferry routes, integration with Assam state transport authority dashboard' },
  { id: 'EVT-014', projectId: 'EVT-014', city: 'Bhubaneswar', operator: 'Odisha Green Mobility', protocol: 'OBD-II CAN 5G D2D',
    fleetSize: 2900, investmentCr: 150, coverageKm: 320, status: 'Processing', priority: 'Medium', origin: 'Info Valley Patia', destination: 'CRP Square Hub', shipDate: '2024-07-05', transitDays: 11, state: 'Odisha',
    remarks: '2,900 EV fleet with device-to-device communication for platoon formation, V2V cooperative driving reducing air resistance energy loss by 12%, Odisha mining corridor coverage with dust-proof IP67 telematics hardware' },
]

export default function EVTelematicsPlatformView() {
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
      Object.entries(activeFilters).every(([k, vs]) => vs.length === 0 || vs.includes(String(r[k as keyof EVTRecord])))
    )
    return result
  }, [searchQuery, activeFilters])

  const filterGroups = useMemo(() => [
    { key: 'status', label: 'Status', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.status] = (m[r.status] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'priority', label: 'Priority', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.priority] = (m[r.priority] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'protocol', label: 'Protocol', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.protocol] = (m[r.protocol] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'state', label: 'State', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.state] = (m[r.state] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
  ], [])

  const kpis = useMemo(() => [
    { label: 'Total Fleet Monitored', value: `${filtered.reduce((a: number, r) => a + r.fleetSize, 0).toLocaleString()} Vehicles` },
    { label: 'Total Coverage', value: `${filtered.reduce((a: number, r) => a + r.coverageKm, 0).toLocaleString()} km` },
    { label: 'Total Investment', value: `&#8377;${filtered.reduce((a: number, r) => a + r.investmentCr, 0).toLocaleString()} Cr` },
    { label: 'Avg Cost/Vehicle', value: `&#8377;${(filtered.reduce((a: number, r) => a + r.investmentCr, 0) * 100 / Math.max(1, filtered.reduce((a: number, r) => a + r.fleetSize, 0))).toFixed(0)}K` },
  ], [filtered])

  const cd = useMemo(() => {
    const grp = (fn: (r: EVTRecord) => string, val: (r: EVTRecord) => number) =>
      Object.entries(filtered.reduce((a: Record<string, number>, r) => { a[fn(r)] = (a[fn(r)] || 0) + val(r); return a }, {})).map(([name, value]) => ({ name, value }))
    const barState = grp(r => r.state, r => r.fleetSize)
    const pieState = grp(r => r.state, () => 1)
    const statusPie = grp(r => r.status, () => 1)
    const protoBar = grp(r => r.protocol, () => 1)
    const priorityPie = grp(r => r.priority, () => 1)
    const totalInvest = grp(r => r.state, r => r.investmentCr)
    const effData = filtered.map(r => ({ name: r.city.slice(0, 10), value: +(r.coverageKm / r.fleetSize * 1000).toFixed(1) }))
    const lm = filtered.reduce((a: Record<string, { fleetSize: number; coverageKm: number }>, r) => {
      if (!a[r.state]) a[r.state] = { fleetSize: 0, coverageKm: 0 }
      a[r.state].fleetSize += r.fleetSize; a[r.state].coverageKm += r.coverageKm; return a
    }, {})
    const lineData = Object.entries(lm).map(([name, v]) => ({ name, fleetSize: v.fleetSize, coverageKm: v.coverageKm }))
    return { barState, pieState, statusPie, protoBar, priorityPie, totalInvest, effData, lineData }
  }, [filtered])

  const sc = (s: string) => s === 'Delayed' ? 'bg-red-100 text-red-800' : s === 'Delivered' ? 'bg-green-100 text-green-800' : s === 'In Transit' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'

  return (
    <div className="evt-root p-6 space-y-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics', href: '/logistics' }, { label: 'EV Telematics' }]} />
      <PageHeader title="EV Telematics Platform" description="Monitor electric vehicle fleet telematics, real-time GPS tracking, battery management systems, protocol connectivity, and smart charging network optimization across India" />
      <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
      <div className="evt-tabs flex gap-2">{['dashboard', 'registry', 'analytics', 'insights'].map(t => (
        <button key={t} onClick={() => setTab(t)} className={`evt-tab px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? 'bg-blue-900 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
      ))}</div>

      {tab === 'dashboard' && (<>
        <div className="evt-kpi-grid grid grid-cols-4 gap-4">{kpis.map((k, i) => (
          <Card key={i} className="evt-kpi-card"><CardContent className="p-4"><p className="evt-kpi-label text-sm text-muted-foreground">{k.label}</p><p className="evt-kpi-value text-2xl font-bold mt-1" dangerouslySetInnerHTML={{ __html: k.value }} /></CardContent></Card>
        ))}</div>
        <div className="evt-dash-charts grid grid-cols-2 gap-4 mt-4">
          <Card><CardHeader><CardTitle className="evt-chart-title text-sm">Fleet Size by State (Vehicles)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={cd.barState}><XAxis dataKey="name" fontSize={11} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#1e3a5f" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader><CardTitle className="evt-chart-title text-sm">Deployments by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={cd.pieState} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label fontSize={10}>{cd.pieState.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
      </>)}

      {tab === 'registry' && (<>
        <div className="evt-reg-charts grid grid-cols-2 gap-4 mb-4">
          <Card><CardHeader><CardTitle className="evt-chart-title text-sm">Coverage Density (km per 1000 Vehicles)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={cd.effData}><XAxis dataKey="name" fontSize={10} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#1d4ed8" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader><CardTitle className="evt-chart-title text-sm">Status Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={cd.statusPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label fontSize={10}>{cd.statusPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
        <div className="evt-records space-y-3">{filtered.map(r => (
          <Card key={r.id} className={`evt-record-card ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : 'border-l-4 border-l-blue-900'}`}><CardContent className="p-4">
            <div className="flex justify-between items-start"><div>
              <p className="font-semibold text-sm">{r.projectId} &#8594; {r.city}</p>
              <p className="text-xs text-muted-foreground mt-1">{r.operator} | {r.protocol} | {r.state}</p>
              <p className="text-xs mt-1">{r.fleetSize.toLocaleString()} vehicles | {r.coverageKm} km coverage | &#8377;{r.investmentCr} Cr | {r.transitDays}d transit</p>
            </div><div className="flex gap-1 shrink-0 ml-3">
              <Badge className={sc(r.status)} variant="secondary">{r.status}</Badge>
              <Badge variant="outline" className="text-xs">{r.priority}</Badge>
            </div></div>
            <p className="text-xs text-muted-foreground mt-2">{r.remarks}</p>
          </CardContent></Card>
        ))}</div>
      </>)}

      {tab === 'analytics' && (<div className="evt-analytics grid grid-cols-2 gap-4">
        <Card><CardHeader><CardTitle className="evt-chart-title text-sm">Fleet Size vs Coverage Area</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><LineChart data={cd.lineData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={10} /><YAxis yAxisId="left" fontSize={11} /><YAxis yAxisId="right" orientation="right" fontSize={11} /><Tooltip /><Legend /><Line yAxisId="left" type="monotone" dataKey="fleetSize" stroke="#1e3a5f" name="Fleet Size" /><Line yAxisId="right" type="monotone" dataKey="coverageKm" stroke="#2563eb" name="Coverage km" /></LineChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="evt-chart-title text-sm">Total Investment by State (&#8377; Cr)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={cd.totalInvest}><XAxis dataKey="name" fontSize={10} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="evt-chart-title text-sm">Protocol Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={cd.protoBar}><XAxis dataKey="name" fontSize={9} angle={-25} textAnchor="end" height={55} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#60a5fa" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="evt-chart-title text-sm">Priority Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={cd.priorityPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label fontSize={11}>{cd.priorityPie.map((_, i) => <Cell key={i} fill={COLORS[(i + 2) % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
      </div>)}

      {tab === 'insights' && (<div className="evt-insights grid grid-cols-2 gap-4">
        <Card className="evt-insight-card border-l-4 border-l-blue-900"><CardContent className="p-5">
          <h4 className="evt-insight-title font-semibold text-base">India&apos;s 50M EV Target by 2030</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">India aims for 50 million electric vehicles by 2030 under FAME III and state EV policies. Every EV requires real-time telematics for safety compliance, battery warranty validation, and insurance telemetry. This creates a &#8377;15,000 Cr telematics market serving OEMs, fleet operators, and shared mobility platforms.</p>
        </CardContent></Card>
        <Card className="evt-insight-card border-l-4 border-l-blue-900"><CardContent className="p-5">
          <h4 className="evt-insight-title font-semibold text-base">AIS 140 Mandate Driving Compliance</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">AIS 140 standard mandates GPS tracking and emergency panic buttons in all commercial EVs. Non-compliance risks &#8377;1 Lakh fine per vehicle. Telematics platforms must support IRNSS/GPS dual-constellation, 24x7 NOC monitoring, and integrate with state Vahan databases for automated RTO compliance reporting.</p>
        </CardContent></Card>
        <Card className="evt-insight-card border-l-4 border-l-blue-900"><CardContent className="p-5">
          <h4 className="evt-insight-title font-semibold text-base">Battery Swapping Telematics Challenge</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">India&apos;s battery swapping ecosystem requires unique telematics: tracking battery pack cycles across multiple vehicles, SoH degradation curves per swap station, thermal runaway prediction during high-utilization periods, and interoperability protocols between Ola Battery, Sun Mobility, and Amara Raja swap networks.</p>
        </CardContent></Card>
        <Card className="evt-insight-card border-l-4 border-l-blue-900"><CardContent className="p-5">
          <h4 className="evt-insight-title font-semibold text-base">V2G and Smart Grid Integration</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Vehicle-to-Grid telematics enables bidirectional energy flow from EV batteries to grid during peak demand. India&apos;s 2030 V2G potential is 15 GW from 5 million connected EVs. Telematics must handle ISO 15118 protocol, smart metering data exchange, and real-time electricity pricing signals for optimal charging-discharging schedules.</p>
        </CardContent></Card>
      </div>)}
    </div>
  )
}
