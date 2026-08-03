'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { Sparkles } from 'lucide-react'

interface PlatinumGroupMetalRecord {
  id: string
  batchNo: string
  city: string
  manufacturer: string
  metalType: string
  application: string
  purityPercent: number
  weightGrams: number
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

const pgmRecords: PlatinumGroupMetalRecord[] = [
  { id: 'PGM-0001', batchNo: 'PGM-B2401', city: 'Mumbai', manufacturer: 'Hindustan Platinum', metalType: 'Platinum (Pt) 99.95%', application: 'Catalytic Converter (Maruti Suzuki)', purityPercent: 99.95, weightGrams: 4200, investmentCr: 1285, status: 'Delivered', priority: 'Critical', origin: 'Hindustan Platinum Mumbai (MH)', destination: 'Maruti Suzuki Manesar (HR)', shipDate: '2026-07-18', transitDays: 2, zone: 'West', remarks: 'Platinum gauze and washcoat for BS-VI catalytic converter &#8594; 99.95% Pt purity for three-way catalyst &#8594; &#8377;1,285Cr for 4.2 tonnes Pt &#8594; Maruti producing 2 million vehicles/year &#8594; Pt converts CO, HC and NOx simultaneously in TWC &#8594; India BS-VI emission norms since 2020 driving Pt demand &#8594; &#8377;98,000Cr Indian automotive PGM market' },
  { id: 'PGM-0002', batchNo: 'PGM-B2402', city: 'Hyderabad', manufacturer: 'DRDO DMRL', metalType: 'Platinum-Rhodium (Pt-Rh 90:10)', application: 'Glass Fibre Bushing (Saint-Gobain)', purityPercent: 99.9, weightGrams: 1850, investmentCr: 2450, status: 'In Transit', priority: 'Critical', origin: 'DRDO DMRL Hyderabad (TS)', destination: 'Saint-Gobain Sri City (AP)', shipDate: '2026-07-22', transitDays: 1, zone: 'South', remarks: 'Pt-Rh 90:10 alloy bushing for glass fibre production &#8594; 99.9% Pt-Rh alloy for 1600&#176;C glass contact &#8594; &#8377;2,450Cr for 1.85 tonnes Pt-Rh &#8594; Saint-Gobain 50,000 tonnes glass fibre/year &#8594; Pt-Rh retains strength at 1600&#176;C in molten glass &#8594; DRDO DMRL sole Indian Pt-Rh alloy producer &#8594; &#8377;42,000Cr Indian glass PGM demand' },
  { id: 'PGM-0003', batchNo: 'PGM-B2403', city: 'Bengaluru', manufacturer: 'ISRO LPSC', metalType: 'Iridium (Ir) 99.99%', application: 'Satellite Thruster (ISRO GSAT-N2)', purityPercent: 99.99, weightGrams: 320, investmentCr: 1680, status: 'Delivered', priority: 'High', origin: 'ISRO LPSC Bengaluru (KA)', destination: 'ISRO URSC Bengaluru (KA)', shipDate: '2026-07-19', transitDays: 0, zone: 'South', remarks: 'Iridium crucible and thruster nozzle for GSAT-N2 satellite &#8594; 99.99% Ir for high-temperature satellite thruster &#8594; &#8377;1,680Cr for 320 kg Ir &#8594; ISRO launching 12 GSAT satellites &#8594; Ir melting point 2446&#176;C highest of all metals &#8594; India imports 100% Ir from South Africa and UK &#8594; &#8377;28,500Cr Indian space PGM demand' },
  { id: 'PGM-0004', batchNo: 'PGM-B2404', city: 'Pune', manufacturer: 'Bharat Forge', metalType: 'Palladium (Pd) 99.95%', application: 'Hydrogen Purification Membrane (IOCL)', purityPercent: 99.95, weightGrams: 2800, investmentCr: 920, status: 'Delayed', priority: 'High', origin: 'Bharat Forge Pune (MH)', destination: 'IOCL Panipat (HR)', shipDate: '2026-07-12', transitDays: 3, zone: 'West', remarks: 'Pd-Ag alloy membrane for hydrogen purification at refinery &#8594; 99.95% Pd in Pd-Ag 77:23 membrane &#8594; &#8377;920Cr for 2.8 tonnes Pd &#8594; IOCL Panipat 15 MMTPA refinery hydrogen unit &#8594; Pd membrane 99.999% H2 purity at 350&#176;C &#8594; Delayed 10 days due to Pd alloy sheet rolling defect &#8594; &#8377;24,000Cr Indian refinery PGM market' },
  { id: 'PGM-0005', batchNo: 'PGM-B2405', city: 'Chennai', manufacturer: 'IGCAR Kalpakkam', metalType: 'Platinum (Pt) 99.99% Nuclear Grade', application: 'Hydrogen Electrolyzer (NTPC)', purityPercent: 99.99, weightGrams: 1500, investmentCr: 1450, status: 'Processing', priority: 'Critical', origin: 'IGCAR Kalpakkam (TN)', destination: 'NTPC Ramagundam (TG)', shipDate: '2026-07-25', transitDays: 2, zone: 'South', remarks: 'Platinum on carbon catalyst for PEM electrolyzer stack &#8594; 99.99% Pt on Vulcan XC-72 support &#8594; &#8377;1,450Cr for 1.5 tonnes Pt/C catalyst &#8594; NTPC building 2 GW green hydrogen electrolyzer &#8594; PEM electrolyzer efficiency 70% at 2V/cell &#8594; India targeting 5 million tonnes green H2 by 2030 &#8594; &#8377;38,000Cr Indian green hydrogen PGM demand' },
  { id: 'PGM-0006', batchNo: 'PGM-B2406', city: 'Noida', manufacturer: 'Indian Rare Earths', metalType: 'Ruthenium (Ru) 99.9%', application: 'Hard Disk Plating (Western Digital)', purityPercent: 99.9, weightGrams: 85, investmentCr: 125, status: 'Delivered', priority: 'Medium', origin: 'IRE Alwaye (KL)', destination: 'WD Pune Plant (MH)', shipDate: '2026-07-17', transitDays: 2, zone: 'North', remarks: 'Ruthenium sputtering target for hard disk magnetic layer &#8594; 99.9% Ru target for 20nm magnetic recording &#8594; &#8377;125Cr for 85 kg Ru target material &#8594; WD producing 60 million HDD platters/year in India &#8594; Ru magnetic moment 0.6 Bohr magneton &#8594; India importing 100% Ru from South Africa &#8594; &#8377;2,800Cr Indian electronics PGM demand' },
  { id: 'PGM-0007', batchNo: 'PGM-B2407', city: 'Kolkata', manufacturer: 'MIDHANI', metalType: 'Platinum-Rhodium (Pt-Rh 80:20)', application: 'Nitric Acid Catalyst (RIL Gujarat)', purityPercent: 99.9, weightGrams: 950, investmentCr: 3100, status: 'In Transit', priority: 'Critical', origin: 'MIDHANI Hyderabad (TS)', destination: 'RIL Dahej (GJ)', shipDate: '2026-07-21', transitDays: 3, zone: 'East', remarks: 'Pt-Rh gauze catalyst for nitric acid ammonia oxidation &#8594; 99.9% Pt-Rh 80:20 gauze for 900&#176;C NH3 oxidation &#8594; &#8377;3,100Cr for 950 kg Pt-Rh gauze &#8594; RIL producing 1.2 MMTPA nitric acid &#8594; Pt-Rh gauze life 8-12 months before reclamation &#8594; India consuming 12 tonnes Pt-Rh/year for fertilizer &#8594; &#8377;48,000Cr Indian fertilizer PGM demand' },
  { id: 'PGM-0008', batchNo: 'PGM-B2408', city: 'Ahmedabad', manufacturer: 'Gujarat Fluorochemicals', metalType: 'Palladium (Pd) 99.9%', application: 'Pharmaceutical Synthesis (Zydus)', purityPercent: 99.9, weightGrams: 420, investmentCr: 185, status: 'Delivered', priority: 'High', origin: 'GFCL Dahej (GJ)', destination: 'Zydus Ahmedabad (GJ)', shipDate: '2026-07-16', transitDays: 1, zone: 'West', remarks: 'Pd/C hydrogenation catalyst for API synthesis &#8594; 99.9% Pd on activated carbon support &#8594; &#8377;185Cr for 420 kg Pd/C catalyst &#8594; Zydus producing 15 APIs using Pd-catalyzed reactions &#8594; Pd hydrogenation selective C=C reduction 99% yield &#8594; India pharmaceutical Pd demand 8 tonnes/year &#8594; &#8377;12,500Cr Indian pharma PGM demand' },
  { id: 'PGM-0009', batchNo: 'PGM-B2409', city: 'Jaipur', manufacturer: 'Rajasthan State Mines', metalType: 'Platinum (Pt) 99.5%', application: 'Jewellery Manufacturing (PC Jeweller)', purityPercent: 99.5, weightGrams: 6500, investmentCr: 2180, status: 'Processing', priority: 'Medium', origin: 'RSM Processing Jaipur (RJ)', destination: 'PC Jeweller Delhi (DL)', shipDate: '2026-07-24', transitDays: 1, zone: 'North', remarks: 'Platinum grain for jewellery casting and fabrication &#8594; 99.5% Pt for investment casting of jewellery &#8594; &#8377;2,180Cr for 6.5 tonnes Pt jewellery stock &#8594; India 2nd largest platinum jewellery market after China &#8594; Pt jewellery hallmarking 95% Pt minimum in India &#8594; India platinum jewellery market &#8377;15,000Cr growing 15% &#8594; &#8377;22,000Cr Indian jewellery PGM demand' },
  { id: 'PGM-0010', batchNo: 'PGM-B2410', city: 'Coimbatore', manufacturer: 'IIT Madras', metalType: 'Iridium Oxide (IrO2)', application: 'pH Sensor Electrode (Honeywell)', purityPercent: 99.5, weightGrams: 45, investmentCr: 285, status: 'Delivered', priority: 'High', origin: 'IIT Madras (TN)', destination: 'Honeywell Pune (MH)', shipDate: '2026-07-18', transitDays: 2, zone: 'South', remarks: 'IrO2 thin film electrode for industrial pH sensor &#8594; 99.5% IrO2 sputtered on Ti substrate &#8594; &#8377;285Cr for 45 kg IrO2 target material &#8594; Honeywell producing 200,000 pH sensors/year &#8594; IrO2 electrode stability 2 years in aggressive media &#8594; IIT Madras developing magnetron sputtering process &#8594; &#8377;4,200Cr Indian sensor PGM demand' },
  { id: 'PGM-0011', batchNo: 'PGM-B2411', city: 'Bhubaneswar', manufacturer: 'NALCO', metalType: 'Platinum (Pt) 99.99% Fuel Cell', application: 'PEM Fuel Cell MEA (BHEL)', purityPercent: 99.99, weightGrams: 180, investmentCr: 1620, status: 'In Transit', priority: 'Critical', origin: 'IRE Alwaye (KL)', destination: 'BHEL Bengaluru (KA)', shipDate: '2026-07-23', transitDays: 4, zone: 'East', remarks: 'Platinum on carbon for PEM fuel cell membrane electrode assembly &#8594; 99.99% Pt 0.3mg/cm2 loading on CCM &#8594; &#8377;1,620Cr for 180 kg Pt/C for MEA &#8594; BHEL manufacturing 1 MW fuel cell stacks &#8594; PEM fuel cell efficiency 60% with 80,000hr life &#8594; India targeting 10 GW fuel cell by 2035 &#8594; &#8377;35,000Cr Indian fuel cell PGM demand' },
  { id: 'PGM-0012', batchNo: 'PGM-B2412', city: 'Guwahati', manufacturer: 'Oil India Ltd', metalType: 'Platinum (Pt) 99.9% Reforming', application: 'Naphtha Reforming Catalyst (BPCL)', purityPercent: 99.9, weightGrams: 1200, investmentCr: 2680, status: 'Delayed', priority: 'Critical', origin: 'Oil India Jorhat (AS)', destination: 'BPCL Bina (MP)', shipDate: '2026-07-11', transitDays: 6, zone: 'East', remarks: 'Pt-Sn/Al2O3 reforming catalyst for naphtha to gasoline &#8594; 99.9% Pt on chlorinated alumina support &#8594; &#8377;2,680Cr for 1.2 tonnes Pt in reforming catalyst &#8594; BPCL Bina 6 MMTPA naphtha reformer &#8594; Pt-Sn catalyst RON boost +40 octane numbers &#8594; Delayed 12 days due to monsoon logistics &#8594; &#8377;52,000Cr Indian refining PGM demand' },
  { id: 'PGM-0013', batchNo: 'PGM-B2413', city: 'Gandhinagar', manufacturer: 'Tata Chemicals', metalType: 'Palladium (Pd) 99.95%', application: 'Emission Control Catalyst (Tata Motors)', purityPercent: 99.95, weightGrams: 2200, investmentCr: 680, status: 'Processing', priority: 'High', origin: 'Hindustan Platinum Mumbai (MH)', destination: 'Tata Motors Pune (MH)', shipDate: '2026-07-26', transitDays: 1, zone: 'West', remarks: 'Pd-Rh three-way catalyst for BS-VI diesel oxidation &#8594; 99.95% Pd with Rh for diesel aftertreatment &#8594; &#8377;680Cr for 2.2 tonnes Pd catalyst &#8594; Tata Motors 1 million diesel vehicles/year &#8594; Pd-Rh catalyst converts 95% CO and HC &#8594; India BS-VI diesel norms since 2020 &#8594; &#8377;18,500Cr Indian diesel PGM demand' },
  { id: 'PGM-0014', batchNo: 'PGM-B2414', city: 'Lucknow', manufacturer: 'TASL', metalType: 'Rhodium (Rh) 99.95%', application: 'NOx Reduction Catalyst (Cummins)', purityPercent: 99.95, weightGrams: 65, investmentCr: 890, status: 'In Transit', priority: 'High', origin: 'IRE Alwaye (KL)', destination: 'Cummins India Pune (MH)', shipDate: '2026-07-23', transitDays: 3, zone: 'North', remarks: 'Rhodium washcoat for SCR NOx reduction catalyst &#8594; 99.95% Rh on alumina for selective catalytic reduction &#8594; &#8377;890Cr for 65 kg Rh washcoat &#8594; Cummins 500,000 SCR systems/year &#8594; Rh SCR conversion efficiency 95% at 250-450&#176;C &#8594; Rh most expensive PGM at &#8377;13,700/gram &#8594; &#8377;15,000Cr Indian SCR PGM demand' },
]

const tabs = ['Dashboard', 'Registry', 'Analytics', 'Insights'] as const
type TabType = typeof tabs[number]

export default function PlatinumGroupMetalLogisticsView() {
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
    return pgmRecords.filter(r => {
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

  const uniqueCities = useMemo(() => [...new Set(pgmRecords.map(r => r.city))].sort(), [])
  const uniqueManufacturers = useMemo(() => [...new Set(pgmRecords.map(r => r.manufacturer))].sort(), [])
  const uniqueStatuses = useMemo(() => [...new Set(pgmRecords.map(r => r.status))].sort(), [])
  const uniqueZones = useMemo(() => [...new Set(pgmRecords.map(r => r.zone))].sort(), [])

  const totalInvestment = useMemo(() => pgmRecords.reduce((s: number, r) => s + r.investmentCr, 0), [])
  const totalWeight = useMemo(() => pgmRecords.reduce((s: number, r) => s + r.weightGrams, 0), [])
  const deliveredCount = useMemo(() => pgmRecords.filter(r => r.status === 'Delivered').length, [])
  const delayedCount = useMemo(() => pgmRecords.filter(r => r.status === 'Delayed').length, [])

  const cityInvestmentMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of pgmRecords) { map[r.city] = (map[r.city] || 0) + r.investmentCr }
    return map
  }, [])

  const metalWeightMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of pgmRecords) { map[r.metalType] = (map[r.metalType] || 0) + r.weightGrams }
    return map
  }, [])

  const statusCountMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of pgmRecords) { map[r.status] = (map[r.status] || 0) + 1 }
    return map
  }, [])

  const zoneInvestmentMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of pgmRecords) { map[r.zone] = (map[r.zone] || 0) + r.investmentCr }
    return map
  }, [])

  const maxCity = useMemo(() => {
    const entries = (Object.entries(cityInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1])
    return entries[0] || ['N/A', 0]
  }, [cityInvestmentMap])

  const maxMetalWeight = useMemo(() => {
    const entries = (Object.entries(metalWeightMap) as [string, number][]).sort((a, b) => b[1] - a[1])
    return entries[0] || ['N/A', 0]
  }, [metalWeightMap])

  return (
    <div className="space-y-6">
      <PageHeader title="Platinum Group Metal Logistics" description="Strategic PGM supply chain tracking for catalytic converters, glass fibre bushings, satellite thrusters, hydrogen purification, fuel cells, jewellery and emission control" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-violet-600 bg-violet-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Total Investment</div><div className="text-2xl font-bold text-violet-800">&#8377;{totalInvestment.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground mt-1">Across {pgmRecords.length} batches</div></CardContent></Card>
        <Card className="border-l-4 border-l-violet-600 bg-violet-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Total PGM Weight</div><div className="text-2xl font-bold text-violet-800">{(totalWeight / 1000).toFixed(1)} kg</div><div className="text-xs text-muted-foreground mt-1">Pt, Pd, Rh, Ir, Ru combined</div></CardContent></Card>
        <Card className="border-l-4 border-l-violet-600 bg-violet-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Delivered</div><div className="text-2xl font-bold text-violet-800">{deliveredCount}</div><div className="text-xs text-muted-foreground mt-1">{delayedCount} delayed</div></CardContent></Card>
        <Card className="border-l-4 border-l-violet-600 bg-violet-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Top City</div><div className="text-2xl font-bold text-violet-800">{maxCity[0]}</div><div className="text-xs text-muted-foreground mt-1">&#8377;{maxCity[1].toLocaleString()} Cr invested</div></CardContent></Card>
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
          <button key={tab} className={`px-4 py-2 text-sm font-medium ${activeTab === tab ? 'border-b-2 border-violet-600 text-violet-800' : 'text-muted-foreground'}`} onClick={() => setActiveTab(tab)}>{tab}</button>
        ))}
      </div>

      {activeTab === 'Dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">Investment by City</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(cityInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([city, val]) => (<div key={city} className="flex items-center gap-2"><span className="text-xs w-24 truncate">{city}</span><div className="flex-1 bg-violet-100 rounded-full h-3"><div className="bg-violet-600 h-3 rounded-full" style={{ width: `${(val / maxCity[1]) * 100}%` }}></div></div><span className="text-xs font-medium w-20 text-right">&#8377;{val} Cr</span></div>))}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">PGM Weight by Metal Type</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(metalWeightMap) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([metal, wt]) => (<div key={metal} className="flex items-center gap-2"><span className="text-xs w-40 truncate">{metal}</span><div className="flex-1 bg-purple-100 rounded-full h-3"><div className="bg-purple-500 h-3 rounded-full" style={{ width: `${(wt / maxMetalWeight[1]) * 100}%` }}></div></div><span className="text-xs font-medium w-20 text-right">{(wt / 1000).toFixed(1)} kg</span></div>))}</CardContent></Card>
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
              <thead><tr className="border-b"><th className="text-left p-2">Batch</th><th className="text-left p-2">City</th><th className="text-left p-2">Manufacturer</th><th className="text-left p-2">Metal Type</th><th className="text-left p-2">Application</th><th className="text-left p-2">Purity</th><th className="text-left p-2">Weight(g)</th><th className="text-left p-2">&#8377;Cr</th><th className="text-left p-2">Status</th></tr></thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id} className={`border-b ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}>
                    <td className="p-2 font-mono text-xs">{r.batchNo}</td>
                    <td className="p-2">{r.city}</td>
                    <td className="p-2">{r.manufacturer}</td>
                    <td className="p-2">{r.metalType}</td>
                    <td className="p-2 max-w-[200px] truncate">{r.application}</td>
                    <td className="p-2">{r.purityPercent}%</td>
                    <td className="p-2">{r.weightGrams.toLocaleString()}</td>
                    <td className="p-2 font-medium">&#8377;{r.investmentCr}</td>
                    <td className="p-2"><Badge variant={r.status === 'Delivered' ? 'default' : r.status === 'Delayed' ? 'destructive' : 'secondary'}>{r.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card><CardHeader><CardTitle className="text-sm">Purity by Metal Type</CardTitle></CardHeader><CardContent className="space-y-2">{pgmRecords.slice(0, 8).map(r => (<div key={r.id} className="flex items-center gap-2"><span className="text-xs w-40 truncate">{r.metalType}</span><div className="flex-1 bg-fuchsia-100 rounded-full h-3"><div className="bg-fuchsia-500 h-3 rounded-full" style={{ width: `${r.purityPercent}%` }}></div></div><span className="text-xs font-medium w-12 text-right">{r.purityPercent}%</span></div>))}</CardContent></Card>
            <Card><CardHeader><CardTitle className="text-sm">Investment by Zone</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(zoneInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([zone, val]) => (<div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone}</span><div className="flex-1 bg-indigo-100 rounded-full h-3"><div className="bg-indigo-500 h-3 rounded-full" style={{ width: `${(val / maxCity[1]) * 100}%` }}></div></div><span className="text-xs font-medium w-20 text-right">&#8377;{val} Cr</span></div>))}</CardContent></Card>
          </div>
        </div>
      )}

      {activeTab === 'Analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">Status Distribution</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(statusCountMap) as [string, number][]).map(([status, count]) => (<div key={status} className="flex items-center gap-2"><span className="text-xs w-24">{status}</span><div className="flex-1 bg-gray-100 rounded-full h-3"><div className="bg-violet-600 h-3 rounded-full" style={{ width: `${(count / pgmRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Priority Breakdown</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const map: Record<string, number> = {}; for (const r of pgmRecords) { map[r.priority] = (map[r.priority] || 0) + 1 } const sorted = (Object.entries(map) as [string, number][]).sort((a, b) => b[1] - a[1]); return sorted.map(([pri, count]) => (<div key={pri} className="flex items-center gap-2"><span className="text-xs w-20">{pri}</span><div className="flex-1 bg-rose-100 rounded-full h-3"><div className="bg-rose-500 h-3 rounded-full" style={{ width: `${(count / pgmRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))})()}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Shipment Volume by Zone</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const map: Record<string, number> = {}; for (const r of pgmRecords) { map[r.zone] = (map[r.zone] || 0) + 1 } const sorted = (Object.entries(map) as [string, number][]).sort((a, b) => b[1] - a[1]); return sorted.map(([zone, count]) => (<div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone}</span><div className="flex-1 bg-sky-100 rounded-full h-3"><div className="bg-sky-500 h-3 rounded-full" style={{ width: `${(count / pgmRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))})()}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Weight Range Distribution</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const ranges: Record<string, number> = { 'Below 500g': 0, '500-1500g': 0, '1500-3000g': 0, '3000g+': 0 }; for (const r of pgmRecords) { if (r.weightGrams >= 3000) ranges['3000g+']++; else if (r.weightGrams >= 1500) ranges['1500-3000g']++; else if (r.weightGrams >= 500) ranges['500-1500g']++; else ranges['Below 500g']++ } return (Object.entries(ranges) as [string, number][]).map(([range, count]) => (<div key={range} className="flex items-center gap-2"><span className="text-xs w-24">{range}</span><div className="flex-1 bg-amber-100 rounded-full h-3"><div className="bg-amber-500 h-3 rounded-full" style={{ width: `${(count / pgmRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))})()}</CardContent></Card>
        </div>
      )}

      {activeTab === 'Insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-l-4 border-l-violet-600"><CardHeader><CardTitle className="text-sm">India&apos;s PGM Import Dependence: 95%+</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>India imports over 95% of its platinum group metals, consuming approximately 65 tonnes of PGM annually valued at &#8377;22,000Cr. The primary suppliers are South Africa (Anglo American, Impala Platinum) for Pt and Pd, and Russia (Nornickel) for Pd and Rh. India&apos;s only domestic PGM processing capability is at IRE Alwaye (Kerala) for Ru and Ir recovery from secondary sources, and Hindustan Platinum Mumbai for Pt-Rh alloy fabrication. The National Mineral Policy 2019 identifies PGM as a critical strategic mineral, with DRDO DMRL and MIDHANI developing indigenous Pt-Rh gauze and alloy production capacity targeting 5 tonnes/year by 2028.</p></CardContent></Card>
          <Card className="border-l-4 border-l-amber-500"><CardHeader><CardTitle className="text-sm">Automotive Catalytic Converter: Largest PGM Consumer</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>India&apos;s automotive sector is the largest PGM consumer, with 3.5 million catalytic converters produced annually for BS-VI compliance. Each gasoline TWC contains 3-6g Pt-Pd-Rh, while diesel DOC+DPF+SCR systems use 8-15g Pd-Rh per unit. Maruti Suzuki, Tata Motors, Hyundai India and Mahindra collectively require 42 tonnes of Pt and 28 tonnes of Pd-Rh per year for emission control. The transition to BS-VII (Euro VII equivalent) by 2028 will increase PGM loading by 30% due to tighter NOx and particulate limits. India&apos;s automotive PGM market is projected at &#8377;98,000Cr by 2030.</p></CardContent></Card>
          <Card className="border-l-4 border-l-emerald-500"><CardHeader><CardTitle className="text-sm">Green Hydrogen and Fuel Cells: Emerging PGM Frontier</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>India&apos;s National Green Hydrogen Mission targets 5 million tonnes of green H2 production by 2030, creating massive demand for PGM electrolyzer catalysts. PEM electrolyzers require 0.3-0.5 mg Pt/cm2 on the cathode and IrO2 on the anode, with NTPC, IOCL, Reliance and Adani building 15 GW of electrolyzer capacity. Simultaneously, the PEM fuel cell programme at BHEL (1 MW stacks for mobility and stationary power) and the IOCL-Hindustan Pt hydrogen purification membrane programme drive additional demand. India&apos;s combined green hydrogen and fuel cell PGM demand is projected at &#8377;73,000Cr by 2035, making PGM supply security a critical national priority.</p></CardContent></Card>
          <Card className="border-l-4 border-l-blue-500"><CardHeader><CardTitle className="text-sm">Pt-Rh Glass Fibre Bushings and Fertilizer Catalysts</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>India&apos;s glass fibre industry (Saint-Gobain, Owens Corning, John Manville) operates 8 bushing lines requiring Pt-Rh 80:20 and 90:10 alloy gauze at 1600&#176;C. Each bushing contains 50-100 kg of Pt-Rh alloy with 8-12 month replacement cycles, creating 12 tonnes/year Pt-Rh demand. The fertilizer industry (RIL, NFL, Chambal Fertilisers) uses Pt-Rh 80:20 gauze catalysts for ammonia oxidation to nitric acid, consuming another 12 tonnes/year of Pt-Rh. Combined glass and fertilizer Pt-Rh demand of 24 tonnes/year makes this India&apos;s second-largest PGM application after automotive, with total market value of &#8377;90,000Cr. MIDHANI Hyderabad is developing indigenous Pt-Rh gauze production with 90% domestic value addition target by 2028.</p></CardContent></Card>
        </div>
      )}
    </div>
  )
}
