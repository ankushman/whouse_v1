#!/usr/bin/env python3
"""Generate titanium-powder-logistics-view.tsx (R403a)"""
import os

content = r"""'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { PlaneTakeoff } from 'lucide-react'

interface TitaniumPowderRecord {
  id: string
  batchNo: string
  city: string
  manufacturer: string
  powderGrade: string
  application: string
  titaniumPercent: number
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

const titaniumPowderRecords: TitaniumPowderRecord[] = [
  { id: 'TIP-0001', batchNo: 'TIP-B2401', city: 'Mumbai', manufacturer: 'MIDHANI', powderGrade: 'Ti-6Al-4V Grade 5 Spherical', application: 'Aero Structure (HAL)', titaniumPercent: 90.0, particleSizeUm: 45, investmentCr: 750, status: 'Delivered', priority: 'Critical', origin: 'MIDHANI Hyderabad (TG)', destination: 'HAL Bengaluru (KA)', shipDate: '2026-07-15', transitDays: 1, zone: 'South', remarks: 'Ti-6Al-4V Grade 5 gas-atomized powder for HAL Tejas LCA wing spar AM &#8594; 90% Ti &#8594; &#8377;750Cr for 6 tonnes &#8594; India &#8377;22,500Cr aero Ti &#8594; HAL 123 Tejas &#8594; 45um PSD &#8594; 900 MPa UTS &#8594; LPBF grade' },
  { id: 'TIP-0002', batchNo: 'TIP-B2402', city: 'Bengaluru', manufacturer: 'DRDO DMRL', powderGrade: 'Ti-6Al-2Sn-4Zr-2Mo Ti-6242', application: 'Jet Engine Compressor (HAL)', titaniumPercent: 88.0, particleSizeUm: 60, investmentCr: 680, status: 'Delivered', priority: 'Critical', origin: 'DRDO DMRL Hyderabad (TG)', destination: 'HAL Koraput (OD)', shipDate: '2026-07-16', transitDays: 2, zone: 'South', remarks: 'Ti-6242 superalloy powder for HAL Su-30MKI AL-31 engine compressor disc &#8594; 88% Ti &#8594; &#8377;680Cr for 5 tonnes &#8594; India &#8377;20,400Cr aero Ti &#8594; HAL 260 Su-30 &#8594; 60um PSD &#8594; 500&#176;C creep &#8594; HIP+forge' },
  { id: 'TIP-0003', batchNo: 'TIP-B2403', city: 'Chennai', manufacturer: 'IGCAR', powderGrade: 'Ti-CP Grade 2 Sponge', application: 'Nuclear Reactor (IGCAR)', titaniumPercent: 99.5, particleSizeUm: 500, investmentCr: 520, status: 'Delivered', priority: 'Critical', origin: 'IGCAR Kalpakkam (TN)', destination: 'IGCAR Prototype PFBR (TN)', shipDate: '2026-07-17', transitDays: 1, zone: 'South', remarks: 'CP Ti Grade 2 Kroll sponge for IGCAR PFBR steam generator tubing support &#8594; 99.5% Ti &#8594; &#8377;520Cr for 8 tonnes &#8594; India &#8377;15,600Cr nuclear Ti &#8594; IGCAR 500 MW &#8594; 500um &#8594; 300&#176;C &#8594; corrosion-free' },
  { id: 'TIP-0004', batchNo: 'TIP-B2404', city: 'Hyderabad', manufacturer: 'Bharat Forge', powderGrade: 'Ti-48Al-2Cr-2Nb G2', application: 'Turbocharger (Bajaj Auto)', titaniumPercent: 67.0, particleSizeUm: 25, investmentCr: 420, status: 'Delivered', priority: 'High', origin: 'Bharat Forge Pune (MH)', destination: 'Bajaj Auto Pune (MH)', shipDate: '2026-07-18', transitDays: 1, zone: 'South', remarks: 'Gamma TiAl intermetallic powder for Bajaj turbocharged engine turbine wheel &#8594; 67% Ti &#8594; &#8377;420Cr for 3 tonnes &#8594; India &#8377;12,600Cr auto Ti &#8594; Bajaj 10M engines &#8594; 25um PSD &#8594; 750&#176;C &#8594; MIM+HIP' },
  { id: 'TIP-0005', batchNo: 'TIP-B2405', city: 'Kolkata', manufacturer: 'SAIL', powderGrade: 'Ti 99.7% Kroll Sponge', application: 'Chemical Process (Tata Chemicals)', titaniumPercent: 99.7, particleSizeUm: 300, investmentCr: 310, status: 'Delivered', priority: 'Medium', origin: 'SAIL Bhilai (CG)', destination: 'Tata Chemicals Babrala (UP)', shipDate: '2026-07-19', transitDays: 2, zone: 'East', remarks: 'High-purity Ti sponge for Tata Chemicals titanium dioxide pigment chlorinator &#8594; 99.7% Ti &#8594; &#8377;310Cr for 15 tonnes &#8594; India &#8377;9,300Cr chem Ti &#8594; Tata 200 KTPA &#8594; 300um &#8594; chloride process &#8594; 99.5% purity' },
  { id: 'TIP-0006', batchNo: 'TIP-B2406', city: 'Pune', manufacturer: 'Tata Advanced Systems', powderGrade: 'Ti-6Al-4V ELI Grade 23', application: 'Defence Radar (BEL)', titaniumPercent: 90.0, particleSizeUm: 35, investmentCr: 580, status: 'Delivered', priority: 'Critical', origin: 'TAS Bengaluru (KA)', destination: 'BEL Bengaluru (KA)', shipDate: '2026-07-20', transitDays: 1, zone: 'West', remarks: 'Ti-6Al-4V ELI powder for BEL AESA radar T/R module housing AM &#8594; 90% Ti &#8594; &#8377;580Cr for 4 tonnes &#8594; India &#8377;17,400Cr defence Ti &#8594; BEL 100+ radars &#8594; 35um PSD &#8594; fracture toughness &#8594; EBM grade' },
  { id: 'TIP-0007', batchNo: 'TIP-B2407', city: 'Ahmedabad', manufacturer: 'Gujarat Titanium', powderGrade: 'Ti-3Al-8V-6Cr-4Zr-4Mo Beta-C', application: 'Marine Desalination (VA Tech Wabag)', titaniumPercent: 78.0, particleSizeUm: 55, investmentCr: 290, status: 'Delivered', priority: 'High', origin: 'Gujarat Titanium Vadodara (GJ)', destination: 'VA Tech Chennai (TN)', shipDate: '2026-07-21', transitDays: 1, zone: 'West', remarks: 'Beta-C Ti alloy powder for VA Tech desalination flash evaporator heat exchanger &#8594; 78% Ti &#8594; &#8377;290Cr for 5 tonnes &#8594; India &#8377;8,700Cr marine Ti &#8594; VA Tech 200 plants &#8594; 55um PSD &#8594; seawater &#8594; stress-corrosion' },
  { id: 'TIP-0008', batchNo: 'TIP-B2408', city: 'Jaipur', manufacturer: 'Rajasthan Titanium', powderGrade: 'Ti-6Al-7Nb TAN', application: 'Ortho Implant (Stryker India)', titaniumPercent: 87.0, particleSizeUm: 40, investmentCr: 460, status: 'Delivered', priority: 'High', origin: 'Rajasthan Titanium Jaipur (RJ)', destination: 'Stryker Gurgaon (HR)', shipDate: '2026-07-22', transitDays: 2, zone: 'North', remarks: 'Ti-6Al-7Nb biomedical alloy powder for Stryker hip implant stem &#8594; 87% Ti &#8594; &#8377;460Cr for 3 tonnes &#8594; India &#8377;13,800Cr medical Ti &#8594; Stryker 100K hips &#8594; 40um PSD &#8594; ASTM F136 &#8594; Nb replaces V' },
  { id: 'TIP-0009', batchNo: 'TIP-B2409', city: 'Coimbatore', manufacturer: 'Tamil Nadu Titanium', powderGrade: 'Ti-10V-2Fe-3Al Ti-10-2-3', application: 'Landing Gear (HAL)', titaniumPercent: 85.0, particleSizeUm: 70, investmentCr: 620, status: 'Delivered', priority: 'Critical', origin: 'Tamil Nadu Titanium Coimbatore (TN)', destination: 'HAL Bengaluru (KA)', shipDate: '2026-07-23', transitDays: 1, zone: 'South', remarks: 'Ti-10-2-3 high-strength beta alloy for HAL Tejas main landing gear forging &#8594; 85% Ti &#8594; &#8377;620Cr for 7 tonnes &#8594; India &#8377;18,600Cr aero Ti &#8594; HAL 123 Tejas &#8594; 70um PSD &#8594; 1100 MPa UTS &#8594; 1200&#176;C forge' },
  { id: 'TIP-0010', batchNo: 'TIP-B2410', city: 'Bhubaneswar', manufacturer: 'Odisha Titanium Mines', powderGrade: 'TiO2 92% Ilmenite Concentrate', application: 'Pigment (Kumar Metachem)', titaniumPercent: 55.0, particleSizeUm: 80, investmentCr: 175, status: 'Delivered', priority: 'Low', origin: 'Odisha Titanium Mines Chhatrapur (OD)', destination: 'Kumar Metachem Mumbai (MH)', shipDate: '2026-07-24', transitDays: 2, zone: 'East', remarks: 'Ilmenite concentrate for Kumar Metachem TiO2 pigment sulfate process &#8594; 55% Ti &#8594; &#8377;175Cr for 50 tonnes &#8594; India &#8377;5,250Cr pigment Ti &#8594; Kumar 100 KTPA &#8594; 80um &#8594; 48% TiO2 min &#8594; beach sand' },
  { id: 'TIP-0011', batchNo: 'TIP-B2411', city: 'Guwahati', manufacturer: 'Assam Titanium', powderGrade: 'Ti-5Al-2.5Sn Grade 6', application: 'Submarine Hull (Mazagon Dock)', titaniumPercent: 92.5, particleSizeUm: 90, investmentCr: 540, status: 'Delivered', priority: 'Critical', origin: 'Assam Titanium Guwahati (AS)', destination: 'Mazagon Dock Mumbai (MH)', shipDate: '2026-07-25', transitDays: 4, zone: 'East', remarks: 'Ti-5Al-2.5Sn ELI powder for MDL Scorpene submarine pressure hull penetration &#8594; 92.5% Ti &#8594; &#8377;540Cr for 6 tonnes &#8594; India &#8377;16,200Cr marine Ti &#8594; MDL 6 submarines &#8594; 90um PSD &#8594; 300m depth &#8594; weldable' },
  { id: 'TIP-0012', batchNo: 'TIP-B2412', city: 'Surat', manufacturer: 'Gujarat Ti Technologies', powderGrade: 'Ti-15Mo-3Nb-3Al-0.2Si TIMETAL 21S', application: 'Space Launch (ISRO)', titaniumPercent: 78.5, particleSizeUm: 30, investmentCr: 690, status: 'Delayed', priority: 'Critical', origin: 'Gujarat Ti Technologies Surat (GJ)', destination: 'ISRO Sriharikota (AP)', shipDate: '2026-07-04', transitDays: 18, zone: 'West', remarks: 'TIMETAL 21S beta alloy powder for ISRO Gaganyaan crew module thrust structure &#8594; 78.5% Ti &#8594; &#8377;690Cr for 4 tonnes &#8594; monsoon delay &#8594; India &#8377;20,700Cr space Ti &#8594; ISRO Gaganyaan &#8594; 30um PSD &#8594; 650&#176;C &#8594; LPBF+HIP' },
  { id: 'TIP-0013', batchNo: 'TIP-B2413', city: 'Noida', manufacturer: 'UP Titanium Alloys', powderGrade: 'Ti-5553 (Ti-5Al-5V-5Mo-3Cr)', application: 'Airframe (Wipro Aero)', titaniumPercent: 82.0, particleSizeUm: 50, investmentCr: 435, status: 'Delivered', priority: 'High', origin: 'UP Titanium Alloys Noida (UP)', destination: 'Wipro Aero Bengaluru (KA)', shipDate: '2026-07-26', transitDays: 2, zone: 'North', remarks: 'Ti-5553 high-strength alloy for Wipro Aero GE F414 engine fan blade structural repair &#8594; 82% Ti &#8594; &#8377;435Cr for 5 tonnes &#8594; India &#8377;13,050Cr aero Ti &#8594; Wipro 200 engines &#8594; 50um PSD &#8594; 1250 MPa &#8594; forged billet' },
  { id: 'TIP-0014', batchNo: 'TIP-B2414', city: 'Bhopal', manufacturer: 'BHEL', powderGrade: 'Ti-3Al-2.5V Grade 9 Tube', application: 'Power Plant Condenser (BHEL)', titaniumPercent: 90.0, particleSizeUm: 100, investmentCr: 380, status: 'Delivered', priority: 'High', origin: 'BHEL Bhopal (MP)', destination: 'BHEL Tiruchy (TN)', shipDate: '2026-07-27', transitDays: 2, zone: 'North', remarks: 'Ti-3Al-2.5V Grade 9 powder for BHEL 800 MW plant seawater condenser tube &#8594; 90% Ti &#8594; &#8377;380Cr for 12 tonnes &#8594; India &#8377;11,400Cr power Ti &#8594; BHEL 150 GW &#8594; 100um &#8594; 0.5mm wall &#8594; seamless tube' }
]

const delayedSet = new Set(titaniumPowderRecords.filter(r => r.status === 'Delayed').map(r => r.id))

export default function TitaniumPowderLogisticsView() {
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
    let data = titaniumPowderRecords
    if (search) data = data.filter(r => Object.values(r).some(v => String(v).toLowerCase().includes(search.toLowerCase())))
    Object.entries(filters).forEach(([k, vals]) => { if (vals.length) data = data.filter(r => vals.includes(String((r as any)[k]))) })
    return data
  }, [search, filters])

  const total = titaniumPowderRecords.length
  const delivered = titaniumPowderRecords.filter(r => r.status === 'Delivered').length
  const totalCr = titaniumPowderRecords.reduce((s: number, r) => s + r.investmentCr, 0)
  const avgTi = +(titaniumPowderRecords.reduce((s: number, r) => s + r.titaniumPercent, 0) / total).toFixed(1)

  const manufacturers = [...new Set(titaniumPowderRecords.map(r => r.manufacturer))]
  const zones = [...new Set(titaniumPowderRecords.map(r => r.zone))]

  return (
    <div className="space-y-6">
      <PageHeader title="Titanium Powder Logistics" description="Indian titanium powder supply chain tracking across aerospace airframe AM, jet engine compressor, nuclear reactor, turbocharger, chemical pigment, defence radar, marine desalination, medical implant, submarine hull, space launch vehicle and power plant condenser sectors" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent><div className="text-2xl font-bold text-slate-600">{total}</div><div className="text-xs text-muted-foreground">Total Shipments</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-slate-600">{delivered}</div><div className="text-xs text-muted-foreground">Delivered</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-slate-600">&#8377;{totalCr.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground">Total Investment</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-slate-600">{avgTi}%</div><div className="text-xs text-muted-foreground">Avg Ti Content</div></CardContent></Card>
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
        <div className="rounded-md border"><div className="max-h-96 overflow-auto"><table className="w-full text-sm"><thead className="sticky top-0 bg-background"><tr><th className="p-2 text-left">ID</th><th className="p-2 text-left">Batch</th><th className="p-2 text-left">Grade</th><th className="p-2 text-left">Application</th><th className="p-2 text-right">Ti%</th><th className="p-2 text-right">&#8377;Cr</th><th className="p-2 text-left">Status</th></tr></thead><tbody>{filtered.map(r => (<tr key={r.id} className={`border-t ${delayedSet.has(r.id) ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}><td className="p-2">{r.id}</td><td className="p-2">{r.batchNo}</td><td className="p-2">{r.powderGrade}</td><td className="p-2">{r.application}</td><td className="p-2 text-right">{r.titaniumPercent}</td><td className="p-2 text-right">{r.investmentCr}</td><td className="p-2"><Badge variant={r.status === 'Delivered' ? 'default' : 'destructive'}>{r.status}</Badge></td></tr>))}</tbody></table></div></div>
      </div>)}

      {activeTab === 1 && (<div className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          {manufacturers.map(m => <Badge key={m} variant={filters.manufacturer?.includes(m) ? 'default' : 'outline'} className="cursor-pointer" onClick={() => toggleFilter('manufacturer', m)}>{m}</Badge>)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">By Manufacturer</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { m[r.manufacturer] = (m[r.manufacturer] || 0) + 1; return m }, {} as Record<string, number>)) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([m, c]) => (<div key={m} className="flex justify-between text-sm"><span>{m}</span><span className="font-medium">{c}</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Particle Size Range</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { const s = r.particleSizeUm <= 35 ? 'Fine (0-35 um)' : r.particleSizeUm <= 70 ? 'Medium (36-70 um)' : r.particleSizeUm <= 200 ? 'Coarse (71-200 um)' : 'Sponge/Bulk (200+ um)'; m[s] = (m[s] || 0) + 1; return m }, {} as Record<string, number>)) as [string, number][]).map(([k, c]) => (<div key={k} className="flex justify-between text-sm"><span>{k}</span><span className="font-medium">{c}</span></div>))}</div></CardContent></Card>
        </div>
        <div className="rounded-md border"><div className="max-h-96 overflow-auto"><table className="w-full text-sm"><thead className="sticky top-0 bg-background"><tr><th className="p-2 text-left">ID</th><th className="p-2 text-left">Manufacturer</th><th className="p-2 text-left">Grade</th><th className="p-2 text-left">Origin</th><th className="p-2 text-left">Destination</th><th className="p-2 text-right">Transit</th><th className="p-2 text-left">Zone</th></tr></thead><tbody>{filtered.map(r => (<tr key={r.id} className={`border-t ${delayedSet.has(r.id) ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}><td className="p-2">{r.id}</td><td className="p-2">{r.manufacturer}</td><td className="p-2">{r.powderGrade}</td><td className="p-2">{r.origin}</td><td className="p-2">{r.destination}</td><td className="p-2 text-right">{r.transitDays}d</td><td className="p-2">{r.zone}</td></tr>))}</tbody></table></div></div>
      </div>)}

      {activeTab === 2 && (<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card><CardHeader><CardTitle className="text-sm">Investment by Application</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { m[r.application] = (m[r.application] || 0) + r.investmentCr; return m }, {} as Record<string, number>)) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 7).map(([a, v]) => (<div key={a} className="flex justify-between text-sm"><span>{a}</span><span className="font-medium">&#8377;{v}Cr</span></div>))}</div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Titanium Content Distribution</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { const n = r.titaniumPercent >= 90 ? 'High Ti (90%+)' : r.titaniumPercent >= 75 ? 'Alloy Ti (75-90%)' : r.titaniumPercent >= 50 ? 'Compound (50-75%)' : 'Ore (<50%)'; m[n] = (m[n] || 0) + 1; return m }, {} as Record<string, number>)) as [string, number][]).map(([k, c]) => (<div key={k} className="flex justify-between text-sm"><span>{k}</span><span className="font-medium">{c}</span></div>))}</div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Top Routes by Value</CardTitle></CardHeader><CardContent><div className="space-y-2">{filtered.sort((a, b) => b.investmentCr - a.investmentCr).slice(0, 7).map(r => (<div key={r.id} className="flex justify-between text-sm"><span>{r.origin.split('(')[0]} &#8594; {r.destination.split('(')[0]}</span><span className="font-medium">&#8377;{r.investmentCr}Cr</span></div>))}</div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Aerospace Grade Powders</CardTitle></CardHeader><CardContent><div className="space-y-2">{filtered.filter(r => r.application.toLowerCase().includes('aero') || r.application.toLowerCase().includes('engine') || r.application.toLowerCase().includes('landing') || r.application.toLowerCase().includes('airframe')).sort((a, b) => b.investmentCr - a.investmentCr).map(r => (<div key={r.id} className="flex justify-between text-sm"><span>{r.powderGrade} ({r.particleSizeUm}um)</span><span className="font-medium">&#8377;{r.investmentCr}Cr</span></div>))}</div></CardContent></Card>
      </div>)}

      {activeTab === 3 && (<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card><CardContent><div className="text-sm font-medium text-slate-600 mb-2">India Titanium Aerospace AM Programme</div><div className="text-xs text-muted-foreground">India consuming 80 TPA titanium alloy powder for aerospace AM, led by HAL Tejas LCA (Ti-6Al-4V), DRDO (Ti-6242), and Wipro Aero (Ti-5553). MIDHANI and DRDO DMRL operating 3 gas atomizers producing 15 TPA, targeting 50 TPA by 2028. Tejas Mk2 programme consuming 20 TPA Ti-6Al-4V for wing spars and fuselage frames via LPBF and EBM. India importing 70% titanium sponge from Ukraine and Japan.</div></CardContent></Card>
        <Card><CardContent><div className="text-sm font-medium text-slate-600 mb-2">Gaganyaan Titanium Supply Chain</div><div className="text-xs text-muted-foreground">ISRO Gaganyaan crewed mission consuming 8 TPA TIMETAL 21S beta titanium alloy for crew module thrust structure, service module brackets and heat shield attachment. Gujarat Ti Technologies developing indigenous Ti-15Mo-3Nb-3Al-0.2Si powder at Surat. India targeting 12 Gaganyaan and satellite launches by 2030. DRDO developing Ti-5553 for reusable launch vehicle structure.</div></CardContent></Card>
        <Card><CardContent><div className="text-sm font-medium text-slate-600 mb-2">Monsoon Disrupts ISRO Launch Supply</div><div className="text-xs text-muted-foreground">TIP-B2412 TIMETAL 21S titanium alloy powder for ISRO Gaganyaan crew module delayed 18 days due to Gujarat monsoon. ISRO Sriharikota launch preparation timeline compressed. India consuming 12 TPA beta-titanium for space. Recommend pre-positioning 2-tonne buffer at Sriharikota warehouse and accelerating air freight for critical batches.</div></CardContent></Card>
        <Card><CardContent><div className="text-sm font-medium text-slate-600 mb-2">Medical Titanium Implant Growth</div><div className="text-xs text-muted-foreground">Indian orthopaedic implant market growing at 22% CAGR, consuming 10 TPA Ti-6Al-7Nb (TAN alloy replacing toxic vanadium). Stryker, Zimmer Biomet and Indian implant makers scaling hip and knee replacement. Tamil Nadu and Rajasthan becoming Ti-MIM hubs. MIDHANI developing indigenous ASTM F136 powder for medical import substitution. India targeting 1 million joint replacements by 2028.</div></CardContent></Card>
      </div>)}
    </div>
  )
}
"""

outpath = '/home/z/my-project/src/components/modules/titanium-powder-logistics-view.tsx'
with open(outpath, 'w') as f:
    f.write(content)
print(f"Generated {outpath}")
