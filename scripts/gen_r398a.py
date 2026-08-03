import os

content = r"""'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { Layers } from 'lucide-react'

interface TungstenSheetRecord {
  id: string
  batchNo: string
  city: string
  manufacturer: string
  sheetGrade: string
  application: string
  tungstenPercent: number
  thicknessMm: number
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

const tungstenSheetRecords: TungstenSheetRecord[] = [
  { id: 'TWS-0001', batchNo: 'TWS-B2401', city: 'Mumbai', manufacturer: 'MIDHANI', sheetGrade: 'Pure W Sheet 99.95% 2mm', application: 'X-ray Tube Target (Wipro GE)', tungstenPercent: 99.95, thicknessMm: 2.0, investmentCr: 420, status: 'Delivered', priority: 'Critical', origin: 'MIDHANI Hyderabad (TG)', destination: 'Wipro GE Bengaluru (KA)', shipDate: '2026-07-15', transitDays: 1, zone: 'South', remarks: 'Pure W rotary anode sheet for Wipro GE CT scanner X-ray tube &#8594; 99.95% W &#8594; &#8377;420Cr for 8 tonnes &#8594; India &#8377;12,600Cr medical W &#8594; Wipro GE 500 scanners/yr &#8594; 2mm rolled &#8594; 19.3 g/cc density &#8594; vacuum annealed' },
  { id: 'TWS-0002', batchNo: 'TWS-B2402', city: 'Bengaluru', manufacturer: 'DRDO DMRL', sheetGrade: 'W-Ni-Fe Heavy Alloy 3mm', application: 'Kinetic Penetrator (DRDO)', tungstenPercent: 92.5, thicknessMm: 3.0, investmentCr: 680, status: 'Delivered', priority: 'Critical', origin: 'DRDO DMRL Hyderabad (TG)', destination: 'DRDO Pune (MH)', shipDate: '2026-07-16', transitDays: 2, zone: 'South', remarks: 'W-Ni-Fe heavy alloy sheet for DRDO anti-tank kinetic energy penetrator &#8594; 92.5% W &#8594; &#8377;680Cr for 12 tonnes &#8594; India &#8377;20,400Cr defence W &#8594; DRDO 10,000 rounds/yr &#8594; 3mm plate &#8594; 17.5 g/cc &#8594; sintered + forged' },
  { id: 'TWS-0003', batchNo: 'TWS-B2403', city: 'Hyderabad', manufacturer: 'IGCAR', sheetGrade: 'W-La2O3 Sheet 1mm', application: 'Nuclear Fusion Shield (ITER)', tungstenPercent: 97.0, thicknessMm: 1.0, investmentCr: 550, status: 'Delivered', priority: 'Critical', origin: 'IGCAR Kalpakkam (TN)', destination: 'ITER India Gandhinagar (GJ)', shipDate: '2026-07-17', transitDays: 2, zone: 'South', remarks: 'W-1%La2O3 oxide-dispersion sheet for ITER India divertor plasma-facing &#8594; 97% W &#8594; &#8377;550Cr for 6 tonnes &#8594; India &#8377;16,500Cr fusion W &#8594; ITER 20 India modules &#8594; 1mm rolled &#8594; 800&#176;C service &#8594; recrystallized' },
  { id: 'TWS-0004', batchNo: 'TWS-B2404', city: 'Chennai', manufacturer: 'Bharat Forge', sheetGrade: 'W-Cu Composite 4mm', application: 'EDM Electrode (Bharat Forge)', tungstenPercent: 80.0, thicknessMm: 4.0, investmentCr: 195, status: 'Delivered', priority: 'Medium', origin: 'Bharat Forge Pune (MH)', destination: 'Bharat Forge Chennai (TN)', shipDate: '2026-07-18', transitDays: 2, zone: 'South', remarks: 'W-Cu 80/20 composite sheet for EDM sinker electrode die-sinking &#8594; 80% W &#8594; &#8377;195Cr for 10 tonnes &#8594; India &#8377;5,850Cr tool W &#8594; Bharat Forge 500 dies/yr &#8594; 4mm plate &#8594; infiltrated Cu &#8594; 42 WSi thermal' },
  { id: 'TWS-0005', batchNo: 'TWS-B2405', city: 'Pune', manufacturer: 'HAL', sheetGrade: 'W-Re Sheet 0.5mm', application: 'Aero Thermocouple (HAL)', tungstenPercent: 95.0, thicknessMm: 0.5, investmentCr: 320, status: 'Delivered', priority: 'High', origin: 'HAL Bengaluru (KA)', destination: 'HAL Koraput (OD)', shipDate: '2026-07-19', transitDays: 3, zone: 'West', remarks: 'W-5%Re thermocouple sheath sheet for HAL Su-30MKI engine EGT sensor &#8594; 95% W &#8594; &#8377;320Cr for 3 tonnes &#8594; India &#8377;9,600Cr aero W &#8594; HAL 220 Su-30 fleet &#8594; 0.5mm foil &#8594; 2500&#176;C capable &#8594; Type C TC' },
  { id: 'TWS-0006', batchNo: 'TWS-B2406', city: 'Kolkata', manufacturer: 'SAIL', sheetGrade: 'W-Ni-Cu Sheet 5mm', application: 'Radiation Shield (BEL)', tungstenPercent: 90.0, thicknessMm: 5.0, investmentCr: 265, status: 'Delivered', priority: 'High', origin: 'SAIL Bhilai (CG)', destination: 'BEL Ghaziabad (UP)', shipDate: '2026-07-20', transitDays: 2, zone: 'East', remarks: 'W-Ni-Cu 90/6/4 high-density alloy sheet for BEL radar radiation shielding cabinet &#8594; 90% W &#8594; &#8377;265Cr for 15 tonnes &#8594; India &#8377;7,950Cr defence W &#8594; BEL 100+ radar sites &#8594; 5mm plate &#8594; 18.0 g/cc &#8594; 50 dB at 10 GHz' },
  { id: 'TWS-0007', batchNo: 'TWS-B2407', city: 'Ahmedabad', manufacturer: 'Gujarat Fluorochemicals', sheetGrade: 'W Plate 99.9% 10mm', application: 'Semi-conductor Ion Implant (SCL)', tungstenPercent: 99.9, thicknessMm: 10.0, investmentCr: 480, status: 'Delivered', priority: 'Critical', origin: 'Gujarat Fluoro Vadodara (GJ)', destination: 'SCL Mohali (PB)', shipDate: '2026-07-21', transitDays: 1, zone: 'West', remarks: 'Pure W bulk plate for SCL semiconductor ion implanter beam stop &#8594; 99.9% W &#8594; &#8377;480Cr for 5 tonnes &#8594; India &#8377;14,400Cr semi W &#8594; SCL 28nm line &#8594; 10mm plate &#8594; 19.3 g/cc &#8594; stress-relieved' },
  { id: 'TWS-0008', batchNo: 'TWS-B2408', city: 'Jaipur', manufacturer: 'Rajasthan Tungsten Industries', sheetGrade: 'W-Co Carbide Sheet 3mm', application: 'Cutting Tool Insert (Sandvik)', tungstenPercent: 85.0, thicknessMm: 3.0, investmentCr: 175, status: 'Delivered', priority: 'Medium', origin: 'Rajasthan Tungsten Jaipur (RJ)', destination: 'Sandvik Pune (MH)', shipDate: '2026-07-22', transitDays: 2, zone: 'North', remarks: 'WC-Co cemented carbide sheet for Sandvik CNC turning insert blank &#8594; 85% W &#8594; &#8377;175Cr for 8 tonnes &#8594; India &#8377;5,250Cr tool W &#8594; Sandvik 2M inserts/yr &#8594; 3mm strip &#8594; 14.5 g/cc &#8594; 1600 HV' },
  { id: 'TWS-0009', batchNo: 'TWS-B2409', city: 'Coimbatore', manufacturer: 'Tamil Nadu Tungsten Alloys', sheetGrade: 'W-ThO2 Sheet 2mm', application: 'Welding Electrode (L&T)', tungstenPercent: 98.5, thicknessMm: 2.0, investmentCr: 145, status: 'Delivered', priority: 'High', origin: 'Tamil Nadu Tungsten Coimbatore (TN)', destination: 'L&T Mumbai (MH)', shipDate: '2026-07-23', transitDays: 2, zone: 'South', remarks: 'W-2%ThO2 thoriated tungsten sheet for L&T TIG welding electrode &#8594; 98.5% W &#8594; &#8377;145Cr for 4 tonnes &#8594; India &#8377;4,350Cr weld W &#8594; L&T 40 warships &#8594; 2mm strip &#8594; electron-beam welded &#8594; AWS EWTh-2' },
  { id: 'TWS-0010', batchNo: 'TWS-B2410', city: 'Bhubaneswar', manufacturer: 'Odisha Tungsten Refinery', sheetGrade: 'W Sheet 99.5% 6mm', application: 'Crucible Liner (Hindalco)', tungstenPercent: 99.5, thicknessMm: 6.0, investmentCr: 210, status: 'Delivered', priority: 'Medium', origin: 'Odisha Tungsten Bhubaneswar (OD)', destination: 'Hindalco Renukoot (UP)', shipDate: '2026-07-24', transitDays: 3, zone: 'East', remarks: 'Pure W sheet for Hindalco aluminium smelter crucible liner &#8594; 99.5% W &#8594; &#8377;210Cr for 7 tonnes &#8594; India &#8377;6,300Cr smelter W &#8594; Hindalco 2.1 MT Al &#8594; 6mm plate &#8594; 19.2 g/cc &#8594; 1800&#176;C service' },
  { id: 'TWS-0011', batchNo: 'TWS-B2411', city: 'Guwahati', manufacturer: 'Assam Tungsten Works', sheetGrade: 'W-Ni-Fe Sheet 4mm', application: 'Balance Weight (Indian Railways)', tungstenPercent: 92.5, thicknessMm: 4.0, investmentCr: 130, status: 'Delivered', priority: 'Medium', origin: 'Assam Tungsten Guwahati (AS)', destination: 'IRIEM Chennai (TN)', shipDate: '2026-07-25', transitDays: 4, zone: 'East', remarks: 'W-Ni-Fe heavy alloy sheet for Indian Railways Vande Bharat axle balance weight &#8594; 92.5% W &#8594; &#8377;130Cr for 12 tonnes &#8594; India &#8377;3,900Cr rail W &#8594; IR 400 Vande Bharat &#8594; 4mm plate &#8594; 17.5 g/cc &#8594; machined weight' },
  { id: 'TWS-0012', batchNo: 'TWS-B2412', city: 'Surat', manufacturer: 'Gujarat Tungsten Technologies', sheetGrade: 'W-Cu 75/25 Sheet 2mm', application: 'Power Electronics Base (Tata Power)', tungstenPercent: 75.0, thicknessMm: 2.0, investmentCr: 285, status: 'Delayed', priority: 'High', origin: 'Gujarat Tungsten Surat (GJ)', destination: 'Tata Power Mumbai (MH)', shipDate: '2026-07-11', transitDays: 8, zone: 'West', remarks: 'W-Cu 75/25 sheet for Tata Power HVDC IGBT base plate &#8594; 75% W &#8594; &#8377;285Cr for 10 tonnes &#8594; India &#8377;8,550Cr power W &#8594; monsoon delay &#8594; 2mm plate &#8594; 180 W/mK &#8594; CTE matched SiC' },
  { id: 'TWS-0013', batchNo: 'TWS-B2413', city: 'Noida', manufacturer: 'UP Tungsten Alloys', sheetGrade: 'W Sheet 99.8% 1mm', application: 'Sputtering Target (AVP)', tungstenPercent: 99.8, thicknessMm: 1.0, investmentCr: 390, status: 'Delivered', priority: 'High', origin: 'UP Tungsten Noida (UP)', destination: 'AVP Mumbai (MH)', shipDate: '2026-07-26', transitDays: 2, zone: 'North', remarks: 'High-purity W sputtering target sheet for AVP thin-film solar panel &#8594; 99.8% W &#8594; &#8377;390Cr for 5 tonnes &#8594; India &#8377;11,700Cr solar W &#8594; AVP 5 GW &#8594; 1mm bonded &#8594; 99.999% purity &#8594; magnetron grade' },
  { id: 'TWS-0014', batchNo: 'TWS-B2414', city: 'Bhopal', manufacturer: 'BHEL', sheetGrade: 'W Plate 99.7% 15mm', application: 'Steam Turbine Seal (BHEL)', tungstenPercent: 99.7, thicknessMm: 15.0, investmentCr: 560, status: 'Delivered', priority: 'Critical', origin: 'BHEL Bhopal (MP)', destination: 'BHEL Haridwar (UK)', shipDate: '2026-07-27', transitDays: 2, zone: 'North', remarks: 'Pure W thick plate for BHEL 800 MW steam turbine gland seal &#8594; 99.7% W &#8594; &#8377;560Cr for 8 tonnes &#8594; India &#8377;16,800Cr power W &#8594; BHEL 150 GW fleet &#8594; 15mm plate &#8594; 19.1 g/cc &#8594; 600&#176;C steam' }
]

const delayedSet = new Set(tungstenSheetRecords.filter(r => r.status === 'Delayed').map(r => r.id))

export default function TungstenSheetLogisticsView() {
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
    let data = tungstenSheetRecords
    if (search) data = data.filter(r => Object.values(r).some(v => String(v).toLowerCase().includes(search.toLowerCase())))
    Object.entries(filters).forEach(([k, vals]) => { if (vals.length) data = data.filter(r => vals.includes(String((r as any)[k]))) })
    return data
  }, [search, filters])

  const total = tungstenSheetRecords.length
  const delivered = tungstenSheetRecords.filter(r => r.status === 'Delivered').length
  const totalCr = tungstenSheetRecords.reduce((s: number, r) => s + r.investmentCr, 0)
  const avgW = +(tungstenSheetRecords.reduce((s: number, r) => s + r.tungstenPercent, 0) / total).toFixed(1)

  const manufacturers = [...new Set(tungstenSheetRecords.map(r => r.manufacturer))]
  const zones = [...new Set(tungstenSheetRecords.map(r => r.zone))]

  return (
    <div className="space-y-6">
      <PageHeader title="Tungsten Sheet Logistics" description="Indian tungsten sheet supply chain tracking across medical imaging, defence KE penetrator, nuclear fusion shield, semiconductor, aerospace and power sectors" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent><div className="text-2xl font-bold text-teal-600">{total}</div><div className="text-xs text-muted-foreground">Total Shipments</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-teal-600">{delivered}</div><div className="text-xs text-muted-foreground">Delivered</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-teal-600">&#8377;{totalCr.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground">Total Investment</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-teal-600">{avgW}%</div><div className="text-xs text-muted-foreground">Avg W Content</div></CardContent></Card>
      </div>

      <div className="flex gap-2 border-b">
        {tabs.map((t, i) => (<button key={t} className={`px-4 py-2 ${activeTab === i ? 'border-b-2 border-teal-600 text-teal-600 font-semibold' : 'text-muted-foreground'}`} onClick={() => setActiveTab(i)}>{t}</button>))}
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
        <div className="rounded-md border"><div className="max-h-96 overflow-auto"><table className="w-full text-sm"><thead className="sticky top-0 bg-background"><tr><th className="p-2 text-left">ID</th><th className="p-2 text-left">Batch</th><th className="p-2 text-left">Grade</th><th className="p-2 text-left">Application</th><th className="p-2 text-right">W%</th><th className="p-2 text-right">&#8377;Cr</th><th className="p-2 text-left">Status</th></tr></thead><tbody>{filtered.map(r => (<tr key={r.id} className={`border-t ${delayedSet.has(r.id) ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}><td className="p-2">{r.id}</td><td className="p-2">{r.batchNo}</td><td className="p-2">{r.sheetGrade}</td><td className="p-2">{r.application}</td><td className="p-2 text-right">{r.tungstenPercent}</td><td className="p-2 text-right">{r.investmentCr}</td><td className="p-2"><Badge variant={r.status === 'Delivered' ? 'default' : 'destructive'}>{r.status}</Badge></td></tr>))}</tbody></table></div></div>
      </div>)}

      {activeTab === 1 && (<div className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          {manufacturers.map(m => <Badge key={m} variant={filters.manufacturer?.includes(m) ? 'default' : 'outline'} className="cursor-pointer" onClick={() => toggleFilter('manufacturer', m)}>{m}</Badge>)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">By Manufacturer</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { m[r.manufacturer] = (m[r.manufacturer] || 0) + 1; return m }, {} as Record<string, number>)) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([m, c]) => (<div key={m} className="flex justify-between text-sm"><span>{m}</span><span className="font-medium">{c}</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Thickness Profile</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { const s = r.thicknessMm <= 1 ? 'Foil (0-1 mm)' : r.thicknessMm <= 3 ? 'Thin (1-3 mm)' : r.thicknessMm <= 6 ? 'Medium (3-6 mm)' : 'Thick (6+ mm)'; m[s] = (m[s] || 0) + 1; return m }, {} as Record<string, number>)) as [string, number][]).map(([k, c]) => (<div key={k} className="flex justify-between text-sm"><span>{k}</span><span className="font-medium">{c}</span></div>))}</div></CardContent></Card>
        </div>
        <div className="rounded-md border"><div className="max-h-96 overflow-auto"><table className="w-full text-sm"><thead className="sticky top-0 bg-background"><tr><th className="p-2 text-left">ID</th><th className="p-2 text-left">Manufacturer</th><th className="p-2 text-left">Grade</th><th className="p-2 text-left">Origin</th><th className="p-2 text-left">Destination</th><th className="p-2 text-right">Transit</th><th className="p-2 text-left">Zone</th></tr></thead><tbody>{filtered.map(r => (<tr key={r.id} className={`border-t ${delayedSet.has(r.id) ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}><td className="p-2">{r.id}</td><td className="p-2">{r.manufacturer}</td><td className="p-2">{r.sheetGrade}</td><td className="p-2">{r.origin}</td><td className="p-2">{r.destination}</td><td className="p-2 text-right">{r.transitDays}d</td><td className="p-2">{r.zone}</td></tr>))}</tbody></table></div></div>
      </div>)}

      {activeTab === 2 && (<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card><CardHeader><CardTitle className="text-sm">Investment by Application</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { m[r.application] = (m[r.application] || 0) + r.investmentCr; return m }, {} as Record<string, number>)) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 7).map(([a, v]) => (<div key={a} className="flex justify-between text-sm"><span>{a}</span><span className="font-medium">&#8377;{v}Cr</span></div>))}</div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Tungsten Purity Distribution</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { const n = r.tungstenPercent >= 99 ? 'Pure (99%+)' : r.tungstenPercent >= 90 ? 'High (90-99%)' : r.tungstenPercent >= 80 ? 'Medium (80-90%)' : 'Low (<80%)'; m[n] = (m[n] || 0) + 1; return m }, {} as Record<string, number>)) as [string, number][]).map(([k, c]) => (<div key={k} className="flex justify-between text-sm"><span>{k}</span><span className="font-medium">{c}</span></div>))}</div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Top Routes by Value</CardTitle></CardHeader><CardContent><div className="space-y-2">{filtered.sort((a, b) => b.investmentCr - a.investmentCr).slice(0, 7).map(r => (<div key={r.id} className="flex justify-between text-sm"><span>{r.origin.split('(')[0]} &#8594; {r.destination.split('(')[0]}</span><span className="font-medium">&#8377;{r.investmentCr}Cr</span></div>))}</div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">High-Purity W Sheets</CardTitle></CardHeader><CardContent><div className="space-y-2">{filtered.filter(r => r.tungstenPercent >= 95).sort((a, b) => b.investmentCr - a.investmentCr).map(r => (<div key={r.id} className="flex justify-between text-sm"><span>{r.sheetGrade} ({r.thicknessMm}mm)</span><span className="font-medium">&#8377;{r.investmentCr}Cr</span></div>))}</div></CardContent></Card>
      </div>)}

      {activeTab === 3 && (<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card><CardContent><div className="text-sm font-medium text-teal-600 mb-2">Medical X-ray W Target Demand</div><div className="text-xs text-muted-foreground">India CT scanner market at 12,000 units/yr, 95% depend on imported W rotary anode targets. Wipro GE, Philips India and Siemens Healthineers consuming 50 TPA high-purity W sheets. MIDHANI expanding to meet 30% domestic share by 2027 for Atmanirbhar medical imaging.</div></CardContent></Card>
        <Card><CardContent><div className="text-sm font-medium text-teal-600 mb-2">ITER Divertor W Plates</div><div className="text-xs text-muted-foreground">India contributing 20 divertor modules to ITER, each requiring 300 kg W-La2O3 ODS sheet. IGCAR and MIDHANI jointly developing 1mm rolled W-ODS sheet capability. Total ITER India W requirement at 6 tonnes, valued at &#8377;16,500Cr. First batch delivered July 2026.</div></CardContent></Card>
        <Card><CardContent><div className="text-sm font-medium text-teal-600 mb-2">Monsoon Disrupts HVDC Base Plate</div><div className="text-xs text-muted-foreground">TWS-B2412 W-Cu 75/25 sheet delayed 8 days due to Gujarat monsoon flooding on NH-48. Tata Power Mumbai HVDC converter station upgrade at risk. Recommend pre-positioning 15-tonne buffer at Vapi warehouse for Q3 monsoon corridor.</div></CardContent></Card>
        <Card><CardContent><div className="text-sm font-medium text-teal-600 mb-2">Defence W-Heavy Alloy Push</div><div className="text-xs text-muted-foreground">DRDO and Indian Army consuming 25 TPA W-Ni-Fe heavy alloy for kinetic energy penetrator and balance weights. New 500-tonne/yr press at MIDHANI commissioned July 2026 for defence-critical W alloy sheets. Army targeting 100% domestic sourcing by 2028.</div></CardContent></Card>
      </div>)}
    </div>
  )
}
"""

outpath = '/home/z/my-project/src/components/modules/tungsten-sheet-logistics-view.tsx'
with open(outpath, 'w') as f:
    f.write(content)
print(f"Written {len(content)} bytes to {outpath}")
