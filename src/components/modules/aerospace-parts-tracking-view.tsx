import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#7e22ce', '#6b21a8', '#a855f7', '#c084fc', '#d8b4fe', '#581c87', '#3b0764', '#f3e8ff']
const PRODUCTS = ['Turbofan Blades', 'Landing Gear Assembly', 'Avionics Unit', 'Hydraulic Actuator', 'Composite Panels', 'Fuel System Components', 'Flight Control Surfaces', 'Cabin Interior Parts']
const ARTISANS = ['HAL Bengaluru', 'BEL Ghaziabad', 'DRDO Hyderabad', 'ISRO Thiruvananthapuram', 'NAL Bengaluru', 'GTRE Bengaluru', 'ADA Bengaluru', 'HAL Kanpur']
const STATUSES = ['AS9100D Certified', 'NADCAP Approved', 'Under Audit', 'Conditional Pass', 'Non-Conforming', 'Pending Review']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-purple-100 text-purple-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="w-24 h-2 bg-purple-200 rounded-full overflow-hidden"><div className="h-full bg-purple-700 rounded-full" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ label, value, size = 80 }: { label: string; value: number; size?: number }) => {
  const r = (size - 12) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f3e8ff" strokeWidth="6" />
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
    id: `ASP-${String(offset + i + 1).padStart(4, '0')}`,
    facility: ARTISANS[(offset + i) % ARTISANS.length], part: PRODUCTS[(offset + i) % PRODUCTS.length],
    status: STATUSES[(offset + i) % STATUSES.length], qty: ri(1, 30, ((offset + i) * 19) % 30) + 1,
    cost: ri(4500000, 64000000, ((offset + i) * 59507) % 59550000) + 4500000,
    date: new Date(2024, ((offset + i) % 12), ri(1, 28, (offset + i) % 28)).toISOString().slice(0, 10),
  }))

const aerospacerecords = [
  { id: 'ASP-0001', facility: 'HAL Bengaluru', part: 'Turbofan Blades', status: 'AS9100D Certified', qty: 24, cost: 48000000, date: '2024-01-15' },
  { id: 'ASP-0002', facility: 'BEL Ghaziabad', part: 'Landing Gear Assembly', status: 'NADCAP Approved', qty: 4, cost: 12500000, date: '2024-01-28' },
  { id: 'ASP-0003', facility: 'DRDO Hyderabad', part: 'Avionics Unit', status: 'AS9100D Certified', qty: 8, cost: 64000000, date: '2024-02-10' },
  { id: 'ASP-0004', facility: 'ISRO Thiruvananthapuram', part: 'Hydraulic Actuator', status: 'AS9100D Certified', qty: 12, cost: 36000000, date: '2024-02-22' },
  { id: 'ASP-0005', facility: 'NAL Bengaluru', part: 'Composite Panels', status: 'Under Audit', qty: 16, cost: 9600000, date: '2024-03-08' },
  { id: 'ASP-0006', facility: 'GTRE Bengaluru', part: 'Fuel System Components', status: 'NADCAP Approved', qty: 6, cost: 7200000, date: '2024-03-20' },
  { id: 'ASP-0007', facility: 'ADA Bengaluru', part: 'Flight Control Surfaces', status: 'AS9100D Certified', qty: 10, cost: 28000000, date: '2024-04-03' },
  { id: 'ASP-0008', facility: 'HAL Kanpur', part: 'Cabin Interior Parts', status: 'Conditional Pass', qty: 4, cost: 32000000, date: '2024-04-16' },
  { id: 'ASP-0009', facility: 'HAL Bengaluru', part: 'Turbofan Blades', status: 'Under Audit', qty: 32, cost: 25600000, date: '2024-04-28' },
  { id: 'ASP-0010', facility: 'BEL Ghaziabad', part: 'Landing Gear Assembly', status: 'Non-Conforming', qty: 2, cost: 4500000, date: '2024-05-10' },
  { id: 'ASP-0011', facility: 'DRDO Hyderabad', part: 'Avionics Unit', status: 'AS9100D Certified', qty: 15, cost: 22500000, date: '2024-05-23' },
  { id: 'ASP-0012', facility: 'ISRO Thiruvananthapuram', part: 'Hydraulic Actuator', status: 'Pending Review', qty: 8, cost: 12000000, date: '2024-06-05' },
  { id: 'ASP-0013', facility: 'NAL Bengaluru', part: 'Composite Panels', status: 'NADCAP Approved', qty: 3, cost: 5400000, date: '2024-06-18' },
  { id: 'ASP-0014', facility: 'GTRE Bengaluru', part: 'Fuel System Components', status: 'AS9100D Certified', qty: 6, cost: 10800000, date: '2024-07-01' },
  { id: 'ASP-0015', facility: 'ADA Bengaluru', part: 'Flight Control Surfaces', status: 'NADCAP Approved', qty: 10, cost: 7500000, date: '2024-07-14' },
  { id: 'ASP-0016', facility: 'HAL Kanpur', part: 'Cabin Interior Parts', status: 'AS9100D Certified', qty: 4, cost: 30000000, date: '2024-07-26' },
  { id: 'ASP-0017', facility: 'HAL Bengaluru', part: 'Turbofan Blades', status: 'AS9100D Certified', qty: 20, cost: 48000000, date: '2024-08-08' },
  { id: 'ASP-0018', facility: 'BEL Ghaziabad', part: 'Landing Gear Assembly', status: 'Conditional Pass', qty: 6, cost: 10500000, date: '2024-08-20' },
  { id: 'ASP-0019', facility: 'DRDO Hyderabad', part: 'Avionics Unit', status: 'Under Audit', qty: 8, cost: 58000000, date: '2024-09-02' },
  { id: 'ASP-0020', facility: 'ISRO Thiruvananthapuram', part: 'Hydraulic Actuator', status: 'AS9100D Certified', qty: 12, cost: 36000000, date: '2024-09-14' },
]

export default function AerospacePartsTrackingView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})

  const allRecords = [...aerospacerecords, ...genRecords(21), ...genRecords(41)]

  const filteredRecords = useMemo(() => {
    if (!searchQuery && Object.keys(activeFilters).every(k => !activeFilters[k].length)) return allRecords
    const sq = searchQuery.toLowerCase()
    return allRecords.filter(r => { if (sq && !r.id.toLowerCase().includes(sq) && !r.part.toLowerCase().includes(sq)) return false; return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string)); })
  }, [searchQuery, activeFilters, allRecords])

  const filterGroups = [
    { key: 'part', label: 'Part Type', options: PRODUCTS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.part === p).length })) },
    { key: 'facility', label: 'Facility', options: ARTISANS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.facility === p).length })) },
  ]

  const trendData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m, i) => ({ month: m, shipments: ri(4, 20, allRecords.length * 0.10 + i * 3) }))
  const facilityChart = ARTISANS.map(p => ({ name: p.split(' ').slice(0, 1).join(' '), volume: allRecords.filter(r => r.facility === p).reduce((s, r) => s + r.qty, 0) }))
  const statusPie = STATUSES.map(s => ({ name: s, value: allRecords.filter(r => r.status === s).length }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="asp-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Aerospace Parts' }]} />
      <PageHeader title="Aerospace Parts Tracking Logistics" description="Indian aerospace parts supply chain tracking with AS9100D certification and NADCAP approval for turbofan blades landing gear assemblies avionics units hydraulic actuators composite panels fuel system components flight control surfaces and cabin interior parts across HAL BEL DRDO ISRO NAL GTRE and ADA defence production facilities" />
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="bg-purple-100">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <KpiTile label="Total Shipments" value={allRecords.length} />
            <KpiTile label="Part Types" value={PRODUCTS.length} />
            <KpiTile label="Facilities" value={ARTISANS.length} />
            <KpiTile label="Avg Cost" value={`₹${Math.round(allRecords.reduce((s, r) => s + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>
          <div className="grid grid-cols-6 gap-4">
            <HealthRing label="AS9100D" value={92} />
            <HealthRing label="NADCAP" value={88} />
            <HealthRing label="Trace" value={95} />
            <HealthRing label="Clean" value={90} />
            <HealthRing label="Shelf" value={86} />
            <HealthRing label="Document" value={93} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Programs" value="8 Active" />
            <ValueTile label="Annual Spend" value="₹18K Crore" />
            <ValueTile label="AS9100D Sites" value="142 Certified" />
            <ValueTile label="Make in India" value="75% Local" />
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
            placeholder="Search aerospace parts shipments..."
          />
          <div className="rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-purple-100">
                <tr>
                  <th className="p-3 text-left font-medium">ID</th>
                  <th className="p-3 text-left font-medium">Part</th>
                  <th className="p-3 text-left font-medium">Facility</th>
                  <th className="p-3 text-left font-medium">Status</th>
                  <th className="p-3 text-left font-medium">Qty</th>
                  <th className="p-3 text-left font-medium">Cost</th>
                  <th className="p-3 text-left font-medium">Cost Bar</th>
                  <th className="p-3 text-left font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map(record => (
                  <tr key={record.id} className="border-t hover:bg-purple-50/50">
                    <td className="p-3 font-mono text-xs">{record.id}</td>
                    <td className="p-3"><ProductBadge name={record.part} /></td>
                    <td className="p-3">{record.facility}</td>
                    <td className="p-3"><StatusBadge status={record.status} /></td>
                    <td className="p-3">{record.qty} {['pcs', 'sets', 'units', 'panels'][parseInt(record.id.slice(4)) % 4]}</td>
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
              <CardHeader><CardTitle>Facility Volume</CardTitle></CardHeader>
              <CardContent>
                <BarChart width={500} height={300} data={facilityChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="volume" fill={COLORS[0]}>
                    {facilityChart.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
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
              <CardHeader><CardTitle>Indian Aerospace Manufacturing — USD 25 Billion Defence Production Ecosystem</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The Indian aerospace parts manufacturing and tracking ecosystem represents one of the most strategically critical and technologically advanced industrial sectors in India with an estimated annual production value exceeding USD twenty-five billion encompassing military aircraft production helicopter assembly unmanned aerial vehicle manufacturing space launch vehicle components satellite subsystems and aero engine development across the integrated defence production network of Hindustan Aeronautics Limited with eleven production facilities nationwide the Bharat Electronics Limited with nine defence electronics manufacturing centres the Defence Research and Development Organisation with fifty-two laboratories covering aeronautics missiles electronics materials and life sciences the Indian Space Research Organisation with six major centres including the Vikram Sarabhai Space Centre and the Satish Dhawan Space Centre the National Aerospace Laboratories providing advanced composite and structural testing capabilities the Gas Turbine Research Establishment developing indigenous aero engine technology and the Aeronautical Development Agency managing the Light Combat Aircraft Tejas programme where the Indian aerospace manufacturing sector has achieved significant technological milestones including the successful design development and production of the Tejas Mark One and Mark One A light combat aircraft with over forty aircraft delivered to the Indian Air Force the Advanced Light Helicopter Dhruv with over three hundred helicopters produced for military and civil operators the Rudra armed helicopter variant the Light Combat Helicopter currently in production the Dhanush ballistic missile and the comprehensive Gaganyaan manned space mission programme scheduled for crewed orbital flight where the aerospace parts supply chain requires AS9100D quality management system certification across all tier-one and tier-two suppliers ensuring comprehensive traceability from raw material receipt through machining forming assembly testing calibration packaging and shipment to final integration at the aircraft or spacecraft assembly facility.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>AS9100D Certification & NADCAP Special Process Approval Framework</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The AS9100D quality management system certification and NADCAP National Aerospace and Defence Contractors Accreditation Programme special process approval framework establishes the primary quality assurance architecture for the Indian aerospace parts supply chain ensuring that all manufactured components meet the stringent quality traceability and documentation requirements mandated by international aerospace standards and Indian defence procurement regulations where AS9100D certification requires implementation of a comprehensive quality management system based on ISO 9001 with additional aerospace-specific requirements including risk management through failure mode effects analysis configuration management for all engineering changes and document revision control production process validation and first article inspection approval for all new parts and process changes non-conformance management with root cause analysis and corrective action verification material receiving inspection including incoming raw material certification review chemical composition verification and mechanical properties testing dimensional inspection using coordinate measuring machine systems calibrated to national standards in-process inspection at designated hold points verifying critical-to-quality characteristics including geometric dimensioning and tolerancing compliance surface finish measurement and material thickness verification within specified tolerances final inspection and test including non-destructive testing such as fluorescent penetrant inspection radiographic testing ultrasonic testing and eddy current testing for critical structural components functional testing of avionics units hydraulic actuators and fuel system components environmental testing including temperature altitude humidity vibration and electromagnetic compatibility testing ensuring each aerospace part meets the performance requirements specified in the applicable engineering drawing specification and purchase order before shipment to the integration facility where NADCAP accreditation provides additional special process approval for heat treatment surface finishing welding brazing coating and composite fabrication processes that require qualified personnel controlled atmosphere furnaces calibrated instrumentation and process parameter documentation meeting the stringent requirements of prime aerospace manufacturers and defence agencies worldwide.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Composites & Cleanroom Standards for Aerospace Structural Components</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The composite materials processing and cleanroom manufacturing standards for Indian aerospace structural components establish the technical framework for producing advanced carbon fibre glass fibre and aramid fibre composite assemblies that constitute an increasingly significant proportion of modern aerospace vehicle structures with composite materials comprising over fifty percent of the structural weight of the Tejas Mark One A airframe and projected to exceed sixty-five percent on the Tejas Mark Two Advanced Medium Combat Aircraft where the composite manufacturing process requires controlled environment conditions including temperature maintained at twenty-two degrees Celsius plus or minus two degrees and relative humidity below sixty percent in a Class Seven ISO cleanroom environment preventing airborne contamination of the carbon fibre prepreg layup and ensuring consistent cure characteristics during the autoclave curing cycle at one hundred eighty degrees Celsius under seven bar pressure for four hours producing void-free laminates with fibre volume fraction between fifty-five and sixty-two percent and glass transition temperature above one hundred eighty degrees Celsius confirmed by differential scanning calorimetry testing where each composite panel undergoes ultrasonic C-scan inspection detecting internal voids delaminations and porosity with acceptance criteria requiring zero defects exceeding five millimetres in any dimension and total porosity area below one percent of the panel surface area ensuring the structural integrity and damage tolerance of the composite component meets the fatigue life and residual strength requirements specified in the aircraft structural design documentation where the cleanroom manufacturing standard also mandates gowning procedures for all composite layup technicians lint-free wipes and HEPA-filtered air supply with minimum twenty air changes per hour preventing fibre contamination from cotton clothing dust particles and other airborne debris that could create resin-rich or resin-starved zones in the cured composite laminate compromising the structural performance and fatigue life of the finished aerospace component.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Make in India Aerospace & Defence Corridor Industrial Development</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The Make in India aerospace and defence corridor industrial development initiative represents the comprehensive strategic framework for building indigenous aerospace manufacturing capability across two designated defence production corridors the Bengaluru-Hyderabad-Chennai southern corridor focused on fixed-wing aircraft helicopter and avionics manufacturing and the Lucknow-Kanpur-Jhansi northern corridor focused on armoured vehicles missile systems and defence electronics where the corridor development strategy encourages private sector participation through defence procurement policy reforms allowing up to seventy-four percent foreign direct investment in the defence manufacturing sector streamlined licensing procedures for defence industrial licences and the creation of dedicated defence manufacturing clusters with shared infrastructure including common testing and calibration facilities surface treatment and coating centres composite autoclave facilities and precision machining centres with coordinate measuring machine capabilities where the Indian aerospace parts supply chain currently comprises over three hundred tier-one and tier-two qualified suppliers providing components and subsystems to the major defence public sector undertakings and defence research organisations with the Make in India initiative targeting seventy-five percent indigenous content in all future defence procurement programmes by two thousand thirty-five requiring significant expansion of the qualified supplier base particularly in critical technology areas including single crystal turbine blade casting for aero engine hot section components titanium alloy structural forging for airframe load-bearing members radar absorbent composite materials for stealth applications and high-reliability avionics electronics for mission-critical flight control and navigation systems where the defence corridor development programme has already attracted significant private investment from major Indian industrial groups including the Tata Group Mahindra Defence Larsen and Toubro Bharat Forge and the Kalyani Group establishing new aerospace manufacturing facilities with AS9100D and NADCAP certification targeting both the growing Indian defence procurement market valued at approximately USD one hundred thirty billion over the next decade and the international aerospace components market where Indian manufacturers are increasingly competitive on cost quality and delivery performance metrics.</p></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}



