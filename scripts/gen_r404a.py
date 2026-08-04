#!/usr/bin/env python3
"""Generate aluminum-powder-logistics-view.tsx (R404a)"""
# RAW STRING to avoid Python f-string eating ${} and JSX <>

code = r"""'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared';
import { Sparkles } from 'lucide-react';

interface AluminumPowderRecord {
  id: string;
  batchNo: string;
  city: string;
  manufacturer: string;
  powderGrade: string;
  application: string;
  aluminumPercent: number;
  particleSizeUm: number;
  investmentCr: number;
  status: string;
  priority: string;
  origin: string;
  destination: string;
  shipDate: string;
  transitDays: number;
  zone: string;
  remarks: string;
}

const aluminumPowderRecords: AluminumPowderRecord[] = [
  { id: 'ALP-0001', batchNo: 'ALP-B2401', city: 'Mumbai', manufacturer: 'Hindalco Industries', powderGrade: 'Al 99.7% Water Atomized', application: 'Auto Body Panel (Tata Motors)', aluminumPercent: 99.7, particleSizeUm: 45, investmentCr: 520, status: 'Delivered', priority: 'Critical', origin: 'Hindalco Mahan Aluminium (MP)', destination: 'Tata Motors Pune (MH)', shipDate: '2026-07-15', transitDays: 1, zone: 'West', remarks: 'Water-atomized Al 99.7% for Tata Motors Nexon body-in-white structural MIM parts &#8594; 99.7% Al &#8594; &#8377;520Cr for 25 tonnes &#8594; India &#8377;15,600Cr auto Al powder &#8594; Tata 500K vehicles &#8594; 45um PSD &#8594; 280 MPa sintered &#8594; MIM grade' },
  { id: 'ALP-0002', batchNo: 'ALP-B2402', city: 'Bengaluru', manufacturer: 'NAL Aerospace Alloys', powderGrade: 'Al-7075 T6 Spherical', application: 'Aircraft Structure (HAL)', aluminumPercent: 90.0, particleSizeUm: 30, investmentCr: 680, status: 'Delivered', priority: 'Critical', origin: 'NAL Bengaluru (KA)', destination: 'HAL Bengaluru (KA)', shipDate: '2026-07-16', transitDays: 1, zone: 'South', remarks: 'Al-7075 T6 gas-atomized for HAL Tejas Mk2 wing spar LPBF AM &#8594; 90% Al with Zn-Mg-Cu &#8594; &#8377;680Cr for 8 tonnes &#8594; India &#8377;20,400Cr aero Al &#8594; HAL 123 Tejas &#8594; 30um PSD &#8594; 572 MPa UTS &#8594; LPBF grade' },
  { id: 'ALP-0003', batchNo: 'ALP-B2403', city: 'Chennai', manufacturer: 'DRDO DMRL', powderGrade: 'Al-6061 O Temper', application: 'Missile Airframe (DRDO)', aluminumPercent: 97.5, particleSizeUm: 50, investmentCr: 420, status: 'Delivered', priority: 'Critical', origin: 'DRDO DMRL Hyderabad (TG)', destination: 'DRDO Hyderabad (TG)', shipDate: '2026-07-17', transitDays: 1, zone: 'South', remarks: 'Al-6061 O temper for DRDO BrahMos missile fuselage AM &#8594; 97.5% Al with Mg-Si &#8594; &#8377;420Cr for 12 tonnes &#8594; India &#8377;12,600Cr defence Al &#8594; DRDO 200 BrahMos &#8594; 50um PSD &#8594; 310 MPa &#8594; HIP+sinter' },
  { id: 'ALP-0004', batchNo: 'ALP-B2404', city: 'Hyderabad', manufacturer: 'Bharat Forge', powderGrade: 'Al-2024 Spherical', application: 'Turbocharger Impeller (Bosch)', aluminumPercent: 93.5, particleSizeUm: 25, investmentCr: 385, status: 'Delivered', priority: 'High', origin: 'Bharat Forge Pune (MH)', destination: 'Bosch Bengaluru (KA)', shipDate: '2026-07-18', transitDays: 2, zone: 'South', remarks: 'Al-2024 Cu-alloyed powder for Bosch turbocharger compressor wheel &#8594; 93.5% Al with 4.4% Cu &#8594; &#8377;385Cr for 6 tonnes &#8594; India &#8377;11,550Cr auto Al &#8594; Bosch 50M turbos &#8594; 25um PSD &#8594; 350 MPa &#8594; MIM+HIP' },
  { id: 'ALP-0005', batchNo: 'ALP-B2405', city: 'Kolkata', manufacturer: 'SAIL', powderGrade: 'Al-Si10Mg Spherical', application: 'EV Motor Housing (Mahindra)', aluminumPercent: 89.7, particleSizeUm: 35, investmentCr: 310, status: 'Delivered', priority: 'High', origin: 'SAIL Durgapur (WB)', destination: 'Mahindra Pune (MH)', shipDate: '2026-07-19', transitDays: 2, zone: 'East', remarks: 'Al-Si10Mg eutectic for Mahindra XUV400 EV motor housing AM &#8594; 89.7% Al with 10% Si &#8594; &#8377;310Cr for 10 tonnes &#8594; India &#8377;9,300Cr EV Al &#8594; Mahindra 100K EVs &#8594; 35um PSD &#8594; 300 MPa &#8594; LPBF grade' },
  { id: 'ALP-0006', batchNo: 'ALP-B2406', city: 'Pune', manufacturer: 'Tata Advanced Materials', powderGrade: 'Al-Li 2090 Spherical', application: 'Satellite Panel (ISRO)', aluminumPercent: 96.5, particleSizeUm: 20, investmentCr: 590, status: 'Delivered', priority: 'Critical', origin: 'TAM Bengaluru (KA)', destination: 'ISRO Ahmedabad (GJ)', shipDate: '2026-07-20', transitDays: 2, zone: 'West', remarks: 'Al-Li 2090 lightweight alloy for ISRO GISAT-1 satellite panel &#8594; 96.5% Al with 2% Li &#8594; &#8377;590Cr for 4 tonnes &#8594; India &#8377;17,700Cr space Al &#8594; ISRO 12 sats &#8594; 20um PSD &#8594; 10% lighter &#8594; LPBF+HIP' },
  { id: 'ALP-0007', batchNo: 'ALP-B2407', city: 'Ahmedabad', manufacturer: 'Gujarat Al Powders', powderGrade: 'Al 99.99% Ultra-Pure', application: 'Semiconductor Bond Wire (SCL)', aluminumPercent: 99.99, particleSizeUm: 15, investmentCr: 175, status: 'Delivered', priority: 'High', origin: 'Gujarat Al Powders Vadodara (GJ)', destination: 'SCL Mohali (PB)', shipDate: '2026-07-21', transitDays: 1, zone: 'West', remarks: 'Ultra-pure Al wire for SCL semiconductor packaging ball bond &#8594; 99.99% Al &#8594; &#8377;175Cr for 2 tonnes &#8594; India &#8377;5,250Cr semi Al &#8594; SCL 5000 wafer starts &#8594; 15um wire &#8594; 25um gold ball &#8594; mil-spec' },
  { id: 'ALP-0008', batchNo: 'ALP-B2408', city: 'Jaipur', manufacturer: 'Rajasthan Al Alloys', powderGrade: 'Al-5083 H112', application: 'Shipbuilding Panel (Mazagon Dock)', aluminumPercent: 95.5, particleSizeUm: 80, investmentCr: 440, status: 'Delivered', priority: 'High', origin: 'Rajasthan Al Alloys Jaipur (RJ)', destination: 'Mazagon Dock Mumbai (MH)', shipDate: '2026-07-22', transitDays: 2, zone: 'North', remarks: 'Al-5083 marine-grade powder for MDL Scorpene submarine hull section MIM &#8594; 95.5% Al with Mg-Mn &#8594; &#8377;440Cr for 15 tonnes &#8594; India &#8377;13,200Cr marine Al &#8594; MDL 6 submarines &#8594; 80um PSD &#8594; 280 MPa &#8594; seawater' },
  { id: 'ALP-0009', batchNo: 'ALP-B2409', city: 'Coimbatore', manufacturer: 'Tamil Nadu Al Corp', powderGrade: 'Al-7Zn-2.5Mg-1.5Cu 7055', application: 'Landing Gear (HAL)', aluminumPercent: 89.0, particleSizeUm: 40, investmentCr: 620, status: 'Delivered', priority: 'Critical', origin: 'Tamil Nadu Al Corp Hosur (TN)', destination: 'HAL Bengaluru (KA)', shipDate: '2026-07-23', transitDays: 1, zone: 'South', remarks: 'Al-7055 ultra-high strength for HAL Tejas main landing gear forging &#8594; 89% Al with Zn-Mg-Cu &#8594; &#8377;620Cr for 8 tonnes &#8594; India &#8377;18,600Cr aero Al &#8594; HAL 123 Tejas &#8594; 40um PSD &#8594; 610 MPa UTS &#8594; forged billet' },
  { id: 'ALP-0010', batchNo: 'ALP-B2410', city: 'Bhubaneswar', manufacturer: 'NALCO', powderGrade: 'Al-Ni 4% IN905', application: 'Gas Turbine Blade (BHEL)', aluminumPercent: 95.5, particleSizeUm: 22, investmentCr: 380, status: 'Delivered', priority: 'Medium', origin: 'NALCO Bhubaneswar (OD)', destination: 'BHEL Hyderabad (TG)', shipDate: '2026-07-24', transitDays: 2, zone: 'East', remarks: 'Al-IN905 dispersion-strengthened for BHEL gas turbine blade root &#8594; 95.5% Al with 4% Ni &#8594; &#8377;380Cr for 5 tonnes &#8594; India &#8377;11,400Cr power Al &#8594; BHEL 42 turbines &#8594; 22um PSD &#8594; 320 MPa &#8594; ODS grade' },
  { id: 'ALP-0011', batchNo: 'ALP-B2411', city: 'Guwahati', manufacturer: 'Assam Al Industries', powderGrade: 'Al-Fe-Ni 2618', application: 'Piston Ring (Mahindra)', aluminumPercent: 92.5, particleSizeUm: 55, investmentCr: 195, status: 'Delivered', priority: 'Medium', origin: 'Assam Al Industries Guwahati (AS)', destination: 'Mahindra Nagpur (MH)', shipDate: '2026-07-25', transitDays: 4, zone: 'East', remarks: 'Al-2618 heat-resistant for Mahindra mHawk diesel piston ring &#8594; 92.5% Al with Fe-Ni &#8594; &#8377;195Cr for 10 tonnes &#8594; India &#8377;5,850Cr auto Al &#8594; Mahindra 2M engines &#8594; 55um PSD &#8594; 430 MPa &#8594; 200&#176;C stable' },
  { id: 'ALP-0012', batchNo: 'ALP-B2412', city: 'Surat', manufacturer: 'Gujarat Al Tech', powderGrade: 'Al-Si-7Mg-0.6 F357', application: 'Space Launch Vehicle (ISRO)', aluminumPercent: 90.3, particleSizeUm: 32, investmentCr: 710, status: 'Delayed', priority: 'Critical', origin: 'Gujarat Al Tech Surat (GJ)', destination: 'ISRO Sriharikota (AP)', shipDate: '2026-07-02', transitDays: 20, zone: 'West', remarks: 'F357 cast Al alloy for ISRO LVM3 rocket interstage adapter ring &#8594; 90.3% Al with Si-Mg &#8594; &#8377;710Cr for 18 tonnes &#8594; monsoon delay &#8594; India &#8377;21,300Cr space Al &#8594; ISRO 12 LVM3 &#8594; 32um PSD &#8594; 330 MPa &#8594; sand cast' },
  { id: 'ALP-0013', batchNo: 'ALP-B2413', city: 'Noida', manufacturer: 'UP Al Industries', powderGrade: 'Al-Mg4.5 5182', application: 'Can Body Sheet (Hindustan Tin)', aluminumPercent: 95.5, particleSizeUm: 65, investmentCr: 145, status: 'Delivered', priority: 'Medium', origin: 'UP Al Industries Noida (UP)', destination: 'Hindustan Tin Mumbai (MH)', shipDate: '2026-07-26', transitDays: 2, zone: 'North', remarks: 'Al-5182 for Hindustan Tin beverage can body stock &#8594; 95.5% Al with 4.5% Mg &#8594; &#8377;145Cr for 30 tonnes &#8594; India &#8377;4,350Cr packaging Al &#8594; Hindustan 5B cans &#8594; 65um PSD &#8594; 270 MPa &#8594; rolled sheet' },
  { id: 'ALP-0014', batchNo: 'ALP-B2414', city: 'Bhopal', manufacturer: 'BHEL', powderGrade: 'Al-Cu 2014 T6', application: 'Transformer Winding (BHEL)', aluminumPercent: 93.5, particleSizeUm: 100, investmentCr: 285, status: 'Delivered', priority: 'High', origin: 'BHEL Bhopal (MP)', destination: 'BHEL Bhopal (MP)', shipDate: '2026-07-27', transitDays: 1, zone: 'North', remarks: 'Al-2014 high-strength conductor for BHEL 800 MW transformer winding &#8594; 93.5% Al with 4.4% Cu &#8594; &#8377;285Cr for 20 tonnes &#8594; India &#8377;8,550Cr power Al &#8594; BHEL 150 GW &#8594; 100um PSD &#8594; 483 MPa &#8594; forged bar' }
];

const tabs = ['Dashboard', 'Registry', 'Analytics', 'Insights'] as const;
type Tab = typeof tabs[number];
const priorityColors: Record<string, string> = { Critical: 'bg-red-100 text-red-800', High: 'bg-amber-100 text-amber-800', Medium: 'bg-green-100 text-green-800', Low: 'bg-slate-100 text-slate-600' };
const delayedSet = new Set(aluminumPowderRecords.filter(r => r.status === 'Delayed').map(r => r.id));

export default function AluminumPowderLogisticsView() {
  const [activeTab, setActiveTab] = useState<Tab>('Dashboard');
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const toggleFilter = (k: string, v: string) => { setFilters(p => { const s = { ...p }; const a = s[k] || []; const i = a.indexOf(v); if (i > -1) { a.splice(i, 1); if (!a.length) delete s[k]; } else s[k] = [...a, v]; return s; }); };
  const filtered = useMemo(() => {
    let d = aluminumPowderRecords;
    if (search) { const q = search.toLowerCase(); d = d.filter(r => r.id.toLowerCase().includes(q) || r.batchNo.toLowerCase().includes(q) || r.powderGrade.toLowerCase().includes(q) || r.application.toLowerCase().includes(q) || r.city.toLowerCase().includes(q) || r.manufacturer.toLowerCase().includes(q)); }
    Object.entries(filters).forEach(([k, vs]) => { if (vs.length) d = d.filter(r => { const v = String((r as Record<string, unknown>)[k] ?? ''); return vs.some(x => v.toLowerCase().includes(x.toLowerCase())); }); });
    return d;
  }, [search, filters]);
  const totalCr = filtered.reduce((s: number, r) => s + r.investmentCr, 0);
  const avgAl = filtered.length ? filtered.reduce((s: number, r) => s + r.aluminumPercent, 0) / filtered.length : 0;
  const delayedCount = filtered.filter(r => r.status === 'Delayed').length;

  return (
    <div className="space-y-6">
      <PageHeader title="Aluminum Powder Logistics" description="Indian aluminum powder supply chain tracking and investment monitoring across defence, aerospace, automotive and semiconductor sectors" />
      <div className="flex gap-2 border-b">
        {tabs.map(t => (<button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-2 text-sm font-medium ${activeTab === t ? 'border-b-2 border-slate-500 text-slate-700' : 'text-muted-foreground hover:text-foreground'}`}>{t}</button>))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent><div className="text-2xl font-bold text-slate-600">{filtered.length}</div><div className="text-xs text-muted-foreground">Total Shipments</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-slate-600">&#8377;{totalCr.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground">Total Investment</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-slate-600">{avgAl.toFixed(1)}%</div><div className="text-xs text-muted-foreground">Avg Al Content</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-red-500">{delayedCount}</div><div className="text-xs text-muted-foreground">Delayed Shipments</div></CardContent></Card>
      </div>
      {(activeTab === 'Dashboard' || activeTab === 'Registry') && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <input placeholder="Search ID, grade, application, city..." value={search} onChange={e => setSearch(e.target.value)} className="border rounded-md px-3 py-1.5 text-sm flex-1 min-w-48" />
            {['status', 'priority', 'zone'].map(f => { const opts = [...new Set(aluminumPowderRecords.map(r => (r as Record<string, unknown>)[f] as string))]; return (<div key={f} className="flex flex-wrap gap-1">{opts.map(o => (<Badge key={o} variant={(filters[f] || []).includes(o) ? 'default' : 'outline'} className="cursor-pointer text-xs" onClick={() => toggleFilter(f, o)}>{o}</Badge>))}</div>); })}
          </div>
          <div className="rounded-md border"><div className="max-h-96 overflow-auto"><table className="w-full text-sm"><thead className="sticky top-0 bg-background"><tr><th className="p-2 text-left">ID</th><th className="p-2 text-left">Batch</th><th className="p-2 text-left">Grade</th><th className="p-2 text-left">Application</th><th className="p-2 text-right">Al%</th><th className="p-2 text-right">&#8377;Cr</th><th className="p-2 text-left">Status</th></tr></thead><tbody>{filtered.map(r => (<tr key={r.id} className={`border-t ${delayedSet.has(r.id) ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}><td className="p-2">{r.id}</td><td className="p-2">{r.batchNo}</td><td className="p-2">{r.powderGrade}</td><td className="p-2">{r.application}</td><td className="p-2 text-right">{r.aluminumPercent}</td><td className="p-2 text-right">{r.investmentCr}</td><td className="p-2"><Badge variant={r.status === 'Delivered' ? 'default' : 'destructive'}>{r.status}</Badge></td></tr>))}</tbody></table></div></div>
        </div>
      )}
      {(activeTab === 'Dashboard' || activeTab === 'Analytics') && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">Investment by Application</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { m[r.application] = (m[r.application] || 0) + r.investmentCr; return m }, {} as Record<string, number>)) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 7).map(([a, v]) => (<div key={a} className="flex justify-between text-sm"><span>{a}</span><span className="font-medium">&#8377;{v}Cr</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Shipments by Zone</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { m[r.zone] = (m[r.zone] || 0) + 1; return m }, {} as Record<string, number>)) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([z, c]) => (<div key={z} className="flex justify-between text-sm"><span>{z}</span><span className="font-medium">{c}</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Top Routes by Value</CardTitle></CardHeader><CardContent><div className="space-y-2">{filtered.sort((a, b) => b.investmentCr - a.investmentCr).slice(0, 7).map(r => (<div key={r.id} className="flex justify-between text-sm"><span>{r.origin.split('(')[0]} &#8594; {r.destination.split('(')[0]}</span><span className="font-medium">&#8377;{r.investmentCr}Cr</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Aerospace and Space Grade</CardTitle></CardHeader><CardContent><div className="space-y-2">{filtered.filter(r => r.application.toLowerCase().includes('aero') || r.application.toLowerCase().includes('satellite') || r.application.toLowerCase().includes('space') || r.application.toLowerCase().includes('landing')).sort((a, b) => b.investmentCr - a.investmentCr).map(r => (<div key={r.id} className="flex justify-between text-sm"><span>{r.powderGrade} ({r.particleSizeUm}um)</span><span className="font-medium">&#8377;{r.investmentCr}Cr</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">By Priority</CardTitle></CardHeader><CardContent><div className="space-y-2">{Object.entries(filtered.reduce((m, r) => { m[r.priority] = (m[r.priority] || 0) + 1; return m }, {} as Record<string, number>)).map(([p, c]) => (<div key={p} className="flex justify-between text-sm"><span className={priorityColors[p] || ''}>{p}</span><span className="font-medium">{c}</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Al Content Distribution</CardTitle></CardHeader><CardContent><div className="space-y-2">{[{ l: 'Ultra-High (99%+)', f: filtered.filter(r => r.aluminumPercent >= 99).length }, { l: 'High (95-99%)', f: filtered.filter(r => r.aluminumPercent >= 95 && r.aluminumPercent < 99).length }, { l: 'Medium (90-95%)', f: filtered.filter(r => r.aluminumPercent >= 90 && r.aluminumPercent < 95).length }, { l: 'Standard (<90%)', f: filtered.filter(r => r.aluminumPercent < 90).length }].map(b => (<div key={b.l} className="flex justify-between text-sm"><span>{b.l}</span><span className="font-medium">{b.f}</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Top Manufacturers</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { m[r.manufacturer] = (m[r.manufacturer] || 0) + r.investmentCr; return m }, {} as Record<string, number>)) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 7).map(([m, v]) => (<div key={m} className="flex justify-between text-sm"><span>{m}</span><span className="font-medium">&#8377;{v}Cr</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Avg Transit Days</CardTitle></CardHeader><CardContent><div className="space-y-2">{filtered.length ? (Object.entries(filtered.reduce((m, r) => { m[r.zone] = (m[r.zone] || [] as number[]).concat(r.transitDays); return m }, {} as Record<string, number[]>)) as [string, number[]][]).map(([z, d]) => (<div key={z} className="flex justify-between text-sm"><span>{z}</span><span className="font-medium">{(d.reduce((s, n) => s + n, 0) / d.length).toFixed(1)}d</span></div>)) : []}</div></CardContent></Card>
        </div>
      )}
      {(activeTab === 'Dashboard' || activeTab === 'Insights') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card><CardContent><div className="text-sm font-medium text-slate-600 mb-2">LVM3 Rocket Al Demand Surge</div><div className="text-xs text-muted-foreground">ISRO LVM3 launch cadence increasing to 12 per year by 2028, requiring 200+ tonnes of Al-Si cast alloy for interstage rings and payload fairings. Gujarat Al Tech is scaling F357 powder production to 100 TPA. ISRO targeting &#8377;76,000Cr commercial launch revenue by 2030 with private players like Skyroot and Agnikul adding Al AM demand.</div></CardContent></Card>
          <Card><CardContent><div className="text-sm font-medium text-slate-600 mb-2">Tejas Mk2 7075 Wing AM</div><div className="text-xs text-muted-foreground">HAL producing 123 Tejas Mk2 with 7075-T6 LPBF wing spar sections replacing machined billets. 572 MPa UTS from gas-atomized powder exceeds wrought 538 MPa. NAL developing Al-7075+Sc modified alloy targeting 620 MPa for next-gen LCA Mk3. India allocating &#8377;45,000Cr for AM aerospace alloys under iDEX programme.</div></CardContent></Card>
          <Card><CardContent><div className="text-sm font-medium text-slate-600 mb-2">Semiconductor Packaging Al Wire</div><div className="text-xs text-muted-foreground">SCL Mohali expanding 28nm fab capacity requiring ultra-pure 99.99% Al bond wire at 2 TPA. Gujarat Al Powders is sole Indian supplier. India targeting 10 fab nodes under &#8377;76,000Cr semiconductor mission. Al wire replacing Au for cost savings in consumer IC packaging.</div></CardContent></Card>
          <Card><CardContent><div className="text-sm font-medium text-slate-600 mb-2">Mahindra EV Lightweighting</div><div className="text-xs text-muted-foreground">Mahindra XUV400 and Born Electric platform adopting Al-Si10Mg LPBF for motor housings and battery enclosures. 30% weight saving vs cast iron. Gujarat Al Powders and Tamil Nadu Al Corp supplying 50 TPA for automotive AM. India EV powder Al market projected &#8377;8,500Cr by 2030.</div></CardContent></Card>
        </div>
      )}
    </div>
  );
}
"""

import os
outpath = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'src', 'components', 'modules', 'aluminum-powder-logistics-view.tsx')
outpath = os.path.normpath(outpath)
with open(outpath, 'w') as f:
    f.write(code.strip() + '\n')
print(f"Generated: {outpath}")
print(f"Size: {os.path.getsize(outpath)} bytes")
