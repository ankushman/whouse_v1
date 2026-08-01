import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#0284c7', '#0369a1', '#0ea5e9', '#38bdf8', '#7dd3fc', '#075985', '#0c4a6e', '#bae6fd']
const PRODUCTS = ['Engine Components', 'Brake Systems', 'Transmission Assemblies', 'Electrical Harness', 'Suspension Parts', 'Body Panels', 'Exhaust Systems', 'Wheel Bearings']
const ARTISANS = ['Maruti Suzuki Manesar', 'Tata Motors Pune', 'Mahindra Nashik', 'Hyundai Sriperumbudur', 'Honda Greater Noida', 'Toyota Bidadi', 'Kia Anantapur', 'MG Halol']
const STATUSES = ['IATF 16949 Certified', 'PPAP Level 3 Approved', 'Incoming QC Passed', 'Dimensional Check OK', 'Material Traceability Verified', 'Final Inspection Cleared']

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
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#bae6fd" strokeWidth="6" />
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
    id: `AUT-${String(offset + i + 1).padStart(4, '0')}`,
    oem: ARTISANS[(offset + i) % ARTISANS.length], part: PRODUCTS[(offset + i) % PRODUCTS.length],
    status: STATUSES[(offset + i) % STATUSES.length], qty: ri(1, 25, ((offset + i) * 19) % 25) + 1,
    cost: ri(8500, 120000, ((offset + i) * 20507) % 111500) + 8500,
    date: new Date(2024, ((offset + i) % 12), ri(1, 28, (offset + i) % 28)).toISOString().slice(0, 10),
  }))

const autorecords = [
  { id: 'AUT-0001', oem: 'Maruti Suzuki Manesar', part: 'Engine Components', status: 'IATF 16949 Certified', qty: 20, cost: 95000, date: '2024-01-15' },
  { id: 'AUT-0002', oem: 'Tata Motors Pune', part: 'Brake Systems', status: 'PPAP Level 3 Approved', qty: 12, cost: 62000, date: '2024-01-28' },
  { id: 'AUT-0003', oem: 'Mahindra Nashik', part: 'Transmission Assemblies', status: 'Incoming QC Passed', qty: 8, cost: 115000, date: '2024-02-10' },
  { id: 'AUT-0004', oem: 'Hyundai Sriperumbudur', part: 'Electrical Harness', status: 'Dimensional Check OK', qty: 15, cost: 48000, date: '2024-02-22' },
  { id: 'AUT-0005', oem: 'Honda Greater Noida', part: 'Suspension Parts', status: 'Material Traceability Verified', qty: 10, cost: 88000, date: '2024-03-08' },
  { id: 'AUT-0006', oem: 'Toyota Bidadi', part: 'Body Panels', status: 'Final Inspection Cleared', qty: 18, cost: 35000, date: '2024-03-20' },
  { id: 'AUT-0007', oem: 'Kia Anantapur', part: 'Exhaust Systems', status: 'IATF 16949 Certified', qty: 6, cost: 120000, date: '2024-04-03' },
  { id: 'AUT-0008', oem: 'MG Halol', part: 'Wheel Bearings', status: 'PPAP Level 3 Approved', qty: 24, cost: 22000, date: '2024-04-16' },
  { id: 'AUT-0009', oem: 'Maruti Suzuki Manesar', part: 'Engine Components', status: 'Incoming QC Passed', qty: 20, cost: 98000, date: '2024-04-28' },
  { id: 'AUT-0010', oem: 'Tata Motors Pune', part: 'Brake Systems', status: 'Dimensional Check OK', qty: 12, cost: 58000, date: '2024-05-10' },
  { id: 'AUT-0011', oem: 'Mahindra Nashik', part: 'Transmission Assemblies', status: 'Material Traceability Verified', qty: 8, cost: 112000, date: '2024-05-23' },
  { id: 'AUT-0012', oem: 'Hyundai Sriperumbudur', part: 'Electrical Harness', status: 'Final Inspection Cleared', qty: 15, cost: 44000, date: '2024-06-05' },
  { id: 'AUT-0013', oem: 'Honda Greater Noida', part: 'Suspension Parts', status: 'IATF 16949 Certified', qty: 10, cost: 92000, date: '2024-06-18' },
  { id: 'AUT-0014', oem: 'Toyota Bidadi', part: 'Body Panels', status: 'PPAP Level 3 Approved', qty: 18, cost: 38000, date: '2024-07-01' },
  { id: 'AUT-0015', oem: 'Kia Anantapur', part: 'Exhaust Systems', status: 'Incoming QC Passed', qty: 6, cost: 115000, date: '2024-07-14' },
  { id: 'AUT-0016', oem: 'MG Halol', part: 'Wheel Bearings', status: 'Dimensional Check OK', qty: 24, cost: 25000, date: '2024-07-26' },
  { id: 'AUT-0017', oem: 'Maruti Suzuki Manesar', part: 'Engine Components', status: 'Material Traceability Verified', qty: 20, cost: 100000, date: '2024-08-08' },
  { id: 'AUT-0018', oem: 'Tata Motors Pune', part: 'Brake Systems', status: 'Final Inspection Cleared', qty: 12, cost: 55000, date: '2024-08-20' },
  { id: 'AUT-0019', oem: 'Mahindra Nashik', part: 'Transmission Assemblies', status: 'IATF 16949 Certified', qty: 8, cost: 120000, date: '2024-09-02' },
  { id: 'AUT-0020', oem: 'Hyundai Sriperumbudur', part: 'Electrical Harness', status: 'PPAP Level 3 Approved', qty: 15, cost: 42000, date: '2024-09-14' },
]

export default function AutomotivePartsLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})

  const allRecords = [...autorecords, ...genRecords(21), ...genRecords(41)]

  const filteredRecords = useMemo(() => {
    if (!searchQuery && Object.keys(activeFilters).every(k => !activeFilters[k].length)) return allRecords
    const sq = searchQuery.toLowerCase()
    return allRecords.filter(r => { if (sq && !r.id.toLowerCase().includes(sq) && !r.part.toLowerCase().includes(sq)) return false; return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string)); })
  }, [searchQuery, activeFilters, allRecords])

  const filterGroups = [
    { key: 'part', label: 'Part Type', options: PRODUCTS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.part === p).length })) },
    { key: 'oem', label: 'OEM Facility', options: ARTISANS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.oem === p).length })) },
  ]

  const trendData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m, i) => ({ month: m, shipments: ri(4, 20, allRecords.length * 0.10 + i * 3) }))
  const oemChart = ARTISANS.map(p => ({ name: p.split(' ').slice(0, 1).join(' '), volume: allRecords.filter(r => r.oem === p).reduce((s, r) => s + r.qty, 0) }))
  const statusPie = STATUSES.map(s => ({ name: s, value: allRecords.filter(r => r.status === s).length }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="aut-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Automotive Parts' }]} />
      <PageHeader title="Automotive Parts Logistics" description="Indian automotive parts supply chain logistics with IATF 16949 quality management certification and PPAP production part approval process for engine components brake systems transmission assemblies electrical harness suspension parts body panels exhaust systems and wheel bearings across eight major OEM manufacturing facilities including Maruti Suzuki Tata Motors Mahindra Hyundai Honda Toyota Kia and MG Motor" />
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="bg-sky-100">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <KpiTile label="Total Shipments" value={allRecords.length} />
            <KpiTile label="Part Types" value={PRODUCTS.length} />
            <KpiTile label="OEM Plants" value={ARTISANS.length} />
            <KpiTile label="Avg Cost" value={`₹${Math.round(allRecords.reduce((s, r) => s + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>
          <div className="grid grid-cols-6 gap-4">
            <HealthRing label="IATF" value={94} />
            <HealthRing label="PPAP" value={89} />
            <HealthRing label="Incoming" value={91} />
            <HealthRing label="Dimension" value={93} />
            <HealthRing label="Trace" value={96} />
            <HealthRing label="Final" value={90} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="IATF Sites" value="2800+" />
            <ValueTile label="Annual Value" value="₹57K Crore" />
            <ValueTile label="Make in India" value="72% Local" />
            <ValueTile label="JIT Plants" value="45 Active" />
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
            placeholder="Search automotive parts shipments..."
          />
          <div className="rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-sky-100">
                <tr>
                  <th className="p-3 text-left font-medium">ID</th>
                  <th className="p-3 text-left font-medium">Part</th>
                  <th className="p-3 text-left font-medium">OEM Facility</th>
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
                    <td className="p-3"><ProductBadge name={record.part} /></td>
                    <td className="p-3">{record.oem}</td>
                    <td className="p-3"><StatusBadge status={record.status} /></td>
                    <td className="p-3">{record.qty} {['pcs', 'sets', 'units', 'pairs'][parseInt(record.id.slice(4)) % 4]}</td>
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
              <CardHeader><CardTitle>OEM Facility Volume</CardTitle></CardHeader>
              <CardContent>
                <BarChart width={500} height={300} data={oemChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="volume" fill={COLORS[0]}>
                    {oemChart.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
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
              <CardHeader><CardTitle>Indian Automotive Supply Chain — USD 120 Billion Components Ecosystem</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The Indian automotive parts supply chain represents one of the largest and most globally integrated manufacturing ecosystems in India with an estimated annual production value exceeding USD one hundred twenty billion encompassing engine components brake systems transmission assemblies electrical wiring harnesses suspension parts body panels exhaust systems wheel bearings and over two thousand additional component categories supplied to eight major original equipment manufacturers operating fifteen vehicle assembly plants across India producing over twenty-five million vehicles annually including passenger cars utility vehicles commercial trucks buses two-wheelers and three-wheelers where the Indian automotive components industry is the fourth largest globally by value after China United States and Japan with over eight hundred tier-one suppliers and three thousand tier-two suppliers providing employment to over five million workers directly and indirectly where the supply chain operates predominantly on just-in-time and just-in-sequence delivery principles with supplier plants located within fifty to two hundred kilometre radius of each OEM assembly facility ensuring delivery within four to eight hours of production order release through a sophisticated logistics network of dedicated fleet operators multi-modal transportation hubs and supplier-managed inventory systems at OEM plant gate warehouses where the Indian automotive supply chain has achieved remarkable quality improvement over the past two decades transitioning from ISO 9001 certification to the more stringent IATF 16949 quality management system standard with over twenty-eight hundred IATF 16949 certified supplier facilities across India ensuring comprehensive process control traceability and continuous improvement in component quality dimensional accuracy material consistency and delivery reliability meeting the exacting requirements of both domestic OEM customers and international vehicle manufacturers sourcing components from India for global assembly operations.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>IATF 16949 Quality Management & PPAP Approval Framework</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The IATF 16949 quality management system certification and PPAP production part approval process framework establishes the primary quality assurance architecture for the Indian automotive parts supply chain ensuring all manufactured components meet the stringent quality requirements mandated by global automotive industry standards where IATF 16949 certification requires implementation of a comprehensive quality management system based on ISO 9001 with automotive-specific requirements including advanced product quality planning with failure mode effects analysis during design and process development process capability studies confirming Cpk values above one point thirty-three for all critical-to-quality characteristics measurement system analysis confirming gauge repeatability and reproducibility below thirty percent for all measurement systems statistical process control using X-bar and R charts with control limits at plus or minus three sigma for all critical process parameters production part approval process requiring PPAP Level Three submission including design records engineering change documents process flow diagrams process failure mode effects analysis control plans measurement system analysis dimensional results material test results initial process studies qualified laboratory documentation appearance approval report sample production parts and master sample retention for all new parts and process changes where the PPAP approval process requires the supplier to demonstrate that the manufacturing process consistently produces parts meeting all customer engineering drawing specifications material requirements dimensional tolerances and performance characteristics at the quoted production rate during a significant production run of minimum three hundred consecutive parts with zero critical defects and less than two percent minor defects confirming full process capability and readiness for series production delivery where the incoming quality control inspection at the OEM warehouse verifies each shipment against the PPAP-approved part specifications using advanced measurement equipment including coordinate measuring machines optical comparators surface roughness testers hardness testers and metallurgical analysis equipment confirming dimensional conformance material composition and mechanical properties before accepting the shipment for production line consumption.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Dimensional Inspection & Material Traceability Standards</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The dimensional inspection and material traceability standards for Indian automotive parts logistics establish the verification framework ensuring that all received components precisely match engineering specifications and maintain complete material provenance records from raw material source through finished component delivery where the dimensional check inspection uses coordinate measuring machines calibrated to national standards with measurement uncertainty below two micrometres verifying critical geometric dimensioning and tolerancing characteristics including flatness roundness cylindricity positional tolerances and profile tolerances on engine components transmission parts brake system elements and structural body panels confirming conformance to drawing tolerances typically ranging from plus or minus zero point zero five millimetres for precision machined surfaces to plus or minus one point five millimetres for stamped body panels using structured light scanning and laser tracker systems for large body panel dimensional verification producing full-surface deviation maps comparing actual part geometry against CAD model specification within the tolerance envelope where the material traceability verification system requires each automotive component shipment to carry complete traceability documentation including raw material mill test certificates confirming chemical composition and mechanical properties heat treatment records with time-temperature profile documentation surface treatment records including plating coating and painting process parameters batch identification numbers linking each component to the specific production batch melt cast and heat treatment lot ensuring complete forward and backward traceability throughout the supply chain enabling targeted containment and recall action if a quality deviation is detected at any point in the production or delivery pipeline where the material traceability system integrates with the OEM plant enterprise resource planning system providing real-time visibility of component provenance from raw material source through supplier production logistics delivery and OEM assembly line consumption supporting the stringent quality management requirements of the Indian automotive manufacturing ecosystem.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Refrigerator Cold Chain & JIT Logistics for Automotive Components</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The Refrigerator cold chain storage and just-in-time logistics infrastructure for Indian automotive parts represents the advanced temperature-controlled and time-critical delivery framework required for temperature-sensitive automotive components including rubber seals and gaskets that require storage in Refrigerator temperature-controlled environments between five and twenty-five degrees Celsius to prevent rubber degradation and hardening polymer bushings that require controlled temperature and humidity storage to maintain dimensional stability and mechanical performance characteristics adhesives and sealants that require Refrigerator storage between two and eight degrees Celsius to prevent premature curing and viscosity changes lithium-ion battery cells for electric vehicle applications that require climate-controlled storage at fifteen to twenty-five degrees Celsius with humidity below sixty percent to prevent electrolyte degradation and thermal runaway risk and electronic control units and sensors that require storage in temperature-controlled environments preventing solder joint fatigue and electronic component degradation where the just-in-time logistics network operates with delivery precision measured in hours rather than days requiring dedicated temperature-controlled fleet vehicles equipped with GPS tracking real-time temperature monitoring and electronic proof of delivery systems ensuring each component shipment arrives at the OEM plant gate within the specified delivery window of four to eight hours from production order release at the supplier facility where the advanced logistics management platform integrates supplier production scheduling fleet dispatch optimisation route planning with traffic pattern analysis and OEM plant receiving dock scheduling to minimise delivery time and inventory holding cost while maintaining the temperature chain of custody from supplier Refrigerator storage through transit to OEM receiving warehouse ensuring temperature-sensitive automotive components arrive in optimal condition for immediate production line deployment without the quality degradation that occurs with uncontrolled temperature exposure during storage and transit.</p></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}



