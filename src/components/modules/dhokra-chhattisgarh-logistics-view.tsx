import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#92400e', '#b45309', '#d97706', '#f59e0b', '#fbbf24', '#78350f', '#451a03', '#fffbeb']
const PRODUCTS = ['Dhokra Horse figurine', 'Dhokra Elephant pair', 'Dhokra Tree of Life', 'Dhokra Peacock Stand', 'Dhokra Dancing Girl', 'Dhokra Snake Basket Handle', 'Dhokra Fish Wall Panel', 'Dhokra Tortoise Incense']
const ARTISANS = ['Bastar Dhokra Craft CG', 'Jagdalpur Lost Wax Guild CG', 'Kondagaon Tribal Art CG', 'Dantewada Bronze Atelier CG', 'Sarguja Dhokra Cluster CG', 'Kanker Metalworkers CG', 'Raipur Heritage Foundry CG', 'Narayanpur Tribal Collective CG']
const STATUSES = ['GI Chhattisgarh Dhokra Mark', 'Wax Pattern Mould QC', 'Clay Coating Thickness Test', 'Metal Pour Temp Check', 'Patina Finish Audit', 'Lost Wax Detail Fidelity']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-amber-100 text-amber-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="w-24 h-2 bg-amber-200 rounded-full overflow-hidden"><div className="h-full bg-amber-700 rounded-full" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ label, value, size = 80 }: { label: string; value: number; size?: number }) => {
  const r = (size - 12) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#fffbeb" strokeWidth="6" />
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
    id: `DHK-${String(offset + i + 1).padStart(4, '0')}`,
    artisan: ARTISANS[(offset + i) % ARTISANS.length], design: PRODUCTS[(offset + i) % PRODUCTS.length],
    status: STATUSES[(offset + i) % STATUSES.length], qty: ri(1, 12, ((offset + i) * 19) % 12) + 1,
    cost: ri(3500, 48000, ((offset + i) * 11307) % 44500) + 3500,
    date: new Date(2024, ((offset + i) % 12), ri(1, 28, (offset + i) % 28)).toISOString().slice(0, 10),
  }))

const dhokrarecords = [
  { id: 'DHK-0001', artisan: 'Bastar Dhokra Craft CG', design: 'Dhokra Horse figurine', status: 'GI Chhattisgarh Dhokra Mark', qty: 4, cost: 42000, date: '2024-01-10' },
  { id: 'DHK-0002', artisan: 'Jagdalpur Lost Wax Guild CG', design: 'Dhokra Elephant pair', status: 'Wax Pattern Mould QC', qty: 3, cost: 38000, date: '2024-01-22' },
  { id: 'DHK-0003', artisan: 'Kondagaon Tribal Art CG', design: 'Dhokra Tree of Life', status: 'Clay Coating Thickness Test', qty: 5, cost: 48000, date: '2024-02-05' },
  { id: 'DHK-0004', artisan: 'Dantewada Bronze Atelier CG', design: 'Dhokra Peacock Stand', status: 'Metal Pour Temp Check', qty: 6, cost: 32000, date: '2024-02-18' },
  { id: 'DHK-0005', artisan: 'Sarguja Dhokra Cluster CG', design: 'Dhokra Dancing Girl', status: 'Patina Finish Audit', qty: 8, cost: 18000, date: '2024-03-02' },
  { id: 'DHK-0006', artisan: 'Kanker Metalworkers CG', design: 'Dhokra Snake Basket Handle', status: 'Lost Wax Detail Fidelity', qty: 3, cost: 44000, date: '2024-03-15' },
  { id: 'DHK-0007', artisan: 'Raipur Heritage Foundry CG', design: 'Dhokra Fish Wall Panel', status: 'GI Chhattisgarh Dhokra Mark', qty: 7, cost: 22000, date: '2024-03-28' },
  { id: 'DHK-0008', artisan: 'Narayanpur Tribal Collective CG', design: 'Dhokra Tortoise Incense', status: 'Wax Pattern Mould QC', qty: 4, cost: 36000, date: '2024-04-10' },
  { id: 'DHK-0009', artisan: 'Bastar Dhokra Craft CG', design: 'Dhokra Horse figurine', status: 'Clay Coating Thickness Test', qty: 5, cost: 28000, date: '2024-04-23' },
  { id: 'DHK-0010', artisan: 'Jagdalpur Lost Wax Guild CG', design: 'Dhokra Elephant pair', status: 'Metal Pour Temp Check', qty: 3, cost: 46000, date: '2024-05-06' },
  { id: 'DHK-0011', artisan: 'Kondagaon Tribal Art CG', design: 'Dhokra Tree of Life', status: 'Patina Finish Audit', qty: 6, cost: 24000, date: '2024-05-19' },
  { id: 'DHK-0012', artisan: 'Dantewada Bronze Atelier CG', design: 'Dhokra Peacock Stand', status: 'Lost Wax Detail Fidelity', qty: 4, cost: 40000, date: '2024-06-01' },
  { id: 'DHK-0013', artisan: 'Sarguja Dhokra Cluster CG', design: 'Dhokra Dancing Girl', status: 'GI Chhattisgarh Dhokra Mark', qty: 8, cost: 16000, date: '2024-06-14' },
  { id: 'DHK-0014', artisan: 'Kanker Metalworkers CG', design: 'Dhokra Snake Basket Handle', status: 'Wax Pattern Mould QC', qty: 3, cost: 42000, date: '2024-06-27' },
  { id: 'DHK-0015', artisan: 'Raipur Heritage Foundry CG', design: 'Dhokra Fish Wall Panel', status: 'Clay Coating Thickness Test', qty: 5, cost: 34000, date: '2024-07-10' },
  { id: 'DHK-0016', artisan: 'Narayanpur Tribal Collective CG', design: 'Dhokra Tortoise Incense', status: 'Metal Pour Temp Check', qty: 7, cost: 20000, date: '2024-07-23' },
  { id: 'DHK-0017', artisan: 'Bastar Dhokra Craft CG', design: 'Dhokra Horse figurine', status: 'Patina Finish Audit', qty: 4, cost: 38000, date: '2024-08-05' },
  { id: 'DHK-0018', artisan: 'Jagdalpur Lost Wax Guild CG', design: 'Dhokra Elephant pair', status: 'Lost Wax Detail Fidelity', qty: 3, cost: 48000, date: '2024-08-18' },
  { id: 'DHK-0019', artisan: 'Kondagaon Tribal Art CG', design: 'Dhokra Tree of Life', status: 'GI Chhattisgarh Dhokra Mark', qty: 6, cost: 30000, date: '2024-08-31' },
  { id: 'DHK-0020', artisan: 'Dantewada Bronze Atelier CG', design: 'Dhokra Peacock Stand', status: 'Wax Pattern Mould QC', qty: 4, cost: 36000, date: '2024-09-13' },
]

export default function DhokraChhattisgarhLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})

  const allRecords = [...dhokrarecords, ...genRecords(21), ...genRecords(41)]

  const filteredRecords = useMemo(() => {
    if (!searchQuery && Object.keys(activeFilters).every(k => !activeFilters[k].length)) return allRecords
    const sq = searchQuery.toLowerCase()
    return allRecords.filter(r => { if (sq && !r.id.toLowerCase().includes(sq) && !r.design.toLowerCase().includes(sq)) return false; return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string)); })
  }, [searchQuery, activeFilters, allRecords])

  const filterGroups = [
    { key: 'design', label: 'Design', options: PRODUCTS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.design === p).length })) },
    { key: 'artisan', label: 'Artisan', options: ARTISANS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.artisan === p).length })) },
  ]

  const trendData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m, i) => ({ month: m, shipments: ri(4, 20, allRecords.length * 0.10 + i * 3) }))
  const artisanChart = ARTISANS.map(p => ({ name: p.split(' ').slice(0, 2).join(' '), volume: allRecords.filter(r => r.artisan === p).reduce((s, r) => s + r.qty, 0) }))
  const statusPie = STATUSES.map(s => ({ name: s, value: allRecords.filter(r => r.status === s).length }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="dhk-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Dhokra Art' }]} />
      <PageHeader title="Dhokra Chhattisgarh Logistics" description="Chhattisgarh Dhokra lost-wax bronze casting supply chain with GI Chhattisgarh Dhokra Mark certification, wax pattern mould quality control, clay coating thickness testing, metal pour temperature verification, patina finish audit, and lost-wax detail fidelity assessment across 8 tribal artisan clusters in Bastar Jagdalpur Kondagaon and Narayanpur" />
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="bg-amber-100">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <KpiTile label="Total Shipments" value={allRecords.length} />
            <KpiTile label="Active Designs" value={PRODUCTS.length} />
            <KpiTile label="Tribal Clusters" value={ARTISANS.length} />
            <KpiTile label="Avg Cost" value={`₹${Math.round(allRecords.reduce((s, r) => s + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>
          <div className="grid grid-cols-6 gap-4">
            <HealthRing label="GI Tag" value={93} />
            <HealthRing label="Wax" value={86} />
            <HealthRing label="Clay" value={90} />
            <HealthRing label="Pour" value={88} />
            <HealthRing label="Patina" value={91} />
            <HealthRing label="Fidelity" value={94} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Dhokra Families" value="15 Active" />
            <ValueTile label="Tradition" value="Since 4000 BC" />
            <ValueTile label="Export Markets" value="5 Countries" />
            <ValueTile label="Annual Revenue" value="₹1.2 Crore" />
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
            placeholder="Search Dhokra art shipments..."
          />
          <div className="rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-amber-100">
                <tr>
                  <th className="p-3 text-left font-medium">ID</th>
                  <th className="p-3 text-left font-medium">Design</th>
                  <th className="p-3 text-left font-medium">Artisan</th>
                  <th className="p-3 text-left font-medium">Status</th>
                  <th className="p-3 text-left font-medium">Qty</th>
                  <th className="p-3 text-left font-medium">Cost</th>
                  <th className="p-3 text-left font-medium">Cost Bar</th>
                  <th className="p-3 text-left font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map(record => (
                  <tr key={record.id} className="border-t hover:bg-amber-50/50">
                    <td className="p-3 font-mono text-xs">{record.id}</td>
                    <td className="p-3"><ProductBadge name={record.design} /></td>
                    <td className="p-3">{record.artisan}</td>
                    <td className="p-3"><StatusBadge status={record.status} /></td>
                    <td className="p-3">{record.qty} {['figurines', 'pairs', 'panels', 'stands'][parseInt(record.id.slice(4)) % 4]}</td>
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
              <CardHeader><CardTitle>Artisan Volume</CardTitle></CardHeader>
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
              <CardHeader><CardTitle>Dhokra Art — Ancient Chhattisgarh Lost-Wax Bronze Casting Tradition</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">Dhokra art represents one of the oldest and most culturally significant metal casting traditions in the world having originated in the tribal communities of the Chhattisgarh and Odisha region approximately four thousand years ago with archaeological evidence linking the technique to the Indus Valley Civilisation where the Mohenjo-daro Dancing Girl bronze figurine dating to approximately twenty five hundred BCE is the earliest known example of the lost-wax casting technique that continues to be practised by the tribal Dhokra artisans of Bastar Kondagaon Jagdalpur and Narayanpur in Chhattisgarh today where the Dhokra lost-wax casting process begins with the preparation of a detailed wax model using pure beeswax mixed with resin from the dammar tree that produces a pliable modelling material allowing the artisan to shape intricate figurative and decorative designs entirely by hand without any moulds or mechanical assistance where the wax model is then coated with multiple layers of fine river clay mixed with rice husk and cow dung creating a thick ceramic shell mould around the wax pattern that is dried in the sun for two to three days before being fired in a traditional charcoal kiln called the bhatti where the firing process melts the wax which drains out through vent channels leaving a hollow ceramic mould cavity that perfectly replicates the original wax model in negative form where molten brass or bronze alloy prepared from scrap metal and copper is then poured into the hot ceramic mould cavity through the pouring channel filling all the fine surface details of the original wax model where after cooling the ceramic mould is broken open to reveal the cast metal figurine with its surface faithfully reproducing every detail of the original hand-modelled wax pattern including the characteristic rough-textured organic surface quality that distinguishes authentic Dhokra castings from machine-made reproductions where the traditional Dhokra design vocabulary features animal figurines including horses elephants peacocks and turtles human figurines depicting tribal dancers musicians and daily life scenes decorative objects including tree of life panels wall hangings ceremonial vessels and ritual objects used in tribal festivals and ceremonies reflecting the deep animistic cultural traditions of the Gond Muria and Dhruva tribal communities of Bastar.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Wax Pattern Mould QC and Clay Coating Thickness Standards</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The wax pattern mould quality control and clay coating thickness testing protocols for Dhokra art establish the primary technical quality assurance framework for the traditional lost-wax bronze casting process that determines the dimensional accuracy surface detail fidelity and casting quality of the finished Dhokra metal art piece where the wax pattern mould test evaluates the dimensional accuracy and surface quality of each hand-modelled beeswax figure before the clay coating process begins using digital caliper measurement confirming that all critical dimensions of the wax pattern fall within plus or minus two millimetres of the approved design template ensuring the finished bronze casting will match the intended size and proportion specifications where the wax surface quality inspection checks for surface defects including air bubbles from trapped air during wax modelling surface cracks from rapid cooling of the wax and finger marks from excessive handling that would transfer to the final metal casting as unwanted surface imperfections where the wax-to-wax batch consistency test confirms that multiple wax copies of the same design produced from the same master mould demonstrate dimensional variation within plus or minus one millimetre ensuring batch production consistency for wholesale orders of identical Dhokra figurines where the clay coating thickness test measures the ceramic shell thickness at multiple points on the mould using ultrasonic thickness gauging confirming minimum coating thickness of eight millimetres for small figurines under ten centimetres twelve millimetres for medium pieces ten to thirty centimetres and fifteen millimetres for large pieces over thirty centimetres ensuring the ceramic mould provides adequate structural strength to contain the molten bronze during the metal pour without mould rupture or leakage that would destroy both the casting and the mould where insufficient clay coating thickness causes dangerous mould rupture during metal pouring while excessive coating thickness impairs the heat transfer during solidification resulting in coarse grain structure and poor surface detail reproduction in the finished Dhokra bronze casting.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Metal Pour Temperature Check and Patina Finish Verification</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The metal pour temperature check and patina finish verification protocols ensure the metallurgical quality and surface aesthetics of authentic Dhokra bronze castings where the metal pour temperature test monitors the molten brass bronze alloy temperature at the point of pouring into the ceramic mould using a calibrated optical pyrometer confirming the pour temperature falls within the optimal range of nine hundred fifty to one thousand fifty degrees Celsius for the traditional Dhokra brass alloy composition of sixty percent copper and forty percent zinc where the pour temperature must be carefully controlled because insufficient temperature produces incomplete mould filling leaving voids porosity and poorly defined surface details in the finished casting while excessive temperature causes metal penetration into the ceramic mould surface producing unwanted rough sand inclusions and metal flash on the casting surface that requires extensive post-casting finishing to remove where the pour temperature test also confirms the alloy melt homogeneity by measuring the temperature at three different depths in the crucible confirming temperature variation within plus or minus ten degrees Celsius indicating complete alloy mixing and consistent composition throughout the melt where the patina finish test evaluates the quality and colour of the natural patina that develops on the Dhokra bronze surface over time using visual inspection under standardised D65 daylight illumination conditions confirming the patina colour falls within the accepted range of warm amber brown to deep chocolate brown tones that characterise premium quality Dhokra bronze art where the patina uniformity test examines the patina distribution across the entire surface of the figurine confirming consistent patina colour and intensity without uneven patches streaks or areas of raw metal showing through the patina layer where the patina adhesion test uses a standard tape peel test on the patina surface confirming the patina layer is firmly bonded to the bronze substrate without flaking peeling or powdering that would indicate improper surface preparation or accelerated corrosion from environmental exposure.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Lost-Wax Detail Fidelity and Dhokra Tribal Heritage Market</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The lost-wax detail fidelity assessment and Dhokra tribal heritage market development framework provides the artistic quality assurance and commercial market infrastructure for the Dhokra art supply chain ensuring that all GI-certified Dhokra art products demonstrate the extraordinary lost-wax casting detail and authentic tribal artistic character that defines this ancient Chhattisgarh metal art tradition while connecting the fifteen remaining active Dhokra artisan families across Bastar Jagdalpur Kondagaon Narayanpur Dantewada and Sarguja with growing institutional and international collector market demand for authentic tribal bronze art where the lost-wax detail fidelity test evaluates the precision of surface detail reproduction in the finished bronze casting by comparing a silicone rubber impression taken from the casting surface against the original wax pattern using digital microscopy at twenty-five-times magnification confirming all fine surface details including finger impressions from hand modelling tool marks from wax shaping textural patterns from organic materials and decorative incisions are faithfully reproduced in the bronze casting with detail reproduction accuracy exceeding ninety-five percent for all design elements ensuring the finished Dhokra piece retains the distinctive handcrafted organic surface quality that distinguishes authentic lost-wax Dhokra castings from machine-made investment cast reproductions where the detail fidelity test also checks for common casting defects including cold shuts where two metal streams fail to merge completely shrinkage cavities from uneven solidification and surface porosity from gas entrapment during the pour confirming all tested pieces are free of defects that would compromise the artistic quality and structural integrity of the Dhokra art piece where the Dhokra tribal heritage market development initiative led by the Chhattisgarh State Tribal Welfare Department in collaboration with TRIFED the Tribal Cooperative Marketing Development Federation of India and the Bastar District Craft Development Authority has established institutional procurement programmes connecting the fifteen active Dhokra artisan clusters with the Tribal India retail chain the National Crafts Museum New Delhi the Surajkund Crafts Mela international exhibition and export markets in Europe North America and East Asia with projected annual revenue growth of eighteen percent.</p></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}



