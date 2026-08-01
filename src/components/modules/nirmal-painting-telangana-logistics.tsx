import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#991b1b', '#b91c1c', '#dc2626', '#ef4444', '#fca5a5', '#7f1d1d', '#450a0a', '#fef2f2']
const PRODUCTS = ['Nirmal Wooden Mysore Box', 'Gold-Foil Mughal Panel', 'Floral Lacquer Coaster Set', 'Nirmal Painted Tray', 'Miniature Temple Panel', 'Bird Motif Decorative Plate', 'Nirmal Jewel Box', 'Nirmal Wall Hanging Frame']
const PAINTERS = ['Nirmal Town Artisan Guild', 'Kakatiya Heritage Painters', 'Adilabad Nirmal Society', 'Nizamabad Folk Art Centre', 'Kamareddy Nirmal Colony', 'Nirmal Rural Craft Workshop', 'Bodhan Nirmal Cooperative', 'Dichpalli Artisan Collective']
const STATUSES = ['GI Nirmal Painting Mark', 'IS 16910 Nirmal Art Grade A', 'Foam-Padded Wooden Box', 'Enclosed Truck Transit', 'Dry Storage 20-28C', 'Gold Foil Adhesion QC']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-red-100 text-red-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="w-24 h-2 bg-red-200 rounded-full overflow-hidden"><div className="h-full bg-red-700 rounded-full" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ label, value, size = 80 }: { label: string; value: number; size?: number }) => {
  const r = (size - 12) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#fef2f2" strokeWidth="6" />
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
    id: `NPT-${String(offset + i + 1).padStart(4, '0')}`,
    painter: PAINTERS[(offset + i) % PAINTERS.length], ware: PRODUCTS[(offset + i) % PRODUCTS.length],
    status: STATUSES[(offset + i) % STATUSES.length], qty: ri(1, 250, ((offset + i) * 37) % 250) + 1,
    cost: ri(1200, 35000, ((offset + i) * 13097) % 33800) + 1200,
    date: new Date(2024, ((offset + i) % 12), ri(1, 28, (offset + i) % 28)).toISOString().slice(0, 10),
  }))

const nirmalRecords = [
  { id: 'NPT-0001', painter: 'Nirmal Town Artisan Guild', ware: 'Nirmal Wooden Mysore Box', status: 'GI Nirmal Painting Mark', qty: 40, cost: 8500, date: '2024-01-15' },
  { id: 'NPT-0002', painter: 'Kakatiya Heritage Painters', ware: 'Gold-Foil Mughal Panel', status: 'IS 16910 Nirmal Art Grade A', qty: 18, cost: 28000, date: '2024-01-22' },
  { id: 'NPT-0003', painter: 'Adilabad Nirmal Society', ware: 'Floral Lacquer Coaster Set', status: 'Foam-Padded Wooden Box', qty: 120, cost: 3200, date: '2024-02-03' },
  { id: 'NPT-0004', painter: 'Nizamabad Folk Art Centre', ware: 'Nirmal Painted Tray', status: 'Enclosed Truck Transit', qty: 55, cost: 6400, date: '2024-02-14' },
  { id: 'NPT-0005', painter: 'Kamareddy Nirmal Colony', ware: 'Miniature Temple Panel', status: 'Dry Storage 20-28C', qty: 22, cost: 22000, date: '2024-02-28' },
  { id: 'NPT-0006', painter: 'Nirmal Rural Craft Workshop', ware: 'Bird Motif Decorative Plate', qty: 80, cost: 2800, date: '2024-03-05', status: 'Gold Foil Adhesion QC' },
  { id: 'NPT-0007', painter: 'Bodhan Nirmal Cooperative', ware: 'Nirmal Jewel Box', status: 'GI Nirmal Painting Mark', qty: 35, cost: 15000, date: '2024-03-18' },
  { id: 'NPT-0008', painter: 'Dichpalli Artisan Collective', ware: 'Nirmal Wall Hanging Frame', status: 'IS 16910 Nirmal Art Grade A', qty: 28, cost: 18500, date: '2024-03-25' },
  { id: 'NPT-0009', painter: 'Kakatiya Heritage Painters', ware: 'Nirmal Wooden Mysore Box', status: 'Foam-Padded Wooden Box', qty: 45, cost: 9200, date: '2024-04-02' },
  { id: 'NPT-0010', painter: 'Adilabad Nirmal Society', ware: 'Gold-Foil Mughal Panel', status: 'Enclosed Truck Transit', qty: 15, cost: 32000, date: '2024-04-10' },
  { id: 'NPT-0011', painter: 'Nizamabad Folk Art Centre', ware: 'Floral Lacquer Coaster Set', status: 'Dry Storage 20-28C', qty: 100, cost: 2600, date: '2024-04-22' },
  { id: 'NPT-0012', painter: 'Kamareddy Nirmal Colony', ware: 'Nirmal Painted Tray', status: 'Gold Foil Adhesion QC', qty: 60, cost: 5800, date: '2024-05-01' },
  { id: 'NPT-0013', painter: 'Nirmal Rural Craft Workshop', ware: 'Miniature Temple Panel', status: 'GI Nirmal Painting Mark', qty: 25, cost: 24000, date: '2024-05-15' },
  { id: 'NPT-0014', painter: 'Bodhan Nirmal Cooperative', ware: 'Bird Motif Decorative Plate', status: 'IS 16910 Nirmal Art Grade A', qty: 90, cost: 2400, date: '2024-05-28' },
  { id: 'NPT-0015', painter: 'Dichpalli Artisan Collective', ware: 'Nirmal Jewel Box', status: 'Foam-Padded Wooden Box', qty: 32, cost: 16500, date: '2024-06-05' },
  { id: 'NPT-0016', painter: 'Nirmal Town Artisan Guild', ware: 'Nirmal Wall Hanging Frame', status: 'Enclosed Truck Transit', qty: 20, cost: 21000, date: '2024-06-18' },
  { id: 'NPT-0017', painter: 'Bodhan Nirmal Cooperative', ware: 'Nirmal Wooden Mysore Box', status: 'Dry Storage 20-28C', qty: 50, cost: 7800, date: '2024-06-25' },
  { id: 'NPT-0018', painter: 'Dichpalli Artisan Collective', ware: 'Gold-Foil Mughal Panel', status: 'Gold Foil Adhesion QC', qty: 16, cost: 30000, date: '2024-07-03' },
  { id: 'NPT-0019', painter: 'Nirmal Rural Craft Workshop', ware: 'Floral Lacquer Coaster Set', status: 'GI Nirmal Painting Mark', qty: 110, cost: 2200, date: '2024-07-12' },
  { id: 'NPT-0020', painter: 'Nirmal Town Artisan Guild', ware: 'Miniature Temple Panel', status: 'IS 16910 Nirmal Art Grade A', qty: 30, cost: 19500, date: '2024-07-20' },
]

export default function NirmalPaintingTelanganaLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = [...nirmalRecords, ...genRecords(21), ...genRecords(41)]

  const filteredRecords = useMemo(() => {
    if (!searchQuery && Object.keys(activeFilters).every(k => !activeFilters[k].length)) return allRecords
    const sq = searchQuery.toLowerCase()
    return allRecords.filter(r => { if (sq && !r.id.toLowerCase().includes(sq) && !r.ware.toLowerCase().includes(sq)) return false; return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string)); })
  }, [searchQuery, activeFilters, allRecords])

  const filterGroups = [
    { key: 'ware', label: 'Ware', options: PRODUCTS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.ware === p).length })) },
    { key: 'painter', label: 'Painter', options: PAINTERS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.painter === p).length })) },
  ]

  const trendData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m, i) => ({ month: m, shipments: ri(20, 80, allRecords.length * 0.3 + i * 12) }))
  const painterChart = PAINTERS.map(p => ({ name: p.split(' ').slice(0, 2).join(' '), volume: allRecords.filter(r => r.painter === p).reduce((s, r) => s + r.qty, 0) }))
  const statusPie = STATUSES.map(s => ({ name: s, value: allRecords.filter(r => r.status === s).length }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="npt-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Nirmal Painting Telangana' }]} />
      <PageHeader title="Nirmal Painting Telangana Logistics" description="Telangana Nirmal wood painting supply chain with IS 16910 Nirmal art compliance, gold foil embossing QC, foam-padded wooden box packaging, and GI Nirmal Painting Mark certification across 8 heritage artisan clusters in Nirmal town, Nizamabad district" />
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="bg-red-100">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <KpiTile label="Total Shipments" value={allRecords.length} />
            <KpiTile label="Active Ware" value={PRODUCTS.length} />
            <KpiTile label="Painter Clusters" value={PAINTERS.length} />
            <KpiTile label="Avg Cost" value={`₹${Math.round(allRecords.reduce((s, r) => s + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>
          <div className="grid grid-cols-6 gap-4">
            <HealthRing label="GI Tag" value={93} />
            <HealthRing label="IS 16910" value={89} />
            <HealthRing label="Foam" value={85} />
            <HealthRing label="Truck" value={82} />
            <HealthRing label="Storage" value={90} />
            <HealthRing label="Foil" value={94} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Artisan Families" value="1,500+" />
            <ValueTile label="Nirmal Town" value="Since 14th C" />
            <ValueTile label="Export Markets" value="15 Countries" />
            <ValueTile label="Annual Revenue" value="₹8 Crore" />
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
            placeholder="Search Nirmal painting shipments..."
          />
          <div className="rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-red-100">
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
                  <tr key={record.id} className="border-t hover:bg-red-50/50">
                    <td className="p-3 font-mono text-xs">{record.id}</td>
                    <td className="p-3"><ProductBadge name={record.ware} /></td>
                    <td className="p-3">{record.painter}</td>
                    <td className="p-3"><StatusBadge status={record.status} /></td>
                    <td className="p-3">{record.qty} {['pcs', 'sets', 'pairs', 'units'][parseInt(record.id.slice(4)) % 4]}</td>
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
              <CardHeader><CardTitle>Painter Volume</CardTitle></CardHeader>
              <CardContent>
                <BarChart width={500} height={300} data={painterChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="volume" fill={COLORS[0]}>
                    {painterChart.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
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
              <CardHeader><CardTitle>Nirmal Painting — 700-Year Kakatiya Heritage of Telangana</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Nirmal painting is a centuries-old decorative art form originating from Nirmal town in the Nizamabad district of Telangana, with its roots tracing back to the 14th century Kakatiya dynasty when local artisans developed a unique technique of painting on locally sourced white spongy wood, known locally as poniki or nirmal wood, which is lightweight, fine-grained, and ideal for detailed brushwork. The art form flourished under the patronage of the Nizam of Hyderabad in the 17th and 18th centuries, who commissioned elaborate Nirmal painted furniture, wall panels, and ceremonial objects for his palaces. The distinctive Nirmal style features miniature Mughal court scenes, rich floral patterns, and depictions of Hindu deities painted using natural mineral and vegetable-derived colours on a specially prepared white primer coating made from refined white clay mixed with gum arabic. The most exquisite Nirmal works incorporate gold foil embossing where thin sheets of 22-carat gold leaf are meticulously applied over painted designs, creating a luxurious three-dimensional effect that catches light and adds remarkable depth to the miniature paintings. Today approximately 1,500 artisan families across eight heritage clusters in and around Nirmal town continue this tradition, with the craft providing primary livelihood for communities in Nizamabad, Adilabad, and Kamareddy districts of Telangana, generating an estimated 8 crore rupees annually through domestic sales, government emporiums, and growing international demand for authentic Indian handicraft decorative art pieces.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>IS 16910 Nirmal Art Quality Standards & Gold Foil Certification</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">The IS 16910 standard for Nirmal painted art products establishes India's first dedicated quality certification framework for this unique Telangana wood-painting tradition, ensuring consistency and authenticity across the Nirmal craft supply chain. The standard specifies stringent requirements for the poniki wood substrate, mandating moisture content between 8-12% and minimum density of 0.4 g/cm3 to ensure the lightweight wood maintains structural integrity through the multi-stage preparation process involving sanding, primer application, painting, and optional gold foil embossing. Paint quality requirements mandate the use of natural mineral pigments or artist-grade synthetic equivalents with minimum lightfastness ratings of 5 on the ASTM D4303 scale, ensuring the vibrant Nirmal colours resist fading under prolonged display conditions. For gold-foil embossed pieces, IS 16910 Grade A certification requires genuine 22-carat gold leaf with minimum thickness of 0.1 microns, verified through X-ray fluorescence spectroscopy at NABL-accredited laboratories, distinguishing authentic hand-embossed Nirmal art from cheaper electroplated imitations. Adhesion testing demands the gold foil maintain 95% surface coverage after 200 cycles of standard abrasion testing using the Taber Abraser method with CS-10 calibration wheels, simulating years of gentle handling and cleaning that decorative art pieces experience in residential and hospitality environments.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Foam-Padded Wooden Box Packaging for Nirmal Painted Art</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Foam-padded wooden box packaging has been specifically engineered for Nirmal painted art products to protect the delicate painted surfaces, gold foil embossing, and lightweight poniki wood substrate from the multiple hazards encountered during transit from the Nirmal town artisan workshops to urban retail destinations across India and international export markets. Each individual Nirmal piece undergoes a careful multi-layer wrapping protocol: first wrapped in soft anti-static polyethylene film to prevent any paint transfer or gold foil abrasion, then placed in a custom-cut high-density polyethylene foam insert moulded to the exact piece profile, providing 360-degree cushioning that absorbs shock energy from drops and vibration during truck and rail transit. The foam-wrapped piece is secured within a custom-made wooden box constructed from lightweight but rigid poplar or pine boards, with additional foam corner blocks and top-layer foam padding ensuring zero movement within the enclosure during transit. Silica gel desiccant packets are included in every package to maintain relative humidity below 45%, as the poniki wood substrate is hygroscopic and can absorb moisture during the monsoon season that prevails across Telangana from June through September, potentially causing wood expansion that stresses the painted surface and gold foil embossing. The packaging system has been tested to ISTA 3A transit simulation protocols, demonstrating capability to withstand drops from 60 centimetres without any damage to the painted surface or gold foil elements, reducing the historical transit damage rate from 8% to under 2% since its adoption across the Nirmal craft supply chain in 2024.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>AI Gold Foil Pattern Verification & Nirmal Art Market Expansion</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Artificial intelligence and advanced imaging technologies are bringing transformative quality assurance capabilities to the Nirmal painting craft, where the intricate gold foil embossing work that defines the highest quality pieces has traditionally required years of master artisan experience to authenticate and grade accurately. The AI verification system employs structured light 3D scanning to create precise surface topography maps of each gold-embossed Nirmal piece, measuring foil thickness uniformity across the painted surface with accuracy to 0.01 millimetres and detecting imperfections such as air bubbles, uneven adhesion, or foil lifting that indicate substandard workmanship or improper storage conditions before transit. Computer vision algorithms trained on over 15,000 authenticated Nirmal art patterns can verify design authenticity by comparing brush stroke patterns, colour palette consistency, and compositional balance against a reference database of master artisan works, providing objective quality grading that supplements the traditional subjective assessment by experienced craft evaluators. The Telangana State Handicrafts Development Corporation has integrated this AI verification into its procurement and export certification pipeline, reducing quality rejection rates at government emporiums from 15% to under 3% while simultaneously accelerating the certification process from an average of 5 working days to under 24 hours. India's GI protection for Nirmal painting, combined with the digital authentication infrastructure, has opened new export opportunities with luxury home decor retailers in Europe, North America, and the Middle East who demand verifiable provenance documentation for premium-priced heritage craft products.</p></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
