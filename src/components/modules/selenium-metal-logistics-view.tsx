'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { Atom } from 'lucide-react'

interface SeleniumMetalRecord {
  id: string
  batchNo: string
  city: string
  manufacturer: string
  seleniumForm: string
  application: string
  seleniumPercent: number
  resistivityOhmCm: number
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

const seleniumRecords: SeleniumMetalRecord[] = [
  { id: 'SME-0001', batchNo: 'SME-B2401', city: 'Mumbai', manufacturer: 'Advani-Oerlikon', seleniumForm: 'Se Powder (99.5%)', application: 'Glass Decolorizer (Asahi India)', seleniumPercent: 99.5, resistivityOhmCm: 0, investmentCr: 42, status: 'Delivered', priority: 'Medium', origin: 'A-O Mumbai (MH)', destination: 'Asahi India Bhiwadi (RJ)', shipDate: '2026-07-18', transitDays: 2, zone: 'West', remarks: 'Selenium powder for Asahi float glass decolorization &#8594; 99.5% Se &#8594; &#8377;42Cr for 3 tonnes &#8594; 0.5 ppm Se cancels Fe green tint &#8594; India &#8377;1,500Cr glass Se market &#8594; 12 float lines use Se &#8594; Se replaces CdS as non-toxic decolorizer &#8594; Color shift 0.3 YI units per ppm Se' },
  { id: 'SME-0002', batchNo: 'SME-B2402', city: 'Hyderabad', manufacturer: 'MIDHANI', seleniumForm: 'CIGS Sputtering Target (CIGS)', application: 'Thin-Film Solar (Tata Power Solar)', seleniumPercent: 50, resistivityOhmCm: 0, investmentCr: 185, status: 'Delivered', priority: 'Critical', origin: 'MIDHANI Hyderabad (TG)', destination: 'Tata Power Solar Bengaluru (KA)', shipDate: '2026-07-20', transitDays: 2, zone: 'South', remarks: 'CIGS sputtering target for Tata thin-film solar panel &#8594; 50% Se &#8594; &#8377;185Cr for 5 tonnes &#8594; CuInGaSe2 bandgap 1.15 eV &#8594; India &#8377;6,500Cr CIGS solar market &#8594; 22% conversion efficiency &#8594; India 100 GW solar target by 2030 &#8594; CIGS 15% cost premium vs CdTe but no Cd toxicity' },
  { id: 'SME-0003', batchNo: 'SME-B2403', city: 'Bengaluru', manufacturer: 'Bharat Electronics', seleniumForm: 'Se Rectifier Plate (99.9%)', application: 'High-Voltage Rectifier (BHEL)', seleniumPercent: 99.9, resistivityOhmCm: 12, investmentCr: 28, status: 'Delivered', priority: 'Medium', origin: 'BEL Bengaluru (KA)', destination: 'BHEL Bhopal (MP)', shipDate: '2026-07-15', transitDays: 2, zone: 'South', remarks: 'Se rectifier plate for BHEL electrostatic precipitator HV supply &#8594; 99.9% Se &#8594; &#8377;28Cr for 1 tonne &#8594; 12 ohm-cm resistivity &#8594; India &#8377;1,200Cr Se rectifier market &#8594; BHEL 200 ESP units/year &#8594; Se rectifiers 30V forward drop &#8594; Surge current 10x rated for 10ms' },
  { id: 'SME-0004', batchNo: 'SME-B2404', city: 'Pune', manufacturer: 'Kirloskar Electric', seleniumForm: 'Se Photocell (CdSe)', application: 'Street Light Sensor (LED India)', seleniumPercent: 45, resistivityOhmCm: 0.5, investmentCr: 18, status: 'Delivered', priority: 'Low', origin: 'Kirloskar Pune (MH)', destination: 'LED India Noida (UP)', shipDate: '2026-07-22', transitDays: 2, zone: 'West', remarks: 'CdSe photoconductive cell for LED India dusk-to-dawn sensor &#8594; 45% Se as CdSe &#8594; &#8377;18Cr for 500,000 cells &#8594; 0.5 ohm-cm dark resistivity &#8594; India &#8377;800Cr Se photocell market &#8594; 30 million street lights India &#8594; CdSe spectral peak 720 nm &#8594; Response time 5 ms on/20 ms off' },
  { id: 'SME-0005', batchNo: 'SME-B2405', city: 'Chennai', manufacturer: 'IGCAR Kalpakkam', seleniumForm: 'Se-75 Radioisotope', application: 'Medical Imaging (AIIMS)', seleniumPercent: 99.99, resistivityOhmCm: 0, investmentCr: 95, status: 'Delivered', priority: 'High', origin: 'BRIT Mumbai (MH)', destination: 'AIIMS New Delhi (DL)', shipDate: '2026-07-19', transitDays: 2, zone: 'South', remarks: 'Se-75 radioisotope for AIIMS gamma camera imaging &#8594; 99.99% Se-75 &#8594; &#8377;95Cr for 100 Ci capsule &#8594; 120 day half-life 136 keV gamma &#8594; India &#8377;3,800Cr Se-75 market &#8594; 500 hospitals use Se-75 &#8594; Replaces Tl-201 for cardiac &#8594; BRIT 100% India radioisotope production' },
  { id: 'SME-0006', batchNo: 'SME-B2406', city: 'Noida', manufacturer: 'Raman Spectroscopy India', seleniumForm: 'ZnSe Lens (ZnSe)', application: 'CO2 Laser Optics (SLAC India)', seleniumPercent: 57, resistivityOhmCm: 0, investmentCr: 62, status: 'Delivered', priority: 'High', origin: 'RSI Noida (UP)', destination: 'SLAC Mumbai (MH)', shipDate: '2026-07-16', transitDays: 3, zone: 'North', remarks: 'ZnSe laser window for SLAC CO2 cutting laser 10.6 um &#8594; 57% Se as ZnSe &#8594; &#8377;62Cr for 200 lenses &#8594; IR transparent 0.6-18 um &#8594; India &#8377;2,500Cr laser optics Se market &#8594; India 5,000 CO2 laser cutters &#8594; Damage threshold 500 MW/cm2 &#8594; AR coated R less than 0.5% per surface' },
  { id: 'SME-0007', batchNo: 'SME-B2407', city: 'Kolkata', manufacturer: 'Exide Industries', seleniumForm: 'Se Lead Alloy (Pb-Se)', application: 'Battery Plate (Exide)', seleniumPercent: 0.2, resistivityOhmCm: 0, investmentCr: 35, status: 'Delivered', priority: 'Medium', origin: 'Exide Kolkata (WB)', destination: 'Exide Haldia (WB)', shipDate: '2026-07-21', transitDays: 1, zone: 'East', remarks: 'Pb-Se alloy additive for Exide lead-acid battery grid &#8594; 0.2% Se in Pb &#8594; &#8377;35Cr for 10 tonnes additive &#8594; Se refines Pb grain 40% &#8594; India &#8377;1,400Cr battery Se additive market &#8594; Exide 200 million batteries/year &#8594; Se reduces Pb corrosion 30% &#8594; Battery life extension 6 months' },
  { id: 'SME-0008', batchNo: 'SME-B2408', city: 'Ahmedabad', manufacturer: 'Gujarat Fluorochemicals', seleniumForm: 'Se Dioxide (SeO2)', application: 'Ruby Glass Colourant (Modi Glass)', seleniumPercent: 71, resistivityOhmCm: 0, investmentCr: 22, status: 'Delivered', priority: 'Low', origin: 'GFCL Vadodara (GJ)', destination: 'Modi Glass Kadi (GJ)', shipDate: '2026-07-17', transitDays: 1, zone: 'West', remarks: 'SeO2 colourant for Modi ruby-red glassware &#8594; 71% Se as SeO2 &#8594; &#8377;22Cr for 500 kg SeO2 &#8594; Pink-red colour from Se4+ ions &#8594; India &#8377;900Cr glass colourant market &#8594; India 5 billion glass bottles/year &#8594; Se replaces CdS as non-toxic &#8594; 10 ppm SeO2 for deep ruby' },
  { id: 'SME-0009', batchNo: 'SME-B2409', city: 'Jaipur', manufacturer: 'Rajasthan Selenium Corp', seleniumForm: 'Se Nanopowder (SeNPs)', application: 'Fungicide Formulation (UPL)', seleniumPercent: 99.5, resistivityOhmCm: 0, investmentCr: 48, status: 'Delivered', priority: 'Medium', origin: 'RSC Jaipur (RJ)', destination: 'UPL Mumbai (MH)', shipDate: '2026-07-23', transitDays: 3, zone: 'North', remarks: 'Selenium nanopowder for UPL agricultural fungicide &#8594; 99.5% Se 50nm particles &#8594; &#8377;48Cr for 2 tonnes SeNP &#8594; Nano-Se antifungal 10x bulk Se &#8594; India &#8377;2,000Cr agri-Se market &#8594; UPL 25% India agrochemical &#8594; EC50 for Fusarium 0.8 ppm &#8594; Biodegradable in soil 30 days' },
  { id: 'SME-0010', batchNo: 'SME-B2410', city: 'Coimbatore', manufacturer: 'Tamil Nadu Selenium Industries', seleniumForm: 'Se Sulfide (SeS2)', application: 'Vulcanising Agent (MRF)', seleniumPercent: 67, resistivityOhmCm: 0, investmentCr: 38, status: 'Delivered', priority: 'High', origin: 'TNSI Coimbatore (TN)', destination: 'MRF Chennai (TN)', shipDate: '2026-07-14', transitDays: 1, zone: 'South', remarks: 'SeS2 vulcanising agent for MRF truck tyre rubber &#8594; 67% Se as SeS2 &#8594; &#8377;38Cr for 1.5 tonnes &#8594; Cross-link density 5x S alone &#8594; India &#8377;1,600Cr rubber Se market &#8594; India 1.8 billion tyres/year &#8594; Heat build-up 20% lower &#8594; Tyre life 15% longer with Se-S vulcanisation' },
  { id: 'SME-0011', batchNo: 'SME-B2411', city: 'Bhubaneswar', manufacturer: 'Odisha Selenium Refinery', seleniumForm: 'Selenous Acid (H2SeO3)', application: 'Oxidation Catalyst (Indian Oil)', seleniumPercent: 64, resistivityOhmCm: 0, investmentCr: 55, status: 'Delivered', priority: 'High', origin: 'OSR Bhubaneswar (OD)', destination: 'Indian Oil Paradip (OD)', shipDate: '2026-07-25', transitDays: 2, zone: 'East', remarks: 'H2SeO3 catalyst for Indian Oil diesel hydro-desulphurisation &#8594; 64% Se as H2SeO3 &#8594; &#8377;55Cr for 800 kg catalyst &#8594; 350&#176;C 80 bar H2 &#8594; India &#8377;2,200Cr refinery Se market &#8594; India 300 MT/day diesel desulphur &#8594; Se catalyst 10 ppm S target &#8594; 2-year catalyst life' },
  { id: 'SME-0012', batchNo: 'SME-B2412', city: 'Guwahati', manufacturer: 'Assam Selenium Works', seleniumForm: 'Se Telluride (Bi2Se2Te)', application: 'Thermoelectric (DRDO)', seleniumPercent: 32, resistivityOhmCm: 0.001, investmentCr: 108, status: 'Delayed', priority: 'High', origin: 'ASW Guwahati (AS)', destination: 'DRDO Pune (MH)', shipDate: '2026-07-24', transitDays: 12, zone: 'East', remarks: 'Bi2Se2Te topological insulator thermoelectric for DRDO waste-heat generator &#8594; 32% Se &#8594; &#8377;108Cr for 1 tonne crystal &#8594; 12d delay monsoon logistics &#8594; ZT figure of merit 1.5 at 450K &#8594; India &#8377;4,500Cr thermoelectric Se market &#8594; DRDO 500 kW shipboard WHRG &#8594; Power density 5 W/cm2 &#8594; Topological surface states enhance ZT' },
  { id: 'SME-0013', batchNo: 'SME-B2413', city: 'Gandhinagar', manufacturer: 'Gujarat Selenium Technologies', seleniumForm: 'Se Copier Drum (a-Se)', application: 'Laser Printer OPC (Canon India)', seleniumPercent: 99.9, resistivityOhmCm: 1000, investmentCr: 42, status: 'Delivered', priority: 'Medium', origin: 'GST Gandhinagar (GJ)', destination: 'Canon India Mumbai (MH)', shipDate: '2026-07-26', transitDays: 2, zone: 'West', remarks: 'Amorphous Se OPC drum for Canon laser printer &#8594; 99.9% a-Se &#8594; &#8377;42Cr for 200,000 drums &#8594; 1,000 ohm-cm dark resistivity &#8594; India &#8377;1,800Cr copier Se market &#8594; India 5 million printers/year &#8594; Photoconductive 400-800 nm &#8594; 50,000 copy cycles per drum' },
  { id: 'SME-0014', batchNo: 'SME-B2414', city: 'Lucknow', manufacturer: 'UP Selenium Alloys', seleniumForm: 'Se-CdS Quantum Dots', application: 'QD-LCD Display (LG India)', seleniumPercent: 15, resistivityOhmCm: 0, investmentCr: 225, status: 'Delivered', priority: 'Critical', origin: 'USA Lucknow (UP)', destination: 'LG India Noida (UP)', shipDate: '2026-07-27', transitDays: 1, zone: 'North', remarks: 'CdSe/ZnS quantum dots for LG QD-OLED colour conversion &#8594; 15% Se as CdSe core &#8594; &#8377;225Cr for 100 kg QD solution &#8594; 620 nm red emission peak &#8594; India &#8377;8,500Cr QD display market &#8594; LG 2 million QD-OLED TV panels/year &#8594; Quantum yield 95% &#8594; 20,000 hour operational lifetime at 200 lux' }
]

export default function SeleniumMetalLogisticsView() {
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
    return seleniumRecords.filter(r => {
      const matchSearch = !searchQuery || Object.values(r).some(v => String(v).toLowerCase().includes(searchQuery.toLowerCase()))
      const matchFilters = Object.entries(filters).every(([key, values]) => values.includes(String(r[key as keyof SeleniumMetalRecord])))
      return matchSearch && matchFilters
    })
  }, [searchQuery, filters])

  const totalInvestment = useMemo(() => seleniumRecords.reduce((s: number, r) => s + r.investmentCr, 0), [])
  const avgSe = useMemo(() => (seleniumRecords.reduce((s: number, r) => s + r.seleniumPercent, 0) / seleniumRecords.length).toFixed(1), [])
  const deliveredCount = useMemo(() => seleniumRecords.filter(r => r.status === 'Delivered').length, [])
  const delayedCount = useMemo(() => seleniumRecords.filter(r => r.status === 'Delayed').length, [])

  const uniqueCities = useMemo(() => [...new Set(seleniumRecords.map(r => r.city))], [])
  const uniqueStatuses = useMemo(() => [...new Set(seleniumRecords.map(r => r.status))], [])
  const uniqueManufacturers = useMemo(() => [...new Set(seleniumRecords.map(r => r.manufacturer))], [])

  const cityInvestmentMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of seleniumRecords) { map[r.city] = (map[r.city] || 0) + r.investmentCr }
    return map
  }, [])

  const formInvestmentMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of seleniumRecords) { map[r.seleniumForm] = r.investmentCr }
    return map
  }, [])

  const statusCountMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of seleniumRecords) { map[r.status] = (map[r.status] || 0) + 1 }
    return map
  }, [])

  const zoneInvestmentMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of seleniumRecords) { map[r.zone] = (map[r.zone] || 0) + r.investmentCr }
    return map
  }, [])

  const maxCity = useMemo(() => {
    const entries = (Object.entries(cityInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1])
    return entries[0] || ['N/A', 0]
  }, [cityInvestmentMap])

  const maxForm = useMemo(() => {
    const entries = (Object.entries(formInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1])
    return entries[0] || ['N/A', 0]
  }, [formInvestmentMap])

  const tabs = ['Dashboard', 'Registry', 'Analytics', 'Insights']

  return (
    <div className="space-y-6">
      <PageHeader title="Selenium Metal Logistics" description="Selenium metal and compound supply chain for CIGS thin-film solar cells, glass decolorizing, medical radioisotopes, laser optics, quantum dot displays, rubber vulcanisation and agricultural fungicides across India" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-green-600 bg-green-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Total Investment</div><div className="text-2xl font-bold text-green-800">&#8377;{totalInvestment.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground mt-1">Across {seleniumRecords.length} batches</div></CardContent></Card>
        <Card className="border-l-4 border-l-green-600 bg-green-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Avg Se Content</div><div className="text-2xl font-bold text-green-800">{avgSe}%</div><div className="text-xs text-muted-foreground mt-1">Across all selenium forms</div></CardContent></Card>
        <Card className="border-l-4 border-l-green-600 bg-green-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Delivered</div><div className="text-2xl font-bold text-green-800">{deliveredCount}</div><div className="text-xs text-muted-foreground mt-1">{delayedCount} delayed</div></CardContent></Card>
        <Card className="border-l-4 border-l-green-600 bg-green-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Top City</div><div className="text-2xl font-bold text-green-800">{maxCity[0]}</div><div className="text-xs text-muted-foreground mt-1">&#8377;{maxCity[1].toLocaleString()} Cr invested</div></CardContent></Card>
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
          <button key={tab} className={`px-4 py-2 text-sm font-medium ${activeTab === tab ? 'border-b-2 border-green-600 text-green-800' : 'text-muted-foreground'}`} onClick={() => setActiveTab(tab)}>{tab}</button>
        ))}
      </div>

      {activeTab === 'Dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">Investment by City</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(cityInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([city, val]) => (<div key={city} className="flex items-center gap-2"><span className="text-xs w-24 truncate">{city}</span><div className="flex-1 bg-green-100 rounded-full h-3"><div className="bg-green-600 h-3 rounded-full" style={{ width: `${(val / maxCity[1]) * 100}%` }}></div></div><span className="text-xs font-medium w-20 text-right">&#8377;{val} Cr</span></div>))}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Investment by Selenium Form</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(formInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([form, val]) => (<div key={form} className="flex items-center gap-2"><span className="text-xs w-36 truncate">{form}</span><div className="flex-1 bg-emerald-100 rounded-full h-3"><div className="bg-emerald-600 h-3 rounded-full" style={{ width: `${(val / maxForm[1]) * 100}%` }}></div></div><span className="text-xs font-medium w-20 text-right">&#8377;{val} Cr</span></div>))}</CardContent></Card>
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
              <thead><tr className="border-b"><th className="text-left p-2">Batch</th><th className="text-left p-2">City</th><th className="text-left p-2">Manufacturer</th><th className="text-left p-2">Se Form</th><th className="text-left p-2">Application</th><th className="text-left p-2">Se%</th><th className="text-left p-2">&#8377;Cr</th><th className="text-left p-2">Status</th></tr></thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id} className={`border-b ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}>
                    <td className="p-2 font-mono text-xs">{r.batchNo}</td>
                    <td className="p-2">{r.city}</td>
                    <td className="p-2">{r.manufacturer}</td>
                    <td className="p-2">{r.seleniumForm}</td>
                    <td className="p-2 max-w-[200px] truncate">{r.application}</td>
                    <td className="p-2">{r.seleniumPercent}%</td>
                    <td className="p-2 font-medium">&#8377;{r.investmentCr}</td>
                    <td className="p-2"><Badge variant={r.status === 'Delivered' ? 'default' : r.status === 'Delayed' ? 'destructive' : 'secondary'}>{r.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card><CardHeader><CardTitle className="text-sm">Se Content by Form</CardTitle></CardHeader><CardContent className="space-y-2">{seleniumRecords.slice(0, 8).map(r => (<div key={r.id} className="flex items-center gap-2"><span className="text-xs w-36 truncate">{r.seleniumForm}</span><div className="flex-1 bg-green-100 rounded-full h-3"><div className="bg-green-600 h-3 rounded-full" style={{ width: `${Math.min((r.seleniumPercent / 100) * 100, 100)}%` }}></div></div><span className="text-xs font-medium w-16 text-right">{r.seleniumPercent}%</span></div>))}</CardContent></Card>
            <Card><CardHeader><CardTitle className="text-sm">Investment by Zone</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(zoneInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([zone, val]) => (<div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone}</span><div className="flex-1 bg-emerald-100 rounded-full h-3"><div className="bg-emerald-600 h-3 rounded-full" style={{ width: `${(val / maxCity[1]) * 100}%` }}></div></div><span className="text-xs font-medium w-20 text-right">&#8377;{val} Cr</span></div>))}</CardContent></Card>
          </div>
        </div>
      )}

      {activeTab === 'Analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">Status Distribution</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(statusCountMap) as [string, number][]).map(([status, count]) => (<div key={status} className="flex items-center gap-2"><span className="text-xs w-24">{status}</span><div className="flex-1 bg-green-100 rounded-full h-3"><div className="bg-green-600 h-3 rounded-full" style={{ width: `${(count / seleniumRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Priority Breakdown</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const map: Record<string, number> = {}; for (const r of seleniumRecords) { map[r.priority] = (map[r.priority] || 0) + 1 } const sorted = (Object.entries(map) as [string, number][]).sort((a, b) => b[1] - a[1]); return sorted.map(([pri, count]) => (<div key={pri} className="flex items-center gap-2"><span className="text-xs w-20">{pri}</span><div className="flex-1 bg-amber-100 rounded-full h-3"><div className="bg-amber-600 h-3 rounded-full" style={{ width: `${(count / seleniumRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))})()}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Shipment Volume by Zone</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const map: Record<string, number> = {}; for (const r of seleniumRecords) { map[r.zone] = (map[r.zone] || 0) + 1 } const sorted = (Object.entries(map) as [string, number][]).sort((a, b) => b[1] - a[1]); return sorted.map(([zone, count]) => (<div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone}</span><div className="flex-1 bg-indigo-100 rounded-full h-3"><div className="bg-indigo-600 h-3 rounded-full" style={{ width: `${(count / seleniumRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))})()}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Application Category Distribution</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const cats: Record<string, number> = { 'Solar Energy': 0, 'Glass Industry': 0, 'Electronics Display': 0, 'Medical Isotope': 0, 'Laser Optics': 0, 'Thermoelectric': 0, 'Rubber Vulcanise': 0, 'Agriculture': 0 }; for (const r of seleniumRecords) { if (r.application.includes('Solar') || r.application.includes('CIGS')) cats['Solar Energy']++; else if (r.application.includes('Glass') || r.application.includes('Colourant')) cats['Glass Industry']++; else if (r.application.includes('Display') || r.application.includes('QD') || r.application.includes('OPC') || r.application.includes('Printer')) cats['Electronics Display']++; else if (r.application.includes('Medical') || r.application.includes('AIIMS')) cats['Medical Isotope']++; else if (r.application.includes('Laser') || r.application.includes('Optics')) cats['Laser Optics']++; else if (r.application.includes('Thermo') || r.application.includes('Waste')) cats['Thermoelectric']++; else if (r.application.includes('Vulcan') || r.application.includes('rubber') || r.application.includes('Battery')) cats['Rubber Vulcanise']++; else cats['Agriculture']++ } return (Object.entries(cats) as [string, number][]).map(([cat, count]) => { const pct = `${(count / seleniumRecords.length) * 100}%`; return <div key={cat} className="flex items-center gap-2"><span className="text-xs w-28">{cat}</span><div className="flex-1 bg-green-100 rounded-full h-3"><div className="bg-green-600 h-3 rounded-full" style={{ width: pct }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div> })})()}</CardContent></Card>
        </div>
      )}

      {activeTab === 'Insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-l-4 border-l-green-600"><CardHeader><CardTitle className="text-sm">CIGS Solar: India 100 GW Target &#8377;6,500Cr</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>Copper indium gallium selenide (CIGS, CuInGaSe2) thin-film solar cells use 50% selenium by weight as the group VI anion, with a direct bandgap of 1.15 eV enabling 22% lab efficiency (20% module). India&apos;s CIGS solar market is &#8377;6,500Cr, driven by the National Solar Mission target of 100 GW by 2030 and Tata Power Solar&apos;s 2 GW CIGS panel factory in Bengaluru. CIGS advantages over crystalline Si include: 100x thinner absorber layer (2 um vs 200 um Si), flexible lightweight substrates for BIPV (building-integrated PV), and lower energy payback time of 0.5 years vs 1.5 years for Si. MIDHANI produces CIGS sputtering targets domestically, replacing imports from US-based Avancis and Japan&apos;s Solar Frontier. India&apos;s cumulative CIGS deployment of 5 GW by 2028 will consume 2,500 tonnes of selenium annually, creating a strategic selenium supply security concern as global Se production is only 3,200 tonnes/year from Cu anode slimes.</p></CardContent></Card>
          <Card className="border-l-4 border-l-rose-500"><CardHeader><CardTitle className="text-sm">Se-75 Medical Isotope: 500 Hospitals &#8377;3,800Cr</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>Selenium-75 (Se-75, half-life 120 days, 136 keV and 265 keV gamma emissions) is India&apos;s preferred radioisotope for gamma camera imaging at 500+ hospitals including AIIMS New Delhi, Tata Memorial Mumbai and Christian Medical College Vellore, replacing thallium-201 (Tl-201, half-life 73 hours) for cardiac perfusion imaging and parathyroid adenoma localisation. India&apos;s Se-75 radioisotope market is &#8377;3,800Cr, with BARC&apos;s BRIT (Board of Radiation and Isotope Technology) Mumbai as the sole producer operating a 5 MW research reactor for Se-74 neutron capture to Se-75. Se-75&apos;s advantages over Tl-201 include: 5x longer half-life enabling weekly hospital deliveries instead of daily, lower patient radiation dose (0.5 mSv vs 2.5 mSv for Tl-201), and superior image quality due to 136 keV photopeak (vs 135 keV Tc-99m but with lower Compton scatter). BRIT produces 1,000 Ci of Se-75 annually, meeting 80% of India&apos;s demand.</p></CardContent></Card>
          <Card className="border-l-4 border-l-sky-500"><CardHeader><CardTitle className="text-sm">CdSe Quantum Dots: LG QD-OLED &#8377;8,500Cr</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>Cadmium selenide (CdSe) core/ZnS shell quantum dots are the cornerstone of India&apos;s premium QD-OLED television display market (&#8377;8,500Cr), with LG India&apos;s Noida plant producing 2 million QD-OLED panels annually. CdSe QDs provide narrow-bandwidth colour emission (FWHM 25 nm vs 80 nm for OLED), enabling 107% Rec.2020 colour gamut coverage - exceeding human colour perception limits. India&apos;s QD display consumption of CdSe is 100 kg/year, with UP Selenium Alloys producing 50nm-diameter CdSe core nanocrystals with 95% quantum yield. Each QD-OLED TV uses 0.5g of CdSe QD solution in the colour conversion layer, with 20,000-hour operational lifetime at 200 lux. Samsung Display (Noida) and BOE India (Pune) are expanding QD production, driving CdSe demand growth of 30% CAGR. CdSe synthesis uses hot-injection method with selenium dissolved in trioctylphosphine (TOP-Se) precursor.</p></CardContent></Card>
          <Card className="border-l-4 border-l-amber-500"><CardHeader><CardTitle className="text-sm">Se Rubber Vulcanisation: MRF 1.8B Tyres &#8377;1,600Cr</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>Selenium disulphide (SeS2) is India&apos;s high-performance vulcanising agent for MRF, CEAT and JK Tyre truck radial tyres, where Se-S crosslinks provide 5x higher cross-link density than sulphur alone (S8), delivering 15% longer tyre life and 20% lower heat build-up at highway speeds. India&apos;s rubber selenium market is &#8377;1,600Cr, with India producing 1.8 billion tyres/year (world&apos;s 2nd largest after China). Se-vulcanised rubber maintains flexibility at -40&#176;C (critical for Himalayan military truck tyres) and resists reversion at 180&#176;C curing temperatures that cause polysulphide bond degradation in conventional S-only systems. MRF&apos;s new generation truck radial tyres use SeS2 at 0.3 phr (parts per hundred rubber), consuming 150 tonnes of SeS2 annually. Tamil Nadu Selenium Industries is India&apos;s largest SeS2 producer, converting imported Se powder via reaction with SO2 in aqueous suspension.</p></CardContent></Card>
        </div>
      )}
    </div>
  )
}
