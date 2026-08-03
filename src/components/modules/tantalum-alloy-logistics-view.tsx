'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { ShieldCheck } from 'lucide-react'

interface TantalumAlloyRecord {
  id: string
  batchNo: string
  city: string
  manufacturer: string
  alloyGrade: string
  application: string
  tantalumPercent: number
  capacitanceuFV: number
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

const tantalumRecords: TantalumAlloyRecord[] = [
  { id: 'TAA-0001', batchNo: 'TAA-B2401', city: 'Mumbai', manufacturer: 'Hindustan Aeronautics', alloyGrade: 'Ta-10W (10%W)', application: 'Turbine Blade (HAL)', tantalumPercent: 90, capacitanceuFV: 0, investmentCr: 245, status: 'Delivered', priority: 'Critical', origin: 'HAL Bengaluru (KA)', destination: 'HAL Nasik (MH)', shipDate: '2026-07-18', transitDays: 2, zone: 'West', remarks: 'Ta-10W superalloy forging for HAL Su-30MKI turbine blade &#8594; 90% Ta 10% W &#8594; &#8377;245Cr for 8 tonnes forging &#8594; 1,650&#176;C service temperature &#8594; India &#8377;8,200Cr aero Ta market &#8594; HAL 220 Su-30MKI fleet &#8594; Creep strength 140 MPa at 1,093&#176;C &#8594; 12,000 hour TBO interval' },
  { id: 'TAA-0002', batchNo: 'TAA-B2402', city: 'Hyderabad', manufacturer: 'MIDHANI', alloyGrade: 'Ta-2.5Sn (2.5%Sn)', application: 'Chemical Reactor (Hindustan Zinc)', tantalumPercent: 97.5, capacitanceuFV: 0, investmentCr: 178, status: 'Delivered', priority: 'High', origin: 'MIDHANI Hyderabad (TG)', destination: 'HZL Udaipur (RJ)', shipDate: '2026-07-20', transitDays: 2, zone: 'South', remarks: 'Ta-2.5Sn corrosion-resistant reactor for Hindustan Zinc sulphuric acid &#8594; 97.5% Ta &#8594; &#8377;178Cr for 6 tonnes plate &#8594; 0.01 mpy in 98% H2SO4 at 200&#176;C &#8594; India &#8377;6,500Cr chemical Ta market &#8594; 50 chemical reactors using Ta &#8594; Ta cost 15x Ti but 100x life in H2SO4 &#8594; Passive oxide film self-healing' },
  { id: 'TAA-0003', batchNo: 'TAA-B2403', city: 'Bengaluru', manufacturer: 'DRDO DMRL', alloyGrade: 'Ta-Hf-2 (2%Hf)', application: 'Missile Nozzle (DRDO)', tantalumPercent: 98, capacitanceuFV: 0, investmentCr: 195, status: 'Delivered', priority: 'Critical', origin: 'DMRL Hyderabad (TG)', destination: 'DRDO Hyderabad (TG)', shipDate: '2026-07-15', transitDays: 1, zone: 'South', remarks: 'Ta-2Hf rocket nozzle throat for DRDO Agni-V ICBM &#8594; 98% Ta &#8594; &#8377;195Cr for 4 tonnes forging &#8594; 3,000&#176;C throat temperature &#8594; India &#8377;7,500Cr missile Ta market &#8594; Agni-V 5,000 km range &#8594; Erosion rate 0.1 mm/s at 3,000&#176;C &#8594; Outperforms C-C composite by 3x' },
  { id: 'TAA-0004', batchNo: 'TAA-B2404', city: 'Pune', manufacturer: 'Bharat Forge', alloyGrade: 'Ta-10Nb (10%Nb)', application: 'Vacuum Furnace (BHEL)', tantalumPercent: 90, capacitanceuFV: 0, investmentCr: 135, status: 'Delivered', priority: 'High', origin: 'Bharat Forge Pune (MH)', destination: 'BHEL Hyderabad (TG)', shipDate: '2026-07-22', transitDays: 2, zone: 'West', remarks: 'Ta-10Nb vacuum furnace hot zone for BHEL turbine blade HIP &#8594; 90% Ta &#8594; &#8377;135Cr for 3 tonnes sheet &#8594; 1,200&#176;C vacuum 10-6 mbar &#8594; India &#8377;4,800Cr furnace Ta market &#8594; BHEL 200 gas turbines/year &#8594; 10,000 hour element life &#8594; Non-contaminating for Ni-superalloy sintering' },
  { id: 'TAA-0005', batchNo: 'TAA-B2405', city: 'Chennai', manufacturer: 'IGCAR Kalpakkam', alloyGrade: 'Ta-110 (Ta-0.1O)', application: 'Corrosion Probe (BARC)', tantalumPercent: 99.9, capacitanceuFV: 0, investmentCr: 65, status: 'Delivered', priority: 'Medium', origin: 'IGCAR Kalpakkam (TN)', destination: 'BARC Trombay (MH)', shipDate: '2026-07-19', transitDays: 2, zone: 'South', remarks: 'High-purity Ta corrosion probe for BARC heavy water reactor &#8594; 99.9% Ta &#8594; &#8377;65Cr for 500 kg rod &#8594; 300&#176;C D2O monitoring &#8594; India &#8377;2,500Cr nuclear probe market &#8594; 22 PHWR probes needed &#8594; Ta immune to all acids except HF &#8594; 30-year probe service life' },
  { id: 'TAA-0006', batchNo: 'TAA-B2406', city: 'Noida', manufacturer: 'India Rare Earths', alloyGrade: 'Ta2O5 Powder', application: 'Capacitor Dielectric (Murata)', tantalumPercent: 76, capacitanceuFV: 470, investmentCr: 185, status: 'Delivered', priority: 'Critical', origin: 'IRE Chavara (KL)', destination: 'Murata Bangalore (KA)', shipDate: '2026-07-16', transitDays: 2, zone: 'North', remarks: 'Ta2O5 high-K dielectric for Murata SMD tantalum capacitor &#8594; 76% Ta as Ta2O5 &#8594; &#8377;185Cr for 8 tonnes powder &#8594; 470 uF/V CV product 200 uF 6.3V &#8594; India &#8377;6,800Cr Ta capacitor market &#8594; 500 million SMD caps/year &#8594; K dielectric constant 27 &#8594; 85V breakdown per micron oxide' },
  { id: 'TAA-0007', batchNo: 'TAA-B2407', city: 'Kolkata', manufacturer: 'Hindustan Copper', alloyGrade: 'Ta-Sintered Anode', application: 'Electrolytic Capacitor (EPCOS)', tantalumPercent: 99.5, capacitanceuFV: 220, investmentCr: 128, status: 'Delivered', priority: 'High', origin: 'HCL Kolkata (WB)', destination: 'TDK Bengaluru (KA)', shipDate: '2026-07-21', transitDays: 2, zone: 'East', remarks: 'Sintered Ta anode for TDK solid electrolytic capacitor &#8594; 99.5% Ta sponge &#8594; &#8377;128Cr for 4 tonnes anode &#8594; 220 uF/V 100 uF 10V case &#8594; India &#8377;4,500Cr sintered Ta market &#8594; TDK 40% India MLCC share &#8594; 150,000 uF/g specific capacitance &#8594; MnO2 cathode system' },
  { id: 'TAA-0008', batchNo: 'TAA-B2408', city: 'Ahmedabad', manufacturer: 'Gujarat Fluorochemicals', alloyGrade: 'Ta-Nb Alloy Sheet', application: 'Superconductor Cavity (DAE)', tantalumPercent: 60, capacitanceuFV: 0, investmentCr: 265, status: 'Delivered', priority: 'Critical', origin: 'GFCL Vadodara (GJ)', destination: 'DAE Gandhinagar (GJ)', shipDate: '2026-07-17', transitDays: 1, zone: 'West', remarks: 'Ta-Nb sheet for DAE particle accelerator SRF cavity &#8594; 60% Ta &#8594; &#8377;265Cr for 2 tonnes Nb-Ta sheet &#8594; 1.3 GHz niobium-tantalum superconducting &#8594; India &#8377;9,200Cr SRF cavity market &#8594; DAE 3 GeV synchrotron under construction &#8594; Q factor 10E10 at 2K &#8594; Ta doping raises Tc to 9.8K' },
  { id: 'TAA-0009', batchNo: 'TAA-B2409', city: 'Jaipur', manufacturer: 'Rajasthan Tantalum Corp', alloyGrade: 'Ta-W-Nb Trimetal', application: 'Orthopaedic Implant (Stryker)', tantalumPercent: 70, capacitanceuFV: 0, investmentCr: 88, status: 'Delivered', priority: 'Medium', origin: 'RTC Jaipur (RJ)', destination: 'Stryker Gurgaon (HR)', shipDate: '2026-07-23', transitDays: 3, zone: 'North', remarks: 'Porous Ta orthopaedic implant for Stryker hip arthroplasty &#8594; 70% Ta &#8594; &#8377;88Cr for 1.5 tonnes porous scaffold &#8594; 80% porosity trabecular metal &#8594; India &#8377;3,200Cr ortho Ta market &#8594; 800,000 hip replacements/year &#8594; Osseointegration 6 weeks vs Ti 12 weeks &#8594; Elastic modulus 3 GPa matches cancellous bone' },
  { id: 'TAA-0010', batchNo: 'TAA-B2410', city: 'Coimbatore', manufacturer: 'Tamil Nadu Tantalum Industries', alloyGrade: 'Ta-5Mo (5%Mo)', application: 'Heat Exchanger (Linde India)', tantalumPercent: 95, capacitanceuFV: 0, investmentCr: 145, status: 'Delivered', priority: 'High', origin: 'TNTI Coimbatore (TN)', destination: 'Linde India Mumbai (MH)', shipDate: '2026-07-14', transitDays: 2, zone: 'South', remarks: 'Ta-5Mo shell and tube exchanger for Linde HCl condenser &#8594; 95% Ta &#8594; &#8377;145Cr for 5 tonnes tube &#8594; 150&#176;C 33% HCl service &#8594; India &#8377;5,200Cr HX Ta market &#8594; Linde 25% India industrial gas &#8594; 30-year exchanger life &#8594; Zero corrosion in wet chlorine' },
  { id: 'TAA-0011', batchNo: 'TAA-B2411', city: 'Bhubaneswar', manufacturer: 'Odisha Tantalum Refinery', alloyGrade: 'Ta-7.5W-3.5Nb', application: 'X-Ray Target (Wipro GE)', tantalumPercent: 89, capacitanceuFV: 0, investmentCr: 108, status: 'Delivered', priority: 'High', origin: 'OTR Bhubaneswar (OD)', destination: 'Wipro GE Bengaluru (KA)', shipDate: '2026-07-25', transitDays: 3, zone: 'East', remarks: 'Ta-W-Nb rotary X-ray anode for Wipro GE CT scanner &#8594; 89% Ta &#8594; &#8377;108Cr for 2 tonnes disc &#8594; 2,800&#176;C focal track temp &#8594; India &#8377;4,000Cr medical Ta market &#8594; 5,000 CT scanners/year &#8594; Ta provides 4x heat storage vs W &#8594; High Z 73 for X-ray production' },
  { id: 'TAA-0012', batchNo: 'TAA-B2412', city: 'Guwahati', manufacturer: 'Assam Tantalum Works', alloyGrade: 'Ta Foil 25um', application: 'Thin Film Deposition (IITG)', tantalumPercent: 99.9, capacitanceuFV: 0, investmentCr: 42, status: 'Delayed', priority: 'Medium', origin: 'ATW Guwahati (AS)', destination: 'IIT Guwahati (AS)', shipDate: '2026-07-24', transitDays: 12, zone: 'East', remarks: '25 micron Ta foil for IITG sputtering target thin film &#8594; 99.9% Ta &#8594; &#8377;42Cr for 500 m2 foil &#8594; 12d delay monsoon logistics &#8594; Sputtering for semiconductor diffusion barrier &#8594; India &#8377;1,800Cr sputtering target market &#8594; Ta barrier prevents Cu diffusion &#8594; 10 nm TaN film thickness &#8594; 400 V sputter voltage DC' },
  { id: 'TAA-0013', batchNo: 'TAA-B2413', city: 'Gandhinagar', manufacturer: 'Gujarat Tantalum Technologies', alloyGrade: 'Ta-40Nb (40%Nb)', application: 'Surgical Instrument (Johnson &amp; Johnson)', tantalumPercent: 60, capacitanceuFV: 0, investmentCr: 72, status: 'Delivered', priority: 'Medium', origin: 'GTT Gandhinagar (GJ)', destination: 'JJ Mumbai (MH)', shipDate: '2026-07-26', transitDays: 2, zone: 'West', remarks: 'Ta-40Nb surgical scalpel for Johnson &amp; Johnson ophthalmic &#8594; 60% Ta &#8594; &#8377;72Cr for 800 kg blade &#8594; MRI-compatible non-magnetic &#8594; India &#8377;2,800Cr surgical Ta market &#8594; 30 million surgeries/year &#8594; Edge retention 5x stainless steel &#8594; Biocompatibility ISO 10993 certified' },
  { id: 'TAA-0014', batchNo: 'TAA-B2414', city: 'Lucknow', manufacturer: 'UP Tantalum Alloys', alloyGrade: 'Ta-Cr-0.2 (0.2%Cr)', application: 'Anti-Corrosion Liner (IOCL)', tantalumPercent: 99.8, capacitanceuFV: 0, investmentCr: 98, status: 'Delivered', priority: 'High', origin: 'UTA Lucknow (UP)', destination: 'IOCL Paradip (OD)', shipDate: '2026-07-27', transitDays: 3, zone: 'North', remarks: 'Ta-0.2Cr liner for IOCL refinery acid pickling tank &#8594; 99.8% Ta &#8594; &#8377;98Cr for 4 tonnes sheet &#8594; 200&#176;C HCl-HF mixed acid &#8594; India &#8377;3,500Cr liner Ta market &#8594; IOCL 33 MMTPA refinery &#8594; Explosion-bonded Ta-steel clad &#8594; 25-year tank life without replacement' }
]

export default function TantalumAlloyLogisticsView() {
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
    return tantalumRecords.filter(r => {
      const matchSearch = !searchQuery || Object.values(r).some(v => String(v).toLowerCase().includes(searchQuery.toLowerCase()))
      const matchFilters = Object.entries(filters).every(([key, values]) => values.includes(String(r[key as keyof TantalumAlloyRecord])))
      return matchSearch && matchFilters
    })
  }, [searchQuery, filters])

  const totalInvestment = useMemo(() => tantalumRecords.reduce((s: number, r) => s + r.investmentCr, 0), [])
  const avgTa = useMemo(() => (tantalumRecords.reduce((s: number, r) => s + r.tantalumPercent, 0) / tantalumRecords.length).toFixed(1), [])
  const deliveredCount = useMemo(() => tantalumRecords.filter(r => r.status === 'Delivered').length, [])
  const delayedCount = useMemo(() => tantalumRecords.filter(r => r.status === 'Delayed').length, [])

  const uniqueCities = useMemo(() => [...new Set(tantalumRecords.map(r => r.city))], [])
  const uniqueStatuses = useMemo(() => [...new Set(tantalumRecords.map(r => r.status))], [])
  const uniqueManufacturers = useMemo(() => [...new Set(tantalumRecords.map(r => r.manufacturer))], [])

  const cityInvestmentMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of tantalumRecords) { map[r.city] = (map[r.city] || 0) + r.investmentCr }
    return map
  }, [])

  const gradeAppMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of tantalumRecords) { map[r.alloyGrade] = r.capacitanceuFV }
    return map
  }, [])

  const statusCountMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of tantalumRecords) { map[r.status] = (map[r.status] || 0) + 1 }
    return map
  }, [])

  const zoneInvestmentMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of tantalumRecords) { map[r.zone] = (map[r.zone] || 0) + r.investmentCr }
    return map
  }, [])

  const maxCity = useMemo(() => {
    const entries = (Object.entries(cityInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1])
    return entries[0] || ['N/A', 0]
  }, [cityInvestmentMap])

  const maxCV = useMemo(() => {
    const entries = (Object.entries(gradeAppMap) as [string, number][]).sort((a, b) => b[1] - a[1])
    return entries[0] || ['N/A', 0]
  }, [gradeAppMap])

  const tabs = ['Dashboard', 'Registry', 'Analytics', 'Insights']

  return (
    <div className="space-y-6">
      <PageHeader title="Tantalum Alloy Logistics" description="Tantalum alloy and compound supply chain for aerospace turbine blades, missile nozzles, tantalum capacitors, chemical corrosion-resistant reactors, orthopaedic implants and superconducting cavities across India" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-slate-600 bg-slate-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Total Investment</div><div className="text-2xl font-bold text-slate-800">&#8377;{totalInvestment.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground mt-1">Across {tantalumRecords.length} batches</div></CardContent></Card>
        <Card className="border-l-4 border-l-slate-600 bg-slate-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Avg Ta Content</div><div className="text-2xl font-bold text-slate-800">{avgTa}%</div><div className="text-xs text-muted-foreground mt-1">Across all alloy grades</div></CardContent></Card>
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
          <Card><CardHeader><CardTitle className="text-sm">Investment by City</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(cityInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([city, val]) => (<div key={city} className="flex items-center gap-2"><span className="text-xs w-24 truncate">{city}</span><div className="flex-1 bg-slate-100 rounded-full h-3"><div className="bg-slate-600 h-3 rounded-full" style={{ width: `${(val / maxCity[1]) * 100}%` }}></div></div><span className="text-xs font-medium w-20 text-right">&#8377;{val} Cr</span></div>))}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Capacitance by Grade (uF/V)</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(gradeAppMap) as [string, number][]).filter(([, cv]) => cv > 0).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([grade, cv]) => (<div key={grade} className="flex items-center gap-2"><span className="text-xs w-36 truncate">{grade}</span><div className="flex-1 bg-zinc-100 rounded-full h-3"><div className="bg-zinc-600 h-3 rounded-full" style={{ width: `${(cv / (maxCV[1] || 1)) * 100}%` }}></div></div><span className="text-xs font-medium w-20 text-right">{cv} uF/V</span></div>))}</CardContent></Card>
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
              <thead><tr className="border-b"><th className="text-left p-2">Batch</th><th className="text-left p-2">City</th><th className="text-left p-2">Manufacturer</th><th className="text-left p-2">Alloy Grade</th><th className="text-left p-2">Application</th><th className="text-left p-2">Ta%</th><th className="text-left p-2">CV</th><th className="text-left p-2">&#8377;Cr</th><th className="text-left p-2">Status</th></tr></thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id} className={`border-b ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}>
                    <td className="p-2 font-mono text-xs">{r.batchNo}</td>
                    <td className="p-2">{r.city}</td>
                    <td className="p-2">{r.manufacturer}</td>
                    <td className="p-2">{r.alloyGrade}</td>
                    <td className="p-2 max-w-[200px] truncate">{r.application}</td>
                    <td className="p-2">{r.tantalumPercent}%</td>
                    <td className="p-2">{r.capacitanceuFV}</td>
                    <td className="p-2 font-medium">&#8377;{r.investmentCr}</td>
                    <td className="p-2"><Badge variant={r.status === 'Delivered' ? 'default' : r.status === 'Delayed' ? 'destructive' : 'secondary'}>{r.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card><CardHeader><CardTitle className="text-sm">Ta Content by Alloy</CardTitle></CardHeader><CardContent className="space-y-2">{tantalumRecords.slice(0, 8).map(r => (<div key={r.id} className="flex items-center gap-2"><span className="text-xs w-36 truncate">{r.alloyGrade}</span><div className="flex-1 bg-slate-100 rounded-full h-3"><div className="bg-slate-600 h-3 rounded-full" style={{ width: `${Math.min((r.tantalumPercent / 100) * 100, 100)}%` }}></div></div><span className="text-xs font-medium w-16 text-right">{r.tantalumPercent}%</span></div>))}</CardContent></Card>
            <Card><CardHeader><CardTitle className="text-sm">Investment by Zone</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(zoneInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([zone, val]) => (<div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone}</span><div className="flex-1 bg-zinc-100 rounded-full h-3"><div className="bg-zinc-600 h-3 rounded-full" style={{ width: `${(val / maxCity[1]) * 100}%` }}></div></div><span className="text-xs font-medium w-20 text-right">&#8377;{val} Cr</span></div>))}</CardContent></Card>
          </div>
        </div>
      )}

      {activeTab === 'Analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">Status Distribution</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(statusCountMap) as [string, number][]).map(([status, count]) => (<div key={status} className="flex items-center gap-2"><span className="text-xs w-24">{status}</span><div className="flex-1 bg-slate-100 rounded-full h-3"><div className="bg-slate-600 h-3 rounded-full" style={{ width: `${(count / tantalumRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Priority Breakdown</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const map: Record<string, number> = {}; for (const r of tantalumRecords) { map[r.priority] = (map[r.priority] || 0) + 1 } const sorted = (Object.entries(map) as [string, number][]).sort((a, b) => b[1] - a[1]); return sorted.map(([pri, count]) => (<div key={pri} className="flex items-center gap-2"><span className="text-xs w-20">{pri}</span><div className="flex-1 bg-amber-100 rounded-full h-3"><div className="bg-amber-600 h-3 rounded-full" style={{ width: `${(count / tantalumRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))})()}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Shipment Volume by Zone</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const map: Record<string, number> = {}; for (const r of tantalumRecords) { map[r.zone] = (map[r.zone] || 0) + 1 } const sorted = (Object.entries(map) as [string, number][]).sort((a, b) => b[1] - a[1]); return sorted.map(([zone, count]) => (<div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone}</span><div className="flex-1 bg-indigo-100 rounded-full h-3"><div className="bg-indigo-600 h-3 rounded-full" style={{ width: `${(count / tantalumRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))})()}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Application Category Distribution</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const cats: Record<string, number> = { 'Aerospace Defence': 0, 'Chemical Reactor': 0, 'Electronics Capacitor': 0, 'Medical Implant': 0, 'Superconductor': 0, 'Surgical Tool': 0, 'Liner Corrosion': 0, 'Thin Film Target': 0 }; for (const r of tantalumRecords) { if (r.application.includes('Turbine') || r.application.includes('Missile')) cats['Aerospace Defence']++; else if (r.application.includes('Reactor') || r.application.includes('Exchanger') || r.application.includes('Probe')) cats['Chemical Reactor']++; else if (r.application.includes('Capacitor') || r.application.includes('Dielectric') || r.application.includes('Anode')) cats['Electronics Capacitor']++; else if (r.application.includes('Implant') || r.application.includes('X-Ray')) cats['Medical Implant']++; else if (r.application.includes('Superconductor') || r.application.includes('Cavity')) cats['Superconductor']++; else if (r.application.includes('Surgical') || r.application.includes('Instrument')) cats['Surgical Tool']++; else if (r.application.includes('Liner') || r.application.includes('Corrosion')) cats['Liner Corrosion']++; else cats['Thin Film Target']++ } return (Object.entries(cats) as [string, number][]).map(([cat, count]) => { const pct = `${(count / tantalumRecords.length) * 100}%`; return <div key={cat} className="flex items-center gap-2"><span className="text-xs w-32">{cat}</span><div className="flex-1 bg-slate-100 rounded-full h-3"><div className="bg-slate-600 h-3 rounded-full" style={{ width: pct }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div> })})()}</CardContent></Card>
        </div>
      )}

      {activeTab === 'Insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-l-4 border-l-slate-600"><CardHeader><CardTitle className="text-sm">Ta-W Superalloy: HAL Su-30 Blade &#8377;8,200Cr</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>Tantalum-tungsten alloy (Ta-10W, 90% Ta) is India&apos;s critical high-temperature superalloy for HAL Su-30MKI turbine blades, operating at 1,650&#176;C with creep strength of 140 MPa at 1,093&#176;C. India&apos;s aerospace Ta market is &#8377;8,200Cr, with HAL maintaining a fleet of 220 Su-30MKI aircraft and building 40 additional Su-30MKIs under licensed production from Sukhoi. Ta-10W outperforms Ni-based IN718 in the 1,200-1,650&#176;C regime, offering 3x longer blade life and 15% higher thrust. DRDO DMRL has developed indigenous Ta-W-Ta-Nb quaternary alloys (Ta-10W-2Hf) achieving 1,800&#176;C capability for hypersonic scramjet engine components. India imports 80% of its tantalum from Congo and Australia, with IREL Chavara developing domestic Ta recovery from tin slag.</p></CardContent></Card>
          <Card className="border-l-4 border-l-rose-500"><CardHeader><CardTitle className="text-sm">Ta Capacitors: 500 Million SMD Units/Year</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>Tantalum capacitors using Ta2O5 dielectric (K=27) dominate India&apos;s miniaturised electronics market (&#8377;6,800Cr), with Murata, TDK and Vishay producing 500 million SMD tantalum capacitors annually at their Bengaluru and Pune plants. The CV product (capacitance x voltage) of 470 uF/V at 200 uF 6.3V case size enables compact power supply decoupling for smartphones (2 billion units/year), EV motor controllers (Tata MG4EV uses 1,200 Ta caps per vehicle) and 5G base stations (12,000 per tower). India&apos;s Ta2O5 powder requirement is 8 tonnes/year, sourced from IREL Chavara and imported from Cabot Corporation (USA). The MnO2 cathode solid electrolyte system provides ESR below 50 milliohm, enabling 10 kHz ripple current handling for high-frequency switching power supplies.</p></CardContent></Card>
          <Card className="border-l-4 border-l-sky-500"><CardHeader><CardTitle className="text-sm">Ta Corrosion Resistance: 200 Reactors &#8377;6,500Cr</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>Tantalum&apos;s exceptional corrosion resistance (0.01 mpy in 98% H2SO4 at 200&#176;C, immune to all acids except HF) makes it irreplaceable for India&apos;s 200 chemical reactors in sulphuric acid, hydrochloric acid and mixed acid service across Hindustan Zinc, Linde India, IOCL Paradip and Deepak Fertiliser. India&apos;s chemical Ta market is &#8377;6,500Cr, with MIDHANI (Hyderabad) and Bharat Forge (Pune) as primary suppliers of Ta plate and forgings. Ta-2.5Sn provides superior formability over pure Ta for complex reactor shapes, while Ta-5Mo offers enhanced resistance to pitting in chloride-containing media. Each Ta-lined reactor costs &#8377;15-25Cr but provides 25-30 year service life versus 5-8 years for glass-lined or fluoropolymer alternatives, with annual Ta lining replacement market of &#8377;800Cr.</p></CardContent></Card>
          <Card className="border-l-4 border-l-amber-500"><CardHeader><CardTitle className="text-sm">SRF Cavities: DAE Particle Accelerator &#8377;9,200Cr</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>DAE (Department of Atomic Energy) is constructing India&apos;s next-generation particle accelerator using Ta-doped niobium superconducting radio-frequency (SRF) cavities at 1.3 GHz, where Ta doping of Nb raises the superconducting critical temperature from 9.2K (pure Nb) to 9.8K (Nb-Ta), reducing cryogenic liquid helium consumption by 30%. India&apos;s SRF cavity programme is valued at &#8377;9,200Cr, with 200+ cavities required for the 3 GeV synchrotron under construction at Gandhinagar. Each cavity achieves a quality factor Q of 10E10 at 2K operating temperature, with Ta-Nb sheet from Gujarat Fluorochemicals (60% Ta, 40% Nb) providing the optimal superconducting film. Raja Ramanna Centre for Advanced Technology (RRCAT) Indore leads cavity fabrication, using electron beam welding of Ta-Nb sheets followed by electropolishing to achieve Ra 0.1 micron surface finish.</p></CardContent></Card>
        </div>
      )}
    </div>
  )
}
