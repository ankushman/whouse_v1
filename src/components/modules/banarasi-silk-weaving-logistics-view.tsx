import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#581c87', '#6b21a8', '#7c3aed', '#8b5cf6', '#c4b5fd', '#3b0764', '#1e0438', '#faf5ff']
const PRODUCTS = ['Banarasi Katan Silk Saree', 'Organza Banarasi Brocade', 'Shattir Banarasi Fabric', 'Tanchoi Banarasi Silk', 'Jangla Banarasi Weave', 'Banarasi Tussar Silk Saree', 'Mashru Banarasi Fabric', 'Georgette Banarasi Embroidered']
const WEAVERS = ['Varanasi Silk Weavers Colony', 'Alaipur Loom Cluster', 'Madanpura Weaving Centre', 'Peeli Kothi Artisans', 'Dal Mandi Silk Guild', 'Chaukaghat Handloom', 'Godaulia Weaving Society', 'Sonarpura Banarasi Unit']
const STATUSES = ['GI Banarasi Silk Mark', 'ISI Silk Handloom Grade A', 'Silk-Cloth Rolled Bundle', 'Humidity-Controlled Truck', 'Moisture-Free Vault 18-22C', 'Zari Thread Count QC']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ product }: { product: string }) => (
  <span className="bsw-badge inline-block px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{product}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="bsw-status inline-block px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="bsw-costbar w-full bg-purple-100 rounded h-2"><div className="bg-purple-700 h-2 rounded" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ value, label, size = 64 }: { value: number; label: string; size?: number }) => {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (ri(0, 100, value) / 100) * circ
  return (
    <div className="bsw-health-ring flex flex-col items-center">
      <svg width={size} height={size}><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={4} /><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#581c87" strokeWidth={4} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`} /></svg>
      <span className="text-xs font-semibold" style={{ color: COLORS[0] }}>{value}%</span>
      <span className="text-[10px] text-gray-500">{label}</span>
    </div>
  )
}

const KpiTile = ({ label, value, icon }: { label: string; value: string; icon: string }) => (
  <Card className="bsw-kpi"><CardContent className="p-4"><div className="flex items-center gap-3"><span className="text-2xl">{icon}</span><div><p className="text-xs text-gray-500">{label}</p><p className="text-xl font-bold" style={{ color: COLORS[0] }}>{value}</p></div></div></CardContent></Card>
)

const ValueTile = ({ label, value }: { label: string; value: string }) => (
  <Card className="bsw-value"><CardContent className="p-4"><p className="text-xs text-gray-500">{label}</p><p className="text-lg font-semibold" style={{ color: COLORS[1] }}>{value}</p></CardContent></Card>
)

const genRecords = (startIdx: number) => Array.from({ length: 20 }, (_, i) => {
  const idx = startIdx + i
  const units = ['pcs', 'yards', 'm', 'bundles']
  return {
    id: `BSW-${String(idx).padStart(4, '0')}`, product: PRODUCTS[idx % 8], weaver: WEAVERS[idx % 8],
    status: STATUSES[idx % 6], qty: ri(10, 500, 15 + idx * 12), unit: units[idx % 4],
    cost: ri(5000, 200000, 8000 + idx * 6000), date: `2024-${String(ri(1, 12, (idx % 12) + 1)).padStart(2, '0')}-${String(ri(1, 28, idx % 28 + 1)).padStart(2, '0')}`,
  }
})

const banarasiRecords = [
  { id: 'BSW-0001', product: 'Banarasi Katan Silk Saree', weaver: 'Varanasi Silk Weavers Colony', status: 'GI Banarasi Silk Mark', qty: 120, unit: 'pcs', cost: 48000, date: '2024-01-15' },
  { id: 'BSW-0002', product: 'Organza Banarasi Brocade', weaver: 'Alaipur Loom Cluster', status: 'ISI Silk Handloom Grade A', qty: 85, unit: 'yards', cost: 32000, date: '2024-01-22' },
  { id: 'BSW-0003', product: 'Shattir Banarasi Fabric', weaver: 'Madanpura Weaving Centre', status: 'Silk-Cloth Rolled Bundle', qty: 200, unit: 'yards', cost: 18000, date: '2024-02-05' },
  { id: 'BSW-0004', product: 'Tanchoi Banarasi Silk', weaver: 'Peeli Kothi Artisans', status: 'Humidity-Controlled Truck', qty: 60, unit: 'pcs', cost: 55000, date: '2024-02-14' },
  { id: 'BSW-0005', product: 'Jangla Banarasi Weave', weaver: 'Dal Mandi Silk Guild', status: 'Moisture-Free Vault 18-22C', qty: 150, unit: 'yards', cost: 42000, date: '2024-02-28' },
  { id: 'BSW-0006', product: 'Banarasi Tussar Silk Saree', weaver: 'Chaukaghat Handloom', status: 'Zari Thread Count QC', qty: 95, unit: 'pcs', cost: 38000, date: '2024-03-10' },
  { id: 'BSW-0007', product: 'Mashru Banarasi Fabric', weaver: 'Godaulia Weaving Society', status: 'GI Banarasi Silk Mark', qty: 175, unit: 'yards', cost: 22000, date: '2024-03-18' },
  { id: 'BSW-0008', product: 'Georgette Banarasi Embroidered', weaver: 'Sonarpura Banarasi Unit', status: 'ISI Silk Handloom Grade A', qty: 110, unit: 'pcs', cost: 36000, date: '2024-03-25' },
  { id: 'BSW-0009', product: 'Banarasi Katan Silk Saree', weaver: 'Madanpura Weaving Centre', status: 'Silk-Cloth Rolled Bundle', qty: 65, unit: 'pcs', cost: 52000, date: '2024-04-02' },
  { id: 'BSW-0010', product: 'Organza Banarasi Brocade', weaver: 'Peeli Kothi Artisans', status: 'Humidity-Controlled Truck', qty: 190, unit: 'yards', cost: 28000, date: '2024-04-15' },
  { id: 'BSW-0011', product: 'Tanchoi Banarasi Silk', weaver: 'Varanasi Silk Weavers Colony', status: 'Zari Thread Count QC', qty: 80, unit: 'pcs', cost: 45000, date: '2024-04-28' },
  { id: 'BSW-0012', product: 'Jangla Banarasi Weave', weaver: 'Alaipur Loom Cluster', status: 'Moisture-Free Vault 18-22C', qty: 140, unit: 'yards', cost: 35000, date: '2024-05-08' },
  { id: 'BSW-0013', product: 'Shattir Banarasi Fabric', weaver: 'Dal Mandi Silk Guild', status: 'GI Banarasi Silk Mark', qty: 210, unit: 'yards', cost: 15000, date: '2024-05-20' },
  { id: 'BSW-0014', product: 'Banarasi Tussar Silk Saree', weaver: 'Chaukaghat Handloom', status: 'ISI Silk Handloom Grade A', qty: 70, unit: 'pcs', cost: 41000, date: '2024-06-01' },
  { id: 'BSW-0015', product: 'Mashru Banarasi Fabric', weaver: 'Godaulia Weaving Society', status: 'Silk-Cloth Rolled Bundle', qty: 160, unit: 'yards', cost: 20000, date: '2024-06-12' },
  { id: 'BSW-0016', product: 'Georgette Banarasi Embroidered', weaver: 'Sonarpura Banarasi Unit', status: 'Humidity-Controlled Truck', qty: 100, unit: 'pcs', cost: 33000, date: '2024-06-25' },
  { id: 'BSW-0017', product: 'Banarasi Katan Silk Saree', weaver: 'Peeli Kothi Artisans', status: 'Zari Thread Count QC', qty: 55, unit: 'pcs', cost: 50000, date: '2024-07-03' },
  { id: 'BSW-0018', product: 'Organza Banarasi Brocade', weaver: 'Madanpura Weaving Centre', status: 'Moisture-Free Vault 18-22C', qty: 130, unit: 'yards', cost: 26000, date: '2024-07-18' },
  { id: 'BSW-0019', product: 'Tanchoi Banarasi Silk', weaver: 'Varanasi Silk Weavers Colony', status: 'GI Banarasi Silk Mark', qty: 90, unit: 'pcs', cost: 47000, date: '2024-08-01' },
  { id: 'BSW-0020', product: 'Jangla Banarasi Weave', weaver: 'Dal Mandi Silk Guild', status: 'ISI Silk Handloom Grade A', qty: 180, unit: 'yards', cost: 39000, date: '2024-08-15' }
]

export default function BanarasiSilkWeavingLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = [...banarasiRecords, ...genRecords(21), ...genRecords(41)]

  const filteredRecords = useMemo(() => {
    return allRecords.filter(r => {
      if (searchQuery && !r.id.toLowerCase().includes(searchQuery.toLowerCase()) && !r.product.toLowerCase().includes(searchQuery.toLowerCase())) return false
      return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string))
    })
  }, [searchQuery, activeFilters, allRecords])

  const filterGroups = [
    { key: 'product', label: 'Product', options: PRODUCTS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.product === p).length })) },
    { key: 'weaver', label: 'Weaver Cluster', options: WEAVERS.map(w => ({ value: w, label: w, count: allRecords.filter(r => r.weaver === w).length })) },
  ]

  const trendData = PRODUCTS.slice(0, 6).map((p, i) => ({ name: p.split(' ').slice(0, 2).join(' '), shipments: 20 + i * 6, cost: 12000 + i * 8000 }))
  const weaverChart = WEAVERS.slice(0, 6).map((w, i) => ({ name: w.split(' ').slice(0, 2).join(' '), volume: 60 + i * 30, revenue: 4 + i * 3 }))
  const statusPie = STATUSES.map((s, i) => ({ name: s.split(' ').slice(0, 2).join(' '), value: 8 + i * 3 }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="bsw-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Banarasi Silk Weaving' }]} />
      <PageHeader title="Banarasi Silk Weaving Logistics" description="Track Varanasi's legendary Banarasi silk weaving from traditional pit loom workshops through zari quality control, humidity-controlled transit, and GI certification across Uttar Pradesh" />
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-purple-50">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <KpiTile icon="🧵" label="Total Shipments" value={String(allRecords.length)} />
            <KpiTile icon="🏭" label="Weaver Clusters" value={String(WEAVERS.length)} />
            <KpiTile icon="💰" label="Total Value" value={`₹${(allRecords.reduce((a, r) => a + r.cost, 0) / 100000).toFixed(1)}L`} />
            <KpiTile icon="📈" label="Avg Shipment" value={`₹${Math.round(allRecords.reduce((a, r) => a + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>

          <Card className="bsw-health-grid">
            <CardHeader><CardTitle>Quality Compliance</CardTitle></CardHeader>
            <CardContent>
              <div className="flex justify-around">
                <HealthRing value={94} label="GI Tag" />
                <HealthRing value={90} label="ISI Grade" />
                <HealthRing value={86} label="Bundle" />
                <HealthRing value={82} label="Transit" />
                <HealthRing value={91} label="Vault" />
                <HealthRing value={88} label="Zari QC" />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Weaving Families" value="3 Lakh+" />
            <ValueTile label="Annual Production" value="60 Lakh pcs" />
            <ValueTile label="Export Markets" value="35 Countries" />
            <ValueTile label="Loom Types" value="Pit & Jacquard" />
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
            placeholder="Search by shipment ID, product, or weaver..."
          />

          <Card className="bsw-table-card">
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-purple-50">
                    <th className="p-3 text-left">ID</th>
                    <th className="p-3 text-left">Product</th>
                    <th className="p-3 text-left">Weaver</th>
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
                      <td className="p-3"><ProductBadge product={r.product} /></td>
                      <td className="p-3 text-xs">{r.weaver}</td>
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
              <CardHeader><CardTitle>Weaver Cluster Volume</CardTitle></CardHeader>
              <CardContent>
                <BarChart width={500} height={250} data={weaverChart}>
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
            <Card className="bsw-insight"><CardHeader><CardTitle>🏛️ 500-Year Mughal-Era Weaving Heritage</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Banarasi silk weaving traces its origins back over five centuries to the Mughal courts of the sixteenth century, when master artisans from Persia were brought to Varanasi by emperors to establish a thriving silk textile industry. These weavers introduced intricate techniques including the celebrated pit loom method, enabling extraordinarily detailed patterns such as the iconic Mughal floral motifs, paisley designs, and minakari work that remain hallmarks of Banarasi fabric today. Generations of weaving families have preserved and refined these time-honoured techniques, passing extraordinary skills from father to son across hundreds of years. Each Banarasi saree represents hundreds of hours of meticulous handloom craftsmanship that cannot be replicated by machines. This enduring tradition sustains over three lakh artisans across Varanasi and nearby districts.</p></CardContent></Card>
            <Card className="bsw-insight"><CardHeader><CardTitle>🏷️ GI Banarasi Silk Mark &amp; ISI Certification</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">The Geographical Indication certification for Banarasi silk ensures authenticity and protects the intellectual property of Varanasi weavers against counterfeit imitations from power loom sectors. The GI Banarasi Silk Mark guarantees that every saree bearing this label has been handwoven on a traditional loom within the defined geographical boundaries of Varanasi using pure mulberry silk and genuine metallic zari threads. The ISI Silk Handloom Grade A certification from the Bureau of Indian Standards establishes rigorous quality benchmarks for thread count, fabric density, dye fastness, and tensile strength that every production batch must meet. Together these certification frameworks provide consumers with verifiable quality assurance while protecting the livelihoods and reputations of traditional Banarasi weaver communities who invest significant resources maintaining exacting quality standards.</p></CardContent></Card>
            <Card className="bsw-insight"><CardHeader><CardTitle>📦 Silk &amp; Zari Monsoon Packaging Logistics</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Silk fabrics and zari-embroidered textiles require extraordinarily careful packaging and storage conditions to prevent degradation from humidity and temperature fluctuations during Varanasi's intense monsoon season from June through September. Humidity-controlled trucks equipped with dehumidifiers and temperature regulation systems are essential for transporting finished Banarasi silk products from weaving centres to warehouses and retail outlets across India. Finished silk-cloth rolled bundles must be wrapped in breathable muslin cloth treated with natural moth repellents before placement in moisture-free vaults maintained at precisely eighteen to twenty-two degrees Celsius using industrial refrigeration. Acid-free tissue paper and silica gel desiccant packets create protective microenvironments preventing fungal growth, oxidative damage, and silver tarnish on metallic zari threads. The entire packaging pipeline from loom exit to warehouse shelf undergoes seventeen distinct quality checkpoints ensuring zero contamination of premium silk merchandise.</p></CardContent></Card>
            <Card className="bsw-insight"><CardHeader><CardTitle>🤖 AI Jacquard Design &amp; International Growth</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">The integration of artificial intelligence and computer-aided design into traditional Banarasi Jacquard loom ecosystems represents a revolutionary transformation expanding creative possibilities and opening new international market opportunities for Varanasi weavers. Modern AI-driven design software translates complex traditional Banarasi patterns into digital Jacquard card punch sequences in minutes rather than weeks, dramatically accelerating the design-to-production pipeline while maintaining authentic handwoven character of every finished textile. These advances enable producers to tap growing demand from luxury fashion houses in Europe, North America, and the Middle East, with export volumes increasing over forty percent in recent years. Government initiatives including the India Handloom Brand promotion and dedicated e-commerce platforms connecting weavers directly to global consumers are further accelerating this remarkable growth trajectory for Varanasi silk.</p></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
