"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared';
import { Eye } from 'lucide-react';

interface GermaniumIngotRecord {
  id: string; batchNo: string; city: string; manufacturer: string; grade: string;
  application: string; purityPercent: number; specProp: number; investmentCr: number;
  status: string; priority: string; origin: string; destination: string;
  shipDate: string; transitDays: number; zone: string; remarks: string;
};

const germaniumingotRecords: GermaniumIngotRecord[] = [
  { id: 'GIN-0001', batchNo: 'GIN-B2401', city: 'Bengaluru', manufacturer: 'MIDHANI', grade: 'Ge 99.999% IR Optics', application: 'DRDO AGNI-7 IR Seeker Lens', purityPercent: 99.999, specProp: 4.0, investmentCr: 920, status: 'Delivered', priority: 'Critical', origin: 'MIDHANI Hyderabad (TG)', destination: 'DRDO Hyderabad (TG)', shipDate: '2026-07-15', transitDays: 1, zone: 'South', remarks: 'Ge 99.999% 5N optical-grade for DRDO AGNI-7 IR seeker germanium lens &amp;#8594; nD 4.0 &amp;#8594; &amp;#8377;920Cr for 15 tonnes &amp;#8594; India &amp;#8377;6,800Cr Ge optics &amp;#8594; DRDO 100 missiles &amp;#8594; 99.999% 5N &amp;#8594; &amp;#8594; Ingot &amp;#8594; &amp;#8594; GeIROpt &amp;#8594; &amp;#8594; Defense' },
  { id: 'GIN-0002', batchNo: 'GIN-B2402', city: 'Mumbai', manufacturer: 'DRDO DMRL', grade: 'Ge 99.99% Night Vision', application: 'BEL LCA Tejas HUD Element', purityPercent: 99.99, specProp: 4.0, investmentCr: 860, status: 'In Transit', priority: 'Critical', origin: 'DRDO Hyderabad (TG)', destination: 'BEL Bengaluru (KA)', shipDate: '2026-07-16', transitDays: 2, zone: 'West', remarks: 'Ge 99.99% 4N night-vision for BEL Tejas HUD germanium thermal element &amp;#8594; nD 4.0 &amp;#8594; &amp;#8377;860Cr for 20 tonnes &amp;#8594; India &amp;#8377;6,200Cr Ge NV &amp;#8594; BEL 40 aircraft &amp;#8594; 99.99% 4N &amp;#8594; &amp;#8594; Ingot &amp;#8594; &amp;#8594; GeNV &amp;#8594; &amp;#8594; Aerospace' },
  { id: 'GIN-0003', batchNo: 'GIN-B2403', city: 'Chennai', manufacturer: 'Tata Steel', grade: 'Ge 99.95% Fiber Optic', application: 'Jio 5G Fiber Ge Photodetector', purityPercent: 99.95, specProp: 4.0, investmentCr: 780, status: 'Delivered', priority: 'High', origin: 'Tata Steel Jamshedpur (JH)', destination: 'Jio Mumbai (MH)', shipDate: '2026-07-17', transitDays: 3, zone: 'South', remarks: 'Ge 99.95% 3N5 fiber-grade for Jio 5G fiber optic germanium photodetector &amp;#8594; nD 4.0 &amp;#8594; &amp;#8377;780Cr for 30 tonnes &amp;#8594; India &amp;#8377;5,400Cr Ge fiber &amp;#8594; Jio 500K km &amp;#8594; 99.95% 3N5 &amp;#8594; &amp;#8594; Ingot &amp;#8594; &amp;#8594; GeFiber &amp;#8594; &amp;#8594; Telecom' },
  { id: 'GIN-0004', batchNo: 'GIN-B2404', city: 'Hyderabad', manufacturer: 'Bharat Forge', grade: 'Ge 99.9% Semiconductor', application: 'CDAC Ge-On-Si Substrate', purityPercent: 99.9, specProp: 4.0, investmentCr: 700, status: 'Delivered', priority: 'High', origin: 'Bharat Forge Pune (MH)', destination: 'CDAC Pune (MH)', shipDate: '2026-07-18', transitDays: 4, zone: 'South', remarks: 'Ge 99.9% 3N semi-grade for CDAC Ge-on-Si substrate high-mobility transistor &amp;#8594; nD 4.0 &amp;#8594; &amp;#8377;700Cr for 25 tonnes &amp;#8594; India &amp;#8377;4,800Cr Ge semi &amp;#8594; CDAC 10 chips &amp;#8594; 99.9% 3N &amp;#8594; &amp;#8594; Wafer &amp;#8594; &amp;#8594; GeSemi &amp;#8594; &amp;#8594; Semiconductor' },
  { id: 'GIN-0005', batchNo: 'GIN-B2405', city: 'Kolkata', manufacturer: 'Shyam Optics', grade: 'Ge 99.5% Thermal Imager', application: 'L&amp;T Naval FLIR Camera', purityPercent: 99.5, specProp: 4.0, investmentCr: 640, status: 'In Transit', priority: 'High', origin: 'Shyam Optics Kolkata (WB)', destination: 'L&amp;T Kattupalli (TN)', shipDate: '2026-07-19', transitDays: 5, zone: 'East', remarks: 'Ge 99.5% thermal-grade for L&amp;amp;T warship FLIR germanium lens element &amp;#8594; nD 4.0 &amp;#8594; &amp;#8377;640Cr for 35 tonnes &amp;#8594; India &amp;#8377;4,400Cr Ge thermal &amp;#8594; L&amp;amp;T 30 warships &amp;#8594; 99.5% &amp;#8594; &amp;#8594; Lens &amp;#8594; &amp;#8594; GeFLIR &amp;#8594; &amp;#8594; Naval' },
  { id: 'GIN-0006', batchNo: 'GIN-B2406', city: 'Coimbatore', manufacturer: 'BHEL R&amp;D', grade: 'Ge 99.999% Solar Cell', application: 'ISRO GSAT-5 GaAs/Ge Cell', purityPercent: 99.999, specProp: 4.0, investmentCr: 880, status: 'Delivered', priority: 'Critical', origin: 'BHEL Bengaluru (KA)', destination: 'ISRO Bengaluru (KA)', shipDate: '2026-07-20', transitDays: 1, zone: 'South', remarks: 'Ge 99.999% 5N solar-grade for ISRO GSAT-5 multi-junction GaAs/Ge solar cell &amp;#8594; nD 4.0 &amp;#8594; &amp;#8377;880Cr for 10 tonnes &amp;#8594; India &amp;#8377;6,000Cr Ge solar &amp;#8594; ISRO 8 satellites &amp;#8594; 99.999% 5N &amp;#8594; &amp;#8594; Wafer &amp;#8594; &amp;#8594; GeSolar &amp;#8594; &amp;#8594; Space' },
  { id: 'GIN-0007', batchNo: 'GIN-B2407', city: 'Pune', manufacturer: 'Godrej Optics', grade: 'Ge 99.9% PET Detector', application: 'Nuclear Power Corp PET Scanner', purityPercent: 99.9, specProp: 4.0, investmentCr: 580, status: 'Delivered', priority: 'Medium', origin: 'Godrej Mumbai (MH)', destination: 'NPCIL Mumbai (MH)', shipDate: '2026-07-21', transitDays: 2, zone: 'West', remarks: 'Ge 99.9% detector-grade for NPCIL nuclear medicine PET scanner Ge detector &amp;#8594; nD 4.0 &amp;#8594; &amp;#8377;580Cr for 20 tonnes &amp;#8594; India &amp;#8377;3,800Cr Ge medical &amp;#8594; NPCIL 10 scanners &amp;#8594; 99.9% 3N &amp;#8594; &amp;#8594; Crystal &amp;#8594; &amp;#8594; GePET &amp;#8594; &amp;#8594; Medical' },
  { id: 'GIN-0008', batchNo: 'GIN-B2408', city: 'Jaipur', manufacturer: 'Rajasthan Optics', grade: 'Ge 99.95% Spectroscopy', application: 'DRDO CBW Spectrometer', purityPercent: 99.95, specProp: 4.0, investmentCr: 520, status: 'Delivered', priority: 'Medium', origin: 'Rajasthan Opt Jodhpur (RJ)', destination: 'DRDO Gwalior (MP)', shipDate: '2026-07-22', transitDays: 3, zone: 'West', remarks: 'Ge 99.95% spectrometer-grade for DRDO CBW reconnaissance FTIR spectrometer &amp;#8594; nD 4.0 &amp;#8594; &amp;#8377;520Cr for 15 tonnes &amp;#8594; India &amp;#8377;3,400Cr Ge spectro &amp;#8594; DRDO 50 units &amp;#8594; 99.95% 3N5 &amp;#8594; &amp;#8594; Prism &amp;#8594; &amp;#8594; GeSpec &amp;#8594; &amp;#8594; Defense' },
  { id: 'GIN-0009', batchNo: 'GIN-B2409', city: 'Guwahati', manufacturer: 'Assam Optics', grade: 'Ge 99% LED Substrate', application: 'Dixon LED Ge Substrate', purityPercent: 99.0, specProp: 4.0, investmentCr: 400, status: 'In Transit', priority: 'Medium', origin: 'Assam Opt Tezpur (AS)', destination: 'Dixon Noida (UP)', shipDate: '2026-07-23', transitDays: 4, zone: 'East', remarks: 'Ge 99% LED substrate-grade for Dixon high-power LED germanium substrate &amp;#8594; nD 4.0 &amp;#8594; &amp;#8377;400Cr for 40 tonnes &amp;#8594; India &amp;#8377;2,600Cr Ge LED &amp;#8594; Dixon 5M panels &amp;#8594; 99.0% &amp;#8594; &amp;#8594; Wafer &amp;#8594; &amp;#8594; GeLED &amp;#8594; &amp;#8594; Consumer' },
  { id: 'GIN-0010', batchNo: 'GIN-B2410', city: 'Ahmedabad', manufacturer: 'Gujarat Optics', grade: 'Ge 99.999% Space Telescope', application: 'ISRO SPADEX Ge Imager', purityPercent: 99.999, specProp: 4.0, investmentCr: 900, status: 'Delivered', priority: 'Critical', origin: 'Gujarat Opt Ahmedabad (GJ)', destination: 'ISRO Ahmedabad (GJ)', shipDate: '2026-07-24', transitDays: 5, zone: 'West', remarks: 'Ge 99.999% 5N space-grade for ISRO SPADEX docking germanium IR imager &amp;#8594; nD 4.0 &amp;#8594; &amp;#8377;900Cr for 8 tonnes &amp;#8594; India &amp;#8377;6,600Cr Ge space &amp;#8594; ISRO 4 missions &amp;#8594; 99.999% 5N &amp;#8594; &amp;#8594; Lens &amp;#8594; &amp;#8594; GeSpace &amp;#8594; &amp;#8594; Space' },
  { id: 'GIN-0011', batchNo: 'GIN-B2411', city: 'Lucknow', manufacturer: 'UP Optics', grade: 'Ge 99.5% Industrial Lens', application: 'Bharat Forge CMM Probe', purityPercent: 99.5, specProp: 4.0, investmentCr: 380, status: 'Delivered', priority: 'Medium', origin: 'UP Opt Kanpur (UP)', destination: 'Bharat Forge Pune (MH)', shipDate: '2026-07-25', transitDays: 1, zone: 'North', remarks: 'Ge 99.5% industrial-grade for Bharat Forge CMM laser probe germanium window &amp;#8594; nD 4.0 &amp;#8594; &amp;#8377;380Cr for 30 tonnes &amp;#8594; India &amp;#8377;2,400Cr Ge industrial &amp;#8594; Bharat Forge 5M probes &amp;#8594; 99.5% &amp;#8594; &amp;#8594; Window &amp;#8594; &amp;#8594; GeInd &amp;#8594; &amp;#8594; Manufacturing' },
  { id: 'GIN-0012', batchNo: 'GIN-B2412', city: 'Visakhapatnam', manufacturer: 'Vizag Optics', grade: 'Ge 99.99% Submarine Periscope', application: 'GRSE Project 75I Optronics', purityPercent: 99.99, specProp: 4.0, investmentCr: 940, status: 'Delayed', priority: 'Critical', origin: 'Vizag Opt Visakhapatnam (AP)', destination: 'GRSE Kolkata (WB)', shipDate: '2026-07-26', transitDays: 2, zone: 'East', remarks: 'Ge 99.99% 4N submarine-grade for GRSE Project 75I periscope optronics Ge IR lens &amp;#8597; nD 4.0 &amp;#8597; &amp;#8377;940Cr for 12 tonnes &amp;#8597; India &amp;#8377;7,600Cr Ge submarine &amp;#8597; GRSE 6 submarines &amp;#8597; 99.99% 4N &amp;#8597; &amp;#8594; Lens &amp;#8597; &amp;#8594; GeSub &amp;#8597; &amp;#8594; Naval' },
  { id: 'GIN-0013', batchNo: 'GIN-B2413', city: 'Bhopal', manufacturer: 'DRDO TBRL', grade: 'Ge 99.95% Hypersonic Window', application: 'DRDO HSTDV IR Window', purityPercent: 99.95, specProp: 4.0, investmentCr: 880, status: 'In Transit', priority: 'Critical', origin: 'DRDO Hyderabad (TG)', destination: 'BHEL Hyderabad (TG)', shipDate: '2026-07-27', transitDays: 3, zone: 'Central', remarks: 'Ge 99.95% hypersonic-grade for DRDO HSTDV IR seeker dome germanium window &amp;#8594; nD 4.0 &amp;#8594; &amp;#8377;880Cr for 10 tonnes &amp;#8594; India &amp;#8377;6,200Cr Ge hypersonic &amp;#8594; DRDO 10 vehicles &amp;#8594; 99.95% 3N5 &amp;#8594; &amp;#8594; Dome &amp;#8594; &amp;#8594; GeHyp &amp;#8594; &amp;#8594; Defense' },
  { id: 'GIN-0014', batchNo: 'GIN-B2414', city: 'Rourkela', manufacturer: 'SAIL Germanium', grade: 'Ge 99% Alloying Agent', application: 'SAIL Rourkela SiGe Alloy', purityPercent: 99.0, specProp: 4.0, investmentCr: 300, status: 'Delivered', priority: 'Low', origin: 'SAIL Rourkela (OD)', destination: 'Tata Steel Jamshedpur (JH)', shipDate: '2026-07-28', transitDays: 4, zone: 'East', remarks: 'Ge 99% alloying-grade for SAIL Rourkela silicon-germanium alloy electrical steel &amp;#8594; nD 4.0 &amp;#8594; &amp;#8377;300Cr for 100 tonnes &amp;#8594; India &amp;#8377;2,000Cr Ge alloy &amp;#8594; SAIL 20K tonnes &amp;#8594; 99.0% &amp;#8594; &amp;#8594; Ingot &amp;#8594; &amp;#8594; GeAlloy &amp;#8594; &amp;#8594; Steel' },
];

export default function GermaniumIngotLogisticsView() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterZone, setFilterZone] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Eye },
    { id: 'registry', label: 'Registry', icon: Eye },
    { id: 'analytics', label: 'Analytics', icon: Eye },
    { id: 'insights', label: 'Insights', icon: Eye },
  ];

  const filteredRecords = useMemo(() => {
    return germaniumingotRecords.filter((r) => {
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
    germaniumingotRecords.forEach((r) => { zMap[r.zone] = (zMap[r.zone] || 0) + 1; });
    return Object.entries(zMap).sort((a, b) => b[1] - a[1]);
  }, []);

  const kpiData = useMemo(() => {
    const total = germaniumingotRecords.reduce((s: number, r) => s + r.investmentCr, 0);
    const avgPurity = germaniumingotRecords.reduce((s: number, r) => s + r.purityPercent, 0) / germaniumingotRecords.length;
    const delayed = germaniumingotRecords.filter((r) => r.status === 'Delayed').length;
    const critical = germaniumingotRecords.filter((r) => r.priority === 'Critical').length;
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

  const themeColor = '#b45309';
  return (
    <div className="space-y-6 p-6">
      <PageHeader title="Germanium Ingot Logistics" description="Indian germanium ingot logistics supply chain tracking across 14 grades spanning infrared optics, fiber optics, semiconductor, defense, energy storage and industrial sectors" />
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
            <div className="space-y-2">{zones.map(([zone, count]) => { const pct = (count as number / germaniumingotRecords.length) * 100; return <div key={zone} className="flex items-center gap-2"><span className="text-xs w-16 text-muted-foreground">{zone as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium w-8">{count as number}</span></div>; })}</div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Status Overview</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-2 gap-3">
              {['Delivered', 'In Transit', 'Delayed', 'Processing'].map((s) => { const c = germaniumingotRecords.filter((r) => r.status === s).length; return <div key={s} className={`text-center p-3 rounded-lg border ${statusColor(s)}`}><div className="text-lg font-bold">{c}</div><div className="text-xs">{s}</div></div>; })}
            </div>
          </CardContent></Card>
          <Card className="lg:col-span-2"><CardHeader><CardTitle className="text-base">Investment by Grade (Top 8)</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {germaniumingotRecords.slice(0, 8).map((r) => <div key={r.id} className="text-center p-3 rounded-lg border bg-muted/30"><div className="text-sm font-medium truncate">{r.grade}</div><div className="text-lg font-bold" style={{ color: themeColor }}>&#8377;{r.investmentCr}Cr</div><div className="text-xs text-muted-foreground">{r.application}</div></div>)}
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
                    <div className="flex justify-between"><span className="text-muted-foreground">Refractive Index (nD)</span><span className="font-medium">{record.specProp}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Investment:</span><span className="font-medium" style={{ color: themeColor }}>&#8377;{record.investmentCr}Cr</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">City:</span><span className="font-medium">{record.city}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Route:</span><span className="font-medium text-xs">{record.origin} &#8594; {record.destination}</span></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-sm text-muted-foreground">Showing {filteredRecords.length} of {germaniumingotRecords.length} records</div>
        </div>
      )}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-base">Manufacturer Performance</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">
              {(() => { const mfrMap: Record<string, number> = {}; germaniumingotRecords.forEach((r) => { mfrMap[r.manufacturer] = (mfrMap[r.manufacturer] || 0) + r.investmentCr; }); return Object.entries(mfrMap).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([mfr, inv]) => { const pct = (inv as number / kpiData.total) * 100; return <div key={mfr} className="flex items-center gap-2"><span className="text-xs w-40 truncate">{mfr as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">&#8377;{inv as number}Cr</span></div>; }); })()}
            </div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Priority Distribution</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-2 gap-3">
              {['Critical', 'High', 'Medium', 'Low'].map((p) => { const c = germaniumingotRecords.filter((r) => r.priority === p).length; return <div key={p} className={`text-center p-3 rounded-lg border ${priorityColor(p)}`}><div className="text-lg font-bold">{c}</div><div className="text-xs">{p}</div></div>; })}
            </div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Investment by Zone</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">{(() => { const zInv: Record<string, number> = {}; germaniumingotRecords.forEach((r) => { zInv[r.zone] = (zInv[r.zone] || 0) + r.investmentCr; }); return Object.entries(zInv).sort((a, b) => b[1] - a[1]).map(([zone, inv]) => { const pct = (inv as number / kpiData.total) * 100; return <div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">&#8377;{inv as number}Cr</span></div>; }); })()}</div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Purity Distribution</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">
              {(() => { const ranges = { '99%+': 0, '95-98.9%': 0, '90-94.9%': 0, '<90%': 0 }; germaniumingotRecords.forEach((r) => { if (r.purityPercent >= 99) ranges['99%+']++; else if (r.purityPercent >= 95) ranges['95-98.9%']++; else if (r.purityPercent >= 90) ranges['90-94.9%']++; else ranges['<90%']++; }); return (Object.entries(ranges) as [string, number][]).filter(([, v]) => v > 0).map(([range, count]) => { const pct = (count / germaniumingotRecords.length) * 100; return <div key={range} className="flex items-center gap-2"><span className="text-xs w-24">{range}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">{count}</span></div>; }); })()}
            </div>
          </CardContent></Card>
        </div>
      )}
      {activeTab === 'insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-base">Supply Chain Intelligence</CardTitle></CardHeader><CardContent><div className="space-y-3 text-sm">
            <div className="p-3 rounded-lg border-l-4 border-l-amber-500 bg-amber-50/50"><div className="font-medium">Strategic IR Optics Dominance</div><div className="text-xs text-muted-foreground mt-1">DRDO AGNI-7 seeker &#8594; BEL Tejas HUD &#8594; L&amp;T naval FLIR &#8594; &#8377;2,420Cr combined &#8594; critical defense thermal imaging</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-amber-500 bg-amber-50/50"><div className="font-medium">Space &amp; Semiconductor</div><div className="text-xs text-muted-foreground mt-1">ISRO GSAT-5 solar cell &#8594; ISRO SPADEX imager &#8594; CDAC Ge-on-Si &#8594; &#8377;2,480Cr combined &#8594; high-value strategic</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-amber-500 bg-amber-50/50"><div className="font-medium">Telecom &amp; Industrial</div><div className="text-xs text-muted-foreground mt-1">Jio 5G fiber &#8594; Dixon LED &#8594; Bharat Forge CMM &#8594; &#8377;1,560Cr combined &#8594; volume production</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-amber-500 bg-amber-50/50"><div className="font-medium">Monsoon Alert</div><div className="text-xs text-muted-foreground mt-1">GIN-B2412 GRSE Project 75I periscope optronics IR lens delayed &#8594; monsoon Visakhapatnam &#8594; submarine programme at risk</div></div>
          </div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Investment Landscape</CardTitle></CardHeader><CardContent><div className="space-y-3 text-sm">
            <div className="p-3 rounded-lg border-l-4 border-l-amber-500 bg-amber-50/50"><div className="font-medium">Total Portfolio: &#8377;8,760 Cr</div><div className="text-xs text-muted-foreground mt-1">Across 14 Ge grades spanning IR optics, night vision, fiber, semiconductor, thermal, solar, PET, spectroscopy, space &#8594; avg purity 99.93% (3N-5N)</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-amber-500 bg-amber-50/50"><div className="font-medium">Critical Priority: 7 Records</div><div className="text-xs text-muted-foreground mt-1">DRDO AGNI-7 &#8594; BEL Tejas &#8594; ISRO GSAT-5 &#8594; ISRO SPADEX &#8594; GRSE submarine &#8594; DRDO HSTDV &#8594; CDAC</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-amber-500 bg-amber-50/50"><div className="font-medium">Top Manufacturers</div><div className="text-xs text-muted-foreground mt-1">MIDHANI &#8594; DRDO &#8594; BHEL &#8594; Tata Steel &#8594; Godrej &#8594; Gujarat Optics &#8594; Shyam Optics</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-amber-500 bg-amber-50/50"><div className="font-medium">Refractive Index Signature</div><div className="text-xs text-muted-foreground mt-1">nD 4.0 across all grades &#8594; highest of any semiconductor &#8594; enables compact IR optics &#8594; 2-14 um transmission window</div></div>
          </div></CardContent></Card>
        </div>
      )}
    </div>
  );
}
