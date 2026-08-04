#!/usr/bin/env python3
"""Generate vanadium-powder-logistics-view.tsx (R406a)"""

code = r"""'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared';
import { Flame } from 'lucide-react';

interface VanadiumPowderRecord {
  id: string;
  batchNo: string;
  city: string;
  manufacturer: string;
  powderGrade: string;
  application: string;
  vanadiumPercent: number;
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

const vanadiumPowderRecords: VanadiumPowderRecord[] = [
  { id: 'VNP-0001', batchNo: 'VNP-B2401', city: 'Mumbai', manufacturer: 'MIDHANI', powderGrade: 'V-4Cr-4Ti Ti-6Al-4V Feed', application: 'Aero Structure (HAL)', vanadiumPercent: 4.0, particleSizeUm: 45, investmentCr: 520, status: 'Delivered', priority: 'Critical', origin: 'MIDHANI Hyderabad (TG)', destination: 'HAL Bengaluru (KA)', shipDate: '2026-07-15', transitDays: 2, zone: 'West', remarks: 'V-4Cr-4Ti master alloy for HAL Tejas Mk2 Ti-6Al-4V wing spar VIM melting &#8594; 4% V with Cr-Ti &#8594; &#8377;520Cr for 10 tonnes &#8594; India &#8377;15,600Cr aero V &#8594; HAL 123 Tejas &#8594; 45um PSD &#8594; VIM+VAR &#8594; AMS 4928' },
  { id: 'VNP-0002', batchNo: 'VNP-B2402', city: 'Bengaluru', manufacturer: 'DRDO DMRL', powderGrade: 'FeV 50% Ferrovanadium', application: 'Rail Steel (SAIL)', vanadiumPercent: 50.0, particleSizeUm: 500, investmentCr: 280, status: 'Delivered', priority: 'Critical', origin: 'DRDO DMRL Hyderabad (TG)', destination: 'SAIL Bhilai (CG)', shipDate: '2026-07-16', transitDays: 2, zone: 'South', remarks: 'FeV 50% ferrovanadium for SAIL Vande Bharat express rail HSLA steel &#8594; 50% V with Fe &#8594; &#8377;280Cr for 200 tonnes &#8594; India &#8377;8,400Cr rail V &#8594; SAIL 600 km track &#8594; 500um lumpy &#8594; 0.15% V in steel &#8594; aluminothermic' },
  { id: 'VNP-0003', batchNo: 'VNP-B2403', city: 'Chennai', manufacturer: 'IGCAR', powderGrade: 'V-4Cr-4Ti Nuclear Grade', application: 'Fast Breeder Blanket (IGCAR)', vanadiumPercent: 92.0, particleSizeUm: 100, investmentCr: 460, status: 'Delivered', priority: 'Critical', origin: 'IGCAR Kalpakkam (TN)', destination: 'BHAVINI Kalpakkam (TN)', shipDate: '2026-07-17', transitDays: 1, zone: 'South', remarks: 'V-4Cr-4Ti alloy for BHAVINI PFBR sodium-cooled fast reactor blanket &#8594; 92% V with Cr-Ti &#8594; &#8377;460Cr for 6 tonnes &#8594; India &#8377;13,800Cr nuclear V &#8594; BHAVINI 500 MW &#8594; 100um &#8594; 600&#176;C Na &#8594; NBS' },
  { id: 'VNP-0004', batchNo: 'VNP-B2404', city: 'Hyderabad', manufacturer: 'Bharat Forge', powderGrade: 'FeV 80% High-Purity', application: 'Auto Spring Steel (Bajaj)', vanadiumPercent: 80.0, particleSizeUm: 300, investmentCr: 195, status: 'Delivered', priority: 'High', origin: 'Bharat Forge Pune (MH)', destination: 'Bajaj Auto Pune (MH)', shipDate: '2026-07-18', transitDays: 1, zone: 'South', remarks: 'FeV 80% high-purity for Bajaj KTM Duke suspension spring steel &#8594; 80% V with Fe &#8594; &#8377;195Cr for 50 tonnes &#8594; India &#8377;5,850Cr auto V &#8594; Bajaj 10M bikes &#8594; 300um &#8594; 0.25% V &#8594; carbothermic' },
  { id: 'VNP-0005', batchNo: 'VNP-B2405', city: 'Kolkata', manufacturer: 'SAIL', powderGrade: 'VN Micro-Alloy Addition', application: 'HSLA Plate (Tata Steel)', vanadiumPercent: 78.0, particleSizeUm: 50, investmentCr: 165, status: 'Delivered', priority: 'High', origin: 'SAIL Rourkela (OD)', destination: 'Tata Steel Jamshedpur (JH)', shipDate: '2026-07-19', transitDays: 2, zone: 'East', remarks: 'Vanadium nitride micro-alloy for Tata Steel HSLA truck chassis plate &#8594; 78% V as VN &#8594; &#8377;165Cr for 30 tonnes &#8594; India &#8377;4,950Cr steel V &#8594; Tata 35 MTPA &#8594; 50um &#8594; 0.08% V &#8594; nitrided' },
  { id: 'VNP-0006', batchNo: 'VNP-B2406', city: 'Pune', manufacturer: 'Tata Advanced Materials', powderGrade: 'V-5Cr-5Ti AM Powder', application: 'Space Thruster (ISRO)', vanadiumPercent: 90.0, particleSizeUm: 30, investmentCr: 580, status: 'Delivered', priority: 'Critical', origin: 'TAM Bengaluru (KA)', destination: 'ISRO LPSC Thiruvananthapuram (KL)', shipDate: '2026-07-20', transitDays: 3, zone: 'West', remarks: 'V-5Cr-5Ti gas-atomized for ISRO Gaganyaan thruster nozzle LPBF &#8594; 90% V with Cr-Ti &#8594; &#8377;580Cr for 3 tonnes &#8594; India &#8377;17,400Cr space V &#8594; ISRO Gaganyaan &#8594; 30um PSD &#8594; 700&#176;C &#8594; LPBF grade' },
  { id: 'VNP-0007', batchNo: 'VNP-B2407', city: 'Ahmedabad', manufacturer: 'Gujarat Vanadium', powderGrade: 'V2O5 99.5% Vanadium Pentoxide', application: 'Petrochemical Catalyst (Reliance)', vanadiumPercent: 56.1, particleSizeUm: 200, investmentCr: 310, status: 'Delivered', priority: 'High', origin: 'Gujarat Vanadium Vadodara (GJ)', destination: 'Reliance Jamnagar (GJ)', shipDate: '2026-07-21', transitDays: 1, zone: 'West', remarks: 'V2O5 pentoxide for Reliance Haldia petrochemical sulphuric acid catalyst &#8594; 56.1% V as V2O5 &#8594; &#8377;310Cr for 15 tonnes &#8594; India &#8377;9,300Cr petrochem V &#8594; Reliance 60 MTPA &#8594; 200um &#8594; contact process &#8594; kiln dried' },
  { id: 'VNP-0008', batchNo: 'VNP-B2408', city: 'Jaipur', manufacturer: 'Rajasthan Vanadium', powderGrade: 'NH4VO3 99% Ammonium Metavanadate', application: 'VRFB Battery (BEL)', vanadiumPercent: 43.6, particleSizeUm: 150, investmentCr: 420, status: 'Delivered', priority: 'Critical', origin: 'Rajasthan Vanadium Jaipur (RJ)', destination: 'BEL Bengaluru (KA)', shipDate: '2026-07-22', transitDays: 2, zone: 'North', remarks: 'NH4VO3 for BEL vanadium redox flow battery 50kW military UPS electrolyte &#8594; 43.6% V as NH4VO3 &#8594; &#8377;420Cr for 8 tonnes &#8594; India &#8377;12,600Cr energy V &#8594; BEL 500 units &#8594; 150um &#8594; 1.6M VOSO4 &#8594; dissolved' },
  { id: 'VNP-0009', batchNo: 'VNP-B2409', city: 'Coimbatore', manufacturer: 'Tamil Nadu Vanadium', powderGrade: 'FeV 70% Standard Grade', application: 'Rebar Steel (JSW Steel)', vanadiumPercent: 70.0, particleSizeUm: 400, investmentCr: 135, status: 'Delivered', priority: 'Medium', origin: 'Tamil Nadu Vanadium Hosur (TN)', destination: 'JSW Salem (TN)', shipDate: '2026-07-23', transitDays: 1, zone: 'South', remarks: 'FeV 70% for JSW TMT500D seismic-grade rebar micro-alloying &#8594; 70% V with Fe &#8594; &#8377;135Cr for 80 tonnes &#8594; India &#8377;4,050Cr steel V &#8594; JSW 12 MTPA &#8594; 400um &#8594; 0.06% V &#8594; aluminothermic' },
  { id: 'VNP-0010', batchNo: 'VNP-B2410', city: 'Bhubaneswar', manufacturer: 'NALCO', powderGrade: 'V2O5 98% Slag-Derived', application: 'Titanium Dioxide (Kumar Metachem)', vanadiumPercent: 55.5, particleSizeUm: 250, investmentCr: 110, status: 'Delivered', priority: 'Low', origin: 'NALCO Damanjodi (OD)', destination: 'Kumar Metachem Mumbai (MH)', shipDate: '2026-07-24', transitDays: 3, zone: 'East', remarks: 'V2O5 slag by-product from ilmenite processing for Kumar TiO2 pigment co-production &#8594; 55.5% V as V2O5 &#8594; &#8377;110Cr for 25 tonnes &#8594; India &#8377;3,300Cr pigment V &#8594; Kumar 100 KTPA &#8594; 250um &#8594; slag roast &#8594; co-product' },
  { id: 'VNP-0011', batchNo: 'VNP-B2411', city: 'Guwahati', manufacturer: 'Assam Vanadium', powderGrade: 'FeV 60% Lumpy', application: 'Tool Steel (Bharat Forge)', vanadiumPercent: 60.0, particleSizeUm: 600, investmentCr: 245, status: 'Delivered', priority: 'High', origin: 'Assam Vanadium Guwahati (AS)', destination: 'Bharat Forge Pune (MH)', shipDate: '2026-07-25', transitDays: 4, zone: 'East', remarks: 'FeV 60% for Bharat Forge H13 hot-work tool steel die casting &#8594; 60% V with Fe &#8594; &#8377;245Cr for 40 tonnes &#8594; India &#8377;7,350Cr tool V &#8594; Bharat 200 dies &#8594; 600um lumpy &#8594; 5% V in H13 &#8594; silicothermic' },
  { id: 'VNP-0012', batchNo: 'VNP-B2412', city: 'Surat', manufacturer: 'Gujarat Vanadium Tech', powderGrade: 'V2O5 99.9% Battery Grade', application: 'Grid Storage (Tata Power Solar)', vanadiumPercent: 56.1, particleSizeUm: 80, investmentCr: 380, status: 'Delayed', priority: 'Critical', origin: 'Gujarat Vanadium Tech Surat (GJ)', destination: 'Tata Power Solar Bengaluru (KA)', shipDate: '2026-07-02', transitDays: 24, zone: 'West', remarks: 'Ultra-pure V2O5 for Tata Power Solar 10MWh grid-scale VRFB electrolyte &#8594; 56.1% V as V2O5 &#8594; &#8377;380Cr for 5 tonnes &#8594; monsoon delay &#8594; India &#8377;11,400Cr energy V &#8594; Tata 100 MWh &#8594; 80um &#8594; 2M VOSO4 &#8594; battery grade' },
  { id: 'VNP-0013', batchNo: 'VNP-B2413', city: 'Noida', manufacturer: 'UP Vanadium', powderGrade: 'V-Mo-Ti 9Cr Aero Superalloy', application: 'Aero Engine (Wipro Aero)', vanadiumPercent: 5.5, particleSizeUm: 35, investmentCr: 510, status: 'Delivered', priority: 'Critical', origin: 'UP Vanadium Noida (UP)', destination: 'Wipro Aero Bengaluru (KA)', shipDate: '2026-07-26', transitDays: 2, zone: 'North', remarks: 'V-Mo-Ti-Cr superalloy powder for Wipro Aero GE F414 engine compressor disc LDM &#8594; 5.5% V with Mo-Ti-Cr &#8594; &#8377;510Cr for 4 tonnes &#8594; India &#8377;15,300Cr aero V &#8594; Wipro 200 engines &#8594; 35um PSD &#8594; 650&#176;C &#8594; VIM+HIP' },
  { id: 'VNP-0014', batchNo: 'VNP-B2414', city: 'Bhopal', manufacturer: 'BHEL', powderGrade: 'V2O5 97% Flue Gas SCR', application: 'Power Plant Emission (BHEL)', vanadiumPercent: 54.7, particleSizeUm: 120, investmentCr: 185, status: 'Delivered', priority: 'High', origin: 'BHEL Bhopal (MP)', destination: 'BHEL Haridwar (UK)', shipDate: '2026-07-27', transitDays: 2, zone: 'North', remarks: 'V2O5-WO3/TiO2 SCR catalyst for BHEL 800MW coal plant DeNOx &#8594; 54.7% V as V2O5 &#8594; &#8377;185Cr for 12 tonnes &#8594; India &#8377;5,550Cr power V &#8594; BHEL 150 GW &#8594; 120um extrudate &#8594; 350&#176;C &#8594; honeycomb' }
];

const tabs = ['Dashboard', 'Registry', 'Analytics', 'Insights'] as const;
type Tab = typeof tabs[number];
const priorityColors: Record<string, string> = { Critical: 'bg-red-100 text-red-800', High: 'bg-amber-100 text-amber-800', Medium: 'bg-green-100 text-green-800', Low: 'bg-slate-100 text-slate-600' };
const delayedSet = new Set(vanadiumPowderRecords.filter(r => r.status === 'Delayed').map(r => r.id));

export default function VanadiumPowderLogisticsView() {
  const [activeTab, setActiveTab] = useState<Tab>('Dashboard');
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const toggleFilter = (k: string, v: string) => { setFilters(p => { const s = { ...p }; const a = s[k] || []; const i = a.indexOf(v); if (i > -1) { a.splice(i, 1); if (!a.length) delete s[k]; } else s[k] = [...a, v]; return s; }); };
  const filtered = useMemo(() => {
    let d = vanadiumPowderRecords;
    if (search) { const q = search.toLowerCase(); d = d.filter(r => r.id.toLowerCase().includes(q) || r.batchNo.toLowerCase().includes(q) || r.powderGrade.toLowerCase().includes(q) || r.application.toLowerCase().includes(q) || r.city.toLowerCase().includes(q) || r.manufacturer.toLowerCase().includes(q)); }
    Object.entries(filters).forEach(([k, vs]) => { if (vs.length) d = d.filter(r => { const v = String((r as unknown as Record<string, unknown>)[k] ?? ''); return vs.some(x => v.toLowerCase().includes(x.toLowerCase())); }); });
    return d;
  }, [search, filters]);
  const totalCr = filtered.reduce((s: number, r) => s + r.investmentCr, 0);
  const avgV = filtered.length ? filtered.reduce((s: number, r) => s + r.vanadiumPercent, 0) / filtered.length : 0;
  const delayedCount = filtered.filter(r => r.status === 'Delayed').length;

  return (
    <div className="space-y-6">
      <PageHeader title="Vanadium Powder Logistics" description="Indian vanadium powder supply chain tracking for aerospace alloys, steel micro-alloying, energy storage VRFB, nuclear and petrochemical catalysts" />
      <div className="flex gap-2 border-b">
        {tabs.map(t => (<button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-2 text-sm font-medium ${activeTab === t ? 'border-b-2 border-emerald-500 text-emerald-700' : 'text-muted-foreground hover:text-foreground'}`}>{t}</button>))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent><div className="text-2xl font-bold text-emerald-600">{filtered.length}</div><div className="text-xs text-muted-foreground">Total Shipments</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-emerald-600">&#8377;{totalCr.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground">Total Investment</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-emerald-600">{avgV.toFixed(1)}%</div><div className="text-xs text-muted-foreground">Avg V Content</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-red-500">{delayedCount}</div><div className="text-xs text-muted-foreground">Delayed Shipments</div></CardContent></Card>
      </div>
      {(activeTab === 'Dashboard' || activeTab === 'Registry') && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <input placeholder="Search ID, grade, application, city..." value={search} onChange={e => setSearch(e.target.value)} className="border rounded-md px-3 py-1.5 text-sm flex-1 min-w-48" />
            {['status', 'priority', 'zone'].map(f => { const opts = [...new Set(vanadiumPowderRecords.map(r => (r as unknown as Record<string, unknown>)[f] as string))]; return (<div key={f} className="flex flex-wrap gap-1">{opts.map(o => (<Badge key={o} variant={(filters[f] || []).includes(o) ? 'default' : 'outline'} className="cursor-pointer text-xs" onClick={() => toggleFilter(f, o)}>{o}</Badge>))}</div>); })}
          </div>
          <div className="rounded-md border"><div className="max-h-96 overflow-auto"><table className="w-full text-sm"><thead className="sticky top-0 bg-background"><tr><th className="p-2 text-left">ID</th><th className="p-2 text-left">Batch</th><th className="p-2 text-left">Grade</th><th className="p-2 text-left">Application</th><th className="p-2 text-right">V%</th><th className="p-2 text-right">&#8377;Cr</th><th className="p-2 text-left">Status</th></tr></thead><tbody>{filtered.map(r => (<tr key={r.id} className={`border-t ${delayedSet.has(r.id) ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}><td className="p-2">{r.id}</td><td className="p-2">{r.batchNo}</td><td className="p-2">{r.powderGrade}</td><td className="p-2">{r.application}</td><td className="p-2 text-right">{r.vanadiumPercent}</td><td className="p-2 text-right">{r.investmentCr}</td><td className="p-2"><Badge variant={r.status === 'Delivered' ? 'default' : 'destructive'}>{r.status}</Badge></td></tr>))}</tbody></table></div></div>
        </div>
      )}
      {(activeTab === 'Dashboard' || activeTab === 'Analytics') && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">Investment by Application</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { m[r.application] = (m[r.application] || 0) + r.investmentCr; return m }, {} as Record<string, number>)) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 7).map(([a, v]) => (<div key={a} className="flex justify-between text-sm"><span>{a}</span><span className="font-medium">&#8377;{v}Cr</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Shipments by Zone</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { m[r.zone] = (m[r.zone] || 0) + 1; return m }, {} as Record<string, number>)) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([z, c]) => (<div key={z} className="flex justify-between text-sm"><span>{z}</span><span className="font-medium">{c}</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Top Routes by Value</CardTitle></CardHeader><CardContent><div className="space-y-2">{filtered.sort((a, b) => b.investmentCr - a.investmentCr).slice(0, 7).map(r => (<div key={r.id} className="flex justify-between text-sm"><span>{r.origin.split('(')[0]} &#8594; {r.destination.split('(')[0]}</span><span className="font-medium">&#8377;{r.investmentCr}Cr</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Aerospace and Defence Grade</CardTitle></CardHeader><CardContent><div className="space-y-2">{filtered.filter(r => r.application.toLowerCase().includes('aero') || r.application.toLowerCase().includes('nuclear') || r.application.toLowerCase().includes('space') || r.application.toLowerCase().includes('engine') || r.application.toLowerCase().includes('defence') || r.application.toLowerCase().includes('military')).sort((a, b) => b.investmentCr - a.investmentCr).map(r => (<div key={r.id} className="flex justify-between text-sm"><span>{r.powderGrade} ({r.particleSizeUm}um)</span><span className="font-medium">&#8377;{r.investmentCr}Cr</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">By Priority</CardTitle></CardHeader><CardContent><div className="space-y-2">{Object.entries(filtered.reduce((m, r) => { m[r.priority] = (m[r.priority] || 0) + 1; return m }, {} as Record<string, number>)).map(([p, c]) => (<div key={p} className="flex justify-between text-sm"><span className={priorityColors[p] || ''}>{p}</span><span className="font-medium">{c}</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">V Content Distribution</CardTitle></CardHeader><CardContent><div className="space-y-2">{[{ l: 'Pure/Alloy (70%+)', f: filtered.filter(r => r.vanadiumPercent >= 70).length }, { l: 'Medium Compound (50-70%)', f: filtered.filter(r => r.vanadiumPercent >= 50 && r.vanadiumPercent < 70).length }, { l: 'Low Alloy (5-50%)', f: filtered.filter(r => r.vanadiumPercent >= 5 && r.vanadiumPercent < 50).length }, { l: 'Micro (<5%)', f: filtered.filter(r => r.vanadiumPercent < 5).length }].map(b => (<div key={b.l} className="flex justify-between text-sm"><span>{b.l}</span><span className="font-medium">{b.f}</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Top Manufacturers</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { m[r.manufacturer] = (m[r.manufacturer] || 0) + r.investmentCr; return m }, {} as Record<string, number>)) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 7).map(([m, v]) => (<div key={m} className="flex justify-between text-sm"><span>{m}</span><span className="font-medium">&#8377;{v}Cr</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Avg Transit Days</CardTitle></CardHeader><CardContent><div className="space-y-2">{filtered.length ? (Object.entries(filtered.reduce((m, r) => { m[r.zone] = (m[r.zone] || [] as number[]).concat(r.transitDays); return m }, {} as Record<string, number[]>)) as [string, number[]][]).map(([z, d]) => (<div key={z} className="flex justify-between text-sm"><span>{z}</span><span className="font-medium">{(d.reduce((s, n) => s + n, 0) / d.length).toFixed(1)}d</span></div>)) : []}</div></CardContent></Card>
        </div>
      )}
      {(activeTab === 'Dashboard' || activeTab === 'Insights') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card><CardContent><div className="text-sm font-medium text-emerald-600 mb-2">India VRFB Grid Storage Programme</div><div className="text-xs text-muted-foreground">BEL and Tata Power Solar deploying vanadium redox flow batteries for military base and grid-scale energy storage. BEL targeting 500 units of 50kW/200kWh VRFB by 2028. V2O5 battery grade demand scaling from 50 to 500 TPA. India importing 95% V2O5 &#8594; Gujarat Vanadium Tech commissioning 100 TPA domestic plant at Surat.</div></CardContent></Card>
          <Card><CardContent><div className="text-sm font-medium text-emerald-600 mb-2">Ti-6Al-4V Master Alloy Expansion</div><div className="text-xs text-muted-foreground">HAL and Wipro Aero consuming V-4Cr-4Ti master alloy at 15 TPA for Tejas Mk2 and GE F414 engine components. MIDHANI expanding VIM melting to 100 TPA. India targeting 200 Tejas Mk2 + 260 Su-30MKI fleet requiring 25 TPA V-alloys. V-5Cr-5Ti LPBF grade under DRDO GTRE development.</div></CardContent></Card>
          <Card><CardContent><div className="text-sm font-medium text-emerald-600 mb-2">SAIL HSLA Rail Expansion</div><div className="text-xs text-muted-foreground">Indian Railways Vande Bharat Express requiring FeV 50% at 3,000 TPA for 350 km/h HSLA rail production. SAIL and JSW main consumers importing 80% ferrovanadium. India targeting 3,000 km Vande Bharat track by 2030 needing 9,000 tonnes FeV. Gujarat Vanadium commissioning 200 TPA FeV plant.</div></CardContent></Card>
          <Card><CardContent><div className="text-sm font-medium text-emerald-600 mb-2">BHAVINI Fast Breeder V-4Cr-4Ti</div><div className="text-xs text-muted-foreground">IGCAR and BHAVINI developing indigenous V-4Cr-4Ti structural alloy for 500 MW PFBR sodium-cooled fast reactor. Currently importing from Russia and Japan. MIDHANI commissioning 20 TPA V-alloy pilot plant with DRDO funding &#8377;1,800Cr. India planning 4 additional fast reactors by 2040.</div></CardContent></Card>
        </div>
      )}
    </div>
  );
}
"""

import os
outpath = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'src', 'components', 'modules', 'vanadium-powder-logistics-view.tsx')
outpath = os.path.normpath(outpath)
with open(outpath, 'w') as f:
    f.write(code.strip() + '\n')
print(f"Generated: {outpath}")
print(f"Size: {os.path.getsize(outpath)} bytes")
