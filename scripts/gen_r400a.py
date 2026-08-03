import os

content = r"""'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { FlameKindling } from 'lucide-react'

interface CobaltPowderRecord {
  id: string
  batchNo: string
  city: string
  manufacturer: string
  powderGrade: string
  application: string
  cobaltPercent: number
  particleSizeUm: number
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

const cobaltPowderRecords: CobaltPowderRecord[] = [
  { id: 'CPW-0001', batchNo: 'CPW-B2401', city: 'Mumbai', manufacturer: 'MIDHANI', powderGrade: 'Co-Cr-Mo F75 Atomized', application: 'Ortho Implant (Stryker India)', cobaltPercent: 65.0, particleSizeUm: 75, investmentCr: 520, status: 'Delivered', priority: 'Critical', origin: 'MIDHANI Hyderabad (TG)', destination: 'Stryker Gurgaon (HR)', shipDate: '2026-07-15', transitDays: 2, zone: 'South', remarks: 'Co-Cr-Mo F75 gas-atomized powder for Stryker hip implant 3D print &#8594; 65% Co &#8594; &#8377;520Cr for 5 tonnes &#8594; India &#8377;15,600Cr medical Co &#8594; Stryker 50K implants/yr &#8594; 75um PSD &#8594; ASTM F75 &#8594; LPBF grade' },
  { id: 'CPW-0002', batchNo: 'CPW-B2402', city: 'Bengaluru', manufacturer: 'DRDO DMRL', powderGrade: 'Co-Ni-Al LMD Superalloy', application: 'Aero Turbine (HAL)', cobaltPercent: 55.0, particleSizeUm: 120, investmentCr: 680, status: 'Delivered', priority: 'Critical', origin: 'DRDO DMRL Hyderabad (TG)', destination: 'HAL Bengaluru (KA)', shipDate: '2026-07-16', transitDays: 1, zone: 'South', remarks: 'Co-Ni-Al LMD powder for HAL Tejas LCA HPT blade repair &#8594; 55% Co &#8594; &#8377;680Cr for 8 tonnes &#8594; India &#8377;20,400Cr aero Co &#8594; HAL 123 Tejas fleet &#8594; 120um PSD &#8594; 1100&#176;C service &#8594; DED grade' },
  { id: 'CPW-0003', batchNo: 'CPW-B2403', city: 'Hyderabad', manufacturer: 'IGCAR', powderGrade: 'Co-59 Metal Powder', application: 'Cancer Radiotherapy (Tata Memorial)', cobaltPercent: 99.9, particleSizeUm: 500, investmentCr: 750, status: 'Delivered', priority: 'Critical', origin: 'IGCAR Kalpakkam (TN)', destination: 'Tata Memorial Mumbai (MH)', shipDate: '2026-07-17', transitDays: 2, zone: 'South', remarks: 'Co-59 radioactive source pellets for Tata Memorial Gamma Knife radiotherapy &#8594; 99.9% Co &#8594; &#8377;750Cr for 2 tonnes &#8594; India &#8377;22,500Cr medical Co &#8594; Tata 500K treatments/yr &#8594; 500um pellet &#8594; 15 Ci &#8594; 5yr half-life' },
  { id: 'CPW-0004', batchNo: 'CPW-B2404', city: 'Chennai', manufacturer: 'Bharat Forge', powderGrade: 'Co-W 50/50 Thermal', application: 'Thermal Spray (BHEL)', cobaltPercent: 50.0, particleSizeUm: 45, investmentCr: 195, status: 'Delivered', priority: 'High', origin: 'Bharat Forge Pune (MH)', destination: 'BHEL Haridwar (UK)', shipDate: '2026-07-18', transitDays: 2, zone: 'South', remarks: 'Co-W 50/50 thermal spray powder for BHEL gas turbine bucket TBC bond &#8594; 50% Co &#8594; &#8377;195Cr for 6 tonnes &#8594; India &#8377;5,850Cr power Co &#8594; BHEL 150 GW fleet &#8594; 45um PSD &#8594; HVOF grade &#8594; 900&#176;C service' },
  { id: 'CPW-0005', batchNo: 'CPW-B2405', city: 'Pune', manufacturer: 'Exide Industries', powderGrade: 'Co-Li-Mn Oxide NMC 811', application: 'EV Battery Cathode (Exide)', cobaltPercent: 8.0, particleSizeUm: 5, investmentCr: 580, status: 'Delivered', priority: 'Critical', origin: 'Exide Kolkata (WB)', destination: 'Exide Pune (MH)', shipDate: '2026-07-19', transitDays: 2, zone: 'West', remarks: 'Co-containing NMC 811 precursor powder for Exide LFP-to-NMC transition &#8594; 8% Co &#8594; &#8377;580Cr for 25 tonnes &#8594; India &#8377;17,400Cr EV Co &#8594; Exide 10 GWh &#8594; 5um PSD &#8594; 215 mAh/g &#8594; 4.3V cutoff' },
  { id: 'CPW-0006', batchNo: 'CPW-B2406', city: 'Kolkata', manufacturer: 'SAIL', powderGrade: 'Co-Cr-W Stellite 6', application: 'Valve Seat (Crompton Greaves)', cobaltPercent: 60.0, particleSizeUm: 55, investmentCr: 165, status: 'Delivered', priority: 'Medium', origin: 'SAIL Bhilai (CG)', destination: 'Crompton Greaves Mumbai (MH)', shipDate: '2026-07-20', transitDays: 2, zone: 'East', remarks: 'Stellite 6 Co-Cr-W PTA powder for CG power valve seat hardfacing &#8594; 60% Co &#8594; &#8377;165Cr for 4 tonnes &#8594; India &#8377;4,950Cr power Co &#8594; CG 500K valves &#8594; 55um PSD &#8594; 45 HRC &#8594; PTA grade' },
  { id: 'CPW-0007', batchNo: 'CPW-B2407', city: 'Ahmedabad', manufacturer: 'Gujarat Fluorochemicals', powderGrade: 'Co 99.95% Spherical', application: 'Magnetic Alloy (Tata Steel)', cobaltPercent: 99.95, particleSizeUm: 20, investmentCr: 310, status: 'Delivered', priority: 'High', origin: 'Gujarat Fluoro Vadodara (GJ)', destination: 'Tata Steel Jamshedpur (JH)', shipDate: '2026-07-21', transitDays: 1, zone: 'West', remarks: 'Pure Co spherical powder for Tata Steel SmCo permanent magnet sintering &#8594; 99.95% Co &#8594; &#8377;310Cr for 8 tonnes &#8594; India &#8377;9,300Cr magnet Co &#8594; Tata 500T magnets/yr &#8594; 20um PSD &#8594; Sm2Co17 grade &#8594; 240 kJ/m3' },
  { id: 'CPW-0008', batchNo: 'CPW-B2408', city: 'Jaipur', manufacturer: 'Rajasthan Cobalt Industries', powderGrade: 'Co-Sm 65/35 Magnets', application: 'Defence Radar (BEL)', cobaltPercent: 65.0, particleSizeUm: 10, investmentCr: 425, status: 'Delivered', priority: 'High', origin: 'Rajasthan Cobalt Jaipur (RJ)', destination: 'BEL Bengaluru (KA)', shipDate: '2026-07-22', transitDays: 2, zone: 'North', remarks: 'Co-Sm 65/35 magnet powder for BEL AESA radar T/R module circulator &#8594; 65% Co &#8594; &#8377;425Cr for 3 tonnes &#8594; India &#8377;12,750Cr defence Co &#8594; BEL 100+ radars &#8594; 10um PSD &#8594; 1800&#176;C sinter &#8594; 200 kOe' },
  { id: 'CPW-0009', batchNo: 'CPW-B2409', city: 'Coimbatore', manufacturer: 'Tamil Nadu Cobalt Alloys', powderGrade: 'Co-Cr Stellite 21', application: 'Dental Prosthesis (Dentworks)', cobaltPercent: 62.0, particleSizeUm: 35, investmentCr: 145, status: 'Delivered', priority: 'Medium', origin: 'Tamil Nadu Cobalt Coimbatore (TN)', destination: 'Dentworks Bengaluru (KA)', shipDate: '2026-07-23', transitDays: 1, zone: 'South', remarks: 'Co-Cr Stellite 21 powder for Dentworks metal-ceramic dental crown &#8594; 62% Co &#8594; &#8377;145Cr for 2 tonnes &#8594; India &#8377;4,350Cr dental Co &#8594; Dentworks 500K crowns &#8594; 35um PSD &#8594; biocompatible &#8594; CTE matched' },
  { id: 'CPW-0010', batchNo: 'CPW-B2410', city: 'Bhubaneswar', manufacturer: 'Odisha Cobalt Refinery', powderGrade: 'Co-Mo 50/50 Desulph', application: 'Refinery Catalyst (IOCL)', cobaltPercent: 50.0, particleSizeUm: 3, investmentCr: 280, status: 'Delivered', priority: 'High', origin: 'Odisha Cobalt Bhubaneswar (OD)', destination: 'IOCL Paradip (OD)', shipDate: '2026-07-24', transitDays: 1, zone: 'East', remarks: 'Co-Mo 50/50 impregnated catalyst for IOCL Paradip HDS unit &#8594; 50% Co &#8594; &#8377;280Cr for 15 tonnes &#8594; India &#8377;8,400Cr refinery Co &#8594; IOCL 15 MMTPA &#8594; 3um on alumina &#8594; 500 ppm S target &#8594; 380&#176;C' },
  { id: 'CPW-0011', batchNo: 'CPW-B2411', city: 'Guwahati', manufacturer: 'Assam Cobalt Works', powderGrade: 'Co-Cr-Etch Alloy Wire', application: 'Jet Engine Turbine (Wipro Aero)', cobaltPercent: 58.0, particleSizeUm: 80, investmentCr: 490, status: 'Delivered', priority: 'Critical', origin: 'Assam Cobalt Guwahati (AS)', destination: 'Wipro Aero Bengaluru (KA)', shipDate: '2026-07-25', transitDays: 4, zone: 'East', remarks: 'Co-Cr-W-Ni superalloy wire powder for Wipro Aero GE F414 engine MRO &#8594; 58% Co &#8594; &#8377;490Cr for 6 tonnes &#8594; India &#8377;14,700Cr aero Co &#8594; Wipro 200 engines/yr &#8594; 80um PSD &#8594; 1050&#176;C &#8594; forged bar' },
  { id: 'CPW-0002', batchNo: 'CPW-B2412', city: 'Surat', manufacturer: 'Gujarat Cobalt Technologies', powderGrade: 'Co 99.9% Carbide Binder', application: 'WC-Co Tool (Sandvik)', cobaltPercent: 99.9, particleSizeUm: 2, investmentCr: 340, status: 'Delayed', priority: 'High', origin: 'Gujarat Cobalt Surat (GJ)', destination: 'Sandvik Pune (MH)', shipDate: '2026-07-09', transitDays: 12, zone: 'West', remarks: 'Ultra-fine Co powder for Sandvik WC-Co cemented carbide binder &#8594; 99.9% Co &#8594; &#8377;340Cr for 4 tonnes &#8594; India &#8377;10,200Cr tool Co &#8594; monsoon delay &#8594; 2um PSD &#8594; 6% Co binder &#8594; 1900 HV' },
  { id: 'CPW-0013', batchNo: 'CPW-B2413', city: 'Noida', manufacturer: 'UP Cobalt Alloys', powderGrade: 'Co-Fe 50/50 Soft Mag', application: 'EMI Filter (BEL)', cobaltPercent: 50.0, particleSizeUm: 30, investmentCr: 175, status: 'Delivered', priority: 'Medium', origin: 'UP Cobalt Noida (UP)', destination: 'BEL Ghaziabad (UP)', shipDate: '2026-07-26', transitDays: 1, zone: 'North', remarks: 'Co-Fe 50/50 soft magnetic powder for BEL radar EMI line filter core &#8594; 50% Co &#8594; &#8377;175Cr for 6 tonnes &#8594; India &#8377;5,250Cr defence Co &#8594; BEL 100+ sites &#8594; 30um PSD &#8594; mu-r 15,000 &#8594; 1 MHz' },
  { id: 'CPW-0014', batchNo: 'CPW-B2414', city: 'Bhopal', manufacturer: 'BHEL', powderGrade: 'Co-Ni-Cr-W Alloy 718', application: 'Gas Turbine Blade (BHEL)', cobaltPercent: 40.0, particleSizeUm: 90, investmentCr: 560, status: 'Delivered', priority: 'Critical', origin: 'BHEL Bhopal (MP)', destination: 'BHEL Hyderabad (TG)', shipDate: '2026-07-27', transitDays: 2, zone: 'North', remarks: 'Co-Ni-Cr-W superalloy powder for BHEL 800 MW gas turbine bucket LP blade &#8594; 40% Co &#8594; &#8377;560Cr for 10 tonnes &#8594; India &#8377;16,800Cr power Co &#8594; BHEL 150 GW &#8594; 90um PSD &#8594; 980&#176;C creep &#8594; HIP grade' }
]

const delayedSet = new Set(cobaltPowderRecords.filter(r => r.status === 'Delayed').map(r => r.id))

export default function CobaltPowderLogisticsView() {
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState(0)
  const [filters, setFilters] = useState<Record<string, string[]>>({})

  const tabs = ['Dashboard', 'Registry', 'Analytics', 'Insights']
  const toggleFilter = (group: string, val: string) => {
    setFilters(prev => {
      const arr = prev[group] || []
      const next = arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]
      if (!next.length) { const n = { ...prev }; delete n[group]; return n }
      return { ...prev, [group]: next }
    })
  }

  const filtered = useMemo(() => {
    let data = cobaltPowderRecords
    if (search) data = data.filter(r => Object.values(r).some(v => String(v).toLowerCase().includes(search.toLowerCase())))
    Object.entries(filters).forEach(([k, vals]) => { if (vals.length) data = data.filter(r => vals.includes(String((r as any)[k]))) })
    return data
  }, [search, filters])

  const total = cobaltPowderRecords.length
  const delivered = cobaltPowderRecords.filter(r => r.status === 'Delivered').length
  const totalCr = cobaltPowderRecords.reduce((s: number, r) => s + r.investmentCr, 0)
  const avgCo = +(cobaltPowderRecords.reduce((s: number, r) => s + r.cobaltPercent, 0) / total).toFixed(1)

  const manufacturers = [...new Set(cobaltPowderRecords.map(r => r.manufacturer))]
  const zones = [...new Set(cobaltPowderRecords.map(r => r.zone))]

  return (
    <div className="space-y-6">
      <PageHeader title="Cobalt Powder Logistics" description="Indian cobalt powder supply chain tracking across medical implants, aerospace superalloy, radiotherapy, EV battery cathode, hardfacing, permanent magnets, refinery catalyst and defence radar sectors" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent><div className="text-2xl font-bold text-violet-600">{total}</div><div className="text-xs text-muted-foreground">Total Shipments</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-violet-600">{delivered}</div><div className="text-xs text-muted-foreground">Delivered</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-violet-600">&#8377;{totalCr.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground">Total Investment</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-violet-600">{avgCo}%</div><div className="text-xs text-muted-foreground">Avg Co Content</div></CardContent></Card>
      </div>

      <div className="flex gap-2 border-b">
        {tabs.map((t, i) => (<button key={t} className={`px-4 py-2 ${activeTab === i ? 'border-b-2 border-violet-600 text-violet-600 font-semibold' : 'text-muted-foreground'}`} onClick={() => setActiveTab(i)}>{t}</button>))}
      </div>

      {activeTab === 0 && (<div className="space-y-4">
        <div className="flex gap-2"><Input placeholder="Search shipments..." value={search} onChange={e => setSearch(e.target.value)} /></div>
        <div className="flex gap-2 flex-wrap">
          {zones.map(z => <Badge key={z} variant={filters.zone?.includes(z) ? 'default' : 'outline'} className="cursor-pointer" onClick={() => toggleFilter('zone', z)}>{z}</Badge>)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">Zone Distribution</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { m[r.zone] = (m[r.zone] || 0) + 1; return m }, {} as Record<string, number>)) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([z, c]) => (<div key={z} className="flex justify-between text-sm"><span>{z}</span><span className="font-medium">{c}</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Priority Mix</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { m[r.priority] = (m[r.priority] || 0) + 1; return m }, {} as Record<string, number>)) as [string, number][]).map(([p, c]) => (<div key={p} className="flex justify-between text-sm"><span>{p}</span><span className="font-medium">{c}</span></div>))}</div></CardContent></Card>
        </div>
        <div className="rounded-md border"><div className="max-h-96 overflow-auto"><table className="w-full text-sm"><thead className="sticky top-0 bg-background"><tr><th className="p-2 text-left">ID</th><th className="p-2 text-left">Batch</th><th className="p-2 text-left">Grade</th><th className="p-2 text-left">Application</th><th className="p-2 text-right">Co%</th><th className="p-2 text-right">&#8377;Cr</th><th className="p-2 text-left">Status</th></tr></thead><tbody>{filtered.map(r => (<tr key={r.id} className={`border-t ${delayedSet.has(r.id) ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}><td className="p-2">{r.id}</td><td className="p-2">{r.batchNo}</td><td className="p-2">{r.powderGrade}</td><td className="p-2">{r.application}</td><td className="p-2 text-right">{r.cobaltPercent}</td><td className="p-2 text-right">{r.investmentCr}</td><td className="p-2"><Badge variant={r.status === 'Delivered' ? 'default' : 'destructive'}>{r.status}</Badge></td></tr>))}</tbody></table></div></div>
      </div>)}

      {activeTab === 1 && (<div className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          {manufacturers.map(m => <Badge key={m} variant={filters.manufacturer?.includes(m) ? 'default' : 'outline'} className="cursor-pointer" onClick={() => toggleFilter('manufacturer', m)}>{m}</Badge>)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">By Manufacturer</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { m[r.manufacturer] = (m[r.manufacturer] || 0) + 1; return m }, {} as Record<string, number>)) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([m, c]) => (<div key={m} className="flex justify-between text-sm"><span>{m}</span><span className="font-medium">{c}</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Particle Size Range</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { const s = r.particleSizeUm <= 10 ? 'Nano/Fine (0-10 um)' : r.particleSizeUm <= 50 ? 'Fine (11-50 um)' : r.particleSizeUm <= 120 ? 'Medium (51-120 um)' : 'Coarse (121+ um)'; m[s] = (m[s] || 0) + 1; return m }, {} as Record<string, number>)) as [string, number][]).map(([k, c]) => (<div key={k} className="flex justify-between text-sm"><span>{k}</span><span className="font-medium">{c}</span></div>))}</div></CardContent></Card>
        </div>
        <div className="rounded-md border"><div className="max-h-96 overflow-auto"><table className="w-full text-sm"><thead className="sticky top-0 bg-background"><tr><th className="p-2 text-left">ID</th><th className="p-2 text-left">Manufacturer</th><th className="p-2 text-left">Grade</th><th className="p-2 text-left">Origin</th><th className="p-2 text-left">Destination</th><th className="p-2 text-right">Transit</th><th className="p-2 text-left">Zone</th></tr></thead><tbody>{filtered.map(r => (<tr key={r.id} className={`border-t ${delayedSet.has(r.id) ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}><td className="p-2">{r.id}</td><td className="p-2">{r.manufacturer}</td><td className="p-2">{r.powderGrade}</td><td className="p-2">{r.origin}</td><td className="p-2">{r.destination}</td><td className="p-2 text-right">{r.transitDays}d</td><td className="p-2">{r.zone}</td></tr>))}</tbody></table></div></div>
      </div>)}

      {activeTab === 2 && (<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card><CardHeader><CardTitle className="text-sm">Investment by Application</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { m[r.application] = (m[r.application] || 0) + r.investmentCr; return m }, {} as Record<string, number>)) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 7).map(([a, v]) => (<div key={a} className="flex justify-between text-sm"><span>{a}</span><span className="font-medium">&#8377;{v}Cr</span></div>))}</div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Cobalt Content Distribution</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { const n = r.cobaltPercent >= 90 ? 'Pure (90%+)' : r.cobaltPercent >= 60 ? 'High (60-90%)' : r.cobaltPercent >= 40 ? 'Medium (40-60%)' : 'Low (<40%)'; m[n] = (m[n] || 0) + 1; return m }, {} as Record<string, number>)) as [string, number][]).map(([k, c]) => (<div key={k} className="flex justify-between text-sm"><span>{k}</span><span className="font-medium">{c}</span></div>))}</div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Top Routes by Value</CardTitle></CardHeader><CardContent><div className="space-y-2">{filtered.sort((a, b) => b.investmentCr - a.investmentCr).slice(0, 7).map(r => (<div key={r.id} className="flex justify-between text-sm"><span>{r.origin.split('(')[0]} &#8594; {r.destination.split('(')[0]}</span><span className="font-medium">&#8377;{r.investmentCr}Cr</span></div>))}</div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Aerospace Grade Powders</CardTitle></CardHeader><CardContent><div className="space-y-2">{filtered.filter(r => r.application.toLowerCase().includes('aero') || r.application.toLowerCase().includes('turbine') || r.application.toLowerCase().includes('engine')).sort((a, b) => b.investmentCr - a.investmentCr).map(r => (<div key={r.id} className="flex justify-between text-sm"><span>{r.powderGrade} ({r.particleSizeUm}um)</span><span className="font-medium">&#8377;{r.investmentCr}Cr</span></div>))}</div></CardContent></Card>
      </div>)}

      {activeTab === 3 && (<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card><CardContent><div className="text-sm font-medium text-violet-600 mb-2">India Co-60 Radiotherapy Expansion</div><div className="text-xs text-muted-foreground">India has 700+ cancer treatment centres, 60% using Co-60 Gamma Knife and teletherapy units. IGCAR Kalpakkam supplying 95% domestic Co-60 source pellets. Tata Memorial, AIIMS and 200 district hospitals adding new machines. India targeting 1,200 machines by 2028, requiring 4 TPA Co-60.</div></CardContent></Card>
        <Card><CardContent><div className="text-sm font-medium text-violet-600 mb-2">NMC Battery Co Supply Chain</div><div className="text-xs text-muted-foreground">Indian EV battery market shifting from LFP to NMC 811 chemistry, increasing cobalt demand despite global de-cobalt trend. Exide, Amara Raja and Reliance consuming 30 TPA cobalt for cathode precursors. India importing 95% cobalt from DRC. MIDHANI setting up 10 TPA Co sulfate plant by 2027.</div></CardContent></Card>
        <Card><CardContent><div className="text-sm font-medium text-violet-600 mb-2">Monsoon Disrupts Carbide Binder</div><div className="text-xs text-muted-foreground">CPW-B2412 ultra-fine Co powder for Sandvik WC-Co carbide binder delayed 12 days due to Gujarat monsoon flooding. Sandvik Pune CNC insert production at risk. India consuming 8 TPA Co for cemented carbide tooling. Recommend pre-positioning 5-tonne buffer at Pune warehouse.</div></CardContent></Card>
        <Card><CardContent><div className="text-sm font-medium text-violet-600 mb-2">Aerospace Superalloy AM Ramp</div><div className="text-xs text-muted-foreground">HAL, Wipro Aero and DRDO DMRL consuming 25 TPA Co-based superalloy powders for Tejas LCA and GE F414 engine MRO. Co-Ni-Al LMD blade repair and Co-Cr-Mo F75 3D-printed implants driving 40% CAGR. MIDHANI and DRDO commissioning 200 TPA gas atomizer by 2027.</div></CardContent></Card>
      </div>)}
    </div>
  )
}
"""

outpath = '/home/z/my-project/src/components/modules/cobalt-powder-logistics-view.tsx'
with open(outpath, 'w') as f:
    f.write(content)
print(f"Written {len(content)} bytes to {outpath}")
