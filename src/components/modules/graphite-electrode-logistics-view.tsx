'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { Cog } from 'lucide-react'

interface GraphiteElectrodeRecord {
  id: string
  batchNo: string
  city: string
  manufacturer: string
  electrodeType: string
  application: string
  diameterMm: number
  bulkDensityGcm3: number
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

const graphiteRecords: GraphiteElectrodeRecord[] = [
  { id: 'GEL-0001', batchNo: 'GEL-B2401', city: 'Bhilai', manufacturer: 'HEG Limited', electrodeType: 'UHP 600mm (Needle Coke)', application: 'Electric Arc Furnace (Tata Steel Jamshedpur)', diameterMm: 600, bulkDensityGcm3: 1.72, investmentCr: 245, status: 'Delivered', priority: 'Critical', origin: 'HEG Mandi Gobindgarh (PB)', destination: 'Tata Steel Jamshedpur (JH)', shipDate: '2026-07-18', transitDays: 3, zone: 'East', remarks: 'UHP 600mm needle coke graphite electrode for 120t EAF &#8594; 1.72 g/cm3 bulk density with 5 micron porosity &#8594; &#8377;245Cr for 85 tonnes UHP electrode &#8594; Tata Steel EAF producing 3 MT crude steel/year &#8594; Electrode consumption 1.8 kg/t steel at 350A current density &#8594; India 4th largest electrode producer HEG 120 KTPY &#8594; &#8377;18,500Cr Indian EAF electrode demand' },
  { id: 'GEL-0002', batchNo: 'GEL-B2402', city: 'Bengaluru', manufacturer: 'Graphite India Ltd', electrodeType: 'HP 500mm (Petroleum Coke)', application: 'Ladle Furnace (JSW Vijayanagar)', diameterMm: 500, bulkDensityGcm3: 1.68, investmentCr: 178, status: 'In Transit', priority: 'High', origin: 'GIL Bengaluru (KA)', destination: 'JSW Steel Vijayanagar (KA)', shipDate: '2026-07-22', transitDays: 1, zone: 'South', remarks: 'HP 500mm petroleum coke electrode for 150t ladle furnace &#8594; 1.68 g/cm3 density for secondary refining &#8594; &#8377;178Cr for 65 tonnes HP electrode &#8594; JSW Vijayanagar 12 MT integrated steel plant &#8594; LF electrode consumption 0.4 kg/t steel &#8594; India installing 45 new ladle furnaces by 2028 &#8594; &#8377;13,200Cr Indian LF electrode demand' },
  { id: 'GEL-0003', batchNo: 'GEL-B2403', city: 'Mumbai', manufacturer: 'Reliance Industries', electrodeType: 'RP 300mm (Premium Coke)', application: 'Aluminium Smelter (Hindalco Rourkela)', diameterMm: 300, bulkDensityGcm3: 1.58, investmentCr: 92, status: 'Delivered', priority: 'Medium', origin: 'RIL Jamnagar (GJ)', destination: 'Hindalco Rourkela (OD)', shipDate: '2026-07-19', transitDays: 4, zone: 'West', remarks: 'RP 300mm premium coke electrode for 200kA aluminium cell &#8594; 1.58 g/cm3 density baked anode block &#8594; &#8377;92Cr for 120 tonnes RP electrode &#8594; Hindalco 2.1 MT aluminium capacity &#8594; Anode consumption 420 kg/t aluminium &#8594; India 2nd largest aluminium producer &#8594; &#8377;7,500Cr Indian aluminium electrode demand' },
  { id: 'GEL-0004', batchNo: 'GEL-B2404', city: 'Pune', manufacturer: 'Bharat Forge Ltd', electrodeType: 'UHP 700mm (Joint)', application: 'Die Steel Melting (Bharat Forge Pune)', diameterMm: 700, bulkDensityGcm3: 1.75, investmentCr: 312, status: 'Delayed', priority: 'Critical', origin: 'HEG Mandi Gobindgarh (PB)', destination: 'Bharat Forge Pune (MH)', shipDate: '2026-07-12', transitDays: 3, zone: 'West', remarks: 'UHP 700mm jointed electrode for 80t EAF die steel melting &#8594; 1.75 g/cm3 highest grade UHP &#8594; &#8377;312Cr for 45 tonnes 700mm electrode &#8594; Bharat Forge 300,000 tonnes forging/year &#8594; EAF melting H13/D2 die steel at 1650&#176;C &#8594; Delayed 10 days due to needle coke import delay &#8594; &#8377;24,000Cr Indian forging electrode demand' },
  { id: 'GEL-0005', batchNo: 'GEL-B2405', city: 'Hyderabad', manufacturer: 'MIDHANI', electrodeType: 'Isotropic 200mm (Fine Grain)', application: 'EDM Wire Guide (Godrej Boyce)', diameterMm: 200, bulkDensityGcm3: 1.82, investmentCr: 68, status: 'Processing', priority: 'High', origin: 'GIL Bengaluru (KA)', destination: 'Godrej Boyce Mumbai (MH)', shipDate: '2026-07-25', transitDays: 2, zone: 'South', remarks: 'Isotropic 200mm fine-grain graphite for EDM wire cut guide &#8594; 1.82 g/cm3 high-density isotropic &#8594; &#8377;68Cr for 8 tonnes fine-grain block &#8594; Godrej Boyce 500 EDM machines &#8594; Fine-grain EDM surface finish Ra 0.8 micron &#8594; India 5,000+ EDM machines operational &#8594; &#8377;5,200Cr Indian EDM graphite demand' },
  { id: 'GEL-0006', batchNo: 'GEL-B2406', city: 'Chennai', manufacturer: 'IGCAR Kalpakkam', electrodeType: 'Nuclear Grade 100mm (PGS)', application: 'HTGR Moderator Core (IGCAR)', diameterMm: 100, bulkDensityGcm3: 1.80, investmentCr: 185, status: 'Delivered', priority: 'Critical', origin: 'MIDHANI Hyderabad (TS)', destination: 'IGCAR Kalpakkam (TN)', shipDate: '2026-07-17', transitDays: 1, zone: 'South', remarks: 'Nuclear grade PGS graphite 100mm for HTGR moderator blocks &#8594; 1.80 g/cm3 nuclear purity grade &#8594; &#8377;185Cr for 25 tonnes moderator blocks &#8594; IGR-1 Indian high-temperature gas reactor programme &#8594; PGS graphite neutron moderation thermal conductivity 80 W/mK &#8594; India planning 5 HTGR modules by 2035 &#8594; &#8377;15,000Cr Indian nuclear graphite demand' },
  { id: 'GEL-0007', batchNo: 'GEL-B2407', city: 'Noida', manufacturer: 'Sunflag Iron &amp; Steel', electrodeType: 'HP 400mm (Calcined)', application: 'Mini Blast Furnace (Sunflag Bhandara)', diameterMm: 400, bulkDensityGcm3: 1.65, investmentCr: 45, status: 'In Transit', priority: 'Medium', origin: 'HEG Mandi Gobindgarh (PB)', destination: 'Sunflag Bhandara (MH)', shipDate: '2026-07-21', transitDays: 3, zone: 'North', remarks: 'HP 400mm calcined petroleum coke electrode &#8594; 1.65 g/cm3 for mini blast furnace electrode &#8594; &#8377;45Cr for 28 tonnes HP 400mm &#8594; Sunflag 1.5 MT steel plant Bhandara &#8594; MBF electrode consumption 3.5 kg/t hot metal &#8594; India 300 mini blast furnaces operational &#8594; &#8377;3,800Cr Indian MBF electrode demand' },
  { id: 'GEL-0008', batchNo: 'GEL-B2408', city: 'Ahmedabad', manufacturer: 'Gujarat Fluorochemicals Ltd', electrodeType: 'Impervious 150mm (Resin)', application: 'Fluorine Cell Anode (GFCL Ahmedabad)', diameterMm: 150, bulkDensityGcm3: 1.85, investmentCr: 38, status: 'Delivered', priority: 'High', origin: 'GIL Bengaluru (KA)', destination: 'GFCL Ahmedabad (GJ)', shipDate: '2026-07-16', transitDays: 1, zone: 'West', remarks: 'Impervious resin-impregnated graphite anode for fluorine cell &#8594; 1.85 g/cm3 with <5% porosity resin filled &#8594; &#8377;38Cr for 4 tonnes impervious anode &#8594; GFCL India largest fluoropolymers producer &#8594; Anode life 18 months at 200A/m2 in HF &#8594; India fluorine chemical market &#8377;12,000Cr &#8594; &#8377;3,200Cr Indian fluorine electrode demand' },
  { id: 'GEL-0009', batchNo: 'GEL-B2409', city: 'Kolkata', manufacturer: 'SAIL Rourkela', electrodeType: 'UHP 500mm (Pin Joint)', application: 'EAF Steelmaking (SAIL Rourkela)', diameterMm: 500, bulkDensityGcm3: 1.72, investmentCr: 265, status: 'Processing', priority: 'Critical', origin: 'HEG Mandi Gobindgarh (PB)', destination: 'SAIL Rourkela Plant (OD)', shipDate: '2026-07-24', transitDays: 2, zone: 'East', remarks: 'UHP 500mm pin-joint electrode for 150t EAF at Rourkela &#8594; 1.72 g/cm3 needle coke base &#8594; &#8377;265Cr for 95 tonnes UHP electrode &#8594; SAIL Rourkela 4.5 MT steel plant EAF expansion &#8594; Pin-joint electrode allows 3m column auto-feeding &#8594; India EAF capacity expanding 15 MT by 2030 &#8594; &#8377;20,500Cr Indian EAF electrode demand' },
  { id: 'GEL-0010', batchNo: 'GEL-B2410', city: 'Jaipur', manufacturer: 'Rajasthan State Mines', electrodeType: 'Carbon Block 500mm (Baked)', application: 'Silicon Furnace (RSMS Jaipur)', diameterMm: 500, bulkDensityGcm3: 1.55, investmentCr: 42, status: 'Delivered', priority: 'Low', origin: 'RSMS Jaipur (RJ)', destination: 'Nirma Bhavnagar (GJ)', shipDate: '2026-07-18', transitDays: 2, zone: 'North', remarks: 'Carbon block 500mm baked for submerged arc silicon furnace &#8594; 1.55 g/cm3 baked carbon block &#8594; &#8377;42Cr for 35 tonnes carbon block &#8594; RSMS silicon metal subsidiary &#8594; SA furnace electrode consumption 120 kg/t Si &#8594; India 600 KTPY silicon metal capacity &#8594; &#8377;3,500Cr Indian silicon furnace electrode demand' },
  { id: 'GEL-0011', batchNo: 'GEL-B2411', city: 'Coimbatore', manufacturer: 'IIT Madras', electrodeType: 'Graphite Foam 300mm', application: 'Thermal Management (IIT Madras)', diameterMm: 300, bulkDensityGcm3: 0.45, investmentCr: 12, status: 'In Transit', priority: 'Low', origin: 'GIL Bengaluru (KA)', destination: 'IIT Madras (TN)', shipDate: '2026-07-23', transitDays: 1, zone: 'South', remarks: 'Graphite foam 300mm for EV battery thermal management R&amp;D &#8594; 0.45 g/cm3 ultra-lightweight foam graphite &#8594; &#8377;12Cr for 500 kg foam block &#8594; IIT Madras EV thermal management programme &#8594; Graphite foam thermal conductivity 25 W/mK at 0.45 g/cm3 &#8594; India EV battery thermal market emerging &#8594; &#8377;900Cr Indian thermal graphite demand' },
  { id: 'GEL-0012', batchNo: 'GEL-B2412', city: 'Guwahati', manufacturer: 'Oil India Ltd', electrodeType: 'Impervious 250mm (CVD)', application: 'CVD Reactor Susceptor (OIL Duliajan)', diameterMm: 250, bulkDensityGcm3: 1.88, investmentCr: 28, status: 'Delayed', priority: 'Medium', origin: 'GIL Bengaluru (KA)', destination: 'OIL Jorhat (AS)', shipDate: '2026-07-11', transitDays: 2, zone: 'East', remarks: 'CVD-coated impervious graphite susceptor for petrochemical reactor &#8594; 1.88 g/cm3 SiC-CVD coated impervious &#8594; &#8377;28Cr for 3 tonnes susceptor plates &#8594; OIL petrochemical catalyst synthesis reactor &#8594; CVD SiC coating purity 99.9% at 1500&#176;C &#8594; Delayed 12 days due to monsoon road flooding &#8594; &#8377;2,100Cr Indian CVD graphite demand' },
  { id: 'GEL-0013', batchNo: 'GEL-B2413', city: 'Bhubaneswar', manufacturer: 'NALCO', electrodeType: 'Prebaked Anode 500mm', application: 'Aluminium Potline (NALCO Angul)', diameterMm: 500, bulkDensityGcm3: 1.60, investmentCr: 165, status: 'Processing', priority: 'High', origin: 'NALCO Angul (OD)', destination: 'NALCO Smelter Angul (OD)', shipDate: '2026-07-26', transitDays: 0, zone: 'East', remarks: 'Prebaked carbon anode 500mm for 400kA aluminium potline &#8594; 1.60 g/cm3 prebaked anode block &#8594; &#8377;165Cr for 180 tonnes prebaked anodes &#8594; NALCO 1.1 MT aluminium smelter &#8594; Anode consumption 410 kg/t aluminium &#8594; India aluminium capacity expanding 2.5 MT by 2028 &#8594; &#8377;12,800Cr Indian prebaked anode demand' },
  { id: 'GEL-0014', batchNo: 'GEL-B2414', city: 'Lucknow', manufacturer: 'TASL', electrodeType: 'Composite 350mm (C/C)', application: 'BRAHMOS Scramjet Combustor (DRDO)', diameterMm: 350, bulkDensityGcm3: 1.75, investmentCr: 385, status: 'Delivered', priority: 'Critical', origin: 'MIDHANI Hyderabad (TS)', destination: 'DRDO Hyderabad (TS)', shipDate: '2026-07-23', transitDays: 2, zone: 'North', remarks: 'Carbon-carbon composite 350mm for scramjet combustor liner &#8594; 1.75 g/cm3 3D C/C composite &#8594; &#8377;385Cr for 6 tonnes C/C liner segments &#8594; DRDO Hypersonic Technology Demonstrator &#8594; C/C composite 80% strength retention at 2000&#176;C &#8594; TASL-DRDO JV for aerospace C/C production &#8594; &#8377;30,000Cr Indian aerospace C/C demand' },
]

const tabs = ['Dashboard', 'Registry', 'Analytics', 'Insights'] as const
type TabType = typeof tabs[number]

export default function GraphiteElectrodeLogisticsView() {
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
    return graphiteRecords.filter(r => {
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

  const uniqueCities = useMemo(() => [...new Set(graphiteRecords.map(r => r.city))].sort(), [])
  const uniqueManufacturers = useMemo(() => [...new Set(graphiteRecords.map(r => r.manufacturer))].sort(), [])
  const uniqueStatuses = useMemo(() => [...new Set(graphiteRecords.map(r => r.status))].sort(), [])
  const uniqueZones = useMemo(() => [...new Set(graphiteRecords.map(r => r.zone))].sort(), [])

  const totalInvestment = useMemo(() => graphiteRecords.reduce((s: number, r) => s + r.investmentCr, 0), [])
  const avgDensity = useMemo(() => (graphiteRecords.reduce((s: number, r) => s + r.bulkDensityGcm3, 0) / graphiteRecords.length).toFixed(2), [])
  const deliveredCount = useMemo(() => graphiteRecords.filter(r => r.status === 'Delivered').length, [])
  const delayedCount = useMemo(() => graphiteRecords.filter(r => r.status === 'Delayed').length, [])

  const cityInvestmentMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of graphiteRecords) { map[r.city] = (map[r.city] || 0) + r.investmentCr }
    return map
  }, [])

  const typeDiameterMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of graphiteRecords) { map[r.electrodeType] = (map[r.electrodeType] || 0) + r.diameterMm }
    return map
  }, [])

  const statusCountMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of graphiteRecords) { map[r.status] = (map[r.status] || 0) + 1 }
    return map
  }, [])

  const zoneInvestmentMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of graphiteRecords) { map[r.zone] = (map[r.zone] || 0) + r.investmentCr }
    return map
  }, [])

  const maxCity = useMemo(() => {
    const entries = (Object.entries(cityInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1])
    return entries[0] || ['N/A', 0]
  }, [cityInvestmentMap])

  const maxTypeDia = useMemo(() => {
    const entries = (Object.entries(typeDiameterMap) as [string, number][]).sort((a, b) => b[1] - a[1])
    return entries[0] || ['N/A', 0]
  }, [typeDiameterMap])

  return (
    <div className="space-y-6">
      <PageHeader title="Graphite Electrode Logistics" description="Graphite electrode and carbon material supply chain for electric arc furnaces, aluminium smelters, EDM machining, nuclear reactors and aerospace C/C composites" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-gray-700 bg-gray-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Total Investment</div><div className="text-2xl font-bold text-gray-800">&#8377;{totalInvestment.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground mt-1">Across {graphiteRecords.length} batches</div></CardContent></Card>
        <Card className="border-l-4 border-l-gray-700 bg-gray-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Avg Bulk Density</div><div className="text-2xl font-bold text-gray-800">{avgDensity} g/cm3</div><div className="text-xs text-muted-foreground mt-1">Graphite density range</div></CardContent></Card>
        <Card className="border-l-4 border-l-gray-700 bg-gray-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Delivered</div><div className="text-2xl font-bold text-gray-800">{deliveredCount}</div><div className="text-xs text-muted-foreground mt-1">{delayedCount} delayed</div></CardContent></Card>
        <Card className="border-l-4 border-l-gray-700 bg-gray-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Top City</div><div className="text-2xl font-bold text-gray-800">{maxCity[0]}</div><div className="text-xs text-muted-foreground mt-1">&#8377;{maxCity[1].toLocaleString()} Cr invested</div></CardContent></Card>
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
          <button key={tab} className={`px-4 py-2 text-sm font-medium ${activeTab === tab ? 'border-b-2 border-gray-700 text-gray-800' : 'text-muted-foreground'}`} onClick={() => setActiveTab(tab)}>{tab}</button>
        ))}
      </div>

      {activeTab === 'Dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">Investment by City</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(cityInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([city, val]) => (<div key={city} className="flex items-center gap-2"><span className="text-xs w-24 truncate">{city}</span><div className="flex-1 bg-gray-200 rounded-full h-3"><div className="bg-gray-700 h-3 rounded-full" style={{ width: `${(val / maxCity[1]) * 100}%` }}></div></div><span className="text-xs font-medium w-20 text-right">&#8377;{val} Cr</span></div>))}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Diameter by Electrode Type</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(typeDiameterMap) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([typ, dia]) => (<div key={typ} className="flex items-center gap-2"><span className="text-xs w-36 truncate">{typ}</span><div className="flex-1 bg-stone-200 rounded-full h-3"><div className="bg-stone-600 h-3 rounded-full" style={{ width: `${(dia / maxTypeDia[1]) * 100}%` }}></div></div><span className="text-xs font-medium w-16 text-right">{dia}mm</span></div>))}</CardContent></Card>
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
              <thead><tr className="border-b"><th className="text-left p-2">Batch</th><th className="text-left p-2">City</th><th className="text-left p-2">Manufacturer</th><th className="text-left p-2">Electrode Type</th><th className="text-left p-2">Application</th><th className="text-left p-2">Dia</th><th className="text-left p-2">Density</th><th className="text-left p-2">&#8377;Cr</th><th className="text-left p-2">Status</th></tr></thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id} className={`border-b ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}>
                    <td className="p-2 font-mono text-xs">{r.batchNo}</td>
                    <td className="p-2">{r.city}</td>
                    <td className="p-2">{r.manufacturer}</td>
                    <td className="p-2">{r.electrodeType}</td>
                    <td className="p-2 max-w-[200px] truncate">{r.application}</td>
                    <td className="p-2">{r.diameterMm}mm</td>
                    <td className="p-2">{r.bulkDensityGcm3}</td>
                    <td className="p-2 font-medium">&#8377;{r.investmentCr}</td>
                    <td className="p-2"><Badge variant={r.status === 'Delivered' ? 'default' : r.status === 'Delayed' ? 'destructive' : 'secondary'}>{r.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card><CardHeader><CardTitle className="text-sm">Density by Electrode</CardTitle></CardHeader><CardContent className="space-y-2">{graphiteRecords.slice(0, 8).map(r => (<div key={r.id} className="flex items-center gap-2"><span className="text-xs w-36 truncate">{r.electrodeType}</span><div className="flex-1 bg-zinc-100 rounded-full h-3"><div className="bg-zinc-600 h-3 rounded-full" style={{ width: `${(r.bulkDensityGcm3 / 1.88) * 100}%` }}></div></div><span className="text-xs font-medium w-14 text-right">{r.bulkDensityGcm3}</span></div>))}</CardContent></Card>
            <Card><CardHeader><CardTitle className="text-sm">Investment by Zone</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(zoneInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([zone, val]) => (<div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone}</span><div className="flex-1 bg-neutral-200 rounded-full h-3"><div className="bg-neutral-600 h-3 rounded-full" style={{ width: `${(val / maxCity[1]) * 100}%` }}></div></div><span className="text-xs font-medium w-20 text-right">&#8377;{val} Cr</span></div>))}</CardContent></Card>
          </div>
        </div>
      )}

      {activeTab === 'Analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">Status Distribution</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(statusCountMap) as [string, number][]).map(([status, count]) => (<div key={status} className="flex items-center gap-2"><span className="text-xs w-24">{status}</span><div className="flex-1 bg-gray-100 rounded-full h-3"><div className="bg-gray-700 h-3 rounded-full" style={{ width: `${(count / graphiteRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Priority Breakdown</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const map: Record<string, number> = {}; for (const r of graphiteRecords) { map[r.priority] = (map[r.priority] || 0) + 1 } const sorted = (Object.entries(map) as [string, number][]).sort((a, b) => b[1] - a[1]); return sorted.map(([pri, count]) => (<div key={pri} className="flex items-center gap-2"><span className="text-xs w-20">{pri}</span><div className="flex-1 bg-red-100 rounded-full h-3"><div className="bg-red-500 h-3 rounded-full" style={{ width: `${(count / graphiteRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))})()}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Shipment Volume by Zone</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const map: Record<string, number> = {}; for (const r of graphiteRecords) { map[r.zone] = (map[r.zone] || 0) + 1 } const sorted = (Object.entries(map) as [string, number][]).sort((a, b) => b[1] - a[1]); return sorted.map(([zone, count]) => (<div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone}</span><div className="flex-1 bg-teal-100 rounded-full h-3"><div className="bg-teal-500 h-3 rounded-full" style={{ width: `${(count / graphiteRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))})()}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Diameter Range Distribution</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const ranges: Record<string, number> = { 'Below 200mm (Fine)': 0, '200-350mm (Medium)': 0, '350-500mm (Standard)': 0, '500mm+ (Large)': 0 }; for (const r of graphiteRecords) { if (r.diameterMm >= 500) ranges['500mm+ (Large)']++; else if (r.diameterMm >= 350) ranges['350-500mm (Standard)']++; else if (r.diameterMm >= 200) ranges['200-350mm (Medium)']++; else ranges['Below 200mm (Fine)']++ } return (Object.entries(ranges) as [string, number][]).map(([range, count]) => (<div key={range} className="flex items-center gap-2"><span className="text-xs w-28">{range}</span><div className="flex-1 bg-indigo-100 rounded-full h-3"><div className="bg-indigo-500 h-3 rounded-full" style={{ width: `${(count / graphiteRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))})()}</CardContent></Card>
        </div>
      )}

      {activeTab === 'Insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-l-4 border-l-gray-700"><CardHeader><CardTitle className="text-sm">UHP Electrode: India 4th Largest Global Producer</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>India is the world&apos;s 4th largest graphite electrode producer at 180 KTPY, with HEG Limited and Graphite India Ltd (GIL) operating 6 needle coke calcining plants and 14 electrode baking furnaces between them. UHP (Ultra High Power) 600-700mm electrodes are the premium grade, requiring petroleum-derived needle coke with 1.72 g/cm3 bulk density and thermal conductivity exceeding 60 W/mK. India&apos;s 15 MT EAF steel capacity consumes 120,000 tonnes of electrodes per year at 1.8 kg/t consumption rate. With green steel mandates pushing EAF capacity to 30 MT by 2030, electrode demand is projected to reach 200,000 tonnes/year. India imports 60% needle coke from Japan (Mitsubishi) and China (Fushun), creating strategic supply vulnerability.</p></CardContent></Card>
          <Card className="border-l-4 border-l-amber-500"><CardHeader><CardTitle className="text-sm">Aluminium Anode: Hindalco NALCO Carbon Block Supply</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>India&apos;s aluminium industry at 4.1 MT capacity requires prebaked carbon anodes at 410 kg/t aluminium consumption rate, totalling 1.68 million tonnes of anode blocks per year. Hindalco (2.1 MT), NALCO (1.1 MT) and Vedanta (1.2 MT) operate 22 potlines with 200-500kA current technology. Prebaked anodes at 1.60 g/cm3 bulk density are manufactured in-house from calcined petroleum coke and coal tar pitch, with each pot requiring 24 anodes replaced every 28 days. India&apos;s captive anode capacity is 90% self-sufficient, importing specialty coke from China and Australia. Carbon block quality directly impacts aluminium purity (99.7% target) and energy efficiency at 13-14 kWh/kg Al.</p></CardContent></Card>
          <Card className="border-l-4 border-l-emerald-500"><CardHeader><CardTitle className="text-sm">Nuclear Graphite: HTGR Programme and Moderator Blocks</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>Nuclear-grade isotropic graphite (PGS) is essential for High-Temperature Gas Reactor (HTGR) moderator and reflector blocks, operating at 1000&#176;C in helium coolant. IGCAR Kalpakkam is developing India&apos;s first HTGR demonstrator (IGR-1) requiring 500 tonnes of nuclear purity graphite with thermal conductivity 80 W/mK and low neutron absorption cross-section. The graphite must withstand fast neutron fluence of 10E22 n/cm2 over 40-year reactor life with dimensional change less than 0.5%. MIDHANI is establishing nuclear graphite production with carbonization at 1000&#176;C followed by graphitization at 2800&#176;C in Acheson furnaces, targeting 50 tonnes/year by 2028 for the 5 planned HTGR modules.</p></CardContent></Card>
          <Card className="border-l-4 border-l-blue-500"><CardHeader><CardTitle className="text-sm">C/C Composite: Scramjet and Aerospace Structures</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>Carbon-carbon (C/C) composite graphite represents the ultimate high-temperature structural material, retaining 80% room-temperature strength at 2000&#176;C in non-oxidizing atmospheres. DRDO&apos;s hypersonic technology programme uses 3D C/C composite for scramjet combustor liners, nose tips and control surfaces operating at Mach 6+ flight conditions. The manufacturing process involves repeated carbon fiber preform infiltration and pyrolysis at 1000&#176;C for 6-8 cycles to achieve 1.75 g/cm3 density with &#60;5% residual porosity. TASL and DRDO have established a joint C/C composite production facility targeting 20 tonnes/year for BRAHMOS-II hypersonic missile and AMCA fighter exhaust components. India&apos;s aerospace C/C composite demand is projected at &#8377;30,000Cr by 2035.</p></CardContent></Card>
        </div>
      )}
    </div>
  )
}
