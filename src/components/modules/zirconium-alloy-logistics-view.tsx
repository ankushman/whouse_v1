'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { Shield } from 'lucide-react'

interface ZirconiumAlloyRecord {
  id: string
  batchNo: string
  city: string
  manufacturer: string
  alloyGrade: string
  application: string
  zirconiumPercent: number
  corrosionRateMpy: number
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

const zirconiumRecords: ZirconiumAlloyRecord[] = [
  { id: 'ZRA-0001', batchNo: 'ZRA-B2401', city: 'Mumbai', manufacturer: 'Nuclear Fuel Complex (NFC)', alloyGrade: 'Zircaloy-2 (Zr-1.5Sn-0.1Fe)', application: 'PHWR Fuel Clad (NPCIL Tarapur)', zirconiumPercent: 98, corrosionRateMpy: 2, investmentCr: 285, status: 'Delivered', priority: 'Critical', origin: 'NFC Hyderabad (TG)', destination: 'NPCIL Tarapur (MH)', shipDate: '2026-07-18', transitDays: 2, zone: 'South', remarks: 'Zircaloy-2 fuel cladding tube for NPCIL TAPS-3 PHWR 540MW &#8594; 98% Zr 1.5Sn 0.1Fe &#8594; &#8377;285Cr for 60 tonnes seamless tube &#8594; India 22 nuclear reactors 7,500 MW &#8594; 2 mpy corrosion in 300&#176;C D2O &#8594; India &#8377;12,500Cr Zr alloy nuclear market &#8594; NFC 100% India nuclear Zr production &#8594; 12m long fuel bundle 37 elements' },
  { id: 'ZRA-0002', batchNo: 'ZRA-B2402', city: 'Hyderabad', manufacturer: 'MIDHANI', alloyGrade: 'Zr-2.5Nb (Zr-2.5%Nb)', application: 'PHWR Pressure Tube (NPCIL)', zirconiumPercent: 97.5, corrosionRateMpy: 1, investmentCr: 320, status: 'Delivered', priority: 'Critical', origin: 'MIDHANI Hyderabad (TG)', destination: 'NPCIL Kakrapar (GJ)', shipDate: '2026-07-20', transitDays: 2, zone: 'South', remarks: 'Zr-2.5Nb pressure tube for NPCIL KAPP-3 700MW PHWR &#8594; 97.5% Zr 2.5% Nb &#8594; &#8377;320Cr for 85 tonnes extruded tube &#8594; 6.35m long 117mm OD 4mm wall &#8594; 1 mpy corrosion 300&#176;C 10 MPa D2O &#8594; India &#8377;15,000Cr pressure tube market &#8594; NPCIL 10 PHWRs under construction &#8594; Creep strength 80 MPa at 300&#176;C' },
  { id: 'ZRA-0003', batchNo: 'ZRA-B2403', city: 'Bengaluru', manufacturer: 'DRDO DMRL', alloyGrade: 'Zr-Cu (Zr-15Cu)', application: 'Glass Sealing (Bharat Electronics)', zirconiumPercent: 85, corrosionRateMpy: 5, investmentCr: 42, status: 'Delivered', priority: 'Medium', origin: 'DMRL Bengaluru (KA)', destination: 'BEL Bengaluru (KA)', shipDate: '2026-07-15', transitDays: 1, zone: 'South', remarks: 'Zr-15Cu getter alloy for BEL klystron vacuum tube sealing &#8594; 85% Zr 15% Cu &#8594; &#8377;42Cr for 2 tonnes ribbon &#8594; BEL 500k klystrons/year &#8594; 5 mpy corrosion at 400&#176;C getter activation &#8594; India &#8377;1,800Cr vacuum alloy market &#8594; BEL &#8377;18,000Cr defence electronics &#8594; Zr-Cu absorbs O2 H2 N2 CO outgassing' },
  { id: 'ZRA-0004', batchNo: 'ZRA-B2404', city: 'Pune', manufacturer: 'Bharat Forge', alloyGrade: 'Zr-702 (Commercial Pure Zr)', application: 'Chemical Reactor (Deepak Fertiliser)', zirconiumPercent: 99.2, corrosionRateMpy: 0.5, investmentCr: 165, status: 'Delivered', priority: 'High', origin: 'Bharat Forge Pune (MH)', destination: 'Deepak Fertiliser Navi Mumbai (MH)', shipDate: '2026-07-22', transitDays: 1, zone: 'West', remarks: 'Zr-702 commercial pure for Deepak Fertiliser nitric acid reactor &#8594; 99.2% Zr Hf &#8594; &#8377;165Cr for 25 tonnes plate &#8594; India &#8377;6,200Cr chemical Zr market &#8594; 0.5 mpy in 65% HNO3 at 200&#176;C &#8594; India 200 chemical reactors using Zr &#8594; Zr cost 5x Ti but 50x longer life in HNO3 &#8594; Deepak 3.2 MMTPA fertiliser capacity' },
  { id: 'ZRA-0005', batchNo: 'ZRA-B2405', city: 'Chennai', manufacturer: 'IGCAR Kalpakkam', alloyGrade: 'Zircaloy-4 (Zr-1.5Sn-0.2Fe-0.1Cr)', application: 'FBTR Fuel Cladding (IGCAR)', zirconiumPercent: 97.8, corrosionRateMpy: 3, investmentCr: 195, status: 'Delivered', priority: 'Critical', origin: 'IGCAR Kalpakkam (TN)', destination: 'IGCAR FBTR Site (TN)', shipDate: '2026-07-19', transitDays: 1, zone: 'South', remarks: 'Zircaloy-4 clad for FBTR fast breeder mixed oxide fuel &#8594; 97.8% Zr 1.5Sn 0.2Fe 0.1Cr &#8594; &#8377;195Cr for 15 tonnes tube &#8594; 500&#176;C NaK coolant service &#8594; 3 mpy corrosion in liquid sodium &#8594; India &#8377;8,500Cr fast reactor Zr market &#8594; PFBR 500MW under construction &#8594; Zr-4 has lower H pickup than Zr-2' },
  { id: 'ZRA-0006', batchNo: 'ZRA-B2406', city: 'Noida', manufacturer: 'Bhabha Atomic Research Centre', alloyGrade: 'Zr-Nb (Zr-1%Nb)', application: 'Structural Spacer (NPCIL)', zirconiumPercent: 99, corrosionRateMpy: 2, investmentCr: 88, status: 'Delivered', priority: 'High', origin: 'BARC Trombay (MH)', destination: 'NPCIL Rawatbhata (RJ)', shipDate: '2026-07-16', transitDays: 3, zone: 'North', remarks: 'Zr-1%Nb structural spacer grid for NPCIL PHWR fuel bundle &#8594; 99% Zr 1% Nb &#8594; &#8377;88Cr for 12 tonnes sheet stamping &#8594; 6 spacer grids per fuel bundle 37 elements &#8594; 2 mpy corrosion 300&#176;C D2O &#8594; India &#8377;3,800Cr spacer grid market &#8594; BARC developed Zr-Nb for better creep resistance &#8594; Grid maintains 3mm fuel pin pitch' },
  { id: 'ZRA-0007', batchNo: 'ZRA-B2407', city: 'Kolkata', manufacturer: 'SAIL Durgapur', alloyGrade: 'Zr-Ti (Zr-50Ti)', application: 'Marine Condenser (GRSE)', zirconiumPercent: 50, corrosionRateMpy: 4, investmentCr: 75, status: 'Delivered', priority: 'Medium', origin: 'SAIL Durgapur (WB)', destination: 'GRSE Kolkata (WB)', shipDate: '2026-07-21', transitDays: 1, zone: 'East', remarks: 'Zr-50Ti alloy tube sheet for GRSE warship condenser &#8594; 50% Zr 50% Ti &#8594; &#8377;75Cr for 8 tonnes plate &#8594; 4 mpy seawater service at 120&#176;C &#8594; India &#8377;2,500Cr naval Zr-Ti market &#8594; GRSE building 12 frigates for Navy &#8594; Zr-Ti superior to Cu-Ni in chlorinated seawater &#8594; Weight saving 30% vs Cu-Ni 90/10' },
  { id: 'ZRA-0008', batchNo: 'ZRA-B2408', city: 'Ahmedabad', manufacturer: 'Gujarat Fluorochemicals', alloyGrade: 'ZrO2 Ceramic (YSZ)', application: 'Thermal Barrier Coating (BEL)', zirconiumPercent: 67, corrosionRateMpy: 0, investmentCr: 108, status: 'Delivered', priority: 'High', origin: 'GFCL Vadodara (GJ)', destination: 'BEL Bengaluru (KA)', shipDate: '2026-07-17', transitDays: 2, zone: 'West', remarks: 'Yttria-stabilized ZrO2 thermal barrier coating for BEL AESA radar &#8594; 67% Zr as ZrO2 &#8594; &#8377;108Cr for 5 tonnes YSZ powder &#8594; 1,200&#176;C coating surface temp &#8594; India &#8377;4,200Cr TBC market &#8594; 7-8YSZ industry standard composition &#8594; APS plasma spray 200 micron coating &#8594; Thermal conductivity 2.0 W/mK vs metal 20 W/mK' },
  { id: 'ZRA-0009', batchNo: 'ZRA-B2409', city: 'Jaipur', manufacturer: 'Rajasthan Nuclear Materials', alloyGrade: 'Zircaloy-2 (Zr-1.5Sn)', application: 'AHWR Fuel Clad (BARC)', zirconiumPercent: 98, corrosionRateMpy: 2, investmentCr: 145, status: 'Delivered', priority: 'Critical', origin: 'RNM Jaipur (RJ)', destination: 'BARC Trombay (MH)', shipDate: '2026-07-23', transitDays: 3, zone: 'North', remarks: 'Zircaloy-2 for BARC Advanced Heavy Water Reactor (AHWR) prototype &#8594; 98% Zr 1.5Sn &#8594; &#8377;145Cr for 20 tonnes tube &#8594; 300&#176;C coolant 12 MPa &#8594; India &#8377;5,200Cr AHWR Zr programme &#8594; AHWR 300MW thorium-based &#8594; BARC designed 9-year fuel burnup target &#8594; 37 fuel elements per bundle' },
  { id: 'ZRA-0010', batchNo: 'ZRA-B2410', city: 'Coimbatore', manufacturer: 'Coimbatore Zirconium Industries', alloyGrade: 'Zr-Sn (Zr-2Sn)', application: 'Dental Implant Abutment (Dentsply)', zirconiumPercent: 98, corrosionRateMpy: 1, investmentCr: 62, status: 'Delivered', priority: 'Medium', origin: 'CZI Coimbatore (TN)', destination: 'Dentsply Mumbai (MH)', shipDate: '2026-07-14', transitDays: 2, zone: 'South', remarks: 'Zr-2Sn dental implant abutment for osseointegration &#8594; 98% Zr 2% Sn &#8594; &#8377;62Cr for 200,000 abutments &#8594; India 25 million dental procedures/year &#8594; 1 mpy in saliva 37&#176;C &#8594; India &#8377;2,800Cr dental Zr market &#8594; Dentsply 30% India dental &#8594; Zr abutment tooth-coloured vs Ti grey metal' },
  { id: 'ZRA-0011', batchNo: 'ZRA-B2411', city: 'Bhubaneswar', manufacturer: 'IREL Chavara', alloyGrade: 'ZrSiO4 (Zircon Sand)', application: 'Foundry Facing (SAIL)', zirconiumPercent: 33, corrosionRateMpy: 0, investmentCr: 35, status: 'Delivered', priority: 'Medium', origin: 'IREL Chavara (KL)', destination: 'SAIL Rourkela (OD)', shipDate: '2026-07-25', transitDays: 3, zone: 'East', remarks: 'Zircon sand ZrSiO4 facing for SAIL steel investment casting &#8594; 33% Zr as ZrSiO4 &#8594; &#8377;35Cr for 5,000 tonnes zircon sand &#8594; India 140 MT steel 800 foundries &#8594; 2,200&#176;C refractoriness &#8594; India &#8377;1,500Cr foundry zircon market &#8594; IREL 70% India zircon sand &#8594; Chavara 2.5 MT zircon reserve' },
  { id: 'ZRA-0012', batchNo: 'ZRA-B2412', city: 'Guwahati', manufacturer: 'Assam Nuclear Materials', alloyGrade: 'Zr-4 (Zr-1.5Sn-0.2Fe-0.1Cr)', application: 'RPV Internals (NPCIL)', zirconiumPercent: 97.8, corrosionRateMpy: 2, investmentCr: 125, status: 'Delayed', priority: 'High', origin: 'ANM Guwahati (AS)', destination: 'NPCIL Barh (BR)', shipDate: '2026-07-24', transitDays: 12, zone: 'East', remarks: 'Zr-4 reactor pressure vessel internal baffle for NPCIL Barh PHWR &#8594; 97.8% Zr &#8594; &#8377;125Cr for 18 tonnes forged ring &#8594; 12d delay monsoon logistics &#8594; 300&#176;C service 40 year life &#8594; India &#8377;4,800Cr RPV internals market &#8594; NPCIL 10 reactors under construction &#8594; Low neutron absorption cross-section 0.18 barn' },
  { id: 'ZRA-0013', batchNo: 'ZRA-B2413', city: 'Gandhinagar', manufacturer: 'Gujarat Fluorochemicals', alloyGrade: 'ZrO2-SiC Composite', application: 'Ceramic Armour (MKU)', zirconiumPercent: 55, corrosionRateMpy: 0, investmentCr: 185, status: 'Delivered', priority: 'Critical', origin: 'GFCL Dahej (GJ)', destination: 'MKU Kanpur (UP)', shipDate: '2026-07-26', transitDays: 2, zone: 'West', remarks: 'ZrO2-SiC composite ceramic armour for NIJ Level IV+ plate &#8594; 55% Zr as ZrO2 &#8594; &#8377;185Cr for 150,000 plates &#8594; 1.5x armour efficiency vs pure Al2O3 &#8594; India &#8377;6,800Cr composite armour market &#8594; MKU 40% India body armour export &#8594; Transformation toughening 3Y-TZP microstructure &#8594; Weight 2.2 kg per plate vs Al2O3 2.8 kg' },
  { id: 'ZRA-0014', batchNo: 'ZRA-B2414', city: 'Lucknow', manufacturer: 'UP Zirconium Works', alloyGrade: 'Zr-Cr-Fe (Zr-0.8Cr-0.2Fe)', application: 'Welding Filler (HAL)', zirconiumPercent: 99, corrosionRateMpy: 2, investmentCr: 48, status: 'Delivered', priority: 'Medium', origin: 'UZW Lucknow (UP)', destination: 'HAL Bengaluru (KA)', shipDate: '2026-07-27', transitDays: 2, zone: 'North', remarks: 'Zr-Cr-Fe welding filler wire for HAL aerospace structure repair &#8594; 99% Zr &#8594; &#8377;48Cr for 5 tonnes wire &#8594; TIG welding Zr alloy aerospace components &#8594; 2 mpy corrosion welded joint &#8594; India &#8377;1,200Cr Zr welding consumables &#8594; HAL repairs 200 aero structures/year &#8594; Inert argon shielding mandatory for Zr welding' }
]

export default function ZirconiumAlloyLogisticsView() {
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
    return zirconiumRecords.filter(r => {
      const matchSearch = !searchQuery || Object.values(r).some(v => String(v).toLowerCase().includes(searchQuery.toLowerCase()))
      const matchFilters = Object.entries(filters).every(([key, values]) => values.includes(String(r[key as keyof ZirconiumAlloyRecord])))
      return matchSearch && matchFilters
    })
  }, [searchQuery, filters])

  const totalInvestment = useMemo(() => zirconiumRecords.reduce((s: number, r) => s + r.investmentCr, 0), [])
  const avgZr = useMemo(() => (zirconiumRecords.reduce((s: number, r) => s + r.zirconiumPercent, 0) / zirconiumRecords.length).toFixed(1), [])
  const deliveredCount = useMemo(() => zirconiumRecords.filter(r => r.status === 'Delivered').length, [])
  const delayedCount = useMemo(() => zirconiumRecords.filter(r => r.status === 'Delayed').length, [])

  const uniqueCities = useMemo(() => [...new Set(zirconiumRecords.map(r => r.city))], [])
  const uniqueStatuses = useMemo(() => [...new Set(zirconiumRecords.map(r => r.status))], [])
  const uniqueManufacturers = useMemo(() => [...new Set(zirconiumRecords.map(r => r.manufacturer))], [])

  const cityInvestmentMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of zirconiumRecords) { map[r.city] = (map[r.city] || 0) + r.investmentCr }
    return map
  }, [])

  const gradeCorrosionMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of zirconiumRecords) { map[r.alloyGrade] = r.corrosionRateMpy }
    return map
  }, [])

  const statusCountMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of zirconiumRecords) { map[r.status] = (map[r.status] || 0) + 1 }
    return map
  }, [])

  const zoneInvestmentMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of zirconiumRecords) { map[r.zone] = (map[r.zone] || 0) + r.investmentCr }
    return map
  }, [])

  const maxCity = useMemo(() => {
    const entries = (Object.entries(cityInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1])
    return entries[0] || ['N/A', 0]
  }, [cityInvestmentMap])

  const maxCorrosion = useMemo(() => {
    const entries = (Object.entries(gradeCorrosionMap) as [string, number][]).sort((a, b) => b[1] - a[1])
    return entries[0] || ['N/A', 0]
  }, [gradeCorrosionMap])

  const tabs = ['Dashboard', 'Registry', 'Analytics', 'Insights']

  return (
    <div className="space-y-6">
      <PageHeader title="Zirconium Alloy Logistics" description="Zirconium alloy and ceramic supply chain for nuclear PHWR fuel cladding, fast breeder reactors, chemical nitric acid reactors, aerospace thermal barrier coatings, dental implants and ceramic armour applications" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-violet-600 bg-violet-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Total Investment</div><div className="text-2xl font-bold text-violet-800">&#8377;{totalInvestment.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground mt-1">Across {zirconiumRecords.length} batches</div></CardContent></Card>
        <Card className="border-l-4 border-l-violet-600 bg-violet-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Avg Zr Content</div><div className="text-2xl font-bold text-violet-800">{avgZr}%</div><div className="text-xs text-muted-foreground mt-1">Across all alloy grades</div></CardContent></Card>
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
          <Card><CardHeader><CardTitle className="text-sm">Corrosion Rate by Grade</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(gradeCorrosionMap) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([grade, mpy]) => (<div key={grade} className="flex items-center gap-2"><span className="text-xs w-36 truncate">{grade}</span><div className="flex-1 bg-purple-100 rounded-full h-3"><div className="bg-purple-600 h-3 rounded-full" style={{ width: `${(mpy / maxCorrosion[1]) * 100}%` }}></div></div><span className="text-xs font-medium w-16 text-right">{mpy} mpy</span></div>))}</CardContent></Card>
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
              <thead><tr className="border-b"><th className="text-left p-2">Batch</th><th className="text-left p-2">City</th><th className="text-left p-2">Manufacturer</th><th className="text-left p-2">Alloy Grade</th><th className="text-left p-2">Application</th><th className="text-left p-2">Zr%</th><th className="text-left p-2">mpy</th><th className="text-left p-2">&#8377;Cr</th><th className="text-left p-2">Status</th></tr></thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id} className={`border-b ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}>
                    <td className="p-2 font-mono text-xs">{r.batchNo}</td>
                    <td className="p-2">{r.city}</td>
                    <td className="p-2">{r.manufacturer}</td>
                    <td className="p-2">{r.alloyGrade}</td>
                    <td className="p-2 max-w-[200px] truncate">{r.application}</td>
                    <td className="p-2">{r.zirconiumPercent}%</td>
                    <td className="p-2">{r.corrosionRateMpy}</td>
                    <td className="p-2 font-medium">&#8377;{r.investmentCr}</td>
                    <td className="p-2"><Badge variant={r.status === 'Delivered' ? 'default' : r.status === 'Delayed' ? 'destructive' : 'secondary'}>{r.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card><CardHeader><CardTitle className="text-sm">Zr Content by Alloy</CardTitle></CardHeader><CardContent className="space-y-2">{zirconiumRecords.slice(0, 8).map(r => (<div key={r.id} className="flex items-center gap-2"><span className="text-xs w-36 truncate">{r.alloyGrade}</span><div className="flex-1 bg-violet-100 rounded-full h-3"><div className="bg-violet-600 h-3 rounded-full" style={{ width: `${Math.min((r.zirconiumPercent / 100) * 100, 100)}%` }}></div></div><span className="text-xs font-medium w-16 text-right">{r.zirconiumPercent}%</span></div>))}</CardContent></Card>
            <Card><CardHeader><CardTitle className="text-sm">Investment by Zone</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(zoneInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([zone, val]) => (<div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone}</span><div className="flex-1 bg-purple-100 rounded-full h-3"><div className="bg-purple-600 h-3 rounded-full" style={{ width: `${(val / maxCity[1]) * 100}%` }}></div></div><span className="text-xs font-medium w-20 text-right">&#8377;{val} Cr</span></div>))}</CardContent></Card>
          </div>
        </div>
      )}

      {activeTab === 'Analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">Status Distribution</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(statusCountMap) as [string, number][]).map(([status, count]) => (<div key={status} className="flex items-center gap-2"><span className="text-xs w-24">{status}</span><div className="flex-1 bg-violet-100 rounded-full h-3"><div className="bg-violet-600 h-3 rounded-full" style={{ width: `${(count / zirconiumRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Priority Breakdown</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const map: Record<string, number> = {}; for (const r of zirconiumRecords) { map[r.priority] = (map[r.priority] || 0) + 1 } const sorted = (Object.entries(map) as [string, number][]).sort((a, b) => b[1] - a[1]); return sorted.map(([pri, count]) => (<div key={pri} className="flex items-center gap-2"><span className="text-xs w-20">{pri}</span><div className="flex-1 bg-amber-100 rounded-full h-3"><div className="bg-amber-600 h-3 rounded-full" style={{ width: `${(count / zirconiumRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))})()}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Shipment Volume by Zone</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const map: Record<string, number> = {}; for (const r of zirconiumRecords) { map[r.zone] = (map[r.zone] || 0) + 1 } const sorted = (Object.entries(map) as [string, number][]).sort((a, b) => b[1] - a[1]); return sorted.map(([zone, count]) => (<div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone}</span><div className="flex-1 bg-indigo-100 rounded-full h-3"><div className="bg-indigo-600 h-3 rounded-full" style={{ width: `${(count / zirconiumRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))})()}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Alloy Category Distribution</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const cats: Record<string, number> = { 'Zircaloy Nuclear': 0, 'Zr-Nb Nuclear': 0, 'ZrO2 Ceramic': 0, 'Zr-Cu Getter': 0, 'Zr-Ti Marine': 0, 'Zr Compound Sand': 0, 'CP Zr Chemical': 0, 'Zr-Cr-Fe Weld': 0 }; for (const r of zirconiumRecords) { if (r.alloyGrade.startsWith('Zircaloy')) cats['Zircaloy Nuclear']++; else if (r.alloyGrade.includes('Nb')) cats['Zr-Nb Nuclear']++; else if (r.alloyGrade.includes('ZrO2')) cats['ZrO2 Ceramic']++; else if (r.alloyGrade.includes('Cu')) cats['Zr-Cu Getter']++; else if (r.alloyGrade.includes('Ti')) cats['Zr-Ti Marine']++; else if (r.alloyGrade.includes('SiO4')) cats['Zr Compound Sand']++; else if (r.alloyGrade.includes('702')) cats['CP Zr Chemical']++; else cats['Zr-Cr-Fe Weld']++ } return (Object.entries(cats) as [string, number][]).map(([cat, count]) => { const pct = `${(count / zirconiumRecords.length) * 100}%`; return <div key={cat} className="flex items-center gap-2"><span className="text-xs w-28">{cat}</span><div className="flex-1 bg-violet-100 rounded-full h-3"><div className="bg-violet-600 h-3 rounded-full" style={{ width: pct }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div> })})()}</CardContent></Card>
        </div>
      )}

      {activeTab === 'Insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-l-4 border-l-violet-600"><CardHeader><CardTitle className="text-sm">India Nuclear Zirconium: NFC Monopoly &#8377;12,500Cr</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>Nuclear Fuel Complex (NFC) Hyderabad is India&apos;s sole producer of nuclear-grade zirconium alloys, operating a dedicated Zr sponge plant using the Kroll process (ZrCl4 + Mg &#8594; Zr + MgCl2) with annual capacity of 350 tonnes Zr sponge. NFC produces Zircaloy-2 and Zircaloy-4 fuel cladding tubes (60,000 km/year), Zr-2.5Nb pressure tubes (85 tonnes/year) and Zr-Nb spacer grids for India&apos;s 22 operating PHWR reactors. India&apos;s nuclear Zr alloy market is &#8377;12,500Cr, growing at 15% CAGR with NPCIL&apos;s 10-reactor construction programme (7,500 MW under construction). Zr&apos;s key nuclear advantage is its ultra-low thermal neutron absorption cross-section (0.18 barn vs Fe 2.56 barn, stainless steel 3.1 barn), making it irreplaceable as the structural material in nuclear reactor cores where neutron economy directly determines power output and fuel burnup.</p></CardContent></Card>
          <Card className="border-l-4 border-l-rose-500"><CardHeader><CardTitle className="text-sm">Fast Breeder Zr-4: FBTR to PFBR 500MW Transition</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>IGCAR Kalpakkam operates India&apos;s only Fast Breeder Test Reactor (FBTR, 40MWt) and is building the Prototype Fast Breeder Reactor (PFBR, 500MWe) using Zircaloy-4 fuel cladding for mixed oxide (U-Pu) fuel pins. Zr-4&apos;s advantage over Zr-2 in fast reactors is lower hydrogen pickup (reducing hydride embrittlement), with 3 mpy corrosion rate in liquid sodium at 500&#176;C. India&apos;s three-stage nuclear programme envisions 30 fast breeder reactors by 2050, requiring &#8377;8,500Cr of Zr alloy annually. The PFBR is scheduled for criticality in 2027, with BHAVINI (Bharatiya Nabhikiya Vidyut Nigam Ltd) as the commercial operator. Each 500MW FBR requires 15 tonnes of Zr-4 cladding tubes per reload cycle, with IGCAR developing advanced ODS (oxide dispersion strengthened) Zr alloys for 600&#176;C+ operation.</p></CardContent></Card>
          <Card className="border-l-4 border-l-sky-500"><CardHeader><CardTitle className="text-sm">Chemical Zr: 200 Reactors for Nitric Acid</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>Commercial pure Zr (Zr-702, 99.2% Zr) is irreplaceable for nitric acid reactors in India&apos;s fertiliser and explosive industry, with corrosion rate of only 0.5 mpy in 65% HNO3 at 200&#176;C - compared to 50 mpy for 316L stainless steel which suffers intergranular attack. India has 200 Zr-lined chemical reactors across Deepak Fertiliser, NFL, IFFCO, RCF and Solar Industries, consuming &#8377;6,200Cr of Zr plate and forgings annually. Bharat Forge (Pune) and MIDHANI (Hyderabad) are the primary suppliers of Zr-702 plate and forgings. India&apos;s 320 MMTPA fertiliser production depends critically on Zr reactor availability, with each reactor shutdown costing &#8377;5Cr/day in lost production. The PLI scheme for specialty chemicals is driving 50 new Zr-lined reactors by 2028.</p></CardContent></Card>
          <Card className="border-l-4 border-l-amber-500"><CardHeader><CardTitle className="text-sm">ZrO2 Ceramics: TBC and Armour &#8377;11,000Cr Combined</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>Zirconium dioxide (ZrO2) ceramics serve two high-value Indian markets: thermal barrier coatings (TBC, &#8377;4,200Cr) and ceramic armour (&#8377;6,800Cr). 7-8YSZ (7 mol% Y2O3-stabilized ZrO2) is the industry-standard TBC material applied by air plasma spray (APS) on BEL AESA radar modules, HAL Tejas engine components and DRDO hypersonic missile nose cones, providing 200 micron ceramic layers that withstand 1,200&#176;C surface temperatures with only 2.0 W/mK thermal conductivity. Simultaneously, ZrO2-SiC composite ceramic armour plates from Gujarat Fluorochemicals achieve 1.5x ballistic efficiency vs pure Al2O3 at 2.2 kg per plate (vs Al2O3 2.8 kg), using transformation toughening (tetragonal &#8594; monoclinic ZrO2 phase transition absorbs impact energy). India&apos;s total ZrO2 ceramic market is &#8377;11,000Cr, growing at 14% CAGR.</p></CardContent></Card>
        </div>
      )}
    </div>
  )
}
