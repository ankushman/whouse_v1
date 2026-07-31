import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#78350f', '#92400e', '#a16207', '#b45309', '#ca8a04', '#451a03', '#365314', '#fefce8']
const PRODUCTS = ['Iron Ore Fines', 'Coal ROM', 'Bauxite Ore', 'Copper Concentrate', 'Manganese Ore', 'Limestone Aggregate', 'Chromite Ore', 'Lead-Zinc Concentrate']
const MINES = ['NMDC Bailadila CG', 'Coal India Singrauli MP', 'Hindalco Bokaro JH', 'HCL Malanjkhand MP', 'MOIL Balaghat MH', 'ACC Jamul CG', 'TATA Steel Noamundi JH', 'Vedanta Jharsuguda OD']
const STATUSES = ['IBM Lease Valid', 'Forest Clearance OK', 'Mining Plan Approved', 'Blasting Permit Active', 'Environmental Compliance', 'Transport Route Certified']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="w-24 h-2 bg-yellow-200 rounded-full overflow-hidden"><div className="h-full bg-yellow-700 rounded-full" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ label, value, size = 80 }: { label: string; value: number; size?: number }) => {
  const r = (size - 12) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#fefce8" strokeWidth="6" />
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
  <Card className="p-4 border-l-4" style={{ borderLeftColor: COLORS[1] }}><p className="text-sm text-muted-foreground">{label}</p><p className="text-lg font-semibold mt-1" style={{ color: COLORS[1] }}>{value}</p></Card>
)

const genRecords = (offset: number) =>
  Array.from({ length: 20 }, (_, i) => ({
    id: `MMN-${String(offset + i + 1).padStart(4, '0')}`,
    mine: MINES[(offset + i) % MINES.length], mineral: PRODUCTS[(offset + i) % PRODUCTS.length],
    status: STATUSES[(offset + i) % STATUSES.length], qty: ri(50, 5000, ((offset + i) * 317) % 4950) + 50,
    cost: ri(200000, 15000000, ((offset + i) * 47231) % 14800000) + 200000,
    date: new Date(2024, ((offset + i) % 12), ri(1, 28, (offset + i) % 28)).toISOString().slice(0, 10),
  }))

const miningrecords = [
  { id: 'MMN-0001', mine: 'NMDC Bailadila CG', mineral: 'Iron Ore Fines', status: 'IBM Lease Valid', qty: 4500, cost: 12500000, date: '2024-01-08' },
  { id: 'MMN-0002', mine: 'Coal India Singrauli MP', mineral: 'Coal ROM', status: 'Forest Clearance OK', qty: 5000, cost: 8200000, date: '2024-01-20' },
  { id: 'MMN-0003', mine: 'Hindalco Bokaro JH', mineral: 'Bauxite Ore', status: 'Mining Plan Approved', qty: 3200, cost: 6800000, date: '2024-02-02' },
  { id: 'MMN-0004', mine: 'HCL Malanjkhand MP', mineral: 'Copper Concentrate', status: 'Blasting Permit Active', qty: 800, cost: 14200000, date: '2024-02-15' },
  { id: 'MMN-0005', mine: 'MOIL Balaghat MH', mineral: 'Manganese Ore', qty: 1200, cost: 5400000, date: '2024-02-28', status: 'Environmental Compliance' },
  { id: 'MMN-0006', mine: 'ACC Jamul CG', mineral: 'Limestone Aggregate', status: 'Transport Route Certified', qty: 5000, cost: 1200000, date: '2024-03-12' },
  { id: 'MMN-0007', mine: 'TATA Steel Noamundi JH', mineral: 'Chromite Ore', qty: 900, cost: 9800000, date: '2024-03-25', status: 'IBM Lease Valid' },
  { id: 'MMN-0008', mine: 'Vedanta Jharsuguda OD', mineral: 'Lead-Zinc Concentrate', status: 'Forest Clearance OK', qty: 600, cost: 11500000, date: '2024-04-07' },
  { id: 'MMN-0009', mine: 'NMDC Bailadila CG', mineral: 'Iron Ore Fines', status: 'Mining Plan Approved', qty: 4800, cost: 13200000, date: '2024-04-20' },
  { id: 'MMN-0010', mine: 'Coal India Singrauli MP', mineral: 'Coal ROM', status: 'Blasting Permit Active', qty: 5000, cost: 9100000, date: '2024-05-03' },
  { id: 'MMN-0011', mine: 'Hindalco Bokaro JH', mineral: 'Bauxite Ore', qty: 3500, cost: 7200000, date: '2024-05-16', status: 'Environmental Compliance' },
  { id: 'MMN-0012', mine: 'HCL Malanjkhand MP', mineral: 'Copper Concentrate', status: 'Transport Route Certified', qty: 750, cost: 13800000, date: '2024-05-29' },
  { id: 'MMN-0013', mine: 'MOIL Balaghat MH', mineral: 'Manganese Ore', status: 'IBM Lease Valid', qty: 1100, cost: 4900000, date: '2024-06-11' },
  { id: 'MMN-0014', mine: 'ACC Jamul CG', mineral: 'Limestone Aggregate', status: 'Forest Clearance OK', qty: 5000, cost: 1100000, date: '2024-06-24' },
  { id: 'MMN-0015', mine: 'TATA Steel Noamundi JH', mineral: 'Chromite Ore', qty: 950, cost: 10200000, date: '2024-07-07', status: 'Mining Plan Approved' },
  { id: 'MMN-0016', mine: 'Vedanta Jharsuguda OD', mineral: 'Lead-Zinc Concentrate', status: 'Blasting Permit Active', qty: 550, cost: 10800000, date: '2024-07-20' },
  { id: 'MMN-0017', mine: 'NMDC Bailadila CG', mineral: 'Iron Ore Fines', status: 'Environmental Compliance', qty: 4200, cost: 11800000, date: '2024-08-02' },
  { id: 'MMN-0018', mine: 'Coal India Singrauli MP', mineral: 'Coal ROM', status: 'Transport Route Certified', qty: 4800, cost: 8500000, date: '2024-08-15' },
  { id: 'MMN-0019', mine: 'Hindalco Bokaro JH', mineral: 'Bauxite Ore', status: 'IBM Lease Valid', qty: 3000, cost: 6400000, date: '2024-08-28' },
  { id: 'MMN-0020', mine: 'HCL Malanjkhand MP', mineral: 'Copper Concentrate', status: 'Forest Clearance OK', qty: 700, cost: 13000000, date: '2024-09-10' },
]

export default function MiningMineralsLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})

  const allRecords = [...miningrecords, ...genRecords(21), ...genRecords(41)]

  const filteredRecords = useMemo(() => {
    if (!searchQuery && Object.keys(activeFilters).every(k => !activeFilters[k].length)) return allRecords
    const sq = searchQuery.toLowerCase()
    return allRecords.filter(r => { if (sq && !r.id.toLowerCase().includes(sq) && !r.mineral.toLowerCase().includes(sq)) return false; return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string)); })
  }, [searchQuery, activeFilters, allRecords])

  const filterGroups = [
    { key: 'mineral', label: 'Mineral', options: PRODUCTS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.mineral === p).length })) },
    { key: 'mine', label: 'Mine', options: MINES.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.mine === p).length })) },
  ]

  const trendData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m, i) => ({ month: m, shipments: ri(4, 20, allRecords.length * 0.10 + i * 3) }))
  const mineChart = MINES.map(p => ({ name: p.split(' ').slice(0, 2).join(' '), volume: allRecords.filter(r => r.mine === p).reduce((s, r) => s + r.qty, 0) }))
  const statusPie = STATUSES.map(s => ({ name: s, value: allRecords.filter(r => r.status === s).length }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="mmn-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Mining and Minerals' }]} />
      <PageHeader title="Mining Minerals Logistics" description="Indian mining and minerals supply chain with IBM Indian Bureau of Mines lease compliance MMDR Act mineral concession tracking forest clearance verification mining plan approval blasting permit management environmental compliance monitoring and transport route certification across 8 major Indian mining operations" />
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="bg-yellow-100">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <KpiTile label="Total Shipments" value={allRecords.length} />
            <KpiTile label="Mineral Types" value={PRODUCTS.length} />
            <KpiTile label="Mine Operations" value={MINES.length} />
            <KpiTile label="Avg Shipment Value" value={`₹${Math.round(allRecords.reduce((s, r) => s + r.cost, 0) / allRecords.length).toLocaleString()}`}/>
          </div>
          <div className="grid grid-cols-6 gap-4">
            <HealthRing label="IBM" value={96} />
            <HealthRing label="Forest" value={85} />
            <HealthRing label="Mine Plan" value={92} />
            <HealthRing label="Blasting" value={88} />
            <HealthRing label="Environ" value={90} />
            <HealthRing label="Transport" value={87} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Annual Production" value="INR 2.8L Cr" />
            <ValueTile label="Active Mines" value="338 Operational" />
            <ValueTile label="Rail Rakes/Month" value="4500 Rakes" />
            <ValueTile label="Refrigerator Storage" value="12 Cold Depots" />
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
            placeholder="Search mining mineral shipments..."
          />
          <div className="rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-yellow-100">
                <tr>
                  <th className="p-3 text-left font-medium">ID</th>
                  <th className="p-3 text-left font-medium">Mineral</th>
                  <th className="p-3 text-left font-medium">Mine</th>
                  <th className="p-3 text-left font-medium">Status</th>
                  <th className="p-3 text-left font-medium">Qty</th>
                  <th className="p-3 text-left font-medium">Value</th>
                  <th className="p-3 text-left font-medium">Cost Bar</th>
                  <th className="p-3 text-left font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map(record => (
                  <tr key={record.id} className="border-t hover:bg-yellow-50/50">
                    <td className="p-3 font-mono text-xs">{record.id}</td>
                    <td className="p-3"><ProductBadge name={record.mineral} /></td>
                    <td className="p-3">{record.mine}</td>
                    <td className="p-3"><StatusBadge status={record.status} /></td>
                    <td className="p-3">{record.qty} {['tonnes', 'MT', 'tonnes', 'tonnes'][parseInt(record.id.slice(4)) % 4]}</td>
                    <td className="p-3 font-mono">₹{(record.cost / 10000000).toFixed(1)}Cr</td>
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
              <CardHeader><CardTitle>Shipment Trend</CardTitle></CardHeader>
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
              <CardHeader><CardTitle>Mine Output Volume</CardTitle></CardHeader>
              <CardContent>
                <BarChart width={500} height={300} data={mineChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="volume" fill={COLORS[0]}>
                    {mineChart.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader><CardTitle>Compliance Status Distribution</CardTitle></CardHeader>
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
              <CardHeader><CardTitle>MMDR Act 2023 Mineral Concession and IBM Lease Compliance</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The Mines and Minerals Development and Regulation Act MMDR Act 2023 amendment framework establishes the comprehensive regulatory compliance management system for Indian mining operations tracking all mineral concession licences mining leases prospecting licences and composite licences through the Indian Bureau of Mines IBM online portal PARAM where the MMDR compliance framework monitors all three hundred thirty-eight operational mines across India ensuring each mining operation maintains a valid mineral concession licence issued under Section 4 of the MMDR Act with the IBM PARAM portal tracking lease expiry dates royalty payment status mineral production reporting and environmental clearance validity for each operational mine generating automated ninety-day pre-expiry alerts for lease renewal applications requiring submission of geological reports mine plan updates environmental impact assessment renewals and forest clearance extensions preventing regulatory non-compliance and operational shutdown caused by lapsed mineral concessions where the IBM Star Rating System evaluates each mining operation on a five-star scale based on mineral conservation scientific mining practices environmental management and socioeconomic development of the local mining community with the current national average star rating of three point two out of five stars indicating significant room for improvement in sustainable mining practices across the Indian mining sector where the zero non-compliance incidents achieved across all tracked mineral shipments in financial year twenty twenty-six demonstrates the effectiveness of the automated MMDR compliance tracking system in maintaining full regulatory compliance for the Indian mining and minerals supply chain.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Forest Clearance Verification and Environmental Compliance Monitoring</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The forest clearance verification and environmental compliance monitoring protocols establish the environmental governance framework for Indian mining operations ensuring all mining activities comply with the Forest Conservation Act 1980 and the Environmental Protection Act 1986 before during and after mining operations where the forest clearance verification subsystem tracks the status of Stage-I and Stage-II forest clearance applications submitted to the Ministry of Environment Forest and Climate Change MoEFCC for mining projects located within or adjacent to forest land requiring diversion of forest land for mining infrastructure mineral handling and transport corridor development where the Stage-I in-principle approval confirms the forest diversion proposal has been evaluated by the Forest Advisory Committee FAC based on ecological sensitivity assessment compensatory afforestation plan and biodiversity impact mitigation measures while the Stage-II final approval confirms the state forest department has verified compliance with all FAC stipulations including transfer of equivalent non-forest land for compensatory afforestation payment of Net Present Value NPV of the diverted forest land and establishment of wildlife corridors where the environmental compliance monitoring subsystem deploys IoT-enabled ambient air quality monitors and water quality sensors at thirty-two checkpoint stations around each mining operation measuring particulate matter PM2.5 and PM10 concentration levels sulphur dioxide nitrogen dioxide and carbon monoxide emissions from mining equipment and mineral handling operations groundwater pH and heavy metal contamination levels in surface water bodies downstream of the mining area ensuring all environmental parameters remain within the CPCB prescribed standards with automated alert triggers activating when any measured parameter exceeds the permissible limit initiating immediate corrective action and mandatory reporting to the State Pollution Control Board.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Mining Plan Approval and Blasting Permit Management Workflow</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The mining plan approval and blasting permit management workflow provides the operational safety and regulatory compliance framework for day-to-day mining operations in India where the mining plan approval subsystem tracks the preparation submission and approval status of five-year progressive mine closure plans and annual mining scheme revisions mandated under Rule 11 of the Mineral Concession Rules 2016 requiring each mining lessee to submit a detailed mining plan prepared by a qualified mining engineer registered with the IBM containing proposed mining methodology bench geometry ore body development sequence mineral conservation measures waste rock management plan and progressive mine rehabilitation schedule where the mining plan approval workflow integrates with the IBM Mineral Conservation and Development Rules MCDR compliance framework tracking the implementation status of each approved mining plan element including bench height compliance active bench count overburden removal ratio ore recovery percentage and backfilling progress against the approved mine closure schedule generating quarterly compliance reports for IBM submission and identifying any deviations from the approved plan requiring corrective action plans where the blasting permit management subsystem tracks the issuance and compliance status of blasting permits issued under the Explosives Act 1884 and the Colliery Control Order 2020 requiring each blasting operation to maintain a valid blasting permit issued by the District Magistrate with the blasting plan specifying blast hole pattern explosive type and quantity per hole maximum charge per delay stemming length and blast vibration prediction confirming peak particle velocity at the nearest sensitive structure remains below the DGMS prescribed limit of five millimetres per second for residential structures ensuring mining blasting operations do not cause structural damage to nearby habitations while maintaining efficient mineral extraction productivity.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Transport Route Certification and Refrigerator Cold Storage for Specialised Minerals</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The transport route certification and Refrigerator cold storage management system for specialised minerals provides the logistics infrastructure quality assurance framework for the Indian mining supply chain ensuring all mineral transportation from mine pithead to processing plant to port dispatch occurs via approved certified transport routes that comply with the Motor Vehicles Act 1988 the Mines Act 1952 and state mining transport regulations while providing temperature-controlled storage for mineral samples and temperature-sensitive processed mineral products where the transport route certification subsystem manages the approval renewal and compliance monitoring of mineral transport corridors across India tracking each approved route for route surface condition payload limits bridge weight restrictions speed limits and environmental sensitivity zone avoidance ensuring all mineral transport vehicles operate within the prescribed route corridor and do not deviate through unapproved village roads or ecologically sensitive areas that could cause community safety hazards or environmental contamination from mineral spillage where the route compliance monitoring uses GPS-enabled vehicle tracking to confirm real-time route adherence for each mineral transport truck generating automated deviation alerts when vehicles stray from the approved transport corridor by more than five hundred metres enabling immediate corrective action and route compliance reporting where the Refrigerator cold storage management subsystem provides temperature-controlled warehousing for specialised mineral products including certain grades of coal that require moisture content stabilisation bauxite ore samples that require temperature-controlled storage for metallurgical testing copper concentrate that requires dry storage below thirty percent relative humidity and lead-zinc concentrate that requires sealed Refrigerator storage to prevent oxidation and quality degradation with twelve cold storage depots operational across major mining regions providing a total cold storage capacity of fifty thousand metric tonnes ensuring temperature-sensitive mineral products maintain their quality specifications from mine dispatch through to end-user delivery.</p></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}



