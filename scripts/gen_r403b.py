#!/usr/bin/env python3
"""Generate magnesium-powder-logistics-view.tsx (R403b)"""
import os

content = r"""'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { Feather } from 'lucide-react'

interface MagnesiumPowderRecord {
  id: string
  batchNo: string
  city: string
  manufacturer: string
  powderGrade: string
  application: string
  magnesiumPercent: number
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

const magnesiumPowderRecords: MagnesiumPowderRecord[] = [
  { id: 'MGP-0001', batchNo: 'MGP-B2401', city: 'Mumbai', manufacturer: 'Hindustan Zinc', powderGrade: 'Mg 99.9% Pure Ingot', application: 'Die Casting (Mahindra)', magnesiumPercent: 99.9, meshSize: 20, investmentCr: 380, status: 'Delivered', priority: 'High', origin: 'Hindustan Zinc Udaipur (RJ)', destination: 'Mahindra Nagpur (MH)', shipDate: '2026-07-15', transitDays: 2, zone: 'West', remarks: 'Pure Mg ingot for Mahindra XUV700 die-cast instrument panel &#8594; 99.9% Mg &#8594; &#8377;380Cr for 20 tonnes &#8594; India &#8377;11,400Cr auto Mg &#8594; Mahindra 500K SUVs &#8594; 20 mesh lump &#8594; 650&#176;C &#8594; HPDC grade' },
  { id: 'MGP-0002', batchNo: 'MGP-B2402', city: 'Chennai', manufacturer: 'Neyveli Lignite', powderGrade: 'Mg-Ca 1% Ignition Resistant', application: 'Auto Seat Frame (Maruti Suzuki)', magnesiumPercent: 99.0, meshSize: 30, investmentCr: 420, status: 'Delivered', priority: 'Critical', origin: 'Neyveli Mg Corp Chennai (TN)', destination: 'Maruti Manesar (HR)', shipDate: '2026-07-16', transitDays: 2, zone: 'South', remarks: 'Mg-Ca 1% ignition-resistant alloy for Maruti Alto seat frame AM &#8594; 99% Mg &#8594; &#8377;420Cr for 10 tonnes &#8594; India &#8377;12,600Cr auto Mg &#8594; Maruti 2M cars &#8594; 30 mesh &#8594; 30% weight saving &#8594; ASTM B93' },
  { id: 'MGP-0003', batchNo: 'MGP-B2403', city: 'Bengaluru', manufacturer: 'MIDHANI', powderGrade: 'Mg-Gd-Y-Zn WE43', application: 'Aerospace Bracket (HAL)', magnesiumPercent: 93.0, meshSize: 45, investmentCr: 560, status: 'Delivered', priority: 'Critical', origin: 'MIDHANI Hyderabad (TG)', destination: 'HAL Bengaluru (KA)', shipDate: '2026-07-17', transitDays: 1, zone: 'South', remarks: 'WE43 rare-earth Mg alloy powder for HAL Tejas avionics bay bracket &#8594; 93% Mg &#8594; &#8377;560Cr for 3 tonnes &#8594; India &#8377;16,800Cr aero Mg &#8594; HAL 123 Tejas &#8594; 45 mesh &#8594; 250&#176;C &#8594; LPBF grade' },
  { id: 'MGP-0004', batchNo: 'MGP-B2404', city: 'Hyderabad', manufacturer: 'DRDO DMRL', powderGrade: 'Mg-Al 8% AM60B', application: 'Drone Frame (DRDO ADE)', magnesiumPercent: 92.0, meshSize: 40, investmentCr: 340, status: 'Delivered', priority: 'High', origin: 'DRDO DMRL Hyderabad (TG)', destination: 'DRDO ADE Bengaluru (KA)', shipDate: '2026-07-18', transitDays: 1, zone: 'South', remarks: 'AM60B magnesium alloy powder for DRDO Nishant UAV airframe die casting &#8594; 92% Mg &#858594; &#8377;340Cr for 5 tonnes &#8597; India &#8594; DRDO 200 UAVs &#8594; 40 mesh &#8594; 240 MPa &#8594; thin-wall DC' },
  { id: 'MGP-0005', batchNo: 'MGP-B2405', city: 'Kolkata', manufacturer: 'SAIL', powderGrade: 'Mg-Zn-Zr ZK60A', application: 'Wheel Rim (Bajaj Auto)', magnesiumPercent: 94.0, meshSize: 25, investmentCr: 285, status: 'Delivered', priority: 'Medium', origin: 'SAIL Salem (TN)', destination: 'Bajaj Auto Pune (MH)', shipDate: '2026-07-19', transitDays: 2, zone: 'East', remarks: 'ZK60A high-strength Mg alloy for Bajaj KTM Duke motorcycle wheel rim forging &#8594; 94% Mg &#8594; &#8377;285Cr for 8 tonnes &#8594; India &#8377;8,550Cr two-wheeler Mg &#8594; Bajaj 10M bikes &#8594; 25 mesh &#8594; 350 MPa &#8594; forged billet' },
  { id: 'MGP-0006', batchNo: 'MGP-B2406', city: 'Pune', manufacturer: 'Bharat Forge', powderGrade: 'Mg-Al-Zn AZ91D', application: 'Gear Housing (Tata Motors)', magnesiumPercent: 90.0, meshSize: 35, investmentCr: 210, status: 'Delivered', priority: 'Medium', origin: 'Bharat Forge Pune (MH)', destination: 'Tata Motors Sanand (GJ)', shipDate: '2026-07-20', transitDays: 1, zone: 'West', remarks: 'AZ91D die-cast Mg alloy for Tata Nexon EV gearbox housing &#8594; 90% Mg &#8594; &#8377;210Cr for 15 tonnes &#8594; India &#8377;6,300Cr auto Mg &#8594; Tata 300K EVs &#8594; 35 mesh &#8594; 230 MPa &#8594; HPDC' },
  { id: 'MGP-0007', batchNo: 'MGP-B2407', city: 'Ahmedabad', manufacturer: 'Gujarat Mg Industries', powderGrade: 'Mg-RE 3% Electron', application: 'Defence Radio (BEL)', magnesiumPercent: 97.0, meshSize: 60, investmentCr: 320, status: 'Delivered', priority: 'High', origin: 'Gujarat Mg Industries Vadodara (GJ)', destination: 'BEL Bengaluru (KA)', shipDate: '2026-07-21', transitDays: 1, zone: 'West', remarks: 'Electron (Mg-RE) alloy powder for BEL tactical radio housing AM &#8594; 97% Mg &#8594; &#8377;320Cr for 3 tonnes &#8594; India &#8377;9,600Cr defence Mg &#8594; BEL 10K radios &#8594; 60 mesh &#8594; 200&#176;C creep &#8594; LPBF' },
  { id: 'MGP-0008', batchNo: 'MGP-B2408', city: 'Jaipur', manufacturer: 'Rajasthan Mg Alloys', powderGrade: 'Mg 99.95% Sacrificial Anode', application: 'Pipeline Cathodic (GAIL)', magnesiumPercent: 99.95, meshSize: 80, investmentCr: 155, status: 'Delivered', priority: 'Medium', origin: 'Rajasthan Mg Alloys Jodhpur (RJ)', destination: 'GAIL Delhi (DL)', shipDate: '2026-07-22', transitDays: 2, zone: 'North', remarks: 'High-purity Mg sacrificial anode for GAIL gas pipeline cathodic protection &#8594; 99.95% Mg &#8594; &#8377;155Cr for 25 tonnes &#8594; India &#8377;4,650Cr pipeline Mg &#8594; GAIL 15K km &#8594; 80 mesh &#8594; -1.6V SCE &#8594; 20yr life' },
  { id: 'MGP-0009', batchNo: 'MGP-B2409', city: 'Coimbatore', manufacturer: 'Tamil Nadu Mg Corp', powderGrade: 'Mg-6Al-3Zn AM Lite', application: 'Laptop Chassis (Dell India)', magnesiumPercent: 91.0, meshSize: 50, investmentCr: 390, status: 'Delivered', priority: 'High', origin: 'Tamil Nadu Mg Corp Hosur (TN)', destination: 'Dell Chennai (TN)', shipDate: '2026-07-23', transitDays: 1, zone: 'South', remarks: 'AM Lite Mg alloy for Dell laptop thinned-wall chassis die casting &#8594; 91% Mg &#8594; &#8377;390Cr for 4 tonnes &#8594; India &#8377;11,700Cr IT Mg &#8594; Dell 2M laptops &#8594; 50 mesh &#8594; 0.8mm wall &#8594; Thixomolding' },
  { id: 'MGP-0010', batchNo: 'MGP-B2410', city: 'Bhubaneswar', manufacturer: 'Odisha Mg Mines', powderGrade: 'MgO 98% Dead Burnt', application: 'Refractory (Dalmia Cement)', magnesiumPercent: 60.3, meshSize: 200, investmentCr: 130, status: 'Delivered', priority: 'Low', origin: 'Odisha Mg Mines Cuttack (OD)', destination: 'Dalmia Rajgangpur (OD)', shipDate: '2026-07-24', transitDays: 1, zone: 'East', remarks: 'Dead-burnt MgO 98% for Dalmia cement kiln magnesite-spinel refractory &#8594; 60.3% Mg &#8594; &#8377;130Cr for 40 tonnes &#8594; India &#8377;3,900Cr refractory Mg &#8594; Dalmia 40 MTPA &#8594; 200 mesh &#8594; 1800&#176;C &#8594; DBM grade' },
  { id: 'MGP-0011', batchNo: 'MGP-B2411', city: 'Guwahati', manufacturer: 'Assam Mg Corp', powderGrade: 'Mg-Th 3% Pyrotechnic', application: 'Defence Flare (OFB)', magnesiumPercent: 97.0, meshSize: 325, investmentCr: 195, status: 'Delivered', priority: 'High', origin: 'Assam Mg Corp Guwahati (AS)', destination: 'OFB Bhopal (MP)', shipDate: '2026-07-25', transitDays: 4, zone: 'East', remarks: 'Mg-Th 3% pyro-flake powder for OFB IR countermeasure flare decoy &#8594; 97% Mg &#8594; &#8377;195Cr for 2 tonnes &#8594; India &#8377;5,850Cr defence Mg &#8594; OFB 500K flares &#8594; 325 mesh &#8594; 3000K burn &#8594; mil-spec' },
  { id: 'MGP-0012', batchNo: 'MGP-B2412', city: 'Surat', manufacturer: 'Gujarat Mg Tech', powderGrade: 'Mg-Al-RE AE42', application: 'EV Motor Casing (Ather Energy)', magnesiumPercent: 97.5, meshSize: 40, investmentCr: 265, status: 'Delayed', priority: 'High', origin: 'Gujarat Mg Tech Surat (GJ)', destination: 'Ather Bengaluru (KA)', shipDate: '2026-07-03', transitDays: 19, zone: 'West', remarks: 'AE42 creep-resistant Mg alloy for Ather 450X Gen3 EV motor end plate &#8594; 97.5% Mg &#8594; &#8377;265Cr for 6 tonnes &#8594; monsoon delay &#8594; India &#8377;7,950Cr EV Mg &#8594; Ather 200K scooters &#8594; 40 mesh &#8594; 150&#176;C &#8594; HPDC' },
  { id: 'MGP-0013', batchNo: 'MGP-B2413', city: 'Noida', manufacturer: 'UP Mg Industries', powderGrade: 'Mg-Mn 1.5% Extrusion', application: 'Power Tool (Bosch India)', magnesiumPercent: 98.5, meshSize: 55, investmentCr: 175, status: 'Delivered', priority: 'Medium', origin: 'UP Mg Industries Noida (UP)', destination: 'Bosch Bengaluru (KA)', shipDate: '2026-07-26', transitDays: 2, zone: 'North', remarks: 'Mg-Mn extrusion alloy for Bosch angle grinder housing thixo-molded &#8594; 98.5% Mg &#8594; &#8377;175Cr for 10 tonnes &#8594; India &#8377;5,250Cr tool Mg &#8594; Bosch 5M tools &#8594; 55 mesh &#8594; 200 MPa &#8594; extruded bar' },
  { id: 'MGP-0014', batchNo: 'MGP-B2414', city: 'Bhopal', manufacturer: 'BHEL', powderGrade: 'Mg-Li 10% Ultralight', application: 'Satellite Panel (ISRO)', magnesiumPercent: 90.0, meshSize: 70, investmentCr: 470, status: 'Delivered', priority: 'Critical', origin: 'BHEL Bhopal (MP)', destination: 'ISRO Ahmedabad (GJ)', shipDate: '2026-07-27', transitDays: 2, zone: 'North', remarks: 'Mg-Li 10% ultralight alloy for ISRO small satellite panel sandwich &#8594; 90% Mg &#8594; &#8377;470Cr for 2 tonnes &#8594; India &#8377;14,100Cr space Mg &#8594; ISRO 12 sats &#8594; 70 mesh &#8594; 1.5 g/cc &#8594; diffusion bonded' }
]

const delayedSet = new Set(magnesiumPowderRecords.filter(r => r.status === 'Delayed').map(r => r.id))

export default function MagnesiumPowderLogisticsView() {
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
    let data = magnesiumPowderRecords
    if (search) data = data.filter(r => Object.values(r).some(v => String(v).toLowerCase().includes(search.toLowerCase())))
    Object.entries(filters).forEach(([k, vals]) => { if (vals.length) data = data.filter(r => vals.includes(String((r as any)[k]))) })
    return data
  }, [search, filters])

  const total = magnesiumPowderRecords.length
  const delivered = magnesiumPowderRecords.filter(r => r.status === 'Delivered').length
  const totalCr = magnesiumPowderRecords.reduce((s: number, r) => s + r.investmentCr, 0)
  const avgMg = +(magnesiumPowderRecords.reduce((s: number, r) => s + r.magnesiumPercent, 0) / total).toFixed(1)

  const manufacturers = [...new Set(magnesiumPowderRecords.map(r => r.manufacturer))]
  const zones = [...new Set(magnesiumPowderRecords.map(r => r.zone))]

  return (
    <div className="space-y-6">
      <PageHeader title="Magnesium Powder Logistics" description="Indian magnesium powder supply chain tracking across automotive die casting, aerospace AM, UAV airframe, motorcycle wheel rim, defence radio, pipeline cathodic protection, laptop chassis, pyrotechnic flare, EV motor, power tool, satellite panel and refractory sectors" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent><div className="text-2xl font-bold text-lime-600">{total}</div><div className="text-xs text-muted-foreground">Total Shipments</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-lime-600">{delivered}</div><div className="text-xs text-muted-foreground">Delivered</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-lime-600">&#8377;{totalCr.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground">Total Investment</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-lime-600">{avgMg}%</div><div className="text-xs text-muted-foreground">Avg Mg Content</div></CardContent></Card>
      </div>

      <div className="flex gap-2 border-b">
        {tabs.map((t, i) => (<button key={t} className={`px-4 py-2 ${activeTab === i ? 'border-b-2 border-lime-600 text-lime-600 font-semibold' : 'text-muted-foreground'}`} onClick={() => setActiveTab(i)}>{t}</button>))}
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
        <div className="rounded-md border"><div className="max-h-96 overflow-auto"><table className="w-full text-sm"><thead className="sticky top-0 bg-background"><tr><th className="p-2 text-left">ID</th><th className="p-2 text-left">Batch</th><th className="p-2 text-left">Grade</th><th className="p-2 text-left">Application</th><th className="p-2 text-right">Mg%</th><th className="p-2 text-right">&#8377;Cr</th><th className="p-2 text-left">Status</th></tr></thead><tbody>{filtered.map(r => (<tr key={r.id} className={`border-t ${delayedSet.has(r.id) ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}><td className="p-2">{r.id}</td><td className="p-2">{r.batchNo}</td><td className="p-2">{r.powderGrade}</td><td className="p-2">{r.application}</td><td className="p-2 text-right">{r.magnesiumPercent}</td><td className="p-2 text-right">{r.investmentCr}</td><td className="p-2"><Badge variant={r.status === 'Delivered' ? 'default' : 'destructive'}>{r.status}</Badge></td></tr>))}</tbody></table></div></div>
      </div>)}

      {activeTab === 1 && (<div className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          {manufacturers.map(m => <Badge key={m} variant={filters.manufacturer?.includes(m) ? 'default' : 'outline'} className="cursor-pointer" onClick={() => toggleFilter('manufacturer', m)}>{m}</Badge>)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">By Manufacturer</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { m[r.manufacturer] = (m[r.manufacturer] || 0) + 1; return m }, {} as Record<string, number>)) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([m, c]) => (<div key={m} className="flex justify-between text-sm"><span>{m}</span><span className="font-medium">{c}</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Mesh Size Range</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { const s = r.meshSize <= 35 ? 'Fine (0-35 mesh)' : r.meshSize <= 60 ? 'Medium (36-60 mesh)' : r.meshSize <= 100 ? 'Coarse (61-100 mesh)' : 'Bulk (100+ mesh)'; m[s] = (m[s] || 0) + 1; return m }, {} as Record<string, number>)) as [string, number][]).map(([k, c]) => (<div key={k} className="flex justify-between text-sm"><span>{k}</span><span className="font-medium">{c}</span></div>))}</div></CardContent></Card>
        </div>
        <div className="rounded-md border"><div className="max-h-96 overflow-auto"><table className="w-full text-sm"><thead className="sticky top-0 bg-background"><tr><th className="p-2 text-left">ID</th><th className="p-2 text-left">Manufacturer</th><th className="p-2 text-left">Grade</th><th className="p-2 text-left">Origin</th><th className="p-2 text-left">Destination</th><th className="p-2 text-right">Transit</th><th className="p-2 text-left">Zone</th></tr></thead><tbody>{filtered.map(r => (<tr key={r.id} className={`border-t ${delayedSet.has(r.id) ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}><td className="p-2">{r.id}</td><td className="p-2">{r.manufacturer}</td><td className="p-2">{r.powderGrade}</td><td className="p-2">{r.origin}</td><td className="p-2">{r.destination}</td><td className="p-2 text-right">{r.transitDays}d</td><td className="p-2">{r.zone}</td></tr>))}</tbody></table></div></div>
      </div>)}

      {activeTab === 2 && (<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card><CardHeader><CardTitle className="text-sm">Investment by Application</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { m[r.application] = (m[r.application] || 0) + r.investmentCr; return m }, {} as Record<string, number>)) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 7).map(([a, v]) => (<div key={a} className="flex justify-between text-sm"><span>{a}</span><span className="font-medium">&#8377;{v}Cr</span></div>))}</div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Magnesium Content Distribution</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { const n = r.magnesiumPercent >= 98 ? 'High Purity (98%+)' : r.magnesiumPercent >= 90 ? 'Alloy Mg (90-98%)' : r.magnesiumPercent >= 60 ? 'Compound (60-90%)' : 'Ore (<60%)'; m[n] = (m[n] || 0) + 1; return m }, {} as Record<string, number>)) as [string, number][]).map(([k, c]) => (<div key={k} className="flex justify-between text-sm"><span>{k}</span><span className="font-medium">{c}</span></div>))}</div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Top Routes by Value</CardTitle></CardHeader><CardContent><div className="space-y-2">{filtered.sort((a, b) => b.investmentCr - a.investmentCr).slice(0, 7).map(r => (<div key={r.id} className="flex justify-between text-sm"><span>{r.origin.split('(')[0]} &#8594; {r.destination.split('(')[0]}</span><span className="font-medium">&#8377;{r.investmentCr}Cr</span></div>))}</div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Aerospace and Defence Grade</CardTitle></CardHeader><CardContent><div className="space-y-2">{filtered.filter(r => r.application.toLowerCase().includes('aero') || r.application.toLowerCase().includes('defence') || r.application.toLowerCase().includes('drone') || r.application.toLowerCase().includes('satellite') || r.application.toLowerCase().includes('flare')).sort((a, b) => b.investmentCr - a.investmentCr).map(r => (<div key={r.id} className="flex justify-between text-sm"><span>{r.powderGrade} ({r.meshSize} mesh)</span><span className="font-medium">&#8377;{r.investmentCr}Cr</span></div>))}</div></CardContent></Card>
      </div>)}

      {activeTab === 3 && (<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card><CardContent><div className="text-sm font-medium text-lime-600 mb-2">India Automotive Mg Die-Cast Expansion</div><div className="text-xs text-muted-foreground">Indian automotive industry consuming 50 TPA magnesium alloys for die-cast instrument panels, seat frames, gearbox housings and wheel rims. Mahindra, Maruti Suzuki and Tata Motors driving 35% CAGR Mg adoption. India importing 80% primary Mg from China and Israel. NAL and MIDHANI developing indigenous Mg-Li ultralight alloy for EV weight reduction targets 40% by 2030.</div></CardContent></Card>
        <Card><CardContent><div className="text-sm font-medium text-lime-600 mb-2">Mg-Li Satellite Panel Programme</div><div className="text-xs text-muted-foreground">ISRO developing Mg-Li 10% ultralight alloy (density 1.5 g/cc) for small satellite structural panels, replacing Al 7075 to achieve 45% mass saving. BHEL and DRDO collaborating on diffusion-bonded Mg-Li sandwich panels. India launching 24 satellites by 2030 under space economy push. Mg-Li alloy powder being produced at MIDHANI and BHEL Bhopal pilot facility.</div></CardContent></Card>
        <Card><CardContent><div className="text-sm font-medium text-lime-600 mb-2">Monsoon Delays EV Motor Supply</div><div className="text-xs text-muted-foreground">MGP-B2412 AE42 creep-resistant Mg alloy for Ather 450X Gen3 EV motor end plate delayed 19 days due to Gujarat monsoon. Ather scooter production ramp at risk. India consuming 8 TPA Mg-RE alloys for EV motor and power electronics. Recommend pre-positioning 3-tonne buffer at Bengaluru warehouse and switching to air freight for priority batches.</div></CardContent></Card>
        <Card><CardContent><div className="text-sm font-medium text-lime-600 mb-2">WE43 Aerospace AM Ramp</div><div className="text-xs text-muted-foreground">HAL consuming 5 TPA WE43 (Mg-Gd-Y-Zn) rare-earth magnesium alloy powder for Tejas avionics bay brackets via LPBF. WE43 offers 250&#176;C service temperature with 50% weight saving vs aluminium. MIDHANI and DRDO DMRL commissioning 20 TPA RE-Mg gas atomizer by 2028. India targeting 200 Tejas Mk2 aircraft with 30% Mg content by 2035.</div></CardContent></Card>
      </div>)}
    </div>
  )
}
"""

outpath = '/home/z/my-project/src/components/modules/magnesium-powder-logistics-view.tsx'
with open(outpath, 'w') as f:
    f.write(content)
print(f"Generated {outpath}")
