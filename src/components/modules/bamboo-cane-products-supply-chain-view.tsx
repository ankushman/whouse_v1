import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#14532d', '#166534', '#15803d', '#16a34a', '#22c55e', '#052e16', '#0a3d1e', '#dcfce7']
const PRODUCTS = ['Bamboo Basket Set', 'Cane Dining Chair', 'Bamboo Handicraft Lamp', 'Rattan Garden Table', 'Bamboo Flooring Panel', 'Cane Wine Rack', 'Bamboo Toothbrush Pack', 'Rattan Sun Lounger']
const ARTISANS = ['Assam Cane Cluster', 'Tripura Bamboo Mission', 'Manipur Cane Craft', 'Nagaland Bamboo Unit', 'Kerala Bamboo Society', 'Karnataka Bamboo Board', 'Mizoram Cane Works', 'Arunachal Bamboo Corp']
const STATUSES = ['IS 15984 Certified', 'BIS Bamboo Grade', 'Strap Bundled', 'Open Truck Transit', 'Rack Store Dry', 'Borer Treatment']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="w-24 h-2 bg-green-200 rounded-full overflow-hidden"><div className="h-full bg-green-700 rounded-full" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ label, value, size = 80 }: { label: string; value: number; size?: number }) => {
  const r = (size - 12) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#dcfce7" strokeWidth="6" />
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
    id: `BCP-${String(offset + i + 1).padStart(4, '0')}`,
    painter: ARTISANS[(offset + i) % ARTISANS.length], ware: PRODUCTS[(offset + i) % PRODUCTS.length],
    status: STATUSES[(offset + i) % STATUSES.length], qty: ri(1, 26, ((offset + i) * 25) % 26) + 1,
    cost: ri(3000, 58000, ((offset + i) * 10111) % 55000) + 3000,
    date: new Date(2024, ((offset + i) % 12), ri(1, 28, (offset + i) % 28)).toISOString().slice(0, 10),
  }))

const bambooRecords = [
  { id: 'BCP-0001', painter: 'Assam Cane Cluster', ware: 'Bamboo Basket Set', status: 'IS 15984 Certified', qty: 8, cost: 24000, date: '2024-01-15' },
  { id: 'BCP-0002', painter: 'Tripura Bamboo Mission', ware: 'Cane Dining Chair', status: 'BIS Bamboo Grade', qty: 4, cost: 42000, date: '2024-01-28' },
  { id: 'BCP-0003', painter: 'Manipur Cane Craft', ware: 'Bamboo Handicraft Lamp', status: 'Strap Bundled', qty: 6, cost: 18000, date: '2024-02-10' },
  { id: 'BCP-0004', painter: 'Nagaland Bamboo Unit', ware: 'Rattan Garden Table', status: 'Open Truck Transit', qty: 3, cost: 52000, date: '2024-02-22' },
  { id: 'BCP-0005', painter: 'Kerala Bamboo Society', ware: 'Bamboo Flooring Panel', status: 'Rack Store Dry', qty: 10, cost: 32000, date: '2024-03-07' },
  { id: 'BCP-0006', painter: 'Karnataka Bamboo Board', ware: 'Cane Wine Rack', status: 'Borer Treatment', qty: 5, cost: 28000, date: '2024-03-20' },
  { id: 'BCP-0007', painter: 'Mizoram Cane Works', ware: 'Bamboo Toothbrush Pack', status: 'IS 15984 Certified', qty: 12, cost: 8000, date: '2024-04-02' },
  { id: 'BCP-0008', painter: 'Arunachal Bamboo Corp', ware: 'Rattan Sun Lounger', status: 'BIS Bamboo Grade', qty: 2, cost: 55000, date: '2024-04-15' },
  { id: 'BCP-0009', painter: 'Assam Cane Cluster', ware: 'Bamboo Handicraft Lamp', status: 'Strap Bundled', qty: 7, cost: 20000, date: '2024-04-28' },
  { id: 'BCP-0010', painter: 'Tripura Bamboo Mission', ware: 'Bamboo Basket Set', status: 'Open Truck Transit', qty: 9, cost: 22000, date: '2024-05-10' },
  { id: 'BCP-0011', painter: 'Manipur Cane Craft', ware: 'Cane Dining Chair', status: 'Rack Store Dry', qty: 4, cost: 44000, date: '2024-05-22' },
  { id: 'BCP-0012', painter: 'Nagaland Bamboo Unit', ware: 'Rattan Garden Table', status: 'Borer Treatment', qty: 3, cost: 50000, date: '2024-06-04' },
  { id: 'BCP-0013', painter: 'Kerala Bamboo Society', ware: 'Bamboo Flooring Panel', status: 'IS 15984 Certified', qty: 8, cost: 36000, date: '2024-06-16' },
  { id: 'BCP-0014', painter: 'Karnataka Bamboo Board', ware: 'Cane Wine Rack', status: 'BIS Bamboo Grade', qty: 5, cost: 26000, date: '2024-06-28' },
  { id: 'BCP-0015', painter: 'Mizoram Cane Works', ware: 'Bamboo Toothbrush Pack', status: 'Strap Bundled', qty: 15, cost: 6000, date: '2024-07-10' },
  { id: 'BCP-0016', painter: 'Arunachal Bamboo Corp', ware: 'Rattan Sun Lounger', status: 'Open Truck Transit', qty: 2, cost: 58000, date: '2024-07-22' },
  { id: 'BCP-0017', painter: 'Assam Cane Cluster', ware: 'Bamboo Basket Set', status: 'Rack Store Dry', qty: 10, cost: 26000, date: '2024-08-04' },
  { id: 'BCP-0018', painter: 'Tripura Bamboo Mission', ware: 'Bamboo Handicraft Lamp', status: 'Borer Treatment', qty: 6, cost: 16000, date: '2024-08-16' },
  { id: 'BCP-0019', painter: 'Manipur Cane Craft', ware: 'Cane Dining Chair', status: 'IS 15984 Certified', qty: 4, cost: 48000, date: '2024-08-28' },
  { id: 'BCP-0020', painter: 'Nagaland Bamboo Unit', ware: 'Rattan Garden Table', status: 'BIS Bamboo Grade', qty: 3, cost: 54000, date: '2024-09-09' },
]

export default function BambooCaneProductsSupplyChainView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})

  const allRecords = [...bambooRecords, ...genRecords(21), ...genRecords(41)]

  const filteredRecords = useMemo(() => {
    if (!searchQuery && Object.keys(activeFilters).every(k => !activeFilters[k].length)) return allRecords
    const sq = searchQuery.toLowerCase()
    return allRecords.filter(r => { if (sq && !r.id.toLowerCase().includes(sq) && !r.ware.toLowerCase().includes(sq)) return false; return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string)); })
  }, [searchQuery, activeFilters, allRecords])

  const filterGroups = [
    { key: 'ware', label: 'Ware', options: PRODUCTS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.ware === p).length })) },
    { key: 'painter', label: 'Painter', options: ARTISANS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.painter === p).length })) },
  ]

  const trendData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m, i) => ({ month: m, shipments: ri(4, 22, allRecords.length * 0.10 + i * 3) }))
  const artisanChart = ARTISANS.map(p => ({ name: p.split(' ').slice(0, 2).join(' '), volume: allRecords.filter(r => r.painter === p).reduce((s, r) => s + r.qty, 0) }))
  const statusPie = STATUSES.map(s => ({ name: s, value: allRecords.filter(r => r.status === s).length }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="bcp-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Bamboo & Cane' }]} />
      <PageHeader title="Bamboo Cane Products Supply Chain" description="North-East India bamboo and cane products supply chain with IS 15984 certification, BIS bamboo grade standards, borer treatment QC, strap bundled packaging, and rack dry storage across 8 bamboo artisan communities in Assam, Tripura, Manipur, and Nagaland" />
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="bg-green-100">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <KpiTile label="Total Shipments" value={allRecords.length} />
            <KpiTile label="Active Ware" value={PRODUCTS.length} />
            <KpiTile label="Bamboo Clusters" value={ARTISANS.length} />
            <KpiTile label="Avg Cost" value={`₹${Math.round(allRecords.reduce((s, r) => s + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>
          <div className="grid grid-cols-6 gap-4">
            <HealthRing label="IS 15984" value={92} />
            <HealthRing label="BIS" value={88} />
            <HealthRing label="Strap" value={84} />
            <HealthRing label="Truck" value={79} />
            <HealthRing label="Dry" value={86} />
            <HealthRing label="Borer" value={90} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Artisan Families" value="40+" />
            <ValueTile label="Tradition" value="Since 5th C" />
            <ValueTile label="Export Markets" value="12 Countries" />
            <ValueTile label="Annual Revenue" value="₹4.1 Crore" />
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
            placeholder="Search bamboo cane shipments..."
          />
          <div className="rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-green-100">
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
                  <tr key={record.id} className="border-t hover:bg-green-50/50">
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
              <CardHeader><CardTitle>Bamboo Cane Craft — 1500-Year North-East India Tribal Basketry and Furniture Heritage</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">Bamboo and cane craft represents one of the most deeply embedded and economically significant traditional artisanal industries of the North-East Indian states of Assam, Tripura, Manipur, Nagaland, Mizoram, Arunachal Pradesh, Meghalaya, and Sikkim where hereditary tribal communities have continuously practised the art of bamboo weaving, cane binding, and rattan furniture construction for over fifteen centuries creating an extraordinarily diverse range of functional and decorative bamboo and cane products that serve both the daily domestic needs of the tribal households and the growing commercial demand for eco-friendly sustainable handicraft products in national and international markets where North-East Indian bamboo and cane products are increasingly recognised as premium artisanal goods with distinctive aesthetic and functional qualities. The North-East Indian bamboo and cane craft tradition is distinguished from all other Indian handicraft traditions by the extraordinary breadth of its product range encompassing over five hundred distinct product categories including household baskets and storage containers, woven bamboo mats and floor coverings, cane furniture including chairs, tables, sofas, beds, and shelving units, bamboo lighting fixtures and lampshades, rattan garden and outdoor furniture, bamboo construction materials including flooring panels, wall cladding, and roofing materials, bamboo textile and fibre products, bamboo kitchenware and culinary tools, bamboo personal care products including toothbrushes and tissue holders, and ceremonial and ritual bamboo objects used in tribal religious and cultural ceremonies where the versatility of bamboo as a raw material and the exceptional manual dexterity of the North-East Indian tribal artisan communities combine to produce a product range of unmatched diversity and sophistication within the Indian handicraft sector. The raw material foundation of the North-East Indian bamboo and cane craft tradition is the extraordinarily rich bamboo forest resource of the North-East Indian states which collectively contain over fifty percent of India's total bamboo forest area with an estimated 80 species of bamboo growing naturally across the region providing abundant raw material supply for the traditional bamboo and cane craft industry where the most commercially important species include Bambusa balcooa, Bambusa tulda, Bambusa vulgaris, Dendrocalamus hamiltonii, Melocanna baccifera, and Calamus tenuis cane providing the diverse range of bamboo culm diameters, wall thicknesses, fibre strengths, and flexibility characteristics needed to support the extensive product range of the North-East Indian bamboo and cane craft tradition where different species are selected for different product applications based on their specific material properties including culm diameter for furniture framing, wall thickness for structural strength, fibre tensile strength for weaving durability, and natural flexibility for cane bending and binding operations that characterise the diverse product manufacturing techniques employed across the North-East Indian bamboo and cane craft communities.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>IS 15984 Bamboo Standards & Borer Treatment QC</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The IS 15984 standard for bamboo and cane products establishes India's comprehensive quality certification framework for the bamboo and rattan products industry specifying requirements for raw bamboo material quality including species identification, moisture content, wall thickness, culm diameter, and fibre tensile strength parameters, manufacturing process quality including weaving density, joint construction, finishing quality, and dimensional accuracy, chemical treatment requirements including borer treatment using approved borax-boric acid solutions, fungal resistance treatment, and fire retardant treatment where applicable, and finished product performance requirements including load-bearing capacity for furniture items, durability under standard use conditions, and dimensional stability under varying humidity conditions that collectively ensure the bamboo and cane products meet the minimum quality standards needed for commercial sale through registered retail channels and export markets. The borer treatment quality control requirements for bamboo and cane products mandate chemical treatment using a solution of borax and boric acid at specified concentration ratios determined by the bamboo species and product thickness category where the treatment solution penetrates the bamboo cellular structure to provide long-term protection against the common bamboo borer insects including Dinoderus minutus, Dinoderus ocellaris, and Stromatium barbatum that cause significant damage to untreated bamboo products during storage and use reducing product service life and structural integrity. The borer treatment efficacy is verified through standardised bioassay testing where treated bamboo samples are exposed to controlled borer insect populations under laboratory conditions for a minimum period of 28 days measuring the borer mortality rate, wood consumption rate, and gallery formation rate against the acceptance criteria specified in IS 15984 Annexure B confirming the treatment provides effective long-term borer protection meeting the minimum 95 percent borer mortality threshold required for Grade A certification ensuring the finished bamboo and cane products maintain their structural integrity and aesthetic quality throughout the intended service life under standard storage and use conditions. The moisture content requirements for Grade A certification mandate finished product moisture content between 10 and 15 percent measured by oven-dry moisture content testing in accordance with IS 15984 Annexure A methodology ensuring the bamboo material has been properly seasoned and dried to prevent subsequent dimensional changes, cracking, or fungal growth during the service life of the finished product where excessive moisture content above 15 percent indicates inadequate seasoning and creates risk of product degradation during storage and transit while moisture content below 10 percent indicates over-drying that may cause brittleness and reduced impact resistance in the finished product compromising its functional quality and durability under normal use conditions.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Strap Bundled Packaging for Bamboo Cane Transit Logistics</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">Strap bundled packaging with moisture-resistant outer wrapping has been specifically developed for the bamboo and cane products supply chain to protect the diverse range of bamboo and cane products including woven baskets, cane furniture, bamboo panels, and rattan items from the physical and environmental hazards encountered during transit from the North-East Indian artisan production centres in Assam, Tripura, Manipur, Nagaland, Mizoram, and Arunachal Pradesh to domestic distribution hubs across India and international export destinations where the bamboo and cane products must navigate the challenging road transport corridors connecting the landlocked North-East Indian states to the rest of India through the Siliguri corridor and the newly developed alternative transport routes via Bangladesh territory providing critical logistics connectivity for the North-East Indian handicraft industry. The packaging specification utilises polyester strapping with minimum breaking strength of 250 kilograms per strap applied in multiple vertical and horizontal strapping configurations providing structural compression force to prevent product shifting and deformation during the vibration and shock loading encountered during road transport through the mountainous road corridors of the North-East Indian states where the winding hill roads with numerous hairpin bends and gradient changes subject the packaged products to significant lateral and longitudinal forces requiring robust strapping to maintain package integrity. Each bamboo or cane product is inspected under standardised D65 daylight illumination verifying weave density meets the IS 15984 Grade A thread count and spacing parameters using a calibrated measuring gauge, joint construction quality verified through manual flex testing confirming adequate joint strength for the intended load-bearing application, surface finish quality confirmed through visual inspection at 500 lux minimum intensity ensuring absence of manufacturing defects including loose weave areas, incomplete joints, splinter protrusions, and surface contamination that would compromise the product quality or present safety hazards during handling and use, and dimensional accuracy verified through digital caliper measurement at specified reference points confirming the finished dimensions fall within the plus or minus 3 percent tolerance specified for the product category ensuring dimensional consistency across production batches enabling efficient packaging design and logistics planning. The inspected product is individually wrapped in moisture-resistant polyethylene film providing primary environmental protection against humidity exposure during transit through the high-humidity climatic zones of the North-East Indian states where ambient humidity levels regularly exceed 80 percent relative creating significant risk of moisture absorption and dimensional instability in bamboo products during the extended transit cycle, followed by foam sheet cushioning at all contact points to prevent surface abrasion and compression damage, and finally secured within the strap bundling configuration using polyester strapping applied at specified tension levels with protective corner pieces at all strapping contact points preventing strapping indentation damage to the bamboo or cane product surface.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>AI Species Verification & Bamboo Heritage Market Development</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">Artificial intelligence and machine vision technologies are being progressively deployed to authenticate bamboo and cane products and verify the raw bamboo species identification, manufacturing technique characteristics, and treatment quality parameters that distinguish genuine handcrafted North-East Indian bamboo and cane products produced by traditional tribal artisan communities from the growing volume of machine-manufactured and chemically treated bamboo reproductions that replicate the visual appearance of traditional bamboo craft designs at significantly lower production costs while lacking the distinctive material properties, environmental sustainability credentials, and cultural authenticity of authentic tribal artisan products. The AI authentication system for bamboo and cane products employs near-infrared spectroscopy combined with high-resolution digital imaging to capture the complete material composition and surface morphology characteristics of finished bamboo products, analysing the bamboo species spectral signature where different bamboo species including Bambusa balcooa, Bambusa tulda, Melocanna baccifera, and Dendrocalamus hamiltonii produce distinctive near-infrared absorption spectra in the 900 to 1700 nanometres wavelength range reflecting the specific cellulose, hemicellulose, and lignin composition ratios that characterise each bamboo species enabling automated species identification and verification against the product labelling claims where species authentication confirms the raw material origin and quality grade of the finished bamboo product providing consumers and institutional buyers with verified provenance documentation ensuring the bamboo product is manufactured from the declared bamboo species with the associated quality characteristics specified in the product documentation and certification records. The AI-powered bamboo heritage market development platform connects the traditional North-East Indian tribal artisan cooperatives in Assam, Tripura, Manipur, Nagaland, and the other North-East Indian states directly with institutional buyers including the North Eastern Development Finance Corporation, state handicraft development corporations, national-level bamboo product retail chains, international sustainable home decor brands seeking eco-friendly artisanal products, and government procurement agencies where the IS 15984 certification and BIS bamboo grade standards collectively provide the quality assurance and environmental sustainability documentation framework needed to establish premium market positioning for authentic North-East Indian bamboo and cane products in both domestic and international sustainable lifestyle and eco-friendly product markets where growing consumer awareness of environmental sustainability and preference for natural material products creates significant market opportunities for authentic handcrafted bamboo and cane products from the traditional artisan communities of the North-East Indian states.</p></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}



