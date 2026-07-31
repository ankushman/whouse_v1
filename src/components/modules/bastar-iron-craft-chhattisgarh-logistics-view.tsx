import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#431407', '#7c2d12', '#9a3412', '#c2410c', '#ea580c', '#78350f', '#451a03', '#fed7aa']
const PRODUCTS = ['Bastar Iron Devi Sculpture', 'Bastar Iron Horse Figure', 'Bastar Iron Elephant Motif', 'Bastar Iron Tree of Life Panel', 'Bastar Iron Snake Spiral Stand', 'Bastar Iron Bell Metal Bowl', 'Bastar Iron Dancer Figurine', 'Bastar Iron Village Scene Relief']
const ARTISANS = ['Bastar Iron Craft Guild CG', 'Jagdalpur Metal Workers CG', 'Kondagaon Loha Shilp Cluster', 'Dantewada Iron Artisan Cooperative', 'Kanker Iron Forge Society CG', 'Narayanpur Traditional Iron CG', 'Sukma Bastar Craft Collective', 'Bijapur Iron Worker Community CG']
const STATUSES = ['GI Chhattisgarh Bastar Mark', 'IS 16794 Iron Craft Grade A', 'Foam Wrap Individual Box', 'Palletised Truck Transit', 'Dry Storage 18-30C', 'Iron Surface Finish QC']

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
    id: `BIC-${String(offset + i + 1).padStart(4, '0')}`,
    painter: ARTISANS[(offset + i) % ARTISANS.length], ware: PRODUCTS[(offset + i) % PRODUCTS.length],
    status: STATUSES[(offset + i) % STATUSES.length], qty: ri(1, 24, ((offset + i) * 23) % 24) + 1,
    cost: ri(4000, 75000, ((offset + i) * 11909) % 71000) + 4000,
    date: new Date(2024, ((offset + i) % 12), ri(1, 28, (offset + i) % 28)).toISOString().slice(0, 10),
  }))

const bastarRecords = [
  { id: 'BIC-0001', painter: 'Bastar Iron Craft Guild CG', ware: 'Bastar Iron Devi Sculpture', status: 'GI Chhattisgarh Bastar Mark', qty: 3, cost: 68000, date: '2024-01-14' },
  { id: 'BIC-0002', painter: 'Jagdalpur Metal Workers CG', ware: 'Bastar Iron Horse Figure', status: 'IS 16794 Iron Craft Grade A', qty: 5, cost: 42000, date: '2024-01-28' },
  { id: 'BIC-0003', painter: 'Kondagaon Loha Shilp Cluster', ware: 'Bastar Iron Elephant Motif', status: 'Foam Wrap Individual Box', qty: 2, cost: 72000, date: '2024-02-10' },
  { id: 'BIC-0004', painter: 'Dantewada Iron Artisan Cooperative', ware: 'Bastar Iron Tree of Life Panel', status: 'Palletised Truck Transit', qty: 4, cost: 55000, date: '2024-02-22' },
  { id: 'BIC-0005', painter: 'Kanker Iron Forge Society CG', ware: 'Bastar Iron Snake Spiral Stand', status: 'Dry Storage 18-30C', qty: 6, cost: 28000, date: '2024-03-07' },
  { id: 'BIC-0006', painter: 'Narayanpur Traditional Iron CG', ware: 'Bastar Iron Bell Metal Bowl', status: 'Iron Surface Finish QC', qty: 3, cost: 60000, date: '2024-03-20' },
  { id: 'BIC-0007', painter: 'Sukma Bastar Craft Collective', ware: 'Bastar Iron Dancer Figurine', status: 'GI Chhattisgarh Bastar Mark', qty: 4, cost: 48000, date: '2024-04-02' },
  { id: 'BIC-0008', painter: 'Bijapur Iron Worker Community CG', ware: 'Bastar Iron Village Scene Relief', status: 'IS 16794 Iron Craft Grade A', qty: 2, cost: 70000, date: '2024-04-15' },
  { id: 'BIC-0009', painter: 'Bastar Iron Craft Guild CG', ware: 'Bastar Iron Horse Figure', status: 'Foam Wrap Individual Box', qty: 5, cost: 38000, date: '2024-04-28' },
  { id: 'BIC-0010', painter: 'Jagdalpur Metal Workers CG', ware: 'Bastar Iron Devi Sculpture', status: 'Palletised Truck Transit', qty: 3, cost: 65000, date: '2024-05-10' },
  { id: 'BIC-0011', painter: 'Kondagaon Loha Shilp Cluster', ware: 'Bastar Iron Elephant Motif', status: 'Dry Storage 18-30C', qty: 6, cost: 32000, date: '2024-05-22' },
  { id: 'BIC-0012', painter: 'Dantewada Iron Artisan Cooperative', ware: 'Bastar Iron Tree of Life Panel', status: 'Iron Surface Finish QC', qty: 2, cost: 74000, date: '2024-06-04' },
  { id: 'BIC-0013', painter: 'Kanker Iron Forge Society CG', ware: 'Bastar Iron Snake Spiral Stand', status: 'GI Chhattisgarh Bastar Mark', qty: 4, cost: 45000, date: '2024-06-16' },
  { id: 'BIC-0014', painter: 'Narayanpur Traditional Iron CG', ware: 'Bastar Iron Bell Metal Bowl', status: 'IS 16794 Iron Craft Grade A', qty: 3, cost: 58000, date: '2024-06-28' },
  { id: 'BIC-0015', painter: 'Sukma Bastar Craft Collective', ware: 'Bastar Iron Dancer Figurine', status: 'Foam Wrap Individual Box', qty: 5, cost: 35000, date: '2024-07-10' },
  { id: 'BIC-0016', painter: 'Bijapur Iron Worker Community CG', ware: 'Bastar Iron Village Scene Relief', status: 'Palletised Truck Transit', qty: 2, cost: 69000, date: '2024-07-22' },
  { id: 'BIC-0017', painter: 'Bastar Iron Craft Guild CG', ware: 'Bastar Iron Devi Sculpture', status: 'Dry Storage 18-30C', qty: 3, cost: 72000, date: '2024-08-04' },
  { id: 'BIC-0018', painter: 'Jagdalpur Metal Workers CG', ware: 'Bastar Iron Horse Figure', status: 'Iron Surface Finish QC', qty: 4, cost: 40000, date: '2024-08-16' },
  { id: 'BIC-0019', painter: 'Kondagaon Loha Shilp Cluster', ware: 'Bastar Iron Elephant Motif', status: 'GI Chhattisgarh Bastar Mark', qty: 6, cost: 26000, date: '2024-08-28' },
  { id: 'BIC-0020', painter: 'Dantewada Iron Artisan Cooperative', ware: 'Bastar Iron Tree of Life Panel', status: 'IS 16794 Iron Craft Grade A', qty: 2, cost: 75000, date: '2024-09-09' },
]

export default function BastarIronCraftChhattisgarhLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})

  const allRecords = [...bastarRecords, ...genRecords(21), ...genRecords(41)]

  const filteredRecords = useMemo(() => {
    if (!searchQuery && Object.keys(activeFilters).every(k => !activeFilters[k].length)) return allRecords
    const sq = searchQuery.toLowerCase()
    return allRecords.filter(r => { if (sq && !r.id.toLowerCase().includes(sq) && !r.ware.toLowerCase().includes(sq)) return false; return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string)); })
  }, [searchQuery, activeFilters, allRecords])


  const filterGroups = [
    { key: 'ware', label: 'Ware', options: PRODUCTS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.ware === p).length })) },
    { key: 'painter', label: 'Painter', options: ARTISANS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.painter === p).length })) },
  ]

  const trendData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m, i) => ({ month: m, shipments: ri(4, 24, allRecords.length * 0.11 + i * 3) }))
  const artisanChart = ARTISANS.map(p => ({ name: p.split(' ').slice(0, 2).join(' '), volume: allRecords.filter(r => r.painter === p).reduce((s, r) => s + r.qty, 0) }))
  const statusPie = STATUSES.map(s => ({ name: s, value: allRecords.filter(r => r.status === s).length }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))


  return (
    <div className="bic-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Bastar Iron Craft CG' }]} />
      <PageHeader title="Bastar Iron Craft Chhattisgarh Logistics" description="Chhattisgarh Bastar lost-wax iron craft and bell metal artware supply chain with IS 16794 certification, iron surface finish QC, foam wrap individual box packaging, and GI Chhattisgarh Bastar Mark across 8 tribal artisan communities in Bastar, Kondagaon, and Jagdalpur" />
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
            <KpiTile label="Active Ware" value={PRODUCTS.length} />
            <KpiTile label="Iron Clusters" value={ARTISANS.length} />
            <KpiTile label="Avg Cost" value={`₹${Math.round(allRecords.reduce((s, r) => s + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>
          <div className="grid grid-cols-6 gap-4">
            <HealthRing label="GI Tag" value={94} />
            <HealthRing label="IS 16794" value={88} />
            <HealthRing label="Foam" value={82} />
            <HealthRing label="Truck" value={80} />
            <HealthRing label="Dry" value={86} />
            <HealthRing label="Finish" value={92} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Artisan Families" value="30+" />
            <ValueTile label="Tradition" value="Since 8th C" />
            <ValueTile label="Export Markets" value="6 Countries" />
            <ValueTile label="Annual Revenue" value="₹2.8 Crore" />
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
            placeholder="Search Bastar iron craft shipments..."
          />
          <div className="rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-orange-100">
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
                  <tr key={record.id} className="border-t hover:bg-orange-50/50">
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
              <CardHeader><CardTitle>Bastar Iron Craft — 1200-Year Chhattisgarh Tribal Lost-Wax Metal Casting Heritage</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">Bastar iron craft represents one of the most ancient and culturally significant tribal metalworking traditions of the Indian subcontinent, having been continuously practised for over twelve centuries by the traditional iron-smith communities of the Bastar, Kondagaon, Dantewada, Narayanpur, and Kanker districts of Chhattisgarh where hereditary Gond and Muria tribal artisan families create extraordinary iron and bell metal sculptures using the lost-wax casting technique that has remained substantially unchanged since the eighth century CE when the Bastar metalworking tradition was first documented in the historical records of the Kakatiya dynasty that governed the Bastar region as an independent tribal kingdom for over seven centuries until its incorporation into the colonial Central Provinces during the nineteenth century. The Bastar iron craft tradition is distinguished from all other Indian metalworking traditions by the extraordinary diversity of its sculptural repertoire where the tribal artisans create an extensive range of iron figures depicting tribal deities including the Devi mother goddess, Danteshwari, and local animist spirit figures alongside depictions of village life scenes, dancing human figurines, animals including horses, elephants, snakes, and birds, and elaborate narrative relief panels depicting tribal mythology, hunting scenes, and agricultural ceremonial rituals using a distinctive hollow-casting lost-wax technique where a beeswax model is first created over a clay core, then encased in multiple layers of fine clay slip creating a detailed mould, followed by heating to melt and drain the wax, and finally pouring molten iron or bell metal alloy into the mould cavity producing a hollow-cast metal sculpture that faithfully reproduces the intricate surface details of the original wax model with exceptional fidelity. The raw material foundation of the Bastar iron craft tradition is the locally sourced iron ore obtained from the laterite deposits of the Bailadila hills in the Dantewada district and the surrounding Bastar plateau region where the traditional iron smelting communities operate primitive bloomery furnaces using charcoal fuel derived from the sal and teak forests of the Bastar region producing sponge iron through direct reduction of iron ore in the bloomery furnace at temperatures reaching 1100 to 1200 degrees Celsius creating a low-carbon wrought iron with distinctive surface texture and malleability characteristics ideally suited to the intricate lost-wax casting technique employed in the Bastar metalworking tradition where the low carbon content and high ductility of the locally smelted iron allows the molten metal to flow into the finest details of the lost-wax mould producing sculptures with exceptional surface detail and artistic expression that characterise the finest quality Bastar iron craft products produced by the master artisans of the Kondagaon and Jagdalpur artisan clusters. The traditional Bastar iron craft technique produces distinctive surface textures where the lost-wax casting process leaves characteristic casting seams, minor surface irregularities, and a naturally oxidised dark brown to black patina that enhances the sculptural presence and visual depth of the finished iron figures creating a unique aesthetic quality that distinguishes authentic Bastar handcrafted iron products from the machine-cast iron reproductions that lack the distinctive handcrafted surface texture and natural patina of genuine Bastar lost-wax cast iron sculptures.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>IS 16794 Iron Craft Standards & Iron Surface Finish QC</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The IS 16794 standard for Bastar iron craft establishes India's first dedicated quality certification framework for the Chhattisgarh tribal lost-wax iron and bell metal craft tradition, specifying comprehensive requirements for raw iron alloy composition and carbon content, lost-wax casting dimensional accuracy, surface finish quality ratings, structural integrity and load-bearing capacity for freestanding sculptural pieces, corrosion resistance and protective coating specifications, and overall product quality parameters that collectively distinguish authentic Bastar handcrafted iron and bell metal products produced by traditional tribal artisan communities from the growing volume of machine-cast and investment-cast reproductions that have increasingly appeared in both the domestic Chhattisgarh tribal handicraft market and national retail platforms. The raw iron alloy composition requirements for IS 16794 Grade A certification mandate exclusively lost-wax cast iron or bell metal alloy produced from locally sourced Bastar region raw materials with maximum carbon content of 0.15 percent by weight measured by carbon analysis in accordance with IS 228 standard test methodology confirming the low-carbon wrought iron quality that characterises authentic Bastar iron craft products producing the characteristic malleability and casting fluidity properties of genuine Bastar lost-wax cast iron where the maximum carbon content ensures the iron possesses adequate ductility for the intricate casting operations and structural integrity for freestanding sculptural applications where the finished product must support its own weight without deformation or cracking during handling, transit, and display conditions. The surface finish quality requirements for Grade A certification mandate absence of casting defects including cold shuts, shrinkage porosity, sand inclusion, gas porosity, and slag inclusions across the entire visible surface of the finished sculpture measured by visual inspection under standardised D65 daylight illumination at 500 lux minimum intensity with supplementary 10x magnification inspection for detecting subsurface casting defects that may not be visible under normal viewing conditions ensuring the finished Bastar iron craft product meets the premium quality standards expected by institutional buyers, government emporiums, and international art collectors seeking authentic Bastar tribal iron craft sculptures for museum exhibition, private collection, and cultural heritage preservation purposes where the surface finish quality directly impacts the artistic value and market price of the finished product. The dimensional accuracy requirements mandate that the finished cast dimensions fall within plus or minus 3 percent of the specified mould dimensions for the product category ensuring consistent production quality and enabling the standardisation of product sizing across the Bastar iron craft supply chain from the artisan workshop to the retail distribution point where dimensional consistency enables efficient packaging design and logistics planning for the finished Bastar iron craft products.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Foam Wrap Individual Box Packaging for Bastar Iron Craft Transit</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">Foam wrap individual box packaging with anti-corrosion treatment has been specifically developed for the Bastar iron craft logistics supply chain to protect the delicate lost-wax cast iron and bell metal sculptures, natural oxide patina surfaces, and intricate sculptural details that characterise authentic Bastar handcrafted iron products from the physical, environmental, and corrosion hazards encountered during transit from the Chhattisgarh tribal artisan workshops in the Bastar, Kondagaon, Jagdalpur, and Narayanpur districts to domestic retail distribution points across Chhattisgarh and the broader Indian market, and international export destinations serving the growing demand for Indian tribal art metal collectibles in the United States, United Kingdom, European Union, Japan, and Australian markets where Bastar iron craft products are positioned as premium tribal art collectibles commanding significant price premiums in the international ethnographic art market. The packaging specification utilises closed-cell polyethylene foam sheet with minimum density of 24 kilograms per cubic metre and thickness of 10 millimetres providing cushioning protection against mechanical impact forces during transit handling, combined with anti-corrosion treatment using volatile corrosion inhibitor impregnated wrapping paper that releases protective vapour-phase corrosion inhibiting compounds within the sealed packaging environment preventing oxidation and rust formation on the exposed iron surfaces during the extended transit and storage cycle where the Bastar iron craft product may remain in packaging for periods exceeding three months during international export shipping logistics. Each Bastar iron craft sculpture is inspected under standardised D65 daylight illumination verifying surface finish quality meets the IS 16794 Grade A requirements through visual inspection at 500 lux minimum intensity confirming absence of casting defects, surface irregularities, and damage from the casting removal and finishing operations, dimensional accuracy verified through digital caliper measurement at six reference points confirming the finished dimensions fall within the specified tolerance parameters, and surface patina integrity confirmed through colour comparison against the approved patina reference standard ensuring the natural oxide patina colour and texture meets the aesthetic quality standards specified for the product grade and category. The inspected sculpture is individually wrapped in anti-corrosion VCI paper providing primary corrosion protection, followed by foam wrap cushioning providing impact protection, and finally enclosed within a rigid individual shipping box constructed from 5-millimetre single-wall corrugated fibreboard designed to withstand the stacking pressures and mechanical handling forces encountered during road transport through the Chhattisgarh highway corridors connecting the Bastar region production centres to the Raipur distribution hub where the road transport conditions subject the packaged iron craft products to significant vibration and compression forces requiring robust outer container construction to maintain package integrity throughout the transit chain from the tribal artisan workshop to the final retail destination.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>AI Craft Verification & Bastar Heritage Market Development</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">Artificial intelligence and machine vision technologies are being progressively deployed to authenticate Bastar iron craft products and verify the distinctive lost-wax casting surface characteristics, natural oxide patina composition signatures, and sculptural design authenticity parameters that distinguish genuine handcrafted Bastar iron and bell metal products produced by traditional Chhattisgarh tribal artisan communities from the growing volume of machine-cast and investment-cast reproductions that replicate the visual appearance of Bastar iron craft designs at significantly lower production costs while lacking the distinctive handcrafted material properties and cultural authenticity of authentic tribal artisan products. The AI authentication system for Bastar iron craft employs high-resolution three-dimensional surface scanning combined with energy-dispersive X-ray fluorescence spectroscopy to capture the complete surface morphology and elemental composition characteristics of finished Bastar iron craft products, analysing the lost-wax casting surface texture signatures where handcrafted lost-wax casting on traditional clay moulds produces distinctive surface characteristics including casting seam lines, minor surface porosity patterns, wax flow marks, and natural hand-finishing tool marks that reflect the manual mould preparation and finishing techniques of the tribal artisan that differ from the mechanically uniform surface texture of investment-cast and die-cast reproductions where the automated mould production processes produce perfectly regular surface textures lacking the characteristic handcrafted surface variations, the natural oxide patina composition measured through XRF elemental analysis where the distinctive iron oxide, manganese oxide, and trace element composition of authentic Bastar iron craft patina reflects the specific chemical composition of the locally sourced Bastar region iron ore and traditional bloomery smelting process producing characteristic elemental signatures that differ from the commercially produced iron and steel compositions of machine-cast reproductions where the different raw material sources and industrial smelting processes produce elemental composition patterns that are clearly distinguishable from the authentic Bastar iron craft patina signatures, and the sculptural design authenticity verified through automated digital image analysis comparing the captured sculptural design parameters against the established Bastar design motif reference database where the AI system measures the proportion, pose, decorative element placement, and stylistic characteristics of the captured sculpture within the tolerance parameters established by the traditional master artisans of the Kondagaon and Jagdalpur artisan clusters providing a comprehensive authentication methodology for distinguishing genuine handcrafted Bastar iron craft products from machine-cast reproductions. The AI-powered Bastar heritage market development platform connects the traditional Chhattisgarh tribal artisan cooperatives in the Bastar, Kondagaon, and Jagdalpur districts directly with institutional buyers including the Chhattisgarh Hastshilp Vikas Board, state government emporiums in Raipur and Jagdalpur, national tribal art galleries and craft museums, international ethnographic art collectors and dealers, and premium lifestyle brands seeking authentic Indian tribal art metal products where the GI Chhattisgarh Bastar Mark and IS 16794 certification collectively provide the quality assurance and cultural provenance documentation framework needed to establish premium market positioning for authentic Bastar handcrafted iron craft products in both domestic and international tribal art and collectibles markets.</p></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

