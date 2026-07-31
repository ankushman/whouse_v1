import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#713f12', '#854d0e', '#a16207', '#ca8a04', '#eab308', '#422006', '#5c3303', '#fefce8']
const PRODUCTS = ['Madhubani Canvas Painting', 'Bihar Wall Mural Panel', 'Madhubani Silk Saree', 'Handmade Paper Art Frame', 'Kohbar Ghar Painting', 'Godna Tattoo Art Print', 'Sita Ram Kalamkari Scroll', 'Madhubani Home Decor Set']
const MANUFACTURERS = ['Madhubani Art Village BR', 'Ranti Village Cluster BR', 'Jitwarpur Artists BR', 'Rasidpur Mithila Art BR', 'Laukahi Painting Hub BR', 'Benipatti Folk Art BR', 'Jhanjharpur Rural BR', 'Darbhanga Mithila Paint']
const STATUSES = ['GI Madhubani Certified', 'NATCC Art Grade', 'Acid-Free Tissue Wrapped', 'Flat Pallet Transit', 'Climate Store 20-25C', 'Pigment Fastness QC']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="mfa-badge inline-block px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="mfa-status inline-block px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="mfa-costbar w-full bg-yellow-100 rounded h-2"><div className="bg-yellow-700 h-2 rounded" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ value, label, size = 64 }: { value: number; label: string; size?: number }) => {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (ri(0, 100, value) / 100) * circ
  return (
    <div className="mfa-health-ring flex flex-col items-center">
      <svg width={size} height={size}><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={4} /><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#713f12" strokeWidth={4} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`} /></svg>
      <span className="text-xs font-semibold" style={{ color: COLORS[0] }}>{value}%</span>
      <span className="text-[10px] text-gray-500">{label}</span>
    </div>
  )
}

const KpiTile = ({ label, value, icon }: { label: string; value: string; icon: string }) => (
  <Card className="mfa-kpi"><CardContent className="p-4"><div className="flex items-center gap-3"><span className="text-2xl">{icon}</span><div><p className="text-xs text-gray-500">{label}</p><p className="text-xl font-bold" style={{ color: COLORS[0] }}>{value}</p></div></div></CardContent></Card>
)

const ValueTile = ({ label, value }: { label: string; value: string }) => (
  <Card className="mfa-value"><CardContent className="p-4"><p className="text-xs text-gray-500">{label}</p><p className="text-lg font-semibold" style={{ color: COLORS[1] }}>{value}</p></CardContent></Card>
)

const genRecords = (startIdx: number) => Array.from({ length: 20 }, (_, i) => {
  const idx = startIdx + i
  const units = ['pieces', 'sets', 'scrolls', 'frames']
  return {
    id: `MFA-${String(idx).padStart(4, '0')}`, product: PRODUCTS[idx % 8], manufacturer: MANUFACTURERS[idx % 8],
    status: STATUSES[idx % 6], qty: ri(10, 300, 15 + idx * 8), unit: units[idx % 4],
    cost: ri(8000, 250000, 12000 + idx * 8500), date: `2025-07-${String(ri(1, 28, idx % 28 + 1)).padStart(2, '0')}`,
  }
})

const madhubaniRecords = [
  { id: 'MFA-0001', product: 'Madhubani Canvas Painting', manufacturer: 'Madhubani Art Village BR', status: 'GI Madhubani Certified', qty: 120, unit: 'pieces', cost: 180000, date: '2025-07-02' },
  { id: 'MFA-0002', product: 'Bihar Wall Mural Panel', manufacturer: 'Ranti Village Cluster BR', status: 'NATCC Art Grade', qty: 30, unit: 'sets', cost: 240000, date: '2025-07-04' },
  { id: 'MFA-0003', product: 'Madhubani Silk Saree', manufacturer: 'Jitwarpur Artists BR', status: 'Acid-Free Tissue Wrapped', qty: 80, unit: 'pieces', cost: 128000, date: '2025-07-05' },
  { id: 'MFA-0004', product: 'Handmade Paper Art Frame', manufacturer: 'Rasidpur Mithila Art BR', status: 'Flat Pallet Transit', qty: 200, unit: 'frames', cost: 60000, date: '2025-07-07' },
  { id: 'MFA-0005', product: 'Kohbar Ghar Painting', manufacturer: 'Laukahi Painting Hub BR', status: 'Climate Store 20-25C', qty: 40, unit: 'pieces', cost: 200000, date: '2025-07-08' },
  { id: 'MFA-0006', product: 'Godna Tattoo Art Print', manufacturer: 'Benipatti Folk Art BR', status: 'Pigment Fastness QC', qty: 150, unit: 'scrolls', cost: 45000, date: '2025-07-10' },
  { id: 'MFA-0007', product: 'Sita Ram Kalamkari Scroll', manufacturer: 'Jhanjharpur Rural BR', status: 'GI Madhubani Certified', qty: 60, unit: 'scrolls', cost: 78000, date: '2025-07-11' },
  { id: 'MFA-0008', product: 'Madhubani Home Decor Set', manufacturer: 'Darbhanga Mithila Paint', status: 'NATCC Art Grade', qty: 100, unit: 'sets', cost: 85000, date: '2025-07-13' },
  { id: 'MFA-0009', product: 'Madhubani Canvas Painting', manufacturer: 'Madhubani Art Village BR', status: 'Acid-Free Tissue Wrapped', qty: 115, unit: 'pieces', cost: 172500, date: '2025-07-14' },
  { id: 'MFA-0010', product: 'Bihar Wall Mural Panel', manufacturer: 'Ranti Village Cluster BR', status: 'Flat Pallet Transit', qty: 28, unit: 'sets', cost: 224000, date: '2025-07-15' },
  { id: 'MFA-0011', product: 'Madhubani Silk Saree', manufacturer: 'Jitwarpur Artists BR', status: 'Climate Store 20-25C', qty: 75, unit: 'pieces', cost: 120000, date: '2025-07-16' },
  { id: 'MFA-0012', product: 'Handmade Paper Art Frame', manufacturer: 'Rasidpur Mithila Art BR', status: 'Pigment Fastness QC', qty: 190, unit: 'frames', cost: 57000, date: '2025-07-17' },
  { id: 'MFA-0013', product: 'Kohbar Ghar Painting', manufacturer: 'Laukahi Painting Hub BR', status: 'GI Madhubani Certified', qty: 38, unit: 'pieces', cost: 190000, date: '2025-07-18' },
  { id: 'MFA-0014', product: 'Godna Tattoo Art Print', manufacturer: 'Benipatti Folk Art BR', status: 'NATCC Art Grade', qty: 140, unit: 'scrolls', cost: 42000, date: '2025-07-19' },
  { id: 'MFA-0015', product: 'Sita Ram Kalamkari Scroll', manufacturer: 'Jhanjharpur Rural BR', status: 'Acid-Free Tissue Wrapped', qty: 55, unit: 'scrolls', cost: 71500, date: '2025-07-20' },
  { id: 'MFA-0016', product: 'Madhubani Home Decor Set', manufacturer: 'Darbhanga Mithila Paint', status: 'Flat Pallet Transit', qty: 95, unit: 'sets', cost: 80750, date: '2025-07-21' },
  { id: 'MFA-0017', product: 'Madhubani Canvas Painting', manufacturer: 'Madhubani Art Village BR', status: 'Climate Store 20-25C', qty: 110, unit: 'pieces', cost: 165000, date: '2025-07-22' },
  { id: 'MFA-0018', product: 'Bihar Wall Mural Panel', manufacturer: 'Ranti Village Cluster BR', status: 'Pigment Fastness QC', qty: 26, unit: 'sets', cost: 208000, date: '2025-07-23' },
  { id: 'MFA-0019', product: 'Madhubani Silk Saree', manufacturer: 'Jitwarpur Artists BR', status: 'GI Madhubani Certified', qty: 70, unit: 'pieces', cost: 112000, date: '2025-07-24' },
  { id: 'MFA-0020', product: 'Handmade Paper Art Frame', manufacturer: 'Rasidpur Mithila Art BR', status: 'NATCC Art Grade', qty: 180, unit: 'frames', cost: 54000, date: '2025-07-25' },
]


export default function MadhubaniFolkArtSupplyChainView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = [...madhubaniRecords, ...genRecords(21), ...genRecords(41)]

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

  const trendData = PRODUCTS.slice(0, 6).map((p, i) => ({ name: p.split(' ').slice(0, 2).join(' '), shipments: 8 + i * 5, cost: 60000 + i * 25000 }))
  const mfgChart = MANUFACTURERS.slice(0, 6).map((m, i) => ({ name: m.split(' ').slice(0, 2).join(' '), volume: 50 + i * 40, revenue: 5 + i * 4 }))
  const statusPie = STATUSES.map((s, i) => ({ name: s.split(' ').slice(0, 2).join(' '), value: 7 + i * 3 }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="mfa-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Madhubani Folk Art' }]} />
      <PageHeader title="Madhubani Folk Art Supply Chain" description="Track GI-certified Madhubani paintings, folk art canvases, Kohbar Ghar murals, and Mithila art products from Bihar's heritage artisan villages to galleries, museums, and global art collectors" />
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-yellow-50">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <KpiTile icon="🎨" label="Total Shipments" value={String(allRecords.length)} />
            <KpiTile icon="🏘️" label="Artisan Villages" value={String(MANUFACTURERS.length)} />
            <KpiTile icon="💰" label="Total Value" value={`₹${(allRecords.reduce((a, r) => a + r.cost, 0) / 100000).toFixed(1)}L`} />
            <KpiTile icon="📈" label="Avg Cost" value={`₹${Math.round(allRecords.reduce((a, r) => a + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>

          <Card className="mfa-health-grid">
            <CardHeader><CardTitle>Operational Health</CardTitle></CardHeader>
            <CardContent>
              <div className="flex justify-around">
                <HealthRing value={86} label="GI Cert" />
                <HealthRing value={80} label="NATCC" />
                <HealthRing value={89} label="Tissue" />
                <HealthRing value={75} label="Flat Ship" />
                <HealthRing value={92} label="Climate" />
                <HealthRing value={84} label="Pigment" />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Madhubani Village" value="420 Artists" />
            <ValueTile label="Gallery Ready" value="15 Exhibitions" />
            <ValueTile label="Museum Grade" value="38 Pieces" />
            <ValueTile label="Export Dest" value="22 Countries" />
          </div>
        </TabsContent>

        <TabsContent value="shipments" className="space-y-4">
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={(key, value) => setActiveFilters(p => ({ ...p, [key]: p[key]?.includes(value) ? p[key].filter((v: string) => v !== value) : [...(p[key] || []), value] }))} onClearAllFilters={() => setActiveFilters({})} totalItems={allRecords.length} filteredCount={filteredRecords.length} onRefresh={() => {}} placeholder="Search by ID, product, village, or lot..." />

          <Card className="mfa-table-card">
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-yellow-50">
                    <th className="p-3 text-left">ID</th>
                    <th className="p-3 text-left">Product</th>
                    <th className="p-3 text-left">Village</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-right">Qty</th>
                    <th className="p-3 text-right">Cost</th>
                    <th className="p-3 text-left">Cost Bar</th>
                    <th className="p-3 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.slice(0, 15).map(r => (
                    <tr key={r.id} className="border-b hover:bg-yellow-50/50">
                      <td className="p-3 font-mono text-xs">{r.id}</td>
                      <td className="p-3"><ProductBadge name={r.product} /></td>
                      <td className="p-3 text-xs">{r.manufacturer}</td>
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
              <CardHeader><CardTitle>Village Volume</CardTitle></CardHeader>
              <CardContent>
                <BarChart width={500} height={250} data={mfgChart}>
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
            <Card className="mfa-insight"><CardHeader><CardTitle>Madhubani Painting — 3,000-Year-Old Heritage</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Madhubani painting originated in the Mithila region of Bihar over 3,000 years ago, first documented in the Ramayana when King Janak commissioned paintings for Sita's wedding. The art form uses five distinct styles — Bharni (filling), Katchni (hatching), Tantrik (mystical), Godna (tattoo), and Kohbar (bridal chamber) — with natural pigments from turmeric, indigo, rice paste, and soot. GI-tagged Madhubani Painting was registered in 2007 under the Geographical Indications Act. The craft supports 3,000+ women artisans across Madhubani, Darbhanga, and Sitamarhi districts, generating annual revenue of ₹450 crore with exports to 22 countries.</p></CardContent></Card>
            <Card className="mfa-insight"><CardHeader><CardTitle>Village Artisan Clusters & Cooperative Model</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Madhubani district has 12 key artisan villages — Ranti (300 artists), Jitwarpur (250 artists), Rasidpur (180 artists), Laukahi (150 artists), Benipatti (120 artists), and Jhanjharpur (100 artists) — forming a cooperative production network. Master artist Sita Devi (awarded Padma Shri 1981) and Baua Devi (National Award 1984) elevated Madhubani from wall murals to canvas art for global galleries. The National Mission on Cultural Heritage of India provides ₹50 lakh annually for Madhubani art preservation, including artisan training, material procurement, and exhibition logistics for museums in New Delhi, London, and New York.</p></CardContent></Card>
            <Card className="mfa-insight"><CardHeader><CardTitle>NATCC Certification & Art Preservation</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">NATCC (National Accreditation and Testing Committee for Cultural Commodities) certifies Madhubani art authenticity based on pigment composition, brush stroke patterns, and traditional motif accuracy. Acid-free tissue wrapping with pH-neutral interleaving paper prevents canvas degradation during transit and storage. Climate-controlled storage at 20-25°C with 45-55% relative humidity prevents paint cracking and fungal growth on handmade paper. Pigment fastness testing per IS 2645 ensures natural dyes resist UV fading above 6 on the ISO Blue Wool Scale. Museum-grade Madhubani art requires crating with custom-cut archival foam for insurance values exceeding ₹5 lakh per piece.</p></CardContent></Card>
            <Card className="mfa-insight"><CardHeader><CardTitle>AI Art Authentication & Digital Heritage</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">AI-powered style classification authenticates Madhubani paintings with 94% accuracy by analyzing brush stroke density, colour palette patterns, and motif geometry against the authenticated GI database. Blockchain provenance tracks each artwork from village creation to gallery sale, preventing forgery in the ₹250 crore art market. Digital Madhubani archives under the Ministry of Culture's National Digital Repository preserve 50,000+ artwork images with high-resolution multispectral imaging. AI demand forecasting for festival season (Diwali, Chhath Puja) art sales achieves 76% accuracy. Smart packaging with NFC tags enables collectors to verify provenance via smartphone scan.</p></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
