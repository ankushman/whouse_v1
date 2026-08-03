'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { Factory } from 'lucide-react'

interface ManganeseAlloyRecord {
  id: string
  batchNo: string
  city: string
  manufacturer: string
  alloyGrade: string
  application: string
  manganesePercent: number
  carbonPercent: number
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

const manganeseRecords: ManganeseAlloyRecord[] = [
  { id: 'MNA-0001', batchNo: 'MNA-B2401', city: 'Bhilai', manufacturer: 'SAIL Bhilai', alloyGrade: 'FeMn 75C7 (High Carbon)', application: 'BOF Steelmaking (SAIL BSP)', manganesePercent: 75, carbonPercent: 7, investmentCr: 165, status: 'Delivered', priority: 'Critical', origin: 'MOIL Nagpur (MH)', destination: 'SAIL BSP Bhilai (CG)', shipDate: '2026-07-18', transitDays: 2, zone: 'East', remarks: 'FeMn 75C7 high-carbon ferro manganese for BOF deoxidation &#8594; 75% Mn with 7% C for hot metal de-S de-P &#8594; &#8377;165Cr for 120 tonnes FeMn HC &#8594; SAIL BSP 7 MT steel plant 4 BOF converters &#8594; FeMn HC consumption 8 kg/t crude steel &#8594; India 300 MT crude steel Mn alloy demand &#8594; &#8377;12,500Cr Indian BOF FeMn demand' },
  { id: 'MNA-0002', batchNo: 'MNA-B2402', city: 'Bengaluru', manufacturer: 'Tata Steel', alloyGrade: 'SiMn 65-17 (Silicomanganese)', application: 'EAF Steelmaking (Tata Steel Kalinganagar)', manganesePercent: 65, carbonPercent: 2.5, investmentCr: 185, status: 'In Transit', priority: 'High', origin: 'MOIL Nagpur (MH)', destination: 'Tata Steel Kalinganagar (OD)', shipDate: '2026-07-22', transitDays: 3, zone: 'South', remarks: 'SiMn 65-17 silicomanganese for EAF deoxidation alloying &#8594; 65% Mn 17% Si dual-purpose deoxidizer &#8594; &#8377;185Cr for 95 tonnes SiMn &#8594; Tata Steel Kalinganagar 8 MT greenfield plant &#8594; SiMn replaces separate FeMn + FeSi addition saving &#8377;2,000Cr/MT &#8594; India EAF capacity expanding 15 MT &#8594; &#8377;14,200Cr Indian SiMn demand' },
  { id: 'MNA-0003', batchNo: 'MNA-B2403', city: 'Mumbai', manufacturer: 'JSW Steel', alloyGrade: 'FeMn LC (0.1%C)', application: 'Stainless Steel Melting (JSW Salem)', manganesePercent: 80, carbonPercent: 0.1, investmentCr: 245, status: 'Delivered', priority: 'High', origin: 'EICL Nagpur (MH)', destination: 'JSW Steel Salem (TN)', shipDate: '2026-07-19', transitDays: 3, zone: 'West', remarks: 'FeMn LC low-carbon 80% Mn for stainless steel AOD refining &#8594; 80% Mn with 0.1% C max for austenitic grades &#8594; &#8377;245Cr for 65 tonnes FeMn LC &#8594; JSW Salem 1 MT stainless steel plant &#8594; FeMn LC consumption 12 kg/t SS for 304/316 grade &#8594; India 5 MT SS capacity expanding 8 MT &#8594; &#8377;18,800Cr Indian SS FeMn demand' },
  { id: 'MNA-0004', batchNo: 'MNA-B2404', city: 'Pune', manufacturer: 'Bharat Forge Ltd', alloyGrade: 'Hadfield Mn Steel (12Mn-1C)', application: 'Rail Crossing Frog (Indian Railways)', manganesePercent: 12, carbonPercent: 1.2, investmentCr: 92, status: 'Delayed', priority: 'Critical', origin: 'Tata Steel Jamshedpur (JH)', destination: 'IRI Bhopal (MP)', shipDate: '2026-07-12', transitDays: 4, zone: 'West', remarks: 'Hadfield 12% Mn austenitic steel for rail crossing frogs &#8594; 12% Mn 1.2% C work-hardening to 550 BHN &#8594; &#8377;92Cr for 85 tonnes Hadfield steel castings &#8594; Indian Railways 68,000 km track 15,000 crossings &#8594; Hadfield frog service life 15 years vs carbon steel 3 years &#8594; Delayed 10 days due to manganese ore allocation delay &#8594; &#8377;7,200Cr Indian rail Mn steel demand' },
  { id: 'MNA-0005', batchNo: 'MNA-B2405', city: 'Hyderabad', manufacturer: 'MIDHANI', alloyGrade: 'Mn-Cu Alloy (Al bronze Mn)', application: 'Marine Propeller (GRSE Kolkata)', manganesePercent: 12, carbonPercent: 0.05, investmentCr: 78, status: 'Processing', priority: 'High', origin: 'MIDHANI Hyderabad (TS)', destination: 'GRSE Kolkata (WB)', shipDate: '2026-07-25', transitDays: 2, zone: 'South', remarks: 'Mn-bronze Cu-Mn-Al alloy for naval ship propeller casting &#8594; 12% Mn in Cu matrix for corrosion resistance &#8594; &#8377;78Cr for 12 tonnes Mn-bronze propeller blanks &#8594; GRSE building 12 ASW corvettes for Indian Navy &#8594; Mn-bronze cavitation erosion resistance 5x brass &#8594; Indian Navy 282-ship fleet propeller overhaul programme &#8594; &#8377;6,000Cr Indian naval Mn alloy demand' },
  { id: 'MNA-0006', batchNo: 'MNA-B2406', city: 'Chennai', manufacturer: 'MOIL Limited', alloyGrade: 'EMD (Electrolytic Mn Dioxide)', application: 'Dry Cell Battery (Eveready Chennai)', manganesePercent: 92, carbonPercent: 0, investmentCr: 125, status: 'Delivered', priority: 'Medium', origin: 'MOIL Nagpur (MH)', destination: 'Eveready Chennai (TN)', shipDate: '2026-07-17', transitDays: 2, zone: 'South', remarks: 'EMD 92% MnO2 for alkaline and Leclanche dry cell cathode &#8594; 92% MnO2 electrolytic grade battery quality &#8594; &#8377;125Cr for 4,500 tonnes EMD powder &#8594; India 2.5 billion dry cell batteries/year &#8594; EMD discharge capacity 180 mAh/g in AA alkaline &#8594; India importing 40% EMD from Greece and South Africa &#8594; &#8377;9,500Cr Indian battery EMD demand' },
  { id: 'MNA-0007', batchNo: 'MNA-B2407', city: 'Noida', manufacturer: 'BALCO', alloyGrade: 'Al-Mn 3004 (1.2%Mn)', application: 'Beverage Can Sheet (Hindalco Renukoot)', manganesePercent: 1.2, carbonPercent: 0, investmentCr: 145, status: 'In Transit', priority: 'High', origin: 'Hindalco Renukoot (UP)', destination: 'Ball Beverage Noida (UP)', shipDate: '2026-07-21', transitDays: 1, zone: 'North', remarks: 'Al-Mn 3004 alloy for beverage can body sheet &#8594; 1.2% Mn in Al for work-hardening can stock &#8594; &#8377;145Cr for 2,800 tonnes Al-Mn 3004 sheet &#8594; India 25 billion beverage cans/year &#8594; Al-Mn 3004 earing ratio less than 2% for deep draw &#8594; India can sheet market growing 18% CAGR &#8594; &#8377;11,200Cr Indian can sheet Mn demand' },
  { id: 'MNA-0008', batchNo: 'MNA-B2408', city: 'Ahmedabad', manufacturer: 'Gujarat Fluorochemicals Ltd', alloyGrade: 'MnSO4 (Monohydrate)', application: 'Fertilizer Micronutrient (Gujarat Agro)', manganesePercent: 32, carbonPercent: 0, investmentCr: 18, status: 'Delivered', priority: 'Low', origin: 'MOIL Nagpur (MH)', destination: 'Gujarat Agro Ahmedabad (GJ)', shipDate: '2026-07-16', transitDays: 1, zone: 'West', remarks: 'MnSO4.H2O 32% Mn monohydrate for crop micronutrient &#8594; 32% Mn water-soluble fertilizer grade &#8594; &#8377;18Cr for 500 tonnes MnSO4 &#8594; India 140 MT Mn-deficient soil area &#8594; MnSO4 foliar application 0.5% solution &#8594; India micronutrient market &#8377;5,200Cr &#8594; &#8377;1,400Cr Indian fertilizer Mn demand' },
  { id: 'MNA-0009', batchNo: 'MNA-B2409', city: 'Kolkata', manufacturer: 'Dalmia Cement', alloyGrade: 'FeMn Slag (10%Mn)', application: 'Cement Clinker Additive (Dalmia Kolkata)', manganesePercent: 10, carbonPercent: 1, investmentCr: 12, status: 'Processing', priority: 'Low', origin: 'MOIL Nagpur (MH)', destination: 'Dalmia Kolkata (WB)', shipDate: '2026-07-24', transitDays: 2, zone: 'East', remarks: 'FeMn slag 10% Mn cement kiln flux additive &#8594; 10% Mn slag for cement clinker fluxing &#8594; &#8377;12Cr for 800 tonnes FeMn slag &#8594; Dalmia 40 MT cement capacity &#8594; Mn slag replaces 3% limestone saving energy &#8594; India 380 MT cement production &#8594; &#8377;950Cr Indian cement Mn slag demand' },
  { id: 'MNA-0010', batchNo: 'MNA-B2410', city: 'Jaipur', manufacturer: 'Rajasthan State Mines', alloyGrade: 'MnO2 Ore (Pyrolusite 63%)', application: 'Glass Decolorizer (RSMS Jaipur)', manganesePercent: 63, carbonPercent: 0, investmentCr: 22, status: 'Delivered', priority: 'Medium', origin: 'RSM Khetri (RJ)', destination: 'Asahi Glass Mumbai (MH)', shipDate: '2026-07-18', transitDays: 3, zone: 'North', remarks: 'Pyrolusite MnO2 63% for glass batch decolorization &#8594; 63% MnO2 ore grade for green glass iron removal &#8594; &#8377;22Cr for 600 tonnes MnO2 ore &#8594; India 12 MT glass container production &#8594; MnO2 removes Fe2+ green tint at 0.5% addition &#8594; India 40% MnO2 imported from Gabon and South Africa &#8594; &#8377;1,800Cr Indian glass MnO2 demand' },
  { id: 'MNA-0011', batchNo: 'MNA-B2411', city: 'Coimbatore', manufacturer: 'IIT Madras', alloyGrade: 'Li-MnO2 Spinel (Cathode)', application: 'Lithium-Ion Battery (IIT Madras)', manganesePercent: 63, carbonPercent: 0, investmentCr: 195, status: 'In Transit', priority: 'Critical', origin: 'MOIL Nagpur (MH)', destination: 'IIT Madras (TN)', shipDate: '2026-07-23', transitDays: 2, zone: 'South', remarks: 'LiMn2O4 spinel cathode for lithium-ion battery cells &#8594; 63% Mn in LiMn2O4 spinel cathode powder &#8594; &#8377;195Cr for 8 tonnes LMO cathode material &#8594; IIT Madras LMO cell prototype 120 Wh/kg &#8594; LMO thermal stability 270&#176;C vs NMC 210&#176;C &#8594; India PLI scheme &#8377;18,000Cr for LFP/LMO battery cell &#8594; &#8377;15,000Cr Indian battery Mn demand' },
  { id: 'MNA-0012', batchNo: 'MNA-B2412', city: 'Guwahati', manufacturer: 'Oil India Ltd', alloyGrade: 'Mn-Cr Coating (Weld Overlay)', application: 'Pipeline Wear Protection (OIL Jorhat)', manganesePercent: 14, carbonPercent: 0.8, investmentCr: 35, status: 'Delayed', priority: 'Medium', origin: 'Tata Steel Jamshedpur (JH)', destination: 'OIL Jorhat (AS)', shipDate: '2026-07-11', transitDays: 5, zone: 'East', remarks: 'Mn-Cr weld overlay 14% Mn for pipeline erosion protection &#8594; 14% Mn with Cr-Cb carbide overlay &#8594; &#8377;35Cr for 3 tonnes weld overlay wire &#8594; OIL 800km crude pipeline network &#8594; Mn-Cr overlay wear rate 0.02 mm3 vs base steel 0.15 mm3 &#8594; Delayed 12 days due to monsoon road flooding &#8594; &#8377;2,800Cr Indian pipeline Mn demand' },
  { id: 'MNA-0013', batchNo: 'MNA-B2413', city: 'Bhubaneswar', manufacturer: 'NALCO', alloyGrade: 'Mn-Al Bronze (Cu-Mn-Al-Ni)', application: 'Desalination Plant (NALCO Angul)', manganesePercent: 14, carbonPercent: 0.05, investmentCr: 55, status: 'Processing', priority: 'High', origin: 'MIDHANI Hyderabad (TS)', destination: 'NALCO Captive Angul (OD)', shipDate: '2026-07-26', transitDays: 2, zone: 'East', remarks: 'Mn-Al bronze for seawater desalination heat exchanger tubes &#8594; 14% Mn in Cu-Al-Ni alloy seawater resistant &#8594; &#8377;55Cr for 8 tonnes Mn-Al bronze tube stock &#8594; NALCO 50 MLD desalination plant &#8594; Mn-Al bronze corrosion rate 0.02 mm/year in seawater &#8594; India 700+ desalination plants by 2030 &#8594; &#8377;4,200Cr Indian desalination Mn alloy demand' },
  { id: 'MNA-0014', batchNo: 'MNA-B2414', city: 'Lucknow', manufacturer: 'TASL', alloyGrade: 'Mn-Ni Steel (9%Mn Cryogenic)', application: 'Cryogenic Tank (ISRO LH2 Tank)', manganesePercent: 9, carbonPercent: 0.12, investmentCr: 285, status: 'Delivered', priority: 'Critical', origin: 'MIDHANI Hyderabad (TS)', destination: 'ISRO LPSC Trivandrum (KL)', shipDate: '2026-07-23', transitDays: 3, zone: 'North', remarks: '9% Mn austenitic steel for LH2 cryogenic tank at -253&#176;C &#8594; 9% Mn stable austenite to -196&#176;C without Ni &#8594; &#8377;285Cr for 15 tonnes Mn-Ni plate stock &#8594; ISRO GSLV Mk-III LH2 tank 27 tonnes &#8594; Mn-Ni cryogenic toughness 120J at -196&#176;C &#8594; India cryogenic steel programme &#8377;8,500Cr &#8594; &#8377;22,000Cr Indian aerospace Mn steel demand' },
]

const tabs = ['Dashboard', 'Registry', 'Analytics', 'Insights'] as const
type TabType = typeof tabs[number]

export default function ManganeseAlloyLogisticsView() {
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
    return manganeseRecords.filter(r => {
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

  const uniqueCities = useMemo(() => [...new Set(manganeseRecords.map(r => r.city))].sort(), [])
  const uniqueManufacturers = useMemo(() => [...new Set(manganeseRecords.map(r => r.manufacturer))].sort(), [])
  const uniqueStatuses = useMemo(() => [...new Set(manganeseRecords.map(r => r.status))].sort(), [])
  const uniqueZones = useMemo(() => [...new Set(manganeseRecords.map(r => r.zone))].sort(), [])

  const totalInvestment = useMemo(() => manganeseRecords.reduce((s: number, r) => s + r.investmentCr, 0), [])
  const avgMn = useMemo(() => Math.round(manganeseRecords.reduce((s: number, r) => s + r.manganesePercent, 0) / manganeseRecords.length), [])
  const deliveredCount = useMemo(() => manganeseRecords.filter(r => r.status === 'Delivered').length, [])
  const delayedCount = useMemo(() => manganeseRecords.filter(r => r.status === 'Delayed').length, [])

  const cityInvestmentMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of manganeseRecords) { map[r.city] = (map[r.city] || 0) + r.investmentCr }
    return map
  }, [])

  const gradeMnMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of manganeseRecords) { map[r.alloyGrade] = (map[r.alloyGrade] || 0) + r.manganesePercent }
    return map
  }, [])

  const statusCountMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of manganeseRecords) { map[r.status] = (map[r.status] || 0) + 1 }
    return map
  }, [])

  const zoneInvestmentMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of manganeseRecords) { map[r.zone] = (map[r.zone] || 0) + r.investmentCr }
    return map
  }, [])

  const maxCity = useMemo(() => {
    const entries = (Object.entries(cityInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1])
    return entries[0] || ['N/A', 0]
  }, [cityInvestmentMap])

  const maxMnGrade = useMemo(() => {
    const entries = (Object.entries(gradeMnMap) as [string, number][]).sort((a, b) => b[1] - a[1])
    return entries[0] || ['N/A', 0]
  }, [gradeMnMap])

  return (
    <div className="space-y-6">
      <PageHeader title="Manganese Alloy Logistics" description="Manganese alloy supply chain for steel deoxidation, stainless steel, rail crossings, dry cell batteries, Li-ion cathodes, marine propellers and cryogenic tanks" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-rose-700 bg-rose-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Total Investment</div><div className="text-2xl font-bold text-rose-800">&#8377;{totalInvestment.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground mt-1">Across {manganeseRecords.length} batches</div></CardContent></Card>
        <Card className="border-l-4 border-l-rose-700 bg-rose-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Avg Mn Content</div><div className="text-2xl font-bold text-rose-800">{avgMn}%</div><div className="text-xs text-muted-foreground mt-1">Across all alloy grades</div></CardContent></Card>
        <Card className="border-l-4 border-l-rose-700 bg-rose-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Delivered</div><div className="text-2xl font-bold text-rose-800">{deliveredCount}</div><div className="text-xs text-muted-foreground mt-1">{delayedCount} delayed</div></CardContent></Card>
        <Card className="border-l-4 border-l-rose-700 bg-rose-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Top City</div><div className="text-2xl font-bold text-rose-800">{maxCity[0]}</div><div className="text-xs text-muted-foreground mt-1">&#8377;{maxCity[1].toLocaleString()} Cr invested</div></CardContent></Card>
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
          <button key={tab} className={`px-4 py-2 text-sm font-medium ${activeTab === tab ? 'border-b-2 border-rose-700 text-rose-800' : 'text-muted-foreground'}`} onClick={() => setActiveTab(tab)}>{tab}</button>
        ))}
      </div>

      {activeTab === 'Dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">Investment by City</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(cityInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([city, val]) => (<div key={city} className="flex items-center gap-2"><span className="text-xs w-24 truncate">{city}</span><div className="flex-1 bg-rose-100 rounded-full h-3"><div className="bg-rose-700 h-3 rounded-full" style={{ width: `${(val / maxCity[1]) * 100}%` }}></div></div><span className="text-xs font-medium w-20 text-right">&#8377;{val} Cr</span></div>))}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Mn Content by Alloy Grade</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(gradeMnMap) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([grade, mn]) => (<div key={grade} className="flex items-center gap-2"><span className="text-xs w-36 truncate">{grade}</span><div className="flex-1 bg-pink-100 rounded-full h-3"><div className="bg-pink-500 h-3 rounded-full" style={{ width: `${(mn / maxMnGrade[1]) * 100}%` }}></div></div><span className="text-xs font-medium w-12 text-right">{mn}%</span></div>))}</CardContent></Card>
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
              <thead><tr className="border-b"><th className="text-left p-2">Batch</th><th className="text-left p-2">City</th><th className="text-left p-2">Manufacturer</th><th className="text-left p-2">Alloy Grade</th><th className="text-left p-2">Application</th><th className="text-left p-2">Mn%</th><th className="text-left p-2">C%</th><th className="text-left p-2">&#8377;Cr</th><th className="text-left p-2">Status</th></tr></thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id} className={`border-b ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}>
                    <td className="p-2 font-mono text-xs">{r.batchNo}</td>
                    <td className="p-2">{r.city}</td>
                    <td className="p-2">{r.manufacturer}</td>
                    <td className="p-2">{r.alloyGrade}</td>
                    <td className="p-2 max-w-[200px] truncate">{r.application}</td>
                    <td className="p-2">{r.manganesePercent}%</td>
                    <td className="p-2">{r.carbonPercent}%</td>
                    <td className="p-2 font-medium">&#8377;{r.investmentCr}</td>
                    <td className="p-2"><Badge variant={r.status === 'Delivered' ? 'default' : r.status === 'Delayed' ? 'destructive' : 'secondary'}>{r.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card><CardHeader><CardTitle className="text-sm">Mn % by Alloy</CardTitle></CardHeader><CardContent className="space-y-2">{manganeseRecords.slice(0, 8).map(r => (<div key={r.id} className="flex items-center gap-2"><span className="text-xs w-36 truncate">{r.alloyGrade}</span><div className="flex-1 bg-red-100 rounded-full h-3"><div className="bg-red-500 h-3 rounded-full" style={{ width: `${(r.manganesePercent / 92) * 100}%` }}></div></div><span className="text-xs font-medium w-12 text-right">{r.manganesePercent}%</span></div>))}</CardContent></Card>
            <Card><CardHeader><CardTitle className="text-sm">Investment by Zone</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(zoneInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([zone, val]) => (<div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone}</span><div className="flex-1 bg-pink-100 rounded-full h-3"><div className="bg-pink-500 h-3 rounded-full" style={{ width: `${(val / maxCity[1]) * 100}%` }}></div></div><span className="text-xs font-medium w-20 text-right">&#8377;{val} Cr</span></div>))}</CardContent></Card>
          </div>
        </div>
      )}

      {activeTab === 'Analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">Status Distribution</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(statusCountMap) as [string, number][]).map(([status, count]) => (<div key={status} className="flex items-center gap-2"><span className="text-xs w-24">{status}</span><div className="flex-1 bg-gray-100 rounded-full h-3"><div className="bg-rose-700 h-3 rounded-full" style={{ width: `${(count / manganeseRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Priority Breakdown</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const map: Record<string, number> = {}; for (const r of manganeseRecords) { map[r.priority] = (map[r.priority] || 0) + 1 } const sorted = (Object.entries(map) as [string, number][]).sort((a, b) => b[1] - a[1]); return sorted.map(([pri, count]) => (<div key={pri} className="flex items-center gap-2"><span className="text-xs w-20">{pri}</span><div className="flex-1 bg-red-100 rounded-full h-3"><div className="bg-red-500 h-3 rounded-full" style={{ width: `${(count / manganeseRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))})()}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Shipment Volume by Zone</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const map: Record<string, number> = {}; for (const r of manganeseRecords) { map[r.zone] = (map[r.zone] || 0) + 1 } const sorted = (Object.entries(map) as [string, number][]).sort((a, b) => b[1] - a[1]); return sorted.map(([zone, count]) => (<div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone}</span><div className="flex-1 bg-teal-100 rounded-full h-3"><div className="bg-teal-500 h-3 rounded-full" style={{ width: `${(count / manganeseRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))})()}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Mn Content Range Distribution</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const ranges: Record<string, number> = { 'Below 5% (Trace)': 0, '5-15% (Alloying)': 0, '15-50% (Ferro Mn)': 0, '50%+ (High Mn/EMD)': 0 }; for (const r of manganeseRecords) { if (r.manganesePercent >= 50) ranges['50%+ (High Mn/EMD)']++; else if (r.manganesePercent >= 15) ranges['15-50% (Ferro Mn)']++; else if (r.manganesePercent >= 5) ranges['5-15% (Alloying)']++; else ranges['Below 5% (Trace)']++ } return (Object.entries(ranges) as [string, number][]).map(([range, count]) => (<div key={range} className="flex items-center gap-2"><span className="text-xs w-28">{range}</span><div className="flex-1 bg-indigo-100 rounded-full h-3"><div className="bg-indigo-500 h-3 rounded-full" style={{ width: `${(count / manganeseRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))})()}</CardContent></Card>
        </div>
      )}

      {activeTab === 'Insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-l-4 border-l-rose-700"><CardHeader><CardTitle className="text-sm">FeMn and SiMn: Backbone of 300 MT Indian Steel</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>India&apos;s 300 MT crude steel production consumes 2.4 million tonnes of ferro manganese annually, with FeMn HC (75% Mn, 7% C) used in BOF converters at 8 kg/t and SiMn 65-17 (65% Mn, 17% Si) preferred for EAF steelmaking. SAIL, Tata Steel, JSW, JSPL and NMDC operate 45 BOF converters and 28 EAF furnaces between them, with combined Mn alloy demand valued at &#8377;26,700Cr. MOIL is India&apos;s largest manganese producer at 1.8 MT/year from Nagpur and Balaghat mines, supplying 50% of domestic FeMn/SiMn needs. India imports 35% high-grade Mn ore from South Africa (25%), Australia (8%) and Gabon (2%) to supplement domestic production for critical BOF deoxidation during hot metal processing.</p></CardContent></Card>
          <Card className="border-l-4 border-l-violet-500"><CardHeader><CardTitle className="text-sm">Hadfield Steel: Rail Crossings and Mining Equipment</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>Hadfield steel (12% Mn-1% C) is the world&apos;s original austenitic work-hardening manganese steel, invented by Sir Robert Hadfield in 1882 and still irreplaceable for railway crossings, rock crusher jaws and mining shovel teeth. Indian Railways operates 68,000 km of track with 15,000 crossings requiring annual replacement of 3,500 crossing frogs, each weighing 800 kg of Hadfield steel. The work-hardening mechanism transforms surface hardness from 220 BHN to 550 BHN under impact loading, providing 5x service life vs carbon steel. Tata Steel and SAIL Bhilai produce 85,000 tonnes of Hadfield castings per year. India&apos;s rail and mining Hadfield steel demand is &#8377;7,200Cr with Indian Railways modernisation driving 15% annual growth.</p></CardContent></Card>
          <Card className="border-l-4 border-l-emerald-500"><CardHeader><CardTitle className="text-sm">EMD and LMO: Battery Manganese Revolution</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>Manganese plays a dual role in India&apos;s battery ecosystem: electrolytic manganese dioxide (EMD, 92% MnO2) for 2.5 billion dry-cell alkaline batteries per year, and lithium manganese oxide spinel (LiMn2O4) for emerging Li-ion cathode production. India&apos;s EMD consumption is 18,000 tonnes/year with 40% imported from Greece (Eclipse Resources) and South Africa (Delta EMD). The PLI scheme for advanced chemistry cells (ACC) targets 50 GWh battery cell capacity by 2030, with LMO cathode offering 270&#176;C thermal stability vs NMC 210&#176;C, critical for Indian climate conditions. MOIL is developing battery-grade MnO2 production from Nagpur ore, targeting 10,000 tonnes LMO cathode material by 2028 for ISRO, DRDO and EV applications.</p></CardContent></Card>
          <Card className="border-l-4 border-l-blue-500"><CardHeader><CardTitle className="text-sm">Cryogenic 9% Mn Steel: ISRO LH2 and LNG Storage</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>9% Mn austenitic steel is India&apos;s answer to expensive 304L stainless steel for cryogenic applications at -196&#176;C and below. ISRO&apos;s GSLV Mk-III LH2 tank at -253&#176;C requires 27 tonnes of cryogenic plate with toughness 120J at -196&#176;C, currently met by importing Invar alloy at 10x cost. MIDHANI is developing indigenous 9% Mn-Ni cryogenic steel with stable austenite structure through nitrogen alloying, targeting 50 tonnes/year for ISRO, Indian Space Programme and emerging LNG storage tank market. India&apos;s LNG import capacity expanding to 50 MTPA by 2030 requires 500,000 tonnes of -196&#176;C cryogenic inner tank steel, making 9% Mn a strategic import substitution opportunity worth &#8377;22,000Cr.</p></CardContent></Card>
        </div>
      )}
    </div>
  )
}
