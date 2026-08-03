import os

content = r"""'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { Droplets } from 'lucide-react'

interface ZincAlloyRecord {
  id: string
  batchNo: string
  city: string
  manufacturer: string
  alloyGrade: string
  application: string
  zincPercent: number
  coatingUm: number
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

const zincAlloyRecords: ZincAlloyRecord[] = [
  { id: 'ZNA-0001', batchNo: 'ZNA-B2401', city: 'Mumbai', manufacturer: 'Hindustan Zinc', alloyGrade: 'SHG Zinc 99.995% Galv', application: 'Galvanizing (JSW Steel)', zincPercent: 99.995, coatingUm: 85, investmentCr: 380, status: 'Delivered', priority: 'Critical', origin: 'Hindustan Zinc Udaipur (RJ)', destination: 'JSW Vijayanagar (KA)', shipDate: '2026-07-15', transitDays: 3, zone: 'West', remarks: 'Special High Grade Zn ingot for JSW hot-dip galvanizing line G2 &#8594; 99.995% Zn &#8594; &#8377;380Cr for 30 tonnes &#8594; India &#8377;11,400Cr galv Zn &#8594; JSW 18 MTPA &#8594; 85um Zn coat &#8594; JIS G3302 &#8594; 40yr life' },
  { id: 'ZNA-0002', batchNo: 'ZNA-B2402', city: 'Bengaluru', manufacturer: 'Bharat Zinc', alloyGrade: 'Zn-Al 95/5 Die Cast', application: 'Auto Die Cast (Motherson)', zincPercent: 95.0, coatingUm: 0, investmentCr: 275, status: 'Delivered', priority: 'High', origin: 'Bharat Zinc Chennai (TN)', destination: 'Motherson Noida (UP)', shipDate: '2026-07-16', transitDays: 2, zone: 'South', remarks: 'Zn-5%Al Zamak 5 die-cast alloy for Motherson SAM door handle &#8594; 95% Zn &#8594; &#8377;275Cr for 15 tonnes &#8594; India &#8377;8,250Cr die-cast Zn &#8594; Motherson 50M parts/yr &#8594; Zamak 5 &#8594; 110 MPa UTS &#8594; HPDC' },
  { id: 'ZNA-0003', batchNo: 'ZNA-B2403', city: 'Hyderabad', manufacturer: 'Hyderabad Zinc Ltd', alloyGrade: 'Zn-Al-Mg 92/6/2 Coil', application: 'Roofing Sheet (Tata Bluescope)', zincPercent: 92.0, coatingUm: 40, investmentCr: 320, status: 'Delivered', priority: 'High', origin: 'Hyderabad Zinc Hyderabad (TG)', destination: 'Tata Bluescope Pune (MH)', shipDate: '2026-07-17', transitDays: 1, zone: 'South', remarks: 'Zn-6%Al-2%Mg ZAM alloy coated coil for Tata Bluescope Colorbond roof &#8594; 92% Zn &#8594; &#8377;320Cr for 20 tonnes &#8594; India &#8377;9,600Cr coated Zn &#8594; Tata 200K roofs/yr &#8594; 40um ZAM coat &#8594; 2x life vs GI &#8594; self-healing' },
  { id: 'ZNA-0004', batchNo: 'ZNA-B2404', city: 'Chennai', manufacturer: 'Rajasthan Zinc', alloyGrade: 'Zn-Ni 85/15 Plating', application: 'Fastener Plating (Sundaram)', zincPercent: 85.0, coatingUm: 15, investmentCr: 185, status: 'Delivered', priority: 'Medium', origin: 'Rajasthan Zinc Udaipur (RJ)', destination: 'Sundaram Fasteners Chennai (TN)', shipDate: '2026-07-18', transitDays: 2, zone: 'South', remarks: 'Zn-15%Ni alloy plating anode for Sundaram auto fastener barrel plating &#8594; 85% Zn &#8594; &#8377;185Cr for 8 tonnes &#8594; India &#8377;5,550Cr plating Zn &#8594; Sundaram 500M fasteners/yr &#8594; 15um Zn-Ni &#8594; 1000hr salt spray &#8594; Cr6-free' },
  { id: 'ZNA-0005', batchNo: 'ZNA-B2405', city: 'Pune', manufacturer: 'Bajaj Group', alloyGrade: 'Zn-Ag 98/2 Battery', application: 'Zn-Air Battery (Ather)', zincPercent: 98.0, coatingUm: 0, investmentCr: 410, status: 'Delivered', priority: 'Critical', origin: 'Bajaj Zinc Pune (MH)', destination: 'Ather Bengaluru (KA)', shipDate: '2026-07-19', transitDays: 2, zone: 'West', remarks: 'Zn-2%Ag alloy anode for Ather 450X Gen3 zinc-air EV battery &#8594; 98% Zn &#8594; &#8377;410Cr for 10 tonnes &#8594; India &#8377;12,300Cr EV Zn &#8594; Ather 500K scooters/yr &#8594; 200 Wh/kg &#8594; 500 cycle &#8594; mech recharge' },
  { id: 'ZNA-0006', batchNo: 'ZNA-B2406', city: 'Kolkata', manufacturer: 'SAIL', alloyGrade: 'Zn-Fe 93/7 Electrogalv', application: 'Auto Panel (Maruti Suzuki)', zincPercent: 93.0, coatingUm: 12, investmentCr: 290, status: 'Delivered', priority: 'Critical', origin: 'SAIL Bhilai (CG)', destination: 'Maruti Manesar (HR)', shipDate: '2026-07-20', transitDays: 2, zone: 'East', remarks: 'Zn-7%Fe alloy for Maruti Suzuki Swift exterior panel electrogalvanizing &#8594; 93% Zn &#8594; &#8377;290Cr for 18 tonnes &#8594; India &#8377;8,700Cr auto Zn &#8594; Maruti 2M cars/yr &#8594; 12um EG coat &#8594; JIS 3312 &#8594; weldable' },
  { id: 'ZNA-0007', batchNo: 'ZNA-B2407', city: 'Ahmedabad', manufacturer: 'Gujarat Zinc Industries', alloyGrade: 'Zn-Al 90/10 Foundry', application: 'Marine Propeller (Cochin Shipyard)', zincPercent: 90.0, coatingUm: 0, investmentCr: 165, status: 'Delivered', priority: 'Medium', origin: 'Gujarat Zinc Ahmedabad (GJ)', destination: 'Cochin Shipyard Kochi (KL)', shipDate: '2026-07-21', transitDays: 2, zone: 'West', remarks: 'Zn-10%Al alloy sand-cast ingot for Cochin Shipyard patrol vessel propeller hub &#8594; 90% Zn &#8594; &#8377;165Cr for 12 tonnes &#8594; India &#8377;4,950Cr marine Zn &#8594; CSL 20 vessels &#8594; 280 MPa UTS &#8594; seawater grade &#8594; AB2 class' },
  { id: 'ZNA-0008', batchNo: 'ZNA-B2408', city: 'Jaipur', manufacturer: 'Rajasthan Zinc Smelters', alloyGrade: 'Zn-Cu 80/20 Brass', application: 'Valve Body (Kirloskar)', zincPercent: 80.0, coatingUm: 0, investmentCr: 145, status: 'Delivered', priority: 'Medium', origin: 'Rajasthan Zinc Jaipur (RJ)', destination: 'Kirloskar Pune (MH)', shipDate: '2026-07-22', transitDays: 2, zone: 'North', remarks: 'Zn-20%Cu brass rod stock for Kirloskar industrial valve body forging &#8594; 80% Zn &#8594; &#8377;145Cr for 10 tonnes &#8594; India &#8377;4,350Cr brass Zn &#8594; Kirloskar 200K valves/yr &#8594; C36000 brass &#8594; 340 MPa UTS &#8594; dezinc resistant' },
  { id: 'ZNA-0009', batchNo: 'ZNA-B2409', city: 'Coimbatore', manufacturer: 'Tamil Nadu Zinc', alloyGrade: 'Zn-Al 95/5 Hardware', application: 'Lock Body (Godrej)', zincPercent: 95.0, coatingUm: 0, investmentCr: 125, status: 'Delivered', priority: 'Medium', origin: 'Tamil Nadu Zinc Coimbatore (TN)', destination: 'Godrej Mumbai (MH)', shipDate: '2026-07-23', transitDays: 2, zone: 'South', remarks: 'Zn-5%Al Zamak 3 alloy ingot for Godrej lock body die casting &#8594; 95% Zn &#8594; &#8377;125Cr for 8 tonnes &#8594; India &#8377;3,750Cr hardware Zn &#8594; Godrej 100M locks/yr &#8594; Zamak 3 &#8594; 280 MPa &#8594; smooth cast' },
  { id: 'ZNA-0010', batchNo: 'ZNA-B2410', city: 'Bhubaneswar', manufacturer: 'Odisha Zinc Refinery', alloyGrade: 'SHG Zn 99.99% Dry Battery', application: 'Zn-Carbon Cell (Panasonic)', zincPercent: 99.99, coatingUm: 0, investmentCr: 210, status: 'Delivered', priority: 'High', origin: 'Odisha Zinc Bhubaneswar (OD)', destination: 'Panasonic Baroda (GJ)', shipDate: '2026-07-24', transitDays: 3, zone: 'East', remarks: 'SHG Zn can for Panasonic AA zinc-carbon dry cell production &#8594; 99.99% Zn &#8594; &#8377;210Cr for 6 tonnes &#8594; India &#8377;6,300Cr battery Zn &#8594; Panasonic 500M cells/yr &#8594; 0.25mm can &#8594; 99.999% purity &#8594; zero Hg' },
  { id: 'ZNA-0011', batchNo: 'ZNA-B2411', city: 'Guwahati', manufacturer: 'Assam Zinc Works', alloyGrade: 'Zn-Al 4% Galfan', application: 'Transmission Tower (Power Grid)', zincPercent: 96.0, coatingUm: 55, investmentCr: 195, status: 'Delivered', priority: 'High', origin: 'Assam Zinc Guwahati (AS)', destination: 'Power Grid Delhi (DL)', shipDate: '2026-07-25', transitDays: 4, zone: 'East', remarks: 'Zn-5%Al-mischmetal Galfan alloy for Power Grid 765 kV tower angle galvanizing &#8594; 96% Zn &#8594; &#8377;195Cr for 20 tonnes &#8594; India &#8377;5,850Cr tower Zn &#8594; PGCIL 200K towers &#8594; 55um Galfan &#8594; 2x GI life &#8594; IS 2629' },
  { id: 'ZNA-0012', batchNo: 'ZNA-B2412', city: 'Surat', manufacturer: 'Gujarat Zinc Technologies', alloyGrade: 'Zn-Ti 98.5/1.5 Corrosion', application: 'Offshore Platform (ONGC)', zincPercent: 98.5, coatingUm: 200, investmentCr: 340, status: 'Delayed', priority: 'Critical', origin: 'Gujarat Zinc Surat (GJ)', destination: 'ONGC Mumbai Offshore (MH)', shipDate: '2026-07-09', transitDays: 11, zone: 'West', remarks: 'Zn-1.5%Ti sacrificial anode for ONGC Mumbai High offshore platform CP &#8594; 98.5% Zn &#8594; &#8377;340Cr for 25 tonnes &#8594; India &#8377;10,200Cr offshore Zn &#8594; monsoon delay &#8594; 200um anode &#8594; 25yr design &#8594; -1050mV CP' },
  { id: 'ZNA-0013', batchNo: 'ZNA-B2413', city: 'Noida', manufacturer: 'UP Zinc Alloys', alloyGrade: 'Zn-Al-Mg 95/3/2 Wire', application: 'Bridge Cable (L&T)', zincPercent: 95.0, coatingUm: 120, investmentCr: 260, status: 'Delivered', priority: 'High', origin: 'UP Zinc Noida (UP)', destination: 'L&T Mumbai (MH)', shipDate: '2026-07-26', transitDays: 2, zone: 'North', remarks: 'Zn-Al-Mg wire-drawn coating for L&T Mumbai Trans-Harbour Link bridge cable &#8594; 95% Zn &#8594; &#8377;260Cr for 10 tonnes &#8594; India &#8377;7,800Cr infra Zn &#8594; L&T 21km bridge &#8594; 120um SeCoat &#8594; 100yr life &#8594; stray current proof' },
  { id: 'ZNA-0014', batchNo: 'ZNA-B2414', city: 'Bhopal', manufacturer: 'BHEL', alloyGrade: 'Zn-Pb 99/1 Anode', application: 'Electrowinning (Hindustan Zinc)', zincPercent: 99.0, coatingUm: 0, investmentCr: 175, status: 'Delivered', priority: 'Medium', origin: 'BHEL Bhopal (MP)', destination: 'Hindustan Zinc Chanderiya (RJ)', shipDate: '2026-07-27', transitDays: 2, zone: 'North', remarks: 'Zn-1%Pb alloy anode for Hindustan Zinc Chanderiya electrowinning tankhouse &#8594; 99% Zn &#8594; &#8377;175Cr for 15 tonnes &#8594; India &#8377;5,250Cr EW Zn &#8594; HZL 1 MT &#8594; 1.5yr anode life &#8594; 99.995% Zn &#8594; 350 A/m2' }
]

const delayedSet = new Set(zincAlloyRecords.filter(r => r.status === 'Delayed').map(r => r.id))

export default function ZincAlloyLogisticsView() {
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
    let data = zincAlloyRecords
    if (search) data = data.filter(r => Object.values(r).some(v => String(v).toLowerCase().includes(search.toLowerCase())))
    Object.entries(filters).forEach(([k, vals]) => { if (vals.length) data = data.filter(r => vals.includes(String((r as any)[k]))) })
    return data
  }, [search, filters])

  const total = zincAlloyRecords.length
  const delivered = zincAlloyRecords.filter(r => r.status === 'Delivered').length
  const totalCr = zincAlloyRecords.reduce((s: number, r) => s + r.investmentCr, 0)
  const avgZn = +(zincAlloyRecords.reduce((s: number, r) => s + r.zincPercent, 0) / total).toFixed(1)

  const manufacturers = [...new Set(zincAlloyRecords.map(r => r.manufacturer))]
  const zones = [...new Set(zincAlloyRecords.map(r => r.zone))]

  return (
    <div className="space-y-6">
      <PageHeader title="Zinc Alloy Logistics" description="Indian zinc alloy supply chain tracking across galvanizing, die-casting, electroplating, battery, marine, offshore cathodic protection and infrastructure sectors" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent><div className="text-2xl font-bold text-cyan-600">{total}</div><div className="text-xs text-muted-foreground">Total Shipments</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-cyan-600">{delivered}</div><div className="text-xs text-muted-foreground">Delivered</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-cyan-600">&#8377;{totalCr.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground">Total Investment</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-cyan-600">{avgZn}%</div><div className="text-xs text-muted-foreground">Avg Zn Content</div></CardContent></Card>
      </div>

      <div className="flex gap-2 border-b">
        {tabs.map((t, i) => (<button key={t} className={`px-4 py-2 ${activeTab === i ? 'border-b-2 border-cyan-600 text-cyan-600 font-semibold' : 'text-muted-foreground'}`} onClick={() => setActiveTab(i)}>{t}</button>))}
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
        <div className="rounded-md border"><div className="max-h-96 overflow-auto"><table className="w-full text-sm"><thead className="sticky top-0 bg-background"><tr><th className="p-2 text-left">ID</th><th className="p-2 text-left">Batch</th><th className="p-2 text-left">Grade</th><th className="p-2 text-left">Application</th><th className="p-2 text-right">Zn%</th><th className="p-2 text-right">&#8377;Cr</th><th className="p-2 text-left">Status</th></tr></thead><tbody>{filtered.map(r => (<tr key={r.id} className={`border-t ${delayedSet.has(r.id) ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}><td className="p-2">{r.id}</td><td className="p-2">{r.batchNo}</td><td className="p-2">{r.alloyGrade}</td><td className="p-2">{r.application}</td><td className="p-2 text-right">{r.zincPercent}</td><td className="p-2 text-right">{r.investmentCr}</td><td className="p-2"><Badge variant={r.status === 'Delivered' ? 'default' : 'destructive'}>{r.status}</Badge></td></tr>))}</tbody></table></div></div>
      </div>)}

      {activeTab === 1 && (<div className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          {manufacturers.map(m => <Badge key={m} variant={filters.manufacturer?.includes(m) ? 'default' : 'outline'} className="cursor-pointer" onClick={() => toggleFilter('manufacturer', m)}>{m}</Badge>)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">By Manufacturer</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { m[r.manufacturer] = (m[r.manufacturer] || 0) + 1; return m }, {} as Record<string, number>)) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([m, c]) => (<div key={m} className="flex justify-between text-sm"><span>{m}</span><span className="font-medium">{c}</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Coating Thickness Profile</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { const s = r.coatingUm === 0 ? 'Not Coated (Ingot/Cast)' : r.coatingUm <= 20 ? 'Thin (1-20 um)' : r.coatingUm <= 60 ? 'Medium (21-60 um)' : r.coatingUm <= 120 ? 'Heavy (61-120 um)' : 'Extra Heavy (121+ um)'; m[s] = (m[s] || 0) + 1; return m }, {} as Record<string, number>)) as [string, number][]).map(([k, c]) => (<div key={k} className="flex justify-between text-sm"><span>{k}</span><span className="font-medium">{c}</span></div>))}</div></CardContent></Card>
        </div>
        <div className="rounded-md border"><div className="max-h-96 overflow-auto"><table className="w-full text-sm"><thead className="sticky top-0 bg-background"><tr><th className="p-2 text-left">ID</th><th className="p-2 text-left">Manufacturer</th><th className="p-2 text-left">Grade</th><th className="p-2 text-left">Origin</th><th className="p-2 text-left">Destination</th><th className="p-2 text-right">Transit</th><th className="p-2 text-left">Zone</th></tr></thead><tbody>{filtered.map(r => (<tr key={r.id} className={`border-t ${delayedSet.has(r.id) ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}><td className="p-2">{r.id}</td><td className="p-2">{r.manufacturer}</td><td className="p-2">{r.alloyGrade}</td><td className="p-2">{r.origin}</td><td className="p-2">{r.destination}</td><td className="p-2 text-right">{r.transitDays}d</td><td className="p-2">{r.zone}</td></tr>))}</tbody></table></div></div>
      </div>)}

      {activeTab === 2 && (<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card><CardHeader><CardTitle className="text-sm">Investment by Application</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { m[r.application] = (m[r.application] || 0) + r.investmentCr; return m }, {} as Record<string, number>)) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 7).map(([a, v]) => (<div key={a} className="flex justify-between text-sm"><span>{a}</span><span className="font-medium">&#8377;{v}Cr</span></div>))}</div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Zinc Purity Distribution</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { const n = r.zincPercent >= 99 ? 'Pure (99%+)' : r.zincPercent >= 95 ? 'High (95-99%)' : r.zincPercent >= 90 ? 'Medium (90-95%)' : 'Low (<90%)'; m[n] = (m[n] || 0) + 1; return m }, {} as Record<string, number>)) as [string, number][]).map(([k, c]) => (<div key={k} className="flex justify-between text-sm"><span>{k}</span><span className="font-medium">{c}</span></div>))}</div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Top Routes by Value</CardTitle></CardHeader><CardContent><div className="space-y-2">{filtered.sort((a, b) => b.investmentCr - a.investmentCr).slice(0, 7).map(r => (<div key={r.id} className="flex justify-between text-sm"><span>{r.origin.split('(')[0]} &#8594; {r.destination.split('(')[0]}</span><span className="font-medium">&#8377;{r.investmentCr}Cr</span></div>))}</div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Galvanizing-Grade Shipments</CardTitle></CardHeader><CardContent><div className="space-y-2">{filtered.filter(r => r.coatingUm > 0).sort((a, b) => b.investmentCr - a.investmentCr).map(r => (<div key={r.id} className="flex justify-between text-sm"><span>{r.alloyGrade} ({r.coatingUm}um)</span><span className="font-medium">&#8377;{r.investmentCr}Cr</span></div>))}</div></CardContent></Card>
      </div>)}

      {activeTab === 3 && (<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card><CardContent><div className="text-sm font-medium text-cyan-600 mb-2">India Galvanizing Market Surge</div><div className="text-xs text-muted-foreground">Indian galvanizing steel market at &#8377;85,000Cr, growing 10% CAGR driven by infrastructure push. JSW, Tata Steel and SAIL collectively consuming 800 TPA SHG zinc for hot-dip and electrogalvanizing. ZAM and Galfan coatings replacing conventional GI for 2-3x life improvement.</div></CardContent></Card>
        <Card><CardContent><div className="text-sm font-medium text-cyan-600 mb-2">Zn-Air EV Battery Promise</div><div className="text-xs text-muted-foreground">Ather Energy and Bajaj developing zinc-air batteries for affordable 2-wheeler EVs. Zinc-air offers 200 Wh/kg at 1/5th cost of Li-ion. India targeting 50% of 2-wheeler batteries to be zinc-based by 2028. Bajaj Zinc supplying 10 TPA Zn-Ag alloy anodes.</div></CardContent></Card>
        <Card><CardContent><div className="text-sm font-medium text-cyan-600 mb-2">Monsoon Disrupts Offshore Anodes</div><div className="text-xs text-muted-foreground">ZNA-B2412 Zn-Ti sacrificial anodes for ONGC Mumbai High platform delayed 11 days due to Gujarat monsoon. Platform cathodic protection maintenance deadline at risk. ONGC operating 200+ offshore platforms, each requiring annual anode replacement.</div></CardContent></Card>
        <Card><CardContent><div className="text-sm font-medium text-cyan-600 mb-2">ZAM Coating Revolution</div><div className="text-xs text-muted-foreground">Tata Bluescope and JSW Steel switching from GI to Zn-Al-Mg (ZAM) coating for Indian infrastructure. ZAM offers self-healing cut-edge protection and 2-3x corrosion life. India consuming 60 TPA ZAM alloy, growing at 25% CAGR, with Hyderabad Zinc expanding 3x.</div></CardContent></Card>
      </div>)}
    </div>
  )
}
"""

outpath = '/home/z/my-project/src/components/modules/zinc-alloy-logistics-view.tsx'
with open(outpath, 'w') as f:
    f.write(content)
print(f"Written {len(content)} bytes to {outpath}")
