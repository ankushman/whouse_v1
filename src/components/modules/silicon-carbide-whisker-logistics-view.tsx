"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared';
import { Sparkles } from 'lucide-react';

interface SiliconCarbideWhiskerRecord {
  id: string; batchNo: string; city: string; manufacturer: string; grade: string;
  application: string; purityPercent: number; specProp: number; investmentCr: number;
  status: string; priority: string; origin: string; destination: string;
  shipDate: string; transitDays: number; zone: string; remarks: string;
};

const siliconcarbidewhiskerRecords: SiliconCarbideWhiskerRecord[] = [
  { id: 'SCW-0001', batchNo: 'SCW-B2401', city: 'Mumbai', manufacturer: 'MIDHANI', grade: 'SiCw 99.5% Armor Reinforcement', application: 'DRDO BIS Level IV+ Composite', purityPercent: 99.5, specProp: 0.5, investmentCr: 920, status: 'Delivered', priority: 'Critical', origin: 'MIDHANI Hyderabad (TG)', destination: 'DRDO Pune (MH)', shipDate: '2026-07-15', transitDays: 1, zone: 'West', remarks: 'SiCw 99.5% armor-grade for DRDO BIS Level IV+ SiCw reinforced alumina composite &amp;#8594; 0.5 um &amp;#8594; &amp;#8377;920Cr for 40 tonnes &amp;#8594; India &amp;#8377;7,200Cr SiCw armor &amp;#8594; DRDO 200K plates &amp;#8594; 99.5% purity &amp;#8594; &amp;#8594; Whisker &amp;#8594; &amp;#8594; SiCwArmor &amp;#8594; &amp;#8594; Defense' },
  { id: 'SCW-0002', batchNo: 'SCW-B2402', city: 'Bengaluru', manufacturer: 'DRDO DMRL', grade: 'SiCw 99.8% MMC Aerospace', application: 'HAL Tejas Mk2 SiCw/Al Fan', purityPercent: 99.8, specProp: 0.3, investmentCr: 860, status: 'In Transit', priority: 'Critical', origin: 'DRDO Hyderabad (TG)', destination: 'HAL Bengaluru (KA)', shipDate: '2026-07-16', transitDays: 2, zone: 'South', remarks: 'SiCw 99.8% MMC-grade for HAL Tejas Mk2 SiCw/Al metal matrix composite fan blade &amp;#8594; 0.3 um &amp;#8594; &amp;#8377;860Cr for 15 tonnes &amp;#8594; India &amp;#8377;6,400Cr SiCw MMC &amp;#8594; HAL 40 aircraft &amp;#8594; 99.8% purity &amp;#8594; &amp;#8594; Whisker &amp;#8594; &amp;#8594; SiCwMMC &amp;#8594; &amp;#8594; Aerospace' },
  { id: 'SCW-0003', batchNo: 'SCW-B2403', city: 'Chennai', manufacturer: 'Tata Steel', grade: 'SiCw 99% Steel Reinforcement', application: 'JSW Steel SiCw/Steel Roll', purityPercent: 99.0, specProp: 0.8, investmentCr: 680, status: 'Delivered', priority: 'High', origin: 'Tata Steel Jamshedpur (JH)', destination: 'JSW Vijayanagar (KA)', shipDate: '2026-07-17', transitDays: 3, zone: 'South', remarks: 'SiCw 99% steel-grade for JSW steel rolling mill SiCw reinforced work roll &amp;#8594; 0.8 um &amp;#8594; &amp;#8377;680Cr for 50 tonnes &amp;#8594; India &amp;#8377;4,600Cr SiCw steel &amp;#8594; JSW 12 mills &amp;#8594; 99.0% purity &amp;#8594; &amp;#8594; Whisker &amp;#8594; &amp;#8594; SiCwRoll &amp;#8594; &amp;#8594; Steel' },
  { id: 'SCW-0004', batchNo: 'SCW-B2404', city: 'Hyderabad', manufacturer: 'Bharat Forge', grade: 'SiCw 99.2% Cutting Tool', application: 'Bharat Forge Ceramic Insert', purityPercent: 99.2, specProp: 0.6, investmentCr: 580, status: 'Delivered', priority: 'High', origin: 'Bharat Forge Pune (MH)', destination: 'Bharat Forge Baramati (MH)', shipDate: '2026-07-18', transitDays: 4, zone: 'South', remarks: 'SiCw 99.2% tool-grade for Bharat Forge SiCw reinforced alumina cutting insert &amp;#8594; 0.6 um &amp;#8594; &amp;#8377;580Cr for 30 tonnes &amp;#8594; India &amp;#8377;3,800Cr SiCw tool &amp;#8594; Bharat Forge 5M inserts &amp;#8594; 99.2% purity &amp;#8594; &amp;#8594; Whisker &amp;#8594; &amp;#8594; SiCwTool &amp;#8594; &amp;#8594; Manufacturing' },
  { id: 'SCW-0005', batchNo: 'SCW-B2405', city: 'Kolkata', manufacturer: 'Shyam Composites', grade: 'SiCw 98.5% Marine Propeller', application: 'L&amp;T Naval Composite Prop', purityPercent: 98.5, specProp: 1.0, investmentCr: 560, status: 'In Transit', priority: 'High', origin: 'Shyam Comp Kolkata (WB)', destination: 'L&amp;T Kattupalli (TN)', shipDate: '2026-07-19', transitDays: 5, zone: 'East', remarks: 'SiCw 98.5% marine-grade for L&amp;amp;T warship composite propeller SiCw reinforced &amp;#8594; 1.0 um &amp;#8594; &amp;#8377;560Cr for 25 tonnes &amp;#8594; India &amp;#8377;3,800Cr SiCw naval &amp;#8594; L&amp;amp;T 30 warships &amp;#8594; 98.5% purity &amp;#8594; &amp;#8594; Whisker &amp;#8594; &amp;#8594; SiCwProp &amp;#8594; &amp;#8594; Naval' },
  { id: 'SCW-0006', batchNo: 'SCW-B2406', city: 'Coimbatore', manufacturer: 'BHEL R&amp;D', grade: 'SiCw 99.6% Turbine Blade', application: 'BHEL 800MW GT SiCw/SiC Blade', purityPercent: 99.6, specProp: 0.4, investmentCr: 780, status: 'Delivered', priority: 'Critical', origin: 'BHEL Bhopal (MP)', destination: 'BHEL Hyderabad (TG)', shipDate: '2026-07-20', transitDays: 1, zone: 'South', remarks: 'SiCw 99.6% GT-grade for BHEL 800MW GT SiCw/SiC ceramic matrix turbine blade &amp;#8594; 0.4 um &amp;#8594; &amp;#8377;780Cr for 10 tonnes &amp;#8594; India &amp;#8377;5,400Cr SiCw GT &amp;#8594; BHEL 20 GTs &amp;#8594; 99.6% purity &amp;#8594; &amp;#8594; Whisker &amp;#8594; &amp;#8594; SiCwGT &amp;#8594; &amp;#8594; Power' },
  { id: 'SCW-0007', batchNo: 'SCW-B2407', city: 'Pune', manufacturer: 'Godrej Composites', grade: 'SiCw 99.3% EV Battery Separator', application: 'Tata Motors SiCw/Li Separator', purityPercent: 99.3, specProp: 0.5, investmentCr: 640, status: 'Delivered', priority: 'High', origin: 'Godrej Mumbai (MH)', destination: 'Tata Motors Pune (MH)', shipDate: '2026-07-21', transitDays: 2, zone: 'West', remarks: 'SiCw 99.3% EV-grade for Tata Motors Nexon EV SiCw reinforced ceramic separator &amp;#8594; 0.5 um &amp;#8594; &amp;#8377;640Cr for 25 tonnes &amp;#8594; India &amp;#8377;4,400Cr SiCw EV &amp;#8594; Tata 50K vehicles &amp;#8594; 99.3% purity &amp;#8594; &amp;#8594; Whisker &amp;#8594; &amp;#8594; SiCwEV &amp;#8594; &amp;#8594; Automotive' },
  { id: 'SCW-0008', batchNo: 'SCW-B2408', city: 'Jaipur', manufacturer: 'Rajasthan Composites', grade: 'SiCw 98% Rail Brake Disc', application: 'Indian Railways Composite Disc', purityPercent: 98.0, specProp: 1.2, investmentCr: 440, status: 'Delivered', priority: 'Medium', origin: 'Rajasthan Comp Jodhpur (RJ)', destination: 'RCF Kapurthala (PB)', shipDate: '2026-07-22', transitDays: 3, zone: 'West', remarks: 'SiCw 98% rail-grade for Indian Railways locomotive SiCw/Al composite brake disc &amp;#8594; 1.2 um &amp;#8594; &amp;#8377;440Cr for 50 tonnes &amp;#8594; India &amp;#8377;2,800Cr SiCw rail &amp;#8594; IR 100K discs &amp;#8594; 98.0% purity &amp;#8594; &amp;#8594; Whisker &amp;#8594; &amp;#8594; SiCwRail &amp;#8594; &amp;#8594; Rail' },
  { id: 'SCW-0009', batchNo: 'SCW-B2409', city: 'Guwahati', manufacturer: 'Assam Composites', grade: 'SiCw 97% Mining Drill Bit', application: 'Coal India PDC Drill Reinforce', purityPercent: 97.0, specProp: 1.5, investmentCr: 400, status: 'In Transit', priority: 'Medium', origin: 'Assam Comp Tezpur (AS)', destination: 'Coal India Ranchi (JH)', shipDate: '2026-07-23', transitDays: 4, zone: 'East', remarks: 'SiCw 97% mining-grade for Coal India PDC drill bit SiCw reinforced matrix &amp;#8594; 1.5 um &amp;#8594; &amp;#8377;400Cr for 40 tonnes &amp;#8594; India &amp;#8377;2,600Cr SiCw mining &amp;#8594; Coal India 40 mines &amp;#8594; 97.0% purity &amp;#8594; &amp;#8594; Whisker &amp;#8594; &amp;#8594; SiCwMine &amp;#8594; &amp;#8594; Mining' },
  { id: 'SCW-0010', batchNo: 'SCW-B2410', city: 'Ahmedabad', manufacturer: 'Gujarat Composites', grade: 'SiCw 99.7% Space Telescope', application: 'ISRO SPADEX SiCw Mirror', purityPercent: 99.7, specProp: 0.3, investmentCr: 900, status: 'Delivered', priority: 'Critical', origin: 'Gujarat Comp Ahmedabad (GJ)', destination: 'ISRO Bengaluru (KA)', shipDate: '2026-07-24', transitDays: 5, zone: 'West', remarks: 'SiCw 99.7% space-grade for ISRO SPADEX SiCw reinforced C/SiC telescope mirror &amp;#8594; 0.3 um &amp;#8594; &amp;#8377;900Cr for 5 tonnes &amp;#8594; India &amp;#8377;7,200Cr SiCw space &amp;#8594; ISRO 4 missions &amp;#8594; 99.7% purity &amp;#8594; &amp;#8594; Whisker &amp;#8594; &amp;#8594; SiCwSpace &amp;#8594; &amp;#8594; Space' },
  { id: 'SCW-0011', batchNo: 'SCW-B2411', city: 'Lucknow', manufacturer: 'UP Composites', grade: 'SiCw 99% Wind Turbine', application: 'Adani Wind SiCw/Blade Root', purityPercent: 99.0, specProp: 0.8, investmentCr: 520, status: 'Delivered', priority: 'Medium', origin: 'UP Comp Kanpur (UP)', destination: 'Adani Mumbai (MH)', shipDate: '2026-07-25', transitDays: 1, zone: 'North', remarks: 'SiCw 99% wind-grade for Adani 5MW wind turbine SiCw reinforced blade root joint &amp;#8594; 0.8 um &amp;#8594; &amp;#8377;520Cr for 35 tonnes &amp;#8594; India &amp;#8377;3,400Cr SiCw wind &amp;#8594; Adani 2K turbines &amp;#8594; 99.0% purity &amp;#8594; &amp;#8594; Whisker &amp;#8594; &amp;#8594; SiCwWind &amp;#8594; &amp;#8594; Power' },
  { id: 'SCW-0012', batchNo: 'SCW-B2412', city: 'Visakhapatnam', manufacturer: 'Vizag Composites', grade: 'SiCw 99.5% Submarine Sonar Dome', application: 'GRSE Project 75I Bow Dome', purityPercent: 99.5, specProp: 0.4, investmentCr: 940, status: 'Delayed', priority: 'Critical', origin: 'Vizag Comp Visakhapatnam (AP)', destination: 'GRSE Kolkata (WB)', shipDate: '2026-07-26', transitDays: 2, zone: 'East', remarks: 'SiCw 99.5% submarine-grade for GRSE Project 75I bow sonar dome rubber composite &amp;#8597; 0.4 um &amp;#8597; &amp;#8377;940Cr for 15 tonnes &amp;#8597; India &amp;#8377;7,600Cr SiCw submarine &amp;#8597; GRSE 6 submarines &amp;#8597; 99.5% purity &amp;#8597; &amp;#8594; Whisker &amp;#8597; &amp;#8594; SiCwSub &amp;#8597; &amp;#8594; Naval' },
  { id: 'SCW-0013', batchNo: 'SCW-B2413', city: 'Bhopal', manufacturer: 'DRDO TBRL', grade: 'SiCw 99.6% Hypersonic TPS', application: 'DRDO HSTDV TPS Panel', purityPercent: 99.6, specProp: 0.3, investmentCr: 880, status: 'In Transit', priority: 'Critical', origin: 'DRDO Hyderabad (TG)', destination: 'BHEL Hyderabad (TG)', shipDate: '2026-07-27', transitDays: 3, zone: 'Central', remarks: 'SiCw 99.6% hypersonic-grade for DRDO HSTDV scramjet thermal panel SiCw/SiC CMC &amp;#8594; 0.3 um &amp;#8594; &amp;#8377;880Cr for 8 tonnes &amp;#8594; India &amp;#8377;6,200Cr SiCw hypersonic &amp;#8594; DRDO 10 vehicles &amp;#8594; 99.6% purity &amp;#8594; &amp;#8594; Whisker &amp;#8594; &amp;#8594; SiCwHyp &amp;#8594; &amp;#8594; Defense' },
  { id: 'SCW-0014', batchNo: 'SCW-B2414', city: 'Rourkela', manufacturer: 'SAIL Composites', grade: 'SiCw 96% Foundry Crucible', application: 'SAIL Rourkela Casting Crucible', purityPercent: 96.0, specProp: 2.0, investmentCr: 300, status: 'Delivered', priority: 'Low', origin: 'SAIL Rourkela (OD)', destination: 'SAIL Bhilai (CG)', shipDate: '2026-07-28', transitDays: 4, zone: 'East', remarks: 'SiCw 96% foundry-grade for SAIL Rourkela steel casting SiCw reinforced crucible &amp;#8594; 2.0 um &amp;#8594; &amp;#8377;300Cr for 80 tonnes &amp;#8594; India &amp;#8377;2,000Cr SiCw foundry &amp;#8594; SAIL 20 crucibles &amp;#8594; 96.0% purity &amp;#8594; &amp;#8594; Whisker &amp;#8594; &amp;#8594; SiCwFound &amp;#8594; &amp;#8594; Steel' },
];

export default function SiliconCarbideWhiskerLogisticsView() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterZone, setFilterZone] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Sparkles },
    { id: 'registry', label: 'Registry', icon: Sparkles },
    { id: 'analytics', label: 'Analytics', icon: Sparkles },
    { id: 'insights', label: 'Insights', icon: Sparkles },
  ];

  const filteredRecords = useMemo(() => {
    return siliconcarbidewhiskerRecords.filter((r) => {
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
    siliconcarbidewhiskerRecords.forEach((r) => { zMap[r.zone] = (zMap[r.zone] || 0) + 1; });
    return Object.entries(zMap).sort((a, b) => b[1] - a[1]);
  }, []);

  const kpiData = useMemo(() => {
    const total = siliconcarbidewhiskerRecords.reduce((s: number, r) => s + r.investmentCr, 0);
    const avgPurity = siliconcarbidewhiskerRecords.reduce((s: number, r) => s + r.purityPercent, 0) / siliconcarbidewhiskerRecords.length;
    const delayed = siliconcarbidewhiskerRecords.filter((r) => r.status === 'Delayed').length;
    const critical = siliconcarbidewhiskerRecords.filter((r) => r.priority === 'Critical').length;
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

  const themeColor = '#0d9488';
  return (
    <div className="space-y-6 p-6">
      <PageHeader title="Silicon Carbide Whisker Logistics" description="Indian silicon carbide whisker logistics supply chain tracking across 14 grades spanning armor, aerospace, defense, semiconductor, nuclear and industrial sectors" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-teal-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-teal-600">{kpiData.total.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground mt-1">Total Investment</div></CardContent></Card>
        <Card className="border-l-4 border-l-teal-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-teal-600">{kpiData.avgPurity}%</div><div className="text-xs text-muted-foreground mt-1">Avg Purity</div></CardContent></Card>
        <Card className="border-l-4 border-l-teal-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-teal-600">{kpiData.delayed}</div><div className="text-xs text-muted-foreground mt-1">Delayed Batches</div></CardContent></Card>
        <Card className="border-l-4 border-l-teal-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-teal-600">{kpiData.critical}</div><div className="text-xs text-muted-foreground mt-1">Critical Records</div></CardContent></Card>
      </div>
      <div className="flex flex-wrap gap-2 border-b pb-2">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 rounded-t-md text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-teal-500 text-white shadow-md' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
            {tab.label}
          </button>
        ))}
      </div>
      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-base">Zone Distribution</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">{zones.map(([zone, count]) => { const pct = (count as number / siliconcarbidewhiskerRecords.length) * 100; return <div key={zone} className="flex items-center gap-2"><span className="text-xs w-16 text-muted-foreground">{zone as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium w-8">{count as number}</span></div>; })}</div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Status Overview</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-2 gap-3">
              {['Delivered', 'In Transit', 'Delayed', 'Processing'].map((s) => { const c = siliconcarbidewhiskerRecords.filter((r) => r.status === s).length; return <div key={s} className={`text-center p-3 rounded-lg border ${statusColor(s)}`}><div className="text-lg font-bold">{c}</div><div className="text-xs">{s}</div></div>; })}
            </div>
          </CardContent></Card>
          <Card className="lg:col-span-2"><CardHeader><CardTitle className="text-base">Investment by Grade (Top 8)</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {siliconcarbidewhiskerRecords.slice(0, 8).map((r) => <div key={r.id} className="text-center p-3 rounded-lg border bg-muted/30"><div className="text-sm font-medium truncate">{r.grade}</div><div className="text-lg font-bold" style={{ color: themeColor }}>&#8377;{r.investmentCr}Cr</div><div className="text-xs text-muted-foreground">{r.application}</div></div>)}
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
                    <div className="flex justify-between"><span className="text-muted-foreground">Whisker Dia (um)</span><span className="font-medium">{record.specProp}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Investment:</span><span className="font-medium" style={{ color: themeColor }}>&#8377;{record.investmentCr}Cr</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">City:</span><span className="font-medium">{record.city}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Route:</span><span className="font-medium text-xs">{record.origin} &#8594; {record.destination}</span></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-sm text-muted-foreground">Showing {filteredRecords.length} of {siliconcarbidewhiskerRecords.length} records</div>
        </div>
      )}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-base">Manufacturer Performance</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">
              {(() => { const mfrMap: Record<string, number> = {}; siliconcarbidewhiskerRecords.forEach((r) => { mfrMap[r.manufacturer] = (mfrMap[r.manufacturer] || 0) + r.investmentCr; }); return Object.entries(mfrMap).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([mfr, inv]) => { const pct = (inv as number / kpiData.total) * 100; return <div key={mfr} className="flex items-center gap-2"><span className="text-xs w-40 truncate">{mfr as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">&#8377;{inv as number}Cr</span></div>; }); })()}
            </div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Priority Distribution</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-2 gap-3">
              {['Critical', 'High', 'Medium', 'Low'].map((p) => { const c = siliconcarbidewhiskerRecords.filter((r) => r.priority === p).length; return <div key={p} className={`text-center p-3 rounded-lg border ${priorityColor(p)}`}><div className="text-lg font-bold">{c}</div><div className="text-xs">{p}</div></div>; })}
            </div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Investment by Zone</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">{(() => { const zInv: Record<string, number> = {}; siliconcarbidewhiskerRecords.forEach((r) => { zInv[r.zone] = (zInv[r.zone] || 0) + r.investmentCr; }); return Object.entries(zInv).sort((a, b) => b[1] - a[1]).map(([zone, inv]) => { const pct = (inv as number / kpiData.total) * 100; return <div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">&#8377;{inv as number}Cr</span></div>; }); })()}</div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Purity Distribution</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">
              {(() => { const ranges = { '99%+': 0, '95-98.9%': 0, '90-94.9%': 0, '<90%': 0 }; siliconcarbidewhiskerRecords.forEach((r) => { if (r.purityPercent >= 99) ranges['99%+']++; else if (r.purityPercent >= 95) ranges['95-98.9%']++; else if (r.purityPercent >= 90) ranges['90-94.9%']++; else ranges['<90%']++; }); return (Object.entries(ranges) as [string, number][]).filter(([, v]) => v > 0).map(([range, count]) => { const pct = (count / siliconcarbidewhiskerRecords.length) * 100; return <div key={range} className="flex items-center gap-2"><span className="text-xs w-24">{range}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">{count}</span></div>; }); })()}
            </div>
          </CardContent></Card>
        </div>
      )}
      {activeTab === 'insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-base">Supply Chain Intelligence</CardTitle></CardHeader><CardContent><div className="space-y-3 text-sm">
            <div className="p-3 rounded-lg border-l-4 border-l-teal-500 bg-teal-50/50"><div className="font-medium">Aerospace &amp; Hypersonic CMC</div><div className="text-xs text-muted-foreground mt-1">HAL Tejas fan &#8594; BHEL GT blade &#8594; DRDO HSTDV TPS &#8594; &#8377;2,520Cr combined &#8594; ceramic matrix composites critical</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-teal-500 bg-teal-50/50"><div className="font-medium">Armor &amp; Naval</div><div className="text-xs text-muted-foreground mt-1">DRDO BIS IV+ &#8594; GRSE sonar dome &#8594; L&amp;T propeller &#8594; &#8377;2,420Cr combined &#8594; strategic defense</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-teal-500 bg-teal-50/50"><div className="font-medium">EV &amp; Energy</div><div className="text-xs text-muted-foreground mt-1">Tata EV separator &#8594; Adani wind blade root &#8594; &#8377;1,160Cr combined &#8594; green transition</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-teal-500 bg-teal-50/50"><div className="font-medium">Monsoon Alert</div><div className="text-xs text-muted-foreground mt-1">SCW-B2412 GRSE Project 75I bow sonar dome delayed &#8594; monsoon Visakhapatnam &#8594; submarine programme at risk</div></div>
          </div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Investment Landscape</CardTitle></CardHeader><CardContent><div className="space-y-3 text-sm">
            <div className="p-3 rounded-lg border-l-4 border-l-teal-500 bg-teal-50/50"><div className="font-medium">Total Portfolio: &#8377;8,760 Cr</div><div className="text-xs text-muted-foreground mt-1">Across 14 SiCw grades spanning armor, MMC aerospace, steel, cutting tool, naval, GT, EV, rail, mining, space, wind, hypersonic, foundry &#8594; avg purity 98.96%</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-teal-500 bg-teal-50/50"><div className="font-medium">Critical Priority: 7 Records</div><div className="text-xs text-muted-foreground mt-1">DRDO &#8594; HAL &#8594; BHEL GT &#8594; ISRO &#8594; GRSE &#8594; DRDO HSTDV &#8594; DRDO TBRL</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-teal-500 bg-teal-50/50"><div className="font-medium">Top Manufacturers</div><div className="text-xs text-muted-foreground mt-1">MIDHANI &#8594; DRDO &#8594; BHEL &#8594; Tata Steel &#8594; Godrej &#8594; Gujarat Composites &#8594; Shyam Composites</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-teal-500 bg-teal-50/50"><div className="font-medium">Whisker Diameter Spectrum</div><div className="text-xs text-muted-foreground mt-1">0.3-2.0 micron &#8594; aerospace 0.3 um finest &#8594; foundry 2.0 um coarsest &#8594; diameter defines reinforcement</div></div>
          </div></CardContent></Card>
        </div>
      )}
    </div>
  );
}
