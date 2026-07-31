import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#166534', '#15803d', '#22c55e', '#4ade80', '#dcfce7', '#14532d', '#052e16', '#f0fdf4']
const PRODUCTS = ['Naga Log Drum Panel', 'Ancestral Figure Totem', 'Ceremonial Warrior Mask', 'Konyak Morung Door Panel', 'Ao Tribe Hornbill Sculpture', 'Sema Festival Wood Relief', 'Angami Village Gate Post', 'Naga Chief Throne Chair']
const CARVERS = ['Kohima Angami Carvers Guild', 'Dimapur Ao Wood Art Centre', 'Mokokchung Tribal Carvers', 'Tuensang Konyak Sculptors', 'Wokha Lotha Wood Guild', 'Zunheboto Sema Craft Studio', 'Mon District Artisan Colony', 'Phek Chakhesang Carvers Society']
const STATUSES = ['GI Naga Wood Carving Mark', 'IS 16802 Hardwood Carving Grade A', 'Foam-Wrapped Timber Crate', 'Flatbed Truck Transit', 'Dry Storage 18-28C', 'Timber Moisture QC']
const UNITS = ['pcs', 'panels', 'sets', 'pairs']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ label }: { label: string }) => (
  <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>
    {label}</span>)

const StatusBadge = ({ label }: { label: string }) => (
  <span className="inline-block px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-800">
    {label}</span>)

const CostBar = ({ value, max }: { value: number; max: number }) => {
  const pct = (value / max) * 100
  return <div className="w-full"><div className="h-2 bg-green-100 rounded-full"><div className="h-2 bg-green-700 rounded-full" style={{ width: `${pct}%` }} /></div></div> }

const HealthRing = ({ label, value }: { label: string; value: number }) => {
  const r = 30, c = 2 * Math.PI * r, o = c - (value / 100) * c
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="80" height="80" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r={r} fill="none" stroke="#e5e7eb" strokeWidth="6" />
        <circle cx="40" cy="40" r={r} fill="none" stroke={COLORS[0]} strokeWidth="6" strokeDasharray={c} strokeDashoffset={o} strokeLinecap="round" transform="rotate(-90 40 40)" />
        <text x="40" y="44" textAnchor="middle" fontSize="14" fontWeight="bold" fill={COLORS[0]}>{value}%</text>
      </svg>
      <span className="text-xs text-gray-600 text-center">{label}</span>
    </div>
) }

const KpiTile = ({ title, value, color }: { title: string; value: string | number; color: string }) => (
  <Card className="p-4"><CardContent className="p-0">
    <p className="text-xs text-gray-500">{title}</p>
    <p className="text-2xl font-bold" style={{ color }}>{value}</p>
  </CardContent></Card>)
const ValueTile = ({ title, value }: { title: string; value: string }) => (
  <Card className="p-4"><CardContent className="p-0"><p className="text-xs text-gray-500">{title}</p><p className="text-lg font-semibold" style={{ color: COLORS[1] }}>{value}</p></CardContent></Card>)

const genRecords = (n: number) =>
  Array.from({ length: n }, (_, i) => ({
    id: `NWC-${String(i + 1).padStart(4, '0')}`,
    carver: CARVERS[i % CARVERS.length],
    sculpture: PRODUCTS[i % PRODUCTS.length],
    cost: 5000 + Math.floor(Math.random() * 275000),
    status: STATUSES[i % STATUSES.length],
    health: ri(60, 100, Math.floor(Math.random() * 40 + 60)),
  }))

const carvingRecords = [
  { id: 'NWC-0001', carver: 'Kohima Angami Carvers Guild', sculpture: 'Naga Log Drum Panel', cost: 85000, status: 'GI Naga Wood Carving Mark', health: 93, unit: 'panels', qty: 4, trend: 12 },
  { id: 'NWC-0002', carver: 'Dimapur Ao Wood Art Centre', sculpture: 'Ancestral Figure Totem', cost: 245000, status: 'IS 16802 Hardwood Carving Grade A', health: 89, unit: 'pcs', qty: 2, trend: 8 },
  { id: 'NWC-0003', carver: 'Mokokchung Tribal Carvers', sculpture: 'Ceremonial Warrior Mask', cost: 67000, status: 'Foam-Wrapped Timber Crate', health: 85, unit: 'pcs', qty: 6, trend: 15 },
  { id: 'NWC-0004', carver: 'Tuensang Konyak Sculptors', sculpture: 'Konyak Morung Door Panel', cost: 180000, status: 'Flatbed Truck Transit', health: 76, unit: 'panels', qty: 3, trend: -5 },
  { id: 'NWC-0005', carver: 'Wokha Lotha Wood Guild', sculpture: 'Ao Tribe Hornbill Sculpture', cost: 95000, status: 'Dry Storage 18-28C', health: 87, unit: 'pcs', qty: 8, trend: 22 },
  { id: 'NWC-0006', carver: 'Zunheboto Sema Craft Studio', sculpture: 'Sema Festival Wood Relief', cost: 52000, status: 'Timber Moisture QC', health: 91, unit: 'sets', qty: 5, trend: 10 },
  { id: 'NWC-0007', carver: 'Mon District Artisan Colony', sculpture: 'Angami Village Gate Post', cost: 280000, status: 'GI Naga Wood Carving Mark', health: 94, unit: 'pcs', qty: 1, trend: 3 },
  { id: 'NWC-0008', carver: 'Phek Chakhesang Carvers Society', sculpture: 'Naga Chief Throne Chair', cost: 165000, status: 'IS 16802 Hardwood Carving Grade A', health: 88, unit: 'pcs', qty: 2, trend: 7 },
  { id: 'NWC-0009', carver: 'Kohima Angami Carvers Guild', sculpture: 'Ceremonial Warrior Mask', cost: 73000, status: 'Foam-Wrapped Timber Crate', health: 82, unit: 'pairs', qty: 4, trend: 18 },
  { id: 'NWC-0010', carver: 'Dimapur Ao Wood Art Centre', sculpture: 'Naga Log Drum Panel', cost: 120000, status: 'Flatbed Truck Transit', health: 78, unit: 'panels', qty: 3, trend: -2 },
  { id: 'NWC-0011', carver: 'Mokokchung Tribal Carvers', sculpture: 'Konyak Morung Door Panel', cost: 195000, status: 'Dry Storage 18-28C', health: 90, unit: 'panels', qty: 2, trend: 14 },
  { id: 'NWC-0012', carver: 'Tuensang Konyak Sculptors', sculpture: 'Ancestral Figure Totem', cost: 210000, status: 'Timber Moisture QC', health: 92, unit: 'pcs', qty: 2, trend: 9 },
  { id: 'NWC-0013', carver: 'Wokha Lotha Wood Guild', sculpture: 'Sema Festival Wood Relief', cost: 48000, status: 'GI Naga Wood Carving Mark', health: 86, unit: 'sets', qty: 10, trend: 25 },
  { id: 'NWC-0014', carver: 'Zunheboto Sema Craft Studio', sculpture: 'Naga Chief Throne Chair', cost: 175000, status: 'IS 16802 Hardwood Carving Grade A', health: 95, unit: 'pcs', qty: 1, trend: 4 },
  { id: 'NWC-0015', carver: 'Mon District Artisan Colony', sculpture: 'Ao Tribe Hornbill Sculpture', cost: 88000, status: 'Foam-Wrapped Timber Crate', health: 83, unit: 'pcs', qty: 6, trend: 11 },
  { id: 'NWC-0016', carver: 'Phek Chakhesang Carvers Society', sculpture: 'Angami Village Gate Post', cost: 225000, status: 'Flatbed Truck Transit', health: 77, unit: 'pcs', qty: 2, trend: -3 },
  { id: 'NWC-0017', carver: 'Kohima Angami Carvers Guild', sculpture: 'Naga Chief Throne Chair', cost: 260000, status: 'Dry Storage 18-28C', health: 96, unit: 'pcs', qty: 1, trend: 6 },
  { id: 'NWC-0018', carver: 'Dimapur Ao Wood Art Centre', sculpture: 'Ceremonial Warrior Mask', cost: 55000, status: 'Timber Moisture QC', health: 84, unit: 'pairs', qty: 8, trend: 20 },
  { id: 'NWC-0019', carver: 'Mokokchung Tribal Carvers', sculpture: 'Naga Log Drum Panel', cost: 110000, status: 'GI Naga Wood Carving Mark', health: 90, unit: 'panels', qty: 5, trend: 13 },
  { id: 'NWC-0020', carver: 'Tuensang Konyak Sculptors', sculpture: 'Ceremonial Warrior Mask', cost: 72000, status: 'IS 16802 Hardwood Carving Grade A', health: 88, unit: 'pcs', qty: 7, trend: 16 },
]

export default function NagaWoodCarvingNagalandLogisticsView() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = carvingRecords
  const filteredRecords = useMemo(() => {
    const q = searchQuery.toLowerCase()
    return allRecords.filter(r =>
      Object.keys(r).some(k => String(r[k as keyof typeof r]).toLowerCase().includes(q)) &&
      Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string))
    )
  }, [searchQuery, activeFilters, allRecords])
  const filterGroups = [
    { key: 'sculpture', label: 'Sculpture', options: PRODUCTS.map(p => ({ label: p, value: p, count: allRecords.filter(r => r.sculpture === p).length })) },
    { key: 'status', label: 'Status', options: STATUSES.map(s => ({ label: s, value: s, count: allRecords.filter(r => r.status === s).length })) },
    { key: 'carver', label: 'Carver', options: CARVERS.map(c => ({ label: c, value: c, count: allRecords.filter(r => r.carver === c).length })) },
  ]
  const charts = {
    line: allRecords.map(r => ({ name: r.id, cost: r.cost })),
    bar: PRODUCTS.map(p => ({ name: p.split(' ').slice(0, 2).join(' '), qty: allRecords.filter(r => r.sculpture === p).reduce((a, r) => a + r.qty, 0) })),
    pie: STATUSES.map(s => ({ name: s.split(' ').slice(0, 3).join(' '), value: allRecords.filter(r => r.status === s).length })),
  }
  const maxCost = Math.max(...allRecords.map(r => r.cost))
  return (
    <div className="space-y-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Naga Wood Carving Nagaland' }]} />
      <PageHeader
        title="Naga Wood Carving Nagaland Logistics"
        description="Traditional Naga wood carving logistics and warehouse management"
        actions={<button className="px-4 py-2 bg-green-700 text-white rounded-lg text-sm">New Shipment</button>}
      />
      <Tabs defaultValue="dashboard" className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard" className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            <KpiTile title="Total Carvings" value={filteredRecords.length} color={COLORS[1]} />
            <KpiTile title="Active Shipments" value={Math.floor(filteredRecords.reduce((a, r) => a + r.qty, 0))} color={COLORS[1]} />
            <KpiTile title="Revenue" value={`₹${Math.floor(filteredRecords.reduce((a, r) => a + r.cost * r.qty, 0)).toLocaleString()}`} color={COLORS[1]} />
            <KpiTile title="Avg Health" value={`${Math.floor(filteredRecords.reduce((a, r) => a + r.health, 0) / filteredRecords.length)}%`} color={COLORS[1]} />
          </div>
          <div className="grid grid-cols-6 gap-4">
            <HealthRing label="GI Mark" value={93} />
            <HealthRing label="IS 16802" value={89} />
            <HealthRing label="Timber Crate" value={85} />
            <HealthRing label="Truck Transit" value={76} />
            <HealthRing label="Dry Storage" value={87} />
            <HealthRing label="Moisture QC" value={91} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ValueTile title="Carving Villages" value="16" />
            <ValueTile title="Annual Output" value="2,800 Pieces" />
            <ValueTile title="Export Markets" value="12 Countries" />
            <ValueTile title="Heritage" value="500 Years" />
          </div>
        </TabsContent>
        <TabsContent value="shipments" className="space-y-4">
          <SearchFilterToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onClearSearch={() => setSearchQuery('')}
            activeFilters={activeFilters}
            filterGroups={filterGroups}
            onToggleFilter={(key, val) => setActiveFilters(prev => ({ ...prev, [key]: prev[key]?.includes(val) ? prev[key].filter(v => v !== val) : [...(prev[key] || []), val] }))}
            onClearAllFilters={() => setActiveFilters({})}
            totalItems={allRecords.length}
            filteredCount={filteredRecords.length}
            onRefresh={() => {}}
            placeholder="Search carvings..."
          />
          <Card>
            <CardHeader>
              <CardTitle>Wood Carving Shipments</CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="p-2 text-left">ID</th>
                    <th className="p-2 text-left">Carver</th>
                    <th className="p-2 text-left">Sculpture</th>
                    <th className="p-2 text-left">Cost</th>
                    <th className="p-2 text-left">Status</th>
                    <th className="p-2 text-left">Health</th>
                    <th className="p-2 text-left">Unit</th>
                    <th className="p-2 text-left">Qty</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map(r => (
                    <tr key={r.id} className="border-b hover:bg-gray-50">
                      <td className="p-2 font-mono text-xs">{r.id}</td>
                      <td className="p-2 text-xs">{r.carver}</td>
                      <td className="p-2"><ProductBadge label={r.sculpture} /></td>
                      <td className="p-2">₹{r.cost.toLocaleString()}</td>
                      <td className="p-2"><StatusBadge label={r.status} /></td>
                      <td className="p-2"><CostBar value={r.health} max={100} /></td>
                      <td className="p-2">{r.unit}</td>
                      <td className="p-2">{r.qty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader><CardTitle>Cost Trend</CardTitle></CardHeader>
              <CardContent>
                <LineChart data={charts.line} width={400} height={250}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="cost" stroke={COLORS[0]} />
                </LineChart>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Quantity by Sculpture</CardTitle></CardHeader>
              <CardContent>
                <BarChart data={charts.bar} width={400} height={250}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="qty" fill={COLORS[0]} />
                </BarChart>
              </CardContent>
            </Card>
            <Card className="col-span-2">
              <CardHeader><CardTitle>Status Distribution</CardTitle></CardHeader>
              <CardContent>
                <PieChart width={400} height={250}>
                  <Pie data={charts.pie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {charts.pie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader><CardTitle>Naga Ancestral Wood Carving — 500 Years of Tribal Hardwood Tradition</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-gray-600">The Naga wood carving tradition spans over 500 years, originating from the Angami, Ao, Sema, and Konyak Naga tribes of Nagaland. Master carvers use hand-forged chisels and adzes to shape Naga oak (Quercus glauca) and locally sourced teak (Tectona grandis) into magnificent log drums, towering ancestral figure totems, fearsome ceremonial warrior masks, and intricately detailed morung door panels. Each carving carries deep tribal cosmological significance, with recurring motifs depicting hornbills as symbols of fertility and prestige, mithun bulls as wealth indicators, headhunting warriors representing bravery and protection, and complex geometric spiritual symbols that encode the community oral history, clan lineage, and animistic beliefs. The Angami tribe is renowned for monumental village gate posts and elaborate ceremonial feast panels, while the Konyak specialize in striking warrior face masks and ornate morung dormitory door carvings adorned with skull motifs. Ao carvers produce exquisite hornbill sculptures representing spiritual messengers, and Sema artisans create dynamic festival wood reliefs depicting communal dances, rice harvest celebrations, and tribal courtship rituals. This living heritage continues through intergenerational apprenticeship in dedicated carving villages across Kohima, Dimapur, Mokokchung, Tuensang, and Mon districts of Nagaland.</p></CardContent></Card>
            <Card>
              <CardHeader><CardTitle>IS 16802 Hardwood Carving Quality Standards for Naga Wood Sculpture</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-gray-600">IS 16802 Hardwood Carving Quality Standards establish comprehensive benchmarks for Naga wood sculpture production, grading, and certification across India GI-protected craft sector. For Naga oak (Quercus glauca), moisture content must be maintained between 8-12% before carving commences, verified using pin-type moisture meters at three points per timber section. Teak (Tectona grandis) used for premium carvings requires density verification at 600-700 kg/m3 per IS 3640 standards. Grade A certification demands chisel mark depth variation of 0.5-3mm, demonstrating authentic hand-carving technique versus machine-carved reproductions which exhibit uniform 0.1mm laser-cut patterns. Surface finish smoothness must achieve Ra (roughness average) values below 6.3 micrometers for commercial-grade exhibition pieces. Anti-termite treatment using borax-boric acid solution at 8% concentration is mandatory for all export-bound carvings, with a minimum 72-hour cold immersion period. Dimensional tolerance for ceremonial panels is plus or minus 2mm over 120cm lengths. The standard also specifies UV-resistant polyurethane lacquer coating requirements for outdoor installations, and mandates complete traceability documentation linking each finished carving to its source timber lot, felling permit number, and artisan workshop registration.</p></CardContent></Card>
            <Card>
              <CardHeader><CardTitle>Foam-Wrapped Timber Crate Packaging & Dry Surface Transit for Wood Sculpture</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-gray-600">Packaging Naga wood sculptures for surface transit requires specialized foam-wrapped timber crate engineering designed to protect delicate hand-carved surfaces from vibration damage and environmental stress. Each carved piece receives individual multi-layer bubble-wrap at 30mm thickness and custom-cut EVA foam-padded wrapping conforming to the sculpture contour profile, secured within partitioned timber crates built from seasoned pine with rubber shock absorbers positioned at all six-axis stress points. Temperature control between 18-28 degrees Celsius is absolutely critical during surface transit to prevent hardwood cracking caused by thermal expansion differentials in Naga oak and teak grains. Dry storage warehousing facilities maintain ambient humidity below 50% using industrial-grade dehumidifier systems and strategically placed silica gel desiccant packets at 500g per cubic meter. The Nagaland logistics network currently processes over 2,800 wood carving shipments annually, primarily routed through the Dimapur railhead and NH-2 Kohima highway corridor, with specialized flatbed trucks equipped with air-ride suspension systems. Real-time GPS tracking and IoT temperature sensors ensure complete chain-of-custody documentation for every GI-certified piece destined for international exhibition venues and museum collection circuits worldwide.</p></CardContent></Card>
            <Card>
              <CardHeader><CardTitle>AI Chisel Mark Authentication & Naga Wood Carving International Market Expansion</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-gray-600">Artificial intelligence is fundamentally transforming Naga wood carving authentication through advanced CNN-based chisel mark analysis and pattern recognition systems developed specifically for tribal hardwood crafts. A custom convolutional neural network architecture trained on a curated dataset of 10,000 authenticated Naga carvings spanning all four major tribal traditions achieves 93% accuracy in distinguishing genuine hand-chiselled masterworks from machine-carved reproductions and counterfeit pieces. The system analyzes microscopic chisel stroke depth variation at 0.1mm resolution intervals, edge irregularity frequency patterns, and unique wood grain interaction signatures at the tool-surface interface that are impossible to replicate mechanically. This authentication technology has directly enabled export revenue growth from Rs 5 crore in 2019 to Rs 14 crore in 2025, with the Nagaland Handloom and Handicrafts Directorate projecting Rs 30 crore by 2028 across 12 target countries including Japan, Germany, the United States, South Korea, France, the United Kingdom, Australia, Italy, Canada, Singapore, the Netherlands, and Thailand. The digital authentication registry also creates immutable provenance chains linking each verified carving to its artisan, village of origin, timber source, and exact carving completion date for premium international tribal art markets.</p></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
