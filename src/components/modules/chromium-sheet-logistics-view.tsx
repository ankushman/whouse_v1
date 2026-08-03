'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { Hexagon } from 'lucide-react'

interface ChromiumSheetRecord {
  id: string
  batchNo: string
  city: string
  manufacturer: string
  sheetGrade: string
  application: string
  chromiumPercent: number
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

const chromiumSheetRecords: ChromiumSheetRecord[] = [
  { id: 'CRS-0001', batchNo: 'CRS-B2401', city: 'Mumbai', manufacturer: 'SAIL', sheetGrade: 'AISI 430 Ba Finish', application: 'Kitchen Appliance (Godrej)', chromiumPercent: 16.0, thicknessMm: 0.8, investmentCr: 185, status: 'Delivered', priority: 'Medium', origin: 'SAIL Salem (TN)', destination: 'Godrej Mumbai (MH)', shipDate: '2026-07-15', transitDays: 2, zone: 'East', remarks: 'AISI 430 stainless sheet for Godrej refrigerator liner \u2192 16% Cr \u2192 \u20b9185Cr for 15 tonnes \u2192 India \u20b94,625Cr appliance Cr \u2192 Godrej 2M appliances/yr \u2192 0.8mm BA \u2192 180 grit finish \u2192 deep-draw grade' },
  { id: 'CRS-0002', batchNo: 'CRS-B2402', city: 'Bengaluru', manufacturer: 'Jindal Stainless', sheetGrade: 'AISI 304 2B Coil', application: 'Food Processing (ITC)', chromiumPercent: 18.5, thicknessMm: 1.5, investmentCr: 260, status: 'Delivered', priority: 'High', origin: 'Jindal Hisar (HR)', destination: 'ITC Bengaluru (KA)', shipDate: '2026-07-16', transitDays: 3, zone: 'North', remarks: '304 2B coil for ITC food processing conveyor \u2192 18.5% Cr \u2192 \u20b9260Cr for 20 tonnes \u2192 India \u20b96,500Cr food Cr \u2192 ITC 50 factories \u2192 1.5mm 2B \u2192 FSSAI grade \u2192 10 yr corrosion' },
  { id: 'CRS-0003', batchNo: 'CRS-B2403', city: 'Hyderabad', manufacturer: 'MIDHANI', sheetGrade: 'Inconel 625 Sheet 3mm', application: 'Aero Engine Casing (HAL)', chromiumPercent: 21.0, thicknessMm: 3.0, investmentCr: 520, status: 'Delivered', priority: 'Critical', origin: 'MIDHANI Hyderabad (TG)', destination: 'HAL Koraput (OD)', shipDate: '2026-07-17', transitDays: 2, zone: 'South', remarks: 'IN625 sheet for HAL Su-30MKI engine outer casing \u2192 21% Cr \u2192 \u20b9520Cr for 8 tonnes \u2192 India \u20b915,600Cr aero Cr \u2192 HAL 220 Su-30 \u2192 3mm hot rolled \u2192 980\u00b0C service \u2192 AMS 5599' },
  { id: 'CRS-0004', batchNo: 'CRS-B2404', city: 'Pune', manufacturer: 'Bharat Forge', sheetGrade: 'AISI 410 HT 1mm', application: 'Turbine Blade (BHEL)', chromiumPercent: 12.5, thicknessMm: 1.0, investmentCr: 340, status: 'Delivered', priority: 'Critical', origin: 'Bharat Forge Pune (MH)', destination: 'BHEL Hyderabad (TG)', shipDate: '2026-07-18', transitDays: 1, zone: 'West', remarks: '410 martensitic sheet for BHEL 800 MW LP blade liner \u2192 12.5% Cr \u2192 \u20b9340Cr for 12 tonnes \u2192 India \u20b98,500Cr power Cr \u2192 BHEL 150 GW \u2192 1mm HT \u2192 600\u00b0C steam \u2192 HRC 38' },
  { id: 'CRS-0005', batchNo: 'CRS-B2405', city: 'Kolkata', manufacturer: 'Indian Navy', sheetGrade: 'AISI 316L 6mm Plate', application: 'Submarine Hull (Naval Dock)', chromiumPercent: 17.0, thicknessMm: 6.0, investmentCr: 680, status: 'Delivered', priority: 'Critical', origin: 'SAIL Rourkela (OD)', destination: 'Naval Dockyard Visakhapatnam (AP)', shipDate: '2026-07-19', transitDays: 3, zone: 'East', remarks: '316L plate for INS Kalvari pressure hull cladding \u2192 17% Cr \u2192 \u20b9680Cr for 25 tonnes \u2192 India \u20b917,000Cr naval Cr \u2192 Navy 16 subs \u2192 6mm plate \u2192 NACE MR0175 \u2192 deep sea rated' },
  { id: 'CRS-0006', batchNo: 'CRS-B2406', city: 'Ahmedabad', manufacturer: 'Reliance Petrochemical', sheetGrade: '310S Cr Plate 10mm', application: 'Reformer Tube (Reliance)', chromiumPercent: 25.0, thicknessMm: 10.0, investmentCr: 450, status: 'Delivered', priority: 'Critical', origin: 'Jindal Hisar (HR)', destination: 'Reliance Jamnagar (GJ)', shipDate: '2026-07-20', transitDays: 2, zone: 'West', remarks: '310S plate for Reliance reformer radiant shield \u2192 25% Cr \u2192 \u20b9450Cr for 18 tonnes \u2192 India \u20b911,250Cr refinery Cr \u2192 Reliance 35 refineries \u2192 10mm plate \u2192 1050\u00b0C \u2192 creep resistant' },
  { id: 'CRS-0007', batchNo: 'CRS-B2407', city: 'Chennai', manufacturer: 'IGCAR', sheetGrade: 'D9 Cladding Sheet 2mm', application: 'Nuclear Fuel Clad (IGCAR)', chromiumPercent: 13.5, thicknessMm: 2.0, investmentCr: 390, status: 'Delivered', priority: 'Critical', origin: 'IGCAR Kalpakkam (TN)', destination: 'NPCIL Kalpakkam (TN)', shipDate: '2026-07-21', transitDays: 0, zone: 'South', remarks: 'D9 (Fe-13.5Cr-2Mo-Ti) cladding for PFBR MOX fuel pin \u2192 13.5% Cr \u2192 \u20b9390Cr for 14 tonnes \u2192 India \u20b99,750Cr nuclear Cr \u2192 IGCAR 500 MW FBR \u2192 2mm sheet \u2192 fast neutron dose \u2192 150 dpa rated' },
  { id: 'CRS-0008', batchNo: 'CRS-B2408', city: 'Mumbai', manufacturer: 'Shyam Metalics', sheetGrade: 'AISI 420 HR 2.5mm', application: 'Surgical Blade (Surgiwear)', chromiumPercent: 13.0, thicknessMm: 2.5, investmentCr: 95, status: 'Delivered', priority: 'Medium', origin: 'Shyam Metalics Raipur (CG)', destination: 'Surgiwear Allahabad (UP)', shipDate: '2026-07-22', transitDays: 2, zone: 'East', remarks: '420 surgical stainless for Surgiwear disposable scalpel blade \u2192 13% Cr \u2192 \u20b995Cr for 4 tonnes \u2192 India \u20b92,375Cr medical Cr \u2192 Surgiwear 200M blades/yr \u2192 2.5mm HR \u2192 HRC 52 edge \u2192 ISO 7153' },
  { id: 'CRS-0009', batchNo: 'CRS-B2409', city: 'Jaipur', manufacturer: 'Rajasthan Steel', sheetGrade: 'AISI 201 CR 0.5mm', application: 'Architectural Panel (L&T)', chromiumPercent: 16.5, thicknessMm: 0.5, investmentCr: 125, status: 'Delivered', priority: 'Low', origin: 'Rajasthan Steel Jaipur (RJ)', destination: 'L&T Delhi (DL)', shipDate: '2026-07-23', transitDays: 1, zone: 'North', remarks: '201 Cr coil for L&T Metro station facade panel \u2192 16.5% Cr \u2192 \u20b9125Cr for 8 tonnes \u2192 India \u20b93,125Cr arch Cr \u2192 L&T 12 metro lines \u2192 0.5mm mirror \u2192 2B finish \u2192 20 yr exterior' },
  { id: 'CRS-0010', batchNo: 'CRS-B2410', city: 'Coimbatore', manufacturer: 'Tamil Nadu Steel Corp', sheetGrade: 'AISI 304L 4mm Plate', application: 'Pharma Reactor (Sun Pharma)', chromiumPercent: 18.5, thicknessMm: 4.0, investmentCr: 210, status: 'Delivered', priority: 'High', origin: 'Jindal Salem (TN)', destination: 'Sun Pharma Mohali (PB)', shipDate: '2026-07-24', transitDays: 2, zone: 'South', remarks: '304L plate for Sun Pharma API reactor vessel \u2192 18.5% Cr \u2192 \u20b9210Cr for 16 tonnes \u2192 India \u20b95,250Cr pharma Cr \u2192 Sun Pharma 50 reactors \u2192 4mm plate \u2192 USP Class VI \u2192 passivated' },
  { id: 'CRS-0011', batchNo: 'CRS-B2411', city: 'Bhubaneswar', manufacturer: 'Odisha Steel Industries', sheetGrade: 'AISI 409 0.4mm Foil', application: 'Automotive Exhaust (Tata Motors)', chromiumPercent: 11.5, thicknessMm: 0.4, investmentCr: 155, status: 'Delivered', priority: 'High', origin: 'Odisha Steel Bhubaneswar (OD)', destination: 'Tata Motors Pune (MH)', shipDate: '2026-07-25', transitDays: 3, zone: 'East', remarks: '409 ferritic foil for Tata Nexon BS-VI muffler shell \u2192 11.5% Cr \u2192 \u20b9155Cr for 10 tonnes \u2192 India \u20b93,875Cr auto Cr \u2192 Tata 500K vehicles \u2192 0.4mm foil \u2192 800\u00b0C exhaust \u2192 10 yr life' },
  { id: 'CRS-0012', batchNo: 'CRS-B2412', city: 'Guwahati', manufacturer: 'Assam Steel Works', sheetGrade: 'AISI 321 8mm Plate', application: 'Chemical Vessel (ONGC)', chromiumPercent: 18.0, thicknessMm: 8.0, investmentCr: 275, status: 'Delayed', priority: 'High', origin: 'Assam Steel Guwahati (AS)', destination: 'ONGC Jorhat (AS)', shipDate: '2026-07-11', transitDays: 9, zone: 'East', remarks: '321 stabilised plate for ONGC H2S separator vessel \u2192 18% Cr \u2192 \u20b9275Cr for 20 tonnes \u2192 India \u20b96,875Cr ONGC Cr \u2192 monsoon delay \u2192 8mm plate \u2192 Ti-stabilised \u2192 650\u00b0C service \u2192 HIC resistant' },
  { id: 'CRS-0013', batchNo: 'CRS-B2413', city: 'Surat', manufacturer: 'Gujarat Steel Tech', sheetGrade: '2205 Duplex 5mm', application: 'Desalination Plant (Nikkai)', chromiumPercent: 22.0, thicknessMm: 5.0, investmentCr: 380, status: 'Delivered', priority: 'Critical', origin: 'Jindal Hisar (HR)', destination: 'Nikkai Minjur (TN)', shipDate: '2026-07-26', transitDays: 3, zone: 'West', remarks: '2205 duplex plate for Nikkai 100 MLD desalination SWRO pressure vessel \u2192 22% Cr \u2192 \u20b9380Cr for 15 tonnes \u2192 India \u20b99,500Cr desal Cr \u2192 Nikkai 500 MLD \u2192 5mm plate \u2192 PREN 35 \u2192 pitting resistant' },
  { id: 'CRS-0014', batchNo: 'CRS-B2414', city: 'Noida', manufacturer: 'UP Steel Alloys', sheetGrade: 'AISI 347 3mm Plate', application: 'Boiler Tube (BHEL)', chromiumPercent: 18.0, thicknessMm: 3.0, investmentCr: 295, status: 'Delivered', priority: 'High', origin: 'SAIL Rourkela (OD)', destination: 'BHEL Haridwar (UK)', shipDate: '2026-07-27', transitDays: 2, zone: 'North', remarks: '347 Nb-stabilised plate for BHEL 660 MW supercritical boiler \u2192 18% Cr \u2192 \u20b9295Cr for 12 tonnes \u2192 India \u20b97,375Cr power Cr \u2192 BHEL 150 GW \u2192 3mm plate \u2192 700\u00b0C steam \u2192 SA-240 347H' }
]

const delayedSet = new Set(chromiumSheetRecords.filter(r => r.status === 'Delayed').map(r => r.id))

export default function ChromiumSheetLogisticsView() {
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
    let data = chromiumSheetRecords
    if (search) data = data.filter(r => Object.values(r).some(v => String(v).toLowerCase().includes(search.toLowerCase())))
    Object.entries(filters).forEach(([k, vals]) => { if (vals.length) data = data.filter(r => vals.includes(String((r as any)[k]))) })
    return data
  }, [search, filters])

  const total = chromiumSheetRecords.length
  const delivered = chromiumSheetRecords.filter(r => r.status === 'Delivered').length
  const totalCr = chromiumSheetRecords.reduce((s: number, r) => s + r.investmentCr, 0)
  const avgCr = +(chromiumSheetRecords.reduce((s: number, r) => s + r.chromiumPercent, 0) / total).toFixed(1)

  const manufacturers = [...new Set(chromiumSheetRecords.map(r => r.manufacturer))]
  const zones = [...new Set(chromiumSheetRecords.map(r => r.zone))]

  return (
    <div className="space-y-6">
      <PageHeader title="Chromium Sheet Logistics" description="Indian chromium stainless and alloy sheet supply chain tracking across naval, aerospace, nuclear, refinery, desalination, automotive and food sectors" />
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
        <div className="rounded-md border"><div className="max-h-96 overflow-auto"><table className="w-full text-sm"><thead className="sticky top-0 bg-background"><tr><th className="p-2 text-left">ID</th><th className="p-2 text-left">Batch</th><th className="p-2 text-left">Grade</th><th className="p-2 text-left">Application</th><th className="p-2 text-right">Cr%</th><th className="p-2 text-right">&#8377;Cr</th><th className="p-2 text-left">Status</th></tr></thead><tbody>{filtered.map(r => (<tr key={r.id} className={`border-t ${delayedSet.has(r.id) ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}><td className="p-2">{r.id}</td><td className="p-2">{r.batchNo}</td><td className="p-2">{r.sheetGrade}</td><td className="p-2">{r.application}</td><td className="p-2 text-right">{r.chromiumPercent}</td><td className="p-2 text-right">{r.investmentCr}</td><td className="p-2"><Badge variant={r.status === 'Delivered' ? 'default' : 'destructive'}>{r.status}</Badge></td></tr>))}</tbody></table></div></div>
      </div>)}

      {activeTab === 1 && (<div className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          {manufacturers.map(m => <Badge key={m} variant={filters.manufacturer?.includes(m) ? 'default' : 'outline'} className="cursor-pointer" onClick={() => toggleFilter('manufacturer', m)}>{m}</Badge>)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">By Manufacturer</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { m[r.manufacturer] = (m[r.manufacturer] || 0) + 1; return m }, {} as Record<string, number>)) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([m, c]) => (<div key={m} className="flex justify-between text-sm"><span>{m}</span><span className="font-medium">{c}</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Thickness Range</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { const t = r.thicknessMm < 1 ? 'Foil (<1mm)' : r.thicknessMm < 3 ? 'Sheet (1-3mm)' : r.thicknessMm < 6 ? 'Plate (3-6mm)' : 'Heavy Plate (>6mm)'; m[t] = (m[t] || 0) + 1; return m }, {} as Record<string, number>)) as [string, number][]).map(([k, c]) => (<div key={k} className="flex justify-between text-sm"><span>{k}</span><span className="font-medium">{c}</span></div>))}</div></CardContent></Card>
        </div>
        <div className="rounded-md border"><div className="max-h-96 overflow-auto"><table className="w-full text-sm"><thead className="sticky top-0 bg-background"><tr><th className="p-2 text-left">ID</th><th className="p-2 text-left">Manufacturer</th><th className="p-2 text-left">Grade</th><th className="p-2 text-left">Origin</th><th className="p-2 text-left">Destination</th><th className="p-2 text-right">Transit</th><th className="p-2 text-left">Zone</th></tr></thead><tbody>{filtered.map(r => (<tr key={r.id} className={`border-t ${delayedSet.has(r.id) ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}><td className="p-2">{r.id}</td><td className="p-2">{r.manufacturer}</td><td className="p-2">{r.sheetGrade}</td><td className="p-2">{r.origin}</td><td className="p-2">{r.destination}</td><td className="p-2 text-right">{r.transitDays}d</td><td className="p-2">{r.zone}</td></tr>))}</tbody></table></div></div>
      </div>)}

      {activeTab === 2 && (<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card><CardHeader><CardTitle className="text-sm">Investment by Application</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { m[r.application] = (m[r.application] || 0) + r.investmentCr; return m }, {} as Record<string, number>)) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 7).map(([a, v]) => (<div key={a} className="flex justify-between text-sm"><span>{a}</span><span className="font-medium">&#8377;{v}Cr</span></div>))}</div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Cr Content Distribution</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { const c = r.chromiumPercent < 14 ? 'Low (<14%)' : r.chromiumPercent < 18 ? 'Medium (14-18%)' : r.chromiumPercent < 22 ? 'High (18-22%)' : 'Super-High (22%+)'; m[c] = (m[c] || 0) + 1; return m }, {} as Record<string, number>)) as [string, number][]).map(([k, c]) => (<div key={k} className="flex justify-between text-sm"><span>{k}</span><span className="font-medium">{c}</span></div>))}</div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Top Routes by Value</CardTitle></CardHeader><CardContent><div className="space-y-2">{filtered.sort((a, b) => b.investmentCr - a.investmentCr).slice(0, 7).map(r => (<div key={r.id} className="flex justify-between text-sm"><span>{r.origin.split('(')[0]} &#8594; {r.destination.split('(')[0]}</span><span className="font-medium">&#8377;{r.investmentCr}Cr</span></div>))}</div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">High-Temp Alloys (20%+ Cr)</CardTitle></CardHeader><CardContent><div className="space-y-2">{filtered.filter(r => r.chromiumPercent > 20).sort((a, b) => b.investmentCr - a.investmentCr).map(r => (<div key={r.id} className="flex justify-between text-sm"><span>{r.sheetGrade} ({r.chromiumPercent}%)</span><span className="font-medium">&#8377;{r.investmentCr}Cr</span></div>))}</div></CardContent></Card>
      </div>)}

      {activeTab === 3 && (<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card><CardContent><div className="text-sm font-medium text-indigo-600 mb-2">Naval Stainless Steel Growth</div><div className="text-xs text-muted-foreground">Indian Navy submarine programme consuming 500 TPA high-grade stainless (316L, 321, 347). SAIL Rourkela is sole qualified domestic supplier for naval plate. Navy targeting 200 warships by 2035, with P75I Scorpenes requiring 50 TPA alone.</div></CardContent></Card>
        <Card><CardContent><div className="text-sm font-medium text-indigo-600 mb-2">Desalination Duplex Demand</div><div className="text-xs text-muted-foreground">India desalination capacity growing at 25% CAGR to reach 5,000 MLD by 2030. 2205 duplex and 2507 super-duplex stainless demand at 150 TPA. PREN 35+ grades critical for SWRO high-chloride environments in Tamil Nadu and Gujarat plants.</div></CardContent></Card>
        <Card><CardContent><div className="text-sm font-medium text-indigo-600 mb-2">Monsoon Delays ONGC Vessel</div><div className="text-xs text-muted-foreground">CRS-B2412 AISI 321 plate for ONGC H2S separator delayed 9 days due to Assam monsoon. ONGC Jorhat refinery expansion at risk. Recommend pre-stocking Guwahati warehouse for all East-India heavy plate movements during July-September.</div></CardContent></Card>
        <Card><CardContent><div className="text-sm font-medium text-indigo-600 mb-2">Automotive Exhaust 409 Foil</div><div className="text-xs text-muted-foreground">BS-VI emission norms driving 409/409Cb ferritic stainless foil demand at 40 TPA for automotive muffler shells. Jindal Stainless and SAIL Salem expanding 0.3-0.5mm foil capacity. Tata, Maruti and Hyundai consuming 95% of output.</div></CardContent></Card>
      </div>)}
    </div>
  )
}
