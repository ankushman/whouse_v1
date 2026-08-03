'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { Shield } from 'lucide-react'

interface NickelSuperalloyRecord {
  id: string
  batchNo: string
  city: string
  manufacturer: string
  alloyGrade: string
  application: string
  nickelPercent: number
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

const nickelRecords: NickelSuperalloyRecord[] = [
  { id: 'NSS-0001', batchNo: 'NSS-B2401', city: 'Pune', manufacturer: 'HAL Aero Engines', alloyGrade: 'Inconel 718 (Ni-19Cr-18Fe-5Nb)', application: 'Turbine Disc (LCA Tejas F404)', nickelPercent: 52, maxTempCelsius: 700, investmentCr: 285, status: 'Delivered', priority: 'Critical', origin: 'HAL Engine Division Bengaluru (KA)', destination: 'HAL Test Centre Bengaluru (KA)', shipDate: '2026-07-20', transitDays: 1, zone: 'West', remarks: 'Inconel 718 turbine disc for GE F404-GE-IN20 engine &#8594; 52% Ni with 19% Cr 18% Fe 5% Nb &#8594; &#8377;285Cr for 35 tonnes disc forgings &#8594; HAL producing 150 Tejas Mk2 engines/year &#8594; Inconel 718 yield strength 1035 MPa at 650&#176;C &#8594; India importing 60% Ni superalloy disc forgings from GE and Rolls-Royce &#8594; &#8377;22,000Cr Indian turbine disc Ni alloy demand' },
  { id: 'NSS-0002', batchNo: 'NSS-B2402', city: 'Hyderabad', manufacturer: 'MIDHANI Hyderabad', alloyGrade: 'Inconel 625 (Ni-22Cr-9Mo-3.5Nb)', application: 'Gas Turbine Combustor (BHEL)', nickelPercent: 58, maxTempCelsius: 980, investmentCr: 195, status: 'In Transit', priority: 'Critical', origin: 'MIDHANI Hyderabad (TS)', destination: 'BHEL Hyderabad (TS)', shipDate: '2026-07-22', transitDays: 1, zone: 'South', remarks: 'Inconel 625 combustor liner for 800MW gas turbine &#8594; 58% Ni with 22% Cr 9% Mo &#8594; &#8377;195Cr for 42 tonnes sheet and plate stock &#8594; BHEL manufacturing 42 gas turbines for NTPC &#8594; Inconel 625 pitting resistance in combustion gas 100,000hr &#8594; MIDHANI India sole producer of Ni superalloy ingots &#8594; &#8377;15,500Cr Indian gas turbine Ni alloy market' },
  { id: 'NSS-0003', batchNo: 'NSS-B2403', city: 'Mumbai', manufacturer: 'Tata Advanced Materials', alloyGrade: 'Hastelloy X (Ni-22Cr-9Mo-18Fe)', application: 'Aero Engine Afterburner (DRDO GTRE)', nickelPercent: 49, maxTempCelsius: 1200, investmentCr: 165, status: 'Delivered', priority: 'High', origin: 'TAM India Mumbai (MH)', destination: 'DRDO GTRE Bengaluru (KA)', shipDate: '2026-07-19', transitDays: 2, zone: 'West', remarks: 'Hastelloy X afterburner liner for Kaveri engine programme &#8594; 49% Ni with 22% Cr 9% Mo 18% Fe &#8594; &#8377;165Cr for 22 tonnes sheet stock &#8594; Kaveri 85kN dry thrust engine for AMCA fighter &#8594; Hastelloy X retains 80% yield strength at 1200&#176;C &#8594; DRDO targeting Kaveri production by 2029 &#8594; &#8377;12,800Cr Indian aero engine Ni alloy demand' },
  { id: 'NSS-0004', batchNo: 'NSS-B2404', city: 'Bengaluru', manufacturer: 'IGCAR Kalpakkam', alloyGrade: 'Inconel 600 (Ni-16Cr-6Fe)', application: 'Steam Generator Tube (BHAVINI PFBR)', nickelPercent: 72, maxTempCelsius: 600, investmentCr: 310, status: 'Delayed', priority: 'Critical', origin: 'IGCAR Kalpakkam (TN)', destination: 'BHAVINI PFBR Kalpakkam (TN)', shipDate: '2026-07-13', transitDays: 1, zone: 'South', remarks: 'Inconel 600 SG tube for 500MW Prototype Fast Breeder Reactor &#8594; 72% Ni with 16% Cr for high-temp water corrosion &#8594; &#8377;310Cr for 85 kilometres of U-bend tubes &#8594; PFBR requires 42 km of SG tubes at 12.5mm OD &#8594; Inconel 600 stress corrosion cracking resistance in high-purity H2O &#8594; Delayed 10 days due to tube dimension inspection failure &#8594; &#8377;25,000Cr Indian nuclear Ni alloy programme' },
  { id: 'NSS-0005', batchNo: 'NSS-B2405', city: 'Chennai', manufacturer: 'BHEL Trichy', alloyGrade: 'Inconel 713C (Ni-13Cr-4.5Mo-6Al)', application: 'Turbine Bucket (NTPC Singrauli)', nickelPercent: 74, maxTempCelsius: 950, investmentCr: 245, status: 'Processing', priority: 'High', origin: 'BHEL Trichy (TN)', destination: 'NTPC Singrauli (MP)', shipDate: '2026-07-25', transitDays: 3, zone: 'South', remarks: 'Inconel 713C investment cast turbine bucket for 500MW steam turbine &#8594; 74% Ni with 13% Cr 4.5% Mo 6% Al gamma-prime &#8594; &#8377;245Cr for 12 tonnes cast buckets &#8594; NTPC Singrauli 2000MW coal plant 4x500MW units &#8594; Inconel 713C creep life 25,000hr at 950&#176;C &#8594; BHEL producing 500 turbine buckets/month &#8594; &#8377;18,500Cr Indian power turbine Ni alloy demand' },
  { id: 'NSS-0006', batchNo: 'NSS-B2406', city: 'Noida', manufacturer: 'DRDO DMRL', alloyGrade: 'Waspaloy (Ni-19Cr-13Co-4Mo-3Ti)', application: 'Turbine Blade (DRDO Kaveri)', nickelPercent: 58, maxTempCelsius: 1050, investmentCr: 420, status: 'Delivered', priority: 'Critical', origin: 'DRDO DMRL Hyderabad (TS)', destination: 'GTRE Bengaluru (KA)', shipDate: '2026-07-17', transitDays: 2, zone: 'North', remarks: 'Waspaloy single crystal turbine blade for Kaveri engine HP spool &#8594; 58% Ni with 19% Cr 13% Co 4% Mo &#8594; &#8377;420Cr for 8 tonnes SX blade blanks &#8594; Kaveri HP turbine 16 blades per disc 6 disc stages &#8594; Waspaloy SX creep strength 350MPa at 1050&#176;C &#8594; DRDO DMRL developing indigenous SX casting capability &#8594; &#8377;32,000Cr Indian aero engine blade Ni programme' },
  { id: 'NSS-0007', batchNo: 'NSS-B2407', city: 'Kolkata', manufacturer: 'Hindalco Industries', alloyGrade: 'Monel 400 (Ni-30Cu)', application: 'Desalination Plant (Adani Water Kolkata)', nickelPercent: 67, maxTempCelsius: 450, investmentCr: 78, status: 'In Transit', priority: 'Medium', origin: 'Hindalco R&amp;D Kolkata (WB)', destination: 'Adani Water Mumbai (MH)', shipDate: '2026-07-21', transitDays: 3, zone: 'East', remarks: 'Monel 400 alloy for seawater desalination plant heat exchanger &#8594; 67% Ni with 30% Cu for seawater corrosion resistance &#8594; &#8377;78Cr for 18 tonnes tube stock &#8594; India 1.4 billion population facing severe water stress &#8594; Monel 400 corrosion rate 0.002mm/year in seawater &#8594; India targeting 100 MLD desalination capacity by 2030 &#8594; &#8377;6,200Cr Indian water Ni alloy market' },
  { id: 'NSS-0008', batchNo: 'NSS-B2408', city: 'Ahmedabad', manufacturer: 'Reliance SBR', alloyGrade: 'Inconel 825 (Ni-22Cr-3Mo-2Cu)', application: 'Flue Gas Desulfurization (RIL Jamnagar)', nickelPercent: 42, maxTempCelsius: 550, investmentCr: 145, status: 'Delivered', priority: 'High', origin: 'Reliance SBR Ahmedabad (GJ)', destination: 'RIL Jamnagar Refinery (GJ)', shipDate: '2026-07-16', transitDays: 1, zone: 'West', remarks: 'Inconel 825 FGD absorber tower for BS-VI desulfurization &#8594; 42% Ni with 22% Cr 3% Mo 2% Cu &#8594; &#8377;145Cr for 28 tonnes plate stock &#8594; RIL Jamnagar 1.24 million bpd world largest refinery &#8594; Inconel 825 resists H2SO4-HCl mixed acid 100,000hr &#8594; India BS-VI covering 100% fuel production &#8594; &#8377;11,200Cr Indian refinery Ni alloy demand' },
  { id: 'NSS-0009', batchNo: 'NSS-B2409', city: 'Jaipur', manufacturer: 'Rajasthan State Mines', alloyGrade: 'Nimonic 80A (Ni-20Cr-2.4Ti-1.3Al)', application: 'Turbocharger Rotor (Cummins India)', nickelPercent: 76, maxTempCelsius: 850, investmentCr: 92, status: 'Processing', priority: 'High', origin: 'RSM Processing Jaipur (RJ)', destination: 'Cummins India Pune (MH)', shipDate: '2026-07-24', transitDays: 2, zone: 'North', remarks: 'Nimonic 80A turbocharger turbine wheel for heavy-duty diesel &#8594; 76% Ni with 20% Cr 2.4% Ti &#8594; &#8377;92Cr for 6 tonnes investment cast rotors &#8594; Cummins India 500,000 turbochargers/year &#8594; Nimonic 80A stress rupture life 10,000hr at 850&#176;C &#8594; India diesel turbocharger market 2.5 million units/year &#8594; &#8377;7,800Cr Indian turbocharger Ni alloy market' },
  { id: 'NSS-0010', batchNo: 'NSS-B2410', city: 'Coimbatore', manufacturer: 'IIT Madras Research', alloyGrade: 'CM247LC (Ni-8Cr-10Co-5.6Al)', application: 'IGCC Gasifier Liner (BHEL Trichy)', nickelPercent: 62, maxTempCelsius: 1100, investmentCr: 178, status: 'Delivered', priority: 'High', origin: 'IIT Madras (TN)', destination: 'BHEL Trichy (TN)', shipDate: '2026-07-18', transitDays: 1, zone: 'South', remarks: 'CM247LC DS columnar grain gasifier liner for IGCC power plant &#8594; 62% Ni with 8% Cr 10% Co 5.6% Al &#8594; &#8377;178Cr for 14 tonnes DS liner segments &#8594; BHEL Trichy building 2x250MW IGCC for NTPC &#8594; CM247LC grain boundary creep strength 2x equiaxed &#8594; India&apos;s first commercial IGCC plant at 1.8 &#8377;/kWh &#8594; &#8377;13,500Cr Indian IGCC Ni alloy programme' },
  { id: 'NSS-0011', batchNo: 'NSS-B2411', city: 'Bhubaneswar', manufacturer: 'NALCO Smelter', alloyGrade: 'Inconel 690 (Ni-30Cr-10Fe)', application: 'Nuclear Waste Canister (DAE BARC)', nickelPercent: 60, maxTempCelsius: 500, investmentCr: 125, status: 'In Transit', priority: 'Critical', origin: 'MIDHANI Hyderabad (TS)', destination: 'BARC Trombay (MH)', shipDate: '2026-07-23', transitDays: 3, zone: 'East', remarks: 'Inconel 690 high-Cr Ni alloy for spent nuclear fuel storage canister &#8594; 60% Ni with 30% Cr for IGSCC resistance in high-purity water &#8594; &#8377;125Cr for 15 tonnes canister forgings &#8594; DAE managing 700 tonnes spent fuel requiring 200 canisters &#8594; Inconel 690 IGSCC threshold 40MPa vs 15MPa for Inconel 600 &#8594; BARC developing 100-year dry storage design &#8594; &#8377;9,500Cr Indian nuclear waste Ni alloy market' },
  { id: 'NSS-0012', batchNo: 'NSS-B2412', city: 'Guwahati', manufacturer: 'Oil India Ltd', alloyGrade: 'Inconel 725 (Ni-22Cr-3Mo-8Nb)', application: 'Subsea Pipeline (ONGC Mumbai Offshore)', nickelPercent: 55, maxTempCelsius: 350, investmentCr: 185, status: 'Delayed', priority: 'High', origin: 'Oil India Jorhat (AS)', destination: 'ONGC Mumbai Offshore (MH)', shipDate: '2026-07-11', transitDays: 6, zone: 'East', remarks: 'Inconel 725 subsea flowline for high-pressure sour gas field &#8594; 55% Ni with 22% Cr 3% Mo 8% Nb precipitation &#8594; &#8377;185Cr for 25 kilometres of welded pipe &#8594; ONGC KG-DWN-98/2 deepwater field 2500m depth &#8594; Inconel 725 sour service rating MR0175 NACE &#8594; Delayed 12 days due to monsoon logistics to offshore &#8594; &#8377;14,500Cr Indian offshore Ni alloy demand' },
  { id: 'NSS-0013', batchNo: 'NSS-B2413', city: 'Gandhinagar', manufacturer: 'Gujarat Fluorochemicals', alloyGrade: 'Inconel 601 (Ni-23Cr-1.4Al)', application: 'Petrochemical Cracking Tube (Reliance Jamnagar)', nickelPercent: 60, maxTempCelsius: 1150, investmentCr: 225, status: 'Processing', priority: 'Critical', origin: 'GFCL Gandhinagar (GJ)', destination: 'RIL Jamnagar (GJ)', shipDate: '2026-07-26', transitDays: 1, zone: 'West', remarks: 'Inconel 601 centrifugal cast tube for ethylene cracker furnace &#8594; 60% Ni with 23% Cr 1.4% Al for carburization resistance &#8594; &#8377;225Cr for 30 tonnes tube castings &#8594; RIL Jamnagar 1.1 MMTPA ethylene cracker &#8594; Inconel 601 tube life 100,000hr at 1150&#176;C &#8594; India 6 MMTPA ethylene capacity expanding to 12 MMTPA &#8594; &#8377;17,800Cr Indian petrochemical Ni alloy demand' },
  { id: 'NSS-0014', batchNo: 'NSS-B2414', city: 'Lucknow', manufacturer: 'Tata Advanced Systems', alloyGrade: 'RR1000 (Ni-16.5Co-5Cr-3Ti)', application: 'Landing Gear Outer Cylinder (DRDO AMCA)', nickelPercent: 55, maxTempCelsius: 750, investmentCr: 315, status: 'In Transit', priority: 'Critical', origin: 'TASL Lucknow (UP)', destination: 'DRDO ADA Bengaluru (KA)', shipDate: '2026-07-23', transitDays: 2, zone: 'North', remarks: 'RR1000 powder metallurgy Ni superalloy landing gear cylinder &#8594; 55% Ni with 16.5% Co 5% Cr 3% Ti &#8594; &#8377;315Cr for 18 tonnes PM forged stock &#8594; AMCA 25-tonne fighter requiring 600kg landing gear assembly &#8594; RR1000 specific strength 2x Inconel 718 at 750&#176;C &#8594; TASL-DRDO JV for powder metallurgy Ni superalloys &#8594; &#8377;24,500Cr Indian fighter jet Ni alloy programme' },
]

const tabs = ['Dashboard', 'Registry', 'Analytics', 'Insights'] as const
type TabType = typeof tabs[number]

export default function NickelSuperalloyLogisticsView() {
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
    return nickelRecords.filter(r => {
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

  const uniqueCities = useMemo(() => [...new Set(nickelRecords.map(r => r.city))].sort(), [])
  const uniqueManufacturers = useMemo(() => [...new Set(nickelRecords.map(r => r.manufacturer))].sort(), [])
  const uniqueStatuses = useMemo(() => [...new Set(nickelRecords.map(r => r.status))].sort(), [])
  const uniqueZones = useMemo(() => [...new Set(nickelRecords.map(r => r.zone))].sort(), [])

  const totalInvestment = useMemo(() => nickelRecords.reduce((s: number, r) => s + r.investmentCr, 0), [])
  const avgTemp = useMemo(() => Math.round(nickelRecords.reduce((s: number, r) => s + r.maxTempCelsius, 0) / nickelRecords.length), [])
  const deliveredCount = useMemo(() => nickelRecords.filter(r => r.status === 'Delivered').length, [])
  const delayedCount = useMemo(() => nickelRecords.filter(r => r.status === 'Delayed').length, [])

  const cityInvestmentMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of nickelRecords) { map[r.city] = (map[r.city] || 0) + r.investmentCr }
    return map
  }, [])

  const gradeTempMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of nickelRecords) { map[r.alloyGrade] = (map[r.alloyGrade] || 0) + r.maxTempCelsius }
    return map
  }, [])

  const statusCountMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of nickelRecords) { map[r.status] = (map[r.status] || 0) + 1 }
    return map
  }, [])

  const zoneInvestmentMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of nickelRecords) { map[r.zone] = (map[r.zone] || 0) + r.investmentCr }
    return map
  }, [])

  const maxCity = useMemo(() => {
    const entries = (Object.entries(cityInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1])
    return entries[0] || ['N/A', 0]
  }, [cityInvestmentMap])

  const maxTempGrade = useMemo(() => {
    const entries = (Object.entries(gradeTempMap) as [string, number][]).sort((a, b) => b[1] - a[1])
    return entries[0] || ['N/A', 0]
  }, [gradeTempMap])

  return (
    <div className="space-y-6">
      <PageHeader title="Nickel Superalloy Logistics" description="Strategic nickel superalloy supply chain tracking for gas turbines, nuclear reactors, aerospace engines, petrochemical plants and offshore applications" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-slate-500 bg-slate-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Total Investment</div><div className="text-2xl font-bold text-slate-700">&#8377;{totalInvestment.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground mt-1">Across {nickelRecords.length} batches</div></CardContent></Card>
        <Card className="border-l-4 border-l-slate-500 bg-slate-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Avg Max Temperature</div><div className="text-2xl font-bold text-slate-700">{avgTemp.toLocaleString()}&#176;C</div><div className="text-xs text-muted-foreground mt-1">Across all alloy grades</div></CardContent></Card>
        <Card className="border-l-4 border-l-slate-500 bg-slate-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Delivered</div><div className="text-2xl font-bold text-slate-700">{deliveredCount}</div><div className="text-xs text-muted-foreground mt-1">{delayedCount} delayed</div></CardContent></Card>
        <Card className="border-l-4 border-l-slate-500 bg-slate-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Top City</div><div className="text-2xl font-bold text-slate-700">{maxCity[0]}</div><div className="text-xs text-muted-foreground mt-1">&#8377;{maxCity[1].toLocaleString()} Cr invested</div></CardContent></Card>
      </div>

      <div className="flex flex-wrap gap-2">
        <Input placeholder="Search records..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="max-w-xs" />
        {uniqueCities.map(city => (
          <Badge key={city} variant={filters.city?.includes(city) ? 'default' : 'outline'} className="cursor-pointer" onClick={() => toggleFilter('city', city)}>{city}</Badge>
        ))}
        {uniqueStatuses.map(status => (
          <Badge key={status} variant={filters.status?.includes(status) ? 'default' : 'outline'} className="cursor-pointer" onClick={() => toggleFilter('status', status)}>{status}</Badge>
        ))}
      </div>

      <div className="flex gap-2 border-b">
        {tabs.map(tab => (
          <button key={tab} className={`px-4 py-2 text-sm font-medium ${activeTab === tab ? 'border-b-2 border-slate-500 text-slate-700' : 'text-muted-foreground'}`} onClick={() => setActiveTab(tab)}>{tab}</button>
        ))}
      </div>

      {activeTab === 'Dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">Investment by City</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(cityInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([city, val]) => (<div key={city} className="flex items-center gap-2"><span className="text-xs w-24 truncate">{city}</span><div className="flex-1 bg-slate-100 rounded-full h-3"><div className="bg-slate-500 h-3 rounded-full" style={{ width: `${(val / maxCity[1]) * 100}%` }}></div></div><span className="text-xs font-medium w-20 text-right">&#8377;{val} Cr</span></div>))}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Max Temperature by Alloy Grade</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(gradeTempMap) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([grade, temp]) => (<div key={grade} className="flex items-center gap-2"><span className="text-xs w-36 truncate">{grade}</span><div className="flex-1 bg-red-100 rounded-full h-3"><div className="bg-red-500 h-3 rounded-full" style={{ width: `${(temp / maxTempGrade[1]) * 100}%` }}></div></div><span className="text-xs font-medium w-16 text-right">{temp}&#176;C</span></div>))}</CardContent></Card>
        </div>
      )}

      {activeTab === 'Registry' && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {uniqueManufacturers.map(mfg => (
              <Badge key={mfg} variant={filters.manufacturer?.includes(mfg) ? 'default' : 'outline'} className="cursor-pointer" onClick={() => toggleFilter('manufacturer', mfg)}>{mfg}</Badge>
            ))}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b"><th className="text-left p-2">Batch</th><th className="text-left p-2">City</th><th className="text-left p-2">Manufacturer</th><th className="text-left p-2">Alloy Grade</th><th className="text-left p-2">Application</th><th className="text-left p-2">Ni%</th><th className="text-left p-2">Max Temp</th><th className="text-left p-2">&#8377;Cr</th><th className="text-left p-2">Status</th></tr></thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id} className={`border-b ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}>
                    <td className="p-2 font-mono text-xs">{r.batchNo}</td>
                    <td className="p-2">{r.city}</td>
                    <td className="p-2">{r.manufacturer}</td>
                    <td className="p-2">{r.alloyGrade}</td>
                    <td className="p-2 max-w-[200px] truncate">{r.application}</td>
                    <td className="p-2">{r.nickelPercent}%</td>
                    <td className="p-2">{r.maxTempCelsius}&#176;C</td>
                    <td className="p-2 font-medium">&#8377;{r.investmentCr}</td>
                    <td className="p-2"><Badge variant={r.status === 'Delivered' ? 'default' : r.status === 'Delayed' ? 'destructive' : 'secondary'}>{r.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card><CardHeader><CardTitle className="text-sm">Nickel % by Alloy</CardTitle></CardHeader><CardContent className="space-y-2">{nickelRecords.slice(0, 8).map(r => (<div key={r.id} className="flex items-center gap-2"><span className="text-xs w-36 truncate">{r.alloyGrade}</span><div className="flex-1 bg-indigo-100 rounded-full h-3"><div className="bg-indigo-500 h-3 rounded-full" style={{ width: `${(r.nickelPercent / 76) * 100}%` }}></div></div><span className="text-xs font-medium w-12 text-right">{r.nickelPercent}%</span></div>))}</CardContent></Card>
            <Card><CardHeader><CardTitle className="text-sm">Investment by Zone</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(zoneInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([zone, val]) => (<div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone}</span><div className="flex-1 bg-violet-100 rounded-full h-3"><div className="bg-violet-500 h-3 rounded-full" style={{ width: `${(val / maxCity[1]) * 100}%` }}></div></div><span className="text-xs font-medium w-20 text-right">&#8377;{val} Cr</span></div>))}</CardContent></Card>
          </div>
        </div>
      )}

      {activeTab === 'Analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">Status Distribution</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(statusCountMap) as [string, number][]).map(([status, count]) => (<div key={status} className="flex items-center gap-2"><span className="text-xs w-24">{status}</span><div className="flex-1 bg-gray-100 rounded-full h-3"><div className="bg-slate-500 h-3 rounded-full" style={{ width: `${(count / nickelRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Priority Breakdown</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const map: Record<string, number> = {}; for (const r of nickelRecords) { map[r.priority] = (map[r.priority] || 0) + 1 } const sorted = (Object.entries(map) as [string, number][]).sort((a, b) => b[1] - a[1]); return sorted.map(([pri, count]) => (<div key={pri} className="flex items-center gap-2"><span className="text-xs w-20">{pri}</span><div className="flex-1 bg-amber-100 rounded-full h-3"><div className="bg-amber-500 h-3 rounded-full" style={{ width: `${(count / nickelRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))})()}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Shipment Volume by Zone</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const map: Record<string, number> = {}; for (const r of nickelRecords) { map[r.zone] = (map[r.zone] || 0) + 1 } const sorted = (Object.entries(map) as [string, number][]).sort((a, b) => b[1] - a[1]); return sorted.map(([zone, count]) => (<div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone}</span><div className="flex-1 bg-blue-100 rounded-full h-3"><div className="bg-blue-500 h-3 rounded-full" style={{ width: `${(count / nickelRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))})()}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Temperature Range Distribution</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const ranges: Record<string, number> = { '300-600&#176;C': 0, '600-900&#176;C': 0, '900-1100&#176;C': 0, '1100-1200&#176;C': 0 }; for (const r of nickelRecords) { if (r.maxTempCelsius >= 1100) ranges['1100-1200&#176;C']++; else if (r.maxTempCelsius >= 900) ranges['900-1100&#176;C']++; else if (r.maxTempCelsius >= 600) ranges['600-900&#176;C']++; else ranges['300-600&#176;C']++ } return (Object.entries(ranges) as [string, number][]).map(([range, count]) => (<div key={range} className="flex items-center gap-2"><span className="text-xs w-24">{range}</span><div className="flex-1 bg-orange-100 rounded-full h-3"><div className="bg-orange-500 h-3 rounded-full" style={{ width: `${(count / nickelRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))})()}</CardContent></Card>
        </div>
      )}

      {activeTab === 'Insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-l-4 border-l-slate-500"><CardHeader><CardTitle className="text-sm">MIDHANI: India&apos;s Ni Superalloy Backbone</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>MIDHANI (Mishra Dhatu Nigam) is India&apos;s sole producer of nickel superalloy ingots, operating a 25,000-tonne VIM/ESR/VAR facility in Hyderabad. The company produces Inconel 718, 625, 713C, Waspaloy and custom Ni superalloys for defence, aerospace and nuclear applications. MIDHANI currently meets 40% of India&apos;s Ni superalloy demand, with the balance imported from Special Metals (USA), VDM (Germany) and Haynes (UK). The NSS-B2402 batch of 42 tonnes Inconel 625 for BHEL gas turbines and NSS-B2406 of 8 tonnes Waspaloy for DRDO Kaveri blades represent critical import substitution efforts. MIDHANI capacity expansion to 40,000 tonnes by 2028.</p></CardContent></Card>
          <Card className="border-l-4 border-l-amber-500"><CardHeader><CardTitle className="text-sm">Gas Turbine Demand Surge</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>India&apos;s power sector is installing 80 GW of gas turbine capacity by 2030, driving massive Ni superalloy demand. BHEL is India&apos;s largest gas turbine manufacturer with 42 units under production for NTPC, Reliance and Adani. Combined turbine disc (Inconel 718), blade (Waspaloy/CM247LC), combustor (Inconel 625/Hastelloy X) and afterburner (Hastelloy X) requirements total 2,500 tonnes of Ni superalloy per year. The global shift to hydrogen-capable gas turbines is driving demand for higher-Cr alloys like Inconel 740H for 750&#176;C service. India&apos;s gas turbine Ni superalloy market is projected at &#8377;46,500Cr by 2030.</p></CardContent></Card>
          <Card className="border-l-4 border-l-emerald-500"><CardHeader><CardTitle className="text-sm">Nuclear Programme: Specialized Alloys</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>India&apos;s nuclear programme operates 24 reactors with 10 under construction, creating highly specialized Ni alloy demand. Inconel 600 SG tubes (NSS-B2404) for PFBR, Inconel 690 waste canisters (NSS-B2411) for BARC, and Inconel 825 FGD systems represent the nuclear-specific applications. The PFBR programme alone requires 85 km of SG tubes — one of the most demanding metallurgical products requiring zero-defect welds and 100% ultrasonic inspection. India&apos;s nuclear Ni alloy demand of 200 tonnes/year is projected to reach 400 tonnes by 2030 with 8 new reactors planned.</p></CardContent></Card>
          <Card className="border-l-4 border-l-blue-500"><CardHeader><CardTitle className="text-sm">Offshore &amp; Petrochemical Growth</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>India&apos;s offshore oil and gas sector (ONGC, Reliance, Oil India) is a major Ni superalloy consumer for subsea flowlines and downhole tubulars. The KG-DWN-98/2 deepwater field at 2500m depth requires Inconel 725 (NSS-B2412) pipelines rated to NACE MR0175 for sour service. Petrochemical crackers (Reliance Jamnagar 1.1 MMTPA, Indian Oil Paradip) use Inconel 601 and 625 for furnace tubes operating at 1100-1150&#176;C with 100,000-hour life requirements. India&apos;s combined offshore and petrochemical Ni alloy market is &#8377;26,300Cr, growing at 12% annually driven by energy security and refining expansion.</p></CardContent></Card>
        </div>
      )}
    </div>
  )
}
