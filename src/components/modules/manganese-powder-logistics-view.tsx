'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { Axe } from 'lucide-react'

interface ManganesePowderRecord {
  id: string
  batchNo: string
  city: string
  manufacturer: string
  powderGrade: string
  application: string
  manganesePercent: number
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

const manganesePowderRecords: ManganesePowderRecord[] = [
  { id: 'MNP-0001', batchNo: 'MNP-B2401', city: 'Nagpur', manufacturer: 'Manganese Ore India', powderGrade: 'Electrolytic Mn 99.9% Flakes', application: 'Steel Deoxidizer (Tata Steel)', manganesePercent: 99.9, meshSize: 20, investmentCr: 480, status: 'Delivered', priority: 'Critical', origin: 'MOIL Nagpur (MH)', destination: 'Tata Steel Jamshedpur (JH)', shipDate: '2026-07-15', transitDays: 2, zone: 'West', remarks: 'Electrolytic Mn metal flakes for Tata Steel BOF deoxidizer &#8594; 99.9% Mn &#8594; &#8377;480Cr for 25 tonnes &#8594; India &#8377;14,400Cr steel Mn &#8594; Tata 35 MTPA &#8594; 20 mesh flakes &#8594; 1246&#176;C melt &#8594; Si-killed grade' },
  { id: 'MNP-0002', batchNo: 'MNP-B2402', city: 'Bhilai', manufacturer: 'SAIL', powderGrade: 'Fe-Mn 78/22 HC Ferro', application: 'Alloy Steel (SAIL Bhilai)', manganesePercent: 78.0, meshSize: 10, investmentCr: 350, status: 'Delivered', priority: 'High', origin: 'SAIL Bhilai (CG)', destination: 'SAIL Rourkela (OD)', shipDate: '2026-07-16', transitDays: 2, zone: 'East', remarks: 'High-C Fe-Mn 78/22 ferroalloy powder for SAIL rail steel alloying &#8594; 78% Mn &#8594; &#8377;350Cr for 40 tonnes &#8594; India &#8377;10,500Cr rail Mn &#8594; SAIL 20 MTPA rail &#8594; 10 mesh lump &#8594; 7% C max &#8594; P0.15 S0.03' },
  { id: 'MNP-0003', batchNo: 'MNP-B2403', city: 'Hyderabad', manufacturer: 'MIDHANI', powderGrade: 'Mn-Cu 85/15 Damping', application: 'Submarine Hull (Mazagon Dock)', manganesePercent: 85.0, meshSize: 60, investmentCr: 590, status: 'Delivered', priority: 'Critical', origin: 'MIDHANI Hyderabad (TG)', destination: 'Mazagon Dock Mumbai (MH)', shipDate: '2026-07-17', transitDays: 1, zone: 'South', remarks: 'Mn-Cu 85/15 high-damping alloy powder for Mazagon Dock Scorpene submarine hull &#8594; 85% Mn &#8594; &#8377;590Cr for 6 tonnes &#8594; India &#8377;17,700Cr defence Mn &#8594; MDL 6 submarines &#8594; 60 mesh &#8594; Sonar-transparent &#8594; Incrimalloy' },
  { id: 'MNP-0004', batchNo: 'MNP-B2404', city: 'Bengaluru', manufacturer: 'DRDO DMRL', powderGrade: 'Mn-12%Al TWIP Steel', application: 'Auto Crash (Mahindra)', manganesePercent: 88.0, meshSize: 45, investmentCr: 320, status: 'Delivered', priority: 'High', origin: 'DRDO DMRL Hyderabad (TG)', destination: 'Mahindra Chakan (MH)', shipDate: '2026-07-18', transitDays: 2, zone: 'South', remarks: 'Mn-12Al TWIP steel powder for Mahindra XUV crash zone 3D print &#8594; 88% Mn &#8594; &#8377;320Cr for 8 tonnes &#8594; India &#8377;9,600Cr auto Mn &#8594; Mahindra 500K SUVs &#8594; 45 mesh &#8594; 1000 MPa UTS &#8594; 60% elongation' },
  { id: 'MNP-0005', batchNo: 'MNP-B2405', city: 'Mumbai', manufacturer: 'Hindustan Copper', powderGrade: 'MnO2 92% Electrolytic', application: 'Dry Cell Battery (Panasonic)', manganesePercent: 58.8, meshSize: 200, investmentCr: 210, status: 'Delivered', priority: 'Medium', origin: 'HCL Mumbai (MH)', destination: 'Panasonic Baroda (GJ)', shipDate: '2026-07-19', transitDays: 1, zone: 'West', remarks: 'EMD MnO2 92% powder for Panasonic alkaline dry cell cathode &#8594; 58.8% Mn &#8594; &#8377;210Cr for 20 tonnes &#8594; India &#8377;6,300Cr battery Mn &#8594; Panasonic 500M cells/yr &#8594; 200 mesh &#8594; IEC 60086 &#8594; 1.5V AA' },
  { id: 'MNP-0006', batchNo: 'MNP-B2406', city: 'Kolkata', manufacturer: 'Shyam Metaliks', powderGrade: 'Si-Mn 65/17 Ferro', application: 'Spring Steel (JSW Steel)', manganesePercent: 65.0, meshSize: 15, investmentCr: 275, status: 'Delivered', priority: 'High', origin: 'Shyam Metaliks Kolkata (WB)', destination: 'JSW Vijayanagar (KA)', shipDate: '2026-07-20', transitDays: 2, zone: 'East', remarks: 'Si-Mn 65/17 ferroalloy powder for JSW automotive spring steel &#8594; 65% Mn &#8594; &#8377;275Cr for 30 tonnes &#8594; India &#8377;8,250Cr spring Mn &#8594; JSW 18 MTPA &#8594; 15 mesh &#8594; 60Si2Mn grade &#8594; 1200 MPa' },
  { id: 'MNP-0007', batchNo: 'MNP-B2407', city: 'Ahmedabad', manufacturer: 'Gujarat Mn Alloys', powderGrade: 'Mn 99.7% Electrolytic Flake', application: 'Al-Cu-Li Alloy (NAL)', manganesePercent: 99.7, meshSize: 30, investmentCr: 185, status: 'Delivered', priority: 'Medium', origin: 'Gujarat Mn Alloys Vadodara (GJ)', destination: 'NAL Bengaluru (KA)', shipDate: '2026-07-21', transitDays: 1, zone: 'West', remarks: 'High-purity Mn flakes for NAL Al-Cu-Li aerospace alloy &#8594; 99.7% Mn &#8594; &#8377;185Cr for 4 tonnes &#8594; India &#8377;5,550Cr aero Mn &#8594; NAL Tejas wing &#8594; 30 mesh &#8594; AA2050 &#8594; 0.3% Mn addition' },
  { id: 'MNP-0008', batchNo: 'MNP-B2408', city: 'Jaipur', manufacturer: 'Rajasthan Mn Industries', powderGrade: 'Mn-Si-Cr 60/20/15', application: 'Wear Plate (BHEL)', manganesePercent: 60.0, meshSize: 35, investmentCr: 340, status: 'Delivered', priority: 'High', origin: 'Rajasthan Mn Industries Jaipur (RJ)', destination: 'BHEL Bhopal (MP)', shipDate: '2026-07-22', transitDays: 2, zone: 'North', remarks: 'Mn-Si-Cr hardfacing alloy powder for BHEL coal mill wear plate &#8594; 60% Mn &#8594; &#8377;340Cr for 12 tonnes &#8594; India &#8377;10,200Cr power Mn &#8594; BHEL 150 GW &#8594; 35 mesh &#8594; 55 HRC overlay &#8594; PTA grade' },
  { id: 'MNP-0009', batchNo: 'MNP-B2409', city: 'Coimbatore', manufacturer: 'Tamil Nadu Mn Works', powderGrade: 'Mn-0.8%C Steel Shot', application: 'Shot Blasting (Larsen and Toubro)', manganesePercent: 99.2, meshSize: 40, investmentCr: 145, status: 'Delivered', priority: 'Medium', origin: 'Tamil Nadu Mn Works Coimbatore (TN)', destination: 'L&T Chennai (TN)', shipDate: '2026-07-23', transitDays: 1, zone: 'South', remarks: 'Mn-C steel shot powder for L&T surface shot blasting preparation &#8594; 99.2% Mn &#8594; &#8377;145Cr for 25 tonnes &#8594; India &#8377;4,350Cr surface Mn &#8594; L&T 500K m2/yr &#8594; 40 mesh &#8594; 55-60 HRC &#8594; Sa 2.5 grade' },
  { id: 'MNP-0010', batchNo: 'MNP-B2410', city: 'Bhubaneswar', manufacturer: 'Odisha Mn Ore Corp', powderGrade: 'MnO 78% Ferromanganese', application: 'Foundry (Kirloskar)', manganesePercent: 56.2, meshSize: 8, investmentCr: 230, status: 'Delivered', priority: 'High', origin: 'Odisha Mn Ore Corp Jajpur (OD)', destination: 'Kirloskar Pune (MH)', shipDate: '2026-07-24', transitDays: 2, zone: 'East', remarks: 'MnO 78% ore fines for Kirloskar pump casting ferro-manganese &#8594; 56.2% Mn &#8594; &#8377;230Cr for 50 tonnes &#8594; India &#8377;6,900Cr foundry Mn &#8594; Kirloskar 200K pumps &#8594; 8 mesh fines &#8594; 48% Mn HM &#8594; blast furnace' },
  { id: 'MNP-0011', batchNo: 'MNP-B2411', city: 'Guwahati', manufacturer: 'Assam Mn Mines', powderGrade: 'Mn 99.95% Ultra-Pure', application: 'Semiconductor Target (BEL)', manganesePercent: 99.95, meshSize: 325, investmentCr: 420, status: 'Delivered', priority: 'Critical', origin: 'Assam Mn Mines Guwahati (AS)', destination: 'BEL Ghaziabad (UP)', shipDate: '2026-07-25', transitDays: 4, zone: 'East', remarks: 'Ultra-pure Mn sputtering target powder for BEL GaN semiconductor &#8594; 99.95% Mn &#8594; &#8377;420Cr for 1 tonne &#8594; India &#8377;12,600Cr semi Mn &#8594; BEL 5 wafer fabs &#8594; 325 mesh &#8594; 4N purity &#8594; PVD target' },
  { id: 'MNP-0012', batchNo: 'MNP-B2412', city: 'Surat', manufacturer: 'Gujarat Mn Technologies', powderGrade: 'Mn-Ni 50/50 Superalloy', application: 'Gas Turbine (Wipro Aero)', manganesePercent: 50.0, meshSize: 55, investmentCr: 385, status: 'Delayed', priority: 'Critical', origin: 'Gujarat Mn Technologies Surat (GJ)', destination: 'Wipro Aero Bengaluru (KA)', shipDate: '2026-07-07', transitDays: 15, zone: 'West', remarks: 'Mn-Ni 50/50 superalloy powder for Wipro Aero GE F414 turbine seal &#8594; 50% Mn &#8594; &#8377;385Cr for 4 tonnes &#8594; monsoon delay &#8594; India &#8377;11,550Cr aero Mn &#8594; Wipro 200 engines/yr &#8594; 55 mesh &#8594; 950&#176;C &#8594; HIP grade' },
  { id: 'MNP-0013', batchNo: 'MNP-B2413', city: 'Noida', manufacturer: 'UP Mn Alloys', powderGrade: 'Mn-Fe 60/40 Soft Mag', application: 'Transformer Core (CG Power)', manganesePercent: 60.0, meshSize: 150, investmentCr: 265, status: 'Delivered', priority: 'Medium', origin: 'UP Mn Alloys Noida (UP)', destination: 'CG Power Mumbai (MH)', shipDate: '2026-07-26', transitDays: 1, zone: 'North', remarks: 'Mn-Fe 60/40 soft magnetic alloy powder for CG power transformer core &#8594; 60% Mn &#8594; &#8377;265Cr for 8 tonnes &#8594; India &#8377;7,950Cr electrical Mn &#8594; CG 500K transformers &#8594; 150 mesh &#8594; mu-r 25,000 &#8594; Sendust-type' },
  { id: 'MNP-0014', batchNo: 'MNP-B2414', city: 'Bhopal', manufacturer: 'BHEL', powderGrade: 'Mn-Cr 70/20 Wear Res', application: 'Rail Track (Indian Railways)', manganesePercent: 70.0, meshSize: 25, investmentCr: 540, status: 'Delivered', priority: 'Critical', origin: 'BHEL Bhopal (MP)', destination: 'IR Steel Plant Bhilai (CG)', shipDate: '2026-07-27', transitDays: 2, zone: 'North', remarks: 'Mn-Cr 70/20 Hadfield-type wear-resistant steel powder for Indian Railways track crossing &#8594; 70% Mn &#8594; &#8377;540Cr for 15 tonnes &#8594; India &#8377;16,200Cr rail Mn &#8594; IR 68K km track &#8594; 25 mesh &#8594; 350 HBW &#8594; austenitic' }
]

const delayedSet = new Set(manganesePowderRecords.filter(r => r.status === 'Delayed').map(r => r.id))

export default function ManganesePowderLogisticsView() {
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
    let data = manganesePowderRecords
    if (search) data = data.filter(r => Object.values(r).some(v => String(v).toLowerCase().includes(search.toLowerCase())))
    Object.entries(filters).forEach(([k, vals]) => { if (vals.length) data = data.filter(r => vals.includes(String((r as any)[k]))) })
    return data
  }, [search, filters])

  const total = manganesePowderRecords.length
  const delivered = manganesePowderRecords.filter(r => r.status === 'Delivered').length
  const totalCr = manganesePowderRecords.reduce((s: number, r) => s + r.investmentCr, 0)
  const avgMn = +(manganesePowderRecords.reduce((s: number, r) => s + r.manganesePercent, 0) / total).toFixed(1)

  const manufacturers = [...new Set(manganesePowderRecords.map(r => r.manufacturer))]
  const zones = [...new Set(manganesePowderRecords.map(r => r.zone))]

  return (
    <div className="space-y-6">
      <PageHeader title="Manganese Powder Logistics" description="Indian manganese powder supply chain tracking across steel deoxidation, submarine damping alloy, TWIP automotive crash, dry cell battery, ferroalloy, aerospace alloy, semiconductor sputtering and railway track sectors" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent><div className="text-2xl font-bold text-amber-600">{total}</div><div className="text-xs text-muted-foreground">Total Shipments</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-amber-600">{delivered}</div><div className="text-xs text-muted-foreground">Delivered</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-amber-600">&#8377;{totalCr.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground">Total Investment</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-amber-600">{avgMn}%</div><div className="text-xs text-muted-foreground">Avg Mn Content</div></CardContent></Card>
      </div>

      <div className="flex gap-2 border-b">
        {tabs.map((t, i) => (<button key={t} className={`px-4 py-2 ${activeTab === i ? 'border-b-2 border-amber-600 text-amber-600 font-semibold' : 'text-muted-foreground'}`} onClick={() => setActiveTab(i)}>{t}</button>))}
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
        <div className="rounded-md border"><div className="max-h-96 overflow-auto"><table className="w-full text-sm"><thead className="sticky top-0 bg-background"><tr><th className="p-2 text-left">ID</th><th className="p-2 text-left">Batch</th><th className="p-2 text-left">Grade</th><th className="p-2 text-left">Application</th><th className="p-2 text-right">Mn%</th><th className="p-2 text-right">&#8377;Cr</th><th className="p-2 text-left">Status</th></tr></thead><tbody>{filtered.map(r => (<tr key={r.id} className={`border-t ${delayedSet.has(r.id) ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}><td className="p-2">{r.id}</td><td className="p-2">{r.batchNo}</td><td className="p-2">{r.powderGrade}</td><td className="p-2">{r.application}</td><td className="p-2 text-right">{r.manganesePercent}</td><td className="p-2 text-right">{r.investmentCr}</td><td className="p-2"><Badge variant={r.status === 'Delivered' ? 'default' : 'destructive'}>{r.status}</Badge></td></tr>))}</tbody></table></div></div>
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
        <Card><CardHeader><CardTitle className="text-sm">Manganese Content Distribution</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { const n = r.manganesePercent >= 90 ? 'High Purity (90%+)' : r.manganesePercent >= 60 ? 'Alloy Grade (60-90%)' : r.manganesePercent >= 40 ? 'Low-Alloy (40-60%)' : 'Compound (<40%)'; m[n] = (m[n] || 0) + 1; return m }, {} as Record<string, number>)) as [string, number][]).map(([k, c]) => (<div key={k} className="flex justify-between text-sm"><span>{k}</span><span className="font-medium">{c}</span></div>))}</div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Top Routes by Value</CardTitle></CardHeader><CardContent><div className="space-y-2">{filtered.sort((a, b) => b.investmentCr - a.investmentCr).slice(0, 7).map(r => (<div key={r.id} className="flex justify-between text-sm"><span>{r.origin.split('(')[0]} &#8594; {r.destination.split('(')[0]}</span><span className="font-medium">&#8377;{r.investmentCr}Cr</span></div>))}</div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Defence and Nuclear Grade Powders</CardTitle></CardHeader><CardContent><div className="space-y-2">{filtered.filter(r => r.application.toLowerCase().includes('submarine') || r.application.toLowerCase().includes('defence') || r.application.toLowerCase().includes('radar') || r.application.toLowerCase().includes('semiconductor')).sort((a, b) => b.investmentCr - a.investmentCr).map(r => (<div key={r.id} className="flex justify-between text-sm"><span>{r.powderGrade} ({r.meshSize} mesh)</span><span className="font-medium">&#8377;{r.investmentCr}Cr</span></div>))}</div></CardContent></Card>
      </div>)}

      {activeTab === 3 && (<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card><CardContent><div className="text-sm font-medium text-amber-600 mb-2">India Manganese Reserves and Mining</div><div className="text-xs text-muted-foreground">India holds 5th largest Mn ore reserves globally at 150 MT, with MOIL (Manganese Ore India Ltd) operating 11 mines across MP, MH and OD. Domestic production at 2.5 MTPA against 8 MTPA demand, requiring 68% import from South Africa and Australia. Government targeting 40% self-sufficiency by 2030 through deep-sea mining and new mine expansion.</div></CardContent></Card>
        <Card><CardContent><div className="text-sm font-medium text-amber-600 mb-2">TWIP Steel for Auto Safety</div><div className="text-xs text-muted-foreground">DRDO DMRL developing Mn-12Al TWIP steel for Indian automotive crash zones, offering 2x energy absorption vs conventional AHSS. Mahindra and Tata piloting TWIP components for SUV and sedan B-pillar. India consuming 15 TPA Mn for AHSS. TWIP adoption could reach 50 TPA by 2028 as Bharat NCAP 5-star becomes mandatory.</div></CardContent></Card>
        <Card><CardContent><div className="text-sm font-medium text-amber-600 mb-2">Monsoon Disrupts Superalloy Supply</div><div className="text-xs text-muted-foreground">MNP-B2412 Mn-Ni 50/50 superalloy powder for Wipro Aero GE F414 turbine seal delayed 15 days due to Gujarat monsoon flooding. Wipro Aero engine MRO line at risk &#8212; 200 engines per year. India consuming 8 TPA Mn for aerospace superalloys. Recommend pre-positioning 3-tonne buffer at Bengaluru warehouse ahead of monsoon season.</div></CardContent></Card>
        <Card><CardContent><div className="text-sm font-medium text-amber-600 mb-2">Submarine Damping Alloy Programme</div><div className="text-xs text-muted-foreground">Mazagon Dock and MDL consuming 10 TPA Mn-Cu 85/15 high-damping Incrimalloy powder for Scorpene and Kalvari-class submarine hull sonar-damping tiles. India building 6 more submarines under Project-75I. DRDO developing Mn-Cu-Fe-Ni quaternary damping alloy with 3x loss factor. MIDHANI scaling to 20 TPA Mn-Cu powder production by 2028.</div></CardContent></Card>
      </div>)}
    </div>
  )
}
