r"""Generate Platinum Powder Logistics View module (R407b)"""
import os

COMPONENT = r"""'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared';
import { Target } from 'lucide-react';

interface PlatinumPowderRecord {
  id: string;
  batchNo: string;
  city: string;
  manufacturer: string;
  powderGrade: string;
  application: string;
  platinumPercent: number;
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

const platinumPowderRecords: PlatinumPowderRecord[] = [
  { id: 'PTP-0001', batchNo: 'PTP-B2401', city: 'Mumbai', manufacturer: 'Hindustan Platinum', powderGrade: 'Pt-Ru 90/10 Catalyst', application: 'Fuel Cell MEA (Reliance)', platinumPercent: 90.0, particleSizeUm: 5, investmentCr: 680, status: 'Delivered', priority: 'Critical', origin: 'Hindustan Platinum Mumbai (MH)', destination: 'Reliance Jamnagar (GJ)', shipDate: '2026-07-15', transitDays: 1, zone: 'West', remarks: 'Pt-Ru alloy catalyst for Reliance PEM fuel cell membrane electrode assembly &#8594; 90% Pt with 10% Ru &#8594; &#8377;680Cr for 0.5 tonnes &#8594; India &#8377;20,400Cr fuel cell Pt &#8594; Reliance 5 GW hydrogen &#8594; 5 um PSD &#8594; 0.15 mg/cm2 &#8594; MEA' },
  { id: 'PTP-0002', batchNo: 'PTP-B2402', city: 'Bengaluru', manufacturer: 'DRDO NMRL', powderGrade: 'Pt-Ir 80/20 Spark', application: 'Marine Engine Spark Plug (MDL)', platinumPercent: 80.0, particleSizeUm: 15, investmentCr: 420, status: 'Delivered', priority: 'Critical', origin: 'DRDO NMRL Visakhapatnam (AP)', destination: 'MDL Mumbai (MH)', shipDate: '2026-07-16', transitDays: 2, zone: 'South', remarks: 'Pt-Ir electrode tip for MDL Scorpene submarine diesel engine spark plug &#8594; 80% Pt with 20% Ir &#8594; &#8377;420Cr for 0.3 tonnes &#8594; India &#8377;12,600Cr marine Pt &#8594; MDL 6 submarines &#8594; 15 um PSD &#8594; 1000&#176;C service &#8594; anti-corrosion' },
  { id: 'PTP-0003', batchNo: 'PTP-B2403', city: 'Hyderabad', manufacturer: 'IGCAR', powderGrade: 'Pt gauze 99.9% Ammonia', application: 'Green Ammonia Catalyst (Gujarat Alkali)', platinumPercent: 99.9, particleSizeUm: 50, investmentCr: 890, status: 'Delivered', priority: 'Critical', origin: 'IGCAR Kalpakkam (TN)', destination: 'Gujarat Alkali Baroda (GJ)', shipDate: '2026-07-17', transitDays: 2, zone: 'South', remarks: 'Pt-Rh gauze catalyst for Gujarat Alkali green ammonia Ostwald process &#8594; 99.9% Pt &#8594; &#8377;890Cr for 0.8 tonnes &#8594; India &#8377;26,700Cr chemical Pt &#8594; Gujarat Alkali 1 MT ammonia &#8594; 50 um knitted gauze &#8594; 950&#176;C &#8594; NH3 oxidation' },
  { id: 'PTP-0004', batchNo: 'PTP-B2404', city: 'Chennai', manufacturer: 'MIDHANI', powderGrade: 'Pt-Co 70/30 MRI', application: 'MRI Gradient Coil (HLL)', platinumPercent: 70.0, particleSizeUm: 8, investmentCr: 550, status: 'Delivered', priority: 'High', origin: 'MIDHANI Hyderabad (TG)', destination: 'HLL Hyderabad (TG)', shipDate: '2026-07-18', transitDays: 1, zone: 'South', remarks: 'Pt-Co nano-alloy for HLL 3T MRI gradient coil electromagnetic shielding &#8594; 70% Pt with 30% Co &#8594; &#8377;550Cr for 0.4 tonnes &#8594; India &#8377;16,500Cr medical Pt &#8594; HLL 5000 MRI &#8594; 8 um PSD &#8594; high permeability &#8594; 3 Tesla' },
  { id: 'PTP-0005', batchNo: 'PTP-B2405', city: 'Pune', manufacturer: 'Bharat Forge', powderGrade: 'Pt-Ni 95/5 Thermocouple', application: 'Gas Turbine Sensor (BHEL)', platinumPercent: 95.0, particleSizeUm: 200, investmentCr: 310, status: 'Delivered', priority: 'High', origin: 'Bharat Forge Pune (MH)', destination: 'BHEL Hyderabad (TG)', shipDate: '2026-07-19', transitDays: 2, zone: 'West', remarks: 'Pt-Ni wire for BHEL 800 MW gas turbine exhaust thermocouple &#8594; 95% Pt with 5% Ni &#8594; &#8377;310Cr for 0.1 tonnes &#8594; India &#8377;9,300Cr power Pt &#8594; BHEL 42 turbines &#8594; 200 um wire &#8594; 1600&#176;C range &#8594; Type S' },
  { id: 'PTP-0006', batchNo: 'PTP-B2406', city: 'Ahmedabad', manufacturer: 'Gujarat Platinum Tech', powderGrade: 'Pt 99.95% Spherical AM', application: 'Nozzle Thruster (ISRO)', platinumPercent: 99.95, particleSizeUm: 25, investmentCr: 720, status: 'Delivered', priority: 'Critical', origin: 'Gujarat Platinum Tech Ahmedabad (GJ)', destination: 'ISRO Sriharikota (AP)', shipDate: '2026-07-20', transitDays: 2, zone: 'West', remarks: 'Spherical Pt powder for ISRO satellite thruster nozzle LPBF AM &#8594; 99.95% Pt &#8594; &#8377;720Cr for 0.2 tonnes &#8594; India &#8377;21,600Cr space Pt &#8594; ISRO 12 sats &#8594; 25 um PSD &#8594; 1768&#176;C melt &#8594; LPBF+HIP' },
  { id: 'PTP-0007', batchNo: 'PTP-B2407', city: 'Jaipur', manufacturer: 'Rajasthan Platinum Refinery', powderGrade: 'Pt-Sn 65/35 Ohmic', application: 'LED Die Bond (Dixon LED)', platinumPercent: 65.0, particleSizeUm: 10, investmentCr: 285, status: 'Delivered', priority: 'Medium', origin: 'Rajasthan Platinum Refinery Jaipur (RJ)', destination: 'Dixon Noida (UP)', shipDate: '2026-07-21', transitDays: 2, zone: 'North', remarks: 'Pt-Sn solder for Dixon LED die attach high-brightness GaN chip &#8594; 65% Pt with 35% Sn &#8594; &#8377;285Cr for 0.8 tonnes &#8594; India &#8377;8,550Cr LED Pt &#8594; Dixon 500M LEDs &#8594; 10 um PSD &#8594; 280&#176;C reflow &#8594; eutectic' },
  { id: 'PTP-0008', batchNo: 'PTP-B2408', city: 'Coimbatore', manufacturer: 'Tamil Nadu Platinum Corp', powderGrade: 'Pt-W 95/5 Contact', application: 'High-Voltage Relay (BHEL)', platinumPercent: 95.0, particleSizeUm: 30, investmentCr: 195, status: 'Delivered', priority: 'Medium', origin: 'Tamil Nadu Platinum Corp Hosur (TN)', destination: 'BHEL Bhopal (MP)', shipDate: '2026-07-22', transitDays: 2, zone: 'South', remarks: 'Pt-W composite for BHEL 765 kV GIS switchgear relay contact &#8594; 95% Pt with 5% W &#8594; &#8377;195Cr for 0.2 tonnes &#8594; India &#8377;5,850Cr power Pt &#8594; BHEL 150 GW &#8594; 30 um PSD &#8594; arc erosion &#8594; 100K cycles' },
  { id: 'PTP-0009', batchNo: 'PTP-B2409', city: 'Bhubaneswar', manufacturer: 'NALCO', powderGrade: 'Pt-Pd 50/50 Petrochem', application: 'Reforming Catalyst (BPCL)', platinumPercent: 50.0, particleSizeUm: 3, investmentCr: 640, status: 'Delivered', priority: 'High', origin: 'NALCO Bhubaneswar (OD)', destination: 'BPCL Mumbai (MH)', shipDate: '2026-07-23', transitDays: 3, zone: 'East', remarks: 'Pt-Pd bimetallic for BPCL catalytic reformer gasoline upgrade &#8594; 50% Pt with 50% Pd &#8594; &#8377;640Cr for 1.5 tonnes &#8594; India &#8377;19,200Cr petro Pt &#8594; BPCL 35 MT refinery &#8594; 3 um nano &#8594; alumina support &#8594; 95 octane' },
  { id: 'PTP-0010', batchNo: 'PTP-B2410', city: 'Guwahati', manufacturer: 'Assam Platinum Metals', powderGrade: 'Pt 99.99% Ultra-Pure', application: 'Electrolyzer Anode (IOCL)', platinumPercent: 99.99, particleSizeUm: 50, investmentCr: 590, status: 'Delivered', priority: 'High', origin: 'Assam Platinum Metals Guwahati (AS)', destination: 'IOCL Panipat (HR)', shipDate: '2026-07-24', transitDays: 4, zone: 'East', remarks: 'Ultra-pure Pt anode for IOCL PEM electrolyzer green hydrogen production &#8594; 99.99% Pt &#8594; &#8377;590Cr for 0.4 tonnes &#8594; India &#8377;17,700Cr hydrogen Pt &#8594; IOCL 10 GW electrolyzer &#8594; 50 um foil &#8594; 2V cell &#8594; 80% eff' },
  { id: 'PTP-0011', batchNo: 'PTP-B2411', city: 'Surat', manufacturer: 'Gujarat Platinum Products', powderGrade: 'Pt-Au 90/10 Dental', application: 'Dental Crown Alloy (Sun Pharma)', platinumPercent: 90.0, particleSizeUm: 20, investmentCr: 175, status: 'Delivered', priority: 'Medium', origin: 'Gujarat Platinum Products Surat (GJ)', destination: 'Sun Pharma Ahmedabad (GJ)', shipDate: '2026-07-25', transitDays: 1, zone: 'West', remarks: 'Pt-Au dental porcelain-fused-to-metal crown alloy &#8594; 90% Pt with 10% Au &#8594; &#8377;175Cr for 0.3 tonnes &#8594; India &#8377;5,250Cr dental Pt &#8594; Sun Pharma 2M units &#8594; 20 um PSD &#8594; biocompatible &#8594; CADCAM' },
  { id: 'PTP-0012', batchNo: 'PTP-B2412', city: 'Lucknow', manufacturer: 'UP Platinum Industries', powderGrade: 'Pt-Rh 85/15 Thermocouple', application: 'Blast Furnace Probe (Tata Steel)', platinumPercent: 85.0, particleSizeUm: 150, investmentCr: 445, status: 'Delayed', priority: 'High', origin: 'UP Platinum Industries Lucknow (UP)', destination: 'Tata Steel Jamshedpur (JH)', shipDate: '2026-07-02', transitDays: 25, zone: 'North', remarks: 'Pt-Rh Type B thermocouple for Tata Steel blast furnace temperature profiling &#8594; 85% Pt with 15% Rh &#8594; &#8377;445Cr for 0.05 tonnes &#8594; monsoon delay &#8594; India &#8377;13,350Cr steel Pt &#8594; Tata 35 MT steel &#8594; 150 um wire &#8594; 1800&#176;C &#8594; Type B' },
  { id: 'PTP-0013', batchNo: 'PTP-B2413', city: 'Noida', manufacturer: 'SAIL', powderGrade: 'Pt-Co 50/50 Hardmag', application: 'Hard Disk Plating (Dixon Tech)', platinumPercent: 50.0, particleSizeUm: 12, investmentCr: 210, status: 'Delivered', priority: 'Medium', origin: 'SAIL Rourkela (OD)', destination: 'Dixon Tech Noida (UP)', shipDate: '2026-07-26', transitDays: 1, zone: 'North', remarks: 'Pt-Co magnetic alloy sputter target for Dixon hard disk drive plating &#8594; 50% Pt with 50% Co &#8594; &#8377;210Cr for 0.6 tonnes &#8594; India &#8377;6,300Cr storage Pt &#8594; Dixon 10M HDD &#8594; 12 um PSD &#8594; high Ku &#8594; sputter' },
  { id: 'PTP-0014', batchNo: 'PTP-B2414', city: 'Bhopal', manufacturer: 'DRDO DMRL', powderGrade: 'Pt-Al 75/25 Turbine', application: 'Aero Turbine Blade (HAL)', platinumPercent: 75.0, particleSizeUm: 35, investmentCr: 780, status: 'Delivered', priority: 'Critical', origin: 'DRDO DMRL Hyderabad (TG)', destination: 'HAL Bengaluru (KA)', shipDate: '2026-07-27', transitDays: 1, zone: 'South', remarks: 'Pt-Al bond coat for HAL Tejas Mk2 turbine blade thermal barrier &#8594; 75% Pt with 25% Al &#8594; &#8377;780Cr for 0.3 tonnes &#8594; India &#8377;23,400Cr aero Pt &#8594; HAL 123 Tejas &#8594; 35 um powder &#8594; 1100&#176;C &#8594; EB-PVD' }
];

const tabs = ['Dashboard', 'Registry', 'Analytics', 'Insights'] as const;
type Tab = typeof tabs[number];
const priorityColors: Record<string, string> = { Critical: 'bg-red-100 text-red-800', High: 'bg-amber-100 text-amber-800', Medium: 'bg-green-100 text-green-800', Low: 'bg-slate-100 text-slate-600' };
const delayedSet = new Set(platinumPowderRecords.filter(r => r.status === 'Delayed').map(r => r.id));

export default function PlatinumPowderLogisticsView() {
  const [activeTab, setActiveTab] = useState<Tab>('Dashboard');
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const toggleFilter = (k: string, v: string) => { setFilters(p => { const s = { ...p }; const a = s[k] || []; const i = a.indexOf(v); if (i > -1) { a.splice(i, 1); if (!a.length) delete s[k]; } else s[k] = [...a, v]; return s; }); };
  const filtered = useMemo(() => {
    let d = platinumPowderRecords;
    if (search) { const q = search.toLowerCase(); d = d.filter(r => r.id.toLowerCase().includes(q) || r.batchNo.toLowerCase().includes(q) || r.powderGrade.toLowerCase().includes(q) || r.application.toLowerCase().includes(q) || r.city.toLowerCase().includes(q) || r.manufacturer.toLowerCase().includes(q)); }
    Object.entries(filters).forEach(([k, vs]) => { if (vs.length) d = d.filter(r => { const v = String((r as unknown as Record<string, unknown>)[k] ?? ''); return vs.some(x => v.toLowerCase().includes(x.toLowerCase())); }); });
    return d;
  }, [search, filters]);
  const totalCr = filtered.reduce((s: number, r) => s + r.investmentCr, 0);
  const avgPt = filtered.length ? filtered.reduce((s: number, r) => s + r.platinumPercent, 0) / filtered.length : 0;
  const delayedCount = filtered.filter(r => r.status === 'Delayed').length;

  return (
    <div className="space-y-6">
      <PageHeader title="Platinum Powder Logistics" description="Indian platinum powder supply chain tracking for fuel cells, aerospace turbine, medical MRI, petrochemical reforming and green hydrogen sectors" />
      <div className="flex gap-2 border-b">
        {tabs.map(t => (<button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-2 text-sm font-medium ${activeTab === t ? 'border-b-2 border-fuchsia-500 text-fuchsia-700' : 'text-muted-foreground hover:text-foreground'}`}>{t}</button>))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent><div className="text-2xl font-bold text-fuchsia-600">{filtered.length}</div><div className="text-xs text-muted-foreground">Total Shipments</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-fuchsia-600">&#8377;{totalCr.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground">Total Investment</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-fuchsia-600">{avgPt.toFixed(1)}%</div><div className="text-xs text-muted-foreground">Avg Pt Content</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-red-500">{delayedCount}</div><div className="text-xs text-muted-foreground">Delayed Shipments</div></CardContent></Card>
      </div>
      {(activeTab === 'Dashboard' || activeTab === 'Registry') && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <input placeholder="Search ID, grade, application, city..." value={search} onChange={e => setSearch(e.target.value)} className="border rounded-md px-3 py-1.5 text-sm flex-1 min-w-48" />
            {['status', 'priority', 'zone'].map(f => { const opts = [...new Set(platinumPowderRecords.map(r => (r as unknown as Record<string, unknown>)[f] as string))]; return (<div key={f} className="flex flex-wrap gap-1">{opts.map(o => (<Badge key={o} variant={(filters[f] || []).includes(o) ? 'default' : 'outline'} className="cursor-pointer text-xs" onClick={() => toggleFilter(f, o)}>{o}</Badge>))}</div>); })}
          </div>
          <div className="rounded-md border"><div className="max-h-96 overflow-auto"><table className="w-full text-sm"><thead className="sticky top-0 bg-background"><tr><th className="p-2 text-left">ID</th><th className="p-2 text-left">Batch</th><th className="p-2 text-left">Grade</th><th className="p-2 text-left">Application</th><th className="p-2 text-right">Pt%</th><th className="p-2 text-right">&#8377;Cr</th><th className="p-2 text-left">Status</th></tr></thead><tbody>{filtered.map(r => (<tr key={r.id} className={`border-t ${delayedSet.has(r.id) ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}><td className="p-2">{r.id}</td><td className="p-2">{r.batchNo}</td><td className="p-2">{r.powderGrade}</td><td className="p-2">{r.application}</td><td className="p-2 text-right">{r.platinumPercent}</td><td className="p-2 text-right">{r.investmentCr}</td><td className="p-2"><Badge variant={r.status === 'Delivered' ? 'default' : 'destructive'}>{r.status}</Badge></td></tr>))}</tbody></table></div></div>
        </div>
      )}
      {(activeTab === 'Dashboard' || activeTab === 'Analytics') && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">Investment by Application</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { m[r.application] = (m[r.application] || 0) + r.investmentCr; return m }, {} as Record<string, number>)) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 7).map(([a, v]) => (<div key={a} className="flex justify-between text-sm"><span>{a}</span><span className="font-medium">&#8377;{v}Cr</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Shipments by Zone</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { m[r.zone] = (m[r.zone] || 0) + 1; return m }, {} as Record<string, number>)) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([z, c]) => (<div key={z} className="flex justify-between text-sm"><span>{z}</span><span className="font-medium">{c}</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Top Routes by Value</CardTitle></CardHeader><CardContent><div className="space-y-2">{filtered.sort((a, b) => b.investmentCr - a.investmentCr).slice(0, 7).map(r => (<div key={r.id} className="flex justify-between text-sm"><span>{r.origin.split('(')[0]} &#8594; {r.destination.split('(')[0]}</span><span className="font-medium">&#8377;{r.investmentCr}Cr</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Aerospace and Defence</CardTitle></CardHeader><CardContent><div className="space-y-2">{filtered.filter(r => r.application.toLowerCase().includes('aero') || r.application.toLowerCase().includes('marine') || r.application.toLowerCase().includes('missile') || r.application.toLowerCase().includes('space') || r.application.toLowerCase().includes('defence')).sort((a, b) => b.investmentCr - a.investmentCr).map(r => (<div key={r.id} className="flex justify-between text-sm"><span>{r.powderGrade} ({r.particleSizeUm}um)</span><span className="font-medium">&#8377;{r.investmentCr}Cr</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">By Priority</CardTitle></CardHeader><CardContent><div className="space-y-2">{Object.entries(filtered.reduce((m, r) => { m[r.priority] = (m[r.priority] || 0) + 1; return m }, {} as Record<string, number>)).map(([p, c]) => (<div key={p} className="flex justify-between text-sm"><span className={priorityColors[p] || ''}>{p}</span><span className="font-medium">{c}</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Pt Content Distribution</CardTitle></CardHeader><CardContent><div className="space-y-2">{[{ l: 'Ultra-High (99%+)', f: filtered.filter(r => r.platinumPercent >= 99).length }, { l: 'High (80-99%)', f: filtered.filter(r => r.platinumPercent >= 80 && r.platinumPercent < 99).length }, { l: 'Medium (50-80%)', f: filtered.filter(r => r.platinumPercent >= 50 && r.platinumPercent < 80).length }, { l: 'Alloy (<50%)', f: filtered.filter(r => r.platinumPercent < 50).length }].map(b => (<div key={b.l} className="flex justify-between text-sm"><span>{b.l}</span><span className="font-medium">{b.f}</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Top Manufacturers</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { m[r.manufacturer] = (m[r.manufacturer] || 0) + r.investmentCr; return m }, {} as Record<string, number>)) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 7).map(([m, v]) => (<div key={m} className="flex justify-between text-sm"><span>{m}</span><span className="font-medium">&#8377;{v}Cr</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Avg Transit Days</CardTitle></CardHeader><CardContent><div className="space-y-2">{filtered.length ? (Object.entries(filtered.reduce((m, r) => { m[r.zone] = (m[r.zone] || [] as number[]).concat(r.transitDays); return m }, {} as Record<string, number[]>)) as [string, number[]][]).map(([z, d]) => (<div key={z} className="flex justify-between text-sm"><span>{z}</span><span className="font-medium">{(d.reduce((s, n) => s + n, 0) / d.length).toFixed(1)}d</span></div>)) : []}</div></CardContent></Card>
        </div>
      )}
      {(activeTab === 'Dashboard' || activeTab === 'Insights') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card><CardContent><div className="text-sm font-medium text-fuchsia-600 mb-2">Reliance PEM Fuel Cell Pt Scaling</div><div className="text-xs text-muted-foreground">Reliance Industries scaling Pt-Ru MEA catalyst production at Jamnagar for 5 GW green hydrogen PEM electrolyzer fleet. India consuming 12 tonnes of Pt annually for fuel cell with 95% imported from South Africa. Hindustan Platinum expanding refinery capacity to 5 TPA under &#8377;3,200Cr PLI scheme targeting 30% import reduction by 2028.</div></CardContent></Card>
          <Card><CardContent><div className="text-sm font-medium text-fuchsia-600 mb-2">ISRO Satellite Pt Thruster AM</div><div className="text-xs text-muted-foreground">ISRO using LPBF 3D-printed Pt satellite thruster nozzles for next-gen NavIC and Gagan augmentation satellites. Gujarat Platinum Tech supplying gas-atomized spherical Pt powder. 60% weight reduction vs machined Pt with equivalent thermal performance at 1768&#176;C service. India targeting 50 satellite launches by 2030.</div></CardContent></Card>
          <Card><CardContent><div className="text-sm font-medium text-fuchsia-600 mb-2">HAL Tejas Mk2 Turbine Pt-Al Coating</div><div className="text-xs text-muted-foreground">HAL adopting Pt-Al bond coat for Tejas Mk2 GTRE GTX-35VS Kaveri engine HPT blade replacing conventional NiAl coating. 30% improvement in coating life at 1100&#176;C. DRDO DMRL developing Pt-Al EB-PVD process at Hyderabad with Gujarat Platinum powder feedstock. India allocating &#8377;15,000Cr for aero engine coating R&amp;D.</div></CardContent></Card>
          <Card><CardContent><div className="text-sm font-medium text-fuchsia-600 mb-2">IOCL Green Hydrogen Pt Electrolyzer</div><div className="text-xs text-muted-foreground">Indian Oil commissioning 10 GW PEM electrolyzer at Panipat refinery using ultra-pure 99.99% Pt anode catalyst. Each GW requires 1.2 tonnes Pt loading at 0.5 mg/cm2. IOCL targeting &#8377;4,000Cr green hydrogen revenue by 2030. Assam Platinum Metals developing recycling route from spent automotive catalytic converter for circular Pt supply.</div></CardContent></Card>
        </div>
      )}
    </div>
  );
}
"""

outpath = "/home/z/my-project/src/components/modules/platinum-powder-logistics-view.tsx"
with open(outpath, "w") as f:
    f.write(COMPONENT)
print(f"Written {outpath} ({len(COMPONENT)} bytes)")
