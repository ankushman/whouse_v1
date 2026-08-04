"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared';
import { Sword } from 'lucide-react';

interface TitaniumDiborideRecord {
  id: string; batchNo: string; city: string; manufacturer: string; grade: string;
  application: string; purityPercent: number; specProp: number; investmentCr: number;
  status: string; priority: string; origin: string; destination: string;
  shipDate: string; transitDays: number; zone: string; remarks: string;
};

const titaniumdiborideRecords: TitaniumDiborideRecord[] = [
  { id: 'TDB-0001', batchNo: 'TDB-B2401', city: 'Mumbai', manufacturer: 'MIDHANI', grade: 'TiB2 99.5% Body Armor', application: 'DRDO BIS Level IV Plate', purityPercent: 99.5, specProp: 34.0, investmentCr: 920, status: 'Delivered', priority: 'Critical', origin: 'MIDHANI Hyderabad (TG)', destination: 'DRDO Pune (MH)', shipDate: '2026-07-15', transitDays: 1, zone: 'West', remarks: 'TiB2 99.5% armor-grade for DRDO BIS Level IV body armor ceramic strike face &amp;#8594; 34 GPa &amp;#8594; &amp;#8377;920Cr for 80 tonnes &amp;#8594; India &amp;#8377;7,200Cr TiB2 armor &amp;#8594; DRDO 500K plates &amp;#8594; 99.5% purity &amp;#8594; &amp;#8594; Plate &amp;#8594; &amp;#8594; TiB2Armor &amp;#8594; &amp;#8594; Defense' },
  { id: 'TDB-0002', batchNo: 'TDB-B2402', city: 'Bengaluru', manufacturer: 'DRDO DMRL', grade: 'TiB2 99.8% Aerospace Composite', application: 'HAL Tejas Mk2 Brake Disc', purityPercent: 99.8, specProp: 35.0, investmentCr: 860, status: 'In Transit', priority: 'Critical', origin: 'DRDO Hyderabad (TG)', destination: 'HAL Bengaluru (KA)', shipDate: '2026-07-16', transitDays: 2, zone: 'South', remarks: 'TiB2 99.8% aero-grade for HAL Tejas Mk2 carbon-carbon brake disc TiB2 reinforced &amp;#8594; 35 GPa &amp;#8594; &amp;#8377;860Cr for 25 tonnes &amp;#8594; India &amp;#8377;6,400Cr TiB2 aero &amp;#8594; HAL 40 aircraft &amp;#8594; 99.8% purity &amp;#8594; &amp;#8594; Powder &amp;#8594; &amp;#8594; TiB2Aero &amp;#8594; &amp;#8594; Aerospace' },
  { id: 'TDB-0003', batchNo: 'TDB-B2403', city: 'Chennai', manufacturer: 'Tata Steel', grade: 'TiB2 99% Evaporation Boat', application: 'JSW Steel Al Coating', purityPercent: 99.0, specProp: 33.0, investmentCr: 680, status: 'Delivered', priority: 'High', origin: 'Tata Steel Jamshedpur (JH)', destination: 'JSW Vijayanagar (KA)', shipDate: '2026-07-17', transitDays: 3, zone: 'South', remarks: 'TiB2 99% coating-grade for JSW steel aluminum PVD evaporation boat &amp;#8594; 33 GPa &amp;#8594; &amp;#8377;680Cr for 60 tonnes &amp;#8594; India &amp;#8377;4,600Cr TiB2 coat &amp;#8594; JSW 12 lines &amp;#8594; 99.0% purity &amp;#8594; &amp;#8594; Boat &amp;#8594; &amp;#8594; TiB2Coat &amp;#8594; &amp;#8594; Steel' },
  { id: 'TDB-0004', batchNo: 'TDB-B2404', city: 'Hyderabad', manufacturer: 'Bharat Forge', grade: 'TiB2 99.2% Cutting Tool', application: 'Bharat Forge CNC Insert', purityPercent: 99.2, specProp: 33.5, investmentCr: 580, status: 'Delivered', priority: 'High', origin: 'Bharat Forge Pune (MH)', destination: 'Bharat Forge Baramati (MH)', shipDate: '2026-07-18', transitDays: 4, zone: 'South', remarks: 'TiB2 99.2% tool-grade for Bharat Forge CNC turning insert TiB2 coated carbide &amp;#8594; 33.5 GPa &amp;#8594; &amp;#8377;580Cr for 40 tonnes &amp;#8594; India &amp;#8377;3,800Cr TiB2 tool &amp;#8594; Bharat Forge 5M inserts &amp;#8594; 99.2% purity &amp;#8594; &amp;#8594; Insert &amp;#8594; &amp;#8594; TiB2Tool &amp;#8594; &amp;#8594; Manufacturing' },
  { id: 'TDB-0005', batchNo: 'TDB-B2405', city: 'Kolkata', manufacturer: 'Shyam Ceramics', grade: 'TiB2 98.5% Wear Resistant', application: 'L&amp;T Naval Pump Seal', purityPercent: 98.5, specProp: 32.0, investmentCr: 560, status: 'In Transit', priority: 'High', origin: 'Shyam Cer Kolkata (WB)', destination: 'L&amp;T Kattupalli (TN)', shipDate: '2026-07-19', transitDays: 5, zone: 'East', remarks: 'TiB2 98.5% wear-grade for L&amp;amp;T warship pump mechanical seal TiB2 face &amp;#8594; 32 GPa &amp;#8594; &amp;#8377;560Cr for 35 tonnes &amp;#8594; India &amp;#8377;3,800Cr TiB2 naval &amp;#8594; L&amp;amp;T 30 warships &amp;#8594; 98.5% purity &amp;#8594; &amp;#8594; Seal &amp;#8594; &amp;#8594; TiB2Nav &amp;#8594; &amp;#8594; Naval' },
  { id: 'TDB-0006', batchNo: 'TDB-B2406', city: 'Coimbatore', manufacturer: 'BHEL R&amp;D', grade: 'TiB2 99.6% Nuclear Absorber', application: 'IGCAR PFBR Control Rod', purityPercent: 99.6, specProp: 34.5, investmentCr: 780, status: 'Delivered', priority: 'Critical', origin: 'BHEL Bhopal (MP)', destination: 'IGCAR Kalpakkam (TN)', shipDate: '2026-07-20', transitDays: 1, zone: 'South', remarks: 'TiB2 99.6% nuclear-grade for IGCAR PFBR fast breeder neutron absorber control rod &amp;#8594; 34.5 GPa &amp;#8594; &amp;#8377;780Cr for 20 tonnes &amp;#8594; India &amp;#8377;5,400Cr TiB2 nuclear &amp;#8594; IGCAR 2 reactors &amp;#8594; 99.6% purity &amp;#8594; &amp;#8594; Pellet &amp;#8594; &amp;#8594; TiB2Nuc &amp;#8594; &amp;#8594; Nuclear' },
  { id: 'TDB-0007', batchNo: 'TDB-B2407', city: 'Pune', manufacturer: 'Godrej Ceramics', grade: 'TiB2 99.3% Rocket Nozzle', application: 'DRDO Akash Mk2 Nozzle', purityPercent: 99.3, specProp: 34.0, investmentCr: 740, status: 'Delivered', priority: 'Critical', origin: 'Godrej Mumbai (MH)', destination: 'DRDO Hyderabad (TG)', shipDate: '2026-07-21', transitDays: 2, zone: 'West', remarks: 'TiB2 99.3% rocket-grade for DRDO Akash Mk2 solid rocket nozzle throat insert &amp;#8594; 34 GPa &amp;#8594; &amp;#8377;740Cr for 15 tonnes &amp;#8594; India &amp;#8377;5,200Cr TiB2 rocket &amp;#8594; DRDO 500 missiles &amp;#8594; 99.3% purity &amp;#8594; &amp;#8594; Insert &amp;#8594; &amp;#8594; TiB2Rocket &amp;#8594; &amp;#8594; Defense' },
  { id: 'TDB-0008', batchNo: 'TDB-B2408', city: 'Jaipur', manufacturer: 'Rajasthan Ceramics', grade: 'TiB2 98% Metallurgical', application: 'Indian Railways Brake Block', purityPercent: 98.0, specProp: 31.0, investmentCr: 420, status: 'Delivered', priority: 'Medium', origin: 'Rajasthan Cer Jodhpur (RJ)', destination: 'BWEL Jhansi (UP)', shipDate: '2026-07-22', transitDays: 3, zone: 'West', remarks: 'TiB2 98% rail-grade for Indian Railways locomotive composite brake block TiB2 friction &amp;#8594; 31 GPa &amp;#8594; &amp;#8377;420Cr for 80 tonnes &amp;#8594; India &amp;#8377;2,800Cr TiB2 rail &amp;#8594; IR 200K blocks &amp;#8594; 98.0% purity &amp;#8594; &amp;#8594; Block &amp;#8594; &amp;#8594; TiB2Rail &amp;#8594; &amp;#8594; Rail' },
  { id: 'TDB-0009', batchNo: 'TDB-B2409', city: 'Guwahati', manufacturer: 'Assam Ceramics', grade: 'TiB2 97% Welding Electrode', application: 'Coal India Weld Hardfacing', purityPercent: 97.0, specProp: 30.0, investmentCr: 400, status: 'In Transit', priority: 'Medium', origin: 'Assam Cer Tezpur (AS)', destination: 'Coal India Ranchi (JH)', shipDate: '2026-07-23', transitDays: 4, zone: 'East', remarks: 'TiB2 97% weld-grade for Coal India mining excavator bucket hardfacing electrode &amp;#8594; 30 GPa &amp;#8594; &amp;#8377;400Cr for 60 tonnes &amp;#8594; India &amp;#8377;2,600Cr TiB2 mining &amp;#8594; Coal India 40 mines &amp;#8594; 97.0% purity &amp;#8594; &amp;#8594; Rod &amp;#8594; &amp;#8594; TiB2Mine &amp;#8594; &amp;#8594; Mining' },
  { id: 'TDB-0010', batchNo: 'TDB-B2410', city: 'Ahmedabad', manufacturer: 'Gujarat Ceramics', grade: 'TiB2 99.7% Hypersonic Leading', application: 'DRDO HSTDV Nose Tip', purityPercent: 99.7, specProp: 35.0, investmentCr: 900, status: 'Delivered', priority: 'Critical', origin: 'Gujarat Cer Ahmedabad (GJ)', destination: 'BHEL Hyderabad (TG)', shipDate: '2026-07-24', transitDays: 5, zone: 'West', remarks: 'TiB2 99.7% hypersonic-grade for DRDO HSTDV scramjet nose tip ultra-high temp &amp;#8594; 35 GPa &amp;#8594; &amp;#8377;900Cr for 10 tonnes &amp;#8594; India &amp;#8377;7,200Cr TiB2 hypersonic &amp;#8594; DRDO 10 vehicles &amp;#8594; 99.7% purity &amp;#8594; &amp;#8594; Cone &amp;#8594; &amp;#8594; TiB2Hyp &amp;#8594; &amp;#8594; Defense' },
  { id: 'TDB-0011', batchNo: 'TDB-B2411', city: 'Lucknow', manufacturer: 'UP Ceramics', grade: 'TiB2 99% Thermocouple', application: 'BHEL 800MW GT TC Sheath', purityPercent: 99.0, specProp: 33.0, investmentCr: 500, status: 'Delivered', priority: 'Medium', origin: 'UP Cer Kanpur (UP)', destination: 'BHEL Hyderabad (TG)', shipDate: '2026-07-25', transitDays: 1, zone: 'North', remarks: 'TiB2 99% thermocouple-grade for BHEL 800MW GT Type K thermocouple sheath &amp;#8594; 33 GPa &amp;#8594; &amp;#8377;500Cr for 40 tonnes &amp;#8594; India &amp;#8377;3,200Cr TiB2 TC &amp;#8594; BHEL 20 GTs &amp;#8594; 99.0% purity &amp;#8594; &amp;#8594; Tube &amp;#8594; &amp;#8594; TiB2TC &amp;#8594; &amp;#8594; Power' },
  { id: 'TDB-0012', batchNo: 'TDB-B2412', city: 'Visakhapatnam', manufacturer: 'Vizag Ceramics', grade: 'TiB2 99.6% Submarine Torpedo', application: 'GRSE Project 75I Torpedo Tube', purityPercent: 99.6, specProp: 34.5, investmentCr: 940, status: 'Delayed', priority: 'Critical', origin: 'Vizag Cer Visakhapatnam (AP)', destination: 'GRSE Kolkata (WB)', shipDate: '2026-07-26', transitDays: 2, zone: 'East', remarks: 'TiB2 99.6% submarine-grade for GRSE Project 75I torpedo tube launcher wear liner &amp;#8597; 34.5 GPa &amp;#8597; &amp;#8377;940Cr for 18 tonnes &amp;#8597; India &amp;#8377;7,600Cr TiB2 submarine &amp;#8597; GRSE 6 submarines &amp;#8597; 99.6% purity &amp;#8597; &amp;#8594; Liner &amp;#8597; &amp;#8594; TiB2Sub &amp;#8597; &amp;#8594; Naval' },
  { id: 'TDB-0013', batchNo: 'TDB-B2413', city: 'Bhopal', manufacturer: 'DRDO TBRL', grade: 'TiB2 99.5% Missile Radome', application: 'DRDO BrahMos Mk2 Radome', purityPercent: 99.5, specProp: 34.0, investmentCr: 880, status: 'In Transit', priority: 'Critical', origin: 'DRDO Hyderabad (TG)', destination: 'BEL Bengaluru (KA)', shipDate: '2026-07-27', transitDays: 3, zone: 'Central', remarks: 'TiB2 99.5% missile-grade for DRDO BrahMos Mk2 radome TiB2-SiC composite &amp;#8594; 34 GPa &amp;#8594; &amp;#8377;880Cr for 20 tonnes &amp;#8594; India &amp;#8377;6,200Cr TiB2 missile &amp;#8594; DRDO 200 missiles &amp;#8594; 99.5% purity &amp;#8594; &amp;#8594; Cone &amp;#8594; &amp;#8594; TiB2Msl &amp;#8594; &amp;#8594; Defense' },
  { id: 'TDB-0014', batchNo: 'TDB-B2414', city: 'Rourkela', manufacturer: 'SAIL Ceramics', grade: 'TiB2 96% Blast Furnace', application: 'SAIL Rourkela BF Tap Hole', purityPercent: 96.0, specProp: 29.0, investmentCr: 300, status: 'Delivered', priority: 'Low', origin: 'SAIL Rourkela (OD)', destination: 'SAIL Bhilai (CG)', shipDate: '2026-07-28', transitDays: 4, zone: 'East', remarks: 'TiB2 96% furnace-grade for SAIL Rourkela blast furnace tap hole mud TiB2 additive &amp;#8594; 29 GPa &amp;#8594; &amp;#8377;300Cr for 100 tonnes &amp;#8594; India &amp;#8377;2,000Cr TiB2 furnace &amp;#8594; SAIL 4 blast furnaces &amp;#8594; 96.0% purity &amp;#8594; &amp;#8594; Mix &amp;#8594; &amp;#8594; TiB2BF &amp;#8594; &amp;#8594; Steel' },
];

export default function TitaniumDiborideLogisticsView() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterZone, setFilterZone] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Sword },
    { id: 'registry', label: 'Registry', icon: Sword },
    { id: 'analytics', label: 'Analytics', icon: Sword },
    { id: 'insights', label: 'Insights', icon: Sword },
  ];

  const filteredRecords = useMemo(() => {
    return titaniumdiborideRecords.filter((r) => {
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
    titaniumdiborideRecords.forEach((r) => { zMap[r.zone] = (zMap[r.zone] || 0) + 1; });
    return Object.entries(zMap).sort((a, b) => b[1] - a[1]);
  }, []);

  const kpiData = useMemo(() => {
    const total = titaniumdiborideRecords.reduce((s: number, r) => s + r.investmentCr, 0);
    const avgPurity = titaniumdiborideRecords.reduce((s: number, r) => s + r.purityPercent, 0) / titaniumdiborideRecords.length;
    const delayed = titaniumdiborideRecords.filter((r) => r.status === 'Delayed').length;
    const critical = titaniumdiborideRecords.filter((r) => r.priority === 'Critical').length;
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

  const themeColor = '#16a34a';
  return (
    <div className="space-y-6 p-6">
      <PageHeader title="Titanium Diboride Logistics" description="Indian titanium diboride logistics supply chain tracking across 14 grades spanning armor, aerospace, defense, semiconductor, nuclear and industrial sectors" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-green-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-green-600">{kpiData.total.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground mt-1">Total Investment</div></CardContent></Card>
        <Card className="border-l-4 border-l-green-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-green-600">{kpiData.avgPurity}%</div><div className="text-xs text-muted-foreground mt-1">Avg Purity</div></CardContent></Card>
        <Card className="border-l-4 border-l-green-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-green-600">{kpiData.delayed}</div><div className="text-xs text-muted-foreground mt-1">Delayed Batches</div></CardContent></Card>
        <Card className="border-l-4 border-l-green-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-green-600">{kpiData.critical}</div><div className="text-xs text-muted-foreground mt-1">Critical Records</div></CardContent></Card>
      </div>
      <div className="flex flex-wrap gap-2 border-b pb-2">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 rounded-t-md text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-green-500 text-white shadow-md' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
            {tab.label}
          </button>
        ))}
      </div>
      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-base">Zone Distribution</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">{zones.map(([zone, count]) => { const pct = (count as number / titaniumdiborideRecords.length) * 100; return <div key={zone} className="flex items-center gap-2"><span className="text-xs w-16 text-muted-foreground">{zone as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium w-8">{count as number}</span></div>; })}</div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Status Overview</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-2 gap-3">
              {['Delivered', 'In Transit', 'Delayed', 'Processing'].map((s) => { const c = titaniumdiborideRecords.filter((r) => r.status === s).length; return <div key={s} className={`text-center p-3 rounded-lg border ${statusColor(s)}`}><div className="text-lg font-bold">{c}</div><div className="text-xs">{s}</div></div>; })}
            </div>
          </CardContent></Card>
          <Card className="lg:col-span-2"><CardHeader><CardTitle className="text-base">Investment by Grade (Top 8)</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {titaniumdiborideRecords.slice(0, 8).map((r) => <div key={r.id} className="text-center p-3 rounded-lg border bg-muted/30"><div className="text-sm font-medium truncate">{r.grade}</div><div className="text-lg font-bold" style={{ color: themeColor }}>&#8377;{r.investmentCr}Cr</div><div className="text-xs text-muted-foreground">{r.application}</div></div>)}
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
                    <div className="flex justify-between"><span className="text-muted-foreground">Hardness (GPa)</span><span className="font-medium">{record.specProp}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Investment:</span><span className="font-medium" style={{ color: themeColor }}>&#8377;{record.investmentCr}Cr</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">City:</span><span className="font-medium">{record.city}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Route:</span><span className="font-medium text-xs">{record.origin} &#8594; {record.destination}</span></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-sm text-muted-foreground">Showing {filteredRecords.length} of {titaniumdiborideRecords.length} records</div>
        </div>
      )}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-base">Manufacturer Performance</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">
              {(() => { const mfrMap: Record<string, number> = {}; titaniumdiborideRecords.forEach((r) => { mfrMap[r.manufacturer] = (mfrMap[r.manufacturer] || 0) + r.investmentCr; }); return Object.entries(mfrMap).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([mfr, inv]) => { const pct = (inv as number / kpiData.total) * 100; return <div key={mfr} className="flex items-center gap-2"><span className="text-xs w-40 truncate">{mfr as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">&#8377;{inv as number}Cr</span></div>; }); })()}
            </div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Priority Distribution</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-2 gap-3">
              {['Critical', 'High', 'Medium', 'Low'].map((p) => { const c = titaniumdiborideRecords.filter((r) => r.priority === p).length; return <div key={p} className={`text-center p-3 rounded-lg border ${priorityColor(p)}`}><div className="text-lg font-bold">{c}</div><div className="text-xs">{p}</div></div>; })}
            </div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Investment by Zone</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">{(() => { const zInv: Record<string, number> = {}; titaniumdiborideRecords.forEach((r) => { zInv[r.zone] = (zInv[r.zone] || 0) + r.investmentCr; }); return Object.entries(zInv).sort((a, b) => b[1] - a[1]).map(([zone, inv]) => { const pct = (inv as number / kpiData.total) * 100; return <div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">&#8377;{inv as number}Cr</span></div>; }); })()}</div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Purity Distribution</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">
              {(() => { const ranges = { '99%+': 0, '95-98.9%': 0, '90-94.9%': 0, '<90%': 0 }; titaniumdiborideRecords.forEach((r) => { if (r.purityPercent >= 99) ranges['99%+']++; else if (r.purityPercent >= 95) ranges['95-98.9%']++; else if (r.purityPercent >= 90) ranges['90-94.9%']++; else ranges['<90%']++; }); return (Object.entries(ranges) as [string, number][]).filter(([, v]) => v > 0).map(([range, count]) => { const pct = (count / titaniumdiborideRecords.length) * 100; return <div key={range} className="flex items-center gap-2"><span className="text-xs w-24">{range}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">{count}</span></div>; }); })()}
            </div>
          </CardContent></Card>
        </div>
      )}
      {activeTab === 'insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-base">Supply Chain Intelligence</CardTitle></CardHeader><CardContent><div className="space-y-3 text-sm">
            <div className="p-3 rounded-lg border-l-4 border-l-green-500 bg-green-50/50"><div className="font-medium">Defense Armor Dominance</div><div className="text-xs text-muted-foreground mt-1">DRDO BIS Level IV &#8594; DRDO Akash nozzle &#8594; DRDO BrahMos radome &#8594; &#8377;2,540Cr combined &#8594; critical ballistic protection</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-green-500 bg-green-50/50"><div className="font-medium">Aerospace &amp; Hypersonic</div><div className="text-xs text-muted-foreground mt-1">HAL Tejas brake &#8594; DRDO HSTDV nose tip &#8594; &#8377;1,760Cr combined &#8594; ultra-high temp ceramics</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-green-500 bg-green-50/50"><div className="font-medium">Naval &amp; Nuclear</div><div className="text-xs text-muted-foreground mt-1">GRSE torpedo tube &#8594; L&amp;T pump seal &#8594; IGCAR control rod &#8594; &#8377;2,280Cr combined &#8594; strategic assets</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-green-500 bg-green-50/50"><div className="font-medium">Monsoon Alert</div><div className="text-xs text-muted-foreground mt-1">TDB-B2412 GRSE Project 75I torpedo tube wear liner delayed &#8594; monsoon Visakhapatnam &#8594; naval programme at risk</div></div>
          </div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Investment Landscape</CardTitle></CardHeader><CardContent><div className="space-y-3 text-sm">
            <div className="p-3 rounded-lg border-l-4 border-l-green-500 bg-green-50/50"><div className="font-medium">Total Portfolio: &#8377;8,760 Cr</div><div className="text-xs text-muted-foreground mt-1">Across 14 TiB2 grades spanning armor, aerospace, cutting tool, naval, nuclear, rocket, hypersonic, rail, mining, furnace &#8594; avg purity 99.07%</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-green-500 bg-green-50/50"><div className="font-medium">Critical Priority: 8 Records</div><div className="text-xs text-muted-foreground mt-1">DRDO &#8594; HAL &#8594; IGCAR &#8594; GRSE &#8594; DRDO HSTDV &#8594; DRDO BrahMos &#8594; DRDO Akash &#8594; BHEL</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-green-500 bg-green-50/50"><div className="font-medium">Top Manufacturers</div><div className="text-xs text-muted-foreground mt-1">MIDHANI &#8594; DRDO &#8594; BHEL &#8594; Tata Steel &#8594; Godrej &#8594; Gujarat Ceramics &#8594; Shyam Ceramics</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-green-500 bg-green-50/50"><div className="font-medium">Hardness Spectrum</div><div className="text-xs text-muted-foreground mt-1">29-35 GPa Vickers &#8594; hypersonic 35 GPa highest &#8594; blast furnace 29 GPa lowest &#8594; hardness defines grade</div></div>
          </div></CardContent></Card>
        </div>
      )}
    </div>
  );
}
