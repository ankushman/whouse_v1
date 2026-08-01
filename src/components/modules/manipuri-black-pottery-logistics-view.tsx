import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#292524', '#44403c', '#57534e', '#78716c', '#e7e5e4', '#1c1917', '#0c0a09', '#fafaf9']
const PRODUCTS = ['Manipuri Black Rice Bowl', 'Chirona-Polished Vase', 'Tangkhul Naga Storage Jar', 'Bee Wax Coated Water Pot', 'Manipuri Black Incense Burner', 'Andro Clay Cooking Pot', 'Traditional Black Tea Set', 'Ceremonial Offerings Pot Set']
const POTTERS = ['Andro Village Potter Women', 'Nungbi Heritage Clay Guild', 'Ukhrul Black Pottery Centre', 'Imphal Traditional Potters', 'Thoubal Clay Artisan Colony', 'Bishnupur Earthenware Studio', 'Churachandpur Tribal Potters', 'Senapati Naga Ceramic Society']
const STATUSES = ['GI Manipuri Pottery Mark', 'IS 16801 Black Earthenware Grade A', 'Straw-Padded Clay Box', 'Enclosed Truck Transit', 'Dry Storage 20-30C', 'Bee Wax Finish QC']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="mbp-badge inline-block px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="mbp-status inline-block px-2 py-0.5 rounded text-xs font-medium bg-stone-100 text-stone-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="mbp-costbar w-full bg-stone-200 rounded h-2"><div className="bg-stone-700 h-2 rounded" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ value, label, size = 64 }: { value: number; label: string; size?: number }) => {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (ri(0, 100, value) / 100) * circ
  return (
    <div className="mbp-health-ring flex flex-col items-center">
      <svg width={size} height={size}><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={4} /><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#292524" strokeWidth={4} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`} /></svg>
      <span className="text-xs font-semibold" style={{ color: COLORS[0] }}>{value}%</span>
      <span className="text-[10px] text-gray-500">{label}</span>
    </div>
  )
}

const KpiTile = ({ label, value, icon }: { label: string; value: string; icon: string }) => (
  <Card className="mbp-kpi"><CardContent className="p-4"><div className="flex items-center gap-3"><span className="text-2xl">{icon}</span><div><p className="text-xs text-gray-500">{label}</p><p className="text-xl font-bold" style={{ color: COLORS[0] }}>{value}</p></div></div></CardContent></Card>
)

const ValueTile = ({ label, value }: { label: string; value: string }) => (
  <Card className="mbp-value"><CardContent className="p-4"><p className="text-xs text-gray-500">{label}</p><p className="text-lg font-semibold" style={{ color: COLORS[1] }}>{value}</p></CardContent></Card>
)

const genRecords = (startIdx: number) => Array.from({ length: 20 }, (_, i) => {
  const idx = startIdx + i
  const units = ['pcs', 'sets', 'pairs', 'units']
  return {
    id: `MBP-${String(idx).padStart(4, '0')}`, ware: PRODUCTS[idx % 8], potter: POTTERS[idx % 8],
    status: STATUSES[idx % 6], qty: ri(5, 60, 8 + idx * 3), unit: units[idx % 4],
    cost: ri(1500, 65000, 2000 + idx * 3000), date: `2025-07-${String(ri(1, 28, idx % 28 + 1)).padStart(2, '0')}`,
  }
})

const potteryRecords = [
  { id: 'MBP-0001', ware: 'Manipuri Black Rice Bowl', potter: 'Andro Village Potter Women', status: 'GI Manipuri Pottery Mark', qty: 24, unit: 'pcs', cost: 4800, date: '2025-07-01' },
  { id: 'MBP-0002', ware: 'Chirona-Polished Vase', potter: 'Nungbi Heritage Clay Guild', status: 'IS 16801 Black Earthenware Grade A', qty: 12, unit: 'sets', cost: 18500, date: '2025-07-03' },
  { id: 'MBP-0003', ware: 'Tangkhul Naga Storage Jar', potter: 'Ukhrul Black Pottery Centre', status: 'Straw-Padded Clay Box', qty: 18, unit: 'pcs', cost: 12000, date: '2025-07-04' },
  { id: 'MBP-0004', ware: 'Bee Wax Coated Water Pot', potter: 'Imphal Traditional Potters', status: 'Enclosed Truck Transit', qty: 30, unit: 'units', cost: 8500, date: '2025-07-06' },
  { id: 'MBP-0005', ware: 'Manipuri Black Incense Burner', potter: 'Thoubal Clay Artisan Colony', status: 'Dry Storage 20-30C', qty: 15, unit: 'pcs', cost: 22000, date: '2025-07-07' },
  { id: 'MBP-0006', ware: 'Andro Clay Cooking Pot', potter: 'Bishnupur Earthenware Studio', status: 'Bee Wax Finish QC', qty: 36, unit: 'sets', cost: 6500, date: '2025-07-09' },
  { id: 'MBP-0007', ware: 'Traditional Black Tea Set', potter: 'Churachandpur Tribal Potters', status: 'GI Manipuri Pottery Mark', qty: 10, unit: 'sets', cost: 32000, date: '2025-07-10' },
  { id: 'MBP-0008', ware: 'Ceremonial Offerings Pot Set', potter: 'Senapati Naga Ceramic Society', status: 'IS 16801 Black Earthenware Grade A', qty: 8, unit: 'pcs', cost: 45000, date: '2025-07-12' },
  { id: 'MBP-0009', ware: 'Manipuri Black Rice Bowl', potter: 'Andro Village Potter Women', status: 'Straw-Padded Clay Box', qty: 42, unit: 'units', cost: 3800, date: '2025-07-13' },
  { id: 'MBP-0010', ware: 'Chirona-Polished Vase', potter: 'Nungbi Heritage Clay Guild', status: 'Enclosed Truck Transit', qty: 14, unit: 'sets', cost: 21000, date: '2025-07-14' },
  { id: 'MBP-0011', ware: 'Tangkhul Naga Storage Jar', potter: 'Ukhrul Black Pottery Centre', status: 'Dry Storage 20-30C', qty: 20, unit: 'pcs', cost: 14000, date: '2025-07-15' },
  { id: 'MBP-0012', ware: 'Bee Wax Coated Water Pot', potter: 'Imphal Traditional Potters', status: 'Bee Wax Finish QC', qty: 48, unit: 'units', cost: 7200, date: '2025-07-16' },
  { id: 'MBP-0013', ware: 'Manipuri Black Incense Burner', potter: 'Thoubal Clay Artisan Colony', status: 'GI Manipuri Pottery Mark', qty: 22, unit: 'pcs', cost: 28000, date: '2025-07-17' },
  { id: 'MBP-0014', ware: 'Andro Clay Cooking Pot', potter: 'Bishnupur Earthenware Studio', status: 'IS 16801 Black Earthenware Grade A', qty: 55, unit: 'sets', cost: 5200, date: '2025-07-18' },
  { id: 'MBP-0015', ware: 'Traditional Black Tea Set', potter: 'Churachandpur Tribal Potters', status: 'Straw-Padded Clay Box', qty: 16, unit: 'sets', cost: 35000, date: '2025-07-19' },
  { id: 'MBP-0016', ware: 'Ceremonial Offerings Pot Set', potter: 'Senapati Naga Ceramic Society', status: 'Enclosed Truck Transit', qty: 6, unit: 'pcs', cost: 58000, date: '2025-07-20' },
  { id: 'MBP-0017', ware: 'Manipuri Black Rice Bowl', potter: 'Andro Village Potter Women', status: 'Dry Storage 20-30C', qty: 60, unit: 'units', cost: 3200, date: '2025-07-21' },
  { id: 'MBP-0018', ware: 'Chirona-Polished Vase', potter: 'Nungbi Heritage Clay Guild', status: 'Bee Wax Finish QC', qty: 11, unit: 'sets', cost: 25000, date: '2025-07-22' },
  { id: 'MBP-0019', ware: 'Tangkhul Naga Storage Jar', potter: 'Ukhrul Black Pottery Centre', status: 'GI Manipuri Pottery Mark', qty: 25, unit: 'pcs', cost: 16000, date: '2025-07-23' },
  { id: 'MBP-0020', ware: 'Bee Wax Coated Water Pot', potter: 'Imphal Traditional Potters', status: 'IS 16801 Black Earthenware Grade A', qty: 40, unit: 'units', cost: 9800, date: '2025-07-24' },
]

export default function ManipuriBlackPotteryLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = [...potteryRecords, ...genRecords(21), ...genRecords(41)]

  const filteredRecords = useMemo(() => {
    return allRecords.filter(r => {
      if (searchQuery && !r.id.toLowerCase().includes(searchQuery.toLowerCase()) && !r.ware.toLowerCase().includes(searchQuery.toLowerCase())) return false
      return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string))
    })
  }, [searchQuery, activeFilters, allRecords])

  const filterGroups = [
    { key: 'ware', label: 'Ware', options: PRODUCTS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.ware === p).length })) },
    { key: 'potter', label: 'Potter', options: POTTERS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.potter === p).length })) },
  ]

  const trendData = PRODUCTS.slice(0, 6).map((p, i) => ({ name: p.split(' ').slice(0, 2).join(' '), shipments: 5 + i * 4, cost: 4000 + i * 8000 }))
  const potterChart = POTTERS.slice(0, 6).map((p, i) => ({ name: p.split(' ').slice(0, 2).join(' '), volume: 18 + i * 10, revenue: 6 + i * 4 }))
  const statusPie = STATUSES.map((s, i) => ({ name: s.split(' ').slice(0, 2).join(' '), value: 6 + i * 3 }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="mbp-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Manipuri Black Pottery' }]} />
      <PageHeader title="Manipuri Black Pottery Logistics" description="Track Manipur's 800-year Tangkhul Naga black pottery tradition from Andro, Nungbi, and Ukhrul village potter communities through hand-coiled Leimarel clay preparation, low-temperature firing without potter's wheel, chirona leaf and bee wax glossy black finish polishing, GI-tagged black earthenware certification, straw-padded clay packaging, and dry surface transit for heritage tribal ceramic art export to international collector and museum markets" />
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-stone-100">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <KpiTile icon="🏺" label="Total Black Pottery" value={String(allRecords.length)} />
            <KpiTile icon="🏘️" label="Potter Villages" value={String(POTTERS.length)} />
            <KpiTile icon="💰" label="Total Value" value={`₹${(allRecords.reduce((a, r) => a + r.cost, 0) / 100000).toFixed(2)}L`}/>
            <KpiTile icon="📈" label="Avg Ware" value={`₹${Math.round(allRecords.reduce((a, r) => a + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>

          <Card className="mbp-health-grid">
            <CardHeader><CardTitle>Quality Compliance</CardTitle></CardHeader>
            <CardContent>
              <div className="flex justify-around">
                <HealthRing value={94} label="GI Tag" />
                <HealthRing value={90} label="IS 16801" />
                <HealthRing value={86} label="Clay" />
                <HealthRing value={79} label="Truck" />
                <HealthRing value={88} label="Storage" />
                <HealthRing value={92} label="Wax" />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Pottery Villages" value="12 Communities" />
            <ValueTile label="Annual Production" value="3,200 Pieces" />
            <ValueTile label="Export Markets" value="10 Countries" />
            <ValueTile label="Heritage Age" value="800 Years" />
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
            placeholder="Search by ID, ware, or potter..."
          />

          <Card className="mbp-table-card">
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-stone-100">
                    <th className="p-3 text-left">ID</th>
                    <th className="p-3 text-left">Ware</th>
                    <th className="p-3 text-left">Potter</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-right">Qty</th>
                    <th className="p-3 text-right">Cost</th>
                    <th className="p-3 text-left">Cost Bar</th>
                    <th className="p-3 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.slice(0, 15).map(r => (
                    <tr key={r.id} className="border-b hover:bg-stone-50/50">
                      <td className="p-3 font-mono text-xs">{r.id}</td>
                      <td className="p-3"><ProductBadge name={r.ware} /></td>
                      <td className="p-3 text-xs">{r.potter}</td>
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
              <CardHeader><CardTitle>Potter Volume</CardTitle></CardHeader>
              <CardContent>
                <BarChart width={500} height={250} data={potterChart}>
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
            <Card className="mbp-insight"><CardHeader><CardTitle>Andro Tangkhul Black Pottery — 800 Years of Manipuri Earthenware Tradition</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Manipuri black pottery is an 800-year-old earthenware tradition originating from Andro village in Imphal East district, Manipur, crafted exclusively by Tangkhul Naga women artisans using hand-coiled techniques without a potter's wheel. The unique glossy black finish is achieved through a distinctive polishing process where each fired piece is rubbed with bee wax collected from local Apis cerana honeybee colonies and leaves of the chirona plant (Alpinia nigra) while still warm from the kiln, creating a water-resistant lustrous surface that distinguishes Manipuri pottery from all other Indian ceramic traditions. The clay sourced from Leimarel hill near Andro contains 60% kaolin, 25% quartz sand, and 15% iron oxide, providing natural dark coloration during low-temperature firing at 700-900 degrees Celsius in open-pit kilns fueled by rice husk and bamboo. Traditional forms include rice bowls, storage jars, water pots, cooking vessels, incense burners, and ceremonial offering sets used in Manipuri Meitei and Naga religious rituals. Each piece requires 3-7 days from clay preparation through coiling, drying, firing, and wax polishing, with approximately 200 active women potters across 12 villages preserving this tradition today.</p></CardContent></Card>
            <Card className="mbp-insight"><CardHeader><CardTitle>IS 16801 Black Earthenware Quality Standards for Manipuri Pottery</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">IS 16801 establishes quality benchmarks for traditional Manipuri black earthenware covering clay composition, low-temperature firing parameters, bee wax coating specifications, and finished ceramic grading. Base clay must conform to Leimarel composition standard: kaolin content 55-65%, quartz sand 20-30%, iron oxide 10-20%, with moisture content below 8% before shaping and pH 6.5-7.5 after slaking. Low-temperature firing between 700-900 degrees Celsius must be achieved gradually over 4-6 hours to prevent thermal shock cracking, with temperature ramp rate not exceeding 150 degrees Celsius per hour. Bee wax coating applied post-firing must achieve minimum thickness of 0.1mm and maximum 0.3mm measured by digital micrometer at five points per vessel, with wax purity certified at 85% minimum beeswax content by gas chromatography. Water absorption rate tested by 24-hour immersion per IS 16801 Annexure B must not exceed 12% by weight for Grade A certification. Chip resistance measured by 1kg steel ball drop from 30cm height must show zero visible fracture on the wax-sealed surface. Heavy metal leaching tests for lead, cadmium, and arsenic must comply with Food Safety and Standards Authority of India (FSSAI) limits for cooking and food-contact vessels.</p></CardContent></Card>
            <Card className="mbp-insight"><CardHeader><CardTitle>Straw-Padded Protective Packaging and Dry Surface Transit for Earthenware</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Manipuri black pottery requires specialised straw-padded protective packaging to prevent chipping, bee wax surface abrasion, and thermal shock cracking during 800-1,500 km surface transit from Andro and Nungbi village workshops through Imphal to Dimapur corridor and onward to Kolkata or Delhi distribution hubs. Each pottery piece is individually wrapped in rice straw (Oryza sativa) sheaves tied with jute twine, providing 8-12mm cushioning that absorbs vibration shock during truck transport on Manipur's hill roads. Partitioned corrugated cardboard boxes (5-ply, B-flute 3mm) with foam insert trays separate individual pieces preventing contact damage during transit. Sealed polyethylene inner liner with silica gel desiccant packs (100g per box) provides moisture barrier during monsoon transit when humidity exceeds 85% in the Imphal valley. Dry storage maintaining 20-30 degrees Celsius temperature range and below 40% relative humidity is critical because bee wax coating softens above 35 degrees Celsius causing surface dulling and fingerprint marking. The Manipur pottery logistics network handles approximately 3,200 shipments annually through Imphal airport cargo and Dimapur rail head, with damage rates reduced from 15% to 4% under North Eastern Development Finance Corporation packaging protocols implemented since 2022, covering Andro, Nungbi, Ukhrul, and Bishnupur pottery clusters.</p></CardContent></Card>
            <Card className="mbp-insight"><CardHeader><CardTitle>AI Bee Wax Coating Analysis and Manipuri Black Pottery International Market Growth</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">AI-powered surface analysis of Manipuri black pottery bee wax coatings enables quality authentication and international collector market expansion by detecting micro-level finishing variations unique to individual Tangkhul Naga potter families across Andro, Nungbi, and Ukhrul villages. Computer vision systems trained on 8,000 authenticated pottery pieces achieve 96% accuracy in distinguishing genuine hand-coiled bee wax polished Manipuri pottery from machine-made reproductions by analysing hand-coiling ridge patterns, surface texture micro-variation within 0.05mm resolution, and bee wax coating spectral signature unique to local Apis cerana honeybee wax measured by near-infrared spectroscopy. Convolutional neural networks verify the characteristic spiral coiling technique showing individual artisan hand movement signatures, with accuracy improving to 98.5% when combined with clay composition analysis by portable X-ray fluorescence spectrometer detecting Leimarel kaolin fingerprint. India's Manipuri black pottery export revenue grew 200% from Rs 3 crore in 2019 to Rs 9 crore in 2025, targeting Rs 20 crore by 2028 driven by international museum, collector, and lifestyle store demand across 10 countries including Japan, South Korea, USA, UK, Germany, and Thailand. Blockchain-based provenance tracking from Leimarel clay extraction through hand-coiling, open-pit firing, bee wax polishing, GI certification, and shipping documentation combats reproduction fraud estimated at Rs 1.2 crore annually.</p></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
