import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#065f46', '#047857', '#059669', '#10b981', '#34d399', '#064e3b', '#022c22', '#ecfdf5']
const PRODUCTS = ['NH48 Mumbai Delhi', 'NH44 Srinagar Kanyakumari', 'NH27 Gujarat Assam', 'NH6 Kolkata Mumbai', 'NH4 Mumbai Chennai', 'NH7 Varanasi Kanyakumari', 'NH5 Jharkhand Odisha', 'NH2 Delhi Kolkata']
const ARTISANS = ['Nagpur Freight Hub MH', 'Kolkata Port Corridor WB', 'Chennai Gateway Terminal TN', 'Mumbai Western Corridor MH', 'Delhi Northern Hub DL', 'Bangalore Southern Hub KA', 'Hyderabad Central Hub TS', 'Ahmedabad Western Link GJ']
const STATUSES = ['NHAI Lane Certified', 'Toll Plaza Compliance QC', 'Axle Load Weight Test', 'Route Optimization Verified', 'ETC Fastag Integration Check', 'Safety Audit Compliance']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="w-24 h-2 bg-emerald-200 rounded-full overflow-hidden"><div className="h-full bg-emerald-700 rounded-full" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ label, value, size = 80 }: { label: string; value: number; size?: number }) => {
  const r = (size - 12) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#ecfdf5" strokeWidth="6" />
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
    id: `FLC-${String(offset + i + 1).padStart(4, '0')}`,
    hub: ARTISANS[(offset + i) % ARTISANS.length], lane: PRODUCTS[(offset + i) % PRODUCTS.length],
    status: STATUSES[(offset + i) % STATUSES.length], qty: ri(20, 500, ((offset + i) * 19) % 480) + 20,
    cost: ri(50000, 800000, ((offset + i) * 11307) % 750000) + 50000,
    date: new Date(2024, ((offset + i) % 12), ri(1, 28, (offset + i) % 28)).toISOString().slice(0, 10),
  }))

const freightrecords = [
  { id: 'FLC-0001', hub: 'Nagpur Freight Hub MH', lane: 'NH48 Mumbai Delhi', status: 'NHAI Lane Certified', qty: 320, cost: 750000, date: '2024-01-04' },
  { id: 'FLC-0002', hub: 'Kolkata Port Corridor WB', lane: 'NH44 Srinagar Kanyakumari', status: 'Toll Plaza Compliance QC', qty: 180, cost: 620000, date: '2024-01-17' },
  { id: 'FLC-0003', hub: 'Chennai Gateway Terminal TN', lane: 'NH27 Gujarat Assam', status: 'Axle Load Weight Test', qty: 450, cost: 480000, date: '2024-01-30' },
  { id: 'FLC-0004', hub: 'Mumbai Western Corridor MH', lane: 'NH6 Kolkata Mumbai', status: 'Route Optimization Verified', qty: 280, cost: 700000, date: '2024-02-12' },
  { id: 'FLC-0005', hub: 'Delhi Northern Hub DL', lane: 'NH4 Mumbai Chennai', status: 'ETC Fastag Integration Check', qty: 500, cost: 380000, date: '2024-02-25' },
  { id: 'FLC-0006', hub: 'Bangalore Southern Hub KA', lane: 'NH7 Varanasi Kanyakumari', status: 'Safety Audit Compliance', qty: 220, cost: 780000, date: '2024-03-09' },
  { id: 'FLC-0007', hub: 'Hyderabad Central Hub TS', lane: 'NH5 Jharkhand Odisha', status: 'NHAI Lane Certified', qty: 350, cost: 550000, date: '2024-03-22' },
  { id: 'FLC-0008', hub: 'Ahmedabad Western Link GJ', lane: 'NH2 Delhi Kolkata', status: 'Toll Plaza Compliance QC', qty: 160, cost: 800000, date: '2024-04-04' },
  { id: 'FLC-0009', hub: 'Nagpur Freight Hub MH', lane: 'NH48 Mumbai Delhi', status: 'Axle Load Weight Test', qty: 420, cost: 420000, date: '2024-04-17' },
  { id: 'FLC-0010', hub: 'Kolkata Port Corridor WB', lane: 'NH44 Srinagar Kanyakumari', status: 'Route Optimization Verified', qty: 290, cost: 680000, date: '2024-04-30' },
  { id: 'FLC-0011', hub: 'Chennai Gateway Terminal TN', lane: 'NH27 Gujarat Assam', status: 'ETC Fastag Integration Check', qty: 380, cost: 500000, date: '2024-05-13' },
  { id: 'FLC-0012', hub: 'Mumbai Western Corridor MH', lane: 'NH6 Kolkata Mumbai', status: 'Safety Audit Compliance', qty: 240, cost: 720000, date: '2024-05-26' },
  { id: 'FLC-0013', hub: 'Delhi Northern Hub DL', lane: 'NH4 Mumbai Chennai', status: 'NHAI Lane Certified', qty: 460, cost: 400000, date: '2024-06-08' },
  { id: 'FLC-0014', hub: 'Bangalore Southern Hub KA', lane: 'NH7 Varanasi Kanyakumari', status: 'Toll Plaza Compliance QC', qty: 200, cost: 760000, date: '2024-06-21' },
  { id: 'FLC-0015', hub: 'Hyderabad Central Hub TS', lane: 'NH5 Jharkhand Odisha', status: 'Axle Load Weight Test', qty: 340, cost: 580000, date: '2024-07-04' },
  { id: 'FLC-0016', hub: 'Ahmedabad Western Link GJ', lane: 'NH2 Delhi Kolkata', status: 'Route Optimization Verified', qty: 270, cost: 660000, date: '2024-07-17' },
  { id: 'FLC-0017', hub: 'Nagpur Freight Hub MH', lane: 'NH48 Mumbai Delhi', status: 'ETC Fastag Integration Check', qty: 490, cost: 350000, date: '2024-07-30' },
  { id: 'FLC-0018', hub: 'Kolkata Port Corridor WB', lane: 'NH44 Srinagar Kanyakumari', status: 'Safety Audit Compliance', qty: 310, cost: 600000, date: '2024-08-12' },
  { id: 'FLC-0019', hub: 'Chennai Gateway Terminal TN', lane: 'NH27 Gujarat Assam', status: 'NHAI Lane Certified', qty: 430, cost: 460000, date: '2024-08-25' },
  { id: 'FLC-0020', hub: 'Mumbai Western Corridor MH', lane: 'NH6 Kolkata Mumbai', status: 'Toll Plaza Compliance QC', qty: 250, cost: 740000, date: '2024-09-07' },
]

export default function FreightLaneCommandView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})

  const allRecords = [...freightrecords, ...genRecords(21), ...genRecords(41)]

  const filteredRecords = useMemo(() => {
    if (!searchQuery && Object.keys(activeFilters).every(k => !activeFilters[k].length)) return allRecords
    const sq = searchQuery.toLowerCase()
    return allRecords.filter(r => { if (sq && !r.id.toLowerCase().includes(sq) && !r.lane.toLowerCase().includes(sq)) return false; return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string)); })
  }, [searchQuery, activeFilters, allRecords])

  const filterGroups = [
    { key: 'lane', label: 'Lane', options: PRODUCTS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.lane === p).length })) },
    { key: 'hub', label: 'Hub', options: ARTISANS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.hub === p).length })) },
  ]

  const trendData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m, i) => ({ month: m, shipments: ri(30, 120, allRecords.length * 0.10 + i * 6) }))
  const hubChart = ARTISANS.map(p => ({ name: p.split(' ').slice(0, 2).join(' '), volume: allRecords.filter(r => r.hub === p).reduce((s, r) => s + r.qty, 0) }))
  const statusPie = STATUSES.map(s => ({ name: s, value: allRecords.filter(r => r.status === s).length }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="flc-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Freight Lanes' }]} />
      <PageHeader title="Freight Lane Command" description="Indian national highway freight lane management with NHAI lane certification toll plaza compliance quality control axle load weight testing route optimization verification ETC Fastag integration and safety audit compliance across 8 freight hubs on national highway corridors NH48 NH44 NH27 NH6 NH4 NH7 NH5 and NH2" />
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="bg-emerald-100">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <KpiTile label="Active Lanes" value={allRecords.length} />
            <KpiTile label="NH Corridors" value={PRODUCTS.length} />
            <KpiTile label="Freight Hubs" value={ARTISANS.length} />
            <KpiTile label="Avg Lane Cost" value={`₹${Math.round(allRecords.reduce((s, r) => s + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>
          <div className="grid grid-cols-6 gap-4">
            <HealthRing label="NHAI" value={93} />
            <HealthRing label="Toll" value={87} />
            <HealthRing label="Weight" value={91} />
            <HealthRing label="Route" value={88} />
            <HealthRing label="Fastag" value={95} />
            <HealthRing label="Safety" value={90} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="National Highways" value="8 Active" />
            <ValueTile label="Daily Volume" value="12,000 TPH" />
            <ValueTile label="Avg Transit" value="36 hours" />
            <ValueTile label="Lane Network" value="14,500 km" />
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
            placeholder="Search freight lane records..."
          />
          <div className="rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-emerald-100">
                <tr>
                  <th className="p-3 text-left font-medium">ID</th>
                  <th className="p-3 text-left font-medium">Lane</th>
                  <th className="p-3 text-left font-medium">Hub</th>
                  <th className="p-3 text-left font-medium">Status</th>
                  <th className="p-3 text-left font-medium">Volume</th>
                  <th className="p-3 text-left font-medium">Cost</th>
                  <th className="p-3 text-left font-medium">Cost Bar</th>
                  <th className="p-3 text-left font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map(record => (
                  <tr key={record.id} className="border-t hover:bg-emerald-50/50">
                    <td className="p-3 font-mono text-xs">{record.id}</td>
                    <td className="p-3"><ProductBadge name={record.lane} /></td>
                    <td className="p-3">{record.hub}</td>
                    <td className="p-3"><StatusBadge status={record.status} /></td>
                    <td className="p-3">{record.qty} TPH/day</td>
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
              <CardHeader><CardTitle>Lane Volume Trend</CardTitle></CardHeader>
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
              <CardHeader><CardTitle>Hub Volume</CardTitle></CardHeader>
              <CardContent>
                <BarChart width={500} height={300} data={hubChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="volume" fill={COLORS[0]}>
                    {hubChart.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
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
              <CardHeader><CardTitle>Freight Lane Command — Indian National Highway Logistics Network</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The freight lane command system manages the strategic allocation and operational monitoring of freight transportation lanes across the Indian national highway network operated by the National Highways Authority of India NHAI which maintains a total network of over one lakh forty thousand kilometres of national highways carrying approximately sixty-five percent of India total freight traffic by volume and approximately eighty percent by value where the Indian road freight industry employs over twelve million truck drivers fleet operators and logistics support personnel moving an estimated four point six billion metric tonnes of freight annually with a total market value exceeding two lakh crore rupees where the freight lane command system covers eight primary national highway freight corridors including the NH48 connecting Mumbai to Delhi spanning approximately one thousand four hundred kilometres through Gujarat Rajasthan and Haryana carrying the highest freight density of any Indian national highway corridor handling approximately thirty thousand tonnes per day of industrial agricultural and consumer goods where the NH44 connecting Srinagar to Kanyakumari is the longest national highway at approximately three thousand seven hundred forty-five kilometres traversing the entire north-south length of India through Jammu and Kashmir Punjab Haryana Delhi Rajasthan Madhya Pradesh Maharashtra Telangana Andhra Pradesh Karnataka and Tamil Nadu providing the primary north-south freight backbone corridor where the NH27 connecting Gujarat to Assam is the newly designated east-west corridor spanning over three thousand five hundred kilometres connecting the western industrial port of Porbandar to the eastern river port of Guwahati providing critical east-west freight connectivity across Rajasthan Madhya Pradesh Chhattisgarh Odisha Jharkhand Bihar and West Bengal where the NH6 NH4 NH7 NH5 and NH2 corridors provide supplementary freight connectivity linking major industrial centres port cities and consumption markets across the Indian subcontinent with the freight lane command system optimising lane allocation route scheduling toll compliance and safety monitoring across all eight corridors through a centralised management platform.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>NHAI Lane Certification and Toll Plaza Compliance Standards</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The NHAI lane certification and toll plaza compliance standards establish the regulatory and operational quality framework for Indian national highway freight lane operations ensuring all freight transportation activities comply with the National Highways Authority of India regulations the Central Motor Vehicles Rules the Indian Road Congress guidelines and the Indian Toll Bridge and Ferries Rules where the NHAI lane certification test evaluates each freight lane against a comprehensive checklist of infrastructure and operational requirements including road surface condition confirming the pavement roughness index measured by the bump integrator method is within the acceptable range of two thousand to three thousand millimetres per kilometre confirming a smooth riding surface without significant potholes rutting or surface cracking that could damage freight vehicles or cargo lane width confirming the minimum lane width of three point seven five metres as specified by IRC standards for national highway design with adequate shoulder width of one point five metres on each side for emergency stopping and vehicle recovery operations bridge load capacity confirming all bridges and flyovers on the freight lane are rated for the standard Indian Class A loading of seventy tonnes single axle and the Class B loading of forty tonnes tandem axle used by heavy commercial freight vehicles gradient and curvature confirming the maximum gradient does not exceed five percent on plain terrain three percent on rolling terrain and four percent on hilly terrain and the horizontal curve radius meets the minimum design speed requirements for the posted speed limit where the toll plaza compliance test evaluates the electronic toll collection ETC system readiness confirming all designated freight lanes are equipped with functional FASTag RFID readers capable of reading ISO 18000-6C compliant FASTag transponders at vehicle speeds of up to forty kilometres per hour with a read accuracy exceeding ninety-nine point five percent confirming the toll transaction processing time is less than two seconds per vehicle and the FASTag account balance verification API is available twenty-four hours a day with system uptime exceeding ninety-nine point nine percent.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Axle Load Weight Testing and Route Optimization Verification</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The axle load weight testing and route optimization verification protocols ensure the legal weight compliance and operational efficiency of freight transportation across the Indian national highway network where the axle load weight test monitors the compliance of each freight vehicle with the legal axle weight limits specified by the Central Motor Vehicles Rules and enforced through the network of weigh-in-motion WIM stations and static weighing bridges operated by the NHAI regional offices and state transport departments where the legal maximum axle load limits for Indian freight vehicles are seven tonnes for single axle ten point five tonnes for tandem axle with one metre spacing eighteen tonnes for tandem axle with one point two metre spacing twenty-one tonnes for tridem axle with one point two metre spacing and a maximum gross vehicle weight of forty-nine tonnes for two-axle rigid trucks fifty-five tonnes for three-axle rigid trucks and fifty-five tonnes for articulated tractor-trailer combinations where the WIM station weight test measures the dynamic weight of each axle of every freight vehicle passing through the WIM sensor array at highway speed confirming each axle weight is within five percent of the legal maximum for that axle configuration where overloaded vehicles are flagged for mandatory static weighing at the nearest weigh bridge and subject to penalty assessment under the Motor Vehicles Act provisions where the route optimization verification test evaluates the efficiency of the freight route planning algorithm used by the freight lane command system to assign each freight movement to the optimal national highway corridor based on the freight origin and destination points cargo type and weight constraints required delivery time window real-time traffic congestion data toll cost per kilometre fuel consumption per route segment and availability of rest stops and driver changeover facilities along the route where the route optimization test compares the algorithm-selected route against three alternative routes for a sample of one thousand freight movements per month confirming the algorithm-selected route is within five percent of the theoretical minimum-cost route for at least ninety percent of test cases ensuring the route optimization system delivers consistent cost savings and transit time improvements across the freight lane network.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>ETC Fastag Integration Check and Safety Audit Framework</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The ETC Fastag integration check and safety audit framework provide the electronic toll collection compliance monitoring and operational safety assurance infrastructure for the Indian national highway freight lane management system where the ETC Fastag integration test verifies the seamless operation of the electronic toll collection system across all toll plazas on the designated freight lanes confirming the FASTag RFID reader system at each toll plaza correctly reads the FASTag transponder mounted on each freight vehicle windshield at the specified operating frequency of eight hundred sixty to nine hundred sixty megahertz in the UHF band confirming the reader antenna gain and polarization are correctly configured for reliable reading of FASTag tags mounted at the standard windshield position at a height between one point two and two metres above road level and at vehicle approach speeds between zero and forty kilometres per hour where the integration test also verifies the real-time communication between the toll plaza RFID reader system and the central FASTag account management server confirming transaction data is transmitted within two seconds of the vehicle passing the reader antenna with a transaction success rate exceeding ninety-nine point five percent and confirming the FASTag account balance deduction is accurately reflected in the vehicle owner account within five seconds of the transaction completion where the safety audit protocol conducts systematic inspections of operational safety practices across all designated freight lanes covering vehicle safety including verification that all freight vehicles carry valid fitness certificates insurance certificates and pollution under control PUC certificates driver safety including verification that all drivers hold valid commercial driving licences have completed the mandatory minimum rest period of eleven consecutive hours per day and are not operating under fatigue or intoxication cargo safety including verification that hazardous materials are correctly labelled packaged and documented in accordance with the Road Transport of Hazardous Goods Rules and emergency preparedness including verification that each toll plaza and freight hub maintains functional emergency response equipment including fire extinguishers first aid kits emergency communication systems and vehicle recovery equipment.</p></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}



