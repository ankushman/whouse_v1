"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared';
import { Droplets } from 'lucide-react';

interface CobaltSulphateRecord {
  id: string; batchNo: string; city: string; manufacturer: string; grade: string;
  application: string; purityPercent: number; specProp: number; investmentCr: number;
  status: string; priority: string; origin: string; destination: string;
  shipDate: string; transitDays: number; zone: string; remarks: string;
};

const cobaltsulphateRecords: CobaltSulphateRecord[] = [
  { id: 'COS-0001', batchNo: 'COS-B2401', city: 'Mumbai', manufacturer: 'MIDHANI', grade: 'CoSO4 99.9% Battery', application: 'Exide Industries Li-Ion Cathode', purityPercent: 99.9, specProp: 20.5, investmentCr: 880, status: 'Delivered', priority: 'Critical', origin: 'MIDHANI Hyderabad (TG)', destination: 'Exide Kolkata (WB)', shipDate: '2026-07-15', transitDays: 1, zone: 'West', remarks: 'CoSO4 99.9% battery-grade for Exide NMC cathode cobalt precursor &amp;#8594; 20.5% Co &amp;#8594; &amp;#8377;880Cr for 50 tonnes &amp;#8594; India &amp;#8377;6,200Cr CoSO4 battery &amp;#8594; Exide 100M cells &amp;#8594; 99.9% purity &amp;#8594; &amp;#8594; Crystal &amp;#8594; &amp;#8594; CoSO4Batt &amp;#8594; &amp;#8594; Battery' },
  { id: 'COS-0002', batchNo: 'COS-B2402', city: 'Bengaluru', manufacturer: 'DRDO DMRL', grade: 'CoSO4 99.5% Superalloy', application: 'BEL LCA Tejas Mk2 Turbine Disc', purityPercent: 99.5, specProp: 20.8, investmentCr: 820, status: 'In Transit', priority: 'Critical', origin: 'DRDO Hyderabad (TG)', destination: 'BEL Bengaluru (KA)', shipDate: '2026-07-16', transitDays: 2, zone: 'South', remarks: 'CoSO4 99.5% superalloy precursor for BEL Tejas Mk2 F414 turbine disc Ni-Co superalloy &amp;#8594; 20.8% Co &amp;#8594; &amp;#8377;820Cr for 40 tonnes &amp;#8594; India &amp;#8377;5,800Cr CoSO4 aerospace &amp;#8594; BEL 40 aircraft &amp;#8594; 99.5% purity &amp;#8594; &amp;#8594; Solution &amp;#8594; &amp;#8594; CoSO4Super &amp;#8594; &amp;#8594; Aerospace' },
  { id: 'COS-0003', batchNo: 'COS-B2403', city: 'Chennai', manufacturer: 'Tata Steel', grade: 'CoSO4 98% Pigment', application: 'Asian Paints Cobalt Blue Pigment', purityPercent: 98.0, specProp: 20.0, investmentCr: 540, status: 'Delivered', priority: 'High', origin: 'Tata Steel Jamshedpur (JH)', destination: 'Asian Paints Mumbai (MH)', shipDate: '2026-07-17', transitDays: 3, zone: 'South', remarks: 'CoSO4 98% pigment-grade for Asian Paints cobalt blue ceramic pigment &amp;#8594; 20% Co &amp;#8594; &amp;#8377;540Cr for 70 tonnes &amp;#8594; India &amp;#8377;3,800Cr CoSO4 pigment &amp;#8594; Asian 50M litres &amp;#8594; 98.0% purity &amp;#8594; &amp;#8594; Powder &amp;#8594; &amp;#8594; CoSO4Pig &amp;#8594; &amp;#8594; Paint' },
  { id: 'COS-0004', batchNo: 'COS-B2404', city: 'Hyderabad', manufacturer: 'Bharat Forge', grade: 'CoSO4 97% Hardmetal', application: 'Bharat Forge WC-Co Tool Insert', purityPercent: 97.0, specProp: 21.0, investmentCr: 480, status: 'Delivered', priority: 'High', origin: 'Bharat Forge Pune (MH)', destination: 'Sandvik Hyderabad (TG)', shipDate: '2026-07-18', transitDays: 4, zone: 'West', remarks: 'CoSO4 97% hardmetal binder for Bharat Forge WC-Co tungsten carbide tool insert &amp;#8594; 21% Co &amp;#8594; &amp;#8377;480Cr for 60 tonnes &amp;#8594; India &amp;#8377;3,400Cr CoSO4 tool &amp;#8594; Bharat Forge 2M inserts &amp;#8594; 97.0% purity &amp;#8594; &amp;#8594; Powder &amp;#8594; &amp;#8594; CoSO4WC &amp;#8594; &amp;#8594; Manufacturing' },
  { id: 'COS-0005', batchNo: 'COS-B2405', city: 'Kolkata', manufacturer: 'Indian Rare Earths', grade: 'CoSO4 99.7% Catalyst', application: 'IOCL refinery Hydrocracking', purityPercent: 99.7, specProp: 20.6, investmentCr: 620, status: 'In Transit', priority: 'High', origin: 'IRE Alwaye (KL)', destination: 'IOCL Paradip (OD)', shipDate: '2026-07-19', transitDays: 5, zone: 'East', remarks: 'CoSO4 99.7% catalyst precursor for IOCL Paradip refinery hydrocracking Co-Mo catalyst &amp;#8594; 20.6% Co &amp;#8594; &amp;#8377;620Cr for 45 tonnes &amp;#8594; India &amp;#8377;4,200Cr CoSO4 catalyst &amp;#8594; IOCL 3 refineries &amp;#8594; 99.7% purity &amp;#8594; &amp;#8594; Solution &amp;#8594; &amp;#8594; CoSO4Cat &amp;#8594; &amp;#8594; Refining' },
  { id: 'COS-0006', batchNo: 'COS-B2406', city: 'Coimbatore', manufacturer: 'BHEL R&amp;D', grade: 'CoSO4 99% Magnetic', application: 'BHEL 800MW GT Magnetic Sensor', purityPercent: 99.0, specProp: 20.3, investmentCr: 700, status: 'Delivered', priority: 'Critical', origin: 'BHEL Bhopal (MP)', destination: 'BHEL Hyderabad (TG)', shipDate: '2026-07-20', transitDays: 1, zone: 'South', remarks: 'CoSO4 99% magnetic-grade for BHEL 800MW gas turbine magnetic speed sensor coil &amp;#8594; 20.3% Co &amp;#8594; &amp;#8377;700Cr for 55 tonnes &amp;#8594; India &amp;#8377;5,000Cr CoSO4 power &amp;#8594; BHEL 20 GTs &amp;#8594; 99.0% purity &amp;#8594; &amp;#8594; Crystal &amp;#8594; &amp;#8594; CoSO4Mag &amp;#8594; &amp;#8594; Power' },
  { id: 'COS-0007', batchNo: 'COS-B2407', city: 'Pune', manufacturer: 'Mahindra Steel', grade: 'CoSO4 98% EV Battery', application: 'Mahindra XUV400 NCM Cell', purityPercent: 98.0, specProp: 20.1, investmentCr: 440, status: 'Delivered', priority: 'Medium', origin: 'Mahindra Nashik (MH)', destination: 'Mahindra Pune (MH)', shipDate: '2026-07-21', transitDays: 2, zone: 'West', remarks: 'CoSO4 98% EV-grade for Mahindra XUV400 NCM lithium-ion cathode cobalt source &amp;#8594; 20.1% Co &amp;#8594; &amp;#8377;440Cr for 60 tonnes &amp;#8594; India &amp;#8377;3,000Cr CoSO4 EV &amp;#8594; Mahindra 50K batteries &amp;#8594; 98.0% purity &amp;#8594; &amp;#8594; Solution &amp;#8594; &amp;#8594; CoSO4EV &amp;#8594; &amp;#8594; Automotive' },
  { id: 'COS-0008', batchNo: 'COS-B2408', city: 'Jaipur', manufacturer: 'Rajasthan Chemicals', grade: 'CoSO4 96% Electroplating', application: 'Jindal Stainless Steel Plating', purityPercent: 96.0, specProp: 19.5, investmentCr: 320, status: 'Delivered', priority: 'Low', origin: 'Rajasthan Chemicals Jodhpur (RJ)', destination: 'Jindal Hisar (HR)', shipDate: '2026-07-22', transitDays: 3, zone: 'West', remarks: 'CoSO4 96% electroplating-grade for Jindal stainless steel decorative cobalt plating &amp;#8594; 19.5% Co &amp;#8594; &amp;#8377;320Cr for 80 tonnes &amp;#8594; India &amp;#8377;2,200Cr CoSO4 plating &amp;#8594; Jindal 500K sheets &amp;#8594; 96.0% purity &amp;#8594; &amp;#8594; Solution &amp;#8594; &amp;#8594; CoSO4Plate &amp;#8594; &amp;#8594; Steel' },
  { id: 'COS-0009', batchNo: 'COS-B2409', city: 'Guwahati', manufacturer: 'Assam Chemicals', grade: 'CoSO4 95% Agriculture', application: 'IFFCO Cobalt Micronutrient', purityPercent: 95.0, specProp: 19.0, investmentCr: 260, status: 'In Transit', priority: 'Low', origin: 'Assam Chemicals Tezpur (AS)', destination: 'IFFCO Paradeep (OD)', shipDate: '2026-07-23', transitDays: 4, zone: 'East', remarks: 'CoSO4 95% agricultural-grade for IFFCO cobalt micronutrient fertilizer for legume crops &amp;#8594; 19% Co &amp;#8594; &amp;#8377;260Cr for 100 tonnes &amp;#8594; India &amp;#8377;1,800Cr CoSO4 agri &amp;#8594; IFFCO 5M farmers &amp;#8594; 95.0% purity &amp;#8594; &amp;#8594; Granule &amp;#8594; &amp;#8594; CoSO4Agri &amp;#8594; &amp;#8594; Agriculture' },
  { id: 'COS-0010', batchNo: 'COS-B2410', city: 'Ahmedabad', manufacturer: 'Gujarat Chemicals', grade: 'CoSO4 99.8% Nuclear', application: 'IGCAR PFBR Control Rod', purityPercent: 99.8, specProp: 20.7, investmentCr: 920, status: 'Delivered', priority: 'Critical', origin: 'Gujarat Chemicals Ahmedabad (GJ)', destination: 'IGCAR Kalpakkam (TN)', shipDate: '2026-07-24', transitDays: 5, zone: 'West', remarks: 'CoSO4 99.8% nuclear-grade for IGCAR Prototype Fast Breeder Reactor Co-based alloy control rod precursor &amp;#8594; 20.7% Co &amp;#8594; &amp;#8377;920Cr for 35 tonnes &amp;#8594; India &amp;#8377;7,600Cr CoSO4 nuclear &amp;#8594; IGCAR 2 reactors &amp;#8594; 99.8% purity &amp;#8594; &amp;#8594; Crystal &amp;#8594; &amp;#8594; CoSO4Nuc &amp;#8594; &amp;#8594; Nuclear' },
  { id: 'COS-0011', batchNo: 'COS-B2411', city: 'Lucknow', manufacturer: 'UP Chemicals', grade: 'CoSO4 97% Dyes', application: 'Arvind Textile Cobalt Dye', purityPercent: 97.0, specProp: 20.0, investmentCr: 380, status: 'Delivered', priority: 'Medium', origin: 'UP Chemicals Kanpur (UP)', destination: 'Arvind Ahmedabad (GJ)', shipDate: '2026-07-25', transitDays: 1, zone: 'North', remarks: 'CoSO4 97% dye-grade for Arvind textile cobalt alumina blue dye precursor &amp;#8594; 20% Co &amp;#8594; &amp;#8377;380Cr for 60 tonnes &amp;#8594; India &amp;#8377;2,600Cr CoSO4 dye &amp;#8594; Arvind 10M metres &amp;#8594; 97.0% purity &amp;#8594; &amp;#8594; Powder &amp;#8594; &amp;#8594; CoSO4Dye &amp;#8594; &amp;#8594; Textile' },
  { id: 'COS-0012', batchNo: 'COS-B2412', city: 'Visakhapatnam', manufacturer: 'Vizag Chemicals', grade: 'CoSO4 99% Submarine', application: 'GRSE Project 75I Battery Cooling', purityPercent: 99.0, specProp: 20.3, investmentCr: 940, status: 'Delayed', priority: 'Critical', origin: 'Vizag Chemicals Visakhapatnam (AP)', destination: 'GRSE Kolkata (WB)', shipDate: '2026-07-26', transitDays: 2, zone: 'East', remarks: 'CoSO4 99% submarine-grade for GRSE Project 75I submarine battery cooling Co-based magnetic fluid &amp;#8597; 20.3% Co &amp;#8597; &amp;#8377;940Cr for 30 tonnes &amp;#8597; India &amp;#8377;7,800Cr CoSO4 submarine &amp;#8597; GRSE 6 submarines &amp;#8597; 99.0% purity &amp;#8597; &amp;#8594; Fluid &amp;#8597; &amp;#8594; CoSO4Sub &amp;#8597; &amp;#8594; Naval' },
  { id: 'COS-0013', batchNo: 'COS-B2413', city: 'Bhopal', manufacturer: 'DRDO TBRL', grade: 'CoSO4 99.5% Missile', application: 'DRDO Nirbhay Cruise Engine', purityPercent: 99.5, specProp: 20.6, investmentCr: 860, status: 'In Transit', priority: 'Critical', origin: 'DRDO Chandipur (OD)', destination: 'BHEL Hyderabad (TG)', shipDate: '2026-07-27', transitDays: 3, zone: 'Central', remarks: 'CoSO4 99.5% missile-grade for DRDO Nirbhay cruise missile turbofan engine Co superalloy &amp;#8594; 20.6% Co &amp;#8594; &amp;#8377;860Cr for 40 tonnes &amp;#8594; India &amp;#8377;6,200Cr CoSO4 missile &amp;#8594; DRDO 100 missiles &amp;#8594; 99.5% purity &amp;#8594; &amp;#8594; Salt &amp;#8594; &amp;#8594; CoSO4Msl &amp;#8594; &amp;#8594; Defense' },
  { id: 'COS-0014', batchNo: 'COS-B2414', city: 'Rourkela', manufacturer: 'SAIL Chemicals', grade: 'CoSO4 94% General', application: 'SAIL Corrosion Inhibitor', purityPercent: 94.0, specProp: 18.5, investmentCr: 280, status: 'Delivered', priority: 'Low', origin: 'SAIL Rourkela (OD)', destination: 'SAIL Bhilai (CG)', shipDate: '2026-07-28', transitDays: 4, zone: 'East', remarks: 'CoSO4 94% general-grade for SAIL steel pipe internal cobalt corrosion inhibitor coating &amp;#8594; 18.5% Co &amp;#8594; &amp;#8377;280Cr for 120 tonnes &amp;#8594; India &amp;#8377;2,000Cr CoSO4 corrosion &amp;#8594; SAIL 1M pipes &amp;#8594; 94.0% purity &amp;#8594; &amp;#8594; Solution &amp;#8594; &amp;#8594; CoSO4Gen &amp;#8594; &amp;#8594; Steel' },
];

export default function CobaltSulphateLogisticsView() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterZone, setFilterZone] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Droplets },
    { id: 'registry', label: 'Registry', icon: Droplets },
    { id: 'analytics', label: 'Analytics', icon: Droplets },
    { id: 'insights', label: 'Insights', icon: Droplets },
  ];

  const filteredRecords = useMemo(() => {
    return cobaltsulphateRecords.filter((r) => {
      const matchSearch = searchTerm === '' ||
        r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.batchNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.grade.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.application.toLowerCase().includes(searchTerm.toLowerCase());
      const matchZone = filterZone === 'all' || r.zone === filterZone;
      const matchStatus = filterStatus === 'all' || r.status === filterStatus;
      return matchSearch && matchZone && matchStatus;
    });
  }, [searchTerm, filterZone, filterStatus]);

  const zones = useMemo(() => {
    const zMap: Record<string, number> = {};
    cobaltsulphateRecords.forEach((r) => { zMap[r.zone] = (zMap[r.zone] || 0) + 1; });
    return Object.entries(zMap).sort((a, b) => b[1] - a[1]);
  }, []);

  const kpiData = useMemo(() => {
    const total = cobaltsulphateRecords.reduce((s: number, r) => s + r.investmentCr, 0);
    const avgPurity = cobaltsulphateRecords.reduce((s: number, r) => s + r.purityPercent, 0) / cobaltsulphateRecords.length;
    const delayed = cobaltsulphateRecords.filter((r) => r.status === 'Delayed').length;
    const critical = cobaltsulphateRecords.filter((r) => r.priority === 'Critical').length;
    return { total, avgPurity: avgPurity.toFixed(2), delayed, critical };
  }, []);

  const statusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'bg-green-500/20 text-green-700 border-green-500/30';
      case 'In Transit': return 'bg-blue-500/20 text-blue-700 border-blue-500/30';
      case 'Delayed': return 'bg-red-500/20 text-red-700 border-red-500/30';
      case 'Processing': return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-700 border-gray-500/30';
    }
  };

  const priorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-500/20 text-red-700 border-red-500/30';
      case 'High': return 'bg-orange-500/20 text-orange-700 border-orange-500/30';
      case 'Medium': return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30';
      case 'Low': return 'bg-green-500/20 text-green-700 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-700 border-gray-500/30';
    }
  };

  const themeColor = '#0284c7';
  return (
    <div className="space-y-6 p-6">
      <PageHeader title="Cobalt Sulphate Logistics" description="Indian cobalt sulphate logistics supply chain tracking across 14 grades spanning steelmaking, foundry, defense, aerospace, power, automotive and infrastructure sectors" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-sky-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-sky-600">{kpiData.total.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground mt-1">Total Investment</div></CardContent></Card>
        <Card className="border-l-4 border-l-sky-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-sky-600">{kpiData.avgPurity}%</div><div className="text-xs text-muted-foreground mt-1">Avg Purity</div></CardContent></Card>
        <Card className="border-l-4 border-l-sky-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-sky-600">{kpiData.delayed}</div><div className="text-xs text-muted-foreground mt-1">Delayed Batches</div></CardContent></Card>
        <Card className="border-l-4 border-l-sky-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-sky-600">{kpiData.critical}</div><div className="text-xs text-muted-foreground mt-1">Critical Records</div></CardContent></Card>
      </div>
      <div className="flex flex-wrap gap-2 border-b pb-2">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 rounded-t-md text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-sky-500 text-white shadow-md' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
            {tab.label}
          </button>
        ))}
      </div>
      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-base">Zone Distribution</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">{zones.map(([zone, count]) => { const pct = (count as number / cobaltsulphateRecords.length) * 100; return <div key={zone} className="flex items-center gap-2"><span className="text-xs w-16 text-muted-foreground">{zone as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium w-8">{count as number}</span></div>; })}</div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Status Overview</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-2 gap-3">
              {['Delivered', 'In Transit', 'Delayed', 'Processing'].map((s) => { const c = cobaltsulphateRecords.filter((r) => r.status === s).length; return <div key={s} className={`text-center p-3 rounded-lg border ${statusColor(s)}`}><div className="text-lg font-bold">{c}</div><div className="text-xs">{s}</div></div>; })}
            </div>
          </CardContent></Card>
          <Card className="lg:col-span-2"><CardHeader><CardTitle className="text-base">Investment by Grade (Top 8)</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {cobaltsulphateRecords.slice(0, 8).map((r) => <div key={r.id} className="text-center p-3 rounded-lg border bg-muted/30"><div className="text-sm font-medium truncate">{r.grade}</div><div className="text-lg font-bold" style={{ color: themeColor }}>&#8377;{r.investmentCr}Cr</div><div className="text-xs text-muted-foreground">{r.application}</div></div>)}
            </div>
          </CardContent></Card>
        </div>
      )}
      {activeTab === 'registry' && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <input type="text" placeholder="Search ID, batch, city, grade..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="px-3 py-2 border rounded-md text-sm flex-1 min-w-[200px]" />
            <select value={filterZone} onChange={(e) => setFilterZone(e.target.value)} className="px-3 py-2 border rounded-md text-sm"><option value="all">All Zones</option>{zones.map(([z]) => <option key={z} value={z}>{z as string}</option>)}</select>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-3 py-2 border rounded-md text-sm"><option value="all">All Status</option>{['Delivered','In Transit','Delayed','Processing'].map((s) => <option key={s} value={s}>{s}</option>)}</select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {filteredRecords.map((record) => (
              <Card key={record.id} className={record.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}>
                <CardContent className="pt-4 pb-4">
                  <div className="flex justify-between items-start mb-2">
                    <div><span className="font-semibold text-sm">{record.id}</span><span className="text-xs text-muted-foreground ml-2">{record.batchNo}</span></div>
                    <div className="flex gap-1"><Badge variant="outline" className={statusColor(record.status)}>{record.status}</Badge><Badge variant="outline" className={priorityColor(record.priority)}>{record.priority}</Badge></div>
                  </div>
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between"><span className="text-muted-foreground">Grade:</span><span className="font-medium">{record.grade}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Application:</span><span className="font-medium">{record.application}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Purity:</span><span className="font-medium">{record.purityPercent}%</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Co Content (%)</span><span className="font-medium">{record.specProp}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Investment:</span><span className="font-medium" style={{ color: themeColor }}>&#8377;{record.investmentCr}Cr</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">City:</span><span className="font-medium">{record.city}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Route:</span><span className="font-medium text-xs">{record.origin} &#8594; {record.destination}</span></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-sm text-muted-foreground">Showing {filteredRecords.length} of {cobaltsulphateRecords.length} records</div>
        </div>
      )}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-base">Manufacturer Performance</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">
              {(() => { const mfrMap: Record<string, number> = {}; cobaltsulphateRecords.forEach((r) => { mfrMap[r.manufacturer] = (mfrMap[r.manufacturer] || 0) + r.investmentCr; }); return Object.entries(mfrMap).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([mfr, inv]) => { const pct = (inv as number / kpiData.total) * 100; return <div key={mfr} className="flex items-center gap-2"><span className="text-xs w-40 truncate">{mfr as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">&#8377;{inv as number}Cr</span></div>; }); })()}
            </div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Priority Distribution</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-2 gap-3">
              {['Critical', 'High', 'Medium', 'Low'].map((p) => { const c = cobaltsulphateRecords.filter((r) => r.priority === p).length; return <div key={p} className={`text-center p-3 rounded-lg border ${priorityColor(p)}`}><div className="text-lg font-bold">{c}</div><div className="text-xs">{p}</div></div>; })}
            </div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Investment by Zone</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">{(() => { const zInv: Record<string, number> = {}; cobaltsulphateRecords.forEach((r) => { zInv[r.zone] = (zInv[r.zone] || 0) + r.investmentCr; }); return Object.entries(zInv).sort((a, b) => b[1] - a[1]).map(([zone, inv]) => { const pct = (inv as number / kpiData.total) * 100; return <div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">&#8377;{inv as number}Cr</span></div>; }); })()}</div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Purity Distribution</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">
              {(() => { const ranges = { '99%+': 0, '95-98.9%': 0, '90-94.9%': 0, '<90%': 0 }; cobaltsulphateRecords.forEach((r) => { if (r.purityPercent >= 99) ranges['99%+']++; else if (r.purityPercent >= 95) ranges['95-98.9%']++; else if (r.purityPercent >= 90) ranges['90-94.9%']++; else ranges['<90%']++; }); return (Object.entries(ranges) as [string, number][]).filter(([, v]) => v > 0).map(([range, count]) => { const pct = (count / cobaltsulphateRecords.length) * 100; return <div key={range} className="flex items-center gap-2"><span className="text-xs w-24">{range}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">{count}</span></div>; }); })()}
            </div>
          </CardContent></Card>
        </div>
      )}
      {activeTab === 'insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-base">Supply Chain Intelligence</CardTitle></CardHeader><CardContent><div className="space-y-3 text-sm">
            <div className="p-3 rounded-lg border-l-4 border-l-sky-500 bg-sky-50/50"><div className="font-medium">Battery &amp; Energy Storage</div><div className="text-xs text-muted-foreground mt-1">Exide Li-Ion cathode &#8594; Mahindra NCM cell &#8594; &#8377;1,320Cr combined &#8594; EV battery critical mineral</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-sky-500 bg-sky-50/50"><div className="font-medium">Defense &amp; Naval Programme</div><div className="text-xs text-muted-foreground mt-1">BEL Tejas turbine &#8594; DRDO Nirbhay engine &#8594; GRSE submarine battery &#8594; &#8377;2,620Cr combined &#8594; strategic assets</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-sky-500 bg-sky-50/50"><div className="font-medium">Nuclear &amp; Power</div><div className="text-xs text-muted-foreground mt-1">IGCAR PFBR control rod &#8594; BHEL GT sensor &#8594; &#8377;1,620Cr combined &#8594; critical infrastructure</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-sky-500 bg-sky-50/50"><div className="font-medium">Monsoon Disruption Alert</div><div className="text-xs text-muted-foreground mt-1">COS-B2412 GRSE Project 75I submarine battery cooling delayed &#8594; monsoon Visakhapatnam &#8594; naval programme at risk</div></div>
          </div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Investment Landscape</CardTitle></CardHeader><CardContent><div className="space-y-3 text-sm">
            <div className="p-3 rounded-lg border-l-4 border-l-sky-500 bg-sky-50/50"><div className="font-medium">Total Portfolio: &#8377;8,760 Cr</div><div className="text-xs text-muted-foreground mt-1">Across 14 CoSO4 grades spanning battery, aerospace, pigment, hardmetal, catalyst, plating, agriculture, dye, nuclear, naval, missile sectors &#8594; avg purity 98.16%</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-sky-500 bg-sky-50/50"><div className="font-medium">Critical Priority: 7 Records</div><div className="text-xs text-muted-foreground mt-1">Exide battery &#8594; BEL Tejas &#8594; BHEL GT &#8594; IGCAR nuclear &#8594; GRSE submarine &#8594; DRDO Nirbhay &#8594; IOCL catalyst</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-sky-500 bg-sky-50/50"><div className="font-medium">Top Manufacturers</div><div className="text-xs text-muted-foreground mt-1">MIDHANI &#8594; DRDO &#8594; BHEL &#8594; Tata Steel &#8594; IRE lead strategic &#8594; Indian Rare Earths &#8594; Gujarat Chemicals drive commercial</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-sky-500 bg-sky-50/50"><div className="font-medium">Import Dependency Risk</div><div className="text-xs text-muted-foreground mt-1">Cobalt 90% imported from DRC/Congo &#8594; China controls 80% refining &#8594; Atmanirbhar cobalt critical &#8594; recycling key to supply security</div></div>
          </div></CardContent></Card>
        </div>
      )}
    </div>
  );
}
