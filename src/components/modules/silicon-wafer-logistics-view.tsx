"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared';
import { Cpu } from 'lucide-react';

interface SiliconWaferRecord {
  id: string; batchNo: string; city: string; manufacturer: string; grade: string;
  application: string; purityPercent: number; specProp: number; investmentCr: number;
  status: string; priority: string; origin: string; destination: string;
  shipDate: string; transitDays: number; zone: string; remarks: string;
};

const siliconwaferRecords: SiliconWaferRecord[] = [
  { id: 'SIW-0001', batchNo: 'SIW-B2401', city: 'Bengaluru', manufacturer: 'SCL Mohali', grade: 'Si 300mm SOI Wafer', application: 'DRDO AGNI-7 Avionics MCU', purityPercent: 99.9999, specProp: 300, investmentCr: 940, status: 'Delivered', priority: 'Critical', origin: 'SCL Mohali (PB)', destination: 'DRDO Hyderabad (TG)', shipDate: '2026-07-15', transitDays: 1, zone: 'South', remarks: 'Si 300mm SOI wafer for DRDO AGNI-7 navigation avionics MCU fab &amp;#8594; 300mm &amp;#8594; &amp;#8377;940Cr for 50K wafers &amp;#8594; India &amp;#8377;8,200Cr Si semi &amp;#8594; DRDO 100 missiles &amp;#8594; 99.9999% 6N &amp;#8594; &amp;#8594; Wafer &amp;#8594; &amp;#8594; SiSOI &amp;#8594; &amp;#8594; Defense' },
  { id: 'SIW-0002', batchNo: 'SIW-B2402', city: 'Hyderabad', manufacturer: 'Tata Electronics', grade: 'Si 200mm CMOS Wafer', application: 'BEL AESA Radar TR Module', purityPercent: 99.9999, specProp: 200, investmentCr: 860, status: 'In Transit', priority: 'Critical', origin: 'Tata Elec Hosur (TN)', destination: 'BEL Bengaluru (KA)', shipDate: '2026-07-16', transitDays: 2, zone: 'South', remarks: 'Si 200mm CMOS wafer for BEL AESA radar T/R module GaN-on-Si fab &amp;#8594; 200mm &amp;#8594; &amp;#8377;860Cr for 80K wafers &amp;#8594; India &amp;#8377;7,400Cr Si radar &amp;#8594; BEL 20 radars &amp;#8594; 99.9999% 6N &amp;#8594; &amp;#8594; Wafer &amp;#8594; &amp;#8594; SiCMOS &amp;#8594; &amp;#8594; Aerospace' },
  { id: 'SIW-0003', batchNo: 'SIW-B2403', city: 'Pune', manufacturer: 'ISRO Semiconductor', grade: 'Si 200mm Rad-Hard Wafer', application: 'ISRO Gaganyaan Flight Computer', purityPercent: 99.9999, specProp: 200, investmentCr: 920, status: 'Delivered', priority: 'Critical', origin: 'ISRO Bengaluru (KA)', destination: 'ISRO Thiruvananthapuram (KL)', shipDate: '2026-07-17', transitDays: 3, zone: 'West', remarks: 'Si 200mm rad-hard wafer for ISRO Gaganyaan flight computer radiation-hard fab &amp;#8594; 200mm &amp;#8594; &amp;#8377;920Cr for 30K wafers &amp;#8594; India &amp;#8377;7,800Cr Si space &amp;#8594; ISRO 4 missions &amp;#8594; 99.9999% 6N &amp;#8594; &amp;#8594; Wafer &amp;#8594; &amp;#8594; SiRad &amp;#8594; &amp;#8594; Space' },
  { id: 'SIW-0004', batchNo: 'SIW-B2404', city: 'Gandhinagar', manufacturer: 'IITB Nanofab', grade: 'Si 150mm MEMS Wafer', application: 'DRDO Lavly Nav MEMS Gyro', purityPercent: 99.999, specProp: 150, investmentCr: 680, status: 'Delivered', priority: 'High', origin: 'IITB Mumbai (MH)', destination: 'DRDO Bangalore (KA)', shipDate: '2026-07-18', transitDays: 4, zone: 'West', remarks: 'Si 150mm MEMS wafer for DRDO Lavly navigation MEMS gyroscope sensor fab &amp;#8594; 150mm &amp;#8594; &amp;#8377;680Cr for 100K wafers &amp;#8594; India &amp;#8377;5,200Cr Si MEMS &amp;#8594; DRDO 500 units &amp;#8594; 99.999% 5N &amp;#8594; &amp;#8594; Wafer &amp;#8594; &amp;#8594; SiMEMS &amp;#8594; &amp;#8594; Defense' },
  { id: 'SIW-0005', batchNo: 'SIW-B2405', city: 'Chennai', manufacturer: 'ITES Chennai', grade: 'Si 300mm Power MOSFET', application: 'BHEL 800MW GT Inverter', purityPercent: 99.9999, specProp: 300, investmentCr: 780, status: 'In Transit', priority: 'High', origin: 'ITES Chennai (TN)', destination: 'BHEL Hyderabad (TG)', shipDate: '2026-07-19', transitDays: 5, zone: 'South', remarks: 'Si 300mm power MOSFET wafer for BHEL 800MW GT grid inverter module &amp;#8594; 300mm &amp;#8594; &amp;#8377;780Cr for 40K wafers &amp;#8594; India &amp;#8377;5,800Cr Si power &amp;#8594; BHEL 20 GTs &amp;#8594; 99.9999% 6N &amp;#8594; &amp;#8594; Wafer &amp;#8594; &amp;#8594; SiMOS &amp;#8594; &amp;#8594; Power' },
  { id: 'SIW-0006', batchNo: 'SIW-B2406', city: 'Mumbai', manufacturer: 'L&amp;T Semiconductor', grade: 'Si 200mm IGBT Wafer', application: 'Adani Solar Inverter', purityPercent: 99.9999, specProp: 200, investmentCr: 640, status: 'Delivered', priority: 'High', origin: 'L&amp;T Mumbai (MH)', destination: 'Adani Mumbai (MH)', shipDate: '2026-07-20', transitDays: 1, zone: 'West', remarks: 'Si 200mm IGBT wafer for Adani 5MW solar farm string inverter module &amp;#8594; 200mm &amp;#8594; &amp;#8377;640Cr for 60K wafers &amp;#8594; India &amp;#8377;4,600Cr Si solar &amp;#8594; Adani 10 GW &amp;#8594; 99.9999% 6N &amp;#8594; &amp;#8594; Wafer &amp;#8594; &amp;#8594; SiIGBT &amp;#8594; &amp;#8594; Solar' },
  { id: 'SIW-0007', batchNo: 'SIW-B2407', city: 'Noida', manufacturer: 'Dixon Technologies', grade: 'Si 200mm LED Driver Wafer', application: 'Dixon LED Display Panel Driver', purityPercent: 99.999, specProp: 200, investmentCr: 420, status: 'Delivered', priority: 'Medium', origin: 'Dixon Noida (UP)', destination: 'Samsung Noida (UP)', shipDate: '2026-07-21', transitDays: 2, zone: 'North', remarks: 'Si 200mm LED driver wafer for Dixon smart TV LED display panel driver IC &amp;#8594; 200mm &amp;#8594; &amp;#8377;420Cr for 100K wafers &amp;#8594; India &amp;#8377;3,000Cr Si consumer &amp;#8594; Dixon 5M panels &amp;#8594; 99.999% 5N &amp;#8594; &amp;#8594; Wafer &amp;#8594; &amp;#8594; SiLED &amp;#8594; &amp;#8594; Consumer' },
  { id: 'SIW-0008', batchNo: 'SIW-B2408', city: 'Kolkata', manufacturer: 'Webel Electronics', grade: 'Si 150mm Sensor Wafer', application: 'Indian Railways IoT Track Sensor', purityPercent: 99.99, specProp: 150, investmentCr: 380, status: 'Delivered', priority: 'Medium', origin: 'Webel Kolkata (WB)', destination: 'IRISET Secunderabad (TG)', shipDate: '2026-07-22', transitDays: 3, zone: 'East', remarks: 'Si 150mm sensor wafer for Indian Railways IoT track vibration sensor node &amp;#8594; 150mm &amp;#8594; &amp;#8377;380Cr for 120K wafers &amp;#8594; India &amp;#8377;2,600Cr Si rail &amp;#8594; IR 100K sensors &amp;#8594; 99.99% 4N &amp;#8594; &amp;#8594; Wafer &amp;#8594; &amp;#8594; SiSensor &amp;#8594; &amp;#8594; Rail' },
  { id: 'SIW-0009', batchNo: 'SIW-B2409', city: 'Ahmedabad', manufacturer: 'eInfochips', grade: 'Si 300mm AI Accelerator', application: 'CDAC AI Supercomputer Chip', purityPercent: 99.9999, specProp: 300, investmentCr: 840, status: 'In Transit', priority: 'Critical', origin: 'eInfochips Ahmedabad (GJ)', destination: 'CDAC Pune (MH)', shipDate: '2026-07-23', transitDays: 4, zone: 'West', remarks: 'Si 300mm AI accelerator wafer for CDAC PARAM Siddhi AI supercomputer chip &amp;#8594; 300mm &amp;#8594; &amp;#8377;840Cr for 20K wafers &amp;#8594; India &amp;#8377;6,200Cr Si AI &amp;#8594; CDAC 10 systems &amp;#8594; 99.9999% 6N &amp;#8594; &amp;#8594; Wafer &amp;#8594; &amp;#8594; SiAI &amp;#8594; &amp;#8594; HPC' },
  { id: 'SIW-0010', batchNo: 'SIW-B2410', city: 'Thiruvananthapuram', manufacturer: 'VSSC ISRO', grade: 'Si 200mm Solar Cell Wafer', application: 'ISRO NexStar Solar Array', purityPercent: 99.9999, specProp: 200, investmentCr: 760, status: 'Delivered', priority: 'High', origin: 'VSSC Thiruvananthapuram (KL)', destination: 'ISRO Bengaluru (KA)', shipDate: '2026-07-24', transitDays: 5, zone: 'South', remarks: 'Si 200mm multi-junction solar cell wafer for ISRO NexStar satellite solar array &amp;#8594; 200mm &amp;#8594; &amp;#8377;760Cr for 40K wafers &amp;#8594; India &amp;#8377;5,400Cr Si solar cell &amp;#8594; ISRO 12 satellites &amp;#8594; 99.9999% 6N &amp;#8594; &amp;#8594; Wafer &amp;#8594; &amp;#8594; SiSolar &amp;#8594; &amp;#8594; Space' },
  { id: 'SIW-0011', batchNo: 'SIW-B2411', city: 'Guwahati', manufacturer: 'Assam Electronics', grade: 'Si 150mm Telecom RF Wafer', application: 'Jio 5G Small Cell Module', purityPercent: 99.99, specProp: 150, investmentCr: 360, status: 'Delivered', priority: 'Medium', origin: 'Assam Elec Guwahati (AS)', destination: 'Jio Mumbai (MH)', shipDate: '2026-07-25', transitDays: 1, zone: 'East', remarks: 'Si 150mm RF wafer for Jio 5G small cell baseband module RF front end &amp;#8594; 150mm &amp;#8594; &amp;#8377;360Cr for 80K wafers &amp;#8594; India &amp;#8377;2,400Cr Si telecom &amp;#8594; Jio 500K cells &amp;#8594; 99.99% 4N &amp;#8594; &amp;#8594; Wafer &amp;#8594; &amp;#8594; SiRF &amp;#8594; &amp;#8594; Telecom' },
  { id: 'SIW-0012', batchNo: 'SIW-B2412', city: 'Visakhapatnam', manufacturer: 'Naval Physics Lab', grade: 'Si 200mm Sonar DSP Wafer', application: 'GRSE Project 75I Sonar Processor', purityPercent: 99.9999, specProp: 200, investmentCr: 900, status: 'Delayed', priority: 'Critical', origin: 'NPL Visakhapatnam (AP)', destination: 'GRSE Kolkata (WB)', shipDate: '2026-07-26', transitDays: 2, zone: 'East', remarks: 'Si 200mm DSP wafer for GRSE Project 75I submarine bow sonar processor &amp;#8597; 200mm &amp;#8597; &amp;#8377;900Cr for 25K wafers &amp;#8597; India &amp;#8377;7,400Cr Si sonar &amp;#8597; GRSE 6 submarines &amp;#8597; 99.9999% 6N &amp;#8597; &amp;#8594; Wafer &amp;#8597; &amp;#8594; SiSonar &amp;#8597; &amp;#8594; Naval' },
  { id: 'SIW-0013', batchNo: 'SIW-B2413', city: 'Bengaluru', manufacturer: 'DRDO CEERI', grade: 'Si 300mm Crypto Engine', application: 'DRDO Nation Crypto Module', purityPercent: 99.9999, specProp: 300, investmentCr: 880, status: 'In Transit', priority: 'Critical', origin: 'DRDO Pilani (RJ)', destination: 'DRDO Delhi (DL)', shipDate: '2026-07-27', transitDays: 3, zone: 'North', remarks: 'Si 300mm crypto engine wafer for DRDO national secure communication crypto module &amp;#8594; 300mm &amp;#8594; &amp;#8377;880Cr for 15K wafers &amp;#8594; India &amp;#8377;6,400Cr Si crypto &amp;#8594; DRDO 2000 modules &amp;#8594; 99.9999% 6N &amp;#8594; &amp;#8594; Wafer &amp;#8594; &amp;#8594; SiCrypto &amp;#8594; &amp;#8594; Defense' },
  { id: 'SIW-0014', batchNo: 'SIW-B2414', city: 'Rourkela', manufacturer: 'SAIL Silicon', grade: 'Si 150mm Metallurgical', application: 'SAIL Rourkela Si Metal Production', purityPercent: 98.5, specProp: 150, investmentCr: 320, status: 'Delivered', priority: 'Low', origin: 'SAIL Rourkela (OD)', destination: 'Tata Steel Jamshedpur (JH)', shipDate: '2026-07-28', transitDays: 4, zone: 'East', remarks: 'Si 150mm metallurgical-grade for SAIL silicon metal smelting silicon alloy production &amp;#8594; 150mm &amp;#8594; &amp;#8377;320Cr for 200K wafers &amp;#8594; India &amp;#8377;2,200Cr Si metallurgical &amp;#8594; SAIL 100K tonnes &amp;#8594; 98.5% &amp;#8594; &amp;#8594; Ingot &amp;#8594; &amp;#8594; SiMetal &amp;#8594; &amp;#8594; Steel' },
];

export default function SiliconWaferLogisticsView() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterZone, setFilterZone] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Cpu },
    { id: 'registry', label: 'Registry', icon: Cpu },
    { id: 'analytics', label: 'Analytics', icon: Cpu },
    { id: 'insights', label: 'Insights', icon: Cpu },
  ];

  const filteredRecords = useMemo(() => {
    return siliconwaferRecords.filter((r) => {
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
    siliconwaferRecords.forEach((r) => { zMap[r.zone] = (zMap[r.zone] || 0) + 1; });
    return Object.entries(zMap).sort((a, b) => b[1] - a[1]);
  }, []);

  const kpiData = useMemo(() => {
    const total = siliconwaferRecords.reduce((s: number, r) => s + r.investmentCr, 0);
    const avgPurity = siliconwaferRecords.reduce((s: number, r) => s + r.purityPercent, 0) / siliconwaferRecords.length;
    const delayed = siliconwaferRecords.filter((r) => r.status === 'Delayed').length;
    const critical = siliconwaferRecords.filter((r) => r.priority === 'Critical').length;
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

  const themeColor = '#0891b2';
  return (
    <div className="space-y-6 p-6">
      <PageHeader title="Silicon Wafer Logistics" description="Indian silicon wafer logistics supply chain tracking across 14 grades spanning aerospace, defense, semiconductor, nuclear and industrial sectors" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-cyan-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-cyan-600">{kpiData.total.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground mt-1">Total Investment</div></CardContent></Card>
        <Card className="border-l-4 border-l-cyan-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-cyan-600">{kpiData.avgPurity}%</div><div className="text-xs text-muted-foreground mt-1">Avg Purity</div></CardContent></Card>
        <Card className="border-l-4 border-l-cyan-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-cyan-600">{kpiData.delayed}</div><div className="text-xs text-muted-foreground mt-1">Delayed Batches</div></CardContent></Card>
        <Card className="border-l-4 border-l-cyan-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-cyan-600">{kpiData.critical}</div><div className="text-xs text-muted-foreground mt-1">Critical Records</div></CardContent></Card>
      </div>
      <div className="flex flex-wrap gap-2 border-b pb-2">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 rounded-t-md text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-cyan-500 text-white shadow-md' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
            {tab.label}
          </button>
        ))}
      </div>
      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-base">Zone Distribution</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">{zones.map(([zone, count]) => { const pct = (count as number / siliconwaferRecords.length) * 100; return <div key={zone} className="flex items-center gap-2"><span className="text-xs w-16 text-muted-foreground">{zone as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium w-8">{count as number}</span></div>; })}</div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Status Overview</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-2 gap-3">
              {['Delivered', 'In Transit', 'Delayed', 'Processing'].map((s) => { const c = siliconwaferRecords.filter((r) => r.status === s).length; return <div key={s} className={`text-center p-3 rounded-lg border ${statusColor(s)}`}><div className="text-lg font-bold">{c}</div><div className="text-xs">{s}</div></div>; })}
            </div>
          </CardContent></Card>
          <Card className="lg:col-span-2"><CardHeader><CardTitle className="text-base">Investment by Grade (Top 8)</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {siliconwaferRecords.slice(0, 8).map((r) => <div key={r.id} className="text-center p-3 rounded-lg border bg-muted/30"><div className="text-sm font-medium truncate">{r.grade}</div><div className="text-lg font-bold" style={{ color: themeColor }}>&#8377;{r.investmentCr}Cr</div><div className="text-xs text-muted-foreground">{r.application}</div></div>)}
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
                    <div className="flex justify-between"><span className="text-muted-foreground">Wafer Diameter (mm)</span><span className="font-medium">{record.specProp}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Investment:</span><span className="font-medium" style={{ color: themeColor }}>&#8377;{record.investmentCr}Cr</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">City:</span><span className="font-medium">{record.city}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Route:</span><span className="font-medium text-xs">{record.origin} &#8594; {record.destination}</span></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-sm text-muted-foreground">Showing {filteredRecords.length} of {siliconwaferRecords.length} records</div>
        </div>
      )}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-base">Manufacturer Performance</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">
              {(() => { const mfrMap: Record<string, number> = {}; siliconwaferRecords.forEach((r) => { mfrMap[r.manufacturer] = (mfrMap[r.manufacturer] || 0) + r.investmentCr; }); return Object.entries(mfrMap).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([mfr, inv]) => { const pct = (inv as number / kpiData.total) * 100; return <div key={mfr} className="flex items-center gap-2"><span className="text-xs w-40 truncate">{mfr as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">&#8377;{inv as number}Cr</span></div>; }); })()}
            </div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Priority Distribution</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-2 gap-3">
              {['Critical', 'High', 'Medium', 'Low'].map((p) => { const c = siliconwaferRecords.filter((r) => r.priority === p).length; return <div key={p} className={`text-center p-3 rounded-lg border ${priorityColor(p)}`}><div className="text-lg font-bold">{c}</div><div className="text-xs">{p}</div></div>; })}
            </div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Investment by Zone</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">{(() => { const zInv: Record<string, number> = {}; siliconwaferRecords.forEach((r) => { zInv[r.zone] = (zInv[r.zone] || 0) + r.investmentCr; }); return Object.entries(zInv).sort((a, b) => b[1] - a[1]).map(([zone, inv]) => { const pct = (inv as number / kpiData.total) * 100; return <div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">&#8377;{inv as number}Cr</span></div>; }); })()}</div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Purity Distribution</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">
              {(() => { const ranges = { '99%+': 0, '95-98.9%': 0, '90-94.9%': 0, '<90%': 0 }; siliconwaferRecords.forEach((r) => { if (r.purityPercent >= 99) ranges['99%+']++; else if (r.purityPercent >= 95) ranges['95-98.9%']++; else if (r.purityPercent >= 90) ranges['90-94.9%']++; else ranges['<90%']++; }); return (Object.entries(ranges) as [string, number][]).filter(([, v]) => v > 0).map(([range, count]) => { const pct = (count / siliconwaferRecords.length) * 100; return <div key={range} className="flex items-center gap-2"><span className="text-xs w-24">{range}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">{count}</span></div>; }); })()}
            </div>
          </CardContent></Card>
        </div>
      )}
      {activeTab === 'insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-base">Supply Chain Intelligence</CardTitle></CardHeader><CardContent><div className="space-y-3 text-sm">
            <div className="p-3 rounded-lg border-l-4 border-l-cyan-500 bg-cyan-50/50"><div className="font-medium">Strategic Semiconductor Sovereignty</div><div className="text-xs text-muted-foreground mt-1">DRDO AGNI-7 MCU &#8594; BEL AESA radar &#8594; DRDO crypto engine &#8594; &#8377;2,680Cr combined &#8594; national security fabs</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-cyan-500 bg-cyan-50/50"><div className="font-medium">Space &amp; AI Computing</div><div className="text-xs text-muted-foreground mt-1">ISRO Gaganyaan flight computer &#8594; ISRO solar array &#8594; CDAC AI supercomputer &#8594; &#8377;2,440Cr combined &#8594; critical infrastructure</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-cyan-500 bg-cyan-50/50"><div className="font-medium">Industrial &amp; Consumer Scale</div><div className="text-xs text-muted-foreground mt-1">BHEL GT inverter &#8594; Adani solar &#8594; Dixon LED &#8594; Jio 5G &#8594; &#8377;2,200Cr combined &#8594; volume production</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-cyan-500 bg-cyan-50/50"><div className="font-medium">Monsoon Alert</div><div className="text-xs text-muted-foreground mt-1">SIW-B2412 GRSE submarine sonar DSP delayed &#8594; monsoon Visakhapatnam &#8594; submarine programme at risk</div></div>
          </div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Investment Landscape</CardTitle></CardHeader><CardContent><div className="space-y-3 text-sm">
            <div className="p-3 rounded-lg border-l-4 border-l-cyan-500 bg-cyan-50/50"><div className="font-medium">Total Portfolio: &#8377;8,760 Cr</div><div className="text-xs text-muted-foreground mt-1">Across 14 Si wafer grades spanning defense, aerospace, space, power, solar, AI, telecom, naval &#8594; avg purity 99.997% (4N-6N)</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-cyan-500 bg-cyan-50/50"><div className="font-medium">Critical Priority: 7 Records</div><div className="text-xs text-muted-foreground mt-1">DRDO AGNI-7 &#8594; BEL AESA &#8594; ISRO Gaganyaan &#8594; CDAC AI &#8594; GRSE sonar &#8594; DRDO crypto &#8594; ISRO solar</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-cyan-500 bg-cyan-50/50"><div className="font-medium">Top Manufacturers</div><div className="text-xs text-muted-foreground mt-1">SCL &#8594; Tata Electronics &#8594; ISRO &#8594; IITB &#8594; L&amp;T &#8594; eInfochips &#8594; BHEL</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-cyan-500 bg-cyan-50/50"><div className="font-medium">Wafer Size Distribution</div><div className="text-xs text-muted-foreground mt-1">300mm (SOI, AI, Crypto, Power MOSFET) &#8594; 200mm (CMOS, Rad-Hard, IGBT, Solar, RF) &#8594; 150mm (MEMS, Sensor, Telecom, Metallurgical)</div></div>
          </div></CardContent></Card>
        </div>
      )}
    </div>
  );
}
