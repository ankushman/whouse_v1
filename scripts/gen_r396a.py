#!/usr/bin/env python3
"""Generate R396a: gold-alloy-logistics-view.tsx"""

content = r"""'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { Trophy } from 'lucide-react'

interface GoldRecord {
  id: string
  batchNo: string
  city: string
  manufacturer: string
  alloyGrade: string
  application: string
  goldKarat: number
  purityPercent: number
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

const goldRecords: GoldRecord[] = [
  { id: 'GOA-0001', batchNo: 'GOA-B2401', city: 'Mumbai', manufacturer: 'Mumbai Bullion Association', alloyGrade: '24K Fine Gold 999.9', application: 'Sovereign Gold Bond (RBI)', goldKarat: 24, purityPercent: 99.99, investmentCr: 4500, status: 'Delivered', priority: 'Critical', origin: 'Mumbai Bullion Mumbai (MH)', destination: 'RBI Mumbai (MH)', shipDate: '2026-07-15', transitDays: 0, zone: 'West', remarks: '24K fine gold for RBI SGB tranche 2026-IV \u2192 99.99% purity \u2192 \u20b94,500Cr for 2.5 tonnes \u2192 India \u20b918,000Cr/yr SGB \u2192 RBI 8 tranches \u2192 BIS hallmarked \u2192 999.9 fineness \u2192 London good delivery' },
  { id: 'GOA-0002', batchNo: 'GOA-B2402', city: 'Hyderabad', manufacturer: 'DRDO DMRL', alloyGrade: 'Au-Ni 95/5 Wire', application: 'Space Connector (ISRO)', goldKarat: 23, purityPercent: 95.0, investmentCr: 320, status: 'Delivered', priority: 'Critical', origin: 'DRDO DMRL Hyderabad (TG)', destination: 'ISRO Bengaluru (KA)', shipDate: '2026-07-16', transitDays: 1, zone: 'South', remarks: 'Au-Ni 95/5 wire for ISRO GSAT-7R satellite RF connector \u2192 95.0% Au \u2192 \u20b9320Cr for 40 kg \u2192 India \u20b98,000Cr space Au \u2192 ISRO 72 satellites \u2192 MIL-DTL-38999 \u2192 500 cycle mate \u2192 10 GHz rated' },
  { id: 'GOA-0003', batchNo: 'GOA-B2403', city: 'Bengaluru', manufacturer: 'BEL', alloyGrade: 'Au-Pt 90/10 Wire Bond', application: 'Chip Wire Bond (BEL)', goldKarat: 22, purityPercent: 90.0, investmentCr: 195, status: 'Delivered', priority: 'High', origin: 'BEL Bengaluru (KA)', destination: 'BEL Hyderabad (TG)', shipDate: '2026-07-17', transitDays: 1, zone: 'South', remarks: 'Au-Pt 90/10 wire bond for BEL AESA radar MMIC module \u2192 90.0% Au \u2192 \u20b9195Cr for 25 kg \u2192 India \u20b94,875Cr defence Au \u2192 BEL 100+ radar systems \u2192 25 micron diameter \u2192 thermosonic bond \u2192 5000 hr HTOL' },
  { id: 'GOA-0004', batchNo: 'GOA-B2404', city: 'Jaipur', manufacturer: 'Rajasthan Gold Refinery', alloyGrade: '22K Jewellery Alloy 916', application: 'Temple Gold (Tirupati Devasthanam)', goldKarat: 22, purityPercent: 91.6, investmentCr: 2800, status: 'Delivered', priority: 'High', origin: 'Rajasthan Gold Jaipur (RJ)', destination: 'Tirupati Devasthanam (AP)', shipDate: '2026-07-18', transitDays: 2, zone: 'North', remarks: '22K 916 gold for Tirupati Balaji temple ornament refurbishment \u2192 91.6% purity \u2192 \u20b92,800Cr for 1.8 tonnes \u2192 India \u20b950,000Cr temple gold \u2192 BIS certified \u2192 handcrafted \u2192 50K sq ft gold foil \u2192 Ag + Cu alloyed' },
  { id: 'GOA-0005', batchNo: 'GOA-B2405', city: 'Chennai', manufacturer: 'IGCAR', alloyGrade: 'Au-Ag 60/40 Brazing Alloy', application: 'Nuclear Fuel Clad (IGCAR)', goldKarat: 14, purityPercent: 60.0, investmentCr: 410, status: 'Delivered', priority: 'Critical', origin: 'IGCAR Kalpakkam (TN)', destination: 'NPCIL Kudankulam (TN)', shipDate: '2026-07-19', transitDays: 1, zone: 'South', remarks: 'Au-Ag 60/40 braze for PFBR fuel pin end cap seal \u2192 60.0% Au \u2192 \u20b9410Cr for 80 kg \u2192 India \u20b912,300Cr nuclear Au \u2192 IGCAR 500 MW FBR \u2192 850\u00b0C braze \u2192 helium leak tight \u2192 ASTM B694' },
  { id: 'GOA-0006', batchNo: 'GOA-B2406', city: 'Kolkata', manufacturer: 'Hindustan Gold', alloyGrade: '18K Rose Gold 750', application: 'Luxury Watch (Titan)', goldKarat: 18, purityPercent: 75.0, investmentCr: 185, status: 'Delivered', priority: 'Medium', origin: 'Hindustan Gold Kolkata (WB)', destination: 'Titan Hosur (TN)', shipDate: '2026-07-20', transitDays: 3, zone: 'East', remarks: '18K rose gold for Titan Edge luxury watch case \u2192 75.0% Au \u2192 \u20b9185Cr for 120 kg \u2192 India \u20b94,625Cr watch Au \u2192 Titan 500K watches/yr \u2192 Cu 22% Ag 3% \u2192 316L SS bezel paired \u2192 Swiss grade' },
  { id: 'GOA-0007', batchNo: 'GOA-B2407', city: 'Ahmedabad', manufacturer: 'Gujarat Gold Industries', alloyGrade: 'Au-Pd 50/50 Dental', application: 'Dental Crown (Sunstar Dental)', goldKarat: 12, purityPercent: 50.0, investmentCr: 95, status: 'Delivered', priority: 'Low', origin: 'Gujarat Gold Ahmedabad (GJ)', destination: 'Sunstar Dental Mumbai (MH)', shipDate: '2026-07-21', transitDays: 1, zone: 'West', remarks: 'Au-Pd 50/50 alloy for Sunstar dental crown and bridge \u2192 50.0% Au \u2192 \u20b995Cr for 15 kg \u2192 India \u20b92,375Cr dental Au \u2192 Sunstar 200K crowns/yr \u2192 ISO 6871 Type IV \u2192 VHN 220 \u2192 biocompatible' },
  { id: 'GOA-0008', batchNo: 'GOA-B2408', city: 'Coimbatore', manufacturer: 'Tamil Nadu Gold Works', alloyGrade: 'Au-Sn 80/20 Solder', application: 'LED Die Attach (Dixon Tech)', goldKarat: 19, purityPercent: 80.0, investmentCr: 145, status: 'Delivered', priority: 'Medium', origin: 'Tamil Nadu Gold Coimbatore (TN)', destination: 'Dixon Tech Noida (UP)', shipDate: '2026-07-22', transitDays: 2, zone: 'South', remarks: 'Au-Sn 80/20 preform solder for Dixon LED TV backlight die \u2192 80.0% Au \u2192 \u20b9145Cr for 18 kg \u2192 India \u20b93,625Cr LED Au \u2192 Dixon 10M TVs/yr \u2192 280\u00b0C eutectic \u2192 0.1mm preform \u2192 fluxless' },
  { id: 'GOA-0009', batchNo: 'GOA-B2409', city: 'Bhubaneswar', manufacturer: 'Odisha Gold Refinery', alloyGrade: 'Au-Be 99.6/0.4 Spring', application: 'Relay Contact (BHEL)', goldKarat: 24, purityPercent: 99.6, investmentCr: 260, status: 'Delivered', priority: 'High', origin: 'Odisha Gold Bhubaneswar (OD)', destination: 'BHEL Hyderabad (TG)', shipDate: '2026-07-23', transitDays: 2, zone: 'East', remarks: 'Au-Be 99.6 contact spring for BHEL 800 MW turbine relay \u2192 99.6% Au \u2192 \u20b9260Cr for 12 kg \u2192 India \u20b96,500Cr power Au \u2192 BHEL 150 GW fleet \u2192 VHN 130 \u2192 10 yr contact life \u2192 low contact resistance' },
  { id: 'GOA-0010', batchNo: 'GOA-B2410', city: 'Mumbai', manufacturer: 'Bombay Gold Exchange', alloyGrade: '24K Gold Bar LBMA', application: 'Central Bank Reserve (RBI)', goldKarat: 24, purityPercent: 99.99, investmentCr: 8500, status: 'Delivered', priority: 'Critical', origin: 'Bombay Gold Mumbai (MH)', destination: 'RBI Central Vault Mumbai (MH)', shipDate: '2026-07-24', transitDays: 0, zone: 'West', remarks: '24K LBMA good delivery bar for RBI foreign exchange reserve \u2192 99.99% purity \u2192 \u20b98,500Cr for 4.7 tonnes \u2192 India \u20b985,000Cr/yr reserve Au \u2192 RBI 850 tonnes total \u2192 400 oz bar \u2192 London LBMA chain \u2192 vault grade' },
  { id: 'GOA-0011', batchNo: 'GOA-B2411', city: 'Guwahati', manufacturer: 'Assam Gold Industries', alloyGrade: 'Au-Pt-Rh Contact', application: 'Medical Electrode (Narayana Health)', goldKarat: 20, purityPercent: 83.3, investmentCr: 165, status: 'Delayed', priority: 'High', origin: 'Assam Gold Guwahati (AS)', destination: 'Narayana Health Bengaluru (KA)', shipDate: '2026-07-12', transitDays: 8, zone: 'East', remarks: 'Au-Pt-Rh pacemaker electrode for Narayana cardiac implant \u2192 83.3% Au \u2192 \u20b9165Cr for 8 kg \u2192 India \u20b94,125Cr medical Au \u2192 monsoon delay \u2192 MRI compatible \u2192 99% signal integrity \u2192 ISO 14708-3' },
  { id: 'GOA-0012', batchNo: 'GOA-B2412', city: 'Surat', manufacturer: 'Gujarat Gold Technologies', alloyGrade: 'Au-Ag-Cu 18K TriAlloy', application: 'Electronics PCB (ISRO)', goldKarat: 18, purityPercent: 75.0, investmentCr: 220, status: 'Delivered', priority: 'High', origin: 'Gujarat Gold Tech Surat (GJ)', destination: 'ISRO Thiruvananthapuram (KL)', shipDate: '2026-07-25', transitDays: 2, zone: 'West', remarks: '18K tri-alloy for ISRO PSLV avionics PCB edge connector \u2192 75.0% Au \u2192 \u20b9220Cr for 35 kg \u2192 India \u20b95,500Cr space Au \u2192 ISRO 12 launches/yr \u2192 ENIG finish \u2192 0.05 micron Au \u2192 IPC 6012 Class 3' },
  { id: 'GOA-0013', batchNo: 'GOA-B2413', city: 'Noida', manufacturer: 'UP Gold Alloys', alloyGrade: 'Au-W 97/3 Target', application: 'X-ray Window (Wipro GE)', goldKarat: 23, purityPercent: 97.0, investmentCr: 340, status: 'Delivered', priority: 'High', origin: 'UP Gold Noida (UP)', destination: 'Wipro GE Bengaluru (KA)', shipDate: '2026-07-26', transitDays: 2, zone: 'North', remarks: 'Au-W 97/3 sputter target for Wipro GE CT scanner X-ray window \u2192 97.0% Au \u2192 \u20b9340Cr for 25 kg \u2192 India \u20b98,500Cr medical Au \u2192 GE 500 CT units \u2192 100 keV X-ray \u2192 2 mm thickness \u2192 low pinhole density' },
  { id: 'GOA-0014', batchNo: 'GOA-B2414', city: 'Delhi', manufacturer: 'Delhi Gold Refinery', alloyGrade: '24K Granules 999.5', application: 'Semiconductor Wire (SCL)', goldKarat: 24, purityPercent: 99.95, investmentCr: 280, status: 'Delivered', priority: 'Critical', origin: 'Delhi Gold Delhi (DL)', destination: 'SCL Mohali (PB)', shipDate: '2026-07-27', transitDays: 1, zone: 'North', remarks: '24K granules for SCL semiconductor wafer bonding wire \u2192 99.95% Au \u2192 \u20b9280Cr for 20 kg \u2192 India \u20b97,000Cr semi Au \u2192 SCL 500 wafer/day \u2192 25 micron wire \u2192 SEMI G5.5 \u2192 pull strength 8g' }
]

const delayedSet = new Set(goldRecords.filter(r => r.status === 'Delayed').map(r => r.id))

export default function GoldAlloyLogisticsView() {
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
    let data = goldRecords
    if (search) data = data.filter(r => Object.values(r).some(v => String(v).toLowerCase().includes(search.toLowerCase())))
    Object.entries(filters).forEach(([k, vals]) => { if (vals.length) data = data.filter(r => vals.includes(String((r as any)[k]))) })
    return data
  }, [search, filters])

  const total = goldRecords.length
  const delivered = goldRecords.filter(r => r.status === 'Delivered').length
  const totalCr = goldRecords.reduce((s: number, r) => s + r.investmentCr, 0)
  const avgKarat = +(goldRecords.reduce((s: number, r) => s + r.goldKarat, 0) / total).toFixed(1)

  const manufacturers = [...new Set(goldRecords.map(r => r.manufacturer))]
  const zones = [...new Set(goldRecords.map(r => r.zone))]

  return (
    <div className="space-y-6">
      <PageHeader title="Gold Alloy Logistics" description="Indian gold alloy supply chain tracking across sovereign reserves, aerospace, jewellery, dental, semiconductor and medical device sectors" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent><div className="text-2xl font-bold text-amber-600">{total}</div><div className="text-xs text-muted-foreground">Total Shipments</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-amber-600">{delivered}</div><div className="text-xs text-muted-foreground">Delivered</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-amber-600">&#8377;{totalCr.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground">Total Investment</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-amber-600">{avgKarat}K</div><div className="text-xs text-muted-foreground">Avg Karat</div></CardContent></Card>
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
        <div className="rounded-md border"><div className="max-h-96 overflow-auto"><table className="w-full text-sm"><thead className="sticky top-0 bg-background"><tr><th className="p-2 text-left">ID</th><th className="p-2 text-left">Batch</th><th className="p-2 text-left">Grade</th><th className="p-2 text-left">Application</th><th className="p-2 text-right">Karat</th><th className="p-2 text-right">&#8377;Cr</th><th className="p-2 text-left">Status</th></tr></thead><tbody>{filtered.map(r => (<tr key={r.id} className={`border-t ${delayedSet.has(r.id) ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}><td className="p-2">{r.id}</td><td className="p-2">{r.batchNo}</td><td className="p-2">{r.alloyGrade}</td><td className="p-2">{r.application}</td><td className="p-2 text-right">{r.goldKarat}K</td><td className="p-2 text-right">{r.investmentCr}</td><td className="p-2"><Badge variant={r.status === 'Delivered' ? 'default' : 'destructive'}>{r.status}</Badge></td></tr>))}</tbody></table></div></div>
      </div>)}

      {activeTab === 1 && (<div className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          {manufacturers.map(m => <Badge key={m} variant={filters.manufacturer?.includes(m) ? 'default' : 'outline'} className="cursor-pointer" onClick={() => toggleFilter('manufacturer', m)}>{m}</Badge>)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">By Manufacturer</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { m[r.manufacturer] = (m[r.manufacturer] || 0) + 1; return m }, {} as Record<string, number>)) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([m, c]) => (<div key={m} className="flex justify-between text-sm"><span>{m}</span><span className="font-medium">{c}</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Karat Range</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { const k = r.goldKarat >= 24 ? '24K Pure' : r.goldKarat >= 22 ? '22K Jewellery' : r.goldKarat >= 18 ? '18K Rose/White' : '12-16K Industrial'; m[k] = (m[k] || 0) + 1; return m }, {} as Record<string, number>)) as [string, number][]).map(([k, c]) => (<div key={k} className="flex justify-between text-sm"><span>{k}</span><span className="font-medium">{c}</span></div>))}</div></CardContent></Card>
        </div>
        <div className="rounded-md border"><div className="max-h-96 overflow-auto"><table className="w-full text-sm"><thead className="sticky top-0 bg-background"><tr><th className="p-2 text-left">ID</th><th className="p-2 text-left">Manufacturer</th><th className="p-2 text-left">Grade</th><th className="p-2 text-left">Origin</th><th className="p-2 text-left">Destination</th><th className="p-2 text-right">Transit</th><th className="p-2 text-left">Zone</th></tr></thead><tbody>{filtered.map(r => (<tr key={r.id} className={`border-t ${delayedSet.has(r.id) ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}><td className="p-2">{r.id}</td><td className="p-2">{r.manufacturer}</td><td className="p-2">{r.alloyGrade}</td><td className="p-2">{r.origin}</td><td className="p-2">{r.destination}</td><td className="p-2 text-right">{r.transitDays}d</td><td className="p-2">{r.zone}</td></tr>))}</tbody></table></div></div>
      </div>)}

      {activeTab === 2 && (<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card><CardHeader><CardTitle className="text-sm">Investment by Application</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { m[r.application] = (m[r.application] || 0) + r.investmentCr; return m }, {} as Record<string, number>)) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 7).map(([a, v]) => (<div key={a} className="flex justify-between text-sm"><span>{a}</span><span className="font-medium">&#8377;{v}Cr</span></div>))}</div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Purity Distribution</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { const p = r.purityPercent >= 99 ? 'Ultra-pure (>=99%)' : r.purityPercent >= 90 ? 'High (90-99%)' : r.purityPercent >= 75 ? 'Medium (75-90%)' : 'Alloyed (<75%)'; m[p] = (m[p] || 0) + 1; return m }, {} as Record<string, number>)) as [string, number][]).map(([k, c]) => (<div key={k} className="flex justify-between text-sm"><span>{k}</span><span className="font-medium">{c}</span></div>))}</div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Top Routes by Value</CardTitle></CardHeader><CardContent><div className="space-y-2">{filtered.sort((a, b) => b.investmentCr - a.investmentCr).slice(0, 7).map(r => (<div key={r.id} className="flex justify-between text-sm"><span>{r.origin.split('(')[0]} &#8594; {r.destination.split('(')[0]}</span><span className="font-medium">&#8377;{r.investmentCr}Cr</span></div>))}</div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Industrial vs Monetary Gold</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { const k = r.goldKarat >= 22 ? 'Monetary/Temple' : 'Industrial'; m[k] = (m[k] || 0) + r.investmentCr; return m }, {} as Record<string, number>)) as [string, number][]).map(([k, v]) => (<div key={k} className="flex justify-between text-sm"><span>{k}</span><span className="font-medium">&#8377;{v}Cr</span></div>))}</div></CardContent></Card>
      </div>)}

      {activeTab === 3 && (<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card><CardContent><div className="text-sm font-medium text-amber-600 mb-2">RBI Gold Reserve Expansion</div><div className="text-xs text-muted-foreground">RBI added 85 tonnes gold in FY26, taking total reserves to 850 tonnes. GOA-0010 and GOA-0001 represent &#8377;13,000Cr of monetary gold movement in July 2026 alone. India now 8th largest gold holder globally, targeting 1,000 tonnes by 2028.</div></CardContent></Card>
        <Card><CardContent><div className="text-sm font-medium text-amber-600 mb-2">Aerospace Gold Wire Demand</div><div className="text-xs text-muted-foreground">ISRO and DRDO consuming 120 kg/year gold wire for satellite RF connectors and MMIC wire bonds. Au-Ni and Au-Pt alloys preferred for reliability. MIL-DTL-38999 connectors alone consume 40 kg/year across BEL and TASL production lines.</div></CardContent></Card>
        <Card><CardContent><div className="text-sm font-medium text-amber-600 mb-2">Monsoon Disrupts Medical Gold</div><div className="text-xs text-muted-foreground">GOA-B2411 Au-Pt-Rh pacemaker electrode delayed 8 days due to Assam monsoon flooding. Narayana Health cardiac implant production line at risk. Recommend pre-stocking Bengaluru warehouse for East-North corridor during Q3 monsoon.</div></CardContent></Card>
        <Card><CardContent><div className="text-sm font-medium text-amber-600 mb-2">Semiconductor Gold Upsurge</div><div className="text-xs text-muted-foreground">India semiconductor gold demand growing at 45% CAGR driven by SCL Mohali fab, Tata Semiconductor and Micron Gujarat. Au wire bonding and Au ENIG finish are dominant applications. SCL targeting 100K wafer/month by 2027.</div></CardContent></Card>
      </div>)}
    </div>
  )
}
"""

with open('/home/z/my-project/src/components/modules/gold-alloy-logistics-view.tsx', 'w') as f:
    f.write(content)
print('gold-alloy OK')
