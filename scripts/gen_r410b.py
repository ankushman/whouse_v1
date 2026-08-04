#!/usr/bin/env python3
"""Generate R410b: Bismuth Telluride Logistics View"""
import os

content = r""""use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared';
import { Thermometer } from 'lucide-react';

interface BismuthTellurideRecord {
  id: string;
  batchNo: string;
  city: string;
  manufacturer: string;
  materialGrade: string;
  application: string;
  ztValue: number;
  thermalCondWmK: number;
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

const bismuthTellurideRecords: BismuthTellurideRecord[] = [
  { id: 'BTD-0001', batchNo: 'BTD-B2401', city: 'Bengaluru', manufacturer: 'Sterlite Thermoelectrics', materialGrade: 'Bi2Te3 99.999% n-type', application: 'Peltier Cooler Module (Voltas)', ztValue: 1.05, thermalCondWmK: 1.5, investmentCr: 610, status: 'Delivered', priority: 'Critical', origin: 'Sterlite Thermoelectrics Bengaluru (KA)', destination: 'Voltas Mumbai (MH)', shipDate: '2026-07-15', transitDays: 2, zone: 'South', remarks: 'Bi2Te3 n-type for Voltas commercial 5kW Peltier precision cooling &#8594; 99.999% Bi2Te3 &#8594; &#8377;610Cr for 1.5 tonnes &#8594; India &#8377;18,300Cr TE Bi2Te3 &#8594; Voltas 50K units &#8594; ZT 1.05 &#8594; 1.5 W/mK &#8594; 300K &#8594; &#8594; CEC &#8594; hot side' },
  { id: 'BTD-0002', batchNo: 'BTD-B2402', city: 'Hyderabad', manufacturer: 'DRDO DMRL', materialGrade: 'Bi0.5Sb1.5Te3 p-type', application: 'Soldier Thermoelectric Vest (DRDO)', ztValue: 1.15, thermalCondWmK: 1.2, investmentCr: 480, status: 'Delivered', priority: 'Critical', origin: 'DRDO DMRL Hyderabad (TG)', destination: 'DRDO Pune (MH)', shipDate: '2026-07-16', transitDays: 2, zone: 'South', remarks: 'Bi-Sb-Te p-type for DRDO Siachen soldier body thermoelectric generator &#8594; Bi0.5Sb1.5Te3 alloy &#8594; &#8377;480Cr for 0.8 tonnes &#8594; India &#8377;14,400Cr defence Bi2Te3 &#8594; DRDO 20K vests &#8594; ZT 1.15 &#8594; 1.2 W/mK &#8594; 330K &#8594; &#8594; 10W &#8594; vest' },
  { id: 'BTD-0003', batchNo: 'BTD-B2403', city: 'Mumbai', manufacturer: 'Tata Power Solar', materialGrade: 'Bi2Te2.7Se0.3 n-type', application: 'Waste Heat Recovery (Tata Steel)', ztValue: 1.0, thermalCondWmK: 1.4, investmentCr: 720, status: 'Delivered', priority: 'Critical', origin: 'Tata Power Solar Bengaluru (KA)', destination: 'Tata Steel Jamshedpur (JH)', shipDate: '2026-07-17', transitDays: 3, zone: 'West', remarks: 'Bi2Te2.7Se0.3 for Tata Steel blast furnace waste heat TEG &#8594; n-type Se-doped Bi2Te3 &#8594; &#8377;720Cr for 3 tonnes &#8594; India &#8377;21,600Cr steel Bi2Te3 &#8594; Tata 15 MT &#8594; ZT 1.0 &#8594; 1.4 W/mK &#8594; 450K &#8594; &#8594; 5MW &#8594; exhaust' },
  { id: 'BTD-0004', batchNo: 'BTD-B2404', city: 'Pune', manufacturer: 'Bharat Forge', materialGrade: 'Bi2Te3 99.99% Bulk Crystal', application: 'Automotive Seat Cooler (Mahindra)', ztValue: 0.95, thermalCondWmK: 1.6, investmentCr: 390, status: 'Delivered', priority: 'High', origin: 'Bharat Forge Pune (MH)', destination: 'Mahindra Chennai (TN)', shipDate: '2026-07-18', transitDays: 2, zone: 'West', remarks: 'Bi2Te3 bulk crystal for Mahindra EV seat integrated Peltier cooling &#8594; 99.99% single crystal &#8594; &#8377;390Cr for 0.5 tonnes &#8594; India &#8377;11,700Cr auto Bi2Te3 &#8594; Mahindra 100K XUV700 &#8594; ZT 0.95 &#8594; 1.6 W/mK &#8594; 300K &#8594; &#8594; 60W &#8594; seat' },
  { id: 'BTD-0005', batchNo: 'BTD-B2405', city: 'Chennai', manufacturer: 'IGCAR', materialGrade: 'Bi2Te3 p-type doped', application: 'Radioisotope RTG (ISRO)', ztValue: 0.85, thermalCondWmK: 1.8, investmentCr: 550, status: 'Delivered', priority: 'Critical', origin: 'IGCAR Kalpakkam (TN)', destination: 'ISRO Ahmedabad (GJ)', shipDate: '2026-07-19', transitDays: 2, zone: 'South', remarks: 'Bi2Te3 for ISRO deep space probe radioisotope thermoelectric generator &#8594; Cu-doped p-type &#8594; &#8377;550Cr for 0.3 tonnes &#8594; India &#8377;16,500Cr space Bi2Te3 &#8594; ISRO 8 probes &#8594; ZT 0.85 &#8594; 1.8 W/mK &#8594; 500K &#8594; &#8594; Pu-238 &#8594; RTG' },
  { id: 'BTD-0006', batchNo: 'BTD-B2406', city: 'Ahmedabad', manufacturer: 'Gujarat Bi2Te3 Tech', materialGrade: 'Bi2Te3 Nanostructured', application: 'CPU Hotspot Cooler (Wipro)', ztValue: 1.2, thermalCondWmK: 0.9, investmentCr: 430, status: 'Delivered', priority: 'High', origin: 'Gujarat Bi2Te3 Tech Ahmedabad (GJ)', destination: 'Wipro Bengaluru (KA)', shipDate: '2026-07-20', transitDays: 2, zone: 'West', remarks: 'Nanostructured Bi2Te3 for Wipro server CPU sub-ambient hotspot cooler &#8594; ball-milled nano &#8594; &#8377;430Cr for 0.2 tonnes &#8594; India &#8377;12,900Cr IT Bi2Te3 &#8594; Wipro 10K servers &#8594; ZT 1.2 &#8594; 0.9 W/mK &#8594; 320K &#8594; &#8594; 150W &#8594; TEC' },
  { id: 'BTD-0007', batchNo: 'BTD-B2407', city: 'Jaipur', manufacturer: 'Rajasthan Thermoelectric', materialGrade: 'Bi-Sb-Te Thin Film', application: 'IR Sensor Cooling (BEL)', ztValue: 0.9, thermalCondWmK: 1.3, investmentCr: 320, status: 'Delivered', priority: 'High', origin: 'Rajasthan Thermoelectric Jaipur (RJ)', destination: 'BEL Ghaziabad (UP)', shipDate: '2026-07-21', transitDays: 2, zone: 'North', remarks: 'Bi-Sb-Te thin film for BEL military thermal IR detector Peltier cooling &#8594; sputtered thin film &#858594; &#8377;320Cr for 0.1 tonnes &#8594; India &#8377;9,600Cr defence Bi2Te3 &#8594; BEL 2000 sensors &#8594; ZT 0.9 &#8594; 1.3 W/mK &#8594; 250K &#8594; &#8594; 77K &#8594; dewar' },
  { id: 'BTD-0008', batchNo: 'BTD-B2408', city: 'Bhubaneswar', manufacturer: 'NALCO', materialGrade: 'Bi2Te3 99.9% Powder', application: 'Laser Diode Cooler (HPCL)', ztValue: 1.0, thermalCondWmK: 1.5, investmentCr: 280, status: 'Delivered', priority: 'Medium', origin: 'NALCO Bhubaneswar (OD)', destination: 'HPCL Visakhapatnam (AP)', shipDate: '2026-07-22', transitDays: 3, zone: 'East', remarks: 'Bi2Te3 powder for HPCL pipeline laser gas leak detector TEC cooler &#8594; hot-pressed powder &#8594; &#8377;280Cr for 0.4 tonnes &#8594; India &#8377;8,400Cr oil Bi2Te3 &#8594; HPCL 15K km &#8594; ZT 1.0 &#8594; 1.5 W/mK &#8594; 290K &#8594; &#8594; 5W &#8594; LD' },
  { id: 'BTD-0009', batchNo: 'BTD-B2409', city: 'Coimbatore', manufacturer: 'Tamil Nadu Thermoelectric', materialGrade: 'Bi2Te3/SiC Composite', application: 'Industrial Process Cooler (Thermax)', ztValue: 0.88, thermalCondWmK: 2.0, investmentCr: 350, status: 'Delivered', priority: 'Medium', origin: 'Tamil Nadu Thermoelectric Coimbatore (TN)', destination: 'Thermax Pune (MH)', shipDate: '2026-07-23', transitDays: 1, zone: 'South', remarks: 'Bi2Te3/SiC composite for Thermax industrial process Peltier chiller &#8594; 3% SiC dispersion &#8594; &#8377;350Cr for 2 tonnes &#8594; India &#8377;10,500Cr process Bi2Te3 &#8594; Thermax 500 units &#8594; ZT 0.88 &#8594; 2.0 W/mK &#8594; 350K &#8594; &#8594; 2kW &#8594; chiller' },
  { id: 'BTD-0010', batchNo: 'BTD-B2410', city: 'Surat', manufacturer: 'Gujarat Bi2Te3 Products', materialGrade: 'Bi0.3Sb1.7Te3 p-type', application: 'Optical Detector TEC (RailTel)', ztValue: 1.1, thermalCondWmK: 1.1, investmentCr: 410, status: 'Delivered', priority: 'High', origin: 'Gujarat Bi2Te3 Products Surat (GJ)', destination: 'RailTel Bengaluru (KA)', shipDate: '2026-07-24', transitDays: 2, zone: 'West', remarks: 'Bi-Sb-Te for RailTel fiber optic amplifier TEC detector cooling &#8594; Bridgman p-type &#8594; &#8377;410Cr for 0.3 tonnes &#8594; India &#8377;12,300Cr telecom Bi2Te3 &#8594; RailTel 60K &#8594; ZT 1.1 &#8594; 1.1 W/mK &#8594; 280K &#8594; &#8594; 3W &#8594; EDFA' },
  { id: 'BTD-0011', batchNo: 'BTD-B2411', city: 'Guwahati', manufacturer: 'Assam Thermoelectric', materialGrade: 'Bi2Te3 Hot-Pressed', application: 'Telecom Shelter Cooling (Jio)', ztValue: 0.92, thermalCondWmK: 1.4, investmentCr: 330, status: 'Delivered', priority: 'Medium', origin: 'Assam Thermoelectric Guwahati (AS)', destination: 'Jio Mumbai (MH)', shipDate: '2026-07-25', transitDays: 4, zone: 'East', remarks: 'Bi2Te3 for Jio 5G tower shelter Peltier air conditioner &#8594; hot-pressed disc &#8594; &#8377;330Cr for 2.5 tonnes &#8594; India &#8377;9,900Cr telecom Bi2Te3 &#8594; Jio 300K towers &#8594; ZT 0.92 &#8594; 1.4 W/mK &#8594; 310K &#8594; &#8594; 500W &#8594; shelter' },
  { id: 'BTD-0012', batchNo: 'BTD-B2412', city: 'Lucknow', manufacturer: 'UP Thermoelectric', materialGrade: 'Bi2Te3 p-type Bulk', application: 'Medical Device Cooler (HLL)', ztValue: 1.05, thermalCondWmK: 1.3, investmentCr: 460, status: 'Delayed', priority: 'High', origin: 'UP Thermoelectric Lucknow (UP)', destination: 'HLL Hyderabad (TG)', shipDate: '2026-07-01', transitDays: 26, zone: 'North', remarks: 'Bi2Te3 for HLL portable blood bank Peltier transport cooler &#8594; zone-refined p-type &#8594; &#8377;460Cr for 0.6 tonnes &#8594; monsoon delay &#8594; India &#8377;13,800Cr medical Bi2Te3 &#8594; HLL 5000 coolers &#8594; ZT 1.05 &#8594; 1.3 W/mK &#8594; 280K &#8594; &#8594; 20W &#8594; blood' },
  { id: 'BTD-0013', batchNo: 'BTD-B2413', city: 'Noida', manufacturer: 'SAIL', materialGrade: 'Bi2Te3 99.95% Ingot', application: 'Automotive A/C TEG (Maruti Suzuki)', ztValue: 0.82, thermalCondWmK: 1.7, investmentCr: 540, status: 'Delivered', priority: 'High', origin: 'SAIL Rourkela (OD)', destination: 'Maruti Suzuki Gurugram (HR)', shipDate: '2026-07-26', transitDays: 2, zone: 'North', remarks: 'Bi2Te3 for Maruti Suzuki exhaust waste heat powered cabin TEG &#8594; Czochralski ingot &#8594; &#8377;540Cr for 4 tonnes &#8594; India &#8377;16,200Cr auto Bi2Te3 &#8594; Maruti 2M cars &#8594; ZT 0.82 &#8594; 1.7 W/mK &#8594; 400K &#8594; &#8594; 200W &#8594; exhaust' },
  { id: 'BTD-0014', batchNo: 'BTD-B2414', city: 'Bhopal', manufacturer: 'BHEL', materialGrade: 'Bi2Te3/SiO2 Nanocomposite', application: 'Power Plant Sensor Cooler (NTPC)', ztValue: 0.96, thermalCondWmK: 1.2, investmentCr: 390, status: 'Delivered', priority: 'Medium', origin: 'BHEL Bhopal (MP)', destination: 'NTPC Singrauli (UP)', shipDate: '2026-07-27', transitDays: 1, zone: 'North', remarks: 'Bi2Te3/SiO2 nanocomposite for NTPC boiler temperature sensor Peltier cooler &#8594; 5% SiO2 nano &#8594; &#8377;390Cr for 1 tonne &#8594; India &#8377;11,700Cr power Bi2Te3 &#8594; NTPC 50 GW &#8594; ZT 0.96 &#8594; 1.2 W/mK &#8594; 300K &#8594; &#8594; 8W &#8594; PT100' }
];

const tabs = ['Dashboard', 'Registry', 'Analytics', 'Insights'] as const;
type Tab = typeof tabs[number];
const priorityColors: Record<string, string> = { Critical: 'bg-red-100 text-red-800', High: 'bg-amber-100 text-amber-800', Medium: 'bg-green-100 text-green-800', Low: 'bg-slate-100 text-slate-600' };
const delayedSet = new Set(bismuthTellurideRecords.filter(r => r.status === 'Delayed').map(r => r.id));

export default function BismuthTellurideLogisticsView() {
  const [activeTab, setActiveTab] = useState<Tab>('Dashboard');
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const toggleFilter = (k: string, v: string) => { setFilters(p => { const s = { ...p }; const a = s[k] || []; const i = a.indexOf(v); if (i > -1) { a.splice(i, 1); if (!a.length) delete s[k]; } else s[k] = [...a, v]; return s; }); };
  const filtered = useMemo(() => {
    let d = bismuthTellurideRecords;
    if (search) { const q = search.toLowerCase(); d = d.filter(r => r.id.toLowerCase().includes(q) || r.batchNo.toLowerCase().includes(q) || r.materialGrade.toLowerCase().includes(q) || r.application.toLowerCase().includes(q) || r.city.toLowerCase().includes(q) || r.manufacturer.toLowerCase().includes(q)); }
    Object.entries(filters).forEach(([k, vs]) => { if (vs.length) d = d.filter(r => { const v = String((r as unknown as Record<string, unknown>)[k] ?? ''); return vs.some(x => v.toLowerCase().includes(x.toLowerCase())); }); });
    return d;
  }, [search, filters]);
  const totalCr = filtered.reduce((s: number, r) => s + r.investmentCr, 0);
  const avgZT = filtered.length ? filtered.reduce((s: number, r) => s + r.ztValue, 0) / filtered.length : 0;
  const delayedCount = filtered.filter(r => r.status === 'Delayed').length;

  return (
    <div className="space-y-6">
      <PageHeader title="Bismuth Telluride Logistics" description="Indian bismuth telluride thermoelectric supply chain tracking for Peltier cooling, waste heat recovery, defence RTG, automotive TEG and telecom shelter cooling sectors" />
      <div className="flex gap-2 border-b">
        {tabs.map(t => (<button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-2 text-sm font-medium ${activeTab === t ? 'border-b-2 border-rose-500 text-rose-700' : 'text-muted-foreground hover:text-foreground'}`}>{t}</button>))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent><div className="text-2xl font-bold text-rose-600">{filtered.length}</div><div className="text-xs text-muted-foreground">Total Shipments</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-rose-600">&#8377;{totalCr.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground">Total Investment</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-rose-600">{avgZT.toFixed(2)}</div><div className="text-xs text-muted-foreground">Avg ZT Figure</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-red-500">{delayedCount}</div><div className="text-xs text-muted-foreground">Delayed Shipments</div></CardContent></Card>
      </div>
      {(activeTab === 'Dashboard' || activeTab === 'Registry') && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <input placeholder="Search ID, grade, application, city..." value={search} onChange={e => setSearch(e.target.value)} className="border rounded-md px-3 py-1.5 text-sm flex-1 min-w-48" />
            {['status', 'priority', 'zone'].map(f => { const opts = [...new Set(bismuthTellurideRecords.map(r => (r as unknown as Record<string, unknown>)[f] as string))]; return (<div key={f} className="flex flex-wrap gap-1">{opts.map(o => (<Badge key={o} variant={(filters[f] || []).includes(o) ? 'default' : 'outline'} className="cursor-pointer text-xs" onClick={() => toggleFilter(f, o)}>{o}</Badge>))}</div>); })}
          </div>
          <div className="rounded-md border"><div className="max-h-96 overflow-auto"><table className="w-full text-sm"><thead className="sticky top-0 bg-background"><tr><th className="p-2 text-left">ID</th><th className="p-2 text-left">Batch</th><th className="p-2 text-left">Grade</th><th className="p-2 text-left">Application</th><th className="p-2 text-right">ZT</th><th className="p-2 text-right">&#8377;Cr</th><th className="p-2 text-left">Status</th></tr></thead><tbody>{filtered.map(r => (<tr key={r.id} className={`border-t ${delayedSet.has(r.id) ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}><td className="p-2">{r.id}</td><td className="p-2">{r.batchNo}</td><td className="p-2">{r.materialGrade}</td><td className="p-2">{r.application}</td><td className="p-2 text-right">{r.ztValue}</td><td className="p-2 text-right">{r.investmentCr}</td><td className="p-2"><Badge variant={r.status === 'Delivered' ? 'default' : 'destructive'}>{r.status}</Badge></td></tr>))}</tbody></table></div></div>
        </div>
      )}
      {(activeTab === 'Dashboard' || activeTab === 'Analytics') && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">Investment by Application</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { m[r.application] = (m[r.application] || 0) + r.investmentCr; return m }, {} as Record<string, number>)) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 7).map(([a, v]) => (<div key={a} className="flex justify-between text-sm"><span>{a}</span><span className="font-medium">&#8377;{v}Cr</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Shipments by Zone</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { m[r.zone] = (m[r.zone] || 0) + 1; return m }, {} as Record<string, number>)) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([z, c]) => (<div key={z} className="flex justify-between text-sm"><span>{z}</span><span className="font-medium">{c}</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Top Routes by Value</CardTitle></CardHeader><CardContent><div className="space-y-2">{filtered.sort((a, b) => b.investmentCr - a.investmentCr).slice(0, 7).map(r => (<div key={r.id} className="flex justify-between text-sm"><span>{r.origin.split('(')[0]} &#8594; {r.destination.split('(')[0]}</span><span className="font-medium">&#8377;{r.investmentCr}Cr</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Defence and Space</CardTitle></CardHeader><CardContent><div className="space-y-2">{filtered.filter(r => r.application.toLowerCase().includes('defence') || r.application.toLowerCase().includes('drdo') || r.application.toLowerCase().includes('space') || r.application.toLowerCase().includes('isro') || r.application.toLowerCase().includes('military') || r.application.toLowerCase().includes('soldier')).sort((a, b) => b.investmentCr - a.investmentCr).map(r => (<div key={r.id} className="flex justify-between text-sm"><span>{r.materialGrade}</span><span className="font-medium">&#8377;{r.investmentCr}Cr</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">By Priority</CardTitle></CardHeader><CardContent><div className="space-y-2">{Object.entries(filtered.reduce((m, r) => { m[r.priority] = (m[r.priority] || 0) + 1; return m }, {} as Record<string, number>)).map(([p, c]) => (<div key={p} className="flex justify-between text-sm"><span className={priorityColors[p] || ''}>{p}</span><span className="font-medium">{c}</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">ZT Performance Range</CardTitle></CardHeader><CardContent><div className="space-y-2">{[{ l: 'High ZT (1.1+)', f: filtered.filter(r => r.ztValue >= 1.1).length }, { l: 'Mid ZT (0.95-1.1)', f: filtered.filter(r => r.ztValue >= 0.95 && r.ztValue < 1.1).length }, { l: 'Low ZT (0.85-0.95)', f: filtered.filter(r => r.ztValue >= 0.85 && r.ztValue < 0.95).length }, { l: 'Base (&lt;0.85)', f: filtered.filter(r => r.ztValue < 0.85).length }].map(b => (<div key={b.l} className="flex justify-between text-sm"><span>{b.l}</span><span className="font-medium">{b.f}</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Top Manufacturers</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { m[r.manufacturer] = (m[r.manufacturer] || 0) + r.investmentCr; return m }, {} as Record<string, number>)) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 7).map(([m, v]) => (<div key={m} className="flex justify-between text-sm"><span>{m}</span><span className="font-medium">&#8377;{v}Cr</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Avg Transit Days</CardTitle></CardHeader><CardContent><div className="space-y-2">{filtered.length ? (Object.entries(filtered.reduce((m, r) => { m[r.zone] = (m[r.zone] || [] as number[]).concat(r.transitDays); return m }, {} as Record<string, number[]>)) as [string, number[]][]).map(([z, d]) => (<div key={z} className="flex justify-between text-sm"><span>{z}</span><span className="font-medium">{(d.reduce((s, n) => s + n, 0) / d.length).toFixed(1)}d</span></div>)) : []}</div></CardContent></Card>
        </div>
      )}
      {(activeTab === 'Dashboard' || activeTab === 'Insights') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card><CardContent><div className="text-sm font-medium text-rose-600 mb-2">Tata Steel Bi2Te3 Waste Heat TEG</div><div className="text-xs text-muted-foreground">Tata Steel deploying 5MW Bi2Te2.7Se0.3 TEG arrays on blast furnace exhaust at Jamshedpur recovering 12MW thermal to 5MW electrical. ZT 1.0 at 450K enables 40% Carnot conversion. India targets 15GW industrial waste heat recovery by 2035 with Bi2Te3 as primary TE material.</div></CardContent></Card>
          <Card><CardContent><div className="text-sm font-medium text-rose-600 mb-2">DRDO Siachen Bi-Sb-Te Soldier Vest</div><div className="text-xs text-muted-foreground">DRDO fielding Bi0.5Sb1.7Te3 thermoelectric generator vests for Siachen soldiers at minus 40&#176;C. Body heat differential of 30K generates 10W powering radios and GPS. ZT 1.15 at 330K is world-class for p-type alloy. DRDO targeting 20,000 vests by 2028.</div></CardContent></Card>
          <Card><CardContent><div className="text-sm font-medium text-rose-600 mb-2">Voltas Commercial Peltier Precision Cooling</div><div className="text-xs text-muted-foreground">Voltas expanding Bi2Te3 n-type Peltier line for pharmaceutical cold storage and vaccine transport. Nanostructured Bi2Te3 from Gujarat Bi2Te3 Tech achieves ZT 1.2 reducing cooling power 30% vs conventional compressor systems. India pharma cold chain targeting &#8377;8,500Cr market.</div></CardContent></Card>
          <Card><CardContent><div className="text-sm font-medium text-rose-600 mb-2">ISRO Deep Space Bi2Te3 RTG</div><div className="text-xs text-muted-foreground">ISRO qualifying Bi2Te3 couple for radioisotope thermoelectric generators on Chandrayaan-4 and Mars orbiter missions. Bi2Te3 RTG provides maintenance-free 300W for 14-year deep space mission. IGCAR developing indigenous Bi2Te3 processing reducing NASA import dependency under &#8377;2,100Cr programme.</div></CardContent></Card>
        </div>
      )}
    </div>
  );
}
"""

outpath = "/home/z/my-project/src/components/modules/bismuth-telluride-logistics-view.tsx"
with open(outpath, "w") as f:
    f.write(content)
print(f"Generated {outpath}")
