import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#991b1b', '#b91c1c', '#dc2626', '#ef4444', '#fca5a5', '#7f1d1d', '#450a0a', '#fef2f2']
const PRODUCTS = ['Kathputli King Pair Set', 'Rajasthani String Puppet Troupe', 'Nawab Court Puppet Set', 'Fairy Tale Marionette Box', 'Animal Puppet Collection', 'Demon Ravana Kathputli', 'Village Storyteller Set', 'Royal Procession Puppet Stage']
const ARTISANS = ['Jodhpur Kathputli Colony', 'Jaipur Puppet Art Guild', 'Udaipur String Art Studio', 'Bikaner Folk Art Centre', 'Jaisalmer Desert Puppet Troupe', 'Pushkar Craft Market', 'Ajmer Puppet Workshop', 'Jodhpur Mandore Artisan Village']
const STATUSES = ['GI Rajasthan Kathputli Mark', 'IS 16788 Craft Grade A', 'Bubble-Wrapped Puppet Box', 'Palletised Truck Transit', 'Dust-Free Storage 20-25C', 'Wood Finish QC']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ product }: { product: string }) => (
  <span className="rpl-badge inline-block px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-900">{product}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="rpl-status inline-block px-2 py-0.5 rounded text-xs font-medium bg-red-50 text-red-800 border border-red-200">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="rpl-costbar w-full bg-red-100 rounded h-2"><div className="bg-red-700 h-2 rounded" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ value, label, size = 64 }: { value: number; label: string; size?: number }) => {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (ri(0, 100, value) / 100) * circ
  return (
    <div className="rpl-health-ring flex flex-col items-center">
      <svg width={size} height={size}><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#fecaca" strokeWidth={4} /><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#991b1b" strokeWidth={4} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`} /></svg>
      <span className="text-xs font-semibold text-red-900">{value}%</span>
      <span className="text-[10px] text-gray-500">{label}</span>
    </div>
  )
}

const KpiTile = ({ label, value, icon }: { label: string; value: string; icon: string }) => (
  <Card className="rpl-kpi"><CardContent className="p-4"><div className="flex items-center gap-3"><span className="text-2xl">{icon}</span><div><p className="text-xs text-gray-500">{label}</p><p className="text-xl font-bold text-red-900">{value}</p></div></div></CardContent></Card>
)

const ValueTile = ({ label, value }: { label: string; value: string }) => (
  <Card className="rpl-value"><CardContent className="p-4"><p className="text-xs text-gray-500">{label}</p><p className="text-lg font-semibold text-red-800">{value}</p></CardContent></Card>
)

const genRecords = (startIdx: number) => Array.from({ length: 20 }, (_, i) => {
  const idx = startIdx + i
  return {
    id: `RPL-${String(idx).padStart(4, '0')}`, product: PRODUCTS[idx % 8], artisan: ARTISANS[idx % 8],
    status: STATUSES[idx % 6], qty: ri(3, 50, 5 + idx * 2), unit: 'sets',
    cost: ri(500, 9500, 1200 + idx * 420), date: `2025-${String(ri(1, 12, (idx % 12) + 1)).padStart(2, '0')}-${String(ri(1, 28, idx % 28 + 1)).padStart(2, '0')}`,
  }
})

const handRecords = [
  { id: 'RPL-0001', product: 'Kathputli King Pair Set', artisan: 'Jodhpur Kathputli Colony', status: 'GI Rajasthan Kathputli Mark', qty: 25, unit: 'sets', cost: 3200, date: '2025-01-15' },
  { id: 'RPL-0002', product: 'Rajasthani String Puppet Troupe', artisan: 'Jaipur Puppet Art Guild', status: 'IS 16788 Craft Grade A', qty: 12, unit: 'sets', cost: 5800, date: '2025-01-22' },
  { id: 'RPL-0003', product: 'Nawab Court Puppet Set', artisan: 'Udaipur String Art Studio', status: 'Bubble-Wrapped Puppet Box', qty: 8, unit: 'sets', cost: 4100, date: '2025-02-03' },
  { id: 'RPL-0004', product: 'Fairy Tale Marionette Box', artisan: 'Bikaner Folk Art Centre', status: 'Palletised Truck Transit', qty: 30, unit: 'sets', cost: 2900, date: '2025-02-10' },
  { id: 'RPL-0005', product: 'Animal Puppet Collection', artisan: 'Jaisalmer Desert Puppet Troupe', status: 'Dust-Free Storage 20-25C', qty: 18, unit: 'sets', cost: 3750, date: '2025-02-18' },
  { id: 'RPL-0006', product: 'Demon Ravana Kathputli', artisan: 'Pushkar Craft Market', status: 'Wood Finish QC', qty: 15, unit: 'sets', cost: 4600, date: '2025-03-01' },
  { id: 'RPL-0007', product: 'Village Storyteller Set', artisan: 'Ajmer Puppet Workshop', status: 'GI Rajasthan Kathputli Mark', qty: 22, unit: 'sets', cost: 3400, date: '2025-03-08' },
  { id: 'RPL-0008', product: 'Royal Procession Puppet Stage', artisan: 'Jodhpur Mandore Artisan Village', status: 'IS 16788 Craft Grade A', qty: 6, unit: 'sets', cost: 8900, date: '2025-03-15' },
  { id: 'RPL-0009', product: 'Kathputli King Pair Set', artisan: 'Jaipur Puppet Art Guild', status: 'Bubble-Wrapped Puppet Box', qty: 35, unit: 'sets', cost: 2800, date: '2025-03-22' },
  { id: 'RPL-0010', product: 'Rajasthani String Puppet Troupe', artisan: 'Jodhpur Kathputli Colony', status: 'Palletised Truck Transit', qty: 10, unit: 'sets', cost: 6200, date: '2025-04-01' },
  { id: 'RPL-0011', product: 'Nawab Court Puppet Set', artisan: 'Bikaner Folk Art Centre', status: 'Dust-Free Storage 20-25C', qty: 14, unit: 'sets', cost: 4900, date: '2025-04-10' },
  { id: 'RPL-0012', product: 'Fairy Tale Marionette Box', artisan: 'Udaipur String Art Studio', status: 'Wood Finish QC', qty: 20, unit: 'sets', cost: 3100, date: '2025-04-18' },
  { id: 'RPL-0013', product: 'Animal Puppet Collection', artisan: 'Pushkar Craft Market', status: 'GI Rajasthan Kathputli Mark', qty: 28, unit: 'sets', cost: 2600, date: '2025-05-02' },
  { id: 'RPL-0014', product: 'Demon Ravana Kathputli', artisan: 'Jaisalmer Desert Puppet Troupe', status: 'IS 16788 Craft Grade A', qty: 9, unit: 'sets', cost: 5400, date: '2025-05-10' },
  { id: 'RPL-0015', product: 'Village Storyteller Set', artisan: 'Ajmer Puppet Workshop', status: 'Bubble-Wrapped Puppet Box', qty: 40, unit: 'sets', cost: 2200, date: '2025-05-18' },
  { id: 'RPL-0016', product: 'Royal Procession Puppet Stage', artisan: 'Jodhpur Mandore Artisan Village', status: 'Palletised Truck Transit', qty: 4, unit: 'sets', cost: 9500, date: '2025-05-25' },
  { id: 'RPL-0017', product: 'Kathputli King Pair Set', artisan: 'Udaipur String Art Studio', status: 'Dust-Free Storage 20-25C', qty: 32, unit: 'sets', cost: 3050, date: '2025-06-01' },
  { id: 'RPL-0018', product: 'Rajasthani String Puppet Troupe', artisan: 'Bikaner Folk Art Centre', status: 'Wood Finish QC', qty: 11, unit: 'sets', cost: 6800, date: '2025-06-08' },
  { id: 'RPL-0019', product: 'Nawab Court Puppet Set', artisan: 'Jodhpur Kathputli Colony', status: 'GI Rajasthan Kathputli Mark', qty: 16, unit: 'sets', cost: 4300, date: '2025-06-15' },
  { id: 'RPL-0020', product: 'Fairy Tale Marionette Box', artisan: 'Jaipur Puppet Art Guild', status: 'IS 16788 Craft Grade A', qty: 24, unit: 'sets', cost: 2750, date: '2025-06-22' },
]

export default function RajasthanPuppetryLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = [...handRecords, ...genRecords(21), ...genRecords(41)]

  const filteredRecords = useMemo(() => {
    return allRecords.filter(r => {
      if (searchQuery && !r.id.toLowerCase().includes(searchQuery.toLowerCase()) && !r.product.toLowerCase().includes(searchQuery.toLowerCase())) return false
      return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string))
    })
  }, [searchQuery, activeFilters, allRecords])

  const filterGroups = [
    { key: 'product', label: 'Product', options: PRODUCTS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.product === p).length })) },
    { key: 'artisan', label: 'Artisan', options: ARTISANS.map(a => ({ value: a, label: a, count: allRecords.filter(r => r.artisan === a).length })) },
  ]

  const trendData = PRODUCTS.slice(0, 6).map((p, i) => ({ name: p.split(' ').slice(0, 2).join(' '), shipments: 4 + i * 3, cost: 8000 + i * 6500 }))
  const artisanChart = ARTISANS.slice(0, 6).map((a, i) => ({ name: a.split(' ').slice(0, 2).join(' '), volume: 15 + i * 8, revenue: 10 + i * 5 }))
  const statusPie = STATUSES.map((s, i) => ({ name: s.split(' ').slice(0, 2).join(' '), value: 5 + i * 4 }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))


  return (
    <div className="rpl-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Rajasthan Puppetry' }]} />
      <PageHeader title="Rajasthan Puppetry Logistics" description="Track Kathputli craft shipments from artisan clusters across Jodhpur, Jaipur, Udaipur, Bikaner, and Jaisalmer — GI-tagged string puppet logistics with IS 16788 craft grade certification, bubble-wrapped packaging, and dust-free climate-controlled warehouse storage for cultural heritage export." />
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-red-50">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <KpiTile icon="🎭" label="Total Puppets" value={String(allRecords.length)} />
            <KpiTile icon="🏘️" label="Artisan Clusters" value={String(ARTISANS.length)} />
            <KpiTile icon="💰" label="Total Value" value={`₹${(allRecords.reduce((a, r) => a + r.cost, 0) / 100000).toFixed(2)}L`} />
            <KpiTile icon="📈" label="Avg Cost" value={`₹${Math.round(allRecords.reduce((a, r) => a + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>

          <Card className="rpl-health-grid">
            <CardHeader><CardTitle>Quality Compliance</CardTitle></CardHeader>
            <CardContent>
              <div className="flex justify-around">
                <HealthRing value={96} label="GI Tag" />
                <HealthRing value={92} label="IS 16788" />
                <HealthRing value={88} label="Bubble Box" />
                <HealthRing value={81} label="Palletised" />
                <HealthRing value={90} label="Dust-Free" />
                <HealthRing value={94} label="Wood QC" />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Active Artisans" value="180+" />
            <ValueTile label="Annual Puppets" value="8,500 sets" />
            <ValueTile label="Export Markets" value="22 Countries" />
            <ValueTile label="UNESCO Year" value="Since 2010" />
          </div>
        </TabsContent>

        <TabsContent value="shipments" className="space-y-4">
          <SearchFilterToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onClearSearch={() => setSearchQuery('')}
            activeFilters={activeFilters}
            filterGroups={filterGroups}
            onToggleFilter={(key, value) => setActiveFilters(p => ({ ...p, [key]: p[key]?.includes(value) ? p[key].filter((v: string) => v !== value) : [...(p[key] || []), value] }))}
            onClearAllFilters={() => setActiveFilters({})}
            totalItems={allRecords.length}
            filteredCount={filteredRecords.length}
            onRefresh={() => {}}
            placeholder="Search by ID, product, or artisan..."
          />

          <Card className="rpl-table-card">
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-red-50">
                    <th className="p-3 text-left">ID</th>
                    <th className="p-3 text-left">Product</th>
                    <th className="p-3 text-left">Artisan</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-right">Qty</th>
                    <th className="p-3 text-right">Cost</th>
                    <th className="p-3 text-left">Cost Bar</th>
                    <th className="p-3 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.slice(0, 15).map(r => (
                    <tr key={r.id} className="border-b hover:bg-red-50/50">
                      <td className="p-3 font-mono text-xs">{r.id}</td>
                      <td className="p-3"><ProductBadge product={r.product} /></td>
                      <td className="p-3 text-xs">{r.artisan}</td>
                      <td className="p-3"><StatusBadge status={r.status} /></td>
                      <td className="p-3 text-right">{r.qty} {r.unit}</td>
                      <td className="p-3 text-right">₹{r.cost.toLocaleString()}</td>
                      <td className="p-3 w-28"><CostBar cost={r.cost} max={maxCost} /></td>
                      <td className="p-3 text-xs text-gray-500">{r.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle>Shipment Trend</CardTitle></CardHeader>
              <CardContent>
                <LineChart width={500} height={250} data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={11} />
                  <YAxis fontSize={11} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="shipments" stroke={COLORS[0]} strokeWidth={2} />
                  <Line type="monotone" dataKey="cost" stroke={COLORS[3]} strokeWidth={2} />
                </LineChart>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Artisan Volume</CardTitle></CardHeader>
              <CardContent>
                <BarChart width={500} height={250} data={artisanChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={10} />
                  <YAxis fontSize={11} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="volume" fill={COLORS[0]} />
                  <Bar dataKey="revenue" fill={COLORS[3]} />
                </BarChart>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader><CardTitle>Status Distribution</CardTitle></CardHeader>
            <CardContent>
              <PieChart width={500} height={300}>
                <Pie data={statusPie} cx={200} cy={150} outerRadius={100} dataKey="value" label>
                  {statusPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card className="rpl-insight"><CardHeader><CardTitle>Rajasthan Kathputli — 1,000-Year String Puppet Tradition (UNESCO 2010)</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Rajasthan string puppetry, known as Kathputli, represents one of the oldest performing arts in India with a documented legacy stretching over a millennium. Recognised by UNESCO under its 2010 Intangible Cultural Heritage umbrella alongside other Indian traditions, this art form originated in the Bhat community of Rajasthan and was historically patronised by royal courts across Jodhpur, Jaipur, Udaipur, and Jaisalmer. Each hand-carved wooden puppet features intricate costumes adorned with mirror work, vibrant Rajasthani fabrics, and traditional jewellery motifs crafted through generations of artisanal expertise. The word Kathputli derives from two Rajasthani words: kath meaning wood and putli meaning doll, perfectly describing these mesmerising string-controlled marionettes. Performances traditionally narrate tales from the Ramayana, Mahabharata, and local folk legends, accompanied by live music from instruments like the dholak and harmonium. Our logistics platform currently tracks over sixty active shipments from eight artisan clusters spanning six major Rajasthani craft hubs, ensuring this ancient tradition reaches global audiences while maintaining cultural integrity throughout the supply chain from workshop to exhibition stage.</p></CardContent></Card>
            <Card className="rpl-insight"><CardHeader><CardTitle>IS 16788 Craft Puppet Standards &amp; GI Certification</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">The Indian Standard IS 16788 establishes comprehensive quality benchmarks specifically designed for traditional craft puppets, covering material specifications for the seasoned wood types — primarily mango wood and neem wood — commonly used in Kathputli construction across Rajasthan. This standard mandates dimensional tolerances for puppet components, specifies textile fastness requirements for the elaborate Rajasthani costumes, and defines durability testing protocols that simulate years of theatrical performance use under varying climatic conditions. For logistics operations, IS 16788 compliance means each puppet shipment must be accompanied by a certified grade assessment documenting wood moisture content, fabric colour fastness ratings, and structural integrity scores. The Geographical Indication tag for Rajasthan Kathputli, registered under the GI Act 1999, further authenticates origin from designated districts and protects against counterfeit reproductions. Our warehouse management system automatically flags any consignment lacking valid IS 16788 certification before it enters the distribution pipeline. The Grade A certification track covers approximately one-third of all tracked shipments, indicating the highest tier of craft quality that commands premium pricing in both domestic cultural tourism markets and international museum curatorial circuits across Europe, North America, and East Asia.</p></CardContent></Card>
            <Card className="rpl-insight"><CardHeader><CardTitle>Fragile Wood &amp; Fabric Puppet Packaging Logistics</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Kathputli logistics presents unique packaging challenges that distinguish it from conventional warehouse operations. Each puppet must be individually bubble-wrapped with acid-free tissue paper separating articulated limbs to prevent friction damage during transit across Rajasthan's desert roads and national highway corridors. The wooden bodies, typically carved from lightweight mango wood, are susceptible to cracking in low-humidity environments, necessitating humidity-controlled packaging inserts that maintain a stable moisture microclimate around each figure throughout the supply chain journey. The painted surfaces use natural mineral pigments including red ochre from laterite deposits and gold leaf from Jaipur workshops that can flake under vibration stress, requiring custom-moulded foam cradles within each shipping carton. Our palletised truck transit protocol stacks puppet boxes no higher than four tiers to prevent compression damage, and every shipment includes silica gel desiccant packs calibrated for the specific transit route's climate profile from source artisan cluster to destination warehouse. The Dust-Free Storage specification mandates temperatures between twenty and twenty-five degrees Celsius with relative humidity maintained between forty and sixty percent, conditions critical for preserving both the structural wood joints and the delicate thread-and-bead ornamentation that gives each Rajasthani puppet its distinctive cultural character and commercial value in heritage craft markets.</p></CardContent></Card>
            <Card className="rpl-insight"><CardHeader><CardTitle>AI Digitisation &amp; Global Cultural Export Market</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">The convergence of artificial intelligence and traditional Kathputli craftsmanship is opening unprecedented pathways for Rajasthan puppetry in global cultural export markets worth an estimated Rs 45 crore annually and growing at eighteen percent year-on-year. Machine learning algorithms now analyse historical sales data across forty-two countries to predict seasonal demand patterns for specific puppet varieties, enabling artisan clusters to optimise production schedules and reduce inventory holding costs by up to thirty percent while ensuring fair artisan wages. Digital documentation initiatives use computer vision and photogrammetry to create three-dimensional catalogues of master artisan puppets, facilitating remote authentication for international buyers and museum acquisition committees in London, Paris, Tokyo, and New York. Blockchain-verified provenance tracking ensures that every exported Kathputli can be traced back to its specific artisan workshop, combating the proliferation of mass-produced imitations that undermine authentic craft livelihoods across Jodhpur, Jaipur, and Udaipur communities. Our logistics intelligence platform integrates these AI capabilities with real-time transit monitoring, providing artisan clusters with predictive analytics on optimal shipping windows, customs clearance probabilities for different destination markets, and dynamic pricing recommendations that balance fair artisan compensation with competitive international market positioning across cultural heritage retail channels and UNESCO exhibition networks worldwide.</p></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
