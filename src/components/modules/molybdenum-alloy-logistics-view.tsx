'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { Hexagon } from 'lucide-react'

interface MolybdenumAlloyRecord {
  id: string
  batchNo: string
  city: string
  manufacturer: string
  alloyGrade: string
  application: string
  meltingPointC: number
  tensileStrengthMPa: number
  investmentCr: number
  status: string
  priority: string
  origin: string
  destination: string
  shipDate: string
  transitDays: number
  zone: string
  remarks: string
}

const molybdenumRecords: MolybdenumAlloyRecord[] = [
  { id: 'MOL-0001', batchNo: 'MOL-B2401', city: 'Mumbai', manufacturer: 'MIDHANI Hyderabad', alloyGrade: 'TZM (Mo-Ti-Zr)', application: 'Die Casting Mould Insert (Mahindra)', meltingPointC: 2610, tensileStrengthMPa: 890, investmentCr: 218, status: 'Delivered', priority: 'Critical', origin: 'MIDHANI Plant Hyderabad (TS)', destination: 'Mahindra Casting Nagpur (MH)', shipDate: '2026-07-20', transitDays: 1, zone: 'West', remarks: 'TZM alloy die insert for Mahindra XUV700 engine block &#8594; 2610&#176;C melting point withstands 350 die cycles &#8594; &#8377;218Cr for 85 tonnes TZM billets &#8594; MIDHANI sole Indian Mo alloy producer &#8594; India importing 70% Mo alloy from China and Austria &#8594; TZM offers 2x thermal fatigue life vs H13 tool steel &#8594; Mahindra ramping aluminium HPDC to 500,000 units/year &#8594; &#8377;12,000Cr Indian Mo die insert market' },
  { id: 'MOL-0002', batchNo: 'MOL-B2402', city: 'Bengaluru', manufacturer: 'Hindustan Aeronautics', alloyGrade: 'Mo-14Re', application: 'Turbine Blade Root (LCA Tejas Mk2)', meltingPointC: 2570, tensileStrengthMPa: 1050, investmentCr: 310, status: 'In Transit', priority: 'Critical', origin: 'HAL Foundry Bengaluru (KA)', destination: 'ADA Bengaluru (KA)', shipDate: '2026-07-22', transitDays: 1, zone: 'South', remarks: 'Mo-14Re rhenium alloy blade root for Tejas Mk2 GE-414 engine &#8594; 1050MPa tensile strength at 1200&#176;C &#8594; &#8377;310Cr for 42 tonnes Mo-Re forgings &#8594; HAL developing indigenous aero-engine hot-section components &#8594; Re addition increases creep resistance 3x vs pure Mo &#8594; Tejas Mk2 targeting 85% indigenous content by 2030 &#8594; &#8377;18,500Cr Indian aerospace Mo alloy demand' },
  { id: 'MOL-0003', batchNo: 'MOL-B2403', city: 'Hyderabad', manufacturer: 'MIDHANI Hyderabad', alloyGrade: 'Mo-5W', application: 'Glass Melting Electrode (Saint-Gobain)', meltingPointC: 2550, tensileStrengthMPa: 780, investmentCr: 165, status: 'Delivered', priority: 'High', origin: 'MIDHANI Plant Hyderabad (TS)', destination: 'Saint-Gobain Sriperumbudur (TN)', shipDate: '2026-07-19', transitDays: 2, zone: 'South', remarks: 'Mo-5W tungsten alloy electrodes for float glass furnace &#8594; 2550&#176;C service temperature in molten glass &#8594; &#8377;165Cr for 120 tonnes Mo-W electrode rods &#8594; Saint-Gobain India operating 6 float glass lines &#8594; Mo electrodes last 18 months vs 6 months for Pt &#8594; 90% cost reduction vs platinum electrode systems &#8594; &#8377;8,400Cr Indian glass-industry Mo electrode market' },
  { id: 'MOL-0004', batchNo: 'MOL-B2404', city: 'Pune', manufacturer: 'Bajaj Steel Ltd', alloyGrade: 'Mo-La2O3', application: 'Welding Electrode Core Wire (Ador Welding)', meltingPointC: 2623, tensileStrengthMPa: 720, investmentCr: 94, status: 'Delayed', priority: 'Medium', origin: 'Bajaj Steel Works Pune (MH)', destination: 'Ador Welding Mumbai (MH)', shipDate: '2026-07-14', transitDays: 2, zone: 'West', remarks: 'Lanthanum-doped Mo core wire for high-temp welding electrodes &#8594; 2623&#176;C melting point matches pure Mo &#8594; &#8377;94Cr for 55 tonnes Mo-La core wire &#8594; La2O3 dispersion improves recrystallization resistance &#8594; Ador Welding supplying ISRO and BARC welding consumables &#8594; La-doped Mo retains ductility after 90% cold work &#8594; &#8377;4,200Cr Indian specialty welding electrode market' },
  { id: 'MOL-0005', batchNo: 'MOL-B2405', city: 'Chennai', manufacturer: 'IGCAR Kalpakkam', alloyGrade: 'Mo-41Re', application: 'Space Reactor Radiation Shield (ISRO)', meltingPointC: 2540, tensileStrengthMPa: 1200, investmentCr: 420, status: 'In Transit', priority: 'Critical', origin: 'IGCAR Kalpakkam (TN)', destination: 'ISRO Thiruvananthapuram (KL)', shipDate: '2026-07-23', transitDays: 1, zone: 'South', remarks: 'Mo-41Re shield for ISRO space nuclear reactor prototype &#8594; 1200MPa strength with excellent neutron absorption &#8594; &#8377;420Cr for 18 tonnes Mo-Re plate &#8594; ISRO developing 100kW space reactor for Gaganyaan follow-on &#8594; Mo-Re alloy rated for 10-year orbital service &#8594; IGCAR collaborating with BARC on reactor materials &#8594; &#8377;22,000Cr projected Indian space reactor materials demand' },
  { id: 'MOL-0006', batchNo: 'MOL-B2406', city: 'Noida', manufacturer: 'DMRDL Delhi', alloyGrade: 'TZC (Mo-Ti-Zr-C)', application: 'Missile Nozzle Throat (DRDO Agni-VI)', meltingPointC: 2630, tensileStrengthMPa: 980, investmentCr: 275, status: 'Processing', priority: 'Critical', origin: 'DMRDL Research Centre Delhi', destination: 'DRDO Hyderabad (TS)', shipDate: '2026-07-25', transitDays: 1, zone: 'North', remarks: 'TZC alloy throat insert for Agni-VI solid rocket nozzle &#8594; 2630&#176;C withstands 3200&#176;C peak for 120 seconds &#8594; &#8377;275Cr for 28 tonnes TZC throat sections &#8594; DRDO DMRDL developing next-gen missile materials &#8594; TZC outperforms C/C composite by 40% in erosion rate &#8594; Agni-VI intercontinental range 8,000+ km &#8594; &#8377;15,200Cr Indian strategic Mo alloy programme' },
  { id: 'MOL-0007', batchNo: 'MOL-B2407', city: 'Kolkata', manufacturer: 'Hindalco Industries', alloyGrade: 'Mo-Cu (15/85)', application: 'Heat Sink Baseplate (BEL Defence)', meltingPointC: 1084, tensileStrengthMPa: 560, investmentCr: 72, status: 'Delivered', priority: 'High', origin: 'Hindalco R&amp;D Kolkata (WB)', destination: 'BEL Ghaziabad (UP)', shipDate: '2026-07-17', transitDays: 2, zone: 'East', remarks: 'Mo-Cu composite heat sink for defence AESA radar module &#8594; CTE matched to GaAs substrate &#177;1 ppm/K &#8594; &#8377;72Cr for 95 tonnes Mo-Cu plate &#8594; BEL manufacturing Uttam AESA radar for Tejas &#8594; Mo-Cu offers 3x thermal conductivity vs CuW &#8594; Hindalco developing Mo-Cu via powder metallurgy &#8594; &#8377;5,800Cr Indian defence thermal management market' },
  { id: 'MOL-0008', batchNo: 'MOL-B2408', city: 'Ahmedabad', manufacturer: 'Reliance SBR', alloyGrade: 'Pure Mo (99.95%)', application: 'Petrochemical Catalyst Support (RIL Jamnagar)', meltingPointC: 2623, tensileStrengthMPa: 550, investmentCr: 128, status: 'Delivered', priority: 'Medium', origin: 'Reliance SBR Ahmedabad (GJ)', destination: 'RIL Jamnagar Refinery (GJ)', shipDate: '2026-07-16', transitDays: 1, zone: 'West', remarks: 'High-purity Mo mesh catalyst support for hydrocracking reactor &#8594; 2623&#176;C melting point in H2S-rich 450&#176;C service &#8594; &#8377;128Cr for 65 tonnes pure Mo mesh &#8594; RIL Jamnagar world largest refinery complex 1.24 million bpd &#8594; Mo mesh replaces Inconel at 1/3 the cost &#8594; Catalyst life extended 2.5 years with Mo support &#8594; &#8377;9,600Cr Indian refinery Mo catalyst market' },
  { id: 'MOL-0009', batchNo: 'MOL-B2409', city: 'Coimbatore', manufacturer: 'Elgi Ultra Castings', alloyGrade: 'Mo-Ni (50/50)', application: 'Sputtering Target (Bharat Semicon)', meltingPointC: 1310, tensileStrengthMPa: 680, investmentCr: 195, status: 'In Transit', priority: 'High', origin: 'Elgi Castings Coimbatore (TN)', destination: 'Bharat Semi Bengaluru (KA)', shipDate: '2026-07-21', transitDays: 1, zone: 'South', remarks: 'Mo-Ni binary sputtering target for 28nm logic node &#8594; Homogeneous 50/50 microstructure &#177;0.5% &#8594; &#8377;195Cr for 12 tonnes Mo-Ni target blanks &#8594; Bharat Semi fab targeting domestic chip production &#8594; Mo-Ni targets for transistor gate electrode &#8594; Elgi diversifying from textile machinery to semiconductor materials &#8594; &#8377;14,800Cr Indian semiconductor sputtering target demand' },
  { id: 'MOL-0010', batchNo: 'MOL-B2410', city: 'Jaipur', manufacturer: 'Rajasthan State Mines', alloyGrade: 'Pure Mo (99.9%)', application: 'X-Ray Tube Anode (Trivitron Healthcare)', meltingPointC: 2623, tensileStrengthMPa: 520, investmentCr: 88, status: 'Processing', priority: 'Medium', origin: 'RSM Processing Jaipur (RJ)', destination: 'Trivitron Chennai (TN)', shipDate: '2026-07-24', transitDays: 3, zone: 'North', remarks: 'Rotating Mo anode disc for CT scanner X-ray tube &#8594; 2623&#176;C melting point enables 2MW peak tube power &#8594; &#8377;88Cr for 8 tonnes Mo anode blanks &#8594; Trivitron India largest medical imaging OEM &#8594; India importing 85% of medical-grade Mo discs &#8594; RSM leveraging Rajasthan Mo deposits &#8594; &#8377;3,200Cr Indian medical X-ray tube anode market' },
  { id: 'MOL-0011', batchNo: 'MOL-B2411', city: 'Bhubaneswar', manufacturer: 'NALCO Smelter', alloyGrade: 'Mo-Si-B', application: 'UHTC Coating (ISRO VSSC)', meltingPointC: 2100, tensileStrengthMPa: 1150, investmentCr: 340, status: 'Delivered', priority: 'Critical', origin: 'NALCO Smelter Angul (OD)', destination: 'VSSC Thiruvananthapuram (KL)', shipDate: '2026-07-15', transitDays: 2, zone: 'East', remarks: 'Mo-Si-B ultrahigh-temperature coating for reusable launch vehicle &#8594; 2100&#176;C oxidation limit exceeds SiC by 400&#176;C &#8594; &#8377;340Cr for 5.2 tonnes Mo-Si-B coating powder &#8594; ISRO RLV TD program advancing to orbital version &#8594; Mo-Si-B coating enables 100 re-entry cycles vs 10 for SiC &#8594; NALCO partnering ISRO on high-temp materials &#8594; &#8377;19,500Cr Indian space thermal protection market' },
  { id: 'MOL-0012', batchNo: 'MOL-B2412', city: 'Guwahati', manufacturer: 'Oil India Ltd', alloyGrade: 'TZM', application: 'Downhole Logging Tool (ONGC Assam)', meltingPointC: 2610, tensileStrengthMPa: 890, investmentCr: 56, status: 'In Transit', priority: 'High', origin: 'Oil India Jorhat (AS)', destination: 'ONGC Jorhat (AS)', shipDate: '2026-07-18', transitDays: 1, zone: 'East', remarks: 'TZM alloy pressure housing for deep-well MWD tool &#8594; 2610&#176;C melting point at 200&#176;C wellbore &#8594; &#8377;56Cr for 15 tonnes TZM tube stock &#8594; ONGC drilling 6,000m+ wells in Assam basin &#8594; TZM withstands 30,000 psi H2S service &#8594; India drilling 1,200 new wells/year &#8594; &#8377;6,100Cr Indian oilfield Mo alloy market' },
  { id: 'MOL-0013', batchNo: 'MOL-B2413', city: 'Gandhinagar', manufacturer: 'Gujarat Fluorochemicals', alloyGrade: 'Mo-Hf-C', application: 'Plasma Torch Electrode (Linde India)', meltingPointC: 2580, tensileStrengthMPa: 950, investmentCr: 142, status: 'Processing', priority: 'Medium', origin: 'GFCL Gandhinagar (GJ)', destination: 'Linde India Vadodara (GJ)', shipDate: '2026-07-26', transitDays: 1, zone: 'West', remarks: 'Mo-Hf-C alloy electrode for 5MW plasma torch &#8594; 2580&#176;C service in argon plasma at 15,000K &#8594; &#8377;142Cr for 22 tonnes Mo-Hf-C electrode stock &#8594; Linde India expanding gasification capacity &#8594; Electrode life 800 hours vs 200 for Cu &#8594; GFCL India sole Mo-Hf-C producer &#8594; &#8377;7,800Cr Indian plasma-process Mo electrode demand' },
  { id: 'MOL-0014', batchNo: 'MOL-B2414', city: 'Lucknow', manufacturer: 'Tata Advanced Systems', alloyGrade: 'Mo-30W', application: 'Kinetic Energy Penetrator Core (OFB Kanpur)', meltingPointC: 2600, tensileStrengthMPa: 1100, investmentCr: 205, status: 'Delayed', priority: 'Critical', origin: 'TASL Lucknow (UP)', destination: 'OFB Kanpur (UP)', shipDate: '2026-07-13', transitDays: 1, zone: 'North', remarks: 'Mo-30W depleted uranium alternative penetrator core &#8594; 2600&#176;C melting point with 1100MPa hardness &#8594; &#8377;205Cr for 38 tonnes Mo-W penetrator rods &#8594; Indian Army seeking DU-free anti-tank ammunition &#8594; Mo-30W density 14.3 g/cc vs DU 19.1 g/cc &#8594; TASL collaborating OFB on ammunition modernization &#8594; &#8377;16,500Cr Indian defence Mo-W alloy programme' },
]

const tabs = ['Dashboard', 'Registry', 'Analytics', 'Insights'] as const
type TabType = typeof tabs[number]

export default function MolybdenumAlloyLogisticsView() {
  const [activeTab, setActiveTab] = useState<TabType>('Dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<Record<string, string[]>>({})

  const toggleFilter = (key: string, value: string) => {
    setFilters(prev => {
      const current = prev[key] || []
      if (current.includes(value)) {
        const updated = current.filter(v => v !== value)
        if (updated.length === 0) {
          const next = { ...prev }
          delete next[key]
          return next
        }
        return { ...prev, [key]: updated }
      }
      return { ...prev, [key]: [...current, value] }
    })
  }

  const filtered = useMemo(() => {
    return molybdenumRecords.filter(r => {
      const matchesSearch = searchQuery === '' ||
        Object.values(r).some(v => String(v).toLowerCase().includes(searchQuery.toLowerCase()))
      if (!matchesSearch) return false
      for (const [key, values] of Object.entries(filters)) {
        if (values.length === 0) continue
        const rv = String((r as unknown as Record<string, unknown>)[key] ?? '')
        if (!values.some(v => rv.toLowerCase().includes(v.toLowerCase()))) return false
      }
      return true
    })
  }, [searchQuery, filters])

  const totalInvestment = useMemo(() =>
    molybdenumRecords.reduce((s: number, r) => s + r.investmentCr, 0), [])

  const cityMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of molybdenumRecords) {
      map[r.city] = (map[r.city] || 0) + r.investmentCr
    }
    return map
  }, [])

  const gradeMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of molybdenumRecords) {
      map[r.alloyGrade] = (map[r.alloyGrade] || 0) + 1
    }
    return map
  }, [])

  const statusCounts = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of molybdenumRecords) {
      map[r.status] = (map[r.status] || 0) + 1
    }
    return map
  }, [])

  const statusColorMap: Record<string, string> = {
    Delivered: 'bg-green-100 text-green-800',
    'In Transit': 'bg-blue-100 text-blue-800',
    Processing: 'bg-yellow-100 text-yellow-800',
    Delayed: 'bg-red-100 text-red-800',
  }

  const maxBarValue = Math.max(...(Object.values(cityMap) as number[]), 1)

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Molybdenum Alloy Logistics Command"
        description={`India high-temperature molybdenum alloy supply chain tracking &#8594; ${molybdenumRecords.length} shipments &#8594; ${totalInvestment.toLocaleString('en-IN')} Cr total investment &#8594; TZM, Mo-Re, Mo-Si-B and more`}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-violet-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Shipments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-violet-700">{molybdenumRecords.length}</div>
            <p className="text-xs text-muted-foreground">Mo alloy batches tracked</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-violet-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Investment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-violet-700">&#8377;{totalInvestment.toLocaleString('en-IN')} Cr</div>
            <p className="text-xs text-muted-foreground">Across all manufacturers</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-violet-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Alloy Grades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-violet-700">{Object.keys(gradeMap).length}</div>
            <p className="text-xs text-muted-foreground">Distinct Mo alloy types</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-violet-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Delayed Shipments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{statusCounts['Delayed'] || 0}</div>
            <p className="text-xs text-muted-foreground">Require immediate attention</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-2 border-b pb-2">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-t-lg font-medium text-sm transition-colors ${activeTab === tab ? 'bg-violet-600 text-white shadow-sm' : 'bg-muted text-muted-foreground hover:bg-violet-100'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex gap-4 mb-4">
        <Input
          placeholder="Search molybdenum alloy shipments..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        {activeTab === 'Registry' && (
          <div className="flex flex-wrap gap-2">
            {['status', 'priority', 'zone'].map(key => (
              <div key={key} className="flex flex-wrap gap-1">
                {[...new Set(molybdenumRecords.map(r => String((r as unknown as Record<string, unknown>)[key] ?? '')))].map(v => (
                  <button
                    key={v}
                    onClick={() => toggleFilter(key, v)}
                    className={`px-2 py-1 text-xs rounded-full border transition-colors ${(filters[key] || []).includes(v) ? 'bg-violet-600 text-white border-violet-600' : 'bg-white text-gray-600 border-gray-300 hover:border-violet-400'}`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {activeTab === 'Dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Investment by City (&#8377; Cr)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {(Object.entries(cityMap) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([city, val]) => (
                  <div key={city} className="flex items-center gap-3">
                    <span className="text-sm w-24 truncate text-right">{city}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-600 transition-all duration-500"
                        style={{ width: `${Math.max((val / maxBarValue) * 100, 1)}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-16 text-right">&#8377;{val}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Alloy Grade Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {(Object.entries(gradeMap) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([grade, count]) => (
                  <div key={grade} className="flex items-center justify-between p-2 bg-violet-50 rounded-lg border border-violet-100">
                    <span className="text-xs font-medium truncate mr-2">{grade}</span>
                    <Badge variant="secondary" className="bg-violet-600 text-white shrink-0">{count}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'Registry' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Shipment Registry ({filtered.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-violet-50">
                    <th className="text-left p-3 font-medium">Batch</th>
                    <th className="text-left p-3 font-medium">City</th>
                    <th className="text-left p-3 font-medium">Manufacturer</th>
                    <th className="text-left p-3 font-medium">Grade</th>
                    <th className="text-left p-3 font-medium">Application</th>
                    <th className="text-left p-3 font-medium">Melting Pt (&#176;C)</th>
                    <th className="text-left p-3 font-medium">Strength (MPa)</th>
                    <th className="text-left p-3 font-medium">Invest (&#8377; Cr)</th>
                    <th className="text-left p-3 font-medium">Status</th>
                    <th className="text-left p-3 font-medium">Priority</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(r => (
                    <tr key={r.id} className={`border-b hover:bg-violet-50/50 transition-colors ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}>
                      <td className="p-3 font-mono text-xs">{r.batchNo}</td>
                      <td className="p-3">{r.city}</td>
                      <td className="p-3 truncate max-w-[140px]">{r.manufacturer}</td>
                      <td className="p-3 text-xs">{r.alloyGrade}</td>
                      <td className="p-3 truncate max-w-[160px]">{r.application}</td>
                      <td className="p-3 text-right">{r.meltingPointC.toLocaleString()}</td>
                      <td className="p-3 text-right">{r.tensileStrengthMPa.toLocaleString()}</td>
                      <td className="p-3 text-right font-medium">&#8377;{r.investmentCr}</td>
                      <td className="p-3"><Badge className={`${statusColorMap[r.status] || 'bg-gray-100'} text-xs`}>{r.status}</Badge></td>
                      <td className="p-3"><Badge variant="outline" className="text-xs">{r.priority}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'Analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Status Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(Object.entries(statusCounts) as [string, number][]).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${status === 'Delivered' ? 'bg-green-500' : status === 'In Transit' ? 'bg-blue-500' : status === 'Processing' ? 'bg-yellow-500' : 'bg-red-500'}`} />
                      <span className="text-sm">{status}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${status === 'Delivered' ? 'bg-green-500' : status === 'In Transit' ? 'bg-blue-500' : status === 'Processing' ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ width: `${(count / molybdenumRecords.length) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tensile Strength vs Melting Point</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {molybdenumRecords.sort((a, b) => b.tensileStrengthMPa - a.tensileStrengthMPa).slice(0, 8).map(r => (
                  <div key={r.id} className="flex items-center gap-3">
                    <span className="text-xs w-20 truncate">{r.alloyGrade}</span>
                    <div className="flex-1 flex gap-1 items-center">
                      <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                        <div className="h-full rounded-full bg-violet-500" style={{ width: `${(r.tensileStrengthMPa / 1400) * 100}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground w-16 text-right">{r.tensileStrengthMPa}MPa</span>
                    </div>
                    <span className="text-xs text-muted-foreground w-16 text-right">{r.meltingPointC}&#176;C</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Priority Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(['Critical', 'High', 'Medium', 'Low'] as const).map(p => {
                  const count = molybdenumRecords.filter(r => r.priority === p).length
                  return (
                    <div key={p} className="flex items-center justify-between">
                      <span className="text-sm">{p}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-100 rounded-full h-2 overflow-hidden">
                          <div className="h-full rounded-full bg-violet-500" style={{ width: `${(count / molybdenumRecords.length) * 100}%` }} />
                        </div>
                        <span className="text-sm font-medium">{count}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Zone-wise Investment (&#8377; Cr)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {(Object.entries(
                  molybdenumRecords.reduce((s: Record<string, number>, r) => {
                    s[r.zone] = (s[r.zone] || 0) + r.investmentCr
                    return s
                  }, {})
                ) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([zone, val]) => (
                  <div key={zone} className="flex items-center gap-3">
                    <span className="text-sm w-16">{zone}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-violet-400 to-purple-500" style={{ width: `${(val / totalInvestment) * 100}%` }} />
                    </div>
                    <span className="text-sm font-medium w-20 text-right">&#8377;{val}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'Insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-l-4 border-l-violet-500">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Strategic Material Security</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                India imports 70% of molybdenum alloy requirements from China and Austria. MIDHANI (Hyderabad) remains the sole domestic producer of TZM and Mo-Re alloys for defence and aerospace. The &#8377;2,708 Cr current batch portfolio covers 14 distinct alloy grades, but strategic stockpile of 6 months minimum is recommended given geopolitical risks. Mo-14Re and Mo-41Re are designated strategic materials under DRDO&amp;apos;s critical alloy programme.
              </p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-violet-500">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Aerospace-Grade Demand Surge</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Tejas Mk2 (GE-414 engine) and Agni-VI programmes drive 40% of total Mo alloy demand. Mo-14Re blade roots and TZC nozzle throats represent &#8377;585 Cr combined. HAL and DMRDL capacity expansion to 200 tonnes/year by 2028 is critical for indigenisation. ISRO&amp;apos;s Mo-Si-B UHTC coating programme for reusable launch vehicles is a &#8377;19,500 Cr addressable market.
              </p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-violet-500">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Semiconductor Sputtering Opportunity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Bharat Semi and Tata Electronics fabs creating new demand for Mo-Ni and pure Mo sputtering targets. The &#8377;14,800 Cr target market is currently 95% imported from Japan (ULVAC) and Germany (Plansee). Elgi Ultra and Hindalco are developing domestic PVD target manufacturing capability. First indigenous 28nm Mo-Ni targets expected by Q2 2027.
              </p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-violet-500">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Delayed Shipments Alert</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                MOL-B2404 (Mo-La2O3 welding core wire, Pune&#8594;Mumbai) delayed 10 days due to billet quality rejection at Bajaj Steel. MOL-B2414 (Mo-30W penetrator core, Lucknow&#8594;Kanpur) delayed 13 days awaiting final DRDO metallurgical certification. Both shipments flagged Critical and High priority respectively. Expedited logistics via dedicated transport arranged. Total delayed value &#8377;299 Cr.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
