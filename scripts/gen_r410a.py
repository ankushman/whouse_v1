#!/usr/bin/env python3
"""Generate R410a: Ruthenium Catalyst Logistics View"""
import os

content = r""""use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared';
import { FlaskConical } from 'lucide-react';

interface RutheniumCatalystRecord {
  id: string;
  batchNo: string;
  city: string;
  manufacturer: string;
  catalystGrade: string;
  application: string;
  rutheniumPercent: number;
  surfaceAreaM2g: number;
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

const rutheniumCatalystRecords: RutheniumCatalystRecord[] = [
  { id: 'RUC-0001', batchNo: 'RUC-B2401', city: 'Mumbai', manufacturer: 'Reliance Industries', catalystGrade: 'Ru/C 5% Al2O3', application: 'Ammonia Synthesis Catalyst (Reliance)', rutheniumPercent: 5.0, surfaceAreaM2g: 180, investmentCr: 620, status: 'Delivered', priority: 'Critical', origin: 'Reliance Jamnagar (GJ)', destination: 'Reliance Hazira (GJ)', shipDate: '2026-07-15', transitDays: 1, zone: 'West', remarks: 'Ru/C catalyst for Reliance green ammonia synthesis loop &#8594; 5% Ru on gamma-Al2O3 &#8594; &#8377;620Cr for 2 tonnes &#8594; India &#8377;18,600Cr ammonia Ru &#8594; Reliance 45 MT ammonia &#8594; 180 m2/g &#8594; 450&#176;C &#8594; 200 bar &#8594; K-promoted' },
  { id: 'RUC-0002', batchNo: 'RUC-B2402', city: 'Bengaluru', manufacturer: 'DRDO DMRL', catalystGrade: 'RuO2 99.99% Electrode', application: 'Chlor-Alkali Anode (Adani Chem)', rutheniumPercent: 76.1, surfaceAreaM2g: 45, investmentCr: 540, status: 'Delivered', priority: 'Critical', origin: 'DRDO DMRL Bengaluru (KA)', destination: 'Adani Mundra (GJ)', shipDate: '2026-07-16', transitDays: 2, zone: 'South', remarks: 'RuO2 coated Ti anode for Adani chlor-alkali membrane electrolyzer &#8594; 76.1% Ru as RuO2 &#8594; &#8377;540Cr for 0.8 tonnes &#8594; India &#8377;16,200Cr chem Ru &#8594; Adani 500 KTA Cl2 &#8594; 45 m2/g &#8594;DSA &#8594; 5kA/m2 &#8594; 85% CE' },
  { id: 'RUC-0003', batchNo: 'RUC-B2403', city: 'Hyderabad', manufacturer: 'IGCAR', catalystGrade: 'Ru/Al2O3 1% Hydrogenation', application: 'Refinery HDS Catalyst (IOC)', rutheniumPercent: 1.0, surfaceAreaM2g: 250, investmentCr: 380, status: 'Delivered', priority: 'High', origin: 'IGCAR Kalpakkam (TN)', destination: 'IOC Paradip (OD)', shipDate: '2026-07-17', transitDays: 3, zone: 'South', remarks: 'Ru hydrogenation catalyst for IOC refinery heavy naphtha saturation unit &#8594; 1% Ru on Al2O3 &#8594; &#8377;380Cr for 3 tonnes &#8594; India &#8377;11,400Cr refining Ru &#8594; IOC 35 MT refinery &#8594; 250 m2/g &#8594; 80&#176;C &#8594; 30 bar &#8594; 95% sat.' },
  { id: 'RUC-0004', batchNo: 'RUC-B2404', city: 'Pune', manufacturer: 'Bharat Forge', catalystGrade: 'Ru/C 3% Raney', application: 'Pharma API Hydrogenation (Sun Pharma)', rutheniumPercent: 3.0, surfaceAreaM2g: 120, investmentCr: 490, status: 'Delivered', priority: 'High', origin: 'Bharat Forge Pune (MH)', destination: 'Sun Pharma Vapi (GJ)', shipDate: '2026-07-18', transitDays: 2, zone: 'West', remarks: 'Ru/C Raney-type for Sun Pharma API chiral hydrogenation &#8594; 3% Ru on activated carbon &#8594; &#8377;490Cr for 0.5 tonnes &#8594; India &#8377;14,700Cr pharma Ru &#8594; Sun Pharma &#8594; 120 m2/g &#8594; 25&#176;C &#8594; 5 bar &#8594; enantioselective' },
  { id: 'RUC-0005', batchNo: 'RUC-B2405', city: 'Chennai', manufacturer: 'MIDHANI', catalystGrade: 'Ru-Ta 3/97 Oxide', application: 'Super capacitor Electrode (BEL)', rutheniumPercent: 3.0, surfaceAreaM2g: 90, investmentCr: 310, status: 'Delivered', priority: 'High', origin: 'MIDHANI Hyderabad (TG)', destination: 'BEL Bengaluru (KA)', shipDate: '2026-07-19', transitDays: 1, zone: 'South', remarks: 'Ru-Ta oxide for BEL military supercapacitor energy storage module &#8594; 3% Ru with 97% Ta &#8594; &#8377;310Cr for 1 tonne &#8594; India &#8377;9,300Cr defence Ru &#8594; BEL 5000 units &#8594; 90 m2/g &#8594; pseudo-capacitive &#8594; 0.7V &#8594; 50k cycles' },
  { id: 'RUC-0006', batchNo: 'RUC-B2406', city: 'Gandhinagar', manufacturer: 'Gujarat Ru Catalysts', catalystGrade: 'Ru/C 5% PEM Fuel Cell', application: 'FC Stack Catalyst (BHEL)', rutheniumPercent: 5.0, surfaceAreaM2g: 200, investmentCr: 710, status: 'Delivered', priority: 'Critical', origin: 'Gujarat Ru Catalysts Gandhinagar (GJ)', destination: 'BHEL Hyderabad (TG)', shipDate: '2026-07-20', transitDays: 2, zone: 'West', remarks: 'Ru/C cathode catalyst for BHEL PEM fuel cell power backup system &#8594; 5% Ru on high-surface C &#8594; &#8377;710Cr for 0.4 tonnes &#8594; India &#8377;21,300Cr energy Ru &#8594; BHEL 200 MW FC &#8594; 200 m2/g &#8594; ORR &#8594; 80&#176;C &#8594; Pt-Ru alloy' },
  { id: 'RUC-0007', batchNo: 'RUC-B2407', city: 'Kolkata', manufacturer: 'Haldia Ru Chemicals', catalystGrade: 'RuCl3 xH2O Precursor', application: 'Olefin Metathesis (Larsen and Toubro)', rutheniumPercent: 37.4, surfaceAreaM2g: 15, investmentCr: 260, status: 'Delivered', priority: 'Medium', origin: 'Haldia Ru Chemicals Kolkata (WB)', destination: 'L&T Mumbai (MH)', shipDate: '2026-07-21', transitDays: 3, zone: 'East', remarks: 'RuCl3 precursor for Grubbs-type olefin metathesis catalyst R&amp;D &#8594; 37.4% Ru &#8594; &#8377;260Cr for 0.2 tonnes &#8594; India &#8377;7,800Cr chem Ru &#8594; L&amp;T petrochemical R&amp;D &#8594; 15 m2/g &#8594; Grubbs-III &#8594; ROMP &#8594; 1st gen.' },
  { id: 'RUC-0008', batchNo: 'RUC-B2408', city: 'Jaipur', manufacturer: 'Rajasthan Noble Metals', catalystGrade: 'Ru/SiO2 2% Dehydrogenation', application: 'Propane Dehydrogenation (GAIL)', rutheniumPercent: 2.0, surfaceAreaM2g: 300, investmentCr: 430, status: 'Delivered', priority: 'High', origin: 'Rajasthan Noble Metals Jaipur (RJ)', destination: 'GAIL Pata (UP)', shipDate: '2026-07-22', transitDays: 2, zone: 'North', remarks: 'Ru/SiO2 for GAIL propane dehydrogenation to propylene &#8594; 2% Ru on mesoporous SiO2 &#8594; &#8377;430Cr for 2.5 tonnes &#8594; India &#8377;12,900Cr petro Ru &#8594; GAIL 600 KTA &#8594; 300 m2/g &#8594; 550&#176;C &#8594; 1 bar &#8594; 45% yield' },
  { id: 'RUC-0009', batchNo: 'RUC-B2409', city: 'Bhubaneswar', manufacturer: 'NALCO', catalystGrade: 'Ru 99.95% Sputter Target', application: 'HDD Magnetic Layer (Seagate)', rutheniumPercent: 99.95, surfaceAreaM2g: 5, investmentCr: 580, status: 'Delivered', priority: 'High', origin: 'NALCO Bhubaneswar (OD)', destination: 'Seagate Bengaluru (KA)', shipDate: '2026-07-23', transitDays: 3, zone: 'East', remarks: 'Ru sputter target for Seagate HDD perpendicular magnetic recording &#8594; 99.95% Ru &#8594; &#8377;580Cr for 0.1 tonnes &#8594; India &#8377;17,400Cr electronics Ru &#8594; Seagate 50M HDD &#8594; 5 m2/g &#8594; PMR &#8594; 3.5TB &#8594; HAMR &#8594; 20TB' },
  { id: 'RUC-0010', batchNo: 'RUC-B2410', city: 'Surat', manufacturer: 'Gujarat Ru Products', catalystGrade: 'Ru/Ir 70/30 Ti Anode', application: 'Electrolyzer Bipolar Plate (Adani Green)', rutheniumPercent: 70.0, surfaceAreaM2g: 60, investmentCr: 470, status: 'Delivered', priority: 'High', origin: 'Gujarat Ru Products Surat (GJ)', destination: 'Adani Green Kutch (GJ)', shipDate: '2026-07-24', transitDays: 1, zone: 'West', remarks: 'Ru-Ir mixed oxide on Ti for Adani Green alkaline electrolyzer anode &#8594; 70% Ru with 30% Ir &#8594; &#8377;470Cr for 0.6 tonnes &#8594; India &#8377;14,100Cr green Ru &#8594; Adani 10 GW &#8594; 60 m2/g &#8594; OER &#8594; 80&#176;C &#8594; 6kA/m2' },
  { id: 'RUC-0011', batchNo: 'RUC-B2411', city: 'Coimbatore', manufacturer: 'Tamil Nadu Ru Corp', catalystGrade: 'Ru/TiO2 1.5% Photocatalyst', application: 'Water Treatment (L&T Construction)', rutheniumPercent: 1.5, surfaceAreaM2g: 50, investmentCr: 220, status: 'Delivered', priority: 'Medium', origin: 'Tamil Nadu Ru Corp Coimbatore (TN)', destination: 'L&T Chennai (TN)', shipDate: '2026-07-25', transitDays: 1, zone: 'South', remarks: 'Ru/TiO2 photocatalyst for L&amp;T municipal water treatment plant &#8594; 1.5% Ru on TiO2 &#8594; &#8377;220Cr for 1.5 tonnes &#8594; India &#8377;6,600Cr water Ru &#8594; L&amp;T 50 MLD &#8594; 50 m2/g &#8594; UV-A &#8594; 25&#176;C &#8594; TOC &#8594; 95% degrad.' },
  { id: 'RUC-0012', batchNo: 'RUC-B2412', city: 'Lucknow', manufacturer: 'UP Ru Chemicals', catalystGrade: 'Ru/AC 4% Oxidation', application: 'VOC Abatement (Wipro Manufacturing)', rutheniumPercent: 4.0, surfaceAreaM2g: 150, investmentCr: 340, status: 'Delayed', priority: 'High', origin: 'UP Ru Chemicals Lucknow (UP)', destination: 'Wipro Bengaluru (KA)', shipDate: '2026-07-01', transitDays: 26, zone: 'North', remarks: 'Ru/AC oxidation catalyst for Wipro electronics VOC thermal oxidizer &#8594; 4% Ru on activated carbon &#8594; &#8377;340Cr for 0.8 tonnes &#8594; monsoon delay &#8594; India &#8377;10,200Cr enviro Ru &#8594; Wipro 200K PCB &#8594; 150 m2/g &#8594; 250&#176;C &#8594; 1 bar &#8594; 99.5% DRE' },
  { id: 'RUC-0013', batchNo: 'RUC-B2413', city: 'Guwahati', manufacturer: 'Assam Noble Metals', catalystGrade: 'Ru/Zeolite 2% FCC Additive', application: 'FCC Octane Booster (BPCL)', rutheniumPercent: 2.0, surfaceAreaM2g: 350, investmentCr: 370, status: 'Delivered', priority: 'Medium', origin: 'Assam Noble Metals Guwahati (AS)', destination: 'BPCL Bina (MP)', shipDate: '2026-07-26', transitDays: 4, zone: 'East', remarks: 'Ru/Zeolite for BPCL FCC unit gasoline octane enhancement &#8594; 2% Ru on USY Zeolite &#8594; &#8377;370Cr for 3 tonnes &#8594; India &#8377;11,100Cr petro Ru &#8594; BPCL 8 MT FCC &#8594; 350 m2/g &#8594; 520&#176;C &#8594; 1.5 bar &#8594; RON+3' },
  { id: 'RUC-0014', batchNo: 'RUC-B2414', city: 'Noida', manufacturer: 'SAIL', catalystGrade: 'Ru/Al2O3 0.5% CO Shift', application: 'Syngas CO Shift (Tata Steel)', rutheniumPercent: 0.5, surfaceAreaM2g: 220, investmentCr: 290, status: 'Delivered', priority: 'Medium', origin: 'SAIL Rourkela (OD)', destination: 'Tata Steel Jamshedpur (JH)', shipDate: '2026-07-27', transitDays: 3, zone: 'East', remarks: 'Ru/Al2O3 for Tata Steel DRI plant syngas CO shift reactor &#8594; 0.5% Ru on Al2O3 &#8594; &#8377;290Cr for 5 tonnes &#8594; India &#8377;8,700Cr steel Ru &#8594; Tata 15 MT DRI &#8594; 220 m2/g &#8594; 220&#176;C &#8594; 25 bar &#8594; WGS &#8594; 99% CO conv.' }
];

const tabs = ['Dashboard', 'Registry', 'Analytics', 'Insights'] as const;
type Tab = typeof tabs[number];
const priorityColors: Record<string, string> = { Critical: 'bg-red-100 text-red-800', High: 'bg-amber-100 text-amber-800', Medium: 'bg-green-100 text-green-800', Low: 'bg-slate-100 text-slate-600' };
const delayedSet = new Set(rutheniumCatalystRecords.filter(r => r.status === 'Delayed').map(r => r.id));

export default function RutheniumCatalystLogisticsView() {
  const [activeTab, setActiveTab] = useState<Tab>('Dashboard');
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const toggleFilter = (k: string, v: string) => { setFilters(p => { const s = { ...p }; const a = s[k] || []; const i = a.indexOf(v); if (i > -1) { a.splice(i, 1); if (!a.length) delete s[k]; } else s[k] = [...a, v]; return s; }); };
  const filtered = useMemo(() => {
    let d = rutheniumCatalystRecords;
    if (search) { const q = search.toLowerCase(); d = d.filter(r => r.id.toLowerCase().includes(q) || r.batchNo.toLowerCase().includes(q) || r.catalystGrade.toLowerCase().includes(q) || r.application.toLowerCase().includes(q) || r.city.toLowerCase().includes(q) || r.manufacturer.toLowerCase().includes(q)); }
    Object.entries(filters).forEach(([k, vs]) => { if (vs.length) d = d.filter(r => { const v = String((r as unknown as Record<string, unknown>)[k] ?? ''); return vs.some(x => v.toLowerCase().includes(x.toLowerCase())); }); });
    return d;
  }, [search, filters]);
  const totalCr = filtered.reduce((s: number, r) => s + r.investmentCr, 0);
  const avgRu = filtered.length ? filtered.reduce((s: number, r) => s + r.rutheniumPercent, 0) / filtered.length : 0;
  const delayedCount = filtered.filter(r => r.status === 'Delayed').length;

  return (
    <div className="space-y-6">
      <PageHeader title="Ruthenium Catalyst Logistics" description="Indian ruthenium catalyst supply chain tracking for ammonia synthesis, chlor-alkali, hydrogenation, fuel cells, petrochemical refining and water treatment sectors" />
      <div className="flex gap-2 border-b">
        {tabs.map(t => (<button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-2 text-sm font-medium ${activeTab === t ? 'border-b-2 border-violet-500 text-violet-700' : 'text-muted-foreground hover:text-foreground'}`}>{t}</button>))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent><div className="text-2xl font-bold text-violet-600">{filtered.length}</div><div className="text-xs text-muted-foreground">Total Shipments</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-violet-600">&#8377;{totalCr.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground">Total Investment</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-violet-600">{avgRu.toFixed(1)}%</div><div className="text-xs text-muted-foreground">Avg Ru Content</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-red-500">{delayedCount}</div><div className="text-xs text-muted-foreground">Delayed Shipments</div></CardContent></Card>
      </div>
      {(activeTab === 'Dashboard' || activeTab === 'Registry') && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <input placeholder="Search ID, grade, application, city..." value={search} onChange={e => setSearch(e.target.value)} className="border rounded-md px-3 py-1.5 text-sm flex-1 min-w-48" />
            {['status', 'priority', 'zone'].map(f => { const opts = [...new Set(rutheniumCatalystRecords.map(r => (r as unknown as Record<string, unknown>)[f] as string))]; return (<div key={f} className="flex flex-wrap gap-1">{opts.map(o => (<Badge key={o} variant={(filters[f] || []).includes(o) ? 'default' : 'outline'} className="cursor-pointer text-xs" onClick={() => toggleFilter(f, o)}>{o}</Badge>))}</div>); })}
          </div>
          <div className="rounded-md border"><div className="max-h-96 overflow-auto"><table className="w-full text-sm"><thead className="sticky top-0 bg-background"><tr><th className="p-2 text-left">ID</th><th className="p-2 text-left">Batch</th><th className="p-2 text-left">Grade</th><th className="p-2 text-left">Application</th><th className="p-2 text-right">Ru%</th><th className="p-2 text-right">&#8377;Cr</th><th className="p-2 text-left">Status</th></tr></thead><tbody>{filtered.map(r => (<tr key={r.id} className={`border-t ${delayedSet.has(r.id) ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}><td className="p-2">{r.id}</td><td className="p-2">{r.batchNo}</td><td className="p-2">{r.catalystGrade}</td><td className="p-2">{r.application}</td><td className="p-2 text-right">{r.rutheniumPercent}</td><td className="p-2 text-right">{r.investmentCr}</td><td className="p-2"><Badge variant={r.status === 'Delivered' ? 'default' : 'destructive'}>{r.status}</Badge></td></tr>))}</tbody></table></div></div>
        </div>
      )}
      {(activeTab === 'Dashboard' || activeTab === 'Analytics') && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">Investment by Application</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { m[r.application] = (m[r.application] || 0) + r.investmentCr; return m }, {} as Record<string, number>)) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 7).map(([a, v]) => (<div key={a} className="flex justify-between text-sm"><span>{a}</span><span className="font-medium">&#8377;{v}Cr</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Shipments by Zone</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { m[r.zone] = (m[r.zone] || 0) + 1; return m }, {} as Record<string, number>)) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([z, c]) => (<div key={z} className="flex justify-between text-sm"><span>{z}</span><span className="font-medium">{c}</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Top Routes by Value</CardTitle></CardHeader><CardContent><div className="space-y-2">{filtered.sort((a, b) => b.investmentCr - a.investmentCr).slice(0, 7).map(r => (<div key={r.id} className="flex justify-between text-sm"><span>{r.origin.split('(')[0]} &#8594; {r.destination.split('(')[0]}</span><span className="font-medium">&#8377;{r.investmentCr}Cr</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Energy and Green H2</CardTitle></CardHeader><CardContent><div className="space-y-2">{filtered.filter(r => r.application.toLowerCase().includes('fuel') || r.application.toLowerCase().includes('electroly') || r.application.toLowerCase().includes('hydrogen') || r.application.toLowerCase().includes('ammonia') || r.application.toLowerCase().includes('green')).sort((a, b) => b.investmentCr - a.investmentCr).map(r => (<div key={r.id} className="flex justify-between text-sm"><span>{r.catalystGrade}</span><span className="font-medium">&#8377;{r.investmentCr}Cr</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">By Priority</CardTitle></CardHeader><CardContent><div className="space-y-2">{Object.entries(filtered.reduce((m, r) => { m[r.priority] = (m[r.priority] || 0) + 1; return m }, {} as Record<string, number>)).map(([p, c]) => (<div key={p} className="flex justify-between text-sm"><span className={priorityColors[p] || ''}>{p}</span><span className="font-medium">{c}</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Ru Content Distribution</CardTitle></CardHeader><CardContent><div className="space-y-2">{[{ l: 'Ultra-High (50%+)', f: filtered.filter(r => r.rutheniumPercent >= 50).length }, { l: 'High (5-50%)', f: filtered.filter(r => r.rutheniumPercent >= 5 && r.rutheniumPercent < 50).length }, { l: 'Medium (1-5%)', f: filtered.filter(r => r.rutheniumPercent >= 1 && r.rutheniumPercent < 5).length }, { l: 'Trace (&lt;1%)', f: filtered.filter(r => r.rutheniumPercent < 1).length }].map(b => (<div key={b.l} className="flex justify-between text-sm"><span>{b.l}</span><span className="font-medium">{b.f}</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Top Manufacturers</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { m[r.manufacturer] = (m[r.manufacturer] || 0) + r.investmentCr; return m }, {} as Record<string, number>)) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 7).map(([m, v]) => (<div key={m} className="flex justify-between text-sm"><span>{m}</span><span className="font-medium">&#8377;{v}Cr</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Avg Transit Days</CardTitle></CardHeader><CardContent><div className="space-y-2">{filtered.length ? (Object.entries(filtered.reduce((m, r) => { m[r.zone] = (m[r.zone] || [] as number[]).concat(r.transitDays); return m }, {} as Record<string, number[]>)) as [string, number[]][]).map(([z, d]) => (<div key={z} className="flex justify-between text-sm"><span>{z}</span><span className="font-medium">{(d.reduce((s, n) => s + n, 0) / d.length).toFixed(1)}d</span></div>)) : []}</div></CardContent></Card>
        </div>
      )}
      {(activeTab === 'Dashboard' || activeTab === 'Insights') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card><CardContent><div className="text-sm font-medium text-violet-600 mb-2">Reliance Green Ammonia Ru/C Catalyst</div><div className="text-xs text-muted-foreground">Reliance commissioning 45 MT green ammonia plant at Jamnagar using Ru/C 5% K-promoted catalyst replacing traditional Fe-based Haber-Bosch. Ru reduces operating temperature from 500&#176;C to 450&#176;C cutting energy 15%. Gujarat Ru Catalysts developing domestic production under &#8377;4,200Cr MoU reducing Russia/South Africa import dependency.</div></CardContent></Card>
          <Card><CardContent><div className="text-sm font-medium text-violet-600 mb-2">Adani Green Electrolyzer Ru-Ir Anode</div><div className="text-xs text-muted-foreground">Adani Green sourcing Ru-Ir 70/30 mixed oxide on Ti bipolar plates for 10 GW alkaline electrolyzer program. Ru-Ir OER activity is 5x higher than bare IrO2 at 80&#176;C reducing electrode overpotential from 340mV to 220mV. Gujarat Ru Products scaling to 50 TPA matching European IrO2 benchmark quality.</div></CardContent></Card>
          <Card><CardContent><div className="text-sm font-medium text-violet-600 mb-2">BHEL PEM Fuel Cell Ru/C Cathode</div><div className="text-xs text-muted-foreground">BHEL qualifying Ru/C 5% cathode catalyst for 200 MW PEM fuel cell power backup replacing diesel generators at telecom towers and data centers. Ru provides superior CO tolerance vs pure Pt in reformate H2 feed. MIDHANI establishing Ru precursor supply chain from Tamil Nadu ore processing.</div></CardContent></Card>
          <Card><CardContent><div className="text-sm font-medium text-violet-600 mb-2">Seagate HAMR Ru Sputter Target</div><div className="text-xs text-muted-foreground">Seagate Bengaluru transitioning from CoCrPt to Ru interlayer for HAMR (Heat Assisted Magnetic Recording) 20TB+ HDD. Ru provides thermal stability at 400&#176;C+ recording temperatures enabling 2 Tb/in2 areal density. NALCO developing 99.95% Ru sputtering target from Indian copper anode slime recovery.</div></CardContent></Card>
        </div>
      )}
    </div>
  );
}
"""

outpath = "/home/z/my-project/src/components/modules/ruthenium-catalyst-logistics-view.tsx"
with open(outpath, "w") as f:
    f.write(content)
print(f"Generated {outpath}")
