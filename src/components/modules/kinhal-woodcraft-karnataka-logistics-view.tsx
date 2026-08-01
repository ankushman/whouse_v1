import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#5b3a29', '#7c5240', '#9d6a57', '#be826e', '#df9a85', '#3d271b', '#2e1d14', '#ebd5c8']
const PRODUCTS = ['Kinhal Lacquerware Elephant Toy', 'Kinhal Marionette Doll Set', 'Kinhal Carved Hanuman Figurine', 'Kinhal Wooden Tamburi Instrument', 'Kinhal Lacquerware Spice Box', 'Kinhal Temple Mural Panel', 'Kinhal Turning Lathe Top Set', 'Kinhal Polished Sandalwood Box']
const ARTISANS = ['Kinhal Lacquer Artisans Guild KA', 'Koppal Woodcraft Cooperative KA', 'Gangavathi Kinhal Society', 'Kushtagi Traditional Artisans KA', 'Yelburga Wood Carvers Guild KA', 'Hospet Heritage Crafts Cluster', 'Bellary Kinhal Workshop Network', 'Raichur Traditional Toy Makers KA']
const STATUSES = ['GI Karnataka Kinhal Toy Mark', 'IS 15856 Wood Toy Safety A', 'Lacquer Coat Curing QC', 'Palletised Rail Container', 'Dehumidified Storage 25-35C', 'Wrightia Wood Moisture QC']

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
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#fae8ff" strokeWidth="6" />
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
    id: `KWC-${String(offset + i + 1).padStart(4, '0')}`,
    painter: ARTISANS[(offset + i) % ARTISANS.length], ware: PRODUCTS[(offset + i) % PRODUCTS.length],
    status: STATUSES[(offset + i) % STATUSES.length], qty: ri(1, 20, ((offset + i) * 19) % 20) + 1,
    cost: ri(4000, 52000, ((offset + i) * 10707) % 48000) + 4000,
    date: new Date(2024, ((offset + i) % 12), ri(1, 28, (offset + i) % 28)).toISOString().slice(0, 10),
  }))

const kinhalRecords = [
  { id: 'KWC-0001', painter: 'Kinhal Lacquer Artisans Guild KA', ware: 'Kinhal Lacquerware Elephant Toy', status: 'GI Karnataka Kinhal Toy Mark', qty: 5, cost: 48000, date: '2024-01-18' },
  { id: 'KWC-0002', painter: 'Koppal Woodcraft Cooperative KA', ware: 'Kinhal Marionette Doll Set', status: 'IS 15856 Wood Toy Safety A', qty: 4, cost: 42000, date: '2024-01-31' },
  { id: 'KWC-0003', painter: 'Gangavathi Kinhal Society', ware: 'Kinhal Carved Hanuman Figurine', status: 'Lacquer Coat Curing QC', qty: 8, cost: 18000, date: '2024-02-13' },
  { id: 'KWC-0004', painter: 'Kushtagi Traditional Artisans KA', ware: 'Kinhal Wooden Tamburi Instrument', status: 'Palletised Rail Container', qty: 6, cost: 14000, date: '2024-02-25' },
  { id: 'KWC-0005', painter: 'Yelburga Wood Carvers Guild KA', ware: 'Kinhal Lacquerware Spice Box', status: 'Dehumidified Storage 25-35C', qty: 10, cost: 8000, date: '2024-03-10' },
  { id: 'KWC-0006', painter: 'Hospet Heritage Crafts Cluster', ware: 'Kinhal Temple Mural Panel', status: 'Wrightia Wood Moisture QC', qty: 3, cost: 50000, date: '2024-03-23' },
  { id: 'KWC-0007', painter: 'Bellary Kinhal Workshop Network', ware: 'Kinhal Turning Lathe Top Set', status: 'GI Karnataka Kinhal Toy Mark', qty: 6, cost: 16000, date: '2024-04-05' },
  { id: 'KWC-0008', painter: 'Raichur Traditional Toy Makers KA', ware: 'Kinhal Polished Sandalwood Box', status: 'IS 15856 Wood Toy Safety A', qty: 12, cost: 6000, date: '2024-04-18' },
  { id: 'KWC-0009', painter: 'Kinhal Lacquer Artisans Guild KA', ware: 'Kinhal Marionette Doll Set', status: 'Lacquer Coat Curing QC', qty: 4, cost: 44000, date: '2024-05-01' },
  { id: 'KWC-0010', painter: 'Koppal Woodcraft Cooperative KA', ware: 'Kinhal Lacquerware Elephant Toy', status: 'Palletised Rail Container', qty: 5, cost: 46000, date: '2024-05-13' },
  { id: 'KWC-0011', painter: 'Gangavathi Kinhal Society', ware: 'Kinhal Carved Hanuman Figurine', status: 'Dehumidified Storage 25-35C', qty: 8, cost: 20000, date: '2024-05-25' },
  { id: 'KWC-0012', painter: 'Kushtagi Traditional Artisans KA', ware: 'Kinhal Wooden Tamburi Instrument', status: 'Wrightia Wood Moisture QC', qty: 6, cost: 12000, date: '2024-06-07' },
  { id: 'KWC-0013', painter: 'Yelburga Wood Carvers Guild KA', ware: 'Kinhal Lacquerware Spice Box', status: 'GI Karnataka Kinhal Toy Mark', qty: 10, cost: 10000, date: '2024-06-19' },
  { id: 'KWC-0014', painter: 'Hospet Heritage Crafts Cluster', ware: 'Kinhal Temple Mural Panel', status: 'IS 15856 Wood Toy Safety A', qty: 3, cost: 52000, date: '2024-07-01' },
  { id: 'KWC-0015', painter: 'Bellary Kinhal Workshop Network', ware: 'Kinhal Turning Lathe Top Set', status: 'Lacquer Coat Curing QC', qty: 7, cost: 18000, date: '2024-07-13' },
  { id: 'KWC-0016', painter: 'Raichur Traditional Toy Makers KA', ware: 'Kinhal Polished Sandalwood Box', status: 'Palletised Rail Container', qty: 15, cost: 5000, date: '2024-07-25' },
  { id: 'KWC-0017', painter: 'Kinhal Lacquer Artisans Guild KA', ware: 'Kinhal Lacquerware Elephant Toy', status: 'Dehumidified Storage 25-35C', qty: 4, cost: 44000, date: '2024-08-07' },
  { id: 'KWC-0018', painter: 'Koppal Woodcraft Cooperative KA', ware: 'Kinhal Marionette Doll Set', status: 'Wrightia Wood Moisture QC', qty: 5, cost: 40000, date: '2024-08-19' },
  { id: 'KWC-0019', painter: 'Gangavathi Kinhal Society', ware: 'Kinhal Carved Hanuman Figurine', status: 'GI Karnataka Kinhal Toy Mark', qty: 8, cost: 22000, date: '2024-08-31' },
  { id: 'KWC-0020', painter: 'Kushtagi Traditional Artisans KA', ware: 'Kinhal Wooden Tamburi Instrument', status: 'IS 15856 Wood Toy Safety A', qty: 6, cost: 14000, date: '2024-09-12' },
]

export default function KinhalWoodcraftKarnatakaLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})

  const allRecords = [...kinhalRecords, ...genRecords(21), ...genRecords(41)]

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
    <div className="kwc-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Kinhal Woodcraft' }]} />
      <PageHeader title="Kinhal Woodcraft Karnataka Logistics" description="Karnataka Kinhal lacquerware toy and woodcraft supply chain with IS 15856 toy safety certification, lacquer coat curing quality control, Wrightia tinctoria wood moisture QC, and GI Karnataka Kinhal Mark across 8 artisan communities in Koppal, Gangavathi, and Kushtagi" />
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
            <KpiTile label="Active Ware" value={PRODUCTS.length} />
            <KpiTile label="Weaving Clusters" value={ARTISANS.length} />
            <KpiTile label="Avg Cost" value={`₹${Math.round(allRecords.reduce((s, r) => s + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>
          <div className="grid grid-cols-6 gap-4">
            <HealthRing label="GI Tag" value={93} />
            <HealthRing label="IS 16796" value={86} />
            <HealthRing label="Muslin" value={81} />
            <HealthRing label="Truck" value={77} />
            <HealthRing label="Dry" value={84} />
            <HealthRing label="Tensile" value={89} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Weaver Families" value="20+" />
            <ValueTile label="Tradition" value="Since 6th C" />
            <ValueTile label="Export Markets" value="4 Countries" />
            <ValueTile label="Annual Revenue" value="₹1.8 Crore" />
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
            placeholder="Search Kinhal woodcraft shipments..."
          />
          <div className="rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-amber-100">
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
                  <tr key={record.id} className="border-t hover:bg-amber-50/50">
                    <td className="p-3 font-mono text-xs">{record.id}</td>
                    <td className="p-3"><ProductBadge name={record.ware} /></td>
                    <td className="p-3">{record.painter}</td>
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
              <CardHeader><CardTitle>Kinhal Woodcraft — 500-Year Koppal Karnataka Lacquerware Toy Heritage</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">Kinhal woodcraft represents one of the most distinctive and culturally significant traditional toy-making and lacquerware art traditions of South India having been continuously practised for over five centuries by the hereditary Vishwakarma and Chitragara artisan communities of Kinhal village in Koppal district of Karnataka where master woodcarvers and lacquerwork artisans create extraordinarily beautiful lacquer-coated wooden toys marionettes religious figurines musical instruments and decorative objects characterised by the unique Kinhal lacquerware technique where hand-carved wooden forms created from locally available Wrightia tinctoria known as Hale or Kanni wood and Anogeissus latifolia known as Doddala wood are coated with multiple layers of natural lacquer prepared from the resin of the lac insect Laccifer lacca Kerr combined with natural mineral pigments producing the distinctive glossy coloured surfaces in vibrant reds yellows greens and blues that define the Kinhal lacquerware aesthetic tradition since its origins in the fifteenth century CE when the Vijayanagara Empire royal patronage elevated the Kinhal toy-making tradition from a village craft to a prestigious court art form where Kinhal lacquerware toys and figurines were commissioned for the Vijayanagara royal palaces and temple festivals establishing Kinhal as a renowned centre of traditional Indian wooden toy and lacquerware production that continues to thrive in the modern era through the dedication of hereditary Kinhal artisan families who maintain the traditional lacquerware techniques and hand-carving skills passed down through multiple generations of master artisans practising this extraordinary Karnataka craft tradition.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>IS 15856 Kinhal Toy Safety Standards & Wrightia Wood Moisture QC</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The IS 15856 standard for Indian traditional wooden toys establishes the comprehensive quality certification framework for Kinhal lacquerware toys specifying requirements for wood species identification and moisture content natural lacquer coating thickness and adhesion colour pigment toxicity and heavy metal content mechanical strength and durability of toy components surface finish smoothness and absence of splinters or sharp edges dimensional accuracy and stability under varying humidity conditions and overall toy safety parameters that ensure Kinhal lacquerware products meet both Indian and international child safety standards including EN 71 European Toy Safety Directive and ASTM F963 US Consumer Product Safety Improvement Act requirements for traditional wooden toys intended for children under fourteen years of age. The Wrightia tinctoria wood moisture content requirements for IS 15856 Grade A certification mandate wood moisture content between eight and twelve percent measured by digital moisture meter at five random points across each wooden blank confirming the properly seasoned wood condition essential for the hand-carving operation where excessively moist wood causes grain tear-out and surface roughness during the fine carving process while excessively dry wood becomes brittle and prone to splitting during the detailed Kinhal relief carving operations where the artisan must execute intricate ornamental designs including animal figurine details religious iconography and decorative border patterns with exceptional precision and clean carving quality that characterises authentic Kinhal lacquerware products. The lacquer coating thickness and adhesion requirements mandate minimum three coats of hand-applied natural lacquer with total dry film thickness between 40 and 80 microns measured by digital coating thickness gauge at five reference points confirming the adequate lacquer build that provides the characteristic Kinhal glossy surface finish and sufficient film durability to withstand normal handling and play conditions throughout the expected service life of the lacquerware toy product.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Bubble Wrap and Corrugated Box Packaging for Kinhal Lacquerware Transit</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">Bubble wrap cushioning with individual component tissue interleaving and double-wall corrugated outer shipping containers has been specifically developed for the Kinhal lacquerware logistics supply chain to protect the delicate hand-carved wooden forms natural lacquer coating surfaces and intricate carved details that characterise authentic Kinhal products from the physical mechanical and environmental hazards encountered during transit from the Karnataka artisan workshops in Koppal Gangavathi and the surrounding districts to domestic retail distribution points across Karnataka and the broader Indian market through the South Indian railway and road transport network connecting the Karnataka production centres to the major retail distribution hubs of Bangalore Mysore Chennai Mumbai and Delhi serving the growing market demand for authentic Kinhal lacquerware toys and wooden craft products where each Kinhal lacquerware product undergoes a comprehensive pre-shipping quality inspection verifying lacquer coating integrity through adhesion tape peel testing at three reference points confirming minimum three-coat lacquer coverage with no delamination or flaking surface finish quality verified by tactile inspection confirming smooth and splinter-free surfaces at all carved detail areas including figurine extremities and fine relief carving elements colour consistency verified through visual comparison against the approved colour sample confirming uniform pigment distribution across the lacquer coating without streaking or pooling and structural integrity verified through gentle pressure testing confirming the carved form withstands normal handling pressure without cracking or joint separation where multi-component Kinhal products such as marionette doll sets and temple mural panel assemblies are tested for component attachment security and articulated joint function. The inspected product is individually wrapped in acid-free tissue paper providing surface protection against abrasion cushioned with 10-millimetre bubble wrap providing impact absorption protection enclosed with silica gel desiccant sachets providing moisture protection and placed within a custom-fitted inner carton constructed from E-flute corrugated board providing structural support that is then placed within a rigid outer shipping container constructed from 5-millimetre double-wall corrugated fibreboard designed to withstand the stacking pressures and mechanical handling forces encountered during transit from the Karnataka artisan workshops to the final retail destination.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>AI Design Cataloguing & Kinhal Heritage Artisan Economic Development</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">Artificial intelligence and machine vision technologies are being deployed to digitally catalogue and preserve the extensive Kinhal woodcraft design vocabulary comprising over three hundred traditional lacquerware toy designs marionette character sets religious figurine forms wooden musical instrument shapes and decorative object patterns that constitute the living design heritage of the Kinhal artisan tradition providing a comprehensive digital design archive that supports both heritage preservation and new product development for the contemporary market while documenting the distinctive design characteristics colour palettes carving techniques and lacquer application methods that define the Kinhal lacquerware aesthetic tradition where the AI-powered design cataloguing system employs high-resolution three-dimensional scanning at 50 microns resolution combined with multispectral imaging to capture the complete surface morphology colour properties and material composition characteristics of Kinhal lacquerware products creating detailed digital twins of master artisan works that serve as reference standards for quality assessment new artisan training and design reproduction accuracy verification where the digital design archive enables precise comparison of production output against the authenticated master design templates ensuring consistent quality and design fidelity across the multi-generational artisan workforce and the AI-powered Kinhal heritage economic development platform connects the traditional Karnataka artisan cooperatives in Koppal Gangavathi Kushtagi and surrounding areas directly with institutional buyers including the Karnataka State Handicrafts Development Corporation national-level handicraft retail chains premium ethnic lifestyle brands international fair-trade retailers and museum gift shops where the GI Karnataka Kinhal Mark and IS 15856 toy safety certification collectively provide the quality assurance and cultural provenance documentation framework needed to establish premium market positioning for authentic Kinhal lacquerware products in both domestic and international heritage craft and sustainable toy markets.</p></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}



