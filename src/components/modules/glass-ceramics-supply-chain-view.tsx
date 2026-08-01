import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#14532d', '#166534', '#15803d', '#16a34a', '#22c55e', '#052e16', '#0a4a20', '#f0fdf4']
const PRODUCTS = ['Soda Lime Glassware Set', 'Borosilicate Lab Beakers', 'Ceramic Dinnerware 24pc', 'Terracotta Glazed Vase', 'Pyrex Oven Dish Set', 'Bone China Tea Set', 'Stoneware Baking Bowl', 'Fused Glass Panel Art']
const ARTISANS = ['Firozabad Glass UP', 'Khurja Ceramics UP', 'Jaipur Blue Pottery RJ', 'Bangalore Glass House KA', 'Mumbai Ceramic Studio MH', 'Thanjavur Art Studio TN', 'Moradabad Glass UP', 'Kolkata Clay Studio WB']
const STATUSES = ['BIS IS 2829 Certified', 'Lead-Free Glaze QC', 'Fragile Foam Wrapped', 'In Transit Cushion', 'Yard Shelved', 'Thermal Shock Test']

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
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f0fdf4" strokeWidth="6" />
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
    id: `GCS-${String(offset + i + 1).padStart(4, '0')}`,
    painter: ARTISANS[(offset + i) % ARTISANS.length], ware: PRODUCTS[(offset + i) % PRODUCTS.length],
    status: STATUSES[(offset + i) % STATUSES.length], qty: ri(1, 24, ((offset + i) * 23) % 24) + 1,
    cost: ri(5000, 85000, ((offset + i) * 13013) % 80000) + 5000,
    date: new Date(2024, ((offset + i) % 12), ri(1, 28, (offset + i) % 28)).toISOString().slice(0, 10),
  }))

const glassRecords = [
  { id: 'GCS-0001', painter: 'Firozabad Glass UP', ware: 'Soda Lime Glassware Set', status: 'BIS IS 2829 Certified', qty: 8, cost: 32000, date: '2024-01-19' },
  { id: 'GCS-0002', painter: 'Khurja Ceramics UP', ware: 'Ceramic Dinnerware 24pc', status: 'Lead-Free Glaze QC', qty: 4, cost: 68000, date: '2024-02-01' },
  { id: 'GCS-0003', painter: 'Jaipur Blue Pottery RJ', ware: 'Terracotta Glazed Vase', status: 'Fragile Foam Wrapped', qty: 6, cost: 24000, date: '2024-02-14' },
  { id: 'GCS-0004', painter: 'Bangalore Glass House KA', ware: 'Borosilicate Lab Beakers', status: 'In Transit Cushion', qty: 12, cost: 18000, date: '2024-02-26' },
  { id: 'GCS-0005', painter: 'Mumbai Ceramic Studio MH', ware: 'Pyrex Oven Dish Set', status: 'Yard Shelved', qty: 3, cost: 72000, date: '2024-03-11' },
  { id: 'GCS-0006', painter: 'Thanjavur Art Studio TN', ware: 'Bone China Tea Set', status: 'Thermal Shock Test', qty: 5, cost: 56000, date: '2024-03-24' },
  { id: 'GCS-0007', painter: 'Moradabad Glass UP', ware: 'Fused Glass Panel Art', status: 'BIS IS 2829 Certified', qty: 2, cost: 82000, date: '2024-04-06' },
  { id: 'GCS-0008', painter: 'Kolkata Clay Studio WB', ware: 'Stoneware Baking Bowl', status: 'Lead-Free Glaze QC', qty: 6, cost: 28000, date: '2024-04-19' },
  { id: 'GCS-0009', painter: 'Firozabad Glass UP', ware: 'Soda Lime Glassware Set', status: 'Fragile Foam Wrapped', qty: 10, cost: 36000, date: '2024-05-02' },
  { id: 'GCS-0010', painter: 'Khurja Ceramics UP', ware: 'Ceramic Dinnerware 24pc', status: 'In Transit Cushion', qty: 4, cost: 64000, date: '2024-05-14' },
  { id: 'GCS-0011', painter: 'Jaipur Blue Pottery RJ', ware: 'Terracotta Glazed Vase', status: 'Yard Shelved', qty: 6, cost: 22000, date: '2024-05-26' },
  { id: 'GCS-0012', painter: 'Bangalore Glass House KA', ware: 'Borosilicate Lab Beakers', status: 'Thermal Shock Test', qty: 12, cost: 16000, date: '2024-06-08' },
  { id: 'GCS-0013', painter: 'Mumbai Ceramic Studio MH', ware: 'Pyrex Oven Dish Set', status: 'BIS IS 2829 Certified', qty: 3, cost: 76000, date: '2024-06-20' },
  { id: 'GCS-0014', painter: 'Thanjavur Art Studio TN', ware: 'Bone China Tea Set', status: 'Lead-Free Glaze QC', qty: 5, cost: 52000, date: '2024-07-02' },
  { id: 'GCS-0015', painter: 'Moradabad Glass UP', ware: 'Fused Glass Panel Art', status: 'Fragile Foam Wrapped', qty: 2, cost: 80000, date: '2024-07-14' },
  { id: 'GCS-0016', painter: 'Kolkata Clay Studio WB', ware: 'Stoneware Baking Bowl', status: 'In Transit Cushion', qty: 8, cost: 24000, date: '2024-07-26' },
  { id: 'GCS-0017', painter: 'Firozabad Glass UP', ware: 'Soda Lime Glassware Set', status: 'Yard Shelved', qty: 10, cost: 30000, date: '2024-08-08' },
  { id: 'GCS-0018', painter: 'Khurja Ceramics UP', ware: 'Ceramic Dinnerware 24pc', status: 'Thermal Shock Test', qty: 4, cost: 66000, date: '2024-08-20' },
  { id: 'GCS-0019', painter: 'Jaipur Blue Pottery RJ', ware: 'Terracotta Glazed Vase', status: 'BIS IS 2829 Certified', qty: 6, cost: 26000, date: '2024-09-01' },
  { id: 'GCS-0020', painter: 'Bangalore Glass House KA', ware: 'Borosilicate Lab Beakers', status: 'Lead-Free Glaze QC', qty: 12, cost: 20000, date: '2024-09-13' },
]

export default function GlassCeramicsSupplyChainView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})

  const allRecords = [...glassRecords, ...genRecords(21), ...genRecords(41)]

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
    <div className="gcs-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Glass Ceramics' }]} />
      <PageHeader title="Glass Ceramics Supply Chain" description="Indian glass and ceramics supply chain with BIS IS 2829 certification, lead-free glaze QC, fragile foam wrap packaging, and thermal shock testing across 8 production clusters in Firozabad, Khurja, Jaipur, and Bangalore" />
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
            <KpiTile label="Production Clusters" value={ARTISANS.length} />
            <KpiTile label="Avg Cost" value={`₹${Math.round(allRecords.reduce((s, r) => s + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>
          <div className="grid grid-cols-6 gap-4">
            <HealthRing label="BIS" value={90} />
            <HealthRing label="Glaze" value={85} />
            <HealthRing label="Foam" value={82} />
            <HealthRing label="Cushion" value={78} />
            <HealthRing label="Yard" value={84} />
            <HealthRing label="Thermal" value={88} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Kiln Families" value="500+" />
            <ValueTile label="Tradition" value="Since 12th C" />
            <ValueTile label="Export Markets" value="25 Countries" />
            <ValueTile label="Annual Revenue" value="₹12 Crore" />
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
            placeholder="Search glass ceramics shipments..."
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
              <CardHeader><CardTitle>Indian Glass Ceramics — 800-Year Firozabad Khurja Jaipur Heritage Cluster</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">Indian glass and ceramics production represents one of the most diverse and historically significant industrial craft sectors of the Indian subcontinent having been continuously practised for over eight centuries across the major glass and ceramics production clusters of Firozabad and Khurja in Uttar Pradesh, Jaipur in Rajasthan, Bangalore in Karnataka, Mumbai in Maharashtra, Thanjavur in Tamil Nadu, Moradabad in Uttar Pradesh, and Kolkata in West Bengal where hereditary artisan families and modern industrial production units create an extraordinarily diverse range of glass and ceramic products serving both the domestic Indian household and institutional market and the international export market where Indian glass and ceramic products command significant market share across all product categories from traditional handmade glassware and blue pottery to modern industrial ceramic tiles, borosilicate laboratory glassware, and bone china tableware. The Firozabad glass cluster in Uttar Pradesh is the largest glass production concentration in India and one of the largest in the world employing over five hundred thousand workers across approximately four hundred glass manufacturing units producing soda lime glassware, pressed glass tumblers, glass bangles, decorative glass art pieces, and industrial glass products serving the complete range of Indian market segments from daily-use household glassware to premium decorative art glass and industrial glass components where the Firozabad glass tradition has been continuously practised since the Mughal period when the glassmaking technique was introduced to the region by migrant Persian glass artisans establishing the traditional glassblowing and glass-pressing techniques that continue to form the foundation of the Firozabad glass industry. The Khurja ceramics cluster in Uttar Pradesh is India's largest ceramics production centre producing over sixty percent of India's total ceramic tableware output including ceramic dinnerware sets, tea sets, coffee mugs, serving bowls, and decorative ceramic vases in both traditional and contemporary designs serving the domestic Indian market and export markets across twenty-five countries where Khurja ceramic products are positioned as affordable quality ceramic tableware commanding significant volume-based market share in the mid-range ceramic tableware category. The Jaipur blue pottery tradition produces a distinctive ceramic art form using a unique quartz-based ceramic body with hand-painted cobalt blue and green floral designs that differs from the conventional clay-based ceramic production techniques employed in other Indian ceramic centres creating a premium artisanal ceramic product category with distinctive aesthetic qualities and cultural heritage significance recognised through GI Rajasthan Blue Pottery registration and national handicraft development programmes supporting the preservation and commercial development of this unique Rajasthani ceramic art tradition.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>BIS IS 2829 Glass Standards & Lead-Free Glaze QC</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The BIS IS 2829 standard for glass and ceramic tableware establishes India's comprehensive quality and safety certification framework for the domestic glass and ceramics industry specifying requirements for raw material composition and purity, product dimensional accuracy, surface quality and absence of manufacturing defects, chemical safety including lead and cadmium leaching limits, thermal shock resistance for oven-safe and microwave-safe product categories, and mechanical strength parameters including chip resistance and impact durability that collectively ensure the finished glass and ceramic products meet the minimum quality and safety standards required for consumer use in food contact and household applications. The lead-free glaze quality control requirements for ceramic tableware mandate maximum lead leaching limit of 0.5 milligrams per square decimetre measured by acetic acid extraction testing in accordance with IS 2829 Annexure A methodology where the finished ceramic product is filled with 4 percent acetic acid solution and maintained at 22 degrees Celsius for 24 hours after which the extraction solution is analysed by atomic absorption spectroscopy to determine the lead and cadmium concentration confirming the glaze and ceramic body do not leach toxic heavy metals above the specified safety limits into food and beverages during normal use conditions where compliance with the lead and cadmium leaching limits is mandatory for all ceramic tableware products sold through registered retail channels in India and for all ceramic products exported to international markets where the lead and cadmium leaching limits are enforced through customs quality inspection and import regulatory requirements. The thermal shock resistance requirements for IS 2829 certified oven-safe and microwave-safe glass and ceramic products mandate the product withstand a minimum of three thermal shock cycles between the specified temperature extremes without cracking or structural failure measured by immersing the heated product in cold water at specified temperature differential confirming the glass or ceramic body possesses adequate thermal stress resistance for the intended cooking and serving applications where the thermal shock resistance testing simulates the rapid temperature changes encountered during normal oven-to-table and microwave-to-table use conditions ensuring the product maintains structural integrity without cracking or shattering during thermal cycling that could cause injury to the consumer through hot glass or ceramic fragments and hot food spillage that may occur during thermal shock failure of the product during normal use.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Fragile Foam Wrap Packaging for Glass Ceramics Transit</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">Fragile foam wrap packaging with double-wall corrugated outer container has been specifically developed for the glass and ceramics supply chain to protect the inherently fragile and breakage-sensitive glass and ceramic products from the mechanical impact, vibration, and compression forces encountered during transit from the Firozabad, Khurja, Jaipur, Bangalore, and other production centres to domestic distribution hubs across India and international export destinations where the glass and ceramic products require comprehensive shock-absorbing packaging to prevent breakage rates during transit that historically reached 15 to 20 percent for inadequately packaged glass products in the Indian road transport logistics network where the combination of poorly maintained road surfaces, frequent speed bumps, sharp turns, and multi-point handling through the wholesale distribution chain subjects packaged glass and ceramic products to significant mechanical stress requiring robust multi-layer packaging to maintain acceptable breakage rates below 2 percent for premium glass and ceramic products and below 5 percent for standard glassware and ceramic tableware products. The packaging specification utilises expanded polystyrene foam inserts custom-moulded to fit the specific product geometry providing individual product cushioning and preventing product-to-product contact within the shipping carton where the moulded foam inserts are designed with clearance tolerances of 3 to 5 millimetres around each product allowing the foam to absorb and distribute impact energy through controlled compression during mechanical shock events preventing direct impact transmission to the glass or ceramic product surface that would cause chipping, cracking, or complete breakage of the fragile product. Each glass or ceramic product is visually inspected for manufacturing defects including chips, cracks, glaze irregularities, and dimensional non-conformity under standardised D65 daylight illumination at 500 lux intensity confirming the product meets the BIS IS 2829 quality requirements for surface quality and dimensional accuracy, acoustic resonance testing performed on ceramic products to detect internal cracks and structural weaknesses that are not visible under visual inspection where the ceramic product is tapped with a standardised testing implement and the resonance frequency and decay characteristics compared against the acceptance criteria for structurally sound products, and for ceramic food-contact products the glaze surface is tested for surface smoothness and glaze coverage completeness using tactile and visual inspection confirming the glaze covers the entire food-contact surface without bare clay spots or glaze pinholes that could create hygiene risks or reduce the chemical resistance of the food-contact surface during normal use.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>AI Defect Detection & Glass Ceramics Market Development</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">Artificial intelligence and machine vision technologies are being progressively deployed to automate the quality inspection and defect detection processes for the Indian glass and ceramics industry replacing the traditional manual visual inspection process where trained quality inspectors examine each product under controlled lighting conditions to identify surface defects including chips, cracks, glaze irregularities, dimensional non-conformity, and colour variation that may compromise product quality and safety where the AI-powered automated inspection systems employ high-resolution line scan cameras operating at 2000 pixels per inch resolution combined with structured light 3D surface profiling to capture the complete surface geometry and visual characteristics of each glass or ceramic product at production line speeds of up to 60 products per minute analysing the captured surface data through deep learning defect classification models trained on curated defect databases containing labelled examples of all common defect types including chip defects at sub-millimetre detection sensitivity, surface crack detection using edge detection and crack propagation analysis algorithms, glaze coverage completeness verified through reflectance mapping of the entire product surface, and dimensional accuracy verified through 3D point cloud comparison against the product CAD reference model detecting dimensional non-conformity exceeding the specified tolerance parameters with measurement accuracy of plus or minus 0.1 millimetre enabling reliable detection of quality defects that may be missed by manual visual inspection particularly for small chip defects and subtle glaze irregularities that require magnified examination for reliable detection by human inspectors. The AI-powered Indian glass and ceramics market development platform connects the traditional production clusters in Firozabad, Khurja, Jaipur, and other centres with institutional buyers including government procurement agencies for institutional glassware, national retail chain procurement programmes, international glass and ceramic importers and wholesalers, hospitality industry procurement for hotel and restaurant tableware, and online marketplace fulfilment centres where the BIS IS 2829 certification and lead-free glaze compliance documentation collectively provide the quality assurance framework needed to establish and maintain market access for Indian glass and ceramic products in both domestic regulated retail channels and international export markets with stringent product safety and quality documentation requirements.</p></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}



