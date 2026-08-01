import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#166534', '#15803d', '#16a34a', '#22c55e', '#4ade80', '#14532d', '#052e16', '#f0fdf4']
const PRODUCTS = ['Natural Uranium U308 Pellets', 'Enriched UF6 Cylinders', 'Mixed Oxide MOX Fuel', 'Zirconium Cladding Tubes', 'Boron Carbide Control Rods', 'Heavy Water D2O Batch', 'Reactor Grade Plutonium', 'Spent Fuel Assembly Casks']
const FACILITIES = ['NPCIL Tarapur MH', 'DAE Trombay MH', 'NPCIL Rawatbhata RJ', 'NPCIL Kakrapar GJ', 'NPCIL Kudankulam TN', 'BARC Indore MP', 'DAE Hyderabad TS', 'NFC Hyderabad TS']
const STATUSES = ['AERB Licence Valid', 'IAEA Safeguards OK', 'Criticality Safety Check', 'Radiation Shield Audit', 'Containment Integrity Test', 'Transport Security Cleared']

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
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f0fdf4" strokeWidth="6" />
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
    id: `NFL-${String(offset + i + 1).padStart(4, '0')}`,
    facility: FACILITIES[(offset + i) % FACILITIES.length], fuel: PRODUCTS[(offset + i) % PRODUCTS.length],
    status: STATUSES[(offset + i) % STATUSES.length], qty: ri(1, 100, ((offset + i) * 37) % 100) + 1,
    cost: ri(5000000, 850000000, ((offset + i) * 57173) % 845000000) + 5000000,
    date: new Date(2024, ((offset + i) % 12), ri(1, 28, (offset + i) % 28)).toISOString().slice(0, 10),
  }))

const nuclearrecords = [
  { id: 'NFL-0001', facility: 'NPCIL Tarapur MH', fuel: 'Natural Uranium U308 Pellets', status: 'AERB Licence Valid', qty: 50, cost: 120000000, date: '2024-01-05' },
  { id: 'NFL-0002', facility: 'DAE Trombay MH', fuel: 'Enriched UF6 Cylinders', status: 'IAEA Safeguards OK', qty: 12, cost: 480000000, date: '2024-01-18' },
  { id: 'NFL-0003', facility: 'NPCIL Rawatbhata RJ', fuel: 'Mixed Oxide MOX Fuel', status: 'Criticality Safety Check', qty: 30, cost: 720000000, date: '2024-01-31' },
  { id: 'NFL-0004', facility: 'NPCIL Kakrapar GJ', fuel: 'Zirconium Cladding Tubes', status: 'Radiation Shield Audit', qty: 80, cost: 35000000, date: '2024-02-13' },
  { id: 'NFL-0005', facility: 'NPCIL Kudankulam TN', fuel: 'Boron Carbide Control Rods', qty: 24, cost: 85000000, date: '2024-02-26', status: 'Containment Integrity Test' },
  { id: 'NFL-0006', facility: 'BARC Indore MP', fuel: 'Heavy Water D2O Batch', status: 'Transport Security Cleared', qty: 6, cost: 62000000, date: '2024-03-10' },
  { id: 'NFL-0007', facility: 'DAE Hyderabad TS', fuel: 'Reactor Grade Plutonium', status: 'AERB Licence Valid', qty: 4, cost: 810000000, date: '2024-03-23' },
  { id: 'NFL-0008', facility: 'NFC Hyderabad TS', fuel: 'Spent Fuel Assembly Casks', status: 'IAEA Safeguards OK', qty: 8, cost: 550000000, date: '2024-04-05' },
  { id: 'NFL-0009', facility: 'NPCIL Tarapur MH', fuel: 'Natural Uranium U308 Pellets', status: 'Criticality Safety Check', qty: 55, cost: 135000000, date: '2024-04-18' },
  { id: 'NFL-0010', facility: 'DAE Trombay MH', fuel: 'Enriched UF6 Cylinders', status: 'Radiation Shield Audit', qty: 15, cost: 460000000, date: '2024-05-01' },
  { id: 'NFL-0011', facility: 'NPCIL Rawatbhata RJ', fuel: 'Mixed Oxide MOX Fuel', qty: 28, cost: 700000000, date: '2024-05-14', status: 'Containment Integrity Test' },
  { id: 'NFL-0012', facility: 'NPCIL Kakrapar GJ', fuel: 'Zirconium Cladding Tubes', status: 'Transport Security Cleared', qty: 90, cost: 42000000, date: '2024-05-27' },
  { id: 'NFL-0013', facility: 'NPCIL Kudankulam TN', fuel: 'Boron Carbide Control Rods', status: 'AERB Licence Valid', qty: 20, cost: 78000000, date: '2024-06-09' },
  { id: 'NFL-0014', facility: 'BARC Indore MP', fuel: 'Heavy Water D2O Batch', status: 'IAEA Safeguards OK', qty: 5, cost: 58000000, date: '2024-06-22' },
  { id: 'NFL-0015', facility: 'DAE Hyderabad TS', fuel: 'Reactor Grade Plutonium', status: 'Criticality Safety Check', qty: 3, cost: 830000000, date: '2024-07-05' },
  { id: 'NFL-0016', facility: 'NFC Hyderabad TS', fuel: 'Spent Fuel Assembly Casks', qty: 10, cost: 580000000, date: '2024-07-18', status: 'Radiation Shield Audit' },
  { id: 'NFL-0017', facility: 'NPCIL Tarapur MH', fuel: 'Natural Uranium U308 Pellets', status: 'Containment Integrity Test', qty: 60, cost: 145000000, date: '2024-07-31' },
  { id: 'NFL-0018', facility: 'DAE Trombay MH', fuel: 'Enriched UF6 Cylinders', status: 'Transport Security Cleared', qty: 14, cost: 440000000, date: '2024-08-13' },
  { id: 'NFL-0019', facility: 'NPCIL Rawatbhata RJ', fuel: 'Mixed Oxide MOX Fuel', status: 'AERB Licence Valid', qty: 32, cost: 740000000, date: '2024-08-26' },
  { id: 'NFL-0020', facility: 'NPCIL Kakrapar GJ', fuel: 'Zirconium Cladding Tubes', status: 'IAEA Safeguards OK', qty: 85, cost: 38000000, date: '2024-09-08' },
]

export default function NuclearFuelLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})

  const allRecords = [...nuclearrecords, ...genRecords(21), ...genRecords(41)]

  const filteredRecords = useMemo(() => {
    if (!searchQuery && Object.keys(activeFilters).every(k => !activeFilters[k].length)) return allRecords
    const sq = searchQuery.toLowerCase()
    return allRecords.filter(r => { if (sq && !r.id.toLowerCase().includes(sq) && !r.fuel.toLowerCase().includes(sq)) return false; return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string)); })
  }, [searchQuery, activeFilters, allRecords])

  const filterGroups = [
    { key: 'fuel', label: 'Fuel', options: PRODUCTS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.fuel === p).length })) },
    { key: 'facility', label: 'Facility', options: FACILITIES.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.facility === p).length })) },
  ]

  const trendData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m, i) => ({ month: m, shipments: ri(4, 20, allRecords.length * 0.10 + i * 3) }))
  const facilityChart = FACILITIES.map(p => ({ name: p.split(' ').slice(0, 2).join(' '), volume: allRecords.filter(r => r.facility === p).reduce((s, r) => s + r.qty, 0) }))
  const statusPie = STATUSES.map(s => ({ name: s, value: allRecords.filter(r => r.status === s).length }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="nfl-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Nuclear Fuel' }]} />
      <PageHeader title="Nuclear Fuel Logistics" description="Indian nuclear fuel cycle supply chain with AERB Atomic Energy Regulatory Board licence compliance IAEA safeguards verification criticality safety assessment radiation shielding audit containment integrity testing and transport security clearance across 8 NPCIL and DAE nuclear facilities" />
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
            <KpiTile label="Fuel Types" value={PRODUCTS.length} />
            <KpiTile label="Nuclear Facilities" value={FACILITIES.length} />
            <KpiTile label="Avg Shipment Value" value={`₹${(Math.round(allRecords.reduce((s, r) => s + r.cost, 0) / allRecords.length) / 10000000).toFixed(0)}Cr`}/>
          </div>
          <div className="grid grid-cols-6 gap-4">
            <HealthRing label="AERB" value={98} />
            <HealthRing label="IAEA" value={95} />
            <HealthRing label="Critical" value={99} />
            <HealthRing label="Shield" value={97} />
            <HealthRing label="Contain" value={96} />
            <HealthRing label="Transport" value={94} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Nuclear Capacity" value="8.18 GW" />
            <ValueTile label="Reactors Active" value="24 Units" />
            <ValueTile label="Refrigerator Storage" value="6 Shielded" />
            <ValueTile label="Safety Record" value="Zero Incidents" />
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
            placeholder="Search nuclear fuel shipments..."
          />
          <div className="rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-green-100">
                <tr>
                  <th className="p-3 text-left font-medium">ID</th>
                  <th className="p-3 text-left font-medium">Fuel Type</th>
                  <th className="p-3 text-left font-medium">Facility</th>
                  <th className="p-3 text-left font-medium">Status</th>
                  <th className="p-3 text-left font-medium">Qty</th>
                  <th className="p-3 text-left font-medium">Value</th>
                  <th className="p-3 text-left font-medium">Cost Bar</th>
                  <th className="p-3 text-left font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map(record => (
                  <tr key={record.id} className="border-t hover:bg-green-50/50">
                    <td className="p-3 font-mono text-xs">{record.id}</td>
                    <td className="p-3"><ProductBadge name={record.fuel} /></td>
                    <td className="p-3">{record.facility}</td>
                    <td className="p-3"><StatusBadge status={record.status} /></td>
                    <td className="p-3">{record.qty} {['assemblies', 'cylinders', 'bundles', 'casks'][parseInt(record.id.slice(4)) % 4]}</td>
                    <td className="p-3 font-mono">₹{(record.cost / 10000000).toFixed(0)}Cr</td>
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
              <CardHeader><CardTitle>Facility Volume</CardTitle></CardHeader>
              <CardContent>
                <BarChart width={500} height={300} data={facilityChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="volume" fill={COLORS[0]}>
                    {facilityChart.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader><CardTitle>Compliance Status Distribution</CardTitle></CardHeader>
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
              <CardHeader><CardTitle>AERB Nuclear Fuel Licence Framework and Regulatory Compliance</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The Atomic Energy Regulatory Board AERB nuclear fuel licence framework establishes the comprehensive regulatory compliance management system for all nuclear fuel cycle operations in India tracking all fuel fabrication facility licences spent fuel storage authorisations radioactive material transport licences and nuclear installation commissioning permits through the AERB electronic regulatory portal e-LOR where the AERB framework monitors all twenty-four operational nuclear power reactors across seven NPCIL nuclear power stations and two DAE research reactors ensuring each facility maintains a valid nuclear fuel handling licence issued under the Atomic Energy Act 1962 with the AERB portal tracking licence expiry dates fuel cycle activity reporting radiation safety compliance and nuclear material accounting for each facility generating automated one hundred eighty-day pre-expiry alerts for licence renewal requiring submission of updated safety analysis reports radiological emergency preparedness plans nuclear material accounting summaries and periodic safety review updates preventing regulatory non-compliance and operational shutdown caused by lapsed nuclear fuel handling licences where the AERB regulatory inspection programme conducts quarterly announced inspections and semi-annual unannounced inspections at each nuclear facility evaluating fuel handling procedures radiation protection measures criticality safety controls and emergency response readiness generating detailed inspection findings reports with corrective action tracking ensuring all identified safety issues are resolved within mandated timelines where the zero nuclear safety incidents achieved across all Indian nuclear facilities in financial year twenty twenty-six maintaining the exemplary safety record of the Indian nuclear power programme demonstrates the effectiveness of the AERB regulatory framework in ensuring the highest international nuclear safety standards across the entire Indian nuclear fuel cycle supply chain from uranium mining through fuel fabrication through reactor operation through spent fuel management.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>IAEA Safeguards Verification and Nuclear Material Accountancy</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The International Atomic Energy Agency IAEA safeguards verification and nuclear material accountancy protocols ensure the non-proliferation compliance of all Indian civil nuclear fuel cycle operations under the India-specific IAEA safeguards agreement that entered into force following the India-United States civil nuclear cooperation agreement in two thousand eight where the IAEA safeguards verification subsystem tracks all nuclear material movements including uranium ore concentrate yellowcake natural uranium hexafluoride enriched uranium hexafluoride mixed oxide fuel assemblies spent fuel assemblies and separated plutonium across all Indian nuclear facilities subject to IAEA safeguards monitoring confirming that all declared nuclear material flows are accurately reported and verified through a combination of facility design information verification containment and surveillance measures and material accountancy audits where the IAEA deploys containment and surveillance equipment including tamper-indicating seals on nuclear material storage containers and process equipment surveillance cameras at material access points radiation monitors at facility exit points and environmental sampling stations around nuclear facilities providing continuous verification that no undeclared nuclear material activities are occurring at any Indian nuclear facility where the nuclear material accountancy subsystem tracks all nuclear material quantities at each material balance area within each facility using the standardised IAEA material accounting methodology of beginning inventory plus receipts minus shipments minus measured discards equals ending inventory reconciled against the physical inventory verification conducted by IAEA inspectors during each annual physical inventory verification campaign confirming book-to-physical inventory differences fall within the IAEA measurement uncertainty threshold for each nuclear material type ensuring the integrity of nuclear material declarations and preventing any undetected loss or diversion of nuclear material from the Indian civil nuclear fuel cycle where the IAEA safeguards verification data is transmitted in real-time to the IAEA headquarters in Vienna through the secure IAEA Remote Monitoring System enabling continuous safeguards analysis without requiring on-site inspector presence at every facility on every day.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Criticality Safety Assessment and Radiation Shielding Audit Programme</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The criticality safety assessment and radiation shielding audit programme provides the nuclear safety quality assurance framework for Indian nuclear fuel logistics ensuring that all fuel handling storage and transport operations maintain subcritical configurations and adequate radiation shielding protection for workers and the public where the criticality safety assessment subsystem evaluates every fuel configuration during storage handling and transport using validated Monte Carlo neutron transport calculations confirming the effective neutron multiplication factor keff remains below zero point nine five for all normal operating conditions and below one point zero zero even for credible accident scenarios including double-batching events water ingress into fuel storage areas and fuel assembly geometry changes during handling operations ensuring a minimum five percent subcritical safety margin is maintained under all conditions where the criticality safety evaluation considers all nuclear material types including natural uranium with zero point seven percent uranium-235 enrichment enriched uranium with up to five percent uranium-235 enrichment for PHWR fuel assemblies enriched uranium with up to four point two percent uranium-235 enrichment for VVER fuel assemblies and mixed oxide fuel containing plutonium where the radiation shielding audit subsystem evaluates the dose rate levels at all fuel handling areas storage positions transport vehicle loading points and facility boundary locations using calibrated radiation survey meters and thermoluminescent dosimetry TLD badges confirming dose rates remain within the AERB prescribed annual dose limits of twenty millisieverts for radiation workers and one millisievert for public members where the shielding audit verifies the adequacy of lead shielding walls concrete biological shields spent fuel pool water shielding and transport cask shielding for each fuel type and quantity confirming the shielding thickness provides sufficient attenuation to maintain dose rates below the operational area limits of two point five microsieverts per hour and the facility boundary limits of one microsievert per hour ensuring full radiation protection compliance during all nuclear fuel logistics operations.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Containment Integrity and Refrigerator Shielded Storage for Spent Nuclear Fuel</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The containment integrity verification and Refrigerator shielded storage management system for spent nuclear fuel provides the quality assurance framework for ensuring safe long-term storage and transport of irradiated spent fuel assemblies discharged from Indian nuclear reactors where the containment integrity verification subsystem evaluates the structural and leak-tight integrity of spent fuel transport casks and storage containers using a multi-stage testing protocol including helium leak testing confirming leak rates below one times ten to the negative six cubic centimetres per second for the primary containment boundary vacuum hold testing confirming pressure decay rates within acceptable limits and visual inspection under ten-times magnification confirming no surface cracks corrosion pitting or weld defects that could compromise the containment boundary of the spent fuel cask where the containment integrity testing is performed on each cask before every spent fuel transport campaign and at six-month intervals for casks in long-term spent fuel storage service ensuring the containment boundary remains continuously leak-tight throughout the cask service life of twenty years where the Refrigerator shielded storage subsystem provides temperature-controlled and radiation-shielded storage for spent fuel assemblies awaiting reprocessing or final disposal at six shielded storage depots located at major nuclear facilities across India where the Refrigerator storage system maintains spent fuel assemblies in temperature-monitored water pools or dry cask storage configurations with continuous temperature monitoring confirming fuel cladding temperature remains below three hundred fifty degrees Celsius to prevent cladding degradation and fission product release where the Refrigerator storage management system tracks each stored spent fuel assembly by its unique assembly identification number recording its discharge date burnup history current heat generation rate radiation field strength and accumulated decay time providing complete traceability from reactor discharge through storage through transport to the reprocessing or disposal facility.</p></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}



