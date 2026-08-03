'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { Sparkles } from 'lucide-react'

interface NickelPowderRecord {
  id: string
  batchNo: string
  city: string
  manufacturer: string
  powderGrade: string
  application: string
  nickelPercent: number
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

const nickelPowderRecords: NickelPowderRecord[] = [
  { id: 'NPW-0001', batchNo: 'NPW-B2401', city: 'Mumbai', manufacturer: 'MIDHANI', powderGrade: 'Carbonyl Ni 99.9% 4-7um', application: 'MLCC Electrode (Murata India)', nickelPercent: 99.9, particleSizeUm: 5.5, investmentCr: 280, status: 'Delivered', priority: 'Critical', origin: 'MIDHANI Hyderabad (TG)', destination: 'Murata India Noida (UP)', shipDate: '2026-07-15', transitDays: 2, zone: 'South', remarks: 'Carbonyl Ni powder for Murata MLCC inner electrode paste \u2192 99.9% Ni \u2192 \u20b9280Cr for 15 tonnes \u2192 India \u20b98,400Cr MLCC Ni \u2192 Murata 500M MLCC/month \u2192 5.5um mean PSD \u2192 tap density 4.0 g/cc \u2192 85% camber-free' },
  { id: 'NPW-0002', batchNo: 'NPW-B2402', city: 'Bengaluru', manufacturer: 'DRDO DMRL', powderGrade: 'IN718 Atomized 50-150um', application: 'Aero Turbine Blade (HAL)', nickelPercent: 52.5, particleSizeUm: 100, investmentCr: 680, status: 'Delivered', priority: 'Critical', origin: 'DRDO DMRL Hyderabad (TG)', destination: 'HAL Bengaluru (KA)', shipDate: '2026-07-16', transitDays: 1, zone: 'South', remarks: 'Gas-atomized IN718 powder for HAL Su-30MKI LPT blade LMD \u2192 52.5% Ni \u2192 \u20b9680Cr for 20 tonnes \u2192 India \u20b920,400Cr aero Ni powder \u2192 HAL 220 Su-30 fleet \u2192 100um PSD \u2192 spherical >95% \u2192 laser DED grade' },
  { id: 'NPW-0003', batchNo: 'NPW-B2403', city: 'Pune', manufacturer: 'Bharat Forge', powderGrade: 'Stainless Ni 18% 45-106um', application: 'Automotive MIM (Bharat Forge)', nickelPercent: 18.0, particleSizeUm: 75, investmentCr: 125, status: 'Delivered', priority: 'Medium', origin: 'Bharat Forge Pune (MH)', destination: 'Bharat Forge Satara (MH)', shipDate: '2026-07-17', transitDays: 1, zone: 'West', remarks: 'Water-atomized 316L+Ni for MIM fuel injector bracket \u2192 18% Ni \u2192 \u20b9125Cr for 10 tonnes \u2192 India \u20b93,750Cr MIM Ni \u2192 Bharat Forge 500K parts/yr \u2192 75um PSD \u2192 98% packing density \u2192 7.5 g/cc green' },
  { id: 'NPW-0004', batchNo: 'NPW-B2404', city: 'Mumbai', manufacturer: 'Hindalco Novelis', powderGrade: 'Ni-Co Plating Grade 99.5%', application: 'EV Battery Cathode (Exide)', nickelPercent: 99.5, particleSizeUm: 8.0, investmentCr: 520, status: 'Delivered', priority: 'Critical', origin: 'Hindalco Renukoot (UP)', destination: 'Exide Kolkata (WB)', shipDate: '2026-07-18', transitDays: 2, zone: 'West', remarks: 'Ni-Co plating powder for Exide Li-ion cathode coating \u2192 99.5% Ni \u2192 \u20b9520Cr for 25 tonnes \u2192 India \u20b915,600Cr EV Ni \u2192 Exide 10 GWh \u2192 8um PSD \u2192 6.2 g/cc \u2192 99.8% efficiency' },
  { id: 'NPW-0005', batchNo: 'NPW-B2405', city: 'Hyderabad', manufacturer: 'IGCAR', powderGrade: 'UO2-NiO Cermet 80/20', application: 'Nuclear Fuel Pellet (NPCIL)', nickelPercent: 20.0, particleSizeUm: 1.5, investmentCr: 410, status: 'Delivered', priority: 'Critical', origin: 'IGCAR Kalpakkam (TN)', destination: 'NPCIL Hyderabad (TG)', shipDate: '2026-07-19', transitDays: 1, zone: 'South', remarks: 'UO2-NiO cermet for PFBR MOX fuel pellet \u2192 20% Ni \u2192 \u20b9410Cr for 30 tonnes \u2192 India \u20b912,300Cr nuclear Ni \u2192 NPCIL 7.5 GW \u2192 1.5um sub-micron \u2192 10.5 g/cc sintered \u2192 95% TD' },
  { id: 'NPW-0006', batchNo: 'NPW-B2406', city: 'Kolkata', manufacturer: 'SAIL', powderGrade: 'Ni-Cr 80/20 Thermal', application: 'Thermal Spray (BHEL)', nickelPercent: 80.0, particleSizeUm: 45, investmentCr: 195, status: 'Delivered', priority: 'High', origin: 'SAIL Bhilai (CG)', destination: 'BHEL Haridwar (UK)', shipDate: '2026-07-20', transitDays: 2, zone: 'East', remarks: 'NiCr 80/20 thermal spray powder for BHEL 800 MW boiler tube \u2192 80% Ni \u2192 \u20b9195Cr for 12 tonnes \u2192 India \u20b95,850Cr power Ni \u2192 BHEL 150 GW fleet \u2192 45um PSD \u2192 HVOF sprayed \u2192 1000\u00b0C TBC bond' },
  { id: 'NPW-0007', batchNo: 'NPW-B2407', city: 'Ahmedabad', manufacturer: 'Gujarat Fluorochemicals', powderGrade: 'Ni Foam 99.8% 20 PPI', application: 'H2 Electrolyzer (Reliance)', nickelPercent: 99.8, particleSizeUm: 500, investmentCr: 750, status: 'Delivered', priority: 'Critical', origin: 'Gujarat Fluoro Vadodara (GJ)', destination: 'Reliance Jamnagar (GJ)', shipDate: '2026-07-21', transitDays: 1, zone: 'West', remarks: 'Ni foam substrate for Reliance alkaline electrolyzer electrode \u2192 99.8% Ni \u2192 \u20b9750Cr for 40 tonnes \u2192 India \u20b922,500Cr H2 Ni \u2192 Reliance 10 GW green H2 \u2192 500um pore size \u2192 95% porosity \u2192 3 mm thick' },
  { id: 'NPW-0008', batchNo: 'NPW-B2408', city: 'Chennai', manufacturer: 'Stainless India Ltd', powderGrade: 'Spherical Ni 99.7% 15-45um', application: '3D Print Rotor (GE India)', nickelPercent: 99.7, particleSizeUm: 30, investmentCr: 580, status: 'Delivered', priority: 'Critical', origin: 'Stainless India Chennai (TN)', destination: 'GE India Pune (MH)', shipDate: '2026-07-22', transitDays: 2, zone: 'South', remarks: 'Spherical Ni powder for GE 9FA gas turbine seal 3D print \u2192 99.7% Ni \u2192 \u20b9580Cr for 18 tonnes \u2192 India \u20b917,400Cr AM Ni \u2192 GE 500 MW fleet \u2192 30um PSD \u2192 D25 >10 \u2192 LPBF grade' },
  { id: 'NPW-0009', batchNo: 'NPW-B2409', city: 'Jaipur', manufacturer: 'Rajasthan Nickel Industries', powderGrade: 'Ni-W 85/15 Electro', application: 'Hard Chrome Alt (L&T)', nickelPercent: 85.0, particleSizeUm: 12, investmentCr: 165, status: 'Delivered', priority: 'Medium', origin: 'Rajasthan Nickel Jaipur (RJ)', destination: 'L&T Mumbai (MH)', shipDate: '2026-07-23', transitDays: 2, zone: 'North', remarks: 'Ni-W alloy powder for L&T offshore valve plating \u2192 85% Ni \u2192 \u20b9165Cr for 8 tonnes \u2192 India \u20b94,950Cr marine Ni \u2192 L&T 40 warships \u2192 12um PSD \u2192 800 HV hardness \u2192 Cr-free alternative' },
  { id: 'NPW-0010', batchNo: 'NPW-B2410', city: 'Coimbatore', manufacturer: 'Tamil Nadu Nickel Alloys', powderGrade: 'Ni-Mn 55/45 Sinter', application: 'EV Battery Grid (Amararaja)', nickelPercent: 55.0, particleSizeUm: 20, investmentCr: 340, status: 'Delivered', priority: 'High', origin: 'Tamil Nadu Nickel Coimbatore (TN)', destination: 'Amararaja Tirunelveli (TN)', shipDate: '2026-07-24', transitDays: 1, zone: 'South', remarks: 'Ni-Mn sintered strip for Amararaja lead-acid grid \u2192 55% Ni \u2192 \u20b9340Cr for 22 tonnes \u2192 India \u20b910,200Cr battery Ni \u2192 Amararaja 20M batteries \u2192 20um PSD \u2192 1200 cycle life \u2192 Pb-free grid' },
  { id: 'NPW-0011', batchNo: 'NPW-B2411', city: 'Bhubaneswar', manufacturer: 'Odisha Nickel Refinery', powderGrade: 'Ni-Fe 50/50 Soft Mag', application: 'EMI Shield (BEL)', nickelPercent: 50.0, particleSizeUm: 35, investmentCr: 145, status: 'Delivered', priority: 'High', origin: 'Odisha Nickel Bhubaneswar (OD)', destination: 'BEL Bengaluru (KA)', shipDate: '2026-07-25', transitDays: 2, zone: 'East', remarks: 'Ni-Fe powder compact for BEL radar cabin EMI shield \u2192 50% Ni \u2192 \u20b9145Cr for 10 tonnes \u2192 India \u20b94,350Cr defence Ni \u2192 BEL 100+ sites \u2192 35um PSD \u2192 mu-r 20,000 \u2192 40 dB shielding' },
  { id: 'NPW-0012', batchNo: 'NPW-B2412', city: 'Guwahati', manufacturer: 'Assam Nickel Works', powderGrade: 'Ni-Mo 60/40 Catalyst', application: 'Refinery Desulph (IOCL)', nickelPercent: 60.0, particleSizeUm: 25, investmentCr: 280, status: 'Delayed', priority: 'High', origin: 'Assam Nickel Guwahati (AS)', destination: 'IOCL Guwahati (AS)', shipDate: '2026-07-12', transitDays: 9, zone: 'East', remarks: 'Ni-Mo catalyst for IOCL Guwahati HDS unit \u2192 60% Ni \u2192 \u20b9280Cr for 15 tonnes \u2192 India \u20b98,400Cr refinery Ni \u2192 monsoon delay \u2192 25um PSD \u2192 gamma-Al2O3 support \u2192 500 ppm S target' },
  { id: 'NPW-0013', batchNo: 'NPW-B2413', city: 'Surat', manufacturer: 'Gujarat Nickel Technologies', powderGrade: 'Pure Ni 99.99% Sponge', application: 'Brazing Paste (Tata Steel)', nickelPercent: 99.99, particleSizeUm: 150, investmentCr: 195, status: 'Delivered', priority: 'Medium', origin: 'Gujarat Nickel Surat (GJ)', destination: 'Tata Steel Jamshedpur (JH)', shipDate: '2026-07-26', transitDays: 2, zone: 'West', remarks: 'Ni sponge for Tata Steel BNi-2 brazing paste vacuum furnace \u2192 99.99% Ni \u2192 \u20b9195Cr for 10 tonnes \u2192 India \u20b95,850Cr steel Ni \u2192 Tata 35 MT/yr \u2192 150um PSD \u2192 1100\u00b0C braze \u2192 AWS C1' },
  { id: 'NPW-0014', batchNo: 'NPW-B2414', city: 'Noida', manufacturer: 'UP Nickel Alloys', powderGrade: 'Ni-Cr-Al 70/20/10 Bond', application: 'Turbine Blade TBC (HAL)', nickelPercent: 70.0, particleSizeUm: 55, investmentCr: 420, status: 'Delivered', priority: 'Critical', origin: 'UP Nickel Noida (UP)', destination: 'HAL Koraput (OD)', shipDate: '2026-07-27', transitDays: 3, zone: 'North', remarks: 'NiCrAlY bond coat powder for HAL Sukhoi engine TBC \u2192 70% Ni \u2192 \u20b9420Cr for 14 tonnes \u2192 India \u20b912,600Cr aero Ni powder \u2192 HAL 220 Su-30 fleet \u2192 55um PSD \u2192 APS sprayed \u2192 1100\u00b0C service' }
]

const delayedSet = new Set(nickelPowderRecords.filter(r => r.status === 'Delayed').map(r => r.id))

export default function NickelPowderLogisticsView() {
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
    let data = nickelPowderRecords
    if (search) data = data.filter(r => Object.values(r).some(v => String(v).toLowerCase().includes(search.toLowerCase())))
    Object.entries(filters).forEach(([k, vals]) => { if (vals.length) data = data.filter(r => vals.includes(String((r as any)[k]))) })
    return data
  }, [search, filters])

  const total = nickelPowderRecords.length
  const delivered = nickelPowderRecords.filter(r => r.status === 'Delivered').length
  const totalCr = nickelPowderRecords.reduce((s: number, r) => s + r.investmentCr, 0)
  const avgNi = +(nickelPowderRecords.reduce((s: number, r) => s + r.nickelPercent, 0) / total).toFixed(1)

  const manufacturers = [...new Set(nickelPowderRecords.map(r => r.manufacturer))]
  const zones = [...new Set(nickelPowderRecords.map(r => r.zone))]

  return (
    <div className="space-y-6">
      <PageHeader title="Nickel Powder Logistics" description="Indian nickel powder supply chain tracking across MLCC, aerospace AM, EV battery, nuclear, hydrogen electrolyzer and thermal spray sectors" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent><div className="text-2xl font-bold text-slate-600">{total}</div><div className="text-xs text-muted-foreground">Total Shipments</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-slate-600">{delivered}</div><div className="text-xs text-muted-foreground">Delivered</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-slate-600">&#8377;{totalCr.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground">Total Investment</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-slate-600">{avgNi}%</div><div className="text-xs text-muted-foreground">Avg Ni Content</div></CardContent></Card>
      </div>

      <div className="flex gap-2 border-b">
        {tabs.map((t, i) => (<button key={t} className={`px-4 py-2 ${activeTab === i ? 'border-b-2 border-slate-600 text-slate-600 font-semibold' : 'text-muted-foreground'}`} onClick={() => setActiveTab(i)}>{t}</button>))}
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
        <div className="rounded-md border"><div className="max-h-96 overflow-auto"><table className="w-full text-sm"><thead className="sticky top-0 bg-background"><tr><th className="p-2 text-left">ID</th><th className="p-2 text-left">Batch</th><th className="p-2 text-left">Grade</th><th className="p-2 text-left">Application</th><th className="p-2 text-right">Ni%</th><th className="p-2 text-right">&#8377;Cr</th><th className="p-2 text-left">Status</th></tr></thead><tbody>{filtered.map(r => (<tr key={r.id} className={`border-t ${delayedSet.has(r.id) ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}><td className="p-2">{r.id}</td><td className="p-2">{r.batchNo}</td><td className="p-2">{r.powderGrade}</td><td className="p-2">{r.application}</td><td className="p-2 text-right">{r.nickelPercent}</td><td className="p-2 text-right">{r.investmentCr}</td><td className="p-2"><Badge variant={r.status === 'Delivered' ? 'default' : 'destructive'}>{r.status}</Badge></td></tr>))}</tbody></table></div></div>
      </div>)}

      {activeTab === 1 && (<div className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          {manufacturers.map(m => <Badge key={m} variant={filters.manufacturer?.includes(m) ? 'default' : 'outline'} className="cursor-pointer" onClick={() => toggleFilter('manufacturer', m)}>{m}</Badge>)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">By Manufacturer</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { m[r.manufacturer] = (m[r.manufacturer] || 0) + 1; return m }, {} as Record<string, number>)) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([m, c]) => (<div key={m} className="flex justify-between text-sm"><span>{m}</span><span className="font-medium">{c}</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Particle Size Range</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { const s = r.particleSizeUm < 10 ? 'Nano/Sub-micron' : r.particleSizeUm < 50 ? 'Fine (<50 um)' : r.particleSizeUm < 150 ? 'Medium (50-150 um)' : 'Coarse (>150 um)'; m[s] = (m[s] || 0) + 1; return m }, {} as Record<string, number>)) as [string, number][]).map(([k, c]) => (<div key={k} className="flex justify-between text-sm"><span>{k}</span><span className="font-medium">{c}</span></div>))}</div></CardContent></Card>
        </div>
        <div className="rounded-md border"><div className="max-h-96 overflow-auto"><table className="w-full text-sm"><thead className="sticky top-0 bg-background"><tr><th className="p-2 text-left">ID</th><th className="p-2 text-left">Manufacturer</th><th className="p-2 text-left">Grade</th><th className="p-2 text-left">Origin</th><th className="p-2 text-left">Destination</th><th className="p-2 text-right">Transit</th><th className="p-2 text-left">Zone</th></tr></thead><tbody>{filtered.map(r => (<tr key={r.id} className={`border-t ${delayedSet.has(r.id) ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}><td className="p-2">{r.id}</td><td className="p-2">{r.manufacturer}</td><td className="p-2">{r.powderGrade}</td><td className="p-2">{r.origin}</td><td className="p-2">{r.destination}</td><td className="p-2 text-right">{r.transitDays}d</td><td className="p-2">{r.zone}</td></tr>))}</tbody></table></div></div>
      </div>)}

      {activeTab === 2 && (<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card><CardHeader><CardTitle className="text-sm">Investment by Application</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { m[r.application] = (m[r.application] || 0) + r.investmentCr; return m }, {} as Record<string, number>)) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 7).map(([a, v]) => (<div key={a} className="flex justify-between text-sm"><span>{a}</span><span className="font-medium">&#8377;{v}Cr</span></div>))}</div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Ni Content Distribution</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { const n = r.nickelPercent >= 99 ? 'Pure (>99%)' : r.nickelPercent >= 80 ? 'High (80-99%)' : r.nickelPercent >= 50 ? 'Medium (50-80%)' : 'Low (<50%)'; m[n] = (m[n] || 0) + 1; return m }, {} as Record<string, number>)) as [string, number][]).map(([k, c]) => (<div key={k} className="flex justify-between text-sm"><span>{k}</span><span className="font-medium">{c}</span></div>))}</div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Top Routes by Value</CardTitle></CardHeader><CardContent><div className="space-y-2">{filtered.sort((a, b) => b.investmentCr - a.investmentCr).slice(0, 7).map(r => (<div key={r.id} className="flex justify-between text-sm"><span>{r.origin.split('(')[0]} &#8594; {r.destination.split('(')[0]}</span><span className="font-medium">&#8377;{r.investmentCr}Cr</span></div>))}</div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Additive Manufacturing Powders</CardTitle></CardHeader><CardContent><div className="space-y-2">{filtered.filter(r => r.particleSizeUm >= 15 && r.particleSizeUm <= 150 && r.nickelPercent >= 50).sort((a, b) => b.investmentCr - a.investmentCr).map(r => (<div key={r.id} className="flex justify-between text-sm"><span>{r.powderGrade} ({r.particleSizeUm}um)</span><span className="font-medium">&#8377;{r.investmentCr}Cr</span></div>))}</div></CardContent></Card>
      </div>)}

      {activeTab === 3 && (<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card><CardContent><div className="text-sm font-medium text-slate-600 mb-2">MLCC Ni Electrode Surge</div><div className="text-xs text-muted-foreground">Indian MLCC market growing at 35% CAGR driven by Murata, Samsung and TDK India expansion. Carbonyl Ni powder demand at 80 TPA, of which MIDHANI supplies 35% domestically. 5G smartphone penetration driving 0402/0201 MLCC demand surge.</div></CardContent></Card>
        <Card><CardContent><div className="text-sm font-medium text-slate-600 mb-2">Green Hydrogen Ni Foam</div><div className="text-xs text-muted-foreground">Reliance and Adani electrolyzer programs consuming 200 TPA nickel foam for alkaline electrodes. India targeting 10 GW green hydrogen by 2030. Ni foam demand growing at 60% CAGR, with Gujarat Fluorochemicals expanding 4x capacity.</div></CardContent></Card>
        <Card><CardContent><div className="text-sm font-medium text-slate-600 mb-2">Monsoon Disrupts Refinery Catalyst</div><div className="text-xs text-muted-foreground">NPW-B2412 Ni-Mo HDS catalyst delayed 9 days due to Assam monsoon flooding. IOCL Guwahati refinery desulphurization unit at risk of shutdown. Recommend pre-positioning 30-tonne buffer at Guwahati warehouse for Q3 monsoon.</div></CardContent></Card>
        <Card><CardContent><div className="text-sm font-medium text-slate-600 mb-2">Additive Manufacturing Ramp</div><div className="text-xs text-muted-foreground">GE India, HAL and Wipro 3D printing nickel superalloy powder demand growing at 50% CAGR. IN718 and NiCrAlY powders dominate. DRDO DMRL and MIDHANI setting up 500 TPA gas atomizer by 2027 to reduce 90% import dependency.</div></CardContent></Card>
      </div>)}
    </div>
  )
}
