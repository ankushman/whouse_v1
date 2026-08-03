#!/usr/bin/env python3
"""Generate chromium-powder-logistics-view.tsx (R402a)"""
import os

content = r"""'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { Nut } from 'lucide-react'

interface ChromiumPowderRecord {
  id: string
  batchNo: string
  city: string
  manufacturer: string
  powderGrade: string
  application: string
  chromiumPercent: number
  meshSize: number
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

const chromiumPowderRecords: ChromiumPowderRecord[] = [
  { id: 'CRP-0001', batchNo: 'CRP-B2401', city: 'Mumbai', manufacturer: 'Ferro Alloys Corp', powderGrade: 'Cr Metal 99.5% Electrolytic', application: 'Stainless Steel (Jindal Stainless)', chromiumPercent: 99.5, meshSize: 40, investmentCr: 540, status: 'Delivered', priority: 'Critical', origin: 'Ferro Alloys Corp Nagpur (MH)', destination: 'Jindal Stainless Hisar (HR)', shipDate: '2026-07-15', transitDays: 2, zone: 'West', remarks: 'Electrolytic Cr metal flakes for Jindal 304/316 stainless steel melting &#8594; 99.5% Cr &#8594; &#8377;540Cr for 20 tonnes &#8594; India &#8377;16,200Cr SS Cr &#8594; Jindal 2 MTPA &#8594; 40 mesh &#8594; 1908&#176;C melt &#8594; 18/8 Cr-Ni' },
  { id: 'CRP-0002', batchNo: 'CRP-B2402', city: 'Bhilai', manufacturer: 'SAIL', powderGrade: 'Fe-Cr 70% Charge Chrome', application: 'Rail Steel (SAIL Bhilai)', chromiumPercent: 70.0, meshSize: 10, investmentCr: 380, status: 'Delivered', priority: 'High', origin: 'SAIL Bhilai (CG)', destination: 'SAIL Rourkela (OD)', shipDate: '2026-07-16', transitDays: 2, zone: 'East', remarks: 'High-C Fe-Cr 70% charge chrome for SAIL R350 rail steel head hardening &#8594; 70% Cr &#8594; &#8377;380Cr for 35 tonnes &#8594; India &#8377;11,400Cr rail Cr &#8594; SAIL 20 MTPA rail &#8594; 10 mesh lump &#8594; 6% C &#8594; SiMn killed' },
  { id: 'CRP-0003', batchNo: 'CRP-B2403', city: 'Hyderabad', manufacturer: 'MIDHANI', powderGrade: 'Cr-5Fe-1Mo CF8M PM', application: 'Nuclear Valve (IGCAR)', chromiumPercent: 19.0, meshSize: 55, investmentCr: 610, status: 'Delivered', priority: 'Critical', origin: 'MIDHANI Hyderabad (TG)', destination: 'IGCAR Kalpakkam (TN)', shipDate: '2026-07-17', transitDays: 1, zone: 'South', remarks: 'CF8M (19Cr-9Ni-Mo) stainless powder for IGCAR PFBR primary coolant valve &#8594; 19% Cr &#8594; &#8377;610Cr for 5 tonnes &#8594; India &#8377;18,300Cr nuclear Cr &#8594; IGCAR 500 MW &#8594; 55 mesh &#8594; 350&#176;C &#8594; HIP+MIM' },
  { id: 'CRP-0004', batchNo: 'CRP-B2404', city: 'Bengaluru', manufacturer: 'DRDO DMRL', powderGrade: 'Cr-50Ni Inconel 718', application: 'Aero Engine (HAL)', chromiumPercent: 18.5, meshSize: 45, investmentCr: 720, status: 'Delivered', priority: 'Critical', origin: 'DRDO DMRL Hyderabad (TG)', destination: 'HAL Bengaluru (KA)', shipDate: '2026-07-18', transitDays: 1, zone: 'South', remarks: 'Inconel 718 (19Cr-52Ni-3Mo) superalloy powder for HAL Tejas LCA GE F404 engine disc &#8594; 18.5% Cr &#8594; &#8377;720Cr for 8 tonnes &#8594; India &#8377;21,600Cr aero Cr &#8594; HAL 123 Tejas &#8594; 45 mesh &#8594; 700&#176;C &#8594; HIP+forge' },
  { id: 'CRP-0005', batchNo: 'CRP-B2405', city: 'Kolkata', manufacturer: 'Shyam Metaliks', powderGrade: 'Fe-Cr 55% LC Ferro', application: 'Auto Exhaust (Eicher)', chromiumPercent: 55.0, meshSize: 15, investmentCr: 290, status: 'Delivered', priority: 'High', origin: 'Shyam Metaliks Kolkata (WB)', destination: 'Eicher Chennai (TN)', shipDate: '2026-07-19', transitDays: 2, zone: 'East', remarks: 'Low-C Fe-Cr 55% ferro for Eicher BS-VI exhaust manifold Cr-coated steel &#8594; 55% Cr &#8594; &#8377;290Cr for 25 tonnes &#8594; India &#8377;8,700Cr auto Cr &#8594; Eicher 200K trucks &#8594; 15 mesh &#8594; 0.05% C &#8594; aluminized coat' },
  { id: 'CRP-0006', batchNo: 'CRP-B2406', city: 'Pune', manufacturer: 'Bharat Forge', powderGrade: 'Cr-12% Hot Work H13', application: 'Die Casting (Endurance)', chromiumPercent: 5.0, meshSize: 80, investmentCr: 420, status: 'Delivered', priority: 'High', origin: 'Bharat Forge Pune (MH)', destination: 'Endurance Pune (MH)', shipDate: '2026-07-20', transitDays: 1, zone: 'West', remarks: 'H13 (5Cr-1Mo-V) hot work tool steel powder for Endurance aluminium die casting insert &#8594; 5% Cr &#8594; &#8377;420Cr for 6 tonnes &#8594; India &#8377;12,600Cr tool Cr &#8594; Endurance 500 die inserts &#8594; 80 mesh &#8594; 620&#176;C &#8594; PM+HIP' },
  { id: 'CRP-0007', batchNo: 'CRP-B2407', city: 'Ahmedabad', manufacturer: 'Gujarat Chromium', powderGrade: 'Cr2O3 99% Green', application: 'Refractory (Dalmia Cement)', chromiumPercent: 68.4, meshSize: 200, investmentCr: 165, status: 'Delivered', priority: 'Medium', origin: 'Gujarat Chromium Vadodara (GJ)', destination: 'Dalmia Rajgangpur (OD)', shipDate: '2026-07-21', transitDays: 1, zone: 'West', remarks: 'Cr2O3 green pigment powder for Dalmia cement rotary kiln refractory lining &#8594; 68.4% Cr &#8594; &#8377;165Cr for 30 tonnes &#8594; India &#8377;4,950Cr refractory Cr &#8594; Dalmia 40 MTPA &#8594; 200 mesh &#8594; 1900&#176;C &#8594; Mg-Cr brick' },
  { id: 'CRP-0008', batchNo: 'CRP-B2408', city: 'Jaipur', manufacturer: 'Rajasthan Chromium', powderGrade: 'Cr 99.99% Sputter Target', application: 'Solar Cell (Tata Power Solar)', chromiumPercent: 99.99, meshSize: 325, investmentCr: 480, status: 'Delivered', priority: 'High', origin: 'Rajasthan Chromium Jaipur (RJ)', destination: 'Tata Power Nellore (AP)', shipDate: '2026-07-22', transitDays: 2, zone: 'North', remarks: 'Ultra-pure Cr sputtering target powder for Tata Power Solar thin-film PV back contact &#8594; 99.99% Cr &#8594; &#8377;480Cr for 1.5 tonnes &#8594; India &#8377;14,400Cr solar Cr &#8594; Tata 10 GW &#8594; 325 mesh &#8594; 5N purity &#8594; magnetron sputter' },
  { id: 'CRP-0009', batchNo: 'CRP-B2409', city: 'Coimbatore', manufacturer: 'Tamil Nadu Chromium', powderGrade: 'Cr-C 50% Metal Injection', application: 'Medical Implant (Stryker)', chromiumPercent: 50.0, meshSize: 100, investmentCr: 530, status: 'Delivered', priority: 'Critical', origin: 'Tamil Nadu Chromium Coimbatore (TN)', destination: 'Stryker Gurgaon (HR)', shipDate: '2026-07-23', transitDays: 2, zone: 'South', remarks: 'Co-Cr-Mo F75 biomedical alloy powder for Stryker knee implant MIM &#8594; 50% Cr &#8594; &#8377;530Cr for 4 tonnes &#8594; India &#8377;15,900Cr medical Cr &#8594; Stryker 100K knees/yr &#8594; 100 mesh &#8594; ASTM F75 &#8594; biocompatible' },
  { id: 'CRP-0010', batchNo: 'CRP-B2410', city: 'Bhubaneswar', manufacturer: 'Odisha Ferro Alloys', powderGrade: 'Fe-Cr-Si 60/30/10', application: 'Foundry (Kirloskar)', chromiumPercent: 60.0, meshSize: 20, investmentCr: 245, status: 'Delivered', priority: 'Medium', origin: 'Odisha Ferro Alloys Jajpur (OD)', destination: 'Kirloskar Pune (MH)', shipDate: '2026-07-24', transitDays: 2, zone: 'East', remarks: 'Fe-Cr-Si 60/30/10 complex ferroalloy for Kirloskar pump casting Cr-corrosion resistance &#8594; 60% Cr &#8594; &#8377;245Cr for 20 tonnes &#8594; India &#8377;7,350Cr foundry Cr &#8594; Kirloskar 200K pumps &#8594; 20 mesh &#8594; 0.1% S &#8594; induction melt' },
  { id: 'CRP-0011', batchNo: 'CRP-B2411', city: 'Guwahati', manufacturer: 'Assam Chrome', powderGrade: 'Cr-25Ni-20Si 310S', application: 'Petrochem Furnace (IOCL)', chromiumPercent: 25.0, meshSize: 50, investmentCr: 390, status: 'Delivered', priority: 'High', origin: 'Assam Chrome Guwahati (AS)', destination: 'IOCL Guwahati (AS)', shipDate: '2026-07-25', transitDays: 1, zone: 'East', remarks: '310S (25Cr-20Ni-Si) heat-resistant steel powder for IOCL refinery cracker furnace tube &#8594; 25% Cr &#8594; &#8377;390Cr for 8 tonnes &#8594; India &#8377;11,700Cr petro Cr &#8594; IOCL 15 MMTPA &#8594; 50 mesh &#8594; 1050&#176;C &#8594; centrifugal cast' },
  { id: 'CRP-0012', batchNo: 'CRP-B2412', city: 'Surat', manufacturer: 'Gujarat Chrome Tech', powderGrade: 'Cr3C2 95% Thermal Spray', application: 'Turbine Coating (BHEL)', chromiumPercent: 86.7, meshSize: 45, investmentCr: 310, status: 'Delayed', priority: 'High', origin: 'Gujarat Chrome Tech Surat (GJ)', destination: 'BHEL Hyderabad (TG)', shipDate: '2026-07-06', transitDays: 16, zone: 'West', remarks: 'Cr3C2-20NiCr thermal spray powder for BHEL gas turbine blade HVOF coating &#8594; 86.7% Cr &#8594; &#8377;310Cr for 6 tonnes &#8594; monsoon delay &#8594; India &#8377;9,300Cr power Cr &#8594; BHEL 150 GW &#8594; 45 mesh &#8594; 900&#176;C &#8594; HVOF grade' },
  { id: 'CRP-0013', batchNo: 'CRP-B2413', city: 'Noida', manufacturer: 'UP Chromium Alloys', powderGrade: 'Cr-22Ni-7Mo 254 SMO', application: 'Desalination (VA Tech Wabag)', chromiumPercent: 22.0, meshSize: 70, investmentCr: 345, status: 'Delivered', priority: 'High', origin: 'UP Chromium Alloys Noida (UP)', destination: 'VA Tech Chennai (TN)', shipDate: '2026-07-26', transitDays: 2, zone: 'North', remarks: '254 SMO (22Cr-20Ni-7Mo) super-austenitic powder for VA Tech desalination plant reverse osmosis piping &#8594; 22% Cr &#8594; &#8377;345Cr for 5 tonnes &#8594; India &#8377;10,350Cr water Cr &#8594; VA Tech 200 plants &#8594; 70 mesh &#8594; pitting 45 &#8594; 6Mo grade' },
  { id: 'CRP-0014', batchNo: 'CRP-B2414', city: 'Bhopal', manufacturer: 'BHEL', powderGrade: 'Cr-13% Turbine Blade', application: 'Steam Turbine (BHEL)', chromiumPercent: 13.0, meshSize: 60, investmentCr: 570, status: 'Delivered', priority: 'Critical', origin: 'BHEL Bhopal (MP)', destination: 'BHEL Haridwar (UK)', shipDate: '2026-07-27', transitDays: 2, zone: 'North', remarks: '13Cr stainless steel powder for BHEL 800 MW steam turbine LP blade forging &#8594; 13% Cr &#8594; &#8377;570Cr for 10 tonnes &#858594; India &#8377;17,100Cr power Cr &#8594; BHEL 150 GW &#8594; 60 mesh &#8594; 600&#176;C &#8594; AISI 410' }
]

const delayedSet = new Set(chromiumPowderRecords.filter(r => r.status === 'Delayed').map(r => r.id))

export default function ChromiumPowderLogisticsView() {
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
    let data = chromiumPowderRecords
    if (search) data = data.filter(r => Object.values(r).some(v => String(v).toLowerCase().includes(search.toLowerCase())))
    Object.entries(filters).forEach(([k, vals]) => { if (vals.length) data = data.filter(r => vals.includes(String((r as any)[k]))) })
    return data
  }, [search, filters])

  const total = chromiumPowderRecords.length
  const delivered = chromiumPowderRecords.filter(r => r.status === 'Delivered').length
  const totalCr = chromiumPowderRecords.reduce((s: number, r) => s + r.investmentCr, 0)
  const avgCr = +(chromiumPowderRecords.reduce((s: number, r) => s + r.chromiumPercent, 0) / total).toFixed(1)

  const manufacturers = [...new Set(chromiumPowderRecords.map(r => r.manufacturer))]
  const zones = [...new Set(chromiumPowderRecords.map(r => r.zone))]

  return (
    <div className="space-y-6">
      <PageHeader title="Chromium Powder Logistics" description="Indian chromium powder supply chain tracking across stainless steel melting, nuclear valve, aerospace superalloy, auto exhaust coating, die casting tool steel, solar sputtering target, medical implant MIM, petrochemical furnace and desalination plant sectors" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent><div className="text-2xl font-bold text-indigo-600">{total}</div><div className="text-xs text-muted-foreground">Total Shipments</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-indigo-600">{delivered}</div><div className="text-xs text-muted-foreground">Delivered</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-indigo-600">&#8377;{totalCr.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground">Total Investment</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-indigo-600">{avgCr}%</div><div className="text-xs text-muted-foreground">Avg Cr Content</div></CardContent></Card>
      </div>

      <div className="flex gap-2 border-b">
        {tabs.map((t, i) => (<button key={t} className={`px-4 py-2 ${activeTab === i ? 'border-b-2 border-indigo-600 text-indigo-600 font-semibold' : 'text-muted-foreground'}`} onClick={() => setActiveTab(i)}>{t}</button>))}
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
        <div className="rounded-md border"><div className="max-h-96 overflow-auto"><table className="w-full text-sm"><thead className="sticky top-0 bg-background"><tr><th className="p-2 text-left">ID</th><th className="p-2 text-left">Batch</th><th className="p-2 text-left">Grade</th><th className="p-2 text-left">Application</th><th className="p-2 text-right">Cr%</th><th className="p-2 text-right">&#8377;Cr</th><th className="p-2 text-left">Status</th></tr></thead><tbody>{filtered.map(r => (<tr key={r.id} className={`border-t ${delayedSet.has(r.id) ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}><td className="p-2">{r.id}</td><td className="p-2">{r.batchNo}</td><td className="p-2">{r.powderGrade}</td><td className="p-2">{r.application}</td><td className="p-2 text-right">{r.chromiumPercent}</td><td className="p-2 text-right">{r.investmentCr}</td><td className="p-2"><Badge variant={r.status === 'Delivered' ? 'default' : 'destructive'}>{r.status}</Badge></td></tr>))}</tbody></table></div></div>
      </div>)}

      {activeTab === 1 && (<div className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          {manufacturers.map(m => <Badge key={m} variant={filters.manufacturer?.includes(m) ? 'default' : 'outline'} className="cursor-pointer" onClick={() => toggleFilter('manufacturer', m)}>{m}</Badge>)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">By Manufacturer</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { m[r.manufacturer] = (m[r.manufacturer] || 0) + 1; return m }, {} as Record<string, number>)) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([m, c]) => (<div key={m} className="flex justify-between text-sm"><span>{m}</span><span className="font-medium">{c}</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Mesh Size Range</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { const s = r.meshSize <= 20 ? 'Lump (0-20 mesh)' : r.meshSize <= 60 ? 'Coarse (21-60 mesh)' : r.meshSize <= 150 ? 'Medium (61-150 mesh)' : 'Fine (151+ mesh)'; m[s] = (m[s] || 0) + 1; return m }, {} as Record<string, number>)) as [string, number][]).map(([k, c]) => (<div key={k} className="flex justify-between text-sm"><span>{k}</span><span className="font-medium">{c}</span></div>))}</div></CardContent></Card>
        </div>
        <div className="rounded-md border"><div className="max-h-96 overflow-auto"><table className="w-full text-sm"><thead className="sticky top-0 bg-background"><tr><th className="p-2 text-left">ID</th><th className="p-2 text-left">Manufacturer</th><th className="p-2 text-left">Grade</th><th className="p-2 text-left">Origin</th><th className="p-2 text-left">Destination</th><th className="p-2 text-right">Transit</th><th className="p-2 text-left">Zone</th></tr></thead><tbody>{filtered.map(r => (<tr key={r.id} className={`border-t ${delayedSet.has(r.id) ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}><td className="p-2">{r.id}</td><td className="p-2">{r.manufacturer}</td><td className="p-2">{r.powderGrade}</td><td className="p-2">{r.origin}</td><td className="p-2">{r.destination}</td><td className="p-2 text-right">{r.transitDays}d</td><td className="p-2">{r.zone}</td></tr>))}</tbody></table></div></div>
      </div>)}

      {activeTab === 2 && (<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card><CardHeader><CardTitle className="text-sm">Investment by Application</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { m[r.application] = (m[r.application] || 0) + r.investmentCr; return m }, {} as Record<string, number>)) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 7).map(([a, v]) => (<div key={a} className="flex justify-between text-sm"><span>{a}</span><span className="font-medium">&#8377;{v}Cr</span></div>))}</div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Chromium Content Distribution</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { const n = r.chromiumPercent >= 80 ? 'High Alloy (80%+)' : r.chromiumPercent >= 40 ? 'Medium Alloy (40-80%)' : r.chromiumPercent >= 15 ? 'Low Alloy (15-40%)' : 'Trace (0-15%)'; m[n] = (m[n] || 0) + 1; return m }, {} as Record<string, number>)) as [string, number][]).map(([k, c]) => (<div key={k} className="flex justify-between text-sm"><span>{k}</span><span className="font-medium">{c}</span></div>))}</div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Top Routes by Value</CardTitle></CardHeader><CardContent><div className="space-y-2">{filtered.sort((a, b) => b.investmentCr - a.investmentCr).slice(0, 7).map(r => (<div key={r.id} className="flex justify-between text-sm"><span>{r.origin.split('(')[0]} &#8594; {r.destination.split('(')[0]}</span><span className="font-medium">&#8377;{r.investmentCr}Cr</span></div>))}</div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Aerospace and Nuclear Grade</CardTitle></CardHeader><CardContent><div className="space-y-2">{filtered.filter(r => r.application.toLowerCase().includes('aero') || r.application.toLowerCase().includes('nuclear') || r.application.toLowerCase().includes('turbine') || r.application.toLowerCase().includes('engine')).sort((a, b) => b.investmentCr - a.investmentCr).map(r => (<div key={r.id} className="flex justify-between text-sm"><span>{r.powderGrade} ({r.meshSize} mesh)</span><span className="font-medium">&#8377;{r.investmentCr}Cr</span></div>))}</div></CardContent></Card>
      </div>)}

      {activeTab === 3 && (<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card><CardContent><div className="text-sm font-medium text-indigo-600 mb-2">India Stainless Steel Chromium Demand</div><div className="text-xs text-muted-foreground">India is world 2nd largest stainless steel producer at 12 MTPA, consuming 3.5 MTPA ferrochrome (70% Cr). Jindal Stainless, SAIL and Tata Stainless drive 85% domestic demand. India importing 60% ferrochrome from South Africa, Turkey and China. Government 30% import duty on charge chrome pushing MIDHANI and FAC to expand domestic Cr metal production to 50 KTPA by 2028.</div></CardContent></Card>
        <Card><CardContent><div className="text-sm font-medium text-indigo-600 mb-2">Superalloy and Nuclear Chromium</div><div className="text-xs text-muted-foreground">DRDO DMRL and MIDHANI producing Inconel 718 (19Cr) and 254 SMO (22Cr) superalloy powders for HAL Tejas LCA and IGCAR PFBR programme. India consuming 200 TPA Cr-based superalloy powder for 123 Tejas fleet and 20 planned fast reactors. BHEL 800 MW steam turbine programme consuming 15 TPA 13Cr stainless for LP blades.</div></CardContent></Card>
        <Card><CardContent><div className="text-sm font-medium text-indigo-600 mb-2">Monsoon Delays Turbine Coating</div><div className="text-xs text-muted-foreground">CRP-B2412 Cr3C2-20NiCr HVOF thermal spray powder for BHEL gas turbine blade coating delayed 16 days due to Gujarat monsoon. BHEL Hyderabad turbine MRO at risk. India consuming 25 TPA chromium carbide for gas turbine and coal mill wear protection. Recommend pre-positioning 4-tonne buffer at Hyderabad warehouse before monsoon season.</div></CardContent></Card>
        <Card><CardContent><div className="text-sm font-medium text-indigo-600 mb-2">Medical Implant MIM Growth</div><div className="text-xs text-muted-foreground">Co-Cr-Mo F75 (28Cr) MIM powder demand surging as Stryker, Zimmer Biomet and Indian implant makers scale knee and hip replacement production. India consuming 10 TPA biomedical Co-Cr-Mo alloy powder. Maharashtra and Tamil Nadu becoming MIM hubs with 15 new facilities by 2027. MIDHANI developing indigenous ASTM F75 powder atomizer for medical import substitution.</div></CardContent></Card>
      </div>)}
    </div>
  )
}
"""

outpath = '/home/z/my-project/src/components/modules/chromium-powder-logistics-view.tsx'
with open(outpath, 'w') as f:
    f.write(content)
print(f"Generated {outpath}")
