'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { Target } from 'lucide-react'

interface IronPowderRecord {
  id: string
  batchNo: string
  city: string
  manufacturer: string
  powderGrade: string
  application: string
  ironPercent: number
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

const ironPowderRecords: IronPowderRecord[] = [
  { id: 'IPW-0001', batchNo: 'IPW-B2401', city: 'Jamshedpur', manufacturer: 'Tata Steel', powderGrade: 'Pure Fe 99.9% Water Atomized', application: 'PM Structural (Bajaj Auto)', ironPercent: 99.9, meshSize: 100, investmentCr: 340, status: 'Delivered', priority: 'High', origin: 'Tata Steel Jamshedpur (JH)', destination: 'Bajaj Auto Pune (MH)', shipDate: '2026-07-15', transitDays: 2, zone: 'East', remarks: 'Pure Fe water-atomized powder for Bajaj auto engine sprocket PM &#8594; 99.9% Fe &#8594; &#8377;340Cr for 20 tonnes &#8594; India &#8377;10,200Cr auto PM &#8594; Bajaj 10M engines/yr &#8594; 100 mesh &#8594; 6.8 g/cc green &#8594; 550 MPa sintered' },
  { id: 'IPW-0002', batchNo: 'IPW-B2402', city: 'Bhilai', manufacturer: 'SAIL', powderGrade: 'Fe-2%Ni-0.5%C Distalloy', application: 'Gear Sprocket (Mahindra)', ironPercent: 97.5, meshSize: 80, investmentCr: 280, status: 'Delivered', priority: 'High', origin: 'SAIL Bhilai (CG)', destination: 'Mahindra Nashik (MH)', shipDate: '2026-07-16', transitDays: 2, zone: 'East', remarks: 'Fe-2Ni-0.5C diffusion-alloyed powder for Mahindra transmission gear &#8594; 97.5% Fe &#8594; &#8377;280Cr for 15 tonnes &#8594; India &#8377;8,400Cr auto PM &#8594; Mahindra 500K gear sets &#8594; 80 mesh &#8594; 7.0 g/cc &#8594; 650 MPa' },
  { id: 'IPW-0003', batchNo: 'IPW-B2403', city: 'Hyderabad', manufacturer: 'MIDHANI', powderGrade: 'Fe-Cr-Al 23/5 Kanthal', application: 'Heating Element (Havells)', ironPercent: 72.0, meshSize: 60, investmentCr: 190, status: 'Delivered', priority: 'Medium', origin: 'MIDHANI Hyderabad (TG)', destination: 'Havells Noida (UP)', shipDate: '2026-07-17', transitDays: 1, zone: 'South', remarks: 'Fe-Cr-Al Kanthal A1 powder for Havells industrial heater element PM &#8594; 72% Fe &#8594; &#8377;190Cr for 8 tonnes &#8594; India &#8377;5,700Cr heater Fe &#8594; Havells 50M heaters/yr &#8594; 60 mesh &#8594; 1400&#176;C service &#8594; 1.45 ohm-mm2/m' },
  { id: 'IPW-0004', batchNo: 'IPW-B2404', city: 'Bengaluru', manufacturer: 'DRDO DMRL', powderGrade: 'Fe-14Cr-2W ODS Ferritic', application: 'Nuclear Cladding (IGCAR)', ironPercent: 84.0, meshSize: 45, investmentCr: 620, status: 'Delivered', priority: 'Critical', origin: 'DRDO DMRL Hyderabad (TG)', destination: 'IGCAR Kalpakkam (TN)', shipDate: '2026-07-18', transitDays: 1, zone: 'South', remarks: 'Fe-14Cr-2W ODS ferritic steel MA956 powder for IGCAR PFBR fast reactor cladding &#8594; 84% Fe &#8594; &#8377;620Cr for 5 tonnes &#8594; India &#8377;18,600Cr nuclear Fe &#8594; IGCAR 500 MW &#8594; 45 mesh &#8594; 750&#176;C creep &#8594; HIP+extrude' },
  { id: 'IPW-0005', batchNo: 'IPW-B2405', city: 'Kolkata', manufacturer: 'Hindustan Steel', powderGrade: 'Fe-3%Si M-4 Electrical', application: 'Motor Core (Crompton Greaves)', ironPercent: 97.0, meshSize: 40, investmentCr: 410, status: 'Delivered', priority: 'High', origin: 'Hindustan Steel Durgapur (WB)', destination: 'CG Power Mumbai (MH)', shipDate: '2026-07-19', transitDays: 2, zone: 'East', remarks: 'Fe-3Si M-4 electrical steel powder for CG motor stator core SMC &#8594; 97% Fe &#8594; &#8377;410Cr for 25 tonnes &#8594; India &#8377;12,300Cr motor Fe &#8594; CG 500K motors/yr &#8594; 40 mesh &#8594; 1.8 T saturation &#8594; 3.2 W/kg loss' },
  { id: 'IPW-0006', batchNo: 'IPW-B2406', city: 'Pune', manufacturer: 'Bharat Forge', powderGrade: 'Fe-0.6%C Forged Preform', application: 'Connecting Rod (Tata Motors)', ironPercent: 99.4, meshSize: 200, investmentCr: 175, status: 'Delivered', priority: 'Medium', origin: 'Bharat Forge Pune (MH)', destination: 'Tata Motors Pune (MH)', shipDate: '2026-07-20', transitDays: 1, zone: 'West', remarks: 'High-purity Fe-0.6C powder for Tata Motors connecting rod PM forging &#8594; 99.4% Fe &#8594; &#8377;175Cr for 12 tonnes &#8594; India &#8377;5,250Cr auto Fe &#8594; Tata 800K engines &#8594; 200 mesh &#8594; 7.2 g/cc density &#8594; 750 MPa UTS' },
  { id: 'IPW-0007', batchNo: 'IPW-B2407', city: 'Ahmedabad', manufacturer: 'Gujarat Iron Powders', powderGrade: 'Sponge Fe 98.5% Reduced', application: 'Welding Electrode (Ador Welding)', ironPercent: 98.5, meshSize: 70, investmentCr: 135, status: 'Delivered', priority: 'Medium', origin: 'Gujarat Iron Powders Rajkot (GJ)', destination: 'Ador Welding Mumbai (MH)', shipDate: '2026-07-21', transitDays: 1, zone: 'West', remarks: 'Sponge iron powder for Ador E6013 welding electrode flux coating binder &#8594; 98.5% Fe &#8594; &#8377;135Cr for 30 tonnes &#8594; India &#8377;4,050Cr welding Fe &#8594; Ador 100M electrodes/yr &#8594; 70 mesh &#8594; hydrogen-annealed &#8594; E6013 AWS' },
  { id: 'IPW-0008', batchNo: 'IPW-B2408', city: 'Jaipur', manufacturer: 'Rajasthan Iron Alloys', powderGrade: 'Fe-50%Ni Permalloy', application: 'Current Transformer (ABB)', ironPercent: 50.0, meshSize: 150, investmentCr: 295, status: 'Delivered', priority: 'High', origin: 'Rajasthan Iron Alloys Jaipur (RJ)', destination: 'ABB Vadodara (GJ)', shipDate: '2026-07-22', transitDays: 2, zone: 'North', remarks: 'Fe-50Ni Permalloy powder for ABB current transformer soft magnetic core &#8594; 50% Fe &#8594; &#8377;295Cr for 6 tonnes &#8594; India &#8377;8,850Cr electrical Fe &#8594; ABB 200K CTs &#8594; 150 mesh &#8594; mu-r 50,000 &#8594; 0.5 T saturation' },
  { id: 'IPW-0009', batchNo: 'IPW-B2409', city: 'Coimbatore', manufacturer: 'Tamil Nadu Iron Works', powderGrade: 'Fe-P-Cu 98% Structural', application: 'Bearing Cage (NRB Bearings)', ironPercent: 98.0, meshSize: 90, investmentCr: 220, status: 'Delivered', priority: 'Medium', origin: 'Tamil Nadu Iron Works Coimbatore (TN)', destination: 'NRB Bearings Pune (MH)', shipDate: '2026-07-23', transitDays: 2, zone: 'South', remarks: 'Fe-P-Cu structural steel powder for NRB bearing cage and bush PM &#8594; 98% Fe &#8594; &#8377;220Cr for 18 tonnes &#8594; India &#8377;6,600Cr bearing Fe &#8594; NRB 100M bearings &#8594; 90 mesh &#8594; 6.9 g/cc &#8594; 580 MPa' },
  { id: 'IPW-0010', batchNo: 'IPW-B2410', city: 'Bhubaneswar', manufacturer: 'Odisha Iron Corporation', powderGrade: 'Fe 99.95% Carbonyl', application: 'EMI Shielding (BEL)', ironPercent: 99.95, meshSize: 325, investmentCr: 380, status: 'Delivered', priority: 'Critical', origin: 'Odisha Iron Corp Jajpur (OD)', destination: 'BEL Bengaluru (KA)', shipDate: '2026-07-24', transitDays: 2, zone: 'East', remarks: 'Carbonyl iron powder for BEL radar EMI shielding absorber coating &#8594; 99.95% Fe &#8594; &#8377;380Cr for 4 tonnes &#8594; India &#8377;11,400Cr defence Fe &#8594; BEL 100+ radars &#8594; 325 mesh &#8594; 1-2 um spherical &#8594; 2 GHz absorber' },
  { id: 'IPW-0011', batchNo: 'IPW-B2411', city: 'Guwahati', manufacturer: 'Assam Iron Powder', powderGrade: 'Fe-12%Cr Stainless 410', application: 'Cutlery (Godrej Consumer)', ironPercent: 88.0, meshSize: 80, investmentCr: 165, status: 'Delivered', priority: 'Low', origin: 'Assam Iron Powder Guwahati (AS)', destination: 'Godrej Mumbai (MH)', shipDate: '2026-07-25', transitDays: 4, zone: 'East', remarks: 'Fe-12Cr 410 stainless powder for Godrej stainless cutlery MIM &#8594; 88% Fe &#8594; &#8377;165Cr for 5 tonnes &#8594; India &#8377;4,950Cr consumer Fe &#8594; Godrej 50M pcs/yr &#8594; 80 mesh &#8594; 40 HRC &#8594; MIM grade' },
  { id: 'IPW-0012', batchNo: 'IPW-B2412', city: 'Surat', manufacturer: 'Gujarat Iron Tech', powderGrade: 'Fe-2%Cu Brazing Filler', application: 'Diamond Tool (ESAB)', ironPercent: 98.0, meshSize: 120, investmentCr: 255, status: 'Delayed', priority: 'High', origin: 'Gujarat Iron Tech Surat (GJ)', destination: 'ESAB Kolkata (WB)', shipDate: '2026-07-08', transitDays: 14, zone: 'West', remarks: 'Fe-Cu brazing filler powder for ESAB diamond segment tool brazing &#8594; 98% Fe &#8594; &#8377;255Cr for 10 tonnes &#8594; monsoon delay &#8594; India &#8377;7,650Cr tooling Fe &#8594; ESAB 50M segments &#8594; 120 mesh &#8594; 1090&#176;C liquidus &#8594; Ag-free' },
  { id: 'IPW-0013', batchNo: 'IPW-B2413', city: 'Noida', manufacturer: 'UP Iron Industries', powderGrade: 'Fe 99.99% Magnetic', application: 'Inductor Core (Larsen and Toubro)', ironPercent: 99.99, meshSize: 200, investmentCr: 310, status: 'Delivered', priority: 'High', origin: 'UP Iron Industries Noida (UP)', destination: 'L&T Mumbai (MH)', shipDate: '2026-07-26', transitDays: 1, zone: 'North', remarks: 'Ultra-pure Fe magnetic powder for L&T power inductor soft magnetic core &#8594; 99.99% Fe &#8594; &#8377;310Cr for 3 tonnes &#8594; India &#8377;9,300Cr power Fe &#8594; L&T 500K inductors &#8594; 200 mesh &#8594; mu-r 80,000 &#8594; 20 kHz' },
  { id: 'IPW-0014', batchNo: 'IPW-B2414', city: 'Bhopal', manufacturer: 'BHEL', powderGrade: 'Fe-17Cr ODS PM2000', application: 'Turbine Exhaust (BHEL)', ironPercent: 83.0, meshSize: 35, investmentCr: 520, status: 'Delivered', priority: 'Critical', origin: 'BHEL Bhopal (MP)', destination: 'BHEL Haridwar (UK)', shipDate: '2026-07-27', transitDays: 2, zone: 'North', remarks: 'Fe-17Cr ODS PM2000 powder for BHEL 800 MW gas turbine exhaust liner &#8594; 83% Fe &#8594; &#8377;520Cr for 7 tonnes &#8594; India &#8377;15,600Cr power Fe &#8594; BHEL 150 GW &#8594; 35 mesh &#8594; 1100&#176;C &#8594; MA+HIP' }
]

const delayedSet = new Set(ironPowderRecords.filter(r => r.status === 'Delayed').map(r => r.id))

export default function IronPowderLogisticsView() {
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
    let data = ironPowderRecords
    if (search) data = data.filter(r => Object.values(r).some(v => String(v).toLowerCase().includes(search.toLowerCase())))
    Object.entries(filters).forEach(([k, vals]) => { if (vals.length) data = data.filter(r => vals.includes(String((r as any)[k]))) })
    return data
  }, [search, filters])

  const total = ironPowderRecords.length
  const delivered = ironPowderRecords.filter(r => r.status === 'Delivered').length
  const totalCr = ironPowderRecords.reduce((s: number, r) => s + r.investmentCr, 0)
  const avgFe = +(ironPowderRecords.reduce((s: number, r) => s + r.ironPercent, 0) / total).toFixed(1)

  const manufacturers = [...new Set(ironPowderRecords.map(r => r.manufacturer))]
  const zones = [...new Set(ironPowderRecords.map(r => r.zone))]

  return (
    <div className="space-y-6">
      <PageHeader title="Iron Powder Logistics" description="Indian iron powder supply chain tracking across automotive PM, nuclear ODS steel, electrical motor cores, magnetic shielding, welding electrodes, bearing components, defence radar absorber and gas turbine exhaust sectors" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent><div className="text-2xl font-bold text-orange-600">{total}</div><div className="text-xs text-muted-foreground">Total Shipments</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-orange-600">{delivered}</div><div className="text-xs text-muted-foreground">Delivered</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-orange-600">&#8377;{totalCr.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground">Total Investment</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-orange-600">{avgFe}%</div><div className="text-xs text-muted-foreground">Avg Fe Content</div></CardContent></Card>
      </div>

      <div className="flex gap-2 border-b">
        {tabs.map((t, i) => (<button key={t} className={`px-4 py-2 ${activeTab === i ? 'border-b-2 border-orange-600 text-orange-600 font-semibold' : 'text-muted-foreground'}`} onClick={() => setActiveTab(i)}>{t}</button>))}
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
        <div className="rounded-md border"><div className="max-h-96 overflow-auto"><table className="w-full text-sm"><thead className="sticky top-0 bg-background"><tr><th className="p-2 text-left">ID</th><th className="p-2 text-left">Batch</th><th className="p-2 text-left">Grade</th><th className="p-2 text-left">Application</th><th className="p-2 text-right">Fe%</th><th className="p-2 text-right">&#8377;Cr</th><th className="p-2 text-left">Status</th></tr></thead><tbody>{filtered.map(r => (<tr key={r.id} className={`border-t ${delayedSet.has(r.id) ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}><td className="p-2">{r.id}</td><td className="p-2">{r.batchNo}</td><td className="p-2">{r.powderGrade}</td><td className="p-2">{r.application}</td><td className="p-2 text-right">{r.ironPercent}</td><td className="p-2 text-right">{r.investmentCr}</td><td className="p-2"><Badge variant={r.status === 'Delivered' ? 'default' : 'destructive'}>{r.status}</Badge></td></tr>))}</tbody></table></div></div>
      </div>)}

      {activeTab === 1 && (<div className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          {manufacturers.map(m => <Badge key={m} variant={filters.manufacturer?.includes(m) ? 'default' : 'outline'} className="cursor-pointer" onClick={() => toggleFilter('manufacturer', m)}>{m}</Badge>)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">By Manufacturer</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { m[r.manufacturer] = (m[r.manufacturer] || 0) + 1; return m }, {} as Record<string, number>)) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([m, c]) => (<div key={m} className="flex justify-between text-sm"><span>{m}</span><span className="font-medium">{c}</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Mesh Size Range</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { const s = r.meshSize <= 50 ? 'Coarse (0-50 mesh)' : r.meshSize <= 100 ? 'Medium (51-100 mesh)' : r.meshSize <= 200 ? 'Fine (101-200 mesh)' : 'Ultra Fine (201+ mesh)'; m[s] = (m[s] || 0) + 1; return m }, {} as Record<string, number>)) as [string, number][]).map(([k, c]) => (<div key={k} className="flex justify-between text-sm"><span>{k}</span><span className="font-medium">{c}</span></div>))}</div></CardContent></Card>
        </div>
        <div className="rounded-md border"><div className="max-h-96 overflow-auto"><table className="w-full text-sm"><thead className="sticky top-0 bg-background"><tr><th className="p-2 text-left">ID</th><th className="p-2 text-left">Manufacturer</th><th className="p-2 text-left">Grade</th><th className="p-2 text-left">Origin</th><th className="p-2 text-left">Destination</th><th className="p-2 text-right">Transit</th><th className="p-2 text-left">Zone</th></tr></thead><tbody>{filtered.map(r => (<tr key={r.id} className={`border-t ${delayedSet.has(r.id) ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}><td className="p-2">{r.id}</td><td className="p-2">{r.manufacturer}</td><td className="p-2">{r.powderGrade}</td><td className="p-2">{r.origin}</td><td className="p-2">{r.destination}</td><td className="p-2 text-right">{r.transitDays}d</td><td className="p-2">{r.zone}</td></tr>))}</tbody></table></div></div>
      </div>)}

      {activeTab === 2 && (<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card><CardHeader><CardTitle className="text-sm">Investment by Application</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { m[r.application] = (m[r.application] || 0) + r.investmentCr; return m }, {} as Record<string, number>)) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 7).map(([a, v]) => (<div key={a} className="flex justify-between text-sm"><span>{a}</span><span className="font-medium">&#8377;{v}Cr</span></div>))}</div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Iron Content Distribution</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { const n = r.ironPercent >= 95 ? 'High Purity (95%+)' : r.ironPercent >= 80 ? 'Alloyed (80-95%)' : r.ironPercent >= 50 ? 'Moderate (50-80%)' : 'Low (<50%)'; m[n] = (m[n] || 0) + 1; return m }, {} as Record<string, number>)) as [string, number][]).map(([k, c]) => (<div key={k} className="flex justify-between text-sm"><span>{k}</span><span className="font-medium">{c}</span></div>))}</div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Top Routes by Value</CardTitle></CardHeader><CardContent><div className="space-y-2">{filtered.sort((a, b) => b.investmentCr - a.investmentCr).slice(0, 7).map(r => (<div key={r.id} className="flex justify-between text-sm"><span>{r.origin.split('(')[0]} &#8594; {r.destination.split('(')[0]}</span><span className="font-medium">&#8377;{r.investmentCr}Cr</span></div>))}</div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Nuclear and Aerospace Grade Powders</CardTitle></CardHeader><CardContent><div className="space-y-2">{filtered.filter(r => r.application.toLowerCase().includes('nuclear') || r.application.toLowerCase().includes('aero') || r.application.toLowerCase().includes('turbine') || r.application.toLowerCase().includes('reactor')).sort((a, b) => b.investmentCr - a.investmentCr).map(r => (<div key={r.id} className="flex justify-between text-sm"><span>{r.powderGrade} ({r.meshSize} mesh)</span><span className="font-medium">&#8377;{r.investmentCr}Cr</span></div>))}</div></CardContent></Card>
      </div>)}

      {activeTab === 3 && (<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card><CardContent><div className="text-sm font-medium text-orange-600 mb-2">India PM Auto Parts Boom</div><div className="text-xs text-muted-foreground">Indian automotive PM parts market growing at 18% CAGR, reaching &#8377;8,500Cr by 2027. Bajaj, Mahindra, Tata and TVS consuming 120 TPA iron powder for engine sprockets, gears and connecting rods. Water-atomized Fe 99.9% dominates, with SAIL and Tata Steel supplying 70% domestic demand. PM parts replacing machined forgings at 40% cost saving.</div></CardContent></Card>
        <Card><CardContent><div className="text-sm font-medium text-orange-600 mb-2">ODS Steel Nuclear Programme</div><div className="text-xs text-muted-foreground">IGCAR and DRDO DMRL developing indigenous Fe-Cr-Al ODS ferritic steel for PFBR and fusion reactor cladding. MA956 and PM2000 powders required for 750&#176;C+ service. India targeting 20 fast reactors by 2035. MIDHANI commissioning 50 TPA ODS powder atomizer by 2028 for nuclear and aero applications.</div></CardContent></Card>
        <Card><CardContent><div className="text-sm font-medium text-orange-600 mb-2">Monsoon Delays Brazing Filler</div><div className="text-xs text-muted-foreground">IPW-B2412 Fe-Cu brazing filler powder for ESAB diamond tool brazing delayed 14 days due to Gujarat monsoon. ESAB Kolkata diamond segment production at risk &#8212; 50M segments/year. India consuming 40 TPA Fe for brazing. Recommend pre-positioning 8-tonne buffer at Kolkata warehouse before monsoon season.</div></CardContent></Card>
        <Card><CardContent><div className="text-sm font-medium text-orange-600 mb-2">Carbonyl Iron EMI Shielding</div><div className="text-xs text-muted-foreground">BEL and DRDO consuming 15 TPA carbonyl iron powder for radar EMI absorber coatings. Fe 99.95% 1-2um spherical carbonyl powder critical for AESA radar performance. Odisha Iron Corp expanding from 5 to 15 TPA capacity by 2027. India targeting 300+ AESA radars across Army, Navy and Air Force platforms.</div></CardContent></Card>
      </div>)}
    </div>
  )
}
