'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { Waves } from 'lucide-react'

interface ChromiumAlloyRecord {
  id: string
  batchNo: string
  city: string
  manufacturer: string
  alloyGrade: string
  application: string
  chromiumPercent: number
  hardnessHRC: number
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

const chromiumRecords: ChromiumAlloyRecord[] = [
  { id: 'CRA-0001', batchNo: 'CRA-B2401', city: 'Bengaluru', manufacturer: 'MIDHANI', alloyGrade: 'AISI 410 (13% Cr)', application: 'Steam Turbine Blade (BHEL)', chromiumPercent: 13, hardnessHRC: 38, investmentCr: 175, status: 'Delivered', priority: 'Critical', origin: 'MIDHANI Hyderabad (TG)', destination: 'BHEL Hyderabad (TG)', shipDate: '2026-07-18', transitDays: 1, zone: 'South', remarks: 'AISI 410 martensitic SS for BHEL 500MW steam turbine L-1 blade &#8594; 13% Cr 38 HRC hardness &#8594; &#8377;175Cr for 50 tonnes forged bars &#8594; India 400 GW thermal power installed &#8594; 800 blades per 500MW turbine &#8594; India &#8377;6,500Cr turbine blade alloy market &#8594; BHEL 70% India turbine market &#8594; 540&#176;C max operating temperature' },
  { id: 'CRA-0002', batchNo: 'CRA-B2402', city: 'Hyderabad', manufacturer: 'DRDO DMRL', alloyGrade: 'AISI 304 (18% Cr-8% Ni)', application: 'Nuclear Reactor Vessel (NPCIL)', chromiumPercent: 18, hardnessHRC: 28, investmentCr: 220, status: 'Delivered', priority: 'Critical', origin: 'DMRL Hyderabad (TG)', destination: 'NPCIL Mumbai (MH)', shipDate: '2026-07-20', transitDays: 2, zone: 'South', remarks: 'AISI 304 austenitic SS for NPCIL 700MW PHWR pressure tube &#8594; 18% Cr 8% Ni 28 HRC &#8594; &#8377;220Cr for 80 tonnes plate &#8594; India 22 nuclear reactors 7,500 MW &#8594; 350&#176;C service 40 year design life &#8594; India &#8377;8,200Cr nuclear SS market &#8594; NPCIL 10 new reactors under construction &#8594; Intergranular corrosion resistance' },
  { id: 'CRA-0003', batchNo: 'CRA-B2403', city: 'Mumbai', manufacturer: 'Tata Steel Special', alloyGrade: 'AISI 420 (14% Cr)', application: 'Surgical Instrument (MedTech)', chromiumPercent: 14, hardnessHRC: 52, investmentCr: 88, status: 'Delivered', priority: 'High', origin: 'TSS Mumbai (MH)', destination: 'MedTech Mumbai (MH)', shipDate: '2026-07-15', transitDays: 1, zone: 'West', remarks: 'AISI 420 martensitic SS for MedTech surgical scalpel &#8594; 14% Cr 52 HRC edge retention &#8594; &#8377;88Cr for 5 million instruments &#8594; India 500 million surgical procedures &#8594; Autoclavable 134&#176;C &#8594; India &#8377;3,500Cr surgical SS market &#8594; MedTech 15% India surgical market &#8594; Passivation 10% nitric acid treatment' },
  { id: 'CRA-0004', batchNo: 'CRA-B2404', city: 'Pune', manufacturer: 'Bharat Forge', alloyGrade: 'AISI 431 (16% Cr-2% Ni)', application: 'Aircraft Landing Gear (HAL)', chromiumPercent: 16, hardnessHRC: 42, investmentCr: 198, status: 'Delivered', priority: 'Critical', origin: 'Bharat Forge Pune (MH)', destination: 'HAL Bengaluru (KA)', shipDate: '2026-07-22', transitDays: 2, zone: 'West', remarks: 'AISI 431 martensitic SS for HAL Tejas main landing gear axle &#8594; 16% Cr 2% Ni 42 HRC &#8594; &#8377;198Cr for 30 tonnes forgings &#8594; 83 Tejas on order HAL &#8594; Fatigue life 60,000 cycles &#8594; India &#8377;7,800Cr aero Cr alloy market &#8594; Bharat Forge 30% India aero forging &#8594; NADCAP certified heat treatment' },
  { id: 'CRA-0005', batchNo: 'CRA-B2405', city: 'Chennai', manufacturer: 'SAIL Salem', alloyGrade: 'AISI 316L (16% Cr-12% Ni-2% Mo)', application: 'Desalination Plant (VA Tech Wabag)', chromiumPercent: 16, hardnessHRC: 22, investmentCr: 165, status: 'Delivered', priority: 'High', origin: 'SAIL Salem (TN)', destination: 'VA Tech Chennai (TN)', shipDate: '2026-07-19', transitDays: 1, zone: 'South', remarks: 'AISI 316L low-carbon austenitic for reverse osmosis desalination pressure vessel &#8594; 16% Cr 12% Ni 2% Mo 22 HRC &#8594; &#8377;165Cr for 120 tonnes plate &#8594; India 180 desalination plants 5 GLD &#8594; 80 bar RO pressure 25 year life &#8594; India &#8377;5,200Cr desal SS market &#8594; Mo addition prevents pitting in chloride &#8594; Minjur Nemelli 100 MLD plant reference' },
  { id: 'CRA-0006', batchNo: 'CRA-B2406', city: 'Noida', manufacturer: 'Jindal Stainless', alloyGrade: 'AISI 430 (17% Cr)', application: 'Kitchen Utensil (Meyer)', chromiumPercent: 17, hardnessHRC: 25, investmentCr: 95, status: 'Delivered', priority: 'Medium', origin: 'JSL Hisar (HR)', destination: 'Meyer Noida (UP)', shipDate: '2026-07-16', transitDays: 1, zone: 'North', remarks: 'AISI 430 ferritic SS for Meyer induction-base cookware &#8594; 17% Cr 25 HRC magnetic &#8594; &#8377;95Cr for 200 tonnes coil &#8594; India &#8377;25,000Cr stainless kitchenware market &#8594; 200 million households &#8594; India &#8377;4,800Cr kitchen SS market &#8594; JSL 40% India stainless flat steel &#8594; Cost 40% less than 304 nickel-free alternative' },
  { id: 'CRA-0007', batchNo: 'CRA-B2407', city: 'Kolkata', manufacturer: 'SAIL Durgapur', alloyGrade: 'AISI 410S (12% Cr Low-C)', application: 'Petrochemical Column (Haldia Petro)', chromiumPercent: 12, hardnessHRC: 20, investmentCr: 145, status: 'Delivered', priority: 'High', origin: 'SAIL Durgapur (WB)', destination: 'Haldia Petrochemicals (WB)', shipDate: '2026-07-21', transitDays: 1, zone: 'East', remarks: 'AISI 410S low-carbon ferritic for Haldia distillation column &#8594; 12% Cr 20 HRC weldable &#8594; &#8377;145Cr for 90 tonnes welded pipe &#8594; India 250 MT refinery capacity &#8594; 450&#176;C column operating temp &#8594; India &#8377;6,000Cr petrochemical Cr steel market &#8594; Haldia 2.8 MT ethylene cracker &#8594; 410S easier welding vs 410 martensitic' },
  { id: 'CRA-0008', batchNo: 'CRA-B2408', city: 'Ahmedabad', manufacturer: 'Gujarat Fluorochemicals', alloyGrade: 'AISI 309 (23% Cr-13% Ni)', application: 'Cement Kiln Liner (UltraTech)', chromiumPercent: 23, hardnessHRC: 30, investmentCr: 110, status: 'Delivered', priority: 'High', origin: 'GFCL Vadodara (GJ)', destination: 'UltraTech Cement Ahmedabad (GJ)', shipDate: '2026-07-17', transitDays: 1, zone: 'West', remarks: 'AISI 309 heat-resistant austenitic for UltraTech cement kiln inlet section &#8594; 23% Cr 13% Ni 30 HRC &#8594; &#8377;110Cr for 60 tonnes plate &#8594; India 600 MT cement 1,500 kilns &#8594; 1,100&#176;C peak kiln inlet temp &#8594; India &#8377;3,800Cr cement Cr steel market &#8594; UltraTech 140 MT annual &#8594; 309 forms protective Cr2O3 scale at high temp' },
  { id: 'CRA-0009', batchNo: 'CRA-B2409', city: 'Jaipur', manufacturer: 'Rajasthan Steel Alloys', alloyGrade: 'AISI 2205 (22% Cr-6% Ni-3% Mo)', application: 'Offshore Platform (ONGC)', chromiumPercent: 22, hardnessHRC: 32, investmentCr: 215, status: 'Delivered', priority: 'Critical', origin: 'RSA Jaipur (RJ)', destination: 'ONGC Mumbai Offshore (MH)', shipDate: '2026-07-23', transitDays: 3, zone: 'North', remarks: 'AISI 2205 duplex SS for ONGC Mumbai High offshore platform riser &#8594; 22% Cr 6% Ni 3% Mo 32 HRC &#8594; &#8377;215Cr for 40 tonnes seamless pipe &#8594; India 75 offshore platforms &#8594; PREN 35 pitting resistance &#8594; India &#8377;7,500Cr offshore duplex SS market &#8594; ONGC 65% India offshore production &#8594; 2205 2x strength of 316L austenitic' },
  { id: 'CRA-0010', batchNo: 'CRA-B2410', city: 'Coimbatore', manufacturer: 'Larsen and Toubro (L&T)', alloyGrade: 'AISI 347 (18% Cr-Nb Stabilized)', application: 'Boiler Superheater (BHEL)', chromiumPercent: 18, hardnessHRC: 26, investmentCr: 178, status: 'Delivered', priority: 'High', origin: 'L&T Hazira (GJ)', destination: 'BHEL Trichy (TN)', shipDate: '2026-07-14', transitDays: 2, zone: 'South', remarks: 'AISI 347 niobium-stabilized austenitic for BHEL 660MW boiler superheater tube &#8594; 18% Cr 26 HRC &#8594; &#8377;178Cr for 70 tonnes tube &#8594; India 400 GW thermal 65% coal &#8594; 620&#176;C superheat steam temp &#8594; India &#8377;8,800Cr boiler Cr tube market &#8594; BHEL 70% India boiler &#8594; Nb stabilizer prevents intergranular Cr23C6 precipitation' },
  { id: 'CRA-0011', batchNo: 'CRA-B2411', city: 'Bhubaneswar', manufacturer: 'Nalco Stainless Odisha', alloyGrade: 'AISI 409 (11% Cr-Ti Stabilized)', application: 'Automotive Exhaust (Eicher)', chromiumPercent: 11, hardnessHRC: 18, investmentCr: 62, status: 'Delivered', priority: 'Medium', origin: 'NSO Bhubaneswar (OD)', destination: 'Eicher Engines Thiruvananthapuram (KL)', shipDate: '2026-07-25', transitDays: 3, zone: 'East', remarks: 'AISI 409 Ti-stabilized ferritic for Eicher truck exhaust muffler &#8594; 11% Cr 18 HRC low-cost &#8594; &#8377;62Cr for 150 tonnes coil &#8594; India 2 million trucks/yr &#8594; 650&#176;C exhaust gas temp &#8594; India &#8377;2,400Cr automotive exhaust Cr SS market &#8594; Eicher 20% India CV market &#8594; Ti stabilization prevents weld decay' },
  { id: 'CRA-0012', batchNo: 'CRA-B2412', city: 'Guwahati', manufacturer: 'Assam Steel Corp', alloyGrade: 'AISI 316 (17% Cr-12% Ni-2.5% Mo)', application: 'Pharma Reactor (Cipla)', chromiumPercent: 17, hardnessHRC: 22, investmentCr: 95, status: 'Delayed', priority: 'High', origin: 'ASC Guwahati (AS)', destination: 'Cipla Goa (GA)', shipDate: '2026-07-24', transitDays: 12, zone: 'East', remarks: 'AISI 316 pharmaceutical-grade SS for Cipla API reactor vessel &#8594; 17% Cr 12% Ni 2.5% Mo 22 HRC &#8594; &#8377;95Cr for 35 tonnes plate &#8594; India 3,500 pharma factories &#8594; GMP Grade 316L electropolished &#8594; 12d delay monsoon logistics &#8594; India &#8377;4,200Cr pharma SS market &#8594; Cipla 8% India pharma revenue &#8594; Mo provides chloride pitting resistance' },
  { id: 'CRA-0013', batchNo: 'CRA-B2413', city: 'Gandhinagar', manufacturer: 'Gujarat Fluorochemicals', alloyGrade: 'AISI 310 (25% Cr-20% Ni)', application: 'Petrochemical Furnace (Reliance)', chromiumPercent: 25, hardnessHRC: 35, investmentCr: 230, status: 'Delivered', priority: 'Critical', origin: 'GFCL Dahej (GJ)', destination: 'Reliance Jamnagar (GJ)', shipDate: '2026-07-26', transitDays: 1, zone: 'West', remarks: 'AISI 310 high-temp austenitic for Reliance ethylene pyrolysis furnace &#8594; 25% Cr 20% Ni 35 HRC &#8594; &#8377;230Cr for 55 tonnes centrifugal cast tube &#8594; Jamnagar 60 MT refinery &#8594; 1,100&#176;C pyrolysis zone temp &#8594; India &#8377;9,500Cr petrochemical furnace alloy market &#8594; Reliance 35% India refining &#8594; 310 forms stable Cr2O3 spinel at 1,000&#176;C+' },
  { id: 'CRA-0014', batchNo: 'CRA-B2414', city: 'Lucknow', manufacturer: 'UP Steel and Alloys', alloyGrade: 'AISI 416 (13% Cr-S Free Machining)', application: 'Defence Valve Body (BEL)', chromiumPercent: 13, hardnessHRC: 30, investmentCr: 42, status: 'Delivered', priority: 'Medium', origin: 'USA Lucknow (UP)', destination: 'BEL Ghaziabad (UP)', shipDate: '2026-07-27', transitDays: 1, zone: 'North', remarks: 'AISI 416 free-machining martensitic for BEL defence electronics cooling valve &#8594; 13% Cr 0.15% S 30 HRC &#8594; &#8377;42Cr for 15 tonnes bar stock &#8594; BEL 50 defence programs &#8594; 80% machinability vs 410 &#8594; India &#8377;1,800Cr free-machining SS market &#8594; BEL &#8377;18,000Cr annual revenue &#8594; S addition improves chip breaking' }
]

export default function ChromiumAlloyLogisticsView() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<Record<string, string[]>>({})
  const [activeTab, setActiveTab] = useState('Dashboard')

  const toggleFilter = (key: string, value: string) => {
    setFilters(prev => {
      const current = prev[key] || []
      const updated = current.includes(value) ? current.filter(v => v !== value) : [...current, value]
      if (updated.length === 0) {
        const next = { ...prev }
        delete next[key]
        return next
      }
      return { ...prev, [key]: updated }
    })
  }

  const filtered = useMemo(() => {
    return chromiumRecords.filter(r => {
      const matchSearch = !searchQuery || Object.values(r).some(v => String(v).toLowerCase().includes(searchQuery.toLowerCase()))
      const matchFilters = Object.entries(filters).every(([key, values]) => values.includes(String(r[key as keyof ChromiumAlloyRecord])))
      return matchSearch && matchFilters
    })
  }, [searchQuery, filters])

  const totalInvestment = useMemo(() => chromiumRecords.reduce((s: number, r) => s + r.investmentCr, 0), [])
  const avgChromium = useMemo(() => (chromiumRecords.reduce((s: number, r) => s + r.chromiumPercent, 0) / chromiumRecords.length).toFixed(1), [])
  const deliveredCount = useMemo(() => chromiumRecords.filter(r => r.status === 'Delivered').length, [])
  const delayedCount = useMemo(() => chromiumRecords.filter(r => r.status === 'Delayed').length, [])

  const uniqueCities = useMemo(() => [...new Set(chromiumRecords.map(r => r.city))], [])
  const uniqueStatuses = useMemo(() => [...new Set(chromiumRecords.map(r => r.status))], [])
  const uniqueManufacturers = useMemo(() => [...new Set(chromiumRecords.map(r => r.manufacturer))], [])

  const cityInvestmentMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of chromiumRecords) { map[r.city] = (map[r.city] || 0) + r.investmentCr }
    return map
  }, [])

  const gradeHardnessMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of chromiumRecords) { map[r.alloyGrade] = r.hardnessHRC }
    return map
  }, [])

  const statusCountMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of chromiumRecords) { map[r.status] = (map[r.status] || 0) + 1 }
    return map
  }, [])

  const zoneInvestmentMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of chromiumRecords) { map[r.zone] = (map[r.zone] || 0) + r.investmentCr }
    return map
  }, [])

  const maxCity = useMemo(() => {
    const entries = (Object.entries(cityInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1])
    return entries[0] || ['N/A', 0]
  }, [cityInvestmentMap])

  const maxHardness = useMemo(() => {
    const entries = (Object.entries(gradeHardnessMap) as [string, number][]).sort((a, b) => b[1] - a[1])
    return entries[0] || ['N/A', 0]
  }, [gradeHardnessMap])

  const tabs = ['Dashboard', 'Registry', 'Analytics', 'Insights']

  return (
    <div className="space-y-6">
      <PageHeader title="Chromium Alloy Logistics" description="Chromium stainless steel and superalloy supply chain for turbine blades, nuclear reactors, surgical instruments, aircraft landing gear, desalination plants, offshore platforms and petrochemical furnaces" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-emerald-600 bg-emerald-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Total Investment</div><div className="text-2xl font-bold text-emerald-800">&#8377;{totalInvestment.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground mt-1">Across {chromiumRecords.length} batches</div></CardContent></Card>
        <Card className="border-l-4 border-l-emerald-600 bg-emerald-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Avg Cr Content</div><div className="text-2xl font-bold text-emerald-800">{avgChromium}%</div><div className="text-xs text-muted-foreground mt-1">Across all alloy grades</div></CardContent></Card>
        <Card className="border-l-4 border-l-emerald-600 bg-emerald-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Delivered</div><div className="text-2xl font-bold text-emerald-800">{deliveredCount}</div><div className="text-xs text-muted-foreground mt-1">{delayedCount} delayed</div></CardContent></Card>
        <Card className="border-l-4 border-l-emerald-600 bg-emerald-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Top City</div><div className="text-2xl font-bold text-emerald-800">{maxCity[0]}</div><div className="text-xs text-muted-foreground mt-1">&#8377;{maxCity[1].toLocaleString()} Cr invested</div></CardContent></Card>
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
          <button key={tab} className={`px-4 py-2 text-sm font-medium ${activeTab === tab ? 'border-b-2 border-emerald-600 text-emerald-800' : 'text-muted-foreground'}`} onClick={() => setActiveTab(tab)}>{tab}</button>
        ))}
      </div>

      {activeTab === 'Dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">Investment by City</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(cityInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([city, val]) => (<div key={city} className="flex items-center gap-2"><span className="text-xs w-24 truncate">{city}</span><div className="flex-1 bg-emerald-100 rounded-full h-3"><div className="bg-emerald-600 h-3 rounded-full" style={{ width: `${(val / maxCity[1]) * 100}%` }}></div></div><span className="text-xs font-medium w-20 text-right">&#8377;{val} Cr</span></div>))}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Hardness by Alloy Grade</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(gradeHardnessMap) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([grade, hrc]) => (<div key={grade} className="flex items-center gap-2"><span className="text-xs w-36 truncate">{grade}</span><div className="flex-1 bg-green-100 rounded-full h-3"><div className="bg-green-600 h-3 rounded-full" style={{ width: `${(hrc / maxHardness[1]) * 100}%` }}></div></div><span className="text-xs font-medium w-16 text-right">{hrc} HRC</span></div>))}</CardContent></Card>
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
              <thead><tr className="border-b"><th className="text-left p-2">Batch</th><th className="text-left p-2">City</th><th className="text-left p-2">Manufacturer</th><th className="text-left p-2">Alloy Grade</th><th className="text-left p-2">Application</th><th className="text-left p-2">Cr%</th><th className="text-left p-2">HRC</th><th className="text-left p-2">&#8377;Cr</th><th className="text-left p-2">Status</th></tr></thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id} className={`border-b ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}>
                    <td className="p-2 font-mono text-xs">{r.batchNo}</td>
                    <td className="p-2">{r.city}</td>
                    <td className="p-2">{r.manufacturer}</td>
                    <td className="p-2">{r.alloyGrade}</td>
                    <td className="p-2 max-w-[200px] truncate">{r.application}</td>
                    <td className="p-2">{r.chromiumPercent}%</td>
                    <td className="p-2">{r.hardnessHRC}</td>
                    <td className="p-2 font-medium">&#8377;{r.investmentCr}</td>
                    <td className="p-2"><Badge variant={r.status === 'Delivered' ? 'default' : r.status === 'Delayed' ? 'destructive' : 'secondary'}>{r.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card><CardHeader><CardTitle className="text-sm">Cr Content by Alloy</CardTitle></CardHeader><CardContent className="space-y-2">{chromiumRecords.slice(0, 8).map(r => (<div key={r.id} className="flex items-center gap-2"><span className="text-xs w-36 truncate">{r.alloyGrade}</span><div className="flex-1 bg-emerald-100 rounded-full h-3"><div className="bg-emerald-600 h-3 rounded-full" style={{ width: `${Math.min((r.chromiumPercent / 25) * 100, 100)}%` }}></div></div><span className="text-xs font-medium w-16 text-right">{r.chromiumPercent}%</span></div>))}</CardContent></Card>
            <Card><CardHeader><CardTitle className="text-sm">Investment by Zone</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(zoneInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([zone, val]) => (<div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone}</span><div className="flex-1 bg-green-100 rounded-full h-3"><div className="bg-green-600 h-3 rounded-full" style={{ width: `${(val / maxCity[1]) * 100}%` }}></div></div><span className="text-xs font-medium w-20 text-right">&#8377;{val} Cr</span></div>))}</CardContent></Card>
          </div>
        </div>
      )}

      {activeTab === 'Analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">Status Distribution</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(statusCountMap) as [string, number][]).map(([status, count]) => (<div key={status} className="flex items-center gap-2"><span className="text-xs w-24">{status}</span><div className="flex-1 bg-emerald-100 rounded-full h-3"><div className="bg-emerald-600 h-3 rounded-full" style={{ width: `${(count / chromiumRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Priority Breakdown</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const map: Record<string, number> = {}; for (const r of chromiumRecords) { map[r.priority] = (map[r.priority] || 0) + 1 } const sorted = (Object.entries(map) as [string, number][]).sort((a, b) => b[1] - a[1]); return sorted.map(([pri, count]) => (<div key={pri} className="flex items-center gap-2"><span className="text-xs w-20">{pri}</span><div className="flex-1 bg-amber-100 rounded-full h-3"><div className="bg-amber-600 h-3 rounded-full" style={{ width: `${(count / chromiumRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))})()}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Shipment Volume by Zone</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const map: Record<string, number> = {}; for (const r of chromiumRecords) { map[r.zone] = (map[r.zone] || 0) + 1 } const sorted = (Object.entries(map) as [string, number][]).sort((a, b) => b[1] - a[1]); return sorted.map(([zone, count]) => (<div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone}</span><div className="flex-1 bg-indigo-100 rounded-full h-3"><div className="bg-indigo-600 h-3 rounded-full" style={{ width: `${(count / chromiumRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))})()}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">SS Family Distribution</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const families: Record<string, number> = { 'Martensitic (4xx)': 0, 'Austenitic (3xx)': 0, 'Ferritic (4xx Low-C)': 0, 'Duplex (2205)': 0, 'Heat-Resistant (3xx High-Cr)': 0 }; for (const r of chromiumRecords) { if (r.alloyGrade.includes('2205')) families['Duplex (2205)']++; else if (r.alloyGrade.includes('309') || r.alloyGrade.includes('310')) families['Heat-Resistant (3xx High-Cr)']++; else if (r.alloyGrade.startsWith('AISI 3')) families['Austenitic (3xx)']++; else if (r.alloyGrade.includes('416') || r.alloyGrade.includes('409') || r.alloyGrade.includes('430')) families['Ferritic (4xx Low-C)']++; else families['Martensitic (4xx)']++ } return (Object.entries(families) as [string, number][]).map(([family, count]) => (<div key={family} className="flex items-center gap-2"><span className="text-xs w-32">{family}</span><div className="flex-1 bg-emerald-100 rounded-full h-3"><div className="bg-emerald-600 h-3 rounded-full" style={{ width: `${(count / chromiumRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))})()}</CardContent></Card>
        </div>
      )}

      {activeTab === 'Insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-l-4 border-l-emerald-600"><CardHeader><CardTitle className="text-sm">India Stainless Steel: 7th Largest Producer Globally</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>India is the world&apos;s 7th largest stainless steel producer at 4.5 MTPA (2025-26), with Jindal Stainless (JSL Hisar, 1.8 MTPA), SAIL (0.6 MTPA), Tata Steel Special (0.4 MTPA) and MIDHANI (0.05 MTPA) as primary producers. Chromium is the defining element of stainless steel, with grades ranging from 11% Cr (409 exhaust) to 25% Cr (310 furnace alloy). India imports 65% of its ferrochrome (FeCr) from South Africa and China, creating strategic vulnerability. The PLI scheme for specialty steel targets &#8377;30,000Cr investment to achieve 50 MTPA capacity by 2030, with chromium alloy demand growing at 9% CAGR. India&apos;s total chromium steel market is &#8377;85,000Cr across flat products (55%), long products (25%) and seamless tubes (20%), with JSL at 40% market share.</p></CardContent></Card>
          <Card className="border-l-4 border-l-sky-500"><CardHeader><CardTitle className="text-sm">AISI 2205 Duplex: Offshore Game-Changer for ONGC</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>AISI 2205 duplex stainless steel (22% Cr-6% Ni-3% Mo-N) with pitting resistance equivalent number (PREN) 35 is the material of choice for ONGC&apos;s Mumbai High offshore platform risers, flowlines and manifolds. India&apos;s 75 offshore platforms operate in severely corrosive seawater (3.5% NaCl, dissolved CO2, H2S), where 2205 provides 2x the yield strength of 316L austenitic SS (450 MPa vs 205 MPa) while maintaining superior chloride pitting resistance. Rajasthan Steel Alloys (Jaipur) supplies 2205 seamless pipes to ONGC, with each riser requiring 40 tonnes of 12-inch OD x 20mm WT pipe at &#8377;215Cr per batch. India&apos;s offshore duplex SS market is &#8377;7,500Cr, growing 15% CAGR aligned with ONGC&apos;s deepwater KG-DWN-98/2 field development targeting 15 MMTPA production.</p></CardContent></Card>
          <Card className="border-l-4 border-l-orange-500"><CardHeader><CardTitle className="text-sm">Boiler Superheater: India 400GW Thermal Fleet</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>India&apos;s 400 GW thermal power fleet (65% coal, 5% gas) consumes 70,000 tonnes of chromium alloy superheater tubes annually, primarily AISI 347 (18% Cr-Nb stabilized) and AISI 321 (18% Cr-Ti stabilized) austenitic grades. BHEL Trichy manufactures 660MW supercritical boiler modules using 347 tubes operating at 620&#176;C superheat steam, with each unit requiring 70 tonnes of tubing. The transition to ultra-supercritical (USC) at 700&#176;C requires advanced alloys like Super 304H (18% Cr-9% Ni-3% Cu-Nb-N) and Sanicro 25 (22.5% Cr-25% Ni), supplied by MIDHANI and imported from Sandvik. India&apos;s boiler Cr tube market is &#8377;8,800Cr, with NTPC alone ordering &#8377;12,000Cr worth of USC tubing for its 26 GW under-construction fleet.</p></CardContent></Card>
          <Card className="border-l-4 border-l-rose-500"><CardHeader><CardTitle className="text-sm">Surgical and Pharma: GMP 316L to 420 Martensitic</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>India&apos;s pharmaceutical and medical device industry consumes &#8377;7,700Cr of chromium alloy annually across two distinct segments: surgical instruments (AISI 420, 14% Cr, 52 HRC for scalpels, forceps and scissors) and pharma process equipment (AISI 316L, 17% Cr-12% Ni-2.5% Mo, 22 HRC electropolished for API reactor vessels, piping and storage tanks). India&apos;s 3,500 pharmaceutical factories must comply with FDA 21 CFR Part 11 and EU Annex 11 requiring 316L stainless with Ra 0.4 micron electropolished surface finish and passivation. Tata Steel Special (Mumbai) supplies 420 surgical bars, while SAIL and JSL supply 316L pharma plates. The surgical segment grows at 12% CAGR driven by India&apos;s 500 million annual surgical procedures, while the pharma segment grows at 18% CAGR aligned with India&apos;s 20% global generic drug market share.</p></CardContent></Card>
        </div>
      )}
    </div>
  )
}
