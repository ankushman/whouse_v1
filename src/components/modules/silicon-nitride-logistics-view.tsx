'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { Hexagon } from 'lucide-react'

interface SiliconNitrideRecord {
  id: string
  batchNo: string
  city: string
  manufacturer: string
  productType: string
  application: string
  fractureToughnessMPaM05: number
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

const si3Records: SiliconNitrideRecord[] = [
  { id: 'SI3-0001', batchNo: 'SI3-B2401', city: 'Bengaluru', manufacturer: 'DRDO DMRL', productType: 'Hot Pressed Si3N4 (HPSN)', application: 'Bearing Roller (BHEL Turbine)', fractureToughnessMPaM05: 7.2, maxTempCelsius: 1200, investmentCr: 245, status: 'Delivered', priority: 'Critical', origin: 'DRDO DMRL Hyderabad (TS)', destination: 'BHEL Hyderabad (TS)', shipDate: '2026-07-18', transitDays: 1, zone: 'South', remarks: 'HPSN silicon nitride bearing roller for 800MW steam turbine &#8594; 7.2 MPa&#8730;m fracture toughness HPSN &#8594; &#8377;245Cr for 18 tonnes HPSN blanks &#8594; BHEL manufacturing 42 gas turbines for NTPC &#8594; Si3N4 bearing life 5x M50 steel at 1200&#176;C &#8594; DRDO DMRL sole Indian HPSN producer &#8594; &#8377;18,500Cr Indian turbine Si3N4 demand' },
  { id: 'SI3-0002', batchNo: 'SI3-B2402', city: 'Hyderabad', manufacturer: 'MIDHANI', productType: 'Reaction Bonded Si3N4 (RBSN)', application: 'Diesel Engine Glow Plug (Cummins)', fractureToughnessMPaM05: 3.5, maxTempCelsius: 1100, investmentCr: 85, status: 'In Transit', priority: 'High', origin: 'MIDHANI Hyderabad (TS)', destination: 'Cummins India Pune (MH)', shipDate: '2026-07-22', transitDays: 2, zone: 'South', remarks: 'RBSN silicon nitride glow plug for heavy diesel engine &#8594; 3.5 MPa&#8730;m fracture toughness RBSN &#8594; &#8377;85Cr for 2.5 tonnes RBSN tubes &#8594; Cummins 500,000 diesel engines/year &#8594; RBSN glow plug heat-up 2s vs 8s metal &#8594; MIDHANI developing RBSN for automotive &#8594; &#8377;6,200Cr Indian automotive Si3N4 demand' },
  { id: 'SI3-0003', batchNo: 'SI3-B2403', city: 'Mumbai', manufacturer: 'Saint-Gobain India', productType: 'Sintered Reaction Bonded Si3N4 (SRBSN)', application: 'Cutting Tool Insert (Sandvik India)', fractureToughnessMPaM05: 6.8, maxTempCelsius: 1000, investmentCr: 128, status: 'Delivered', priority: 'High', origin: 'Saint-Gobain Bengaluru (KA)', destination: 'Sandvik India Pune (MH)', shipDate: '2026-07-19', transitDays: 2, zone: 'West', remarks: 'SRBSN Si3N4 cutting insert for nickel superalloy machining &#8594; 6.8 MPa&#8730;m fracture toughness SRBSN &#8594; &#8377;128Cr for 8 tonnes SRBSN insert blanks &#8594; Sandvik India 2 million inserts/year &#8594; Si3N4 tool life 3x WC-Co at Inconel cutting &#8594; Saint-Gobain India SRBSN plant 500 tonnes/year &#8594; &#8377;9,800Cr Indian tool Si3N4 demand' },
  { id: 'SI3-0004', batchNo: 'SI3-B2404', city: 'Pune', manufacturer: 'Bharat Forge', productType: 'Gas Pressure Sintered Si3N4 (GPSN)', application: 'Bearing Ball (SKF India)', fractureToughnessMPaM05: 7.8, maxTempCelsius: 1100, investmentCr: 195, status: 'Delayed', priority: 'High', origin: 'Bharat Forge Pune (MH)', destination: 'SKF India Pune (MH)', shipDate: '2026-07-12', transitDays: 0, zone: 'West', remarks: 'GPSN Si3N4 hybrid bearing ball for EV motor &#8594; 7.8 MPa&#8730;m fracture toughness GPSN highest &#8594; &#8377;195Cr for 12 tonnes GPSN balls &#8594; SKF India 4 million bearing sets/year &#8594; Si3N4 ball electrical insulation eliminates eddy current &#8594; Delayed 10 days due to GPSN furnace batch rework &#8594; &#8377;15,000Cr Indian bearing Si3N4 demand' },
  { id: 'SI3-0005', batchNo: 'SI3-B2405', city: 'Chennai', manufacturer: 'IGCAR Kalpakkam', productType: 'Sintered Si3N4 (SSN)', application: 'Nuclear Fuel Handling Tongs (BHAVINI)', fractureToughnessMPaM05: 5.5, maxTempCelsius: 800, investmentCr: 165, status: 'Processing', priority: 'Critical', origin: 'CGCRI Chennai (TN)', destination: 'BHAVINI Kalpakkam (TN)', shipDate: '2026-07-25', transitDays: 1, zone: 'South', remarks: 'SSN Si3N4 fuel handling tongs for PFBR hot cell &#8594; 5.5 MPa&#8730;m fracture toughness sintered Si3N4 &#8594; &#8377;165Cr for 4 tonnes SSN machined tongs &#8594; BHAVINI 500MW PFBR spent fuel handling &#8594; Si3N4 radiation resistance 100x stainless steel &#8594; CGCRI sole Indian SSN producer &#8594; &#8377;12,500Cr Indian nuclear Si3N4 demand' },
  { id: 'SI3-0006', batchNo: 'SI3-B2406', city: 'Noida', manufacturer: 'BEL', productType: 'Si3N4 Substrate (AlN-Si3N4)', application: 'LED Package Substrate (Samsung Noida)', fractureToughnessMPaM05: 4.2, maxTempCelsius: 600, investmentCr: 112, status: 'Delivered', priority: 'Medium', origin: 'BEL Bengaluru (KA)', destination: 'Samsung Noida (UP)', shipDate: '2026-07-17', transitDays: 2, zone: 'North', remarks: 'Si3N4-AlN composite substrate for high-power LED &#8594; 4.2 MPa&#8730;m thermal conductivity 180 W/mK &#8594; &#8377;112Cr for 5 tonnes substrate wafer stock &#8594; Samsung India 500 million LED packages/year &#8594; Si3N4 substrate CTE match 3ppm/&#176;C vs GaN 5.5ppm &#8594; BEL expanding Si3N4 substrate production &#8594; &#8377;8,500Cr Indian LED Si3N4 demand' },
  { id: 'SI3-0007', batchNo: 'SI3-B2407', city: 'Kolkata', manufacturer: 'Hindalco Novelis', productType: 'Si3N4 Foam Insulation', application: 'Aluminium Smelter Crucible (Hindalco)', fractureToughnessMPaM05: 2.8, maxTempCelsius: 1400, investmentCr: 78, status: 'In Transit', priority: 'Medium', origin: 'CGCRI Kolkata (WB)', destination: 'Hindalco Renukoot (UP)', shipDate: '2026-07-21', transitDays: 3, zone: 'East', remarks: 'Si3N4 foam insulation for aluminium smelter sidewall &#8594; 2.8 MPa&#8730;m foam density 0.6 g/cc &#8594; &#8377;78Cr for 85 tonnes Si3N4 foam panels &#8594; Hindalco 4.1 MMTPA aluminium capacity &#8594; Si3N4 foam thermal conductivity 0.08 W/mK &#8594; India aluminium smelter insulation market &#8377;5,800Cr &#8594; &#8377;5,800Cr Indian smelter Si3N4 demand' },
  { id: 'SI3-0008', batchNo: 'SI3-B2408', city: 'Ahmedabad', manufacturer: 'Reliance SBR', productType: 'Si3N4 Membrane (Porous)', application: 'Molten Metal Filter (RIL Jamnagar)', fractureToughnessMPaM05: 3.2, maxTempCelsius: 1550, investmentCr: 92, status: 'Delivered', priority: 'High', origin: 'CGCRI Ahmedabad (GJ)', destination: 'RIL Jamnagar (GJ)', shipDate: '2026-07-16', transitDays: 1, zone: 'West', remarks: 'Porous Si3N4 filter for molten aluminium degassing &#8594; 3.2 MPa&#8730;m pore size 10 microns 40% porosity &#8594; &#8377;92Cr for 12 tonnes porous filter tubes &#8594; RIL Jamnagar 1.24 million bpd largest refinery &#8594; Si3N4 filter removes 99% oxide inclusions &#8594; India 10 MMTPA aluminium casting &#8594; &#8377;7,200Cr Indian foundry Si3N4 demand' },
  { id: 'SI3-0009', batchNo: 'SI3-B2409', city: 'Jaipur', manufacturer: 'Rajasthan State Mines', productType: 'Si3N4 Milling Media (Grinding)', application: 'Mineral Grinding Circuits (UltraTech)', fractureToughnessMPaM05: 6.5, maxTempCelsius: 400, investmentCr: 58, status: 'Processing', priority: 'Medium', origin: 'RSM Processing Jaipur (RJ)', destination: 'UltraTech Rajasthan (RJ)', shipDate: '2026-07-24', transitDays: 1, zone: 'North', remarks: 'Si3N4 grinding media balls for cement mineral milling &#8594; 6.5 MPa&#8730;m wear rate 0.1mm/1000hr &#8594; &#8377;58Cr for 45 tonnes 10mm grinding media &#8594; India 380 Mt cement world 2nd largest &#8594; Si3N4 media wear 20x lower than alumina &#8594; India grinding media market &#8377;4,500Cr &#8594; &#8377;4,500Cr Indian grinding Si3N4 demand' },
  { id: 'SI3-0010', batchNo: 'SI3-B2410', city: 'Coimbatore', manufacturer: 'IIT Madras', productType: 'SiAlON (Si3N4-Al2O3)', application: 'Thermocouple Sheath (BHEL Trichy)', fractureToughnessMPaM05: 7.5, maxTempCelsius: 1350, investmentCr: 145, status: 'Delivered', priority: 'High', origin: 'IIT Madras (TN)', destination: 'BHEL Trichy (TN)', shipDate: '2026-07-18', transitDays: 1, zone: 'South', remarks: 'SiAlON (beta-Si3N4 solid solution) thermocouple sheath for gas turbine &#8594; 7.5 MPa&#8730;m SiAlON fracture toughness highest &#8594; &#8377;145Cr for 6 tonnes SiAlON sheath tubes &#8594; BHEL 42 gas turbines requiring 8,000 sheaths/year &#8594; SiAlON life 5x alumina at 1350&#176;C &#8594; IIT Madras developing SiAlON process &#8594; &#8377;11,000Cr Indian turbine SiAlON demand' },
  { id: 'SI3-0011', batchNo: 'SI3-B2411', city: 'Bhubaneswar', manufacturer: 'NALCO', productType: 'Si3N4 Bonded SiC (Composicast)', application: 'Kiln Furniture Refractory (Hindalco)', fractureToughnessMPaM05: 4.0, maxTempCelsius: 1200, investmentCr: 68, status: 'In Transit', priority: 'Medium', origin: 'CGCRI Bhubaneswar (OD)', destination: 'Hindalco Hirakud (OD)', shipDate: '2026-07-23', transitDays: 2, zone: 'East', remarks: 'Si3N4-bonded SiC kiln furniture for aluminium sintering &#8594; 4.0 MPa&#8730;m flexural strength 450MPa at 1200&#176;C &#8594; &#8377;68Cr for 35 tonnes Si3N4-SiC setter plates &#8594; Hindalco 12 smelters requiring continuous kiln furniture &#8594; Si3N4-SiC life 10x oxide-bonded SiC &#8594; India refractory market &#8377;42,000Cr &#8594; &#8377;5,200Cr Indian refractory Si3N4 demand' },
  { id: 'SI3-0012', batchNo: 'SI3-B2412', city: 'Guwahati', manufacturer: 'Oil India Ltd', productType: 'Si3N4 Radial Seal Ring', application: 'Subsea Wellhead (ONGC Mumbai Offshore)', fractureToughnessMPaM05: 5.8, maxTempCelsius: 350, investmentCr: 185, status: 'Delayed', priority: 'High', origin: 'CGCRI Guwahati (AS)', destination: 'ONGC Mumbai Offshore (MH)', shipDate: '2026-07-11', transitDays: 6, zone: 'East', remarks: 'Si3N4 radial seal ring for subsea wellhead HPHT service &#8594; 5.8 MPa&#8730;m wear resistance 100x carbon seal &#8594; &#8377;185Cr for 8 tonnes precision machined seal rings &#8594; ONGC 200 offshore wells requiring seal replacement &#8594; Si3N4 seal life 5 years vs 1 year carbon &#8594; Delayed 12 days due to monsoon offshore logistics &#8594; &#8377;14,500Cr Indian offshore Si3N4 demand' },
  { id: 'SI3-0013', batchNo: 'SI3-B2413', city: 'Gandhinagar', manufacturer: 'Gujarat Fluorochemicals', productType: 'Si3N4 Welding Nozzle', application: 'Semiconductor Wire Bonder (Tata Elxsi)', fractureToughnessMPaM05: 5.2, maxTempCelsius: 900, investmentCr: 225, status: 'Processing', priority: 'Critical', origin: 'CGCRI Bengaluru (KA)', destination: 'Tata Elxsi Bengaluru (KA)', shipDate: '2026-07-26', transitDays: 0, zone: 'West', remarks: 'Si3N4 welding nozzle for semiconductor wire bonder &#8594; 5.2 MPa&#8730;m electrical insulation 10&#8312; ohm-cm &#8594; &#8377;225Cr for 1.5 tonnes precision ceramic nozzles &#8594; India 120 semiconductor assembly lines &#8594; Si3N4 nozzle arc erosion resistance 100x alumina &#8594; India semiconductor Si3N4 market &#8377;16,000Cr &#8594; &#8377;16,000Cr Indian semiconductor Si3N4 demand' },
  { id: 'SI3-0014', batchNo: 'SI3-B2414', city: 'Lucknow', manufacturer: 'TASL', productType: 'Si3N4 Radome (RF Transparent)', application: 'Missile Seeker Dome (DRDO Astra)', fractureToughnessMPaM05: 4.8, maxTempCelsius: 800, investmentCr: 265, status: 'In Transit', priority: 'Critical', origin: 'DRDO DL Hyderabad (TS)', destination: 'BDL Hyderabad (TS)', shipDate: '2026-07-23', transitDays: 2, zone: 'North', remarks: 'Si3N4 radome for Astra Mk3 BVRAAM seeker &#8594; 4.8 MPa&#8730;m dielectric constant 8.0 at 10GHz &#8594; &#8377;265Cr for 3 tonnes precision formed radomes &#8594; DRDO Astra Mk3 150km BVR missile &#8594; Si3N4 radome rain erosion resistance 5x quartz &#8594; BDL producing 500 Astra/year &#8594; &#8377;20,500Cr Indian defence Si3N4 demand' },
]

const tabs = ['Dashboard', 'Registry', 'Analytics', 'Insights'] as const
type TabType = typeof tabs[number]

export default function SiliconNitrideLogisticsView() {
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
    return si3Records.filter(r => {
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

  const uniqueCities = useMemo(() => [...new Set(si3Records.map(r => r.city))].sort(), [])
  const uniqueManufacturers = useMemo(() => [...new Set(si3Records.map(r => r.manufacturer))].sort(), [])
  const uniqueStatuses = useMemo(() => [...new Set(si3Records.map(r => r.status))].sort(), [])
  const uniqueZones = useMemo(() => [...new Set(si3Records.map(r => r.zone))].sort(), [])

  const totalInvestment = useMemo(() => si3Records.reduce((s: number, r) => s + r.investmentCr, 0), [])
  const avgToughness = useMemo(() => (si3Records.reduce((s: number, r) => s + r.fractureToughnessMPaM05, 0) / si3Records.length).toFixed(1), [])
  const deliveredCount = useMemo(() => si3Records.filter(r => r.status === 'Delivered').length, [])
  const delayedCount = useMemo(() => si3Records.filter(r => r.status === 'Delayed').length, [])

  const cityInvestmentMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of si3Records) { map[r.city] = (map[r.city] || 0) + r.investmentCr }
    return map
  }, [])

  const productToughnessMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of si3Records) { map[r.productType] = (map[r.productType] || 0) + r.fractureToughnessMPaM05 }
    return map
  }, [])

  const statusCountMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of si3Records) { map[r.status] = (map[r.status] || 0) + 1 }
    return map
  }, [])

  const zoneInvestmentMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of si3Records) { map[r.zone] = (map[r.zone] || 0) + r.investmentCr }
    return map
  }, [])

  const maxCity = useMemo(() => {
    const entries = (Object.entries(cityInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1])
    return entries[0] || ['N/A', 0]
  }, [cityInvestmentMap])

  const maxToughness = useMemo(() => {
    const entries = (Object.entries(productToughnessMap) as [string, number][]).sort((a, b) => b[1] - a[1])
    return entries[0] || ['N/A', 0]
  }, [productToughnessMap])

  return (
    <div className="space-y-6">
      <PageHeader title="Silicon Nitride Logistics" description="Strategic silicon nitride ceramic supply chain tracking for turbine bearings, cutting tools, nuclear handling, LED substrates, missile radomes, EV motor bearings and semiconductor components" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-emerald-600 bg-emerald-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Total Investment</div><div className="text-2xl font-bold text-emerald-700">&#8377;{totalInvestment.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground mt-1">Across {si3Records.length} batches</div></CardContent></Card>
        <Card className="border-l-4 border-l-emerald-600 bg-emerald-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Avg Fracture Toughness</div><div className="text-2xl font-bold text-emerald-700">{avgToughness} MPa&#8730;m</div><div className="text-xs text-muted-foreground mt-1">Across all Si3N4 types</div></CardContent></Card>
        <Card className="border-l-4 border-l-emerald-600 bg-emerald-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Delivered</div><div className="text-2xl font-bold text-emerald-700">{deliveredCount}</div><div className="text-xs text-muted-foreground mt-1">{delayedCount} delayed</div></CardContent></Card>
        <Card className="border-l-4 border-l-emerald-600 bg-emerald-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Top City</div><div className="text-2xl font-bold text-emerald-700">{maxCity[0]}</div><div className="text-xs text-muted-foreground mt-1">&#8377;{maxCity[1].toLocaleString()} Cr invested</div></CardContent></Card>
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
          <button key={tab} className={`px-4 py-2 text-sm font-medium ${activeTab === tab ? 'border-b-2 border-emerald-600 text-emerald-700' : 'text-muted-foreground'}`} onClick={() => setActiveTab(tab)}>{tab}</button>
        ))}
      </div>

      {activeTab === 'Dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">Investment by City</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(cityInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([city, val]) => (<div key={city} className="flex items-center gap-2"><span className="text-xs w-24 truncate">{city}</span><div className="flex-1 bg-emerald-100 rounded-full h-3"><div className="bg-emerald-600 h-3 rounded-full" style={{ width: `${(val / maxCity[1]) * 100}%` }}></div></div><span className="text-xs font-medium w-20 text-right">&#8377;{val} Cr</span></div>))}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Fracture Toughness by Product Type</CardTitle></CardHeader><CardContent className="space-y-2">{si3Records.sort((a, b) => b.fractureToughnessMPaM05 - a.fractureToughnessMPaM05).slice(0, 8).map(r => (<div key={r.id} className="flex items-center gap-2"><span className="text-xs w-40 truncate">{r.productType.split('(')[0]}</span><div className="flex-1 bg-teal-100 rounded-full h-3"><div className="bg-teal-500 h-3 rounded-full" style={{ width: `${(r.fractureToughnessMPaM05 / 7.8) * 100}%` }}></div></div><span className="text-xs font-medium w-20 text-right">{r.fractureToughnessMPaM05}</span></div>))}</CardContent></Card>
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
              <thead><tr className="border-b"><th className="text-left p-2">Batch</th><th className="text-left p-2">City</th><th className="text-left p-2">Manufacturer</th><th className="text-left p-2">Product Type</th><th className="text-left p-2">Application</th><th className="text-left p-2">KIC</th><th className="text-left p-2">Max Temp</th><th className="text-left p-2">&#8377;Cr</th><th className="text-left p-2">Status</th></tr></thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id} className={`border-b ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}>
                    <td className="p-2 font-mono text-xs">{r.batchNo}</td>
                    <td className="p-2">{r.city}</td>
                    <td className="p-2">{r.manufacturer}</td>
                    <td className="p-2">{r.productType}</td>
                    <td className="p-2 max-w-[200px] truncate">{r.application}</td>
                    <td className="p-2">{r.fractureToughnessMPaM05}</td>
                    <td className="p-2">{r.maxTempCelsius}&#176;C</td>
                    <td className="p-2 font-medium">&#8377;{r.investmentCr}</td>
                    <td className="p-2"><Badge variant={r.status === 'Delivered' ? 'default' : r.status === 'Delayed' ? 'destructive' : 'secondary'}>{r.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card><CardHeader><CardTitle className="text-sm">Max Temperature by Product</CardTitle></CardHeader><CardContent className="space-y-2">{si3Records.sort((a, b) => b.maxTempCelsius - a.maxTempCelsius).slice(0, 8).map(r => (<div key={r.id} className="flex items-center gap-2"><span className="text-xs w-40 truncate">{r.productType.split('(')[0]}</span><div className="flex-1 bg-orange-100 rounded-full h-3"><div className="bg-orange-500 h-3 rounded-full" style={{ width: `${(r.maxTempCelsius / 1550) * 100}%` }}></div></div><span className="text-xs font-medium w-16 text-right">{r.maxTempCelsius}&#176;C</span></div>))}</CardContent></Card>
            <Card><CardHeader><CardTitle className="text-sm">Investment by Zone</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(zoneInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([zone, val]) => (<div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone}</span><div className="flex-1 bg-green-100 rounded-full h-3"><div className="bg-green-600 h-3 rounded-full" style={{ width: `${(val / maxCity[1]) * 100}%` }}></div></div><span className="text-xs font-medium w-20 text-right">&#8377;{val} Cr</span></div>))}</CardContent></Card>
          </div>
        </div>
      )}

      {activeTab === 'Analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">Status Distribution</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(statusCountMap) as [string, number][]).map(([status, count]) => (<div key={status} className="flex items-center gap-2"><span className="text-xs w-24">{status}</span><div className="flex-1 bg-gray-100 rounded-full h-3"><div className="bg-emerald-600 h-3 rounded-full" style={{ width: `${(count / si3Records.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Priority Breakdown</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const map: Record<string, number> = {}; for (const r of si3Records) { map[r.priority] = (map[r.priority] || 0) + 1 } const sorted = (Object.entries(map) as [string, number][]).sort((a, b) => b[1] - a[1]); return sorted.map(([pri, count]) => (<div key={pri} className="flex items-center gap-2"><span className="text-xs w-20">{pri}</span><div className="flex-1 bg-amber-100 rounded-full h-3"><div className="bg-amber-500 h-3 rounded-full" style={{ width: `${(count / si3Records.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))})()}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Shipment Volume by Zone</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const map: Record<string, number> = {}; for (const r of si3Records) { map[r.zone] = (map[r.zone] || 0) + 1 } const sorted = (Object.entries(map) as [string, number][]).sort((a, b) => b[1] - a[1]); return sorted.map(([zone, count]) => (<div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone}</span><div className="flex-1 bg-sky-100 rounded-full h-3"><div className="bg-sky-500 h-3 rounded-full" style={{ width: `${(count / si3Records.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))})()}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Toughness Range Distribution</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const ranges: Record<string, number> = { 'Below 4.0': 0, '4.0-6.0': 0, '6.0-7.5': 0, '7.5+': 0 }; for (const r of si3Records) { if (r.fractureToughnessMPaM05 >= 7.5) ranges['7.5+']++; else if (r.fractureToughnessMPaM05 >= 6.0) ranges['6.0-7.5']++; else if (r.fractureToughnessMPaM05 >= 4.0) ranges['4.0-6.0']++; else ranges['Below 4.0']++ } return (Object.entries(ranges) as [string, number][]).map(([range, count]) => (<div key={range} className="flex items-center gap-2"><span className="text-xs w-24">{range}</span><div className="flex-1 bg-lime-100 rounded-full h-3"><div className="bg-lime-500 h-3 rounded-full" style={{ width: `${(count / si3Records.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))})()}</CardContent></Card>
        </div>
      )}

      {activeTab === 'Insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-l-4 border-l-emerald-600"><CardHeader><CardTitle className="text-sm">Si3N4 Bearings: Turbine and EV Revolution</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>Silicon nitride (Si3N4) ceramic bearings are transforming both power generation and electric vehicles. In gas turbines, Si3N4 rollers operate at 1200&#176;C with 5x the service life of M50 steel bearings, eliminating the need for lubrication in the hot-section of BHEL&apos;s 800MW steam turbines. In EVs, Si3N4 hybrid bearing balls provide electrical insulation that eliminates eddy-current heating at 20,000+ RPM motor speeds, a critical advantage for Tata Motors, Mahindra and Ola Electric&apos;s high-performance EV powertrains. GPSN (gas-pressure sintered) Si3N4 achieves the highest fracture toughness of 7.8 MPa&#8730;m, while RBSN offers lower cost for non-critical glow plug applications. India&apos;s Si3N4 bearing market is projected at &#8377;15,000Cr by 2030.</p></CardContent></Card>
          <Card className="border-l-4 border-l-amber-500"><CardHeader><CardTitle className="text-sm">Si3N4 Cutting Tools: Inconel and Ti Machining</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>Silicon nitride cutting inserts (SRBSN grade) offer 3x tool life compared to WC-Co carbide when machining nickel superalloys (Inconel 718, 625) and titanium alloys (Ti-6Al-4V), critical for India&apos;s aerospace and defence manufacturing. Sandvik India and Iscar India consume 8 tonnes/year of SRBSN inserts for machining turbine discs at HAL, missile components at DRDO, and airframe forgings at Bharat Forge. The hot hardness of Si3N4 at 1000&#176;C matches WC-Co at room temperature, enabling 3x higher cutting speeds. Saint-Gobain India operates a 500 tonnes/year SRBSN plant in Bengaluru, while DRDO DMRL is developing next-generation SiAlON (Si3N4-Al2O3) inserts with 20% higher edge toughness.</p></CardContent></Card>
          <Card className="border-l-4 border-l-blue-500"><CardHeader><CardTitle className="text-sm">Nuclear and Defence: Radiation-Resistant Si3N4</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>Silicon nitride&apos;s radiation resistance (100x stainless steel) makes it ideal for nuclear fuel handling equipment in BHAVINI&apos;s PFBR and 8 planned fast breeder reactors. Si3N4 tongs, grippers and inspection tools operate in 100 dpa neutron fields without embrittlement, unlike steel which swells and loses ductility. In defence, Si3N4 radomes for DRDO&apos;s Astra Mk3 BVRAAM provide RF transparency (dielectric constant 8.0 at 10GHz) with 5x rain erosion resistance vs quartz, while Si3N4 welding nozzles for semiconductor wire bonders at Tata Elxsi offer 100x arc erosion resistance vs alumina. India&apos;s nuclear and defence Si3N4 demand is &#8377;33,000Cr, growing 15% annually.</p></CardContent></Card>
          <Card className="border-l-4 border-l-violet-500"><CardHeader><CardTitle className="text-sm">Si3N4 in Electronics, Refractories and Foundry</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>Beyond bearings and cutting tools, Si3N4 serves diverse industrial roles: LED package substrates (BEL-Samsung, thermal conductivity 180 W/mK with 3ppm/&#176;C CTE matching GaN), aluminium smelter insulation foam (Hindalco, 0.08 W/mK thermal conductivity), molten aluminium filtration (RIL, 99% oxide inclusion removal), kiln furniture for aluminium sintering (Si3N4-SiC, 10x oxide-bonded SiC life), grinding media for cement mineral processing (UltraTech, 20x lower wear than alumina), and subsea wellhead seal rings (ONGC, 100x carbon seal wear life). CGCRI (Central Glass and Ceramic Research Institute) is India&apos;s premier Si3N4 research centre, operating pilot plants in Kolkata, Chennai, Bhubaneswar, Guwahati and Bengaluru with combined capacity of 200 tonnes/year across all Si3N4 product types.</p></CardContent></Card>
        </div>
      )}
    </div>
  )
}
