import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#7c3aed', '#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe', '#6d28d9', '#5b21b6', '#ede9fe']
const PRODUCTS = ['Organic Cotton Yardage', 'Silk Blend Fabric Roll', 'Denim Twill Batch', 'Linen Flax Panel', 'Polyester Knit Spool', 'Wool Worsted Lot', 'Rayon Viscose Bolt', 'Chiffon Georgette Roll']
const ARTISANS = ['Tirupur Knitwear Cluster TN', 'Bhilwara Textile Mills RJ', 'Surat Polyester Hub GJ', 'Erode Handloom Society TN', 'Ichalkaranji Weaving MH', 'Ludhiana Wool Hosiery PB', 'Bhiwani Cotton Complex HR', 'Kanchipuram Silk Guild TN']
const STATUSES = ['IS 16793 Textile Grade A', 'Fibre Tensile Strength QC', 'Color Fastness Wash Test', 'Shrinkage Ratio Check', 'Moisture Regain Verify', 'Fabric Grammage Confirm']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-violet-100 text-violet-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="w-24 h-2 bg-violet-200 rounded-full overflow-hidden"><div className="h-full bg-violet-700 rounded-full" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ label, value, size = 80 }: { label: string; value: number; size?: number }) => {
  const r = (size - 12) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#ede9fe" strokeWidth="6" />
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
    id: `TXL-${String(offset + i + 1).padStart(4, '0')}`,
    mill: ARTISANS[(offset + i) % ARTISANS.length], fabric: PRODUCTS[(offset + i) % PRODUCTS.length],
    status: STATUSES[(offset + i) % STATUSES.length], qty: ri(1, 20, ((offset + i) * 19) % 20) + 1,
    cost: ri(5000, 65000, ((offset + i) * 11107) % 60000) + 5000,
    date: new Date(2024, ((offset + i) % 12), ri(1, 28, (offset + i) % 28)).toISOString().slice(0, 10),
  }))

const textilerecords = [
  { id: 'TXL-0001', mill: 'Tirupur Knitwear Cluster TN', fabric: 'Organic Cotton Yardage', status: 'IS 16793 Textile Grade A', qty: 12, cost: 58000, date: '2024-01-15' },
  { id: 'TXL-0002', mill: 'Bhilwara Textile Mills RJ', fabric: 'Silk Blend Fabric Roll', status: 'Fibre Tensile Strength QC', qty: 8, cost: 42000, date: '2024-01-28' },
  { id: 'TXL-0003', mill: 'Surat Polyester Hub GJ', fabric: 'Denim Twill Batch', status: 'Color Fastness Wash Test', qty: 15, cost: 62000, date: '2024-02-10' },
  { id: 'TXL-0004', mill: 'Erode Handloom Society TN', fabric: 'Linen Flax Panel', status: 'Shrinkage Ratio Check', qty: 6, cost: 35000, date: '2024-02-22' },
  { id: 'TXL-0005', mill: 'Ichalkaranji Weaving MH', fabric: 'Polyester Knit Spool', status: 'Moisture Regain Verify', qty: 10, cost: 48000, date: '2024-03-08' },
  { id: 'TXL-0006', mill: 'Ludhiana Wool Hosiery PB', fabric: 'Wool Worsted Lot', status: 'Fabric Grammage Confirm', qty: 4, cost: 55000, date: '2024-03-20' },
  { id: 'TXL-0007', mill: 'Bhiwani Cotton Complex HR', fabric: 'Rayon Viscose Bolt', status: 'IS 16793 Textile Grade A', qty: 9, cost: 60000, date: '2024-04-03' },
  { id: 'TXL-0008', mill: 'Kanchipuram Silk Guild TN', fabric: 'Chiffon Georgette Roll', status: 'Fibre Tensile Strength QC', qty: 3, cost: 65000, date: '2024-04-16' },
  { id: 'TXL-0009', mill: 'Tirupur Knitwear Cluster TN', fabric: 'Silk Blend Fabric Roll', status: 'Color Fastness Wash Test', qty: 7, cost: 40000, date: '2024-04-28' },
  { id: 'TXL-0010', mill: 'Bhilwara Textile Mills RJ', fabric: 'Organic Cotton Yardage', status: 'Shrinkage Ratio Check', qty: 11, cost: 52000, date: '2024-05-10' },
  { id: 'TXL-0011', mill: 'Surat Polyester Hub GJ', fabric: 'Denim Twill Batch', status: 'Moisture Regain Verify', qty: 14, cost: 58000, date: '2024-05-23' },
  { id: 'TXL-0012', mill: 'Erode Handloom Society TN', fabric: 'Linen Flax Panel', status: 'Fabric Grammage Confirm', qty: 5, cost: 38000, date: '2024-06-05' },
  { id: 'TXL-0013', mill: 'Ichalkaranji Weaving MH', fabric: 'Polyester Knit Spool', status: 'IS 16793 Textile Grade A', qty: 8, cost: 45000, date: '2024-06-18' },
  { id: 'TXL-0014', mill: 'Ludhiana Wool Hosiery PB', fabric: 'Wool Worsted Lot', status: 'Fibre Tensile Strength QC', qty: 3, cost: 62000, date: '2024-07-01' },
  { id: 'TXL-0015', mill: 'Bhiwani Cotton Complex HR', fabric: 'Rayon Viscose Bolt', status: 'Color Fastness Wash Test', qty: 10, cost: 50000, date: '2024-07-14' },
  { id: 'TXL-0016', mill: 'Kanchipuram Silk Guild TN', fabric: 'Chiffon Georgette Roll', status: 'Shrinkage Ratio Check', qty: 6, cost: 55000, date: '2024-07-26' },
  { id: 'TXL-0017', mill: 'Tirupur Knitwear Cluster TN', fabric: 'Organic Cotton Yardage', status: 'Moisture Regain Verify', qty: 13, cost: 48000, date: '2024-08-08' },
  { id: 'TXL-0018', mill: 'Bhilwara Textile Mills RJ', fabric: 'Silk Blend Fabric Roll', status: 'Fabric Grammage Confirm', qty: 7, cost: 42000, date: '2024-08-20' },
  { id: 'TXL-0019', mill: 'Surat Polyester Hub GJ', fabric: 'Denim Twill Batch', status: 'IS 16793 Textile Grade A', qty: 16, cost: 60000, date: '2024-09-02' },
  { id: 'TXL-0020', mill: 'Erode Handloom Society TN', fabric: 'Linen Flax Panel', status: 'Fibre Tensile Strength QC', qty: 4, cost: 36000, date: '2024-09-14' },
]

export default function TextileApparelLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})

  const allRecords = [...textilerecords, ...genRecords(21), ...genRecords(41)]

  const filteredRecords = useMemo(() => {
    if (!searchQuery && Object.keys(activeFilters).every(k => !activeFilters[k].length)) return allRecords
    const sq = searchQuery.toLowerCase()
    return allRecords.filter(r => { if (sq && !r.id.toLowerCase().includes(sq) && !r.fabric.toLowerCase().includes(sq)) return false; return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string)); })
  }, [searchQuery, activeFilters, allRecords])

  const filterGroups = [
    { key: 'fabric', label: 'Fabric', options: PRODUCTS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.fabric === p).length })) },
    { key: 'mill', label: 'Mill', options: ARTISANS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.mill === p).length })) },
  ]

  const trendData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m, i) => ({ month: m, shipments: ri(4, 20, allRecords.length * 0.10 + i * 3) }))
  const millChart = ARTISANS.map(p => ({ name: p.split(' ').slice(0, 2).join(' '), volume: allRecords.filter(r => r.mill === p).reduce((s, r) => s + r.qty, 0) }))
  const statusPie = STATUSES.map(s => ({ name: s, value: allRecords.filter(r => r.status === s).length }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="txa-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Textile Apparel' }]} />
      <PageHeader title="Textile Apparel Logistics" description="Indian textile apparel supply chain with IS 16793 textile grade certification, fibre tensile strength testing, color fastness wash verification, shrinkage ratio analysis, moisture regain measurement, and fabric grammage confirmation across 8 major textile clusters in Tirupur, Bhilwara, Surat, and Ludhiana" />
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="bg-violet-100">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <KpiTile label="Total Shipments" value={allRecords.length} />
            <KpiTile label="Fabric Types" value={PRODUCTS.length} />
            <KpiTile label="Textile Clusters" value={ARTISANS.length} />
            <KpiTile label="Avg Cost" value={`₹${Math.round(allRecords.reduce((s, r) => s + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>
          <div className="grid grid-cols-6 gap-4">
            <HealthRing label="Grade" value={93} />
            <HealthRing label="Tensile" value={88} />
            <HealthRing label="Fastness" value={86} />
            <HealthRing label="Shrink" value={91} />
            <HealthRing label="Moisture" value={84} />
            <HealthRing label="Grammage" value={89} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="India Rank" value="2nd Global" />
            <ValueTile label="Annual Output" value="₹12.4 Lakh Cr" />
            <ValueTile label="Export Markets" value="120 Countries" />
            <ValueTile label="Employment" value="45 Million" />
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
            placeholder="Search textile apparel shipments..."
          />
          <div className="rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-violet-100">
                <tr>
                  <th className="p-3 text-left font-medium">ID</th>
                  <th className="p-3 text-left font-medium">Fabric</th>
                  <th className="p-3 text-left font-medium">Mill</th>
                  <th className="p-3 text-left font-medium">Status</th>
                  <th className="p-3 text-left font-medium">Qty</th>
                  <th className="p-3 text-left font-medium">Cost</th>
                  <th className="p-3 text-left font-medium">Cost Bar</th>
                  <th className="p-3 text-left font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map(record => (
                  <tr key={record.id} className="border-t hover:bg-violet-50/50">
                    <td className="p-3 font-mono text-xs">{record.id}</td>
                    <td className="p-3"><ProductBadge name={record.fabric} /></td>
                    <td className="p-3">{record.mill}</td>
                    <td className="p-3"><StatusBadge status={record.status} /></td>
                    <td className="p-3">{record.qty} {['rolls', 'batches', 'yards', 'bolts'][parseInt(record.id.slice(4)) % 4]}</td>
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
              <CardHeader><CardTitle>Mill Volume</CardTitle></CardHeader>
              <CardContent>
                <BarChart width={500} height={300} data={millChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="volume" fill={COLORS[0]}>
                    {millChart.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
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
              <CardHeader><CardTitle>India Textile Industry — USD 190 Billion Global Supply Chain Ecosystem</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The Indian textile and apparel industry represents one of the oldest and most economically significant manufacturing sectors of the Indian economy having a continuous manufacturing heritage spanning over five thousand years from the ancient Indus Valley civilisation cotton weaving traditions through the medieval Mughal court textile workshops to the modern industrial textile clusters that position India as the second largest textile manufacturer globally with an annual industry output valued at approximately one hundred and ninety billion US dollars employing over forty-five million workers directly and an additional one hundred million workers indirectly across the complete textile value chain from cotton cultivation ginning and spinning through weaving knitting processing dyeing printing and finishing to garment manufacturing and retail distribution where the Indian textile industry encompasses an extraordinary range of fibre materials including cotton silk wool jute linen and synthetic fibres produced across eight major textile clusters including Tirupur in Tamil Nadu recognised as the largest knitwear production hub in Asia with over ten thousand knitting units producing cotton knitwear garments for global export brands Bhilwara in Rajasthan operating as the largest synthetic textile manufacturing centre in India with integrated spinning weaving and processing mills producing polyester viscose and blended fabrics Surat in Gujarat functioning as the largest man-made fibre textile hub in India processing over forty percent of India's total polyester filament yarn production and Ludhiana in Punjab serving as the primary woollen hosiery and knitwear production centre for winter apparel serving the domestic and export markets where the Indian textile supply chain logistics operations involve the movement of raw fibre materials finished fabrics and garment products across an extensive network of textile mills processing units garment factories warehouses and distribution centres spanning the entire geographic extent of India from cotton ginning facilities in Maharashtra and Gujarat through processing mills in Tamil Nadu and Rajasthan to garment manufacturing units in the National Capital Region and export consolidation centres at major seaports including Chennai Mundra Kandla and Nhava Sheva handling annual textile export volumes valued at approximately forty billion US dollars creating complex multi-modal logistics requirements that demand sophisticated supply chain management systems for inventory tracking quality assurance compliance documentation and timely delivery coordination across the complete textile and apparel value chain.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>IS 16793 Textile Grade & Fibre Tensile Strength Quality Framework</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The IS 16793 textile grade certification and fibre tensile strength quality framework establishes the primary national standard for textile fabric quality assessment in India providing a comprehensive classification system that grades textile fabrics into five quality grades from Grade A premium export quality through Grade B standard quality Grade C commercial quality Grade D utility quality to Grade E reject quality based on a multi-parameter evaluation protocol that measures fibre tensile strength colour fastness shrinkage ratio moisture regain and fabric grammage against the quantitative thresholds specified in the IS 16793 standard published by the Bureau of Indian Standards where the fibre tensile strength quality test measures the maximum breaking force of the textile fabric specimen using a universal testing machine in accordance with IS 1963 strip method testing methodology confirming minimum tensile strength of one hundred and fifty Newtons per centimetre width for Grade A cotton fabrics and minimum two hundred Newtons per centimetre width for Grade A polyester blend fabrics ensuring the textile fabric maintains adequate mechanical strength to withstand the stresses of garment manufacturing cutting sewing and wearing without fabric rupture seam failure or structural degradation during the complete garment lifecycle where the colour fastness wash test evaluates the resistance of the textile dye to colour transfer and fading during standardised washing procedures conducted in accordance with IS 3361 colour fastness testing methodology using a calibrated laboratory washing machine at sixty degrees Celsius for thirty minutes with specified detergent concentration and liquor ratio measuring colour change on a five-point grey scale and staining on adjacent fabric on a separate four-point staining scale with minimum acceptable ratings of Grade four for colour change and Grade three for staining for Grade A textile fabrics ensuring the dyed textile fabric maintains its original colour appearance through repeated washing cycles without unacceptable fading or colour bleeding onto adjacent garment panels during consumer use where the shrinkage ratio check measures the dimensional change of the textile fabric after standardised washing and drying procedures confirming maximum shrinkage of three percent in warp direction and two percent in weft direction for Grade A cotton fabrics and two percent in both directions for Grade A synthetic fabrics ensuring garment manufacturers can accurately predict the dimensional behaviour of the textile fabric during post-manufacturing washing and finishing operations enabling precise pattern cutting and garment construction that accommodates the expected dimensional changes of the textile substrate.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Moisture Regain Measurement & Fabric Grammage Verification</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The moisture regain measurement and fabric grammage verification protocols form essential components of the Indian textile quality assurance framework ensuring that textile fabrics meet the precise physical property specifications required for consistent garment manufacturing performance and predictable consumer product behaviour where the moisture regain test measures the percentage weight increase of a bone-dry textile fabric specimen when exposed to standard atmospheric conditions of twenty degrees Celsius plus or minus two degrees and sixty-five percent plus or minus two percent relative humidity in accordance with IS 6339 textile moisture testing methodology where the moisture regain percentage is calculated as the difference between the conditioned weight and the bone-dry weight divided by the bone-dry weight multiplied by one hundred and expressed as a percentage with standard moisture regain values of eight point five percent for cotton five percent for viscose rayon zero point four percent for polyester eleven percent for silk and thirteen point six percent for wool where deviation from the standard moisture regain value beyond the acceptable tolerance of plus or minus zero point five percentage points indicates abnormal fibre quality contamination with hygroscopic impurities or improper textile processing that could affect the dyeing behaviour dimensional stability and hand feel of the finished textile fabric requiring quarantine and reprocessing before the fabric can be released for garment manufacturing where the fabric grammage verification test measures the mass per unit area of the textile fabric expressed in grams per square metre using a standardised circular specimen cutter of one hundred square centimetre area and a calibrated precision balance with resolution of zero point one milligram in accordance with IS 1964 fabric weight testing methodology confirming that the measured fabric grammage falls within the specified tolerance range of plus or minus five percent of the declared grammage value ensuring garment manufacturers receive textile fabric of consistent weight and thickness that enables precise fabric consumption calculations for garment pattern cutting and costing operations where grammage deviation beyond the acceptable tolerance range causes excess fabric consumption and increased garment manufacturing cost or insufficient fabric coverage and compromised garment visual quality both outcomes requiring immediate corrective action by the textile mill to bring the fabric grammage within specification before shipment to the garment manufacturing customer.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Textile Warehouse Cold Storage & India Export Market Strategy</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The textile warehouse and cold storage infrastructure for the Indian textile apparel supply chain has been designed to accommodate the specific environmental sensitivity requirements of different textile fibre materials and finished fabric products across the complete distribution network from textile mill dispatch warehouses to regional distribution centres and retail garment hubs where the primary storage specification for cotton and cotton blend fabrics maintains warehouse temperature between eighteen and twenty-five degrees Celsius with relative humidity between fifty and sixty-five percent measured by calibrated digital sensors with continuous monitoring and automated ventilation activation when humidity exceeds the sixty-five percent upper threshold preventing moisture absorption by the hygroscopic cotton fibres that causes dimensional changes mould growth and microbial degradation during extended storage periods where the silk and woollen textile storage areas maintain more stringent climate control with temperature between fifteen and twenty degrees Celsius and relative humidity between fifty and fifty-five percent with Refrigerator storage units for premium silk fabrics maintaining temperature below twelve degrees Celsius for long-term preservation of the delicate protein fibres preventing oxidation yellowing and insect damage by carpet beetle and clothes moth larvae that particularly target silk and woollen textile materials during warehouse storage where the warehouse racking system uses adjustable-width steel shelving to accommodate the varying roll widths of different textile products from narrow fabric rolls of sixty centimetres to wide fabric rolls of one hundred and eighty centimetres with acid-free tissue interleaving between stacked fabric rolls preventing colour transfer between adjacent fabric rolls and fibre abrasion during storage retrieval operations where the India textile export market strategy coordinated by the Textile Commissioner and the Apparel Export Promotion Council has established comprehensive export facilitation infrastructure connecting Indian textile manufacturers with global buyers in over one hundred and twenty countries through export promotion zones integrated logistics hubs and bilateral trade agreements that position Indian textile exports for sustained growth in the premium garment and home textiles market segments where the projected annual textile export growth rate of eight percent driven by expanding demand for sustainable organic cotton textiles and India's competitive advantage in low-cost high-volume garment manufacturing creates significant opportunities for logistics service providers specialising in textile supply chain operations.</p></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}



