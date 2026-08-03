'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { Hexagon } from 'lucide-react'

interface AluminaCeramicRecord {
  id: string
  batchNo: string
  city: string
  manufacturer: string
  ceramicType: string
  application: string
  aluminaPercent: number
  hardnessGPa: number
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

const aluminaRecords: AluminaCeramicRecord[] = [
  { id: 'ALC-0001', batchNo: 'ALC-B2401', city: 'Bengaluru', manufacturer: 'Coorstek India', ceramicType: '99.7% Al2O3 Substrate', application: 'LED Package (Cree India)', aluminaPercent: 99.7, hardnessGPa: 18, investmentCr: 165, status: 'Delivered', priority: 'Critical', origin: 'Coorstek Bengaluru (KA)', destination: 'Cree India Bengaluru (KA)', shipDate: '2026-07-18', transitDays: 1, zone: 'South', remarks: '99.7% alumina substrate for Cree XLamp LED ceramic package &#8594; 18 GPa hardness thermal conductivity 30 W/mK &#8594; &#8377;165Cr for 5 million substrates &#8594; India &#8377;12,000Cr LED substrate market &#8594; 0.35mm thick 96% Al2O3 DBC substrate &#8594; Cree 40% India LED market share &#8594; Alumina substrate 95% vs AlN 170 W/mK trade-off' },
  { id: 'ALC-0002', batchNo: 'ALC-B2402', city: 'Hyderabad', manufacturer: 'Morgan Technical Ceramics', ceramicType: '95% Al2O3 Spark Plug', application: 'Automotive Ignition (Bosch)', aluminaPercent: 95, hardnessGPa: 15, investmentCr: 138, status: 'Delivered', priority: 'High', origin: 'MTC Hyderabad (TG)', destination: 'Bosch Hyderabad (TG)', shipDate: '2026-07-20', transitDays: 1, zone: 'South', remarks: '95% alumina insulator for Bosch NGK-style spark plug &#8594; 15 GPa hardness 1,100&#176;C service temp &#8594; &#8377;138Cr for 25 million insulators &#8594; India 400 million vehicles &#8594; 20,000 km replacement interval &#8594; India &#8377;5,500Cr spark plug market &#8594; Bosch 35% aftermarket share &#8594; Alumina dielectric strength 25 kV/mm' },
  { id: 'ALC-0003', batchNo: 'ALC-B2403', city: 'Mumbai', manufacturer: 'Saint-Gobain Ceramics', ceramicType: '85% Al2O3 Wear Liner', application: 'Mining Slurry Pump (Weir)', aluminaPercent: 85, hardnessGPa: 13, investmentCr: 95, status: 'Delivered', priority: 'High', origin: 'SGC Mumbai (MH)', destination: 'Weir Minerals Mumbai (MH)', shipDate: '2026-07-15', transitDays: 1, zone: 'West', remarks: '85% alumina wear liner for Weir Warman slurry pump &#8594; 13 GPa hardness abrasion resistant &#8594; &#8377;95Cr for 8,000 liner segments &#8594; India 400 underground mines &#8594; 3x longer life vs rubber liner &#8594; India &#8377;3,200Cr mining ceramic liner market &#8594; Coal iron ore copper mining applications &#8594; Alumina liner thickness 25mm bolted' },
  { id: 'ALC-0004', batchNo: 'ALC-B2404', city: 'Pune', manufacturer: 'Hindustan Aeronautics (HAL)', ceramicType: '99.5% Al2O3 Radome', application: 'Tejas Fighter Radar (DRDO)', aluminaPercent: 99.5, hardnessGPa: 17, investmentCr: 210, status: 'Delayed', priority: 'Critical', origin: 'HAL Bengaluru (KA)', destination: 'DRDO Hyderabad (TG)', shipDate: '2026-07-22', transitDays: 10, zone: 'West', remarks: '99.5% alumina radome for Tejas Mk1A UTTAM AESA radar antenna &#8594; 17 GPa hardness low dielectric constant 9.8 &#8594; &#8377;210Cr for 40 radome assemblies &#8594; 10d delay due to sintering furnace calibration &#8594; India &#8377;8,200Cr defence ceramic market &#8594; Transmittance 85% at X-band 10GHz &#8594; DRDO 83 Tejas on order &#8594; Alumina radome vs quartz composite choice' },
  { id: 'ALC-0005', batchNo: 'ALC-B2405', city: 'Chennai', manufacturer: 'Carborundum Universal', ceramicType: '92% Al2O3 Thread Guide', application: 'Textile Ring Frame (LMW)', aluminaPercent: 92, hardnessGPa: 14, investmentCr: 32, status: 'Delivered', priority: 'Medium', origin: 'CUMI Chennai (TN)', destination: 'LMW Coimbatore (TN)', shipDate: '2026-07-19', transitDays: 1, zone: 'South', remarks: '92% alumina thread guide for LMW ring frame spinning machine &#8594; 14 GPa hardness smooth surface &#8594; &#8377;32Cr for 12 million guides &#8594; India 50 million spindles &#8594; 8 guides per ring frame traveller &#8594; India &#8377;800Cr textile ceramic market &#8594; CUMI 60% India textile ceramic share &#8594; Alumina guide reduces yarn hairiness 40%' },
  { id: 'ALC-0006', batchNo: 'ALC-B2406', city: 'Noida', manufacturer: 'Defence Ceramic India', ceramicType: '99.9% Al2O3 Armour Tile', application: 'CRPF Bulletproof Vest (MKU)', aluminaPercent: 99.9, hardnessGPa: 19, investmentCr: 185, status: 'Delivered', priority: 'Critical', origin: 'DCI Noida (UP)', destination: 'MKU Kanpur (UP)', shipDate: '2026-07-16', transitDays: 1, zone: 'North', remarks: '99.9% high-purity alumina ceramic armour tile for NIJ Level IV plate &#8594; 19 GPa hardness V50 vs 7.62mm AP &#8594; &#8377;185Cr for 200,000 plate inserts &#8594; India 3 million security personnel &#8594; 25mm x 25mm hex tile mosaic array &#8594; India &#8377;6,500Cr body armour ceramic market &#8594; MKU 40% India armour export share &#8594; Alumina vs SiC vs B4C armour weight trade-off' },
  { id: 'ALC-0007', batchNo: 'ALC-B2407', city: 'Kolkata', manufacturer: 'Bengal Ceramics Ltd', ceramicType: '96% Al2O3 Insulator', application: 'Railway Overhead Line (BHEL)', aluminaPercent: 96, hardnessGPa: 16, investmentCr: 72, status: 'Delivered', priority: 'High', origin: 'BCL Kolkata (WB)', destination: 'BHEL Bhopal (MP)', shipDate: '2026-07-21', transitDays: 2, zone: 'East', remarks: '96% alumina post insulator for 25kV AC railway catenary &#8594; 16 GPa hardness 50kV creepage &#8594; &#8377;72Cr for 150,000 insulators &#8594; Indian Railways 67,000 km route &#8594; 12 insulators per km &#8594; India &#8377;2,800Cr traction insulator market &#8594; BHEL 55% railway insulator share &#8594; Alumina porcelain vs glass disc insulator' },
  { id: 'ALC-0008', batchNo: 'ALC-B2408', city: 'Ahmedabad', manufacturer: 'Gujarat Alumina Ceramics', ceramicType: '88% Al2O3 Seal Ring', application: 'API Pump Seal (Flowserve)', aluminaPercent: 88, hardnessGPa: 12, investmentCr: 55, status: 'Delivered', priority: 'High', origin: 'GAC Ahmedabad (GJ)', destination: 'Flowserve Vadodara (GJ)', shipDate: '2026-07-17', transitDays: 1, zone: 'West', remarks: '88% alumina mechanical seal face for Flowserve API 682 pump &#8594; 12 GPa hardness chemical resistant &#8594; &#8377;55Cr for 200,000 seal rings &#8594; India 15,000 API process pumps &#8594; 2 seal faces per pump &#8594; India &#8377;2,200Cr pump seal ceramic market &#8594; Flowserve 30% refinery pump share &#8594; Al2O3 vs SiC seal face hardness-cost balance' },
  { id: 'ALC-0009', batchNo: 'ALC-B2409', city: 'Jaipur', manufacturer: 'Rajasthan Ceramic Industries', ceramicType: '94% Al2O3 Ballistic Plate', application: 'Paramilitary Vehicle Armour (Tata)', aluminaPercent: 94, hardnessGPa: 15, investmentCr: 142, status: 'Delivered', priority: 'Critical', origin: 'RCI Jaipur (RJ)', destination: 'Tata Advanced Systems Jamshedpur (JH)', shipDate: '2026-07-23', transitDays: 3, zone: 'North', remarks: '94% alumina composite ballistic plate for Tata Mine Protected Vehicle &#8594; 15 GPa hardness STANAG 4569 Level 3 &#8594; &#8377;142Cr for 50,000 vehicle armour sets &#8594; India 50,000 CAPF vehicles &#8594; 30kg per vehicle ceramic array &#8594; India &#8377;4,800Cr vehicle armour ceramic market &#8594; Tata 25% Indian AFV market &#8594; Alumina 3.95 g/cm3 vs steel 7.85 g/cm3 weight saving' },
  { id: 'ALC-0010', batchNo: 'ALC-B2410', city: 'Coimbatore', manufacturer: 'Coimbatore Ceramic Products', ceramicType: '97% Al2O3 Cutting Insert', application: 'CNC Turning (Sandvik)', aluminaPercent: 97, hardnessGPa: 18, investmentCr: 125, status: 'Delivered', priority: 'High', origin: 'CCP Coimbatore (TN)', destination: 'Sandvik Asia Pune (MH)', shipDate: '2026-07-14', transitDays: 2, zone: 'South', remarks: '97% alumina ceramic cutting insert for Sandvik CC6090 grade &#8594; 18 GPa hardness 1,200&#176;C hot hardness &#8594; &#8377;125Cr for 10 million inserts &#8594; India 2,500 CNC machine shops &#8594; Vc 300 m/min machining cast iron &#8594; India &#8377;4,500Cr ceramic tool insert market &#8594; Sandvik 20% India cutting tool share &#8594; Alumina ceramic 3x faster than carbide CI turning' },
  { id: 'ALC-0011', batchNo: 'ALC-B2411', city: 'Bhubaneswar', manufacturer: 'Odisha High Alumina Refractories', ceramicType: '90% Al2O3 Kiln Roller', application: 'Steel Reheating Furnace (SAIL)', aluminaPercent: 90, hardnessGPa: 13, investmentCr: 68, status: 'Delivered', priority: 'High', origin: 'OHAR Bhubaneswar (OD)', destination: 'SAIL Rourkela (OD)', shipDate: '2026-07-25', transitDays: 1, zone: 'East', remarks: '90% alumina kiln roller for SAIL walking beam reheating furnace &#8594; 13 GPa hardness 1,350&#176;C max &#8594; &#8377;68Cr for 4,000 rollers &#8594; India 140 MT steel capacity &#8594; 200 rollers per furnace &#8594; India &#8377;2,600Cr steel ceramic roller market &#8594; SAIL 5 steel plants &#8594; Alumina roller 5 year life vs metal 1.5 year' },
  { id: 'ALC-0012', batchNo: 'ALC-B2412', city: 'Guwahati', manufacturer: 'Assam Refractory Corp', ceramicType: '85% Al2O3 Thermocouple Sheath', application: 'Petroleum Refinery (IOCL)', aluminaPercent: 85, hardnessGPa: 12, investmentCr: 25, status: 'Delayed', priority: 'Medium', origin: 'ARC Guwahati (AS)', destination: 'IOCL Guwahati (AS)', shipDate: '2026-07-24', transitDays: 12, zone: 'East', remarks: '85% alumina thermocouple protection sheath for IOCL refinery &#8594; 12 GPa hardness 1,600&#176;C rated &#8594; &#8377;25Cr for 40,000 sheaths &#8594; India 250 MT refinery capacity &#8594; 12d delay monsoon logistics &#8594; India &#8377;1,200Cr refinery ceramic market &#8594; IOCL 35% India refinery share &#8594; Alumina sheath protects Type K thermocouple' },
  { id: 'ALC-0013', batchNo: 'ALC-B2413', city: 'Gandhinagar', manufacturer: 'Gujarat Fluorochemicals', ceramicType: '99.8% Al2O3 Bioceramic', application: 'Dental Implant (Dentsply)', aluminaPercent: 99.8, hardnessGPa: 19, investmentCr: 175, status: 'Delivered', priority: 'Critical', origin: 'GFCL Dahej (GJ)', destination: 'Dentsply Jaipur (RJ)', shipDate: '2026-07-26', transitDays: 2, zone: 'West', remarks: '99.8% high-purity alumina bioceramic for Dentsply dental implant abutment &#8594; 19 GPa hardness bio-inert ISO 6474 &#8594; &#8377;175Cr for 500,000 abutments &#8594; India 25 million dental procedures/year &#8594; 20-year implant life bio-compatibility &#8594; India &#8377;7,200Cr dental ceramic market &#8594; Dentsply 30% India dental market &#8594; Alumina vs zirconia dental abutment choice' },
  { id: 'ALC-0014', batchNo: 'ALC-B2414', city: 'Lucknow', manufacturer: 'UP Technical Ceramics', ceramicType: '93% Al2O3 Capacitor Dielectric', application: 'MLCC Substrate (TDK India)', aluminaPercent: 93, hardnessGPa: 14, investmentCr: 88, status: 'Delivered', priority: 'High', origin: 'UPTEC Lucknow (UP)', destination: 'TDK India Bengaluru (KA)', shipDate: '2026-07-27', transitDays: 2, zone: 'North', remarks: '93% alumina dielectric for TDK multilayer ceramic capacitor substrate &#8594; 14 GPa hardness permittivity 10 &#8594; &#8377;88Cr for 50 million dielectric layers &#8594; India 15 billion MLCC annual consumption &#8594; 100 dielectric layers per 0402 MLCC &#8594; India &#8377;5,800Cr MLCC ceramic market &#8594; TDK 20% India passive market &#8594; Alumina dielectric class I C0G/NP0 temp stable' }
]

export default function AluminaCeramicLogisticsView() {
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
    return aluminaRecords.filter(r => {
      const matchSearch = !searchQuery || Object.values(r).some(v => String(v).toLowerCase().includes(searchQuery.toLowerCase()))
      const matchFilters = Object.entries(filters).every(([key, values]) => values.includes(String(r[key as keyof AluminaCeramicRecord])))
      return matchSearch && matchFilters
    })
  }, [searchQuery, filters])

  const totalInvestment = useMemo(() => aluminaRecords.reduce((s: number, r) => s + r.investmentCr, 0), [])
  const avgAlumina = useMemo(() => (aluminaRecords.reduce((s: number, r) => s + r.aluminaPercent, 0) / aluminaRecords.length).toFixed(1), [])
  const deliveredCount = useMemo(() => aluminaRecords.filter(r => r.status === 'Delivered').length, [])
  const delayedCount = useMemo(() => aluminaRecords.filter(r => r.status === 'Delayed').length, [])

  const uniqueCities = useMemo(() => [...new Set(aluminaRecords.map(r => r.city))], [])
  const uniqueStatuses = useMemo(() => [...new Set(aluminaRecords.map(r => r.status))], [])
  const uniqueManufacturers = useMemo(() => [...new Set(aluminaRecords.map(r => r.manufacturer))], [])

  const cityInvestmentMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of aluminaRecords) { map[r.city] = (map[r.city] || 0) + r.investmentCr }
    return map
  }, [])

  const ceramicHardnessMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of aluminaRecords) { map[r.ceramicType] = r.hardnessGPa }
    return map
  }, [])

  const statusCountMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of aluminaRecords) { map[r.status] = (map[r.status] || 0) + 1 }
    return map
  }, [])

  const zoneInvestmentMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of aluminaRecords) { map[r.zone] = (map[r.zone] || 0) + r.investmentCr }
    return map
  }, [])

  const maxCity = useMemo(() => {
    const entries = (Object.entries(cityInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1])
    return entries[0] || ['N/A', 0]
  }, [cityInvestmentMap])

  const maxHardness = useMemo(() => {
    const entries = (Object.entries(ceramicHardnessMap) as [string, number][]).sort((a, b) => b[1] - a[1])
    return entries[0] || ['N/A', 0]
  }, [ceramicHardnessMap])

  const tabs = ['Dashboard', 'Registry', 'Analytics', 'Insights']

  return (
    <div className="space-y-6">
      <PageHeader title="Alumina Ceramic Logistics" description="Alumina ceramic supply chain for LED substrates, automotive spark plugs, mining wear liners, aerospace radomes, textile thread guides, ballistic armour tiles, cutting tool inserts and bioceramic dental implants" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-sky-600 bg-sky-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Total Investment</div><div className="text-2xl font-bold text-sky-800">&#8377;{totalInvestment.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground mt-1">Across {aluminaRecords.length} batches</div></CardContent></Card>
        <Card className="border-l-4 border-l-sky-600 bg-sky-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Avg Al2O3 Purity</div><div className="text-2xl font-bold text-sky-800">{avgAlumina}%</div><div className="text-xs text-muted-foreground mt-1">Across all ceramic types</div></CardContent></Card>
        <Card className="border-l-4 border-l-sky-600 bg-sky-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Delivered</div><div className="text-2xl font-bold text-sky-800">{deliveredCount}</div><div className="text-xs text-muted-foreground mt-1">{delayedCount} delayed</div></CardContent></Card>
        <Card className="border-l-4 border-l-sky-600 bg-sky-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Top City</div><div className="text-2xl font-bold text-sky-800">{maxCity[0]}</div><div className="text-xs text-muted-foreground mt-1">&#8377;{maxCity[1].toLocaleString()} Cr invested</div></CardContent></Card>
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
          <button key={tab} className={`px-4 py-2 text-sm font-medium ${activeTab === tab ? 'border-b-2 border-sky-600 text-sky-800' : 'text-muted-foreground'}`} onClick={() => setActiveTab(tab)}>{tab}</button>
        ))}
      </div>

      {activeTab === 'Dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">Investment by City</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(cityInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([city, val]) => (<div key={city} className="flex items-center gap-2"><span className="text-xs w-24 truncate">{city}</span><div className="flex-1 bg-sky-100 rounded-full h-3"><div className="bg-sky-600 h-3 rounded-full" style={{ width: `${(val / maxCity[1]) * 100}%` }}></div></div><span className="text-xs font-medium w-20 text-right">&#8377;{val} Cr</span></div>))}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Hardness by Ceramic Type</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(ceramicHardnessMap) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([ceramic, gpa]) => (<div key={ceramic} className="flex items-center gap-2"><span className="text-xs w-36 truncate">{ceramic}</span><div className="flex-1 bg-blue-100 rounded-full h-3"><div className="bg-blue-600 h-3 rounded-full" style={{ width: `${(gpa / maxHardness[1]) * 100}%` }}></div></div><span className="text-xs font-medium w-16 text-right">{gpa} GPa</span></div>))}</CardContent></Card>
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
              <thead><tr className="border-b"><th className="text-left p-2">Batch</th><th className="text-left p-2">City</th><th className="text-left p-2">Manufacturer</th><th className="text-left p-2">Ceramic Type</th><th className="text-left p-2">Application</th><th className="text-left p-2">Al2O3%</th><th className="text-left p-2">GPa</th><th className="text-left p-2">&#8377;Cr</th><th className="text-left p-2">Status</th></tr></thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id} className={`border-b ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}>
                    <td className="p-2 font-mono text-xs">{r.batchNo}</td>
                    <td className="p-2">{r.city}</td>
                    <td className="p-2">{r.manufacturer}</td>
                    <td className="p-2">{r.ceramicType}</td>
                    <td className="p-2 max-w-[200px] truncate">{r.application}</td>
                    <td className="p-2">{r.aluminaPercent}%</td>
                    <td className="p-2">{r.hardnessGPa}</td>
                    <td className="p-2 font-medium">&#8377;{r.investmentCr}</td>
                    <td className="p-2"><Badge variant={r.status === 'Delivered' ? 'default' : r.status === 'Delayed' ? 'destructive' : 'secondary'}>{r.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card><CardHeader><CardTitle className="text-sm">Al2O3 Purity by Ceramic</CardTitle></CardHeader><CardContent className="space-y-2">{aluminaRecords.slice(0, 8).map(r => (<div key={r.id} className="flex items-center gap-2"><span className="text-xs w-36 truncate">{r.ceramicType}</span><div className="flex-1 bg-sky-100 rounded-full h-3"><div className="bg-sky-600 h-3 rounded-full" style={{ width: `${Math.min((r.aluminaPercent / 100) * 100, 100)}%` }}></div></div><span className="text-xs font-medium w-16 text-right">{r.aluminaPercent}%</span></div>))}</CardContent></Card>
            <Card><CardHeader><CardTitle className="text-sm">Investment by Zone</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(zoneInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([zone, val]) => (<div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone}</span><div className="flex-1 bg-blue-100 rounded-full h-3"><div className="bg-blue-600 h-3 rounded-full" style={{ width: `${(val / maxCity[1]) * 100}%` }}></div></div><span className="text-xs font-medium w-20 text-right">&#8377;{val} Cr</span></div>))}</CardContent></Card>
          </div>
        </div>
      )}

      {activeTab === 'Analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">Status Distribution</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(statusCountMap) as [string, number][]).map(([status, count]) => (<div key={status} className="flex items-center gap-2"><span className="text-xs w-24">{status}</span><div className="flex-1 bg-sky-100 rounded-full h-3"><div className="bg-sky-600 h-3 rounded-full" style={{ width: `${(count / aluminaRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Priority Breakdown</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const map: Record<string, number> = {}; for (const r of aluminaRecords) { map[r.priority] = (map[r.priority] || 0) + 1 } const sorted = (Object.entries(map) as [string, number][]).sort((a, b) => b[1] - a[1]); return sorted.map(([pri, count]) => (<div key={pri} className="flex items-center gap-2"><span className="text-xs w-20">{pri}</span><div className="flex-1 bg-amber-100 rounded-full h-3"><div className="bg-amber-600 h-3 rounded-full" style={{ width: `${(count / aluminaRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))})()}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Shipment Volume by Zone</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const map: Record<string, number> = {}; for (const r of aluminaRecords) { map[r.zone] = (map[r.zone] || 0) + 1 } const sorted = (Object.entries(map) as [string, number][]).sort((a, b) => b[1] - a[1]); return sorted.map(([zone, count]) => (<div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone}</span><div className="flex-1 bg-indigo-100 rounded-full h-3"><div className="bg-indigo-600 h-3 rounded-full" style={{ width: `${(count / aluminaRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))})()}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Al2O3 Purity Range Distribution</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const ranges: Record<string, number> = { 'Standard (&#60;90%)': 0, 'High (90-95%)': 0, 'Very High (95-99%)': 0, 'Ultra High (99%+)': 0 }; for (const r of aluminaRecords) { if (r.aluminaPercent >= 99) ranges['Ultra High (99%+)']++; else if (r.aluminaPercent >= 95) ranges['Very High (95-99%)']++; else if (r.aluminaPercent >= 90) ranges['High (90-95%)']++; else ranges['Standard (&#60;90%)']++ } return (Object.entries(ranges) as [string, number][]).map(([range, count]) => (<div key={range} className="flex items-center gap-2"><span className="text-xs w-28">{range}</span><div className="flex-1 bg-sky-100 rounded-full h-3"><div className="bg-sky-600 h-3 rounded-full" style={{ width: `${(count / aluminaRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))})()}</CardContent></Card>
        </div>
      )}

      {activeTab === 'Insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-l-4 border-l-sky-600"><CardHeader><CardTitle className="text-sm">India Alumina Ceramic: &#8377;50,000Cr Market Growing 12% CAGR</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>India&apos;s alumina ceramic market is valued at &#8377;50,000Cr across 12 application segments: LED substrates (&#8377;12,000Cr), automotive spark plugs (&#8377;5,500Cr), defence armour (&#8377;6,500Cr), cutting tools (&#8377;4,500Cr), dental bioceramics (&#8377;7,200Cr), MLCC dielectrics (&#8377;5,800Cr), mining wear liners (&#8377;3,200Cr), textile guides (&#8377;800Cr), traction insulators (&#8377;2,800Cr), pump seals (&#8377;2,200Cr), vehicle armour (&#8377;4,800Cr) and refinery ceramics (&#8377;1,200Cr). India produces 85% of its alumina ceramic requirements domestically through Coorstek, Saint-Gobain, Carborundum Universal (CUMI), Morgan Technical Ceramics and HAL Ceramic Division, with raw material bauxite sourced from NALCO and Hindalco. The PLI scheme for advanced ceramics targets &#8377;15,000Cr investment in 5 new ceramic clusters at Gujarat, Tamil Nadu and Odisha.</p></CardContent></Card>
          <Card className="border-l-4 border-l-red-500"><CardHeader><CardTitle className="text-sm">Ballistic Armour: 99.9% Alumina NIJ Level IV Protection</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>India&apos;s paramilitary and military forces require 3 million ceramic body armour plates rated to NIJ Level IV (protection against 7.62x51mm AP M80 at 2,780 fps). High-purity 99.9% alumina ceramic tiles bonded to ultra-high molecular weight polyethylene (UHMWPE) backing provide V50 ballistic protection at 40% lower cost than silicon carbide (SiC) armour. Defence Ceramic India (Noida) and Rajasthan Ceramic Industries (Jaipur) are the primary producers, supplying MKU Limited (Kanpur), Tata Advanced Systems and DRDO. Each Level IV plate contains 300 alumina hexagonal tiles (25x25mm) arranged in a mosaic pattern, weighing 2.8 kg per 250x300mm plate. India&apos;s total ballistic ceramic demand is &#8377;6,500Cr (body armour) + &#8377;4,800Cr (vehicle armour) = &#8377;11,300Cr, growing at 18% CAGR with CRPF, BSF, Army and CAPF expansion.</p></CardContent></Card>
          <Card className="border-l-4 border-l-emerald-500"><CardHeader><CardTitle className="text-sm">LED Ceramic Substrate: 5 Million Units Monthly</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>India&apos;s LED lighting revolution under UJALA scheme has driven demand for 99.7% alumina ceramic DBC (Direct Bonded Copper) substrates to 5 million units per month, supplied primarily by Coorstek India (Bengaluru) and Kyocera India (Chennai). Each LED package requires a 0.35mm thick alumina substrate with 30 W/mK thermal conductivity to dissipate 1.5W heat from the LED chip junction at 150&#176;C. India produces 2 billion LED packages annually (Samsung LED, Cree India, Philips Lumileds), with each substrate requiring precision laser-drilled via holes for wire bonding. The transition to thin-film flip-chip LEDs is reducing alumina substrate area by 30%, but increasing substrate count per package. India&apos;s LED ceramic substrate market is &#8377;12,000Cr, growing at 20% CAGR aligned with 100% LED penetration target by 2027.</p></CardContent></Card>
          <Card className="border-l-4 border-l-purple-500"><CardHeader><CardTitle className="text-sm">Aerospace Radome and Cutting Tool Ceramics</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>HAL and DRDO jointly manufacture 99.5% alumina ceramic radomes for Tejas Mk1A UTTAM AESA radar antenna at HAL Bengaluru, requiring 85% transmittance at X-band (8-12 GHz) with rain erosion resistance. Each radome assembly weighs 12 kg and costs &#8377;5.25 Cr, with 83 radomes on order for Tejas fleet. Simultaneously, alumina ceramic cutting inserts (CC6090 equivalent) for CNC cast iron turning at Vc 300 m/min are supplied by Coimbatore Ceramic Products to Sandvik Asia, Kennametal India and Iscar India. India&apos;s 2,500 CNC machine shops consume 10 million ceramic inserts annually worth &#8377;4,500Cr. Alumina ceramic tools offer 3x higher cutting speed vs tungsten carbide for grey cast iron, but are brittle for interrupted cuts. Coorstek and CUMI are developing SiC whisker-reinforced alumina composites for improved fracture toughness.</p></CardContent></Card>
        </div>
      )}
    </div>
  )
}
