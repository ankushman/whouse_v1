"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared';
import { MountainSnow } from 'lucide-react';

interface ManganeseSiliconRecord {
  id: string; batchNo: string; city: string; manufacturer: string; grade: string;
  application: string; purityPercent: number; siMnContent: number; investmentCr: number;
  status: string; priority: string; origin: string; destination: string;
  shipDate: string; transitDays: number; zone: string; remarks: string;
};

const manganesesiliconRecords: ManganeseSiliconRecord[] = [
  { id: 'MSI-0001', batchNo: 'MSI-B2401', city: 'Mumbai', manufacturer: 'MIDHANI', grade: 'FeMnSi 65/15 HC', application: 'SAIL Bhilai BOF Deoxidizer', purityPercent: 99.1, siMnContent: 15.2, investmentCr: 820, status: 'Delivered', priority: 'Critical', origin: 'MIDHANI Hyderabad (TG)', destination: 'SAIL Bhilai (CG)', shipDate: '2026-07-15', transitDays: 1, zone: 'West', remarks: 'High-carbon FeMnSi 65/15 for SAIL Bhilai basic oxygen furnace deoxidation &amp;#8594; 15.2% Si &amp;#8594; &amp;#8377;820Cr for 180 tonnes &amp;#8594; India &amp;#8377;5,400Cr MnSi deoxidizer &amp;#8594; SAIL 8 furnaces &amp;#8594; 99.1% purity &amp;#8594; &amp;#8594; Lumps &amp;#8594; &amp;#8594; FeMnSiHC &amp;#8594; &amp;#8594; Steel' },
  { id: 'MSI-0002', batchNo: 'MSI-B2402', city: 'Bengaluru', manufacturer: 'DRDO DMRL', grade: 'FeMnSi 68/18 LC', application: 'BEL LCA Tejas Mk2 Undercarriage Forging', purityPercent: 98.8, siMnContent: 18.0, investmentCr: 740, status: 'In Transit', priority: 'Critical', origin: 'DRDO Hyderabad (TG)', destination: 'BEL Bengaluru (KA)', shipDate: '2026-07-16', transitDays: 2, zone: 'South', remarks: 'Low-carbon FeMnSi 68/18 for BEL Tejas Mk2 main landing gear forging alloy &amp;#8594; 18% Si &amp;#8594; &amp;#8377;740Cr for 120 tonnes &amp;#8594; India &amp;#8377;5,200Cr MnSi aerospace &amp;#8594; BEL 40 aircraft &amp;#8594; 98.8% purity &amp;#8594; &amp;#8594; Billet &amp;#8594; &amp;#8594; FeMnSiLC &amp;#8594; &amp;#8594; Defense' },
  { id: 'MSI-0003', batchNo: 'MSI-B2403', city: 'Chennai', manufacturer: 'Tata Steel', grade: 'MnSi 75/65 Standard', application: 'JSW Steel Vijayanagar EAF Desulphur', purityPercent: 99.3, siMnContent: 65.0, investmentCr: 960, status: 'Delivered', priority: 'Critical', origin: 'Tata Steel Jamshedpur (JH)', destination: 'JSW Vijayanagar (KA)', shipDate: '2026-07-17', transitDays: 3, zone: 'South', remarks: 'Standard MnSi 75/65 for JSW Vijayanagar electric arc furnace desulphurization alloy &amp;#8594; 65% Mn &amp;#8594; &amp;#8377;960Cr for 220 tonnes &amp;#8594; India &amp;#8377;7,800Cr MnSi EAF &amp;#8594; JSW 12 furnaces &amp;#8594; 99.3% purity &amp;#8594; &amp;#8594; Briquette &amp;#8594; &amp;#8594; MnSi75 &amp;#8594; &amp;#8594; Steel' },
  { id: 'MSI-0004', batchNo: 'MSI-B2404', city: 'Hyderabad', manufacturer: 'Bharat Forge', grade: 'FeMnSi 60/14 Auto', application: 'Bharat Forge Crankshaft Steel', purityPercent: 98.5, siMnContent: 14.0, investmentCr: 480, status: 'Delivered', priority: 'High', origin: 'Bharat Forge Pune (MH)', destination: 'Bharat Forge Baramati (MH)', shipDate: '2026-07-18', transitDays: 4, zone: 'West', remarks: 'FeMnSi 60/14 automotive-grade for Bharat Forge crankshaft silicon-manganese steel &amp;#8594; 14% Si &amp;#8594; &amp;#8377;480Cr for 200 tonnes &amp;#8594; India &amp;#8377;3,200Cr MnSi auto &amp;#8594; Bharat Forge 2M crankshafts &amp;#8594; 98.5% purity &amp;#8594; &amp;#8594; Ingot &amp;#8594; &amp;#8594; FeMnSiAuto &amp;#8594; &amp;#8594; Automotive' },
  { id: 'MSI-0005', batchNo: 'MSI-B2405', city: 'Kolkata', manufacturer: 'Shyam Ferro Alloys', grade: 'MnSi 65/17 Foundry', application: 'L&amp;T Warship Propeller Casting', purityPercent: 98.2, siMnContent: 17.0, investmentCr: 680, status: 'In Transit', priority: 'High', origin: 'Shyam Ferro Raipur (CG)', destination: 'L&amp;T Kattupalli (TN)', shipDate: '2026-07-19', transitDays: 5, zone: 'East', remarks: 'MnSi 65/17 foundry-grade for L&amp;amp;T warship propeller manganese-silicon steel casting &amp;#8594; 17% Si &amp;#8594; &amp;#8377;680Cr for 160 tonnes &amp;#8594; India &amp;#8377;4,600Cr MnSi naval &amp;#8594; L&amp;amp;T 30 propellers &amp;#8594; 98.2% purity &amp;#8594; &amp;#8594; Casting &amp;#8594; &amp;#8594; MnSi65 &amp;#8594; &amp;#8594; Naval' },
  { id: 'MSI-0006', batchNo: 'MSI-B2406', city: 'Coimbatore', manufacturer: 'BHEL R&amp;D', grade: 'FeMnSi 70/16 BHEL', application: 'BHEL 800MW GT Blade Steel', purityPercent: 99.0, siMnContent: 16.0, investmentCr: 720, status: 'Delivered', priority: 'Critical', origin: 'BHEL Bhopal (MP)', destination: 'BHEL Hyderabad (TG)', shipDate: '2026-07-20', transitDays: 1, zone: 'South', remarks: 'FeMnSi 70/16 power-grade for BHEL 800MW gas turbine blade Mn-Si steel &amp;#8594; 16% Si &amp;#8594; &amp;#8377;720Cr for 95 tonnes &amp;#8594; India &amp;#8377;5,000Cr MnSi power &amp;#8594; BHEL 20 GTs &amp;#8594; 99.0% purity &amp;#8594; &amp;#8594; Bar &amp;#8594; &amp;#8594; FeMnSiBHEL &amp;#8594; &amp;#8594; Power' },
  { id: 'MSI-0007', batchNo: 'MSI-B2407', city: 'Pune', manufacturer: 'Mahindra Steel', grade: 'FeMnSi 62/13 EV', application: 'Mahindra XUV400 EV Frame', purityPercent: 98.7, siMnContent: 13.0, investmentCr: 420, status: 'Delivered', priority: 'Medium', origin: 'Mahindra Nashik (MH)', destination: 'Mahindra Pune (MH)', shipDate: '2026-07-21', transitDays: 2, zone: 'West', remarks: 'FeMnSi 62/13 EV-grade for Mahindra XUV400 electric vehicle chassis frame steel &amp;#8594; 13% Si &amp;#8594; &amp;#8377;420Cr for 140 tonnes &amp;#8594; India &amp;#8377;2,800Cr MnSi EV &amp;#8594; Mahindra 50K vehicles &amp;#8594; 98.7% purity &amp;#8594; &amp;#8594; Coil &amp;#8594; &amp;#8594; FeMnSiEV &amp;#8594; &amp;#8594; Automotive' },
  { id: 'MSI-0008', batchNo: 'MSI-B2408', city: 'Jaipur', manufacturer: 'Rajasthan Ferro Alloys', grade: 'MnSi 70/20 Rail', application: 'Indian Railways RCF Rail Wheel', purityPercent: 97.8, siMnContent: 20.0, investmentCr: 560, status: 'Delivered', priority: 'High', origin: 'Rajasthan Ferro Alloys Udaipur (RJ)', destination: 'RCF Kapurthala (PB)', shipDate: '2026-07-22', transitDays: 3, zone: 'West', remarks: 'MnSi 70/20 rail-grade for Indian Railways wheel factory rail wheel Mn-Si steel &amp;#8594; 20% Si &amp;#8594; &amp;#8377;560Cr for 180 tonnes &amp;#8594; India &amp;#8377;3,800Cr MnSi rail &amp;#8594; IR 200K wheels &amp;#8594; 97.8% purity &amp;#8594; &amp;#8594; Bloom &amp;#8594; &amp;#8594; MnSi70 &amp;#8594; &amp;#8594; Rail' },
  { id: 'MSI-0009', batchNo: 'MSI-B2409', city: 'Guwahati', manufacturer: 'Assam Ferro Alloys', grade: 'FeMnSi 65/15 General', application: 'Jio 5G Tower Girder', purityPercent: 98.4, siMnContent: 15.0, investmentCr: 380, status: 'In Transit', priority: 'Medium', origin: 'Assam Ferro Tezpur (AS)', destination: 'Jio Mumbai (MH)', shipDate: '2026-07-23', transitDays: 4, zone: 'East', remarks: 'FeMnSi 65/15 structural-grade for Reliance Jio 5G tower girder Mn-Si structural steel &amp;#8594; 15% Si &amp;#8594; &amp;#8377;380Cr for 120 tonnes &amp;#8594; India &amp;#8377;2,400Cr MnSi telecom &amp;#8594; Jio 100K towers &amp;#8594; 98.4% purity &amp;#8594; &amp;#8594; Section &amp;#8594; &amp;#8594; FeMnSiGen &amp;#8594; &amp;#8594; Telecom' },
  { id: 'MSI-0010', batchNo: 'MSI-B2410', city: 'Ahmedabad', manufacturer: 'Gujarat Ferro Alloys', grade: 'FeMnSi 72/22 Nuclear', application: 'IGCAR PFBR Pressure Vessel', purityPercent: 99.6, siMnContent: 22.0, investmentCr: 880, status: 'Delivered', priority: 'Critical', origin: 'Gujarat Ferro Ahmedabad (GJ)', destination: 'IGCAR Kalpakkam (TN)', shipDate: '2026-07-24', transitDays: 5, zone: 'West', remarks: 'FeMnSi 72/22 nuclear-grade for IGCAR Prototype Fast Breeder Reactor pressure vessel Mn-Si steel &amp;#8594; 22% Si &amp;#8594; &amp;#8377;880Cr for 55 tonnes &amp;#8594; India &amp;#8377;7,200Cr MnSi nuclear &amp;#8594; IGCAR 2 reactors &amp;#8594; 99.6% purity &amp;#8594; &amp;#8594; Plate &amp;#8594; &amp;#8594; FeMnSiNuc &amp;#8594; &amp;#8594; Nuclear' },
  { id: 'MSI-0011', batchNo: 'MSI-B2411', city: 'Lucknow', manufacturer: 'UP Ferro Alloys', grade: 'FeMnSi 60/12 Pipeline', application: 'Adani Gas Pipeline Weld', purityPercent: 98.0, siMnContent: 12.0, investmentCr: 460, status: 'Delivered', priority: 'Medium', origin: 'UP Ferro Kanpur (UP)', destination: 'Adani Mundra (GJ)', shipDate: '2026-07-25', transitDays: 1, zone: 'North', remarks: 'FeMnSi 60/12 pipeline-grade for Adani natural gas pipeline welding Mn-Si steel &amp;#8594; 12% Si &amp;#8594; &amp;#8377;460Cr for 130 tonnes &amp;#8594; India &amp;#8377;3,000Cr MnSi pipeline &amp;#8594; Adani 2,000 km &amp;#8594; 98.0% purity &amp;#8594; &amp;#8594; Wire &amp;#8594; &amp;#8594; FeMnSiPipe &amp;#8594; &amp;#8594; Oil &amp;amp; Gas' },
  { id: 'MSI-0012', batchNo: 'MSI-B2412', city: 'Visakhapatnam', manufacturer: 'Vizag Ferro Alloys', grade: 'FeMnSi 68/16 Submarine', application: 'GRSE Project 75I Submarine Hull', purityPercent: 99.4, siMnContent: 16.0, investmentCr: 940, status: 'Delayed', priority: 'Critical', origin: 'Vizag Ferro Visakhapatnam (AP)', destination: 'GRSE Kolkata (WB)', shipDate: '2026-07-26', transitDays: 2, zone: 'East', remarks: 'FeMnSi 68/16 submarine-grade for GRSE Project 75I submarine hull special Mn-Si steel &amp;#8594; 16% Si &amp;#8594; &amp;#8377;940Cr for 70 tonnes &amp;#8597; India &amp;#8377;7,600Cr MnSi submarine &amp;#8594; GRSE 6 submarines &amp;#8594; 99.4% purity &amp;#8597; &amp;#8594; Slab &amp;#8594; &amp;#8594; FeMnSiSub &amp;#8594; &amp;#8594; Naval' },
  { id: 'MSI-0013', batchNo: 'MSI-B2413', city: 'Bhopal', manufacturer: 'DRDO TBRL', grade: 'FeMnSi 65/15 Missile', application: 'DRDO BrahMos Missile Airframe', purityPercent: 99.2, siMnContent: 15.0, investmentCr: 860, status: 'In Transit', priority: 'Critical', origin: 'DRDO Chandipur (OD)', destination: 'BHEL Hyderabad (TG)', shipDate: '2026-07-27', transitDays: 3, zone: 'Central', remarks: 'FeMnSi 65/15 missile-grade for DRDO BrahMos Mk2 missile airframe Mn-Si steel &amp;#8594; 15% Si &amp;#8594; &amp;#8377;860Cr for 80 tonnes &amp;#8594; India &amp;#8377;6,400Cr MnSi missile &amp;#8594; DRDO 200 missiles &amp;#8594; 99.2% purity &amp;#8594; &amp;#8594; Sheet &amp;#8594; &amp;#8594; FeMnSiMsl &amp;#8594; &amp;#8594; Defense' },
  { id: 'MSI-0014', batchNo: 'MSI-B2414', city: 'Rourkela', manufacturer: 'SAIL Ferro Alloys', grade: 'FeMnSi 58/11 Rebar', application: 'Tata Steel Tiscon Rebar', purityPercent: 97.5, siMnContent: 11.0, investmentCr: 340, status: 'Delivered', priority: 'Low', origin: 'SAIL Rourkela (OD)', destination: 'Tata Steel Jamshedpur (JH)', shipDate: '2026-07-28', transitDays: 4, zone: 'East', remarks: 'FeMnSi 58/11 rebar-grade for Tata Tiscon TMT rebar Mn-Si reinforcement steel &amp;#8594; 11% Si &amp;#8594; &amp;#8377;340Cr for 250 tonnes &amp;#8594; India &amp;#8377;2,200Cr MnSi rebar &amp;#8594; Tata 1M tonnes &amp;#8594; 97.5% purity &amp;#8594; &amp;#8594; Rod &amp;#8594; &amp;#8594; FeMnSiRebar &amp;#8594; &amp;#8594; Construction' },
];

export default function ManganeseSiliconLogisticsView() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterZone, setFilterZone] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: MountainSnow },
    { id: 'registry', label: 'Registry', icon: MountainSnow },
    { id: 'analytics', label: 'Analytics', icon: MountainSnow },
    { id: 'insights', label: 'Insights', icon: MountainSnow },
  ];

  const filteredRecords = useMemo(() => {
    return manganesesiliconRecords.filter((r) => {
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
    manganesesiliconRecords.forEach((r) => { zMap[r.zone] = (zMap[r.zone] || 0) + 1; });
    return Object.entries(zMap).sort((a, b) => b[1] - a[1]);
  }, []);

  const kpiData = useMemo(() => {
    const total = manganesesiliconRecords.reduce((s: number, r) => s + r.investmentCr, 0);
    const avgPurity = manganesesiliconRecords.reduce((s: number, r) => s + r.purityPercent, 0) / manganesesiliconRecords.length;
    const delayed = manganesesiliconRecords.filter((r) => r.status === 'Delayed').length;
    const critical = manganesesiliconRecords.filter((r) => r.priority === 'Critical').length;
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

  const themeColor = '#d97706';
  return (
    <div className="space-y-6 p-6">
      <PageHeader title="Manganese Silicon Logistics" description="Indian manganese silicon logistics supply chain tracking across 14 grades spanning steelmaking, foundry, defense, automotive, aerospace and infrastructure sectors" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-amber-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-amber-600">{kpiData.total.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground mt-1">Total Investment</div></CardContent></Card>
        <Card className="border-l-4 border-l-amber-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-amber-600">{kpiData.avgPurity}%</div><div className="text-xs text-muted-foreground mt-1">Avg Purity</div></CardContent></Card>
        <Card className="border-l-4 border-l-amber-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-amber-600">{kpiData.delayed}</div><div className="text-xs text-muted-foreground mt-1">Delayed Batches</div></CardContent></Card>
        <Card className="border-l-4 border-l-amber-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-amber-600">{kpiData.critical}</div><div className="text-xs text-muted-foreground mt-1">Critical Records</div></CardContent></Card>
      </div>
      <div className="flex flex-wrap gap-2 border-b pb-2">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 rounded-t-md text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-amber-500 text-white shadow-md' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
            {tab.label}
          </button>
        ))}
      </div>
      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-base">Zone Distribution</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">{zones.map(([zone, count]) => { const pct = (count as number / manganesesiliconRecords.length) * 100; return <div key={zone} className="flex items-center gap-2"><span className="text-xs w-16 text-muted-foreground">{zone as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium w-8">{count as number}</span></div>; })}</div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Status Overview</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-2 gap-3">
              {['Delivered', 'In Transit', 'Delayed', 'Processing'].map((s) => { const c = manganesesiliconRecords.filter((r) => r.status === s).length; return <div key={s} className={`text-center p-3 rounded-lg border ${statusColor(s)}`}><div className="text-lg font-bold">{c}</div><div className="text-xs">{s}</div></div>; })}
            </div>
          </CardContent></Card>
          <Card className="lg:col-span-2"><CardHeader><CardTitle className="text-base">Investment by Grade (Top 8)</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {manganesesiliconRecords.slice(0, 8).map((r) => <div key={r.id} className="text-center p-3 rounded-lg border bg-muted/30"><div className="text-sm font-medium truncate">{r.grade}</div><div className="text-lg font-bold" style={{ color: themeColor }}>&#8377;{r.investmentCr}Cr</div><div className="text-xs text-muted-foreground">{r.application}</div></div>)}
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
                    <div className="flex justify-between"><span className="text-muted-foreground">Si Content</span><span className="font-medium">{record.siMnContent}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Investment:</span><span className="font-medium" style={{ color: themeColor }}>&#8377;{record.investmentCr}Cr</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">City:</span><span className="font-medium">{record.city}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Route:</span><span className="font-medium text-xs">{record.origin} &#8594; {record.destination}</span></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-sm text-muted-foreground">Showing {filteredRecords.length} of {manganesesiliconRecords.length} records</div>
        </div>
      )}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-base">Manufacturer Performance</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">
              {(() => { const mfrMap: Record<string, number> = {}; manganesesiliconRecords.forEach((r) => { mfrMap[r.manufacturer] = (mfrMap[r.manufacturer] || 0) + r.investmentCr; }); return Object.entries(mfrMap).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([mfr, inv]) => { const pct = (inv as number / kpiData.total) * 100; return <div key={mfr} className="flex items-center gap-2"><span className="text-xs w-40 truncate">{mfr as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">&#8377;{inv as number}Cr</span></div>; }); })()}
            </div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Priority Distribution</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-2 gap-3">
              {['Critical', 'High', 'Medium', 'Low'].map((p) => { const c = manganesesiliconRecords.filter((r) => r.priority === p).length; return <div key={p} className={`text-center p-3 rounded-lg border ${priorityColor(p)}`}><div className="text-lg font-bold">{c}</div><div className="text-xs">{p}</div></div>; })}
            </div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Investment by Zone</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">{(() => { const zInv: Record<string, number> = {}; manganesesiliconRecords.forEach((r) => { zInv[r.zone] = (zInv[r.zone] || 0) + r.investmentCr; }); return Object.entries(zInv).sort((a, b) => b[1] - a[1]).map(([zone, inv]) => { const pct = (inv as number / kpiData.total) * 100; return <div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">&#8377;{inv as number}Cr</span></div>; }); })()}</div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Purity Distribution</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">
              {(() => { const ranges = { '99%+': 0, '95-98.9%': 0, '90-94.9%': 0, '<90%': 0 }; manganesesiliconRecords.forEach((r) => { if (r.purityPercent >= 99) ranges['99%+']++; else if (r.purityPercent >= 95) ranges['95-98.9%']++; else if (r.purityPercent >= 90) ranges['90-94.9%']++; else ranges['<90%']++; }); return (Object.entries(ranges) as [string, number][]).filter(([, v]) => v > 0).map(([range, count]) => { const pct = (count / manganesesiliconRecords.length) * 100; return <div key={range} className="flex items-center gap-2"><span className="text-xs w-24">{range}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">{count}</span></div>; }); })()}
            </div>
          </CardContent></Card>
        </div>
      )}
      {activeTab === 'insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-base">Supply Chain Intelligence</CardTitle></CardHeader><CardContent><div className="space-y-3 text-sm">
            <div className="p-3 rounded-lg border-l-4 border-l-amber-500 bg-amber-50/50"><div className="font-medium">Steelmaking Dominance</div><div className="text-xs text-muted-foreground mt-1">SAIL BOF deoxidizer &#8594; JSW EAF desulphurization &#8594; Tata Tiscon rebar &#8594; &#8377;2,120Cr combined &#8594; highest volume segment</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-amber-500 bg-amber-50/50"><div className="font-medium">Defense &amp; Naval Programme</div><div className="text-xs text-muted-foreground mt-1">BEL Tejas undercarriage &#8594; GRSE submarine hull &#8594; DRDO BrahMos airframe &#8594; &#8377;2,540Cr combined &#8594; strategic national assets</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-amber-500 bg-amber-50/50"><div className="font-medium">Power &amp; Nuclear</div><div className="text-xs text-muted-foreground mt-1">BHEL 800MW GT blade &#8594; IGCAR PFBR pressure vessel &#8594; &#8377;1,600Cr combined &#8594; critical infrastructure backbone</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-amber-500 bg-amber-50/50"><div className="font-medium">Monsoon Disruption Alert</div><div className="text-xs text-muted-foreground mt-1">MSI-B2412 GRSE Project 75I submarine hull delayed &#8594; monsoon Visakhapatnam port congestion &#8594; naval programme timeline at risk</div></div>
          </div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Investment Landscape</CardTitle></CardHeader><CardContent><div className="space-y-3 text-sm">
            <div className="p-3 rounded-lg border-l-4 border-l-amber-500 bg-amber-50/50"><div className="font-medium">Total Portfolio: &#8377;9,200 Cr</div><div className="text-xs text-muted-foreground mt-1">Across 14 Mn-Si grades spanning steel, defense, nuclear, naval, rail, telecom, EV, pipeline and construction &#8594; avg purity 98.83%</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-amber-500 bg-amber-50/50"><div className="font-medium">Critical Priority: 7 Records</div><div className="text-xs text-muted-foreground mt-1">SAIL BOF &#8594; BEL Tejas &#8594; JSW EAF &#8594; BHEL GT &#8594; IGCAR nuclear &#8594; GRSE submarine &#8594; DRDO missile</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-amber-500 bg-amber-50/50"><div className="font-medium">Top Manufacturers</div><div className="text-xs text-muted-foreground mt-1">MIDHANI &#8594; DRDO &#8594; BHEL &#8594; Tata Steel &#8594; Bharat Forge lead strategic demand &#8594; Shyam Ferro &#8594; Gujarat Ferro drive commercial</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-amber-500 bg-amber-50/50"><div className="font-medium">Regional Concentration</div><div className="text-xs text-muted-foreground mt-1">South zone leads with Bengaluru &#8594; Chennai &#8594; Coimbatore &#8594; West zone Pune &#8594; Ahmedabad &#8594; East zone emerging Visakhapatnam</div></div>
          </div></CardContent></Card>
        </div>
      )}
    </div>
  );
}
