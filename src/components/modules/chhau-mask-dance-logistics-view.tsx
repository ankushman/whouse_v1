import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#7c2d12', '#9a3412', '#c2410c', '#ea580c', '#fdba74', '#7c2a1a', '#451a03', '#fff7ed']
const PRODUCTS = ['Chhau Shiva Tandava Mask', 'Mahishasura Mardini Mask', 'Parvati Dance Mask', 'Hanuman Veer Mask', 'Nataraja Chhau Mask', 'Durga Lion Rider Mask', 'Kartikeya War Mask', 'Ravana Ten-Head Mask']
const TROUPES = ['Seraikella Chhau Troupe', 'Purulia Chhau Group', 'Mayurbhanj Chhau Ensemble', 'Baripada Mask Artisans', 'Rairangpur Dance Guild', 'Jhargram Chhau Academy', 'Midnapore Folk Art Unit', 'Bankura Mask Workshop']
const STATUSES = ['GI Chhau Dance Mark', 'IS 11790 Craft Grade A', 'Foam-Lined Mask Box', 'Shock-Proof Van Transit', 'Dry Storage 22-28C', 'Paint Finish QC']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="cmd-badge inline-block px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="cmd-status inline-block px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="cmd-costbar w-full bg-orange-100 rounded h-2"><div className="bg-orange-700 h-2 rounded" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ value, label, size = 64 }: { value: number; label: string; size?: number }) => {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (ri(0, 100, value) / 100) * circ
  return (
    <div className="cmd-health-ring flex flex-col items-center">
      <svg width={size} height={size}><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={4} /><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#7c2d12" strokeWidth={4} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`} /></svg>
      <span className="text-xs font-semibold" style={{ color: COLORS[0] }}>{value}%</span>
      <span className="text-[10px] text-gray-500">{label}</span>
    </div>
  )
}

const KpiTile = ({ label, value, icon }: { label: string; value: string; icon: string }) => (
  <Card className="cmd-kpi"><CardContent className="p-4"><div className="flex items-center gap-3"><span className="text-2xl">{icon}</span><div><p className="text-xs text-gray-500">{label}</p><p className="text-xl font-bold" style={{ color: COLORS[0] }}>{value}</p></div></div></CardContent></Card>
)

const ValueTile = ({ label, value }: { label: string; value: string }) => (
  <Card className="cmd-value"><CardContent className="p-4"><p className="text-xs text-gray-500">{label}</p><p className="text-lg font-semibold" style={{ color: COLORS[1] }}>{value}</p></CardContent></Card>
)

const genRecords = (startIdx: number) => Array.from({ length: 20 }, (_, i) => {
  const idx = startIdx + i
  const units = ['pcs', 'sets', 'pairs', 'units']
  return {
    id: `CMD-${String(idx).padStart(4, '0')}`, product: PRODUCTS[idx % 8], troupe: TROUPES[idx % 8],
    status: STATUSES[idx % 6], qty: ri(3, 50, 5 + idx * 2), unit: units[idx % 4],
    cost: ri(8000, 250000, 12000 + idx * 12000), date: `2025-07-${String(ri(1, 28, idx % 28 + 1)).padStart(2, '0')}`,
  }
})

const chhauRecords = [
  { id: 'CMD-0001', product: 'Chhau Shiva Tandava Mask', troupe: 'Seraikella Chhau Troupe', status: 'GI Chhau Dance Mark', qty: 5, unit: 'pcs', cost: 35000, date: '2025-07-02' },
  { id: 'CMD-0002', product: 'Mahishasura Mardini Mask', troupe: 'Purulia Chhau Group', status: 'IS 11790 Craft Grade A', qty: 18, unit: 'sets', cost: 72000, date: '2025-07-04' },
  { id: 'CMD-0003', product: 'Parvati Dance Mask', troupe: 'Mayurbhanj Chhau Ensemble', status: 'Foam-Lined Mask Box', qty: 12, unit: 'pcs', cost: 48000, date: '2025-07-05' },
  { id: 'CMD-0004', product: 'Hanuman Veer Mask', troupe: 'Baripada Mask Artisans', status: 'Shock-Proof Van Transit', qty: 25, unit: 'pairs', cost: 125000, date: '2025-07-07' },
  { id: 'CMD-0005', product: 'Nataraja Chhau Mask', troupe: 'Rairangpur Dance Guild', status: 'Dry Storage 22-28C', qty: 3, unit: 'pcs', cost: 180000, date: '2025-07-08' },
  { id: 'CMD-0006', product: 'Durga Lion Rider Mask', troupe: 'Jhargram Chhau Academy', status: 'Paint Finish QC', qty: 15, unit: 'units', cost: 65000, date: '2025-07-10' },
  { id: 'CMD-0007', product: 'Kartikeya War Mask', troupe: 'Midnapore Folk Art Unit', status: 'GI Chhau Dance Mark', qty: 8, unit: 'sets', cost: 95000, date: '2025-07-11' },
  { id: 'CMD-0008', product: 'Ravana Ten-Head Mask', troupe: 'Bankura Mask Workshop', status: 'IS 11790 Craft Grade A', qty: 4, unit: 'pcs', cost: 210000, date: '2025-07-13' },
  { id: 'CMD-0009', product: 'Chhau Shiva Tandava Mask', troupe: 'Seraikella Chhau Troupe', status: 'Foam-Lined Mask Box', qty: 20, unit: 'pcs', cost: 28000, date: '2025-07-14' },
  { id: 'CMD-0010', product: 'Mahishasura Mardini Mask', troupe: 'Purulia Chhau Group', status: 'Shock-Proof Van Transit', qty: 30, unit: 'sets', cost: 88000, date: '2025-07-15' },
  { id: 'CMD-0011', product: 'Parviti Dance Mask', troupe: 'Mayurbhanj Chhau Ensemble', status: 'Dry Storage 22-28C', qty: 10, unit: 'pcs', cost: 55000, date: '2025-07-16' },
  { id: 'CMD-0012', product: 'Hanuman Veer Mask', troupe: 'Baripada Mask Artisans', status: 'Paint Finish QC', qty: 35, unit: 'pairs', cost: 145000, date: '2025-07-17' },
  { id: 'CMD-0013', product: 'Nataraja Chhau Mask', troupe: 'Rairangpur Dance Guild', status: 'GI Chhau Dance Mark', qty: 6, unit: 'pcs', cost: 195000, date: '2025-07-18' },
  { id: 'CMD-0014', product: 'Durga Lion Rider Mask', troupe: 'Jhargram Chhau Academy', status: 'IS 11790 Craft Grade A', qty: 22, unit: 'units', cost: 78000, date: '2025-07-19' },
  { id: 'CMD-0015', product: 'Kartikeya War Mask', troupe: 'Midnapore Folk Art Unit', status: 'Foam-Lined Mask Box', qty: 7, unit: 'sets', cost: 88000, date: '2025-07-20' },
  { id: 'CMD-0016', product: 'Ravana Ten-Head Mask', troupe: 'Bankura Mask Workshop', status: 'Shock-Proof Van Transit', qty: 4, unit: 'pcs', cost: 240000, date: '2025-07-21' },
  { id: 'CMD-0017', product: 'Chhau Shiva Tandava Mask', troupe: 'Seraikella Chhau Troupe', status: 'Dry Storage 22-28C', qty: 14, unit: 'pcs', cost: 42000, date: '2025-07-22' },
  { id: 'CMD-0018', product: 'Mahishasura Mardini Mask', troupe: 'Purulia Chhau Group', status: 'Paint Finish QC', qty: 28, unit: 'sets', cost: 96000, date: '2025-07-23' },
  { id: 'CMD-0019', product: 'Parvati Dance Mask', troupe: 'Mayurbhanj Chhau Ensemble', status: 'GI Chhau Dance Mark', qty: 16, unit: 'pcs', cost: 62000, date: '2025-07-24' },
  { id: 'CMD-0020', product: 'Hanuman Veer Mask', troupe: 'Baripada Mask Artisans', status: 'IS 11790 Craft Grade A', qty: 40, unit: 'pairs', cost: 168000, date: '2025-07-25' },
]

export default function ChhauMaskDanceLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = [...chhauRecords, ...genRecords(21), ...genRecords(41)]

  const filteredRecords = useMemo(() => {
    return allRecords.filter(r => {
      if (searchQuery && !r.id.toLowerCase().includes(searchQuery.toLowerCase()) && !r.product.toLowerCase().includes(searchQuery.toLowerCase())) return false
      return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string))
    })
  }, [searchQuery, activeFilters, allRecords])

  const filterGroups = [
    { key: 'product', label: 'Product', options: PRODUCTS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.product === p).length })) },
    { key: 'troupe', label: 'Troupe', options: TROUPES.map(t => ({ value: t, label: t, count: allRecords.filter(r => r.troupe === t).length })) },
  ]

  const trendData = PRODUCTS.slice(0, 6).map((p, i) => ({ name: p.split(' ').slice(0, 2).join(' '), shipments: 4 + i * 3, cost: 80000 + i * 65000 }))
  const troupeChart = TROUPES.slice(0, 6).map((t, i) => ({ name: t.split(' ').slice(0, 2).join(' '), volume: 15 + i * 8, revenue: 10 + i * 5 }))
  const statusPie = STATUSES.map((s, i) => ({ name: s.split(' ').slice(0, 2).join(' '), value: 5 + i * 4 }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="cmd-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Chhau Mask Dance' }]} />
      <PageHeader title="Chhau Mask Dance Logistics" description="Track India's UNESCO-recognised Chhau mask dance tradition from Odisha, Jharkhand, and West Bengal through papier-mâché mask crafting, GI-tagged quality certification, foam-lined fragile packaging, and shock-proof transit for cultural exhibitions and heritage craft export markets" />
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-orange-50">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <KpiTile icon="🎭" label="Total Masks" value={String(allRecords.length)} />
            <KpiTile icon="🎪" label="Troupes" value={String(TROUPES.length)} />
            <KpiTile icon="💰" label="Total Value" value={`₹${(allRecords.reduce((a, r) => a + r.cost, 0) / 10000000).toFixed(2)}Cr`} />
            <KpiTile icon="📈" label="Avg Mask" value={`₹${Math.round(allRecords.reduce((a, r) => a + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>

          <Card className="cmd-health-grid">
            <CardHeader><CardTitle>Quality Compliance</CardTitle></CardHeader>
            <CardContent>
              <div className="flex justify-around">
                <HealthRing value={96} label="GI Tag" />
                <HealthRing value={92} label="IS 11790" />
                <HealthRing value={88} label="Foam Box" />
                <HealthRing value={81} label="Shock Van" />
                <HealthRing value={90} label="Dry Store" />
                <HealthRing value={94} label="Paint QC" />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Artisan Troupes" value="250+" />
            <ValueTile label="Annual Masks" value="12,000 pcs" />
            <ValueTile label="Export Markets" value="28 Countries" />
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
            placeholder="Search by ID, product, or troupe..."
          />

          <Card className="cmd-table-card">
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-orange-50">
                    <th className="p-3 text-left">ID</th>
                    <th className="p-3 text-left">Product</th>
                    <th className="p-3 text-left">Troupe</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-right">Qty</th>
                    <th className="p-3 text-right">Cost</th>
                    <th className="p-3 text-left">Cost Bar</th>
                    <th className="p-3 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.slice(0, 15).map(r => (
                    <tr key={r.id} className="border-b hover:bg-orange-50/50">
                      <td className="p-3 font-mono text-xs">{r.id}</td>
                      <td className="p-3"><ProductBadge name={r.product} /></td>
                      <td className="p-3 text-xs">{r.troupe}</td>
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
              <CardHeader><CardTitle>Troupe Volume</CardTitle></CardHeader>
              <CardContent>
                <BarChart width={500} height={250} data={troupeChart}>
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
            <Card className="cmd-insight"><CardHeader><CardTitle>Chhau — India's UNESCO Martial Dance Heritage Since 2010</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Chhau is a semi-classical Indian dance with martial origins performed across three distinct traditions: Seraikella Chhau (Jharkhand, graceful and masked), Purulia Chhau (West Bengal, vigorous and acrobatic with large elaborate masks), and Mayurbhanj Chhau (Odisha, unarmed martial movement without masks). Recognised by UNESCO as Intangible Cultural Heritage in 2010, Chhau narrates episodes from Ramayana, Mahabharata, and local folk legends through elaborate masked performances during Chaitra Parva (spring festival). The tradition spans 250+ troupes across eastern India with an estimated 12,000 practitioners. Masks are crafted from layered papier-mâché over clay moulds using tribal techniques passed through generations for 300+ years, painted with mineral pigments and decorated with peacock feathers, shells, and metallic ornaments. The dance combines martial arts (chhau means "shadow" or "mask" in Sanskrit) with gymnastic movements requiring years of training under guru-shishya parampara tradition.</p></CardContent></Card>
            <Card className="cmd-insight"><CardHeader><CardTitle>IS 11790 Craft Mask &amp; Papier-Mâché Standards</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">BIS IS 11790 covers traditional craft mask quality including papier-mâché composition (minimum 8 layers of cotton rag paper on clay mould, tensile strength above 12 kg/cm2), paint toxicity limits (lead below 90 ppm, cadmium below 75 ppm, mercury below 25 ppm per IS 16474 eco-toy standard adopted for craft masks), and structural integrity testing (minimum 50 kg vertical load bearing for display-grade masks). Mineral pigment preparation requires natural oxide base: red from laterite soil (Fe2O3 minimum 65%), yellow from turmeric-curcumin compound, and black from lamp soot carbon base. Mask weight ranges from 0.8 kg (face masks) to 8 kg (full-head Ravana ten-head masks). Moisture content must be below 12% to prevent fungal growth during storage. Paint coating requires minimum 3 layers of water-resistant lacquer for export-grade certification. Surface finish Grade A mandates zero visible bubbles, uniform pigment distribution, and secure ornament attachment tested at 15g vibration per IS 11790 Annexure B protocol.</p></CardContent></Card>
            <Card className="cmd-insight"><CardHeader><CardTitle>Fragile Papier-Mâché Mask Packaging &amp; Transit</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Chhau masks are extremely fragile papier-mâché artworks susceptible to moisture, impact, and temperature fluctuations. Each mask is individually wrapped in acid-free tissue paper (pH 7.0-7.5, lignin-free) then placed in custom-moulded polyethylene foam inserts (density 25-30 kg/m3) within corrugated cardboard boxes (5-ply, 350 GSM). Masks are separated by foam dividers preventing contact during 24-48 hour transit from Seraikella/Purulia to Kolkata (260 km via NH16 and SH2). Temperature must maintain 22-28 degrees Celsius with humidity below 55% to prevent papier-mâché warping and paint blistering. Heavy masks (above 3 kg) travel in wooden crates with internal spring suspension for shock absorption up to 15g impact force. Since the ICCR Handicrafts Packaging Initiative 2018, damage rates declined from 22% to 4% across 1,200 mask shipments covering Seraikella, Purulia, Baripada, and Jhargram artisan clusters. Air freight for international exhibitions uses IATA Category B fragile cargo protocols with temperature-controlled hold at 18-22 degrees Celsius.</p></CardContent></Card>
            <Card className="cmd-insight"><CardHeader><CardTitle>AI Mask Design Digitisation &amp; Heritage Preservation</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">AI-powered 3D scanning of heritage Chhau masks creates digital archives preserving fading motifs from Seraikella, Purulia, and Mayurbhanj traditions in under 4 hours versus 15 days for manual documentation, while machine learning classifies mask styles across the three Chhau forms at 96% accuracy by analysing ornament patterns, paint techniques, and structural features unique to each tradition. Automated pigment analysis from spectrophotometer readings authenticates masks versus machine-made replicas with 89% precision by detecting natural mineral pigment signatures absent in synthetic alternatives. India's Chhau mask craft export grew 180% from Rs 28 crore (2018) to Rs 78 crore (2025), targeting Rs 150 crore by 2028 with growing international demand from cultural museums (British Museum, Smithsonian, Musee du Quai Branly) and theatre companies in 28 countries. Blockchain provenance tracking from clay mould preparation through painting, packaging, and shipping combats replica fraud estimated at Rs 15 crore annually, while AR-enabled virtual exhibitions let global audiences experience Chhau mask artistry through UNESCO heritage platforms.</p></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
