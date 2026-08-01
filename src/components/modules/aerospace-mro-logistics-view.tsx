import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#1e3a8a', '#1e40af', '#2563eb', '#3b82f6', '#60a5fa', '#172554', '#0f172a', '#dbeafe']
const PRODUCTS = ['Turbofan Engine Blade', 'Landing Gear Assembly', 'Avionics LRU Module', 'Hydraulic Actuator Unit', 'APU Starter Generator', 'Composite Fuselage Panel', 'Flight Control Rod End', 'Fuel System Valve Block']
const ARTISANS = ['HAL Bengaluru MRO KA', 'Air India Engineering Delhi', 'GMR Aero Technics Hyderabad', 'AIESL Maintenance Mumbai', 'Boeing India MRO Nagpur', 'Airbus India TAT Delhi', 'SR Technics Bombay MH', 'Pratt Whitney Service HYD']
const STATUSES = ['DGCA Certified Released', 'FAA 8130-3 Released', 'EASA Form 1 Certified', 'NDT Under Inspection', 'Discrepancy Found Hold', 'Pending OEM Authorisation']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="w-24 h-2 bg-blue-200 rounded-full overflow-hidden"><div className="h-full bg-blue-700 rounded-full" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ label, value, size = 80 }: { label: string; value: number; size?: number }) => {
  const r = (size - 12) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#dbeafe" strokeWidth="6" />
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
    id: `AER-${String(offset + i + 1).padStart(4, '0')}`,
    painter: ARTISANS[(offset + i) % ARTISANS.length], ware: PRODUCTS[(offset + i) % PRODUCTS.length],
    status: STATUSES[(offset + i) % STATUSES.length], qty: ri(1, 20, ((offset + i) * 19) % 20) + 1,
    cost: ri(4000, 52000, ((offset + i) * 10707) % 48000) + 4000,
    date: new Date(2024, ((offset + i) % 12), ri(1, 28, (offset + i) % 28)).toISOString().slice(0, 10),
  }))

const mrorecords = [
  { id: 'AER-0001', painter: 'HAL Bengaluru MRO KA', ware: 'Turbofan Engine Blade', status: 'DGCA Certified Released', qty: 3, cost: 48000, date: '2024-01-15' },
  { id: 'AER-0002', painter: 'Air India Engineering Delhi', ware: 'Landing Gear Assembly', status: 'FAA 8130-3 Released', qty: 5, cost: 36000, date: '2024-01-28' },
  { id: 'AER-0003', painter: 'GMR Aero Technics Hyderabad', ware: 'Avionics LRU Module', status: 'EASA Form 1 Certified', qty: 2, cost: 52000, date: '2024-02-10' },
  { id: 'AER-0004', painter: 'AIESL Maintenance Mumbai', ware: 'Hydraulic Actuator Unit', status: 'NDT Under Inspection', qty: 7, cost: 22000, date: '2024-02-22' },
  { id: 'AER-0005', painter: 'Boeing India MRO Nagpur', ware: 'APU Starter Generator', status: 'Discrepancy Found Hold', qty: 4, cost: 44000, date: '2024-03-08' },
  { id: 'AER-0006', painter: 'Airbus India TAT Delhi', ware: 'Composite Fuselage Panel', status: 'Pending OEM Authorisation', qty: 6, cost: 28000, date: '2024-03-20' },
  { id: 'AER-0007', painter: 'SR Technics Bombay MH', ware: 'Flight Control Rod End', status: 'DGCA Certified Released', qty: 2, cost: 50000, date: '2024-04-03' },
  { id: 'AER-0008', painter: 'Pratt Whitney Service HYD', ware: 'Fuel System Valve Block', status: 'FAA 8130-3 Released', qty: 8, cost: 16000, date: '2024-04-16' },
  { id: 'AER-0009', painter: 'HAL Bengaluru MRO KA', ware: 'Landing Gear Assembly', status: 'EASA Form 1 Certified', qty: 4, cost: 40000, date: '2024-04-28' },
  { id: 'AER-0010', painter: 'Air India Engineering Delhi', ware: 'Turbofan Engine Blade', status: 'NDT Under Inspection', qty: 3, cost: 48000, date: '2024-05-10' },
  { id: 'AER-0011', painter: 'GMR Aero Technics Hyderabad', ware: 'Avionics LRU Module', status: 'Discrepancy Found Hold', qty: 5, cost: 32000, date: '2024-05-23' },
  { id: 'AER-0012', painter: 'AIESL Maintenance Mumbai', ware: 'Hydraulic Actuator Unit', status: 'Pending OEM Authorisation', qty: 6, cost: 20000, date: '2024-06-05' },
  { id: 'AER-0013', painter: 'Boeing India MRO Nagpur', ware: 'APU Starter Generator', status: 'DGCA Certified Released', qty: 3, cost: 46000, date: '2024-06-18' },
  { id: 'AER-0014', painter: 'Airbus India TAT Delhi', ware: 'Composite Fuselage Panel', status: 'FAA 8130-3 Released', qty: 7, cost: 24000, date: '2024-07-01' },
  { id: 'AER-0015', painter: 'SR Technics Bombay MH', ware: 'Flight Control Rod End', status: 'EASA Form 1 Certified', qty: 2, cost: 52000, date: '2024-07-14' },
  { id: 'AER-0016', painter: 'Pratt Whitney Service HYD', ware: 'Fuel System Valve Block', status: 'NDT Under Inspection', qty: 10, cost: 12000, date: '2024-07-26' },
  { id: 'AER-0017', painter: 'HAL Bengaluru MRO KA', ware: 'Turbofan Engine Blade', status: 'Discrepancy Found Hold', qty: 4, cost: 42000, date: '2024-08-08' },
  { id: 'AER-0018', painter: 'Air India Engineering Delhi', ware: 'Landing Gear Assembly', status: 'Pending OEM Authorisation', qty: 5, cost: 30000, date: '2024-08-20' },
  { id: 'AER-0019', painter: 'GMR Aero Technics Hyderabad', ware: 'Avionics LRU Module', status: 'DGCA Certified Released', qty: 3, cost: 50000, date: '2024-09-02' },
  { id: 'AER-0020', painter: 'AIESL Maintenance Mumbai', ware: 'Hydraulic Actuator Unit', status: 'FAA 8130-3 Released', qty: 8, cost: 18000, date: '2024-09-14' },
]

export default function AerospaceMroLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})

  const allRecords = [...mrorecords, ...genRecords(21), ...genRecords(41)]

  const filteredRecords = useMemo(() => {
    if (!searchQuery && Object.keys(activeFilters).every(k => !activeFilters[k].length)) return allRecords
    const sq = searchQuery.toLowerCase()
    return allRecords.filter(r => { if (sq && !r.id.toLowerCase().includes(sq) && !r.ware.toLowerCase().includes(sq)) return false; return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string)); })
  }, [searchQuery, activeFilters, allRecords])

  const filterGroups = [
    { key: 'ware', label: 'Ware', options: PRODUCTS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.ware === p).length })) },
    { key: 'painter', label: 'Painter', options: ARTISANS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.painter === p).length })) },
  ]

  const trendData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m, i) => ({ month: m, shipments: ri(4, 20, allRecords.length * 0.10 + i * 3) }))
  const artisanChart = ARTISANS.map(p => ({ name: p.split(' ').slice(0, 2).join(' '), volume: allRecords.filter(r => r.painter === p).reduce((s, r) => s + r.qty, 0) }))
  const statusPie = STATUSES.map(s => ({ name: s, value: allRecords.filter(r => r.status === s).length }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="aer-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Aerospace MRO' }]} />
      <PageHeader title="Aerospace MRO Logistics" description="India aerospace maintenance repair and overhaul supply chain with DGCA certification, FAA 8130-3 dual-release authorisation, EASA Form 1 compliance, NDT inspection protocols, discrepancy tracking, and OEM authorisation management across 8 MRO facilities including HAL, Air India Engineering, and Boeing India" />
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="bg-blue-100">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <KpiTile label="Total Shipments" value={allRecords.length} />
            <KpiTile label="Active Ware" value={PRODUCTS.length} />
            <KpiTile label="MRO Facilities" value={ARTISANS.length} />
            <KpiTile label="Avg Cost" value={`₹${Math.round(allRecords.reduce((s, r) => s + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>
          <div className="grid grid-cols-6 gap-4">
            <HealthRing label="DGCA" value={95} />
            <HealthRing label="FAA" value={91} />
            <HealthRing label="EASA" value={88} />
            <HealthRing label="NDT" value={86} />
            <HealthRing label="Quality" value={90} />
            <HealthRing label="OEM" value={84} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="MRO Revenue" value="₹18,500 Cr" />
            <ValueTile label="DGCA Licences" value="2,400+" />
            <ValueTile label="Turnaround" value="10.2 Days" />
            <ValueTile label="Annual Growth" value="+14.6%" />
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
            placeholder="Search aerospace MRO shipments..."
          />
          <div className="rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-blue-100">
                <tr>
                  <th className="p-3 text-left font-medium">ID</th>
                  <th className="p-3 text-left font-medium">Ware</th>
                  <th className="p-3 text-left font-medium">Painter</th>
                  <th className="p-3 text-left font-medium">Status</th>
                  <th className="p-3 text-left font-medium">Qty</th>
                  <th className="p-3 text-left font-medium">Cost</th>
                  <th className="p-3 text-left font-medium">Cost Bar</th>
                  <th className="p-3 text-left font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map(record => (
                  <tr key={record.id} className="border-t hover:bg-blue-50/50">
                    <td className="p-3 font-mono text-xs">{record.id}</td>
                    <td className="p-3"><ProductBadge name={record.ware} /></td>
                    <td className="p-3">{record.painter}</td>
                    <td className="p-3"><StatusBadge status={record.status} /></td>
                    <td className="p-3">{record.qty} {['units', 'sets', 'modules', 'assemblies'][parseInt(record.id.slice(4)) % 4]}</td>
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
              <CardHeader><CardTitle>MRO Facility Volume</CardTitle></CardHeader>
              <CardContent>
                <BarChart width={500} height={300} data={artisanChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="volume" fill={COLORS[0]}>
                    {artisanChart.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
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
              <CardHeader><CardTitle>India MRO Ecosystem — USD 2.1 Billion Aviation Maintenance Hub</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">India aerospace maintenance repair and overhaul supply chain represents one of the fastest-growing aviation MRO ecosystems globally having achieved approximately two point one billion US dollars in annual revenue serving both the rapidly expanding domestic Indian airline fleet exceeding eight hundred commercial aircraft and international carrier customers seeking cost-competitive high-quality MRO services where the Indian MRO industry benefits from a large pool of DGCA-licensed aircraft maintenance engineers exceeding twenty-four hundred active licence holders and a comprehensive network of eight major MRO facilities operated by Hindustan Aeronautics Limited HAL at Bengaluru providing heavy airframe maintenance for both military and civil aircraft including the Sukhoi Su-30MKI fighter and Airbus A320 family commercial airliners and Air India Engineering Services Limited AIESL at Mumbai and Delhi providing line and base maintenance for the Air India fleet of Boeing 777-200LR and 787-8 Dreamliner widebody aircraft and Airbus A320neo narrowbody aircraft and GMR Aero Technics at Hyderabad Rajiv Gandhi International Airport operating one of the largest independent MRO facilities in South Asia providing heavy maintenance checks for both Boeing and Airbus commercial aircraft including C-check and D-check overhaul programmes and the Boeing India MRO facility at Nagpur Dr Babasaheb Ambedkar International Airport providing dedicated MRO services for Boeing 737 family aircraft serving multiple Indian and international carriers where the MRO supply chain logistics involves managing the procurement of aircraft spare parts and rotable components from OEM authorised distributors with dual-release certification documentation including both DGCA release certificates and FAA 8130-3 authorised release certificates for components destined for US-registered aircraft and EASA Form 1 authorised release certificates for components destined for European-registered aircraft requiring precise documentation management to ensure regulatory compliance across multiple national aviation authority jurisdictions where each MRO facility maintains an ESD-protected warehouse for avionics components a temperature-controlled store for sealants adhesives and composite material consumables and a bonded stores for high-value rotable components including turbofan engine modules landing gear assemblies and flight control actuators valued at millions of dollars per unit requiring specialised logistics handling with chain-of-custody documentation and insurance coverage commensurate with the extraordinary value and safety-critical nature of aerospace MRO components.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>DGCA Certification & Dual-Release Quality Framework</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The Directorate General of Civil Aviation DGCA certification and dual-release quality framework for Indian aerospace MRO operations establishes the regulatory foundation for all maintenance repair and overhaul activities performed on civil aircraft registered in India and for components released by Indian MRO facilities for installation on both Indian and foreign-registered aircraft where the DGCA Civil Aviation Requirements CAR Series M Part II Subpart G defines the quality system requirements that each approved MRO organisation must implement including a documented quality management system compliant with IS AS9100 Rev D aerospace quality management standards incorporating quality audit programmes process control procedures non-conformance management and continuous improvement methodologies where the dual-release certification documentation process requires each MRO facility to maintain bilateral recognition agreements with foreign aviation authorities enabling the issuance of combined DGCA release certificates and FAA 8130-3 authorised release certificates or EASA Form 1 authorised release certificates for single work packages where the MRO quality system must demonstrate traceability of all maintenance actions to the applicable aircraft maintenance manual AMM component maintenance manual CMM and approved repair procedures with full recorded traceability of consumable materials used during maintenance including sealant batch numbers adhesive cure records and composite material shelf-life verification where the non-destructive testing NDT inspection quality control framework requires all NDT personnel to hold DGCA-approved NDT certifications in accordance with CAR Series M Part II Subpart F covering six primary NDT methods including eddy current testing for surface and subsurface crack detection in turbofan engine blades and landing gear components magnetic particle inspection for ferromagnetic component surface defect detection liquid penetrant testing for non-ferrous component surface crack detection ultrasonic testing for internal defect detection in composite fuselage panels and structural components radiographic testing for internal defect detection in thick-section structural assemblies and visual inspection with borescope equipment for internal cavity inspection of engine modules hydraulic actuators and fuel system valve blocks where each NDT method requires specific procedure qualification test piece validation and periodic proficiency demonstration by the certified NDT technician ensuring consistent defect detection capability across the Indian MRO facility network.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>ESD-Protected Packaging for Avionics Component Transit</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">ESD-protected packaging with moisture barrier sealed containment and shock-absorbing foam cushioning has been specifically designed for the Indian aerospace MRO supply chain to protect sensitive avionics line replaceable units LRU modules composite material assemblies and precision-engineered mechanical components from electrostatic discharge damage moisture ingress and mechanical shock during transit between MRO facilities and aircraft operator bases across India and international destinations where the avionics LRU component packaging specification utilises ESD-protective pink polyethylene bags with surface resistance between ten to the power six and ten to the power nine ohms measured in accordance with IEC 61340-5-1 electrostatic discharge protection methodology providing dissipative protection for sensitive electronic circuit boards and semiconductor devices within the avionics LRU modules where the ESD-protected bag is placed inside a moisture barrier bag with water vapour transmission rate below zero point zero five grams per square metre per day measured in accordance with MIL-PRF-81705 moisture barrier bag specification preventing moisture condensation on sensitive electronic surfaces during transit through high-humidity environments where the inner packaging uses custom-moulded expanded polyethylene EPE foam cushioning inserts engineered to the precise dimensions of each avionics component providing shock absorption capacity of at least forty G deceleration at impact velocity of one point five metres per second measured in accordance with ASTM D4168 packaged product testing methodology ensuring the avionics component remains protected from the mechanical shock and vibration hazards encountered during road and air transit from the MRO facility to the aircraft operator base where the outer packaging utilises reusable ATA Category I containers constructed from aerospace-grade aluminium alloy with minimum wall thickness of one point five millimetres providing crush resistance of five hundred kilograms measured in accordance with ATA Specification 300 container testing methodology ensuring the container protects the avionics component from stacking loads and handling impacts during multi-modal transit operations where the complete packaging assembly includes a desiccant pack with moisture absorption capacity calculated based on the internal packaging volume and expected transit duration maintaining relative humidity below thirty percent within the sealed packaging preventing moisture-induced corrosion of electrical connectors and degradation of conformal coating protection on printed circuit board assemblies during the extended transit cycle from MRO facility to aircraft installation.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Bonded Warehouse & India MRO Hub Growth Strategy</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">Bonded warehouse and customs-stored facilities operated by Indian MRO organisations under DGCA and Indian Customs supervision provide the critical infrastructure for managing high-value rotable aircraft components and engine modules valued at millions of dollars per unit where the bonded warehouse facility enables duty-free import of aircraft spare parts and rotable components from international OEM suppliers including General Electric Aviation Pratt and Whitney Rolls-Royce and Safran Aircraft Engines for use in aircraft maintenance and repair activities without requiring immediate customs duty payment significantly reducing the working capital requirements for Indian MRO operators who can import expensive rotable components on an as-needed basis and return serviceable components to the bonded store for future installation on subsequent aircraft maintenance events where the bonded warehouse inventory management system maintains real-time visibility of rotable component availability location condition status and certification validity enabling MRO planners to efficiently allocate rotable components to maintenance work packages across the MRO network reducing aircraft-on-ground AOG delay durations and improving fleet availability for airline customers where the inventory includes turbofan engine hot-section modules compressor spools turbine blade sets and fan discs with individual unit values exceeding two million dollars requiring precise chain-of-custody documentation and photographic condition recording at each inventory transaction ensuring complete traceability for insurance and regulatory compliance purposes. The India MRO hub growth strategy driven by the Ministry of Civil Aviation and the Make in India aerospace manufacturing initiative has established ambitious targets for expanding the Indian MRO industry to capture five percent of the global MRO market valued at approximately eighty billion US dollars by twenty thirty through development of new MRO facilities at Ahmedabad and Guwahati airports expansion of existing MRO capacity at Bengaluru Hyderabad Nagpur and Mumbai airports and establishment of India as a preferred MRO destination for both domestic and international carriers through regulatory streamlining GST rationalisation on MRO services and development of a skilled workforce through DGCA-approved AME training institutions producing over five hundred licensed aircraft maintenance engineers annually to meet the growing demand for qualified MRO personnel in the rapidly expanding Indian aviation maintenance industry.</p></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}



