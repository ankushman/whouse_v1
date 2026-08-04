"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared';
import { Atom } from 'lucide-react';

interface LithiumHydroxideRecord {
  id: string; batchNo: string; city: string; manufacturer: string; lhGrade: string;
  application: string; purityPercent: number; purityAssay: number; investmentCr: number;
  status: string; priority: string; origin: string; destination: string;
  shipDate: string; transitDays: number; zone: string; remarks: string;
};

const lithiumHydroxideRecords: LithiumHydroxideRecord[] = [
  { id: 'LH-0001', batchNo: 'LH-B2401', city: 'Mumbai', manufacturer: 'Tata Chemicals', lhGrade: 'LiOH Battery Grade 56.5%', application: 'Mahindra XUV400 EV Cell', purityPercent: 99.4, purityAssay: 56.5, investmentCr: 860, status: 'Delivered', priority: 'Critical', origin: 'Tata Chemicals Mumbai (MH)', destination: 'Mahindra Pune (MH)', shipDate: '2026-07-15', transitDays: 1, zone: 'West', remarks: 'Battery-grade lithium hydroxide monohydrate for Mahindra XUV400 NMC 811 cathode precursor synthesis &#8594; 56.5% LiOH &#8594; &#8377;860Cr for 4,000 tonnes &#8594; India &#8377;6,400Cr LiOH &#8594; Mahindra 80K vehicles &#8594; 56.5% &#8594; &#8594; Powder &#8594; &#8594; LiOH&#183;H2O &#8594; &#8594; EV' },
  { id: 'LH-0002', batchNo: 'LH-B2402', city: 'Bengaluru', manufacturer: 'DRDO DMRL', lhGrade: 'LiOH Ultra Pure 57%', application: 'ISRO Gaganyaan Li-Ion Pack', purityPercent: 99.8, purityAssay: 57.0, investmentCr: 940, status: 'In Transit', priority: 'Critical', origin: 'DRDO Hyderabad (TG)', destination: 'ISRO Bengaluru (KA)', shipDate: '2026-07-16', transitDays: 2, zone: 'South', remarks: 'Ultra-pure lithium hydroxide for ISRO Gaganyaan crew module lithium-ion battery electrolyte preparation &#8594; 57% LiOH &#8594; &#8377;940Cr for 2,000 tonnes &#8594; India &#8377;7,800Cr LiOH space &#8594; ISRO 6 missions &#8594; 57.0% &#8594; &#8594; Crystal &#8594; &#8594; LiOH UP &#8594; &#8594; Space' },
  { id: 'LH-0003', batchNo: 'LH-B2403', city: 'Chennai', manufacturer: 'Exide Industries', lhGrade: 'LiOH Industrial Grade 55%', application: 'Exide XUV400 Battery Pack', purityPercent: 98.6, purityAssay: 55.0, investmentCr: 640, status: 'Delivered', priority: 'High', origin: 'Exide Kolkata (WB)', destination: 'Exide Chennai (TN)', shipDate: '2026-07-17', transitDays: 3, zone: 'South', remarks: 'Industrial-grade lithium hydroxide for Exide Industries EV battery module assembly and electrolyte &#8594; 55% LiOH &#8594; &#8377;640Cr for 6,000 tonnes &#8594; India &#8377;4,200Cr LiOH battery &#8594; Exide 100K packs &#8594; 55.0% &#8594; &#8594; Powder &#8594; &#8594; LiOH IND &#8594; &#8594; EV' },
  { id: 'LH-0004', batchNo: 'LH-B2404', city: 'Hyderabad', manufacturer: 'Bharat Lithium', lhGrade: 'LiOH Grease Grade 56%', application: 'Bharat Forge EV Bearing', purityPercent: 99.0, purityAssay: 56.0, investmentCr: 420, status: 'Delivered', priority: 'High', origin: 'Bharat Lithium Hyderabad (TG)', destination: 'Bharat Forge Pune (MH)', shipDate: '2026-07-18', transitDays: 4, zone: 'South', remarks: 'Grease-grade lithium hydroxide for Bharat Forge EV motor bearing lithium grease saponification &#8594; 56% LiOH &#8594; &#8377;420Cr for 3,000 tonnes &#8594; India &#8377;2,800Cr LiOH grease &#8594; Bharat Forge 5M bearings &#8594; 56.0% &#8594; &#8594; Powder &#8594; &#8594; LiOH GR &#8594; &#8594; Auto' },
  { id: 'LH-0005', batchNo: 'LH-B2405', city: 'Kolkata', manufacturer: 'Hindustan Copper', lhGrade: 'LiOH Pharma Grade 56.5%', application: 'Sun Pharma Mood Stabilizer', purityPercent: 99.6, purityAssay: 56.5, investmentCr: 560, status: 'In Transit', priority: 'High', origin: 'HCL Kolkata (WB)', destination: 'Sun Pharma Vadodara (GJ)', shipDate: '2026-07-19', transitDays: 5, zone: 'East', remarks: 'Pharma-grade lithium hydroxide for Sun Pharma lithium carbonate and bipolar mood stabilizer API &#8594; 56.5% LiOH &#8594; &#8377;560Cr for 1,500 tonnes &#8594; India &#8377;3,800Cr LiOH pharma &#8594; Sun Pharma 200M doses &#8594; 56.5% &#8594; &#8594; Powder &#8594; &#8594; LiOH PH &#8594; &#8594; Pharma' },
  { id: 'LH-0006', batchNo: 'LH-B2406', city: 'Coimbatore', manufacturer: 'L&amp;T Battery', lhGrade: 'LiOH Cathode Grade 56.5%', application: 'L&amp;T 5G Battery Energy Storage', purityPercent: 99.2, purityAssay: 56.5, investmentCr: 720, status: 'Delivered', priority: 'Critical', origin: 'L&amp;T Mumbai (MH)', destination: 'L&amp;T Chennai (TN)', shipDate: '2026-07-20', transitDays: 1, zone: 'South', remarks: 'Cathode-grade lithium hydroxide for L&amp;T 5G tower LiFePO4 battery energy storage system &#8594; 56.5% LiOH &#8594; &#8377;720Cr for 3,500 tonnes &#8594; India &#8377;5,200Cr LiOH BESS &#8594; L&amp;T 10K towers &#8594; 56.5% &#8594; &#8594; Powder &#8594; &#8594; LiOH CATH &#8594; &#8594; Telecom' },
  { id: 'LH-0007', batchNo: 'LH-B2407', city: 'Pune', manufacturer: 'Godrej Lubricants', lhGrade: 'LiOH Lubricant Grade 55%', application: 'Godrej Li Grease', purityPercent: 98.4, purityAssay: 55.0, investmentCr: 320, status: 'Delivered', priority: 'Medium', origin: 'Godrej Mumbai (MH)', destination: 'Godrej Pune (MH)', shipDate: '2026-07-21', transitDays: 2, zone: 'West', remarks: 'Lubricant-grade lithium hydroxide for Godrej multi-purpose lithium 12-hydroxy stearate grease &#8594; 55% LiOH &#8594; &#8377;320Cr for 4,000 tonnes &#8594; India &#8377;2,000Cr LiOH lubricant &#8594; Godrej 20M kg grease &#8594; 55.0% &#8594; &#8594; Powder &#8594; &#8594; LiOH LUB &#8594; &#8594; Industrial' },
  { id: 'LH-0008', batchNo: 'LH-B2408', city: 'Jaipur', manufacturer: 'Rajasthan Lithium', lhGrade: 'LiOH Solar Grade 56%', application: 'Adani Solar Cell Electrolyte', purityPercent: 99.3, purityAssay: 56.0, investmentCr: 480, status: 'Delivered', priority: 'Medium', origin: 'Rajasthan Lithium Jodhpur (RJ)', destination: 'Adani Mundra (GJ)', shipDate: '2026-07-22', transitDays: 3, zone: 'West', remarks: 'Solar-grade lithium hydroxide for Adani solar cell manufacturing lithium silicate and glass etchant &#8594; 56% LiOH &#8594; &#8377;480Cr for 2,000 tonnes &#8594; India &#8377;3,200Cr LiOH solar &#8594; Adani 10GW cells &#8594; 56.0% &#8594; &#8594; Crystal &#8594; &#8594; LiOH SOL &#8594; &#8594; Solar' },
  { id: 'LH-0009', batchNo: 'LH-B2409', city: 'Guwahati', manufacturer: 'Assam Lithium', lhGrade: 'LiOH Ceramics Grade 56.5%', application: 'BEL Glass-Ceramic Substrate', purityPercent: 99.1, purityAssay: 56.5, investmentCr: 520, status: 'In Transit', priority: 'High', origin: 'Assam Lithium Tezpur (AS)', destination: 'BEL Bengaluru (KA)', shipDate: '2026-07-23', transitDays: 4, zone: 'East', remarks: 'Ceramics-grade lithium hydroxide for BEL radar glass-ceramic substrate lithium aluminosilicate &#8594; 56.5% LiOH &#8594; &#8377;520Cr for 1,200 tonnes &#8594; India &#8377;3,400Cr LiOH ceramic &#8594; BEL 50 radars &#8594; 56.5% &#8594; &#8594; Powder &#8594; &#8594; LiOH CER &#8594; &#8594; Defense' },
  { id: 'LH-0010', batchNo: 'LH-B2410', city: 'Ahmedabad', manufacturer: 'Gujarat Lithium', lhGrade: 'LiOH Nuclear Grade 57%', application: 'IGCAR PFBR Coolant Additive', purityPercent: 99.7, purityAssay: 57.0, investmentCr: 880, status: 'Delivered', priority: 'Critical', origin: 'Gujarat Lithium Ahmedabad (GJ)', destination: 'IGCAR Kalpakkam (TN)', shipDate: '2026-07-24', transitDays: 5, zone: 'West', remarks: 'Nuclear-grade lithium hydroxide for IGCAR Prototype Fast Breeder Reactor coolant pH control &#8594; 57% LiOH &#8594; &#8377;880Cr for 800 tonnes &#8594; India &#8377;7,200Cr LiOH nuclear &#8594; IGCAR 2 reactors &#8594; 57.0% &#8594; &#8594; Crystal &#8594; &#8594; LiOH NUC &#8594; &#8594; Nuclear' },
  { id: 'LH-0011', batchNo: 'LH-B2411', city: 'Lucknow', manufacturer: 'UP Lithium', lhGrade: 'LiOH Carbonation Grade 56%', application: 'Tata Steel CO2 Capture', purityPercent: 98.8, purityAssay: 56.0, investmentCr: 440, status: 'Delivered', priority: 'Medium', origin: 'UP Lithium Kanpur (UP)', destination: 'Tata Steel Jamshedpur (JH)', shipDate: '2026-07-25', transitDays: 1, zone: 'North', remarks: 'Carbonation-grade lithium hydroxide for Tata Steel blast furnace CO2 capture lithium carbonate &#8594; 56% LiOH &#8594; &#8377;440Cr for 3,000 tonnes &#8594; India &#8377;2,800Cr LiOH carbon &#8594; Tata 4 furnaces &#8594; 56.0% &#8594; &#8594; Solution &#8594; &#8594; LiOH CAR &#8594; &#8594; Steel' },
  { id: 'LH-0012', batchNo: 'LH-B2412', city: 'Visakhapatnam', manufacturer: 'Vizag Lithium', lhGrade: 'LiOH Submarine Grade 57%', application: 'GRSE Project 75I Battery', purityPercent: 99.5, purityAssay: 57.0, investmentCr: 940, status: 'Delayed', priority: 'Critical', origin: 'Vizag Lithium Visakhapatnam (AP)', destination: 'GRSE Kolkata (WB)', shipDate: '2026-07-26', transitDays: 2, zone: 'East', remarks: 'Submarine-grade ultra-pure lithium hydroxide for GRSE Project 75I submarine lead-acid battery electrolyte additive &#8594; 57% LiOH &#8597; India &#8377;7,600Cr LiOH naval &#8594; GRSE 6 submarines &#8597; 57.0% &#8597; &#8594; Crystal &#8594; &#8594; LiOH SUB &#8594; &#8594; Naval' },
  { id: 'LH-0013', batchNo: 'LH-B2413', city: 'Bhopal', manufacturer: 'BHEL Battery Div', lhGrade: 'LiOH Grid Grade 56.5%', application: 'BHEL Inverter Battery', purityPercent: 99.0, purityAssay: 56.5, investmentCr: 620, status: 'In Transit', priority: 'High', origin: 'BHEL Bhopal (MP)', destination: 'BHEL Hyderabad (TG)', shipDate: '2026-07-27', transitDays: 3, zone: 'Central', remarks: 'Grid-grade lithium hydroxide for BHEL solar inverter and grid-scale LiFePO4 battery module &#8594; 56.5% LiOH &#8594; &#8377;620Cr for 2,500 tonnes &#8594; India &#8377;4,200Cr LiOH grid &#8594; BHEL 20 MWh &#8594; 56.5% &#8594; &#8594; Powder &#8594; &#8594; LiOH GRID &#8594; &#8594; Power' },
  { id: 'LH-0014', batchNo: 'LH-B2414', city: 'Rourkela', manufacturer: 'SAIL Lithium', lhGrade: 'LiOH Mining Grade 55%', application: 'Coal India Dust Suppress', purityPercent: 97.6, purityAssay: 55.0, investmentCr: 340, status: 'Delivered', priority: 'Medium', origin: 'SAIL Rourkela (OD)', destination: 'Coal India Ranchi (JH)', shipDate: '2026-07-28', transitDays: 4, zone: 'East', remarks: 'Mining-grade lithium hydroxide for Coal India underground mine dust suppressant and coal desulfurization &#8594; 55% LiOH &#8594; &#8377;340Cr for 5,000 tonnes &#8594; India &#8377;2,200Cr LiOH mining &#8594; CIL 40 mines &#8594; 55.0% &#8594; &#8594; Solution &#8594; &#8594; LiOH MIN &#8594; &#8594; Mining' },
];

export default function LithiumHydroxideLogisticsView() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterZone, setFilterZone] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Atom },
    { id: 'registry', label: 'Registry', icon: Atom },
    { id: 'analytics', label: 'Analytics', icon: Atom },
    { id: 'insights', label: 'Insights', icon: Atom },
  ];

  const filteredRecords = useMemo(() => {
    return lithiumHydroxideRecords.filter((r) => {
      const matchSearch = searchTerm === '' ||
        r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.batchNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.lhGrade.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.application.toLowerCase().includes(searchTerm.toLowerCase());
      const matchZone = filterZone === 'all' || r.zone === filterZone;
      const matchStatus = filterStatus === 'all' || r.status === filterStatus;
      return matchSearch && matchZone && matchStatus;
    });
  }, [searchTerm, filterZone, filterStatus]);

  const zones = useMemo(() => {
    const zMap: Record<string, number> = {};
    lithiumHydroxideRecords.forEach((r) => { zMap[r.zone] = (zMap[r.zone] || 0) + 1; });
    return Object.entries(zMap).sort((a, b) => b[1] - a[1]);
  }, []);

  const kpiData = useMemo(() => {
    const total = lithiumHydroxideRecords.reduce((s: number, r) => s + r.investmentCr, 0);
    const avgPurity = lithiumHydroxideRecords.reduce((s: number, r) => s + r.purityPercent, 0) / lithiumHydroxideRecords.length;
    const delayed = lithiumHydroxideRecords.filter((r) => r.status === 'Delayed').length;
    const critical = lithiumHydroxideRecords.filter((r) => r.priority === 'Critical').length;
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

  const themeColor = '#dc2626';
  return (
    <div className="space-y-6 p-6">
      <PageHeader title="Lithium Hydroxide Logistics" description="Indian lithium hydroxide (LiOH&#183;H2O) EV battery cathode, space, nuclear, pharma, grease and solar supply chain tracking across 14 grades" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-red-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-red-600">{kpiData.total.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground mt-1">Total Investment</div></CardContent></Card>
        <Card className="border-l-4 border-l-red-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-red-600">{kpiData.avgPurity}%</div><div className="text-xs text-muted-foreground mt-1">Avg Purity</div></CardContent></Card>
        <Card className="border-l-4 border-l-red-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-red-600">{kpiData.delayed}</div><div className="text-xs text-muted-foreground mt-1">Delayed Batches</div></CardContent></Card>
        <Card className="border-l-4 border-l-red-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-red-600">{kpiData.critical}</div><div className="text-xs text-muted-foreground mt-1">Critical Records</div></CardContent></Card>
      </div>
      <div className="flex flex-wrap gap-2 border-b pb-2">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 rounded-t-md text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-red-500 text-white shadow-md' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
            {tab.label}
          </button>
        ))}
      </div>
      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-base">Zone Distribution</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">{zones.map(([zone, count]) => { const pct = (count as number / lithiumHydroxideRecords.length) * 100; return <div key={zone} className="flex items-center gap-2"><span className="text-xs w-16 text-muted-foreground">{zone as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium w-8">{count as number}</span></div>; })}</div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Status Overview</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-2 gap-3">
              {['Delivered', 'In Transit', 'Delayed', 'Processing'].map((s) => { const c = lithiumHydroxideRecords.filter((r) => r.status === s).length; return <div key={s} className={`text-center p-3 rounded-lg border ${statusColor(s)}`}><div className="text-lg font-bold">{c}</div><div className="text-xs">{s}</div></div>; })}
            </div>
          </CardContent></Card>
          <Card className="lg:col-span-2"><CardHeader><CardTitle className="text-base">Investment by Grade (Top 8)</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {lithiumHydroxideRecords.slice(0, 8).map((r) => <div key={r.id} className="text-center p-3 rounded-lg border bg-muted/30"><div className="text-sm font-medium truncate">{r.lhGrade}</div><div className="text-lg font-bold" style={{ color: themeColor }}>&#8377;{r.investmentCr}Cr</div><div className="text-xs text-muted-foreground">{r.application}</div></div>)}
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
                    <div className="flex justify-between"><span className="text-muted-foreground">Grade:</span><span className="font-medium">{record.lhGrade}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Application:</span><span className="font-medium">{record.application}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Purity:</span><span className="font-medium">{record.purityPercent}%</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Assay:</span><span className="font-medium">{record.purityAssay} Assay</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Investment:</span><span className="font-medium" style={{ color: themeColor }}>&#8377;{record.investmentCr}Cr</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">City:</span><span className="font-medium">{record.city}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Route:</span><span className="font-medium text-xs">{record.origin} &#8594; {record.destination}</span></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-sm text-muted-foreground">Showing {filteredRecords.length} of {lithiumHydroxideRecords.length} records</div>
        </div>
      )}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-base">Manufacturer Performance</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">
              {(() => { const mfrMap: Record<string, number> = {}; lithiumHydroxideRecords.forEach((r) => { mfrMap[r.manufacturer] = (mfrMap[r.manufacturer] || 0) + r.investmentCr; }); return Object.entries(mfrMap).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([mfr, inv]) => { const pct = (inv as number / kpiData.total) * 100; return <div key={mfr} className="flex items-center gap-2"><span className="text-xs w-40 truncate">{mfr as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">&#8377;{inv as number}Cr</span></div>; }); })()}
            </div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Priority Distribution</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-2 gap-3">
              {['Critical', 'High', 'Medium', 'Low'].map((p) => { const c = lithiumHydroxideRecords.filter((r) => r.priority === p).length; return <div key={p} className={`text-center p-3 rounded-lg border ${priorityColor(p)}`}><div className="text-lg font-bold">{c}</div><div className="text-xs">{p}</div></div>; })}
            </div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Investment by Zone</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">{(() => { const zInv: Record<string, number> = {}; lithiumHydroxideRecords.forEach((r) => { zInv[r.zone] = (zInv[r.zone] || 0) + r.investmentCr; }); return Object.entries(zInv).sort((a, b) => b[1] - a[1]).map(([zone, inv]) => { const pct = (inv as number / kpiData.total) * 100; return <div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">&#8377;{inv as number}Cr</span></div>; }); })()}</div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Purity Distribution</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">
              {(() => { const ranges = { '99%+': 0, '95-98.9%': 0, '90-94.9%': 0, '<90%': 0 }; lithiumHydroxideRecords.forEach((r) => { if (r.purityPercent >= 99) ranges['99%+']++; else if (r.purityPercent >= 95) ranges['95-98.9%']++; else if (r.purityPercent >= 90) ranges['90-94.9%']++; else ranges['<90%']++; }); return (Object.entries(ranges) as [string, number][]).filter(([, v]) => v > 0).map(([range, count]) => { const pct = (count / lithiumHydroxideRecords.length) * 100; return <div key={range} className="flex items-center gap-2"><span className="text-xs w-24">{range}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">{count}</span></div>; }); })()}
            </div>
          </CardContent></Card>
        </div>
      )}
      {activeTab === 'insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-base">Supply Chain Intelligence</CardTitle></CardHeader><CardContent><div className="space-y-3 text-sm">
            <div className="p-3 rounded-lg border-l-4 border-l-red-500 bg-red-50/50"><div className="font-medium">EV Battery Cathode Dominance</div><div className="text-xs text-muted-foreground mt-1">Mahindra XUV400 &#8594; Exide XUV400 &#8594; L&amp;T 5G BESS driving &#8594; &#8377;2,220Cr combined &#8594; NMC 811 high-nickel cathode push</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-red-500 bg-red-50/50"><div className="font-medium">Space &amp; Nuclear Strategic</div><div className="text-xs text-muted-foreground mt-1">ISRO Gaganyaan &#8594; IGCAR PFBR &#8594; &#8594; &#8377;1,820Cr combined &#8594; ultra-pure grade critical &#8594; indigenous supply</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-red-500 bg-red-50/50"><div className="font-medium">Pharma &amp; Defense Grease</div><div className="text-xs text-muted-foreground mt-1">Sun Pharma bipolar &#8594; BEL glass-ceramic &#8594; Bharat Forge bearing &#8594; &#8594; &#8377;1,400Cr combined &#8594; specialty niche</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-red-500 bg-red-50/50"><div className="font-medium">Monsoon Disruption Alert</div><div className="text-xs text-muted-foreground mt-1">LH-B2412 GRSE Project 75I submarine battery delayed &#8594; monsoon Visakhapatnam port congestion &#8594; sub fleet readiness at risk</div></div>
          </div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Investment Landscape</CardTitle></CardHeader><CardContent><div className="space-y-3 text-sm">
            <div className="p-3 rounded-lg border-l-4 border-l-red-500 bg-red-50/50"><div className="font-medium">Total Portfolio: &#8377;{kpiData.total.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground mt-1">Across 14 lithium hydroxide grades spanning EV, space, nuclear, defense, pharma, solar, telecom, mining &#8594; avg purity {kpiData.avgPurity}%</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-red-500 bg-red-50/50"><div className="font-medium">Critical Priority: 6 Records</div><div className="text-xs text-muted-foreground mt-1">Mahindra EV &#8594; ISRO Gaganyaan &#8594; L&amp;T BESS &#8594; IGCAR nuclear &#8594; GRSE submarine &#8594; &#8594; energy security chain</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-red-500 bg-red-50/50"><div className="font-medium">Top Manufacturers</div><div className="text-xs text-muted-foreground mt-1">Tata Chemicals &#8594; DRDO &#8594; Exide lead &#8594; Bharat Lithium &#8594; Gujarat Lithium &#8594; &#8594; emerging Indian LiOH capacity</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-red-500 bg-red-50/50"><div className="font-medium">Import Dependency Alert</div><div className="text-xs text-muted-foreground mt-1">90% LiOH imported from China/Chile &#8594; Atmanirbhar critical &#8594; RKAB auction for Manali-Leh lithium block &#8594; Jharkhand reserve</div></div>
          </div></CardContent></Card>
        </div>
      )}
    </div>
  );
}
