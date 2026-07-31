import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#0d9488', '#14b8a6', '#2dd4bf', '#5eead4', '#99f6e4', '#0f766e', '#115e59', '#ccfbf1']
const PRODUCTS = ['Covid mRNA Vaccine Vial', 'BCG Tuberculosis Dose', 'OPV Polio Drops Pack', 'DPT Triple Antigen Vial', 'Hepatitis B Vaccine Vial', 'MMR Measles Mumps Vial', 'Pentavalent Combo Vial', 'Rotavirus Oral Dose Pack']
const ARTISANS = ['Serum Institute of India PNE', 'Bharat Biotech HYD', 'Biological Evans HYD', 'Zydus Cadila AHM', 'Panacea Biotec NDLM', 'HLL Lifecare TRV', 'Indian Immunologicals HYD', 'Bio-Med Gurgaon HR']
const STATUSES = ['WHO Prequal Status OK', 'Cold Chain 2-8 Deg Maintained', 'Potency Assay Above Threshold', 'Vial Integrity Seal Check', 'Batch Release CDSCO', 'Endotoxin Level Below Limit']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-teal-100 text-teal-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="w-24 h-2 bg-teal-200 rounded-full overflow-hidden"><div className="h-full bg-teal-700 rounded-full" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ label, value, size = 80 }: { label: string; value: number; size?: number }) => {
  const r = (size - 12) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#ccfbf1" strokeWidth="6" />
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
    id: `PVS-${String(offset + i + 1).padStart(4, '0')}`,
    manufacturer: ARTISANS[(offset + i) % ARTISANS.length], vaccine: PRODUCTS[(offset + i) % PRODUCTS.length],
    status: STATUSES[(offset + i) % STATUSES.length], qty: ri(1, 20, ((offset + i) * 19) % 20) + 1,
    cost: ri(8000, 72000, ((offset + i) * 11107) % 64000) + 8000,
    date: new Date(2024, ((offset + i) % 12), ri(1, 28, (offset + i) % 28)).toISOString().slice(0, 10),
  }))

const pharmarecords = [
  { id: 'PVS-0001', manufacturer: 'Serum Institute of India PNE', vaccine: 'Covid mRNA Vaccine Vial', status: 'WHO Prequal Status OK', qty: 12, cost: 68000, date: '2024-01-15' },
  { id: 'PVS-0002', manufacturer: 'Bharat Biotech HYD', vaccine: 'BCG Tuberculosis Dose', status: 'Cold Chain 2-8 Deg Maintained', qty: 8, cost: 52000, date: '2024-01-28' },
  { id: 'PVS-0003', manufacturer: 'Biological Evans HYD', vaccine: 'OPV Polio Drops Pack', status: 'Potency Assay Above Threshold', qty: 15, cost: 60000, date: '2024-02-10' },
  { id: 'PVS-0004', manufacturer: 'Zydus Cadila AHM', vaccine: 'DPT Triple Antigen Vial', status: 'Vial Integrity Seal Check', qty: 6, cost: 44000, date: '2024-02-22' },
  { id: 'PVS-0005', manufacturer: 'Panacea Biotec NDLM', vaccine: 'Hepatitis B Vaccine Vial', status: 'Batch Release CDSCO', qty: 10, cost: 58000, date: '2024-03-08' },
  { id: 'PVS-0006', manufacturer: 'HLL Lifecare TRV', vaccine: 'MMR Measles Mumps Vial', status: 'Endotoxin Level Below Limit', qty: 4, cost: 70000, date: '2024-03-20' },
  { id: 'PVS-0007', manufacturer: 'Indian Immunologicals HYD', vaccine: 'Pentavalent Combo Vial', status: 'WHO Prequal Status OK', qty: 14, cost: 48000, date: '2024-04-03' },
  { id: 'PVS-0008', manufacturer: 'Bio-Med Gurgaon HR', vaccine: 'Rotavirus Oral Dose Pack', status: 'Cold Chain 2-8 Deg Maintained', qty: 7, cost: 36000, date: '2024-04-16' },
  { id: 'PVS-0009', manufacturer: 'Serum Institute of India PNE', vaccine: 'BCG Tuberculosis Dose', status: 'Potency Assay Above Threshold', qty: 11, cost: 54000, date: '2024-04-28' },
  { id: 'PVS-0010', manufacturer: 'Bharat Biotech HYD', vaccine: 'Covid mRNA Vaccine Vial', status: 'Vial Integrity Seal Check', qty: 9, cost: 64000, date: '2024-05-10' },
  { id: 'PVS-0011', manufacturer: 'Biological Evans HYD', vaccine: 'OPV Polio Drops Pack', status: 'Batch Release CDSCO', qty: 16, cost: 42000, date: '2024-05-23' },
  { id: 'PVS-0012', manufacturer: 'Zydus Cadila AHM', vaccine: 'DPT Triple Antigen Vial', status: 'Endotoxin Level Below Limit', qty: 5, cost: 70000, date: '2024-06-05' },
  { id: 'PVS-0013', manufacturer: 'Panacea Biotec NDLM', vaccine: 'Hepatitis B Vaccine Vial', status: 'WHO Prequal Status OK', qty: 8, cost: 56000, date: '2024-06-18' },
  { id: 'PVS-0014', manufacturer: 'HLL Lifecare TRV', vaccine: 'MMR Measles Mumps Vial', status: 'Cold Chain 2-8 Deg Maintained', qty: 13, cost: 38000, date: '2024-07-01' },
  { id: 'PVS-0015', manufacturer: 'Indian Immunologicals HYD', vaccine: 'Pentavalent Combo Vial', status: 'Potency Assay Above Threshold', qty: 3, cost: 72000, date: '2024-07-14' },
  { id: 'PVS-0016', manufacturer: 'Bio-Med Gurgaon HR', vaccine: 'Rotavirus Oral Dose Pack', status: 'Vial Integrity Seal Check', qty: 10, cost: 46000, date: '2024-07-26' },
  { id: 'PVS-0017', manufacturer: 'Serum Institute of India PNE', vaccine: 'Covid mRNA Vaccine Vial', status: 'Batch Release CDSCO', qty: 6, cost: 66000, date: '2024-08-08' },
  { id: 'PVS-0018', manufacturer: 'Bharat Biotech HYD', vaccine: 'BCG Tuberculosis Dose', status: 'Endotoxin Level Below Limit', qty: 12, cost: 32000, date: '2024-08-20' },
  { id: 'PVS-0019', manufacturer: 'Biological Evans HYD', vaccine: 'OPV Polio Drops Pack', status: 'WHO Prequal Status OK', qty: 7, cost: 58000, date: '2024-09-02' },
  { id: 'PVS-0020', manufacturer: 'Zydus Cadila AHM', vaccine: 'DPT Triple Antigen Vial', status: 'Cold Chain 2-8 Deg Maintained', qty: 14, cost: 40000, date: '2024-09-14' },
]

export default function PharmaVaccineSupplyView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})

  const allRecords = [...pharmarecords, ...genRecords(21), ...genRecords(41)]

  const filteredRecords = useMemo(() => {
    if (!searchQuery && Object.keys(activeFilters).every(k => !activeFilters[k].length)) return allRecords
    const sq = searchQuery.toLowerCase()
    return allRecords.filter(r => { if (sq && !r.id.toLowerCase().includes(sq) && !r.vaccine.toLowerCase().includes(sq)) return false; return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string)); })
  }, [searchQuery, activeFilters, allRecords])

  const filterGroups = [
    { key: 'vaccine', label: 'Vaccine', options: PRODUCTS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.vaccine === p).length })) },
    { key: 'manufacturer', label: 'Manufacturer', options: ARTISANS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.manufacturer === p).length })) },
  ]

  const trendData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m, i) => ({ month: m, shipments: ri(4, 20, allRecords.length * 0.10 + i * 3) }))
  const mfgChart = ARTISANS.map(p => ({ name: p.split(' ').slice(0, 2).join(' '), volume: allRecords.filter(r => r.manufacturer === p).reduce((s, r) => s + r.qty, 0) }))
  const statusPie = STATUSES.map(s => ({ name: s, value: allRecords.filter(r => r.status === s).length }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="pvs-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Pharma Vaccine' }]} />
      <PageHeader title="Pharma Vaccine Supply" description="Indian pharma vaccine supply chain with WHO prequalification status, cold chain two to eight degree Celsius maintenance, potency assay verification, vial integrity seal inspection, CDSCO batch release certification, and endotoxin level testing across 8 major vaccine manufacturers in Pune Hyderabad and Ahmedabad" />
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="bg-teal-100">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <KpiTile label="Total Shipments" value={allRecords.length} />
            <KpiTile label="Vaccine Types" value={PRODUCTS.length} />
            <KpiTile label="Manufacturers" value={ARTISANS.length} />
            <KpiTile label="Avg Cost" value={`₹${Math.round(allRecords.reduce((s, r) => s + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>
          <div className="grid grid-cols-6 gap-4">
            <HealthRing label="WHO" value={96} />
            <HealthRing label="Cold" value={94} />
            <HealthRing label="Potency" value={92} />
            <HealthRing label="Seal" value={97} />
            <HealthRing label="Batch" value={95} />
            <HealthRing label="Endotoxin" value={93} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="India Doses/Year" value="3.8 Billion" />
            <ValueTile label="Cold Chain Points" value="28,000+" />
            <ValueTile label="UNICEF Supply" value="60 Percent" />
            <ValueTile label="Pipeline Value" value="₹52K Crore" />
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
            placeholder="Search pharma vaccine shipments..."
          />
          <div className="rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-teal-100">
                <tr>
                  <th className="p-3 text-left font-medium">ID</th>
                  <th className="p-3 text-left font-medium">Vaccine</th>
                  <th className="p-3 text-left font-medium">Manufacturer</th>
                  <th className="p-3 text-left font-medium">Status</th>
                  <th className="p-3 text-left font-medium">Qty</th>
                  <th className="p-3 text-left font-medium">Cost</th>
                  <th className="p-3 text-left font-medium">Cost Bar</th>
                  <th className="p-3 text-left font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map(record => (
                  <tr key={record.id} className="border-t hover:bg-teal-50/50">
                    <td className="p-3 font-mono text-xs">{record.id}</td>
                    <td className="p-3"><ProductBadge name={record.vaccine} /></td>
                    <td className="p-3">{record.manufacturer}</td>
                    <td className="p-3"><StatusBadge status={record.status} /></td>
                    <td className="p-3">{record.qty} {['vials', 'doses', 'packs', 'lots'][parseInt(record.id.slice(4)) % 4]}</td>
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
              <CardHeader><CardTitle>Manufacturer Volume</CardTitle></CardHeader>
              <CardContent>
                <BarChart width={500} height={300} data={mfgChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="volume" fill={COLORS[0]}>
                    {mfgChart.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
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
              <CardHeader><CardTitle>India Vaccine Industry — 3.8 Billion Doses Annual Supply Chain</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The Indian vaccine industry represents one of the most strategically critical pharmaceutical manufacturing sectors globally with India producing approximately three point eight billion vaccine doses annually supplying over sixty percent of the global vaccine demand through the United Nations procurement agencies UNICEF and the Pan American Health Organisation where the Indian vaccine manufacturing ecosystem is concentrated in three major pharmaceutical clusters including the Pune cluster centred on the Serum Institute of India which is the world's largest vaccine manufacturer by volume producing over one point five billion doses annually of vaccines including diphtheria pertussis tetanus measles mumps rubella polio and COVID-19 vaccines the Hyderabad cluster including Bharat Biotech Biological Evans and Indian Immunologicals producing a diverse portfolio of viral bacterial and recombinant vaccines and the Ahmedabad cluster including Zydus Cadila developing novel DNA and mRNA vaccine platforms where the Indian vaccine supply chain logistics operations are among the most temperature-sensitive and time-critical pharmaceutical distribution challenges in global healthcare requiring continuous cold chain maintenance between two and eight degrees Celsius from the manufacturing facility fill-finish line through primary packaging secondary packaging cold room storage refrigerated transport and last-mile delivery to over twenty-eight thousand immunisation cold chain points across India including primary health centres community health centres district hospitals and state vaccine stores where the vaccine cold chain infrastructure employs over sixty thousand cold chain equipment units including ice-lined refrigerators deep freezers cold boxes vaccine carriers and ice packs maintained by the Universal Immunisation Programme and the National Health Mission with continuous temperature monitoring using digital data loggers and GSM-based remote monitoring systems that provide real-time temperature visibility across the complete vaccine distribution network ensuring vaccine potency is maintained from manufacturer to administration point where the Serum Institute of India alone operates over one hundred refrigerated vehicles and three hundred cold storage warehouses across India creating the world's largest dedicated vaccine cold chain logistics network that delivers vaccines to immunisation points in every Indian state and union territory including remote and underserved areas in the northeastern hill states the Himalayan region and the island territories of Andaman Nicobar and Lakshadweep.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>WHO Prequalification & CDSCO Batch Release Framework</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The WHO prequalification status and CDSCO batch release certification framework establishes the dual quality assurance architecture for the Indian vaccine supply chain ensuring that all vaccine products meet both international quality standards for UN procurement and domestic regulatory requirements for distribution within the Indian national immunisation programme where the WHO prequalification process evaluates vaccine manufacturing facilities through comprehensive dossier review and on-site inspection by WHO assessment teams confirming compliance with WHO Good Manufacturing Practices WHO good laboratory practices and WHO prequalification standards for vaccine quality including potency safety purity and sterility testing conducted at the manufacturer quality control laboratory using validated test methods and reference standards established by the WHO Biological Reference Laboratory programme where the WHO prequalification status is the primary quality credential required for Indian vaccine manufacturers to supply vaccines through UNICEF the Global Alliance for Vaccines and Immunisation and other international procurement agencies that collectively purchase over two billion doses of vaccines annually from Indian manufacturers where the CDSCO Central Drugs Standard Control Organisation batch release testing conducted at the Central Drugs Laboratory Kasauli provides the statutory quality assurance mechanism for all vaccines distributed within India under the Drugs and Cosmetics Act requiring independent potency identity sterility and safety testing of each vaccine batch at the national control laboratory before CDSCO batch release certification authorising the vaccine batch for distribution and administration where the CDSCO batch release process requires submission of batch manufacturing records batch analysis certificates and representative batch samples by the vaccine manufacturer to the Central Drugs Laboratory where each batch undergoes independent laboratory testing confirming potency above the minimum specified limit identity matching the declared vaccine strain composition sterility confirming absence of bacterial or fungal contamination and safety confirming absence of residual host cell protein DNA and endotoxin above the specified maximum limits before the CDSCO grants the batch release certificate enabling distribution of the vaccine batch through the national immunisation programme cold chain network.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Vaccine Potency Assay & Vial Integrity Seal Standards</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The vaccine potency assay and vial integrity seal verification protocols form the critical quality control framework that ensures each vaccine dose delivered through the Indian immunisation supply chain maintains the minimum effective antigen content required to generate protective immune response in the vaccinated individual where the vaccine potency assay measures the biological activity of the vaccine antigen using in-vivo or in-vitro assay methods specified in the Indian Pharmacopoeia and WHO technical recommendation series for each vaccine type where the in-vivo potency test for live attenuated vaccines such as BCG measles and polio vaccines measures the ability of the vaccine virus to replicate in susceptible cell culture systems or animal models confirming minimum virus titre above the specified threshold typically expressed as plaque forming units per millilitre or colony forming units per millilitre ensuring sufficient live virus content in each vaccine dose to establish productive infection and generate protective immunity in the vaccinated individual while the in-vitro potency test for inactivated vaccines such as DPT hepatitis B and tetanus vaccines measures the antigen content using enzyme-linked immunosorbent assay or toxin neutralisation methods confirming minimum antigen concentration above the specified threshold expressed as international units per millilitre or micrograms per millilitre ensuring sufficient antigen content to generate protective antibody response after immunisation where the vaccine potency test acceptance criterion requires minimum potency of eighty percent of the declared potency value with lower confidence limit of ninety-five percent confirming that each tested vaccine batch contains sufficient antigen content to provide protective immunity throughout the vaccine shelf life period of typically twenty-four months for liquid vaccines and thirty-six months for lyophilised vaccines where the potency decline during shelf life storage must remain within the specified range when stored at the recommended Refrigerator temperature of two to eight degrees Celsius throughout the complete distribution cycle from manufacturing facility to administration point where the vial integrity seal verification test examines each vaccine vial for container closure system integrity confirming the rubber stopper aluminium seal and flip-off cap provide a hermetic seal that prevents microbial ingress and maintains vaccine sterility throughout the cold chain distribution period using vacuum decay testing or dye ingress testing methodology in accordance with ISO 8362-5 injectable container closure integrity standards confirming container closure integrity of one hundred percent of tested vials ensuring no compromised seals exist that could permit microbial contamination of the vaccine during cold chain storage and distribution.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Cold Chain 2-8 Deg Logistics & Endotoxin Testing</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The vaccine cold chain two to eight degree Celsius logistics and endotoxin testing framework for the Indian vaccine supply chain establishes the temperature-controlled distribution infrastructure and biological safety testing protocols that ensure vaccine products maintain their declared potency safety and sterility throughout the complete distribution cycle from manufacturing facility to immunisation point where the cold chain logistics specification maintains vaccine storage temperature within the range of two to eight degrees Celsius at all points in the distribution chain including the manufacturer cold room the regional vaccine store the district vaccine store the primary health centre refrigerator and the vaccine carrier used for last-mile outreach immunisation sessions where each cold chain node employs calibrated digital temperature loggers with continuous monitoring and GSM-based remote alert systems that trigger automatic notifications when storage temperature exceeds the specified range of two to eight degrees Celsius or when cold chain equipment experiences power failure malfunction or door-open events that could compromise the vaccine storage temperature where the Indian Universal Immunisation Programme operates over twenty-eight thousand cold chain points across the country connected by a network of state-operated refrigerated transport vehicles and contracted cold chain logistics providers maintaining continuous temperature-controlled vaccine movement from the six major vaccine manufacturing facilities in Pune Hyderabad Ahmedabad Mumbai Bangalore and Chennai to immunisation points in all twenty-eight states and eight union territories where the Refrigerator storage facilities at regional and district vaccine stores maintain backup power through diesel generators and solar-powered battery systems ensuring continuous cold chain operation during the frequent power supply interruptions that characterise the electrical infrastructure in many rural and semi-urban areas of India where the endotoxin testing framework measures the level of bacterial endotoxin using the Limulus Amebocyte Lysate test in accordance with the Indian Pharmacopoeia and USP eighty-five bacterial endotoxins test methodology confirming endotoxin content below the specified maximum limit for each vaccine type typically five endotoxin units per kilogram body weight for parenteral vaccines ensuring the vaccine product does not contain endotoxin contamination at levels that could cause pyrogenic reactions fever chills or hypotension in vaccine recipients particularly in paediatric patients who constitute the primary target population for the Indian national immunisation programme.</p></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}



