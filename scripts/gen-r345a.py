import os, sys

BASE = os.path.join(os.getcwd(), 'src/components/modules')

# Module 1: Pembarthi Metal Craft Telangana (pem-*, #064e3b deep emerald green)
pembarthi = r"""import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#064e3b', '#065f46', '#022c22', '#011617', '#047857', '#059669', '#0d9488', '#d1fae5']
const PRODUCTS = ['Pembarthi Brass Temple Kalasham', 'Telangana Silver Inlay Lamp Stand', 'Pembarthi Copper Puja Mandapam', 'Warangal Brass Nandi Bull Panel', 'Pembarthi Silver Floral Betel Box', 'Telangana Bronze Temple Bell', 'Pembarthi Gold-Overlay Swastik Plate', 'Warangal Brass Lakshmi Devi Panel']
const ARTISANS = ['Pembarthi Metal Workers Guild', 'Warangal Heritage Metalcraft Society', 'Hyderabad Silver Inlay Studio', 'Karimnagar Brass Artisan Colony', 'Nizamabad Pembarthi Workshop', 'Khammam Temple Metal Centre', 'Nalgonda Traditional Crafters', 'Medak Pembarthi Heritage Studio']
const STATUSES = ['GI Pembarthi Metal Mark', 'IS 16788 Pembarthi Art Grade A', 'Bubble Foam Metal Wrap', 'Palletised Truck Transit', 'Dry Storage 20-30C', 'Silver Inlay Fidelity QC']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="w-24 h-2 bg-emerald-200 rounded-full overflow-hidden"><div className="h-full bg-emerald-700 rounded-full" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ label, value, size = 80 }: { label: string; value: number; size?: number }) => {
  const r = (size - 12) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#d1fae5" strokeWidth="6" />
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
    id: `PEM-${String(offset + i + 1).padStart(4, '0')}`,
    painter: ARTISANS[(offset + i) % ARTISANS.length], ware: PRODUCTS[(offset + i) % PRODUCTS.length],
    status: STATUSES[(offset + i) % STATUSES.length], qty: ri(1, 28, ((offset + i) * 27) % 28) + 1,
    cost: ri(6000, 92000, ((offset + i) * 13107) % 86000) + 6000,
    date: new Date(2024, ((offset + i) % 12), ri(1, 28, (offset + i) % 28)).toISOString().slice(0, 10),
  }))

const pembarthiRecords = [
  { id: 'PEM-0001', painter: 'Pembarthi Metal Workers Guild', ware: 'Pembarthi Brass Temple Kalasham', status: 'GI Pembarthi Metal Mark', qty: 3, cost: 78000, date: '2024-01-12' },
  { id: 'PEM-0002', painter: 'Warangal Heritage Metalcraft Society', ware: 'Telangana Silver Inlay Lamp Stand', status: 'IS 16788 Pembarthi Art Grade A', qty: 5, cost: 52000, date: '2024-01-25' },
  { id: 'PEM-0003', painter: 'Hyderabad Silver Inlay Studio', ware: 'Pembarthi Copper Puja Mandapam', status: 'Bubble Foam Metal Wrap', qty: 2, cost: 88000, date: '2024-02-08' },
  { id: 'PEM-0004', painter: 'Karimnagar Brass Artisan Colony', ware: 'Warangal Brass Nandi Bull Panel', status: 'Palletised Truck Transit', qty: 6, cost: 34000, date: '2024-02-20' },
  { id: 'PEM-0005', painter: 'Nizamabad Pembarthi Workshop', ware: 'Pembarthi Silver Floral Betel Box', status: 'Dry Storage 20-30C', qty: 8, cost: 22000, date: '2024-03-05' },
  { id: 'PEM-0006', painter: 'Khammam Temple Metal Centre', ware: 'Telangana Bronze Temple Bell', status: 'Silver Inlay Fidelity QC', qty: 4, cost: 62000, date: '2024-03-18' },
  { id: 'PEM-0007', painter: 'Nalgonda Traditional Crafters', ware: 'Pembarthi Gold-Overlay Swastik Plate', status: 'GI Pembarthi Metal Mark', qty: 3, cost: 85000, date: '2024-03-30' },
  { id: 'PEM-0008', painter: 'Medak Pembarthi Heritage Studio', ware: 'Warangal Brass Lakshmi Devi Panel', status: 'IS 16788 Pembarthi Art Grade A', qty: 5, cost: 48000, date: '2024-04-12' },
  { id: 'PEM-0009', painter: 'Pembarthi Metal Workers Guild', ware: 'Telangana Silver Inlay Lamp Stand', status: 'Bubble Foam Metal Wrap', qty: 4, cost: 56000, date: '2024-04-24' },
  { id: 'PEM-0010', painter: 'Warangal Heritage Metalcraft Society', ware: 'Pembarthi Brass Temple Kalasham', status: 'Palletised Truck Transit', qty: 3, cost: 72000, date: '2024-05-06' },
  { id: 'PEM-0011', painter: 'Hyderabad Silver Inlay Studio', ware: 'Pembarthi Copper Puja Mandapam', status: 'Dry Storage 20-30C', qty: 6, cost: 38000, date: '2024-05-18' },
  { id: 'PEM-0012', painter: 'Karimnagar Brass Artisan Colony', ware: 'Warangal Brass Nandi Bull Panel', status: 'Silver Inlay Fidelity QC', qty: 2, cost: 90000, date: '2024-05-30' },
  { id: 'PEM-0013', painter: 'Nizamabad Pembarthi Workshop', ware: 'Pembarthi Silver Floral Betel Box', status: 'GI Pembarthi Metal Mark', qty: 7, cost: 26000, date: '2024-06-12' },
  { id: 'PEM-0014', painter: 'Khammam Temple Metal Centre', ware: 'Telangana Bronze Temple Bell', status: 'IS 16788 Pembarthi Art Grade A', qty: 4, cost: 58000, date: '2024-06-24' },
  { id: 'PEM-0015', painter: 'Nalgonda Traditional Crafters', ware: 'Pembarthi Gold-Overlay Swastik Plate', status: 'Bubble Foam Metal Wrap', qty: 3, cost: 82000, date: '2024-07-06' },
  { id: 'PEM-0016', painter: 'Medak Pembarthi Heritage Studio', ware: 'Warangal Brass Lakshmi Devi Panel', status: 'Palletised Truck Transit', qty: 5, cost: 44000, date: '2024-07-18' },
  { id: 'PEM-0017', painter: 'Pembarthi Metal Workers Guild', ware: 'Telangana Bronze Temple Bell', status: 'Dry Storage 20-30C', qty: 4, cost: 68000, date: '2024-07-30' },
  { id: 'PEM-0018', painter: 'Warangal Heritage Metalcraft Society', ware: 'Pembarthi Brass Temple Kalasham', status: 'Silver Inlay Fidelity QC', qty: 3, cost: 76000, date: '2024-08-10' },
  { id: 'PEM-0019', painter: 'Hyderabad Silver Inlay Studio', ware: 'Pembarthi Copper Puja Mandapam', status: 'GI Pembarthi Metal Mark', qty: 6, cost: 42000, date: '2024-08-22' },
  { id: 'PEM-0020', painter: 'Karimnagar Brass Artisan Colony', ware: 'Warangal Brass Nandi Bull Panel', status: 'IS 16788 Pembarthi Art Grade A', qty: 2, cost: 92000, date: '2024-09-03' },
]


export default function PembarthiMetalCraftTelanganaLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = [...pembarthiRecords, ...genRecords(21), ...genRecords(41)]

  const filteredRecords = useMemo(() => {
    if (!searchQuery && Object.keys(activeFilters).every(k => !activeFilters[k].length)) return allRecords
    const sq = searchQuery.toLowerCase()
    return allRecords.filter(r => { if (sq && !r.id.toLowerCase().includes(sq) && !r.ware.toLowerCase().includes(sq)) return false; return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string)); })
  }, [searchQuery, activeFilters, allRecords])


  const filterGroups = [
    { key: 'ware', label: 'Ware', options: PRODUCTS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.ware === p).length })) },
    { key: 'painter', label: 'Painter', options: ARTISANS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.painter === p).length })) },
  ]

  const trendData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m, i) => ({ month: m, shipments: ri(4, 26, allRecords.length * 0.12 + i * 3) }))
  const artisanChart = ARTISANS.map(p => ({ name: p.split(' ').slice(0, 2).join(' '), volume: allRecords.filter(r => r.painter === p).reduce((s, r) => s + r.qty, 0) }))
  const statusPie = STATUSES.map(s => ({ name: s, value: allRecords.filter(r => r.status === s).length }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="pem-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Pembarthi Metal Craft Telangana' }]} />
      <PageHeader title="Pembarthi Metal Craft Telangana Logistics" description="Telangana Pembarthi brass and silver inlay metalwork supply chain with IS 16788 certification, silver inlay fidelity QC, bubble foam metal packaging, and GI Pembarthi Metal Mark across 8 heritage artisan clusters in Warangal, Hyderabad, and Karimnagar" />
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="bg-emerald-100">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <KpiTile label="Total Shipments" value={allRecords.length} />
            <KpiTile label="Active Ware" value={PRODUCTS.length} />
            <KpiTile label="Metalwork Clusters" value={ARTISANS.length} />
            <KpiTile label="Avg Cost" value={`₹${Math.round(allRecords.reduce((s, r) => s + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>
          <div className="grid grid-cols-6 gap-4">
            <HealthRing label="GI Tag" value={93} />
            <HealthRing label="IS 16788" value={89} />
            <HealthRing label="Bubble" value={85} />
            <HealthRing label="Truck" value={81} />
            <HealthRing label="Dry Store" value={87} />
            <HealthRing label="Inlay QC" value={91} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Artisan Families" value="40+" />
            <ValueTile label="Tradition" value="Since 14th C" />
            <ValueTile label="Export Markets" value="7 Countries" />
            <ValueTile label="Annual Revenue" value="₹2.8 Crore" />
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
            placeholder="Search Pembarthi metal craft shipments..."
          />
          <div className="rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-emerald-100">
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
                  <tr key={record.id} className="border-t hover:bg-emerald-50/50">
                    <td className="p-3 font-mono text-xs">{record.id}</td>
                    <td className="p-3"><ProductBadge name={record.ware} /></td>
                    <td className="p-3">{record.painter}</td>
                    <td className="p-3"><StatusBadge status={record.status} /></td>
                    <td className="p-3">{record.qty} {['pcs', 'sets', 'units', 'panels'][parseInt(record.id.slice(4)) % 4]}</td>
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
              <CardHeader><CardTitle>Pembarthi Metal Craft — 700-Year Telangana Temple Metalwork Tradition</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">Pembarthi metal craft is one of the most technically sophisticated and visually distinctive metalworking traditions in the Indian subcontinent, having been continuously practised for over seven centuries in the Pembarthi village of Telangana's Warangal district where hereditary Viswabrahmin metal artisan families create intricate brass and copper objects adorned with exquisite silver inlay work depicting mythological narratives, divine figures, and ornamental floral patterns derived from the Kakatiya dynasty temple art tradition that flourished during the twelfth to fourteenth centuries CE when the Kakatiya kings of Warangal patronised the Pembarthi metalworkers to create elaborate temple decorative elements including ornamental door hinges, bell metal chains, sanctuary lamp stands, ceremonial umbrellas, and ritual vessels for the major Shaivite and Vaishnavite temples constructed across the Telangana region during the golden age of Kakatiya temple architecture that produced the iconic Thousand Pillar Temple at Hanamakonda, the Ramappa Temple at Palampet which is now recognised as a UNESCO World Heritage Site, and the Bhadrakali Temple at Warangal where the finest surviving examples of Pembarthi metal inlay artistry continue to be preserved and displayed as irreplaceable testimonies to the extraordinary technical mastery and artistic vision of the traditional Telangana metal artisan communities. The Pembarthi metal inlay technique involves a sophisticated multi-stage process beginning with the casting of the base brass or copper object through the traditional lost-wax casting method where a beeswax model is created by hand, encased in a clay mould, heated to melt and drain the wax leaving a hollow cavity, and then filled with molten brass or copper alloy at temperatures exceeding 1,050 degrees Celsius in a charcoal-fired furnace to produce the rough-cast base object that is subsequently finished through filing, grinding, and polishing to achieve a smooth surface suitable for receiving the delicate silver inlay work that defines the Pembarthi aesthetic. The silver inlay process begins with the incising of the decorative pattern directly into the polished brass or copper surface using a fine steel graver tool creating shallow grooves following the intricate floral, figural, and geometric patterns derived from the Kakatiya temple art vocabulary, then carefully hammering thin strips of fine silver wire or sheet into the incised grooves using a miniature chasing hammer and burnishing tool until the silver inlay sits flush with the surrounding brass surface creating a seamless integration of the silver decorative pattern into the copper alloy substrate that produces the distinctive bichrome metallic aesthetic where the warm golden tone of the brass base provides a rich visual contrast against the cool silver-white of the inlaid decorative patterns creating a visual effect of extraordinary depth and luminosity that distinguishes authentic Pembarthi metalwork from the cast-brass reproductions and machine-engraved imitations that have increasingly appeared in both the domestic Indian handicraft market and international online retail platforms serving the growing global demand for authenticated Indian metal art objects.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>IS 16788 Pembarthi Art Standards & Silver Inlay Fidelity QC</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The IS 16788 standard for Pembarthi metal art establishes India's first dedicated quality certification framework for the Telangana Pembarthi brass and silver inlay metalwork tradition, specifying comprehensive requirements for base metal alloy composition and purity, silver inlay material quality and fineness, incised groove depth and width parameters, silver inlay adhesion and flushness standards, surface finish quality, and overall artistic standards that collectively distinguish authentic Pembarthi metal craft objects created by traditional Viswabrahmin artisan families from the growing volume of cast-brass reproductions with painted or electroplated silver-pattern imitations that have increasingly appeared in both domestic Indian handicraft markets and international online retail platforms serving the global demand for authenticated Indian metal art. The base metal alloy composition requirements for IS 16788 Grade A certification mandate exclusively hand-cast brass alloy with copper content between 58% and 62% and zinc content between 34% and 38% verified through optical emission spectroscopy confirming the absence of lead content exceeding 0.1% by weight ensuring the brass alloy meets the food-contact safety standards required for ceremonial and ritual vessels including the traditional Kalasham water pot used in Hindu temple puja ceremonies and the ceremonial betel box or paan-daan used in traditional Telugu household hospitality customs where the brass object comes into direct contact with food and beverage items during ritual and social occasions. The silver inlay material requirements for Grade A certification mandate exclusively sterling silver with minimum fineness of 92.5% verified through X-ray fluorescence spectroscopy confirming the absence of base metal adulterants including nickel, copper, and zinc that would indicate commercially manufactured silver-plated wire or electroplated silver-pattern imitations rather than the hand-incised solid silver inlay that characterises authentic Pembarthi metalwork where thin strips of sterling silver measuring between 0.3 and 0.8 millimetres in width are individually hammered into hand-incised grooves following the intricate Kakatiya-era decorative patterns that define the Pembarthi visual vocabulary. Silver inlay adhesion verification for IS 16788 Grade A certification mandates pull-out testing where the silver inlay strips must withstand a minimum withdrawal force of 2.5 newtons without displacement from the incised groove ensuring the silver inlay is securely embedded in the brass substrate and will not lift, peel, or dislodge during normal handling, cleaning, and ceremonial use conditions over the expected service life of twenty-five years or more that characterises authenticated Pembarthi metal craft objects maintained in active temple ritual use or institutional collection preservation conditions.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Bubble Foam Metal Packaging for Pembarthi Brass Artifacts Transit</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">Bubble foam packaging with custom moulded polyethylene inserts has been specifically developed for the Pembarthi metal craft logistics supply chain to protect the delicate silver inlay surfaces, polished brass substrates, and ornamental protruding elements that characterise authentic Pembarthi metal craft objects from the physical and environmental hazards encountered during transit from the Telangana artisan workshops in the Warangal, Karimnagar, and Nizamabad districts to domestic temple and gallery destinations across Hyderabad, New Delhi, Mumbai, and Chennai, and international export destinations serving the global Indian metal art collector community in the United States, United Kingdom, Europe, Japan, and the Middle East where significant institutional and private collections of Indian temple art and metalwork actively seek authenticated Pembarthi brass and silver inlay objects for acquisition, exhibition, and ritual consecration purposes. The packaging specification utilises closed-cell polyethylene foam sheeting with minimum density of 24 kilograms per cubic metre and thickness of 10 millimetres as the primary cushioning material providing shock-absorbing protection against the impact and vibration forces encountered during road transport along the national highway network connecting the Warangal district production centres to the major urban distribution hubs of Hyderabad and subsequently to international cargo terminals. Each Pembarthi metal object is inspected under standardised D65 daylight illumination verifying silver inlay surface integrity, brass substrate polish quality, inlay pattern accuracy within the established Kakatiya-era Pembarthi design canons, and overall metalwork quality before being individually wrapped in acid-free tissue paper and placed within a custom-moulded polyethylene foam insert that conforms precisely to the object's three-dimensional profile including any protruding decorative elements such as the ornamental finials on temple lamp stands, the flared rims on ceremonial Kalasham water pots, and the sculptural relief elements on deity figure panels where the custom moulded insert provides support at all stress points preventing flexural deformation or surface contact damage during transit. The wrapped object within its custom foam insert is then placed within a rigid outer shipping container constructed from 5-millimetre double-wall corrugated fibreboard with moisture-barrier polyethylene liner bag protecting against humidity condensation that could cause brass surface tarnishing or silver inlay sulphide discolouration during transit through the variable humidity conditions encountered along the Telangana-to-Delhi transport corridor and during international air cargo transit where atmospheric pressure changes and temperature fluctuations at altitude could cause condensation formation within inadequately sealed packaging that would compromise the polished brass surface finish and silver inlay luminosity that define the visual quality and market value of authenticated Pembarthi metal craft objects destined for institutional and private collector acquisition.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>AI Inlay Pattern Verification & Pembarthi Heritage Market Development</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">Artificial intelligence and computational image analysis technologies are being progressively deployed to authenticate Pembarthi metal craft objects and verify the distinctive hand-incised silver inlay patterns, brass alloy composition signatures, and Kakatiya-era design vocabulary elements that distinguish genuine Pembarthi metalwork created by traditional Viswabrahmin artisan families from the growing volume of cast-brass reproductions with electroplated silver-pattern imitations and machine-engraved brass objects that have increasingly appeared in both the domestic Indian handicraft market and international online retail platforms serving the global demand for authenticated Indian metal art. The AI authentication system for Pembarthi metalwork employs ultra-high-resolution scanning at 1200 dots per inch combined with multispectral imaging across the visible and near-infrared spectrum from 400 to 1100 nanometres wavelength range to capture the complete surface topography and metallic composition characteristics of finished Pembarthi objects, analysing the hand-incised groove characteristics including the characteristic groove width variation patterns where the traditional Pembarthi artisan uses a hand-held steel graver to incise each groove individually producing distinctive width variations of plus or minus 0.05 millimetres reflecting the artisan's hand pressure and tool angle that cannot be replicated by the uniform groove width of CNC machine engraving or the painted-on pattern lines of electroplated reproductions, the silver inlay flushness characteristics where hand-hammered silver strips produce a subtly undulating surface profile at the interface between the silver inlay and the surrounding brass substrate that differs from the perfectly flat surface of electroplated silver patterns where the silver is deposited electrolytically onto the brass surface without any mechanical interface, and the overall compositional accuracy within the established Kakatiya-era Pembarthi design canons that define the spatial arrangement of floral motifs, geometric border patterns, figural elements, and decorative dividers according to the specific visual vocabulary maintained across the approximately forty active artisan families in the Pembarthi production region where the National Mission on Cultural Heritage Preservation provides institutional support through GI certification, artisan training programmes, and international market development initiatives connecting the traditional Pembarthi metalworker cooperatives directly with institutional collectors and museum curators worldwide who seek the technical mastery and artistic authenticity of metalwork objects sourced from the hereditary Viswabrahmin artisan communities of Pembarthi village and the surrounding Warangal district metalworking clusters where this extraordinary seven-hundred-year tradition of Telangana temple metal art continues to sustain one of India's most technically demanding and visually luminous metalwork heritage traditions.</p></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
"""

# Verify exactly 253 lines
lines = pembarthi.strip().split('\n')
assert len(lines) == 253, f"Expected 253 lines, got {len(lines)}"

path = os.path.join(BASE, 'pembarthi-metal-craft-telangana-logistics-view.tsx')
with open(path, 'w') as f:
    f.write(pembarthi.strip() + '\n')
print(f"Pembarthi: {len(lines)} lines ✓")
