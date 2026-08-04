r"""Generate Germanium Metal Logistics View module (R408a)"""
COMPONENT = r"""'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared';
import { Microscope } from 'lucide-react';

interface GermaniumMetalRecord {
  id: string;
  batchNo: string;
  city: string;
  manufacturer: string;
  metalGrade: string;
  application: string;
  germaniumPercent: number;
  resistivityOhmCm: number;
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

const germaniumMetalRecords: GermaniumMetalRecord[] = [
  { id: 'GEM-0001', batchNo: 'GEM-B2401', city: 'Bengaluru', manufacturer: 'Hindustan Semiconductor', metalGrade: 'Ge 99.9999% CZ Ingot', application: 'IR Lens Element (BEL)', germaniumPercent: 99.9999, resistivityOhmCm: 50, investmentCr: 620, status: 'Delivered', priority: 'Critical', origin: 'Hindustan Semiconductor Bengaluru (KA)', destination: 'BEL Bengaluru (KA)', shipDate: '2026-07-15', transitDays: 1, zone: 'South', remarks: 'Six-nines Ge Czochralski ingot for BEL thermal imaging IR lens &#8594; 99.9999% Ge &#8594; &#8377;620Cr for 2 tonnes &#8594; India &#8377;18,600Cr defence Ge &#8594; BEL 200 IR lenses &#8594; 50 ohm-cm &#8594; 8-14 um window &#8594; Cz grown' },
  { id: 'GEM-0002', batchNo: 'GEM-B2402', city: 'Hyderabad', manufacturer: 'DRDO DMRL', metalGrade: 'Ge-38Si Optical Glass', application: 'Night Vision Objective (DRDO)', germaniumPercent: 38.0, resistivityOhmCm: 0, investmentCr: 480, status: 'Delivered', priority: 'Critical', origin: 'DRDO DMRL Hyderabad (TG)', destination: 'DRDO Dehradun (UK)', shipDate: '2026-07-16', transitDays: 2, zone: 'South', remarks: 'Ge-Si glass for DRDO soldier night vision objective assembly &#8594; 38% Ge with 62% Si &#8594; &#8377;480Cr for 5 tonnes &#8594; India &#8377;14,400Cr defence Ge &#8594; DRDO 50K NVG &#8594; optical grade &#8594; 2-5 um band &#8594; cast disc' },
  { id: 'GEM-0003', batchNo: 'GEM-B2403', city: 'Pune', manufacturer: 'Bharat Forge', metalGrade: 'Ge 99.999% Poly Ingot', application: 'Space Solar Cell (ISRO)', germaniumPercent: 99.999, resistivityOhmCm: 0.1, investmentCr: 710, status: 'Delivered', priority: 'Critical', origin: 'Bharat Forge Pune (MH)', destination: 'ISRO Ahmedabad (GJ)', shipDate: '2026-07-17', transitDays: 2, zone: 'West', remarks: 'Five-nines Ge substrate for ISRO triple-junction GaAs solar cell &#8594; 99.999% Ge &#8594; &#8377;710Cr for 0.5 tonnes &#8594; India &#8377;21,300Cr space Ge &#8594; ISRO 12 sats &#8594; 0.1 ohm-cm n-type &#8594; 100mm wafer &#8594; 33% eff' },
  { id: 'GEM-0004', batchNo: 'GEM-B2404', city: 'Mumbai', manufacturer: 'Tata Advanced Materials', metalGrade: 'GeO2 99.99% Optical', application: 'Fiber Optic Preform (Sterlite)', germaniumPercent: 66.6, resistivityOhmCm: 0, investmentCr: 390, status: 'Delivered', priority: 'High', origin: 'TAM Bengaluru (KA)', destination: 'Sterlite Aurangabad (MH)', shipDate: '2026-07-18', transitDays: 1, zone: 'West', remarks: 'Germanium dioxide for Sterlite single-mode fiber optic preform core doping &#8594; 99.99% GeO2 &#8594; &#8377;390Cr for 8 tonnes &#8594; India &#8377;11,700Cr telecom Ge &#8594; Sterlite 50M km fiber &#8594; refractive index control &#8594; MCVD process &#8594; preform' },
  { id: 'GEM-0005', batchNo: 'GEM-B2405', city: 'Chennai', manufacturer: 'IGCAR', metalGrade: 'Ge-Li Drift Crystal', application: 'Nuclear Radiation Detector (NPCIL)', germaniumPercent: 99.9999, resistivityOhmCm: 100, investmentCr: 550, status: 'Delivered', priority: 'Critical', origin: 'IGCAR Kalpakkam (TN)', destination: 'NPCIL Tarapur (MH)', shipDate: '2026-07-19', transitDays: 2, zone: 'South', remarks: 'HPGe detector crystal for NPCIL PHWR reactor coolant gamma monitoring &#8594; 99.9999% Ge &#8594; &#8377;550Cr for 0.1 tonnes &#8594; India &#8377;16,500Cr nuclear Ge &#8584; NPCIL 22 reactors &#8594; 100 ohm-cm &#8594; LN2 cooled &#8594; HPGe' },
  { id: 'GEM-0006', batchNo: 'GEM-B2406', city: 'Ahmedabad', manufacturer: 'Gujarat Germanium Tech', metalGrade: 'Ge 99.999% Sputter Target', application: 'Phase-Change Memory (SCL)', germaniumPercent: 99.999, resistivityOhmCm: 0.05, investmentCr: 430, status: 'Delivered', priority: 'High', origin: 'Gujarat Germanium Tech Ahmedabad (GJ)', destination: 'SCL Mohali (PB)', shipDate: '2026-07-20', transitDays: 1, zone: 'West', remarks: 'GeTe sputter target for SCL phase-change memory fab 28nm &#8594; 99.999% Ge &#8594; &#8377;430Cr for 1 tonne &#8594; India &#8377;12,900Cr semi Ge &#8594; SCL 5000 wafer starts &#8594; 0.05 ohm-cm &#8594; Ge2Sb2Te5 &#8594; PCM' },
  { id: 'GEM-0007', batchNo: 'GEM-B2407', city: 'Jaipur', manufacturer: 'Rajasthan Germanium Metals', metalGrade: 'Ge-As 50/50 Thermoelectric', application: 'Waste Heat Generator (Tata Steel)', germaniumPercent: 50.0, resistivityOhmCm: 2, investmentCr: 285, status: 'Delivered', priority: 'Medium', origin: 'Rajasthan Germanium Metals Jaipur (RJ)', destination: 'Tata Steel Jamshedpur (JH)', shipDate: '2026-07-21', transitDays: 3, zone: 'North', remarks: 'Ge-As thermoelectric module for Tata Steel blast furnace waste heat recovery &#8594; 50% Ge with 50% As &#8594; &#8377;285Cr for 2 tonnes &#8594; India &#8377;8,550Cr steel Ge &#8594; Tata 35 MT steel &#8594; 2 ohm-cm &#8594; 500&#176;C service &#8594; 6% ZT' },
  { id: 'GEM-0008', batchNo: 'GEM-B2408', city: 'Coimbatore', manufacturer: 'Tamil Nadu Germanium Corp', metalGrade: 'Ge-25Ga As Switch', application: '5G RF Switch (Jio)', germaniumPercent: 25.0, resistivityOhmCm: 0.01, investmentCr: 340, status: 'Delivered', priority: 'High', origin: 'Tamil Nadu Germanium Corp Hosur (TN)', destination: 'Jio Mumbai (MH)', shipDate: '2026-07-22', transitDays: 2, zone: 'South', remarks: 'Ge-on-Si RF switch for Jio 5G base station mmWave transceiver &#8594; 25% Ge with 75% Si &#8594; &#8377;340Cr for 0.8 tonnes &#8594; India &#8377;10,200Cr telecom Ge &#8594; Jio 500K sites &#8594; 0.01 ohm-cm &#8594; 28 GHz &#8594; BiCMOS' },
  { id: 'GEM-0009', batchNo: 'GEM-B2409', city: 'Bhubaneswar', manufacturer: 'NALCO', metalGrade: 'GeO2 99.9% Polyurethane', application: 'Catalyst Silica Gel (HPCL)', germaniumPercent: 66.6, resistivityOhmCm: 0, investmentCr: 195, status: 'Delivered', priority: 'Medium', origin: 'NALCO Bhubaneswar (OD)', destination: 'HPCL Visakhapatnam (AP)', shipDate: '2026-07-23', transitDays: 2, zone: 'East', remarks: 'GeO2 catalyst for HPCL polyethylene terephthalate resin polymerization &#8594; 99.9% GeO2 &#8594; &#8377;195Cr for 6 tonnes &#8594; India &#8377;5,850Cr petro Ge &#8594; HPCL 10 MT refinery &#8594; catalyst grade &#8594; PET resin &#8594; polymer' },
  { id: 'GEM-0010', batchNo: 'GEM-B2410', city: 'Guwahati', manufacturer: 'Assam Germanium Metals', metalGrade: 'Ge 99.9999% Zone-Refined', application: 'Gamma Spectroscopy (BARC)', germaniumPercent: 99.9999, resistivityOhmCm: 200, investmentCr: 580, status: 'Delivered', priority: 'High', origin: 'Assam Germanium Metals Guwahati (AS)', destination: 'BARC Mumbai (MH)', shipDate: '2026-07-24', transitDays: 4, zone: 'East', remarks: 'Ultra-pure zone-refined Ge for BARC environmental radiation gamma spectroscopy &#8594; 99.9999% Ge &#8594; &#8377;580Cr for 0.05 tonnes &#8594; India &#8377;17,400Cr nuclear Ge &#8594; BARC 200 detectors &#8594; 200 ohm-cm p-type &#8594; LN2 cooled &#8594; 2 keV FWHM' },
  { id: 'GEM-0011', batchNo: 'GEM-B2411', city: 'Surat', manufacturer: 'Gujarat Germanium Products', metalGrade: 'Ge-14Si Epi Layer', application: 'SiGe HBT Amplifier (Wipro Aero)', germaniumPercent: 14.0, resistivityOhmCm: 0.005, investmentCr: 410, status: 'Delivered', priority: 'High', origin: 'Gujarat Germanium Products Surat (GJ)', destination: 'Wipro Aero Bengaluru (KA)', shipDate: '2026-07-25', transitDays: 2, zone: 'West', remarks: 'SiGe epitaxial layer for Wipro Aerospace Ka-band LNA amplifier chip &#8594; 14% Ge with 86% Si &#8594; &#8377;410Cr for 0.2 tonnes &#8594; India &#8377;12,300Cr aero Ge &#8594; Wipro 500 modules &#8594; 0.005 ohm-cm &#8594; 26.5 GHz fT &#8594; SiGe BiCMOS' },
  { id: 'GEM-0012', batchNo: 'GEM-B2412', city: 'Lucknow', manufacturer: 'UP Germanium Industries', metalGrade: 'Ge-15Sn Eutectic Solder', application: 'X-Ray Tube Window (HLL)', germaniumPercent: 15.0, resistivityOhmCm: 0, investmentCr: 315, status: 'Delayed', priority: 'High', origin: 'UP Germanium Industries Lucknow (UP)', destination: 'HLL Hyderabad (TG)', shipDate: '2026-07-02', transitDays: 24, zone: 'North', remarks: 'Ge-Sn eutectic for HLL medical CT scanner X-ray tube vacuum window &#8594; 15% Ge with 85% Sn &#8594; &#8377;315Cr for 1 tonne &#8594; monsoon delay &#8594; India &#8377;9,450Cr medical Ge &#8594; HLL 3000 CT &#8594; eutectic &#8594; X-ray transparent &#8594; vacuum seal' },
  { id: 'GEM-0013', batchNo: 'GEM-B2413', city: 'Noida', manufacturer: 'SAIL', metalGrade: 'Ge-80Si IR Dome', application: 'Missile Seeker Dome (DRDO)', germaniumPercent: 80.0, resistivityOhmCm: 0, investmentCr: 520, status: 'Delivered', priority: 'Critical', origin: 'SAIL Rourkela (OD)', destination: 'DRDO Hyderabad (TG)', shipDate: '2026-07-26', transitDays: 2, zone: 'North', remarks: 'Ge-80% Si IR transparent dome for DRDO Astra Mk2 missile seeker &#8594; 80% Ge with 20% Si &#8594; &#8377;520Cr for 0.5 tonnes &#8594; India &#8377;15,600Cr defence Ge &#8594; DRDO 500 Astra &#8594; 3-5 um band &#8594; CVD grown &#8594; dome' },
  { id: 'GEM-0014', batchNo: 'GEM-B2414', city: 'Bhopal', manufacturer: 'BHEL', metalGrade: 'Ge-50Sn Photodetector', application: 'Fiber Optic Receiver (RailTel)', germaniumPercent: 50.0, resistivityOhmCm: 0.02, investmentCr: 240, status: 'Delivered', priority: 'Medium', origin: 'BHEL Bhopal (MP)', destination: 'RailTel New Delhi (DL)', shipDate: '2026-07-27', transitDays: 1, zone: 'North', remarks: 'Ge photodetector for RailTel 100G optical fiber communication receiver &#8594; 50% Ge with 50% Si &#8594; &#8377;240Cr for 0.3 tonnes &#8594; India &#8377;7,200Cr telecom Ge &#8594; RailTel 60K route km &#8594; 0.02 ohm-cm &#8594; 1.55 um &#8594; APD' }
];

const tabs = ['Dashboard', 'Registry', 'Analytics', 'Insights'] as const;
type Tab = typeof tabs[number];
const priorityColors: Record<string, string> = { Critical: 'bg-red-100 text-red-800', High: 'bg-amber-100 text-amber-800', Medium: 'bg-green-100 text-green-800', Low: 'bg-slate-100 text-slate-600' };
const delayedSet = new Set(germaniumMetalRecords.filter(r => r.status === 'Delayed').map(r => r.id));

export default function GermaniumMetalLogisticsView() {
  const [activeTab, setActiveTab] = useState<Tab>('Dashboard');
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const toggleFilter = (k: string, v: string) => { setFilters(p => { const s = { ...p }; const a = s[k] || []; const i = a.indexOf(v); if (i > -1) { a.splice(i, 1); if (!a.length) delete s[k]; } else s[k] = [...a, v]; return s; }); };
  const filtered = useMemo(() => {
    let d = germaniumMetalRecords;
    if (search) { const q = search.toLowerCase(); d = d.filter(r => r.id.toLowerCase().includes(q) || r.batchNo.toLowerCase().includes(q) || r.metalGrade.toLowerCase().includes(q) || r.application.toLowerCase().includes(q) || r.city.toLowerCase().includes(q) || r.manufacturer.toLowerCase().includes(q)); }
    Object.entries(filters).forEach(([k, vs]) => { if (vs.length) d = d.filter(r => { const v = String((r as unknown as Record<string, unknown>)[k] ?? ''); return vs.some(x => v.toLowerCase().includes(x.toLowerCase())); }); });
    return d;
  }, [search, filters]);
  const totalCr = filtered.reduce((s: number, r) => s + r.investmentCr, 0);
  const avgGe = filtered.length ? filtered.reduce((s: number, r) => s + r.germaniumPercent, 0) / filtered.length : 0;
  const delayedCount = filtered.filter(r => r.status === 'Delayed').length;

  return (
    <div className="space-y-6">
      <PageHeader title="Germanium Metal Logistics" description="Indian germanium metal supply chain tracking for IR optics, semiconductor substrate, fibre optic preform, nuclear detection and defence seeker sectors" />
      <div className="flex gap-2 border-b">
        {tabs.map(t => (<button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-2 text-sm font-medium ${activeTab === t ? 'border-b-2 border-sky-500 text-sky-700' : 'text-muted-foreground hover:text-foreground'}`}>{t}</button>))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent><div className="text-2xl font-bold text-sky-600">{filtered.length}</div><div className="text-xs text-muted-foreground">Total Shipments</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-sky-600">&#8377;{totalCr.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground">Total Investment</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-sky-600">{avgGe.toFixed(1)}%</div><div className="text-xs text-muted-foreground">Avg Ge Content</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-red-500">{delayedCount}</div><div className="text-xs text-muted-foreground">Delayed Shipments</div></CardContent></Card>
      </div>
      {(activeTab === 'Dashboard' || activeTab === 'Registry') && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <input placeholder="Search ID, grade, application, city..." value={search} onChange={e => setSearch(e.target.value)} className="border rounded-md px-3 py-1.5 text-sm flex-1 min-w-48" />
            {['status', 'priority', 'zone'].map(f => { const opts = [...new Set(germaniumMetalRecords.map(r => (r as unknown as Record<string, unknown>)[f] as string))]; return (<div key={f} className="flex flex-wrap gap-1">{opts.map(o => (<Badge key={o} variant={(filters[f] || []).includes(o) ? 'default' : 'outline'} className="cursor-pointer text-xs" onClick={() => toggleFilter(f, o)}>{o}</Badge>))}</div>); })}
          </div>
          <div className="rounded-md border"><div className="max-h-96 overflow-auto"><table className="w-full text-sm"><thead className="sticky top-0 bg-background"><tr><th className="p-2 text-left">ID</th><th className="p-2 text-left">Batch</th><th className="p-2 text-left">Grade</th><th className="p-2 text-left">Application</th><th className="p-2 text-right">Ge%</th><th className="p-2 text-right">&#8377;Cr</th><th className="p-2 text-left">Status</th></tr></thead><tbody>{filtered.map(r => (<tr key={r.id} className={`border-t ${delayedSet.has(r.id) ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}><td className="p-2">{r.id}</td><td className="p-2">{r.batchNo}</td><td className="p-2">{r.metalGrade}</td><td className="p-2">{r.application}</td><td className="p-2 text-right">{r.germaniumPercent}</td><td className="p-2 text-right">{r.investmentCr}</td><td className="p-2"><Badge variant={r.status === 'Delivered' ? 'default' : 'destructive'}>{r.status}</Badge></td></tr>))}</tbody></table></div></div>
        </div>
      )}
      {(activeTab === 'Dashboard' || activeTab === 'Analytics') && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">Investment by Application</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { m[r.application] = (m[r.application] || 0) + r.investmentCr; return m }, {} as Record<string, number>)) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 7).map(([a, v]) => (<div key={a} className="flex justify-between text-sm"><span>{a}</span><span className="font-medium">&#8377;{v}Cr</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Shipments by Zone</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { m[r.zone] = (m[r.zone] || 0) + 1; return m }, {} as Record<string, number>)) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([z, c]) => (<div key={z} className="flex justify-between text-sm"><span>{z}</span><span className="font-medium">{c}</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Top Routes by Value</CardTitle></CardHeader><CardContent><div className="space-y-2">{filtered.sort((a, b) => b.investmentCr - a.investmentCr).slice(0, 7).map(r => (<div key={r.id} className="flex justify-between text-sm"><span>{r.origin.split('(')[0]} &#8594; {r.destination.split('(')[0]}</span><span className="font-medium">&#8377;{r.investmentCr}Cr</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Defence and Aerospace</CardTitle></CardHeader><CardContent><div className="space-y-2">{filtered.filter(r => r.application.toLowerCase().includes('defence') || r.application.toLowerCase().includes('drdo') || r.application.toLowerCase().includes('missile') || r.application.toLowerCase().includes('isro') || r.application.toLowerCase().includes('aero') || r.application.toLowerCase().includes('night')).sort((a, b) => b.investmentCr - a.investmentCr).map(r => (<div key={r.id} className="flex justify-between text-sm"><span>{r.metalGrade}</span><span className="font-medium">&#8377;{r.investmentCr}Cr</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">By Priority</CardTitle></CardHeader><CardContent><div className="space-y-2">{Object.entries(filtered.reduce((m, r) => { m[r.priority] = (m[r.priority] || 0) + 1; return m }, {} as Record<string, number>)).map(([p, c]) => (<div key={p} className="flex justify-between text-sm"><span className={priorityColors[p] || ''}>{p}</span><span className="font-medium">{c}</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Ge Purity Distribution</CardTitle></CardHeader><CardContent><div className="space-y-2">{[{ l: 'Ultra-High (99.999%+)', f: filtered.filter(r => r.germaniumPercent >= 99.999).length }, { l: 'High (99.99-99.999%)', f: filtered.filter(r => r.germaniumPercent >= 99.99 && r.germaniumPercent < 99.999).length }, { l: 'Medium (50-99%)', f: filtered.filter(r => r.germaniumPercent >= 50 && r.germaniumPercent < 99).length }, { l: 'Alloy (<50%)', f: filtered.filter(r => r.germaniumPercent < 50).length }].map(b => (<div key={b.l} className="flex justify-between text-sm"><span>{b.l}</span><span className="font-medium">{b.f}</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Top Manufacturers</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { m[r.manufacturer] = (m[r.manufacturer] || 0) + r.investmentCr; return m }, {} as Record<string, number>)) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 7).map(([m, v]) => (<div key={m} className="flex justify-between text-sm"><span>{m}</span><span className="font-medium">&#8377;{v}Cr</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Avg Transit Days</CardTitle></CardHeader><CardContent><div className="space-y-2">{filtered.length ? (Object.entries(filtered.reduce((m, r) => { m[r.zone] = (m[r.zone] || [] as number[]).concat(r.transitDays); return m }, {} as Record<string, number[]>)) as [string, number[]][]).map(([z, d]) => (<div key={z} className="flex justify-between text-sm"><span>{z}</span><span className="font-medium">{(d.reduce((s, n) => s + n, 0) / d.length).toFixed(1)}d</span></div>)) : []}</div></CardContent></Card>
        </div>
      )}
      {(activeTab === 'Dashboard' || activeTab === 'Insights') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card><CardContent><div className="text-sm font-medium text-sky-600 mb-2">BEL Thermal Imaging Ge Lens Scaling</div><div className="text-xs text-muted-foreground">BEL ramping production of 640x512 and 1280x1024 cooled IRFPA detectors for fighter aircraft, helicopter and infantry thermal sights. Each detector requires 2-4 precision-polished Ge lens elements at 8-14 um bandpass. Hindustan Semiconductor expanding Czochralski Ge ingot capacity to 10 TPA under &#8377;2,800Cr iDEX programme targeting 100% domestic supply.</div></CardContent></Card>
          <Card><CardContent><div className="text-sm font-medium text-sky-600 mb-2">ISRO Triple-Junction Ge Substrate</div><div className="text-xs text-muted-foreground">ISRO satellite power system adopting GaAs/Ge triple-junction solar cells achieving 33% AM0 efficiency vs 28% for silicon. Bharat Forge and Gujarat Germanium Tech supplying 100mm Ge substrates. India targeting 50 satellite launches by 2030 with each GEO comsat requiring 15 kW of solar array using 500K Ge substrate cells.</div></CardContent></Card>
          <Card><CardContent><div className="text-sm font-medium text-sky-600 mb-2">Sterlite Fiber Optic GeO2 Doping</div><div className="text-xs text-muted-foreground">Sterlite Technologies expanding fiber optic preform production to 50M fibre-km annually requiring 60 tonnes of GeO2 for core index raising. India fibre deployment accelerating under BharatNet 500K village coverage. GeO2 imported 80% from China with Gujarat Germanium Products developing indigenous GeO2 synthesis from Ge scrap recovery.</div></CardContent></Card>
          <Card><CardContent><div className="text-sm font-medium text-sky-600 mb-2">BARC HPGe Radiation Detector</div><div className="text-xs text-muted-foreground">Bhabha Atomic Research Centre deploying 200 HPGe gamma spectrometers across nuclear facilities for environmental monitoring and safeguards verification. Ultra-pure 99.9999% zone-refined Ge with 200 ohm-cm resistivity enabling 2 keV energy resolution at 1.33 MeV. Assam Germanium Metals developing indigenous zone refining from coal fly ash Ge recovery.</div></CardContent></Card>
        </div>
      )}
    </div>
  );
}
"""

outpath = "/home/z/my-project/src/components/modules/germanium-metal-logistics-view.tsx"
with open(outpath, "w") as f:
    f.write(COMPONENT)
print(f"Written {outpath} ({len(COMPONENT)} bytes)")
