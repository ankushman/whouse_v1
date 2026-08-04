"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared';
import { Wrench } from 'lucide-react';

interface MolybdenumDisulphideRecord {
  id: string; batchNo: string; city: string; manufacturer: string; grade: string;
  application: string; purityPercent: number; specProp: number; investmentCr: number;
  status: string; priority: string; origin: string; destination: string;
  shipDate: string; transitDays: number; zone: string; remarks: string;
};

const molybdenumdisulphideRecords: MolybdenumDisulphideRecord[] = [
  { id: 'MDP-0001', batchNo: 'MDP-B2401', city: 'Mumbai', manufacturer: 'MIDHANI', grade: 'MoS2 99.9% Aerospace', application: 'HAL Tejas Mk2 Landing Gear', purityPercent: 99.9, specProp: 0.06, investmentCr: 840, status: 'Delivered', priority: 'Critical', origin: 'MIDHANI Hyderabad (TG)', destination: 'HAL Bengaluru (KA)', shipDate: '2026-07-15', transitDays: 1, zone: 'West', remarks: 'MoS2 99.9% aerospace-grade for HAL Tejas Mk2 landing gear solid lubricant coating &amp;#8594; 0.06 um &amp;#8594; &amp;#8377;840Cr for 25 tonnes &amp;#8594; India &amp;#8377;6,200Cr MoS2 aero &amp;#8594; HAL 40 aircraft &amp;#8594; 99.9% purity &amp;#8594; &amp;#8594; Powder &amp;#8594; &amp;#8594; MoS2Aero &amp;#8594; &amp;#8594; Aerospace' },
  { id: 'MDP-0002', batchNo: 'MDP-B2402', city: 'Bengaluru', manufacturer: 'DRDO DMRL', grade: 'MoS2 99.5% Missile Bearing', application: 'DRDO BrahMos Mk2 Gyro Bearing', purityPercent: 99.5, specProp: 0.08, investmentCr: 780, status: 'In Transit', priority: 'Critical', origin: 'DRDO Hyderabad (TG)', destination: 'BEL Bengaluru (KA)', shipDate: '2026-07-16', transitDays: 2, zone: 'South', remarks: 'MoS2 99.5% missile-grade for DRDO BrahMos Mk2 gyro bearing dry film lubricant &amp;#8594; 0.08 um &amp;#8594; &amp;#8377;780Cr for 30 tonnes &amp;#8594; India &amp;#8377;5,400Cr MoS2 missile &amp;#8594; DRDO 200 missiles &amp;#8594; 99.5% purity &amp;#8594; &amp;#8594; Film &amp;#8594; &amp;#8594; MoS2Msl &amp;#8594; &amp;#8594; Defense' },
  { id: 'MDP-0003', batchNo: 'MDP-B2403', city: 'Chennai', manufacturer: 'Tata Steel', grade: 'MoS2 98% Metal Forming', application: 'JSW Steel Cold Rolling', purityPercent: 98.0, specProp: 0.15, investmentCr: 680, status: 'Delivered', priority: 'High', origin: 'Tata Steel Jamshedpur (JH)', destination: 'JSW Vijayanagar (KA)', shipDate: '2026-07-17', transitDays: 3, zone: 'South', remarks: 'MoS2 98% forming-grade for JSW steel cold rolling mill sheet metal forming lubricant &amp;#8594; 0.15 um &amp;#8594; &amp;#8377;680Cr for 60 tonnes &amp;#8594; India &amp;#8377;4,600Cr MoS2 steel &amp;#8594; JSW 12 mills &amp;#8594; 98.0% purity &amp;#8594; &amp;#8594; Paste &amp;#8594; &amp;#8594; MoS2Form &amp;#8594; &amp;#8594; Steel' },
  { id: 'MDP-0004', batchNo: 'MDP-B2404', city: 'Hyderabad', manufacturer: 'Bharat Forge', grade: 'MoS2 97% Auto Engine', application: 'Mahindra XUV400 Engine Piston', purityPercent: 97.0, specProp: 0.1, investmentCr: 480, status: 'Delivered', priority: 'High', origin: 'Bharat Forge Pune (MH)', destination: 'Mahindra Pune (MH)', shipDate: '2026-07-18', transitDays: 4, zone: 'West', remarks: 'MoS2 97% engine-grade for Mahindra XUV400 piston ring MoS2 anti-seize coating &amp;#8594; 0.10 um &amp;#8594; &amp;#8377;480Cr for 40 tonnes &amp;#8594; India &amp;#8377;3,200Cr MoS2 auto &amp;#8594; Mahindra 50K engines &amp;#8594; 97.0% purity &amp;#8594; &amp;#8594; Spray &amp;#8594; &amp;#8594; MoS2Auto &amp;#8594; &amp;#8594; Automotive' },
  { id: 'MDP-0005', batchNo: 'MDP-B2405', city: 'Kolkata', manufacturer: 'Shyam Chemicals', grade: 'MoS2 96% Gearbox', application: 'L&amp;T Naval Gearbox MoS2', purityPercent: 96.0, specProp: 0.12, investmentCr: 560, status: 'In Transit', priority: 'High', origin: 'Shyam Chem Kolkata (WB)', destination: 'L&amp;T Mumbai (MH)', shipDate: '2026-07-19', transitDays: 5, zone: 'East', remarks: 'MoS2 96% gearbox-grade for L&amp;amp;T naval gearbox MoS2 EP grease additive &amp;#8594; 0.12 um &amp;#8594; &amp;#8377;560Cr for 50 tonnes &amp;#8594; India &amp;#8377;3,800Cr MoS2 naval &amp;#8594; L&amp;amp;T 30 gearboxes &amp;#8594; 96.0% purity &amp;#8594; &amp;#8594; Grease &amp;#8594; &amp;#8594; MoS2Nav &amp;#8594; &amp;#8594; Naval' },
  { id: 'MDP-0006', batchNo: 'MDP-B2406', city: 'Coimbatore', manufacturer: 'BHEL R&amp;D', grade: 'MoS2 99% Turbine Bearing', application: 'BHEL 800MW GT Journal Bearing', purityPercent: 99.0, specProp: 0.08, investmentCr: 720, status: 'Delivered', priority: 'Critical', origin: 'BHEL Bhopal (MP)', destination: 'BHEL Hyderabad (TG)', shipDate: '2026-07-20', transitDays: 1, zone: 'South', remarks: 'MoS2 99% turbine-grade for BHEL 800MW GT journal bearing MoS2 sputtered coating &amp;#8594; 0.08 um &amp;#8594; &amp;#8377;720Cr for 35 tonnes &amp;#8594; India &amp;#8377;5,000Cr MoS2 GT &amp;#8594; BHEL 20 GTs &amp;#8594; 99.0% purity &amp;#8594; &amp;#8594; Sputter &amp;#8594; &amp;#8594; MoS2GT &amp;#8594; &amp;#8594; Power' },
  { id: 'MDP-0007', batchNo: 'MDP-B2407', city: 'Pune', manufacturer: 'Godrej Lubricants', grade: 'MoS2 98% Industrial Grease', application: 'Tata Power Wind Turbine', purityPercent: 98.0, specProp: 0.15, investmentCr: 400, status: 'Delivered', priority: 'Medium', origin: 'Godrej Mumbai (MH)', destination: 'Tata Power Mumbai (MH)', shipDate: '2026-07-21', transitDays: 2, zone: 'West', remarks: 'MoS2 98% industrial grease for Tata Power wind turbine yaw bearing MoS2 grease &amp;#8594; 0.15 um &amp;#8594; &amp;#8377;400Cr for 60 tonnes &amp;#8594; India &amp;#8377;2,800Cr MoS2 wind &amp;#8594; Tata 2K turbines &amp;#8594; 98.0% purity &amp;#8594; &amp;#8594; Grease &amp;#8594; &amp;#8594; MoS2Wind &amp;#8594; &amp;#8594; Power' },
  { id: 'MDP-0008', batchNo: 'MDP-B2408', city: 'Jaipur', manufacturer: 'Rajasthan Lubricants', grade: 'MoS2 95% Chain Lubricant', application: 'Indian Railways RCF Chain', purityPercent: 95.0, specProp: 0.2, investmentCr: 320, status: 'Delivered', priority: 'Medium', origin: 'Rajasthan Lub Jodhpur (RJ)', destination: 'RCF Kapurthala (PB)', shipDate: '2026-07-22', transitDays: 3, zone: 'West', remarks: 'MoS2 95% chain lubricant for Indian Railways wheel factory conveyor chain &amp;#8594; 0.20 um &amp;#8594; &amp;#8377;320Cr for 80 tonnes &amp;#8594; India &amp;#8377;2,200Cr MoS2 rail &amp;#8594; IR 200K chains &amp;#8594; 95.0% purity &amp;#8594; &amp;#8594; Oil &amp;#8594; &amp;#8594; MoS2Chain &amp;#8594; &amp;#8594; Rail' },
  { id: 'MDP-0009', batchNo: 'MDP-B2409', city: 'Guwahati', manufacturer: 'Assam Lubricants', grade: 'MoS2 94% Wire Rope', application: 'Coal India Mine Hoist Cable', purityPercent: 94.0, specProp: 0.25, investmentCr: 360, status: 'In Transit', priority: 'Medium', origin: 'Assam Lub Tezpur (AS)', destination: 'Coal India Ranchi (JH)', shipDate: '2026-07-23', transitDays: 4, zone: 'East', remarks: 'MoS2 94% wire rope dressing for Coal India mine hoist cable anti-wear &amp;#8594; 0.25 um &amp;#8594; &amp;#8377;360Cr for 70 tonnes &amp;#8594; India &amp;#8377;2,400Cr MoS2 mining &amp;#8594; Coal India 40 mines &amp;#8594; 94.0% purity &amp;#8594; &amp;#8594; Paste &amp;#8594; &amp;#8594; MoS2Mine &amp;#8594; &amp;#8594; Mining' },
  { id: 'MDP-0010', batchNo: 'MDP-B2410', city: 'Ahmedabad', manufacturer: 'Gujarat Lubricants', grade: 'MoS2 99.8% Space Grade', application: 'ISRO Gaganyaan EVA Suit', purityPercent: 99.8, specProp: 0.04, investmentCr: 920, status: 'Delivered', priority: 'Critical', origin: 'Gujarat Lub Ahmedabad (GJ)', destination: 'ISRO Bengaluru (KA)', shipDate: '2026-07-24', transitDays: 5, zone: 'West', remarks: 'MoS2 99.8% space-grade for ISRO Gaganyaan EVA suit joint lubricant vacuum compatible &amp;#8594; 0.04 um &amp;#8594; &amp;#8377;920Cr for 10 tonnes &amp;#8594; India &amp;#8377;7,600Cr MoS2 space &amp;#8594; ISRO 4 missions &amp;#8594; 99.8% purity &amp;#8594; &amp;#8594; Dispersion &amp;#8594; &amp;#8594; MoS2Space &amp;#8594; &amp;#8594; Space' },
  { id: 'MDP-0011', batchNo: 'MDP-B2411', city: 'Lucknow', manufacturer: 'UP Lubricants', grade: 'MoS2 97% Bolt Lubricant', application: 'Adani Pipeline Flange Bolt', purityPercent: 97.0, specProp: 0.1, investmentCr: 380, status: 'Delivered', priority: 'Medium', origin: 'UP Lub Kanpur (UP)', destination: 'Adani Mundra (GJ)', shipDate: '2026-07-25', transitDays: 1, zone: 'North', remarks: 'MoS2 97% anti-seize for Adani pipeline flange bolt MoS2 thread lubricant &amp;#8594; 0.10 um &amp;#8594; &amp;#8377;380Cr for 50 tonnes &amp;#8594; India &amp;#8377;2,600Cr MoS2 pipeline &amp;#8594; Adani 2,000 km &amp;#8594; 97.0% purity &amp;#8594; &amp;#8594; Paste &amp;#8594; &amp;#8594; MoS2Pipe &amp;#8594; &amp;#8594; Oil &amp;amp; Gas' },
  { id: 'MDP-0012', batchNo: 'MDP-B2412', city: 'Visakhapatnam', manufacturer: 'Vizag Lubricants', grade: 'MoS2 99% Submarine Propeller', application: 'GRSE Project 75I Prop Shaft', purityPercent: 99.0, specProp: 0.06, investmentCr: 940, status: 'Delayed', priority: 'Critical', origin: 'Vizag Lub Visakhapatnam (AP)', destination: 'GRSE Kolkata (WB)', shipDate: '2026-07-26', transitDays: 2, zone: 'East', remarks: 'MoS2 99% submarine-grade for GRSE Project 75I propeller shaft bearing MoS2 &amp;#8597; 0.06 um &amp;#8597; &amp;#8377;940Cr for 20 tonnes &amp;#8597; India &amp;#8377;7,800Cr MoS2 submarine &amp;#8597; GRSE 6 submarines &amp;#8597; 99.0% purity &amp;#8597; &amp;#8594; Bond &amp;#8597; &amp;#8594; MoS2Sub &amp;#8597; &amp;#8594; Naval' },
  { id: 'MDP-0013', batchNo: 'MDP-B2413', city: 'Bhopal', manufacturer: 'DRDO TBRL', grade: 'MoS2 99.5% Hypersonic', application: 'DRDO HSTDV Scramjet Coating', purityPercent: 99.5, specProp: 0.05, investmentCr: 880, status: 'In Transit', priority: 'Critical', origin: 'DRDO Hyderabad (TG)', destination: 'BHEL Hyderabad (TG)', shipDate: '2026-07-27', transitDays: 3, zone: 'Central', remarks: 'MoS2 99.5% hypersonic-grade for DRDO HSTDV scramjet thermal protection MoS2 coating &amp;#8594; 0.05 um &amp;#8594; &amp;#8377;880Cr for 15 tonnes &amp;#8594; India &amp;#8377;6,200Cr MoS2 hypersonic &amp;#8594; DRDO 10 vehicles &amp;#8594; 99.5% purity &amp;#8594; &amp;#8594; Plasma &amp;#8594; &amp;#8594; MoS2Hyp &amp;#8594; &amp;#8594; Defense' },
  { id: 'MDP-0014', batchNo: 'MDP-B2414', city: 'Rourkela', manufacturer: 'SAIL Lubricants', grade: 'MoS2 93% General', application: 'SAIL Rourkela Die Wear', purityPercent: 93.0, specProp: 0.3, investmentCr: 280, status: 'Delivered', priority: 'Low', origin: 'SAIL Rourkela (OD)', destination: 'SAIL Bhilai (CG)', shipDate: '2026-07-28', transitDays: 4, zone: 'East', remarks: 'MoS2 93% general die lubricant for SAIL Rourkela steel die forging wear reduction &amp;#8594; 0.30 um &amp;#8594; &amp;#8377;280Cr for 100 tonnes &amp;#8594; India &amp;#8377;2,000Cr MoS2 die &amp;#8594; SAIL 20 dies &amp;#8594; 93.0% purity &amp;#8594; &amp;#8594; Spray &amp;#8594; &amp;#8594; MoS2Gen &amp;#8594; &amp;#8594; Steel' },
];

export default function MolybdenumDisulphideLogisticsView() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterZone, setFilterZone] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Wrench },
    { id: 'registry', label: 'Registry', icon: Wrench },
    { id: 'analytics', label: 'Analytics', icon: Wrench },
    { id: 'insights', label: 'Insights', icon: Wrench },
  ];

  const filteredRecords = useMemo(() => {
    return molybdenumdisulphideRecords.filter((r) => {
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
    molybdenumdisulphideRecords.forEach((r) => { zMap[r.zone] = (zMap[r.zone] || 0) + 1; });
    return Object.entries(zMap).sort((a, b) => b[1] - a[1]);
  }, []);

  const kpiData = useMemo(() => {
    const total = molybdenumdisulphideRecords.reduce((s: number, r) => s + r.investmentCr, 0);
    const avgPurity = molybdenumdisulphideRecords.reduce((s: number, r) => s + r.purityPercent, 0) / molybdenumdisulphideRecords.length;
    const delayed = molybdenumdisulphideRecords.filter((r) => r.status === 'Delayed').length;
    const critical = molybdenumdisulphideRecords.filter((r) => r.priority === 'Critical').length;
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

  const themeColor = '#65a30d';
  return (
    <div className="space-y-6 p-6">
      <PageHeader title="Molybdenum Disulphide Logistics" description="Indian molybdenum disulphide logistics supply chain tracking across 14 grades spanning aerospace, defense, power, automotive, nuclear and industrial sectors" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-lime-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-lime-600">{kpiData.total.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground mt-1">Total Investment</div></CardContent></Card>
        <Card className="border-l-4 border-l-lime-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-lime-600">{kpiData.avgPurity}%</div><div className="text-xs text-muted-foreground mt-1">Avg Purity</div></CardContent></Card>
        <Card className="border-l-4 border-l-lime-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-lime-600">{kpiData.delayed}</div><div className="text-xs text-muted-foreground mt-1">Delayed Batches</div></CardContent></Card>
        <Card className="border-l-4 border-l-lime-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-lime-600">{kpiData.critical}</div><div className="text-xs text-muted-foreground mt-1">Critical Records</div></CardContent></Card>
      </div>
      <div className="flex flex-wrap gap-2 border-b pb-2">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 rounded-t-md text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-lime-500 text-white shadow-md' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
            {tab.label}
          </button>
        ))}
      </div>
      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-base">Zone Distribution</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">{zones.map(([zone, count]) => { const pct = (count as number / molybdenumdisulphideRecords.length) * 100; return <div key={zone} className="flex items-center gap-2"><span className="text-xs w-16 text-muted-foreground">{zone as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium w-8">{count as number}</span></div>; })}</div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Status Overview</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-2 gap-3">
              {['Delivered', 'In Transit', 'Delayed', 'Processing'].map((s) => { const c = molybdenumdisulphideRecords.filter((r) => r.status === s).length; return <div key={s} className={`text-center p-3 rounded-lg border ${statusColor(s)}`}><div className="text-lg font-bold">{c}</div><div className="text-xs">{s}</div></div>; })}
            </div>
          </CardContent></Card>
          <Card className="lg:col-span-2"><CardHeader><CardTitle className="text-base">Investment by Grade (Top 8)</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {molybdenumdisulphideRecords.slice(0, 8).map((r) => <div key={r.id} className="text-center p-3 rounded-lg border bg-muted/30"><div className="text-sm font-medium truncate">{r.grade}</div><div className="text-lg font-bold" style={{ color: themeColor }}>&#8377;{r.investmentCr}Cr</div><div className="text-xs text-muted-foreground">{r.application}</div></div>)}
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
                    <div className="flex justify-between"><span className="text-muted-foreground">Particle Size (um)</span><span className="font-medium">{record.specProp}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Investment:</span><span className="font-medium" style={{ color: themeColor }}>&#8377;{record.investmentCr}Cr</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">City:</span><span className="font-medium">{record.city}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Route:</span><span className="font-medium text-xs">{record.origin} &#8594; {record.destination}</span></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-sm text-muted-foreground">Showing {filteredRecords.length} of {molybdenumdisulphideRecords.length} records</div>
        </div>
      )}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-base">Manufacturer Performance</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">
              {(() => { const mfrMap: Record<string, number> = {}; molybdenumdisulphideRecords.forEach((r) => { mfrMap[r.manufacturer] = (mfrMap[r.manufacturer] || 0) + r.investmentCr; }); return Object.entries(mfrMap).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([mfr, inv]) => { const pct = (inv as number / kpiData.total) * 100; return <div key={mfr} className="flex items-center gap-2"><span className="text-xs w-40 truncate">{mfr as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">&#8377;{inv as number}Cr</span></div>; }); })()}
            </div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Priority Distribution</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-2 gap-3">
              {['Critical', 'High', 'Medium', 'Low'].map((p) => { const c = molybdenumdisulphideRecords.filter((r) => r.priority === p).length; return <div key={p} className={`text-center p-3 rounded-lg border ${priorityColor(p)}`}><div className="text-lg font-bold">{c}</div><div className="text-xs">{p}</div></div>; })}
            </div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Investment by Zone</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">{(() => { const zInv: Record<string, number> = {}; molybdenumdisulphideRecords.forEach((r) => { zInv[r.zone] = (zInv[r.zone] || 0) + r.investmentCr; }); return Object.entries(zInv).sort((a, b) => b[1] - a[1]).map(([zone, inv]) => { const pct = (inv as number / kpiData.total) * 100; return <div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">&#8377;{inv as number}Cr</span></div>; }); })()}</div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Purity Distribution</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">
              {(() => { const ranges = { '99%+': 0, '95-98.9%': 0, '90-94.9%': 0, '<90%': 0 }; molybdenumdisulphideRecords.forEach((r) => { if (r.purityPercent >= 99) ranges['99%+']++; else if (r.purityPercent >= 95) ranges['95-98.9%']++; else if (r.purityPercent >= 90) ranges['90-94.9%']++; else ranges['<90%']++; }); return (Object.entries(ranges) as [string, number][]).filter(([, v]) => v > 0).map(([range, count]) => { const pct = (count / molybdenumdisulphideRecords.length) * 100; return <div key={range} className="flex items-center gap-2"><span className="text-xs w-24">{range}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">{count}</span></div>; }); })()}
            </div>
          </CardContent></Card>
        </div>
      )}
      {activeTab === 'insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-base">Supply Chain Intelligence</CardTitle></CardHeader><CardContent><div className="space-y-3 text-sm">
            <div className="p-3 rounded-lg border-l-4 border-l-lime-500 bg-lime-50/50"><div className="font-medium">Aerospace &amp; Defense Lubrication</div><div className="text-xs text-muted-foreground mt-1">HAL Tejas gear &#8594; DRDO BrahMos gyro &#8594; DRDO HSTDV scramjet &#8594; &#8377;2,500Cr combined &#8594; critical solid lubricant</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-lime-500 bg-lime-50/50"><div className="font-medium">Naval &amp; Power</div><div className="text-xs text-muted-foreground mt-1">GRSE submarine prop shaft &#8594; L&amp;T gearbox &#8594; BHEL GT bearing &#8594; &#8377;2,220Cr combined &#8594; strategic assets</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-lime-500 bg-lime-50/50"><div className="font-medium">Industrial &amp; Mining</div><div className="text-xs text-muted-foreground mt-1">JSW cold rolling &#8594; Coal India hoist &#8594; Tata wind &#8594; &#8377;1,440Cr combined &#8594; heavy industry</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-lime-500 bg-lime-50/50"><div className="font-medium">Monsoon Alert</div><div className="text-xs text-muted-foreground mt-1">MDP-B2412 GRSE submarine prop shaft bearing delayed &#8594; monsoon Visakhapatnam &#8594; naval programme at risk</div></div>
          </div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Investment Landscape</CardTitle></CardHeader><CardContent><div className="space-y-3 text-sm">
            <div className="p-3 rounded-lg border-l-4 border-l-lime-500 bg-lime-50/50"><div className="font-medium">Total Portfolio: &#8377;8,760 Cr</div><div className="text-xs text-muted-foreground mt-1">Across 14 MoS2 grades spanning aerospace, defense, hypersonic, naval, GT, auto, wind, rail, mining, space, pipeline &#8594; avg purity 97.86%</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-lime-500 bg-lime-50/50"><div className="font-medium">Critical Priority: 7 Records</div><div className="text-xs text-muted-foreground mt-1">HAL &#8594; DRDO BrahMos &#8594; BHEL GT &#8594; ISRO EVA &#8594; GRSE submarine &#8594; DRDO HSTDV &#8594; L&amp;T naval</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-lime-500 bg-lime-50/50"><div className="font-medium">Top Manufacturers</div><div className="text-xs text-muted-foreground mt-1">MIDHANI &#8594; DRDO &#8594; BHEL &#8594; Godrej &#8594; Gujarat Lubricants &#8594; Tata Steel &#8594; Shyam Chemicals</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-lime-500 bg-lime-50/50"><div className="font-medium">Particle Size Spectrum</div><div className="text-xs text-muted-foreground mt-1">0.04-0.30 micron &#8594; space grade finest 0.04 um &#8594; general coarsest 0.30 &#8594; size critical to lubricity</div></div>
          </div></CardContent></Card>
        </div>
      )}
    </div>
  );
}
