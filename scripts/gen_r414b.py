#!/usr/bin/env python3
"""Generate R414b: Gallium Arsenide Logistics View (gas-*)"""
import os

content = r'''"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared';
import { Sparkles } from 'lucide-react';

interface GalliumArsenideRecord {
  id: string;
  batchNo: string;
  city: string;
  manufacturer: string;
  waferGrade: string;
  application: string;
  purityPercent: number;
  diameterMm: number;
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

const galliumArsenideRecords: GalliumArsenideRecord[] = [
  { id: 'GAS-0001', batchNo: 'GAS-B2401', city: 'Bengaluru', manufacturer: 'BEL', waferGrade: 'SI-GaAs 100mm 2-inch', application: 'RF Power Amp (BEL)', purityPercent: 99.9999, diameterMm: 100, investmentCr: 820, status: 'Delivered', priority: 'Critical', origin: 'BEL Bengaluru (KA)', destination: 'BEL Ghaziabad (UP)', shipDate: '2026-07-15', transitDays: 2, zone: 'South', remarks: 'SI-GaAs 2-inch wafer for BEL military X-band radar TR module MMIC power amplifier &#8594; 99.9999% SI-GaAs &#8594; &#8377;820Cr for 5K wafers &#8594; India &#8377;24,600Cr defence GaAs &#8594; BEL 10K MMIC &#8594; 100 mm &#8594; &#8594; LEC &#8594; &#8594; 10W &#8594; &#8594; radar' },
  { id: 'GAS-0002', batchNo: 'GAS-B2402', city: 'Hyderabad', manufacturer: 'DRDO DMRL', waferGrade: 'SI-GaAs 150mm 6-inch', application: 'AESA Radar (DRDO)', purityPercent: 99.9999, diameterMm: 150, investmentCr: 940, status: 'Delivered', priority: 'Critical', origin: 'DRDO DMRL Hyderabad (TG)', destination: 'DRDO Bangalore (KA)', shipDate: '2026-07-16', transitDays: 1, zone: 'South', remarks: 'SI-GaAs 6-inch wafer for DRDO Uttam AESA radar T/R module transmit chain &#8594; 99.9999% SI-GaAs &#8594; &#8377;940Cr for 8K wafers &#8594; India &#8377;28,200Cr defence GaAs &#8594; DRDO 1000 TRM &#8594; 150 mm &#8594; &#8594; VGF &#8594; &#8594; 15W &#8594; &#8594; AESA' },
  { id: 'GAS-0003', batchNo: 'GAS-B2403', city: 'Chennai', manufacturer: 'ISRO', waferGrade: 'SI-GaAs 100mm Solar', application: 'Satellite Solar Cell (ISRO)', purityPercent: 99.999, diameterMm: 100, investmentCr: 760, status: 'Delivered', priority: 'Critical', origin: 'ISRO Bengaluru (KA)', destination: 'ISRO Ahmedabad (GJ)', shipDate: '2026-07-17', transitDays: 2, zone: 'South', remarks: 'SI-GaAs multi-junction solar cell wafer for ISRO GSAT-N2 communication satellite &#8594; 99.999% SI-GaAs &#8594; &#8377;760Cr for 3K wafers &#8594; India &#8377;22,800Cr space GaAs &#8594; ISRO 12 sats &#8594; 100 mm &#8594; &#8594; MOCVD &#8594; &#8594; 30% &#8594; &#8594; MJ solar' },
  { id: 'GAS-0004', batchNo: 'GAS-B2404', city: 'Pune', manufacturer: 'Tata Advanced Materials', waferGrade: 'SI-GaAs 100mm IR LED', application: 'Night Vision (BEL)', purityPercent: 99.999, diameterMm: 100, investmentCr: 580, status: 'Delivered', priority: 'High', origin: 'Tata Advanced Materials Bengaluru (KA)', destination: 'BEL Pune (MH)', shipDate: '2026-07-18', transitDays: 1, zone: 'South', remarks: 'SI-GaAs wafer for BEL GaAs IR LED night vision image intensifier &#8594; 99.999% SI-GaAs &#8594; &#8377;580Cr for 4K wafers &#8594; India &#8377;17,400Cr defence GaAs &#8594; BEL 20K NVG &#8594; 100 mm &#8594; &#8594; LPE &#8594; &#8594; 950nm &#8594; &#8594; NV' },
  { id: 'GAS-0005', batchNo: 'GAS-B2405', city: 'Mumbai', manufacturer: 'Reliance Jio', waferGrade: 'SI-GaAs 200mm 8-inch', application: '5G PA Module (Qualcomm)', purityPercent: 99.9999, diameterMm: 200, investmentCr: 680, status: 'Delivered', priority: 'High', origin: 'Reliance Jio Bengaluru (KA)', destination: 'Qualcomm Hyderabad (TG)', shipDate: '2026-07-19', transitDays: 1, zone: 'West', remarks: 'SI-GaAs 8-inch wafer for Qualcomm 5G mmWave power amplifier module &#8594; 99.9999% SI-GaAs &#8594; &#8377;680Cr for 6K wafers &#8594; India &#8377;20,400Cr telecom GaAs &#8594; Qualcomm 50M PA &#8594; 200 mm &#8594; &#8594; HB &#8594; &#8594; 39GHz &#8594; &#8594; 5G' },
  { id: 'GAS-0006', batchNo: 'GAS-B2406', city: 'Ahmedabad', manufacturer: 'Gujarat GaAs Tech', waferGrade: 'Semi-Insulating LEC 100mm', application: 'Laser Diode (Dixon)', purityPercent: 99.99, diameterMm: 100, investmentCr: 450, status: 'Delivered', priority: 'High', origin: 'Gujarat GaAs Tech Ahmedabad (GJ)', destination: 'Dixon Noida (UP)', shipDate: '2026-07-20', transitDays: 2, zone: 'West', remarks: 'SI-GaAs LEC wafer for Dixon optoelectronics GaAs laser diode bar &#8594; 99.99% SI-GaAs &#8594; &#8377;450Cr for 2K wafers &#8594; India &#8377;13,500Cr opto GaAs &#8594; Dixon 5M diodes &#8594; 100 mm &#8594; &#8594; LEC &#8594; &#8594; 808nm &#8594; &#8594; laser' },
  { id: 'GAS-0007', batchNo: 'GAS-B2407', city: 'Jaipur', manufacturer: 'Rajasthan GaAs Corp', waferGrade: 'GaAs Substrate 2-inch Epi', application: 'HEMT Device (CSIR-CEERI)', purityPercent: 99.999, diameterMm: 100, investmentCr: 520, status: 'Delivered', priority: 'High', origin: 'Rajasthan GaAs Corp Jaipur (RJ)', destination: 'CSIR-CEERI Pilani (RJ)', shipDate: '2026-07-21', transitDays: 1, zone: 'North', remarks: 'SI-GaAs substrate for CSIR-CEERI GaAs HEMT 5G基站 low-noise amplifier &#8594; 99.999% SI-GaAs &#8594; &#8377;520Cr for 3K wafers &#8594; India &#8377;15,600Cr research GaAs &#8594; CSIR &#8594; 100 mm &#8594; &#8594; MBE &#8594; &#8594; 0.15um &#8594; &#8594; HEMT' },
  { id: 'GAS-0008', batchNo: 'GAS-B2408', city: 'Bhubaneswar', manufacturer: 'NALCO', waferGrade: 'GaAs Poly 6N', application: 'Solar Concentrator (Adani)', purityPercent: 99.9999, diameterMm: 50, investmentCr: 380, status: 'Delivered', priority: 'Medium', origin: 'NALCO Bhubaneswar (OD)', destination: 'Adani Green Mumbai (MH)', shipDate: '2026-07-22', transitDays: 3, zone: 'East', remarks: '6N poly GaAs for Adani Green CPV solar concentrator triple-junction cell &#8594; 99.9999% GaAs &#8594; &#8377;380Cr for 1 tonne &#8594; India &#8377;11,400Cr solar GaAs &#8594; Adani 200MW &#8594; 50 mm &#8594; &#8594; CZ &#8594; &#8594; 45% &#8594; &#8594; CPV' },
  { id: 'GAS-0009', batchNo: 'GAS-B2409', city: 'Coimbatore', manufacturer: 'Tamil Nadu GaAs Corp', waferGrade: 'SI-GaAs 150mm MBE', application: 'IR Detector (ISRO)', purityPercent: 99.9999, diameterMm: 150, investmentCr: 640, status: 'Delivered', priority: 'High', origin: 'Tamil Nadu GaAs Corp Coimbatore (TN)', destination: 'ISRO Ahmedabad (GJ)', shipDate: '2026-07-23', transitDays: 3, zone: 'South', remarks: 'SI-GaAs 6-inch MBE wafer for ISRO satellite thermal IR FPA detector &#8594; 99.9999% SI-GaAs &#8594; &#8377;640Cr for 4K wafers &#8594; India &#8377;19,200Cr space GaAs &#8594; ISRO 12 sats &#8594; 150 mm &#8594; &#8594; MBE &#8594; &#8594; 3-5um &#8594; &#8594; FPA' },
  { id: 'GAS-0010', batchNo: 'GAS-B2410', city: 'Surat', manufacturer: 'Gujarat GaAs Products', waferGrade: 'GaInP/GaAs/Ge MJ Cell', application: 'Space Solar (ISRO)', purityPercent: 99.999, diameterMm: 100, investmentCr: 720, status: 'Delivered', priority: 'Critical', origin: 'Gujarat GaAs Products Surat (GJ)', destination: 'ISRO Bengaluru (KA)', shipDate: '2026-07-24', transitDays: 2, zone: 'West', remarks: 'GaInP/GaAs/Ge triple-junction cell wafer for ISRO NavIC satellite solar array &#8594; 99.999% GaAs MJ &#8594; &#8377;720Cr for 3K wafers &#8594; India &#8377;21,600Cr space GaAs &#8594; ISRO 8 sats &#8594; 100 mm &#8594; &#8594; MOCVD &#8594; &#8594; 32% &#8594; &#8594; MJ' },
  { id: 'GAS-0011', batchNo: 'GAS-B2411', city: 'Guwahati', manufacturer: 'Assam GaAs Metals', waferGrade: 'SI-GaAs 100mm VCSEL', application: '3D Sensing (Wipro)', purityPercent: 99.999, diameterMm: 100, investmentCr: 460, status: 'Delivered', priority: 'High', origin: 'Assam GaAs Metals Guwahati (AS)', destination: 'Wipro Bengaluru (KA)', shipDate: '2026-07-25', transitDays: 4, zone: 'East', remarks: 'SI-GaAs wafer for Wipro GaAs VCSEL 3D face recognition sensor array &#8594; 99.999% SI-GaAs &#8594; &#8377;460Cr for 5K wafers &#8594; India &#8377;13,800Cr consumer GaAs &#8594; Wipro 10M VCSEL &#8594; 100 mm &#8594; &#8594; MOCVD &#8594; &#8594; 940nm &#8594; &#8594; VCSEL' },
  { id: 'GAS-0012', batchNo: 'GAS-B2412', city: 'Lucknow', manufacturer: 'UP GaAs Industries', waferGrade: 'SI-GaAs 150mm HB', application: 'Phased Array (DRDO)', purityPercent: 99.9999, diameterMm: 150, investmentCr: 700, status: 'Delayed', priority: 'Critical', origin: 'UP GaAs Industries Lucknow (UP)', destination: 'DRDO Hyderabad (TG)', shipDate: '2026-07-01', transitDays: 28, zone: 'North', remarks: 'SI-GaAs 6-inch HB wafer for DRDO AEW&amp;CS airborne phased array radar T/R module &#8594; 99.9999% SI-GaAs &#8594; &#8377;700Cr for 5K wafers &#8594; monsoon delay &#8594; India &#8377;21,000Cr defence GaAs &#8594; DRDO 2000 TRM &#8594; 150 mm &#8594; &#8594; HB &#8594; &#8594; 20W &#8594; &#8594; AESA' },
  { id: 'GAS-0013', batchNo: 'GAS-B2413', city: 'Noida', manufacturer: 'SAIL', waferGrade: 'GaAs 2-inch Hall Sensor', application: 'Current Sensor (BHEL)', purityPercent: 99.99, diameterMm: 100, investmentCr: 310, status: 'Delivered', priority: 'Medium', origin: 'SAIL Rourkela (OD)', destination: 'BHEL Haridwar (UK)', shipDate: '2026-07-26', transitDays: 2, zone: 'East', remarks: 'SI-GaAs Hall effect sensor wafer for BHEL EV inverter current measurement &#8594; 99.99% SI-GaAs &#8594; &#8377;310Cr for 2K wafers &#8594; India &#8377;9,300Cr industrial GaAs &#8594; BHEL 100K sensors &#8594; 100 mm &#8594; &#8594; ion implant &#8594; &#8594; 500A &#8594; &#8594; Hall' },
  { id: 'GAS-0014', batchNo: 'GAS-B2414', city: 'Bhopal', manufacturer: 'BHEL', waferGrade: 'SI-GaAs 100mm Photo Cathode', application: 'Photomultiplier (HLL)', purityPercent: 99.999, diameterMm: 100, investmentCr: 380, status: 'Delivered', priority: 'High', origin: 'BHEL Bhopal (MP)', destination: 'HLL Hyderabad (TG)', shipDate: '2026-07-27', transitDays: 1, zone: 'North', remarks: 'SI-GaAs photocathode wafer for HLL GaAsP hybrid photomultiplier PET detector &#8594; 99.999% SI-GaAs &#8594; &#8377;380Cr for 1K wafers &#8594; India &#8377;11,400Cr medical GaAs &#8594; HLL 500 PMT &#8594; 100 mm &#8594; &#8594; MBE &#8594; &#8594; QE 30% &#8594; &#8594; PET' }
];

const tabs = ['Dashboard', 'Registry', 'Analytics', 'Insights'] as const;
type Tab = typeof tabs[number];
const priorityColors: Record<string, string> = { Critical: 'bg-red-100 text-red-800', High: 'bg-amber-100 text-amber-800', Medium: 'bg-green-100 text-green-800', Low: 'bg-slate-100 text-slate-600' };
const delayedSet = new Set(galliumArsenideRecords.filter(r => r.status === 'Delayed').map(r => r.id));

export default function GalliumArsenideLogisticsView() {
  const [activeTab, setActiveTab] = useState<Tab>('Dashboard');
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const toggleFilter = (k: string, v: string) => { setFilters(p => { const s = { ...p }; const a = s[k] || []; const i = a.indexOf(v); if (i > -1) { a.splice(i, 1); if (!a.length) delete s[k]; } else s[k] = [...a, v]; return s; }); };
  const filtered = useMemo(() => {
    let d = galliumArsenideRecords;
    if (search) { const q = search.toLowerCase(); d = d.filter(r => r.id.toLowerCase().includes(q) || r.batchNo.toLowerCase().includes(q) || r.waferGrade.toLowerCase().includes(q) || r.application.toLowerCase().includes(q) || r.city.toLowerCase().includes(q) || r.manufacturer.toLowerCase().includes(q)); }
    Object.entries(filters).forEach(([k, vs]) => { if (vs.length) d = d.filter(r => { const v = String((r as unknown as Record<string, unknown>)[k] ?? ''); return vs.some(x => v.toLowerCase().includes(x.toLowerCase())); }); });
    return d;
  }, [search, filters]);
  const totalCr = filtered.reduce((s: number, r) => s + r.investmentCr, 0);
  const avgPurity = filtered.length ? filtered.reduce((s: number, r) => s + r.purityPercent, 0) / filtered.length : 0;
  const delayedCount = filtered.filter(r => r.status === 'Delayed').length;

  return (
    <div className="space-y-6">
      <PageHeader title="Gallium Arsenide Logistics" description="Indian gallium arsenide wafer supply chain tracking for defence AESA radar, satellite solar cells, 5G power amplifiers, night vision, IR detectors, VCSEL sensors, and medical PET imaging" />
      <div className="flex gap-2 border-b">
        {tabs.map(t => (<button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-2 text-sm font-medium ${activeTab === t ? 'border-b-2 border-violet-500 text-violet-700' : 'text-muted-foreground hover:text-foreground'}`}>{t}</button>))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent><div className="text-2xl font-bold text-violet-600">{filtered.length}</div><div className="text-xs text-muted-foreground">Total Shipments</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-violet-600">&#8377;{totalCr.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground">Total Investment</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-violet-600">{avgPurity.toFixed(4)}%</div><div className="text-xs text-muted-foreground">Avg Purity</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-red-500">{delayedCount}</div><div className="text-xs text-muted-foreground">Delayed Shipments</div></CardContent></Card>
      </div>
      {(activeTab === 'Dashboard' || activeTab === 'Registry') && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <input placeholder="Search ID, grade, application, city..." value={search} onChange={e => setSearch(e.target.value)} className="border rounded-md px-3 py-1.5 text-sm flex-1 min-w-48" />
            {['status', 'priority', 'zone'].map(f => { const opts = [...new Set(galliumArsenideRecords.map(r => (r as unknown as Record<string, unknown>)[f] as string))]; return (<div key={f} className="flex flex-wrap gap-1">{opts.map(o => (<Badge key={o} variant={(filters[f] || []).includes(o) ? 'default' : 'outline'} className="cursor-pointer text-xs" onClick={() => toggleFilter(f, o)}>{o}</Badge>))}</div>); })}
          </div>
          <div className="rounded-md border"><div className="max-h-96 overflow-auto"><table className="w-full text-sm"><thead className="sticky top-0 bg-background"><tr><th className="p-2 text-left">ID</th><th className="p-2 text-left">Batch</th><th className="p-2 text-left">Grade</th><th className="p-2 text-left">Application</th><th className="p-2 text-right">Purity%</th><th className="p-2 text-right">&#8377;Cr</th><th className="p-2 text-left">Status</th></tr></thead><tbody>{filtered.map(r => (<tr key={r.id} className={`border-t ${delayedSet.has(r.id) ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}><td className="p-2">{r.id}</td><td className="p-2">{r.batchNo}</td><td className="p-2">{r.waferGrade}</td><td className="p-2">{r.application}</td><td className="p-2 text-right">{r.purityPercent}</td><td className="p-2 text-right">{r.investmentCr}</td><td className="p-2"><Badge variant={r.status === 'Delivered' ? 'default' : 'destructive'}>{r.status}</Badge></td></tr>))}</tbody></table></div></div>
        </div>
      )}
      {(activeTab === 'Dashboard' || activeTab === 'Analytics') && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">Investment by Application</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { m[r.application] = (m[r.application] || 0) + r.investmentCr; return m }, {} as Record<string, number>)) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 7).map(([a, v]) => (<div key={a} className="flex justify-between text-sm"><span>{a}</span><span className="font-medium">&#8377;{v}Cr</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Shipments by Zone</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { m[r.zone] = (m[r.zone] || 0) + 1; return m }, {} as Record<string, number>)) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([z, c]) => (<div key={z} className="flex justify-between text-sm"><span>{z}</span><span className="font-medium">{c}</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Top Routes by Value</CardTitle></CardHeader><CardContent><div className="space-y-2">{filtered.sort((a, b) => b.investmentCr - a.investmentCr).slice(0, 7).map(r => (<div key={r.id} className="flex justify-between text-sm"><span>{r.origin.split('(')[0]} &#8594; {r.destination.split('(')[0]}</span><span className="font-medium">&#8377;{r.investmentCr}Cr</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Defence &amp; Space</CardTitle></CardHeader><CardContent><div className="space-y-2">{filtered.filter(r => r.application.toLowerCase().includes('radar') || r.application.toLowerCase().includes('isro') || r.application.toLowerCase().includes('space') || r.application.toLowerCase().includes('defence') || r.application.toLowerCase().includes('drdo') || r.application.toLowerCase().includes('night')).sort((a, b) => b.investmentCr - a.investmentCr).map(r => (<div key={r.id} className="flex justify-between text-sm"><span>{r.waferGrade}</span><span className="font-medium">&#8377;{r.investmentCr}Cr</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">By Priority</CardTitle></CardHeader><CardContent><div className="space-y-2">{Object.entries(filtered.reduce((m, r) => { m[r.priority] = (m[r.priority] || 0) + 1; return m }, {} as Record<string, number>)).map(([p, c]) => (<div key={p} className="flex justify-between text-sm"><span className={priorityColors[p] || ''}>{p}</span><span className="font-medium">{c}</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Wafer Diameter Distribution</CardTitle></CardHeader><CardContent><div className="space-y-2">{[{ l: '100mm (4-inch)', f: filtered.filter(r => r.diameterMm === 100).length }, { l: '150mm (6-inch)', f: filtered.filter(r => r.diameterMm === 150).length }, { l: '200mm (8-inch)', f: filtered.filter(r => r.diameterMm === 200).length }, { l: 'Other (50mm etc)', f: filtered.filter(r => r.diameterMm === 50).length }].map(b => (<div key={b.l} className="flex justify-between text-sm"><span>{b.l}</span><span className="font-medium">{b.f}</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Top Manufacturers</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { m[r.manufacturer] = (m[r.manufacturer] || 0) + r.investmentCr; return m }, {} as Record<string, number>)) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 7).map(([m, v]) => (<div key={m} className="flex justify-between text-sm"><span>{m}</span><span className="font-medium">&#8377;{v}Cr</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Avg Transit Days</CardTitle></CardHeader><CardContent><div className="space-y-2">{filtered.length ? (Object.entries(filtered.reduce((m, r) => { m[r.zone] = (m[r.zone] || [] as number[]).concat(r.transitDays); return m }, {} as Record<string, number[]>)) as [string, number[]][]).map(([z, d]) => (<div key={z} className="flex justify-between text-sm"><span>{z}</span><span className="font-medium">{(d.reduce((s, n) => s + n, 0) / d.length).toFixed(1)}d</span></div>)) : []}</div></CardContent></Card>
        </div>
      )}
      {(activeTab === 'Dashboard' || activeTab === 'Insights') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card><CardContent><div className="text-sm font-medium text-violet-600 mb-2">DRDO Uttam AESA Radar GaAs MMIC</div><div className="text-xs text-muted-foreground">DRDO DMRL fabricating SI-GaAs 6-inch MMIC power amplifiers for Uttam AESA fire control radar on Tejas Mk1A. GaAs MMICs deliver 15W X-band output replacing imported GaN modules at lower cost. Programme under &#8377;6,500Cr DRDO Radar Electronics Mission with BEL as production agency targeting 1000 T/R modules per radar set.</div></CardContent></Card>
          <Card><CardContent><div className="text-sm font-medium text-violet-600 mb-2">ISRO Triple-Junction Space Solar Cells</div><div className="text-xs text-muted-foreground">ISRO SAC developing GaInP/GaAs/Ge triple-junction solar cells from SI-GaAs wafers achieving 32% AM0 efficiency for GSAT and NavIC satellite power systems. GaAs MJ cells provide 2x power density vs silicon. India targeting 200KW in-orbit solar capacity by 2030 under &#8377;4,800Cr ISRO Space Power Initiative.</div></CardContent></Card>
          <Card><CardContent><div className="text-sm font-medium text-violet-600 mb-2">Qualcomm 5G mmWave PA GaAs</div><div className="text-xs text-muted-foreground">Reliance Jio and Qualcomm qualifying indigenous 8-inch SI-GaAs wafers for 5G mmWave (39GHz) power amplifier module production at Gujarat Fab. GaAs offers 2x PAE vs SiGe at mmWave frequencies. Programme under &#8377;8,200Cr India Semiconductor Mission targeting 100M PA modules by 2028.</div></CardContent></Card>
          <Card><CardContent><div className="text-sm font-medium text-violet-600 mb-2">HLL GaAs Photomultiplier PET Detector</div><div className="text-xs text-muted-foreground">HLL developing GaAs photocathode hybrid photomultiplier tubes for PET/CT medical imaging from BHEL SI-GaAs MBE wafers. GaAs achieves 30% quantum efficiency vs 25% for bialkali PMT enabling faster scan times. India targeting 500 PET scanners by 2028 under &#8377;3,200Cr National Nuclear Medicine Programme.</div></CardContent></Card>
        </div>
      )}
    </div>
  );
}
'''

outpath = '/home/z/my-project/src/components/modules/gallium-arsenide-logistics-view.tsx'
with open(outpath, 'w', encoding='utf-8') as f:
    f.write(content)
print(f"Generated: {outpath}")
print(f"Size: {len(content)} bytes")
