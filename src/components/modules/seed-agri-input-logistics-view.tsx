import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#166534', '#15803d', '#16a34a', '#22c55e', '#4ade80', '#14532d', '#052e16', '#dcfce7']
const PRODUCTS = ['Bt Cotton Seed Batch', 'Basmati Paddy Seed', 'Hybrid Maize Seed Lot', 'Mustard Rapeseed Pack', 'Soybean Seed Container', 'Wheat Certified Seed', 'Groundnut Kernel Seed', 'Sorghum Jowar Seed']
const ARTISANS = ['Rajasthan Krishì Beej Nigam RAJ', 'Nuziveedu Seeds HYD', 'Kaveri Seed Co BLR', 'Advanta India MUM', 'Ankur Seeds LKO', 'J.K. Agri Genetics GNT', 'Phulambri Seeds NGP', 'Shriram Bioseeds HYD']
const STATUSES = ['IS 10064 Seed Grade A', 'Germination Pct Above 85', 'Moisture Below 12 Pct', 'Genetic Purity Verify', 'Seed Treatment Coating QC', 'Phytosanitary Cert OK']

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
    id: `SAG-${String(offset + i + 1).padStart(4, '0')}`,
    supplier: ARTISANS[(offset + i) % ARTISANS.length], variety: PRODUCTS[(offset + i) % PRODUCTS.length],
    status: STATUSES[(offset + i) % STATUSES.length], qty: ri(1, 20, ((offset + i) * 19) % 20) + 1,
    cost: ri(4000, 56000, ((offset + i) * 11107) % 52000) + 4000,
    date: new Date(2024, ((offset + i) % 12), ri(1, 28, (offset + i) % 28)).toISOString().slice(0, 10),
  }))

const seedrecords = [
  { id: 'SAG-0001', supplier: ' कृषि बीज निगम RAJ', variety: 'Bt Cotton Seed Batch', status: 'IS 10064 Seed Grade A', qty: 15, cost: 52000, date: '2024-01-15' },
  { id: 'SAG-0002', supplier: 'Nuziveedu Seeds HYD', variety: 'Basmati Paddy Seed', status: 'Germination Pct Above 85', qty: 10, cost: 38000, date: '2024-01-28' },
  { id: 'SAG-0003', supplier: 'Kaveri Seed Co BLR', variety: 'Hybrid Maize Seed Lot', status: 'Moisture Below 12 Pct', qty: 8, cost: 46000, date: '2024-02-10' },
  { id: 'SAG-0004', supplier: 'Advanta India MUM', variety: 'Mustard Rapeseed Pack', status: 'Genetic Purity Verify', qty: 12, cost: 28000, date: '2024-02-22' },
  { id: 'SAG-0005', supplier: 'Ankur Seeds LKO', variety: 'Soybean Seed Container', status: 'Seed Treatment Coating QC', qty: 6, cost: 42000, date: '2024-03-08' },
  { id: 'SAG-0006', supplier: 'J.K. Agri Genetics GNT', variety: 'Wheat Certified Seed', status: 'Phytosanitary Cert OK', qty: 18, cost: 22000, date: '2024-03-20' },
  { id: 'SAG-0007', supplier: 'Phulambri Seeds NGP', variety: 'Groundnut Kernel Seed', status: 'IS 10064 Seed Grade A', qty: 5, cost: 56000, date: '2024-04-03' },
  { id: 'SAG-0008', supplier: 'Shriram Bioseeds HYD', variety: 'Sorghum Jowar Seed', status: 'Germination Pct Above 85', qty: 14, cost: 16000, date: '2024-04-16' },
  { id: 'SAG-0009', supplier: ' कृषि बीज निगम RAJ', variety: 'Basmati Paddy Seed', status: 'Moisture Below 12 Pct', qty: 9, cost: 40000, date: '2024-04-28' },
  { id: 'SAG-0010', supplier: 'Nuziveedu Seeds HYD', variety: 'Bt Cotton Seed Batch', status: 'Genetic Purity Verify', qty: 11, cost: 48000, date: '2024-05-10' },
  { id: 'SAG-0011', supplier: 'Kaveri Seed Co BLR', variety: 'Hybrid Maize Seed Lot', status: 'Seed Treatment Coating QC', qty: 7, cost: 34000, date: '2024-05-23' },
  { id: 'SAG-0012', supplier: 'Advanta India MUM', variety: 'Mustard Rapeseed Pack', status: 'Phytosanitary Cert OK', qty: 13, cost: 20000, date: '2024-06-05' },
  { id: 'SAG-0013', supplier: 'Ankur Seeds LKO', variety: 'Soybean Seed Container', status: 'IS 10064 Seed Grade A', qty: 4, cost: 52000, date: '2024-06-18' },
  { id: 'SAG-0014', supplier: 'J.K. Agri Genetics GNT', variety: 'Wheat Certified Seed', status: 'Germination Pct Above 85', qty: 16, cost: 18000, date: '2024-07-01' },
  { id: 'SAG-0015', supplier: 'Phulambri Seeds NGP', variety: 'Groundnut Kernel Seed', status: 'Moisture Below 12 Pct', qty: 8, cost: 44000, date: '2024-07-14' },
  { id: 'SAG-0016', supplier: 'Shriram Bioseeds HYD', variety: 'Sorghum Jowar Seed', status: 'Genetic Purity Verify', qty: 10, cost: 30000, date: '2024-07-26' },
  { id: 'SAG-0017', supplier: ' कृषि बीज निगम RAJ', variety: 'Bt Cotton Seed Batch', status: 'Seed Treatment Coating QC', qty: 6, cost: 50000, date: '2024-08-08' },
  { id: 'SAG-0018', supplier: 'Nuziveedu Seeds HYD', variety: 'Basmati Paddy Seed', status: 'Phytosanitary Cert OK', qty: 12, cost: 26000, date: '2024-08-20' },
  { id: 'SAG-0019', supplier: 'Kaveri Seed Co BLR', variety: 'Hybrid Maize Seed Lot', status: 'IS 10064 Seed Grade A', qty: 5, cost: 54000, date: '2024-09-02' },
  { id: 'SAG-0020', supplier: 'Advanta India MUM', variety: 'Mustard Rapeseed Pack', status: 'Germination Pct Above 85', qty: 15, cost: 14000, date: '2024-09-14' },
]

export default function SeedAgriInputLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})

  const allRecords = [...seedrecords, ...genRecords(21), ...genRecords(41)]

  const filteredRecords = useMemo(() => {
    if (!searchQuery && Object.keys(activeFilters).every(k => !activeFilters[k].length)) return allRecords
    const sq = searchQuery.toLowerCase()
    return allRecords.filter(r => { if (sq && !r.id.toLowerCase().includes(sq) && !r.variety.toLowerCase().includes(sq)) return false; return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string)); })
  }, [searchQuery, activeFilters, allRecords])

  const filterGroups = [
    { key: 'variety', label: 'Variety', options: PRODUCTS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.variety === p).length })) },
    { key: 'supplier', label: 'Supplier', options: ARTISANS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.supplier === p).length })) },
  ]

  const trendData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m, i) => ({ month: m, shipments: ri(4, 20, allRecords.length * 0.10 + i * 3) }))
  const supplierChart = ARTISANS.map(p => ({ name: p.split(' ').slice(0, 2).join(' '), volume: allRecords.filter(r => r.supplier === p).reduce((s, r) => s + r.qty, 0) }))
  const statusPie = STATUSES.map(s => ({ name: s, value: allRecords.filter(r => r.status === s).length }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="sag-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Seed Agri Input' }]} />
      <PageHeader title="Seed Agri Input Logistics" description="Indian seed and agricultural input supply chain with IS 10064 seed grade certification, germination percentage testing above 85, moisture content verification below 12 percent, genetic purity analysis, seed treatment coating quality control, and phytosanitary certification across 8 major seed suppliers in Rajasthan Hyderabad Bangalore and Mumbai" />
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
            <KpiTile label="Seed Varieties" value={PRODUCTS.length} />
            <KpiTile label="Suppliers" value={ARTISANS.length} />
            <KpiTile label="Avg Cost" value={`₹${Math.round(allRecords.reduce((s, r) => s + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>
          <div className="grid grid-cols-6 gap-4">
            <HealthRing label="Grade" value={94} />
            <HealthRing label="Germ" value={91} />
            <HealthRing label="Moisture" value={89} />
            <HealthRing label="Purity" value={92} />
            <HealthRing label="Coating" value={87} />
            <HealthRing label="Phyto" value={95} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="India Seed Market" value="₹45K Crore" />
            <ValueTile label="NSP Coverage" value="35M Hectares" />
            <ValueTile label="Certified Seed" value="82 Percent" />
            <ValueTile label="Rabi Season" value="Active Now" />
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
            placeholder="Search seed agri input shipments..."
          />
          <div className="rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-green-100">
                <tr>
                  <th className="p-3 text-left font-medium">ID</th>
                  <th className="p-3 text-left font-medium">Variety</th>
                  <th className="p-3 text-left font-medium">Supplier</th>
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
                    <td className="p-3"><ProductBadge name={record.variety} /></td>
                    <td className="p-3">{record.supplier}</td>
                    <td className="p-3"><StatusBadge status={record.status} /></td>
                    <td className="p-3">{record.qty} {['bags', 'lots', 'packs', 'containers'][parseInt(record.id.slice(4)) % 4]}</td>
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
              <CardHeader><CardTitle>Supplier Volume</CardTitle></CardHeader>
              <CardContent>
                <BarChart width={500} height={300} data={supplierChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="volume" fill={COLORS[0]}>
                    {supplierChart.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
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
              <CardHeader><CardTitle>India Seed Industry — INR 45,000 Crore Agricultural Input Ecosystem</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The Indian seed industry represents one of the most strategically important agricultural input sectors of the Indian economy having grown from a government-dominated seed distribution system established during the Green Revolution in the nineteen sixties to a vibrant public-private partnership ecosystem valued at approximately forty-five thousand crore Indian rupees serving over one hundred and forty million Indian farming households across all twenty-eight states and eight union territories where the Indian seed supply chain encompasses the complete value chain from basic breeder seed production through foundation seed multiplication to certified truthfully labelled seed processing packaging storage distribution and retail sales through a network of over seven hundred thousand seed retail outlets operated by licensed seed dealers and agricultural input distributors across rural and semi-urban India where the National Seed Policy established in two thousand and two by the Government of India created the regulatory framework for the modern Indian seed industry administered through the Seeds Act nineteen sixty-six and the Seeds Control Order nineteen eighty-three enforced by the Central Seed Certification Board and state seed certification agencies that govern seed quality standards variety registration and certification procedures seed import and export regulations and intellectual property protection for plant varieties through the Protection of Plant Varieties and Farmers Rights Authority where the Indian seed industry produces certified seed for all major food grain crops including rice wheat maize bajra jowar and ragi covering approximately one hundred and forty million hectares of cultivated area under the National Seed Project covering field crops vegetables oilseeds pulses fibre crops and fodder crops serving the complete spectrum of Indian agriculture from subsistence rainfed farming in the semi-arid Deccan plateau to intensive irrigated commercial farming in the Punjab Haryana and western Uttar Pradesh cereal bowl region where the seed logistics operations involve complex temperature and humidity controlled storage at over three thousand seed godowns operated by state seed corporations and private seed companies requiring precise inventory management lot tracking and quality assurance testing at each stage of the seed supply chain from breeder seed production farms to foundation seed processing facilities to certified seed packaging and distribution warehouses ensuring seed viability germination vigour and genetic purity are maintained throughout the complete supply chain from production to farmer delivery.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>IS 10064 Seed Grade & Germination Testing Framework</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The IS 10064 Indian Standard for seed testing provides the comprehensive national quality assurance framework for the Indian seed industry establishing the seed grade classification system and testing protocols that determine whether seed lots meet the minimum quality standards required for certification and commercial distribution under the Seeds Act nineteen sixty-six where the IS 10064 framework classifies seeds into four certification classes including breeder seed which is the initial generation seed produced by the plant breeder under direct supervision of the breeding institution foundation seed which is the first generation progeny of breeder seed produced under supervision of the state seed certification agency registered seed which is the progeny of foundation seed produced by licensed seed producers under certification agency inspection and truthfully labelled seed which is seed produced and labelled by the producer without formal certification agency inspection where each seed class has specified minimum quality parameters for germination percentage physical purity moisture content and genetic purity that must be confirmed through standardised testing procedures conducted in accordance with IS 10064 testing methodology at accredited seed testing laboratories where the germination test counts the number of normal seedlings emerging from four replicate samples of one hundred seeds each placed on moist germination paper at the specified temperature regime for the crop species counted after seven days for most field crops and fourteen days for slower germinating species confirming minimum germination percentage of eighty-five percent for certified cereal seeds and seventy-five percent for certified vegetable seeds ensuring the seed lot will produce adequate crop stand establishment under field conditions where the genetic purity test uses grow-out test methodology where a sample of two hundred seeds from the test lot is sown in a controlled field plot and the resulting plants are examined at flowering stage for off-type variant and contaminant plants confirming minimum genetic purity of ninety-eight percent for certified seed ensuring the seed lot is true to the declared variety description without significant genetic contamination from other varieties or wild relatives that would compromise crop uniformity and yield performance.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Seed Moisture Content & Treatment Coating Quality</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The seed moisture content verification and seed treatment coating quality control protocols form essential components of the Indian seed quality assurance framework ensuring that seed lots maintain safe moisture levels for storage viability and receive effective chemical or biological treatment coating that protects the seed from soil-borne pathogens and insect pests during the critical germination and early seedling establishment phase where the seed moisture content test measures the percentage weight of water in the seed sample using the oven-drying method specified in IS 10064 where a weighed seed sample is dried in a ventilated oven at one hundred and five degrees Celsius plus or minus two degrees for seventeen hours for most field crop seeds and the moisture content is calculated as the percentage weight loss due to water evaporation confirming maximum moisture content of twelve percent for certified cereal and legume seeds and ten percent for certified vegetable seeds ensuring the seed lot has been adequately dried before packaging to prevent mould growth heating and accelerated viability loss during storage in the seed godown where seed moisture above the specified maximum causes rapid viability decline due to increased respiration rate and fungal proliferation that can reduce seed germination percentage by two to three percent per month in warm humid storage conditions while seed moisture below eight percent causes excessive seed brittleness and mechanical damage during handling and seed coating operations requiring precise moisture management within the specified range throughout the processing storage and distribution cycle where the seed treatment coating quality test evaluates the uniformity and adhesion of the chemical or biological seed treatment coating applied to the seed surface using a calibrated seed treatment coating machine that applies the specified dosage of fungicide insecticide and micronutrient coating material measured as grams of active ingredient per kilogram of seed confirming coating uniformity within plus or minus ten percent of the target dosage across the seed lot with minimum coating adhesion retention of ninety-five percent after the standardised seed coating abrasion test conducted in a laboratory rotary coating abrasion tester for five minutes at sixty revolutions per minute ensuring the seed treatment coating remains intact during seed handling bagging transport and sowing operations without significant coating detachment that would reduce the effectiveness of the seed treatment in protecting the seed and emerging seedling from soil-borne pathogens including Fusarium Rhizoctonia Pythium and insect pests including soil-dwelling beetle larvae and wireworms that can cause devastating crop stand losses in untreated seed lots.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Phytosanitary Certification & Seed Cold Chain Logistics</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The phytosanitary certification and seed cold chain logistics framework for the Indian seed industry ensures that seed lots meet the plant quarantine requirements for domestic and international movement and are stored and transported under controlled environmental conditions that maintain seed viability and vigour throughout the complete supply chain from processing facility to farm gate where the phytosanitary certification issued by the National Plant Protection Organisation under the International Plant Protection Convention confirms that the seed lot has been inspected and tested for regulated quarantine pests including exotic weed seeds plant pathogen spores and insect contaminants in accordance with IS 6185 seed health testing methodology confirming freedom from all regulated quarantine pests listed in the Indian Plant Quarantine Order and the importing country phytosanitary requirements ensuring the seed lot complies with both domestic interstate movement restrictions and international phytosanitary import requirements of destination countries for seed export consignments where the seed cold chain logistics infrastructure maintains seed storage temperature between five and fifteen degrees Celsius for most field crop seeds and between two and eight degrees Celsius for breeder seed and foundation seed stocks using Refrigerator storage units and temperature-controlled warehouse facilities equipped with calibrated digital temperature and humidity monitoring systems with continuous data logging and automated alert activation when storage temperature exceeds the specified upper limit ensuring consistent cool dry storage conditions throughout the annual storage period that may extend up to twelve months for kharif season seed produced in the preceding rabi season or up to eight months for rabi season seed produced in the preceding kharif season where the seed warehouse racking system uses galvanised steel pallet racking with moisture barrier flooring and stack height limitations of four metres maximum to prevent compression damage to seed bags in the lower stack positions while the warehouse ventilation system maintains airflow of minimum zero point five metres per second across all storage zones preventing stagnant air pockets that could cause localised temperature and humidity increases leading to seed quality deterioration in the affected storage zones where the seed distribution logistics employ a multi-modal transport network of temperature-controlled trucks rail wagons and containerised coastal shipping connecting the seed production and processing facilities in the major seed producing states of Karnataka Telangana Rajasthan and Maharashtra with seed distribution hubs in all major agricultural states ensuring timely seed delivery to farmers within the optimal sowing window for each crop season.</p></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}



