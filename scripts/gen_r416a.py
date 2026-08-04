#!/usr/bin/env python3
"""Generate R416a: Zirconium Oxide Logistics View (zro-*)"""
import os

content = r'''"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared';
import { Shield } from 'lucide-react';

interface ZirconiumOxideRecord {
  id: string;
  batchNo: string;
  city: string;
  manufacturer: string;
  oxideGrade: string;
  application: string;
  purityPercent: number;
  hardnessGPa: number;
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

const zirconiumOxideRecords: ZirconiumOxideRecord[] = [
  { id: 'ZRO-0001', batchNo: 'ZRO-B2401', city: 'Mumbai', manufacturer: 'Bharat Forge', oxideGrade: 'YSZ 8YSZ 3mol%', application: 'TBC Coating (HAL)', purityPercent: 99.9, hardnessGPa: 12, investmentCr: 720, status: 'Delivered', priority: 'Critical', origin: 'Bharat Forge Pune (MH)', destination: 'HAL Bengaluru (KA)', shipDate: '2026-07-15', transitDays: 1, zone: 'West', remarks: '8mol YSZ thermal barrier coating powder for HAL Tejas LCA Kaveri engine turbine blade EB-PVD &#8594; 99.9% YSZ &#8594; &#8377;720Cr for 1.5 tonnes &#8594; India &#8377;21,600Cr aero ZrO2 &#8594; HAL 500 blades &#8594; 12 GPa &#8594; &#8594; EB-PVD &#8594; &#8594; 1200&#176;C &#8594; &#8594; TBC' },
  { id: 'ZRO-0002', batchNo: 'ZRO-B2402', city: 'Hyderabad', manufacturer: 'DRDO DMRL', oxideGrade: 'ZrO2 99.99% Nuclear', application: 'Fuel Pellet Clad (NPCIL)', purityPercent: 99.99, hardnessGPa: 13, investmentCr: 860, status: 'Delivered', priority: 'Critical', origin: 'DRDO DMRL Hyderabad (TG)', destination: 'NPCIL Mumbai (MH)', shipDate: '2026-07-16', transitDays: 2, zone: 'South', remarks: 'ZrO2 nuclear-grade for NPCIL PHWR Zircaloy-2 fuel cladding yttria-stabilized liner &#8594; 99.99% ZrO2 &#8594; &#8377;860Cr for 0.8 tonnes &#8594; India &#8377;25,800Cr nuclear ZrO2 &#8594; NPCIL 200 bundles &#8594; 13 GPa &#8594; &#8594; calcia &#8594; &#8594; 300&#176;C &#8594; &#8594; clad' },
  { id: 'ZRO-0003', batchNo: 'ZRO-B2403', city: 'Bengaluru', manufacturer: 'CSIR-NAL', oxideGrade: 'TZP 3Y-TZP', application: 'Cutting Tool (Sandvik)', purityPercent: 99.8, hardnessGPa: 14, investmentCr: 480, status: 'Delivered', priority: 'High', origin: 'CSIR-NAL Bengaluru (KA)', destination: 'Sandvik Pune (MH)', shipDate: '2026-07-17', transitDays: 1, zone: 'South', remarks: '3Y-TZP tetragonal zirconia polycrystal for Sandvik India ceramic turning insert &#8594; 99.8% 3Y-TZP &#8594; &#8377;480Cr for 0.3 tonnes &#8594; India &#8377;14,400Cr tool ZrO2 &#8594; Sandvik 10M inserts &#8594; 14 GPa &#8594; &#8594; HIP &#8594; &#8594; KIC 10 &#8594; &#8594; cutting' },
  { id: 'ZRO-0004', batchNo: 'ZRO-B2404', city: 'Pune', manufacturer: 'IGCAR', oxideGrade: 'Mg-PSZ 8mol%', application: 'Thermal Shield (BHAVINI)', purityPercent: 99.7, hardnessGPa: 11, investmentCr: 680, status: 'Delivered', priority: 'Critical', origin: 'IGCAR Kalpakkam (TN)', destination: 'BHAVINI Kalpakkam (TN)', shipDate: '2026-07-18', transitDays: 0, zone: 'South', remarks: 'Mg-PSZ partially stabilized zirconia for BHAVINI PFBR sodium circuit thermal insulator sleeve &#8594; 99.7% Mg-PSZ &#8594; &#8377;680Cr for 1.2 tonnes &#8594; India &#8377;20,400Cr nuclear ZrO2 &#8594; BHAVINI 20 sleeves &#8594; 11 GPa &#8594; &#8594; sinter &#8594; &#8594; 550&#176;C &#8594; &#8594; shield' },
  { id: 'ZRO-0005', batchNo: 'ZRO-B2405', city: 'Chennai', manufacturer: 'Tata Advanced Materials', oxideGrade: 'ZrO2 99.9% Dental', application: 'Dental Crown (Dentsply)', purityPercent: 99.9, hardnessGPa: 13, investmentCr: 540, status: 'Delivered', priority: 'High', origin: 'Tata Advanced Materials Bengaluru (KA)', destination: 'Dentsply Mumbai (MH)', shipDate: '2026-07-19', transitDays: 1, zone: 'South', remarks: 'ZrO2 dental-grade translucent block for Dentsply India CAD/CAM dental crown milling &#8594; 99.9% ZrO2 &#8594; &#8377;540Cr for 0.6 tonnes &#8594; India &#8377;16,200Cr dental ZrO2 &#8594; Dentsply 200K crowns &#8594; 13 GPa &#8594; &#8594; translucent &#8594; &#8594; 1200MPa &#8594; &#8594; dental' },
  { id: 'ZRO-0006', batchNo: 'ZRO-B2406', city: 'Ahmedabad', manufacturer: 'Gujarat Zirconia Tech', oxideGrade: 'ZrO2 99.5% Ceramic', application: 'Oxygen Sensor (Bosch)', purityPercent: 99.5, hardnessGPa: 11.5, investmentCr: 380, status: 'Delivered', priority: 'High', origin: 'Gujarat Zirconia Tech Ahmedabad (GJ)', destination: 'Bosch Bengaluru (KA)', shipDate: '2026-07-20', transitDays: 2, zone: 'West', remarks: 'ZrO2 lambda oxygen sensor electrolyte for Bosch India automotive exhaust emission control &#8594; 99.5% ZrO2 &#8594; &#8377;380Cr for 0.4 tonnes &#8594; India &#8377;11,400Cr auto ZrO2 &#8594; Bosch 5M sensors &#8594; 11.5 GPa &#8594; &#8594; YSZ &#8594; &#8594; 600&#176;C &#8594; &#8594; O2' },
  { id: 'ZRO-0007', batchNo: 'ZRO-B2407', city: 'Jaipur', manufacturer: 'Rajasthan Zirconia Corp', oxideGrade: 'Ce-TZP 10Ce-TZP', application: 'Ball Joint (Cummins)', purityPercent: 99.7, hardnessGPa: 10.5, investmentCr: 340, status: 'Delivered', priority: 'Medium', origin: 'Rajasthan Zirconia Corp Jaipur (RJ)', destination: 'Cummins Pune (MH)', shipDate: '2026-07-21', transitDays: 2, zone: 'North', remarks: 'Ce-TZP ceria-stabilized zirconia for Cummins diesel engine turbocharger ball joint bearing &#8594; 99.7% Ce-TZP &#8594; &#8377;340Cr for 0.5 tonnes &#8594; India &#8377;10,200Cr auto ZrO2 &#8594; Cummins 100K units &#8594; 10.5 GPa &#8594; &#8594; KIC 15 &#8594; &#8594; 800&#176;C &#8594; &#8594; bearing' },
  { id: 'ZRO-0008', batchNo: 'ZRO-B2408', city: 'Bhubaneswar', manufacturer: 'NALCO', oxideGrade: 'ZrO2 99.95% Opacifier', application: 'Ceramic Glaze (Kajaria)', purityPercent: 99.95, hardnessGPa: 12, investmentCr: 260, status: 'Delivered', priority: 'Medium', origin: 'NALCO Bhubaneswar (OD)', destination: 'Kajaria Ahmedabad (GJ)', shipDate: '2026-07-22', transitDays: 2, zone: 'East', remarks: 'ZrO2 opacifier for Kajaria vitrified floor tile opaque glaze application &#8594; 99.95% ZrO2 &#8594; &#8377;260Cr for 3 tonnes &#8594; India &#8377;7,800Cr ceramic ZrO2 &#8594; Kajaria 50M m2 &#8594; 12 GPa &#8594; &#8594; micron &#8594; &#8594; opaque &#8594; &#8594; glaze' },
  { id: 'ZRO-0009', batchNo: 'ZRO-B2409', city: 'Coimbatore', manufacturer: 'Tamil Nadu Zirconia Corp', oxideGrade: 'ZrO2-SiC FGM', application: 'Brake Disc (Brembo)', purityPercent: 99.5, hardnessGPa: 14.5, investmentCr: 580, status: 'Delivered', priority: 'High', origin: 'Tamil Nadu Zirconia Corp Coimbatore (TN)', destination: 'Brembo Pune (MH)', shipDate: '2026-07-23', transitDays: 2, zone: 'South', remarks: 'ZrO2-SiC functionally graded material for Brembo India F1 carbon-ceramic brake disc &#8594; 99.5% ZrO2-SiC &#8594; &#8377;580Cr for 0.4 tonnes &#8594; India &#8377;17,400Cr auto ZrO2 &#8594; Brembo 10K discs &#8594; 14.5 GPa &#8594; &#8594; FGM &#8594; &#8594; 1500&#176;C &#8594; &#8594; brake' },
  { id: 'ZRO-0010', batchNo: 'ZRO-B2410', city: 'Surat', manufacturer: 'Gujarat ZrO Products', oxideGrade: 'ZrO2 99.9% Bioceramic', application: 'Hip Implant (Stryker)', purityPercent: 99.9, hardnessGPa: 12.5, investmentCr: 490, status: 'Delivered', priority: 'High', origin: 'Gujarat ZrO Products Surat (GJ)', destination: 'Stryker Gurgaon (HR)', shipDate: '2026-07-24', transitDays: 2, zone: 'West', remarks: 'ZrO2 bioceramic femoral head for Stryker India total hip replacement articulation &#8594; 99.9% ZrO2 &#8594; &#8377;490Cr for 0.2 tonnes &#858594; India &#8377;14,700Cr medical ZrO2 &#8594; Stryker 30K hips &#8594; 12.5 GPa &#8594; &#8594; biocompat &#8594; &#8594; wear &#8594; &#8594; implant' },
  { id: 'ZRO-0011', batchNo: 'ZRO-B2411', city: 'Guwahati', manufacturer: 'Assam Zirconia Metals', oxideGrade: 'ZrO2 99.8% Foundry', application: 'Investment Casting (BHEL)', purityPercent: 99.8, hardnessGPa: 11, investmentCr: 320, status: 'Delivered', priority: 'Medium', origin: 'Assam Zirconia Metals Guwahati (AS)', destination: 'BHEL Haridwar (UK)', shipDate: '2026-07-25', transitDays: 4, zone: 'East', remarks: 'ZrO2 investment casting shell mould face coat for BHEL gas turbine blade precision casting &#8594; 99.8% ZrO2 &#8594; &#8377;320Cr for 2 tonnes &#8594; India &#8377;9,600Cr foundry ZrO2 &#8594; BHEL 100K shells &#8594; 11 GPa &#8594; &#8594; wash &#8594; &#8594; 1600&#176;C &#8594; &#8594; casting' },
  { id: 'ZRO-0012', batchNo: 'ZRO-B2412', city: 'Lucknow', manufacturer: 'UP Zirconia Industries', oxideGrade: 'YSZ 8YSZ Plasma', application: 'Solid Oxide Fuel Cell (BHEL)', purityPercent: 99.9, hardnessGPa: 12, investmentCr: 620, status: 'Delayed', priority: 'Critical', origin: 'UP Zirconia Industries Lucknow (UP)', destination: 'BHEL Hyderabad (TG)', shipDate: '2026-07-01', transitDays: 28, zone: 'North', remarks: 'YSZ electrolyte membrane for BHEL 5kW solid oxide fuel cell demonstration stack &#8594; 99.9% YSZ &#8594; &#8377;620Cr for 0.3 tonnes &#8594; monsoon delay &#8594; India &#8377;18,600Cr energy ZrO2 &#8594; BHEL 10 stacks &#8594; 12 GPa &#8594; &#8594; tape cast &#8594; &#8594; 800&#176;C &#8594; &#8594; SOFC' },
  { id: 'ZRO-0013', batchNo: 'ZRO-B2413', city: 'Noida', manufacturer: 'SAIL', oxideGrade: 'ZrO2 99.5% Refractory', application: 'Glass Furnace (Asahi India)', purityPercent: 99.5, hardnessGpa: 10, investmentCr: 310, status: 'Delivered', priority: 'Medium', origin: 'SAIL Rourkela (OD)', destination: 'Asahi India Mumbai (MH)', shipDate: '2026-07-26', transitDays: 2, zone: 'East', remarks: 'ZrO2 refractory ramming mass for Asahi India float glass furnace crown insulation &#8594; 99.5% ZrO2 &#8594; &#8377;310Cr for 5 tonnes &#8594; India &#8377;9,300Cr glass ZrO2 &#8594; Asahi 3 furnaces &#8594; 10 GPa &#8594; &#8594; ram &#8594; &#8594; 1700&#176;C &#8594; &#8594; refractory' },
  { id: 'ZRO-0014', batchNo: 'ZRO-B2414', city: 'Bhopal', manufacturer: 'BHEL', oxideGrade: 'ZrO2 99.9% Ladle Liner', application: 'Steel Ladle (Tata Steel)', purityPercent: 99.9, hardnessGPa: 11.5, investmentCr: 370, status: 'Delivered', priority: 'Medium', origin: 'BHEL Bhopal (MP)', destination: 'Tata Steel Jamshedpur (JH)', shipDate: '2026-07-27', transitDays: 2, zone: 'North', remarks: 'ZrO2 slide-gate ladle nozzle refractory for Tata Steel BOF steelmaking continuous casting &#8594; 99.9% ZrO2 &#8594; &#8377;370Cr for 4 tonnes &#8594; India &#8377;11,100Cr steel ZrO2 &#8594; Tata Steel 500 ladles &#8594; 11.5 GPa &#8594; &#8594; insert &#8594; &#8594; 1650&#176;C &#8594; &#8594; ladle' }
];

const tabs = ['Dashboard', 'Registry', 'Analytics', 'Insights'] as const;
type Tab = typeof tabs[number];
const priorityColors: Record<string, string> = { Critical: 'bg-red-100 text-red-800', High: 'bg-amber-100 text-amber-800', Medium: 'bg-green-100 text-green-800', Low: 'bg-slate-100 text-slate-600' };
const delayedSet = new Set(zirconiumOxideRecords.filter(r => r.status === 'Delayed').map(r => r.id));

export default function ZirconiumOxideLogisticsView() {
  const [activeTab, setActiveTab] = useState<Tab>('Dashboard');
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const toggleFilter = (k: string, v: string) => { setFilters(p => { const s = { ...p }; const a = s[k] || []; const i = a.indexOf(v); if (i > -1) { a.splice(i, 1); if (!a.length) delete s[k]; } else s[k] = [...a, v]; return s; }); };
  const filtered = useMemo(() => {
    let d = zirconiumOxideRecords;
    if (search) { const q = search.toLowerCase(); d = d.filter(r => r.id.toLowerCase().includes(q) || r.batchNo.toLowerCase().includes(q) || r.oxideGrade.toLowerCase().includes(q) || r.application.toLowerCase().includes(q) || r.city.toLowerCase().includes(q) || r.manufacturer.toLowerCase().includes(q)); }
    Object.entries(filters).forEach(([k, vs]) => { if (vs.length) d = d.filter(r => { const v = String((r as unknown as Record<string, unknown>)[k] ?? ''); return vs.some(x => v.toLowerCase().includes(x.toLowerCase())); }); });
    return d;
  }, [search, filters]);
  const totalCr = filtered.reduce((s: number, r) => s + r.investmentCr, 0);
  const avgPurity = filtered.length ? filtered.reduce((s: number, r) => s + r.purityPercent, 0) / filtered.length : 0;
  const delayedCount = filtered.filter(r => r.status === 'Delayed').length;

  return (
    <div className="space-y-6">
      <PageHeader title="Zirconium Oxide Logistics" description="Indian zirconium oxide supply chain tracking for aerospace thermal barrier coatings, nuclear fuel cladding, dental ceramics, oxygen sensors, solid oxide fuel cells, automotive brake discs, and steel refractories" />
      <div className="flex gap-2 border-b">
        {tabs.map(t => (<button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-2 text-sm font-medium ${activeTab === t ? 'border-b-2 border-sky-500 text-sky-700' : 'text-muted-foreground hover:text-foreground'}`}>{t}</button>))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent><div className="text-2xl font-bold text-sky-600">{filtered.length}</div><div className="text-xs text-muted-foreground">Total Shipments</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-sky-600">&#8377;{totalCr.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground">Total Investment</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-sky-600">{avgPurity.toFixed(2)}%</div><div className="text-xs text-muted-foreground">Avg Purity</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-red-500">{delayedCount}</div><div className="text-xs text-muted-foreground">Delayed Shipments</div></CardContent></Card>
      </div>
      {(activeTab === 'Dashboard' || activeTab === 'Registry') && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <input placeholder="Search ID, grade, application, city..." value={search} onChange={e => setSearch(e.target.value)} className="border rounded-md px-3 py-1.5 text-sm flex-1 min-w-48" />
            {['status', 'priority', 'zone'].map(f => { const opts = [...new Set(zirconiumOxideRecords.map(r => (r as unknown as Record<string, unknown>)[f] as string))]; return (<div key={f} className="flex flex-wrap gap-1">{opts.map(o => (<Badge key={o} variant={(filters[f] || []).includes(o) ? 'default' : 'outline'} className="cursor-pointer text-xs" onClick={() => toggleFilter(f, o)}>{o}</Badge>))}</div>); })}
          </div>
          <div className="rounded-md border"><div className="max-h-96 overflow-auto"><table className="w-full text-sm"><thead className="sticky top-0 bg-background"><tr><th className="p-2 text-left">ID</th><th className="p-2 text-left">Batch</th><th className="p-2 text-left">Grade</th><th className="p-2 text-left">Application</th><th className="p-2 text-right">Purity%</th><th className="p-2 text-right">&#8377;Cr</th><th className="p-2 text-left">Status</th></tr></thead><tbody>{filtered.map(r => (<tr key={r.id} className={`border-t ${delayedSet.has(r.id) ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}><td className="p-2">{r.id}</td><td className="p-2">{r.batchNo}</td><td className="p-2">{r.oxideGrade}</td><td className="p-2">{r.application}</td><td className="p-2 text-right">{r.purityPercent}</td><td className="p-2 text-right">{r.investmentCr}</td><td className="p-2"><Badge variant={r.status === 'Delivered' ? 'default' : 'destructive'}>{r.status}</Badge></td></tr>))}</tbody></table></div></div>
        </div>
      )}
      {(activeTab === 'Dashboard' || activeTab === 'Analytics') && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">Investment by Application</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { m[r.application] = (m[r.application] || 0) + r.investmentCr; return m }, {} as Record<string, number>)) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 7).map(([a, v]) => (<div key={a} className="flex justify-between text-sm"><span>{a}</span><span className="font-medium">&#8377;{v}Cr</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Shipments by Zone</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { m[r.zone] = (m[r.zone] || 0) + 1; return m }, {} as Record<string, number>)) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([z, c]) => (<div key={z} className="flex justify-between text-sm"><span>{z}</span><span className="font-medium">{c}</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Top Routes by Value</CardTitle></CardHeader><CardContent><div className="space-y-2">{filtered.sort((a, b) => b.investmentCr - a.investmentCr).slice(0, 7).map(r => (<div key={r.id} className="flex justify-between text-sm"><span>{r.origin.split('(')[0]} &#8594; {r.destination.split('(')[0]}</span><span className="font-medium">&#8377;{r.investmentCr}Cr</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Aerospace &amp; Nuclear</CardTitle></CardHeader><CardContent><div className="space-y-2">{filtered.filter(r => r.application.toLowerCase().includes('hal') || r.application.toLowerCase().includes('npcil') || r.application.toLowerCase().includes('nuclear') || r.application.toLowerCase().includes('drdo') || r.application.toLowerCase().includes('bhel') || r.application.toLowerCase().includes('bhavini')).sort((a, b) => b.investmentCr - a.investmentCr).map(r => (<div key={r.id} className="flex justify-between text-sm"><span>{r.oxideGrade}</span><span className="font-medium">&#8377;{r.investmentCr}Cr</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">By Priority</CardTitle></CardHeader><CardContent><div className="space-y-2">{Object.entries(filtered.reduce((m, r) => { m[r.priority] = (m[r.priority] || 0) + 1; return m }, {} as Record<string, number>)).map(([p, c]) => (<div key={p} className="flex justify-between text-sm"><span className={priorityColors[p] || ''}>{p}</span><span className="font-medium">{c}</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Stabilization Type</CardTitle></CardHeader><CardContent><div className="space-y-2">{[{ l: 'Yttria (YSZ)', f: filtered.filter(r => r.oxideGrade.includes('YSZ') || r.oxideGrade.includes('3Y') || r.oxideGrade.includes('8Y')).length }, { l: 'Magnesia (Mg-PSZ)', f: filtered.filter(r => r.oxideGrade.includes('Mg-PSZ')).length }, { l: 'Ceria (Ce-TZP)', f: filtered.filter(r => r.oxideGrade.includes('Ce-')).length }, { l: 'Pure/Other ZrO2', f: filtered.filter(r => !r.oxideGrade.includes('YSZ') && !r.oxideGrade.includes('3Y') && !r.oxideGrade.includes('Mg-PSZ') && !r.oxideGrade.includes('Ce-')).length }].map(b => (<div key={b.l} className="flex justify-between text-sm"><span>{b.l}</span><span className="font-medium">{b.f}</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Top Manufacturers</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { m[r.manufacturer] = (m[r.manufacturer] || 0) + r.investmentCr; return m }, {} as Record<string, number>)) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 7).map(([m, v]) => (<div key={m} className="flex justify-between text-sm"><span>{m}</span><span className="font-medium">&#8377;{v}Cr</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Avg Transit Days</CardTitle></CardHeader><CardContent><div className="space-y-2">{filtered.length ? (Object.entries(filtered.reduce((m, r) => { m[r.zone] = (m[r.zone] || [] as number[]).concat(r.transitDays); return m }, {} as Record<string, number[]>)) as [string, number[]][]).map(([z, d]) => (<div key={z} className="flex justify-between text-sm"><span>{z}</span><span className="font-medium">{(d.reduce((s, n) => s + n, 0) / d.length).toFixed(1)}d</span></div>)) : []}</div></CardContent></Card>
        </div>
      )}
      {(activeTab === 'Dashboard' || activeTab === 'Insights') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card><CardContent><div className="text-sm font-medium text-sky-600 mb-2">HAL Tejas YSZ Thermal Barrier Coating</div><div className="text-xs text-muted-foreground">HAL aero engine division qualifying 8mol Y2O3-stabilized ZrO2 EB-PVD thermal barrier coating for Tejas Mk1A Kaveri engine HP turbine blades. YSZ provides 100&#176;C temperature drop at 1200&#176;C turbine inlet enabling 10% thrust gain. DRDO GTRE co-developing under &#8377;5,600Cr Kaveri Engine Core Development Programme with Bharat Forge as powder supplier.</div></CardContent></Card>
          <Card><CardContent><div className="text-sm font-medium text-sky-600 mb-2">BHEL 5kW SOFC Demonstration Stack</div><div className="text-xs text-muted-foreground">BHEL R&amp;D building 5kW anode-supported SOFC stack using YSZ tape-cast electrolyte membranes operating at 800&#176;C. SOFC achieves 60% electrical efficiency vs 40% for PEMFC at natural gas reformate. Programme under &#8377;4,200Cr DST Clean Energy Mission targeting 1MW stationary power by 2028 for telecom tower backup.</div></CardContent></Card>
          <Card><CardContent><div className="text-sm font-medium text-sky-600 mb-2">Dentsply ZrO2 Dental CAD/CAM Revolution</div><div className="text-xs text-muted-foreground">Dentsply India expanding translucent 3Y-TZP zirconia block production for CAD/CAM dental crown milling replacing metal-fused-porcelain. ZrO2 provides 1200MPa flexural strength with tooth-like translucency. India targeting 500K digital crowns by 2028 under &#8377;6,800Cr National Dental CAD/CAM Programme reducing imported VITA dependency.</div></CardContent></Card>
          <Card><CardContent><div className="text-sm font-medium text-sky-600 mb-2">Brembo Carbon-Ceramic Brake Disc</div><div className="text-xs text-muted-foreground">Brembo India qualifying ZrO2-SiC functionally graded carbon-ceramic brake discs for Mercedes-Benz and BMW India premium vehicles. C-SiC provides 60% weight reduction vs cast iron with 5x longer pad life. Programme under &#8377;3,400Cr India Automotive Friction Materials Mission with Tamil Nadu Zirconia Corp supplying ZrO2 precursor.</div></CardContent></Card>
        </div>
      )}
    </div>
  );
}
'''

outpath = '/home/z/my-project/src/components/modules/zirconium-oxide-logistics-view.tsx'
with open(outpath, 'w', encoding='utf-8') as f:
    f.write(content)
print(f"Generated: {outpath}")
print(f"Size: {len(content)} bytes")
