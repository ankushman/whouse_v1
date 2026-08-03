'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { FlaskConical } from 'lucide-react'

interface PalladiumCatalystRecord {
  id: string
  batchNo: string
  city: string
  manufacturer: string
  catalystType: string
  application: string
  palladiumPercent: number
  surfaceAreaM2g: number
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

const palladiumRecords: PalladiumCatalystRecord[] = [
  { id: 'PDC-0001', batchNo: 'PDC-B2401', city: 'Gurugram', manufacturer: 'Johnson Matthey India', catalystType: 'Pd/C 5% (Activated Carbon)', application: 'Hydrogenation Reactor (IOCL Panipat)', palladiumPercent: 5, surfaceAreaM2g: 950, investmentCr: 185, status: 'Delivered', priority: 'Critical', origin: 'JM Mumbai (MH)', destination: 'IOCL Panipat Refinery (HR)', shipDate: '2026-07-18', transitDays: 1, zone: 'North', remarks: 'Pd/C 5% hydrogenation catalyst for refinery crude oil hydrotreating &#8594; 950 m2/g surface area on activated carbon support &#8594; &#8377;185Cr for 2.5 tonnes Pd/C &#8594; IOCL Panipat 15 MT refinery upgrading to BS-VI &#8594; Pd/C hydrogenation activity 85% conversion at 180&#176;C &#8594; India importing 80% Pd catalysts from UK and Germany &#8594; &#8377;12,500Cr Indian refinery Pd catalyst demand' },
  { id: 'PDC-0002', batchNo: 'PDC-B2402', city: 'Hyderabad', manufacturer: 'Hindustan Platinum Ltd', catalystType: 'Pd/Al2O3 1% (Pellet)', application: 'Automotive Catalytic Converter (Maruti Suzuki)', palladiumPercent: 1, surfaceAreaM2g: 150, investmentCr: 142, status: 'In Transit', priority: 'High', origin: 'HPL Hyderabad (TS)', destination: 'Maruti Suzuki Manesar (HR)', shipDate: '2026-07-22', transitDays: 2, zone: 'South', remarks: 'Pd/Al2O3 1% pellet for three-way catalytic converter &#8594; 150 m2/g gamma-alumina washcoat pellet &#8594; &#8377;142Cr for 8 tonnes Pd/Al2O3 pellets &#8594; Maruti producing 2 million vehicles/year BS-VI compliant &#8594; Pd-based TWC reduces CO/HC/NOx by 98% simultaneously &#8594; India 4th largest auto market demanding 350 tonnes Pd/year &#8594; &#8377;9,800Cr Indian automotive Pd market' },
  { id: 'PDC-0003', batchNo: 'PDC-B2403', city: 'Mumbai', manufacturer: 'Viney Chemicals', catalystType: 'PdCl2 (Anhydrous)', application: 'Wacker Oxidation Process (Reliance Jamnagar)', palladiumPercent: 60, surfaceAreaM2g: 0, investmentCr: 98, status: 'Delivered', priority: 'High', origin: 'Viney Mumbai (MH)', destination: 'RIL Jamnagar (GJ)', shipDate: '2026-07-19', transitDays: 3, zone: 'West', remarks: 'PdCl2 anhydrous for Wacker oxidation of ethylene to acetaldehyde &#8594; 60% Pd content in anhydrous salt form &#8594; &#8377;98Cr for 1.2 tonnes PdCl2 &#8594; RIL Jamnagar world largest refinery complex &#8594; Wacker process selectivity 95% acetaldehyde from ethylene &#8594; PdCl2 catalyst recycled 50+ times with CuCl2 co-catalyst &#8594; &#8377;6,200Cr Indian petrochemical Pd demand' },
  { id: 'PDC-0004', batchNo: 'PDC-B2404', city: 'Bengaluru', manufacturer: 'Dr. Reddys Laboratories', catalystType: 'Pd(OH)2/C 10% (Pearlman)', application: 'Pharmaceutical Hydrogenation (Dr. Reddys)', palladiumPercent: 10, surfaceAreaM2g: 800, investmentCr: 225, status: 'Delayed', priority: 'Critical', origin: 'Sigma Aldrich Bengaluru (KA)', destination: 'Dr. Reddys Hyderabad (TS)', shipDate: '2026-07-12', transitDays: 1, zone: 'South', remarks: 'Pd(OH)2/C 10% Pearlman catalyst for API nitro reduction &#8594; 800 m2/g carbon support with Pd(OH)2 &#8594; &#8377;225Cr for 3 tonnes Pearlman catalyst &#8594; Dr. Reddys producing 120 APIs with Pd-catalyzed steps &#8594; Pearlman catalyst 99.5% chemoselectivity for nitro group reduction &#8594; Delayed 10 days due to US FDA import documentation &#8594; &#8377;15,800Cr Indian pharma Pd catalyst demand' },
  { id: 'PDC-0005', batchNo: 'PDC-B2405', city: 'Pune', manufacturer: 'Bharat Forge Ltd', catalystType: 'Pd/Zeolite 0.5% (Emission)', application: 'Diesel Particulate Filter (Cummins India)', palladiumPercent: 0.5, surfaceAreaM2g: 450, investmentCr: 76, status: 'Processing', priority: 'High', origin: 'Cummins Pune (MH)', destination: 'Bharat Forge Pune (MH)', shipDate: '2026-07-25', transitDays: 1, zone: 'West', remarks: 'Pd/Zeolite 0.5% catalyst coated on DPF substrate &#8594; 450 m2/g zeolite Beta washcoat on cordierite DPF &#8594; &#8377;76Cr for 12 tonnes coated DPF elements &#8594; Cummins producing 200,000 diesel engines/year &#8594; Pd/Zeolite oxidizes CO/HC at 200&#176;C passive regeneration &#8594; India BS-VI emission norms mandating DPF on all diesel &#8594; &#8377;5,400Cr Indian diesel emission Pd demand' },
  { id: 'PDC-0006', batchNo: 'PDC-B2406', city: 'Chennai', manufacturer: 'Chennai Petroleum Corp', catalystType: 'Pd-Ag 40:60 (Membrane)', application: 'Hydrogen Purification (NTPC Vedanthangal)', palladiumPercent: 40, surfaceAreaM2g: 0, investmentCr: 310, status: 'Delivered', priority: 'Critical', origin: 'Pd-Ag Alliance Chennai (TN)', destination: 'NTPC Vedanthangal (TN)', shipDate: '2026-07-17', transitDays: 1, zone: 'South', remarks: 'Pd-Ag 40:60 permeable membrane for ultra-pure H2 separation &#8594; 40% Pd in Ag-Pd alloy membrane foil &#8594; &#8377;310Cr for 800 m2 membrane module &#8594; NTPC green hydrogen pilot at Vedanthangal 5MW &#8594; Pd-Ag membrane H2 permeability 99.9999% purity &#8594; India targeting 5 MT green H2 by 2030 National H2 Mission &#8594; &#8377;22,000Cr Indian H2 membrane Pd demand' },
  { id: 'PDC-0007', batchNo: 'PDC-B2407', city: 'Noida', manufacturer: 'Hindustan Aeronautics Ltd', catalystType: 'Pd/SiO2 2% (Aerospace)', application: 'Fuel Cell Stack (HAL Utility Aircraft)', palladiumPercent: 2, surfaceAreaM2g: 350, investmentCr: 265, status: 'In Transit', priority: 'Medium', origin: 'Pd Tech Noida (UP)', destination: 'HAL Bengaluru (KA)', shipDate: '2026-07-21', transitDays: 3, zone: 'North', remarks: 'Pd/SiO2 2% catalyst for PEM fuel cell electrode &#8594; 350 m2/g silica-supported Pd nanoparticles &#8594; &#8377;265Cr for 1.5 tonnes Pd/SiO2 catalyst &#8594; HAL developing fuel cell utility aircraft prototype &#8594; Pd/SiO2 ORR activity 0.85V vs RHE at 0.5A/cm2 &#8594; India fuel cell programme &#8377;8,500Cr by 2030 &#8594; &#8377;18,200Cr Indian fuel cell Pd demand' },
  { id: 'PDC-0008', batchNo: 'PDC-B2408', city: 'Ahmedabad', manufacturer: 'Gujarat Fluorochemicals Ltd', catalystType: 'Pd Black (Unsupported)', application: 'Cross-Coupling Reaction (Cadila Pharma)', palladiumPercent: 99, surfaceAreaM2g: 25, investmentCr: 168, status: 'Delivered', priority: 'High', origin: 'GFCL Ahmedabad (GJ)', destination: 'Cadila Ahmedabad (GJ)', shipDate: '2026-07-16', transitDays: 1, zone: 'West', remarks: 'Pd Black unsupported nanopowder for Suzuki-Miyaura coupling &#8594; 99% Pd nanopowder 25 m2/g surface area &#8594; &#8377;168Cr for 400 kg Pd Black &#8594; Cadila producing 85 C-N and C-C coupled APIs &#8594; Pd Black catalytic activity 200,000 TOH in Suzuki coupling &#8594; India 3rd largest generic pharma C-N coupling demand &#8594; &#8377;11,500Cr Indian pharma fine chemical Pd demand' },
  { id: 'PDC-0009', batchNo: 'PDC-B2409', city: 'Kolkata', manufacturer: 'Indian Oil Corp (R&amp;D)', catalystType: 'Pd-Re 5:1 (Reforming)', application: 'Naphtha Reforming (BPCL Kochi)', palladiumPercent: 83, surfaceAreaM2g: 280, investmentCr: 195, status: 'Processing', priority: 'High', origin: 'IOCL R&amp;D Faridabad (HR)', destination: 'BPCL Kochi (KL)', shipDate: '2026-07-24', transitDays: 3, zone: 'East', remarks: 'Pd-Re 5:1 bimetallic catalyst for continuous catalytic reforming &#8594; 83% Pd with 17% Re on chlorided alumina &#8594; &#8377;195Cr for 6 tonnes Pd-Re catalyst &#8594; BPCL Kochi 12 MT refinery CCR unit &#8594; Pd-Re reforming octane boost from 65 to 98 RON &#8594; Catalyst regeneration cycle 400 days continuous operation &#8594; &#8377;13,200Cr Indian reforming Pd demand' },
  { id: 'PDC-0010', batchNo: 'PDC-B2410', city: 'Jaipur', manufacturer: 'Rajasthan State Mines', catalystType: 'Pd/TiO2 0.3% (Photocatalytic)', application: 'Water Treatment (PHED Jaipur)', palladiumPercent: 0.3, surfaceAreaM2g: 50, investmentCr: 45, status: 'Delivered', priority: 'Low', origin: 'RSM Jaipur (RJ)', destination: 'PHED Water Plant Jaipur (RJ)', shipDate: '2026-07-18', transitDays: 1, zone: 'North', remarks: 'Pd/TiO2 0.3% photocatalyst for drinking water purification &#8594; 50 m2/g TiO2 anatase support with Pd nanoparticles &#8594; &#8377;45Cr for 5 tonnes Pd/TiO2 coated media &#8594; PHED Jaipur 500 MLD water treatment &#8594; Pd/TiO2 degrades 99% organic contaminants under UV &#8594; India 600 cities need advanced water treatment upgrade &#8594; &#8377;3,200Cr Indian water treatment Pd demand' },
  { id: 'PDC-0011', batchNo: 'PDC-B2411', city: 'Coimbatore', manufacturer: 'IIT Madras', catalystType: 'Pd/C 10% (Transfer)', application: 'Fine Chemical Synthesis (Tamil Nadu Pharma)', palladiumPercent: 10, surfaceAreaM2g: 1200, investmentCr: 52, status: 'In Transit', priority: 'Medium', origin: 'IIT Madras (TN)', destination: 'TN Pharma Cluster Chennai (TN)', shipDate: '2026-07-23', transitDays: 1, zone: 'South', remarks: 'Pd/C 10% for transfer hydrogenation fine chemical synthesis &#8594; 1200 m2/g high-surface-area carbon Pd/C &#8594; &#8377;52Cr for 800 kg Pd/C 10% &#8594; Tamil Nadu pharma cluster 350 companies &#8594; Transfer H2 from ammonium formate 97% yield &#8594; IIT Madras developing recyclable Pd/C flow reactor system &#8594; &#8377;3,800Cr Indian transfer H2 Pd demand' },
  { id: 'PDC-0012', batchNo: 'PDC-B2412', city: 'Guwahati', manufacturer: 'Oil India Ltd', catalystType: 'Pd/Sn 3:1 (LNG)', application: 'Dehydrogenation Unit (OIL Duliajan)', palladiumPercent: 75, surfaceAreaM2g: 180, investmentCr: 128, status: 'Delayed', priority: 'High', origin: 'OIL Duliajan (AS)', destination: 'OIL Bongaigaon (AS)', shipDate: '2026-07-11', transitDays: 2, zone: 'East', remarks: 'Pd/Sn 3:1 alloy for propane dehydrogenation to propylene &#8594; 75% Pd with 25% Sn on alumina support &#8594; &#8377;128Cr for 3 tonnes Pd-Sn catalyst &#8594; OIL Duliajan crude processing expansion &#8594; Pd-Sn PDH selectivity 85% propylene at 550&#176;C &#8594; Delayed 12 days due to monsoon road flooding Brahmaputra &#8594; &#8377;8,500Cr Indian dehydrogenation Pd demand' },
  { id: 'PDC-0013', batchNo: 'PDC-B2413', city: 'Bhubaneswar', manufacturer: 'NALCO', catalystType: 'Pd/Ni 1:10 (Alkylation)', application: 'Etherification Reactor (NALCO Smelter)', palladiumPercent: 9, surfaceAreaM2g: 220, investmentCr: 88, status: 'Processing', priority: 'Medium', origin: 'NALCO Angul (OD)', destination: 'NALCO Captive Plant Angul (OD)', shipDate: '2026-07-26', transitDays: 0, zone: 'East', remarks: 'Pd/Ni 1:10 bimetallic for MTBE etherification catalyst &#8594; 9% Pd promoted Ni on alumina support &#8594; &#8377;88Cr for 4 tonnes Pd-Ni catalyst &#8594; NALCO captive refinery for alumina smelter &#8594; Pd-Ni etherification conversion 98% at 80&#176;C &#8594; India 3rd largest alumina producer NALCO 2.1 MT/year &#8594; &#8377;5,800Cr Indian alkylation Pd demand' },
  { id: 'PDC-0014', batchNo: 'PDC-B2414', city: 'Lucknow', manufacturer: 'TASL', catalystType: 'Pd/C 3% (Dechlorination)', application: 'Groundwater Remediation (UP Jal Nigam)', palladiumPercent: 3, surfaceAreaM2g: 900, investmentCr: 65, status: 'Delivered', priority: 'High', origin: 'TASL Lucknow (UP)', destination: 'UPJN Lucknow (UP)', shipDate: '2026-07-23', transitDays: 1, zone: 'North', remarks: 'Pd/C 3% catalyst for groundwater dechlorination &#8594; 900 m2/g carbon-supported Pd for TCE/PCE degradation &#8594; &#8377;65Cr for 1.5 tonnes Pd/C 3% &#8594; UP Jal Nigam remediating 200 contaminated sites &#8594; Pd/C hydrodechlorination 99% TCE removal at 20&#176;C &#8594; India 35 states reporting groundwater chlorinated solvent contamination &#8594; &#8377;4,200Cr Indian remediation Pd demand' },
]

const tabs = ['Dashboard', 'Registry', 'Analytics', 'Insights'] as const
type TabType = typeof tabs[number]

export default function PalladiumCatalystLogisticsView() {
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
    return palladiumRecords.filter(r => {
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

  const uniqueCities = useMemo(() => [...new Set(palladiumRecords.map(r => r.city))].sort(), [])
  const uniqueManufacturers = useMemo(() => [...new Set(palladiumRecords.map(r => r.manufacturer))].sort(), [])
  const uniqueStatuses = useMemo(() => [...new Set(palladiumRecords.map(r => r.status))].sort(), [])
  const uniqueZones = useMemo(() => [...new Set(palladiumRecords.map(r => r.zone))].sort(), [])

  const totalInvestment = useMemo(() => palladiumRecords.reduce((s: number, r) => s + r.investmentCr, 0), [])
  const avgSurfaceArea = useMemo(() => Math.round(palladiumRecords.reduce((s: number, r) => s + r.surfaceAreaM2g, 0) / palladiumRecords.length), [])
  const deliveredCount = useMemo(() => palladiumRecords.filter(r => r.status === 'Delivered').length, [])
  const delayedCount = useMemo(() => palladiumRecords.filter(r => r.status === 'Delayed').length, [])

  const cityInvestmentMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of palladiumRecords) { map[r.city] = (map[r.city] || 0) + r.investmentCr }
    return map
  }, [])

  const catalystSurfaceMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of palladiumRecords) { map[r.catalystType] = (map[r.catalystType] || 0) + r.surfaceAreaM2g }
    return map
  }, [])

  const statusCountMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of palladiumRecords) { map[r.status] = (map[r.status] || 0) + 1 }
    return map
  }, [])

  const zoneInvestmentMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of palladiumRecords) { map[r.zone] = (map[r.zone] || 0) + r.investmentCr }
    return map
  }, [])

  const maxCity = useMemo(() => {
    const entries = (Object.entries(cityInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1])
    return entries[0] || ['N/A', 0]
  }, [cityInvestmentMap])

  const maxSurfaceCatalyst = useMemo(() => {
    const entries = (Object.entries(catalystSurfaceMap) as [string, number][]).sort((a, b) => b[1] - a[1])
    return entries[0] || ['N/A', 0]
  }, [catalystSurfaceMap])

  return (
    <div className="space-y-6">
      <PageHeader title="Palladium Catalyst Logistics" description="Palladium catalyst supply chain for automotive converters, pharmaceutical hydrogenation, hydrogen purification, fuel cells, refinery reforming and groundwater remediation" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-purple-700 bg-purple-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Total Investment</div><div className="text-2xl font-bold text-purple-800">&#8377;{totalInvestment.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground mt-1">Across {palladiumRecords.length} batches</div></CardContent></Card>
        <Card className="border-l-4 border-l-purple-700 bg-purple-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Avg Surface Area</div><div className="text-2xl font-bold text-purple-800">{avgSurfaceArea.toLocaleString()} m2/g</div><div className="text-xs text-muted-foreground mt-1">Catalyst support area</div></CardContent></Card>
        <Card className="border-l-4 border-l-purple-700 bg-purple-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Delivered</div><div className="text-2xl font-bold text-purple-800">{deliveredCount}</div><div className="text-xs text-muted-foreground mt-1">{delayedCount} delayed</div></CardContent></Card>
        <Card className="border-l-4 border-l-purple-700 bg-purple-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Top City</div><div className="text-2xl font-bold text-purple-800">{maxCity[0]}</div><div className="text-xs text-muted-foreground mt-1">&#8377;{maxCity[1].toLocaleString()} Cr invested</div></CardContent></Card>
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
          <button key={tab} className={`px-4 py-2 text-sm font-medium ${activeTab === tab ? 'border-b-2 border-purple-700 text-purple-800' : 'text-muted-foreground'}`} onClick={() => setActiveTab(tab)}>{tab}</button>
        ))}
      </div>

      {activeTab === 'Dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">Investment by City</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(cityInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([city, val]) => (<div key={city} className="flex items-center gap-2"><span className="text-xs w-24 truncate">{city}</span><div className="flex-1 bg-purple-100 rounded-full h-3"><div className="bg-purple-700 h-3 rounded-full" style={{ width: `${(val / maxCity[1]) * 100}%` }}></div></div><span className="text-xs font-medium w-20 text-right">&#8377;{val} Cr</span></div>))}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Surface Area by Catalyst Type</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(catalystSurfaceMap) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([cat, area]) => (<div key={cat} className="flex items-center gap-2"><span className="text-xs w-36 truncate">{cat}</span><div className="flex-1 bg-indigo-100 rounded-full h-3"><div className="bg-indigo-500 h-3 rounded-full" style={{ width: `${(area / maxSurfaceCatalyst[1]) * 100}%` }}></div></div><span className="text-xs font-medium w-20 text-right">{area} m2/g</span></div>))}</CardContent></Card>
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
              <thead><tr className="border-b"><th className="text-left p-2">Batch</th><th className="text-left p-2">City</th><th className="text-left p-2">Manufacturer</th><th className="text-left p-2">Catalyst Type</th><th className="text-left p-2">Application</th><th className="text-left p-2">Pd%</th><th className="text-left p-2">Area</th><th className="text-left p-2">&#8377;Cr</th><th className="text-left p-2">Status</th></tr></thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id} className={`border-b ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}>
                    <td className="p-2 font-mono text-xs">{r.batchNo}</td>
                    <td className="p-2">{r.city}</td>
                    <td className="p-2">{r.manufacturer}</td>
                    <td className="p-2">{r.catalystType}</td>
                    <td className="p-2 max-w-[200px] truncate">{r.application}</td>
                    <td className="p-2">{r.palladiumPercent}%</td>
                    <td className="p-2">{r.surfaceAreaM2g}</td>
                    <td className="p-2 font-medium">&#8377;{r.investmentCr}</td>
                    <td className="p-2"><Badge variant={r.status === 'Delivered' ? 'default' : r.status === 'Delayed' ? 'destructive' : 'secondary'}>{r.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card><CardHeader><CardTitle className="text-sm">Pd Loading by Catalyst</CardTitle></CardHeader><CardContent className="space-y-2">{palladiumRecords.slice(0, 8).map(r => (<div key={r.id} className="flex items-center gap-2"><span className="text-xs w-36 truncate">{r.catalystType}</span><div className="flex-1 bg-fuchsia-100 rounded-full h-3"><div className="bg-fuchsia-500 h-3 rounded-full" style={{ width: `${Math.min((r.palladiumPercent / 99) * 100, 100)}%` }}></div></div><span className="text-xs font-medium w-12 text-right">{r.palladiumPercent}%</span></div>))}</CardContent></Card>
            <Card><CardHeader><CardTitle className="text-sm">Investment by Zone</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(zoneInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([zone, val]) => (<div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone}</span><div className="flex-1 bg-violet-100 rounded-full h-3"><div className="bg-violet-600 h-3 rounded-full" style={{ width: `${(val / maxCity[1]) * 100}%` }}></div></div><span className="text-xs font-medium w-20 text-right">&#8377;{val} Cr</span></div>))}</CardContent></Card>
          </div>
        </div>
      )}

      {activeTab === 'Analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">Status Distribution</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(statusCountMap) as [string, number][]).map(([status, count]) => (<div key={status} className="flex items-center gap-2"><span className="text-xs w-24">{status}</span><div className="flex-1 bg-gray-100 rounded-full h-3"><div className="bg-purple-700 h-3 rounded-full" style={{ width: `${(count / palladiumRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Priority Breakdown</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const map: Record<string, number> = {}; for (const r of palladiumRecords) { map[r.priority] = (map[r.priority] || 0) + 1 } const sorted = (Object.entries(map) as [string, number][]).sort((a, b) => b[1] - a[1]); return sorted.map(([pri, count]) => (<div key={pri} className="flex items-center gap-2"><span className="text-xs w-20">{pri}</span><div className="flex-1 bg-red-100 rounded-full h-3"><div className="bg-red-500 h-3 rounded-full" style={{ width: `${(count / palladiumRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))})()}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Shipment Volume by Zone</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const map: Record<string, number> = {}; for (const r of palladiumRecords) { map[r.zone] = (map[r.zone] || 0) + 1 } const sorted = (Object.entries(map) as [string, number][]).sort((a, b) => b[1] - a[1]); return sorted.map(([zone, count]) => (<div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone}</span><div className="flex-1 bg-teal-100 rounded-full h-3"><div className="bg-teal-500 h-3 rounded-full" style={{ width: `${(count / palladiumRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))})()}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Pd Loading Range Distribution</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const ranges: Record<string, number> = { 'Below 1% (Trace)': 0, '1-10% (Supported)': 0, '10-50% (Loaded)': 0, '50%+ (Bulk/Metallic)': 0 }; for (const r of palladiumRecords) { if (r.palladiumPercent >= 50) ranges['50%+ (Bulk/Metallic)']++; else if (r.palladiumPercent >= 10) ranges['10-50% (Loaded)']++; else if (r.palladiumPercent >= 1) ranges['1-10% (Supported)']++; else ranges['Below 1% (Trace)']++ } return (Object.entries(ranges) as [string, number][]).map(([range, count]) => (<div key={range} className="flex items-center gap-2"><span className="text-xs w-32">{range}</span><div className="flex-1 bg-indigo-100 rounded-full h-3"><div className="bg-indigo-500 h-3 rounded-full" style={{ width: `${(count / palladiumRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))})()}</CardContent></Card>
        </div>
      )}

      {activeTab === 'Insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-l-4 border-l-purple-700"><CardHeader><CardTitle className="text-sm">Automotive Catalytic Converter: India 4th Largest Market</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>India is the world&apos;s 4th largest automobile market producing 28 million vehicles/year, each BS-VI compliant vehicle requiring a three-way catalytic converter with 2-5g of palladium. Maruti Suzuki, Hyundai India, Tata Motors and Mahindra collectively consume 350 tonnes of Pd annually for catalytic converters. Pd/Al2O3 1% pellet catalyst reduces CO, HC and NOx by 98% simultaneously through oxidation and reduction reactions. India imports 80% of its automotive Pd catalysts from Johnson Matthey (UK), BASF (Germany) and Umicore (Belgium), with Hindustan Platinum Ltd in Hyderabad as the sole domestic manufacturer at 20 tonnes/year capacity, targeting 100 tonnes by 2030.</p></CardContent></Card>
          <Card className="border-l-4 border-l-violet-500"><CardHeader><CardTitle className="text-sm">Hydrogen Economy: Pd Membranes and Fuel Cells</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>India&apos;s National Green Hydrogen Mission targets 5 million tonnes green H2 production by 2030, creating massive demand for Pd-Ag permeable membranes achieving 99.9999% hydrogen purity. NTPC, NTPC Green, Reliance and Adani are building pilot electrolyzer plants where Pd-Ag 40:60 alloy membrane modules separate ultra-pure hydrogen from steam reformer output. Simultaneously, HAL and DRDO are developing PEM fuel cells for utility aircraft and UAV applications using Pd/SiO2 2% catalyst with 0.85V ORR activity. India&apos;s combined H2 membrane and fuel cell Pd demand is projected at &#8377;22,000Cr by 2030, with IOCL R&amp;D leading membrane development.</p></CardContent></Card>
          <Card className="border-l-4 border-l-emerald-500"><CardHeader><CardTitle className="text-sm">Pharmaceutical Pd Catalysts: C-N and C-C Cross-Coupling</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>India is the world&apos;s 3rd largest pharmaceutical manufacturer by volume, with Dr. Reddys, Sun Pharma, Cipla, Cadila and Lupin producing over 2,000 APIs where 25% require Pd-catalyzed steps. Suzuki-Miyaura C-C coupling, Buchwald-Hartwig C-N amination and nitro group hydrogenation are the dominant Pd-catalyzed reactions in Indian pharma. Pd Black unsupported nanopowder achieves 200,000 TOH in Suzuki coupling while Pd(OH)2/C Pearlman catalyst provides 99.5% chemoselectivity for nitro reduction. India&apos;s pharmaceutical Pd catalyst market is &#8377;15,800Cr, with Pd recovery and recycling reaching 85% efficiency through aqueous extraction and re-precipitation.</p></CardContent></Card>
          <Card className="border-l-4 border-l-blue-500"><CardHeader><CardTitle className="text-sm">Environmental Remediation: Groundwater and Emissions</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>Palladium catalysts play an expanding role in India&apos;s environmental sector for groundwater dechlorination and diesel emission control. Pd/C 3% catalyst removes 99% of TCE and PCE from contaminated groundwater through hydrodechlorination at ambient temperature, critical for 200+ sites across 35 Indian states. For diesel emissions, Pd/Zeolite 0.5% coated on diesel particulate filters oxidizes CO and HC at 200&#176;C for passive DPF regeneration, mandated by BS-VI norms for all diesel engines. India&apos;s environmental Pd demand is &#8377;9,600Cr and growing 22% annually with NGT directives for contaminated site remediation and stricter emission norms.</p></CardContent></Card>
        </div>
      )}
    </div>
  )
}
