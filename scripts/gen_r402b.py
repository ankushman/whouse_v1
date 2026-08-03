#!/usr/bin/env python3
"""Generate tin-alloy-logistics-view.tsx (R402b)"""
import os

content = r"""'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { Anchor } from 'lucide-react'

interface TinAlloyRecord {
  id: string
  batchNo: string
  city: string
  manufacturer: string
  alloyGrade: string
  application: string
  tinPercent: number
  meltingPointC: number
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

const tinAlloyRecords: TinAlloyRecord[] = [
  { id: 'TNA-0001', batchNo: 'TNA-B2401', city: 'Mumbai', manufacturer: 'Hindustan Tin', alloyGrade: 'Sn-99.99% Pure Ingot', application: 'Solder Paste (KEC)', tinPercent: 99.99, meltingPointC: 232, investmentCr: 380, status: 'Delivered', priority: 'Critical', origin: 'Hindustan Tin Mumbai (MH)', destination: 'KEC Bengaluru (KA)', shipDate: '2026-07-15', transitDays: 2, zone: 'West', remarks: 'Pure Sn 99.99% ingot for KEC electronics solder paste SAC305 &#8594; 99.99% Sn &#8594; &#8377;380Cr for 15 tonnes &#8594; India &#8377;11,400Cr electronics Sn &#8594; KEC 500M PCBs/yr &#8594; 232&#176;C &#8594; J-STD-004 &#8594; 4N purity' },
  { id: 'TNA-0002', batchNo: 'TNA-B2402', city: 'Chennai', manufacturer: 'Tamil Nadu Tin', alloyGrade: 'Sn-3.5Ag-0.7Cu SAC305', application: 'EV Inverter (Ather Energy)', tinPercent: 95.8, meltingPointC: 217, investmentCr: 420, status: 'Delivered', priority: 'Critical', origin: 'Tamil Nadu Tin Chennai (TN)', destination: 'Ather Bengaluru (KA)', shipDate: '2026-07-16', transitDays: 1, zone: 'South', remarks: 'SAC305 lead-free solder alloy for Ather EV SiC inverter power module &#8594; 95.8% Sn &#8594; &#8377;420Cr for 8 tonnes &#8594; India &#8377;12,600Cr EV Sn &#8594; Ather 200K scooters &#8594; 217&#176;C &#8594; RoHS compliant &#8594; 22 mN strength' },
  { id: 'TNA-0003', batchNo: 'TNA-B2403', city: 'Bengaluru', manufacturer: 'Nordon Metals', alloyGrade: 'Sn-37Pb Eutectic', application: 'Defence Electronics (BEL)', tinPercent: 63.0, meltingPointC: 183, investmentCr: 290, status: 'Delivered', priority: 'High', origin: 'Nordon Metals Bengaluru (KA)', destination: 'BEL Ghaziabad (UP)', shipDate: '2026-07-17', transitDays: 2, zone: 'South', remarks: 'Sn-37Pb eutectic solder bar for BEL military radar PCB hand soldering &#8594; 63% Sn &#8594; &#8377;290Cr for 12 tonnes &#8594; India &#8377;8,700Cr defence Sn &#8594; BEL 100+ radars &#8594; 183&#176;C &#8594; MIL-STD-2020 &#8594; exempt RoHS' },
  { id: 'TNA-0004', batchNo: 'TNA-B2404', city: 'Kolkata', manufacturer: 'Shyam Tin Works', alloyGrade: 'Sn-40Pb 60/40 Solder', application: 'Consumer Electronics (Dixon)', tinPercent: 40.0, meltingPointC: 183, investmentCr: 175, status: 'Delivered', priority: 'Medium', origin: 'Shyam Tin Works Kolkata (WB)', destination: 'Dixon Noida (UP)', shipDate: '2026-07-18', transitDays: 2, zone: 'East', remarks: 'Sn-40Pb 60/40 solder bar for Dixon LED TV PCB wave soldering &#8594; 40% Sn &#8594; &#8377;175Cr for 25 tonnes &#8594; India &#8377;5,250Cr consumer Sn &#8594; Dixon 20M TVs &#8594; 183&#176;C &#8594; IPC J-STD-004 &#8594; wave grade' },
  { id: 'TNA-0005', batchNo: 'TNA-B2405', city: 'Pune', manufacturer: 'Indian Tin Corp', alloyGrade: 'Sn-5Sb Antimonial', application: 'Marine Coating (Cochin Shipyard)', tinPercent: 95.0, meltingPointC: 240, investmentCr: 310, status: 'Delivered', priority: 'High', origin: 'Indian Tin Corp Pune (MH)', destination: 'Cochin Shipyard Kochi (KL)', shipDate: '2026-07-19', transitDays: 2, zone: 'West', remarks: 'Sn-5Sb antimonial tin alloy for Cochin Shipyard submarine hull anode &#8594; 95% Sn &#8594; &#8377;310Cr for 6 tonnes &#8594; India &#8377;9,300Cr marine Sn &#8594; Cochin 6 submarines &#8594; 240&#176;C &#8594; corrosion 0.1 mm/yr &#8594; naval grade' },
  { id: 'TNA-0006', batchNo: 'TNA-B2406', city: 'Hyderabad', manufacturer: 'MIDHANI', alloyGrade: 'Sn-20Bi-10In Low-Melt', application: 'Thermal Interface (Tata Elxsi)', tinPercent: 70.0, meltingPointC: 120, investmentCr: 260, status: 'Delivered', priority: 'High', origin: 'MIDHANI Hyderabad (TG)', destination: 'Tata Elxsi Bengaluru (KA)', shipDate: '2026-07-20', transitDays: 1, zone: 'South', remarks: 'Sn-Bi-In low-melting alloy for Tata Elxsi 5G base station TIM pad &#8594; 70% Sn &#8594; &#8377;260Cr for 4 tonnes &#8594; India &#8377;7,800Cr telecom Sn &#8594; Tata 100K base stations &#8594; 120&#176;C &#8594; 35 W/mK &#8594; reflow grade' },
  { id: 'TNA-0007', batchNo: 'TNA-B2407', city: 'Ahmedabad', manufacturer: 'Gujarat Tin Industries', alloyGrade: 'Sn-0.7Cu Lead-Free Bar', application: 'PCB Assembly (Syrma SGS)', tinPercent: 99.3, meltingPointC: 227, investmentCr: 195, status: 'Delivered', priority: 'Medium', origin: 'Gujarat Tin Industries Rajkot (GJ)', destination: 'Syrma SGS Chennai (TN)', shipDate: '2026-07-21', transitDays: 1, zone: 'West', remarks: 'Sn-0.7Cu lead-free solder bar for Syrma SGS EMS PCB wave soldering &#8594; 99.3% Sn &#8594; &#8377;195Cr for 20 tonnes &#8594; India &#8377;5,850Cr EMS Sn &#8594; Syrma 200M PCBs &#8594; 227&#176;C &#8594; IPC-A-610 &#8594; wave grade' },
  { id: 'TNA-0008', batchNo: 'TNA-B2408', city: 'Jaipur', manufacturer: 'Rajasthan Tin', alloyGrade: 'Sn-3Ag-0.5Cu SAC305 Paste', application: 'Automotive ECU ( Uno Minda)', tinPercent: 96.5, meltingPointC: 217, investmentCr: 340, status: 'Delivered', priority: 'Critical', origin: 'Rajasthan Tin Jaipur (RJ)', destination: 'Uno Minda Pune (MH)', shipDate: '2026-07-22', transitDays: 2, zone: 'North', remarks: 'SAC305 solder paste for Uno Minda automotive ECU SMT reflow &#8594; 96.5% Sn &#8594; &#8377;340Cr for 10 tonnes &#8594; India &#8377;10,200Cr auto Sn &#8594; Uno Minda 50M ECUs &#8594; 217&#176;C &#8594; AEC-Q200 &#8594; type 4 paste' },
  { id: 'TNA-0009', batchNo: 'TNA-B2409', city: 'Bhubaneswar', manufacturer: 'Odisha Tin Corp', alloyGrade: 'Sn-9Zn High-Temp', application: 'Solar Panel (Tata Power Solar)', tinPercent: 91.0, meltingPointC: 199, investmentCr: 285, status: 'Delivered', priority: 'High', origin: 'Odisha Tin Corp Bhubaneswar (OD)', destination: 'Tata Power Nellore (AP)', shipDate: '2026-07-23', transitDays: 2, zone: 'East', remarks: 'Sn-9Zn high-temp lead-free solder for Tata Power Solar PV ribbon interconnect &#8594; 91% Sn &#8594; &#8377;285Cr for 18 tonnes &#8594; India &#8377;8,550Cr solar Sn &#8594; Tata 10 GW &#8594; 199&#176;C &#8594; IEC 61215 &#8594; ribbon grade' },
  { id: 'TNA-0010', batchNo: 'TNA-B2410', city: 'Guwahati', manufacturer: 'Assam Tin Mines', alloyGrade: 'Sn 99.95% LME Grade', application: 'Tinplate (TCIL)', tinPercent: 99.95, meltingPointC: 232, investmentCr: 245, status: 'Delivered', priority: 'Medium', origin: 'Assam Tin Mines Guwahati (AS)', destination: 'TCIL Jamshedpur (JH)', shipDate: '2026-07-24', transitDays: 4, zone: 'East', remarks: 'LME-grade pure Sn ingot for TCIL tinplate electrolytic tinning line &#8594; 99.95% Sn &#8594; &#8377;245Cr for 12 tonnes &#8594; India &#8377;7,350Cr packaging Sn &#8594; TCIL 500K tonnes tinplate &#8594; 232&#176;C &#8594; LME registered &#8594; 5N grade' },
  { id: 'TNA-0011', batchNo: 'TNA-B2411', city: 'Noida', manufacturer: 'UP Tin Industries', alloyGrade: 'Sn-2.5Ag-0.8Cu-0.5Sb', application: 'Space Electronics (ISRO)', tinPercent: 96.2, meltingPointC: 218, investmentCr: 520, status: 'Delivered', priority: 'Critical', origin: 'UP Tin Industries Noida (UP)', destination: 'ISRO Thiruvananthapuram (KL)', shipDate: '2026-07-25', transitDays: 3, zone: 'North', remarks: 'Anti-tin-whisker Sn-Ag-Cu-Sb solder for ISRO satellite PCB reflow &#8594; 96.2% Sn &#8594; &#8377;520Cr for 3 tonnes &#8594; India &#8377;15,600Cr space Sn &#8594; ISRO 12 satellites &#8594; 218&#176;C &#8594; ESA ECSS &#8594; anti-whisker' },
  { id: 'TNA-0012', batchNo: 'TNA-B2412', city: 'Surat', manufacturer: 'Gujarat Tin Alloys', alloyGrade: 'Sn-Bi 58/42 Eutectic', application: 'LED Assembly (Dixon Tech)', tinPercent: 58.0, meltingPointC: 138, investmentCr: 190, status: 'Delayed', priority: 'High', origin: 'Gujarat Tin Alloys Surat (GJ)', destination: 'Dixon Noida (UP)', shipDate: '2026-07-05', transitDays: 17, zone: 'West', remarks: 'Sn-Bi 58/42 low-temp solder paste for Dixon LED TV module rework &#8594; 58% Sn &#8594; &#8377;190Cr for 8 tonnes &#8594; monsoon delay &#8594; India &#8377;5,700Cr LED Sn &#8594; Dixon 20M modules &#8594; 138&#176;C &#8594; rework grade &#8594; Bi-42%' },
  { id: 'TNA-0013', batchNo: 'TNA-B2413', city: 'Coimbatore', manufacturer: 'Tamil Nadu Tin Alloys', alloyGrade: 'Sn-5Ag BGA Sphere', application: 'Semiconductor (SCL)', tinPercent: 95.0, meltingPointC: 221, investmentCr: 410, status: 'Delivered', priority: 'Critical', origin: 'Tamil Nadu Tin Alloys Coimbatore (TN)', destination: 'SCL Mohali (PB)', shipDate: '2026-07-26', transitDays: 2, zone: 'South', remarks: 'Sn-5Ag BGA solder sphere for SCL semiconductor chip packaging &#8594; 95% Sn &#8594; &#8377;410Cr for 2 tonnes &#8594; India &#8377;12,300Cr semi Sn &#8594; SCL 200M chips &#8594; 221&#176;C &#8594; JEDEC 0201 &#8594; 300um sphere' },
  { id: 'TNA-0014', batchNo: 'TNA-B2414', city: 'Bhopal', manufacturer: 'BHEL', alloyGrade: 'Sn-38Pb-2Sb Bearing', application: 'Turbine Bearing (BHEL)', tinPercent: 38.0, meltingPointC: 185, investmentCr: 335, status: 'Delivered', priority: 'High', origin: 'BHEL Bhopal (MP)', destination: 'BHEL Haridwar (UK)', shipDate: '2026-07-27', transitDays: 2, zone: 'North', remarks: 'Sn-38Pb-2Sb Babbitt bearing alloy for BHEL 800 MW steam turbine journal bearing &#8594; 38% Sn &#8594; &#8377;335Cr for 10 tonnes &#8594; India &#8377;10,050Cr power Sn &#8594; BHEL 150 GW &#8594; 185&#176;C &#8594; B89 Babbitt &#8594; centrifugal cast' }
]

const delayedSet = new Set(tinAlloyRecords.filter(r => r.status === 'Delayed').map(r => r.id))

export default function TinAlloyLogisticsView() {
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
    let data = tinAlloyRecords
    if (search) data = data.filter(r => Object.values(r).some(v => String(v).toLowerCase().includes(search.toLowerCase())))
    Object.entries(filters).forEach(([k, vals]) => { if (vals.length) data = data.filter(r => vals.includes(String((r as any)[k]))) })
    return data
  }, [search, filters])

  const total = tinAlloyRecords.length
  const delivered = tinAlloyRecords.filter(r => r.status === 'Delivered').length
  const totalCr = tinAlloyRecords.reduce((s: number, r) => s + r.investmentCr, 0)
  const avgSn = +(tinAlloyRecords.reduce((s: number, r) => s + r.tinPercent, 0) / total).toFixed(1)

  const manufacturers = [...new Set(tinAlloyRecords.map(r => r.manufacturer))]
  const zones = [...new Set(tinAlloyRecords.map(r => r.zone))]

  return (
    <div className="space-y-6">
      <PageHeader title="Tin Alloy Logistics" description="Indian tin alloy supply chain tracking across electronics solder, EV power module, defence radar, consumer PCB, marine coating, thermal interface, solar PV ribbon, tinplate packaging, space satellite, semiconductor BGA and turbine Babbitt bearing sectors" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent><div className="text-2xl font-bold text-sky-600">{total}</div><div className="text-xs text-muted-foreground">Total Shipments</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-sky-600">{delivered}</div><div className="text-xs text-muted-foreground">Delivered</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-sky-600">&#8377;{totalCr.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground">Total Investment</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-sky-600">{avgSn}%</div><div className="text-xs text-muted-foreground">Avg Sn Content</div></CardContent></Card>
      </div>

      <div className="flex gap-2 border-b">
        {tabs.map((t, i) => (<button key={t} className={`px-4 py-2 ${activeTab === i ? 'border-b-2 border-sky-600 text-sky-600 font-semibold' : 'text-muted-foreground'}`} onClick={() => setActiveTab(i)}>{t}</button>))}
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
        <div className="rounded-md border"><div className="max-h-96 overflow-auto"><table className="w-full text-sm"><thead className="sticky top-0 bg-background"><tr><th className="p-2 text-left">ID</th><th className="p-2 text-left">Batch</th><th className="p-2 text-left">Grade</th><th className="p-2 text-left">Application</th><th className="p-2 text-right">Sn%</th><th className="p-2 text-right">&#8377;Cr</th><th className="p-2 text-left">Status</th></tr></thead><tbody>{filtered.map(r => (<tr key={r.id} className={`border-t ${delayedSet.has(r.id) ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}><td className="p-2">{r.id}</td><td className="p-2">{r.batchNo}</td><td className="p-2">{r.alloyGrade}</td><td className="p-2">{r.application}</td><td className="p-2 text-right">{r.tinPercent}</td><td className="p-2 text-right">{r.investmentCr}</td><td className="p-2"><Badge variant={r.status === 'Delivered' ? 'default' : 'destructive'}>{r.status}</Badge></td></tr>))}</tbody></table></div></div>
      </div>)}

      {activeTab === 1 && (<div className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          {manufacturers.map(m => <Badge key={m} variant={filters.manufacturer?.includes(m) ? 'default' : 'outline'} className="cursor-pointer" onClick={() => toggleFilter('manufacturer', m)}>{m}</Badge>)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">By Manufacturer</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { m[r.manufacturer] = (m[r.manufacturer] || 0) + 1; return m }, {} as Record<string, number>)) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([m, c]) => (<div key={m} className="flex justify-between text-sm"><span>{m}</span><span className="font-medium">{c}</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Melting Point Range</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { const s = r.meltingPointC <= 150 ? 'Low-Melt (below 150&#176;C)' : r.meltingPointC <= 200 ? 'Medium-Melt (150-200&#176;C)' : r.meltingPointC <= 230 ? 'Standard (200-230&#176;C)' : 'High-Melt (230&#176;C+)'; m[s] = (m[s] || 0) + 1; return m }, {} as Record<string, number>)) as [string, number][]).map(([k, c]) => (<div key={k} className="flex justify-between text-sm"><span>{k}</span><span className="font-medium">{c}</span></div>))}</div></CardContent></Card>
        </div>
        <div className="rounded-md border"><div className="max-h-96 overflow-auto"><table className="w-full text-sm"><thead className="sticky top-0 bg-background"><tr><th className="p-2 text-left">ID</th><th className="p-2 text-left">Manufacturer</th><th className="p-2 text-left">Grade</th><th className="p-2 text-left">Origin</th><th className="p-2 text-left">Destination</th><th className="p-2 text-right">Transit</th><th className="p-2 text-left">Zone</th></tr></thead><tbody>{filtered.map(r => (<tr key={r.id} className={`border-t ${delayedSet.has(r.id) ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}><td className="p-2">{r.id}</td><td className="p-2">{r.manufacturer}</td><td className="p-2">{r.alloyGrade}</td><td className="p-2">{r.origin}</td><td className="p-2">{r.destination}</td><td className="p-2 text-right">{r.transitDays}d</td><td className="p-2">{r.zone}</td></tr>))}</tbody></table></div></div>
      </div>)}

      {activeTab === 2 && (<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card><CardHeader><CardTitle className="text-sm">Investment by Application</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { m[r.application] = (m[r.application] || 0) + r.investmentCr; return m }, {} as Record<string, number>)) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 7).map(([a, v]) => (<div key={a} className="flex justify-between text-sm"><span>{a}</span><span className="font-medium">&#8377;{v}Cr</span></div>))}</div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Tin Content Distribution</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { const n = r.tinPercent >= 95 ? 'High Sn (95%+)' : r.tinPercent >= 70 ? 'Medium Sn (70-95%)' : r.tinPercent >= 50 ? 'Low Sn (50-70%)' : 'Alloy (<50%)'; m[n] = (m[n] || 0) + 1; return m }, {} as Record<string, number>)) as [string, number][]).map(([k, c]) => (<div key={k} className="flex justify-between text-sm"><span>{k}</span><span className="font-medium">{c}</span></div>))}</div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Top Routes by Value</CardTitle></CardHeader><CardContent><div className="space-y-2">{filtered.sort((a, b) => b.investmentCr - a.investmentCr).slice(0, 7).map(r => (<div key={r.id} className="flex justify-between text-sm"><span>{r.origin.split('(')[0]} &#8594; {r.destination.split('(')[0]}</span><span className="font-medium">&#8377;{r.investmentCr}Cr</span></div>))}</div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Space and Defence Solder</CardTitle></CardHeader><CardContent><div className="space-y-2">{filtered.filter(r => r.application.toLowerCase().includes('space') || r.application.toLowerCase().includes('defence') || r.application.toLowerCase().includes('satellite') || r.application.toLowerCase().includes('radar')).sort((a, b) => b.investmentCr - a.investmentCr).map(r => (<div key={r.id} className="flex justify-between text-sm"><span>{r.alloyGrade} ({r.meltingPointC}&#176;C)</span><span className="font-medium">&#8377;{r.investmentCr}Cr</span></div>))}</div></CardContent></Card>
      </div>)}

      {activeTab === 3 && (<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card><CardContent><div className="text-sm font-medium text-sky-600 mb-2">India Lead-Free Solder Transition</div><div className="text-xs text-muted-foreground">Indian electronics industry transitioning from Sn-Pb to lead-free SAC305 (96.5Sn-3Ag-0.5Cu) solder driven by RoHS compliance and export requirements. India consuming 80 TPA tin for electronics solder. KEC, Syrma SGS and Dixon leading SAC305 adoption. Government mandating lead-free for all consumer electronics by 2027. SAC alloy demand growing at 25% CAGR.</div></CardContent></Card>
        <Card><CardContent><div className="text-sm font-medium text-sky-600 mb-2">Space-Grade Anti-Whisker Solder</div><div className="text-xs text-muted-foreground">ISRO using Sn-2.5Ag-0.8Cu-0.5Sb anti-tin-whisker solder for satellite PCBs after Chandrayaan-3 whisker failure investigation. Tin whisker growth can cause satellite short circuits in orbit. India consuming 5 TPA space-grade solder. UP Tin Industries supplying 3 TPA with Sb dopant. ISRO targeting 24 Gaganyaan and satellite launches by 2030.</div></CardContent></Card>
        <Card><CardContent><div className="text-sm font-medium text-sky-600 mb-2">Monsoon Delays LED Solder</div><div className="text-xs text-muted-foreground">TNA-B2412 Sn-Bi 58/42 low-temp solder paste for Dixon LED TV module rework delayed 17 days due to Gujarat monsoon flooding. Dixon Noida LED TV production line at risk. India consuming 30 TPA Sn-Bi alloy for consumer LED rework. Recommend pre-positioning 5-tonne buffer at Noida warehouse before monsoon season. Sn-Bi eutectic ideal for sensitive component rework at 138&#176;C.</div></CardContent></Card>
        <Card><CardContent><div className="text-sm font-medium text-sky-600 mb-2">Semiconductor BGA Sphere Supply</div><div className="text-xs text-muted-foreground">SCL Mohali consuming 15 TPA Sn-5Ag and Sn-3.5Ag BGA solder spheres for semiconductor chip packaging. India importing 90% BGA spheres from Japan and South Korea. Tamil Nadu Tin Alloys developing indigenous 300um and 200um sphere production by 2027. India targeting 500M chips/year under semiconductor mission, requiring 25 TPA solder spheres.</div></CardContent></Card>
      </div>)}
    </div>
  )
}
"""

outpath = '/home/z/my-project/src/components/modules/tin-alloy-logistics-view.tsx'
with open(outpath, 'w') as f:
    f.write(content)
print(f"Generated {outpath}")
