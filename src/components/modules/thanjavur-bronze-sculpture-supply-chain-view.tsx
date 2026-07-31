import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#581c87', '#7e22ce', '#9333ea', '#a855f7', '#c084fc', '#3b0764', '#1e1044', '#f3e8ff']
const PRODUCTS = ['Nataraja Bronze Statue 12-inch', 'Saraswati Idol 8-inch', 'Vishnu Lakshmi Set 10-inch', 'Ganesha Bronze Sculpture 6-inch', 'Shiva Parvati Panel 18-inch', 'Dancing Devi Figure 9-inch', 'Temple Bell Bronze 15-inch', 'Raja Ravi Varra Portrait Relief']
const FOUNDRIES = ['Thanjavur Bronze Cluster', 'Swamimalai Traditional Foundry', 'Kumbakonam Icon Centre', 'Mayavaram Sculpture Guild', 'Tiruvarur Temple Art Studio', 'Nachiarkoil Bell Caster', 'Mannargudi Bronze Works', 'Pudukottai Craft Unit']
const STATUSES = ['GI Thanjavur Bronze Mark', 'IS 12264 Bronze Grade A', 'Foam-Cocoon Crate', 'Shock-Absorber Truck', 'Climate 22-28C', 'Metal Alloy Composition QC']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="tbs-badge inline-block px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="tbs-status inline-block px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="tbs-costbar w-full bg-purple-100 rounded h-2"><div className="bg-purple-700 h-2 rounded" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ value, label, size = 64 }: { value: number; label: string; size?: number }) => {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (ri(0, 100, value) / 100) * circ
  return (
    <div className="tbs-health-ring flex flex-col items-center">
      <svg width={size} height={size}><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={4} /><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#581c87" strokeWidth={4} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`} /></svg>
      <span className="text-xs font-semibold" style={{ color: COLORS[0] }}>{value}%</span>
      <span className="text-[10px] text-gray-500">{label}</span>
    </div>
  )
}

const KpiTile = ({ label, value, icon }: { label: string; value: string; icon: string }) => (
  <Card className="tbs-kpi"><CardContent className="p-4"><div className="flex items-center gap-3"><span className="text-2xl">{icon}</span><div><p className="text-xs text-gray-500">{label}</p><p className="text-xl font-bold" style={{ color: COLORS[0] }}>{value}</p></div></div></CardContent></Card>
)

const ValueTile = ({ label, value }: { label: string; value: string }) => (
  <Card className="tbs-value"><CardContent className="p-4"><p className="text-xs text-gray-500">{label}</p><p className="text-lg font-semibold" style={{ color: COLORS[1] }}>{value}</p></CardContent></Card>
)

const genRecords = (startIdx: number) => Array.from({ length: 20 }, (_, i) => {
  const idx = startIdx + i
  const units = ['pcs', 'sets', 'pairs', 'units']
  return {
    id: `TBS-${String(idx).padStart(4, '0')}`, product: PRODUCTS[idx % 8], foundry: FOUNDRIES[idx % 8],
    status: STATUSES[idx % 6], qty: ri(1, 50, 2 + idx * 3), unit: units[idx % 4],
    cost: ri(25000, 2000000, 40000 + idx * 65000), date: `2025-07-${String(ri(1, 28, idx % 28 + 1)).padStart(2, '0')}`,
  }
})

const thanjavurRecords = [
  { id: 'TBS-0001', product: 'Nataraja Bronze Statue 12-inch', foundry: 'Thanjavur Bronze Cluster', status: 'GI Thanjavur Bronze Mark', qty: 5, unit: 'pcs', cost: 350000, date: '2025-07-02' },
  { id: 'TBS-0002', product: 'Saraswati Idol 8-inch', foundry: 'Swamimalai Traditional Foundry', status: 'IS 12264 Bronze Grade A', qty: 12, unit: 'pcs', cost: 180000, date: '2025-07-04' },
  { id: 'TBS-0003', product: 'Vishnu Lakshmi Set 10-inch', foundry: 'Kumbakonam Icon Centre', status: 'Foam-Cocoon Crate', qty: 8, unit: 'sets', cost: 420000, date: '2025-07-05' },
  { id: 'TBS-0004', product: 'Ganesha Bronze Sculpture 6-inch', foundry: 'Mayavaram Sculpture Guild', status: 'Shock-Absorber Truck', qty: 15, unit: 'pcs', cost: 135000, date: '2025-07-07' },
  { id: 'TBS-0005', product: 'Shiva Parvati Panel 18-inch', foundry: 'Tiruvarur Temple Art Studio', status: 'Climate 22-28C', qty: 3, unit: 'pcs', cost: 540000, date: '2025-07-08' },
  { id: 'TBS-0006', product: 'Dancing Devi Figure 9-inch', foundry: 'Nachiarkoil Bell Caster', status: 'Metal Alloy Composition QC', qty: 10, unit: 'pcs', cost: 165000, date: '2025-07-10' },
  { id: 'TBS-0007', product: 'Temple Bell Bronze 15-inch', foundry: 'Mannargudi Bronze Works', status: 'GI Thanjavur Bronze Mark', qty: 6, unit: 'pcs', cost: 240000, date: '2025-07-11' },
  { id: 'TBS-0008', product: 'Raja Ravi Varra Portrait Relief', foundry: 'Pudukottai Craft Unit', status: 'IS 12264 Bronze Grade A', qty: 4, unit: 'pcs', cost: 380000, date: '2025-07-13' },
  { id: 'TBS-0009', product: 'Nataraja Bronze Statue 12-inch', foundry: 'Thanjavur Bronze Cluster', status: 'Foam-Cocoon Crate', qty: 4, unit: 'pcs', cost: 280000, date: '2025-07-14' },
  { id: 'TBS-0010', product: 'Saraswati Idol 8-inch', foundry: 'Swamimalai Traditional Foundry', status: 'Shock-Absorber Truck', qty: 10, unit: 'pcs', cost: 150000, date: '2025-07-15' },
  { id: 'TBS-0011', product: 'Vishnu Lakshmi Set 10-inch', foundry: 'Kumbakonam Icon Centre', status: 'Climate 22-28C', qty: 7, unit: 'sets', cost: 367500, date: '2025-07-16' },
  { id: 'TBS-0012', product: 'Ganesha Bronze Sculpture 6-inch', foundry: 'Mayavaram Sculpture Guild', status: 'Metal Alloy Composition QC', qty: 13, unit: 'pcs', cost: 117000, date: '2025-07-17' },
  { id: 'TBS-0013', product: 'Shiva Parvati Panel 18-inch', foundry: 'Tiruvarur Temple Art Studio', status: 'GI Thanjavur Bronze Mark', qty: 2, unit: 'pcs', cost: 360000, date: '2025-07-18' },
  { id: 'TBS-0014', product: 'Dancing Devi Figure 9-inch', foundry: 'Nachiarkoil Bell Caster', status: 'IS 12264 Bronze Grade A', qty: 9, unit: 'pcs', cost: 148500, date: '2025-07-19' },
  { id: 'TBS-0015', product: 'Temple Bell Bronze 15-inch', foundry: 'Mannargudi Bronze Works', status: 'Foam-Cocoon Crate', qty: 5, unit: 'pcs', cost: 200000, date: '2025-07-20' },
  { id: 'TBS-0016', product: 'Raja Ravi Varra Portrait Relief', foundry: 'Pudukottai Craft Unit', status: 'Shock-Absorber Truck', qty: 3, unit: 'pcs', cost: 285000, date: '2025-07-21' },
  { id: 'TBS-0017', product: 'Nataraja Bronze Statue 12-inch', foundry: 'Thanjavur Bronze Cluster', status: 'Climate 22-28C', qty: 6, unit: 'pcs', cost: 420000, date: '2025-07-22' },
  { id: 'TBS-0018', product: 'Saraswati Idol 8-inch', foundry: 'Swamimalai Traditional Foundry', status: 'Metal Alloy Composition QC', qty: 11, unit: 'pcs', cost: 165000, date: '2025-07-23' },
  { id: 'TBS-0019', product: 'Vishnu Lakshmi Set 10-inch', foundry: 'Kumbakonam Icon Centre', status: 'GI Thanjavur Bronze Mark', qty: 5, unit: 'sets', cost: 262500, date: '2025-07-24' },
  { id: 'TBS-0020', product: 'Ganesha Bronze Sculpture 6-inch', foundry: 'Mayavaram Sculpture Guild', status: 'IS 12264 Bronze Grade A', qty: 14, unit: 'pcs', cost: 126000, date: '2025-07-25' },
]

export default function ThanjavurBronzeSculptureSupplyChainView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = [...thanjavurRecords, ...genRecords(21), ...genRecords(41)]

  const filteredRecords = useMemo(() => {
    return allRecords.filter(r => {
      if (searchQuery && !r.id.toLowerCase().includes(searchQuery.toLowerCase()) && !r.product.toLowerCase().includes(searchQuery.toLowerCase())) return false
      return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string))
    })
  }, [searchQuery, activeFilters, allRecords])

  const filterGroups = [
    { key: 'product', label: 'Product', options: PRODUCTS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.product === p).length })) },
    { key: 'status', label: 'Status', options: STATUSES.map(s => ({ value: s, label: s, count: allRecords.filter(r => r.status === s).length })) },
  ]

  const trendData = PRODUCTS.slice(0, 6).map((p, i) => ({ name: p.split(' ').slice(0, 2).join(' '), shipments: 4 + i * 3, cost: 80000 + i * 65000 }))
  const foundryChart = FOUNDRIES.slice(0, 6).map((f, i) => ({ name: f.split(' ').slice(0, 2).join(' '), volume: 15 + i * 8, revenue: 10 + i * 5 }))
  const statusPie = STATUSES.map((s, i) => ({ name: s.split(' ').slice(0, 2).join(' '), value: 5 + i * 4 }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="tbs-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Thanjavur Bronze Sculpture' }]} />
      <PageHeader title="Thanjavur Bronze Sculpture Supply Chain" description="Track Thanjavur's world-renowned bronze icon casting from Swamimalai and Kumbakonam foundries through lost-wax casting, metal alloy preparation, finishing, and packaging for temple installation and art export markets" />
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-purple-50">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <KpiTile icon="🎭" label="Total Castings" value={String(allRecords.length)} />
            <KpiTile icon="🏭" label="Foundries" value={String(FOUNDRIES.length)} />
            <KpiTile icon="💰" label="Total Value" value={`₹${(allRecords.reduce((a, r) => a + r.cost, 0) / 10000000).toFixed(2)}Cr`} />
            <KpiTile icon="📈" label="Avg Casting" value={`₹${Math.round(allRecords.reduce((a, r) => a + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>

          <Card className="tbs-health-grid">
            <CardHeader><CardTitle>Quality Compliance</CardTitle></CardHeader>
            <CardContent>
              <div className="flex justify-around">
                <HealthRing value={96} label="GI Tag" />
                <HealthRing value={92} label="IS 12264" />
                <HealthRing value={88} label="Crate" />
                <HealthRing value={83} label="Shock" />
                <HealthRing value={94} label="Climate" />
                <HealthRing value={90} label="Alloy QC" />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="UNESCO Heritage" value="Since 2004" />
            <ValueTile label="Swamimalai Artisans" value="1,200 Families" />
            <ValueTile label="Temple Orders" value="85%" />
            <ValueTile label="Export Countries" value="22" />
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
            placeholder="Search by ID, product, or foundry..."
          />

          <Card className="tbs-table-card">
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-purple-50">
                    <th className="p-3 text-left">ID</th>
                    <th className="p-3 text-left">Product</th>
                    <th className="p-3 text-left">Foundry</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-right">Qty</th>
                    <th className="p-3 text-right">Cost</th>
                    <th className="p-3 text-left">Cost Bar</th>
                    <th className="p-3 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.slice(0, 15).map(r => (
                    <tr key={r.id} className="border-b hover:bg-purple-50/50">
                      <td className="p-3 font-mono text-xs">{r.id}</td>
                      <td className="p-3"><ProductBadge name={r.product} /></td>
                      <td className="p-3 text-xs">{r.foundry}</td>
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
              <CardHeader><CardTitle>Foundry Volume</CardTitle></CardHeader>
              <CardContent>
                <BarChart width={500} height={250} data={foundryChart}>
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
            <Card className="tbs-insight"><CardHeader><CardTitle>Thanjavur &amp; Swamimalai — India's Bronze Heritage Capital</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Thanjavur and Swamimalai in Tamil Nadu have been India's bronze icon casting centres since the Chola dynasty (9th-13th century CE), producing the world-famous Nataraja (cosmic dancer) bronze that became India's cultural emblem at CERN. The lost-wax (cire-perdue) casting method is identical to the 1,000-year-old technique described in the Silpa Sastras. GI-tagged Thanjavur Bronze Icon registered in 2008. The craft supports 1,200 artisan families in Swamimalai alone with annual production of 15,000 icons valued at Rs 350 crore. UNESCO inscribed the traditional bronze casting technique on its Intangible Cultural Heritage list in 2004. Over 85% of production serves temple installations across India and 15% goes to international art collectors and museums.</p></CardContent></Card>
            <Card className="tbs-insight"><CardHeader><CardTitle>IS 12264 Bronze Alloy &amp; Casting Standards</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">IS 12264 specifies bronze icon alloy composition: copper 82-88%, tin 8-12%, lead 0.5-3%, zinc 0.5-2%, iron below 0.5%, with trace manganese and phosphorus. Panchaloha (five-metal) alloy adds gold (1-5%) and silver (1-3%) for temple icons. Casting temperature at 1,080-1,120 degrees Celsius in charcoal-fired furnaces with hand-bellows achieving 5-7 CFM air flow. Surface finish requires 72+ hours of hand polishing with chisels, files, and abrasives from 80 to 1,200 grit. Tensile strength minimum 220 MPa, Brinell hardness 60-80 HB. Weight tolerance within 3% of specification for temple icons. IS 14740 covers the copper-tin alloy corrosion resistance test requiring 96-hour salt spray exposure.</p></CardContent></Card>
            <Card className="tbs-insight"><CardHeader><CardTitle>Bronze Sculpture Packaging &amp; Transport</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Bronze sculptures weighing 2-50 kg per piece require custom foam cocoon packaging with density 18-22 kg/m3, polyethylene moisture barrier, and 7-ply corrugated outer carton. Maximum stack height is 2 cartons (40 kg each) due to weight. From Swamimalai to Chennai port (350 km) takes 8-10 hours via NH45 with shock-absorber-equipped trucks (air suspension mandatory for orders above 10 pieces). Storage at 22-28 degrees Celsius and below 50% humidity prevents patina oxidation. For international shipping, ISPM-15 treated wooden crates with desiccant packets maintain stable conditions during 30-45 day sea freight to EU and US ports. Damage rate reduced from 6% to 0.8% under Tamil Nadu Handicrafts Development Corporation packaging programme since 2018.</p></CardContent></Card>
            <Card className="tbs-insight"><CardHeader><CardTitle>AI Alloy Analysis &amp; Museum Market Growth</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">AI-powered X-ray fluorescence spectroscopy analyses bronze alloy composition in 45 seconds versus 3 days for traditional wet chemistry lab methods, detecting counterfeit alloys with 99.7% accuracy. Machine learning predicts casting defects (porosity, shrinkage cavities) from furnace temperature data with 88% accuracy before pouring. India's bronze sculpture export grew 160% from Rs 52 crore (2019) to Rs 135 crore (2025), targeting Rs 250 crore by 2028. Major buyers include British Museum, Metropolitan Museum of Art, and private collectors in Europe and North America. Nataraja bronze replicas command $5,000-50,000 at Christie's and Sotheby's auctions. Blockchain provenance from foundry wax model to final sculpture combats the Rs 80 crore annual trade in machine-cast fakes sold as hand-made icons.</p></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
