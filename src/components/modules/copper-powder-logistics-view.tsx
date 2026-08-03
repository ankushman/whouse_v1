'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { Waves } from 'lucide-react'

interface CopperPowderRecord {
  id: string
  batchNo: string
  city: string
  manufacturer: string
  powderGrade: string
  application: string
  copperPercent: number
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

const copperPowderRecords: CopperPowderRecord[] = [
  { id: 'COP-0001', batchNo: 'COP-B2401', city: 'Mumbai', manufacturer: 'Hindalco Novelis', powderGrade: 'Pure Cu 99.99% 15-45um', application: 'PM Sintering (Bajaj Auto)', copperPercent: 99.99, particleSizeUm: 30, investmentCr: 320, status: 'Delivered', priority: 'High', origin: 'Hindalco Novelis Selayang (MH)', destination: 'Bajaj Auto Pune (MH)', shipDate: '2026-07-15', transitDays: 1, zone: 'West', remarks: 'Water-atomized pure Cu powder for Bajaj Pulsar brake pad sintering &#8594; 99.99% Cu &#8594; &#8377;320Cr for 15 tonnes &#8594; India &#8377;9,600Cr auto Cu &#8594; Bajaj 8M bikes &#8594; 30um PSD &#8594; 8.9 g/cc green &#8594; 200 MPa sintered' },
  { id: 'COP-0002', batchNo: 'COP-B2402', city: 'Bengaluru', manufacturer: 'DRDO DMRL', powderGrade: 'Cu-Cr-Zr 99.8% 50um', application: 'Rocket Motor Nozzle (ISRO)', copperPercent: 99.8, particleSizeUm: 50, investmentCr: 580, status: 'Delivered', priority: 'Critical', origin: 'DRDO DMRL Hyderabad (TG)', destination: 'ISRO Thiruvananthapuram (KL)', shipDate: '2026-07-16', transitDays: 2, zone: 'South', remarks: 'Cu-Cr-Zr powder HIP compact for ISRO PSLV GSLV rocket nozzle throat &#8594; 99.8% Cu &#8594; &#8377;580Cr for 4 tonnes &#8594; India &#8377;17,400Cr space Cu &#8594; ISRO 12 launches/yr &#8594; 50um PSD &#8594; 350&#176;C service &#8594; 80% IACS' },
  { id: 'COP-0003', batchNo: 'COP-B2403', city: 'Hyderabad', manufacturer: 'MIDHANI', powderGrade: 'Cu-Ni 70/30 Monel', application: 'Submarine Piping (Mazagon Dock)', copperPercent: 70.0, particleSizeUm: 75, investmentCr: 440, status: 'Delivered', priority: 'Critical', origin: 'MIDHANI Hyderabad (TG)', destination: 'Mazagon Dock Mumbai (MH)', shipDate: '2026-07-17', transitDays: 2, zone: 'South', remarks: 'Cu-Ni 70/30 MIM powder for Mazagon Dock Kalvari submarine seawater piping &#8594; 70% Cu &#8594; &#8377;440Cr for 12 tonnes &#8594; India &#8377;13,200Cr naval Cu &#8594; MDL 6 submarines &#8594; 75um PSD &#8594; MIM grade &#8594; biofouling proof' },
  { id: 'COP-0004', batchNo: 'COP-B2404', city: 'Chennai', manufacturer: 'IGCAR', powderGrade: 'Cu-OFHC 99.99% Wire', application: 'Nuclear Conductor (NPCIL)', copperPercent: 99.99, particleSizeUm: 100, investmentCr: 350, status: 'Delivered', priority: 'Critical', origin: 'IGCAR Kalpakkam (TN)', destination: 'NPCIL Tarapur (MH)', shipDate: '2026-07-18', transitDays: 2, zone: 'South', remarks: 'OFHC Cu powder for NPCIL PFBR reactor coolant pump motor winding &#8594; 99.99% Cu &#8594; &#8377;350Cr for 8 tonnes &#8594; India &#8377;10,500Cr nuclear Cu &#8594; NPCIL 7.5 GW &#8594; 100um wire powder &#8594; 101% IACS &#8594; radiation resistant' },
  { id: 'COP-0005', batchNo: 'COP-B2405', city: 'Pune', manufacturer: 'Bharat Forge', powderGrade: 'Cu-Sn 88/12 Bronze', application: 'MIM Bush Bearing (Bharat Forge)', copperPercent: 88.0, particleSizeUm: 25, investmentCr: 185, status: 'Delivered', priority: 'Medium', origin: 'Bharat Forge Pune (MH)', destination: 'Bharat Forge Satara (MH)', shipDate: '2026-07-19', transitDays: 1, zone: 'West', remarks: 'Cu-Sn 88/12 bronze MIM powder for Bharat Forge engine bush bearing &#8594; 88% Cu &#8594; &#8377;185Cr for 10 tonnes &#8594; India &#8377;5,550Cr auto Cu &#8594; Bharat Forge 500K parts &#8594; 25um PSD &#8594; 7.8 g/cc sinter &#8594; oil-impregnated' },
  { id: 'COP-0006', batchNo: 'COP-B2406', city: 'Kolkata', manufacturer: 'Hindustan Copper', powderGrade: 'Cu-Ag 99.97% Contact', application: 'Relay Contact (BEL)', copperPercent: 99.97, particleSizeUm: 15, investmentCr: 210, status: 'Delivered', priority: 'High', origin: 'Hindustan Copper Khetri (RJ)', destination: 'BEL Bengaluru (KA)', shipDate: '2026-07-20', transitDays: 3, zone: 'East', remarks: 'Cu-Ag 99.97% contact powder for BEL defence relay contact rivet &#8594; 99.97% Cu &#8594; &#8377;210Cr for 5 tonnes &#8594; India &#8377;6,300Cr defence Cu &#8594; BEL 100K relays &#8594; 15um PSD &#8594; P/M pressed &#8594; 30V 10A rated' },
  { id: 'COP-0007', batchNo: 'COP-B2407', city: 'Ahmedabad', manufacturer: 'Gujarat Copper Industries', powderGrade: 'Cu-Fe 95/5 P/M Steel', application: 'Structural Part (Mahindra)', copperPercent: 95.0, particleSizeUm: 60, investmentCr: 145, status: 'Delivered', priority: 'Medium', origin: 'Gujarat Copper Ahmedabad (GJ)', destination: 'Mahindra Nagpur (MH)', shipDate: '2026-07-21', transitDays: 2, zone: 'West', remarks: 'Cu-infiltrated Fe P/M powder for Mahindra XUV700 structural bracket &#8594; 95% Cu &#8594; &#8377;145Cr for 12 tonnes &#8594; India &#8377;4,350Cr auto Cu &#8594; Mahindra 500K SUVs &#8594; 60um PSD &#8594; 7.2 g/cc &#8594; infiltration' },
  { id: 'COP-0008', batchNo: 'COP-B2408', city: 'Jaipur', manufacturer: 'Rajasthan Copper', powderGrade: 'Cu-Zn 65/35 Brass', application: 'Valve Stem (Kirloskar)', copperPercent: 65.0, particleSizeUm: 40, investmentCr: 130, status: 'Delivered', priority: 'Medium', origin: 'Rajasthan Copper Jaipur (RJ)', destination: 'Kirloskar Pune (MH)', shipDate: '2026-07-22', transitDays: 2, zone: 'North', remarks: 'Cu-Zn 65/35 brass MIM powder for Kirloskar pump valve stem &#8594; 65% Cu &#8594; &#8377;130Cr for 8 tonnes &#8594; India &#8377;3,900Cr industrial Cu &#8594; Kirloskar 200K valves &#8594; 40um PSD &#8594; 7.5 g/cc sinter &#8594; dezinc resistant' },
  { id: 'COP-0009', batchNo: 'COP-B2409', city: 'Coimbatore', manufacturer: 'Tamil Nadu Copper', powderGrade: 'Cu-Al 95/5 Al Bronze', application: 'Marine Propeller (Cochin Shipyard)', copperPercent: 95.0, particleSizeUm: 80, investmentCr: 265, status: 'Delivered', priority: 'High', origin: 'Tamil Nadu Copper Coimbatore (TN)', destination: 'Cochin Shipyard Kochi (KL)', shipDate: '2026-07-23', transitDays: 1, zone: 'South', remarks: 'Cu-Al 5% bronze P/M compact for CSL patrol vessel propeller hub &#8594; 95% Cu &#8594; &#8377;265Cr for 6 tonnes &#8594; India &#8377;7,950Cr marine Cu &#8594; CSL 20 vessels &#8594; 80um PSD &#8594; 590 MPa UTS &#8594; seawater grade' },
  { id: 'COP-0010', batchNo: 'COP-B2410', city: 'Bhubaneswar', manufacturer: 'Odisha Copper', powderGrade: 'Cu-Ni-Si C7025', application: 'PCB Substrate (SCL)', copperPercent: 97.0, particleSizeUm: 20, investmentCr: 390, status: 'Delivered', priority: 'Critical', origin: 'Odisha Copper Bhubaneswar (OD)', destination: 'SCL Mohali (PB)', shipDate: '2026-07-24', transitDays: 3, zone: 'East', remarks: 'Cu-Ni-Si C7025 alloy powder for SCL 28nm IC leadframe substrate &#8594; 97% Cu &#8594; &#8377;390Cr for 4 tonnes &#8594; India &#8377;11,700Cr semi Cu &#8594; SCL 28nm line &#8594; 20um PSD &#8594; 600 MPa &#8594; 75% IACS' },
  { id: 'COP-0011', batchNo: 'COP-B2411', city: 'Guwahati', manufacturer: 'Assam Copper Works', powderGrade: 'Cu-Cr 99.5% Additive', application: '3D Print Heat Exch (GE India)', copperPercent: 99.5, particleSizeUm: 35, investmentCr: 480, status: 'Delivered', priority: 'Critical', origin: 'Assam Copper Guwahati (AS)', destination: 'GE India Pune (MH)', shipDate: '2026-07-25', transitDays: 4, zone: 'East', remarks: 'Cu-Cr alloy LPBF powder for GE India gas turbine HX 3D print &#8594; 99.5% Cu &#8594; &#8377;480Cr for 6 tonnes &#8594; India &#8377;14,400Cr AM Cu &#8594; GE 500 MW fleet &#8594; 35um PSD &#8594; D25 >10 &#8594; LPBF grade' },
  { id: 'COP-0012', batchNo: 'COP-B2412', city: 'Surat', manufacturer: 'Gujarat Copper Tech', powderGrade: 'Cu-Ni-P 97/2/1 PCB', application: 'PCB Plating (AT&S India)', copperPercent: 97.0, particleSizeUm: 8, investmentCr: 295, status: 'Delayed', priority: 'High', origin: 'Gujarat Copper Tech Surat (GJ)', destination: 'AT&S Bengaluru (KA)', shipDate: '2026-07-08', transitDays: 13, zone: 'West', remarks: 'Cu-Ni-P electroplating anode powder for AT&S HDI PCB panel &#8594; 97% Cu &#8594; &#8377;295Cr for 10 tonnes &#8594; India &#8377;8,850Cr PCB Cu &#8594; monsoon delay &#8594; 8um PSD &#8594; ball anode &#8594; 20um Cu plate &#8594; via fill' },
  { id: 'COP-0013', batchNo: 'COP-B2413', city: 'Noida', manufacturer: 'UP Copper Alloys', powderGrade: 'Cu-Be 98/2 Beryllium', application: 'Spring Connector (Molex)', copperPercent: 98.0, particleSizeUm: 45, investmentCr: 520, status: 'Delivered', priority: 'High', origin: 'UP Copper Noida (UP)', destination: 'Molex Bengaluru (KA)', shipDate: '2026-07-26', transitDays: 2, zone: 'North', remarks: 'Cu-2%Be alloy powder for Molex high-speed FPC connector spring contact &#8594; 98% Cu &#8594; &#8377;520Cr for 3 tonnes &#8594; India &#8377;15,600Cr electronics Cu &#8594; Molex 500M connectors &#8594; 45um PSD &#8594; 1200 MPa UTS &#8594; 42 HRC' },
  { id: 'COP-0014', batchNo: 'COP-B2414', city: 'Bhopal', manufacturer: 'BHEL', powderGrade: 'Cu-W 80/20 Contact', application: 'HV Switchgear (ABB India)', copperPercent: 80.0, particleSizeUm: 55, investmentCr: 195, status: 'Delivered', priority: 'Medium', origin: 'BHEL Bhopal (MP)', destination: 'ABB Vadodara (GJ)', shipDate: '2026-07-27', transitDays: 2, zone: 'North', remarks: 'Cu-W 80/20 infiltrated contact for ABB India 33 kV vacuum switchgear arc contact &#8594; 80% Cu &#8594; &#8377;195Cr for 8 tonnes &#8594; India &#8377;5,850Cr power Cu &#8594; ABB 800 switchgear/yr &#8594; 55um PSD &#8594; 13.5 g/cc &#8594; 25 kA rated' }
]

const delayedSet = new Set(copperPowderRecords.filter(r => r.status === 'Delayed').map(r => r.id))

export default function CopperPowderLogisticsView() {
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
    let data = copperPowderRecords
    if (search) data = data.filter(r => Object.values(r).some(v => String(v).toLowerCase().includes(search.toLowerCase())))
    Object.entries(filters).forEach(([k, vals]) => { if (vals.length) data = data.filter(r => vals.includes(String((r as any)[k]))) })
    return data
  }, [search, filters])

  const total = copperPowderRecords.length
  const delivered = copperPowderRecords.filter(r => r.status === 'Delivered').length
  const totalCr = copperPowderRecords.reduce((s: number, r) => s + r.investmentCr, 0)
  const avgCu = +(copperPowderRecords.reduce((s: number, r) => s + r.copperPercent, 0) / total).toFixed(1)

  const manufacturers = [...new Set(copperPowderRecords.map(r => r.manufacturer))]
  const zones = [...new Set(copperPowderRecords.map(r => r.zone))]

  return (
    <div className="space-y-6">
      <PageHeader title="Copper Powder Logistics" description="Indian copper powder supply chain tracking across PM sintering, aerospace rocket nozzle, naval piping, nuclear conductor, PCB plating, additive manufacturing, high-speed connector and HV switchgear sectors" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent><div className="text-2xl font-bold text-emerald-600">{total}</div><div className="text-xs text-muted-foreground">Total Shipments</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-emerald-600">{delivered}</div><div className="text-xs text-muted-foreground">Delivered</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-emerald-600">&#8377;{totalCr.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground">Total Investment</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-emerald-600">{avgCu}%</div><div className="text-xs text-muted-foreground">Avg Cu Content</div></CardContent></Card>
      </div>

      <div className="flex gap-2 border-b">
        {tabs.map((t, i) => (<button key={t} className={`px-4 py-2 ${activeTab === i ? 'border-b-2 border-emerald-600 text-emerald-600 font-semibold' : 'text-muted-foreground'}`} onClick={() => setActiveTab(i)}>{t}</button>))}
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
        <div className="rounded-md border"><div className="max-h-96 overflow-auto"><table className="w-full text-sm"><thead className="sticky top-0 bg-background"><tr><th className="p-2 text-left">ID</th><th className="p-2 text-left">Batch</th><th className="p-2 text-left">Grade</th><th className="p-2 text-left">Application</th><th className="p-2 text-right">Cu%</th><th className="p-2 text-right">&#8377;Cr</th><th className="p-2 text-left">Status</th></tr></thead><tbody>{filtered.map(r => (<tr key={r.id} className={`border-t ${delayedSet.has(r.id) ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}><td className="p-2">{r.id}</td><td className="p-2">{r.batchNo}</td><td className="p-2">{r.powderGrade}</td><td className="p-2">{r.application}</td><td className="p-2 text-right">{r.copperPercent}</td><td className="p-2 text-right">{r.investmentCr}</td><td className="p-2"><Badge variant={r.status === 'Delivered' ? 'default' : 'destructive'}>{r.status}</Badge></td></tr>))}</tbody></table></div></div>
      </div>)}

      {activeTab === 1 && (<div className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          {manufacturers.map(m => <Badge key={m} variant={filters.manufacturer?.includes(m) ? 'default' : 'outline'} className="cursor-pointer" onClick={() => toggleFilter('manufacturer', m)}>{m}</Badge>)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">By Manufacturer</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { m[r.manufacturer] = (m[r.manufacturer] || 0) + 1; return m }, {} as Record<string, number>)) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([m, c]) => (<div key={m} className="flex justify-between text-sm"><span>{m}</span><span className="font-medium">{c}</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Particle Size Range</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { const s = r.particleSizeUm <= 15 ? 'Ultra-Fine (0-15 um)' : r.particleSizeUm <= 40 ? 'Fine (16-40 um)' : r.particleSizeUm <= 80 ? 'Medium (41-80 um)' : 'Coarse (81+ um)'; m[s] = (m[s] || 0) + 1; return m }, {} as Record<string, number>)) as [string, number][]).map(([k, c]) => (<div key={k} className="flex justify-between text-sm"><span>{k}</span><span className="font-medium">{c}</span></div>))}</div></CardContent></Card>
        </div>
        <div className="rounded-md border"><div className="max-h-96 overflow-auto"><table className="w-full text-sm"><thead className="sticky top-0 bg-background"><tr><th className="p-2 text-left">ID</th><th className="p-2 text-left">Manufacturer</th><th className="p-2 text-left">Grade</th><th className="p-2 text-left">Origin</th><th className="p-2 text-left">Destination</th><th className="p-2 text-right">Transit</th><th className="p-2 text-left">Zone</th></tr></thead><tbody>{filtered.map(r => (<tr key={r.id} className={`border-t ${delayedSet.has(r.id) ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}><td className="p-2">{r.id}</td><td className="p-2">{r.manufacturer}</td><td className="p-2">{r.powderGrade}</td><td className="p-2">{r.origin}</td><td className="p-2">{r.destination}</td><td className="p-2 text-right">{r.transitDays}d</td><td className="p-2">{r.zone}</td></tr>))}</tbody></table></div></div>
      </div>)}

      {activeTab === 2 && (<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card><CardHeader><CardTitle className="text-sm">Investment by Application</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { m[r.application] = (m[r.application] || 0) + r.investmentCr; return m }, {} as Record<string, number>)) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 7).map(([a, v]) => (<div key={a} className="flex justify-between text-sm"><span>{a}</span><span className="font-medium">&#8377;{v}Cr</span></div>))}</div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Copper Purity Distribution</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { const n = r.copperPercent >= 99 ? 'Pure (99%+)' : r.copperPercent >= 90 ? 'High (90-99%)' : r.copperPercent >= 80 ? 'Medium (80-90%)' : 'Low (<80%)'; m[n] = (m[n] || 0) + 1; return m }, {} as Record<string, number>)) as [string, number][]).map(([k, c]) => (<div key={k} className="flex justify-between text-sm"><span>{k}</span><span className="font-medium">{c}</span></div>))}</div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Top Routes by Value</CardTitle></CardHeader><CardContent><div className="space-y-2">{filtered.sort((a, b) => b.investmentCr - a.investmentCr).slice(0, 7).map(r => (<div key={r.id} className="flex justify-between text-sm"><span>{r.origin.split('(')[0]} &#8594; {r.destination.split('(')[0]}</span><span className="font-medium">&#8377;{r.investmentCr}Cr</span></div>))}</div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">High-Purity Cu Powders</CardTitle></CardHeader><CardContent><div className="space-y-2">{filtered.filter(r => r.copperPercent >= 99).sort((a, b) => b.investmentCr - a.investmentCr).map(r => (<div key={r.id} className="flex justify-between text-sm"><span>{r.powderGrade} ({r.particleSizeUm}um)</span><span className="font-medium">&#8377;{r.investmentCr}Cr</span></div>))}</div></CardContent></Card>
      </div>)}

      {activeTab === 3 && (<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card><CardContent><div className="text-sm font-medium text-emerald-600 mb-2">India PM Copper Parts Market</div><div className="text-xs text-muted-foreground">Indian powder metallurgy market at &#8377;12,000Cr growing 12% CAGR. Automotive sintered brake pads, structural brackets and bush bearings driving 60 TPA copper powder demand. Hindalco Novelis and Hindustan Copper supplying 70% domestic. Bajaj, Mahindra and TVS consuming 25 TPA for two-wheeler sintered parts.</div></CardContent></Card>
        <Card><CardContent><div className="text-sm font-medium text-emerald-600 mb-2">ISRO Cu-Cr-Zr Nozzle Production</div><div className="text-xs text-muted-foreground">ISRO launching 12 missions/yr requiring 4 TPA Cu-Cr-Zr powder for PSLV/GSLV nozzle throat. DRDO DMRL and MIDHANI jointly producing HIP-compacted Cu-Cr-Zr with 80% IACS conductivity at 350&#176;C. India targeting 24 launches/yr by 2028, doubling Cu powder demand.</div></CardContent></Card>
        <Card><CardContent><div className="text-sm font-medium text-emerald-600 mb-2">Monsoon Disrupts PCB Plating Supply</div><div className="text-xs text-muted-foreground">COP-B2412 Cu-Ni-P plating anode powder for AT&S HDI PCB delayed 13 days due to Gujarat monsoon. Bengaluru electronics cluster at risk. India PCB market at &#8377;35,000Cr. AT&S supplying Apple, Samsung and小米. Recommend pre-positioning 10-tonne buffer at Bengaluru.</div></CardContent></Card>
        <Card><CardContent><div className="text-sm font-medium text-emerald-600 mb-2">Cu AM for Heat Exchangers</div><div className="text-xs text-muted-foreground">GE India, Wipro and L&T consuming 20 TPA Cu-Cr LPBF powder for gas turbine and rocket heat exchanger 3D printing. Cu AM offers 40% weight reduction with 95% thermal conductivity. DRDO and MIDHANI setting up 100 TPA Cu atomizer by 2027 for Atmanirbhar AM Cu supply.</div></CardContent></Card>
      </div>)}
    </div>
  )
}
