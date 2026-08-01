import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#854d0e', '#a16207', '#ca8a04', '#eab308', '#facc15', '#713f12', '#422006', '#fefce8']
const PRODUCTS = ['Sankheda Lacquered Rocking Horse', 'Turned Lacquer Candle Stand', 'Sankheda Teapot with Tray', 'Lacquered Babul Wood Stool', 'Sankheda Temple Swing', 'Floral Lacquer Dining Set', 'Sankheda Toy Elephant', 'Lacquered Wooden Cradle']
const CRAFTERS = ['Sankheda Artisan Cooperative', 'Vadodara Lacquer Guild', 'Nadiad Woodcraft Society', 'Anand Lacquer Workshop', 'Kheda Heritage Crafters', 'Borsad Lacquer Colony', 'Champaner Artisan Centre', 'Pavagadh Traditional Guild']
const STATUSES = ['GI Sankheda Lacquer Mark', 'IS 16912 Lacquerware Grade A', 'Corrugated Box with Foam', 'Enclosed Truck Transit', 'Dry Storage 22-30C', 'Lacquer Adhesion QC']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="w-24 h-2 bg-yellow-200 rounded-full overflow-hidden"><div className="h-full bg-yellow-700 rounded-full" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ label, value, size = 80 }: { label: string; value: number; size?: number }) => {
  const r = (size - 12) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#fefce8" strokeWidth="6" />
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
    id: `SLG-${String(offset + i + 1).padStart(4, '0')}`,
    crafter: CRAFTERS[(offset + i) % CRAFTERS.length], ware: PRODUCTS[(offset + i) % PRODUCTS.length],
    status: STATUSES[(offset + i) % STATUSES.length], qty: ri(1, 200, ((offset + i) * 37) % 200) + 1,
    cost: ri(800, 28000, ((offset + i) * 13097) % 27200) + 800,
    date: new Date(2024, ((offset + i) % 12), ri(1, 28, (offset + i) % 28)).toISOString().slice(0, 10),
  }))

const sankhedaRecords = [
  { id: 'SLG-0001', crafter: 'Sankheda Artisan Cooperative', ware: 'Sankheda Lacquered Rocking Horse', status: 'GI Sankheda Lacquer Mark', qty: 24, cost: 9500, date: '2024-01-10' },
  { id: 'SLG-0002', crafter: 'Vadodara Lacquer Guild', ware: 'Turned Lacquer Candle Stand', status: 'IS 16912 Lacquerware Grade A', qty: 60, cost: 2400, date: '2024-01-18' },
  { id: 'SLG-0003', crafter: 'Nadiad Woodcraft Society', ware: 'Sankheda Teapot with Tray', status: 'Corrugated Box with Foam', qty: 35, cost: 7200, date: '2024-02-05' },
  { id: 'SLG-0004', crafter: 'Anand Lacquer Workshop', ware: 'Lacquered Babul Wood Stool', status: 'Enclosed Truck Transit', qty: 18, cost: 15600, date: '2024-02-14' },
  { id: 'SLG-0005', crafter: 'Kheda Heritage Crafters', ware: 'Sankheda Temple Swing', status: 'Dry Storage 22-30C', qty: 8, cost: 24000, date: '2024-02-28' },
  { id: 'SLG-0006', crafter: 'Borsad Lacquer Colony', ware: 'Floral Lacquer Dining Set', qty: 12, cost: 18500, date: '2024-03-08', status: 'Lacquer Adhesion QC' },
  { id: 'SLG-0007', crafter: 'Champaner Artisan Centre', ware: 'Sankheda Toy Elephant', status: 'GI Sankheda Lacquer Mark', qty: 100, cost: 1800, date: '2024-03-20' },
  { id: 'SLG-0008', crafter: 'Pavagadh Traditional Guild', ware: 'Lacquered Wooden Cradle', status: 'IS 16912 Lacquerware Grade A', qty: 15, cost: 22000, date: '2024-04-02' },
  { id: 'SLG-0009', crafter: 'Sankheda Artisan Cooperative', ware: 'Turned Lacquer Candle Stand', status: 'Corrugated Box with Foam', qty: 75, cost: 2100, date: '2024-04-15' },
  { id: 'SLG-0010', crafter: 'Vadodara Lacquer Guild', ware: 'Sankheda Lacquered Rocking Horse', status: 'Enclosed Truck Transit', qty: 20, cost: 10200, date: '2024-04-28' },
  { id: 'SLG-0011', crafter: 'Nadiad Woodcraft Society', ware: 'Sankheda Teapot with Tray', status: 'Dry Storage 22-30C', qty: 42, cost: 6800, date: '2024-05-10' },
  { id: 'SLG-0012', crafter: 'Anand Lacquer Workshop', ware: 'Lacquered Babul Wood Stool', status: 'Lacquer Adhesion QC', qty: 25, cost: 14000, date: '2024-05-22' },
  { id: 'SLG-0013', crafter: 'Kheda Heritage Crafters', ware: 'Sankheda Temple Swing', status: 'GI Sankheda Lacquer Mark', qty: 6, cost: 26000, date: '2024-06-05' },
  { id: 'SLG-0014', crafter: 'Borsad Lacquer Colony', ware: 'Floral Lacquer Dining Set', status: 'IS 16912 Lacquerware Grade A', qty: 10, cost: 19800, date: '2024-06-18' },
  { id: 'SLG-0015', crafter: 'Champaner Artisan Centre', ware: 'Sankheda Toy Elephant', status: 'Corrugated Box with Foam', qty: 120, cost: 1500, date: '2024-07-01' },
  { id: 'SLG-0016', crafter: 'Pavagadh Traditional Guild', ware: 'Lacquered Wooden Cradle', status: 'Enclosed Truck Transit', qty: 14, cost: 21000, date: '2024-07-12' },
  { id: 'SLG-0017', crafter: 'Sankheda Artisan Cooperative', ware: 'Sankheda Temple Swing', status: 'Dry Storage 22-30C', qty: 9, cost: 25000, date: '2024-07-20' },
  { id: 'SLG-0018', crafter: 'Vadodara Lacquer Guild', ware: 'Floral Lacquer Dining Set', status: 'Lacquer Adhesion QC', qty: 11, cost: 20500, date: '2024-07-28' },
  { id: 'SLG-0019', crafter: 'Nadiad Woodcraft Society', ware: 'Sankheda Toy Elephant', status: 'GI Sankheda Lacquer Mark', qty: 90, cost: 1600, date: '2024-08-05' },
  { id: 'SLG-0020', crafter: 'Anand Lacquer Workshop', ware: 'Lacquered Wooden Cradle', status: 'IS 16912 Lacquerware Grade A', qty: 16, cost: 23000, date: '2024-08-15' },
]

export default function SankhedaLacquerwareGujaratLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = [...sankhedaRecords, ...genRecords(21), ...genRecords(41)]

  const filteredRecords = useMemo(() => {
    if (!searchQuery && Object.keys(activeFilters).every(k => !activeFilters[k].length)) return allRecords
    const sq = searchQuery.toLowerCase()
    return allRecords.filter(r => { if (sq && !r.id.toLowerCase().includes(sq) && !r.ware.toLowerCase().includes(sq)) return false; return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string)); })
  }, [searchQuery, activeFilters, allRecords])

  const filterGroups = [
    { key: 'ware', label: 'Ware', options: PRODUCTS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.ware === p).length })) },
    { key: 'crafter', label: 'Crafter', options: CRAFTERS.map(c => ({ value: c, label: c, count: allRecords.filter(r => r.crafter === c).length })) },
  ]

  const trendData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m, i) => ({ month: m, shipments: ri(15, 70, allRecords.length * 0.3 + i * 10) }))
  const crafterChart = CRAFTERS.map(c => ({ name: c.split(' ').slice(0, 2).join(' '), volume: allRecords.filter(r => r.crafter === c).reduce((s, r) => s + r.qty, 0) }))
  const statusPie = STATUSES.map(s => ({ name: s, value: allRecords.filter(r => r.status === s).length }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="slg-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Sankheda Lacquerware Gujarat' }]} />
      <PageHeader title="Sankheda Lacquerware Gujarat Logistics" description="Gujarat Sankheda turned lacquerware supply chain with IS 16912 lacquerware compliance, hand-lathe turning QC, corrugated box packaging, and GI Sankheda Lacquer Mark certification across 8 artisan clusters in Sankheda village, Vadodara district" />
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="bg-yellow-100">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <KpiTile label="Total Shipments" value={allRecords.length} />
            <KpiTile label="Active Ware" value={PRODUCTS.length} />
            <KpiTile label="Crafter Clusters" value={CRAFTERS.length} />
            <KpiTile label="Avg Cost" value={`₹${Math.round(allRecords.reduce((s, r) => s + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>
          <div className="grid grid-cols-6 gap-4">
            <HealthRing label="GI Tag" value={91} />
            <HealthRing label="IS 16912" value={87} />
            <HealthRing label="Foam" value={83} />
            <HealthRing label="Truck" value={79} />
            <HealthRing label="Storage" value={88} />
            <HealthRing label="Lacquer" value={92} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Artisan Families" value="800+" />
            <ValueTile label="Sankheda Village" value="Since 1850s" />
            <ValueTile label="Export Markets" value="12 Countries" />
            <ValueTile label="Annual Revenue" value="₹5 Crore" />
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
            placeholder="Search Sankheda lacquerware shipments..."
          />
          <div className="rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-yellow-100">
                <tr>
                  <th className="p-3 text-left font-medium">ID</th>
                  <th className="p-3 text-left font-medium">Ware</th>
                  <th className="p-3 text-left font-medium">Crafter</th>
                  <th className="p-3 text-left font-medium">Status</th>
                  <th className="p-3 text-left font-medium">Qty</th>
                  <th className="p-3 text-left font-medium">Cost</th>
                  <th className="p-3 text-left font-medium">Cost Bar</th>
                  <th className="p-3 text-left font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map(record => (
                  <tr key={record.id} className="border-t hover:bg-yellow-50/50">
                    <td className="p-3 font-mono text-xs">{record.id}</td>
                    <td className="p-3"><ProductBadge name={record.ware} /></td>
                    <td className="p-3">{record.crafter}</td>
                    <td className="p-3"><StatusBadge status={record.status} /></td>
                    <td className="p-3">{record.qty} {['pcs', 'sets', 'pairs', 'units'][parseInt(record.id.slice(4)) % 4]}</td>
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
              <CardHeader><CardTitle>Crafter Volume</CardTitle></CardHeader>
              <CardContent>
                <BarChart width={500} height={300} data={crafterChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="volume" fill={COLORS[0]}>
                    {crafterChart.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
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
              <CardHeader><CardTitle>Sankheda Lacquerware — 170-Year Gujarati Craft of Turned Wood</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Sankheda lacquerware is a distinctive Gujarati handicraft tradition originating from Sankheda village in the Vadodara district of Gujarat, where local artisans belonging to the Vishwakarma and Kharadi communities have practised the art of hand-lathe turned and lacquer-coated wooden objects since the mid-nineteenth century. The craft derives its name from Sankheda village situated along the Vishwamitri River, where abundant babul wood (Acacia nilotica) and locally harvested lac resin from the Palash tree (Butea monosperma) provided the raw materials for this unique craft tradition. The hallmark of Sankheda lacquerware is the brilliant hand-applied lacquer finish achieved through a labour-intensive process where coloured lac sticks are pressed against the rotating wooden piece on a manual hand lathe, causing friction heat that melts and evenly distributes the lacquer across the turned surface, creating vibrant streaked patterns in deep maroon, amber, green, and golden hues that are immediately recognisable as authentic Sankheda work. The traditional product range includes the iconic Sankheda rocking horse, turned teapots with matching trays, candle stands, temple swings, wooden cradles, toy animals, and full dining sets, each piece requiring between two to eight hours of hand-turning and lacquer application depending on its size and complexity. Today approximately 800 artisan families across eight heritage clusters in and around Sankheda village sustain this tradition, with annual turnover estimated at 5 crore rupees through domestic retail, government emporiums, and growing export demand from heritage craft collectors worldwide.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>IS 16912 Lacquerware Quality Standards & Turning Precision</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">The IS 16912 standard for Sankheda lacquerware products establishes India's comprehensive quality certification framework for this unique Gujarati turned-wood craft, ensuring consistency and consumer safety across the Sankheda lacquerware supply chain from raw material sourcing through finished product distribution. The standard specifies precise requirements for the babul wood substrate, mandating moisture content between 6-10% and minimum density of 0.65 g/cm3 to ensure the hardwood maintains structural integrity through the hand-lathe turning process and subsequent lacquer application stages that generate significant friction heat. Lacquer quality requirements mandate the use of natural shellac-based lac mixed with organic mineral pigments derived from locally sourced materials, with minimum film hardness of 2H on the pencil hardness scale to ensure the lacquer surface resists scratching and abrasion during normal use and transit. IS 16912 Grade A certification requires the lacquer coating to maintain 98% adhesion coverage after 150 cycles of cross-hatch adhesion testing as per ASTM D3359 Method B, with any delamination or flaking resulting in automatic downgrade to Grade B classification. Dimensional tolerance requirements for turned products specify maximum deviation of 1.5 millimetres from specified profiles, ensuring consistent sizing across production batches from different artisan workshops, verified through calibrated digital caliper measurements at NABL-accredited testing facilities before certification stamps are applied to qualifying batches of Sankheda lacquerware products.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Corrugated Box with Foam Packaging for Sankheda Lacquerware</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Corrugated box packaging with custom foam inserts has been specifically designed for Sankheda lacquerware products to protect the brilliant hand-applied lacquer finish, intricate turned profiles, and structural integrity of each piece from the multiple physical hazards encountered during transit from Sankheda village workshops to retail destinations across India and international markets. Each individual Sankheda piece undergoes a careful wrapping protocol beginning with a soft cotton cloth sleeve to prevent any lacquer surface abrasion, followed by placement in a precision-cut expanded polyethylene foam insert moulded to match the exact turned profile of the piece, providing targeted cushioning at all protruding decorative elements and delicate lacquer-coated surfaces that are most vulnerable to impact damage. The foam-inserted piece is then secured within a double-wall corrugated box constructed from 5-ply BC flute corrugated board rated at 300 GSM burst strength, with additional foam corner blocks and top-layer foam padding eliminating all movement within the enclosure during road and rail transit across Gujarat and beyond. Moisture barrier polyethylene liner bags enclose each foam-wrapped piece before box sealing, protecting the natural lacquer finish from humidity fluctuations during the monsoon season when ambient humidity in Gujarat frequently exceeds 80%, conditions that can cause lacquer softening and potential surface tackiness if unprotected during extended transit periods. This packaging system has been validated to ISTA 3A transit simulation protocols, demonstrating capability to withstand drops from 76 centimetres without any lacquer cracking or surface damage, reducing the historical transit damage rate from 12% to under 2% across the Sankheda supply chain since its adoption.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>AI Lacquer Pattern Analysis & Sankheda Craft Market Expansion</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Artificial intelligence and advanced imaging technologies are introducing transformative quality assurance capabilities to the Sankheda lacquerware craft, where the distinctive hand-applied lacquer streak patterns that define authentic Sankheda work have traditionally required years of master artisan experience to authenticate and grade consistently across different production batches. The AI lacquer verification system employs high-resolution macro photography combined with polarised light analysis to capture precise images of the lacquer surface topography on each finished Sankheda piece, measuring lacquer thickness uniformity across the turned surface with accuracy to 0.02 millimetres and detecting imperfections such as uneven colour distribution, air bubble inclusions, or insufficient lacquer coverage that indicate substandard application technique or improper lacquer storage conditions. Computer vision algorithms trained on over 12,000 authenticated Sankheda lacquer patterns can verify design authenticity by comparing streak pattern consistency, colour palette balance, and lathe-turning precision against a reference database of master artisan works from each of the eight heritage clusters, providing objective quality grading that complements the traditional visual assessment by experienced craft evaluators. The Gujarat State Khadi and Village Industries Board has begun integrating this AI verification into its export certification pipeline, reducing quality rejection rates at government handicraft emporiums from 18% to under 4% while accelerating the certification timeline from 7 working days to under 48 hours for qualifying Sankheda lacquerware shipments. India's GI protection for Sankheda lacquerware combined with digital authentication infrastructure has opened new export partnerships with premium furniture retailers in Europe and North America who demand verifiable provenance and quality documentation for authentic Indian heritage craft products.</p></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
