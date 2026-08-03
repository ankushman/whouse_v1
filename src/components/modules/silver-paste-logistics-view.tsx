'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { Star } from 'lucide-react'

interface SilverPasteRecord {
  id: string
  batchNo: string
  city: string
  manufacturer: string
  pasteType: string
  application: string
  silverPercent: number
  viscosityPaS: number
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

const silverRecords: SilverPasteRecord[] = [
  { id: 'SPS-0001', batchNo: 'SPS-B2401', city: 'Bengaluru', manufacturer: 'Heraeus India', pasteType: 'Silver Epoxy (87% Ag)', application: 'Die Attach (TI India)', silverPercent: 87, viscosityPaS: 35, investmentCr: 225, status: 'Delivered', priority: 'Critical', origin: 'Heraeus Bengaluru (KA)', destination: 'TI India Bengaluru (KA)', shipDate: '2026-07-18', transitDays: 1, zone: 'South', remarks: '87% Ag epoxy paste for power IGBT die attach on DBC substrate &#8594; 35 PaS viscosity screen printable &#8594; &#8377;225Cr for 2.5 tonnes Ag epoxy &#8594; TI India producing 500M power semiconductors/year &#8594; Ag epoxy thermal conductivity 35 W/mK &#8594; India &#8377;18,000Cr semiconductor packaging market &#8594; &#8377;15,200Cr Indian die attach Ag paste demand' },
  { id: 'SPS-0002', batchNo: 'SPS-B2402', city: 'Hyderabad', manufacturer: 'DuPont India', pasteType: 'Ag Thick Film (75% Ag)', application: 'Solar Cell Front Contact (Tata Power Solar)', silverPercent: 75, viscosityPaS: 85, investmentCr: 312, status: 'In Transit', priority: 'Critical', origin: 'DuPont Hyderabad (TS)', destination: 'Tata Power Solar Nellore (AP)', shipDate: '2026-07-22', transitDays: 1, zone: 'South', remarks: '75% Ag thick film paste for crystalline silicon solar cell metallization &#8594; 85 PaS viscosity for 80 micron line width &#8594; &#8377;312Cr for 4 tonnes Ag thick film &#8594; India 12 GW solar cell production by 2026 &#8594; Ag paste 100mg per cell front bus bar + fingers &#8594; India 3rd largest solar PV manufacturer globally &#8594; &#8377;22,500Cr Indian solar Ag paste demand' },
  { id: 'SPS-0003', batchNo: 'SPS-B2403', city: 'Mumbai', manufacturer: 'MacDermid Alpha India', pasteType: 'Solder Paste SAC305 (96.5Sn-3Ag-0.5Cu)', application: 'SMT Reflow (Foxconn Sri City)', silverPercent: 3, viscosityPaS: 180, investmentCr: 145, status: 'Delivered', priority: 'High', origin: 'Alpha Mumbai (MH)', destination: 'Foxconn Sri City (AP)', shipDate: '2026-07-19', transitDays: 3, zone: 'West', remarks: 'SAC305 solder paste for SMT BGA reflow assembly &#8594; 3% Ag in Sn-Ag-Cu lead-free solder &#8594; &#8377;145Cr for 8 tonnes SAC305 paste &#8594; Foxconn 500,000 smartphone PCBs/day &#8594; SAC305 melting point 217&#176;C IMC Cu6Sn5 + Ag3Sn &#8594; India SMT assembly 800M units/year &#8594; &#8377;10,800Cr Indian solder paste demand' },
  { id: 'SPS-0004', batchNo: 'SPS-B2404', city: 'Pune', manufacturer: 'Indium Corp India', pasteType: 'Ag Sinter Paste (90% Ag Nanoparticle)', application: 'SiC Module Sintering (Bharat Forge EV)', silverPercent: 90, viscosityPaS: 22, investmentCr: 385, status: 'Delayed', priority: 'Critical', origin: 'Indium Pune (MH)', destination: 'Bharat Forge Pune (MH)', shipDate: '2026-07-12', transitDays: 1, zone: 'West', remarks: '90% Ag nanoparticle sinter paste for SiC power module bonding &#8594; 22 PaS low viscosity sinter paste &#8594; &#8377;385Cr for 1.8 tonnes Ag nanoparticle paste &#8594; Bharat Forge SiC inverter for EV powertrain &#8594; Ag sinter 200&#176;C joint vs solder 250&#176;C &#8594; Delayed 10 days due to Ag nanoparticle import clearance &#8594; &#8377;28,000Cr Indian EV Ag sinter demand' },
  { id: 'SPS-0005', batchNo: 'SPS-B2405', city: 'Chennai', manufacturer: 'Samsung SDI India', pasteType: 'Ag Conductive Adhesive (82% Ag)', application: 'LED Chip Bonding (Samsung LED Chennai)', silverPercent: 82, viscosityPaS: 45, investmentCr: 178, status: 'Processing', priority: 'High', origin: 'Samsung SDI Chennai (TN)', destination: 'Samsung LED Chennai (TN)', shipDate: '2026-07-25', transitDays: 0, zone: 'South', remarks: '82% Ag isotropic conductive adhesive for SMD LED die bonding &#8594; 45 PaS viscosity for dispensing &#8594; &#8377;178Cr for 3.5 tonnes Ag ICA &#8594; Samsung LED Chennai 500M LED chips/year &#8594; Ag ICA resistivity 0.001 ohm-cm &#8594; India LED lighting market &#8377;25,000Cr &#8594; &#8377;13,500Cr Indian LED Ag paste demand' },
  { id: 'SPS-0006', batchNo: 'SPS-B2406', city: 'Noida', manufacturer: 'DRDO DMRL', pasteType: 'Ag Brazing Paste (65% Ag)', application: 'Aero Engine Brazing (HAL Bengaluru)', silverPercent: 65, viscosityPaS: 55, investmentCr: 198, status: 'Delivered', priority: 'Critical', origin: 'DMRL Hyderabad (TS)', destination: 'HAL Bengaluru (KA)', shipDate: '2026-07-17', transitDays: 2, zone: 'North', remarks: '65% Ag vacuum brazing paste for aero engine turbine blade repair &#8594; 55 PaS for torch and furnace brazing &#8594; &#8377;198Cr for 4.5 tonnes Ag braze paste &#8594; HAL overhauling 200 GE F404 and HTFE-2B20 engines &#8594; Ag-Cu braze joint strength 350 MPa &#8594; India aerospace engine MRO &#8377;12,000Cr &#8594; &#8377;15,000Cr Indian aero Ag braze demand' },
  { id: 'SPS-0007', batchNo: 'SPS-B2407', city: 'Kolkata', manufacturer: 'Johnson Matthey India', pasteType: 'Ag Conductive Ink (70% Flake Ag)', application: 'Printed RFID Antenna (JMI Kolkata)', silverPercent: 70, viscosityPaS: 12, investmentCr: 85, status: 'In Transit', priority: 'Medium', origin: 'JMI Kolkata (WB)', destination: 'Avaada Noida (UP)', shipDate: '2026-07-21', transitDays: 3, zone: 'East', remarks: '70% Ag flake ink for flexographic RFID antenna printing &#8594; 12 PaS low viscosity for roll-to-roll printing &#8594; &#8377;85Cr for 1.2 tonnes Ag conductive ink &#8594; India 2 billion RFID tags/year market &#8594; Ag ink conductivity 5E6 S/m at 10 micron film &#8594; India printed electronics &#8377;8,500Cr &#8594; &#8377;6,200Cr Indian printed Ag ink demand' },
  { id: 'SPS-0008', batchNo: 'SPS-B2408', city: 'Ahmedabad', manufacturer: 'Gujarat Fluorochemicals Ltd', pasteType: 'Ag Paste PV Rear (72% Ag)', application: 'PERC Solar Cell (Waaree Solar)', silverPercent: 72, viscosityPaS: 75, investmentCr: 265, status: 'Delivered', priority: 'Critical', origin: 'Heraeus Bengaluru (KA)', destination: 'Waaree Solar Surat (GJ)', shipDate: '2026-07-16', transitDays: 1, zone: 'West', remarks: '72% Ag paste for PERC solar cell rear passivated contact &#8594; 75 PaS for rear Al paste + Ag paste &#8594; &#8377;265Cr for 5 tonnes PERC Ag paste &#8594; Waaree 3 GW cell production &#8594; PERC efficiency 23.5% with Ag rear contact &#8594; India PERC transition complete by 2027 &#8594; &#8377;20,000Cr Indian PERC Ag demand' },
  { id: 'SPS-0009', batchNo: 'SPS-B2409', city: 'Jaipur', manufacturer: 'Rajasthan State Mines', pasteType: 'Ag Bio Paste (60% Ionic Ag)', application: 'Antimicrobial Coating (RSMS Jaipur)', silverPercent: 60, viscosityPaS: 8, investmentCr: 32, status: 'Processing', priority: 'Low', origin: 'RSMS Jaipur (RJ)', destination: 'Medikab Noida (UP)', shipDate: '2026-07-24', transitDays: 2, zone: 'North', remarks: '60% ionic Ag antimicrobial coating paste for hospital surfaces &#8594; 8 PaS spray-coatable bio-active paste &#8594; &#8377;32Cr for 800 kg Ag bio paste &#8594; India 80,000 hospitals antimicrobial surface market &#8594; Ag bio coating 99.99% bacteria kill in 2hr &#8594; India healthcare infection control &#8377;4,500Cr &#8594; &#8377;2,800Cr Indian antimicrobial Ag demand' },
  { id: 'SPS-0010', batchNo: 'SPS-B2410', city: 'Coimbatore', manufacturer: 'IIT Madras', pasteType: 'Ag Nanowire Ink (55% Ag NW)', application: 'Flexible Touch Sensor (IIT Madras)', silverPercent: 55, viscosityPaS: 6, investmentCr: 15, status: 'Delivered', priority: 'Low', origin: 'IIT Madras (TN)', destination: 'Flexmitral Bengaluru (KA)', shipDate: '2026-07-18', transitDays: 2, zone: 'South', remarks: '55% Ag nanowire transparent conductive ink for flexible touch panel &#8594; 6 PaS ultralow viscosity slot-die coating &#8594; &#8377;15Cr for 200 kg Ag NW ink &#8594; IIT Madras flexible electronics programme &#8594; Ag NW sheet resistance 15 ohm/sq at 85% transmittance &#8594; India flexible display emerging market &#8594; &#8377;1,200Cr Indian flexible Ag ink demand' },
  { id: 'SPS-0011', batchNo: 'SPS-B2411', city: 'Bhubaneswar', manufacturer: 'NALCO', pasteType: 'Ag Metallization Paste (68% Ag)', application: 'Thin Film Solar (NALCO Angul)', silverPercent: 68, viscosityPaS: 95, investmentCr: 92, status: 'In Transit', priority: 'Medium', origin: 'Heraeus Bengaluru (KA)', destination: 'NALCO Angul (OD)', shipDate: '2026-07-23', transitDays: 3, zone: 'East', remarks: '68% Ag paste for CIGS thin film solar cell Mo/Ag grid &#8594; 95 PaS viscosity for fine line printing &#8594; &#8377;92Cr for 1.5 tonnes CIGS Ag paste &#8594; NALCO diversifying into CIGS thin film &#8594; CIGS efficiency 20.8% lab record with Ag grid &#8594; India thin film solar pilot 100 MW &#8594; &#8377;7,500Cr Indian TF Ag paste demand' },
  { id: 'SPS-0012', batchNo: 'SPS-B2412', city: 'Guwahati', manufacturer: 'Oil India Ltd', pasteType: 'Ag EMI Shielding Paste (40% Flake Ag)', application: 'Radar Enclosure Shield (BEL Guwahati)', silverPercent: 40, viscosityPaS: 28, investmentCr: 48, status: 'Delayed', priority: 'Medium', origin: 'JMI Kolkata (WB)', destination: 'BEL Guwahati (AS)', shipDate: '2026-07-11', transitDays: 3, zone: 'East', remarks: '40% Ag flake EMI shielding paste for radar enclosure seam &#8594; 28 PaS screen-printable EMI paste &#8594; &#8377;48Cr for 1.2 tonnes Ag EMI paste &#8594; BEL Swathi radar production 12 units/year &#8594; Ag EMI shielding SE 80 dB at 1 GHz &#8594; Delayed 12 days due to monsoon &#8594; &#8377;3,500Cr Indian defence Ag EMI demand' },
  { id: 'SPS-0013', batchNo: 'SPS-B2413', city: 'Gandhinagar', manufacturer: 'Adani Defence', pasteType: 'Ag Solder Wire (4% Ag)', application: 'Guided Wire Bond (Adani Defence)', silverPercent: 4, viscosityPaS: 0, investmentCr: 28, status: 'Processing', priority: 'High', origin: 'Indium Pune (MH)', destination: 'Adani Defence Gandhinagar (GJ)', shipDate: '2026-07-26', transitDays: 2, zone: 'West', remarks: '4% Ag solder wire 25 micron for precision wire bonding &#8594; Wire diameter 25 micron Ag alloy &#8594; &#8377;28Cr for 200 km of Ag bonding wire &#8594; Adani Defence missile guidance PCB assembly &#8594; Ag wire bond pull strength 8g per wire &#8594; India defence electronics &#8377;22,000Cr &#8594; &#8377;2,200Cr Indian wire bond Ag demand' },
  { id: 'SPS-0014', batchNo: 'SPS-B2414', city: 'Lucknow', manufacturer: 'TASL', pasteType: 'Ag Flip Chip Paste (85% Ag Solder Ball)', application: 'Satellite ASIC (TASL-ISRO)', silverPercent: 85, viscosityPaS: 42, investmentCr: 295, status: 'Delivered', priority: 'Critical', origin: 'Indium Pune (MH)', destination: 'ISRO URSC Bengaluru (KA)', shipDate: '2026-07-23', transitDays: 2, zone: 'North', remarks: '85% Ag flip chip solder paste for satellite ASIC BGA assembly &#8594; 42 PaS for 150 micron bump stencil printing &#8594; &#8377;295Cr for 1.5 tonnes Ag flip chip paste &#8594; ISRO 12 GSAT satellites ASIC assembly &#8594; Flip chip joint reliability 30yr in GEO &#8594; TASL-ISRO JV space electronics &#8594; &#8377;22,000Cr Indian space Ag paste demand' },
]

const tabs = ['Dashboard', 'Registry', 'Analytics', 'Insights'] as const
type TabType = typeof tabs[number]

export default function SilverPasteLogisticsView() {
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
    return silverRecords.filter(r => {
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

  const uniqueCities = useMemo(() => [...new Set(silverRecords.map(r => r.city))].sort(), [])
  const uniqueManufacturers = useMemo(() => [...new Set(silverRecords.map(r => r.manufacturer))].sort(), [])
  const uniqueStatuses = useMemo(() => [...new Set(silverRecords.map(r => r.status))].sort(), [])
  const uniqueZones = useMemo(() => [...new Set(silverRecords.map(r => r.zone))].sort(), [])

  const totalInvestment = useMemo(() => silverRecords.reduce((s: number, r) => s + r.investmentCr, 0), [])
  const avgAg = useMemo(() => Math.round(silverRecords.reduce((s: number, r) => s + r.silverPercent, 0) / silverRecords.length), [])
  const deliveredCount = useMemo(() => silverRecords.filter(r => r.status === 'Delivered').length, [])
  const delayedCount = useMemo(() => silverRecords.filter(r => r.status === 'Delayed').length, [])

  const cityInvestmentMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of silverRecords) { map[r.city] = (map[r.city] || 0) + r.investmentCr }
    return map
  }, [])

  const pasteAgMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of silverRecords) { map[r.pasteType] = (map[r.pasteType] || 0) + r.silverPercent }
    return map
  }, [])

  const statusCountMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of silverRecords) { map[r.status] = (map[r.status] || 0) + 1 }
    return map
  }, [])

  const zoneInvestmentMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of silverRecords) { map[r.zone] = (map[r.zone] || 0) + r.investmentCr }
    return map
  }, [])

  const maxCity = useMemo(() => {
    const entries = (Object.entries(cityInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1])
    return entries[0] || ['N/A', 0]
  }, [cityInvestmentMap])

  const maxAgPaste = useMemo(() => {
    const entries = (Object.entries(pasteAgMap) as [string, number][]).sort((a, b) => b[1] - a[1])
    return entries[0] || ['N/A', 0]
  }, [pasteAgMap])

  return (
    <div className="space-y-6">
      <PageHeader title="Silver Paste Logistics" description="Silver paste, conductive ink and solder material supply chain for solar PV cells, semiconductor packaging, SMT assembly, LED bonding and aerospace brazing" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-slate-600 bg-slate-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Total Investment</div><div className="text-2xl font-bold text-slate-800">&#8377;{totalInvestment.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground mt-1">Across {silverRecords.length} batches</div></CardContent></Card>
        <Card className="border-l-4 border-l-slate-600 bg-slate-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Avg Ag Content</div><div className="text-2xl font-bold text-slate-800">{avgAg}%</div><div className="text-xs text-muted-foreground mt-1">Across all paste types</div></CardContent></Card>
        <Card className="border-l-4 border-l-slate-600 bg-slate-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Delivered</div><div className="text-2xl font-bold text-slate-800">{deliveredCount}</div><div className="text-xs text-muted-foreground mt-1">{delayedCount} delayed</div></CardContent></Card>
        <Card className="border-l-4 border-l-slate-600 bg-slate-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Top City</div><div className="text-2xl font-bold text-slate-800">{maxCity[0]}</div><div className="text-xs text-muted-foreground mt-1">&#8377;{maxCity[1].toLocaleString()} Cr invested</div></CardContent></Card>
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
          <button key={tab} className={`px-4 py-2 text-sm font-medium ${activeTab === tab ? 'border-b-2 border-slate-600 text-slate-800' : 'text-muted-foreground'}`} onClick={() => setActiveTab(tab)}>{tab}</button>
        ))}
      </div>

      {activeTab === 'Dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">Investment by City</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(cityInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([city, val]) => (<div key={city} className="flex items-center gap-2"><span className="text-xs w-24 truncate">{city}</span><div className="flex-1 bg-slate-200 rounded-full h-3"><div className="bg-slate-600 h-3 rounded-full" style={{ width: `${(val / maxCity[1]) * 100}%` }}></div></div><span className="text-xs font-medium w-20 text-right">&#8377;{val} Cr</span></div>))}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Ag Content by Paste Type</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(pasteAgMap) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([typ, ag]) => (<div key={typ} className="flex items-center gap-2"><span className="text-xs w-36 truncate">{typ}</span><div className="flex-1 bg-gray-200 rounded-full h-3"><div className="bg-gray-600 h-3 rounded-full" style={{ width: `${(ag / maxAgPaste[1]) * 100}%` }}></div></div><span className="text-xs font-medium w-12 text-right">{ag}%</span></div>))}</CardContent></Card>
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
              <thead><tr className="border-b"><th className="text-left p-2">Batch</th><th className="text-left p-2">City</th><th className="text-left p-2">Manufacturer</th><th className="text-left p-2">Paste Type</th><th className="text-left p-2">Application</th><th className="text-left p-2">Ag%</th><th className="text-left p-2">Visc</th><th className="text-left p-2">&#8377;Cr</th><th className="text-left p-2">Status</th></tr></thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id} className={`border-b ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}>
                    <td className="p-2 font-mono text-xs">{r.batchNo}</td>
                    <td className="p-2">{r.city}</td>
                    <td className="p-2">{r.manufacturer}</td>
                    <td className="p-2">{r.pasteType}</td>
                    <td className="p-2 max-w-[200px] truncate">{r.application}</td>
                    <td className="p-2">{r.silverPercent}%</td>
                    <td className="p-2">{r.viscosityPaS}</td>
                    <td className="p-2 font-medium">&#8377;{r.investmentCr}</td>
                    <td className="p-2"><Badge variant={r.status === 'Delivered' ? 'default' : r.status === 'Delayed' ? 'destructive' : 'secondary'}>{r.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card><CardHeader><CardTitle className="text-sm">Viscosity by Paste</CardTitle></CardHeader><CardContent className="space-y-2">{silverRecords.slice(0, 8).map(r => (<div key={r.id} className="flex items-center gap-2"><span className="text-xs w-36 truncate">{r.pasteType}</span><div className="flex-1 bg-zinc-100 rounded-full h-3"><div className="bg-zinc-500 h-3 rounded-full" style={{ width: `${Math.min((r.viscosityPaS / 180) * 100, 100)}%` }}></div></div><span className="text-xs font-medium w-16 text-right">{r.viscosityPaS} PaS</span></div>))}</CardContent></Card>
            <Card><CardHeader><CardTitle className="text-sm">Investment by Zone</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(zoneInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([zone, val]) => (<div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone}</span><div className="flex-1 bg-neutral-200 rounded-full h-3"><div className="bg-neutral-600 h-3 rounded-full" style={{ width: `${(val / maxCity[1]) * 100}%` }}></div></div><span className="text-xs font-medium w-20 text-right">&#8377;{val} Cr</span></div>))}</CardContent></Card>
          </div>
        </div>
      )}

      {activeTab === 'Analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">Status Distribution</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(statusCountMap) as [string, number][]).map(([status, count]) => (<div key={status} className="flex items-center gap-2"><span className="text-xs w-24">{status}</span><div className="flex-1 bg-gray-100 rounded-full h-3"><div className="bg-slate-600 h-3 rounded-full" style={{ width: `${(count / silverRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Priority Breakdown</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const map: Record<string, number> = {}; for (const r of silverRecords) { map[r.priority] = (map[r.priority] || 0) + 1 } const sorted = (Object.entries(map) as [string, number][]).sort((a, b) => b[1] - a[1]); return sorted.map(([pri, count]) => (<div key={pri} className="flex items-center gap-2"><span className="text-xs w-20">{pri}</span><div className="flex-1 bg-red-100 rounded-full h-3"><div className="bg-red-500 h-3 rounded-full" style={{ width: `${(count / silverRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))})()}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Shipment Volume by Zone</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const map: Record<string, number> = {}; for (const r of silverRecords) { map[r.zone] = (map[r.zone] || 0) + 1 } const sorted = (Object.entries(map) as [string, number][]).sort((a, b) => b[1] - a[1]); return sorted.map(([zone, count]) => (<div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone}</span><div className="flex-1 bg-teal-100 rounded-full h-3"><div className="bg-teal-500 h-3 rounded-full" style={{ width: `${(count / silverRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))})()}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Ag Content Range Distribution</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const ranges: Record<string, number> = { 'Below 10% (Solder)': 0, '10-50% (EMI/Print)': 0, '50-70% (Conductive Ink)': 0, '70%+ (High Ag Paste)': 0 }; for (const r of silverRecords) { if (r.silverPercent >= 70) ranges['70%+ (High Ag Paste)']++; else if (r.silverPercent >= 50) ranges['50-70% (Conductive Ink)']++; else if (r.silverPercent >= 10) ranges['10-50% (EMI/Print)']++; else ranges['Below 10% (Solder)']++ } return (Object.entries(ranges) as [string, number][]).map(([range, count]) => (<div key={range} className="flex items-center gap-2"><span className="text-xs w-32">{range}</span><div className="flex-1 bg-indigo-100 rounded-full h-3"><div className="bg-indigo-500 h-3 rounded-full" style={{ width: `${(count / silverRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))})()}</CardContent></Card>
        </div>
      )}

      {activeTab === 'Insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-l-4 border-l-slate-600"><CardHeader><CardTitle className="text-sm">Solar PV Silver Paste: India 3rd Largest Global Consumer</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>India&apos;s 12 GW solar PV cell manufacturing capacity makes it the world&apos;s 3rd largest consumer of silver paste for photovoltaic metallization, using approximately 1,200 tonnes of Ag paste per year. Each crystalline silicon cell requires 100mg of front-side Ag paste (75-82% Ag) printed as 40 micron-wide fingers and 2mm bus bars, with an additional 30mg for rear-side contacts in PERC cells. India&apos;s PERC transition is driving Ag paste demand growth at 25% CAGR, with Tata Power Solar, Waaree, Adani Solar and Vikram Solar collectively consuming &#8377;42,500Cr of Ag paste by 2027. Heraeus and DuPont dominate supply with 70% market share, creating strategic vulnerability for India&apos;s &#8377;1,20,000Cr solar manufacturing sector.</p></CardContent></Card>
          <Card className="border-l-4 border-l-amber-500"><CardHeader><CardTitle className="text-sm">Ag Sinter Paste: EV SiC Module Game-Changer</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>Silver sinter paste (90% Ag nanoparticle) is revolutionizing EV power electronics by replacing tin-lead solder with a 200&#176;C low-temperature sintering process that achieves 5x higher thermal conductivity (250 W/mK vs 50 W/mK) and 3x higher current cycling reliability. Bharat Forge, Tata AutoComp and Lucas TVS are adopting Ag sintering for SiC inverter modules in EV powertrains, where the joint temperature is reduced by 50&#176;C compared to solder. India&apos;s EV production target of 30 million vehicles by 2030 would require 50 tonnes of Ag nanoparticle sinter paste worth &#8377;28,000Cr. Indium Corporation and Heraeus are the primary suppliers, with DRDO developing indigenous Ag nanoparticle synthesis at DMRL.</p></CardContent></Card>
          <Card className="border-l-4 border-l-emerald-500"><CardHeader><CardTitle className="text-sm">SAC305 Solder Paste: 800M PCBs Per Year</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>India&apos;s electronics manufacturing ecosystem produces over 800 million PCB assemblies per year through Foxconn Sri City, Dixon Technologies, Amber Enterprises and 150+ EMS providers. SAC305 (96.5Sn-3Ag-0.5Cu) is the dominant lead-free solder paste with 3% silver content, specified by IPC J-STD-004 for all consumer electronics SMT reflow assembly. India imports 60% SAC305 paste from MacDermid Alpha (UK), Senju Metal (Japan) and Indium Corporation (USA), with growing domestic production by Heraeus Bengaluru and Nippo India. The PLI scheme for IT hardware targeting $50B production by 2030 will drive SAC305 solder paste demand to &#8377;10,800Cr, with 12 new SMT lines installed monthly.</p></CardContent></Card>
          <Card className="border-l-4 border-l-blue-500"><CardHeader><CardTitle className="text-sm">Space and Defence: Ag Brazing and Flip Chip</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>Silver brazing paste (65% Ag) is irreplaceable for aerospace engine turbine blade repair, with DRDO DMRL supplying Ag-Cu braze paste to HAL for overhauling 200 GE F404 (Tejas), Snecma M53 (Mirage) and Honeywell TFE-2B20 (Dhruv) engines. The 65% Ag braze achieves 350 MPa joint strength at 650&#176;C operating temperature. Simultaneously, Ag flip chip solder paste (85% Ag) is used by TASL-ISRO joint venture for satellite ASIC BGA assembly on 12 GSAT communication satellites, with 30-year reliability in geostationary orbit. India&apos;s combined aerospace and defence Ag paste demand is &#8377;37,000Cr, with DRDO developing indigenous Ag nanoparticle production to reduce import dependence.</p></CardContent></Card>
        </div>
      )}
    </div>
  )
}
