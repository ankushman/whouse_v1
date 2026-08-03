'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { Atom } from 'lucide-react'

interface CobaltAlloyRecord {
  id: string
  batchNo: string
  city: string
  manufacturer: string
  alloyGrade: string
  application: string
  cobaltPercent: number
  maxTempCelsius: number
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

const cobaltRecords: CobaltAlloyRecord[] = [
  { id: 'COA-0001', batchNo: 'COA-B2401', city: 'Bengaluru', manufacturer: 'HAL Aero Engines', alloyGrade: 'Stellite 6 (Co-Cr-W)', application: 'Turbine Blade Tip (LCA Tejas Mk2)', cobaltPercent: 58, maxTempCelsius: 1050, investmentCr: 325, status: 'Delivered', priority: 'Critical', origin: 'HAL Engine Division Bengaluru (KA)', destination: 'HAL Aero Engine Test (KA)', shipDate: '2026-07-20', transitDays: 1, zone: 'South', remarks: 'Stellite 6 cobalt alloy blade tip for Tejas F404-GE-IN20 &#8594; 58% Co with 30% Cr and 4.5% W &#8594; &#8377;325Cr for 38 tonnes Stellite investment castings &#8594; HAL producing 150 Tejas Mk2 fighter jet engines/year &#8594; Stellite 6 offers 4x cavitation erosion resistance vs stainless steel &#8594; India importing 85% Stellite from Deloro Stellite (Canada) &#8594; &#8377;22,000Cr Indian aerospace Co alloy demand' },
  { id: 'COA-0002', batchNo: 'COA-B2402', city: 'Hyderabad', manufacturer: 'MIDHANI Hyderabad', alloyGrade: 'Haynes 25 (L605)', application: 'Gas Turbine Combustor Liner (BHEL)', cobaltPercent: 50, maxTempCelsius: 980, investmentCr: 248, status: 'In Transit', priority: 'Critical', origin: 'MIDHANI Plant Hyderabad (TS)', destination: 'BHEL Hyderabad (TS)', shipDate: '2026-07-22', transitDays: 1, zone: 'South', remarks: 'Haynes 25 cobalt superalloy combustor liner for 800MW gas turbine &#8594; 50% Co with 20% Cr 15% W 10% Ni &#8594; &#8377;248Cr for 55 tonnes sheet and forgings &#8594; BHEL manufacturing 42 gas turbines for NTPC and Reliance Power &#8594; Haynes 25 retains 90% strength at 980&#176;C vs 55% for Ni superalloys &#8594; &#8377;18,500Cr Indian gas turbine Co alloy market' },
  { id: 'COA-0003', batchNo: 'COA-B2403', city: 'Mumbai', manufacturer: 'Hindustan Aeronautics', alloyGrade: 'MP159 (Co-Ni-Cr-Mo)', application: 'Landing Gear Actuator Bolt (Air India MRO)', cobaltPercent: 36, maxTempCelsius: 650, investmentCr: 142, status: 'Delivered', priority: 'High', origin: 'HAL Nashik (MH)', destination: 'Air India MRO Mumbai (MH)', shipDate: '2026-07-19', transitDays: 2, zone: 'West', remarks: 'MP159 cobalt alloy ultra-high-strength bolt for Boeing 737 NG landing gear &#8594; 36% Co with 25.5% Ni 7% Cr 3% Mo &#8594; &#8377;142Cr for 12 tonnes bolt stock &#8594; Air India MRO maintaining 180 narrow-body aircraft &#8594; MP159 achieves 1,860MPa ultimate tensile strength &#8594; Certified to AMS 5832 and Boeing BAC standards &#8594; &#8377;9,800Cr Indian aerospace fastener market' },
  { id: 'COA-0004', batchNo: 'COA-B2404', city: 'Pune', manufacturer: 'Tata Advanced Materials', alloyGrade: 'UMCo-50', application: 'Industrial Gas Valve Seat (Linde India)', cobaltPercent: 50, maxTempCelsius: 1100, investmentCr: 95, status: 'Delayed', priority: 'Medium', origin: 'TAM India Pune (MH)', destination: 'Linde India Vadodara (GJ)', shipDate: '2026-07-14', transitDays: 3, zone: 'West', remarks: 'UMCo-50 cobalt alloy valve seat for oxygen production plant &#8594; 50% Co with 28% Cr and 1% C &#8594; &#8377;95Cr for 18 tonnes valve seat blanks &#8594; Linde India producing 2,500 TPD industrial gases &#8594; UMCo-50 resists oxidation at 1100&#176;C for 100,000+ hours &#8594; Delayed 10 days due to raw cobalt supply disruption from DRC &#8594; &#8377;6,200Cr Indian industrial gas valve alloy market' },
  { id: 'COA-0005', batchNo: 'COA-B2405', city: 'Chennai', manufacturer: 'IGCAR Kalpakkam', alloyGrade: 'Co-Re (Co-25Re)', application: 'Nuclear Reactor Control Rod Drive (BHAVINI)', cobaltPercent: 75, maxTempCelsius: 1200, investmentCr: 410, status: 'Processing', priority: 'Critical', origin: 'IGCAR Kalpakkam (TN)', destination: 'BHAVINI Kalpakkam (TN)', shipDate: '2026-07-25', transitDays: 1, zone: 'South', remarks: 'Co-25Re rhenium alloy for Prototype Fast Breeder Reactor control rod &#8594; 75% Co with 25% Re for ultra-high temp nuclear service &#8594; &#8377;410Cr for 8 tonnes Co-Re bar stock &#8594; PFBR 500MW sodium-cooled fast reactor &#8594; Co-Re achieves 1200&#176;C creep strength for 60-year reactor life &#8594; IGCAR developing indigenous nuclear-grade Co alloys &#8594; &#8377;28,000Cr Indian nuclear Co alloy programme' },
  { id: 'COA-0006', batchNo: 'COA-B2406', city: 'Noida', manufacturer: 'DRDO DMRL', alloyGrade: 'Stellite 21 (Co-Cr-Mo)', application: 'Hip Implant Femoral Stem (SCTIMST)', cobaltPercent: 63, maxTempCelsius: 400, investmentCr: 78, status: 'Delivered', priority: 'High', origin: 'DRDO DMRL Hyderabad (TS)', destination: 'SCTIMST Trivandrum (KL)', shipDate: '2026-07-17', transitDays: 3, zone: 'North', remarks: 'Stellite 21 Co-Cr-Mo alloy for hip joint femoral stem implant &#8594; 63% Co with 28% Cr and 6% Mo &#8594; &#8377;78Cr for 4.5 tonnes biomedical forgings &#8594; SCTIMST performing 12,000 joint replacements/year &#8594; Co-Cr-Mo ASTM F75 certified for 30-year implant life &#8594; India importing 70% orthopaedic Co alloy from Zimmer Biomet &#8594; &#8377;5,400Cr Indian orthopaedic Co alloy market' },
  { id: 'COA-0007', batchNo: 'COA-B2407', city: 'Kolkata', manufacturer: 'Hindalco Industries', alloyGrade: 'Vitallium (Co-Cr-Mo)', application: 'Dental Crown Coping (Colgate-Palmolive R&amp;D)', cobaltPercent: 65, maxTempCelsius: 350, investmentCr: 42, status: 'In Transit', priority: 'Medium', origin: 'Hindalco R&amp;D Kolkata (WB)', destination: 'Dental Labs Mumbai (MH)', shipDate: '2026-07-21', transitDays: 3, zone: 'East', remarks: 'Vitallium Co-Cr-Mo alloy for dental prosthesis framework &#8594; 65% Co with 30% Cr and 5% Mo &#8594; &#8377;42Cr for 2.8 tonnes dental alloy ingots &#8594; India 1.2 billion population with 300 million needing dental care &#8594; Vitallium lighter than gold with superior fatigue resistance &#8594; Hindalco diversifying from aluminium to biomedical alloys &#8594; &#8377;3,800Cr Indian dental alloy market' },
  { id: 'COA-0008', batchNo: 'COA-B2408', city: 'Ahmedabad', manufacturer: 'Reliance SBR', alloyGrade: 'Tribaloy T-400', application: 'Pump Shaft Sleeve (RIL Jamnagar)', cobaltPercent: 62, maxTempCelsius: 800, investmentCr: 135, status: 'Delivered', priority: 'High', origin: 'Reliance SBR Ahmedabad (GJ)', destination: 'RIL Jamnagar Refinery (GJ)', shipDate: '2026-07-16', transitDays: 1, zone: 'West', remarks: 'Tribaloy T-400 cobalt-based wear alloy for refinery pump shaft &#8594; 62% Co with 29% Mo and 8% Cr &#8594; &#8377;135Cr for 32 tonnes sleeve stock &#8594; RIL Jamnagar world largest refinery processing 1.24 million bpd &#8594; Tribaloy T-400 wear rate 1/10th of Stellite at 500&#176;C &#8594; Reliance targeting 80% import substitution for refinery wear parts &#8594; &#8377;10,200Cr Indian refinery Co alloy demand' },
  { id: 'COA-0009', batchNo: 'COA-B2409', city: 'Jaipur', manufacturer: 'Rajasthan State Mines', alloyGrade: 'Co-Cr-W-C (Stellite 1)', application: 'Diamond Mining Drill Button (NMDC)', cobaltPercent: 58, maxTempCelsius: 750, investmentCr: 165, status: 'Processing', priority: 'High', origin: 'RSM Processing Jaipur (RJ)', destination: 'NMDC Bailadila (CG)', shipDate: '2026-07-24', transitDays: 4, zone: 'North', remarks: 'Stellite 1 cobalt alloy insert for hard-rock mining drill bit &#8594; 58% Co with 30% Cr 12.5% W and 2.5% C &#8594; &#8377;165Cr for 22 tonnes drill button blanks &#8594; NMDC India largest iron ore miner producing 45 MT/year &#8594; Stellite 1 drill life 3,000m vs 800m for tungsten carbide &#8594; India importing 90% mining wear alloys &#8594; &#8377;12,500Cr Indian mining Co alloy market' },
  { id: 'COA-0010', batchNo: 'COA-B2410', city: 'Coimbatore', manufacturer: 'Elgi Ultra Castings', alloyGrade: 'Co-Sm (Co-35Sm)', application: 'Permanent Magnet Segment (Bharat Heavy Electricals)', cobaltPercent: 65, maxTempCelsius: 350, investmentCr: 188, status: 'Delivered', priority: 'Critical', origin: 'Elgi Castings Coimbatore (TN)', destination: 'BHEL Bhopal (MP)', shipDate: '2026-07-18', transitDays: 2, zone: 'South', remarks: 'Co-Sm rare earth permanent magnet for 800MW turbo-generator rotor &#8594; 65% Co with 35% Sm for maximum energy product 30 MGOe &#8594; &#8377;188Cr for 15 tonnes magnet segments &#8594; BHEL India largest power equipment manufacturer &#8594; Co-Sm magnets operate to 350&#176;C vs NdFeB limited to 180&#176;C &#8594; BHEL targeting 100% indigenous generator magnets &#8594; &#8377;15,800Cr Indian power magnet market' },
  { id: 'COA-0011', batchNo: 'COA-B2411', city: 'Bhubaneswar', manufacturer: 'NALCO Smelter', alloyGrade: 'Co-Mo Catalyst (Co-5Mo)', application: 'Hydrodesulfurization Catalyst (Indian Oil)', cobaltPercent: 95, maxTempCelsius: 400, investmentCr: 215, status: 'In Transit', priority: 'Critical', origin: 'NALCO Smelter Angul (OD)', destination: 'Indian Oil Paradip (OD)', shipDate: '2026-07-23', transitDays: 1, zone: 'East', remarks: 'Co-Mo on alumina catalyst for diesel hydrodesulfurization &#8594; 95% Co active phase with 5% Mo promoter &#8594; &#8377;215Cr for 85 tonnes catalyst pellets &#8594; Indian Oil Paradip 15 MMTPA BS-VI refinery &#8594; Co-Mo catalyst reduces sulfur from 500ppm to below 10ppm &#8594; India BS-VI mandate covering 100% fuel production &#8594; &#8377;16,200Cr Indian refinery catalyst market' },
  { id: 'COA-0012', batchNo: 'COA-B2412', city: 'Guwahati', manufacturer: 'Oil India Ltd', alloyGrade: 'Stellite 6B', application: 'Wellhead Gate Valve (ONGC Jorhat)', cobaltPercent: 58, maxTempCelsius: 650, investmentCr: 68, status: 'Delayed', priority: 'High', origin: 'Oil India Jorhat (AS)', destination: 'ONGC Jorhat (AS)', shipDate: '2026-07-13', transitDays: 1, zone: 'East', remarks: 'Stellite 6B overlay on wellhead gate valve for H2S service &#8594; 58% Co with 30% Cr and 4.5% W &#8594; &#8377;68Cr for 8 tonnes Stellite welding wire &#8594; ONGC drilling 200 new wells/year in Assam basin &#8594; Stellite 6B resists pitting in sour gas 25,000psi service &#8594; Delayed 11 days awaiting Stellite wire import clearance &#8594; &#8377;5,600Cr Indian oilfield Co alloy market' },
  { id: 'COA-0013', batchNo: 'COA-B2413', city: 'Gandhinagar', alloyGrade: 'Co-WC Composite (Co-10WC)', manufacturer: 'Gujarat Fluorochemicals', application: 'Wire Drawing Die (Hindalco Cable)', cobaltPercent: 90, maxTempCelsius: 500, investmentCr: 56, status: 'Processing', priority: 'Medium', origin: 'GFCL Gandhinagar (GJ)', destination: 'Hindalco Renukoot (UP)', shipDate: '2026-07-26', transitDays: 2, zone: 'West', remarks: 'Co-WC cemented carbide wire drawing die for aluminium cable production &#8594; 90% Co binder with 10% ultrafine WC particles &#8594; &#8377;56Cr for 4 tonnes die blanks &#8594; Hindalco India largest aluminium conductor producer &#8594; Co-WC die life 500,000m vs 100,000m for pure WC &#8594; India producing 2.8 million MT aluminium cable/year &#8594; &#8377;4,800Cr Indian wire drawing die market' },
  { id: 'COA-0014', batchNo: 'COA-B2414', city: 'Lucknow', manufacturer: 'Tata Advanced Systems', alloyGrade: 'Co-Ni-Cr-W (Co-30Ni-20Cr-15W)', application: 'Missile Thrust Vector Nozzle (DRDO Astra Mk3)', cobaltPercent: 35, maxTempCelsius: 1400, investmentCr: 295, status: 'In Transit', priority: 'Critical', origin: 'TASL Lucknow (UP)', destination: 'DRDO Hyderabad (TS)', shipDate: '2026-07-23', transitDays: 2, zone: 'North', remarks: 'Co-Ni-Cr-W superalloy thrust vector nozzle for Astra Mk3 BVRAAM &#8594; 35% Co with 30% Ni 20% Cr 15% W &#8594; &#8377;295Cr for 16 tonnes nozzle forgings &#8594; DRDO Astra Mk3 range 350km with dual-pulse rocket motor &#8594; Co-Ni-Cr-W retains 85% yield strength at 1400&#176;C &#8594; TASL DRDO joint venture for missile-grade materials &#8594; &#8377;21,500Cr Indian missile Co alloy programme' },
]

const tabs = ['Dashboard', 'Registry', 'Analytics', 'Insights'] as const
type TabType = typeof tabs[number]

export default function CobaltAlloyLogisticsView() {
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
    return cobaltRecords.filter(r => {
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
    cobaltRecords.reduce((s: number, r) => s + r.investmentCr, 0), [])

  const cityMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of cobaltRecords) {
      map[r.city] = (map[r.city] || 0) + r.investmentCr
    }
    return map
  }, [])

  const gradeMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of cobaltRecords) {
      map[r.alloyGrade] = (map[r.alloyGrade] || 0) + 1
    }
    return map
  }, [])

  const statusCounts = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of cobaltRecords) {
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
        title="Cobalt Alloy Logistics Command"
        description={`India cobalt-based superalloy and wear-resistant alloy supply chain &#8594; ${cobaltRecords.length} shipments &#8594; ${totalInvestment.toLocaleString('en-IN')} Cr total investment &#8594; Stellite, Haynes, Tribaloy and more`}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Shipments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">{cobaltRecords.length}</div>
            <p className="text-xs text-muted-foreground">Co alloy batches tracked</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Investment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">&#8377;{totalInvestment.toLocaleString('en-IN')} Cr</div>
            <p className="text-xs text-muted-foreground">Across all manufacturers</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Alloy Grades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">{Object.keys(gradeMap).length}</div>
            <p className="text-xs text-muted-foreground">Distinct Co alloy types</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
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
            className={`px-4 py-2 rounded-t-lg font-medium text-sm transition-colors ${activeTab === tab ? 'bg-blue-600 text-white shadow-sm' : 'bg-muted text-muted-foreground hover:bg-blue-100'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex gap-4 mb-4">
        <Input
          placeholder="Search cobalt alloy shipments..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        {activeTab === 'Registry' && (
          <div className="flex flex-wrap gap-2">
            {['status', 'priority', 'zone'].map(key => (
              <div key={key} className="flex flex-wrap gap-1">
                {[...new Set(cobaltRecords.map(r => String((r as unknown as Record<string, unknown>)[key] ?? '')))].map(v => (
                  <button
                    key={v}
                    onClick={() => toggleFilter(key, v)}
                    className={`px-2 py-1 text-xs rounded-full border transition-colors ${(filters[key] || []).includes(v) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'}`}
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
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
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
                  <div key={grade} className="flex items-center justify-between p-2 bg-blue-50 rounded-lg border border-blue-100">
                    <span className="text-xs font-medium truncate mr-2">{grade}</span>
                    <Badge variant="secondary" className="bg-blue-600 text-white shrink-0">{count}</Badge>
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
                  <tr className="border-b bg-blue-50">
                    <th className="text-left p-3 font-medium">Batch</th>
                    <th className="text-left p-3 font-medium">City</th>
                    <th className="text-left p-3 font-medium">Manufacturer</th>
                    <th className="text-left p-3 font-medium">Grade</th>
                    <th className="text-left p-3 font-medium">Application</th>
                    <th className="text-left p-3 font-medium">Co %</th>
                    <th className="text-left p-3 font-medium">Max Temp (&#176;C)</th>
                    <th className="text-left p-3 font-medium">Invest (&#8377; Cr)</th>
                    <th className="text-left p-3 font-medium">Status</th>
                    <th className="text-left p-3 font-medium">Priority</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(r => (
                    <tr key={r.id} className={`border-b hover:bg-blue-50/50 transition-colors ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}>
                      <td className="p-3 font-mono text-xs">{r.batchNo}</td>
                      <td className="p-3">{r.city}</td>
                      <td className="p-3 truncate max-w-[140px]">{r.manufacturer}</td>
                      <td className="p-3 text-xs">{r.alloyGrade}</td>
                      <td className="p-3 truncate max-w-[160px]">{r.application}</td>
                      <td className="p-3 text-right">{r.cobaltPercent}%</td>
                      <td className="p-3 text-right">{r.maxTempCelsius.toLocaleString()}</td>
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
                          style={{ width: `${(count / cobaltRecords.length) * 100}%` }}
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
              <CardTitle className="text-lg">Cobalt Content vs Max Temperature</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {cobaltRecords.sort((a, b) => b.maxTempCelsius - a.maxTempCelsius).slice(0, 8).map(r => (
                  <div key={r.id} className="flex items-center gap-3">
                    <span className="text-xs w-28 truncate">{r.alloyGrade}</span>
                    <div className="flex-1 flex gap-1 items-center">
                      <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                        <div className="h-full rounded-full bg-blue-500" style={{ width: `${(r.maxTempCelsius / 1500) * 100}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground w-20 text-right">{r.maxTempCelsius}&#176;C</span>
                    </div>
                    <span className="text-xs text-muted-foreground w-12 text-right">{r.cobaltPercent}%</span>
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
                  const count = cobaltRecords.filter(r => r.priority === p).length
                  return (
                    <div key={p} className="flex items-center justify-between">
                      <span className="text-sm">{p}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-100 rounded-full h-2 overflow-hidden">
                          <div className="h-full rounded-full bg-blue-500" style={{ width: `${(count / cobaltRecords.length) * 100}%` }} />
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
                  cobaltRecords.reduce((s: Record<string, number>, r) => {
                    s[r.zone] = (s[r.zone] || 0) + r.investmentCr
                    return s
                  }, {})
                ) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([zone, val]) => (
                  <div key={zone} className="flex items-center gap-3">
                    <span className="text-sm w-16">{zone}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-blue-400 to-indigo-500" style={{ width: `${(val / totalInvestment) * 100}%` }} />
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
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Critical Cobalt Supply Chain Risk</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                India imports 85% of cobalt alloy requirements, with 60% sourced from Democratic Republic of Congo via Chinese converters. The &#8377;2,467 Cr current batch portfolio is vulnerable to DRC supply disruptions — COA-B2404 already delayed 10 days due to cobalt supply chain issues. MIDHANI is India&amp;apos;s sole integrated Co alloy producer. Government should establish 12-month strategic cobalt stockpile at Indian Rare Earths Ltd.
              </p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Defence and Nuclear Growth Driver</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                DRDO Astra Mk3 (BVR missile) and BHAVINI PFBR (nuclear reactor) together account for &#8377;705 Cr of Co alloy demand. Co-Re alloy for nuclear service and Co-Ni-Cr-W for missile nozzles represent cutting-edge materials with no domestic suppliers. DRDO DMRL and IGCAR capability development is critical — both programmes have 2029-2030 induction timelines with 0% import substitution today.
              </p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Biomedical Co Alloy Opportunity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                India&amp;apos;s orthopaedic implant market (&#8377;25,000 Cr) is 95% dependent on imported Co-Cr-Mo alloy from Zimmer Biomet, Stryker and Smith &amp; Nephew. DRDO DMRL Stellite 21 biomedical-grade capability, combined with SCTIMST&amp;apos;s 12,000 annual joint replacements, creates &#8377;5,400 Cr immediate addressable market. Make in India medical device policy offers 15% production-linked incentive for domestic Co alloy implant production.
              </p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Delayed Shipments Alert</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                COA-B2404 (UMCo-50 valve seat, Pune&#8594;Vadodara) delayed 10 days due to raw cobalt supply disruption from DRC. COA-B2412 (Stellite 6B wellhead valve, Jorhat&#8594;Jorhat) delayed 11 days awaiting import customs clearance for Stellite welding wire from Canada. Total delayed value &#8377;163 Cr. Both shipments escalated to procurement priority with alternative logistics via air freight.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
