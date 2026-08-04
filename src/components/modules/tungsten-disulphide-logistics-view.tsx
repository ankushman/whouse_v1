"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared';
import { Shield } from 'lucide-react';

interface TungstenDisulphideRecord {
  id: string; batchNo: string; city: string; manufacturer: string; grade: string;
  application: string; purityPercent: number; specProp: number; investmentCr: number;
  status: string; priority: string; origin: string; destination: string;
  shipDate: string; transitDays: number; zone: string; remarks: string;
};

const tungstendisulphideRecords: TungstenDisulphideRecord[] = [
  { id: 'TDS-0001', batchNo: 'TDS-B2401', city: 'Mumbai', manufacturer: 'MIDHANI', grade: 'WS2 99.9% Aerospace', application: 'HAL Tejas Mk2 Wing Flap Bearing', purityPercent: 99.9, specProp: 0.08, investmentCr: 860, status: 'Delivered', priority: 'Critical', origin: 'MIDHANI Hyderabad (TG)', destination: 'HAL Bengaluru (KA)', shipDate: '2026-07-15', transitDays: 1, zone: 'West', remarks: 'WS2 99.9% aerospace-grade for HAL Tejas Mk2 wing flap bearing dry film lubricant &amp;#8594; 0.08 um &amp;#8594; &amp;#8377;860Cr for 20 tonnes &amp;#8594; India &amp;#8377;6,400Cr WS2 aero &amp;#8594; HAL 40 aircraft &amp;#8594; 99.9% purity &amp;#8594; &amp;#8594; Powder &amp;#8594; &amp;#8594; WS2Aero &amp;#8594; &amp;#8594; Aerospace' },
  { id: 'TDS-0002', batchNo: 'TDS-B2402', city: 'Bengaluru', manufacturer: 'DRDO DMRL', grade: 'WS2 99.5% Missile Seeker', application: 'DRDO BrahMos Mk2 Canard Pivot', purityPercent: 99.5, specProp: 0.1, investmentCr: 800, status: 'In Transit', priority: 'Critical', origin: 'DRDO Hyderabad (TG)', destination: 'BEL Bengaluru (KA)', shipDate: '2026-07-16', transitDays: 2, zone: 'South', remarks: 'WS2 99.5% missile-grade for DRDO BrahMos Mk2 canard pivot bearing dry film &amp;#8594; 0.10 um &amp;#8594; &amp;#8377;800Cr for 25 tonnes &amp;#8594; India &amp;#8377;5,600Cr WS2 missile &amp;#8594; DRDO 200 missiles &amp;#8594; 99.5% purity &amp;#8594; &amp;#8594; Film &amp;#8594; &amp;#8594; WS2Msl &amp;#8594; &amp;#8594; Defense' },
  { id: 'TDS-0003', batchNo: 'TDS-B2403', city: 'Chennai', manufacturer: 'Tata Steel', grade: 'WS2 98% Metal Forming', application: 'JSW Steel Hot Rolling Mill', purityPercent: 98.0, specProp: 0.18, investmentCr: 660, status: 'Delivered', priority: 'High', origin: 'Tata Steel Jamshedpur (JH)', destination: 'JSW Vijayanagar (KA)', shipDate: '2026-07-17', transitDays: 3, zone: 'South', remarks: 'WS2 98% forming-grade for JSW steel hot rolling mill work roll lubricant coating &amp;#8594; 0.18 um &amp;#8594; &amp;#8377;660Cr for 55 tonnes &amp;#8594; India &amp;#8377;4,400Cr WS2 steel &amp;#8594; JSW 12 mills &amp;#8594; 98.0% purity &amp;#8594; &amp;#8594; Spray &amp;#8594; &amp;#8594; WS2Form &amp;#8594; &amp;#8594; Steel' },
  { id: 'TDS-0004', batchNo: 'TDS-B2404', city: 'Hyderabad', manufacturer: 'Bharat Forge', grade: 'WS2 97% Auto Transmission', application: 'Mahindra XUV400 Gearbox Syncro', purityPercent: 97.0, specProp: 0.12, investmentCr: 480, status: 'Delivered', priority: 'High', origin: 'Bharat Forge Pune (MH)', destination: 'Mahindra Pune (MH)', shipDate: '2026-07-18', transitDays: 4, zone: 'West', remarks: 'WS2 97% auto-grade for Mahindra XUV400 gearbox synchronizer ring WS2 coating &amp;#8594; 0.12 um &amp;#8594; &amp;#8377;480Cr for 35 tonnes &amp;#8594; India &amp;#8377;3,200Cr WS2 auto &amp;#8594; Mahindra 50K gearboxes &amp;#8594; 97.0% purity &amp;#8594; &amp;#8594; Bond &amp;#8594; &amp;#8594; WS2Auto &amp;#8594; &amp;#8594; Automotive' },
  { id: 'TDS-0005', batchNo: 'TDS-B2405', city: 'Kolkata', manufacturer: 'Shyam Lubricants', grade: 'WS2 96% Naval Coating', application: 'L&amp;T Warship Deck Winch', purityPercent: 96.0, specProp: 0.15, investmentCr: 560, status: 'In Transit', priority: 'High', origin: 'Shyam Lub Kolkata (WB)', destination: 'L&amp;T Kattupalli (TN)', shipDate: '2026-07-19', transitDays: 5, zone: 'East', remarks: 'WS2 96% naval-grade for L&amp;amp;T warship deck winch gear marine lubricant &amp;#8594; 0.15 um &amp;#8594; &amp;#8377;560Cr for 45 tonnes &amp;#8594; India &amp;#8377;3,800Cr WS2 naval &amp;#8594; L&amp;amp;T 30 warships &amp;#8594; 96.0% purity &amp;#8594; &amp;#8594; Grease &amp;#8594; &amp;#8594; WS2Nav &amp;#8594; &amp;#8594; Naval' },
  { id: 'TDS-0006', batchNo: 'TDS-B2406', city: 'Coimbatore', manufacturer: 'BHEL R&amp;D', grade: 'WS2 99% Turbine Blade Root', application: 'BHEL 800MW GT Blade Root', purityPercent: 99.0, specProp: 0.08, investmentCr: 740, status: 'Delivered', priority: 'Critical', origin: 'BHEL Bhopal (MP)', destination: 'BHEL Hyderabad (TG)', shipDate: '2026-07-20', transitDays: 1, zone: 'South', remarks: 'WS2 99% turbine-grade for BHEL 800MW GT blade root dovetail anti-fretting &amp;#8594; 0.08 um &amp;#8594; &amp;#8377;740Cr for 30 tonnes &amp;#8594; India &amp;#8377;5,200Cr WS2 GT &amp;#8594; BHEL 20 GTs &amp;#8594; 99.0% purity &amp;#8594; &amp;#8594; Sputter &amp;#8594; &amp;#8594; WS2GT &amp;#8594; &amp;#8594; Power' },
  { id: 'TDS-0007', batchNo: 'TDS-B2407', city: 'Pune', manufacturer: 'Godrej Specialty', grade: 'WS2 98% Vacuum Pump', application: 'ISRO LPSC Cryo Turbo Pump', purityPercent: 98.0, specProp: 0.12, investmentCr: 720, status: 'Delivered', priority: 'Critical', origin: 'Godrej Mumbai (MH)', destination: 'ISRO Thiruvananthapuram (KL)', shipDate: '2026-07-21', transitDays: 2, zone: 'West', remarks: 'WS2 98% vacuum-grade for ISRO LPSC cryogenic turbo pump bearing WS2 coating &amp;#8594; 0.12 um &amp;#8594; &amp;#8377;720Cr for 15 tonnes &amp;#8594; India &amp;#8377;5,000Cr WS2 space &amp;#8594; ISRO 6 engines &amp;#8594; 98.0% purity &amp;#8594; &amp;#8594; Dispersion &amp;#8594; &amp;#8594; WS2Space &amp;#8594; &amp;#8594; Space' },
  { id: 'TDS-0008', batchNo: 'TDS-B2408', city: 'Jaipur', manufacturer: 'Rajasthan Lubricants', grade: 'WS2 95% Rail Curve', application: 'Indian Railways Slew Ring', purityPercent: 95.0, specProp: 0.22, investmentCr: 340, status: 'Delivered', priority: 'Medium', origin: 'Rajasthan Lub Jodhpur (RJ)', destination: 'BWEL Jhansi (UP)', shipDate: '2026-07-22', transitDays: 3, zone: 'West', remarks: 'WS2 95% rail-grade for Indian Railways crane slew ring anti-seize compound &amp;#8594; 0.22 um &amp;#8594; &amp;#8377;340Cr for 70 tonnes &amp;#8594; India &amp;#8377;2,200Cr WS2 rail &amp;#8594; IR 5K slew rings &amp;#8594; 95.0% purity &amp;#8594; &amp;#8594; Paste &amp;#8594; &amp;#8594; WS2Rail &amp;#8594; &amp;#8594; Rail' },
  { id: 'TDS-0009', batchNo: 'TDS-B2409', city: 'Guwahati', manufacturer: 'Assam Specialty', grade: 'WS2 94% Mining Drill', application: 'Coal India TBM Cutter Bearing', purityPercent: 94.0, specProp: 0.28, investmentCr: 380, status: 'In Transit', priority: 'Medium', origin: 'Assam Specialty Tezpur (AS)', destination: 'Coal India Ranchi (JH)', shipDate: '2026-07-23', transitDays: 4, zone: 'East', remarks: 'WS2 94% mining-grade for Coal India TBM cutter bearing anti-wear paste &amp;#8594; 0.28 um &amp;#8594; &amp;#8377;380Cr for 60 tonnes &amp;#8594; India &amp;#8377;2,600Cr WS2 mining &amp;#8594; Coal India 40 mines &amp;#8594; 94.0% purity &amp;#8594; &amp;#8594; Paste &amp;#8594; &amp;#8594; WS2Mine &amp;#8594; &amp;#8594; Mining' },
  { id: 'TDS-0010', batchNo: 'TDS-B2410', city: 'Ahmedabad', manufacturer: 'Gujarat Specialty', grade: 'WS2 99.8% Semiconductor', application: 'SCL Silicon CMP Process', purityPercent: 99.8, specProp: 0.05, investmentCr: 900, status: 'Delivered', priority: 'Critical', origin: 'Gujarat Specialty Ahmedabad (GJ)', destination: 'SCL Mohali (PB)', shipDate: '2026-07-24', transitDays: 5, zone: 'West', remarks: 'WS2 99.8% semi-grade for SCL silicon wafer CMP process WS2 slurry additive &amp;#8594; 0.05 um &amp;#8594; &amp;#8377;900Cr for 8 tonnes &amp;#8594; India &amp;#8377;7,200Cr WS2 semi &amp;#8594; SCL 100K wafers &amp;#8594; 99.8% purity &amp;#8594; &amp;#8594; Slurry &amp;#8594; &amp;#8594; WS2Semi &amp;#8594; &amp;#8594; Semiconductor' },
  { id: 'TDS-0011', batchNo: 'TDS-B2411', city: 'Lucknow', manufacturer: 'UP Specialty', grade: 'WS2 97% Tool Bit', application: 'Bharat Forge Hot Die Tool', purityPercent: 97.0, specProp: 0.15, investmentCr: 400, status: 'Delivered', priority: 'Medium', origin: 'UP Specialty Kanpur (UP)', destination: 'Bharat Forge Pune (MH)', shipDate: '2026-07-25', transitDays: 1, zone: 'North', remarks: 'WS2 97% tool-grade for Bharat Forge hot die forging tool anti-galling coating &amp;#8594; 0.15 um &amp;#8594; &amp;#8377;400Cr for 40 tonnes &amp;#8594; India &amp;#8377;2,800Cr WS2 tool &amp;#8594; Bharat Forge 5M forgings &amp;#8594; 97.0% purity &amp;#8594; &amp;#8594; Spray &amp;#8594; &amp;#8594; WS2Tool &amp;#8594; &amp;#8594; Manufacturing' },
  { id: 'TDS-0012', batchNo: 'TDS-B2412', city: 'Visakhapatnam', manufacturer: 'Vizag Specialty', grade: 'WS2 99% Submarine Prop Shaft', application: 'GRSE Project 75I Shaft Seal', purityPercent: 99.0, specProp: 0.07, investmentCr: 940, status: 'Delayed', priority: 'Critical', origin: 'Vizag Specialty Visakhapatnam (AP)', destination: 'GRSE Kolkata (WB)', shipDate: '2026-07-26', transitDays: 2, zone: 'East', remarks: 'WS2 99% submarine-grade for GRSE Project 75I propeller shaft seal dry film &amp;#8597; 0.07 um &amp;#8597; &amp;#8377;940Cr for 18 tonnes &amp;#8597; India &amp;#8377;7,600Cr WS2 submarine &amp;#8597; GRSE 6 submarines &amp;#8597; 99.0% purity &amp;#8597; &amp;#8594; Film &amp;#8597; &amp;#8594; WS2Sub &amp;#8597; &amp;#8594; Naval' },
  { id: 'TDS-0013', batchNo: 'TDS-B2413', city: 'Bhopal', manufacturer: 'DRDO TBRL', grade: 'WS2 99.5% Hypersonic TPS', application: 'DRDO HSTDV Nose Cone', purityPercent: 99.5, specProp: 0.06, investmentCr: 880, status: 'In Transit', priority: 'Critical', origin: 'DRDO Hyderabad (TG)', destination: 'BHEL Hyderabad (TG)', shipDate: '2026-07-27', transitDays: 3, zone: 'Central', remarks: 'WS2 99.5% hypersonic-grade for DRDO HSTDV nose cone thermal protection coating &amp;#8594; 0.06 um &amp;#8594; &amp;#8377;880Cr for 12 tonnes &amp;#8594; India &amp;#8377;6,200Cr WS2 hypersonic &amp;#8594; DRDO 10 vehicles &amp;#8594; 99.5% purity &amp;#8594; &amp;#8594; Plasma &amp;#8594; &amp;#8594; WS2Hyp &amp;#8594; &amp;#8594; Defense' },
  { id: 'TDS-0014', batchNo: 'TDS-B2414', city: 'Rourkela', manufacturer: 'SAIL Specialty', grade: 'WS2 93% General Forge', application: 'SAIL Rourkela Press Die', purityPercent: 93.0, specProp: 0.35, investmentCr: 300, status: 'Delivered', priority: 'Low', origin: 'SAIL Rourkela (OD)', destination: 'SAIL Bhilai (CG)', shipDate: '2026-07-28', transitDays: 4, zone: 'East', remarks: 'WS2 93% general forge die lubricant for SAIL Rourkela press die anti-stick &amp;#8594; 0.35 um &amp;#8594; &amp;#8377;300Cr for 90 tonnes &amp;#8594; India &amp;#8377;2,000Cr WS2 die &amp;#8594; SAIL 20 presses &amp;#8594; 93.0% purity &amp;#8594; &amp;#8594; Spray &amp;#8594; &amp;#8594; WS2Gen &amp;#8594; &amp;#8594; Steel' },
];

export default function TungstenDisulphideLogisticsView() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterZone, setFilterZone] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Shield },
    { id: 'registry', label: 'Registry', icon: Shield },
    { id: 'analytics', label: 'Analytics', icon: Shield },
    { id: 'insights', label: 'Insights', icon: Shield },
  ];

  const filteredRecords = useMemo(() => {
    return tungstendisulphideRecords.filter((r) => {
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
    tungstendisulphideRecords.forEach((r) => { zMap[r.zone] = (zMap[r.zone] || 0) + 1; });
    return Object.entries(zMap).sort((a, b) => b[1] - a[1]);
  }, []);

  const kpiData = useMemo(() => {
    const total = tungstendisulphideRecords.reduce((s: number, r) => s + r.investmentCr, 0);
    const avgPurity = tungstendisulphideRecords.reduce((s: number, r) => s + r.purityPercent, 0) / tungstendisulphideRecords.length;
    const delayed = tungstendisulphideRecords.filter((r) => r.status === 'Delayed').length;
    const critical = tungstendisulphideRecords.filter((r) => r.priority === 'Critical').length;
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

  const themeColor = '#7c3aed';
  return (
    <div className="space-y-6 p-6">
      <PageHeader title="Tungsten Disulphide Logistics" description="Indian tungsten disulphide logistics supply chain tracking across 14 grades spanning aerospace, defense, semiconductor, nuclear and industrial sectors" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-violet-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-violet-600">{kpiData.total.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground mt-1">Total Investment</div></CardContent></Card>
        <Card className="border-l-4 border-l-violet-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-violet-600">{kpiData.avgPurity}%</div><div className="text-xs text-muted-foreground mt-1">Avg Purity</div></CardContent></Card>
        <Card className="border-l-4 border-l-violet-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-violet-600">{kpiData.delayed}</div><div className="text-xs text-muted-foreground mt-1">Delayed Batches</div></CardContent></Card>
        <Card className="border-l-4 border-l-violet-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-violet-600">{kpiData.critical}</div><div className="text-xs text-muted-foreground mt-1">Critical Records</div></CardContent></Card>
      </div>
      <div className="flex flex-wrap gap-2 border-b pb-2">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 rounded-t-md text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-violet-500 text-white shadow-md' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
            {tab.label}
          </button>
        ))}
      </div>
      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-base">Zone Distribution</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">{zones.map(([zone, count]) => { const pct = (count as number / tungstendisulphideRecords.length) * 100; return <div key={zone} className="flex items-center gap-2"><span className="text-xs w-16 text-muted-foreground">{zone as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium w-8">{count as number}</span></div>; })}</div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Status Overview</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-2 gap-3">
              {['Delivered', 'In Transit', 'Delayed', 'Processing'].map((s) => { const c = tungstendisulphideRecords.filter((r) => r.status === s).length; return <div key={s} className={`text-center p-3 rounded-lg border ${statusColor(s)}`}><div className="text-lg font-bold">{c}</div><div className="text-xs">{s}</div></div>; })}
            </div>
          </CardContent></Card>
          <Card className="lg:col-span-2"><CardHeader><CardTitle className="text-base">Investment by Grade (Top 8)</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {tungstendisulphideRecords.slice(0, 8).map((r) => <div key={r.id} className="text-center p-3 rounded-lg border bg-muted/30"><div className="text-sm font-medium truncate">{r.grade}</div><div className="text-lg font-bold" style={{ color: themeColor }}>&#8377;{r.investmentCr}Cr</div><div className="text-xs text-muted-foreground">{r.application}</div></div>)}
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
          <div className="text-sm text-muted-foreground">Showing {filteredRecords.length} of {tungstendisulphideRecords.length} records</div>
        </div>
      )}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-base">Manufacturer Performance</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">
              {(() => { const mfrMap: Record<string, number> = {}; tungstendisulphideRecords.forEach((r) => { mfrMap[r.manufacturer] = (mfrMap[r.manufacturer] || 0) + r.investmentCr; }); return Object.entries(mfrMap).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([mfr, inv]) => { const pct = (inv as number / kpiData.total) * 100; return <div key={mfr} className="flex items-center gap-2"><span className="text-xs w-40 truncate">{mfr as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">&#8377;{inv as number}Cr</span></div>; }); })()}
            </div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Priority Distribution</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-2 gap-3">
              {['Critical', 'High', 'Medium', 'Low'].map((p) => { const c = tungstendisulphideRecords.filter((r) => r.priority === p).length; return <div key={p} className={`text-center p-3 rounded-lg border ${priorityColor(p)}`}><div className="text-lg font-bold">{c}</div><div className="text-xs">{p}</div></div>; })}
            </div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Investment by Zone</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">{(() => { const zInv: Record<string, number> = {}; tungstendisulphideRecords.forEach((r) => { zInv[r.zone] = (zInv[r.zone] || 0) + r.investmentCr; }); return Object.entries(zInv).sort((a, b) => b[1] - a[1]).map(([zone, inv]) => { const pct = (inv as number / kpiData.total) * 100; return <div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">&#8377;{inv as number}Cr</span></div>; }); })()}</div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Purity Distribution</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">
              {(() => { const ranges = { '99%+': 0, '95-98.9%': 0, '90-94.9%': 0, '<90%': 0 }; tungstendisulphideRecords.forEach((r) => { if (r.purityPercent >= 99) ranges['99%+']++; else if (r.purityPercent >= 95) ranges['95-98.9%']++; else if (r.purityPercent >= 90) ranges['90-94.9%']++; else ranges['<90%']++; }); return (Object.entries(ranges) as [string, number][]).filter(([, v]) => v > 0).map(([range, count]) => { const pct = (count / tungstendisulphideRecords.length) * 100; return <div key={range} className="flex items-center gap-2"><span className="text-xs w-24">{range}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">{count}</span></div>; }); })()}
            </div>
          </CardContent></Card>
        </div>
      )}
      {activeTab === 'insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-base">Supply Chain Intelligence</CardTitle></CardHeader><CardContent><div className="space-y-3 text-sm">
            <div className="p-3 rounded-lg border-l-4 border-l-violet-500 bg-violet-50/50"><div className="font-medium">Aerospace &amp; Hypersonic Lubrication</div><div className="text-xs text-muted-foreground mt-1">HAL Tejas flap bearing &#8594; DRDO BrahMos canard &#8594; DRDO HSTDV nose cone &#8594; &#8377;2,540Cr combined &#8594; WS2 superior to MoS2 at 450+ degC</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-violet-500 bg-violet-50/50"><div className="font-medium">Space &amp; Semiconductor</div><div className="text-xs text-muted-foreground mt-1">ISRO cryo turbo pump &#8594; SCL CMP slurry &#8594; &#8377;1,620Cr combined &#8594; ultra-high purity critical</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-violet-500 bg-violet-50/50"><div className="font-medium">Naval &amp; Power</div><div className="text-xs text-muted-foreground mt-1">GRSE submarine shaft seal &#8594; L&amp;T deck winch &#8594; BHEL GT blade root &#8594; &#8377;2,240Cr combined &#8594; extreme environment assets</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-violet-500 bg-violet-50/50"><div className="font-medium">Monsoon Alert</div><div className="text-xs text-muted-foreground mt-1">TDS-B2412 GRSE Project 75I shaft seal delayed &#8594; monsoon Visakhapatnam &#8594; submarine programme at risk</div></div>
          </div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Investment Landscape</CardTitle></CardHeader><CardContent><div className="space-y-3 text-sm">
            <div className="p-3 rounded-lg border-l-4 border-l-violet-500 bg-violet-50/50"><div className="font-medium">Total Portfolio: &#8377;8,760 Cr</div><div className="text-xs text-muted-foreground mt-1">Across 14 WS2 grades spanning aerospace, hypersonic, naval, GT, cryo, semiconductor, auto, rail, mining, forging &#8594; avg purity 97.86%</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-violet-500 bg-violet-50/50"><div className="font-medium">Critical Priority: 7 Records</div><div className="text-xs text-muted-foreground mt-1">HAL &#8594; DRDO BrahMos &#8594; BHEL GT &#8594; ISRO &#8594; SCL &#8594; GRSE &#8594; DRDO HSTDV</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-violet-500 bg-violet-50/50"><div className="font-medium">Top Manufacturers</div><div className="text-xs text-muted-foreground mt-1">MIDHANI &#8594; DRDO &#8594; BHEL &#8594; Godrej &#8594; Gujarat Specialty &#8594; Tata Steel &#8594; Shyam Lubricants</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-violet-500 bg-violet-50/50"><div className="font-medium">Particle Size Spectrum</div><div className="text-xs text-muted-foreground mt-1">0.05-0.35 micron &#8594; semiconductor finest 0.05 um &#8594; general coarsest 0.35 &#8594; WS2 2x thermal stability vs MoS2</div></div>
          </div></CardContent></Card>
        </div>
      )}
    </div>
  );
}
