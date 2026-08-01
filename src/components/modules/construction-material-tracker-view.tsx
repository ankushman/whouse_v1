import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#ea580c', '#c2410c', '#f97316', '#fb923c', '#fdba74', '#9a3412', '#7c2d12', '#fed7aa']
const PRODUCTS = ['OPC 53 Grade Cement', 'TMT Steel Rebar 12mm', 'Clay Bricks Class A', 'River Sand Zone II', 'Coarse Aggregate 20mm', 'Seasoned Timber Sal', 'Vitrified Floor Tiles', 'PVC Electrical Conduit']
const ARTISANS = ['Mumbai Metro Line 9', 'Delhi Smart City Phase', 'Bengaluru Airport T3', 'Hyderabad IT Corridor', 'Chennai Port Expansion', 'Pune Highway NH48', 'Kolkata Bridge Project', 'Nagpur MIHAN SEZ']
const STATUSES = ['BIS IS 269 Certified', 'Cube Strength Verified', 'Moisture Content OK', 'Particle Size Passed', 'Warehouse Stored Safe', 'Refrigerator Cold Chain']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-orange-100 text-orange-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="w-24 h-2 bg-orange-200 rounded-full overflow-hidden"><div className="h-full bg-orange-700 rounded-full" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ label, value, size = 80 }: { label: string; value: number; size?: number }) => {
  const r = (size - 12) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#fed7aa" strokeWidth="6" />
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
    id: `CMT-${String(offset + i + 1).padStart(4, '0')}`,
    site: ARTISANS[(offset + i) % ARTISANS.length], material: PRODUCTS[(offset + i) % PRODUCTS.length],
    status: STATUSES[(offset + i) % STATUSES.length], qty: ri(1, 50, ((offset + i) * 19) % 50) + 1,
    cost: ri(12000, 450000, ((offset + i) * 31207) % 438000) + 12000,
    date: new Date(2024, ((offset + i) % 12), ri(1, 28, (offset + i) % 28)).toISOString().slice(0, 10),
  }))

const cmtrecords = [
  { id: 'CMT-0001', site: 'Mumbai Metro Line 9', material: 'OPC 53 Grade Cement', status: 'BIS IS 269 Certified', qty: 40, cost: 280000, date: '2024-01-15' },
  { id: 'CMT-0002', site: 'Delhi Smart City Phase', material: 'TMT Steel Rebar 12mm', status: 'Cube Strength Verified', qty: 25, cost: 420000, date: '2024-01-28' },
  { id: 'CMT-0003', site: 'Bengaluru Airport T3', material: 'Clay Bricks Class A', status: 'Moisture Content OK', qty: 50, cost: 75000, date: '2024-02-10' },
  { id: 'CMT-0004', site: 'Hyderabad IT Corridor', material: 'River Sand Zone II', status: 'Particle Size Passed', qty: 30, cost: 150000, date: '2024-02-22' },
  { id: 'CMT-0005', site: 'Chennai Port Expansion', material: 'Coarse Aggregate 20mm', status: 'Warehouse Stored Safe', qty: 35, cost: 120000, date: '2024-03-08' },
  { id: 'CMT-0006', site: 'Pune Highway NH48', material: 'Seasoned Timber Sal', status: 'Refrigerator Cold Chain', qty: 20, cost: 450000, date: '2024-03-20' },
  { id: 'CMT-0007', site: 'Kolkata Bridge Project', material: 'Vitrified Floor Tiles', status: 'BIS IS 269 Certified', qty: 15, cost: 180000, date: '2024-04-03' },
  { id: 'CMT-0008', site: 'Nagpur MIHAN SEZ', material: 'PVC Electrical Conduit', status: 'Cube Strength Verified', qty: 45, cost: 65000, date: '2024-04-16' },
  { id: 'CMT-0009', site: 'Mumbai Metro Line 9', material: 'OPC 53 Grade Cement', status: 'Moisture Content OK', qty: 40, cost: 260000, date: '2024-04-28' },
  { id: 'CMT-0010', site: 'Delhi Smart City Phase', material: 'TMT Steel Rebar 12mm', status: 'Particle Size Passed', qty: 25, cost: 440000, date: '2024-05-10' },
  { id: 'CMT-0011', site: 'Bengaluru Airport T3', material: 'Clay Bricks Class A', status: 'Warehouse Stored Safe', qty: 50, cost: 80000, date: '2024-05-23' },
  { id: 'CMT-0012', site: 'Hyderabad IT Corridor', material: 'River Sand Zone II', status: 'Refrigerator Cold Chain', qty: 30, cost: 140000, date: '2024-06-05' },
  { id: 'CMT-0013', site: 'Chennai Port Expansion', material: 'Coarse Aggregate 20mm', status: 'BIS IS 269 Certified', qty: 35, cost: 130000, date: '2024-06-18' },
  { id: 'CMT-0014', site: 'Pune Highway NH48', material: 'Seasoned Timber Sal', status: 'Cube Strength Verified', qty: 20, cost: 430000, date: '2024-07-01' },
  { id: 'CMT-0015', site: 'Kolkata Bridge Project', material: 'Vitrified Floor Tiles', status: 'Moisture Content OK', qty: 15, cost: 190000, date: '2024-07-14' },
  { id: 'CMT-0016', site: 'Nagpur MIHAN SEZ', material: 'PVC Electrical Conduit', status: 'Particle Size Passed', qty: 45, cost: 58000, date: '2024-07-26' },
  { id: 'CMT-0017', site: 'Mumbai Metro Line 9', material: 'OPC 53 Grade Cement', status: 'Warehouse Stored Safe', qty: 40, cost: 290000, date: '2024-08-08' },
  { id: 'CMT-0018', site: 'Delhi Smart City Phase', material: 'TMT Steel Rebar 12mm', status: 'Refrigerator Cold Chain', qty: 25, cost: 410000, date: '2024-08-20' },
  { id: 'CMT-0019', site: 'Bengaluru Airport T3', material: 'Clay Bricks Class A', status: 'BIS IS 269 Certified', qty: 50, cost: 72000, date: '2024-09-02' },
  { id: 'CMT-0020', site: 'Hyderabad IT Corridor', material: 'River Sand Zone II', status: 'Cube Strength Verified', qty: 30, cost: 155000, date: '2024-09-14' },
]

export default function ConstructionMaterialTrackerView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})

  const allRecords = [...cmtrecords, ...genRecords(21), ...genRecords(41)]

  const filteredRecords = useMemo(() => {
    if (!searchQuery && Object.keys(activeFilters).every(k => !activeFilters[k].length)) return allRecords
    const sq = searchQuery.toLowerCase()
    return allRecords.filter(r => { if (sq && !r.id.toLowerCase().includes(sq) && !r.material.toLowerCase().includes(sq)) return false; return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string)); })
  }, [searchQuery, activeFilters, allRecords])

  const filterGroups = [
    { key: 'material', label: 'Material', options: PRODUCTS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.material === p).length })) },
    { key: 'site', label: 'Site', options: ARTISANS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.site === p).length })) },
  ]

  const trendData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m, i) => ({ month: m, shipments: ri(4, 20, allRecords.length * 0.10 + i * 3) }))
  const siteChart = ARTISANS.map(p => ({ name: p.split(' ').slice(0, 2).join(' '), volume: allRecords.filter(r => r.site === p).reduce((s, r) => s + r.qty, 0) }))
  const statusPie = STATUSES.map(s => ({ name: s, value: allRecords.filter(r => r.status === s).length }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="cmt-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Construction Material' }]} />
      <PageHeader title="Construction Material Tracker Logistics" description="Indian construction material supply chain tracking with BIS IS 269 certification and cube strength verification for OPC 53 grade cement TMT steel rebar clay bricks river sand coarse aggregate seasoned timber vitrified floor tiles and PVC electrical conduit across eight major infrastructure project sites including Mumbai Metro Delhi Smart City Bengaluru Airport Hyderabad IT Corridor Chennai Port Pune Highway Kolkata Bridge and Nagpur MIHAN" />
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="bg-orange-100">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <KpiTile label="Total Shipments" value={allRecords.length} />
            <KpiTile label="Material Types" value={PRODUCTS.length} />
            <KpiTile label="Project Sites" value={ARTISANS.length} />
            <KpiTile label="Avg Cost" value={`₹${Math.round(allRecords.reduce((s, r) => s + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>
          <div className="grid grid-cols-6 gap-4">
            <HealthRing label="BIS" value={94} />
            <HealthRing label="Strength" value={89} />
            <HealthRing label="Moisture" value={87} />
            <HealthRing label="Particle" value={91} />
            <HealthRing label="Storage" value={93} />
            <HealthRing label="Cold" value={85} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="BIS Certified" value="1800+ Sites" />
            <ValueTile label="Annual Value" value="₹85K Crore" />
            <ValueTile label="Infra Projects" value="4200+ Active" />
            <ValueTile label="Make in India" value="68% Domestic" />
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
            placeholder="Search construction material shipments..."
          />
          <div className="rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-orange-100">
                <tr>
                  <th className="p-3 text-left font-medium">ID</th>
                  <th className="p-3 text-left font-medium">Material</th>
                  <th className="p-3 text-left font-medium">Site</th>
                  <th className="p-3 text-left font-medium">Status</th>
                  <th className="p-3 text-left font-medium">Qty</th>
                  <th className="p-3 text-left font-medium">Cost</th>
                  <th className="p-3 text-left font-medium">Cost Bar</th>
                  <th className="p-3 text-left font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map(record => (
                  <tr key={record.id} className="border-t hover:bg-orange-50/50">
                    <td className="p-3 font-mono text-xs">{record.id}</td>
                    <td className="p-3"><ProductBadge name={record.material} /></td>
                    <td className="p-3">{record.site}</td>
                    <td className="p-3"><StatusBadge status={record.status} /></td>
                    <td className="p-3">{record.qty} {['bags', 'tonnes', 'units', 'cum'][parseInt(record.id.slice(4)) % 4]}</td>
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
              <CardHeader><CardTitle>Site Volume</CardTitle></CardHeader>
              <CardContent>
                <BarChart width={500} height={300} data={siteChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="volume" fill={COLORS[0]}>
                    {siteChart.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
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
              <CardHeader><CardTitle>Indian Construction Material Supply Chain — INR 85 Lakh Crore Ecosystem</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The Indian construction material supply chain represents the largest and most logistically complex industrial ecosystem in India with an estimated annual material movement value exceeding INR eighty-five lakh crore encompassing cement production ranked second globally with over four hundred million tonnes per annum steel production ranked second globally with over one hundred twenty million tonnes per annum aggregate sand and quarry materials exceeding two billion cubic metres per annum timber and plywood products bricks and blocks ceramic tiles sanitary ware electrical and plumbing materials glass aluminium and steel structural components and over five hundred additional material categories supplied to construction project sites across India including over four thousand two hundred active infrastructure projects ranging from national highway construction metro rail systems airport expansions smart city developments port and harbour modernisation to residential and commercial building construction valued collectively at over USD one point five trillion where the construction material supply chain operates through a complex network of over three hundred cement plants twelve thousand steel rebar rolling mills twenty thousand brick kilns fifteen thousand stone crushing aggregate units and thousands of specialised material manufacturers and distributors connected by road rail and coastal shipping logistics networks delivering materials to project sites typically within a one hundred to five hundred kilometre radius from manufacturing locations through regional distribution warehouses and project site staging areas with delivery scheduling coordinated through advanced supply chain management platforms integrating material requirement planning fleet dispatch optimisation project schedule alignment and quality compliance tracking ensuring continuous material availability at the construction site without stockout delays that would halt construction activities costing project developers between one hundred thousand and five hundred thousand rupees per day of idle construction crew and equipment downtime.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>BIS IS 269 Certification & Cube Strength Verification Framework</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The BIS IS 269 certification and cube strength verification framework establishes the primary quality assurance architecture for the Indian construction material supply chain ensuring all cement steel and structural materials meet the stringent quality requirements mandated by the Bureau of Indian Standards and the National Building Code of India where BIS IS 269 certification for ordinary Portland cement requires compliance with chemical composition limits including lime saturation factor between zero point sixty-six and one point zero two alumina ratio between zero point two and zero point six and iron oxide ratio below two point five confirming the cement clinker chemistry produces optimal hydraulic binding properties when mixed with water and aggregate producing concrete with the specified compressive strength development characteristics where the cube strength verification test requires casting standard one hundred fifty millimetre concrete cubes at the construction site using the project-specified concrete mix design curing the cubes in a Refrigerator temperature-controlled water curing tank at twenty-seven degrees Celsius plus or minus two degrees for seven and twenty-eight days before testing the cubes in a calibrated compression testing machine confirming the twenty-eight day characteristic compressive strength meets or exceeds the specified design grade whether M25 M30 M35 M40 M45 or M50 grade concrete confirming minimum average of three cubes at twenty-eight days exceeds the specified characteristic strength plus one point six five times the standard deviation of the test results where the cube strength test is the most critical quality verification for structural concrete because the compressive strength of hardened concrete directly determines the structural capacity and safety of the building framework including columns beams slabs foundations and shear walls where inadequate cube strength indicating below-specification concrete would require demolition and reconstruction of the affected structural elements at enormous cost and schedule delay making the cube strength verification test the single most important quality gate in the construction material supply chain.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Moisture Content & Particle Size Distribution Standards</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The moisture content and particle size distribution standards for Indian construction materials establish the technical verification framework ensuring material quality and performance consistency across the construction supply chain where the moisture content test measures the water content in construction materials including sand aggregate timber and cement using oven drying methodology confirming sand moisture content below six percent by mass aggregate moisture content below two percent by mass timber moisture content between eight and twelve percent for structural applications and cement moisture content below zero point five percent to prevent premature hydration and lumpy cement formation during storage and transit where excessive moisture in sand and aggregate causes water-cement ratio deviation in the concrete mix producing weaker concrete with reduced compressive strength and increased permeability while insufficient moisture in timber causes cracking splitting and dimensional instability during structural use where the particle size distribution test evaluates the gradation of sand and aggregate using standard IS sieve analysis with sieve sizes ranging from eighty millimetres to seventy-five micrometres confirming the particle size distribution curve falls within the specified upper and lower grading limits for Zone I through Zone IV sand and single-sized or graded aggregate ensuring proper packing density and workability of the concrete mix where incorrect particle size distribution produces either harsh unworkable concrete with excessive void content requiring additional cement paste to achieve workability or overly fine mixes with excessive fines content causing shrinkage cracking and reduced surface durability of the hardened concrete where the Refrigerator temperature-controlled storage facility for cement and moisture-sensitive materials maintains storage temperature between twenty and thirty degrees Celsius with relative humidity below sixty percent preventing moisture absorption and premature cement hydration that would reduce the binding strength and shelf life of the construction materials.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Refrigerator Cold Storage & Infrastructure Material Logistics Network</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The Refrigerator cold storage infrastructure and advanced logistics network for Indian construction materials represents the temperature-controlled and time-critical delivery framework required for moisture-sensitive and temperature-vulnerable construction materials including cement requiring storage in Refrigerator temperature-controlled dry environments below thirty degrees Celsius and relative humidity below sixty percent to prevent moisture absorption and premature hydration that reduces cement binding strength and shelf life by approximately fifteen percent per month in humid conditions where the construction material logistics network operates with delivery precision measured in hours rather than days for critical path materials on active construction sites requiring dedicated fleet vehicles equipped with GPS tracking real-time temperature monitoring and electronic proof of delivery systems ensuring each material shipment arrives at the project site within the specified delivery window of four to twelve hours from warehouse dispatch to construction site receiving bay where the advanced logistics management platform integrates project schedule-based material requirement planning generated from the construction project bill of quantities and critical path method schedule with supplier production planning fleet dispatch optimisation multi-modal route planning considering road conditions traffic patterns and axle load restrictions for overweight construction material transport and project site receiving bay scheduling to minimise unloading time and storage handling cost while maintaining the quality chain of custody from supplier production facility through Refrigerator temperature-controlled warehouse storage to project site staging area ensuring construction materials arrive in optimal condition for immediate deployment in the construction activity sequence without the quality degradation storage damage or moisture contamination that occurs with uncontrolled storage and logistics handling in the Indian construction supply chain where the infrastructure logistics network manages over two hundred million tonnes of cement three hundred million tonnes of aggregate and structural steel and one billion cubic metres of sand and quarry materials annually across India requiring the largest material movement logistics operation in the country.</p></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}



