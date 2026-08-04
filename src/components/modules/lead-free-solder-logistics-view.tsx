"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared';
import { Plug } from 'lucide-react';

interface LeadFreeSolderRecord {
  id: string; batchNo: string; city: string; manufacturer: string; lfGrade: string;
  application: string; purityPercent: number; meltTempC: number; investmentCr: number;
  status: string; priority: string; origin: string; destination: string;
  shipDate: string; transitDays: number; zone: string; remarks: string;
};

const leadFreeSolderRecords: LeadFreeSolderRecord[] = [
  { id: 'LFS-0001', batchNo: 'LFS-B2401', city: 'Mumbai', manufacturer: 'Hindustan Solder', lfGrade: 'SAC305 Sn96.5Ag3Cu0.5', application: 'ISRO GSAT-7B BGA Package', purityPercent: 99.7, meltTempC: 217, investmentCr: 820, status: 'Delivered', priority: 'Critical', origin: 'Hindustan Solder Mumbai (MH)', destination: 'ISRO Bengaluru (KA)', shipDate: '2026-07-15', transitDays: 1, zone: 'West', remarks: 'SAC305 lead-free solder paste for ISRO GSAT-7B military communication satellite BGA and CSP reflow &#8594; 3% Ag &#8594; &#8377;820Cr for 800 tonnes &#8594; India &#8377;5,400Cr LF solder &#8594; ISRO 12 satellites &#8594; 217&#176;C &#8594; &#8594; Paste &#8594; &#8594; SAC305 &#8594; &#8594; Space' },
  { id: 'LFS-0002', batchNo: 'LFS-B2402', city: 'Bengaluru', manufacturer: 'DRDO DMRL', lfGrade: 'SAC387 Sn95.5Ag3.8Cu0.7', application: 'BEL Nirbhay Cruise PCB', purityPercent: 99.8, meltTempC: 217, investmentCr: 740, status: 'In Transit', priority: 'Critical', origin: 'DRDO Hyderabad (TG)', destination: 'BEL Bengaluru (KA)', shipDate: '2026-07-16', transitDays: 2, zone: 'South', remarks: 'SAC387 no-clean solder for BEL Nirbhay cruise missile navigation computer multilayer PCB assembly &#8594; 3.8% Ag &#8594; &#8377;740Cr for 600 tonnes &#8594; India &#8377;5,200Cr LF defense &#8594; BEL 80 missiles &#8594; 217&#176;C &#8594; &#8594; Paste &#8594; &#8594; SAC387 &#8594; &#8594; Defense' },
  { id: 'LFS-0003', batchNo: 'LFS-B2403', city: 'Chennai', manufacturer: 'Sterlite Solder', lfGrade: 'SAC405 Sn95.5Ag4Cu0.5', application: 'Wipro Server Motherboard', purityPercent: 99.5, meltTempC: 217, investmentCr: 520, status: 'Delivered', priority: 'High', origin: 'Sterlite Solder Chennai (TN)', destination: 'Wipro Bengaluru (KA)', shipDate: '2026-07-17', transitDays: 3, zone: 'South', remarks: 'SAC405 lead-free solder bar for Wipro enterprise server motherboard wave soldering and SMT reflow &#8594; 4% Ag &#8594; &#8377;520Cr for 1,200 tonnes &#8594; India &#8377;3,200Cr LF IT &#8594; Wipro 500K boards &#8594; 217&#176;C &#8594; &#8594; Bar &#8594; &#8594; SAC405 &#8594; &#8594; IT' },
  { id: 'LFS-0004', batchNo: 'LFS-B2404', city: 'Hyderabad', manufacturer: 'Bharat Electronics', lfGrade: 'Sn-Bi58 Low Melt 138C', application: 'Dixon LED TV Driver Board', purityPercent: 99.2, meltTempC: 138, investmentCr: 340, status: 'Delivered', priority: 'Medium', origin: 'Bharat Electronics Hyderabad (TG)', destination: 'Dixon Noida (UP)', shipDate: '2026-07-18', transitDays: 4, zone: 'South', remarks: 'Sn-Bi58 low-melt lead-free solder for Dixon LED TV backlight driver board temperature-sensitive component &#8594; 58% Bi &#8594; &#8377;340Cr for 400 tonnes &#8594; India &#8377;2,200Cr LF consumer &#8594; Dixon 20M boards &#8594; 138&#176;C &#8594; &#8594; Wire &#8594; &#8594; SnBi58 &#8594; &#8594; Consumer' },
  { id: 'LFS-0005', batchNo: 'LFS-B2405', city: 'Kolkata', manufacturer: 'Tata Solder Div', lfGrade: 'Sn-Zn9 Bi3 Low Cost', application: 'Tata Steel Automation PLC', purityPercent: 98.6, meltTempC: 197, investmentCr: 420, status: 'In Transit', priority: 'High', origin: 'Tata Solder Kolkata (WB)', destination: 'Tata Steel Jamshedpur (JH)', shipDate: '2026-07-19', transitDays: 5, zone: 'East', remarks: 'Sn-Zn9-Bi3 lead-free solder for Tata Steel blast furnace automation PLC controller soldering &#8594; 9% Zn &#8594; &#8377;420Cr for 700 tonnes &#8594; India &#8377;2,800Cr LF industrial &#8594; Tata 120 PLCs &#8594; 197&#176;C &#8594; &#8594; Bar &#8594; &#8594; SnZn9 &#8594; &#8594; Industrial' },
  { id: 'LFS-0006', batchNo: 'LFS-B2406', city: 'Coimbatore', manufacturer: 'Larsen &amp; Toubro', lfGrade: 'SAC307 Sn96.5Ag0.3Cu3', application: 'L&amp;T Switchgear Contact', purityPercent: 99.4, meltTempC: 217, investmentCr: 560, status: 'Delivered', priority: 'High', origin: 'L&amp;T Coimbatore (TN)', destination: 'L&amp;T Mumbai (MH)', shipDate: '2026-07-20', transitDays: 1, zone: 'South', remarks: 'SAC307 lead-free solder for L&amp;T low-voltage switchgear MCCB contact assembly silver plating solder &#8594; 3% Cu &#8594; &#8377;560Cr for 900 tonnes &#8594; India &#8377;3,800Cr LF electrical &#8594; L&amp;T 2M units &#8594; 217&#176;C &#8594; &#8594; Wire &#8594; &#8594; SAC307 &#8594; &#8594; Electrical' },
  { id: 'LFS-0007', batchNo: 'LFS-B2407', city: 'Pune', manufacturer: 'Mahindra Solder', lfGrade: 'SAC305 Auto Grade', application: 'Mahindra XUV400 EV Inverter', purityPercent: 99.6, meltTempC: 217, investmentCr: 680, status: 'Delivered', priority: 'Critical', origin: 'Mahindra Solder Pune (MH)', destination: 'Mahindra Chakan (MH)', shipDate: '2026-07-21', transitDays: 2, zone: 'West', remarks: 'SAC305 automotive-grade for Mahindra XUV400 EV inverter power module IGBT solder die attach &#8594; 3% Ag &#8594; &#8377;680Cr for 500 tonnes &#8594; India &#8377;4,400Cr LF auto &#8594; Mahindra 80K EVs &#8594; 217&#176;C &#8594; &#8594; Paste &#8594; &#8594; SAC305 &#8594; &#8594; Auto' },
  { id: 'LFS-0008', batchNo: 'LFS-B2408', city: 'Jaipur', manufacturer: 'Rajasthan Solder', lfGrade: 'Sn-Cu0.7 Low Cost Ni', application: 'Godrej AC PCB SMD', purityPercent: 98.2, meltTempC: 227, investmentCr: 280, status: 'Delivered', priority: 'Medium', origin: 'Rajasthan Solder Jaipur (RJ)', destination: 'Godrej Mumbai (MH)', shipDate: '2026-07-22', transitDays: 3, zone: 'West', remarks: 'Sn-Cu0.7-Ni lead-free solder for Godrej split air conditioner PCB SMD placement and wave soldering &#8594; 0.7% Cu &#8594; &#8377;280Cr for 1,500 tonnes &#8594; India &#8377;1,800Cr LF appliance &#8594; Godrej 5M PCBs &#8594; 227&#176;C &#8594; &#8594; Bar &#8594; &#8594; SnCu &#8594; &#8594; Appliance' },
  { id: 'LFS-0009', batchNo: 'LFS-B2409', city: 'Guwahati', manufacturer: 'Assam Solder Works', lfGrade: 'SAC305 Pharma Grade', application: 'Trivitron MRI Coil PCB', purityPercent: 99.8, meltTempC: 217, investmentCr: 520, status: 'In Transit', priority: 'High', origin: 'Assam Solder Silchar (AS)', destination: 'Trivitron Chennai (TN)', shipDate: '2026-07-23', transitDays: 4, zone: 'East', remarks: 'Medical-grade SAC305 for Trivitron 3T MRI gradient coil driver PCB with class-III medical trace &#8594; 3% Ag &#8594; &#8377;520Cr for 300 tonnes &#8594; India &#8377;3,400Cr LF medical &#8594; Trivitron 200 scanners &#8594; 217&#176;C &#8594; &#8594; Paste &#8594; &#8594; SAC305 &#8594; &#8594; Medical' },
  { id: 'LFS-0010', batchNo: 'LFS-B2410', city: 'Ahmedabad', manufacturer: 'Gujarat Solder Corp', lfGrade: 'Sn-99.99 Ultra Pure', application: 'Bajaj Auto ECU Module', purityPercent: 99.99, meltTempC: 232, investmentCr: 460, status: 'Delivered', priority: 'High', origin: 'Gujarat Solder Ahmedabad (GJ)', destination: 'Bajaj Auto Pune (MH)', shipDate: '2026-07-24', transitDays: 5, zone: 'West', remarks: 'Ultra-pure Sn-99.99 lead-free solder for Bajaj Pulsar NS200 motorcycle ECU module fine-pitch QFP solder &#8594; 99.99% Sn &#8594; &#8377;460Cr for 800 tonnes &#8594; India &#8377;2,800Cr LF moto &#8594; Bajaj 3M ECUs &#8594; 232&#176;C &#8594; &#8594; Wire &#8594; &#8594; Sn99 &#8594; &#8594; Auto' },
  { id: 'LFS-0011', batchNo: 'LFS-B2411', city: 'Lucknow', manufacturer: 'UP Solder Industries', lfGrade: 'SAC405 Telecom', application: 'Jio 5G Antenna PCB', purityPercent: 99.5, meltTempC: 217, investmentCr: 580, status: 'Delivered', priority: 'High', origin: 'UP Solder Lucknow (UP)', destination: 'Jio Mumbai (MH)', shipDate: '2026-07-25', transitDays: 1, zone: 'North', remarks: 'SAC405 lead-free solder for Reliance Jio 5G massive MIMO antenna unit RF PCB and power amplifier &#8594; 4% Ag &#8594; &#8377;580Cr for 700 tonnes &#8594; India &#8377;3,800Cr LF telecom &#8594; Jio 100K antennas &#8594; 217&#176;C &#8594; &#8594; Paste &#8594; &#8594; SAC405 &#8594; &#8594; Telecom' },
  { id: 'LFS-0012', batchNo: 'LFS-B2412', city: 'Visakhapatnam', manufacturer: 'Vizag Solder Works', lfGrade: 'SAC305 Submarine', application: 'GRSE Project 75I Sonar PCB', purityPercent: 99.6, meltTempC: 217, investmentCr: 940, status: 'Delayed', priority: 'Critical', origin: 'Vizag Solder Visakhapatnam (AP)', destination: 'GRSE Kolkata (WB)', shipDate: '2026-07-26', transitDays: 2, zone: 'East', remarks: 'Naval-grade SAC305 for GRSE Project 75I submarine towed array sonar processing unit multilayer PCB &#8594; 3% Ag &#8594; &#8377;940Cr for 350 tonnes &#8597; India &#8377;7,600Cr LF naval &#8594; GRSE 6 submarines &#8594; 217&#176;C &#8597; &#8594; Paste &#8594; &#8594; SAC305 &#8594; &#8594; Naval' },
  { id: 'LFS-0013', batchNo: 'LFS-B2413', city: 'Bhopal', manufacturer: 'BHEL Solder Div', lfGrade: 'Sn-Ag4 High Temp', application: 'BHEL Steam Turbine Sensor', purityPercent: 99.3, meltTempC: 221, investmentCr: 620, status: 'In Transit', priority: 'High', origin: 'BHEL Bhopal (MP)', destination: 'BHEL Hyderabad (TG)', shipDate: '2026-07-27', transitDays: 3, zone: 'Central', remarks: 'Sn-Ag4 high-temperature lead-free solder for BHEL 660MW steam turbine vibration sensor and RTD &#8594; 4% Ag &#8594; &#8377;620Cr for 450 tonnes &#8594; India &#8377;4,200Cr LF power &#8594; BHEL 30 turbines &#8594; 221&#176;C &#8594; &#8594; Wire &#8594; &#8594; SnAg4 &#8594; &#8594; Power' },
  { id: 'LFS-0014', batchNo: 'LFS-B2414', city: 'Rourkela', manufacturer: 'SAIL Solder Div', lfGrade: 'Sn-Cu3 High Strength', application: 'Adani Solar Panel String', purityPercent: 98.4, meltTempC: 225, investmentCr: 360, status: 'Delivered', priority: 'Medium', origin: 'SAIL Rourkela (OD)', destination: 'Adani Mundra (GJ)', shipDate: '2026-07-28', transitDays: 4, zone: 'East', remarks: 'Sn-Cu3 high-strength lead-free solder for Adani solar panel PV string soldering and junction box connection &#8594; 3% Cu &#8594; &#8377;360Cr for 1,000 tonnes &#8594; India &#8377;2,200Cr LF solar &#8594; Adani 10GW panels &#8594; 225&#176;C &#8594; &#8594; Ribbon &#8594; &#8594; SnCu3 &#8594; &#8594; Solar' },
];

export default function LeadFreeSolderLogisticsView() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterZone, setFilterZone] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Plug },
    { id: 'registry', label: 'Registry', icon: Plug },
    { id: 'analytics', label: 'Analytics', icon: Plug },
    { id: 'insights', label: 'Insights', icon: Plug },
  ];

  const filteredRecords = useMemo(() => {
    return leadFreeSolderRecords.filter((r) => {
      const matchSearch = searchTerm === '' ||
        r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.batchNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.lfGrade.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.application.toLowerCase().includes(searchTerm.toLowerCase());
      const matchZone = filterZone === 'all' || r.zone === filterZone;
      const matchStatus = filterStatus === 'all' || r.status === filterStatus;
      return matchSearch && matchZone && matchStatus;
    });
  }, [searchTerm, filterZone, filterStatus]);

  const zones = useMemo(() => {
    const zMap: Record<string, number> = {};
    leadFreeSolderRecords.forEach((r) => { zMap[r.zone] = (zMap[r.zone] || 0) + 1; });
    return Object.entries(zMap).sort((a, b) => b[1] - a[1]);
  }, []);

  const kpiData = useMemo(() => {
    const total = leadFreeSolderRecords.reduce((s: number, r) => s + r.investmentCr, 0);
    const avgPurity = leadFreeSolderRecords.reduce((s: number, r) => s + r.purityPercent, 0) / leadFreeSolderRecords.length;
    const delayed = leadFreeSolderRecords.filter((r) => r.status === 'Delayed').length;
    const critical = leadFreeSolderRecords.filter((r) => r.priority === 'Critical').length;
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

  const themeColor = '#059669';
  return (
    <div className="space-y-6 p-6">
      <PageHeader title="Lead-Free Solder Logistics" description="Indian lead-free solder (Sn-Ag-Cu, Sn-Bi, Sn-Zn) electronics, automotive, aerospace and medical supply chain tracking across 14 grades" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-emerald-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-emerald-600">{kpiData.total.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground mt-1">Total Investment</div></CardContent></Card>
        <Card className="border-l-4 border-l-emerald-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-emerald-600">{kpiData.avgPurity}%</div><div className="text-xs text-muted-foreground mt-1">Avg Purity</div></CardContent></Card>
        <Card className="border-l-4 border-l-emerald-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-emerald-600">{kpiData.delayed}</div><div className="text-xs text-muted-foreground mt-1">Delayed Batches</div></CardContent></Card>
        <Card className="border-l-4 border-l-emerald-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-emerald-600">{kpiData.critical}</div><div className="text-xs text-muted-foreground mt-1">Critical Records</div></CardContent></Card>
      </div>
      <div className="flex flex-wrap gap-2 border-b pb-2">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 rounded-t-md text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-emerald-500 text-white shadow-md' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
            {tab.label}
          </button>
        ))}
      </div>
      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-base">Zone Distribution</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">{zones.map(([zone, count]) => { const pct = (count as number / leadFreeSolderRecords.length) * 100; return <div key={zone} className="flex items-center gap-2"><span className="text-xs w-16 text-muted-foreground">{zone as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium w-8">{count as number}</span></div>; })}</div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Status Overview</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-2 gap-3">
              {['Delivered', 'In Transit', 'Delayed', 'Processing'].map((s) => { const c = leadFreeSolderRecords.filter((r) => r.status === s).length; return <div key={s} className={`text-center p-3 rounded-lg border ${statusColor(s)}`}><div className="text-lg font-bold">{c}</div><div className="text-xs">{s}</div></div>; })}
            </div>
          </CardContent></Card>
          <Card className="lg:col-span-2"><CardHeader><CardTitle className="text-base">Investment by Grade (Top 8)</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {leadFreeSolderRecords.slice(0, 8).map((r) => <div key={r.id} className="text-center p-3 rounded-lg border bg-muted/30"><div className="text-sm font-medium truncate">{r.lfGrade}</div><div className="text-lg font-bold" style={{ color: themeColor }}>&#8377;{r.investmentCr}Cr</div><div className="text-xs text-muted-foreground">{r.application}</div></div>)}
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
                    <div className="flex justify-between"><span className="text-muted-foreground">Grade:</span><span className="font-medium">{record.lfGrade}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Application:</span><span className="font-medium">{record.application}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Purity:</span><span className="font-medium">{record.purityPercent}%</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Melt Temp:</span><span className="font-medium">{record.meltTempC}&#176;C</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Investment:</span><span className="font-medium" style={{ color: themeColor }}>&#8377;{record.investmentCr}Cr</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">City:</span><span className="font-medium">{record.city}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Route:</span><span className="font-medium text-xs">{record.origin} &#8594; {record.destination}</span></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-sm text-muted-foreground">Showing {filteredRecords.length} of {leadFreeSolderRecords.length} records</div>
        </div>
      )}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-base">Manufacturer Performance</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">
              {(() => { const mfrMap: Record<string, number> = {}; leadFreeSolderRecords.forEach((r) => { mfrMap[r.manufacturer] = (mfrMap[r.manufacturer] || 0) + r.investmentCr; }); return Object.entries(mfrMap).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([mfr, inv]) => { const pct = (inv as number / kpiData.total) * 100; return <div key={mfr} className="flex items-center gap-2"><span className="text-xs w-40 truncate">{mfr as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">&#8377;{inv as number}Cr</span></div>; }); })()}
            </div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Priority Distribution</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-2 gap-3">
              {['Critical', 'High', 'Medium', 'Low'].map((p) => { const c = leadFreeSolderRecords.filter((r) => r.priority === p).length; return <div key={p} className={`text-center p-3 rounded-lg border ${priorityColor(p)}`}><div className="text-lg font-bold">{c}</div><div className="text-xs">{p}</div></div>; })}
            </div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Investment by Zone</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">{(() => { const zInv: Record<string, number> = {}; leadFreeSolderRecords.forEach((r) => { zInv[r.zone] = (zInv[r.zone] || 0) + r.investmentCr; }); return Object.entries(zInv).sort((a, b) => b[1] - a[1]).map(([zone, inv]) => { const pct = (inv as number / kpiData.total) * 100; return <div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">&#8377;{inv as number}Cr</span></div>; }); })()}</div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Purity Distribution</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">
              {(() => { const ranges = { '99%+': 0, '95-98.9%': 0, '90-94.9%': 0, '<90%': 0 }; leadFreeSolderRecords.forEach((r) => { if (r.purityPercent >= 99) ranges['99%+']++; else if (r.purityPercent >= 95) ranges['95-98.9%']++; else if (r.purityPercent >= 90) ranges['90-94.9%']++; else ranges['<90%']++; }); return (Object.entries(ranges) as [string, number][]).filter(([, v]) => v > 0).map(([range, count]) => { const pct = (count / leadFreeSolderRecords.length) * 100; return <div key={range} className="flex items-center gap-2"><span className="text-xs w-24">{range}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">{count}</span></div>; }); })()}
            </div>
          </CardContent></Card>
        </div>
      )}
      {activeTab === 'insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-base">Supply Chain Intelligence</CardTitle></CardHeader><CardContent><div className="space-y-3 text-sm">
            <div className="p-3 rounded-lg border-l-4 border-l-emerald-500 bg-emerald-50/50"><div className="font-medium">Aerospace &amp; Defense Electronics</div><div className="text-xs text-muted-foreground mt-1">ISRO satellite BGA &#8594; DRDO Nirbhay missile PCB &#8594; BEL sonar processing unit driving &#8594; &#8377;2,500Cr combined &#8594; RoHS compliance critical</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-emerald-500 bg-emerald-50/50"><div className="font-medium">EV &amp; Automotive Transition</div><div className="text-xs text-muted-foreground mt-1">Mahindra XUV400 EV inverter &#8594; Bajaj ECU module &#8594; Tata PLC automation driving &#8594; &#8377;1,560Cr combined &#8594; lead-free mandate push</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-emerald-500 bg-emerald-50/50"><div className="font-medium">Telecom &amp; IT Infrastructure</div><div className="text-xs text-muted-foreground mt-1">Jio 5G antenna PCB &#8594; Wipro server motherboard &#8594; Godrej AC PCB &#8594; &#8377;1,380Cr combined &#8594; digital India backbone</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-emerald-500 bg-emerald-50/50"><div className="font-medium">Monsoon Disruption Alert</div><div className="text-xs text-muted-foreground mt-1">LFS-B2412 GRSE Project 75I sonar PCB delayed &#8594; monsoon Visakhapatnam port congestion &#8594; submarine electronics timeline at risk</div></div>
          </div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Investment Landscape</CardTitle></CardHeader><CardContent><div className="space-y-3 text-sm">
            <div className="p-3 rounded-lg border-l-4 border-l-emerald-500 bg-emerald-50/50"><div className="font-medium">Total Portfolio: &#8377;{kpiData.total.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground mt-1">Across 14 lead-free solder grades spanning aerospace, defense, auto EV, telecom, IT, medical, industrial and solar &#8594; avg purity {kpiData.avgPurity}%</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-emerald-500 bg-emerald-50/50"><div className="font-medium">Critical Priority: 5 Records</div><div className="text-xs text-muted-foreground mt-1">ISRO satellite &#8594; DRDO missile &#8594; Mahindra EV &#8594; GRSE submarine &#8594; BEL cruise missile &#8594; national security supply chain</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-emerald-500 bg-emerald-50/50"><div className="font-medium">Top Manufacturers</div><div className="text-xs text-muted-foreground mt-1">Hindustan Solder &#8594; DRDO &#8594; Sterlite lead volume &#8594; Bharat Electronics &#8594; L&amp;T &#8594; Mahindra drive application-specific</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-emerald-500 bg-emerald-50/50"><div className="font-medium">RoHS &amp; EU Compliance Push</div><div className="text-xs text-muted-foreground mt-1">India RoHS 2026 enforcement driving SAC305 adoption &#8594; Sn-Bi58 low-temp niche &#8594; Sn-Zn cost-effective &#8594; export market access</div></div>
          </div></CardContent></Card>
        </div>
      )}
    </div>
  );
}
