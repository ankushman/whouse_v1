'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { Gauge } from 'lucide-react'

interface VanadiumAlloyRecord {
  id: string
  batchNo: string
  city: string
  manufacturer: string
  alloyGrade: string
  application: string
  vanadiumPercent: number
  yieldStrengthMPa: number
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

const vanadiumRecords: VanadiumAlloyRecord[] = [
  { id: 'VAN-0001', batchNo: 'VAN-B2401', city: 'Bengaluru', manufacturer: 'MIDHANI', alloyGrade: 'Ti-6Al-4V (V ~4%)', application: 'LCA Tejas Airframe Forging (HAL)', vanadiumPercent: 4, yieldStrengthMPa: 895, investmentCr: 285, status: 'Delivered', priority: 'Critical', origin: 'MIDHANI Hyderabad (TS)', destination: 'HAL Bengaluru (KA)', shipDate: '2026-07-18', transitDays: 1, zone: 'South', remarks: 'Ti-6Al-4V forging for Tejas Mk2 main wing spar &#8594; 4% V stabilizes beta phase for alpha-beta alloy &#8594; &#8377;285Cr for 28 tonnes forged billets &#8594; HAL producing 120 Tejas Mk2/year &#8594; Ti-6Al-4V yield 895MPa specific strength 2x steel &#8594; India consuming 4,000 tonnes Ti-6Al-4V/year &#8594; &#8377;22,500Cr Indian aerospace Ti-V demand' },
  { id: 'VAN-0002', batchNo: 'VAN-B2402', city: 'Hyderabad', manufacturer: 'DRDO DMRL', alloyGrade: 'V-4Cr-4Ti (V-based)', application: 'Fusion Reactor First Wall (IPR)', vanadiumPercent: 92, yieldStrengthMPa: 480, investmentCr: 342, status: 'In Transit', priority: 'Critical', origin: 'DRDO DMRL Hyderabad (TS)', destination: 'IPR Gandhinagar (GJ)', shipDate: '2026-07-22', transitDays: 2, zone: 'South', remarks: 'V-4Cr-4Ti vanadium alloy for SST-2 fusion first wall &#8594; 92% V with 4% Cr 4% Ti for radiation resistance &#8594; &#8377;342Cr for 8 tonnes V-alloy plate &#8594; IPR SST-2 DEMO fusion reactor programme &#8594; V-4Cr-4Ti swelling resistance 50x SS316 at 700&#176;C &#8594; India contributing ITER V-alloy test blanket module &#8594; &#8377;28,000Cr Indian fusion V alloy programme' },
  { id: 'VAN-0003', batchNo: 'VAN-B2403', city: 'Mumbai', manufacturer: 'Tata Steel', alloyGrade: 'FeV-50 Microalloy (Ferro-Vanadium)', application: 'HSLA Rebar Grade Fe550D (Tata Tiscon)', vanadiumPercent: 50, yieldStrengthMPa: 550, investmentCr: 118, status: 'Delivered', priority: 'High', origin: 'Tata Steel Jamshedpur (JH)', destination: 'Tata Tiscon Plant Ranchi (JH)', shipDate: '2026-07-19', transitDays: 1, zone: 'West', remarks: 'Ferro-Vanadium FeV-50 microalloying for seismic-grade rebar &#8594; 50% V in Fe matrix for 0.06% addition &#8594; &#8377;118Cr for 220 tonnes FeV-50 &#8594; India 65 million tonnes rebar/year world largest &#8594; 0.06% V addition raises rebar yield from 415 to 550MPa &#8594; India consuming 12,000 tonnes FeV/year for construction &#8594; &#8377;8,500Cr Indian construction V market' },
  { id: 'VAN-0004', batchNo: 'VAN-B2404', city: 'Pune', manufacturer: 'Bharat Forge', alloyGrade: 'Ti-10V-2Fe-3Al (Beta Ti)', application: 'Landing Gear Forging (Airbus India)', vanadiumPercent: 10, yieldStrengthMPa: 1250, investmentCr: 395, status: 'Delayed', priority: 'Critical', origin: 'Bharat Forge Pune (MH)', destination: 'Airbus TAT Fazilka (PB)', shipDate: '2026-07-12', transitDays: 3, zone: 'West', remarks: 'Ti-10V-2Fe-3Al beta titanium for A320neo main landing gear &#8594; 10% V stabilizes metastable beta for high strength &#8594; &#8377;395Cr for 6 tonnes premium forged gear beams &#8594; Airbus TAT India 200 landing gear sets/year &#8594; Ti-10-2-3 yield 1250MPa 25% stronger than Ti-6-4 &#8594; Delayed 10 days due to beta forging heat treatment rework &#8594; &#8377;32,000Cr Indian aerospace beta Ti demand' },
  { id: 'VAN-0005', batchNo: 'VAN-B2405', city: 'Chennai', manufacturer: 'IGCAR Kalpakkam', alloyGrade: 'V-5Cr-5Ti (V-based)', application: 'Fast Breeder Blanket (BHAVINI PFBR)', vanadiumPercent: 90, yieldStrengthMPa: 420, investmentCr: 268, status: 'Processing', priority: 'High', origin: 'MIDHANI Hyderabad (TS)', destination: 'BHAVINI Kalpakkam (TN)', shipDate: '2026-07-25', transitDays: 1, zone: 'South', remarks: 'V-5Cr-5Ti alloy for PFBR internal test blanket module &#8594; 90% V with 5% Cr 5% Ti for sodium compatibility &#8594; &#8377;268Cr for 5 tonnes plate stock &#8594; BHAVINI 500MW PFBR operational since 2024 &#8594; V-5Cr-5Ti Na corrosion rate 0.01mm/year &#8594; India testing V-alloy for 8 planned FBRs &#8594; &#8377;22,000Cr Indian nuclear V alloy demand' },
  { id: 'VAN-0006', batchNo: 'VAN-B2406', city: 'Noida', manufacturer: 'SAIL BSP', alloyGrade: 'FeV-80 High Purity', application: 'Rail Steel R350HT (SAIL IISCO)', vanadiumPercent: 80, yieldStrengthMPa: 350, investmentCr: 145, status: 'Delivered', priority: 'High', origin: 'SAIL BSP Rourkela (OD)', destination: 'IISCO Burnpur (WB)', shipDate: '2026-07-17', transitDays: 2, zone: 'North', remarks: 'FeV-80 for premium rail steel microalloying R350HT &#8594; 80% V purity for 0.05% rail steel addition &#8594; &#8377;145Cr for 95 tonnes FeV-80 &#8594; Indian Railways 68,000 km route world 4th largest &#8594; V microalloyed rail fatigue life 2x carbon rail &#8594; India consuming 4,500 tonnes FeV/year for rail &#8594; &#8377;10,800Cr Indian rail V demand' },
  { id: 'VAN-0007', batchNo: 'VAN-B2407', city: 'Kolkata', manufacturer: 'JSW Steel', alloyGrade: 'FeV-50Nb Microalloy (Complex)', application: 'Linepipe Steel X100 (JSW Vijayanagar)', vanadiumPercent: 40, yieldStrengthMPa: 690, investmentCr: 195, status: 'In Transit', priority: 'High', origin: 'JSW Salem (TN)', destination: 'JSW Vijayanagar (KA)', shipDate: '2026-07-21', transitDays: 2, zone: 'East', remarks: 'FeV-50Nb dual microalloy for X100 sour gas pipeline &#8594; 40% V with Nb for V-Nb precipitation strengthening &#8594; &#8377;195Cr for 110 tonnes FeV-Nb &#8594; India 16,000 km National Gas Grid expansion &#8594; V-Nb microalloy achieves X100 (690MPa) vs X70 (485MPa) &#8594; India pipeline steel V market &#8377;14,500Cr &#8594; &#8377;14,500Cr Indian pipeline V demand' },
  { id: 'VAN-0008', batchNo: 'VAN-B2408', city: 'Ahmedabad', manufacturer: 'Gujarat Fluorochemicals', alloyGrade: 'V2O5 Flakes 99.5%', application: 'Sulphuric Acid Catalyst ( Paradeep Phosphate)', vanadiumPercent: 56, yieldStrengthMPa: 0, investmentCr: 68, status: 'Delivered', priority: 'Medium', origin: 'GFCL Dahej (GJ)', destination: 'Paradeep Phosphates (OD)', shipDate: '2026-07-16', transitDays: 2, zone: 'West', remarks: 'V2O5 vanadium pentoxide for contact sulphuric acid process &#8594; 56% V in V2O5 flake catalyst on silica &#8594; &#8377;68Cr for 85 tonnes V2O5 catalyst &#8594; India 16 MMTPA sulphuric acid production &#8594; V2O5 catalyst SO2 conversion efficiency 99.7% &#8594; India importing 70% V2O5 from China and South Africa &#8594; &#8377;5,200Cr Indian chemical V demand' },
  { id: 'VAN-0009', batchNo: 'VAN-B2409', city: 'Jaipur', manufacturer: 'Rajasthan State Mines', alloyGrade: 'Vanadium Slag V2O5 Feed', application: 'VRFB Energy Storage (RSM Pilot)', vanadiumPercent: 25, yieldStrengthMPa: 0, investmentCr: 92, status: 'Processing', priority: 'High', origin: 'RSM Khetri (RJ)', destination: 'R&amp;D Jaipur (RJ)', shipDate: '2026-07-24', transitDays: 0, zone: 'North', remarks: 'Vanadium slag extraction for VRFB (vanadium redox flow battery) &#8594; 25% V2O5 in steel slag for VRFB electrolyte &#8594; &#8377;92Cr for 450 tonnes slag processing &#8594; India targeting 10 GWh VRFB storage by 2030 &#8594; VRFB uses V2+/V3+ and VO2+/VO2+ couples 20-year life &#8594; RSM developing 50 tonnes V2O5/year extraction &#8594; &#8377;7,500Cr Indian energy storage V demand' },
  { id: 'VAN-0010', batchNo: 'VAN-B2410', city: 'Coimbatore', manufacturer: 'IIT Madras', alloyGrade: 'AMZ-4 (Zr-based BMG)', application: 'EV Motor Rotor Sleeve (TVS Motor)', vanadiumPercent: 15, yieldStrengthMPa: 1800, investmentCr: 178, status: 'Delivered', priority: 'High', origin: 'IIT Madras (TN)', destination: 'TVS Motor Hosur (TN)', shipDate: '2026-07-18', transitDays: 1, zone: 'South', remarks: 'Zr-based bulk metallic glass with 15% V for EV rotor sleeve &#8594; 15% V increases glass-forming ability and fracture toughness &#8594; &#8377;178Cr for 2.5 tonnes BMG ribbons &#8594; TVS producing 500,000 EV motors/year &#8594; AMZ-4 yield 1800MPa elastic limit 2% &#8594; IIT Madras developing BMG for EV and drone &#8594; &#8377;14,000Cr Indian BMG V demand' },
  { id: 'VAN-0011', batchNo: 'VAN-B2411', city: 'Bhubaneswar', manufacturer: 'NALCO', alloyGrade: 'FeV-50 Microalloy (Standard)', application: 'Automotive Spring Steel (Tata Motors)', vanadiumPercent: 50, yieldStrengthMPa: 1500, investmentCr: 135, status: 'In Transit', priority: 'Medium', origin: 'SAIL Rourkela (OD)', destination: 'Tata Steel Jamshedpur (JH)', shipDate: '2026-07-23', transitDays: 3, zone: 'East', remarks: 'FeV-50 microalloy for automotive suspension spring steel &#8594; 50% V for 0.15% spring steel addition &#8594; &#8377;135Cr for 180 tonnes FeV-50 &#8594; India 35 million vehicles/year spring demand &#8594; V microalloyed spring fatigue life 2.5x carbon spring &#8594; India automotive steel V demand &#8377;9,800Cr &#8594; &#8377;9,800Cr Indian automotive V demand' },
  { id: 'VAN-0012', batchNo: 'VAN-B2412', city: 'Guwahati', manufacturer: 'Oil India Ltd', alloyGrade: 'V-5Cr-5Ti Clad Plate', application: 'Offshore Flowline (ONGC Mumbai Offshore)', vanadiumPercent: 90, yieldStrengthMPa: 420, investmentCr: 225, status: 'Delayed', priority: 'High', origin: 'MIDHANI Hyderabad (TS)', destination: 'ONGC Mumbai Offshore (MH)', shipDate: '2026-07-11', transitDays: 6, zone: 'East', remarks: 'V-5Cr-5Ti clad plate for subsea flowline CRA application &#8594; 90% V alloy for seawater and H2S corrosion resistance &#8594; &#8377;225Cr for 18 tonnes clad plate &#8594; ONGC KG-DWN-98/2 deepwater field 2500m &#8594; V-alloy corrosion rate 0.005mm/year in seawater &#8594; Delayed 12 days due to monsoon offshore logistics &#8594; &#8377;18,000Cr Indian offshore V demand' },
  { id: 'VAN-0013', batchNo: 'VAN-B2413', city: 'Gandhinagar', manufacturer: 'Adani Defence', alloyGrade: 'Ti-6Al-2Sn-4Zr-2Mo-0.1Si (V-free)', application: 'AMCA Engine Blade (DRDO GTRE)', vanadiumPercent: 0, yieldStrengthMPa: 980, investmentCr: 310, status: 'Processing', priority: 'Critical', origin: 'DRDO DMRL Hyderabad (TS)', destination: 'GTRE Bengaluru (KA)', shipDate: '2026-07-26', transitDays: 2, zone: 'West', remarks: 'Ti-6242S intermediate compressor blade for AMCA engine &#8594; V-free near-alpha Ti for 520&#176;C creep resistance &#8594; &#8377;310Cr for 4 tonnes investment cast blades &#8594; AMCA 25-tonne fighter 2 engines &#8594; Ti-6242S stress rupture 100hr at 520&#176;C &#8597; 350MPa &#8594; DRDO scaling up Ti blade production &#8594; &#8377;24,500Cr Indian AMCA Ti demand' },
  { id: 'VAN-0014', batchNo: 'VAN-B2414', city: 'Lucknow', manufacturer: 'TASL', alloyGrade: 'Ti-5553 (Ti-5Al-5V-5Mo-3Cr)', application: 'Satellite Thruster Bracket (ISRO GSAT)', vanadiumPercent: 5, yieldStrengthMPa: 1080, investmentCr: 198, status: 'In Transit', priority: 'High', origin: 'TASL Lucknow (UP)', destination: 'ISRO LPSC Bengaluru (KA)', shipDate: '2026-07-23', transitDays: 2, zone: 'North', remarks: 'Ti-5553 near-beta Ti for satellite thruster mounting bracket &#8594; 5% V in high-strength damage-tolerant Ti &#8594; &#8377;198Cr for 3.5 tonnes forged bracket stock &#8594; ISRO launching 12 GSAT satellites &#8594; Ti-5553 fracture toughness KIC 70 MPa&#8730;m &#8594; TASL developing aerospace Ti-5553 production &#8594; &#8377;15,800Cr Indian space Ti demand' },
]

const tabs = ['Dashboard', 'Registry', 'Analytics', 'Insights'] as const
type TabType = typeof tabs[number]

export default function VanadiumAlloyLogisticsView() {
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
    return vanadiumRecords.filter(r => {
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

  const uniqueCities = useMemo(() => [...new Set(vanadiumRecords.map(r => r.city))].sort(), [])
  const uniqueManufacturers = useMemo(() => [...new Set(vanadiumRecords.map(r => r.manufacturer))].sort(), [])
  const uniqueStatuses = useMemo(() => [...new Set(vanadiumRecords.map(r => r.status))].sort(), [])
  const uniqueZones = useMemo(() => [...new Set(vanadiumRecords.map(r => r.zone))].sort(), [])

  const totalInvestment = useMemo(() => vanadiumRecords.reduce((s: number, r) => s + r.investmentCr, 0), [])
  const avgStrength = useMemo(() => Math.round(vanadiumRecords.filter(r => r.yieldStrengthMPa > 0).reduce((s: number, r) => s + r.yieldStrengthMPa, 0) / vanadiumRecords.filter(r => r.yieldStrengthMPa > 0).length), [])
  const deliveredCount = useMemo(() => vanadiumRecords.filter(r => r.status === 'Delivered').length, [])
  const delayedCount = useMemo(() => vanadiumRecords.filter(r => r.status === 'Delayed').length, [])

  const cityInvestmentMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of vanadiumRecords) { map[r.city] = (map[r.city] || 0) + r.investmentCr }
    return map
  }, [])

  const gradeStrengthMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of vanadiumRecords) { map[r.alloyGrade] = (map[r.alloyGrade] || 0) + r.yieldStrengthMPa }
    return map
  }, [])

  const statusCountMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of vanadiumRecords) { map[r.status] = (map[r.status] || 0) + 1 }
    return map
  }, [])

  const zoneInvestmentMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of vanadiumRecords) { map[r.zone] = (map[r.zone] || 0) + r.investmentCr }
    return map
  }, [])

  const maxCity = useMemo(() => {
    const entries = (Object.entries(cityInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1])
    return entries[0] || ['N/A', 0]
  }, [cityInvestmentMap])

  const maxGrade = useMemo(() => {
    const entries = (Object.entries(gradeStrengthMap) as [string, number][]).sort((a, b) => b[1] - a[1])
    return entries[0] || ['N/A', 0]
  }, [gradeStrengthMap])

  return (
    <div className="space-y-6">
      <PageHeader title="Vanadium Alloy Logistics" description="Strategic vanadium alloy supply chain tracking for aerospace titanium, fusion reactors, steel microalloying, energy storage VRFB, sulphuric acid catalysts and offshore pipelines" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-red-600 bg-red-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Total Investment</div><div className="text-2xl font-bold text-red-700">&#8377;{totalInvestment.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground mt-1">Across {vanadiumRecords.length} batches</div></CardContent></Card>
        <Card className="border-l-4 border-l-red-600 bg-red-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Avg Yield Strength</div><div className="text-2xl font-bold text-red-700">{avgStrength.toLocaleString()} MPa</div><div className="text-xs text-muted-foreground mt-1">Across structural alloys</div></CardContent></Card>
        <Card className="border-l-4 border-l-red-600 bg-red-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Delivered</div><div className="text-2xl font-bold text-red-700">{deliveredCount}</div><div className="text-xs text-muted-foreground mt-1">{delayedCount} delayed</div></CardContent></Card>
        <Card className="border-l-4 border-l-red-600 bg-red-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Top City</div><div className="text-2xl font-bold text-red-700">{maxCity[0]}</div><div className="text-xs text-muted-foreground mt-1">&#8377;{maxCity[1].toLocaleString()} Cr invested</div></CardContent></Card>
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
          <button key={tab} className={`px-4 py-2 text-sm font-medium ${activeTab === tab ? 'border-b-2 border-red-600 text-red-700' : 'text-muted-foreground'}`} onClick={() => setActiveTab(tab)}>{tab}</button>
        ))}
      </div>

      {activeTab === 'Dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">Investment by City</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(cityInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([city, val]) => (<div key={city} className="flex items-center gap-2"><span className="text-xs w-24 truncate">{city}</span><div className="flex-1 bg-red-100 rounded-full h-3"><div className="bg-red-600 h-3 rounded-full" style={{ width: `${(val / maxCity[1]) * 100}%` }}></div></div><span className="text-xs font-medium w-20 text-right">&#8377;{val} Cr</span></div>))}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Yield Strength by Alloy Grade</CardTitle></CardHeader><CardContent className="space-y-2">{vanadiumRecords.filter(r => r.yieldStrengthMPa > 0).sort((a, b) => b.yieldStrengthMPa - a.yieldStrengthMPa).slice(0, 8).map(r => (<div key={r.id} className="flex items-center gap-2"><span className="text-xs w-36 truncate">{r.alloyGrade}</span><div className="flex-1 bg-orange-100 rounded-full h-3"><div className="bg-orange-500 h-3 rounded-full" style={{ width: `${(r.yieldStrengthMPa / 1800) * 100}%` }}></div></div><span className="text-xs font-medium w-20 text-right">{r.yieldStrengthMPa} MPa</span></div>))}</CardContent></Card>
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
              <thead><tr className="border-b"><th className="text-left p-2">Batch</th><th className="text-left p-2">City</th><th className="text-left p-2">Manufacturer</th><th className="text-left p-2">Alloy Grade</th><th className="text-left p-2">Application</th><th className="text-left p-2">V%</th><th className="text-left p-2">YS MPa</th><th className="text-left p-2">&#8377;Cr</th><th className="text-left p-2">Status</th></tr></thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id} className={`border-b ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}>
                    <td className="p-2 font-mono text-xs">{r.batchNo}</td>
                    <td className="p-2">{r.city}</td>
                    <td className="p-2">{r.manufacturer}</td>
                    <td className="p-2">{r.alloyGrade}</td>
                    <td className="p-2 max-w-[200px] truncate">{r.application}</td>
                    <td className="p-2">{r.vanadiumPercent}%</td>
                    <td className="p-2">{r.yieldStrengthMPa || '&#8212;'}</td>
                    <td className="p-2 font-medium">&#8377;{r.investmentCr}</td>
                    <td className="p-2"><Badge variant={r.status === 'Delivered' ? 'default' : r.status === 'Delayed' ? 'destructive' : 'secondary'}>{r.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card><CardHeader><CardTitle className="text-sm">Vanadium % by Alloy</CardTitle></CardHeader><CardContent className="space-y-2">{vanadiumRecords.sort((a, b) => b.vanadiumPercent - a.vanadiumPercent).slice(0, 8).map(r => (<div key={r.id} className="flex items-center gap-2"><span className="text-xs w-36 truncate">{r.alloyGrade}</span><div className="flex-1 bg-rose-100 rounded-full h-3"><div className="bg-rose-500 h-3 rounded-full" style={{ width: `${(r.vanadiumPercent / 92) * 100}%` }}></div></div><span className="text-xs font-medium w-12 text-right">{r.vanadiumPercent}%</span></div>))}</CardContent></Card>
            <Card><CardHeader><CardTitle className="text-sm">Investment by Zone</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(zoneInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([zone, val]) => (<div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone}</span><div className="flex-1 bg-amber-100 rounded-full h-3"><div className="bg-amber-600 h-3 rounded-full" style={{ width: `${(val / maxCity[1]) * 100}%` }}></div></div><span className="text-xs font-medium w-20 text-right">&#8377;{val} Cr</span></div>))}</CardContent></Card>
          </div>
        </div>
      )}

      {activeTab === 'Analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">Status Distribution</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(statusCountMap) as [string, number][]).map(([status, count]) => (<div key={status} className="flex items-center gap-2"><span className="text-xs w-24">{status}</span><div className="flex-1 bg-gray-100 rounded-full h-3"><div className="bg-red-600 h-3 rounded-full" style={{ width: `${(count / vanadiumRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Priority Breakdown</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const map: Record<string, number> = {}; for (const r of vanadiumRecords) { map[r.priority] = (map[r.priority] || 0) + 1 } const sorted = (Object.entries(map) as [string, number][]).sort((a, b) => b[1] - a[1]); return sorted.map(([pri, count]) => (<div key={pri} className="flex items-center gap-2"><span className="text-xs w-20">{pri}</span><div className="flex-1 bg-red-100 rounded-full h-3"><div className="bg-red-500 h-3 rounded-full" style={{ width: `${(count / vanadiumRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))})()}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Shipment Volume by Zone</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const map: Record<string, number> = {}; for (const r of vanadiumRecords) { map[r.zone] = (map[r.zone] || 0) + 1 } const sorted = (Object.entries(map) as [string, number][]).sort((a, b) => b[1] - a[1]); return sorted.map(([zone, count]) => (<div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone}</span><div className="flex-1 bg-blue-100 rounded-full h-3"><div className="bg-blue-500 h-3 rounded-full" style={{ width: `${(count / vanadiumRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))})()}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">V Content Distribution</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const ranges: Record<string, number> = { '0%': 0, '1-10%': 0, '10-50%': 0, '50%+': 0 }; for (const r of vanadiumRecords) { if (r.vanadiumPercent >= 50) ranges['50%+']++; else if (r.vanadiumPercent >= 10) ranges['10-50%']++; else if (r.vanadiumPercent >= 1) ranges['1-10%']++; else ranges['0%']++ } return (Object.entries(ranges) as [string, number][]).map(([range, count]) => (<div key={range} className="flex items-center gap-2"><span className="text-xs w-24">{range}</span><div className="flex-1 bg-violet-100 rounded-full h-3"><div className="bg-violet-500 h-3 rounded-full" style={{ width: `${(count / vanadiumRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))})()}</CardContent></Card>
        </div>
      )}

      {activeTab === 'Insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-l-4 border-l-red-600"><CardHeader><CardTitle className="text-sm">Ti-6Al-4V: India&apos;s Aerospace Workhorse</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>Ti-6Al-4V (4% V) is the world&apos;s most-used titanium alloy, representing 50% of global Ti consumption. In India, MIDHANI and HAL consume 4,000 tonnes/year of Ti-6Al-4V for Tejas Mk2 airframe forgings, AMCA wing spars, and naval submarine components. The 4% vanadium stabilizes the beta phase enabling alpha-beta duplex microstructure with 895MPa yield strength and excellent fatigue life. India imports 80% of its titanium sponge (from Japan and Russia) and 100% of vanadium pentoxide feedstock, creating a critical supply chain vulnerability for the 200+ Tejas Mk2 and 100+ AMCA fighters planned. MIDHANI is scaling VIM+VAR Ti-6Al-4V production to 10,000 tonnes/year by 2028.</p></CardContent></Card>
          <Card className="border-l-4 border-l-amber-500"><CardHeader><CardTitle className="text-sm">Fusion Energy: V-4Cr-4Ti First Wall</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>Vanadium alloys (V-4Cr-4Ti and V-5Cr-5Ti) are the leading candidates for fusion reactor first-wall and blanket structures, offering 50x lower radiation swelling than SS316 at 700&#176;C and excellent sodium compatibility for liquid-metal-cooled blankets. India&apos;s IPR is developing the SST-2 DEMO fusion reactor and contributing the Indian Test Blanket Module to ITER, with V-4Cr-4Ti as the reference structural material. The V-alloy programme requires vacuum-induction melting of 99.9% pure V with 4% Cr 4% Ti, followed by electron-beam welding and neutron irradiation testing at up to 20 dpa. India&apos;s fusion V-alloy demand is projected at &#8377;28,000Cr by 2035.</p></CardContent></Card>
          <Card className="border-l-4 border-l-emerald-500"><CardHeader><CardTitle className="text-sm">VRFB Energy Storage: Vanadium Redox Flow Battery</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>India&apos;s National Energy Storage Mission targets 10 GWh of long-duration storage by 2030, with vanadium redox flow batteries (VRFB) as the primary technology for 4-12 hour grid-scale storage. VRFBs use V2O5 electrolyte in V2+/V3+ and VO2+/VO2+ redox couples with 20-25 year calendar life and unlimited cycle depth. RSM Khetri is developing 50 tonnes/year V2O5 extraction from vanadium-bearing steel slag, while Tata Power and NTPC are piloting 100 MWh VRFB systems. India&apos;s current V2O5 production is near zero, with 100% import from China and South Africa. The VRFB programme could create a &#8377;15,000Cr domestic V2O5 industry by 2032.</p></CardContent></Card>
          <Card className="border-l-4 border-l-blue-500"><CardHeader><CardTitle className="text-sm">Steel Microalloying: FeV for Construction, Rail and Pipeline</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>India is the world&apos;s largest consumer of ferro-vanadium (FeV), using 16,500 tonnes/year for steel microalloying across construction (65 Mt rebar), rail (68,000 km network), and pipeline (16,000 km gas grid). Just 0.06% V addition raises rebar yield from 415 to 550MPa (seismic-grade Fe550D), while V-Nb dual microalloying achieves X100 pipeline steel at 690MPa. SAIL, Tata Steel, JSW and JSPL collectively consume 12,000 tonnes FeV-50 for construction, 4,500 tonnes for rail, and 2,500 tonnes for pipeline annually. India imports 95% FeV from China and South Africa. RSM Khetri pyrochlore and vanadium slag recovery projects target 500 tonnes FeV/year domestic production by 2028.</p></CardContent></Card>
        </div>
      )}
    </div>
  )
}
