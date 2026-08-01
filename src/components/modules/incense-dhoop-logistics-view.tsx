import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#78350f', '#92400e', '#b45309', '#d97706', '#f59e0b', '#451a03', '#1c1917', '#fef3c7']
const PRODUCTS = ['Premium Bamboo Stick Incense', 'Masala Dhoop Cone Set', 'Loban Benzoin Resin', 'Chandan Sandalwood Dhoop', 'Rose Petal Agarbatti', 'Camphor Tablet Box', 'Herbal Hawan Samagri', 'Cow Dung Dhoop Cake']
const ARTISANS = ['Karnataka Agarbatti Association KA', 'Mysore Sandal Oil Factory KA', 'Perfume City Kannauj UP', 'Jaipur Incense Guild RJ', 'Varanasi Dhoop Artisans UP', 'Kolkata Fragrance Society WB', 'Mumbai Aromatic Works MH', 'Tirupati Temple Dhoop AP']
const STATUSES = ['IS 19038 Incense Grade A', 'Bamboo Stick Bend QC', 'Fragrance Intensity Test', 'Shrink Wrap Seal Check', 'Dry Room 25-30C Storage', 'Burning Time QC Pass']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-amber-100 text-amber-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="w-24 h-2 bg-amber-200 rounded-full overflow-hidden"><div className="h-full bg-amber-700 rounded-full" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ label, value, size = 80 }: { label: string; value: number; size?: number }) => {
  const r = (size - 12) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#fef3c7" strokeWidth="6" />
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
    id: `IND-${String(offset + i + 1).padStart(4, '0')}`,
    painter: ARTISANS[(offset + i) % ARTISANS.length], ware: PRODUCTS[(offset + i) % PRODUCTS.length],
    status: STATUSES[(offset + i) % STATUSES.length], qty: ri(1, 20, ((offset + i) * 19) % 20) + 1,
    cost: ri(4000, 52000, ((offset + i) * 10707) % 48000) + 4000,
    date: new Date(2024, ((offset + i) % 12), ri(1, 28, (offset + i) % 28)).toISOString().slice(0, 10),
  }))

const incenserecords = [
  { id: 'IND-0001', painter: 'Karnataka Agarbatti Association KA', ware: 'Premium Bamboo Stick Incense', status: 'IS 19038 Incense Grade A', qty: 10, cost: 8000, date: '2024-01-12' },
  { id: 'IND-0002', painter: 'Mysore Sandal Oil Factory KA', ware: 'Masala Dhoop Cone Set', status: 'Bamboo Stick Bend QC', qty: 8, cost: 12000, date: '2024-01-25' },
  { id: 'IND-0003', painter: 'Perfume City Kannauj UP', ware: 'Loban Benzoin Resin', status: 'Fragrance Intensity Test', qty: 5, cost: 36000, date: '2024-02-07' },
  { id: 'IND-0004', painter: 'Jaipur Incense Guild RJ', ware: 'Chandan Sandalwood Dhoop', status: 'Shrink Wrap Seal Check', qty: 12, cost: 6000, date: '2024-02-20' },
  { id: 'IND-0005', painter: 'Varanasi Dhoop Artisans UP', ware: 'Rose Petal Agarbatti', status: 'Dry Room 25-30C Storage', qty: 15, cost: 4500, date: '2024-03-05' },
  { id: 'IND-0006', painter: 'Kolkata Fragrance Society WB', ware: 'Camphor Tablet Box', status: 'Burning Time QC Pass', qty: 6, cost: 20000, date: '2024-03-18' },
  { id: 'IND-0007', painter: 'Mumbai Aromatic Works MH', ware: 'Herbal Hawan Samagri', status: 'IS 19038 Incense Grade A', qty: 20, cost: 4000, date: '2024-03-30' },
  { id: 'IND-0008', painter: 'Tirupati Temple Dhoop AP', ware: 'Cow Dung Dhoop Cake', status: 'Bamboo Stick Bend QC', qty: 25, cost: 3000, date: '2024-04-12' },
  { id: 'IND-0009', painter: 'Karnataka Agarbatti Association KA', ware: 'Premium Bamboo Stick Incense', status: 'Fragrance Intensity Test', qty: 10, cost: 9000, date: '2024-04-25' },
  { id: 'IND-0010', painter: 'Mysore Sandal Oil Factory KA', ware: 'Masala Dhoop Cone Set', status: 'Shrink Wrap Seal Check', qty: 8, cost: 14000, date: '2024-05-08' },
  { id: 'IND-0011', painter: 'Perfume City Kannauj UP', ware: 'Loban Benzoin Resin', status: 'Dry Room 25-30C Storage', qty: 4, cost: 40000, date: '2024-05-21' },
  { id: 'IND-0012', painter: 'Jaipur Incense Guild RJ', ware: 'Chandan Sandalwood Dhoop', status: 'Burning Time QC Pass', qty: 10, cost: 7000, date: '2024-06-03' },
  { id: 'IND-0013', painter: 'Varanasi Dhoop Artisans UP', ware: 'Rose Petal Agarbatti', status: 'IS 19038 Incense Grade A', qty: 15, cost: 5000, date: '2024-06-16' },
  { id: 'IND-0014', painter: 'Kolkata Fragrance Society WB', ware: 'Camphor Tablet Box', status: 'Bamboo Stick Bend QC', qty: 6, cost: 22000, date: '2024-06-29' },
  { id: 'IND-0015', painter: 'Mumbai Aromatic Works MH', ware: 'Herbal Hawan Samagri', status: 'Fragrance Intensity Test', qty: 20, cost: 4500, date: '2024-07-11' },
  { id: 'IND-0016', painter: 'Tirupati Temple Dhoop AP', ware: 'Cow Dung Dhoop Cake', status: 'Shrink Wrap Seal Check', qty: 30, cost: 2800, date: '2024-07-24' },
  { id: 'IND-0017', painter: 'Karnataka Agarbatti Association KA', ware: 'Premium Bamboo Stick Incense', status: 'Dry Room 25-30C Storage', qty: 12, cost: 8500, date: '2024-08-06' },
  { id: 'IND-0018', painter: 'Mysore Sandal Oil Factory KA', ware: 'Masala Dhoop Cone Set', status: 'Burning Time QC Pass', qty: 8, cost: 15000, date: '2024-08-19' },
  { id: 'IND-0019', painter: 'Perfume City Kannauj UP', ware: 'Loban Benzoin Resin', status: 'IS 19038 Incense Grade A', qty: 3, cost: 46000, date: '2024-09-01' },
  { id: 'IND-0020', painter: 'Jaipur Incense Guild RJ', ware: 'Chandan Sandalwood Dhoop', status: 'Bamboo Stick Bend QC', qty: 10, cost: 7500, date: '2024-09-14' },
]

export default function IncenseDhoopLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})

  const allRecords = [...incenserecords, ...genRecords(21), ...genRecords(41)]

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
    <div className="ind-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Incense & Dhoop' }]} />
      <PageHeader title="Incense & Dhoop Logistics" description="Indian incense agarbatti dhoop supply chain with IS 19038 incense grade certification, bamboo stick bend quality control, fragrance intensity testing, shrink wrap seal verification, dry room storage at 25-30C, and burning time quality assurance across 8 production clusters" />
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="bg-amber-100">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <KpiTile label="Total Shipments" value={allRecords.length} />
            <KpiTile label="Active Ware" value={PRODUCTS.length} />
            <KpiTile label="Production Hubs" value={ARTISANS.length} />
            <KpiTile label="Avg Cost" value={`₹${Math.round(allRecords.reduce((s, r) => s + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>
          <div className="grid grid-cols-6 gap-4">
            <HealthRing label="IS 19038" value={92} />
            <HealthRing label="Bamboo" value={85} />
            <HealthRing label="Fragrance" value={88} />
            <HealthRing label="Seal" value={79} />
            <HealthRing label="Dry" value={82} />
            <HealthRing label="Burn" value={91} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Daily Output" value="5000 kg" />
            <ValueTile label="Tradition" value="5000 Year" />
            <ValueTile label="Export Markets" value="120 Nations" />
            <ValueTile label="Annual Revenue" value="₹4800 Cr" />
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
            placeholder="Search incense dhoop shipments..."
          />
          <div className="rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-amber-100">
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
                  <tr key={record.id} className="border-t hover:bg-amber-50/50">
                    <td className="p-3 font-mono text-xs">{record.id}</td>
                    <td className="p-3"><ProductBadge name={record.ware} /></td>
                    <td className="p-3">{record.painter}</td>
                    <td className="p-3"><StatusBadge status={record.status} /></td>
                    <td className="p-3">{record.qty} {['boxes', 'packs', 'kg', 'sets'][parseInt(record.id.slice(4)) % 4]}</td>
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
              <CardHeader><CardTitle>Indian Incense Dhoop — 5000-Year Vedic Agarbatti Heritage</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">Indian incense and dhoop manufacturing represents one of the oldest and most culturally significant aromatic product industries in the world having been continuously practised for over five millennia since the Vedic era when the earliest references to aromatic resin burning and herbal fumigation practices appear in the Rigveda Atharvaveda and subsequent Vedic texts describing the ritual use of fragrant materials including sandalwood agarwood camphor benzoin and various aromatic herbs in Hindu religious ceremonies where the burning of incense materials known as dhupa and the application of sacred fragrant pastes known as gandha formed integral components of Vedic ritual practice establishing the cultural and religious significance of incense in Indian civilisation that persists to the present day where the Indian incense industry has evolved from its ancient Vedic temple ritual origins into a globally significant manufacturing sector producing over five thousand metric tonnes of incense products annually for domestic religious use and international export markets serving diverse cultural spiritual and therapeutic applications across one hundred and twenty nations where the traditional Indian agarbatti incense stick remains the most widely recognised and commercially significant product format accounting for approximately seventy percent of total Indian incense production output followed by dhoop cones and logs at fifteen percent raw aromatic materials including loban benzoin resin and camphor at ten percent and specialised temple and ceremonial products at five percent of the total market where the production geography is concentrated in the southern Indian states of Karnataka Kerala and Tamil Nadu which collectively account for approximately sixty percent of national incense production centred on the Mysore Bengaluru and Madurai manufacturing clusters where the traditional hand-rolled incense stick technique using bamboo stick cores coated with a fragrant charcoal or wood powder paste mixed with natural and synthetic aromatic compounds remains the dominant production methodology for premium quality agarbatti products while the mechanised automatic incense stick dipping and extrusion processes have been increasingly adopted for high-volume economy segment production.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>IS 19038 Incense Standards & Bamboo Stick Quality Control</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The IS 19038 standard for Indian agarbatti and dhoop products establishes the Bureau of Indian Standards quality certification framework for the incense manufacturing sector specifying comprehensive requirements for raw bamboo stick quality including minimum bamboo culm wall thickness of one point five millimetres and maximum moisture content of twelve percent measured in accordance with IS 6871 bamboo moisture testing methodology confirming the bamboo stick core possesses adequate mechanical strength and dimensional stability for the incense manufacturing process where the bamboo sticks must withstand the coating and drying operations without warping cracking or bending that would compromise the burning characteristics and aesthetic quality of the finished incense stick product where the stick straightness tolerance of two millimetres deviation per one hundred millimetre length measured using a calibrated straight edge gauge ensures uniform stick geometry that facilitates consistent machine coating application and produces straight finished incense sticks that meet consumer quality expectations where the bamboo stick bend quality control test applies a calibrated three-point bend load of five hundred grams at the midpoint of each stick verifying the bamboo core flexural strength exceeds the minimum requirement of fifteen megapascals confirming adequate mechanical rigidity for the hand-rolling and machine-dipping coating processes where sticks with insufficient flexural strength are prone to breakage during the coating and packaging operations generating waste and compromising production yield. The fragrance intensity quality control protocol measures the volatile organic compound emission profile using gas chromatography-mass spectrometry methodology at three reference temperature points between twenty-five and forty degrees Celsius confirming the fragrance emission intensity falls within the specified range for the product grade where premium masala incense products must demonstrate sustained fragrance emission above the minimum threshold of forty parts per million total VOC concentration at thirty-five degrees Celsius measured at thirty-minute intervals over a four-hour monitoring period confirming the incense product delivers consistent aromatic performance throughout its rated burning time where the burning time quality control test measures the total combustion duration of each incense stick or dhoop cone under standardised ambient conditions of twenty-five degrees Celsius and fifty percent relative humidity confirming the burning time falls within the specified tolerance of plus or minus ten percent of the rated burning time for the product category where standard agarbatti sticks are rated at thirty to forty-five minutes masala agarbatti at forty-five to sixty minutes and dhoop cones at twenty to thirty minutes burning duration.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Shrink Wrap Seal & Dry Room Storage for Incense Transit</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">Shrink wrap polyethylene film packaging with hermetic seal integrity verification and moisture-barrier inner liner has been specifically developed for the Indian incense agarbatti and dhoop product logistics supply chain to protect the hygroscopic charcoal and wood powder incense cores the natural aromatic compound formulations and the fragile bamboo stick assemblies from the moisture contamination fragrance evaporation and mechanical breakage hazards encountered during transit from the southern Indian manufacturing centres in Karnataka Kerala Tamil Nadu and Uttar Pradesh to domestic retail distribution points across India and international export destinations serving the global demand for Indian incense products where the agarbatti incense sticks are particularly susceptible to moisture absorption during transit through high-humidity coastal and monsoon-affected regions where the charcoal-based incense core material can absorb atmospheric moisture causing swelling of the incense coating layer cracking of the fragile bamboo stick core and premature ignition or mould growth that would render the incense product unsuitable for sale. The shrink wrap packaging specification utilises forty-micron low-density polyethylene film with water vapour transmission rate not exceeding five grams per square metre per day measured at thirty-eight degrees Celsius and ninety percent relative humidity in accordance with IS 10691 moisture vapour transmission testing methodology confirming the packaging film provides adequate moisture barrier protection during the expected transit and storage cycle where the shrink wrap film is applied at calibrated temperature between one hundred forty and one hundred sixty degrees Celsius producing uniform film conformance to the incense pack surface geometry without hot-spot thinning or perforation that could compromise the moisture barrier integrity of the package where the hermetic seal integrity verification test applies a vacuum differential of negative twenty kilopascals to each sealed package confirming zero air leakage detected by bubble emission testing in a calibrated water bath confirming the complete hermetic seal that prevents atmospheric moisture ingress during transit and extended storage periods.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Dry Storage Climate Control & Indian Incense Heritage Market</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">Dry room storage facilities with temperature and humidity control systems have been established across the Indian incense supply chain distribution network to maintain the optimal storage environment for agarbatti dhoop cones and raw aromatic materials where the hygroscopic nature of charcoal-based incense products natural resin materials including loban benzoin and camphor and the volatile aromatic compound formulations used in premium masala incense production require precisely controlled storage conditions to prevent moisture absorption fragrance evaporation and material degradation that would compromise product quality and shelf life during the distribution cycle from manufacturing to retail point of sale where the dry room storage specification maintains ambient temperature within the range of twenty-five to thirty degrees Celsius with relative humidity controlled between forty and fifty-five percent measured by calibrated digital hygrometers with continuous environmental monitoring and automated dehumidification systems that activate when relative humidity exceeds the fifty-five percent threshold alerting warehouse personnel to potential humidity excursions that could affect product quality where the storage facility employs sealed and insulated storage chambers with moisture-barrier wall and ceiling construction preventing ambient humidity infiltration from the external environment particularly critical during the Indian monsoon season when ambient relative humidity routinely exceeds eighty percent in major incense production and distribution centres including Bengaluru Mysore Kannauj and Kolkata where the uncontrolled humidity exposure during the monsoon months of June through September represents the highest risk period for incense product quality degradation in the supply chain where the Indian incense heritage market development initiative led by the All India Fragrance and Flavour Association in collaboration with the Karnataka State Agarbatti Manufacturers Association and the Khadi and Village Industries Commission has established quality certification and market access frameworks connecting traditional incense artisans and small-scale manufacturers with institutional buyers including major temple trusts and religious institutions government emporiums export trading houses and international retail chains specialising in ethnic and spiritual products where the IS 19038 certification provides the quality assurance framework needed to access premium domestic and international market channels for certified Indian incense products.</p></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}



