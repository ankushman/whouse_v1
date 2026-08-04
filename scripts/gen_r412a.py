#!/usr/bin/env python3
"""Generate R412a: Thallium Compound Logistics View"""
content = r""""use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared';
import { BrainCircuit } from 'lucide-react';

interface ThalliumCompoundRecord {
  id: string;
  batchNo: string;
  city: string;
  manufacturer: string;
  compoundGrade: string;
  application: string;
  purityPercent: number;
  densityGcm3: number;
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

const thalliumCompoundRecords: ThalliumCompoundRecord[] = [
  { id: 'THC-0001', batchNo: 'THC-B2401', city: 'Mumbai', manufacturer: 'Haffkine Bio-Pharma', compoundGrade: 'Tl-201 99.9% Cardiac Agent', application: 'SPECT Heart Scan (HLL)', purityPercent: 99.9, densityGcm3: 11.85, investmentCr: 640, status: 'Delivered', priority: 'Critical', origin: 'Haffkine Bio-Pharma Mumbai (MH)', destination: 'HLL Hyderabad (TG)', shipDate: '2026-07-15', transitDays: 2, zone: 'West', remarks: 'Tl-201 chloride for HLL SPECT myocardial perfusion imaging &#8594; 99.9% Tl-201 &#8594; &#8377;640Cr for 0.05 tonnes &#8594; India &#8377;19,200Cr medical Tl &#8594; HLL 50K scans &#8594; 11.85 g/cm3 &#8594; &#8594; 73h half-life &#8594; 73 keV &#8594; &#8594; cardiac' },
  { id: 'THC-0002', batchNo: 'THC-B2402', city: 'Hyderabad', manufacturer: 'DRDO DMRL', compoundGrade: 'Tl2O3 99.99% Optical Glass', application: 'High-Index Lens (Carl Zeiss India)', purityPercent: 99.99, densityGcm3: 9.65, investmentCr: 530, status: 'Delivered', priority: 'High', origin: 'DRDO DMRL Hyderabad (TG)', destination: 'Carl Zeiss Bengaluru (KA)', shipDate: '2026-07-16', transitDays: 1, zone: 'South', remarks: 'Tl2O3 for Carl Zeiss India high-refractive-index camera lens polishing &#8594; 99.99% Tl2O3 &#8594; &#8377;530Cr for 0.3 tonnes &#8594; India &#8377;15,900Cr optical Tl &#8594; Zeiss 5M lenses &#8594; 9.65 g/cm3 &#8594; &#8594; n=2.25 &#8594; &#8594; low dispersion &#8594; &#8594; coating' },
  { id: 'THC-0003', batchNo: 'THC-B2403', city: 'Bengaluru', manufacturer: 'CSIR-NPL', compoundGrade: 'TlBr 99.999% Crystal', application: 'Gamma-Ray Detector (BARC)', purityPercent: 99.999, densityGcm3: 7.56, investmentCr: 710, status: 'Delivered', priority: 'Critical', origin: 'CSIR-NPL New Delhi (DL)', destination: 'BARC Mumbai (MH)', shipDate: '2026-07-17', transitDays: 2, zone: 'North', remarks: 'TlBr crystal for BARC room-temperature gamma-ray spectrometer detector &#8594; 99.999% TlBr &#8594; &#8377;710Cr for 0.1 tonnes &#8594; India &#8377;21,300Cr nuclear Tl &#8594; BARC 500 detectors &#8594; 7.56 g/cm3 &#8594; &#8594; Z=81/35 &#8594; 1-2% FWHM &#8594; &#8594; RT' },
  { id: 'THC-0004', batchNo: 'THC-B2404', city: 'Pune', manufacturer: 'Bharat Forge', compoundGrade: 'TlCl 99.95% IR Crystal', application: 'IR Sensor Window (BEL)', purityPercent: 99.95, densityGcm3: 7.0, investmentCr: 420, status: 'Delivered', priority: 'High', origin: 'Bharat Forge Pune (MH)', destination: 'BEL Ghaziabad (UP)', shipDate: '2026-07-18', transitDays: 2, zone: 'West', remarks: 'TlCl crystal for BEL military thermal infrared seeker window &#8594; 99.95% TlCl &#8594; &#8377;420Cr for 0.2 tonnes &#8594; India &#8377;12,600Cr defence Tl &#8594; BEL 2000 seekers &#8594; 7.0 g/cm3 &#8594; &#8594; 42 um &#8594; &#8594; KRS-5 &#8594; &#8594; 8-12um' },
  { id: 'THC-0005', batchNo: 'THC-B2405', city: 'Chennai', manufacturer: 'IGCAR', compoundGrade: 'Tl2SO4 99.9% Electrolyte', application: 'Medical ECG Electrode (HLL)', purityPercent: 99.9, densityGcm3: 6.77, investmentCr: 280, status: 'Delivered', priority: 'Medium', origin: 'IGCAR Kalpakkam (TN)', destination: 'HLL Hyderabad (TG)', shipDate: '2026-07-19', transitDays: 1, zone: 'South', remarks: 'Tl2SO4 for HLL disposable ECG skin electrode conductive gel &#8594; 99.9% Tl2SO4 &#8594; &#8377;280Cr for 0.5 tonnes &#8594; India &#8377;8,400Cr medical Tl &#8594; HLL 2M electrodes &#8594; 6.77 g/cm3 &#8594; &#8594; ionic &#8594; &#8594; Ag/AgCl &#8594; &#8594; ECG' },
  { id: 'THC-0006', batchNo: 'THC-B2406', city: 'Ahmedabad', manufacturer: 'Gujarat Thallium Tech', compoundGrade: 'TlI 99.99% Scintillator', application: 'Radiation Portal Monitor (DRDO)', purityPercent: 99.99, densityGcm3: 8.0, investmentCr: 380, status: 'Delivered', priority: 'High', origin: 'Gujarat Thallium Tech Ahmedabad (GJ)', destination: 'DRDO Delhi (DL)', shipDate: '2026-07-20', transitDays: 2, zone: 'West', remarks: 'TlI crystal for DRDO airport radiation portal scintillation detector &#8594; 99.99% TlI &#8594; &#8377;380Cr for 0.15 tonnes &#8594; India &#8377;11,400Cr security Tl &#8594; DRDO 500 portals &#8594; 8.0 g/cm3 &#8594; &#8594; 5.4% LY &#8594; &#8594; Cs-137 &#8594; &#8594; portal' },
  { id: 'THC-0007', batchNo: 'THC-B2407', city: 'Jaipur', manufacturer: 'Rajasthan Thallium Chem', compoundGrade: 'Tl2O3 99.95% Ceramic', application: 'Superconductor Precursor (CSIR-NML)', purityPercent: 99.95, densityGcm3: 9.65, investmentCr: 460, status: 'Delivered', priority: 'High', origin: 'Rajasthan Thallium Chem Jaipur (RJ)', destination: 'CSIR-NML Jamshedpur (JH)', shipDate: '2026-07-21', transitDays: 2, zone: 'North', remarks: 'Tl2O3 precursor for CSIR-NML Tl-1223 high-Tc superconductor synthesis &#8594; 99.95% Tl2O3 &#8594; &#8377;460Cr for 0.2 tonnes &#8594; India &#8377;13,800Cr super Tl &#8594; CSIR &#8594; 9.65 g/cm3 &#8594; &#8594; 132K Tc &#8594; &#8594; TlBaCaCuO &#8594; &#8594; MRI' },
  { id: 'THC-0008', batchNo: 'THC-B2408', city: 'Bhubaneswar', manufacturer: 'NALCO', compoundGrade: 'TlAs 99.9% Semiconductor', application: 'Infrared Detector (ISRO)', purityPercent: 99.9, densityGcm3: 7.9, investmentCr: 520, status: 'Delivered', priority: 'High', origin: 'NALCO Bhubaneswar (OD)', destination: 'ISRO Ahmedabad (GJ)', shipDate: '2026-07-22', transitDays: 3, zone: 'East', remarks: 'TlAs III-V semiconductor for ISRO satellite thermal IR focal plane array &#8594; 99.9% TlAs &#8594; &#8377;520Cr for 0.1 tonnes &#8594; India &#8377;15,600Cr space Tl &#8594; ISRO 12 sats &#8594; 7.9 g/cm3 &#8594; &#8594; 0.7 eV &#8594; &#8594; 3-5um &#8594; &#8594; FPA' },
  { id: 'THC-0009', batchNo: 'THC-B2409', city: 'Coimbatore', manufacturer: 'Tamil Nadu Thallium Corp', compoundGrade: 'Tl-204 99.95% Isotope', application: 'Pipeline Thickness Gauge (BPCL)', purityPercent: 99.95, densityGcm3: 11.85, investmentCr: 340, status: 'Delivered', priority: 'Medium', origin: 'Tamil Nadu Thallium Corp Coimbatore (TN)', destination: 'BPCL Mumbai (MH)', shipDate: '2026-07-23', transitDays: 2, zone: 'South', remarks: 'Tl-204 sealed source for BPCL refinery pipe wall thickness NDT gauge &#8594; 99.95% Tl-204 &#8594; &#8377;340Cr for 0.02 tonnes &#8594; India &#8377;10,200Cr industrial Tl &#8594; BPCL 15K km &#8594; 11.85 g/cm3 &#8594; &#8594; 3.8y half-life &#8594; &#8594; 72 keV &#8594; &#8594; NDT' },
  { id: 'THC-0010', batchNo: 'THC-B2410', city: 'Surat', manufacturer: 'Gujarat Thallium Products', compoundGrade: 'TlClO4 99.9% Reagent', application: 'Organic Synthesis Catalyst (Sun Pharma)', purityPercent: 99.9, densityGcm3: 5.05, investmentCr: 260, status: 'Delivered', priority: 'Medium', origin: 'Gujarat Thallium Products Surat (GJ)', destination: 'Sun Pharma Vapi (GJ)', shipDate: '2026-07-24', transitDays: 1, zone: 'West', remarks: 'TlClO4 as oxidant for Sun Pharma API thallium-mediated organic synthesis &#8594; 99.9% TlClO4 &#8594; &#8377;260Cr for 0.1 tonnes &#8594; India &#8377;7,800Cr pharma Tl &#8594; Sun Pharma &#8594; 5.05 g/cm3 &#8594; &#8594; oxidant &#8594; &#8594; asymmetric &#8594; &#8594; chiral' },
  { id: 'THC-0011', batchNo: 'THC-B2411', city: 'Guwahati', manufacturer: 'Assam Thallium Metals', compoundGrade: 'TlBr 99.99% CT Detector', application: 'Medical CT Array (HLL)', purityPercent: 99.99, densityGcm3: 7.56, investmentCr: 580, status: 'Delivered', priority: 'High', origin: 'Assam Thallium Metals Guwahati (AS)', destination: 'HLL Hyderabad (TG)', shipDate: '2026-07-25', transitDays: 4, zone: 'East', remarks: 'TlBr single crystal for HLL photon-counting CT detector module &#8594; 99.99% TlBr &#8594; &#8377;580Cr for 0.08 tonnes &#8594; India &#8377;17,400Cr medical Tl &#8594; HLL 500 CT &#8594; 7.56 g/cm3 &#858594; &#8594; 1.5% FWHM &#8594; &#8594; 80 keV &#8594; &#8594; PC-CT' },
  { id: 'THC-0012', batchNo: 'THC-B2412', city: 'Lucknow', manufacturer: 'UP Thallium Industries', compoundGrade: 'Tl2O3 99.9% Glass Batch', application: 'Optical Fiber Preform (Sterlite)', purityPercent: 99.9, densityGcm3: 9.65, investmentCr: 470, status: 'Delayed', priority: 'High', origin: 'UP Thallium Industries Lucknow (UP)', destination: 'Sterlite Aurangabad (MH)', shipDate: '2026-07-01', transitDays: 27, zone: 'North', remarks: 'Tl2O3 glass additive for Sterlite high-NA infrared optical fiber preform &#8594; 99.9% Tl2O3 &#8594; &#8377;470Cr for 0.4 tonnes &#8594; monsoon delay &#8594; India &#8377;14,100Cr telecom Tl &#8594; Sterlite 50M fiber &#8594; 9.65 g/cm3 &#8594; &#8594; NA 0.45 &#8594; &#8594; 2-4um &#8594; &#8594; preform' },
  { id: 'THC-0013', batchNo: 'THC-B2413', city: 'Noida', manufacturer: 'SAIL', compoundGrade: 'TlF 99.95% Dental', application: 'Dental X-Ray Film (3M India)', purityPercent: 99.95, densityGcm3: 8.36, investmentCr: 220, status: 'Delivered', priority: 'Medium', origin: 'SAIL Rourkela (OD)', destination: '3M India Bengaluru (KA)', shipDate: '2026-07-26', transitDays: 2, zone: 'East', remarks: 'TlF activator for 3M India dental intraoral X-ray film intensifying screen &#8594; 99.95% TlF &#8594; &#8377;220Cr for 0.3 tonnes &#8594; India &#8377;6,600Cr dental Tl &#8594; 3M 5M films &#8594; 8.36 g/cm3 &#8594; &#8594; blue emission &#8594; &#8594; 70 kVp &#8594; &#8594; screen' },
  { id: 'THC-0014', batchNo: 'THC-B2414', city: 'Bhopal', manufacturer: 'BHEL', compoundGrade: 'Tl2O3 99.5% Seal Glass', application: 'Crt Display Seal (Dixon)', purityPercent: 99.5, densityGcm3: 9.65, investmentCr: 310, status: 'Delivered', priority: 'Medium', origin: 'BHEL Bhopal (MP)', destination: 'Dixon Noida (UP)', shipDate: '2026-07-27', transitDays: 1, zone: 'North', remarks: 'Tl2O3 seal glass frit for Dixon display panel glass-to-metal hermetic seal &#8594; 99.5% Tl2O3 &#8594; &#8377;310Cr for 0.6 tonnes &#8594; India &#8377;9,300Cr display Tl &#8594; Dixon 2M panels &#8594; 9.65 g/cm3 &#8594; &#8594; TEC 7.2 &#8594; &#8594; 450&#176;C &#8594; &#8594; hermetic' }
];

const tabs = ['Dashboard', 'Registry', 'Analytics', 'Insights'] as const;
type Tab = typeof tabs[number];
const priorityColors: Record<string, string> = { Critical: 'bg-red-100 text-red-800', High: 'bg-amber-100 text-amber-800', Medium: 'bg-green-100 text-green-800', Low: 'bg-slate-100 text-slate-600' };
const delayedSet = new Set(thalliumCompoundRecords.filter(r => r.status === 'Delayed').map(r => r.id));

export default function ThalliumCompoundLogisticsView() {
  const [activeTab, setActiveTab] = useState<Tab>('Dashboard');
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const toggleFilter = (k: string, v: string) => { setFilters(p => { const s = { ...p }; const a = s[k] || []; const i = a.indexOf(v); if (i > -1) { a.splice(i, 1); if (!a.length) delete s[k]; } else s[k] = [...a, v]; return s; }); };
  const filtered = useMemo(() => {
    let d = thalliumCompoundRecords;
    if (search) { const q = search.toLowerCase(); d = d.filter(r => r.id.toLowerCase().includes(q) || r.batchNo.toLowerCase().includes(q) || r.compoundGrade.toLowerCase().includes(q) || r.application.toLowerCase().includes(q) || r.city.toLowerCase().includes(q) || r.manufacturer.toLowerCase().includes(q)); }
    Object.entries(filters).forEach(([k, vs]) => { if (vs.length) d = d.filter(r => { const v = String((r as unknown as Record<string, unknown>)[k] ?? ''); return vs.some(x => v.toLowerCase().includes(x.toLowerCase())); }); });
    return d;
  }, [search, filters]);
  const totalCr = filtered.reduce((s: number, r) => s + r.investmentCr, 0);
  const avgPurity = filtered.length ? filtered.reduce((s: number, r) => s + r.purityPercent, 0) / filtered.length : 0;
  const delayedCount = filtered.filter(r => r.status === 'Delayed').length;

  return (
    <div className="space-y-6">
      <PageHeader title="Thallium Compound Logistics" description="Indian thallium compound supply chain tracking for medical imaging, optical glass, radiation detection, defence IR sensors, superconductors and industrial NDT sectors" />
      <div className="flex gap-2 border-b">
        {tabs.map(t => (<button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-2 text-sm font-medium ${activeTab === t ? 'border-b-2 border-indigo-500 text-indigo-700' : 'text-muted-foreground hover:text-foreground'}`}>{t}</button>))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent><div className="text-2xl font-bold text-indigo-600">{filtered.length}</div><div className="text-xs text-muted-foreground">Total Shipments</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-indigo-600">&#8377;{totalCr.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground">Total Investment</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-indigo-600">{avgPurity.toFixed(2)}%</div><div className="text-xs text-muted-foreground">Avg Purity</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-red-500">{delayedCount}</div><div className="text-xs text-muted-foreground">Delayed Shipments</div></CardContent></Card>
      </div>
      {(activeTab === 'Dashboard' || activeTab === 'Registry') && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <input placeholder="Search ID, grade, application, city..." value={search} onChange={e => setSearch(e.target.value)} className="border rounded-md px-3 py-1.5 text-sm flex-1 min-w-48" />
            {['status', 'priority', 'zone'].map(f => { const opts = [...new Set(thalliumCompoundRecords.map(r => (r as unknown as Record<string, unknown>)[f] as string))]; return (<div key={f} className="flex flex-wrap gap-1">{opts.map(o => (<Badge key={o} variant={(filters[f] || []).includes(o) ? 'default' : 'outline'} className="cursor-pointer text-xs" onClick={() => toggleFilter(f, o)}>{o}</Badge>))}</div>); })}
          </div>
          <div className="rounded-md border"><div className="max-h-96 overflow-auto"><table className="w-full text-sm"><thead className="sticky top-0 bg-background"><tr><th className="p-2 text-left">ID</th><th className="p-2 text-left">Batch</th><th className="p-2 text-left">Grade</th><th className="p-2 text-left">Application</th><th className="p-2 text-right">Purity%</th><th className="p-2 text-right">&#8377;Cr</th><th className="p-2 text-left">Status</th></tr></thead><tbody>{filtered.map(r => (<tr key={r.id} className={`border-t ${delayedSet.has(r.id) ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}><td className="p-2">{r.id}</td><td className="p-2">{r.batchNo}</td><td className="p-2">{r.compoundGrade}</td><td className="p-2">{r.application}</td><td className="p-2 text-right">{r.purityPercent}</td><td className="p-2 text-right">{r.investmentCr}</td><td className="p-2"><Badge variant={r.status === 'Delivered' ? 'default' : 'destructive'}>{r.status}</Badge></td></tr>))}</tbody></table></div></div>
        </div>
      )}
      {(activeTab === 'Dashboard' || activeTab === 'Analytics') && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">Investment by Application</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { m[r.application] = (m[r.application] || 0) + r.investmentCr; return m }, {} as Record<string, number>)) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 7).map(([a, v]) => (<div key={a} className="flex justify-between text-sm"><span>{a}</span><span className="font-medium">&#8377;{v}Cr</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Shipments by Zone</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { m[r.zone] = (m[r.zone] || 0) + 1; return m }, {} as Record<string, number>)) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([z, c]) => (<div key={z} className="flex justify-between text-sm"><span>{z}</span><span className="font-medium">{c}</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Top Routes by Value</CardTitle></CardHeader><CardContent><div className="space-y-2">{filtered.sort((a, b) => b.investmentCr - a.investmentCr).slice(0, 7).map(r => (<div key={r.id} className="flex justify-between text-sm"><span>{r.origin.split('(')[0]} &#8594; {r.destination.split('(')[0]}</span><span className="font-medium">&#8377;{r.investmentCr}Cr</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Medical and Nuclear</CardTitle></CardHeader><CardContent><div className="space-y-2">{filtered.filter(r => r.application.toLowerCase().includes('medical') || r.application.toLowerCase().includes('hll') || r.application.toLowerCase().includes('barc') || r.application.toLowerCase().includes('nuclear') || r.application.toLowerCase().includes('cardiac') || r.application.toLowerCase().includes('detector')).sort((a, b) => b.investmentCr - a.investmentCr).map(r => (<div key={r.id} className="flex justify-between text-sm"><span>{r.compoundGrade}</span><span className="font-medium">&#8377;{r.investmentCr}Cr</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">By Priority</CardTitle></CardHeader><CardContent><div className="space-y-2">{Object.entries(filtered.reduce((m, r) => { m[r.priority] = (m[r.priority] || 0) + 1; return m }, {} as Record<string, number>)).map(([p, c]) => (<div key={p} className="flex justify-between text-sm"><span className={priorityColors[p] || ''}>{p}</span><span className="font-medium">{c}</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Compound Type Distribution</CardTitle></CardHeader><CardContent><div className="space-y-2">{[{ l: 'Oxide (Tl2O3)', f: filtered.filter(r => 'Oxide' in r.compoundGrade || 'Tl2O3' in r.compoundGrade).length }, { l: 'Halide (TlBr/TlCl/TlI/TlF)', f: filtered.filter(r => r.compoundGrade.includes('Br') || r.compoundGrade.includes('Cl') || r.compoundGrade.includes('I ') || r.compoundGrade.includes('F ')).length }, { l: 'Isotope (Tl-201/204)', f: filtered.filter(r => r.compoundGrade.includes('Tl-')).length }, { l: 'Other Compounds', f: filtered.filter(r => r.compoundGrade.includes('SO4') || r.compoundGrade.includes('ClO4') || r.compoundGrade.includes('As')).length }].map(b => (<div key={b.l} className="flex justify-between text-sm"><span>{b.l}</span><span className="font-medium">{b.f}</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Top Manufacturers</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { m[r.manufacturer] = (m[r.manufacturer] || 0) + r.investmentCr; return m }, {} as Record<string, number>)) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 7).map(([m, v]) => (<div key={m} className="flex justify-between text-sm"><span>{m}</span><span className="font-medium">&#8377;{v}Cr</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Avg Transit Days</CardTitle></CardHeader><CardContent><div className="space-y-2">{filtered.length ? (Object.entries(filtered.reduce((m, r) => { m[r.zone] = (m[r.zone] || [] as number[]).concat(r.transitDays); return m }, {} as Record<string, number[]>)) as [string, number[]][]).map(([z, d]) => (<div key={z} className="flex justify-between text-sm"><span>{z}</span><span className="font-medium">{(d.reduce((s, n) => s + n, 0) / d.length).toFixed(1)}d</span></div>)) : []}</div></CardContent></Card>
        </div>
      )}
      {(activeTab === 'Dashboard' || activeTab === 'Insights') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card><CardContent><div className="text-sm font-medium text-indigo-600 mb-2">HLL Tl-201 SPECT Cardiac Imaging</div><div className="text-xs text-muted-foreground">HLL producing Tl-201 chloride radiopharmaceutical from imported cyclotron targets for 50,000 annual SPECT myocardial perfusion scans. Tl-201 mimics K+ ion biological uptake enabling stress-rest heart viability assessment. India targeting 200K cardiac scans by 2028 under &#8377;1,200Cr National Cardiac Imaging Programme.</div></CardContent></Card>
          <Card><CardContent><div className="text-sm font-medium text-indigo-600 mb-2">BARC TlBr Room-Temp Gamma Detector</div><div className="text-xs text-muted-foreground">BARC qualifying TlBr single crystal for room-temperature gamma spectrometry replacing HPGe requiring liquid nitrogen cooling. TlBr achieves 1-2% energy resolution at 662 keV with Z=81/35 high atomic number. CSIR-NPL co-developing Bridgman crystal growth under &#8377;2,800Cr AICRP replacing Czech import dependency.</div></CardContent></Card>
          <Card><CardContent><div className="text-sm font-medium text-indigo-600 mb-2">CSIR-NML Tl-1223 High-Tc Superconductor</div><div className="text-xs text-muted-foreground">CSIR-NML developing Tl-1223 (TlBa2Ca2Cu3O9) superconductor with 132K critical temperature for MRI magnets replacing NbTi at 4.2K. Thallium-based superconductor enables liquid-nitrogen-cooled MRI reducing magnet cost 60%. Rajasthan Thallium Chem supplying Tl2O3 precursor under &#8377;3,500Cr programme.</div></CardContent></Card>
          <Card><CardContent><div className="text-sm font-medium text-indigo-600 mb-2">BEL TlCl Military IR Seeker Window</div><div className="text-xs text-muted-foreground">BEL using TlCl KRS-5 crystal windows for military infrared missile seeker domes transmitting 8-12um thermal band. TlCl provides superior IR transmission vs Ge with lower refractive index reducing anti-reflection coating complexity. DRDO qualifying for Nag/Helina ATGM seeker programme.</div></CardContent></Card>
        </div>
      )}
    </div>
  );
}
"""

with open("/home/z/my-project/src/components/modules/thallium-compound-logistics-view.tsx", "w") as f:
    f.write(content)
print("Generated thallium-compound-logistics-view.tsx")
