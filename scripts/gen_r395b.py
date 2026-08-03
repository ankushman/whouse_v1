#!/usr/bin/env python3
"""Generate platinum-alloy-logistics-view.tsx"""

content = r"""'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { Diamond } from 'lucide-react'

interface PlatinumRecord {
  id: string
  batchNo: string
  city: string
  manufacturer: string
  alloyGrade: string
  application: string
  platinumPercent: number
  maxTempC: number
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

const platinumRecords: PlatinumRecord[] = [
  { id: 'PTA-0001', batchNo: 'PTA-B2401', city: 'Mumbai', manufacturer: 'Hindustan Platinum', alloyGrade: 'Pt-Ir 90/10 Wire', application: 'Spark Plug Electrode (Mico Bosch)', platinumPercent: 90.0, maxTempC: 850, investmentCr: 420, status: 'Delivered', priority: 'Critical', origin: 'Hindustan Platinum Mumbai (MH)', destination: 'Mico Bosch Bengaluru (KA)', shipDate: '2026-07-15', transitDays: 2, zone: 'West', remarks: 'Pt-Ir 90/10 wire for Mico Bosch 4-plug iridium electrode \u2192 90.0% Pt \u2192 \u20b9420Cr for 50 kg \u2192 India \u20b912,600Cr auto PtIr \u2192 Bosch 15M plugs/yr \u2192 850\u00b0C spark \u2192 100K km life \u2192 0.6mm diameter' },
  { id: 'PTA-0002', batchNo: 'PTA-B2402', city: 'Hyderabad', manufacturer: 'DRDO DMRL', alloyGrade: 'Pt-Rh 70/30 Gauze', application: 'Catalyst Gauze (Nagarjuna Fertiliser)', platinumPercent: 70.0, maxTempC: 950, investmentCr: 680, status: 'Delivered', priority: 'Critical', origin: 'DRDO DMRL Hyderabad (TG)', destination: 'Nagarjuna Kakinada (AP)', shipDate: '2026-07-16', transitDays: 1, zone: 'South', remarks: 'Pt-Rh 70/30 gauze for nitric acid ammonia oxidation \u2192 70.0% Pt \u2192 \u20b9680Cr for 80 kg \u2192 India \u20b920,400Cr chemical Pt \u2192 Nagarjuna 3.5 TPA \u2192 950\u00b0C oxidation \u2192 99.5% conversion \u2192 60 mesh weave' },
  { id: 'PTA-0003', batchNo: 'PTA-B2403', city: 'Bengaluru', manufacturer: 'BEL', alloyGrade: 'Pt-Pd 50/50 Paste', application: 'Thick Film Paste (ISRO)', platinumPercent: 50.0, maxTempC: 1050, investmentCr: 310, status: 'Delivered', priority: 'High', origin: 'BEL Bengaluru (KA)', destination: 'ISRO Ahmedabad (GJ)', shipDate: '2026-07-17', transitDays: 2, zone: 'South', remarks: 'Pt-Pd 50/50 thick film paste for ISRO satellite hybrid circuit \u2192 50.0% Pt \u2192 \u20b9310Cr for 30 kg \u2192 India \u20b99,300Cr space PtPd \u2192 ISRO 72 satellite fleet \u2192 1050\u00b0C firing \u2192 10 m\u03a9/sq \u2192 850 ppm firing' },
  { id: 'PTA-0004', batchNo: 'PTA-B2404', city: 'Delhi', manufacturer: 'ONGC', alloyGrade: 'Pt-Co 95/5 Wire', application: 'Thermocouple (BHEL)', platinumPercent: 95.0, maxTempC: 1600, investmentCr: 195, status: 'Delivered', priority: 'High', origin: 'ONGC Dehradun (UK)', destination: 'BHEL Haridwar (UK)', shipDate: '2026-07-18', transitDays: 1, zone: 'North', remarks: 'Pt-Co 95/5 Type S thermocouple wire for BHEL 800 MW boiler \u2192 95.0% Pt \u2192 \u20b9195Cr for 12 kg \u2192 India \u20b95,850Cr power Pt \u2192 BHEL 150 GW fleet \u2192 1600\u00b0C rated \u2192 \u00b11.5\u00b0C accuracy \u2192 0.5mm diameter' },
  { id: 'PTA-0005', batchNo: 'PTA-B2405', city: 'Pune', manufacturer: 'Bharat Forge', alloyGrade: 'Pt-Ru 95/5 Coating', application: 'Titanium Anode (Linde India)', platinumPercent: 95.0, maxTempC: 200, investmentCr: 245, status: 'Delivered', priority: 'Medium', origin: 'Bharat Forge Pune (MH)', destination: 'Linde Taloja (MH)', shipDate: '2026-07-19', transitDays: 1, zone: 'West', remarks: 'Pt-Ru 95/5 coated Ti anode for Linde chlor-alkali electrolyzer \u2192 95.0% Pt \u2192 \u20b9245Cr for 15 kg \u2192 India \u20b97,350Cr chemical Pt \u2192 Linde 500K tonne Cl \u2192 200\u00b0C service \u2192 8 yr life \u2192 MMO coated' },
  { id: 'PTA-0006', batchNo: 'PTA-B2406', city: 'Mumbai', manufacturer: 'Tata Steel', alloyGrade: 'Pt-Pd-Rh Trimetallic', application: 'Catalytic Converter (Tata Motors)', platinumPercent: 33.3, maxTempC: 900, investmentCr: 520, status: 'Delivered', priority: 'Critical', origin: 'Hindustan Platinum Mumbai (MH)', destination: 'Tata Motors Pune (MH)', shipDate: '2026-07-20', transitDays: 1, zone: 'West', remarks: 'Pt-Pd-Rh trimetallic washcoat for Tata Nexon BS-VI converter \u2192 33.3% Pt \u2192 \u20b9520Cr for 40 kg \u2192 India \u20b915,600Cr auto Pt \u2192 Tata 500K vehicles \u2192 900\u00b0C exhaust \u2192 Euro VI compliant \u2192 5g/ft3 loading' },
  { id: 'PTA-0007', batchNo: 'PTA-B2407', city: 'Chennai', manufacturer: 'IGCAR', alloyGrade: 'Pt Wire 99.99%', application: 'Reference Electrode (NPCIL)', platinumPercent: 99.99, maxTempC: 350, investmentCr: 165, status: 'Delivered', priority: 'High', origin: 'IGCAR Kalpakkam (TN)', destination: 'NPCIL Kudankulam (TN)', shipDate: '2026-07-21', transitDays: 1, zone: 'South', remarks: 'Pure Pt reference electrode wire for NPCIL VVER-1000 coolant monitor \u2192 99.99% Pt \u2192 \u20b9165Cr for 8 kg \u2192 India \u20b94,950Cr nuclear Pt \u2192 NPCIL 7.5 GW \u2192 350\u00b0C PWR coolant \u2192 corrosion resistant \u2192 NRC grade' },
  { id: 'PTA-0008', batchNo: 'PTA-B2408', city: 'Ahmedabad', manufacturer: 'Gujarat Platinum Industries', alloyGrade: 'Pt-Ni 90/10 Strip', application: 'Fuel Cell MEA (Reliance)', platinumPercent: 90.0, maxTempC: 80, investmentCr: 750, status: 'Delivered', priority: 'Critical', origin: 'Gujarat Platinum Ahmedabad (GJ)', destination: 'Reliance Jamnagar (GJ)', shipDate: '2026-07-22', transitDays: 1, zone: 'West', remarks: 'Pt-Ni 90/10 strip for Reliance green H2 PEM fuel cell \u2192 90.0% Pt \u2192 \u20b9750Cr for 60 kg \u2192 India \u20b922,500Cr H2 Pt \u2192 Reliance 10 GW green H2 \u2192 80\u00b0C PEM \u2192 0.125 mg/cm2 loading \u2192 60K hr durability' },
  { id: 'PTA-0009', batchNo: 'PTA-B2409', city: 'Jaipur', manufacturer: 'Rajasthan Platinum Alloys', alloyGrade: 'Pt-Ir 80/20 Coil', application: 'Medical Stent (Sahajanand Medical)', platinumPercent: 80.0, maxTempC: 40, investmentCr: 285, status: 'Delivered', priority: 'High', origin: 'Rajasthan Platinum Jaipur (RJ)', destination: 'Sahajanand Surat (GJ)', shipDate: '2026-07-23', transitDays: 2, zone: 'North', remarks: 'Pt-Ir 80/20 radiopaque coil for Sahajanand coronary stent \u2192 80.0% Pt \u2192 \u20b9285Cr for 20 kg \u2192 India \u20b98,550Cr medical PtIr \u2192 Sahajanand 2M stents/yr \u2192 MRI compatible \u2192 0.002 inch wire \u2192 biocompatible ISO 5832' },
  { id: 'PTA-0010', batchNo: 'PTA-B2410', city: 'Coimbatore', manufacturer: 'Tamil Nadu Platinum Works', alloyGrade: 'Pt-Pd 60/40 Ring', application: 'Glass Seal (BHEL)', platinumPercent: 60.0, maxTempC: 700, investmentCr: 180, status: 'Delivered', priority: 'Medium', origin: 'Tamil Nadu Platinum Coimbatore (TN)', destination: 'BHEL Bhopal (MP)', shipDate: '2026-07-24', transitDays: 2, zone: 'South', remarks: 'Pt-Pd 60/40 seal ring for BHEL gas turbine combustor \u2192 60.0% Pt \u2192 \u20b9180Cr for 25 kg \u2192 India \u20b95,400Cr power PtPd \u2192 BHEL 150 GW \u2192 700\u00b0C sealing \u2192 CTE match \u2192 hermetic weld joint' },
  { id: 'PTA-0011', batchNo: 'PTA-B2411', city: 'Bhubaneswar', manufacturer: 'Odisha Platinum Refinery', alloyGrade: 'Pt-Ru 80/20 Pellet', application: 'Fuel Cell Catalyst (IOCL)', platinumPercent: 80.0, maxTempC: 120, investmentCr: 590, status: 'Delivered', priority: 'Critical', origin: 'Odisha Platinum Bhubaneswar (OD)', destination: 'IOCL Faridabad (HR)', shipDate: '2026-07-25', transitDays: 3, zone: 'East', remarks: 'Pt-Ru 80/20 pellet for IOCL refinery fuel cell reformer \u2192 80.0% Pt \u2192 \u20b9590Cr for 45 kg \u2192 India \u20b917,700Cr refinery Pt \u2192 IOCL 35 refinery \u2192 120\u00b0C reforming \u2192 5% CO tolerance \u2192 0.3 mg Pt/cm2' },
  { id: 'PTA-0012', batchNo: 'PTA-B2412', city: 'Guwahati', manufacturer: 'Assam Platinum Works', alloyGrade: 'Pt-Rh 80/20 Wire', application: 'Glass Fiber Bushing (Recron)', platinumPercent: 80.0, maxTempC: 1400, investmentCr: 350, status: 'Delayed', priority: 'High', origin: 'Assam Platinum Guwahati (AS)', destination: 'Recron Silvassa (DD)', shipDate: '2026-07-11', transitDays: 9, zone: 'East', remarks: 'Pt-Rh 80/20 bushing for Recron E-glass fiber production \u2192 80.0% Pt \u2192 \u20b9350Cr for 35 kg \u2192 India \u20b910,500Cr glass PtRh \u2192 monsoon flood delay \u2192 1400\u00b0C melt \u2192 2000 tip bushing \u2192 5 yr life' },
  { id: 'PTA-0013', batchNo: 'PTA-B2413', city: 'Ahmedabad', manufacturer: 'Gujarat Platinum Technologies', alloyGrade: 'Pt Wire 99.95%', application: 'Lab Electrode (Lupin Pharma)', platinumPercent: 99.95, maxTempC: 250, investmentCr: 95, status: 'Delivered', priority: 'Low', origin: 'Gujarat Platinum Tech Ahmedabad (GJ)', destination: 'Lupin Aurangabad (MH)', shipDate: '2026-07-26', transitDays: 2, zone: 'West', remarks: 'Pure Pt electrode wire for Lupin pharma dissolution tester \u2192 99.95% Pt \u2192 \u20b995Cr for 5 kg \u2192 India \u20b92,850Cr pharma Pt \u2192 Lupin 50K tests/yr \u2192 250\u00b0C autoclave \u2192 USP Type II \u2192 1mm diameter' },
  { id: 'PTA-0014', batchNo: 'PTA-B2414', city: 'Noida', manufacturer: 'UP Platinum Alloys', alloyGrade: 'Pt-Co 97/3 Wire', application: 'Aviation Sensor (HAL)', platinumPercent: 97.0, maxTempC: 1200, investmentCr: 220, status: 'Delivered', priority: 'High', origin: 'UP Platinum Noida (UP)', destination: 'HAL Bengaluru (KA)', shipDate: '2026-07-27', transitDays: 3, zone: 'North', remarks: 'Pt-Co 97/3 RTD wire for HAL Tejas engine temperature sensor \u2192 97.0% Pt \u2192 \u20b9220Cr for 18 kg \u2192 India \u20b96,600Cr aero Pt \u2192 HAL 280 Tejas \u2192 1200\u00b0C EGT \u2192 \u00b10.1\u00b0C \u2192 Class A IEC 60751' }
]

const delayedSet = new Set(platinumRecords.filter(r => r.status === 'Delayed').map(r => r.id))

export default function PlatinumAlloyLogisticsView() {
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
    let data = platinumRecords
    if (search) data = data.filter(r => Object.values(r).some(v => String(v).toLowerCase().includes(search.toLowerCase())))
    Object.entries(filters).forEach(([k, vals]) => { if (vals.length) data = data.filter(r => vals.includes(String((r as any)[k]))) })
    return data
  }, [search, filters])

  const total = platinumRecords.length
  const delivered = platinumRecords.filter(r => r.status === 'Delivered').length
  const totalCr = platinumRecords.reduce((s: number, r) => s + r.investmentCr, 0)
  const avgPt = +(platinumRecords.reduce((s: number, r) => s + r.platinumPercent, 0) / total).toFixed(1)

  const manufacturers = [...new Set(platinumRecords.map(r => r.manufacturer))]
  const zones = [...new Set(platinumRecords.map(r => r.zone))]

  return (
    <div className="space-y-6">
      <PageHeader title="Platinum Alloy Logistics" description="Indian platinum-group metal alloy supply chain tracking across automotive, chemical, aerospace, nuclear and hydrogen energy sectors" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent><div className="text-2xl font-bold text-purple-600">{total}</div><div className="text-xs text-muted-foreground">Total Shipments</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-purple-600">{delivered}</div><div className="text-xs text-muted-foreground">Delivered</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-purple-600">&#8377;{totalCr.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground">Total Investment</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-purple-600">{avgPt}%</div><div className="text-xs text-muted-foreground">Avg Pt Content</div></CardContent></Card>
      </div>

      <div className="flex gap-2 border-b">
        {tabs.map((t, i) => (<button key={t} className={`px-4 py-2 ${activeTab === i ? 'border-b-2 border-purple-600 text-purple-600 font-semibold' : 'text-muted-foreground'}`} onClick={() => setActiveTab(i)}>{t}</button>))}
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
        <div className="rounded-md border"><div className="max-h-96 overflow-auto"><table className="w-full text-sm"><thead className="sticky top-0 bg-background"><tr><th className="p-2 text-left">ID</th><th className="p-2 text-left">Batch</th><th className="p-2 text-left">Grade</th><th className="p-2 text-left">Application</th><th className="p-2 text-right">Pt%</th><th className="p-2 text-right">&#8377;Cr</th><th className="p-2 text-left">Status</th></tr></thead><tbody>{filtered.map(r => (<tr key={r.id} className={`border-t ${delayedSet.has(r.id) ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}><td className="p-2">{r.id}</td><td className="p-2">{r.batchNo}</td><td className="p-2">{r.alloyGrade}</td><td className="p-2">{r.application}</td><td className="p-2 text-right">{r.platinumPercent}</td><td className="p-2 text-right">{r.investmentCr}</td><td className="p-2"><Badge variant={r.status === 'Delivered' ? 'default' : 'destructive'}>{r.status}</Badge></td></tr>))}</tbody></table></div></div>
      </div>)}

      {activeTab === 1 && (<div className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          {manufacturers.map(m => <Badge key={m} variant={filters.manufacturer?.includes(m) ? 'default' : 'outline'} className="cursor-pointer" onClick={() => toggleFilter('manufacturer', m)}>{m}</Badge>)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">By Manufacturer</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { m[r.manufacturer] = (m[r.manufacturer] || 0) + 1; return m }, {} as Record<string, number>)) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([m, c]) => (<div key={m} className="flex justify-between text-sm"><span>{m}</span><span className="font-medium">{c}</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Temperature Range</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { const t = r.maxTempC; const k = t < 200 ? 'Low (<200\u00b0C)' : t < 800 ? 'Medium (200-800\u00b0C)' : t < 1200 ? 'High (800-1200\u00b0C)' : 'Ultra-High (>1200\u00b0C)'; m[k] = (m[k] || 0) + 1; return m }, {} as Record<string, number>)) as [string, number][]).map(([k, c]) => (<div key={k} className="flex justify-between text-sm"><span>{k}</span><span className="font-medium">{c}</span></div>))}</div></CardContent></Card>
        </div>
        <div className="rounded-md border"><div className="max-h-96 overflow-auto"><table className="w-full text-sm"><thead className="sticky top-0 bg-background"><tr><th className="p-2 text-left">ID</th><th className="p-2 text-left">Manufacturer</th><th className="p-2 text-left">Grade</th><th className="p-2 text-left">Origin</th><th className="p-2 text-left">Destination</th><th className="p-2 text-right">Transit</th><th className="p-2 text-left">Zone</th></tr></thead><tbody>{filtered.map(r => (<tr key={r.id} className={`border-t ${delayedSet.has(r.id) ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}><td className="p-2">{r.id}</td><td className="p-2">{r.manufacturer}</td><td className="p-2">{r.alloyGrade}</td><td className="p-2">{r.origin}</td><td className="p-2">{r.destination}</td><td className="p-2 text-right">{r.transitDays}d</td><td className="p-2">{r.zone}</td></tr>))}</tbody></table></div></div>
      </div>)}

      {activeTab === 2 && (<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card><CardHeader><CardTitle className="text-sm">Investment by Application</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { m[r.application] = (m[r.application] || 0) + r.investmentCr; return m }, {} as Record<string, number>)) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 7).map(([a, v]) => (<div key={a} className="flex justify-between text-sm"><span>{a}</span><span className="font-medium">&#8377;{v}Cr</span></div>))}</div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Pt Content Distribution</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { const p = r.platinumPercent < 50 ? 'Low (<50%)' : r.platinumPercent < 80 ? 'Medium (50-80%)' : r.platinumPercent < 95 ? 'High (80-95%)' : 'Pure Pt (>95%)'; m[p] = (m[p] || 0) + 1; return m }, {} as Record<string, number>)) as [string, number][]).map(([k, c]) => (<div key={k} className="flex justify-between text-sm"><span>{k}</span><span className="font-medium">{c}</span></div>))}</div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Top Routes by Value</CardTitle></CardHeader><CardContent><div className="space-y-2">{filtered.sort((a, b) => b.investmentCr - a.investmentCr).slice(0, 7).map(r => (<div key={r.id} className="flex justify-between text-sm"><span>{r.origin.split('(')[0]} &#8594; {r.destination.split('(')[0]}</span><span className="font-medium">&#8377;{r.investmentCr}Cr</span></div>))}</div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">High-Purity Pt Shipments</CardTitle></CardHeader><CardContent><div className="space-y-2">{filtered.filter(r => r.platinumPercent > 95).sort((a, b) => b.investmentCr - a.investmentCr).map(r => (<div key={r.id} className="flex justify-between text-sm"><span>{r.alloyGrade} ({r.platinumPercent}%)</span><span className="font-medium">&#8377;{r.investmentCr}Cr</span></div>))}</div></CardContent></Card>
      </div>)}

      {activeTab === 3 && (<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card><CardContent><div className="text-sm font-medium text-purple-600 mb-2">Green Hydrogen Pt Demand Surge</div><div className="text-xs text-muted-foreground">India's 10 GW green hydrogen target driving 35% CAGR in Pt-Ru PEM catalyst demand. Reliance Jamnagar and Adani Mundra consuming 200 kg Pt/year combined for electrolyzer stacks. Pt loading reduced from 0.5 to 0.125 mg/cm2, yet total demand tripled due to scale-up.</div></CardContent></Card>
        <Card><CardContent><div className="text-sm font-medium text-purple-600 mb-2">Auto Catalytic Converter Shift</div><div className="text-xs text-muted-foreground">BS-VI regulations pushed Pt-Pd-Rh trimetallic converter penetration to 98% across Indian OEMs. Tata Motors and Maruti consuming 120 kg PGM/year. PGM recycling from spent converters now at 35% recovery rate via Hindustan Platinum Mumbai facility.</div></CardContent></Card>
        <Card><CardContent><div className="text-sm font-medium text-purple-600 mb-2">Monsoon Delays PtRh Bushing</div><div className="text-xs text-muted-foreground">PTA-B2412 Pt-Rh 80/20 glass fiber bushing delayed 9 days due to Assam monsoon flooding. This &#8377;350Cr shipment critical for Recron E-glass production. Recommend pre-stocking at Guwahati warehouse before July monsoon season.</div></CardContent></Card>
        <Card><CardContent><div className="text-sm font-medium text-purple-600 mb-2">Medical Pt-Ir Growth</div><div className="text-xs text-muted-foreground">Indian medical device Pt-Ir market growing at 18% CAGR, driven by Sahajanand stents and poly medic stent coatings. Export to 40+ countries. FDA 510(k) approval for 3 new Pt-Ir coil designs in 2026, expanding intervention radiology applications.</div></CardContent></Card>
      </div>)}
    </div>
  )
}
"""

with open('/home/z/my-project/src/components/modules/platinum-alloy-logistics-view.tsx', 'w') as f:
    f.write(content)
print('platinum OK')
