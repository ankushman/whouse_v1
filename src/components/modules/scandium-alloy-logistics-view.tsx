'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { Target } from 'lucide-react'

interface ScandiumAlloyRecord {
  id: string
  batchNo: string
  city: string
  manufacturer: string
  alloyGrade: string
  application: string
  scandiumPercent: number
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

const scandiumRecords: ScandiumAlloyRecord[] = [
  { id: 'SCA-0001', batchNo: 'SCA-B2401', city: 'Bengaluru', manufacturer: 'HAL Aero Engines', alloyGrade: 'Al-Sc (Al-0.4Sc-0.1Zr)', application: 'Welded Airframe Panel (LCA Tejas Mk2)', scandiumPercent: 0.4, yieldStrengthMPa: 450, investmentCr: 185, status: 'Delivered', priority: 'Critical', origin: 'HAL Aero Structure Bengaluru (KA)', destination: 'HAL Final Assembly Bengaluru (KA)', shipDate: '2026-07-20', transitDays: 1, zone: 'South', remarks: 'Al-0.4Sc-0.1Zr alloy welded fuselage skin panel for Tejas Mk2 &#8594; 0.4% Sc with Zr grain refiner &#8594; &#8377;185Cr for 85 tonnes Al-Sc sheet stock &#8594; Tejas Mk2 requiring 40% welded structure vs 15% riveted &#8594; Al-Sc welding strength retention 92% vs 65% for 7075-T6 &#8594; India importing 100% scandium from China and Russia &#8594; &#8377;14,500Cr Indian aerospace Sc alloy demand' },
  { id: 'SCA-0002', batchNo: 'SCA-B2402', city: 'Hyderabad', manufacturer: 'DRDO DMRL', alloyGrade: 'Al-Mg-Sc (Al-6Mg-0.3Sc)', application: 'Missile Airframe Tube (DRDO Astra Mk3)', scandiumPercent: 0.3, yieldStrengthMPa: 520, investmentCr: 245, status: 'In Transit', priority: 'Critical', origin: 'DRDO DMRL Hyderabad (TS)', destination: 'BDL Hyderabad (TS)', shipDate: '2026-07-22', transitDays: 1, zone: 'South', remarks: 'Al-Mg-Sc alloy missile airframe for Astra Mk3 BVRAAM &#8594; 0.3% Sc with 6% Mg for superplastic forming &#8594; &#8377;245Cr for 18 tonnes extruded tube stock &#8594; Astra Mk3 350km range dual-pulse solid rocket &#8594; Al-Mg-Sc superplastic elongation 800% at 500&#176;C &#8594; BDL producing 100 Astra missiles/year &#8594; &#8377;18,800Cr Indian missile Sc alloy programme' },
  { id: 'SCA-0003', batchNo: 'SCA-B2403', city: 'Pune', manufacturer: 'Tata Advanced Systems', alloyGrade: 'Al-Li-Sc (Al-2.5Li-0.2Sc)', application: 'Wing Spar Cap (DRDO AMCA)', scandiumPercent: 0.2, yieldStrengthMPa: 580, investmentCr: 325, status: 'Delivered', priority: 'Critical', origin: 'TASL Pune (MH)', destination: 'DRDO ADA Bengaluru (KA)', shipDate: '2026-07-19', transitDays: 2, zone: 'West', remarks: 'Al-Li-Sc alloy wing spar for AMCA 5th-gen fighter &#8594; 0.2% Sc with 2.5% Li for density reduction &#8594; &#8377;325Cr for 32 tonnes spar cap extrusions &#8594; AMCA 25-tonne fighter requiring 680kg wing spar &#8594; Al-Li-Sc density 2.58 g/cc vs 2.85 for 7075 giving 9% weight saving &#8594; India planning 200 AMCA fighters &#8594; &#8377;24,500Cr Indian 5th-gen fighter Sc alloy demand' },
  { id: 'SCA-0004', batchNo: 'SCA-B2404', city: 'Chennai', manufacturer: 'IIT Madras Research', alloyGrade: 'Mg-Sc (Mg-4Sc)', application: 'Bicycle Frame Tube (Hero Cycles R&amp;D)', scandiumPercent: 4.0, yieldStrengthMPa: 380, investmentCr: 28, status: 'Delayed', priority: 'Medium', origin: 'IIT Madras (TN)', destination: 'Hero Cycles Ludhiana (PB)', shipDate: '2026-07-12', transitDays: 3, zone: 'South', remarks: 'Mg-Sc alloy extruded tube for premium bicycle frame &#8594; 4.0% Sc for precipitation hardening of Mg &#8594; &#8377;28Cr for 2.5 tonnes tube stock &#8594; Hero Cycles 7 million bicycles/year premium segment 200K &#8594; Mg-Sc frame weight 1.2kg vs 1.8kg Al alloy &#8594; Delayed 10 days due to scandium flake import customs clearance &#8594; &#8377;2,100Cr Indian cycling Sc alloy market' },
  { id: 'SCA-0005', batchNo: 'SCA-B2405', city: 'Mumbai', manufacturer: 'MIDHANI Mumbai', alloyGrade: 'Al-Cu-Li-Sc (Al-3.5Cu-1.3Li-0.3Sc)', application: 'Satellite Panel (ISRO GSAT-NG)', scandiumPercent: 0.3, yieldStrengthMPa: 620, investmentCr: 275, status: 'Processing', priority: 'High', origin: 'MIDHANI Mumbai (MH)', destination: 'ISRO URSC Bengaluru (KA)', shipDate: '2026-07-25', transitDays: 2, zone: 'West', remarks: 'Al-Cu-Li-Sc alloy satellite structural panel for GSAT-NG &#8594; 0.3% Sc for weldability of Al-Li aerospace alloy &#8594; &#8377;275Cr for 12 tonnes plate stock &#8594; ISRO launching 12 communication satellites/year &#8594; Al-Cu-Li-Sc weld efficiency 90% vs 55% for 2024-T8 &#8594; ISRO targeting 80% indigenous satellite structure by 2028 &#8594; &#8377;21,000Cr Indian space Sc alloy demand' },
  { id: 'SCA-0006', batchNo: 'SCA-B2406', city: 'Noida', manufacturer: 'Bharat Electronics', alloyGrade: 'Al-Sc Welding Wire (Al-0.5Sc)', application: 'Electronic Enclosure Weld (BEL Defence)', scandiumPercent: 0.5, yieldStrengthMPa: 320, investmentCr: 42, status: 'Delivered', priority: 'High', origin: 'BEL Noida (UP)', destination: 'BEL Bengaluru (KA)', shipDate: '2026-07-17', transitDays: 2, zone: 'North', remarks: 'Al-Sc filler wire for defence electronic enclosure TIG welding &#8594; 0.5% Sc for grain refinement in weld zone &#8594; &#8377;42Cr for 6 tonnes welding wire spools &#8594; BEL producing 5,000 radar and EW systems/year &#8594; Al-Sc weld porosity 0.1% vs 1.5% for 4043 filler &#8594; India importing all Sc filler wire from Ukraine and Russia &#8594; &#8377;3,200Cr Indian defence welding Sc alloy market' },
  { id: 'SCA-0007', batchNo: 'SCA-B2407', city: 'Kolkata', manufacturer: 'Hindalco Industries', alloyGrade: 'Al-Sc Master Alloy (Al-2Sc)', application: 'Automotive Body Panel (Tata Motors)', scandiumPercent: 2.0, yieldStrengthMPa: 280, investmentCr: 165, status: 'In Transit', priority: 'High', origin: 'Hindalco R&amp;D Kolkata (WB)', destination: 'Tata Motors Pune (MH)', shipDate: '2026-07-21', transitDays: 3, zone: 'East', remarks: 'Al-2Sc master alloy ingot for automotive body panel production &#8594; 2.0% Sc diluted to 0.15-0.4% in final alloy &#8594; &#8377;165Cr for 8 tonnes master alloy ingots &#8594; Tata Motors producing 800,000 vehicles/year &#8594; Al-Sc body panel dent resistance 2x vs 6016-T4 &#8594; Hindalco developing indigenous Sc master alloy route &#8594; &#8377;12,800Cr Indian automotive Sc alloy market' },
  { id: 'SCA-0008', batchNo: 'SCA-B2408', city: 'Ahmedabad', manufacturer: 'Reliance SBR', alloyGrade: 'Al-Sc-Zr (Al-0.35Sc-0.15Zr)', application: 'EV Battery Enclosure (Mahindra EV)', scandiumPercent: 0.35, yieldStrengthMPa: 410, investmentCr: 128, status: 'Delivered', priority: 'High', origin: 'Reliance SBR Ahmedabad (GJ)', destination: 'Mahindra EV Pune (MH)', shipDate: '2026-07-16', transitDays: 2, zone: 'West', remarks: 'Al-Sc-Zr alloy EV battery enclosure for XUV400 BEV &#8594; 0.35% Sc with 0.15% Zr for weldability and crashworthiness &#8594; &#8377;128Cr for 22 tonnes enclosure blanks &#8594; Mahindra 50,000 EVs/year with Sc alloy enclosures &#8594; Al-Sc-Zr crash energy absorption 35% higher than 5182-O &#8594; India EV market 8 million units/year by 2030 &#8594; &#8377;9,500Cr Indian EV Sc alloy demand' },
  { id: 'SCA-0009', batchNo: 'SCA-B2409', city: 'Coimbatore', manufacturer: 'IIT Madras Research', alloyGrade: 'Sc-SZ Electrolyte (Sc2O3-ZrO2)', application: 'Solid Oxide Fuel Cell (BHEL)', scandiumPercent: 10, yieldStrengthMPa: 250, investmentCr: 195, status: 'Processing', priority: 'Critical', origin: 'IIT Madras (TN)', destination: 'BHEL R&amp;D Hyderabad (TS)', shipDate: '2026-07-24', transitDays: 2, zone: 'South', remarks: 'ScSZ scandia-stabilized zirconia electrolyte for 5kW SOFC &#8594; 10% Sc2O3 as ScSZ with 1mol% CeO2 &#8594; &#8377;195Cr for 4 tonnes ScSZ tape-cast membrane &#8594; BHEL 250kW SOFC for distributed power generation &#8594; ScSZ conductivity 0.1 S/cm at 800&#176;C 10x YSZ &#8594; India targeting 2GW fuel cell by 2030 &#8594; &#8377;15,200Cr Indian SOFC Sc demand' },
  { id: 'SCA-0010', batchNo: 'SCA-B2410', city: 'Jaipur', manufacturer: 'Rajasthan State Mines', alloyGrade: 'Scandium Oxide (Sc2O3)', application: 'Metal Halide Lamp Phosphor (Philips India)', scandiumPercent: 52, yieldStrengthMPa: 0, investmentCr: 35, status: 'Delivered', priority: 'Medium', origin: 'RSM Processing Jaipur (RJ)', destination: 'Philips Lighting Kolkata (WB)', shipDate: '2026-07-18', transitDays: 3, zone: 'North', remarks: 'Scandium oxide for metal halide HMI lamp phosphor &#8594; 52% Sc as Sc2O3 high-purity 99.99% &#8594; &#8377;35Cr for 0.8 tonnes Sc2O3 powder &#8594; India 2 billion lighting units with HMI in studios &#8594; Sc-NaI lamp CRI 96 closest to daylight spectrum &#8594; India importing all Sc2O3 from China &#8594; &#8377;2,800Cr Indian lighting Sc oxide market' },
  { id: 'SCA-0011', batchNo: 'SCA-B2411', city: 'Bhubaneswar', manufacturer: 'NALCO Smelter', alloyGrade: 'Sc2(SO4)3 Precursor', application: 'Scandium Extraction Pilot (Indian Rare Earths)', scandiumPercent: 20, yieldStrengthMPa: 0, investmentCr: 88, status: 'In Transit', priority: 'Critical', origin: 'NALCO Smelter Angul (OD)', destination: 'IRE Chavara (KL)', shipDate: '2026-07-23', transitDays: 4, zone: 'East', remarks: 'Scandium sulfate precursor from bauxite residue for Sc extraction &#8594; 20% Sc as Sc2(SO4)3 solution 50g/L &#8594; &#8377;88Cr for 120 tonnes precursor solution &#8594; NALCO 2.4 MTPA alumina generating 8 MT red mud with 150ppm Sc &#8594; Solvent extraction route using D2EHPA recovering 85% Sc from red mud &#8594; India&apos;s first indigenous scandium production pilot &#8594; &#8377;6,500Cr Indian scandium extraction programme' },
  { id: 'SCA-0012', batchNo: 'SCA-B2412', city: 'Guwahati', manufacturer: 'Oil India Ltd', alloyGrade: 'Al-Sc (Al-0.3Sc)', application: 'Pipeline Welding Repair (GAIL Assam)', scandiumPercent: 0.3, yieldStrengthMPa: 340, investmentCr: 22, status: 'Delayed', priority: 'Medium', origin: 'Oil India Jorhat (AS)', destination: 'GAIL Duliajan (AS)', shipDate: '2026-07-11', transitDays: 1, zone: 'East', remarks: 'Al-Sc alloy repair sleeve for natural gas pipeline weld defect &#8594; 0.3% Sc for field weldability with strength retention &#8594; &#8377;22Cr for 3 tonnes sleeve pipe stock &#8594; GAIL 13,000 km pipeline network in Assam &#8594; Al-Sc field weld strength 95% of base metal vs 70% for 6061 &#8594; Delayed 12 days due to monsoon flooding in Brahmaputra &#8594; &#8377;1,800Cr Indian pipeline Sc alloy demand' },
  { id: 'SCA-0013', batchNo: 'SCA-B2413', city: 'Gandhinagar', manufacturer: 'Gujarat Fluorochemicals', alloyGrade: 'ScF3 Sputter Target', application: 'Optical Coating (Tata Elxsi)', scandiumPercent: 42, yieldStrengthMPa: 0, investmentCr: 145, status: 'Processing', priority: 'High', origin: 'GFCL Gandhinagar (GJ)', destination: 'Tata Elxsi Bengaluru (KA)', shipDate: '2026-07-26', transitDays: 2, zone: 'West', remarks: 'ScF3 sputtering target for UV optical coating on LiDAR lens &#8594; 42% Sc as ScF3 with 99.99% purity &#8594; &#8377;145Cr for 80 sputtering targets &#8594; Tata Elxsi supplying LiDAR optics for autonomous driving &#8594; ScF3 UV reflectivity 95% at 250nm vs 80% for MgF2 &#8594; India importing 100% ScF3 targets from Japan &#8594; &#8377;11,200Cr Indian optical coating Sc target market' },
  { id: 'SCA-0014', batchNo: 'SCA-B2414', city: 'Lucknow', manufacturer: 'Tata Advanced Systems', alloyGrade: 'Al-Sc-Li-Zr (Al-2Li-0.2Sc-0.1Zr)', application: 'UAV Wing Spar (DRDO Tapas-B)', scandiumPercent: 0.2, yieldStrengthMPa: 550, investmentCr: 108, status: 'In Transit', priority: 'High', origin: 'TASL Lucknow (UP)', destination: 'DRDO ADE Bengaluru (KA)', shipDate: '2026-07-23', transitDays: 2, zone: 'North', remarks: 'Al-Sc-Li-Zr alloy UAV wing spar for Tapas-B MALE drone &#8594; 0.2% Sc with 2% Li for 10% density reduction &#8594; &#8377;108Cr for 4 tonnes spar extrusions &#8594; DRDO Tapas-B 24hr endurance 35,000ft ceiling &#8594; Al-Sc-Li-Zr fatigue life 2x vs 7075-T6 in gust loading &#8594; India producing 200 MALE UAVs under IAF programme &#8594; &#8377;8,500Cr Indian UAV Sc alloy demand' },
]

const tabs = ['Dashboard', 'Registry', 'Analytics', 'Insights'] as const
type TabType = typeof tabs[number]

export default function ScandiumAlloyLogisticsView() {
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
    return scandiumRecords.filter(r => {
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

  const uniqueCities = useMemo(() => [...new Set(scandiumRecords.map(r => r.city))].sort(), [])
  const uniqueManufacturers = useMemo(() => [...new Set(scandiumRecords.map(r => r.manufacturer))].sort(), [])
  const uniqueStatuses = useMemo(() => [...new Set(scandiumRecords.map(r => r.status))].sort(), [])
  const uniqueZones = useMemo(() => [...new Set(scandiumRecords.map(r => r.zone))].sort(), [])

  const totalInvestment = useMemo(() => scandiumRecords.reduce((s: number, r) => s + r.investmentCr, 0), [])
  const avgYield = useMemo(() => Math.round(scandiumRecords.filter(r => r.yieldStrengthMPa > 0).reduce((s: number, r) => s + r.yieldStrengthMPa, 0) / scandiumRecords.filter(r => r.yieldStrengthMPa > 0).length), [])
  const deliveredCount = useMemo(() => scandiumRecords.filter(r => r.status === 'Delivered').length, [])
  const delayedCount = useMemo(() => scandiumRecords.filter(r => r.status === 'Delayed').length, [])

  const cityInvestmentMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of scandiumRecords) { map[r.city] = (map[r.city] || 0) + r.investmentCr }
    return map
  }, [])

  const gradeYieldMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of scandiumRecords) { map[r.alloyGrade] = (map[r.alloyGrade] || 0) + r.yieldStrengthMPa }
    return map
  }, [])

  const statusCountMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of scandiumRecords) { map[r.status] = (map[r.status] || 0) + 1 }
    return map
  }, [])

  const zoneInvestmentMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of scandiumRecords) { map[r.zone] = (map[r.zone] || 0) + r.investmentCr }
    return map
  }, [])

  const maxCity = useMemo(() => {
    const entries = (Object.entries(cityInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1])
    return entries[0] || ['N/A', 0]
  }, [cityInvestmentMap])

  const maxYieldGrade = useMemo(() => {
    const entries = (Object.entries(gradeYieldMap) as [string, number][]).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1])
    return entries[0] || ['N/A', 0]
  }, [gradeYieldMap])

  return (
    <div className="space-y-6">
      <PageHeader title="Scandium Alloy Logistics" description="Strategic scandium alloy and scandium compound supply chain tracking for aerospace welding, missile airframes, EV enclosures and SOFC electrolytes" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-orange-500 bg-orange-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Total Investment</div><div className="text-2xl font-bold text-orange-700">&#8377;{totalInvestment.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground mt-1">Across {scandiumRecords.length} batches</div></CardContent></Card>
        <Card className="border-l-4 border-l-orange-500 bg-orange-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Avg Yield Strength</div><div className="text-2xl font-bold text-orange-700">{avgYield.toLocaleString()} MPa</div><div className="text-xs text-muted-foreground mt-1">Across structural alloys</div></CardContent></Card>
        <Card className="border-l-4 border-l-orange-500 bg-orange-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Delivered</div><div className="text-2xl font-bold text-orange-700">{deliveredCount}</div><div className="text-xs text-muted-foreground mt-1">{delayedCount} delayed</div></CardContent></Card>
        <Card className="border-l-4 border-l-orange-500 bg-orange-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Top City</div><div className="text-2xl font-bold text-orange-700">{maxCity[0]}</div><div className="text-xs text-muted-foreground mt-1">&#8377;{maxCity[1].toLocaleString()} Cr invested</div></CardContent></Card>
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
          <button key={tab} className={`px-4 py-2 text-sm font-medium ${activeTab === tab ? 'border-b-2 border-orange-500 text-orange-700' : 'text-muted-foreground'}`} onClick={() => setActiveTab(tab)}>{tab}</button>
        ))}
      </div>

      {activeTab === 'Dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">Investment by City</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(cityInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([city, val]) => (<div key={city} className="flex items-center gap-2"><span className="text-xs w-24 truncate">{city}</span><div className="flex-1 bg-orange-100 rounded-full h-3"><div className="bg-orange-500 h-3 rounded-full" style={{ width: `${(val / maxCity[1]) * 100}%` }}></div></div><span className="text-xs font-medium w-20 text-right">&#8377;{val} Cr</span></div>))}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Yield Strength by Alloy Grade</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(gradeYieldMap) as [string, number][]).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([grade, ys]) => (<div key={grade} className="flex items-center gap-2"><span className="text-xs w-36 truncate">{grade}</span><div className="flex-1 bg-amber-100 rounded-full h-3"><div className="bg-amber-500 h-3 rounded-full" style={{ width: `${(ys / maxYieldGrade[1]) * 100}%` }}></div></div><span className="text-xs font-medium w-16 text-right">{ys} MPa</span></div>))}</CardContent></Card>
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
              <thead><tr className="border-b"><th className="text-left p-2">Batch</th><th className="text-left p-2">City</th><th className="text-left p-2">Manufacturer</th><th className="text-left p-2">Alloy Grade</th><th className="text-left p-2">Application</th><th className="text-left p-2">Sc%</th><th className="text-left p-2">YS (MPa)</th><th className="text-left p-2">&#8377;Cr</th><th className="text-left p-2">Status</th></tr></thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id} className={`border-b ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}>
                    <td className="p-2 font-mono text-xs">{r.batchNo}</td>
                    <td className="p-2">{r.city}</td>
                    <td className="p-2">{r.manufacturer}</td>
                    <td className="p-2">{r.alloyGrade}</td>
                    <td className="p-2 max-w-[200px] truncate">{r.application}</td>
                    <td className="p-2">{r.scandiumPercent}%</td>
                    <td className="p-2">{r.yieldStrengthMPa > 0 ? r.yieldStrengthMPa : 'N/A'}</td>
                    <td className="p-2 font-medium">&#8377;{r.investmentCr}</td>
                    <td className="p-2"><Badge variant={r.status === 'Delivered' ? 'default' : r.status === 'Delayed' ? 'destructive' : 'secondary'}>{r.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card><CardHeader><CardTitle className="text-sm">Scandium % by Alloy</CardTitle></CardHeader><CardContent className="space-y-2">{scandiumRecords.slice(0, 8).map(r => (<div key={r.id} className="flex items-center gap-2"><span className="text-xs w-36 truncate">{r.alloyGrade}</span><div className="flex-1 bg-yellow-100 rounded-full h-3"><div className="bg-yellow-500 h-3 rounded-full" style={{ width: `${Math.min((r.scandiumPercent / 52) * 100, 100)}%` }}></div></div><span className="text-xs font-medium w-12 text-right">{r.scandiumPercent}%</span></div>))}</CardContent></Card>
            <Card><CardHeader><CardTitle className="text-sm">Investment by Zone</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(zoneInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([zone, val]) => (<div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone}</span><div className="flex-1 bg-teal-100 rounded-full h-3"><div className="bg-teal-500 h-3 rounded-full" style={{ width: `${(val / maxCity[1]) * 100}%` }}></div></div><span className="text-xs font-medium w-20 text-right">&#8377;{val} Cr</span></div>))}</CardContent></Card>
          </div>
        </div>
      )}

      {activeTab === 'Analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">Status Distribution</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(statusCountMap) as [string, number][]).map(([status, count]) => (<div key={status} className="flex items-center gap-2"><span className="text-xs w-24">{status}</span><div className="flex-1 bg-gray-100 rounded-full h-3"><div className="bg-orange-500 h-3 rounded-full" style={{ width: `${(count / scandiumRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Priority Breakdown</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const map: Record<string, number> = {}; for (const r of scandiumRecords) { map[r.priority] = (map[r.priority] || 0) + 1 } const sorted = (Object.entries(map) as [string, number][]).sort((a, b) => b[1] - a[1]); return sorted.map(([pri, count]) => (<div key={pri} className="flex items-center gap-2"><span className="text-xs w-20">{pri}</span><div className="flex-1 bg-amber-100 rounded-full h-3"><div className="bg-amber-500 h-3 rounded-full" style={{ width: `${(count / scandiumRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))})()}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Shipment Volume by Zone</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const map: Record<string, number> = {}; for (const r of scandiumRecords) { map[r.zone] = (map[r.zone] || 0) + 1 } const sorted = (Object.entries(map) as [string, number][]).sort((a, b) => b[1] - a[1]); return sorted.map(([zone, count]) => (<div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone}</span><div className="flex-1 bg-blue-100 rounded-full h-3"><div className="bg-blue-500 h-3 rounded-full" style={{ width: `${(count / scandiumRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))})()}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Application Domain Split</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const map: Record<string, number> = {}; for (const r of scandiumRecords) { const domain = r.application.includes('Missile') ? 'Defence/Missile' : r.application.includes('UAV') ? 'Defence/UAV' : r.application.includes('Tejas') || r.application.includes('AMCA') ? 'Aerospace' : r.application.includes('satellite') || r.application.includes('Satellite') || r.application.includes('GSAT') || r.application.includes('ISRO') ? 'Space' : r.application.includes('EV') || r.application.includes('Automotive') ? 'Automotive/EV' : r.application.includes('SOFC') || r.application.includes('Fuel Cell') ? 'Energy' : r.application.includes('Weld') || r.application.includes('weld') ? 'Welding' : r.application.includes('Optical') || r.application.includes('Lamp') ? 'Optical/Lighting' : r.application.includes('Extraction') || r.application.includes('Precursor') ? 'Raw Material' : 'Other'; map[domain] = (map[domain] || 0) + 1 } const sorted = (Object.entries(map) as [string, number][]).sort((a, b) => b[1] - a[1]); return sorted.map(([domain, count]) => (<div key={domain} className="flex items-center gap-2"><span className="text-xs w-24">{domain}</span><div className="flex-1 bg-violet-100 rounded-full h-3"><div className="bg-violet-500 h-3 rounded-full" style={{ width: `${(count / scandiumRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))})()}</CardContent></Card>
        </div>
      )}

      {activeTab === 'Insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-l-4 border-l-orange-500"><CardHeader><CardTitle className="text-sm">Critical Scandium Import Dependency</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>India imports 100% of its scandium from China (70%) and Russia (30%). The metal costs &#8377;45,000/kg making it one of the most expensive alloying elements per unit weight. NALCO Angul is developing a scandium extraction pilot from bauxite residue (red mud) which contains 150ppm Sc, potentially producing 12 tonnes Sc2O3/year from the 8 MT red mud generated annually. If successful, this would reduce import dependency to 40% by 2030. The SCA-B2411 batch of 120 tonnes precursor solution represents India&apos;s first indigenous scandium production attempt.</p></CardContent></Card>
          <Card className="border-l-4 border-l-amber-500"><CardHeader><CardTitle className="text-sm">Aerospace Welding Revolution</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>Scandium&apos;s most impactful application in India is aerospace welding — Al-Sc alloys retain 90-95% of base metal strength after welding vs 55-65% for conventional 7075-T6. HAL&apos;s Tejas Mk2 uses 40% welded structure (vs 15% riveted in Mk1), requiring 85 tonnes of Al-Sc sheet stock per year. DRDO AMCA 5th-gen fighter pushes this to 60% welded structure. The Sc-Zr grain refiner system prevents weld zone recrystallization, maintaining 92% strength in the heat-affected zone. India&apos;s total aerospace Sc alloy demand is &#8377;57,800Cr by 2030.</p></CardContent></Card>
          <Card className="border-l-4 border-l-emerald-500"><CardHeader><CardTitle className="text-sm">SOFC Electrolyte Opportunity</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>Scandia-stabilized zirconia (ScSZ) is the highest-performance SOFC electrolyte, with 10x the ionic conductivity of conventional YSZ at 800&#176;C. BHEL and IIT Madras are jointly developing 250kW SOFC modules for India&apos;s 2GW fuel cell target by 2030. The SCA-B2409 batch of ScSZ tape-cast membranes represents &#8377;195Cr investment in electrolyte technology. Scandium accounts for 10mol% of ScSZ formulation, creating demand of 2 tonnes Sc2O3/year for fuel cells alone. India&apos;s total SOFC scandium demand is projected at &#8377;15,200Cr by 2030.</p></CardContent></Card>
          <Card className="border-l-4 border-l-blue-500"><CardHeader><CardTitle className="text-sm">Al-Li-Sc Lightweight Alloys</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>The combination of lithium and scandium in aluminium alloys creates the most weight-efficient structural material available. TASL and DRDO are using Al-Li-Sc for AMCA wing spars (9% weight saving vs 7075) and Tapas-B UAV spars (10% weight reduction). The Al-2.5Li-0.2Sc alloy achieves 580MPa yield strength at only 2.58 g/cc density — a specific strength advantage unmatched by any other aluminium alloy. India planning 200 AMCA fighters and 200 MALE UAVs under the IAF modernization programme, driving combined Sc alloy demand of &#8377;33,000Cr.</p></CardContent></Card>
        </div>
      )}
    </div>
  )
}
