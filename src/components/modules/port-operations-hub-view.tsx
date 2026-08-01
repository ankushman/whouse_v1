import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#0ea5e9', '#0369a1', '#0284c7', '#0c4a6e', '#38bdf8', '#075985', '#082f49', '#e0f2fe']
const PRODUCTS = ['Container Vessel Ultra', 'Bulk Carrier Premiere', 'Tanker Crude Express', 'RoRo Pacific Ferry', 'LNG Methane Pioneer', 'General Cargo Meridian', 'Reefer Atlantic Fresh', 'Car Carrier Ocean Breeze']
const ARTISANS = ['Nhava Sheva JNPT MH', 'Mundra Port Gujarat GJ', 'Chennai Container Port TN', 'Kandla Port Gujarat GJ', 'Kolkata Haldia WB', 'Tuticorin VOC Port TN', 'Cochin Port Kerala KL', 'Ennore Kamarajar TN']
const STATUSES = ['Port Authority Certified', 'Berth Allocation QC', 'Vessel Turnaround Test', 'Container Throughput Check', 'Crane Operations Audit', 'ISPS Compliance Test']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-sky-100 text-sky-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="w-24 h-2 bg-sky-200 rounded-full overflow-hidden"><div className="h-full bg-sky-700 rounded-full" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ label, value, size = 80 }: { label: string; value: number; size?: number }) => {
  const r = (size - 12) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e0f2fe" strokeWidth="6" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={COLORS[0]} strokeWidth="6" strokeDasharray={`${c}`} strokeDashoffset={c - (value / 100) * c} strokeLinecap="round" />
      </svg>
      <span className="text-xs font-medium" style={{ color: COLORS[0] }}>{label} {value}%</span>
    </div>
  )
}

const KpiTile = ({ label, value }: { label: string; value: string | number }) => (
  <Card className="p-4"><p className="text-sm text-muted-foreground">{label}</p><p className="text-2xl font-bold mt-1">{value}</p></Card>
)

const ValueTile = ({ label, value }: { label: string; value: string }) => (
  <Card className="p-4 border-l-4" style={{ borderLeftColor: COLORS[2] }}><p className="text-sm text-muted-foreground">{label}</p><p className="text-lg font-semibold mt-1" style={{ color: COLORS[2] }}>{value}</p></Card>
)

const genRecords = (offset: number) =>
  Array.from({ length: 20 }, (_, i) => ({
    id: `POH-${String(offset + i + 1).padStart(4, '0')}`,
    port: ARTISANS[(offset + i) % ARTISANS.length], vessel: PRODUCTS[(offset + i) % PRODUCTS.length],
    status: STATUSES[(offset + i) % STATUSES.length], qty: ri(1, 6, ((offset + i) * 19) % 6) + 1,
    cost: ri(50000, 500000, ((offset + i) * 11307) % 450000) + 50000,
    date: new Date(2024, ((offset + i) % 12), ri(1, 28, (offset + i) % 28)).toISOString().slice(0, 10),
  }))

const pohrecords = [
  { id: 'POH-0001', port: 'Nhava Sheva JNPT MH', vessel: 'Container Vessel Ultra', status: 'Port Authority Certified', qty: 3, cost: 480000, date: '2024-01-08' },
  { id: 'POH-0002', port: 'Mundra Port Gujarat GJ', vessel: 'Bulk Carrier Premiere', status: 'Berth Allocation QC', qty: 2, cost: 350000, date: '2024-01-21' },
  { id: 'POH-0003', port: 'Chennai Container Port TN', vessel: 'Tanker Crude Express', status: 'Vessel Turnaround Test', qty: 5, cost: 180000, date: '2024-02-03' },
  { id: 'POH-0004', port: 'Kandla Port Gujarat GJ', vessel: 'RoRo Pacific Ferry', status: 'Container Throughput Check', qty: 4, cost: 280000, date: '2024-02-16' },
  { id: 'POH-0005', port: 'Kolkata Haldia WB', vessel: 'LNG Methane Pioneer', status: 'Crane Operations Audit', qty: 2, cost: 500000, date: '2024-03-01' },
  { id: 'POH-0006', port: 'Tuticorin VOC Port TN', vessel: 'General Cargo Meridian', status: 'ISPS Compliance Test', qty: 3, cost: 220000, date: '2024-03-14' },
  { id: 'POH-0007', port: 'Cochin Port Kerala KL', vessel: 'Reefer Atlantic Fresh', status: 'Port Authority Certified', qty: 6, cost: 150000, date: '2024-03-27' },
  { id: 'POH-0008', port: 'Ennore Kamarajar TN', vessel: 'Car Carrier Ocean Breeze', status: 'Berth Allocation QC', qty: 3, cost: 420000, date: '2024-04-09' },
  { id: 'POH-0009', port: 'Nhava Sheva JNPT MH', vessel: 'Container Vessel Ultra', status: 'Vessel Turnaround Test', qty: 4, cost: 160000, date: '2024-04-22' },
  { id: 'POH-0010', port: 'Mundra Port Gujarat GJ', vessel: 'Bulk Carrier Premiere', status: 'Container Throughput Check', qty: 2, cost: 470000, date: '2024-05-05' },
  { id: 'POH-0011', port: 'Chennai Container Port TN', vessel: 'Tanker Crude Express', status: 'Crane Operations Audit', qty: 5, cost: 90000, date: '2024-05-18' },
  { id: 'POH-0012', port: 'Kandla Port Gujarat GJ', vessel: 'RoRo Pacific Ferry', status: 'ISPS Compliance Test', qty: 3, cost: 310000, date: '2024-05-31' },
  { id: 'POH-0013', port: 'Kolkata Haldia WB', vessel: 'LNG Methane Pioneer', status: 'Port Authority Certified', qty: 4, cost: 130000, date: '2024-06-13' },
  { id: 'POH-0014', port: 'Tuticorin VOC Port TN', vessel: 'General Cargo Meridian', status: 'Berth Allocation QC', qty: 2, cost: 450000, date: '2024-06-26' },
  { id: 'POH-0015', port: 'Cochin Port Kerala KL', vessel: 'Reefer Atlantic Fresh', status: 'Vessel Turnaround Test', qty: 6, cost: 110000, date: '2024-07-09' },
  { id: 'POH-0016', port: 'Ennore Kamarajar TN', vessel: 'Car Carrier Ocean Breeze', status: 'Container Throughput Check', qty: 3, cost: 390000, date: '2024-07-22' },
  { id: 'POH-0017', port: 'Nhava Sheva JNPT MH', vessel: 'Container Vessel Ultra', status: 'Crane Operations Audit', qty: 4, cost: 200000, date: '2024-08-04' },
  { id: 'POH-0018', port: 'Mundra Port Gujarat GJ', vessel: 'Bulk Carrier Premiere', status: 'ISPS Compliance Test', qty: 2, cost: 440000, date: '2024-08-17' },
  { id: 'POH-0019', port: 'Chennai Container Port TN', vessel: 'Tanker Crude Express', status: 'Port Authority Certified', qty: 5, cost: 75000, date: '2024-08-30' },
  { id: 'POH-0020', port: 'Kandla Port Gujarat GJ', vessel: 'RoRo Pacific Ferry', status: 'Berth Allocation QC', qty: 3, cost: 340000, date: '2024-09-12' },
]

export default function PortOperationsHubView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})

  const allRecords = [...pohrecords, ...genRecords(21), ...genRecords(41)]

  const filteredRecords = useMemo(() => {
    if (!searchQuery && Object.keys(activeFilters).every(k => !activeFilters[k].length)) return allRecords
    const sq = searchQuery.toLowerCase()
    return allRecords.filter(r => { if (sq && !r.id.toLowerCase().includes(sq) && !r.vessel.toLowerCase().includes(sq)) return false; return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string)); })
  }, [searchQuery, activeFilters, allRecords])

  const filterGroups = [
    { key: 'vessel', label: 'Vessel', options: PRODUCTS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.vessel === p).length })) },
    { key: 'port', label: 'Port', options: ARTISANS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.port === p).length })) },
  ]

  const trendData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m, i) => ({ month: m, shipments: ri(2, 12, allRecords.length * 0.10 + i * 2) }))
  const portChart = ARTISANS.map(p => ({ name: p.split(' ').slice(0, 2).join(' '), volume: allRecords.filter(r => r.port === p).reduce((s, r) => s + r.qty, 0) }))
  const statusPie = STATUSES.map(s => ({ name: s, value: allRecords.filter(r => r.status === s).length }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="poh-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Port Operations' }]} />
      <PageHeader title="Port Operations Hub" description="Indian port operations vessel tracking and cargo throughput monitoring with Port Authority certification berth allocation quality control vessel turnaround testing container throughput verification crane operations audit and ISPS security compliance testing across Nhava Sheva JNPT Mundra Chennai Kolkata and Cochin" />
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="bg-sky-100">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <KpiTile label="Total Movements" value={allRecords.length} />
            <KpiTile label="Vessel Types" value={PRODUCTS.length} />
            <KpiTile label="Active Ports" value={ARTISANS.length} />
            <KpiTile label="Avg Cost" value={`₹${Math.round(allRecords.reduce((s, r) => s + r.cost, 0) / allRecords.length).toLocaleString()}`}/>
          </div>
          <div className="grid grid-cols-6 gap-4">
            <HealthRing label="Authority" value={95} />
            <HealthRing label="Berth" value={88} />
            <HealthRing label="Turn" value={92} />
            <HealthRing label="TEU" value={86} />
            <HealthRing label="Crane" value={90} />
            <HealthRing label="ISPS" value={97} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Major Ports" value="12 Active" />
            <ValueTile label="Annual TEU" value="8.2 Million" />
            <ValueTile label="Draft Depth" value="18.5 Metres" />
            <ValueTile label="Cargo Volume" value="1.2 Billion MT" />
          </div>
        </TabsContent>
        <TabsContent value="shipments" className="space-y-6">
          <SearchFilterToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onClearSearch={() => setSearchQuery('')}
            activeFilters={activeFilters}
            filterGroups={filterGroups}
            onToggleFilter={(group, val) => setActiveFilters(prev => ({ ...prev, [group]: prev[group]?.includes(val) ? prev[group].filter(v => v !== val) : [...(prev[group] || []), val] }))}
            onClearAllFilters={() => setActiveFilters({})}
            totalItems={allRecords.length}
            filteredCount={filteredRecords.length}
            onRefresh={() => {}}
            placeholder="Search port vessel movements..."
          />
          <div className="rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-sky-100">
                <tr>
                  <th className="p-3 text-left font-medium">ID</th>
                  <th className="p-3 text-left font-medium">Vessel</th>
                  <th className="p-3 text-left font-medium">Port</th>
                  <th className="p-3 text-left font-medium">Status</th>
                  <th className="p-3 text-left font-medium">Qty</th>
                  <th className="p-3 text-left font-medium">Cost</th>
                  <th className="p-3 text-left font-medium">Cost Bar</th>
                  <th className="p-3 text-left font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map(record => (
                  <tr key={record.id} className="border-t hover:bg-sky-50/50">
                    <td className="p-3 font-mono text-xs">{record.id}</td>
                    <td className="p-3"><ProductBadge name={record.vessel} /></td>
                    <td className="p-3">{record.port}</td>
                    <td className="p-3"><StatusBadge status={record.status} /></td>
                    <td className="p-3">{record.qty} {['calls', 'berths', 'cycles', 'moves'][parseInt(record.id.slice(4)) % 4]}</td>
                    <td className="p-3 font-mono">₹{record.cost.toLocaleString()}</td>
                    <td className="p-3"><CostBar cost={record.cost} max={maxCost} /></td>
                    <td className="p-3">{record.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle>Movement Trend</CardTitle></CardHeader>
              <CardContent>
                <LineChart width={500} height={300} data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="shipments" stroke={COLORS[0]} strokeWidth={2} />
                </LineChart>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Port Volume</CardTitle></CardHeader>
              <CardContent>
                <BarChart width={500} height={300} data={portChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="volume" fill={COLORS[0]}>
                    {portChart.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader><CardTitle>Status Distribution</CardTitle></CardHeader>
            <CardContent>
              <PieChart width={500} height={300}>
                <Pie data={statusPie} cx="50%" cy="50%" outerRadius={100} dataKey="value" label>
                  {statusPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle>Nhava Sheva JNPT — India Busiest Container Gateway</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">Nhava Sheva Jawaharlal Nehru Port Trust located on the Konkan coast of Maharashtra state stands as India largest container port by throughput volume handling approximately five million TEU annually across its three operational container terminals including the Jawaharlal Nehru Port Container Terminal operated by the port authority the Nhava Sheva International Container Terminal operated by DP World and the GTI Digital Container Terminal operated by APM Terminals where the port serves as the primary maritime gateway for the Indian subcontinent connecting the vast domestic manufacturing and agricultural supply chains of western and northern India with global shipping routes through the Arabian Sea and the Suez Canal corridor where the JNPT port infrastructure includes fifteen deep-draft container berths with a total quay length exceeding four thousand metres capable of accommodating the latest generation of ultra-large container vessels of twenty-two thousand TEU capacity and above with current maximum permissible vessel draft of fourteen point five metres under normal tidal conditions and fifteen point five metres during spring high tide periods where the port operations hub manages an average daily throughput of approximately fourteen thousand container movements across import export and transshipment categories with peak single-day throughput records exceeding eighteen thousand TEU movements where the port authority certification process ensures all operational berths and terminals maintain compliance with the International Ship and Port Facility Security Code ISPS and the International Maritime Organization Safe Container Convention standards covering vessel traffic management berth allocation scheduling container gate operations and dangerous goods handling protocols across all fifteen operational berths where the berth allocation quality control framework uses a dynamic scheduling algorithm that optimizes berth assignment based on vessel size cargo type priority classification and predicted dwell time requirements achieving an average berth utilization rate of eighty-seven percent across the three container terminals with turnaround times averaging eighteen hours for container vessels and twelve hours for feeder vessels.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Vessel Turnaround Testing and Container Throughput Monitoring</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The vessel turnaround testing and container throughput monitoring protocols establish the operational efficiency measurement framework for all major Indian ports under the Ministry of Ports Shipping and Waterways where the vessel turnaround test measures the total elapsed time from vessel arrival at the port anchorage to vessel departure from the berth after completing all cargo operations including pilotage time anchorage waiting time berth approach time mooring operations cargo handling time and unmooring departure sequence where the target turnaround time for Nhava Sheva JNPT is eighteen hours for mainline container vessels and twelve hours for feeder vessels while the national average across twelve major ports is twenty-six hours with significant variation between ports ranging from fifteen hours at Mundra Port operated by Adani Ports to forty-eight hours at Kolkata Haldia where the container throughput check monitors the real-time flow rate of container movements through the port gate system measuring the number of import containers cleared through customs examination and gate-out processes per working day and the number of export containers received through gate-in and loaded onto vessels per working day where the throughput rate is benchmarked against the designed terminal capacity confirming the actual throughput remains within ninety to ninety-five percent of the rated terminal capacity without sustained periods of overcapacity operation that would indicate infrastructure strain or sustained periods of undercapacity operation that would indicate investment inefficiency where the crane operations audit evaluates the productivity of the shore-based container cranes including quay cranes and mobile harbour cranes measuring the average number of container moves per crane hour as the primary productivity metric with the benchmark standard of twenty-five moves per crane hour for quay cranes and eighteen moves per hour for mobile harbour cranes where the audit also evaluates crane equipment availability confirming the fleet-wide crane availability rate exceeds ninety-two percent and the mean time between failures exceeds three hundred sixty hours of crane operation ensuring reliable and consistent container handling capacity across all operational shifts.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Crane Operations Audit and ISPS Compliance Testing</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The crane operations audit and International Ship and Port Facility Security ISPS compliance testing protocols provide the equipment safety and maritime security quality assurance framework for Indian port operations under the regulatory oversight of the Indian Maritime Authority and the Directorate General of Shipping where the crane operations audit comprehensively evaluates the operational safety and productivity of all container handling cranes deployed at the eight monitored ports including electric quay cranes rubber-tyred gantry cranes rail-mounted gantry cranes and mobile harbour cranes where the audit covers four primary assessment dimensions including the crane structural integrity inspection that verifies the load-bearing structural components meet the design specifications without fatigue cracking corrosion damage or weld degradation using non-destructive testing methods including ultrasonic thickness measurement magnetic particle inspection and dye penetrant testing on critical weld joints the crane electrical systems verification that confirms all electrical drive systems braking systems control systems and safety interlocks function within specified parameters under both normal and emergency operating conditions the crane operator proficiency assessment that evaluates each licensed crane operator against the standard proficiency criteria including load handling accuracy cycle time performance emergency procedure response and communication protocol compliance and the crane maintenance record audit that confirms all scheduled preventive maintenance tasks have been completed within the specified maintenance intervals with documented evidence of replacement parts inspections lubrication and calibration activities where the ISPS compliance test evaluates the port facility security measures against the requirements of the International Code for the Security of Ships and Port Facilities covering the ship and port facility security plan implementation the security officer qualifications and training the access control systems including perimeter fencing gate access controls identification card systems and visitor management protocols the security surveillance systems including CCTV coverage alarm systems security lighting and security patrol procedures and the security incident response procedures including threat assessment protocols communication escalation chains and coordination with the Indian Coast Guard and maritime security forces.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Mundra Port Gujarat Expansion and Coastal Shipping Growth</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The Mundra Port operated by Adani Ports and Special Economic Zone represents the largest private sector port development in India located on the Gulf of Kutch in Gujarat state with a current operational capacity exceeding six million TEU annually across fourteen container berths and dedicated bulk coal terminal liquid terminal and multipurpose terminals serving as the primary maritime gateway for the industrial and agricultural supply chains of northern and western India where the port has achieved the fastest vessel turnaround times among all Indian major ports at fifteen hours average for container vessels through the deployment of advanced berthing optimization algorithms automated gate processing systems and integrated yard management platforms that coordinate container movements from gate to berth in real time where the coastal shipping growth initiative under the Sagarmala Programme of the Ministry of Ports Shipping and Waterways has identified twelve additional minor ports and coastal terminals across the Indian coastline for potential development as feeder hubs and regional cargo consolidation centres connecting the existing twelve major ports with the growing RoRo vehicle transport route between Chennai Ennore and Kolkata Haldia the coastal bulk cargo routes between Kandla and Tuticorin and the emerging LNG terminal network connecting Cochin Kochi with the eastern seaboard gas distribution infrastructure where the RoRo Pacific Ferry service connecting Chennai with Kolkata via the coastal shipping route has demonstrated thirty percent cost reduction over equivalent road transport for vehicle movement with average transit time of seventy-two hours compared to ninety-six hours for road transport while reducing carbon emissions by approximately forty percent per vehicle transported where the car carrier segment has shown particular growth driven by the expansion of Indian automotive manufacturing capacity with Chennai port handling over three hundred thousand vehicle units annually through the dedicated car carrier berths connecting Indian automobile manufacturers including Maruti Suzuki Hyundai Tata Motors and Mahindra with export markets in the Middle East Africa Southeast Asia and Europe.</p></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}



