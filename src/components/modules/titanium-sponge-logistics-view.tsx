'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { MountainSnow } from 'lucide-react'

interface TitaniumSpongeRecord {
  id: string
  batchNo: string
  city: string
  manufacturer: string
  processRoute: string
  application: string
  purityPercent: number
  spongeGrade: string
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

const titaniumRecords: TitaniumSpongeRecord[] = [
  { id: 'TIS-0001', batchNo: 'TIS-B2401', city: 'Mumbai', manufacturer: 'MIDHANI Mumbai', processRoute: 'Kroll Process (Mg Reduction)', application: 'Ti-6Al-4V Forging Billet (HAL Aero)', purityPercent: 99.7, spongeGrade: 'Grade 1', investmentCr: 285, status: 'Delivered', priority: 'Critical', origin: 'MIDHANI Mumbai (MH)', destination: 'HAL Aero Structure Bengaluru (KA)', shipDate: '2026-07-20', transitDays: 2, zone: 'West', remarks: 'Kroll process Ti sponge for Tejas Mk2 airframe forging billet &#8594; 99.7% purity Grade 1 aerospace sponge &#8594; &#8377;285Cr for 65 tonnes Ti-6Al-4V billets &#8594; HAL producing 150 Tejas Mk2 fighters/year each requiring 3.2 tonnes Ti &#8594; India importing 70% aerospace Ti sponge from VSMPO-Avisma Russia &#8594; &#8377;22,000Cr Indian aerospace Ti sponge demand' },
  { id: 'TIS-0002', batchNo: 'TIS-B2402', city: 'Hyderabad', manufacturer: 'DRDO DMRL', processRoute: 'Kroll Process (Na Reduction Hunter)', application: 'Ti-6Al-4V ELI Plate (DRDO AMCA)', purityPercent: 99.5, spongeGrade: 'Grade 2', investmentCr: 425, status: 'In Transit', priority: 'Critical', origin: 'DRDO DMRL Hyderabad (TS)', destination: 'TASL Pune (MH)', shipDate: '2026-07-22', transitDays: 2, zone: 'South', remarks: 'Hunter process Ti sponge for AMCA 5th-gen fighter armour plate &#8594; 99.5% purity Grade 2 extra-low interstitial &#8594; &#8377;425Cr for 45 tonnes Ti-6Al-4V ELI plate &#8594; AMCA 25-tonne fighter requiring 6.5 tonnes Ti alloy per aircraft &#8594; India planning 200 AMCA fighters by 2035 &#8594; &#8377;32,500Cr Indian 5th-gen fighter Ti programme' },
  { id: 'TIS-0003', batchNo: 'TIS-B2403', city: 'Bengaluru', manufacturer: 'Tata Advanced Materials', processRoute: 'Armstrong Process (NaCl Assisted)', application: 'Ti-5553 Landing Gear (DRDO ADA)', purityPercent: 99.2, spongeGrade: 'Grade 3', investmentCr: 315, status: 'Delivered', priority: 'High', origin: 'TAM Bengaluru (KA)', destination: 'DRDO ADA Bengaluru (KA)', shipDate: '2026-07-19', transitDays: 1, zone: 'South', remarks: 'Armstrong process Ti-5553 near-beta alloy landing gear forging stock &#8594; 99.2% purity Grade 3 for structural application &#8594; &#8377;315Cr for 28 tonnes Ti-5553 billets &#8594; AMCA landing gear 600kg per aircraft 6 Ti components &#8594; Ti-5553 specific strength 15% higher than Ti-6Al-4V &#8594; DRDO developing indigenous near-beta Ti alloy route &#8594; &#8377;24,000Cr Indian landing gear Ti alloy programme' },
  { id: 'TIS-0004', batchNo: 'TIS-B2404', city: 'Chennai', manufacturer: 'ISRO MPM (NPPC)', processRoute: 'Kroll Process (Mg Reduction)', application: 'Ti-6Al-4V Rocket Motor Case (ISRO PSLV)', purityPercent: 99.7, spongeGrade: 'Grade 1', investmentCr: 195, status: 'Delayed', priority: 'High', origin: 'NPPC Thirumangalam (TN)', destination: 'ISRO LPSC Thiruvananthapuram (KL)', shipDate: '2026-07-13', transitDays: 2, zone: 'South', remarks: 'Kroll process Ti sponge for PSLV S200 solid motor casing &#8594; 99.7% purity Grade 1 for rocket motor pressure vessel &#8594; &#8377;195Cr for 22 tonnes Ti-6Al-4V plate stock &#8594; ISRO launching 12 PSLV missions/year &#8594; Ti motor case 30% lighter than maraging steel at same burst pressure &#8594; Delayed 10 days due to magnesium chloride waste disposal clearance &#8594; &#8377;15,200Cr Indian space Ti demand' },
  { id: 'TIS-0005', batchNo: 'TIS-B2405', city: 'Pune', manufacturer: 'Bharat Forge', processRoute: 'Kroll Process (Mg Reduction)', application: 'Ti-64 Connecting Rod (Mahindra NASCAR)', purityPercent: 99.5, spongeGrade: 'Grade 2', investmentCr: 48, status: 'Processing', priority: 'Medium', origin: 'Bharat Forge Pune (MH)', destination: 'Mahindra Racing Banbury (UK)', shipDate: '2026-07-25', transitDays: 5, zone: 'West', remarks: 'Kroll process Ti-6Al-4V connecting rod for high-performance engine &#8594; 99.5% purity Grade 2 fatigue-rated &#8594; &#8377;48Cr for 2.5 tonnes Ti-64 bar stock &#8594; Mahindra NASCAR and Formula E racing programmes &#8594; Ti connecting rod 40% lighter than steel reducing reciprocating mass &#8594; Bharat Forge diversifying into Ti forging for premium auto &#8594; &#8377;3,800Cr Indian auto Ti alloy market' },
  { id: 'TIS-0006', batchNo: 'TIS-B2406', city: 'Noida', manufacturer: 'Bharat Electronics', processRoute: 'Kroll Process (Mg Reduction)', application: 'Grade 4 CP Ti Sheet (BEL Sonar Dome)', purityPercent: 99.6, spongeGrade: 'Grade 4', investmentCr: 92, status: 'Delivered', priority: 'High', origin: 'MIDHANI Hyderabad (TS)', destination: 'BEL Pune (MH)', shipDate: '2026-07-17', transitDays: 2, zone: 'North', remarks: 'Commercially pure Grade 4 Ti sheet for naval sonar dome &#8594; 99.6% purity high-strength CP Ti &#8594; &#8377;92Cr for 12 tonnes Grade 4 sheet &#8594; BEL producing 50 sonar domes/year for Indian Navy &#8594; CP Ti acoustic transparency 98% at 10kHz vs 85% for GRP &#8594; Indian Navy operating 150+ warships with sonar &#8594; &#8377;7,200Cr Indian naval Ti demand' },
  { id: 'TIS-0007', batchNo: 'TIS-B2407', city: 'Kolkata', manufacturer: 'Hindalco Industries', processRoute: 'FCC Cambridge Process (Fluoride)', application: 'Grade 5 Ti-6Al-4V Wire (Tata Steel Wire)', purityPercent: 99.3, spongeGrade: 'Grade 2', investmentCr: 125, status: 'In Transit', priority: 'High', origin: 'Hindalco R&amp;D Kolkata (WB)', destination: 'Tata Steel Wire Division Kolkata (WB)', shipDate: '2026-07-21', transitDays: 1, zone: 'East', remarks: 'Fluoride process Ti sponge for Ti-6Al-4V welding wire production &#8594; 99.3% purity for consumable welding electrode &#8594; &#8377;125Cr for 8 tonnes welding wire stock &#8594; Tata Steel wire division producing aerospace Ti wire &#8594; Ti welding wire demand growing 15% CAGR for defence and aerospace &#8594; India importing 80% Ti welding wire from USA &#8594; &#8377;9,500Cr Indian Ti welding wire demand' },
  { id: 'TIS-0008', batchNo: 'TIS-B2408', city: 'Ahmedabad', manufacturer: 'Adani Defence', processRoute: 'Kroll Process (Mg Reduction)', application: 'Ti-6Al-7Nb Hip Implant (SCTIMST)', purityPercent: 99.7, spongeGrade: 'Grade 1', investmentCr: 68, status: 'Delivered', priority: 'High', origin: 'MIDHANI Mumbai (MH)', destination: 'SCTIMST Trivandrum (KL)', shipDate: '2026-07-16', transitDays: 3, zone: 'West', remarks: 'Kroll process Ti-6Al-7Nb alloy for hip joint femoral stem &#8594; 99.7% purity Grade 1 biomedical Ti &#8594; &#8377;68Cr for 4 tonnes Ti-6Al-7Nb bar stock &#8594; SCTIMST performing 15,000 hip replacements/year &#8594; Ti-6Al-7Nb eliminates V toxicity concern vs Ti-6Al-4V &#8594; India importing 60% orthopaedic Ti from Switzerland &#8594; &#8377;5,400Cr Indian orthopaedic Ti market' },
  { id: 'TIS-0009', batchNo: 'TIS-B2409', city: 'Jaipur', manufacturer: 'Rajasthan State Mines', processRoute: 'Ilmenite Smelting (Becher)', application: 'TiO2 Pigment Grade (KKIL Rajasthan)', purityPercent: 92.0, spongeGrade: 'Slag Grade', investmentCr: 185, status: 'Processing', priority: 'Medium', origin: 'RSM Processing Jaipur (RJ)', destination: 'KKIL Kochi (KL)', shipDate: '2026-07-24', transitDays: 3, zone: 'North', remarks: 'Becher process TiO2 slag from Rajasthan ilmenite for pigment production &#8594; 92% TiO2 slag grade 85 TiO2 content &#8594; &#8377;185Cr for 120 tonnes TiO2 slag &#8594; India 4th largest Ti mineral producer globally &#8594; Rajasthan ilmenite deposit 85 MT with 53% TiO2 content &#8594; Kerala Minerals&amp;Metals (KKIL) largest Indian TiO2 producer &#8594; &#8377;14,500Cr Indian TiO2 pigment market' },
  { id: 'TIS-0010', batchNo: 'TIS-B2410', city: 'Coimbatore', manufacturer: 'IIT Madras Research', processRoute: 'Electrolytic FFC Process', application: 'CP Ti Powder for 3D Printing (Wipro 3D)', purityPercent: 99.5, spongeGrade: 'Powder Grade', investmentCr: 145, status: 'Delivered', priority: 'High', origin: 'IIT Madras (TN)', destination: 'Wipro 3D Bengaluru (KA)', shipDate: '2026-07-18', transitDays: 1, zone: 'South', remarks: 'FFC Cambridge electrolytic Ti powder for aerospace AM &#8594; 99.5% purity spherical powder 15-45 micron &#8594; &#8377;145Cr for 5 tonnes Ti AM powder &#8594; Wipro 3D printing 200 aerospace components/year &#8594; FFC process reduces Ti production cost 40% vs Kroll &#8594; India importing 95% Ti AM powder from Germany &#8594; &#8377;11,200Cr Indian AM Ti powder market' },
  { id: 'TIS-0011', batchNo: 'TIS-B2411', city: 'Bhubaneswar', manufacturer: 'Indian Rare Earths', processRoute: 'Becher Slag Route', application: 'Rutile Upgrade (DMRL)', purityPercent: 95.0, spongeGrade: 'Rutile', investmentCr: 78, status: 'In Transit', priority: 'High', origin: 'IRE Chavara (KL)', destination: 'DRDO DMRL Hyderabad (TS)', shipDate: '2026-07-23', transitDays: 4, zone: 'East', remarks: 'Synthetic rutile upgrade from Kerala ilmenite for Ti sponge feedstock &#8594; 95% TiO2 synthetic rutile &#8594; &#8377;78Cr for 85 tonnes synthetic rutile &#8594; DRDO DMRL titanium sponge pilot plant requiring 200 TPD feed &#8594; Synthetic rutile from 54% ilmenite to 95% TiO2 via Becher process &#8594; India importing 60% synthetic rutile from Australia &#8594; &#8377;6,200Cr Indian Ti feedstock demand' },
  { id: 'TIS-0012', batchNo: 'TIS-B2412', city: 'Guwahati', manufacturer: 'Oil India Ltd', processRoute: 'Kroll Process (Mg Reduction)', application: 'Ti Gr2 Heat Exchanger (ONGC Jorhat)', purityPercent: 99.5, spongeGrade: 'Grade 2', investmentCr: 42, status: 'Delayed', priority: 'Medium', origin: 'MIDHANI Mumbai (MH)', destination: 'ONGC Jorhat (AS)', shipDate: '2026-07-11', transitDays: 5, zone: 'East', remarks: 'Grade 2 CP Ti heat exchanger tube for offshore platform &#8594; 99.5% purity Grade 2 seawater corrosion resistant &#8594; &#8377;42Cr for 6 tonnes Ti tube stock &#8594; ONGC operating 150 offshore platforms in Arabian Sea &#8594; Ti HX life 30 years vs 8 years for Cu-Ni in seawater service &#8594; Delayed 12 days due to monsoon transport disruption &#8594; &#8377;3,200Cr Indian offshore Ti demand' },
  { id: 'TIS-0013', batchNo: 'TIS-B2413', city: 'Gandhinagar', manufacturer: 'Gujarat Fluorochemicals', processRoute: 'Armstrong Process (NaCl Assisted)', application: 'Ti Alloy Powder for MIM (Reliance AM)', purityPercent: 99.2, spongeGrade: 'Powder Grade', investmentCr: 168, status: 'Processing', priority: 'High', origin: 'GFCL Gandhinagar (GJ)', destination: 'Reliance AM Mumbai (MH)', shipDate: '2026-07-26', transitDays: 1, zone: 'West', remarks: 'Armstrong process Ti alloy powder for metal injection moulding &#8594; 99.2% purity MIM-grade powder 5-25 micron &#8594; &#8377;168Cr for 8 tonnes Ti MIM powder &#8594; Reliance AM producing 500,000 Ti MIM smartphone hinges/year &#8594; Ti MIM reduces machining cost 60% vs wrought Ti &#8594; India importing 90% Ti MIM powder from Japan &#8594; &#8377;13,000Cr Indian Ti MIM powder market' },
  { id: 'TIS-0014', batchNo: 'TIS-B2414', city: 'Lucknow', manufacturer: 'Tata Advanced Systems', processRoute: 'Kroll Process (Mg Reduction)', application: 'Ti-6Al-4V Missile Body (DRDO Astra Mk3)', purityPercent: 99.7, spongeGrade: 'Grade 1', investmentCr: 198, status: 'In Transit', priority: 'Critical', origin: 'TASL Lucknow (UP)', destination: 'BDL Hyderabad (TS)', shipDate: '2026-07-23', transitDays: 2, zone: 'North', remarks: 'Kroll process Ti sponge for Astra Mk3 missile airframe integration &#8594; 99.7% purity Grade 1 for missile pressure vessel &#8594; &#8377;198Cr for 15 tonnes Ti-6Al-4V missile body stock &#8594; Astra Mk3 350km BVRAAM requiring 120kg Ti per missile &#8594; BDL producing 100 Astra missiles/year &#8594; India&apos;s BVR missile programme &#8377;8,500Cr by 2030 &#8594; &#8377;15,800Cr Indian missile Ti demand' },
]

const tabs = ['Dashboard', 'Registry', 'Analytics', 'Insights'] as const
type TabType = typeof tabs[number]

export default function TitaniumSpongeLogisticsView() {
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
    return titaniumRecords.filter(r => {
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

  const uniqueCities = useMemo(() => [...new Set(titaniumRecords.map(r => r.city))].sort(), [])
  const uniqueManufacturers = useMemo(() => [...new Set(titaniumRecords.map(r => r.manufacturer))].sort(), [])
  const uniqueStatuses = useMemo(() => [...new Set(titaniumRecords.map(r => r.status))].sort(), [])
  const uniqueZones = useMemo(() => [...new Set(titaniumRecords.map(r => r.zone))].sort(), [])

  const totalInvestment = useMemo(() => titaniumRecords.reduce((s: number, r) => s + r.investmentCr, 0), [])
  const avgPurity = useMemo(() => (titaniumRecords.reduce((s: number, r) => s + r.purityPercent, 0) / titaniumRecords.length).toFixed(1), [])
  const deliveredCount = useMemo(() => titaniumRecords.filter(r => r.status === 'Delivered').length, [])
  const delayedCount = useMemo(() => titaniumRecords.filter(r => r.status === 'Delayed').length, [])

  const cityInvestmentMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of titaniumRecords) { map[r.city] = (map[r.city] || 0) + r.investmentCr }
    return map
  }, [])

  const processInvestmentMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of titaniumRecords) { map[r.processRoute] = (map[r.processRoute] || 0) + r.investmentCr }
    return map
  }, [])

  const statusCountMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of titaniumRecords) { map[r.status] = (map[r.status] || 0) + 1 }
    return map
  }, [])

  const zoneInvestmentMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of titaniumRecords) { map[r.zone] = (map[r.zone] || 0) + r.investmentCr }
    return map
  }, [])

  const maxCity = useMemo(() => {
    const entries = (Object.entries(cityInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1])
    return entries[0] || ['N/A', 0]
  }, [cityInvestmentMap])

  const maxProcess = useMemo(() => {
    const entries = (Object.entries(processInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1])
    return entries[0] || ['N/A', 0]
  }, [processInvestmentMap])

  return (
    <div className="space-y-6">
      <PageHeader title="Titanium Sponge Logistics" description="Strategic titanium sponge and titanium alloy supply chain tracking for aerospace, defence, naval, biomedical and additive manufacturing applications" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-cyan-500 bg-cyan-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Total Investment</div><div className="text-2xl font-bold text-cyan-700">&#8377;{totalInvestment.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground mt-1">Across {titaniumRecords.length} batches</div></CardContent></Card>
        <Card className="border-l-4 border-l-cyan-500 bg-cyan-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Avg Purity</div><div className="text-2xl font-bold text-cyan-700">{avgPurity}%</div><div className="text-xs text-muted-foreground mt-1">Across all process routes</div></CardContent></Card>
        <Card className="border-l-4 border-l-cyan-500 bg-cyan-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Delivered</div><div className="text-2xl font-bold text-cyan-700">{deliveredCount}</div><div className="text-xs text-muted-foreground mt-1">{delayedCount} delayed</div></CardContent></Card>
        <Card className="border-l-4 border-l-cyan-500 bg-cyan-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Top City</div><div className="text-2xl font-bold text-cyan-700">{maxCity[0]}</div><div className="text-xs text-muted-foreground mt-1">&#8377;{maxCity[1].toLocaleString()} Cr invested</div></CardContent></Card>
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
          <button key={tab} className={`px-4 py-2 text-sm font-medium ${activeTab === tab ? 'border-b-2 border-cyan-500 text-cyan-700' : 'text-muted-foreground'}`} onClick={() => setActiveTab(tab)}>{tab}</button>
        ))}
      </div>

      {activeTab === 'Dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">Investment by City</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(cityInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([city, val]) => (<div key={city} className="flex items-center gap-2"><span className="text-xs w-24 truncate">{city}</span><div className="flex-1 bg-cyan-100 rounded-full h-3"><div className="bg-cyan-500 h-3 rounded-full" style={{ width: `${(val / maxCity[1]) * 100}%` }}></div></div><span className="text-xs font-medium w-20 text-right">&#8377;{val} Cr</span></div>))}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Investment by Process Route</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(processInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([proc, val]) => (<div key={proc} className="flex items-center gap-2"><span className="text-xs w-40 truncate">{proc}</span><div className="flex-1 bg-blue-100 rounded-full h-3"><div className="bg-blue-500 h-3 rounded-full" style={{ width: `${(val / maxProcess[1]) * 100}%` }}></div></div><span className="text-xs font-medium w-20 text-right">&#8377;{val} Cr</span></div>))}</CardContent></Card>
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
              <thead><tr className="border-b"><th className="text-left p-2">Batch</th><th className="text-left p-2">City</th><th className="text-left p-2">Manufacturer</th><th className="text-left p-2">Process Route</th><th className="text-left p-2">Application</th><th className="text-left p-2">Purity</th><th className="text-left p-2">Grade</th><th className="text-left p-2">&#8377;Cr</th><th className="text-left p-2">Status</th></tr></thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id} className={`border-b ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}>
                    <td className="p-2 font-mono text-xs">{r.batchNo}</td>
                    <td className="p-2">{r.city}</td>
                    <td className="p-2">{r.manufacturer}</td>
                    <td className="p-2 max-w-[160px] truncate">{r.processRoute}</td>
                    <td className="p-2 max-w-[200px] truncate">{r.application}</td>
                    <td className="p-2">{r.purityPercent}%</td>
                    <td className="p-2">{r.spongeGrade}</td>
                    <td className="p-2 font-medium">&#8377;{r.investmentCr}</td>
                    <td className="p-2"><Badge variant={r.status === 'Delivered' ? 'default' : r.status === 'Delayed' ? 'destructive' : 'secondary'}>{r.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card><CardHeader><CardTitle className="text-sm">Purity Level by Batch</CardTitle></CardHeader><CardContent className="space-y-2">{titaniumRecords.slice(0, 8).map(r => (<div key={r.id} className="flex items-center gap-2"><span className="text-xs w-24">{r.batchNo}</span><div className="flex-1 bg-teal-100 rounded-full h-3"><div className="bg-teal-500 h-3 rounded-full" style={{ width: `${r.purityPercent}%` }}></div></div><span className="text-xs font-medium w-12 text-right">{r.purityPercent}%</span></div>))}</CardContent></Card>
            <Card><CardHeader><CardTitle className="text-sm">Investment by Zone</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(zoneInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([zone, val]) => (<div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone}</span><div className="flex-1 bg-violet-100 rounded-full h-3"><div className="bg-violet-500 h-3 rounded-full" style={{ width: `${(val / maxCity[1]) * 100}%` }}></div></div><span className="text-xs font-medium w-20 text-right">&#8377;{val} Cr</span></div>))}</CardContent></Card>
          </div>
        </div>
      )}

      {activeTab === 'Analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">Status Distribution</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(statusCountMap) as [string, number][]).map(([status, count]) => (<div key={status} className="flex items-center gap-2"><span className="text-xs w-24">{status}</span><div className="flex-1 bg-gray-100 rounded-full h-3"><div className="bg-cyan-500 h-3 rounded-full" style={{ width: `${(count / titaniumRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Priority Breakdown</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const map: Record<string, number> = {}; for (const r of titaniumRecords) { map[r.priority] = (map[r.priority] || 0) + 1 } const sorted = (Object.entries(map) as [string, number][]).sort((a, b) => b[1] - a[1]); return sorted.map(([pri, count]) => (<div key={pri} className="flex items-center gap-2"><span className="text-xs w-20">{pri}</span><div className="flex-1 bg-amber-100 rounded-full h-3"><div className="bg-amber-500 h-3 rounded-full" style={{ width: `${(count / titaniumRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))})()}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Shipment Volume by Zone</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const map: Record<string, number> = {}; for (const r of titaniumRecords) { map[r.zone] = (map[r.zone] || 0) + 1 } const sorted = (Object.entries(map) as [string, number][]).sort((a, b) => b[1] - a[1]); return sorted.map(([zone, count]) => (<div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone}</span><div className="flex-1 bg-blue-100 rounded-full h-3"><div className="bg-blue-500 h-3 rounded-full" style={{ width: `${(count / titaniumRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))})()}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Sponge Grade Distribution</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const map: Record<string, number> = {}; for (const r of titaniumRecords) { map[r.spongeGrade] = (map[r.spongeGrade] || 0) + 1 } const sorted = (Object.entries(map) as [string, number][]).sort((a, b) => b[1] - a[1]); return sorted.map(([grade, count]) => (<div key={grade} className="flex items-center gap-2"><span className="text-xs w-20">{grade}</span><div className="flex-1 bg-indigo-100 rounded-full h-3"><div className="bg-indigo-500 h-3 rounded-full" style={{ width: `${(count / titaniumRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))})()}</CardContent></Card>
        </div>
      )}

      {activeTab === 'Insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-l-4 border-l-cyan-500"><CardHeader><CardTitle className="text-sm">India&apos;s Ti Sponge Self-Reliance Mission</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>India imports 70% of its titanium sponge requirements, primarily from VSMPO-Avisma (Russia) and Toho (Japan). The KMMG (Kerala Minerals and Metals) and MIDHANI are India&apos;s only Ti sponge producers, with combined capacity of 500 tonnes/year against demand of 2,800 tonnes/year. DRDO DMRL is establishing a 1,200 TPD Ti sponge pilot plant using indigenous Kroll process technology. NPPC Thirumangalam is expanding its Ti sponge capacity to 1,000 tonnes by 2028. India&apos;s Ti mineral resources (ilmenite 85 MT, rutile 22 MT) are among the world&apos;s largest but sponge conversion remains the bottleneck.</p></CardContent></Card>
          <Card className="border-l-4 border-l-amber-500"><CardHeader><CardTitle className="text-sm">Aerospace: Largest Ti Consumer</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>Aerospace and defence account for 65% of India&apos;s titanium demand. HAL&apos;s Tejas Mk2 requires 3.2 tonnes of Ti-6Al-4V per aircraft, with 150 fighters planned (480 tonnes total). DRDO AMCA pushes this further with 6.5 tonnes Ti per aircraft and 200 planned units (1,300 tonnes). The ISRO PSLV programme uses Ti motor cases 30% lighter than steel alternatives. India&apos;s combined aerospace Ti alloy demand is projected at &#8377;69,700Cr by 2030, making titanium self-reliance a strategic imperative for indigenous fighter and space programmes.</p></CardContent></Card>
          <Card className="border-l-4 border-l-emerald-500"><CardHeader><CardTitle className="text-sm">Additive Manufacturing Disruption</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>Titanium is the leading metal for aerospace additive manufacturing due to its high specific strength and AM compatibility. IIT Madras is developing FFC Cambridge electrolytic Ti powder at 40% lower cost than Kroll-derived powder. Wipro 3D and Reliance AM are India&apos;s leading Ti AM adopters, producing 200 aerospace components and 500,000 consumer MIM parts respectively. The FFC process eliminates the energy-intensive Mg reduction step, potentially reducing India&apos;s Ti AM powder import dependency from 95% to 40% by 2030. India&apos;s Ti AM powder market is &#8377;24,200Cr by 2030.</p></CardContent></Card>
          <Card className="border-l-4 border-l-blue-500"><CardHeader><CardTitle className="text-sm">Naval and Biomedical Niche</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>BEL produces 50 naval sonar domes/year using CP Grade 4 Ti sheet — its acoustic transparency (98% at 10kHz) is unmatched by GRP alternatives. Indian Navy&apos;s 150+ warships create sustained demand. On the biomedical side, SCTIMST uses Ti-6Al-7Nb (vanadium-free) for hip implants, performing 15,000 replacements/year. India imports 60% of orthopaedic Ti from Switzerland. The combined naval and biomedical Ti market is &#8377;12,600Cr and growing at 18% CAGR as Navy expands to 200 warships and India&apos;s ageing population drives implant demand.</p></CardContent></Card>
        </div>
      )}
    </div>
  )
}
