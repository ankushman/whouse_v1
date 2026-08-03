'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { Sun } from 'lucide-react'

interface MolybdenumSheetRecord {
  id: string
  batchNo: string
  city: string
  manufacturer: string
  sheetType: string
  application: string
  molybdenumPercent: number
  thicknessMm: number
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

const molybdenumRecords: MolybdenumSheetRecord[] = [
  { id: 'MSA-0001', batchNo: 'MSA-B2401', city: 'Mumbai', manufacturer: 'MIDHANI', sheetType: 'TZM Sheet (Mo-0.5Ti-0.08Zr)', application: 'Glass Melting Electrode (Asahi India)', molybdenumPercent: 99.5, thicknessMm: 8, investmentCr: 165, status: 'Delivered', priority: 'High', origin: 'MIDHANI Hyderabad (TG)', destination: 'Asahi India Bhiwadi (RJ)', shipDate: '2026-07-18', transitDays: 2, zone: 'West', remarks: 'TZM molybdenum sheet for Asahi float glass melting electrode &#8594; 99.5% Mo 0.5Ti 0.08Zr &#8594; &#8377;165Cr for 12 tonnes &#8594; 8mm sheet 1,600&#176;C glass melt &#8594; India &#8377;5,800Cr glass Mo electrode market &#8594; India 12 float glass lines &#8594; TZM creep strength 10x pure Mo &#8594; Electrode life 5 years in molten glass' },
  { id: 'MSA-0002', batchNo: 'MSA-B2402', city: 'Hyderabad', manufacturer: 'DRDO DMRL', sheetType: 'Mo-La2O3 Sheet (0.5%La2O3)', application: 'SSB Rocket Nozzle (DRDO)', molybdenumPercent: 99.5, thicknessMm: 4, investmentCr: 225, status: 'Delivered', priority: 'Critical', origin: 'DMRL Hyderabad (TG)', destination: 'DRDO Balasore (OD)', shipDate: '2026-07-20', transitDays: 3, zone: 'South', remarks: 'Mo-0.5La2O3 ODS sheet for DRDO SSB solid rocket nozzle insert &#8594; 99.5% Mo doped &#8594; &#8377;225Cr for 3 tonnes &#8594; 4mm sheet 1,800&#176;C nozzle &#8594; India &#8377;7,500Cr defence Mo market &#8594; La2O3 dispersoids pin grain boundary &#8594; 50% higher re-crystallization temp vs pure Mo &#8594; Agni-V SSB uses 4 nozzle inserts' },
  { id: 'MSA-0003', batchNo: 'MSA-B2403', city: 'Bengaluru', manufacturer: 'HAL', sheetType: 'Pure Mo Sheet (99.95% Mo)', application: 'X-Ray Window (ISRO)', molybdenumPercent: 99.95, thicknessMm: 0.1, investmentCr: 48, status: 'Delivered', priority: 'Medium', origin: 'HAL Bengaluru (KA)', destination: 'ISRO Bengaluru (KA)', shipDate: '2026-07-15', transitDays: 1, zone: 'South', remarks: '100 micron pure Mo X-ray window for ISRO Chandrayaan-3 payload &#8594; 99.95% Mo &#8594; &#8377;48Cr for 200 m2 foil &#8594; India &#8377;1,800Cr aerospace Mo foil &#8594; High Z 42 for X-ray transparency &#8594; Mo K-edge at 20 keV &#8594; ISRO 12 satellite X-ray instruments in orbit' },
  { id: 'MSA-0004', batchNo: 'MSA-B2404', city: 'Pune', manufacturer: 'Bharat Forge', sheetType: 'Mo-Cu Composite Sheet', application: 'Heat Sink Base (Tata Electronics)', molybdenumPercent: 80, thicknessMm: 2, investmentCr: 125, status: 'Delivered', priority: 'High', origin: 'Bharat Forge Pune (MH)', destination: 'Tata Electronics Bengaluru (KA)', shipDate: '2026-07-22', transitDays: 2, zone: 'West', remarks: 'Mo-Cu heat spreader for Tata Electronics SiC power module &#8594; 80% Mo 20% Cu &#8594; &#8377;125Cr for 4 tonnes &#8594; 2mm sheet 10 W/mK CTE matched &#8594; India &#8377;4,200Cr semiconductor Mo-Cu market &#8594; CTE 7 ppm/K matches SiC 4 ppm/K &#8594; Outperforms Cu 17 ppm/K by 2.4x' },
  { id: 'MSA-0005', batchNo: 'MSA-B2405', city: 'Chennai', manufacturer: 'IGCAR Kalpakkam', sheetType: 'Mo-Re Sheet (47%Re)', application: 'Fusion Blanket (IPR Gandhinagar)', molybdenumPercent: 53, thicknessMm: 6, investmentCr: 320, status: 'Delivered', priority: 'Critical', origin: 'IGCAR Kalpakkam (TN)', destination: 'IPR Gandhinagar (GJ)', shipDate: '2026-07-19', transitDays: 2, zone: 'South', remarks: 'Mo-47Re sheet for IPR SST-1 fusion reactor divertor &#8594; 53% Mo 47% Re &#8594; &#8377;320Cr for 8 tonnes &#8594; 6mm plate 1,200&#176;C plasma-facing &#8594; India &#8377;10,500Cr fusion Mo-Re market &#8594; Re raises ductile-brittle transition to -100&#176;C &#8594; SST-1 steady-state tokamak operational 2028 &#8594; Neutron irradiation tolerance 50 dpa' },
  { id: 'MSA-0006', batchNo: 'MSA-B2406', city: 'Noida', manufacturer: 'Hindustan DRA (HDRA)', sheetType: 'Mo-14Re Sheet', application: 'CNC Tool Holder (Bharat Fritz Werner)', molybdenumPercent: 86, thicknessMm: 15, investmentCr: 72, status: 'Delivered', priority: 'High', origin: 'HDRA Noida (UP)', destination: 'BFW Pune (MH)', shipDate: '2026-07-16', transitDays: 2, zone: 'North', remarks: 'Mo-14Re tool holder for BFW CNC machining centre &#8594; 86% Mo &#8594; &#8377;72Cr for 2 tonnes plate &#8594; 15mm thick high stiffness &#8594; India &#8377;2,500Cr machine tool Mo market &#8594; Young modulus 330 GPa &#8594; 1.5x stiffer than steel 210 GPa &#8594; Vibration damping 2x steel' },
  { id: 'MSA-0007', batchNo: 'MSA-B2407', city: 'Kolkata', manufacturer: 'Hindustan Steel', sheetType: 'Mo-Cr Sheet (30%Cr)', application: 'Petrochemical Cracking Tube (Haldia Petro)', molybdenumPercent: 70, thicknessMm: 12, investmentCr: 185, status: 'Delivered', priority: 'High', origin: 'SAIL Durgapur (WB)', destination: 'Haldia Petrochemicals (WB)', shipDate: '2026-07-21', transitDays: 1, zone: 'East', remarks: 'Mo-Cr alloy tube sheet for Haldia petrochemical cracking furnace &#8594; 70% Mo 30% Cr &#8594; &#8377;185Cr for 6 tonnes &#8594; 12mm 900&#176;C carburising &#8594; India &#8377;6,200Cr petrochemical Mo market &#8594; 2x life vs HP40 cast alloy &#8594; Carburisation resistance 5x &#8594; Haldia 1.2 MMTPA ethylene cracker' },
  { id: 'MSA-0008', batchNo: 'MSA-B2408', city: 'Ahmedabad', manufacturer: 'Gujarat Fluorochemicals', sheetType: 'Mo Sputtering Target', application: 'TFT LCD Backplane (Micron India)', molybdenumPercent: 99.97, thicknessMm: 10, investmentCr: 142, status: 'Delivered', priority: 'High', origin: 'GFCL Vadodara (GJ)', destination: 'Micron India Hyderabad (TG)', shipDate: '2026-07-17', transitDays: 2, zone: 'West', remarks: 'High-purity Mo sputtering target for Micron TFT-LCD gate electrode &#8594; 99.97% Mo &#8594; &#8377;142Cr for 500 kg target &#8594; 10mm bonded to Cu backing &#8594; India &#8377;5,000Cr display target market &#8594; India 80 million TV panels/year &#8594; Mo sputter rate 5 nm/s at 500W DC &#8594; Sheet resistance 10 ohm/sq' },
  { id: 'MSA-0009', batchNo: 'MSA-B2409', city: 'Jaipur', manufacturer: 'Rajasthan Molybdenum Corp', sheetType: 'Mo-5SiB Sheet (Silicide)', application: 'Aero Turbine Seal (HAL)', molybdenumPercent: 87, thicknessMm: 3, investmentCr: 108, status: 'Delivered', priority: 'Critical', origin: 'RMC Jaipur (RJ)', destination: 'HAL Bengaluru (KA)', shipDate: '2026-07-23', transitDays: 3, zone: 'North', remarks: 'Mo-5SiB silicide sheet for HAL LCA Tejas turbine blade seal &#8594; 87% Mo 5Si 8B &#8594; &#8377;108Cr for 2 tonnes &#8594; 3mm 1,350&#176;C oxidation resistant &#8594; India &#8377;4,800Cr aero Mo-silicide &#8594; 10x oxidation resistance vs pure Mo &#8594; Silicide surface SiO2 protective scale &#8594; HAL 40 Tejas Mk-1A order' },
  { id: 'MSA-0010', batchNo: 'MSA-B2410', city: 'Coimbatore', manufacturer: 'Tamil Nadu Molybdenum Alloys', sheetType: 'Mo-Ni Clad Sheet', application: 'Solar Panel Frame (Vikram Solar)', molybdenumPercent: 75, thicknessMm: 2, investmentCr: 55, status: 'Delivered', priority: 'Medium', origin: 'TNMA Coimbatore (TN)', destination: 'Vikram Solar Kolkata (WB)', shipDate: '2026-07-14', transitDays: 2, zone: 'South', remarks: 'Mo-Ni clad sheet for Vikram Solar space-grade panel frame &#8594; 75% Mo &#8594; &#8377;55Cr for 1.5 tonnes &#8594; 2mm 200&#176;C solar space &#8594; India &#8377;2,000Cr space solar Mo market &#8594; ISRO 100 kW space solar planned &#8594; Mo-Ni 40% lighter than Al &#8594; Thermal expansion matched to GaAs cells' },
  { id: 'MSA-0011', batchNo: 'MSA-B2411', city: 'Bhubaneswar', manufacturer: 'Odisha Molybdenum Refinery', sheetType: 'Pure Mo Plate 25mm', application: 'Uranium Processing Crucible (UCIL)', molybdenumPercent: 99.9, thicknessMm: 25, investmentCr: 92, status: 'Delivered', priority: 'High', origin: 'OMR Bhubaneswar (OD)', destination: 'UCIL Jaduguda (JH)', shipDate: '2026-07-25', transitDays: 3, zone: 'East', remarks: 'Pure Mo crucible plate for UCIL uranium fuel pellet sintering &#8594; 99.9% Mo &#8594; &#8377;92Cr for 5 tonnes 25mm plate &#8594; 1,700&#176;C H2 sintering &#8594; India &#8377;3,500Cr nuclear Mo market &#8594; UCIL 7 uranium mines &#8594; Mo inert to UO2 at 1,700&#176;C &#8594; 500 sintering cycles crucible life' },
  { id: 'MSA-0012', batchNo: 'MSA-B2412', city: 'Guwahati', manufacturer: 'Assam Molybdenum Industries', sheetType: 'Mo-SiC Composite Sheet', application: 'Brake Disc (Bajaj Auto)', molybdenumPercent: 60, thicknessMm: 8, investmentCr: 68, status: 'Delayed', priority: 'High', origin: 'AMI Guwahati (AS)', destination: 'Bajaj Pune (MH)', shipDate: '2026-07-24', transitDays: 12, zone: 'East', remarks: 'Mo-SiC composite brake disc for Bajaj KTM Duke 390 &#8594; 60% Mo &#8594; &#8377;68Cr for 2 tonnes &#8594; 8mm 600&#176;C brake surface &#8594; 12d delay monsoon logistics &#8594; India &#8377;2,800Cr automotive Mo market &#8594; 40% weight saving vs cast iron &#8594; Fade-free braking at 400&#176;C &#8594; Bajaj 8 million two-wheelers/year' },
  { id: 'MSA-0013', batchNo: 'MSA-B2413', city: 'Gandhinagar', manufacturer: 'Gujarat Molybdenum Technologies', sheetType: 'Mo-Ir Clad Sheet (5%Ir)', application: 'Chlor-Alkali Anode (Grasim)', molybdenumPercent: 95, thicknessMm: 2, investmentCr: 145, status: 'Delivered', priority: 'High', origin: 'GMT Gandhinagar (GJ)', destination: 'Grasim Nagda (MP)', shipDate: '2026-07-26', transitDays: 2, zone: 'West', remarks: 'Mo-Ir clad anode for Grasim chlor-alkali membrane cell &#8594; 95% Mo 5% Ir &#8594; &#8377;145Cr for 3 tonnes &#8594; 2mm 80&#176;C 32% NaCl &#8594; India &#8377;5,200Cr chlor-alkali Mo market &#8594; India 35 MT chlor-alkali capacity &#8594; Ir-coated Mo anode 30% energy saving vs DSA &#8594; 8-year anode service life' },
  { id: 'MSA-0014', batchNo: 'MSA-B2414', city: 'Lucknow', manufacturer: 'UP Molybdenum Works', sheetType: 'Mo-Cu-W Laminate', application: 'LED Substrate (Cree India)', molybdenumPercent: 65, thicknessMm: 1, investmentCr: 78, status: 'Delivered', priority: 'High', origin: 'UMW Lucknow (UP)', destination: 'Cree India Gandhinagar (GJ)', shipDate: '2026-07-27', transitDays: 2, zone: 'North', remarks: 'Mo-Cu-W laminate for Cree GaN-on-SiC LED power substrate &#8594; 65% Mo &#8594; &#8377;78Cr for 1.5 tonnes &#8594; 1mm 250W LED thermal mgmt &#8594; India &#8377;3,000Cr LED Mo substrate market &#8594; India 2 billion LED bulbs/year &#8594; Thermal resistance 0.3 K/W &#8594; 1.5x heat dissipation vs Cu-Mo-Cu' }
]

export default function MolybdenumSheetLogisticsView() {
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
    return molybdenumRecords.filter(r => {
      const matchSearch = !searchQuery || Object.values(r).some(v => String(v).toLowerCase().includes(searchQuery.toLowerCase()))
      const matchFilters = Object.entries(filters).every(([key, values]) => values.includes(String(r[key as keyof MolybdenumSheetRecord])))
      return matchSearch && matchFilters
    })
  }, [searchQuery, filters])

  const totalInvestment = useMemo(() => molybdenumRecords.reduce((s: number, r) => s + r.investmentCr, 0), [])
  const avgMo = useMemo(() => (molybdenumRecords.reduce((s: number, r) => s + r.molybdenumPercent, 0) / molybdenumRecords.length).toFixed(1), [])
  const deliveredCount = useMemo(() => molybdenumRecords.filter(r => r.status === 'Delivered').length, [])
  const delayedCount = useMemo(() => molybdenumRecords.filter(r => r.status === 'Delayed').length, [])

  const uniqueCities = useMemo(() => [...new Set(molybdenumRecords.map(r => r.city))], [])
  const uniqueStatuses = useMemo(() => [...new Set(molybdenumRecords.map(r => r.status))], [])
  const uniqueManufacturers = useMemo(() => [...new Set(molybdenumRecords.map(r => r.manufacturer))], [])

  const cityInvestmentMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of molybdenumRecords) { map[r.city] = (map[r.city] || 0) + r.investmentCr }
    return map
  }, [])

  const thicknessMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of molybdenumRecords) { map[r.sheetType] = r.thicknessMm }
    return map
  }, [])

  const statusCountMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of molybdenumRecords) { map[r.status] = (map[r.status] || 0) + 1 }
    return map
  }, [])

  const zoneInvestmentMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of molybdenumRecords) { map[r.zone] = (map[r.zone] || 0) + r.investmentCr }
    return map
  }, [])

  const maxCity = useMemo(() => {
    const entries = (Object.entries(cityInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1])
    return entries[0] || ['N/A', 0]
  }, [cityInvestmentMap])

  const maxThickness = useMemo(() => {
    const entries = (Object.entries(thicknessMap) as [string, number][]).sort((a, b) => b[1] - a[1])
    return entries[0] || ['N/A', 0]
  }, [thicknessMap])

  const tabs = ['Dashboard', 'Registry', 'Analytics', 'Insights']

  return (
    <div className="space-y-6">
      <PageHeader title="Molybdenum Sheet Logistics" description="Molybdenum sheet, plate and foil supply chain for glass melting electrodes, rocket nozzles, semiconductor heat sinks, fusion reactor divertors, sputtering targets and LED substrates across India" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-600 bg-blue-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Total Investment</div><div className="text-2xl font-bold text-blue-800">&#8377;{totalInvestment.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground mt-1">Across {molybdenumRecords.length} batches</div></CardContent></Card>
        <Card className="border-l-4 border-l-blue-600 bg-blue-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Avg Mo Content</div><div className="text-2xl font-bold text-blue-800">{avgMo}%</div><div className="text-xs text-muted-foreground mt-1">Across all sheet types</div></CardContent></Card>
        <Card className="border-l-4 border-l-blue-600 bg-blue-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Delivered</div><div className="text-2xl font-bold text-blue-800">{deliveredCount}</div><div className="text-xs text-muted-foreground mt-1">{delayedCount} delayed</div></CardContent></Card>
        <Card className="border-l-4 border-l-blue-600 bg-blue-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Top City</div><div className="text-2xl font-bold text-blue-800">{maxCity[0]}</div><div className="text-xs text-muted-foreground mt-1">&#8377;{maxCity[1].toLocaleString()} Cr invested</div></CardContent></Card>
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
          <button key={tab} className={`px-4 py-2 text-sm font-medium ${activeTab === tab ? 'border-b-2 border-blue-600 text-blue-800' : 'text-muted-foreground'}`} onClick={() => setActiveTab(tab)}>{tab}</button>
        ))}
      </div>

      {activeTab === 'Dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">Investment by City</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(cityInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([city, val]) => (<div key={city} className="flex items-center gap-2"><span className="text-xs w-24 truncate">{city}</span><div className="flex-1 bg-blue-100 rounded-full h-3"><div className="bg-blue-600 h-3 rounded-full" style={{ width: `${(val / maxCity[1]) * 100}%` }}></div></div><span className="text-xs font-medium w-20 text-right">&#8377;{val} Cr</span></div>))}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Sheet Thickness by Type</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(thicknessMap) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([type, mm]) => (<div key={type} className="flex items-center gap-2"><span className="text-xs w-36 truncate">{type}</span><div className="flex-1 bg-sky-100 rounded-full h-3"><div className="bg-sky-600 h-3 rounded-full" style={{ width: `${(mm / maxThickness[1]) * 100}%` }}></div></div><span className="text-xs font-medium w-16 text-right">{mm}mm</span></div>))}</CardContent></Card>
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
              <thead><tr className="border-b"><th className="text-left p-2">Batch</th><th className="text-left p-2">City</th><th className="text-left p-2">Manufacturer</th><th className="text-left p-2">Sheet Type</th><th className="text-left p-2">Application</th><th className="text-left p-2">Mo%</th><th className="text-left p-2">mm</th><th className="text-left p-2">&#8377;Cr</th><th className="text-left p-2">Status</th></tr></thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id} className={`border-b ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}>
                    <td className="p-2 font-mono text-xs">{r.batchNo}</td>
                    <td className="p-2">{r.city}</td>
                    <td className="p-2">{r.manufacturer}</td>
                    <td className="p-2">{r.sheetType}</td>
                    <td className="p-2 max-w-[200px] truncate">{r.application}</td>
                    <td className="p-2">{r.molybdenumPercent}%</td>
                    <td className="p-2">{r.thicknessMm}mm</td>
                    <td className="p-2 font-medium">&#8377;{r.investmentCr}</td>
                    <td className="p-2"><Badge variant={r.status === 'Delivered' ? 'default' : r.status === 'Delayed' ? 'destructive' : 'secondary'}>{r.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card><CardHeader><CardTitle className="text-sm">Mo Content by Sheet</CardTitle></CardHeader><CardContent className="space-y-2">{molybdenumRecords.slice(0, 8).map(r => (<div key={r.id} className="flex items-center gap-2"><span className="text-xs w-36 truncate">{r.sheetType}</span><div className="flex-1 bg-blue-100 rounded-full h-3"><div className="bg-blue-600 h-3 rounded-full" style={{ width: `${Math.min((r.molybdenumPercent / 100) * 100, 100)}%` }}></div></div><span className="text-xs font-medium w-16 text-right">{r.molybdenumPercent}%</span></div>))}</CardContent></Card>
            <Card><CardHeader><CardTitle className="text-sm">Investment by Zone</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(zoneInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([zone, val]) => (<div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone}</span><div className="flex-1 bg-sky-100 rounded-full h-3"><div className="bg-sky-600 h-3 rounded-full" style={{ width: `${(val / maxCity[1]) * 100}%` }}></div></div><span className="text-xs font-medium w-20 text-right">&#8377;{val} Cr</span></div>))}</CardContent></Card>
          </div>
        </div>
      )}

      {activeTab === 'Analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">Status Distribution</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(statusCountMap) as [string, number][]).map(([status, count]) => (<div key={status} className="flex items-center gap-2"><span className="text-xs w-24">{status}</span><div className="flex-1 bg-blue-100 rounded-full h-3"><div className="bg-blue-600 h-3 rounded-full" style={{ width: `${(count / molybdenumRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Priority Breakdown</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const map: Record<string, number> = {}; for (const r of molybdenumRecords) { map[r.priority] = (map[r.priority] || 0) + 1 } const sorted = (Object.entries(map) as [string, number][]).sort((a, b) => b[1] - a[1]); return sorted.map(([pri, count]) => (<div key={pri} className="flex items-center gap-2"><span className="text-xs w-20">{pri}</span><div className="flex-1 bg-amber-100 rounded-full h-3"><div className="bg-amber-600 h-3 rounded-full" style={{ width: `${(count / molybdenumRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))})()}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Shipment Volume by Zone</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const map: Record<string, number> = {}; for (const r of molybdenumRecords) { map[r.zone] = (map[r.zone] || 0) + 1 } const sorted = (Object.entries(map) as [string, number][]).sort((a, b) => b[1] - a[1]); return sorted.map(([zone, count]) => (<div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone}</span><div className="flex-1 bg-indigo-100 rounded-full h-3"><div className="bg-indigo-600 h-3 rounded-full" style={{ width: `${(count / molybdenumRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))})()}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Sheet Category Distribution</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const cats: Record<string, number> = { 'TZM Alloy': 0, 'Pure Mo': 0, 'Mo-Re Fusion': 0, 'Mo-Cu Composite': 0, 'Mo-Cr Petrochem': 0, 'Mo-Silicide Aero': 0, 'Mo Sputter Target': 0, 'Mo Clad Laminate': 0 }; for (const r of molybdenumRecords) { if (r.sheetType.includes('TZM')) cats['TZM Alloy']++; else if (r.sheetType.includes('La2O3') || r.sheetType.includes('99.95') || r.sheetType.includes('99.9') || r.sheetType.includes('Pure Mo')) cats['Pure Mo']++; else if (r.sheetType.includes('Re')) cats['Mo-Re Fusion']++; else if (r.sheetType.includes('Cu') || r.sheetType.includes('Laminate')) cats['Mo-Cu Composite']++; else if (r.sheetType.includes('Cr')) cats['Mo-Cr Petrochem']++; else if (r.sheetType.includes('SiB') || r.sheetType.includes('SiC')) cats['Mo-Silicide Aero']++; else if (r.sheetType.includes('Sputter')) cats['Mo Sputter Target']++; else cats['Mo Clad Laminate']++ } return (Object.entries(cats) as [string, number][]).map(([cat, count]) => { const pct = `${(count / molybdenumRecords.length) * 100}%`; return <div key={cat} className="flex items-center gap-2"><span className="text-xs w-28">{cat}</span><div className="flex-1 bg-blue-100 rounded-full h-3"><div className="bg-blue-600 h-3 rounded-full" style={{ width: pct }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div> })})()}</CardContent></Card>
        </div>
      )}

      {activeTab === 'Insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-l-4 border-l-blue-600"><CardHeader><CardTitle className="text-sm">TZM Electrodes: India Float Glass &#8377;5,800Cr</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>TZM molybdenum alloy (Mo-0.5Ti-0.08Zr) is India&apos;s indispensable glass melting electrode material for all 12 float glass lines operated by Asahi India, Saint-Gobain, GoldPlus (Modi group) and AIS Glass. TZM electrodes immersed in molten glass at 1,600&#176;C provide Joule heating to maintain uniform glass melt temperature, with 10x the creep strength of pure molybdenum at this temperature. India&apos;s float glass Mo electrode market is &#8377;5,800Cr, with MIDHANI as the sole indigenous supplier producing 120 tonnes/year of TZM sheet and forgings. Each float glass line requires 15-20 tonnes of TZM electrodes, with a service life of 5 years before replacement. India&apos;s flat glass production of 14 MMTPA (growing 8% CAGR with solar glass demand from Adani Green and ReNew Power) directly drives TZM electrode consumption growth. TZM&apos;s advantage over pure Mo is its fine TiC/ZrC dispersoid precipitates that prevent grain boundary sliding at 1,600&#176;C.</p></CardContent></Card>
          <Card className="border-l-4 border-l-rose-500"><CardHeader><CardTitle className="text-sm">Mo-Re Fusion: SST-1 Tokamak &#8377;10,500Cr</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>Molybdenum-rhenium alloy (Mo-47Re) sheet is the primary candidate for India&apos;s SST-1 steady-state tokamak divertor and first-wall plasma-facing components at IPR Gandhinagar, operating at 1,200&#176;C under 14 MeV neutron irradiation. The 47% Re addition transforms Mo&apos;s ductile-brittle transition temperature (DBTT) from +40&#176;C (pure Mo) to -100&#176;C (Mo-47Re), making the alloy ductile at room temperature and eliminating catastrophic brittle fracture risk during thermal cycling. India&apos;s fusion Mo-Re programme is &#8377;10,500Cr, with IGCAR Kalpakkam producing Mo-47Re sheet via powder metallurgy and electron beam welding. SST-1 is scheduled for steady-state operation by 2028, with a subsequent DEMO fusion reactor (500 MW) requiring &#8377;50,000Cr of Mo-Re components by 2040. Neutron irradiation tolerance of 50 dpa (displacements per atom) has been demonstrated on Mo-47Re test samples at IGCAR&apos;s fast neutron facility.</p></CardContent></Card>
          <Card className="border-l-4 border-l-sky-500"><CardHeader><CardTitle className="text-sm">Mo Sputtering Targets: Display &#8377;5,000Cr</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>High-purity molybdenum sputtering targets (99.97% Mo) are critical for TFT-LCD and OLED display manufacturing in India, serving as the gate electrode and source/drain metallisation layer on 80 million TV panels and 300 million smartphone screens produced annually. Micron India (Hyderabad), Samsung Display (Noida) and BOE India together consume 500+ kg of Mo sputtering targets annually, with each 10mm-thick target bonded to a copper backing plate for thermal management during DC magnetron sputtering at 500W. India&apos;s display target market is &#8377;5,000Cr, growing at 22% CAGR as India becomes the world&apos;s 2nd largest display manufacturing hub. Mo&apos;s advantages as a sputtering target include: high density (10.28 g/cc) for efficient sputter yield, low resistivity (5.5 micro-ohm-cm) for low-voltage TFT operation, and excellent step coverage on high-aspect-ratio contact holes. Gujarat Fluorochemicals has started indigenous Mo target production using vacuum arc remelting (VAR) for grain size control.</p></CardContent></Card>
          <Card className="border-l-4 border-l-amber-500"><CardHeader><CardTitle className="text-sm">Mo-SiB Aero: HAL Tejas Turbine Seal &#8377;4,800Cr</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>Molybdenum silicide (Mo-5SiB, T2 phase) sheet is DRDO DMRL&apos;s breakthrough oxidation-resistant molybdenum alloy for HAL Tejas LCA turbine blade shroud seals, operating at 1,350&#176;C in the high-pressure turbine section where conventional Ni-superalloy (Inconel 718) is limited to 1,100&#176;C. The Mo-SiB intermetallic forms a protective SiO2 glass scale at 1,350&#176;C that provides 10x the oxidation resistance of pure molybdenum (which catastrophically evaporates as MoO3 above 700&#176;C). India&apos;s aerospace Mo-silicide programme is &#8377;4,800Cr, with Rajasthan Molybdenum Corp producing Mo-5SiB sheet via powder metallurgy and hot isostatic pressing (HIP). HAL&apos;s Tejas Mk-1A order of 40 aircraft (plus 80 Mk-2 planned) drives sustained demand for Mo-SiB turbine seals, with each engine requiring 12 seal inserts. DRDO is developing Mo-SiB-TiB2 ternary composites for 1,500&#176;C capability on the AMCA fifth-generation fighter programme.</p></CardContent></Card>
        </div>
      )}
    </div>
  )
}
