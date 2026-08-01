import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#14532d', '#166534', '#14532d', '#052e16', '#15803d', '#16a34a', '#22c55e', '#dcfce7']
const PRODUCTS = ['Organic Raw Makhana', 'Roasted Makhana Classic Pack', 'Peri Peri Flavoured Makhana', 'Makhana Flour Powder', 'Makhana Kheer Mix Premix', 'Sugar-Free Makhana Bites', 'Makhana Raita Premix Blend', 'Frozen Lotus Seed Premium']
const ARTISANS = ['Mithila Makhana Darbhanga BR', 'Madhubani Fox Nut Cluster BR', 'Samastipur Lotus Pond Society', 'Purnia Makhana Unit BR', 'Kanti Makhana Industries BR', 'Darbhanga Organic Farms BR', 'Katihar Makhana Process BR', 'Saharsa Lotus Growers BR']
const STATUSES = ['FSSAI Certified Organic', 'FPO Makhana Grade A', 'Vacuum Sealed Nitrogen Pack', 'Temp-Controlled Van Transit', 'Refrigerator Storage 2-8 C', 'Moisture Below 5% QC']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="w-24 h-2 bg-green-200 rounded-full overflow-hidden"><div className="h-full bg-green-700 rounded-full" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ label, value, size = 80 }: { label: string; value: number; size?: number }) => {
  const r = (size - 12) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#dcfce7" strokeWidth="6" />
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
    id: `MFN-${String(offset + i + 1).padStart(4, '0')}`,
    painter: ARTISANS[(offset + i) % ARTISANS.length], ware: PRODUCTS[(offset + i) % PRODUCTS.length],
    status: STATUSES[(offset + i) % STATUSES.length], qty: ri(1, 28, ((offset + i) * 27) % 28) + 1,
    cost: ri(6000, 92000, ((offset + i) * 13107) % 86000) + 6000,
    date: new Date(2024, ((offset + i) % 12), ri(1, 28, (offset + i) % 28)).toISOString().slice(0, 10),
  }))

const makhanaRecords = [
  { id: 'MFN-0001', painter: 'Mithila Makhana Darbhanga BR', ware: 'Organic Raw Makhana', status: 'FSSAI Certified Organic', qty: 3, cost: 78000, date: '2024-01-12' },
  { id: 'MFN-0002', painter: 'Madhubani Fox Nut Cluster BR', ware: 'Roasted Makhana Classic Pack', status: 'FPO Makhana Grade A', qty: 5, cost: 52000, date: '2024-01-25' },
  { id: 'MFN-0003', painter: 'Samastipur Lotus Pond Society', ware: 'Peri Peri Flavoured Makhana', status: 'Vacuum Sealed Nitrogen Pack', qty: 2, cost: 88000, date: '2024-02-08' },
  { id: 'MFN-0004', painter: 'Purnia Makhana Unit BR', ware: 'Makhana Flour Powder', status: 'Temp-Controlled Van Transit', qty: 6, cost: 34000, date: '2024-02-20' },
  { id: 'MFN-0005', painter: 'Kanti Makhana Industries BR', ware: 'Makhana Kheer Mix Premix', status: 'Refrigerator Storage 2-8 C', qty: 8, cost: 22000, date: '2024-03-05' },
  { id: 'MFN-0006', painter: 'Darbhanga Organic Farms BR', ware: 'Sugar-Free Makhana Bites', status: 'Moisture Below 5% QC', qty: 4, cost: 62000, date: '2024-03-18' },
  { id: 'MFN-0007', painter: 'Katihar Makhana Process BR', ware: 'Makhana Raita Premix Blend', status: 'FSSAI Certified Organic', qty: 3, cost: 85000, date: '2024-03-30' },
  { id: 'MFN-0008', painter: 'Saharsa Lotus Growers BR', ware: 'Frozen Lotus Seed Premium', status: 'FPO Makhana Grade A', qty: 5, cost: 48000, date: '2024-04-12' },
  { id: 'MFN-0009', painter: 'Mithila Makhana Darbhanga BR', ware: 'Roasted Makhana Classic Pack', status: 'Vacuum Sealed Nitrogen Pack', qty: 4, cost: 56000, date: '2024-04-24' },
  { id: 'MFN-0010', painter: 'Madhubani Fox Nut Cluster BR', ware: 'Organic Raw Makhana', status: 'Temp-Controlled Van Transit', qty: 3, cost: 72000, date: '2024-05-06' },
  { id: 'MFN-0011', painter: 'Samastipur Lotus Pond Society', ware: 'Peri Peri Flavoured Makhana', status: 'Refrigerator Storage 2-8 C', qty: 6, cost: 38000, date: '2024-05-18' },
  { id: 'MFN-0012', painter: 'Purnia Makhana Unit BR', ware: 'Makhana Flour Powder', status: 'Moisture Below 5% QC', qty: 2, cost: 90000, date: '2024-05-30' },
  { id: 'MFN-0013', painter: 'Kanti Makhana Industries BR', ware: 'Makhana Kheer Mix Premix', status: 'FSSAI Certified Organic', qty: 7, cost: 26000, date: '2024-06-12' },
  { id: 'MFN-0014', painter: 'Darbhanga Organic Farms BR', ware: 'Sugar-Free Makhana Bites', status: 'FPO Makhana Grade A', qty: 4, cost: 58000, date: '2024-06-24' },
  { id: 'MFN-0015', painter: 'Katihar Makhana Process BR', ware: 'Makhana Raita Premix Blend', status: 'Vacuum Sealed Nitrogen Pack', qty: 3, cost: 82000, date: '2024-07-06' },
  { id: 'MFN-0016', painter: 'Saharsa Lotus Growers BR', ware: 'Frozen Lotus Seed Premium', status: 'Temp-Controlled Van Transit', qty: 5, cost: 44000, date: '2024-07-18' },
  { id: 'MFN-0017', painter: 'Mithila Makhana Darbhanga BR', ware: 'Peri Peri Flavoured Makhana', status: 'Refrigerator Storage 2-8 C', qty: 4, cost: 68000, date: '2024-07-30' },
  { id: 'MFN-0018', painter: 'Madhubani Fox Nut Cluster BR', ware: 'Organic Raw Makhana', status: 'Moisture Below 5% QC', qty: 3, cost: 76000, date: '2024-08-10' },
  { id: 'MFN-0019', painter: 'Samastipur Lotus Pond Society', ware: 'Makhana Kheer Mix Premix', status: 'FSSAI Certified Organic', qty: 6, cost: 42000, date: '2024-08-22' },
  { id: 'MFN-0020', painter: 'Purnia Makhana Unit BR', ware: 'Makhana Flour Powder', status: 'FPO Makhana Grade A', qty: 2, cost: 92000, date: '2024-09-03' },
]

export default function MakhanaFoxNutProcessingLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = [...makhanaRecords, ...genRecords(21), ...genRecords(41)]


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
    <div className="mfn-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Makhana Fox Nut Processing' }]} />
      <PageHeader title="Makhana Fox Nut Processing Logistics" description="Bihar Mithila makhana fox nut processing supply chain with FSSAI organic certification, FPO Makhana Grade A standards, vacuum sealed nitrogen packaging, and Refrigerator storage across 8 heritage clusters in Darbhanga, Madhubani, and Saharsa" />
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="bg-green-100">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <KpiTile label="Total Shipments" value={allRecords.length} />
            <KpiTile label="Active Ware" value={PRODUCTS.length} />
            <KpiTile label="Processing Clusters" value={ARTISANS.length} />
            <KpiTile label="Avg Cost" value={`₹${Math.round(allRecords.reduce((s, r) => s + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>
          <div className="grid grid-cols-6 gap-4">
            <HealthRing label="FSSAI" value={93} />
            <HealthRing label="FPO" value={89} />
            <HealthRing label="Vacuum" value={85} />
            <HealthRing label="Temp" value={81} />
            <HealthRing label="Refrig" value={87} />
            <HealthRing label="Moisture" value={91} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Lotus Pond Area" value="15,000 Ha" />
            <ValueTile label="Tradition" value="Since Vedic Era" />
            <ValueTile label="Export Markets" value="12 Countries" />
            <ValueTile label="Annual Revenue" value="₹850 Crore" />
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
            placeholder="Search makhana fox nut shipments..."
          />
          <div className="rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-green-100">
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
                  <tr key={record.id} className="border-t hover:bg-green-50/50">
                    <td className="p-3 font-mono text-xs">{record.id}</td>
                    <td className="p-3"><ProductBadge name={record.ware} /></td>
                    <td className="p-3">{record.painter}</td>
                    <td className="p-3"><StatusBadge status={record.status} /></td>
                    <td className="p-3">{record.qty} {['kg', 'pkt', 'box', 'carton'][parseInt(record.id.slice(4)) % 4]}</td>
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
              <CardHeader><CardTitle>Makhana Fox Nut — Vedic Era Mithila Heritage Superfood</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">Makhana or fox nut derived from the seeds of the Euryale ferox water lily species represents one of the most ancient and nutritionally significant agricultural food products of the Indian subcontinent having been continuously cultivated and consumed in the Mithila region of Bihar for over three millennia with the earliest documented references to makhana appearing in the Vedic literature where the popped lotus seeds are described as sattvic food appropriate for religious fasting observances and ceremonial offerings to the deities during Hindu ritual ceremonies that continue to be practised across India to the present day where makhana remains the preferred fasting food during Navratri, Ekadashi, Maha Shivaratri, and other Hindu vrat observances where the light easily digestible nutritional profile of makhana including its high protein content of approximately 9.7 grams per 100 grams, low fat content of approximately 0.1 grams per 100 grams, and rich mineral content including calcium, phosphorus, iron, and potassium makes it an ideal dietary staple during fasting periods when heavier food items are traditionally prohibited in accordance with Hindu prescriptive dietary traditions governing ritual fasting observances that have been codified in the Dharmashastra texts and transmitted across generations of Hindu practitioners for over three thousand years establishing makhana as one of the oldest continuously cultivated and consumed agricultural food products in Indian civilisation. The Mithila region of Bihar spanning the present-day districts of Darbhanga, Madhubani, Samastipur, Purnia, Katihar, Saharsa, and Sitamarhi constitutes the primary makhana production zone in India accounting for approximately 85% of the total national makhana production with the traditional cultivation system based on the harvesting of wild Euryale ferox water lily seeds from the extensive pond and wetland ecosystems of the Mithila region where the annual monsoon flooding of the Kosi, Kamla, and Bagmati river systems creates thousands of hectares of shallow water bodies and seasonal wetlands that provide the ideal natural aquatic habitat for the Euryale ferox water lily whose distinctive purple flowers and large round leaves with serrated edges create the characteristic floating vegetation cover of the Mithila lotus ponds where the makhana seeds develop within the submerged seed pods of the water lily plant during the monsoon and post-monsoon growing season from June through November. The traditional makhana harvesting process follows a multi-stage sequence beginning with the manual collection of the seed pods by skilled makhana divers who wade into the shallow pond waters and manually extract the seed pods from the submerged plant bases at depths of 0.5 to 2 metres during the peak harvest season from September through November when the seed pods have reached full maturity and the seeds inside have developed the characteristic hard dark-brown outer shell that encloses the edible white kernel within. The harvested seed pods are sun-dried for three to five days to reduce moisture content and facilitate the subsequent processing stages where the dried seeds are subjected to a traditional grading process based on seed size and maturity followed by the crucial roasting and popping stage where the graded seeds are heated in sand-filled cast iron pans at temperatures of 250 to 300 degrees Celsius causing the internal moisture within each seed to vaporise rapidly expanding the starchy endosperm and bursting the hard outer shell to produce the characteristic white puffed makhana kernel that is the final edible product consumed across India and increasingly in international markets where makhana is gaining recognition as a premium plant-based superfood with significant nutritional and health benefits.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>FSSAI Organic Certification & FPO Makhana Grade A Standards</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The FSSAI organic certification framework for makhana combined with the Fruit Products Order FPO Makhana Grade A standard establishes India's comprehensive quality assurance system for the makhana fox nut processing sector covering the entire supply chain from lotus pond cultivation through seed harvesting, grading, roasting, popping, packaging, storage, and distribution ensuring that makhana products reaching the consumer market meet rigorous safety, purity, and quality standards that distinguish authentic Mithila makhana from inferior products and adulterated imitations that have increasingly appeared in both domestic Indian retail markets and international export channels where the growing global demand for makhana as a plant-based superfood has attracted unscrupulous traders offering substandard and adulterated makhana products that compromise consumer confidence and threaten the reputation of the genuine Mithila makhana industry that supports approximately five hundred thousand farming and processing families across the Mithila region of Bihar. The FSSAI organic certification requirements mandate that the makhana cultivation process must conform to the National Programme for Organic Production standards including the prohibition of synthetic chemical fertilisers, synthetic pesticides, genetically modified organisms, and sewage sludge application on the lotus pond ecosystems where the Euryale ferox water lily is cultivated for makhana seed production ensuring the final makhana product is free from synthetic chemical residues including organophosphate pesticide residues, heavy metal contamination from industrial or agricultural runoff, and microbial contamination from sewage-impacted water sources that would compromise the food safety profile of the makhana product. The FPO Makhana Grade A certification requirements specify comprehensive quality parameters for the finished popped makhana kernels including minimum pop rate of 95% measured by the ratio of fully popped kernels to total processed seeds, maximum moisture content of 4.5% by weight verified through standardised oven-drying methodology at 105 degrees Celsius for six hours, maximum broken kernel content of 3% by weight, minimum kernel diameter of 12 millimetres for the standard large grade, and absence of foreign matter including sand particles, un-popped seeds, insect fragments, and fungal contamination verified through visual inspection under 10x magnification and mycological analysis for aflatoxin-producing Aspergillus species that can produce dangerous mycotoxin contamination in inadequately stored makhana products where moisture content exceeding 5% combined with ambient temperatures above 30 degrees Celsius creates conditions favourable for fungal growth and aflatoxin production that poses serious health risks to consumers. The FPO Grade A packaging requirements mandate vacuum-sealed nitrogen-flushed packaging using food-grade laminated polyester-polyethylene pouch material with oxygen transmission rate below 50 cubic centimetres per square metre per day at 23 degrees Celsius and 0% relative humidity ensuring the residual oxygen content within the sealed pouch remains below 2% by volume preventing oxidative rancidity and microbial spoilage during the minimum six-month shelf life period for Grade A makhana products stored under ambient conditions in the Indian market distribution chain.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Vacuum Sealed Nitrogen Packaging for Makhana Transit</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">Vacuum-sealed nitrogen-flushed packaging with multi-layer barrier pouch construction has been specifically developed for the makhana fox nut processing logistics supply chain to protect the highly hygroscopic and oxidation-sensitive popped makhana kernels from the moisture absorption, oxidative rancidity, and physical breakage hazards encountered during transit from the Mithila processing centres in the Darbhanga, Madhubani, and Saharsa districts to domestic distribution hubs in Delhi NCR, Mumbai, Bengaluru, Chennai, and Kolkata, and international export destinations serving the growing global demand for Indian makhana as a premium plant-based superfood in the United States, United Kingdom, European Union, Japan, Australia, and the Middle Eastern markets where the Indian diaspora community demand for authentic Mithila makhana has been growing at compound annual rate exceeding 25% over the past five years. The packaging specification utilises a three-layer barrier pouch construction comprising an outer layer of 12-micron biaxially oriented polyester providing mechanical strength and puncture resistance sufficient to protect the fragile popped makhana kernels from the crushing and vibration forces encountered during road transport along the national highway corridors connecting the Mithila production region to the major urban distribution hubs, a middle layer of 9-micron aluminium foil providing near-absolute moisture and oxygen barrier performance with water vapour transmission rate below 0.01 grams per square metre per day and oxygen transmission rate below 0.05 cubic centimetres per square metre per day at 23 degrees Celsius and 0% relative humidity test conditions, and an inner layer of 70-micron cast polypropylene providing food-contact safety compliance and heat-seal integrity ensuring the pouch maintains its hermetic seal throughout the transit and storage cycle from the processing facility to the retail point of sale. Each batch of popped makhana kernels is inspected under standardised quality control protocols verifying pop rate above 95%, moisture content below 4.5%, broken kernel content below 3%, and absence of foreign matter and microbial contamination before the approved makhana product proceeds to the packaging stage where the kernels are nitrogen-flushed to reduce residual oxygen content below 2% by volume and vacuum-sealed within the multi-layer barrier pouches at a vacuum level of 650 millibar absolute creating the near-oxygen-free internal environment that prevents oxidative rancidity development in the lipid fraction of the makhana kernels during the transit and shelf life period ensuring the makhana product retains its characteristic fresh-roasted flavour, white colour, and crisp texture from the point of packaging to the point of consumer consumption across both domestic and international distribution channels where the transit time can range from three days for domestic express shipments to forty-five days for ocean freight international export shipments requiring the highest standards of packaging barrier performance to maintain makhana product quality throughout the extended logistics chain.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>AI Quality Sorting & Makhana Heritage Market Development</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">Artificial intelligence and machine vision technologies are being progressively deployed to automate the quality sorting and grading of popped makhana kernels replacing the traditional manual sorting process where skilled women workers visually inspect and sort each makhana kernel by size, colour, shape, and defect characteristics at processing facilities across the Mithila region where the manual sorting operation represents one of the most labour-intensive and quality-critical stages of the makhana processing chain determining the final product grade, market price, and consumer satisfaction outcomes for each batch of processed makhana. The AI-based makhana sorting system employs high-resolution line-scan cameras operating at 5000 pixels per line combined with near-infrared spectroscopy sensors to capture the complete visual appearance and internal composition characteristics of each individual makhana kernel as it passes through the inspection zone on a high-speed vibratory conveyor system processing up to 2000 kernels per minute with real-time classification of each kernel into one of five quality grades based on the FPO Makhana Grading Standards including Grade A Extra Large with minimum kernel diameter of 16 millimetres and minimum pop rate of 98%, Grade A Large with minimum kernel diameter of 12 millimetres and minimum pop rate of 95%, Grade B Medium with minimum kernel diameter of 10 millimetres and minimum pop rate of 90%, Grade C Small with minimum kernel diameter of 8 millimetres and minimum pop rate of 85%, and Rejected category for kernels exhibiting defects including chipping, breakage, discolouration, un-popped seed remnants, insect damage, or fungal contamination detected through the machine vision system's defect classification algorithms trained on datasets of over five million annotated makhana kernel images representing the full range of quality characteristics encountered in commercial makhana processing operations across the Mithila production region. The AI-powered market development platform connects the Mithila makhana processing cooperatives directly with institutional buyers including India's major FMCG retail chains that have introduced premium makhana product lines capitalising on the growing consumer demand for healthy snacking alternatives, government public distribution system procurement for the nutrition supplementation programmes targeting women and children in the Mithila region where makhana represents a culturally accepted and nutritionally superior food supplement, international food importers serving the global Indian diaspora market in the United States, United Kingdom, Canada, Australia, and the Gulf Cooperation Council countries where the demand for authentic Mithila makhana products bearing the GI Mithila Makhana tag has been growing at double-digit rates driven by the increasing consumer awareness of makhana's nutritional benefits as a high-protein, low-fat, and mineral-rich plant-based superfood that aligns with the global trends toward plant-based nutrition, clean-label food products, and sustainable agricultural supply chains where the traditional Mithila makhana cultivation system based on wild Euryale ferox harvesting from natural wetland ecosystems represents one of the most environmentally sustainable agricultural production systems in Indian food processing creating premium market positioning opportunities for authenticated GI-certified Mithila makhana products in the rapidly expanding global health food market.</p></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

