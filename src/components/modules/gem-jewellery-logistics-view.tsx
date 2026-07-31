import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#7c2d12', '#9a3412', '#c2410c', '#ea580c', '#f97316', '#431407', '#7c2d12', '#fed7aa']
const PRODUCTS = ['Kundan Polki Necklace Set', 'Jadau Rajasthani Bridal Set', 'Temple Gold jewellery Chennai', 'Kundan Meenakari Bangle Set', 'Navratna Nine-Gem Pendant', 'Polki Diamond Chandbali Earrings', 'Meenakari Enamel Pendant Set', 'Kundan Pearl Rani Haar']
const ARTISANS = ['Rajasthan Kundan Artisans Jaipur', 'Surat Diamond Cutting Guild GJ', 'Mumbai Jewellery Exporters MH', 'Kolkata Gem Palace WB', 'Chennai Temple Jewellery TN', 'Jaipur Jadau Heritage Cluster RJ', 'Trichy Diamond Workers TN', 'Ahmedabad Zari Craftsmen GJ']
const STATUSES = ['BIS Hallmark Verified', 'GJEPC Certified', 'Diamond Grading Done', 'Tamper-Proof Vault Box', 'Refrigerator Vault Storage', 'Karat Purity XRF Test']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-orange-100 text-orange-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="w-24 h-2 bg-orange-200 rounded-full overflow-hidden"><div className="h-full bg-orange-700 rounded-full" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ label, value, size = 80 }: { label: string; value: number; size?: number }) => {
  const r = (size - 12) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#fed7aa" strokeWidth="6" />
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
    id: `GJM-${String(offset + i + 1).padStart(4, '0')}`,
    painter: ARTISANS[(offset + i) % ARTISANS.length], ware: PRODUCTS[(offset + i) % PRODUCTS.length],
    status: STATUSES[(offset + i) % STATUSES.length], qty: ri(1, 20, ((offset + i) * 19) % 20) + 1,
    cost: ri(4000, 52000, ((offset + i) * 10707) % 48000) + 4000,
    date: new Date(2024, ((offset + i) % 12), ri(1, 28, (offset + i) % 28)).toISOString().slice(0, 10),
  }))

const gemrecords = [
  { id: 'GJM-0001', painter: 'Rajasthan Kundan Artisans Jaipur', ware: 'Kundan Polki Necklace Set', status: 'BIS Hallmark Verified', qty: 3, cost: 48000, date: '2024-01-15' },
  { id: 'GJM-0002', painter: 'Surat Diamond Cutting Guild GJ', ware: 'Jadau Rajasthani Bridal Set', status: 'GJEPC Certified', qty: 5, cost: 36000, date: '2024-01-28' },
  { id: 'GJM-0003', painter: 'Mumbai Jewellery Exporters MH', ware: 'Temple Gold jewellery Chennai', status: 'Diamond Grading Done', qty: 2, cost: 52000, date: '2024-02-10' },
  { id: 'GJM-0004', painter: 'Kolkata Gem Palace WB', ware: 'Kundan Meenakari Bangle Set', status: 'Tamper-Proof Vault Box', qty: 7, cost: 22000, date: '2024-02-22' },
  { id: 'GJM-0005', painter: 'Chennai Temple Jewellery TN', ware: 'Navratna Nine-Gem Pendant', status: 'Refrigerator Vault Storage', qty: 4, cost: 44000, date: '2024-03-08' },
  { id: 'GJM-0006', painter: 'Jaipur Jadau Heritage Cluster RJ', ware: 'Polki Diamond Chandbali Earrings', status: 'Karat Purity XRF Test', qty: 6, cost: 28000, date: '2024-03-20' },
  { id: 'GJM-0007', painter: 'Trichy Diamond Workers TN', ware: 'Meenakari Enamel Pendant Set', status: 'BIS Hallmark Verified', qty: 2, cost: 50000, date: '2024-04-03' },
  { id: 'GJM-0008', painter: 'Ahmedabad Zari Craftsmen GJ', ware: 'Kundan Pearl Rani Haar', status: 'GJEPC Certified', qty: 8, cost: 16000, date: '2024-04-16' },
  { id: 'GJM-0009', painter: 'Rajasthan Kundan Artisans Jaipur', ware: 'Jadau Rajasthani Bridal Set', status: 'Diamond Grading Done', qty: 4, cost: 40000, date: '2024-04-28' },
  { id: 'GJM-0010', painter: 'Surat Diamond Cutting Guild GJ', ware: 'Kundan Polki Necklace Set', status: 'Tamper-Proof Vault Box', qty: 3, cost: 48000, date: '2024-05-10' },
  { id: 'GJM-0011', painter: 'Mumbai Jewellery Exporters MH', ware: 'Temple Gold jewellery Chennai', status: 'Refrigerator Vault Storage', qty: 5, cost: 32000, date: '2024-05-23' },
  { id: 'GJM-0012', painter: 'Kolkata Gem Palace WB', ware: 'Kundan Meenakari Bangle Set', status: 'Karat Purity XRF Test', qty: 6, cost: 20000, date: '2024-06-05' },
  { id: 'GJM-0013', painter: 'Chennai Temple Jewellery TN', ware: 'Navratna Nine-Gem Pendant', status: 'BIS Hallmark Verified', qty: 3, cost: 46000, date: '2024-06-18' },
  { id: 'GJM-0014', painter: 'Jaipur Jadau Heritage Cluster RJ', ware: 'Polki Diamond Chandbali Earrings', status: 'GJEPC Certified', qty: 7, cost: 24000, date: '2024-07-01' },
  { id: 'GJM-0015', painter: 'Trichy Diamond Workers TN', ware: 'Meenakari Enamel Pendant Set', status: 'Diamond Grading Done', qty: 2, cost: 52000, date: '2024-07-14' },
  { id: 'GJM-0016', painter: 'Ahmedabad Zari Craftsmen GJ', ware: 'Kundan Pearl Rani Haar', status: 'Tamper-Proof Vault Box', qty: 10, cost: 12000, date: '2024-07-26' },
  { id: 'GJM-0017', painter: 'Rajasthan Kundan Artisans Jaipur', ware: 'Kundan Polki Necklace Set', status: 'Refrigerator Vault Storage', qty: 4, cost: 42000, date: '2024-08-08' },
  { id: 'GJM-0018', painter: 'Surat Diamond Cutting Guild GJ', ware: 'Jadau Rajasthani Bridal Set', status: 'Karat Purity XRF Test', qty: 5, cost: 30000, date: '2024-08-20' },
  { id: 'GJM-0019', painter: 'Mumbai Jewellery Exporters MH', ware: 'Temple Gold jewellery Chennai', status: 'BIS Hallmark Verified', qty: 3, cost: 50000, date: '2024-09-02' },
  { id: 'GJM-0020', painter: 'Kolkata Gem Palace WB', ware: 'Kundan Meenakari Bangle Set', status: 'GJEPC Certified', qty: 8, cost: 18000, date: '2024-09-14' },
]

export default function GemJewelleryLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})

  const allRecords = [...gemrecords, ...genRecords(21), ...genRecords(41)]

  const filteredRecords = useMemo(() => {
    if (!searchQuery && Object.keys(activeFilters).every(k => !activeFilters[k].length)) return allRecords
    const sq = searchQuery.toLowerCase()
    return allRecords.filter(r => { if (sq && !r.id.toLowerCase().includes(sq) && !r.ware.toLowerCase().includes(sq)) return false; return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string)); })
  }, [searchQuery, activeFilters, allRecords])

  const filterGroups = [
    { key: 'ware', label: 'Ware', options: PRODUCTS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.ware === p).length })) },
    { key: 'painter', label: 'Painter', options: ARTISANS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.painter === p).length })) },
  ]

  const trendData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m, i) => ({ month: m, shipments: ri(4, 20, allRecords.length * 0.10 + i * 3) }))
  const artisanChart = ARTISANS.map(p => ({ name: p.split(' ').slice(0, 2).join(' '), volume: allRecords.filter(r => r.painter === p).reduce((s, r) => s + r.qty, 0) }))
  const statusPie = STATUSES.map(s => ({ name: s, value: allRecords.filter(r => r.status === s).length }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="gjm-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Gem Jewellery' }]} />
      <PageHeader title="Gem Jewellery Logistics" description="India gem jewellery supply chain with BIS hallmark verification, GJEPC certification, diamond grading protocols, tamper-proof vault box packaging, Refrigerator vault storage, and karat purity XRF testing across 8 jewellery centres including Jaipur Kundan, Surat Diamond, and Mumbai Export" />
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="bg-orange-100">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <KpiTile label="Total Shipments" value={allRecords.length} />
            <KpiTile label="Active Ware" value={PRODUCTS.length} />
            <KpiTile label="Jewellery Centres" value={ARTISANS.length} />
            <KpiTile label="Avg Cost" value={`₹${Math.round(allRecords.reduce((s, r) => s + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>
          <div className="grid grid-cols-6 gap-4">
            <HealthRing label="BIS" value={96} />
            <HealthRing label="GJEPC" value={93} />
            <HealthRing label="Diamond" value={91} />
            <HealthRing label="Vault" value={88} />
            <HealthRing label="Storage" value={95} />
            <HealthRing label="XRF" value={94} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="India Gems Export" value="₹2.8 Lakh Cr" />
            <ValueTile label="Gold Holdings" value="25,000 Ton" />
            <ValueTile label="Artisan Workforce" value="5 Million+" />
            <ValueTile label="Annual Growth" value="+12.4%" />
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
            placeholder="Search gem jewellery shipments..."
          />
          <div className="rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-orange-100">
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
                  <tr key={record.id} className="border-t hover:bg-orange-50/50">
                    <td className="p-3 font-mono text-xs">{record.id}</td>
                    <td className="p-3"><ProductBadge name={record.ware} /></td>
                    <td className="p-3">{record.painter}</td>
                    <td className="p-3"><StatusBadge status={record.status} /></td>
                    <td className="p-3">{record.qty} {['sets', 'pieces', 'necklaces', 'bangles'][parseInt(record.id.slice(4)) % 4]}</td>
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
              <CardHeader><CardTitle>Jewellery Centre Volume</CardTitle></CardHeader>
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
              <CardHeader><CardTitle>India Gem Jewellery — USD 75 Billion Heritage Craft Ecosystem</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">India gem jewellery supply chain represents the world's largest jewellery manufacturing and consumption ecosystem with annual domestic and export revenue exceeding seventy-five billion US dollars employing over five million artisans goldsmiths diamond cutters and jewellery designers across eight major jewellery manufacturing centres where Jaipur in Rajasthan is globally renowned as the premier centre for Kundan and Jadau jewellery where master artisans set uncut diamonds Polki and glass-foil backed gemstones into elaborately crafted twenty-two karat gold frames using the traditional Kundan technique of inserting thin gold foil strips between the gemstone and the gold bezel creating a jewel-encrusted surface of extraordinary visual brilliance that has been patronised by Rajasthani royal families for over four hundred years where Surat in Gujarat processes approximately ninety percent of the world's diamond rough output with over four lakh diamond cutting and polishing workers operating sophisticated laser cutting and automated bruting machinery transforming rough diamonds into polished brilliant-cut gemstones that feed the global diamond jewellery supply chain where Mumbai serves as India's primary jewellery export hub with the Bharat Diamond Bourse being the world's largest diamond exchange facilitating the trade of polished diamonds gemstones and finished jewellery to international buyers across eighty-five countries where Chennai and Trichy in Tamil Nadu are renowned centres for South Indian temple jewellery tradition crafting elaborate gold ornaments inspired by the classical temple architecture motifs of the Pallava and Chola dynasties where Kolkata in West Bengal maintains the heritage of the legendary Kundan and Meenakari jewellery tradition patronised by the Nawabi courts of Lucknow and Murshidabad where Ahmedabad in Gujarat contributes specialised Zari metal thread and filigree work used in contemporary Indian bridal jewellery design where the India gem jewellery supply chain logistics involves managing the flow of precious raw materials including gold bullion imported through designated nominated agencies approved by the Reserve Bank of India rough diamonds imported through authorised diamond trading hubs certified gemstones sourced from international gem markets and precious metal consumables including silver platinum and palladium through a secure logistics infrastructure featuring armoured transit vehicles GPS-tracked high-value shipments and bonded warehouse facilities that maintain the chain-of-custody documentation required for BIS hallmark certification and GJEPC export compliance across the entire jewellery supply chain from raw material procurement to finished product distribution to retail jewellery showrooms and international buyers.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>BIS Hallmark & GJEPC Certification Quality Framework</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The Bureau of Indian Standards BIS hallmarking framework for gold jewellery and artefacts establishes the mandatory quality assurance certification system under the BIS Hallmarking Act twenty sixteen requiring every piece of gold jewellery sold in India to bear the BIS hallmark certifying the karat purity fineness of the gold metal confirming the gold content matches the declared karat value within the tolerance limits specified in IS 1417 gold jewellery standards where the BIS hallmark comprises the BIS logo the assaying and hallmarking centre mark the jeweller identification mark and the karat purity fineness number such as twenty-two karat gold designated as 22K916 confirming minimum gold content of ninety-one point six percent by weight where the BIS certified assaying centres perform karat purity testing using X-ray fluorescence XRF spectroscopy providing non-destructive elemental analysis of the jewellery metal composition confirming the gold content silver content copper content and any other alloying elements present in the jewellery piece within the tolerance limits specified in IS 1417 with the XRF measurement accuracy of plus or minus zero point one karat for gold purity confirming the hallmark accuracy for twenty-two karat gold jewellery falls between ninety-one point five and ninety-one point seven percent gold content by weight where the Gem Jewellery Export Promotion Council GJEPC certification provides the export quality assurance framework for Indian gem and jewellery products destined for international markets requiring compliance with the Kimberley Process Certification Scheme KPCS for diamond shipments certifying that rough diamonds have been sourced from conflict-free origins through documented chain-of-custody procedures from mine to export point where the GJEPC certification includes diamond grading reports issued by GJEPC-certified gemmological laboratories providing the four Cs assessment of cut colour clarity and carat weight for polished diamonds in accordance with international diamond grading standards established by the Gemmological Institute of America GIA and the International Diamond Council IDC where the BIS hallmark verification process for high-value jewellery sets weighing over fifty grams requires individual hallmarking of each component piece within the set with the BIS hallmark stamped on the heaviest component while lighter components receive a collective set hallmark with total weight and karat purity declaration verified through XRF analysis confirming batch-level karat purity consistency across all components of the jewellery set ensuring consumer confidence in the declared gold purity of Indian jewellery products through the rigorous BIS hallmark certification framework that is recognised as one of the most comprehensive mandatory jewellery hallmarking systems in the global jewellery industry.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Tamper-Proof Vault Box for High-Value Jewellery Transit</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">Tamper-proof vault box packaging with multi-layer security seals GPS real-time tracking and armoured vehicle escort has been specifically designed for the Indian gem jewellery supply chain to protect high-value jewellery consignments valued at lakhs and crores of rupees from theft pilferage and unauthorised access during transit from jewellery manufacturing centres to retail showrooms exhibition venues and export shipping terminals across India where the vault box specification utilises twelve gauge mild steel construction with minimum wall thickness of two millimetres providing drill resistance measured as minimum drilling time of fifteen minutes with standard HSS drill bits in accordance with IS 3648 safe construction testing methodology ensuring the vault box provides physical resistance against forced entry attempts during transit where the vault box locking system employs dual-key seven-lever tumbler locks requiring two separate keys held by different authorised personnel to open the vault box preventing any single individual from gaining unauthorised access to the high-value jewellery consignment where each vault box is sealed with three independent tamper-evident security seals including one electronic RFID-enabled seal that logs the date time and location of every seal status check to a central security monitoring system providing continuous chain-of-custody visibility throughout the transit cycle where the GPS tracking device installed within each vault box transmits real-time location data at sixty-second intervals to the jewellery logistics command centre confirming the vault box is following the authorised transit route and enabling immediate response to any unauthorised route deviation or prolonged stationary period that could indicate a security breach where the armoured vehicle escort specification requires minimum ballistic protection level of BR6 rated to resist attack from nine millimetre handgun and five point five six millimetre rifle ammunition measured in accordance with EN 1522 European standard for armoured vehicle protection ensuring the vehicle provides ballistic resistance sufficient to protect the high-value jewellery consignment from armed robbery attempts during road transit where the vault box interior uses velvet-lined cushioned compartments with individual soft pouch packaging for each jewellery piece preventing metal-to-metal contact scratching and gemstone abrasion damage during the vibration and shock of road transit ensuring each high-value jewellery piece arrives at its destination in pristine condition maintaining the display quality and market value required for retail presentation and exhibition display of Indian gem jewellery products.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Refrigerator Vault Storage & Indian Jewellery Market Growth</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">Refrigerator vault storage with multi-layer security access control and climate-regulated internal environment has been established for the Indian gem jewellery supply chain to provide the highest level of physical security and environmental protection for high-value jewellery inventory awaiting distribution to retail showrooms exhibition venues and international export shipments where the Refrigerator vault storage specification maintains internal temperature between eighteen and twenty-two degrees Celsius with relative humidity between forty and fifty percent providing a climate-controlled environment that prevents tarnishing of silver jewellery components oxidation of copper alloy findings and degradation of organic materials such as pearl thread and silk cord used in traditional Indian stringed jewellery where the vault access control system requires biometric authentication combining fingerprint recognition and iris scanning with dual-authorisation entry protocol requiring two authorised personnel to simultaneously present valid biometric credentials before the vault door releases preventing any single individual from gaining unauthorised access to the high-value jewellery inventory stored within the vault where the vault security infrastructure includes multi-layer access control with mantrap entry vestibule requiring sequential authentication at two separate access points before reaching the jewellery storage area with each access event logged to the central security monitoring system with timestamp video recording and personnel identification providing complete audit trail documentation for insurance compliance and regulatory review purposes where the vault storage racking system uses individual jewellery compartment lockers constructed from sixteen gauge steel with individual tamper-evident seals and RFID-enabled inventory tags providing real-time inventory visibility and automated discrepancy alerts when any jewellery item is moved from its designated storage location without proper authorisation. The Indian jewellery market growth trajectory driven by rising household incomes increasing wedding expenditure growth expanding middle-class consumer base and government initiatives promoting hallmarking and consumer protection through the BIS mandatory hallmarking programme has positioned India as the fastest-growing major jewellery market globally with annual growth exceeding twelve percent driven by the cultural significance of gold jewellery in Indian weddings festivals and investment portfolios where gold jewellery serves simultaneously as adornment cultural symbol and financial investment for Indian households with cumulative private gold holdings estimated at over twenty-five thousand tonnes representing the largest private gold reserves of any nation providing a massive domestic market foundation for the Indian gem jewellery supply chain that continues to expand both in terms of domestic retail penetration and international export growth across major markets including the United States United Arab Emirates United Kingdom and East Asian countries.</p></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}



