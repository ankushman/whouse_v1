'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { Atom } from 'lucide-react'

interface RareGasRecord {
  id: string
  batchNo: string
  city: string
  manufacturer: string
  gasType: string
  application: string
  purityPercent: number
  pressureBar: number
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

const rareGasRecords: RareGasRecord[] = [
  { id: 'RGA-0001', batchNo: 'RGA-B2401', city: 'Bengaluru', manufacturer: 'INOX Air Products', gasType: 'Helium 5N (99.999%)', application: 'MRI Cryogenics (Philips)', purityPercent: 99.999, pressureBar: 200, investmentCr: 185, status: 'Delivered', priority: 'Critical', origin: 'INOX Bengaluru (KA)', destination: 'Philips Healthcare Bengaluru (KA)', shipDate: '2026-07-18', transitDays: 1, zone: 'South', remarks: '5N helium for Philips Achieva 3.0T MRI superconducting magnet &#8594; 200 bar cylinder bank &#8594; India imports 95% helium from US Qatar Russia &#8594; &#8377;185Cr for 50,000 NLM &#8594; 3,200 MRI machines in India growing 12% CAGR &#8594; Helium-4 boil-off losses 0.5L/hr per scanner &#8594; India &#8377;8,500Cr medical helium market by 2028' },
  { id: 'RGA-0002', batchNo: 'RGA-B2402', city: 'Hyderabad', manufacturer: 'Bhuruka Gases', gasType: 'Argon 4N5 (99.995%)', application: 'TIG Welding Shield (L&T)', purityPercent: 99.995, pressureBar: 150, investmentCr: 142, status: 'Delivered', priority: 'High', origin: 'Bhuruka Hyderabad (TG)', destination: 'L&T Heavy Eng Hyderabad (TG)', shipDate: '2026-07-20', transitDays: 1, zone: 'South', remarks: '4N5 argon TIG welding shield gas for L&T pressure vessel fabrication &#8594; 150 bar quad-pack &#8594; 25,000 NLM argon for 80 welding stations &#8594; India &#8377;12,000Cr industrial argon market &#8594; TIG argon flow 15-25 LPM per torch &#8594; L&T fabricates 500-tonne reactor vessels &#8594; Argon recycling at 85% recovery rate' },
  { id: 'RGA-0003', batchNo: 'RGA-B2403', city: 'Mumbai', manufacturer: 'Linde India', gasType: 'Xenon 4N (99.99%)', application: 'Satellite Ion Thruster (ISRO)', purityPercent: 99.99, pressureBar: 50, investmentCr: 310, status: 'Delivered', priority: 'Critical', origin: 'Linde Mumbai (MH)', destination: 'ISRO LPSC Thiruvananthapuram (KL)', shipDate: '2026-07-15', transitDays: 3, zone: 'West', remarks: '4N xenon propellant for ISRO GSAT-N2 ion thruster &#8594; 50 bar high-pressure cylinder &#8594; 1,200 litres xenon per GSAT satellite &#8594; Specific impulse 3,100s vs chemical 320s &#8594; India &#8377;4,200Cr xenon demand for 18 planned Gsat &#8594; Xenon recovered from air separation at 1 ppm concentration &#8594; &#8377;310Cr for 2,000 litres ultra-pure xenon' },
  { id: 'RGA-0004', batchNo: 'RGA-B2404', city: 'Pune', manufacturer: 'Ellenbarrie Industrial Gases', gasType: 'Neon 5N (99.999%)', application: 'Excimer Laser (Coherent)', purityPercent: 99.999, pressureBar: 100, investmentCr: 95, status: 'Delayed', priority: 'High', origin: 'Ellenbarrie Pune (MH)', destination: 'Coherent India Pune (MH)', shipDate: '2026-07-22', transitDays: 10, zone: 'West', remarks: '5N neon gas for KrF excimer laser in semiconductor lithography &#8594; 100 bar cylinder &#8594; 8,000 litres neon per fill &#8594; Excimer laser 248nm wavelength &#8594; India &#8377;2,800Cr neon market for 12 planned fab lines &#8594; 10d delay due to Ukraine supply disruption &#8594; &#8377;95Cr for neon and cylinder handling' },
  { id: 'RGA-0005', batchNo: 'RGA-B2405', city: 'Chennai', manufacturer: 'National Oxygen Ltd', gasType: 'Krypton 4N (99.99%)', application: 'Insulated Window (Saint-Gobain)', purityPercent: 99.99, pressureBar: 80, investmentCr: 88, status: 'Delivered', priority: 'Medium', origin: 'NOL Chennai (TN)', destination: 'Saint-Gobain Chennai (TN)', shipDate: '2026-07-19', transitDays: 1, zone: 'South', remarks: '4N krypton for IGU double-glazed insulated glass units &#8594; 80 bar cylinder bank &#8594; Krypton fill 90% in 12mm spacer gap &#8594; Thermal conductivity 63% lower than air &#8594; India &#8377;3,200Cr insulated window market &#8594; Saint-Gobain 30 million m2 annual capacity &#8594; &#8377;88Cr for 5,000 litres krypton fill' },
  { id: 'RGA-0006', batchNo: 'RGA-B2406', city: 'Noida', manufacturer: 'Signature Gases India', gasType: 'Helium 4N5 (99.995%)', application: 'Leak Detection (GE Aviation)', purityPercent: 99.995, pressureBar: 200, investmentCr: 120, status: 'Delivered', priority: 'Critical', origin: 'Signature Noida (UP)', destination: 'GE Aviation Noida (UP)', shipDate: '2026-07-16', transitDays: 1, zone: 'North', remarks: '4N5 helium for GE Aviation aero engine leak detection &#8594; Mass spectrometer leak testing at 1E-9 mbar sensitivity &#8594; 200 bar helium supply for 8 leak test stations &#8594; GE produces LEAP engine components in India &#8594; &#8377;120Cr for 35,000 NLM &#8594; Each LEAP engine requires 72-hour helium leak test cycle &#8594; India &#8377;5,500Cr aero helium leak test market' },
  { id: 'RGA-0007', batchNo: 'RGA-B2407', city: 'Kolkata', manufacturer: 'BOC India (Linde)', gasType: 'Argon 3N5 (99.95%)', application: 'Steel Degassing (SAIL)', purityPercent: 99.95, pressureBar: 30, investmentCr: 65, status: 'Delivered', priority: 'High', origin: 'BOC Kolkata (WB)', destination: 'SAIL Durgapur (WB)', shipDate: '2026-07-21', transitDays: 1, zone: 'East', remarks: '3N5 argon for SAIL LD converter argon oxygen decarburization &#8594; 30 bar bulk liquid delivery &#8594; 100 tonnes argon per heat &#8594; AOD process reduces carbon to 0.01% &#8594; SAIL produces 5 MTPA stainless at Durgapur &#8594; &#8377;65Cr for monthly argon supply &#8594; India &#8377;9,000Cr steel argon market &#8594; Argon stirred ladle improves steel cleanliness' },
  { id: 'RGA-0008', batchNo: 'RGA-B2408', city: 'Ahmedabad', manufacturer: 'Gujarat Fluorochemicals', gasType: 'Helium 6N (99.9999%)', application: 'GCMX Cryo (Reliance)', purityPercent: 99.9999, pressureBar: 200, investmentCr: 245, status: 'Delivered', priority: 'Critical', origin: 'GFCL Dahej (GJ)', destination: 'Reliance Jio Ahmedabad (GJ)', shipDate: '2026-07-17', transitDays: 2, zone: 'West', remarks: '6N ultra-high purity helium for Reliance GCMX quantum computer dilution refrigerator &#8594; 200 bar ISO container &#8594; 10,000 litres liquid helium &#8594; Dilution fridge base temp 10mK &#8594; India 3 quantum computing hubs planned &#8594; &#8377;245Cr for 6N helium and cryo infrastructure &#8594; Quantum helium consumption 2,000L/day continuous &#8594; India &#8377;6,200Cr quantum helium market by 2030' },
  { id: 'RGA-0009', batchNo: 'RGA-B2409', city: 'Jaipur', manufacturer: 'Rajasthan State Gases', gasType: 'Argon 4N5 (99.995%)', application: 'Dental Alloy Casting (Dentsply)', purityPercent: 99.995, pressureBar: 150, investmentCr: 32, status: 'Delivered', priority: 'Medium', origin: 'RSG Jaipur (RJ)', destination: 'Dentsply Jaipur (RJ)', shipDate: '2026-07-23', transitDays: 1, zone: 'North', remarks: '4N5 argon for Dentsply dental implant titanium casting &#8594; 150 bar cylinder &#8594; Argon shielding prevents Ti oxidation at 1,700&#176;C &#8594; 5,000 NLM per month &#8594; India &#8377;1,800Cr dental argon market &#8594; &#8377;32Cr for monthly supply &#8594; Titanium dental implant 95% inert atmosphere casting &#8594; Dental lab argon consumption growing 18% CAGR' },
  { id: 'RGA-0010', batchNo: 'RGA-B2410', city: 'Coimbatore', manufacturer: 'Sri Varu Gases', gasType: 'Helium 4N (99.99%)', application: 'Fibre Optic Drawing (Sterlite)', purityPercent: 99.99, pressureBar: 180, investmentCr: 155, status: 'Delivered', priority: 'High', origin: 'SVG Coimbatore (TN)', destination: 'Sterlite Tech Coimbatore (TN)', shipDate: '2026-07-14', transitDays: 1, zone: 'South', remarks: '4N helium for Sterlite fibre optic preform drawing tower &#8594; 180 bar helium cooled furnace atmosphere &#8594; Drawing speed 2,000 m/min at 2,100&#176;C &#8594; 60 million km fibre produced annually in India &#8594; &#8377;155Cr for helium cooling 4 drawing towers &#8594; India &#8377;7,400Cr fibre optic helium market &#8594; Helium-cooled furnace prevents fibre attenuation &#8594; Sterlite 30% India fibre market share' },
  { id: 'RGA-0011', batchNo: 'RGA-B2411', city: 'Bhubaneswar', manufacturer: 'Orissa Gases Ltd', gasType: 'Xenon 3N (99.9%)', application: 'Medical Imaging CT (Siemens)', purityPercent: 99.9, pressureBar: 60, investmentCr: 178, status: 'Delivered', priority: 'Critical', origin: 'OGL Bhubaneswar (OD)', destination: 'Siemens Healthineers Bhubaneswar (OD)', shipDate: '2026-07-25', transitDays: 1, zone: 'East', remarks: '3N xenon for Siemens SOMATOM CT scanner xenon detector &#8594; 60 bar cylinder &#8594; Xenon gas detector high DQE &#8594; India 6,000 CT scanners installed &#8594; &#8377;178Cr for xenon supply 40 CT machines &#8594; Xenon anaesthesia also uses same grade &#8594; India &#8377;5,100Cr medical xenon market &#8594; Xenon imaging replaced by solid-state detectors trend &#8594; Still preferred for lung ventilation CT' },
  { id: 'RGA-0012', batchNo: 'RGA-B2412', city: 'Guwahati', manufacturer: 'Assam Air Products', gasType: 'Argon 4N (99.99%)', application: 'Oil Pipeline Purging (OIL)', purityPercent: 99.99, pressureBar: 120, investmentCr: 28, status: 'Delayed', priority: 'Medium', origin: 'AAP Guwahati (AS)', destination: 'Oil India Ltd Guwahati (AS)', shipDate: '2026-07-24', transitDays: 12, zone: 'East', remarks: '4N argon for OIL crude oil pipeline inert purging &#8594; 120 bar tube trailer &#8594; 20,000 NLM per purge cycle &#8594; Pipeline nitrogen-argon purge sequence &#8594; 12d delay monsoon logistics disruption &#8594; &#8377;28Cr for 3 purge operations &#8594; India 35,000 km oil gas pipeline network &#8594; Argon purge prevents explosive atmosphere &#8594; Quarterly purge maintenance schedule' },
  { id: 'RGA-0013', batchNo: 'RGA-B2413', city: 'Gandhinagar', manufacturer: 'Gujarat Petrochem Synthetics', gasType: 'Krypton 5N (99.999%)', application: 'Flash Lamp (Numerify Lasers)', purityPercent: 99.999, pressureBar: 70, investmentCr: 132, status: 'Delivered', priority: 'High', origin: 'GPS Gandhinagar (GJ)', destination: 'Numerify Gandhinagar (GJ)', shipDate: '2026-07-26', transitDays: 1, zone: 'West', remarks: '5N krypton for high-power krypton flash lamp pumped Nd:YAG laser &#8594; 70 bar flash lamp fill &#8594; Krypton flash spectral match to Nd:YAG absorption &#8594; 4,000 J per pulse industrial laser &#8594; India &#8377;3,800Cr industrial laser gas market &#8594; &#8377;132Cr for 200 flash lamps &#8594; Laser cutting welding market growing 22% &#8594; Krypton flash lamp lifetime 10M shots' },
  { id: 'RGA-0014', batchNo: 'RGA-B2414', city: 'Lucknow', manufacturer: 'UP State Oxygen Gases', gasType: 'Neon 4N (99.99%)', application: 'Neon Signage (Eveready)', purityPercent: 99.99, pressureBar: 15, investmentCr: 22, status: 'Delivered', priority: 'Low', origin: 'UPSOG Lucknow (UP)', destination: 'Eveready India Lucknow (UP)', shipDate: '2026-07-27', transitDays: 1, zone: 'North', remarks: '4N neon for high-voltage signage and plasma display tubes &#8594; 15 bar low-pressure fill &#8594; Neon discharge orange-red 585nm wavelength &#8594; India &#8377;1,200Cr neon signage market declining &#8594; &#8377;22Cr for 10,000 signage fills &#8594; LED signage replacing neon 8% annually &#8594; Heritage and premium signage still uses neon &#8594; 500 sign workshops in UP alone' }
]

export default function RareGasLogisticsView() {
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
    return rareGasRecords.filter(r => {
      const matchSearch = !searchQuery || Object.values(r).some(v => String(v).toLowerCase().includes(searchQuery.toLowerCase()))
      const matchFilters = Object.entries(filters).every(([key, values]) => values.includes(String(r[key as keyof RareGasRecord])))
      return matchSearch && matchFilters
    })
  }, [searchQuery, filters])

  const totalInvestment = useMemo(() => rareGasRecords.reduce((s: number, r) => s + r.investmentCr, 0), [])
  const avgPurity = useMemo(() => (rareGasRecords.reduce((s: number, r) => s + r.purityPercent, 0) / rareGasRecords.length).toFixed(3), [])
  const deliveredCount = useMemo(() => rareGasRecords.filter(r => r.status === 'Delivered').length, [])
  const delayedCount = useMemo(() => rareGasRecords.filter(r => r.status === 'Delayed').length, [])

  const uniqueCities = useMemo(() => [...new Set(rareGasRecords.map(r => r.city))], [])
  const uniqueStatuses = useMemo(() => [...new Set(rareGasRecords.map(r => r.status))], [])
  const uniqueManufacturers = useMemo(() => [...new Set(rareGasRecords.map(r => r.manufacturer))], [])

  const cityInvestmentMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of rareGasRecords) { map[r.city] = (map[r.city] || 0) + r.investmentCr }
    return map
  }, [])

  const gasTypePressureMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of rareGasRecords) { map[r.gasType] = r.pressureBar }
    return map
  }, [])

  const statusCountMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of rareGasRecords) { map[r.status] = (map[r.status] || 0) + 1 }
    return map
  }, [])

  const zoneInvestmentMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of rareGasRecords) { map[r.zone] = (map[r.zone] || 0) + r.investmentCr }
    return map
  }, [])

  const maxCity = useMemo(() => {
    const entries = (Object.entries(cityInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1])
    return entries[0] || ['N/A', 0]
  }, [cityInvestmentMap])

  const maxGasPressure = useMemo(() => {
    const entries = (Object.entries(gasTypePressureMap) as [string, number][]).sort((a, b) => b[1] - a[1])
    return entries[0] || ['N/A', 0]
  }, [gasTypePressureMap])

  const tabs = ['Dashboard', 'Registry', 'Analytics', 'Insights']

  return (
    <div className="space-y-6">
      <PageHeader title="Rare Gas Logistics" description="Rare gas supply chain for helium MRI cryogenics, argon welding shield, xenon satellite thrusters, neon excimer lasers, krypton insulated windows and ultra-high purity quantum computing applications" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-teal-600 bg-teal-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Total Investment</div><div className="text-2xl font-bold text-teal-800">&#8377;{totalInvestment.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground mt-1">Across {rareGasRecords.length} batches</div></CardContent></Card>
        <Card className="border-l-4 border-l-teal-600 bg-teal-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Avg Purity</div><div className="text-2xl font-bold text-teal-800">{avgPurity}%</div><div className="text-xs text-muted-foreground mt-1">Across all gas types</div></CardContent></Card>
        <Card className="border-l-4 border-l-teal-600 bg-teal-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Delivered</div><div className="text-2xl font-bold text-teal-800">{deliveredCount}</div><div className="text-xs text-muted-foreground mt-1">{delayedCount} delayed</div></CardContent></Card>
        <Card className="border-l-4 border-l-teal-600 bg-teal-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Top City</div><div className="text-2xl font-bold text-teal-800">{maxCity[0]}</div><div className="text-xs text-muted-foreground mt-1">&#8377;{maxCity[1].toLocaleString()} Cr invested</div></CardContent></Card>
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
          <button key={tab} className={`px-4 py-2 text-sm font-medium ${activeTab === tab ? 'border-b-2 border-teal-600 text-teal-800' : 'text-muted-foreground'}`} onClick={() => setActiveTab(tab)}>{tab}</button>
        ))}
      </div>

      {activeTab === 'Dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">Investment by City</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(cityInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([city, val]) => (<div key={city} className="flex items-center gap-2"><span className="text-xs w-24 truncate">{city}</span><div className="flex-1 bg-teal-100 rounded-full h-3"><div className="bg-teal-600 h-3 rounded-full" style={{ width: `${(val / maxCity[1]) * 100}%` }}></div></div><span className="text-xs font-medium w-20 text-right">&#8377;{val} Cr</span></div>))}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Pressure by Gas Type</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(gasTypePressureMap) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([gas, bar]) => (<div key={gas} className="flex items-center gap-2"><span className="text-xs w-36 truncate">{gas}</span><div className="flex-1 bg-cyan-100 rounded-full h-3"><div className="bg-cyan-600 h-3 rounded-full" style={{ width: `${(bar / maxGasPressure[1]) * 100}%` }}></div></div><span className="text-xs font-medium w-16 text-right">{bar} bar</span></div>))}</CardContent></Card>
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
              <thead><tr className="border-b"><th className="text-left p-2">Batch</th><th className="text-left p-2">City</th><th className="text-left p-2">Manufacturer</th><th className="text-left p-2">Gas Type</th><th className="text-left p-2">Application</th><th className="text-left p-2">Purity%</th><th className="text-left p-2">Bar</th><th className="text-left p-2">&#8377;Cr</th><th className="text-left p-2">Status</th></tr></thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id} className={`border-b ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}>
                    <td className="p-2 font-mono text-xs">{r.batchNo}</td>
                    <td className="p-2">{r.city}</td>
                    <td className="p-2">{r.manufacturer}</td>
                    <td className="p-2">{r.gasType}</td>
                    <td className="p-2 max-w-[200px] truncate">{r.application}</td>
                    <td className="p-2">{r.purityPercent}%</td>
                    <td className="p-2">{r.pressureBar}</td>
                    <td className="p-2 font-medium">&#8377;{r.investmentCr}</td>
                    <td className="p-2"><Badge variant={r.status === 'Delivered' ? 'default' : r.status === 'Delayed' ? 'destructive' : 'secondary'}>{r.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card><CardHeader><CardTitle className="text-sm">Purity by Gas</CardTitle></CardHeader><CardContent className="space-y-2">{rareGasRecords.slice(0, 8).map(r => (<div key={r.id} className="flex items-center gap-2"><span className="text-xs w-36 truncate">{r.gasType}</span><div className="flex-1 bg-teal-100 rounded-full h-3"><div className="bg-teal-600 h-3 rounded-full" style={{ width: `${Math.min((r.purityPercent / 100) * 100, 100)}%` }}></div></div><span className="text-xs font-medium w-16 text-right">{r.purityPercent}%</span></div>))}</CardContent></Card>
            <Card><CardHeader><CardTitle className="text-sm">Investment by Zone</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(zoneInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([zone, val]) => (<div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone}</span><div className="flex-1 bg-cyan-100 rounded-full h-3"><div className="bg-cyan-600 h-3 rounded-full" style={{ width: `${(val / maxCity[1]) * 100}%` }}></div></div><span className="text-xs font-medium w-20 text-right">&#8377;{val} Cr</span></div>))}</CardContent></Card>
          </div>
        </div>
      )}

      {activeTab === 'Analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">Status Distribution</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(statusCountMap) as [string, number][]).map(([status, count]) => (<div key={status} className="flex items-center gap-2"><span className="text-xs w-24">{status}</span><div className="flex-1 bg-teal-100 rounded-full h-3"><div className="bg-teal-600 h-3 rounded-full" style={{ width: `${(count / rareGasRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Priority Breakdown</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const map: Record<string, number> = {}; for (const r of rareGasRecords) { map[r.priority] = (map[r.priority] || 0) + 1 } const sorted = (Object.entries(map) as [string, number][]).sort((a, b) => b[1] - a[1]); return sorted.map(([pri, count]) => (<div key={pri} className="flex items-center gap-2"><span className="text-xs w-20">{pri}</span><div className="flex-1 bg-amber-100 rounded-full h-3"><div className="bg-amber-600 h-3 rounded-full" style={{ width: `${(count / rareGasRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))})()}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Shipment Volume by Zone</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const map: Record<string, number> = {}; for (const r of rareGasRecords) { map[r.zone] = (map[r.zone] || 0) + 1 } const sorted = (Object.entries(map) as [string, number][]).sort((a, b) => b[1] - a[1]); return sorted.map(([zone, count]) => (<div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone}</span><div className="flex-1 bg-indigo-100 rounded-full h-3"><div className="bg-indigo-600 h-3 rounded-full" style={{ width: `${(count / rareGasRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))})()}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Gas Type Category Distribution</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const cats: Record<string, number> = { 'Helium': 0, 'Argon': 0, 'Xenon': 0, 'Neon': 0, 'Krypton': 0 }; for (const r of rareGasRecords) { if (r.gasType.startsWith('Helium')) cats['Helium']++; else if (r.gasType.startsWith('Argon')) cats['Argon']++; else if (r.gasType.startsWith('Xenon')) cats['Xenon']++; else if (r.gasType.startsWith('Neon')) cats['Neon']++; else if (r.gasType.startsWith('Krypton')) cats['Krypton']++ } return (Object.entries(cats) as [string, number][]).map(([gas, count]) => (<div key={gas} className="flex items-center gap-2"><span className="text-xs w-20">{gas}</span><div className="flex-1 bg-teal-100 rounded-full h-3"><div className="bg-teal-600 h-3 rounded-full" style={{ width: `${(count / rareGasRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))})()}</CardContent></Card>
        </div>
      )}

      {activeTab === 'Insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-l-4 border-l-teal-600"><CardHeader><CardTitle className="text-sm">India Helium Crisis: 95% Import Dependency</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>India imports 95% of its helium consumption (approximately 70 million NLM per year) primarily from the USA (Bureau of Land Management Amarillo), Qatar (Ras Laffan Helium Plant) and Russia (Orenburg facility). The 2019-2023 global helium shortage caused MRI scan delays of 3-6 months across Indian hospitals, with Philips, Siemens and GE Healthcare all reporting installation backlogs. India&apos;s only indigenous helium source is the natural gas fields at Kutch Basin (Gujarat) operated by GAIL, where helium concentration is 0.05% - below the 0.3% economic threshold for extraction. DRDO is developing helium extraction from monazite sand processing at IRE Chavara, but commercial production remains 5+ years away. India&apos;s helium bill exceeds &#8377;2,500Cr annually, with healthcare (40%), semiconductor (25%), aerospace (20%) and welding (15%) as primary consumers.</p></CardContent></Card>
          <Card className="border-l-4 border-l-indigo-500"><CardHeader><CardTitle className="text-sm">Xenon Ion Propulsion: ISRO&apos;s Fuel for Deep Space</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>ISRO&apos;s GSAT-N2 satellite uses a gridded ion thruster powered by 1,200 litres of 4N xenon, achieving a specific impulse of 3,100 seconds - nearly 10x more efficient than chemical hydrazine thrusters. India plans to launch 18 communication satellites with xenon electric propulsion by 2030, requiring a total of 21,600 litres of ultra-pure xenon worth approximately &#8377;4,200Cr. Xenon is extracted from air separation units at 0.087 ppm concentration, making it the rarest naturally occurring noble gas. Linde India and Bhuruka Gases are the primary xenon suppliers, with ISRO LPSC developing indigenous xenon recycling systems to achieve 95% propellant recovery from decommissioned satellites. The global xenon market is projected to reach $850M by 2030, with India&apos;s share growing from 3% to 8%.</p></CardContent></Card>
          <Card className="border-l-4 border-l-purple-500"><CardHeader><CardTitle className="text-sm">Argon: India&apos;s Most Consumed Noble Gas</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>Argon constitutes 0.934% of Earth&apos;s atmosphere and is recovered as a byproduct of cryogenic air separation plants operated by Linde India, INOX Air Products, National Oxygen and BOC India. India produces 450,000 tonnes of argon annually, consuming 92% domestically in TIG/MIG welding (40%), steel AOD refining (30%), semiconductor manufacturing (15%) and aluminium degassing (7%). The Indian argon market is valued at &#8377;9,000Cr, growing at 8% CAGR driven by infrastructure construction and automotive welding demand. SAIL, Tata Steel and JSW Steel collectively consume 150,000 tonnes of argon per year for stainless steel argon oxygen decarburization. The PLI scheme for specialty steel targeting 25 MTPA capacity will increase argon demand by 40% to &#8377;12,600Cr by 2028.</p></CardContent></Card>
          <Card className="border-l-4 border-l-rose-500"><CardHeader><CardTitle className="text-sm">Neon Excimer Laser: Semiconductor Lithography Critical Gas</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>India&apos;s semiconductor manufacturing ambitions under the &#8377;76,000Cr PLI scheme require neon gas for KrF (248nm) and ArF (193nm) excimer laser lithography systems. Each 300mm fab line consumes approximately 8,000 litres of 5N neon per quarter for lithography tool maintenance. The 2022 Ukraine conflict disrupted 70% of global neon supply (both major neon producers Ingas and Cryoin are based in Mariupol), causing excimer laser neon prices to spike from $300 to $2,500 per NLM. India is establishing a strategic neon reserve of 50,000 NLM at INOX Bengaluru and Bhuruka Gases Pune facilities. Coherent India, ASML India and Nikon Precision India are the primary neon consumers for lithography tools. India&apos;s neon demand for planned 12 fab lines is projected at &#8377;2,800Cr by 2030.</p></CardContent></Card>
        </div>
      )}
    </div>
  )
}
